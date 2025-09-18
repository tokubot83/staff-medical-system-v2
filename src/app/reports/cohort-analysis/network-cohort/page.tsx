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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface NetworkCohort {
  type: string;
  count: number;
  avgConnections: number;
  influenceScore: number;
  collaborationLevel: number;
  retentionRate: number;
  performanceImpact: number;
  characteristics: string[];
}

function NetworkCohortContent() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedNetworkType, setSelectedNetworkType] = useState('all');
  const [selectedAnalysisView, setSelectedAnalysisView] = useState('overview');

  // ネットワークタイプの定義
  const networkTypes = [
    'コネクター（つなぎ役）',
    'インフルエンサー（影響力大）',
    'エキスパート（知識の源）',
    '孤立型（つながり少）',
    'チーム内完結型',
    'クロスファンクショナル型'
  ];

  // ネットワークコホートデータの生成
  const networkCohorts = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      return true;
    });

    // ネットワークタイプ別にコホートを生成
    const cohorts: NetworkCohort[] = networkTypes.map(type => {
      let avgConnections = 0;
      let influenceScore = 0;
      let collaborationLevel = 0;
      let retentionRate = 0;
      let performanceImpact = 0;
      let characteristics: string[] = [];

      switch (type) {
        case 'コネクター（つなぎ役）':
          avgConnections = 45;
          influenceScore = 85;
          collaborationLevel = 90;
          retentionRate = 92;
          performanceImpact = 88;
          characteristics = ['部署間橋渡し', '情報ハブ', 'チーム統合促進'];
          break;
        case 'インフルエンサー（影響力大）':
          avgConnections = 35;
          influenceScore = 92;
          collaborationLevel = 82;
          retentionRate = 88;
          performanceImpact = 85;
          characteristics = ['意見リーダー', '変革推進者', 'モチベーター'];
          break;
        case 'エキスパート（知識の源）':
          avgConnections = 25;
          influenceScore = 78;
          collaborationLevel = 75;
          retentionRate = 85;
          performanceImpact = 82;
          characteristics = ['専門知識保有', '相談相手', 'メンター役'];
          break;
        case '孤立型（つながり少）':
          avgConnections = 8;
          influenceScore = 25;
          collaborationLevel = 35;
          retentionRate = 65;
          performanceImpact = 55;
          characteristics = ['単独作業志向', '交流回避', '支援必要'];
          break;
        case 'チーム内完結型':
          avgConnections = 15;
          influenceScore = 55;
          collaborationLevel = 68;
          retentionRate = 78;
          performanceImpact = 70;
          characteristics = ['チーム内協力', '部署内完結', '外部交流少'];
          break;
        case 'クロスファンクショナル型':
          avgConnections = 30;
          influenceScore = 75;
          collaborationLevel = 85;
          retentionRate = 90;
          performanceImpact = 80;
          characteristics = ['部門横断活動', '多様な人脈', 'イノベーション促進'];
          break;
      }

      // シミュレーションでスタッフを分類
      const cohortStaff = staffList.filter(() => Math.random() < 0.17);
      const count = cohortStaff.length;

      if (count === 0) return null;

      return {
        type,
        count,
        avgConnections,
        influenceScore,
        collaborationLevel,
        retentionRate,
        performanceImpact,
        characteristics
      };
    }).filter(Boolean) as NetworkCohort[];

    if (selectedNetworkType !== 'all') {
      return cohorts.filter(c => c.type === selectedNetworkType);
    }

    return cohorts;
  }, [selectedFacility, selectedNetworkType]);

  // ネットワーク密度分析データ
  const networkDensityData = useMemo(() => {
    return [
      { department: '看護部', density: 78, avgConnections: 32 },
      { department: '医療技術部', density: 65, avgConnections: 28 },
      { department: '事務部', density: 72, avgConnections: 30 },
      { department: 'リハビリ部', density: 85, avgConnections: 35 },
      { department: '薬剤部', density: 58, avgConnections: 24 }
    ];
  }, []);

  // コラボレーション効果データ
  const collaborationEffectData = useMemo(() => {
    return [
      { connections: '0-5', performance: 65, innovation: 45 },
      { connections: '6-10', performance: 72, innovation: 55 },
      { connections: '11-20', performance: 80, innovation: 70 },
      { connections: '21-30', performance: 85, innovation: 82 },
      { connections: '31-40', performance: 88, innovation: 88 },
      { connections: '40+', performance: 86, innovation: 85 }
    ];
  }, []);

  // レーダーチャート用データ
  const radarData = useMemo(() => {
    const metrics = ['つながり数', '影響力', '協働レベル', '定着率', 'パフォーマンス'];
    return metrics.map(metric => {
      const dataPoint: any = { metric };
      networkCohorts.forEach(cohort => {
        let value = 0;
        switch (metric) {
          case 'つながり数': value = (cohort.avgConnections / 50) * 100; break;
          case '影響力': value = cohort.influenceScore; break;
          case '協働レベル': value = cohort.collaborationLevel; break;
          case '定着率': value = cohort.retentionRate; break;
          case 'パフォーマンス': value = cohort.performanceImpact; break;
        }
        dataPoint[cohort.type] = value;
      });
      return dataPoint;
    });
  }, [networkCohorts]);

  // 散布図用データ（ネットワークサイズと影響力の相関）
  const scatterData = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const connections = Math.random() * 50;
      const baseInfluence = connections * 1.5 + Math.random() * 20;
      const influence = Math.min(100, Math.max(0, baseInfluence));
      return {
        x: connections,
        y: influence,
        name: `職員${i + 1}`
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">ネットワークコホート分析</h1>
            <p className="text-gray-600 mt-2">
              組織内ネットワークの中心性・つながりの数・影響力別に職員を分析
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
                  ネットワークタイプ
                </label>
                <select
                  value={selectedNetworkType}
                  onChange={(e) => setSelectedNetworkType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全タイプ</option>
                  {networkTypes.map(type => (
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
                  <option value="influence">影響力分析</option>
                  <option value="collaboration">協働分析</option>
                </select>
              </div>
            </div>
          </div>

          {/* ネットワークタイプ別統計 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {networkCohorts.map((cohort, index) => (
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
                      <span className="text-sm text-gray-600">平均つながり数</span>
                      <span className="text-lg font-semibold text-blue-600">{cohort.avgConnections}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">影響力スコア</span>
                      <span className={`text-lg font-semibold ${cohort.influenceScore >= 80 ? 'text-green-600' : cohort.influenceScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {cohort.influenceScore}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ネットワークタイプ別比較 */}
          <Card>
            <CardHeader>
              <CardTitle>ネットワークタイプ別パフォーマンス指標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={networkCohorts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="influenceScore" name="影響力" fill="#3B82F6" />
                    <Bar dataKey="collaborationLevel" name="協働レベル" fill="#10B981" />
                    <Bar dataKey="retentionRate" name="定着率" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* レーダーチャート */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ネットワークタイプ別特性</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {networkCohorts.slice(0, 3).map((cohort, index) => (
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

            <Card>
              <CardHeader>
                <CardTitle>部署別ネットワーク密度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={networkDensityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="density" name="密度(%)" fill="#3B82F6" />
                      <Bar dataKey="avgConnections" name="平均つながり数" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* コラボレーション効果 */}
          <Card>
            <CardHeader>
              <CardTitle>つながり数とパフォーマンス・イノベーションの関係</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collaborationEffectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="connections" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="performance" name="パフォーマンス" fill="#3B82F6" />
                    <Bar dataKey="innovation" name="イノベーション" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 散布図 */}
          <Card>
            <CardHeader>
              <CardTitle>ネットワークサイズと影響力の相関</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="x" 
                      domain={[0, 50]} 
                      label={{ value: 'つながり数', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      dataKey="y" 
                      domain={[0, 100]}
                      label={{ value: '影響力スコア', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="職員" data={scatterData} fill="#3B82F6">
                      {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.y >= 70 ? '#10B981' : entry.y >= 50 ? '#F59E0B' : '#EF4444'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 特性一覧 */}
          <Card>
            <CardHeader>
              <CardTitle>ネットワークタイプ別特性と推奨施策</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {networkCohorts.map((cohort) => (
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
                          {cohort.type === 'コネクター（つなぎ役）' && '組織の情報流通の要。適切な評価と権限委譲が重要。'}
                          {cohort.type === 'インフルエンサー（影響力大）' && '変革推進の中心人物。意思決定への参画機会を提供。'}
                          {cohort.type === 'エキスパート（知識の源）' && '知識共有の仕組み化とメンター制度での活用を推進。'}
                          {cohort.type === '孤立型（つながり少）' && 'チーム活動への参加促進と心理的安全性の確保が必要。'}
                          {cohort.type === 'チーム内完結型' && '他部署との交流機会を意図的に創出。'}
                          {cohort.type === 'クロスファンクショナル型' && 'イノベーションプロジェクトへの積極的な登用。'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">定着率: {cohort.retentionRate}%</p>
                        <p className="text-xs text-gray-500">影響力: {cohort.influenceScore}点</p>
                      </div>
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
                title: 'ネットワークコホート分析レポート',
                facility: selectedFacility,
                reportType: 'network-cohort',
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

export default function NetworkCohortPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NetworkCohortContent />
    </Suspense>
  );
}