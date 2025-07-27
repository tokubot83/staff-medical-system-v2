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
  RadialBarChart,
  RadialBar,
  Cell
} from 'recharts';

interface CohortData {
  year: string;
  totalCount: number;
  currentCount: number;
  retentionRate: number;
  avgPerformance: number;
  avgEngagement: number;
  turnoverCount: number;
  riskScore: number;
}

function EntryYearCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedPosition, setSelectedPosition] = useState('全職種');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  // スタッフデータから入社年次別コホートデータを生成
  const cohortData = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedPosition !== '全職種') {
        const basePosition = staff.position.replace(/主任|師長|部長|科長/, '').trim();
        if (basePosition !== selectedPosition) return false;
      }
      return true;
    });

    // 入社年別にグループ化
    const yearGroups = staffList.reduce((acc, staff) => {
      const joinYear = staff.joinDate.match(/(\d{4})年/)?.[1] || '不明';
      if (!acc[joinYear]) {
        acc[joinYear] = [];
      }
      acc[joinYear].push(staff);
      return acc;
    }, {} as Record<string, typeof staffList>);

    // 各年次のコホートデータを計算
    const cohortData: CohortData[] = Object.entries(yearGroups)
      .filter(([year]) => year !== '不明')
      .map(([year, staffGroup]) => {
        const totalCount = staffGroup.length;
        // 現在も在籍している職員（離職していない）
        const currentCount = staffGroup.filter(s => !s.assignmentHistory?.some(h => h.reason === '退職')).length;
        const retentionRate = Math.round((currentCount / totalCount) * 100);
        
        // パフォーマンスとエンゲージメントの平均
        const avgPerformance = staffGroup.reduce((sum, s) => {
          const rating = s.evaluationData?.rating || s.evaluationHistory?.[0]?.performance || 3.5;
          return sum + rating;
        }, 0) / totalCount;
        
        const avgEngagement = staffGroup.reduce((sum, s) => sum + s.engagement, 0) / totalCount;
        
        // 離職リスクスコア（ストレス指数、残業時間、有給取得率から計算）
        const riskScore = staffGroup.reduce((sum, s) => {
          const stress = s.stressIndex / 100;
          const overtime = Math.min(s.overtime / 50, 1);
          const paidLeave = 1 - (s.paidLeaveRate / 100);
          return sum + ((stress + overtime + paidLeave) / 3);
        }, 0) / totalCount * 100;

        return {
          year,
          totalCount,
          currentCount,
          retentionRate,
          avgPerformance: Number(avgPerformance.toFixed(2)),
          avgEngagement: Math.round(avgEngagement),
          turnoverCount: totalCount - currentCount,
          riskScore: Math.round(riskScore)
        };
      })
      .sort((a, b) => Number(a.year) - Number(b.year));

    // 時間範囲でフィルタリング
    if (selectedTimeRange === 'recent5') {
      const currentYear = new Date().getFullYear();
      return cohortData.filter(d => Number(d.year) >= currentYear - 5);
    } else if (selectedTimeRange === 'recent3') {
      const currentYear = new Date().getFullYear();
      return cohortData.filter(d => Number(d.year) >= currentYear - 3);
    }
    
    return cohortData;
  }, [selectedFacility, selectedPosition, selectedTimeRange]);

  // 累積定着率データ（時系列で各年次コホートの定着率推移を表示）
  const retentionTrendData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [1, 2, 3, 5, 10]; // 入社後の経過年数
    
    return years.map(elapsed => {
      const dataPoint: any = { year: `${elapsed}年後` };
      
      cohortData.forEach(cohort => {
        const cohortYear = Number(cohort.year);
        if (currentYear - cohortYear >= elapsed) {
          // 簡易的な定着率減衰モデル（実際はより複雑な計算が必要）
          const baseRetention = cohort.retentionRate;
          const decayRate = 0.05; // 年間5%の減少
          const retention = baseRetention * Math.pow(1 - decayRate, elapsed);
          dataPoint[cohort.year] = Math.round(retention);
        }
      });
      
      return dataPoint;
    });
  }, [cohortData]);

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
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="入社年次別コホート追跡" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">入社年次別コホート追跡</h1>
            <p className="text-gray-600 mt-2">入社年次別に職員の定着率・成長・キャリア形成を長期的に追跡分析</p>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  期間
                </label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全期間</option>
                  <option value="recent5">直近5年</option>
                  <option value="recent3">直近3年</option>
                </select>
              </div>
            </div>
          </div>

          {/* 定着率推移グラフ */}
          <Card>
            <CardHeader>
              <CardTitle>入社年次別定着率推移</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cohortData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="retentionRate" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="定着率"
                      dot={{ fill: '#3B82F6', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* パフォーマンスとエンゲージメント */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>年次別パフォーマンス評価</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cohortData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="avgPerformance" 
                        fill="#10B981" 
                        name="平均評価"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>年次別エンゲージメント</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cohortData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                      <Bar 
                        dataKey="avgEngagement" 
                        fill="#F59E0B" 
                        name="エンゲージメント"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 離職リスク分析 */}
          <Card>
            <CardHeader>
              <CardTitle>年次別離職リスクスコア</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohortData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="riskScore" name="リスクスコア">
                      {cohortData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.riskScore > 60 ? '#EF4444' : entry.riskScore > 40 ? '#F59E0B' : '#10B981'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>低リスク（0-40%）</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span>中リスク（40-60%）</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>高リスク（60%以上）</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 累積定着率推移 */}
          <Card>
            <CardHeader>
              <CardTitle>経過年数別定着率推移</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    {cohortData.slice(0, 6).map((cohort, index) => (
                      <Line
                        key={cohort.year}
                        type="monotone"
                        dataKey={cohort.year}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        name={`${cohort.year}年入社`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* サマリー統計 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>全体定着率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {cohortData.length > 0 
                    ? Math.round(cohortData.reduce((sum, d) => sum + d.retentionRate, 0) / cohortData.length) 
                    : 0}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  全コホートの平均定着率
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>総離職者数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {cohortData.reduce((sum, d) => sum + d.turnoverCount, 0)}名
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  全期間の累計離職者数
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>高リスクコホート</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {cohortData.filter(d => d.riskScore > 60).length}件
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  リスクスコア60%以上
                </p>
              </CardContent>
            </Card>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '入社年次別コホート追跡レポート',
                facility: selectedFacility,
                reportType: 'entry-year-cohort',
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

export default function EntryYearCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntryYearCohortContent />
    </Suspense>
  );
}