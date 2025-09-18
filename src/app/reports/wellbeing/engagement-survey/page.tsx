'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
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
  ArcElement,
  Filler
} from 'chart.js';
import { Bar, Line, Radar, Doughnut } from 'react-chartjs-2';
import { loadWellbeingData, filterByFacility, getTrendData } from '@/utils/loadWellbeingData';

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
  ArcElement,
  Filler
);

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  
  // チE�Eタの読み込みとフィルタリング
  const { individual, aggregates, trends } = useMemo(() => {
    const data = loadWellbeingData();
    return {
      individual: filterByFacility(data.individual, facilityParam),
      aggregates: data.aggregates,
      trends: data.trends
    };
  }, [facilityParam]);
  
  // エンゲージメンチE要素の平坁E��
  const engagementAverages = useMemo(() => {
    const totals = individual.reduce((acc, person) => {
      acc.vigor += person.engagementScore.vigor;
      acc.dedication += person.engagementScore.dedication;
      acc.absorption += person.engagementScore.absorption;
      acc.overall += person.engagementScore.overall;
      return acc;
    }, { vigor: 0, dedication: 0, absorption: 0, overall: 0 });
    
    const count = individual.length || 1;
    
    return {
      vigor: totals.vigor / count,
      dedication: totals.dedication / count,
      absorption: totals.absorption / count,
      overall: totals.overall / count
    };
  }, [individual]);
  
  // トレンド�E极E  const trendAnalysis = useMemo(() => {
    const trends = { up: 0, stable: 0, down: 0 };
    individual.forEach(person => {
      trends[person.engagementScore.trend]++;
    });
    return trends;
  }, [individual]);
  
  // 3要素のレーダーチャートデータ
  const radarData = useMemo(() => ({
    labels: ['活劁E, '熱愁E, '没頭'],
    datasets: [{
      label: 'エンゲージメントスコア',
      data: [
        engagementAverages.vigor,
        engagementAverages.dedication,
        engagementAverages.absorption
      ],
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(34, 197, 94, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(34, 197, 94, 1)'
    }]
  }), [engagementAverages]);
  
  // トレンド�Eグラフデータ
  const trendDoughnutData = useMemo(() => ({
    labels: ['上�E傾吁E, '安宁E, '下降傾吁E],
    datasets: [{
      data: [trendAnalysis.up, trendAnalysis.stable, trendAnalysis.down],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1
    }]
  }), [trendAnalysis]);
  
  // 部署別エンゲージメントデータ
  const departmentData = useMemo(() => {
    const deptData = aggregates.byDepartment
      .filter(dept => !facilityParam || individual.some(i => i.department === dept.name))
      .sort((a, b) => b.averageScores.engagement - a.averageScores.engagement);
    
    return {
      labels: deptData.map(d => d.name),
      datasets: [{
        label: 'エンゲージメントスコア',
        data: deptData.map(d => d.averageScores.engagement),
        backgroundColor: deptData.map(d => 
          d.averageScores.engagement >= 80 ? 'rgba(34, 197, 94, 0.6)' :
          d.averageScores.engagement >= 60 ? 'rgba(59, 130, 246, 0.6)' :
          'rgba(239, 68, 68, 0.6)'
        ),
        borderColor: deptData.map(d => 
          d.averageScores.engagement >= 80 ? 'rgba(34, 197, 94, 1)' :
          d.averageScores.engagement >= 60 ? 'rgba(59, 130, 246, 1)' :
          'rgba(239, 68, 68, 1)'
        ),
        borderWidth: 1
      }]
    };
  }, [aggregates.byDepartment, facilityParam, individual]);
  
  // 時系列トレンドデータ
  const timeSeriesData = useMemo(() => {
    const facilityTrend = trends.find(t => 
      t.category === 'facility' && (facilityParam ? t.name === facilityParam : t.name === '小原痁E��')
    );
    
    if (!facilityTrend) return null;
    
    return {
      labels: facilityTrend.data.map(d => d.period),
      datasets: [{
        label: 'エンゲージメンチE,
        data: facilityTrend.data.map(d => d.engagement),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1
      }]
    };
  }, [trends, facilityParam]);
  
  // 職種別比輁E��ータ
  const positionComparisonData = useMemo(() => {
    const positionData = aggregates.byPosition
      .filter(pos => !facilityParam || individual.some(i => i.position === pos.name))
      .sort((a, b) => b.averageScores.engagement - a.averageScores.engagement);
    
    return {
      labels: positionData.map(p => p.name),
      datasets: [
        {
          label: '活劁E,
          data: positionData.map(p => {
            const posIndividuals = individual.filter(i => i.position === p.name);
            return posIndividuals.reduce((sum, i) => sum + i.engagementScore.vigor, 0) / posIndividuals.length || 0;
          }),
          backgroundColor: 'rgba(59, 130, 246, 0.6)'
        },
        {
          label: '熱愁E,
          data: positionData.map(p => {
            const posIndividuals = individual.filter(i => i.position === p.name);
            return posIndividuals.reduce((sum, i) => sum + i.engagementScore.dedication, 0) / posIndividuals.length || 0;
          }),
          backgroundColor: 'rgba(34, 197, 94, 0.6)'
        },
        {
          label: '没頭',
          data: positionData.map(p => {
            const posIndividuals = individual.filter(i => i.position === p.name);
            return posIndividuals.reduce((sum, i) => sum + i.engagementScore.absorption, 0) / posIndividuals.length || 0;
          }),
          backgroundColor: 'rgba(236, 72, 153, 0.6)'
        }
      ]
    };
  }, [aggregates.byPosition, facilityParam, individual]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="エンゲージメント調査" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">エンゲージメント調査</h1>
                <p className="text-gray-600 mt-2">仕事への活力�E熱意�E没頭度を測定し、絁E���E活性度を評価</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: 'エンゲージメント調査レポ�EチE,
                  facility: facilityParam || '全施設',
                  reportType: 'engagement-survey',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDFダウンローチE              </button>
            </div>
          </div>

          {/* サマリーカーチE*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">総合スコア</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {engagementAverages.overall.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">全体平坁E/p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">活劁E/CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {engagementAverages.vigor.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">エネルギーレベル</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">熱愁E/CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {engagementAverages.dedication.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">仕事への惁E�E</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">没頭</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-pink-600">
                  {engagementAverages.absorption.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">雁E��度</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* エンゲージメンチE要素 */}
            <Card>
              <CardHeader>
                <CardTitle>エンゲージメンチE要素刁E��</CardTitle>
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
            
            {/* トレンド�E币E*/}
            <Card>
              <CardHeader>
                <CardTitle>エンゲージメントトレンチE/CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <Doughnut
                    data={trendDoughnutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 15,
                            font: {
                              size: 11
                            }
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const total = individual.length;
                              const percentage = ((context.parsed / total) * 100).toFixed(1);
                              return `${context.label}: ${context.parsed}吁E(${percentage}%)`;
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
          
          {/* 部署別エンゲージメンチE*/}
          <Card>
            <CardHeader>
              <CardTitle>部署別エンゲージメントスコア</CardTitle>
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
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* 時系列推移 */}
          {timeSeriesData && (
            <Card>
              <CardHeader>
                <CardTitle>エンゲージメント�E推移</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line
                    data={timeSeriesData}
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
          )}
          
          {/* 職種別3要素比輁E*/}
          <Card>
            <CardHeader>
              <CardTitle>職種別エンゲージメント要素比輁E/CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Bar
                  data={positionComparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        stacked: false
                      },
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
                        position: 'top',
                        labels: {
                          padding: 15,
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* 詳細チE�Eブル */}
          <Card>
            <CardHeader>
              <CardTitle>職種別エンゲージメント詳細</CardTitle>
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
                        活劁E                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        熱愁E                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        没頭
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        上�E傾吁E                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {aggregates.byPosition
                      .filter(pos => !facilityParam || individual.some(i => i.position === pos.name))
                      .map((position) => {
                        const posData = individual.filter(p => p.position === position.name);
                        const count = posData.length || 1;
                        
                        const avgScores = posData.reduce((acc, person) => {
                          acc.overall += person.engagementScore.overall;
                          acc.vigor += person.engagementScore.vigor;
                          acc.dedication += person.engagementScore.dedication;
                          acc.absorption += person.engagementScore.absorption;
                          if (person.engagementScore.trend === 'up') acc.upTrend++;
                          return acc;
                        }, { overall: 0, vigor: 0, dedication: 0, absorption: 0, upTrend: 0 });
                        
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
                                avgScores.overall / count >= 80 ? 'text-green-600' :
                                avgScores.overall / count >= 60 ? 'text-blue-600' :
                                'text-orange-600'
                              }`}>
                                {(avgScores.overall / count).toFixed(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.vigor / count).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.dedication / count).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.absorption / count).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <span className="text-green-600 font-medium">
                                {((avgScores.upTrend / posData.length) * 100).toFixed(0)}%
                              </span>
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
      </div><CategoryTopButton categoryPath="/reports/wellbeing" categoryName="ウェルビ�Eイング" /></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}