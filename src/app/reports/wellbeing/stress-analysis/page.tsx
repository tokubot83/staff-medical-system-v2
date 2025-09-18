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
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { loadWellbeingData, filterByFacility } from '@/utils/loadWellbeingData';

// Chart.js縺ｮ逋ｻ骭ｲ
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
  
  // 繝・・繧ｿ縺ｮ隱ｭ縺ｿ霎ｼ縺ｿ縺ｨ繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
  const { individual, aggregates } = useMemo(() => {
    const data = loadWellbeingData();
    return {
      individual: filterByFacility(data.individual, facilityParam),
      aggregates: data.aggregates
    };
  }, [facilityParam]);
  
  // 繧ｹ繝医Ξ繧ｹ隕∝屏縺ｮ蟷ｳ蝮・､
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
  
  // 鬮倥せ繝医Ξ繧ｹ閠・・謚懷・
  const highStressCount = useMemo(() => {
    return individual.filter(person => {
      const avgStress = Object.values(person.stressFactors).reduce((a, b) => a + b, 0) / 6;
      return avgStress >= 70;
    }).length;
  }, [individual]);
  
  // 繧ｹ繝医Ξ繧ｹ隕∝屏蛻･繝・・繧ｿ
  const stressFactorsData = useMemo(() => ({
    labels: ['讌ｭ蜍咎㍼', '莠ｺ髢馴未菫・, '陬・㍼讓ｩ', '蝣ｱ驟ｬ', '菴懈･ｭ迺ｰ蠅・, '螟牙喧'],
    datasets: [{
      label: '繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν',
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
  
  // 驛ｨ鄂ｲ蛻･繧ｹ繝医Ξ繧ｹ繝・・繧ｿ
  const departmentStressData = useMemo(() => {
    const deptData = aggregates.byDepartment
      .filter(dept => !facilityParam || individual.some(i => i.department === dept.name))
      .sort((a, b) => b.averageScores.stressLevel - a.averageScores.stressLevel);
    
    return {
      labels: deptData.map(d => d.name),
      datasets: [{
        label: '蟷ｳ蝮・せ繝医Ξ繧ｹ繝ｬ繝吶Ν',
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
      <CommonHeader title="繧ｹ繝医Ξ繧ｹ隕∝屏蛻・梵" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">繧ｹ繝医Ξ繧ｹ隕∝屏蛻・梵</h1>
                <p className="text-gray-600 mt-2">閨ｷ蝣ｴ縺ｮ繧ｹ繝医Ξ繧ｹ隕∝屏繧堤音螳壹＠縲√Γ繝ｳ繧ｿ繝ｫ繝倥Ν繧ｹ蟇ｾ遲悶ｒ謾ｯ謠ｴ</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '繧ｹ繝医Ξ繧ｹ隕∝屏蛻・梵繝ｬ繝昴・繝・,
                  facility: facilityParam || '蜈ｨ譁ｽ險ｭ',
                  reportType: 'stress-analysis',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDF繝繧ｦ繝ｳ繝ｭ繝ｼ繝・              </button>
            </div>
          </div>

          {/* 繧ｵ繝槭Μ繝ｼ繧ｫ繝ｼ繝・*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">蟷ｳ蝮・せ繝医Ξ繧ｹ繝ｬ繝吶Ν</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  {stressAverages.overall.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">蜈ｨ菴灘ｹｳ蝮・/p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">鬮倥せ繝医Ξ繧ｹ閠・/CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {highStressCount}蜷・                </p>
                <p className="text-xs text-gray-500 mt-1">
                  蜈ｨ菴薙・{((highStressCount / individual.length) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">譛螟ｧ繧ｹ繝医Ξ繧ｹ隕∝屏</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  讌ｭ蜍咎㍼
                </p>
                <p className="text-xs text-gray-500 mt-1">{stressAverages.workload.toFixed(1)}轤ｹ</p>
              </CardContent>
            </Card>
          </div>
          
          {/* 繧ｹ繝医Ξ繧ｹ隕∝屏蛻・梵 */}
          <Card>
            <CardHeader>
              <CardTitle>繧ｹ繝医Ξ繧ｹ隕∝屏蛻･蛻・梵</CardTitle>
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
                            let level = '菴・;
                            if (value >= 70) level = '鬮・;
                            else if (value >= 50) level = '荳ｭ';
                            return `${value.toFixed(1)}轤ｹ (繧ｹ繝医Ξ繧ｹ: ${level})`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* 驛ｨ鄂ｲ蛻･繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν */}
          <Card>
            <CardHeader>
              <CardTitle>驛ｨ鄂ｲ蛻･繧ｹ繝医Ξ繧ｹ繝ｬ繝吶Ν</CardTitle>
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
          
          {/* 繧ｹ繝医Ξ繧ｹ隕∝屏繝偵・繝医・繝・・ */}
          <Card>
            <CardHeader>
              <CardTitle>閨ｷ遞ｮ蛻･繧ｹ繝医Ξ繧ｹ隕∝屏繝偵・繝医・繝・・</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">閨ｷ遞ｮ</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">讌ｭ蜍咎㍼</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">莠ｺ髢馴未菫・/th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">陬・㍼讓ｩ</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">蝣ｱ驟ｬ</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">菴懈･ｭ迺ｰ蠅・/th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">螟牙喧</th>
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
                  菴弱せ繝医Ξ繧ｹ (0-49)
                </span>
                <span className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-orange-400 rounded mr-2"></span>
                  荳ｭ繧ｹ繝医Ξ繧ｹ (50-69)
                </span>
                <span className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-red-500 rounded mr-2"></span>
                  鬮倥せ繝医Ξ繧ｹ (70-100)
                </span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div><CategoryTopButton categoryPath="/reports/wellbeing" categoryName="繧ｦ繧ｧ繝ｫ繝薙・繧､繝ｳ繧ｰ" /></div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}