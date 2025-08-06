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

    // ファイルの内容を読み込む
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    
    // TSXファイルから情報を抽出
    const titleMatch = fileContent.match(/<CardTitle[^>]*>([^<]+)<\/CardTitle>/);
    const title = titleMatch ? titleMatch[1] : 'シートプレビュー';
    
    // セクションヘッダーを抽出
    const sectionMatches = fileContent.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g);
    const sections = Array.from(sectionMatches).map(match => match[1]);
    
    // ラベルを抽出
    const labelMatches = fileContent.matchAll(/<Label[^>]*>([^<]+)<\/Label>/g);
    const labels = Array.from(labelMatches).map(match => match[1]).slice(0, 10);
    
    // アラート内容を抽出
    const alertMatch = fileContent.match(/<AlertDescription>([^<]+)<\/AlertDescription>/);
    const alertContent = alertMatch ? alertMatch[1] : '';

    // HTMLテンプレートを作成
    const htmlContent = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    .header {
      background: #fef3c7;
      padding: 24px;
      border-bottom: 2px solid #fbbf24;
    }
    
    .header h1 {
      font-size: 24px;
      color: #92400e;
      margin-bottom: 16px;
    }
    
    .alert {
      background: #fff;
      border: 1px solid #fbbf24;
      border-radius: 6px;
      padding: 12px;
      margin-top: 12px;
    }
    
    .alert-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #fbbf24;
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle;
    }
    
    .content {
      padding: 24px;
    }
    
    .section {
      margin-bottom: 24px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 6px;
      border-left: 4px solid #3b82f6;
    }
    
    .section h3 {
      font-size: 18px;
      color: #1e40af;
      margin-bottom: 12px;
    }
    
    .field-group {
      margin-bottom: 16px;
    }
    
    .field-label {
      display: block;
      font-weight: 600;
      margin-bottom: 4px;
      color: #374151;
      font-size: 14px;
    }
    
    .field-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background: white;
      font-size: 14px;
    }
    
    .field-textarea {
      width: 100%;
      min-height: 80px;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background: white;
      font-size: 14px;
      resize: vertical;
    }
    
    .radio-group, .checkbox-group {
      display: flex;
      gap: 16px;
      margin: 8px 0;
    }
    
    .radio-item, .checkbox-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .info-section {
      background: #eff6ff;
      border: 1px solid #3b82f6;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 24px;
    }
    
    .info-section h2 {
      color: #1e40af;
      font-size: 18px;
      margin-bottom: 12px;
    }
    
    .info-list {
      list-style: none;
    }
    
    .info-list li {
      padding: 4px 0;
      padding-left: 20px;
      position: relative;
    }
    
    .info-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
    }
    
    .preview-note {
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 6px;
      padding: 16px;
      margin: 24px;
      text-align: center;
    }
    
    .preview-note h3 {
      color: #92400e;
      margin-bottom: 8px;
    }
    
    .preview-note p {
      color: #78350f;
      font-size: 14px;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        max-width: 100%;
      }
      .preview-note {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      ${alertContent ? `
      <div class="alert">
        <span class="alert-icon"></span>
        <span>${alertContent}</span>
      </div>
      ` : ''}
    </div>
    
    <div class="preview-note">
      <h3>📋 プレビューモード</h3>
      <p>これはシートの構造を確認するためのプレビューです。</p>
      <p>実際の入力や保存はできません。印刷用にはダウンロード機能をご利用ください。</p>
    </div>
    
    <div class="content">
      ${sections.length > 0 ? `
      <div class="info-section">
        <h2>シートの構成</h2>
        <ul class="info-list">
          ${sections.map(section => `<li>${section}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      ${sections.map((section, index) => `
      <div class="section">
        <h3>${section}</h3>
        ${labels[index] ? `
        <div class="field-group">
          <label class="field-label">${labels[index]}</label>
          <textarea class="field-textarea" placeholder="ここに内容を入力..." disabled></textarea>
        </div>
        ` : `
        <div class="field-group">
          <label class="field-label">評価項目</label>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" name="eval${index}" disabled>
              <label>5 (優秀)</label>
            </div>
            <div class="radio-item">
              <input type="radio" name="eval${index}" disabled>
              <label>4 (良好)</label>
            </div>
            <div class="radio-item">
              <input type="radio" name="eval${index}" disabled>
              <label>3 (標準)</label>
            </div>
            <div class="radio-item">
              <input type="radio" name="eval${index}" disabled>
              <label>2 (要改善)</label>
            </div>
            <div class="radio-item">
              <input type="radio" name="eval${index}" disabled>
              <label>1 (不十分)</label>
            </div>
          </div>
        </div>
        `}
      </div>
      `).join('')}
      
      ${sections.length === 0 ? `
      <div class="section">
        <h3>面談・評価シート</h3>
        <p>このシートを使用して、職員の面談や評価を行います。</p>
        <div class="field-group">
          <label class="field-label">評価項目</label>
          <textarea class="field-textarea" placeholder="評価内容を入力..." disabled></textarea>
        </div>
      </div>
      ` : ''}
    </div>
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