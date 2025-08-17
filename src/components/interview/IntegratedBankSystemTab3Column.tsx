'use client';

/**
 * 統合面談バンクシステムタブ（3カラムレイアウト強化版）
 * 左サイドバー：質問カテゴリナビゲーション
 * 中央：質問リスト
 * 右サイドバー：質問詳細（Sheet）
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
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
  Edit,
  Trash2,
  Save,
  Copy,
  BookOpen,
  Tag,
  ChevronRight,
  X,
  Filter,
  Lightbulb,
  Target,
  Briefcase,
  Zap,
  Shield,
  DollarSign
} from 'lucide-react';

import { UnifiedBankService, BankStatistics } from '@/lib/interview-bank/services/unified-bank-service';
import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { BankQuestion } from '@/lib/interview-bank/types';
import { questionBank } from '@/lib/interview-bank/database/question-bank';
import { supportQuestions } from '@/lib/interview-bank/database/support-questions';
import SupportInterviewBankFlow from './SupportInterviewBankFlow';
import SpecialInterviewBankFlow from './SpecialInterviewBankFlow';
import DynamicInterviewFlow from './DynamicInterviewFlow';

// 面談タイプのアイコンとカラーマッピング
const interviewTypeIcons = {
  regular: { icon: <Calendar className="h-5 w-5" />, color: '#3b82f6', label: '定期面談' },
  support: { icon: <Heart className="h-5 w-5" />, color: '#10b981', label: 'サポート面談' },
  special: { icon: <AlertTriangle className="h-5 w-5" />, color: '#f59e0b', label: '特別面談' }
};

export default function IntegratedBankSystemTab3Column() {
  const [activeBank, setActiveBank] = useState<'overview' | 'regular' | 'support' | 'special' | 'templates'>('templates'); // デフォルトを質問テンプレートタブに変更
  const [bankStatistics, setBankStatistics] = useState<BankStatistics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1month' | '3months' | '6months' | '1year'>('6months');
  const [loading, setLoading] = useState(true);
  
  // 質問管理用のstate
  const [questionTemplates, setQuestionTemplates] = useState<BankQuestion[]>([]);
  const [customQuestions, setCustomQuestions] = useState<BankQuestion[]>([]);
  const [activeSection, setActiveSection] = useState('motivation_engagement');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<BankQuestion | null>(null);
  const [isNewQuestionDialogOpen, setIsNewQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<BankQuestion>>({
    content: '',
    type: 'textarea',
    category: 'general',
    priority: 1,
    minDuration: 15,
    tags: [],
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  });

  const unifiedService = UnifiedBankService.getInstance();
  const bankService = InterviewBankService.getInstance();

  // 質問セクション定義（左サイドバー用）
  const questionSections = [
    { id: 'motivation_engagement', label: '動機タイプ判定', icon: '💡', color: 'blue', count: 0 },
    { id: 'current_status', label: '現状確認', icon: '📊', color: 'green', count: 0 },
    { id: 'technical_skills', label: 'スキル評価', icon: '⭐', color: 'purple', count: 0 },
    { id: 'adaptation_support', label: '新人適応支援', icon: '🌱', color: 'teal', count: 0 },
    { id: 'skill_development', label: '若手スキル開発', icon: '📈', color: 'orange', count: 0 },
    { id: 'leadership_development', label: '中堅リーダーシップ', icon: '👥', color: 'red', count: 0 },
    { id: 'mentoring_expertise', label: 'ベテラン専門性', icon: '🎯', color: 'indigo', count: 0 },
    { id: 'management_status', label: '管理職向け', icon: '💼', color: 'gray', count: 0 },
    { id: 'health_wellbeing', label: '健康・ウェルビーイング', icon: '❤️', color: 'pink', count: 0 },
    { id: 'career_development', label: 'キャリア開発', icon: '🚀', color: 'yellow', count: 0 },
    { id: 'acute_care_skills', label: '急性期専門', icon: '🚨', color: 'red', count: 0 },
    { id: 'chronic_care_skills', label: '慢性期専門', icon: '🏥', color: 'blue', count: 0 },
    { id: 'ltc_skills', label: '介護施設専門', icon: '🏠', color: 'green', count: 0 },
    { id: 'ward_specific', label: '病棟専門', icon: '🏥', color: 'purple', count: 0 },
    { id: 'outpatient_specific', label: '外来専門', icon: '🚶', color: 'teal', count: 0 },
    { id: 'action_plan', label: 'アクションプラン', icon: '📝', color: 'orange', count: 0 },
    { id: 'custom', label: 'カスタム質問', icon: '✨', color: 'indigo', count: 0 }
  ];

  useEffect(() => {
    loadBankData();
    loadQuestionTemplates();
  }, [selectedPeriod]);

  useEffect(() => {
    // セクションごとの質問数を更新
    updateSectionCounts();
  }, [questionTemplates, customQuestions]);

  const updateSectionCounts = () => {
    const allQuestions = [...questionTemplates, ...customQuestions];
    questionSections.forEach(section => {
      if (section.id === 'custom') {
        section.count = customQuestions.length;
      } else {
        section.count = allQuestions.filter(q => 
          q.sectionId === section.id || q.category === section.id
        ).length;
      }
    });
  };

  const loadQuestionTemplates = async () => {
    try {
      const allQuestions = [...questionBank, ...supportQuestions];
      setQuestionTemplates(allQuestions);
      
      const savedCustomQuestions = localStorage.getItem('custom_questions_bank');
      if (savedCustomQuestions) {
        setCustomQuestions(JSON.parse(savedCustomQuestions));
      }
    } catch (error) {
      console.error('Failed to load question templates:', error);
    }
  };

  const loadBankData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case '1month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      const stats = await unifiedService.getUnifiedStatistics({ start: startDate, end: endDate });
      setBankStatistics(stats);
    } catch (error) {
      console.error('Failed to load bank statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  // フィルタリングされた質問
  const getFilteredQuestions = () => {
    const allQuestions = [...questionTemplates, ...customQuestions];
    
    return allQuestions.filter(q => {
      const matchesSection = activeSection === 'custom' 
        ? customQuestions.includes(q)
        : (q.sectionId === activeSection || q.category === activeSection);
      
      const matchesSearch = searchQuery === '' || 
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.tags && q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      return matchesSection && matchesSearch;
    });
  };

  // 質問をコピー
  const copyQuestion = (question: BankQuestion) => {
    const copiedQuestion = {
      ...question,
      id: `copy_${Date.now()}`,
      content: `${question.content} (コピー)`
    };
    const updatedQuestions = [...customQuestions, copiedQuestion];
    setCustomQuestions(updatedQuestions);
    localStorage.setItem('custom_questions_bank', JSON.stringify(updatedQuestions));
  };

  // 質問を削除
  const deleteQuestion = (questionId: string) => {
    const updatedQuestions = customQuestions.filter(q => q.id !== questionId);
    setCustomQuestions(updatedQuestions);
    localStorage.setItem('custom_questions_bank', JSON.stringify(updatedQuestions));
    setSelectedQuestion(null);
  };

  // 3カラムレイアウトの質問テンプレートタブ
  const QuestionTemplateTab = () => {
    const filteredQuestions = getFilteredQuestions();
    const currentSection = questionSections.find(s => s.id === activeSection);

    return (
      <div className="flex gap-4 h-[calc(100vh-320px)] min-h-[600px]">
        {/* 左サイドバー - 質問カテゴリ */}
        <div className="w-80 bg-white rounded-lg border shadow-sm flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              質問カテゴリ
            </h3>
            <div className="mt-3 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="カテゴリを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {questionSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{section.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{section.label}</div>
                      <div className="text-xs opacity-75">{section.count}問収録</div>
                    </div>
                  </div>
                  {activeSection === section.id && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 中央エリア - 質問リスト */}
        <div className="flex-1 bg-white rounded-lg border shadow-sm flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {currentSection?.icon} {currentSection?.label}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {filteredQuestions.length}件の質問
                </p>
              </div>
              <Button size="sm" onClick={() => setIsNewQuestionDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                新規追加
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredQuestions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">質問が見つかりません</p>
                  <p className="text-sm mt-1">新しい質問を追加してください</p>
                </div>
              ) : (
                filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    onClick={() => setSelectedQuestion(question)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedQuestion?.id === question.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-900 flex-1 pr-2">
                          {question.content}
                        </p>
                        <div className="flex gap-1 ml-2 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingQuestion(question);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyQuestion(question);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {question.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          優先度: {question.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {question.minDuration}分
                        </Badge>
                        {question.tags?.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {question.tags && question.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{question.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 右サイドバー - 質問詳細（Sheet） */}
        <Sheet open={!!selectedQuestion} onOpenChange={(open) => !open && setSelectedQuestion(null)}>
          <SheetContent className="w-[400px] sm:max-w-[400px]">
            <SheetHeader>
              <SheetTitle>質問詳細</SheetTitle>
              <SheetDescription>
                質問の詳細情報と操作
              </SheetDescription>
            </SheetHeader>
            
            {selectedQuestion && (
              <div className="mt-6 space-y-6">
                <div>
                  <Label className="text-xs text-muted-foreground">質問内容</Label>
                  <p className="mt-1 text-sm">{selectedQuestion.content}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">回答形式</Label>
                    <p className="mt-1 text-sm font-medium">
                      {selectedQuestion.type === 'textarea' ? '長文回答' :
                       selectedQuestion.type === 'text' ? '短文回答' :
                       selectedQuestion.type === 'scale' ? '評価スケール' :
                       selectedQuestion.type === 'radio' ? '単一選択' :
                       selectedQuestion.type === 'checkbox' ? '複数選択' : selectedQuestion.type}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">推定時間</Label>
                    <p className="mt-1 text-sm font-medium">{selectedQuestion.minDuration}分</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">カテゴリ</Label>
                  <p className="mt-1 text-sm font-medium">{selectedQuestion.category}</p>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">優先度</Label>
                  <div className="mt-2">
                    <Badge variant={
                      selectedQuestion.priority === 1 ? 'destructive' :
                      selectedQuestion.priority === 2 ? 'default' : 'secondary'
                    }>
                      優先度 {selectedQuestion.priority}
                      {selectedQuestion.priority === 1 ? ' (必須)' :
                       selectedQuestion.priority === 2 ? ' (重要)' : ' (オプション)'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">対象経験レベル</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedQuestion.experienceLevels?.map(level => (
                      <Badge key={level} variant="outline">
                        {level === 'new' ? '新人' :
                         level === 'junior' ? '若手' :
                         level === 'midlevel' ? '中堅' : 'ベテラン'}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedQuestion.placeholder && (
                  <div>
                    <Label className="text-xs text-muted-foreground">ヒント・補足</Label>
                    <p className="mt-1 text-sm text-gray-600">{selectedQuestion.placeholder}</p>
                  </div>
                )}
                
                {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">タグ</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedQuestion.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 space-y-2 border-t">
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setEditingQuestion(selectedQuestion);
                      setSelectedQuestion(null);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    この質問を編集
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      copyQuestion(selectedQuestion);
                      setSelectedQuestion(null);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    この質問を複製
                  </Button>
                  {customQuestions.some(q => q.id === selectedQuestion.id) && (
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => {
                        if (confirm('この質問を削除してもよろしいですか？')) {
                          deleteQuestion(selectedQuestion.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      この質問を削除
                    </Button>
                  )}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  };

  // 質問編集ダイアログ（既存のコードを流用）
  const QuestionEditorDialog = () => {
    const question = editingQuestion || newQuestion;
    const isEditing = editingQuestion !== null;

    const handleSave = () => {
      if (!question.content || !question.category) return;

      const questionToSave: BankQuestion = {
        id: isEditing ? editingQuestion!.id : `custom_${Date.now()}`,
        content: question.content!,
        type: question.type || 'textarea',
        category: question.category!,
        priority: question.priority || 1,
        minDuration: question.minDuration || 15,
        tags: question.tags || [],
        experienceLevels: question.experienceLevels || ['new', 'junior', 'midlevel', 'veteran'],
        placeholder: question.placeholder,
        sectionId: activeSection === 'custom' ? 'custom' : activeSection,
        departments: question.departments,
        facilityTypes: question.facilityTypes,
        positionLevels: question.positionLevels
      };

      if (isEditing) {
        const updatedQuestions = customQuestions.map(q => 
          q.id === editingQuestion!.id ? questionToSave : q
        );
        setCustomQuestions(updatedQuestions);
        localStorage.setItem('custom_questions_bank', JSON.stringify(updatedQuestions));
      } else {
        const updatedQuestions = [...customQuestions, questionToSave];
        setCustomQuestions(updatedQuestions);
        localStorage.setItem('custom_questions_bank', JSON.stringify(updatedQuestions));
      }

      setEditingQuestion(null);
      setNewQuestion({
        content: '',
        type: 'textarea',
        category: 'general',
        priority: 1,
        minDuration: 15,
        tags: [],
        experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
      });
      setIsNewQuestionDialogOpen(false);
    };

    return (
      <Dialog 
        open={isNewQuestionDialogOpen || isEditing} 
        onOpenChange={(open) => {
          if (!open) {
            setIsNewQuestionDialogOpen(false);
            setEditingQuestion(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? '質問を編集' : '新しい質問を作成'}
            </DialogTitle>
            <DialogDescription>
              面談で使用する質問を作成・編集します
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question-content">質問内容</Label>
              <Textarea
                id="question-content"
                placeholder="質問内容を入力してください"
                value={question.content || ''}
                onChange={(e) => {
                  if (isEditing) {
                    setEditingQuestion({...editingQuestion!, content: e.target.value});
                  } else {
                    setNewQuestion({...newQuestion, content: e.target.value});
                  }
                }}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question-type">質問タイプ</Label>
                <Select 
                  value={question.type || 'textarea'}
                  onValueChange={(value) => {
                    if (isEditing) {
                      setEditingQuestion({...editingQuestion!, type: value as any});
                    } else {
                      setNewQuestion({...newQuestion, type: value as any});
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="textarea">長文回答</SelectItem>
                    <SelectItem value="text">短文回答</SelectItem>
                    <SelectItem value="scale">評価スケール</SelectItem>
                    <SelectItem value="radio">単一選択</SelectItem>
                    <SelectItem value="checkbox">複数選択</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-category">カテゴリ</Label>
                <Input
                  id="question-category"
                  placeholder="例: 職場環境, スキル開発"
                  value={question.category || ''}
                  onChange={(e) => {
                    if (isEditing) {
                      setEditingQuestion({...editingQuestion!, category: e.target.value});
                    } else {
                      setNewQuestion({...newQuestion, category: e.target.value});
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question-priority">優先度</Label>
                <Select 
                  value={String(question.priority || 1)}
                  onValueChange={(value) => {
                    if (isEditing) {
                      setEditingQuestion({...editingQuestion!, priority: Number(value)});
                    } else {
                      setNewQuestion({...newQuestion, priority: Number(value)});
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (必須)</SelectItem>
                    <SelectItem value="2">2 (重要)</SelectItem>
                    <SelectItem value="3">3 (オプション)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-duration">推定時間（分）</Label>
                <Input
                  id="question-duration"
                  type="number"
                  min="5"
                  max="60"
                  value={question.minDuration || 15}
                  onChange={(e) => {
                    if (isEditing) {
                      setEditingQuestion({...editingQuestion!, minDuration: Number(e.target.value)});
                    } else {
                      setNewQuestion({...newQuestion, minDuration: Number(e.target.value)});
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-placeholder">ヒント・補足説明</Label>
              <Input
                id="question-placeholder"
                placeholder="回答者向けのヒントや説明"
                value={question.placeholder || ''}
                onChange={(e) => {
                  if (isEditing) {
                    setEditingQuestion({...editingQuestion!, placeholder: e.target.value});
                  } else {
                    setNewQuestion({...newQuestion, placeholder: e.target.value});
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>対象経験レベル</Label>
              <div className="flex gap-4 flex-wrap">
                {['new', 'junior', 'midlevel', 'veteran'].map(level => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`level-${level}`}
                      checked={question.experienceLevels?.includes(level as any) || false}
                      onCheckedChange={(checked) => {
                        const currentLevels = question.experienceLevels || [];
                        const newLevels = checked
                          ? [...currentLevels, level as any]
                          : currentLevels.filter(l => l !== level);
                        
                        if (isEditing) {
                          setEditingQuestion({...editingQuestion!, experienceLevels: newLevels});
                        } else {
                          setNewQuestion({...newQuestion, experienceLevels: newLevels});
                        }
                      }}
                    />
                    <Label htmlFor={`level-${level}`} className="text-sm">
                      {level === 'new' ? '新人' :
                       level === 'junior' ? '若手' :
                       level === 'midlevel' ? '中堅' : 'ベテラン'}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-tags">タグ（カンマ区切り）</Label>
              <Input
                id="question-tags"
                placeholder="例: 看護師, キャリア, 必須"
                value={question.tags?.join(', ') || ''}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                  if (isEditing) {
                    setEditingQuestion({...editingQuestion!, tags});
                  } else {
                    setNewQuestion({...newQuestion, tags});
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsNewQuestionDialogOpen(false);
                setEditingQuestion(null);
              }}
            >
              キャンセル
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // 統計ダッシュボード（既存のコードを流用）
  const StatisticsOverview = () => {
    if (!bankStatistics) return null;

    const bankComparisonData = [
      {
        bank: '定期面談',
        total: bankStatistics.regular.total,
        completed: bankStatistics.regular.completed,
        pending: bankStatistics.regular.pending,
        completionRate: bankStatistics.regular.averageCompletionRate
      },
      {
        bank: 'サポート面談',
        total: bankStatistics.support.total,
        completed: bankStatistics.support.total * (bankStatistics.support.resolutionRate / 100),
        pending: bankStatistics.support.total - (bankStatistics.support.total * (bankStatistics.support.resolutionRate / 100)),
        completionRate: bankStatistics.support.resolutionRate
      },
      {
        bank: '特別面談',
        total: bankStatistics.special.total,
        completed: bankStatistics.special.total - bankStatistics.special.followUpRequired,
        pending: bankStatistics.special.followUpRequired,
        completionRate: ((bankStatistics.special.total - bankStatistics.special.followUpRequired) / bankStatistics.special.total) * 100
      }
    ];

    const pieData = [
      { name: '定期面談', value: bankStatistics.regular.total, color: '#3b82f6' },
      { name: 'サポート面談', value: bankStatistics.support.total, color: '#10b981' },
      { name: '特別面談', value: bankStatistics.special.total, color: '#f59e0b' }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">総面談数</p>
                  <p className="text-2xl font-bold">{bankStatistics.overall.totalInterviews}</p>
                </div>
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">実施中</p>
                  <p className="text-2xl font-bold">{bankStatistics.overall.activeInterviews}</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">完了率</p>
                  <p className="text-2xl font-bold">{bankStatistics.overall.completionRate.toFixed(0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均時間</p>
                  <p className="text-2xl font-bold">{bankStatistics.overall.averageDuration.toFixed(0)}分</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                バンク別実施状況
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bankComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bank" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="完了" />
                  <Bar dataKey="pending" fill="#f59e0b" name="未完了" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                面談タイプ分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
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
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6" />
            面談バンク
          </h2>
          <p className="text-muted-foreground">
            570問以上の質問テンプレートを3カラムレイアウトで効率的に管理
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1ヶ月</SelectItem>
              <SelectItem value="3months">3ヶ月</SelectItem>
              <SelectItem value="6months">6ヶ月</SelectItem>
              <SelectItem value="1year">1年</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="px-3 py-1">
            <BookOpen className="h-3 w-3 mr-1" />
            総質問数: {questionTemplates.length + customQuestions.length}
          </Badge>
        </div>
      </div>

      {/* バンクシステムタブ */}
      <Tabs value={activeBank} onValueChange={(value: any) => setActiveBank(value)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            統計概要
          </TabsTrigger>
          <TabsTrigger value="regular" className="flex items-center gap-2">
            {interviewTypeIcons.regular.icon}
            定期面談バンク
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            {interviewTypeIcons.support.icon}
            サポート面談バンク
          </TabsTrigger>
          <TabsTrigger value="special" className="flex items-center gap-2">
            {interviewTypeIcons.special.icon}
            特別面談バンク
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            質問テンプレート
            <Badge variant="secondary" className="ml-1">
              Enhanced
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatisticsOverview />
        </TabsContent>

        <TabsContent value="regular" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {interviewTypeIcons.regular.icon}
                定期面談バンクシステム
              </CardTitle>
              <CardDescription>
                新人、年次、管理職面談などの定期面談を管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicInterviewFlow />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <SupportInterviewBankFlow />
        </TabsContent>

        <TabsContent value="special" className="space-y-6">
          <SpecialInterviewBankFlow />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <QuestionTemplateTab />
        </TabsContent>
      </Tabs>

      {/* 質問編集ダイアログ */}
      <QuestionEditorDialog />
    </div>
  );
}