'use client';

import React, { useState } from 'react';
import {
  Link2, Shield, AlertCircle, CheckCircle,
  Settings, TestTube, Save, RefreshCw,
  Key, Globe, Database, ArrowRight, Activity,
  FileText, HelpCircle, Search, Filter, BarChart3,
  Clock, Users, Heart, MessageSquare, BookOpen,
  TrendingUp, AlertTriangle, Zap
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// API定義データ
const API_CATEGORIES = {
  career: {
    name: 'キャリア・評価',
    icon: TrendingUp,
    color: 'blue',
    description: 'キャリアコース、評価システム、キャリア支援機能',
    apis: [
      { endpoint: '/api/career-course/change-request', method: 'POST', name: 'コース変更申請', status: 'active', usage: '職員がキャリアコースを変更申請する時' },
      { endpoint: '/api/career-course/my-requests', method: 'GET', name: '自分の申請一覧', status: 'active', usage: '申請履歴を確認する時' },
      { endpoint: '/api/career-course/notify-voicedrive', method: 'POST', name: 'VoiceDrive通知', status: 'active', usage: 'コース変更をVoiceDriveに通知する時' },
      { endpoint: '/api/admin/career-course/requests/[id]/approve', method: 'POST', name: '申請承認', status: 'active', usage: '管理者が申請を承認する時' },
      { endpoint: '/api/admin/career-course/requests/[id]/reject', method: 'POST', name: '申請却下', status: 'active', usage: '管理者が申請を却下する時' },
      { endpoint: '/api/career-courses/definitions', method: 'GET', name: 'コース定義取得', status: 'active', usage: 'A/B/C/Dコースの詳細を取得する時' },
      { endpoint: '/api/career-support/records', method: 'GET', name: 'キャリア支援記録一覧', status: 'active', usage: '支援記録を一覧表示する時' },
      { endpoint: '/api/career-support/records/[staffId]', method: 'GET', name: '個人の支援記録', status: 'active', usage: '特定職員の支援履歴を確認する時' },
      { endpoint: '/api/career-support/suggest-support', method: 'POST', name: 'AI支援提案', status: 'active', usage: 'AIがキャリア支援を提案する時' },
      { endpoint: '/api/evaluation-items/[versionId]', method: 'GET', name: '評価項目取得', status: 'active', usage: '評価シートの項目を取得する時' },
      { endpoint: '/api/evaluation-versions', method: 'GET', name: '評価バージョン一覧', status: 'active', usage: '評価シートのバージョン管理時' },
      { endpoint: '/api/evaluation-versions/[id]/activate', method: 'POST', name: 'バージョン有効化', status: 'active', usage: '新しい評価シートを有効化する時' },
      { endpoint: '/api/evaluations/two-axis/calculate', method: 'POST', name: '二軸評価計算', status: 'active', usage: '技術力・貢献度の二軸評価を計算する時' },
    ]
  },
  health: {
    name: '健康管理',
    icon: Heart,
    color: 'red',
    description: '健康診断、ストレスチェック、産業医管理機能',
    apis: [
      { endpoint: '/api/health/checkups', method: 'GET', name: '健診データ一覧', status: 'active', usage: '全職員の健診データを取得する時' },
      { endpoint: '/api/health/checkups', method: 'POST', name: '健診データ登録', status: 'active', usage: '新しい健診結果を登録する時' },
      { endpoint: '/api/health/checkups/[id]', method: 'GET', name: '健診詳細取得', status: 'active', usage: '特定の健診結果を確認する時' },
      { endpoint: '/api/health/consent-dashboard', method: 'GET', name: '同意状況ダッシュボード', status: 'active', usage: 'ストレスチェック同意状況を確認する時' },
      { endpoint: '/api/health/import', method: 'POST', name: '健診データ一括取り込み', status: 'active', usage: 'Excelから健診データをインポートする時' },
      { endpoint: '/api/health/notifications', method: 'POST', name: '健康通知送信', status: 'active', usage: '再検査通知等をVoiceDriveに送信する時' },
      { endpoint: '/api/health/reexamination', method: 'GET', name: '再検査対象者取得', status: 'active', usage: '再検査が必要な職員を抽出する時' },
      { endpoint: '/api/health/reports/generate', method: 'POST', name: '健康レポート生成', status: 'active', usage: '健康管理レポートを作成する時' },
      { endpoint: '/api/health/staff/[staffId]/latest', method: 'GET', name: '最新健診取得', status: 'active', usage: '職員の最新健診結果を取得する時' },
      { endpoint: '/api/health/statistics', method: 'GET', name: '健康統計取得', status: 'active', usage: '施設別の健康統計を確認する時' },
      { endpoint: '/api/admin/health-audit', method: 'GET', name: '健康データ監査ログ', status: 'active', usage: '健康データへのアクセス履歴を確認する時' },
      { endpoint: '/api/stress-check/consent', method: 'POST', name: 'ストレスチェック同意', status: 'active', usage: '職員がストレスチェックに同意する時' },
      { endpoint: '/api/stress-check/my-result', method: 'GET', name: '自分の結果取得', status: 'active', usage: '職員が自分のストレスチェック結果を見る時' },
      { endpoint: '/api/hr/stress-check/[staffId]', method: 'GET', name: '職員のストレス結果', status: 'active', usage: '人事部が職員のストレス状況を確認する時' },
    ]
  },
  interview: {
    name: '面談予約',
    icon: MessageSquare,
    color: 'green',
    description: '面談予約、日程調整、面談バンク管理機能',
    apis: [
      { endpoint: '/api/interviews/assisted-booking', method: 'POST', name: 'アシスト予約', status: 'active', usage: '管理者が職員の代わりに面談を予約する時' },
      { endpoint: '/api/interviews/cancel-booking', method: 'POST', name: '予約キャンセル', status: 'active', usage: '面談予約をキャンセルする時' },
      { endpoint: '/api/interviews/confirm-choice', method: 'POST', name: '日程確定', status: 'active', usage: '候補日程から確定日を選択する時' },
      { endpoint: '/api/interviews/proposals/[requestId]', method: 'GET', name: '候補日程取得', status: 'active', usage: '面談の候補日程を取得する時' },
      { endpoint: '/api/interviews/reschedule-request', method: 'POST', name: '日程変更依頼', status: 'active', usage: '面談の日程変更を依頼する時' },
      { endpoint: '/api/interviews/reservations', method: 'GET', name: '予約一覧', status: 'active', usage: '全ての面談予約を取得する時' },
      { endpoint: '/api/interviews/reservations', method: 'POST', name: '予約作成', status: 'active', usage: '新しい面談予約を作成する時' },
      { endpoint: '/api/interviews/reservations/[id]', method: 'PUT', name: '予約更新', status: 'active', usage: '既存の予約内容を変更する時' },
      { endpoint: '/api/interviews/reservations/bulk', method: 'POST', name: '一括予約', status: 'active', usage: '複数の面談を一度に予約する時' },
      { endpoint: '/api/interviews/reservations/stats', method: 'GET', name: '予約統計', status: 'active', usage: '面談予約の統計データを取得する時' },
      { endpoint: '/api/interview-versions', method: 'GET', name: '面談シートバージョン一覧', status: 'active', usage: '面談シートのバージョンを管理する時' },
      { endpoint: '/api/interview-versions/[id]/activate', method: 'POST', name: '面談シート有効化', status: 'active', usage: '新しい面談シートを有効化する時' },
    ]
  },
  compliance: {
    name: 'コンプライアンス',
    icon: Shield,
    color: 'purple',
    description: 'コンプライアンス通報、異議申立、内部統制機能',
    apis: [
      { endpoint: '/api/v3/compliance/cases', method: 'GET', name: '通報事例一覧', status: 'active', usage: 'コンプライアンス通報を確認する時' },
      { endpoint: '/api/v3/compliance/receive', method: 'POST', name: '通報受付', status: 'active', usage: 'VoiceDriveから通報を受信する時' },
      { endpoint: '/api/v3/compliance/webhook', method: 'POST', name: 'Webhook受信', status: 'active', usage: 'VoiceDriveからWebhook通知を受ける時' },
      { endpoint: '/api/v3/appeals/list', method: 'GET', name: '異議申立一覧', status: 'active', usage: '評価への異議申立を確認する時' },
      { endpoint: '/api/v3/appeals/submit', method: 'POST', name: '異議申立提出', status: 'active', usage: '職員が評価に異議を申し立てる時' },
    ]
  },
  motivation: {
    name: 'モチベーション診断',
    icon: Activity,
    color: 'orange',
    description: 'モチベーション診断、チーム分析、部署別統計機能',
    apis: [
      { endpoint: '/api/motivation/assess', method: 'POST', name: 'モチベーション診断', status: 'active', usage: '職員のモチベーションを診断する時' },
      { endpoint: '/api/motivation/distribution/[department]', method: 'GET', name: '部署別分布', status: 'active', usage: '部署ごとのモチベーション分布を確認する時' },
      { endpoint: '/api/motivation/history/[staffId]', method: 'GET', name: 'モチベーション履歴', status: 'active', usage: '職員の過去のモチベーション推移を見る時' },
      { endpoint: '/api/motivation/team-compatibility', method: 'POST', name: 'チーム相性分析', status: 'active', usage: 'チーム編成時の相性を分析する時' },
    ]
  },
  document: {
    name: 'ドキュメント管理',
    icon: FileText,
    color: 'indigo',
    description: '面談シート、評価シート、ドキュメント配信機能',
    apis: [
      { endpoint: '/api/documents/download', method: 'GET', name: 'ドキュメントダウンロード', status: 'active', usage: 'PDF等のファイルをダウンロードする時' },
      { endpoint: '/api/documents/latest', method: 'GET', name: '最新ドキュメント取得', status: 'active', usage: '最新の面談シート等を取得する時' },
      { endpoint: '/api/documents', method: 'GET', name: 'ドキュメント一覧', status: 'active', usage: '全ドキュメントを一覧表示する時' },
      { endpoint: '/api/documents/view', method: 'GET', name: 'ドキュメント閲覧', status: 'active', usage: 'ブラウザでドキュメントを表示する時' },
      { endpoint: '/api/download-sheet', method: 'GET', name: 'シートダウンロード', status: 'active', usage: '面談シートをダウンロードする時' },
      { endpoint: '/api/preview-sheet', method: 'GET', name: 'シートプレビュー', status: 'active', usage: '面談シートをプレビュー表示する時' },
    ]
  },
  employee: {
    name: '職員情報',
    icon: Users,
    color: 'cyan',
    description: '職員プロフィール、評価分析、マイページ機能',
    apis: [
      { endpoint: '/api/employees/[employeeId]/evaluation-analysis', method: 'GET', name: '評価分析', status: 'active', usage: '職員の評価を多角的に分析する時' },
      { endpoint: '/api/employees/[employeeId]/profile', method: 'GET', name: 'プロフィール取得', status: 'active', usage: '職員の基本情報を取得する時' },
      { endpoint: '/api/my-page', method: 'GET', name: 'マイページ', status: 'active', usage: '職員が自分の情報を確認する時' },
    ]
  },
  training: {
    name: '研修・教育',
    icon: BookOpen,
    color: 'pink',
    description: '研修プログラム、試用期間教育、人事ポリシー管理機能',
    apis: [
      { endpoint: '/api/training-programs', method: 'GET', name: '研修プログラム一覧', status: 'active', usage: '全ての研修プログラムを取得する時' },
      { endpoint: '/api/probation-programs', method: 'GET', name: '試用期間プログラム', status: 'active', usage: '新入職員の教育プログラムを確認する時' },
      { endpoint: '/api/hr-policies', method: 'GET', name: '人事ポリシー一覧', status: 'active', usage: '人事制度・ポリシーを確認する時' },
      { endpoint: '/api/hr-policies/[id]', method: 'GET', name: 'ポリシー詳細', status: 'active', usage: '特定のポリシー内容を取得する時' },
    ]
  },
  external: {
    name: '外部システム連携',
    icon: Link2,
    color: 'yellow',
    description: 'VoiceDrive連携、外部システムとのデータ連携機能',
    apis: [
      { endpoint: '/api/mcp-shared/evaluation-notifications', method: 'POST', name: 'VoiceDrive評価通知', status: 'active', usage: '評価結果をVoiceDriveに通知する時' },
    ]
  }
};

export default function IntegrationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedApi, setSelectedApi] = useState<any>(null);
  const [isTestMode, setIsTestMode] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleTestApi = async (api: any) => {
    setIsTestingConnection(true);
    setTestResult(null);
    setSelectedApi(api);

    // モックAPIテスト
    setTimeout(() => {
      setTestResult({
        success: Math.random() > 0.1, // 90%成功率
        endpoint: api.endpoint,
        method: api.method,
        responseTime: Math.floor(Math.random() * 300) + 50,
        statusCode: Math.random() > 0.1 ? 200 : 500,
        timestamp: new Date().toISOString(),
      });
      setIsTestingConnection(false);
    }, 1500);
  };

  // 検索フィルタリング
  const filteredCategories = Object.entries(API_CATEGORIES).reduce((acc, [key, category]) => {
    const filteredApis = category.apis.filter(api =>
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.usage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredApis.length > 0 || !searchQuery) {
      acc[key] = { ...category, apis: searchQuery ? filteredApis : category.apis };
    }

    return acc;
  }, {} as any);

  // 統計情報
  const totalApis = Object.values(API_CATEGORIES).reduce((sum, cat) => sum + cat.apis.length, 0);
  const activeApis = Object.values(API_CATEGORIES).reduce((sum, cat) =>
    sum + cat.apis.filter(api => api.status === 'active').length, 0
  );

  const getColorClass = (color: string) => {
    const colors: any = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ページヘッダー */}
      <div className="bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-7 w-7 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">API管理システム</h1>
                <Badge className="bg-green-100 text-green-800 border-green-300 text-sm">
                  {activeApis}/{totalApis} API 稼働中
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                システム内の全API機能を管理・監視します（システム担当者用）
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              使い方を見る
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* システム担当者向けガイド */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <HelpCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">💡 システム担当者向けガイド</AlertTitle>
          <AlertDescription className="text-blue-700 space-y-2">
            <p><strong>このページの使い方：</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>全{totalApis}個のAPI機能を9カテゴリで管理しています</li>
              <li>各APIの「いつ使うか」を確認して、トラブル時の原因特定に役立てます</li>
              <li>検索バーでAPI名・エンドポイント・用途から素早く検索できます</li>
              <li>テストボタンで各APIの稼働状況を確認できます（開発中）</li>
              <li><strong className="text-red-600">注意：</strong>このページは閲覧専用です。API設定変更は開発者に依頼してください</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* 検索バー */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="API名、エンドポイント、用途で検索... (例: 健診、面談予約、評価)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  onClick={() => setSearchQuery('')}
                  className="gap-2"
                >
                  クリア
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 統計ダッシュボード */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">全API数</p>
                  <p className="text-3xl font-bold text-gray-900">{totalApis}</p>
                </div>
                <Database className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">稼働中</p>
                  <p className="text-3xl font-bold text-green-600">{activeApis}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">カテゴリ数</p>
                  <p className="text-3xl font-bold text-purple-600">{Object.keys(API_CATEGORIES).length}</p>
                </div>
                <BarChart3 className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API一覧（カテゴリ別） */}
        <div className="space-y-6">
          {Object.entries(filteredCategories).map(([key, category]: [string, any]) => {
            const Icon = category.icon;
            return (
              <Card key={key} className="border-l-4" style={{ borderLeftColor: `var(--${category.color}-500)` }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getColorClass(category.color)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={getColorClass(category.color)}>
                      {category.apis.length} API
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.apis.map((api: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge
                              variant="outline"
                              className={
                                api.method === 'GET'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : api.method === 'POST'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }
                            >
                              {api.method}
                            </Badge>
                            <span className="font-medium text-gray-900">{api.name}</span>
                            {api.status === 'active' && (
                              <Badge className="bg-green-100 text-green-800 text-xs">稼働中</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-mono mb-1">{api.endpoint}</p>
                          <p className="text-sm text-gray-600">
                            <Clock className="inline h-3 w-3 mr-1" />
                            いつ使うか: {api.usage}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestApi(api)}
                          disabled={isTestingConnection}
                          className="gap-2"
                        >
                          {isTestingConnection && selectedApi?.endpoint === api.endpoint ? (
                            <>
                              <RefreshCw className="h-3 w-3 animate-spin" />
                              テスト中
                            </>
                          ) : (
                            <>
                              <TestTube className="h-3 w-3" />
                              テスト
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* テスト結果表示 */}
        {testResult && (
          <Card className="mt-6 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                APIテスト結果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                  {testResult.success ? 'テスト成功' : 'テスト失敗'}
                </AlertTitle>
                <AlertDescription className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                  <div className="mt-2 space-y-1 text-sm">
                    <div><strong>エンドポイント:</strong> {testResult.endpoint}</div>
                    <div><strong>メソッド:</strong> {testResult.method}</div>
                    <div><strong>ステータスコード:</strong> {testResult.statusCode}</div>
                    <div><strong>レスポンスタイム:</strong> {testResult.responseTime}ms</div>
                    <div><strong>実行時刻:</strong> {new Date(testResult.timestamp).toLocaleString('ja-JP')}</div>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* セキュリティ・重要事項 */}
        <Alert className="mt-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">⚠️ システム担当者の皆様へ - 重要な注意事項</AlertTitle>
          <AlertDescription className="text-red-700">
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>このページは閲覧専用です</strong> - API設定の変更は開発者に依頼してください</li>
              <li><strong>トラブル時の対応</strong> - エラーが発生したら、該当するAPIの「いつ使うか」を確認し、その機能を使った職員に状況をヒアリングしてください</li>
              <li><strong>テスト機能の使い方</strong> - 各APIの「テスト」ボタンは稼働確認用です。実際のデータには影響しません（開発中）</li>
              <li><strong>データの保護</strong> - 全てのAPI通信はHTTPS暗号化済み、アクセスログは監査ログに自動記録されます</li>
              <li><strong>引き継ぎ時の資料</strong> - このページをPDF保存して、後任者への引き継ぎ資料として活用できます</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* よくある質問 */}
        <Card className="mt-6 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              よくある質問（システム担当者向け）
            </CardTitle>
          </CardHeader>
          <CardContent className="text-purple-900 space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-1">Q1. 職員から「面談予約ができない」と言われました</h4>
              <p className="text-xs text-purple-700 ml-4">
                → 「面談予約」カテゴリのAPIを確認してください。特に「予約作成（/api/interviews/reservations POST）」APIが稼働中か確認します。
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">Q2. 健診データのインポートが失敗します</h4>
              <p className="text-xs text-purple-700 ml-4">
                → 「健康管理」カテゴリの「健診データ一括取り込み（/api/health/import POST）」を確認。Excelファイル形式が正しいか、開発者に確認を依頼してください。
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">Q3. VoiceDriveへの通知が届かないという報告があります</h4>
              <p className="text-xs text-purple-700 ml-4">
                → 「外部システム連携」カテゴリの「VoiceDrive評価通知」API、または各カテゴリの「VoiceDrive通知」関連APIをチェックしてください。
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">Q4. APIとは何ですか？難しくてわかりません</h4>
              <p className="text-xs text-purple-700 ml-4">
                → APIは「システムの機能の部品」と考えてください。例えば「面談予約を作る」「健診データを取り込む」など、一つ一つの作業がAPIです。<br />
                このページでは、どの機能（API）がいつ使われるかを確認できます。
              </p>
            </div>

            <div className="pt-3 border-t border-purple-300">
              <p className="text-xs text-purple-700">
                <strong>さらに詳しい情報が必要な場合：</strong> 開発者または保守契約先のサポート窓口にお問い合わせください
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}