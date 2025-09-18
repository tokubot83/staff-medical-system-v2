'use client'

import React, { useState, useMemo } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { CategoryTopButton } from '@/components/CategoryTopButton'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, AlertCircle } from 'lucide-react'
import { staffDatabase } from '@/app/data/staffData'

export default function TeamAnalysisPage() {
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  // 繧ｹ繧ｿ繝・ヵ繝ｪ繧ｹ繝医ｒ驟榊・縺ｫ螟画鋤
  const staffList = Object.values(staffDatabase)

  // 譁ｽ險ｭ繝ｻ驛ｨ鄂ｲ繝ｪ繧ｹ繝医ｒ逕滓・
  const facilities = Array.from(new Set(staffList.map(s => s.facility).filter(Boolean)))
  const departments = Array.from(new Set(staffList.map(s => s.department).filter(Boolean)))

  // 繝√・繝・磯Κ鄂ｲ・峨＃縺ｨ縺ｫ繧ｰ繝ｫ繝ｼ繝怜喧
  const teamData = useMemo(() => {
    const teams: Record<string, any[]> = {}
    
    staffList.forEach(staff => {
      if (!staff.department) return
      if (selectedFacility !== 'all' && staff.facility !== selectedFacility) return
      if (selectedDepartment !== 'all' && staff.department !== selectedDepartment) return
      
      if (!teams[staff.department]) {
        teams[staff.department] = []
      }
      
      // 繝ｩ繝ｳ繝繝縺ｪ菴咲ｽｮ縺･縺代ｒ逕滓・・亥ｮ滄圀縺ｯ繝・・繧ｿ繝吶・繧ｹ縺九ｉ蜿門ｾ暦ｼ・
      const facilityRank = Math.floor(Math.random() * 100) + 1
      const corporateRank = Math.floor(Math.random() * 100) + 1
      
      const getGrade = (rank: number) => {
        if (rank <= 10) return 'S'
        if (rank <= 30) return 'A'
        if (rank <= 70) return 'B'
        if (rank <= 90) return 'C'
        return 'D'
      }
      
      teams[staff.department].push({
        ...staff,
        facilityRank,
        corporateRank,
        facilityGrade: getGrade(facilityRank),
        corporateGrade: getGrade(corporateRank),
      })
    })
    
    return teams
  }, [staffList, selectedFacility, selectedDepartment])

  // 繝√・繝蛻・梵繝・・繧ｿ繧定ｨ育ｮ・
  const teamAnalysis = useMemo(() => {
    return Object.entries(teamData).map(([teamName, members]) => {
      // 繧ｰ繝ｬ繝ｼ繝牙・蟶・ｒ險育ｮ・
      const gradeDistribution = {
        facility: { S: 0, A: 0, B: 0, C: 0, D: 0 },
        corporate: { S: 0, A: 0, B: 0, C: 0, D: 0 }
      }
      
      members.forEach(member => {
        gradeDistribution.facility[member.facilityGrade as keyof typeof gradeDistribution.facility]++
        gradeDistribution.corporate[member.corporateGrade as keyof typeof gradeDistribution.corporate]++
      })
      
      // 繝√・繝蜀・〒縺ｮ菴咲ｽｮ縺･縺鷹・ｽ阪ｒ險育ｮ・
      const sortedByFacility = [...members].sort((a, b) => a.facilityRank - b.facilityRank)
      const sortedByCorporate = [...members].sort((a, b) => a.corporateRank - b.corporateRank)
      
      sortedByFacility.forEach((member, index) => {
        member.teamFacilityRank = index + 1
      })
      
      sortedByCorporate.forEach((member, index) => {
        member.teamCorporateRank = index + 1
      })
      
      // 繝√・繝迚ｹ諤ｧ繧貞愛螳・
      const topPerformers = members.filter(m => m.facilityGrade === 'S' || m.corporateGrade === 'S').length
      const needSupport = members.filter(m => m.facilityGrade === 'D' || m.corporateGrade === 'D').length
      
      return {
        teamName,
        memberCount: members.length,
        members,
        gradeDistribution,
        topPerformers,
        needSupport,
        topPerformerRatio: (topPerformers / members.length * 100).toFixed(1),
        needSupportRatio: (needSupport / members.length * 100).toFixed(1),
        averageFacilityRank: (members.reduce((sum, m) => sum + m.facilityRank, 0) / members.length).toFixed(1),
        averageCorporateRank: (members.reduce((sum, m) => sum + m.corporateRank, 0) / members.length).toFixed(1),
      }
    })
  }, [teamData])

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
      <CommonHeader title="繝√・繝菴咲ｽｮ縺･縺大・譫・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">繝√・繝菴咲ｽｮ縺･縺大・譫・/h1>
            <p className="text-gray-600 mt-2">繝√・繝蜀・〒縺ｮ蜷・Γ繝ｳ繝舌・縺ｮ逶ｸ蟇ｾ逧・↑菴咲ｽｮ縺･縺代ｒ蛻・梵</p>
          </div>

          <div className="space-y-6">
          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">繝輔ぅ繝ｫ繧ｿ繝ｼ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
              >
                <option value="all">蜈ｨ譁ｽ險ｭ</option>
                {facilities.map(facility => (
                  <option key={facility} value={facility}>{facility}</option>
                ))}
              </select>

              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">蜈ｨ驛ｨ鄂ｲ</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* 繝√・繝讎りｦ・*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamAnalysis.map(team => (
              <Card key={team.teamName} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{team.teamName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <Users className="inline h-4 w-4 mr-1" />
                      {team.memberCount}蜷・
                    </p>
                  </div>
                </div>

                {/* 繧ｰ繝ｬ繝ｼ繝牙・蟶・*/}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-2">譁ｽ險ｭ蜀・ｩ穂ｾ｡蛻・ｸ・/p>
                    <div className="flex gap-1">
                      {(['S', 'A', 'B', 'C', 'D'] as const).map(grade => (
                        <div
                          key={grade}
                          className="flex-1 text-center"
                          title={`${grade}: ${team.gradeDistribution.facility[grade]}蜷港}
                        >
                          <div
                            className="h-8 flex items-end justify-center"
                            style={{
                              backgroundColor: getGradeColor(grade),
                              height: `${Math.max(8, team.gradeDistribution.facility[grade] / team.memberCount * 100)}px`
                            }}
                          >
                            <span className="text-xs text-white font-semibold">
                              {team.gradeDistribution.facility[grade] > 0 && team.gradeDistribution.facility[grade]}
                            </span>
                          </div>
                          <div className="text-xs mt-1">{grade}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">豕穂ｺｺ蜀・ｩ穂ｾ｡蛻・ｸ・/p>
                    <div className="flex gap-1">
                      {(['S', 'A', 'B', 'C', 'D'] as const).map(grade => (
                        <div
                          key={grade}
                          className="flex-1 text-center"
                          title={`${grade}: ${team.gradeDistribution.corporate[grade]}蜷港}
                        >
                          <div
                            className="h-8 flex items-end justify-center"
                            style={{
                              backgroundColor: getGradeColor(grade),
                              height: `${Math.max(8, team.gradeDistribution.corporate[grade] / team.memberCount * 100)}px`
                            }}
                          >
                            <span className="text-xs text-white font-semibold">
                              {team.gradeDistribution.corporate[grade] > 0 && team.gradeDistribution.corporate[grade]}
                            </span>
                          </div>
                          <div className="text-xs mt-1">{grade}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 繝√・繝迚ｹ諤ｧ */}
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      繝医ャ繝怜ｱ､
                    </span>
                    <span className="font-semibold">{team.topPerformers}蜷・({team.topPerformerRatio}%)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      隕∵髪謠ｴ螻､
                    </span>
                    <span className="font-semibold">{team.needSupport}蜷・({team.needSupportRatio}%)</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 隧ｳ邏ｰ蛻・梵 */}
          {teamAnalysis.map(team => (
            <Card key={team.teamName} className="p-6">
              <h3 className="text-lg font-bold mb-4">{team.teamName} - 繝｡繝ｳ繝舌・隧ｳ邏ｰ</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">閨ｷ蜩｡蜷・/th>
                      <th className="px-4 py-2 text-left">閨ｷ菴・/th>
                      <th className="px-4 py-2 text-center">譁ｽ險ｭ蜀・ｩ穂ｾ｡</th>
                      <th className="px-4 py-2 text-center">繝√・繝蜀・・ｽ・/th>
                      <th className="px-4 py-2 text-center">豕穂ｺｺ蜀・ｩ穂ｾ｡</th>
                      <th className="px-4 py-2 text-center">繝√・繝蜀・・ｽ・/th>
                      <th className="px-4 py-2 text-center">迚ｹ諤ｧ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.members
                      .sort((a, b) => a.teamFacilityRank - b.teamFacilityRank)
                      .map((member) => (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{member.name}</td>
                          <td className="px-4 py-2">{member.position || '-'}</td>
                          <td className="px-4 py-2 text-center">
                            <Badge style={{ backgroundColor: getGradeColor(member.facilityGrade), color: 'white' }}>
                              {member.facilityGrade}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {member.teamFacilityRank}/{team.memberCount}菴・
                          </td>
                          <td className="px-4 py-2 text-center">
                            <Badge style={{ backgroundColor: getGradeColor(member.corporateGrade), color: 'white' }}>
                              {member.corporateGrade}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {member.teamCorporateRank}/{team.memberCount}菴・
                          </td>
                          <td className="px-4 py-2 text-center">
                            {member.facilityGrade === 'S' || member.corporateGrade === 'S' ? (
                              <Badge className="bg-green-600 text-white">繧ｨ繝ｼ繧ｹ</Badge>
                            ) : member.facilityGrade === 'D' || member.corporateGrade === 'D' ? (
                              <Badge className="bg-orange-600 text-white">隕∵髪謠ｴ</Badge>
                            ) : member.teamFacilityRank <= 3 ? (
                              <Badge className="bg-blue-600 text-white">繝√・繝荳贋ｽ・/Badge>
                            ) : (
                              <Badge className="bg-gray-400 text-white">讓呎ｺ・/Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="莠ｺ莠玖ｩ穂ｾ｡蛻・梵" /></div>
  )
}