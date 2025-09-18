'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Activity, AlertCircle, TrendingUp, Shield, Smile, Users } from 'lucide-react';
import { obaraStaffDatabase, tachigamiStaffDatabase } from '@/app/data/staffData';
import { StaffDetail } from "@/types/staff";

interface WellbeingTabProps {
  selectedFacility: string;
}

interface WellbeingMetric {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  risk: 'low' | 'medium' | 'high';
  description: string;
}

interface StressFactorAnalysis {
  factor: string;
  impact: number;
  affectedCount: number;
  severity: 'low' | 'medium' | 'high';
}

export default function WellbeingTab({ selectedFacility }: WellbeingTabProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'detail' | 'intervention'>('overview');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [timeRange, setTimeRange] = useState('current');

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

  // 部署一覧を取得
  const departments = useMemo(() => {
    const deptSet = new Set(staffData.map(staff => staff.department));
    return Array.from(deptSet).sort();
  }, [staffData]);

  // フィルタリングされたスタッフ
  const filteredStaff = useMemo(() => {
    return staffData.filter(staff => 
      selectedDepartment === 'all' || staff.department === selectedDepartment
    );
  }, [staffData, selectedDepartment]);

  // ウェルビーイング指標の計算
  const wellbeingMetrics = useMemo(() => {
    const metrics: WellbeingMetric[] = [
      {
        category: '身体的健康',
        score: 78,
        trend: 'up',
        risk: 'low',
        description: '健康診断結果と運動習慣から算出'
      },
      {
        category: 'メンタルヘルス',
        score: 72,
        trend: 'stable',
        risk: 'medium',
        description: 'ストレスチェックとカウンセリング利用率'
      },
      {
        category: 'ワークエンゲージメント',
        score: 68,
        trend: 'down',
        risk: 'medium',
        description: '仕事への熱意と活力の指標'
      },
      {
        category: '職場環境満足度',
        score: 75,
        trend: 'up',
        risk: 'low',
        description: '物理的環境と人間関係の評価'
      },
      {
        category: 'ワークライフバランス',
        score: 65,
        trend: 'down',
        risk: 'high',
        description: '残業時間と有給取得率から評価'
      },
      {
        category: '心理的安全性',
        score: 71,
        trend: 'stable',
        risk: 'medium',
        description: 'チーム内での発言しやすさ'
      }
    ];
    return metrics;
  }, []);

  // 総合ウェルビーイングスコア
  const overallWellbeingScore = useMemo(() => {
    return Math.round(wellbeingMetrics.reduce((sum, m) => sum + m.score, 0) / wellbeingMetrics.length);
  }, [wellbeingMetrics]);

  // ストレス要因分析
  const stressFactors: StressFactorAnalysis[] = [
    {
      factor: '慢性的な人手不足',
      impact: 85,
      affectedCount: Math.floor(filteredStaff.length * 0.7),
      severity: 'high'
    },
    {
      factor: '業務量の増加',
      impact: 78,
      affectedCount: Math.floor(filteredStaff.length * 0.6),
      severity: 'high'
    },
    {
      factor: '休憩時間の不足',
      impact: 72,
      affectedCount: Math.floor(filteredStaff.length * 0.5),
      severity: 'medium'
    },
    {
      factor: 'コミュニケーション不足',
      impact: 65,
      affectedCount: Math.floor(filteredStaff.length * 0.4),
      severity: 'medium'
    },
    {
      factor: '評価制度への不満',
      impact: 58,
      affectedCount: Math.floor(filteredStaff.length * 0.3),
      severity: 'low'
    }
  ];

  // 高リスク者の特定
  const highRiskStaff = useMemo(() => {
    return filteredStaff.filter(staff => 
      staff.stressIndex > 70 || (staff.healthScore !== undefined && staff.healthScore < 60)
    );
  }, [filteredStaff]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">ウェルビーイング分析</h2>
          <p className="text-gray-600">従業員の健康と幸福度の総合評価</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            onClick={() => setViewMode('overview')}
            size="sm"
          >
            概要
          </Button>
          <Button
            variant={viewMode === 'detail' ? 'default' : 'outline'}
            onClick={() => setViewMode('detail')}
            size="sm"
          >
            詳細分析
          </Button>
          <Button
            variant={viewMode === 'intervention' ? 'default' : 'outline'}
            onClick={() => setViewMode('intervention')}
            size="sm"
          >
            介入提案
          </Button>
        </div>
      </div>

      {/* フィルター */}
      <Card>
        <CardHeader>
          <CardTitle>分析設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">部署</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部署</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">期間</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">現在</SelectItem>
                  <SelectItem value="1month">過去1ヶ月</SelectItem>
                  <SelectItem value="3months">過去3ヶ月</SelectItem>
                  <SelectItem value="1year">過去1年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 概要表示 */}
      {viewMode === 'overview' && (
        <>
          {/* サマリーカード */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">総合スコア</p>
                    <p className="text-3xl font-bold">{overallWellbeingScore}</p>
                    <p className="text-xs text-gray-500">/ 100</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">高リスク者</p>
                    <p className="text-3xl font-bold">{highRiskStaff.length}</p>
                    <p className="text-xs text-gray-500">要フォロー</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">平均ストレス</p>
                    <p className="text-3xl font-bold">62</p>
                    <p className="text-xs text-gray-500">/ 100</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">改善傾向</p>
                    <p className="text-3xl font-bold">+3.2%</p>
                    <p className="text-xs text-gray-500">前月比</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ウェルビーイング指標 */}
          <Card>
            <CardHeader>
              <CardTitle>ウェルビーイング指標</CardTitle>
              <CardDescription>
                6つの観点から従業員の幸福度を評価
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wellbeingMetrics.map(metric => (
                  <div key={metric.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{metric.category}</span>
                        <span className={`text-sm ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {getTrendIcon(metric.trend)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(metric.risk)}>
                          リスク: {metric.risk === 'low' ? '低' : metric.risk === 'medium' ? '中' : '高'}
                        </Badge>
                        <span className="font-semibold">{metric.score}/100</span>
                      </div>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 詳細分析表示 */}
      {viewMode === 'detail' && (
        <>
          {/* ストレス要因分析 */}
          <Card>
            <CardHeader>
              <CardTitle>主要ストレス要因</CardTitle>
              <CardDescription>
                従業員の健康に影響を与える要因の分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stressFactors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{factor.factor}</h4>
                      <Badge className={getRiskColor(factor.severity)}>
                        影響度: {factor.severity === 'low' ? '低' : factor.severity === 'medium' ? '中' : '高'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">影響度</span>
                        <span className="font-medium">{factor.impact}%</span>
                      </div>
                      <Progress value={factor.impact} className="h-2" />
                      <p className="text-sm text-gray-600">
                        影響を受けている従業員: {factor.affectedCount}名 
                        ({((factor.affectedCount / filteredStaff.length) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 部署別分析 */}
          <Card>
            <CardHeader>
              <CardTitle>部署別ウェルビーイング状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">部署</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">総合スコア</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">ストレス平均</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">高リスク者</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">改善優先度</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departments.map(dept => {
                      const deptStaff = staffData.filter(s => s.department === dept);
                      const avgStress = Math.round(deptStaff.reduce((sum, s) => sum + s.stressIndex, 0) / deptStaff.length);
                      const highRisk = deptStaff.filter(s => s.stressIndex > 70).length;
                      const score = 100 - avgStress;
                      
                      return (
                        <tr key={dept}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept}</td>
                          <td className="px-4 py-3 text-sm text-center">{score}</td>
                          <td className="px-4 py-3 text-sm text-center">{avgStress}%</td>
                          <td className="px-4 py-3 text-sm text-center">{highRisk}名</td>
                          <td className="px-4 py-3 text-sm text-center">
                            <Badge variant={avgStress > 70 ? 'destructive' : avgStress > 50 ? 'secondary' : 'default'}>
                              {avgStress > 70 ? '高' : avgStress > 50 ? '中' : '低'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 介入提案表示 */}
      {viewMode === 'intervention' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>推奨介入プログラム</CardTitle>
              <CardDescription>
                現状分析に基づく改善施策の提案
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-red-50">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-red-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900">緊急対応が必要</h4>
                      <p className="text-sm text-red-700 mt-1">
                        高ストレス部署への即時介入プログラム
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-red-600">
                        <li>• 産業医による個別面談の実施（対象: {highRiskStaff.length}名）</li>
                        <li>• ストレスマネジメント研修の緊急開催</li>
                        <li>• 業務負荷の見直しと人員配置の最適化</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-start gap-3">
                    <Activity className="h-6 w-6 text-yellow-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900">短期施策（1-3ヶ月）</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        ワークライフバランスの改善
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-yellow-600">
                        <li>• フレックスタイム制度の導入検討</li>
                        <li>• リフレッシュルームの設置</li>
                        <li>• 定期的な1on1ミーティングの実施</li>
                        <li>• 健康増進プログラムの開始</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-start gap-3">
                    <Smile className="h-6 w-6 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">中長期施策（3-12ヶ月）</h4>
                      <p className="text-sm text-green-700 mt-1">
                        組織文化の変革
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-green-600">
                        <li>• 心理的安全性を高めるワークショップ</li>
                        <li>• メンタルヘルスケアシステムの構築</li>
                        <li>• 従業員エンゲージメント向上プログラム</li>
                        <li>• ウェルビーイング推進委員会の設立</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 予想効果 */}
          <Card>
            <CardHeader>
              <CardTitle>施策実施による予想効果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">定量的効果</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>ストレス指数の低減</span>
                      <span className="font-medium text-green-600">-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>離職率の改善</span>
                      <span className="font-medium text-green-600">-3.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>生産性向上</span>
                      <span className="font-medium text-green-600">+8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>病欠日数の減少</span>
                      <span className="font-medium text-green-600">-20%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">定性的効果</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <span>職場の雰囲気改善</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <span>チームワークの向上</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <span>組織へのロイヤリティ向上</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      <span>イノベーション創出</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* アラート */}
      {highRiskStaff.length > 10 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">注意: 高リスク者が多数検出されています</p>
                <p className="text-sm text-red-700 mt-1">
                  {highRiskStaff.length}名の従業員が高ストレス状態にあります。
                  早急な対応が必要です。産業医との連携を推奨します。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}