'use client';

import React, { useState, useEffect } from 'react';
import CommonHeader from '@/components/CommonHeader';
import { 
  FileText, Download, Filter, Calendar, 
  User, Activity, RefreshCw, Trash2,
  CheckCircle, XCircle, AlertTriangle,
  Search, ChevronRight, Clock
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
import { auditLogService, type AuditLog, type AuditLogFilter } from '@/services/auditLogService';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState<AuditLogFilter>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLogs();
    loadMetadata();
  }, [filter]);

  const loadLogs = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filteredLogs = auditLogService.getLogs(filter);
      setLogs(filteredLogs);
      const stats = auditLogService.getStatistics(filter);
      setStatistics(stats);
      setIsLoading(false);
    }, 300);
  };

  const loadMetadata = () => {
    setCategories(auditLogService.getCategories());
    setActions(auditLogService.getActions());
  };

  const handleExport = (format: 'csv' | 'json') => {
    const content = auditLogService.exportLogs(filter, format);
    const blob = new Blob([content], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (confirm('過去30日以前のログを削除しますか？')) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const deletedCount = auditLogService.clearLogs(thirtyDaysAgo.toISOString());
      alert(`${deletedCount}件のログを削除しました`);
      loadLogs();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      success: { className: 'bg-green-100 text-green-800 border-green-200' },
      failure: { className: 'bg-red-100 text-red-800 border-red-200' },
      warning: { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    };
    return (
      <Badge variant="outline" className={variants[status]?.className}>
        {status === 'success' ? '成功' : status === 'failure' ? '失敗' : '警告'}
      </Badge>
    );
  };

  return (
    <div>
      <div className="print:hidden">
        <CommonHeader title="監査ログ" />
      </div>
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-900">監査ログ</h1>
                <Badge variant="secondary">
                  {statistics?.total || 0} 件
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadLogs()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
              >
                <Download className="h-4 w-4 mr-1" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearLogs}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                古いログを削除
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
                  総ログ数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  成功
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.byStatus.success}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  失敗
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {statistics.byStatus.failure}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  警告
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {statistics.byStatus.warning}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* フィルター */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              フィルター
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  開始日
                </label>
                <Input
                  type="date"
                  value={filter.startDate || ''}
                  onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  終了日
                </label>
                <Input
                  type="date"
                  value={filter.endDate || ''}
                  onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  カテゴリ
                </label>
                <Select
                  value={filter.category || ''}
                  onValueChange={(value) => setFilter({ ...filter, category: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  ステータス
                </label>
                <Select
                  value={filter.status || ''}
                  onValueChange={(value) => setFilter({ ...filter, status: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="success">成功</SelectItem>
                    <SelectItem value="failure">失敗</SelectItem>
                    <SelectItem value="warning">警告</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ユーザー名、アクション、リソースで検索..."
                  value={filter.searchTerm || ''}
                  onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ログ一覧 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ログ履歴</CardTitle>
            <CardDescription>
              システムの操作履歴と監査ログを表示します
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : logs.length === 0 ? (
              <Alert>
                <AlertDescription>
                  フィルター条件に一致するログがありません
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {logs.slice(0, 100).map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(log.status)}
                          <span className="font-medium">{log.action}</span>
                          <span className="text-gray-500">-</span>
                          <span className="text-gray-700">{log.resource}</span>
                          {log.resourceId && (
                            <Badge variant="outline" className="text-xs">
                              {log.resourceId}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.userName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(log.timestamp).toLocaleString('ja-JP')}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {log.category}
                          </Badge>
                        </div>
                        {log.details && (
                          <div className="mt-1 text-sm text-gray-600">
                            {log.details}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(log.status)}
                        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                          selectedLog?.id === log.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>
                    
                    {selectedLog?.id === log.id && (
                      <div className="mt-4 pt-4 border-t">
                        <dl className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <dt className="font-medium text-gray-600">ログID</dt>
                            <dd className="font-mono text-xs">{log.id}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-gray-600">ユーザーID</dt>
                            <dd>{log.userId}</dd>
                          </div>
                          {log.ipAddress && (
                            <div>
                              <dt className="font-medium text-gray-600">IPアドレス</dt>
                              <dd>{log.ipAddress}</dd>
                            </div>
                          )}
                          {log.userAgent && (
                            <div>
                              <dt className="font-medium text-gray-600">ユーザーエージェント</dt>
                              <dd className="text-xs">{log.userAgent}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                ))}
                
                {logs.length > 100 && (
                  <Alert>
                    <AlertDescription>
                      最初の100件を表示しています。すべてのログをエクスポートするには上部のエクスポートボタンを使用してください。
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}