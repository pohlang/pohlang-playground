# PohLang Playground

A friendly, local playground for experimenting with PohLang code. Includes a web UI, a lightweight run API, and curated examples.

## Features
- In-browser editor with run button
- Executes PohLang by invoking the pohlang CLI
- Example gallery (hello, control flow, lists, dicts, functions)
- Single Node.js server serves both the API and static UI

## Requirements
- PohLang CLI (pohlang/pohlang.exe) available in PATH, or set POHLANG_BIN env var to its full path
- Node.js 18+ (for the server)

## Quickstart
`powershell
cd "C:\Users\habib\POHLANG\Pohlang-PlayGround\server"
npm install
npm start
# Open http://localhost:5173
`

If pohlang isn’t in PATH:
`powershell
 = "C:\\Users\\habib\\POHLANG\\POHLANG\\target\\debug\\pohlang.exe"  # example
npm start
`

## API
- POST /api/run → { code: string, mode?: 'run' | 'bytecode' | 'disassemble' }
- GET  /api/examples → list of example files
- GET  /api/examples/:name → raw .poh source

## Notes
- Output is captured from stdout/stderr of the CLI.
- For streaming output or collaboration, a future iteration can add SSE/WebSocket and multi-user sessions.

## Cloudflare Pages Deployment

There are two options:

- Static-only (no run): Deploy `web/` as a Pages site. Users can browse examples, but Run requires a backend.
- Pages Functions proxy (recommended now): Add a Pages Function at `functions/api/run.js` that forwards to a remote runner.

Steps:
1) Create a Pages project `pohlang-playground` and connect this repo.
2) Build output directory: `web`. Pages Functions folder auto-detected at `functions/`.
3) In Pages project Settings → Variables, add `RUNNER_ORIGIN` pointing to a reachable Node runner (e.g. `https://your-runner.example.com`).
4) Deploy. The UI calls `/api/run` which your Function proxies to the runner.

Future option: In-browser runner via WebAssembly (compile the PohLang VM to WASM) to remove the remote runner entirely.
