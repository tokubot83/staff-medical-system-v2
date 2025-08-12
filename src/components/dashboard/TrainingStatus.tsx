'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar,
  BookOpen,
  Award,
  PlayCircle,
  FileText,
  ChevronRight
} from 'lucide-react';

interface TrainingStatusProps {
  employeeId: string;
}

interface Training {
  id: string;
  name: string;
  category: 'legal' | 'skill' | 'management' | 'specialty';
  type: 'mandatory' | 'optional';
  status: 'completed' | 'in_progress' | 'not_started' | 'overdue';
  completedDate?: string;
  deadline?: string;
  duration: number; // 時間
  evaluationImpact: {
    category: string;
    points: number;
  };
  progress?: number; // 進捗率（%）
}

const TrainingStatus: React.FC<TrainingStatusProps> = ({ employeeId }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'legal' | 'skill' | 'management' | 'specialty'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress' | 'not_started' | 'overdue'>('all');

  // サンプル研修データ
  const trainings: Training[] = [
    // 法定研修
    {
      id: 'T001',
      name: '医療安全管理研修',
      category: 'legal',
      type: 'mandatory',
      status: 'completed',
      completedDate: '2025-06-15',
      deadline: '2025-08-31',
      duration: 3,
      evaluationImpact: { category: 'C03: 安全・品質管理', points: 2 }
    },
    {
      id: 'T002',
      name: '感染対策研修',
      category: 'legal',
      type: 'mandatory',
      status: 'completed',
      completedDate: '2025-05-20',
      deadline: '2025-08-31',
      duration: 3,
      evaluationImpact: { category: 'C03: 安全・品質管理', points: 2 }
    },
    {
      id: 'T003',
      name: '身体拘束廃止研修',
      category: 'legal',
      type: 'mandatory',
      status: 'in_progress',
      deadline: '2025-08-31',
      duration: 2,
      evaluationImpact: { category: 'C02: 対人関係・ケア', points: 1.5 },
      progress: 60
    },
    {
      id: 'T004',
      name: '虐待防止研修',
      category: 'legal',
      type: 'mandatory',
      status: 'not_started',
      deadline: '2025-08-31',
      duration: 2,
      evaluationImpact: { category: 'C02: 対人関係・ケア', points: 1.5 }
    },
    {
      id: 'T005',
      name: '個人情報保護研修',
      category: 'legal',
      type: 'mandatory',
      status: 'completed',
      completedDate: '2025-04-10',
      deadline: '2025-08-31',
      duration: 2,
      evaluationImpact: { category: 'C03: 安全・品質管理', points: 1 }
    },
    {
      id: 'T006',
      name: 'BCP（事業継続計画）研修',
      category: 'legal',
      type: 'mandatory',
      status: 'overdue',
      deadline: '2025-07-31',
      duration: 3,
      evaluationImpact: { category: 'C03: 安全・品質管理', points: 1.5 }
    },
    // スキル研修
    {
      id: 'T007',
      name: '看護記録の書き方',
      category: 'skill',
      type: 'mandatory',
      status: 'completed',
      completedDate: '2025-06-01',
      deadline: '2025-12-31',
      duration: 4,
      evaluationImpact: { category: 'C01: 専門技術・スキル', points: 2 }
    },
    {
      id: 'T008',
      name: '認知症ケア実践',
      category: 'skill',
      type: 'optional',
      status: 'in_progress',
      duration: 8,
      evaluationImpact: { category: 'C02: 対人関係・ケア', points: 3 },
      progress: 40
    },
    // マネジメント研修
    {
      id: 'T009',
      name: 'チームリーダー養成',
      category: 'management',
      type: 'optional',
      status: 'completed',
      completedDate: '2025-05-15',
      duration: 12,
      evaluationImpact: { category: '組織貢献度', points: 4 }
    },
    // 専門研修
    {
      id: 'T010',
      name: '褥瘡ケア専門研修',
      category: 'specialty',
      type: 'optional',
      status: 'not_started',
      duration: 6,
      evaluationImpact: { category: 'C01: 専門技術・スキル', points: 3 }
    }
  ];

  const filteredTrainings = trainings.filter(training => {
    if (filterCategory !== 'all' && training.category !== filterCategory) return false;
    if (filterStatus !== 'all' && training.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    totalRequired: trainings.filter(t => t.type === 'mandatory').length,
    completedRequired: trainings.filter(t => t.type === 'mandatory' && t.status === 'completed').length,
    totalOptional: trainings.filter(t => t.type === 'optional').length,
    completedOptional: trainings.filter(t => t.type === 'optional' && t.status === 'completed').length,
    totalHours: trainings.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.duration, 0),
    overdue: trainings.filter(t => t.status === 'overdue').length
  };

  const completionRate = Math.round((stats.completedRequired / stats.totalRequired) * 100);

  const getStatusBadge = (status: Training['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">完了</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">受講中</Badge>;
      case 'not_started':
        return <Badge className="bg-gray-100 text-gray-800">未着手</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">期限超過</Badge>;
    }
  };

  const getStatusIcon = (status: Training['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'not_started':
        return <PlayCircle className="h-5 w-5 text-gray-400" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getCategoryIcon = (category: Training['category']) => {
    switch (category) {
      case 'legal':
        return <FileText className="h-4 w-4" />;
      case 'skill':
        return <BookOpen className="h-4 w-4" />;
      case 'management':
        return <Award className="h-4 w-4" />;
      case 'specialty':
        return <Award className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: Training['category']) => {
    switch (category) {
      case 'legal':
        return '法定研修';
      case 'skill':
        return 'スキル研修';
      case 'management':
        return 'マネジメント';
      case 'specialty':
        return '専門研修';
    }
  };

  return (
    <div className="space-y-6">
      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">必須研修進捗</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedRequired}/{stats.totalRequired}
            </div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">{completionRate}% 完了</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">任意研修</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedOptional}/{stats.totalOptional}
            </div>
            <p className="text-xs text-gray-500 mt-1">完了済み</p>
            <Badge variant="outline" className="mt-2">追加ポイント獲得</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">総学習時間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}時間</div>
            <p className="text-xs text-gray-500 mt-1">今年度累計</p>
          </CardContent>
        </Card>

        <Card className={stats.overdue > 0 ? 'border-red-500' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">要対応</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}件</div>
            <p className="text-xs text-red-500 mt-1">期限超過</p>
            {stats.overdue > 0 && (
              <Button size="sm" variant="destructive" className="mt-2 w-full">
                今すぐ確認
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* フィルター */}
      <Card>
        <CardHeader>
          <CardTitle>研修一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterCategory('all')}
              >
                全て
              </Button>
              <Button
                size="sm"
                variant={filterCategory === 'legal' ? 'default' : 'outline'}
                onClick={() => setFilterCategory('legal')}
              >
                法定研修
              </Button>
              <Button
                size="sm"
                variant={filterCategory === 'skill' ? 'default' : 'outline'}
                onClick={() => setFilterCategory('skill')}
              >
                スキル
              </Button>
              <Button
                size="sm"
                variant={filterCategory === 'management' ? 'default' : 'outline'}
                onClick={() => setFilterCategory('management')}
              >
                マネジメント
              </Button>
              <Button
                size="sm"
                variant={filterCategory === 'specialty' ? 'default' : 'outline'}
                onClick={() => setFilterCategory('specialty')}
              >
                専門
              </Button>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                全状態
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('completed')}
              >
                完了
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('in_progress')}
              >
                受講中
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'not_started' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('not_started')}
              >
                未着手
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'overdue' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('overdue')}
              >
                期限超過
              </Button>
            </div>
          </div>

          {/* 研修リスト */}
          <div className="space-y-3">
            {filteredTrainings.map(training => (
              <div 
                key={training.id} 
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  training.status === 'overdue' ? 'border-red-300 bg-red-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(training.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{training.name}</h3>
                        {getStatusBadge(training.status)}
                        {training.type === 'mandatory' && (
                          <Badge variant="secondary">必須</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(training.category)}
                          {getCategoryLabel(training.category)}
                        </span>
                        <span>{training.duration}時間</span>
                        {training.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            期限: {training.deadline}
                          </span>
                        )}
                        {training.completedDate && (
                          <span className="text-green-600">
                            完了: {training.completedDate}
                          </span>
                        )}
                      </div>
                      {training.progress !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>進捗</span>
                            <span>{training.progress}%</span>
                          </div>
                          <Progress value={training.progress} className="h-2" />
                        </div>
                      )}
                      <div className="mt-2 text-xs text-blue-600">
                        評価影響: {training.evaluationImpact.category} +{training.evaluationImpact.points}点
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingStatus;