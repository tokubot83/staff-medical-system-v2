'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Copy, Save, X, FileText, 
  Settings, Star, Clock, User, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  type: 'regular' | 'special' | 'support';
  subType?: string;
  department?: string;
  position?: string;
  experienceLevel?: 'new' | 'experienced' | 'senior' | 'management';
  duration: number; // 分
  isDefault: boolean;
  isActive: boolean;
  sections: TemplateSection[];
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
  usageCount: number;
  tags: string[];
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  isRequired: boolean;
  questions: TemplateQuestion[];
}

export interface TemplateQuestion {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'scale' | 'date';
  options?: string[];
  isRequired: boolean;
  placeholder?: string;
  order: number;
}

interface InterviewTemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: InterviewTemplate) => void;
}

export default function InterviewTemplateManager({
  isOpen,
  onClose,
  onSelectTemplate
}: InterviewTemplateManagerProps) {
  const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<InterviewTemplate | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'regular' | 'special' | 'support'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<InterviewTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  // テンプレートデータの読み込み
  const loadTemplates = () => {
    // 実際の実装では、APIからテンプレートデータを取得
    const mockTemplates: InterviewTemplate[] = [
      {
        id: 'template-1',
        name: '新入職員初回面談テンプレート',
        description: '新入職員の初回面談で使用する標準テンプレート',
        type: 'regular',
        subType: 'new_employee',
        department: 'all',
        position: 'all',
        experienceLevel: 'new',
        duration: 30,
        isDefault: true,
        isActive: true,
        sections: [
          {
            id: 'section-1',
            title: '基本情報確認',
            description: '職員の基本情報と配属状況の確認',
            order: 1,
            isRequired: true,
            questions: [
              {
                id: 'q1',
                text: '現在の業務内容について教えてください',
                type: 'textarea',
                isRequired: true,
                placeholder: '担当している業務や役割について',
                order: 1
              },
              {
                id: 'q2',
                text: '職場環境についてどう感じていますか？',
                type: 'select',
                options: ['非常に良い', '良い', '普通', '改善が必要', '不満'],
                isRequired: true,
                order: 2
              }
            ]
          },
          {
            id: 'section-2',
            title: '目標設定',
            description: '今後の目標と成長計画',
            order: 2,
            isRequired: true,
            questions: [
              {
                id: 'q3',
                text: '3ヶ月後の目標を教えてください',
                type: 'textarea',
                isRequired: true,
                placeholder: '具体的な目標や達成したいこと',
                order: 1
              }
            ]
          }
        ],
        createdAt: new Date('2024-01-15'),
        createdBy: '田中師長',
        usageCount: 45,
        tags: ['新入職員', '初回', '基本']
      },
      {
        id: 'template-2',
        name: '年次面談テンプレート',
        description: '年次面談で使用する標準テンプレート',
        type: 'regular',
        subType: 'annual',
        department: 'all',
        position: 'all',
        experienceLevel: 'experienced',
        duration: 45,
        isDefault: true,
        isActive: true,
        sections: [
          {
            id: 'section-3',
            title: '1年間の振り返り',
            order: 1,
            isRequired: true,
            questions: [
              {
                id: 'q4',
                text: 'この1年間で最も成長したと感じる点は？',
                type: 'textarea',
                isRequired: true,
                order: 1
              },
              {
                id: 'q5',
                text: '今年度の目標達成度（1-10）',
                type: 'scale',
                isRequired: true,
                order: 2
              }
            ]
          }
        ],
        createdAt: new Date('2024-02-01'),
        createdBy: '鈴木主任',
        usageCount: 23,
        tags: ['年次', '評価', '目標']
      },
      {
        id: 'template-3',
        name: 'キャリア相談テンプレート',
        description: 'キャリア相談面談用のテンプレート',
        type: 'support',
        subType: 'career',
        duration: 60,
        isDefault: false,
        isActive: true,
        sections: [
          {
            id: 'section-4',
            title: 'キャリアプラン',
            order: 1,
            isRequired: true,
            questions: [
              {
                id: 'q6',
                text: '将来のキャリアビジョンを教えてください',
                type: 'textarea',
                isRequired: true,
                order: 1
              },
              {
                id: 'q7',
                text: '希望する研修やスキルアップ',
                type: 'checkbox',
                options: ['認定看護師', '専門看護師', 'リーダー研修', 'マネジメント研修', 'その他'],
                isRequired: false,
                order: 2
              }
            ]
          }
        ],
        createdAt: new Date('2024-02-15'),
        createdBy: '佐々木師長',
        usageCount: 12,
        tags: ['キャリア', '相談', 'スキルアップ']
      }
    ];

    setTemplates(mockTemplates);
  };

  // テンプレート作成・編集
  const handleSaveTemplate = (template: InterviewTemplate) => {
    if (isCreateMode) {
      const newTemplate = {
        ...template,
        id: `template-${Date.now()}`,
        createdAt: new Date(),
        usageCount: 0
      };
      setTemplates(prev => [...prev, newTemplate]);
    } else {
      setTemplates(prev => prev.map(t => 
        t.id === template.id ? { ...template, updatedAt: new Date() } : t
      ));
    }
    setEditingTemplate(null);
    setIsCreateMode(false);
  };

  // テンプレート削除
  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('このテンプレートを削除しますか？')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  // テンプレート複製
  const handleDuplicateTemplate = (template: InterviewTemplate) => {
    const duplicated: InterviewTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (コピー)`,
      isDefault: false,
      createdAt: new Date(),
      usageCount: 0
    };
    setTemplates(prev => [...prev, duplicated]);
  };

  // フィルタリング
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesType && template.isActive;
  });

  // テンプレートタイプラベル
  const getTypeLabel = (type: string) => {
    const labels = {
      regular: '定期面談',
      special: '特別面談',
      support: 'サポート面談'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // 経験レベルラベル
  const getExperienceLevelLabel = (level?: string) => {
    const labels = {
      new: '新入職員',
      experienced: '一般職員',
      senior: 'ベテラン',
      management: '管理職'
    };
    return level ? labels[level as keyof typeof labels] || level : '全レベル';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-blue-600" />
            面談テンプレート管理
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* サイドバー - テンプレート一覧 */}
          <div className="w-80 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4">
              {/* 検索・フィルター */}
              <div className="space-y-3 mb-4">
                <Input
                  placeholder="テンプレートを検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全てのタイプ</SelectItem>
                    <SelectItem value="regular">定期面談</SelectItem>
                    <SelectItem value="special">特別面談</SelectItem>
                    <SelectItem value="support">サポート面談</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => {
                    setIsCreateMode(true);
                    setEditingTemplate({
                      id: '',
                      name: '',
                      description: '',
                      type: 'regular',
                      duration: 30,
                      isDefault: false,
                      isActive: true,
                      sections: [],
                      createdAt: new Date(),
                      createdBy: '現在のユーザー',
                      usageCount: 0,
                      tags: []
                    });
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規作成
                </Button>
              </div>

              {/* テンプレート一覧 */}
              <div className="space-y-2">
                {filteredTemplates.map(template => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm">{template.name}</h3>
                        {template.isDefault && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(template.type)}
                        </Badge>
                        <span className="text-gray-500">{template.usageCount}回使用</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 overflow-y-auto">
            {editingTemplate ? (
              /* テンプレート編集画面 */
              <TemplateEditor
                template={editingTemplate}
                isCreateMode={isCreateMode}
                onSave={handleSaveTemplate}
                onCancel={() => {
                  setEditingTemplate(null);
                  setIsCreateMode(false);
                }}
              />
            ) : selectedTemplate ? (
              /* テンプレート詳細表示 */
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedTemplate.name}</h2>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {onSelectTemplate && (
                      <Button onClick={() => onSelectTemplate(selectedTemplate)}>
                        このテンプレートを使用
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setEditingTemplate(selectedTemplate)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      編集
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDuplicateTemplate(selectedTemplate)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      複製
                    </Button>
                    {!selectedTemplate.isDefault && (
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        削除
                      </Button>
                    )}
                  </div>
                </div>

                {/* テンプレート詳細情報 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">基本情報</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">タイプ:</span>
                        <Badge>{getTypeLabel(selectedTemplate.type)}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">対象レベル:</span>
                        <span>{getExperienceLevelLabel(selectedTemplate.experienceLevel)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">所要時間:</span>
                        <span>{selectedTemplate.duration}分</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">使用回数:</span>
                        <span>{selectedTemplate.usageCount}回</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">作成情報</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">作成者:</span>
                        <span>{selectedTemplate.createdBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">作成日:</span>
                        <span>{selectedTemplate.createdAt.toLocaleDateString('ja-JP')}</span>
                      </div>
                      {selectedTemplate.updatedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">更新日:</span>
                          <span>{selectedTemplate.updatedAt.toLocaleDateString('ja-JP')}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* セクション一覧 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">面談内容</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedTemplate.sections.map(section => (
                        <div key={section.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{section.title}</h3>
                            {section.isRequired && (
                              <Badge variant="destructive" className="text-xs">必須</Badge>
                            )}
                          </div>
                          {section.description && (
                            <p className="text-gray-600 text-sm mb-3">{section.description}</p>
                          )}
                          <div className="space-y-2">
                            {section.questions.map(question => (
                              <div key={question.id} className="pl-4 border-l-2 border-gray-200">
                                <p className="text-sm font-medium">{question.text}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {question.type}
                                  </Badge>
                                  {question.isRequired && (
                                    <Badge variant="destructive" className="text-xs">必須</Badge>
                                  )}
                                </div>
                                {question.options && (
                                  <div className="mt-2 text-xs text-gray-600">
                                    選択肢: {question.options.join(', ')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* 初期状態 */
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">テンプレートを選択してください</p>
                  <p className="text-sm">左側のリストからテンプレートを選択すると詳細が表示されます</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// テンプレート編集コンポーネント（簡易版）
interface TemplateEditorProps {
  template: InterviewTemplate;
  isCreateMode: boolean;
  onSave: (template: InterviewTemplate) => void;
  onCancel: () => void;
}

function TemplateEditor({ template, isCreateMode, onSave, onCancel }: TemplateEditorProps) {
  const [editTemplate, setEditTemplate] = useState<InterviewTemplate>(template);

  const handleSave = () => {
    if (!editTemplate.name.trim()) {
      alert('テンプレート名を入力してください');
      return;
    }
    onSave(editTemplate);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {isCreateMode ? 'テンプレート作成' : 'テンプレート編集'}
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            キャンセル
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>テンプレート名</Label>
              <Input
                value={editTemplate.name}
                onChange={(e) => setEditTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="テンプレート名を入力"
              />
            </div>
            <div>
              <Label>説明</Label>
              <Textarea
                value={editTemplate.description}
                onChange={(e) => setEditTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="テンプレートの説明を入力"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>面談タイプ</Label>
                <Select
                  value={editTemplate.type}
                  onValueChange={(value: any) => setEditTemplate(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">定期面談</SelectItem>
                    <SelectItem value="special">特別面談</SelectItem>
                    <SelectItem value="support">サポート面談</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>所要時間（分）</Label>
                <Input
                  type="number"
                  value={editTemplate.duration}
                  onChange={(e) => setEditTemplate(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  min="15"
                  max="120"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editTemplate.isDefault}
                onCheckedChange={(checked) => setEditTemplate(prev => ({ ...prev, isDefault: checked }))}
              />
              <Label>デフォルトテンプレートに設定</Label>
            </div>
          </CardContent>
        </Card>

        {/* 簡易版のため、セクション編集は省略 */}
        <Card>
          <CardHeader>
            <CardTitle>面談内容</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              詳細な面談内容の編集機能は今後実装予定です。
              現在は基本情報の編集のみ可能です。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}