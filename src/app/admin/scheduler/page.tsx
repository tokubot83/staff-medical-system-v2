'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, Plus, Play, Pause, Trash2, Edit, 
  Calendar, RefreshCw, CheckCircle, XCircle,
  AlertCircle, Download, Upload, Settings,
  ChevronRight, Save, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { schedulerService, type ScheduledTask, type TaskFilter } from '@/services/schedulerService';

export default function SchedulerPage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({});
  const [statistics, setStatistics] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'backup' as 'backup' | 'report' | 'sync' | 'cleanup' | 'notification' | 'custom',
    scheduleType: 'daily' as 'daily' | 'weekly' | 'monthly',
    time: '00:00',
    dayOfWeek: 1,
    dayOfMonth: 1,
    enabled: true,
  });

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = () => {
    const filteredTasks = schedulerService.getTasks(filter);
    setTasks(filteredTasks);
    const stats = schedulerService.getStatistics();
    setStatistics(stats);
  };

  const handleCreateTask = () => {
    const newTask = schedulerService.createTask({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      schedule: {
        type: formData.scheduleType,
        time: formData.time,
        dayOfWeek: formData.scheduleType === 'weekly' ? formData.dayOfWeek : undefined,
        dayOfMonth: formData.scheduleType === 'monthly' ? formData.dayOfMonth : undefined,
      },
      config: {},
      enabled: formData.enabled,
    });
    
    setIsCreating(false);
    resetForm();
    loadTasks();
  };

  const handleUpdateTask = (id: string, updates: Partial<ScheduledTask>) => {
    schedulerService.updateTask(id, updates);
    loadTasks();
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('このタスクを削除してもよろしいですか？')) {
      schedulerService.deleteTask(id);
      loadTasks();
    }
  };

  const handleRunTask = (id: string) => {
    schedulerService.runTask(id);
    setTimeout(() => loadTasks(), 100);
    setTimeout(() => loadTasks(), 2500);
  };

  const handleExport = () => {
    const data = schedulerService.exportTasks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scheduled-tasks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'backup' as 'backup' | 'report' | 'sync' | 'cleanup' | 'notification' | 'custom',
      scheduleType: 'daily' as 'daily' | 'weekly' | 'monthly',
      time: '00:00',
      dayOfWeek: 1,
      dayOfMonth: 1,
      enabled: true,
    });
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      backup: '💾',
      report: '📊',
      sync: '🔄',
      cleanup: '🧹',
      notification: '📬',
      custom: '⚙️',
    };
    return icons[type] || '📝';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      idle: { className: 'bg-gray-100 text-gray-800', label: '待機中' },
      running: { className: 'bg-blue-100 text-blue-800', label: '実行中' },
      completed: { className: 'bg-green-100 text-green-800', label: '完了' },
      failed: { className: 'bg-red-100 text-red-800', label: '失敗' },
    };
    const variant = variants[status] || variants.idle;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const formatSchedule = (task: ScheduledTask) => {
    const { schedule } = task;
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    
    switch (schedule.type) {
      case 'once':
        return `一度のみ ${schedule.time || ''}`;
      case 'daily':
        return `毎日 ${schedule.time || '00:00'}`;
      case 'weekly':
        return `毎週${dayNames[schedule.dayOfWeek || 0]}曜日 ${schedule.time || '00:00'}`;
      case 'monthly':
        return `毎月${schedule.dayOfMonth}日 ${schedule.time || '00:00'}`;
      default:
        return schedule.type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Clock className="h-6 w-6 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">バッチ処理スケジューラー</h1>
              <Badge variant="secondary">
                {statistics?.total || 0} タスク
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadTasks()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-1" />
                エクスポート
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                新規タスク
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 統計情報 */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  総タスク数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  有効
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.enabled}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  無効
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {statistics.disabled}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  実行中
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.byStatus?.running || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* フィルター */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">フィルター</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select
                value={filter.type || 'all'}
                onValueChange={(value) => setFilter({ ...filter, type: value === 'all' ? undefined : value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="タスクタイプ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="backup">バックアップ</SelectItem>
                  <SelectItem value="report">レポート</SelectItem>
                  <SelectItem value="sync">同期</SelectItem>
                  <SelectItem value="cleanup">クリーンアップ</SelectItem>
                  <SelectItem value="notification">通知</SelectItem>
                  <SelectItem value="custom">カスタム</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filter.enabled === undefined ? 'all' : filter.enabled.toString()}
                onValueChange={(value) => setFilter({ ...filter, enabled: value === 'all' ? undefined : value === 'true' })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="true">有効</SelectItem>
                  <SelectItem value="false">無効</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* タスク一覧 */}
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(task.type)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{task.name}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-600">{task.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatSchedule(task)}</span>
                      </div>
                      {task.lastRun && (
                        <div className="text-gray-500">
                          最終実行: {new Date(task.lastRun).toLocaleString('ja-JP')}
                        </div>
                      )}
                      {task.nextRun && task.enabled && (
                        <div className="text-blue-600">
                          次回実行: {new Date(task.nextRun).toLocaleString('ja-JP')}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(task.status)}
                      <Badge variant="outline" className="text-xs">
                        {task.type}
                      </Badge>
                      {!task.enabled && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-600">
                          無効
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={task.enabled}
                      onCheckedChange={(checked) => handleUpdateTask(task.id, { enabled: checked })}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRunTask(task.id)}
                      disabled={task.status === 'running'}
                    >
                      {task.status === 'running' ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTask(task)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* 実行履歴 */}
                {selectedTask?.id === task.id && task.history.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">実行履歴</h4>
                    <div className="space-y-2">
                      {task.history.slice(0, 5).map((history) => (
                        <div key={history.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {history.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>{new Date(history.startTime).toLocaleString('ja-JP')}</span>
                            <span className="text-gray-500">{history.message}</span>
                          </div>
                          {history.details && (
                            <Badge variant="outline" className="text-xs">
                              {Object.entries(history.details)[0]?.[0]}: {Object.entries(history.details)[0]?.[1]}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">スケジュールされたタスクがありません</p>
              <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                最初のタスクを作成
              </Button>
            </CardContent>
          </Card>
        )}

        {/* タスク作成モーダル */}
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>新規タスク作成</CardTitle>
                <CardDescription>
                  定期実行するタスクを設定します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">タスク名</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例: 日次バックアップ"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">説明</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="タスクの詳細説明"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">タスクタイプ</label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="backup">バックアップ</SelectItem>
                        <SelectItem value="report">レポート</SelectItem>
                        <SelectItem value="sync">同期</SelectItem>
                        <SelectItem value="cleanup">クリーンアップ</SelectItem>
                        <SelectItem value="notification">通知</SelectItem>
                        <SelectItem value="custom">カスタム</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">スケジュール</label>
                    <Select
                      value={formData.scheduleType}
                      onValueChange={(value: any) => setFormData({ ...formData, scheduleType: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">一度のみ</SelectItem>
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
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  {formData.scheduleType === 'weekly' && (
                    <div>
                      <label className="text-sm font-medium">曜日</label>
                      <Select
                        value={formData.dayOfWeek.toString()}
                        onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">日曜日</SelectItem>
                          <SelectItem value="1">月曜日</SelectItem>
                          <SelectItem value="2">火曜日</SelectItem>
                          <SelectItem value="3">水曜日</SelectItem>
                          <SelectItem value="4">木曜日</SelectItem>
                          <SelectItem value="5">金曜日</SelectItem>
                          <SelectItem value="6">土曜日</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {formData.scheduleType === 'monthly' && (
                    <div>
                      <label className="text-sm font-medium">日付</label>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={formData.dayOfMonth}
                        onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">有効化</label>
                    <Switch
                      checked={formData.enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      resetForm();
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    キャンセル
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleCreateTask}
                    disabled={!formData.name}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    作成
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}