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
  try {
    const data = await fetchJSON('/api/examples');
    examplesSel.innerHTML = '';
    data.files.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f; opt.textContent = f; examplesSel.appendChild(opt);
    });
  } catch (e) {
    console.error(e);
  }
}

async function loadSelected() {
  const name = examplesSel.value;
  if (!name) return;
  const res = await fetch(/api/examples/);
  editorEl.value = await res.text();
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
    outEl.textContent = '';
    errEl.textContent = String(e);
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
