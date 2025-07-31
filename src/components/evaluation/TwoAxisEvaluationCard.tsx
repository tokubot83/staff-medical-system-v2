'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  EvaluationGrade,
  FinalEvaluationGrade,
  getEvaluationGradeColor,
  getEvaluationGradeLabel,
} from '@/types/two-axis-evaluation'

interface TwoAxisEvaluationCardProps {
  evaluation: {
    period: string
    score: number
    facilityEval: EvaluationGrade
    facilityRank: number
    facilityTotal: number
    corporateEval: EvaluationGrade
    corporateRank: number
    corporateTotal: number
    finalEval: FinalEvaluationGrade
    description: string
    recommendation: string
  }
}

export const TwoAxisEvaluationCard: React.FC<TwoAxisEvaluationCardProps> = ({
  evaluation,
}) => {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold">人事評価結果 ({evaluation.period})</h3>
      </div>

      {/* 評価シート点数 */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 block mb-1">評価シート点数</label>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-600">{evaluation.score}</span>
          <span className="text-lg text-gray-600">点</span>
        </div>
      </div>

      {/* 2軸評価 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">施設内評価</div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className="text-xl font-bold px-3 py-1"
              style={{
                backgroundColor: getEvaluationGradeColor(evaluation.facilityEval),
                color: 'white',
              }}
            >
              {evaluation.facilityEval}
            </Badge>
          </div>
          <div className="text-xs text-gray-600">
            {evaluation.facilityTotal}名中{evaluation.facilityRank}位
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">法人内評価</div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className="text-xl font-bold px-3 py-1"
              style={{
                backgroundColor: getEvaluationGradeColor(evaluation.corporateEval),
                color: 'white',
              }}
            >
              {evaluation.corporateEval}
            </Badge>
          </div>
          <div className="text-xs text-gray-600">
            {evaluation.corporateTotal}名中{evaluation.corporateRank}位
          </div>
        </div>
      </div>

      {/* 総合評価 */}
      <div className="bg-purple-50 p-5 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">総合評価</div>
        <div className="flex items-center gap-3 mb-3">
          <Badge
            className="text-2xl font-bold px-4 py-2"
            style={{
              backgroundColor: getEvaluationGradeColor(evaluation.finalEval),
              color: 'white',
            }}
          >
            {evaluation.finalEval}
          </Badge>
          <span className="text-lg font-semibold">
            {getEvaluationGradeLabel(evaluation.finalEval)}
          </span>
        </div>
        <div className="text-sm text-gray-700 mb-2">{evaluation.description}</div>
        <div className="text-sm text-blue-600 font-medium">
          💡 {evaluation.recommendation}
        </div>
      </div>
    </Card>
  )
}