# ✅ Feature Verification Checklist

Use this checklist to verify all playground features are working correctly.

## Setup

1. **Start the local server:**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Open in browser:**
   - Navigate to: http://localhost:5173

## UI Elements Checklist

### Header
- [ ] 🌟 **PohLang Playground** title displays
- [ ] **?** button (Show Welcome) is visible
- [ ] **Examples dropdown** is populated with `.poh` files
- [ ] **Load button** works
- [ ] **Mode dropdown** shows: Run, Bytecode, Disassemble
- [ ] **▶ Run button** is styled as primary (highlighted)
- [ ] **📚 button** (Toggle Help) is visible
- [ ] **📋 Copy button** is visible
- [ ] **🔄 Reset button** is visible
- [ ] **⬇️ Download button** is visible

### Welcome Modal
- [ ] **Modal appears** on first visit
- [ ] Modal has **close button (×)**
- [ ] **"Start Coding!" button** works
- [ ] **"Don't show this again"** checkbox works
- [ ] **Clicking outside modal** closes it
- [ ] **? button in header** reopens modal

### Help Panel
- [ ] **📚 button** toggles help panel
- [ ] Help panel shows **Syntax Quick Reference**
- [ ] **✕ button** closes help panel
- [ ] Help panel is **collapsed by default**
- [ ] Shows sections: Variables, Collections, Control Flow, Functions, Operators, Web Server

### Editor Area
- [ ] **Textarea** is visible and editable
- [ ] **Placeholder text** shows when empty
- [ ] **Editor info** displays line count and character count
- [ ] Info updates as you type

### Output Area
- [ ] **Output** section is visible
- [ ] **Status indicator** shows run state
- [ ] **Errors** section is visible below output

### Footer
- [ ] **Links** are visible and clickable
- [ ] Links open in new tab

## Feature Testing

### 1. Loading Examples
- [ ] Select `hello.poh` from dropdown
- [ ] Click **Load**
- [ ] Code appears in editor
- [ ] Output area clears
- [ ] Try loading different examples

### 2. Running Code
- [ ] Type: `Start Program` `Write "Hello"` `End Program`
- [ ] Click **Run** button
- [ ] **Status** shows "✓ Success" in green
- [ ] **Output** shows "Hello"
- [ ] **Execution time** displayed (e.g., "45 ms")

### 3. Error Handling
- [ ] Type invalid code: `This is not valid`
- [ ] Click **Run**
- [ ] **Status** shows "✗ Error" in red
- [ ] **Errors section** displays error message

### 4. Execution Modes
- [ ] Select **"Run"** mode → Execute code normally
- [ ] Select **"Bytecode"** mode → Show compiled bytecode
- [ ] Select **"Disassemble"** mode → Show VM instructions
- [ ] Mode selection persists after page reload

### 5. Copy Output
- [ ] Run some code with output
- [ ] Click **📋 Copy**
- [ ] Button text changes to "✓ Copied!"
- [ ] Paste in notepad → output is copied
- [ ] Button text reverts after 2 seconds

### 6. Reset Functionality
- [ ] Load `hello.poh`
- [ ] Edit the code
- [ ] Click **🔄 Reset**
- [ ] Code reverts to original example
- [ ] Output clears

### 7. Download Code
- [ ] Write some code in editor
- [ ] Click **⬇️ Download**
- [ ] File `playground.poh` downloads
- [ ] Open file → contains your code

### 8. Keyboard Shortcuts

#### Ctrl/Cmd+Enter (Run)
- [ ] Type code in editor
- [ ] Press **Ctrl+Enter** (Windows) or **Cmd+Enter** (Mac)
- [ ] Code executes

#### Ctrl/Cmd+S (Save)
- [ ] Type code in editor
- [ ] Press **Ctrl+S** or **Cmd+S**
- [ ] Editor info shows "💾 Saved!"
- [ ] Reload page → code persists

#### Ctrl/Cmd+H (Toggle Help)
- [ ] Press **Ctrl+H** or **Cmd+H**
- [ ] Help panel toggles open/closed

### 9. Auto-save & Persistence

#### Content Persistence
- [ ] Type some code
- [ ] Press **Ctrl+S** or wait
- [ ] Reload page
- [ ] Code is still there

#### Example Selection Persistence
- [ ] Load `functions.poh`
- [ ] Reload page
- [ ] `functions.poh` is still selected

#### Mode Persistence
- [ ] Select "Bytecode" mode
- [ ] Reload page
- [ ] "Bytecode" is still selected

### 10. Welcome Modal Behavior
- [ ] Clear localStorage: Open DevTools → Console → `localStorage.clear()`
- [ ] Reload page
- [ ] Welcome modal appears
- [ ] Check "Don't show this again"
- [ ] Click "Start Coding!"
- [ ] Reload page
- [ ] Modal does NOT appear
- [ ] Click **?** button → Modal appears

### 11. Editor Info Updates
- [ ] Type in editor
- [ ] Line count updates in real-time
- [ ] Character count updates in real-time
- [ ] Info format: "X lines  Y chars"

### 12. Status Indicator

#### Success State
- [ ] Run valid code
- [ ] Status shows **"✓ Success"** in green
- [ ] Shows execution time and exit code

#### Error State
- [ ] Run invalid code
- [ ] Status shows **"✗ Error"** in red
- [ ] Shows execution details

#### Running State
- [ ] Click Run
- [ ] Status briefly shows **"⏳ Running..."** in yellow

#### Runner Unavailable
- [ ] Stop server
- [ ] Try to run code
- [ ] Status shows **"✗ Runner unavailable"** in red
- [ ] Error message explains how to fix

## Example Files Testing

Test that all examples load and run:

- [ ] **hello.poh** - Basic output
- [ ] **functions.poh** - Function definitions
- [ ] **control_flow.poh** - If/else, loops
- [ ] **lists.poh** - List operations
- [ ] **dict.poh** - Dictionary operations
- [ ] **calc.poh** - Calculator logic
- [ ] **tutorial_basics.poh** - Tutorial for beginners
- [ ] **web_server.poh** - Web server example
- [ ] **classes.poh** - OOP concepts
- [ ] **error_handling.poh** - Try/catch
- [ ] **file_operations.poh** - File I/O
- [ ] **data_processing.poh** - Data manipulation

## Responsive Design

### Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All buttons visible
- [ ] Editor and output side by side (or stacked)

### Tablet (768x1024)
- [ ] Layout adapts
- [ ] Buttons wrap appropriately
- [ ] Text is readable

### Mobile (375x667)
- [ ] Layout stacks vertically
- [ ] All features accessible
- [ ] Touch targets are large enough
- [ ] Modal fits screen

## Browser Compatibility

Test in multiple browsers:

- [ ] **Chrome** - All features work
- [ ] **Firefox** - All features work
- [ ] **Safari** - All features work (Mac)
- [ ] **Edge** - All features work

## API Endpoints

Test backend directly:

### Health Check
```bash
curl http://localhost:5173/api/health
```
- [ ] Returns JSON with `ok: true`
- [ ] Shows PohLang binary path

### List Examples
```bash
curl http://localhost:5173/api/examples
```
- [ ] Returns `{ ok: true, files: [...] }`
- [ ] Lists all `.poh` files

### Get Example
```bash
curl http://localhost:5173/api/examples/hello.poh
```
- [ ] Returns example code as plain text

### Run Code
```bash
curl -X POST http://localhost:5173/api/run \
  -H "Content-Type: application/json" \
  -d '{"code":"Start Program\nWrite \"Test\"\nEnd Program","mode":"run"}'
```
- [ ] Returns `{ ok: true, stdout: "Test\n", ... }`
- [ ] Shows execution time

## Security Features

### Rate Limiting
- [ ] Make 30+ requests rapidly
- [ ] Should get rate limit error after 30 requests
- [ ] Wait 1 minute, can make requests again

### Code Size Limit
- [ ] Try running code > 1MB
- [ ] Should get "Code too large" error

### Timeout
- [ ] Run code with infinite loop: `Repeat forever`
- [ ] Process kills after 10 seconds
- [ ] Error message shows timeout

## Performance

- [ ] Page loads in < 2 seconds
- [ ] Code execution returns in < 5 seconds (for simple code)
- [ ] No console errors in browser DevTools
- [ ] No memory leaks (check DevTools Performance tab)

## Accessibility

- [ ] Tab navigation works through all controls
- [ ] Screen reader can read labels (test with NVDA/JAWS)
- [ ] Keyboard shortcuts don't conflict with browser
- [ ] Focus indicators are visible
- [ ] Sufficient color contrast

## Edge Cases

### Empty Code
- [ ] Leave editor empty
- [ ] Click Run
- [ ] Should show error

### Very Long Code
- [ ] Paste 10,000 lines of code
- [ ] Editor handles it
- [ ] Run completes (or times out)

### Special Characters
- [ ] Code with unicode: `Write "🚀 Hello 你好"`
- [ ] Runs correctly
- [ ] Output displays correctly

### Network Failures
- [ ] Disconnect network
- [ ] Try to run code
- [ ] Shows friendly error message

## Final Checks

- [ ] No JavaScript errors in console
- [ ] No broken images or links
- [ ] All fonts load correctly
- [ ] Page title is correct
- [ ] Favicon displays (if added)
- [ ] Meta tags for SEO present

## Deployment Verification

After deploying to Cloudflare Pages:

- [ ] Visit production URL
- [ ] All features work (without backend)
- [ ] Static examples load
- [ ] Configure RUNNER_ORIGIN
- [ ] Code execution works via proxy
- [ ] HTTPS works correctly
- [ ] No mixed content warnings

---

## Summary

**Total Features: ~80 checkpoints**

### Required for Production:
- Core functionality (loading, running, UI)
- Keyboard shortcuts
- Persistence
- Error handling

### Nice to Have:
- All browser compatibility
- Full accessibility testing
- Performance optimization

---

## Quick Test Script

Run this in browser console after page loads:

```javascript
// Quick feature test
console.log('Testing PohLang Playground Features...\n');

const tests = {
  'Welcome Modal': !!document.getElementById('welcomeModal'),
  'Help Panel': !!document.getElementById('helpPanel'),
  'Editor': !!document.getElementById('editor'),
  'Output': !!document.getElementById('output'),
  'Status': !!document.getElementById('status'),
  'Examples Dropdown': !!document.getElementById('examples'),
  'Run Button': !!document.getElementById('run'),
  'Copy Button': !!document.getElementById('copyOutput'),
  'Reset Button': !!document.getElementById('reset'),
  'Download Button': !!document.getElementById('download'),
  'Mode Selector': !!document.getElementById('mode'),
  'Toggle Help': !!document.getElementById('toggleHelp'),
  'Show Welcome': !!document.getElementById('showWelcome'),
  'Editor Info': !!document.getElementById('editorInfo')
};

Object.entries(tests).forEach(([name, passed]) => {
  console.log(`${passed ? '✅' : '❌'} ${name}`);
});

console.log('\n' + Object.values(tests).filter(Boolean).length + '/' + Object.keys(tests).length + ' elements found');
```

Expected: **13/13 elements found** ✅
