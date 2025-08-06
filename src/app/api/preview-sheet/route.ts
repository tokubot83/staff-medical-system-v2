import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'ファイルパスが指定されていません' }, { status: 400 });
  }

  try {
    // ファイルパスを構築
    const fullPath = path.join(process.cwd(), 'docs', filePath);
    
    // ファイルの存在確認
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 404 });
    }

    // ファイルを読み込む
    const fileContent = fs.readFileSync(fullPath, 'utf-8');

    // HTMLテンプレートを作成（プレビュー用）
    const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>シートプレビュー</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
      margin: 0;
      padding: 20px;
      background: white;
      line-height: 1.6;
    }
    h1, h2, h3, h4 {
      color: #333;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    h1 { font-size: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    h2 { font-size: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    h3 { font-size: 18px; }
    h4 { font-size: 16px; }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f3f4f6;
      font-weight: bold;
      color: #374151;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    
    .section {
      margin: 20px 0;
      padding: 15px;
      background: #f9fafb;
      border-left: 4px solid #3b82f6;
      border-radius: 4px;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 4px;
      margin-right: 8px;
    }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-green { background: #d1fae5; color: #065f46; }
    .badge-yellow { background: #fef3c7; color: #92400e; }
    .badge-purple { background: #ede9fe; color: #5b21b6; }
    
    .evaluation-item {
      margin: 10px 0;
      padding: 10px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
    }
    
    .score-box {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 2px solid #3b82f6;
      border-radius: 4px;
      margin: 0 5px;
      font-weight: bold;
    }
    
    .checkbox {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 1px solid #9ca3af;
      border-radius: 2px;
      margin-right: 8px;
      vertical-align: middle;
    }
    
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: 'Courier New', monospace;
      background: #f3f4f6;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }
    
    .print-only {
      display: none;
    }
    
    @media print {
      .print-only {
        display: block;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="content">
    <pre>${fileContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>
</body>
</html>
    `;

    // HTMLとしてレスポンスを返す
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('ファイルの読み込みエラー:', error);
    return NextResponse.json({ error: 'ファイルの読み込みに失敗しました' }, { status: 500 });
  }
}