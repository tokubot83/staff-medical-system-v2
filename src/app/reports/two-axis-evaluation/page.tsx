'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import ReportLayout from '@/components/reports/ReportLayout'
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
  const staffList = Object.values(staffDatabase)

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
        description="施設内・法人内での職員の相対的な位置づけを把握する評価システム"
        icon="📊"
        color="bg-purple-500"
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
                2軸評価システムは、職員が「施設内でどの位置にいるか」と「法人全体でどの位置にいるか」を
                可視化し、組織内での相対的な位置づけを明確にするシステムです。
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">施設内評価</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>自施設内での職員の位置づけを把握</li>
                    <li>施設レベルでの相対的な立ち位置を可視化</li>
                    <li>施設運営における役割・貢献度の指標</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">法人内評価</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>法人全体での職員の位置づけを把握</li>
                    <li>組織全体における相対的な立ち位置を可視化</li>
                    <li>法人内でのキャリア形成・配置の参考指標</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded">
                <h4 className="font-semibold mb-2">位置づけグレード（相対的分布）</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: '#ff5722', color: 'white' }}>S</Badge>
                    <span className="text-gray-700">上位10%（最上位層）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: '#ffc107', color: 'white' }}>A</Badge>
                    <span className="text-gray-700">上位11-30%（上位層）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: '#4caf50', color: 'white' }}>B</Badge>
                    <span className="text-gray-700">上位31-70%（中核層）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: '#2196f3', color: 'white' }}>C</Badge>
                    <span className="text-gray-700">上位71-90%（育成層）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: '#9e9e9e', color: 'white' }}>D</Badge>
                    <span className="text-gray-700">下位10%（要支援層）</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-600">
                    ※ 施設内と法人内の位置づけを組み合わせることで、職員の多面的な立ち位置が明確になります
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </ReportLayout>
    </>
  )
}