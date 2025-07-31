'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { ReportLayout } from '@/components/reports/ReportLayout'
import { TwoAxisEvaluationSection } from '@/components/evaluation'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { staffDatabase } from '@/app/data/staffData'

export default function TwoAxisEvaluationPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedFacility, setSelectedFacility] = useState('all')

  // スタッフリストを配列に変換
  const staffList = Object.entries(staffDatabase).map(([id, staff]) => ({
    id,
    ...staff,
  }))

  // フィルタリング
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment
    const matchesFacility = selectedFacility === 'all' || staff.facility === selectedFacility
    
    return matchesSearch && matchesDepartment && matchesFacility
  })

  // 部署リストを生成
  const departments = Array.from(new Set(staffList.map(s => s.department).filter(Boolean)))
  const facilities = Array.from(new Set(staffList.map(s => s.facility).filter(Boolean)))

  return (
    <>
      <CommonHeader title="2軸評価分析" />
      <ReportLayout
        title="2軸評価分析"
        description="施設内評価と法人内評価による多角的な人事評価分析"
      >
        <div className="space-y-6">
          {/* 検索・フィルター */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">職員検索</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="職員名・職員IDで検索"
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

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setSearchTerm('')}
              >
                クリア
              </button>
            </div>

            {/* 職員リスト */}
            <div className="mt-6 max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">職員名</th>
                    <th className="px-4 py-2 text-left">職員ID</th>
                    <th className="px-4 py-2 text-left">部署</th>
                    <th className="px-4 py-2 text-left">職位</th>
                    <th className="px-4 py-2 text-left">施設</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr
                      key={staff.id}
                      className={`border-b hover:bg-gray-50 cursor-pointer ${
                        selectedEmployeeId === staff.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedEmployeeId(staff.id)}
                    >
                      <td className="px-4 py-2">{staff.name}</td>
                      <td className="px-4 py-2">{staff.employeeId || staff.id}</td>
                      <td className="px-4 py-2">{staff.department || '-'}</td>
                      <td className="px-4 py-2">{staff.position || '-'}</td>
                      <td className="px-4 py-2">{staff.facility || '-'}</td>
                      <td className="px-4 py-2">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEmployeeId(staff.id)
                          }}
                        >
                          選択
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStaff.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  該当する職員が見つかりません
                </div>
              )}
            </div>
          </Card>

          {/* 選択された職員の評価表示 */}
          {selectedEmployeeId && (
            <div className="animate-fade-in">
              <TwoAxisEvaluationSection
                employeeId={selectedEmployeeId}
                employeeName={staffDatabase[selectedEmployeeId]?.name || ''}
              />
            </div>
          )}

          {/* 未選択時のメッセージ */}
          {!selectedEmployeeId && (
            <Card className="p-12 text-center">
              <div className="text-gray-500">
                <p className="text-lg mb-2">職員を選択してください</p>
                <p className="text-sm">上の一覧から評価を確認したい職員を選択すると、</p>
                <p className="text-sm">2軸評価の詳細が表示されます。</p>
              </div>
            </Card>
          )}

          {/* システム説明 */}
          <Card className="p-6 bg-blue-50">
            <h3 className="text-lg font-bold mb-3">2軸評価システムについて</h3>
            <div className="space-y-2 text-sm">
              <p>
                2軸評価システムは、施設内での相対評価と法人全体での相対評価を組み合わせることで、
                より公平で客観的な人事評価を実現します。
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">施設内評価</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>同じ施設内の同職種での相対評価</li>
                    <li>施設規模や特性を考慮した評価</li>
                    <li>現場でのパフォーマンスを重視</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">法人内評価</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>法人全体の同職種での相対評価</li>
                    <li>専門性や技術力の客観的評価</li>
                    <li>キャリア開発の指標として活用</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded">
                <h4 className="font-semibold mb-2">評価グレード</h4>
                <div className="flex gap-2">
                  <Badge style={{ backgroundColor: '#e91e63', color: 'white' }}>S+</Badge>
                  <Badge style={{ backgroundColor: '#ff5722', color: 'white' }}>S</Badge>
                  <Badge style={{ backgroundColor: '#ff9800', color: 'white' }}>A+</Badge>
                  <Badge style={{ backgroundColor: '#ffc107', color: 'white' }}>A</Badge>
                  <Badge style={{ backgroundColor: '#4caf50', color: 'white' }}>B</Badge>
                  <Badge style={{ backgroundColor: '#2196f3', color: 'white' }}>C</Badge>
                  <Badge style={{ backgroundColor: '#9e9e9e', color: 'white' }}>D</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </ReportLayout>
    </>
  )
}