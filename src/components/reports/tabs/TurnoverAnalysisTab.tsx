import React from 'react'
import { ReportCard } from '@/components/reports/ReportCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  GitBranch, 
  Brain, 
  Lightbulb,
  Users,
  AlertTriangle,
  Activity
} from 'lucide-react'
import ScrollToTopButton from '@/components/ScrollToTopButton'

const turnoverCategories = [
  {
    title: '離職リスク分析',
    reports: [
      {
        href: '/reports/turnover/risk-prediction',
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        title: '離職リスク予測',
        description: 'AIモデルによる個別職員の離職リスクスコア算出と早期警告',
        updateFrequency: 'リアルタイム',
        lastUpdated: '5分前'
      },
      {
        href: '/reports/turnover/high-risk-dashboard',
        icon: Activity,
        iconColor: 'text-orange-500',
        title: '高リスク職員ダッシュボード',
        description: '離職リスクが高い職員の一覧と対応状況の管理',
        updateFrequency: '毎日更新',
        lastUpdated: '1時間前'
      }
    ]
  },
  {
    title: '要因分析',
    reports: [
      {
        href: '/reports/turnover/correlation-analysis',
        icon: GitBranch,
        iconColor: 'text-purple-500',
        title: '相関分析',
        description: '離職要因の相関関係と影響度の可視化分析',
        updateFrequency: '週次更新',
        lastUpdated: '2日前'
      },
      {
        href: '/reports/turnover/factor-ranking',
        icon: TrendingUp,
        iconColor: 'text-green-500',
        title: '要因ランキング',
        description: '離職に影響する要因の重要度ランキング',
        updateFrequency: '月次更新',
        lastUpdated: '1週間前'
      }
    ]
  },
  {
    title: '予測・シミュレーション',
    reports: [
      {
        href: '/reports/turnover/predictive-modeling',
        icon: Brain,
        iconColor: 'text-indigo-500',
        title: '予測モデリング',
        description: '機械学習による離職予測モデルの構築と精度評価',
        updateFrequency: '月次更新',
        lastUpdated: '3日前'
      },
      {
        href: '/reports/turnover/what-if-simulation',
        icon: Activity,
        iconColor: 'text-blue-500',
        title: 'What-ifシミュレーション',
        description: '施策実施時の離職率変化をシミュレーション',
        updateFrequency: 'オンデマンド',
        lastUpdated: '1日前'
      }
    ]
  },
  {
    title: '改善・対策',
    reports: [
      {
        href: '/reports/turnover/improvement-suggestions',
        icon: Lightbulb,
        iconColor: 'text-yellow-500',
        title: '改善提案',
        description: 'AIによる具体的な離職防止施策の提案と効果予測',
        updateFrequency: '週次更新',
        lastUpdated: '3時間前'
      },
      {
        href: '/reports/turnover/retention-strategies',
        icon: Users,
        iconColor: 'text-teal-500',
        title: '定着戦略レポート',
        description: '部署別・職種別の効果的な定着戦略の策定支援',
        updateFrequency: '月次更新',
        lastUpdated: '5日前'
      }
    ]
  }
]

interface TurnoverAnalysisTabProps {
  selectedFacility: string
}

export const TurnoverAnalysisTab: React.FC<TurnoverAnalysisTabProps> = ({ selectedFacility }) => {
  const totalStaff = 523
  const highRiskCount = 42
  const averageRiskScore = 3.2
  const predictedTurnoverRate = 15.8

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">離職分析</h2>
          <p className="text-muted-foreground mt-1">
            AIによる離職リスク予測と要因分析で、計画的な人材定着施策を支援
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                総職員数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStaff}名</div>
              <p className="text-xs text-muted-foreground mt-1">
                前月比 +2.3%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                高リスク職員
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highRiskCount}名</div>
              <p className="text-xs text-muted-foreground mt-1">
                全体の8.0%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                平均リスクスコア
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRiskScore}/5.0</div>
              <p className="text-xs text-muted-foreground mt-1">
                前月比 -0.2
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                予測離職率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{predictedTurnoverRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                今後3ヶ月
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-8">
        {turnoverCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-lg font-semibold mb-4">{category.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.reports.map((report) => (
                <ReportCard key={report.href} {...report} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <ScrollToTopButton />
    </div>
  )
}