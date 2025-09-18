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
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area
} from 'recharts';

interface LifeEventCohort {
  event: string;
  count: number;
  avgRetentionBefore: number;
  avgRetentionAfter: number;
  impactScore: number;
  recoveryTime: number;
  supportNeeded: string;
}

function LifeEventCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');

  // ライフイベントの定義
  const lifeEventTypes = [
    '結婚',
    '出産・育児',
    '介護（親）',
    '転居',
    '子供の進学',
    '配偶者の転勤',
    '健康問題',
    '家族の病気'
  ];

  // ライフイベントコホートデータの生成
  const lifeEventCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedAgeGroup !== 'all') {
        const ageGroups = {
          '20-29': [20, 29],
          '30-39': [30, 39],
          '40-49': [40, 49],
          '50+': [50, 100]
        };
        const [min, max] = ageGroups[selectedAgeGroup as keyof typeof ageGroups];
        if (staff.age < min || staff.age > max) return false;
      }
      return true;
    });

    // ライフイベント別にコホートを生成（シミュレーション）
    const cohorts: LifeEventCohort[] = lifeEventTypes.map(event => {
      // イベント発生確率に基づいてスタッフを分類
      let eventProbability = 0;
      switch (event) {
        case '結婚': eventProbability = 0.15; break;
        case '出産・育児': eventProbability = 0.20; break;
        case '介護（親）': eventProbability = 0.10; break;
        case '転居': eventProbability = 0.08; break;
        case '子供の進学': eventProbability = 0.12; break;
        case '配偶者の転勤': eventProbability = 0.05; break;
        case '健康問題': eventProbability = 0.06; break;
        case '家族の病気': eventProbability = 0.07; break;
      }

      const affectedStaff = staffList.filter(() => Math.random() < eventProbability);
      const count = affectedStaff.length;

      if (count === 0) return null;

      // イベント前後の定着率を計算
      const avgRetentionBefore = 85 + Math.random() * 10;
      let avgRetentionAfter = avgRetentionBefore;
      let impactScore = 0;
      let recoveryTime = 0;
      let supportNeeded = '';

      switch (event) {
        case '結婚':
          avgRetentionAfter = avgRetentionBefore + 5;
          impactScore = -5;
          recoveryTime = 0;
          supportNeeded = '祝い金制度、新婚休暇';
          break;
        case '出産・育児':
          avgRetentionAfter = avgRetentionBefore - 15;
          impactScore = 25;
          recoveryTime = 18;
          supportNeeded = '育児休業、時短勤務、保育支援';
          break;
        case '介護（親）':
          avgRetentionAfter = avgRetentionBefore - 20;
          impactScore = 35;
          recoveryTime = 24;
          supportNeeded = '介護休業、フレックス勤務、介護支援金';
          break;
        case '転居':
          avgRetentionAfter = avgRetentionBefore - 10;
          impactScore = 15;
          recoveryTime = 6;
          supportNeeded = 'リモートワーク、転勤支援';
          break;
        case '子供の進学':
          avgRetentionAfter = avgRetentionBefore - 8;
          impactScore = 12;
          recoveryTime = 3;
          supportNeeded = '教育資金支援、学費補助';
          break;
        case '配偶者の転勤':
          avgRetentionAfter = avgRetentionBefore - 25;
          impactScore = 40;
          recoveryTime = 12;
          supportNeeded = 'リモートワーク、別居手当';
          break;
        case '健康問題':
          avgRetentionAfter = avgRetentionBefore - 18;
          impactScore = 30;
          recoveryTime = 12;
          supportNeeded = '健康管理支援、医療費補助';
          break;
        case '家族の病気':
          avgRetentionAfter = avgRetentionBefore - 12;
          impactScore = 20;
          recoveryTime = 9;
          supportNeeded = '看護休暇、フレックス勤務';
          break;
      }

      return {
        event,
        count,
        avgRetentionBefore: Math.round(avgRetentionBefore),
        avgRetentionAfter: Math.round(avgRetentionAfter),
        impactScore: Math.round(impactScore),
        recoveryTime,
        supportNeeded
      };
    }).filter(Boolean) as LifeEventCohort[];

    if (selectedEventType !== 'all') {
      return cohorts.filter(c => c.event === selectedEventType);
    }

    return cohorts;
  }, [selectedFacility, selectedEventType, selectedAgeGroup]);

  // 年齢層別ライフイベント発生率
  const ageGroupEventData = useMemo(() => {
    const ageGroups = ['20-29歳', '30-39歳', '40-49歳', '50歳以上'];
    return ageGroups.map(age => ({
      age,
      '結婚': age === '20-29歳' ? 35 : age === '30-39歳' ? 20 : 5,
      '出産・育児': age === '20-29歳' ? 15 : age === '30-39歳' ? 40 : age === '40-49歳' ? 10 : 2,
      '介護': age === '40-49歳' ? 25 : age === '50歳以上' ? 35 : 5,
      '転居': 15 + Math.random() * 10
    }));
  }, []);

  // ライフイベント影響の時系列データ
  const timeSeriesImpactData = useMemo(() => {
    const months = Array.from({ length: 24 }, (_, i) => i + 1);
    return months.map(month => {
      const baseRetention = 90;
      const impactMonth = 6;
      let retention = baseRetention;
      
      if (month >= impactMonth) {
        const monthsSinceEvent = month - impactMonth;
        const maxDrop = 20;
        const recoveryRate = 0.8;
        retention = baseRetention - maxDrop * Math.exp(-monthsSinceEvent * recoveryRate / 10);
      }

      return {
        month: `${month}ヶ月`,
        '定着率': Math.round(retention),
        'エンゲージメント': Math.round(retention * 0.8 + Math.random() * 10),
        'パフォーマンス': Math.round(retention * 0.7 + Math.random() * 15)
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">ライフイベントコホート分析</h1>
            <p className="text-gray-600 mt-2">
              結婚・出産・介護などのライフイベントが職員の定着・パフォーマンスに与える影響を分析
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
                  ライフイベント
                </label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全てのイベント</option>
                  {lifeEventTypes.map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年齢層
                </label>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全年齢</option>
                  <option value="20-29">20-29歳</option>
                  <option value="30-39">30-39歳</option>
                  <option value="40-49">40-49歳</option>
                  <option value="50+">50歳以上</option>
                </select>
              </div>
            </div>
          </div>

          {/* ライフイベント影響度分析 */}
          <Card>
            <CardHeader>
              <CardTitle>ライフイベント別影響度分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lifeEventCohorts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 50]} />
                    <YAxis dataKey="event" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="impactScore" name="影響度スコア" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 定着率への影響 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>イベント前後の定着率変化</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lifeEventCohorts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="event" angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgRetentionBefore" name="イベント前" fill="#3B82F6" />
                      <Bar dataKey="avgRetentionAfter" name="イベント後" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>回復期間の比較</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={lifeEventCohorts}
                        dataKey="recoveryTime"
                        nameKey="event"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ event, recoveryTime }) => `${event}: ${recoveryTime}ヶ月`}
                      >
                        {lifeEventCohorts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 年齢層別ライフイベント発生率 */}
          <Card>
            <CardHeader>
              <CardTitle>年齢層別ライフイベント発生率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageGroupEventData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="結婚" stackId="a" fill="#3B82F6" />
                    <Bar dataKey="出産・育児" stackId="a" fill="#10B981" />
                    <Bar dataKey="介護" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="転居" stackId="a" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 時系列影響分析 */}
          <Card>
            <CardHeader>
              <CardTitle>ライフイベント後の回復曲線</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={timeSeriesImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Area type="monotone" dataKey="定着率" fill="#3B82F6" fillOpacity={0.3} stroke="#3B82F6" />
                    <Line type="monotone" dataKey="エンゲージメント" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="パフォーマンス" stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 支援策一覧 */}
          <Card>
            <CardHeader>
              <CardTitle>ライフイベント別推奨支援策</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lifeEventCohorts.map((cohort, index) => (
                  <div key={cohort.event} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{cohort.event}</h4>
                        <p className="text-sm text-gray-600">{cohort.supportNeeded}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">対象者数: {cohort.count}名</p>
                        <p className="text-xs text-gray-500">回復期間: {cohort.recoveryTime}ヶ月</p>
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
                <CardTitle className="text-base">最も影響の大きいイベント</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {lifeEventCohorts.reduce((max, cohort) => 
                    cohort.impactScore > max.impactScore ? cohort : max
                  ).event}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  影響度スコア: {Math.max(...lifeEventCohorts.map(c => c.impactScore))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">平均回復期間</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600">
                  {Math.round(lifeEventCohorts.reduce((sum, c) => sum + c.recoveryTime, 0) / lifeEventCohorts.length)}ヶ月
                </p>
                <p className="text-sm text-gray-600 mt-1">全イベント平均</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">影響を受ける職員数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {lifeEventCohorts.reduce((sum, c) => sum + c.count, 0)}名
                </p>
                <p className="text-sm text-gray-600 mt-1">年間推定</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">支援策カバー率</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">78%</p>
                <p className="text-sm text-gray-600 mt-1">制度利用可能割合</p>
              </CardContent>
            </Card>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: 'ライフイベントコホート分析レポート',
                facility: selectedFacility,
                reportType: 'life-event-cohort',
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

export default function LifeEventCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LifeEventCohortContent />
    </Suspense>
  );
}