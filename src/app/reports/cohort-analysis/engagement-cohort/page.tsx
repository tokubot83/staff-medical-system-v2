'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Cell,
  ComposedChart
} from 'recharts';

interface EngagementCohort {
  type: string;
  count: number;
  avgEngagement: number;
  retentionRate: number;
  performanceScore: number;
  turnoverRisk: number;
  characteristics: string[];
  trend: 'rising' | 'stable' | 'declining';
}

function EngagementCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedEngagementLevel, setSelectedEngagementLevel] = useState('all');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('current');

  // エンゲージメントタイプの定義
  const engagementTypes = [
    '高エンゲージメント維持群',
    'エンゲージメント上昇群',
    'エンゲージメント安定群',
    'エンゲージメント低下群',
    '低エンゲージメント継続群',
    '回復群（一度低下後回復）'
  ];

  // エンゲージメントコホートデータの生成
  const engagementCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      return true;
    });

    // エンゲージメントタイプ別にコホートを生成
    const cohorts: EngagementCohort[] = engagementTypes.map(type => {
      let avgEngagement = 0;
      let retentionRate = 0;
      let performanceScore = 0;
      let turnoverRisk = 0;
      let characteristics: string[] = [];
      let trend: 'rising' | 'stable' | 'declining' = 'stable';

      switch (type) {
        case '高エンゲージメント維持群':
          avgEngagement = 85;
          retentionRate = 95;
          performanceScore = 88;
          turnoverRisk = 5;
          characteristics = ['継続的高評価', '主体的行動', 'チーム貢献度高'];
          trend = 'stable';
          break;
        case 'エンゲージメント上昇群':
          avgEngagement = 75;
          retentionRate = 90;
          performanceScore = 82;
          turnoverRisk = 10;
          characteristics = ['成長実感あり', '新規挑戦活発', '上司との関係良好'];
          trend = 'rising';
          break;
        case 'エンゲージメント安定群':
          avgEngagement = 65;
          retentionRate = 82;
          performanceScore = 72;
          turnoverRisk = 18;
          characteristics = ['安定的業務遂行', '現状維持志向', '中程度の満足度'];
          trend = 'stable';
          break;
        case 'エンゲージメント低下群':
          avgEngagement = 45;
          retentionRate = 65;
          performanceScore = 58;
          turnoverRisk = 35;
          characteristics = ['モチベーション低下', '停滞感', '課題認識あり'];
          trend = 'declining';
          break;
        case '低エンゲージメント継続群':
          avgEngagement = 35;
          retentionRate = 50;
          performanceScore = 45;
          turnoverRisk = 50;
          characteristics = ['慢性的不満', '離職検討中', '改善見込み低'];
          trend = 'stable';
          break;
        case '回復群（一度低下後回復）':
          avgEngagement = 70;
          retentionRate = 88;
          performanceScore = 78;
          turnoverRisk = 12;
          characteristics = ['レジリエンス高', '改善経験あり', '支援効果あり'];
          trend = 'rising';
          break;
      }

      // シミュレーションでスタッフを分類
      const cohortStaff = staffList.filter(staff => {
        const engagement = staff.engagement;
        switch (type) {
          case '高エンゲージメント維持群': return engagement >= 80;
          case 'エンゲージメント上昇群': return engagement >= 70 && engagement < 80;
          case 'エンゲージメント安定群': return engagement >= 60 && engagement < 70;
          case 'エンゲージメント低下群': return engagement >= 40 && engagement < 60;
          case '低エンゲージメント継続群': return engagement < 40;
          case '回復群（一度低下後回復）': return engagement >= 65 && engagement < 75 && Math.random() < 0.3;
          default: return false;
        }
      });

      const count = cohortStaff.length;

      if (count === 0) return null;

      return {
        type,
        count,
        avgEngagement,
        retentionRate,
        performanceScore,
        turnoverRisk,
        characteristics,
        trend
      };
    }).filter(Boolean) as EngagementCohort[];

    if (selectedEngagementLevel !== 'all') {
      return cohorts.filter(c => c.type === selectedEngagementLevel);
    }

    return cohorts;
  }, [selectedFacility, selectedEngagementLevel]);

  // エンゲージメント推移データ（時系列）
  const engagementTrendData = useMemo(() => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return months.map((month, index) => ({
      month,
      '高エンゲージメント維持群': 85 + Math.sin(index * 0.5) * 3,
      'エンゲージメント上昇群': 65 + index * 1.5,
      'エンゲージメント低下群': 65 - index * 1.2,
      '回復群': 45 + (index > 6 ? (index - 6) * 5 : 0)
    }));
  }, []);

  // エンゲージメントドライバー分析
  const engagementDrivers = useMemo(() => {
    return [
      { driver: '成長機会', impact: 85, correlation: 0.82 },
      { driver: '上司との関係', impact: 78, correlation: 0.75 },
      { driver: '仕事の意義', impact: 82, correlation: 0.78 },
      { driver: 'ワークライフバランス', impact: 75, correlation: 0.68 },
      { driver: '評価・承認', impact: 72, correlation: 0.65 },
      { driver: '職場環境', impact: 68, correlation: 0.62 },
      { driver: '報酬・福利厚生', impact: 65, correlation: 0.58 }
    ];
  }, []);

  // 散布図用データ（エンゲージメントとパフォーマンスの相関）
  const scatterData = useMemo(() => {
    return Object.values(staffDatabase).map(staff => ({
      x: staff.engagement,
      y: staff.evaluationData?.rating || staff.evaluationHistory?.[0]?.performance || 3.5,
      z: staff.age,
      name: staff.name
    }));
  }, []);

  // 危機的事象の影響データ
  const criticalEventImpact = useMemo(() => {
    const events = [
      '組織変更前',
      '組織変更後1ヶ月',
      '組織変更後3ヶ月',
      '組織変更後6ヶ月',
      '組織変更後12ヶ月'
    ];
    return events.map((event, index) => ({
      event,
      '全体平均': 70 - (index === 1 ? 15 : index === 2 ? 10 : index === 3 ? 5 : 0),
      '高レジリエンス群': 80 - (index === 1 ? 8 : index === 2 ? 5 : index === 3 ? 2 : 0),
      '低レジリエンス群': 60 - (index === 1 ? 20 : index === 2 ? 15 : index === 3 ? 10 : index === 4 ? 5 : 0)
    }));
  }, []);

  // 施設リストを取得
  const facilities = useMemo(() => {
    const facilitySet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      facilitySet.add(staff.facility);
    });
    return ['全施設', ...Array.from(facilitySet).sort()];
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">エンゲージメントコホート分析</h1>
            <p className="text-gray-600 mt-2">
              エンゲージメント推移パターン別に職員を分類し、定着・パフォーマンスへの影響を分析
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
                  エンゲージメントレベル
                </label>
                <select
                  value={selectedEngagementLevel}
                  onChange={(e) => setSelectedEngagementLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全レベル</option>
                  {engagementTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  表示期間
                </label>
                <select
                  value={selectedTimeFrame}
                  onChange={(e) => setSelectedTimeFrame(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="current">現在</option>
                  <option value="6months">過去6ヶ月</option>
                  <option value="1year">過去1年</option>
                  <option value="3years">過去3年</option>
                </select>
              </div>
            </div>
          </div>

          {/* エンゲージメントコホート概要 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engagementCohorts.map((cohort, index) => (
              <Card key={cohort.type}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{cohort.type}</span>
                    {cohort.trend === 'rising' && <span className="text-green-500">↑</span>}
                    {cohort.trend === 'declining' && <span className="text-red-500">↓</span>}
                    {cohort.trend === 'stable' && <span className="text-gray-500">→</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">人数</span>
                      <span className="text-lg font-semibold">{cohort.count}名</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">エンゲージメント</span>
                      <span className={`text-lg font-semibold ${cohort.avgEngagement >= 70 ? 'text-green-600' : cohort.avgEngagement >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cohort.avgEngagement}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">離職リスク</span>
                      <span className={`text-lg font-semibold ${cohort.turnoverRisk <= 20 ? 'text-green-600' : cohort.turnoverRisk <= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cohort.turnoverRisk}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* エンゲージメント推移 */}
          <Card>
            <CardHeader>
              <CardTitle>エンゲージメントタイプ別推移</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="高エンゲージメント維持群" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="エンゲージメント上昇群" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="エンゲージメント低下群" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="回復群" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* エンゲージメントドライバー分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>エンゲージメントドライバーの影響度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementDrivers} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="driver" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="impact" name="影響度" fill="#3B82F6">
                        {engagementDrivers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.impact >= 80 ? '#10B981' : entry.impact >= 70 ? '#3B82F6' : '#F59E0B'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>エンゲージメント vs パフォーマンス</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="x" 
                        domain={[0, 100]} 
                        label={{ value: 'エンゲージメント(%)', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        dataKey="y" 
                        domain={[0, 5]}
                        label={{ value: 'パフォーマンス評価', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="職員" data={scatterData} fill="#3B82F6">
                        {scatterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.x >= 70 ? '#10B981' : entry.x >= 50 ? '#F59E0B' : '#EF4444'} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 危機的事象の影響 */}
          <Card>
            <CardHeader>
              <CardTitle>組織変更等の危機的事象によるエンゲージメント変化</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={criticalEventImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="event" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Area type="monotone" dataKey="全体平均" fill="#3B82F6" fillOpacity={0.3} stroke="#3B82F6" />
                    <Line type="monotone" dataKey="高レジリエンス群" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="低レジリエンス群" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* コホート別特性 */}
          <Card>
            <CardHeader>
              <CardTitle>エンゲージメントコホート別特性</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementCohorts.map((cohort) => (
                  <div key={cohort.type} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {cohort.type}
                          {cohort.trend === 'rising' && <span className="text-green-500 text-sm">↑上昇中</span>}
                          {cohort.trend === 'declining' && <span className="text-red-500 text-sm">↓低下中</span>}
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {cohort.characteristics.map((char, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">定着率: {cohort.retentionRate}%</p>
                        <p className="text-xs text-gray-500">パフォーマンス: {cohort.performanceScore}点</p>
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
                <CardTitle className="text-base">高エンゲージメント率</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(engagementCohorts.filter(c => c.avgEngagement >= 70).reduce((sum, c) => sum + c.count, 0) / engagementCohorts.reduce((sum, c) => sum + c.count, 0) * 100)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">70%以上の職員割合</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">改善傾向職員</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {engagementCohorts.filter(c => c.trend === 'rising').reduce((sum, c) => sum + c.count, 0)}名
                </p>
                <p className="text-sm text-gray-600 mt-1">エンゲージメント上昇中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">要注意職員</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {engagementCohorts.filter(c => c.turnoverRisk >= 35).reduce((sum, c) => sum + c.count, 0)}名
                </p>
                <p className="text-sm text-gray-600 mt-1">離職リスク35%以上</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">回復成功率</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">72%</p>
                <p className="text-sm text-gray-600 mt-1">支援による改善率</p>
              </CardContent>
            </Card>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: 'エンゲージメントコホート分析レポート',
                facility: selectedFacility,
                reportType: 'engagement-cohort',
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

export default function EngagementCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EngagementCohortContent />
    </Suspense>
  );
}