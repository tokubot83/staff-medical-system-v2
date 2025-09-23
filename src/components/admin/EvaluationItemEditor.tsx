'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Plus,
  Edit,
  Trash2,
  Save,
  Copy,
  ChevronUp,
  ChevronDown,
  Settings,
  FileTemplate,
  AlertCircle,
  CheckCircle,
  Percent,
  Hash,
  Type,
  List,
  Grid3x3,
  GripVertical,
  Eye,
  Lock,
  Unlock,
  Users,
  Building,
} from 'lucide-react';
import {
  EvaluationCategory,
  EvaluationItem,
  EvaluationItemType,
  EvaluationTemplate,
  DepartmentCustomization,
  MEDICAL_STANDARD_CATEGORIES,
  DEPARTMENT_TEMPLATES,
} from '@/types/evaluation-items';

interface EvaluationItemEditorProps {
  versionId: string;
  versionName: string;
  onSave?: (categories: EvaluationCategory[], customizations: DepartmentCustomization[]) => void;
}

export default function EvaluationItemEditor({
  versionId,
  versionName,
  onSave,
}: EvaluationItemEditorProps) {
  const [categories, setCategories] = useState<EvaluationCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'base' | 'department' | 'templates'>('base');
  const [departmentCustomizations, setDepartmentCustomizations] = useState<DepartmentCustomization[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<EvaluationItem>>({});
  const [saving, setSaving] = useState(false);

  // 部署リスト（実際はAPIから取得）
  const departments = [
    { id: 'icu', name: 'ICU' },
    { id: 'er', name: '救急外来' },
    { id: 'surgery', name: '手術室' },
    { id: 'rehab', name: 'リハビリテーション' },
    { id: 'outpatient', name: '外来' },
    { id: 'ward1', name: '病棟1' },
    { id: 'ward2', name: '病棟2' },
  ];

  // 評価項目タイプの情報
  const itemTypeInfo: Record<EvaluationItemType, { label: string; icon: any; color: string }> = {
    rating: { label: '5段階評価', icon: List, color: 'blue' },
    score: { label: '点数評価', icon: Hash, color: 'green' },
    checkbox: { label: 'チェック', icon: CheckCircle, color: 'purple' },
    text: { label: 'テキスト', icon: Type, color: 'gray' },
    select: { label: '選択式', icon: List, color: 'orange' },
    matrix: { label: 'マトリックス', icon: Grid3x3, color: 'red' },
  };

  useEffect(() => {
    // 初期データをロード
    loadInitialData();
  }, [versionId]);

  const loadInitialData = async () => {
    try {
      // APIから既存の評価項目を取得
      const response = await fetch(`/api/evaluation-items/${versionId}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        setDepartmentCustomizations(data.customizations || []);
      } else {
        // デフォルトのカテゴリーを設定
        const defaultCategories: EvaluationCategory[] = MEDICAL_STANDARD_CATEGORIES.map((cat, idx) => ({
          id: `cat_${idx}`,
          name: cat.name!,
          description: cat.description,
          weight: cat.weight!,
          order: idx,
          items: [],
          isCustom: false,
        }));
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error('Failed to load evaluation items:', error);
    }
  };

  const handleAddCategory = () => {
    const newCategory: EvaluationCategory = {
      id: `cat_${Date.now()}`,
      name: '新規カテゴリー',
      description: '',
      weight: 10,
      order: categories.length,
      items: [],
      isCustom: true,
    };
    setCategories([...categories, newCategory]);
    setSelectedCategory(newCategory.id);
  };

  const handleAddItem = (categoryId: string) => {
    setEditingItem({
      id: `item_${Date.now()}`,
      categoryId,
      name: '',
      description: '',
      type: 'rating',
      required: true,
      weight: 20,
      order: categories.find(c => c.id === categoryId)?.items.length || 0,
    });
    setShowItemDialog(true);
  };

  const handleSaveItem = () => {
    if (!editingItem.name || !editingItem.categoryId) return;

    const categoryIndex = categories.findIndex(c => c.id === editingItem.categoryId);
    if (categoryIndex === -1) return;

    const updatedCategories = [...categories];
    const category = updatedCategories[categoryIndex];

    if (editingItem.id && category.items.find(i => i.id === editingItem.id)) {
      // 既存項目の更新
      category.items = category.items.map(item =>
        item.id === editingItem.id ? { ...item, ...editingItem } as EvaluationItem : item
      );
    } else {
      // 新規項目の追加
      category.items.push(editingItem as EvaluationItem);
    }

    setCategories(updatedCategories);
    setShowItemDialog(false);
    setEditingItem({});
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId),
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
  };

  const handleMoveItem = (categoryId: string, itemId: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;

    const updatedCategories = [...categories];
    const items = [...updatedCategories[categoryIndex].items];
    const itemIndex = items.findIndex(i => i.id === itemId);

    if (direction === 'up' && itemIndex > 0) {
      [items[itemIndex], items[itemIndex - 1]] = [items[itemIndex - 1], items[itemIndex]];
    } else if (direction === 'down' && itemIndex < items.length - 1) {
      [items[itemIndex], items[itemIndex + 1]] = [items[itemIndex + 1], items[itemIndex]];
    }

    // orderを更新
    items.forEach((item, idx) => {
      item.order = idx;
    });

    updatedCategories[categoryIndex].items = items;
    setCategories(updatedCategories);
  };

  const handleApplyTemplate = (departmentId: string, templateType: string) => {
    const template = DEPARTMENT_TEMPLATES[templateType];
    if (!template) return;

    const customCategories: EvaluationCategory[] = template.map((cat, idx) => ({
      id: `custom_${departmentId}_${idx}`,
      name: cat.name!,
      description: cat.description,
      weight: cat.weight!,
      order: categories.length + idx,
      items: [],
      isCustom: true,
    }));

    const customization: DepartmentCustomization = {
      departmentId,
      departmentName: departments.find(d => d.id === departmentId)?.name || '',
      versionId,
      enabled: true,
      customCategories,
      inheritBase: true,
      effectiveFrom: new Date().toISOString().split('T')[0],
    };

    setDepartmentCustomizations([
      ...departmentCustomizations.filter(c => c.departmentId !== departmentId),
      customization,
    ]);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/evaluation-items/${versionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories,
          customizations: departmentCustomizations,
        }),
      });

      if (response.ok) {
        onSave?.(categories, departmentCustomizations);
      }
    } catch (error) {
      console.error('Failed to save evaluation items:', error);
    } finally {
      setSaving(false);
    }
  };

  const calculateTotalWeight = (cats: EvaluationCategory[]) => {
    return cats.reduce((sum, cat) => sum + cat.weight, 0);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                評価項目設定
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {versionName} の評価項目をカスタマイズ
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {isPreviewMode ? '編集モード' : 'プレビュー'}
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAll}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-1" />
                {saving ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* タブ */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="base">
            <Building className="h-4 w-4 mr-1" />
            基本評価項目
          </TabsTrigger>
          <TabsTrigger value="department">
            <Users className="h-4 w-4 mr-1" />
            部署別カスタマイズ
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileTemplate className="h-4 w-4 mr-1" />
            テンプレート
          </TabsTrigger>
        </TabsList>

        {/* 基本評価項目タブ */}
        <TabsContent value="base" className="space-y-4">
          {/* 配点サマリー */}
          <Alert>
            <Percent className="h-4 w-4" />
            <AlertDescription>
              現在の配点合計: {calculateTotalWeight(categories)}% / 100%
              {calculateTotalWeight(categories) !== 100 && (
                <span className="text-yellow-600 ml-2">
                  （合計を100%に調整してください）
                </span>
              )}
            </AlertDescription>
          </Alert>

          {/* カテゴリー一覧 */}
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id} className={selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''}>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {category.weight}%
                      </Badge>
                      <Badge variant="outline">
                        {category.items.length}項目
                      </Badge>
                      {category.isCustom && (
                        <Badge className="bg-blue-100 text-blue-800">
                          カスタム
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {selectedCategory === category.id && (
                  <CardContent className="space-y-4">
                    {/* カテゴリー設定 */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                      <div>
                        <Label>カテゴリー名</Label>
                        <Input
                          value={category.name}
                          onChange={(e) => {
                            setCategories(categories.map(cat =>
                              cat.id === category.id ? { ...cat, name: e.target.value } : cat
                            ));
                          }}
                        />
                      </div>
                      <div>
                        <Label>配点（%）</Label>
                        <Input
                          type="number"
                          value={category.weight}
                          onChange={(e) => {
                            setCategories(categories.map(cat =>
                              cat.id === category.id ? { ...cat, weight: parseInt(e.target.value) || 0 } : cat
                            ));
                          }}
                        />
                      </div>
                    </div>

                    {/* 評価項目一覧 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">評価項目</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddItem(category.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          項目追加
                        </Button>
                      </div>
                      {category.items.map((item, idx) => {
                        const TypeIcon = itemTypeInfo[item.type].icon;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-white border rounded hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                              <TypeIcon className={`h-4 w-4 text-${itemTypeInfo[item.type].color}-500`} />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {item.weight}点
                              </Badge>
                              {item.required && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  必須
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMoveItem(category.id, item.id, 'up')}
                                disabled={idx === 0}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMoveItem(category.id, item.id, 'down')}
                                disabled={idx === category.items.length - 1}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingItem(item);
                                  setShowItemDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteItem(category.id, item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <Button onClick={handleAddCategory} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            カテゴリーを追加
          </Button>
        </TabsContent>

        {/* 部署別カスタマイズタブ */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">部署別カスタマイズ設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="部署を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDepartment && (
                  <Button
                    onClick={() => handleApplyTemplate(selectedDepartment, departments.find(d => d.id === selectedDepartment)?.name || '')}
                  >
                    テンプレート適用
                  </Button>
                )}
              </div>

              {/* カスタマイズ状況 */}
              <div className="space-y-2">
                {departmentCustomizations.map((custom) => (
                  <div key={custom.departmentId} className="p-4 border rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{custom.departmentName}</span>
                        {custom.enabled ? (
                          <Badge className="bg-green-100 text-green-800">有効</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">無効</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          カスタム項目: {custom.customCategories.length}
                        </span>
                        <Button size="sm" variant="outline">
                          編集
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* テンプレートタブ */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(DEPARTMENT_TEMPLATES).map(([key, template]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-lg">{key}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {template.map((cat, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded">
                        <p className="font-medium text-sm">{cat.name}</p>
                        <p className="text-xs text-gray-500">{cat.description}</p>
                        <Badge variant="outline" className="mt-1">
                          {cat.weight}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    テンプレートを使用
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 評価項目編集ダイアログ */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>評価項目の編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>項目名</Label>
              <Input
                value={editingItem.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder="例: 専門知識の活用"
              />
            </div>
            <div>
              <Label>説明</Label>
              <Textarea
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="評価項目の詳細な説明"
              />
            </div>
            <div>
              <Label>評価タイプ</Label>
              <Select
                value={editingItem.type}
                onValueChange={(value) => setEditingItem({ ...editingItem, type: value as EvaluationItemType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(itemTypeInfo).map(([type, info]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <info.icon className="h-4 w-4" />
                        {info.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>配点</Label>
                <Input
                  type="number"
                  value={editingItem.weight || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, weight: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={editingItem.required}
                  onChange={(e) => setEditingItem({ ...editingItem, required: e.target.checked })}
                />
                <Label>必須項目</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowItemDialog(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSaveItem}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}