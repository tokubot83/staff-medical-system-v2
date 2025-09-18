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

// デモデータ生成
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
      '看護部': months.map((_, i) => 9.2 + Math.sin(i * 0.4) * 2.5 + Math.random()),
      '医療技術部': months.map((_, i) => 7.8 + Math.sin(i * 0.6) * 1.8 + Math.random()),
      '事務部': months.map((_, i) => 6.5 + Math.sin(i * 0.3) * 1.5 + Math.random()),
      'リハビリ部': months.map((_, i) => 8.0 + Math.sin(i * 0.5) * 2.0 + Math.random())
    },
    seasonality: {
      '1月': 10.2, '2月': 9.8, '3月': 12.5, '4月': 11.0,
      '5月': 8.5, '6月': 7.8, '7月': 8.2, '8月': 9.0,
      '9月': 9.5, '10月': 8.0, '11月': 7.5, '12月': 10.5
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

  // 全体トレンドチャート（混合チャート用）
  const overallTrendChart = {
    labels: trendData.overall.map(d => d.month),
    datasets: [
      {
        type: 'line' as const,
        label: '離職率 (%)',
        data: trendData.overall.map(d => d.rate),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        type: 'bar' as const,
        label: '離職者数',
        data: trendData.overall.map(d => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y1'
      }
    ]
  };

  // 部署別トレンドチャート
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

  // 季節性分析チャート
  const seasonalityChart = {
    labels: Object.keys(trendData.seasonality),
    datasets: [{
      label: '平均離職率 (%)',
      data: Object.values(trendData.seasonality),
      backgroundColor: 'rgba(239, 68, 68, 0.6)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 2
    }]
  };

  // 予測チャート
  const predictionChart = {
    labels: trendData.prediction.map(d => d.month),
    datasets: [
      {
        label: '実績値',
        data: trendData.prediction.map(d => d.actual),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      },
      {
        label: '予測値',
        data: trendData.prediction.map(d => d.predicted),
        borderColor: 'rgb(239, 68, 68)',
        borderDash: [5, 5],
        tension: 0.3
      },
      {
        label: '予測上限',
        data: trendData.prediction.map(d => d.upper),
        borderColor: 'rgba(239, 68, 68, 0.3)',
        borderDash: [2, 2],
        fill: false,
        pointRadius: 0
      },
      {
        label: '予測下限',
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
          text: '離職率 (%)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: selectedView === 'overall',
        position: 'right' as const,
        title: {
          display: true,
          text: '離職者数'
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="時系列トレンド分析" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📈</span>
            <h1 className="text-2xl font-bold text-gray-900">時系列トレンド分析</h1>
          </div>
          <p className="text-gray-600">
            離職率の時系列変化を分析し、トレンド、季節性、将来予測を可視化します。
          </p>
        </div>

        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* ビュー選択タブ */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'overall', label: '全体トレンド' },
              { id: 'department', label: '部署別比較' },
              { id: 'seasonality', label: '季節性分析' },
              { id: 'prediction', label: '将来予測' }
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

        {/* チャート表示 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {selectedView === 'overall' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">離職率と離職者数の推移</h3>
              <Chart type='bar' data={overallTrendChart} options={chartOptions} />
            </div>
          )}
          
          {selectedView === 'department' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">部署別離職率トレンド</h3>
              <Line data={departmentTrendChart} options={{ ...chartOptions, scales: { y: chartOptions.scales.y } }} />
            </div>
          )}
          
          {selectedView === 'seasonality' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">月別平均離職率（過去3年間）</h3>
              <Bar data={seasonalityChart} options={{ ...chartOptions, scales: { y: chartOptions.scales.y } }} />
            </div>
          )}
          
          {selectedView === 'prediction' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">離職率予測（6ヶ月先）</h3>
              <Line data={predictionChart} options={{ ...chartOptions, scales: { y: chartOptions.scales.y } }} />
            </div>
          )}
        </div>

        {/* 分析サマリー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">トレンド分析サマリー</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">現在の離職率</p>
              <p className="text-2xl font-bold text-red-600">8.7%</p>
              <p className="text-xs text-gray-500">前月比 +0.3%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">年間トレンド</p>
              <p className="text-2xl font-bold text-blue-600">↑ 上昇</p>
              <p className="text-xs text-gray-500">+1.2% / 年</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">季節性ピーク</p>
              <p className="text-2xl font-bold text-green-600">3月</p>
              <p className="text-xs text-gray-500">平均 12.5%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">6ヶ月後予測</p>
              <p className="text-2xl font-bold text-purple-600">9.2%</p>
              <p className="text-xs text-gray-500">±1.5%</p>
            </div>
          </div>
        </div>

        <DataComment
          comment="3月の離職率上昇は年度末の影響と考えられます。早期の対策実施が推奨されます。"
          details={[
            '過去3年間で3月の離職率は平均12.5%と最も高い',
            '看護部の離職率が特に上昇傾向にある',
            '予測モデルでは今後6ヶ月で離職率が9%台に上昇する可能性'
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