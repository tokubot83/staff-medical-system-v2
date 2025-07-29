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
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';

interface PerformanceCohort {
  level: string;
  count: number;
  avgRetention: number;
  promotionRate: number;
  avgEngagement: number;
  avgSalary: number;
  turnoverRate: number;
  skillDevelopment: number;
}

function PerformanceCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedDepartment, setSelectedDepartment] = useState('全部署');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('current');

  // パフォーマンスレベルの定義
  const performanceLevels = ['トップパフォーマー', 'ハイパフォーマー', 'スタンダード', 'ニーズ改善'];

  // スタッフデータからパフォーマンスコホートを生成
  const performanceCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedDepartment !== '全部署' && staff.department !== selectedDepartment) return false;
      return true;
    });

    // パフォーマンスレベルごとにグループ化
    const cohortGroups = performanceLevels.map(level => {
      let cohortStaff = staffList.filter(staff => {
        const rating = staff.evaluationData?.rating || staff.evaluationHistory?.[0]?.performance || 3.5;
        switch (level) {
          case 'トップパフォーマー': return rating >= 4.5;
          case 'ハイパフォーマー': return rating >= 3.8 && rating < 4.5;
          case 'スタンダード': return rating >= 3.0 && rating < 3.8;
          case 'ニーズ改善': return rating < 3.0;
          default: return false;
        }
      });

      const count = cohortStaff.length;
      if (count === 0) return null;

      // 各指標の計算
      const avgRetention = cohortStaff.filter(s => !s.assignmentHistory?.some(h => h.reason === '退職')).length / count * 100;
      const promotionRate = cohortStaff.filter(s => s.assignmentHistory?.some(h => h.reason === '昇進')).length / count * 100;
      const avgEngagement = cohortStaff.reduce((sum, s) => sum + s.engagement, 0) / count;
      // Salary is calculated based on performance level (simulation)
      const avgSalary = level === 'トップパフォーマー' ? 500 : 
                       level === 'ハイパフォーマー' ? 450 : 
                       level === 'スタンダード' ? 400 : 350;
      const turnoverRate = 100 - avgRetention;
      const skillDevelopment = cohortStaff.reduce((sum, s) => {
        const skills = s.skills?.length || 0;
        return sum + (skills > 0 ? 1 : 0);
      }, 0) / count * 100;

      return {
        level,
        count,
        avgRetention: Math.round(avgRetention),
        promotionRate: Math.round(promotionRate),
        avgEngagement: Math.round(avgEngagement),
        avgSalary: Math.round(avgSalary / 10000),
        turnoverRate: Math.round(turnoverRate),
        skillDevelopment: Math.round(skillDevelopment)
      };
    }).filter(Boolean) as PerformanceCohort[];

    return cohortGroups;
  }, [selectedFacility, selectedDepartment]);

  // 成長軌跡データ（時系列でのパフォーマンス変化）
  const growthTrajectoryData = useMemo(() => {
    const years = ['1年目', '2年目', '3年目', '5年目', '10年目'];
    return years.map((year, index) => ({
      year,
      'トップパフォーマー': 4.5 + index * 0.1,
      'ハイパフォーマー': 3.8 + index * 0.15,
      'スタンダード': 3.0 + index * 0.1,
      'ニーズ改善': 2.5 + index * 0.2
    }));
  }, []);

  // レーダーチャート用データ（パフォーマンスレベル別特性）
  const radarData = useMemo(() => {
    const metrics = ['定着率', '昇進率', 'エンゲージメント', 'スキル開発', '給与水準'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      performanceCohorts.forEach(cohort => {
        switch (metric) {
          case '定着率': dataPoint[cohort.level] = cohort.avgRetention; break;
          case '昇進率': dataPoint[cohort.level] = cohort.promotionRate; break;
          case 'エンゲージメント': dataPoint[cohort.level] = cohort.avgEngagement; break;
          case 'スキル開発': dataPoint[cohort.level] = cohort.skillDevelopment; break;
          case '給与水準': dataPoint[cohort.level] = cohort.avgSalary / 5; break;
        }
      });
      return dataPoint;
    });
  }, [performanceCohorts]);

  // 散布図用データ（パフォーマンスとエンゲージメントの相関）
  const scatterData = useMemo(() => {
    return Object.values(staffDatabase).map(staff => {
      const performance = staff.evaluationData?.rating || staff.evaluationHistory?.[0]?.performance || 3.5;
      return {
        x: performance,
        y: staff.engagement,
        z: staff.stressIndex,
        name: staff.name
      };
    });
  }, []);

  // 施設リストを取得
  const facilities = useMemo(() => {
    const facilitySet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      facilitySet.add(staff.facility);
    });
    return ['全施設', ...Array.from(facilitySet).sort()];
  }, []);

  // 部署リストを取得
  const departments = useMemo(() => {
    const departmentSet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      departmentSet.add(staff.department);
    });
    return ['全部署', ...Array.from(departmentSet).sort()];
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="パフォーマンスコホート分析" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">パフォーマンスコホート分析</h1>
            <p className="text-gray-600 mt-2">
              パフォーマンスレベル別に職員を分類し、各群の特性・成長軌跡・定着率を分析
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
                  部署
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(department => (
                    <option key={department} value={department}>{department}</option>
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
                  <option value="yearly">年次推移</option>
                  <option value="historical">過去比較</option>
                </select>
              </div>
            </div>
          </div>

          {/* パフォーマンスレベル別統計 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceCohorts.map((cohort, index) => (
              <Card key={cohort.level}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{cohort.level}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">人数</span>
                      <span className="text-lg font-semibold">{cohort.count}名</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">定着率</span>
                      <span className={`text-lg font-semibold ${cohort.avgRetention >= 80 ? 'text-green-600' : 'text-amber-600'}`}>
                        {cohort.avgRetention}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">昇進率</span>
                      <span className="text-lg font-semibold text-blue-600">{cohort.promotionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* パフォーマンスレベル別比較 */}
          <Card>
            <CardHeader>
              <CardTitle>パフォーマンスレベル別指標比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceCohorts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgRetention" name="定着率(%)" fill="#3B82F6" />
                    <Bar dataKey="avgEngagement" name="エンゲージメント(%)" fill="#10B981" />
                    <Bar dataKey="promotionRate" name="昇進率(%)" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 成長軌跡分析 */}
          <Card>
            <CardHeader>
              <CardTitle>パフォーマンスレベル別成長軌跡</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthTrajectoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                    <Tooltip />
                    <Legend />
                    {performanceLevels.map((level, index) => (
                      <Line
                        key={level}
                        type="monotone"
                        dataKey={level}
                        stroke={COLORS[index]}
                        strokeWidth={2}
                        dot={{ fill: COLORS[index], r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* レーダーチャート */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>パフォーマンスレベル別特性</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {performanceCohorts.map((cohort, index) => (
                        <Radar
                          key={cohort.level}
                          name={cohort.level}
                          dataKey={cohort.level}
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

            {/* 散布図 */}
            <Card>
              <CardHeader>
                <CardTitle>パフォーマンス vs エンゲージメント</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="x" 
                        domain={[0, 5]} 
                        label={{ value: 'パフォーマンス評価', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        dataKey="y" 
                        domain={[0, 100]}
                        label={{ value: 'エンゲージメント', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="職員" data={scatterData} fill="#3B82F6">
                        {scatterData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.x >= 4.5 ? '#3B82F6' : entry.x >= 3.8 ? '#10B981' : entry.x >= 3.0 ? '#F59E0B' : '#EF4444'} 
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* インサイト */}
          <Card>
            <CardHeader>
              <CardTitle>主要インサイト</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">トップパフォーマーの特徴</p>
                    <p className="text-sm text-gray-600">
                      定着率が平均より20%高く、エンゲージメントも高水準を維持。
                      継続的なスキル開発と昇進機会の提供が重要。
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">成長可能性の高い層</p>
                    <p className="text-sm text-gray-600">
                      スタンダードパフォーマーの30%は、適切な支援により
                      ハイパフォーマーへの成長が期待できる。
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">改善が必要な領域</p>
                    <p className="text-sm text-gray-600">
                      ニーズ改善群の離職率が高く、早期の介入と個別支援プログラムの
                      実施が推奨される。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: 'パフォーマンスコホート分析レポート',
                facility: selectedFacility,
                reportType: 'performance-cohort',
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

export default function PerformanceCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PerformanceCohortContent />
    </Suspense>
  );
}