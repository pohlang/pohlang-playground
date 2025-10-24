require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;
const EXEC_TIMEOUT = parseInt(process.env.EXEC_TIMEOUT_MS) || 10000;
const MAX_CODE_SIZE = parseInt(process.env.MAX_CODE_SIZE_BYTES) || 1048576;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : '*';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: `${MAX_CODE_SIZE}b` }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 30,
  message: { ok: false, error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/run', limiter);

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

const WEB_DIR = path.join(__dirname, '..', 'web');
app.use(express.static(WEB_DIR));

function resolvePohlangBin() {
  if (process.env.POHLANG_BIN) return process.env.POHLANG_BIN;
  const isWin = process.platform === 'win32';
  return isWin ? 'pohlang.exe' : 'pohlang';
}

function runPohlang(code, mode = 'run') {
  return new Promise((resolve) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pohlang-'));
    const filePath = path.join(tmpDir, 'playground.poh');
    
    try {
      fs.writeFileSync(filePath, code, 'utf8');
    } catch (err) {
      resolve({ ok: false, error: 'Failed to write temporary file', stdout: '', stderr: '', exitCode: -1, ms: 0 });
      return;
    }

    const bin = resolvePohlangBin();
    let args = [];
    switch (mode) {
      case 'run':
        args = ['--run', filePath];
        break;
      case 'bytecode':
        args = ['--bytecode', filePath];
        break;
      case 'disassemble':
        args = ['--run', filePath]; // Future: support disassemble mode
        break;
      default:
        args = ['--run', filePath];
    }

    const started = Date.now();
    const child = spawn(bin, args, { shell: true });

    let stdout = '';
    let stderr = '';
    let killed = false;

    // Timeout handler
    const timeout = setTimeout(() => {
      killed = true;
      child.kill('SIGTERM');
      
      // Force kill if still running after 1 second
      setTimeout(() => {
        if (!child.killed) {
          child.kill('SIGKILL');
        }
      }, 1000);
      
      // Cleanup temp directory
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {
        console.error('Failed to cleanup temp dir:', e);
      }
      
      resolve({ 
        ok: false, 
        error: `Execution timeout (${EXEC_TIMEOUT}ms limit exceeded)`, 
        stdout, 
        stderr, 
        exitCode: -1, 
        ms: EXEC_TIMEOUT 
      });
    }, EXEC_TIMEOUT);

    child.stdout.on('data', (d) => {
      stdout += d.toString();
      // Limit output size to prevent memory issues
      if (stdout.length > 100000) {
        stdout = stdout.substring(0, 100000) + '\n... (output truncated)';
        child.kill('SIGTERM');
      }
    });

    child.stderr.on('data', (d) => {
      stderr += d.toString();
      if (stderr.length > 100000) {
        stderr = stderr.substring(0, 100000) + '\n... (output truncated)';
        child.kill('SIGTERM');
      }
    });

    child.on('error', (err) => {
      clearTimeout(timeout);
      
      // Cleanup
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {
        console.error('Failed to cleanup temp dir:', e);
      }
      
      resolve({ 
        ok: false, 
        error: err.message, 
        stdout, 
        stderr, 
        exitCode: -1, 
        ms: Date.now() - started 
      });
    });

    child.on('close', (code) => {
      if (killed) return; // Already handled by timeout
      
      clearTimeout(timeout);
      
      // Cleanup
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {
        console.error('Failed to cleanup temp dir:', e);
      }
      
      resolve({ 
        ok: code === 0, 
        stdout, 
        stderr, 
        exitCode: code, 
        ms: Date.now() - started 
      });
    });
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const bin = resolvePohlangBin();
  res.json({ 
    ok: true,
    version: '1.0.0',
    pohlang_bin: bin,
    node_version: process.version,
    uptime: process.uptime()
  });
});

// Examples endpoints
app.get('/api/examples', (req, res) => {
  const examplesDir = path.join(__dirname, '..', 'examples');
  try {
    const files = fs.readdirSync(examplesDir).filter((f) => f.endsWith('.poh'));
    res.json({ ok: true, files });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get('/api/examples/:name', (req, res) => {
  const examplesDir = path.join(__dirname, '..', 'examples');
  const fileName = path.basename(req.params.name); // Prevent directory traversal
  const file = path.join(examplesDir, fileName);
  
  // Security: ensure file is within examples directory
  if (!file.startsWith(examplesDir)) {
    res.status(403).json({ ok: false, error: 'Access denied' });
    return;
  }
  
  try {
    const code = fs.readFileSync(file, 'utf8');
    res.type('text/plain').send(code);
  } catch (e) {
    res.status(404).json({ ok: false, error: 'Example not found' });
  }
});

// Code execution endpoint
app.post('/api/run', async (req, res) => {
  const { code, mode } = req.body || {};
  
  // Validation
  if (typeof code !== 'string' || code.length === 0) {
    res.status(400).json({ ok: false, error: 'Missing or invalid code' });
    return;
  }
  
  if (code.length > MAX_CODE_SIZE) {
    res.status(413).json({ 
      ok: false, 
      error: `Code too large (max ${MAX_CODE_SIZE} bytes)` 
    });
    return;
  }
  
  const validModes = ['run', 'bytecode', 'disassemble'];
  if (mode && !validModes.includes(mode)) {
    res.status(400).json({ ok: false, error: 'Invalid mode' });
    return;
  }
  
  try {
    const result = await runPohlang(code, mode || 'run');
    res.json(result);
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Internal server error',
      stdout: '',
      stderr: String(error),
      exitCode: -1,
      ms: 0
    });
  }
});

// Fallback to index.html for SPA-like routing
app.get('*', (req, res) => {
  res.sendFile(path.join(WEB_DIR, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    ok: false, 
    error: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`╔═══════════════════════════════════════════╗`);
  console.log(`║   PohLang Runner Server                   ║`);
  console.log(`╠═══════════════════════════════════════════╣`);
  console.log(`║  Port: ${PORT.toString().padEnd(35)}║`);
  console.log(`║  PohLang: ${resolvePohlangBin().padEnd(31)}║`);
  console.log(`║  Timeout: ${(EXEC_TIMEOUT/1000).toString()}s${' '.repeat(32)}║`);
  console.log(`║  Rate Limit: ${(process.env.RATE_LIMIT_MAX_REQUESTS || 30).toString()} req/min${' '.repeat(23)}║`);
  console.log(`╚═══════════════════════════════════════════╝`);
  console.log(`\n🚀 Server ready at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});

