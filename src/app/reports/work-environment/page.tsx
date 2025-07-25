'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportLayout from '@/components/reports/ReportLayout';
import { facilities } from '@/app/data/facilityData';
import { exportToPDF } from '@/utils/pdfExport';
import { DataCommentList, MetricWithComment } from '@/components/DataComment';
import { generateWorkEnvironmentComments } from '@/utils/reportComments';
import { BackToReportsButton } from '@/components/BackToReportsButton';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

function WorkEnvironmentReportContent() {
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
    return {
      environmentScores: {
        physical: 72,
        psychological: 68,
        social: 75,
        organizational: 70,
        overall: 71
      },
      issueCategories: [
        {
          category: '物理的環境',
          score: 72,
          issues: [
            { issue: '休憩スペース不足', severity: 'high', affectedStaff: 65 },
            { issue: '更衣室の狭さ', severity: 'medium', affectedStaff: 45 },
            { issue: '駐車場不足', severity: 'medium', affectedStaff: 38 },
            { issue: '食堂の混雑', severity: 'low', affectedStaff: 52 }
          ]
        },
        {
          category: '心理的安全性',
          score: 68,
          issues: [
            { issue: 'ハラスメント懸念', severity: 'high', affectedStaff: 15 },
            { issue: '失敗への不安', severity: 'medium', affectedStaff: 42 },
            { issue: '意見の言いにくさ', severity: 'medium', affectedStaff: 35 },
            { issue: '評価の不透明性', severity: 'low', affectedStaff: 28 }
          ]
        },
        {
          category: '社会的環境',
          score: 75,
          issues: [
            { issue: '部門間の壁', severity: 'medium', affectedStaff: 48 },
            { issue: 'チーム内対立', severity: 'low', affectedStaff: 12 },
            { issue: '世代間ギャップ', severity: 'low', affectedStaff: 32 }
          ]
        },
        {
          category: '組織文化',
          score: 70,
          issues: [
            { issue: '長時間労働の常態化', severity: 'high', affectedStaff: 58 },
            { issue: '年功序列の弊害', severity: 'medium', affectedStaff: 35 },
            { issue: '変化への抵抗', severity: 'low', affectedStaff: 42 }
          ]
        }
      ],
      employeeSatisfaction: {
        facilities: 65,
        workTools: 78,
        itSystems: 58,
        training: 72,
        communication: 68,
        recognition: 62
      },
      benchmarkComparison: [
        { metric: '総合満足度', internal: 71, industry: 75, best: 85 },
        { metric: '職場の快適性', internal: 72, industry: 78, best: 88 },
        { metric: '人間関係', internal: 75, industry: 72, best: 82 },
        { metric: 'キャリア支援', internal: 68, industry: 70, best: 85 },
        { metric: '報酬・福利厚生', internal: 70, industry: 73, best: 80 }
      ],
      improvements: [
        {
          title: '職員休憩室の拡充・リニューアル',
          category: '物理的環境',
          description: '各フロアに快適な休憩スペースを設置し、リフレッシュ環境を整備',
          cost: 15000000,
          timeline: '6ヶ月',
          expectedImpact: '職員満足度15%向上、ストレス指標10ポイント改善'
        },
        {
          title: '心理的安全性向上プログラム',
          category: '心理的安全性',
          description: '管理職向け研修と職場環境改善ワークショップの実施',
          cost: 3000000,
          timeline: '3ヶ月',
          expectedImpact: '離職率5%減少、生産性8%向上'
        },
        {
          title: 'ITシステムの全面刷新',
          category: '業務環境',
          description: '電子カルテシステムの更新と業務効率化ツールの導入',
          cost: 50000000,
          timeline: '1年',
          expectedImpact: '業務効率30%向上、残業時間20%削減'
        },
        {
          title: '表彰・評価制度の見直し',
          category: '組織文化',
          description: '透明性の高い評価基準と多様な表彰制度の導入',
          cost: 2000000,
          timeline: '3ヶ月',
          expectedImpact: 'モチベーション20%向上、定着率改善'
        }
      ]
    };
  };

  const reportData = generateReportData();

  return (
    <ReportLayout
      title="労働環境改善戦略"
      description="職場環境の課題を特定し、改善策を提案します"
      icon="🌟"
      color="bg-yellow-500"
      facility={facility}
      onExportPDF={() => exportToPDF({
        title: '労働環境改善戦略レポート',
        facility: facility?.name,
        reportType: 'work-environment',
        elementId: 'report-content',
        dateRange: new Date().toLocaleDateString('ja-JP')
      })}
    >
      <div id="report-content" className="p-8">
        {/* 環境スコア概要 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">労働環境総合評価</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">総合スコア</h3>
              <MetricWithComment
                label=""
                value={`${reportData.environmentScores.overall}/100`}
                className="text-3xl font-bold text-yellow-600"
                comment={reportData.environmentScores.overall < 75 ? {
                  id: 'environment-score-low',
                  type: 'warning',
                  title: '労働環境の改善が必要',
                  message: '総合スコア71点は業界平均を下回っています。早急な改善施策が必要です。',
                  priority: 'high'
                } : undefined}
              />
            </div>
            <div className="space-y-3">
              {Object.entries(reportData.environmentScores).filter(([key]) => key !== 'overall').map(([category, score]) => (
                <div key={category} className="flex items-center">
                  <span className="text-sm text-gray-600 w-32 capitalize">
                    {category === 'physical' ? '物理的環境' :
                     category === 'psychological' ? '心理的安全性' :
                     category === 'social' ? '社会的環境' : '組織文化'}
                  </span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          score >= 75 ? 'bg-green-500' :
                          score >= 65 ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">{score}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 課題カテゴリー別分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">カテゴリー別課題分析</h2>
          <div className="space-y-6">
            {reportData.issueCategories.map((category, index) => (
              <div key={index} className="bg-white border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                  <span className="text-2xl font-bold text-gray-700">{category.score}/100</span>
                </div>
                <div className="space-y-2">
                  {category.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-3 ${
                          issue.severity === 'high' ? 'bg-red-500' :
                          issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></span>
                        <span className="text-sm text-gray-700">{issue.issue}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">影響: {issue.affectedStaff}%の職員</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {issue.severity === 'high' ? '重要' :
                           issue.severity === 'medium' ? '中程度' : '軽微'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 職員満足度分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">職員満足度詳細</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(reportData.employeeSatisfaction).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 capitalize">
                  {key === 'facilities' ? '施設・設備' :
                   key === 'workTools' ? '業務ツール' :
                   key === 'itSystems' ? 'ITシステム' :
                   key === 'training' ? '研修・教育' :
                   key === 'communication' ? 'コミュニケーション' : '評価・承認'}
                </p>
                <div className="mt-2 flex items-end">
                  <span className="text-2xl font-bold text-gray-900">{value}%</span>
                  <span className={`ml-2 text-sm ${
                    value >= 70 ? 'text-green-600' :
                    value >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {value >= 70 ? '良好' :
                     value >= 60 ? '改善余地あり' : '要改善'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ベンチマーク比較 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">業界ベンチマーク比較</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">指標</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">当院</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">業界平均</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ベストプラクティス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ギャップ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.benchmarkComparison.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.metric}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        item.internal >= item.industry ? 'text-green-600' : 'text-red-600'
                      }`}>{item.internal}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.industry}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.best}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        item.internal >= item.industry ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.internal >= item.industry ? '+' : ''}{item.internal - item.industry}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 改善提案 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">環境改善施策</h2>
          <div className="space-y-4">
            {reportData.improvements.map((improvement, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded mr-3">
                    {improvement.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{improvement.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{improvement.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">必要投資</p>
                    <p className="font-medium">¥{improvement.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">実施期間</p>
                    <p className="font-medium">{improvement.timeline}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">期待効果</p>
                    <p className="font-medium text-green-600">{improvement.expectedImpact}</p>
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
              ...generateWorkEnvironmentComments({
                environmentScore: reportData.environmentScores.overall,
                safetyIncidents: 0
              }),
              {
                id: 'rest-space-crisis',
                type: 'warning',
                title: '休憩スペース不足の深刻化',
                message: '職員の65%が休憩スペース不足を訴えています。疲労蓄積とストレス増加の主要因となっています。',
                priority: 'high'
              },
              {
                id: 'psychological-safety',
                type: 'interpretation',
                title: '心理的安全性の課題',
                message: '心理的安全性スコア68点と低く、ハラスメント懸念や意見の言いにくさが問題となっています。',
                priority: 'high'
              },
              {
                id: 'it-system-action',
                type: 'action',
                title: 'ITシステムの早急な改善',
                message: 'ITシステム満足度58%と低く、業務効率を大きく阻害しています。システム刷新により30%の効率化が期待できます。',
                priority: 'high'
              },
              {
                id: 'culture-insight',
                type: 'insight',
                title: '組織文化の改革ポイント',
                message: '長時間労働の常態化（58%の職員が影響）が最大の課題です。働き方改革が急務です。',
                priority: 'high'
              },
              {
                id: 'investment-trend',
                type: 'trend',
                title: '環境投資のROI',
                message: '職場環境への投資は、職員満足度向上、離職率低下、生産性向上として高いROIを示します。',
                priority: 'medium'
              }
            ]}
          />
        </section>
      </div>
      <BackToReportsButton />
      <ScrollToTopButton />
    </ReportLayout>
  );
}

export default function WorkEnvironmentReport() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">読み込み中...</div>}>
      <WorkEnvironmentReportContent />
    </Suspense>
  );
}