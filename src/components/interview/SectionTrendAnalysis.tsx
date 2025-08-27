'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  BarChart,
  Bar,
  LabelList,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import {
  getSectionsByRole,
  getTargetValueByRole,
  getChartTitleByRole,
  getReferenceLineLabel,
  generateSampleTrendData,
  generateSectionCompletionData,
  generateSectionCorrelationData,
  getInsightsByRole,
  type SectionTrendData,
  type SectionAnalysisResult,
  type SectionCorrelationData
} from '@/lib/interview/section-analysis';

interface SectionTrendAnalysisProps {
  staffRole: string;
  staffId?: string;
}

const CHART_COLORS = {
  primary: '#2563eb',
  success: '#16a34a', 
  warning: '#ca8a04',
  danger: '#dc2626',
  highlight: '#7c3aed',
  neutral: '#e5e7eb'
};

export default function SectionTrendAnalysis({ staffRole }: SectionTrendAnalysisProps) {
  // テストデータ（直接作成）
  const testCompletionData = [
    { section: 'チーム連携', completion: 85, diff: -4, fill: CHART_COLORS.success, name: 'チーム連携' },
    { section: '業務遂行能力', completion: 82, diff: -2, fill: CHART_COLORS.primary, name: '業務遂行能力' },
    { section: 'キャリア志向', completion: 78, diff: -5, fill: CHART_COLORS.warning, name: 'キャリア志向' },
    { section: 'コミュニケーション', completion: 75, diff: 10, fill: CHART_COLORS.neutral, name: 'コミュニケーション' },
    { section: '成長目標', completion: 72, diff: 8, fill: CHART_COLORS.neutral, name: '成長目標' }
  ];
  
  // データ生成（実際の実装では API から取得）
  const sectionTrendData = generateSampleTrendData(staffRole);
  const sectionCompletionData = testCompletionData; // generateSectionCompletionData(staffRole);
  const sectionCorrelationData = generateSectionCorrelationData(staffRole);
  
  // デバッグ用ログ
  console.log('SectionTrendAnalysis - staffRole:', staffRole);
  console.log('SectionTrendAnalysis - sectionCompletionData:', sectionCompletionData);
  console.log('SectionTrendAnalysis - testCompletionData (raw):', testCompletionData);
  console.log('SectionTrendAnalysis - CHART_COLORS:', CHART_COLORS);
  
  // 詳細デバッグ
  sectionCompletionData.forEach((item, index) => {
    console.log(`Data ${index}:`, {
      section: item.section,
      completion: item.completion,
      fill: item.fill,
      type: typeof item.completion
    });
  });
  
  const sections = getSectionsByRole(staffRole);
  const targetValue = getTargetValueByRole(staffRole);
  const chartTitle = getChartTitleByRole(staffRole);
  const referenceLabel = getReferenceLineLabel(staffRole);
  const insights = getInsightsByRole(staffRole, sectionTrendData);

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}点`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // セクション充実度用カスタムツールチップ
  const SectionCompletionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-xl min-w-[200px]"
          style={{ 
            zIndex: 9999,
            backgroundColor: '#ffffff',
            border: '2px solid #374151',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <p 
            className="font-bold text-gray-800 mb-2 text-center"
            style={{ color: '#1f2937', fontSize: '16px', fontWeight: 'bold' }}
          >
            {label}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600" style={{ color: '#6b7280' }}>充実度:</span>
              <span className="font-semibold text-blue-600" style={{ color: '#2563eb', fontWeight: 'bold' }}>
                {payload[0].value}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600" style={{ color: '#6b7280' }}>前回比:</span>
              <span 
                className={`font-semibold ${data.diff >= 0 ? 'text-green-600' : 'text-red-600'}`}
                style={{ 
                  color: data.diff >= 0 ? '#16a34a' : '#dc2626', 
                  fontWeight: 'bold' 
                }}
              >
                {data.diff >= 0 ? '+' : ''}{data.diff}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600" style={{ color: '#6b7280' }}>ランキング:</span>
              <span 
                className="font-semibold text-purple-600"
                style={{ color: '#7c3aed', fontWeight: 'bold' }}
              >
                {sectionCompletionData.findIndex(item => item.section === label) + 1}位
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 散布図用カスタムツールチップ
  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg min-w-[220px]">
          <p className="font-bold text-gray-800 mb-2 text-center">{data.section}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">議論深度:</span>
              <span className="font-semibold text-blue-600">{data.discussion_depth}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">改善率:</span>
              <span className="font-semibold text-green-600">{data.improvement_rate}%</span>
            </div>
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
              <span className="text-gray-600">
                {data.discussion_depth >= 50 && data.improvement_rate >= 50 ? '✅ 優良セクション' :
                 data.discussion_depth < 50 && data.improvement_rate >= 50 ? '⚡ 潜在価値' :
                 data.discussion_depth < 50 && data.improvement_rate < 50 ? '🔴 要改善' :
                 '🔄 要再検討'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 1. セクション別評価トレンド（折れ線グラフ） */}
      <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.primary }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            {chartTitle}
            <Badge variant="outline">過去6回分析</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* グラフエリア（2/3） */}
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sectionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="period" 
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    domain={[30, 100]}
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  
                  {/* 基準線 */}
                  <ReferenceLine 
                    y={targetValue} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    label={{ value: referenceLabel, position: "topRight", style: { fill: '#ef4444', fontSize: 12 } }}
                  />
                  
                  {/* セクション別ライン */}
                  {sections.map((section, index) => (
                    <Line
                      key={section.key}
                      type="monotone"
                      dataKey={section.key}
                      stroke={section.color}
                      strokeWidth={section.strokeWidth}
                      strokeDasharray={section.strokeDasharray || 'none'}
                      name={section.name}
                      dot={{ fill: section.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: section.color, strokeWidth: 2 }}
                    />
                  ))}
                  
                  <Tooltip content={<CustomTooltip />} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* 解釈エリア（1/3） */}
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div 
                  key={index}
                  className={`bg-${insight.color}-50 border-l-4 border-${insight.color}-400 p-4 rounded-r`}
                >
                  <h4 className={`font-bold text-${insight.color}-800 mb-2`}>
                    {insight.title}
                  </h4>
                  <div className={`space-y-1 text-sm text-${insight.color}-700`}>
                    {insight.items.map((item, itemIndex) => (
                      <p key={itemIndex}>{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. セクション別充実度ランキング（横棒グラフ） */}
      <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.success }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            🎯 面談セクション充実度ランキング
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div style={{ width: '100%', height: '350px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height={350} minWidth={300}>
                <BarChart 
                  data={sectionCompletionData} 
                  layout="horizontal"
                  margin={{ top: 20, right: 50, left: 10, bottom: 20 }}
                  width={undefined}
                  height={undefined}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    fontSize={12}
                    tick={{ fill: '#374151', fontSize: 12 }}
                    tickLine={{ stroke: '#d1d5db' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    label={{ value: '充実度 (%)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="section" 
                    width={120}
                    fontSize={11}
                    tick={{ fill: '#374151', fontSize: 11 }}
                    tickLine={{ stroke: '#d1d5db' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  
                  <Bar 
                    dataKey="completion" 
                    name="充実度"
                    radius={[0, 3, 3, 0]}
                  >
                    {sectionCompletionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.fill || '#3b82f6'}
                      />
                    ))}
                  </Bar>
                  
                  <Tooltip 
                    content={<SectionCompletionTooltip />}
                    formatter={(value: number, name: string, props: any) => [`${value}%`, '充実度']}
                    labelFormatter={(label: string) => `セクション: ${label}`}
                    wrapperStyle={{ 
                      zIndex: 10000,
                      pointerEvents: 'none'
                    }}
                    allowEscapeViewBox={{ x: false, y: false }}
                    cursor={false}
                    animationDuration={200}
                  />
                </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* データ解釈 */}
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                <h4 className="font-bold text-blue-800 mb-2">💡 インサイト</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <p className="mb-2">平均充実度: {Math.round(sectionCompletionData.reduce((acc, item) => acc + item.completion, 0) / sectionCompletionData.length)}%</p>
                  <p>• {sectionCompletionData[0].section}: 最重要項目</p>
                  <p>• {sectionCompletionData[sectionCompletionData.length - 1].section}: 議論不足傾向</p>
                  <p className="text-xs mt-2 p-2 bg-blue-100 rounded">
                    次回面談での重点領域として推奨
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. セクション間相関分析（散布図） */}
      <Card className="border-l-4" style={{ borderLeftColor: CHART_COLORS.highlight }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            🔍 セクション間相関分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                  data={sectionCorrelationData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="discussion_depth" 
                    type="number"
                    domain={[0, 100]}
                    name="議論深度"
                    unit="%"
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                    label={{ value: '議論深度 (%)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle' } }}
                  />
                  <YAxis 
                    dataKey="improvement_rate" 
                    type="number"
                    domain={[0, 100]}
                    name="改善率"
                    unit="%"
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                    label={{ value: '改善率 (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  
                  {/* 4象限分割線 */}
                  <ReferenceLine x={50} stroke="#374151" strokeDasharray="3 3" />
                  <ReferenceLine y={50} stroke="#374151" strokeDasharray="3 3" />
                  
                  <Scatter 
                    name="セクション" 
                    data={sectionCorrelationData}
                  >
                    {sectionCorrelationData.map((entry, index) => (
                      <Cell 
                        key={`scatter-cell-${index}`} 
                        fill={entry.fill || CHART_COLORS.neutral}
                      />
                    ))}
                  </Scatter>
                  
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<ScatterTooltip />}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            {/* 四象限解釈 */}
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs font-bold text-green-800">右上: 優良セクション</p>
                <p className="text-xs text-green-700">深い議論＋高改善</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <p className="text-xs font-bold text-yellow-800">左上: 潜在価値</p>
                <p className="text-xs text-yellow-700">議論不足だが改善傾向</p>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <p className="text-xs font-bold text-red-800">左下: 要改善</p>
                <p className="text-xs text-red-700">議論も改善も不足</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs font-bold text-blue-800">右下: 要再検討</p>
                <p className="text-xs text-blue-700">議論多いが改善なし</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}