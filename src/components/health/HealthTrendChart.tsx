'use client';

/**
 * 健康診断結果の経年変化グラフコンポーネント
 * Created: 2025-09-29
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface TrendData {
  date: string;
  value: number;
  referenceMin?: number;
  referenceMax?: number;
  unit?: string;
  status?: string;
}

interface HealthTrendChartProps {
  data: Record<string, TrendData[]>;
}

export function HealthTrendChart({ data }: HealthTrendChartProps) {
  const [selectedMetric, setSelectedMetric] = useState('BMI');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // メトリクス情報
  const metricInfo: Record<string, {
    label: string;
    unit: string;
    color: string;
    normalMin?: number;
    normalMax?: number;
    warningThresholds?: { min?: number; max?: number };
  }> = {
    BMI: {
      label: 'BMI',
      unit: 'kg/m²',
      color: '#3B82F6',
      normalMin: 18.5,
      normalMax: 25,
      warningThresholds: { min: 17, max: 30 }
    },
    SBP: {
      label: '収縮期血圧',
      unit: 'mmHg',
      color: '#EF4444',
      normalMax: 130,
      warningThresholds: { max: 140 }
    },
    DBP: {
      label: '拡張期血圧',
      unit: 'mmHg',
      color: '#F59E0B',
      normalMax: 85,
      warningThresholds: { max: 90 }
    },
    'T-CHO': {
      label: '総コレステロール',
      unit: 'mg/dL',
      color: '#8B5CF6',
      normalMin: 140,
      normalMax: 220,
      warningThresholds: { min: 120, max: 240 }
    },
    GLU: {
      label: '血糖値',
      unit: 'mg/dL',
      color: '#10B981',
      normalMax: 99,
      warningThresholds: { max: 125 }
    },
    eGFR: {
      label: 'eGFR（腎機能）',
      unit: 'mL/min/1.73m²',
      color: '#06B6D4',
      normalMin: 60,
      warningThresholds: { min: 45 }
    },
    HbA1c: {
      label: 'HbA1c',
      unit: '%',
      color: '#F97316',
      normalMax: 5.6,
      warningThresholds: { max: 6.5 }
    },
    'HDL-C': {
      label: 'HDLコレステロール',
      unit: 'mg/dL',
      color: '#84CC16',
      normalMin: 40,
      warningThresholds: { min: 35 }
    },
    'LDL-C': {
      label: 'LDLコレステロール',
      unit: 'mg/dL',
      color: '#EC4899',
      normalMax: 120,
      warningThresholds: { max: 140 }
    },
    TG: {
      label: '中性脂肪',
      unit: 'mg/dL',
      color: '#A855F7',
      normalMax: 150,
      warningThresholds: { max: 200 }
    }
  };

  // データが存在するメトリクスのみ取得
  const availableMetrics = Object.keys(data).filter(key =>
    data[key] && data[key].length > 0 && metricInfo[key]
  );

  // 選択されたメトリクスのデータ取得
  const currentData = data[selectedMetric] || [];
  const currentMetricInfo = metricInfo[selectedMetric];

  // トレンド計算
  const calculateTrend = () => {
    if (currentData.length < 2) return { direction: 'stable', percentage: 0 };

    const latest = currentData[currentData.length - 1].value;
    const previous = currentData[currentData.length - 2].value;
    const percentage = ((latest - previous) / previous) * 100;

    if (Math.abs(percentage) < 1) return { direction: 'stable', percentage: 0 };
    return {
      direction: percentage > 0 ? 'up' : 'down',
      percentage: Math.abs(percentage)
    };
  };

  const trend = calculateTrend();

  // 最新値の状態判定
  const getLatestStatus = () => {
    if (currentData.length === 0) return 'normal';

    const latest = currentData[currentData.length - 1].value;
    const info = currentMetricInfo;

    if (info.normalMin !== undefined && latest < info.normalMin) {
      if (info.warningThresholds?.min !== undefined && latest < info.warningThresholds.min) {
        return 'warning';
      }
      return 'attention';
    }

    if (info.normalMax !== undefined && latest > info.normalMax) {
      if (info.warningThresholds?.max !== undefined && latest > info.warningThresholds.max) {
        return 'warning';
      }
      return 'attention';
    }

    return 'normal';
  };

  const latestStatus = getLatestStatus();

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-lg font-bold" style={{ color: currentMetricInfo.color }}>
            {data.value} {currentMetricInfo.unit}
          </p>
          {data.status && data.status !== 'NORMAL' && (
            <Badge
              className="mt-1"
              variant={data.status === 'ABNORMAL' ? 'destructive' : 'secondary'}
            >
              {data.status === 'ABNORMAL' ? '異常' : '要注意'}
            </Badge>
          )}
        </div>
      );
    }
    return null;
  };

  // データが無い場合の表示
  if (availableMetrics.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">経年変化データがありません</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* コントロール */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">健康指標の経年変化</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMetrics.map(key => (
                    <SelectItem key={key} value={key}>
                      {metricInfo[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={chartType} onValueChange={(v) => setChartType(v as 'line' | 'bar')}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">折れ線</SelectItem>
                  <SelectItem value="bar">棒グラフ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 現在の状態サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">最新値</p>
                <p className="text-2xl font-bold">
                  {currentData.length > 0 ? currentData[currentData.length - 1].value : '-'}
                  <span className="text-sm font-normal ml-1">{currentMetricInfo.unit}</span>
                </p>
              </div>
              {latestStatus === 'warning' && (
                <AlertTriangle className="w-8 h-8 text-red-500" />
              )}
              {latestStatus === 'attention' && (
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">前回比</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {trend.direction === 'up' && (
                    <>
                      <TrendingUp className="w-5 h-5 text-red-500" />
                      <span className="text-red-500">+{trend.percentage.toFixed(1)}%</span>
                    </>
                  )}
                  {trend.direction === 'down' && (
                    <>
                      <TrendingDown className="w-5 h-5 text-blue-500" />
                      <span className="text-blue-500">-{trend.percentage.toFixed(1)}%</span>
                    </>
                  )}
                  {trend.direction === 'stable' && (
                    <>
                      <Minus className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-500">変化なし</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">基準範囲</p>
              <p className="text-lg font-medium">
                {currentMetricInfo.normalMin !== undefined && currentMetricInfo.normalMax !== undefined
                  ? `${currentMetricInfo.normalMin} - ${currentMetricInfo.normalMax}`
                  : currentMetricInfo.normalMin !== undefined
                  ? `≥ ${currentMetricInfo.normalMin}`
                  : currentMetricInfo.normalMax !== undefined
                  ? `≤ ${currentMetricInfo.normalMax}`
                  : '基準値なし'}
                <span className="text-sm font-normal ml-1">{currentMetricInfo.unit}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* グラフ */}
      <Card>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'line' ? (
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: currentMetricInfo.unit,
                    angle: -90,
                    position: 'insideLeft'
                  }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* 基準範囲の表示 */}
                {currentMetricInfo.normalMin !== undefined && (
                  <ReferenceLine
                    y={currentMetricInfo.normalMin}
                    stroke="#10B981"
                    strokeDasharray="5 5"
                    label={{ value: "下限", position: "left" }}
                  />
                )}
                {currentMetricInfo.normalMax !== undefined && (
                  <ReferenceLine
                    y={currentMetricInfo.normalMax}
                    stroke="#10B981"
                    strokeDasharray="5 5"
                    label={{ value: "上限", position: "left" }}
                  />
                )}
                {currentMetricInfo.warningThresholds?.min !== undefined && (
                  <ReferenceLine
                    y={currentMetricInfo.warningThresholds.min}
                    stroke="#EF4444"
                    strokeDasharray="3 3"
                  />
                )}
                {currentMetricInfo.warningThresholds?.max !== undefined && (
                  <ReferenceLine
                    y={currentMetricInfo.warningThresholds.max}
                    stroke="#EF4444"
                    strokeDasharray="3 3"
                  />
                )}

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={currentMetricInfo.color}
                  strokeWidth={2}
                  dot={{ fill: currentMetricInfo.color, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  label={{
                    value: currentMetricInfo.unit,
                    angle: -90,
                    position: 'insideLeft'
                  }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* 基準範囲の表示 */}
                {currentMetricInfo.normalMin !== undefined && (
                  <ReferenceLine
                    y={currentMetricInfo.normalMin}
                    stroke="#10B981"
                    strokeDasharray="5 5"
                    label={{ value: "下限", position: "left" }}
                  />
                )}
                {currentMetricInfo.normalMax !== undefined && (
                  <ReferenceLine
                    y={currentMetricInfo.normalMax}
                    stroke="#10B981"
                    strokeDasharray="5 5"
                    label={{ value: "上限", position: "left" }}
                  />
                )}

                <Bar
                  dataKey="value"
                  fill={currentMetricInfo.color}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}