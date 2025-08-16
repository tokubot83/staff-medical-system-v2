'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, AlertTriangle, CheckCircle, 
  ChevronRight, Play, FileText, Users, TrendingUp,
  Filter, Search, RefreshCw, Bell, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceDriveService } from '@/services/voicedriveIntegrationService';
import { useRouter } from 'next/navigation';
import { mockInterviews } from '@/data/mockInterviews';

// 面談予約の統合型定義
interface UnifiedInterviewReservation {
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
}

export default function UnifiedInterviewDashboard() {
  const router = useRouter();
  const [reservations, setReservations] = useState<UnifiedInterviewReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState<'all' | 'regular' | 'special' | 'support'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  useEffect(() => {
    loadReservations();
  }, [selectedDate]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      // 実際の実装では各サービスから予約データを取得
      const mockData = await getMockReservations();
      
      // VoiceDriveからのサポート面談予約を取得（エラーハンドリング追加）
      let voiceDriveReservations: any[] = [];
      try {
        voiceDriveReservations = await VoiceDriveService.getInterviewRequests();
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
        // 最初の5件を今日の日付に、残りは元の日付を使用
        const scheduledDate = index < 5 ? today : new Date(interview.bookingDate);
        
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
    
    // セッションストレージに予約情報を保存
    sessionStorage.setItem('interviewReservation', JSON.stringify(reservation));
    console.log('Saved to sessionStorage:', sessionStorage.getItem('interviewReservation'));
    
    // DynamicInterviewFlowに遷移（window.locationで強制リロード）
    const url = '/interviews?tab=sheets&fromDashboard=true';
    console.log('Navigating to:', url);
    window.location.href = url;
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
  const upcomingReservations = getFilteredReservations(getUpcomingReservations());
  const overdueReservations = getFilteredReservations(getOverdueReservations());

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">統合面談ダッシュボード</h2>
          <p className="text-gray-600 mt-1">すべての面談予約を一元管理</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadReservations} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
          <Button onClick={() => router.push('/interview-bank/create')}>
            新規面談作成
          </Button>
        </div>
      </div>

      {/* フィルター */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="職員名、部署で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
        </CardContent>
      </Card>

      {/* 緊急・要対応 */}
      {overdueReservations.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong className="text-red-800">未実施の面談が {overdueReservations.length} 件あります</strong>
            <div className="mt-2 space-y-1">
              {overdueReservations.slice(0, 3).map(r => (
                <div key={r.id} className="text-sm">
                  {r.staffName} - {getInterviewTypeLabel(r)} ({new Date(r.scheduledDate).toLocaleDateString('ja-JP')})
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 本日の面談 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              本日の面談予定
            </span>
            <Badge variant="secondary">{todayReservations.length} 件</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : todayReservations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">本日の面談予定はありません</div>
          ) : (
            <div className="space-y-3">
              {todayReservations.map(reservation => (
                <div key={reservation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold">{reservation.scheduledTime}</div>
                        <div>
                          <div className="font-medium">{reservation.staffName}</div>
                          <div className="text-sm text-gray-600">
                            {reservation.department} / {reservation.position}
                          </div>
                        </div>
                        <Badge variant="outline">{getInterviewTypeLabel(reservation)}</Badge>
                        {getUrgencyBadge(reservation.urgency)}
                        {getStatusBadge(reservation.status)}
                      </div>
                      {reservation.notes && (
                        <div className="mt-2 text-sm text-gray-600">{reservation.notes}</div>
                      )}
                      {reservation.supportTopic && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">相談内容:</span> {reservation.supportTopic}
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleStartInterview(reservation)}
                      disabled={reservation.status !== 'confirmed'}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      面談開始
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 今後の予定 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>今後の予定</span>
              <Badge variant="secondary">{upcomingReservations.length} 件</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {upcomingReservations.map(reservation => (
                <div key={reservation.id} className="border-l-4 border-blue-400 pl-3 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">
                        {new Date(reservation.scheduledDate).toLocaleDateString('ja-JP')} {reservation.scheduledTime}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reservation.staffName} - {getInterviewTypeLabel(reservation)}
                      </div>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 統計サマリー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              今月の実施状況
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">定期面談</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">45/60</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">特別面談</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">5/5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">サポート面談</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">12/20</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">92%</div>
                  <div className="text-xs text-gray-600">実施率</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">4.5</div>
                  <div className="text-xs text-gray-600">満足度</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}