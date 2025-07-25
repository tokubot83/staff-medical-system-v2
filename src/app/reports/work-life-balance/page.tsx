'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportLayout from '@/components/reports/ReportLayout';
import { facilities } from '@/app/data/facilityData';
import { staffDatabase } from '@/app/data/staffData';
import { exportToPDF } from '@/utils/pdfExport';
import { DataCommentList, MetricWithComment } from '@/components/DataComment';
import { generateComments } from '@/types/commentTypes';
import { organizationData, getDepartmentsByType } from '@/app/data/organizationData';
import { tachigamiOrganizationData } from '@/app/data/tachigamiOrganizationData';
import { BackToReportsButton } from '@/components/BackToReportsButton';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

function WorkLifeBalanceReportContent() {
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
    const staff = Object.values(staffDatabase);
    const targetStaff = facilityId ? staff.slice(0, Math.floor(staff.length * 0.3)) : staff;
    
    // 施設に応じて組織データを選択
    const currentOrgData = facilityId === 'tachigami-hospital' ? tachigamiOrganizationData : organizationData;
    const isRehabilitation = facilityId === 'tachigami-hospital';
    
    // 平均値の計算
    const avgOvertime = targetStaff.reduce((sum, s) => sum + s.overtime, 0) / targetStaff.length;
    const avgPaidLeaveRate = targetStaff.reduce((sum, s) => sum + s.paidLeaveRate, 0) / targetStaff.length;
    const avgStressIndex = targetStaff.reduce((sum, s) => sum + s.stressIndex, 0) / targetStaff.length;
    
    return {
      overview: {
        avgOvertime: Math.round(avgOvertime),
        avgPaidLeaveRate: Math.round(avgPaidLeaveRate),
        avgStressIndex: Math.round(avgStressIndex),
        workFromHomeRate: 15,
        flexTimeUsage: 32,
        childcareLeaveRate: 95
      },
      departmentData: isRehabilitation ? [
        { name: 'リハビリテーション部門', overtime: 8, paidLeave: 88, stress: 32, satisfaction: 90 },
        { name: '第１病棟', overtime: 12, paidLeave: 75, stress: 45, satisfaction: 82 },
        { name: '介護医療院', overtime: 18, paidLeave: 65, stress: 58, satisfaction: 75 },
        { name: '外来', overtime: 6, paidLeave: 92, stress: 28, satisfaction: 94 },
        { name: '薬剤部門', overtime: 5, paidLeave: 95, stress: 25, satisfaction: 92 }
      ] : [
        { name: 'ICU', overtime: 22, paidLeave: 45, stress: 68, satisfaction: 72 },
        { name: '内科病棟', overtime: 15, paidLeave: 72, stress: 48, satisfaction: 85 },
        { name: '外来', overtime: 8, paidLeave: 85, stress: 35, satisfaction: 90 },
        { name: 'リハビリテーション科', overtime: 5, paidLeave: 90, stress: 30, satisfaction: 92 },
        { name: '薬剤部', overtime: 10, paidLeave: 88, stress: 38, satisfaction: 88 }
      ],
      stressFactors: [
        { factor: '業務量過多', percentage: 45, trend: 'up' },
        { factor: '人間関係', percentage: 25, trend: 'stable' },
        { factor: 'シフト勤務', percentage: 35, trend: 'up' },
        { factor: 'スキル不足の不安', percentage: 20, trend: 'down' },
        { factor: '将来のキャリア不安', percentage: 30, trend: 'stable' }
      ],
      initiatives: [
        {
          name: 'フレックスタイム制度',
          status: '運用中',
          usage: 32,
          satisfaction: 88,
          impact: '残業時間15%削減'
        },
        {
          name: '在宅勤務制度',
          status: '試験導入中',
          usage: 15,
          satisfaction: 92,
          impact: 'ストレス指標10ポイント改善'
        },
        {
          name: 'メンタルヘルスサポート',
          status: '運用中',
          usage: 28,
          satisfaction: 85,
          impact: '休職率30%減少'
        }
      ],
      recommendations: [
        isRehabilitation ? {
          title: '介護医療院の負担軽減',
          description: '介護職員の配置最適化とシフト改善により、平均残業時間を15時間以下に',
          priority: 'urgent',
          expectedImpact: '離職率4%改善、ストレス指戵12ポイント改善'
        } : {
          title: 'ICU・救急部門の負担軽減',
          description: '交代制勤務の見直しと増員により、平均残業時間を20時間以下に',
          priority: 'urgent',
          expectedImpact: '離職率5%改善、ストレス指標15ポイント改善'
        },
        {
          title: '有給休暇取得促進キャンペーン',
          description: '計画的な有給取得を推進し、全部門で取得率80%以上を目指す',
          priority: 'high',
          expectedImpact: '職員満足度10%向上、生産性5%向上'
        },
        {
          title: 'リモートワーク対象職種の拡大',
          description: '事務部門・管理部門を中心に在宅勤務制度を本格導入',
          priority: 'medium',
          expectedImpact: 'ワークライフバランス満足度20%向上'
        }
      ]
    };
  };

  const reportData = generateReportData();

  return (
    <ReportLayout
      title="ワークライフバランス分析"
      description="職員の労働時間、休暇取得状況、ストレス指標を分析します"
      icon="⚖️"
      color="bg-green-500"
      facility={facility}
      onExportPDF={() => exportToPDF({
        title: 'ワークライフバランス分析レポート',
        facility: facility?.name,
        reportType: 'work-life-balance',
        elementId: 'report-content',
        dateRange: new Date().toLocaleDateString('ja-JP')
      })}
    >
      <div id="report-content" className="p-8">
        {/* 概要指標 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">主要指標</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <MetricWithComment
                label="平均残業時間"
                value={reportData.overview.avgOvertime}
                unit="時間/月"
                comment={reportData.overview.avgOvertime > 20 ? {
                  id: 'overtime-warning',
                  type: 'warning',
                  title: '過重労働のリスク',
                  message: `月平均${reportData.overview.avgOvertime}時間の残業は健康リスクが高い状態です。早急な対策が必要です。`,
                  priority: 'high'
                } : undefined}
              />
              <p className="text-xs text-red-600 mt-1">業界平均: 15時間</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MetricWithComment
                label="有給休暇取得率"
                value={reportData.overview.avgPaidLeaveRate}
                unit="%"
                comment={reportData.overview.avgPaidLeaveRate < 70 ? {
                  id: 'leave-action',
                  type: 'action',
                  title: '取得促進が必要',
                  message: '有給休暇取得率が低い状態です。計画的な取得を推進し、ワークライフバランスの改善を図りましょう。',
                  priority: 'high'
                } : undefined}
              />
              <p className="text-xs text-green-600 mt-1">目標: 80%以上</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MetricWithComment
                label="ストレス指標"
                value={reportData.overview.avgStressIndex}
                unit=""
                comment={reportData.overview.avgStressIndex > 60 ? {
                  id: 'stress-warning',
                  type: 'warning',
                  title: '高ストレス状態',
                  message: 'ストレス指標が60を超えており、メンタルヘルス対策が急務です。',
                  priority: 'high'
                } : undefined}
              />
              <p className="text-xs text-orange-600 mt-1">注意: 60以上</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">在宅勤務利用率</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.workFromHomeRate}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">フレックス利用率</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.flexTimeUsage}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">育休取得率</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.childcareLeaveRate}%</p>
            </div>
          </div>
        </section>

        {/* 部門別分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">部門別ワークライフバランス指標</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部門</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均残業時間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">有給取得率</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ストレス指標</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">満足度</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.departmentData.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${dept.overtime > 20 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                        {dept.overtime}時間
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${dept.paidLeave < 70 ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                        {dept.paidLeave}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${dept.stress > 60 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                        {dept.stress}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${dept.satisfaction}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-500">{dept.satisfaction}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ストレス要因分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">主要ストレス要因</h2>
          <div className="space-y-3">
            {reportData.stressFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center flex-1">
                  <span className="text-sm font-medium text-gray-900 w-40">{factor.factor}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          factor.percentage > 40 ? 'bg-red-500' : 
                          factor.percentage > 30 ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${factor.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{factor.percentage}%</span>
                </div>
                <div className="ml-4">
                  {factor.trend === 'up' && (
                    <span className="text-red-600 text-sm flex items-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      上昇
                    </span>
                  )}
                  {factor.trend === 'down' && (
                    <span className="text-green-600 text-sm flex items-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      低下
                    </span>
                  )}
                  {factor.trend === 'stable' && (
                    <span className="text-gray-600 text-sm">横ばい</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 実施中の施策 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">実施中の施策と効果</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.initiatives.map((initiative, index) => (
              <div key={index} className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{initiative.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">ステータス:</span>
                    <span className={`font-medium ${
                      initiative.status === '運用中' ? 'text-green-600' : 'text-blue-600'
                    }`}>{initiative.status}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">利用率:</span>
                    <span className="font-medium">{initiative.usage}%</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">満足度:</span>
                    <span className="font-medium">{initiative.satisfaction}%</span>
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-600">効果:</p>
                  <p className="text-sm font-medium text-blue-600">{initiative.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 改善提案 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">改善提案</h2>
          <div className="space-y-4">
            {reportData.recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                    <p className="mt-2 text-gray-600">{rec.description}</p>
                    <p className="mt-2 text-sm text-blue-600">
                      期待効果: {rec.expectedImpact}
                    </p>
                  </div>
                  <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                    rec.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rec.priority === 'urgent' ? '緊急' :
                     rec.priority === 'high' ? '優先度高' : '優先度中'}
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
              ...generateComments(reportData.overview.avgOvertime, 'overtimeHours'),
              ...generateComments(reportData.overview.avgStressIndex, 'stressIndex'),
              facilityId === 'tachigami-hospital' ? {
                id: 'balance-insight',
                type: 'insight',
                title: 'ワークライフバランス改善のポイント',
                message: '介護医療院の介護職員の負担軽減が最優先課題です。温泉利用やリフレッシュ休暇制度の導入が効果的です。',
                priority: 'medium'
              } : {
                id: 'balance-insight',
                type: 'insight',
                title: 'ワークライフバランス改善のポイント',
                message: 'ICUや救急部門の負担軽減が最優先課題です。フレックスタイム制度の活用とメンタルヘルスサポートの強化が効果的です。',
                priority: 'medium'
              },
              reportData.overview.workFromHomeRate < 20 ? {
                id: 'remote-trend',
                type: 'trend',
                title: 'リモートワークの拡大可能性',
                message: '在宅勤務利用率が低い状態です。事務部門を中心に制度拡充の余地があります。',
                priority: 'low'
              } : null,
              {
                id: 'benchmark-info',
                type: 'benchmark',
                title: '業界ベンチマーク',
                message: '医療業界の平均残業時間は15時間/月、有給取得率80%が目安です。',
                priority: 'low'
              }
            ].filter(Boolean) as any[]}
          />
        </section>
      </div>
      <BackToReportsButton />
      <ScrollToTopButton />
    </ReportLayout>
  );
}

export default function WorkLifeBalanceReport() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">読み込み中...</div>}>
      <WorkLifeBalanceReportContent />
    </Suspense>
  );
}