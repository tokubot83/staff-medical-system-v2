'use client';

/**
 * 要再検査者リストコンポーネント
 * Created: 2025-09-29
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  Calendar,
  User,
  Building2,
  FileText,
  Send,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ReexaminationData {
  total: number;
  list: Array<{
    id: string;
    staffId: string;
    checkupDate: string;
    overallResult?: string;
    reexaminationItems?: string;
    staff?: {
      name: string;
      department: string | null;
      position: string | null;
    };
  }>;
  byItems: Record<string, Array<{
    staffId: string;
    staffName: string;
    department: string;
    checkupDate: string;
    overallResult?: string;
  }>>;
  summary: {
    pending: number;
    recent: number;
  };
}

export function ReexaminationList() {
  const [data, setData] = useState<ReexaminationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  // データ取得
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (department) params.append('department', department);

      const response = await fetch(`/api/health/reexamination?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch reexamination data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [department]);

  // 日数計算
  const getDaysFromCheckup = (checkupDate: string) => {
    return differenceInDays(new Date(), new Date(checkupDate));
  };

  // 緊急度の判定
  const getUrgencyLevel = (days: number) => {
    if (days > 60) return { level: 'high', label: '緊急', color: 'bg-red-100 text-red-800' };
    if (days > 30) return { level: 'medium', label: '要対応', color: 'bg-orange-100 text-orange-800' };
    return { level: 'low', label: '通常', color: 'bg-yellow-100 text-yellow-800' };
  };

  // 一括通知送信
  const handleSendReminder = async () => {
    if (selectedStaff.length === 0) {
      alert('通知対象を選択してください');
      return;
    }

    // 通知送信処理（実装予定）
    console.log('Send reminder to:', selectedStaff);
    alert(`${selectedStaff.length}名に再検査通知を送信しました`);
    setSelectedStaff([]);
  };

  // 全選択/解除
  const handleSelectAll = () => {
    if (!data) return;

    if (selectedStaff.length === data.list.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(data.list.map(item => item.staffId));
    }
  };

  if (!data) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          データを読み込んでいます...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">要再検査者数</p>
                <p className="text-2xl font-bold">{data.total}名</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">30日以上未対応</p>
                <p className="text-2xl font-bold text-red-600">{data.summary.pending}名</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">30日以内</p>
                <p className="text-2xl font-bold text-yellow-600">{data.summary.recent}名</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フィルター */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">対象者フィルター</CardTitle>
            {selectedStaff.length > 0 && (
              <Button onClick={handleSendReminder} className="gap-2">
                <Send className="w-4 h-4" />
                {selectedStaff.length}名に通知送信
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">部署</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="全部署" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部署</SelectItem>
                  <SelectItem value="看護部">看護部</SelectItem>
                  <SelectItem value="医師">医師</SelectItem>
                  <SelectItem value="リハビリテーション科">リハビリテーション科</SelectItem>
                  <SelectItem value="事務部">事務部</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchData}>
              更新
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* タブ別リスト */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">全対象者</TabsTrigger>
          <TabsTrigger value="urgent">緊急対応</TabsTrigger>
          <TabsTrigger value="byItem">検査項目別</TabsTrigger>
        </TabsList>

        {/* 全対象者タブ */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">再検査対象者一覧</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedStaff.length === data.list.length ? '全解除' : '全選択'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedStaff.length === data.list.length}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>職員ID</TableHead>
                    <TableHead>氏名</TableHead>
                    <TableHead>部署</TableHead>
                    <TableHead>健診日</TableHead>
                    <TableHead>経過日数</TableHead>
                    <TableHead>緊急度</TableHead>
                    <TableHead>再検査項目</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.list.map((item) => {
                    const days = getDaysFromCheckup(item.checkupDate);
                    const urgency = getUrgencyLevel(days);

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedStaff.includes(item.staffId)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStaff([...selectedStaff, item.staffId]);
                              } else {
                                setSelectedStaff(selectedStaff.filter(id => id !== item.staffId));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>{item.staffId}</TableCell>
                        <TableCell className="font-medium">
                          {item.staff?.name || '-'}
                        </TableCell>
                        <TableCell>{item.staff?.department || '-'}</TableCell>
                        <TableCell>
                          {format(new Date(item.checkupDate), 'yyyy/MM/dd', { locale: ja })}
                        </TableCell>
                        <TableCell>
                          <span className={days > 30 ? 'text-red-600 font-bold' : ''}>
                            {days}日
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={urgency.color}>
                            {urgency.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="text-sm truncate">
                            {item.reexaminationItems || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" title="詳細">
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="通知">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="電話">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 緊急対応タブ */}
        <TabsContent value="urgent">
          <Card>
            <CardContent className="py-6">
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  30日以上経過している未対応者です。至急フォローアップをお願いします。
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {data.list
                  .filter(item => getDaysFromCheckup(item.checkupDate) > 30)
                  .map(item => (
                    <div key={item.id} className="border rounded-lg p-4 bg-red-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{item.staff?.name}</span>
                            <Badge variant="destructive">
                              {getDaysFromCheckup(item.checkupDate)}日経過
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3 h-3" />
                              {item.staff?.department}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              健診日: {format(new Date(item.checkupDate), 'yyyy年MM月dd日')}
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3" />
                              要再検査: {item.reexaminationItems}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">連絡する</Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 検査項目別タブ */}
        <TabsContent value="byItem">
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                {Object.entries(data.byItems).map(([itemName, staffList]) => (
                  <div key={itemName} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">{itemName}</h3>
                      <Badge>{staffList.length}名</Badge>
                    </div>
                    <div className="space-y-2">
                      {staffList.map(staff => (
                        <div key={staff.staffId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span>{staff.staffName}</span>
                            <span className="text-gray-500">{staff.department}</span>
                          </div>
                          <span className="text-gray-500">
                            {format(new Date(staff.checkupDate), 'MM/dd')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}