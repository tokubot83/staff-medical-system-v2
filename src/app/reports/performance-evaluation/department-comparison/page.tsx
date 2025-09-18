'use client'

import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Building2, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { staffDatabase } from '@/app/data/staffData'

export default function DepartmentComparisonPage() {
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [viewMode, setViewMode] = useState<'distribution' | 'average' | 'detail'>('distribution')

  // スタッフリストを配列に変換
  const staffList = Object.values(staffDatabase)

  // 施設リストを生成
  const facilities = Array.from(new Set(staffList.map(s => s.facility).filter(Boolean)))

  // 部門ごとの位置づけデータを計算
  const departmentData = useMemo(() => {
    const deptMap: Record<string, any> = {}
    
    staffList.forEach(staff => {
      if (!staff.department) return
      if (selectedFacility !== 'all' && staff.facility !== selectedFacility) return
      
      if (!deptMap[staff.department]) {
        deptMap[staff.department] = {
          name: staff.department,
          staff: [],
          gradeDistribution: {
            facility: { S: 0, A: 0, B: 0, C: 0, D: 0 },
            corporate: { S: 0, A: 0, B: 0, C: 0, D: 0 }
          }
        }
      }
      
      // ランダムな位置づけを生成（実際はデータベースから取得）
      const facilityRank = Math.floor(Math.random() * 100) + 1
      const corporateRank = Math.floor(Math.random() * 100) + 1
      
      const getGrade = (rank: number) => {
        if (rank <= 10) return 'S'
        if (rank <= 30) return 'A'
        if (rank <= 70) return 'B'
        if (rank <= 90) return 'C'
        return 'D'
      }
      
      const facilityGrade = getGrade(facilityRank)
      const corporateGrade = getGrade(corporateRank)
      
      deptMap[staff.department].staff.push({
        ...staff,
        facilityRank,
        corporateRank,
        facilityGrade,
        corporateGrade,
      })
      
      deptMap[staff.department].gradeDistribution.facility[facilityGrade]++
      deptMap[staff.department].gradeDistribution.corporate[corporateGrade]++
    })
    
    // 各部門の統計を計算
    Object.values(deptMap).forEach((dept: any) => {
      dept.totalStaff = dept.staff.length
      dept.topPerformers = dept.staff.filter((s: any) => s.facilityGrade === 'S' || s.corporateGrade === 'S').length
      dept.needSupport = dept.staff.filter((s: any) => s.facilityGrade === 'D' || s.corporateGrade === 'D').length
      dept.topPerformerRatio = (dept.topPerformers / dept.totalStaff * 100).toFixed(1)
      dept.needSupportRatio = (dept.needSupport / dept.totalStaff * 100).toFixed(1)
      dept.averageFacilityRank = dept.staff.reduce((sum: number, s: any) => sum + s.facilityRank, 0) / dept.totalStaff
      dept.averageCorporateRank = dept.staff.reduce((sum: number, s: any) => sum + s.corporateRank, 0) / dept.totalStaff
      
      // 位置づけバランススコア（S,Aが多くC,Dが少ないほど高い）
      const facilityScore = (dept.gradeDistribution.facility.S * 3 + dept.gradeDistribution.facility.A * 2 + dept.gradeDistribution.facility.B) / dept.totalStaff
      const corporateScore = (dept.gradeDistribution.corporate.S * 3 + dept.gradeDistribution.corporate.A * 2 + dept.gradeDistribution.corporate.B) / dept.totalStaff
      dept.balanceScore = ((facilityScore + corporateScore) / 2).toFixed(2)
    })
    
    return Object.values(deptMap)
  }, [staffList, selectedFacility])

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

  // グラフ用データの準備
  const chartData = departmentData.map(dept => ({
    name: dept.name,
    トップ層: parseFloat(dept.topPerformerRatio),
    標準層: 100 - parseFloat(dept.topPerformerRatio) - parseFloat(dept.needSupportRatio),
    要支援層: parseFloat(dept.needSupportRatio),
    バランススコア: parseFloat(dept.balanceScore)
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">部門別位置づけ分析</h1>
            <p className="text-gray-600 mt-2">部門ごとの職員の位置づけ分布を比較・分析</p>
          </div>

          <div className="space-y-6">
          {/* フィルター */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4">フィルター</h3>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                >
                  <option value="all">全施設</option>
                  {facilities.map(facility => (
                    <option key={facility} value={facility}>{facility}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4">表示モード</h3>
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded ${viewMode === 'distribution' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setViewMode('distribution')}
                  >
                    分布
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${viewMode === 'average' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setViewMode('average')}
                  >
                    平均
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${viewMode === 'detail' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setViewMode('detail')}
                  >
                    詳細
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* サマリーカード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">分析対象部門数</p>
                  <p className="text-2xl font-bold">{departmentData.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">最高バランススコア</p>
                  <p className="text-2xl font-bold">
                    {Math.max(...departmentData.map(d => parseFloat(d.balanceScore))).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {departmentData.find(d => d.balanceScore === Math.max(...departmentData.map(d => parseFloat(d.balanceScore))).toFixed(2))?.name}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">要支援層が多い部門</p>
                  <p className="text-2xl font-bold">
                    {departmentData.filter(d => parseFloat(d.needSupportRatio) > 20).length}
                  </p>
                  <p className="text-xs text-gray-500">20%以上</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </Card>
          </div>

          {/* メインビュー */}
          {viewMode === 'distribution' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">部門別位置づけ分布</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="トップ層" stackId="a" fill="#ff5722" />
                  <Bar dataKey="標準層" stackId="a" fill="#4caf50" />
                  <Bar dataKey="要支援層" stackId="a" fill="#9e9e9e" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {viewMode === 'average' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">平均位置づけ（施設内）</h3>
                <div className="space-y-3">
                  {departmentData
                    .sort((a, b) => a.averageFacilityRank - b.averageFacilityRank)
                    .map((dept, index) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{index + 1}.</span>
                          <span>{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${100 - dept.averageFacilityRank}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">上位{dept.averageFacilityRank.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">平均位置づけ（法人内）</h3>
                <div className="space-y-3">
                  {departmentData
                    .sort((a, b) => a.averageCorporateRank - b.averageCorporateRank)
                    .map((dept, index) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{index + 1}.</span>
                          <span>{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${100 - dept.averageCorporateRank}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">上位{dept.averageCorporateRank.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          )}

          {viewMode === 'detail' && (
            <div className="space-y-4">
              {departmentData
                .sort((a, b) => parseFloat(b.balanceScore) - parseFloat(a.balanceScore))
                .map(dept => (
                  <Card key={dept.name} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{dept.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <Users className="inline h-4 w-4 mr-1" />
                          {dept.totalStaff}名 | バランススコア: {dept.balanceScore}
                        </p>
                      </div>
                      <Badge className="bg-purple-600 text-white">
                        上位{dept.averageFacilityRank.toFixed(0)}% / {dept.averageCorporateRank.toFixed(0)}%
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">施設内評価分布</p>
                        <div className="flex gap-1">
                          {(['S', 'A', 'B', 'C', 'D'] as const).map(grade => (
                            <div key={grade} className="flex-1 text-center">
                              <div
                                className="h-16 flex items-end justify-center rounded"
                                style={{
                                  backgroundColor: getGradeColor(grade),
                                  height: `${Math.max(16, dept.gradeDistribution.facility[grade] / dept.totalStaff * 100)}px`
                                }}
                              >
                                <span className="text-xs text-white font-semibold mb-1">
                                  {dept.gradeDistribution.facility[grade]}
                                </span>
                              </div>
                              <div className="text-xs mt-1">{grade}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2">法人内評価分布</p>
                        <div className="flex gap-1">
                          {(['S', 'A', 'B', 'C', 'D'] as const).map(grade => (
                            <div key={grade} className="flex-1 text-center">
                              <div
                                className="h-16 flex items-end justify-center rounded"
                                style={{
                                  backgroundColor: getGradeColor(grade),
                                  height: `${Math.max(16, dept.gradeDistribution.corporate[grade] / dept.totalStaff * 100)}px`
                                }}
                              >
                                <span className="text-xs text-white font-semibold mb-1">
                                  {dept.gradeDistribution.corporate[grade]}
                                </span>
                              </div>
                              <div className="text-xs mt-1">{grade}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-around text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{dept.topPerformers}</p>
                        <p className="text-xs text-gray-600">トップ層 ({dept.topPerformerRatio}%)</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{dept.totalStaff - dept.topPerformers - dept.needSupport}</p>
                        <p className="text-xs text-gray-600">標準層</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">{dept.needSupport}</p>
                        <p className="text-xs text-gray-600">要支援層 ({dept.needSupportRatio}%)</p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
          </div>
        </div>
      </div></div>
  )
}