import React from 'react'
import { EvaluationGrade, FinalEvaluationGrade, getEvaluationGradeColor, formatPercentile } from '@/types/two-axis-evaluation'

interface TwoAxisEvaluationSummaryDetailedProps {
  facilityScore: EvaluationGrade
  facilityRank: number
  facilityTotal: number
  corporateScore: EvaluationGrade
  corporateRank: number
  corporateTotal: number
  overallScore: FinalEvaluationGrade
  description: string
  recommendation: string
  strengthArea?: string
  improvementArea?: string
}

export const TwoAxisEvaluationSummaryDetailed: React.FC<TwoAxisEvaluationSummaryDetailedProps> = ({
  facilityScore,
  facilityRank,
  facilityTotal,
  corporateScore,
  corporateRank,
  corporateTotal,
  overallScore,
  description,
  recommendation,
  strengthArea,
  improvementArea,
}) => {
  const facilityPercentile = formatPercentile(facilityRank, facilityTotal)
  const corporatePercentile = formatPercentile(corporateRank, corporateTotal)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📊</span>
        <h3 className="text-xl font-bold">総合人事評価 - 詳細分析</h3>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">施設内</div>
          <div className="text-3xl font-bold mb-1" style={{ color: getEvaluationGradeColor(facilityScore) }}>
            {facilityScore}
          </div>
          <div className="text-sm font-medium">
            {facilityRank}/{facilityTotal}位
          </div>
          <div className="text-sm text-gray-500">
            ({facilityPercentile})
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">法人内</div>
          <div className="text-3xl font-bold mb-1" style={{ color: getEvaluationGradeColor(corporateScore) }}>
            {corporateScore}
          </div>
          <div className="text-sm font-medium">
            {corporateRank}/{corporateTotal}位
          </div>
          <div className="text-sm text-gray-500">
            ({corporatePercentile})
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">総合評価</div>
          <div className="text-3xl font-bold mb-1" style={{ color: getEvaluationGradeColor(overallScore) }}>
            {overallScore}
          </div>
          <div className="text-sm font-medium">優秀</div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <h4 className="text-base font-semibold mb-2">評価インサイト</h4>
              <p className="text-lg font-medium text-gray-800 mb-3">「{description}」</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-3">
            <h5 className="text-sm font-semibold text-green-800 mb-1">強み</h5>
            <p className="text-sm text-green-700">
              {strengthArea || '施設内での圧倒的なパフォーマンス'}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <h5 className="text-sm font-semibold text-blue-800 mb-1">機会</h5>
            <p className="text-sm text-blue-700">
              {improvementArea || '法人規模での更なる成長余地'}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-3">
            <h5 className="text-sm font-semibold text-purple-800 mb-1">推奨</h5>
            <p className="text-sm text-purple-700">{recommendation}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            評価推移グラフ
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            詳細レポート
          </button>
        </div>
      </div>
    </div>
  )
}