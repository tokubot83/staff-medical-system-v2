'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ChevronRight,
  Bell,
  Target,
  FileText,
  Users
} from 'lucide-react';

interface NextEvaluationTimelineProps {
  employeeId: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'task' | 'reminder' | 'deadline';
  status: 'completed' | 'current' | 'upcoming' | 'overdue';
  category: 'preparation' | 'submission' | 'review' | 'feedback';
  icon?: React.ReactNode;
}

interface PreparationTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const NextEvaluationTimeline: React.FC<NextEvaluationTimelineProps> = ({ employeeId }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'preparation' | 'submission' | 'review' | 'feedback'>('all');

  // 評価スケジュール
  const nextEvaluationDate = new Date('2025-12-31');
  const today = new Date();
  const daysUntilEvaluation = Math.ceil((nextEvaluationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const weeksUntilEvaluation = Math.ceil(daysUntilEvaluation / 7);

  // タイムラインイベント
  const timelineEvents: TimelineEvent[] = [
    {
      id: 'E001',
      date: '2025-10-01',
      title: '評価準備開始',
      description: '自己評価シートの準備を開始',
      type: 'milestone',
      status: 'upcoming',
      category: 'preparation',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'E002',
      date: '2025-10-15',
      title: '必須研修完了期限',
      description: '全ての法定研修を完了する必要があります',
      type: 'deadline',
      status: 'upcoming',
      category: 'preparation',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      id: 'E003',
      date: '2025-11-01',
      title: '自己評価入力開始',
      description: 'システムで自己評価の入力が可能になります',
      type: 'milestone',
      status: 'upcoming',
      category: 'submission',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'E004',
      date: '2025-11-15',
      title: '中間面談',
      description: '上司との中間面談実施',
      type: 'task',
      status: 'upcoming',
      category: 'review',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 'E005',
      date: '2025-11-30',
      title: '自己評価提出期限',
      description: '自己評価を完了して提出',
      type: 'deadline',
      status: 'upcoming',
      category: 'submission',
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: 'E006',
      date: '2025-12-15',
      title: '上司評価完了',
      description: '上司による評価が完了',
      type: 'milestone',
      status: 'upcoming',
      category: 'review',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 'E007',
      date: '2025-12-31',
      title: '最終評価確定',
      description: '評価結果が確定します',
      type: 'deadline',
      status: 'upcoming',
      category: 'feedback',
      icon: <CheckCircle2 className="h-4 w-4" />
    },
    {
      id: 'E008',
      date: '2026-01-15',
      title: 'フィードバック面談',
      description: '評価結果のフィードバック面談',
      type: 'task',
      status: 'upcoming',
      category: 'feedback',
      icon: <Users className="h-4 w-4" />
    }
  ];

  // 準備タスク
  const preparationTasks: PreparationTask[] = [
    {
      id: 'P001',
      title: '業務実績の整理',
      description: '今期の主要な業務実績をまとめる',
      completed: false,
      dueDate: '2025-10-31',
      priority: 'high'
    },
    {
      id: 'P002',
      title: '研修受講証明書の準備',
      description: '受講した研修の証明書を収集',
      completed: false,
      dueDate: '2025-10-15',
      priority: 'high'
    },
    {
      id: 'P003',
      title: '改善提案の文書化',
      description: '業務改善提案を文書にまとめる',
      completed: false,
      dueDate: '2025-11-15',
      priority: 'medium'
    },
    {
      id: 'P004',
      title: '目標達成度の自己分析',
      description: '設定した目標の達成度を分析',
      completed: false,
      dueDate: '2025-11-01',
      priority: 'high'
    },
    {
      id: 'P005',
      title: '360度評価の依頼',
      description: '同僚からの評価を依頼',
      completed: false,
      dueDate: '2025-11-01',
      priority: 'medium'
    }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(event => event.category === selectedCategory);

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100';
      case 'upcoming':
        return 'text-gray-600 bg-gray-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
    }
  };

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone':
        return <Target className="h-4 w-4" />;
      case 'task':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'reminder':
        return <Bell className="h-4 w-4" />;
      case 'deadline':
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: PreparationTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-gray-300 bg-gray-50';
    }
  };

  const completedTasks = preparationTasks.filter(task => task.completed).length;
  const taskCompletionRate = Math.round((completedTasks / preparationTasks.length) * 100);

  return (
    <div className="space-y-6">
      {/* カウントダウン */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle>次回評価まで</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{daysUntilEvaluation}</p>
              <p className="text-sm text-gray-600">日</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">{weeksUntilEvaluation}</p>
              <p className="text-sm text-gray-600">週間</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">評価期間</p>
              <p className="text-sm text-gray-600">2025年下期</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">評価種別</p>
              <p className="text-sm text-gray-600">定期評価</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* タイムライン */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>評価スケジュール</CardTitle>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                >
                  全て
                </Button>
                <Button
                  size="sm"
                  variant={selectedCategory === 'preparation' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('preparation')}
                >
                  準備
                </Button>
                <Button
                  size="sm"
                  variant={selectedCategory === 'submission' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('submission')}
                >
                  提出
                </Button>
                <Button
                  size="sm"
                  variant={selectedCategory === 'review' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('review')}
                >
                  評価
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* タイムラインライン */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* イベント */}
              <div className="space-y-4">
                {filteredEvents.map((event, index) => (
                  <div key={event.id} className="relative flex items-start gap-4">
                    {/* ドット */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${getStatusColor(event.status)}`}>
                      {event.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>
                    
                    {/* コンテンツ */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-500">{event.date}</span>
                        {event.type === 'deadline' && (
                          <Badge variant="destructive" className="text-xs">期限</Badge>
                        )}
                        {event.type === 'milestone' && (
                          <Badge variant="secondary" className="text-xs">マイルストーン</Badge>
                        )}
                      </div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 準備タスク */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>評価準備タスク</CardTitle>
              <Badge variant="outline">{taskCompletionRate}% 完了</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={taskCompletionRate} className="mb-4" />
            
            <div className="space-y-3">
              {preparationTasks.map(task => (
                <div 
                  key={task.id}
                  className={`border-l-4 rounded-lg p-3 ${getPriorityColor(task.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            task.priority === 'high' ? 'text-red-600' : 
                            task.priority === 'medium' ? 'text-yellow-600' : 
                            'text-gray-600'
                          }`}
                        >
                          {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">期限: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">リマインダー設定</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                重要な期限を見逃さないよう、リマインダーを設定しましょう
              </p>
              <Button size="sm" className="w-full">
                リマインダーを設定
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NextEvaluationTimeline;