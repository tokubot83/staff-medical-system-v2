'use client';

/**
 * 面談バンクフロー管理コンポーネント
 * 質問選択から面談実施までの一連のフローを管理
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Clock,
  Building,
  Briefcase,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Edit3,
  Save,
  PlayCircle,
  AlertCircle,
  CheckCircle,
  FileText,
  Settings,
  ArrowUpDown,
  Search,
  Library,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  X
} from 'lucide-react';

// 職員の型定義
interface Staff {
  id: string;
  name: string;
  facilityType: string;
  department: string;
  profession: string;
  experienceYears: number;
  employmentStatus: string;
  profileImage?: string;
  position?: string;
  joinDate?: string;
  email?: string;
  phone?: string;
  facility?: string;
}

// 質問の型定義
interface BankQuestion {
  id: string;
  text: string;
  category: string;
  section?: string;
  difficulty?: string;
  type?: string;
  isCustom?: boolean;
}

// カスタム質問の型定義
interface CustomQuestion {
  id: string;
  text: string;
  section: string;
  type: 'text' | 'textarea' | 'select' | 'scale';
  options?: string[];
}

// 面談設定の型定義
interface InterviewSettings {
  staffId: string;
  staff?: Staff;
  duration: 15 | 30 | 45;
  interviewDate: string;
  interviewTime: string;
  location: string;
  memo: string;
}

// フローステップの定義
const flowSteps = [
  { id: 'staff', label: '職員選択', icon: User },
  { id: 'settings', label: '面談設定', icon: Settings },
  { id: 'questions', label: '質問カスタマイズ', icon: FileText },
  { id: 'preview', label: '確認・生成', icon: CheckCircle }
];

interface InterviewBankFlowManagerProps {
  selectedQuestions: BankQuestion[];
  interviewType: string;
  onBack: () => void;
  onComplete: (settings: InterviewSettings, questions: BankQuestion[]) => void;
}

export default function InterviewBankFlowManager({
  selectedQuestions: initialQuestions,
  interviewType,
  onBack,
  onComplete
}: InterviewBankFlowManagerProps) {
  const [currentStep, setCurrentStep] = useState<string>('staff');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [interviewSettings, setInterviewSettings] = useState<InterviewSettings>({
    staffId: '',
    duration: 30,
    interviewDate: new Date().toISOString().split('T')[0],
    interviewTime: '10:00',
    location: '',
    memo: ''
  });
  const [selectedQuestions, setSelectedQuestions] = useState<BankQuestion[]>(initialQuestions);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [isCustomQuestionDialogOpen, setIsCustomQuestionDialogOpen] = useState(false);
  const [newCustomQuestion, setNewCustomQuestion] = useState<Partial<CustomQuestion>>({
    text: '',
    section: '',
    type: 'textarea'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [selectedSectionForBank, setSelectedSectionForBank] = useState<string>('');
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>([]);
  const [selectedBankQuestions, setSelectedBankQuestions] = useState<string[]>([]);

  // 実際の職員データを取得
  useEffect(() => {
    const loadStaffData = async () => {
      setIsLoadingStaff(true);
      try {
        // LocalStorageから職員データを取得
        const staffData: Staff[] = [];
        
        // LocalStorageのキーを走査
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('staff_')) {
            try {
              const data = JSON.parse(localStorage.getItem(key) || '{}');
              if (data.id && data.name) {
                // 経験年数の計算
                let experienceYears = 0;
                if (data.joinDate) {
                  const joinDate = new Date(data.joinDate);
                  const now = new Date();
                  experienceYears = Math.floor((now.getTime() - joinDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                }
                
                staffData.push({
                  id: data.id,
                  name: data.name,
                  facilityType: data.facility || data.facilityType || '特別養護老人ホーム',
                  department: data.department || '未設定',
                  profession: data.position || data.profession || '職員',
                  experienceYears: experienceYears || data.experienceYears || 0,
                  employmentStatus: data.employmentStatus || '正職員',
                  position: data.position,
                  joinDate: data.joinDate,
                  email: data.email,
                  phone: data.phone,
                  facility: data.facility
                });
              }
            } catch (err) {
              console.error('Error parsing staff data:', err);
            }
          }
        }
        
        // データがない場合はサンプルデータを追加
        if (staffData.length === 0) {
          const sampleStaff: Staff[] = [
            {
              id: 'sample_1',
              name: '山田太郎',
              facilityType: '特別養護老人ホーム',
              department: '看護部',
              profession: '看護師',
              experienceYears: 5,
              employmentStatus: '正職員',
              position: '看護師',
              joinDate: '2019-04-01',
              email: 'yamada@example.com'
            },
            {
              id: 'sample_2',
              name: '佐藤花子',
              facilityType: '特別養護老人ホーム',
              department: 'リハビリ部',
              profession: '理学療法士',
              experienceYears: 3,
              employmentStatus: '正職員',
              position: '理学療法士',
              joinDate: '2021-04-01',
              email: 'sato@example.com'
            },
            {
              id: 'sample_3',
              name: '田中次郎',
              facilityType: 'デイサービス',
              department: '介護部',
              profession: '介護職員',
              experienceYears: 1,
              employmentStatus: '正職員',
              position: '介護職員',
              joinDate: '2023-04-01',
              email: 'tanaka@example.com'
            },
            {
              id: 'sample_4',
              name: '鈴木美咲',
              facilityType: '特別養護老人ホーム',
              department: 'リハビリ部',
              profession: '作業療法士',
              experienceYears: 7,
              employmentStatus: '正職員',
              position: '作業療法士',
              joinDate: '2017-04-01',
              email: 'suzuki@example.com'
            },
            {
              id: 'sample_5',
              name: '高橋健一',
              facilityType: '特別養護老人ホーム',
              department: '介護部',
              profession: '介護主任',
              experienceYears: 10,
              employmentStatus: '正職員',
              position: '介護主任',
              joinDate: '2014-04-01',
              email: 'takahashi@example.com'
            }
          ];
          
          // サンプルデータをLocalStorageに保存
          sampleStaff.forEach(staff => {
            localStorage.setItem(`staff_${staff.id}`, JSON.stringify(staff));
          });
          
          setStaffList(sampleStaff);
        } else {
          setStaffList(staffData);
        }
      } catch (error) {
        console.error('Failed to load staff data:', error);
      } finally {
        setIsLoadingStaff(false);
      }
    };
    
    loadStaffData();
  }, []);

  // 推奨質問数の計算
  const getRecommendedQuestionCount = (duration: number) => {
    switch (duration) {
      case 15: return '3-5問';
      case 30: return '5-8問';
      case 45: return '8-12問';
      default: return '5-8問';
    }
  };

  // セクション定義（職員属性に応じて調整）
  const getSectionsForStaff = (staff: Staff | null) => {
    if (!staff) return [];
    
    const baseSections = [
      { id: 'opening', name: '導入', order: 1 },
      { id: 'current_status', name: '現状確認', order: 2 },
      { id: 'challenges', name: '課題・困りごと', order: 3 },
      { id: 'goals', name: '目標・展望', order: 4 },
      { id: 'support', name: 'サポート', order: 5 },
      { id: 'closing', name: 'まとめ', order: 6 }
    ];

    // 職種や経験年数に応じてセクションを調整
    if (staff.experienceYears < 2) {
      baseSections.splice(3, 0, { id: 'training', name: '研修・教育', order: 3.5 });
    }
    
    if (staff.profession === '看護師' || staff.profession === '理学療法士') {
      baseSections.splice(4, 0, { id: 'expertise', name: '専門性', order: 4.5 });
    }

    return baseSections;
  };

  // 質問バンクから該当セクションの質問を読み込み
  const loadBankQuestionsForSection = async (sectionId: string) => {
    try {
      // 質問バンクから読み込み（実際のデータソースに応じて調整）
      const { questionBank } = await import('@/lib/interview-bank/database/question-bank');
      
      // セクションに関連する質問をフィルタリング
      const relevantQuestions = questionBank
        .filter(q => {
          // セクションIDが一致するか、関連するタグを持つ質問を取得
          if (q.sectionId === sectionId) return true;
          
          // セクションに応じた質問をマッピング
          switch (sectionId) {
            case 'opening':
              return q.category === 'motivation_engagement' || q.tags?.includes('導入');
            case 'current_status':
              return q.category === 'current_situation' || q.tags?.includes('現状');
            case 'challenges':
              return q.category === 'challenges' || q.tags?.includes('課題');
            case 'goals':
              return q.category === 'goals' || q.tags?.includes('目標');
            case 'support':
              return q.category === 'support' || q.tags?.includes('サポート');
            case 'closing':
              return q.tags?.includes('まとめ') || q.tags?.includes('フィードバック');
            case 'training':
              return q.tags?.includes('研修') || q.tags?.includes('教育');
            case 'expertise':
              return q.tags?.includes('専門性') || q.tags?.includes('スキル');
            default:
              return false;
          }
        })
        .map(q => ({
          id: q.id,
          text: q.content,
          category: q.category,
          section: sectionId,
          difficulty: q.priority === 1 ? '必須' : q.priority === 2 ? '推奨' : 'オプション',
          type: q.type
        }));
      
      setBankQuestions(relevantQuestions);
    } catch (error) {
      console.error('質問バンクの読み込みエラー:', error);
      // フォールバック: サンプル質問を設定
      setBankQuestions([
        {
          id: `sample_${sectionId}_1`,
          text: `${getSectionsForStaff(selectedStaff).find(s => s.id === sectionId)?.name}に関する質問1`,
          category: 'sample',
          section: sectionId,
          difficulty: '推奨'
        },
        {
          id: `sample_${sectionId}_2`,
          text: `${getSectionsForStaff(selectedStaff).find(s => s.id === sectionId)?.name}に関する質問2`,
          category: 'sample',
          section: sectionId,
          difficulty: 'オプション'
        }
      ]);
    }
  };

  // 質問バンクから選択した質問を追加
  const handleAddBankQuestions = () => {
    const questionsToAdd = bankQuestions.filter(q => selectedBankQuestions.includes(q.id));
    setSelectedQuestions(prev => [...prev, ...questionsToAdd]);
    setShowBankDialog(false);
    setSelectedBankQuestions([]);
  };

  // 職員選択ハンドラ
  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff);
    setInterviewSettings(prev => ({
      ...prev,
      staffId: staff.id,
      staff: staff
    }));
  };

  // ステップ移動
  const handleNextStep = () => {
    const stepIndex = flowSteps.findIndex(s => s.id === currentStep);
    if (stepIndex < flowSteps.length - 1) {
      setCurrentStep(flowSteps[stepIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    const stepIndex = flowSteps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(flowSteps[stepIndex - 1].id);
    }
  };

  // カスタム質問の追加
  const handleAddCustomQuestion = () => {
    if (!newCustomQuestion.text || !newCustomQuestion.section) return;
    
    const customQuestion: CustomQuestion = {
      id: `custom_${Date.now()}`,
      text: newCustomQuestion.text,
      section: newCustomQuestion.section,
      type: newCustomQuestion.type || 'textarea',
      options: newCustomQuestion.options
    };

    setCustomQuestions([...customQuestions, customQuestion]);
    
    // BankQuestion形式でも追加
    const bankQuestion: BankQuestion = {
      id: customQuestion.id,
      text: customQuestion.text,
      category: 'custom',
      section: customQuestion.section,
      type: customQuestion.type,
      isCustom: true
    };
    
    setSelectedQuestions([...selectedQuestions, bankQuestion]);
    setIsCustomQuestionDialogOpen(false);
    setNewCustomQuestion({ text: '', section: '', type: 'textarea' });
  };

  // 質問の削除
  const handleRemoveQuestion = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
    setCustomQuestions(customQuestions.filter(q => q.id !== questionId));
  };

  // 面談シート生成
  const handleGenerateSheet = async () => {
    if (!selectedStaff || selectedQuestions.length === 0) return;
    
    try {
      // UnifiedBankServiceを使用してシートを生成
      const { UnifiedBankService } = await import('@/lib/interview-bank/services/unified-bank-service');
      const { StaffBankProfile } = await import('@/lib/interview-bank/types');
      
      const unifiedService = UnifiedBankService.getInstance();
      
      // StaffBankProfileの作成
      const staffProfile: StaffBankProfile = {
        staffId: selectedStaff.id,
        name: selectedStaff.name,
        department: selectedStaff.department,
        position: selectedStaff.profession,
        experienceYears: selectedStaff.experienceYears,
        experienceMonths: 0,
        facility: selectedStaff.facilityType,
        qualifications: [],
        lastInterviewDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        interests: [],
        challenges: []
      };
      
      // 面談パラメータの作成
      const interviewParams = {
        bankType: interviewType === 'regular' ? 'regular' as const : 
                  interviewType === 'support' ? 'support' as const : 
                  'special' as const,
        staffProfile,
        baseParams: {
          duration: interviewSettings.duration,
          interviewDate: new Date(interviewSettings.interviewDate),
          interviewType: interviewType as any,
          interviewerId: 'admin',
          interviewerName: '面談担当者',
          metadata: {
            location: interviewSettings.location,
            memo: interviewSettings.memo,
            selectedQuestions: selectedQuestions.map(q => q.id)
          }
        },
        regularParams: interviewType === 'regular' ? {
          focusAreas: [],
          customSections: selectedQuestions.filter(q => q.isCustom).map(q => ({
            id: q.id,
            name: q.section || 'カスタム',
            questions: [{ id: q.id, content: q.text, type: q.type || 'text' }]
          }))
        } : undefined,
        supportParams: interviewType === 'support' ? {
          category: 'workplace',
          urgency: 'medium' as const,
          consultationTopic: '職場環境',
          consultationDetails: interviewSettings.memo || ''
        } : undefined,
        specialParams: interviewType === 'special' ? {
          specialType: 'other' as any,
          reason: interviewSettings.memo || '特別面談',
          confidentialLevel: 'normal' as const
        } : undefined
      };
      
      // シート生成
      const result = await unifiedService.generateUnifiedInterview(interviewParams);
      
      // 成功時の処理
      console.log('面談シート生成成功:', result);
      
      // 設定と質問を親コンポーネントに渡す
      onComplete(interviewSettings, selectedQuestions);
    } catch (error) {
      console.error('面談シート生成エラー:', error);
      alert('面談シートの生成に失敗しました。');
    }
  };

  // フィルタリングされた職員リスト
  const filteredStaffList = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* プログレスバー */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          {flowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${currentStep === step.id 
                    ? 'bg-blue-600 text-white' 
                    : flowSteps.findIndex(s => s.id === currentStep) > index
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'}
                `}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${
                  currentStep === step.id ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.label}
                </p>
              </div>
              {index < flowSteps.length - 1 && (
                <ChevronRight className="w-5 h-5 mx-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ステップ1: 職員選択 */}
      {currentStep === 'staff' && (
        <Card>
          <CardHeader>
            <CardTitle>面談対象職員の選択</CardTitle>
            <CardDescription>
              面談を実施する職員を選択してください。職員の属性に応じて適切な質問が提案されます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 検索バー */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="職員名、部署、職種で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 職員リスト */}
            <ScrollArea className="h-[400px] border rounded-lg">
              <div className="p-4 space-y-2">
                {isLoadingStaff ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">職員データを読み込み中...</p>
                  </div>
                ) : filteredStaffList.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">該当する職員が見つかりません</p>
                  </div>
                ) : (
                  filteredStaffList.map((staff) => (
                  <div
                    key={staff.id}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedStaff?.id === staff.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                    `}
                    onClick={() => handleStaffSelect(staff)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {staff.profession}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {staff.department} • 経験{staff.experienceYears}年
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{staff.facilityType}</p>
                        <p className="text-xs text-gray-500">{staff.employmentStatus}</p>
                      </div>
                    </div>
                  </div>
                ))
                )}
              </div>
            </ScrollArea>

            {/* 選択中の職員情報 */}
            {selectedStaff && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>{selectedStaff.name}</strong>さんが選択されました。
                  {selectedStaff.profession}として{selectedStaff.experienceYears}年の経験があります。
                </AlertDescription>
              </Alert>
            )}

            {/* ナビゲーションボタン */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <Button 
                onClick={handleNextStep}
                disabled={!selectedStaff}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                次へ進む
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステップ2: 面談設定 */}
      {currentStep === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>面談設定</CardTitle>
            <CardDescription>
              面談の実施条件を設定してください。時間に応じて推奨質問数が表示されます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 職員情報表示 */}
            {selectedStaff && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="font-medium">{selectedStaff.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedStaff.department} • {selectedStaff.profession}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* 面談時間 */}
              <div className="space-y-2">
                <Label>面談時間</Label>
                <Select
                  value={interviewSettings.duration.toString()}
                  onValueChange={(value) => setInterviewSettings(prev => ({
                    ...prev,
                    duration: parseInt(value) as 15 | 30 | 45
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15分（短時間面談）</SelectItem>
                    <SelectItem value="30">30分（標準面談）</SelectItem>
                    <SelectItem value="45">45分（詳細面談）</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  推奨質問数: {getRecommendedQuestionCount(interviewSettings.duration)}
                </p>
              </div>

              {/* 実施日 */}
              <div className="space-y-2">
                <Label>実施日</Label>
                <Input
                  type="date"
                  value={interviewSettings.interviewDate}
                  onChange={(e) => setInterviewSettings(prev => ({
                    ...prev,
                    interviewDate: e.target.value
                  }))}
                />
              </div>

              {/* 実施時間 */}
              <div className="space-y-2">
                <Label>開始時間</Label>
                <Input
                  type="time"
                  value={interviewSettings.interviewTime}
                  onChange={(e) => setInterviewSettings(prev => ({
                    ...prev,
                    interviewTime: e.target.value
                  }))}
                />
              </div>

              {/* 場所 */}
              <div className="space-y-2">
                <Label>実施場所</Label>
                <Input
                  placeholder="会議室A、オンライン等"
                  value={interviewSettings.location}
                  onChange={(e) => setInterviewSettings(prev => ({
                    ...prev,
                    location: e.target.value
                  }))}
                />
              </div>
            </div>

            {/* メモ */}
            <div className="space-y-2">
              <Label>事前メモ</Label>
              <Textarea
                placeholder="面談に関する注意事項や確認事項を記入..."
                value={interviewSettings.memo}
                onChange={(e) => setInterviewSettings(prev => ({
                  ...prev,
                  memo: e.target.value
                }))}
                rows={3}
              />
            </div>

            {/* 現在の選択質問数 */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                現在{selectedQuestions.length}問が選択されています。
                {interviewSettings.duration}分の面談では{getRecommendedQuestionCount(interviewSettings.duration)}が推奨です。
              </AlertDescription>
            </Alert>

            {/* ナビゲーションボタン */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <Button 
                onClick={handleNextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                次へ進む
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステップ3: 質問カスタマイズ */}
      {currentStep === 'questions' && (
        <Card>
          <CardHeader>
            <CardTitle>質問のカスタマイズ</CardTitle>
            <CardDescription>
              面談バンクから質問を選択したり、独自の質問を追加できます。
              推奨質問数: {getRecommendedQuestionCount(interviewSettings.duration)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* セクション別質問表示 */}
            <div className="space-y-4">
              {getSectionsForStaff(selectedStaff).map((section) => {
                const sectionQuestions = selectedQuestions.filter(
                  q => q.section === section.id || (!q.section && section.id === 'current_status')
                );
                const isExpanded = expandedSections.includes(section.id);
                
                return (
                  <div key={section.id} className="border-2 rounded-xl overflow-hidden hover:border-blue-300 transition-all">
                    {/* セクションヘッダー */}
                    <div 
                      className="bg-gradient-to-r from-gray-50 to-white p-4 cursor-pointer"
                      onClick={() => {
                        setExpandedSections(prev => 
                          prev.includes(section.id) 
                            ? prev.filter(s => s !== section.id)
                            : [...prev, section.id]
                        );
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{section.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {sectionQuestions.length > 0 
                                ? `${sectionQuestions.length}問選択中`
                                : '質問を追加してください'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={sectionQuestions.length > 0 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {sectionQuestions.length}問
                          </Badge>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* セクション内容（展開時） */}
                    {isExpanded && (
                      <div className="p-4 bg-white border-t">
                        {/* 質問リスト */}
                        <div className="space-y-2 mb-4">
                          {sectionQuestions.length > 0 ? (
                            sectionQuestions.map((question, index) => (
                              <div
                                key={question.id}
                                className="group flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-800">{question.text}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {question.isCustom && (
                                      <Badge variant="outline" className="text-xs">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        独自質問
                                      </Badge>
                                    )}
                                    {question.difficulty && (
                                      <Badge 
                                        variant={question.difficulty === '必須' ? 'destructive' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {question.difficulty}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleRemoveQuestion(question.id)}
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-sm text-gray-500">
                                このセクションにはまだ質問がありません
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                下のボタンから質問を追加してください
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* アクションボタン */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedSectionForBank(section.id);
                              // 質問バンクから該当セクションの質問を読み込み
                              loadBankQuestionsForSection(section.id);
                              setShowBankDialog(true);
                            }}
                          >
                            <Library className="w-4 h-4 mr-2" />
                            バンクから選択
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setNewCustomQuestion(prev => ({ ...prev, section: section.id }));
                              setIsCustomQuestionDialogOpen(true);
                            }}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            独自質問を作成
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* クイックアクション */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    ヒント: 各セクションをクリックして展開し、質問を追加してください
                  </span>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-blue-600"
                  onClick={() => {
                    // すべてのセクションを展開/折りたたみ
                    const allSections = getSectionsForStaff(selectedStaff).map(s => s.id);
                    setExpandedSections(prev => 
                      prev.length === allSections.length ? [] : allSections
                    );
                  }}
                >
                  {expandedSections.length === getSectionsForStaff(selectedStaff).length
                    ? 'すべて折りたたむ'
                    : 'すべて展開'}
                </Button>
              </div>
            </div>

            {/* 質問数サマリー */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                合計{selectedQuestions.length}問
                （バンクから{selectedQuestions.filter(q => !q.isCustom).length}問、
                独自質問{customQuestions.length}問）
              </AlertDescription>
            </Alert>

            {/* ナビゲーションボタン */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <Button 
                onClick={handleNextStep}
                disabled={selectedQuestions.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                次へ進む
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステップ4: 確認・生成 */}
      {currentStep === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>面談シートの確認</CardTitle>
            <CardDescription>
              設定内容を確認して、面談シートを生成してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 面談概要 */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="font-medium mb-3">面談概要</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">対象職員</p>
                  <p className="font-medium">{selectedStaff?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">職種・経験</p>
                  <p className="font-medium">
                    {selectedStaff?.profession} • {selectedStaff?.experienceYears}年
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">実施日時</p>
                  <p className="font-medium">
                    {interviewSettings.interviewDate} {interviewSettings.interviewTime}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">所要時間</p>
                  <p className="font-medium">{interviewSettings.duration}分</p>
                </div>
                <div>
                  <p className="text-gray-600">場所</p>
                  <p className="font-medium">{interviewSettings.location || '未設定'}</p>
                </div>
                <div>
                  <p className="text-gray-600">質問数</p>
                  <p className="font-medium">{selectedQuestions.length}問</p>
                </div>
              </div>
              {interviewSettings.memo && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">事前メモ</p>
                  <p className="text-sm mt-1">{interviewSettings.memo}</p>
                </div>
              )}
            </div>

            {/* 質問プレビュー */}
            <div className="space-y-3">
              <h3 className="font-medium">面談質問一覧</h3>
              <ScrollArea className="h-[300px] border rounded-lg p-4">
                {getSectionsForStaff(selectedStaff).map((section) => {
                  const sectionQuestions = selectedQuestions.filter(
                    q => q.section === section.id || (!q.section && section.id === 'current_status')
                  );
                  
                  if (sectionQuestions.length === 0) return null;
                  
                  return (
                    <div key={section.id} className="mb-4">
                      <h4 className="font-medium text-blue-600 mb-2">
                        {section.name}
                      </h4>
                      <div className="space-y-2 pl-4">
                        {sectionQuestions.map((question, index) => (
                          <div key={question.id} className="text-sm">
                            <p>{index + 1}. {question.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <Button 
                onClick={handleGenerateSheet}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                面談シートを生成して開始
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 質問バンクから選択ダイアログ */}
      <Dialog open={showBankDialog} onOpenChange={setShowBankDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Library className="w-5 h-5 text-blue-600" />
              質問バンクから選択
            </DialogTitle>
            <DialogDescription>
              「{getSectionsForStaff(selectedStaff).find(s => s.id === selectedSectionForBank)?.name}」
              セクションに適した質問を選択してください
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 検索バー */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="質問を検索..."
                className="pl-10"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  // 検索機能の実装（必要に応じて）
                }}
              />
            </div>
            
            {/* 質問リスト */}
            <ScrollArea className="h-[400px] border rounded-lg p-4">
              <div className="space-y-2">
                {bankQuestions.length > 0 ? (
                  bankQuestions.map((question) => {
                    const isSelected = selectedBankQuestions.includes(question.id);
                    const isAlreadyAdded = selectedQuestions.some(q => q.id === question.id);
                    
                    return (
                      <div
                        key={question.id}
                        className={`
                          p-3 rounded-lg border-2 transition-all cursor-pointer
                          ${isAlreadyAdded 
                            ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed' 
                            : isSelected 
                            ? 'bg-blue-50 border-blue-400' 
                            : 'hover:bg-gray-50 border-gray-200'}
                        `}
                        onClick={() => {
                          if (isAlreadyAdded) return;
                          setSelectedBankQuestions(prev =>
                            prev.includes(question.id)
                              ? prev.filter(id => id !== question.id)
                              : [...prev, question.id]
                          );
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              checked={isSelected || isAlreadyAdded}
                              disabled={isAlreadyAdded}
                              onChange={() => {}}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{question.text}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {question.difficulty && (
                                <Badge 
                                  variant={
                                    question.difficulty === '必須' ? 'destructive' : 
                                    question.difficulty === '推奨' ? 'default' : 
                                    'secondary'
                                  }
                                  className="text-xs"
                                >
                                  {question.difficulty}
                                </Badge>
                              )}
                              {question.type && (
                                <Badge variant="outline" className="text-xs">
                                  {question.type}
                                </Badge>
                              )}
                              {isAlreadyAdded && (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  追加済み
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Library className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      このセクションに適した質問を読み込み中...
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* 選択状況 */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">
                {selectedBankQuestions.length}問選択中
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBankQuestions([])}
                  disabled={selectedBankQuestions.length === 0}
                >
                  選択をクリア
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBankDialog(false);
                setSelectedBankQuestions([]);
              }}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleAddBankQuestions}
              disabled={selectedBankQuestions.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {selectedBankQuestions.length}問を追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 独自質問追加ダイアログ */}
      <Dialog open={isCustomQuestionDialogOpen} onOpenChange={setIsCustomQuestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              独自質問の作成
            </DialogTitle>
            <DialogDescription>
              {newCustomQuestion.section && 
                `「${getSectionsForStaff(selectedStaff).find(s => s.id === newCustomQuestion.section)?.name}」セクションに`
              }
              独自の質問を追加します
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>質問文</Label>
              <Textarea
                placeholder="質問内容を入力してください..."
                value={newCustomQuestion.text}
                onChange={(e) => setNewCustomQuestion(prev => ({
                  ...prev,
                  text: e.target.value
                }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>セクション</Label>
              <Select
                value={newCustomQuestion.section}
                onValueChange={(value) => setNewCustomQuestion(prev => ({
                  ...prev,
                  section: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="セクションを選択" />
                </SelectTrigger>
                <SelectContent>
                  {getSectionsForStaff(selectedStaff).map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>回答形式</Label>
              <Select
                value={newCustomQuestion.type}
                onValueChange={(value) => setNewCustomQuestion(prev => ({
                  ...prev,
                  type: value as 'text' | 'textarea' | 'select' | 'scale'
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="textarea">自由記述（複数行）</SelectItem>
                  <SelectItem value="text">自由記述（単一行）</SelectItem>
                  <SelectItem value="scale">評価スケール</SelectItem>
                  <SelectItem value="select">選択式</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCustomQuestionDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleAddCustomQuestion}
              disabled={!newCustomQuestion.text || !newCustomQuestion.section}
            >
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}