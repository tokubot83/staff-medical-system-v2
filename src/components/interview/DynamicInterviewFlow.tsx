'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Printer,
  X,
  Eye,
  Download,
  ArrowRightLeft,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  UserX
} from 'lucide-react';
import styles from './DynamicInterviewFlow.module.css';
import { 
  StaffLevel,
  JobRole,
  FacilityType,
  InterviewDuration
} from '@/types/staff-common';
import ImprovedDigitalInterviewUIFixed from './ImprovedDigitalInterviewUIFixed';
import ImprovedMotivationDiagnosisModal from './ImprovedMotivationDiagnosisModal';
import { interviewTemplates } from '@/data/interview-question-bank';
import PrintPreview from '@/components/PrintPreview';
import { usePrintPreview } from '@/hooks/usePrintPreview';
import { InterviewSection, InterviewResponse, QuestionCategory } from '@/types/interview-question-master';
import { 
  MotivationTypeDiagnosisService,
  MotivationType,
  MotivationQuestion
} from '@/services/motivationTypeDiagnosisService';
import { InterviewFlowOrchestrationService } from '@/services/interviewFlowOrchestrationService';
import { StaffCardInterviewService } from '@/services/staffCardInterviewService';
import { 
  SpecialInterviewTemplateService,
  SpecialInterviewType,
  ReturnReason,
  IncidentLevel
} from '@/services/specialInterviewTemplates';
import { V6InterviewTemplateService } from '@/services/v6InterviewTemplateService';
// 面談バンクシステムのインポート
import { generateInterviewSheet, generateMotivationFollowUp, generateInterviewSummary } from '@/lib/interview-bank/services/generator';
import { generateV4InterviewSheet } from '@/lib/interview-bank/services/v4-generator';
import { generateSupportInterviewFromVoiceDrive, generateSupportInterview, SupportGenerationParams } from '@/lib/interview-bank/services/support-generator';
import { generateSpecialInterview, SpecialInterviewType as SpecialInterviewBankType, SpecialGenerationParams } from '@/lib/interview-bank/services/special-generator';
import { ExtendedInterviewParams, StaffProfile, PositionDetail } from '@/lib/interview-bank/types-extended';
import { UnifiedBankService, UnifiedInterviewParams } from '@/lib/interview-bank/services/unified-bank-service';
import { UnifiedInterviewGeneratorService, UnifiedInterviewParams as UnifiedGeneratorParams } from '@/lib/interview-bank/services/unified-generator-service';
import { InterviewManualGenerationService, ManualGenerationRequest } from '@/services/interviewManualGenerationServiceWrapper';
import DynamicInterviewSheet from '@/components/interview-bank/DynamicInterviewSheet';
import DynamicInterviewSheetPrint from '@/components/interview-bank/DynamicInterviewSheetPrint';

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
type FlowStep = 'staff-select' | 'interview-type' | 'special-type-select' | 'special-context' | 'support-request' | 'duration' | 'bank-mode-select' | 'generating' | 'conducting' | 'completed';

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
  useBankSystem?: boolean; // 定期面談バンクシステムを使用するか
  bankGeneratedSheet?: any; // バンクシステムで生成されたシート
  bankResponses?: Record<string, any>; // バンクシステムの回答データ
}

// デフォルトセクション生成ヘルパー関数
const generateDefaultSections = (manual: GeneratedInterviewManual): InterviewSection[] => {
  // 既存のマニュアルデータを改善版UI用のセクション形式に変換
  return manual.sections.map((section, index) => ({
    id: `section-${index}`,
    title: section.title,
    category: mapToQuestionCategory(section.title),
    description: section.purpose,
    estimatedMinutes: section.duration,
    questions: section.questions.map(q => q.id),
    sectionGuidance: {
      introduction: section.guidance.introduction,
      keyPoints: section.guidance.keyPoints,
      transitionPhrase: section.guidance.transitionPhrase
    }
  }));
};

// タイトルから質問カテゴリーへのマッピング
const mapToQuestionCategory = (title: string): QuestionCategory => {
  if (title.includes('適応') || title.includes('人間関係')) return 'adaptation';
  if (title.includes('技術') || title.includes('スキル')) return 'skills';
  if (title.includes('業務') || title.includes('成果')) return 'performance';
  if (title.includes('健康') || title.includes('ストレス')) return 'health';
  if (title.includes('成長') || title.includes('キャリア')) return 'growth';
  if (title.includes('満足') || title.includes('モチベーション')) return 'satisfaction';
  if (title.includes('コミュニケーション')) return 'communication';
  if (title.includes('リーダー') || title.includes('管理')) return 'leadership';
  if (title.includes('今後') || title.includes('将来')) return 'future';
  return 'performance'; // デフォルト
};

interface DynamicInterviewFlowProps {
  initialReservation?: any; // UnifiedInterviewReservation型
  onComplete?: () => void;
}

// 経験年数から経験カテゴリを判定する関数
const determineExperienceCategory = (years: number) => {
  if (years <= 1) return 'new';
  if (years <= 3) return 'general';
  if (years <= 10) return 'middle';
  return 'veteran';
};

export default function DynamicInterviewFlow({ initialReservation, onComplete }: DynamicInterviewFlowProps = {}) {
  const searchParams = useSearchParams();
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
  const [useImprovedUI, setUseImprovedUI] = useState(false); // 改善版UI使用フラグ
  const [showPrintView, setShowPrintView] = useState(false); // バンクシステム印刷ビューフラグ
  const { print, printElement, isPrinting } = usePrintPreview({
    title: '面談記録',
    paperSize: 'A4',
    orientation: 'portrait'
  });

  // スタッフデータの取得（実際にはAPIから）
  useEffect(() => {
    fetchStaffData();
  }, []);

  // propsから予約情報が渡された場合の処理
  useEffect(() => {
    if (initialReservation) {
      console.log('Processing initial reservation from props:', initialReservation);
      handleReservationData(initialReservation);
    }
  }, [initialReservation]);

  // URLパラメータの変化を監視してダッシュボードからの遷移を処理（後方互換性のため残す）
  useEffect(() => {
    // propsからの初期化が優先される
    if (initialReservation) return;
    
    const fromDashboard = searchParams.get('fromDashboard');
    
    console.log('DynamicInterviewFlow: Checking dashboard params');
    console.log('fromDashboard:', fromDashboard);
    console.log('SessionStorage keys:', Object.keys(sessionStorage));
    
    if (fromDashboard === 'true') {
      const reservationData = sessionStorage.getItem('interviewReservation');
      console.log('Reservation data from sessionStorage:', reservationData);
      
      if (reservationData) {
        try {
          const reservation = JSON.parse(reservationData);
          console.log('Parsed reservation:', reservation);
          handleReservationData(reservation);
          sessionStorage.removeItem('interviewReservation');
        } catch (error) {
          console.error('Failed to parse reservation data:', error);
        }
      } else {
        console.warn('No reservation data found in sessionStorage');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
      },
      {
        id: 'STAFF004',
        name: '佐藤花子',
        department: '医事課',
        position: '医事課職員',
        jobRole: 'medical-clerk',
        experienceYears: 3,
        experienceMonths: 36,
        facilityType: 'acute',
        lastInterviewDate: '2024-01-15',
        motivationType: 'stability'
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

  // 予約データから面談を開始
  const handleReservationData = (reservation: any) => {
    console.log('handleReservationData called with:', reservation);
    
    // 予約情報からスタッフ情報を設定
    const staffMember: StaffMember = {
      id: reservation.staffId,
      name: reservation.staffName,
      department: reservation.department,
      position: reservation.position,
      jobRole: determineJobRole(reservation.position),
      experienceYears: reservation.experienceYears,
      experienceMonths: reservation.experienceYears * 12,
      facilityType: 'acute' as FacilityType,
      lastInterviewDate: reservation.lastInterviewDate
    };
    
    // 面談タイプをマッピング（統合ダッシュボードのタイプから内部タイプへ）
    let mappedInterviewType = reservation.type;
    if (reservation.type === 'regular') {
      // 定期面談のサブタイプに応じてマッピング
      if (reservation.regularType === 'new_employee') {
        mappedInterviewType = 'new_employee_monthly';
      } else if (reservation.regularType === 'annual') {
        mappedInterviewType = 'regular_annual';
      } else if (reservation.regularType === 'management') {
        mappedInterviewType = 'management_biannual';
      }
    }
    
    setSession(prev => ({
      ...prev,
      staffMember,
      interviewType: mappedInterviewType,
      specialType: reservation.specialType,
      specialContext: reservation.specialContext,
      supportRequest: {
        category: reservation.supportCategory,
        topic: reservation.supportTopic,
        details: reservation.supportDetails,
        urgency: reservation.urgency
      }
      // useBankSystemは選択画面で決定させる（削除）
    }));
    
    // 面談タイプに応じて適切なステップに遷移
    if (reservation.type === 'regular') {
      // 定期面談はバンクモード選択へ（面談シート生成方式選択）
      setCurrentStep('bank-mode-select');
    } else if (reservation.type === 'special') {
      // 特別面談は時間選択へ（タイプは予約から取得済み）
      setCurrentStep('duration');
    } else if (reservation.type === 'support') {
      // サポート面談も時間選択へ（カテゴリは予約から取得済み）
      setCurrentStep('duration');
    }
  };
  
  const determineJobRole = (position: string): JobRole => {
    if (position.includes('看護師') && !position.includes('准看護師')) return 'nurse';
    if (position.includes('准看護師')) return 'assistant-nurse';
    if (position.includes('看護補助')) return 'nursing-aide';
    if (position.includes('介護')) return 'care-worker';
    if (position.includes('理学療法士') || position.includes('PT')) return 'pt';
    if (position.includes('作業療法士') || position.includes('OT')) return 'ot';
    if (position.includes('言語聴覚士') || position.includes('ST')) return 'st';
    if (position.includes('医事')) return 'medical-clerk';
    if (position.includes('栄養')) return 'nutritionist';
    if (position.includes('薬剤')) return 'pharmacist';
    if (position.includes('相談員') || position.includes('ソーシャル')) return 'social-worker';
    if (position.includes('総務')) return 'general-affairs';
    if (position.includes('施設')) return 'facility';
    return 'general-affairs'; // デフォルトを事務系に変更
  };

  // 面談種類選択
  const handleInterviewTypeSelect = (type: string) => {
    setSession(prev => ({
      ...prev,
      interviewType: type
    }));
    // 定期面談の場合はバンクモード選択へ
    if (type === 'regular_annual' || type === 'new_employee_monthly' || type === 'management_biannual') {
      setCurrentStep('bank-mode-select');
    } else {
      setCurrentStep('duration');
    }
  };

  // 時間選択
  const handleDurationSelect = (duration: InterviewDuration) => {
    setSession(prev => ({
      ...prev,
      duration
    }));
    
    // v6テンプレートの場合はスタッフ選択画面へ
    if (session.useV6Template && !session.staffMember) {
      setCurrentStep('staff-selection');
    } else {
      generateManual();
    }
  };

  // マニュアル生成
  const generateManual = async () => {
    console.log('generateManual called with session:', {
      interviewType: session.interviewType,
      specialType: session.specialType,
      useBankSystem: session.useBankSystem,
      staffMember: session.staffMember
    });
    
    setCurrentStep('generating');
    setIsGenerating(true);
    
    try {
      let manual: GeneratedInterviewManual | null = null;
      
      // バンクシステムを使用する場合（全ての面談タイプで使用）
      if (session.useBankSystem) {
        console.log('Using bank system for interview type:', session.interviewType);
        
        // デバッグ: 元データを確認
        console.log('=== DEBUG: Staff Member Raw Data ===', {
          name: session.staffMember!.name,
          department: session.staffMember!.department,
          position: session.staffMember!.position,
          jobRole: session.staffMember!.jobRole,
          facilityType: session.staffMember!.facilityType
        });
        
        // デバッグ: マッピング後の値を確認
        const mappedProfession = mapJobRoleToProfession(session.staffMember!.jobRole);
        console.log('=== DEBUG: Mapped Profession ===', {
          original: session.staffMember!.jobRole,
          mapped: mappedProfession
        });
        
        // スタッフプロファイルを作成
        const staffProfile: StaffProfile = {
          id: session.staffMember!.id,
          name: session.staffMember!.name,
          employeeNumber: session.staffMember!.id,
          hireDate: new Date(Date.now() - (session.staffMember!.experienceYears * 365 + session.staffMember!.experienceMonths * 30) * 24 * 60 * 60 * 1000),
          experienceLevel: determineExperienceLevel(session.staffMember!.experienceYears, session.staffMember!.position),
          experienceYears: session.staffMember!.experienceYears,
          experienceMonths: session.staffMember!.experienceMonths,
          position: {
            id: mapToPositionId(session.staffMember!.position),
            name: session.staffMember!.position,
            category: mapToProfessionCategory(session.staffMember!.jobRole),
            level: mapToPositionLevel(session.staffMember!.position),
            hierarchyLevel: mapToHierarchyLevel(session.staffMember!.position)
          },
          positionLevel: mapToPositionLevel(session.staffMember!.position),
          facility: session.staffMember!.facilityType,
          department: mapToDepartmentType(session.staffMember!.department),
          profession: mappedProfession,  // デバッグ済みの値を使用
          licenses: extractLicenses(session.staffMember!.jobRole)
        };
        
        // 統一バンクサービスを使用して適切な面談シートを生成
        let generatedSheet: any;
        const unifiedService = UnifiedBankService.getInstance();
        
        if (session.interviewType === 'regular_annual' || 
            session.interviewType === 'new_employee_monthly' || 
            session.interviewType === 'management_biannual') {
          // 定期面談
          const params: ExtendedInterviewParams = {
            staff: staffProfile,
            interviewDate: new Date(),
            duration: session.duration,
            interviewerId: 'INT001',
            interviewerName: '面談担当者',
            includePositionQuestions: true,
            includeFacilityQuestions: true
          };
          
          // デバッグ：職種情報を確認
          console.log('[DynamicInterviewFlow] Calling generateV4InterviewSheet with:', {
            profession: staffProfile.profession,
            experienceLevel: staffProfile.experienceLevel,
            facilityType: staffProfile.facilityType,
            name: staffProfile.name
          });
          
          generatedSheet = generateV4InterviewSheet(params);
          
          // デバッグ：生成された質問を確認
          if (generatedSheet && generatedSheet.sections) {
            console.log('[DynamicInterviewFlow] Generated sections:', generatedSheet.sections.length);
            generatedSheet.sections.forEach((section: any, sIdx: number) => {
              console.log(`[DynamicInterviewFlow] Section ${sIdx + 1}: ${section.name}`);
              if (section.questions && section.questions.length > 0) {
                console.log(`  Questions: ${section.questions.length}`);
                console.log(`  First question: ${section.questions[0].content?.substring(0, 50)}...`);
                if (section.questions[0].tags) {
                  console.log(`  Tags: ${section.questions[0].tags?.slice(0, 3).join(', ')}`);
                }
              }
            });
          }
          
        } else if (session.interviewType === 'special') {
          // 特別面談
          const specialParams: SpecialGenerationParams = {
            interviewType: 'special' as const,
            specialType: session.specialType as SpecialInterviewBankType,
            subType: session.specialContext?.subType,
            reason: session.specialContext?.reason,
            confidentialLevel: session.specialContext?.confidentialLevel || 'normal' as const,
            duration: session.duration,
            interviewDate: new Date()
          };
          // StaffBankProfileを作成
          const staffBankProfile = {
            id: session.staffMember!.id,
            name: session.staffMember!.name,
            department: session.staffMember!.department,
            position: session.staffMember!.position,
            experienceLevel: determineExperienceLevel(session.staffMember!.experienceYears, session.staffMember!.position),
            experienceYears: session.staffMember!.experienceYears,
            experienceMonths: session.staffMember!.experienceMonths,
            facility: '医療施設',
            facilityType: session.staffMember!.facilityType as any,
            hireDate: new Date(Date.now() - (session.staffMember!.experienceYears * 365 + session.staffMember!.experienceMonths * 30) * 24 * 60 * 60 * 1000),
            lastInterviewDate: session.staffMember!.lastInterviewDate ? new Date(session.staffMember!.lastInterviewDate) : null,
            nextScheduledDate: null,
            interviewCount: 0
          };
          try {
            const bankSheet = generateSpecialInterview(specialParams, staffBankProfile);
            console.log('Special interview sheet generated successfully');
            
            // BankSection を InterviewSectionInstance に変換
            generatedSheet = {
              ...bankSheet,
              sections: bankSheet.sections.map((section: any, index: number) => ({
                sectionId: section.id,
                name: section.title,
                type: 'general', // デフォルトタイプ
                questions: section.questions.map((q: any) => ({
                  questionId: q.id,
                  content: q.questionText,
                  type: q.questionType === 'single_choice' ? 'radio' : 
                        q.questionType === 'multiple_choice' ? 'checkbox' :
                        q.questionType === 'date' ? 'text' :
                        q.questionType === 'information' ? 'text' :
                        q.questionType || 'textarea',
                  required: q.priority === 1,
                  options: q.options ? q.options.map((opt: string) => ({ value: opt, label: opt })) : undefined,
                  placeholder: q.placeholder
                })),
                order: section.order || index
              }))
            };
          } catch (error) {
            console.error('Error generating special interview:', error);
            throw error;
          }
          
        } else if (session.interviewType === 'support') {
          // サポート面談
          const supportParams: SupportGenerationParams = {
            interviewType: 'support' as const,
            category: session.supportRequest?.category || 'other',
            urgency: session.supportRequest?.urgency || 'medium' as const,
            consultationTopic: session.supportRequest?.topic || '',
            consultationDetails: session.supportRequest?.details || '',
            duration: session.duration,
            interviewDate: new Date()
          };
          // StaffBankProfileを作成
          const staffBankProfile = {
            id: session.staffMember!.id,
            name: session.staffMember!.name,
            department: session.staffMember!.department,
            position: session.staffMember!.position,
            experienceLevel: determineExperienceLevel(session.staffMember!.experienceYears, session.staffMember!.position),
            experienceYears: session.staffMember!.experienceYears,
            experienceMonths: session.staffMember!.experienceMonths,
            facility: '医療施設',
            facilityType: session.staffMember!.facilityType as any,
            hireDate: new Date(Date.now() - (session.staffMember!.experienceYears * 365 + session.staffMember!.experienceMonths * 30) * 24 * 60 * 60 * 1000),
            lastInterviewDate: session.staffMember!.lastInterviewDate ? new Date(session.staffMember!.lastInterviewDate) : null,
            nextScheduledDate: null,
            interviewCount: 0
          };
          try {
            const bankSheet = generateSupportInterview(supportParams, staffBankProfile);
            console.log('Support interview sheet generated successfully');
            
            // BankSection を InterviewSectionInstance に変換
            generatedSheet = {
              ...bankSheet,
              sections: bankSheet.sections.map((section: any, index: number) => ({
                sectionId: section.id,
                name: section.title,
                type: 'general', // デフォルトタイプ
                questions: section.questions.map((q: any) => ({
                  questionId: q.id,
                  content: q.questionText,
                  type: q.questionType === 'single_choice' ? 'radio' : 
                        q.questionType === 'multiple_choice' ? 'checkbox' :
                        q.questionType === 'date' ? 'text' :
                        q.questionType === 'information' ? 'text' :
                        q.questionType || 'textarea',
                  required: q.priority === 1,
                  options: q.options ? q.options.map((opt: string) => ({ value: opt, label: opt })) : undefined,
                  placeholder: q.placeholder
                })),
                order: section.order || index
              }))
            };
          } catch (error) {
            console.error('Error generating support interview:', error);
            throw error;
          }
        } else {
          // デフォルトは定期面談
          const params: ExtendedInterviewParams = {
            staff: staffProfile,
            interviewDate: new Date(),
            duration: session.duration,
            interviewerId: 'INT001',
            interviewerName: '面談担当者',
            includePositionQuestions: true,
            includeFacilityQuestions: true
          };
          generatedSheet = generateV4InterviewSheet(params);
        }
        
        // 動機タイプ診断が必要な場合は追加質問を生成
        if (session.includeMotivationDiagnosis) {
          const motivationFollowUp = generateMotivationFollowUp(
            'growth', // デフォルト、後で診断結果に基づいて更新
            staffProfile.experienceLevel,
            session.duration
          );
          // 動機タイプ診断セクションに追加
          const motivationSection = generatedSheet.sections.find(s => s.type === 'motivation_assessment');
          if (motivationSection) {
            motivationSection.questions.push(...motivationFollowUp);
          }
        }
        
        // 生成されたシートにparamsが含まれていることを確認
        if (!generatedSheet.params) {
          generatedSheet.params = {
            interviewDate: new Date(),
            duration: session.duration
          };
        }
        
        // バンクシステムのデータをセッションに保存
        setSession(prev => ({
          ...prev,
          bankGeneratedSheet: generatedSheet,
          bankResponses: {},
          startTime: new Date()
        }));
        
        setTimeout(() => {
          setIsGenerating(false);
          setCurrentStep('conducting');
        }, 2000);
        
        return; // バンクシステムの場合はここで終了
      }
      
      // v6テンプレートを使用する場合
      if (session.useV6Template) {
        console.log('Using v6 template system');
        console.log('Current session state:', {
          staffMember: session.staffMember,
          duration: session.duration,
          interviewType: session.interviewType
        });
        
        // スタッフメンバーが設定されていない場合はエラー
        if (!session.staffMember) {
          throw new Error('スタッフメンバーが選択されていません。スタッフを選択してから再度お試しください。');
        }
        
        let v6Template;
        try {
          v6Template = V6InterviewTemplateService.getTemplate({
            staffName: session.staffMember!.name,
            department: session.staffMember!.department,
            position: session.staffMember!.position,
            experienceYears: session.staffMember!.experienceYears,
            experienceMonths: session.staffMember!.experienceMonths,
            interviewType: session.interviewType,
            duration: session.duration,
            includeMotivationDiagnosis: session.staffMember!.experienceYears <= 1
          });
        } catch (templateError) {
          console.error('V6 template generation error:', templateError);
          throw new Error(`v6テンプレート取得エラー: ${templateError instanceof Error ? templateError.message : String(templateError)}`);
        }
        
        // v6テンプレートをマニュアル形式に変換
        manual = {
          id: `v6_${Date.now()}`,
          title: v6Template.title,
          generatedAt: new Date(),
          estimatedDuration: v6Template.totalDuration,
          staffInfo: {
            level: determineStaffLevel(session.staffMember!.experienceMonths),
            jobRole: session.staffMember!.jobRole,
            facility: session.staffMember!.facilityType,
            levelDescription: ''
          },
          overview: {
            purpose: v6Template.description,
            objectives: ['統一された評価基準', '経験年数別の最適化', '動機タイプの把握'],
            keyPoints: v6Template.sections.map(s => s.title),
            preparationItems: ['面談シート準備', '前回記録確認', '静かな環境確保']
          },
          sections: v6Template.sections.map(section => ({
            id: section.id,
            title: section.title,
            duration: section.timeAllocation,
            questions: section.questions.map(q => ({
              id: q.id,
              question: q.content,
              type: q.type === 'motivation' ? 'choice' : q.type,
              required: q.required,
              scale: q.scaleMin && q.scaleMax ? {
                min: q.scaleMin,
                max: q.scaleMax,
                labels: q.scaleLabels
              } : undefined,
              options: q.motivationOptions?.map(opt => opt.label) || q.choices
            }))
          })),
          timeAllocation: v6Template.sections.map(s => ({
            section: s.title,
            minutes: s.timeAllocation,
            percentage: Math.round((s.timeAllocation / v6Template.totalDuration) * 100)
          })),
          guidelines: {
            dos: ['リラックスした雰囲気作り', '傾聴の姿勢', '適切なフィードバック'],
            donts: ['評価的な態度', '時間の圧迫', 'プライバシー侵害'],
            tips: ['v6統一基準に従う', '動機タイプを考慮']
          }
        };
        
        setSession(prev => ({
          ...prev,
          manual,
          startTime: new Date()
        }));
        
        setTimeout(() => {
          setIsGenerating(false);
          setCurrentStep('conducting');
        }, 2000);
        
        return; // v6テンプレートの場合はここで終了
      }
      
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
        // 統合サービスを使用して面談シートを生成
        const unifiedParams: UnifiedGeneratorParams = {
          interviewType: session.interviewType as any,
          subType: session.specialType,
          duration: session.duration,
          
          staffProfile: {
            staffId: session.staffMember!.id,
            staffName: session.staffMember!.name,
            profession: session.staffMember!.jobRole,
            experienceLevel: determineExperienceLevel(
              Math.floor(session.staffMember!.experienceMonths / 12),
              session.staffMember!.position
            ),
            facility: session.staffMember!.facilityType,
            department: session.staffMember!.department,
            position: session.staffMember!.position,
            yearsOfService: Math.floor(session.staffMember!.experienceMonths / 12),
            yearsOfExperience: session.staffMember!.experienceYears,
            hasManagementExperience: session.staffMember!.position?.includes('主任') || 
                                    session.staffMember!.position?.includes('師長')
          },
          
          reservation: {
            id: `res_${Date.now()}`,
            type: session.interviewType,
            category: session.supportRequest?.category,
            subCategory: session.supportRequest?.subCategory,
            duration: session.duration,
            scheduledDate: new Date(),
            
            // サポート面談用
            consultationDetails: session.supportRequest?.consultationDetails,
            consultationTopic: session.supportRequest?.consultationTopic,
            urgency: session.supportRequest?.urgency,
            
            // 特別面談用
            specialType: session.specialType,
            exitReason: session.specialContext?.exitReason,
            returnReason: session.specialContext?.returnReason,
            incidentLevel: session.specialContext?.incidentLevel,
            hasHandoverPlan: session.specialContext?.hasHandoverPlan,
            needsAccommodation: session.specialContext?.needsAccommodation,
            medicalClearance: session.specialContext?.medicalClearance
          }
        };
        
        // 統合サービスで生成
        const generatedSheet = await UnifiedInterviewGeneratorService.generate(unifiedParams);
        
        // 生成されたシートをマニュアル形式に変換
        manual = {
          id: generatedSheet.id,
          title: generatedSheet.title,
          generatedAt: generatedSheet.generatedAt,
          estimatedDuration: generatedSheet.duration,
          staffInfo: {
            level: determineStaffLevel(session.staffMember!.experienceMonths),
            jobRole: session.staffMember!.jobRole,
            facility: session.staffMember!.facilityType,
            levelDescription: ''
          },
          overview: {
            purpose: '面談の目的',
            objectives: ['目標1', '目標2', '目標3'],
            keyPoints: ['ポイント1', 'ポイント2', 'ポイント3'],
            preparationItems: ['準備1', '準備2', '準備3']
          },
          sections: generatedSheet.sections.map(section => ({
            id: section.id,
            title: section.title,
            duration: section.duration,
            purpose: section.description || '',
            questions: section.questions.map(q => ({
              id: q.id,
              question: q.text || q.question || '',
              type: q.type || 'open',
              required: q.isRequired || false,
              details: {
                purpose: q.category || '',
                askingTips: q.tags || [],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              },
              scale: q.scaleLabel ? {
                min: 1,
                max: 5,
                labels: [],
                description: q.scaleLabel
              } : undefined,
              hybridInput: q.type === 'hybrid' ? {
                scaleLabel: q.scaleLabel || '',
                textLabel: q.textLabel || '',
                textPlaceholder: q.textPlaceholder || '',
                requireText: false
              } : undefined
            })),
            guidance: {
              introduction: '',
              keyPoints: [],
              transitionPhrase: ''
            }
          })),
          timeAllocation: generatedSheet.sections.map(s => ({
            section: s.title,
            minutes: s.duration,
            percentage: Math.round((s.duration / generatedSheet.duration) * 100)
          })),
          guidelines: {
            dos: ['傾聴の姿勢', '共感的対応', '具体例を引き出す'],
            donts: ['批判的態度', '時間超過', 'プライバシー侵害'],
            tips: ['面談タイプに応じた対応', '職員の状況に配慮']
          }
        };
      }
      
      if (manual) {
        setSession(prev => ({
          ...prev,
          manual,
          startTime: new Date()
        }));
        
        setTimeout(() => {
          setIsGenerating(false);
          setCurrentStep('conducting');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Manual generation failed:', error);
      setIsGenerating(false);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`面談シート生成に失敗しました:\n${errorMessage}\n\n詳細はブラウザのコンソールをご確認ください。`);
      setCurrentStep('interview-type'); // エラー時は面談タイプ選択に戻る
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
  
  // バンクシステム用の経験レベル判定（役職も考慮）
  const determineExperienceLevel = (years: number, position?: string): 'new' | 'junior' | 'midlevel' | 'senior' | 'veteran' | 'supervisor' | 'manager' => {
    // 役職から判定（最優先）
    if (position) {
      if (position.includes('師長') || position.includes('部長') || position.includes('課長')) {
        return 'manager';
      }
      if (position.includes('主任') || position.includes('係長') || position.includes('副師長')) {
        return 'supervisor';
      }
      if (position.includes('リーダー')) {
        return 'senior';
      }
    }
    
    // 経験年数から判定
    if (years <= 1) return 'new';
    if (years <= 3) return 'junior';
    if (years <= 7) return 'midlevel';
    if (years <= 10) return 'senior';
    return 'veteran';
  };
  
  // 役職をポジションIDにマッピング
  const mapToPositionId = (position: string): string => {
    const positionMap: Record<string, string> = {
      '看護師': 'ward_nurse',
      '主任看護師': 'ward_chief_nurse',
      '病棟師長': 'ward_manager',
      '外来師長': 'op_manager',
      '看護補助者': 'na_staff',
      'リーダー看護補助者': 'na_leader',
      '准看護師': 'lpn_staff',
      '医事課職員': 'ma_staff',
      '医事課課長': 'ma_manager'
    };
    return positionMap[position] || 'staff';
  };
  
  // 職種をプロフェッションカテゴリーにマッピング
  const mapToProfessionCategory = (jobRole: string): 'nursing' | 'medical_affairs' | 'rehabilitation' | 'administration' => {
    if (jobRole.includes('看護')) return 'nursing';
    if (jobRole.includes('医事')) return 'medical_affairs';
    if (jobRole.includes('リハビリ') || jobRole === 'PT' || jobRole === 'OT' || jobRole === 'ST') return 'rehabilitation';
    return 'administration';
  };
  
  // 役職をポジションレベルにマッピング
  const mapToPositionLevel = (position: string): 'staff' | 'leader' | 'chief' | 'assistant_manager' | 'manager' | 'director' => {
    if (position.includes('師長')) return 'manager';
    if (position.includes('課長')) return 'manager';
    if (position.includes('主任')) return 'chief';
    if (position.includes('リーダー')) return 'leader';
    return 'staff';
  };
  
  // 役職を階層レベルにマッピング
  const mapToHierarchyLevel = (position: string): number => {
    if (position.includes('師長') || position.includes('課長')) return 6;
    if (position.includes('主任')) return 4;
    if (position.includes('リーダー')) return 3;
    if (position.includes('シニア')) return 2;
    return 1;
  };
  
  // 部署をデパートメントタイプにマッピング
  const mapToDepartmentType = (department: string): 'ward' | 'outpatient' | 'emergency' | 'icu' | 'operating_room' | 'rehabilitation' | 'administration' => {
    if (department.includes('病棟')) return 'ward';
    if (department.includes('外来')) return 'outpatient';
    if (department.includes('救急')) return 'emergency';
    if (department.includes('ICU')) return 'icu';
    if (department.includes('手術')) return 'operating_room';
    if (department.includes('リハビリ')) return 'rehabilitation';
    return 'administration';
  };
  
  // 職種から資格を抽出
  const extractLicenses = (jobRole: string): string[] => {
    const licenses: string[] = [];
    if (jobRole.includes('看護師') && !jobRole.includes('准')) licenses.push('看護師');
    if (jobRole.includes('准看護師')) licenses.push('准看護師');
    if (jobRole === 'pt' || jobRole === 'PT' || jobRole === 'therapist-pt') licenses.push('理学療法士');
    if (jobRole === 'ot' || jobRole === 'OT' || jobRole === 'therapist-ot') licenses.push('作業療法士');
    if (jobRole === 'st' || jobRole === 'ST' || jobRole === 'therapist-st') licenses.push('言語聴覚士');
    if (jobRole === 'medical-clerk' || jobRole.includes('医事')) licenses.push('医療事務');
    return licenses;
  };
  
  // jobRoleを正しいProfessionTypeにマッピング
  const mapJobRoleToProfession = (jobRole: string): ProfessionType => {
    const mapping: Record<string, ProfessionType> = {
      'nurse': 'nurse',
      'assistant-nurse': 'assistant-nurse',
      'nursing-aide': 'care-worker',
      'care-worker': 'care-worker',
      'pt': 'therapist-pt',
      'PT': 'therapist-pt',
      'ot': 'therapist-ot',
      'OT': 'therapist-ot',
      'st': 'therapist-st',
      'ST': 'therapist-st',
      'medical-clerk': 'medical-clerk',
      'nutritionist': 'nutritionist',
      'pharmacist': 'pharmacist',
      'social-worker': 'social-worker',
      'counselor': 'counselor',
      'general-affairs': 'general-affairs',
      'facility': 'facility',
      'care-manager': 'care-manager'
    };
    
    // デフォルトは医事課職員または総務として扱う
    if (jobRole.includes('医事')) return 'medical-clerk';
    if (jobRole.includes('総務')) return 'general-affairs';
    if (jobRole.includes('栄養')) return 'nutritionist';
    if (jobRole.includes('薬剤')) return 'pharmacist';
    if (jobRole.includes('相談')) return 'social-worker';
    if (jobRole.includes('カウンセ')) return 'counselor';
    if (jobRole.includes('施設')) return 'facility';
    if (jobRole.includes('ケアマネ')) return 'care-manager';
    
    return mapping[jobRole] || 'general-affairs';
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
    
    // 職員カルテへのリアルタイム同期
    try {
      const completedInterviewData = {
        id: sessionMaster.id,
        staffId: session.selectedStaff.id,
        staffName: session.selectedStaff.name,
        type: session.interviewType,
        subtype: session.subType,
        date: session.startTime?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        duration: session.duration,
        responses: Array.from(session.responses.entries()).map(([questionId, response]) => ({
          questionId,
          response
        })),
        summary: sessionMaster.summary,
        feedback: sessionMaster.feedback,
        nextActions: sessionMaster.nextActions || [],
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
        interviewer: session.selectedStaff.department // 面談者情報を追加
      };

      // 職員カルテの面談タブに自動反映
      await StaffCardInterviewService.handleInterviewCompletion(completedInterviewData);
      
      console.log('職員カルテへの同期完了:', completedInterviewData);
    } catch (error) {
      console.error('職員カルテ同期エラー:', error);
      // エラーが発生しても面談完了は継続
    }
    
    setCurrentStep('completed');
    // 完了時のコールバックを呼び出し
    if (onComplete) {
      onComplete();
    }
  };

  // プログレスバーの計算
  const calculateProgress = () => {
    const steps = ['staff-select', 'interview-type', 'duration', 'generating', 'conducting', 'completed'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div style={{ margin: '-20px' }} className={`space-y-6 ${isPrintMode ? 'print-preview-mode' : ''}`}>
      {/* プログレスバー */}
      <div className="mb-8 px-6">
        <div className="relative">
          <Progress value={calculateProgress()} className="h-3" />
          <div className="absolute top-0 right-0 text-xs text-gray-500">
            {Math.round(calculateProgress())}%
          </div>
        </div>
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
                    interviewType: 'special',
                    useBankSystem: true // バンクシステムを使用
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
                      <li>• 退職面談</li>
                      <li>• 異動面談</li>
                      <li>• 復職面談</li>
                      <li>• 昇進面談</li>
                    </ul>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">バンク対応</span>
                  </div>
                </CardContent>
              </Card>

              {/* サポート面談 */}
              <Card 
                className="cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => {
                  setSession(prev => ({
                    ...prev,
                    interviewType: 'support',
                    useBankSystem: true // バンクシステムを使用
                  }));
                  setCurrentStep('support-request');
                }}
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
                      <li>• 人間関係</li>
                      <li>• ワークライフ</li>
                    </ul>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">バンク対応</span>
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

      {/* Step 2.5: サポート面談の詳細入力 */}
      {currentStep === 'support-request' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              サポート面談の詳細
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {session.staffMember?.name}さんの相談内容を入力してください
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>相談カテゴリ</Label>
              <RadioGroup 
                defaultValue="career"
                onValueChange={(value) => {
                  setSession(prev => ({
                    ...prev,
                    supportRequest: { ...prev.supportRequest, category: value }
                  }));
                }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="career" id="career" />
                    <Label htmlFor="career">キャリア相談</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="workplace" id="workplace" />
                    <Label htmlFor="workplace">職場環境</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="relationships" id="relationships" />
                    <Label htmlFor="relationships">人間関係</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="worklife" id="worklife" />
                    <Label htmlFor="worklife">ワークライフ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="health" id="health" />
                    <Label htmlFor="health">健康・メンタル</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="skills" id="skills" />
                    <Label htmlFor="skills">スキル・研修</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>相談のタイトル</Label>
              <Input
                placeholder="相談内容を簡潔に..."
                onChange={(e) => {
                  setSession(prev => ({
                    ...prev,
                    supportRequest: { ...prev.supportRequest, topic: e.target.value }
                  }));
                }}
              />
            </div>
            
            <div>
              <Label>相談内容の詳細</Label>
              <Textarea
                placeholder="具体的な相談内容を入力してください..."
                rows={4}
                onChange={(e) => {
                  setSession(prev => ({
                    ...prev,
                    supportRequest: { ...prev.supportRequest, details: e.target.value }
                  }));
                }}
              />
            </div>
            
            <div>
              <Label>緊急度</Label>
              <RadioGroup 
                defaultValue="medium"
                onValueChange={(value) => {
                  setSession(prev => ({
                    ...prev,
                    supportRequest: { ...prev.supportRequest, urgency: value }
                  }));
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">低</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">中</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">高</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent">緊急</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button onClick={() => setCurrentStep('duration')} className="w-full">
              次へ進む
            </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 退職面談 */}
              <Card 
                className="cursor-pointer hover:border-red-500 transition-colors"
                onClick={() => {
                  setSession(prev => ({
                    ...prev,
                    specialType: 'exit',
                    specialContext: { subType: 'voluntary', reason: '退職' }
                  }));
                  setCurrentStep('duration');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <User className="h-10 w-10 text-red-500" />
                    <h3 className="font-semibold">退職面談</h3>
                    <p className="text-sm text-gray-600">
                      退職予定者との面談
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 退職理由確認</li>
                      <li>• 引き継ぎ</li>
                      <li>• 組織改善</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 異動面談 */}
              <Card 
                className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => {
                  setSession(prev => ({
                    ...prev,
                    specialType: 'transfer',
                    specialContext: { reason: '部署異動' }
                  }));
                  setCurrentStep('duration');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <ArrowRightLeft className="h-10 w-10 text-blue-500" />
                    <h3 className="font-semibold">異動面談</h3>
                    <p className="text-sm text-gray-600">
                      部署異動の説明と準備
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 異動理由説明</li>
                      <li>• 新部署紹介</li>
                      <li>• 不安解消</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 復職面談 */}
              <Card 
                className="cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => {
                  setSession(prev => ({
                    ...prev,
                    specialType: 'return',
                    specialContext: { reason: '休職からの復帰' }
                  }));
                  setCurrentStep('duration');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <UserCheck className="h-10 w-10 text-green-500" />
                    <h3 className="font-semibold">復職面談</h3>
                    <p className="text-sm text-gray-600">
                      休職からの復帰支援
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 健康状態確認</li>
                      <li>• 段階的復職</li>
                      <li>• サポート体制</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 昇進面談 */}
              <Card 
                className="cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => {
                  setSession(prev => ({
                    ...prev,
                    specialType: 'promotion',
                    specialContext: { subType: 'general', reason: '昇進' }
                  }));
                  setCurrentStep('duration');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <TrendingUp className="h-10 w-10 text-purple-500" />
                    <h3 className="font-semibold">昇進面談</h3>
                    <p className="text-sm text-gray-600">
                      昇進に関する説明と準備
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 新役職説明</li>
                      <li>• 責任と期待</li>
                      <li>• サポート</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 懲戒面談 */}
              <Card 
                className="cursor-pointer hover:border-orange-500 transition-colors"
                onClick={() => {
                  setSession(prev => ({
                    ...prev,
                    specialType: 'disciplinary',
                    specialContext: { confidentialLevel: 'high', reason: '指導' }
                  }));
                  setCurrentStep('duration');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <AlertTriangle className="h-10 w-10 text-orange-500" />
                    <h3 className="font-semibold">懲戒面談</h3>
                    <p className="text-sm text-gray-600">
                      規律違反への対応
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 事実確認</li>
                      <li>• 改善指導</li>
                      <li>• 再発防止</li>
                    </ul>
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

      {/* Step 2.7: 定期面談バンクモード選択 */}
      {currentStep === 'bank-mode-select' && (session.interviewType === 'regular_annual' || session.interviewType === 'new_employee_monthly' || session.interviewType === 'management_biannual') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              面談シート生成方式を選択
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {session.staffMember?.name}さんの面談シートをどのように準備しますか？
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 定期面談バンクシステム（推奨） */}
              <Card 
                className="cursor-pointer hover:border-blue-500 transition-colors border-2"
                onClick={() => {
                  setSession(prev => ({ ...prev, useBankSystem: true }));
                  setCurrentStep('duration');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-8 w-8 text-blue-500" />
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">推奨</span>
                    </div>
                    <h3 className="font-semibold text-lg">定期面談バンク（AI最適化）</h3>
                    <p className="text-sm text-gray-600">
                      職員のプロファイルに基づいて最適な質問を自動選択
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>✓ 経験年数・役職に応じた質問</li>
                      <li>✓ 施設・部署特有の質問を含む</li>
                      <li>✓ 動機タイプに基づくフォローアップ</li>
                      <li>✓ 時間に応じた質問数の最適化</li>
                    </ul>
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                      <strong>適している場合:</strong>
                      <br />効率的で個別最適化された面談を実施したい
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 従来のテンプレート方式（v6統一版） */}
              <Card 
                className="cursor-pointer hover:border-gray-500 transition-colors"
                onClick={() => {
                  // v6テンプレートを使用
                  setSession(prev => ({ 
                    ...prev, 
                    useBankSystem: false,  // バンクシステムは使用しない
                    useV6Template: true    // v6テンプレートを使用
                  }));
                  // 時間選択画面へ移動（従来通りの手順）
                  setCurrentStep('duration');
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-8 w-8 text-gray-500" />
                      <Badge variant="secondary" className="text-xs">v6</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">従来のテンプレート</h3>
                    <p className="text-sm text-gray-600">
                      v6統一版の面談シートを使用
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• 統一された経験年数分類</li>
                      <li>• 職種・経験年数別の最適化</li>
                      <li>• 新人は動機タイプ診断付き</li>
                      <li>• 印刷対応フォーマット</li>
                    </ul>
                    <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                      <span className="text-green-600">✓ 利用可能</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                定期面談バンクシステムは、{session.staffMember?.experienceYears}年{session.staffMember?.experienceMonths % 12}ヶ月の経験と
                {session.staffMember?.position}の役職を考慮して、最適な質問を選択します。
              </AlertDescription>
            </Alert>
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

      {/* Step 5: 面談実施 - バンクシステム */}
      {currentStep === 'conducting' && session.useBankSystem && session.bankGeneratedSheet && (
        <div className="space-y-6">
          {/* モード切り替えボタン */}
          <div className="flex justify-end gap-2 print:hidden">
            <Button
              variant={!showPrintView ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPrintView(false)}
            >
              <FileText className="h-4 w-4 mr-1" />
              デジタル入力
            </Button>
            <Button
              variant={showPrintView ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPrintView(true)}
            >
              <Printer className="h-4 w-4 mr-1" />
              印刷プレビュー
            </Button>
          </div>
        </div>
      )}

      {/* バンクシステムの面談シート - フル幅表示 */}
      {currentStep === 'conducting' && session.useBankSystem && session.bankGeneratedSheet && !showPrintView && (
        <DynamicInterviewSheet
              sheetData={session.bankGeneratedSheet}
              staffProfile={{
                id: session.staffMember!.id,
                name: session.staffMember!.name,
                employeeNumber: session.staffMember!.id,
                hireDate: new Date(Date.now() - (session.staffMember!.experienceYears * 365 + session.staffMember!.experienceMonths * 30) * 24 * 60 * 60 * 1000),
                experienceLevel: determineExperienceLevel(session.staffMember!.experienceYears),
                experienceYears: session.staffMember!.experienceYears,
                experienceMonths: session.staffMember!.experienceMonths,
                position: {
                  id: mapToPositionId(session.staffMember!.position),
                  name: session.staffMember!.position,
                  category: mapToProfessionCategory(session.staffMember!.jobRole),
                  level: mapToPositionLevel(session.staffMember!.position),
                  hierarchyLevel: mapToHierarchyLevel(session.staffMember!.position)
                },
                positionLevel: mapToPositionLevel(session.staffMember!.position),
                facility: session.staffMember!.facilityType,
                department: mapToDepartmentType(session.staffMember!.department),
                profession: session.staffMember!.jobRole,
                licenses: extractLicenses(session.staffMember!.jobRole)
              }}
              currentInterviewType={session.interviewType}
              onSave={(data) => {
                setSession(prev => ({
                  ...prev,
                  bankResponses: data.responses,
                  endTime: new Date()
                }));
                setCurrentStep('completed');
    // 完了時のコールバックを呼び出し
    if (onComplete) {
      onComplete();
    }
              }}
              readOnly={false}
            />
      )}

      {/* 印刷プレビュー表示 */}
      {currentStep === 'conducting' && session.useBankSystem && session.bankGeneratedSheet && showPrintView && (
        <div className="max-w-6xl mx-auto p-6">
          <DynamicInterviewSheetPrint
            sheetData={session.bankGeneratedSheet}
            staffProfile={{
              id: session.staffMember!.id,
              name: session.staffMember!.name,
              employeeNumber: session.staffMember!.id,
              hireDate: new Date(Date.now() - (session.staffMember!.experienceYears * 365 + session.staffMember!.experienceMonths * 30) * 24 * 60 * 60 * 1000),
              experienceLevel: determineExperienceLevel(session.staffMember!.experienceYears),
              experienceYears: session.staffMember!.experienceYears,
              experienceMonths: session.staffMember!.experienceMonths,
              position: {
                id: mapToPositionId(session.staffMember!.position),
                name: session.staffMember!.position,
                category: mapToProfessionCategory(session.staffMember!.jobRole),
                level: mapToPositionLevel(session.staffMember!.position),
                hierarchyLevel: mapToHierarchyLevel(session.staffMember!.position)
              },
              positionLevel: mapToPositionLevel(session.staffMember!.position),
              facility: session.staffMember!.facilityType,
              department: mapToDepartmentType(session.staffMember!.department),
              profession: session.staffMember!.jobRole,
              licenses: extractLicenses(session.staffMember!.jobRole)
            }}
            responses={session.bankResponses || {}}
            motivationType={session.staffMember?.motivationType}
          />
        </div>
      )}

      {/* Step 5: 面談実施 - 従来テンプレート（v6含む） */}
      {currentStep === 'conducting' && (session.useV6Template || (!session.useBankSystem && session.manual)) && session.manual && (
        <div className="space-y-6">
          {/* モード切り替えボタン */}
          <div className="flex justify-end gap-2 print:hidden">
            <Button
              variant={useImprovedUI ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setUseImprovedUI(true);
                setIsPrintMode(false);
                setShowPrintPreview(false);
              }}
            >
              <FileText className="h-4 w-4 mr-1" />
              改善版デジタル入力
            </Button>
            <Button
              variant={!useImprovedUI && !isPrintMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setUseImprovedUI(false);
                setIsPrintMode(false);
                setShowPrintPreview(false);
              }}
            >
              <FileText className="h-4 w-4 mr-1" />
              従来版デジタル入力
            </Button>
            <Button
              variant={isPrintMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setIsPrintMode(true);
                setUseImprovedUI(false);
              }}
            >
              <FileText className="h-4 w-4 mr-1" />
              印刷用モード
            </Button>
            {isPrintMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrintPreview(true)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  プレビュー
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  印刷
                </Button>
              </>
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

          {/* 改善版UIを使用する場合 */}
          {useImprovedUI ? (
            <ImprovedDigitalInterviewUIFixed
              sessionData={{
                staffName: session.staffMember?.name || '',
                department: session.staffMember?.department || '',
                position: session.staffMember?.position || '',
                facilityType: session.staffMember?.facilityType || '',
                experienceYears: session.staffMember?.experienceYears || 0,
                interviewDate: new Date(),
                interviewerName: '面談者名' // 実際にはログインユーザー名を使用
              }}
              sections={
                // 適切なテンプレートを探すか、デフォルトのセクションを生成
                interviewTemplates.find(t => 
                  t.facilityType === session.staffMember?.facilityType &&
                  t.jobRole === session.staffMember?.jobRole &&
                  t.duration === session.duration
                )?.sections || generateDefaultSections(session.manual)
              }
              onSave={(responses: InterviewResponse[]) => {
                console.log('自動保存:', responses);
                // 実際にはAPIに保存
              }}
              onComplete={(responses: InterviewResponse[]) => {
                console.log('面談完了:', responses);
                setCurrentStep('completed');
    // 完了時のコールバックを呼び出し
    if (onComplete) {
      onComplete();
    }
                // 実際にはAPIに保存して完了処理
              }}
            />
          ) : isPrintMode ? (
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
                        {question.details?.askingTips && question.details.askingTips.length > 0 && (
                          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                            <p className="font-medium mb-1">💡 質問のポイント</p>
                            <ul className="space-y-1">
                              {question.details.askingTips.map((tip, i) => (
                                <li key={i}>• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}

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
                      {question.details?.redFlags && question.details.redFlags.length > 0 && (
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
        )}
        </div>
      )}

      {/* 印刷プレビューモーダル */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="max-w-[900px] h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-lg font-semibold">印刷プレビュー</DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPrintPreview(false);
                    setTimeout(() => window.print(), 100);
                  }}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  印刷実行
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrintPreview(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              A4サイズ2枚で印刷されます。内容を確認してから印刷してください。
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6 bg-gray-100">
            <div className="mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
              <div className="bg-white shadow-lg" style={{ padding: '10mm 15mm' }}>
                {/* プレビュー用の印刷レイアウト */}
                <div className="print-preview-content">
                  {/* ヘッダー情報 */}
                  <div className="border-b pb-2 mb-3">
                    <h1 className="text-base font-bold">面談記録シート</h1>
                    <div className="flex justify-between text-xs mt-1">
                      <div>
                        <span>対象者: </span>
                        <span className="font-semibold">{session.staffMember?.name || '_______________'}</span>
                        <span className="ml-4">職種: </span>
                        <span>{session.staffMember?.position || '_______________'}</span>
                      </div>
                      <div>
                        <span>面談日: ____年____月____日</span>
                      </div>
                    </div>
                  </div>

                  {/* セクション内容 */}
                  {session.manual?.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-4" style={{ pageBreakInside: 'avoid' }}>
                      <div className="bg-gray-50 px-2 py-1 mb-2">
                        <h2 className="text-sm font-bold">
                          セクション {sectionIndex + 1}: {section.title}
                        </h2>
                      </div>
                      
                      <div className="space-y-3">
                        {section.questions.map((question, questionIndex) => (
                          <div key={questionIndex} className="pl-2" style={{ pageBreakInside: 'avoid' }}>
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-semibold">
                                Q{sectionIndex + 1}-{questionIndex + 1}.
                              </span>
                              <div className="flex-1">
                                <p className="text-xs mb-1">{question.question}</p>
                                
                                {/* 質問タイプ別の回答欄プレビュー */}
                                {question.type === 'open' && (
                                  <div className="border-b border-gray-400" style={{ height: '18px' }}></div>
                                )}
                                
                                {question.type === 'open' && (
                                  <>
                                    <div className="border-b border-gray-400 mb-1" style={{ height: '18px' }}></div>
                                    <div className="border-b border-gray-400 mb-1" style={{ height: '18px' }}></div>
                                    <div className="border-b border-gray-400" style={{ height: '18px' }}></div>
                                  </>
                                )}
                                
                                {question.type === 'closed' && question.details?.expectedAnswers && (
                                  <div className="flex gap-3 mt-1">
                                    {question.details?.expectedAnswers?.map((option, optionIndex) => (
                                      <div key={optionIndex} className="flex items-center">
                                        <span className="inline-block w-3 h-3 border border-black mr-1"></span>
                                        <span className="text-xs">{option}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {question.type === 'checklist' && question.details?.expectedAnswers && (
                                  <div className="space-y-1 mt-1">
                                    {question.details?.expectedAnswers?.map((option, optionIndex) => (
                                      <div key={optionIndex} className="flex items-center">
                                        <span className="inline-block w-3 h-3 border border-black mr-1"></span>
                                        <span className="text-xs">{option}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {question.type === 'scale' && (
                                  <div className="flex justify-between mt-1">
                                    {[1, 2, 3, 4, 5].map(value => (
                                      <div key={value} className="flex flex-col items-center">
                                        <span className="inline-block w-3 h-3 border border-black mb-1"></span>
                                        <span className="text-xs">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* 署名欄 */}
                  <div className="mt-8 pt-4 border-t border-gray-400">
                    <div className="space-y-2 text-xs">
                      <div>
                        <span>面談終了時刻: ____時____分</span>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <span>面談者署名: </span>
                          <span className="inline-block border-b border-black" style={{ width: '150px' }}></span>
                        </div>
                        <div>
                          <span>対象者署名: </span>
                          <span className="inline-block border-b border-black" style={{ width: '150px' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
              <div id="interview-summary" className="w-full max-w-md space-y-3 p-4 bg-gray-50 rounded-lg">
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
                <Button 
                  onClick={() => setShowPrintPreview(true)}
                  variant="outline"
                  className="no-print"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  印刷プレビュー
                </Button>
                <Button 
                  onClick={() => printElement('interview-summary')}
                  variant="outline"
                  disabled={isPrinting}
                  className="no-print"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  印刷
                </Button>
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

      {/* 動機タイプ診断モーダル（初回のみ） - 改善版UI */}
      <ImprovedMotivationDiagnosisModal
        isOpen={showMotivationDiagnosis && motivationQuestions.length > 0}
        onClose={() => setShowMotivationDiagnosis(false)}
        staffName={session.staffMember?.name || ''}
        questions={motivationQuestions}
        onResponseSave={handleResponseSave}
        responses={session.responses}
      />
      
      {/* 印刷プレビューモーダル */}
      {showPrintPreview && (
        <PrintPreview
          isOpen={showPrintPreview}
          onClose={() => setShowPrintPreview(false)}
          title="面談記録"
          content={
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-4">面談記録</h1>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">職員情報</p>
                  <p>氏名: {session.staffMember?.name}</p>
                  <p>部署: {session.staffMember?.department}</p>
                  <p>職種: {session.staffMember?.position}</p>
                </div>
                <div>
                  <p className="font-semibold">面談情報</p>
                  <p>種別: {session.interviewType}</p>
                  <p>時間: {session.duration}分</p>
                  <p>実施日時: {session.startTime?.toLocaleString('ja-JP')}</p>
                </div>
                {session.manual && (
                  <div>
                    <p className="font-semibold">面談内容</p>
                    {session.manual.sections.map((section, idx) => (
                      <div key={idx} className="mt-3">
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-gray-600">{section.description}</p>
                        {section.questions.map((q, qIdx) => (
                          <div key={qIdx} className="ml-4 mt-2">
                            <p className="text-sm">{q.question}</p>
                            {session.responses.get(q.id) && (
                              <p className="text-sm text-gray-700 ml-4">
                                回答: {session.responses.get(q.id)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          }
          showSettings={true}
        />
      )}
    </div>
  );
}