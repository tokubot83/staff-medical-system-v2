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
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'provisional' | 'interviewer' | 'ai-optimization'>('dashboard');
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
    // 仮予約のモックデータ
    const mockProvisional: ProvisionalReservation[] = [
      {
        id: 'PROV-001',
        staffId: 'OH-NS-2021-001',
        staffName: '田中 花子',
        department: '内科',
        position: '看護師',
        interviewType: 'support',
        subType: 'キャリア相談',
        preferredDates: [new Date('2025-09-20'), new Date('2025-09-21')],
        urgency: 'high',
        source: 'voicedrive',
        status: 'pending',
        receivedAt: new Date('2025-09-15T09:00:00'),
        notes: 'キャリアアップについて相談したい'
      },
      {
        id: 'PROV-002',
        staffId: 'OH-DR-2019-003',
        staffName: '佐藤 太郎',
        department: '外科',
        position: '医師',
        interviewType: 'regular',
        subType: '年次面談',
        preferredDates: [new Date('2025-09-22')],
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

  return (
    <div className="w-full h-full flex flex-col">
      {/* サブタブナビゲーション */}
      <Tabs value={activeSubTab} onValueChange={(value: any) => setActiveSubTab(value)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            ダッシュボード
          </TabsTrigger>
          <TabsTrigger value="provisional" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            仮予約処理
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
        <TabsContent value="dashboard" className="flex-1 overflow-auto">
          <div className="space-y-4">
            {/* ステータスサマリー */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">本日の仮予約</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">前日比 +2</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">処理済み</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">処理率 62.5%</p>
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
                  <p className="text-xs text-muted-foreground">要確認</p>
                </CardContent>
              </Card>
            </div>

            {/* ビュー切替 */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">予約状況一覧</h3>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  リスト表示
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                >
                  カレンダー表示
                </Button>
              </div>
            </div>

            {/* 予約一覧表示 */}
            {viewMode === 'list' ? (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {provisionalReservations.map((reservation) => (
                      <div key={reservation.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{reservation.staffName}</span>
                              <Badge className={getStatusBadgeColor(reservation.status)}>
                                {reservation.status === 'pending' && '受信済み'}
                                {reservation.status === 'analyzing' && 'AI分析中'}
                                {reservation.status === 'proposed' && '提案済み'}
                                {reservation.status === 'confirmed' && '確定'}
                              </Badge>
                              <Badge className={getUrgencyBadgeColor(reservation.urgency)}>
                                {reservation.urgency === 'urgent' && '緊急'}
                                {reservation.urgency === 'high' && '高'}
                                {reservation.urgency === 'medium' && '中'}
                                {reservation.urgency === 'low' && '低'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span>{reservation.department} / {reservation.position}</span>
                              <span>{reservation.interviewType === 'regular' ? '定期面談' :
                                     reservation.interviewType === 'special' ? '特別面談' : 'サポート面談'}</span>
                              {reservation.subType && <span>({reservation.subType})</span>}
                            </div>
                            {reservation.aiAnalysis && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                <span className="font-medium">AI推奨:</span> {reservation.aiAnalysis.recommendedInterviewer} /
                                {reservation.aiAnalysis.recommendedTimeSlot} (マッチ度: {reservation.aiAnalysis.matchingScore}%)
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {reservation.status === 'pending' && (
                              <Button size="sm" onClick={() => handleAIOptimization(reservation)}>
                                <Brain className="w-4 h-4 mr-1" />
                                AI分析
                              </Button>
                            )}
                            {reservation.status === 'proposed' && (
                              <Button size="sm" variant="default" onClick={() => handleSendProposal(reservation)}>
                                <Send className="w-4 h-4 mr-1" />
                                通知送信
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="text-center text-gray-500">
                    カレンダービューは実装準備中です
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 仮予約処理タブ */}
        <TabsContent value="provisional" className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* 左側: 仮予約リスト */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>仮予約受信一覧</CardTitle>
                  <Button size="sm" onClick={() => setShowManualReservationModal(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    手動追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {provisionalReservations.filter(r => r.status === 'pending' || r.status === 'analyzing').map((reservation) => (
                    <div
                      key={reservation.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedReservation?.id === reservation.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedReservation(reservation)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{reservation.staffName}</div>
                          <div className="text-sm text-gray-600">
                            {reservation.department} / {reservation.position}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            受信: {reservation.receivedAt.toLocaleString('ja-JP')}
                          </div>
                        </div>
                        <Badge className={getUrgencyBadgeColor(reservation.urgency)}>
                          {reservation.urgency === 'urgent' ? '緊急' :
                           reservation.urgency === 'high' ? '高' :
                           reservation.urgency === 'medium' ? '中' : '低'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 右側: AI最適化ワークスペース */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>AI最適化ワークスペース</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedReservation ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">予約詳細</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">職員:</span> {selectedReservation.staffName}</div>
                        <div><span className="text-gray-600">部署:</span> {selectedReservation.department}</div>
                        <div><span className="text-gray-600">種別:</span>
                          {selectedReservation.interviewType === 'regular' ? '定期面談' :
                           selectedReservation.interviewType === 'special' ? '特別面談' : 'サポート面談'}
                          {selectedReservation.subType && ` (${selectedReservation.subType})`}
                        </div>
                        {selectedReservation.notes && (
                          <div><span className="text-gray-600">備考:</span> {selectedReservation.notes}</div>
                        )}
                      </div>
                    </div>

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

                        <div className="flex gap-2 mt-4">
                          <Button className="flex-1" onClick={() => handleSendProposal(selectedReservation)}>
                            <Send className="w-4 h-4 mr-1" />
                            提案を送信
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            編集
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Button onClick={() => handleAIOptimization(selectedReservation)}>
                          <Brain className="w-4 h-4 mr-1" />
                          AI最適化分析を開始
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