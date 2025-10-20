'use client';

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DecisionHistoryResponse } from '@/services/voicedrive/types';

type ExpiredEscalationSummary = DecisionHistoryResponse['summary'];

interface DecisionTypeChartProps {
  summary: ExpiredEscalationSummary;
}

interface DecisionTypeData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  [key: string]: string | number; // インデックスシグネチャを追加
}

const COLORS = {
  approve: '#10b981',     // 緑
  downgrade: '#f59e0b',   // オレンジ
  reject: '#ef4444',      // 赤
};

const LABELS = {
  approve: '承認',
  downgrade: 'ダウングレード',
  reject: '不採用',
};

export function DecisionTypeChart({ summary }: DecisionTypeChartProps) {
  const chartData: DecisionTypeData[] = useMemo(() => {
    const total = summary.totalDecisions;
    if (!total || total === 0) return [];

    return [
      {
        name: LABELS.approve,
        value: summary.approvalCount,
        percentage: parseFloat(((summary.approvalCount / total) * 100).toFixed(1)),
        color: COLORS.approve,
      },
      {
        name: LABELS.downgrade,
        value: summary.downgradeCount,
        percentage: parseFloat(((summary.downgradeCount / total) * 100).toFixed(1)),
        color: COLORS.downgrade,
      },
      {
        name: LABELS.reject,
        value: summary.rejectCount,
        percentage: parseFloat(((summary.rejectCount / total) * 100).toFixed(1)),
        color: COLORS.reject,
      },
    ].filter((item) => item.value > 0); // 0件のデータは除外
  }, [summary]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DecisionTypeData;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">件数: {data.value}</p>
          <p className="text-sm text-gray-600">割合: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (!summary || summary.totalDecisions === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">判断タイプ分布</h3>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          データがありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow" data-chart="decision-type">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">判断タイプ分布</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            label={CustomLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(_value: string, entry: any) => {
              const data = entry.payload as DecisionTypeData;
              return `${data.name} (${data.value}件)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
