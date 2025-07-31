'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  EvaluationGrade,
  FinalEvaluationGrade,
  getEvaluationGradeColor,
} from '@/types/two-axis-evaluation'

interface EvaluationHistoryChartProps {
  history: {
    period: string
    score: number
    facilityEval: EvaluationGrade
    corporateEval: EvaluationGrade
    finalEval: FinalEvaluationGrade
  }[]
}

export const EvaluationHistoryChart: React.FC<EvaluationHistoryChartProps> = ({
  history,
}) => {
  // データを新しい順から古い順に並び替え（グラフ表示用）
  const chartData = [...history].reverse()

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">評価推移</h3>

      {/* スコア推移グラフ */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              name="評価点数"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 評価グレード推移 */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">評価グレード推移</h4>
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {history.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{item.period}</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-12">施設:</span>
                    <Badge
                      style={{
                        backgroundColor: getEvaluationGradeColor(item.facilityEval),
                        color: 'white',
                      }}
                    >
                      {item.facilityEval}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-12">法人:</span>
                    <Badge
                      style={{
                        backgroundColor: getEvaluationGradeColor(item.corporateEval),
                        color: 'white',
                      }}
                    >
                      {item.corporateEval}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-12">総合:</span>
                    <Badge
                      className="font-bold"
                      style={{
                        backgroundColor: getEvaluationGradeColor(item.finalEval),
                        color: 'white',
                      }}
                    >
                      {item.finalEval}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}