'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface GenerationData {
  generation: string;
  count: number;
  percentage: number;
  avgAge: number;
  avgTenure: number;
  avgEngagement: number;
  avgStress: number;
  avgOvertime: number;
  avgPaidLeave: number;
  avgPerformance: number;
  turnoverRate: number;
}

function GenerationAnalysisContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedPosition, setSelectedPosition] = useState('全職種');
  const [compareMode, setCompareMode] = useState(false);

  // 世代を判定する関数
  const getGeneration = (age: number): string => {
    if (age < 27) return 'Z世代';
    if (age < 43) return 'ミレニアル世代';
    if (age < 59) return 'X世代';
    return 'ベビーブーマー世代';
  };

  // 世代別データを集計
  const generationData = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedPosition !== '全職種') {
        const basePosition = staff.position.replace(/主任|師長|部長|科長/, '').trim();
        if (basePosition !== selectedPosition) return false;
      }
      return true;
    });

    const totalStaff = staffList.length;

    // 世代別にグループ化
    const generationGroups = staffList.reduce((acc, staff) => {
      const generation = getGeneration(staff.age);
      if (!acc[generation]) {
        acc[generation] = [];
      }
      acc[generation].push(staff);
      return acc;
    }, {} as Record<string, typeof staffList>);

    // 各世代のデータを計算
    const data: GenerationData[] = Object.entries(generationGroups).map(([generation, staffGroup]) => {
      const count = staffGroup.length;
      const percentage = Math.round((count / totalStaff) * 100);
      
      // 平均値の計算
      const avgAge = Math.round(staffGroup.reduce((sum, s) => sum + s.age, 0) / count);
      const avgTenure = staffGroup.reduce((sum, s) => {
        const years = parseInt(s.tenure.match(/(\d+)年/)?.[1] || '0');
        return sum + years;
      }, 0) / count;
      const avgEngagement = Math.round(staffGroup.reduce((sum, s) => sum + s.engagement, 0) / count);
      const avgStress = Math.round(staffGroup.reduce((sum, s) => sum + s.stressIndex, 0) / count);
      const avgOvertime = Math.round(staffGroup.reduce((sum, s) => sum + s.overtime, 0) / count);
      const avgPaidLeave = Math.round(staffGroup.reduce((sum, s) => sum + s.paidLeaveRate, 0) / count);
      
      const avgPerformance = staffGroup.reduce((sum, s) => {
        const rating = s.evaluationData?.rating || s.evaluationHistory?.[0]?.performance || 3.5;
        return sum + rating;
      }, 0) / count;
      
      // 離職率（シミュレーション）
      const turnoverRate = Math.round(10 + Math.random() * 15);

      return {
        generation,
        count,
        percentage,
        avgAge,
        avgTenure: Number(avgTenure.toFixed(1)),
        avgEngagement,
        avgStress,
        avgOvertime,
        avgPaidLeave,
        avgPerformance: Number(avgPerformance.toFixed(2)),
        turnoverRate
      };
    });

    // 世代順にソート
    const generationOrder = ['Z世代', 'ミレニアル世代', 'X世代', 'ベビーブーマー世代'];
    return data.sort((a, b) => generationOrder.indexOf(a.generation) - generationOrder.indexOf(b.generation));
  }, [selectedFacility, selectedPosition]);

  // レーダーチャート用データ
  const radarData = useMemo(() => {
    return [
      {
        metric: 'エンゲージメント',
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = gen.avgEngagement;
          return acc;
        }, {} as Record<string, number>)
      },
      {
        metric: 'ストレス耐性',
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = 100 - gen.avgStress;
          return acc;
        }, {} as Record<string, number>)
      },
      {
        metric: 'ワークライフバランス',
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = Math.round((100 - gen.avgOvertime * 2 + gen.avgPaidLeave) / 2);
          return acc;
        }, {} as Record<string, number>)
      },
      {
        metric: 'パフォーマンス',
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = Math.round(gen.avgPerformance * 20);
          return acc;
        }, {} as Record<string, number>)
      },
      {
        metric: '定着意向',
        ...generationData.reduce((acc, gen) => {
          acc[gen.generation] = 100 - gen.turnoverRate;
          return acc;
        }, {} as Record<string, number>)
      }
    ];
  }, [generationData]);

  // 価値観データ（シミュレーション）
  const valuesData = [
    { value: '成長機会', 'Z世代': 95, 'ミレニアル世代': 85, 'X世代': 70, 'ベビーブーマー世代': 60 },
    { value: '安定性', 'Z世代': 60, 'ミレニアル世代': 70, 'X世代': 85, 'ベビーブーマー世代': 95 },
    { value: '柔軟な働き方', 'Z世代': 90, 'ミレニアル世代': 80, 'X世代': 65, 'ベビーブーマー世代': 50 },
    { value: '給与・報酬', 'Z世代': 75, 'ミレニアル世代': 85, 'X世代': 90, 'ベビーブーマー世代': 80 },
    { value: '社会貢献', 'Z世代': 85, 'ミレニアル世代': 75, 'X世代': 65, 'ベビーブーマー世代': 70 }
  ];

  // 職種リストを取得
  const positions = useMemo(() => {
    const positionSet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      const basePosition = staff.position.replace(/主任|師長|部長|科長/, '').trim();
      positionSet.add(basePosition);
    });
    return ['全職種', ...Array.from(positionSet).sort()];
  }, []);

  // 施設リストを取得
  const facilities = useMemo(() => {
    const facilitySet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      facilitySet.add(staff.facility);
    });
    return ['全施設', ...Array.from(facilitySet).sort()];
  }, []);

  // グラフの色設定
  const COLORS = {
    'Z世代': '#3B82F6',
    'ミレニアル世代': '#10B981',
    'X世代': '#F59E0B',
    'ベビーブーマー世代': '#EF4444'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">世代別特性分析</h1>
            <p className="text-gray-600 mt-2">Z世代、ミレニアル世代など世代別の特性と組織適応を分析</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* フィルター */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  施設
                </label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {facilities.map(facility => (
                    <option key={facility} value={facility}>{facility}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  職種
                </label>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-4 py-2 rounded-md transition ${
                    compareMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  比較モード
                </button>
              </div>
            </div>
          </div>

          {/* 世代構成 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>世代別人員構成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={generationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ generation, percentage }) => `${generation}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {generationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.generation as keyof typeof COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>世代別基本情報</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generationData.map(gen => (
                    <div key={gen.generation} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: COLORS[gen.generation as keyof typeof COLORS] }}
                        />
                        <span className="font-medium">{gen.generation}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{gen.count}名</span>
                        <span className="mx-2">|</span>
                        <span>平均年齢 {gen.avgAge}歳</span>
                        <span className="mx-2">|</span>
                        <span>平均勤続 {gen.avgTenure}年</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 世代別特性レーダーチャート */}
          <Card>
            <CardHeader>
              <CardTitle>世代別特性比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {generationData.map(gen => (
                      <Radar
                        key={gen.generation}
                        name={gen.generation}
                        dataKey={gen.generation}
                        stroke={COLORS[gen.generation as keyof typeof COLORS]}
                        fill={COLORS[gen.generation as keyof typeof COLORS]}
                        fillOpacity={0.3}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 価値観の違い */}
          <Card>
            <CardHeader>
              <CardTitle>世代別価値観の違い</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valuesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="value" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    {Object.keys(COLORS).map(generation => (
                      <Bar
                        key={generation}
                        dataKey={generation}
                        fill={COLORS[generation as keyof typeof COLORS]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 詳細指標比較 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>エンゲージメント・ストレス指標</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="generation" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="avgEngagement" name="エンゲージメント" fill="#10B981" />
                      <Bar dataKey="avgStress" name="ストレス指数" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>働き方指標</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="generation" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgOvertime" name="平均残業時間" fill="#F59E0B" />
                      <Bar dataKey="avgPaidLeave" name="有給取得率" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ギャップ分析 */}
          <Card>
            <CardHeader>
              <CardTitle>世代間ギャップ分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">最大ギャップ項目</h4>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 柔軟な働き方への期待: Z世代(90%) vs ベビーブーマー世代(50%)</li>
                    <li>• 安定性重視: ベビーブーマー世代(95%) vs Z世代(60%)</li>
                    <li>• 成長機会への期待: Z世代(95%) vs ベビーブーマー世代(60%)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">共通価値観</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• 社会貢献への意識は全世代で比較的高い（65-85%）</li>
                    <li>• 給与・報酬への関心は世代間で大きな差がない（75-90%）</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 推奨アクション */}
          <Card>
            <CardHeader>
              <CardTitle>世代別マネジメント推奨事項</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generationData.map(gen => (
                  <div key={gen.generation} className="p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: COLORS[gen.generation as keyof typeof COLORS] }}
                      />
                      {gen.generation}
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {gen.generation === 'Z世代' && (
                        <>
                          <li>• 成長機会と学習プログラムの充実</li>
                          <li>• フレキシブルワークの推進</li>
                          <li>• 頻繁なフィードバックの実施</li>
                        </>
                      )}
                      {gen.generation === 'ミレニアル世代' && (
                        <>
                          <li>• キャリアパスの明確化</li>
                          <li>• ワークライフバランスの支援</li>
                          <li>• チームワークの促進</li>
                        </>
                      )}
                      {gen.generation === 'X世代' && (
                        <>
                          <li>• 専門性向上の機会提供</li>
                          <li>• 自律的な働き方の尊重</li>
                          <li>• リーダーシップ機会の創出</li>
                        </>
                      )}
                      {gen.generation === 'ベビーブーマー世代' && (
                        <>
                          <li>• 経験・知識の活用機会</li>
                          <li>• メンター制度への参画</li>
                          <li>• 段階的な引退プランの提供</li>
                        </>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '世代別特性分析レポート',
                facility: selectedFacility,
                reportType: 'generation-analysis',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンロード
            </button>
          </div>

        </div>
      </div></div>
  );
}

export default function GenerationAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerationAnalysisContent />
    </Suspense>
  );
}