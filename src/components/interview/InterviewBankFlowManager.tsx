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
  Search
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
              選択した質問の確認と調整、独自質問の追加ができます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* セクション別質問表示 */}
            <div className="space-y-4">
              {getSectionsForStaff(selectedStaff).map((section) => {
                const sectionQuestions = selectedQuestions.filter(
                  q => q.section === section.id || (!q.section && section.id === 'current_status')
                );
                
                return (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{section.name}</h3>
                      <Badge variant="secondary">
                        {sectionQuestions.length}問
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {sectionQuestions.map((question, index) => (
                        <div
                          key={question.id}
                          className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm">{index + 1}. {question.text}</p>
                            {question.isCustom && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                独自質問
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(question.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      
                      {sectionQuestions.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          このセクションに質問がありません
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 独自質問追加ボタン */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsCustomQuestionDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              独自質問を追加
            </Button>

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

      {/* 独自質問追加ダイアログ */}
      <Dialog open={isCustomQuestionDialogOpen} onOpenChange={setIsCustomQuestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>独自質問の追加</DialogTitle>
            <DialogDescription>
              面談で使用する独自の質問を追加できます。
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