'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';

const monthlyTurnoverData = [
  { month: '1ヶ月目', 退職率: 2.5, 累積退職率: 2.5 },
  { month: '2ヶ月目', 退職率: 3.2, 累積退職率: 5.7 },
  { month: '3ヶ月目', 退職率: 4.8, 累積退職率: 10.5 },
  { month: '4ヶ月目', 退職率: 2.1, 累積退職率: 12.6 },
  { month: '5ヶ月目', 退職率: 1.8, 累積退職率: 14.4 },
  { month: '6ヶ月目', 退職率: 3.5, 累積退職率: 17.9 },
  { month: '7ヶ月目', 退職率: 1.2, 累積退職率: 19.1 },
  { month: '8ヶ月目', 退職率: 1.0, 累積退職率: 20.1 },
  { month: '9ヶ月目', 退職率: 0.9, 累積退職率: 21.0 },
  { month: '10ヶ月目', 退職率: 0.8, 累積退職率: 21.8 },
  { month: '11ヶ月目', 退職率: 0.7, 累積退職率: 22.5 },
  { month: '12ヶ月目', 退職率: 2.5, 累積退職率: 25.0 },
];

const departmentPatterns = [
  { department: '看護部', '1-3ヶ月': 12, '4-6ヶ月': 8, '7-9ヶ月': 3, '10-12ヶ月': 2 },
  { department: 'リハビリ部', '1-3ヶ月': 8, '4-6ヶ月': 5, '7-9ヶ月': 2, '10-12ヶ月': 1 },
  { department: '薬剤部', '1-3ヶ月': 6, '4-6ヶ月': 4, '7-9ヶ月': 2, '10-12ヶ月': 1 },
  { department: '事務部', '1-3ヶ月': 5, '4-6ヶ月': 3, '7-9ヶ月': 1, '10-12ヶ月': 1 },
  { department: '検査部', '1-3ヶ月': 7, '4-6ヶ月': 4, '7-9ヶ月': 2, '10-12ヶ月': 1 },
];

const warningSignals = [
  { signal: '勤怠不良（遅刻・欠勤増加）', frequency: 78, leadTime: '1-2週間前' },
  { signal: '残業時間の急激な変化', frequency: 65, leadTime: '2-3週間前' },
  { signal: '同僚との交流減少', frequency: 58, leadTime: '3-4週間前' },
  { signal: '業務パフォーマンス低下', frequency: 52, leadTime: '2-3週間前' },
  { signal: '面談でのネガティブ発言', frequency: 45, leadTime: '1ヶ月前' },
  { signal: '研修・会議への不参加', frequency: 38, leadTime: '2-3週間前' },
];

const riskFactors = [
  { factor: '期待と現実のギャップ', impact: 85 },
  { factor: '人間関係の問題', impact: 72 },
  { factor: '業務量の過多', impact: 68 },
  { factor: '教育体制の不備', impact: 65 },
  { factor: '評価への不満', impact: 58 },
  { factor: '給与・待遇への不満', impact: 55 },
];

function EarlyTurnoverPatternContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  return (
    <div className="min-h-screen bg-gray-50">
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              早期退職者の共通パターンと予兆行動分析
            </h2>
            <span className="text-sm text-gray-500">
              対象施設: {facility}
            </span>
          </div>
          <p className="text-gray-600">
            入社1年以内に退職した従業員の行動パターンを分析し、早期離職の予兆となる行動や要因を特定します。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              月別退職率推移
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyTurnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="退職率" fill="#EF4444" name="月別退職率(%)" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="累積退職率" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="累積退職率(%)"
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-semibold">重要な発見：</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>3ヶ月目が最も高リスク期間（4.8%）</li>
                <li>6ヶ月目に第二のピーク（3.5%）</li>
                <li>12ヶ月目の契約更新時期に再度上昇</li>
              </ul>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              部署別早期離職パターン
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="1-3ヶ月" fill="#EF4444" stackId="a" />
                <Bar dataKey="4-6ヶ月" fill="#F59E0B" stackId="a" />
                <Bar dataKey="7-9ヶ月" fill="#3B82F6" stackId="a" />
                <Bar dataKey="10-12ヶ月" fill="#10B981" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              早期離職の予兆シグナル
            </h3>
            <div className="space-y-3">
              {warningSignals.map((signal, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{signal.signal}</p>
                    <p className="text-xs text-gray-500">検出時期: {signal.leadTime}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${signal.frequency}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{signal.frequency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              早期離職のリスク要因
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskFactors} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="factor" type="category" width={150} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="impact" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            早期離職防止のための推奨アクション
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <h4 className="font-semibold text-red-800 mb-2">入社1-3ヶ月（高リスク期）</h4>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                <li>週次1on1ミーティングの実施</li>
                <li>メンターによる密着サポート</li>
                <li>業務量の段階的調整</li>
                <li>期待値調整の継続的実施</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">入社4-6ヶ月（安定期）</h4>
              <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                <li>月次フィードバック面談</li>
                <li>スキルアップ機会の提供</li>
                <li>チーム内役割の明確化</li>
                <li>成長実感の可視化</li>
              </ul>
            </div>
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <h4 className="font-semibold text-green-800 mb-2">入社7-12ヶ月（定着期）</h4>
              <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
                <li>キャリアパス面談の実施</li>
                <li>評価制度の透明化</li>
                <li>プロジェクト参画機会</li>
                <li>次年度目標の共同設定</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* アクションボタン */}
        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => exportToPDF({
              title: '早期離職パターン分析レポート',
              facility: facility,
              reportType: 'early-turnover-pattern',
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

export default function EarlyTurnoverPatternPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <EarlyTurnoverPatternContent />
    </Suspense>
  );
}