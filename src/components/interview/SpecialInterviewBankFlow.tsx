'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  UserX,
  ArrowRightLeft,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  Sparkles,
  Database,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
  Shield,
  Eye,
  Save
} from 'lucide-react';

import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { 
  generateSpecialInterview, 
  analyzeSpecialInterviewResult,
  SpecialGenerationParams,
  SpecialInterviewType,
  ExitInterviewSubType,
  PromotionInterviewSubType
} from '@/lib/interview-bank/services/special-generator';
import { GeneratedBankSheet, StaffBankProfile } from '@/lib/interview-bank/types';
import DynamicInterviewSheet from '@/components/interview-bank/DynamicInterviewSheet';
import { StaffCardInterviewService } from '@/services/staffCardInterviewService';

// 面談作成フォームの状態
interface CreateInterviewForm {
  staffId: string;
  staffName: string;
  specialType: SpecialInterviewType;
  subType?: string;
  reason: string;
  scheduledDate: Date;
  urgentProcessing: boolean;
  confidentialLevel: 'normal' | 'high' | 'critical';
  metadata: Record<string, any>;
}

// スタッフ選択コンポーネント
interface StaffSelectorProps {
  onStaffSelect: (staff: { id: string; name: string; department: string; position: string }) => void;
  selectedStaffId?: string;
}

function StaffSelector({ onStaffSelect, selectedStaffId }: StaffSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList] = useState([
    { id: 'EMP_001', name: '田中美咲', department: '外来看護部', position: '看護師' },
    { id: 'EMP_002', name: '佐藤健一', department: 'リハビリテーション科', position: '理学療法士' },
    { id: 'EMP_003', name: '山田太郎', department: '看護部', position: '看護補助者' },
    { id: 'EMP_004', name: '鈴木花子', department: '医事課', position: '事務員' },
    { id: 'EMP_005', name: '高橋次郎', department: '看護部', position: '看護師長' }
  ]);

  const filteredStaff = staffList.filter(staff =>
    staff.name.includes(searchTerm) || 
    staff.department.includes(searchTerm) ||
    staff.position.includes(searchTerm)
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="職員名、部署、職種で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-32 border rounded">
        <div className="p-2 space-y-1">
          {filteredStaff.map(staff => (
            <div
              key={staff.id}
              className={`p-2 rounded cursor-pointer text-sm ${
                selectedStaffId === staff.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
              onClick={() => onStaffSelect(staff)}
            >
              <div className="font-medium">{staff.name}</div>
              <div className="text-xs opacity-75">{staff.department} - {staff.position}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// メインコンポーネント
export default function SpecialInterviewBankFlow() {
  const [activeTab, setActiveTab] = useState('create');
  const [createForm, setCreateForm] = useState<CreateInterviewForm>({
    staffId: '',
    staffName: '',
    specialType: 'exit',
    reason: '',
    scheduledDate: new Date(),
    urgentProcessing: false,
    confidentialLevel: 'normal',
    metadata: {}
  });
  const [generatedSheet, setGeneratedSheet] = useState<GeneratedBankSheet | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [staffProfile, setStaffProfile] = useState<StaffBankProfile | null>(null);
  const [interviewService] = useState(() => InterviewBankService.getInstance());

  // 特別面談タイプのアイコンとラベル
  const getSpecialTypeInfo = (type: SpecialInterviewType) => {
    const info = {
      exit: { icon: <UserX className="w-4 h-4" />, label: '退職面談', color: 'destructive' as const },
      transfer: { icon: <ArrowRightLeft className="w-4 h-4" />, label: '異動面談', color: 'secondary' as const },
      return: { icon: <UserCheck className="w-4 h-4" />, label: '復職面談', color: 'secondary' as const },
      promotion: { icon: <TrendingUp className="w-4 h-4" />, label: '昇進面談', color: 'secondary' as const },
      disciplinary: { icon: <AlertTriangle className="w-4 h-4" />, label: '懲戒面談', color: 'destructive' as const }
    };
    return info[type];
  };

  // スタッフ選択ハンドラ
  const handleStaffSelect = (staff: { id: string; name: string; department: string; position: string }) => {
    setCreateForm(prev => ({
      ...prev,
      staffId: staff.id,
      staffName: staff.name
    }));

    // モックの職員プロファイル作成
    const mockProfile: StaffBankProfile = {
      id: staff.id,
      name: staff.name,
      email: `${staff.id}@example.com`,
      department: staff.department,
      position: staff.position,
      experienceLevel: 'junior',
      experienceYears: 2,
      experienceMonths: 6,
      facility: '第一病院',
      facilityType: 'acute',
      hireDate: new Date('2022-04-01'),
      lastInterviewDate: null,
      nextScheduledDate: null,
      interviewCount: 0
    };
    setStaffProfile(mockProfile);
  };

  // 面談生成
  const generateInterview = async () => {
    if (!staffProfile) return;

    setIsGenerating(true);
    try {
      const params: SpecialGenerationParams = {
        interviewType: 'special',
        specialType: createForm.specialType,
        subType: createForm.subType,
        reason: createForm.reason,
        urgentProcessing: createForm.urgentProcessing,
        confidentialLevel: createForm.confidentialLevel,
        duration: getDurationByType(createForm.specialType, createForm.subType),
        interviewDate: createForm.scheduledDate,
        metadata: createForm.metadata
      };

      // バンクから面談シート生成
      const sheet = generateSpecialInterview(params, staffProfile);

      // 面談を開始（データベースに保存）
      const { interviewId: newInterviewId } = await interviewService.generateAndStartInterview(
        staffProfile,
        params
      );

      setGeneratedSheet(sheet);
      setInterviewId(newInterviewId);
      setActiveTab('conduct');
    } catch (error) {
      console.error('Failed to generate special interview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 面談完了処理
  const handleInterviewComplete = async (responses: any) => {
    if (!interviewId || !createForm) return;

    try {
      // 結果を分析
      const analysis = analyzeSpecialInterviewResult(
        Object.entries(responses).map(([id, answer]) => ({ questionId: id, answer: String(answer) })),
        createForm.specialType,
        createForm.subType
      );

      // 面談を完了
      await interviewService.completeInterview(
        interviewId,
        `${createForm.specialType}面談を実施: ${createForm.reason}`,
        analysis.keyInsights,
        analysis.recommendedActions.map(action => ({ description: action }))
      );

      // 職員カルテへのリアルタイム同期
      try {
        const completedInterviewData = {
          id: interviewId,
          staffId: createForm.staffId,
          staffName: selectedStaff?.name || '',
          type: 'special' as const,
          subtype: createForm.specialType,
          date: new Date().toISOString().split('T')[0],
          duration: getDefaultDuration(createForm.specialType),
          responses: Object.entries(responses).map(([questionId, response]) => ({
            questionId,
            response: String(response)
          })),
          summary: analysis.keyInsights.join('; '),
          feedback: `${createForm.specialType}面談実施: ${createForm.reason}`,
          nextActions: analysis.recommendedActions,
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
          interviewer: '特別面談担当者',
          reason: createForm.reason
        };

        await StaffCardInterviewService.handleInterviewCompletion(completedInterviewData);
        console.log('特別面談の職員カルテ同期完了:', completedInterviewData);
      } catch (error) {
        console.error('特別面談の職員カルテ同期エラー:', error);
      }

      setActiveTab('completed');
    } catch (error) {
      console.error('Failed to complete interview:', error);
    }
  };

  // タイプ別デフォルト時間
  const getDurationByType = (type: SpecialInterviewType, subType?: string): number => {
    if (type === 'exit') {
      if (subType === 'probation') return 30;
      return 20;
    }
    if (type === 'disciplinary') return 30;
    if (type === 'return') return 25;
    return 20;
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6" />
            特別面談バンクシステム
          </h2>
          <p className="text-muted-foreground">退職・異動・復職・昇進・懲戒面談の管理</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            機密性: {createForm.confidentialLevel}
          </Badge>
          {createForm.urgentProcessing && (
            <Badge variant="destructive">緊急処理</Badge>
          )}
        </div>
      </div>

      {/* タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">面談作成</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedSheet}>プレビュー</TabsTrigger>
          <TabsTrigger value="conduct" disabled={!generatedSheet}>実施</TabsTrigger>
          <TabsTrigger value="completed">完了</TabsTrigger>
        </TabsList>

        {/* 面談作成 */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>特別面談の作成</CardTitle>
              <CardDescription>面談の種類と対象職員を選択してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 職員選択 */}
              <div className="space-y-2">
                <Label>対象職員</Label>
                <StaffSelector 
                  onStaffSelect={handleStaffSelect} 
                  selectedStaffId={createForm.staffId}
                />
                {createForm.staffName && (
                  <Alert>
                    <User className="w-4 h-4" />
                    <AlertDescription>
                      選択中: <strong>{createForm.staffName}</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* 面談タイプ */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>面談タイプ</Label>
                  <Select 
                    value={createForm.specialType} 
                    onValueChange={(value: SpecialInterviewType) => 
                      setCreateForm(prev => ({ ...prev, specialType: value, subType: undefined }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['exit', 'transfer', 'return', 'promotion', 'disciplinary'] as SpecialInterviewType[]).map(type => {
                        const info = getSpecialTypeInfo(type);
                        return (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              {info.icon}
                              {info.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* サブタイプ */}
                {(createForm.specialType === 'exit' || createForm.specialType === 'promotion') && (
                  <div className="space-y-2">
                    <Label>サブタイプ</Label>
                    <Select 
                      value={createForm.subType || ''} 
                      onValueChange={(value) => 
                        setCreateForm(prev => ({ ...prev, subType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {createForm.specialType === 'exit' && (
                          <>
                            <SelectItem value="probation">試用期間中</SelectItem>
                            <SelectItem value="regular">正職員</SelectItem>
                            <SelectItem value="voluntary">自己都合</SelectItem>
                            <SelectItem value="involuntary">会社都合</SelectItem>
                          </>
                        )}
                        {createForm.specialType === 'promotion' && (
                          <>
                            <SelectItem value="general">一般昇進</SelectItem>
                            <SelectItem value="management">管理職昇進</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* 面談理由 */}
              <div className="space-y-2">
                <Label>面談理由・背景</Label>
                <Textarea 
                  value={createForm.reason}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder={
                    createForm.specialType === 'exit' ? '退職理由の詳細...' :
                    createForm.specialType === 'transfer' ? '異動の背景...' :
                    createForm.specialType === 'return' ? '復職の経緯...' :
                    createForm.specialType === 'promotion' ? '昇進の詳細...' :
                    '懲戒事由の概要...'
                  }
                  rows={3}
                />
              </div>

              {/* 面談設定 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>実施予定日</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {createForm.scheduledDate.toLocaleDateString('ja-JP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={createForm.scheduledDate}
                        onSelect={(date) => date && setCreateForm(prev => ({ ...prev, scheduledDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>機密レベル</Label>
                  <Select 
                    value={createForm.confidentialLevel} 
                    onValueChange={(value: 'normal' | 'high' | 'critical') => 
                      setCreateForm(prev => ({ ...prev, confidentialLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">通常</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="critical">最高機密</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>推定時間</Label>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{getDurationByType(createForm.specialType, createForm.subType)}分</span>
                  </div>
                </div>
              </div>

              {/* アクション */}
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={generateInterview} 
                  disabled={!createForm.staffId || !createForm.reason || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      面談シート生成
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* プレビュー */}
        <TabsContent value="preview">
          {generatedSheet && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {generatedSheet.title}
                </CardTitle>
                <CardDescription>{generatedSheet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {generatedSheet.sections.map((section, index) => (
                      <Card key={section.id}>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {index + 1}. {section.title} ({section.duration}分)
                          </CardTitle>
                          <CardDescription>{section.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {section.questions.map((question, qIndex) => (
                              <div key={question.id} className="text-sm p-2 bg-muted rounded">
                                <strong>Q{qIndex + 1}:</strong> {question.questionText}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setActiveTab('create')}>
                    修正
                  </Button>
                  <Button onClick={() => setActiveTab('conduct')}>
                    面談開始
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 実施 */}
        <TabsContent value="conduct">
          {generatedSheet && interviewId && (
            <DynamicInterviewSheet
              sheet={generatedSheet}
              mode="digital"
              onComplete={handleInterviewComplete}
              autoSave={true}
              showProgress={true}
            />
          )}
        </TabsContent>

        {/* 完了 */}
        <TabsContent value="completed">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">特別面談が完了しました</h3>
              <p className="text-muted-foreground mb-6">
                面談結果は機密性に応じて適切に保存されました
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => {
                  // リセット
                  setActiveTab('create');
                  setGeneratedSheet(null);
                  setInterviewId(null);
                  setCreateForm({
                    staffId: '',
                    staffName: '',
                    specialType: 'exit',
                    reason: '',
                    scheduledDate: new Date(),
                    urgentProcessing: false,
                    confidentialLevel: 'normal',
                    metadata: {}
                  });
                }}>
                  新しい面談作成
                </Button>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  面談記録表示
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}