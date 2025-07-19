'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportLayout from '@/components/reports/ReportLayout';
import { facilities } from '@/app/data/facilityData';
import { staffDatabase } from '@/app/data/staffData';
import { exportToPDF } from '@/utils/pdfExport';
import { DataCommentList, MetricWithComment } from '@/components/DataComment';
import { generateSkillComments } from '@/utils/reportComments';

function SkillQualificationReportContent() {
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
    const staff = Object.values(staffDatabase);
    
    return {
      overview: {
        totalStaff: staff.length,
        certifiedStaff: Math.floor(staff.length * 0.42),
        avgSkillLevel: 3.2,
        trainingCompletion: 78,
        skillGapIndex: 28,
        upcomingRenewals: 23
      },
      qualificationStatus: [
        {
          category: '看護師資格',
          qualifications: [
            { name: '認定看護師', holders: 12, required: 20, renewalDue: 3 },
            { name: '専門看護師', holders: 5, required: 10, renewalDue: 1 },
            { name: 'BLS資格', holders: 180, required: 220, renewalDue: 45 },
            { name: '感染管理認定', holders: 8, required: 15, renewalDue: 2 }
          ]
        },
        {
          category: '医師資格',
          qualifications: [
            { name: '専門医', holders: 25, required: 30, renewalDue: 5 },
            { name: '指導医', holders: 10, required: 15, renewalDue: 2 },
            { name: '産業医', holders: 3, required: 5, renewalDue: 1 }
          ]
        },
        {
          category: '共通資格',
          qualifications: [
            { name: '医療安全管理者', holders: 15, required: 25, renewalDue: 4 },
            { name: '感染対策実践者', holders: 35, required: 50, renewalDue: 8 },
            { name: 'メンタルヘルス・マネジメント', holders: 20, required: 40, renewalDue: 5 }
          ]
        }
      ],
      skillMatrix: [
        {
          department: '看護部',
          skills: [
            { name: '基礎看護技術', current: 4.2, required: 4.0, gap: 0 },
            { name: '専門看護技術', current: 3.5, required: 4.0, gap: -0.5 },
            { name: 'リーダーシップ', current: 3.0, required: 3.5, gap: -0.5 },
            { name: 'IT活用', current: 2.8, required: 3.5, gap: -0.7 }
          ]
        },
        {
          department: '医局',
          skills: [
            { name: '診療技術', current: 4.5, required: 4.5, gap: 0 },
            { name: '最新医療知識', current: 4.0, required: 4.5, gap: -0.5 },
            { name: 'チーム医療', current: 3.8, required: 4.0, gap: -0.2 },
            { name: '経営知識', current: 2.5, required: 3.0, gap: -0.5 }
          ]
        }
      ],
      trainingStatus: {
        mandatory: [
          { name: '医療安全研修', completion: 92, deadline: '2025年3月' },
          { name: '感染対策研修', completion: 88, deadline: '2025年3月' },
          { name: '個人情報保護研修', completion: 95, deadline: '2025年2月' },
          { name: 'ハラスメント防止研修', completion: 78, deadline: '2025年4月' }
        ],
        skillBased: [
          { name: 'リーダーシップ研修', enrolled: 45, completed: 32, satisfaction: 88 },
          { name: '専門技術研修', enrolled: 68, completed: 52, satisfaction: 92 },
          { name: 'コミュニケーション研修', enrolled: 38, completed: 35, satisfaction: 85 }
        ]
      },
      skillGaps: [
        {
          area: 'デジタルスキル',
          severity: 'high',
          affectedStaff: 65,
          impact: '業務効率低下、システム活用不足'
        },
        {
          area: 'マネジメントスキル',
          severity: 'medium',
          affectedStaff: 35,
          impact: '次世代リーダー不足'
        },
        {
          area: '専門技術（最新）',
          severity: 'medium',
          affectedStaff: 42,
          impact: '医療の質への影響懸念'
        },
        {
          area: '語学（英語）',
          severity: 'low',
          affectedStaff: 80,
          impact: '国際化対応の遅れ'
        }
      ],
      developmentPlan: [
        {
          initiative: 'デジタルスキル向上プログラム',
          target: '全職員',
          timeline: '6ヶ月',
          budget: 5000000,
          expectedOutcome: 'IT活用率30%向上、業務効率15%改善'
        },
        {
          initiative: '次世代リーダー育成塾',
          target: '中堅職員50名',
          timeline: '1年',
          budget: 8000000,
          expectedOutcome: '管理職候補20名育成'
        },
        {
          initiative: '資格取得支援制度拡充',
          target: '全職員',
          timeline: '継続',
          budget: 10000000,
          expectedOutcome: '専門資格保有者30%増加'
        },
        {
          initiative: 'メンター制度導入',
          target: '新人・若手職員',
          timeline: '3ヶ月',
          budget: 2000000,
          expectedOutcome: '定着率15%向上、スキル習得速度20%向上'
        }
      ]
    };
  };

  const reportData = generateReportData();

  return (
    <ReportLayout
      title="スキル・資格管理分析"
      description="職員のスキルと資格の現状分析と育成計画を策定します"
      icon="📜"
      color="bg-pink-500"
      facility={facility}
      onExportPDF={() => exportToPDF({
        title: 'スキル・資格管理分析レポート',
        facility: facility?.name,
        reportType: 'skill-qualification',
        elementId: 'report-content',
        dateRange: new Date().toLocaleDateString('ja-JP')
      })}
    >
      <div id="report-content" className="p-8">
        {/* 概要 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">スキル・資格管理概要</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">総職員数</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalStaff}名</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">資格保有者</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.certifiedStaff}名</p>
              <p className="text-xs text-gray-500 mt-1">全体の{Math.round(reportData.overview.certifiedStaff / reportData.overview.totalStaff * 100)}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">平均スキルレベル</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.avgSkillLevel}/5.0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">研修修了率</p>
              <p className="text-2xl font-bold text-green-600">{reportData.overview.trainingCompletion}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MetricWithComment
                label="スキルギャップ指数"
                value={reportData.overview.skillGapIndex}
                unit="%"
                comment={reportData.overview.skillGapIndex > 25 ? {
                  id: 'skill-gap-warning',
                  type: 'warning',
                  title: 'スキルギャップが大きい',
                  message: '重要スキルの不足が見られます。計画的な研修プログラムの実施が必要です。',
                  priority: 'high'
                } : undefined}
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <MetricWithComment
                label="更新期限迫る資格"
                value={reportData.overview.upcomingRenewals}
                unit="件"
                comment={{
                  id: 'renewal-alert',
                  type: 'action',
                  title: '早急な更新手続きが必要',
                  message: '23件の資格が更新期限を迎えます。リマインダー送付と更新支援を行ってください。',
                  priority: 'high'
                }}
              />
            </div>
          </div>
        </section>

        {/* 資格保有状況 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">資格保有状況</h2>
          <div className="space-y-6">
            {reportData.qualificationStatus.map((category, index) => (
              <div key={index} className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">資格名</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">保有者</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">必要数</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">充足率</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">更新期限</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {category.qualifications.map((qual, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{qual.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{qual.holders}名</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{qual.required}名</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    (qual.holders / qual.required * 100) >= 80 ? 'bg-green-600' :
                                    (qual.holders / qual.required * 100) >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                                  }`}
                                  style={{ width: `${Math.min(100, qual.holders / qual.required * 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {Math.round(qual.holders / qual.required * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {qual.renewalDue > 0 && (
                              <span className={`text-sm ${
                                qual.renewalDue > 5 ? 'text-gray-600' :
                                qual.renewalDue > 2 ? 'text-yellow-600' : 'text-red-600 font-medium'
                              }`}>
                                {qual.renewalDue}名が更新必要
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* スキルマトリックス */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">部門別スキル評価</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportData.skillMatrix.map((dept, index) => (
              <div key={index} className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{dept.department}</h3>
                <div className="space-y-3">
                  {dept.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{skill.name}</span>
                        <span className={`font-medium ${
                          skill.gap < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {skill.gap < 0 ? skill.gap : `+${skill.gap}`}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <div className="flex items-center text-xs text-gray-600 mb-1">
                            <span>現状: {skill.current}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.current * 20}%` }}></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center text-xs text-gray-600 mb-1">
                            <span>必要: {skill.required}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-400 h-2 rounded-full" style={{ width: `${skill.required * 20}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 研修実施状況 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">研修実施状況</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">必須研修</h3>
              <div className="space-y-3">
                {reportData.trainingStatus.mandatory.map((training, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{training.name}</span>
                      <span className="text-xs text-gray-500">期限: {training.deadline}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            training.completion >= 90 ? 'bg-green-600' :
                            training.completion >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${training.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{training.completion}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">スキルアップ研修</h3>
              <div className="space-y-3">
                {reportData.trainingStatus.skillBased.map((training, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <p className="text-sm font-medium text-gray-900 mb-2">{training.name}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">受講者</p>
                        <p className="font-medium">{training.enrolled}名</p>
                      </div>
                      <div>
                        <p className="text-gray-600">修了者</p>
                        <p className="font-medium">{training.completed}名</p>
                      </div>
                      <div>
                        <p className="text-gray-600">満足度</p>
                        <p className="font-medium text-green-600">{training.satisfaction}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* スキルギャップ分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">重点スキルギャップ</h2>
          <div className="space-y-3">
            {reportData.skillGaps.map((gap, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{gap.area}</h3>
                      <span className={`ml-3 px-2 py-1 text-xs rounded ${
                        gap.severity === 'high' ? 'bg-red-100 text-red-800' :
                        gap.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {gap.severity === 'high' ? '重要' :
                         gap.severity === 'medium' ? '中程度' : '軽微'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">影響範囲: {gap.affectedStaff}%の職員</p>
                    <p className="text-sm text-gray-600 mt-1">影響: {gap.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 能力開発計画 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">能力開発計画</h2>
          <div className="space-y-4">
            {reportData.developmentPlan.map((plan, index) => (
              <div key={index} className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">{plan.initiative}</h3>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">対象</p>
                    <p className="font-medium">{plan.target}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">期間</p>
                    <p className="font-medium">{plan.timeline}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">予算</p>
                    <p className="font-medium">¥{plan.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">期待成果</p>
                    <p className="font-medium text-green-600">{plan.expectedOutcome}</p>
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
              ...generateSkillComments({
                skillGap: reportData.overview.skillGapIndex
              }),
              {
                id: 'digital-skill-crisis',
                type: 'warning',
                title: 'デジタルスキルの深刻な不足',
                message: '職員の65%がデジタルスキル不足を抱えており、業務効率低下の主要因となっています。早急なスキルアッププログラムが必要です。',
                priority: 'high'
              },
              isRehabilitation ? {
                id: 'qualification-shortage',
                type: 'interpretation',
                title: '専門資格保有者の不足',
                message: '認定理学療法士が8名（目標12名）、認知症ケア専門士が6名（目標10名）と不足しています。資格取得支援の強化が必要です。',
                priority: 'high'
              } : {
                id: 'qualification-shortage',
                type: 'interpretation',
                title: '専門資格保有者の不足',
                message: '認定看護師が12名（目標20名）、専門看護師が5名（目標10名）と不足しています。資格取得支援制度の拡充が効果的です。',
                priority: 'high'
              },
              {
                id: 'training-effectiveness',
                type: 'benchmark',
                title: '研修効果の高さ',
                message: 'スキルアップ研修の満足度が85-92%と高く、研修プログラムの質の高さを示しています。',
                priority: 'low'
              },
              {
                id: 'mentor-action',
                type: 'action',
                title: 'メンター制度の効果',
                message: 'メンター制度導入により、定着率15%向上、スキル習得速度20%向上が期待されます。低コストで高い効果が得られます。',
                priority: 'medium'
              },
              {
                id: 'development-trend',
                type: 'trend',
                title: '継続的な能力開発の重要性',
                message: '医療の高度化・専門化が進む中、継続的なスキルアップと資格取得が組織の競争力を左右します。',
                priority: 'medium'
              }
            ]}
          />
        </section>
      </div>
    </ReportLayout>
  );
}

export default function SkillQualificationReport() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">読み込み中...</div>}>
      <SkillQualificationReportContent />
    </Suspense>
  );
}