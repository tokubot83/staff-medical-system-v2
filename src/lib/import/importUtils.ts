/**
 * データインポート機能
 * CSV・Excel形式からのデータ取り込み機能を提供
 */

import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface ImportResult<T = any> {
  success: boolean;
  data: T[];
  errors: ImportError[];
  warnings: ImportWarning[];
  summary: ImportSummary;
}

export interface ImportError {
  row: number;
  column?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportWarning {
  row: number;
  column?: string;
  message: string;
}

export interface ImportSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  skippedRows: number;
}

export interface ImportOptions {
  hasHeader?: boolean;
  skipEmptyRows?: boolean;
  trimWhitespace?: boolean;
  maxRows?: number;
  requiredFields?: string[];
  fieldMapping?: Record<string, string>;
  validators?: Record<string, (value: any) => boolean | string>;
}

/**
 * CSVファイルのインポート
 */
export const importFromCSV = async <T = any>(
  file: File,
  options: ImportOptions = {}
): Promise<ImportResult<T>> => {
  const {
    hasHeader = true,
    skipEmptyRows = true,
    trimWhitespace = true,
    maxRows,
    requiredFields = [],
    fieldMapping = {},
    validators = {}
  } = options;

  return new Promise((resolve) => {
    Papa.parse(file, {
      header: hasHeader,
      skipEmptyLines: skipEmptyRows,
      trimHeaders: trimWhitespace,
      transform: trimWhitespace ? (value: string) => value.trim() : undefined,
      complete: (results) => {
        const { data, errors: parseErrors } = results;
        const processedData: T[] = [];
        const errors: ImportError[] = [];
        const warnings: ImportWarning[] = [];

        // パースエラーの処理
        parseErrors.forEach(error => {
          errors.push({
            row: error.row || 0,
            message: `CSVパースエラー: ${error.message}`,
            severity: 'error'
          });
        });

        // データの検証・変換
        data.forEach((row: any, index: number) => {
          const rowNumber = index + (hasHeader ? 2 : 1); // ヘッダー考慮
          
          if (maxRows && index >= maxRows) {
            return; // 最大行数制限
          }

          // 空行チェック
          if (skipEmptyRows && Object.values(row).every(value => !value)) {
            return;
          }

          // フィールドマッピング適用
          const mappedRow: Record<string, any> = {};
          Object.keys(row).forEach(key => {
            const mappedKey = fieldMapping[key] || key;
            mappedRow[mappedKey] = row[key];
          });

          // 必須フィールドチェック
          const missingFields = requiredFields.filter(field => 
            !mappedRow[field] || mappedRow[field].toString().trim() === ''
          );

          if (missingFields.length > 0) {
            errors.push({
              row: rowNumber,
              message: `必須フィールドが未入力: ${missingFields.join(', ')}`,
              severity: 'error'
            });
            return;
          }

          // バリデーション実行
          let hasValidationError = false;
          Object.keys(validators).forEach(field => {
            const validator = validators[field];
            const value = mappedRow[field];
            
            if (value !== undefined && value !== null && value !== '') {
              const validationResult = validator(value);
              if (validationResult !== true) {
                const message = typeof validationResult === 'string' 
                  ? validationResult 
                  : `${field}の値が不正です`;
                
                errors.push({
                  row: rowNumber,
                  column: field,
                  message,
                  severity: 'error'
                });
                hasValidationError = true;
              }
            }
          });

          if (!hasValidationError) {
            processedData.push(mappedRow as T);
          }
        });

        const summary: ImportSummary = {
          totalRows: data.length,
          validRows: processedData.length,
          invalidRows: data.length - processedData.length,
          skippedRows: 0
        };

        resolve({
          success: errors.filter(e => e.severity === 'error').length === 0,
          data: processedData,
          errors,
          warnings,
          summary
        });
      },
      error: (error) => {
        resolve({
          success: false,
          data: [],
          errors: [{
            row: 0,
            message: `ファイル読み込みエラー: ${error.message}`,
            severity: 'error'
          }],
          warnings: [],
          summary: {
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            skippedRows: 0
          }
        });
      }
    });
  });
};

/**
 * Excelファイルのインポート
 */
export const importFromExcel = async <T = any>(
  file: File,
  options: ImportOptions & { sheetName?: string } = {}
): Promise<ImportResult<T>> => {
  const {
    sheetName,
    hasHeader = true,
    skipEmptyRows = true,
    trimWhitespace = true,
    maxRows,
    requiredFields = [],
    fieldMapping = {},
    validators = {}
  } = options;

  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // シート選択
        const selectedSheetName = sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[selectedSheetName];
        
        if (!worksheet) {
          resolve({
            success: false,
            data: [],
            errors: [{
              row: 0,
              message: `シート "${selectedSheetName}" が見つかりません`,
              severity: 'error'
            }],
            warnings: [],
            summary: {
              totalRows: 0,
              validRows: 0,
              invalidRows: 0,
              skippedRows: 0
            }
          });
          return;
        }

        // JSONに変換
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: hasHeader ? 1 : undefined,
          defval: '',
          blankrows: !skipEmptyRows
        });

        // データ処理（CSVと同様の処理）
        const processedData: T[] = [];
        const errors: ImportError[] = [];
        const warnings: ImportWarning[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + (hasHeader ? 2 : 1);
          
          if (maxRows && index >= maxRows) {
            return;
          }

          // 空行チェック
          if (skipEmptyRows && Object.values(row).every(value => !value)) {
            return;
          }

          // フィールドマッピング・バリデーション（CSVと同じロジック）
          const mappedRow: Record<string, any> = {};
          Object.keys(row).forEach(key => {
            const mappedKey = fieldMapping[key] || key;
            let value = row[key];
            
            if (trimWhitespace && typeof value === 'string') {
              value = value.trim();
            }
            
            mappedRow[mappedKey] = value;
          });

          // 必須フィールドチェック
          const missingFields = requiredFields.filter(field => 
            !mappedRow[field] || mappedRow[field].toString().trim() === ''
          );

          if (missingFields.length > 0) {
            errors.push({
              row: rowNumber,
              message: `必須フィールドが未入力: ${missingFields.join(', ')}`,
              severity: 'error'
            });
            return;
          }

          // バリデーション実行
          let hasValidationError = false;
          Object.keys(validators).forEach(field => {
            const validator = validators[field];
            const value = mappedRow[field];
            
            if (value !== undefined && value !== null && value !== '') {
              const validationResult = validator(value);
              if (validationResult !== true) {
                const message = typeof validationResult === 'string' 
                  ? validationResult 
                  : `${field}の値が不正です`;
                
                errors.push({
                  row: rowNumber,
                  column: field,
                  message,
                  severity: 'error'
                });
                hasValidationError = true;
              }
            }
          });

          if (!hasValidationError) {
            processedData.push(mappedRow as T);
          }
        });

        const summary: ImportSummary = {
          totalRows: jsonData.length,
          validRows: processedData.length,
          invalidRows: jsonData.length - processedData.length,
          skippedRows: 0
        };

        resolve({
          success: errors.filter(e => e.severity === 'error').length === 0,
          data: processedData,
          errors,
          warnings,
          summary
        });

      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [{
            row: 0,
            message: `Excelファイル処理エラー: ${error}`,
            severity: 'error'
          }],
          warnings: [],
          summary: {
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            skippedRows: 0
          }
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        errors: [{
          row: 0,
          message: 'ファイル読み込みに失敗しました',
          severity: 'error'
        }],
        warnings: [],
        summary: {
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
          skippedRows: 0
        }
      });
    };

    reader.readAsBinaryString(file);
  });
};

/**
 * JSONファイルのインポート（バックアップ復元用）
 */
export const importFromJSON = async (file: File): Promise<ImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const data = JSON.parse(jsonString);
        
        resolve({
          success: true,
          data: Array.isArray(data) ? data : [data],
          errors: [],
          warnings: [],
          summary: {
            totalRows: Array.isArray(data) ? data.length : 1,
            validRows: Array.isArray(data) ? data.length : 1,
            invalidRows: 0,
            skippedRows: 0
          }
        });
      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [{
            row: 0,
            message: `JSONファイル処理エラー: ${error}`,
            severity: 'error'
          }],
          warnings: [],
          summary: {
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            skippedRows: 0
          }
        });
      }
    };

    reader.readAsText(file, 'utf-8');
  });
};