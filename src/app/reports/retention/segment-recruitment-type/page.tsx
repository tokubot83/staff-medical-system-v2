'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import BackToReportsButton from '@/components/BackToReportsButton';
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
  { month: '1ヶ月', 新卒: 98, 中途: 94 },
  { month: '3ヶ月', 新卒: 96, 中途: 88 },
  { month: '6ヶ月', 新卒: 93, 中途: 82 },
  { month: '1年', 新卒: 89, 中途: 75 },
  { month: '2年', 新卒: 84, 中途: 68 },
  { month: '3年', 新卒: 78, 中途: 62 },
  { month: '5年', 新卒: 70, 中途: 55 },
];

const departmentComparison = [
  { department: '看護部', 新卒定着率: 85, 中途定着率: 70 },
  { department: 'リハビリ部', 新卒定着率: 90, 中途定着率: 75 },
  { department: '薬剤部', 新卒定着率: 88, 中途定着率: 72 },
  { department: '事務部', 新卒定着率: 92, 中途定着率: 78 },
  { department: '検査部', 新卒定着率: 87, 中途定着率: 73 },
];

const turnoverReasons = {
  新卒: [
    { name: 'キャリアチェンジ', value: 35, color: '#3B82F6' },
    { name: '職場環境', value: 25, color: '#10B981' },
    { name: '給与待遇', value: 20, color: '#F59E0B' },
    { name: '人間関係', value: 15, color: '#EF4444' },
    { name: 'その他', value: 5, color: '#6B7280' },
  ],
  中途: [
    { name: '給与待遇', value: 30, color: '#3B82F6' },
    { name: 'キャリアアップ', value: 28, color: '#10B981' },
    { name: '職場環境', value: 22, color: '#F59E0B' },
    { name: '人間関係', value: 12, color: '#EF4444' },
    { name: 'その他', value: 8, color: '#6B7280' },
  ],
};

function SegmentRecruitmentTypeContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="新卒・中途別定着分析" 
        showBackButton={true}
        backUrl="/reports"
        backText="レポートセンターに戻る"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              採用経路による定着パターンの詳細分析
            </h2>
            <span className="text-sm text-gray-500">
              対象施設: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            新卒採用と中途採用の定着率の違いを時系列で分析し、それぞれの特徴的な退職パターンと要因を明らかにします。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              定着率推移比較
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recruitmentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="新卒" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="中途" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              部署別定着率比較（3年後）
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="新卒定着率" fill="#3B82F6" />
                <Bar dataKey="中途定着率" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              新卒採用者の退職理由分析
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
                  {turnoverReasons.新卒.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              中途採用者の退職理由分析
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
                  {turnoverReasons.中途.map((entry, index) => (
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
            分析結果サマリー
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">新卒採用の特徴</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>初期定着率が高く、長期的に安定した定着を示す</li>
                <li>キャリアチェンジが主な退職理由（35%）</li>
                <li>3年目以降の定着率低下が顕著</li>
                <li>教育・研修制度の充実が定着に寄与</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">中途採用の特徴</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>初期定着率が低く、特に3ヶ月目での離職が多い</li>
                <li>給与待遇への不満が主な退職理由（30%）</li>
                <li>即戦力期待と現実のギャップが課題</li>
                <li>オンボーディングプロセスの改善が必要</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
            <ScrollToTopButton />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function SegmentRecruitmentTypePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SegmentRecruitmentTypeContent />
    </Suspense>
  );
}