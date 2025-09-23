'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Settings,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Layers,
  GitBranch,
  PlayCircle,
  Code,
  Database,
} from 'lucide-react';

interface ScenarioStep {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  code?: string;
}

const ScenarioCard: React.FC<{
  title: string;
  description: string;
  steps: ScenarioStep[];
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}> = ({ title, description, steps, icon, badge, badgeColor = 'bg-blue-100 text-blue-800' }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {title}
                {badge && (
                  <Badge className={badgeColor}>
                    {badge}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            {expanded ? '閉じる' : '詳細を見る'}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  {step.code && (
                    <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export const EvaluationSystemGuide: React.FC = () => {
  return (
    <div className="w-full">
      <Alert className="mb-6">
        <BookOpen className="h-4 w-4" />
        <AlertDescription>
          評価制度マスターは、人事部が開発者なしで評価制度を管理・運用できる総合システムです。
          部分的な調整から制度の全面刷新まで、あらゆる変更に対応できます。
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="partial">部分変更</TabsTrigger>
          <TabsTrigger value="complete">制度新設</TabsTrigger>
          <TabsTrigger value="scenarios">運用シナリオ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                評価制度マスターの構成
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    基本設定
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 評価制度の基本情報（名称、バージョン、有効期間）</li>
                    <li>• 総点数（100点）の配分設定</li>
                    <li>• 技術評価と組織貢献度の比率</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    評価マトリックス
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 施設内評価×法人内評価→最終評価の対応表</li>
                    <li>• 5×5の25パターンを7段階に変換</li>
                    <li>• 部署別カスタマイズ可能</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    給与連動
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 各評価グレードの昇給率設定</li>
                    <li>• 賞与倍率の設定</li>
                    <li>• 人件費影響のシミュレーション</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    バージョン管理
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• 複数制度の並行管理</li>
                    <li>• 変更履歴の記録</li>
                    <li>• A/Bテスト機能</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                主な機能
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">リアルタイム編集</p>
                    <p className="text-sm text-gray-600">
                      マトリックスや給与テーブルを画面上で直接編集、即座に反映
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">影響シミュレーション</p>
                    <p className="text-sm text-gray-600">
                      変更による人件費や評価分布への影響を事前に確認
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">部署別カスタマイズ</p>
                    <p className="text-sm text-gray-600">
                      特定部署に独自の評価基準を適用可能
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partial" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              既存制度の一部を調整する場合の操作方法です。即座に適用でき、影響範囲も限定的です。
            </AlertDescription>
          </Alert>

          <ScenarioCard
            title="マトリックスの微調整"
            description="特定の評価パターンの最終評価を変更"
            icon={<Settings className="h-5 w-5" />}
            badge="頻度: 高"
            badgeColor="bg-orange-100 text-orange-800"
            steps={[
              {
                number: 1,
                title: "マトリックス編集タブを開く",
                description: "評価制度マスター → マトリックス編集を選択"
              },
              {
                number: 2,
                title: "編集モードに入る",
                description: "「編集開始」ボタンをクリック"
              },
              {
                number: 3,
                title: "セルを変更",
                description: "例: S×A（施設S評価×法人A評価）のセルを「6」から「5」に変更",
                code: "// Before\nS × A → 6（S評価）\n\n// After\nS × A → 5（A評価）"
              },
              {
                number: 4,
                title: "変更を保存",
                description: "「変更を保存」ボタンで即座に適用"
              }
            ]}
          />

          <ScenarioCard
            title="給与テーブルの調整"
            description="経済状況に応じた昇給率の変更"
            icon={<TrendingUp className="h-5 w-5" />}
            badge="頻度: 中"
            badgeColor="bg-green-100 text-green-800"
            steps={[
              {
                number: 1,
                title: "給与連動設定タブを開く",
                description: "マトリックス編集 → 給与連動設定を選択"
              },
              {
                number: 2,
                title: "対象グレードを選択",
                description: "例: 評価7（S+）の設定を調整"
              },
              {
                number: 3,
                title: "率を変更",
                description: "昇給率: 1.15 → 1.12（15%増→12%増）",
                code: "salaryMaster: {\n  '7': {\n    rate: 1.12,  // 変更\n    bonus: 1.5,\n    description: 'S+評価：基本給12%増、賞与150%'\n  }\n}"
              },
              {
                number: 4,
                title: "影響を確認して保存",
                description: "人件費への影響を確認後、保存"
              }
            ]}
          />

          <ScenarioCard
            title="部署別カスタマイズ"
            description="特定部署のみ異なる評価基準を適用"
            icon={<Users className="h-5 w-5" />}
            badge="リハビリ科専用"
            badgeColor="bg-purple-100 text-purple-800"
            steps={[
              {
                number: 1,
                title: "部署管理者としてログイン",
                description: "リハビリテーション科の管理者権限でアクセス"
              },
              {
                number: 2,
                title: "部署別カスタマイズタブを開く",
                description: "自部署専用の設定画面へ"
              },
              {
                number: 3,
                title: "オーバーライド設定",
                description: "A×A → 6に変更（標準は5）",
                code: "departmentOverrides: {\n  'リハビリテーション科': [\n    {\n      facilityGrade: 'A',\n      corporateGrade: 'A',\n      finalGrade: '6'  // 通常5→6へ\n    }\n  ]\n}"
              },
              {
                number: 4,
                title: "承認申請",
                description: "人事部へ承認申請を送信"
              }
            ]}
          />
        </TabsContent>

        <TabsContent value="complete" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              評価制度を全面的に刷新する場合の手順です。新制度として保存し、段階的に移行できます。
            </AlertDescription>
          </Alert>

          <ScenarioCard
            title="新年度制度の作成"
            description="2025年度に向けた新評価制度の構築"
            icon={<Calendar className="h-5 w-5" />}
            badge="年1回"
            badgeColor="bg-red-100 text-red-800"
            steps={[
              {
                number: 1,
                title: "評価制度設定から新規作成",
                description: "「新規制度作成」ボタンをクリック"
              },
              {
                number: 2,
                title: "基本情報を設定",
                description: "制度名、バージョン、有効期間を入力",
                code: "{\n  id: 'SYS_2025_001',\n  systemName: '2025年度評価制度',\n  version: '2.0.0',\n  effectiveFrom: '2025-04-01',\n  effectiveTo: '2026-03-31'\n}"
              },
              {
                number: 3,
                title: "配点構成を設定",
                description: "技術評価と組織貢献度の配分を決定",
                code: "scoreComponents: [\n  { type: 'technical', points: 60 },    // 変更\n  { type: 'contribution', points: 40 }  // 変更\n]"
              },
              {
                number: 4,
                title: "マトリックスを全面改定",
                description: "25パターンすべてを見直し"
              },
              {
                number: 5,
                title: "給与体系を再構築",
                description: "新しい昇給率と賞与率を設定"
              },
              {
                number: 6,
                title: "シミュレーション実施",
                description: "全職員データで影響を検証"
              },
              {
                number: 7,
                title: "承認と公開",
                description: "経営層承認後、4月1日から適用"
              }
            ]}
          />

          <ScenarioCard
            title="制度のコピーと修正"
            description="既存制度をベースに新制度を作成"
            icon={<Database className="h-5 w-5" />}
            badge="推奨"
            badgeColor="bg-green-100 text-green-800"
            steps={[
              {
                number: 1,
                title: "既存制度を選択",
                description: "「2024年度制度」を選択"
              },
              {
                number: 2,
                title: "コピーを作成",
                description: "「この制度をコピー」ボタンをクリック",
                code: "const newSystem = {\n  ...currentSystem,\n  id: 'SYS_2025_001',\n  systemName: '2025年度評価制度（案）',\n  version: '2.0.0-draft'\n}"
              },
              {
                number: 3,
                title: "必要な部分のみ修正",
                description: "変更が必要な箇所を編集"
              },
              {
                number: 4,
                title: "差分を確認",
                description: "現行制度との違いを比較表示"
              },
              {
                number: 5,
                title: "段階的移行",
                description: "特定部署で試験運用後、全社展開"
              }
            ]}
          />
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Alert>
            <PlayCircle className="h-4 w-4" />
            <AlertDescription>
              実際の運用場面を想定した具体的なシナリオです。状況に応じて最適な方法を選択してください。
            </AlertDescription>
          </Alert>

          <ScenarioCard
            title="シナリオ1: 緊急調整"
            description="評価結果に偏りが発覚、即座に調整が必要"
            icon={<AlertCircle className="h-5 w-5" />}
            badge="緊急対応"
            badgeColor="bg-red-100 text-red-800"
            steps={[
              {
                number: 1,
                title: "問題の特定",
                description: "S評価が多すぎる（30%超）ことが判明"
              },
              {
                number: 2,
                title: "原因分析",
                description: "A×A→6（S評価）の設定が甘いと判断"
              },
              {
                number: 3,
                title: "即座に修正",
                description: "A×A→5（A評価）に変更、即日適用"
              },
              {
                number: 4,
                title: "影響者への通知",
                description: "該当者に評価変更を通知"
              },
              {
                number: 5,
                title: "再発防止",
                description: "シミュレーション機能の活用を徹底"
              }
            ]}
          />

          <ScenarioCard
            title="シナリオ2: 段階的改革"
            description="3年計画で評価制度を段階的に改革"
            icon={<TrendingUp className="h-5 w-5" />}
            badge="中長期計画"
            badgeColor="bg-blue-100 text-blue-800"
            steps={[
              {
                number: 1,
                title: "第1段階（1年目）",
                description: "マトリックスの微調整で様子見",
                code: "// 控えめな変更\n一部の評価パターンのみ調整"
              },
              {
                number: 2,
                title: "第2段階（2年目）",
                description: "配点構成を見直し",
                code: "技術評価: 50点 → 55点\n組織貢献: 50点 → 45点"
              },
              {
                number: 3,
                title: "第3段階（3年目）",
                description: "全面刷新",
                code: "// 新制度\n・7段階→9段階評価へ\n・360度評価導入\n・目標管理制度統合"
              },
              {
                number: 4,
                title: "効果測定",
                description: "各段階で効果を測定、次段階へ反映"
              }
            ]}
          />

          <ScenarioCard
            title="シナリオ3: A/Bテスト運用"
            description="新制度の効果を検証してから全社展開"
            icon={<GitBranch className="h-5 w-5" />}
            badge="リスク最小化"
            badgeColor="bg-green-100 text-green-800"
            steps={[
              {
                number: 1,
                title: "テスト制度を作成",
                description: "新評価基準をβ版として登録"
              },
              {
                number: 2,
                title: "対象部署を選定",
                description: "リハビリテーション科と看護部で試験運用"
              },
              {
                number: 3,
                title: "3ヶ月間の並行運用",
                description: "現行制度と新制度を同時に運用",
                code: "// 比較項目\n・評価分布の適正性\n・職員満足度\n・運用負荷\n・人件費影響"
              },
              {
                number: 4,
                title: "結果分析",
                description: "統計的有意差を確認"
              },
              {
                number: 5,
                title: "最終判断",
                description: "効果ありなら全社展開、なければ修正or中止"
              }
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                開発者向け: DB実装後の変更点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Database className="h-4 w-4" />
                <AlertDescription>
                  現在はローカルストレージで動作していますが、DB実装後は以下のように変わります。
                </AlertDescription>
              </Alert>
              <div className="space-y-3 font-mono text-sm">
                <div className="p-3 bg-gray-100 rounded">
                  <p className="text-green-600">// 現在（ローカルストレージ）</p>
                  <p>localStorage.setItem('evaluationMatrix', data)</p>
                </div>
                <ArrowRight className="mx-auto text-gray-400" />
                <div className="p-3 bg-gray-100 rounded">
                  <p className="text-blue-600">// DB実装後</p>
                  <p>await api.put('/evaluation-systems/:id', data)</p>
                  <p>// WebSocketで全クライアントに通知</p>
                  <p>socket.broadcast('system-updated', data)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};