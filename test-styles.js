// CSS and UI verification test
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'web', 'styles.css');
const css = fs.readFileSync(cssPath, 'utf8');

console.log('🎨 Checking CSS Styles and UI Components...\n');

// CSS Variables (Design Tokens)
const requiredVariables = [
  '--bg',
  '--panel', 
  '--text',
  '--muted',
  '--accent',
  '--accent-2',
  '--success',
  '--error',
  '--warning',
  '--border',
  '--hover'
];

console.log('📋 CSS Variables (Design System):');
const missingVars = requiredVariables.filter(v => !css.includes(v));
if (missingVars.length === 0) {
  console.log(`  ✅ All ${requiredVariables.length} color variables defined`);
  requiredVariables.forEach(v => console.log(`    ✓ ${v}`));
} else {
  console.log(`  ❌ Missing: ${missingVars.join(', ')}`);
}
console.log('');

// Component Styles
const requiredComponents = {
  'Header': 'header {',
  'Buttons': 'button {',
  'Primary Button': '.primary-btn',
  'Icon Button': '.icon-btn',
  'Inputs/Select': 'select {',
  'Main Layout': '.layout {',
  'Editor Pane': '.editor-pane',
  'Output Pane': '.output-pane',
  'Editor Textarea': '#editor {',
  'Status Indicator': '.status {',
  'Modal': '.modal {',
  'Modal Content': '.modal-content',
  'Welcome Section': '.welcome-section',
  'Help Panel': '.help-panel',
  'Help Collapsed': '.help-panel.collapsed',
  'Footer': 'footer {',
  'Keyboard Shortcuts': 'kbd {',
  'Code Blocks': '.help-section code'
};

console.log('🎯 Component Styles:');
const missingComponents = [];
Object.entries(requiredComponents).forEach(([name, selector]) => {
  const found = css.includes(selector);
  if (found) {
    console.log(`  ✓ ${name}`);
  } else {
    console.log(`  ✗ ${name}`);
    missingComponents.push(name);
  }
});
console.log('');

// Animations
const animations = ['fadeIn', 'slideDown'];
console.log('✨ Animations:');
animations.forEach(anim => {
  const found = css.includes(`@keyframes ${anim}`);
  console.log(`  ${found ? '✓' : '✗'} @keyframes ${anim}`);
});
console.log('');

// Responsive Breakpoints
const breakpoints = [
  { name: 'Desktop Large (1200px)', query: '@media (max-width: 1200px)' },
  { name: 'Tablet (900px)', query: '@media (max-width: 900px)' },
  { name: 'Mobile (600px)', query: '@media (max-width: 600px)' }
];

console.log('📱 Responsive Design:');
breakpoints.forEach(bp => {
  const found = css.includes(bp.query);
  console.log(`  ${found ? '✓' : '✗'} ${bp.name}`);
});
console.log('');

// Interactive States
const interactiveStates = [
  'button:hover',
  'select:hover',
  'select:focus',
  '#editor:focus',
  '.close-modal:hover',
  '.footer-links a:hover'
];

console.log('🎭 Interactive States:');
interactiveStates.forEach(state => {
  const found = css.includes(state);
  console.log(`  ${found ? '✓' : '✗'} ${state}`);
});
console.log('');

// Visual Effects
const effects = [
  { name: 'Box Shadow', pattern: 'box-shadow' },
  { name: 'Border Radius', pattern: 'border-radius' },
  { name: 'Transitions', pattern: 'transition' },
  { name: 'Gradient Text', pattern: 'linear-gradient' },
  { name: 'Transform Effects', pattern: 'transform:' }
];

console.log('✨ Visual Effects:');
effects.forEach(effect => {
  const count = (css.match(new RegExp(effect.pattern, 'g')) || []).length;
  console.log(`  ${count > 0 ? '✓' : '✗'} ${effect.name} (${count} uses)`);
});
console.log('');

// Accessibility Features
const a11y = [
  { name: 'Focus Styles', pattern: ':focus' },
  { name: 'Cursor Pointer', pattern: 'cursor: pointer' },
  { name: 'ARIA Support', pattern: 'aria-' }
];

console.log('♿ Accessibility:');
a11y.forEach(feature => {
  const found = css.includes(feature.pattern);
  console.log(`  ${found ? '✓' : '✗'} ${feature.name}`);
});
console.log('');

// Typography
const typography = [
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing'
];

console.log('📝 Typography:');
typography.forEach(prop => {
  const count = (css.match(new RegExp(prop, 'g')) || []).length;
  console.log(`  ${count > 0 ? '✓' : '✗'} ${prop} (${count} uses)`);
});
console.log('');

// Layout Techniques
const layout = [
  { name: 'Flexbox', pattern: 'display: flex' },
  { name: 'CSS Grid', pattern: 'display: grid' },
  { name: 'Positioning', pattern: 'position:' },
  { name: 'Overflow Control', pattern: 'overflow:' }
];

console.log('📐 Layout Techniques:');
layout.forEach(tech => {
  const count = (css.match(new RegExp(tech.pattern, 'g')) || []).length;
  console.log(`  ${count > 0 ? '✓' : '✗'} ${tech.name} (${count} uses)`);
});
console.log('');

// Summary
console.log('═'.repeat(50));
console.log('📊 SUMMARY');
console.log('═'.repeat(50));

const totalChecks = requiredVariables.length + Object.keys(requiredComponents).length + 
                    animations.length + breakpoints.length + interactiveStates.length;
const passed = requiredVariables.length - missingVars.length + 
               Object.keys(requiredComponents).length - missingComponents.length +
               animations.filter(a => css.includes(`@keyframes ${a}`)).length +
               breakpoints.filter(bp => css.includes(bp.query)).length +
               interactiveStates.filter(s => css.includes(s)).length;

console.log(`Total Checks: ${passed}/${totalChecks}`);
console.log(`Success Rate: ${Math.round((passed/totalChecks)*100)}%`);

if (missingVars.length === 0 && missingComponents.length === 0) {
  console.log('\n✅ ALL CRITICAL STYLES VERIFIED!');
  console.log('🎨 UI is properly styled and ready for production!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some styles may be missing');
  if (missingVars.length > 0) console.log(`   Missing variables: ${missingVars.join(', ')}`);
  if (missingComponents.length > 0) console.log(`   Missing components: ${missingComponents.join(', ')}`);
  process.exit(1);
}
