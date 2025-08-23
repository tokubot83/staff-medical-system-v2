'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CrossTabAnalysisData } from '@/services/crossTabAnalysisService'

// 効果的プレゼン指示書準拠のカラーパレット
const CHART_COLORS = {
  // 基本色（1-2色限定原則）
  strength: '#16a34a',       // 緑 - 強み
  improvement: '#dc2626',    // 赤 - 改善点
  neutral: '#6b7280',        // グレー - その他
  highlight: '#fbbf24',      // 黄 - ハイライト
  
  // ソース別色分け
  evaluation: '#2563eb',     // 青 - 評価システム
  interview: '#16a34a',      // 緑 - 面談
  training: '#f59e0b',       // オレンジ - 研修
  development: '#8b5cf6',    // 紫 - 成長・発達
  
  // 優先度別色分け
  high: '#dc2626',           // 赤 - 高優先度
  medium: '#f59e0b',         // オレンジ - 中優先度
  low: '#6b7280',            // グレー - 低優先度
  
  // 背景色
  strengthBg: 'rgba(22, 163, 74, 0.1)',
  improvementBg: 'rgba(220, 38, 38, 0.1)',
  neutralBg: 'rgba(107, 114, 128, 0.05)'
}

interface StrengthsWeaknessesMapProps {
  data: CrossTabAnalysisData
}

export default function StrengthsWeaknessesMap({ data }: StrengthsWeaknessesMapProps) {
  
  const { strengths, improvements } = data.strengthsWeaknesses
  
  // ソースアイコンマッピング
  const sourceIcons = {
    evaluation: '📊',
    interview: '💬', 
    training: '📚',
    development: '🚀'
  }
  
  // ソースラベルマッピング
  const sourceLabels = {
    evaluation: '評価',
    interview: '面談',
    training: '研修',
    development: '成長'
  }

  // 横棒グラフ（強み）
  const StrengthsChart = () => {
    const maxScore = Math.max(...strengths.map(s => s.score), 100)
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💪 統合強みマップ
            <Badge 
              style={{ 
                backgroundColor: CHART_COLORS.strength,
                color: 'white'
              }}
            >
              {strengths.length}項目確認済み
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* メインメッセージ（データストーリー） */}
          <div 
            className="mb-4 p-3 rounded-lg border-l-4"
            style={{ 
              borderLeftColor: CHART_COLORS.strength,
              backgroundColor: CHART_COLORS.strengthBg 
            }}
          >
            <p className="text-sm font-medium">
              <strong>強み分析:</strong> 
              各システムでの評価結果により、
              <span style={{ color: CHART_COLORS.strength, fontWeight: 'bold' }}>
                {strengths[0]?.item}
              </span>
              が最大の強みとして確認されました。
              これらは昇進・キャリア発展の基盤となります。
            </p>
          </div>

          {/* 横棒グラフ */}
          <div className="space-y-3">
            {strengths.map((strength, index) => {
              const sourceColor = CHART_COLORS[strength.source]
              const percentage = (strength.score / maxScore) * 100
              const isTop = index === 0 // トップ項目を強調
              
              return (
                <div key={index} className="relative">
                  {/* バックグラウンドバー */}
                  <div 
                    className="h-12 rounded-lg border flex items-center relative overflow-hidden"
                    style={{ backgroundColor: isTop ? CHART_COLORS.strengthBg : CHART_COLORS.neutralBg }}
                  >
                    {/* 実績バー */}
                    <div 
                      className="h-full rounded-lg transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: isTop ? CHART_COLORS.strength : sourceColor
                      }}
                    />
                    
                    {/* ラベルとデータ */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <div className="flex items-center gap-3">
                        {/* ランキング番号 */}
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: isTop ? CHART_COLORS.strength : sourceColor }}
                        >
                          {index + 1}
                        </div>
                        
                        {/* 強み項目名 */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{sourceIcons[strength.source]}</span>
                          <span 
                            className={`text-sm ${isTop ? 'font-bold' : 'font-medium'}`}
                            style={{ color: isTop ? CHART_COLORS.strength : '#374151' }}
                          >
                            {strength.item}
                          </span>
                        </div>
                      </div>
                      
                      {/* スコアとソース */}
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline"
                          style={{ 
                            borderColor: sourceColor,
                            color: sourceColor
                          }}
                        >
                          {sourceLabels[strength.source]}
                        </Badge>
                        
                        <div className="text-right">
                          <div 
                            className="text-lg font-bold"
                            style={{ color: isTop ? CHART_COLORS.strength : sourceColor }}
                          >
                            {strength.score}
                          </div>
                          <div className="text-xs text-gray-500">
                            {strength.trend === 'improving' ? '📈 向上中' : '➡️ 安定'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  // 横棒グラフ（改善点）
  const ImprovementsChart = () => {
    const maxPriorityScore = 100 // 優先度の最大値
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 統合課題マップ
            <Badge 
              style={{ 
                backgroundColor: CHART_COLORS.improvement,
                color: 'white'
              }}
            >
              {improvements.filter(i => i.priority === 'high').length}項目が高優先度
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* メインメッセージ（データストーリー） */}
          <div 
            className="mb-4 p-3 rounded-lg border-l-4"
            style={{ 
              borderLeftColor: CHART_COLORS.improvement,
              backgroundColor: CHART_COLORS.improvementBg 
            }}
          >
            <p className="text-sm font-medium">
              <strong>改善優先度分析:</strong> 
              <span style={{ color: CHART_COLORS.high, fontWeight: 'bold' }}>
                {improvements.find(i => i.priority === 'high')?.item}
              </span>
              が最重要課題です。
              {improvements.find(i => i.priority === 'high')?.actionRequired}
              により改善を図ることで、総合評価のさらなる向上が期待されます。
            </p>
          </div>

          {/* 横棒グラフ */}
          <div className="space-y-3">
            {improvements.map((improvement, index) => {
              const sourceColor = CHART_COLORS[improvement.source]
              const priorityColor = CHART_COLORS[improvement.priority]
              const percentage = (improvement.score / maxPriorityScore) * 100
              const isHighPriority = improvement.priority === 'high'
              
              return (
                <div key={index} className="relative">
                  {/* バックグラウンドバー */}
                  <div 
                    className="h-14 rounded-lg border flex items-center relative overflow-hidden"
                    style={{ backgroundColor: isHighPriority ? CHART_COLORS.improvementBg : CHART_COLORS.neutralBg }}
                  >
                    {/* 現在スコアバー */}
                    <div 
                      className="h-full rounded-lg transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: isHighPriority ? CHART_COLORS.improvement : priorityColor,
                        opacity: 0.7
                      }}
                    />
                    
                    {/* ラベルとデータ */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <div className="flex items-center gap-3 flex-1">
                        {/* 優先度アイコン */}
                        <div 
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: priorityColor }}
                        >
                          {improvement.priority === 'high' ? '🔥' : 
                           improvement.priority === 'medium' ? '⚠️' : '📝'}
                        </div>
                        
                        {/* 改善項目情報 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{sourceIcons[improvement.source]}</span>
                            <span 
                              className={`text-sm ${isHighPriority ? 'font-bold' : 'font-medium'} truncate`}
                              style={{ color: isHighPriority ? CHART_COLORS.improvement : '#374151' }}
                            >
                              {improvement.item}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            👉 {improvement.actionRequired}
                          </div>
                        </div>
                      </div>
                      
                      {/* スコアと優先度 */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge 
                          style={{ 
                            backgroundColor: priorityColor,
                            color: 'white',
                            fontSize: '10px'
                          }}
                        >
                          {improvement.priority === 'high' ? '高' : 
                           improvement.priority === 'medium' ? '中' : '低'}優先度
                        </Badge>
                        
                        <Badge 
                          variant="outline"
                          style={{ 
                            borderColor: sourceColor,
                            color: sourceColor
                          }}
                        >
                          {sourceLabels[improvement.source]}
                        </Badge>
                        
                        <div className="text-right">
                          <div 
                            className="text-lg font-bold"
                            style={{ color: isHighPriority ? CHART_COLORS.improvement : priorityColor }}
                          >
                            {improvement.score}
                          </div>
                          <div className="text-xs text-gray-500">
                            現在値
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* アクションプラン要約 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              🚀 優先アクションプラン
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvements.filter(i => i.priority === 'high').map((item, index) => (
                <div 
                  key={index}
                  className="p-3 bg-white rounded border-l-4"
                  style={{ borderLeftColor: CHART_COLORS.improvement }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{sourceIcons[item.source]}</span>
                    <span className="font-medium text-sm">{item.item}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    現在{item.score}点 → 目標85点以上
                  </div>
                  <div 
                    className="text-xs font-medium"
                    style={{ color: CHART_COLORS.improvement }}
                  >
                    {item.actionRequired}
                  </div>
                </div>
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
        style={{ borderLeftColor: CHART_COLORS.highlight }}
      >
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">
            📊 横断分析による統合強み・課題マップ
          </h3>
          <p className="text-gray-700">
            評価・面談・研修・成長の4システムを横断分析した結果、
            <span style={{ color: CHART_COLORS.strength, fontWeight: 'bold' }}>
              {strengths.length}項目の強み
            </span>
            と
            <span style={{ color: CHART_COLORS.improvement, fontWeight: 'bold' }}>
              {improvements.length}項目の改善機会
            </span>
            を特定。重要度順に配置し、戦略的な成長プランを提示します。
          </p>
        </CardContent>
      </Card>

      <StrengthsChart />
      <ImprovementsChart />
    </div>
  )
}