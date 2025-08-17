'use client';

/**
 * 統一面談バンクシステム
 * 全ての面談タイプを統一されたUIで管理
 * 面談ステーションのような親しみやすいデザインを採用
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
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Database,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  Heart,
  UserX,
  ArrowRightLeft,
  UserCheck,
  BarChart3,
  Activity,
  Plus,
  Search,
  BookOpen,
  ChevronRight,
  Sparkles,
  Target,
  Briefcase,
  Shield,
  MessageCircle,
  FileText,
  CheckCircle
} from 'lucide-react';

import { UnifiedBankService, BankStatistics } from '@/lib/interview-bank/services/unified-bank-service';
import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { InterviewQuestion } from '@/lib/interview-bank/types';
import { questionBank } from '@/lib/interview-bank/database/question-bank';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// BankQuestion型の定義（統一型）
interface BankQuestion {
  id: string;
  text: string;
  category: string;
  difficulty?: string;
  type?: string;
}

// サポート面談・特別面談の質問型（既存の型）
interface LegacyBankQuestion {
  id: string;
  category: string;
  questionText: string;
  questionType: string;
  tags?: string[];
  priority?: number;
  estimatedTime?: number;
  metadata?: any;
}

// 暫定的にハードコードされた質問データ（サポート面談用）
const mockSupportQuestions: LegacyBankQuestion[] = [
  {
    id: 'sp_career_001',
    category: 'career_development',
    questionText: '現在のキャリアプランについて教えてください',
    questionType: 'text',
    tags: ['キャリア', 'サポート面談'],
    priority: 1
  },
  {
    id: 'sp_career_002',
    category: 'career_development',
    questionText: '目指している役職や資格はありますか？',
    questionType: 'text',
    tags: ['キャリア', '昇進', '資格'],
    priority: 1
  },
  {
    id: 'sp_workplace_001',
    category: 'workplace',
    questionText: '現在の職場環境で改善してほしい点はありますか？',
    questionType: 'text',
    tags: ['職場環境', 'サポート面談'],
    priority: 1
  }
];

// 暫定的にハードコードされた質問データ（特別面談用）
const mockSpecialQuestions: LegacyBankQuestion[] = [
  {
    id: 'exit_001',
    category: 'exit_interview',
    questionText: '退職を決意した主な理由を教えてください',
    questionType: 'text',
    tags: ['退職面談', '退職理由', '重要'],
    priority: 1
  },
  {
    id: 'exit_002',
    category: 'exit_interview',
    questionText: '職場環境で良かった点を教えてください',
    questionType: 'text',
    tags: ['退職面談', '職場評価'],
    priority: 2
  },
  {
    id: 'transfer_001',
    category: 'transfer',
    questionText: '異動先での不安や心配事はありますか？',
    questionType: 'text',
    tags: ['異動面談', '不安要素'],
    priority: 1
  }
];

// 面談タイプの定義
const interviewTypes = [
  {
    id: 'regular',
    title: '定期面談バンク',
    icon: <Calendar className="w-8 h-8" />,
    color: 'blue',
    description: '新人・年次・管理職面談',
    stats: { total: 892, completed: 847, rate: 95 },
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    features: [
      '職種別質問テンプレート',
      '経験年数別カスタマイズ',
      'AI質問生成機能'
    ]
  },
  {
    id: 'support',
    title: 'サポート面談バンク',
    icon: <Heart className="w-8 h-8" />,
    color: 'purple',
    description: 'VoiceDrive連携・職員サポート',
    stats: { total: 168, completed: 150, rate: 89 },
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    features: [
      'VoiceDrive自動連携',
      'カテゴリ別質問セット',
      'フォローアップ管理'
    ]
  },
  {
    id: 'special',
    title: '特別面談バンク',
    icon: <AlertTriangle className="w-8 h-8" />,
    color: 'orange',
    description: '退職・異動・復職面談',
    stats: { total: 187, completed: 153, rate: 82 },
    gradient: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-50 to-orange-100',
    features: [
      '状況別専門質問',
      'リスク評価機能',
      '法的要件チェック'
    ]
  }
];

// 作業フローステップ
const workflowSteps = [
  { 
    id: 1, 
    title: '面談タイプ選択',
    icon: <Target className="w-5 h-5" />,
    description: '目的に応じた面談を選択'
  },
  { 
    id: 2, 
    title: '質問セット準備',
    icon: <FileText className="w-5 h-5" />,
    description: 'テンプレートから質問を選定'
  },
  { 
    id: 3, 
    title: 'カスタマイズ',
    icon: <Sparkles className="w-5 h-5" />,
    description: '職員に合わせて調整'
  },
  { 
    id: 4, 
    title: '面談実施',
    icon: <MessageCircle className="w-5 h-5" />,
    description: '準備した内容で面談'
  }
];

export default function UnifiedInterviewBankSystem() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState<BankStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<BankQuestion[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<BankQuestion[]>([]);

  // 統計情報の取得
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const service = UnifiedBankService.getInstance();
        const stats = await service.getStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('統計情報の取得に失敗:', error);
      }
    };
    loadStatistics();
  }, []);

  // 面談タイプ選択ハンドラ
  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setCurrentStep(2);
    
    // 選択したタイプに応じて質問を読み込み
    let questions: BankQuestion[] = [];
    switch (typeId) {
      case 'regular':
        // InterviewQuestion型からBankQuestion型に変換
        questions = questionBank.map(q => ({
          id: q.id,
          text: q.content,
          category: q.category,
          difficulty: q.priority === 1 ? '必須' : q.priority === 2 ? '推奨' : 'オプション',
          type: q.type
        }));
        break;
      case 'support':
        // LegacyBankQuestion型からBankQuestion型に変換
        questions = mockSupportQuestions.map(q => ({
          id: q.id,
          text: q.questionText,
          category: q.category,
          difficulty: q.priority === 1 ? '必須' : q.priority === 2 ? '推奨' : 'オプション',
          type: q.questionType
        }));
        break;
      case 'special':
        // LegacyBankQuestion型からBankQuestion型に変換
        questions = mockSpecialQuestions.map(q => ({
          id: q.id,
          text: q.questionText,
          category: q.category,
          difficulty: q.priority === 1 ? '必須' : q.priority === 2 ? '推奨' : 'オプション',
          type: q.questionType
        }));
        break;
    }
    setAvailableQuestions(questions);
  };

  // クイックスタートハンドラ
  const handleQuickStart = (typeId: string) => {
    // 詳細ボタンと同じ動作にして、質問選択画面を表示
    handleTypeSelect(typeId);
  };

  return (
    <div className="space-y-8 p-6">
      {/* ヘッダーセクション */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              面談バンク
            </h1>
            <p className="text-gray-600 text-lg">
              570問以上の質問テンプレートで効率的な面談を実現
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="bg-white"
              onClick={() => window.location.href = '/interview-bank/create'}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI面談作成
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              onClick={() => setCurrentStep(1)}
            >
              <Plus className="w-4 h-4 mr-2" />
              新規面談開始
            </Button>
          </div>
        </div>

        {/* 作業フロー表示 */}
        <div className="mt-8 bg-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            {workflowSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`flex items-center gap-3 cursor-pointer transition-all ${
                    currentStep >= step.id 
                      ? 'opacity-100' 
                      : 'opacity-50'
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {step.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < workflowSteps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                )}
              </React.Fragment>
            ))}
          </div>
          <Progress value={currentStep * 25} className="mt-4" />
        </div>
      </div>

      {/* 統計サマリー */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">総面談数</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {statistics.totalInterviews.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">全バンク合計</p>
                </div>
                <BarChart3 className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">完了率</p>
                  <p className="text-3xl font-bold text-green-700">
                    {statistics.completionRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">今月実績</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">平均時間</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {statistics.averageDuration}分
                  </p>
                  <p className="text-xs text-gray-500 mt-1">面談あたり</p>
                </div>
                <Clock className="w-10 h-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">総質問数</p>
                  <p className="text-3xl font-bold text-orange-700">
                    {statistics.totalQuestions}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">利用可能</p>
                </div>
                <BookOpen className="w-10 h-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* メインコンテンツ - 面談タイプ選択 */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {interviewTypes.map((type) => (
            <Card 
              key={type.id}
              className={`
                border-2 hover:shadow-xl transition-all cursor-pointer
                hover:scale-105 overflow-hidden
                ${selectedType === type.id ? 'border-blue-500' : 'border-gray-200'}
              `}
              onClick={() => handleTypeSelect(type.id)}
            >
              <div className={`h-2 bg-gradient-to-r ${type.gradient}`} />
              <CardHeader className={`bg-gradient-to-br ${type.bgGradient}`}>
                <div className="flex items-center justify-between">
                  <div className={`p-3 bg-white rounded-xl shadow-sm text-${type.color}-600`}>
                    {type.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {type.stats.total}件
                  </Badge>
                </div>
                <CardTitle className="mt-4">{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* 進捗バー */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">完了率</span>
                    <span className="font-semibold">{type.stats.rate}%</span>
                  </div>
                  <Progress value={type.stats.rate} className="h-2" />
                </div>

                {/* 機能リスト */}
                <div className="space-y-2">
                  {type.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* アクションボタン */}
                <div className="mt-6 flex gap-2">
                  <Button 
                    className="flex-1"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTypeSelect(type.id);
                    }}
                  >
                    詳細
                  </Button>
                  <Button 
                    className={`flex-1 bg-gradient-to-r ${type.gradient} text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickStart(type.id);
                    }}
                  >
                    開始
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 質問選択画面（ステップ2以降） */}
      {currentStep >= 2 && selectedType && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {interviewTypes.find(t => t.id === selectedType)?.icon}
                <div>
                  <CardTitle>
                    {interviewTypes.find(t => t.id === selectedType)?.title}
                  </CardTitle>
                  <CardDescription>
                    質問テンプレートを選択してカスタマイズできます
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep(1)}
              >
                戻る
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* 検索バー */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="質問を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-96"
                />
              </div>
            </div>

            {/* 質問リスト */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 利用可能な質問 */}
              <div className="border rounded-lg">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-semibold flex items-center justify-between">
                    <span>利用可能な質問</span>
                    <Badge variant="secondary">{availableQuestions.length}件</Badge>
                  </h3>
                </div>
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-2">
                    {availableQuestions
                      .filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()))
                      .slice(0, 20)
                      .map((question) => (
                        <div
                          key={question.id}
                          className="p-3 bg-white border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => {
                            if (!selectedQuestions.find(q => q.id === question.id)) {
                              setSelectedQuestions([...selectedQuestions, question]);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Plus className="w-4 h-4 mt-1 text-blue-600" />
                            <div className="flex-1">
                              <p className="text-sm">{question.text}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {question.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {question.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>

              {/* 選択済みの質問 */}
              <div className="border rounded-lg">
                <div className="bg-blue-50 p-4 border-b">
                  <h3 className="font-semibold flex items-center justify-between">
                    <span>選択済みの質問</span>
                    <Badge>{selectedQuestions.length}件</Badge>
                  </h3>
                </div>
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-2">
                    {selectedQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-semibold text-blue-600">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <p className="text-sm">{question.text}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedQuestions(
                                  selectedQuestions.filter(q => q.id !== question.id)
                                );
                              }}
                            >
                              削除
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedQuestions.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <p>質問を選択してください</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={() => setSelectedQuestions([])}
                disabled={selectedQuestions.length === 0}
              >
                すべてクリア
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={() => setCurrentStep(3)}
                disabled={selectedQuestions.length === 0}
              >
                次へ進む ({selectedQuestions.length}問選択中)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* クイックアクセス */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          クイックアクセス
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline"
            className="justify-start bg-white hover:bg-blue-50"
            onClick={() => window.location.href = '/interview-bank/history'}
          >
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            面談履歴
          </Button>
          <Button 
            variant="outline"
            className="justify-start bg-white hover:bg-green-50"
            onClick={() => window.location.href = '/interview-bank/templates'}
          >
            <BookOpen className="w-4 h-4 mr-2 text-green-600" />
            テンプレート管理
          </Button>
          <Button 
            variant="outline"
            className="justify-start bg-white hover:bg-purple-50"
            onClick={() => window.location.href = '/interviews/support/voicedrive'}
          >
            <MessageCircle className="w-4 h-4 mr-2 text-purple-600" />
            VoiceDrive連携
          </Button>
          <Button 
            variant="outline"
            className="justify-start bg-white hover:bg-orange-50"
            onClick={() => window.location.href = '/interview-bank/analytics'}
          >
            <BarChart3 className="w-4 h-4 mr-2 text-orange-600" />
            統計分析
          </Button>
        </div>
      </div>
    </div>
  );
}