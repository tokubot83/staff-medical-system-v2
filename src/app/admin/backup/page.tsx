'use client';

import React, { useState, useEffect, useRef } from 'react';
import { backupService, BackupMetadata, BackupSchedule, BackupData } from '@/services/backupService';
import { 
  Download, Upload, Clock, Calendar, Trash2, 
  Play, Plus, Settings, Shield, CheckCircle,
  AlertCircle, FileDown, FileUp, Database,
  Save, RefreshCw, History, Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function BackupPage() {
  const [backupHistory, setBackupHistory] = useState<BackupMetadata[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [backupName, setBackupName] = useState('');
  const [backupDescription, setBackupDescription] = useState('');
  const [showCreateBackupDialog, setShowCreateBackupDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [restoreResult, setRestoreResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // スケジュール設定用
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [scheduleTime, setScheduleTime] = useState('02:00');
  const [scheduleDayOfWeek, setScheduleDayOfWeek] = useState(1);
  const [scheduleDayOfMonth, setScheduleDayOfMonth] = useState(1);
  const [scheduleRetentionDays, setScheduleRetentionDays] = useState(30);
  const [scheduleDataTypes, setScheduleDataTypes] = useState<string[]>([]);

  const availableDataTypes = backupService.getAvailableDataTypes();

  useEffect(() => {
    loadData();
    // 定期的にスケジュールをチェック（実際の実装ではサーバーサイドで処理）
    const interval = setInterval(() => {
      backupService.checkAndExecuteScheduledBackups();
      loadData();
    }, 60000); // 1分ごとにチェック
    
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setBackupHistory(backupService.getBackupHistory());
    setSchedules(backupService.getSchedules());
  };

  const handleCreateBackup = async () => {
    if (!backupName || selectedDataTypes.length === 0) {
      alert('バックアップ名とデータタイプを選択してください');
      return;
    }

    setIsProcessing(true);
    try {
      const backup = await backupService.createBackup(
        backupName,
        selectedDataTypes,
        backupDescription
      );
      
      // 自動ダウンロード
      await backupService.downloadBackup(backup, 'json');
      
      loadData();
      setShowCreateBackupDialog(false);
      resetBackupForm();
    } catch (error) {
      console.error('Backup failed:', error);
      alert('バックアップの作成に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;

    setIsProcessing(true);
    try {
      const result = await backupService.restoreBackup(selectedBackup);
      setRestoreResult(result);
      
      if (result.success) {
        setTimeout(() => {
          setShowRestoreDialog(false);
          setRestoreResult(null);
          setSelectedBackup(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Restore failed:', error);
      alert('リストアに失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const backupData = await backupService.uploadBackup(file);
      if (backupData) {
        setSelectedBackup(backupData);
        setShowRestoreDialog(true);
      }
    } catch (error) {
      console.error('Failed to load backup file:', error);
      alert('バックアップファイルの読み込みに失敗しました');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateSchedule = async () => {
    if (!scheduleName || scheduleDataTypes.length === 0) {
      alert('スケジュール名とデータタイプを選択してください');
      return;
    }

    try {
      await backupService.createSchedule({
        name: scheduleName,
        frequency: scheduleFrequency,
        time: scheduleTime,
        dayOfWeek: scheduleFrequency === 'weekly' ? scheduleDayOfWeek : undefined,
        dayOfMonth: scheduleFrequency === 'monthly' ? scheduleDayOfMonth : undefined,
        dataTypes: scheduleDataTypes,
        retentionDays: scheduleRetentionDays,
        isActive: true,
      });
      
      loadData();
      setShowScheduleDialog(false);
      resetScheduleForm();
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('スケジュールの作成に失敗しました');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (confirm('このスケジュールを削除してもよろしいですか？')) {
      await backupService.deleteSchedule(id);
      loadData();
    }
  };

  const handleToggleSchedule = async (schedule: BackupSchedule) => {
    await backupService.updateSchedule(schedule.id, {
      isActive: !schedule.isActive,
    });
    loadData();
  };

  const handleDeleteBackup = (id: string) => {
    if (confirm('このバックアップ履歴を削除してもよろしいですか？')) {
      backupService.deleteBackupHistory(id);
      loadData();
    }
  };

  const resetBackupForm = () => {
    setBackupName('');
    setBackupDescription('');
    setSelectedDataTypes([]);
  };

  const resetScheduleForm = () => {
    setScheduleName('');
    setScheduleFrequency('daily');
    setScheduleTime('02:00');
    setScheduleDayOfWeek(1);
    setScheduleDayOfMonth(1);
    setScheduleRetentionDays(30);
    setScheduleDataTypes([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Database className="h-6 w-6 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">バックアップ・リストア管理</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                データ保護
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                <FileUp className="h-4 w-4 mr-2" />
                リストア
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button
                onClick={() => setShowCreateBackupDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                バックアップ作成
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              バックアップ履歴
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Timer className="h-4 w-4 mr-2" />
              スケジュール設定
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>バックアップ履歴</CardTitle>
                <CardDescription>
                  過去のバックアップ一覧です。必要に応じてダウンロードまたは削除できます。
                </CardDescription>
              </CardHeader>
              <CardContent>
                {backupHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>バックアップ履歴がありません</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>名前</TableHead>
                        <TableHead>作成日時</TableHead>
                        <TableHead>サイズ</TableHead>
                        <TableHead>データタイプ</TableHead>
                        <TableHead>種別</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backupHistory.map(backup => (
                        <TableRow key={backup.id}>
                          <TableCell className="font-medium">
                            {backup.name}
                            {backup.description && (
                              <p className="text-xs text-gray-500 mt-1">{backup.description}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(backup.createdAt).toLocaleString('ja-JP')}
                          </TableCell>
                          <TableCell>{formatFileSize(backup.size)}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {backup.dataTypes.map(type => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {availableDataTypes.find(dt => dt.key === type)?.label || type}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {backup.isScheduled ? (
                              <Badge className="bg-blue-100 text-blue-800">自動</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">手動</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => handleDeleteBackup(backup.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>定期バックアップスケジュール</CardTitle>
                <CardDescription>
                  自動バックアップのスケジュールを設定できます。
                </CardDescription>
                <div className="mt-4">
                  <Button
                    onClick={() => setShowScheduleDialog(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    スケジュール追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {schedules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>スケジュールが設定されていません</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>名前</TableHead>
                        <TableHead>頻度</TableHead>
                        <TableHead>実行時刻</TableHead>
                        <TableHead>データタイプ</TableHead>
                        <TableHead>保持期間</TableHead>
                        <TableHead>次回実行</TableHead>
                        <TableHead>状態</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map(schedule => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">{schedule.name}</TableCell>
                          <TableCell>
                            {schedule.frequency === 'daily' && '毎日'}
                            {schedule.frequency === 'weekly' && '毎週'}
                            {schedule.frequency === 'monthly' && '毎月'}
                          </TableCell>
                          <TableCell>{schedule.time}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {schedule.dataTypes.slice(0, 2).map(type => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {availableDataTypes.find(dt => dt.key === type)?.label || type}
                                </Badge>
                              ))}
                              {schedule.dataTypes.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{schedule.dataTypes.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{schedule.retentionDays}日</TableCell>
                          <TableCell>
                            {schedule.nextRun && new Date(schedule.nextRun).toLocaleString('ja-JP')}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleToggleSchedule(schedule)}
                              variant="ghost"
                              size="sm"
                            >
                              {schedule.isActive ? (
                                <Badge className="bg-green-100 text-green-800">有効</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">無効</Badge>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Alert className="mt-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">データ保護について</AlertTitle>
          <AlertDescription className="text-blue-700">
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>バックアップファイルは安全な場所に保管してください</li>
              <li>定期的なバックアップを推奨します（最低週1回）</li>
              <li>リストア前に現在のデータをバックアップすることをお勧めします</li>
              <li>バックアップファイルにはセンシティブな情報が含まれる可能性があります</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      {/* バックアップ作成ダイアログ */}
      <Dialog open={showCreateBackupDialog} onOpenChange={setShowCreateBackupDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>バックアップの作成</DialogTitle>
            <DialogDescription>
              バックアップするデータタイプを選択してください。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">バックアップ名 *</label>
              <Input
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="例: 2025年8月定期バックアップ"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">説明</label>
              <Textarea
                value={backupDescription}
                onChange={(e) => setBackupDescription(e.target.value)}
                placeholder="バックアップの目的や内容を記載"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">データタイプ *</label>
              <div className="mt-2 space-y-2">
                {availableDataTypes.map(type => (
                  <label key={type.key} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedDataTypes.includes(type.key)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDataTypes([...selectedDataTypes, type.key]);
                        } else {
                          setSelectedDataTypes(selectedDataTypes.filter(t => t !== type.key));
                        }
                      }}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => setShowCreateBackupDialog(false)}
              variant="outline"
              disabled={isProcessing}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleCreateBackup}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isProcessing || !backupName || selectedDataTypes.length === 0}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  作成中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  バックアップ作成
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* スケジュール作成ダイアログ */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>定期バックアップスケジュールの作成</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">スケジュール名 *</label>
              <Input
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                placeholder="例: 毎日深夜バックアップ"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">頻度</label>
                <Select value={scheduleFrequency} onValueChange={(v: any) => setScheduleFrequency(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">毎日</SelectItem>
                    <SelectItem value="weekly">毎週</SelectItem>
                    <SelectItem value="monthly">毎月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">実行時刻</label>
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">保持期間（日）</label>
              <Input
                type="number"
                value={scheduleRetentionDays}
                onChange={(e) => setScheduleRetentionDays(Number(e.target.value))}
                className="mt-1"
                min={1}
                max={365}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">データタイプ *</label>
              <div className="mt-2 space-y-2">
                {availableDataTypes.map(type => (
                  <label key={type.key} className="flex items-center space-x-2">
                    <Checkbox
                      checked={scheduleDataTypes.includes(type.key)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setScheduleDataTypes([...scheduleDataTypes, type.key]);
                        } else {
                          setScheduleDataTypes(scheduleDataTypes.filter(t => t !== type.key));
                        }
                      }}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => setShowScheduleDialog(false)}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleCreateSchedule}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!scheduleName || scheduleDataTypes.length === 0}
            >
              <Clock className="h-4 w-4 mr-2" />
              スケジュール作成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* リストアダイアログ */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>データのリストア</DialogTitle>
            <DialogDescription>
              バックアップからデータを復元します。現在のデータは上書きされます。
            </DialogDescription>
          </DialogHeader>
          
          {selectedBackup && !restoreResult && (
            <div className="space-y-4 py-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  リストアを実行すると、現在のデータが上書きされます。
                  事前に現在のデータをバックアップすることをお勧めします。
                </AlertDescription>
              </Alert>
              
              <div>
                <p className="text-sm font-medium mb-2">リストア内容:</p>
                <div className="space-y-1">
                  {selectedBackup.metadata.dataTypes.map(type => (
                    <div key={type} className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      {availableDataTypes.find(dt => dt.key === type)?.label || type}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {restoreResult && (
            <div className="py-4">
              {restoreResult.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">リストア完了</AlertTitle>
                  <AlertDescription className="text-green-700">
                    <div className="mt-2 space-y-1">
                      {Object.entries(restoreResult.recordCounts).map(([type, count]) => (
                        <div key={type}>
                          {availableDataTypes.find(dt => dt.key === type)?.label || type}: {count as number}件
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">リストア失敗</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {restoreResult.errors?.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              onClick={() => {
                setShowRestoreDialog(false);
                setSelectedBackup(null);
                setRestoreResult(null);
              }}
              variant="outline"
            >
              {restoreResult ? '閉じる' : 'キャンセル'}
            </Button>
            {!restoreResult && (
              <Button
                onClick={handleRestore}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    リストア中...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    リストア実行
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}