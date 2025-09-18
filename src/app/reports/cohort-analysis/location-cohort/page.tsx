'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
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

  // 地域�E施設タイプ�E定義
  const locationTypes = [
    '都市部大規模施設',
    '都市部中規模施設',
    '郊外大規模施設',
    '郊外中規模施設',
    '地方施設',
    '本社勤勁E,
    '褁E��施設経験老E
  ];

  // 地域�E施設コホ�Eトデータの生�E
  const locationCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      return true;
    });

    // 施設タイプ別にコホ�Eトを生�E
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
          characteristics = ['高い専門性', '多様な痁E��E, '競争的環墁E];
          break;
        case '都市部中規模施設':
          location = '都市部';
          avgRetention = 85;
          avgSalary = 420;
          avgCommute = 35;
          workStyle = 'バランス垁E;
          satisfaction = 82;
          turnoverRate = 15;
          characteristics = ['地域寁E��', '適度な規模', 'アクセス良好'];
          break;
        case '郊外大規模施設':
          location = '郊夁E;
          avgRetention = 88;
          avgSalary = 400;
          avgCommute = 25;
          workStyle = '車通勤中忁E;
          satisfaction = 85;
          turnoverRate = 12;
          characteristics = ['駐車場完備', '庁E��施設', '家族的雰囲氁E];
          break;
        case '郊外中規模施設':
          location = '郊夁E;
          avgRetention = 90;
          avgSalary = 380;
          avgCommute = 20;
          workStyle = '地域寁E��垁E;
          satisfaction = 88;
          turnoverRate = 10;
          characteristics = ['地允E��用夁E, '定着玁E��E, 'コミュニティ寁E��'];
          break;
        case '地方施設':
          location = '地方';
          avgRetention = 92;
          avgSalary = 350;
          avgCommute = 15;
          workStyle = '地域貢献垁E;
          satisfaction = 86;
          turnoverRate = 8;
          characteristics = ['人材確保課顁E, '地域唯一', '使命感髁E];
          break;
        case '本社勤勁E:
          location = '本社';
          avgRetention = 80;
          avgSalary = 480;
          avgCommute = 50;
          workStyle = 'チE��クワーク中忁E;
          satisfaction = 75;
          turnoverRate = 20;
          characteristics = ['管琁E��勁E, '企画立桁E, 'リモート可'];
          break;
        case '褁E��施設経験老E:
          location = '褁E��';
          avgRetention = 85;
          avgSalary = 460;
          avgCommute = 30;
          workStyle = '柔軟な適忁E;
          satisfaction = 80;
          turnoverRate = 15;
          characteristics = ['豊富な経騁E, '適応力髁E, 'ネットワーク庁E];
          break;
      }

      // シミュレーションでスタチE��を�E顁E
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

  // 地域別比輁E��ータ
  const regionalComparisonData = useMemo(() => {
    return [
      { region: '都市部', retention: 83, salary: 435, satisfaction: 80, workload: 85 },
      { region: '郊夁E, retention: 89, salary: 390, satisfaction: 86, workload: 75 },
      { region: '地方', retention: 92, salary: 350, satisfaction: 86, workload: 70 },
      { region: '本社', retention: 80, salary: 480, satisfaction: 75, workload: 80 }
    ];
  }, []);

  // 通勤時間と満足度の相関チE�Eタ
  const commuteImpactData = useMemo(() => {
    return [
      { time: '15刁E��冁E, satisfaction: 90, retention: 94, stress: 20 },
      { time: '15-30刁E, satisfaction: 85, retention: 90, stress: 30 },
      { time: '30-45刁E, satisfaction: 78, retention: 85, stress: 45 },
      { time: '45-60刁E, satisfaction: 70, retention: 78, stress: 60 },
      { time: '60刁E��丁E, satisfaction: 60, retention: 70, stress: 75 }
    ];
  }, []);

  // 施設規模別特性チE�Eタ
  const facilitySizeData = useMemo(() => {
    return [
      { size: '大規模�E�E00床以上！E, diversity: 90, career: 85, pressure: 80, resource: 95 },
      { size: '中規模�E�E00-500床！E, diversity: 75, career: 75, pressure: 65, resource: 80 },
      { size: '小規模�E�E00床未満�E�E, diversity: 60, career: 65, pressure: 50, resource: 65 }
    ];
  }, []);

  // レーダーチャート用チE�Eタ
  const radarData = useMemo(() => {
    const metrics = ['定着玁E, '給与水溁E, '満足度', '成長機企E, 'WLB'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      locationCohorts.slice(0, 4).forEach(cohort => {
        switch (metric) {
          case '定着玁E: dataPoint[cohort.type] = cohort.avgRetention; break;
          case '給与水溁E: dataPoint[cohort.type] = (cohort.avgSalary / 500) * 100; break;
          case '満足度': dataPoint[cohort.type] = cohort.satisfaction; break;
          case '成長機企E: dataPoint[cohort.type] = cohort.type.includes('都币E) ? 85 : 70; break;
          case 'WLB': dataPoint[cohort.type] = 100 - cohort.avgCommute; break;
        }
      });
      return dataPoint;
    });
  }, [locationCohorts]);

  // 転勤影響チE�Eタ
  const transferImpactData = useMemo(() => {
    return [
      { experience: '転勤なぁE, retention: 88, engagement: 75, network: 60 },
      { experience: '1回転勤', retention: 85, engagement: 80, network: 75 },
      { experience: '2-3回転勤', retention: 82, engagement: 85, network: 90 },
      { experience: '4回以上転勤', retention: 78, engagement: 82, network: 95 }
    ];
  }, []);

  // 施設リストを取征E
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
      <CommonHeader title="地域�E施設特性コホ�Eト�E极E />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">地域�E施設特性コホ�Eト�E极E/h1>
            <p className="text-gray-600 mt-2">
              都市部/地方、施設規模、転勤経験など立地・施設特性による職員の違いを�E极E
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
                  立地タイチE
                </label>
                <select
                  value={selectedLocationType}
                  onChange={(e) => setSelectedLocationType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全タイチE/option>
                  {locationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  刁E��視点
                </label>
                <select
                  value={selectedAnalysisView}
                  onChange={(e) => setSelectedAnalysisView(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="overview">概要E/option>
                  <option value="regional">地域別</option>
                  <option value="facility">施設別</option>
                  <option value="transfer">転勤影響</option>
                </select>
              </div>
            </div>
          </div>

          {/* 立地タイプ別統訁E*/}
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
                      <span className="text-lg font-semibold">{cohort.count}吁E/span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">定着玁E/span>
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

          {/* 地域別比輁E*/}
          <Card>
            <CardHeader>
              <CardTitle>地域別主要指標比輁E/CardTitle>
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
                    <Bar dataKey="retention" name="定着玁E%)" fill="#3B82F6" />
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
                <CardTitle>通勤時間と職員満足度・定着玁E/CardTitle>
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
                      <Line type="monotone" dataKey="retention" name="定着玁E stroke="#10B981" strokeWidth={2} />
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
              <CardTitle>施設規模別の特性比輁E/CardTitle>
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
                    <Bar dataKey="diversity" name="痁E��多様性" fill="#3B82F6" />
                    <Bar dataKey="career" name="キャリア機企E fill="#10B981" />
                    <Bar dataKey="pressure" name="業務�EレチE��ャー" fill="#F59E0B" />
                    <Bar dataKey="resource" name="リソース允E��度" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 転勤経験�E影響 */}
          <Card>
            <CardHeader>
              <CardTitle>転勤経験による影響刁E��</CardTitle>
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
                    <Line type="monotone" dataKey="retention" name="定着玁E stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="engagement" name="エンゲージメンチE stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="network" name="ネットワーク庁E��" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 特性一覧 */}
          <Card>
            <CardHeader>
              <CardTitle>立地・施設タイプ別特性と推奨施筁E/CardTitle>
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
                          平坁E��丁E {cohort.avgSalary}丁E�E | 通勤時間: {cohort.avgCommute}刁E| 
                          働き方: {cohort.workStyle}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {cohort.type === '都市部大規模施設' && '専門性向上とキャリア開発支援を強化、E}
                          {cohort.type === '地方施設' && '地域手当�E允E��と研修機会�E確保が重要、E}
                          {cohort.type === '本社勤勁E && 'リモートワーク推進とコミュニケーション活性化、E}
                          {cohort.type === '褁E��施設経験老E && '経験を活かしたメンター役めE��喁E��案老E��して活用、E}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">離職玁E {cohort.turnoverRate}%</p>
                        <p className="text-xs text-gray-500">満足度: {cohort.satisfaction}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* サマリー統訁E*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">都市部職員比率</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(locationCohorts.filter(c => c.type.includes('都币E)).reduce((sum, c) => sum + c.count, 0) / locationCohorts.reduce((sum, c) => sum + c.count, 0) * 100)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">全職員中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">平坁E��勤時間</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(locationCohorts.reduce((sum, c) => sum + c.avgCommute * c.count, 0) / locationCohorts.reduce((sum, c) => sum + c.count, 0))}刁E
                </p>
                <p className="text-sm text-gray-600 mt-1">牁E��平坁E/p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">転勤経験老E/CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {locationCohorts.find(c => c.type === '褁E��施設経験老E)?.count || 0}吁E
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
                title: '地域�E施設特性コホ�Eト�E析レポ�EチE,
                facility: selectedFacility,
                reportType: 'location-cohort',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンローチE
            </button>
          </div>

        </div>
      </div><CategoryTopButton categoryPath="/reports/cohort-analysis" categoryName="コホ�Eト�E极E /></div>
  );
}

export default function LocationCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LocationCohortContent />
    </Suspense>
  );
}