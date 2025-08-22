'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { V3PersonalEvaluation } from '@/types/evaluation-v3';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { AppError, ErrorLevel } from '@/lib/error/AppError';
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

// V3グレード定義
const v3Grades = {
  'S+': { color: '#8B0000', label: 'S+（超優秀）', min: 95 },
  'S': { color: '#FF0000', label: 'S（卓越）', min: 90 },
  'A+': { color: '#FF4500', label: 'A+（優秀+）', min: 85 },
  'A': { color: '#FFA500', label: 'A（優秀）', min: 80 },
  'B': { color: '#32CD32', label: 'B（良好）', min: 70 },
  'C': { color: '#1E90FF', label: 'C（普通）', min: 60 },
  'D': { color: '#808080', label: 'D（要改善）', min: 0 }
}

// V3評価年間スケジュール
const getEvaluationScheduleInfo = () => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  
  const scheduleMap = {
    1: { phase: '年度末評価期間', task: '総合評価・年度総括', status: 'active', nextTask: '評価結果開示（2月）', daysUntil: 30 },
    2: { phase: '評価結果開示', task: '評価結果フィードバック・面談', status: 'active', nextTask: '新年度準備（3月）', daysUntil: 28 },
    3: { phase: '新年度移行期', task: '昇進・昇格発令・新年度準備', status: 'active', nextTask: '前年度フィードバック（4月）', daysUntil: 31 },
    4: { phase: '前年度フィードバック', task: '前年度評価最終フィードバック', status: 'completed', nextTask: '上半期計画策定（5月）', daysUntil: 30 },
    5: { phase: '上半期計画', task: '上半期活動計画策定', status: 'completed', nextTask: '夏季組織貢献評価（6-8月）', daysUntil: 31 },
    6: { phase: '夏季組織貢献評価', task: '夏季組織貢献度評価実施', status: 'active', nextTask: '評価継続中', daysUntil: 30 },
    7: { phase: '夏季組織貢献評価', task: '夏季組織貢献度評価実施', status: 'active', nextTask: '評価継続中', daysUntil: 31 },
    8: { phase: '夏季組織貢献評価', task: '夏季組織貢献度評価実施', status: 'active', nextTask: '下半期準備（9月）', daysUntil: 31 },
    9: { phase: '下半期準備', task: '下半期活動計画策定', status: 'upcoming', nextTask: '技術評価準備（10月）', daysUntil: 30 },
    10: { phase: '技術評価準備', task: '技術評価項目確定・準備', status: 'upcoming', nextTask: '技術評価実施（11月）', daysUntil: 31 },
    11: { phase: '技術評価実施', task: '技術評価（法人統一+施設固有）', status: 'upcoming', nextTask: '冬季組織貢献評価（12-2月）', daysUntil: 30 },
    12: { phase: '冬季組織貢献評価', task: '冬季組織貢献度評価実施', status: 'upcoming', nextTask: '年度末評価（1月）', daysUntil: 31 }
  }
  
  return scheduleMap[currentMonth as keyof typeof scheduleMap] || scheduleMap[1]
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ 
  employeeId = 'E001',
  employeeName = '山田 太郎',
  selectedStaff
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [v3EvaluationData, setV3EvaluationData] = useState<V3PersonalEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  // V3評価データの取得
  useEffect(() => {
    const loadV3EvaluationData = async () => {
      try {
        setIsLoading(true);
        
        // V3評価データ（モック）
        const mockV3Data: V3PersonalEvaluation = {
          id: `eval_${selectedStaff?.id || employeeId}_2024`,
          staffId: selectedStaff?.id || employeeId,
          staffName: selectedStaff?.name || employeeName,
          evaluationPeriod: '2024年度',
          experienceLevel: 'midlevel',
          experienceLabel: '中堅',
          technicalScore: {
            coreItems: 28,    // 30点満点
            facilityItems: 18, // 20点満点
            total: 46         // 50点満点
          },
          contributionScore: {
            facility: 24,     // 25点満点
            corporate: 22,    // 25点満点
            total: 46        // 50点満点
          },
          totalScore: 92,    // 100点満点
          grade: 'S',
          status: 'completed',
          evaluatedAt: new Date('2024-12-15'),
          disclosedAt: new Date('2025-01-10'),
          feedback: 'V3評価システムにおいて優秀な成果を達成。Sグレードに到達し、次期リーダー候補として期待。'
        };

        setV3EvaluationData(mockV3Data);
      } catch (error) {
        const appError = new AppError(
          'V3_EVALUATION_LOAD_FAILED',
          'V3評価データの取得に失敗しました',
          ErrorLevel.ERROR,
          { staffId: selectedStaff?.id || employeeId, error }
        );
        handleError(appError);
      } finally {
        setIsLoading(false);
      }
    };

    loadV3EvaluationData();
  }, [selectedStaff?.id, employeeId, handleError]);

  // 現在の評価スケジュール情報
  const scheduleInfo = getEvaluationScheduleInfo();

  // 職員カルテデータがある場合はそれを使用、なければV3デフォルト値
  const personalData = selectedStaff ? {
    employeeId: selectedStaff.id || 'OH-NS-2021-001',
    name: selectedStaff.name || employeeName,
    department: selectedStaff.department || '3階病棟',
    position: selectedStaff.position || '看護師',
    facility: selectedStaff.facility || '小原病院',
    joinDate: selectedStaff.joinDate || '2021-04-01',
    age: selectedStaff.age || 29,
    // V3評価データ
    currentGrade: v3EvaluationData?.grade || 'A',
    currentScore: v3EvaluationData?.totalScore || 81.5,
    previousGrade: 'A',
    previousScore: 78.5,
    trend: 'up' as const,
    trendValue: 3.0,
    technicalScore: v3EvaluationData?.technicalScore?.total || 42,
    contributionScore: v3EvaluationData?.contributionScore?.total || 39.5,
    experienceLevel: v3EvaluationData?.experienceLabel || '中堅',
    // V3スケジュール連動
    currentPhase: scheduleInfo.phase,
    currentTask: scheduleInfo.task,
    nextTask: scheduleInfo.nextTask,
    daysUntilNext: scheduleInfo.daysUntil,
    nextEvaluationDate: '2025-11-30',
    daysUntilEvaluation: scheduleInfo.daysUntil,
    // 研修・成長関連
    completedTrainings: 9,
    requiredTrainings: 10,
    rank: 85,
    totalEmployees: 450,
    // 詳細データ
    evaluation: selectedStaff.evaluation || 'A',
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
    // V3システム対応デフォルトデータ
    employeeId: employeeId,
    name: employeeName,
    department: '看護部',
    position: '主任看護師',
    facility: '医療法人',
    joinDate: '2018-04-01',
    age: 32,
    // V3評価データ（デフォルト）
    currentGrade: v3EvaluationData?.grade || 'S',
    currentScore: v3EvaluationData?.totalScore || 92,
    previousGrade: 'A',
    previousScore: 86.5,
    trend: 'up' as const,
    trendValue: 5.5,
    technicalScore: v3EvaluationData?.technicalScore?.total || 46,
    contributionScore: v3EvaluationData?.contributionScore?.total || 46,
    experienceLevel: v3EvaluationData?.experienceLabel || '中堅',
    // V3スケジュール連動
    currentPhase: scheduleInfo.phase,
    currentTask: scheduleInfo.task,
    nextTask: scheduleInfo.nextTask,
    daysUntilNext: scheduleInfo.daysUntil,
    nextEvaluationDate: '2025-11-30',
    daysUntilEvaluation: scheduleInfo.daysUntil,
    // 研修・成長関連
    completedTrainings: 8,
    requiredTrainings: 10,
    rank: 142,
    totalEmployees: 450,
    // 詳細データ
    evaluation: 'S',
    healthScore: 85,
    stressIndex: 35,
    engagement: 92,
    skills: [
      { name: '看護技術', level: 92 },
      { name: '患者対応', level: 95 },
      { name: 'チーム連携', level: 90 },
      { name: '記録・報告', level: 88 }
    ],
    qualifications: ['看護師免許', 'BLS資格', '認定看護師（感染管理）'],
    certifications: ['感染対策研修修了', '医療安全研修修了', 'リーダーシップ研修修了']
  };

  // V3グレードに対応した色設定
  const getGradeColor = (grade: string) => {
    const gradeInfo = v3Grades[grade as keyof typeof v3Grades];
    if (gradeInfo) {
      // V3グレードの色を背景色として使用
      const baseColor = gradeInfo.color;
      if (grade.includes('S')) {
        return 'bg-red-100 text-red-800 border-red-300'; // S+, S
      } else if (grade.includes('A')) {
        return 'bg-orange-100 text-orange-800 border-orange-300'; // A+, A
      } else if (grade === 'B') {
        return 'bg-green-100 text-green-800 border-green-300'; // B
      } else if (grade === 'C') {
        return 'bg-blue-100 text-blue-800 border-blue-300'; // C
      } else if (grade === 'D') {
        return 'bg-gray-100 text-gray-800 border-gray-300'; // D
      }
    }
    return 'bg-gray-100 text-gray-800 border-gray-300';
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
                評価スケジュール
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600 mb-1">{personalData.currentPhase}</div>
            <p className="text-sm text-gray-700 mb-2">{personalData.currentTask}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Clock className="h-3 w-3" />
              <span>次: {personalData.nextTask}</span>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              {scheduleInfo.status === 'active' ? '実行中' : scheduleInfo.status === 'completed' ? '完了済み' : '準備中'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* V3スケジュール連動アラート */}
      {scheduleInfo.status === 'active' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              {personalData.currentPhase}が実行中です
            </span>
            <Badge variant="secondary" className="ml-auto">
              {personalData.daysUntilNext}日後に次フェーズ
            </Badge>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            現在のタスク: {personalData.currentTask}
          </p>
        </div>
      )}
      
      {/* 研修アラート */}
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
                    {v3EvaluationData?.feedback ? (
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-600 mb-1">V3評価システム - 最新評価</p>
                        <p className="text-sm">
                          {v3EvaluationData.feedback}
                        </p>
                      </div>
                    ) : (
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm text-gray-600 mb-1">2024年度評価</p>
                        <p className="text-sm">
                          V3評価システムに移行し、技術評価と組織貢献度の両面で優秀な成果を達成。
                        </p>
                      </div>
                    )}
                    <div className="border-l-4 border-purple-500 pl-4">
                      <p className="text-sm text-gray-600 mb-1">現在の評価フェーズ</p>
                      <p className="text-sm">
                        {personalData.currentPhase}: {personalData.currentTask}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        次回: {personalData.nextTask}（{personalData.daysUntilNext}日後）
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