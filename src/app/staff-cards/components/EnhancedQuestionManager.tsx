'use client';

import React, { useState, useCallback, useMemo } from 'react';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  Copy,
  Import,
  Download,
  ChevronRight,
  GripVertical,
  Filter,
  Tag,
  Clock,
  Users,
  CheckSquare,
  Square,
  FileUp,
  FileDown,
  Settings2,
  Package,
  Layers,
  User,
  UserCheck,
  UserPlus,
  Award,
  AlertCircle,
  Info,
} from 'lucide-react';
import { BankQuestion } from '@/lib/interview-bank/types';

interface EnhancedQuestionManagerProps {
  questions: BankQuestion[];
  customQuestions: BankQuestion[];
  onQuestionsUpdate: (questions: BankQuestion[]) => void;
  onCustomQuestionsUpdate: (questions: BankQuestion[]) => void;
  staffId: string;
}

// 質問セクションの定義
const questionSections = [
  { id: 'basic', name: '基本情報', icon: Info, color: 'blue' },
  { id: 'workplace', name: '職場環境', icon: Users, color: 'green' },
  { id: 'career', name: 'キャリア・成長', icon: Award, color: 'purple' },
  { id: 'skills', name: 'スキル・専門性', icon: Package, color: 'orange' },
  { id: 'challenges', name: '課題・困難', icon: AlertCircle, color: 'red' },
  { id: 'personal', name: '個人的状況', icon: User, color: 'pink' },
  { id: 'other', name: 'その他', icon: Layers, color: 'gray' },
];

// 経験年数レベルの定義
const experienceLevels = [
  { id: 'new', label: '新人（1年未満）', icon: UserPlus, years: [0, 1] },
  { id: 'junior', label: '若手（1-3年）', icon: User, years: [1, 3] },
  { id: 'midlevel', label: '中堅（3-10年）', icon: UserCheck, years: [3, 10] },
  { id: 'veteran', label: 'ベテラン（10年以上）', icon: Award, years: [10, 100] },
];

// ドラッグ可能な質問アイテムコンポーネント
function SortableQuestionItem({ 
  question, 
  onEdit, 
  onDelete, 
  onToggle,
  isSelected 
}: { 
  question: BankQuestion;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  isSelected: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? 'z-50' : ''}`}
    >
      <Card className={`p-3 ${isSelected ? 'ring-2 ring-primary' : ''} hover:shadow-md transition-all`}>
        <div className="flex items-start gap-3">
          <button
            className="mt-1 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            className="mt-1"
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {question.category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                優先度: {question.priority}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {question.minDuration}分
              </Badge>
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
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex gap-1">
              {question.experienceLevels?.map(level => {
                const expLevel = experienceLevels.find(el => el.id === level);
                return expLevel ? (
                  <Badge key={level} variant="outline" className="text-xs">
                    {expLevel.label}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function EnhancedQuestionManager({
  questions,
  customQuestions,
  onQuestionsUpdate,
  onCustomQuestionsUpdate,
  staffId
}: EnhancedQuestionManagerProps) {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isBulkAddDialogOpen, setIsBulkAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BankQuestion | null>(null);
  const [importText, setImportText] = useState('');
  const [bulkAddSection, setBulkAddSection] = useState('');
  const [bulkAddExperience, setBulkAddExperience] = useState<string[]>([]);
  const [bulkAddQuestions, setBulkAddQuestions] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 全質問を結合
  const allQuestions = useMemo(() => {
    return [...questions, ...customQuestions];
  }, [questions, customQuestions]);

  // セクション別に質問をグループ化
  const questionsBySection = useMemo(() => {
    const grouped: Record<string, BankQuestion[]> = {};
    
    questionSections.forEach(section => {
      grouped[section.id] = [];
    });
    
    allQuestions.forEach(question => {
      const sectionId = question.sectionId || 'other';
      if (!grouped[sectionId]) {
        grouped[sectionId] = [];
      }
      grouped[sectionId].push(question);
    });
    
    return grouped;
  }, [allQuestions]);

  // フィルタリングされた質問
  const filteredQuestions = useMemo(() => {
    let filtered = allQuestions;
    
    // セクションフィルタ
    if (selectedSection !== 'all') {
      filtered = filtered.filter(q => (q.sectionId || 'other') === selectedSection);
    }
    
    // 経験年数フィルタ
    if (selectedExperience !== 'all') {
      filtered = filtered.filter(q => 
        q.experienceLevels?.includes(selectedExperience as any) ?? false
      );
    }
    
    // 検索フィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.content.toLowerCase().includes(query) ||
        q.category?.toLowerCase().includes(query) ||
        q.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [allQuestions, selectedSection, selectedExperience, searchQuery]);

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = filteredQuestions.findIndex(q => q.id === active.id);
      const newIndex = filteredQuestions.findIndex(q => q.id === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(filteredQuestions, oldIndex, newIndex);
        
        // カスタム質問の更新
        const updatedCustom = reordered.filter(q => 
          customQuestions.some(cq => cq.id === q.id)
        );
        onCustomQuestionsUpdate(updatedCustom);
      }
    }
  };

  // 全選択/全解除
  const toggleAllQuestions = () => {
    if (selectedQuestions.size === filteredQuestions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(filteredQuestions.map(q => q.id)));
    }
  };

  // 個別選択/解除
  const toggleQuestion = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  // 一括削除
  const handleBulkDelete = () => {
    const updatedCustom = customQuestions.filter(q => !selectedQuestions.has(q.id));
    onCustomQuestionsUpdate(updatedCustom);
    setSelectedQuestions(new Set());
  };

  // エクスポート
  const handleExport = () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      questions: customQuestions,
      sections: questionSections,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-questions-${staffId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // インポート処理
  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      if (data.questions && Array.isArray(data.questions)) {
        const importedQuestions = data.questions.map((q: any) => ({
          ...q,
          id: `imported_${Date.now()}_${Math.random()}`,
        }));
        onCustomQuestionsUpdate([...customQuestions, ...importedQuestions]);
        setIsImportDialogOpen(false);
        setImportText('');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('インポートに失敗しました。JSONフォーマットを確認してください。');
    }
  };

  // 一括追加処理
  const handleBulkAdd = () => {
    const questionLines = bulkAddQuestions.split('\n').filter(line => line.trim());
    const newQuestions: BankQuestion[] = questionLines.map((content, index) => ({
      id: `bulk_${Date.now()}_${index}`,
      content: content.trim(),
      type: 'textarea',
      category: bulkAddSection || 'general',
      sectionId: bulkAddSection || 'other',
      priority: 2,
      minDuration: 15,
      tags: [],
      experienceLevels: bulkAddExperience as any[],
    }));
    
    onCustomQuestionsUpdate([...customQuestions, ...newQuestions]);
    setIsBulkAddDialogOpen(false);
    setBulkAddQuestions('');
    setBulkAddSection('');
    setBulkAddExperience([]);
  };

  // 統計情報の計算
  const statistics = useMemo(() => {
    const totalQuestions = allQuestions.length;
    const customCount = customQuestions.length;
    const totalDuration = allQuestions.reduce((sum, q) => sum + (q.minDuration || 15), 0);
    const sectionCounts = Object.entries(questionsBySection).map(([sectionId, questions]) => ({
      sectionId,
      count: questions.length,
      duration: questions.reduce((sum, q) => sum + (q.minDuration || 15), 0),
    }));
    
    return {
      totalQuestions,
      customCount,
      totalDuration,
      sectionCounts,
    };
  }, [allQuestions, customQuestions, questionsBySection]);

  return (
    <div className="space-y-6">
      {/* ヘッダー・統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              質問管理ダッシュボード
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsImportDialogOpen(true)}>
                <FileUp className="h-4 w-4 mr-2" />
                インポート
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{statistics.totalQuestions}</p>
              <p className="text-sm text-muted-foreground">総質問数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{statistics.customCount}</p>
              <p className="text-sm text-muted-foreground">カスタム質問</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{Math.floor(statistics.totalDuration / 60)}時間</p>
              <p className="text-sm text-muted-foreground">総推定時間</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{questionSections.length}</p>
              <p className="text-sm text-muted-foreground">セクション数</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* フィルタ・検索バー */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="質問を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="セクション" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのセクション</SelectItem>
                {questionSections.map(section => (
                  <SelectItem key={section.id} value={section.id}>
                    <span className="flex items-center gap-2">
                      <section.icon className="h-4 w-4" />
                      {section.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedExperience} onValueChange={setSelectedExperience}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="経験年数" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての経験年数</SelectItem>
                {experienceLevels.map(level => (
                  <SelectItem key={level.id} value={level.id}>
                    <span className="flex items-center gap-2">
                      <level.icon className="h-4 w-4" />
                      {level.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={() => setIsBulkAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              一括追加
            </Button>
          </div>
          
          {/* 選択ツールバー */}
          {selectedQuestions.size > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg flex items-center justify-between">
              <span className="text-sm">
                {selectedQuestions.size}個の質問を選択中
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  削除
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedQuestions(new Set())}>
                  選択解除
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* セクション別質問表示 */}
      <Tabs defaultValue="accordion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accordion">セクション表示</TabsTrigger>
          <TabsTrigger value="list">リスト表示</TabsTrigger>
          <TabsTrigger value="experience">経験年数別</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accordion">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedQuestions.size === filteredQuestions.length && filteredQuestions.length > 0}
                    onCheckedChange={toggleAllQuestions}
                  />
                  すべて選択
                </Label>
              </div>
              
              <Accordion type="multiple" className="space-y-2">
                {questionSections.map(section => {
                  const sectionQuestions = questionsBySection[section.id] || [];
                  const filteredSectionQuestions = sectionQuestions.filter(q => 
                    filteredQuestions.includes(q)
                  );
                  
                  if (filteredSectionQuestions.length === 0 && selectedSection !== 'all') {
                    return null;
                  }
                  
                  return (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-2">
                            <section.icon className="h-4 w-4" />
                            <span>{section.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {filteredSectionQuestions.length}問
                            </Badge>
                            <Badge variant="secondary">
                              {Math.floor(
                                filteredSectionQuestions.reduce((sum, q) => sum + (q.minDuration || 15), 0) / 60
                              )}時間
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={filteredSectionQuestions.map(q => q.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {filteredSectionQuestions.map(question => (
                                <SortableQuestionItem
                                  key={question.id}
                                  question={question}
                                  isSelected={selectedQuestions.has(question.id)}
                                  onToggle={() => toggleQuestion(question.id)}
                                  onEdit={() => setEditingQuestion(question)}
                                  onDelete={() => {
                                    const updated = customQuestions.filter(q => q.id !== question.id);
                                    onCustomQuestionsUpdate(updated);
                                  }}
                                />
                              ))}
                              {filteredSectionQuestions.length === 0 && (
                                <Card className="p-4 text-center text-muted-foreground">
                                  このセクションに質問はありません
                                </Card>
                              )}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-[600px]">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredQuestions.map(q => q.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {filteredQuestions.map(question => (
                        <SortableQuestionItem
                          key={question.id}
                          question={question}
                          isSelected={selectedQuestions.has(question.id)}
                          onToggle={() => toggleQuestion(question.id)}
                          onEdit={() => setEditingQuestion(question)}
                          onDelete={() => {
                            const updated = customQuestions.filter(q => q.id !== question.id);
                            onCustomQuestionsUpdate(updated);
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="experience">
          <div className="grid grid-cols-2 gap-4">
            {experienceLevels.map(level => {
              const levelQuestions = filteredQuestions.filter(q =>
                q.experienceLevels?.includes(level.id as any)
              );
              
              return (
                <Card key={level.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <level.icon className="h-5 w-5" />
                      {level.label}
                    </CardTitle>
                    <CardDescription>
                      {levelQuestions.length}問の質問
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {levelQuestions.map(question => (
                          <Card key={question.id} className="p-3">
                            <p className="text-sm font-medium">{question.content}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {question.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {question.minDuration}分
                              </Badge>
                            </div>
                          </Card>
                        ))}
                        {levelQuestions.length === 0 && (
                          <p className="text-center text-muted-foreground py-4">
                            この経験年数の質問はありません
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* インポートダイアログ */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>質問をインポート</DialogTitle>
            <DialogDescription>
              JSON形式の質問データを貼り付けてください
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="JSONデータを貼り付け..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground">
              <p>フォーマット例:</p>
              <pre className="mt-2 p-2 bg-muted rounded">
{`{
  "questions": [
    {
      "content": "質問内容",
      "category": "カテゴリ",
      "sectionId": "workplace",
      "priority": 1,
      "minDuration": 15,
      "experienceLevels": ["new", "junior"]
    }
  ]
}`}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleImport}>
              <Import className="h-4 w-4 mr-2" />
              インポート
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 一括追加ダイアログ */}
      <Dialog open={isBulkAddDialogOpen} onOpenChange={setIsBulkAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>質問を一括追加</DialogTitle>
            <DialogDescription>
              セクションと経験年数を選択して、質問を一括で追加できます
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>セクション</Label>
                <Select value={bulkAddSection} onValueChange={setBulkAddSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="セクションを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionSections.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        <span className="flex items-center gap-2">
                          <section.icon className="h-4 w-4" />
                          {section.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>対象経験年数</Label>
                <div className="space-y-2">
                  {experienceLevels.map(level => (
                    <div key={level.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={bulkAddExperience.includes(level.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBulkAddExperience([...bulkAddExperience, level.id]);
                          } else {
                            setBulkAddExperience(bulkAddExperience.filter(id => id !== level.id));
                          }
                        }}
                      />
                      <Label className="text-sm cursor-pointer">
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>質問（1行に1つ）</Label>
              <Textarea
                placeholder="質問1&#10;質問2&#10;質問3..."
                value={bulkAddQuestions}
                onChange={(e) => setBulkAddQuestions(e.target.value)}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                各行が1つの質問として追加されます
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkAddDialogOpen(false)}>
              キャンセル
            </Button>
            <Button 
              onClick={handleBulkAdd}
              disabled={!bulkAddSection || bulkAddExperience.length === 0 || !bulkAddQuestions.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}