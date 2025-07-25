'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CategoryMetrics, DataAnalysis } from '@/types/metrics';
import CommonHeader from '@/components/CommonHeader';
import { getCategoryInfo } from '@/utils/reportCategories';
import { ReportCategory } from '@/types/reports';

interface MetricsLayoutProps {
  metrics: CategoryMetrics;
  aiAnalysis?: DataAnalysis;
}

export default function MetricsLayout({ metrics, aiAnalysis }: MetricsLayoutProps) {
  const categoryInfo = getCategoryInfo(metrics.category);
  const pathname = usePathname();

  // メトリクスカテゴリー定義
  const metricsCategories = [
    { id: 'basic', path: '/metrics/basic', label: '基本指標', icon: '📊', category: ReportCategory.BASIC },
    { id: 'quality', path: '/metrics/quality', label: '品質', icon: '⭐', category: ReportCategory.QUALITY },
    { id: 'growth', path: '/metrics/growth', label: '成長', icon: '📈', category: ReportCategory.GROWTH },
    { id: 'risk', path: '/metrics/risk', label: 'リスク', icon: '⚠️', category: ReportCategory.RISK },
    { id: 'efficiency', path: '/metrics/efficiency', label: '効率', icon: '⚡', category: ReportCategory.EFFICIENCY },
  ];

  const getTrendClass = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '―';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title={categoryInfo.name} />
      
      {/* ページ説明 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex items-center gap-3">
            <div className={`text-3xl border-4 ${categoryInfo.color} bg-white text-gray-700 rounded-xl p-3`}>
              {categoryInfo.icon}
            </div>
            <p className="text-gray-600">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 overflow-x-auto">
            {metricsCategories.map((category) => {
              const isActive = pathname === category.path;
              const categoryStyle = getCategoryInfo(category.category);
              
              return (
                <Link
                  key={category.id}
                  href={category.path}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                    transition-all duration-200 whitespace-nowrap
                    ${
                      isActive
                        ? `${categoryStyle.color} bg-opacity-10 border-2`
                        : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                    }
                  `}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className={isActive ? 'font-semibold' : ''}>
                    {category.label}
                  </span>
                </Link>
              );
            })}
            </div>
            <Link
              href="/reports/home"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-green-500 text-white hover:bg-green-600 transition-all duration-200 whitespace-nowrap ml-4"
            >
              <span>←</span>
              <span>レポートセンター一覧へ</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5">
        {/* メイン指標 */}
        <div className={`bg-white rounded-xl p-6 shadow-sm border-t-4 ${categoryInfo.color} mb-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-600 mb-2">主要指標</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-800">
                  {metrics.mainMetric.value}
                  {metrics.mainMetric.unit}
                </span>
                <span className={`text-sm font-semibold ${getTrendClass(metrics.mainMetric.trend)}`}>
                  {getTrendIcon(metrics.mainMetric.trend)}
                  {metrics.mainMetric.change && ` ${metrics.mainMetric.change}%`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* サブ指標 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {metrics.subMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 mb-1">{metric.name}</div>
              <div className="text-2xl font-bold text-gray-800">
                {metric.value}
                {metric.unit}
              </div>
              <div className={`text-xs font-semibold mt-1 ${getTrendClass(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* 施設別・部署別データ */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">施設別・部署別データ</h2>
          </div>
          
          <div className="p-6">
            {metrics.facilityData.map((facility, facilityIndex) => (
              <div key={facilityIndex} className="mb-8 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏢</span>
                  {facility.facilityName}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">部署</th>
                        {facility.departments[0]?.metrics.map((metric, index) => (
                          <th key={index} className="text-left py-3 px-4 font-semibold text-gray-600">
                            {metric.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {facility.departments.map((dept, deptIndex) => (
                        <tr key={deptIndex} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{dept.name}</td>
                          {dept.metrics.map((metric, metricIndex) => (
                            <td key={metricIndex} className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">
                                  {metric.value}
                                  {metric.unit}
                                </span>
                                <span className={`text-xs ${getTrendClass(metric.trend)}`}>
                                  {getTrendIcon(metric.trend)}
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* データ分析サポート */}
        {aiAnalysis && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 mt-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                📈 データ分析サポート
              </h2>
              <div className="flex items-center gap-2 text-sm text-blue-700 bg-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                リアルタイム分析中
              </div>
            </div>
            
            <div className="mb-6 bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">📊 分析サマリー</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{aiAnalysis.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* インサイト */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  💡 重要なインサイト
                </h3>
                <div className="space-y-3">
                  {aiAnalysis.insights.map((insight, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm">{insight.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityClass(insight.priority)}`}>
                          {insight.priority === 'urgent' ? '緊急' : insight.priority === 'high' ? '高' : insight.priority === 'medium' ? '中' : '低'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.content}</p>
                      {insight.impact && (
                        <p className="text-xs text-gray-500">影響: {insight.impact}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 改善提案 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  🎯 改善提案
                </h3>
                <div className="space-y-3">
                  {aiAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm">{rec.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityClass(rec.priority)}`}>
                          {rec.priority === 'urgent' ? '緊急' : rec.priority === 'high' ? '高' : rec.priority === 'medium' ? '中' : '低'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.content}</p>
                      {rec.actions && rec.actions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-gray-500 mb-1">アクション:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {rec.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* リスク警告 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  ⚠️ リスク警告
                </h3>
                <div className="space-y-3">
                  {aiAnalysis.risks.map((risk, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-red-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm">{risk.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityClass(risk.priority)}`}>
                          {risk.priority === 'urgent' ? '緊急' : risk.priority === 'high' ? '高' : risk.priority === 'medium' ? '中' : '低'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{risk.content}</p>
                      {risk.impact && (
                        <p className="text-xs text-red-600 font-semibold">潜在的影響: {risk.impact}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}