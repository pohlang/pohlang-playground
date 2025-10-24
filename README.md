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
