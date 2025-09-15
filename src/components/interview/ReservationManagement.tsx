'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, AlertTriangle, CheckCircle,
  ChevronRight, Play, FileText, Users,
  Filter, Search, RefreshCw, Bell, Plus, FilterX,
  ArrowLeft, CalendarDays, Settings, BarChart3,
  Brain, Zap, Send, Edit, UserPlus, ClockIcon, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 予約ステータス型定義
type ReservationStatus =
  | 'pending'        // 仮予約受信
  | 'analyzing'      // AI分析中
  | 'proposals'      // 3案提示中
  | 'editing'        // 人事編集中
  | 'sent'          // VD送信済み
  | 'awaiting'      // 承認待ち
  | 'confirmed'     // 本予約確定
  | 'rejected';     // 再調整要求

// AI分析結果型定義
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

// 仮予約データの型定義
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
  adjustmentCount?: number;  // 調整回数
  lastSentAt?: Date;        // 最終送信日時
  approvedProposal?: number; // 承認された提案番号(1-3)
}

// 担当者情報の型定義
interface Interviewer {
  id: string;
  name: string;
  title: string;
  department: string;
  specialties: string[];
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  maxInterviewsPerDay: number;
  currentLoad: number;
}

export default function ReservationManagement() {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'interviewer' | 'ai-optimization'>('dashboard');
  const [provisionalReservations, setProvisionalReservations] = useState<ProvisionalReservation[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<ProvisionalReservation | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [showAddInterviewerModal, setShowAddInterviewerModal] = useState(false);
  const [showManualReservationModal, setShowManualReservationModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  useEffect(() => {
    // モックデータの初期化
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 今週の日付を生成
    const getThisWeekDate = (dayOffset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      return date;
    };

    // 仮予約のモックデータ（新仕様）
    const mockProvisional: ProvisionalReservation[] = [
      // pending（仮予約）
      {
        id: 'PROV-REG-001',
        staffId: 'OH-NS-2023-001',
        staffName: '山田 美香',
        department: '内科',
        position: '看護師',
        interviewType: 'regular',
        subType: '新人月次面談',
        preferredDates: [getThisWeekDate(1)],
        urgency: 'medium',
        source: 'voicedrive',
        status: 'pending',
        receivedAt: new Date('2025-09-15T08:00:00'),
        notes: '入職3ヶ月目の定期面談'
      },
      {
        id: 'PROV-REG-002',
        staffId: 'OH-DR-2019-003',
        staffName: '佐藤 太郎',
        department: '外科',
        position: '医師',
        interviewType: 'regular',
        subType: '年次面談',
        preferredDates: [getThisWeekDate(3)],
        urgency: 'medium',
        source: 'voicedrive',
        status: 'analyzing',
        receivedAt: new Date('2025-09-15T10:30:00'),
        aiAnalysis: {
          recommendedInterviewer: '山田部長',
          recommendedTimeSlot: '14:00-15:00',
          matchingScore: 92,
          reasoning: '専門分野が一致し、時間帯も最適です'
        }
      },
      {
        id: 'PROV-REG-003',
        staffId: 'OH-NS-2020-005',
        staffName: '鈴木 一郎',
        department: '整形外科',
        position: '看護師長',
        interviewType: 'regular',
        subType: '管理職半年面談',
        preferredDates: [getThisWeekDate(2)],
        urgency: 'low',
        source: 'manual',
        status: 'pending',
        receivedAt: new Date('2025-09-15T11:00:00')
      },
      {
        id: 'PROV-REG-004',
        staffId: 'OH-PT-2022-002',
        staffName: '高橋 恵子',
        department: 'リハビリテーション',
        position: '理学療法士',
        interviewType: 'regular',
        subType: '年次面談',
        preferredDates: [getThisWeekDate(4)],
        urgency: 'medium',
        source: 'voicedrive',
        status: 'proposed',
        receivedAt: new Date('2025-09-15T09:30:00')
      },
      {
        id: 'PROV-REG-005',
        staffId: 'OH-NS-2023-008',
        staffName: '渡辺 さくら',
        department: '小児科',
        position: '看護師',
        interviewType: 'regular',
        subType: '新人月次面談',
        preferredDates: [getThisWeekDate(5)],
        urgency: 'medium',
        source: 'voicedrive',
        status: 'pending',
        receivedAt: new Date('2025-09-15T13:00:00')
      },

      // サポート面談
      {
        id: 'PROV-SUP-001',
        staffId: 'OH-NS-2021-001',
        staffName: '田中 花子',
        department: '内科',
        position: '看護師',
        interviewType: 'support',
        subType: 'キャリア相談',
        preferredDates: [getThisWeekDate(1)],
        urgency: 'high',
        source: 'voicedrive',
        status: 'pending',
        receivedAt: new Date('2025-09-15T09:00:00'),
        notes: 'キャリアアップについて相談したい'
      },
      {
        id: 'PROV-SUP-002',
        staffId: 'OH-NS-2020-012',
        staffName: '木村 真一',
        department: '外科',
        position: '看護師',
        interviewType: 'support',
        subType: '職場環境相談',
        preferredDates: [getThisWeekDate(2)],
        urgency: 'medium',
        source: 'voicedrive',
        status: 'proposed',
        receivedAt: new Date('2025-09-15T10:00:00')
      },
      {
        id: 'PROV-SUP-003',
        staffId: 'OH-CW-2021-003',
        staffName: '斎藤 由美',
        department: '医事課',
        position: '事務員',
        interviewType: 'support',
        subType: 'フィードバック面談',
        preferredDates: [getThisWeekDate(3)],
        urgency: 'low',
        source: 'manual',
        status: 'pending',
        receivedAt: new Date('2025-09-15T11:30:00')
      },
      {
        id: 'PROV-SUP-004',
        staffId: 'OH-NS-2019-007',
        staffName: '加藤 健太',
        department: 'ICU',
        position: '看護師',
        interviewType: 'support',
        subType: '業務負荷相談',
        preferredDates: [getThisWeekDate(1)],
        urgency: 'high',
        source: 'voicedrive',
        status: 'analyzing',
        receivedAt: new Date('2025-09-15T08:30:00'),
        aiAnalysis: {
          recommendedInterviewer: '鈴木師長',
          recommendedTimeSlot: '15:00-16:00',
          matchingScore: 88,
          reasoning: 'ICU経験があり、業務負荷の理解が深い'
        }
      },
      {
        id: 'PROV-SUP-005',
        staffId: 'OH-DH-2022-001',
        staffName: '中村 優子',
        department: '歯科',
        position: '歯科衛生士',
        interviewType: 'support',
        subType: 'スキルアップ相談',
        preferredDates: [getThisWeekDate(4)],
        urgency: 'medium',
        source: 'voicedrive',
        status: 'pending',
        receivedAt: new Date('2025-09-15T12:00:00')
      },
      {
        id: 'PROV-SUP-006',
        staffId: 'OH-NS-2018-015',
        staffName: '伊藤 明美',
        department: '産婦人科',
        position: '助産師',
        interviewType: 'support',
        subType: 'キャリア相談',
        preferredDates: [getThisWeekDate(2)],
        urgency: 'medium',
        source: 'voicedrive',
        status: 'proposed',
        receivedAt: new Date('2025-09-15T13:30:00')
      },
      {
        id: 'PROV-SUP-007',
        staffId: 'OH-PH-2020-002',
        staffName: '松本 聡',
        department: '薬剤部',
        position: '薬剤師',
        interviewType: 'support',
        subType: '異動相談',
        preferredDates: [getThisWeekDate(5)],
        urgency: 'medium',
        source: 'manual',
        status: 'pending',
        receivedAt: new Date('2025-09-15T14:00:00')
      },
      {
        id: 'PROV-SUP-008',
        staffId: 'OH-RT-2021-001',
        staffName: '青木 涼子',
        department: '放射線科',
        position: '放射線技師',
        interviewType: 'support',
        subType: '資格取得支援',
        preferredDates: [getThisWeekDate(3)],
        urgency: 'low',
        source: 'voicedrive',
        status: 'pending',
        receivedAt: new Date('2025-09-15T14:30:00')
      },

      // 特別面談
      {
        id: 'PROV-SPE-001',
        staffId: 'OH-NS-2019-020',
        staffName: '山口 次郎',
        department: '救急部',
        position: '看護師',
        interviewType: 'special',
        subType: '復職面談',
        preferredDates: [getThisWeekDate(0)],
        urgency: 'urgent',
        source: 'manual',
        status: 'pending',
        receivedAt: new Date('2025-09-15T07:00:00'),
        notes: '3ヶ月の休職から復帰予定'
      },
      {
        id: 'PROV-SPE-002',
        staffId: 'OH-NS-2018-009',
        staffName: '小林 美穂',
        department: '内科',
        position: '看護師',
        interviewType: 'special',
        subType: '退職面談',
        preferredDates: [getThisWeekDate(1)],
        urgency: 'urgent',
        source: 'voicedrive',
        status: 'pending',
        receivedAt: new Date('2025-09-15T08:00:00'),
        notes: '家庭の事情により退職予定'
      },

      // awaiting（承認待ち）
      {
        id: 'AWAIT-001',
        staffId: 'OH-NS-2023-010',
        staffName: '田中 次郎',
        department: '外科',
        position: '看護師',
        interviewType: 'support',
        subType: 'キャリア相談',
        preferredDates: [getThisWeekDate(2)],
        urgency: 'medium',
        source: 'voicedrive',
        status: 'awaiting',
        receivedAt: new Date('2025-09-14T10:00:00'),
        lastSentAt: new Date('2025-09-14T15:00:00'),
        adjustmentCount: 1,
        notes: 'キャリアアップについて相談'
      },
      {
        id: 'AWAIT-002',
        staffId: 'OH-PT-2022-005',
        staffName: '鈴木 花子',
        department: 'リハビリテーション',
        position: '理学療法士',
        interviewType: 'regular',
        subType: '年次面談',
        preferredDates: [getThisWeekDate(3)],
        urgency: 'low',
        source: 'voicedrive',
        status: 'awaiting',
        receivedAt: new Date('2025-09-13T14:00:00'),
        lastSentAt: new Date('2025-09-13T16:00:00'),
        adjustmentCount: 2,
        notes: '2回目の調整'
      },

      // confirmed（確定済み）
      {
        id: 'CONF-001',
        staffId: 'OH-NS-2021-008',
        staffName: '佐々木 美里',
        department: '小児科',
        position: '看護師長',
        interviewType: 'regular',
        subType: '管理職面談',
        preferredDates: [getThisWeekDate(1)],
        urgency: 'medium',
        source: 'voicedrive',
        status: 'confirmed',
        receivedAt: new Date('2025-09-12T09:00:00'),
        lastSentAt: new Date('2025-09-12T11:00:00'),
        adjustmentCount: 1,
        approvedProposal: 1,
        aiAnalysis: {
          proposals: [
            {
              rank: 1,
              interviewer: '看護部長',
              timeSlot: '2025-09-18 14:00-15:00',
              matchingScore: 92,
              reasoning: '管理職同士の対話が最適'
            },
            {
              rank: 2,
              interviewer: '人事部長',
              timeSlot: '2025-09-19 10:00-11:00',
              matchingScore: 85,
              reasoning: 'キャリア全般の相談に適する'
            },
            {
              rank: 3,
              interviewer: '総務課長',
              timeSlot: '2025-09-20 15:00-16:00',
              matchingScore: 78,
              reasoning: '業務調整の観点から助言可能'
            }
          ],
          recommendedChoice: 1
        }
      },
      {
        id: 'CONF-002',
        staffId: 'OH-DR-2020-002',
        staffName: '高橋 俊介',
        department: '整形外科',
        position: '医師',
        interviewType: 'special',
        subType: '昇進面談',
        preferredDates: [getThisWeekDate(0)],
        urgency: 'high',
        source: 'manual',
        status: 'confirmed',
        receivedAt: new Date('2025-09-11T08:00:00'),
        lastSentAt: new Date('2025-09-11T10:00:00'),
        adjustmentCount: 1,
        approvedProposal: 2,
        aiAnalysis: {
          proposals: [
            {
              rank: 1,
              interviewer: '院長',
              timeSlot: '2025-09-17 16:00-17:00',
              matchingScore: 95,
              reasoning: '昇進面談は院長が最適'
            },
            {
              rank: 2,
              interviewer: '副院長',
              timeSlot: '2025-09-18 09:00-10:00',
              matchingScore: 90,
              reasoning: '医師の昇進に関する深い理解'
            },
            {
              rank: 3,
              interviewer: '医局長',
              timeSlot: '2025-09-19 13:00-14:00',
              matchingScore: 88,
              reasoning: '専門科での実績評価が可能'
            }
          ],
          recommendedChoice: 1
        }
      }
    ];

    // 担当者のモックデータ
    const mockInterviewers: Interviewer[] = [
      {
        id: 'INT-001',
        name: '山田 太郎',
        title: '人事部長',
        department: '人事部',
        specialties: ['キャリア支援', '管理職面談'],
        availability: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }
        ],
        maxInterviewsPerDay: 5,
        currentLoad: 3
      },
      {
        id: 'INT-002',
        name: '鈴木 美香',
        title: '看護師長',
        department: 'キャリア支援室',
        specialties: ['看護職支援', '新人指導'],
        availability: [
          { dayOfWeek: 1, startTime: '13:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '13:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '13:00', endTime: '17:00' }
        ],
        maxInterviewsPerDay: 3,
        currentLoad: 1
      }
    ];

    setProvisionalReservations(mockProvisional);
    setInterviewers(mockInterviewers);
  };

  const handleAIOptimization = async (reservation: ProvisionalReservation) => {
    // ステータスを分析中に更新
    const analyzingReservation = { ...reservation, status: 'analyzing' as const };
    setSelectedReservation(analyzingReservation);
    setProvisionalReservations(prev =>
      prev.map(r => r.id === reservation.id ? analyzingReservation : r)
    );

    // AI分析をシミュレート（3案生成）
    setTimeout(() => {
      const aiProposals: AIProposals = {
        proposals: [
          {
            rank: 1,
            interviewer: '山田部長（人事部）',
            timeSlot: '2025-09-18 14:00-15:00',
            matchingScore: Math.floor(Math.random() * 10) + 90,
            reasoning: '専門分野が一致し、過去の面談実績も良好。最適な時間帯です。'
          },
          {
            rank: 2,
            interviewer: '佐藤師長（看護部）',
            timeSlot: '2025-09-19 10:00-11:00',
            matchingScore: Math.floor(Math.random() * 10) + 80,
            reasoning: '職種の理解が深く、相談しやすい環境を提供できます。'
          },
          {
            rank: 3,
            interviewer: '田中課長（総務部）',
            timeSlot: '2025-09-20 15:00-16:00',
            matchingScore: Math.floor(Math.random() * 10) + 75,
            reasoning: '管理職の視点から適切なアドバイスが可能です。'
          }
        ],
        recommendedChoice: 1
      };

      const updatedReservation = {
        ...reservation,
        status: 'proposals' as const,
        aiAnalysis: aiProposals
      };

      setSelectedReservation(updatedReservation);
      setProvisionalReservations(prev =>
        prev.map(r => r.id === reservation.id ? updatedReservation : r)
      );
    }, 2000);
  };

  const handleSendProposal = (reservation: ProvisionalReservation, selectedProposalIndex?: number) => {
    const proposalIndex = selectedProposalIndex || (reservation.aiAnalysis?.recommendedChoice || 1) - 1;
    const selectedProposal = reservation.aiAnalysis?.proposals[proposalIndex];

    // VoiceDriveへの提案送信処理
    console.log('VoiceDriveへ提案を送信:', {
      reservation,
      selectedProposal
    });

    // 承認待ちステータスに自動遷移
    const awaitingReservation = {
      ...reservation,
      status: 'awaiting' as const,
      lastSentAt: new Date(),
      adjustmentCount: (reservation.adjustmentCount || 0) + 1
    };

    setProvisionalReservations(prev =>
      prev.map(r => r.id === reservation.id ? awaitingReservation : r)
    );

    alert(`${reservation.staffName}様へ面談提案を送信しました（承認待ちに移動）`);
  };

  // VoiceDriveからの承認応答をシミュレート
  const simulateVoiceDriveResponse = (reservation: ProvisionalReservation, approved: boolean, approvedProposalRank?: number) => {
    if (approved && approvedProposalRank) {
      // 承認された場合は確定済みに移動
      const confirmedReservation = {
        ...reservation,
        status: 'confirmed' as const,
        approvedProposal: approvedProposalRank
      };

      setProvisionalReservations(prev =>
        prev.map(r => r.id === reservation.id ? confirmedReservation : r)
      );
    } else {
      // 再調整要求の場合は仮予約に戻す
      const rejectedReservation = {
        ...reservation,
        status: 'pending' as const,
        aiAnalysis: undefined // AI分析をリセット
      };

      setProvisionalReservations(prev =>
        prev.map(r => r.id === reservation.id ? rejectedReservation : r)
      );
    }
  };

  const getStatusBadgeColor = (status: ProvisionalReservation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'analyzing': return 'bg-blue-100 text-blue-800';
      case 'proposed': return 'bg-purple-100 text-purple-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyBadgeColor = (urgency: ProvisionalReservation['urgency']) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // カレンダービューコンポーネント
  const CalendarView = ({ reservations }: { reservations: ProvisionalReservation[] }) => {
    const today = new Date();
    const weekDays = ['月', '火', '水', '木', '金', '土', '日'];
    const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    // 今週の日付を取得
    const getWeekDates = () => {
      const week = [];
      const startOfWeek = new Date(today);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        week.push(date);
      }
      return week;
    };

    const weekDates = getWeekDates();

    // 予約を日付と時間でグループ化
    const getReservationsForSlot = (date: Date, time: string) => {
      return reservations.filter(r => {
        const rDate = new Date(r.preferredDates[0] || new Date());
        return rDate.toDateString() === date.toDateString();
      });
    };

    const getInterviewTypeColor = (type: ProvisionalReservation['interviewType']) => {
      switch (type) {
        case 'regular': return 'bg-blue-200 text-blue-800 border-blue-300';
        case 'support': return 'bg-green-200 text-green-800 border-green-300';
        case 'special': return 'bg-red-200 text-red-800 border-red-300';
        default: return 'bg-gray-200 text-gray-800 border-gray-300';
      }
    };

    return (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-8 gap-1 h-full">
          {/* 時間軸列 */}
          <div className="flex flex-col">
            <div className="h-12 flex items-center justify-center text-sm font-medium text-gray-600">
              時間
            </div>
            {timeSlots.map((time) => (
              <div key={time} className="flex-1 flex items-center justify-center text-xs text-gray-600 border-t">
                {time}
              </div>
            ))}
          </div>

          {/* 曜日列 */}
          {weekDates.map((date, dayIndex) => {
            const isToday = date.toDateString() === today.toDateString();
            return (
              <div key={dayIndex} className="flex flex-col">
                <div className={`h-12 flex flex-col items-center justify-center text-sm ${
                  isToday ? 'bg-blue-50 font-bold' : ''
                }`}>
                  <div className="font-medium">{weekDays[dayIndex]}</div>
                  <div className="text-xs text-gray-600">{date.getMonth() + 1}/{date.getDate()}</div>
                </div>
                {timeSlots.map((time) => {
                  const slotReservations = getReservationsForSlot(date, time);
                  return (
                    <div key={time} className={`flex-1 border-t border-l p-1 ${
                      isToday ? 'bg-blue-50/30' : ''
                    }`}>
                      <div className="space-y-1">
                        {slotReservations.slice(0, 2).map((reservation, idx) => (
                          <div
                            key={reservation.id}
                            className={`text-xs p-1 rounded border cursor-pointer hover:opacity-80 ${
                              getInterviewTypeColor(reservation.interviewType)
                            }`}
                            title={`${reservation.staffName} - ${reservation.subType || '面談'}`}
                          >
                            <div className="truncate font-medium">
                              {reservation.interviewType === 'regular' && '📅'}
                              {reservation.interviewType === 'support' && '💬'}
                              {reservation.interviewType === 'special' && '⚠️'}
                              {reservation.staffName.split(' ')[0]}
                            </div>
                          </div>
                        ))}
                        {slotReservations.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{slotReservations.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* 凡例 */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
            <span>定期面談</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
            <span>サポート面談</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span>特別面談</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* サブタブナビゲーション */}
      <Tabs value={activeSubTab} onValueChange={(value: any) => setActiveSubTab(value)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            予約管理ダッシュボード
          </TabsTrigger>
          <TabsTrigger value="interviewer" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            担当者管理
          </TabsTrigger>
          <TabsTrigger value="ai-optimization" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI最適化分析
          </TabsTrigger>
        </TabsList>

        {/* ダッシュボードタブ */}
        <TabsContent value="dashboard" className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto flex flex-col space-y-4 p-4">
            {/* ステータスサマリー */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">本日の仮予約</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">定期:5 サポート:8 特別:2</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">処理済み</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">処理率 53.3%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI推奨採用率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">88%</div>
                  <p className="text-xs text-muted-foreground">精度向上中</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">緊急対応</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <p className="text-xs text-muted-foreground">特別面談優先</p>
                </CardContent>
              </Card>
            </div>

            {/* 処理段階別リスト表示（上部40%） */}
            <div className="flex-none" style={{ height: '40%', minHeight: '300px' }}>
              <h3 className="text-lg font-semibold mb-3">予約処理状況一覧</h3>
              <div className="grid grid-cols-3 gap-4 h-full">
                {/* 仮予約カラム */}
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-2 bg-blue-50">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">📥</span>
                        仮予約
                      </span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {provisionalReservations.filter(r => r.status === 'pending').length}件
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-2">
                    <div className="space-y-2">
                      {provisionalReservations
                        .filter(r => r.status === 'pending')
                        .map((reservation) => (
                          <div
                            key={reservation.id}
                            className="p-3 bg-white border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-sm">{reservation.staffName}</div>
                              <Badge className={
                                reservation.interviewType === 'regular' ? 'bg-blue-100 text-blue-800' :
                                reservation.interviewType === 'support' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              } variant="outline">
                                {reservation.interviewType === 'regular' ? '定期' :
                                 reservation.interviewType === 'support' ? 'サポート' : '特別'}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              {reservation.department} / {reservation.position}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {reservation.subType || '年次面談'}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <Badge className={getUrgencyBadgeColor(reservation.urgency)} variant="outline">
                                {reservation.urgency === 'urgent' ? '緊急' :
                                 reservation.urgency === 'high' ? '高' :
                                 reservation.urgency === 'medium' ? '中' : '低'}
                              </Badge>
                              <Button
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => {
                                  setSelectedReservation(reservation);
                                  setShowProcessingModal(true);
                                }}
                              >
                                <Settings className="w-3 h-3 mr-1" />
                                詳細処理
                              </Button>
                            </div>
                          </div>
                        ))}
                      {provisionalReservations.filter(r => r.status === 'pending').length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">
                          仮予約なし
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 承認待ちカラム */}
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-2 bg-yellow-50">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">⏳</span>
                        承認待ち
                      </span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {provisionalReservations.filter(r => r.status === 'awaiting').length}件
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-2">
                    <div className="space-y-2">
                      {provisionalReservations
                        .filter(r => r.status === 'awaiting')
                        .map((reservation) => {
                          const hoursSinceLastSent = reservation.lastSentAt ?
                            Math.floor((Date.now() - reservation.lastSentAt.getTime()) / (1000 * 60 * 60)) : 0;

                          return (
                            <div
                              key={reservation.id}
                              className="p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                              onClick={() => {
                                // 軽量確認モーダル（後で実装）
                                alert(`${reservation.staffName}さんの承認待ち詳細`);
                              }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-sm">{reservation.staffName}</div>
                                <div className="text-xs text-gray-500">
                                  {reservation.adjustmentCount || 1}回目
                                </div>
                              </div>
                              <div className="text-xs text-gray-600">
                                {reservation.department} / {reservation.position}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                送信: {hoursSinceLastSent}時間前
                              </div>
                              {hoursSinceLastSent > 24 && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-600 mt-1">
                                  要確認
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      {provisionalReservations.filter(r => r.status === 'awaiting').length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">
                          承認待ちなし
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 確定済みカラム */}
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-2 bg-green-50">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">✅</span>
                        確定済み
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        {provisionalReservations.filter(r => r.status === 'confirmed').length}件
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-2">
                    <div className="space-y-2">
                      {provisionalReservations
                        .filter(r => r.status === 'confirmed')
                        .map((reservation) => (
                          <div
                            key={reservation.id}
                            className="p-3 bg-white border border-green-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                            onClick={() => {
                              // 履歴確認モーダル（後で実装）
                              alert(`${reservation.staffName}さんの確定済み詳細`);
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-sm">{reservation.staffName}</div>
                              <Badge variant="outline" className="bg-green-50 text-green-600">
                                完了
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              {reservation.department} / {reservation.position}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {reservation.aiAnalysis?.proposals?.[reservation.approvedProposal! - 1]?.timeSlot || '時間未定'}
                            </div>
                            <div className="text-xs text-gray-500">
                              担当: {reservation.aiAnalysis?.proposals?.[reservation.approvedProposal! - 1]?.interviewer || '未定'}
                            </div>
                          </div>
                        ))}
                      {provisionalReservations.filter(r => r.status === 'confirmed').length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">
                          確定済みなし
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 下部: カレンダー表示 */}
            <div className="flex-1" style={{ minHeight: '400px' }}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">週間予約カレンダー</h3>
                <Button size="sm" onClick={() => setShowManualReservationModal(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  手動追加
                </Button>
              </div>
              <Card className="h-full">
                <CardContent className="p-4 h-full">
                  <CalendarView reservations={provisionalReservations} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>


        {/* 担当者管理タブ */}
        <TabsContent value="interviewer" className="flex-1 overflow-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>面談担当者一覧</CardTitle>
                <Button onClick={() => setShowAddInterviewerModal(true)}>
                  <UserPlus className="w-4 h-4 mr-1" />
                  担当者追加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {interviewers.map((interviewer) => (
                  <Card key={interviewer.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{interviewer.name}</div>
                          <div className="text-sm text-gray-600">{interviewer.title}</div>
                          <div className="text-sm text-gray-500">{interviewer.department}</div>
                          <div className="mt-2">
                            <div className="text-xs text-gray-600">専門分野:</div>
                            <div className="flex gap-1 mt-1">
                              {interviewer.specialties.map((specialty, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            <span className="text-gray-600">本日の負荷:</span>
                            <div className="font-medium">
                              {interviewer.currentLoad} / {interviewer.maxInterviewsPerDay}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            時間設定
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI最適化分析タブ */}
        <TabsContent value="ai-optimization" className="flex-1 overflow-auto">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI最適化パフォーマンス</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">88%</div>
                    <div className="text-sm text-gray-600">推奨採用率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-gray-600">職員満足度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">2.8秒</div>
                    <div className="text-sm text-gray-600">平均処理時間</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>最適化傾向分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">時間帯別マッチング精度</span>
                      <span className="text-sm text-gray-600">午後の時間帯が高精度</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">部署別予約パターン</span>
                      <span className="text-sm text-gray-600">看護部は金曜日選好</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">担当者負荷分散</span>
                      <span className="text-sm text-gray-600">最適化により20%改善</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 詳細処理モーダル */}
      {showProcessingModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* モーダルヘッダー */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">面談予約詳細処理</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedReservation.staffName} さんの
                  {selectedReservation.interviewType === 'regular' ? '定期面談' :
                   selectedReservation.interviewType === 'special' ? '特別面談' : 'サポート面談'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProcessingModal(false)}
              >
                <X className="w-4 h-4" />
                閉じる
              </Button>
            </div>

            {/* モーダル内容 */}
            <div className="p-6 space-y-6">
              {/* 予約詳細情報 */}
              <div>
                <h3 className="text-lg font-medium mb-4">予約詳細</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">職員名</span>
                      <div className="font-medium">{selectedReservation.staffName}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">部署</span>
                      <div className="font-medium">{selectedReservation.department}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">職位</span>
                      <div className="font-medium">{selectedReservation.position}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">面談種別</span>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          selectedReservation.interviewType === 'regular' ? 'bg-blue-100 text-blue-800' :
                          selectedReservation.interviewType === 'support' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {selectedReservation.interviewType === 'regular' ? '📅 定期面談' :
                           selectedReservation.interviewType === 'support' ? '💬 サポート面談' :
                           '⚠️ 特別面談'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">サブタイプ</span>
                      <div className="font-medium">{selectedReservation.subType || '未設定'}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">緊急度</span>
                      <Badge className={getUrgencyBadgeColor(selectedReservation.urgency)} variant="outline">
                        {selectedReservation.urgency === 'urgent' ? '🔴 緊急' :
                         selectedReservation.urgency === 'high' ? '🟡 高' :
                         selectedReservation.urgency === 'medium' ? '🟢 中' : '⚪ 低'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {selectedReservation.notes && (
                  <div className="mt-4">
                    <span className="text-sm text-gray-600">備考</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{selectedReservation.notes}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <span className="text-sm text-gray-600">受信日時</span>
                  <div className="font-medium">{selectedReservation.receivedAt.toLocaleString('ja-JP')}</div>
                </div>
              </div>

              {/* AI分析セクション */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">AI最適化分析</h3>

                {selectedReservation.aiAnalysis ? (
                  <div>
                    {/* AI分析結果表示 */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">AI最適化完了 - 3つの提案</span>
                      </div>

                      {/* 3つの提案を表示 */}
                      <div className="space-y-3 mb-6">
                        {selectedReservation.aiAnalysis.proposals.map((proposal, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-2 ${
                              proposal.rank === selectedReservation.aiAnalysis?.recommendedChoice
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={proposal.rank === 1 ? 'default' : 'outline'}>
                                  提案{proposal.rank}
                                  {proposal.rank === selectedReservation.aiAnalysis?.recommendedChoice && ' (推奨)'}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-medium">{proposal.matchingScore}%</span>
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-600 h-1.5 rounded-full"
                                      style={{ width: `${proposal.matchingScore}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-2">
                              <div>
                                <span className="text-xs text-gray-600">担当者</span>
                                <div className="font-medium text-sm">{proposal.interviewer}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600">日時</span>
                                <div className="font-medium text-sm">{proposal.timeSlot}</div>
                              </div>
                            </div>

                            <div>
                              <span className="text-xs text-gray-600">分析理由</span>
                              <p className="text-sm text-gray-700 mt-1">{proposal.reasoning}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          handleSendProposal(selectedReservation);
                          setShowProcessingModal(false);
                        }}
                        disabled={selectedReservation.status === 'awaiting' || selectedReservation.status === 'confirmed'}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {selectedReservation.status === 'awaiting' ? '承認待ち中' :
                         selectedReservation.status === 'confirmed' ? '確定済み' :
                         '推奨提案をVoiceDriveに送信'}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        提案を編集
                      </Button>
                      <Button variant="outline" onClick={() => {
                        // AI分析をリセット
                        const resetReservation = { ...selectedReservation, aiAnalysis: undefined, status: 'pending' as const };
                        setSelectedReservation(resetReservation);
                        setProvisionalReservations(prev =>
                          prev.map(r => r.id === selectedReservation.id ? resetReservation : r)
                        );
                      }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        再分析
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">
                      AI最適化分析を実行して、最適な担当者と時間帯を自動提案します。
                    </p>
                    <Button
                      size="lg"
                      onClick={() => handleAIOptimization(selectedReservation)}
                      disabled={selectedReservation.status === 'analyzing'}
                      className="min-w-[200px]"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      {selectedReservation.status === 'analyzing' ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          AI分析実行中...
                        </>
                      ) : (
                        'AI最適化分析を開始'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}