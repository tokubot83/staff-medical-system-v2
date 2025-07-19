'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportLayout from '@/components/reports/ReportLayout';
import { facilities } from '@/app/data/facilityData';
import { staffDatabase } from '@/app/data/staffData';
import { exportToPDF } from '@/utils/pdfExport';
import { DataCommentList, MetricWithComment } from '@/components/DataComment';
import { generateHRStrategyComments } from '@/utils/reportComments';
import { organizationData, getDepartmentsByType } from '@/app/data/organizationData';
import { tachigamiOrganizationData } from '@/app/data/tachigamiOrganizationData';

function HRStrategyReportContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get('facility');
  const [facility, setFacility] = useState<any>(null);
  
  useEffect(() => {
    if (facilityId) {
      const selected = facilities.find(f => f.id === facilityId);
      setFacility(selected);
    }
  }, [facilityId]);

  // ダミーデータの生成（実際の実装では施設ごとのデータを取得）
  const generateReportData = () => {
    const staff = Object.values(staffDatabase);
    const totalStaff = facilityId ? Math.floor(staff.length * 0.3) : staff.length;
    const isRehabilitation = facilityId === 'tachigami-hospital';
    
    return {
      overview: {
        totalStaff,
        departments: facilityId ? 6 : 15,
        averageAge: 38.5,
        averageTenure: 8.2,
        turnoverRate: 8.5,
        recruitmentRate: 10.2
      },
      departmentAnalysis: isRehabilitation ? [
        { name: 'リハビリテーション部門', staff: 35, efficiency: 92, satisfaction: 90 },
        { name: '看護部門', staff: 65, efficiency: 88, satisfaction: 85 },
        { name: '介護医療院', staff: 35, efficiency: 82, satisfaction: 78 },
        { name: '医局', staff: 8, efficiency: 90, satisfaction: 88 },
        { name: '事務部門', staff: 20, efficiency: 85, satisfaction: 82 }
      ] : [
        { name: '内科', staff: 85, efficiency: 92, satisfaction: 88 },
        { name: '外科', staff: 72, efficiency: 88, satisfaction: 85 },
        { name: 'ICU', staff: 45, efficiency: 95, satisfaction: 82 },
        { name: '小児科', staff: 38, efficiency: 90, satisfaction: 90 },
        { name: 'リハビリテーション科', staff: 42, efficiency: 87, satisfaction: 91 }
      ],
      strengthsWeaknesses: {
        strengths: [
          '高い定着率（離職率8.5%は業界平均以下）',
          '部門間連携の効率性が高い',
          '継続的な人材育成プログラムの実施'
        ],
        weaknesses: isRehabilitation ? [
          '介護医療院での人員不足と高い離職率',
          'セラピストの採用競争が激化',
          '夜勤スタッフの確保が困難'
        ] : [
          '特定部門での人員不足（ICU、小児科）',
          '管理職候補の不足',
          '非正規職員の比率が高い部門の存在'
        ]
      },
      recommendations: isRehabilitation ? [
        {
          title: '介護職員の採用強化',
          description: '介護医療院への人員配置を優先し、福利厚生の充実で定着率向上',
          priority: 'high',
          timeline: '3ヶ月以内'
        },
      ] : [
        {
          title: '戦略的採用計画の策定',
          description: 'ICUと小児科を重点部門として、専門性の高い人材の採用を強化',
          priority: 'high',
          timeline: '3ヶ月以内'
        },
        {
          title: '管理職育成プログラムの導入',
          description: '次世代リーダー育成のための体系的な教育プログラムを開始',
          priority: 'high',
          timeline: '6ヶ月以内'
        },
        {
          title: '非正規職員の正規化推進',
          description: '優秀な非正規職員の正規雇用転換により組織の安定性を向上',
          priority: 'medium',
          timeline: '1年以内'
        }
      ]
    };
  };

  const reportData = generateReportData();

  return (
    <ReportLayout
      title="人事管理戦略分析"
      description="組織の人事管理戦略を総合的に分析し、改善提案を提供します"
      icon="📊"
      color="bg-blue-500"
      facility={facility}
      onExportPDF={() => exportToPDF({
        title: '人事管理戦略分析レポート',
        facility: facility?.name,
        reportType: 'hr-strategy',
        elementId: 'report-content',
        dateRange: new Date().toLocaleDateString('ja-JP')
      })}
    >
      <div id="report-content" className="p-8">
        {/* 概要セクション */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">組織概要</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">総職員数</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalStaff}名</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">部門数</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.departments}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">平均年齢</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.averageAge}歳</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">平均勤続年数</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.averageTenure}年</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MetricWithComment
                label="離職率"
                value={reportData.overview.turnoverRate}
                unit="%"
                comment={{
                  id: 'turnover-benchmark',
                  type: 'benchmark',
                  title: '業界平均以下',
                  message: '離職率8.5%は医療業界平均（10-12%）を下回っており、良好な状態です。',
                  priority: 'low'
                }}
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">採用率</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.recruitmentRate}%</p>
            </div>
          </div>
        </section>

        {/* 部門別分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">部門別分析</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部門</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">職員数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">効率性</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">満足度</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.departmentAnalysis.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.staff}名</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${dept.efficiency}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-500">{dept.efficiency}%</span>
                      </div>
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

        {/* 強み・弱み分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">SWOT分析</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3">強み</h3>
              <ul className="space-y-2">
                {reportData.strengthsWeaknesses.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-3">改善点</h3>
              <ul className="space-y-2">
                {reportData.strengthsWeaknesses.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 改善提案 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">戦略的改善提案</h2>
          <div className="space-y-4">
            {reportData.recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                    <p className="mt-2 text-gray-600">{rec.description}</p>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority === 'high' ? '優先度：高' :
                       rec.priority === 'medium' ? '優先度：中' : '優先度：低'}
                    </span>
                    <span className="mt-2 text-sm text-gray-500">実施期限: {rec.timeline}</span>
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
              ...generateHRStrategyComments({
                recruitmentEfficiency: 85,
                costPerHire: 450000,
                retentionRate: 91.5
              }),
              isRehabilitation ? {
                id: 'dept-shortage',
                type: 'warning',
                title: '介護医療院の人員不足',
                message: '介護医療院で深刻な人員不足が発生し、離職率も高い状態です。早急な対策が必要です。',
                priority: 'high'
              } : {
                id: 'dept-shortage',
                type: 'warning',
                title: '特定部門の人員不足',
                message: 'ICUと小児科で深刻な人員不足が発生しています。戦略的採用計画の早期実施が必要です。',
                priority: 'high'
              },
              {
                id: 'management-gap',
                type: 'interpretation',
                title: '管理職候補の不足',
                message: '次世代リーダーの育成が遅れています。管理職育成プログラムの導入により、組織の持続的成長を支える基盤を構築しましょう。',
                priority: 'high'
              },
              {
                id: 'efficiency-insight',
                type: 'insight',
                title: '部門間連携の高い効率性',
                message: '部門間の連携効率が高く、組織全体のパフォーマンスに貢献しています。この強みを活かした更なる最適化が可能です。',
                priority: 'medium'
              }
            ]}
          />
        </section>
      </div>
    </ReportLayout>
  );
}

export default function HRStrategyReport() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">読み込み中...</div>}>
      <HRStrategyReportContent />
    </Suspense>
  );
}