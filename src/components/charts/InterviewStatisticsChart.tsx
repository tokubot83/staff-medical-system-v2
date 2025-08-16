'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, Calendar, Activity, FileSpreadsheet } from 'lucide-react';
import { exportInterviewStatistics, exportDetailedInterviewStatistics } from '@/utils/excelExport';

// Chart.js の登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface InterviewStatisticsProps {
  data?: any;
  onExport?: () => void;
}

export default function InterviewStatisticsChart({ data, onExport }: InterviewStatisticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [chartType, setChartType] = useState('overview');

  const handleExcelExport = () => {
    exportInterviewStatistics();
  };

  const handleDetailedExcelExport = () => {
    exportDetailedInterviewStatistics(selectedPeriod, selectedDepartment);
  };

  // 月次実施率データ
  const monthlyData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    datasets: [
      {
        label: '定期面談',
        data: [85, 88, 92, 90, 87, 91, 89, 93, 95, 92, 90, 94],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: '特別面談',
        data: [100, 95, 100, 100, 90, 95, 100, 100, 95, 100, 100, 95],
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.5)',
        tension: 0.4
      },
      {
        label: 'サポート面談',
        data: [70, 75, 80, 78, 82, 85, 83, 87, 88, 85, 83, 86],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      }
    ]
  };

  // 部署別実施状況
  const departmentData = {
    labels: ['内科病棟', '外科病棟', '救急科', '地域包括ケア', '緩和ケア', '外来', 'リハビリ', '医事課'],
    datasets: [
      {
        label: '実施済み',
        data: [45, 38, 22, 35, 28, 42, 30, 25],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: '予定',
        data: [15, 12, 8, 10, 7, 8, 10, 5],
        backgroundColor: 'rgba(251, 146, 60, 0.8)'
      },
      {
        label: '未実施',
        data: [5, 3, 2, 3, 2, 4, 3, 2],
        backgroundColor: 'rgba(239, 68, 68, 0.8)'
      }
    ]
  };

  // 面談タイプ別割合
  const typeDistribution = {
    labels: ['新入職員月次', '一般年次', '管理職半年', '退職', '復職', 'キャリア', '職場環境', '個別相談'],
    datasets: [
      {
        data: [120, 180, 45, 12, 8, 35, 28, 42],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ]
      }
    ]
  };

  // 職種別実施率
  const positionData = {
    labels: ['看護師', '准看護師', '看護補助者', '医事課', 'リハビリ', '管理職'],
    datasets: [
      {
        label: '実施率(%)',
        data: [92, 88, 85, 90, 87, 95],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }
    ]
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '月次面談実施率推移'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '部署別面談実施状況'
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: '面談タイプ別実施割合'
      }
    }
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: '職種別実施率'
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">面談統計ダッシュボード</h2>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">月次</SelectItem>
              <SelectItem value="quarter">四半期</SelectItem>
              <SelectItem value="year">年次</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部署</SelectItem>
              <SelectItem value="internal">内科病棟</SelectItem>
              <SelectItem value="surgery">外科病棟</SelectItem>
              <SelectItem value="emergency">救急科</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExcelExport} variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel出力
          </Button>
          <Button onClick={handleDetailedExcelExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            詳細Excel
          </Button>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">総面談数</CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-xs text-green-600">+12% 前月比</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">実施率</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <div className="text-xs text-green-600">+3.2% 前月比</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">対象職員数</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <div className="text-xs text-gray-600">全職員</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">今月予定</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <div className="text-xs text-orange-600">残り12件</div>
          </CardContent>
        </Card>
      </div>

      {/* チャートエリア */}
      <Tabs value={chartType} onValueChange={setChartType}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">実施率推移</TabsTrigger>
          <TabsTrigger value="department">部署別</TabsTrigger>
          <TabsTrigger value="type">タイプ別</TabsTrigger>
          <TabsTrigger value="position">職種別</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <div style={{ height: '400px' }}>
                <Line data={monthlyData} options={lineOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department">
          <Card>
            <CardContent className="pt-6">
              <div style={{ height: '400px' }}>
                <Bar data={departmentData} options={barOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="type">
          <Card>
            <CardContent className="pt-6">
              <div style={{ height: '400px' }}>
                <Pie data={typeDistribution} options={pieOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="position">
          <Card>
            <CardContent className="pt-6">
              <div style={{ height: '400px' }}>
                <Doughnut data={positionData} options={doughnutOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 詳細テーブル */}
      <Card>
        <CardHeader>
          <CardTitle>最近の面談記録</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">日付</th>
                  <th className="text-left p-2">職員名</th>
                  <th className="text-left p-2">部署</th>
                  <th className="text-left p-2">種別</th>
                  <th className="text-left p-2">実施者</th>
                  <th className="text-left p-2">ステータス</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">2024-03-15</td>
                  <td className="p-2">山田太郎</td>
                  <td className="p-2">内科病棟</td>
                  <td className="p-2">年次面談</td>
                  <td className="p-2">田中師長</td>
                  <td className="p-2">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">完了</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">2024-03-14</td>
                  <td className="p-2">佐藤花子</td>
                  <td className="p-2">外科病棟</td>
                  <td className="p-2">新入職員</td>
                  <td className="p-2">鈴木主任</td>
                  <td className="p-2">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">完了</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">2024-03-13</td>
                  <td className="p-2">高橋一郎</td>
                  <td className="p-2">救急科</td>
                  <td className="p-2">キャリア</td>
                  <td className="p-2">伊藤部長</td>
                  <td className="p-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">実施中</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}