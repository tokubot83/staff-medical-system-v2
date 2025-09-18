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
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

const cohortData = [
  { year: '1年目', '2020年入社': 100, '2021年入社': 100, '2022年入社': 100, '2023年入社': 100, '2024年入社': 100 },
  { year: '2年目', '2020年入社': 85, '2021年入社': 88, '2022年入社': 90, '2023年入社': 92, '2024年入社': null },
  { year: '3年目', '2020年入社': 78, '2021年入社': 82, '2022年入社': 85, '2023年入社': null, '2024年入社': null },
  { year: '4年目', '2020年入社': 72, '2021年入社': 76, '2022年入社': null, '2023年入社': null, '2024年入社': null },
  { year: '5年目', '2020年入社': 68, '2021年入社': null, '2022年入社': null, '2023年入社': null, '2024年入社': null },
];

const improvementData = [
  { metric: 'オンボーディング改善', '2020年': 0, '2021年': 15, '2022年': 25, '2023年': 35, '2024年': 45 },
  { metric: 'メンター制度導入', '2020年': 0, '2021年': 0, '2022年': 20, '2023年': 30, '2024年': 40 },
  { metric: '福利厚生充実', '2020年': 0, '2021年': 10, '2022年': 15, '2023年': 25, '2024年': 30 },
  { metric: 'キャリア支援強化', '2020年': 0, '2021年': 5, '2022年': 15, '2023年': 20, '2024年': 35 },
];

const departmentCohortData: Record<string, Array<{ year: string; value: number }>> = {
  看護部: [
    { year: '1年目', value: 100 },
    { year: '2年目', value: 82 },
    { year: '3年目', value: 75 },
    { year: '4年目', value: 68 },
    { year: '5年目', value: 62 },
  ],
  リハビリ部: [
    { year: '1年目', value: 100 },
    { year: '2年目', value: 88 },
    { year: '3年目', value: 82 },
    { year: '4年目', value: 76 },
    { year: '5年目', value: 72 },
  ],
  薬剤部: [
    { year: '1年目', value: 100 },
    { year: '2年目', value: 90 },
    { year: '3年目', value: 85 },
    { year: '4年目', value: 80 },
    { year: '5年目', value: 75 },
  ],
  事務部: [
    { year: '1年目', value: 100 },
    { year: '2年目', value: 92 },
    { year: '3年目', value: 88 },
    { year: '4年目', value: 84 },
    { year: '5年目', value: 80 },
  ],
};

const retentionMilestones = [
  { cohort: '2020年入社', '3ヶ月': 92, '6ヶ月': 88, '1年': 85, '2年': 78, '3年': 72 },
  { cohort: '2021年入社', '3ヶ月': 94, '6ヶ月': 90, '1年': 88, '2年': 82, '3年': 76 },
  { cohort: '2022年入社', '3ヶ月': 96, '6ヶ月': 93, '1年': 90, '2年': 85, '3年': null },
  { cohort: '2023年入社', '3ヶ月': 97, '6ヶ月': 95, '1年': 92, '2年': null, '3年': null },
  { cohort: '2024年入社', '3ヶ月': 98, '6ヶ月': 96, '1年': null, '2年': null, '3年': null },
];

function CohortYearlyTrackingContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';
  const [selectedDepartment, setSelectedDepartment] = useState('看護部');

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="入社年度別コホート追跡" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              各採用年次の定着状況長期追跡分析
            </h2>
            <span className="text-sm text-gray-500">
              対象施設: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            各採用年次のコホートを長期的に追跡し、施策の効果や定着率の改善傾向を可視化します。
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            入社年度別定着率推移
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={cohortData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[60, 100]} />
              <Tooltip formatter={(value) => value !== null ? `${value}%` : 'データなし'} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="2020年入社" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="2021年入社" 
                stroke="#3B82F6" 
                strokeWidth={2}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="2022年入社" 
                stroke="#10B981" 
                strokeWidth={2}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="2023年入社" 
                stroke="#F59E0B" 
                strokeWidth={2}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="2024年入社" 
                stroke="#EF4444" 
                strokeWidth={2}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>分析結果：</strong>2021年以降の入社コホートで定着率の改善が顕著に見られます。
              特に2年目の定着率が2020年入社の85%から2023年入社の92%へと7ポイント改善しています。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              重要マイルストーン定着率
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retentionMilestones}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cohort" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[60, 100]} />
                <Tooltip formatter={(value) => value !== null ? `${value}%` : 'データなし'} />
                <Legend />
                <Bar dataKey="3ヶ月" fill="#3B82F6" />
                <Bar dataKey="1年" fill="#10B981" />
                <Bar dataKey="3年" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              施策導入効果の推移
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={improvementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%改善`} />
                <Legend />
                <Area type="monotone" dataKey="2021年" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                <Area type="monotone" dataKey="2022年" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                <Area type="monotone" dataKey="2023年" stackId="1" stroke="#10B981" fill="#10B981" />
                <Area type="monotone" dataKey="2024年" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              部署別コホート分析
            </h3>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(departmentCohortData).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={departmentCohortData[selectedDepartment]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[50, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              コホート別の特徴分析
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-gray-700">2020-2021年入社</h4>
                <p className="text-sm text-gray-600">COVID-19影響下での採用。リモートオンボーディングの課題が定着率に影響</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-700">2022年入社</h4>
                <p className="text-sm text-gray-600">メンター制度導入により、初期定着率が大幅改善</p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-gray-700">2023-2024年入社</h4>
                <p className="text-sm text-gray-600">包括的な定着支援プログラムにより、過去最高の定着率を記録</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              今後の改善提案
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-semibold text-blue-800 text-sm">短期（3ヶ月以内）</h4>
                <ul className="list-disc list-inside text-blue-700 text-sm mt-1 space-y-1">
                  <li>新入社員向けバディ制度の導入</li>
                  <li>週次チェックインミーティングの標準化</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-semibold text-green-800 text-sm">中期（6ヶ月以内）</h4>
                <ul className="list-disc list-inside text-green-700 text-sm mt-1 space-y-1">
                  <li>キャリアパス面談の定期化</li>
                  <li>部署横断的な交流機会の創出</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <h4 className="font-semibold text-purple-800 text-sm">長期（1年以内）</h4>
                <ul className="list-disc list-inside text-purple-700 text-sm mt-1 space-y-1">
                  <li>アルムナイネットワークの構築</li>
                  <li>長期インセンティブ制度の設計</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* アクションボタン */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => exportToPDF({
              title: 'コホート分析（年度別追跡）レポート',
              facility: facility,
              reportType: 'cohort-yearly-tracking',
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
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="定着分析" /></div>
  );
}

export default function CohortYearlyTrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CohortYearlyTrackingContent />
    </Suspense>
  );
}