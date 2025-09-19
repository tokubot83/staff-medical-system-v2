'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Chart, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// シミュレーション施策
const interventions = [
  { id: 'salary', name: '給与改善（5%アップ）', cost: 50000000, effect: 2.5 },
  { id: 'mentor', name: 'メンター制度導入', cost: 10000000, effect: 3.2 },
  { id: 'wlb', name: 'ワークライフバランス改善', cost: 15000000, effect: 2.8 },
  { id: 'training', name: '研修プログラム拡充', cost: 20000000, effect: 2.0 },
  { id: 'flexible', name: 'フレックスタイム導入', cost: 5000000, effect: 1.8 },
  { id: 'career', name: 'キャリアパス明確化', cost: 8000000, effect: 2.3 }
];

function RetentionSimulatorContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  
  const baseRetentionRate = 75; // 基準定着率
  const currentHeadcount = 500; // 現在の職員数
  const averageSalary = 4500000; // 平均年収
  const recruitmentCost = 1500000; // 採用コスト/人

  // 施策選択の切り替え
  const toggleIntervention = (id: string) => {
    setSelectedInterventions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // シミュレーション実行
  const runSimulation = () => {
    const selected = interventions.filter(i => selectedInterventions.includes(i.id));
    const totalCost = selected.reduce((sum, i) => sum + i.cost, 0);
    const totalEffect = selected.reduce((sum, i) => sum + i.effect, 0);
    
    // 相乗効果を考慮（複数施策で効果が増幅）
    const synergyBonus = selected.length > 1 ? (selected.length - 1) * 0.5 : 0;
    const adjustedEffect = totalEffect + synergyBonus;
    
    const newRetentionRate = Math.min(95, baseRetentionRate + adjustedEffect);
    const retentionImprovement = newRetentionRate - baseRetentionRate;
    
    // 5年間の予測
    const projections = [];
    for (let year = 0; year <= 5; year++) {
      const baseAttrition = currentHeadcount * (100 - baseRetentionRate) / 100;
      const newAttrition = currentHeadcount * (100 - newRetentionRate) / 100;
      const savedAttrition = baseAttrition - newAttrition;
      const savedCost = savedAttrition * recruitmentCost;
      
      projections.push({
        year,
        baseRetention: baseRetentionRate,
        newRetention: newRetentionRate,
        savedEmployees: Math.round(savedAttrition * year),
        savedCost: savedCost * year,
        roi: year === 0 ? 0 : ((savedCost * year - totalCost) / totalCost * 100)
      });
    }

    setSimulationResult({
      selected,
      totalCost,
      totalEffect: adjustedEffect,
      newRetentionRate,
      retentionImprovement,
      projections,
      breakEvenYear: projections.find(p => p.roi > 0)?.year || null
    });
  };

  // 予測グラフデータ
  const projectionChartData = simulationResult ? {
    labels: simulationResult.projections.map((p: any) => `${p.year}年目`),
    datasets: [
      {
        label: '現在の定着率',
        data: simulationResult.projections.map((p: any) => p.baseRetention),
        borderColor: 'rgb(156, 163, 175)',
        borderDash: [5, 5],
        fill: false
      },
      {
        label: '施策後の定着率',
        data: simulationResult.projections.map((p: any) => p.newRetention),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true
      }
    ]
  } : null;

  // ROIグラフデータ
  const roiChartData = simulationResult ? {
    labels: simulationResult.projections.map((p: any) => `${p.year}年目`),
    datasets: [
      {
        label: '節約額（累計）',
        data: simulationResult.projections.map((p: any) => p.savedCost),
        type: 'line' as const,
        borderColor: 'rgb(34, 197, 94)',
        yAxisID: 'y'
      },
      {
        label: '投資額',
        data: simulationResult.projections.map(() => simulationResult.totalCost),
        type: 'line' as const,
        borderColor: 'rgb(239, 68, 68)',
        borderDash: [5, 5],
        yAxisID: 'y'
      },
      {
        label: 'ROI (%)',
        data: simulationResult.projections.map((p: any) => p.roi),
        type: 'bar' as const,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y1'
      }
    ]
  } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔮</span>
            <h1 className="text-2xl font-bold text-gray-900">定着シミュレーター</h1>
          </div>
          <p className="text-gray-600">
            各種施策の導入による定着率の変化とROIをシミュレーションします。
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* 現状サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">現在の定着率</p>
            <p className="text-2xl font-bold">{baseRetentionRate}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">年間離職者数</p>
            <p className="text-2xl font-bold">{Math.round(currentHeadcount * (100 - baseRetentionRate) / 100)}名</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">採用コスト/人</p>
            <p className="text-2xl font-bold">¥{(recruitmentCost ?? 0).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">年間採用コスト</p>
            <p className="text-2xl font-bold">¥{(Math.round(currentHeadcount * (100 - baseRetentionRate) / 100) * (recruitmentCost ?? 0)).toLocaleString()}</p>
          </div>
        </div>

        {/* 施策選択 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">施策選択</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interventions.map(intervention => (
              <div
                key={intervention.id}
                onClick={() => toggleIntervention(intervention.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedInterventions.includes(intervention.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{intervention.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      効果: +{intervention.effect}% | 投資額: ¥{(intervention.cost ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedInterventions.includes(intervention.id)}
                    onChange={() => {}}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">選択した施策数: {selectedInterventions.length}</p>
              <p className="text-sm text-gray-600">
                総投資額: ¥{interventions
                  .filter(i => selectedInterventions.includes(i.id))
                  .reduce((sum, i) => sum + i.cost, 0)
                  .toLocaleString() ?? '0'}
              </p>
            </div>
            <button
              onClick={runSimulation}
              disabled={selectedInterventions.length === 0}
              className={`px-6 py-2 rounded-lg font-medium ${
                selectedInterventions.length > 0
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              シミュレーション実行
            </button>
          </div>
        </div>

        {/* シミュレーション結果 */}
        {simulationResult && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">シミュレーション結果</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">予測定着率</p>
                  <p className="text-3xl font-bold text-green-600">
                    {simulationResult.newRetentionRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-600">
                    (+{simulationResult.retentionImprovement.toFixed(1)}%)
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">年間削減離職者数</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Math.round(currentHeadcount * simulationResult.retentionImprovement / 100)}名
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">投資回収期間</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {simulationResult.breakEvenYear || '---'}年
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">定着率予測</h4>
                  <Line data={projectionChartData!} options={{
                    scales: {
                      y: {
                        min: 70,
                        max: 100,
                        title: { display: true, text: '定着率 (%)' }
                      }
                    }
                  }} />
                </div>
                <div>
                  <h4 className="font-medium mb-2">投資対効果（ROI）</h4>
                  <Chart type='bar' data={roiChartData!} options={{
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: '金額（円）' }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'ROI (%)' },
                        grid: { drawOnChartArea: false }
                      }
                    }
                  }} />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-2">推奨アクション</h4>
              <ul className="list-disc list-inside text-green-800 space-y-1">
                {simulationResult.selected.map((intervention: any) => (
                  <li key={intervention.id}>{intervention.name}を優先的に実施</li>
                ))}
                <li>実施後3ヶ月ごとに効果測定を実施</li>
                <li>効果が低い施策は随時見直し</li>
              </ul>
            </div>
          </div>
        )}

        <DataComment
          comment="複数施策の組み合わせにより相乗効果が期待できます。特にメンター制度と給与改善の組み合わせが効果的です。"
          details={[
            '投資回収期間は平均2-3年',
            '早期実施により累積効果が大きくなる',
            '定期的な効果測定により施策の最適化が可能'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function RetentionSimulatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RetentionSimulatorContent />
    </Suspense>
  );
}