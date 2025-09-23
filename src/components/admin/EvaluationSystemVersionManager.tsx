'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Archive,
  Package,
  GitBranch,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useEvaluationVersion } from '@/contexts/EvaluationVersionContext';

export default function EvaluationSystemVersionManager() {
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
  } = useEvaluationVersion();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    description: '',
    effectiveFrom: '',
    effectiveTo: '',
    technicalScore: 50,
    contributionScore: 50,
    features: '',
  });

  // 新規作成フォームのリセット
  const resetForm = () => {
    setFormData({
      name: '',
      version: '',
      description: '',
      effectiveFrom: '',
      effectiveTo: '',
      technicalScore: 50,
      contributionScore: 50,
      features: '',
    });
    setIsCreating(false);
    setEditingId(null);
  };

  // 新規作成
  const handleCreate = async () => {
    if (!formData.name || !formData.version || !formData.description) {
      alert('必須項目を入力してください');
      return;
    }

    await createVersion({
      name: formData.name,
      version: formData.version,
      description: formData.description,
      status: 'preparing',
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo || undefined,
      technicalScore: formData.technicalScore,
      contributionScore: formData.contributionScore,
      features: formData.features.split('\n').filter(f => f.trim()),
    });

    resetForm();
  };

  // 編集開始
  const startEdit = (version: any) => {
    setEditingId(version.id);
    setFormData({
      name: version.name,
      version: version.version,
      description: version.description,
      effectiveFrom: version.effectiveFrom,
      effectiveTo: version.effectiveTo || '',
      technicalScore: version.technicalScore || 50,
      contributionScore: version.contributionScore || 50,
      features: version.features?.join('\n') || '',
    });
  };

  // 更新
  const handleUpdate = async () => {
    if (!editingId) return;

    await updateVersion(editingId, {
      name: formData.name,
      version: formData.version,
      description: formData.description,
      effectiveFrom: formData.effectiveFrom,
      effectiveTo: formData.effectiveTo || undefined,
      technicalScore: formData.technicalScore,
      contributionScore: formData.contributionScore,
      features: formData.features.split('\n').filter(f => f.trim()),
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
      {/* エラー表示 */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* 現在のアクティブバージョン */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            現在の運用バージョン
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {currentVersion ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-blue-900">{currentVersion.name}</h3>
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
                  <p className="text-gray-500">技術評価 / 貢献度</p>
                  <p className="font-medium">
                    {currentVersion.technicalScore}点 / {currentVersion.contributionScore}点
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">有効期間</p>
                  <p className="font-medium">
                    {currentVersion.effectiveFrom} 〜 {currentVersion.effectiveTo || '無期限'}
                  </p>
                </div>
              </div>
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
              評価制度バージョン管理
            </CardTitle>
            {canEdit && (
              <Button
                onClick={() => setIsCreating(true)}
                disabled={isCreating || loading}
                className="bg-blue-600 hover:bg-blue-700"
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
            <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-4">新規バージョン作成</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>バージョン名 *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="v5.0 AI支援評価"
                  />
                </div>
                <div>
                  <Label>バージョン番号 *</Label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="5.0"
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
                  <Label>技術評価配点</Label>
                  <Input
                    type="number"
                    value={formData.technicalScore}
                    onChange={(e) => setFormData({ ...formData, technicalScore: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>組織貢献度配点</Label>
                  <Input
                    type="number"
                    value={formData.contributionScore}
                    onChange={(e) => setFormData({ ...formData, contributionScore: Number(e.target.value) })}
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
                  <Label>機能（改行区切り）</Label>
                  <Textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="AI分析支援\n行動データ自動収集\nリアルタイム評価"
                    rows={4}
                  />
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
                    ? 'border-blue-500 bg-blue-50'
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
                          技術: {version.technicalScore}点 / 貢献: {version.contributionScore}点
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