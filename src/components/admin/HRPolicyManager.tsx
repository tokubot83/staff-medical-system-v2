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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Home, Zap, Shield, BarChart3, DollarSign, Users, RefreshCw,
  TrendingUp, LineChart, Briefcase, Layers, GraduationCap, Link,
  PlusCircle, Heart, Building, UserCheck, CreditCard,
  Edit, Save, Trash2, Plus, ChevronUp, ChevronDown, Eye,
  FileText, Calendar, User, Settings, History, CheckCircle,
  AlertCircle, Copy, Archive, RotateCcw
} from 'lucide-react';
import { HRPolicy, HRPolicyDetail, PolicyExample, DEFAULT_HR_POLICIES } from '@/types/hr-policy';

// アイコンマッピング
const iconMap: { [key: string]: any } = {
  Home, Zap, Shield, BarChart3, DollarSign, Users, RefreshCw,
  TrendingUp, LineChart, Briefcase, Layers, GraduationCap, Link,
  PlusCircle, Heart, Building, UserCheck, CreditCard
};

export default function HRPolicyManager() {
  const [policies, setPolicies] = useState<HRPolicy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<HRPolicy | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Partial<HRPolicy>>({});
  const [activeTab, setActiveTab] = useState('list');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [versionInfo, setVersionInfo] = useState<any>(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hr-policies');
      if (response.ok) {
        const data = await response.json();
        setPolicies(data.policies);
        setVersionInfo(data.version);
      }
    } catch (error) {
      console.error('Failed to fetch HR policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePolicy = async () => {
    if (!editingPolicy.key || !editingPolicy.title) return;

    setSaving(true);
    try {
      const isNew = !editingPolicy.id;
      const url = isNew
        ? '/api/hr-policies'
        : `/api/hr-policies/${editingPolicy.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPolicy),
      });

      if (response.ok) {
        await fetchPolicies();
        setEditMode(false);
        setEditingPolicy({});
      }
    } catch (error) {
      console.error('Failed to save HR policy:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePolicy = async (id: string) => {
    if (!confirm('このポリシーを削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/hr-policies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPolicies();
        if (selectedPolicy?.id === id) {
          setSelectedPolicy(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete HR policy:', error);
    }
  };

  const handleReorderPolicy = async (id: string, direction: 'up' | 'down') => {
    const index = policies.findIndex(p => p.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === policies.length - 1)
    ) {
      return;
    }

    const newPolicies = [...policies];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap order values
    const tempOrder = newPolicies[index].order;
    newPolicies[index].order = newPolicies[targetIndex].order;
    newPolicies[targetIndex].order = tempOrder;

    // Swap positions in array
    [newPolicies[index], newPolicies[targetIndex]] = [newPolicies[targetIndex], newPolicies[index]];

    setPolicies(newPolicies);

    // Save to backend
    try {
      await fetch('/api/hr-policies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policies: newPolicies }),
      });
    } catch (error) {
      console.error('Failed to reorder policies:', error);
      fetchPolicies(); // Revert on error
    }
  };

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName] || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    teal: 'bg-teal-100 text-teal-800 border-teal-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    violet: 'bg-violet-100 text-violet-800 border-violet-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-200',
    slate: 'bg-slate-100 text-slate-800 border-slate-200',
    lime: 'bg-lime-100 text-lime-800 border-lime-200',
    fuchsia: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    stone: 'bg-stone-100 text-stone-800 border-stone-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                人事ポリシーマスター
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                19項目の人事ポリシーを管理・編集
              </p>
            </div>
            <div className="flex items-center gap-2">
              {versionInfo && (
                <Badge variant="outline">
                  Ver {versionInfo.versionNumber}
                </Badge>
              )}
              <Badge className="bg-green-100 text-green-800">
                {policies.filter(p => p.isActive).length} / {policies.length} 有効
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">
            <FileText className="h-4 w-4 mr-1" />
            ポリシー一覧
          </TabsTrigger>
          <TabsTrigger value="edit">
            <Edit className="h-4 w-4 mr-1" />
            編集
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-1" />
            プレビュー
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-1" />
            履歴
          </TabsTrigger>
        </TabsList>

        {/* ポリシー一覧タブ */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="ポリシーを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button
              onClick={() => {
                setEditingPolicy({});
                setEditMode(true);
                setActiveTab('edit');
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              新規追加
            </Button>
          </div>

          <div className="grid gap-3">
            {filteredPolicies.map((policy, index) => (
              <Card
                key={policy.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedPolicy?.id === policy.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedPolicy(policy)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${colorClasses[policy.color]}`}>
                        {getIconComponent(policy.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-400">{policy.key.toUpperCase()}</span>
                          <h3 className="font-semibold">{policy.title}</h3>
                          {!policy.isActive && (
                            <Badge variant="outline" className="text-gray-500">
                              無効
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{policy.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorderPolicy(policy.id, 'up');
                        }}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorderPolicy(policy.id, 'down');
                        }}
                        disabled={index === filteredPolicies.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPolicy(policy);
                          setEditMode(true);
                          setActiveTab('edit');
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePolicy(policy.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 編集タブ */}
        <TabsContent value="edit" className="space-y-4">
          {editMode || editingPolicy.id ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPolicy.id ? 'ポリシー編集' : '新規ポリシー作成'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ポリシーキー</Label>
                    <Input
                      value={editingPolicy.key || ''}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, key: e.target.value })}
                      placeholder="例: t"
                      maxLength={1}
                    />
                  </div>
                  <div>
                    <Label>表示順</Label>
                    <Input
                      type="number"
                      value={editingPolicy.order || 0}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label>タイトル</Label>
                  <Input
                    value={editingPolicy.title || ''}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, title: e.target.value })}
                    placeholder="例: 働く目的"
                  />
                </div>

                <div>
                  <Label>サブタイトル</Label>
                  <Input
                    value={editingPolicy.subtitle || ''}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, subtitle: e.target.value })}
                    placeholder="例: 「生活のため」という現実から始まる幸福循環"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>アイコン</Label>
                    <Select
                      value={editingPolicy.icon}
                      onValueChange={(value) => setEditingPolicy({ ...editingPolicy, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="アイコンを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(iconMap).map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              {getIconComponent(icon)}
                              {icon}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>カラー</Label>
                    <Select
                      value={editingPolicy.color}
                      onValueChange={(value) => setEditingPolicy({ ...editingPolicy, color: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="カラーを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(colorClasses).map((color) => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${colorClasses[color]}`} />
                              {color}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 詳細コンテンツ編集 */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold">詳細コンテンツ</h4>

                  <div>
                    <Label>概要</Label>
                    <Textarea
                      value={editingPolicy.details?.overview || ''}
                      onChange={(e) => setEditingPolicy({
                        ...editingPolicy,
                        details: {
                          ...editingPolicy.details!,
                          overview: e.target.value,
                        }
                      })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>背景</Label>
                    <Textarea
                      value={editingPolicy.details?.background || ''}
                      onChange={(e) => setEditingPolicy({
                        ...editingPolicy,
                        details: {
                          ...editingPolicy.details!,
                          background: e.target.value,
                        }
                      })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>実施方法</Label>
                    <Textarea
                      value={editingPolicy.details?.implementation || ''}
                      onChange={(e) => setEditingPolicy({
                        ...editingPolicy,
                        details: {
                          ...editingPolicy.details!,
                          implementation: e.target.value,
                        }
                      })}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingPolicy({});
                      setEditMode(false);
                    }}
                  >
                    キャンセル
                  </Button>
                  <Button
                    onClick={handleSavePolicy}
                    disabled={saving || !editingPolicy.key || !editingPolicy.title}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {saving ? '保存中...' : '保存'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                編集するポリシーを選択するか、新規作成してください。
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* プレビュータブ */}
        <TabsContent value="preview" className="space-y-4">
          {selectedPolicy ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${colorClasses[selectedPolicy.color]}`}>
                      {getIconComponent(selectedPolicy.icon)}
                    </div>
                    <div>
                      <CardTitle>{selectedPolicy.title}</CardTitle>
                      <p className="text-sm text-gray-500">{selectedPolicy.subtitle}</p>
                    </div>
                  </div>
                  <Badge>{selectedPolicy.key.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">概要</h4>
                    <p className="text-sm text-gray-700">{selectedPolicy.details.overview}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">背景</h4>
                    <p className="text-sm text-gray-700">{selectedPolicy.details.background}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">実施方法</h4>
                    <p className="text-sm text-gray-700">{selectedPolicy.details.implementation}</p>
                  </div>

                  {selectedPolicy.details.examples && selectedPolicy.details.examples.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">実例</h4>
                      <div className="space-y-2">
                        {selectedPolicy.details.examples.map((example, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded">
                            <p className="font-medium text-sm">{example.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{example.description}</p>
                            {example.outcome && (
                              <Badge variant="outline" className="mt-2">
                                {example.outcome}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t text-xs text-gray-500">
                  <span>最終更新: {new Date(selectedPolicy.updatedAt).toLocaleDateString('ja-JP')}</span>
                  <span>更新者: {selectedPolicy.updatedBy}</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                プレビューするポリシーを選択してください。
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* 履歴タブ */}
        <TabsContent value="history" className="space-y-4">
          <Alert>
            <History className="h-4 w-4" />
            <AlertDescription>
              バージョン履歴機能は準備中です。
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}