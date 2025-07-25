'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportLayout from '@/components/reports/ReportLayout';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import BackToReportsButton from '@/components/BackToReportsButton';
import { facilities } from '@/app/data/facilityData';
import { staffDatabase } from '@/app/data/staffData';
import { exportToPDF } from '@/utils/pdfExport';
import { DataCommentList, MetricWithComment } from '@/components/DataComment';
import { DataComment } from '@/types/commentTypes';
import { organizationData, getDepartmentsByType } from '@/app/data/organizationData';
import { tachigamiOrganizationData } from '@/app/data/tachigamiOrganizationData';

function TurnoverRiskReportContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get('facility');
  const [facility, setFacility] = useState<any>(null);
  
  useEffect(() => {
    if (facilityId) {
      const selected = facilities.find(f => f.id === facilityId);
      setFacility(selected);
    }
  }, [facilityId]);

  // レポートデータの生成
  const generateReportData = () => {
    // 施設に応じて組織データを選択
    const currentOrgData = facilityId === 'tachigami-hospital' ? tachigamiOrganizationData : organizationData;
    const isRehabilitation = facilityId === 'tachigami-hospital';
    // 実際のスタッフデータからリスク分析
    const staff = Object.values(staffDatabase);
    const highRiskStaff = staff.filter(s => 
      s.stressIndex > 70 || s.engagement < 50 || s.overtime > 30 || s.paidLeaveRate < 30
    );
    
    return {
      overview: {
        totalStaff: staff.length,
        highRisk: highRiskStaff.length,
        mediumRisk: Math.floor(staff.length * 0.25),
        lowRisk: staff.length - highRiskStaff.length - Math.floor(staff.length * 0.25),
        predictedTurnover: Math.round(highRiskStaff.length * 0.4),
        currentTurnoverRate: 8.5
      },
      riskFactors: [
        {
          factor: '過重労働（残業過多）',
          weight: 25,
          affectedStaff: staff.filter(s => s.overtime > 25).length,
          correlation: 0.72
        },
        {
          factor: '低エンゲージメント',
          weight: 22,
          affectedStaff: staff.filter(s => s.engagement < 60).length,
          correlation: 0.68
        },
        {
          factor: '高ストレス指標',
          weight: 20,
          affectedStaff: staff.filter(s => s.stressIndex > 70).length,
          correlation: 0.65
        },
        {
          factor: '有給未消化',
          weight: 15,
          affectedStaff: staff.filter(s => s.paidLeaveRate < 40).length,
          correlation: 0.58
        },
        {
          factor: '評価への不満',
          weight: 10,
          affectedStaff: staff.filter(s => s.evaluation === 'C' || s.evaluation === 'D').length,
          correlation: 0.52
        },
        {
          factor: 'キャリア停滞',
          weight: 8,
          affectedStaff: Math.floor(staff.length * 0.15),
          correlation: 0.45
        }
      ],
      highRiskProfiles: highRiskStaff.slice(0, 5).map(s => ({
        id: s.id,
        name: s.name,
        department: s.department,
        position: s.position,
        riskScore: Math.min(95, Math.round(
          (s.stressIndex / 100) * 30 +
          ((100 - s.engagement) / 100) * 25 +
          (s.overtime / 50) * 20 +
          ((100 - s.paidLeaveRate) / 100) * 15 +
          (s.evaluation === 'C' || s.evaluation === 'D' ? 10 : 0)
        )),
        mainRisks: [
          s.stressIndex > 70 && 'ストレス過多',
          s.engagement < 50 && '低エンゲージメント',
          s.overtime > 30 && '過重労働',
          s.paidLeaveRate < 30 && '休暇未取得'
        ].filter(Boolean) as string[],
        recommendedActions: [
          '個別面談の実施',
          '業務負荷の見直し',
          'メンタルヘルスサポート'
        ]
      })),
      departmentRisk: isRehabilitation ? [
        { name: 'リハビリテーション部門', avgRiskScore: 52, turnoverRate: 8.5, trend: 'stable' },
        { name: '第１病棟', avgRiskScore: 48, turnoverRate: 7.2, trend: 'decreasing' },
        { name: '介護医療院', avgRiskScore: 45, turnoverRate: 9.8, trend: 'increasing' },
        { name: '外来', avgRiskScore: 40, turnoverRate: 5.5, trend: 'stable' },
        { name: '薬剤部門', avgRiskScore: 35, turnoverRate: 4.2, trend: 'stable' }
      ] : [
        { name: 'ICU', avgRiskScore: 72, turnoverRate: 12.5, trend: 'increasing' },
        { name: '外来', avgRiskScore: 65, turnoverRate: 10.2, trend: 'stable' },
        { name: '外科病棟', avgRiskScore: 58, turnoverRate: 8.8, trend: 'increasing' },
        { name: '内科病棟', avgRiskScore: 45, turnoverRate: 6.5, trend: 'decreasing' },
        { name: 'リハビリテーション科', avgRiskScore: 38, turnoverRate: 5.2, trend: 'stable' }
      ],
      survivalAnalysis: {
        periods: ['0-1年', '1-2年', '2-3年', '3-5年', '5年以上'],
        survivalRates: [88, 82, 78, 85, 92],
        criticalPeriod: '1-3年目'
      },
      interventions: [
        {
          title: '高リスク職員への早期介入プログラム',
          description: 'データ分析で特定した高リスク職員に対する個別支援プログラムの実施',
          targetGroup: 'リスクスコア70以上',
          expectedReduction: 40,
          cost: 2000000,
          roi: 320
        },
        isRehabilitation ? {
          title: '介護医療院の人員配置最適化',
          description: '介護職員の増員と勤務シフトの改善による負担軽減',
          targetGroup: '介護医療院全職員',
          expectedReduction: 30,
          cost: 5000000,
          roi: 200
        } : {
          title: 'ICU・救急部門の勤務体制改善',
          description: '2交代制から3交代制への移行と増員による負担軽減',
          targetGroup: 'ICU・救急部門全職員',
          expectedReduction: 35,
          cost: 8000000,
          roi: 180
        },
        {
          title: 'キャリア開発支援プログラム',
          description: '個別キャリア相談とスキルアップ支援の強化',
          targetGroup: '勤続3年以上の中堅職員',
          expectedReduction: 25,
          cost: 3000000,
          roi: 250
        }
      ]
    };
  };

  const reportData = generateReportData();

  return (
    <ReportLayout
      title="離職リスク予測"
      description="AI分析による離職リスクの予測と対策を提案します"
      icon="⚠️"
      color="bg-orange-500"
      facility={facility}
      onExportPDF={() => exportToPDF({
        title: '離職リスク予測レポート',
        facility: facility?.name,
        reportType: 'turnover-risk',
        elementId: 'report-content',
        dateRange: new Date().toLocaleDateString('ja-JP')
      })}
    >
      <div id="report-content" className="p-8">
        {/* リスク概要 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">離職リスク概要</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <MetricWithComment
                label="高リスク職員"
                value={reportData.overview.highRisk}
                unit="名"
                comment={reportData.overview.highRisk > reportData.overview.totalStaff * 0.15 ? {
                  id: 'high-risk-warning',
                  type: 'warning',
                  title: '早急な対策が必要',
                  message: `高リスク職員が全体の${Math.round(reportData.overview.highRisk / reportData.overview.totalStaff * 100)}%に達しています。個別面談と業務負荷の見直しが急務です。`,
                  priority: 'high'
                } : undefined}
              />
              <p className="text-xs text-red-600 mt-1">全体の{Math.round(reportData.overview.highRisk / reportData.overview.totalStaff * 100)}%</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-600">中リスク職員</p>
              <p className="text-2xl font-bold text-yellow-700">{reportData.overview.mediumRisk}名</p>
              <p className="text-xs text-yellow-600 mt-1">全体の{Math.round(reportData.overview.mediumRisk / reportData.overview.totalStaff * 100)}%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-600">低リスク職員</p>
              <p className="text-2xl font-bold text-green-700">{reportData.overview.lowRisk}名</p>
              <p className="text-xs text-green-600 mt-1">全体の{Math.round(reportData.overview.lowRisk / reportData.overview.totalStaff * 100)}%</p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">予測離職者数（1年以内）</p>
                <p className="text-3xl font-bold text-gray-900">{reportData.overview.predictedTurnover}名</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">現在の離職率</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.overview.currentTurnoverRate}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* リスク要因分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">主要離職リスク要因</h2>
          <div className="space-y-3">
            {reportData.riskFactors.map((factor, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{factor.factor}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">該当者: {factor.affectedStaff}名</span>
                    <span className="text-sm text-gray-600">相関係数: {factor.correlation}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          factor.weight >= 20 ? 'bg-red-500' :
                          factor.weight >= 15 ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${factor.weight}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700 w-12 text-right">
                    {factor.weight}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 高リスク職員プロファイル */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">高リスク職員プロファイル（上位5名）</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">職員情報</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">リスクスコア</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">主要リスク要因</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推奨対応</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.highRiskProfiles.map((profile, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                        <p className="text-xs text-gray-500">{profile.department} - {profile.position}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              profile.riskScore >= 80 ? 'bg-red-600' :
                              profile.riskScore >= 60 ? 'bg-orange-600' : 'bg-yellow-600'
                            }`}
                            style={{ width: `${profile.riskScore}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${
                          profile.riskScore >= 80 ? 'text-red-600' :
                          profile.riskScore >= 60 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>{profile.riskScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {profile.mainRisks.map((risk, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            {risk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-xs text-gray-600 space-y-1">
                        {profile.recommendedActions.map((action, idx) => (
                          <li key={idx}>• {action}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 部門別リスク分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">部門別離職リスク分析</h2>
          <div className="space-y-3">
            {reportData.departmentRisk.map((dept, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{dept.name}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">離職率: {dept.turnoverRate}%</span>
                    <span className={`text-sm flex items-center ${
                      dept.trend === 'increasing' ? 'text-red-600' :
                      dept.trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {dept.trend === 'increasing' && '↑ 上昇傾向'}
                      {dept.trend === 'decreasing' && '↓ 低下傾向'}
                      {dept.trend === 'stable' && '→ 横ばい'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-600 mr-2">リスクスコア:</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          dept.avgRiskScore >= 70 ? 'bg-red-500' :
                          dept.avgRiskScore >= 50 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${dept.avgRiskScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{dept.avgRiskScore}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 生存分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">勤続年数別定着率分析</h2>
          <div className="bg-white border rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-4">
              クリティカル期間: <span className="font-medium text-orange-600">{reportData.survivalAnalysis.criticalPeriod}</span>
            </p>
            <div className="space-y-3">
              {reportData.survivalAnalysis.periods.map((period, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm text-gray-600 w-24">{period}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          reportData.survivalAnalysis.survivalRates[index] >= 85 ? 'bg-green-500' :
                          reportData.survivalAnalysis.survivalRates[index] >= 80 ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${reportData.survivalAnalysis.survivalRates[index]}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {reportData.survivalAnalysis.survivalRates[index]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 介入施策の提案 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">推奨介入施策</h2>
          <div className="space-y-4">
            {reportData.interventions.map((intervention, index) => (
              <div key={index} className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">{intervention.title}</h3>
                <p className="mt-2 text-gray-600">{intervention.description}</p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">対象グループ</p>
                    <p className="font-medium">{intervention.targetGroup}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">期待削減率</p>
                    <p className="font-medium text-green-600">{intervention.expectedReduction}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">必要投資</p>
                    <p className="font-medium">¥{intervention.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ROI</p>
                    <p className="font-medium text-blue-600">{intervention.roi}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* データ解釈コメント */}
        <section className="mt-8">
          <DataCommentList 
            comments={[
              reportData.overview.highRisk > reportData.overview.totalStaff * 0.15 ? {
                id: 'turnover-crisis',
                type: 'warning',
                title: '離職クライシスのリスク',
                message: `高リスク職員が${reportData.overview.highRisk}名に上っています。予測離職者数${reportData.overview.predictedTurnover}名を防ぐための緊急対策が必要です。`,
                priority: 'high'
              } : null,
              {
                id: 'critical-factors',
                type: 'interpretation',
                title: '主要離職要因の分析',
                message: '「過重労働」「低エンゲージメント」「高ストレス」が主要な離職リスク要因です。これらは相互に関連しており、総合的な対策が効果的です。',
                priority: 'high'
              },
              facilityId === 'tachigami-hospital' ? {
                id: 'dept-insight',
                type: 'insight',
                title: '介護医療院の離職リスク上昇',
                message: '介護医療院の離職率が9.8%と上昇傾向にあります。介護職員の負担軽減策が必要です。',
                priority: 'high'
              } : {
                id: 'dept-insight',
                type: 'insight',
                title: 'ICU・救急部門の深刻な状況',
                message: 'ICUの離職率が12.5%と突出して高く、且つ上昇傾向にあります。勤務体制の根本的な見直しが必要です。',
                priority: 'high'
              },
              {
                id: 'survival-trend',
                type: 'trend',
                title: '勤続1-3年目がクリティカル',
                message: '勤続1-3年目の定着率が低下しています。この時期のキャリア支援とメンタリング強化が重要です。',
                priority: 'medium'
              },
              {
                id: 'intervention-action',
                type: 'action',
                title: '推奨介入施策のROI',
                message: '「高リスク職員への早期介入プログラム」はROI 320%と最も費用対効果が高く、優先的に実施すべきです。',
                priority: 'high'
              },
              {
                id: 'benchmark-turnover',
                type: 'benchmark',
                title: '業界ベンチマーク',
                message: '現在の離職率8.5%は医療業界平均（10-12%）より良好ですが、高リスク職員の割合が懸念材料です。',
                priority: 'low'
              }
            ].filter(Boolean) as DataComment[]}
          />
        </section>
      </div>
            <ScrollToTopButton />
      <BackToReportsButton />
      <DashboardButton />
    </ReportLayout>
  );
}

export default function TurnoverRiskReport() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">読み込み中...</div>}>
      <TurnoverRiskReportContent />
    </Suspense>
  );
}