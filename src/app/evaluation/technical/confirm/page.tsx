'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileText,
  Download,
  Lock,
  Unlock,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Target
} from 'lucide-react';
import Link from 'next/link';
import EvaluationNavigation from '@/components/evaluation/EvaluationNavigation';
import DashboardButton from '@/components/DashboardButton';

interface EvaluationSummary {
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  selfScore: number;
  supervisorScore: number;
  totalScore: number;
  grade: string;
  status: 'draft' | 'pending_approval' | 'confirmed' | 'locked';
  evaluationDate: string;
  supervisorName: string;
}

export default function TechnicalConfirmPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isConfirming, setIsConfirming] = useState(false);

  const mockEvaluations: EvaluationSummary[] = [
    {
      staffId: '001',
      staffName: '山田太郎',
      department: '看護部',
      position: '看護師',
      selfScore: 42.5,
      supervisorScore: 44.0,
      totalScore: 43.4,
      grade: 'A',
      status: 'pending_approval',
      evaluationDate: '2025-03-10',
      supervisorName: '佐藤部長'
    },
    {
      staffId: '002',
      staffName: '佐藤花子',
      department: '看護部',
      position: '主任看護師',
      selfScore: 45.0,
      supervisorScore: 46.5,
      totalScore: 45.9,
      grade: 'S',
      status: 'confirmed',
      evaluationDate: '2025-03-08',
      supervisorName: '佐藤部長'
    },
    {
      staffId: '003',
      staffName: '田中一郎',
      department: 'リハビリ部',
      position: '理学療法士',
      selfScore: 38.0,
      supervisorScore: 40.0,
      totalScore: 39.2,
      grade: 'B',
      status: 'draft',
      evaluationDate: '2025-03-12',
      supervisorName: '高橋部長'
    },
    {
      staffId: '005',
      staffName: '高橋健太',
      department: '検査部',
      position: '臨床検査技師',
      selfScore: 41.0,
      supervisorScore: 42.0,
      totalScore: 41.6,
      grade: 'A',
      status: 'locked',
      evaluationDate: '2025-03-05',
      supervisorName: '田中部長'
    }
  ];

  const departments = ['all', '看護部', 'リハビリ部', '検査部', '薬剤部'];
  const statuses = [
    { value: 'all', label: '全て' },
    { value: 'draft', label: '下書き' },
    { value: 'pending_approval', label: '承認待ち' },
    { value: 'confirmed', label: '確定済み' },
    { value: 'locked', label: 'ロック済み' }
  ];

  const filteredEvaluations = mockEvaluations.filter(eval => {
    const matchesDepartment = selectedDepartment === 'all' || eval.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || eval.status === selectedStatus;
    return matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">下書き</Badge>;
      case 'pending_approval':
        return <Badge variant="secondary">承認待ち</Badge>;
      case 'confirmed':
        return <Badge variant="default">確定済み</Badge>;
      case 'locked':
        return <Badge variant="destructive">ロック済み</Badge>;
      default:
        return null;
    }
  };

  const getGradeBadge = (grade: string) => {
    const variant = grade === 'S' ? 'destructive' : 
                   grade === 'A' ? 'default' : 
                   grade === 'B' ? 'secondary' : 'outline';
    return <Badge variant={variant} className="text-lg px-3 py-1">{grade}</Badge>;
  };

  const handleConfirmAll = async () => {
    const pendingCount = filteredEvaluations.filter(e => e.status === 'pending_approval').length;
    if (pendingCount === 0) {
      alert('承認待ちの評価がありません');
      return;
    }

    if (!window.confirm(`${pendingCount}件の評価を一括確定します。よろしいですか？`)) {
      return;
    }

    setIsConfirming(true);
    try {
      console.log('一括確定処理');
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${pendingCount}件の評価を確定しました`);
    } catch (error) {
      console.error('確定処理エラー:', error);
      alert('確定処理に失敗しました');
    } finally {
      setIsConfirming(false);
    }
  };

  const stats = {
    total: mockEvaluations.length,
    completed: mockEvaluations.filter(e => e.status === 'confirmed' || e.status === 'locked').length,
    pending: mockEvaluations.filter(e => e.status === 'pending_approval').length,
    draft: mockEvaluations.filter(e => e.status === 'draft').length,
    averageScore: mockEvaluations.reduce((sum, e) => sum + e.totalScore, 0) / mockEvaluations.length
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <EvaluationNavigation />
      
      <div className="mb-6">
        <Link href="/evaluation/technical" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          技術評価フローへ戻る
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">評価確定</h1>
        <p className="text-gray-600">
          技術評価の確認と確定処理を行います
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">評価対象</p>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-gray-500">名</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">確定済み</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-gray-500">名</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">承認待ち</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500">名</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">下書き</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              <p className="text-xs text-gray-500">名</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">平均点</p>
              <p className="text-2xl font-bold text-blue-600">{stats.averageScore.toFixed(1)}</p>
              <p className="text-xs text-gray-500">/ 50点</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="mb-6">
        <TabsList>
          <TabsTrigger value="list">評価一覧</TabsTrigger>
          <TabsTrigger value="summary">集計サマリー</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>評価一覧</CardTitle>
                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 border rounded-md text-sm"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? '全部署' : dept}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-3 py-2 border rounded-md text-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">職員名</th>
                      <th className="text-left py-2 px-4">部署/役職</th>
                      <th className="text-center py-2 px-4">自己評価</th>
                      <th className="text-center py-2 px-4">上司評価</th>
                      <th className="text-center py-2 px-4">総合点</th>
                      <th className="text-center py-2 px-4">グレード</th>
                      <th className="text-center py-2 px-4">ステータス</th>
                      <th className="text-center py-2 px-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvaluations.map((eval) => (
                      <tr key={eval.staffId} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium">{eval.staffName}</p>
                          <p className="text-xs text-gray-500">ID: {eval.staffId}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{eval.department}</p>
                          <p className="text-xs text-gray-500">{eval.position}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <p className="font-medium">{eval.selfScore.toFixed(1)}</p>
                          <p className="text-xs text-gray-500">40%</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <p className="font-medium">{eval.supervisorScore.toFixed(1)}</p>
                          <p className="text-xs text-gray-500">60%</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <p className="text-lg font-bold text-blue-600">{eval.totalScore.toFixed(1)}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getGradeBadge(eval.grade)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(eval.status)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {eval.status === 'pending_approval' && (
                            <Button size="sm" variant="default">
                              確定
                            </Button>
                          )}
                          {eval.status === 'draft' && (
                            <Button size="sm" variant="outline">
                              編集
                            </Button>
                          )}
                          {eval.status === 'confirmed' && (
                            <Button size="sm" variant="outline">
                              <Lock className="h-4 w-4" />
                            </Button>
                          )}
                          {eval.status === 'locked' && (
                            <Unlock className="h-4 w-4 text-gray-400" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  CSVエクスポート
                </Button>
                <Button 
                  onClick={handleConfirmAll}
                  disabled={isConfirming || stats.pending === 0}
                >
                  {isConfirming ? '処理中...' : `承認待ち${stats.pending}件を一括確定`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  部署別集計
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['看護部', 'リハビリ部', '検査部'].map(dept => {
                    const deptEvals = mockEvaluations.filter(e => e.department === dept);
                    const avgScore = deptEvals.length > 0 
                      ? deptEvals.reduce((sum, e) => sum + e.totalScore, 0) / deptEvals.length 
                      : 0;
                    
                    return (
                      <div key={dept} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{dept}</p>
                          <p className="text-sm text-gray-500">{deptEvals.length}名</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{avgScore.toFixed(1)}点</p>
                          <p className="text-xs text-gray-500">平均</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  グレード分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['S', 'A', 'B', 'C', 'D'].map(grade => {
                    const count = mockEvaluations.filter(e => e.grade === grade).length;
                    const percentage = (count / mockEvaluations.length) * 100;
                    
                    return (
                      <div key={grade} className="flex items-center gap-3">
                        {getGradeBadge(grade)}
                        <div className="flex-1">
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {count}名
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-6">
            <TrendingUp className="h-4 w-4" />
            <AlertTitle>評価傾向分析</AlertTitle>
            <AlertDescription className="mt-2">
              <p>• 全体平均: {stats.averageScore.toFixed(1)}点（前年比 +2.3点）</p>
              <p>• S評価割合: 25%（目標: 10-20%）</p>
              <p>• 部署間のばらつきは適正範囲内です</p>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>確定処理について</AlertTitle>
        <AlertDescription className="mt-2 space-y-1">
          <p>• 確定後は評価内容の変更はできません</p>
          <p>• すべての評価が確定したら、統合評価処理へ進みます</p>
          <p>• ロック済みの評価は人事部の承認が完了しています</p>
        </AlertDescription>
      </Alert>
      
      <DashboardButton />
    </div>
  );
}