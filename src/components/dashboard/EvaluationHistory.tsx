'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { TrendingUp, TrendingDown, Download, Eye } from 'lucide-react';

interface EvaluationHistoryProps {
  employeeId: string;
}

interface HistoryData {
  period: string;
  totalScore: number;
  technicalScore: number;
  contributionScore: number;
  grade: string;
  rank: number;
  details: {
    C01: number;  // 専門技術・スキル
    C02: number;  // 対人関係・ケア
    C03: number;  // 安全・品質管理
    facilitySpecific: number;  // 施設特化
    summerFacility: number;  // 夏季施設貢献
    summerCorporate: number;  // 夏季法人貢献
    winterFacility: number;  // 冬季施設貢献
    winterCorporate: number;  // 冬季法人貢献
  };
}

const EvaluationHistory: React.FC<EvaluationHistoryProps> = ({ employeeId }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'radar'>('line');

  // サンプル評価履歴データ（過去6期分）
  const historyData: HistoryData[] = [
    {
      period: '2023夏',
      totalScore: 68.5,
      technicalScore: 35,
      contributionScore: 33.5,
      grade: 'C',
      rank: 235,
      details: {
        C01: 8,
        C02: 7,
        C03: 8,
        facilitySpecific: 12,
        summerFacility: 8.5,
        summerCorporate: 8,
        winterFacility: 0,
        winterCorporate: 0
      }
    },
    {
      period: '2023冬',
      totalScore: 69.2,
      technicalScore: 35.5,
      contributionScore: 33.7,
      grade: 'C',
      rank: 220,
      details: {
        C01: 8.5,
        C02: 7,
        C03: 8,
        facilitySpecific: 12,
        summerFacility: 0,
        summerCorporate: 0,
        winterFacility: 8.7,
        winterCorporate: 8.5
      }
    },
    {
      period: '2024夏',
      totalScore: 70.2,
      technicalScore: 36.5,
      contributionScore: 33.7,
      grade: 'B',
      rank: 180,
      details: {
        C01: 9,
        C02: 7.5,
        C03: 8,
        facilitySpecific: 12,
        summerFacility: 8.7,
        summerCorporate: 8.5,
        winterFacility: 0,
        winterCorporate: 0
      }
    },
    {
      period: '2024冬',
      totalScore: 71.5,
      technicalScore: 37,
      contributionScore: 34.5,
      grade: 'B',
      rank: 165,
      details: {
        C01: 9,
        C02: 8,
        C03: 8,
        facilitySpecific: 12,
        summerFacility: 0,
        summerCorporate: 0,
        winterFacility: 9,
        winterCorporate: 8.5
      }
    },
    {
      period: '2025夏',
      totalScore: 72.5,
      technicalScore: 38,
      contributionScore: 34.5,
      grade: 'B',
      rank: 142,
      details: {
        C01: 9.5,
        C02: 8,
        C03: 8.5,
        facilitySpecific: 12,
        summerFacility: 9,
        summerCorporate: 8.5,
        winterFacility: 0,
        winterCorporate: 0
      }
    }
  ];

  const radarData = [
    { category: '専門技術', current: 9.5, average: 8.5, max: 10 },
    { category: '対人関係', current: 8, average: 7.5, max: 10 },
    { category: '安全管理', current: 8.5, average: 8, max: 10 },
    { category: '施設特化', current: 12, average: 11, max: 20 },
    { category: '施設貢献', current: 9, average: 8.5, max: 12.5 },
    { category: '法人貢献', current: 8.5, average: 8, max: 12.5 }
  ];

  const getGradeColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      'S': '#10b981',
      'A': '#3b82f6',
      'B': '#f59e0b',
      'C': '#f97316',
      'D': '#ef4444'
    };
    return colors[grade] || '#6b7280';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return null;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}点
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const latestEvaluation = historyData[historyData.length - 1];
  const previousEvaluation = historyData[historyData.length - 2];

  return (
    <div className="space-y-6">
      {/* 最新評価サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">最新評価</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{latestEvaluation.totalScore}点</p>
                <p className="text-sm text-gray-500">{latestEvaluation.period}</p>
              </div>
              <Badge 
                className={`text-lg px-3 py-1`}
                style={{ backgroundColor: `${getGradeColor(latestEvaluation.grade)}20`, color: getGradeColor(latestEvaluation.grade) }}
              >
                {latestEvaluation.grade}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-2">
              {getTrendIcon(latestEvaluation.totalScore, previousEvaluation.totalScore)}
              <span className={`text-sm ${latestEvaluation.totalScore > previousEvaluation.totalScore ? 'text-green-600' : 'text-red-600'}`}>
                前期比 {latestEvaluation.totalScore > previousEvaluation.totalScore ? '+' : ''}
                {(latestEvaluation.totalScore - previousEvaluation.totalScore).toFixed(1)}点
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">順位推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{latestEvaluation.rank}位</p>
                <p className="text-sm text-gray-500">全450名中</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">前期</p>
                <p className="text-lg font-semibold">{previousEvaluation.rank}位</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              {getTrendIcon(previousEvaluation.rank, latestEvaluation.rank)}
              <span className={`text-sm ${latestEvaluation.rank < previousEvaluation.rank ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(latestEvaluation.rank - previousEvaluation.rank)}位
                {latestEvaluation.rank < previousEvaluation.rank ? '上昇' : '下降'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">成長率</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-2xl font-bold">
                +{((latestEvaluation.totalScore / historyData[0].totalScore - 1) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">過去3年間</p>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span>技術評価</span>
                <span className="font-medium">
                  +{(latestEvaluation.technicalScore - historyData[0].technicalScore).toFixed(1)}点
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>貢献度評価</span>
                <span className="font-medium">
                  +{(latestEvaluation.contributionScore - historyData[0].contributionScore).toFixed(1)}点
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* グラフ表示 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>評価推移グラフ</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={chartType === 'line' ? 'default' : 'outline'}
                onClick={() => setChartType('line')}
              >
                折れ線
              </Button>
              <Button
                size="sm"
                variant={chartType === 'bar' ? 'default' : 'outline'}
                onClick={() => setChartType('bar')}
              >
                棒グラフ
              </Button>
              <Button
                size="sm"
                variant={chartType === 'radar' ? 'default' : 'outline'}
                onClick={() => setChartType('radar')}
              >
                レーダー
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartType === 'line' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[60, 80]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="totalScore" 
                    stroke="#3b82f6" 
                    name="総合評価"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="technicalScore" 
                    stroke="#10b981" 
                    name="技術評価"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="contributionScore" 
                    stroke="#f59e0b" 
                    name="貢献度評価"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartType === 'bar' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="technicalScore" stackId="a" fill="#10b981" name="技術評価" />
                  <Bar dataKey="contributionScore" stackId="a" fill="#f59e0b" name="貢献度評価" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartType === 'radar' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 20]} />
                  <Radar 
                    name="現在" 
                    dataKey="current" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                  <Radar 
                    name="平均" 
                    dataKey="average" 
                    stroke="#6b7280" 
                    fill="#6b7280" 
                    fillOpacity={0.1}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 詳細テーブル */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>評価履歴詳細</CardTitle>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              CSVダウンロード
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">期間</th>
                  <th className="text-center p-2">総合評価</th>
                  <th className="text-center p-2">技術評価</th>
                  <th className="text-center p-2">貢献度</th>
                  <th className="text-center p-2">グレード</th>
                  <th className="text-center p-2">順位</th>
                  <th className="text-center p-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((data, index) => (
                  <tr key={data.period} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{data.period}</td>
                    <td className="text-center p-2 font-semibold">{data.totalScore}点</td>
                    <td className="text-center p-2">{data.technicalScore}点</td>
                    <td className="text-center p-2">{data.contributionScore}点</td>
                    <td className="text-center p-2">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: getGradeColor(data.grade),
                          color: getGradeColor(data.grade)
                        }}
                      >
                        {data.grade}
                      </Badge>
                    </td>
                    <td className="text-center p-2">{data.rank}位</td>
                    <td className="text-center p-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationHistory;