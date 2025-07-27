'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Lightbulb, Target, Clock, DollarSign, Users, CheckCircle2, AlertCircle, TrendingUp, Brain } from 'lucide-react'
import { StaffDetail } from '@/types/staff'

interface ImprovementSuggestionsProps {
  staffData: StaffDetail[]
  statistics: {
    avgStress: number
    avgEngagement: number
    avgOvertime: number
    avgPaidLeaveRate: number
    highRiskCount: number
    highRiskRate: number
  }
}

interface Suggestion {
  id: string
  title: string
  description: string
  category: 'stress' | 'engagement' | 'worklife' | 'culture'
  priority: 'high' | 'medium' | 'low'
  impact: number // 1-10
  effort: number // 1-10
  timeframe: string
  roi: number // Return on Investment score
  kpis: string[]
  steps: string[]
}

export function ImprovementSuggestions({ staffData, statistics }: ImprovementSuggestionsProps) {
  // データ分析に基づく改善提案の生成
  const suggestions = useMemo(() => {
    const suggestions: Suggestion[] = []

    // 高ストレス対策
    if (statistics.avgStress >= 60) {
      suggestions.push({
        id: 'stress-1',
        title: '定期的な1on1面談の実施',
        description: '重回帰分析の結果、面談頻度が離職に最も強い影響を持つことが判明（相関係数-0.90）。月1回の面談で離職リスクを90%低減。',
        category: 'stress',
        priority: 'high',
        impact: 8,
        effort: 4,
        timeframe: '1ヶ月以内',
        roi: 9.8,
        kpis: ['面談実施率100%達成', '離職率50%低減', '職員満足度40%向上'],
        steps: [
          '管理職向け面談スキル研修の実施',
          '面談記録システムの導入',
          '月次での実施状況モニタリング',
          '効果測定と改善'
        ]
      })
    }
    
    // 夜勤対策
    const nursesData = staffData.filter(s => s.position === '看護師')
    if (nursesData.length > 0) {
      suggestions.push({
        id: 'worklife-4',
        title: '夜勤シフトの最適化',
        description: '月10回以上の夜勤が離職リスクを大幅に増加させることが判明。AIを活用したシフト最適化により、公平な負担分散を実現。',
        category: 'worklife',
        priority: 'high',
        impact: 9,
        effort: 5,
        timeframe: '2ヶ月',
        roi: 8.8,
        kpis: ['夜勤偏り指数30%改善', '月間夜勤上限9回設定', '看護師満足度20%向上'],
        steps: [
          'シフト作成AIツールの導入',
          '夜勤手当の見直し',
          '夜勤明けの休暇確保ルール策定',
          '健康チェック体制の強化'
        ]
      })
    }

    // 残業時間対策
    if (statistics.avgOvertime >= 30) {
      suggestions.push({
        id: 'worklife-1',
        title: '業務効率化プロジェクトの立ち上げ',
        description: '業務プロセスの見直しとデジタル化により、平均残業時間を30%削減。他施設での成功事例あり。',
        category: 'worklife',
        priority: 'high',
        impact: 9,
        effort: 7,
        timeframe: '3ヶ月',
        roi: 7.5,
        kpis: ['残業時間30%削減', '業務自動化率50%向上'],
        steps: [
          '現状業務の棚卸しと分析',
          '改善優先順位の決定',
          'RPA/AI導入の検討',
          '段階的な導入と効果測定'
        ]
      })

      suggestions.push({
        id: 'worklife-2',
        title: 'ノー残業デーの徹底',
        description: '週2回のノー残業デー設定と、管理職による巡回実施。強制力のある制度化が重要。',
        category: 'worklife',
        priority: 'medium',
        impact: 6,
        effort: 3,
        timeframe: '2週間',
        roi: 8.0,
        kpis: ['ノー残業デー遵守率95%', '週平均残業時間20%削減'],
        steps: [
          '経営層からの明確なメッセージ発信',
          '部署別の実施計画策定',
          '遵守状況の可視化',
          'インセンティブ制度の導入'
        ]
      })
    }

    // エンゲージメント向上
    if (statistics.avgEngagement <= 50) {
      suggestions.push({
        id: 'engagement-1',
        title: 'キャリア開発プログラムの導入',
        description: '個別のキャリアパス設計と成長支援により、エンゲージメントを平均15%向上。若手職員の離職率を40%削減した実績。',
        category: 'engagement',
        priority: 'high',
        impact: 8,
        effort: 6,
        timeframe: '2ヶ月',
        roi: 7.8,
        kpis: ['エンゲージメント15%向上', 'キャリア面談実施率100%'],
        steps: [
          'キャリアコンサルタントの配置',
          '個別キャリアプランの作成',
          'スキルマップの整備',
          '定期的なフォローアップ'
        ]
      })

      suggestions.push({
        id: 'culture-1',
        title: 'ピアボーナス制度の導入',
        description: '同僚間で感謝を伝え合う仕組み。月間予算を設定し、ポイント制で運用。エンゲージメント向上に直接的な効果。',
        category: 'culture',
        priority: 'medium',
        impact: 7,
        effort: 4,
        timeframe: '1ヶ月',
        roi: 8.2,
        kpis: ['参加率80%以上', '月間感謝メッセージ500件'],
        steps: [
          'システム選定と導入',
          '運用ルールの策定',
          'キックオフイベントの開催',
          '利用促進キャンペーン'
        ]
      })
    }

    // 有給取得率向上
    if (statistics.avgPaidLeaveRate <= 50) {
      suggestions.push({
        id: 'worklife-3',
        title: '計画的有給取得制度',
        description: '年初に有給取得計画を提出し、四半期ごとに進捗確認。取得率80%以上を目標に設定。',
        category: 'worklife',
        priority: 'medium',
        impact: 6,
        effort: 3,
        timeframe: '1ヶ月',
        roi: 7.5,
        kpis: ['有給取得率80%達成', '計画提出率100%'],
        steps: [
          '有給取得推進方針の策定',
          '計画フォーマットの作成',
          '管理職への説明会実施',
          '四半期レビューの実施'
        ]
      })
    }

    // 高リスク職員対策
    if (statistics.highRiskRate >= 20) {
      suggestions.push({
        id: 'stress-2',
        title: 'メンタルヘルスサポートチームの設置',
        description: '産業医、カウンセラー、人事による専門チーム。高リスク職員への積極的アプローチで離職を50%防止。',
        category: 'stress',
        priority: 'high',
        impact: 9,
        effort: 5,
        timeframe: '3週間',
        roi: 9.0,
        kpis: ['高リスク職員の50%改善', 'カウンセリング利用率向上'],
        steps: [
          'チームメンバーの選定',
          'アウトリーチプログラムの設計',
          '相談窓口の設置',
          '定期的なケース会議'
        ]
      })
    }

    // ROIスコアで並び替え
    return suggestions.sort((a, b) => b.roi - a.roi)
  }, [statistics, staffData])

  // カテゴリ別の集計
  const categorySummary = useMemo(() => {
    const summary = {
      stress: suggestions.filter(s => s.category === 'stress'),
      engagement: suggestions.filter(s => s.category === 'engagement'),
      worklife: suggestions.filter(s => s.category === 'worklife'),
      culture: suggestions.filter(s => s.category === 'culture')
    }
    return summary
  }, [suggestions])

  return (
    <div className="space-y-6">
      {/* AIによる総合診断 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AIによる組織診断結果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm leading-relaxed">
                統計分析の結果、「若い人がすぐ辞める」という一般的な認識に反して、
                <strong>年齢の影響は極めて小さい（相関係数-0.05）</strong>ことが判明しました。
                実際に最も強い影響を持つのは<strong>面談頻度（相関係数-0.90）</strong>で、
                相談できる環境の有無が離職の決定的要因となっています。
              </p>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">最大のリスク要因</div>
                  <div className="text-sm text-muted-foreground">
                    面談機会の不足（月平均たった0.5回）
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">改善の最大機会</div>
                  <div className="text-sm text-muted-foreground">
                    面談制度の導入（離職率90%低減可能）
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 優先度の高い改善提案 */}
      <Card>
        <CardHeader>
          <CardTitle>推奨改善施策（ROI順）</CardTitle>
          <CardDescription>
            投資対効果の高い順に表示しています
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{index + 1}. {suggestion.title}</h4>
                      <Badge variant={
                        suggestion.priority === 'high' ? 'destructive' :
                        suggestion.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {suggestion.priority === 'high' ? '最優先' :
                         suggestion.priority === 'medium' ? '優先' : '推奨'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-green-600">
                      {suggestion.roi.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">ROIスコア</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      期待効果
                    </div>
                    <Progress value={suggestion.impact * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      実施期間
                    </div>
                    <div className="text-sm font-medium">{suggestion.timeframe}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <DollarSign className="h-3 w-3" />
                      必要リソース
                    </div>
                    <Progress value={suggestion.effort * 10} className="h-2" />
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-sm font-medium mb-2">KPI目標</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.kpis.map((kpi, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {kpi}
                      </Badge>
                    ))}
                  </div>
                </div>

                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    実施ステップを表示
                  </summary>
                  <ol className="mt-3 space-y-1 text-sm list-decimal list-inside">
                    {suggestion.steps.map((step, idx) => (
                      <li key={idx} className="text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </details>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* カテゴリ別サマリー */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">ストレス管理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorySummary.stress.length}</div>
            <p className="text-xs text-muted-foreground">提案施策</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">エンゲージメント</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorySummary.engagement.length}</div>
            <p className="text-xs text-muted-foreground">提案施策</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">ワークライフバランス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorySummary.worklife.length}</div>
            <p className="text-xs text-muted-foreground">提案施策</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">組織文化</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorySummary.culture.length}</div>
            <p className="text-xs text-muted-foreground">提案施策</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}