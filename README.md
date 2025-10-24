# PohLang Playground 🌟# PohLang Playground



An interactive, browser-based playground for experimenting with **PohLang** - a programming language that reads like natural English! Perfect for beginners learning to code and experienced developers exploring a new paradigm.A friendly playground for experimenting with PohLang. Ships a  web UI, a local runner API, and example programs. Ready for Cloudflare Pages (static assets in `web/` + Pages Functions in `functions/`).



![PohLang Playground](https://img.shields.io/badge/PohLang-Playground-blue)## Features

- Editor with examples and Run (Ctrl/Cmd+Enter)

## ✨ Features- Modes: Run, Bytecode, Disassemble

- Copy output, reset editor, download `.poh`

### 🎨 Modern UI/UX- Local persistence (Ctrl/Cmd+S to save)

- **Welcome Screen** - Guided introduction for first-time users- Works locally via Node server, or hosted on Cloudflare Pages with a proxy function

- **Syntax Help Panel** - Quick reference accessible with `Ctrl/Cmd+H`

- **Smart Editor** - Auto-save, line count, character count## Requirements (local dev)

- **Responsive Design** - Works on desktop, tablet, and mobile- PohLang CLI in PATH (`pohlang`/`pohlang.exe`), or set `POHLANG_BIN`

- **Dark Theme** - Easy on the eyes for extended coding sessions- Node.js 18+



### 🚀 Functionality## Quickstart (local)

- **Multiple Execution Modes**```powershell

  - Run - Execute your codecd "C:\Users\habib\POHLANG\Pohlang-PlayGround\server"

  - Bytecode - View compiled bytecodenpm install

  - Disassemble - Inspect VM instructionsnpm start

- **Rich Examples** - 12+ examples covering basics to advanced topics# Open http://localhost:5173

- **Auto-save** - Your work persists in browser local storage```

- **Export/Import** - Download your code as `.poh` filesIf PohLang isn’t in PATH:

- **Keyboard Shortcuts** - Streamlined workflow```powershell

$env:POHLANG_BIN = "C:\\Users\\habib\\POHLANG\\POHLANG\\target\\debug\\pohlang.exe" # example

### 📚 Learning Resourcesnpm start

- Tutorial for absolute beginners```

- Examples: Hello World, Functions, Classes, Web Servers, Data Processing

- Inline syntax help panel## API (local server)

- Error messages with context- `POST /api/run` → `{ code: string, mode?: 'run'|'bytecode'|'disassemble' }`

- `GET /api/examples` → `{ files: string[] }`

## 🎯 Quick Start- `GET /api/examples/:name` → raw `.poh`



### Option 1: Use the Hosted Version (Recommended)The web UI also reads static examples from `web/examples/` so it can work without the examples API when hosted statically.

Visit: **[https://pohlang-playground.pages.dev](https://pohlang-playground.pages.dev)** *(coming soon)*

## Cloudflare Pages

### Option 2: Run LocallyTwo deployment options:

- Static-only: Deploy `web/` only. Examples work, Run requires a backend.

#### Prerequisites- Pages Functions proxy (recommended): Deploy with `functions/api/run.js` which forwards to your remote runner.

- **Node.js 18+** installed

- **PohLang CLI** in PATH or set `POHLANG_BIN` environment variableSteps (Cloudflare Pages UI):

1. Create a project (e.g. `pohlang-playground`) and connect this GitHub repo.

#### Steps2. Set Build command to “None”. Set Output directory to `web`.

```powershell3. Ensure `functions/` exists at repo root (auto-detected by Pages).

# Clone the repository4. In Pages → Settings → Variables, add env var `RUNNER_ORIGIN` pointing to your runner (e.g. `https://your-runner.example.com`).

git clone https://github.com/pohlang/Pohlang-PlayGround.git5. Deploy. The UI calls `/api/run`; the Function proxies to `RUNNER_ORIGIN`.

cd Pohlang-PlayGround

### Optional: Deploy via GitHub Actions

# Install dependenciesAdd the following secrets in the GitHub repo:

cd server- `CF_ACCOUNT_ID`: your Cloudflare account ID

npm install- `CF_API_TOKEN`: Pages write token



# Start the development serverThis repo includes `.github/workflows/cloudflare-pages.yml`. It deploys `web/` and Pages Functions in `functions/` when you push to `main`. Configure `projectName` if you use a different Pages project name.

npm start

## Future

# Open in browser- WASM-based in-browser runner (compile PohLang VM to WebAssembly) to remove the remote runner requirement.

# Navigate to http://localhost:5173
```

If PohLang isn't in your PATH:
```powershell
# Set the PohLang binary path
$env:POHLANG_BIN = "C:\path\to\pohlang.exe"
npm start
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+Enter` | Run code |
| `Ctrl/Cmd+S` | Save code locally |
| `Ctrl/Cmd+H` | Toggle syntax help |
| `Esc` | Close modal/panel |

## 📖 Example Code

### Hello World
```pohlang
Start Program
Write "Hello, World!"
End Program
```

### Functions
```pohlang
Start Program

Make greet with name:
    Write "Hello, " + name + "!"
End

Use greet with "Alice"
Use greet with "Bob"

End Program
```

### Web Server
```pohlang
Start Program

Create web server on port 8080

Add route "/" with:
    Write html response "<h1>Welcome!</h1>"

Start server

End Program
```

## 🚀 Deployment to Cloudflare Pages

### Prerequisites
- Cloudflare account
- GitHub repository connected to Cloudflare Pages

### Method 1: Cloudflare Dashboard (Easiest)

1. **Create a Pages Project**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
   - Click "Create a project"
   - Connect your GitHub repository
   - Select the `Pohlang-PlayGround` repository

2. **Configure Build Settings**
   - **Build command**: **(Leave completely empty)**
   - **Build output directory**: `web`
   - **Root directory**: `/` (project root)

3. **Environment Variables** (Optional for runner)
   - Go to Settings → Environment variables
   - Add `RUNNER_ORIGIN` = `https://your-runner-backend.com`
   - This enables remote code execution

4. **Deploy**
   - Click "Save and Deploy"
   - Your playground will be live at `https://your-project.pages.dev`

### Method 2: GitHub Actions (Automated)

The repository includes `.github/workflows/deploy.yml` for automatic deployment.

1. **Add GitHub Secrets**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add two secrets:
     - `CF_API_TOKEN`: Your Cloudflare API token (with Pages write permission)
     - `CF_ACCOUNT_ID`: Your Cloudflare account ID

2. **Configure Project Name** (if needed)
   - Edit `.github/workflows/deploy.yml`
   - Change `--project-name=pohlang-playground` to your project name

3. **Deploy**
   - Push to `main` branch or trigger workflow manually
   - GitHub Actions will automatically deploy to Cloudflare Pages

### Method 3: Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy web --project-name=pohlang-playground
```

## 🏗️ Architecture

```
Pohlang-PlayGround/
├── web/                    # Frontend (static site)
│   ├── index.html         # Main UI
│   ├── main.js            # Client-side logic
│   ├── styles.css         # Styling
│   ├── examples/          # Example code files
│   │   ├── index.json     # Example manifest
│   │   ├── tutorial_basics.poh
│   │   ├── hello.poh
│   │   ├── functions.poh
│   │   ├── classes.poh
│   │   ├── web_server.poh
│   │   └── ...
│   └── _headers           # Cloudflare Pages headers
├── functions/             # Cloudflare Pages Functions
│   └── api/
│       └── run.js         # Proxy to runner backend
├── server/                # Local dev server (Node.js)
│   ├── index.js           # Express server
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD for Cloudflare Pages
├── wrangler.toml          # Cloudflare config
└── README.md
```

### How It Works

1. **Frontend** - Static HTML/CSS/JS served by Cloudflare Pages
2. **Examples** - Loaded from static `web/examples/` directory
3. **Code Execution**:
   - **Local**: Express server calls PohLang CLI
   - **Production**: Cloudflare Pages Function proxies to remote runner
4. **Persistence** - Browser localStorage for auto-save

## 🔧 Configuration

### Runner Backend (Optional)

For production deployment, you need a backend to execute PohLang code:

1. **Deploy a Runner Service**
   - Host a server with PohLang CLI installed
   - Expose an API endpoint: `POST /api/run`
   - Expected request: `{ code: string, mode: 'run'|'bytecode'|'disassemble' }`
   - Expected response: `{ ok: boolean, stdout: string, stderr: string, ms: number, exitCode: number }`

2. **Configure RUNNER_ORIGIN**
   - In Cloudflare Pages: Settings → Environment variables
   - Set `RUNNER_ORIGIN` to your runner's URL
   - The Pages Function in `functions/api/run.js` will proxy requests

### Local Development

The local server (`server/index.js`) executes code directly using the PohLang CLI.

## API Endpoints

### Local Server
- `GET /` - Playground UI
- `GET /api/examples` - List available examples
- `GET /api/examples/:name` - Get example code
- `POST /api/run` - Execute PohLang code

### Cloudflare Pages
- `GET /` - Playground UI (static)
- `GET /examples/index.json` - Example manifest
- `GET /examples/:name` - Example files
- `POST /api/run` - Proxy to runner (via Pages Function)

## 🎓 Educational Use

Perfect for:
- **Teaching programming basics** with natural language syntax
- **Workshops and tutorials** on language design
- **Experimenting** with PohLang features
- **Sharing code snippets** via URLs (coming soon)

## � Automatic Deployment

The playground uses **GitHub Actions** for continuous deployment:

- **Frontend (Cloudflare Pages)**: Deploys automatically when you push to `main`
- **Backend (Google Cloud Run)**: Deploys automatically when you push changes to `server/`

### Quick Setup

1. **Configure GitHub Secrets** (one-time setup)
   - See [AUTOMATIC_DEPLOYMENT.md](AUTOMATIC_DEPLOYMENT.md) for detailed instructions
   - Add `GCP_PROJECT_ID` and `GCP_SA_KEY` secrets

2. **Push Changes**
   ```bash
   git add .
   git commit -m "Update server"
   git push origin main
   ```

3. **Get Service URL**
   - Check GitHub Actions summary for your Cloud Run URL
   - Update `RUNNER_ORIGIN` in Cloudflare Pages settings

**Full Guide**: [AUTOMATIC_DEPLOYMENT.md](AUTOMATIC_DEPLOYMENT.md)

## �🛠️ Development

### Adding New Examples

1. Create a `.poh` file in `web/examples/`
2. Add the filename to `web/examples/index.json`
3. Test locally: `npm start` in `server/` directory
4. Commit and push - CI/CD will deploy automatically

### Customizing the UI

- **Styles**: Edit `web/styles.css`
- **Layout**: Modify `web/index.html`
- **Behavior**: Update `web/main.js`

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add examples if adding features
5. Test locally
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **PohLang Documentation**: [github.com/pohlang/PohLang/doc](https://github.com/pohlang/PohLang/tree/main/doc)
- **Syntax Guide**: [SYNTAX_GUIDE.md](https://github.com/pohlang/PohLang/blob/main/SYNTAX_GUIDE.md)
- **Main Repository**: [github.com/pohlang/PohLang](https://github.com/pohlang/PohLang)

## 🙏 Acknowledgments

Built with ❤️ by the PohLang community. Special thanks to all contributors and testers!

---

**Happy Coding! 🎉**
