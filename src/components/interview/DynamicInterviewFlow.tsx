'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  User, 
  Clock, 
  FileText, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  CheckCircle,
  Brain,
  Target,
  Users,
  Calendar,
  Printer
} from 'lucide-react';
import styles from './DynamicInterviewFlow.module.css';
import { 
  InterviewManualGenerationService, 
  ManualGenerationRequest,
  GeneratedInterviewManual,
  StaffLevel,
  JobRole,
  FacilityType,
  InterviewDuration
} from '@/services/interviewManualGenerationServiceV2';
import { 
  MotivationTypeDiagnosisService,
  MotivationType,
  MotivationQuestion
} from '@/services/motivationTypeDiagnosisService';
import { InterviewFlowOrchestrationService } from '@/services/interviewFlowOrchestrationService';
import { 
  SpecialInterviewTemplateService,
  SpecialInterviewType,
  ReturnReason,
  IncidentLevel
} from '@/services/specialInterviewTemplates';

// 職員データの型定義
interface StaffMember {
  id: string;
  name: string;
  department: string;
  position: string;
  jobRole: JobRole;
  experienceYears: number;
  experienceMonths: number;
  facilityType: FacilityType;
  lastInterviewDate?: string;
  motivationType?: MotivationType;
  profileImage?: string;
}

// フロー状態の型定義
type FlowStep = 'staff-select' | 'interview-type' | 'special-type-select' | 'special-context' | 'support-request' | 'duration' | 'generating' | 'conducting' | 'completed';

interface InterviewSession {
  staffMember: StaffMember | null;
  interviewType: string;
  specialType?: string; // 特別面談の詳細タイプ
  specialContext?: any; // 特別面談のコンテキスト情報
  supportRequest?: any; // サポート面談のリクエスト情報
  duration: InterviewDuration;
  includeMotivationDiagnosis: boolean;
  manual: GeneratedInterviewManual | null;
  responses: Map<string, any>;
  currentSectionIndex: number;
  startTime: Date | null;
  endTime: Date | null;
}

export default function DynamicInterviewFlow() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('staff-select');
  const [session, setSession] = useState<InterviewSession>({
    staffMember: null,
    interviewType: '',
    duration: 30,
    includeMotivationDiagnosis: false,
    manual: null,
    responses: new Map(),
    currentSectionIndex: 0,
    startTime: null,
    endTime: null
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [motivationQuestions, setMotivationQuestions] = useState<MotivationQuestion[]>([]);
  const [showMotivationDiagnosis, setShowMotivationDiagnosis] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false); // 印刷モードフラグ
  const [showPrintPreview, setShowPrintPreview] = useState(false); // 印刷プレビューフラグ

  // スタッフデータの取得（実際にはAPIから）
  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    // モックデータ（実際にはAPIコール）
    const mockStaff: StaffMember[] = [
      {
        id: 'STAFF001',
        name: '山田太郎',
        department: '看護部',
        position: '看護師',
        jobRole: 'nurse',
        experienceYears: 2,
        experienceMonths: 26,
        facilityType: 'acute',
        lastInterviewDate: '2024-01-15',
        motivationType: undefined // 初回は未診断
      },
      {
        id: 'STAFF002',
        name: '佐藤花子',
        department: 'リハビリテーション科',
        position: '理学療法士',
        jobRole: 'pt',
        experienceYears: 0,
        experienceMonths: 8,
        facilityType: 'acute',
        lastInterviewDate: '2024-02-01',
        motivationType: 'growth'
      },
      {
        id: 'STAFF003',
        name: '鈴木一郎',
        department: '看護部',
        position: '看護補助者',
        jobRole: 'nursing-aide',
        experienceYears: 5,
        experienceMonths: 62,
        facilityType: 'chronic',
        lastInterviewDate: '2023-12-20',
        motivationType: 'affiliation'
      }
    ];
    
    setStaffList(mockStaff);
    setFilteredStaff(mockStaff);
  };

  // 職員検索
  useEffect(() => {
    const filtered = staffList.filter(staff =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  }, [searchTerm, staffList]);

  // 職員選択
  const handleStaffSelect = (staff: StaffMember) => {
    // 動機タイプが未診断の場合は診断を含める
    const needsMotivationDiagnosis = !staff.motivationType;
    
    setSession(prev => ({
      ...prev,
      staffMember: staff,
      includeMotivationDiagnosis: needsMotivationDiagnosis
    }));
    
    if (needsMotivationDiagnosis) {
      setShowMotivationDiagnosis(true);
      const questions = MotivationTypeDiagnosisService.getQuestions();
      setMotivationQuestions(questions);
    }
    
    setCurrentStep('interview-type');
  };

  // 面談種類選択
  const handleInterviewTypeSelect = (type: string) => {
    setSession(prev => ({
      ...prev,
      interviewType: type
    }));
    setCurrentStep('duration');
  };

  // 時間選択
  const handleDurationSelect = (duration: InterviewDuration) => {
    setSession(prev => ({
      ...prev,
      duration
    }));
    generateManual();
  };

  // マニュアル生成
  const generateManual = async () => {
    setCurrentStep('generating');
    setIsGenerating(true);
    
    try {
      let manual: GeneratedInterviewManual;
      
      // 特別面談の場合
      if (session.interviewType === 'special' && session.specialType) {
        if (session.specialType === 'return_to_work') {
          // 復職面談テンプレート取得
          const template = SpecialInterviewTemplateService.getReturnToWorkTemplate(
            session.specialContext?.returnReason as ReturnReason,
            session.duration
          );
          
          if (template) {
            // テンプレートをマニュアル形式に変換
            manual = {
              id: `special_rtw_${Date.now()}`,
              title: `復職面談マニュアル（${session.duration}分）`,
              generatedAt: new Date(),
              estimatedDuration: session.duration,
              staffInfo: {
                level: determineStaffLevel(session.staffMember!.experienceMonths),
                jobRole: session.staffMember!.jobRole,
                facility: session.staffMember!.facilityType,
                levelDescription: ''
              },
              overview: {
                purpose: '安全で円滑な職場復帰を支援',
                objectives: ['健康状態確認', '勤務条件調整', 'サポート体制構築'],
                keyPoints: ['受容的態度', '段階的復帰', '継続的フォロー'],
                preparationItems: ['復職診断書確認', '勤務体制準備', 'メンター選定']
              },
              sections: template.sections as any,
              timeAllocation: template.sections.map(s => ({
                section: s.title,
                minutes: s.duration,
                percentage: Math.round((s.duration / session.duration) * 100)
              })),
              guidelines: {
                dos: ['温かく迎える', '無理をさせない', '定期的フォロー'],
                donts: ['プレッシャーをかけない', '過度な期待', 'プライバシー侵害'],
                tips: ['段階的な業務復帰', '心理的サポート重視']
              }
            };
          } else {
            throw new Error('復職面談テンプレートが見つかりません');
          }
          
        } else if (session.specialType === 'incident_followup') {
          // インシデント後面談テンプレート取得
          const template = SpecialInterviewTemplateService.getIncidentFollowupTemplate(
            session.specialContext?.incidentLevel as IncidentLevel,
            session.duration
          );
          
          if (template) {
            manual = {
              id: `special_inc_${Date.now()}`,
              title: `インシデント後面談マニュアル（${session.duration}分）`,
              generatedAt: new Date(),
              estimatedDuration: session.duration,
              staffInfo: {
                level: determineStaffLevel(session.staffMember!.experienceMonths),
                jobRole: session.staffMember!.jobRole,
                facility: session.staffMember!.facilityType,
                levelDescription: ''
              },
              overview: {
                purpose: '事故の振り返りと再発防止',
                objectives: ['事実確認', '原因分析', '改善策立案', '心理的ケア'],
                keyPoints: ['非懲罰的対応', 'システム思考', '学習機会'],
                preparationItems: ['インシデントレポート', '関連資料', '改善提案']
              },
              sections: template.sections as any,
              timeAllocation: template.sections.map(s => ({
                section: s.title,
                minutes: s.duration,
                percentage: Math.round((s.duration / session.duration) * 100)
              })),
              guidelines: {
                dos: ['傾聴姿勢', '建設的議論', '心理的サポート'],
                donts: ['責めない', '個人批判', '隠蔽を疑う'],
                tips: ['システム要因を探る', '再発防止重視']
              }
            };
          } else {
            throw new Error('インシデント後面談テンプレートが見つかりません');
          }
        } else {
          throw new Error('未対応の特別面談タイプです');
        }
        
      } else {
        // 通常の定期面談
        const staffLevel = determineStaffLevel(session.staffMember!.experienceMonths);
        
        const request: ManualGenerationRequest = {
          staffLevel,
          jobRole: session.staffMember!.jobRole,
          facilityType: session.staffMember!.facilityType,
          interviewType: session.interviewType as any,
          duration: session.duration,
          motivationType: session.staffMember!.motivationType,
          includeEvaluation: true
        };
        
        manual = await InterviewManualGenerationService.generateManual(request);
      }
      
      setSession(prev => ({
        ...prev,
        manual,
        startTime: new Date()
      }));
      
      setTimeout(() => {
        setIsGenerating(false);
        setCurrentStep('conducting');
      }, 2000);
      
    } catch (error) {
      console.error('Manual generation failed:', error);
      setIsGenerating(false);
      alert('マニュアル生成に失敗しました: ' + error);
    }
  };

  // 職員レベルの判定
  const determineStaffLevel = (months: number): StaffLevel => {
    if (months < 12) return 'new';
    if (months < 24) return 'junior';
    if (months < 36) return 'general';
    if (months < 60) return 'midlevel';
    if (months < 84) return 'senior';
    if (months < 120) return 'veteran';
    return 'leader';
  };

  // 回答の保存
  const handleResponseSave = (questionId: string, response: any) => {
    setSession(prev => {
      const newResponses = new Map(prev.responses);
      newResponses.set(questionId, response);
      return {
        ...prev,
        responses: newResponses
      };
    });
  };

  // セクション移動
  const handleNextSection = () => {
    if (session.currentSectionIndex < (session.manual?.sections.length || 0) - 1) {
      setSession(prev => ({
        ...prev,
        currentSectionIndex: prev.currentSectionIndex + 1
      }));
    } else {
      completeInterview();
    }
  };

  // 面談完了
  const completeInterview = async () => {
    setSession(prev => ({
      ...prev,
      endTime: new Date()
    }));
    
    // 動機タイプ診断結果の処理
    if (session.includeMotivationDiagnosis) {
      const motivationResponses = new Map();
      // 動機タイプ質問の回答を抽出
      motivationQuestions.forEach(q => {
        const response = session.responses.get(q.id);
        if (response) {
          motivationResponses.set(q.id, response);
        }
      });
      
      if (motivationResponses.size > 0) {
        const diagnosisResult = MotivationTypeDiagnosisService.diagnoseFromInterviewResponses(motivationResponses);
        
        // 職員カルテに反映
        await MotivationTypeDiagnosisService.updateStaffMindsetProfile(
          session.staffMember!.id,
          diagnosisResult,
          `interview_${Date.now()}`
        );
      }
    }
    
    // 面談データの保存と配信
    const sessionMaster = await InterviewFlowOrchestrationService.conductInterview(
      `session_${Date.now()}`,
      session.responses,
      {
        mode: 'full-digital',
        realTimeSync: true,
        autoApproval: false,
        notifyStaff: true,
        generateReport: true
      }
    );
    
    // データ配信
    await InterviewFlowOrchestrationService.distributeInterviewData(sessionMaster);
    
    setCurrentStep('completed');
  };

  // プログレスバーの計算
  const calculateProgress = () => {
    const steps = ['staff-select', 'interview-type', 'duration', 'generating', 'conducting', 'completed'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-6 ${isPrintMode ? 'print-preview-mode' : ''}`}>
      {/* プログレスバー */}
      <div className="mb-8">
        <Progress value={calculateProgress()} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span className={currentStep === 'staff-select' ? 'font-bold text-blue-600' : ''}>職員選択</span>
          <span className={currentStep === 'interview-type' ? 'font-bold text-blue-600' : ''}>面談種類</span>
          <span className={currentStep === 'duration' ? 'font-bold text-blue-600' : ''}>時間設定</span>
          <span className={currentStep === 'generating' ? 'font-bold text-blue-600' : ''}>生成中</span>
          <span className={currentStep === 'conducting' ? 'font-bold text-blue-600' : ''}>面談実施</span>
          <span className={currentStep === 'completed' ? 'font-bold text-blue-600' : ''}>完了</span>
        </div>
      </div>

      {/* Step 1: 職員選択 */}
      {currentStep === 'staff-select' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              面談対象者を選択
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 検索バー */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="氏名、部署、職種で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 職員リスト */}
              <div className="grid gap-3">
                {filteredStaff.map(staff => (
                  <div
                    key={staff.id}
                    onClick={() => handleStaffSelect(staff)}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{staff.name}</h3>
                        <p className="text-sm text-gray-600">{staff.department} / {staff.position}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          経験: {staff.experienceYears}年{staff.experienceMonths % 12}ヶ月
                          {staff.lastInterviewDate && ` | 前回面談: ${staff.lastInterviewDate}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!staff.motivationType && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            動機タイプ未診断
                          </span>
                        )}
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: 面談種類選択 */}
      {currentStep === 'interview-type' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              面談種類を選択
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {session.staffMember?.name}さん（{session.staffMember?.position}）の面談種類を選択してください
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 定期面談 */}
              <Card 
                className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => handleInterviewTypeSelect('regular_annual')}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Calendar className="h-10 w-10 text-blue-500" />
                    <h3 className="font-semibold">定期面談</h3>
                    <p className="text-sm text-gray-600">
                      年次・半期の定期的な面談
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 業務評価</li>
                      <li>• 目標設定</li>
                      <li>• キャリア相談</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 特別面談 */}
              <Card 
                className="cursor-pointer hover:border-orange-500 transition-colors"
                onClick={() => {
                  setSession(prev => ({
                    ...prev,
                    interviewType: 'special'
                  }));
                  setCurrentStep('special-type-select');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <AlertCircle className="h-10 w-10 text-orange-500" />
                    <h3 className="font-semibold">特別面談</h3>
                    <p className="text-sm text-gray-600">
                      特定の状況に応じた面談
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 復職面談</li>
                      <li>• インシデント後</li>
                      <li>• 退職面談</li>
                    </ul>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Phase 2実装</span>
                  </div>
                </CardContent>
              </Card>

              {/* サポート面談 */}
              <Card 
                className="cursor-pointer hover:border-green-500 transition-colors opacity-50"
                onClick={() => alert('サポート面談は開発中です')}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Users className="h-10 w-10 text-green-500" />
                    <h3 className="font-semibold">サポート面談</h3>
                    <p className="text-sm text-gray-600">
                      職員からの相談・要望
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• キャリア相談</li>
                      <li>• 職場環境</li>
                      <li>• 個別相談</li>
                    </ul>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">開発中</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 動機タイプ診断の通知 */}
            {session.includeMotivationDiagnosis && (
              <Alert className="mt-4">
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  {session.staffMember?.name}さんは動機タイプ未診断のため、初回診断質問（5問）が追加されます。
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2.5: 特別面談種類選択 */}
      {currentStep === 'special-type-select' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              特別面談の種類を選択
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {session.staffMember?.name}さんの特別面談の詳細を選択してください
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 復職面談 */}
              <Card 
                className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => {
                  setSession(prev => ({
                    ...prev,
                    specialType: 'return_to_work'
                  }));
                  setCurrentStep('special-context');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <User className="h-10 w-10 text-blue-500" />
                    <h3 className="font-semibold">復職面談</h3>
                    <p className="text-sm text-gray-600">
                      休職からの復帰支援
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 産休・育休</li>
                      <li>• 病気療養</li>
                      <li>• メンタルヘルス</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* インシデント後面談 */}
              <Card 
                className="cursor-pointer hover:border-red-500 transition-colors"
                onClick={() => {
                  setSession(prev => ({
                    ...prev,
                    specialType: 'incident_followup'
                  }));
                  setCurrentStep('special-context');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                    <h3 className="font-semibold">インシデント後面談</h3>
                    <p className="text-sm text-gray-600">
                      事故・ミス後のフォロー
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• ヒヤリハット</li>
                      <li>• 医療事故</li>
                      <li>• 再発防止</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 退職面談 */}
              <Card 
                className="cursor-pointer hover:border-gray-500 transition-colors"
                onClick={() => alert('退職面談は既存機能をご利用ください')}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <User className="h-10 w-10 text-gray-500" />
                    <h3 className="font-semibold">退職面談</h3>
                    <p className="text-sm text-gray-600">
                      退職予定者との面談
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 退職理由確認</li>
                      <li>• 引き継ぎ</li>
                      <li>• 組織改善</li>
                    </ul>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-2">既存機能</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2.6: 特別面談コンテキスト */}
      {currentStep === 'special-context' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {session.specialType === 'return_to_work' ? '復職理由の選択' : 'インシデントレベルの選択'}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              詳細情報を選択してください
            </p>
          </CardHeader>
          <CardContent>
            {session.specialType === 'return_to_work' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { value: 'maternity', label: '産休・育休', icon: '👶', description: '出産・育児休暇からの復帰' },
                  { value: 'medical', label: '病気療養', icon: '🏥', description: '身体的疾患からの回復' },
                  { value: 'mental', label: 'メンタルヘルス', icon: '🧠', description: '精神的不調からの回復' },
                  { value: 'injury', label: '怪我・事故', icon: '🤕', description: '労災・交通事故等' },
                  { value: 'family', label: '家族介護', icon: '👨‍👩‍👧', description: '介護休暇からの復帰' },
                  { value: 'other', label: 'その他', icon: '📝', description: 'その他の理由' }
                ].map(reason => (
                  <Card
                    key={reason.value}
                    className="cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => {
                      setSession(prev => ({
                        ...prev,
                        specialContext: { returnReason: reason.value }
                      }));
                      setCurrentStep('duration');
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl mb-2">{reason.icon}</div>
                        <h4 className="font-semibold text-sm">{reason.label}</h4>
                        <p className="text-xs text-gray-500 mt-1">{reason.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {session.specialType === 'incident_followup' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  インシデントの影響度レベルを選択してください
                </p>
                <div className="grid gap-3">
                  {[
                    { value: 'level0', label: 'レベル0', description: 'ヒヤリハット（患者への影響なし）', color: 'bg-green-50 hover:bg-green-100' },
                    { value: 'level1', label: 'レベル1', description: '軽微な影響（観察強化で済む）', color: 'bg-yellow-50 hover:bg-yellow-100' },
                    { value: 'level2', label: 'レベル2', description: '中程度の影響（簡単な処置が必要）', color: 'bg-orange-50 hover:bg-orange-100' },
                    { value: 'level3a', label: 'レベル3a', description: '重大な影響（濃厚な処置が必要だが回復）', color: 'bg-red-50 hover:bg-red-100' },
                    { value: 'level3b', label: 'レベル3b', description: '重大な影響（永続的な障害・後遺症）', color: 'bg-red-100 hover:bg-red-200' },
                    { value: 'level4', label: 'レベル4-5', description: '死亡または重篤な状態', color: 'bg-gray-100 hover:bg-gray-200' }
                  ].map(level => (
                    <div
                      key={level.value}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${level.color} border`}
                      onClick={() => {
                        setSession(prev => ({
                          ...prev,
                          specialContext: { incidentLevel: level.value }
                        }));
                        setCurrentStep('duration');
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{level.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    レベル3b以上の場合は、医療安全管理委員会への報告も必要です
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: 時間選択 */}
      {currentStep === 'duration' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              面談時間を選択
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              面談の予定時間を選択してください
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[15, 30, 45].map(duration => (
                <Card
                  key={duration}
                  className="cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => handleDurationSelect(duration as InterviewDuration)}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{duration}</div>
                      <div className="text-sm text-gray-600 mt-1">分</div>
                      <div className="text-xs text-gray-500 mt-3">
                        {duration === 15 && 'ポイント確認'}
                        {duration === 30 && '標準面談'}
                        {duration === 45 && '詳細面談'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* 時間配分の目安 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">時間配分の目安</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• 15分: 重要事項の確認、簡潔なフィードバック</div>
                <div>• 30分: 標準的な定期面談、業務評価と目標設定</div>
                <div>• 45分: 詳細な評価、キャリア相談、問題解決</div>
                {session.includeMotivationDiagnosis && (
                  <div className="text-orange-600 mt-2">
                    ※ 動機タイプ診断（約5分）が追加されます
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: マニュアル生成中 */}
      {currentStep === 'generating' && (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center space-y-6">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">面談マニュアルを生成中...</h3>
                <p className="text-sm text-gray-600">
                  {session.staffMember?.name}さん専用の面談マニュアルを作成しています
                </p>
              </div>
              
              {/* 生成ステップ */}
              <div className="w-full max-w-md space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">職員情報を取得</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">経験レベル・職種を判定</span>
                </div>
                <div className="flex items-center gap-3">
                  {isGenerating ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <span className="text-sm">カスタマイズされた質問を生成</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: 面談実施 */}
      {currentStep === 'conducting' && session.manual && (
        <div className="space-y-6">
          {/* モード切り替えボタン */}
          <div className="flex justify-end gap-2 print:hidden">
            <Button
              variant={isPrintMode ? 'outline' : 'default'}
              size="sm"
              onClick={() => setIsPrintMode(false)}
            >
              <FileText className="h-4 w-4 mr-1" />
              デジタル入力モード
            </Button>
            <Button
              variant={isPrintMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPrintMode(true)}
            >
              <FileText className="h-4 w-4 mr-1" />
              印刷用モード
            </Button>
            {isPrintMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                印刷
              </Button>
            )}
          </div>

          {/* ヘッダー情報 */}
          <Card className={isPrintMode ? 'print-mode-card' : ''}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold print:text-base">
                    {session.staffMember?.name}さん - {session.manual.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 print:text-xs">
                    {session.staffMember?.department} / {session.staffMember?.position}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 print:text-xs">予定時間: {session.duration}分</p>
                  <p className="text-sm text-gray-600 print:text-xs">
                    セクション: {session.currentSectionIndex + 1} / {session.manual.sections.length}
                  </p>
                  {isPrintMode && (
                    <p className="text-xs text-gray-500 mt-2 print:block hidden">
                      実施日: ___________　面談者: ___________
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* セクション表示 - 印刷モード時は全セクション、通常時は現在のセクションのみ */}
          {isPrintMode ? (
            // 印刷モード：全セクションを一括表示
            <>
              {session.manual.sections.map((section, sectionIndex) => (
                <Card key={sectionIndex} className="print-mode-card mb-4 print:mb-2">
                  <CardHeader className="print:bg-white print:border-b print:border-gray-300 print:py-1">
                    <CardTitle className="print:text-xs print:font-bold">
                      セクション{sectionIndex + 1}: {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-3 print:space-y-1 print:pt-1">
                    {section.questions.map((question, qIndex) => (
                      <div key={question.id} className="print-question-item mb-1">
                        <div className="flex items-start gap-1">
                          <span className="text-xs font-bold">
                            {sectionIndex + 1}.{qIndex + 1}
                          </span>
                          <div className="flex-grow">
                            <Label className="text-xs font-normal">
                              {question.question}
                            </Label>
                            <div className="print-answer-line mt-1"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
              
              {/* 印刷時の署名欄 */}
              <div className="print-signature-section mt-4 print:mt-2">
                <div className="text-xs text-gray-600">
                  <div className="mb-2">
                    <span>面談日時：____年____月____日 ____時____分</span>
                  </div>
                  <div className="mb-1">
                    <span>面談者署名：_________________________</span>
                  </div>
                  <div>
                    <span>対象者署名：_________________________</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // 通常モード：現在のセクションのみ表示
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle>
                  {session.manual.sections[session.currentSectionIndex].title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {session.manual.sections[session.currentSectionIndex].purpose}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  推奨時間: {session.manual.sections[session.currentSectionIndex].duration}分
                </p>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* 質問項目 */}
                {session.manual.sections[session.currentSectionIndex].questions.map((question, index) => (
                  <div key={question.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div className="flex-grow space-y-3">
                        <div>
                          <Label className="text-base font-medium">
                            {question.question}
                            {question.required && (
                              <span className="ml-2 text-xs text-red-500">*必須</span>
                            )}
                          </Label>
                        </div>
                        
                        {/* 質問の詳細情報 */}
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          <p className="font-medium mb-1">💡 質問のポイント</p>
                          <ul className="space-y-1">
                            {question.details.askingTips.map((tip, i) => (
                              <li key={i}>• {tip}</li>
                            ))}
                          </ul>
                        </div>

                      {/* 回答入力エリア */}
                      {isPrintMode ? (
                        // 印刷モード：手書き用の罫線
                        <div className="print-answer-line">___________________________________________</div>
                      ) : (
                        // デジタルモード：通常の入力フォーム
                        question.type === 'open' && (
                          <Textarea
                            placeholder="回答を入力してください..."
                            className="min-h-[100px]"
                            onChange={(e) => handleResponseSave(question.id, e.target.value)}
                          />
                        )
                      )}

                      {question.type === 'scale' && question.scale && (
                        isPrintMode ? (
                          // 印刷モード：チェックボックス式
                          <div className="print-scale-options">
                            {Array.from(
                              { length: question.scale.max - question.scale.min + 1 },
                              (_, i) => question.scale!.min + i
                            ).map(value => (
                              <div key={value} className="print-scale-item">
                                <span className="print-checkbox"></span>
                                <span className="text-xs">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // デジタルモード
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">{question.scale.labels?.[0] || question.scale.min}</span>
                              <span className="text-sm">{question.scale.labels?.[question.scale.labels.length - 1] || question.scale.max}</span>
                            </div>
                            <RadioGroup
                              onValueChange={(value) => handleResponseSave(question.id, value)}
                            >
                              <div className="flex justify-between">
                                {Array.from(
                                  { length: question.scale.max - question.scale.min + 1 },
                                  (_, i) => question.scale!.min + i
                                ).map(value => (
                                  <div key={value} className="flex flex-col items-center">
                                    <RadioGroupItem value={String(value)} id={`${question.id}-${value}`} />
                                    <Label htmlFor={`${question.id}-${value}`} className="text-xs mt-1">
                                      {value}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>
                        )
                      )}

                      {/* ハイブリッド型（5段階評価＋テキスト入力） */}
                      {question.type === 'hybrid' && question.hybridInput && (
                        <div className="space-y-4">
                          {/* 5段階評価 */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {question.hybridInput.scaleLabel}
                            </Label>
                            <RadioGroup
                              onValueChange={(value) => {
                                const current = session.responses.get(question.id) || {};
                                handleResponseSave(question.id, { ...current, scale: value });
                              }}
                            >
                              <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
                                {[1, 2, 3, 4, 5].map(value => (
                                  <div key={value} className="flex flex-col items-center">
                                    <RadioGroupItem 
                                      value={String(value)} 
                                      id={`${question.id}-scale-${value}`}
                                      className="h-5 w-5"
                                    />
                                    <Label 
                                      htmlFor={`${question.id}-scale-${value}`} 
                                      className="text-sm mt-1 cursor-pointer"
                                    >
                                      {value}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>
                          
                          {/* テキスト入力 */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {question.hybridInput.textLabel}
                              {question.hybridInput.requireText && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </Label>
                            <Textarea
                              placeholder={question.hybridInput.textPlaceholder}
                              className="min-h-[80px]"
                              onChange={(e) => {
                                const current = session.responses.get(question.id) || {};
                                handleResponseSave(question.id, { ...current, text: e.target.value });
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {question.type === 'checklist' && question.checklistItems && (
                        <div className="space-y-2">
                          {question.checklistItems.map(item => (
                            <div key={item.item} className="flex items-start gap-2">
                              <Checkbox
                                id={`${question.id}-${item.item}`}
                                onCheckedChange={(checked) => {
                                  const current = session.responses.get(question.id) || [];
                                  const updated = checked
                                    ? [...current, item.item]
                                    : current.filter((i: string) => i !== item.item);
                                  handleResponseSave(question.id, updated);
                                }}
                              />
                              <div>
                                <Label htmlFor={`${question.id}-${item.item}`} className="text-sm font-normal">
                                  {item.item}
                                </Label>
                                {item.description && (
                                  <p className="text-xs text-gray-500">{item.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 注意すべき回答 */}
                      {question.details.redFlags && question.details.redFlags.length > 0 && (
                        <Alert className="mt-3">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <p className="font-medium mb-1">注意すべき回答パターン</p>
                            <ul className="text-xs space-y-1">
                              {question.details.redFlags.map((flag, i) => (
                                <li key={i}>• {flag}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* セクション移動ボタン（印刷時は非表示） */}
              {!isPrintMode && (
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSession(prev => ({
                      ...prev,
                      currentSectionIndex: Math.max(0, prev.currentSectionIndex - 1)
                    }))}
                    disabled={session.currentSectionIndex === 0}
                  >
                    前のセクション
                  </Button>
                  <Button 
                    onClick={handleNextSection}
                    disabled={
                      session.manual.sections[session.currentSectionIndex].questions.some(q => {
                        const response = session.responses.get(q.id);
                        // 必須項目のチェック
                        if (q.required && !response) return true;
                        // ハイブリッド型でテキスト必須の場合
                        if (q.type === 'hybrid' && q.hybridInput?.requireText) {
                          return !response?.text || response.text.trim() === '';
                        }
                        return false;
                      })
                    }
                  >
                    {session.currentSectionIndex === session.manual.sections.length - 1
                      ? '面談を完了'
                      : '次のセクション'}
                  </Button>
                </div>
              )}

              {/* 印刷時の署名欄 */}
              {isPrintMode && session.currentSectionIndex === session.manual.sections.length - 1 && (
                <div className="print-signature-section mt-8">
                  <div className="text-xs text-gray-600">
                    <div className="mb-4">
                      <span>面談日時：</span>
                      <span className="print-signature-line"></span>
                      <span>年</span>
                      <span className="print-signature-line" style={{ width: '50px' }}></span>
                      <span>月</span>
                      <span className="print-signature-line" style={{ width: '50px' }}></span>
                      <span>日</span>
                      <span className="print-signature-line" style={{ width: '50px' }}></span>
                      <span>時</span>
                      <span className="print-signature-line" style={{ width: '50px' }}></span>
                      <span>分</span>
                    </div>
                    <div className="mb-2">
                      <span>面談者署名：</span>
                      <span className="print-signature-line" style={{ width: '200px' }}></span>
                    </div>
                    <div>
                      <span>対象者署名：</span>
                      <span className="print-signature-line" style={{ width: '200px' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 6: 完了 */}
      {currentStep === 'completed' && (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold">面談が完了しました</h3>
                <p className="text-gray-600">
                  {session.staffMember?.name}さんの面談記録を保存しました
                </p>
              </div>
              
              {/* 完了サマリー */}
              <div className="w-full max-w-md space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">実施日時:</span>
                  <span>{session.startTime?.toLocaleString('ja-JP')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">所要時間:</span>
                  <span>
                    {session.endTime && session.startTime
                      ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000)
                      : 0}分
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">回答項目数:</span>
                  <span>{session.responses.size}項目</span>
                </div>
                {session.includeMotivationDiagnosis && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">動機タイプ診断:</span>
                    <span className="text-green-600">完了</span>
                  </div>
                )}
              </div>

              {/* アクションボタン */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => window.location.href = '/interviews'}>
                  面談一覧に戻る
                </Button>
                <Button onClick={() => window.location.href = `/staff-cards/${session.staffMember?.id}`}>
                  職員カルテを確認
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 動機タイプ診断モーダル（初回のみ） */}
      {showMotivationDiagnosis && motivationQuestions.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                動機タイプ診断
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                {session.staffMember?.name}さんの動機タイプを診断します（初回のみ）
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {motivationQuestions.slice(0, 3).map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">
                    Q{index + 1}. {question.question}
                  </Label>
                  <RadioGroup
                    onValueChange={(value) => handleResponseSave(question.id, value)}
                  >
                    {question.options.map(option => (
                      <div key={option.value} className="flex items-start gap-2 p-3 border rounded-lg bg-white hover:bg-gray-50">
                        <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                        <Label htmlFor={option.value} className="cursor-pointer flex-grow">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => setShowMotivationDiagnosis(false)}
                  disabled={
                    motivationQuestions.slice(0, 3).some(q => !session.responses.has(q.id))
                  }
                >
                  診断を完了して次へ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}