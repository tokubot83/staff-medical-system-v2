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

// Chart.js縺ｮ逋ｻ骭ｲ
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
  
  // 繝・・繧ｿ縺ｮ隱ｭ縺ｿ霎ｼ縺ｿ縺ｨ繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
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
  
  // 繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ5隕∫ｴ縺ｮ蟷ｳ蝮・､
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
  
  // 5隕∫ｴ縺ｮ譽偵げ繝ｩ繝輔ョ繝ｼ繧ｿ
  const elementsData = useMemo(() => ({
    labels: ['蜉ｴ蜒肴凾髢捺ｺ雜ｳ蠎ｦ', '繝励Λ繧､繝吶・繝域凾髢・, '譟碑ｻ滓ｧ', '螳ｶ譌上→縺ｮ譎る俣', '繧ｻ繝ｫ繝輔こ繧｢'],
    datasets: [{
      label: '繧ｹ繧ｳ繧｢',
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
  
  // 閨ｷ遞ｮ蛻･縺ｮ繝ｬ繝ｼ繝繝ｼ繝√Ε繝ｼ繝医ョ繝ｼ繧ｿ
  const positionRadarData = useMemo(() => {
    const positions = ['逵玖ｭｷ蟶ｫ', '逅・ｭｦ逋よｳ募｣ｫ', '菴懈･ｭ逋よｳ募｣ｫ'];
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
      labels: ['蜉ｴ蜒肴凾髢捺ｺ雜ｳ蠎ｦ', '繝励Λ繧､繝吶・繝域凾髢・, '譟碑ｻ滓ｧ', '螳ｶ譌上→縺ｮ譎る俣', '繧ｻ繝ｫ繝輔こ繧｢'],
      datasets
    };
  }, [individual]);
  
  // 繝医Ξ繝ｳ繝峨ョ繝ｼ繧ｿ
  const trendData = useMemo(() => {
    const facilityTrend = trends.find(t => 
      t.category === 'facility' && (facilityParam ? t.name === facilityParam : t.name === '蟆丞次逞・劼')
    );
    
    if (!facilityTrend) return null;
    
    return {
      labels: facilityTrend.data.map(d => d.period),
      datasets: [{
        label: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ',
        data: facilityTrend.data.map(d => d.workLifeBalance),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      }]
    };
  }, [trends, facilityParam]);
  
  // 荳紋ｻ｣蛻･蛻・梵
  const generationData = useMemo(() => {
    const generations = [
      { name: 'Z荳紋ｻ｣・茨ｽ・7豁ｳ・・, min: 0, max: 27 },
      { name: '繝溘Ξ繝九い繝ｫ荳紋ｻ｣・・8-43豁ｳ・・, min: 28, max: 43 },
      { name: 'X荳紋ｻ｣・・4-59豁ｳ・・, min: 44, max: 59 },
      { name: '繝吶ン繝ｼ繝悶・繝槭・荳紋ｻ｣・・0豁ｳ・橸ｼ・, min: 60, max: 100 }
    ];
    
    const data = generations.map(gen => {
      const genData = individualWithAge.filter(p => p.age && p.age >= gen.min && p.age <= gen.max);
      if (genData.length === 0) return 0;
      
      return genData.reduce((sum, p) => sum + p.workLifeBalance.overall, 0) / genData.length;
    });
    
    return {
      labels: generations.map(g => g.name),
      datasets: [{
        label: '邱丞粋繝舌Λ繝ｳ繧ｹ繧ｹ繧ｳ繧｢',
        data,
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1
      }]
    };
  }, [individualWithAge]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ隧穂ｾ｡" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ隧穂ｾ｡</h1>
                <p className="text-gray-600 mt-2">莉穂ｺ九→逕滓ｴｻ縺ｮ隱ｿ蜥後ｒ螟夐擇逧・↓隧穂ｾ｡縺励∝ロ縺阪ｄ縺吶＞迺ｰ蠅・▼縺上ｊ繧呈髪謠ｴ</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ隧穂ｾ｡繝ｬ繝昴・繝・,
                  facility: facilityParam || '蜈ｨ譁ｽ險ｭ',
                  reportType: 'work-life-balance',
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
                <CardTitle className="text-sm font-medium text-gray-500">邱丞粋繝舌Λ繝ｳ繧ｹ繧ｹ繧ｳ繧｢</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {balanceAverages.overall.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">蜈ｨ菴灘ｹｳ蝮・/p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">譛鬮倩ｩ穂ｾ｡鬆・岼</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  螳ｶ譌上→縺ｮ譎る俣
                </p>
                <p className="text-xs text-gray-500 mt-1">{balanceAverages.familySupport.toFixed(1)}轤ｹ</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">謾ｹ蝟・ｿ・ｦ・・岼</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  繝励Λ繧､繝吶・繝域凾髢・                </p>
                <p className="text-xs text-gray-500 mt-1">{balanceAverages.privateTime.toFixed(1)}轤ｹ</p>
              </CardContent>
            </Card>
          </div>
          
          {/* 5隕∫ｴ縺ｮ隧穂ｾ｡ */}
          <Card>
            <CardHeader>
              <CardTitle>繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ5隕∫ｴ縺ｮ隧穂ｾ｡</CardTitle>
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
                            return `${context.parsed.y.toFixed(1)}轤ｹ`;
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
            {/* 閨ｷ遞ｮ蛻･豈碑ｼ・*/}
            <Card>
              <CardHeader>
                <CardTitle>閨ｷ遞ｮ蛻･繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ豈碑ｼ・/CardTitle>
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
            
            {/* 荳紋ｻ｣蛻･蛻・梵 */}
            <Card>
              <CardHeader>
                <CardTitle>荳紋ｻ｣蛻･繝舌Λ繝ｳ繧ｹ繧ｹ繧ｳ繧｢</CardTitle>
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
          
          {/* 繝医Ξ繝ｳ繝峨げ繝ｩ繝・*/}
          {trendData && (
            <Card>
              <CardHeader>
                <CardTitle>繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ縺ｮ謗ｨ遘ｻ</CardTitle>
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
          
          {/* 隧ｳ邏ｰ繝・・繝悶Ν */}
          <Card>
            <CardHeader>
              <CardTitle>驛ｨ鄂ｲ蛻･繝ｯ繝ｼ繧ｯ繝ｩ繧､繝輔ヰ繝ｩ繝ｳ繧ｹ隧ｳ邏ｰ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        驛ｨ鄂ｲ
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        莠ｺ謨ｰ
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        邱丞粋繧ｹ繧ｳ繧｢
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        蜉ｴ蜒肴凾髢・                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        繝励Λ繧､繝吶・繝・                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        譟碑ｻ滓ｧ
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