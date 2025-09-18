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
  ArcElement
);

function Content() {
  const searchParams = useSearchParams();
  const facilityParam = searchParams.get('facility') || '';
  
  // 繝・・繧ｿ縺ｮ隱ｭ縺ｿ霎ｼ縺ｿ縺ｨ繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
  const { individual, interventionPrograms } = useMemo(() => {
    const data = loadWellbeingData();
    return {
      individual: filterByFacility(data.individual, facilityParam),
      interventionPrograms: getInterventionPrograms()
    };
  }, [facilityParam]);
  
  // 繝励Ο繧ｰ繝ｩ繝蜿ょ刈迥ｶ豕√・髮・ｨ・  const participationAnalysis = useMemo(() => {
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
  
  // 繝励Ο繧ｰ繝ｩ繝蛻･蜉ｹ譫懷・譫・  const programEffectiveness = useMemo(() => {
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
  
  // 繝励Ο繧ｰ繝ｩ繝蜿ょ刈邇・・蜀・げ繝ｩ繝輔ョ繝ｼ繧ｿ
  const participationDoughnutData = useMemo(() => ({
    labels: ['蜿ょ刈閠・, '譛ｪ蜿ょ刈閠・],
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
  
  // 繝励Ο繧ｰ繝ｩ繝蛻･蜿ょ刈閠・焚縺ｮ繧ｰ繝ｩ繝輔ョ繝ｼ繧ｿ
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
        label: '蜿ょ刈閠・焚',
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
  
  // 蜉ｹ譫懈ｸｬ螳壹・蜑榊ｾ梧ｯ碑ｼ・ョ繝ｼ繧ｿ
  const beforeAfterData = useMemo(() => {
    const allEffects = individual.flatMap(p => p.interventionEffects || []);
    const avgBefore = allEffects.reduce((sum, e) => sum + e.preScore, 0) / allEffects.length || 0;
    const avgAfter = allEffects.reduce((sum, e) => sum + e.postScore, 0) / allEffects.length || 0;
    
    return {
      labels: ['螳滓命蜑・, '螳滓命蠕・],
      datasets: [{
        label: '蟷ｳ蝮・せ繧ｳ繧｢',
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
  
  // 繝励Ο繧ｰ繝ｩ繝蛻･謾ｹ蝟・紫繝・・繧ｿ
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
        label: '蟷ｳ蝮・隼蝟・紫 (%)',
        data: programImprovements.map(p => p.improvement),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      }]
    };
  }, [interventionPrograms, programEffectiveness]);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="莉句・繝励Ο繧ｰ繝ｩ繝蜉ｹ譫懈ｸｬ螳・ />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 繝倥ャ繝繝ｼ */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">莉句・繝励Ο繧ｰ繝ｩ繝蜉ｹ譫懈ｸｬ螳・/h1>
                <p className="text-gray-600 mt-2">蜷・ｨｮ莉句・繝励Ο繧ｰ繝ｩ繝縺ｮ螳滓命蜉ｹ譫懊ｒ螳夐㍼逧・↓隧穂ｾ｡繝ｻ蛻・梵</p>
                {facilityParam && (
                  <p className="text-sm text-gray-500 mt-1">蟇ｾ雎｡譁ｽ險ｭ: {facilityParam}</p>
                )}
              </div>
              <button
                onClick={() => exportToPDF({
                  title: '莉句・繝励Ο繧ｰ繝ｩ繝蜉ｹ譫懈ｸｬ螳壹Ξ繝昴・繝・,
                  facility: facilityParam || '蜈ｨ譁ｽ險ｭ',
                  reportType: 'intervention-program',
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
                <CardTitle className="text-sm font-medium text-gray-500">繝励Ο繧ｰ繝ｩ繝蜿ょ刈邇・/CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {participationAnalysis.participationRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {participationAnalysis.totalParticipants}蜷・/ {individual.length}蜷・                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">蟷ｳ蝮・隼蝟・紫</CardTitle>
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
                <p className="text-xs text-gray-500 mt-1">蜈ｨ繝励Ο繧ｰ繝ｩ繝蟷ｳ蝮・/p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">螳滓命繝励Ο繧ｰ繝ｩ繝謨ｰ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {interventionPrograms.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">遞ｮ鬘・/p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 蜿ょ刈邇・・繧ｰ繝ｩ繝・*/}
            <Card>
              <CardHeader>
                <CardTitle>繝励Ο繧ｰ繝ｩ繝蜿ょ刈迥ｶ豕・/CardTitle>
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
                              return `${context.label}: ${context.parsed}蜷・(${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* 蜑榊ｾ梧ｯ碑ｼ・*/}
            <Card>
              <CardHeader>
                <CardTitle>繝励Ο繧ｰ繝ｩ繝螳滓命蜑榊ｾ後・螟牙喧</CardTitle>
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
          
          {/* 繝励Ο繧ｰ繝ｩ繝蛻･蜿ょ刈閠・焚 */}
          <Card>
            <CardHeader>
              <CardTitle>繝励Ο繧ｰ繝ｩ繝蛻･蜿ょ刈閠・焚</CardTitle>
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
          
          {/* 繝励Ο繧ｰ繝ｩ繝蛻･謾ｹ蝟・紫 */}
          <Card>
            <CardHeader>
              <CardTitle>繝励Ο繧ｰ繝ｩ繝蛻･蟷ｳ蝮・隼蝟・紫</CardTitle>
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
                            return `謾ｹ蝟・紫: ${context.parsed.x.toFixed(1)}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* 繝励Ο繧ｰ繝ｩ繝隧ｳ邏ｰ繝・・繝悶Ν */}
          <Card>
            <CardHeader>
              <CardTitle>莉句・繝励Ο繧ｰ繝ｩ繝隧ｳ邏ｰ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        繝励Ο繧ｰ繝ｩ繝蜷・                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        遞ｮ蛻･
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        蜿ょ刈閠・焚
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        蟷ｳ蝮・隼蝟・紫
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        譛螟ｧ謾ｹ蝟・紫
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        譛溷ｾ・＆繧後ｋ謌先棡
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interventionPrograms.map((program) => {
                      const participation = participationAnalysis.programParticipation[program.id];
                      const effectiveness = programEffectiveness[program.id];
                      
                      const typeLabels = {
                        mental: '繝｡繝ｳ繧ｿ繝ｫ',
                        physical: '繝輔ぅ繧ｸ繧ｫ繝ｫ',
                        skill: '繧ｹ繧ｭ繝ｫ髢狗匱',
                        team: '繝√・繝',
                        other: '縺昴・莉・
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
          
          {/* 繝励Ο繧ｰ繝ｩ繝讎りｦ√き繝ｼ繝・*/}
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
                      <p><span className="font-medium">蟇ｾ雎｡:</span> {program.targetGroup.join(', ')}</p>
                      <p><span className="font-medium">譛滄俣:</span> {program.duration}</p>
                      <p><span className="font-medium">鬆ｻ蠎ｦ:</span> {program.frequency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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