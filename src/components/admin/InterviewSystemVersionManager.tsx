'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Archive,
  MessageSquare,
  GitBranch,
  AlertCircle,
  Loader2,
  Users,
  Calendar,
  Target,
} from 'lucide-react';
import { useInterviewSystem } from '@/contexts/InterviewSystemContext';
import { useEvaluationVersion } from '@/contexts/EvaluationVersionContext';

export default function InterviewSystemVersionManager() {
  const {
    versions,
    currentVersion,
    selectedVersionId,
    setSelectedVersionId,
    createVersion,
    updateVersion,
    deleteVersion,
    activateVersion,
    archiveVersion,
    loading,
    error,
    canEdit,
    canDelete,
    canActivate,
  } = useInterviewSystem();

  const { versions: evaluationVersions } = useEvaluationVersion();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    description: '',
    effectiveFrom: '',
    effectiveTo: '',
    evaluationVersionId: '',
    regularInterviews: {
      enabled: true,
      newEmployeeMonths: '1,3,6',
      annualFrequency: '2',
      managementFrequency: '2',
    },
    specialInterviews: {
      enabled: true,
      types: [] as string[],
    },
    supportCategories: {
      enabled: true,
      categories: [] as string[],
    },
  });

  const specialInterviewTypes = [
    { value: 'problem', label: '問題解決面談' },
    { value: 'promotion', label: '昇進・昇格面談' },
    { value: 'career', label: 'キャリア開発面談' },
    { value: 'comeback', label: '復職面談' },
    { value: 'development', label: '能力開発面談' },
    { value: 'wellness', label: 'ウェルネス面談' },
  ];

  const supportCategoryOptions = ['A', 'B', 'C', 'D'];

  const resetForm = () => {
    setFormData({
      name: '',
      version: '',
      description: '',
      effectiveFrom: '',
      effectiveTo: '',
      evaluationVersionId: '',
      regularInterviews: {
        enabled: true,
        newEmployeeMonths: '1,3,6',
        annualFrequency: '2',
        managementFrequency: '2',
      },
      specialInterviews: {
        enabled: true,
        types: [],
      },
      supportCategories: {
        enabled: true,
        categories: [],
      },
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.version || !formData.description) {
      alert('必須項目を入力してください');
      return;
    }

    const newEmployeeMonths = formData.regularInterviews.newEmployeeMonths
      .split(',')
      .map(m => parseInt(m.trim()))
      .filter(m => !isNaN(m));

    await createVersion({
      name: formData.name,
      version: formData.version,
      description: formData.description,
      status: 'preparing',
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo || undefined,
      evaluationVersionId: formData.evaluationVersionId,
      regularInterviews: {
        enabled: formData.regularInterviews.enabled,
        newEmployee: {
          months: newEmployeeMonths,
          duration: 30,
        },
        annual: {
          frequency: parseInt(formData.regularInterviews.annualFrequency),
          timing: 'flexible',
        },
        management: {
          frequency: parseInt(formData.regularInterviews.managementFrequency),
        },
      },
      specialInterviews: formData.specialInterviews,
      supportCategories: formData.supportCategories,
    });

    resetForm();
  };

  const startEdit = (version: any) => {
    setEditingId(version.id);
    const newEmployeeMonths = version.regularInterviews?.newEmployee?.months?.join(',') || '1,3,6';
    const annualFrequency = version.regularInterviews?.annual?.frequency?.toString() || '2';
    const managementFrequency = version.regularInterviews?.management?.frequency?.toString() || '2';

    setFormData({
      name: version.name,
      version: version.version,
      description: version.description,
      effectiveFrom: version.effectiveFrom,
      effectiveTo: version.effectiveTo || '',
      evaluationVersionId: version.evaluationVersionId || '',
      regularInterviews: {
        enabled: version.regularInterviews?.enabled ?? true,
        newEmployeeMonths,
        annualFrequency,
        managementFrequency,
      },
      specialInterviews: {
        enabled: version.specialInterviews?.enabled ?? true,
        types: version.specialInterviews?.types || [],
      },
      supportCategories: {
        enabled: version.supportCategories?.enabled ?? true,
        categories: version.supportCategories?.categories || [],
      },
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    const newEmployeeMonths = formData.regularInterviews.newEmployeeMonths
      .split(',')
      .map(m => parseInt(m.trim()))
      .filter(m => !isNaN(m));

    await updateVersion(editingId, {
      name: formData.name,
      version: formData.version,
      description: formData.description,
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo || undefined,
      evaluationVersionId: formData.evaluationVersionId,
      regularInterviews: {
        enabled: formData.regularInterviews.enabled,
        newEmployee: {
          months: newEmployeeMonths,
          duration: 30,
        },
        annual: {
          frequency: parseInt(formData.regularInterviews.annualFrequency),
          timing: 'flexible',
        },
        management: {
          frequency: parseInt(formData.regularInterviews.managementFrequency),
        },
      },
      specialInterviews: formData.specialInterviews,
      supportCategories: formData.supportCategories,
    });

    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'testing':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '稼働中';
      case 'preparing':
        return '準備中';
      case 'testing':
        return 'テスト中';
      case 'archived':
        return 'アーカイブ';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* 現在のアクティブバージョン */}
      <Card className="border-2 border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            現在の運用バージョン
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {currentVersion ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-indigo-900">{currentVersion.name}</h3>
                  <p className="text-gray-600">{currentVersion.description}</p>
                </div>
                <Badge className={getStatusColor(currentVersion.status)}>
                  {getStatusLabel(currentVersion.status)}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">バージョン</p>
                  <p className="font-medium">v{currentVersion.version}</p>
                </div>
                <div>
                  <p className="text-gray-500">連携評価制度</p>
                  <p className="font-medium">
                    {evaluationVersions.find(v => v.id === currentVersion.evaluationVersionId)?.name || '未設定'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">有効期間</p>
                  <p className="font-medium">
                    {currentVersion.effectiveFrom} 〜 {currentVersion.effectiveTo || '無期限'}
                  </p>
                </div>
              </div>
              {currentVersion.regularInterviews && (
                <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm font-medium text-indigo-800 mb-1">面談構成</p>
                  <div className="flex gap-6 text-xs text-indigo-700">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      定期面談: {currentVersion.regularInterviews.enabled ? '有効' : '無効'}
                    </span>
                    {currentVersion.specialInterviews && (
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        特別面談: {currentVersion.specialInterviews.types?.length || 0}種類
                      </span>
                    )}
                    {currentVersion.supportCategories && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        支援区分: {currentVersion.supportCategories.categories?.join(', ') || 'なし'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">アクティブなバージョンがありません</p>
          )}
        </CardContent>
      </Card>

      {/* バージョン管理 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              面談制度バージョン管理
            </CardTitle>
            {canEdit && (
              <Button
                onClick={() => setIsCreating(true)}
                disabled={isCreating || loading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規バージョン作成
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* 新規作成フォーム */}
          {isCreating && (
            <div className="mb-6 p-4 border-2 border-indigo-200 rounded-lg bg-indigo-50">
              <h3 className="font-semibold mb-4">新規バージョン作成</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>バージョン名 *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="v4.0 AI支援面談"
                  />
                </div>
                <div>
                  <Label>バージョン番号 *</Label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="4.0"
                  />
                </div>
                <div className="col-span-2">
                  <Label>説明 *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="このバージョンの特徴を説明してください"
                  />
                </div>
                <div>
                  <Label>連携する評価制度</Label>
                  <Select
                    value={formData.evaluationVersionId}
                    onValueChange={(value) => setFormData({ ...formData, evaluationVersionId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="評価制度を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {evaluationVersions.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>新入社員面談月（カンマ区切り）</Label>
                  <Input
                    value={formData.regularInterviews.newEmployeeMonths}
                    onChange={(e) => setFormData({
                      ...formData,
                      regularInterviews: { ...formData.regularInterviews, newEmployeeMonths: e.target.value }
                    })}
                    placeholder="1,3,6,12"
                  />
                </div>
                <div>
                  <Label>年次面談回数</Label>
                  <Input
                    type="number"
                    value={formData.regularInterviews.annualFrequency}
                    onChange={(e) => setFormData({
                      ...formData,
                      regularInterviews: { ...formData.regularInterviews, annualFrequency: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>管理職面談回数</Label>
                  <Input
                    type="number"
                    value={formData.regularInterviews.managementFrequency}
                    onChange={(e) => setFormData({
                      ...formData,
                      regularInterviews: { ...formData.regularInterviews, managementFrequency: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label>有効開始日</Label>
                  <Input
                    type="date"
                    value={formData.effectiveFrom}
                    onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label>有効終了日（オプション）</Label>
                  <Input
                    type="date"
                    value={formData.effectiveTo}
                    onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>特別面談種類</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specialInterviewTypes.map(type => (
                      <label key={type.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.specialInterviews.types.includes(type.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                specialInterviews: {
                                  ...formData.specialInterviews,
                                  types: [...formData.specialInterviews.types, type.value]
                                }
                              });
                            } else {
                              setFormData({
                                ...formData,
                                specialInterviews: {
                                  ...formData.specialInterviews,
                                  types: formData.specialInterviews.types.filter(t => t !== type.value)
                                }
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>支援区分</Label>
                  <div className="flex gap-2 mt-2">
                    {supportCategoryOptions.map(cat => (
                      <label key={cat} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.supportCategories.categories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                supportCategories: {
                                  ...formData.supportCategories,
                                  categories: [...formData.supportCategories.categories, cat]
                                }
                              });
                            } else {
                              setFormData({
                                ...formData,
                                supportCategories: {
                                  ...formData.supportCategories,
                                  categories: formData.supportCategories.categories.filter(c => c !== cat)
                                }
                              });
                            }
                          }}
                        />
                        <span className="text-sm">区分{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreate} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  作成
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  キャンセル
                </Button>
              </div>
            </div>
          )}

          {/* バージョン一覧 */}
          <div className="space-y-3">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  version.id === selectedVersionId
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {editingId === version.id ? (
                  // 編集モード
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="バージョン名"
                      />
                      <Input
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        placeholder="バージョン番号"
                      />
                    </div>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="説明"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdate} disabled={loading}>
                        保存
                      </Button>
                      <Button size="sm" variant="outline" onClick={resetForm}>
                        キャンセル
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 表示モード
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedVersionId(version.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{version.name}</span>
                        <Badge className={getStatusColor(version.status)}>
                          {getStatusLabel(version.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{version.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>v{version.version}</span>
                        <span>
                          連携: {evaluationVersions.find(v => v.id === version.evaluationVersionId)?.name || '未設定'}
                        </span>
                        <span>
                          {version.effectiveFrom} 〜 {version.effectiveTo || '無期限'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {canEdit && version.status !== 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(version)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {canActivate && version.status !== 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => activateVersion(version.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {canEdit && version.status === 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => archiveVersion(version.id)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && version.status === 'archived' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteVersion(version.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}