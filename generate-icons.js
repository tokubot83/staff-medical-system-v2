// Canvas APIを使用してアイコンを生成
const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 背景色（青）
  ctx.fillStyle = '#0070f3';
  ctx.fillRect(0, 0, size, size);

  // 白い十字（医療シンボル）
  ctx.fillStyle = '#ffffff';
  const centerX = size / 2;
  const centerY = size / 2;
  const barWidth = size * 0.25;
  const barLength = size * 0.6;

  // 横バー
  ctx.fillRect(centerX - barLength/2, centerY - barWidth/2, barLength, barWidth);
  // 縦バー
  ctx.fillRect(centerX - barWidth/2, centerY - barLength/2, barWidth, barLength);

  return canvas.toBuffer('image/png');
}

// アイコンを生成
sizes.forEach(size => {
  const buffer = generateIcon(size);
  const outputPath = path.join('public', 'icons', `icon-${size}x${size}.png`);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: icon-${size}x${size}.png`);
});

console.log('All icons generated successfully!');