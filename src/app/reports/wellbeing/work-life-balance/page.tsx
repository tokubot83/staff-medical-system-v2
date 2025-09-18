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
  Filler
} from 'chart.js';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { loadWellbeingData, filterByFacility, getTrendData, getWellbeingWithStaffInfo } from '@/utils/loadWellbeingData';

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
  const { individual, aggregates, trends, individualWithAge } = useMemo(() => {
    const data = loadWellbeingData();
    const filtered = filterByFacility(data.individual, facilityParam);
    const withAge = getWellbeingWithStaffInfo(filtered);
    return {
      individual: filtered,
      aggregates: data.aggregates,
      trends: data.trends,
      individualWithAge: withAge
    };
  }, [facilityParam]);
  
  // ワークライフバランス5要素の平均値
  const balanceAverages = useMemo(() => {
    const totals = individual.reduce((acc, person) => {
      acc.workTime += person.workLifeBalance.workTime;
      acc.privateTime += person.workLifeBalance.privateTime;
      acc.flexibility += person.workLifeBalance.flexibility;
      acc.familySupport += person.workLifeBalance.familySupport;
      acc.selfCare += person.workLifeBalance.selfCare;
      acc.overall += person.workLifeBalance.overall;
      return acc;
    }, { workTime: 0, privateTime: 0, flexibility: 0, familySupport: 0, selfCare: 0, overall: 0 });
    
    const count = individual.length || 1;
    
    return {
      workTime: totals.workTime / count,
      privateTime: totals.privateTime / count,
      flexibility: totals.flexibility / count,
      familySupport: totals.familySupport / count,
      selfCare: totals.selfCare / count,
      overall: totals.overall / count
    };
  }, [individual]);
  
  // 5要素の棒グラフデータ
  const elementsData = useMemo(() => ({
    labels: ['労働時間満足度', 'プライベート時間', '柔軟性', '家族との時間', 'セルフケア'],
    datasets: [{
      label: 'スコア',
      data: [
        balanceAverages.workTime,
        balanceAverages.privateTime,
        balanceAverages.flexibility,
        balanceAverages.familySupport,
        balanceAverages.selfCare
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.6)',
        'rgba(34, 197, 94, 0.6)',
        'rgba(251, 191, 36, 0.6)',
        'rgba(236, 72, 153, 0.6)',
        'rgba(139, 92, 246, 0.6)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(139, 92, 246, 1)'
      ],
      borderWidth: 1
    }]
  }), [balanceAverages]);
  
  // 職種別のレーダーチャートデータ
  const positionRadarData = useMemo(() => {
    const positions = ['看護師', '理学療法士', '作業療法士'];
    const datasets = positions.map((position, index) => {
      const positionData = individual.filter(p => p.position === position);
      const count = positionData.length || 1;
      
      const avgData = positionData.reduce((acc, person) => {
        acc.workTime += person.workLifeBalance.workTime;
        acc.privateTime += person.workLifeBalance.privateTime;
        acc.flexibility += person.workLifeBalance.flexibility;
        acc.familySupport += person.workLifeBalance.familySupport;
        acc.selfCare += person.workLifeBalance.selfCare;
        return acc;
      }, { workTime: 0, privateTime: 0, flexibility: 0, familySupport: 0, selfCare: 0 });
      
      const colors = [
        { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 1)' },
        { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 1)' },
        { bg: 'rgba(236, 72, 153, 0.2)', border: 'rgba(236, 72, 153, 1)' }
      ];
      
      return {
        label: position,
        data: [
          avgData.workTime / count,
          avgData.privateTime / count,
          avgData.flexibility / count,
          avgData.familySupport / count,
          avgData.selfCare / count
        ],
        backgroundColor: colors[index].bg,
        borderColor: colors[index].border,
        borderWidth: 2
      };
    });
    
    return {
      labels: ['労働時間満足度', 'プライベート時間', '柔軟性', '家族との時間', 'セルフケア'],
      datasets
    };
  }, [individual]);
  
  // トレンドデータ
  const trendData = useMemo(() => {
    const facilityTrend = trends.find(t => 
      t.category === 'facility' && (facilityParam ? t.name === facilityParam : t.name === '小原病院')
    );
    
    if (!facilityTrend) return null;
    
    return {
      labels: facilityTrend.data.map(d => d.period),
      datasets: [{
        label: 'ワークライフバランス',
        data: facilityTrend.data.map(d => d.workLifeBalance),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      }]
    };
  }, [trends, facilityParam]);
  
  // 世代別分析
  const generationData = useMemo(() => {
    const generations = [
      { name: 'Z世代（～27歳）', min: 0, max: 27 },
      { name: 'ミレニアル世代（28-43歳）', min: 28, max: 43 },
      { name: 'X世代（44-59歳）', min: 44, max: 59 },
      { name: 'ベビーブーマー世代（60歳～）', min: 60, max: 100 }
    ];
    
    const data = generations.map(gen => {
      const genData = individualWithAge.filter(p => p.age && p.age >= gen.min && p.age <= gen.max);
      if (genData.length === 0) return 0;
      
      return genData.reduce((sum, p) => sum + p.workLifeBalance.overall, 0) / genData.length;
    });
    
    return {
      labels: generations.map(g => g.name),
      datasets: [{
        label: '総合バランススコア',
        data,
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1
      }]
    };
  }, [individualWithAge]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="ワークライフバランス評価" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">ワークライフバランス評価</h1>
                <p className="text-gray-600 mt-2">仕事と生活の調和を多面的に評価し、働きやすい環境づくりを支援</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: 'ワークライフバランス評価レポート',
                  facility: facilityParam || '全施設',
                  reportType: 'work-life-balance',
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
                <CardTitle className="text-sm font-medium text-gray-500">総合バランススコア</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {balanceAverages.overall.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">全体平均</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">最高評価項目</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  家族との時間
                </p>
                <p className="text-xs text-gray-500 mt-1">{balanceAverages.familySupport.toFixed(1)}点</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">改善必要項目</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  プライベート時間
                </p>
                <p className="text-xs text-gray-500 mt-1">{balanceAverages.privateTime.toFixed(1)}点</p>
              </CardContent>
            </Card>
          </div>
          
          {/* 5要素の評価 */}
          <Card>
            <CardHeader>
              <CardTitle>ワークライフバランス5要素の評価</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar
                  data={elementsData}
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
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.parsed.y.toFixed(1)}点`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 職種別比較 */}
            <Card>
              <CardHeader>
                <CardTitle>職種別ワークライフバランス比較</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Radar
                    data={positionRadarData}
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
                          position: 'bottom',
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
            
            {/* 世代別分析 */}
            <Card>
              <CardHeader>
                <CardTitle>世代別バランススコア</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar
                    data={generationData}
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
          </div>
          
          {/* トレンドグラフ */}
          {trendData && (
            <Card>
              <CardHeader>
                <CardTitle>ワークライフバランスの推移</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line
                    data={trendData}
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
          
          {/* 詳細テーブル */}
          <Card>
            <CardHeader>
              <CardTitle>部署別ワークライフバランス詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        部署
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        人数
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        総合スコア
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        労働時間
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        プライベート
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        柔軟性
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {aggregates.byDepartment
                      .filter(dept => !facilityParam || individual.some(i => i.department === dept.name))
                      .map((dept) => {
                        const deptData = individual.filter(p => p.department === dept.name);
                        const count = deptData.length || 1;
                        
                        const avgScores = deptData.reduce((acc, person) => {
                          acc.overall += person.workLifeBalance.overall;
                          acc.workTime += person.workLifeBalance.workTime;
                          acc.privateTime += person.workLifeBalance.privateTime;
                          acc.flexibility += person.workLifeBalance.flexibility;
                          return acc;
                        }, { overall: 0, workTime: 0, privateTime: 0, flexibility: 0 });
                        
                        return (
                          <tr key={dept.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {dept.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                              {deptData.length}
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
                              {(avgScores.workTime / count).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.privateTime / count).toFixed(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                              {(avgScores.flexibility / count).toFixed(1)}
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
      </div><CategoryTopButton categoryPath="/reports/wellbeing" categoryName="ウェルビーイング" /></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}