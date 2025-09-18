'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar';
import { exportToPDF } from '@/utils/pdfExport';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area
} from 'recharts';

const interventionEffects = [
  { 
    month: '2023年1月', 
    定着率: 78, 
    施策前平均: 75,
    intervention: 'メンター制度導入',
    effect: '+3%'
  },
  { 
    month: '2023年4月', 
    定着率: 82, 
    施策前平均: 75,
    intervention: 'オンボーディング改善',
    effect: '+7%'
  },
  { 
    month: '2023年7月', 
    定着率: 85, 
    施策前平均: 75,
    intervention: '福利厚生拡充',
    effect: '+10%'
  },
  { 
    month: '2023年10月', 
    定着率: 88, 
    施策前平均: 75,
    intervention: 'キャリア支援強化',
    effect: '+13%'
  },
  { 
    month: '2024年1月', 
    定着率: 90, 
    施策前平均: 75,
    intervention: '給与体系見直し',
    effect: '+15%'
  },
];

const departmentEffects = [
  { department: '看護部', 施策前: 70, メンター制度: 75, オンボーディング: 80, 福利厚生: 83, キャリア支援: 85 },
  { department: 'リハビリ部', 施策前: 75, メンター制度: 78, オンボーディング: 82, 福利厚生: 85, キャリア支援: 88 },
  { department: '薬剤部', 施策前: 72, メンター制度: 76, オンボーディング: 81, 福利厚生: 84, キャリア支援: 87 },
  { department: '事務部', 施策前: 78, メンター制度: 81, オンボーディング: 85, 福利厚生: 88, キャリア支援: 90 },
];

const costBenefitAnalysis = [
  { 
    施策: 'メンター制度',
    投資額: 500,
    削減コスト: 1200,
    ROI: 140,
    効果: '定着率+5%'
  },
  { 
    施策: 'オンボーディング改善',
    投資額: 800,
    削減コスト: 2000,
    ROI: 150,
    効果: '定着率+7%'
  },
  { 
    施策: '福利厚生拡充',
    投資額: 1500,
    削減コスト: 2800,
    ROI: 87,
    効果: '定着率+8%'
  },
  { 
    施策: 'キャリア支援強化',
    投資額: 1000,
    削減コスト: 2500,
    ROI: 150,
    効果: '定着率+10%'
  },
];

const timelineData = [
  { phase: '導入前', 離職率: 25, 定着率: 75, 満足度: 65 },
  { phase: '導入3ヶ月', 離職率: 22, 定着率: 78, 満足度: 70 },
  { phase: '導入6ヶ月', 離職率: 18, 定着率: 82, 満足度: 75 },
  { phase: '導入9ヶ月', 離職率: 15, 定着率: 85, 満足度: 80 },
  { phase: '導入12ヶ月', 離職率: 10, 定着率: 90, 満足度: 85 },
];

function CohortInterventionEffectContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';
  const [selectedMetric, setSelectedMetric] = useState('定着率');

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbBar />
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              各種施策実施前後での定着率改善効果測定
            </h2>
            <span className="text-sm text-gray-500">
              対象施設: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            実施した各種リテンション施策の効果を定量的に測定し、投資対効果（ROI）を分析します。
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            施策導入による定着率改善推移
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={interventionEffects}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 95]} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="施策前平均"
                fill="#FEE2E2"
                stroke="#EF4444"
                strokeDasharray="5 5"
                name="施策前平均"
              />
              <Line
                type="monotone"
                dataKey="定着率"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 6 }}
                name="実際の定着率"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {interventionEffects.map((item, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-center">
                <p className="text-xs text-gray-600">{item.intervention}</p>
                <p className="text-sm font-semibold text-green-600">{item.effect}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              部署別施策効果
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentEffects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[60, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="施策前" fill="#EF4444" />
                <Bar dataKey="メンター制度" fill="#F59E0B" />
                <Bar dataKey="オンボーディング" fill="#3B82F6" />
                <Bar dataKey="福利厚生" fill="#10B981" />
                <Bar dataKey="キャリア支援" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              施策導入後の総合指標推移
            </h3>
            <div className="mb-4">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="定着率">定着率</option>
                <option value="離職率">離職率</option>
                <option value="満足度">満足度</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            費用対効果分析（ROI）
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    施策名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    投資額（万円）
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    削減コスト（万円）
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI（%）
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    効果
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {costBenefitAnalysis.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.施策}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.投資額 ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.削減コスト ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`font-semibold ${item.ROI > 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {item.ROI}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.効果}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded">
            <p className="text-sm text-green-800">
              <strong>総合評価：</strong>全施策の平均ROIは131.75%で、投資額に対して高いリターンを実現。
              特にキャリア支援強化とオンボーディング改善が高い費用対効果を示しています。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              成功要因分析
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">1</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">段階的な施策導入</p>
                  <p className="text-sm text-gray-600">効果を確認しながら次の施策を導入</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">2</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">データドリブンな改善</p>
                  <p className="text-sm text-gray-600">定量的な効果測定に基づく最適化</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">3</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">現場との連携</p>
                  <p className="text-sm text-gray-600">部署ごとのニーズに合わせた施策調整</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              今後の推奨施策
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                <h4 className="font-semibold text-blue-800 text-sm">AI予測モデル導入</h4>
                <p className="text-blue-700 text-sm mt-1">
                  離職リスクの早期発見による予防的介入
                </p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-3">
                <h4 className="font-semibold text-purple-800 text-sm">パーソナライズド支援</h4>
                <p className="text-purple-700 text-sm mt-1">
                  個人のニーズに応じたカスタマイズ型支援
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-3">
                <h4 className="font-semibold text-green-800 text-sm">長期インセンティブ</h4>
                <p className="text-green-700 text-sm mt-1">
                  勤続年数に応じた段階的な報酬制度
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* アクションボタン */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => exportToPDF({
              title: 'コホート分析（介入効果）レポート',
              facility: facility,
              reportType: 'cohort-intervention-effect',
              elementId: 'report-content',
              dateRange: new Date().toLocaleDateString('ja-JP')
            })}
            className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            PDFダウンロード
          </button>
          <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Excelエクスポート
          </button>
        </div>
      </div></div>
  );
}

export default function CohortInterventionEffectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CohortInterventionEffectContent />
    </Suspense>
  );
}