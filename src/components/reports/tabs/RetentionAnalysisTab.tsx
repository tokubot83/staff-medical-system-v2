import React from 'react';
import Link from 'next/link';
import { allReports } from '@/types/reports';

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

  return (
    <div className="space-y-8">
      {/* ヘッダーセクション */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          定着分析レポート
        </h3>
        <p className="text-gray-600 mb-4">
          生存分析とハザード分析を活用した高度な定着率分析により、従業員の定着パターンを可視化し、
          退職リスクを早期に発見・予防するための戦略的インサイトを提供します。
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            リアルタイム更新
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            統計的手法による分析
          </span>
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