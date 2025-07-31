'use client'

import React, { useEffect, useState } from 'react'
import { TwoAxisEvaluationCard } from './TwoAxisEvaluationCard'
import { TwoAxisVisualization } from './TwoAxisVisualization'
import { EvaluationHistoryChart } from './EvaluationHistoryChart'
import { Alert } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import {
  EmployeeEvaluationProfile,
  EvaluationAnalysis,
} from '@/types/two-axis-evaluation'
import {
  getMockEmployeeProfile,
  getMockEvaluationAnalysis,
} from '@/data/twoAxisEvaluationDemoData'

interface TwoAxisEvaluationSectionProps {
  employeeId: string
  employeeName: string
}

export const TwoAxisEvaluationSection: React.FC<TwoAxisEvaluationSectionProps> = ({
  employeeId,
  employeeName,
}) => {
  const [profile, setProfile] = useState<EmployeeEvaluationProfile | null>(null)
  const [analysis, setAnalysis] = useState<EvaluationAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // プロファイルデータを取得
        const profileRes = await fetch(`/api/employees/${employeeId}/profile`)
        if (!profileRes.ok) {
          // APIが失敗した場合はモックデータを使用
          console.warn('API failed, using mock data for profile')
          const mockProfile = getMockEmployeeProfile(employeeId)
          if (mockProfile) {
            setProfile(mockProfile)
          } else {
            throw new Error('プロファイルの取得に失敗しました')
          }
        } else {
          const profileData = await profileRes.json()
          setProfile(profileData)
        }

        // 分析データを取得
        const analysisRes = await fetch(`/api/employees/${employeeId}/evaluation-analysis`)
        if (!analysisRes.ok) {
          // APIが失敗した場合はモックデータを使用
          console.warn('API failed, using mock data for analysis')
          const mockAnalysis = getMockEvaluationAnalysis(employeeId)
          if (mockAnalysis) {
            setAnalysis(mockAnalysis)
          } else {
            throw new Error('評価分析の取得に失敗しました')
          }
        } else {
          const analysisData = await analysisRes.json()
          setAnalysis(analysisData)
        }
      } catch (err) {
        console.error('Error fetching evaluation data:', err)
        // エラー時もモックデータを試す
        const mockProfile = getMockEmployeeProfile(employeeId)
        const mockAnalysis = getMockEvaluationAnalysis(employeeId)
        
        if (mockProfile && mockAnalysis) {
          setProfile(mockProfile)
          setAnalysis(mockAnalysis)
          setError(null)
        } else {
          setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
        }
      } finally {
        setLoading(false)
      }
    }

    if (employeeId) {
      fetchData()
    }
  }, [employeeId])

  // デモデータ（APIが実装されるまでの仮データ）
  const demoData = {
    evaluation: {
      period: '2024-H2',
      score: 85.5,
      facilityEval: 'S' as const,
      facilityRank: 1,
      facilityTotal: 15,
      corporateEval: 'B' as const,
      corporateRank: 100,
      corporateTotal: 280,
      finalEval: 'A' as const,
      description: '良好：小規模施設のリーダー',
      recommendation: '法人レベルでの活躍機会を検討',
    },
    history: [
      {
        period: '2024-H2',
        score: 85.5,
        facilityEval: 'S' as const,
        corporateEval: 'B' as const,
        finalEval: 'A' as const,
      },
      {
        period: '2024-H1',
        score: 82.0,
        facilityEval: 'A' as const,
        corporateEval: 'B' as const,
        finalEval: 'A' as const,
      },
      {
        period: '2023-H2',
        score: 78.5,
        facilityEval: 'A' as const,
        corporateEval: 'C' as const,
        finalEval: 'B' as const,
      },
      {
        period: '2023-H1',
        score: 75.0,
        facilityEval: 'B' as const,
        corporateEval: 'C' as const,
        finalEval: 'C' as const,
      },
    ],
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">評価データを読み込んでいます...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="m-4">
        <div className="text-red-600">
          エラー: {error}
        </div>
      </Alert>
    )
  }

  // APIデータが取得できない場合はデモデータを使用
  const evaluationData = profile?.currentEvaluation || demoData.evaluation
  const historyData = analysis?.evaluationHistory || demoData.history

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">🎯 2軸評価システム</h3>
        <p className="text-sm text-gray-700">
          施設内での相対評価と法人全体での相対評価を組み合わせて、
          より公平で客観的な総合評価を実現します。
        </p>
      </div>

      {/* 現在の評価 */}
      <TwoAxisEvaluationCard
        evaluation={{
          period: evaluationData.period || demoData.evaluation.period,
          score: evaluationData.score || demoData.evaluation.score,
          facilityEval: ('facilityEvaluation' in evaluationData ? evaluationData.facilityEvaluation?.grade : evaluationData.facilityEval) || demoData.evaluation.facilityEval,
          facilityRank: ('facilityEvaluation' in evaluationData ? evaluationData.facilityEvaluation?.rank : evaluationData.facilityRank) || demoData.evaluation.facilityRank,
          facilityTotal: ('facilityEvaluation' in evaluationData ? evaluationData.facilityEvaluation?.total : evaluationData.facilityTotal) || demoData.evaluation.facilityTotal,
          corporateEval: ('corporateEvaluation' in evaluationData ? evaluationData.corporateEvaluation?.grade : evaluationData.corporateEval) || demoData.evaluation.corporateEval,
          corporateRank: ('corporateEvaluation' in evaluationData ? evaluationData.corporateEvaluation?.rank : evaluationData.corporateRank) || demoData.evaluation.corporateRank,
          corporateTotal: ('corporateEvaluation' in evaluationData ? evaluationData.corporateEvaluation?.total : evaluationData.corporateTotal) || demoData.evaluation.corporateTotal,
          finalEval: ('finalEvaluation' in evaluationData ? evaluationData.finalEvaluation?.grade : evaluationData.finalEval) || demoData.evaluation.finalEval,
          description: ('finalEvaluation' in evaluationData ? evaluationData.finalEvaluation?.description : evaluationData.description) || demoData.evaluation.description,
          recommendation: ('finalEvaluation' in evaluationData ? evaluationData.finalEvaluation?.recommendation : evaluationData.recommendation) || demoData.evaluation.recommendation,
        }}
      />

      {/* 2軸評価の可視化 */}
      <TwoAxisVisualization
        facilityEval={('facilityEvaluation' in evaluationData ? evaluationData.facilityEvaluation?.grade : evaluationData.facilityEval) || demoData.evaluation.facilityEval}
        facilityRank={('facilityEvaluation' in evaluationData ? evaluationData.facilityEvaluation?.rank : evaluationData.facilityRank) || demoData.evaluation.facilityRank}
        facilityTotal={('facilityEvaluation' in evaluationData ? evaluationData.facilityEvaluation?.total : evaluationData.facilityTotal) || demoData.evaluation.facilityTotal}
        corporateEval={('corporateEvaluation' in evaluationData ? evaluationData.corporateEvaluation?.grade : evaluationData.corporateEval) || demoData.evaluation.corporateEval}
        corporateRank={('corporateEvaluation' in evaluationData ? evaluationData.corporateEvaluation?.rank : evaluationData.corporateRank) || demoData.evaluation.corporateRank}
        corporateTotal={('corporateEvaluation' in evaluationData ? evaluationData.corporateEvaluation?.total : evaluationData.corporateTotal) || demoData.evaluation.corporateTotal}
        finalEval={('finalEvaluation' in evaluationData ? evaluationData.finalEvaluation?.grade : evaluationData.finalEval) || demoData.evaluation.finalEval}
      />

      {/* 評価推移 */}
      {historyData.length > 0 && (
        <EvaluationHistoryChart history={historyData} />
      )}

      {/* 成長分析 */}
      {analysis?.growthAnalysis && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">成長分析</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">スコア傾向</label>
              <p className="font-medium">{analysis.growthAnalysis.scoreTrend}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">強み</label>
              <p className="font-medium">{analysis.growthAnalysis.strengthArea}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">改善領域</label>
              <p className="font-medium">{analysis.growthAnalysis.improvementArea}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">キャリアパス</label>
              <p className="font-medium">{analysis.growthAnalysis.careerPath}</p>
            </div>
          </div>
        </div>
      )}

      {/* 異動・配置分析 */}
      {analysis?.transferAnalysis && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">異動・配置分析</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">現在の適性</label>
              <p className="font-medium">{analysis.transferAnalysis.currentFit}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">推奨アクション</label>
              <p className="font-medium text-blue-600">
                {analysis.transferAnalysis.recommendedAction}
              </p>
            </div>
            {analysis.transferAnalysis.alternativePaths.length > 0 && (
              <div>
                <label className="text-sm text-gray-600">代替キャリアパス</label>
                <ul className="list-disc list-inside mt-1">
                  {analysis.transferAnalysis.alternativePaths.map((path, index) => (
                    <li key={index} className="text-sm">{path}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}