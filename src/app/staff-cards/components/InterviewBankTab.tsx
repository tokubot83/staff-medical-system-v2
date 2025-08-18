'use client';

/**
 * 職員カルテ - 面談バンクタブコンポーネント
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
  DialogTrigger,
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
import { Separator } from '@/components/ui/separator';
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
  Shield,
  Plus,
  Search,
  Settings,
  Edit,
  Trash2,
  Save,
  Copy,
  Database,
  BookOpen,
  Filter,
  Tag,
  Import,
  Download
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

  const bankService = InterviewBankService.getInstance();

  useEffect(() => {
    loadInterviewData();
    loadQuestionTemplates();
  }, [staffId, filterType, selectedPeriod]);

  const loadQuestionTemplates = async () => {
    try {
      // 標準質問バンクを読み込み
      const allQuestions = [...questionBank, ...supportQuestions];
      setQuestionTemplates(allQuestions);
      
      // カスタム質問を読み込み（localStorage から）
      const savedCustomQuestions = localStorage.getItem(`custom_questions_${staffId}`);
      if (savedCustomQuestions) {
        setCustomQuestions(JSON.parse(savedCustomQuestions));
      }
    } catch (error) {
      console.error('Failed to load question templates:', error);
    }
  };

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
        <ScrollArea className="h-96">
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
        localStorage.setItem(`custom_questions_${staffId}`, JSON.stringify(updatedQuestions));
      } else {
        // 新規作成の場合
        const updatedQuestions = [...customQuestions, questionToSave];
        setCustomQuestions(updatedQuestions);
        localStorage.setItem(`custom_questions_${staffId}`, JSON.stringify(updatedQuestions));
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
    localStorage.setItem(`custom_questions_${staffId}`, JSON.stringify(updatedQuestions));
  };

  // カスタム質問セット管理
  const CustomQuestionSets = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">カスタム質問セット</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Import className="h-4 w-4 mr-2" />
              インポート
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              エクスポート
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {customQuestions.length === 0 ? (
            <Card className="p-6 text-center">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">カスタム質問がありません</p>
              <p className="text-sm text-muted-foreground mt-2">
                「新規質問」ボタンから質問を作成してください
              </p>
            </Card>
          ) : (
            customQuestions.map(question => (
              <Card key={question.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{question.category}</Badge>
                      <Badge variant="secondary">カスタム</Badge>
                    </div>
                    <p className="font-medium mb-1">{question.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {question.type} · {question.minDuration}分 · 優先度{question.priority}
                    </p>
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
                      onClick={() => {
                        const updatedQuestions = customQuestions.filter(q => q.id !== question.id);
                        setCustomQuestions(updatedQuestions);
                        localStorage.setItem(`custom_questions_${staffId}`, JSON.stringify(updatedQuestions));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
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
          <Sheet open={isTemplateManagerOpen} onOpenChange={setIsTemplateManagerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
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
                <Tabs defaultValue="templates" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="templates">標準テンプレート</TabsTrigger>
                    <TabsTrigger value="custom">カスタム質問</TabsTrigger>
                    <TabsTrigger value="support">サポート質問</TabsTrigger>
                  </TabsList>
                  <TabsContent value="templates">
                    <QuestionTemplateManager />
                  </TabsContent>
                  <TabsContent value="custom">
                    <CustomQuestionSets />
                  </TabsContent>
                  <TabsContent value="support">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">サポート面談質問バンク</h3>
                      <div className="grid gap-2">
                        {Object.entries(supportQuestionsByCategory).map(([category, questionIds]) => (
                          <Card key={category} className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{category}</p>
                                <p className="text-sm text-muted-foreground">
                                  {questionIds.length}問の質問
                                </p>
                              </div>
                              <Badge variant="outline">
                                VoiceDrive連携
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
          <Button>
            新規面談を開始
          </Button>
        </div>
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

      {/* 質問編集ダイアログ */}
      <QuestionEditorDialog />
    </div>
  );
}