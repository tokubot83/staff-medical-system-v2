'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ChevronRight,
  Loader2,
  Briefcase,
  Home,
  Users,
  Heart,
  Brain,
  Target,
  Info,
  ArrowRight,
  Database
} from 'lucide-react';

import { VoiceDriveInterviewRequest } from '@/services/voicedriveIntegrationService';
import { InterviewBankService } from '@/lib/interview-bank/services/bank-service';
import { generateSupportInterviewFromVoiceDrive } from '@/lib/interview-bank/services/support-generator';
import { StaffBankProfile } from '@/lib/interview-bank/types';
import DynamicInterviewSheet from '@/components/interview-bank/DynamicInterviewSheet';
import { useRouter } from 'next/navigation';

// VoiceDrive予約アイテム
interface VoiceDriveRequestItemProps {
  request: VoiceDriveInterviewRequest;
  onStart: (request: VoiceDriveInterviewRequest) => void;
  isSelected: boolean;
}

function VoiceDriveRequestItem({ request, onStart, isSelected }: VoiceDriveRequestItemProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'career': return <Briefcase className="w-4 h-4" />;
      case 'workplace': return <Home className="w-4 h-4" />;
      case 'relationships': return <Users className="w-4 h-4" />;
      case 'worklife': return <Clock className="w-4 h-4" />;
      case 'health': return <Heart className="w-4 h-4" />;
      case 'skills': return <Brain className="w-4 h-4" />;
      case 'evaluation': return <Target className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      career: 'キャリア相談',
      workplace: '職場環境',
      relationships: '人間関係',
      worklife: 'ワークライフ',
      health: '健康・メンタル',
      skills: 'スキル・研修',
      evaluation: '評価・処遇',
      other: 'その他'
    };
    return labels[category] || category;
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return <Badge variant="destructive">緊急</Badge>;
      case 'high':
        return <Badge variant="destructive">高</Badge>;
      case 'medium':
        return <Badge variant="secondary">中</Badge>;
      case 'low':
        return <Badge variant="outline">低</Badge>;
      default:
        return <Badge variant="secondary">通常</Badge>;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getCategoryIcon(request.category)}
            <span className="font-semibold">{getCategoryLabel(request.category)}</span>
          </div>
          {getUrgencyBadge(request.urgency)}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm font-medium">{request.employeeName}</span>
            <span className="text-xs text-muted-foreground">({request.department})</span>
          </div>

          <div>
            <p className="font-medium text-sm">{request.consultationTopic}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {request.consultationDetails}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(request.requestedAt).toLocaleDateString('ja-JP')}
              </span>
              <span>
                {request.preferredLocation === 'online' ? 'オンライン' :
                 request.preferredLocation === 'face-to-face' ? '対面' : 'どちらでも'}
              </span>
            </div>
            <Button 
              size="sm" 
              onClick={() => onStart(request)}
              className="gap-1"
            >
              面談開始
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// メインコンポーネント
export default function VoiceDriveSupportInterviewPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'today' | 'history'>('pending');
  const [requests, setRequests] = useState<VoiceDriveInterviewRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VoiceDriveInterviewRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSheet, setGeneratedSheet] = useState<any>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [interviewService] = useState(() => InterviewBankService.getInstance());

  useEffect(() => {
    loadVoiceDriveRequests();
    // 定期的な更新
    const interval = setInterval(loadVoiceDriveRequests, 60000); // 1分ごと
    return () => clearInterval(interval);
  }, []);

  // VoiceDrive予約の読み込み
  const loadVoiceDriveRequests = async () => {
    setIsLoading(true);
    try {
      // 実際の実装ではVoiceDriveIntegrationServiceから取得
      // const requests = await VoiceDriveIntegrationService.fetchInterviewRequests();
      
      // モックデータ
      const mockRequests: VoiceDriveInterviewRequest[] = [
        {
          id: 'vd_001',
          requestId: 'VD_REQ_001',
          employeeId: 'EMP_001',
          employeeName: '田中美咲',
          employeeEmail: 'tanaka@example.com',
          department: '外来看護部',
          position: '看護師',
          requestType: 'support_interview',
          category: 'career',
          subcategory: 'promotion',
          consultationTopic: '主任への昇進について相談したい',
          consultationDetails: '来年度の主任昇進試験を受けたいと考えています。必要なスキルや準備について相談させてください。',
          urgency: 'medium',
          preferredDates: [new Date()],
          preferredTime: 'afternoon',
          preferredLocation: 'face-to-face',
          requestedAt: new Date(Date.now() - 86400000),
          requestedVia: 'voicedrive_app',
          status: 'pending',
          statusHistory: []
        },
        {
          id: 'vd_002',
          requestId: 'VD_REQ_002',
          employeeId: 'EMP_002',
          employeeName: '佐藤健一',
          employeeEmail: 'sato@example.com',
          department: 'リハビリテーション科',
          position: '理学療法士',
          requestType: 'support_interview',
          category: 'health',
          subcategory: 'stress',
          consultationTopic: '業務ストレスについて',
          consultationDetails: '最近、残業が続いており体調に影響が出始めています。ワークライフバランスの改善について相談したいです。',
          urgency: 'high',
          preferredDates: [new Date()],
          preferredTime: 'morning',
          preferredLocation: 'online',
          requestedAt: new Date(Date.now() - 43200000),
          requestedVia: 'voicedrive_app',
          status: 'pending',
          statusHistory: []
        },
        {
          id: 'vd_003',
          requestId: 'VD_REQ_003',
          employeeId: 'EMP_003',
          employeeName: '山田花子',
          employeeEmail: 'yamada@example.com',
          department: '看護部',
          position: '看護師',
          requestType: 'support_interview',
          category: 'relationships',
          subcategory: 'team',
          consultationTopic: 'チーム内のコミュニケーション改善',
          consultationDetails: '新しく配属されたチームでの人間関係に悩んでいます。効果的なコミュニケーション方法についてアドバイスをいただきたいです。',
          urgency: 'medium',
          preferredDates: [new Date()],
          preferredTime: 'anytime',
          preferredLocation: 'either',
          requestedAt: new Date(Date.now() - 172800000),
          requestedVia: 'voicedrive_web',
          status: 'pending',
          statusHistory: []
        }
      ];

      setRequests(mockRequests);
    } catch (error) {
      console.error('Failed to load VoiceDrive requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 面談開始処理
  const handleStartInterview = async (request: VoiceDriveInterviewRequest) => {
    setSelectedRequest(request);
    setIsGenerating(true);

    try {
      // スタッフプロファイルを作成または取得
      const staffProfile: StaffBankProfile = {
        id: request.employeeId,
        name: request.employeeName,
        email: request.employeeEmail,
        department: request.department,
        position: request.position || '',
        experienceLevel: 'junior',
        experienceYears: 3,
        experienceMonths: 0,
        facility: '第一病院',
        facilityType: 'acute',
        hireDate: new Date('2021-04-01'),
        lastInterviewDate: null,
        nextScheduledDate: null,
        interviewCount: 0
      };

      // VoiceDriveリクエストから面談を処理
      const result = await interviewService.processVoiceDriveRequest(request);
      
      // interviewDateが含まれていることを確認
      if (!result.sheet.params) {
        result.sheet.params = {};
      }
      if (!result.sheet.params.interviewDate) {
        result.sheet.params.interviewDate = new Date();
      }
      
      setGeneratedSheet(result.sheet);
      setInterviewId(result.interviewId);
      setActiveTab('pending'); // 実施画面に切り替え
    } catch (error) {
      console.error('Failed to generate interview:', error);
      alert('面談の生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // 面談完了処理
  const handleInterviewComplete = async (responses: any) => {
    if (!interviewId || !selectedRequest) return;

    try {
      await interviewService.completeInterview(
        interviewId,
        `${selectedRequest.consultationTopic}に関するサポート面談を実施`,
        [`${selectedRequest.category}カテゴリの相談対応`],
        selectedRequest.urgency === 'high' || selectedRequest.urgency === 'urgent'
          ? [{ description: 'フォローアップ面談の実施', dueDate: new Date(Date.now() + 7 * 86400000) }]
          : []
      );

      // 成功メッセージ表示
      alert('面談が完了しました');
      
      // リストを更新
      await loadVoiceDriveRequests();
      
      // 選択をクリア
      setSelectedRequest(null);
      setGeneratedSheet(null);
      setInterviewId(null);
    } catch (error) {
      console.error('Failed to complete interview:', error);
      alert('面談の完了処理に失敗しました');
    }
  };

  // フィルタリング
  const todayRequests = requests.filter(r => {
    const requestDate = new Date(r.preferredDates[0]);
    const today = new Date();
    return requestDate.toDateString() === today.toDateString();
  });

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const historyRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6" />
            サポート面談 - VoiceDrive連携
          </h1>
          <p className="text-muted-foreground">
            VoiceDriveからの面談申込を処理します
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadVoiceDriveRequests}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          更新
        </Button>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">本日の予約</p>
                <p className="text-2xl font-bold">{todayRequests.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">保留中</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">完了済み</p>
                <p className="text-2xl font-bold">{historyRequests.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 面談実施中の場合 */}
      {generatedSheet && interviewId ? (
        <Card>
          <CardHeader>
            <CardTitle>面談実施中</CardTitle>
            <CardDescription>
              {selectedRequest?.employeeName}さんの{selectedRequest?.consultationTopic}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicInterviewSheet
              sheetData={generatedSheet}
              staffProfile={{
                id: selectedRequest.employeeId,
                name: selectedRequest.employeeName,
                email: selectedRequest.employeeEmail,
                department: selectedRequest.department,
                position: selectedRequest.position || '',
                hireDate: new Date('2021-04-01'),
                facilityType: 'acute',
                experienceLevel: 'junior',
                motivationType: 'growth',
                strengths: [],
                challenges: [],
                careerGoals: selectedRequest.consultationTopic
              }}
              onSave={(data) => console.log('Auto-saved:', data)}
              readOnly={false}
            />
          </CardContent>
        </Card>
      ) : (
        /* タブ表示 */
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              保留中 ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="today">
              本日予定 ({todayRequests.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              履歴
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertTitle>保留中の申込はありません</AlertTitle>
                <AlertDescription>
                  VoiceDriveからの新しい申込を待っています
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4">
                {pendingRequests.map(request => (
                  <VoiceDriveRequestItem
                    key={request.id}
                    request={request}
                    onStart={handleStartInterview}
                    isSelected={selectedRequest?.id === request.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            {todayRequests.length === 0 ? (
              <Alert>
                <Calendar className="w-4 h-4" />
                <AlertTitle>本日の予約はありません</AlertTitle>
                <AlertDescription>
                  本日実施予定の面談はありません
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4">
                {todayRequests.map(request => (
                  <VoiceDriveRequestItem
                    key={request.id}
                    request={request}
                    onStart={handleStartInterview}
                    isSelected={selectedRequest?.id === request.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                完了した面談の履歴は管理画面から確認できます
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      )}

      {/* 生成中の表示 */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-lg font-medium">面談シートを生成中...</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest?.employeeName}さんの相談内容に合わせた質問を準備しています
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}