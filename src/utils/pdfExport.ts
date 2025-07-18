// PDF出力機能のユーティリティ
// 注意: 実際の実装にはjsPDFやpuppeteerなどのライブラリが必要です

export interface PDFExportOptions {
  title: string;
  facility?: string;
  reportType: string;
  content: any;
}

export const exportToPDF = async (options: PDFExportOptions) => {
  // 実際の実装では、以下のような処理を行います：
  // 1. HTMLコンテンツをPDF用にフォーマット
  // 2. jsPDFやpuppeteerを使用してPDF生成
  // 3. ダウンロードリンクの作成
  
  console.log('PDF出力機能は実装予定です', options);
  
  // デモ用: アラートを表示
  alert(`PDF出力機能は実装予定です。\n\nレポート: ${options.title}\n施設: ${options.facility || '全施設'}`);
  
  // 実装例（jsPDFを使用する場合）:
  /*
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';
  
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // タイトル追加
  doc.setFontSize(20);
  doc.text(options.title, 20, 20);
  
  // 施設情報追加
  if (options.facility) {
    doc.setFontSize(14);
    doc.text(`施設: ${options.facility}`, 20, 30);
  }
  
  // コンテンツ追加（HTMLからキャンバスへ変換）
  const element = document.getElementById('report-content');
  if (element) {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 40, 190, 0);
  }
  
  // PDFダウンロード
  doc.save(`${options.reportType}_${new Date().toISOString().split('T')[0]}.pdf`);
  */
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