'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';

interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export default function ExcelImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        setImportResult(null);
      } else {
        alert('Excelファイル（.xlsx または .xls）を選択してください');
      }
    }
  };

  const processExcelFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    // プログレスバーのシミュレーション
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // 実際の処理では、ここでExcelファイルをパースして
      // バックエンドAPIに送信します
      await new Promise(resolve => setTimeout(resolve, 3000));

      // デモ用の結果
      const result: ImportResult = {
        totalRows: 150,
        successCount: 145,
        errorCount: 5,
        errors: [
          { row: 23, field: '施設貢献度', message: '数値が範囲外です' },
          { row: 45, field: '職員ID', message: '必須項目が入力されていません' },
          { row: 67, field: '評価期間', message: '無効な期間指定です' },
          { row: 89, field: '法人貢献度', message: '数値が範囲外です' },
          { row: 112, field: '職種', message: '無効な職種コードです' }
        ]
      };

      setImportResult(result);
      setProgress(100);
    } catch (error) {
      console.error('Import failed:', error);
      alert('インポート処理に失敗しました');
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    // テンプレートファイルのダウンロード処理
    console.log('Downloading template...');
  };

  const resetForm = () => {
    setFile(null);
    setImportResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* ファイル選択エリア */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Excelファイルインポート
          </CardTitle>
          <CardDescription>
            組織貢献度評価データをExcelファイルから一括インポートします
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* テンプレートダウンロード */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">インポート用テンプレート</p>
                <p className="text-sm text-gray-600">
                  まずはテンプレートをダウンロードして、データを入力してください
                </p>
              </div>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                テンプレートをダウンロード
              </Button>
            </div>

            {/* ファイル選択 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="excel-file-input"
              />
              
              {file ? (
                <div className="space-y-3">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-green-600" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={processExcelFile}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          処理中...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          インポート実行
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      キャンセル
                    </Button>
                  </div>
                </div>
              ) : (
                <label htmlFor="excel-file-input" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="font-medium">
                    クリックしてファイルを選択
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    または、ファイルをドラッグ＆ドロップ
                  </p>
                </label>
              )}
            </div>

            {/* 処理進捗 */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>インポート処理中...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-600">
                  データの検証と相対評価計算を実行しています
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* インポート結果 */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.errorCount === 0 ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  インポート完了
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  インポート完了（エラーあり）
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* サマリー */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold">{importResult.totalRows}</p>
                  <p className="text-sm text-gray-600">総レコード数</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">
                    {importResult.successCount}
                  </p>
                  <p className="text-sm text-gray-600">成功</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <p className="text-2xl font-bold text-red-600">
                    {importResult.errorCount}
                  </p>
                  <p className="text-sm text-gray-600">エラー</p>
                </div>
              </div>

              {/* エラー詳細 */}
              {importResult.errorCount > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">エラー詳細</h4>
                  <div className="space-y-2">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <Badge variant="destructive">行 {error.row}</Badge>
                        <span className="font-medium">{error.field}:</span>
                        <span className="text-gray-600">{error.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  インポートされたデータは4軸独立評価（夏施設・夏法人・冬施設・冬法人）により
                  自動的に相対評価され、配点が計算されます。
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}