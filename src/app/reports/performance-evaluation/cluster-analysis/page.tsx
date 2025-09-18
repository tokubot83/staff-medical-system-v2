'use client'

import React, { useState, useMemo } from 'react'
import CommonHeader from '@/components/CommonHeader'
import { CategoryTopButton } from '@/components/CategoryTopButton'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { staffDatabase } from '@/app/data/staffData'

export default function ClusterAnalysisPage() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'scatter' | 'list'>('scatter')

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
      
      // 繧ｯ繝ｩ繧ｹ繧ｿ繝ｼ蛻､螳・
      let cluster = ''
      const facilityGrade = getGrade(facilityRank)
      const corporateGrade = getGrade(corporateRank)
      
      if (facilityGrade === 'S' && corporateGrade === 'S') {
        cluster = '繧ｹ繝ｼ繝代・繧ｹ繧ｿ繝ｼ'
      } else if ((facilityGrade === 'S' || facilityGrade === 'A') && (corporateGrade === 'S' || corporateGrade === 'A')) {
        cluster = '繝上う繝代ヵ繧ｩ繝ｼ繝槭・'
      } else if (facilityGrade === 'B' && corporateGrade === 'B') {
        cluster = '螳牙ｮ壼ｱ､'
      } else if ((facilityGrade === 'S' || facilityGrade === 'A') && (corporateGrade === 'C' || corporateGrade === 'D')) {
        cluster = '譁ｽ險ｭ迚ｹ蛹門梛'
      } else if ((facilityGrade === 'C' || facilityGrade === 'D') && (corporateGrade === 'S' || corporateGrade === 'A')) {
        cluster = '蠎・沺豢ｻ霄榊梛'
      } else if ((facilityGrade === 'C' || facilityGrade === 'D') && (corporateGrade === 'C' || corporateGrade === 'D')) {
        cluster = '隕∬ご謌仙ｱ､'
      } else {
        cluster = '繝溘ャ繧ｯ繧ｹ蝙・
      }
      
      return {
        ...staff,
        facilityRank,
        corporateRank,
        facilityGrade,
        corporateGrade,
        cluster,
        x: 100 - corporateRank, // X霆ｸ縺ｯ豕穂ｺｺ蜀・ｩ穂ｾ｡・亥承縺碁ｫ倩ｩ穂ｾ｡・・
        y: 100 - facilityRank   // Y霆ｸ縺ｯ譁ｽ險ｭ蜀・ｩ穂ｾ｡・井ｸ翫′鬮倩ｩ穂ｾ｡・・
      }
    })
  }, [staffList])

  // 繧ｯ繝ｩ繧ｹ繧ｿ繝ｼ蛻･縺ｮ邨ｱ險・
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
    
    // 蟷ｳ蝮・､繧定ｨ育ｮ・
    Object.values(stats).forEach((cluster: any) => {
      cluster.avgFacilityRank = (cluster.avgFacilityRank / cluster.count).toFixed(1)
      cluster.avgCorporateRank = (cluster.avgCorporateRank / cluster.count).toFixed(1)
      cluster.departmentCount = cluster.departments.size
      cluster.percentage = ((cluster.count / staffWithPositioning.length) * 100).toFixed(1)
    })
    
    return stats
  }, [staffWithPositioning])

  // 繧ｯ繝ｩ繧ｹ繧ｿ繝ｼ縺ｮ濶ｲ繧貞叙蠕・
  const getClusterColor = (cluster: string) => {
    switch (cluster) {
      case '繧ｹ繝ｼ繝代・繧ｹ繧ｿ繝ｼ': return '#ff5722'
      case '繝上う繝代ヵ繧ｩ繝ｼ繝槭・': return '#ffc107'
      case '螳牙ｮ壼ｱ､': return '#4caf50'
      case '譁ｽ險ｭ迚ｹ蛹門梛': return '#2196f3'
      case '蠎・沺豢ｻ霄榊梛': return '#9c27b0'
      case '隕∬ご謌仙ｱ､': return '#9e9e9e'
      case '繝溘ャ繧ｯ繧ｹ蝙・: return '#00bcd4'
      default: return '#607d8b'
    }
  }

  // 繧ｯ繝ｩ繧ｹ繧ｿ繝ｼ縺ｮ迚ｹ蠕ｴ縺ｨ謗ｨ螂ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ
  const getClusterCharacteristics = (cluster: string) => {
    switch (cluster) {
      case '繧ｹ繝ｼ繝代・繧ｹ繧ｿ繝ｼ':
        return {
          description: '譁ｽ險ｭ蜀・・豕穂ｺｺ蜀・→繧ゅ↓譛荳贋ｽ榊ｱ､',
          characteristics: ['谺｡荳紋ｻ｣繝ｪ繝ｼ繝繝ｼ蛟呵｣・, '邨・ｹ斐・荳ｭ譬ｸ莠ｺ譚・, '鬮倥＞蟆る摩諤ｧ縺ｨ螳溽ｸｾ'],
          actions: ['蠕檎ｶ呵・ご謌舌・繝ｭ繧ｰ繝ｩ繝縺ｸ縺ｮ蜿ょ刈', '驥崎ｦ√・繝ｭ繧ｸ繧ｧ繧ｯ繝医・繝ｪ繝ｼ繝・, '莉夜Κ髢縺ｸ縺ｮ蠖ｱ髻ｿ蜉帶僑螟ｧ']
        }
      case '繝上う繝代ヵ繧ｩ繝ｼ繝槭・':
        return {
          description: '荳｡霆ｸ縺ｧ鬮倩ｩ穂ｾ｡縺ｮ蜆ｪ遘螻､',
          characteristics: ['螳牙ｮ壹＠縺滄ｫ倥ヱ繝輔か繝ｼ繝槭Φ繧ｹ', '繝√・繝縺ｮ荳ｻ蜉・, '菫｡鬆ｼ諤ｧ縺碁ｫ倥＞'],
          actions: ['繝ｪ繝ｼ繝繝ｼ繧ｷ繝・・遐比ｿｮ', '蟆る摩諤ｧ縺ｮ譖ｴ縺ｪ繧句髄荳・, '繝｡繝ｳ繧ｿ繝ｼ蠖ｹ縺ｮ莉倅ｸ・]
        }
      case '螳牙ｮ壼ｱ､':
        return {
          description: '邨・ｹ斐・荳ｭ譬ｸ繧呈球縺・ｨ呎ｺ門ｱ､',
          characteristics: ['螳牙ｮ壹＠縺滓･ｭ蜍咎≠陦・, '邨・ｹ疲枚蛹悶・菴鍋樟閠・, '繝√・繝縺ｮ螳牙ｮ壼王'],
          actions: ['繧ｹ繧ｭ繝ｫ繧｢繝・・遐比ｿｮ', '譁ｰ縺励＞蠖ｹ蜑ｲ縺ｸ縺ｮ謖第姶', '蠕瑚ｼｩ閧ｲ謌舌・讖滉ｼ壽署萓・]
        }
      case '譁ｽ險ｭ迚ｹ蛹門梛':
        return {
          description: '譁ｽ險ｭ蜀・〒鬮倩ｩ穂ｾ｡縺縺梧ｳ穂ｺｺ蜀・〒縺ｯ讓呎ｺ・,
          characteristics: ['譁ｽ險ｭ蝗ｺ譛峨・蠑ｷ縺ｿ', '迴ｾ蝣ｴ縺ｧ縺ｮ菫｡鬆ｼ縺悟字縺・, '蝨ｰ蝓溽音諤ｧ縺ｮ逅・ｧ｣'],
          actions: ['豕穂ｺｺ蜈ｨ菴薙〒縺ｮ豢ｻ霄肴ｩ滉ｼ壼卸蜃ｺ', '莉匁命險ｭ縺ｨ縺ｮ莠､豬∽ｿ・ｲ', '蜈ｨ遉ｾ逧・↑隕也せ縺ｮ閧ｲ謌・]
        }
      case '蠎・沺豢ｻ霄榊梛':
        return {
          description: '豕穂ｺｺ蜀・〒鬮倩ｩ穂ｾ｡縺縺梧命險ｭ蜀・〒縺ｯ讓呎ｺ・,
          characteristics: ['蠎・＞隕夜㍽', '莉匁命險ｭ縺ｧ縺ｮ謌仙粥菴馴ｨ・, '螟蛾擠縺ｮ謗ｨ騾ｲ蜉・],
          actions: ['迴ｾ譁ｽ險ｭ縺ｧ縺ｮ蠖ｹ蜑ｲ譏守｢ｺ蛹・, '繝√・繝蜀・〒縺ｮ菫｡鬆ｼ讒狗ｯ・, '譁ｽ險ｭ迚ｹ諤ｧ縺ｮ逅・ｧ｣豺ｱ蛹・]
        }
      case '隕∬ご謌仙ｱ､':
        return {
          description: '荳｡霆ｸ縺ｧ謾ｹ蝟・′蠢・ｦ√↑螻､',
          characteristics: ['謌宣聞縺ｮ菴吝慍縺悟､ｧ縺阪＞', '驕ｩ諤ｧ縺ｮ隕区･ｵ繧√′蠢・ｦ・, '繧ｵ繝昴・繝医′蠢・ｦ・],
          actions: ['蛟句挨閧ｲ謌占ｨ育判縺ｮ遲門ｮ・, '驕ｩ諤ｧ縺ｫ蜷医▲縺滄・鄂ｮ霆｢謠・, '繝｡繝ｳ繧ｿ繝ｼ蛻ｶ蠎ｦ縺ｮ豢ｻ逕ｨ']
        }
      case '繝溘ャ繧ｯ繧ｹ蝙・:
        return {
          description: '隧穂ｾ｡縺梧ｷｷ蝨ｨ縺励※縺・ｋ螻､',
          characteristics: ['迚ｹ螳壼・驥弱〒縺ｮ蠑ｷ縺ｿ', '謌宣聞驕守ｨ九↓縺ゅｋ', '貎懷惠閭ｽ蜉帙≠繧・],
          actions: ['蠑ｷ縺ｿ縺ｮ譏守｢ｺ蛹・, '蠑ｱ轤ｹ縺ｮ陬懷ｼｷ', '繧ｭ繝｣繝ｪ繧｢繝代せ縺ｮ讀懆ｨ・]
        }
      default:
        return {
          description: '',
          characteristics: [],
          actions: []
        }
    }
  }

  // 繧ｫ繧ｹ繧ｿ繝繝・・繝ｫ繝√ャ繝・
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">{data.department}</p>
          <p className="text-sm">譁ｽ險ｭ蜀・ 荳贋ｽ砿data.facilityRank}%</p>
          <p className="text-sm">豕穂ｺｺ蜀・ 荳贋ｽ砿data.corporateRank}%</p>
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
      <CommonHeader title="菴咲ｽｮ縺･縺代け繝ｩ繧ｹ繧ｿ繝ｼ蛻・梵" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">菴咲ｽｮ縺･縺代け繝ｩ繧ｹ繧ｿ繝ｼ蛻・梵</h1>
            <p className="text-gray-600 mt-2">菴咲ｽｮ縺･縺代ヱ繧ｿ繝ｼ繝ｳ縺ｫ蝓ｺ縺･縺剰・蜩｡縺ｮ繧ｰ繝ｫ繝ｼ繝怜・譫・/p>
          </div>

          <div className="space-y-6">
          {/* 繝薙Η繝ｼ繝｢繝ｼ繝牙・譖ｿ */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">陦ｨ遉ｺ繝｢繝ｼ繝・/h3>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded ${viewMode === 'scatter' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setViewMode('scatter')}
                >
                  謨｣蟶・峙
                </button>
                <button
                  className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setViewMode('list')}
                >
                  繝ｪ繧ｹ繝・
                </button>
              </div>
            </div>
          </Card>

          {/* 繧ｯ繝ｩ繧ｹ繧ｿ繝ｼ讎りｦ・*/}
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
                <p className="text-2xl font-bold">{cluster.count}蜷・/p>
                <p className="text-xs text-gray-600">{cluster.percentage}%</p>
              </Card>
            ))}
          </div>

          {/* 謨｣蟶・峙陦ｨ遉ｺ */}
          {viewMode === 'scatter' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">菴咲ｽｮ縺･縺大・蟶・峙</h3>
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    name="豕穂ｺｺ蜀・ｩ穂ｾ｡" 
                    domain={[0, 100]}
                    label={{ value: '豕穂ｺｺ蜀・ｩ穂ｾ｡ 竊・, position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    dataKey="y" 
                    name="譁ｽ險ｭ蜀・ｩ穂ｾ｡" 
                    domain={[0, 100]}
                    label={{ value: '譁ｽ險ｭ蜀・ｩ穂ｾ｡ 竊・, position: 'insideLeft', angle: -90 }}
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

              {/* 雎｡髯舌・隱ｬ譏・*/}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="text-right pr-4">
                  <p className="font-semibold">蜿ｳ荳・ 荳｡霆ｸ鬮倩ｩ穂ｾ｡</p>
                  <p className="text-gray-600">邨・ｹ斐・荳ｭ譬ｸ莠ｺ譚・/p>
                </div>
                <div>
                  <p className="font-semibold">蟾ｦ荳・ 譁ｽ險ｭ蜀・ｫ倩ｩ穂ｾ｡</p>
                  <p className="text-gray-600">譁ｽ險ｭ迚ｹ蛹門梛莠ｺ譚・/p>
                </div>
                <div className="text-right pr-4">
                  <p className="font-semibold">蜿ｳ荳・ 豕穂ｺｺ蜀・ｫ倩ｩ穂ｾ｡</p>
                  <p className="text-gray-600">蠎・沺豢ｻ霄榊梛莠ｺ譚・/p>
                </div>
                <div>
                  <p className="font-semibold">蟾ｦ荳・ 荳｡霆ｸ隕∵隼蝟・/p>
                  <p className="text-gray-600">閧ｲ謌仙ｯｾ雎｡莠ｺ譚・/p>
                </div>
              </div>
            </Card>
          )}

          {/* 繝ｪ繧ｹ繝郁｡ｨ遉ｺ */}
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
                        {cluster.count}蜷・({cluster.percentage}%)
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">迚ｹ蠕ｴ</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {characteristics.characteristics.map((char, idx) => (
                            <li key={idx}>{char}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">謗ｨ螂ｨ繧｢繧ｯ繧ｷ繝ｧ繝ｳ</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {characteristics.actions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">邨ｱ險域ュ蝣ｱ</h4>
                        <p className="text-sm">蟷ｳ蝮・命險ｭ蜀・・ｽ・ 荳贋ｽ砿cluster.avgFacilityRank}%</p>
                        <p className="text-sm">蟷ｳ蝮・ｳ穂ｺｺ蜀・・ｽ・ 荳贋ｽ砿cluster.avgCorporateRank}%</p>
                        <p className="text-sm">謇螻樣Κ鄂ｲ謨ｰ: {cluster.departmentCount}</p>
                      </div>
                    </div>

                    {/* 繝｡繝ｳ繝舌・繝ｪ繧ｹ繝茨ｼ域怙蛻昴・5蜷搾ｼ・*/}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-sm mb-2">莉｣陦ｨ逧・↑繝｡繝ｳ繝舌・</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {cluster.members.slice(0, 4).map((member: any) => (
                          <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-semibold">{member.name}</p>
                              <p className="text-xs text-gray-600">{member.department}</p>
                            </div>
                            <div className="flex gap-1">
                              <Badge style={{ backgroundColor: getClusterColor(member.facilityGrade), color: 'white' }}>
                                譁ｽ{member.facilityGrade}
                              </Badge>
                              <Badge style={{ backgroundColor: getClusterColor(member.corporateGrade), color: 'white' }}>
                                豕府member.corporateGrade}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      {cluster.members.length > 4 && (
                        <p className="text-sm text-gray-500 mt-2">莉・{cluster.members.length - 4}蜷・/p>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports/performance-evaluation" categoryName="莠ｺ莠玖ｩ穂ｾ｡蛻・梵" /></div>
  )
}