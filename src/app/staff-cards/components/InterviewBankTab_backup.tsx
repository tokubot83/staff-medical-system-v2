'use client';

/**
 * 職員カルテ - 面談バンクタブコンポーネント
 * 面談バンクシステムの結果を表示し、履歴管理を行う
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  Award,
  Target,
  Users,
  Briefcase,
  Heart,
  Lightbulb,
  DollarSign,
  Zap,
  Shield
} from 'lucide-react';

import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { BankInterviewResult, MotivationType, BankQuestion } from '@/lib/interview-bank/types';
import { questionBank } from '@/lib/interview-bank/database/question-bank';
import { supportQuestions, supportQuestionsByCategory } from '@/lib/interview-bank/database/support-questions';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface InterviewBankTabProps {
  staffId: string;
  staffName?: string;
  department?: string;
  position?: string;
}

// 動機タイプのアイコンマッピング
const motivationIcons: Record<MotivationType, React.ReactNode> = {
  growth: <TrendingUp className="h-4 w-4" />,
  recognition: <Award className="h-4 w-4" />,
  stability: <Shield className="h-4 w-4" />,
  teamwork: <Users className="h-4 w-4" />,
  efficiency: <Zap className="h-4 w-4" />,
  compensation: <DollarSign className="h-4 w-4" />,
  creativity: <Lightbulb className="h-4 w-4" />
};

// 動機タイプの説明
const motivationDescriptions: Record<MotivationType, string> = {
  growth: '成長志向 - スキルアップと自己実現を重視',
  recognition: '承認欲求 - 評価と認知を求める',
  stability: '安定志向 - 安心できる環境を重視',
  teamwork: 'チーム重視 - 協力と調和を大切にする',
  efficiency: '効率重視 - 生産性と成果を追求',
  compensation: '報酬重視 - 待遇と評価を重要視',
  creativity: '創造性重視 - 新しいアイデアと革新を求める'
};

export default function InterviewBankTab({
  staffId,
  staffName = '職員',
  department = '',
  position = ''
}: InterviewBankTabProps) {
  const [loading, setLoading] = useState(true);
  const [bankResults, setBankResults] = useState<BankInterviewResult[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'regular' | 'special' | 'support'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'3months' | '6months' | '1year' | 'all'>('6months');
  const [staffProfile, setStaffProfile] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [nextRecommendation, setNextRecommendation] = useState<any>(null);

  const bankService = InterviewBankService.getInstance();

  useEffect(() => {
    loadInterviewData();
  }, [staffId, filterType, selectedPeriod]);

  const loadInterviewData = async () => {
    setLoading(true);
    try {
      // 面談履歴を取得
      const history = await bankService.getStaffInterviewHistory(staffId, {
        type: filterType === 'all' ? undefined : filterType as any,
        limit: 50
      });
      setBankResults(history.results);

      // 職員プロファイルを取得
      const repository = (bankService as any).repository;
      const profile = await repository.getStaffProfile(staffId);
      setStaffProfile(profile);

      // 統計データを取得
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case '3months':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setFullYear(startDate.getFullYear() - 10);
      }

      const stats = await repository.getStatistics({
        startDate,
        endDate,
        departmentId: department
      });
      setStatistics(stats);

      // 次回推奨面談を取得
      const recommendation = await bankService.getRecommendedNextInterview(staffId);
      setNextRecommendation(recommendation);

    } catch (error) {
      console.error('Failed to load interview data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 動機タイプ表示コンポーネント
  const MotivationTypeDisplay = () => {
    if (!staffProfile?.motivationType) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              動機タイプ診断
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              まだ診断が完了していません。面談を通じて動機タイプが判定されます。
            </p>
          </CardContent>
        </Card>
      );
    }

    const type = staffProfile.motivationType;
    const confidence = staffProfile.motivationConfidence || 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            動機タイプ診断結果
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              {motivationIcons[type]}
            </div>
            <div>
              <p className="font-semibold text-lg">
                {motivationDescriptions[type].split(' - ')[0]}
              </p>
              <p className="text-sm text-muted-foreground">
                {motivationDescriptions[type].split(' - ')[1]}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>診断精度</span>
              <span>{confidence.toFixed(0)}%</span>
            </div>
            <Progress value={confidence} className="h-2" />
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              最終更新: {staffProfile.updatedAt 
                ? formatDistanceToNow(new Date(staffProfile.updatedAt), { 
                    addSuffix: true, 
                    locale: ja 
                  })
                : '不明'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 面談履歴リストコンポーネント
  const InterviewResultsList = () => {
    if (bankResults.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              面談履歴がありません
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {bankResults.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(result.conductedAt).toLocaleDateString('ja-JP')}
                    </span>
                    <Badge variant={
                      result.interviewType === 'regular' ? 'default' :
                      result.interviewType === 'special' ? 'destructive' : 'secondary'
                    }>
                      {result.interviewType === 'regular' ? '定期面談' :
                       result.interviewType === 'special' ? '特別面談' : 'サポート面談'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {result.duration}分
                    </span>
                    <span>
                      完了率: {result.completionRate?.toFixed(0) || 0}%
                    </span>
                    <span>
                      回答数: {result.responses?.length || 0}問
                    </span>
                  </div>

                  {result.summary && (
                    <p className="text-sm mt-2">{result.summary}</p>
                  )}

                  {result.keyPoints && result.keyPoints.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold mb-1">キーポイント:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {result.keyPoints.slice(0, 3).map((point, index) => (
                          <li key={index}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge variant={result.status === 'completed' ? 'default' : 'outline'}>
                    {result.status === 'completed' ? '完了' : '実施中'}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <FileText className="h-4 w-4 mr-1" />
                    詳細
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // スキル進捗チャートコンポーネント
  const SkillProgressChart = () => {
    // ダミーデータ（実際はbankResultsから集計）
    const skillData = [
      { skill: '専門知識', current: 75, target: 90 },
      { skill: 'コミュニケーション', current: 85, target: 85 },
      { skill: 'リーダーシップ', current: 60, target: 80 },
      { skill: '問題解決', current: 70, target: 85 },
      { skill: 'チームワーク', current: 90, target: 90 }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            スキル評価推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="現在"
                dataKey="current"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Radar
                name="目標"
                dataKey="target"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // 面談頻度チャート
  const InterviewFrequencyChart = () => {
    // 月別の面談回数を集計（ダミーデータ）
    const monthlyData = [
      { month: '1月', count: 2 },
      { month: '2月', count: 1 },
      { month: '3月', count: 3 },
      { month: '4月', count: 2 },
      { month: '5月', count: 1 },
      { month: '6月', count: 2 }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            面談実施頻度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // 次回推奨面談カード
  const NextRecommendationCard = () => {
    if (!nextRecommendation) return null;

    return (
      <Card className={`border-2 ${
        nextRecommendation.priority === 'high' ? 'border-red-500' :
        nextRecommendation.priority === 'medium' ? 'border-yellow-500' :
        'border-green-500'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            次回推奨面談
          </CardTitle>
          <CardDescription>
            {nextRecommendation.reason}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">推奨日</span>
              <span className="font-medium">
                {new Date(nextRecommendation.recommendedDate).toLocaleDateString('ja-JP')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">面談タイプ</span>
              <Badge>
                {nextRecommendation.type === 'regular' ? '定期面談' :
                 nextRecommendation.type === 'special' ? '特別面談' : 'サポート面談'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">優先度</span>
              <Badge variant={
                nextRecommendation.priority === 'high' ? 'destructive' :
                nextRecommendation.priority === 'medium' ? 'default' : 'secondary'
              }>
                {nextRecommendation.priority === 'high' ? '高' :
                 nextRecommendation.priority === 'medium' ? '中' : '低'}
              </Badge>
            </div>
            <Button className="w-full mt-4">
              面談を予約
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{staffName}さんの面談バンク</h2>
          <p className="text-muted-foreground">
            {department} {position && `/ ${position}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3ヶ月</SelectItem>
              <SelectItem value="6months">6ヶ月</SelectItem>
              <SelectItem value="1year">1年</SelectItem>
              <SelectItem value="all">全期間</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            新規面談を開始
          </Button>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">総面談回数</p>
                <p className="text-2xl font-bold">{statistics?.totalCount || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">完了率</p>
                <p className="text-2xl font-bold">
                  {statistics?.averageCompletionRate?.toFixed(0) || 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均時間</p>
                <p className="text-2xl font-bold">
                  {statistics?.averageDuration?.toFixed(0) || 0}分
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">完了数</p>
                <p className="text-2xl font-bold">{statistics?.completedCount || 0}</p>
              </div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="history" className="space-y-4">
            <TabsList>
              <TabsTrigger value="history">面談履歴</TabsTrigger>
              <TabsTrigger value="analytics">分析</TabsTrigger>
              <TabsTrigger value="skills">スキル評価</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">面談履歴</h3>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="regular">定期面談</SelectItem>
                    <SelectItem value="special">特別面談</SelectItem>
                    <SelectItem value="support">サポート面談</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <InterviewResultsList />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <InterviewFrequencyChart />
              <Card>
                <CardHeader>
                  <CardTitle>課題分析</CardTitle>
                </CardHeader>
                <CardContent>
                  {statistics?.topChallenges && statistics.topChallenges.length > 0 ? (
                    <div className="space-y-3">
                      {statistics.topChallenges.map((challenge: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{challenge.category}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={challenge.percentage} className="w-24 h-2" />
                            <span className="text-sm text-muted-foreground">
                              {challenge.percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">データがありません</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <SkillProgressChart />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <NextRecommendationCard />
          <MotivationTypeDisplay />
        </div>
      </div>
    </div>
  );
}