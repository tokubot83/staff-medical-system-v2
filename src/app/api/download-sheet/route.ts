import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('path');
  const fileName = searchParams.get('name') || 'sheet';

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

    // HTMLテンプレートを作成
    const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1, h2, h3, h4 {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .section {
      margin: 20px 0;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 4px;
    }
    @media print {
      body {
        background: white;
      }
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${fileName}</h1>
    <div id="content">
      <pre style="white-space: pre-wrap; font-family: inherit;">${fileContent}</pre>
    </div>
  </div>
</body>
</html>
    `;

    // HTMLとしてレスポンスを返す
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}.html"`,
      },
    });
  } catch (error) {
    console.error('ファイルの読み込みエラー:', error);
    return NextResponse.json({ error: 'ファイルの読み込みに失敗しました' }, { status: 500 });
  }
}