'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, AlertTriangle, CheckCircle,
  ChevronRight, Play, FileText, Users,
  Filter, Search, RefreshCw, Bell, Plus, FilterX, ArrowLeft, CalendarDays,
  Settings, BarChart3, Brain, Zap, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
          status: 'confirmed', // 確定済みとして右側に表示
          receivedAt: new Date('2025-09-15'),
          notes: 'キャリア相談を希望',
          adjustmentCount: 1
        },
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
          adjustmentCount: 0
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
      .filter(r => r.status === 'confirmed') // VoiceDriveで承認済み
      .map(convertProvisionalToUnified);

    return [...existingReservations, ...voiceDriveApprovedReservations];
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
      {/* Pattern D統合タブナビゲーション */}
      <Tabs value={activeMainTab} onValueChange={(v) => setActiveMainTab(v as any)}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-auto grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              面談ダッシュボード
            </TabsTrigger>
            <TabsTrigger value="interviewer-management" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              担当者管理
            </TabsTrigger>
            <TabsTrigger value="pattern-d-analytics" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI最適化分析
            </TabsTrigger>
          </TabsList>
        </div>

        {/* メインダッシュボードタブ */}
        <TabsContent value="dashboard" className="space-y-6">
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
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-500 text-white rounded-full p-3">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">① 予約受付</h3>
              <p className="text-sm text-green-700">電話・対面・VoiceDrive</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)} 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            手動で予約を追加
          </Button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-500 text-white rounded-full p-3">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900">② 予約管理</h3>
              <p className="text-sm text-blue-700">確認・調整・承認</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600 text-center">
            {reservations.filter(r => r.status === 'pending').length}件
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all">
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

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-500 text-white rounded-full p-3">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900">④ 記録・分析</h3>
              <p className="text-sm text-purple-700">結果記録・統計</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 text-center">
            {reservations.filter(r => r.status === 'completed').length}件完了
          </div>
        </div>
      </div>

      {/* 検索・フィルター */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              検索・フィルター
            </span>
            {isSearchMode && (
              <Button variant="outline" size="sm" onClick={handleClearSearch}>
                <FilterX className="h-4 w-4 mr-2" />
                検索クリア
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* 検索バー */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="職員名、部署、面談内容で検索..."
                  value={searchTerm}
                  onChange={(e) => handleQuickSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedSearch(true)}
                className="flex-shrink-0"
              >
                <Filter className="h-4 w-4 mr-2" />
                高度な検索
              </Button>
            </div>

            {/* フィルター */}
            {!isSearchMode && (
              <div className="flex gap-4 items-center">
                <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                  <TabsList>
                    <TabsTrigger value="all">すべて</TabsTrigger>
                    <TabsTrigger value="regular">定期</TabsTrigger>
                    <TabsTrigger value="special">特別</TabsTrigger>
                    <TabsTrigger value="support">サポート</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  variant={showUrgentOnly ? "default" : "outline"}
                  onClick={() => setShowUrgentOnly(!showUrgentOnly)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  緊急のみ
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 強化された未実施面談アラート */}
      <EnhancedOverdueAlert
        overdueInterviews={overdueReservations.map(r => ({
          id: r.id,
          staffName: r.staffName,
          interviewType: getInterviewTypeLabel(r),
          category: r.supportCategory,
          scheduledDate: r.scheduledDate,
          urgency: calculateUrgency(r),
          daysOverdue: Math.ceil((new Date().getTime() - r.scheduledDate.getTime()) / (1000 * 60 * 60 * 24)),
          department: r.department,
          position: r.position || '職員',
          notes: r.notes
        }))}
        onScheduleInterview={(interview) => {
          // 面談予約処理
          const reservation = reservations.find(r => r.id === interview.id);
          if (reservation) {
            handleStartInterview(reservation);
          }
        }}
        onBulkAction={(interviews, action) => {
          console.log('一括処理:', action, interviews);
          // 一括処理のロジックを実装
        }}
        showInCalendarView={showCalendarView}
      />

      {/* 表示切り替えタブ - メインコンテンツ直上 */}
      {!isSearchMode && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setShowCalendarView(false)}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                !showCalendarView
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4" />
              リスト表示
              <Badge variant="outline" className="ml-2">
                {getTodayReservations().length}件
              </Badge>
            </button>
            <button
              onClick={() => setShowCalendarView(true)}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                showCalendarView
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              カレンダー表示
              <Badge variant="outline" className="ml-2">
                月次/週次
              </Badge>
            </button>
          </div>
        </div>
      )}

      {/* メインコンテンツエリア */}
      {isSearchMode ? (
        /* 検索結果表示 */
        <SearchResults
          results={searchResults}
          filters={currentSearchFilters!}
          isLoading={isSearching}
          onResultClick={(reservation) => {
            console.log('検索結果クリック:', reservation);
          }}
          onStartInterview={handleStartInterviewFromSearch}
        />
      ) : showCalendarView ? (
        // カレンダービュー
        <InterviewCalendar 
          interviews={reservations.map(r => ({
            id: r.id,
            date: r.scheduledDate.toISOString().split('T')[0],
            time: r.scheduledTime,
            staffName: r.staffName,
            staffId: r.staffId,
            department: r.department,
            interviewer: r.createdBy || '人事部',
            type: r.type === 'regular' ? 'regular' : 
                  r.type === 'special' ? 'emergency' : 'followup',
            status: r.status === 'pending' ? 'scheduled' :
                   r.status === 'confirmed' ? 'scheduled' :
                   r.status === 'completed' ? 'completed' :
                   r.status === 'cancelled' ? 'cancelled' : 'scheduled',
            duration: r.duration || 30,
            location: '人事部面談室',
            notes: r.notes
          }))}
          onDateSelect={(date) => setSelectedDate(date)}
          onEventClick={(event) => {
            const reservation = reservations.find(r => r.id === event.id);
            if (reservation) {
              handleStartInterview(reservation);
            }
          }}
        />
      ) : (
        /* 左右分割メインコンテンツ */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 👈 左側: 面談予約管理セクション */}
          <ReservationManagementSection
            provisionalReservations={provisionalReservations}
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
      )}
        </TabsContent>

        {/* 担当者管理タブ */}
        <TabsContent value="interviewer-management">
          <InterviewerManagement accessLevel="L8" />
        </TabsContent>

        {/* Pattern D AI最適化分析タブ */}
        <TabsContent value="pattern-d-analytics">
          <PatternDAnalytics
            patternDReservations={patternDReservations}
            onRefresh={loadPatternDReservations}
          />
        </TabsContent>
      </Tabs>

      {/* 手動予約追加モーダル */}
      <ManualReservationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddManualReservation}
      />

      {/* 高度な検索モーダル */}
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
    </div>
  );
}

// 左側セクション: 予約管理
interface ReservationManagementSectionProps {
  provisionalReservations: ProvisionalReservation[];
  onConfirmed: (confirmed: ProvisionalReservation[]) => void;
  onStatusChange: (reservation: ProvisionalReservation, newStatus: ReservationStatus) => void;
}

function ReservationManagementSection({ provisionalReservations, onConfirmed, onStatusChange }: ReservationManagementSectionProps) {
  const [showProcessingModal, setShowProcessingModal] = useState(false);
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
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          🔄 面談予約管理 - VoiceDrive連携
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* 仮予約カラム */}
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900 text-center">
              仮予約 ({provisionalReservations.filter(r => r.status === 'pending').length}件)
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {provisionalReservations
                .filter(r => r.status === 'pending')
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

          {/* 承認待ちカラム */}
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-900 text-center">
              承認待ち ({provisionalReservations.filter(r => r.status === 'awaiting').length}件)
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {provisionalReservations
                .filter(r => r.status === 'awaiting')
                .map(reservation => {
                  const daysSinceSubmission = Math.floor((new Date().getTime() - (reservation.lastSentAt || reservation.receivedAt).getTime()) / (1000 * 60 * 60 * 24));
                  const progressPercentage = Math.min((daysSinceSubmission / 7) * 100, 100); // 7日で100%

                  return (
                    <Card key={reservation.id} className="p-4 border-2 border-yellow-200 bg-yellow-50/50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-yellow-900">{reservation.staffName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                              {reservation.interviewType === 'regular' ? '定期面談' :
                               reservation.interviewType === 'special' ? '特別面談' : 'サポート面談'}
                            </Badge>
                            <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                              調整{reservation.adjustmentCount || 0}回目
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {reservation.department} / {reservation.position}
                          </div>
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

  // Step 1: AI分析実行
  const executeAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const stages = [
      { stage: '職員データ分析中...', progress: 20 },
      { stage: '面談履歴を確認中...', progress: 40 },
      { stage: 'スケジュール最適化中...', progress: 60 },
      { stage: 'AI推薦案生成中...', progress: 80 },
      { stage: '最終調整中...', progress: 100 }
    ];

    for (const { stage, progress } of stages) {
      setAnalysisStage(stage);
      setAnalysisProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // モックAI分析結果生成
    const mockProposals: AIProposals = {
      proposals: [
        {
          rank: 1,
          interviewer: '田中人事部長',
          timeSlot: '2024年3月20日 14:00-15:00',
          matchingScore: 92,
          reasoning: '過去の面談履歴と職員の専門性を考慮し、同部署経験豊富な田中部長が最適。午後の時間帯は職員の集中力が高く、建設的な面談が期待できます。'
        },
        {
          rank: 2,
          interviewer: '佐藤課長',
          timeSlot: '2024年3月21日 10:00-11:00',
          matchingScore: 87,
          reasoning: '職員との年齢が近く、親しみやすい雰囲気で面談を進められます。朝の時間帯は双方とも集中でき、効率的な面談が可能です。'
        },
        {
          rank: 3,
          interviewer: 'AI面談システム',
          timeSlot: '2024年3月19日 16:00-17:00',
          matchingScore: 78,
          reasoning: 'AI面談システムによる客観的な評価。時間的制約がある場合の代替案として有効。データに基づいた公平な面談が実施できます。'
        }
      ],
      recommendedChoice: 1
    };

    setAiProposals(mockProposals);
    setSelectedProposal(mockProposals.recommendedChoice);
    setIsAnalyzing(false);
    setCurrentStep(2);
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