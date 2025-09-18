'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
import CategoryBackButton from '@/components/reports/CategoryBackButton';
import DataComment from '@/components/DataComment';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// チE��チE�Eタ生�E
const generateCostData = () => {
  const departments = ['看護部', '医療技術部', 'リハビリ部', '事務部', '薬剤部'];
  const positions = ['新人', '中堁E, '主任', '師長', '部長'];
  
  return {
    totalCost: {
      direct: 125000000, // 1.25儁E�E
      indirect: 87500000, // 0.875儁E�E
      opportunity: 62500000 // 0.625儁E�E
    },
    byDepartment: departments.map(dept => ({
      department: dept,
      directCost: Math.floor(15000000 + Math.random() * 20000000),
      indirectCost: Math.floor(10000000 + Math.random() * 15000000),
      opportunityCost: Math.floor(7500000 + Math.random() * 10000000),
      turnoverRate: 8 + Math.random() * 6,
      headcount: Math.floor(50 + Math.random() * 150)
    })),
    byPosition: positions.map(pos => ({
      position: pos,
      averageCost: Math.floor(1000000 + Math.random() * 4000000),
      replacementTime: Math.floor(30 + Math.random() * 90),
      productivityLoss: Math.floor(20 + Math.random() * 40)
    })),
    costBreakdown: {
      '採用コスチE: 35,
      '研修コスチE: 25,
      '生産性低丁E: 20,
      '既存スタチE��負拁E: 12,
      'そ�E仁E: 8
    },
    monthlyTrend: Array.from({length: 12}, (_, i) => ({
      month: `2024/${i + 1}`,
      cost: Math.floor(18000000 + Math.random() * 7000000),
      count: Math.floor(5 + Math.random() * 10)
    })),
    roi: {
      currentCost: 275000000,
      projectedCost: 192500000,
      investment: 30000000,
      paybackPeriod: 4.3
    }
  };
};

function CostImpactContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [costData] = useState(generateCostData());
  const [selectedView, setSelectedView] = useState('overview');

  // 総コスト構�EチャーチE
  const totalCostChart = {
    labels: ['直接コスチE, '間接コスチE, '機会損失'],
    datasets: [{
      data: [
        costData.totalCost.direct,
        costData.totalCost.indirect,
        costData.totalCost.opportunity
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(245, 158, 11)',
        'rgb(59, 130, 246)'
      ],
      borderWidth: 2
    }]
  };

  // 部署別コストチャーチE
  const departmentCostChart = {
    labels: costData.byDepartment.map(d => d.department),
    datasets: [
      {
        label: '直接コスチE,
        data: costData.byDepartment.map(d => d.directCost),
        backgroundColor: 'rgba(239, 68, 68, 0.8)'
      },
      {
        label: '間接コスチE,
        data: costData.byDepartment.map(d => d.indirectCost),
        backgroundColor: 'rgba(245, 158, 11, 0.8)'
      },
      {
        label: '機会損失',
        data: costData.byDepartment.map(d => d.opportunityCost),
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  };

  // コスト�E訳チャーチE
  const costBreakdownChart = {
    labels: Object.keys(costData.costBreakdown),
    datasets: [{
      data: Object.values(costData.costBreakdown),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ]
    }]
  };

  // 月次トレンドチャーチE
  const monthlyTrendChart = {
    labels: costData.monthlyTrend.map(d => d.month),
    datasets: [{
      label: '離職コスト（�E�E�E,
      data: costData.monthlyTrend.map(d => d.cost),
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.3
    }]
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="離職コスト影響刁E��" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💰</span>
            <h1 className="text-2xl font-bold text-gray-900">離職コスト影響刁E��</h1>
          </div>
          <p className="text-gray-600">
            離職による財務的影響を定量化し、投賁E��効果�E高い改喁E��策を特定します、E
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* サマリーカーチE*/}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">年間総離職コスチE/p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(costData.totalCost.direct + costData.totalCost.indirect + costData.totalCost.opportunity)}
            </p>
            <p className="text-xs text-gray-500">売上高�E紁E.2%</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">1人あたり平坁E��スチE/p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(2750000)}
            </p>
            <p className="text-xs text-gray-500">年収�E紁E.5倁E/p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">採用・研修期間</p>
            <p className="text-2xl font-bold text-blue-600">92日</p>
            <p className="text-xs text-gray-500">生産性50%低丁E/p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">削減可能コスチE/p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(82500000)}
            </p>
            <p className="text-xs text-gray-500">30%削減可能</p>
          </div>
        </div>

        {/* ビュー選択タチE*/}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'overview', label: '概要E },
              { id: 'department', label: '部署別刁E��' },
              { id: 'position', label: '職位別刁E��' },
              { id: 'roi', label: 'ROI刁E��' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === view.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* メインコンチE��チE*/}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">総コスト構�E</h3>
                <Doughnut data={totalCostChart} />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">コスト�E訳</h3>
                <Doughnut data={costBreakdownChart} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">月次離職コスト推移</h3>
              <Line data={monthlyTrendChart} />
            </div>
          </div>
        )}

        {selectedView === 'department' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">部署別離職コスチE/h3>
              <Bar data={departmentCostChart} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部署</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">離職玁E/th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">人数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">総コスチE/th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1人あためE/th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {costData.byDepartment.map((dept, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.turnoverRate.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.headcount}吁E/td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(dept.directCost + dept.indirectCost + dept.opportunityCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency((dept.directCost + dept.indirectCost + dept.opportunityCost) / (dept.headcount * dept.turnoverRate / 100))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedView === 'position' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">職佁E/th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平坁E��スチE/th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">補�E期間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">生産性損失</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {costData.byPosition.map((pos, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pos.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(pos.averageCost)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pos.replacementTime}日</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pos.productivityLoss}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedView === 'roi' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-6">投賁E��効果シミュレーション</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="text-sm text-gray-600">現在の年間離職コスチE/p>
                  <p className="text-3xl font-bold text-red-600">{formatCurrency(costData.roi.currentCost)}</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-600">改喁E��策への投賁E��E/p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(costData.roi.investment)}</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm text-gray-600">予測される離職コスト（施策後！E/p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(costData.roi.projectedCost)}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600">年間削減効极E/p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(costData.roi.currentCost - costData.roi.projectedCost)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">投賁E��収期間：{costData.roi.paybackPeriod}ヶ朁E/p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DataComment
          comment="離職コスト�E30%は予防可能です。特に看護部での改喁E��果が大きいと予測されます、E
          details={[
            '採用・研修コストが全体�E60%を占めてぁE��',
            '管琁E�Eクラスの離職は一般職の3倍以上�EコストがかかめE,
            '定着玁E��10%改喁E��ることで年閁E,250丁E�Eの削減が可能'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function CostImpactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CostImpactContent />
    </Suspense>
  );
}