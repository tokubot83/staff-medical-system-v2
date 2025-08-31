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

  // 折れ線グラフ用の詳細ツールチップ
  const LineChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentIndex = historyData.findIndex(d => d.period === label);
      const currentData = historyData[currentIndex];
      const previousData = currentIndex > 0 ? historyData[currentIndex - 1] : null;
      
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg min-w-64">
          <div className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">{label}</div>
          
          {payload.map((entry: any, index: number) => {
            const previousValue = previousData ? previousData[entry.dataKey] : null;
            const change = previousValue ? entry.value - previousValue : null;
            const changePercent = previousValue ? ((entry.value - previousValue) / previousValue * 100) : null;
            
            return (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium" style={{ color: entry.color }}>
                    {entry.name}
                  </span>
                  <span className="font-bold text-lg" style={{ color: entry.color }}>
                    {entry.value}点
                  </span>
                </div>
                
                {change !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">前期比:</span>
                    <div className="flex items-center gap-1">
                      {change > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : change < 0 ? (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      ) : null}
                      <span className={`font-medium ${
                        change > 0 ? 'text-green-600' : 
                        change < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}点 
                        ({changePercent !== null ? (changePercent > 0 ? '+' : '') + changePercent.toFixed(1) + '%' : ''})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="mt-3 pt-2 border-t text-xs text-gray-500">
            <div className="flex justify-between">
              <span>グレード: <span className="font-medium" style={{color: getGradeColor(currentData.grade)}}>{currentData.grade}</span></span>
              <span>順位: <span className="font-medium">{currentData.rank}位</span></span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 棒グラフ用の詳細ツールチップ
  const BarChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentData = historyData.find(d => d.period === label);
      if (!currentData) return null;

      const technicalPercent = (currentData.technicalScore / 50) * 100; // 技術評価は50点満点
      const contributionPercent = (currentData.contributionScore / 50) * 100; // 貢献度評価は50点満点
      
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg min-w-72">
          <div className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">{label}</div>
          
          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-700">技術評価</span>
                <span className="font-bold text-lg text-green-700">{currentData.technicalScore}点</span>
              </div>
              <div className="text-sm text-green-600">
                <div>達成率: {technicalPercent.toFixed(1)}% (50点満点)</div>
                <div className="mt-1">
                  内訳: C01({currentData.details.C01}点) + C02({currentData.details.C02}点) + 
                  C03({currentData.details.C03}点) + 施設特化({currentData.details.facilitySpecific}点)
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-orange-700">貢献度評価</span>
                <span className="font-bold text-lg text-orange-700">{currentData.contributionScore}点</span>
              </div>
              <div className="text-sm text-orange-600">
                <div>達成率: {contributionPercent.toFixed(1)}% (50点満点)</div>
                <div className="mt-1">
                  内訳: 施設貢献({label.includes('夏') ? currentData.details.summerFacility : currentData.details.winterFacility}点) + 
                  法人貢献({label.includes('夏') ? currentData.details.summerCorporate : currentData.details.winterCorporate}点)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t text-xs text-gray-500">
            <div className="flex justify-between">
              <span>総合: <span className="font-medium text-blue-600">{currentData.totalScore}点</span></span>
              <span>グレード: <span className="font-medium" style={{color: getGradeColor(currentData.grade)}}>{currentData.grade}</span></span>
              <span>順位: <span className="font-medium">{currentData.rank}位</span></span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // レーダーチャート用の詳細ツールチップ
  const RadarChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = radarData.find(d => d.category === label);
      if (!dataPoint) return null;

      const currentPercent = (dataPoint.current / dataPoint.max) * 100;
      const averagePercent = (dataPoint.average / dataPoint.max) * 100;
      const vsAverage = dataPoint.current - dataPoint.average;

      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg min-w-64">
          <div className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">{label}</div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium">あなたの評価:</span>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">{dataPoint.current}点</div>
                <div className="text-sm text-blue-500">達成率 {currentPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">部署平均:</span>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-600">{dataPoint.average}点</div>
                <div className="text-sm text-gray-500">達成率 {averagePercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">平均との差:</span>
                <div className="flex items-center gap-1">
                  {vsAverage > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : vsAverage < 0 ? (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  ) : null}
                  <span className={`text-sm font-bold ${
                    vsAverage > 0 ? 'text-green-600' : 
                    vsAverage < 0 ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {vsAverage > 0 ? '+' : ''}{vsAverage.toFixed(1)}点
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t text-xs text-gray-500">
            <div className="text-center">
              満点: {dataPoint.max}点 | 
              {vsAverage >= 1 ? ' 強み領域' : vsAverage <= -1 ? ' 改善領域' : ' 平均的'}
            </div>
          </div>
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
                  <Tooltip content={LineChartTooltip} />
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
                  <Tooltip content={BarChartTooltip} />
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
                  <Tooltip content={RadarChartTooltip} />
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