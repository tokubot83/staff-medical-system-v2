'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  TrendingUp,
  Target,
  Award,
  AlertCircle,
  ChevronRight,
  Calendar,
  Clock,
  BarChart3,
  UserCheck,
  UserX,
  Brain,
  Heart,
} from 'lucide-react';
import { StaffCareerRecord, SupportLevel } from '@/types/career-support';

export default function CareerSupportDashboard() {
  const [careerRecords, setCareerRecords] = useState<StaffCareerRecord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<SupportLevel | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchCareerRecords();
  }, [selectedLevel]);

  const fetchCareerRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevel !== 'all') {
        params.append('supportLevel', selectedLevel);
      }

      const response = await fetch(`/api/career-support/records?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCareerRecords(data.records);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch career records:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSupportLevelColor = (level: SupportLevel) => {
    switch (level) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'onboarding':
        return <UserCheck className="h-4 w-4" />;
      case 'growth':
        return <TrendingUp className="h-4 w-4" />;
      case 'stable':
        return <Target className="h-4 w-4" />;
      case 'transition':
        return <Clock className="h-4 w-4" />;
      case 'intensive':
        return <AlertCircle className="h-4 w-4" />;
      case 'leadership':
        return <Award className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      onboarding: '入社・適応期',
      growth: '成長期',
      stable: '安定期',
      transition: '転換期',
      intensive: '集中支援期',
      leadership: 'リーダー育成期',
    };
    return labels[phase] || phase;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダーカード */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              キャリア支援ダッシュボード
            </CardTitle>
            <Badge className="bg-blue-600 text-white">
              {new Date().toLocaleDateString('ja-JP')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            評価と面談データを統合し、職員一人ひとりの成長を支援します
          </p>
        </CardContent>
      </Card>

      {/* サマリー統計 */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">総職員数</p>
                  <p className="text-2xl font-bold">{summary.totalStaff}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">要支援（C/D）</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {summary.byLevel.C + summary.byLevel.D}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">成長期職員</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary.byPhase.growth}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">リーダー候補</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {summary.byPhase.leadership}
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 支援レベル別フィルター */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">支援レベル別表示</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={selectedLevel === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('all')}
              size="sm"
            >
              全て
            </Button>
            {(['A', 'B', 'C', 'D'] as SupportLevel[]).map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                onClick={() => setSelectedLevel(level)}
                size="sm"
              >
                <Badge className={`mr-2 ${getSupportLevelColor(level)}`}>
                  {level}
                </Badge>
                レベル{level}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 職員カルテ一覧 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {careerRecords.map((record) => (
          <Card key={record.staffId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {record.staffName}
                    <Badge className={getSupportLevelColor(record.careerSupport.supportLevel)}>
                      支援{record.careerSupport.supportLevel}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {record.department} / {record.position}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getPhaseIcon(record.careerSupport.currentPhase)}
                  <span className="text-sm text-gray-600">
                    {getPhaseLabel(record.careerSupport.currentPhase)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 最新評価 */}
              {record.evaluationHistory.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">最新評価</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {record.evaluationHistory[0].finalGrade}評価
                      </Badge>
                      <span className="text-sm">
                        {record.evaluationHistory[0].totalScore}点
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(record.evaluationHistory[0].date).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              )}

              {/* 成長軌跡 */}
              <div>
                <p className="text-xs text-gray-500 mb-2">強み・改善点</p>
                <div className="flex flex-wrap gap-1">
                  {record.careerSupport.growthTrajectory.strengths.slice(0, 3).map((strength, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {strength}
                    </Badge>
                  ))}
                  {record.careerSupport.growthTrajectory.improvements.slice(0, 2).map((improvement, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs text-orange-600">
                      要改善: {improvement}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 目標進捗 */}
              {record.careerSupport.growthTrajectory.careerGoals.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">目標進捗</p>
                  {record.careerSupport.growthTrajectory.careerGoals
                    .filter(g => g.term === 'short')
                    .slice(0, 1)
                    .map((goal) => (
                      <div key={goal.goal} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate">{goal.goal}</span>
                          <span className="text-xs text-gray-500">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                </div>
              )}

              {/* 直近の介入 */}
              {record.careerSupport.interventions.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">直近の支援</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{record.careerSupport.interventions[0].description}</span>
                    <Badge variant="outline" className="text-xs">
                      効果: {record.careerSupport.interventions[0].effectiveness}/5
                    </Badge>
                  </div>
                </div>
              )}

              {/* アクションボタン */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  詳細表示
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  支援プラン
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* アラート */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          支援レベルC/Dの職員が{summary?.byLevel.C + summary?.byLevel.D || 0}名います。
          早期の介入により改善が期待できます。
        </AlertDescription>
      </Alert>
    </div>
  );
}