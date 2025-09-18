'use client'

import React, { useState, useMemo } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { CategoryTopButton } from '@/components/CategoryTopButton'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Users, Shuffle, Target, AlertTriangle } from 'lucide-react'
import { staffDatabase } from '@/app/data/staffData'

export default function OrganizationOptimizationPage() {
  const [selectedScenario, setSelectedScenario] = useState<'balance' | 'growth' | 'stability'>('balance')
  const [showDetails, setShowDetails] = useState(false)

  // スタチE��リストを配�Eに変換
  const staffList = Object.values(staffDatabase)

  // 吁E�E員に位置づけデータを追加
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

  // 配置転換候補�E特宁E
  const identifyReallocationCandidates = useMemo(() => {
    const candidates = {
      highPotential: [] as any[], // 法人冁E��評価だが施設冁E��評価
      underutilized: [] as any[], // 施設冁E��評価だが法人冁E��評価
      needSupport: [] as any[], // 両方低評価
      overqualified: [] as any[] // 両方高評価だが�E位が低い
    }

    staffWithPositioning.forEach(staff => {
      // 高�EチE��シャル�E�他施設で活躍�E可能性�E�E
      if ((staff.corporateGrade === 'S' || staff.corporateGrade === 'A') && 
          (staff.facilityGrade === 'C' || staff.facilityGrade === 'D')) {
        candidates.highPotential.push({
          ...staff,
          reason: '法人冁E��は高評価だが、現施設では低評価',
          recommendation: '他施設への異動を検訁E
        })
      }
      
      // 活用不足�E�現施設でより重要な役割を！E
      if ((staff.facilityGrade === 'S' || staff.facilityGrade === 'A') && 
          (staff.corporateGrade === 'C' || staff.corporateGrade === 'D')) {
        candidates.underutilized.push({
          ...staff,
          reason: '施設冁E��は高評価だが、法人全体では低評価',
          recommendation: '現施設でのより重要な役割付与を検訁E
        })
      }
      
      // 要支援�E�育成や配置転換が忁E��E��E
      if (staff.facilityGrade === 'D' && staff.corporateGrade === 'D') {
        candidates.needSupport.push({
          ...staff,
          reason: '施設冁E�E法人冁E��もに低評価',
          recommendation: '育成�Eログラムまた�E適性に合った部署への配置転揁E
        })
      }
      
      // 過小評価�E��E進候補！E
      if (staff.facilityGrade === 'S' && staff.corporateGrade === 'S' && 
          (!staff.position || staff.position.includes('一般'))) {
        candidates.overqualified.push({
          ...staff,
          reason: '両軸で高評価だが�E位が低い',
          recommendation: 'リーダー職への昁E��を検訁E
        })
      }
    })

    return candidates
  }, [staffWithPositioning])

  // シナリオ別の最適化提桁E
  const optimizationProposal = useMemo(() => {
    const departments = Array.from(new Set(staffList.map(s => s.department).filter(Boolean)))
    
    switch (selectedScenario) {
      case 'balance':
        // バランス重視：各部門の位置づけ�E币E��坁E��化
        return departments.map(dept => {
          const deptStaff = staffWithPositioning.filter(s => s.department === dept)
          const avgScore = deptStaff.reduce((sum, s) => sum + s.positioningScore, 0) / deptStaff.length
          
          return {
            department: dept,
            currentAvgScore: avgScore.toFixed(1),
            targetAvgScore: '50.0',
            requiredActions: avgScore < 45 ? '上位人材�E配置' : avgScore > 55 ? '育成対象老E�E配置' : '現状維持E,
            priority: Math.abs(avgScore - 50) > 10 ? 'high' : 'low'
          }
        })
        
      case 'growth':
        // 成長重視：高�EチE��シャル人材�E戦略皁E�E置
        return departments.map(dept => {
          const needGrowth = dept.includes('新要E) || dept.includes('開発')
          return {
            department: dept,
            currentState: '現状刁E��中',
            targetState: needGrowth ? '高�EチE��シャル人材を重点配置' : '安定運営',
            requiredActions: needGrowth ? 'S/A評価人材を優先�E置' : '現状維持E,
            priority: needGrowth ? 'high' : 'medium'
          }
        })
        
      case 'stability':
        // 安定重視：リスク最小化の配置
        return departments.map(dept => {
          const criticalDept = dept.includes('医癁E) || dept.includes('看護')
          return {
            department: dept,
            riskLevel: criticalDept ? 'high' : 'medium',
            targetState: '安定した人材�E置',
            requiredActions: criticalDept ? 'ベテラン層を中忁E��配置' : 'バランスよく配置',
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
      <CommonHeader title="絁E��最適化提桁E />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">絁E��最適化提桁E/h1>
            <p className="text-gray-600 mt-2">位置づけに基づく適材適所の人材�E置最適匁E/p>
          </div>

          <div className="space-y-6">
          {/* シナリオ選抁E*/}
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
                <h4 className="font-semibold">バランス重要E/h4>
                <p className="text-sm text-gray-600 mt-1">
                  吁E��門の位置づけ�E币E��坁E��化
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
                <h4 className="font-semibold">成長重要E/h4>
                <p className="text-sm text-gray-600 mt-1">
                  高�EチE��シャル人材�E戦略配置
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
                <h4 className="font-semibold">安定重要E/h4>
                <p className="text-sm text-gray-600 mt-1">
                  リスク最小化の人材�E置
                </p>
              </button>
            </div>
          </Card>

          {/* 配置転換候裁E*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                高�EチE��シャル人杁E
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.highPotential.length}</p>
              <p className="text-sm text-gray-600 mt-1">他施設で活躍�E可能性</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                活用不足人杁E
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.underutilized.length}</p>
              <p className="text-sm text-gray-600 mt-1">より重要な役割付与を</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                昁E��候補老E
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.overqualified.length}</p>
              <p className="text-sm text-gray-600 mt-1">リーダー職への推薦</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
                要支援老E
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.needSupport.length}</p>
              <p className="text-sm text-gray-600 mt-1">育成�E配置転換が忁E��E/p>
            </Card>
          </div>

          {/* 部門別最適化提桁E*/}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">部門別最適化提桁E/h3>
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
                      <Badge className="bg-red-600 text-white">優先対忁E/Badge>
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

          {/* 具体的な配置転換提桁E*/}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">配置転換提案（上佁E件�E�E/h3>
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
                        <p className="text-xs text-gray-600">提桁E/p>
                        <p className="text-sm font-semibold text-blue-600">
                          {candidate.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* 実施時�E注意事頁E*/}
          <Card className="p-6 bg-yellow-50 border-yellow-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">実施時�E注意事頁E/h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>配置転換�E本人の意向を十刁E��確認した上で実施してください</li>
                  <li>急激な変更は絁E���E安定性を損なぁE��能性がありまぁE/li>
                  <li>育成計画と併せて段階的に実施することを推奨しまぁE/li>
                  <li>定期皁E��効果測定を行い、忁E��に応じて調整してください</li>
                </ul>
              </div>
            </div>
          </Card>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="人事評価刁E��" /></div>
  )
}