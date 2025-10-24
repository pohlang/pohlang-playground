# Universal PohLang Setup Guide

Use PohLang anywhere - from VS Code to Notepad, PowerShell to CMD, and everything in between!

## 🎯 Quick Start by Environment

### 🌐 Option 1: Online (Zero Install)
**Perfect for:** Quick testing, learning, sharing code

👉 **[PohLang Playground](https://pohlang-playground.pages.dev)**
- No installation needed
- Run code instantly in browser
- 12+ examples included
- Share via URL

---

### 💻 Option 2: VS Code (Best IDE Experience)
**Perfect for:** Full-featured development, IntelliSense, debugging

#### Install Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "PLHub" and install it
4. Search for "PohLang" and install it

5. Make sure to download both extensions.

**Features:**
- ✅ Syntax highlighting
- ✅ Auto-completion
- ✅ 40+ code snippets
- ✅ Integrated terminal
- ✅ One-click run (Ctrl+F5)
- ✅ Bundled runtime (no separate install)
- 

#### Quick Start
```bash
# Create new file
File -> New File -> Save as "hello.poh"

# Write code
Start Program
Write "Hello from VS Code!"
End Program

# Run code
Press Ctrl+F5
```

[Download PohLang Hub Extension](https://marketplace.visualstudio.com/items?itemName=pohlang.pohlang-hub)

---

### 🚀 Option 3: PLHub CLI (Advanced Development)
**Perfect for:** Project management, building apps, Android/iOS deployment

#### Install PLHub
```powershell
# Windows (PowerShell as Admin)
git clone https://github.com/pohlang/PLHub
cd PLHub
.\install.bat

# Linux/macOS
git clone https://github.com/pohlang/PLHub
cd PLHub
chmod +x install.sh && ./install.sh
```

#### Verify Installation
```bash
plhub --version
plhub doctor
```

#### Create & Run Projects
```bash
# Create new project
plhub create my-app --template basic

# Navigate
cd my-app

# Run
plhub run src/main.poh

# Build for Android
plhub build apk

# Build for Windows
plhub build exe
```

**Features:**
- 🎨 UI toolkit with themes & widgets
- 📱 Build Android APKs
- 🍎 Build iOS apps
- 🪟 Build Windows executables
- 🌐 Build web apps
- 🧪 Testing framework
- 🔥 Hot reload
- 📦 Package management

[PLHub Documentation](https://github.com/pohlang/PLHub)

---

### 📝 Option 4: Simple Text Editor + CLI
**Perfect for:** Lightweight editing, quick scripts, any text editor

#### 1. Install PohLang CLI

**Windows (PowerShell):**
```powershell
# One-line install
irm https://raw.githubusercontent.com/pohlang/PohLang/main/install/install.ps1 | iex

# Verify
pohlang --version
```

**Linux/macOS:**
```bash
# One-line install
curl -sSL https://raw.githubusercontent.com/pohlang/PohLang/main/install/install.sh | bash

# Verify
pohlang --version
```

#### 2. Use Any Text Editor

**Notepad (Windows):**
```powershell
# Create file
notepad hello.poh

# Write your code, save, then run:
pohlang --run hello.poh
```

**Notepad++ (Windows):**
```powershell
# Create new file
# Language -> P -> PohLang (if you have syntax files)
# Or: Language -> Normal Text

# Save as hello.poh, then run:
pohlang --run hello.poh
```

**nano (Linux/macOS):**
```bash
# Edit file
nano hello.poh

# Save (Ctrl+O, Enter, Ctrl+X), then run:
pohlang --run hello.poh
```

**vim (Linux/macOS):**
```bash
# Edit file
vim hello.poh

# Write code, save (:wq), then run:
pohlang --run hello.poh
```

#### 3. Run from Any Terminal

**PowerShell:**
```powershell
# Run file
pohlang --run script.poh

# Show bytecode
pohlang --bytecode script.poh

# Disassemble
pohlang --disassemble script.poh
```

**CMD (Command Prompt):**
```cmd
REM Run file
pohlang --run script.poh

REM Show bytecode
pohlang --bytecode script.poh
```

**Bash/Zsh (Linux/macOS):**
```bash
# Run file
pohlang --run script.poh

# Show bytecode
pohlang --bytecode script.poh

# Make executable
chmod +x script.poh
./pohlang --run script.poh
```

---

## 🎓 Example Workflow for Each Environment

### Workflow 1: Browser Only
```
1. Go to https://pohlang-playground.pages.dev
2. Select an example or write code
3. Click "Run Code"
4. View output instantly
```

### Workflow 2: VS Code
```
1. Open VS Code
2. Create hello.poh
3. Write code
4. Press Ctrl+F5 to run
5. View output in integrated terminal
```

### Workflow 3: Notepad + PowerShell
```
1. Open Notepad
2. Write PohLang code
3. Save as hello.poh
4. Open PowerShell in same folder
5. Run: pohlang --run hello.poh
6. View output in terminal
```

### Workflow 4: PLHub Project
```
1. plhub create my-app
2. cd my-app
3. Edit src/main.poh in any editor
4. plhub run src/main.poh
5. plhub build apk (for Android)
```

---

## 📚 Common Commands Reference

### PohLang CLI
```bash
# Execute code
pohlang --run file.poh

# Show bytecode
pohlang --bytecode file.poh

# Disassemble
pohlang --disassemble file.poh

# Check version
pohlang --version

# Help
pohlang --help
```

### PLHub CLI
```bash
# Project management
plhub create <name>              # Create project
plhub run <file>                 # Run file
plhub build apk                  # Build Android
plhub build exe                  # Build Windows
plhub build ipa                  # Build iOS

# Development
plhub dev                        # Hot reload mode
plhub test                       # Run tests
plhub doctor                     # Check environment

# Help
plhub --help
plhub <command> --help
```

---

## 🛠️ Integration Examples

### Integrate with Any Editor

#### Sublime Text
1. Create build system: Tools → Build System → New Build System
```json
{
    "cmd": ["pohlang", "--run", "$file"],
    "file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
    "selector": "source.poh"
}
```
2. Save as PohLang.sublime-build
3. Run with Ctrl+B

#### Atom
1. Install `script` package
2. Open .poh file
3. Press Ctrl+Shift+B to run

#### Kate/KWrite (KDE)
1. Settings → Configure Kate → Build
2. Add new target:
   - Command: `pohlang --run %f`
3. Press F7 to build/run

---

## 🎯 Use Cases by Environment

### For Learning (Beginners)
**Recommended:** 
1. **Online Playground** (no install)
2. **VS Code Extension** (when ready to install)

### For Quick Scripts
**Recommended:** 
1. **Notepad + PowerShell/CMD**
2. **nano/vim + bash**

### For Serious Development
**Recommended:** 
1. **VS Code Extension**
2. **PLHub CLI**

### For Building Apps
**Recommended:** 
1. **PLHub CLI** (required for builds)

### For Teaching/Sharing
**Recommended:** 
1. **Online Playground** (share URL)
2. **VS Code Extension** (classroom setup)

---

## 🔧 Troubleshooting

### "pohlang: command not found"
**Solution:** PohLang not in PATH

**Windows:**
```powershell
# Add to PATH temporarily
$env:PATH += ";C:\path\to\pohlang"

# Or reinstall with install script
irm https://raw.githubusercontent.com/pohlang/PohLang/main/install/install.ps1 | iex
```

**Linux/macOS:**
```bash
# Add to PATH temporarily
export PATH=$PATH:/path/to/pohlang

# Or add to ~/.bashrc or ~/.zshrc
echo 'export PATH=$PATH:/usr/local/bin' >> ~/.bashrc
source ~/.bashrc
```

### "plhub: command not found"
**Solution:** PLHub not installed or not in PATH

```powershell
# Reinstall PLHub
cd PLHub
.\install.bat  # Windows
./install.sh   # Linux/macOS

# Close and reopen terminal
```

### "Error: Expected 'Start Program'"
**Solution:** PohLang files must start with `Start Program` (no comments before it)

```pohlang
# ✅ Correct
Start Program
Write "Hello"
End Program

# ❌ Wrong
# This is a comment
Start Program
Write "Hello"
End Program
```

### VS Code Extension Not Working
**Solution:** Check extension installation

1. Extensions → PohLang Hub → Check if installed
2. Reload VS Code
3. Check bundled runtime path
4. Reinstall extension if needed

---

## 📖 Learning Resources

- **Interactive Tutorial:** [Playground](https://pohlang-playground.pages.dev)
- **Complete Guide:** [PohLang_Guide.md](https://github.com/pohlang/PohLang/blob/main/doc/PohLang_Guide.md)
- **Syntax Reference:** [SYNTAX_GUIDE.md](https://github.com/pohlang/PohLang/blob/main/SYNTAX_GUIDE.md)
- **Examples:** [PohLang/examples](https://github.com/pohlang/PohLang/tree/main/examples)
- **PLHub Examples:** [PLHub/Examples](https://github.com/pohlang/PLHub/tree/main/Examples)

---

## 🎉 Quick Comparison

| Environment | Install Time | Best For | Features |
|------------|-------------|----------|----------|
| **Playground** | 0 seconds | Learning, sharing | Instant, examples, share URL |
| **VS Code Ext** | 1 minute | Development | IntelliSense, debugging, themes |
| **PLHub CLI** | 2 minutes | Apps, deployment | Build APK/EXE, UI toolkit |
| **CLI + Editor** | 1 minute | Quick scripts | Lightweight, any editor |

---

## 🚀 Next Steps

1. **Try the playground** - No install: https://pohlang-playground.pages.dev
2. **Install VS Code extension** - Full IDE: https://marketplace.visualstudio.com/items?itemName=pohlang.pohlang-hub
3. **Install PohLang CLI** - For scripts: `irm https://raw.githubusercontent.com/pohlang/PohLang/main/install/install.ps1 | iex`
4. **Install PLHub** - For apps: https://github.com/pohlang/PLHub
5. **Join community** - Get help and share projects

**Choose what works for you - PohLang works everywhere!** 🎉
