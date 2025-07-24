import React from 'react';
import Link from 'next/link';
import { allReports } from '@/types/reports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RetentionAnalysisTabProps {
  selectedFacility: string;
}

export default function RetentionAnalysisTab({ selectedFacility }: RetentionAnalysisTabProps) {
  // 定着分析タイプのレポートをフィルタリング
  const retentionReports = allReports.filter(report => report.type === 'retention');

  const reportCategories = [
    {
      title: '生存曲線分析',
      description: 'Kaplan-Meier法による定着率の時系列推移と部署別・職種別比較',
      reports: retentionReports.filter(r => r.category === 'survival-curve'),
      icon: '📈',
    },
    {
      title: 'ハザード分析',
      description: 'Cox回帰モデルによる退職リスク要因の定量的評価',
      reports: retentionReports.filter(r => r.category === 'hazard-analysis'),
      icon: '⚠️',
    },
    {
      title: 'セグメント別分析',
      description: '採用経路・世代・評価別の定着パターン分析',
      reports: retentionReports.filter(r => r.category === 'segment-analysis'),
      icon: '🎯',
    },
    {
      title: '早期離職予測',
      description: 'AI予測による高リスク従業員の特定とアラート',
      reports: retentionReports.filter(r => r.category === 'early-turnover'),
      icon: '🚨',
    },
    {
      title: 'コホート分析',
      description: '入社年度別の定着状況追跡と改善効果測定',
      reports: retentionReports.filter(r => r.category === 'cohort-analysis'),
      icon: '📊',
    },
  ];

  // サンプル統計データ
  const totalRetentionRate = 87.5;
  const avgTenure = 4.8;
  const earlyTurnoverRate = 12.3;
  const longTermRetention = 78.2;

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">定着分析</h2>
          <p className="text-muted-foreground mt-1">
            生存分析とハザード分析を活用した高度な定着率分析により、従業員の定着パターンを可視化し、
            退職リスクを早期に発見・予防するための戦略的インサイトを提供します。
          </p>
        </div>

        {/* 統計サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                全体定着率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalRetentionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                前年比 +2.5%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                平均勤続年数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgTenure}年</div>
              <p className="text-xs text-muted-foreground mt-1">
                業界平均 3.2年
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                早期離職率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{earlyTurnoverRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                入社1年以内
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                長期定着率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{longTermRetention}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                5年以上勤続
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* カテゴリー別レポート */}
      {reportCategories.map((category) => (
        <div key={category.title} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{category.title}</h4>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          </div>

          {category.reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.reports.map((report) => (
                <Link
                  key={report.id}
                  href={`${report.path}${selectedFacility ? `?facility=${selectedFacility}` : ''}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-5 h-full border border-gray-100 hover:border-blue-200">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-semibold text-gray-800 line-clamp-2">
                        {report.title}
                      </h5>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {report.frequency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {report.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>最終更新: {report.lastUpdated}</span>
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">準備中...</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}