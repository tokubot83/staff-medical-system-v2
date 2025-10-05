'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Database,
  Trash2,
  RefreshCw,
  Lock,
  Unlock,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import FacilitySelector from '@/components/reports/FacilitySelector';
import { Skeleton } from '@/components/ui/skeleton';

// VoiceDrive分析データの型定義
interface VoiceDriveAnalytics {
  kAnonymityCheck: {
    passed: boolean;
    userCount: number;
    minimumRequired: number;
  };
  consentedUsers: number;
  totalUsers: number;
  deletionRequests: number;
  departmentDistribution?: {
    department: string;
    count: number;
    percentage: number;
  }[];
  lastUpdated: Date;
}

function VoiceDriveAnalyticsContent() {
  const searchParams = useSearchParams();
  const [selectedFacility, setSelectedFacility] = useState('');
  const [analytics, setAnalytics] = useState<VoiceDriveAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URLパラメータから施設を初期化
  useEffect(() => {
    const facilityParam = searchParams.get('facility');
    if (facilityParam) {
      setSelectedFacility(facilityParam);
    }
  }, [searchParams]);

  // データ取得
  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedFacility]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/voicedrive/analytics?facility=${selectedFacility}`);

      if (!response.ok) {
        throw new Error('分析データの取得に失敗しました');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('VoiceDrive分析データ取得エラー:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');

      // 開発環境用のモックデータ
      if (process.env.NODE_ENV === 'development') {
        setAnalytics({
          kAnonymityCheck: {
            passed: true,
            userCount: 8,
            minimumRequired: 5
          },
          consentedUsers: 8,
          totalUsers: 14,
          deletionRequests: 2,
          departmentDistribution: [
            { department: '内科病棟', count: 3, percentage: 37.5 },
            { department: '外来', count: 2, percentage: 25.0 },
            { department: '地域包括ケア病棟', count: 2, percentage: 25.0 },
            { department: '外科病棟', count: 1, percentage: 12.5 }
          ],
          lastUpdated: new Date()
        });
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // K-匿名性チェック結果カード
  const renderKAnonymityCard = () => {
    if (!analytics) return null;

    const { kAnonymityCheck } = analytics;
    const isPassed = kAnonymityCheck.passed;

    return (
      <Card className={`border-2 ${isPassed ? 'border-green-500' : 'border-red-500'}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
              {isPassed ? (
                <Shield className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <CardTitle>K-匿名性チェック</CardTitle>
              <CardDescription>
                プライバシー保護の基準判定（最小K={kAnonymityCheck.minimumRequired}）
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isPassed ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">K-匿名性要件を充足しています</AlertTitle>
              <AlertDescription className="text-green-700">
                <div className="mt-2 space-y-1">
                  <p className="font-semibold text-lg">
                    分析対象: {kAnonymityCheck.userCount}名 ≥ 最小要件: {kAnonymityCheck.minimumRequired}名
                  </p>
                  <p className="text-sm">
                    十分な匿名性が確保されているため、VoiceDriveデータの集団分析が可能です。
                    個人が特定されるリスクは最小限に抑えられています。
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">K-匿名性要件を満たしていません</AlertTitle>
              <AlertDescription className="text-red-700">
                <div className="mt-2 space-y-2">
                  <p className="font-semibold text-lg">
                    分析対象: {kAnonymityCheck.userCount}名 &lt; 最小要件: {kAnonymityCheck.minimumRequired}名
                  </p>
                  <p className="text-sm">
                    プライバシー保護のため、分析データは表示できません。
                    最低{kAnonymityCheck.minimumRequired}名の同意済みユーザーが必要です。
                  </p>
                  <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                    <p className="text-sm font-semibold">必要な追加同意数:</p>
                    <p className="text-2xl font-bold text-red-800">
                      {kAnonymityCheck.minimumRequired - kAnonymityCheck.userCount}名
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  // 基本統計カード
  const renderStatisticsCards = () => {
    if (!analytics || !analytics.kAnonymityCheck.passed) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 同意済みユーザー数 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">同意済みユーザー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{analytics.consentedUsers}</p>
                <p className="text-sm text-gray-600">
                  / {analytics.totalUsers}名中 ({((analytics.consentedUsers / analytics.totalUsers) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
            <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-200">
              <Unlock className="w-3 h-3 mr-1" />
              分析可能
            </Badge>
          </CardContent>
        </Card>

        {/* データ削除リクエスト */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">削除リクエスト</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-orange-100">
                <Trash2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{analytics.deletionRequests}</p>
                <p className="text-sm text-gray-600">件の削除リクエスト</p>
              </div>
            </div>
            <Badge className="mt-3 bg-orange-100 text-orange-800 hover:bg-orange-200">
              <Lock className="w-3 h-3 mr-1" />
              GDPR対応
            </Badge>
          </CardContent>
        </Card>

        {/* K値 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">K-匿名性値</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">K = {analytics.kAnonymityCheck.userCount}</p>
                <p className="text-sm text-gray-600">
                  最小要件: K ≥ {analytics.kAnonymityCheck.minimumRequired}
                </p>
              </div>
            </div>
            <Badge className="mt-3 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              プライバシー保護
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  };

  // 部署別分布カード
  const renderDepartmentDistribution = () => {
    if (!analytics || !analytics.kAnonymityCheck.passed || !analytics.departmentDistribution) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <PieChart className="w-5 h-5 text-purple-600" />
            <CardTitle>部署別分布</CardTitle>
          </div>
          <CardDescription>同意済みユーザーの部署別内訳</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.departmentDistribution.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <span className="text-sm text-gray-600">{dept.count}名 ({dept.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg shadow-md p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8" />
            <h1 className="text-2xl font-bold">VoiceDrive分析</h1>
          </div>
          <p className="text-purple-100">
            職員の声データをプライバシー保護（K-匿名性 K≥5）下で集団分析
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4" />
            <span>最終更新: {analytics ? new Date(analytics.lastUpdated).toLocaleString('ja-JP') : '-'}</span>
          </div>
        </div>

        {/* 施設選択 */}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={setSelectedFacility}
          />
        </div>

        {/* ローディング状態 */}
        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        )}

        {/* エラー状態（開発環境ではモックデータを表示） */}
        {error && process.env.NODE_ENV !== 'development' && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">データ取得エラー</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
              <Button
                onClick={fetchAnalyticsData}
                variant="outline"
                size="sm"
                className="mt-3 ml-0"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                再試行
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* データ表示 */}
        {!loading && analytics && (
          <div className="space-y-6">
            {/* K-匿名性チェック結果 */}
            {renderKAnonymityCard()}

            {/* 基本統計 */}
            {renderStatisticsCards()}

            {/* 部署別分布 */}
            {renderDepartmentDistribution()}

            {/* プライバシー保護の説明 */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Shield className="w-5 h-5" />
                  プライバシー保護について
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800 space-y-2">
                <p className="text-sm">
                  <strong>K-匿名性（K-anonymity）:</strong>
                  最低K名以上のユーザーが含まれる場合のみデータを表示することで、個人の特定を防ぎます。
                </p>
                <p className="text-sm">
                  <strong>本システムの基準:</strong>
                  K ≥ 5（最低5名以上の同意済みユーザーが必要）
                </p>
                <p className="text-sm">
                  <strong>GDPR対応:</strong>
                  データ削除リクエストは24時間以内に処理され、VoiceDrive側にも通知されます。
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VoiceDriveAnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <VoiceDriveAnalyticsContent />
    </Suspense>
  );
}
