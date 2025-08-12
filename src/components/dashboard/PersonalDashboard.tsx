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

interface Skill {
  name: string;
  level: number;
}

interface PersonalDashboardProps {
  employeeId?: string;
  employeeName?: string;
  selectedStaff?: any; // 職員カルテから渡されるデータ
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ 
  employeeId = 'E001',
  employeeName = '山田 太郎',
  selectedStaff
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // 職員カルテデータがある場合はそれを使用、なければデフォルト値
  const personalData = selectedStaff ? {
    employeeId: selectedStaff.id || 'OH-NS-2021-001',
    name: selectedStaff.name || employeeName,
    department: selectedStaff.department || '3階病棟',
    position: selectedStaff.position || '看護師',
    facility: selectedStaff.facility || '小原病院',
    joinDate: selectedStaff.joinDate || '2021-04-01',
    age: selectedStaff.age || 29,
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
    totalEmployees: 450,
    evaluation: selectedStaff.evaluation || 'B',
    healthScore: selectedStaff.healthScore || 75,
    stressIndex: selectedStaff.stressIndex || 48,
    engagement: selectedStaff.engagement || 82,
    skills: selectedStaff.skills || [
      { name: '看護技術', level: 85 },
      { name: '患者対応', level: 90 },
      { name: 'チーム連携', level: 88 },
      { name: '記録・報告', level: 82 }
    ],
    qualifications: selectedStaff.qualifications || ['看護師免許', 'BLS資格'],
    certifications: selectedStaff.certifications || ['感染対策研修修了', '医療安全研修修了']
  } : {
    employeeId: employeeId,
    name: employeeName,
    department: '看護部',
    position: '主任看護師',
    facility: '医療法人',
    joinDate: '2018-04-01',
    age: 32,
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
    totalEmployees: 450,
    evaluation: 'B',
    healthScore: 75,
    stressIndex: 48,
    engagement: 82,
    skills: [
      { name: '看護技術', level: 85 },
      { name: '患者対応', level: 90 },
      { name: 'チーム連携', level: 88 },
      { name: '記録・報告', level: 82 }
    ],
    qualifications: ['看護師免許', 'BLS資格'],
    certifications: ['感染対策研修修了', '医療安全研修修了']
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
              <p className="text-blue-100">{personalData.facility} / {personalData.department} / {personalData.position}</p>
              <p className="text-sm text-blue-200 mt-1">
                ID: {personalData.employeeId} | 入職: {personalData.joinDate} | 年齢: {personalData.age}歳
              </p>
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
          <div className="space-y-6">
            {/* 評価とスキル */}
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
                  <CardTitle>スキル・専門性</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {personalData.skills.map((skill: Skill, index: number) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 資格と評価コメント */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>資格・研修</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">保有資格</h4>
                      <div className="flex flex-wrap gap-2">
                        {personalData.qualifications.map((qual: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {qual}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">修了研修</h4>
                      <div className="flex flex-wrap gap-2">
                        {personalData.certifications.map((cert: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-green-50">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>最近の評価コメント</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm text-gray-600 mb-1">2024年上期評価</p>
                      <p className="text-sm">
                        患者様への対応が丁寧で、チーム内でのコミュニケーションも良好。
                        新人指導にも積極的に取り組んでいる。
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="text-sm text-gray-600 mb-1">今後の期待</p>
                      <p className="text-sm">
                        リーダーシップ研修の受講を推奨。次期主任候補として期待。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 今期の目標 */}
            <Card>
              <CardHeader>
                <CardTitle>今期の目標・アクションプラン</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">専門スキル向上</p>
                      <p className="text-xs text-gray-600 mt-1">認定看護師資格取得に向けた学習</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Target className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">チーム貢献</p>
                      <p className="text-xs text-gray-600 mt-1">新人教育プログラムのリーダー</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <Target className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">業務改善</p>
                      <p className="text-xs text-gray-600 mt-1">看護記録システムの効率化提案</p>
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