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

  // チE��チE�Eタ生�E
  useEffect(() => {
    const data = generateAllCohortDemoData();
    setStaffData(data);
  }, []);

  // 施策データ�E�デモ�E�E
  const interventions: InterventionData[] = [
    {
      id: '1',
      name: 'リーダーシチE�E研修プログラム',
      type: 'training',
      startDate: '2024-04-01',
      targetGroup: '中堁E��護師�E�E-10年目�E�E,
      status: 'completed',
      metrics: [
        { name: 'リーダーシチE�Eスコア', beforeValue: 3.2, afterValue: 4.1, improvement: 28.1, target: 4.0 },
        { name: 'チ�Eム生産性', beforeValue: 72, afterValue: 85, improvement: 18.1, target: 80 },
        { name: '部下満足度', beforeValue: 68, afterValue: 82, improvement: 20.6, target: 80 },
        { name: '離職意向', beforeValue: 25, afterValue: 15, improvement: -40.0, target: 15 }
      ],
      cost: 2500000,
      participants: 45,
      roi: 320
    },
    {
      id: '2',
      name: 'メンタルヘルスサポ�Eト制度',
      type: 'wellbeing',
      startDate: '2024-01-01',
      targetGroup: '全職員',
      status: 'ongoing',
      metrics: [
        { name: 'ストレスレベル', beforeValue: 65, afterValue: 48, improvement: -26.2, target: 50 },
        { name: 'ワークエンゲージメンチE, beforeValue: 68, afterValue: 78, improvement: 14.7, target: 75 },
        { name: '痁E��日数', beforeValue: 8.5, afterValue: 5.2, improvement: -38.8, target: 5.0 },
        { name: 'カウンセリング利用玁E, beforeValue: 12, afterValue: 35, improvement: 191.7, target: 30 }
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
        { name: '1年目定着玁E, beforeValue: 75, afterValue: 88, improvement: 17.3, target: 85 },
        { name: 'OJT満足度', beforeValue: 65, afterValue: 85, improvement: 30.8, target: 80 },
        { name: '業務習�E度', beforeValue: 60, afterValue: 78, improvement: 30.0, target: 75 },
        { name: 'メンター評価', beforeValue: 70, afterValue: 88, improvement: 25.7, target: 85 }
      ],
      cost: 1800000,
      participants: 25,
      roi: 450
    },
    {
      id: '4',
      name: 'パフォーマンス向上施筁E,
      type: 'performance',
      startDate: '2024-03-01',
      targetGroup: '看護部',
      status: 'completed',
      metrics: [
        { name: '業務効玁E, beforeValue: 72, afterValue: 85, improvement: 18.1, target: 80 },
        { name: '患老E��足度', beforeValue: 85, afterValue: 92, improvement: 8.2, target: 90 },
        { name: 'インシチE��ト率', beforeValue: 2.5, afterValue: 1.2, improvement: -52.0, target: 1.5 },
        { name: 'スキル評価', beforeValue: 3.5, afterValue: 4.2, improvement: 20.0, target: 4.0 }
      ],
      cost: 3200000,
      participants: 85,
      roi: 380
    }
  ];

  // 選択された施筁E
  const selectedInterventionData = useMemo(() => {
    if (selectedIntervention === 'all') return interventions;
    return interventions.filter(i => i.id === selectedIntervention);
  }, [selectedIntervention]);

  // 時系列データ�E�デモ�E�E
  const timeSeriesData: TimeSeriesData[] = [
    { month: '1朁E, interventionGroup: 72, controlGroup: 71, difference: 1 },
    { month: '2朁E, interventionGroup: 74, controlGroup: 72, difference: 2 },
    { month: '3朁E, interventionGroup: 78, controlGroup: 71, difference: 7 },
    { month: '4朁E, interventionGroup: 82, controlGroup: 73, difference: 9 },
    { month: '5朁E, interventionGroup: 85, controlGroup: 72, difference: 13 },
    { month: '6朁E, interventionGroup: 88, controlGroup: 74, difference: 14 }
  ];

  // 総合効果�E計箁E
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
      <CommonHeader title="施策効果測宁E />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">施策効果測宁E/h1>
            <p className="text-gray-600 mt-2">人事施策導�E前後�Eコホ�Eト比輁E��より、施策�E効果を定量評価</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* フィルター */}
          <Card className="pdf-exclude">
            <CardHeader>
              <CardTitle>刁E��設宁E/CardTitle>
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
                      <SelectItem value="小原痁E��">小原痁E��</SelectItem>
                      <SelectItem value="立神リハビリチE�Eション温泉病院">立神リハビリチE�Eション温泉病院</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">施筁E/label>
                  <Select value={selectedIntervention} onValueChange={setSelectedIntervention}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべての施筁E/SelectItem>
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
                      <SelectItem value="3months">3ヶ朁E/SelectItem>
                      <SelectItem value="6months">6ヶ朁E/SelectItem>
                      <SelectItem value="1year">1年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">比輁E��況E/label>
                  <Select value={comparisonMode} onValueChange={(value: any) => setComparisonMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="before-after">前後比輁E/SelectItem>
                      <SelectItem value="control-group">対照群比輁E/SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* サマリーカーチE*/}
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
                    <p className="text-sm text-gray-600">対象老E��</p>
                    <p className="text-2xl font-bold">{overallImpact.totalParticipants}吁E/p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">平坁E��喁E��</p>
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

          {/* 施策一覧と効极E*/}
          <Card>
            <CardHeader>
              <CardTitle>施策効果一覧</CardTitle>
              <CardDescription>吁E��策�E実施状況と主要指標�E改喁E��況E/CardDescription>
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
                        {intervention.status === 'completed' ? '完亁E : intervention.status === 'ongoing' ? '実施中' : '計画中'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {intervention.metrics.map((metric, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700">{metric.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{metric.beforeValue}</span>
                            <span className="text-gray-400">ↁE/span>
                            <span className="text-sm font-semibold">{metric.afterValue}</span>
                          </div>
                          <p className={`text-sm font-semibold mt-1 ${getImprovementColor(
                            metric.improvement,
                            metric.name.includes('離職') || metric.name.includes('ストレス') || metric.name.includes('インシチE��チE) || metric.name.includes('痁E��')
                          )}`}>
                            {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-6 text-sm">
                        <span>参加老E <span className="font-semibold">{intervention.participants}吁E/span></span>
                        <span>投賁E��E <span className="font-semibold">¥{(intervention.cost ?? 0).toLocaleString()}</span></span>
                        <span>ROI: <span className="font-semibold text-green-600">{intervention.roi}%</span></span>
                      </div>
                      <div className="flex gap-2">
                        {intervention.metrics.every(m => {
                          const isNegativeGood = m.name.includes('離職') || m.name.includes('ストレス') || m.name.includes('インシチE��チE) || m.name.includes('痁E��');
                          return isNegativeGood ? m.afterValue <= m.target : m.afterValue >= m.target;
                        }) ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            目標達戁E
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            一部未達�E
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 時系列比輁E*/}
          {comparisonMode === 'control-group' && (
            <Card>
              <CardHeader>
                <CardTitle>介�E群 vs 対照群比輁E/CardTitle>
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
                    <ReferenceLine x="3朁E stroke="#666" strokeDasharray="3 3" label="施策開姁E />
                    <Line 
                      type="monotone" 
                      dataKey="interventionGroup" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="介�E群"
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
                        name="差刁E
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 効果�E持続性刁E�� */}
          <Card>
            <CardHeader>
              <CardTitle>効果�E持続性刁E��</CardTitle>
              <CardDescription>施策実施後�E効果持続期閁E/CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold">リーダーシチE�E研修プログラム</p>
                      <p className="text-sm text-gray-600">効果持続期閁E 12ヶ月以丁E/p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">持続的効极E/Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-semibold">メンタルヘルスサポ�Eト制度</p>
                      <p className="text-sm text-gray-600">効果持続期閁E 継続的サポ�Eト忁E��E/p>
                    </div>
                  </div>
                  <Badge variant="secondary">継続支援要E/Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* コスト効果�E极E*/}
          <Card>
            <CardHeader>
              <CardTitle>コスト効果�E极E/CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={selectedInterventionData.map(i => ({
                  name: i.name.length > 20 ? i.name.substring(0, 20) + '...' : i.name,
                  cost: i.cost / 10000, // 丁E�E単佁E
                  roi: i.roi,
                  costPerPerson: Math.round(i.cost / i.participants / 1000) // 十E�E単佁E
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cost" fill="#3b82f6" name="投賁E��（丁E�E�E�E />
                  <Bar yAxisId="right" dataKey="roi" fill="#10b981" name="ROI�E�E�E�E />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 推奨事頁E*/}
          <Card>
            <CardHeader>
              <CardTitle>刁E��結果からの推奨事頁E/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">高ROI施策�E横展開</p>
                    <p className="text-sm text-gray-600">
                      新人定着支援プログラム�E�EOI 450%�E��E特に効果が高く、E
                      他�E職種・部署への展開を推奨します、E
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">継続的モニタリングの忁E��性</p>
                    <p className="text-sm text-gray-600">
                      メンタルヘルスサポ�Eト�E継続的な支援が忁E��です、E
                      定期皁E��効果測定と施策�E改喁E��行ってください、E
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">褁E��皁E��プローチ�E推進</p>
                    <p className="text-sm text-gray-600">
                      単一施策よりも、褁E��の施策を絁E��合わせることで
                      相乗効果が期征E��きます、E
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
                title: '施策効果測定レポ�EチE,
                facility: facilityParam || '全施設',
                reportType: 'intervention-effect',
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}