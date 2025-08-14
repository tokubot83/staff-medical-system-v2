/**
 * データエクスポート機能
 * CSV・Excel形式でのデータ出力機能を提供
 */

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
}

/**
 * CSVエクスポート
 */
export const exportToCSV = (
  data: any[], 
  filename: string = 'export.csv',
  options: ExportOptions = {}
) => {
  const { includeHeaders = true } = options;

  if (!data || data.length === 0) {
    throw new Error('エクスポートするデータがありません');
  }

  const headers = includeHeaders ? Object.keys(data[0]) : [];
  const csvContent = [
    // ヘッダー行
    ...(includeHeaders ? [headers.join(',')] : []),
    // データ行
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // CSV用にエスケープ処理
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // カンマ、改行、ダブルクォートが含まれる場合はダブルクォートで囲む
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  // BOM付きUTF-8でエンコード（Excel対応）
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);

  return {
    success: true,
    recordCount: data.length,
    filename
  };
};

/**
 * Excelエクスポート
 */
export const exportToExcel = (
  data: any[], 
  filename: string = 'export.xlsx',
  options: ExportOptions = {}
) => {
  const { sheetName = 'データ', includeHeaders = true } = options;

  if (!data || data.length === 0) {
    throw new Error('エクスポートするデータがありません');
  }

  // ワークブック作成
  const workbook = XLSX.utils.book_new();
  
  // ワークシート作成
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: includeHeaders ? Object.keys(data[0]) : undefined,
    skipHeader: !includeHeaders
  });

  // 列幅の自動調整
  const columnWidths = Object.keys(data[0]).map(key => {
    const maxLength = Math.max(
      key.length,
      ...data.map(row => String(row[key] || '').length)
    );
    return { wch: Math.min(maxLength + 2, 50) }; // 最大50文字
  });
  worksheet['!cols'] = columnWidths;

  // ワークブックにシート追加
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // ファイル出力
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, filename);

  return {
    success: true,
    recordCount: data.length,
    filename,
    sheetName
  };
};

/**
 * 複数シートExcelエクスポート
 */
export const exportToMultiSheetExcel = (
  sheets: Array<{ name: string; data: any[] }>,
  filename: string = 'export.xlsx'
) => {
  if (!sheets || sheets.length === 0) {
    throw new Error('エクスポートするシートがありません');
  }

  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ name, data }) => {
    if (data && data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // 列幅の自動調整
      const columnWidths = Object.keys(data[0]).map(key => {
        const maxLength = Math.max(
          key.length,
          ...data.map(row => String(row[key] || '').length)
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, name);
    }
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, filename);

  return {
    success: true,
    sheetCount: sheets.length,
    filename
  };
};

/**
 * JSON形式でのバックアップエクスポート
 */
export const exportToJSON = (
  data: any,
  filename: string = 'backup.json'
) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  saveAs(blob, filename);

  return {
    success: true,
    filename
  };
};

/**
 * エクスポート用データの前処理
 */
export const prepareDataForExport = (
  data: any[],
  fieldLabels: Record<string, string> = {}
) => {
  if (!data || data.length === 0) return [];

  return data.map(item => {
    const processedItem: Record<string, any> = {};
    
    Object.keys(item).forEach(key => {
      const label = fieldLabels[key] || key;
      let value = item[key];

      // 日付フォーマット
      if (value instanceof Date) {
        value = value.toLocaleDateString('ja-JP');
      }
      
      // 真偽値の変換
      if (typeof value === 'boolean') {
        value = value ? 'はい' : 'いいえ';
      }

      // null/undefinedの処理
      if (value === null || value === undefined) {
        value = '';
      }

      processedItem[label] = value;
    });

    return processedItem;
  });
};