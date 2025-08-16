'use client';

import React, { useState } from 'react';
import { 
  Check, X, Calendar, Clock, User, Building, 
  Settings, Trash2, Edit, Copy, Download,
  AlertTriangle, CheckCircle, FileText, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UnifiedInterviewReservation } from '@/components/interview/UnifiedInterviewDashboard';

export type BulkOperation = 
  | 'update_status'
  | 'update_urgency'
  | 'reschedule'
  | 'reassign'
  | 'add_notes'
  | 'export'
  | 'delete'
  | 'duplicate';

export interface BulkOperationConfig {
  operation: BulkOperation;
  newStatus?: string;
  newUrgency?: string;
  newDate?: Date;
  newTime?: string;
  newAssignee?: string;
  additionalNotes?: string;
  exportFormat?: 'pdf' | 'excel' | 'csv';
}

interface BulkOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReservations: UnifiedInterviewReservation[];
  onExecute: (config: BulkOperationConfig) => Promise<void>;
}

export default function BulkOperationsModal({
  isOpen,
  onClose,
  selectedReservations,
  onExecute
}: BulkOperationsModalProps) {
  const [selectedOperation, setSelectedOperation] = useState<BulkOperation>('update_status');
  const [config, setConfig] = useState<BulkOperationConfig>({
    operation: 'update_status'
  });
  const [isExecuting, setIsExecuting] = useState(false);

  // 操作実行
  const handleExecute = async () => {
    if (selectedReservations.length === 0) return;

    setIsExecuting(true);
    try {
      await onExecute({ ...config, operation: selectedOperation });
      onClose();
    } catch (error) {
      console.error('一括操作エラー:', error);
      alert('操作の実行中にエラーが発生しました');
    } finally {
      setIsExecuting(false);
    }
  };

  // 設定のリセット
  const handleReset = () => {
    setConfig({ operation: selectedOperation });
  };

  // 操作オプション
  const operationOptions = [
    { 
      value: 'update_status', 
      label: 'ステータス変更', 
      icon: RefreshCw,
      description: '選択した面談のステータスを一括変更'
    },
    { 
      value: 'update_urgency', 
      label: '緊急度変更', 
      icon: AlertTriangle,
      description: '選択した面談の緊急度を一括変更'
    },
    { 
      value: 'reschedule', 
      label: '日時変更', 
      icon: Calendar,
      description: '選択した面談の日時を一括変更'
    },
    { 
      value: 'reassign', 
      label: '担当者変更', 
      icon: User,
      description: '選択した面談の担当者を一括変更'
    },
    { 
      value: 'add_notes', 
      label: '備考追加', 
      icon: Edit,
      description: '選択した面談に備考を一括追加'
    },
    { 
      value: 'export', 
      label: 'エクスポート', 
      icon: Download,
      description: '選択した面談データを一括エクスポート'
    },
    { 
      value: 'duplicate', 
      label: '複製', 
      icon: Copy,
      description: '選択した面談を複製（日時調整が必要）'
    },
    { 
      value: 'delete', 
      label: '削除', 
      icon: Trash2,
      description: '選択した面談を一括削除（注意：元に戻せません）'
    }
  ];

  const currentOperation = operationOptions.find(op => op.value === selectedOperation);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-6 w-6 text-blue-600" />
            一括操作 - {selectedReservations.length}件選択中
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* 操作選択サイドバー */}
          <div className="w-64 bg-gray-50 border-r p-4">
            <Label className="text-sm font-medium mb-3 block">操作を選択</Label>
            <div className="space-y-2">
              {operationOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedOperation(option.value as BulkOperation)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedOperation === option.value
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 操作説明 */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {currentOperation && <currentOperation.icon className="h-5 w-5" />}
                  {currentOperation?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{currentOperation?.description}</p>
                
                {/* 選択された面談の概要 */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-2">対象面談</h4>
                  <div className="text-sm text-blue-700">
                    <p>選択数: {selectedReservations.length}件</p>
                    <p>部署: {Array.from(new Set(selectedReservations.map(r => r.department))).join(', ')}</p>
                    <p>タイプ: {Array.from(new Set(selectedReservations.map(r => r.type))).join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 操作設定 */}
            <Card>
              <CardHeader>
                <CardTitle>設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ステータス変更 */}
                {selectedOperation === 'update_status' && (
                  <div>
                    <Label>新しいステータス</Label>
                    <Select
                      value={config.newStatus || ''}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, newStatus: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ステータスを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">予定</SelectItem>
                        <SelectItem value="confirmed">確定</SelectItem>
                        <SelectItem value="in_progress">実施中</SelectItem>
                        <SelectItem value="completed">完了</SelectItem>
                        <SelectItem value="cancelled">キャンセル</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 緊急度変更 */}
                {selectedOperation === 'update_urgency' && (
                  <div>
                    <Label>新しい緊急度</Label>
                    <Select
                      value={config.newUrgency || ''}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, newUrgency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="緊急度を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="urgent">緊急</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 日時変更 */}
                {selectedOperation === 'reschedule' && (
                  <div className="space-y-3">
                    <div>
                      <Label>新しい日付</Label>
                      <Input
                        type="date"
                        value={config.newDate?.toISOString().split('T')[0] || ''}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          newDate: e.target.value ? new Date(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                    <div>
                      <Label>新しい時刻</Label>
                      <Input
                        type="time"
                        value={config.newTime || ''}
                        onChange={(e) => setConfig(prev => ({ ...prev, newTime: e.target.value }))}
                      />
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-sm text-yellow-800">
                        ⚠️ 全ての面談が同じ日時に変更されます。時間が重複しないよう注意してください。
                      </p>
                    </div>
                  </div>
                )}

                {/* 担当者変更 */}
                {selectedOperation === 'reassign' && (
                  <div>
                    <Label>新しい担当者</Label>
                    <Select
                      value={config.newAssignee || ''}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, newAssignee: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="担当者を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="田中師長">田中師長</SelectItem>
                        <SelectItem value="鈴木主任">鈴木主任</SelectItem>
                        <SelectItem value="佐々木師長">佐々木師長</SelectItem>
                        <SelectItem value="伊藤部長">伊藤部長</SelectItem>
                        <SelectItem value="渡辺主任">渡辺主任</SelectItem>
                        <SelectItem value="岩田課長">岩田課長</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 備考追加 */}
                {selectedOperation === 'add_notes' && (
                  <div>
                    <Label>追加する備考</Label>
                    <Textarea
                      placeholder="全ての選択された面談に追加される備考を入力..."
                      value={config.additionalNotes || ''}
                      onChange={(e) => setConfig(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      rows={4}
                    />
                  </div>
                )}

                {/* エクスポート */}
                {selectedOperation === 'export' && (
                  <div>
                    <Label>エクスポート形式</Label>
                    <Select
                      value={config.exportFormat || ''}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, exportFormat: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="形式を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 複製 */}
                {selectedOperation === 'duplicate' && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-800">
                      💡 選択された面談が複製されます。複製後に日時の調整が必要です。
                    </p>
                  </div>
                )}

                {/* 削除 */}
                {selectedOperation === 'delete' && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">危険な操作</span>
                    </div>
                    <p className="text-sm text-red-700">
                      この操作は元に戻すことができません。本当に削除してもよろしいですか？
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 選択された面談の詳細リスト */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>対象面談一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedReservations.map(reservation => (
                    <div key={reservation.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{reservation.staffName}</div>
                        <Badge variant="outline">{reservation.department}</Badge>
                        <div className="text-sm text-gray-600">
                          {new Date(reservation.scheduledDate).toLocaleDateString('ja-JP')} {reservation.scheduledTime}
                        </div>
                      </div>
                      <Badge 
                        className={
                          reservation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {reservation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            リセット
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button 
              onClick={handleExecute}
              disabled={isExecuting || selectedReservations.length === 0}
              className={
                selectedOperation === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : ''
              }
            >
              {isExecuting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              {isExecuting ? '実行中...' : '実行'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}