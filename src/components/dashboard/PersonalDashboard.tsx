'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';
import EvaluationHistory from './EvaluationHistory';
import TrainingStatus from './TrainingStatus';
import NextEvaluationTimeline from './NextEvaluationTimeline';

interface PersonalDashboardProps {
  employeeId?: string;
  employeeName?: string;
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ 
  employeeId = 'E001',
  employeeName = '山田 太郎'
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // サンプル個人データ
  const personalData = {
    employeeId: employeeId,
    name: employeeName,
    department: '看護部',
    position: '主任看護師',
    joinDate: '2018-04-01',
    currentGrade: 'B',
    currentScore: 72.5,
    previousGrade: 'B',
    previousScore: 70.2,
    trend: 'up' as const,
    trendValue: 2.3,
    technicalScore: 38,
    contributionScore: 34.5,
    nextEvaluationDate: '2025-12-31',
    daysUntilEvaluation: 141,
    completedTrainings: 8,
    requiredTrainings: 10,
    rank: 142,
    totalEmployees: 450
  };

  const getGradeColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      'S': 'bg-green-100 text-green-800 border-green-300',
      'A': 'bg-blue-100 text-blue-800 border-blue-300',
      'B': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'C': 'bg-orange-100 text-orange-800 border-orange-300',
      'D': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const percentile = Math.round((1 - personalData.rank / personalData.totalEmployees) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{personalData.name}</h1>
              <p className="text-blue-100">{personalData.department} / {personalData.position}</p>
              <p className="text-sm text-blue-200 mt-1">社員番号: {personalData.employeeId}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">現在の評価グレード</p>
            <div className={`inline-block px-4 py-2 rounded-lg text-2xl font-bold mt-1 ${getGradeColor(personalData.currentGrade)}`}>
              {personalData.currentGrade}
            </div>
          </div>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                総合評価点
              </CardTitle>
              <Trophy className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalData.currentScore}点</div>
            <p className={`text-xs mt-1 ${personalData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              前期比 {personalData.trend === 'up' ? '+' : ''}{personalData.trendValue}点
            </p>
            <div className="mt-2 text-xs text-gray-500">
              技術: {personalData.technicalScore}点 / 貢献: {personalData.contributionScore}点
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                社内順位
              </CardTitle>
              <Award className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalData.rank}位</div>
            <p className="text-xs text-gray-500 mt-1">
              全{personalData.totalEmployees}名中
            </p>
            <div className="mt-2">
              <Badge variant="outline">上位{100 - percentile}%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                研修進捗
              </CardTitle>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personalData.completedTrainings}/{personalData.requiredTrainings}
            </div>
            <p className="text-xs text-gray-500 mt-1">必須研修完了</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(personalData.completedTrainings / personalData.requiredTrainings) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                次回評価
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalData.daysUntilEvaluation}日後</div>
            <p className="text-xs text-gray-500 mt-1">
              {personalData.nextEvaluationDate}
            </p>
            <Button size="sm" variant="outline" className="mt-2 w-full">
              準備開始
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* アラート */}
      {personalData.completedTrainings < personalData.requiredTrainings && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span className="font-medium text-amber-900">
              未完了の必須研修があります
            </span>
            <Badge variant="secondary" className="ml-auto">
              残り{personalData.requiredTrainings - personalData.completedTrainings}件
            </Badge>
          </div>
          <p className="text-sm text-amber-700 mt-2">
            次回評価までに全ての必須研修を完了してください。
          </p>
        </div>
      )}

      {/* メインコンテンツ */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="history">評価履歴</TabsTrigger>
          <TabsTrigger value="training">研修状況</TabsTrigger>
          <TabsTrigger value="timeline">スケジュール</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>評価サマリー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">技術評価</span>
                      <span className="text-sm font-bold">{personalData.technicalScore}/50点</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(personalData.technicalScore / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">組織貢献度</span>
                      <span className="text-sm font-bold">{personalData.contributionScore}/50点</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(personalData.contributionScore / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>今期の目標</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">専門スキル向上</p>
                      <p className="text-xs text-gray-500">認定看護師資格取得に向けた学習</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">チーム貢献</p>
                      <p className="text-xs text-gray-500">新人教育プログラムのリーダー</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">業務改善</p>
                      <p className="text-xs text-gray-500">看護記録システムの効率化提案</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <EvaluationHistory employeeId={personalData.employeeId} />
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <TrainingStatus employeeId={personalData.employeeId} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <NextEvaluationTimeline employeeId={personalData.employeeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalDashboard;