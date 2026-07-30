const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Nishu\\.gemini\\antigravity-ide\\brain\\f79a8d13-d5ec-4ed6-9d54-f44bce520850';
const destDir = 'd:\\Projects\\finance-calculator\\public\\biodata-backgrounds';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
files.forEach((f) => {
  if (f.startsWith('biodata_ivory_gold_bg')) {
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, 'ivory-gold-bg.png'));
    console.log('Copied ivory-gold-bg.png');
  }
  if (f.startsWith('biodata_rose_gold_bg')) {
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, 'rose-gold-bg.png'));
    console.log('Copied rose-gold-bg.png');
  }
  if (f.startsWith('biodata_maroon_gold_bg')) {
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, 'maroon-gold-bg.png'));
    console.log('Copied maroon-gold-bg.png');
  }
});
