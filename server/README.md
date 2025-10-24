# PohLang Runner Server

Backend server that executes PohLang code for the playground.

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set `POHLANG_BIN` to your PohLang executable:

```bash
# Windows
POHLANG_BIN=C:\Users\habib\POHLANG\PohLang\runtime\target\debug\pohlang.exe

# Linux/Mac
POHLANG_BIN=/path/to/pohlang
```

### 3. Start Server

```bash
npm start
```

Server will run at `http://localhost:5173`

### 4. Test

```bash
curl -X POST http://localhost:5173/api/run \
  -H "Content-Type: application/json" \
  -d '{"code":"Start Program\nWrite \"Hello\"\nEnd Program"}'
```

## Production Deployment

See **[RUNNER_SETUP.md](../RUNNER_SETUP.md)** for detailed deployment guides.

## API Endpoints

### `GET /api/health`
Health check endpoint

**Response:**
```json
{
  "ok": true,
  "version": "1.0.0",
  "pohlang_bin": "/usr/local/bin/pohlang",
  "node_version": "v18.0.0",
  "uptime": 123.45
}
```

### `POST /api/run`
Execute PohLang code

**Request:**
```json
{
  "code": "Start Program\nWrite \"Hello\"\nEnd Program",
  "mode": "run"
}
```

**Response:**
```json
{
  "ok": true,
  "stdout": "Hello\n",
  "stderr": "",
  "exitCode": 0,
  "ms": 45
}
```

**Modes:**
- `run` - Execute code
- `bytecode` - Show bytecode
- `disassemble` - Show VM instructions

### `GET /api/examples`
List available examples

**Response:**
```json
{
  "ok": true,
  "files": ["hello.poh", "functions.poh", ...]
}
```

### `GET /api/examples/:name`
Get example code

**Response:** Plain text file content

## Configuration

Environment variables (`.env`):

```bash
# Server configuration
PORT=5173
NODE_ENV=production

# PohLang binary path
POHLANG_BIN=/usr/local/bin/pohlang

# Security
ALLOWED_ORIGINS=https://your-playground.pages.dev
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30

# Execution limits
EXEC_TIMEOUT_MS=10000
MAX_CODE_SIZE_BYTES=1048576
```

## Docker

Build and run with Docker:

```bash
# Build image
docker build -t pohlang-runner .

# Run container
docker run -p 8080:8080 pohlang-runner
```

Or use docker-compose:

```bash
docker-compose up
```

## Process Manager (PM2)

For production deployment with PM2:

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start ecosystem.config.js

# View status
pm2 status

# View logs
pm2 logs pohlang-runner

# Restart
pm2 restart pohlang-runner

# Stop
pm2 stop pohlang-runner
```

## Security Features

✅ **Rate Limiting** - 30 requests per minute per IP  
✅ **Execution Timeout** - 10 second limit  
✅ **Code Size Limit** - 1MB maximum  
✅ **Output Truncation** - Prevents memory issues  
✅ **Path Sanitization** - Prevents directory traversal  
✅ **CORS Control** - Configurable allowed origins  
✅ **Temp File Cleanup** - Automatic cleanup after execution  

## Monitoring

### Logs

Logs are printed to stdout/stderr. In production, use:

```bash
# PM2 logs
pm2 logs pohlang-runner

# Docker logs
docker logs container-name

# System logs (with PM2)
tail -f logs/out.log
tail -f logs/err.log
```

### Metrics

Monitor these endpoints:
- `/api/health` - Server health
- Check response times
- Monitor CPU/memory usage
- Track error rates

## Troubleshooting

### "ENOENT: no such file or directory"

**Problem:** PohLang binary not found

**Solution:**
```bash
# Check POHLANG_BIN is set correctly
echo $POHLANG_BIN

# Verify file exists
ls -la $POHLANG_BIN

# Make executable
chmod +x $POHLANG_BIN
```

### "spawn ENOMEM"

**Problem:** Out of memory

**Solution:**
- Increase server memory
- Lower `RATE_LIMIT_MAX_REQUESTS`
- Lower `EXEC_TIMEOUT_MS`

### "Too many requests"

**Problem:** Rate limit exceeded

**Solution:**
- Increase `RATE_LIMIT_MAX_REQUESTS`
- Increase `RATE_LIMIT_WINDOW_MS`
- Check for abuse/bots

## Development

### File Structure

```
server/
├── index.js              # Main server code
├── package.json          # Dependencies
├── Dockerfile            # Docker image
├── .dockerignore        # Docker ignore
├── ecosystem.config.js  # PM2 config
├── .env.example         # Environment template
└── README.md           # This file
```

### Adding Features

1. **New endpoint**: Add route in `index.js`
2. **New mode**: Update `runPohlang()` function
3. **New validation**: Add checks in `/api/run` handler

### Testing

```bash
# Test health
curl http://localhost:5173/api/health

# Test execution
curl -X POST http://localhost:5173/api/run \
  -H "Content-Type: application/json" \
  -d '{"code":"Start Program\nWrite \"Test\"\nEnd Program"}'

# Test examples
curl http://localhost:5173/api/examples
curl http://localhost:5173/api/examples/hello.poh
```

## License

MIT License - see LICENSE file for details

# Trigger deployment
# Add repo permission
# Add artifactregistry.repoAdmin permission
# Repository created successfully!
