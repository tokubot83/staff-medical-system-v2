'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  CheckCircle,
  AlertCircle,
  Tag
} from 'lucide-react';

import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { BankQuestion, QuestionCategory, ExperienceLevel } from '@/lib/interview-bank/types';

interface QuestionFormData {
  id?: string;
  text: string;
  category: QuestionCategory;
  type: 'open' | 'choice' | 'scale';
  options?: string[];
  targetExperience?: ExperienceLevel[];
  targetPosition?: string[];
  priority: number;
  isRequired: boolean;
  tags: string[];
  guideText?: string;
  followUpQuestions?: string[];
}

export default function QuestionBankManager() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

  const bankService = InterviewBankService.getInstance();

  const categories: QuestionCategory[] = [
    'current_situation',
    'work_content',
    'workplace_environment',
    'relationships',
    'skills_growth',
    'career_development',
    'motivation',
    'challenges',
    'health_wellness',
    'feedback',
    'other'
  ];

  const experienceLevels: ExperienceLevel[] = ['rookie', 'junior', 'mid', 'senior'];

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, categoryFilter, experienceFilter]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const repository = (bankService as any).repository;
      const result = await repository.searchQuestions({ isActive: true });
      setQuestions(result);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(q => q.question.category === categoryFilter);
    }

    if (experienceFilter !== 'all') {
      filtered = filtered.filter(q =>
        q.question.targetExperience?.includes(experienceFilter)
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleAddQuestion = async (formData: QuestionFormData) => {
    try {
      const question: BankQuestion = {
        id: '',
        text: formData.text,
        category: formData.category,
        type: formData.type,
        options: formData.options,
        targetExperience: formData.targetExperience,
        targetPosition: formData.targetPosition,
        priority: formData.priority,
        isRequired: formData.isRequired,
        guideText: formData.guideText,
        followUpQuestions: formData.followUpQuestions
      };

      await bankService.addQuestion(question, formData.tags);
      await loadQuestions();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };

  const handleEditQuestion = async (formData: QuestionFormData) => {
    if (!formData.id) return;

    try {
      const repository = (bankService as any).repository;
      await repository.updateQuestion(formData.id, {
        text: formData.text,
        category: formData.category,
        type: formData.type,
        options: formData.options,
        targetExperience: formData.targetExperience,
        targetPosition: formData.targetPosition,
        priority: formData.priority,
        isRequired: formData.isRequired,
        guideText: formData.guideText,
        followUpQuestions: formData.followUpQuestions
      });

      await loadQuestions();
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('この質問を削除してもよろしいですか？')) return;

    try {
      const repository = (bankService as any).repository;
      await repository.deleteQuestion(id);
      await loadQuestions();
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`選択した${selectedQuestions.size}件の質問を削除してもよろしいですか？`)) return;

    try {
      const repository = (bankService as any).repository;
      for (const id of selectedQuestions) {
        await repository.deleteQuestion(id);
      }
      setSelectedQuestions(new Set());
      await loadQuestions();
    } catch (error) {
      console.error('Failed to delete questions:', error);
    }
  };

  const handleExport = async () => {
    try {
      const data = await bankService.exportData('json');
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `question-bank-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export questions:', error);
    }
  };

  const QuestionForm = ({ 
    question, 
    onSubmit 
  }: { 
    question?: QuestionFormData | null; 
    onSubmit: (data: QuestionFormData) => void;
  }) => {
    const [formData, setFormData] = useState<QuestionFormData>(
      question || {
        text: '',
        category: 'current_situation',
        type: 'open',
        priority: 2,
        isRequired: false,
        tags: [],
        targetExperience: [],
        targetPosition: []
      }
    );

    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const addTag = () => {
      if (tagInput && !formData.tags.includes(tagInput)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput]
        });
        setTagInput('');
      }
    };

    const removeTag = (tag: string) => {
      setFormData({
        ...formData,
        tags: formData.tags.filter(t => t !== tag)
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">質問文 *</Label>
          <Textarea
            id="text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            required
            rows={3}
            placeholder="例: 現在の業務で最も充実感を感じる瞬間はどんな時ですか？"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">カテゴリ *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: QuestionCategory) => 
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_situation">現在の状況</SelectItem>
                <SelectItem value="work_content">業務内容</SelectItem>
                <SelectItem value="workplace_environment">職場環境</SelectItem>
                <SelectItem value="relationships">人間関係</SelectItem>
                <SelectItem value="skills_growth">スキル・成長</SelectItem>
                <SelectItem value="career_development">キャリア開発</SelectItem>
                <SelectItem value="motivation">モチベーション</SelectItem>
                <SelectItem value="challenges">課題・悩み</SelectItem>
                <SelectItem value="health_wellness">健康・ウェルネス</SelectItem>
                <SelectItem value="feedback">フィードバック</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">質問タイプ *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'open' | 'choice' | 'scale') => 
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">自由記述</SelectItem>
                <SelectItem value="choice">選択式</SelectItem>
                <SelectItem value="scale">スケール評価</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>対象経験レベル</Label>
            <div className="flex flex-wrap gap-2">
              {experienceLevels.map(level => (
                <label key={level} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={formData.targetExperience?.includes(level)}
                    onChange={(e) => {
                      const current = formData.targetExperience || [];
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          targetExperience: [...current, level]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          targetExperience: current.filter(l => l !== level)
                        });
                      }
                    }}
                  />
                  <span className="text-sm">
                    {level === 'rookie' ? '新人' :
                     level === 'junior' ? '若手' :
                     level === 'mid' ? '中堅' : 'ベテラン'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">優先度</Label>
            <Select
              value={String(formData.priority)}
              onValueChange={(value) => 
                setFormData({ ...formData, priority: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">高（必須）</SelectItem>
                <SelectItem value="2">中（推奨）</SelectItem>
                <SelectItem value="3">低（オプション）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guideText">ガイドテキスト（任意）</Label>
          <Textarea
            id="guideText"
            value={formData.guideText || ''}
            onChange={(e) => setFormData({ ...formData, guideText: e.target.value })}
            rows={2}
            placeholder="面談者向けのガイドや質問の意図を記載"
          />
        </div>

        <div className="space-y-2">
          <Label>タグ</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="タグを入力"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" onClick={addTag} variant="outline">
              追加
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-xs hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="isRequired"
            checked={formData.isRequired}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, isRequired: checked })
            }
          />
          <Label htmlFor="isRequired">必須質問として設定</Label>
        </div>

        <DialogFooter>
          <Button type="submit">
            {question ? '更新' : '追加'}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <div className="space-y-4">
      {/* ツールバー */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="質問を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'current_situation' ? '現在の状況' :
                   cat === 'work_content' ? '業務内容' :
                   cat === 'workplace_environment' ? '職場環境' :
                   cat === 'relationships' ? '人間関係' :
                   cat === 'skills_growth' ? 'スキル・成長' :
                   cat === 'career_development' ? 'キャリア開発' :
                   cat === 'motivation' ? 'モチベーション' :
                   cat === 'challenges' ? '課題・悩み' :
                   cat === 'health_wellness' ? '健康・ウェルネス' :
                   cat === 'feedback' ? 'フィードバック' : 'その他'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="経験レベル" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="rookie">新人</SelectItem>
              <SelectItem value="junior">若手</SelectItem>
              <SelectItem value="mid">中堅</SelectItem>
              <SelectItem value="senior">ベテラン</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {selectedQuestions.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              選択削除 ({selectedQuestions.size})
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1" />
            エクスポート
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                質問を追加
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新規質問の追加</DialogTitle>
                <DialogDescription>
                  面談バンクに新しい質問を追加します
                </DialogDescription>
              </DialogHeader>
              <QuestionForm onSubmit={handleAddQuestion} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 質問リスト */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuestions(new Set(filteredQuestions.map(q => q.id)));
                      } else {
                        setSelectedQuestions(new Set());
                      }
                    }}
                    checked={selectedQuestions.size === filteredQuestions.length && filteredQuestions.length > 0}
                  />
                </TableHead>
                <TableHead>質問文</TableHead>
                <TableHead className="w-32">カテゴリ</TableHead>
                <TableHead className="w-24">タイプ</TableHead>
                <TableHead className="w-32">対象</TableHead>
                <TableHead className="w-20">優先度</TableHead>
                <TableHead className="w-20">使用回数</TableHead>
                <TableHead className="w-24">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    質問が見つかりません
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedQuestions.has(item.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedQuestions);
                          if (e.target.checked) {
                            newSelected.add(item.id);
                          } else {
                            newSelected.delete(item.id);
                          }
                          setSelectedQuestions(newSelected);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.question.text}</p>
                        {item.question.guideText && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.question.guideText}
                          </p>
                        )}
                        {item.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {item.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {item.question.category === 'current_situation' ? '現在の状況' :
                         item.question.category === 'work_content' ? '業務内容' :
                         item.question.category === 'workplace_environment' ? '職場環境' :
                         item.question.category === 'relationships' ? '人間関係' :
                         item.question.category === 'skills_growth' ? 'スキル・成長' :
                         item.question.category === 'career_development' ? 'キャリア開発' :
                         item.question.category === 'motivation' ? 'モチベーション' :
                         item.question.category === 'challenges' ? '課題・悩み' :
                         item.question.category === 'health_wellness' ? '健康・ウェルネス' :
                         item.question.category === 'feedback' ? 'フィードバック' : 'その他'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {item.question.type === 'open' ? '自由記述' :
                         item.question.type === 'choice' ? '選択式' : 'スケール'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.question.targetExperience?.map((level: string) => (
                          <Badge key={level} variant="outline" className="text-xs">
                            {level === 'rookie' ? '新人' :
                             level === 'junior' ? '若手' :
                             level === 'mid' ? '中堅' : 'ベテラン'}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        item.question.priority === 1 ? 'destructive' :
                        item.question.priority === 2 ? 'default' : 'secondary'
                      }>
                        {item.question.priority === 1 ? '高' :
                         item.question.priority === 2 ? '中' : '低'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.usageCount || 0}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingQuestion({
                              id: item.id,
                              text: item.question.text,
                              category: item.question.category,
                              type: item.question.type,
                              options: item.question.options,
                              targetExperience: item.question.targetExperience,
                              targetPosition: item.question.targetPosition,
                              priority: item.question.priority,
                              isRequired: item.question.isRequired,
                              tags: item.tags,
                              guideText: item.question.guideText,
                              followUpQuestions: item.question.followUpQuestions
                            });
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>質問の編集</DialogTitle>
            <DialogDescription>
              質問の内容を編集します
            </DialogDescription>
          </DialogHeader>
          {editingQuestion && (
            <QuestionForm
              question={editingQuestion}
              onSubmit={handleEditQuestion}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}