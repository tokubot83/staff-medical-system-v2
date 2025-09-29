'use client';

/**
 * 健康診断データ CSVインポートダイアログ
 * Created: 2025-09-29
 */

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Loader2
} from 'lucide-react';

interface CsvImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImportComplete?: (result: ImportResult) => void;
}

interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors?: Array<{
    row: number;
    staffId: string;
    error: string;
  }>;
}

export function CsvImportDialog({
  open,
  onClose,
  onImportComplete
}: CsvImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // ファイル選択処理
  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert('CSVファイルを選択してください');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('ファイルサイズは10MB以下にしてください');
      return;
    }

    setFile(selectedFile);
    setResult(null);
  }, []);

  // ドラッグ&ドロップ処理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  // インポート実行
  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);

    try {
      // プログレス表示のシミュレーション
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // FormDataでファイルを送信
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/health/import', {
        method: 'PUT',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setTimeout(() => {
          onImportComplete?.(data);
        }, 1500);
      }

    } catch (error) {
      console.error('Import error:', error);
      setResult({
        success: false,
        imported: 0,
        failed: 0,
        errors: [{
          row: 0,
          staffId: 'SYSTEM',
          error: 'インポート処理に失敗しました'
        }]
      });
    } finally {
      setImporting(false);
    }
  };

  // サンプルCSVダウンロード
  const handleDownloadSample = () => {
    const sampleCsv = `職員ID,氏名,健診日,身長,体重,BMI,腹囲,収縮期血圧,拡張期血圧,右眼視力,左眼視力,総合判定,要再検査,医師所見,AST_GOT,ALT_GPT,γGTP,総コレステロール,中性脂肪,HDLコレステロール,LDLコレステロール,クレアチニン,eGFR,血糖,白血球数,赤血球数,ヘモグロビン,ヘマトクリット,血小板数,尿蛋白,尿糖,尿潜血
4606,徳留拓哉,2025-04-30,166.0,61.4,22.3,79.0,134,96,1.5,1.5,B,無,異常なし,23,34,75,222,77,67.0,144,1.02,65.86,90,70,533,15.9,48.0,15.9,-,-,-
4607,山田太郎,2025-04-30,170.0,65.0,22.5,82.0,128,82,1.2,1.0,A,無,異常なし,20,25,45,180,65,72.0,98,0.95,72.5,85,65,520,15.5,46.5,16.2,-,-,-`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'health_checkup_sample.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // リセット
  const handleReset = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            健康診断データ CSVインポート
          </DialogTitle>
          <DialogDescription>
            医療機関から提供されたCSVファイルをアップロードしてください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* サンプルダウンロード */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSample}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              サンプルCSVをダウンロード
            </Button>
          </div>

          {/* ファイルアップロードエリア */}
          {!result && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                ${file ? 'bg-green-50 border-green-500' : ''}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 mx-auto text-green-600" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    サイズ: {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    ファイルを変更
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    ここにCSVファイルをドラッグ&ドロップ
                  </p>
                  <p className="text-gray-500 text-sm mb-4">または</p>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    />
                    <Button as="span" variant="outline">
                      ファイルを選択
                    </Button>
                  </label>
                </>
              )}
            </div>
          )}

          {/* インポート中 */}
          {importing && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">インポート処理中...</span>
              </div>
              <Progress value={progress} />
              <p className="text-xs text-gray-500 text-center">
                {progress}% 完了
              </p>
            </div>
          )}

          {/* 結果表示 */}
          {result && !importing && (
            <div className="space-y-3">
              {result.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="font-medium mb-2">
                      インポート完了
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>✅ 成功: {result.imported}件</p>
                      {result.failed > 0 && (
                        <p>⚠️ 失敗: {result.failed}件</p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="font-medium mb-2">
                      インポートエラー
                    </div>
                    <div className="text-sm">
                      処理中にエラーが発生しました
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* エラー詳細 */}
              {result.errors && result.errors.length > 0 && (
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">エラー詳細:</p>
                  <ul className="space-y-1 text-xs">
                    {result.errors.slice(0, 5).map((error, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-gray-500">行{error.row}:</span>
                        <span className="text-red-600">{error.error}</span>
                      </li>
                    ))}
                    {result.errors.length > 5 && (
                      <li className="text-gray-500">
                        他{result.errors.length - 5}件のエラー
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            {!result && (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={importing}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="gap-2"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      処理中...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      インポート開始
                    </>
                  )}
                </Button>
              </>
            )}
            {result && (
              <>
                {result.success ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                    >
                      別のファイルをインポート
                    </Button>
                    <Button onClick={onClose}>
                      完了
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                    >
                      やり直す
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onClose}
                    >
                      閉じる
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}