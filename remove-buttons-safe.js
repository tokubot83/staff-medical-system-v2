const fs = require('fs');
const path = require('path');

// 処理対象のディレクトリ
const targetDirs = [
  'src/app/reports',
  'src/app/evaluation-sheets',
  'src/app/interview-sheets-viewer'
];

let modifiedCount = 0;
let errorCount = 0;

// ファイルを再帰的に処理
function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.tsx')) {
        processFile(filePath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
    errorCount++;
  }
}

function processFile(filePath) {
  try {
    // UTF-8でファイルを読み込み
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // インポート文を削除
    content = content.replace(/import\s+DashboardButton\s+from\s+['"`]@\/components\/DashboardButton['"`];?\s*\n/g, '');
    content = content.replace(/import\s+ScrollToTopButton\s+from\s+['"`]@\/components\/ScrollToTopButton['"`];?\s*\n/g, '');
    content = content.replace(/import\s+\{\s*BackToReportsButton\s*\}\s+from\s+['"`]@\/components\/BackToReportsButton['"`];?\s*\n/g, '');

    // コンポーネント使用箇所を削除
    content = content.replace(/\s*<DashboardButton\s*\/>\s*\n?/g, '');
    content = content.replace(/\s*<ScrollToTopButton\s*\/>\s*\n?/g, '');
    content = content.replace(/\s*<BackToReportsButton\s*\/>\s*\n?/g, '');

    // ファイルが変更された場合のみ保存
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Modified: ${path.basename(filePath)}`);
      modifiedCount++;
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    errorCount++;
  }
}

// メイン処理
console.log('Starting button removal process...\n');

for (const dir of targetDirs) {
  console.log(`Processing directory: ${dir}`);
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  } else {
    console.log(`  Directory not found: ${dir}`);
  }
}

console.log(`\n=== Summary ===`);
console.log(`Total files modified: ${modifiedCount}`);
console.log(`Errors encountered: ${errorCount}`);