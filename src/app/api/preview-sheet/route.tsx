import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

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

    // TSXコンポーネントを動的インポート
    const modulePath = `@/docs/${filePath.replace('.tsx', '')}`;
    const SheetComponent = (await import(modulePath)).default;

    // ReactコンポーネントをHTMLにレンダリング
    const htmlString = ReactDOMServer.renderToStaticMarkup(
      React.createElement(SheetComponent)
    );

    // HTMLテンプレートを作成（プレビュー用）
    const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>シートプレビュー</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    /* Card styles */
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      overflow: hidden;
    }
    .card-header {
      padding: 20px;
      border-bottom: 1px solid #e5e5e5;
    }
    .card-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .card-content {
      padding: 20px;
    }
    
    /* Form styles */
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      font-size: 14px;
    }
    input, textarea, select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 15px;
    }
    textarea {
      min-height: 100px;
      resize: vertical;
    }
    button {
      background: #3b82f6;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
    }
    button:hover {
      background: #2563eb;
    }
    
    /* Alert styles */
    .alert {
      padding: 12px;
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 4px;
      margin: 15px 0;
    }
    .alert-description {
      font-size: 14px;
      color: #92400e;
    }
    
    /* Grid and layout */
    .space-y-6 > * + * { margin-top: 24px; }
    .space-y-4 > * + * { margin-top: 16px; }
    .space-y-3 > * + * { margin-top: 12px; }
    .space-y-2 > * + * { margin-top: 8px; }
    
    .grid {
      display: grid;
      gap: 8px;
    }
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
    .grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
    .grid-cols-6 { grid-template-columns: repeat(6, 1fr); }
    
    /* Background colors */
    .bg-amber-50 { background: #fffbeb; }
    .bg-gray-50 { background: #f9fafb; }
    .bg-blue-50 { background: #eff6ff; }
    .bg-green-50 { background: #f0fdf4; }
    .bg-yellow-50 { background: #fefce8; }
    .bg-red-50 { background: #fef2f2; }
    .bg-purple-50 { background: #faf5ff; }
    
    .bg-green-100 { background: #dcfce7; }
    .bg-blue-100 { background: #dbeafe; }
    .bg-yellow-100 { background: #fef3c7; }
    .bg-orange-100 { background: #fed7aa; }
    .bg-red-100 { background: #fee2e2; }
    
    /* Text colors */
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    .text-blue-600 { color: #2563eb; }
    .text-green-600 { color: #16a34a; }
    .text-red-600 { color: #dc2626; }
    
    /* Border styles */
    .border { border: 1px solid #e5e7eb; }
    .border-b { border-bottom: 1px solid #e5e7eb; }
    .border-l-4 { border-left: 4px solid; }
    .border-blue-500 { border-color: #3b82f6; }
    .border-green-500 { border-color: #10b981; }
    
    /* Utilities */
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .text-sm { font-size: 14px; }
    .text-xs { font-size: 12px; }
    .text-base { font-size: 16px; }
    .text-lg { font-size: 18px; }
    .text-xl { font-size: 20px; }
    .text-2xl { font-size: 24px; }
    .text-center { text-align: center; }
    .rounded { border-radius: 4px; }
    .rounded-lg { border-radius: 8px; }
    .p-2 { padding: 8px; }
    .p-3 { padding: 12px; }
    .p-4 { padding: 16px; }
    .p-6 { padding: 24px; }
    .px-2 { padding-left: 8px; padding-right: 8px; }
    .py-1 { padding-top: 4px; padding-bottom: 4px; }
    .pb-2 { padding-bottom: 8px; }
    .mt-2 { margin-top: 8px; }
    .mt-3 { margin-top: 12px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-3 { margin-bottom: 12px; }
    .mb-4 { margin-bottom: 16px; }
    .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; }
    .gap-4 { gap: 16px; }
    
    .max-w-4xl {
      max-width: 56rem;
      margin-left: auto;
      margin-right: auto;
    }
    
    /* Radio and checkbox styles */
    input[type="radio"],
    input[type="checkbox"] {
      width: auto;
      margin-right: 8px;
    }
    
    .radio-group {
      display: flex;
      gap: 16px;
      margin: 10px 0;
    }
    
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 10px 0;
    }
    
    /* Table styles */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #f3f4f6;
      font-weight: 600;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .card {
        box-shadow: none;
        border: 1px solid #d1d5db;
      }
    }
  </style>
</head>
<body>
  <div class="content">
    ${htmlString}
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
    
    // エラー時はフォールバックとして静的なHTMLを返す
    const errorHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>プレビューエラー</title>
  <style>
    body { font-family: sans-serif; padding: 40px; text-align: center; }
    .error { color: #dc2626; margin: 20px 0; }
  </style>
</head>
<body>
  <h2>シートのプレビューができません</h2>
  <p class="error">このシートは現在プレビューできません。</p>
  <p>ダウンロードボタンから内容を確認してください。</p>
</body>
</html>
    `;
    
    return new NextResponse(errorHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }
}