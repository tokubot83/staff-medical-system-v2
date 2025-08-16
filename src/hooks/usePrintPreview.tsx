import { useState, useCallback } from 'react';
import { renderToString } from 'react-dom/server';

interface UsePrintPreviewOptions {
  title?: string;
  paperSize?: 'A4' | 'A3' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export function usePrintPreview(options: UsePrintPreviewOptions = {}) {
  const [isPrinting, setIsPrinting] = useState(false);

  const print = useCallback((content: HTMLElement | null, customOptions?: UsePrintPreviewOptions) => {
    if (!content) {
      console.error('印刷するコンテンツが見つかりません');
      return;
    }

    setIsPrinting(true);

    const finalOptions = { ...options, ...customOptions };
    const {
      title = 'ドキュメント',
      paperSize = 'A4',
      orientation = 'portrait',
      margins = { top: 20, bottom: 20, left: 20, right: 20 }
    } = finalOptions;

    // 新しいウィンドウを開く
    const printWindow = window.open('', 'PRINT', 'width=800,height=600');
    if (!printWindow) {
      setIsPrinting(false);
      alert('ポップアップブロッカーが有効になっています。印刷を許可してください。');
      return;
    }

    // 印刷用HTMLを生成
    const printHtml = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          @page {
            size: ${paperSize} ${orientation};
            margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Yu Gothic', 'Meiryo', sans-serif;
            font-size: 10pt;
            line-height: 1.6;
            color: #000;
            background: white;
          }
          
          .print-content {
            width: 100%;
            max-width: 100%;
          }
          
          /* 基本的なスタイル */
          h1 { font-size: 18pt; margin-bottom: 10mm; }
          h2 { font-size: 14pt; margin-top: 8mm; margin-bottom: 5mm; }
          h3 { font-size: 12pt; margin-top: 5mm; margin-bottom: 3mm; }
          p { margin-bottom: 3mm; }
          
          /* テーブルスタイル */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 5mm 0;
          }
          
          th, td {
            border: 1pt solid #999;
            padding: 2mm;
            text-align: left;
          }
          
          th {
            background: #f0f0f0;
            font-weight: bold;
          }
          
          /* フォーム要素 */
          input, textarea, select {
            border: none;
            background: transparent;
            width: auto;
          }
          
          input[type="checkbox"]:checked::before {
            content: "☑";
          }
          
          input[type="checkbox"]:not(:checked)::before {
            content: "☐";
          }
          
          /* 改ページ制御 */
          .page-break { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
          
          /* 印刷時非表示 */
          .no-print, button, .modal, .tooltip {
            display: none !important;
          }
          
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="print-content">
          ${content.innerHTML}
        </div>
      </body>
      </html>
    `;

    // HTMLを書き込み
    printWindow.document.write(printHtml);
    printWindow.document.close();

    // 画像などの読み込みを待つ
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        setIsPrinting(false);
      }, 500);
    };

    // タイムアウト設定
    setTimeout(() => {
      if (isPrinting) {
        setIsPrinting(false);
        printWindow.close();
      }
    }, 10000);
  }, [options, isPrinting]);

  const printElement = useCallback((elementId: string, customOptions?: UsePrintPreviewOptions) => {
    const element = document.getElementById(elementId);
    if (element) {
      print(element, customOptions);
    } else {
      console.error(`要素が見つかりません: ${elementId}`);
    }
  }, [print]);

  return {
    print,
    printElement,
    isPrinting
  };
}