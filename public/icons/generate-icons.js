const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVGコンテンツ（医療系のアイコン）
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0070f3"/>
  <g transform="translate(256, 256)">
    <rect x="-100" y="-150" width="200" height="100" fill="white" rx="10"/>
    <rect x="-40" y="-50" width="80" height="200" fill="white" rx="10"/>
    <rect x="-150" y="-40" width="300" height="80" fill="white" rx="10"/>
  </g>
</svg>
`;

// 生成するサイズ
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  try {
    // SVGバッファを作成
    const svgBuffer = Buffer.from(svgContent);

    for (const size of sizes) {
      const outputPath = path.join(__dirname, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated: icon-${size}x${size}.png`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();