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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  Save,
  Settings
} from 'lucide-react';

import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { BankSection } from '@/lib/interview-bank/types';

interface SectionFormData {
  id?: string;
  title: string;
  description?: string;
  order: number;
  priority: number;
  isRequired: boolean;
  minQuestions?: number;
  maxQuestions?: number;
  targetExperience: string[];
  targetPosition: string[];
  facilityTypes: string[];
  departments: string[];
  questionCategories: string[];
}

export default function SectionDefinitionEditor() {
  const [sections, setSections] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionFormData | null>(null);
  const [loading, setLoading] = useState(false);

  const bankService = InterviewBankService.getInstance();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const repository = (bankService as any).repository;
      const result = await repository.getSectionDefinitions({ isActive: true });
      setSections(result.sort((a: any, b: any) => a.section.order - b.section.order));
    } catch (error) {
      console.error('Failed to load sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (formData: SectionFormData) => {
    try {
      const section: BankSection = {
        id: '',
        title: formData.title,
        description: formData.description,
        order: formData.order,
        questions: [],
        isRequired: formData.isRequired,
        minQuestions: formData.minQuestions,
        maxQuestions: formData.maxQuestions
      };

      await bankService.addSection(section, {
        experienceLevels: formData.targetExperience,
        positions: formData.targetPosition,
        facilityTypes: formData.facilityTypes,
        departments: formData.departments
      });

      await loadSections();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add section:', error);
    }
  };

  const handleUpdateSection = async (id: string, updates: Partial<SectionFormData>) => {
    try {
      const repository = (bankService as any).repository;
      await repository.updateSectionDefinition(id, {
        section: {
          title: updates.title,
          description: updates.description,
          order: updates.order,
          isRequired: updates.isRequired,
          minQuestions: updates.minQuestions,
          maxQuestions: updates.maxQuestions
        },
        applicableTo: {
          experienceLevels: updates.targetExperience,
          positions: updates.targetPosition,
          facilityTypes: updates.facilityTypes,
          departments: updates.departments
        },
        priority: updates.priority
      });

      await loadSections();
      setEditingSection(null);
    } catch (error) {
      console.error('Failed to update section:', error);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('このセクションを削除してもよろしいですか？')) return;

    try {
      const repository = (bankService as any).repository;
      await repository.updateSectionDefinition(id, { isActive: false });
      await loadSections();
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handleReorderSection = async (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[newIndex];
    newSections[newIndex] = temp;

    // 順序を更新
    for (let i = 0; i < newSections.length; i++) {
      newSections[i].section.order = i + 1;
    }

    setSections(newSections);

    // DBを更新
    try {
      const repository = (bankService as any).repository;
      for (const section of newSections) {
        await repository.updateSectionDefinition(section.id, {
          section: { ...section.section, order: section.section.order }
        });
      }
    } catch (error) {
      console.error('Failed to reorder sections:', error);
      await loadSections(); // エラー時は再読み込み
    }
  };

  const SectionForm = ({
    section,
    onSubmit,
    onCancel
  }: {
    section?: SectionFormData | null;
    onSubmit: (data: SectionFormData) => void;
    onCancel?: () => void;
  }) => {
    const [formData, setFormData] = useState<SectionFormData>(
      section || {
        title: '',
        description: '',
        order: sections.length + 1,
        priority: 1,
        isRequired: false,
        minQuestions: 1,
        maxQuestions: 5,
        targetExperience: [],
        targetPosition: [],
        facilityTypes: [],
        departments: [],
        questionCategories: []
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">セクション名 *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="例: 現在の業務について"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            placeholder="このセクションの目的や内容を説明"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="order">表示順序</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minQuestions">最小質問数</Label>
            <Input
              id="minQuestions"
              type="number"
              min="0"
              value={formData.minQuestions || 1}
              onChange={(e) => setFormData({ ...formData, minQuestions: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxQuestions">最大質問数</Label>
            <Input
              id="maxQuestions"
              type="number"
              min="1"
              value={formData.maxQuestions || 5}
              onChange={(e) => setFormData({ ...formData, maxQuestions: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>適用条件</Label>
          
          <div className="space-y-3">
            <div>
              <Label className="text-sm">経験レベル</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {['rookie', 'junior', 'mid', 'senior'].map(level => (
                  <label key={level} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.targetExperience.includes(level)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            targetExperience: [...formData.targetExperience, level]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            targetExperience: formData.targetExperience.filter(l => l !== level)
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

            <div>
              <Label className="text-sm">施設タイプ</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {['acute', 'chronic', 'elderly', 'group-home'].map(type => (
                  <label key={type} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.facilityTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            facilityTypes: [...formData.facilityTypes, type]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            facilityTypes: formData.facilityTypes.filter(t => t !== type)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">
                      {type === 'acute' ? '急性期' :
                       type === 'chronic' ? '慢性期' :
                       type === 'elderly' ? '老健' : 'グループホーム'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
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
          <Label htmlFor="isRequired">必須セクションとして設定</Label>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
          )}
          <Button type="submit">
            {section ? '更新' : '追加'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">セクション構成</h3>
          <p className="text-sm text-muted-foreground">
            面談シートのセクション構成と表示条件を管理します
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          セクションを追加
        </Button>
      </div>

      {/* セクションリスト */}
      {loading ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      ) : sections.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            セクションが登録されていません
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {sections.map((section, index) => (
            <AccordionItem key={section.id} value={section.id}>
              <Card>
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorderSection(section.id, 'up');
                          }}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorderSection(section.id, 'down');
                          }}
                          disabled={index === sections.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{section.section.title}</span>
                          {section.isRequired && (
                            <Badge variant="destructive" className="text-xs">必須</Badge>
                          )}
                        </div>
                        {section.section.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {section.section.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {section.section.minQuestions}-{section.section.maxQuestions}問
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSection({
                              id: section.id,
                              title: section.section.title,
                              description: section.section.description,
                              order: section.section.order,
                              priority: section.priority,
                              isRequired: section.isRequired,
                              minQuestions: section.section.minQuestions,
                              maxQuestions: section.section.maxQuestions,
                              targetExperience: section.applicableTo?.experienceLevels || [],
                              targetPosition: section.applicableTo?.positions || [],
                              facilityTypes: section.applicableTo?.facilityTypes || [],
                              departments: section.applicableTo?.departments || [],
                              questionCategories: []
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(section.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-4 pb-4">
                  {editingSection?.id === section.id ? (
                    <div className="pt-4">
                      <SectionForm
                        section={editingSection}
                        onSubmit={(data) => handleUpdateSection(section.id, data)}
                        onCancel={() => setEditingSection(null)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 pt-4">
                      <div>
                        <Label className="text-sm">適用条件</Label>
                        <div className="mt-2 space-y-2">
                          {section.applicableTo?.experienceLevels?.length > 0 && (
                            <div className="flex gap-2">
                              <span className="text-sm text-muted-foreground">経験レベル:</span>
                              {section.applicableTo.experienceLevels.map((level: string) => (
                                <Badge key={level} variant="secondary" className="text-xs">
                                  {level === 'rookie' ? '新人' :
                                   level === 'junior' ? '若手' :
                                   level === 'mid' ? '中堅' : 'ベテラン'}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {section.applicableTo?.facilityTypes?.length > 0 && (
                            <div className="flex gap-2">
                              <span className="text-sm text-muted-foreground">施設タイプ:</span>
                              {section.applicableTo.facilityTypes.map((type: string) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {type === 'acute' ? '急性期' :
                                   type === 'chronic' ? '慢性期' :
                                   type === 'elderly' ? '老健' : 'グループホーム'}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm">セクション設定</Label>
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">表示順序: </span>
                            <span className="font-medium">{section.section.order}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">優先度: </span>
                            <span className="font-medium">
                              {section.priority === 1 ? '高' :
                               section.priority === 2 ? '中' : '低'}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">質問数: </span>
                            <span className="font-medium">
                              {section.section.minQuestions}-{section.section.maxQuestions}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* 追加ダイアログ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新規セクションの追加</DialogTitle>
            <DialogDescription>
              面談シートに新しいセクションを追加します
            </DialogDescription>
          </DialogHeader>
          <SectionForm
            onSubmit={(data) => {
              handleAddSection(data);
              setIsAddDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}