'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { ExpiredEscalationDecision } from '@/services/voicedrive/types';

interface TimeSeriesChartProps {
  data: ExpiredEscalationDecision[];
  onEnlarge?: () => void;
}

interface TimeSeriesData {
  date: string;
  approved: number;
  downgraded: number;
  rejected: number;
  total: number;
  displayDate: string; // グラフ表示用（MM/DD形式）
}

const COLORS = {
  approved: '#10b981',    // 緑
  downgraded: '#f59e0b',  // オレンジ
  rejected: '#ef4444',    // 赤
};

const LABELS = {
  approved: '承認',
  downgraded: 'ダウングレード',
  rejected: '不採用',
};

export function TimeSeriesChart({ data, onEnlarge }: TimeSeriesChartProps) {
  const chartData: TimeSeriesData[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    // 日付ごとにグループ化
    const dateMap = new Map<string, { approved: number; downgraded: number; rejected: number }>();

    data.forEach((d) => {
      const date = format(parseISO(d.createdAt), 'yyyy-MM-dd');
      if (!dateMap.has(date)) {
        dateMap.set(date, { approved: 0, downgraded: 0, rejected: 0 });
      }

      const entry = dateMap.get(date)!;
      if (d.decision === 'approve_at_current_level') {
        entry.approved++;
      } else if (d.decision === 'downgrade') {
        entry.downgraded++;
      } else if (d.decision === 'reject') {
        entry.rejected++;
      }
    });

    // ソートして配列に変換
    return Array.from(dateMap.entries())
      .map(([date, counts]) => ({
        date,
        displayDate: format(parseISO(date), 'M/d'),
        approved: counts.approved,
        downgraded: counts.downgraded,
        rejected: counts.rejected,
        total: counts.approved + counts.downgraded + counts.rejected,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TimeSeriesData;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.displayDate}</p>
          <div className="space-y-1">
            <p className="text-sm" style={{ color: COLORS.approved }}>
              {LABELS.approved}: {data.approved}件
            </p>
            <p className="text-sm" style={{ color: COLORS.downgraded }}>
              {LABELS.downgraded}: {data.downgraded}件
            </p>
            <p className="text-sm" style={{ color: COLORS.rejected }}>
              {LABELS.rejected}: {data.rejected}件
            </p>
            <p className="text-sm text-gray-600 font-semibold pt-1 border-t border-gray-200">
              合計: {data.total}件
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">判断推移（日別）</h3>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          データがありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow" data-chart="time-series">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">判断推移（日別）</h3>
        {onEnlarge && (
          <button
            onClick={onEnlarge}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="拡大表示"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </button>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            label={{ value: '件数', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 14 }}
            formatter={(value: string) => {
              if (value === 'approved') return LABELS.approved;
              if (value === 'downgraded') return LABELS.downgraded;
              if (value === 'rejected') return LABELS.rejected;
              return value;
            }}
          />
          <Line
            type="monotone"
            dataKey="approved"
            stroke={COLORS.approved}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="downgraded"
            stroke={COLORS.downgraded}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="rejected"
            stroke={COLORS.rejected}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
