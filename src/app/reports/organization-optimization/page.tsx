'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportLayout from '@/components/reports/ReportLayout';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import { facilities } from '@/app/data/facilityData';
import { exportToPDF } from '@/utils/pdfExport';
import { DataCommentList, MetricWithComment } from '@/components/DataComment';
import { generateOrganizationComments } from '@/utils/reportComments';

function OrganizationOptimizationReportContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get('facility');
  const [facility, setFacility] = useState<any>(null);
  
  useEffect(() => {
    if (facilityId) {
      const selected = facilities.find(f => f.id === facilityId);
      setFacility(selected);
    }
  }, [facilityId]);

  const reportData = {
      overview: {
        totalDepartments: 15,
        avgStaffPerDept: 33,
        managerRatio: 15,
        spanOfControl: 6.5,
        hierarchyLevels: 5,
        efficiencyScore: 78
      },
      departmentAnalysis: [
        {
          name: '内科病棟',
          staff: 85,
          managers: 12,
          spanOfControl: 7.1,
          workload: 92,
          efficiency: 85,
          issues: ['管理スパンが広い', '夜勤体制に課題']
        },
        {
          name: 'ICU',
          staff: 45,
          managers: 8,
          spanOfControl: 5.6,
          workload: 98,
          efficiency: 88,
          issues: ['業務負荷が高い', 'スキルミックス要改善']
        },
        {
          name: '外来',
          staff: 52,
          managers: 6,
          spanOfControl: 8.7,
          workload: 78,
          efficiency: 72,
          issues: ['管理者不足', '業務フロー非効率']
        },
        {
          name: 'リハビリ科',
          staff: 42,
          managers: 5,
          spanOfControl: 8.4,
          workload: 85,
          efficiency: 90,
          issues: ['職種間連携に改善余地']
        },
        {
          name: '薬剤部',
          staff: 25,
          managers: 3,
          spanOfControl: 8.3,
          workload: 88,
          efficiency: 82,
          issues: ['ピーク時対応に課題']
        }
      ],
      organizationalMetrics: {
        communicationFlow: {
          vertical: 65,
          horizontal: 72,
          crossFunctional: 58
        },
        decisionMaking: {
          speed: 68,
          quality: 82,
          empowerment: 55
        },
        collaboration: {
          withinDept: 85,
          betweenDepts: 62,
          withExternal: 70
        }
      },
      skillMixAnalysis: [
        {
          department: '内科病棟',
          optimal: { senior: 30, mid: 50, junior: 20 },
          current: { senior: 25, mid: 45, junior: 30 },
          gap: 'シニアスタッフ不足'
        },
        {
          department: 'ICU',
          optimal: { senior: 40, mid: 45, junior: 15 },
          current: { senior: 35, mid: 40, junior: 25 },
          gap: 'スキルバランス要調整'
        }
      ],
      recommendations: facilityId === 'tachigami-hospital' ? [
        {
          title: '介護医療院の管理体制強化',
          description: '管理者を2名増員し、スパンオブコントロールを適正化（11.7→7.0）',
          impact: '効率性20%向上、離職率低下',
          cost: 10000000,
          priority: 'high'
        },
      ] : [
        {
          title: '外来部門の管理体制強化',
          description: '管理者を2名増員し、スパンオブコントロールを適正化（8.7→6.0）',
          impact: '効率性15%向上、職員満足度向上',
          cost: 12000000,
          priority: 'high'
        },
        {
          title: 'フラット組織化の推進',
          description: '中間管理層を削減し、現場への権限委譲を促進',
          impact: '意思決定速度30%向上',
          cost: 3000000,
          priority: 'medium'
        },
        {
          title: '部門横断チームの設置',
          description: '患者ケア向上のための多職種連携チームを3つ新設',
          impact: '患者満足度10%向上、業務効率化',
          cost: 5000000,
          priority: 'high'
        }
      ]
    };

  return (
    <div>
      <BreadcrumbBar />
      <ReportLayout
        title="組織構造最適化分析"
        description="部門別の人員配置と組織効率を分析します"
      icon="🏢"
      color="bg-indigo-500"
      facility={facility}
      onExportPDF={() => exportToPDF({
        title: '組織構造最適化分析レポート',
        facility: facility?.name,
        reportType: 'organization-optimization',
        elementId: 'report-content',
        dateRange: new Date().toLocaleDateString('ja-JP')
      })}
      categoryPath="/reports/strategic-analysis"
      categoryName="戦略分析"
    >
      <div id="report-content" className="p-8">
        {/* 組織概要 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">組織構造概要</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">総部門数</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalDepartments}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">部門平均人員</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.avgStaffPerDept}名</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">管理職比率</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.managerRatio}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MetricWithComment
                label="管理スパン"
                value={reportData.overview.spanOfControl}
                unit=""
                comment={reportData.overview.spanOfControl > 7 ? {
                  id: 'span-warning',
                  type: 'warning',
                  title: '管理スパンが過大',
                  message: '一人の管理者が管理する人数が多すぎます。マネジメント負荷の軽減が必要です。',
                  priority: 'high'
                } : undefined}
              />
              <p className="text-xs text-gray-500 mt-1">推奨: 5-7</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">階層レベル</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.hierarchyLevels}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">組織効率スコア</p>
              <p className="text-2xl font-bold text-indigo-600">{reportData.overview.efficiencyScore}%</p>
            </div>
          </div>
        </section>

        {/* 部門別分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">部門別組織分析</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部門</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">人員数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">管理者数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">管理スパン</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">業務負荷</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">効率性</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">課題</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.departmentAnalysis.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.staff}名</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.managers}名</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        dept.spanOfControl > 7 ? 'text-red-600' :
                        dept.spanOfControl < 5 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {dept.spanOfControl}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              dept.workload > 90 ? 'bg-red-600' :
                              dept.workload > 80 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${dept.workload}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{dept.workload}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${dept.efficiency}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-500">{dept.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {dept.issues.map((issue, idx) => (
                        <span key={idx} className="block text-red-600">• {issue}</span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 組織指標 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">組織パフォーマンス指標</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">コミュニケーション効率</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">縦方向（上下）</span>
                    <span className="font-medium">{reportData.organizationalMetrics.communicationFlow.vertical}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${reportData.organizationalMetrics.communicationFlow.vertical}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">横方向（同階層）</span>
                    <span className="font-medium">{reportData.organizationalMetrics.communicationFlow.horizontal}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${reportData.organizationalMetrics.communicationFlow.horizontal}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">部門横断</span>
                    <span className="font-medium">{reportData.organizationalMetrics.communicationFlow.crossFunctional}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${reportData.organizationalMetrics.communicationFlow.crossFunctional}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">意思決定プロセス</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">スピード</span>
                    <span className="font-medium">{reportData.organizationalMetrics.decisionMaking.speed}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${reportData.organizationalMetrics.decisionMaking.speed}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">品質</span>
                    <span className="font-medium">{reportData.organizationalMetrics.decisionMaking.quality}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${reportData.organizationalMetrics.decisionMaking.quality}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">権限委譲</span>
                    <span className="font-medium">{reportData.organizationalMetrics.decisionMaking.empowerment}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${reportData.organizationalMetrics.decisionMaking.empowerment}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">協働レベル</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">部門内</span>
                    <span className="font-medium">{reportData.organizationalMetrics.collaboration.withinDept}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${reportData.organizationalMetrics.collaboration.withinDept}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">部門間</span>
                    <span className="font-medium">{reportData.organizationalMetrics.collaboration.betweenDepts}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${reportData.organizationalMetrics.collaboration.betweenDepts}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">外部連携</span>
                    <span className="font-medium">{reportData.organizationalMetrics.collaboration.withExternal}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${reportData.organizationalMetrics.collaboration.withExternal}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* スキルミックス分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">スキルミックス分析</h2>
          <div className="space-y-4">
            {reportData.skillMixAnalysis.map((analysis, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{analysis.department}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">最適構成</p>
                    <div className="space-y-1">
                      <p className="text-xs">シニア: {analysis.optimal.senior}%</p>
                      <p className="text-xs">中堅: {analysis.optimal.mid}%</p>
                      <p className="text-xs">ジュニア: {analysis.optimal.junior}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">現状</p>
                    <div className="space-y-1">
                      <p className="text-xs">シニア: {analysis.current.senior}%</p>
                      <p className="text-xs">中堅: {analysis.current.mid}%</p>
                      <p className="text-xs">ジュニア: {analysis.current.junior}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">ギャップ</p>
                    <p className="text-sm font-medium text-orange-600">{analysis.gap}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 改善提案 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">組織構造最適化の提案</h2>
          <div className="space-y-4">
            {reportData.recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                    <p className="mt-2 text-gray-600">{rec.description}</p>
                    <div className="mt-3 flex items-center space-x-6 text-sm">
                      <div>
                        <span className="text-gray-600">期待効果: </span>
                        <span className="font-medium text-green-600">{rec.impact}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">必要投資: </span>
                        <span className="font-medium">¥{(rec.cost ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.priority === 'high' ? '優先度高' :
                     rec.priority === 'medium' ? '優先度中' : '優先度低'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* データ解釈コメント */}
        <section className="mt-8">
          <DataCommentList 
            comments={[
              ...generateOrganizationComments({
                avgSpanOfControl: reportData.overview.spanOfControl
              }),
              {
                id: 'outpatient-crisis',
                type: 'warning',
                title: '外来部門の管理体制不足',
                message: '外来部門の管理スパンが8.7と過大で、効率性が72%に低下しています。管理者の増員が急務です。',
                priority: 'high'
              },
              {
                id: 'communication-gap',
                type: 'interpretation',
                title: '部門横断コミュニケーションの課題',
                message: '部門横断のコミュニケーション効率58%と低く、患者ケアの質に影響を与える可能性があります。',
                priority: 'high'
              },
              {
                id: 'empowerment-action',
                type: 'action',
                title: '権限委譲の推進',
                message: '権限委譲度55%と低く、意思決定の遅れにつながっています。フラット組織化と現場への権限委譲を進めましょう。',
                priority: 'medium'
              },
              {
                id: 'cross-functional-trend',
                type: 'trend',
                title: '多職種連携の重要性',
                message: '医療の質向上には部門横断チームの設置が効果的です。患者満足度10%向上が期待されます。',
                priority: 'medium'
              }
            ]}
          />
        </section>

      </div>
    </ReportLayout>
  );
}

export default function OrganizationOptimizationReport() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">読み込み中...</div>}>
      <OrganizationOptimizationReportContent />
    </Suspense>
  );
}