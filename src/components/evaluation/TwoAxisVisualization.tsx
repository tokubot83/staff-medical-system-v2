'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import {
  EvaluationGrade,
  FinalEvaluationGrade,
  getEvaluationGradeColor,
} from '@/types/two-axis-evaluation'

interface TwoAxisVisualizationProps {
  facilityEval: EvaluationGrade
  facilityRank: number
  facilityTotal: number
  corporateEval: EvaluationGrade
  corporateRank: number
  corporateTotal: number
  finalEval: FinalEvaluationGrade
}

export const TwoAxisVisualization: React.FC<TwoAxisVisualizationProps> = ({
  facilityEval,
  facilityRank,
  facilityTotal,
  corporateEval,
  corporateRank,
  corporateTotal,
  finalEval,
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-6">2軸評価分析</h3>

      <div className="flex items-center justify-around">
        {/* 施設内評価 */}
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: `${getEvaluationGradeColor(facilityEval)}20`,
              border: `3px solid ${getEvaluationGradeColor(facilityEval)}`,
            }}
          >
            <span
              className="text-3xl font-bold"
              style={{ color: getEvaluationGradeColor(facilityEval) }}
            >
              {facilityEval}
            </span>
          </div>
          <div className="mt-3 font-semibold">施設内評価</div>
          <div className="text-sm text-gray-600">
            {facilityTotal}名中{facilityRank}位
          </div>
        </div>

        {/* 矢印 */}
        <ArrowRight className="text-gray-400" size={32} />

        {/* 法人内評価 */}
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: `${getEvaluationGradeColor(corporateEval)}20`,
              border: `3px solid ${getEvaluationGradeColor(corporateEval)}`,
            }}
          >
            <span
              className="text-3xl font-bold"
              style={{ color: getEvaluationGradeColor(corporateEval) }}
            >
              {corporateEval}
            </span>
          </div>
          <div className="mt-3 font-semibold">法人内評価</div>
          <div className="text-sm text-gray-600">
            {corporateTotal}名中{corporateRank}位
          </div>
        </div>

        {/* 矢印 */}
        <ArrowRight className="text-gray-400" size={32} />

        {/* 総合評価 */}
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: `${getEvaluationGradeColor(finalEval)}20`,
              border: `3px solid ${getEvaluationGradeColor(finalEval)}`,
            }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: getEvaluationGradeColor(finalEval) }}
            >
              {finalEval}
            </span>
          </div>
          <div className="mt-3 font-semibold">総合評価</div>
          <div className="text-sm text-gray-600">マトリクス判定</div>
        </div>
      </div>

      {/* マトリクス表 */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold mb-3">評価マトリクス</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50">法人内＼施設内</th>
                <th className="border p-2 bg-gray-50">S</th>
                <th className="border p-2 bg-gray-50">A</th>
                <th className="border p-2 bg-gray-50">B</th>
                <th className="border p-2 bg-gray-50">C</th>
                <th className="border p-2 bg-gray-50">D</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border p-2 bg-gray-50">S</th>
                <td className={getCellClass('S', 'S', corporateEval, facilityEval)}>S+</td>
                <td className={getCellClass('S', 'A', corporateEval, facilityEval)}>S</td>
                <td className={getCellClass('S', 'B', corporateEval, facilityEval)}>S</td>
                <td className={getCellClass('S', 'C', corporateEval, facilityEval)}>A</td>
                <td className={getCellClass('S', 'D', corporateEval, facilityEval)}>B</td>
              </tr>
              <tr>
                <th className="border p-2 bg-gray-50">A</th>
                <td className={getCellClass('A', 'S', corporateEval, facilityEval)}>S</td>
                <td className={getCellClass('A', 'A', corporateEval, facilityEval)}>A+</td>
                <td className={getCellClass('A', 'B', corporateEval, facilityEval)}>A</td>
                <td className={getCellClass('A', 'C', corporateEval, facilityEval)}>B</td>
                <td className={getCellClass('A', 'D', corporateEval, facilityEval)}>C</td>
              </tr>
              <tr>
                <th className="border p-2 bg-gray-50">B</th>
                <td className={getCellClass('B', 'S', corporateEval, facilityEval)}>A</td>
                <td className={getCellClass('B', 'A', corporateEval, facilityEval)}>A</td>
                <td className={getCellClass('B', 'B', corporateEval, facilityEval)}>B</td>
                <td className={getCellClass('B', 'C', corporateEval, facilityEval)}>C</td>
                <td className={getCellClass('B', 'D', corporateEval, facilityEval)}>D</td>
              </tr>
              <tr>
                <th className="border p-2 bg-gray-50">C</th>
                <td className={getCellClass('C', 'S', corporateEval, facilityEval)}>B</td>
                <td className={getCellClass('C', 'A', corporateEval, facilityEval)}>B</td>
                <td className={getCellClass('C', 'B', corporateEval, facilityEval)}>C</td>
                <td className={getCellClass('C', 'C', corporateEval, facilityEval)}>C</td>
                <td className={getCellClass('C', 'D', corporateEval, facilityEval)}>D</td>
              </tr>
              <tr>
                <th className="border p-2 bg-gray-50">D</th>
                <td className={getCellClass('D', 'S', corporateEval, facilityEval)}>C</td>
                <td className={getCellClass('D', 'A', corporateEval, facilityEval)}>C</td>
                <td className={getCellClass('D', 'B', corporateEval, facilityEval)}>D</td>
                <td className={getCellClass('D', 'C', corporateEval, facilityEval)}>D</td>
                <td className={getCellClass('D', 'D', corporateEval, facilityEval)}>D</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}

function getCellClass(
  rowGrade: string,
  colGrade: string,
  actualCorporate: string,
  actualFacility: string
): string {
  const baseClass = 'border p-2 text-center'
  if (rowGrade === actualCorporate && colGrade === actualFacility) {
    return `${baseClass} bg-purple-200 font-bold`
  }
  return baseClass
}