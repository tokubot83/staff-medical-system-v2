'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ExpiredEscalationDecision } from '@/services/voicedrive/types';

interface AchievementRateChartProps {
  data: ExpiredEscalationDecision[];
}

interface AchievementRateDistribution {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

const achievementRanges = [
  { min: 0, max: 50, label: '0-50%', color: '#ef4444' },      // 赤
  { min: 51, max: 100, label: '51-100%', color: '#f59e0b' },  // オレンジ
  { min: 101, max: 150, label: '101-150%', color: '#10b981' }, // 緑
  { min: 151, max: 200, label: '151-200%', color: '#3b82f6' }, // 青
  { min: 201, max: 300, label: '201-300%', color: '#8b5cf6' }, // 紫
  { min: 301, max: 500, label: '301-500%', color: '#ec4899' }, // ピンク
  { min: 501, max: 10000, label: '501%+', color: '#6366f1' },  // インディゴ
];

export function AchievementRateChart({ data }: AchievementRateChartProps) {
  const chartData: AchievementRateDistribution[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    return achievementRanges.map((range) => {
      const count = data.filter(
        (d) => d.achievementRate >= range.min && d.achievementRate <= range.max
      ).length;

      return {
        range: range.label,
        count,
        percentage: parseFloat(((count / data.length) * 100).toFixed(1)),
        color: range.color,
      };
    });
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as AchievementRateDistribution;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{data.range}</p>
          <p className="text-sm text-gray-600">件数: {data.count}</p>
          <p className="text-sm text-gray-600">割合: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">到達率分布</h3>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          データがありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">到達率分布</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            label={{ value: '件数', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
