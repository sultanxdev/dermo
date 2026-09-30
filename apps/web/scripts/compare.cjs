const fs = require('fs');

const f1 = fs.readFileSync('C:/Users/shekh/.gemini/antigravity-ide/brain/c0ad3488-f2f3-485d-95ef-0dd184c61980/.user_uploaded/media_1790766211380.png');
const f2 = fs.readFileSync('d:/All Projects/Resume project/dermo/apps/web/public/logo.png');

console.log('f1 len:', f1.length, 'f2 len:', f2.length);
console.log('Equal:', f1.equals(f2));
