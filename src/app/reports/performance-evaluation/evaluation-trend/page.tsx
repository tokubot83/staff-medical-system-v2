'use client'

import React, { useState, useMemo } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { CategoryTopButton } from '@/components/CategoryTopButton'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'
import { staffDatabase } from '@/app/data/staffData'

export default function EvaluationTrendPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [viewMode, setViewMode] = useState<'individual' | 'department' | 'overview'>('individual')

  // 繧ｹ繧ｿ繝・ヵ繝ｪ繧ｹ繝医ｒ驟榊・縺ｫ螟画鋤
  const staffList = Object.values(staffDatabase)

  // 驛ｨ鄂ｲ繝ｪ繧ｹ繝医ｒ逕滓・
  const departments = Array.from(new Set(staffList.map(s => s.department).filter(Boolean)))

  // 繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  // 隧穂ｾ｡謗ｨ遘ｻ繝・・繧ｿ繧堤函謌撰ｼ亥ｮ滄圀縺ｮ螳溯｣・〒縺ｯ螻･豁ｴ繝・・繧ｿ縺九ｉ蜿門ｾ暦ｼ・
  const generateTrendData = (staffId: string) => {
    const quarters = ['2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2']
    return quarters.map(quarter => {
      // 繝ｩ繝ｳ繝繝縺縺悟燕縺ｮ蛟､縺九ｉ螟ｧ縺阪￥螟峨ｏ繧峨↑縺・ｈ縺・↓
      const baseRank = 40 + Math.random() * 30
      const facilityRank = Math.max(1, Math.min(100, baseRank + (Math.random() - 0.5) * 10))
      const corporateRank = Math.max(1, Math.min(100, baseRank + (Math.random() - 0.5) * 15))
      
      return {
        quarter,
        facilityRank: Math.round(facilityRank),
        corporateRank: Math.round(corporateRank),
        facilityGrade: getGrade(facilityRank),
        corporateGrade: getGrade(corporateRank)
      }
    })
  }

  const getGrade = (rank: number) => {
    if (rank <= 10) return 'S'
    if (rank <= 30) return 'A'
    if (rank <= 70) return 'B'
    if (rank <= 90) return 'C'
    return 'D'
  }

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

  // 驕ｸ謚槭＆繧後◆閨ｷ蜩｡縺ｮ謗ｨ遘ｻ繝・・繧ｿ
  const selectedStaffTrend = useMemo(() => {
    if (!selectedEmployeeId) return null
    return generateTrendData(selectedEmployeeId)
  }, [selectedEmployeeId])

  // 繝医Ξ繝ｳ繝牙・譫・
  const analyzeTrend = (data: any[]) => {
    if (!data || data.length < 2) return null
    
    const lastTwo = data.slice(-2)
    const facilityChange = lastTwo[0].facilityRank - lastTwo[1].facilityRank
    const corporateChange = lastTwo[0].corporateRank - lastTwo[1].corporateRank
    
    return {
      facilityTrend: facilityChange > 3 ? 'up' : facilityChange < -3 ? 'down' : 'stable',
      corporateTrend: corporateChange > 3 ? 'up' : corporateChange < -3 ? 'down' : 'stable',
      facilityChange,
      corporateChange
    }
  }

  // 驛ｨ髢蜈ｨ菴薙・謗ｨ遘ｻ繝・・繧ｿ
  const departmentTrendData = useMemo(() => {
    if (viewMode !== 'department' || selectedDepartment === 'all') return []
    
    const quarters = ['2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2']
    const deptStaff = staffList.filter(s => s.department === selectedDepartment)
    
    return quarters.map(quarter => {
      let totalS = 0, totalA = 0, totalB = 0, totalC = 0, totalD = 0
      
      deptStaff.forEach(() => {
        const rank = Math.random() * 100
        const grade = getGrade(rank)
        switch (grade) {
          case 'S': totalS++; break
          case 'A': totalA++; break
          case 'B': totalB++; break
          case 'C': totalC++; break
          case 'D': totalD++; break
        }
      })
      
      const total = deptStaff.length
      return {
        quarter,
        S: (totalS / total * 100).toFixed(1),
        A: (totalA / total * 100).toFixed(1),
        B: (totalB / total * 100).toFixed(1),
        C: (totalC / total * 100).toFixed(1),
        D: (totalD / total * 100).toFixed(1)
      }
    })
  }, [viewMode, selectedDepartment, staffList])

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="菴咲ｽｮ縺･縺第耳遘ｻ蛻・梵" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">菴咲ｽｮ縺･縺第耳遘ｻ蛻・梵</h1>
            <p className="text-gray-600 mt-2">閨ｷ蜩｡縺ｮ菴咲ｽｮ縺･縺代・譎らｳｻ蛻怜､牙喧繧定ｿｽ霍｡繝ｻ蛻・梵</p>
          </div>

          <div className="space-y-6">
          {/* 繝薙Η繝ｼ繝｢繝ｼ繝蛾∈謚・*/}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">蛻・梵繝｢繝ｼ繝・/h3>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded ${viewMode === 'individual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setViewMode('individual')}
              >
                蛟倶ｺｺ蛻・梵
              </button>
              <button
                className={`px-4 py-2 rounded ${viewMode === 'department' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setViewMode('department')}
              >
                驛ｨ髢蛻・梵
              </button>
              <button
                className={`px-4 py-2 rounded ${viewMode === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setViewMode('overview')}
              >
                蜈ｨ菴捺ｦよｳ・
              </button>
            </div>
          </Card>

          {/* 蛟倶ｺｺ蛻・梵繝｢繝ｼ繝・*/}
          {viewMode === 'individual' && (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">閨ｷ蜩｡讀懃ｴ｢</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="閨ｷ蜩｡蜷阪・閨ｷ蜩｡ID縺ｧ讀懃ｴ｢"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
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

                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setSearchTerm('')}
                  >
                    繧ｯ繝ｪ繧｢
                  </button>
                </div>

                {/* 閨ｷ蜩｡繝ｪ繧ｹ繝・*/}
                <div className="mt-6 max-h-64 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">閨ｷ蜩｡蜷・/th>
                        <th className="px-4 py-2 text-left">驛ｨ鄂ｲ</th>
                        <th className="px-4 py-2 text-left">閨ｷ菴・/th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.slice(0, 10).map((staff) => (
                        <tr
                          key={staff.id}
                          className={`border-b hover:bg-gray-50 cursor-pointer ${
                            selectedEmployeeId === staff.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedEmployeeId(staff.id)}
                        >
                          <td className="px-4 py-2">{staff.name}</td>
                          <td className="px-4 py-2">{staff.department || '-'}</td>
                          <td className="px-4 py-2">{staff.position || '-'}</td>
                          <td className="px-4 py-2">
                            <button
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedEmployeeId(staff.id)
                              }}
                            >
                              驕ｸ謚・
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* 蛟倶ｺｺ縺ｮ謗ｨ遘ｻ繧ｰ繝ｩ繝・*/}
              {selectedEmployeeId && selectedStaffTrend && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">
                      {staffDatabase[selectedEmployeeId]?.name}縺ｮ菴咲ｽｮ縺･縺第耳遘ｻ
                    </h3>
                    {(() => {
                      const trend = analyzeTrend(selectedStaffTrend)
                      return trend && (
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">譁ｽ險ｭ蜀・</span>
                            {trend.facilityTrend === 'up' ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : trend.facilityTrend === 'down' ? (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            ) : (
                              <Minus className="h-5 w-5 text-gray-600" />
                            )}
                            <span className="text-sm font-semibold">
                              {Math.abs(trend.facilityChange)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">豕穂ｺｺ蜀・</span>
                            {trend.corporateTrend === 'up' ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : trend.corporateTrend === 'down' ? (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            ) : (
                              <Minus className="h-5 w-5 text-gray-600" />
                            )}
                            <span className="text-sm font-semibold">
                              {Math.abs(trend.corporateChange)}%
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedStaffTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                      <Tooltip 
                        formatter={(value: any) => `荳贋ｽ・{value}%`}
                        labelFormatter={(label) => `隧穂ｾ｡譛滄俣: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="facilityRank" 
                        name="譁ｽ險ｭ蜀・・ｽ・ 
                        stroke="#2196f3" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="corporateRank" 
                        name="豕穂ｺｺ蜀・・ｽ・ 
                        stroke="#4caf50" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* 繧ｰ繝ｬ繝ｼ繝画耳遘ｻ */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">繧ｰ繝ｬ繝ｼ繝画耳遘ｻ</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">譁ｽ險ｭ蜀・ｩ穂ｾ｡</p>
                        <div className="flex gap-2">
                          {selectedStaffTrend.map((data, index) => (
                            <div key={index} className="text-center">
                              <Badge style={{ backgroundColor: getGradeColor(data.facilityGrade), color: 'white' }}>
                                {data.facilityGrade}
                              </Badge>
                              <div className="text-xs mt-1">{data.quarter.split('-')[1]}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">豕穂ｺｺ蜀・ｩ穂ｾ｡</p>
                        <div className="flex gap-2">
                          {selectedStaffTrend.map((data, index) => (
                            <div key={index} className="text-center">
                              <Badge style={{ backgroundColor: getGradeColor(data.corporateGrade), color: 'white' }}>
                                {data.corporateGrade}
                              </Badge>
                              <div className="text-xs mt-1">{data.quarter.split('-')[1]}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}

          {/* 驛ｨ髢蛻・梵繝｢繝ｼ繝・*/}
          {viewMode === 'department' && (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">驛ｨ髢驕ｸ謚・/h3>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">驛ｨ髢繧帝∈謚槭＠縺ｦ縺上□縺輔＞</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </Card>

              {selectedDepartment !== 'all' && departmentTrendData.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">{selectedDepartment} - 菴咲ｽｮ縺･縺大・蟶・耳遘ｻ</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={departmentTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="S" name="S隧穂ｾ｡" stroke="#ff5722" strokeWidth={2} />
                      <Line type="monotone" dataKey="A" name="A隧穂ｾ｡" stroke="#ffc107" strokeWidth={2} />
                      <Line type="monotone" dataKey="B" name="B隧穂ｾ｡" stroke="#4caf50" strokeWidth={2} />
                      <Line type="monotone" dataKey="C" name="C隧穂ｾ｡" stroke="#2196f3" strokeWidth={2} />
                      <Line type="monotone" dataKey="D" name="D隧穂ｾ｡" stroke="#9e9e9e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </>
          )}

          {/* 蜈ｨ菴捺ｦよｳ√Δ繝ｼ繝・*/}
          {viewMode === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">菴咲ｽｮ縺･縺大髄荳願・/h3>
                <div className="space-y-3">
                  {filteredStaff.slice(0, 5).map(staff => (
                    <div key={staff.id} className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <p className="font-semibold">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.department}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          +{Math.floor(Math.random() * 20 + 5)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">隕∵ｳｨ諢擾ｼ井ｽ咲ｽｮ縺･縺台ｽ惹ｸ具ｼ・/h3>
                <div className="space-y-3">
                  {filteredStaff.slice(5, 10).map(staff => (
                    <div key={staff.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                      <div>
                        <p className="font-semibold">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.department}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">
                          -{Math.floor(Math.random() * 15 + 5)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="莠ｺ莠玖ｩ穂ｾ｡蛻・梵" /></div>
  )
}