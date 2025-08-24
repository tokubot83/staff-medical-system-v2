'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// データ可視化指示書に基づくインターフェース
interface InterviewVisualizationProps {
  staffId: string
  category: 'regular' | 'special' | 'support'
  data: {
    trends: {
      scores: number[]
      dates: string[]
      avgScore: number
    }
    responsePatterns: {
      questionId: string
      question: string
      responses: Array<{
        date: string
        response: string
        score?: number
      }>
    }[]
    insights: {
      strengths: string[]
      improvements: string[]
      keyTrends: string[]
    }
  }
}

// カラーパレット（認知負荷最小化）
const VISUALIZATION_COLORS = {
  primary: '#2563eb',    // 青 - 主要データ
  success: '#16a34a',    // 緑 - 成功・向上
  warning: '#d97706',    // オレンジ - 注意・改善
  danger: '#dc2626',     // 赤 - 緊急・問題
  neutral: '#6b7280',    // グレー - 基準線
  highlight: '#fbbf24'   // 黄 - ハイライト
}

export default function InterviewDataVisualization({ staffId, category, data }: InterviewVisualizationProps) {
  
  // トレンド分析の可視化
  const TrendVisualization = () => {
    const maxScore = Math.max(...data.trends.scores, 100)
    const avgLine = (data.trends.avgScore / maxScore) * 100

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 面談スコア推移
            <Badge variant="outline" style={{ backgroundColor: VISUALIZATION_COLORS.primary, color: 'white' }}>
              平均{data.trends.avgScore}点
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* グラフエリア */}
            <div className="h-48 border border-gray-200 rounded-lg p-4 bg-gradient-to-b from-blue-50/30 to-white">
              {/* 基準線（平均値） */}
              <div 
                className="absolute left-4 right-4 border-t-2 border-dashed"
                style={{ 
                  borderColor: VISUALIZATION_COLORS.neutral,
                  top: `${100 - avgLine + 16}px`
                }}
              >
                <span 
                  className="absolute -top-2 right-0 text-xs px-1 rounded"
                  style={{ 
                    backgroundColor: VISUALIZATION_COLORS.neutral,
                    color: 'white'
                  }}
                >
                  平均
                </span>
              </div>

              {/* データポイントと線 */}
              <svg className="w-full h-full">
                {/* スコアライン */}
                <polyline
                  fill="none"
                  stroke={VISUALIZATION_COLORS.primary}
                  strokeWidth="3"
                  points={data.trends.scores.map((score, index) => {
                    const x = (index / (data.trends.scores.length - 1)) * 90 + 5
                    const y = 95 - (score / maxScore) * 80
                    return `${x},${y}`
                  }).join(' ')}
                />

                {/* データポイント */}
                {data.trends.scores.map((score, index) => {
                  const x = (index / (data.trends.scores.length - 1)) * 90 + 5
                  const y = 95 - (score / maxScore) * 80
                  const isImproving = index > 0 && score > data.trends.scores[index - 1]
                  
                  return (
                    <g key={index}>
                      <circle
                        cx={`${x}%`}
                        cy={`${Math.max(0, y)}%`}
                        r="6"
                        fill={isImproving ? VISUALIZATION_COLORS.success : VISUALIZATION_COLORS.primary}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={`${x}%`}
                        y={`${Math.max(10, y - 15)}%`}
                        textAnchor="middle"
                        className="text-xs font-medium"
                        fill={VISUALIZATION_COLORS.primary}
                      >
                        {score}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* X軸ラベル */}
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              {data.trends.dates.map((date, index) => (
                <span key={index}>{date}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 回答パターン分析
  const ResponsePatternVisualization = () => {
    // 重要な質問項目のみ表示（認知負荷軽減）
    const keyQuestions = data.responsePatterns.slice(0, 3)

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>💬 主要質問の回答推移</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {keyQuestions.map((pattern, patternIndex) => (
            <div key={patternIndex} className="border rounded-lg p-4">
              <h4 className="font-medium text-sm mb-3 text-gray-800">
                Q. {pattern.question}
              </h4>
              <div className="space-y-2">
                {pattern.responses.map((response, responseIndex) => {
                  // 回答の感情分析（簡易版）
                  const sentiment = response.response.length > 50 ? 'positive' : 
                                   response.response.includes('課題') || response.response.includes('困難') ? 'warning' :
                                   'neutral'
                  
                  const sentimentColor = {
                    positive: VISUALIZATION_COLORS.success,
                    warning: VISUALIZATION_COLORS.warning,
                    neutral: VISUALIZATION_COLORS.neutral
                  }[sentiment]

                  return (
                    <div key={responseIndex} className="flex items-start gap-3">
                      <div 
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: sentimentColor }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-gray-500">{response.date}</span>
                          {response.score && (
                            <Badge 
                              variant="outline" 
                              style={{ 
                                backgroundColor: response.score >= 80 ? VISUALIZATION_COLORS.success : VISUALIZATION_COLORS.warning,
                                color: 'white',
                                fontSize: '10px'
                              }}
                            >
                              {response.score}点
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {response.response.length > 100 
                            ? `${response.response.substring(0, 100)}...`
                            : response.response
                          }
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // インサイトダッシュボード
  const InsightsDashboard = () => {
    return (
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* 強み */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              💪 確認された強み
              <Badge style={{ backgroundColor: VISUALIZATION_COLORS.success, color: 'white' }}>
                {data.insights.strengths.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.insights.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div 
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: VISUALIZATION_COLORS.success }}
                  />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 成長機会 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              🎯 成長機会
              <Badge style={{ backgroundColor: VISUALIZATION_COLORS.warning, color: 'white' }}>
                {data.insights.improvements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.insights.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div 
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: VISUALIZATION_COLORS.warning }}
                  />
                  {improvement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* トレンド */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              📊 主要トレンド
              <Badge style={{ backgroundColor: VISUALIZATION_COLORS.primary, color: 'white' }}>
                分析結果
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div 
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: VISUALIZATION_COLORS.primary }}
                  />
                  {trend}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* データストーリーのメインメッセージ */}
      <Card className="border-l-4" style={{ borderLeftColor: VISUALIZATION_COLORS.primary }}>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">
            📋 面談データサマリー
          </h3>
          <p className="text-gray-700">
            {data.trends.avgScore >= 80 
              ? `優良な面談成果を継続中。平均スコア${data.trends.avgScore}点で安定した成長を示しています。`
              : data.trends.avgScore >= 70
              ? `良好な面談進展。平均スコア${data.trends.avgScore}点でさらなる向上の余地があります。`
              : `面談フォローが必要。平均スコア${data.trends.avgScore}点、重点的な支援をお勧めします。`
            }
          </p>
        </CardContent>
      </Card>

      <TrendVisualization />
      <InsightsDashboard />
      <ResponsePatternVisualization />
    </div>
  )
}