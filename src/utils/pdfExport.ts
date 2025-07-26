// PDF出力機能のユーティリティ
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  title: string;
  facility?: string;
  reportType: string;
  dateRange?: string;
  elementId: string;
}


export const exportToPDF = async (options: PDFExportOptions) => {
  try {
    // 対象要素の取得
    const element = document.getElementById(options.elementId);
    if (!element) {
      throw new Error('レポート要素が見つかりません');
    }

    // ローディング表示
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingDiv.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="text-lg">PDFを生成中...</span>
        </div>
      </div>
    `;
    document.body.appendChild(loadingDiv);

    // ヘッダー情報を含む一時的なコンテナを作成
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
      background: white;
      padding: 20px;
      width: 1000px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    `;

    // ヘッダー部分のHTML作成
    const headerHTML = `
      <div style="margin-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #333;">${options.title}</h1>
        ${options.facility ? `<p style="font-size: 14px; margin-bottom: 5px; color: #666;">施設: ${options.facility}</p>` : ''}
        ${options.dateRange ? `<p style="font-size: 14px; margin-bottom: 5px; color: #666;">期間: ${options.dateRange}</p>` : ''}
        <p style="font-size: 14px; margin-bottom: 5px; color: #666;">出力日: ${new Date().toLocaleDateString('ja-JP')}</p>
      </div>
    `;

    // コンテンツのクローンを作成
    const contentClone = element.cloneNode(true) as HTMLElement;
    
    // PDF出力時に除外する要素を削除
    const excludeElements = contentClone.querySelectorAll('.pdf-exclude');
    excludeElements.forEach(el => el.remove());
    
    // ヘッダーとコンテンツを結合
    tempContainer.innerHTML = headerHTML;
    tempContainer.appendChild(contentClone);
    
    // 一時的に画面外に配置
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);

    // HTML要素をキャンバスに変換
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // 高解像度
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // 一時的なコンテナを削除
    document.body.removeChild(tempContainer);

    // PDFドキュメントの作成
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // ページサイズの取得
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    // キャンバスからイメージデータを取得
    const imgData = canvas.toDataURL('image/png');
    
    // 画像のサイズ計算
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // 最初のページの開始位置
    let yPosition = margin;
    const remainingHeight = pageHeight - yPosition - margin;
    
    if (imgHeight <= remainingHeight) {
      // 1ページに収まる場合
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
    } else {
      // 複数ページに分割
      let position = 0;
      let pageNumber = 1;
      
      while (position < imgHeight) {
        if (pageNumber > 1) {
          pdf.addPage();
          yPosition = margin;
        }
        
        const currentHeight = Math.min(imgHeight - position, pageHeight - yPosition - margin);
        const sourceY = (position / imgHeight) * canvas.height;
        const sourceHeight = (currentHeight / imgHeight) * canvas.height;
        
        // 部分的な画像を追加
        const partialCanvas = document.createElement('canvas');
        partialCanvas.width = canvas.width;
        partialCanvas.height = sourceHeight;
        const ctx = partialCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );
          
          const partialImgData = partialCanvas.toDataURL('image/png');
          pdf.addImage(partialImgData, 'PNG', margin, yPosition, imgWidth, currentHeight);
        }
        
        position += currentHeight;
        pageNumber++;
      }
    }

    // フッター情報
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(128);
      pdf.text(
        `${i} / ${totalPages}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    // ローディング表示を削除
    document.body.removeChild(loadingDiv);

    // PDFをダウンロード
    const filename = `${options.reportType}_${options.facility?.replace(/[\s\/]/g, '_') || '全施設'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
  } catch (error) {
    console.error('PDF生成エラー:', error);
    
    // ローディング表示を削除
    const loadingDiv = document.querySelector('.fixed.inset-0');
    if (loadingDiv) {
      document.body.removeChild(loadingDiv);
    }
    
    alert('PDF生成中にエラーが発生しました。');
  }
};

// CSVエクスポート機能（追加機能）
export const exportToCSV = (data: any[], filename: string) => {
  // CSVデータの生成
  const csvContent = convertToCSV(data);
  
  // ダウンロードリンクの作成
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// データをCSV形式に変換
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  // ヘッダー行の作成
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  // データ行の作成
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // カンマや改行を含む値をエスケープ
      if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};