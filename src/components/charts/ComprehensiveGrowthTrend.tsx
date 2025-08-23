'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CrossTabAnalysisData } from '@/services/crossTabAnalysisService'

// 効果的プレゼン指示書準拠のカラーパレット
const CHART_COLORS = {
  // 基本色（1-2色限定）
  primary: '#2563eb',    // 青 - 主要データ
  success: '#16a34a',    // 緑 - 成功・向上
  warning: '#f59e0b',    // オレンジ - 注意・改善必要
  danger: '#dc2626',     // 赤 - 減少・問題
  neutral: '#6b7280',    // グレー - 基準線・その他
  highlight: '#fbbf24',  // 黄 - ハイライト
  
  // 背景色（エリア塗りつぶし用）
  successBg: 'rgba(22, 163, 74, 0.1)',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  neutralBg: 'rgba(107, 114, 128, 0.05)'
}

interface ComprehensiveGrowthTrendProps {
  data: CrossTabAnalysisData
}

export default function ComprehensiveGrowthTrend({ data }: ComprehensiveGrowthTrendProps) {
  
  // 滝グラフ（V3評価要因分解）
  const WaterfallChart = () => {
    const { baseline, factors, current, targetGap } = data.evaluationWaterfall
    const maxValue = Math.max(baseline, current, 90) // Sグレード90点
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 V3評価スコア要因分解
            <Badge 
              style={{ 
                backgroundColor: current >= baseline ? CHART_COLORS.success : CHART_COLORS.warning,
                color: 'white'
              }}
            >
              {current >= baseline ? '向上' : '要改善'} {(current - baseline).toFixed(1)}点
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* メインメッセージ（データストーリー） */}
            <div 
              className="mb-4 p-3 rounded-lg border-l-4"
              style={{ 
                borderLeftColor: CHART_COLORS.primary,
                backgroundColor: CHART_COLORS.neutralBg 
              }}
            >
              <p className="text-sm font-medium">
                <strong>成長ストーリー:</strong> 技術スキル向上(+{factors.find(f => f.name.includes('技術'))?.value}点)と
                組織貢献度向上(+{factors.find(f => f.name.includes('組織'))?.value}点)により
                V3評価が{baseline}点から{current}点に向上。
                Sグレード達成まで残り{targetGap.toFixed(1)}点。
              </p>
            </div>

            {/* 滝グラフ表示エリア */}
            <div className="h-64 border border-gray-200 rounded-lg p-4 bg-gradient-to-b from-blue-50/30 to-white relative">
              
              {/* 基準線（目標値90点） */}
              <div 
                className="absolute left-4 right-4 border-t-2 border-dashed"
                style={{ 
                  borderColor: CHART_COLORS.neutral,
                  top: `${16 + (100 - (90 / maxValue) * 80)}px`
                }}
              >
                <span 
                  className="absolute -top-2 right-0 text-xs px-1 rounded"
                  style={{ 
                    backgroundColor: CHART_COLORS.neutral,
                    color: 'white'
                  }}
                >
                  Sグレード目標(90点)
                </span>
              </div>

              {/* 滝グラフの各要素 */}
              <div className="flex justify-between items-end h-full pt-8">
                
                {/* 開始点（前回評価） */}
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 rounded-t"
                    style={{ 
                      height: `${(baseline / maxValue) * 80}%`,
                      backgroundColor: CHART_COLORS.neutral
                    }}
                  />
                  <div className="text-xs mt-1 text-center">
                    <div className="font-medium">{baseline}</div>
                    <div className="text-gray-500">前回</div>
                  </div>
                </div>

                {/* 増減要因 */}
                {factors.map((factor, index) => {
                  const isIncrease = factor.type === 'increase'
                  const color = isIncrease ? CHART_COLORS.success : CHART_COLORS.danger
                  const height = Math.abs(factor.value)
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-10 rounded-t relative"
                        style={{ 
                          height: `${(height / maxValue) * 80}%`,
                          backgroundColor: color,
                          minHeight: '20px'
                        }}
                      >
                        {/* 数値ラベル（重要ポイントのみ） */}
                        <span 
                          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium"
                          style={{ color: color }}
                        >
                          {isIncrease ? '+' : ''}{factor.value}
                        </span>
                      </div>
                      <div className="text-xs mt-1 text-center max-w-16">
                        <div className="text-gray-700 leading-tight">{factor.name}</div>
                      </div>
                    </div>
                  )
                })}

                {/* 現在値 */}
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 rounded-t"
                    style={{ 
                      height: `${(current / maxValue) * 80}%`,
                      backgroundColor: CHART_COLORS.primary
                    }}
                  />
                  <div className="text-xs mt-1 text-center">
                    <div 
                      className="font-bold"
                      style={{ color: CHART_COLORS.primary }}
                    >
                      {current}
                    </div>
                    <div className="text-gray-500">現在</div>
                  </div>
                </div>

                {/* 目標までのギャップ */}
                <div className="flex flex-col items-center">
                  <div 
                    className="w-10 rounded-t border-2 border-dashed"
                    style={{ 
                      height: `${(targetGap / maxValue) * 80}%`,
                      borderColor: CHART_COLORS.warning,
                      backgroundColor: CHART_COLORS.warningBg,
                      minHeight: '20px'
                    }}
                  >
                    <span 
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium"
                      style={{ color: CHART_COLORS.warning }}
                    >
                      +{targetGap.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs mt-1 text-center max-w-16">
                    <div className="text-gray-700 leading-tight">目標まで</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 成長要因の詳細分析 */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {factors.filter(f => f.type === 'increase').slice(0, 3).map((factor, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg border-l-4"
                  style={{ 
                    borderLeftColor: CHART_COLORS.success,
                    backgroundColor: CHART_COLORS.successBg 
                  }}
                >
                  <div className="text-sm font-medium text-gray-800">
                    {factor.name}
                  </div>
                  <div 
                    className="text-lg font-bold"
                    style={{ color: CHART_COLORS.success }}
                  >
                    +{factor.value}点
                  </div>
                  <div className="text-xs text-gray-600">
                    {factor.category === 'technical' ? '技術領域での成果' :
                     factor.category === 'contribution' ? '組織貢献での成果' :
                     'リーダーシップでの成果'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 成長タイムライン（線グラフ + 複合グラフ）
  const GrowthTimeline = () => {
    const timeline = data.growthStory.timeline
    const prediction = data.growthPrediction.historicalGrowth
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 統合成長タイムライン
            <Badge 
              style={{ 
                backgroundColor: data.growthStory.overallTrend === 'improving' ? CHART_COLORS.success : CHART_COLORS.warning,
                color: 'white'
              }}
            >
              {data.growthStory.overallTrend === 'improving' ? '成長継続中' : '要改善'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* メッセージ（引き算によるシンプル化） */}
          <div 
            className="mb-4 p-3 rounded-lg"
            style={{ backgroundColor: CHART_COLORS.neutralBg }}
          >
            <p className="text-sm">
              <strong>統合分析:</strong> 
              評価→面談→研修→実績の好循環により持続的成長を実現。
              次期主任昇進に向け順調に進捗中。
            </p>
          </div>

          {/* タイムライン表示 */}
          <div className="space-y-4">
            {timeline.map((event, index) => {
              const categoryColors = {
                evaluation: CHART_COLORS.primary,
                interview: CHART_COLORS.success,
                training: CHART_COLORS.warning,
                development: CHART_COLORS.highlight
              }
              
              const categoryIcons = {
                evaluation: '📊',
                interview: '💬',
                training: '📚',
                development: '🚀'
              }

              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: categoryColors[event.category] }}
                    >
                      {categoryIcons[event.category]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">{event.date}</span>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: categoryColors[event.category] }}
                      >
                        {event.event}
                      </span>
                      {event.score && (
                        <Badge variant="outline">
                          {event.score}点
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{event.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 主要マイルストーン */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">🏆 達成マイルストーン</h4>
            <div className="flex flex-wrap gap-2">
              {data.growthStory.keyMilestones.map((milestone, index) => (
                <Badge 
                  key={index}
                  style={{ 
                    backgroundColor: CHART_COLORS.success,
                    color: 'white'
                  }}
                >
                  {milestone}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* データストーリーのメインメッセージ */}
      <Card 
        className="border-l-4"
        style={{ borderLeftColor: CHART_COLORS.primary }}
      >
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">
            📋 総合成長分析サマリー
          </h3>
          <p className="text-gray-700">
            {data.staffName}さんは各システムでの連携効果により継続的な成長を実現。
            V3評価{data.evaluationWaterfall.current}点、面談での積極的な改善意欲、
            研修での着実なスキル向上により、次期昇進候補として有力です。
          </p>
        </CardContent>
      </Card>

      <WaterfallChart />
      <GrowthTimeline />
    </div>
  )
}