/**
 * データエクスポート・インポートコンポーネント
 * マスターデータの入出力機能を提供
 */

'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Download, Upload, FileText, Table, AlertCircle, CheckCircle2, 
  FileSpreadsheet, Database, Settings 
} from 'lucide-react';
import { exportToCSV, exportToExcel, exportToMultiSheetExcel } from '@/lib/export/exportUtils';
import { importFromCSV, importFromExcel, ImportResult } from '@/lib/import/importUtils';
import { masterDataValidators, fieldMappings } from '@/lib/validation/dataValidators';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface DataExportImportProps {
  masterType: string;
  data: any[];
  onDataImported: (data: any[]) => void;
  fieldLabels?: Record<string, string>;
}

interface ImportStatus {
  isImporting: boolean;
  progress: number;
  currentStep: string;
  results?: ImportResult;
}

export default function DataExportImport({
  masterType,
  data,
  onDataImported,
  fieldLabels = {}
}: DataExportImportProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel'>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    isImporting: false,
    progress: 0,
    currentStep: ''
  });
  const [showImportResults, setShowImportResults] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleError } = useErrorHandler();

  // フィールド一覧の取得
  const availableFields = data.length > 0 ? Object.keys(data[0]) : [];

  // 初期選択（全フィールド）
  React.useEffect(() => {
    if (selectedFields.length === 0 && availableFields.length > 0) {
      setSelectedFields(availableFields);
    }
  }, [availableFields]);

  /**
   * データエクスポート
   */
  const handleExport = async () => {
    try {
      if (data.length === 0) {
        throw new Error('エクスポートするデータがありません');
      }

      // 選択されたフィールドでデータをフィルタリング
      const filteredData = data.map(item => {
        const filtered: any = {};
        selectedFields.forEach(field => {
          const label = fieldLabels[field] || field;
          filtered[label] = item[field];
        });
        return filtered;
      });

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const filename = `${masterType}-${timestamp}`;

      if (selectedFormat === 'csv') {
        const result = exportToCSV(filteredData, `${filename}.csv`, {
          includeHeaders
        });
        alert(`${result.recordCount}件のデータをエクスポートしました`);
      } else {
        const result = exportToExcel(filteredData, `${filename}.xlsx`, {
          includeHeaders,
          sheetName: fieldLabels[masterType] || masterType
        });
        alert(`${result.recordCount}件のデータをエクスポートしました`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * データインポート
   */
  const handleImport = async (file: File) => {
    try {
      setImportStatus({
        isImporting: true,
        progress: 10,
        currentStep: 'ファイル読み込み中...'
      });

      const validators = masterDataValidators[masterType as keyof typeof masterDataValidators] || {};
      const mapping = fieldMappings[masterType as keyof typeof fieldMappings] || {};

      setImportStatus(prev => ({
        ...prev,
        progress: 30,
        currentStep: 'データ解析中...'
      }));

      let importResult: ImportResult;

      if (file.name.endsWith('.csv')) {
        importResult = await importFromCSV(file, {
          hasHeader: includeHeaders,
          skipEmptyRows: true,
          trimWhitespace: true,
          fieldMapping: mapping,
          validators,
          requiredFields: ['職員コード', '氏名'] // masterTypeに応じて動的に設定
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        importResult = await importFromExcel(file, {
          hasHeader: includeHeaders,
          skipEmptyRows: true,
          trimWhitespace: true,
          fieldMapping: mapping,
          validators,
          requiredFields: ['職員コード', '氏名']
        });
      } else {
        throw new Error('サポートされていないファイル形式です');
      }

      setImportStatus(prev => ({
        ...prev,
        progress: 80,
        currentStep: 'バリデーション実行中...'
      }));

      // 結果の設定
      setImportStatus({
        isImporting: false,
        progress: 100,
        currentStep: '完了',
        results: importResult
      });

      setShowImportResults(true);

      // 成功時のデータ更新
      if (importResult.success && importResult.data.length > 0) {
        onDataImported(importResult.data);
      }

    } catch (error) {
      setImportStatus({
        isImporting: false,
        progress: 0,
        currentStep: 'エラー'
      });
      handleError(error);
    }
  };

  /**
   * ファイル選択ハンドラ
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  /**
   * フィールド選択の切り替え
   */
  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  /**
   * 全選択/全解除
   */
  const toggleAllFields = () => {
    if (selectedFields.length === availableFields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields(availableFields);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          データエクスポート・インポート
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              エクスポート
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              インポート
            </TabsTrigger>
          </TabsList>

          {/* エクスポートタブ */}
          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* フォーマット選択 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">出力フォーマット</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="csv"
                      value="csv"
                      checked={selectedFormat === 'csv'}
                      onChange={(e) => setSelectedFormat(e.target.value as 'csv')}
                      className="text-blue-600"
                    />
                    <Label htmlFor="csv" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CSV形式
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="excel"
                      value="excel"
                      checked={selectedFormat === 'excel'}
                      onChange={(e) => setSelectedFormat(e.target.value as 'excel')}
                      className="text-blue-600"
                    />
                    <Label htmlFor="excel" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel形式
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="headers"
                      checked={includeHeaders}
                      onCheckedChange={setIncludeHeaders}
                    />
                    <Label htmlFor="headers" className="text-sm">
                      ヘッダー行を含む
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* フィールド選択 */}
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">出力フィールド</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAllFields}
                    className="text-xs"
                  >
                    {selectedFields.length === availableFields.length ? '全解除' : '全選択'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {availableFields.map(field => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={selectedFields.includes(field)}
                          onCheckedChange={() => toggleField(field)}
                        />
                        <Label htmlFor={field} className="text-sm">
                          {fieldLabels[field] || field}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* エクスポート実行 */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                {data.length}件のデータ（{selectedFields.length}フィールド）
              </div>
              <Button
                onClick={handleExport}
                disabled={data.length === 0 || selectedFields.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                エクスポート
              </Button>
            </div>
          </TabsContent>

          {/* インポートタブ */}
          <TabsContent value="import" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                CSV・Excel形式のファイルからデータをインポートできます。
                ファイルの1行目がヘッダーの場合は「ヘッダー行を含む」をチェックしてください。
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="import-headers"
                  checked={includeHeaders}
                  onCheckedChange={setIncludeHeaders}
                />
                <Label htmlFor="import-headers" className="text-sm">
                  ヘッダー行を含む
                </Label>
              </div>

              {/* ファイル選択 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {!importStatus.isImporting ? (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        CSVまたはExcelファイルを選択してください
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        ファイルを選択
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <Settings className="h-12 w-12 text-blue-500 animate-spin" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{importStatus.currentStep}</p>
                      <Progress value={importStatus.progress} className="mt-2" />
                    </div>
                  </div>
                )}
              </div>

              {/* インポート結果 */}
              {showImportResults && importStatus.results && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {importStatus.results.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      インポート結果
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {importStatus.results.summary.totalRows}
                        </div>
                        <div className="text-xs text-gray-600">総行数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {importStatus.results.summary.validRows}
                        </div>
                        <div className="text-xs text-gray-600">有効</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {importStatus.results.summary.invalidRows}
                        </div>
                        <div className="text-xs text-gray-600">エラー</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {importStatus.results.warnings.length}
                        </div>
                        <div className="text-xs text-gray-600">警告</div>
                      </div>
                    </div>

                    {/* エラー表示 */}
                    {importStatus.results.errors.length > 0 && (
                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-semibold mb-2">エラーが発生しました：</div>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {importStatus.results.errors.slice(0, 10).map((error, index) => (
                              <div key={index} className="text-sm">
                                行{error.row}: {error.message}
                              </div>
                            ))}
                            {importStatus.results.errors.length > 10 && (
                              <div className="text-sm text-gray-600">
                                他{importStatus.results.errors.length - 10}件のエラー
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImportResults(false)}
                      >
                        閉じる
                      </Button>
                      {importStatus.results.success && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowImportResults(false);
                            // データ反映の確認
                            alert(`${importStatus.results!.data.length}件のデータをインポートしました`);
                          }}
                        >
                          完了
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}