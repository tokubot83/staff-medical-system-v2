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
  // データ生成（実際の実装では API から取得）
  const sectionTrendData = generateSampleTrendData(staffRole);
  const sectionCompletionData = generateSectionCompletionData(staffRole);
  const sectionCorrelationData = generateSectionCorrelationData(staffRole);
  
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
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={sectionCompletionData} 
                  layout="horizontal"
                  margin={{ top: 5, right: 80, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="section" 
                    width={120}
                    fontSize={12}
                    tick={{ fill: '#374151' }}
                  />
                  
                  <Bar dataKey="completion" radius={[0, 4, 4, 0]}>
                    {sectionCompletionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.fill || CHART_COLORS.neutral}
                      />
                    ))}
                  </Bar>
                  
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, '充実度']}
                    labelFormatter={(label) => `セクション: ${label}`}
                  />
                </BarChart>
              </ResponsiveContainer>
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
                    formatter={(value: number, name: string) => [
                      `${value}%`, 
                      name === 'discussion_depth' ? '議論深度' : '改善率'
                    ]}
                    labelFormatter={(label) => `セクション: ${sectionCorrelationData.find(d => d.discussion_depth.toString() === label)?.section || ''}`}
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