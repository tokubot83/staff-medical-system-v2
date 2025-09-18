'use client'

import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { staffDatabase } from '@/app/data/staffData'

export default function ClusterAnalysisPage() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'scatter' | 'list'>('scatter')

  // スタッフリストを配列に変換
  const staffList = Object.values(staffDatabase)

  // 各職員に位置づけデータを追加
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
      
      // クラスター判定
      let cluster = ''
      const facilityGrade = getGrade(facilityRank)
      const corporateGrade = getGrade(corporateRank)
      
      if (facilityGrade === 'S' && corporateGrade === 'S') {
        cluster = 'スーパースター'
      } else if ((facilityGrade === 'S' || facilityGrade === 'A') && (corporateGrade === 'S' || corporateGrade === 'A')) {
        cluster = 'ハイパフォーマー'
      } else if (facilityGrade === 'B' && corporateGrade === 'B') {
        cluster = '安定層'
      } else if ((facilityGrade === 'S' || facilityGrade === 'A') && (corporateGrade === 'C' || corporateGrade === 'D')) {
        cluster = '施設特化型'
      } else if ((facilityGrade === 'C' || facilityGrade === 'D') && (corporateGrade === 'S' || corporateGrade === 'A')) {
        cluster = '広域活躍型'
      } else if ((facilityGrade === 'C' || facilityGrade === 'D') && (corporateGrade === 'C' || corporateGrade === 'D')) {
        cluster = '要育成層'
      } else {
        cluster = 'ミックス型'
      }
      
      return {
        ...staff,
        facilityRank,
        corporateRank,
        facilityGrade,
        corporateGrade,
        cluster,
        x: 100 - corporateRank, // X軸は法人内評価（右が高評価）
        y: 100 - facilityRank   // Y軸は施設内評価（上が高評価）
      }
    })
  }, [staffList])

  // クラスター別の統計
  const clusterStats = useMemo(() => {
    const stats: Record<string, any> = {}
    
    staffWithPositioning.forEach(staff => {
      if (!stats[staff.cluster]) {
        stats[staff.cluster] = {
          name: staff.cluster,
          count: 0,
          members: [],
          avgFacilityRank: 0,
          avgCorporateRank: 0,
          departments: new Set()
        }
      }
      
      stats[staff.cluster].count++
      stats[staff.cluster].members.push(staff)
      stats[staff.cluster].avgFacilityRank += staff.facilityRank
      stats[staff.cluster].avgCorporateRank += staff.corporateRank
      if (staff.department) {
        stats[staff.cluster].departments.add(staff.department)
      }
    })
    
    // 平均値を計算
    Object.values(stats).forEach((cluster: any) => {
      cluster.avgFacilityRank = (cluster.avgFacilityRank / cluster.count).toFixed(1)
      cluster.avgCorporateRank = (cluster.avgCorporateRank / cluster.count).toFixed(1)
      cluster.departmentCount = cluster.departments.size
      cluster.percentage = ((cluster.count / staffWithPositioning.length) * 100).toFixed(1)
    })
    
    return stats
  }, [staffWithPositioning])

  // クラスターの色を取得
  const getClusterColor = (cluster: string) => {
    switch (cluster) {
      case 'スーパースター': return '#ff5722'
      case 'ハイパフォーマー': return '#ffc107'
      case '安定層': return '#4caf50'
      case '施設特化型': return '#2196f3'
      case '広域活躍型': return '#9c27b0'
      case '要育成層': return '#9e9e9e'
      case 'ミックス型': return '#00bcd4'
      default: return '#607d8b'
    }
  }

  // クラスターの特徴と推奨アクション
  const getClusterCharacteristics = (cluster: string) => {
    switch (cluster) {
      case 'スーパースター':
        return {
          description: '施設内・法人内ともに最上位層',
          characteristics: ['次世代リーダー候補', '組織の中核人材', '高い専門性と実績'],
          actions: ['後継者育成プログラムへの参加', '重要プロジェクトのリード', '他部門への影響力拡大']
        }
      case 'ハイパフォーマー':
        return {
          description: '両軸で高評価の優秀層',
          characteristics: ['安定した高パフォーマンス', 'チームの主力', '信頼性が高い'],
          actions: ['リーダーシップ研修', '専門性の更なる向上', 'メンター役の付与']
        }
      case '安定層':
        return {
          description: '組織の中核を担う標準層',
          characteristics: ['安定した業務遂行', '組織文化の体現者', 'チームの安定剤'],
          actions: ['スキルアップ研修', '新しい役割への挑戦', '後輩育成の機会提供']
        }
      case '施設特化型':
        return {
          description: '施設内で高評価だが法人内では標準',
          characteristics: ['施設固有の強み', '現場での信頼が厚い', '地域特性の理解'],
          actions: ['法人全体での活躍機会創出', '他施設との交流促進', '全社的な視点の育成']
        }
      case '広域活躍型':
        return {
          description: '法人内で高評価だが施設内では標準',
          characteristics: ['広い視野', '他施設での成功体験', '変革の推進力'],
          actions: ['現施設での役割明確化', 'チーム内での信頼構築', '施設特性の理解深化']
        }
      case '要育成層':
        return {
          description: '両軸で改善が必要な層',
          characteristics: ['成長の余地が大きい', '適性の見極めが必要', 'サポートが必要'],
          actions: ['個別育成計画の策定', '適性に合った配置転換', 'メンター制度の活用']
        }
      case 'ミックス型':
        return {
          description: '評価が混在している層',
          characteristics: ['特定分野での強み', '成長過程にある', '潜在能力あり'],
          actions: ['強みの明確化', '弱点の補強', 'キャリアパスの検討']
        }
      default:
        return {
          description: '',
          characteristics: [],
          actions: []
        }
    }
  }

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">{data.department}</p>
          <p className="text-sm">施設内: 上位{data.facilityRank}%</p>
          <p className="text-sm">法人内: 上位{data.corporateRank}%</p>
          <Badge style={{ backgroundColor: getClusterColor(data.cluster), color: 'white' }}>
            {data.cluster}
          </Badge>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">位置づけクラスター分析</h1>
            <p className="text-gray-600 mt-2">位置づけパターンに基づく職員のグループ分析</p>
          </div>

          <div className="space-y-6">
          {/* ビューモード切替 */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">表示モード</h3>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded ${viewMode === 'scatter' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setViewMode('scatter')}
                >
                  散布図
                </button>
                <button
                  className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setViewMode('list')}
                >
                  リスト
                </button>
              </div>
            </div>
          </Card>

          {/* クラスター概要 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(clusterStats).map((cluster: any) => (
              <Card 
                key={cluster.name} 
                className={`p-4 cursor-pointer transition-all ${
                  selectedCluster === cluster.name ? 'ring-2 ring-blue-600' : ''
                }`}
                onClick={() => setSelectedCluster(cluster.name === selectedCluster ? null : cluster.name)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getClusterColor(cluster.name) }}
                  />
                  <h4 className="font-semibold text-sm">{cluster.name}</h4>
                </div>
                <p className="text-2xl font-bold">{cluster.count}名</p>
                <p className="text-xs text-gray-600">{cluster.percentage}%</p>
              </Card>
            ))}
          </div>

          {/* 散布図表示 */}
          {viewMode === 'scatter' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">位置づけ分布図</h3>
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    name="法人内評価" 
                    domain={[0, 100]}
                    label={{ value: '法人内評価 →', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    dataKey="y" 
                    name="施設内評価" 
                    domain={[0, 100]}
                    label={{ value: '施設内評価 →', position: 'insideLeft', angle: -90 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter 
                    data={selectedCluster ? 
                      staffWithPositioning.filter(s => s.cluster === selectedCluster) : 
                      staffWithPositioning
                    } 
                    fill="#8884d8"
                  >
                    {staffWithPositioning.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getClusterColor(entry.cluster)}
                        opacity={!selectedCluster || entry.cluster === selectedCluster ? 0.8 : 0.2}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>

              {/* 象限の説明 */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="text-right pr-4">
                  <p className="font-semibold">右上: 両軸高評価</p>
                  <p className="text-gray-600">組織の中核人材</p>
                </div>
                <div>
                  <p className="font-semibold">左上: 施設内高評価</p>
                  <p className="text-gray-600">施設特化型人材</p>
                </div>
                <div className="text-right pr-4">
                  <p className="font-semibold">右下: 法人内高評価</p>
                  <p className="text-gray-600">広域活躍型人材</p>
                </div>
                <div>
                  <p className="font-semibold">左下: 両軸要改善</p>
                  <p className="text-gray-600">育成対象人材</p>
                </div>
              </div>
            </Card>
          )}

          {/* リスト表示 */}
          {viewMode === 'list' && (
            <div className="space-y-6">
              {Object.values(clusterStats).map((cluster: any) => {
                const characteristics = getClusterCharacteristics(cluster.name)
                return (
                  <Card key={cluster.name} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: getClusterColor(cluster.name) }}
                          />
                          {cluster.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{characteristics.description}</p>
                      </div>
                      <Badge className="bg-gray-600 text-white">
                        {cluster.count}名 ({cluster.percentage}%)
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">特徴</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {characteristics.characteristics.map((char, idx) => (
                            <li key={idx}>{char}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">推奨アクション</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {characteristics.actions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">統計情報</h4>
                        <p className="text-sm">平均施設内順位: 上位{cluster.avgFacilityRank}%</p>
                        <p className="text-sm">平均法人内順位: 上位{cluster.avgCorporateRank}%</p>
                        <p className="text-sm">所属部署数: {cluster.departmentCount}</p>
                      </div>
                    </div>

                    {/* メンバーリスト（最初の5名） */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-sm mb-2">代表的なメンバー</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {cluster.members.slice(0, 4).map((member: any) => (
                          <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-semibold">{member.name}</p>
                              <p className="text-xs text-gray-600">{member.department}</p>
                            </div>
                            <div className="flex gap-1">
                              <Badge style={{ backgroundColor: getClusterColor(member.facilityGrade), color: 'white' }}>
                                施{member.facilityGrade}
                              </Badge>
                              <Badge style={{ backgroundColor: getClusterColor(member.corporateGrade), color: 'white' }}>
                                法{member.corporateGrade}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      {cluster.members.length > 4 && (
                        <p className="text-sm text-gray-500 mt-2">他 {cluster.members.length - 4}名</p>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
          </div>
        </div>
      </div></div>
  )
}