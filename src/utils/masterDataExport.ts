/**
 * マスターデータ エクスポート機能拡張
 *
 * 機能:
 * - CSV/Excel形式での一括エクスポート
 * - 複数マスター同時エクスポート
 * - カスタムフィールド選択
 * - 関連データの結合エクスポート
 */

import { facilitySeeds } from '@/data/seeds/facilitySeeds';
import { professionSeeds } from '@/data/seeds/professionSeeds';
import { positionSeeds } from '@/data/seeds/positionSeeds';
import { employmentTypeSeeds } from '@/data/seeds/employmentTypeSeeds';
import { departmentSeeds } from '@/data/seeds/departmentSeeds';

export interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
  masterTypes: string[];
  fields?: Record<string, string[]>; // masterType -> field names
  includeRelations?: boolean;
  includeInactive?: boolean;
  encoding?: 'utf-8' | 'shift-jis';
  dateFormat?: 'iso' | 'japanese';
}

export interface ExportResult {
  success: boolean;
  format: string;
  files: Array<{
    masterType: string;
    filename: string;
    content: string;
    size: number;
  }>;
  totalRecords: number;
  exportedAt: Date;
}

/**
 * マスターデータエクスポート（メイン関数）
 */
export function exportMasterData(options: ExportOptions): ExportResult {
  const files: Array<{
    masterType: string;
    filename: string;
    content: string;
    size: number;
  }> = [];

  let totalRecords = 0;

  options.masterTypes.forEach(masterType => {
    const data = getMasterData(masterType, options.includeInactive);
    const selectedFields = options.fields?.[masterType];

    let content: string;
    let filename: string;

    if (options.format === 'csv') {
      content = exportToCSV(masterType, data, selectedFields, options.encoding);
      filename = `${masterType}_${formatDate(new Date())}.csv`;
    } else if (options.format === 'excel') {
      content = exportToExcelFormat(masterType, data, selectedFields);
      filename = `${masterType}_${formatDate(new Date())}.xlsx`;
    } else {
      content = exportToJSON(masterType, data, selectedFields);
      filename = `${masterType}_${formatDate(new Date())}.json`;
    }

    files.push({
      masterType,
      filename,
      content,
      size: content.length
    });

    totalRecords += data.length;
  });

  return {
    success: true,
    format: options.format,
    files,
    totalRecords,
    exportedAt: new Date()
  };
}

/**
 * 全マスターデータ一括エクスポート
 */
export function exportAllMasterData(
  format: 'csv' | 'excel' | 'json' = 'csv',
  includeInactive: boolean = false
): ExportResult {
  return exportMasterData({
    format,
    masterTypes: ['facility', 'department', 'profession', 'position', 'employmentType'],
    includeInactive
  });
}

/**
 * 関連データ結合エクスポート
 */
export function exportWithRelations(
  masterType: string,
  format: 'csv' | 'excel' | 'json' = 'csv'
): ExportResult {
  let data = getMasterData(masterType, false);

  // 関連データの結合
  if (masterType === 'department') {
    data = data.map(dept => ({
      ...dept,
      facilityCode: facilitySeeds.find(f => f.id === dept.facilityId)?.code || '',
      facilityName: facilitySeeds.find(f => f.id === dept.facilityId)?.name || '',
      parentDepartmentName: dept.parentDepartmentId
        ? departmentSeeds.find(d => d.id === dept.parentDepartmentId)?.name || ''
        : ''
    }));
  }

  if (masterType === 'position') {
    data = data.map(pos => ({
      ...pos,
      facilityName: facilitySeeds.find(f => f.id === pos.facilityId)?.name || ''
    }));
  }

  let content: string;
  let filename: string;

  if (format === 'csv') {
    content = exportToCSV(masterType, data);
    filename = `${masterType}_with_relations_${formatDate(new Date())}.csv`;
  } else if (format === 'excel') {
    content = exportToExcelFormat(masterType, data);
    filename = `${masterType}_with_relations_${formatDate(new Date())}.xlsx`;
  } else {
    content = exportToJSON(masterType, data);
    filename = `${masterType}_with_relations_${formatDate(new Date())}.json`;
  }

  return {
    success: true,
    format,
    files: [
      {
        masterType,
        filename,
        content,
        size: content.length
      }
    ],
    totalRecords: data.length,
    exportedAt: new Date()
  };
}

/**
 * カスタムフィールドエクスポート
 */
export function exportCustomFields(
  masterType: string,
  fields: string[],
  format: 'csv' | 'excel' | 'json' = 'csv'
): ExportResult {
  return exportMasterData({
    format,
    masterTypes: [masterType],
    fields: { [masterType]: fields }
  });
}

/**
 * CSV形式エクスポート
 */
function exportToCSV(
  masterType: string,
  data: any[],
  selectedFields?: string[],
  encoding: 'utf-8' | 'shift-jis' = 'utf-8'
): string {
  if (data.length === 0) {
    return '';
  }

  const fields = selectedFields || Object.keys(data[0]);
  const headers = fields.map(f => getFieldLabel(masterType, f));

  const rows = data.map(record =>
    fields.map(field => {
      const value = record[field];
      return formatValueForCSV(value);
    })
  );

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Shift-JIS対応（BOM付きUTF-8として返す）
  if (encoding === 'shift-jis') {
    return '\uFEFF' + csv; // BOM for Excel
  }

  return csv;
}

/**
 * Excel形式エクスポート（CSV with TSV形式）
 */
function exportToExcelFormat(
  masterType: string,
  data: any[],
  selectedFields?: string[]
): string {
  if (data.length === 0) {
    return '';
  }

  const fields = selectedFields || Object.keys(data[0]);
  const headers = fields.map(f => getFieldLabel(masterType, f));

  const rows = data.map(record =>
    fields.map(field => {
      const value = record[field];
      return formatValueForExcel(value);
    })
  );

  const tsv = [
    headers.join('\t'),
    ...rows.map(row => row.join('\t'))
  ].join('\n');

  return '\uFEFF' + tsv; // BOM for Excel
}

/**
 * JSON形式エクスポート
 */
function exportToJSON(
  masterType: string,
  data: any[],
  selectedFields?: string[]
): string {
  let exportData = data;

  if (selectedFields) {
    exportData = data.map(record => {
      const filtered: any = {};
      selectedFields.forEach(field => {
        filtered[field] = record[field];
      });
      return filtered;
    });
  }

  return JSON.stringify(
    {
      masterType,
      exportedAt: new Date().toISOString(),
      count: exportData.length,
      data: exportData
    },
    null,
    2
  );
}

/**
 * マスターデータ取得
 */
function getMasterData(masterType: string, includeInactive: boolean = false): any[] {
  let data: any[] = [];

  switch (masterType) {
    case 'facility':
      data = [...facilitySeeds];
      break;
    case 'department':
      data = [...departmentSeeds];
      break;
    case 'profession':
      data = [...professionSeeds];
      break;
    case 'position':
      data = [...positionSeeds];
      break;
    case 'employmentType':
      data = [...employmentTypeSeeds];
      break;
    default:
      data = [];
  }

  if (!includeInactive) {
    data = data.filter(record => record.isActive !== false);
  }

  return data;
}

/**
 * フィールドラベル取得
 */
function getFieldLabel(masterType: string, field: string): string {
  const labelMaps: Record<string, Record<string, string>> = {
    facility: {
      id: '施設ID',
      code: '施設コード',
      name: '施設名',
      category: 'カテゴリー',
      displayOrder: '表示順',
      isActive: '有効/無効',
      description: '説明'
    },
    department: {
      id: '部署ID',
      code: '部署コード',
      name: '部署名',
      facilityId: '所属施設ID',
      facilityName: '所属施設名',
      category: 'カテゴリー',
      parentDepartmentId: '上位部署ID',
      level: '階層レベル',
      displayOrder: '表示順',
      isActive: '有効/無効',
      description: '説明'
    },
    profession: {
      id: '職種ID',
      code: '職種コード',
      name: '職種名',
      category: 'カテゴリー',
      requiresLicense: '資格要否',
      displayOrder: '表示順',
      isActive: '有効/無効',
      description: '説明'
    },
    position: {
      id: '役職ID',
      code: '役職コード',
      name: '役職名',
      facilityId: '施設ID',
      authorityLevel: '権限レベル',
      displayOrder: '表示順',
      isActive: '有効/無効',
      description: '説明'
    },
    employmentType: {
      id: '雇用形態ID',
      code: '雇用形態コード',
      name: '雇用形態名',
      category: 'カテゴリー',
      isFullTime: '常勤区分',
      maxHoursPerWeek: '週最大勤務時間',
      requiresSocialInsurance: '社会保険加入要',
      allowsOvertime: '残業可否',
      displayOrder: '表示順',
      isActive: '有効/無効',
      description: '説明'
    }
  };

  return labelMaps[masterType]?.[field] || field;
}

/**
 * CSV用値フォーマット
 */
function formatValueForCSV(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'はい' : 'いいえ';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
  }

  const str = String(value);

  // カンマ、改行、ダブルクォートを含む場合はクォートで囲む
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Excel用値フォーマット
 */
function formatValueForExcel(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'はい' : 'いいえ';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('ja-JP');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * 日付フォーマット（ファイル名用）
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}_${hours}${minutes}`;
}

/**
 * エクスポート結果のダウンロード
 */
export function downloadExportResult(result: ExportResult): void {
  result.files.forEach(file => {
    const blob = new Blob([file.content], {
      type: getContentType(result.format)
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

/**
 * Content-Type取得
 */
function getContentType(format: string): string {
  switch (format) {
    case 'csv':
      return 'text/csv;charset=utf-8';
    case 'excel':
      return 'application/vnd.ms-excel;charset=utf-8';
    case 'json':
      return 'application/json;charset=utf-8';
    default:
      return 'text/plain;charset=utf-8';
  }
}

/**
 * ZIPアーカイブエクスポート（複数ファイル）
 */
export function exportAsZip(
  masterTypes: string[],
  format: 'csv' | 'excel' | 'json' = 'csv'
): string {
  const result = exportMasterData({
    format,
    masterTypes,
    includeInactive: false
  });

  // ZIP化のロジック（実装省略、JSZipライブラリ使用想定）
  // 本番実装時はJSZipを使用してZIPファイル作成

  return `ZIP export with ${result.files.length} files (${result.totalRecords} records)`;
}

/**
 * エクスポート統計情報
 */
export function getExportStatistics(): {
  totalMasters: number;
  totalRecords: number;
  recordsByMaster: Record<string, number>;
  lastExportAt?: Date;
} {
  const masterTypes = ['facility', 'department', 'profession', 'position', 'employmentType'];
  const recordsByMaster: Record<string, number> = {};

  let totalRecords = 0;

  masterTypes.forEach(masterType => {
    const data = getMasterData(masterType, false);
    recordsByMaster[masterType] = data.length;
    totalRecords += data.length;
  });

  return {
    totalMasters: masterTypes.length,
    totalRecords,
    recordsByMaster,
    lastExportAt: undefined // LocalStorageから取得する想定
  };
}
