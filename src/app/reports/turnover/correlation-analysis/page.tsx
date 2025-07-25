'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { BackToReportsButton } from '@/components/BackToReportsButton';
import { CategoryTopButton } from '@/components/CategoryTopButton';
import { exportToPDF } from '@/utils/pdfExport';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const correlationFactors = [
  { factor: '面談頻度', correlation: -0.89, impact: '非常に強い', type: 'positive' },
  { factor: '残業時間', correlation: 0.82, impact: '非常に強い', type: 'negative' },
  { factor: 'ストレスチェック点数', correlation: 0.76, impact: '強い', type: 'negative' },
  { factor: '有給取得率', correlation: -0.75, impact: '強い', type: 'positive' },
  { factor: '給与満足度', correlation: -0.68, impact: '強い', type: 'positive' },
  { factor: '職場の人間関係', correlation: -0.65, impact: '強い', type: 'positive' },
  { factor: '評価の公平性', correlation: -0.62, impact: '中程度', type: 'positive' },
  { factor: '夜勤回数', correlation: 0.47, impact: '中程度', type: 'negative' },
  { factor: '研修参加率', correlation: -0.45, impact: '中程度', type: 'positive' },
  { factor: '通勤時間', correlation: 0.35, impact: '弱い', type: 'negative' },
  { factor: '年齢', correlation: -0.28, impact: '弱い', type: 'positive' },
  { factor: '勤続年数', correlation: -0.21, impact: '弱い', type: 'positive' },
];

const scatterData = [
  { x: 45, y: 15, name: '営業部A' },
  { x: 50, y: 22, name: '営業部B' },
  { x: 55, y: 28, name: '製造部A' },
  { x: 60, y: 35, name: '製造部B' },
  { x: 40, y: 12, name: '管理部' },
  { x: 48, y: 18, name: 'IT部' },
  { x: 52, y: 25, name: '物流部' },
  { x: 38, y: 8, name: '人事部' },
];

const meetingFrequencyData = [
  { x: 0.5, y: 42, name: 'ICU' },
  { x: 0.8, y: 35, name: '救急' },
  { x: 1.2, y: 28, name: '外科' },
  { x: 2.0, y: 18, name: '内科' },
  { x: 3.5, y: 12, name: 'リハビリ' },
  { x: 4.0, y: 8, name: '管理部' },
  { x: 2.5, y: 15, name: '検査科' },
  { x: 1.5, y: 22, name: '薬剤部' },
];

const matrixData = [
  { factor: '面談頻度', 面談頻度: 1.00, 残業時間: -0.72, ストレス: -0.68, 有給取得率: 0.65, 夜勤回数: -0.45 },
  { factor: '残業時間', 面談頻度: -0.72, 残業時間: 1.00, ストレス: 0.78, 有給取得率: -0.65, 夜勤回数: 0.52 },
  { factor: 'ストレス', 面談頻度: -0.68, 残業時間: 0.78, ストレス: 1.00, 有給取得率: -0.58, 夜勤回数: 0.61 },
  { factor: '有給取得率', 面談頻度: 0.65, 残業時間: -0.65, ストレス: -0.58, 有給取得率: 1.00, 夜勤回数: -0.42 },
  { factor: '夜勤回数', 面談頻度: -0.45, 残業時間: 0.52, ストレス: 0.61, 有給取得率: -0.42, 夜勤回数: 1.00 },
];

function CorrelationAnalysisContent() {
  const searchParams = useSearchParams();
  const facility = searchParams.get('facility') || '全施設';

  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue > 0.7) return '#EF4444';
    if (absValue > 0.5) return '#F59E0B';
    if (absValue > 0.3) return '#3B82F6';
    return '#6B7280';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="相関分析" />
      
      <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              離職要因の相関関係と影響度の可視化
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                対象施設: {facility}
              </span>
              <button
                onClick={() => exportToPDF({
                  title: '相関分析レポート',
                  facility: facility,
                  reportType: 'turnover-correlation-analysis',
                  elementId: 'report-content',
                  dateRange: new Date().toLocaleDateString('ja-JP')
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm pdf-exclude"
              >
                PDFダウンロード
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            各種要因と離職率の相関関係を分析し、最も影響度の高い要因を特定します。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              離職率との相関係数
            </h3>
            <div className="space-y-2">
              {correlationFactors.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium text-gray-700 text-right">
                    {item.factor}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full flex items-center justify-end pr-2 text-xs font-semibold text-white ${
                          item.correlation < 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.abs(item.correlation) * 50}%`,
                          marginLeft: item.correlation < 0 ? `${(1 - Math.abs(item.correlation)) * 50}%` : '50%'
                        }}
                      >
                        {item.correlation.toFixed(2)}
                      </div>
                    </div>
                    <div className="absolute inset-x-0 flex justify-center">
                      <div className="w-px h-8 bg-gray-400 -mt-1"></div>
                    </div>
                  </div>
                  <div className="w-20 text-xs text-gray-500">
                    {item.impact}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                <span className="mr-8">← 負の相関（離職率低下）</span>
                <span>正の相関（離職率上昇）→</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              面談頻度と離職率の散布図
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="月間面談回数" 
                  unit="回"
                  domain={[0, 5]}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="離職率" 
                  unit="%"
                  domain={[0, 50]}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="部署別データ" data={meetingFrequencyData} fill="#10B981">
                  {meetingFrequencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#10B981" />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2">
              相関係数: -0.89（非常に強い負の相関）
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              残業時間と離職率の散布図
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="平均残業時間" 
                  unit="時間"
                  domain={[30, 65]}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="離職率" 
                  unit="%"
                  domain={[0, 40]}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="部署別データ" data={scatterData} fill="#EF4444">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#EF4444" />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2">
              相関係数: 0.82（強い正の相関）
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              その他の重要要因との相関
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">ストレスチェック点数</span>
                  <span className="text-sm text-gray-600">相関係数: 0.76</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">夜勤回数</span>
                  <span className="text-sm text-gray-600">相関係数: 0.47</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '47%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">勤続年数</span>
                  <span className="text-sm text-gray-600">相関係数: -0.21</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '21%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">年齢</span>
                  <span className="text-sm text-gray-600">相関係数: -0.28</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            相関マトリックス
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    要因
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    面談頻度
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    残業時間
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ストレス
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    有給取得率
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    夜勤回数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matrixData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.factor}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.面談頻度) }}>
                        {row.面談頻度.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.残業時間) }}>
                        {row.残業時間.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.ストレス) }}>
                        {row.ストレス.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.有給取得率) }}>
                        {row.有給取得率.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.夜勤回数) }}>
                        {row.夜勤回数.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>※ 相関係数の解釈：</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li><span className="text-red-500">●</span> 0.7以上/-0.7以下：強い相関</li>
              <li><span className="text-yellow-500">●</span> 0.4〜0.7/-0.4〜-0.7：中程度の相関</li>
              <li><span className="text-blue-500">●</span> 0.2〜0.4/-0.2〜-0.4：弱い相関</li>
              <li><span className="text-gray-500">●</span> 0.2未満：ほぼ無相関</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              主要な発見
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-gray-700">面談頻度（相関係数: -0.89）</h4>
                <p className="text-sm text-gray-600">最も強い負の相関。月1回以上の定期面談で離職率が大幅に低下</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-gray-700">残業時間（相関係数: 0.82）</h4>
                <p className="text-sm text-gray-600">非常に強い正の相関。月45時間を超えると離職率が急激に上昇</p>
              </div>
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-semibold text-gray-700">ストレスチェック点数（相関係数: 0.76）</h4>
                <p className="text-sm text-gray-600">強い正の相関。70点以上で高リスク</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-700">有給取得率（相関係数: -0.75）</h4>
                <p className="text-sm text-gray-600">強い負の相関。取得率70%以上で離職率が大幅に低下</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              改善優先順位の提案
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span className="font-medium text-green-800">1. 定期面談の実施</span>
                <span className="text-sm text-green-600">最優先</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <span className="font-medium text-red-800">2. 残業時間削減</span>
                <span className="text-sm text-red-600">優先</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                <span className="font-medium text-orange-800">3. ストレス管理強化</span>
                <span className="text-sm text-orange-600">重要</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <span className="font-medium text-yellow-800">4. 有給取得促進</span>
                <span className="text-sm text-yellow-600">重要</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium text-blue-800">5. 夜勤負担軽減</span>
                <span className="text-sm text-blue-600">推奨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
      <CategoryTopButton categoryPath="/reports?tab=turnover" categoryName="離職要因分析" />
      <BackToReportsButton />
      <DashboardButton />
    </div>
  );
}

export default function CorrelationAnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CorrelationAnalysisContent />
    </Suspense>
  );
}