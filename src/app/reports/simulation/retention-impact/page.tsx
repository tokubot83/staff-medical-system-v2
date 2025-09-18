'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { exportToPDF } from '@/utils/pdfExport';
import { staffDatabase } from '@/app/data/staffData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';

// リテンション施策の定義
const retentionStrategies = {
  workLifeBalance: {
    name: 'ワークライフバランス改善',
    cost: 5000000,
    impact: {
      overtime: -20,
      paidLeaveRate: 15,
      stressIndex: -10,
      engagement: 10
    }
  },
  careerDevelopment: {
    name: 'キャリア開発プログラム',
    cost: 8000000,
    impact: {
      skills: 15,
      growth: 20,
      engagement: 15,
      performance: 10
    }
  },
  compensation: {
    name: '報酬制度改革',
    cost: 15000000,
    impact: {
      satisfaction: 25,
      engagement: 20,
      performance: 5,
      retention: 15
    }
  },
  wellness: {
    name: 'ウェルネスプログラム',
    cost: 3000000,
    impact: {
      healthScore: 10,
      stressIndex: -15,
      engagement: 8,
      paidLeaveRate: 10
    }
  },
  recognition: {
    name: '表彰・評価制度強化',
    cost: 2000000,
    impact: {
      engagement: 12,
      performance: 8,
      teamwork: 10,
      satisfaction: 15
    }
  }
};

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  const [selectedFacility, setSelectedFacility] = useState(facilityParam || '全施設');
  const [selectedDepartment, setSelectedDepartment] = useState('全部署');
  const [selectedStrategies, setSelectedStrategies] = useState(['workLifeBalance', 'careerDevelopment']);
  const [implementationPeriod, setImplementationPeriod] = useState(12); // months

  // 現在の離職リスク分析
  const currentTurnoverRisk = useMemo(() => {
    const staffList = Object.values(staffDatabase).filter(staff => {
      if (selectedFacility !== '全施設' && staff.facility !== selectedFacility) return false;
      if (selectedDepartment !== '全部署' && staff.department !== selectedDepartment) return false;
      return true;
    });

    // リスクレベル別に分類
    const riskLevels = { high: 0, medium: 0, low: 0 };
    const departmentRisks: { [key: string]: { total: number; risk: number } } = {};

    staffList.forEach(staff => {
      const riskScore = (staff.stressIndex / 100) * 0.3 + 
                       (1 - staff.engagement / 100) * 0.3 +
                       (staff.overtime > 30 ? 0.2 : 0) +
                       (staff.paidLeaveRate < 50 ? 0.2 : 0);
      
      if (riskScore > 0.6) riskLevels.high++;
      else if (riskScore > 0.3) riskLevels.medium++;
      else riskLevels.low++;

      if (!departmentRisks[staff.department]) {
        departmentRisks[staff.department] = { total: 0, risk: 0 };
      }
      departmentRisks[staff.department].total++;
      if (riskScore > 0.6) departmentRisks[staff.department].risk++;
    });

    return {
      total: staffList.length,
      riskLevels,
      departmentRisks: Object.entries(departmentRisks).map(([dept, data]) => ({
        department: dept,
        riskRate: (data.risk / data.total) * 100,
        count: data.risk
      })).sort((a, b) => b.riskRate - a.riskRate)
    };
  }, [selectedFacility, selectedDepartment]);

  // 施策実施後の効果予測
  const impactPrediction = useMemo(() => {
    const baseline = {
      turnoverRate: 12, // %
      engagement: 75,
      stressIndex: 45,
      overtime: 20,
      paidLeaveRate: 60
    };

    let totalCost = 0;
    let predictedMetrics = { ...baseline };

    selectedStrategies.forEach(strategyKey => {
      const strategy = retentionStrategies[strategyKey as keyof typeof retentionStrategies];
      totalCost += strategy.cost;
      
      // 各施策の影響を計算
      if (strategy.impact.engagement) {
        predictedMetrics.engagement += strategy.impact.engagement;
      }
      if ('stressIndex' in strategy.impact && strategy.impact.stressIndex) {
        predictedMetrics.stressIndex += strategy.impact.stressIndex;
      }
      if ('overtime' in strategy.impact && strategy.impact.overtime) {
        predictedMetrics.overtime = Math.max(0, predictedMetrics.overtime + strategy.impact.overtime);
      }
      if ('paidLeaveRate' in strategy.impact && strategy.impact.paidLeaveRate) {
        predictedMetrics.paidLeaveRate = Math.min(100, predictedMetrics.paidLeaveRate + strategy.impact.paidLeaveRate);
      }
    });

    // 離職率の改善を計算
    const improvementFactor = (predictedMetrics.engagement - baseline.engagement) * 0.02 +
                            (baseline.stressIndex - predictedMetrics.stressIndex) * 0.01 +
                            (baseline.overtime - predictedMetrics.overtime) * 0.005 +
                            (predictedMetrics.paidLeaveRate - baseline.paidLeaveRate) * 0.005;
    
    predictedMetrics.turnoverRate = Math.max(5, baseline.turnoverRate - improvementFactor);

    return {
      baseline,
      predicted: predictedMetrics,
      totalCost,
      roi: ((baseline.turnoverRate - predictedMetrics.turnoverRate) * currentTurnoverRisk.total * 5000000 - totalCost) / totalCost * 100
    };
  }, [selectedStrategies, currentTurnoverRisk.total]);

  // 時系列での効果シミュレーション
  const timeSeriesImpact = useMemo(() => {
    const months = [];
    const baseline = impactPrediction.baseline.turnoverRate;
    const target = impactPrediction.predicted.turnoverRate;
    
    for (let i = 0; i <= implementationPeriod; i++) {
      const progress = i / implementationPeriod;
      const easeProgress = 1 - Math.pow(1 - progress, 2); // イージング効果
      
      months.push({
        month: `${i}ヶ月`,
        離職率: baseline - (baseline - target) * easeProgress,
        エンゲージメント: 75 + (impactPrediction.predicted.engagement - 75) * easeProgress,
        ストレス指数: 45 + (impactPrediction.predicted.stressIndex - 45) * easeProgress
      });
    }
    
    return months;
  }, [implementationPeriod, impactPrediction]);

  // 施策組み合わせの効果比較
  const strategyComparison = useMemo(() => {
    return Object.entries(retentionStrategies).map(([key, strategy]) => {
      const isSelected = selectedStrategies.includes(key);
      const costPerEmployee = currentTurnoverRisk.total > 0 ? strategy.cost / currentTurnoverRisk.total : 0;
      
      // 各施策の効果スコアを計算
      let effectScore = 0;
      Object.values(strategy.impact).forEach(value => {
        effectScore += Math.abs(value);
      });
      
      const costInMillion = strategy.cost / 1000000;
      return {
        name: strategy.name,
        cost: costInMillion, // 百万円単位
        効果スコア: effectScore,
        コスト効率: costInMillion > 0 ? effectScore / costInMillion : 0,
        selected: isSelected
      };
    });
  }, [selectedStrategies, currentTurnoverRisk.total]);

  // フィルター用のリスト
  const facilities = useMemo(() => {
    const facilitySet = new Set(Object.values(staffDatabase).map(s => s.facility));
    return ['全施設', ...Array.from(facilitySet)];
  }, []);

  const departments = useMemo(() => {
    const staffList = selectedFacility === '全施設' 
      ? Object.values(staffDatabase)
      : Object.values(staffDatabase).filter(s => s.facility === selectedFacility);
    const deptSet = new Set(staffList.map(s => s.department));
    return ['全部署', ...Array.from(deptSet)];
  }, [selectedFacility]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="リテンション施策効果予測" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold">リテンション施策効果予測</h1>
            <p className="text-gray-600 mt-2">施策別の効果予測とコスト対効果の分析</p>
            {facilityParam && (
              <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
            )}
          </div>

          {/* フィルター */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">施設</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">部署</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">実施期間</label>
                <select
                  value={implementationPeriod}
                  onChange={(e) => setImplementationPeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={6}>6ヶ月</option>
                  <option value={12}>12ヶ月</option>
                  <option value={18}>18ヶ月</option>
                  <option value={24}>24ヶ月</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">実施施策の選択</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(retentionStrategies).map(([key, strategy]) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStrategies.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStrategies([...selectedStrategies, key]);
                        } else {
                          setSelectedStrategies(selectedStrategies.filter(s => s !== key));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">{strategy.name} (¥{(strategy.cost / 1000000).toFixed(1)}M)</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 現在の離職リスク状況 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>高リスク職員数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {currentTurnoverRisk.riskLevels.high}名
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  全体の{((currentTurnoverRisk.riskLevels.high / currentTurnoverRisk.total) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>予測離職率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {impactPrediction.baseline.turnoverRate}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  現在の状況を維持した場合
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>施策実施後の離職率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {impactPrediction.predicted.turnoverRate.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {(impactPrediction.baseline.turnoverRate - impactPrediction.predicted.turnoverRate).toFixed(1)}%改善
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 施策効果の時系列推移 */}
          <Card>
            <CardHeader>
              <CardTitle>施策効果の時系列推移</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '6px',
                        padding: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="離職率" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="離職率 (%)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="エンゲージメント" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="エンゲージメント"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="ストレス指数" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="ストレス指数"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 施策別コスト効率分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>施策別効果スコア</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {strategyComparison.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      データがありません
                    </div>
                  ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={strategyComparison} 
                      layout="horizontal"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip 
                        formatter={(value: number) => value.toFixed(1)}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '6px',
                          padding: '10px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                      <Legend />
                      <Bar dataKey="効果スコア" fill="#3B82F6" isAnimationActive={false} />
                      <Bar dataKey="コスト効率" fill="#10B981" isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>部署別離職リスク</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">部署</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">リスク率</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">人数</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTurnoverRisk.departmentRisks.slice(0, 10).map((dept, index) => (
                        <tr key={dept.department} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2 text-sm text-gray-900">{dept.department}</td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{ width: `${dept.riskRate}%` }}
                                />
                              </div>
                              <span className="text-xs">{dept.riskRate.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">{dept.count}名</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI分析と推奨事項 */}
          <Card>
            <CardHeader>
              <CardTitle>投資対効果（ROI）分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">施策投資額</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      ¥{(impactPrediction.totalCost ?? 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      選択した{selectedStrategies.length}つの施策の合計
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">予想削減コスト</h4>
                    <p className="text-2xl font-bold text-green-600">
                      ¥{Math.round(((impactPrediction.baseline?.turnoverRate ?? 0) - (impactPrediction.predicted?.turnoverRate ?? 0)) * (currentTurnoverRisk?.total ?? 0) * 500000).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      離職率改善による採用・研修コスト削減
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">ROI</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {impactPrediction.roi.toFixed(1)}%
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      {implementationPeriod}ヶ月での投資回収率
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">優先実施推奨施策</h4>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                      {strategyComparison
                        .filter(s => s.selected)
                        .sort((a, b) => b.コスト効率 - a.コスト効率)
                        .slice(0, 3)
                        .map(strategy => (
                          <li key={strategy.name}>
                            {strategy.name}（コスト効率: {strategy.コスト効率.toFixed(1)}）
                          </li>
                        ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">実施上の推奨事項</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>段階的な導入により効果を検証</li>
                      <li>高リスク部署から優先的に実施</li>
                      <li>定期的な効果測定とフィードバック</li>
                      <li>職員の声を反映した施策の調整</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-4">
            <button 
              onClick={() => exportToPDF({
                title: 'リテンション施策効果予測レポート',
                facility: selectedFacility,
                reportType: 'retention-impact',
                elementId: 'report-content',
                dateRange: `実施期間: ${implementationPeriod}ヶ月`
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}