'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';

interface EvaluationProgressProps {
  facilityId: string;
  period: string;
  compact?: boolean;
}

interface DepartmentProgress {
  id: string;
  name: string;
  totalEmployees: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  notStarted: number;
  averageScore: number;
  deadline: string;
}

const EvaluationProgress: React.FC<EvaluationProgressProps> = ({ 
  facilityId, 
  period,
  compact = false 
}) => {
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // サンプルデータ
  const departmentData: DepartmentProgress[] = [
    {
      id: 'nursing',
      name: '看護部',
      totalEmployees: 120,
      completedEvaluations: 95,
      pendingEvaluations: 20,
      notStarted: 5,
      averageScore: 73.2,
      deadline: '2025-08-31'
    },
    {
      id: 'medical',
      name: '医療技術部',
      totalEmployees: 45,
      completedEvaluations: 38,
      pendingEvaluations: 5,
      notStarted: 2,
      averageScore: 75.8,
      deadline: '2025-08-31'
    },
    {
      id: 'rehabilitation',
      name: 'リハビリテーション部',
      totalEmployees: 35,
      completedEvaluations: 30,
      pendingEvaluations: 3,
      notStarted: 2,
      averageScore: 74.5,
      deadline: '2025-08-31'
    },
    {
      id: 'administration',
      name: '事務部',
      totalEmployees: 25,
      completedEvaluations: 18,
      pendingEvaluations: 5,
      notStarted: 2,
      averageScore: 71.0,
      deadline: '2025-08-31'
    },
    {
      id: 'welfare',
      name: '福祉部',
      totalEmployees: 55,
      completedEvaluations: 42,
      pendingEvaluations: 10,
      notStarted: 3,
      averageScore: 72.3,
      deadline: '2025-08-31'
    }
  ];

  const toggleDepartmentExpansion = (deptId: string) => {
    setExpandedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const toggleDepartmentSelection = (deptId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const sendReminder = (deptId?: string) => {
    const target = deptId ? `${departmentData.find(d => d.id === deptId)?.name}` : '選択した部門';
    alert(`${target}の未完了者にリマインダーを送信しました`);
  };

  const calculateProgress = (dept: DepartmentProgress) => {
    return Math.round((dept.completedEvaluations / dept.totalEmployees) * 100);
  };

  const getStatusBadge = (dept: DepartmentProgress) => {
    const progress = calculateProgress(dept);
    if (progress === 100) {
      return <Badge className="bg-green-100 text-green-800">完了</Badge>;
    } else if (progress >= 80) {
      return <Badge className="bg-blue-100 text-blue-800">順調</Badge>;
    } else if (progress >= 50) {
      return <Badge className="bg-yellow-100 text-yellow-800">進行中</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">要対応</Badge>;
    }
  };

  const totalStats = departmentData.reduce((acc, dept) => ({
    totalEmployees: acc.totalEmployees + dept.totalEmployees,
    completedEvaluations: acc.completedEvaluations + dept.completedEvaluations,
    pendingEvaluations: acc.pendingEvaluations + dept.pendingEvaluations,
    notStarted: acc.notStarted + dept.notStarted
  }), { totalEmployees: 0, completedEvaluations: 0, pendingEvaluations: 0, notStarted: 0 });

  const overallProgress = Math.round((totalStats.completedEvaluations / totalStats.totalEmployees) * 100);

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>評価進捗サマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">全体進捗</span>
                <span className="text-sm font-bold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{totalStats.completedEvaluations}</p>
                <p className="text-xs text-gray-500">完了</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{totalStats.pendingEvaluations}</p>
                <p className="text-xs text-gray-500">進行中</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{totalStats.notStarted}</p>
                <p className="text-xs text-gray-500">未着手</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 全体統計 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>評価進捗詳細</CardTitle>
            <div className="flex gap-2">
              {selectedDepartments.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => sendReminder()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  選択部門にリマインダー送信
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold">{totalStats.totalEmployees}</p>
              <p className="text-sm text-gray-500">対象職員数</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{totalStats.completedEvaluations}</p>
              <p className="text-sm text-gray-500">評価完了</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold text-yellow-600">{totalStats.pendingEvaluations}</p>
              <p className="text-sm text-gray-500">進行中</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600">{totalStats.notStarted}</p>
              <p className="text-sm text-gray-500">未着手</p>
            </div>
          </div>

          {/* 部門別進捗 */}
          <div className="space-y-3">
            {departmentData.map(dept => {
              const progress = calculateProgress(dept);
              const isExpanded = expandedDepartments.includes(dept.id);
              const isSelected = selectedDepartments.includes(dept.id);

              return (
                <div 
                  key={dept.id} 
                  className={`border rounded-lg transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleDepartmentSelection(dept.id)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <h3 className="font-semibold">{dept.name}</h3>
                        {getStatusBadge(dept)}
                      </div>
                      <button
                        onClick={() => toggleDepartmentExpansion(dept.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">進捗率</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{dept.completedEvaluations}/{dept.totalEmployees}名完了</span>
                        <span>平均: {dept.averageScore}点</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">完了</p>
                            <p className="font-semibold text-green-600">
                              {dept.completedEvaluations}名
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">進行中</p>
                            <p className="font-semibold text-yellow-600">
                              {dept.pendingEvaluations}名
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">未着手</p>
                            <p className="font-semibold text-red-600">
                              {dept.notStarted}名
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">期限</p>
                            <p className="font-semibold">{dept.deadline}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sendReminder(dept.id)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            リマインダー送信
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationProgress;