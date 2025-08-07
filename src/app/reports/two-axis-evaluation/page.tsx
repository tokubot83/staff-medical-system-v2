'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import ReportLayout from '@/components/reports/ReportLayout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, Users, Award, BarChart3 } from 'lucide-react'
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

  // 選択された職員を取得
  const selectedStaff = staffList.find(s => s.id === selectedEmployeeId)

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
                  placeholder="名前または職員番号で検索"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="px-3 py-2 border rounded-lg"
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
              >
                <option value="all">全施設</option>
                {facilities.map(facility => (
                  <option key={facility} value={facility}>{facility}</option>
                ))}
              </select>

              <select
                className="px-3 py-2 border rounded-lg"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">全部署</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setSearchTerm('')}
              >
                リセット
              </button>
            </div>
          </Card>

          {/* 職員リスト */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">評価対象職員</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredStaff.map(staff => (
                <div
                  key={staff.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedEmployeeId === staff.id ? 'bg-blue-50 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedEmployeeId(staff.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{staff.name}</span>
                      <span className="ml-2 text-sm text-gray-500">({staff.employeeId})</span>
                      <div className="text-sm text-gray-600">
                        {staff.facility} - {staff.department}
                      </div>
                    </div>
                    {staff.evaluation && (
                      <Badge variant="outline">{staff.evaluation}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 評価詳細 */}
          {selectedStaff && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">2軸評価詳細</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 施設評価 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold">施設評価</h4>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">85点</div>
                    <div className="text-sm text-gray-600">施設内順位: 12/150位</div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-700">評価項目:</div>
                      <ul className="text-sm text-gray-600 mt-1">
                        <li>• 技術評価: 42/50点</li>
                        <li>• 施設貢献度: 43/50点</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 法人評価 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">法人評価</h4>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">78点</div>
                    <div className="text-sm text-gray-600">法人内順位: 45/500位</div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-700">評価項目:</div>
                      <ul className="text-sm text-gray-600 mt-1">
                        <li>• 技術評価: 40/50点</li>
                        <li>• 法人貢献度: 38/50点</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 総合評価 */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">総合評価</h4>
                  </div>
                  <Badge className="text-lg px-3 py-1" variant="default">
                    A
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-600">総合得点</div>
                    <div className="text-xl font-bold">163/200点</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">パーセンタイル</div>
                    <div className="text-xl font-bold">上位15%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">成長率</div>
                    <div className="text-xl font-bold text-green-600">+12%</div>
                  </div>
                </div>
              </div>

              {/* 評価コメント */}
              <div className="mt-6 border-t pt-4">
                <h4 className="font-semibold mb-2">評価コメント</h4>
                <p className="text-gray-700">
                  施設内での技術力・貢献度ともに高い水準を維持しています。
                  法人全体での視点では、他施設との交流や法人プロジェクトへの参加により、
                  さらなる成長が期待できます。
                </p>
                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-600">推奨アクション:</span>
                  <ul className="text-sm text-gray-700 mt-1">
                    <li>• 法人研修への積極的参加</li>
                    <li>• 他施設交流プログラムへの参加</li>
                    <li>• リーダーシップ研修の受講</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {!selectedStaff && (
            <Card className="p-12">
              <div className="text-center text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">職員を選択してください</p>
                <p className="text-sm mt-2">上記のリストから評価を表示したい職員を選択してください</p>
              </div>
            </Card>
          )}
        </div>
      </ReportLayout>
    </>
  )
}

function Building({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}