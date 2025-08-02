'use client'

import React, { useState, useMemo } from 'react'
import CommonHeader from '@/components/CommonHeader'
import ReportLayout from '@/components/reports/ReportLayout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { staffDatabase } from '@/app/data/staffData'

export default function PerformanceMatrixPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedPosition, setSelectedPosition] = useState('all')

  // スタッフリストを配列に変換
  const staffList = Object.values(staffDatabase)

  // フィルタリング
  const filteredStaff = staffList.filter(staff => {
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment
    const matchesFacility = selectedFacility === 'all' || staff.facility === selectedFacility
    const matchesPosition = selectedPosition === 'all' || staff.position === selectedPosition
    
    return matchesDepartment && matchesFacility && matchesPosition
  })

  // 部署・施設・職位リストを生成
  const departments = Array.from(new Set(staffList.map(s => s.department).filter(Boolean)))
  const facilities = Array.from(new Set(staffList.map(s => s.facility).filter(Boolean)))
  const positions = Array.from(new Set(staffList.map(s => s.position).filter(Boolean)))

  // 位置づけデータを計算（実際の実装では評価データから計算）
  const positioningData = useMemo(() => {
    return filteredStaff.map(staff => {
      // ランダムな位置づけを生成（実際はデータベースから取得）
      const facilityRank = Math.floor(Math.random() * 100) + 1
      const corporateRank = Math.floor(Math.random() * 100) + 1
      
      // グレード判定
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

  // マトリクスデータを生成
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
    // 両方Sなら最も良い
    if (facilityGrade === 'S' && corporateGrade === 'S') return 'bg-red-100'
    // どちらかがSなら良い
    if (facilityGrade === 'S' || corporateGrade === 'S') return 'bg-orange-50'
    // 両方AかBなら標準
    if ((facilityGrade === 'A' || facilityGrade === 'B') && (corporateGrade === 'A' || corporateGrade === 'B')) return 'bg-green-50'
    // どちらかがCなら要注意
    if (facilityGrade === 'C' || corporateGrade === 'C') return 'bg-blue-50'
    // どちらかがDなら要支援
    return 'bg-gray-100'
  }

  return (
    <>
      <CommonHeader title="位置づけマトリクス" />
      <ReportLayout
        title="位置づけマトリクス"
        description="施設内評価と法人内評価による職員の位置づけを可視化"
        icon="📊"
        color="bg-purple-500"
      >
        <div className="space-y-6">
          {/* フィルター */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">フィルター</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">全部署</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

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

              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                <option value="all">全職位</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* 位置づけマトリクス */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">位置づけマトリクス</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-50" rowSpan={2}>
                      施設内評価
                    </th>
                    <th className="border p-2 bg-gray-50" colSpan={5}>
                      法人内評価
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
                              {matrixData[facilityGrade][corporateGrade].length}名
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

            {/* 凡例 */}
            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h4 className="font-semibold mb-2">位置づけの解釈</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded mt-0.5"></div>
                  <div>
                    <span className="font-semibold">S×S:</span> 施設・法人両方でトップ層（次期リーダー候補）
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-orange-50 rounded mt-0.5"></div>
                  <div>
                    <span className="font-semibold">S×A-D, A-D×S:</span> どちらかでトップ層（ポテンシャル人材）
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-green-50 rounded mt-0.5"></div>
                  <div>
                    <span className="font-semibold">A-B×A-B:</span> 安定した中核層
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded mt-0.5"></div>
                  <div>
                    <span className="font-semibold">D×D:</span> 重点支援対象
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 詳細リスト */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">職員詳細</h3>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">職員名</th>
                    <th className="px-4 py-2 text-left">部署</th>
                    <th className="px-4 py-2 text-left">職位</th>
                    <th className="px-4 py-2 text-left">施設</th>
                    <th className="px-4 py-2 text-center">施設内評価</th>
                    <th className="px-4 py-2 text-center">法人内評価</th>
                    <th className="px-4 py-2 text-center">総合評価</th>
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
                          上位{staff.facilityRank}%
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Badge style={{ backgroundColor: getGradeColor(staff.corporateGrade), color: 'white' }}>
                          {staff.corporateGrade}
                        </Badge>
                        <div className="text-xs text-gray-600 mt-1">
                          上位{staff.corporateRank}%
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
      </ReportLayout>
    </>
  )
}