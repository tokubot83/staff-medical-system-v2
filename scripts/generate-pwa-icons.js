const fs = require('fs');
const path = require('path');

// Create a simple SVG icon for the medical system
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0070f3" rx="64"/>
  <g transform="translate(256, 256)">
    <!-- Hospital cross -->
    <rect x="-60" y="-140" width="120" height="280" fill="white" rx="20"/>
    <rect x="-140" y="-60" width="280" height="120" fill="white" rx="20"/>
    <!-- Heart symbol for care -->
    <path d="M -50,-10 C -50,-40 -25,-55 0,-35 C 25,-55 50,-40 50,-10 C 50,10 0,60 0,60 C 0,60 -50,10 -50,-10 Z" 
          fill="#ff4444" transform="translate(0, 80) scale(0.8)"/>
  </g>
</svg>
`;

// Convert SVG to different sized PNGs
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// For now, we'll create placeholder PNGs with a simple colored square
// In production, you'd use a library like sharp or canvas to properly convert SVG to PNG
sizes.forEach(size => {
  // Create a simple colored square as placeholder
  const canvas = createSimpleIcon(size);
  const buffer = canvas.toBuffer();
  
  const filePath = path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created ${filePath}`);
});

function createSimpleIcon(size) {
  // This is a simplified placeholder - in production use proper image generation
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Blue background
  ctx.fillStyle = '#0070f3';
  ctx.fillRect(0, 0, size, size);
  
  // White cross
  ctx.fillStyle = 'white';
  const crossWidth = size * 0.2;
  const crossLength = size * 0.6;
  
  // Vertical bar
  ctx.fillRect(
    (size - crossWidth) / 2,
    (size - crossLength) / 2,
    crossWidth,
    crossLength
  );
  
  // Horizontal bar
  ctx.fillRect(
    (size - crossLength) / 2,
    (size - crossWidth) / 2,
    crossLength,
    crossWidth
  );
  
  return canvas;
}