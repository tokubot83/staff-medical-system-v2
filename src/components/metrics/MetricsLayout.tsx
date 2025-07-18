'use client';

import React from 'react';
import Link from 'next/link';
import { CategoryMetrics, MetricData } from '@/types/metrics';

interface MetricsLayoutProps {
  metrics: CategoryMetrics;
}

export default function MetricsLayout({ metrics }: MetricsLayoutProps) {
  const getTrendClass = (trend?: { isPositive: boolean }) => {
    if (!trend) return 'text-gray-600';
    return trend.isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend?: { isPositive: boolean }) => {
    if (!trend) return '';
    return trend.isPositive ? '↑' : '↓';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-xl">
                🏥
              </div>
              <span className="text-sm">← 戻る</span>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-light flex items-center gap-3">
                <span className="text-3xl">{metrics.icon}</span>
                {metrics.categoryName}
              </h1>
              <p className="text-sm opacity-90 mt-1">{metrics.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-5">
        {/* メイン指標 */}
        <div className={`bg-white rounded-xl p-6 shadow-sm border-t-4 ${metrics.color} mb-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-600 mb-2">{metrics.mainMetric.label}</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-800">
                  {metrics.mainMetric.value}
                  {metrics.mainMetric.unit}
                </span>
                {metrics.mainMetric.trend && (
                  <span className={`text-sm font-semibold ${getTrendClass(metrics.mainMetric.trend)}`}>
                    {getTrendIcon(metrics.mainMetric.trend)} {metrics.mainMetric.trend.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* サブ指標 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {metrics.subMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-gray-800">
                {metric.value}
                {metric.unit}
              </div>
              {metric.trend && (
                <div className={`text-xs font-semibold mt-1 ${getTrendClass(metric.trend)}`}>
                  {getTrendIcon(metric.trend)} {metric.trend.value}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 施設別・部署別データ */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">施設別・部署別データ</h2>
          </div>
          
          <div className="p-6">
            {metrics.facilities.map((facility, facilityIndex) => (
              <div key={facilityIndex} className="mb-8 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏢</span>
                  {facility.name}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">部署</th>
                        {facility.departments[0]?.metrics.map((metric, index) => (
                          <th key={index} className="text-left py-3 px-4 font-semibold text-gray-600">
                            {metric.label}
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
                                {metric.trend && (
                                  <span className={`text-xs ${getTrendClass(metric.trend)}`}>
                                    {getTrendIcon(metric.trend)}
                                  </span>
                                )}
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
      </div>
    </div>
  );
}