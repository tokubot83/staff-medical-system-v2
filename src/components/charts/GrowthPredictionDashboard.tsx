'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CrossTabAnalysisData } from '@/services/crossTabAnalysisService'

// 効果的プレゼン指示書準拠のカラーパレット
const CHART_COLORS = {
  // 基本色（複合グラフ用）
  actual: '#2563eb',         // 青 - 実績データ
  projected: '#f59e0b',      // オレンジ - 予測データ
  target: '#16a34a',         // 緑 - 目標
  milestone: '#8b5cf6',      // 紫 - マイルストーン
  neutral: '#6b7280',        // グレー - 基準線
  
  // 確率・進捗色分け
  high_prob: '#16a34a',      // 緑 - 高確率
  medium_prob: '#f59e0b',    // オレンジ - 中確率
  low_prob: '#dc2626',       // 赤 - 低確率
  
  // 背景色
  futureBg: 'rgba(245, 158, 11, 0.1)',
  targetBg: 'rgba(22, 163, 74, 0.1)',
  neutralBg: 'rgba(107, 114, 128, 0.05)'
}

interface GrowthPredictionDashboardProps {
  data: CrossTabAnalysisData
}

export default function GrowthPredictionDashboard({ data }: GrowthPredictionDashboardProps) {
  
  // データのバリデーション
  if (!data?.growthPrediction) {
    return (
      <div className="p-4 text-center text-gray-500">
        成長予測データが利用できません
      </div>
    )
  }

  const { historicalGrowth = [], nextMilestone, careerPath } = data.growthPrediction
  
  // historicalGrowthのバリデーション
  if (!Array.isArray(historicalGrowth) || historicalGrowth.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        履歴データが不足しています
      </div>
    )
  }
  
  // 確率による色分け
  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return CHART_COLORS.high_prob
    if (probability >= 50) return CHART_COLORS.medium_prob
    return CHART_COLORS.low_prob
  }
  
  // 確率ラベル
  const getProbabilityLabel = (probability: number) => {
    if (probability >= 75) return '高確率'
    if (probability >= 50) return '中確率'
    return '要努力'
  }

  // 複合グラフ（実績 + 予測）
  const PredictionChart = () => {
    // 数値バリデーションと安全な計算
    const actualScores = historicalGrowth.map(h => h.actualScore).filter(s => typeof s === 'number' && !isNaN(s))
    const projectedScores = historicalGrowth.map(h => h.projectedScore).filter(s => typeof s === 'number' && !isNaN(s))
    
    const maxScore = Math.max(
      ...actualScores,
      ...projectedScores,
      90 // Sグレード目標
    )
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔮 成長予測ダッシュボード
            <Badge 
              style={{ 
                backgroundColor: getProbabilityColor(nextMilestone?.probability || 0),
                color: 'white'
              }}
            >
              {getProbabilityLabel(nextMilestone?.probability || 0)} {nextMilestone?.probability || 0}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* メインメッセージ（データストーリー） */}
          <div 
            className="mb-4 p-3 rounded-lg border-l-4"
            style={{ 
              borderLeftColor: CHART_COLORS.projected,
              backgroundColor: CHART_COLORS.futureBg 
            }}
          >
            <p className="text-sm font-medium">
              <strong>成長予測:</strong> 
              現在のトレンドが継続すれば、
              <span style={{ color: CHART_COLORS.target, fontWeight: 'bold' }}>
                {nextMilestone?.timeframe || '未定'}に{nextMilestone?.target || '目標'}
              </span>
              を達成する確率は
              <span style={{ color: getProbabilityColor(nextMilestone?.probability || 0), fontWeight: 'bold' }}>
                {nextMilestone?.probability || 0}%
              </span>
              です。
            </p>
          </div>

          {/* 複合グラフ表示エリア */}
          <div className="relative">
            <div className="h-64 border border-gray-200 rounded-lg p-4 bg-gradient-to-b from-orange-50/30 to-white relative">
              
              {/* 目標基準線（Sグレード90点） */}
              <div 
                className="absolute left-4 right-4 border-t-2 border-dashed"
                style={{ 
                  borderColor: CHART_COLORS.target,
                  top: `${16 + (100 - (90 / maxScore) * 80)}px`
                }}
              >
                <span 
                  className="absolute -top-2 right-0 text-xs px-1 rounded"
                  style={{ 
                    backgroundColor: CHART_COLORS.target,
                    color: 'white'
                  }}
                >
                  目標90点
                </span>
              </div>

              {/* グラフ描画 */}
              <svg className="w-full h-full">
                {/* 実績ライン */}
                <polyline
                  fill="none"
                  stroke={CHART_COLORS.actual}
                  strokeWidth="3"
                  points={historicalGrowth
                    .filter(h => h.actualScore)
                    .map((point, index) => {
                      const x = (index / (historicalGrowth.length - 1)) * 90 + 5
                      const y = 95 - ((point.actualScore! / maxScore) * 80)
                      return `${x},${y}`
                    }).join(' ')}
                />

                {/* 予測ライン */}
                <polyline
                  fill="none"
                  stroke={CHART_COLORS.projected}
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  points={historicalGrowth
                    .filter(h => h.projectedScore)
                    .map((point, index, arr) => {
                      const startIndex = historicalGrowth.filter(h => h.actualScore).length - 1
                      const x = ((startIndex + index) / (historicalGrowth.length - 1)) * 90 + 5
                      const y = 95 - ((point.projectedScore! / maxScore) * 80)
                      return `${x},${y}`
                    }).join(' ')}
                />

                {/* データポイント（実績） */}
                {historicalGrowth
                  .filter(h => h.actualScore)
                  .map((point, index) => {
                    const x = (index / (historicalGrowth.length - 1)) * 90 + 5
                    const y = 95 - ((point.actualScore! / maxScore) * 80)
                    
                    return (
                      <g key={`actual-${index}`}>
                        <circle
                          cx={`${x}%`}
                          cy={`${Math.max(0, y)}%`}
                          r="6"
                          fill={CHART_COLORS.actual}
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={`${x}%`}
                          y={`${Math.max(10, y - 15)}%`}
                          textAnchor="middle"
                          className="text-xs font-medium"
                          fill={CHART_COLORS.actual}
                        >
                          {point.actualScore}
                        </text>
                      </g>
                    )
                  })}

                {/* データポイント（予測） */}
                {historicalGrowth
                  .filter(h => h.projectedScore)
                  .map((point, index) => {
                    const startIndex = historicalGrowth.filter(h => h.actualScore).length - 1
                    const x = ((startIndex + index) / (historicalGrowth.length - 1)) * 90 + 5
                    const y = 95 - ((point.projectedScore! / maxScore) * 80)
                    
                    return (
                      <g key={`projected-${index}`}>
                        <circle
                          cx={`${x}%`}
                          cy={`${Math.max(0, y)}%`}
                          r="5"
                          fill="none"
                          stroke={CHART_COLORS.projected}
                          strokeWidth="2"
                          strokeDasharray="2,2"
                        />
                        <text
                          x={`${x}%`}
                          y={`${Math.max(10, y - 15)}%`}
                          textAnchor="middle"
                          className="text-xs font-medium"
                          fill={CHART_COLORS.projected}
                        >
                          {point.projectedScore}
                        </text>
                      </g>
                    )
                  })}
              </svg>

              {/* X軸ラベル */}
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                {historicalGrowth.map((point, index) => (
                  <span 
                    key={index}
                    style={{ 
                      color: point.actualScore ? CHART_COLORS.actual : CHART_COLORS.projected,
                      fontWeight: point.actualScore ? 'normal' : 'bold'
                    }}
                  >
                    {point.date}
                  </span>
                ))}
              </div>
            </div>

            {/* 凡例 */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-1 rounded"
                  style={{ backgroundColor: CHART_COLORS.actual }}
                />
                <span>実績データ</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-1 rounded border-dashed border-2"
                  style={{ borderColor: CHART_COLORS.projected }}
                />
                <span>予測データ</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-1 border-dashed border-2"
                  style={{ borderColor: CHART_COLORS.target }}
                />
                <span>目標値</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // マイルストーン・キャリアパス予測
  const CareerPathPrediction = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* 次期マイルストーン */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 次期マイルストーン
              <Badge 
                style={{ 
                  backgroundColor: getProbabilityColor(nextMilestone.probability),
                  color: 'white'
                }}
              >
                {nextMilestone.timeframe}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: CHART_COLORS.targetBg }}
            >
              <h4 
                className="font-bold text-lg mb-2"
                style={{ color: CHART_COLORS.target }}
              >
                {nextMilestone.target}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600">達成確率:</span>
                <Progress 
                  value={nextMilestone.probability} 
                  className="flex-1 h-2"
                />
                <span 
                  className="font-bold text-sm"
                  style={{ color: getProbabilityColor(nextMilestone.probability) }}
                >
                  {nextMilestone.probability}%
                </span>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">📋 達成要件</h5>
              <ul className="space-y-1">
                {nextMilestone.requirements.map((req, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* キャリアパス進捗 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 昇進予測
              <Badge 
                style={{ 
                  backgroundColor: CHART_COLORS.milestone,
                  color: 'white'
                }}
              >
                {careerPath.estimatedTimeToPromotion}後
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 現在→次段階の進捗 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{careerPath.currentLevel}</span>
                  <span className="text-sm font-medium">{careerPath.nextLevel}</span>
                </div>
                <Progress 
                  value={careerPath.progressPercentage} 
                  className="h-3"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">現在位置</span>
                  <span 
                    className="text-xs font-bold"
                    style={{ color: CHART_COLORS.milestone }}
                  >
                    {careerPath.progressPercentage}% 完了
                  </span>
                </div>
              </div>

              {/* 昇進ロードマップ */}
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: CHART_COLORS.neutralBg }}
              >
                <h5 className="font-medium mb-2 text-sm">📅 昇進ロードマップ</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHART_COLORS.actual }}
                    />
                    <span className="text-xs">現在: {careerPath.currentLevel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2"
                      style={{ borderColor: CHART_COLORS.milestone }}
                    />
                    <span className="text-xs">
                      予定({careerPath.estimatedTimeToPromotion}後): {careerPath.nextLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* 成功要因 */}
              <div>
                <h5 className="font-medium mb-2 text-sm">✨ 昇進加速要因</h5>
                <div className="text-xs space-y-1">
                  <div>• V3評価でのSグレード達成</div>
                  <div>• リーダーシップ実績の蓄積</div>
                  <div>• 組織横断プロジェクトでの成果</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* データストーリーのメインメッセージ */}
      <Card 
        className="border-l-4"
        style={{ borderLeftColor: CHART_COLORS.projected }}
      >
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">
            🔮 統合データによる成長予測分析
          </h3>
          <p className="text-gray-700">
            過去の実績データとトレンド分析により、
            <span style={{ color: CHART_COLORS.target, fontWeight: 'bold' }}>
              {nextMilestone.target}
            </span>
            を{nextMilestone.timeframe}に達成する確率を
            <span style={{ color: getProbabilityColor(nextMilestone.probability), fontWeight: 'bold' }}>
              {nextMilestone.probability}%
            </span>
            と予測。キャリア発展に向けた戦略的サポートが効果的です。
          </p>
        </CardContent>
      </Card>

      <PredictionChart />
      <CareerPathPrediction />
    </div>
  )
}