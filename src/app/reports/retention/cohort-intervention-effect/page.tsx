'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
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
    month: '2023年1朁E, 
    定着玁E 78, 
    施策前平坁E 75,
    intervention: 'メンター制度導�E',
    effect: '+3%'
  },
  { 
    month: '2023年4朁E, 
    定着玁E 82, 
    施策前平坁E 75,
    intervention: 'オンボ�EチE��ング改喁E,
    effect: '+7%'
  },
  { 
    month: '2023年7朁E, 
    定着玁E 85, 
    施策前平坁E 75,
    intervention: '福利厚生拡允E,
    effect: '+10%'
  },
  { 
    month: '2023年10朁E, 
    定着玁E 88, 
    施策前平坁E 75,
    intervention: 'キャリア支援強匁E,
    effect: '+13%'
  },
  { 
    month: '2024年1朁E, 
    定着玁E 90, 
    施策前平坁E 75,
    intervention: '給与体系見直ぁE,
    effect: '+15%'
  },
];

const departmentEffects = [
  { department: '看護部', 施策前: 70, メンター制度: 75, オンボ�EチE��ング: 80, 福利厚生: 83, キャリア支援: 85 },
  { department: 'リハビリ部', 施策前: 75, メンター制度: 78, オンボ�EチE��ング: 82, 福利厚生: 85, キャリア支援: 88 },
  { department: '薬剤部', 施策前: 72, メンター制度: 76, オンボ�EチE��ング: 81, 福利厚生: 84, キャリア支援: 87 },
  { department: '事務部', 施策前: 78, メンター制度: 81, オンボ�EチE��ング: 85, 福利厚生: 88, キャリア支援: 90 },
];

const costBenefitAnalysis = [
  { 
    施筁E 'メンター制度',
    投賁E��E 500,
    削減コスチE 1200,
    ROI: 140,
    効极E '定着玁E5%'
  },
  { 
    施筁E 'オンボ�EチE��ング改喁E,
    投賁E��E 800,
    削減コスチE 2000,
    ROI: 150,
    効极E '定着玁E7%'
  },
  { 
    施筁E '福利厚生拡允E,
    投賁E��E 1500,
    削減コスチE 2800,
    ROI: 87,
    効极E '定着玁E8%'
  },
  { 
    施筁E 'キャリア支援強匁E,
    投賁E��E 1000,
    削減コスチE 2500,
    ROI: 150,
    効极E '定着玁E10%'
  },
];

const timelineData = [
  { phase: '導�E剁E, 離職玁E 25, 定着玁E 75, 満足度: 65 },
  { phase: '導�E3ヶ朁E, 離職玁E 22, 定着玁E 78, 満足度: 70 },
  { phase: '導�E6ヶ朁E, 離職玁E 18, 定着玁E 82, 満足度: 75 },
  { phase: '導�E9ヶ朁E, 離職玁E 15, 定着玁E 85, 満足度: 80 },
  { phase: '導�E12ヶ朁E, 離職玁E 10, 定着玁E 90, 満足度: 85 },
];

function CohortInterventionEffectContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';
  const [selectedMetric, setSelectedMetric] = useState('定着玁E);

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="リチE��ション施策効果測宁E />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              吁E��施策実施前後での定着玁E��喁E��果測宁E
            </h2>
            <span className="text-sm text-gray-500">
              対象施設: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            実施した吁E��リチE��ション施策�E効果を定量皁E��測定し、投賁E��効果！EOI�E�を刁E��します、E
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            施策導�Eによる定着玁E��喁E��移
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
                dataKey="施策前平坁E
                fill="#FEE2E2"
                stroke="#EF4444"
                strokeDasharray="5 5"
                name="施策前平坁E
              />
              <Line
                type="monotone"
                dataKey="定着玁E
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 6 }}
                name="実際の定着玁E
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
              部署別施策効极E
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
                <Bar dataKey="オンボ�EチE��ング" fill="#3B82F6" />
                <Bar dataKey="福利厚生" fill="#10B981" />
                <Bar dataKey="キャリア支援" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              施策導�E後�E総合持E��推移
            </h3>
            <div className="mb-4">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="定着玁E>定着玁E/option>
                <option value="離職玁E>離職玁E/option>
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
            費用対効果�E析！EOI�E�E
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    施策名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    投賁E��（丁E�E�E�E
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    削減コスト（丁E�E�E�E
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI�E�E�E�E
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    効极E
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
                      {(item.投賁E��E?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.削減コスチE?? 0).toLocaleString()}
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
              <strong>総合評価�E�E/strong>全施策�E平均ROIは131.75%で、投賁E��に対して高いリターンを実現、E
              特にキャリア支援強化とオンボ�EチE��ング改喁E��高い費用対効果を示してぁE��す、E
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              成功要因刁E��
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">1</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">段階的な施策導�E</p>
                  <p className="text-sm text-gray-600">効果を確認しながら次の施策を導�E</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">2</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">チE�Eタドリブンな改喁E/p>
                  <p className="text-sm text-gray-600">定量皁E��効果測定に基づく最適匁E/p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">3</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">現場との連携</p>
                  <p className="text-sm text-gray-600">部署ごとのニ�Eズに合わせた施策調整</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              今後�E推奨施筁E
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                <h4 className="font-semibold text-blue-800 text-sm">AI予測モチE��導�E</h4>
                <p className="text-blue-700 text-sm mt-1">
                  離職リスクの早期発見による予防皁E���E
                </p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-3">
                <h4 className="font-semibold text-purple-800 text-sm">パ�Eソナライズド支援</h4>
                <p className="text-purple-700 text-sm mt-1">
                  個人のニ�Eズに応じたカスタマイズ型支援
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-3">
                <h4 className="font-semibold text-green-800 text-sm">長期インセンチE��チE/h4>
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
              title: 'コホ�Eト�E析（介�E効果）レポ�EチE,
              facility: facility,
              reportType: 'cohort-intervention-effect',
              elementId: 'report-content',
              dateRange: new Date().toLocaleDateString('ja-JP')
            })}
            className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            PDFダウンローチE
          </button>
          <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Excelエクスポ�EチE
          </button>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="定着刁E��" /></div>
  );
}

export default function CohortInterventionEffectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CohortInterventionEffectContent />
    </Suspense>
  );
}