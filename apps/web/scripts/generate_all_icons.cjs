const fs = require('fs');
const path = require('path');
const sharp = require('d:/All Projects/Resume project/dermo/node_modules/sharp');

async function main() {
  const userUploadedPng = 'C:/Users/shekh/.gemini/antigravity-ide/brain/c0ad3488-f2f3-485d-95ef-0dd184c61980/.user_uploaded/media_1790766211380.png';
  const webPublicDir = path.resolve(__dirname, '../public');
  const webAppDir = path.resolve(__dirname, '../src/app');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  <path
    d="M 40 0 H 80 V 40 H 120 V 80 A 40 40 0 0 0 80 120 H 40 V 80 H 0 V 40 A 40 40 0 0 0 40 0 Z"
    fill="#4B624A"
  />
</svg>`;

  const svgBuffer = Buffer.from(svgContent);

  // 1. High-resolution logo.png (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(webPublicDir, 'logo.png'));
  console.log('Generated public/logo.png (512x512)');

  // Also save original as logo-raw.png just in case
  fs.copyFileSync(userUploadedPng, path.join(webPublicDir, 'logo-raw.png'));

  // 2. Apple touch icons (180x180)
  // Apple guidelines suggest a solid or padded canvas for home screen icons
  const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="36" fill="#F5F6F0"/>
  <g transform="translate(30, 30)">
    <svg width="120" height="120" viewBox="0 0 120 120">
      <path
        d="M 40 0 H 80 V 40 H 120 V 80 A 40 40 0 0 0 80 120 H 40 V 80 H 0 V 40 A 40 40 0 0 0 40 0 Z"
        fill="#4B624A"
      />
    </svg>
  </g>
</svg>`;
  const appleBuffer = Buffer.from(appleSvg);

  await sharp(appleBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(webPublicDir, 'apple-touch-icon.png'));
  fs.copyFileSync(path.join(webPublicDir, 'apple-touch-icon.png'), path.join(webAppDir, 'apple-icon.png'));
  console.log('Generated apple-touch-icon.png & src/app/apple-icon.png');

  // 3. Android PWA icons
  await sharp(appleBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(webPublicDir, 'icon-192.png'));
  await sharp(appleBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(webPublicDir, 'icon-512.png'));
  console.log('Generated icon-192.png & icon-512.png');

  // 4. App router icon.png (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(webAppDir, 'icon.png'));

  // 5. Generate ICO file with 16x16, 32x32, 48x48
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  // Simple multi-image ICO writer
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // ICO type
  icoHeader.writeUInt16LE(3, 4); // 3 images

  const images = [
    { width: 16, height: 16, buf: p16 },
    { width: 32, height: 32, buf: p32 },
    { width: 48, height: 48, buf: p48 }
  ];

  let offset = 6 + 16 * 3;
  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width, 0);
    entry.writeUInt8(img.height, 1);
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bit depth
    entry.writeUInt32LE(img.buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += img.buf.length;
  }

  const icoBuf = Buffer.concat([icoHeader, ...dirEntries, ...images.map(i => i.buf)]);
  fs.writeFileSync(path.join(webPublicDir, 'favicon.ico'), icoBuf);
  fs.writeFileSync(path.join(webAppDir, 'favicon.ico'), icoBuf);
  console.log('Generated public/favicon.ico & src/app/favicon.ico (16, 32, 48)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
