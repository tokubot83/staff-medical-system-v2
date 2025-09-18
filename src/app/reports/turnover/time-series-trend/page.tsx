'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
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
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 繝・Δ繝・・繧ｿ逕滓・
const generateTrendData = () => {
  const months = ['2023/01', '2023/02', '2023/03', '2023/04', '2023/05', '2023/06', 
                  '2023/07', '2023/08', '2023/09', '2023/10', '2023/11', '2023/12',
                  '2024/01', '2024/02', '2024/03', '2024/04', '2024/05', '2024/06'];
  
  return {
    overall: months.map((_, i) => ({
      month: months[i],
      rate: 8.5 + Math.sin(i * 0.5) * 2 + Math.random() * 1,
      count: Math.floor(5 + Math.random() * 10),
      headcount: Math.floor(300 + i * 2 + Math.random() * 20)
    })),
    byDepartment: {
      '逵玖ｭｷ驛ｨ': months.map((_, i) => 9.2 + Math.sin(i * 0.4) * 2.5 + Math.random()),
      '蛹ｻ逋よ橿陦馴Κ': months.map((_, i) => 7.8 + Math.sin(i * 0.6) * 1.8 + Math.random()),
      '莠句漁驛ｨ': months.map((_, i) => 6.5 + Math.sin(i * 0.3) * 1.5 + Math.random()),
      '繝ｪ繝上ン繝ｪ驛ｨ': months.map((_, i) => 8.0 + Math.sin(i * 0.5) * 2.0 + Math.random())
    },
    seasonality: {
      '1譛・: 10.2, '2譛・: 9.8, '3譛・: 12.5, '4譛・: 11.0,
      '5譛・: 8.5, '6譛・: 7.8, '7譛・: 8.2, '8譛・: 9.0,
      '9譛・: 9.5, '10譛・: 8.0, '11譛・: 7.5, '12譛・: 10.5
    },
    prediction: months.slice(-6).concat(['2024/07', '2024/08', '2024/09', '2024/10', '2024/11', '2024/12'])
      .map((month, i) => ({
        month,
        actual: i < 6 ? 8.5 + Math.sin(i * 0.5) * 2 + Math.random() : null,
        predicted: 8.8 + Math.sin((i + 12) * 0.5) * 1.8,
        upper: 10.5 + Math.sin((i + 12) * 0.5) * 1.8,
        lower: 7.1 + Math.sin((i + 12) * 0.5) * 1.8
      }))
  };
};

function TimeSeriesTrendContent() {
  const searchParams = useSearchParams();
  const selectedFacility = searchParams.get('facility') || '';
  const [trendData] = useState(generateTrendData());
  const [selectedView, setSelectedView] = useState('overall');

  // 蜈ｨ菴薙ヨ繝ｬ繝ｳ繝峨メ繝｣繝ｼ繝茨ｼ域ｷｷ蜷医メ繝｣繝ｼ繝育畑・・
  const overallTrendChart = {
    labels: trendData.overall.map(d => d.month),
    datasets: [
      {
        type: 'line' as const,
        label: '髮｢閨ｷ邇・(%)',
        data: trendData.overall.map(d => d.rate),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        type: 'bar' as const,
        label: '髮｢閨ｷ閠・焚',
        data: trendData.overall.map(d => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y1'
      }
    ]
  };

  // 驛ｨ鄂ｲ蛻･繝医Ξ繝ｳ繝峨メ繝｣繝ｼ繝・
  const departmentTrendChart = {
    labels: trendData.overall.map(d => d.month),
    datasets: Object.entries(trendData.byDepartment).map(([dept, data], i) => ({
      label: dept,
      data: data,
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(168, 85, 247)'
      ][i],
      backgroundColor: [
        'rgba(239, 68, 68, 0.1)',
        'rgba(59, 130, 246, 0.1)',
        'rgba(34, 197, 94, 0.1)',
        'rgba(168, 85, 247, 0.1)'
      ][i],
      tension: 0.3
    }))
  };

  // 蟄｣遽諤ｧ蛻・梵繝√Ε繝ｼ繝・
  const seasonalityChart = {
    labels: Object.keys(trendData.seasonality),
    datasets: [{
      label: '蟷ｳ蝮・屬閨ｷ邇・(%)',
      data: Object.values(trendData.seasonality),
      backgroundColor: 'rgba(239, 68, 68, 0.6)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 2
    }]
  };

  // 莠域ｸｬ繝√Ε繝ｼ繝・
  const predictionChart = {
    labels: trendData.prediction.map(d => d.month),
    datasets: [
      {
        label: '螳溽ｸｾ蛟､',
        data: trendData.prediction.map(d => d.actual),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      },
      {
        label: '莠域ｸｬ蛟､',
        data: trendData.prediction.map(d => d.predicted),
        borderColor: 'rgb(239, 68, 68)',
        borderDash: [5, 5],
        tension: 0.3
      },
      {
        label: '莠域ｸｬ荳企剞',
        data: trendData.prediction.map(d => d.upper),
        borderColor: 'rgba(239, 68, 68, 0.3)',
        borderDash: [2, 2],
        fill: false,
        pointRadius: 0
      },
      {
        label: '莠域ｸｬ荳矩剞',
        data: trendData.prediction.map(d => d.lower),
        borderColor: 'rgba(239, 68, 68, 0.3)',
        borderDash: [2, 2],
        fill: '-1',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: '髮｢閨ｷ邇・(%)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: selectedView === 'overall',
        position: 'right' as const,
        title: {
          display: true,
          text: '髮｢閨ｷ閠・焚'
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="譎らｳｻ蛻励ヨ繝ｬ繝ｳ繝牙・譫・ />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">嶋</span>
            <h1 className="text-2xl font-bold text-gray-900">譎らｳｻ蛻励ヨ繝ｬ繝ｳ繝牙・譫・/h1>
          </div>
          <p className="text-gray-600">
            髮｢閨ｷ邇・・譎らｳｻ蛻怜､牙喧繧貞・譫舌＠縲√ヨ繝ｬ繝ｳ繝峨∝ｭ｣遽諤ｧ縲∝ｰ・擂莠域ｸｬ繧貞庄隕門喧縺励∪縺吶・
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* 繝薙Η繝ｼ驕ｸ謚槭ち繝・*/}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'overall', label: '蜈ｨ菴薙ヨ繝ｬ繝ｳ繝・ },
              { id: 'department', label: '驛ｨ鄂ｲ蛻･豈碑ｼ・ },
              { id: 'seasonality', label: '蟄｣遽諤ｧ蛻・梵' },
              { id: 'prediction', label: '蟆・擂莠域ｸｬ' }
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

        {/* 繝√Ε繝ｼ繝郁｡ｨ遉ｺ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {selectedView === 'overall' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">髮｢閨ｷ邇・→髮｢閨ｷ閠・焚縺ｮ謗ｨ遘ｻ</h3>
              <Chart type='bar' data={overallTrendChart} options={chartOptions} />
            </div>
          )}
          
          {selectedView === 'department' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">驛ｨ鄂ｲ蛻･髮｢閨ｷ邇・ヨ繝ｬ繝ｳ繝・/h3>
              <Line data={departmentTrendChart} options={{ ...chartOptions, scales: { y: chartOptions.scales.y } }} />
            </div>
          )}
          
          {selectedView === 'seasonality' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">譛亥挨蟷ｳ蝮・屬閨ｷ邇・ｼ磯℃蜴ｻ3蟷ｴ髢難ｼ・/h3>
              <Bar data={seasonalityChart} options={{ ...chartOptions, scales: { y: chartOptions.scales.y } }} />
            </div>
          )}
          
          {selectedView === 'prediction' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">髮｢閨ｷ邇・ｺ域ｸｬ・・繝ｶ譛亥・・・/h3>
              <Line data={predictionChart} options={{ ...chartOptions, scales: { y: chartOptions.scales.y } }} />
            </div>
          )}
        </div>

        {/* 蛻・梵繧ｵ繝槭Μ繝ｼ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">繝医Ξ繝ｳ繝牙・譫舌し繝槭Μ繝ｼ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">迴ｾ蝨ｨ縺ｮ髮｢閨ｷ邇・/p>
              <p className="text-2xl font-bold text-red-600">8.7%</p>
              <p className="text-xs text-gray-500">蜑肴怦豈・+0.3%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">蟷ｴ髢薙ヨ繝ｬ繝ｳ繝・/p>
              <p className="text-2xl font-bold text-blue-600">竊・荳頑・</p>
              <p className="text-xs text-gray-500">+1.2% / 蟷ｴ</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">蟄｣遽諤ｧ繝斐・繧ｯ</p>
              <p className="text-2xl font-bold text-green-600">3譛・/p>
              <p className="text-xs text-gray-500">蟷ｳ蝮・12.5%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">6繝ｶ譛亥ｾ御ｺ域ｸｬ</p>
              <p className="text-2xl font-bold text-purple-600">9.2%</p>
              <p className="text-xs text-gray-500">ﾂｱ1.5%</p>
            </div>
          </div>
        </div>

        <DataComment
          comment="3譛医・髮｢閨ｷ邇・ｸ頑・縺ｯ蟷ｴ蠎ｦ譛ｫ縺ｮ蠖ｱ髻ｿ縺ｨ閠・∴繧峨ｌ縺ｾ縺吶よ掠譛溘・蟇ｾ遲門ｮ滓命縺梧耳螂ｨ縺輔ｌ縺ｾ縺吶・
          details={[
            '驕主悉3蟷ｴ髢薙〒3譛医・髮｢閨ｷ邇・・蟷ｳ蝮・2.5%縺ｨ譛繧るｫ倥＞',
            '逵玖ｭｷ驛ｨ縺ｮ髮｢閨ｷ邇・′迚ｹ縺ｫ荳頑・蛯ｾ蜷代↓縺ゅｋ',
            '莠域ｸｬ繝｢繝・Ν縺ｧ縺ｯ莉雁ｾ・繝ｶ譛医〒髮｢閨ｷ邇・′9%蜿ｰ縺ｫ荳頑・縺吶ｋ蜿ｯ閭ｽ諤ｧ'
          ]}
        />
      </div><CategoryBackButton /></div>
  );
}

export default function TimeSeriesTrendPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TimeSeriesTrendContent />
    </Suspense>
  );
}