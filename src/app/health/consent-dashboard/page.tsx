/**
 * 同意状況ダッシュボード
 *
 * 健診担当者（レベル97）・産業医（レベル98）・システム管理者（レベル99）専用
 * 全職員のストレスチェック同意状況を一覧表示
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  InfoIcon,
  SearchIcon,
  DownloadIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsentDashboardData {
  statistics: {
    total: number;
    consented: number;
    notConsented: number;
    notSet: number;
    consentRate: number;
  };
  staffList: {
    staffId: string;
    name: string;
    department: string;
    position: string;
    implementationDate: Date | null;
    consentStatus: boolean | null;
    consentDate: Date | null;
    highStressFlag: boolean;
  }[];
}

export default function ConsentDashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ConsentDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // TODO: セッションから権限確認
  const userLevel = 97; // 仮のレベル（健診担当者）

  useEffect(() => {
    fetchConsentDashboard();
  }, []);

  const fetchConsentDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/health/consent-dashboard');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'データの取得に失敗しました');
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!data) return;

    const csvContent = [
      ['職員ID', '氏名', '部署', '役職', '実施日', '同意状況', '同意日', '高ストレス'],
      ...filteredStaffList.map((staff) => [
        staff.staffId,
        staff.name,
        staff.department,
        staff.position,
        staff.implementationDate
          ? new Date(staff.implementationDate).toLocaleDateString('ja-JP')
          : '未実施',
        staff.consentStatus === true
          ? '同意済み'
          : staff.consentStatus === false
          ? '不同意'
          : '未設定',
        staff.consentDate ? new Date(staff.consentDate).toLocaleDateString('ja-JP') : '',
        staff.highStressFlag ? 'あり' : 'なし',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `同意状況_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>データなし</AlertTitle>
          <AlertDescription>同意状況データが見つかりませんでした</AlertDescription>
        </Alert>
      </div>
    );
  }

  // 権限チェック
  if (userLevel < 97 || userLevel > 99) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>アクセス権限がありません</AlertTitle>
          <AlertDescription>
            このページは健診担当者（レベル97）以上のみアクセス可能です
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 検索フィルタリング
  const filteredStaffList = data.staffList.filter(
    (staff) =>
      staff.name.includes(searchQuery) ||
      staff.staffId.includes(searchQuery) ||
      staff.department.includes(searchQuery)
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ストレスチェック同意状況ダッシュボード</h1>
          <p className="text-muted-foreground mt-2">全職員の人事部共有同意状況を管理</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <DownloadIcon className="h-4 w-4 mr-2" />
          CSVエクスポート
        </Button>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">受検者数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.statistics.total}名</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              同意済み
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{data.statistics.consented}名</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircleIcon className="h-4 w-4 text-red-600" />
              不同意
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{data.statistics.notConsented}名</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MinusCircleIcon className="h-4 w-4 text-gray-400" />
              未設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">{data.statistics.notSet}名</div>
            <div className="text-xs text-muted-foreground mt-1">
              同意率: {data.statistics.consentRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 検索バー */}
      <div className="flex items-center gap-2">
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="職員名・職員ID・部署で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* 職員リスト */}
      <Card>
        <CardHeader>
          <CardTitle>同意状況一覧</CardTitle>
          <CardDescription>{filteredStaffList.length}名を表示</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>職員ID</TableHead>
                  <TableHead>氏名</TableHead>
                  <TableHead>部署</TableHead>
                  <TableHead>役職</TableHead>
                  <TableHead>実施日</TableHead>
                  <TableHead>高ストレス</TableHead>
                  <TableHead>同意状況</TableHead>
                  <TableHead>同意日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaffList.map((staff) => (
                  <TableRow key={staff.staffId}>
                    <TableCell className="font-mono text-sm">{staff.staffId}</TableCell>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>
                      {staff.implementationDate
                        ? new Date(staff.implementationDate).toLocaleDateString('ja-JP')
                        : '未実施'}
                    </TableCell>
                    <TableCell>
                      {staff.highStressFlag ? (
                        <Badge variant="destructive">該当</Badge>
                      ) : (
                        <Badge variant="outline">非該当</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {staff.consentStatus === true && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          同意済み
                        </Badge>
                      )}
                      {staff.consentStatus === false && (
                        <Badge variant="destructive">
                          <XCircleIcon className="h-3 w-3 mr-1" />
                          不同意
                        </Badge>
                      )}
                      {staff.consentStatus === null && (
                        <Badge variant="secondary">
                          <MinusCircleIcon className="h-3 w-3 mr-1" />
                          未設定
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {staff.consentDate
                        ? new Date(staff.consentDate).toLocaleDateString('ja-JP')
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>同意状況の確認について</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>個別の詳細結果は、本人の同意がある場合のみ閲覧できます</li>
            <li>高ストレス該当者の面談勧奨は産業医が実施します</li>
            <li>同意を促すことは本人の自由意思を侵害する可能性があるため禁止されています</li>
            <li>このダッシュボードへのアクセスは監査ログに記録されます</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
