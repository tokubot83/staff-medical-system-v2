'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportToPDF } from '@/utils/pdfExport';
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
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { loadWellbeingData, filterByFacility, calculateDistribution } from '@/utils/loadWellbeingData';

// Chart.jsの登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  
  // データの読み込みとフィルタリング
  const { individual, aggregates } = useMemo(() => {
    const data = loadWellbeingData();
    return {
      individual: filterByFacility(data.individual, facilityParam),
      aggregates: data.aggregates
    };
  }, [facilityParam]);
  
  // 5要素の平均値計算
  const averageScores = useMemo(() => {
    const totals = individual.reduce((acc, person) => {
      acc.physical += person.wellbeingIndex.physical;
      acc.mental += person.wellbeingIndex.mental;
      acc.social += person.wellbeingIndex.social;
      acc.purpose += person.wellbeingIndex.purpose;
      acc.growth += person.wellbeingIndex.growth;
      acc.overall += person.wellbeingIndex.overall;
      return acc;
    }, { physical: 0, mental: 0, social: 0, purpose: 0, growth: 0, overall: 0 });
    
    const count = individual.length || 1;
    
    return {
      physical: totals.physical / count,
      mental: totals.mental / count,
      social: totals.social / count,
      purpose: totals.purpose / count,
      growth: totals.growth / count,
      overall: totals.overall / count
    };
  }, [individual]);
  
  // レーダーチャートのデータ
  const radarData = useMemo(() => ({
    labels: ['身体的健康', '精神的健康', '社会的健康', '目的意識', '成長実感'],
    datasets: [{
      label: '全体平均',
      data: [
        averageScores.physical,
        averageScores.mental,
        averageScores.social,
        averageScores.purpose,
        averageScores.growth
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
    }]
  }), [averageScores]);
  
  // 分布データ
  const distribution = useMemo(() => calculateDistribution(individual), [individual]);
  
  const distributionData = useMemo(() => ({
    labels: ['優良(80点以上)', '良好(60-79点)', '要観察(40-59点)', '要改善(40点未満)'],
    datasets: [{
      label: '人数',
      data: [
        distribution.excellent,
        distribution.good,
        distribution.fair,
        distribution.poor
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(251, 191, 36, 0.6)',
        'rgba(239, 68, 68, 0.6)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1
    }]
  }), [distribution]);
  
  // 職種別データ
  const positionData = useMemo(() => {
    const positions = aggregates.byPosition
      .filter(pos => !facilityParam || individual.some(i => i.position === pos.name))
      .sort((a, b) => b.averageScores.wellbeingIndex - a.averageScores.wellbeingIndex);
    
    return {
      labels: positions.map(p => p.name),
      datasets: [{
        label: 'ウェルビーイング指標',
        data: positions.map(p => p.averageScores.wellbeingIndex),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1
      }]
    };
  }, [aggregates.byPosition, facilityParam, individual]);
  
  // 部署別データ
  const departmentData = useMemo(() => {
    const departments = aggregates.byDepartment
      .filter(dept => !facilityParam || individual.some(i => i.department === dept.name))
      .sort((a, b) => b.averageScores.wellbeingIndex - a.averageScores.wellbeingIndex);
    
    return {
      labels: departments.map(d => d.name),
      datasets: [{
        label: 'ウェルビーイング指標',
        data: departments.map(d => d.averageScores.wellbeingIndex),
        backgroundColor: departments.map(d => 
          d.averageScores.wellbeingIndex >= 70 ? 'rgba(34, 197, 94, 0.6)' :
          d.averageScores.wellbeingIndex >= 50 ? 'rgba(59, 130, 246, 0.6)' :
          'rgba(239, 68, 68, 0.6)'
        ),
        borderWidth: 1
      }]
    };
  }, [aggregates.byDepartment, facilityParam, individual]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">ウェルビーイング総合指標</h1>
                <p className="text-gray-600 mt-2">身体的・精神的・社会的健康を総合的に評価し、組織の健康度を可視化</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: 'ウェルビーイング総合指標レポート',
                  facility: facilityParam || '全施設',
                  reportType: 'wellbeing-index',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDFダウンロード
              </button>
            </div>
          </div>

          {/* サマリーカード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">総合スコア</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {averageScores.overall.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">全体平均</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">優良判定率</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {((distribution.excellent / individual.length) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">80点以上</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">要改善者数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  {distribution.poor}名
                </p>
                <p className="text-xs text-gray-500 mt-1">40点未満</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 5要素レーダーチャート */}
            <Card>
              <CardHeader>
                <CardTitle>ウェルビーイング5要素分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <Radar
                    data={radarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            stepSize: 20
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* 分布グラフ */}
            <Card>
              <CardHeader>
                <CardTitle>スコア分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar
                    data={distributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 10
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const percentage = ((context.parsed.y / individual.length) * 100).toFixed(1);
                              return `${context.parsed.y}名 (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 職種別比較 */}
          <Card>
            <CardHeader>
              <CardTitle>職種別ウェルビーイング指標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar
                  data={positionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* 部署別比較 */}
          <Card>
            <CardHeader>
              <CardTitle>部署別ウェルビーイング指標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Bar
                  data={departmentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.parsed.x.toFixed(1)}点`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* 詳細テーブル */}
          <Card>
            <CardHeader>
              <CardTitle>職種別ウェルビーイング詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        職種
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        人数
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        総合スコア
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        身体的
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        精神的
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        社会的
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        目的意識
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        成長実感
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {aggregates.byPosition
                      .filter(pos => !facilityParam || individual.some(i => i.position === pos.name))
                      .map((position) => {
                        const posData = individual.filter(p => p.position === position.name);
                        const count = posData.length || 1;
                        
                        const avgScores = posData.reduce((acc, person) => {
                          acc.overall += person.wellbeingIndex.overall;
                          acc.physical += person.wellbeingIndex.physical;
                          acc.mental += person.wellbeingIndex.mental;
                          acc.social += person.wellbeingIndex.social;
                          acc.purpose += person.wellbeingIndex.purpose;
                          acc.growth += person.wellbeingIndex.growth;
                          return acc;
                        }, { overall: 0, physical: 0, mental: 0, social: 0, purpose: 0, growth: 0 });
                        
                        return (
                          <tr key={position.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {position.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                              {posData.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <span className={`font-medium ${
                                avgScores.overall / count >= 70 ? 'text-green-600' :
                                avgScores.overall / count >= 50 ? 'text-blue-600' :
                                'text-orange-600'
                              }`}>
                                {(avgScores.overall / count).toFixed(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.physical / count).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.mental / count).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.social / count).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.purpose / count).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.growth / count).toFixed(1)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

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