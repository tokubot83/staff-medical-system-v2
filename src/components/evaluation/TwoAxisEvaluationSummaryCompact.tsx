import React from 'react'
import { EvaluationGrade, FinalEvaluationGrade, getEvaluationGradeColor, formatPercentile } from '@/types/two-axis-evaluation'

interface TwoAxisEvaluationSummaryCompactProps {
  facilityScore: EvaluationGrade
  facilityRank: number
  facilityTotal: number
  corporateScore: EvaluationGrade
  corporateRank: number
  corporateTotal: number
  overallScore: FinalEvaluationGrade
  description: string
  recommendation: string
}

export const TwoAxisEvaluationSummaryCompact: React.FC<TwoAxisEvaluationSummaryCompactProps> = ({
  facilityScore,
  facilityRank,
  facilityTotal,
  corporateScore,
  corporateRank,
  corporateTotal,
  overallScore,
  description,
  recommendation,
}) => {
  const facilityPercentile = formatPercentile(facilityRank, facilityTotal)
  const corporatePercentile = formatPercentile(corporateRank, corporateTotal)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎯</span>
        <h3 className="text-lg font-bold">総合人事評価</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">施設内</div>
          <div className="text-2xl font-bold" style={{ color: getEvaluationGradeColor(facilityScore) }}>
            {facilityScore}
          </div>
          <div className="text-sm">
            {facilityRank}/{facilityTotal}位
          </div>
          <div className="text-xs text-gray-500">
            ({facilityPercentile})
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">法人内</div>
          <div className="text-2xl font-bold" style={{ color: getEvaluationGradeColor(corporateScore) }}>
            {corporateScore}
          </div>
          <div className="text-sm">
            {corporateRank}/{corporateTotal}位
          </div>
          <div className="text-xs text-gray-500">
            ({corporatePercentile})
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">総合評価</div>
          <div className="text-2xl font-bold" style={{ color: getEvaluationGradeColor(overallScore) }}>
            {overallScore}
          </div>
          <div className="text-sm">優秀</div>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex items-start gap-2">
          <span className="text-sm">💡</span>
          <div className="text-sm">
            <div className="font-medium text-gray-800 mb-1">{description}</div>
            <div className="text-gray-600">{recommendation}</div>
          </div>
        </div>
      </div>
    </div>
  )
}