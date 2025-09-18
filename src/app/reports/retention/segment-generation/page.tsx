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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const generationRetentionData = [
  { generation: '20代', 定着玁E年: 75, 定着玁E年: 58, 定着玁E年: 45 },
  { generation: '30代', 定着玁E年: 82, 定着玁E年: 68, 定着玁E年: 55 },
  { generation: '40代', 定着玁E年: 88, 定着玁E年: 76, 定着玁E年: 65 },
  { generation: '50代', 定着玁E年: 92, 定着玁E年: 85, 定着玁E年: 78 },
  { generation: '60代', 定着玁E年: 95, 定着玁E年: 90, 定着玁E年: 85 },
];

const turnoverTimelineData = [
  { month: '3ヶ朁E, '20代': 8, '30代': 5, '40代': 3, '50代': 2, '60代': 1 },
  { month: '6ヶ朁E, '20代': 12, '30代': 8, '40代': 5, '50代': 3, '60代': 2 },
  { month: '1年', '20代': 25, '30代': 18, '40代': 12, '50代': 8, '60代': 5 },
  { month: '2年', '20代': 35, '30代': 25, '40代': 18, '50代': 12, '60代': 8 },
  { month: '3年', '20代': 42, '30代': 32, '40代': 24, '50代': 15, '60代': 10 },
];

const generationFactors = [
  { factor: '給与征E��', '20代': 85, '30代': 75, '40代': 65, '50代': 55, '60代': 45 },
  { factor: 'キャリア成長', '20代': 90, '30代': 80, '40代': 60, '50代': 40, '60代': 30 },
  { factor: 'ワークライフバランス', '20代': 70, '30代': 85, '40代': 90, '50代': 80, '60代': 75 },
  { factor: '職場の人間関俁E, '20代': 75, '30代': 70, '40代': 75, '50代': 80, '60代': 85 },
  { factor: '仕事�EめE��がい', '20代': 80, '30代': 85, '40代': 80, '50代': 75, '60代': 70 },
  { factor: '雁E��の安定性', '20代': 60, '30代': 70, '40代': 85, '50代': 90, '60代': 95 },
];

function SegmentGenerationContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="世代別定着傾向�E极E />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              年齢層別の退職パターンと要因刁E��
            </h2>
            <span className="text-sm text-gray-500">
              対象施設: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            吁E��代の定着玁E�E違いと、世代ごとに異なる重視する要因を�E析し、世代別の最適なリチE��ション施策を提案します、E          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              世代別定着玁E��輁E            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={generationRetentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="generation" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="定着玁E年" fill="#3B82F6" />
                <Bar dataKey="定着玁E年" fill="#10B981" />
                <Bar dataKey="定着玁E年" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              離職玁E�E時系列推移
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={turnoverTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="20代" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="30代" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="40代" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="50代" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="60代" stroke="#6B7280" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            世代別重視要因レーダーチャーチE          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['20代', '30代', '40代'].map((generation) => (
              <div key={generation}>
                <h4 className="text-center font-medium text-gray-700 mb-2">{generation}</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={generationFactors}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name={generation}
                      dataKey={generation}
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              世代別の特徴と課顁E            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">20代�E�E世代・ミレニアル世代�E�E/h4>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-1 space-y-1">
                  <li>キャリア成長機会を最重視！E0%�E�E/li>
                  <li>3年以冁E�E離職玁E��42%と最も高い</li>
                  <li>転職に対する抵抗感が低い</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">30代�E�ミレニアル世代�E�E/h4>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-1 space-y-1">
                  <li>ワークライフバランスを重視！E5%�E�E/li>
                  <li>子育て世代として柔軟な働き方を求めめE/li>
                  <li>キャリアアチE�Eと家庭の両立が課顁E/li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">40代以上！E世代・ベビーブ�Eマ�E�E�E/h4>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-1 space-y-1">
                  <li>雁E��の安定性を重視！E5-95%�E�E/li>
                  <li>定着玁E��高く、絁E���E中核を担ぁE/li>
                  <li>技術変化への適応支援が忁E��E/li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              世代別リチE��ション施策提桁E            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                <h4 className="font-semibold text-blue-800">20代向け施筁E/h4>
                <ul className="list-disc list-inside text-blue-700 text-sm mt-1 space-y-1">
                  <li>明確なキャリアパスの提示</li>
                  <li>メンター制度の允E��E/li>
                  <li>社外研修・賁E��取得支援</li>
                </ul>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-3">
                <h4 className="font-semibold text-green-800">30代向け施筁E/h4>
                <ul className="list-disc list-inside text-green-700 text-sm mt-1 space-y-1">
                  <li>フレチE��スタイム・リモートワーク導�E</li>
                  <li>育児支援制度の拡允E/li>
                  <li>時短勤務�E柔軟な運用</li>
                </ul>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-3">
                <h4 className="font-semibold text-purple-800">40代以上向け施筁E/h4>
                <ul className="list-disc list-inside text-purple-700 text-sm mt-1 space-y-1">
                  <li>スキルアチE�E研修の提侁E/li>
                  <li>健康管琁E�Eログラムの允E��E/li>
                  <li>定年後�E再雇用制度整傁E/li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* アクションボタン */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => exportToPDF({
              title: '世代別定着傾向�E析レポ�EチE,
              facility: facility,
              reportType: 'segment-generation',
              elementId: 'report-content',
              dateRange: new Date().toLocaleDateString('ja-JP')
            })}
            className="pdf-exclude bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            PDFダウンローチE          </button>
          <button className="pdf-exclude bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Excelエクスポ�EチE          </button>
        </div>
      </div><CategoryTopButton categoryPath="/reports?tab=retention" categoryName="定着刁E��" /></div>
  );
}

export default function SegmentGenerationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SegmentGenerationContent />
    </Suspense>
  );
}