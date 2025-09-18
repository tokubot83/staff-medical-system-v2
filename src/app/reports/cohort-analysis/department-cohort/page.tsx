'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import { BarChart, Bar, RadarChart, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Users, TrendingUp, Award, AlertCircle, Activity, Heart } from 'lucide-react';
import { generateAllCohortDemoData } from '@/utils/generateCohortDemoData';
import { StaffDetail } from '@/types/staff';

interface DepartmentCohortData {
  department: string;
  totalStaff: number;
  averageAge: number;
  averageTenure: number;
  retentionRate: number;
  performanceScore: number;
  stressLevel: number;
  engagementScore: number;
  trainingCompletionRate: number;
  leadershipPotential: number;
  riskScore: number;
}

interface ComparisonMetric {
  metric: string;
  [key: string]: any; // 動的に部署名がキーとなめE}

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  
  const [selectedFacility, setSelectedFacility] = useState<string>('全施設');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'performance' | 'risk' | 'development'>('performance');
  const [viewMode, setViewMode] = useState<'comparison' | 'ranking'>('comparison');
  const [staffData, setStaffData] = useState<StaffDetail[]>([]);

  // チE��チE�Eタ生�E
  useEffect(() => {
    const data = generateAllCohortDemoData();
    setStaffData(data);
  }, []);

  // 部署一覧を取征E  const departments = useMemo(() => {
    const deptSet = new Set(
      staffData
        .filter(staff => selectedFacility === '全施設' || staff.facility === selectedFacility)
        .map(staff => staff.department)
    );
    return Array.from(deptSet).sort();
  }, [staffData, selectedFacility]);

  // 初期選抁E  useEffect(() => {
    if (departments.length > 0 && selectedDepartments.length === 0) {
      setSelectedDepartments(departments.slice(0, 3)); // 最初�E3部署を選抁E    }
  }, [departments]);

  // 部署別チE�Eタの雁E��E  const departmentCohortData = useMemo(() => {
    return departments.map(dept => {
      const deptStaff = staffData.filter(staff => 
        staff.department === dept &&
        (selectedFacility === '全施設' || staff.facility === selectedFacility)
      );

      if (deptStaff.length === 0) {
        return null;
      }

      const avgAge = deptStaff.reduce((sum, s) => sum + s.age, 0) / deptStaff.length;
      // Calculate tenure from tenure string (e.g., "5年3ヶ朁E -> 5.25)
      const avgTenure = deptStaff.reduce((sum, s) => {
        const tenureMatch = s.tenure.match(/(\d+)年/);
        const years = tenureMatch ? parseInt(tenureMatch[1]) : 0;
        return sum + years;
      }, 0) / deptStaff.length;
      const avgPerformance = deptStaff.reduce((sum, s) => sum + (s.evaluationData?.performance || 75), 0) / deptStaff.length;
      const avgStress = deptStaff.reduce((sum, s) => sum + (s.stressIndex || 50), 0) / deptStaff.length;
      const avgEngagement = deptStaff.reduce((sum, s) => sum + (s.engagement || 70), 0) / deptStaff.length;
      // Estimate training completion based on training history
      const trainingCompletion = deptStaff.filter(s => s.trainingHistory && s.trainingHistory.length > 3).length / deptStaff.length * 100;
      // Estimate leadership potential based on evaluation growth score
      const leadershipPotential = deptStaff.filter(s => s.evaluationData && s.evaluationData.growth > 3.5).length / deptStaff.length * 100;

      return {
        department: dept,
        totalStaff: deptStaff.length,
        averageAge: Math.round(avgAge),
        averageTenure: Math.round(avgTenure * 10) / 10,
        retentionRate: 85 + Math.random() * 10, // シミュレーション値
        performanceScore: Math.round(avgPerformance / 20) / 10, // Convert 0-100 to 0-5 scale
        stressLevel: Math.round(avgStress),
        engagementScore: Math.round(avgEngagement),
        trainingCompletionRate: Math.round(trainingCompletion),
        leadershipPotential: Math.round(leadershipPotential),
        riskScore: Math.round((avgStress / 100) * (100 - avgEngagement) / 10)
      };
    }).filter(data => data !== null) as DepartmentCohortData[];
  }, [staffData, departments, selectedFacility]);

  // 比輁E��チE�Eタの準備
  const comparisonData = useMemo(() => {
    const metrics: ComparisonMetric[] = [
      { metric: '平坁E��齢' },
      { metric: '平坁E��続年数' },
      { metric: '定着玁E },
      { metric: 'パフォーマンス' },
      { metric: 'ストレスレベル' },
      { metric: 'エンゲージメンチE },
      { metric: '研修完亁E��' },
      { metric: 'リーダーシチE�E潜在劁E }
    ];

    selectedDepartments.forEach(dept => {
      const deptData = departmentCohortData.find(d => d.department === dept);
      if (deptData) {
        metrics[0][dept] = deptData.averageAge;
        metrics[1][dept] = deptData.averageTenure;
        metrics[2][dept] = deptData.retentionRate;
        metrics[3][dept] = deptData.performanceScore * 20; // スケール調整 (0-5 to 0-100)
        metrics[4][dept] = 100 - deptData.stressLevel; // 反転して良ぁE��を高く
        metrics[5][dept] = deptData.engagementScore;
        metrics[6][dept] = deptData.trainingCompletionRate;
        metrics[7][dept] = deptData.leadershipPotential;
      }
    });

    return metrics;
  }, [selectedDepartments, departmentCohortData]);

  // レーダーチャート用チE�Eタ
  const radarData = useMemo(() => {
    return comparisonData.map(item => {
      const normalized: any = { metric: item.metric };
      selectedDepartments.forEach(dept => {
        // 吁E��標を0-100にスケーリング
        let value = item[dept] || 0;
        if (item.metric === '平坁E��齢') value = (value / 60) * 100;
        if (item.metric === '平坁E��続年数') value = (value / 20) * 100;
        normalized[dept] = value;
      });
      return normalized;
    });
  }, [comparisonData, selectedDepartments]);

  // ランキングチE�Eタ
  const rankingData = useMemo(() => {
    const sorted = [...departmentCohortData].sort((a, b) => {
      switch (comparisonType) {
        case 'performance':
          return b.performanceScore - a.performanceScore;
        case 'risk':
          return a.riskScore - b.riskScore; // リスクは低い方が良ぁE        case 'development':
          return b.leadershipPotential - a.leadershipPotential;
        default:
          return 0;
      }
    });
    return sorted;
  }, [departmentCohortData, comparisonType]);

  const getMetricColor = (value: number, metric: string) => {
    if (metric === 'ストレスレベル' || metric === 'リスクスコア') {
      // 低い方が良ぁE��樁E      if (value > 70) return 'text-red-600';
      if (value > 50) return 'text-yellow-600';
      return 'text-green-600';
    } else {
      // 高い方が良ぁE��樁E      if (value > 80) return 'text-green-600';
      if (value > 60) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="部署別コホ�Eト比輁E />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">部署別コホ�Eト比輁E/h1>
            <p className="text-gray-600 mt-2">部署・職種別にコホ�Eト�E特性を比輁E��、絁E��課題を特宁E/p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium mb-2">比輁E��イチE/label>
                  <Select value={comparisonType} onValueChange={(value: any) => setComparisonType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">パフォーマンス</SelectItem>
                      <SelectItem value="risk">リスク刁E��</SelectItem>
                      <SelectItem value="development">成長・育戁E/SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">表示モーチE/label>
                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comparison">比輁E��ュー</SelectItem>
                      <SelectItem value="ranking">ランキング</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {viewMode === 'comparison' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">比輁E��象部署�E�最大3つ�E�E/label>
                  <div className="flex flex-wrap gap-2">
                    {departments.map(dept => (
                      <button
                        key={dept}
                        onClick={() => {
                          if (selectedDepartments.includes(dept)) {
                            setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
                          } else if (selectedDepartments.length < 3) {
                            setSelectedDepartments([...selectedDepartments, dept]);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedDepartments.includes(dept)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } ${!selectedDepartments.includes(dept) && selectedDepartments.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!selectedDepartments.includes(dept) && selectedDepartments.length >= 3}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* サマリーカーチE*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">総部署数</p>
                    <p className="text-2xl font-bold">{departments.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">最高パフォーマンス</p>
                    <p className="text-2xl font-bold">
                      {departmentCohortData.length > 0 
                        ? Math.max(...departmentCohortData.map(d => d.performanceScore)).toFixed(1)
                        : '0.0'}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">平坁E��トレス</p>
                    <p className="text-2xl font-bold">
                      {departmentCohortData.length > 0
                        ? Math.round(departmentCohortData.reduce((sum, d) => sum + d.stressLevel, 0) / departmentCohortData.length)
                        : '0'}%
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">高リスク部署</p>
                    <p className="text-2xl font-bold">
                      {departmentCohortData.filter(d => d.riskScore > 7).length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {viewMode === 'comparison' && selectedDepartments.length > 0 && (
            <>
              {/* 比輁E��ャーチE*/}
              <Card>
                <CardHeader>
                  <CardTitle>部署間比輁E/CardTitle>
                  <CardDescription>選択した部署の主要指標を比輁E/CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedDepartments.map((dept, index) => (
                        <Bar 
                          key={dept} 
                          dataKey={dept} 
                          fill={['#3b82f6', '#10b981', '#f59e0b'][index]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* レーダーチャーチE*/}
              <Card>
                <CardHeader>
                  <CardTitle>多面皁E��価</CardTitle>
                  <CardDescription>吁E��署の強み・弱みを可視化</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {selectedDepartments.map((dept, index) => (
                        <Radar
                          key={dept}
                          name={dept}
                          dataKey={dept}
                          stroke={['#3b82f6', '#10b981', '#f59e0b'][index]}
                          fill={['#3b82f6', '#10b981', '#f59e0b'][index]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 詳細比輁E��ーブル */}
              <Card>
                <CardHeader>
                  <CardTitle>詳細比輁E/CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            持E��E                          </th>
                          {selectedDepartments.map(dept => (
                            <th key={dept} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {dept}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {departmentCohortData.length > 0 && selectedDepartments.length > 0 && (
                          <>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                総人数
                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    {data?.totalStaff || 0}吁E                                  </td>
                                );
                              })}
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                パフォーマンススコア
                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${getMetricColor((data?.performanceScore || 0) * 20, 'パフォーマンス')}`}>
                                    {data?.performanceScore.toFixed(1) || '0.0'}
                                  </td>
                                );
                              })}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ストレスレベル
                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${getMetricColor(data?.stressLevel || 0, 'ストレスレベル')}`}>
                                    {data?.stressLevel || 0}%
                                  </td>
                                );
                              })}
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                エンゲージメンチE                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${getMetricColor(data?.engagementScore || 0, 'エンゲージメンチE)}`}>
                                    {data?.engagementScore || 0}%
                                  </td>
                                );
                              })}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                リスクスコア
                              </td>
                              {selectedDepartments.map(dept => {
                                const data = departmentCohortData.find(d => d.department === dept);
                                return (
                                  <td key={dept} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <Badge variant={data?.riskScore && data.riskScore > 7 ? 'destructive' : data?.riskScore && data.riskScore > 4 ? 'secondary' : 'default'}>
                                      {data?.riskScore || 0}
                                    </Badge>
                                  </td>
                                );
                              })}
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {viewMode === 'ranking' && (
            <>
              {/* ランキング表示 */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {comparisonType === 'performance' && 'パフォーマンスランキング'}
                    {comparisonType === 'risk' && 'リスクスコアランキング�E�低い頁E��E}
                    {comparisonType === 'development' && '育成�EチE��シャルランキング'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rankingData.map((dept, index) => (
                      <div key={dept.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-600'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{dept.department}</p>
                            <p className="text-sm text-gray-600">総人数: {dept.totalStaff}吁E/p>
                          </div>
                        </div>
                        <div className="text-right">
                          {comparisonType === 'performance' && (
                            <>
                              <p className="text-2xl font-bold text-blue-600">{dept.performanceScore.toFixed(1)}</p>
                              <p className="text-sm text-gray-600">パフォーマンススコア</p>
                            </>
                          )}
                          {comparisonType === 'risk' && (
                            <>
                              <p className="text-2xl font-bold text-red-600">{dept.riskScore}</p>
                              <p className="text-sm text-gray-600">リスクスコア</p>
                            </>
                          )}
                          {comparisonType === 'development' && (
                            <>
                              <p className="text-2xl font-bold text-green-600">{dept.leadershipPotential}%</p>
                              <p className="text-sm text-gray-600">リーダーシチE�E潜在劁E/p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* トレンドチャーチE*/}
              <Card>
                <CardHeader>
                  <CardTitle>部署別トレンチE/CardTitle>
                  <CardDescription>過去6ヶ月�E推移�E�シミュレーション�E�E/CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: '1朁E, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 70 + Math.random() * 20])) },
                      { month: '2朁E, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 72 + Math.random() * 20])) },
                      { month: '3朁E, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 75 + Math.random() * 20])) },
                      { month: '4朁E, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 73 + Math.random() * 20])) },
                      { month: '5朁E, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 78 + Math.random() * 20])) },
                      { month: '6朁E, ...Object.fromEntries(rankingData.slice(0, 5).map(d => [d.department, 80 + Math.random() * 20])) }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {rankingData.slice(0, 5).map((dept, index) => (
                        <Line
                          key={dept.department}
                          type="monotone"
                          dataKey={dept.department}
                          stroke={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {/* インサイトと推奨事頁E*/}
          <Card>
            <CardHeader>
              <CardTitle>刁E��結果からのインサイチE/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">高パフォーマンス部署の特徴</p>
                    <p className="text-sm text-gray-600">
                      パフォーマンスが高い部署は、エンゲージメントスコアも高く、ストレスレベルが適刁E��管琁E��れてぁE��す、E                      これら�E部署のベスト�EラクチE��スを他部署に展開することを推奨します、E                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">高リスク部署への対忁E/p>
                    <p className="text-sm text-gray-600">
                      リスクスコアが高い部署では、E��職玁E�E上�Eが予測されます、E                      早急な業務負荷の見直しとサポ�Eト体制の強化が忁E��です、E                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Heart className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">部署間連携の推進</p>
                    <p className="text-sm text-gray-600">
                      部署間でのノウハウ共有やジョブローチE�Eションを通じて、E                      絁E���E体�EレベルアチE�Eを図ることができます、E                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: '部署別コホ�Eト比輁E��ポ�EチE,
                facility: facilityParam || '全施設',
                reportType: 'department-cohort',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンローチE            </button>
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