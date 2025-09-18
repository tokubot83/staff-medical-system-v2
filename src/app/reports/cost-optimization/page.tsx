'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportLayout from '@/components/reports/ReportLayout';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import { facilities } from '@/app/data/facilityData';
import { exportToPDF } from '@/utils/pdfExport';
import { DataCommentList, MetricWithComment } from '@/components/DataComment';
import { generateCostComments } from '@/utils/reportComments';
import { organizationData, getDepartmentsByType } from '@/app/data/organizationData';
import { tachigamiOrganizationData } from '@/app/data/tachigamiOrganizationData';

function CostOptimizationReportContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get('facility');
  const [facility, setFacility] = useState<any>(null);
  
  useEffect(() => {
    if (facilityId) {
      const selected = facilities.find(f => f.id === facilityId);
      setFacility(selected);
    }
  }, [facilityId]);

  const generateReportData = () => {
    // 施設に応じてデータを調整
    const isRehabilitation = facilityId === 'tachigami-hospital';
    
    return {
      overview: {
        totalCost: 2450000000,
        revenue: 5200000000,
        laborCostRatio: 47.1,
        targetRatio: 45.0,
        avgSalary: 4900000,
        industryAvg: 4700000
      },
      costBreakdown: [
        { category: '基本給', amount: 1680000000, percentage: 68.6 },
        { category: '賞与', amount: 420000000, percentage: 17.1 },
        { category: '各種手当', amount: 180000000, percentage: 7.3 },
        { category: '法定福利費', amount: 170000000, percentage: 6.9 }
      ],
      departmentCosts: isRehabilitation ? [
        {
          name: '看護部門',
          staff: 65,
          totalCost: 318500000,
          avgCost: 4900000,
          costPerPatient: 8500,
          efficiency: 85
        },
        {
          name: 'リハビリテーション部門',
          staff: 35,
          totalCost: 154000000,
          avgCost: 4400000,
          costPerPatient: 4200,
          efficiency: 92
        },
        {
          name: '介護部門',
          staff: 35,
          totalCost: 126000000,
          avgCost: 3600000,
          costPerPatient: 3800,
          efficiency: 78
        },
        {
          name: '医局',
          staff: 8,
          totalCost: 64000000,
          avgCost: 8000000,
          costPerPatient: 12000,
          efficiency: 88
        },
        {
          name: '事務部門',
          staff: 20,
          totalCost: 84000000,
          avgCost: 4200000,
          costPerPatient: 2500,
          efficiency: 82
        }
      ] : [
        {
          name: '看護部',
          staff: 220,
          totalCost: 1078000000,
          avgCost: 4900000,
          costPerPatient: 12500,
          efficiency: 88
        },
        {
          name: '医局',
          staff: 85,
          totalCost: 680000000,
          avgCost: 8000000,
          costPerPatient: 8200,
          efficiency: 92
        },
        {
          name: 'リハビリテーション科',
          staff: 45,
          totalCost: 198000000,
          avgCost: 4400000,
          costPerPatient: 5800,
          efficiency: 85
        },
        {
          name: '薬剤部',
          staff: 25,
          totalCost: 122500000,
          avgCost: 4900000,
          costPerPatient: 3200,
          efficiency: 90
        },
        {
          name: '事務部',
          staff: 40,
          totalCost: 168000000,
          avgCost: 4200000,
          costPerPatient: 2100,
          efficiency: 78
        }
      ],
      overtimeCosts: {
        total: 98000000,
        byDepartment: isRehabilitation ? [
          { name: '介護医療院', amount: 18000000, hours: 3200 },
          { name: '看護部門', amount: 15000000, hours: 2800 },
          { name: 'リハビリテーション部門', amount: 8000000, hours: 1600 },
          { name: '医局', amount: 3000000, hours: 400 },
          { name: 'その他', amount: 4000000, hours: 800 }
        ] : [
          { name: 'ICU', amount: 28000000, hours: 4200 },
          { name: '看護部（病棟）', amount: 35000000, hours: 5800 },
          { name: '医局', amount: 20000000, hours: 2400 },
          { name: '薬剤部', amount: 8000000, hours: 1200 },
          { name: 'その他', amount: 7000000, hours: 1100 }
        ]
      },
      benchmarkAnalysis: [
        { metric: '人件費率', internal: 47.1, peer: 45.8, best: 43.2 },
        { metric: '職員一人当たり収益', internal: 10400000, peer: 11200000, best: 13500000 },
        { metric: '管理職比率', internal: 15, peer: 12, best: 10 },
        { metric: '非正規職員比率', internal: 18, peer: 22, best: 15 }
      ],
      optimizationOpportunities: [
        {
          title: '残業時間削減による人件費圧縮',
          description: 'AIシフト最適化とタスクシフティングにより残業を30%削減',
          currentCost: 98000000,
          potentialSaving: 29400000,
          implementation: '3ヶ月',
          difficulty: 'medium'
        },
        {
          title: '業務効率化による適正人員配置',
          description: 'RPA導入と業務プロセス改善により事務部門を15%効率化',
          currentCost: 168000000,
          potentialSaving: 25200000,
          implementation: '6ヶ月',
          difficulty: 'high'
        },
        {
          title: '非正規職員の戦略的活用',
          description: '業務特性に応じた雇用形態の最適化',
          currentCost: 441000000,
          potentialSaving: 22050000,
          implementation: '1年',
          difficulty: 'medium'
        },
        {
          title: '福利厚生制度の見直し',
          description: 'カフェテリアプラン導入による効率的な福利厚生',
          currentCost: 73500000,
          potentialSaving: 11025000,
          implementation: '6ヶ月',
          difficulty: 'low'
        }
      ],
      projections: {
        currentYear: { cost: 2450000000, ratio: 47.1 },
        year1: { cost: 2362325000, ratio: 45.8 },
        year2: { cost: 2324700000, ratio: 45.0 },
        year3: { cost: 2289150000, ratio: 44.2 }
      }
    };
  };

  const reportData = generateReportData();

  return (
    <div>
      <BreadcrumbBar />
      <ReportLayout
        title="人件費最適化分析"
        description="人件費の詳細分析と最適化提案を行います"
      icon="💰"
      color="bg-red-500"
      facility={facility}
      onExportPDF={() => exportToPDF({
        title: '人件費最適化分析レポート',
        facility: facility?.name,
        reportType: 'cost-optimization',
        elementId: 'report-content',
        dateRange: new Date().toLocaleDateString('ja-JP')
      })}
      categoryPath="/reports/strategic-analysis"
      categoryName="戦略分析"
    >
      <div id="report-content" className="p-8">
        {/* 概要 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">人件費概要</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">総人件費</p>
              <p className="text-2xl font-bold text-gray-900">¥{(reportData.overview.totalCost / 1000000).toFixed(0)}百万</p>
              <p className="text-xs text-gray-500 mt-1">年間</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MetricWithComment
                label="人件費率"
                value={reportData.overview.laborCostRatio}
                unit="%"
                comment={reportData.overview.laborCostRatio > 45 ? {
                  id: 'cost-ratio-warning',
                  type: 'warning',
                  title: '人件費率が高水準',
                  message: `人件費率${reportData.overview.laborCostRatio}%は目標値を上回っています。効率化施策の検討が必要です。`,
                  priority: 'high'
                } : undefined}
              />
              <p className="text-xs text-gray-500 mt-1">目標: {reportData.overview.targetRatio}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">平均年収</p>
              <p className="text-2xl font-bold text-gray-900">¥{(reportData.overview.avgSalary / 10000).toFixed(0)}万</p>
              <p className="text-xs text-gray-500 mt-1">業界平均: ¥{(reportData.overview.industryAvg / 10000).toFixed(0)}万</p>
            </div>
          </div>
        </section>

        {/* コスト内訳 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">人件費内訳</h2>
          <div className="bg-white border rounded-lg p-6">
            <div className="space-y-3">
              {reportData.costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm text-gray-600 w-32">{item.category}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      ¥{(item.amount / 1000000).toFixed(0)}百万
                    </span>
                    <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 部門別コスト分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">部門別人件費分析</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部門</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">人員</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">総人件費</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均人件費</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">患者単価</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">効率性</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.departmentCosts.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.staff}名</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ¥{(dept.totalCost / 1000000).toFixed(0)}百万
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ¥{(dept.avgCost / 10000).toFixed(0)}万
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ¥{(dept.costPerPatient ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              dept.efficiency >= 90 ? 'bg-green-600' :
                              dept.efficiency >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${dept.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{dept.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 残業コスト分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">残業コスト分析</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">年間残業コスト</p>
                <p className="text-3xl font-bold text-red-700">¥{(reportData.overtimeCosts.total / 1000000).toFixed(0)}百万</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-600">総人件費に占める割合</p>
                <p className="text-2xl font-bold text-red-700">
                  {((reportData.overtimeCosts.total / reportData.overview.totalCost) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {reportData.overtimeCosts.byDepartment.map((dept, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{(dept.hours ?? 0).toLocaleString()}時間</span>
                  <span className="text-sm font-medium">¥{(dept.amount / 1000000).toFixed(1)}百万</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ベンチマーク分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">同規模病院とのベンチマーク</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.benchmarkAnalysis.map((metric, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">{metric.metric}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">当院</span>
                    <span className={`text-sm font-medium ${
                      metric.internal > metric.peer ? 'text-red-600' : 'text-green-600'
                    }`}>{metric.internal}{metric.metric.includes('率') ? '%' : metric.metric.includes('収益') ? '円' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">同規模平均</span>
                    <span className="text-sm">{metric.peer}{metric.metric.includes('率') ? '%' : metric.metric.includes('収益') ? '円' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">ベスト</span>
                    <span className="text-sm">{metric.best}{metric.metric.includes('率') ? '%' : metric.metric.includes('収益') ? '円' : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 最適化機会 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">コスト最適化の機会</h2>
          <div className="space-y-4">
            {reportData.optimizationOpportunities.map((opp, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{opp.title}</h3>
                    <p className="mt-2 text-gray-600">{opp.description}</p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">現在コスト</p>
                        <p className="font-medium">¥{(opp.currentCost / 1000000).toFixed(0)}百万</p>
                      </div>
                      <div>
                        <p className="text-gray-600">削減可能額</p>
                        <p className="font-medium text-green-600">¥{(opp.potentialSaving / 1000000).toFixed(1)}百万</p>
                      </div>
                      <div>
                        <p className="text-gray-600">実施期間</p>
                        <p className="font-medium">{opp.implementation}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">難易度</p>
                        <p className={`font-medium ${
                          opp.difficulty === 'high' ? 'text-red-600' :
                          opp.difficulty === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {opp.difficulty === 'high' ? '高' :
                           opp.difficulty === 'medium' ? '中' : '低'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <span className="font-medium">総削減可能額:</span> ¥{((29400000 + 25200000 + 22050000 + 11025000) / 1000000).toFixed(1)}百万円/年
            </p>
          </div>
        </section>

        {/* 将来予測 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">人件費削減シミュレーション</h2>
          <div className="bg-white border rounded-lg p-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">現在</p>
                <p className="text-xl font-bold text-gray-900">¥{(reportData.projections.currentYear.cost / 1000000).toFixed(0)}百万</p>
                <p className="text-sm text-gray-500">{reportData.projections.currentYear.ratio}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">1年後</p>
                <p className="text-xl font-bold text-green-600">¥{(reportData.projections.year1.cost / 1000000).toFixed(0)}百万</p>
                <p className="text-sm text-gray-500">{reportData.projections.year1.ratio}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">2年後</p>
                <p className="text-xl font-bold text-green-600">¥{(reportData.projections.year2.cost / 1000000).toFixed(0)}百万</p>
                <p className="text-sm text-gray-500">{reportData.projections.year2.ratio}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">3年後</p>
                <p className="text-xl font-bold text-green-600">¥{(reportData.projections.year3.cost / 1000000).toFixed(0)}百万</p>
                <p className="text-sm text-gray-500">{reportData.projections.year3.ratio}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* データ解釈コメント */}
        <section className="mt-8">
          <DataCommentList 
            comments={[
              ...generateCostComments({
                laborCostRatio: reportData.overview.laborCostRatio,
                overtimeCost: reportData.overtimeCosts.total
              }),
              {
                id: 'optimization-potential',
                type: 'insight',
                title: '大幅なコスト削減の可能性',
                message: '各種最適化施策の実施により、年間8,760万円のコスト削減が可能です。特に残業削減と業務効率化が効果的です。',
                priority: 'high'
              },
              facilityId === 'tachigami-hospital' ? {
                id: 'dept-efficiency',
                type: 'interpretation',
                title: '部門別効率性の分析',
                message: '介護部門の効率性が78%と低く、業務フローの改善や介護ロボットの導入による改善余地があります。',
                priority: 'medium'
              } : {
                id: 'dept-efficiency',
                type: 'interpretation',
                title: '部門別効率性の分析',
                message: '事務部の効率性が78%と低く、RPA導入や業務プロセス改善による大幅な改善余地があります。',
                priority: 'medium'
              },
              {
                id: 'overtime-action',
                type: 'action',
                title: 'AIシフト最適化の導入',
                message: 'AIを活用したシフト最適化により、残業を年間2,940万円削減できます。実施期間3ヶ月と短期間で効果が得られます。',
                priority: 'high'
              },
              {
                id: 'projection-trend',
                type: 'trend',
                title: '人件費率の改善見込み',
                message: '最適化施策の実施により、3年後には人件費率44.2%まで低減し、業界ベストプラクティスに近づきます。',
                priority: 'medium'
              }
            ]}
          />
        </section>
      </div>
    </ReportLayout>
  );
}

export default function CostOptimizationReport() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">読み込み中...</div>}>
      <CostOptimizationReportContent />
    </Suspense>
  );
}