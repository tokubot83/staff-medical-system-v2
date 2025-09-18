'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { obaraStaffDatabase, tachigamiStaffDatabase } from '@/app/data/staffData';
import { StaffDetail } from "@/types/staff";

interface CohortAnalysisTabProps {
  selectedFacility: string;
}

interface CohortData {
  year: number;
  quarter: string;
  startCount: number;
  currentCount: number;
  retentionRate: number;
  avgPerformance: number;
  avgEngagement: number;
}

interface GenerationData {
  generation: string;
  ageRange: string;
  count: number;
  retentionRate: number;
  avgTenure: number;
  turnoverRisk: 'low' | 'medium' | 'high';
}

export default function CohortAnalysisTab({ selectedFacility }: CohortAnalysisTabProps) {
  const [analysisType, setAnalysisType] = useState<'entry-year' | 'generation' | 'department'>('entry-year');
  const [metric, setMetric] = useState<'retention' | 'performance' | 'engagement'>('retention');

  // 施設に応じたスタッフデータを取得
  const staffData = useMemo(() => {
    if (selectedFacility === '小原病院') {
      return Object.values(obaraStaffDatabase);
    } else if (selectedFacility === '立神リハビリテーション温泉病院') {
      return Object.values(tachigamiStaffDatabase);
    } else {
      return [...Object.values(obaraStaffDatabase), ...Object.values(tachigamiStaffDatabase)];
    }
  }, [selectedFacility]);

  // 入社年別コホートデータの生成
  const entryCohortData = useMemo(() => {
    const currentYear = 2025;
    const cohorts: CohortData[] = [];

    for (let year = currentYear - 5; year <= currentYear; year++) {
      for (let q = 1; q <= 4; q++) {
        const yearsAgo = currentYear - year;
        const baseRetention = 100 - (yearsAgo * 15) - (Math.random() * 10);
        
        cohorts.push({
          year,
          quarter: `Q${q}`,
          startCount: Math.floor(Math.random() * 20) + 10,
          currentCount: Math.floor((Math.random() * 15) + 5),
          retentionRate: Math.max(0, Math.min(100, baseRetention + (Math.random() * 20 - 10))),
          avgPerformance: 3.5 + (Math.random() * 1),
          avgEngagement: 70 + (Math.random() * 20)
        });
      }
    }

    return cohorts.reverse();
  }, []);

  // 世代別データの生成
  const generationData = useMemo(() => {
    const generations: GenerationData[] = [
      {
        generation: 'Z世代',
        ageRange: '20-27歳',
        count: staffData.filter(s => s.age >= 20 && s.age <= 27).length,
        retentionRate: 65,
        avgTenure: 2.1,
        turnoverRisk: 'high'
      },
      {
        generation: 'ミレニアル世代',
        ageRange: '28-42歳',
        count: staffData.filter(s => s.age >= 28 && s.age <= 42).length,
        retentionRate: 75,
        avgTenure: 4.5,
        turnoverRisk: 'medium'
      },
      {
        generation: 'X世代',
        ageRange: '43-58歳',
        count: staffData.filter(s => s.age >= 43 && s.age <= 58).length,
        retentionRate: 85,
        avgTenure: 8.2,
        turnoverRisk: 'low'
      },
      {
        generation: 'ベビーブーマー',
        ageRange: '59-65歳',
        count: staffData.filter(s => s.age >= 59 && s.age <= 65).length,
        retentionRate: 90,
        avgTenure: 12.5,
        turnoverRisk: 'low'
      }
    ];

    return generations;
  }, [staffData]);

  // 部署別コホートデータ
  const departmentCohortData = useMemo(() => {
    const departments = Array.from(new Set(staffData.map(s => s.department)));
    return departments.map(dept => {
      const deptStaff = staffData.filter(s => s.department === dept);
      return {
        department: dept,
        count: deptStaff.length,
        retentionRate: 70 + Math.random() * 20,
        avgTenure: deptStaff.reduce((sum, s) => sum + parseFloat(s.tenure), 0) / deptStaff.length,
        newHires: Math.floor(Math.random() * 10),
        turnover: Math.floor(Math.random() * 5)
      };
    });
  }, [staffData]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">コホート分析</h2>
          <p className="text-gray-600">入社年次・世代別の定着状況と傾向分析</p>
        </div>
      </div>

      {/* 分析タイプ選択 */}
      <Card>
        <CardHeader>
          <CardTitle>分析設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">分析タイプ</label>
              <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry-year">入社年次別</SelectItem>
                  <SelectItem value="generation">世代別</SelectItem>
                  <SelectItem value="department">部署別</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">表示指標</label>
              <Select value={metric} onValueChange={(value: any) => setMetric(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retention">定着率</SelectItem>
                  <SelectItem value="performance">パフォーマンス</SelectItem>
                  <SelectItem value="engagement">エンゲージメント</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 入社年次別分析 */}
      {analysisType === 'entry-year' && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">直近1年定着率</p>
                    <p className="text-2xl font-bold">82.5%</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">3年定着率</p>
                    <p className="text-2xl font-bold">65.3%</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">定着率改善</p>
                    <p className="text-2xl font-bold">+5.2%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">早期離職率</p>
                    <p className="text-2xl font-bold">12.1%</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>入社年次別コホート追跡</CardTitle>
              <CardDescription>
                各入社年次の定着状況を時系列で追跡
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entryCohortData.filter((_, i) => i % 4 === 0).slice(0, 6).map(cohort => (
                  <div key={`${cohort.year}-${cohort.quarter}`} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{cohort.year}年 {cohort.quarter}</h4>
                      <Badge variant={cohort.retentionRate > 80 ? 'default' : cohort.retentionRate > 60 ? 'secondary' : 'destructive'}>
                        定着率 {cohort.retentionRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">入社時</p>
                        <p className="font-medium">{cohort.startCount}名</p>
                      </div>
                      <div>
                        <p className="text-gray-600">現在</p>
                        <p className="font-medium">{cohort.currentCount}名</p>
                      </div>
                      <div>
                        <p className="text-gray-600">平均評価</p>
                        <p className="font-medium">{cohort.avgPerformance.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">エンゲージメント</p>
                        <p className="font-medium">{cohort.avgEngagement.toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${cohort.retentionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 世代別分析 */}
      {analysisType === 'generation' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>世代別分析</CardTitle>
              <CardDescription>
                各世代の特性と定着傾向
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generationData.map(gen => (
                  <div key={gen.generation} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{gen.generation}</h4>
                        <p className="text-sm text-gray-600">{gen.ageRange}</p>
                      </div>
                      <Badge className={getRiskColor(gen.turnoverRisk)}>
                        離職リスク: {gen.turnoverRisk === 'low' ? '低' : gen.turnoverRisk === 'medium' ? '中' : '高'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">人数</p>
                        <p className="text-xl font-bold">{gen.count}名</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">定着率</p>
                        <p className="text-xl font-bold">{gen.retentionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">平均勤続年数</p>
                        <p className="text-xl font-bold">{gen.avgTenure}年</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">構成比</p>
                        <p className="text-xl font-bold">
                          {((gen.count / staffData.length) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>世代別特性と推奨施策</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Z世代（20-27歳）</p>
                    <p className="text-sm text-gray-600">
                      キャリア開発機会の提供、メンタリング制度、柔軟な働き方の導入が効果的
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">ミレニアル世代（28-42歳）</p>
                    <p className="text-sm text-gray-600">
                      スキルアップ支援、ワークライフバランス、昇進機会の明確化が重要
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">X世代・ベビーブーマー（43歳以上）</p>
                    <p className="text-sm text-gray-600">
                      経験の活用、知識継承の機会提供、健康管理支援が定着に寄与
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 部署別分析 */}
      {analysisType === 'department' && (
        <Card>
          <CardHeader>
            <CardTitle>部署別コホート分析</CardTitle>
            <CardDescription>
              各部署の人材定着状況と動向
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">部署</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">人数</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">定着率</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">平均勤続</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">新規採用</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">離職者数</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentCohortData.map(dept => (
                    <tr key={dept.department}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept.department}</td>
                      <td className="px-4 py-3 text-sm text-center">{dept.count}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <Badge variant={dept.retentionRate > 80 ? 'default' : 'secondary'}>
                          {dept.retentionRate.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">{dept.avgTenure.toFixed(1)}年</td>
                      <td className="px-4 py-3 text-sm text-center text-green-600">+{dept.newHires}</td>
                      <td className="px-4 py-3 text-sm text-center text-red-600">-{dept.turnover}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* トレンド分析 */}
      <Card>
        <CardHeader>
          <CardTitle>定着率トレンド</CardTitle>
          <CardDescription>
            過去3年間の定着率推移（実装時はRechartsでグラフ化）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">定着率推移グラフ</p>
              <p className="text-sm text-gray-400 mt-2">
                2023年: 68% → 2024年: 72% → 2025年: 75%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}