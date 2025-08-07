'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Building,
  Users,
  TrendingUp,
  Award,
  Filter,
  Download,
  Calendar
} from 'lucide-react';

interface EvaluationSummary {
  facility: string;
  jobCategory: string;
  count: number;
  averageScore: number;
  gradeDistribution: {
    S: number;
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

export default function EvaluationAnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedJobCategory, setSelectedJobCategory] = useState('all');
  const [summaryData, setSummaryData] = useState<EvaluationSummary[]>([]);

  // Define constants at the top
  const facilities = ['急性期病院', '慢性期病院', '老健', 'グループホーム'];
  const jobCategories = ['看護職', '介護職', '看護補助者'];

  // モックデータ生成
  useEffect(() => {
    
    const data: EvaluationSummary[] = [];
    
    facilities.forEach(facility => {
      jobCategories.forEach(category => {
        const count = Math.floor(Math.random() * 50) + 10;
        data.push({
          facility,
          jobCategory: category,
          count,
          averageScore: 65 + Math.random() * 25,
          gradeDistribution: {
            S: Math.floor(count * 0.1),
            A: Math.floor(count * 0.2),
            B: Math.floor(count * 0.4),
            C: Math.floor(count * 0.2),
            D: Math.floor(count * 0.1)
          }
        });
      });
    });
    
    setSummaryData(data);
  }, [selectedYear]);

  // フィルタリング
  const filteredData = summaryData.filter(item => {
    if (selectedFacility !== 'all' && item.facility !== selectedFacility) return false;
    if (selectedJobCategory !== 'all' && item.jobCategory !== selectedJobCategory) return false;
    return true;
  });

  // 施設別集計
  const facilityAggregation = facilities.map(facility => {
    const facilityData = filteredData.filter(d => d.facility === facility);
    const totalCount = facilityData.reduce((sum, d) => sum + d.count, 0);
    const avgScore = facilityData.length > 0 
      ? facilityData.reduce((sum, d) => sum + d.averageScore * d.count, 0) / totalCount
      : 0;
    
    return {
      name: facility,
      人数: totalCount,
      平均スコア: Math.round(avgScore * 10) / 10
    };
  });

  // 職種別集計
  const jobCategoryAggregation = jobCategories.map(category => {
    const categoryData = filteredData.filter(d => d.jobCategory === category);
    const totalCount = categoryData.reduce((sum, d) => sum + d.count, 0);
    const avgScore = categoryData.length > 0
      ? categoryData.reduce((sum, d) => sum + d.averageScore * d.count, 0) / totalCount
      : 0;
    
    return {
      name: category,
      人数: totalCount,
      平均スコア: Math.round(avgScore * 10) / 10
    };
  });

  // グレード分布集計
  const gradeDistribution = ['S', 'A', 'B', 'C', 'D'].map(grade => {
    const total = filteredData.reduce((sum, d) => 
      sum + d.gradeDistribution[grade as keyof typeof d.gradeDistribution], 0
    );
    return {
      name: grade,
      value: total,
      color: grade === 'S' ? '#ef4444' : 
             grade === 'A' ? '#f97316' :
             grade === 'B' ? '#22c55e' :
             grade === 'C' ? '#3b82f6' : '#9ca3af'
    };
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">評価分析ダッシュボード</h1>
        <p className="text-gray-600">職種別・施設別の評価集計と分析</p>
      </div>

      {/* フィルター */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            フィルター設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">評価年度</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                <option value={2024}>2024年度</option>
                <option value={2023}>2023年度</option>
                <option value={2022}>2022年度</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">施設</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
              >
                <option value="all">全施設</option>
                {facilities.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">職種</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={selectedJobCategory}
                onChange={(e) => setSelectedJobCategory(e.target.value)}
              >
                <option value="all">全職種</option>
                {jobCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総評価対象者</p>
                <p className="text-2xl font-bold">
                  {filteredData.reduce((sum, d) => sum + d.count, 0)}名
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均スコア</p>
                <p className="text-2xl font-bold">
                  {(() => {
                    const totalCount = filteredData.reduce((sum, d) => sum + d.count, 0);
                    const totalScore = filteredData.reduce((sum, d) => sum + d.averageScore * d.count, 0);
                    return totalCount > 0 ? (totalScore / totalCount).toFixed(1) : '0.0';
                  })()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">最多グレード</p>
                <Badge className="text-lg px-3 py-1" variant="default">
                  B
                </Badge>
              </div>
              <Award className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">評価期間</p>
                <p className="text-lg font-bold">{selectedYear}年度</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 分析タブ */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="facility" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="facility">施設別分析</TabsTrigger>
              <TabsTrigger value="job">職種別分析</TabsTrigger>
              <TabsTrigger value="grade">グレード分布</TabsTrigger>
            </TabsList>

            {/* 施設別分析 */}
            <TabsContent value="facility" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">施設別評価状況</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={facilityAggregation}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="人数" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="平均スコア" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">施設</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">評価人数</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">平均スコア</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">S評価</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">A評価</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">B評価</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facilities.map(facility => {
                        const data = filteredData.filter(d => d.facility === facility);
                        const total = data.reduce((sum, d) => sum + d.count, 0);
                        const sCount = data.reduce((sum, d) => sum + d.gradeDistribution.S, 0);
                        const aCount = data.reduce((sum, d) => sum + d.gradeDistribution.A, 0);
                        const bCount = data.reduce((sum, d) => sum + d.gradeDistribution.B, 0);
                        
                        return (
                          <tr key={facility} className="border-t">
                            <td className="px-4 py-3 text-sm">{facility}</td>
                            <td className="px-4 py-3 text-sm text-center">{total}</td>
                            <td className="px-4 py-3 text-sm text-center">
                              {total > 0 ? (data.reduce((sum, d) => sum + d.averageScore * d.count, 0) / total).toFixed(1) : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">{sCount}</td>
                            <td className="px-4 py-3 text-sm text-center">{aCount}</td>
                            <td className="px-4 py-3 text-sm text-center">{bCount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* 職種別分析 */}
            <TabsContent value="job" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">職種別評価状況</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={jobCategoryAggregation}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="人数" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="平均スコア" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {jobCategories.map(category => {
                    const data = filteredData.filter(d => d.jobCategory === category);
                    const total = data.reduce((sum, d) => sum + d.count, 0);
                    const avgScore = total > 0
                      ? data.reduce((sum, d) => sum + d.averageScore * d.count, 0) / total
                      : 0;
                    
                    return (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle className="text-lg">{category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">評価人数</span>
                              <span className="font-semibold">{total}名</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">平均スコア</span>
                              <span className="font-semibold">{avgScore.toFixed(1)}点</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">最高評価率</span>
                              <span className="font-semibold">
                                {total > 0 
                                  ? ((data.reduce((sum, d) => sum + d.gradeDistribution.S, 0) / total) * 100).toFixed(1)
                                  : 0}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* グレード分布 */}
            <TabsContent value="grade" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">評価グレード分布</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={gradeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => 
                            `${name}: ${value}名 (${(percent * 100).toFixed(1)}%)`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-3">
                      {gradeDistribution.map(grade => {
                        const total = filteredData.reduce((sum, d) => sum + d.count, 0);
                        const percentage = total > 0 ? (grade.value / total) * 100 : 0;
                        
                        return (
                          <div key={grade.name} className="flex items-center gap-3">
                            <Badge 
                              className="w-12 justify-center"
                              style={{ backgroundColor: grade.color }}
                            >
                              {grade.name}
                            </Badge>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>{grade.value}名</span>
                                <span>{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full"
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: grade.color 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">評価基準</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    <div>
                      <Badge className="mb-1" variant="destructive">S</Badge>
                      <p className="text-xs">上位10%</p>
                    </div>
                    <div>
                      <Badge className="mb-1" variant="default">A</Badge>
                      <p className="text-xs">上位11-30%</p>
                    </div>
                    <div>
                      <Badge className="mb-1" variant="secondary">B</Badge>
                      <p className="text-xs">上位31-70%</p>
                    </div>
                    <div>
                      <Badge className="mb-1" variant="outline">C</Badge>
                      <p className="text-xs">上位71-90%</p>
                    </div>
                    <div>
                      <Badge className="mb-1" variant="outline">D</Badge>
                      <p className="text-xs">下位10%</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* エクスポートボタン */}
      <div className="mt-6 flex justify-end">
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          分析レポートをダウンロード
        </Button>
      </div>
    </div>
  );
}