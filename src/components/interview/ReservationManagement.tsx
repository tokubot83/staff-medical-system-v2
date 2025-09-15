'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, AlertTriangle, CheckCircle,
  ChevronRight, Play, FileText, Users,
  Filter, Search, RefreshCw, Bell, Plus, FilterX,
  ArrowLeft, CalendarDays, Settings, BarChart3,
  Brain, Zap, Send, Edit, UserPlus, ClockIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  status: 'pending' | 'analyzing' | 'proposed' | 'confirmed';
  receivedAt: Date;
  notes?: string;
  aiAnalysis?: {
    recommendedInterviewer?: string;
    recommendedTimeSlot?: string;
    matchingScore?: number;
    reasoning?: string;
  };
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

    // 仮予約のモックデータ
    const mockProvisional: ProvisionalReservation[] = [
      // 定期面談
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
        status: 'analyzing',
        receivedAt: new Date('2025-09-15T08:00:00'),
        notes: '家庭の事情により退職予定',
        aiAnalysis: {
          recommendedInterviewer: '看護部長',
          recommendedTimeSlot: '10:00-11:00',
          matchingScore: 95,
          reasoning: '退職面談は部長対応が必要'
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
    setSelectedReservation(reservation);
    // AI最適化処理をシミュレート
    const updatedReservation = {
      ...reservation,
      status: 'analyzing' as const,
      aiAnalysis: {
        recommendedInterviewer: '山田部長',
        recommendedTimeSlot: '14:00-15:00',
        matchingScore: Math.floor(Math.random() * 20) + 80,
        reasoning: 'AI分析により最適な担当者とタイムスロットを推奨しました'
      }
    };

    setTimeout(() => {
      setProvisionalReservations(prev =>
        prev.map(r => r.id === reservation.id ? { ...updatedReservation, status: 'proposed' } : r)
      );
    }, 2000);
  };

  const handleSendProposal = (reservation: ProvisionalReservation) => {
    // VoiceDriveへの提案送信処理
    console.log('VoiceDriveへ提案を送信:', reservation);
    alert(`${reservation.staffName}様へ面談提案を送信しました`);

    setProvisionalReservations(prev =>
      prev.map(r => r.id === reservation.id ? { ...r, status: 'confirmed' } : r)
    );
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

            {/* 面談種別ごとのリスト表示（上部40%） */}
            <div className="flex-none" style={{ height: '40%', minHeight: '300px' }}>
              <h3 className="text-lg font-semibold mb-3">面談種別仮予約一覧</h3>
              <div className="grid grid-cols-3 gap-4 h-full">
                {/* 定期面談カラム */}
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-2 bg-blue-50">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        定期面談
                      </span>
                      <Badge className="bg-blue-100 text-blue-800">5件</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-2">
                    <div className="space-y-2">
                      {provisionalReservations
                        .filter(r => r.interviewType === 'regular')
                        .map((reservation) => (
                          <div
                            key={reservation.id}
                            className="p-3 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedReservation(reservation)}
                          >
                            <div className="font-medium text-sm">{reservation.staffName}</div>
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
                              {reservation.status === 'analyzing' && (
                                <span className="text-xs text-blue-600">AI分析中...</span>
                              )}
                            </div>
                          </div>
                        ))}
                      {provisionalReservations.filter(r => r.interviewType === 'regular').length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">
                          仮予約なし
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* サポート面談カラム */}
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-2 bg-green-50">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">💬</span>
                        サポート面談
                      </span>
                      <Badge className="bg-green-100 text-green-800">8件</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-2">
                    <div className="space-y-2">
                      {provisionalReservations
                        .filter(r => r.interviewType === 'support')
                        .map((reservation) => (
                          <div
                            key={reservation.id}
                            className="p-3 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedReservation(reservation)}
                          >
                            <div className="font-medium text-sm">{reservation.staffName}</div>
                            <div className="text-xs text-gray-600">
                              {reservation.department} / {reservation.position}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {reservation.subType || 'キャリア相談'}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <Badge className={getUrgencyBadgeColor(reservation.urgency)} variant="outline">
                                {reservation.urgency === 'urgent' ? '緊急' :
                                 reservation.urgency === 'high' ? '高' :
                                 reservation.urgency === 'medium' ? '中' : '低'}
                              </Badge>
                              {reservation.status === 'proposed' && (
                                <Button size="sm" className="h-6 text-xs" onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendProposal(reservation);
                                }}>
                                  <Send className="w-3 h-3 mr-1" />
                                  通知
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 特別面談カラム */}
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-2 bg-orange-50">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        特別面談
                      </span>
                      <Badge className="bg-orange-100 text-orange-800">2件</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-2">
                    <div className="space-y-2">
                      {provisionalReservations
                        .filter(r => r.interviewType === 'special')
                        .map((reservation) => (
                          <div
                            key={reservation.id}
                            className="p-3 bg-white border border-orange-300 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedReservation(reservation)}
                          >
                            <div className="font-medium text-sm">{reservation.staffName}</div>
                            <div className="text-xs text-gray-600">
                              {reservation.department} / {reservation.position}
                            </div>
                            <div className="text-xs font-semibold text-orange-700 mt-1">
                              {reservation.subType || '復職面談'}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <Badge className="bg-red-100 text-red-800" variant="outline">
                                緊急対応
                              </Badge>
                              <Button size="sm" variant="destructive" className="h-6 text-xs" onClick={(e) => {
                                e.stopPropagation();
                                handleAIOptimization(reservation);
                              }}>
                                <Zap className="w-3 h-3 mr-1" />
                                優先処理
                              </Button>
                            </div>
                          </div>
                        ))}
                      {provisionalReservations.filter(r => r.interviewType === 'special').length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">
                          仮予約なし
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 下部: カレンダーと詳細処理ワークスペース */}
            <div className="flex-1 grid grid-cols-3 gap-4" style={{ minHeight: '400px' }}>
              {/* 左側: カレンダービュー */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold mb-3">週間予約カレンダー</h3>
                <Card className="h-full">
                  <CardContent className="p-4 h-full">
                    <CalendarView reservations={provisionalReservations} />
                  </CardContent>
                </Card>
              </div>

              {/* 右側: 詳細処理ワークスペース */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">詳細処理</h3>
                  <Button size="sm" onClick={() => setShowManualReservationModal(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    手動追加
                  </Button>
                </div>
                <Card className="h-full">
                  <CardContent className="p-4">
                    {selectedReservation ? (
                      <div className="space-y-4">
                        {/* 予約詳細 */}
                        <div>
                          <h4 className="font-medium mb-2">予約詳細</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="text-gray-600">职員:</span> {selectedReservation.staffName}</div>
                            <div><span className="text-gray-600">部署:</span> {selectedReservation.department}</div>
                            <div><span className="text-gray-600">種別:</span>
                              {selectedReservation.interviewType === 'regular' ? '定期面談' :
                               selectedReservation.interviewType === 'special' ? '特別面談' : 'サポート面談'}
                              {selectedReservation.subType && ` (${selectedReservation.subType})`}
                            </div>
                            <div><span className="text-gray-600">緊急度:</span>
                              <Badge className={getUrgencyBadgeColor(selectedReservation.urgency)} variant="outline">
                                {selectedReservation.urgency === 'urgent' ? '緊急' :
                                 selectedReservation.urgency === 'high' ? '高' :
                                 selectedReservation.urgency === 'medium' ? '中' : '低'}
                              </Badge>
                            </div>
                            {selectedReservation.notes && (
                              <div><span className="text-gray-600">備考:</span> {selectedReservation.notes}</div>
                            )}
                          </div>
                        </div>

                        {/* AI分析結果 */}
                        {selectedReservation.aiAnalysis ? (
                          <div>
                            <h4 className="font-medium mb-2">AI分析結果</h4>
                            <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">推奨担当者:</span>
                                <span className="font-medium">{selectedReservation.aiAnalysis.recommendedInterviewer}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">推奨時間帯:</span>
                                <span className="font-medium">{selectedReservation.aiAnalysis.recommendedTimeSlot}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">マッチング度:</span>
                                <span className="font-medium">{selectedReservation.aiAnalysis.matchingScore}%</span>
                              </div>
                              <div className="pt-2 border-t">
                                <p className="text-sm text-gray-700">{selectedReservation.aiAnalysis.reasoning}</p>
                              </div>
                            </div>

                            {/* アクションボタン */}
                            <div className="flex gap-2 mt-4">
                              <Button
                                className="flex-1"
                                onClick={() => handleSendProposal(selectedReservation)}
                                disabled={selectedReservation.status === 'confirmed'}
                              >
                                <Send className="w-4 h-4 mr-1" />
                                {selectedReservation.status === 'confirmed' ? '送信済み' : '提案を送信'}
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <Edit className="w-4 h-4 mr-1" />
                                編集
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Button
                              onClick={() => handleAIOptimization(selectedReservation)}
                              disabled={selectedReservation.status === 'analyzing'}
                            >
                              <Brain className="w-4 h-4 mr-1" />
                              {selectedReservation.status === 'analyzing' ? 'AI分析中...' : 'AI最適化分析を開始'}
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        左側のリストから仮予約を選択してください
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
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
    </div>
  );
}