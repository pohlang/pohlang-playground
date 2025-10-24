const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

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
    fs.writeFileSync(filePath, code, 'utf8');

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
        // Minimal: just run for now. Future: compile to pbc, then disassemble.
        args = ['--run', filePath];
        break;
      default:
        args = ['--run', filePath];
    }

    const started = Date.now();
    const child = spawn(bin, args, { shell: true });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));

    child.on('error', (err) => {
      resolve({ ok: false, error: err.message, stdout, stderr, exitCode: -1, ms: Date.now() - started });
    });

    child.on('close', (code) => {
      resolve({ ok: code === 0, stdout, stderr, exitCode: code, ms: Date.now() - started });
    });
  });
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

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
  const file = path.join(examplesDir, req.params.name);
  try {
    const code = fs.readFileSync(file, 'utf8');
    res.type('text/plain').send(code);
  } catch (e) {
    res.status(404).json({ ok: false, error: 'Example not found' });
  }
});

app.post('/api/run', async (req, res) => {
  const { code, mode } = req.body || {};
  if (typeof code !== 'string' || code.length === 0) {
    res.status(400).json({ ok: false, error: 'Missing code' });
    return;
  }
  const result = await runPohlang(code, mode || 'run');
  res.json(result);
});

// Fallback to index.html for SPA-like routing
app.get('*', (req, res) => {
  res.sendFile(path.join(WEB_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(PohLang Playground running on http://localhost:);
});
