'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  ComposedChart,
  Cell
} from 'recharts';

interface WellbeingCohort {
  type: string;
  count: number;
  healthScore: number;
  mentalHealthScore: number;
  workLifeBalance: number;
  stressLevel: number;
  retentionRate: number;
  productivityScore: number;
  riskFactors: string[];
}

function WellbeingCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedWellbeingType, setSelectedWellbeingType] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');

  // ウェルビーイングタイプの定義
  const wellbeingTypes = [
    '健康優良群',
    '健康リスク群',
    'メンタルヘルス良好群',
    'メンタルヘルス要注意群',
    'ワークライフバランス充実群',
    '燃え尽き症候群リスク群',
    'レジリエンス高群',
    '総合的要支援群'
  ];

  // ウェルビーイングコホートデータの生成
  const wellbeingCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedRiskLevel !== 'all') {
        const stressIndex = staff.stressIndex;
        switch (selectedRiskLevel) {
          case 'low': if (stressIndex > 30) return false; break;
          case 'medium': if (stressIndex <= 30 || stressIndex > 60) return false; break;
          case 'high': if (stressIndex <= 60) return false; break;
        }
      }
      return true;
    });

    // ウェルビーイングタイプ別にコホートを生成
    const cohorts: WellbeingCohort[] = wellbeingTypes.map(type => {
      let healthScore = 0;
      let mentalHealthScore = 0;
      let workLifeBalance = 0;
      let stressLevel = 0;
      let retentionRate = 0;
      let productivityScore = 0;
      let riskFactors: string[] = [];

      switch (type) {
        case '健康優良群':
          healthScore = 90;
          mentalHealthScore = 85;
          workLifeBalance = 82;
          stressLevel = 20;
          retentionRate = 95;
          productivityScore = 88;
          riskFactors = ['特になし'];
          break;
        case '健康リスク群':
          healthScore = 45;
          mentalHealthScore = 60;
          workLifeBalance = 55;
          stressLevel = 65;
          retentionRate = 70;
          productivityScore = 65;
          riskFactors = ['生活習慣病リスク', '運動不足', '食生活の乱れ'];
          break;
        case 'メンタルヘルス良好群':
          healthScore = 75;
          mentalHealthScore = 90;
          workLifeBalance = 85;
          stressLevel = 25;
          retentionRate = 92;
          productivityScore = 85;
          riskFactors = ['軽度の身体的疲労'];
          break;
        case 'メンタルヘルス要注意群':
          healthScore = 65;
          mentalHealthScore = 40;
          workLifeBalance = 45;
          stressLevel = 75;
          retentionRate = 60;
          productivityScore = 55;
          riskFactors = ['高ストレス', '睡眠不足', '不安傾向'];
          break;
        case 'ワークライフバランス充実群':
          healthScore = 80;
          mentalHealthScore = 82;
          workLifeBalance = 92;
          stressLevel = 30;
          retentionRate = 90;
          productivityScore = 82;
          riskFactors = ['特になし'];
          break;
        case '燃え尽き症候群リスク群':
          healthScore = 55;
          mentalHealthScore = 35;
          workLifeBalance = 30;
          stressLevel = 85;
          retentionRate = 45;
          productivityScore = 40;
          riskFactors = ['慢性疲労', '意欲低下', '感情的消耗'];
          break;
        case 'レジリエンス高群':
          healthScore = 78;
          mentalHealthScore = 88;
          workLifeBalance = 75;
          stressLevel = 35;
          retentionRate = 88;
          productivityScore = 90;
          riskFactors = ['一時的ストレス'];
          break;
        case '総合的要支援群':
          healthScore = 50;
          mentalHealthScore = 45;
          workLifeBalance = 40;
          stressLevel = 70;
          retentionRate = 55;
          productivityScore = 50;
          riskFactors = ['複合的健康リスク', '支援体制不足', '孤立傾向'];
          break;
      }

      // シミュレーションでスタッフを分類
      const cohortStaff = staffList.filter(staff => {
        const stress = staff.stressIndex;
        const workLife = 100 - staff.overtime * 2;
        switch (type) {
          case '健康優良群': return stress < 30 && workLife > 70;
          case '健康リスク群': return stress > 50 && workLife < 50;
          case 'メンタルヘルス良好群': return stress < 25;
          case 'メンタルヘルス要注意群': return stress > 70;
          case 'ワークライフバランス充実群': return workLife > 80;
          case '燃え尽き症候群リスク群': return stress > 80 && workLife < 30;
          case 'レジリエンス高群': return stress < 40 && Math.random() < 0.2;
          case '総合的要支援群': return stress > 60 && workLife < 40;
          default: return false;
        }
      });

      const count = cohortStaff.length;

      if (count === 0) return null;

      return {
        type,
        count,
        healthScore,
        mentalHealthScore,
        workLifeBalance,
        stressLevel,
        retentionRate,
        productivityScore,
        riskFactors
      };
    }).filter(Boolean) as WellbeingCohort[];

    if (selectedWellbeingType !== 'all') {
      return cohorts.filter(c => c.type === selectedWellbeingType);
    }

    return cohorts;
  }, [selectedFacility, selectedWellbeingType, selectedRiskLevel]);

  // ストレスレベルの推移データ
  const stressTrendData = useMemo(() => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return months.map((month, index) => ({
      month,
      '全体平均': 45 + Math.sin(index * 0.5) * 10,
      '健康優良群': 20 + Math.sin(index * 0.3) * 5,
      'リスク群': 70 + Math.sin(index * 0.7) * 15,
      '要支援群': 80 + Math.sin(index * 0.4) * 10
    }));
  }, []);

  // 健康指標の相関データ
  const healthCorrelationData = useMemo(() => {
    return [
      { indicator: '睡眠時間', wellbeing: 85, performance: 82, retention: 90 },
      { indicator: '運動習慣', wellbeing: 78, performance: 75, retention: 85 },
      { indicator: '食生活', wellbeing: 72, performance: 70, retention: 80 },
      { indicator: '休暇取得', wellbeing: 88, performance: 85, retention: 92 },
      { indicator: '人間関係', wellbeing: 90, performance: 88, retention: 95 },
      { indicator: 'ストレス管理', wellbeing: 82, performance: 80, retention: 88 }
    ];
  }, []);

  // レーダーチャート用データ
  const radarData = useMemo(() => {
    const metrics = ['健康度', 'メンタルヘルス', 'WLB', '低ストレス', '生産性'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      wellbeingCohorts.slice(0, 4).forEach(cohort => {
        switch (metric) {
          case '健康度': dataPoint[cohort.type] = cohort.healthScore; break;
          case 'メンタルヘルス': dataPoint[cohort.type] = cohort.mentalHealthScore; break;
          case 'WLB': dataPoint[cohort.type] = cohort.workLifeBalance; break;
          case '低ストレス': dataPoint[cohort.type] = 100 - cohort.stressLevel; break;
          case '生産性': dataPoint[cohort.type] = cohort.productivityScore; break;
        }
      });
      return dataPoint;
    });
  }, [wellbeingCohorts]);

  // 介入プログラムの効果データ
  const interventionEffectData = useMemo(() => {
    return [
      { program: 'ストレス管理研修', before: 65, after: 45, improvement: 20 },
      { program: 'フレックスタイム導入', before: 55, after: 35, improvement: 20 },
      { program: '健康増進プログラム', before: 60, after: 42, improvement: 18 },
      { program: 'メンタルヘルス相談', before: 70, after: 50, improvement: 20 },
      { program: 'チームビルディング', before: 58, after: 40, improvement: 18 },
      { program: '在宅勤務制度', before: 62, after: 38, improvement: 24 }
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

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">ウェルビーイングコホート分析</h1>
            <p className="text-gray-600 mt-2">
              健康状態・メンタルヘルス・ワークライフバランスに基づく職員の分類と分析
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
                  ウェルビーイングタイプ
                </label>
                <select
                  value={selectedWellbeingType}
                  onChange={(e) => setSelectedWellbeingType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全タイプ</option>
                  {wellbeingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  リスクレベル
                </label>
                <select
                  value={selectedRiskLevel}
                  onChange={(e) => setSelectedRiskLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全レベル</option>
                  <option value="low">低リスク</option>
                  <option value="medium">中リスク</option>
                  <option value="high">高リスク</option>
                </select>
              </div>
            </div>
          </div>

          {/* ウェルビーイングコホート概要 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wellbeingCohorts.slice(0, 4).map((cohort, index) => (
              <Card key={cohort.type}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{cohort.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">人数</span>
                      <span className="text-lg font-semibold">{cohort.count}名</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">健康スコア</span>
                      <span className={`text-lg font-semibold ${cohort.healthScore >= 70 ? 'text-green-600' : cohort.healthScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cohort.healthScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ストレス</span>
                      <span className={`text-lg font-semibold ${cohort.stressLevel <= 30 ? 'text-green-600' : cohort.stressLevel <= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cohort.stressLevel}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ウェルビーイング指標比較 */}
          <Card>
            <CardHeader>
              <CardTitle>ウェルビーイングタイプ別指標比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wellbeingCohorts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="healthScore" name="健康度" fill="#10B981" />
                    <Bar dataKey="mentalHealthScore" name="メンタルヘルス" fill="#3B82F6" />
                    <Bar dataKey="workLifeBalance" name="WLB" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* ストレスレベル推移 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ストレスレベルの年間推移</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stressTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Area type="monotone" dataKey="要支援群" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="リスク群" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="全体平均" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="健康優良群" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ウェルビーイング総合評価</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {wellbeingCohorts.slice(0, 3).map((cohort, index) => (
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

          {/* 健康指標と成果の相関 */}
          <Card>
            <CardHeader>
              <CardTitle>健康関連指標とビジネス成果の相関</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={healthCorrelationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="indicator" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="wellbeing" name="ウェルビーイング" fill="#10B981" />
                    <Line type="monotone" dataKey="performance" name="パフォーマンス" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="retention" name="定着率" stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 介入プログラム効果 */}
          <Card>
            <CardHeader>
              <CardTitle>ウェルビーイング改善プログラムの効果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interventionEffectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="program" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 80]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="before" name="実施前ストレス" fill="#EF4444" />
                    <Bar dataKey="after" name="実施後ストレス" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* リスク要因一覧 */}
          <Card>
            <CardHeader>
              <CardTitle>ウェルビーイングコホート別リスク要因と対策</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wellbeingCohorts.map((cohort) => (
                  <div key={cohort.type} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{cohort.type}</h4>
                        <div className="mt-2">
                          <span className="text-sm font-medium">リスク要因：</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {cohort.riskFactors.map((risk, index) => (
                              <span key={index} className={`text-xs px-2 py-1 rounded ${
                                risk === '特になし' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {risk}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {cohort.type === '健康優良群' && '現状維持と他職員への好影響波及を促進。'}
                          {cohort.type === '健康リスク群' && '生活習慣改善プログラムと健康相談の実施。'}
                          {cohort.type === 'メンタルヘルス要注意群' && '専門カウンセリングと業務負荷の調整。'}
                          {cohort.type === '燃え尽き症候群リスク群' && '長期休暇取得と役割の見直し、キャリア相談。'}
                          {cohort.type === '総合的要支援群' && '包括的支援プログラムと個別フォローアップ。'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">定着率: {cohort.retentionRate}%</p>
                        <p className="text-xs text-gray-500">生産性: {cohort.productivityScore}点</p>
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
                <CardTitle className="text-base">健康優良職員率</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(wellbeingCohorts.filter(c => c.healthScore >= 80).reduce((sum, c) => sum + c.count, 0) / wellbeingCohorts.reduce((sum, c) => sum + c.count, 0) * 100)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">健康スコア80以上</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">高ストレス者</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {wellbeingCohorts.filter(c => c.stressLevel >= 70).reduce((sum, c) => sum + c.count, 0)}名
                </p>
                <p className="text-sm text-gray-600 mt-1">要介入対象</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">平均WLBスコア</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(wellbeingCohorts.reduce((sum, c) => sum + c.workLifeBalance * c.count, 0) / wellbeingCohorts.reduce((sum, c) => sum + c.count, 0))}
                </p>
                <p className="text-sm text-gray-600 mt-1">100点満点</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">改善可能性</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">68%</p>
                <p className="text-sm text-gray-600 mt-1">介入による改善見込み</p>
              </CardContent>
            </Card>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: 'ウェルビーイングコホート分析レポート',
                facility: selectedFacility,
                reportType: 'wellbeing-cohort',
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

export default function WellbeingCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WellbeingCohortContent />
    </Suspense>
  );
}