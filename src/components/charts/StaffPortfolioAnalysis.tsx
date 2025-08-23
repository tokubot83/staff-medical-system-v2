'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CrossTabAnalysisData } from '@/services/crossTabAnalysisService'

// 効果的プレゼン指示書準拠のカラーパレット
const CHART_COLORS = {
  star: '#16a34a',           // 緑 - スター人材
  potential: '#2563eb',      // 青 - ポテンシャル人材
  steady: '#f59e0b',         // オレンジ - 安定貢献人材
  support_needed: '#dc2626', // 赤 - 重点支援人材
  neutral: '#6b7280',        // グレー - 基準線
  highlight: '#fbbf24',      // 黄 - ハイライト
  
  // 背景色（四象限エリア）
  starBg: 'rgba(22, 163, 74, 0.1)',
  potentialBg: 'rgba(37, 99, 235, 0.1)',
  steadyBg: 'rgba(245, 158, 11, 0.1)',
  supportBg: 'rgba(220, 38, 38, 0.1)'
}

interface StaffPortfolioAnalysisProps {
  data: CrossTabAnalysisData
}

export default function StaffPortfolioAnalysis({ data }: StaffPortfolioAnalysisProps) {
  
  const portfolio = data.staffPortfolio
  
  // 四象限の定義（指示書原則：平均線による分割）
  const avgSkill = 75  // 組織平均スキルレベル
  const avgPerformance = 75  // 組織平均パフォーマンス
  
  // 象限の色とラベルマッピング
  const quadrantConfig = {
    star: {
      color: CHART_COLORS.star,
      bgColor: CHART_COLORS.starBg,
      label: '⭐ スター人材',
      description: '高スキル・高パフォーマンス',
      action: 'リーダー候補として育成'
    },
    potential: {
      color: CHART_COLORS.potential,
      bgColor: CHART_COLORS.potentialBg,
      label: '🚀 ポテンシャル人材',
      description: '高スキル・要パフォーマンス向上',
      action: '実践機会の提供で成果向上'
    },
    steady: {
      color: CHART_COLORS.steady,
      bgColor: CHART_COLORS.steadyBg,
      label: '🏛️ 安定貢献人材',
      description: '要スキル向上・高パフォーマンス',
      action: 'スキル研修で更なる成長'
    },
    support_needed: {
      color: CHART_COLORS.support_needed,
      bgColor: CHART_COLORS.supportBg,
      label: '🤝 重点支援人材',
      description: '要スキル向上・要パフォーマンス向上',
      action: '集中的な指導・研修が必要'
    }
  }

  const currentQuadrant = quadrantConfig[portfolio.quadrant]

  // 散布図コンポーネント
  const ScatterPlot = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 職員ポートフォリオ分析
            <Badge 
              style={{ 
                backgroundColor: currentQuadrant.color,
                color: 'white'
              }}
            >
              {currentQuadrant.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* メインメッセージ（データストーリー） */}
          <div 
            className="mb-4 p-3 rounded-lg border-l-4"
            style={{ 
              borderLeftColor: currentQuadrant.color,
              backgroundColor: currentQuadrant.bgColor 
            }}
          >
            <p className="text-sm font-medium">
              <strong>ポジション分析:</strong> スキルレベル{portfolio.skillLevel}点、
              パフォーマンス{portfolio.performance}点で
              <span style={{ color: currentQuadrant.color, fontWeight: 'bold' }}>
                {currentQuadrant.description}
              </span>
              に分類。{currentQuadrant.action}
            </p>
          </div>

          {/* 散布図表示エリア */}
          <div className="relative">
            <div className="h-80 border border-gray-200 rounded-lg bg-white relative overflow-hidden">
              
              {/* 四象限の背景色 */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                {/* 右上: スター人材 */}
                <div 
                  className="border-r border-b border-gray-100"
                  style={{ backgroundColor: CHART_COLORS.starBg }}
                />
                {/* 左上: ポテンシャル人材 */}
                <div 
                  className="border-b border-gray-100"
                  style={{ backgroundColor: CHART_COLORS.potentialBg }}
                />
                {/* 右下: 安定貢献人材 */}
                <div 
                  className="border-r border-gray-100"
                  style={{ backgroundColor: CHART_COLORS.steadyBg }}
                />
                {/* 左下: 重点支援人材 */}
                <div 
                  style={{ backgroundColor: CHART_COLORS.supportBg }}
                />
              </div>

              {/* 基準線（平均値） */}
              {/* 縦線（スキル平均） */}
              <div 
                className="absolute top-0 bottom-0 border-l-2 border-dashed"
                style={{ 
                  left: '50%',
                  borderColor: CHART_COLORS.neutral
                }}
              />
              {/* 横線（パフォーマンス平均） */}
              <div 
                className="absolute left-0 right-0 border-t-2 border-dashed"
                style={{ 
                  top: '50%',
                  borderColor: CHART_COLORS.neutral
                }}
              />

              {/* 軸ラベル */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                スキルレベル →
              </div>
              <div 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-600"
                style={{ transformOrigin: 'center' }}
              >
                パフォーマンス ↑
              </div>

              {/* 象限ラベル */}
              <div className="absolute top-2 right-2 text-xs font-medium text-green-700">
                ⭐ スター人材
              </div>
              <div className="absolute top-2 left-2 text-xs font-medium text-blue-700">
                🚀 ポテンシャル
              </div>
              <div className="absolute bottom-2 right-2 text-xs font-medium text-orange-700">
                🏛️ 安定貢献
              </div>
              <div className="absolute bottom-2 left-2 text-xs font-medium text-red-700">
                🤝 重点支援
              </div>

              {/* 職員のポジション（バブル） */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${(portfolio.skillLevel / 100) * 100}%`,
                  top: `${100 - (portfolio.performance / 100) * 100}%`
                }}
              >
                {/* バブル（経験年数に応じたサイズ） */}
                <div 
                  className="rounded-full border-4 border-white shadow-lg flex items-center justify-center relative"
                  style={{ 
                    width: `${20 + portfolio.experienceYears * 3}px`,
                    height: `${20 + portfolio.experienceYears * 3}px`,
                    backgroundColor: currentQuadrant.color
                  }}
                >
                  <span className="text-white text-xs font-bold">
                    {data.staffName.charAt(0)}
                  </span>
                  
                  {/* データラベル */}
                  <div 
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-sm border text-xs whitespace-nowrap"
                  >
                    <div className="font-medium">{data.staffName}</div>
                    <div className="text-gray-600">
                      スキル{portfolio.skillLevel} / パフォーマンス{portfolio.performance}
                    </div>
                  </div>
                </div>
              </div>

              {/* 平均値の数値表示 */}
              <div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500"
              >
                平均{avgSkill}
              </div>
              <div 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xs text-gray-500 -rotate-90"
                style={{ transformOrigin: 'center' }}
              >
                平均{avgPerformance}
              </div>
            </div>
          </div>

          {/* 詳細分析 */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 現在の位置 */}
            <div 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                borderLeftColor: currentQuadrant.color,
                backgroundColor: currentQuadrant.bgColor 
              }}
            >
              <h4 className="font-medium mb-2">📍 現在のポジション</h4>
              <div className="space-y-1 text-sm">
                <div>分類: <strong>{currentQuadrant.label}</strong></div>
                <div>スキル: <strong>{portfolio.skillLevel}点</strong></div>
                <div>成果: <strong>{portfolio.performance}点</strong></div>
                <div>経験: <strong>{portfolio.experienceYears}年</strong></div>
              </div>
            </div>

            {/* 成長方向性 */}
            <div 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                borderLeftColor: CHART_COLORS.star,
                backgroundColor: CHART_COLORS.starBg 
              }}
            >
              <h4 className="font-medium mb-2">🎯 目標ポジション</h4>
              <div className="space-y-1 text-sm">
                <div>目標: <strong>⭐ スター人材</strong></div>
                <div>必要スキル向上: <strong>+{Math.max(0, 85 - portfolio.skillLevel)}点</strong></div>
                <div>必要パフォーマンス向上: <strong>+{Math.max(0, 85 - portfolio.performance)}点</strong></div>
                <div>推定期間: <strong>1-2年</strong></div>
              </div>
            </div>

            {/* アクションプラン */}
            <div 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                borderLeftColor: CHART_COLORS.highlight,
                backgroundColor: 'rgba(251, 191, 36, 0.1)' 
              }}
            >
              <h4 className="font-medium mb-2">🚀 推奨アクション</h4>
              <div className="text-sm">
                <div className="mb-2">{currentQuadrant.action}</div>
                <div className="space-y-1">
                  {portfolio.quadrant === 'star' && (
                    <>
                      <div>• 後進指導役の任命</div>
                      <div>• 新規プロジェクトリード</div>
                    </>
                  )}
                  {portfolio.quadrant === 'potential' && (
                    <>
                      <div>• 実践プロジェクト参加</div>
                      <div>• 成果発表機会の提供</div>
                    </>
                  )}
                  {portfolio.quadrant === 'steady' && (
                    <>
                      <div>• 専門研修の受講</div>
                      <div>• 資格取得支援</div>
                    </>
                  )}
                  {portfolio.quadrant === 'support_needed' && (
                    <>
                      <div>• 個別指導の強化</div>
                      <div>• 基礎研修の再受講</div>
                    </>
                  )}
                </div>
              </div>
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
        style={{ borderLeftColor: currentQuadrant.color }}
      >
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">
            🎯 人材ポートフォリオ分析結果
          </h3>
          <p className="text-gray-700">
            {data.staffName}さんは組織内で
            <span 
              style={{ 
                color: currentQuadrant.color, 
                fontWeight: 'bold' 
              }}
            >
              {currentQuadrant.description}
            </span>
            として位置づけられます。
            {portfolio.quadrant === 'star' 
              ? '継続的な高いパフォーマンスで組織をリードしており、次世代リーダーとして期待されます。'
              : `${currentQuadrant.action}により、さらなる成長が期待できます。`
            }
          </p>
        </CardContent>
      </Card>

      <ScatterPlot />
    </div>
  )
}