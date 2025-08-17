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
  CheckCircle,
  Settings,
  Edit3,
  PlayCircle,
  ListChecks,
  History,
  Star,
  Trash2,
  Upload,
  Save,
  AlertCircle
} from 'lucide-react';

import { UnifiedBankService, BankStatistics } from '@/lib/interview-bank/services/unified-bank-service';
import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { InterviewQuestion, InterviewSectionInstance } from '@/lib/interview-bank/types';
import { questionBank } from '@/lib/interview-bank/database/question-bank';
import { generateInterviewSections, generateSectionPreview } from '@/lib/interview-bank/services/section-generator';
import { sectionDefinitions } from '@/lib/interview-bank/database/section-definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InterviewBankFlowManager from './InterviewBankFlowManager';

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
  const [isNewQuestionDialogOpen, setIsNewQuestionDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<BankQuestion>>({
    text: '',
    category: '',
    difficulty: '推奨',
    type: 'textarea'
  });
  const [importText, setImportText] = useState('');
  const [showFlowManager, setShowFlowManager] = useState(false);

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

  // バンク管理ハンドラ
  const handleBankManagement = (typeId: string) => {
    setSelectedType(typeId);
    setCurrentStep(5); // 管理画面用の新しいステップ
  };

  // 質問削除ハンドラ
  const handleDeleteQuestion = (questionId: string) => {
    setAvailableQuestions(prev => prev.filter(q => q.id !== questionId));
    // 実際のアプリではDBからも削除
    console.log('質問を削除:', questionId);
  };

  // 質問保存ハンドラ
  const handleSaveQuestion = () => {
    if (!newQuestion.text || !newQuestion.category) {
      return;
    }

    const questionToSave: BankQuestion = {
      id: editingQuestion?.id || `q_${Date.now()}`,
      text: newQuestion.text,
      category: newQuestion.category,
      difficulty: newQuestion.difficulty || '推奨',
      type: newQuestion.type || 'textarea'
    };

    if (editingQuestion) {
      // 編集モード
      setAvailableQuestions(prev => 
        prev.map(q => q.id === editingQuestion.id ? questionToSave : q)
      );
    } else {
      // 新規追加モード
      setAvailableQuestions(prev => [...prev, questionToSave]);
    }

    // リセット
    setIsNewQuestionDialogOpen(false);
    setEditingQuestion(null);
    setNewQuestion({
      text: '',
      category: '',
      difficulty: '推奨',
      type: 'textarea'
    });
  };

  // 一括インポートハンドラ
  const handleImport = () => {
    try {
      const lines = importText.split('\n').filter(line => line.trim());
      const importedQuestions: BankQuestion[] = [];

      lines.forEach((line, index) => {
        // CSV形式: 質問文,カテゴリ,難易度,タイプ
        const parts = line.split(',').map(part => part.trim());
        if (parts[0]) {
          importedQuestions.push({
            id: `import_${Date.now()}_${index}`,
            text: parts[0],
            category: parts[1] || '一般',
            difficulty: parts[2] || '推奨',
            type: parts[3] || 'textarea'
          });
        }
      });

      if (importedQuestions.length > 0) {
        setAvailableQuestions(prev => [...prev, ...importedQuestions]);
        setIsImportDialogOpen(false);
        setImportText('');
        console.log(`${importedQuestions.length}件の質問をインポートしました`);
      }
    } catch (error) {
      console.error('インポートエラー:', error);
    }
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

                {/* アクションセクション - 目的別に分離 */}
                <div className="mt-6 space-y-4">
                  {/* 面談実施セクション */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <PlayCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">面談を実施する</span>
                    </div>
                    <p className="text-xs text-blue-700 mb-3">
                      質問を選択・カスタマイズして面談を開始
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTypeSelect(type.id);
                      }}
                    >
                      <ListChecks className="w-4 h-4 mr-2" />
                      質問を選んで開始
                    </Button>
                  </div>

                  {/* バンク管理セクション */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">バンクを管理する</span>
                    </div>
                    <p className="text-xs text-gray-700 mb-3">
                      質問の追加・編集・削除
                    </p>
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBankManagement(type.id);
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      質問を追加・編集
                    </Button>
                  </div>
                </div>

                {/* 統計情報 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <History className="w-3 h-3" />
                      <span>最近使用: 2日前</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>利用頻度: 高</span>
                    </div>
                  </div>
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
                onClick={() => setShowFlowManager(true)}
                disabled={selectedQuestions.length === 0}
              >
                次へ進む ({selectedQuestions.length}問選択中)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* フローマネージャー表示 */}
      {showFlowManager && selectedType && (
        <InterviewBankFlowManager
          selectedQuestions={selectedQuestions}
          interviewType={selectedType}
          onBack={() => setShowFlowManager(false)}
          onComplete={(settings, questions) => {
            console.log('面談設定:', settings);
            console.log('選択された質問:', questions);
            // TODO: 実際の面談シート生成・保存処理
            alert('面談シートが生成されました！');
            setShowFlowManager(false);
            setCurrentStep(1);
            setSelectedQuestions([]);
          }}
        />
      )}

      {/* バンク管理画面（ステップ5） */}
      {!showFlowManager && currentStep === 5 && selectedType && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-gray-600" />
                <div>
                  <CardTitle>
                    {interviewTypes.find(t => t.id === selectedType)?.title} - 管理
                  </CardTitle>
                  <CardDescription>
                    質問の追加・編集・削除とバンクのカスタマイズ
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
            <Tabs defaultValue="questions" className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="questions">質問管理</TabsTrigger>
                <TabsTrigger value="sets">質問セット</TabsTrigger>
                <TabsTrigger value="recent">最近の追加</TabsTrigger>
                <TabsTrigger value="statistics">利用統計</TabsTrigger>
              </TabsList>

              {/* 質問管理タブ */}
              <TabsContent value="questions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setEditingQuestion(null);
                        setNewQuestion({
                          text: '',
                          category: '',
                          difficulty: '推奨',
                          type: 'textarea'
                        });
                        setIsNewQuestionDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      新規質問追加
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsImportDialogOpen(true)}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      一括インポート
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="質問を検索..."
                      className="pl-10 pr-4 py-2 w-64"
                    />
                  </div>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {availableQuestions.slice(0, 10).map((question) => (
                      <Card key={question.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium mb-2">{question.text}</p>
                            <div className="flex gap-2">
                              <Badge variant="outline">{question.category}</Badge>
                              <Badge variant="secondary">{question.difficulty}</Badge>
                              {question.type && <Badge>{question.type}</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setEditingQuestion(question);
                                setNewQuestion(question);
                                setIsNewQuestionDialogOpen(true);
                              }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-600"
                              onClick={() => {
                                if (confirm('この質問を削除しますか？')) {
                                  handleDeleteQuestion(question.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* 質問セットタブ */}
              <TabsContent value="sets" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <h4 className="font-semibold">よく使う質問セット</h4>
                      </div>
                      <Badge>5セット</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-white rounded-lg flex justify-between items-center">
                        <span className="text-sm">新人看護師向け基本セット</span>
                        <Button size="sm" variant="ghost">使用</Button>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between items-center">
                        <span className="text-sm">中堅職員キャリア面談セット</span>
                        <Button size="sm" variant="ghost">使用</Button>
                      </div>
                      <div className="p-2 bg-white rounded-lg flex justify-between items-center">
                        <span className="text-sm">管理職評価面談セット</span>
                        <Button size="sm" variant="ghost">使用</Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">カスタムセット作成</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      頻繁に使用する質問の組み合わせを保存できます
                    </p>
                    <Button className="w-full" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      新しいセットを作成
                    </Button>
                  </Card>
                </div>
              </TabsContent>

              {/* 最近の追加タブ */}
              <TabsContent value="recent" className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    最近追加した質問
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Badge className="bg-green-600">新規</Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">仕事のやりがいについて教えてください</p>
                        <p className="text-xs text-gray-600 mt-1">2日前に追加 • カテゴリ: モチベーション</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Badge className="bg-green-600">新規</Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">チーム内でのコミュニケーションについて</p>
                        <p className="text-xs text-gray-600 mt-1">5日前に追加 • カテゴリ: チームワーク</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Badge className="bg-yellow-600">編集</Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">今後のキャリアプランについて</p>
                        <p className="text-xs text-gray-600 mt-1">1週間前に編集 • カテゴリ: キャリア</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* 利用統計タブ */}
              <TabsContent value="statistics" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">総質問数</p>
                        <p className="text-2xl font-bold">{availableQuestions.length}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-200" />
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">今月の利用回数</p>
                        <p className="text-2xl font-bold">23</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-200" />
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">平均選択数</p>
                        <p className="text-2xl font-bold">8.5</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-200" />
                    </div>
                  </Card>
                </div>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">最もよく使われる質問TOP5</h4>
                  <div className="space-y-2">
                    {[
                      { text: "現在の業務について満足度を教えてください", count: 45 },
                      { text: "職場の人間関係はいかがですか", count: 42 },
                      { text: "今後の目標について教えてください", count: 38 },
                      { text: "改善してほしい点はありますか", count: 35 },
                      { text: "スキルアップのために取り組んでいることは", count: 32 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm">{index + 1}. {item.text}</span>
                        <Badge variant="outline">{item.count}回</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
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

      {/* 新規質問追加・編集ダイアログ */}
      <Dialog open={isNewQuestionDialogOpen} onOpenChange={setIsNewQuestionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? '質問を編集' : '新規質問を追加'}
            </DialogTitle>
            <DialogDescription>
              面談で使用する質問を{editingQuestion ? '編集' : '作成'}します
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">質問内容 *</Label>
              <Textarea
                id="question-text"
                placeholder="質問内容を入力してください"
                value={newQuestion.text || ''}
                onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question-category">カテゴリ *</Label>
                <Input
                  id="question-category"
                  placeholder="例: スキル評価、キャリア"
                  value={newQuestion.category || ''}
                  onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-difficulty">優先度</Label>
                <Select 
                  value={newQuestion.difficulty || '推奨'}
                  onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="必須">必須</SelectItem>
                    <SelectItem value="推奨">推奨</SelectItem>
                    <SelectItem value="オプション">オプション</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>回答形式</Label>
              <RadioGroup 
                value={newQuestion.type || 'textarea'}
                onValueChange={(value) => setNewQuestion({...newQuestion, type: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="textarea" id="type-textarea" />
                  <Label htmlFor="type-textarea">長文回答</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="type-text" />
                  <Label htmlFor="type-text">短文回答</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scale" id="type-scale" />
                  <Label htmlFor="type-scale">評価スケール（1-5）</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="radio" id="type-radio" />
                  <Label htmlFor="type-radio">単一選択</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="checkbox" id="type-checkbox" />
                  <Label htmlFor="type-checkbox">複数選択</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsNewQuestionDialogOpen(false);
                setEditingQuestion(null);
              }}
            >
              キャンセル
            </Button>
            <Button 
              onClick={handleSaveQuestion}
              disabled={!newQuestion.text || !newQuestion.category}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingQuestion ? '更新' : '追加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 一括インポートダイアログ */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>質問を一括インポート</DialogTitle>
            <DialogDescription>
              CSV形式またはテキスト形式で質問を一括で追加できます
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>形式:</strong> 1行につき1つの質問を入力してください<br/>
                <strong>CSV形式:</strong> 質問文,カテゴリ,優先度,回答形式<br/>
                <strong>例:</strong> 現在の業務で困っていることは？,職場環境,必須,textarea
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="import-text">インポートデータ</Label>
              <Textarea
                id="import-text"
                placeholder="質問データを貼り付けてください&#10;例:&#10;現在の業務で困っていることは？,職場環境,必須,textarea&#10;キャリアプランについて教えてください,キャリア,推奨,textarea"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  // サンプルデータを挿入
                  setImportText(
`現在の業務で最も改善したい点は何ですか？,業務改善,必須,textarea
チームワークを向上させるために必要なことは？,チーム連携,推奨,textarea
自己成長のために取り組んでいることを教えてください,成長・学習,推奨,textarea
ワークライフバランスについての満足度は？,職場環境,必須,scale
上司からのサポートは十分ですか？,上司関係,必須,radio`
                  );
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                サンプルデータを挿入
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsImportDialogOpen(false);
                setImportText('');
              }}
            >
              キャンセル
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!importText.trim()}
            >
              <Database className="w-4 h-4 mr-2" />
              インポート
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}