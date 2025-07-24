'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
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
  { factor: '残業時間', correlation: 0.82, impact: '非常に強い', type: 'negative' },
  { factor: '有給取得率', correlation: -0.75, impact: '強い', type: 'positive' },
  { factor: '給与満足度', correlation: -0.68, impact: '強い', type: 'positive' },
  { factor: '職場の人間関係', correlation: -0.65, impact: '強い', type: 'positive' },
  { factor: '評価の公平性', correlation: -0.62, impact: '中程度', type: 'positive' },
  { factor: '研修参加率', correlation: -0.45, impact: '中程度', type: 'positive' },
  { factor: '通勤時間', correlation: 0.35, impact: '弱い', type: 'negative' },
  { factor: '年齢', correlation: -0.28, impact: '弱い', type: 'positive' },
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

const matrixData = [
  { factor: '残業時間', 残業時間: 1.00, 有給取得率: -0.65, 給与満足度: -0.42, 人間関係: -0.55 },
  { factor: '有給取得率', 残業時間: -0.65, 有給取得率: 1.00, 給与満足度: 0.48, 人間関係: 0.52 },
  { factor: '給与満足度', 残業時間: -0.42, 有給取得率: 0.48, 給与満足度: 1.00, 人間関係: 0.35 },
  { factor: '人間関係', 残業時間: -0.55, 有給取得率: 0.52, 給与満足度: 0.35, 人間関係: 1.00 },
];

export default function CorrelationAnalysisPage() {
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
      <CommonHeader 
        title="相関分析" 
        showBackButton={true}
        backUrl="/reports"
        backText="レポートセンターに戻る"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              離職要因の相関関係と影響度の可視化
            </h2>
            <span className="text-sm text-gray-500">
              対象施設: {facility}
            </span>
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
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={correlationFactors} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[-1, 1]} />
                <YAxis dataKey="factor" type="category" width={100} />
                <Tooltip formatter={(value: number) => value.toFixed(2)} />
                <Bar dataKey="correlation">
                  {correlationFactors.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'positive' ? '#10B981' : '#EF4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

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
                <Scatter name="部署別データ" data={scatterData} fill="#3B82F6">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3B82F6" />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2">
              相関係数: 0.82（強い正の相関）
            </p>
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
                    残業時間
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    有給取得率
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    給与満足度
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    人間関係
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
                      <span style={{ color: getCorrelationColor(row.残業時間) }}>
                        {row.残業時間.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.有給取得率) }}>
                        {row.有給取得率.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.給与満足度) }}>
                        {row.給与満足度.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                      <span style={{ color: getCorrelationColor(row.人間関係) }}>
                        {row.人間関係.toFixed(2)}
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
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-gray-700">残業時間（相関係数: 0.82）</h4>
                <p className="text-sm text-gray-600">最も強い正の相関。月45時間を超えると離職率が急激に上昇</p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-gray-700">有給取得率（相関係数: -0.75）</h4>
                <p className="text-sm text-gray-600">強い負の相関。取得率70%以上で離職率が大幅に低下</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-700">給与満足度（相関係数: -0.68）</h4>
                <p className="text-sm text-gray-600">中程度の負の相関。相対的な評価が重要</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              改善優先順位の提案
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <span className="font-medium text-red-800">1. 残業時間削減</span>
                <span className="text-sm text-red-600">最優先</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                <span className="font-medium text-orange-800">2. 有給取得促進</span>
                <span className="text-sm text-orange-600">優先</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <span className="font-medium text-yellow-800">3. 職場環境改善</span>
                <span className="text-sm text-yellow-600">重要</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium text-blue-800">4. 評価制度見直し</span>
                <span className="text-sm text-blue-600">推奨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DashboardButton />
    </div>
  );
}