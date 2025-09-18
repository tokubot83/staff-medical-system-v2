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
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { loadWellbeingData, filterByFacility, getInterventionPrograms } from '@/utils/loadWellbeingData';

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
  ArcElement
);

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  
  // データの読み込みとフィルタリング
  const { individual, interventionPrograms } = useMemo(() => {
    const data = loadWellbeingData();
    return {
      individual: filterByFacility(data.individual, facilityParam),
      interventionPrograms: getInterventionPrograms()
    };
  }, [facilityParam]);
  
  // プログラム参加状況の集計
  const participationAnalysis = useMemo(() => {
    const programParticipation: Record<string, { count: number; improvements: number[] }> = {};
    let totalParticipants = 0;
    
    individual.forEach(person => {
      if (person.interventionEffects && person.interventionEffects.length > 0) {
        totalParticipants++;
        person.interventionEffects.forEach(effect => {
          if (!programParticipation[effect.programId]) {
            programParticipation[effect.programId] = { count: 0, improvements: [] };
          }
          programParticipation[effect.programId].count++;
          programParticipation[effect.programId].improvements.push(effect.improvement);
        });
      }
    });
    
    return {
      programParticipation,
      totalParticipants,
      participationRate: (totalParticipants / individual.length) * 100
    };
  }, [individual]);
  
  // プログラム別効果分析
  const programEffectiveness = useMemo(() => {
    const effects: Record<string, { avgImprovement: number; minImprovement: number; maxImprovement: number }> = {};
    
    Object.entries(participationAnalysis.programParticipation).forEach(([programId, data]) => {
      if (data.improvements.length > 0) {
        effects[programId] = {
          avgImprovement: data.improvements.reduce((a, b) => a + b, 0) / data.improvements.length,
          minImprovement: Math.min(...data.improvements),
          maxImprovement: Math.max(...data.improvements)
        };
      }
    });
    
    return effects;
  }, [participationAnalysis]);
  
  // プログラム参加率の円グラフデータ
  const participationDoughnutData = useMemo(() => ({
    labels: ['参加者', '未参加者'],
    datasets: [{
      data: [
        participationAnalysis.totalParticipants,
        individual.length - participationAnalysis.totalParticipants
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(156, 163, 175, 1)'
      ],
      borderWidth: 1
    }]
  }), [participationAnalysis, individual.length]);
  
  // プログラム別参加者数のグラフデータ
  const programParticipationData = useMemo(() => {
    const programData = interventionPrograms.map(program => {
      const participation = participationAnalysis.programParticipation[program.id];
      return {
        name: program.name,
        count: participation?.count || 0,
        type: program.type
      };
    });
    
    return {
      labels: programData.map(p => p.name),
      datasets: [{
        label: '参加者数',
        data: programData.map(p => p.count),
        backgroundColor: programData.map(p => {
          const colors = {
            mental: 'rgba(139, 92, 246, 0.6)',
            physical: 'rgba(59, 130, 246, 0.6)',
            skill: 'rgba(34, 197, 94, 0.6)',
            team: 'rgba(236, 72, 153, 0.6)',
            other: 'rgba(251, 191, 36, 0.6)'
          };
          return colors[p.type] || colors.other;
        }),
        borderWidth: 1
      }]
    };
  }, [interventionPrograms, participationAnalysis]);
  
  // 効果測定の前後比較データ
  const beforeAfterData = useMemo(() => {
    const allEffects = individual.flatMap(p => p.interventionEffects || []);
    const avgBefore = allEffects.reduce((sum, e) => sum + e.preScore, 0) / allEffects.length || 0;
    const avgAfter = allEffects.reduce((sum, e) => sum + e.postScore, 0) / allEffects.length || 0;
    
    return {
      labels: ['実施前', '実施後'],
      datasets: [{
        label: '平均スコア',
        data: [avgBefore, avgAfter],
        backgroundColor: [
          'rgba(239, 68, 68, 0.6)',
          'rgba(34, 197, 94, 0.6)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 1
      }]
    };
  }, [individual]);
  
  // プログラム別改善率データ
  const improvementRateData = useMemo(() => {
    const programImprovements = interventionPrograms.map(program => {
      const effect = programEffectiveness[program.id];
      return {
        name: program.name,
        improvement: effect?.avgImprovement || 0
      };
    }).filter(p => p.improvement > 0);
    
    return {
      labels: programImprovements.map(p => p.name),
      datasets: [{
        label: '平均改善率 (%)',
        data: programImprovements.map(p => p.improvement),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      }]
    };
  }, [interventionPrograms, programEffectiveness]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="介入プログラム効果測定" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">介入プログラム効果測定</h1>
                <p className="text-gray-600 mt-2">各種介入プログラムの実施効果を定量的に評価・分析</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '介入プログラム効果測定レポート',
                  facility: facilityParam || '全施設',
                  reportType: 'intervention-program',
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
                <CardTitle className="text-sm font-medium text-gray-500">プログラム参加率</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {participationAnalysis.participationRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {participationAnalysis.totalParticipants}名 / {individual.length}名
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">平均改善率</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const allImprovements = Object.values(participationAnalysis.programParticipation)
                      .flatMap(p => p.improvements);
                    return allImprovements.length > 0 
                      ? (allImprovements.reduce((a, b) => a + b, 0) / allImprovements.length).toFixed(1)
                      : '0.0';
                  })()}%
                </p>
                <p className="text-xs text-gray-500 mt-1">全プログラム平均</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">実施プログラム数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {interventionPrograms.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">種類</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 参加率円グラフ */}
            <Card>
              <CardHeader>
                <CardTitle>プログラム参加状況</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <Doughnut
                    data={participationDoughnutData}
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
                              const percentage = ((context.parsed / individual.length) * 100).toFixed(1);
                              return `${context.label}: ${context.parsed}名 (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* 前後比較 */}
            <Card>
              <CardHeader>
                <CardTitle>プログラム実施前後の変化</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Bar
                    data={beforeAfterData}
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
          
          {/* プログラム別参加者数 */}
          <Card>
            <CardHeader>
              <CardTitle>プログラム別参加者数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar
                  data={programParticipationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 5
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
          
          {/* プログラム別改善率 */}
          <Card>
            <CardHeader>
              <CardTitle>プログラム別平均改善率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar
                  data={improvementRateData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 40,
                        ticks: {
                          stepSize: 10,
                          callback: (value) => `${value}%`
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
                            return `改善率: ${context.parsed.x.toFixed(1)}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* プログラム詳細テーブル */}
          <Card>
            <CardHeader>
              <CardTitle>介入プログラム詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        プログラム名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        種別
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        参加者数
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        平均改善率
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最大改善率
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        期待される成果
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interventionPrograms.map((program) => {
                      const participation = participationAnalysis.programParticipation[program.id];
                      const effectiveness = programEffectiveness[program.id];
                      
                      const typeLabels = {
                        mental: 'メンタル',
                        physical: 'フィジカル',
                        skill: 'スキル開発',
                        team: 'チーム',
                        other: 'その他'
                      };
                      
                      const typeColors = {
                        mental: 'text-purple-600 bg-purple-100',
                        physical: 'text-blue-600 bg-blue-100',
                        skill: 'text-green-600 bg-green-100',
                        team: 'text-pink-600 bg-pink-100',
                        other: 'text-yellow-600 bg-yellow-100'
                      };
                      
                      return (
                        <tr key={program.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {program.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[program.type]}`}>
                              {typeLabels[program.type]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            {participation?.count || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <span className={`font-medium ${
                              effectiveness?.avgImprovement ? 
                                effectiveness.avgImprovement >= 20 ? 'text-green-600' :
                                effectiveness.avgImprovement >= 10 ? 'text-blue-600' :
                                'text-orange-600'
                              : 'text-gray-400'
                            }`}>
                              {effectiveness?.avgImprovement ? 
                                `${effectiveness.avgImprovement.toFixed(1)}%` : 
                                '-'
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            {effectiveness?.maxImprovement ? 
                              `${effectiveness.maxImprovement.toFixed(1)}%` : 
                              '-'
                            }
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {program.expectedOutcome}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* プログラム概要カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interventionPrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">{program.description}</p>
                    <div className="pt-2 space-y-1">
                      <p><span className="font-medium">対象:</span> {program.targetGroup.join(', ')}</p>
                      <p><span className="font-medium">期間:</span> {program.duration}</p>
                      <p><span className="font-medium">頻度:</span> {program.frequency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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