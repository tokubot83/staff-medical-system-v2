'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  GitBranch,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  FileText,
  Settings,
  Eye,
  EyeOff,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

// 評価制度バージョンの型定義
interface EvaluationSystemVersion {
  id: string;
  version: string;
  name: string;
  status: 'active' | 'preparing' | 'testing' | 'archived' | 'future';
  effectiveFrom: string;
  effectiveTo?: string;
  description: string;
  features: string[];
  componentName: string;
  migrationNotes?: string;
}

// サンプル：利用可能な評価制度バージョン
const availableVersions: EvaluationSystemVersion[] = [
  {
    id: 'SYS_2024_001',
    version: '1.0.0',
    name: '2024年度評価制度（現行）',
    status: 'active',
    effectiveFrom: '2024-04-01',
    effectiveTo: '2025-03-31',
    description: '施設内×法人内の2軸マトリックス評価',
    features: [
      '技術評価50点・組織貢献50点',
      '5×5マトリックスから7段階評価',
      '相対評価による順位付け',
      '部署別カスタマイズ対応'
    ],
    componentName: 'MatrixEvaluationV1'
  },
  {
    id: 'SYS_2025_001',
    version: '2.0.0-beta',
    name: '2025年度評価制度（準備中）',
    status: 'preparing',
    effectiveFrom: '2025-04-01',
    effectiveTo: '2026-03-31',
    description: 'コンピテンシー評価と360度評価を統合',
    features: [
      'コンピテンシー評価30点追加',
      '360度評価の導入',
      '人事評価会議での最終決定',
      'AI支援による評価補助'
    ],
    componentName: 'CompetencyEvaluationV2',
    migrationNotes: '移行期間中は両制度で並行評価を実施'
  },
  {
    id: 'SYS_2025_TEST',
    version: '2.0.0-test',
    name: 'テスト運用版',
    status: 'testing',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-03-31',
    description: 'リハビリテーション科での試験運用',
    features: [
      '特定部署での限定運用',
      'フィードバック収集中',
      '本番導入前の検証'
    ],
    componentName: 'CompetencyEvaluationV2'
  },
  {
    id: 'SYS_2023_001',
    version: '0.9.0',
    name: '2023年度評価制度（アーカイブ）',
    status: 'archived',
    effectiveFrom: '2023-04-01',
    effectiveTo: '2024-03-31',
    description: '旧制度（参照用）',
    features: [
      '技術評価60点・組織貢献40点',
      '絶対評価制',
      '施設単位での評価'
    ],
    componentName: 'LegacyEvaluation'
  }
];

// 既存の評価管理ページ全体をインポート（ver.1として使用）
import dynamic from 'next/dynamic';

// 動的インポートで既存の評価管理ページを読み込み
const EvaluationExecutionPageV1 = dynamic(
  () => import('@/app/evaluation-execution/page'),
  {
    loading: () => <div className="p-8 text-center">評価管理システムを読み込み中...</div>,
    ssr: false
  }
);

// 現行版（V1）評価管理システム全体
const MatrixEvaluationV1: React.FC = () => (
  <div className="space-y-4">
    {/* 既存の評価管理ページをそのまま表示 */}
    <EvaluationExecutionPageV1 />
  </div>
);

// 新版（V2）コンピテンシー評価コンポーネント
const CompetencyEvaluationV2: React.FC = () => (
  <div className="space-y-4">
    <Alert className="border-blue-200 bg-blue-50">
      <TrendingUp className="h-4 w-4" />
      <AlertDescription>
        次期評価制度です。コンピテンシー評価と360度評価を追加し、人事評価会議で最終決定します。
      </AlertDescription>
    </Alert>
    <Card>
      <CardHeader>
        <CardTitle>2025年度評価フロー（新制度）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <p className="font-semibold">自己評価</p>
              <p className="text-sm text-gray-600">目標達成度・成果の自己申告</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 ml-4" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <p className="font-semibold">360度評価</p>
              <p className="text-sm text-gray-600">上司・同僚・部下からの多面評価</p>
              <Badge className="bg-green-100 text-green-800 mt-1">新機能</Badge>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 ml-4" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <p className="font-semibold">コンピテンシー評価（30点）</p>
              <p className="text-sm text-gray-600">行動特性・能力評価</p>
              <Badge className="bg-green-100 text-green-800 mt-1">新機能</Badge>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 ml-4" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <div>
              <p className="font-semibold">技術評価（40点）</p>
              <p className="text-sm text-gray-600">配点変更：50→40点</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 ml-4" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold">5</div>
            <div>
              <p className="font-semibold">組織貢献度（30点）</p>
              <p className="text-sm text-gray-600">配点変更：50→30点</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 ml-4" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold">6</div>
            <div>
              <p className="font-semibold">人事評価会議</p>
              <p className="text-sm text-gray-600">部門長による調整・決定</p>
              <Badge className="bg-green-100 text-green-800 mt-1">新機能</Badge>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 ml-4" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold">7</div>
            <div>
              <p className="font-semibold">最終評価（9段階）</p>
              <p className="text-sm text-gray-600">より細分化された評価</p>
              <Badge className="bg-blue-100 text-blue-800 mt-1">7段階→9段階</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// レガシー評価コンポーネント
const LegacyEvaluation: React.FC = () => (
  <Alert className="border-gray-200">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      この制度はアーカイブされています。参照のみ可能で、新規評価はできません。
    </AlertDescription>
  </Alert>
);

// バージョン比較コンポーネント
const VersionComparison: React.FC<{ versions: EvaluationSystemVersion[] }> = ({ versions }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">制度比較</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {versions.map(version => (
        <Card key={version.id}>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              {version.name}
              <Badge
                className={
                  version.status === 'active' ? 'bg-green-100 text-green-800' :
                  version.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                  version.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }
              >
                {version.status === 'active' ? '運用中' :
                 version.status === 'preparing' ? '準備中' :
                 version.status === 'testing' ? 'テスト中' :
                 'アーカイブ'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">{version.description}</p>
            <div className="space-y-1">
              <p className="text-xs font-semibold">主な特徴:</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {version.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-gray-500 pt-2">
              期間: {version.effectiveFrom} 〜 {version.effectiveTo || '未定'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const VersionedEvaluationManager: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<EvaluationSystemVersion>(
    availableVersions.find(v => v.status === 'active') || availableVersions[0]
  );
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay'>('side-by-side');

  // バージョンに応じたコンポーネントを返す
  const getEvaluationComponent = (version: EvaluationSystemVersion) => {
    switch (version.componentName) {
      case 'MatrixEvaluationV1':
        return <MatrixEvaluationV1 />;
      case 'CompetencyEvaluationV2':
        return <CompetencyEvaluationV2 />;
      case 'LegacyEvaluation':
        return <LegacyEvaluation />;
      default:
        return <MatrixEvaluationV1 />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'preparing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'testing':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'archived':
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-6 w-6" />
            評価制度バージョン管理
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  比較を隠す
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  制度を比較
                </>
              )}
            </Button>
            <Select
              value={selectedVersion.id}
              onValueChange={(value) => {
                const version = availableVersions.find(v => v.id === value);
                if (version) setSelectedVersion(version);
              }}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableVersions.map(version => (
                  <SelectItem key={version.id} value={version.id}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(version.status)}
                      <span>{version.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* バージョン情報 */}
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{selectedVersion.name}</h3>
              <Badge variant="outline">v{selectedVersion.version}</Badge>
            </div>
            <p className="text-sm text-gray-600">{selectedVersion.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {selectedVersion.effectiveFrom} 〜 {selectedVersion.effectiveTo || '未定'}
              </span>
              <span className="flex items-center gap-1">
                {getStatusIcon(selectedVersion.status)}
                {selectedVersion.status === 'active' ? '運用中' :
                 selectedVersion.status === 'preparing' ? '準備中' :
                 selectedVersion.status === 'testing' ? 'テスト中' :
                 'アーカイブ'}
              </span>
            </div>
          </div>
          {selectedVersion.migrationNotes && (
            <Alert className="max-w-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {selectedVersion.migrationNotes}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* 比較モード */}
        {showComparison ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">制度比較モード</h3>
              <Select value={comparisonMode} onValueChange={(v: any) => setComparisonMode(v)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="side-by-side">並列表示</SelectItem>
                  <SelectItem value="overlay">重ね表示</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {comparisonMode === 'side-by-side' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800">現行制度</Badge>
                  {getEvaluationComponent(
                    availableVersions.find(v => v.status === 'active') || selectedVersion
                  )}
                </div>
                <div className="space-y-2">
                  <Badge className="bg-blue-100 text-blue-800">選択制度</Badge>
                  {getEvaluationComponent(selectedVersion)}
                </div>
              </div>
            ) : (
              <VersionComparison
                versions={[
                  availableVersions.find(v => v.status === 'active') || selectedVersion,
                  selectedVersion
                ]}
              />
            )}
          </div>
        ) : (
          /* 通常モード */
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="flow">評価フロー</TabsTrigger>
              <TabsTrigger value="settings">設定</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <h3 className="font-semibold">主な機能</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedVersion.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="flow">
              {getEvaluationComponent(selectedVersion)}
            </TabsContent>

            <TabsContent value="settings">
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  この制度の詳細設定は「評価制度マスター」から変更できます。
                </AlertDescription>
              </Alert>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  評価制度マスターを開く
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  設定をエクスポート
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* 移行期間の並行運用表示 */}
        {availableVersions.filter(v => v.status === 'active').length > 1 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              現在、複数の評価制度が並行運用されています。
              対象者によって適用される制度が異なる場合があります。
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};