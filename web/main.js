const examplesSel = document.getElementById('examples');
const loadBtn = document.getElementById('loadExample');
const runBtn = document.getElementById('run');
const modeSel = document.getElementById('mode');
const copyBtn = document.getElementById('copyOutput');
const resetBtn = document.getElementById('reset');
const downloadBtn = document.getElementById('download');
const editorEl = document.getElementById('editor');
const outEl = document.getElementById('output');
const errEl = document.getElementById('errors');
const statusEl = document.getElementById('status');
const toggleHelpBtn = document.getElementById('toggleHelp');
const closeHelpBtn = document.getElementById('closeHelp');
const helpPanel = document.getElementById('helpPanel');
const welcomeModal = document.getElementById('welcomeModal');
const closeModal = document.querySelector('.close-modal');
const startCodingBtn = document.getElementById('startCoding');
const dontShowAgainChk = document.getElementById('dontShowAgain');
const showWelcomeBtn = document.getElementById('showWelcome');
const editorInfo = document.getElementById('editorInfo');

const LS_CONTENT = 'pohlang.playground.content';
const LS_EXAMPLE = 'pohlang.playground.example';
const LS_MODE = 'pohlang.playground.mode';
const LS_HIDE_WELCOME = 'pohlang.playground.hideWelcome';

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function loadExamples() {
  examplesSel.innerHTML = '';
  // Prefer static index (works on Cloudflare Pages and local), then fallback to API
  let files = [];
  try {
    const res = await fetch('/examples/index.json', { cache: 'no-store' });
    if (res.ok) files = await res.json();
  } catch (_) {}
  if (!files || files.length === 0) {
    try {
      const data = await fetchJSON('/api/examples');
      files = data.files || [];
    } catch (_) {}
  }
  (files || []).forEach((f) => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    examplesSel.appendChild(opt);
  });
}

async function loadSelected() {
  const name = examplesSel.value;
  if (!name) return;
  // Try static asset first
  try {
    const res2 = await fetch(`/examples/${encodeURIComponent(name)}`, { cache: 'no-store' });
    if (res2.ok) {
      editorEl.value = await res2.text();
    } else {
      throw new Error('static not available');
    }
  } catch (_) {
    try {
      const res = await fetch(`/api/examples/${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error('api not available');
      editorEl.value = await res.text();
    } catch (e) {
      console.error('Failed to load example', e);
    }
  }
  outEl.textContent = '';
  errEl.textContent = '';
  statusEl.textContent = '';
  updateEditorInfo();
  // Remember which example was loaded
  try { localStorage.setItem(LS_EXAMPLE, name); } catch {}
}

async function runCode() {
  outEl.textContent = 'Running...';
  errEl.textContent = '';
  statusEl.textContent = '⏳ Running...';
  statusEl.style.color = 'var(--warning)';
  
  const code = editorEl.value;
  const mode = modeSel?.value || 'run';
  const startTime = performance.now();
  
  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mode })
    });
    const data = await res.json();
    const endTime = performance.now();
    const clientMs = Math.round(endTime - startTime);
    
    outEl.textContent = data.stdout || '';
    const extraErr = data.ok ? '' : ('\n' + (data.error || ''));
    errEl.textContent = (data.stderr || '') + extraErr;
    
    if (data.ok || data.exitCode === 0) {
      statusEl.style.color = 'var(--success)';
      statusEl.textContent = '✓ Success';
    } else {
      statusEl.style.color = 'var(--error)';
      statusEl.textContent = '✗ Error';
    }
    
    if (typeof data.ms === 'number' || typeof data.exitCode !== 'undefined') {
      const parts = [];
      if (typeof data.ms === 'number') parts.push(`${data.ms} ms`);
      else parts.push(`~${clientMs} ms`);
      if (typeof data.exitCode !== 'undefined') parts.push(`exit ${data.exitCode}`);
      statusEl.textContent += ' • ' + parts.join(' • ');
    }
  } catch (e) {
    // Likely no API in Cloudflare Pages unless RUNNER_ORIGIN is configured.
    statusEl.style.color = 'var(--error)';
    statusEl.textContent = '✗ Runner unavailable';
    outEl.textContent = '';
    errEl.textContent = '⚠️ Runner not available.\n\n' +
      'The PohLang playground needs a backend runner to execute code.\n\n' +
      'Options:\n' +
      '1. Run the local server (see README.md)\n' +
      '2. Configure RUNNER_ORIGIN in Cloudflare Pages settings\n\n' +
      'Error details: ' + String(e);
  }
}

function updateEditorInfo() {
  const lines = editorEl.value.split('\n').length;
  const chars = editorEl.value.length;
  editorInfo.textContent = `${lines} lines • ${chars} chars`;
}

// Modal functions
function showWelcome() {
  welcomeModal.style.display = 'block';
}

function hideWelcome() {
  welcomeModal.style.display = 'none';
  if (dontShowAgainChk.checked) {
    try { localStorage.setItem(LS_HIDE_WELCOME, 'true'); } catch {}
  }
}

// Event listeners
loadBtn.addEventListener('click', loadSelected);
runBtn.addEventListener('click', runCode);

copyBtn?.addEventListener('click', async () => {
  try { 
    await navigator.clipboard.writeText(outEl.textContent || '');
    const oldText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => copyBtn.textContent = oldText, 2000);
  } catch {}
});

resetBtn?.addEventListener('click', async () => {
  // Reload currently selected example
  await loadSelected();
  try { localStorage.removeItem(LS_CONTENT); } catch {}
});

downloadBtn?.addEventListener('click', () => {
  const blob = new Blob([editorEl.value], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'playground.poh';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
});

toggleHelpBtn?.addEventListener('click', () => {
  helpPanel.classList.toggle('collapsed');
});

closeHelpBtn?.addEventListener('click', () => {
  helpPanel.classList.add('collapsed');
});

closeModal?.addEventListener('click', hideWelcome);
startCodingBtn?.addEventListener('click', hideWelcome);
showWelcomeBtn?.addEventListener('click', showWelcome);

// Click outside modal to close
window.addEventListener('click', (e) => {
  if (e.target === welcomeModal) {
    hideWelcome();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runCode();
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
    e.preventDefault();
    try { 
      localStorage.setItem(LS_CONTENT, editorEl.value);
      const oldText = editorInfo.textContent;
      editorInfo.textContent = '💾 Saved!';
      setTimeout(() => updateEditorInfo(), 2000);
    } catch {}
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'h' || e.key === 'H')) {
    e.preventDefault();
    helpPanel.classList.toggle('collapsed');
  }
});

// Update editor info on input
editorEl.addEventListener('input', updateEditorInfo);

// Initialize
(async () => {
  await loadExamples();
  
  // Restore last mode
  try {
    const lastMode = localStorage.getItem(LS_MODE);
    if (lastMode && modeSel) modeSel.value = lastMode;
  } catch {}
  
  // Restore last example
  let target = 'hello.poh';
  try {
    const lastExample = localStorage.getItem(LS_EXAMPLE);
    if (lastExample) target = lastExample;
  } catch {}
  const idx = Array.from(examplesSel.options).findIndex((o) => o.value === target);
  if (idx >= 0) examplesSel.selectedIndex = idx;
  
  await loadSelected();
  
  // Restore unsaved content if present
  try {
    const saved = localStorage.getItem(LS_CONTENT);
    if (saved) editorEl.value = saved;
  } catch {}
  
  updateEditorInfo();
  
  // Show welcome modal for first-time users
  try {
    const hideWelcome = localStorage.getItem(LS_HIDE_WELCOME);
    if (!hideWelcome) {
      showWelcome();
    }
  } catch {}
})();

modeSel?.addEventListener('change', () => {
  try { localStorage.setItem(LS_MODE, modeSel.value); } catch {}
});
