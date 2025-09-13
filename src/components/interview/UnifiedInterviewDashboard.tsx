'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, AlertTriangle, CheckCircle,
  ChevronRight, Play, FileText, Users,
  Filter, Search, RefreshCw, Bell, Plus, FilterX, ArrowLeft, CalendarDays,
  Settings, BarChart3, Brain, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceDriveIntegrationService } from '@/services/voicedriveIntegrationService';
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

  useEffect(() => {
    loadReservations();
    loadPatternDReservations();
  }, [selectedDate]);

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
    return reservations.filter(r => {
      const rDate = new Date(r.scheduledDate);
      return rDate.toDateString() === today.toDateString();
    });
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
        <div>
        {/* 本日の面談予定 */}
        <div>
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <span className="text-blue-900">本日の面談予定</span>
                </span>
                <Badge variant="default" className="text-lg px-3 py-1 bg-blue-600">
                  {todayReservations.length} 件
                </Badge>
              </CardTitle>
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
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {todayReservations.map(reservation => (
                <div key={reservation.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* 時刻を大きく表示 */}
                        <div className="bg-blue-100 rounded-lg px-3 py-2 text-center">
                          <div className="text-2xl font-bold text-blue-700">{reservation.scheduledTime}</div>
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
                      onClick={() => handleStartInterview(reservation)}
                      disabled={reservation.status !== 'confirmed'}
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
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
    </div>
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