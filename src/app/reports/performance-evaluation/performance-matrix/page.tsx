'use client'

import React, { useState, useMemo } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { CategoryTopButton } from '@/components/CategoryTopButton'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { staffDatabase } from '@/app/data/staffData'

export default function PerformanceMatrixPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedPosition, setSelectedPosition] = useState('all')

  // 繧ｹ繧ｿ繝・ヵ繝ｪ繧ｹ繝医ｒ驟榊・縺ｫ螟画鋤
  const staffList = Object.values(staffDatabase)

  // 繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
  const filteredStaff = staffList.filter(staff => {
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment
    const matchesFacility = selectedFacility === 'all' || staff.facility === selectedFacility
    const matchesPosition = selectedPosition === 'all' || staff.position === selectedPosition
    
    return matchesDepartment && matchesFacility && matchesPosition
  })

  // 驛ｨ鄂ｲ繝ｻ譁ｽ險ｭ繝ｻ閨ｷ菴阪Μ繧ｹ繝医ｒ逕滓・
  const departments = Array.from(new Set(staffList.map(s => s.department).filter(Boolean)))
  const facilities = Array.from(new Set(staffList.map(s => s.facility).filter(Boolean)))
  const positions = Array.from(new Set(staffList.map(s => s.position).filter(Boolean)))

  // 菴咲ｽｮ縺･縺代ョ繝ｼ繧ｿ繧定ｨ育ｮ暦ｼ亥ｮ滄圀縺ｮ螳溯｣・〒縺ｯ隧穂ｾ｡繝・・繧ｿ縺九ｉ險育ｮ暦ｼ・
  const positioningData = useMemo(() => {
    return filteredStaff.map(staff => {
      // 繝ｩ繝ｳ繝繝縺ｪ菴咲ｽｮ縺･縺代ｒ逕滓・・亥ｮ滄圀縺ｯ繝・・繧ｿ繝吶・繧ｹ縺九ｉ蜿門ｾ暦ｼ・
      const facilityRank = Math.floor(Math.random() * 100) + 1
      const corporateRank = Math.floor(Math.random() * 100) + 1
      
      // 繧ｰ繝ｬ繝ｼ繝牙愛螳・
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
      }
    })
  }, [filteredStaff])

  // 繝槭ヨ繝ｪ繧ｯ繧ｹ繝・・繧ｿ繧堤函謌・
  const matrixData = useMemo(() => {
    const matrix: Record<string, Record<string, typeof positioningData>> = {
      S: { S: [], A: [], B: [], C: [], D: [] },
      A: { S: [], A: [], B: [], C: [], D: [] },
      B: { S: [], A: [], B: [], C: [], D: [] },
      C: { S: [], A: [], B: [], C: [], D: [] },
      D: { S: [], A: [], B: [], C: [], D: [] },
    }

    positioningData.forEach(staff => {
      matrix[staff.facilityGrade][staff.corporateGrade].push(staff)
    })

    return matrix
  }, [positioningData])

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

  const getCellColor = (facilityGrade: string, corporateGrade: string) => {
    // 荳｡譁ｹS縺ｪ繧画怙繧り憶縺・
    if (facilityGrade === 'S' && corporateGrade === 'S') return 'bg-red-100'
    // 縺ｩ縺｡繧峨°縺郡縺ｪ繧芽憶縺・
    if (facilityGrade === 'S' || corporateGrade === 'S') return 'bg-orange-50'
    // 荳｡譁ｹA縺毅縺ｪ繧画ｨ呎ｺ・
    if ((facilityGrade === 'A' || facilityGrade === 'B') && (corporateGrade === 'A' || corporateGrade === 'B')) return 'bg-green-50'
    // 縺ｩ縺｡繧峨°縺靴縺ｪ繧芽ｦ∵ｳｨ諢・
    if (facilityGrade === 'C' || corporateGrade === 'C') return 'bg-blue-50'
    // 縺ｩ縺｡繧峨°縺轡縺ｪ繧芽ｦ∵髪謠ｴ
    return 'bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="菴咲ｽｮ縺･縺代・繝医Μ繧ｯ繧ｹ" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">菴咲ｽｮ縺･縺代・繝医Μ繧ｯ繧ｹ</h1>
            <p className="text-gray-600 mt-2">譁ｽ險ｭ蜀・ｩ穂ｾ｡縺ｨ豕穂ｺｺ蜀・ｩ穂ｾ｡縺ｫ繧医ｋ閨ｷ蜩｡縺ｮ菴咲ｽｮ縺･縺代ｒ蜿ｯ隕門喧</p>
          </div>

          <div className="space-y-6">
          {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">繝輔ぅ繝ｫ繧ｿ繝ｼ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                <option value="all">蜈ｨ閨ｷ菴・/option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* 菴咲ｽｮ縺･縺代・繝医Μ繧ｯ繧ｹ */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">菴咲ｽｮ縺･縺代・繝医Μ繧ｯ繧ｹ</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-50" rowSpan={2}>
                      譁ｽ險ｭ蜀・ｩ穂ｾ｡
                    </th>
                    <th className="border p-2 bg-gray-50" colSpan={5}>
                      豕穂ｺｺ蜀・ｩ穂ｾ｡
                    </th>
                  </tr>
                  <tr>
                    {['S', 'A', 'B', 'C', 'D'].map(grade => (
                      <th key={grade} className="border p-2 bg-gray-50">
                        <Badge style={{ backgroundColor: getGradeColor(grade), color: 'white' }}>
                          {grade}
                        </Badge>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['S', 'A', 'B', 'C', 'D'].map(facilityGrade => (
                    <tr key={facilityGrade}>
                      <td className="border p-2 bg-gray-50 text-center">
                        <Badge style={{ backgroundColor: getGradeColor(facilityGrade), color: 'white' }}>
                          {facilityGrade}
                        </Badge>
                      </td>
                      {['S', 'A', 'B', 'C', 'D'].map(corporateGrade => (
                        <td
                          key={corporateGrade}
                          className={`border p-4 text-center ${getCellColor(facilityGrade, corporateGrade)}`}
                        >
                          <div className="min-h-[60px]">
                            <div className="font-bold text-lg">
                              {matrixData[facilityGrade][corporateGrade].length}蜷・
                            </div>
                            {matrixData[facilityGrade][corporateGrade].length > 0 && (
                              <div className="text-xs text-gray-600 mt-1">
                                {((matrixData[facilityGrade][corporateGrade].length / filteredStaff.length) * 100).toFixed(1)}%
                              </div>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 蜃｡萓・*/}
            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h4 className="font-semibold mb-2">菴咲ｽｮ縺･縺代・隗｣驥・/h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded mt-0.5"></div>
                  <div>
                    <span className="font-semibold">Sﾃ祐:</span> 譁ｽ險ｭ繝ｻ豕穂ｺｺ荳｡譁ｹ縺ｧ繝医ャ繝怜ｱ､・域ｬ｡譛溘Μ繝ｼ繝繝ｼ蛟呵｣懶ｼ・
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-orange-50 rounded mt-0.5"></div>
                  <div>
                    <span className="font-semibold">Sﾃ輸-D, A-Dﾃ祐:</span> 縺ｩ縺｡繧峨°縺ｧ繝医ャ繝怜ｱ､・医・繝・Φ繧ｷ繝｣繝ｫ莠ｺ譚撰ｼ・
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-green-50 rounded mt-0.5"></div>
                  <div>
                    <span className="font-semibold">A-Bﾃ輸-B:</span> 螳牙ｮ壹＠縺滉ｸｭ譬ｸ螻､
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded mt-0.5"></div>
                  <div>
                    <span className="font-semibold">Dﾃ優:</span> 驥咲せ謾ｯ謠ｴ蟇ｾ雎｡
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 隧ｳ邏ｰ繝ｪ繧ｹ繝・*/}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">閨ｷ蜩｡隧ｳ邏ｰ</h3>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">閨ｷ蜩｡蜷・/th>
                    <th className="px-4 py-2 text-left">驛ｨ鄂ｲ</th>
                    <th className="px-4 py-2 text-left">閨ｷ菴・/th>
                    <th className="px-4 py-2 text-left">譁ｽ險ｭ</th>
                    <th className="px-4 py-2 text-center">譁ｽ險ｭ蜀・ｩ穂ｾ｡</th>
                    <th className="px-4 py-2 text-center">豕穂ｺｺ蜀・ｩ穂ｾ｡</th>
                    <th className="px-4 py-2 text-center">邱丞粋隧穂ｾ｡</th>
                  </tr>
                </thead>
                <tbody>
                  {positioningData.map((staff) => (
                    <tr key={staff.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{staff.name}</td>
                      <td className="px-4 py-2">{staff.department || '-'}</td>
                      <td className="px-4 py-2">{staff.position || '-'}</td>
                      <td className="px-4 py-2">{staff.facility || '-'}</td>
                      <td className="px-4 py-2 text-center">
                        <Badge style={{ backgroundColor: getGradeColor(staff.facilityGrade), color: 'white' }}>
                          {staff.facilityGrade}
                        </Badge>
                        <div className="text-xs text-gray-600 mt-1">
                          荳贋ｽ砿staff.facilityRank}%
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Badge style={{ backgroundColor: getGradeColor(staff.corporateGrade), color: 'white' }}>
                          {staff.corporateGrade}
                        </Badge>
                        <div className="text-xs text-gray-600 mt-1">
                          荳贋ｽ砿staff.corporateRank}%
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Badge className="bg-purple-600 text-white">
                          {staff.facilityGrade}{staff.corporateGrade === staff.facilityGrade ? '' : `/${staff.corporateGrade}`}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="莠ｺ莠玖ｩ穂ｾ｡蛻・梵" /></div>
  )
}