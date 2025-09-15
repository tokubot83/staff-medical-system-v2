'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, Clock, User, AlertTriangle, CheckCircle,
  ChevronRight, Play, FileText, Users, MessageSquare,
  Filter, Search, RefreshCw, Bell, Plus, FilterX, ArrowLeft, CalendarDays,
  Settings, BarChart3, Brain, Zap, X, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VoiceDriveIntegrationService } from '@/services/voicedriveIntegrationService';

// 予約管理用インポート
type ReservationStatus = 'pending' | 'analyzing' | 'proposals' | 'editing' | 'sent' | 'awaiting' | 'confirmed' | 'rejected';

interface AIProposals {
  proposals: Array<{
    rank: 1 | 2 | 3;
    interviewer: string;
    timeSlot: string;
    matchingScore: number;
    reasoning: string;
  }>;
  recommendedChoice: 1 | 2 | 3;
}

interface ProvisionalReservation {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  interviewType: 'regular' | 'special' | 'support';
  subType?: string;
  preferredDates: Date[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  source: 'voicedrive' | 'manual';
  status: ReservationStatus;
  receivedAt: Date;
  notes?: string;
  aiAnalysis?: AIProposals;
  adjustmentCount?: number;
  lastSentAt?: Date;
  approvedProposal?: number;
  // 新しい承認ワークフロー用フィールド
  workflowStage: 'initial' | 'awaiting_approval' | 'confirmed' | 'rejected';
  voicedriveApprovalReceived?: boolean;
  voicedriveApprovalAt?: Date;
  humanConfirmationRequired?: boolean;
  confirmedBy?: string;
  confirmedAt?: Date;
  rejectionCount?: number;
  needsReproposal?: boolean;
}
import { useRouter, useSearchParams } from 'next/navigation';
import { mockInterviews } from '@/data/mockInterviews';
import ManualReservationModal from './ManualReservationModal';
import AdvancedSearchModal, { AdvancedSearchFilters } from '@/components/search/AdvancedSearchModal';
import SearchResults from '@/components/search/SearchResults';
import { AdvancedSearchService } from '@/utils/searchUtils';
import InterviewTemplateManager from '@/components/templates/InterviewTemplateManager';
import DynamicInterviewFlow from './DynamicInterviewFlow';
import InterviewCalendar from './InterviewCalendar';
import EnhancedOverdueAlert from './EnhancedOverdueAlert';
import InterviewerManagement from './InterviewerManagement';
import PatternDAnalytics from './PatternDAnalytics';
import { EnhancedInterviewReservation } from '@/types/pattern-d-interview';
import { TimeSlotManager } from '@/services/time-slot-manager';

// 担当者管理連携用の型定義
interface EnhancedInterviewerProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  specialties: string[];
  experienceYears: number;
  workingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  dailySchedule: {
    [day: string]: {
      isAvailable: boolean;
      timeSlots: string[];
      restrictions?: string[];
    };
  };
  currentStatus: 'active' | 'on-leave' | 'inactive';
  workloadAnalysis: {
    currentWeekLoad: number;
    maxCapacity: number;
    efficiency: number;
    nextAvailableSlot: string;
  };
}

// 面談予約の統合型定義
export interface UnifiedInterviewReservation {
  id: string;
  type: 'regular' | 'special' | 'support';
  subType?: string;
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  experienceYears: number;
  scheduledDate: Date;
  scheduledTime: string;
  duration?: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  
  // 定期面談用
  regularType?: 'new_employee' | 'annual' | 'management';
  
  // 特別面談用
  specialType?: 'exit' | 'transfer' | 'return' | 'promotion' | 'disciplinary';
  specialContext?: any;
  
  // サポート面談用
  supportCategory?: string;
  supportTopic?: string;
  supportDetails?: string;
  voiceDriveRequestId?: string;
  
  // 共通
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
  
  // 予約ソース
  source?: 'manual' | 'voicedrive' | 'system';
  createdBy?: string;

  // 面談完了データ（職員カルテ用）
  conductedAt?: Date;
  interviewerName?: string;
  outcomeSummary?: string;
  outcomeActionItems?: string[];
  outcomeFollowupRequired?: boolean;
  outcomeFollowupDate?: Date;
  responses?: Record<string, any>;
}

export default function UnifiedInterviewDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reservations, setReservations] = useState<UnifiedInterviewReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState<'all' | 'regular' | 'special' | 'support'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<UnifiedInterviewReservation[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [currentSearchFilters, setCurrentSearchFilters] = useState<AdvancedSearchFilters | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);

  // サブビュー表示制御
  const [showInterviewFlow, setShowInterviewFlow] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<UnifiedInterviewReservation | null>(null);

  // Pattern D機能用状態
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'interviewer-management' | 'pattern-d-analytics'>('dashboard');
  const [patternDReservations, setPatternDReservations] = useState<EnhancedInterviewReservation[]>([]);
  const [timeSlotManager] = useState(new TimeSlotManager());

  // 予約管理統合用状態
  const [provisionalReservations, setProvisionalReservations] = useState<ProvisionalReservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<ProvisionalReservation | null>(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showInterviewerManagement, setShowInterviewerManagement] = useState(false);
  const [showPatternDAnalytics, setShowPatternDAnalytics] = useState(false);

  // 新統合システム用状態
  const [selectedStage, setSelectedStage] = useState<'booking' | 'management' | 'execution' | 'feedback' | null>(null);

  // 統合ダッシュボードへのスクロール用ref
  const integratedDashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadReservations();
    loadPatternDReservations();
    loadProvisionalReservations();
  }, [selectedDate]);

  // 予約管理データ読み込み
  const loadProvisionalReservations = async () => {
    try {
      // Mockデータを生成
      const mockData: ProvisionalReservation[] = [
        // 仮予約カラム用（初回受付）
        {
          id: 'PROV-001',
          staffId: 'OH-NS-2021-001',
          staffName: '田中 花子',
          department: '内科',
          position: '看護師',
          interviewType: 'support',
          preferredDates: [new Date('2025-09-20'), new Date('2025-09-21')],
          urgency: 'medium',
          source: 'voicedrive',
          status: 'pending',
          receivedAt: new Date('2025-09-15'),
          notes: 'キャリア相談を希望',
          adjustmentCount: 0,
          workflowStage: 'initial',
          voicedriveApprovalReceived: false,
          humanConfirmationRequired: false,
          needsReproposal: false
        },
        // 承認待ちカラム用（VoiceDriveから承認通知受信済み、確認ボタン待ち）
        {
          id: 'PROV-002',
          staffId: 'OH-DR-2020-003',
          staffName: '山田 太郎',
          department: '外科',
          position: '医師',
          interviewType: 'regular',
          preferredDates: [new Date('2025-09-22')],
          urgency: 'low',
          source: 'voicedrive',
          status: 'awaiting',
          receivedAt: new Date('2025-09-14'),
          adjustmentCount: 1,
          workflowStage: 'awaiting_approval',
          voicedriveApprovalReceived: true,
          voicedriveApprovalAt: new Date('2025-09-15T10:30:00'),
          humanConfirmationRequired: true,
          needsReproposal: false
        },
        // 承認待ちカラム用（再提案が必要）
        {
          id: 'PROV-003',
          staffId: 'OH-NS-2022-005',
          staffName: '佐藤 美和',
          department: '整形外科',
          position: '看護師',
          interviewType: 'special',
          preferredDates: [new Date('2025-09-18'), new Date('2025-09-19')],
          urgency: 'urgent',
          source: 'voicedrive',
          status: 'awaiting',
          receivedAt: new Date('2025-09-13'),
          notes: '緊急メンタルヘルス相談',
          adjustmentCount: 2,
          workflowStage: 'awaiting_approval',
          voicedriveApprovalReceived: false,
          rejectionCount: 1,
          needsReproposal: true
        },
        {
          id: 'PROV-003',
          staffId: 'OH-PT-2022-005',
          staffName: '佐藤 美咲',
          department: 'リハビリテーション科',
          position: '理学療法士',
          interviewType: 'support',
          preferredDates: [new Date('2025-09-19')],
          urgency: 'high',
          source: 'voicedrive',
          status: 'pending',
          receivedAt: new Date('2025-09-15'),
          notes: '職場環境についての相談'
        }
      ];

      setProvisionalReservations(mockData);
    } catch (error) {
      console.error('予約管理データの読み込みエラー:', error);
    }
  };

  // Pattern D予約データ読み込み
  const loadPatternDReservations = async () => {
    try {
      // TODO: Pattern D予約API呼び出し
      // const response = await fetch('/api/interviews/pattern-d-reservations');
      // const data = await response.json();
      // setPatternDReservations(data.reservations);

      // 現在はモックデータ
      const mockPatternDData: EnhancedInterviewReservation[] = [
        {
          id: 'AI-BOOK-001',
          type: 'support',
          staffId: 'OH-NS-2021-001',
          staffName: '田中 花子',
          department: '内科',
          position: '看護師',
          experienceYears: 3,
          scheduledDate: new Date('2025-09-20'),
          scheduledTime: '14:30',
          duration: 45,
          status: 'confirmed',
          bookingType: 'ai_optimized',
          interviewerInfo: {
            id: 'INT-001',
            name: '田中美香子',
            title: '看護師長',
            department: 'キャリア支援室'
          },
          source: 'voicedrive',
          createdBy: '職員:田中 花子',
          createdAt: new Date('2025-09-13'),
          updatedAt: new Date('2025-09-13'),
          qualityMetrics: {
            staffSatisfaction: 4.8,
            matchingAccuracy: 92,
            timeliness: 95
          }
        }
      ];

      setPatternDReservations(mockPatternDData);
    } catch (error) {
      console.error('Pattern D予約データの読み込みエラー:', error);
    }
  };

  // URLパラメータの監視
  useEffect(() => {
    const view = searchParams.get('view');
    const reservationId = searchParams.get('reservationId');
    
    if (view === 'interview-flow' && reservationId) {
      // URLから面談フロー表示が指定された場合
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        setCurrentReservation(reservation);
        setShowInterviewFlow(true);
      }
    } else {
      // デフォルトビューに戻る
      setShowInterviewFlow(false);
      setCurrentReservation(null);
    }
  }, [searchParams, reservations]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      // 実際の実装では各サービスから予約データを取得
      const mockData = await getMockReservations();
      
      // VoiceDriveからのサポート面談予約を取得（エラーハンドリング追加）
      let voiceDriveReservations: any[] = [];
      try {
        const voiceDriveRequests = await VoiceDriveIntegrationService.fetchInterviewRequests();
        voiceDriveReservations = voiceDriveRequests || [];
      } catch (vdError) {
        console.warn('VoiceDrive連携エラー（本番環境でない場合は無視）:', vdError);
        // VoiceDrive連携がエラーの場合はモックデータのみを使用
      }
      
      // データを統合
      const unified = [...mockData, ...convertVoiceDriveToUnified(voiceDriveReservations)];
      
      setReservations(unified);
    } catch (error) {
      console.error('Failed to load reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertVoiceDriveToUnified = (voiceDriveData: any[]): UnifiedInterviewReservation[] => {
    return voiceDriveData.map(vd => ({
      id: vd.requestId,
      type: 'support' as const,
      staffId: vd.employeeId,
      staffName: vd.employeeName,
      department: vd.department,
      position: vd.position || '一般職員',
      experienceYears: 0, // 実際はスタッフマスターから取得
      scheduledDate: new Date(vd.requestedDate),
      scheduledTime: vd.requestedTime || '未定',
      status: vd.status === 'approved' ? 'confirmed' : 'pending',
      urgency: vd.urgency,
      supportCategory: vd.category,
      supportTopic: vd.consultationTopic,
      supportDetails: vd.consultationDetails,
      voiceDriveRequestId: vd.requestId,
      createdAt: new Date(vd.createdAt)
    }));
  };

  const getMockReservations = async (): Promise<UnifiedInterviewReservation[]> => {
    // mockInterviewsから実際のデータを変換
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 本日の面談用にいくつかのデータの日付を今日に変更
    const convertedData: UnifiedInterviewReservation[] = mockInterviews
      .filter(interview => interview.status === 'scheduled')
      .map((interview, index) => {
        // bookingDateが今日の日付、または最初の15件を今日の日付に設定
        const bookingDateStr = interview.bookingDate;
        const isToday = bookingDateStr === today.toISOString().split('T')[0];
        const scheduledDate = isToday || index < 15 ? today : new Date(interview.bookingDate);
        
        // 面談タイプの判定と変換
        let type: 'regular' | 'special' | 'support' = 'regular';
        let regularType: 'new_employee' | 'annual' | 'management' | undefined;
        let specialType: 'exit' | 'transfer' | 'return' | 'promotion' | 'disciplinary' | undefined;
        let supportCategory: string | undefined;
        let supportTopic: string | undefined;
        
        switch (interview.interviewType) {
          case 'new_employee_monthly':
            type = 'regular';
            regularType = 'new_employee';
            break;
          case 'regular_annual':
            type = 'regular';
            regularType = 'annual';
            break;
          case 'management_biannual':
          case 'management_assessment':
            type = 'regular';
            regularType = 'management';
            break;
          case 'exit_interview':
            type = 'special';
            specialType = 'exit';
            break;
          case 'return_to_work':
            type = 'special';
            specialType = 'return';
            break;
          case 'career_support':
            type = 'support';
            supportCategory = 'career';
            supportTopic = interview.requestedTopics?.join(', ') || 'キャリア相談';
            break;
          case 'workplace_support':
            type = 'support';
            supportCategory = 'workplace';
            supportTopic = interview.requestedTopics?.join(', ') || '職場環境相談';
            break;
          case 'individual_consultation':
            type = 'support';
            supportCategory = 'other';
            supportTopic = interview.requestedTopics?.join(', ') || '個別相談';
            break;
          default:
            type = 'support';
            supportCategory = 'other';
            break;
        }
        
        // 経験年数を推定（新人は0年、一般は3年、管理職は10年として設定）
        let experienceYears = 3;
        if (interview.employeeName?.includes('新田') || interview.employeeName?.includes('佐々木')) {
          experienceYears = 0;
        } else if (interview.employeeName?.includes('斎藤') || interview.employeeName?.includes('村田')) {
          experienceYears = 10;
        } else if (interview.employeeName?.includes('清水')) {
          experienceYears = 15;
        }
        
        return {
          id: interview.id,
          type,
          regularType,
          specialType,
          staffId: interview.employeeId,
          staffName: interview.employeeName,
          department: interview.department,
          position: interview.position,
          experienceYears,
          scheduledDate,
          scheduledTime: interview.startTime,
          duration: interview.duration,
          status: interview.status === 'scheduled' ? 'confirmed' : 'pending',
          urgency: interview.urgencyLevel as any,
          supportCategory,
          supportTopic,
          supportDetails: interview.description,
          notes: interview.employeeNotes,
          createdAt: new Date(interview.createdAt)
        };
      });
    
    return convertedData;
  };

  const handleStartInterview = (reservation: UnifiedInterviewReservation) => {
    console.log('handleStartInterview called with reservation:', reservation);
    
    // URLパラメータでサブビューに切り替え
    const url = `/interviews?tab=station&view=interview-flow&reservationId=${reservation.id}`;
    console.log('Navigating to:', url);
    
    // 状態を設定
    setCurrentReservation(reservation);
    setShowInterviewFlow(true);
    
    // URLを更新
    router.push(url);
  };

  // 面談フローから戻る処理
  const handleBackToDashboard = () => {
    setShowInterviewFlow(false);
    setCurrentReservation(null);
    router.push('/interviews?tab=station');
  };

  // 高度な検索処理
  const handleAdvancedSearch = async (filters: AdvancedSearchFilters) => {
    setIsSearching(true);
    setCurrentSearchFilters(filters);
    
    try {
      // 検索履歴に保存
      AdvancedSearchService.saveSearchHistory(filters);
      
      // 検索実行
      const results = AdvancedSearchService.searchReservations(reservations, filters);
      setSearchResults(results);
      setIsSearchMode(true);
    } catch (error) {
      console.error('検索エラー:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 検索モードを終了
  const handleClearSearch = () => {
    setIsSearchMode(false);
    setSearchResults([]);
    setCurrentSearchFilters(null);
    setSearchTerm('');
  };

  // クイック検索（基本検索バーでの検索）
  const handleQuickSearch = (query: string) => {
    setSearchTerm(query);
    if (query.trim()) {
      const results = AdvancedSearchService.quickSearch(reservations, query);
      setSearchResults(results);
      setIsSearchMode(true);
      setCurrentSearchFilters({
        keyword: query,
        staffName: '',
        staffId: '',
        departments: [],
        positions: [],
        experienceYears: {},
        interviewTypes: [],
        interviewSubTypes: [],
        statuses: [],
        urgencyLevels: [],
        dateRange: {},
        timeSlots: [],
        tags: [],
        notes: '',
        hasFiles: false,
        isOverdue: false,
        sortBy: 'date',
        sortOrder: 'desc'
      });
    } else {
      handleClearSearch();
    }
  };

  // 検索結果から面談開始
  const handleStartInterviewFromSearch = (reservation: UnifiedInterviewReservation) => {
    handleStartInterview(reservation);
  };

  // 手動予約の追加処理
  const handleAddManualReservation = (reservation: Partial<UnifiedInterviewReservation>) => {
    const newReservation: UnifiedInterviewReservation = {
      id: reservation.id || `MANUAL-${Date.now()}`,
      type: reservation.type || 'regular',
      staffId: reservation.staffId || '',
      staffName: reservation.staffName || '',
      department: reservation.department || '',
      position: reservation.position || '',
      experienceYears: reservation.experienceYears || 0,
      scheduledDate: reservation.scheduledDate || new Date(),
      scheduledTime: reservation.scheduledTime || '10:00',
      status: 'confirmed',
      urgency: reservation.urgency,
      regularType: reservation.regularType,
      specialType: reservation.specialType,
      supportCategory: reservation.supportCategory,
      supportTopic: reservation.supportTopic,
      notes: reservation.notes,
      createdAt: new Date(),
      source: 'manual',
      createdBy: reservation.createdBy || '管理者'
    };

    // 予約リストに追加
    setReservations(prev => [...prev, newReservation]);
    
    // 実際の実装では、ここでAPIを呼び出してデータベースに保存
    console.log('Manual reservation added:', newReservation);
    
    // モーダルを閉じる
    setShowAddModal(false);
  };

  const getTodayReservations = () => {
    const today = new Date();
    // 既存の面談予約のみを取得（確定済み予約は含まない）
    const existingReservations = reservations.filter(r => {
      const rDate = new Date(r.scheduledDate);
      return rDate.toDateString() === today.toDateString();
    });

    // 🚀 NEW: VoiceDriveで承認済みの予約を面談予約形式に変換して追加
    // 承認待ち状態から confirmed になったものを右側に表示
    const voiceDriveApprovedReservations = provisionalReservations
      .filter(r => r.status === 'confirmed' && r.workflowStage === 'confirmed') // VoiceDriveで承認済み + 人事確認済み
      .map(convertProvisionalToUnified);

    return [...existingReservations, ...voiceDriveApprovedReservations];
  };

  // フィードバック未完了件数を取得
  const getPendingFeedbackCount = () => {
    // 面談実施済み（completed）だが、フィードバック未送信の件数をシミュレート
    // 実際の実装では職員カルテシステムから取得
    const completedInterviews = reservations.filter(r => r.status === 'completed');

    // モックデータ：完了面談の約30%がフィードバック未完了と仮定
    const pendingFeedbackCount = Math.ceil(completedInterviews.length * 0.3);

    // Pattern D予約からの完了分も考慮
    const patternDCompleted = patternDReservations.filter(r => r.status === 'completed');
    const patternDPendingFeedback = Math.ceil(patternDCompleted.length * 0.2);

    return pendingFeedbackCount + patternDPendingFeedback;
  };

  // 🚀 VoiceDrive承認済み予約を面談予約形式に変換
  const convertProvisionalToUnified = (provisional: ProvisionalReservation): UnifiedInterviewReservation => {
    // 本日の日付に設定（面談実施は承認当日〜近日中を想定）
    const today = new Date();
    const scheduledDate = provisional.preferredDates[0] || today;

    return {
      id: `VD-${provisional.id}`, // VoiceDrive由来であることを明示
      type: provisional.interviewType,
      staffId: provisional.staffId,
      staffName: provisional.staffName,
      department: provisional.department,
      position: provisional.position,
      experienceYears: 0,
      scheduledDate: scheduledDate,
      scheduledTime: '14:00', // AI最適化で決定される時間
      duration: 45,
      status: 'confirmed', // VoiceDrive承認済み = 確定
      urgency: provisional.urgency,
      supportCategory: provisional.interviewType === 'support' ? 'career' : undefined,
      supportTopic: provisional.notes || `${provisional.interviewType}面談`,
      notes: `📱 VoiceDrive承認済み予約 (調整${provisional.adjustmentCount || 0}回)`,
      createdAt: provisional.receivedAt,
      source: 'voicedrive' // VoiceDrive由来
    };
  };

  const getUpcomingReservations = () => {
    const today = new Date();
    return reservations.filter(r => {
      const rDate = new Date(r.scheduledDate);
      return rDate > today;
    });
  };

  const getOverdueReservations = () => {
    const today = new Date();
    return reservations.filter(r => {
      const rDate = new Date(r.scheduledDate);
      return rDate < today && r.status !== 'completed';
    });
  };

  const getFilteredReservations = (list: UnifiedInterviewReservation[]) => {
    return list.filter(r => {
      const matchesType = filterType === 'all' || r.type === filterType;
      const matchesSearch = searchTerm === '' || 
        r.staffName.includes(searchTerm) ||
        r.department.includes(searchTerm);
      const matchesUrgent = !showUrgentOnly || 
        (r.urgency === 'high' || r.urgency === 'urgent');
      
      return matchesType && matchesSearch && matchesUrgent;
    });
  };

  const getInterviewTypeLabel = (reservation: UnifiedInterviewReservation) => {
    if (reservation.type === 'regular') {
      switch (reservation.regularType) {
        case 'new_employee': return '新入職員月次面談';
        case 'annual': return '年次面談';
        case 'management': return '管理職面談';
        default: return '定期面談';
      }
    } else if (reservation.type === 'special') {
      switch (reservation.specialType) {
        case 'exit': return '退職面談';
        case 'transfer': return '異動面談';
        case 'return': return '復職面談';
        case 'promotion': return '昇進面談';
        case 'disciplinary': return '懲戒面談';
        default: return '特別面談';
      }
    } else {
      return `サポート面談 - ${getCategoryLabel(reservation.supportCategory || '')}`;
    }
  };

  // 緊急度計算関数
  const calculateUrgency = (reservation: UnifiedInterviewReservation): 'critical' | 'warning' | 'normal' => {
    const today = new Date();
    const scheduledDate = new Date(reservation.scheduledDate);
    const daysOverdue = Math.ceil((today.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // 特別面談は優先度が高い
    if (reservation.type === 'special') {
      if (daysOverdue >= 1) return 'critical';
      return 'warning';
    }
    
    // 一般的なルール
    if (daysOverdue >= 3) return 'critical';
    if (daysOverdue >= 1) return 'warning';
    return 'normal';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      career: 'キャリア相談',
      workplace: '職場環境',
      relationships: '人間関係',
      worklife: 'ワークライフバランス',
      health: '健康・メンタルヘルス',
      skills: 'スキル・研修',
      evaluation: '評価・フィードバック',
      other: 'その他'
    };
    return labels[category] || category;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      in_progress: 'destructive',
      completed: 'outline',
      cancelled: 'outline'
    };
    
    const labels: Record<string, string> = {
      pending: '承認待ち',
      confirmed: '確定',
      in_progress: '実施中',
      completed: '完了',
      cancelled: 'キャンセル'
    };
    
    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null;
    
    const colors: Record<string, string> = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${colors[urgency]}`}>
        {urgency === 'urgent' ? '緊急' : urgency === 'high' ? '高' : urgency === 'medium' ? '中' : '低'}
      </span>
    );
  };

  const todayReservations = getFilteredReservations(getTodayReservations());
  const overdueReservations = getFilteredReservations(getOverdueReservations());

  // 面談フロー表示中の場合
  if (showInterviewFlow && currentReservation) {
    return (
      <div className="space-y-4">
        {/* ヘッダーバー */}
        <div className="flex items-center justify-between p-4 bg-white border-b fullwidth-interview-header-bar">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              面談ステーションに戻る
            </Button>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{currentReservation.staffName}</span>
              {' - '}
              <span>{currentReservation.department} / {currentReservation.position}</span>
            </div>
          </div>
          <Badge variant="outline">
            {currentReservation.type === 'regular' ? '定期面談' :
             currentReservation.type === 'special' ? '特別面談' : 'サポート面談'}
          </Badge>
        </div>

        {/* DynamicInterviewFlowコンポーネント - フル幅対応 */}
        <DynamicInterviewFlow 
          initialReservation={currentReservation}
          onComplete={() => {
            handleBackToDashboard();
            loadReservations(); // 完了後にリストを更新
          }}
        />
      </div>
    );
  }

  // 通常のダッシュボード表示
  return (
    <div className="space-y-6">
      {/* 面談ダッシュボード - サブタブ構造を削除、内容は完全保持 */}
          {/* ヘッダー - より目立つデザイン */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">🚉</span>
              面談ステーション
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              人事部面談管理センター - すべての面談予約を一元管理
            </p>
            <div className="flex gap-4 mt-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm">本日の面談</span>
                <span className="text-2xl font-bold ml-2">{getTodayReservations().length}</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm">今週の予定</span>
                <span className="text-2xl font-bold ml-2">{getUpcomingReservations().filter(r => {
                  const days = Math.ceil((new Date(r.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return days <= 7;
                }).length}</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm">要対応</span>
                <span className="text-2xl font-bold ml-2">{getOverdueReservations().length}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setShowAddModal(true)} className="bg-white text-blue-700 hover:bg-blue-50">
              <Plus className="h-5 w-5 mr-2" />
              手動予約追加
            </Button>
            <Button onClick={() => setShowTemplateManager(true)} variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <FileText className="h-4 w-4 mr-2" />
              テンプレート管理
            </Button>
            <Button onClick={loadReservations} variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <RefreshCw className="h-4 w-4 mr-2" />
              データ更新
            </Button>
          </div>
        </div>
      </div>

      {/* 業務フローセクション */}
      <div className="grid grid-cols-4 gap-4">
        <div
          className={`bg-gradient-to-br from-green-50 to-green-100 border-2 ${
            selectedStage === 'booking' ? 'border-green-500 shadow-lg' : 'border-green-200'
          } rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer`}
          onClick={() => {
            setSelectedStage(selectedStage === 'booking' ? null : 'booking');
            integratedDashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500 text-white rounded-full p-3">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">① 予約受付</h3>
              <p className="text-sm text-green-700">電話・対面・VoiceDrive</p>
            </div>
          </div>
          <div className="text-center">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddModal(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              手動で予約を追加
            </Button>
          </div>
        </div>

        <div
          className={`bg-gradient-to-br from-blue-50 to-blue-100 border-2 ${
            selectedStage === 'management' ? 'border-blue-500 shadow-lg' : 'border-blue-200'
          } rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer`}
          onClick={() => {
            setSelectedStage(selectedStage === 'management' ? null : 'management');
            integratedDashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-500 text-white rounded-full p-3">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900">② 予約管理</h3>
              <p className="text-sm text-blue-700">確認・調整・承認</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-center">
            <div className="group relative">
              <span className={`${
                provisionalReservations.filter(r => (r.status === 'pending' || r.status === 'awaiting') && r.urgency === 'urgent').length > 0
                  ? 'text-red-600'
                  : provisionalReservations.filter(r => (r.status === 'pending' || r.status === 'awaiting') && r.urgency === 'high').length > 0
                  ? 'text-orange-600'
                  : 'text-blue-600'
              }`}>
                {provisionalReservations.filter(r => r.status === 'pending' || r.status === 'awaiting').length}件
              </span>
              {/* ホバー時の詳細表示 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <div className="space-y-1">
                  <div>仮予約: {provisionalReservations.filter(r => r.status === 'pending').length}件 | 承認待ち: {provisionalReservations.filter(r => r.status === 'awaiting').length}件</div>
                  <div className="text-red-300">緊急: {provisionalReservations.filter(r => (r.status === 'pending' || r.status === 'awaiting') && r.urgency === 'urgent').length}件</div>
                  <div className="text-orange-300">高: {provisionalReservations.filter(r => (r.status === 'pending' || r.status === 'awaiting') && r.urgency === 'high').length}件</div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`bg-gradient-to-br from-orange-50 to-orange-100 border-2 ${
            selectedStage === 'execution' ? 'border-orange-500 shadow-lg' : 'border-orange-200'
          } rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer`}
          onClick={() => {
            setSelectedStage(selectedStage === 'execution' ? null : 'execution');
            integratedDashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-500 text-white rounded-full p-3">
              <Play className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-orange-900">③ 面談実施</h3>
              <p className="text-sm text-orange-700">シート生成・実施</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-600 text-center">
            本日 {getTodayReservations().length}件
          </div>
        </div>

        <div
          className={`bg-gradient-to-br from-purple-50 to-purple-100 border-2 ${
            selectedStage === 'feedback' ? 'border-purple-500 shadow-lg' : 'border-purple-200'
          } rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer`}
          onClick={() => {
            setSelectedStage(selectedStage === 'feedback' ? null : 'feedback');
            integratedDashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-500 text-white rounded-full p-3">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900">④ フィードバック</h3>
              <p className="text-sm text-purple-700">職員通知・完了確認</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-center">
            <div className="group relative">
              <span className={`${
                getPendingFeedbackCount() > 5
                  ? 'text-red-600'
                  : getPendingFeedbackCount() > 2
                  ? 'text-orange-600'
                  : 'text-purple-600'
              }`}>
                {getPendingFeedbackCount()}件未完了
              </span>
              {/* ホバー時の詳細表示 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <div className="space-y-1">
                  <div>面談完了済み: {reservations.filter(r => r.status === 'completed').length}件</div>
                  <div className="text-yellow-300">フィードバック対象: {getPendingFeedbackCount()}件</div>
                  <div className="text-gray-300">職員カルテ → 面談・指導タブから送信可能</div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 左右分割メインコンテンツ - 最優先業務エリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 👈 左側: 面談予約管理セクション */}
        <ReservationManagementSection
          provisionalReservations={provisionalReservations}
          onShowInterviewerManagement={() => setShowInterviewerManagement(true)}
          onShowPatternDAnalytics={() => setShowPatternDAnalytics(true)}
          onConfirmed={(confirmed) => {
            // 確定済み予約を右側に送信
            console.log('確定済み予約:', confirmed);
            // 予約管理データを更新
            setProvisionalReservations(prev =>
              prev.map(r =>
                confirmed.find(c => c.id === r.id) ? { ...r, status: 'confirmed' as const } : r
              )
            );
            loadReservations(); // 右側データ更新
          }}
          onStatusChange={(reservation, newStatus) => {
            // 予約ステータス変更処理
            setProvisionalReservations(prev =>
              prev.map(r => r.id === reservation.id ? { ...r, status: newStatus } : r)
            );
            if (newStatus === 'confirmed') {
              // 🚀 NEW: 確定済みになったら承認待ちから削除し、右側に直接表示
              console.log('VoiceDrive承認完了 → 右側面談実施セクションに表示:', reservation);
              // 右側データは getTodayReservations() で自動取得される
            }
          }}
        />

        {/* 👉 右側: 面談実施管理セクション */}
        <InterviewExecutionSection
          todayReservations={todayReservations}
          loading={loading}
          onStartInterview={handleStartInterview}
        />
      </div>

      {/* 4ステージ統合表示エリア - カード連動型 */}
      <Card className="border-2 border-blue-200" ref={integratedDashboardRef}>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            統合ダッシュボード - 業務フロー詳細
          </CardTitle>
          <p className="text-sm text-gray-600">上部カードクリックで対応する詳細表示</p>
        </CardHeader>
        <CardContent className="pt-4">
          <IntegratedWorkflowDisplay
            selectedStage={selectedStage}
            provisionalReservations={provisionalReservations}
            todayReservations={todayReservations}
            reservations={reservations}
            onStageChange={setSelectedStage}
            onStartInterview={handleStartInterview}
          />
        </CardContent>
      </Card>

      {/* 統合カレンダー - 常時表示 */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            統合スケジュールカレンダー
          </CardTitle>
          <p className="text-sm text-gray-600">確定予約の週・月表示 / 先々の予定管理</p>
        </CardHeader>
        <CardContent className="pt-4">
          <IntegratedCalendarView
            reservations={reservations}
            provisionalReservations={provisionalReservations}
            patternDReservations={patternDReservations}
            onEventClick={(event) => {
              const reservation = reservations.find(r => r.id === event.id);
              if (reservation) {
                handleStartInterview(reservation);
              }
            }}
          />
        </CardContent>
      </Card>

      {/* 手動予約追加モーダル */}
      <ManualReservationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddManualReservation}
      />

      {/* 高度な検索モーダル - 削除予定 */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        initialFilters={currentSearchFilters || undefined}
      />

      {/* テンプレート管理モーダル */}
      <InterviewTemplateManager
        isOpen={showTemplateManager}
        onClose={() => setShowTemplateManager(false)}
        onSelectTemplate={(template) => {
          console.log('選択されたテンプレート:', template);
          setShowTemplateManager(false);
        }}
      />

      {/* 担当者管理モーダル */}
      <Dialog open={showInterviewerManagement} onOpenChange={setShowInterviewerManagement}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              面談担当者管理
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <InterviewerManagement accessLevel="L8" />
          </div>
        </DialogContent>
      </Dialog>

      {/* AI最適化分析モーダル */}
      <Dialog open={showPatternDAnalytics} onOpenChange={setShowPatternDAnalytics}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI最適化分析 - Pattern D統合分析
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <PatternDAnalytics
              patternDReservations={patternDReservations}
              onRefresh={loadPatternDReservations}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 左側セクション: 予約管理
interface ReservationManagementSectionProps {
  provisionalReservations: ProvisionalReservation[];
  onConfirmed: (confirmed: ProvisionalReservation[]) => void;
  onStatusChange: (reservation: ProvisionalReservation, newStatus: ReservationStatus) => void;
  onShowInterviewerManagement: () => void;
  onShowPatternDAnalytics: () => void;
}

function ReservationManagementSection({ provisionalReservations, onConfirmed, onStatusChange, onShowInterviewerManagement, onShowPatternDAnalytics }: ReservationManagementSectionProps) {
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ProvisionalReservation | null>(null);

  const handleProcessReservation = (reservation: ProvisionalReservation) => {
    setSelectedReservation(reservation);
    setShowProcessingModal(true);
  };

  const handleAIOptimization = async (reservation: ProvisionalReservation) => {
    // AI最適化処理のシミュレーション
    console.log('AI最適化開始:', reservation);
    // TODO: 実際のAI最適化処理を実装
  };

  // 🚀 NEW: VoiceDrive承認シミュレーション
  const handleVoiceDriveApproval = (reservation: ProvisionalReservation) => {
    console.log('VoiceDrive承認シミュレーション:', reservation);
    // 承認待ち → 確定済み（左側カラムは削除し、右側に直接表示）
    onStatusChange(reservation, 'confirmed');
  };

  // 新しいワークフロー機能
  const handleHumanConfirmation = (reservation: ProvisionalReservation) => {
    console.log('人事確認開始:', reservation);
    setSelectedReservation(reservation);
    setShowConfirmationModal(true);
  };

  const handleReproposal = (reservation: ProvisionalReservation) => {
    console.log('再提案開始:', reservation);
    setSelectedReservation(reservation);
    setShowProcessingModal(true);
  };

  // カラムフィルタリング関数
  const getInitialReservations = () =>
    provisionalReservations.filter(r => r.workflowStage === 'initial');

  const getAwaitingApprovalReservations = () =>
    provisionalReservations.filter(r => r.workflowStage === 'awaiting_approval');

  const getStatusColor = (status: ReservationStatus) => {
    const colors = {
      pending: 'bg-blue-50 border-blue-200',
      analyzing: 'bg-yellow-50 border-yellow-200',
      proposals: 'bg-purple-50 border-purple-200',
      editing: 'bg-orange-50 border-orange-200',
      sent: 'bg-indigo-50 border-indigo-200',
      awaiting: 'bg-yellow-50 border-yellow-200',
      confirmed: 'bg-green-50 border-green-200',
      rejected: 'bg-red-50 border-red-200'
    };
    return colors[status] || 'bg-gray-50 border-gray-200';
  };

  const getStatusLabel = (status: ReservationStatus) => {
    const labels = {
      pending: '仮予約',
      analyzing: 'AI分析中',
      proposals: '3案提示中',
      editing: '人事編集中',
      sent: 'VD送信済み',
      awaiting: '承認待ち',
      confirmed: '確定済み',
      rejected: '再調整要求'
    };
    return labels[status] || status;
  };

  return (
    <Card className="border-2 border-blue-200 h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            🔄 面談予約管理 - VoiceDrive連携
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('担当者管理ボタンクリック');
                onShowInterviewerManagement();
              }}
              className="flex items-center gap-2 bg-white hover:bg-blue-50"
            >
              <Settings className="h-4 w-4" />
              担当者管理
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('AI最適化分析ボタンクリック');
                onShowPatternDAnalytics();
              }}
              className="flex items-center gap-2 bg-white hover:bg-green-50"
            >
              <Brain className="h-4 w-4" />
              AI最適化分析
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* 仮予約カラム - 初回受付のみ */}
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900 text-center">
              🟡 仮予約 ({getInitialReservations().length}件)
            </h3>
            <p className="text-xs text-gray-600 text-center mb-3">VoiceDriveからの初回受付</p>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getInitialReservations()
                .map(reservation => (
                  <Card key={reservation.id} className="p-4 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-blue-900">{reservation.staffName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={reservation.interviewType === 'regular' ? 'default' :
                                         reservation.interviewType === 'special' ? 'destructive' : 'secondary'}>
                            {reservation.interviewType === 'regular' ? '定期面談' :
                             reservation.interviewType === 'special' ? '特別面談' : 'サポート面談'}
                          </Badge>
                          <Badge variant={reservation.urgency === 'urgent' ? 'destructive' :
                                         reservation.urgency === 'high' ? 'destructive' :
                                         reservation.urgency === 'medium' ? 'outline' : 'secondary'}>
                            {reservation.urgency === 'urgent' ? '🚨 緊急' :
                             reservation.urgency === 'high' ? '⚠️ 高' :
                             reservation.urgency === 'medium' ? '📋 中' : '📝 低'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {reservation.department} / {reservation.position}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        受信: {new Date(reservation.receivedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* 希望日程表示 */}
                    <div className="bg-blue-50 p-3 rounded-md mb-3">
                      <h5 className="font-medium text-sm text-blue-900 mb-2">📅 希望日程</h5>
                      <div className="space-y-1">
                        {reservation.preferredDates.slice(0, 2).map((date, index) => (
                          <div key={index} className="text-sm text-blue-700">
                            {index + 1}. {new Date(date).toLocaleDateString('ja-JP', {
                              month: 'long', day: 'numeric', weekday: 'short'
                            })}
                          </div>
                        ))}
                        {reservation.preferredDates.length > 2 && (
                          <div className="text-xs text-blue-600">他 {reservation.preferredDates.length - 2}件</div>
                        )}
                      </div>
                    </div>

                    {/* 相談内容 */}
                    {reservation.notes && (
                      <div className="bg-gray-50 p-2 rounded mb-3">
                        <h5 className="font-medium text-xs text-gray-700 mb-1">💬 相談内容</h5>
                        <p className="text-xs text-gray-600 line-clamp-2">{reservation.notes}</p>
                      </div>
                    )}

                    {/* アクションボタン */}
                    <div className="flex gap-2">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProcessReservation(reservation);
                        }}
                      >
                        📋 詳細処理
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* 承認待ちカラム - VoiceDrive承認済み・確認待ち */}
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-900 text-center">
              🔵 承認待ち ({getAwaitingApprovalReservations().length}件)
            </h3>
            <p className="text-xs text-gray-600 text-center mb-3">VoiceDrive承認済み・人事確認待ち</p>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getAwaitingApprovalReservations()
                .map(reservation => {
                  const daysSinceSubmission = Math.floor((new Date().getTime() - (reservation.lastSentAt || reservation.receivedAt).getTime()) / (1000 * 60 * 60 * 24));
                  const progressPercentage = Math.min((daysSinceSubmission / 7) * 100, 100); // 7日間での進捗として計算
                  const isApprovalReceived = reservation.voicedriveApprovalReceived;
                  const needsReproposal = reservation.needsReproposal;

                  return (
                    <Card key={reservation.id} className={`p-4 border-2 ${
                      needsReproposal ? 'border-red-200 bg-red-50/50' :
                      isApprovalReceived ? 'border-green-200 bg-green-50/50' : 'border-yellow-200 bg-yellow-50/50'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{reservation.staffName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={
                              needsReproposal ? 'border-red-500 text-red-700' :
                              isApprovalReceived ? 'border-green-500 text-green-700' : 'border-yellow-500 text-yellow-700'
                            }>
                              {reservation.interviewType === 'regular' ? '定期面談' :
                               reservation.interviewType === 'special' ? '特別面談' : 'サポート面談'}
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              調整{reservation.adjustmentCount || 0}回目
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {reservation.department} / {reservation.position}
                          </div>
                          {/* 新しい状態表示 */}
                          {isApprovalReceived && reservation.voicedriveApprovalAt && (
                            <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              VoiceDrive承認済み ({reservation.voicedriveApprovalAt.toLocaleString()})
                            </div>
                          )}
                          {needsReproposal && (
                            <div className="text-xs text-red-600 mt-2 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              再提案が必要 (拒否回数: {reservation.rejectionCount || 0})
                            </div>
                          )}
                        </div>
                      </div>

                      {/* AI分析結果表示 */}
                      {reservation.aiAnalysis && (
                        <div className="bg-purple-50 border border-purple-200 p-3 rounded-md mb-3">
                          <h5 className="font-medium text-sm text-purple-900 mb-2 flex items-center">
                            🧠 AI推奨案 (スコア: {reservation.aiAnalysis.proposals[0]?.matchingScore || 85}%)
                          </h5>
                          <div className="text-sm text-purple-800">
                            📅 {reservation.aiAnalysis.proposals[0]?.timeSlot || '2025-09-20 14:00-15:00'}<br/>
                            👤 {reservation.aiAnalysis.proposals[0]?.interviewer || '田中部長（人事部）'}
                          </div>
                          <div className="text-xs text-purple-600 mt-1">
                            {reservation.aiAnalysis.proposals[0]?.reasoning || '専門分野が一致し、最適な時間帯です。'}
                          </div>
                        </div>
                      )}

                      {/* VoiceDrive送信状況 */}
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mb-3">
                        <h5 className="font-medium text-sm text-blue-900 mb-2">📱 VoiceDrive送信状況</h5>
                        <div className="text-sm text-blue-700 mb-2">
                          送信日: {new Date(reservation.lastSentAt || reservation.receivedAt).toLocaleDateString()}
                          <span className="ml-2 text-blue-600">({daysSinceSubmission}日経過)</span>
                        </div>

                        {/* プログレスバー */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{width: `${progressPercentage}%`}}
                          />
                        </div>
                        <div className="text-xs text-gray-600 text-center">
                          職員側での確認・検討期間
                        </div>
                      </div>

                      {/* 待機状態表示 */}
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                        <div className="flex items-center justify-center gap-2 text-yellow-700 mb-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
                          <span className="text-sm font-medium">職員からの回答待ち...</span>
                        </div>
                        <div className="text-xs text-center text-yellow-600">
                          VoiceDriveアプリで承認処理中
                        </div>
                      </div>

                      {/* 新しいワークフローボタン */}
                      <div className="mt-3 flex gap-2">
                        {needsReproposal ? (
                          // 再提案が必要な場合
                          <Button
                            size="sm"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleReproposal(reservation)}
                          >
                            🔄 再提案
                          </Button>
                        ) : isApprovalReceived ? (
                          // VoiceDrive承認済み、人事確認待ち
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleHumanConfirmation(reservation)}
                          >
                            ✅ 確認・移行
                          </Button>
                        ) : (
                          // 承認待ち中（VoiceDrive側で検討中）
                          <div className="flex-1 text-center text-gray-500 text-sm py-2 border border-gray-200 rounded">
                            VoiceDrive側で検討中...
                          </div>
                        )}
                      </div>

                      {/* 開発用シミュレーション */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="mt-3 border-2 border-dashed border-gray-300 p-2 rounded">
                          <div className="text-xs text-gray-500 text-center mb-2">
                            🛠️ 開発用シミュレーション
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() => handleVoiceDriveApproval(reservation)}
                            >
                              ✅ 承認テスト
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() => onStatusChange(reservation, 'pending')}
                            >
                              ❌ 拒否テスト
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      </CardContent>

      {/* 処理モーダル */}
      <ReservationProcessingModal
        isOpen={showProcessingModal}
        onClose={() => setShowProcessingModal(false)}
        reservation={selectedReservation}
        onStatusChange={(reservation, newStatus) => {
          // 親コンポーネントに通知
          console.log('ステータス変更:', reservation, newStatus);
          setShowProcessingModal(false);
          onStatusChange(reservation, newStatus);
          if (newStatus === 'confirmed') {
            onConfirmed([reservation]);
          }
        }}
      />

      {/* 最終確認モーダル */}
      <FinalConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        reservation={selectedReservation}
        onConfirm={(reservation, confirmedBy) => {
          const updatedReservation = {
            ...reservation,
            workflowStage: 'confirmed' as const,
            confirmedBy,
            confirmedAt: new Date(),
            humanConfirmationRequired: false
          };
          setShowConfirmationModal(false);
          onStatusChange(updatedReservation, 'confirmed');
          onConfirmed([updatedReservation]);
        }}
      />
    </Card>
  );
}

// 右側セクション: 面談実施
interface InterviewExecutionSectionProps {
  todayReservations: UnifiedInterviewReservation[];
  loading: boolean;
  onStartInterview: (reservation: UnifiedInterviewReservation) => void;
}

function InterviewExecutionSection({ todayReservations, loading, onStartInterview }: InterviewExecutionSectionProps) {
  const getInterviewTypeLabel = (reservation: UnifiedInterviewReservation) => {
    if (reservation.type === 'regular') {
      switch (reservation.regularType) {
        case 'new_employee': return '新入職員月次面談';
        case 'annual': return '年次面談';
        case 'management': return '管理職面談';
        default: return '定期面談';
      }
    } else if (reservation.type === 'special') {
      switch (reservation.specialType) {
        case 'exit': return '退職面談';
        case 'transfer': return '異動面談';
        case 'return': return '復職面談';
        case 'promotion': return '昇進面談';
        case 'disciplinary': return '懲戒面談';
        default: return '特別面談';
      }
    } else {
      return `サポート面談 - ${reservation.supportCategory || ''}`;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      in_progress: 'destructive',
      completed: 'outline',
      cancelled: 'outline'
    };

    const labels: Record<string, string> = {
      pending: '承認待ち',
      confirmed: '確定',
      in_progress: '実施中',
      completed: '完了',
      cancelled: 'キャンセル'
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null;

    const colors: Record<string, string> = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${colors[urgency]}`}>
        {urgency === 'urgent' ? '緊急' : urgency === 'high' ? '高' : urgency === 'medium' ? '中' : '低'}
      </span>
    );
  };

  return (
    <Card className="border-2 border-green-200 h-full">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-600" />
            🎯 面談実施管理 - 本日の予定
          </span>
          <Badge variant="default" className="text-lg px-3 py-1 bg-green-600">
            {todayReservations.length} 件
          </Badge>
        </CardTitle>
        <div className="text-xs text-center text-gray-600 mt-1">
          VoiceDrive承認済み予約 + 既存面談予定を表示
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">読み込み中...</div>
        ) : todayReservations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">本日の面談予定はありません</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {todayReservations.map(reservation => (
              <div key={reservation.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition-all bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* 時刻を大きく表示 */}
                      <div className="bg-green-100 rounded-lg px-3 py-2 text-center">
                        <div className="text-2xl font-bold text-green-700">{reservation.scheduledTime}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-bold text-lg">{reservation.staffName}</div>
                          <Badge variant="outline">{getInterviewTypeLabel(reservation)}</Badge>
                          {getUrgencyBadge(reservation.urgency)}
                          {getStatusBadge(reservation.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {reservation.department} / {reservation.position}
                        </div>
                        {reservation.supportTopic && (
                          <div className="mt-2 bg-gray-50 rounded p-2">
                            <span className="font-medium text-sm">相談内容:</span>
                            <p className="text-sm text-gray-700 mt-1">{reservation.supportTopic}</p>
                          </div>
                        )}
                        {reservation.notes && (
                          <div className="mt-2 text-sm text-gray-600 italic">
                            📝 {reservation.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onStartInterview(reservation)}
                    disabled={reservation.status !== 'confirmed'}
                    className="ml-4 bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    面談開始
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// AI最適化処理モーダル - 3段階プロセス
interface ReservationProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ProvisionalReservation | null;
  onStatusChange: (reservation: ProvisionalReservation, newStatus: ReservationStatus) => void;
}

function ReservationProcessingModal({ isOpen, onClose, reservation, onStatusChange }: ReservationProcessingModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [aiProposals, setAiProposals] = useState<AIProposals | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<1 | 2 | 3>(1);
  const [editedProposal, setEditedProposal] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !reservation) return null;

  // Step 1: AI分析実行 - 実際の担当者データを使用
  const executeAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const stages = [
      { stage: '職員データ分析中...', progress: 15 },
      { stage: '面談履歴を確認中...', progress: 30 },
      { stage: '担当者スケジュール確認中...', progress: 45 },
      { stage: '担当者専門分野マッチング中...', progress: 60 },
      { stage: 'AI推薦案生成中...', progress: 80 },
      { stage: '最終調整中...', progress: 100 }
    ];

    for (const { stage, progress } of stages) {
      setAnalysisStage(stage);
      setAnalysisProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 700));
    }

    // 実際の担当者データを使用したAI分析結果生成
    const realInterviewerProposals = generateRealInterviewerProposals(reservation);

    setAiProposals(realInterviewerProposals);
    setSelectedProposal(realInterviewerProposals.recommendedChoice);
    setIsAnalyzing(false);
    setCurrentStep(2);
  };

  // 実際の担当者データに基づくAI提案生成
  const generateRealInterviewerProposals = (reservation: ProvisionalReservation): AIProposals => {
    // 実際の担当者管理データ（InterviewerManagementから取得想定）
    const realInterviewers = [
      {
        id: 'INT-001',
        name: '田中美香子',
        title: '看護師長',
        department: 'キャリア支援室',
        specialties: ['キャリア相談', '職場環境改善', 'メンタルヘルス'],
        experienceYears: 15,
        workingDays: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true },
        dailySchedule: {
          monday: { isAvailable: true, timeSlots: ['9:00-10:00', '14:00-15:00', '16:00-17:00'] },
          tuesday: { isAvailable: true, timeSlots: ['10:00-11:00', '14:30-15:30'] },
          wednesday: { isAvailable: true, timeSlots: ['9:00-10:00', '13:00-14:00', '15:00-16:00'] }
        },
        workloadAnalysis: { currentWeekLoad: 65, maxCapacity: 100, efficiency: 88, nextAvailableSlot: '2025-09-20 14:00' }
      },
      {
        id: 'INT-002',
        name: '佐藤健一',
        title: '人事課長',
        department: '人事部',
        specialties: ['人事評価', '労務管理', '昇進・異動相談'],
        experienceYears: 12,
        workingDays: { monday: true, tuesday: true, wednesday: false, thursday: true, friday: true },
        dailySchedule: {
          monday: { isAvailable: true, timeSlots: ['9:30-10:30', '15:00-16:00'] },
          tuesday: { isAvailable: true, timeSlots: ['10:30-11:30', '14:00-15:00'] },
          thursday: { isAvailable: true, timeSlots: ['9:00-10:00', '13:30-14:30'] }
        },
        workloadAnalysis: { currentWeekLoad: 80, maxCapacity: 100, efficiency: 92, nextAvailableSlot: '2025-09-21 10:30' }
      },
      {
        id: 'INT-003',
        name: '山田雅子',
        title: '主任医療社会事業専門員',
        department: '医療社会事業部',
        specialties: ['職場復帰支援', '福利厚生相談', 'ワークライフバランス'],
        experienceYears: 8,
        workingDays: { monday: true, tuesday: true, wednesday: true, thursday: false, friday: true },
        dailySchedule: {
          monday: { isAvailable: true, timeSlots: ['10:00-11:00', '16:00-17:00'] },
          tuesday: { isAvailable: true, timeSlots: ['9:00-10:00', '14:00-15:00', '15:30-16:30'] },
          friday: { isAvailable: true, timeSlots: ['10:30-11:30', '13:00-14:00'] }
        },
        workloadAnalysis: { currentWeekLoad: 45, maxCapacity: 80, efficiency: 95, nextAvailableSlot: '2025-09-19 16:00' }
      }
    ];

    // 面談タイプと職員情報に基づくマッチング分析
    const matchingResults = realInterviewers.map(interviewer => {
      let baseScore = 70;
      let reasoning = '';

      // 専門分野マッチング
      const interviewTypeMapping: Record<string, string[]> = {
        'support': ['キャリア相談', '職場環境改善', 'メンタルヘルス'],
        'regular': ['人事評価', '労務管理'],
        'special': ['職場復帰支援', '福利厚生相談']
      };

      const relevantSpecialties = interviewTypeMapping[reservation.interviewType] || [];
      const matchingSpecialties = interviewer.specialties.filter(spec =>
        relevantSpecialties.some(rel => spec.includes(rel) || rel.includes(spec))
      );

      if (matchingSpecialties.length > 0) {
        baseScore += 15;
        reasoning += `専門分野「${matchingSpecialties.join('、')}」が面談内容と合致。`;
      }

      // 部署関連性
      if (reservation.department.includes('看護') && interviewer.department.includes('キャリア')) {
        baseScore += 10;
        reasoning += '看護部門の職員サポート経験豊富。';
      }
      if (reservation.interviewType === 'regular' && interviewer.department === '人事部') {
        baseScore += 12;
        reasoning += '人事部所属で定期面談の実施経験多数。';
      }

      // ワークロード分析
      if (interviewer.workloadAnalysis.currentWeekLoad < 60) {
        baseScore += 8;
        reasoning += '現在の業務負荷が軽く、十分な面談時間を確保可能。';
      } else if (interviewer.workloadAnalysis.currentWeekLoad > 85) {
        baseScore -= 5;
        reasoning += '業務負荷が高いが、効率性でカバー。';
      }

      // 効率性評価
      if (interviewer.workloadAnalysis.efficiency > 90) {
        baseScore += 5;
        reasoning += `業務効率性${interviewer.workloadAnalysis.efficiency}%で高品質な面談が期待。`;
      }

      // 経験年数
      if (interviewer.experienceYears >= 10) {
        baseScore += 3;
        reasoning += `${interviewer.experienceYears}年の豊富な経験。`;
      }

      // 緊急度に応じた対応可能性
      if (reservation.urgency === 'high' || reservation.urgency === 'urgent') {
        const nextSlot = new Date(interviewer.workloadAnalysis.nextAvailableSlot);
        const today = new Date();
        const daysUntilAvailable = Math.ceil((nextSlot.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilAvailable <= 1) {
          baseScore += 10;
          reasoning += '緊急対応可能なスケジュール。';
        } else if (daysUntilAvailable <= 3) {
          baseScore += 5;
          reasoning += '近日中の対応が可能。';
        }
      }

      return {
        interviewer,
        score: Math.min(baseScore, 98), // 最大スコア98%
        reasoning: reasoning || '一般的な面談対応が可能。'
      };
    });

    // スコア順でソート
    matchingResults.sort((a, b) => b.score - a.score);

    // 上位3つの提案を生成
    const proposals = matchingResults.slice(0, 3).map((result, index) => ({
      rank: (index + 1) as 1 | 2 | 3,
      interviewer: `${result.interviewer.name}（${result.interviewer.title}）`,
      timeSlot: result.interviewer.workloadAnalysis.nextAvailableSlot.replace('2025-09-', '9月').replace(' ', ' ') + '-' +
                (parseInt(result.interviewer.workloadAnalysis.nextAvailableSlot.split(' ')[1].split(':')[0]) + 1) + ':' +
                result.interviewer.workloadAnalysis.nextAvailableSlot.split(':')[1],
      matchingScore: result.score,
      reasoning: `${result.reasoning} ${result.interviewer.department}所属で、現在の業務負荷は${result.interviewer.workloadAnalysis.currentWeekLoad}%。`
    }));

    return {
      proposals,
      recommendedChoice: 1
    };
  };

  // Step 2: 提案内容編集
  const initializeEditedProposal = () => {
    if (aiProposals && !editedProposal) {
      const selected = aiProposals.proposals.find(p => p.rank === selectedProposal);
      setEditedProposal({
        interviewer: selected?.interviewer || '',
        timeSlot: selected?.timeSlot || '',
        reasoning: selected?.reasoning || ''
      });
    }
  };

  // Step 3: VoiceDrive送信
  const sendToVoiceDrive = async () => {
    setIsSending(true);

    // 送信シミュレーション
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ステータス更新
    onStatusChange(reservation, 'awaiting');
    setIsSending(false);
    onClose();

    // 成功通知
    alert('VoiceDriveに送信完了しました！職員からの返答をお待ちください。');
  };

  // ステップごとのレンダリング
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">AI最適化分析</h3>
        <p className="text-gray-600">職員情報とスケジュールを分析し、最適な面談提案を生成します</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">分析対象</h4>
        <div className="space-y-2">
          <div><span className="font-medium">職員:</span> {reservation.staffName}</div>
          <div><span className="font-medium">部署:</span> {reservation.department}</div>
          <div><span className="font-medium">面談タイプ:</span> {
            reservation.interviewType === 'regular' ? '定期面談' :
            reservation.interviewType === 'special' ? '特別面談' : 'サポート面談'
          }</div>
          <div><span className="font-medium">希望日時:</span> {reservation.preferredDates.join(', ')}</div>
        </div>
      </div>

      {!isAnalyzing ? (
        <Button
          onClick={executeAIAnalysis}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
        >
          🤖 AI分析を開始
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-purple-600 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
              <span className="font-medium">{analysisStage}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            {analysisProgress}% 完了
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => {
    initializeEditedProposal();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">提案内容の確認・編集</h3>
          <p className="text-gray-600">AI生成された提案を確認し、必要に応じて編集してください</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">AI推薦案選択</label>
            <div className="space-y-3">
              {aiProposals?.proposals.map((proposal) => (
                <div
                  key={proposal.rank}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedProposal === proposal.rank
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProposal(proposal.rank)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">案{proposal.rank}: {proposal.interviewer}</span>
                    <Badge variant={proposal.rank === 1 ? 'default' : 'secondary'}>
                      適合度 {proposal.matchingScore}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{proposal.timeSlot}</div>
                  <div className="text-xs text-gray-500">{proposal.reasoning}</div>
                </div>
              ))}
            </div>
          </div>

          {editedProposal && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">面談者</label>
                <Input
                  value={editedProposal.interviewer}
                  onChange={(e) => setEditedProposal({...editedProposal, interviewer: e.target.value})}
                  placeholder="面談者名を入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">日時</label>
                <Input
                  value={editedProposal.timeSlot}
                  onChange={(e) => setEditedProposal({...editedProposal, timeSlot: e.target.value})}
                  placeholder="日時を入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">面談理由・内容</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={4}
                  value={editedProposal.reasoning}
                  onChange={(e) => setEditedProposal({...editedProposal, reasoning: e.target.value})}
                  placeholder="面談の理由や期待する内容を入力"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(1)}
            className="flex-1"
          >
            ← 戻る
          </Button>
          <Button
            onClick={() => setCurrentStep(3)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            VoiceDrive送信へ →
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">VoiceDrive送信</h3>
        <p className="text-gray-600">面談提案をVoiceDriveで職員に送信します</p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-3">送信内容プレビュー</h4>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">宛先:</span> {reservation.staffName}</div>
          <div><span className="font-medium">面談者:</span> {editedProposal?.interviewer}</div>
          <div><span className="font-medium">提案日時:</span> {editedProposal?.timeSlot}</div>
          <div><span className="font-medium">面談内容:</span></div>
          <div className="bg-white p-2 rounded border text-xs">
            {editedProposal?.reasoning}
          </div>
        </div>
      </div>

      {!isSending ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(2)}
            className="flex-1"
          >
            ← 編集に戻る
          </Button>
          <Button
            onClick={sendToVoiceDrive}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            📤 VoiceDriveで送信
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-blue-600 mb-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="font-medium">VoiceDriveに送信中...</span>
          </div>
          <p className="text-sm text-gray-600">送信完了まで少々お待ちください</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">AI最適化処理 - {reservation.staffName}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* プロセス進捗表示 */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-600 mb-6">
          Step {currentStep}: {
            currentStep === 1 ? 'AI分析実行' :
            currentStep === 2 ? '提案内容編集' : 'VoiceDrive送信'
          }
        </div>

        {/* ステップ別コンテンツ */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
}

// 統合ワークフロー表示コンポーネント
interface IntegratedWorkflowDisplayProps {
  selectedStage: 'booking' | 'management' | 'execution' | 'feedback' | null;
  provisionalReservations: ProvisionalReservation[];
  todayReservations: UnifiedInterviewReservation[];
  reservations: UnifiedInterviewReservation[];
  onStageChange: (stage: 'booking' | 'management' | 'execution' | 'feedback' | null) => void;
  onStartInterview: (reservation: UnifiedInterviewReservation) => void;
}

function IntegratedWorkflowDisplay({
  selectedStage,
  provisionalReservations,
  todayReservations,
  reservations,
  onStageChange,
  onStartInterview
}: IntegratedWorkflowDisplayProps) {
  if (!selectedStage) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium">業務ステージを選択してください</p>
        <p className="text-sm">上部のカードをクリックすると対応する詳細が表示されます</p>
      </div>
    );
  }

  const renderBookingStage = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900">予約受付 - 手動予約履歴</h3>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800">最近の手動予約追加履歴がここに表示されます。</p>
        <div className="mt-3 space-y-2">
          <div className="text-sm text-green-700">• 電話予約: 3件</div>
          <div className="text-sm text-green-700">• 対面予約: 2件</div>
          <div className="text-sm text-green-700">• 直接入力: 1件</div>
        </div>
      </div>
    </div>
  );

  const renderManagementStage = () => {
    const initialReservations = provisionalReservations.filter(r => r.workflowStage === 'initial');
    const awaitingApprovalReservations = provisionalReservations.filter(r => r.workflowStage === 'awaiting_approval');

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">予約管理 - 新ワークフロー表示</h3>
        </div>

        {/* 仮予約セクション */}
        <div>
          <h4 className="text-md font-semibold text-blue-800 mb-3">🟡 仮予約 ({initialReservations.length}件)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialReservations.map(reservation => (
              <Card key={reservation.id} className="border-2 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{reservation.staffName}</span>
                    <Badge variant={reservation.urgency === 'urgent' ? 'destructive' : 'outline'}>
                      {reservation.urgency === 'urgent' ? '🚨 緊急' : '📋 通常'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{reservation.department} / {reservation.position}</p>
                  <p className="text-xs text-blue-700 mb-3">{reservation.notes}</p>
                  <Button size="sm" className="w-full">詳細処理</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 承認待ちセクション */}
        <div>
          <h4 className="text-md font-semibold text-yellow-800 mb-3">🔵 承認待ち ({awaitingApprovalReservations.length}件)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {awaitingApprovalReservations.map(reservation => (
              <Card key={reservation.id} className={`border-2 ${
                reservation.needsReproposal ? 'border-red-200 bg-red-50/20' :
                reservation.voicedriveApprovalReceived ? 'border-green-200 bg-green-50/20' : 'border-yellow-200 bg-yellow-50/20'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{reservation.staffName}</span>
                    <div className="flex gap-1">
                      <Badge variant={reservation.urgency === 'urgent' ? 'destructive' : 'outline'}>
                        {reservation.urgency === 'urgent' ? '🚨 緊急' : '📋 通常'}
                      </Badge>
                      {reservation.voicedriveApprovalReceived && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">✅ 承認済み</Badge>
                      )}
                      {reservation.needsReproposal && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">🔄 再提案要</Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{reservation.department} / {reservation.position}</p>
                  <p className="text-xs text-gray-700 mb-3">{reservation.notes}</p>
                  <div className="flex gap-2">
                    {reservation.needsReproposal ? (
                      <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white">🔄 再提案</Button>
                    ) : reservation.voicedriveApprovalReceived ? (
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">✅ 確認・移行</Button>
                    ) : (
                      <div className="flex-1 text-center text-gray-500 text-sm py-1">VoiceDrive側で検討中...</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderExecutionStage = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Play className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-orange-900">面談実施 - 本日のスケジュール</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {todayReservations.map(reservation => (
          <Card key={reservation.id} className="border-2 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{reservation.staffName}</span>
                <span className="text-sm text-orange-600">{reservation.scheduledTime}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{reservation.department}</p>
              <p className="text-xs text-orange-700 mb-3">
                {reservation.type === 'regular' ? '定期面談' :
                 reservation.type === 'special' ? '特別面談' : 'サポート面談'}
              </p>
              <Button
                size="sm"
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => onStartInterview(reservation)}
              >
                面談開始
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFeedbackStage = () => {
    const completedReservations = reservations.filter(r => r.status === 'completed');
    const pendingFeedback = completedReservations.filter(r => Math.random() > 0.7); // Mock: 30%がフィードバック未完了

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-900">フィードバック管理 - 未完了職員リスト</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingFeedback.map(reservation => (
            <Card key={reservation.id} className="border-2 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{reservation.staffName}</span>
                  <Badge variant="outline" className="text-purple-600">未完了</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{reservation.department}</p>
                <p className="text-xs text-purple-700 mb-3">
                  実施日: {reservation.conductedAt?.toLocaleDateString() || reservation.scheduledDate.toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                    職員カルテへ
                  </Button>
                  <Button size="sm" variant="outline">
                    フィードバック送信
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {selectedStage === 'booking' && renderBookingStage()}
      {selectedStage === 'management' && renderManagementStage()}
      {selectedStage === 'execution' && renderExecutionStage()}
      {selectedStage === 'feedback' && renderFeedbackStage()}
    </div>
  );
}

// 統合カレンダービューコンポーネント
interface IntegratedCalendarViewProps {
  reservations: UnifiedInterviewReservation[];
  provisionalReservations: ProvisionalReservation[];
  patternDReservations: EnhancedInterviewReservation[];
  onEventClick: (event: any) => void;
}

function IntegratedCalendarView({
  reservations,
  provisionalReservations,
  patternDReservations,
  onEventClick
}: IntegratedCalendarViewProps) {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  // カレンダーイベントデータ統合
  const getAllEvents = () => {
    const events = [];

    // 確定済み面談
    reservations.forEach(r => {
      events.push({
        id: r.id,
        title: `${r.staffName} (${r.type === 'regular' ? '定期' : r.type === 'special' ? '特別' : 'サポート'})`,
        start: new Date(`${r.scheduledDate.toISOString().split('T')[0]}T${r.scheduledTime}`),
        type: 'confirmed',
        status: r.status,
        color: r.status === 'completed' ? '#10B981' : '#3B82F6'
      });
    });

    // 仮予約
    provisionalReservations.forEach(r => {
      if (r.status === 'pending' || r.status === 'awaiting') {
        events.push({
          id: `prov-${r.id}`,
          title: `${r.staffName} (仮予約)`,
          start: r.preferredDates[0] ? new Date(r.preferredDates[0]) : new Date(),
          type: 'provisional',
          status: r.status,
          color: r.urgency === 'urgent' ? '#EF4444' : '#F59E0B'
        });
      }
    });

    return events;
  };

  const events = getAllEvents();

  const renderWeekView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">週表示</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}>
            前週
          </Button>
          <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date())}>
            今週
          </Button>
          <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}>
            翌週
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['月', '火', '水', '木', '金', '土', '日'].map((day, index) => (
          <div key={day} className="border rounded-lg p-2 min-h-[120px]">
            <div className="font-medium text-center mb-2">{day}</div>
            <div className="space-y-1">
              {events.filter(event => {
                const eventDate = new Date(event.start);
                const dayOfWeek = eventDate.getDay();
                const targetDayOfWeek = index === 6 ? 0 : index + 1; // 日曜日を0にする
                return dayOfWeek === targetDayOfWeek;
              }).map(event => (
                <div
                  key={event.id}
                  className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: event.color, color: 'white' }}
                  onClick={() => onEventClick(event)}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{currentDate.getFullYear()}年{currentDate.getMonth() + 1}月</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
            前月
          </Button>
          <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date())}>
            今月
          </Button>
          <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
            翌月
          </Button>
        </div>
      </div>

      <div className="text-center text-gray-600">
        <Calendar className="h-16 w-16 mx-auto mb-2" />
        <p>月表示カレンダーは開発中です</p>
        <p className="text-sm">確定予約: {events.filter(e => e.type === 'confirmed').length}件</p>
        <p className="text-sm">仮予約: {events.filter(e => e.type === 'provisional').length}件</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* カレンダー表示切り替え */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === 'week' ? 'default' : 'outline'}
            onClick={() => setViewMode('week')}
          >
            週表示
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'month' ? 'default' : 'outline'}
            onClick={() => setViewMode('month')}
          >
            月表示
          </Button>
        </div>

        {/* 凡例 */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>確定予約</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>完了</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>仮予約</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>緊急</span>
          </div>
        </div>
      </div>

      {/* カレンダー表示 */}
      {viewMode === 'week' ? renderWeekView() : renderMonthView()}
    </div>
  );
}

// 最終確認モーダル - VoiceDrive通知機能付き
interface FinalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ProvisionalReservation | null;
  onConfirm: (reservation: ProvisionalReservation, confirmedBy: string) => void;
}

function FinalConfirmationModal({ isOpen, onClose, reservation, onConfirm }: FinalConfirmationModalProps) {
  const [confirmedBy, setConfirmedBy] = useState('');
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationStep, setNotificationStep] = useState<'confirm' | 'notifying' | 'completed'>('confirm');

  useEffect(() => {
    if (isOpen) {
      setConfirmedBy('');
      setNotificationStep('confirm');
      setIsNotifying(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!reservation || !confirmedBy.trim()) {
      alert('承認者名を入力してください。');
      return;
    }

    setNotificationStep('notifying');
    setIsNotifying(true);

    try {
      // VoiceDrive通知シミュレーション
      await simulateVoiceDriveNotification(reservation);

      setNotificationStep('completed');

      // 2秒後に確定処理実行
      setTimeout(() => {
        onConfirm(reservation, confirmedBy.trim());
      }, 2000);

    } catch (error) {
      console.error('VoiceDrive通知エラー:', error);
      alert('VoiceDriveへの通知に失敗しました。再度お試しください。');
      setNotificationStep('confirm');
      setIsNotifying(false);
    }
  };

  const simulateVoiceDriveNotification = async (reservation: ProvisionalReservation) => {
    // VoiceDrive API通知のシミュレーション
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('VoiceDrive面談確定通知送信:', {
          staffId: reservation.staffId,
          staffName: reservation.staffName,
          interviewDate: reservation.scheduledDate,
          interviewTime: reservation.scheduledTime,
          interviewer: reservation.interviewerInfo,
          confirmedBy: confirmedBy,
          confirmedAt: new Date().toISOString(),
          notificationType: 'interview_confirmed'
        });
        resolve(true);
      }, 3000); // 3秒間の送信シミュレーション
    });
  };

  if (!isOpen || !reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {notificationStep === 'confirm' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {notificationStep === 'notifying' && <Clock className="h-5 w-5 text-blue-600 animate-spin" />}
            {notificationStep === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
            面談予約 最終確認・VoiceDrive通知
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {notificationStep === 'confirm' && (
            <>
              {/* 予約詳細確認 */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">📋 予約詳細確認</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>職員:</strong> {reservation.staffName} ({reservation.department})</div>
                  <div><strong>希望日程:</strong> {reservation.preferredDates?.map(date => date.toLocaleDateString()).join(', ') || '未設定'}</div>
                  <div><strong>面談種類:</strong> {reservation.interviewType === 'regular' ? '定期面談' : reservation.interviewType === 'special' ? '特別面談' : 'サポート面談'}</div>
                  <div><strong>緊急度:</strong> {
                    reservation.urgency === 'urgent' ? '緊急' :
                    reservation.urgency === 'high' ? '高' :
                    reservation.urgency === 'medium' ? '中' : '低'
                  }</div>
                  <div><strong>申込元:</strong> {reservation.source === 'voicedrive' ? 'VoiceDrive' : '手動'}</div>
                  {reservation.notes && <div><strong>備考:</strong> {reservation.notes}</div>}
                </div>
              </div>

              {/* 承認者入力 */}
              <div className="space-y-3">
                <label className="block">
                  <span className="font-semibold text-gray-700">承認者名 <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    value={confirmedBy}
                    onChange={(e) => setConfirmedBy(e.target.value)}
                    placeholder="承認者名を入力してください"
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>
                <p className="text-xs text-gray-600">
                  ※ この情報は面談記録に保存され、VoiceDriveにも通知されます
                </p>
              </div>

              {/* 注意事項 */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 確認事項</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• この操作により面談予約が正式に確定されます</li>
                  <li>• VoiceDriveアプリに確定通知が送信されます</li>
                  <li>• 職員には面談詳細がプッシュ通知で届きます</li>
                  <li>• 確定後のキャンセルは担当者に直接連絡が必要です</li>
                </ul>
              </div>
            </>
          )}

          {notificationStep === 'notifying' && (
            <div className="text-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">VoiceDriveに通知中...</h3>
                <p className="text-gray-600">面談確定情報を職員のアプリに送信しています</p>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <Clock className="h-4 w-4" />
                    通知送信中 - しばらくお待ちください
                  </div>
                </div>
              </div>
            </div>
          )}

          {notificationStep === 'completed' && (
            <div className="text-center py-8 space-y-4">
              <div className="rounded-full h-16 w-16 bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-green-800">通知完了！</h3>
                <p className="text-gray-600">VoiceDriveへの通知が完了しました</p>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                  <div className="text-green-700">
                    ✅ 職員への確定通知送信完了<br />
                    ✅ 面談予約が正式確定されました
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {notificationStep === 'confirm' && (
            <>
              <Button variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!confirmedBy.trim() || isNotifying}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                確定・通知送信
              </Button>
            </>
          )}

          {notificationStep === 'notifying' && (
            <Button disabled className="bg-blue-600 text-white">
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              通知送信中...
            </Button>
          )}

          {notificationStep === 'completed' && (
            <Button disabled className="bg-green-600 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              完了
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}