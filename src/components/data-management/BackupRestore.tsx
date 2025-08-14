/**
 * バックアップ・復元コンポーネント
 * システム全体のバックアップと復元機能を提供
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Save, Upload, Shield, History, AlertCircle, CheckCircle2, 
  Clock, Database, Settings, Trash2, Download
} from 'lucide-react';
import { backupService } from '@/lib/backup/backupService';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface BackupRestoreProps {
  onRestoreComplete?: () => void;
}

interface BackupHistory {
  id: string;
  filename: string;
  createdAt: string;
  createdBy: string;
  description: string;
  dataTypes: string[];
  recordCounts: Record<string, number>;
}

export default function BackupRestore({ onRestoreComplete }: BackupRestoreProps) {
  const [backupDescription, setBackupDescription] = useState('');
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([
    'masterData', 'evaluationData', 'systemConfig'
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([]);
  const [restoreOptions, setRestoreOptions] = useState({
    skipValidation: false,
    overwriteExisting: false,
    backupBeforeRestore: true,
    selectedDataTypes: ['masterData', 'evaluationData', 'systemConfig']
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleError } = useErrorHandler();

  const dataTypeLabels = {
    masterData: 'マスターデータ',
    evaluationData: '評価データ',
    systemConfig: 'システム設定'
  };

  // バックアップ履歴の読み込み
  useEffect(() => {
    loadBackupHistory();
  }, []);

  const loadBackupHistory = () => {
    try {
      const history = backupService.getBackupHistoryList();
      setBackupHistory(history);
    } catch (error) {
      console.error('バックアップ履歴の読み込みに失敗:', error);
    }
  };

  /**
   * 完全バックアップの作成
   */
  const handleFullBackup = async () => {
    try {
      setIsProcessing(true);
      setProgress(10);
      setCurrentStep('バックアップデータを収集中...');

      const filename = await backupService.createFullBackup(
        backupDescription || '手動バックアップ',
        'ユーザー'
      );

      setProgress(100);
      setCurrentStep('完了');
      
      alert(`バックアップを作成しました: ${filename}`);
      loadBackupHistory();
      setBackupDescription('');

    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  /**
   * 部分バックアップの作成
   */
  const handlePartialBackup = async () => {
    try {
      if (selectedDataTypes.length === 0) {
        throw new Error('バックアップするデータタイプを選択してください');
      }

      setIsProcessing(true);
      setProgress(10);
      setCurrentStep('選択されたデータを収集中...');

      const filename = await backupService.createPartialBackup(
        selectedDataTypes,
        backupDescription || '部分バックアップ',
        'ユーザー'
      );

      setProgress(100);
      setCurrentStep('完了');
      
      alert(`部分バックアップを作成しました: ${filename}`);
      loadBackupHistory();
      setBackupDescription('');

    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  /**
   * ファイルからの復元
   */
  const handleRestore = async (file: File) => {
    try {
      const confirmed = confirm(
        '復元を実行すると現在のデータが変更される可能性があります。続行しますか？'
      );
      if (!confirmed) return;

      setIsProcessing(true);
      setProgress(10);
      setCurrentStep('復元ファイルを読み込み中...');

      const result = await backupService.restoreFromBackup(file, restoreOptions);

      setProgress(100);
      setCurrentStep('完了');

      if (result.success) {
        const restoredItems = Object.entries(result.restored)
          .map(([key, count]) => `${dataTypeLabels[key as keyof typeof dataTypeLabels] || key}: ${count}件`)
          .join('\n');
        
        alert(`復元が完了しました:\n${restoredItems}`);
        
        if (result.backupCreated) {
          alert(`復元前のバックアップを作成しました: ${result.backupCreated}`);
        }
        
        loadBackupHistory();
        onRestoreComplete?.();
      } else {
        const errorMessages = result.errors.join('\n');
        alert(`復元中にエラーが発生しました:\n${errorMessages}`);
      }

    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  /**
   * ファイル選択ハンドラ
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleRestore(file);
    }
  };

  /**
   * データタイプの選択切り替え
   */
  const toggleDataType = (dataType: string) => {
    if (selectedDataTypes.includes(dataType)) {
      setSelectedDataTypes(selectedDataTypes.filter(t => t !== dataType));
    } else {
      setSelectedDataTypes([...selectedDataTypes, dataType]);
    }
  };

  /**
   * バックアップ履歴の削除
   */
  const handleDeleteHistory = (id: string) => {
    const confirmed = confirm('このバックアップ履歴を削除しますか？');
    if (confirmed) {
      backupService.deleteBackupHistory(id);
      loadBackupHistory();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          バックアップ・復元
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="backup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              バックアップ
            </TabsTrigger>
            <TabsTrigger value="restore" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              復元
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              履歴
            </TabsTrigger>
          </TabsList>

          {/* バックアップタブ */}
          <TabsContent value="backup" className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                システムデータのバックアップを作成します。
                定期的にバックアップを作成することを推奨します。
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {/* バックアップ説明 */}
              <div>
                <Label htmlFor="description">バックアップの説明</Label>
                <Input
                  id="description"
                  placeholder="例：月次バックアップ、データ変更前のバックアップ"
                  value={backupDescription}
                  onChange={(e) => setBackupDescription(e.target.value)}
                />
              </div>

              {/* データタイプ選択 */}
              <div>
                <Label className="text-sm font-medium">バックアップ対象（部分バックアップ用）</Label>
                <div className="mt-2 space-y-2">
                  {Object.entries(dataTypeLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={selectedDataTypes.includes(key)}
                        onCheckedChange={() => toggleDataType(key)}
                      />
                      <Label htmlFor={key} className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 処理状況 */}
              {isProcessing && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">{currentStep}</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {/* バックアップ実行ボタン */}
              <div className="flex gap-2">
                <Button
                  onClick={handleFullBackup}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  完全バックアップ
                </Button>
                <Button
                  onClick={handlePartialBackup}
                  disabled={isProcessing || selectedDataTypes.length === 0}
                  variant="outline"
                  className="flex-1"
                >
                  <Database className="h-4 w-4 mr-2" />
                  部分バックアップ
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* 復元タブ */}
          <TabsContent value="restore" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                バックアップファイルからデータを復元します。
                復元前に現在のデータのバックアップを作成することを推奨します。
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {/* 復元オプション */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">復元オプション</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="backup-before-restore"
                      checked={restoreOptions.backupBeforeRestore}
                      onCheckedChange={(checked) => 
                        setRestoreOptions(prev => ({ ...prev, backupBeforeRestore: !!checked }))
                      }
                    />
                    <Label htmlFor="backup-before-restore" className="text-sm">
                      復元前に自動バックアップを作成
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="overwrite-existing"
                      checked={restoreOptions.overwriteExisting}
                      onCheckedChange={(checked) => 
                        setRestoreOptions(prev => ({ ...prev, overwriteExisting: !!checked }))
                      }
                    />
                    <Label htmlFor="overwrite-existing" className="text-sm">
                      既存データを上書き
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skip-validation"
                      checked={restoreOptions.skipValidation}
                      onCheckedChange={(checked) => 
                        setRestoreOptions(prev => ({ ...prev, skipValidation: !!checked }))
                      }
                    />
                    <Label htmlFor="skip-validation" className="text-sm">
                      バリデーションをスキップ（高速復元）
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* ファイル選択 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {!isProcessing ? (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        バックアップファイル（.json）を選択してください
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
                      <p className="text-sm font-medium">{currentStep}</p>
                      <Progress value={progress} className="mt-2" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* 履歴タブ */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">バックアップ履歴</h3>
              <Button
                onClick={loadBackupHistory}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <History className="h-3 w-3" />
                更新
              </Button>
            </div>

            {backupHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                バックアップ履歴がありません
              </div>
            ) : (
              <div className="space-y-2">
                {backupHistory.map((backup) => (
                  <Card key={backup.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{backup.filename}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {backup.dataTypes.map(type => dataTypeLabels[type as keyof typeof dataTypeLabels]).join(', ')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(backup.createdAt).toLocaleString('ja-JP')}
                            </span>
                            <span>作成者: {backup.createdBy}</span>
                          </div>
                          <div className="mt-1">{backup.description}</div>
                          <div className="mt-1">
                            データ件数: {Object.entries(backup.recordCounts)
                              .map(([key, count]) => `${key}: ${count}件`)
                              .join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteHistory(backup.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}