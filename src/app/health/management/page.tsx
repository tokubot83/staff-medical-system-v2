'use client';

/**
 * 健康診断管理画面
 * Created: 2025-09-29
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Upload,
  Download,
  Calendar,
  Users,
  AlertCircle,
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CsvImportDialog } from '@/components/health/CsvImportDialog';

interface HealthCheckup {
  id: string;
  staffId: string;
  checkupDate: string;
  overallResult?: string;
  reexaminationRequired: boolean;
  reexaminationItems?: string;
  staff?: {
    id: string;
    name: string;
    department: string | null;
    position: string | null;
  };
}

interface Statistics {
  totalCheckups: number;
  completionRate: number;
  reexaminationRate: number;
  resultDistribution: Record<string, number>;
}

export default function HealthManagementPage() {
  // State
  const [activeTab, setActiveTab] = useState('list');
  const [checkups, setCheckups] = useState<HealthCheckup[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    staffName: '',
    department: '',
    dateFrom: '',
    dateTo: '',
    overallResult: '',
    reexaminationRequired: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const [showImportDialog, setShowImportDialog] = useState(false);

  // データ取得
  const fetchCheckups = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (searchParams.department) queryParams.append('department', searchParams.department);
      if (searchParams.dateFrom) queryParams.append('dateFrom', searchParams.dateFrom);
      if (searchParams.dateTo) queryParams.append('dateTo', searchParams.dateTo);
      if (searchParams.overallResult) queryParams.append('overallResult', searchParams.overallResult);
      if (searchParams.reexaminationRequired) queryParams.append('reexaminationRequired', searchParams.reexaminationRequired);

      queryParams.append('page', pagination.page.toString());
      queryParams.append('pageSize', pagination.pageSize.toString());

      const response = await fetch(`/api/health/checkups?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setCheckups(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Failed to fetch checkups:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, pagination.page, pagination.pageSize]);

  // 統計データ取得
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch('/api/health/statistics');
      const result = await response.json();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  useEffect(() => {
    fetchCheckups();
    fetchStatistics();
  }, [fetchCheckups, fetchStatistics]);

  // 検索実行
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCheckups();
  };

  // リセット
  const handleReset = () => {
    setSearchParams({
      staffName: '',
      department: '',
      dateFrom: '',
      dateTo: '',
      overallResult: '',
      reexaminationRequired: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // インポート完了
  const handleImportComplete = () => {
    setShowImportDialog(false);
    fetchCheckups();
    fetchStatistics();
  };

  // 結果バッジの色
  const getResultBadgeColor = (result?: string) => {
    switch (result) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'E': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">健康診断管理</h1>
          <p className="text-muted-foreground mt-1">
            職員の健康診断データを管理します
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowImportDialog(true)}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            CSVインポート
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">実施件数</p>
                  <p className="text-2xl font-bold">{statistics.totalCheckups}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">実施率</p>
                  <p className="text-2xl font-bold">{statistics.completionRate.toFixed(1)}%</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">要再検査率</p>
                  <p className="text-2xl font-bold">{statistics.reexaminationRate.toFixed(1)}%</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">異常なし</p>
                  <p className="text-2xl font-bold">
                    {statistics.resultDistribution['A'] || 0}名
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">一覧</TabsTrigger>
          <TabsTrigger value="reexamination">要再検査</TabsTrigger>
          <TabsTrigger value="analysis">分析</TabsTrigger>
        </TabsList>

        {/* 一覧タブ */}
        <TabsContent value="list" className="space-y-4">
          {/* 検索フィルター */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                検索フィルター
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="department">部署</Label>
                  <Input
                    id="department"
                    placeholder="部署名"
                    value={searchParams.department}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dateFrom">実施日（開始）</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={searchParams.dateFrom}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">実施日（終了）</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={searchParams.dateTo}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="overallResult">総合判定</Label>
                  <Select
                    value={searchParams.overallResult}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, overallResult: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">全て</SelectItem>
                      <SelectItem value="A">A (異常なし)</SelectItem>
                      <SelectItem value="B">B (軽度異常)</SelectItem>
                      <SelectItem value="C">C (要経過観察)</SelectItem>
                      <SelectItem value="D">D (要精密検査)</SelectItem>
                      <SelectItem value="E">E (要治療)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reexamination">要再検査</Label>
                  <Select
                    value={searchParams.reexaminationRequired}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, reexaminationRequired: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">全て</SelectItem>
                      <SelectItem value="true">要再検査のみ</SelectItem>
                      <SelectItem value="false">再検査不要のみ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleReset}>
                  リセット
                </Button>
                <Button onClick={handleSearch} className="gap-2">
                  <Search className="w-4 h-4" />
                  検索
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* データテーブル */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">健診データ一覧</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>職員ID</TableHead>
                        <TableHead>氏名</TableHead>
                        <TableHead>部署</TableHead>
                        <TableHead>健診日</TableHead>
                        <TableHead>総合判定</TableHead>
                        <TableHead>要再検査</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkups.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            データがありません
                          </TableCell>
                        </TableRow>
                      ) : (
                        checkups.map((checkup) => (
                          <TableRow key={checkup.id}>
                            <TableCell>{checkup.staffId}</TableCell>
                            <TableCell>{checkup.staff?.name || '-'}</TableCell>
                            <TableCell>{checkup.staff?.department || '-'}</TableCell>
                            <TableCell>
                              {format(new Date(checkup.checkupDate), 'yyyy年MM月dd日', { locale: ja })}
                            </TableCell>
                            <TableCell>
                              <Badge className={getResultBadgeColor(checkup.overallResult)}>
                                {checkup.overallResult || '-'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {checkup.reexaminationRequired ? (
                                <Badge variant="destructive">要</Badge>
                              ) : (
                                <Badge variant="secondary">不要</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* ページネーション */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      全{pagination.total}件中 {(pagination.page - 1) * pagination.pageSize + 1}-
                      {Math.min(pagination.page * pagination.pageSize, pagination.total)}件を表示
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 要再検査タブ */}
        <TabsContent value="reexamination">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">要再検査者リスト</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  再検査が必要な職員のリストです。早急な対応をお願いします。
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                {/* 再検査者リストを表示 */}
                <p className="text-muted-foreground">実装予定</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 分析タブ */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">健診データ分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 結果分布グラフ */}
                <div>
                  <h3 className="font-medium mb-2">総合判定分布</h3>
                  <div className="space-y-2">
                    {statistics && Object.entries(statistics.resultDistribution).map(([result, count]) => (
                      <div key={result} className="flex items-center gap-2">
                        <Badge className={getResultBadgeColor(result)}>{result}</Badge>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-blue-500 h-4 rounded-full"
                            style={{ width: `${(count / statistics.totalCheckups) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{count}名</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* その他の分析 */}
                <div>
                  <h3 className="font-medium mb-2">部署別統計</h3>
                  <p className="text-muted-foreground">実装予定</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CSVインポートダイアログ */}
      <CsvImportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}