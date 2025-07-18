'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportLayout from '@/components/reports/ReportLayout';
import { facilities } from '@/app/data/facilityData';

export default function RecruitmentEffectivenessReport() {
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
    return {
      overview: {
        totalHires: 68,
        targetHires: 75,
        achievementRate: 91,
        avgTimeToHire: 42,
        costPerHire: 320000,
        retentionRate1Year: 88
      },
      hiringByChannel: [
        { channel: '人材紹介会社', hires: 25, cost: 8000000, quality: 85 },
        { channel: '転職サイト', hires: 18, cost: 2400000, quality: 78 },
        { channel: '自社HP', hires: 12, cost: 300000, quality: 92 },
        { channel: 'リファラル採用', hires: 8, cost: 400000, quality: 95 },
        { channel: '新卒採用', hires: 5, cost: 1000000, quality: 88 }
      ],
      hiringByPosition: [
        { position: '看護師', target: 35, actual: 32, achievement: 91, avgDays: 38 },
        { position: '医師', target: 10, actual: 7, achievement: 70, avgDays: 85 },
        { position: 'リハビリ職', target: 15, actual: 14, achievement: 93, avgDays: 42 },
        { position: '薬剤師', target: 8, actual: 8, achievement: 100, avgDays: 35 },
        { position: '事務職', target: 7, actual: 7, achievement: 100, avgDays: 28 }
      ],
      qualityMetrics: {
        performanceAfter6Months: {
          excellent: 22,
          good: 35,
          average: 28,
          poor: 15
        },
        cultureFit: {
          veryGood: 45,
          good: 32,
          average: 18,
          poor: 5
        },
        trainingCompletion: 92,
        probationPassRate: 96
      },
      costAnalysis: {
        totalCost: 12100000,
        byCategory: [
          { category: '人材紹介手数料', amount: 8000000, percentage: 66 },
          { category: '求人広告費', amount: 2400000, percentage: 20 },
          { category: '採用活動人件費', amount: 1200000, percentage: 10 },
          { category: 'その他経費', amount: 500000, percentage: 4 }
        ],
        roi: {
          avgRevenuePerEmployee: 8500000,
          breakEvenMonths: 14,
          threeyearROI: 285
        }
      },
      recommendations: [
        {
          title: 'リファラル採用の強化',
          description: '高い定着率と低コストを実現するリファラル採用制度の拡充',
          expectedImpact: 'コスト30%削減、質の向上',
          priority: 'high'
        },
        {
          title: '医師採用チャネルの見直し',
          description: '医師採用の成功率向上のため、専門エージェントとの連携強化',
          expectedImpact: '採用達成率を70%から90%へ',
          priority: 'urgent'
        },
        {
          title: '採用ブランディングの強化',
          description: '自社HPやSNSを活用した採用ブランディング戦略の実施',
          expectedImpact: '直接応募30%増加',
          priority: 'medium'
        }
      ]
    };
  };

  const reportData = generateReportData();

  return (
    <ReportLayout
      title="採用効果分析"
      description="採用活動の効果測定と改善提案を提供します"
      icon="🎯"
      color="bg-teal-500"
      facility={facility}
      onExportPDF={() => console.log('PDF export')}
    >
      <div className="p-8">
        {/* 採用概要 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">採用活動概要</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">総採用数</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalHires}名</p>
              <p className="text-xs text-gray-500 mt-1">目標: {reportData.overview.targetHires}名</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">達成率</p>
              <p className="text-2xl font-bold text-teal-600">{reportData.overview.achievementRate}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">平均採用日数</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.avgTimeToHire}日</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">採用単価</p>
              <p className="text-2xl font-bold text-gray-900">¥{reportData.overview.costPerHire.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">1年定着率</p>
              <p className="text-2xl font-bold text-green-600">{reportData.overview.retentionRate1Year}%</p>
            </div>
          </div>
        </section>

        {/* チャネル別分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">採用チャネル別分析</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">チャネル</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">採用数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コスト</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">単価</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">質スコア</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.hiringByChannel.map((channel, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{channel.channel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{channel.hires}名</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{channel.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{Math.round(channel.cost / channel.hires).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              channel.quality >= 90 ? 'bg-green-600' :
                              channel.quality >= 80 ? 'bg-blue-600' : 'bg-yellow-600'
                            }`}
                            style={{ width: `${channel.quality}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{channel.quality}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 職種別採用状況 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">職種別採用達成状況</h2>
          <div className="space-y-3">
            {reportData.hiringByPosition.map((position, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{position.position}</h3>
                  <span className="text-sm text-gray-600">平均採用日数: {position.avgDays}日</span>
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">実績: {position.actual}名 / 目標: {position.target}名</span>
                      <span className={`font-medium ${
                        position.achievement >= 90 ? 'text-green-600' :
                        position.achievement >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{position.achievement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          position.achievement >= 90 ? 'bg-green-600' :
                          position.achievement >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${position.achievement}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 採用品質指標 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">採用品質指標</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">6ヶ月後パフォーマンス評価</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">優秀</span>
                  <span className="text-sm font-medium">{reportData.qualityMetrics.performanceAfter6Months.excellent}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">良好</span>
                  <span className="text-sm font-medium">{reportData.qualityMetrics.performanceAfter6Months.good}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">標準</span>
                  <span className="text-sm font-medium">{reportData.qualityMetrics.performanceAfter6Months.average}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">要改善</span>
                  <span className="text-sm font-medium text-red-600">{reportData.qualityMetrics.performanceAfter6Months.poor}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">その他の品質指標</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">研修修了率</span>
                  <span className="text-sm font-medium text-green-600">{reportData.qualityMetrics.trainingCompletion}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">試用期間通過率</span>
                  <span className="text-sm font-medium text-green-600">{reportData.qualityMetrics.probationPassRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">組織適合度（良好以上）</span>
                  <span className="text-sm font-medium text-blue-600">
                    {reportData.qualityMetrics.cultureFit.veryGood + reportData.qualityMetrics.cultureFit.good}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* コスト分析 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">採用コスト分析</h2>
          <div className="bg-white border rounded-lg p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">総採用コスト</p>
              <p className="text-3xl font-bold text-gray-900">¥{reportData.costAnalysis.totalCost.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              {reportData.costAnalysis.byCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-sm text-gray-600 w-40">{category.category}</span>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${category.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-32 text-right">
                    ¥{category.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">ROI分析</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">平均収益貢献</p>
                  <p className="font-medium">¥{reportData.costAnalysis.roi.avgRevenuePerEmployee.toLocaleString()}/年</p>
                </div>
                <div>
                  <p className="text-gray-600">投資回収期間</p>
                  <p className="font-medium">{reportData.costAnalysis.roi.breakEvenMonths}ヶ月</p>
                </div>
                <div>
                  <p className="text-gray-600">3年間ROI</p>
                  <p className="font-medium text-green-600">{reportData.costAnalysis.roi.threeyearROI}%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 改善提案 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">採用戦略の改善提案</h2>
          <div className="space-y-4">
            {reportData.recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                    <p className="mt-2 text-gray-600">{rec.description}</p>
                    <p className="mt-2 text-sm text-teal-600">
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
      </div>
    </ReportLayout>
  );
}