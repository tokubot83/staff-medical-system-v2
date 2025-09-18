'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  Cell
} from 'recharts';

interface LearningCohort {
  pattern: string;
  count: number;
  avgPerformanceGrowth: number;
  careerAdvancement: number;
  retentionRate: number;
  engagementScore: number;
  characteristics: string[];
}

function LearningCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedLearningType, setSelectedLearningType] = useState('all');
  const [selectedCareerStage, setSelectedCareerStage] = useState('all');

  // 学習パターンの定義
  const learningPatterns = [
    '積極皁E��習老E,
    '消極皁E��習老E,
    '賁E��取得重視型',
    'OJT重視型',
    '外部研修活用垁E,
    'メンター活用垁E,
    '自己学習型',
    '無関忁E��'
  ];

  // 学習コホ�Eトデータの生�E
  const learningCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedCareerStage !== 'all') {
        const yearsOfService = new Date().getFullYear() - parseInt(staff.joinDate.match(/\d{4}/)?.[0] || '2020');
        switch (selectedCareerStage) {
          case 'early': if (yearsOfService > 3) return false; break;
          case 'mid': if (yearsOfService < 3 || yearsOfService > 10) return false; break;
        }
      }
      return true;
    });

    // 学習パターン別にコホ�Eトを生�E
    const cohorts: LearningCohort[] = learningPatterns.map(pattern => {
      // パターンに基づぁE��スタチE��を�E類（シミュレーション�E�E
      let patternProbability = 0;
      let avgPerformanceGrowth = 0;
      let careerAdvancement = 0;
      let retentionRate = 0;
      let engagementScore = 0;
      let characteristics: string[] = [];

      switch (pattern) {
        case '積極皁E��習老E:
          patternProbability = 0.15;
          avgPerformanceGrowth = 25;
          careerAdvancement = 80;
          retentionRate = 92;
          engagementScore = 85;
          characteristics = ['研修参加玁E00%', '賁E��取得年1件以丁E, 'メンター制度利用'];
          break;
        case '消極皁E��習老E:
          patternProbability = 0.20;
          avgPerformanceGrowth = 5;
          careerAdvancement = 20;
          retentionRate = 65;
          engagementScore = 45;
          characteristics = ['研修参加玁E0%以丁E, '賁E��取得なぁE, '学習意欲佁E];
          break;
        case '賁E��取得重視型':
          patternProbability = 0.12;
          avgPerformanceGrowth = 20;
          careerAdvancement = 70;
          retentionRate = 88;
          engagementScore = 78;
          characteristics = ['専門賁E��褁E��保有', '賁E��手当受給', 'キャリアアチE�E志向'];
          break;
        case 'OJT重視型':
          patternProbability = 0.18;
          avgPerformanceGrowth = 15;
          careerAdvancement = 50;
          retentionRate = 82;
          engagementScore = 72;
          characteristics = ['実務経験重要E, '現場学習志向', 'チ�Eム学習参加'];
          break;
        case '外部研修活用垁E:
          patternProbability = 0.10;
          avgPerformanceGrowth = 18;
          careerAdvancement = 60;
          retentionRate = 85;
          engagementScore = 75;
          characteristics = ['外部セミナー参加', 'ネットワーク形戁E, '最新知識習征E];
          break;
        case 'メンター活用垁E:
          patternProbability = 0.08;
          avgPerformanceGrowth = 22;
          careerAdvancement = 65;
          retentionRate = 90;
          engagementScore = 82;
          characteristics = ['メンター制度活用', '1on1実施', 'フィードバチE��重要E];
          break;
        case '自己学習型':
          patternProbability = 0.12;
          avgPerformanceGrowth = 17;
          careerAdvancement = 55;
          retentionRate = 80;
          engagementScore = 70;
          characteristics = ['自主皁E��翁E, 'オンライン学習活用', '読書習�E'];
          break;
        case '無関忁E��':
          patternProbability = 0.05;
          avgPerformanceGrowth = 0;
          careerAdvancement = 10;
          retentionRate = 55;
          engagementScore = 35;
          characteristics = ['学習機会回避', '現状維持志向', '成長意欲なぁE];
          break;
      }

      const cohortStaff = staffList.filter(() => Math.random() < patternProbability);
      const count = cohortStaff.length;

      if (count === 0) return null;

      return {
        pattern,
        count,
        avgPerformanceGrowth,
        careerAdvancement,
        retentionRate,
        engagementScore,
        characteristics
      };
    }).filter(Boolean) as LearningCohort[];

    if (selectedLearningType !== 'all') {
      return cohorts.filter(c => c.pattern === selectedLearningType);
    }

    return cohorts;
  }, [selectedFacility, selectedLearningType, selectedCareerStage]);

  // 研修参加パターンチE�Eタ
  const trainingParticipationData = useMemo(() => {
    const months = ['1朁E, '2朁E, '3朁E, '4朁E, '5朁E, '6朁E, '7朁E, '8朁E, '9朁E, '10朁E, '11朁E, '12朁E];
    return months.map(month => ({
      month,
      '積極皁E��習老E: 85 + Math.random() * 10,
      '標準的学習老E: 50 + Math.random() * 15,
      '消極皁E��習老E: 15 + Math.random() * 10
    }));
  }, []);

  // 賁E��取得とキャリア進展�E相関チE�Eタ
  const qualificationCareerData = useMemo(() => {
    return [
      { qualifications: 0, promotion: 10, count: 120 },
      { qualifications: 1, promotion: 25, count: 180 },
      { qualifications: 2, promotion: 45, count: 150 },
      { qualifications: 3, promotion: 65, count: 100 },
      { qualifications: 4, promotion: 80, count: 60 },
      { qualifications: 5, promotion: 90, count: 30 }
    ];
  }, []);

  // レーダーチャート用チE�Eタ
  const radarData = useMemo(() => {
    const metrics = ['成長玁E, 'キャリア進屁E, '定着玁E, 'エンゲージメンチE, '学習投資ROI'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      learningCohorts.forEach(cohort => {
        switch (metric) {
          case '成長玁E: dataPoint[cohort.pattern] = cohort.avgPerformanceGrowth * 4; break;
          case 'キャリア進屁E: dataPoint[cohort.pattern] = cohort.careerAdvancement; break;
          case '定着玁E: dataPoint[cohort.pattern] = cohort.retentionRate; break;
          case 'エンゲージメンチE: dataPoint[cohort.pattern] = cohort.engagementScore; break;
          case '学習投資ROI': dataPoint[cohort.pattern] = (cohort.avgPerformanceGrowth * 3); break;
        }
      });
      return dataPoint;
    });
  }, [learningCohorts]);

  // チE��ーマップ用チE�Eタ�E�学習活動�E刁E��E��E
  const treemapData = useMemo(() => {
    return [
      { name: '忁E��研修', size: 3500, category: 'formal' },
      { name: '選択研修', size: 2800, category: 'formal' },
      { name: '賁E��取征E, size: 2200, category: 'certification' },
      { name: 'OJT', size: 4000, category: 'informal' },
      { name: 'メンタリング', size: 1800, category: 'informal' },
      { name: '自主学翁E, size: 1500, category: 'self' },
      { name: '外部セミナー', size: 1200, category: 'external' },
      { name: 'eラーニング', size: 2000, category: 'digital' }
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
  const TREEMAP_COLORS = {
    formal: '#3B82F6',
    certification: '#10B981',
    informal: '#F59E0B',
    self: '#8B5CF6',
    external: '#EC4899',
    digital: '#14B8A6'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="学習�E成長コホ�Eト�E极E />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">学習�E成長コホ�Eト�E极E/h1>
            <p className="text-gray-600 mt-2">
              研修参加パターン、賁E��取得、メンター制度利用など学習行動別の成長軌跡を�E极E
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
                  学習パターン
                </label>
                <select
                  value={selectedLearningType}
                  onChange={(e) => setSelectedLearningType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全パターン</option>
                  {learningPatterns.map(pattern => (
                    <option key={pattern} value={pattern}>{pattern}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  キャリアスチE�Eジ
                </label>
                <select
                  value={selectedCareerStage}
                  onChange={(e) => setSelectedCareerStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全スチE�Eジ</option>
                  <option value="early">初期�E�、E年�E�E/option>
                  <option value="mid">中期！E、E0年�E�E/option>
                </select>
              </div>
            </div>
          </div>

          {/* 学習パターン別統訁E*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningCohorts.slice(0, 4).map((cohort, index) => (
              <Card key={cohort.pattern}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{cohort.pattern}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">人数</span>
                      <span className="text-lg font-semibold">{cohort.count}吁E/span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">成長玁E/span>
                      <span className={`text-lg font-semibold ${cohort.avgPerformanceGrowth >= 20 ? 'text-green-600' : 'text-amber-600'}`}>
                        +{cohort.avgPerformanceGrowth}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">定着玁E/span>
                      <span className="text-lg font-semibold text-blue-600">{cohort.retentionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 学習パターン別成果比輁E*/}
          <Card>
            <CardHeader>
              <CardTitle>学習パターン別成果持E��E/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={learningCohorts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="pattern" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgPerformanceGrowth" name="成長玁E%)" fill="#3B82F6" />
                    <Bar dataKey="careerAdvancement" name="昁E��玁E%)" fill="#10B981" />
                    <Bar dataKey="retentionRate" name="定着玁E%)" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 研修参加トレンチE*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>月別研修参加玁E��移</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trainingParticipationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="積極皁E��習老E stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="標準的学習老E stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="消極皁E��習老E stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>賁E��取得と昁E��玁E�E相関</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={qualificationCareerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="qualifications" label={{ value: '保有賁E��数', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Bar dataKey="promotion" name="昁E��玁E fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* レーダーチャーチE*/}
          <Card>
            <CardHeader>
              <CardTitle>学習パターン別総合評価</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {learningCohorts.slice(0, 4).map((cohort, index) => (
                      <Radar
                        key={cohort.pattern}
                        name={cohort.pattern}
                        dataKey={cohort.pattern}
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

          {/* 学習活動�E刁E��E*/}
          <Card>
            <CardHeader>
              <CardTitle>学習活動�E刁E��E��時間�Eース�E�E/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={treemapData}
                    dataKey="size"
                    aspectRatio={4/3}
                    stroke="#fff"
                    fill="#8884d8"
                  >
                    {treemapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TREEMAP_COLORS[entry.category as keyof typeof TREEMAP_COLORS]} />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 justify-center">
                {Object.entries(TREEMAP_COLORS).map(([category, color]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
                    <span className="text-sm capitalize">{category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 特性一覧 */}
          <Card>
            <CardHeader>
              <CardTitle>学習パターン別特性</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningCohorts.map((cohort) => (
                  <div key={cohort.pattern} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">{cohort.pattern}</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {cohort.characteristics.map((char, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '学習�E成長コホ�Eト�E析レポ�EチE,
                facility: selectedFacility,
                reportType: 'learning-cohort',
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

export default function LearningCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearningCohortContent />
    </Suspense>
  );
}