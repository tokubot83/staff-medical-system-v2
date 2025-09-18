'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity, CheckCircle, XCircle, AlertCircle, Calendar, Users, DollarSign } from 'lucide-react';
import { generateAllCohortDemoData } from '@/utils/generateCohortDemoData';
import { StaffDetail } from '@/types/staff';

interface InterventionData {
  id: string;
  name: string;
  type: 'training' | 'wellbeing' | 'retention' | 'performance';
  startDate: string;
  targetGroup: string;
  status: 'completed' | 'ongoing' | 'planned';
  metrics: {
    name: string;
    beforeValue: number;
    afterValue: number;
    improvement: number;
    target: number;
  }[];
  cost: number;
  participants: number;
  roi: number;
}

interface TimeSeriesData {
  month: string;
  interventionGroup: number;
  controlGroup: number;
  difference: number;
}

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  
  const [selectedFacility, setSelectedFacility] = useState<string>('全施設');
  const [selectedIntervention, setSelectedIntervention] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('6months');
  const [comparisonMode, setComparisonMode] = useState<'before-after' | 'control-group'>('before-after');
  const [staffData, setStaffData] = useState<StaffDetail[]>([]);

  // デモデータ生成
  useEffect(() => {
    const data = generateAllCohortDemoData();
    setStaffData(data);
  }, []);

  // 施策データ（デモ）
  const interventions: InterventionData[] = [
    {
      id: '1',
      name: 'リーダーシップ研修プログラム',
      type: 'training',
      startDate: '2024-04-01',
      targetGroup: '中堅看護師（5-10年目）',
      status: 'completed',
      metrics: [
        { name: 'リーダーシップスコア', beforeValue: 3.2, afterValue: 4.1, improvement: 28.1, target: 4.0 },
        { name: 'チーム生産性', beforeValue: 72, afterValue: 85, improvement: 18.1, target: 80 },
        { name: '部下満足度', beforeValue: 68, afterValue: 82, improvement: 20.6, target: 80 },
        { name: '離職意向', beforeValue: 25, afterValue: 15, improvement: -40.0, target: 15 }
      ],
      cost: 2500000,
      participants: 45,
      roi: 320
    },
    {
      id: '2',
      name: 'メンタルヘルスサポート制度',
      type: 'wellbeing',
      startDate: '2024-01-01',
      targetGroup: '全職員',
      status: 'ongoing',
      metrics: [
        { name: 'ストレスレベル', beforeValue: 65, afterValue: 48, improvement: -26.2, target: 50 },
        { name: 'ワークエンゲージメント', beforeValue: 68, afterValue: 78, improvement: 14.7, target: 75 },
        { name: '病欠日数', beforeValue: 8.5, afterValue: 5.2, improvement: -38.8, target: 5.0 },
        { name: 'カウンセリング利用率', beforeValue: 12, afterValue: 35, improvement: 191.7, target: 30 }
      ],
      cost: 4800000,
      participants: 165,
      roi: 280
    },
    {
      id: '3',
      name: '新人定着支援プログラム',
      type: 'retention',
      startDate: '2024-06-01',
      targetGroup: '入職1年目職員',
      status: 'ongoing',
      metrics: [
        { name: '1年目定着率', beforeValue: 75, afterValue: 88, improvement: 17.3, target: 85 },
        { name: 'OJT満足度', beforeValue: 65, afterValue: 85, improvement: 30.8, target: 80 },
        { name: '業務習熟度', beforeValue: 60, afterValue: 78, improvement: 30.0, target: 75 },
        { name: 'メンター評価', beforeValue: 70, afterValue: 88, improvement: 25.7, target: 85 }
      ],
      cost: 1800000,
      participants: 25,
      roi: 450
    },
    {
      id: '4',
      name: 'パフォーマンス向上施策',
      type: 'performance',
      startDate: '2024-03-01',
      targetGroup: '看護部',
      status: 'completed',
      metrics: [
        { name: '業務効率', beforeValue: 72, afterValue: 85, improvement: 18.1, target: 80 },
        { name: '患者満足度', beforeValue: 85, afterValue: 92, improvement: 8.2, target: 90 },
        { name: 'インシデント率', beforeValue: 2.5, afterValue: 1.2, improvement: -52.0, target: 1.5 },
        { name: 'スキル評価', beforeValue: 3.5, afterValue: 4.2, improvement: 20.0, target: 4.0 }
      ],
      cost: 3200000,
      participants: 85,
      roi: 380
    }
  ];

  // 選択された施策
  const selectedInterventionData = useMemo(() => {
    if (selectedIntervention === 'all') return interventions;
    return interventions.filter(i => i.id === selectedIntervention);
  }, [selectedIntervention]);

  // 時系列データ（デモ）
  const timeSeriesData: TimeSeriesData[] = [
    { month: '1月', interventionGroup: 72, controlGroup: 71, difference: 1 },
    { month: '2月', interventionGroup: 74, controlGroup: 72, difference: 2 },
    { month: '3月', interventionGroup: 78, controlGroup: 71, difference: 7 },
    { month: '4月', interventionGroup: 82, controlGroup: 73, difference: 9 },
    { month: '5月', interventionGroup: 85, controlGroup: 72, difference: 13 },
    { month: '6月', interventionGroup: 88, controlGroup: 74, difference: 14 }
  ];

  // 総合効果の計算
  const overallImpact = useMemo(() => {
    const totalCost = selectedInterventionData.reduce((sum, i) => sum + i.cost, 0);
    const totalParticipants = selectedInterventionData.reduce((sum, i) => sum + i.participants, 0);
    const avgROI = selectedInterventionData.reduce((sum, i) => sum + i.roi, 0) / selectedInterventionData.length;
    const avgImprovement = selectedInterventionData.reduce((sum, i) => {
      const metricAvg = i.metrics.reduce((mSum, m) => mSum + Math.abs(m.improvement), 0) / i.metrics.length;
      return sum + metricAvg;
    }, 0) / selectedInterventionData.length;

    return {
      totalCost,
      totalParticipants,
      avgROI: Math.round(avgROI),
      avgImprovement: Math.round(avgImprovement * 10) / 10
    };
  }, [selectedInterventionData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImprovementColor = (improvement: number, isNegativeGood: boolean = false) => {
    const absImprovement = Math.abs(improvement);
    const isGood = isNegativeGood ? improvement < 0 : improvement > 0;
    
    if (isGood) {
      if (absImprovement > 20) return 'text-green-600';
      if (absImprovement > 10) return 'text-green-500';
      return 'text-green-400';
    } else {
      if (absImprovement > 20) return 'text-red-600';
      if (absImprovement > 10) return 'text-red-500';
      return 'text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="施策効果測定" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">施策効果測定</h1>
            <p className="text-gray-600 mt-2">人事施策導入前後のコホート比較により、施策の効果を定量評価</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* フィルター */}
          <Card className="pdf-exclude">
            <CardHeader>
              <CardTitle>分析設定</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">施設</label>
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全施設">全施設</SelectItem>
                      <SelectItem value="小原病院">小原病院</SelectItem>
                      <SelectItem value="立神リハビリテーション温泉病院">立神リハビリテーション温泉病院</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">施策</label>
                  <Select value={selectedIntervention} onValueChange={setSelectedIntervention}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべての施策</SelectItem>
                      {interventions.map(i => (
                        <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">期間</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3ヶ月</SelectItem>
                      <SelectItem value="6months">6ヶ月</SelectItem>
                      <SelectItem value="1year">1年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">比較方法</label>
                  <Select value={comparisonMode} onValueChange={(value: any) => setComparisonMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before-after">前後比較</SelectItem>
                      <SelectItem value="control-group">対照群比較</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* サマリーカード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">実施施策数</p>
                    <p className="text-2xl font-bold">{selectedInterventionData.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">対象者数</p>
                    <p className="text-2xl font-bold">{overallImpact.totalParticipants}名</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">平均改善率</p>
                    <p className="text-2xl font-bold">{overallImpact.avgImprovement}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">平均ROI</p>
                    <p className="text-2xl font-bold">{overallImpact.avgROI}%</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 施策一覧と効果 */}
          <Card>
            <CardHeader>
              <CardTitle>施策効果一覧</CardTitle>
              <CardDescription>各施策の実施状況と主要指標の改善状況</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedInterventionData.map(intervention => (
                  <div key={intervention.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{intervention.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">対象: {intervention.targetGroup}</p>
                        <p className="text-sm text-gray-500">開始日: {intervention.startDate}</p>
                      </div>
                      <Badge className={getStatusColor(intervention.status)}>
                        {intervention.status === 'completed' ? '完了' : intervention.status === 'ongoing' ? '実施中' : '計画中'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {intervention.metrics.map((metric, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700">{metric.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{metric.beforeValue}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-sm font-semibold">{metric.afterValue}</span>
                          </div>
                          <p className={`text-sm font-semibold mt-1 ${getImprovementColor(
                            metric.improvement,
                            metric.name.includes('離職') || metric.name.includes('ストレス') || metric.name.includes('インシデント') || metric.name.includes('病欠')
                          )}`}>
                            {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-6 text-sm">
                        <span>参加者: <span className="font-semibold">{intervention.participants}名</span></span>
                        <span>投資額: <span className="font-semibold">¥{(intervention.cost ?? 0).toLocaleString()}</span></span>
                        <span>ROI: <span className="font-semibold text-green-600">{intervention.roi}%</span></span>
                      </div>
                      <div className="flex gap-2">
                        {intervention.metrics.every(m => {
                          const isNegativeGood = m.name.includes('離職') || m.name.includes('ストレス') || m.name.includes('インシデント') || m.name.includes('病欠');
                          return isNegativeGood ? m.afterValue <= m.target : m.afterValue >= m.target;
                        }) ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            目標達成
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            一部未達成
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 時系列比較 */}
          {comparisonMode === 'control-group' && (
            <Card>
              <CardHeader>
                <CardTitle>介入群 vs 対照群比較</CardTitle>
                <CardDescription>施策実施群と非実施群のパフォーマンス推移</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine x="3月" stroke="#666" strokeDasharray="3 3" label="施策開始" />
                    <Line 
                      type="monotone" 
                      dataKey="interventionGroup" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="介入群"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="controlGroup" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="対照群"
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="difference" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                        name="差分"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 効果の持続性分析 */}
          <Card>
            <CardHeader>
              <CardTitle>効果の持続性分析</CardTitle>
              <CardDescription>施策実施後の効果持続期間</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold">リーダーシップ研修プログラム</p>
                      <p className="text-sm text-gray-600">効果持続期間: 12ヶ月以上</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">持続的効果</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-semibold">メンタルヘルスサポート制度</p>
                      <p className="text-sm text-gray-600">効果持続期間: 継続的サポート必要</p>
                    </div>
                  </div>
                  <Badge variant="secondary">継続支援要</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* コスト効果分析 */}
          <Card>
            <CardHeader>
              <CardTitle>コスト効果分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={selectedInterventionData.map(i => ({
                  name: i.name.length > 20 ? i.name.substring(0, 20) + '...' : i.name,
                  cost: i.cost / 10000, // 万円単位
                  roi: i.roi,
                  costPerPerson: Math.round(i.cost / i.participants / 1000) // 千円単位
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cost" fill="#3b82f6" name="投資額（万円）" />
                  <Bar yAxisId="right" dataKey="roi" fill="#10b981" name="ROI（%）" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 推奨事項 */}
          <Card>
            <CardHeader>
              <CardTitle>分析結果からの推奨事項</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">高ROI施策の横展開</p>
                    <p className="text-sm text-gray-600">
                      新人定着支援プログラム（ROI 450%）は特に効果が高く、
                      他の職種・部署への展開を推奨します。
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">継続的モニタリングの必要性</p>
                    <p className="text-sm text-gray-600">
                      メンタルヘルスサポートは継続的な支援が必要です。
                      定期的な効果測定と施策の改善を行ってください。
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">複合的アプローチの推進</p>
                    <p className="text-sm text-gray-600">
                      単一施策よりも、複数の施策を組み合わせることで
                      相乗効果が期待できます。
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
                title: '施策効果測定レポート',
                facility: facilityParam || '全施設',
                reportType: 'intervention-effect',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンロード
            </button>
          </div>

        </div>
      </div><CategoryTopButton categoryPath="/reports/cohort-analysis" categoryName="コホート分析" /></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}