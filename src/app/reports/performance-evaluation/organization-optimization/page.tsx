'use client'

import React, { useState, useMemo } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Users, Shuffle, Target, AlertTriangle } from 'lucide-react'
import { staffDatabase } from '@/app/data/staffData'

export default function OrganizationOptimizationPage() {
  const [selectedScenario, setSelectedScenario] = useState<'balance' | 'growth' | 'stability'>('balance')
  const [showDetails, setShowDetails] = useState(false)

  // スタッフリストを配列に変換
  const staffList = Object.values(staffDatabase)

  // 各職員に位置づけデータを追加
  const staffWithPositioning = useMemo(() => {
    return staffList.map(staff => {
      const facilityRank = Math.floor(Math.random() * 100) + 1
      const corporateRank = Math.floor(Math.random() * 100) + 1
      
      const getGrade = (rank: number) => {
        if (rank <= 10) return 'S'
        if (rank <= 30) return 'A'
        if (rank <= 70) return 'B'
        if (rank <= 90) return 'C'
        return 'D'
      }
      
      return {
        ...staff,
        facilityRank,
        corporateRank,
        facilityGrade: getGrade(facilityRank),
        corporateGrade: getGrade(corporateRank),
        positioningScore: (100 - facilityRank) * 0.5 + (100 - corporateRank) * 0.5
      }
    })
  }, [staffList])

  // 配置転換候補の特定
  const identifyReallocationCandidates = useMemo(() => {
    const candidates = {
      highPotential: [] as any[], // 法人内高評価だが施設内低評価
      underutilized: [] as any[], // 施設内高評価だが法人内低評価
      needSupport: [] as any[], // 両方低評価
      overqualified: [] as any[] // 両方高評価だが職位が低い
    }

    staffWithPositioning.forEach(staff => {
      // 高ポテンシャル（他施設で活躍の可能性）
      if ((staff.corporateGrade === 'S' || staff.corporateGrade === 'A') && 
          (staff.facilityGrade === 'C' || staff.facilityGrade === 'D')) {
        candidates.highPotential.push({
          ...staff,
          reason: '法人内では高評価だが、現施設では低評価',
          recommendation: '他施設への異動を検討'
        })
      }
      
      // 活用不足（現施設でより重要な役割を）
      if ((staff.facilityGrade === 'S' || staff.facilityGrade === 'A') && 
          (staff.corporateGrade === 'C' || staff.corporateGrade === 'D')) {
        candidates.underutilized.push({
          ...staff,
          reason: '施設内では高評価だが、法人全体では低評価',
          recommendation: '現施設でのより重要な役割付与を検討'
        })
      }
      
      // 要支援（育成や配置転換が必要）
      if (staff.facilityGrade === 'D' && staff.corporateGrade === 'D') {
        candidates.needSupport.push({
          ...staff,
          reason: '施設内・法人内ともに低評価',
          recommendation: '育成プログラムまたは適性に合った部署への配置転換'
        })
      }
      
      // 過小評価（昇進候補）
      if (staff.facilityGrade === 'S' && staff.corporateGrade === 'S' && 
          (!staff.position || staff.position.includes('一般'))) {
        candidates.overqualified.push({
          ...staff,
          reason: '両軸で高評価だが職位が低い',
          recommendation: 'リーダー職への昇進を検討'
        })
      }
    })

    return candidates
  }, [staffWithPositioning])

  // シナリオ別の最適化提案
  const optimizationProposal = useMemo(() => {
    const departments = Array.from(new Set(staffList.map(s => s.department).filter(Boolean)))
    
    switch (selectedScenario) {
      case 'balance':
        // バランス重視：各部門の位置づけ分布を均等化
        return departments.map(dept => {
          const deptStaff = staffWithPositioning.filter(s => s.department === dept)
          const avgScore = deptStaff.reduce((sum, s) => sum + s.positioningScore, 0) / deptStaff.length
          
          return {
            department: dept,
            currentAvgScore: avgScore.toFixed(1),
            targetAvgScore: '50.0',
            requiredActions: avgScore < 45 ? '上位人材の配置' : avgScore > 55 ? '育成対象者の配置' : '現状維持',
            priority: Math.abs(avgScore - 50) > 10 ? 'high' : 'low'
          }
        })
        
      case 'growth':
        // 成長重視：高ポテンシャル人材の戦略的配置
        return departments.map(dept => {
          const needGrowth = dept.includes('新規') || dept.includes('開発')
          return {
            department: dept,
            currentState: '現状分析中',
            targetState: needGrowth ? '高ポテンシャル人材を重点配置' : '安定運営',
            requiredActions: needGrowth ? 'S/A評価人材を優先配置' : '現状維持',
            priority: needGrowth ? 'high' : 'medium'
          }
        })
        
      case 'stability':
        // 安定重視：リスク最小化の配置
        return departments.map(dept => {
          const criticalDept = dept.includes('医療') || dept.includes('看護')
          return {
            department: dept,
            riskLevel: criticalDept ? 'high' : 'medium',
            targetState: '安定した人材配置',
            requiredActions: criticalDept ? 'ベテラン層を中心に配置' : 'バランスよく配置',
            priority: criticalDept ? 'high' : 'low'
          }
        })
    }
  }, [selectedScenario, staffList, staffWithPositioning])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return '#ff5722'
      case 'A': return '#ffc107'
      case 'B': return '#4caf50'
      case 'C': return '#2196f3'
      case 'D': return '#9e9e9e'
      default: return '#9e9e9e'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="組織最適化提案" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">組織最適化提案</h1>
            <p className="text-gray-600 mt-2">位置づけに基づく適材適所の人材配置最適化</p>
          </div>

          <div className="space-y-6">
          {/* シナリオ選択 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">最適化シナリオ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedScenario === 'balance' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedScenario('balance')}
              >
                <Target className="h-8 w-8 mb-2 mx-auto text-blue-600" />
                <h4 className="font-semibold">バランス重視</h4>
                <p className="text-sm text-gray-600 mt-1">
                  各部門の位置づけ分布を均等化
                </p>
              </button>
              
              <button
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedScenario === 'growth' 
                    ? 'border-green-600 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedScenario('growth')}
              >
                <Shuffle className="h-8 w-8 mb-2 mx-auto text-green-600" />
                <h4 className="font-semibold">成長重視</h4>
                <p className="text-sm text-gray-600 mt-1">
                  高ポテンシャル人材の戦略配置
                </p>
              </button>
              
              <button
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedScenario === 'stability' 
                    ? 'border-orange-600 bg-orange-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedScenario('stability')}
              >
                <Users className="h-8 w-8 mb-2 mx-auto text-orange-600" />
                <h4 className="font-semibold">安定重視</h4>
                <p className="text-sm text-gray-600 mt-1">
                  リスク最小化の人材配置
                </p>
              </button>
            </div>
          </Card>

          {/* 配置転換候補 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                高ポテンシャル人材
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.highPotential.length}</p>
              <p className="text-sm text-gray-600 mt-1">他施設で活躍の可能性</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                活用不足人材
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.underutilized.length}</p>
              <p className="text-sm text-gray-600 mt-1">より重要な役割付与を</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                昇進候補者
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.overqualified.length}</p>
              <p className="text-sm text-gray-600 mt-1">リーダー職への推薦</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
                要支援者
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.needSupport.length}</p>
              <p className="text-sm text-gray-600 mt-1">育成・配置転換が必要</p>
            </Card>
          </div>

          {/* 部門別最適化提案 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">部門別最適化提案</h3>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? '簡易表示' : '詳細表示'}
              </button>
            </div>
            
            <div className="space-y-3">
              {optimizationProposal.map((proposal: any, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    proposal.priority === 'high' ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{proposal.department}</h4>
                    {proposal.priority === 'high' && (
                      <Badge className="bg-red-600 text-white">優先対応</Badge>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <p className="text-gray-600">
                      推奨アクション: <span className="font-semibold">{proposal.requiredActions}</span>
                    </p>
                    {showDetails && (
                      <div className="mt-2 pt-2 border-t">
                        {Object.entries(proposal).map(([key, value]) => {
                          if (key !== 'department' && key !== 'priority' && key !== 'requiredActions') {
                            return (
                              <p key={key} className="text-xs">
                                {key}: {value as string}
                              </p>
                            )
                          }
                          return null
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 具体的な配置転換提案 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">配置転換提案（上位5件）</h3>
            <div className="space-y-4">
              {[...identifyReallocationCandidates.highPotential, ...identifyReallocationCandidates.overqualified]
                .slice(0, 5)
                .map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-semibold">{candidate.name}</p>
                      <p className="text-sm text-gray-600">
                        {candidate.department} / {candidate.position || '一般職員'}
                      </p>
                      <p className="text-sm mt-1">{candidate.reason}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">現在</p>
                        <div className="flex gap-1">
                          <Badge style={{ backgroundColor: getGradeColor(candidate.facilityGrade), color: 'white' }}>
                            施設{candidate.facilityGrade}
                          </Badge>
                          <Badge style={{ backgroundColor: getGradeColor(candidate.corporateGrade), color: 'white' }}>
                            法人{candidate.corporateGrade}
                          </Badge>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-600">提案</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {candidate.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* 実施時の注意事項 */}
          <Card className="p-6 bg-yellow-50 border-yellow-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">実施時の注意事項</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>配置転換は本人の意向を十分に確認した上で実施してください</li>
                  <li>急激な変更は組織の安定性を損なう可能性があります</li>
                  <li>育成計画と併せて段階的に実施することを推奨します</li>
                  <li>定期的に効果測定を行い、必要に応じて調整してください</li>
                </ul>
              </div>
            </div>
          </Card>
          </div>
        </div>
      </div></div>
  )
}