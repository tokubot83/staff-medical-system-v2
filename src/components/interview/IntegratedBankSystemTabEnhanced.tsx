'use client';

/**
 * 統合面談バンクシステムタブ（強化版）
 * 定期面談、サポート面談、特別面談の3つのバンクシステムを統合
 * 質問テンプレート管理・手動追加機能を含む
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
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  Briefcase,
  MessageCircle,
  Settings,
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
  Import,
  Download,
  Filter
} from 'lucide-react';

import { UnifiedBankService, BankStatistics } from '@/lib/interview-bank/services/unified-bank-service';
import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { BankQuestion } from '@/lib/interview-bank/types';
import { questionBank } from '@/lib/interview-bank/database/question-bank';
import { supportQuestions, supportQuestionsByCategory } from '@/lib/interview-bank/database/support-questions';
import SupportInterviewBankFlow from './SupportInterviewBankFlow';
import SpecialInterviewBankFlow from './SpecialInterviewBankFlow';
import DynamicInterviewFlow from './DynamicInterviewFlow';

// 面談タイプのアイコンとカラーマッピング
const interviewTypeIcons = {
  regular: { icon: <Calendar className="h-5 w-5" />, color: '#3b82f6', label: '定期面談' },
  support: { icon: <Heart className="h-5 w-5" />, color: '#10b981', label: 'サポート面談' },
  special: { icon: <AlertTriangle className="h-5 w-5" />, color: '#f59e0b', label: '特別面談' }
};

const specialTypeIcons = {
  exit: { icon: <UserX className="h-4 w-4" />, color: '#ef4444', label: '退職面談' },
  transfer: { icon: <ArrowRightLeft className="h-4 w-4" />, color: '#3b82f6', label: '異動面談' },
  return: { icon: <UserCheck className="h-4 w-4" />, color: '#10b981', label: '復職面談' },
  promotion: { icon: <TrendingUp className="h-4 w-4" />, color: '#8b5cf6', label: '昇進面談' },
  disciplinary: { icon: <AlertTriangle className="h-4 w-4" />, color: '#ef4444', label: '懲戒面談' }
};

export default function IntegratedBankSystemTabEnhanced() {
  const [activeBank, setActiveBank] = useState<'overview' | 'regular' | 'support' | 'special' | 'templates'>('overview');
  const [bankStatistics, setBankStatistics] = useState<BankStatistics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1month' | '3months' | '6months' | '1year'>('6months');
  const [loading, setLoading] = useState(true);
  const [questionTemplates, setQuestionTemplates] = useState<BankQuestion[]>([]);
  const [customQuestions, setCustomQuestions] = useState<BankQuestion[]>([]);
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
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

  useEffect(() => {
    loadBankData();
    loadQuestionTemplates();
  }, [selectedPeriod]);

  const loadQuestionTemplates = async () => {
    try {
      // 標準質問バンクを読み込み
      const allQuestions = [...questionBank, ...supportQuestions];
      setQuestionTemplates(allQuestions);
      
      // カスタム質問を読み込み（localStorage から）
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

  // 質問テンプレート管理コンポーネント
  const QuestionTemplateManager = () => {
    const filteredQuestions = questionTemplates.filter(q => {
      const matchesFilter = templateFilter === 'all' || q.category === templateFilter;
      const matchesSearch = searchQuery === '' || 
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.tags && q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesFilter && matchesSearch;
    });

    const categories = Array.from(new Set(questionTemplates.map(q => q.category)));

    return (
      <div className="space-y-4">
        {/* 検索・フィルタ */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="質問を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのカテゴリ</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsNewQuestionDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新規質問
          </Button>
        </div>

        {/* 質問リスト */}
        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {filteredQuestions.map(question => (
              <Card key={question.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{question.category}</Badge>
                      <Badge variant="secondary">優先度: {question.priority}</Badge>
                      <Badge variant="outline">{question.minDuration}分</Badge>
                    </div>
                    <p className="text-sm font-medium">{question.content}</p>
                    {question.placeholder && (
                      <p className="text-xs text-muted-foreground">
                        ヒント: {question.placeholder}
                      </p>
                    )}
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {question.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingQuestion(question)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyQuestion(question)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <Card className="p-3 text-center">
            <p className="text-sm text-muted-foreground">総質問数</p>
            <p className="text-lg font-bold">{questionTemplates.length}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-sm text-muted-foreground">カスタム質問</p>
            <p className="text-lg font-bold">{customQuestions.length}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-sm text-muted-foreground">カテゴリ数</p>
            <p className="text-lg font-bold">{categories.length}</p>
          </Card>
        </div>
      </div>
    );
  };

  // 質問作成・編集ダイアログ
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
        sectionId: question.sectionId || 'custom',
        departments: question.departments,
        facilityTypes: question.facilityTypes,
        positionLevels: question.positionLevels
      };

      if (isEditing) {
        // 編集の場合
        const updatedQuestions = customQuestions.map(q => 
          q.id === editingQuestion!.id ? questionToSave : q
        );
        setCustomQuestions(updatedQuestions);
        localStorage.setItem('custom_questions_bank', JSON.stringify(updatedQuestions));
      } else {
        // 新規作成の場合
        const updatedQuestions = [...customQuestions, questionToSave];
        setCustomQuestions(updatedQuestions);
        localStorage.setItem('custom_questions_bank', JSON.stringify(updatedQuestions));
      }

      // リセット
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

  // 質問をコピーする関数
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

  // 統計ダッシュボード
  const StatisticsOverview = () => {
    if (!bankStatistics) return null;

    // チャート用データ
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
        {/* ヘッダー統計 */}
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

        {/* チャート */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* バンク別比較 */}
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

          {/* 面談タイプ分布 */}
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
            統合面談バンクシステム（強化版）
          </h2>
          <p className="text-muted-foreground">
            定期・サポート・特別面談の3つのバンクシステムを統合管理
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
          <Sheet open={isTemplateManagerOpen} onOpenChange={setIsTemplateManagerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                質問管理
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[800px] sm:max-w-[800px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  質問テンプレート管理
                </SheetTitle>
                <SheetDescription>
                  面談で使用する質問の管理と新規作成を行います
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <QuestionTemplateManager />
              </div>
            </SheetContent>
          </Sheet>
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

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                質問テンプレート管理
              </CardTitle>
              <CardDescription>
                570問以上の標準質問とカスタム質問を管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionTemplateManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 質問編集ダイアログ */}
      <QuestionEditorDialog />
    </div>
  );
}