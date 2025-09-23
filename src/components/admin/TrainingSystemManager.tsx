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
import { Progress } from '@/components/ui/progress';
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
  BookOpen, GraduationCap, Shield, Users, Building, Calendar,
  Plus, Edit, Trash2, Save, Copy, Eye, Settings, FileText,
  Clock, Target, CheckCircle, AlertCircle, BarChart3,
  ArrowRight, ChevronRight, Briefcase, Award, RefreshCw,
  Layers, GitBranch, PlayCircle, PauseCircle, Archive
} from 'lucide-react';
import {
  TrainingProgram,
  ProbationProgram,
  LegalTrainingRequirement,
  ProgramType,
  TrainingMethod,
  ProgramStatus
} from '@/types/training-system';

export default function TrainingSystemManager() {
  const [activeTab, setActiveTab] = useState('programs');
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [probationPrograms, setProbationPrograms] = useState<ProbationProgram[]>([]);
  const [legalRequirements, setLegalRequirements] = useState<LegalTrainingRequirement[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProgramType | 'all'>('all');
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Partial<TrainingProgram>>({});

  useEffect(() => {
    fetchPrograms();
    fetchProbationPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/training-programs');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs);
        setLegalRequirements(data.legalRequirements);
      }
    } catch (error) {
      console.error('Failed to fetch training programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProbationPrograms = async () => {
    try {
      const response = await fetch('/api/probation-programs');
      if (response.ok) {
        const data = await response.json();
        setProbationPrograms(data.programs);
      }
    } catch (error) {
      console.error('Failed to fetch probation programs:', error);
    }
  };

  const handleSaveProgram = async () => {
    if (!editingProgram.name || !editingProgram.type) return;

    try {
      const isNew = !editingProgram.id;
      const url = isNew ? '/api/training-programs' : `/api/training-programs/${editingProgram.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProgram),
      });

      if (response.ok) {
        await fetchPrograms();
        setShowProgramDialog(false);
        setEditingProgram({});
      }
    } catch (error) {
      console.error('Failed to save training program:', error);
    }
  };

  const getProgramIcon = (type: ProgramType) => {
    const icons: Record<ProgramType, any> = {
      legal: Shield,
      basic: BookOpen,
      specialty: Award,
      management: Briefcase,
      safety: Shield,
      onboarding: Users,
      probation: RefreshCw,
      rotation: GitBranch,
      custom: Layers,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusBadge = (status: ProgramStatus) => {
    const colors: Record<ProgramStatus, string> = {
      draft: 'bg-gray-100 text-gray-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-orange-100 text-orange-800',
      completed: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-600',
    };
    return (
      <Badge className={colors[status]}>
        {status === 'active' && <PlayCircle className="h-3 w-3 mr-1" />}
        {status === 'suspended' && <PauseCircle className="h-3 w-3 mr-1" />}
        {status}
      </Badge>
    );
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || program.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                教育・研修制度マスター
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                法定研修・特別プログラム・カスタム研修を統合管理
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {programs.filter(p => p.status === 'active').length} / {programs.length} 有効
              </Badge>
              <Button
                onClick={() => {
                  setEditingProgram({});
                  setShowProgramDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                新規作成
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="programs">
            <BookOpen className="h-4 w-4 mr-1" />
            研修プログラム
          </TabsTrigger>
          <TabsTrigger value="probation">
            <RefreshCw className="h-4 w-4 mr-1" />
            試用期間プログラム
          </TabsTrigger>
          <TabsTrigger value="legal">
            <Shield className="h-4 w-4 mr-1" />
            法定研修
          </TabsTrigger>
          <TabsTrigger value="builder">
            <Layers className="h-4 w-4 mr-1" />
            プログラムビルダー
          </TabsTrigger>
        </TabsList>

        {/* 研修プログラムタブ */}
        <TabsContent value="programs" className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="プログラムを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="種類でフィルター" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="legal">法定研修</SelectItem>
                <SelectItem value="basic">基礎研修</SelectItem>
                <SelectItem value="specialty">専門研修</SelectItem>
                <SelectItem value="onboarding">オンボーディング</SelectItem>
                <SelectItem value="custom">カスタム</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {getProgramIcon(program.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {program.name}
                          {getStatusBadge(program.status)}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {program.duration.value} {program.duration.unit}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {program.targetAudience.jobCategories?.join(', ') || '全職員'}
                          </Badge>
                          {program.method.map((method) => (
                            <Badge key={method} variant="outline" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingProgram(program);
                          setShowProgramDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 試用期間プログラムタブ */}
        <TabsContent value="probation" className="space-y-4">
          {probationPrograms.map((program) => (
            <Card key={program.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  {program.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{program.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* フェーズ表示 */}
                <div className="space-y-3">
                  {program.phases.map((phase, index) => (
                    <div key={phase.phaseNumber} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-800 font-semibold text-sm">
                        {phase.phaseNumber}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{phase.name}</h4>
                        <p className="text-sm text-gray-600">
                          期間: {phase.duration.value}{phase.duration.unit === 'months' ? 'ヶ月' : phase.duration.unit}
                        </p>
                        <div className="mt-2 space-y-1">
                          {phase.objectives.map((obj, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">{obj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {index < program.phases.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>

                {/* 施設ローテーション */}
                {program.facilityRotation?.enabled && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      施設間ローテーション
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {program.facilityRotation.facilities.map((facility) => (
                        <div key={facility.facilityId} className="bg-white p-2 rounded">
                          <p className="font-medium text-sm">{facility.facilityName}</p>
                          <p className="text-xs text-gray-600">{facility.facilityType} - {facility.duration}日間</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* 法定研修タブ */}
        <TabsContent value="legal" className="space-y-4">
          <div className="grid gap-4">
            {legalRequirements.map((requirement) => (
              <Card key={requirement.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        {requirement.name}
                        {requirement.isActive && (
                          <Badge className="bg-red-100 text-red-800">必須</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{requirement.description}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span>頻度: {requirement.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span>時間: {requirement.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span>対象: {requirement.targetStaff}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-gray-500" />
                          <span>根拠: {requirement.legalBasis}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {requirement.facilityTypes.map((type) => (
                        <Badge key={type} variant="outline">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* プログラムビルダータブ */}
        <TabsContent value="builder" className="space-y-4">
          <Alert>
            <Layers className="h-4 w-4" />
            <AlertDescription>
              <strong>プログラムビルダー</strong>
              <p className="mt-2">
                ドラッグ&ドロップで新しい研修プログラムを作成できます。
                既存モジュールを組み合わせて、独自の研修制度を設計しましょう。
              </p>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>新規プログラム作成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Layers className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    モジュールをドラッグ&ドロップして<br />
                    プログラムを構築
                  </p>
                  <Button className="mt-4" variant="outline">
                    テンプレートから開始
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* プログラム編集ダイアログ */}
      <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProgram.id ? 'プログラム編集' : '新規プログラム作成'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>プログラム名</Label>
              <Input
                value={editingProgram.name || ''}
                onChange={(e) => setEditingProgram({ ...editingProgram, name: e.target.value })}
              />
            </div>
            <div>
              <Label>説明</Label>
              <Textarea
                value={editingProgram.description || ''}
                onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>種類</Label>
                <Select
                  value={editingProgram.type}
                  onValueChange={(value) => setEditingProgram({ ...editingProgram, type: value as ProgramType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="種類を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legal">法定研修</SelectItem>
                    <SelectItem value="basic">基礎研修</SelectItem>
                    <SelectItem value="specialty">専門研修</SelectItem>
                    <SelectItem value="onboarding">オンボーディング</SelectItem>
                    <SelectItem value="probation">試用期間</SelectItem>
                    <SelectItem value="custom">カスタム</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>ステータス</Label>
                <Select
                  value={editingProgram.status}
                  onValueChange={(value) => setEditingProgram({ ...editingProgram, status: value as ProgramStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="pending_approval">承認待ち</SelectItem>
                    <SelectItem value="active">有効</SelectItem>
                    <SelectItem value="suspended">一時停止</SelectItem>
                    <SelectItem value="archived">アーカイブ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowProgramDialog(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSaveProgram}>
                <Save className="h-4 w-4 mr-1" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}