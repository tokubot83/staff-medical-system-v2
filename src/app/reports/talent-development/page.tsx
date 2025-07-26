'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportLayout from '@/components/reports/ReportLayout';
import { facilities } from '@/app/data/facilityData';
import { staffDatabase } from '@/app/data/staffData';
import { exportToPDF } from '@/utils/pdfExport';
import { DataCommentList, MetricWithComment } from '@/components/DataComment';
import { DataComment } from '@/types/commentTypes';
import { organizationData, getDepartmentsByType } from '@/app/data/organizationData';
import { tachigamiOrganizationData } from '@/app/data/tachigamiOrganizationData';

function TalentDevelopmentReportContent() {
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
    const isRehabilitation = facilityId === 'tachigami-hospital';
    
    return {
      jobCategories: isRehabilitation ? [
        {
          name: 'セラピスト',
          total: 35,
          skillLevels: [
            { level: '新人（1-2年）', count: 8, percentage: 23 },
            { level: '中堅（3-7年）', count: 15, percentage: 43 },
            { level: 'ベテラン（8年以上）', count: 12, percentage: 34 }
          ],
          criticalSkills: ['回復期リハビリ', '運動器リハビリ', '認知症リハビリ', '温泉療法'],
          trainingNeeds: ['回復期リハ専門資格', '認知症ケア技術', '多職種連携研修']
        },
        {
          name: '看護師',
          total: 65,
          skillLevels: [
            { level: 'レベル1（新人）', count: 10, percentage: 15 },
            { level: 'レベル2（一人前）', count: 26, percentage: 40 },
            { level: 'レベル3（中堅）', count: 20, percentage: 31 },
            { level: 'レベル4（達人）', count: 7, percentage: 11 },
            { level: 'レベル5（エキスパート）', count: 2, percentage: 3 }
          ],
          criticalSkills: ['回復期看護', '認知症ケア', '慢性疾患管理', '在宅復帰支援'],
          trainingNeeds: ['回復期看護研修', '認知症専門資格', '地域連携研修']
        },
        {
          name: '介護職員',
          total: 35,
          skillLevels: [
            { level: '新人（1-2年）', count: 10, percentage: 29 },
            { level: '中堅（3-7年）', count: 15, percentage: 42 },
            { level: 'ベテラン（8年以上）', count: 10, percentage: 29 }
          ],
          criticalSkills: ['身体介護技術', '認知症ケア', 'レクリエーション', 'コミュニケーション'],
          trainingNeeds: ['介護福祉士資格取得', '認知症ケア研修', 'チームケア研修']
        }
      ] : [
        {
          name: '看護師',
          total: 220,
          skillLevels: [
            { level: 'レベル1（新人）', count: 35, percentage: 16 },
            { level: 'レベル2（一人前）', count: 88, percentage: 40 },
            { level: 'レベル3（中堅）', count: 66, percentage: 30 },
            { level: 'レベル4（達人）', count: 22, percentage: 10 },
            { level: 'レベル5（エキスパート）', count: 9, percentage: 4 }
          ],
          criticalSkills: ['救急対応', 'がん看護', '認知症ケア', '感染管理'],
          trainingNeeds: ['リーダーシップ研修', '専門看護師資格取得支援', 'ICT活用研修']
        },
        {
          name: '医師',
          total: 85,
          skillLevels: [
            { level: '研修医', count: 12, percentage: 14 },
            { level: '一般医', count: 38, percentage: 45 },
            { level: '専門医', count: 25, percentage: 29 },
            { level: '指導医', count: 10, percentage: 12 }
          ],
          criticalSkills: ['総合診療', '救急医療', '老年医学', '在宅医療'],
          trainingNeeds: ['最新治療技術研修', '医療安全管理', '多職種連携']
        },
        {
          name: 'リハビリ職',
          total: 45,
          skillLevels: [
            { level: '新人（1-2年）', count: 10, percentage: 22 },
            { level: '中堅（3-7年）', count: 20, percentage: 44 },
            { level: 'ベテラン（8年以上）', count: 15, percentage: 34 }
          ],
          criticalSkills: ['運動器リハビリ', '脳血管リハビリ', '呼吸器リハビリ', '嚥下リハビリ'],
          trainingNeeds: ['認定資格取得支援', '最新リハビリ技術', 'チーム医療研修']
        }
      ],
      careerPaths: [
        {
          role: '看護師',
          paths: [
            { 
              name: '管理職コース',
              stages: ['スタッフ', '主任', '師長', '部長'],
              requiredYears: [3, 5, 5, 7],
              keyCompetencies: ['リーダーシップ', '人材管理', '経営知識']
            },
            {
              name: 'スペシャリストコース',
              stages: ['一般看護師', '院内認定', '認定看護師', '専門看護師'],
              requiredYears: [3, 2, 3, 5],
              keyCompetencies: ['専門知識', '研究能力', '教育スキル']
            }
          ]
        }
      ],
      trainingPrograms: [
        {
          name: '新人教育プログラム',
          target: '入職1年目',
          duration: '1年間',
          completion: 95,
          satisfaction: 88
        },
        {
          name: 'リーダーシップ開発',
          target: '中堅職員',
          duration: '6ヶ月',
          completion: 78,
          satisfaction: 82
        },
        {
          name: '専門資格取得支援',
          target: '全職種',
          duration: '個別設定',
          completion: 65,
          satisfaction: 90
        }
      ],
      recommendations: [
        {
          title: '看護師のキャリアラダー再構築',
          description: 'JNAラダーに準拠しつつ、施設独自の専門性を加味した評価システムの導入',
          impact: '離職率10%減少、専門性向上',
          timeline: '6ヶ月'
        },
        {
          title: 'メンター制度の強化',
          description: '新人・中堅職員へのメンタリング体制を整備し、技術・知識の継承を促進',
          impact: '新人定着率20%向上',
          timeline: '3ヶ月'
        },
        {
          title: 'デジタル学習プラットフォーム導入',
          description: 'e-ラーニングシステムを活用した効率的な学習環境の構築',
          impact: '研修参加率30%向上',
          timeline: '1年'
        }
      ]
    };
  };

  const reportData = generateReportData();

  return (
    <ReportLayout
      title="職種別人材育成戦略"
      description="職種ごとの育成計画とキャリアパス分析を行います"
      icon="🎯"
      color="bg-purple-500"
      facility={facility}
      onExportPDF={() => exportToPDF({
        title: '職種別人材育成戦略レポート',
        facility: facility?.name,
        reportType: 'talent-development',
        elementId: 'report-content',
        dateRange: new Date().toLocaleDateString('ja-JP')
      })}
      categoryPath="/reports/strategic-analysis"
      categoryName="戦略分析"
    >
      <div id="report-content" className="p-8">
        {/* 職種別スキル分布 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">職種別スキル分布</h2>
          <div className="space-y-6">
            {reportData.jobCategories.map((category, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <span className="text-sm text-gray-600">総数: {category.total}名</span>
                </div>
                
                {/* スキルレベル分布 */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">スキルレベル分布</h4>
                  <div className="space-y-2">
                    {category.skillLevels.map((level, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="text-sm text-gray-600 w-40">{level.level}</span>
                        <div className="flex-1 mx-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${level.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 w-20 text-right">
                          {level.count}名 ({level.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 重要スキル */}
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">重要スキル領域</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.criticalSkills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* 研修ニーズ */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">優先研修ニーズ</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.trainingNeeds.map((need, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* キャリアパス */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">キャリアパス設計</h2>
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">看護師のキャリアパス</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.careerPaths[0].paths.map((path, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">{path.name}</h4>
                  <div className="space-y-2">
                    {path.stages.map((stage, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{stage}</p>
                          <p className="text-xs text-gray-500">必要年数: {path.requiredYears[idx]}年</p>
                        </div>
                        {idx < path.stages.length - 1 && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-600">必要コンピテンシー:</p>
                    <p className="text-xs text-gray-800 mt-1">{path.keyCompetencies.join('、')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 研修プログラム効果 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">主要研修プログラムの効果</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">プログラム名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">対象</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期間</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">修了率</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">満足度</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.trainingPrograms.map((program, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{program.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.target}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${program.completion}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-500">{program.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${program.satisfaction}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-500">{program.satisfaction}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 改善提案 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">人材育成戦略の改善提案</h2>
          <div className="space-y-4">
            {reportData.recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                <p className="mt-2 text-gray-600">{rec.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">期待効果: </span>
                    <span className="font-medium text-green-600">{rec.impact}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">実施期間: </span>
                    <span className="font-medium">{rec.timeline}</span>
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
              facilityId === 'tachigami-hospital' ? {
                id: 'skill-gap',
                type: 'warning',
                title: 'スキルギャップの存在',
                message: '看護師のレベル4・5が合計14%、セラピストのベテランが34%と、上級スキル保有者の育成が課題です。',
                priority: 'high'
              } : {
                id: 'skill-gap',
                type: 'warning',
                title: 'スキルギャップの存在',
                message: '看護師のレベル4（達人）・レベル5（エキスパート）が合計14%と少なく、上級スキルの継承が課題です。',
                priority: 'high'
              },
              {
                id: 'career-path-insight',
                type: 'insight',
                title: 'キャリアパスの明確化効果',
                message: '管理職コースとスペシャリストコースの2つのキャリアパスを明確にすることで、職員のモチベーション向上が期待できます。',
                priority: 'medium'
              },
              {
                id: 'training-effectiveness',
                type: 'interpretation',
                title: '研修プログラムの効果分析',
                message: '新人教育プログラムの修了率95%、満足度88%と高い成果を上げています。一方、専門資格取得支援の修了率65%と改善の余地があります。',
                priority: 'medium'
              },
              {
                id: 'action-mentor',
                type: 'action',
                title: 'メンター制度の早期導入',
                message: 'メンター制度の強化により、新人定着率20%向上が期待されます。実施期間3ヶ月と短期間で効果が得られるため、優先的に取り組むべきです。',
                priority: 'high'
              },
              {
                id: 'digital-trend',
                type: 'trend',
                title: 'デジタル学習の潮流',
                message: 'e-ラーニングシステムの導入により、研修参加率30%向上が見込まれます。多忙な医療現場でも柔軟に学習できる環境が整います。',
                priority: 'medium'
              },
              {
                id: 'benchmark-development',
                type: 'benchmark',
                title: '業界水準との比較',
                message: '看護師のスキルレベル分布はJNAラダーの標準的な分布に近い状態ですが、上級レベルの割合を高める余地があります。',
                priority: 'low'
              }
            ] as DataComment[]}
          />
        </section>

      </div>
    </ReportLayout>
  );
}

export default function TalentDevelopmentReport() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">読み込み中...</div>}>
      <TalentDevelopmentReportContent />
    </Suspense>
  );
}