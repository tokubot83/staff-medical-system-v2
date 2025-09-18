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

  // 繧ｹ繧ｿ繝・ヵ繝ｪ繧ｹ繝医ｒ驟榊・縺ｫ螟画鋤
  const staffList = Object.values(staffDatabase)

  // 蜷・・蜩｡縺ｫ菴咲ｽｮ縺･縺代ョ繝ｼ繧ｿ繧定ｿｽ蜉
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

  // 驟咲ｽｮ霆｢謠帛呵｣懊・迚ｹ螳・
  const identifyReallocationCandidates = useMemo(() => {
    const candidates = {
      highPotential: [] as any[], // 豕穂ｺｺ蜀・ｫ倩ｩ穂ｾ｡縺縺梧命險ｭ蜀・ｽ手ｩ穂ｾ｡
      underutilized: [] as any[], // 譁ｽ險ｭ蜀・ｫ倩ｩ穂ｾ｡縺縺梧ｳ穂ｺｺ蜀・ｽ手ｩ穂ｾ｡
      needSupport: [] as any[], // 荳｡譁ｹ菴手ｩ穂ｾ｡
      overqualified: [] as any[] // 荳｡譁ｹ鬮倩ｩ穂ｾ｡縺縺瑚・菴阪′菴弱＞
    }

    staffWithPositioning.forEach(staff => {
      // 鬮倥・繝・Φ繧ｷ繝｣繝ｫ・井ｻ匁命險ｭ縺ｧ豢ｻ霄阪・蜿ｯ閭ｽ諤ｧ・・
      if ((staff.corporateGrade === 'S' || staff.corporateGrade === 'A') && 
          (staff.facilityGrade === 'C' || staff.facilityGrade === 'D')) {
        candidates.highPotential.push({
          ...staff,
          reason: '豕穂ｺｺ蜀・〒縺ｯ鬮倩ｩ穂ｾ｡縺縺後∫樟譁ｽ險ｭ縺ｧ縺ｯ菴手ｩ穂ｾ｡',
          recommendation: '莉匁命險ｭ縺ｸ縺ｮ逡ｰ蜍輔ｒ讀懆ｨ・
        })
      }
      
      // 豢ｻ逕ｨ荳崎ｶｳ・育樟譁ｽ險ｭ縺ｧ繧医ｊ驥崎ｦ√↑蠖ｹ蜑ｲ繧抵ｼ・
      if ((staff.facilityGrade === 'S' || staff.facilityGrade === 'A') && 
          (staff.corporateGrade === 'C' || staff.corporateGrade === 'D')) {
        candidates.underutilized.push({
          ...staff,
          reason: '譁ｽ險ｭ蜀・〒縺ｯ鬮倩ｩ穂ｾ｡縺縺後∵ｳ穂ｺｺ蜈ｨ菴薙〒縺ｯ菴手ｩ穂ｾ｡',
          recommendation: '迴ｾ譁ｽ險ｭ縺ｧ縺ｮ繧医ｊ驥崎ｦ√↑蠖ｹ蜑ｲ莉倅ｸ弱ｒ讀懆ｨ・
        })
      }
      
      // 隕∵髪謠ｴ・郁ご謌舌ｄ驟咲ｽｮ霆｢謠帙′蠢・ｦ・ｼ・
      if (staff.facilityGrade === 'D' && staff.corporateGrade === 'D') {
        candidates.needSupport.push({
          ...staff,
          reason: '譁ｽ險ｭ蜀・・豕穂ｺｺ蜀・→繧ゅ↓菴手ｩ穂ｾ｡',
          recommendation: '閧ｲ謌舌・繝ｭ繧ｰ繝ｩ繝縺ｾ縺溘・驕ｩ諤ｧ縺ｫ蜷医▲縺滄Κ鄂ｲ縺ｸ縺ｮ驟咲ｽｮ霆｢謠・
        })
      }
      
      // 驕主ｰ剰ｩ穂ｾ｡・域・騾ｲ蛟呵｣懶ｼ・
      if (staff.facilityGrade === 'S' && staff.corporateGrade === 'S' && 
          (!staff.position || staff.position.includes('荳闊ｬ'))) {
        candidates.overqualified.push({
          ...staff,
          reason: '荳｡霆ｸ縺ｧ鬮倩ｩ穂ｾ｡縺縺瑚・菴阪′菴弱＞',
          recommendation: '繝ｪ繝ｼ繝繝ｼ閨ｷ縺ｸ縺ｮ譏・ｲ繧呈､懆ｨ・
        })
      }
    })

    return candidates
  }, [staffWithPositioning])

  // 繧ｷ繝翫Μ繧ｪ蛻･縺ｮ譛驕ｩ蛹匁署譯・
  const optimizationProposal = useMemo(() => {
    const departments = Array.from(new Set(staffList.map(s => s.department).filter(Boolean)))
    
    switch (selectedScenario) {
      case 'balance':
        // 繝舌Λ繝ｳ繧ｹ驥崎ｦ厄ｼ壼推驛ｨ髢縺ｮ菴咲ｽｮ縺･縺大・蟶・ｒ蝮・ｭ牙喧
        return departments.map(dept => {
          const deptStaff = staffWithPositioning.filter(s => s.department === dept)
          const avgScore = deptStaff.reduce((sum, s) => sum + s.positioningScore, 0) / deptStaff.length
          
          return {
            department: dept,
            currentAvgScore: avgScore.toFixed(1),
            targetAvgScore: '50.0',
            requiredActions: avgScore < 45 ? '荳贋ｽ堺ｺｺ譚舌・驟咲ｽｮ' : avgScore > 55 ? '閧ｲ謌仙ｯｾ雎｡閠・・驟咲ｽｮ' : '迴ｾ迥ｶ邯ｭ謖・,
            priority: Math.abs(avgScore - 50) > 10 ? 'high' : 'low'
          }
        })
        
      case 'growth':
        // 謌宣聞驥崎ｦ厄ｼ夐ｫ倥・繝・Φ繧ｷ繝｣繝ｫ莠ｺ譚舌・謌ｦ逡･逧・・鄂ｮ
        return departments.map(dept => {
          const needGrowth = dept.includes('譁ｰ隕・) || dept.includes('髢狗匱')
          return {
            department: dept,
            currentState: '迴ｾ迥ｶ蛻・梵荳ｭ',
            targetState: needGrowth ? '鬮倥・繝・Φ繧ｷ繝｣繝ｫ莠ｺ譚舌ｒ驥咲せ驟咲ｽｮ' : '螳牙ｮ夐°蝟ｶ',
            requiredActions: needGrowth ? 'S/A隧穂ｾ｡莠ｺ譚舌ｒ蜆ｪ蜈磯・鄂ｮ' : '迴ｾ迥ｶ邯ｭ謖・,
            priority: needGrowth ? 'high' : 'medium'
          }
        })
        
      case 'stability':
        // 螳牙ｮ夐㍾隕厄ｼ壹Μ繧ｹ繧ｯ譛蟆丞喧縺ｮ驟咲ｽｮ
        return departments.map(dept => {
          const criticalDept = dept.includes('蛹ｻ逋・) || dept.includes('逵玖ｭｷ')
          return {
            department: dept,
            riskLevel: criticalDept ? 'high' : 'medium',
            targetState: '螳牙ｮ壹＠縺滉ｺｺ譚宣・鄂ｮ',
            requiredActions: criticalDept ? '繝吶ユ繝ｩ繝ｳ螻､繧剃ｸｭ蠢・↓驟咲ｽｮ' : '繝舌Λ繝ｳ繧ｹ繧医￥驟咲ｽｮ',
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
      <CommonHeader title="邨・ｹ疲怙驕ｩ蛹匁署譯・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">邨・ｹ疲怙驕ｩ蛹匁署譯・/h1>
            <p className="text-gray-600 mt-2">菴咲ｽｮ縺･縺代↓蝓ｺ縺･縺城←譚宣←謇縺ｮ莠ｺ譚宣・鄂ｮ譛驕ｩ蛹・/p>
          </div>

          <div className="space-y-6">
          {/* 繧ｷ繝翫Μ繧ｪ驕ｸ謚・*/}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">譛驕ｩ蛹悶す繝翫Μ繧ｪ</h3>
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
                <h4 className="font-semibold">繝舌Λ繝ｳ繧ｹ驥崎ｦ・/h4>
                <p className="text-sm text-gray-600 mt-1">
                  蜷・Κ髢縺ｮ菴咲ｽｮ縺･縺大・蟶・ｒ蝮・ｭ牙喧
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
                <h4 className="font-semibold">謌宣聞驥崎ｦ・/h4>
                <p className="text-sm text-gray-600 mt-1">
                  鬮倥・繝・Φ繧ｷ繝｣繝ｫ莠ｺ譚舌・謌ｦ逡･驟咲ｽｮ
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
                <h4 className="font-semibold">螳牙ｮ夐㍾隕・/h4>
                <p className="text-sm text-gray-600 mt-1">
                  繝ｪ繧ｹ繧ｯ譛蟆丞喧縺ｮ莠ｺ譚宣・鄂ｮ
                </p>
              </button>
            </div>
          </Card>

          {/* 驟咲ｽｮ霆｢謠帛呵｣・*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                鬮倥・繝・Φ繧ｷ繝｣繝ｫ莠ｺ譚・
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.highPotential.length}</p>
              <p className="text-sm text-gray-600 mt-1">莉匁命險ｭ縺ｧ豢ｻ霄阪・蜿ｯ閭ｽ諤ｧ</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                豢ｻ逕ｨ荳崎ｶｳ莠ｺ譚・
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.underutilized.length}</p>
              <p className="text-sm text-gray-600 mt-1">繧医ｊ驥崎ｦ√↑蠖ｹ蜑ｲ莉倅ｸ弱ｒ</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                譏・ｲ蛟呵｣懆・
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.overqualified.length}</p>
              <p className="text-sm text-gray-600 mt-1">繝ｪ繝ｼ繝繝ｼ閨ｷ縺ｸ縺ｮ謗ｨ阮ｦ</p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
                隕∵髪謠ｴ閠・
              </h4>
              <p className="text-3xl font-bold">{identifyReallocationCandidates.needSupport.length}</p>
              <p className="text-sm text-gray-600 mt-1">閧ｲ謌舌・驟咲ｽｮ霆｢謠帙′蠢・ｦ・/p>
            </Card>
          </div>

          {/* 驛ｨ髢蛻･譛驕ｩ蛹匁署譯・*/}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">驛ｨ髢蛻･譛驕ｩ蛹匁署譯・/h3>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? '邁｡譏楢｡ｨ遉ｺ' : '隧ｳ邏ｰ陦ｨ遉ｺ'}
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
                      <Badge className="bg-red-600 text-white">蜆ｪ蜈亥ｯｾ蠢・/Badge>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <p className="text-gray-600">
                      謗ｨ螂ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ: <span className="font-semibold">{proposal.requiredActions}</span>
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

          {/* 蜈ｷ菴鍋噪縺ｪ驟咲ｽｮ霆｢謠帶署譯・*/}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">驟咲ｽｮ霆｢謠帶署譯茨ｼ井ｸ贋ｽ・莉ｶ・・/h3>
            <div className="space-y-4">
              {[...identifyReallocationCandidates.highPotential, ...identifyReallocationCandidates.overqualified]
                .slice(0, 5)
                .map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-semibold">{candidate.name}</p>
                      <p className="text-sm text-gray-600">
                        {candidate.department} / {candidate.position || '荳闊ｬ閨ｷ蜩｡'}
                      </p>
                      <p className="text-sm mt-1">{candidate.reason}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">迴ｾ蝨ｨ</p>
                        <div className="flex gap-1">
                          <Badge style={{ backgroundColor: getGradeColor(candidate.facilityGrade), color: 'white' }}>
                            譁ｽ險ｭ{candidate.facilityGrade}
                          </Badge>
                          <Badge style={{ backgroundColor: getGradeColor(candidate.corporateGrade), color: 'white' }}>
                            豕穂ｺｺ{candidate.corporateGrade}
                          </Badge>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-600">謠先｡・/p>
                        <p className="text-sm font-semibold text-blue-600">
                          {candidate.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* 螳滓命譎ゅ・豕ｨ諢丈ｺ矩・*/}
          <Card className="p-6 bg-yellow-50 border-yellow-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">螳滓命譎ゅ・豕ｨ諢丈ｺ矩・/h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>驟咲ｽｮ霆｢謠帙・譛ｬ莠ｺ縺ｮ諢丞髄繧貞香蛻・↓遒ｺ隱阪＠縺滉ｸ翫〒螳滓命縺励※縺上□縺輔＞</li>
                  <li>諤･豼縺ｪ螟画峩縺ｯ邨・ｹ斐・螳牙ｮ壽ｧ繧呈錐縺ｪ縺・庄閭ｽ諤ｧ縺後≠繧翫∪縺・/li>
                  <li>閧ｲ謌占ｨ育判縺ｨ菴ｵ縺帙※谿ｵ髫守噪縺ｫ螳滓命縺吶ｋ縺薙→繧呈耳螂ｨ縺励∪縺・/li>
                  <li>螳壽悄逧・↓蜉ｹ譫懈ｸｬ螳壹ｒ陦後＞縲∝ｿ・ｦ√↓蠢懊§縺ｦ隱ｿ謨ｴ縺励※縺上□縺輔＞</li>
                </ul>
              </div>
            </div>
          </Card>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="莠ｺ莠玖ｩ穂ｾ｡蛻・梵" /></div>
  )
}