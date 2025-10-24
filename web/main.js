const examplesSel = document.getElementById('examples');
const loadBtn = document.getElementById('loadExample');
const runBtn = document.getElementById('run');
const editorEl = document.getElementById('editor');
const outEl = document.getElementById('output');
const errEl = document.getElementById('errors');

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function loadExamples() {
  examplesSel.innerHTML = '';
  // Try API first (Node server), then fall back to static list for Cloudflare Pages
  try {
    const data = await fetchJSON('/api/examples');
    (data.files || []).forEach(f => {
      const opt = document.createElement('option');
      opt.value = f; opt.textContent = f; examplesSel.appendChild(opt);
    });
    if (examplesSel.options.length > 0) return;
  } catch (_) {}

  // Fallback: load static index from /examples/index.json
  try {
    const res = await fetch('/examples/index.json');
    if (!res.ok) throw new Error('no static examples index');
    const files = await res.json();
    (files || []).forEach(f => {
      const opt = document.createElement('option');
      opt.value = f; opt.textContent = f; examplesSel.appendChild(opt);
    });
  } catch (e) {
    console.error('Failed to load examples', e);
  }
}

async function loadSelected() {
  const name = examplesSel.value;
  if (!name) return;
  // Prefer API; fallback to static asset
  try {
    const res = await fetch(/api/examples/);
    if (res.ok) {
      editorEl.value = await res.text();
    } else {
      throw new Error('api not available');
    }
  } catch (_) {
    const res2 = await fetch(/examples/);
    editorEl.value = await res2.text();
  }
  outEl.textContent = '';
  errEl.textContent = '';
}

async function runCode() {
  outEl.textContent = 'Running...';
  errEl.textContent = '';
  const code = editorEl.value;
  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mode: 'run' })
    });
    const data = await res.json();
    outEl.textContent = data.stdout || '';
    errEl.textContent = (data.stderr || '') + (data.ok ? '' : ('\n' + (data.error || '')));
  } catch (e) {
    // Likely no API in Cloudflare Pages unless RUNNER_ORIGIN is configured.
    outEl.textContent = '';
    errEl.textContent = 'Runner not available. Configure Cloudflare Pages Functions RUNNER_ORIGIN or run the local server.\n\n' + String(e);
  }
}

loadBtn.addEventListener('click', loadSelected);
runBtn.addEventListener('click', runCode);

(async () => {
  await loadExamples();
  // Default to hello.poh if present
  const idx = Array.from(examplesSel.options).findIndex(o => o.value === 'hello.poh');
  if (idx >= 0) examplesSel.selectedIndex = idx;
  await loadSelected();
})();
