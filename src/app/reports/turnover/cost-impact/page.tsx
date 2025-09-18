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

// 繝・Δ繝・・繧ｿ逕滓・
const generateCostData = () => {
  const departments = ['逵玖ｭｷ驛ｨ', '蛹ｻ逋よ橿陦馴Κ', '繝ｪ繝上ン繝ｪ驛ｨ', '莠句漁驛ｨ', '阮ｬ蜑､驛ｨ'];
  const positions = ['譁ｰ莠ｺ', '荳ｭ蝣・, '荳ｻ莉ｻ', '蟶ｫ髟ｷ', '驛ｨ髟ｷ'];
  
  return {
    totalCost: {
      direct: 125000000, // 1.25蜆・・
      indirect: 87500000, // 0.875蜆・・
      opportunity: 62500000 // 0.625蜆・・
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
      '謗｡逕ｨ繧ｳ繧ｹ繝・: 35,
      '遐比ｿｮ繧ｳ繧ｹ繝・: 25,
      '逕溽肇諤ｧ菴惹ｸ・: 20,
      '譌｢蟄倥せ繧ｿ繝・ヵ雋諡・: 12,
      '縺昴・莉・: 8
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

  // 邱上さ繧ｹ繝域ｧ区・繝√Ε繝ｼ繝・
  const totalCostChart = {
    labels: ['逶ｴ謗･繧ｳ繧ｹ繝・, '髢捺磁繧ｳ繧ｹ繝・, '讖滉ｼ壽錐螟ｱ'],
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

  // 驛ｨ鄂ｲ蛻･繧ｳ繧ｹ繝医メ繝｣繝ｼ繝・
  const departmentCostChart = {
    labels: costData.byDepartment.map(d => d.department),
    datasets: [
      {
        label: '逶ｴ謗･繧ｳ繧ｹ繝・,
        data: costData.byDepartment.map(d => d.directCost),
        backgroundColor: 'rgba(239, 68, 68, 0.8)'
      },
      {
        label: '髢捺磁繧ｳ繧ｹ繝・,
        data: costData.byDepartment.map(d => d.indirectCost),
        backgroundColor: 'rgba(245, 158, 11, 0.8)'
      },
      {
        label: '讖滉ｼ壽錐螟ｱ',
        data: costData.byDepartment.map(d => d.opportunityCost),
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  };

  // 繧ｳ繧ｹ繝亥・險ｳ繝√Ε繝ｼ繝・
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

  // 譛域ｬ｡繝医Ξ繝ｳ繝峨メ繝｣繝ｼ繝・
  const monthlyTrendChart = {
    labels: costData.monthlyTrend.map(d => d.month),
    datasets: [{
      label: '髮｢閨ｷ繧ｳ繧ｹ繝茨ｼ亥・・・,
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
      <CommonHeader title="髮｢閨ｷ繧ｳ繧ｹ繝亥ｽｱ髻ｿ蛻・梵" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">腸</span>
            <h1 className="text-2xl font-bold text-gray-900">髮｢閨ｷ繧ｳ繧ｹ繝亥ｽｱ髻ｿ蛻・梵</h1>
          </div>
          <p className="text-gray-600">
            髮｢閨ｷ縺ｫ繧医ｋ雋｡蜍咏噪蠖ｱ髻ｿ繧貞ｮ夐㍼蛹悶＠縲∵兜雉・ｯｾ蜉ｹ譫懊・鬮倥＞謾ｹ蝟・命遲悶ｒ迚ｹ螳壹＠縺ｾ縺吶・
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* 繧ｵ繝槭Μ繝ｼ繧ｫ繝ｼ繝・*/}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">蟷ｴ髢鍋ｷ城屬閨ｷ繧ｳ繧ｹ繝・/p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(costData.totalCost.direct + costData.totalCost.indirect + costData.totalCost.opportunity)}
            </p>
            <p className="text-xs text-gray-500">螢ｲ荳企ｫ倥・邏・.2%</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">1莠ｺ縺ゅ◆繧雁ｹｳ蝮・さ繧ｹ繝・/p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(2750000)}
            </p>
            <p className="text-xs text-gray-500">蟷ｴ蜿弱・邏・.5蛟・/p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">謗｡逕ｨ繝ｻ遐比ｿｮ譛滄俣</p>
            <p className="text-2xl font-bold text-blue-600">92譌･</p>
            <p className="text-xs text-gray-500">逕溽肇諤ｧ50%菴惹ｸ・/p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">蜑頑ｸ帛庄閭ｽ繧ｳ繧ｹ繝・/p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(82500000)}
            </p>
            <p className="text-xs text-gray-500">30%蜑頑ｸ帛庄閭ｽ</p>
          </div>
        </div>

        {/* 繝薙Η繝ｼ驕ｸ謚槭ち繝・*/}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'overview', label: '讎りｦ・ },
              { id: 'department', label: '驛ｨ鄂ｲ蛻･蛻・梵' },
              { id: 'position', label: '閨ｷ菴榊挨蛻・梵' },
              { id: 'roi', label: 'ROI蛻・梵' }
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

        {/* 繝｡繧､繝ｳ繧ｳ繝ｳ繝・Φ繝・*/}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">邱上さ繧ｹ繝域ｧ区・</h3>
                <Doughnut data={totalCostChart} />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">繧ｳ繧ｹ繝亥・險ｳ</h3>
                <Doughnut data={costBreakdownChart} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">譛域ｬ｡髮｢閨ｷ繧ｳ繧ｹ繝域耳遘ｻ</h3>
              <Line data={monthlyTrendChart} />
            </div>
          </div>
        )}

        {selectedView === 'department' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">驛ｨ鄂ｲ蛻･髮｢閨ｷ繧ｳ繧ｹ繝・/h3>
              <Bar data={departmentCostChart} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">驛ｨ鄂ｲ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">髮｢閨ｷ邇・/th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">莠ｺ謨ｰ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邱上さ繧ｹ繝・/th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1莠ｺ縺ゅ◆繧・/th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {costData.byDepartment.map((dept, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.turnoverRate.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.headcount}蜷・/td>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">閨ｷ菴・/th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">蟷ｳ蝮・さ繧ｹ繝・/th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">陬懷・譛滄俣</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">逕溽肇諤ｧ謳榊､ｱ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {costData.byPosition.map((pos, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pos.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(pos.averageCost)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pos.replacementTime}譌･</td>
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
              <h3 className="text-lg font-semibold mb-6">謚戊ｳ・ｯｾ蜉ｹ譫懊す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="text-sm text-gray-600">迴ｾ蝨ｨ縺ｮ蟷ｴ髢馴屬閨ｷ繧ｳ繧ｹ繝・/p>
                  <p className="text-3xl font-bold text-red-600">{formatCurrency(costData.roi.currentCost)}</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-600">謾ｹ蝟・命遲悶∈縺ｮ謚戊ｳ・｡・/p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(costData.roi.investment)}</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm text-gray-600">莠域ｸｬ縺輔ｌ繧矩屬閨ｷ繧ｳ繧ｹ繝茨ｼ域命遲門ｾ鯉ｼ・/p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(costData.roi.projectedCost)}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600">蟷ｴ髢灘炎貂帛柑譫・/p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(costData.roi.currentCost - costData.roi.projectedCost)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">謚戊ｳ・屓蜿取悄髢難ｼ嘴costData.roi.paybackPeriod}繝ｶ譛・/p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DataComment
          comment="髮｢閨ｷ繧ｳ繧ｹ繝医・30%縺ｯ莠磯亟蜿ｯ閭ｽ縺ｧ縺吶ら音縺ｫ逵玖ｭｷ驛ｨ縺ｧ縺ｮ謾ｹ蝟・柑譫懊′螟ｧ縺阪＞縺ｨ莠域ｸｬ縺輔ｌ縺ｾ縺吶・
          details={[
            '謗｡逕ｨ繝ｻ遐比ｿｮ繧ｳ繧ｹ繝医′蜈ｨ菴薙・60%繧貞頃繧√※縺・ｋ',
            '邂｡逅・・繧ｯ繝ｩ繧ｹ縺ｮ髮｢閨ｷ縺ｯ荳闊ｬ閨ｷ縺ｮ3蛟堺ｻ･荳翫・繧ｳ繧ｹ繝医′縺九°繧・,
            '螳夂捩邇・ｒ10%謾ｹ蝟・☆繧九％縺ｨ縺ｧ蟷ｴ髢・,250荳・・縺ｮ蜑頑ｸ帙′蜿ｯ閭ｽ'
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