'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const recruitmentTypeData = [
  { month: '1ヶ朁E, 新十E 98, 中送E 94 },
  { month: '3ヶ朁E, 新十E 96, 中送E 88 },
  { month: '6ヶ朁E, 新十E 93, 中送E 82 },
  { month: '1年', 新十E 89, 中送E 75 },
  { month: '2年', 新十E 84, 中送E 68 },
  { month: '3年', 新十E 78, 中送E 62 },
  { month: '5年', 新十E 70, 中送E 55 },
];

const departmentComparison = [
  { department: '看護部', 新卒定着玁E 85, 中途定着玁E 70 },
  { department: 'リハビリ部', 新卒定着玁E 90, 中途定着玁E 75 },
  { department: '薬剤部', 新卒定着玁E 88, 中途定着玁E 72 },
  { department: '事務部', 新卒定着玁E 92, 中途定着玁E 78 },
  { department: '検査部', 新卒定着玁E 87, 中途定着玁E 73 },
];

const turnoverReasons = {
  新十E [
    { name: 'キャリアチェンジ', value: 35, color: '#3B82F6' },
    { name: '職場環墁E, value: 25, color: '#10B981' },
    { name: '給与征E��', value: 20, color: '#F59E0B' },
    { name: '人間関俁E, value: 15, color: '#EF4444' },
    { name: 'そ�E仁E, value: 5, color: '#6B7280' },
  ],
  中送E [
    { name: '給与征E��', value: 30, color: '#3B82F6' },
    { name: 'キャリアアチE�E', value: 28, color: '#10B981' },
    { name: '職場環墁E, value: 22, color: '#F59E0B' },
    { name: '人間関俁E, value: 12, color: '#EF4444' },
    { name: 'そ�E仁E, value: 8, color: '#6B7280' },
  ],
};

function SegmentRecruitmentTypeContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="新卒�E中途別定着刁E��" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              採用経路による定着パターンの詳細刁E��
            </h2>
            <span className="text-sm text-gray-500">
              対象施設: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            新卒採用と中途採用の定着玁E�E違いを時系列で刁E��し、それぞれ�E特徴皁E��退職パターンと要因を�Eらかにします、E          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              定着玁E��移比輁E            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recruitmentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="新十E 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="中送E 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              部署別定着玁E��輁E��E年後！E            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="新卒定着玁E fill="#3B82F6" />
                <Bar dataKey="中途定着玁E fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              新卒採用老E�E退職琁E��刁E��
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={turnoverReasons.新卒}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {turnoverReasons.新十Emap((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              中途採用老E�E退職琁E��刁E��
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={turnoverReasons.中途}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {turnoverReasons.中送Emap((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            刁E��結果サマリー
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">新卒採用の特徴</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>初期定着玁E��高く、E��期的に安定した定着を示ぁE/li>
                <li>キャリアチェンジが主な退職琁E���E�E5%�E�E/li>
                <li>3年目以降�E定着玁E��下が顕著</li>
                <li>教育・研修制度の允E��が定着に寁E��E/li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">中途採用の特徴</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>初期定着玁E��低く、特に3ヶ月目での離職が多い</li>
                <li>給与征E��への不満が主な退職琁E���E�E0%�E�E/li>
                <li>即戦力期征E��現実�EギャチE�Eが課顁E/li>
                <li>オンボ�EチE��ングプロセスの改喁E��忁E��E/li>
              </ul>
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => exportToPDF({
                title: '新卒�E中途別定着刁E��レポ�EチE,
                facility: facility,
                reportType: 'segment-recruitment-type',
                elementId: 'report-content',
                dateRange: new Date().toLocaleDateString('ja-JP')
              })}
              className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              PDFダウンローチE            </button>
            <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
              Excelエクスポ�EチE            </button>
          </div>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="定着刁E��" /></div>
  );
}

export default function SegmentRecruitmentTypePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SegmentRecruitmentTypeContent />
    </Suspense>
  );
}