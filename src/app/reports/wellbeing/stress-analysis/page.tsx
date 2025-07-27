'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';
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
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { loadWellbeingData, filterByFacility } from '@/utils/loadWellbeingData';

// Chart.jsの登録
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
  
  // ストレス要因の平均値
  const stressAverages = useMemo(() => {
    const totals = individual.reduce((acc, person) => {
      acc.workload += person.stressFactors.workload;
      acc.relationships += person.stressFactors.relationships;
      acc.workControl += person.stressFactors.workControl;
      acc.reward += person.stressFactors.reward;
      acc.workEnvironment += person.stressFactors.workEnvironment;
      acc.change += person.stressFactors.change;
      return acc;
    }, { workload: 0, relationships: 0, workControl: 0, reward: 0, workEnvironment: 0, change: 0 });
    
    const count = individual.length || 1;
    
    return {
      workload: totals.workload / count,
      relationships: totals.relationships / count,
      workControl: totals.workControl / count,
      reward: totals.reward / count,
      workEnvironment: totals.workEnvironment / count,
      change: totals.change / count,
      overall: (totals.workload + totals.relationships + totals.workControl + 
                totals.reward + totals.workEnvironment + totals.change) / (count * 6)
    };
  }, [individual]);
  
  // 高ストレス者の抜出
  const highStressCount = useMemo(() => {
    return individual.filter(person => {
      const avgStress = Object.values(person.stressFactors).reduce((a, b) => a + b, 0) / 6;
      return avgStress >= 70;
    }).length;
  }, [individual]);
  
  // ストレス要因別データ
  const stressFactorsData = useMemo(() => ({
    labels: ['業務量', '人間関係', '裁量権', '報酬', '作業環境', '変化'],
    datasets: [{
      label: 'ストレスレベル',
      data: [
        stressAverages.workload,
        stressAverages.relationships,
        stressAverages.workControl,
        stressAverages.reward,
        stressAverages.workEnvironment,
        stressAverages.change
      ],
      backgroundColor: [
        stressAverages.workload >= 70 ? 'rgba(239, 68, 68, 0.6)' : 
        stressAverages.workload >= 50 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(34, 197, 94, 0.6)',
        stressAverages.relationships >= 70 ? 'rgba(239, 68, 68, 0.6)' : 
        stressAverages.relationships >= 50 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(34, 197, 94, 0.6)',
        stressAverages.workControl >= 70 ? 'rgba(239, 68, 68, 0.6)' : 
        stressAverages.workControl >= 50 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(34, 197, 94, 0.6)',
        stressAverages.reward >= 70 ? 'rgba(239, 68, 68, 0.6)' : 
        stressAverages.reward >= 50 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(34, 197, 94, 0.6)',
        stressAverages.workEnvironment >= 70 ? 'rgba(239, 68, 68, 0.6)' : 
        stressAverages.workEnvironment >= 50 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(34, 197, 94, 0.6)',
        stressAverages.change >= 70 ? 'rgba(239, 68, 68, 0.6)' : 
        stressAverages.change >= 50 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(34, 197, 94, 0.6)'
      ],
      borderWidth: 1
    }]
  }), [stressAverages]);
  
  // 部署別ストレスデータ
  const departmentStressData = useMemo(() => {
    const deptData = aggregates.byDepartment
      .filter(dept => !facilityParam || individual.some(i => i.department === dept.name))
      .sort((a, b) => b.averageScores.stressLevel - a.averageScores.stressLevel);
    
    return {
      labels: deptData.map(d => d.name),
      datasets: [{
        label: '平均ストレスレベル',
        data: deptData.map(d => d.averageScores.stressLevel),
        backgroundColor: deptData.map(d => 
          d.averageScores.stressLevel >= 70 ? 'rgba(239, 68, 68, 0.6)' :
          d.averageScores.stressLevel >= 50 ? 'rgba(251, 191, 36, 0.6)' :
          'rgba(34, 197, 94, 0.6)'
        ),
        borderWidth: 1
      }]
    };
  }, [aggregates.byDepartment, facilityParam, individual]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="ストレス要因分析" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">ストレス要因分析</h1>
                <p className="text-gray-600 mt-2">職場のストレス要因を特定し、メンタルヘルス対策を支援</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">対象施設: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: 'ストレス要因分析レポート',
                  facility: facilityParam || '全施設',
                  reportType: 'stress-analysis',
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
                <CardTitle className="text-sm font-medium text-gray-500">平均ストレスレベル</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  {stressAverages.overall.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">全体平均</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">高ストレス者</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {highStressCount}名
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  全体の{((highStressCount / individual.length) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">最大ストレス要因</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  業務量
                </p>
                <p className="text-xs text-gray-500 mt-1">{stressAverages.workload.toFixed(1)}点</p>
              </CardContent>
            </Card>
          </div>
          
          {/* ストレス要因分析 */}
          <Card>
            <CardHeader>
              <CardTitle>ストレス要因別分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar
                  data={stressFactorsData}
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
                            const value = context.parsed.y;
                            let level = '低';
                            if (value >= 70) level = '高';
                            else if (value >= 50) level = '中';
                            return `${value.toFixed(1)}点 (ストレス: ${level})`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* 部署別ストレスレベル */}
          <Card>
            <CardHeader>
              <CardTitle>部署別ストレスレベル</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Bar
                  data={departmentStressData}
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
          
          {/* ストレス要因ヒートマップ */}
          <Card>
            <CardHeader>
              <CardTitle>職種別ストレス要因ヒートマップ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">職種</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">業務量</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">人間関係</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">裁量権</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">報酬</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">作業環境</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">変化</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {aggregates.byPosition
                      .filter(pos => !facilityParam || individual.some(i => i.position === pos.name))
                      .map((position) => {
                        const posData = individual.filter(p => p.position === position.name);
                        if (posData.length === 0) return null;
                        
                        const avgStress = posData.reduce((acc, person) => {
                          acc.workload += person.stressFactors.workload;
                          acc.relationships += person.stressFactors.relationships;
                          acc.workControl += person.stressFactors.workControl;
                          acc.reward += person.stressFactors.reward;
                          acc.workEnvironment += person.stressFactors.workEnvironment;
                          acc.change += person.stressFactors.change;
                          return acc;
                        }, { workload: 0, relationships: 0, workControl: 0, reward: 0, workEnvironment: 0, change: 0 });
                        
                        const count = posData.length;
                        // Average all stress factors
                        avgStress.workload = avgStress.workload / count;
                        avgStress.relationships = avgStress.relationships / count;
                        avgStress.workControl = avgStress.workControl / count;
                        avgStress.reward = avgStress.reward / count;
                        avgStress.workEnvironment = avgStress.workEnvironment / count;
                        avgStress.change = avgStress.change / count;
                        
                        const getHeatmapColor = (value: number) => {
                          if (value >= 70) return 'bg-red-500 text-white';
                          if (value >= 50) return 'bg-orange-400 text-white';
                          return 'bg-green-400 text-white';
                        };
                        
                        return (
                          <tr key={position.name}>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                              {position.name}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getHeatmapColor(avgStress.workload)}`}>
                                {avgStress.workload.toFixed(0)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getHeatmapColor(avgStress.relationships)}`}>
                                {avgStress.relationships.toFixed(0)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getHeatmapColor(avgStress.workControl)}`}>
                                {avgStress.workControl.toFixed(0)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getHeatmapColor(avgStress.reward)}`}>
                                {avgStress.reward.toFixed(0)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getHeatmapColor(avgStress.workEnvironment)}`}>
                                {avgStress.workEnvironment.toFixed(0)}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getHeatmapColor(avgStress.change)}`}>
                                {avgStress.change.toFixed(0)}
                              </span>
                            </td>
                          </tr>
                        );
                      }).filter(Boolean)}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-4 text-xs">
                <span className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-green-400 rounded mr-2"></span>
                  低ストレス (0-49)
                </span>
                <span className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-orange-400 rounded mr-2"></span>
                  中ストレス (50-69)
                </span>
                <span className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-red-500 rounded mr-2"></span>
                  高ストレス (70-100)
                </span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports/wellbeing" categoryName="ウェルビーイング" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}