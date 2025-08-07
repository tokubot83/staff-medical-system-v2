'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';
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
    '積極的学習者',
    '消極的学習者',
    '資格取得重視型',
    'OJT重視型',
    '外部研修活用型',
    'メンター活用型',
    '自己学習型',
    '無関心型'
  ];

  // 学習コホートデータの生成
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

    // 学習パターン別にコホートを生成
    const cohorts: LearningCohort[] = learningPatterns.map(pattern => {
      // パターンに基づいてスタッフを分類（シミュレーション）
      let patternProbability = 0;
      let avgPerformanceGrowth = 0;
      let careerAdvancement = 0;
      let retentionRate = 0;
      let engagementScore = 0;
      let characteristics: string[] = [];

      switch (pattern) {
        case '積極的学習者':
          patternProbability = 0.15;
          avgPerformanceGrowth = 25;
          careerAdvancement = 80;
          retentionRate = 92;
          engagementScore = 85;
          characteristics = ['研修参加率100%', '資格取得年1件以上', 'メンター制度利用'];
          break;
        case '消極的学習者':
          patternProbability = 0.20;
          avgPerformanceGrowth = 5;
          careerAdvancement = 20;
          retentionRate = 65;
          engagementScore = 45;
          characteristics = ['研修参加率20%以下', '資格取得なし', '学習意欲低'];
          break;
        case '資格取得重視型':
          patternProbability = 0.12;
          avgPerformanceGrowth = 20;
          careerAdvancement = 70;
          retentionRate = 88;
          engagementScore = 78;
          characteristics = ['専門資格複数保有', '資格手当受給', 'キャリアアップ志向'];
          break;
        case 'OJT重視型':
          patternProbability = 0.18;
          avgPerformanceGrowth = 15;
          careerAdvancement = 50;
          retentionRate = 82;
          engagementScore = 72;
          characteristics = ['実務経験重視', '現場学習志向', 'チーム学習参加'];
          break;
        case '外部研修活用型':
          patternProbability = 0.10;
          avgPerformanceGrowth = 18;
          careerAdvancement = 60;
          retentionRate = 85;
          engagementScore = 75;
          characteristics = ['外部セミナー参加', 'ネットワーク形成', '最新知識習得'];
          break;
        case 'メンター活用型':
          patternProbability = 0.08;
          avgPerformanceGrowth = 22;
          careerAdvancement = 65;
          retentionRate = 90;
          engagementScore = 82;
          characteristics = ['メンター制度活用', '1on1実施', 'フィードバック重視'];
          break;
        case '自己学習型':
          patternProbability = 0.12;
          avgPerformanceGrowth = 17;
          careerAdvancement = 55;
          retentionRate = 80;
          engagementScore = 70;
          characteristics = ['自主的学習', 'オンライン学習活用', '読書習慣'];
          break;
        case '無関心型':
          patternProbability = 0.05;
          avgPerformanceGrowth = 0;
          careerAdvancement = 10;
          retentionRate = 55;
          engagementScore = 35;
          characteristics = ['学習機会回避', '現状維持志向', '成長意欲なし'];
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

  // 研修参加パターンデータ
  const trainingParticipationData = useMemo(() => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return months.map(month => ({
      month,
      '積極的学習者': 85 + Math.random() * 10,
      '標準的学習者': 50 + Math.random() * 15,
      '消極的学習者': 15 + Math.random() * 10
    }));
  }, []);

  // 資格取得とキャリア進展の相関データ
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

  // レーダーチャート用データ
  const radarData = useMemo(() => {
    const metrics = ['成長率', 'キャリア進展', '定着率', 'エンゲージメント', '学習投資ROI'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      learningCohorts.forEach(cohort => {
        switch (metric) {
          case '成長率': dataPoint[cohort.pattern] = cohort.avgPerformanceGrowth * 4; break;
          case 'キャリア進展': dataPoint[cohort.pattern] = cohort.careerAdvancement; break;
          case '定着率': dataPoint[cohort.pattern] = cohort.retentionRate; break;
          case 'エンゲージメント': dataPoint[cohort.pattern] = cohort.engagementScore; break;
          case '学習投資ROI': dataPoint[cohort.pattern] = (cohort.avgPerformanceGrowth * 3); break;
        }
      });
      return dataPoint;
    });
  }, [learningCohorts]);

  // ツリーマップ用データ（学習活動の分布）
  const treemapData = useMemo(() => {
    return [
      { name: '必須研修', size: 3500, category: 'formal' },
      { name: '選択研修', size: 2800, category: 'formal' },
      { name: '資格取得', size: 2200, category: 'certification' },
      { name: 'OJT', size: 4000, category: 'informal' },
      { name: 'メンタリング', size: 1800, category: 'informal' },
      { name: '自主学習', size: 1500, category: 'self' },
      { name: '外部セミナー', size: 1200, category: 'external' },
      { name: 'eラーニング', size: 2000, category: 'digital' }
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
      <CommonHeader title="学習・成長コホート分析" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">学習・成長コホート分析</h1>
            <p className="text-gray-600 mt-2">
              研修参加パターン、資格取得、メンター制度利用など学習行動別の成長軌跡を分析
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
                  キャリアステージ
                </label>
                <select
                  value={selectedCareerStage}
                  onChange={(e) => setSelectedCareerStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全ステージ</option>
                  <option value="early">初期（〜3年）</option>
                  <option value="mid">中期（3〜10年）</option>
                </select>
              </div>
            </div>
          </div>

          {/* 学習パターン別統計 */}
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
                      <span className="text-lg font-semibold">{cohort.count}名</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">成長率</span>
                      <span className={`text-lg font-semibold ${cohort.avgPerformanceGrowth >= 20 ? 'text-green-600' : 'text-amber-600'}`}>
                        +{cohort.avgPerformanceGrowth}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">定着率</span>
                      <span className="text-lg font-semibold text-blue-600">{cohort.retentionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 学習パターン別成果比較 */}
          <Card>
            <CardHeader>
              <CardTitle>学習パターン別成果指標</CardTitle>
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
                    <Bar dataKey="avgPerformanceGrowth" name="成長率(%)" fill="#3B82F6" />
                    <Bar dataKey="careerAdvancement" name="昇進率(%)" fill="#10B981" />
                    <Bar dataKey="retentionRate" name="定着率(%)" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 研修参加トレンド */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>月別研修参加率推移</CardTitle>
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
                      <Line type="monotone" dataKey="積極的学習者" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="標準的学習者" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="消極的学習者" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>資格取得と昇進率の相関</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={qualificationCareerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="qualifications" label={{ value: '保有資格数', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Bar dataKey="promotion" name="昇進率" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* レーダーチャート */}
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

          {/* 学習活動の分布 */}
          <Card>
            <CardHeader>
              <CardTitle>学習活動の分布（時間ベース）</CardTitle>
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
                title: '学習・成長コホート分析レポート',
                facility: selectedFacility,
                reportType: 'learning-cohort',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンロード
            </button>
          </div>

        </div>
      </div>
      
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/cohort-analysis" categoryName="コホート分析" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function LearningCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearningCohortContent />
    </Suspense>
  );
}