'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface LocationCohort {
  location: string;
  type: string;
  count: number;
  avgRetention: number;
  avgSalary: number;
  avgCommute: number;
  workStyle: string;
  satisfaction: number;
  turnoverRate: number;
  characteristics: string[];
}

function LocationCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedLocationType, setSelectedLocationType] = useState('all');
  const [selectedAnalysisView, setSelectedAnalysisView] = useState('overview');

  // 地域・施設タイプの定義
  const locationTypes = [
    '都市部大規模施設',
    '都市部中規模施設',
    '郊外大規模施設',
    '郊外中規模施設',
    '地方施設',
    '本社勤務',
    '複数施設経験者'
  ];

  // 地域・施設コホートデータの生成
  const locationCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      return true;
    });

    // 施設タイプ別にコホートを生成
    const cohorts: LocationCohort[] = locationTypes.map(type => {
      let location = '';
      let avgRetention = 0;
      let avgSalary = 0;
      let avgCommute = 0;
      let workStyle = '';
      let satisfaction = 0;
      let turnoverRate = 0;
      let characteristics: string[] = [];

      switch (type) {
        case '都市部大規模施設':
          location = '東京・大阪';
          avgRetention = 82;
          avgSalary = 450;
          avgCommute = 45;
          workStyle = '多様な働き方';
          satisfaction = 78;
          turnoverRate = 18;
          characteristics = ['高い専門性', '多様な症例', '競争的環境'];
          break;
        case '都市部中規模施設':
          location = '都市部';
          avgRetention = 85;
          avgSalary = 420;
          avgCommute = 35;
          workStyle = 'バランス型';
          satisfaction = 82;
          turnoverRate = 15;
          characteristics = ['地域密着', '適度な規模', 'アクセス良好'];
          break;
        case '郊外大規模施設':
          location = '郊外';
          avgRetention = 88;
          avgSalary = 400;
          avgCommute = 25;
          workStyle = '車通勤中心';
          satisfaction = 85;
          turnoverRate = 12;
          characteristics = ['駐車場完備', '広い施設', '家族的雰囲気'];
          break;
        case '郊外中規模施設':
          location = '郊外';
          avgRetention = 90;
          avgSalary = 380;
          avgCommute = 20;
          workStyle = '地域密着型';
          satisfaction = 88;
          turnoverRate = 10;
          characteristics = ['地元採用多', '定着率高', 'コミュニティ密着'];
          break;
        case '地方施設':
          location = '地方';
          avgRetention = 92;
          avgSalary = 350;
          avgCommute = 15;
          workStyle = '地域貢献型';
          satisfaction = 86;
          turnoverRate = 8;
          characteristics = ['人材確保課題', '地域唯一', '使命感高'];
          break;
        case '本社勤務':
          location = '本社';
          avgRetention = 80;
          avgSalary = 480;
          avgCommute = 50;
          workStyle = 'デスクワーク中心';
          satisfaction = 75;
          turnoverRate = 20;
          characteristics = ['管理業務', '企画立案', 'リモート可'];
          break;
        case '複数施設経験者':
          location = '複数';
          avgRetention = 85;
          avgSalary = 460;
          avgCommute = 30;
          workStyle = '柔軟な適応';
          satisfaction = 80;
          turnoverRate = 15;
          characteristics = ['豊富な経験', '適応力高', 'ネットワーク広'];
          break;
      }

      // シミュレーションでスタッフを分類
      const cohortStaff = staffList.filter(() => Math.random() < 0.15);
      const count = cohortStaff.length;

      if (count === 0) return null;

      return {
        location,
        type,
        count,
        avgRetention,
        avgSalary,
        avgCommute,
        workStyle,
        satisfaction,
        turnoverRate,
        characteristics
      };
    }).filter(Boolean) as LocationCohort[];

    if (selectedLocationType !== 'all') {
      return cohorts.filter(c => c.type === selectedLocationType);
    }

    return cohorts;
  }, [selectedFacility, selectedLocationType]);

  // 地域別比較データ
  const regionalComparisonData = useMemo(() => {
    return [
      { region: '都市部', retention: 83, salary: 435, satisfaction: 80, workload: 85 },
      { region: '郊外', retention: 89, salary: 390, satisfaction: 86, workload: 75 },
      { region: '地方', retention: 92, salary: 350, satisfaction: 86, workload: 70 },
      { region: '本社', retention: 80, salary: 480, satisfaction: 75, workload: 80 }
    ];
  }, []);

  // 通勤時間と満足度の相関データ
  const commuteImpactData = useMemo(() => {
    return [
      { time: '15分以内', satisfaction: 90, retention: 94, stress: 20 },
      { time: '15-30分', satisfaction: 85, retention: 90, stress: 30 },
      { time: '30-45分', satisfaction: 78, retention: 85, stress: 45 },
      { time: '45-60分', satisfaction: 70, retention: 78, stress: 60 },
      { time: '60分以上', satisfaction: 60, retention: 70, stress: 75 }
    ];
  }, []);

  // 施設規模別特性データ
  const facilitySizeData = useMemo(() => {
    return [
      { size: '大規模（500床以上）', diversity: 90, career: 85, pressure: 80, resource: 95 },
      { size: '中規模（200-500床）', diversity: 75, career: 75, pressure: 65, resource: 80 },
      { size: '小規模（200床未満）', diversity: 60, career: 65, pressure: 50, resource: 65 }
    ];
  }, []);

  // レーダーチャート用データ
  const radarData = useMemo(() => {
    const metrics = ['定着率', '給与水準', '満足度', '成長機会', 'WLB'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      locationCohorts.slice(0, 4).forEach(cohort => {
        switch (metric) {
          case '定着率': dataPoint[cohort.type] = cohort.avgRetention; break;
          case '給与水準': dataPoint[cohort.type] = (cohort.avgSalary / 500) * 100; break;
          case '満足度': dataPoint[cohort.type] = cohort.satisfaction; break;
          case '成長機会': dataPoint[cohort.type] = cohort.type.includes('都市') ? 85 : 70; break;
          case 'WLB': dataPoint[cohort.type] = 100 - cohort.avgCommute; break;
        }
      });
      return dataPoint;
    });
  }, [locationCohorts]);

  // 転勤影響データ
  const transferImpactData = useMemo(() => {
    return [
      { experience: '転勤なし', retention: 88, engagement: 75, network: 60 },
      { experience: '1回転勤', retention: 85, engagement: 80, network: 75 },
      { experience: '2-3回転勤', retention: 82, engagement: 85, network: 90 },
      { experience: '4回以上転勤', retention: 78, engagement: 82, network: 95 }
    ];
  }, []);

  // 施設リストを取得
  const facilities = useMemo(() => {
    const facilitySet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      facilitySet.add(staff.facility);
    });
    return ['全施設', ...Array.from(facilitySet).sort()];
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">地域・施設特性コホート分析</h1>
            <p className="text-gray-600 mt-2">
              都市部/地方、施設規模、転勤経験など立地・施設特性による職員の違いを分析
            </p>
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
                  立地タイプ
                </label>
                <select
                  value={selectedLocationType}
                  onChange={(e) => setSelectedLocationType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全タイプ</option>
                  {locationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分析視点
                </label>
                <select
                  value={selectedAnalysisView}
                  onChange={(e) => setSelectedAnalysisView(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="overview">概要</option>
                  <option value="regional">地域別</option>
                  <option value="facility">施設別</option>
                  <option value="transfer">転勤影響</option>
                </select>
              </div>
            </div>
          </div>

          {/* 立地タイプ別統計 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {locationCohorts.slice(0, 4).map((cohort, index) => (
              <Card key={cohort.type}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{cohort.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">人数</span>
                      <span className="text-lg font-semibold">{cohort.count}名</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">定着率</span>
                      <span className={`text-lg font-semibold ${cohort.avgRetention >= 85 ? 'text-green-600' : 'text-amber-600'}`}>
                        {cohort.avgRetention}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">満足度</span>
                      <span className="text-lg font-semibold text-blue-600">{cohort.satisfaction}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 地域別比較 */}
          <Card>
            <CardHeader>
              <CardTitle>地域別主要指標比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="retention" name="定着率(%)" fill="#3B82F6" />
                    <Bar dataKey="satisfaction" name="満足度(%)" fill="#10B981" />
                    <Bar dataKey="workload" name="業務負荷(%)" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 通勤時間の影響 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>通勤時間と職員満足度・定着率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={commuteImpactData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="satisfaction" name="満足度" fill="#3B82F6" />
                      <Line type="monotone" dataKey="retention" name="定着率" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="stress" name="ストレス" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>施設タイプ別特性</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {locationCohorts.slice(0, 3).map((cohort, index) => (
                        <Radar
                          key={cohort.type}
                          name={cohort.type}
                          dataKey={cohort.type}
                          stroke={COLORS[index]}
                          fill={COLORS[index]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 施設規模別特性 */}
          <Card>
            <CardHeader>
              <CardTitle>施設規模別の特性比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={facilitySizeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="size" type="category" width={150} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="diversity" name="症例多様性" fill="#3B82F6" />
                    <Bar dataKey="career" name="キャリア機会" fill="#10B981" />
                    <Bar dataKey="pressure" name="業務プレッシャー" fill="#F59E0B" />
                    <Bar dataKey="resource" name="リソース充実度" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 転勤経験の影響 */}
          <Card>
            <CardHeader>
              <CardTitle>転勤経験による影響分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transferImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="experience" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="retention" name="定着率" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="engagement" name="エンゲージメント" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="network" name="ネットワーク広さ" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 特性一覧 */}
          <Card>
            <CardHeader>
              <CardTitle>立地・施設タイプ別特性と推奨施策</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationCohorts.map((cohort) => (
                  <div key={cohort.type} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{cohort.type}</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {cohort.characteristics.map((char, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {char}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          平均給与: {cohort.avgSalary}万円 | 通勤時間: {cohort.avgCommute}分 | 
                          働き方: {cohort.workStyle}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {cohort.type === '都市部大規模施設' && '専門性向上とキャリア開発支援を強化。'}
                          {cohort.type === '地方施設' && '地域手当の充実と研修機会の確保が重要。'}
                          {cohort.type === '本社勤務' && 'リモートワーク推進とコミュニケーション活性化。'}
                          {cohort.type === '複数施設経験者' && '経験を活かしたメンター役や改善提案者として活用。'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">離職率: {cohort.turnoverRate}%</p>
                        <p className="text-xs text-gray-500">満足度: {cohort.satisfaction}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* サマリー統計 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">都市部職員比率</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(locationCohorts.filter(c => c.type.includes('都市')).reduce((sum, c) => sum + c.count, 0) / locationCohorts.reduce((sum, c) => sum + c.count, 0) * 100)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">全職員中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">平均通勤時間</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(locationCohorts.reduce((sum, c) => sum + c.avgCommute * c.count, 0) / locationCohorts.reduce((sum, c) => sum + c.count, 0))}分
                </p>
                <p className="text-sm text-gray-600 mt-1">片道平均</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">転勤経験者</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {locationCohorts.find(c => c.type === '複数施設経験者')?.count || 0}名
                </p>
                <p className="text-sm text-gray-600 mt-1">豊富な経験保有</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">地方勤務満足度</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600">86%</p>
                <p className="text-sm text-gray-600 mt-1">高い満足度</p>
              </CardContent>
            </Card>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '地域・施設特性コホート分析レポート',
                facility: selectedFacility,
                reportType: 'location-cohort',
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

export default function LocationCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LocationCohortContent />
    </Suspense>
  );
}