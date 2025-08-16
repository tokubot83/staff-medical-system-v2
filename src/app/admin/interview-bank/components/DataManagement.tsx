'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Upload,
  Database,
  Archive,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  FileText,
  HardDrive,
  Trash2
} from 'lucide-react';

import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';

interface BackupInfo {
  id: string;
  date: Date;
  size: string;
  items: {
    questions: number;
    sections: number;
    results: number;
    profiles: number;
  };
  type: 'manual' | 'auto';
}

export default function DataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  
  const [backups] = useState<BackupInfo[]>([
    {
      id: '1',
      date: new Date('2024-03-15T10:00:00'),
      size: '2.4 MB',
      items: {
        questions: 247,
        sections: 32,
        results: 156,
        profiles: 89
      },
      type: 'auto'
    },
    {
      id: '2',
      date: new Date('2024-03-10T15:30:00'),
      size: '2.1 MB',
      items: {
        questions: 235,
        sections: 30,
        results: 142,
        profiles: 85
      },
      type: 'manual'
    }
  ]);

  const bankService = InterviewBankService.getInstance();

  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // プログレス更新のシミュレーション
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const data = await bankService.exportData(format);
      
      clearInterval(progressInterval);
      setExportProgress(100);

      // ダウンロード処理
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-bank-export-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setIsImporting(true);
    setImportProgress(0);
    setShowImportDialog(false);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result as string;
        
        // プログレス更新のシミュレーション
        const progressInterval = setInterval(() => {
          setImportProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        const result = await bankService.importData(data, {
          overwrite: false,
          skipExisting: true
        });

        clearInterval(progressInterval);
        setImportProgress(100);

        console.log('Import result:', result);

        setTimeout(() => {
          setIsImporting(false);
          setImportProgress(0);
          setImportFile(null);
        }, 1000);
      };
      
      reader.readAsText(importFile);
    } catch (error) {
      console.error('Import failed:', error);
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleClearData = async () => {
    // データクリア処理（実装は必要に応じて）
    console.log('Clearing data...');
    setShowClearDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* エクスポート */}
      <Card>
        <CardHeader>
          <CardTitle>データエクスポート</CardTitle>
          <CardDescription>
            面談バンクのデータをファイルとしてエクスポートします
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isExporting ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>エクスポート中...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleExport('json')}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileJson className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">JSON形式</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          完全なデータ構造を保持
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleExport('csv')}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-green-500" />
                          <span className="font-medium">CSV形式</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Excel等で編集可能
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>エクスポート時の注意</AlertTitle>
                <AlertDescription>
                  エクスポートされたデータには個人情報が含まれる可能性があります。
                  取り扱いには十分注意してください。
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>

      {/* インポート */}
      <Card>
        <CardHeader>
          <CardTitle>データインポート</CardTitle>
          <CardDescription>
            エクスポートしたデータを読み込みます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isImporting ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>インポート中...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          ) : (
            <>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  JSONまたはCSVファイルをドラッグ＆ドロップ
                </p>
                <Button onClick={() => setShowImportDialog(true)}>
                  ファイルを選択
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch id="overwrite" />
                  <Label htmlFor="overwrite" className="text-sm">
                    既存データを上書き
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="validate" defaultChecked />
                  <Label htmlFor="validate" className="text-sm">
                    データ検証を実行
                  </Label>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* バックアップ管理 */}
      <Card>
        <CardHeader>
          <CardTitle>バックアップ管理</CardTitle>
          <CardDescription>
            自動・手動バックアップの管理を行います
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map(backup => (
              <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Archive className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {backup.date.toLocaleDateString('ja-JP')} {backup.date.toLocaleTimeString('ja-JP')}
                      </span>
                      <Badge variant={backup.type === 'auto' ? 'secondary' : 'default'}>
                        {backup.type === 'auto' ? '自動' : '手動'}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>サイズ: {backup.size}</span>
                      <span>質問: {backup.items.questions}</span>
                      <span>セクション: {backup.items.sections}</span>
                      <span>結果: {backup.items.results}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    復元
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Switch id="auto-backup" defaultChecked />
                <Label htmlFor="auto-backup">自動バックアップを有効化</Label>
              </div>
              <Button>
                <Archive className="h-4 w-4 mr-2" />
                今すぐバックアップ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ストレージ情報 */}
      <Card>
        <CardHeader>
          <CardTitle>ストレージ情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">使用容量</span>
              <span className="font-medium">12.4 MB / 100 MB</span>
            </div>
            <Progress value={12.4} />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">データベース</span>
                </div>
                <p className="text-lg font-medium">8.2 MB</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">キャッシュ</span>
                </div>
                <p className="text-lg font-medium">4.2 MB</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowClearDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                データをクリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* インポートダイアログ */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>データインポート</DialogTitle>
            <DialogDescription>
              インポートするファイルを選択してください
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="file"
              accept=".json,.csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="w-full"
            />
            {importFile && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  ファイル: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleImport} disabled={!importFile}>
              インポート開始
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* データクリアダイアログ */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>データクリアの確認</DialogTitle>
            <DialogDescription>
              この操作は取り消すことができません。本当にすべてのデータをクリアしますか？
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              すべての質問、セクション、面談結果が削除されます。
              必要に応じて事前にバックアップを作成してください。
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleClearData}>
              データをクリア
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}