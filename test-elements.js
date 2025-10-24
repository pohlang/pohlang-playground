// Quick test to verify all required elements exist
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'web', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const requiredIds = [
  'welcomeModal',
  'helpPanel', 
  'editor',
  'output',
  'status',
  'examples',
  'run',
  'copyOutput',
  'reset',
  'download',
  'mode',
  'toggleHelp',
  'showWelcome',
  'editorInfo',
  'loadExample',
  'errors',
  'closeHelp',
  'startCoding',
  'dontShowAgain'
];

console.log('🔍 Checking HTML for required element IDs...\n');

const results = requiredIds.map(id => {
  const found = html.includes(`id="${id}"`);
  return { id, found };
});

const missing = results.filter(r => !r.found);

if (missing.length === 0) {
  console.log(`✅ SUCCESS! All ${requiredIds.length} required IDs found!\n`);
  results.forEach(r => console.log(`  ✓ ${r.id}`));
} else {
  console.log(`❌ MISSING ${missing.length} IDs:\n`);
  missing.forEach(r => console.log(`  ✗ ${r.id}`));
  console.log(`\n✓ Found ${results.length - missing.length}/${requiredIds.length} IDs`);
  process.exit(1);
}
