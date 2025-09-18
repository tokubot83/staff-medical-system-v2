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
  const performanceLevels = ['トップパフォーマ�E', 'ハイパフォーマ�E', 'スタンダーチE, 'ニ�Eズ改喁E];

  // スタチE��チE�Eタからパフォーマンスコホ�Eトを生�E
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
          case 'トップパフォーマ�E': return rating >= 4.5;
          case 'ハイパフォーマ�E': return rating >= 3.8 && rating < 4.5;
          case 'スタンダーチE: return rating >= 3.0 && rating < 3.8;
          case 'ニ�Eズ改喁E: return rating < 3.0;
          default: return false;
        }
      });

      const count = cohortStaff.length;
      if (count === 0) return null;

      // 吁E��標�E計箁E
      const avgRetention = cohortStaff.filter(s => !s.assignmentHistory?.some(h => h.reason === '退職')).length / count * 100;
      const promotionRate = cohortStaff.filter(s => s.assignmentHistory?.some(h => h.reason === '昁E��')).length / count * 100;
      const avgEngagement = cohortStaff.reduce((sum, s) => sum + s.engagement, 0) / count;
      // Salary is calculated based on performance level (simulation)
      const avgSalary = level === 'トップパフォーマ�E' ? 500 : 
                       level === 'ハイパフォーマ�E' ? 450 : 
                       level === 'スタンダーチE ? 400 : 350;
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

  // 成長軌跡チE�Eタ�E�時系列でのパフォーマンス変化�E�E
  const growthTrajectoryData = useMemo(() => {
    const years = ['1年目', '2年目', '3年目', '5年目', '10年目'];
    return years.map((year, index) => ({
      year,
      'トップパフォーマ�E': 4.5 + index * 0.1,
      'ハイパフォーマ�E': 3.8 + index * 0.15,
      'スタンダーチE: 3.0 + index * 0.1,
      'ニ�Eズ改喁E: 2.5 + index * 0.2
    }));
  }, []);

  // レーダーチャート用チE�Eタ�E�パフォーマンスレベル別特性�E�E
  const radarData = useMemo(() => {
    const metrics = ['定着玁E, '昁E��玁E, 'エンゲージメンチE, 'スキル開発', '給与水溁E];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      performanceCohorts.forEach(cohort => {
        switch (metric) {
          case '定着玁E: dataPoint[cohort.level] = cohort.avgRetention; break;
          case '昁E��玁E: dataPoint[cohort.level] = cohort.promotionRate; break;
          case 'エンゲージメンチE: dataPoint[cohort.level] = cohort.avgEngagement; break;
          case 'スキル開発': dataPoint[cohort.level] = cohort.skillDevelopment; break;
          case '給与水溁E: dataPoint[cohort.level] = cohort.avgSalary / 5; break;
        }
      });
      return dataPoint;
    });
  }, [performanceCohorts]);

  // 散币E��用チE�Eタ�E�パフォーマンスとエンゲージメント�E相関�E�E
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

  // 施設リストを取征E
  const facilities = useMemo(() => {
    const facilitySet = new Set<string>();
    Object.values(staffDatabase).forEach(staff => {
      facilitySet.add(staff.facility);
    });
    return ['全施設', ...Array.from(facilitySet).sort()];
  }, []);

  // 部署リストを取征E
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
      <CommonHeader title="パフォーマンスコホ�Eト�E极E />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">パフォーマンスコホ�Eト�E极E/h1>
            <p className="text-gray-600 mt-2">
              パフォーマンスレベル別に職員を�E類し、各群の特性・成長軌跡・定着玁E��刁E��
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
                  <option value="historical">過去比輁E/option>
                </select>
              </div>
            </div>
          </div>

          {/* パフォーマンスレベル別統訁E*/}
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
                      <span className="text-lg font-semibold">{cohort.count}吁E/span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">定着玁E/span>
                      <span className={`text-lg font-semibold ${cohort.avgRetention >= 80 ? 'text-green-600' : 'text-amber-600'}`}>
                        {cohort.avgRetention}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">昁E��玁E/span>
                      <span className="text-lg font-semibold text-blue-600">{cohort.promotionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* パフォーマンスレベル別比輁E*/}
          <Card>
            <CardHeader>
              <CardTitle>パフォーマンスレベル別持E��比輁E/CardTitle>
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
                    <Bar dataKey="avgRetention" name="定着玁E%)" fill="#3B82F6" />
                    <Bar dataKey="avgEngagement" name="エンゲージメンチE%)" fill="#10B981" />
                    <Bar dataKey="promotionRate" name="昁E��玁E%)" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 成長軌跡刁E�� */}
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

          {/* レーダーチャーチE*/}
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

            {/* 散币E�� */}
            <Card>
              <CardHeader>
                <CardTitle>パフォーマンス vs エンゲージメンチE/CardTitle>
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
                        label={{ value: 'エンゲージメンチE, angle: -90, position: 'insideLeft' }}
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

          {/* インサイチE*/}
          <Card>
            <CardHeader>
              <CardTitle>主要インサイチE/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">トップパフォーマ�Eの特徴</p>
                    <p className="text-sm text-gray-600">
                      定着玁E��平坁E��めE0%高く、エンゲージメントも高水準を維持、E
                      継続的なスキル開発と昁E��機会�E提供が重要、E
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">成長可能性の高い層</p>
                    <p className="text-sm text-gray-600">
                      スタンダードパフォーマ�Eの30%は、E��刁E��支援により
                      ハイパフォーマ�Eへの成長が期征E��きる、E
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">改喁E��忁E��な領域</p>
                    <p className="text-sm text-gray-600">
                      ニ�Eズ改喁E��の離職玁E��高く、早期�E介�Eと個別支援プログラムの
                      実施が推奨される、E
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
                title: 'パフォーマンスコホ�Eト�E析レポ�EチE,
                facility: selectedFacility,
                reportType: 'performance-cohort',
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

export default function PerformanceCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PerformanceCohortContent />
    </Suspense>
  );
}