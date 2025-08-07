'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  History,
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  User,
  Filter,
  Download,
  ChevronRight,
  Minus
} from 'lucide-react';
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
  ResponsiveContainer
} from 'recharts';

interface EvaluationHistoryItem {
  year: number;
  technicalScore: number;
  facilityContribution: number;
  corporateContribution: number;
  totalScore: number;
  facilityGrade: string;
  corporateGrade: string;
  finalGrade: string;
  facilityRank: number;
  facilityTotal: number;
  corporateRank: number;
  corporateTotal: number;
}

interface StaffProfile {
  staffId: string;
  staffName: string;
  facility: string;
  department: string;
  jobCategory: string;
  joinDate: string;
}

export default function EvaluationHistoryPage() {
  const [selectedStaffId, setSelectedStaffId] = useState('001');
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [historyData, setHistoryData] = useState<EvaluationHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch staff profile and history
  useEffect(() => {
    // Mock data
    setStaffProfile({
      staffId: selectedStaffId,
      staffName: '佐藤 太郎',
      facility: '急性期病院',
      department: '看護部',
      jobCategory: '看護職',
      joinDate: '2018-04-01'
    });

    // Mock history data
    setHistoryData([
      {
        year: 2024,
        technicalScore: 42.5,
        facilityContribution: 18.5,
        corporateContribution: 15.2,
        totalScore: 76.2,
        facilityGrade: 'A',
        corporateGrade: 'B',
        finalGrade: 'A',
        facilityRank: 15,
        facilityTotal: 120,
        corporateRank: 85,
        corporateTotal: 480
      },
      {
        year: 2023,
        technicalScore: 39.0,
        facilityContribution: 16.0,
        corporateContribution: 14.5,
        totalScore: 69.5,
        facilityGrade: 'B',
        corporateGrade: 'B',
        finalGrade: 'B',
        facilityRank: 42,
        facilityTotal: 118,
        corporateRank: 150,
        corporateTotal: 475
      },
      {
        year: 2022,
        technicalScore: 35.5,
        facilityContribution: 15.0,
        corporateContribution: 13.0,
        totalScore: 63.5,
        facilityGrade: 'B',
        corporateGrade: 'C',
        finalGrade: 'C',
        facilityRank: 65,
        facilityTotal: 115,
        corporateRank: 230,
        corporateTotal: 470
      },
      {
        year: 2021,
        technicalScore: 32.0,
        facilityContribution: 14.0,
        corporateContribution: 12.5,
        totalScore: 58.5,
        facilityGrade: 'C',
        corporateGrade: 'C',
        finalGrade: 'C',
        facilityRank: 78,
        facilityTotal: 110,
        corporateRank: 280,
        corporateTotal: 465
      },
      {
        year: 2020,
        technicalScore: 30.0,
        facilityContribution: 13.5,
        corporateContribution: 11.5,
        totalScore: 55.0,
        facilityGrade: 'C',
        corporateGrade: 'C',
        finalGrade: 'C',
        facilityRank: 82,
        facilityTotal: 108,
        corporateRank: 310,
        corporateTotal: 460
      }
    ]);
  }, [selectedStaffId]);

  // Calculate trends
  const latestYear = historyData[0];
  const previousYear = historyData[1];
  const scoreTrend = latestYear && previousYear 
    ? latestYear.totalScore - previousYear.totalScore 
    : 0;
  const rankTrend = latestYear && previousYear
    ? previousYear.facilityRank - latestYear.facilityRank
    : 0;

  // Prepare chart data
  const chartData = historyData.map(item => ({
    year: item.year,
    '技術評価': item.technicalScore,
    '施設貢献': item.facilityContribution,
    '法人貢献': item.corporateContribution,
    '総合スコア': item.totalScore
  })).reverse();

  const rankChartData = historyData.map(item => ({
    year: item.year,
    '施設内順位': item.facilityRank,
    '法人内順位': item.corporateRank
  })).reverse();

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'S+': 'text-red-500',
      'S': 'text-orange-500',
      'A+': 'text-yellow-500',
      'A': 'text-green-500',
      'B': 'text-blue-500',
      'C': 'text-indigo-500',
      'D': 'text-gray-500'
    };
    return colors[grade] || 'text-gray-400';
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">評価履歴管理</h1>
        <p className="text-gray-600">職員の評価履歴と成長推移を確認</p>
      </div>

      {/* 職員選択 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            職員選択
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="職員IDまたは氏名で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button>検索</Button>
          </div>
        </CardContent>
      </Card>

      {staffProfile && (
        <>
          {/* 職員情報 */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{staffProfile.staffName}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">職員ID:</span>
                      <span className="ml-2 font-medium">{staffProfile.staffId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">施設:</span>
                      <span className="ml-2 font-medium">{staffProfile.facility}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">部門:</span>
                      <span className="ml-2 font-medium">{staffProfile.department}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">職種:</span>
                      <span className="ml-2 font-medium">{staffProfile.jobCategory}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  履歴エクスポート
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* サマリーカード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">最新評価</p>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold">{latestYear?.year}年度</p>
                <Badge className={`mt-2 ${getGradeColor(latestYear?.finalGrade || '')}`}>
                  {latestYear?.finalGrade}評価
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">総合スコア</p>
                  {scoreTrend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : scoreTrend < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-2xl font-bold">{latestYear?.totalScore.toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">
                  前年比 {scoreTrend > 0 ? '+' : ''}{scoreTrend.toFixed(1)}点
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">施設内順位</p>
                  {rankTrend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : rankTrend < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-2xl font-bold">
                  {latestYear?.facilityRank}/{latestYear?.facilityTotal}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  前年比 {rankTrend > 0 ? '↑' : rankTrend < 0 ? '↓' : '-'}{Math.abs(rankTrend)}位
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">評価回数</p>
                  <History className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold">{historyData.length}回</p>
                <p className="text-xs text-gray-600 mt-1">
                  {historyData[historyData.length - 1]?.year}年度から
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 詳細タブ */}
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timeline">評価推移</TabsTrigger>
                  <TabsTrigger value="scores">スコア分析</TabsTrigger>
                  <TabsTrigger value="details">詳細履歴</TabsTrigger>
                </TabsList>

                {/* 評価推移 */}
                <TabsContent value="timeline" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">評価グレード推移</h3>
                    <div className="space-y-3">
                      {historyData.map((item, index) => (
                        <div key={item.year} className="flex items-center gap-4">
                          <div className="w-20 text-right font-medium">{item.year}年度</div>
                          <div className="flex-1 flex items-center gap-3">
                            <Badge className={getGradeColor(item.finalGrade)}>
                              {item.finalGrade}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>施設: {item.facilityGrade}</span>
                              <span>/</span>
                              <span>法人: {item.corporateGrade}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{item.totalScore.toFixed(1)}</span>
                            <span className="text-sm text-gray-600 ml-1">点</span>
                          </div>
                          {index < historyData.length - 1 && (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* スコア分析 */}
                <TabsContent value="scores" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">スコア推移</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="技術評価" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="施設貢献" stroke="#82ca9d" strokeWidth={2} />
                        <Line type="monotone" dataKey="法人貢献" stroke="#ffc658" strokeWidth={2} />
                        <Line type="monotone" dataKey="総合スコア" stroke="#ff7c7c" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">順位推移</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={rankChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis reversed />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="施設内順位" fill="#8884d8" />
                        <Bar dataKey="法人内順位" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                {/* 詳細履歴 */}
                <TabsContent value="details" className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">年度</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">技術評価</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">施設貢献</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">法人貢献</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">総合</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">施設内順位</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">法人内順位</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">最終評価</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.map(item => (
                          <tr key={item.year} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">{item.year}</td>
                            <td className="px-4 py-3 text-sm text-center">{item.technicalScore.toFixed(1)}</td>
                            <td className="px-4 py-3 text-sm text-center">{item.facilityContribution.toFixed(1)}</td>
                            <td className="px-4 py-3 text-sm text-center">{item.corporateContribution.toFixed(1)}</td>
                            <td className="px-4 py-3 text-sm text-center font-semibold">{item.totalScore.toFixed(1)}</td>
                            <td className="px-4 py-3 text-sm text-center">
                              {item.facilityRank}/{item.facilityTotal}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              {item.corporateRank}/{item.corporateTotal}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <Badge className={getGradeColor(item.finalGrade)}>
                                {item.finalGrade}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}