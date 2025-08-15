'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle,
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Target,
  Brain,
  Heart,
  Briefcase,
  Users,
  Home,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2,
  RefreshCw,
  Send,
  FileText,
  Download
} from 'lucide-react';
import { 
  VoiceDriveIntegrationService,
  VoiceDriveInterviewRequest,
  VoiceDriveInterviewCategory,
  VoiceDriveStaffProfile,
  SyncStatus
} from '@/services/voicedriveIntegrationService';
import { 
  SupportInterviewService,
  SupportInterviewManual
} from '@/services/supportInterviewService';

// VoiceDriveリクエスト一覧のアイテム
interface RequestListItemProps {
  request: VoiceDriveInterviewRequest;
  onSelect: (request: VoiceDriveInterviewRequest) => void;
  isSelected: boolean;
}

function RequestListItem({ request, onSelect, isSelected }: RequestListItemProps) {
  const getCategoryIcon = (category: VoiceDriveInterviewCategory) => {
    const icons = {
      'career': <Briefcase className="w-4 h-4" />,
      'workplace': <Home className="w-4 h-4" />,
      'relationships': <Users className="w-4 h-4" />,
      'worklife': <Clock className="w-4 h-4" />,
      'health': <Heart className="w-4 h-4" />,
      'skills': <Brain className="w-4 h-4" />,
      'evaluation': <Target className="w-4 h-4" />,
      'other': <MessageCircle className="w-4 h-4" />
    };
    return icons[category] || <MessageCircle className="w-4 h-4" />;
  };

  const getUrgencyColor = (urgency: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getCategoryLabel = (category: VoiceDriveInterviewCategory) => {
    const labels = {
      'career': 'キャリア相談',
      'workplace': '職場環境',
      'relationships': '人間関係',
      'worklife': 'ワークライフ',
      'health': '健康・メンタル',
      'skills': 'スキル・研修',
      'evaluation': '評価・処遇',
      'other': 'その他'
    };
    return labels[category] || category;
  };

  return (
    <Card 
      className={`cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-accent'}`}
      onClick={() => onSelect(request)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getCategoryIcon(request.category)}
            <span className="font-medium">{getCategoryLabel(request.category)}</span>
          </div>
          <Badge variant={getUrgencyColor(request.urgency)}>
            {request.urgency === 'urgent' ? '緊急' : 
             request.urgency === 'high' ? '高' :
             request.urgency === 'medium' ? '中' : '低'}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-3 h-3" />
            <span>{request.employeeName}</span>
            <span className="text-muted-foreground">({request.department})</span>
          </div>
          
          <p className="text-sm font-medium mt-2">{request.consultationTopic}</p>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {request.consultationDetails}
          </p>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(request.requestedAt).toLocaleDateString('ja-JP')}
            </span>
            <span>
              希望: {request.preferredLocation === 'online' ? 'オンライン' :
                    request.preferredLocation === 'face-to-face' ? '対面' : 'どちらでも'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// メインコンポーネント
export default function SupportInterviewFlow() {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState<VoiceDriveInterviewRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VoiceDriveInterviewRequest | null>(null);
  const [staffProfile, setStaffProfile] = useState<VoiceDriveStaffProfile | null>(null);
  const [manual, setManual] = useState<SupportInterviewManual | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConducting, setIsConducting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Map<string, any>>(new Map());
  const [interviewProgress, setInterviewProgress] = useState(0);

  // 初期データ取得
  useEffect(() => {
    fetchRequests();
    fetchSyncStatus();
    
    // 定期同期の開始
    const interval = setInterval(() => {
      fetchRequests();
      fetchSyncStatus();
    }, 60000); // 1分ごと
    
    return () => clearInterval(interval);
  }, []);

  // リクエスト取得
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // 実際の実装ではVoiceDriveIntegrationServiceを使用
      // const newRequests = await VoiceDriveIntegrationService.fetchInterviewRequests();
      
      // モックデータ
      const mockRequests: VoiceDriveInterviewRequest[] = [
        {
          id: 'req_001',
          requestId: 'VD_REQ_001',
          employeeId: 'EMP_001',
          employeeName: '田中美咲',
          employeeEmail: 'tanaka@example.com',
          department: '外来看護部',
          position: '看護師',
          requestType: 'support_interview',
          category: 'career',
          subcategory: 'promotion',
          consultationTopic: '主任への昇進について',
          consultationDetails: '来年度の主任昇進試験を受けたいと考えています。準備の仕方や必要なスキルについて相談したいです。',
          urgency: 'medium',
          preferredDates: [new Date('2024-03-20'), new Date('2024-03-21')],
          preferredTime: 'afternoon',
          preferredLocation: 'face-to-face',
          requestedAt: new Date('2024-03-15'),
          requestedVia: 'voicedrive_app',
          status: 'pending',
          statusHistory: []
        },
        {
          id: 'req_002',
          requestId: 'VD_REQ_002',
          employeeId: 'EMP_002',
          employeeName: '佐藤健一',
          employeeEmail: 'sato@example.com',
          department: 'リハビリテーション科',
          position: '理学療法士',
          requestType: 'support_interview',
          category: 'health',
          subcategory: 'stress',
          consultationTopic: '業務ストレスとワークライフバランス',
          consultationDetails: '最近、残業が続いており、家族との時間が取れません。ストレスも溜まっており、体調にも影響が出始めています。',
          urgency: 'high',
          preferredDates: [new Date('2024-03-18')],
          preferredTime: 'morning',
          preferredLocation: 'online',
          requestedAt: new Date('2024-03-16'),
          requestedVia: 'voicedrive_app',
          status: 'pending',
          statusHistory: []
        },
        {
          id: 'req_003',
          requestId: 'VD_REQ_003',
          employeeId: 'EMP_003',
          employeeName: '山田太郎',
          employeeEmail: 'yamada@example.com',
          department: '看護部',
          position: '看護補助者',
          requestType: 'support_interview',
          category: 'relationships',
          subcategory: 'supervisor',
          consultationTopic: '上司とのコミュニケーション改善',
          consultationDetails: '新しい主任との意思疎通がうまくいかず、指示の理解に齟齬が生じることがあります。関係改善のアドバイスをいただきたいです。',
          urgency: 'medium',
          preferredDates: [new Date('2024-03-22'), new Date('2024-03-23')],
          preferredTime: 'anytime',
          preferredLocation: 'either',
          requestedAt: new Date('2024-03-14'),
          requestedVia: 'voicedrive_web',
          status: 'pending',
          statusHistory: []
        }
      ];
      
      setRequests(mockRequests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 同期ステータス取得
  const fetchSyncStatus = async () => {
    try {
      // const status = VoiceDriveIntegrationService.getSyncStatus();
      
      // モックデータ
      const mockStatus: SyncStatus = {
        lastSyncTime: new Date(),
        nextSyncTime: new Date(Date.now() + 60000),
        pendingRequests: 3,
        syncErrors: [],
        isConnected: true,
        serverStatus: 'online'
      };
      
      setSyncStatus(mockStatus);
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
    }
  };

  // リクエスト選択時の処理
  const handleRequestSelect = async (request: VoiceDriveInterviewRequest) => {
    setSelectedRequest(request);
    setActiveTab('detail');
    
    // 職員プロファイル取得
    try {
      // const profile = await VoiceDriveIntegrationService.getStaffProfile(request.employeeId);
      
      // モックデータ
      const mockProfile: VoiceDriveStaffProfile = {
        employeeId: request.employeeId,
        displayName: request.employeeName,
        department: request.department,
        position: request.position,
        joinDate: new Date('2020-04-01'),
        activityLevel: 'medium',
        lastActiveAt: new Date(),
        postCount: 42,
        connectionCount: 18,
        interviewHistory: {
          totalCount: 3,
          lastInterviewDate: new Date('2024-01-15'),
          frequentCategories: ['career', 'skills']
        },
        preferences: {
          notificationEnabled: true,
          preferredContactMethod: 'app',
          language: 'ja'
        }
      };
      
      setStaffProfile(mockProfile);
    } catch (error) {
      console.error('Failed to fetch staff profile:', error);
    }
  };

  // マニュアル生成
  const generateManual = async () => {
    if (!selectedRequest) return;
    
    setIsGenerating(true);
    try {
      const generatedManual = await SupportInterviewService.generateFromVoiceDriveRequest(
        selectedRequest,
        staffProfile
      );
      
      setManual(generatedManual);
      setActiveTab('manual');
    } catch (error) {
      console.error('Failed to generate manual:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 面談実施開始
  const startInterview = () => {
    if (!manual) return;
    
    setIsConducting(true);
    setCurrentSection(0);
    setResponses(new Map());
    setInterviewProgress(0);
    setActiveTab('conduct');
  };

  // 次のセクションへ
  const nextSection = () => {
    if (!manual) return;
    
    if (currentSection < manual.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setInterviewProgress((currentSection + 1) / manual.sections.length * 100);
    } else {
      completeInterview();
    }
  };

  // 前のセクションへ
  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setInterviewProgress((currentSection - 1) / manual.sections.length * 100);
    }
  };

  // 面談完了
  const completeInterview = async () => {
    if (!manual || !selectedRequest) return;
    
    const interviewData = {
      manualId: manual.id,
      requestId: selectedRequest.requestId,
      responses: Object.fromEntries(responses),
      completedAt: new Date(),
      duration: manual.requestInfo?.preferredDuration || 30
    };
    
    // 面談結果の処理
    await SupportInterviewService.processInterviewCompletion(
      manual,
      interviewData,
      { satisfactionScore: 4, resolutionStatus: 'resolved', requiresFollowUp: false }
    );
    
    // VoiceDriveへの通知
    // await VoiceDriveIntegrationService.sendInterviewResult(interviewData, selectedRequest.requestId);
    
    setIsConducting(false);
    setActiveTab('completed');
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">サポート面談管理</h2>
          <p className="text-muted-foreground">VoiceDriveからの面談申込対応</p>
        </div>
        
        {/* 同期ステータス */}
        {syncStatus && (
          <Card className="w-64">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${syncStatus.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">
                    {syncStatus.isConnected ? 'オンライン' : 'オフライン'}
                  </span>
                </div>
                <Button size="sm" variant="ghost" onClick={fetchRequests}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                最終同期: {syncStatus.lastSyncTime.toLocaleTimeString('ja-JP')}
              </div>
              {syncStatus.pendingRequests > 0 && (
                <Badge variant="secondary" className="mt-1">
                  {syncStatus.pendingRequests}件の新規申込
                </Badge>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="requests">申込一覧</TabsTrigger>
          <TabsTrigger value="detail" disabled={!selectedRequest}>詳細</TabsTrigger>
          <TabsTrigger value="manual" disabled={!manual}>マニュアル</TabsTrigger>
          <TabsTrigger value="conduct" disabled={!isConducting}>実施</TabsTrigger>
          <TabsTrigger value="completed">完了</TabsTrigger>
        </TabsList>

        {/* 申込一覧 */}
        <TabsContent value="requests" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : requests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">新しい面談申込はありません</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {requests.map(request => (
                <RequestListItem
                  key={request.id}
                  request={request}
                  onSelect={handleRequestSelect}
                  isSelected={selectedRequest?.id === request.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* 詳細 */}
        <TabsContent value="detail">
          {selectedRequest && (
            <Card>
              <CardHeader>
                <CardTitle>面談申込詳細</CardTitle>
                <CardDescription>
                  申込ID: {selectedRequest.requestId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 申込者情報 */}
                <div>
                  <h3 className="font-semibold mb-3">申込者情報</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>氏名</Label>
                      <p>{selectedRequest.employeeName}</p>
                    </div>
                    <div>
                      <Label>所属</Label>
                      <p>{selectedRequest.department}</p>
                    </div>
                    <div>
                      <Label>職種</Label>
                      <p>{selectedRequest.position}</p>
                    </div>
                    <div>
                      <Label>メール</Label>
                      <p>{selectedRequest.employeeEmail}</p>
                    </div>
                  </div>
                </div>

                {/* 相談内容 */}
                <div>
                  <h3 className="font-semibold mb-3">相談内容</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>カテゴリ</Label>
                      <Badge>{selectedRequest.category}</Badge>
                    </div>
                    <div>
                      <Label>相談トピック</Label>
                      <p className="font-medium">{selectedRequest.consultationTopic}</p>
                    </div>
                    <div>
                      <Label>詳細</Label>
                      <p className="text-sm">{selectedRequest.consultationDetails}</p>
                    </div>
                    <div>
                      <Label>緊急度</Label>
                      <Badge variant={
                        selectedRequest.urgency === 'urgent' ? 'destructive' :
                        selectedRequest.urgency === 'high' ? 'warning' :
                        'secondary'
                      }>
                        {selectedRequest.urgency}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* 希望条件 */}
                <div>
                  <h3 className="font-semibold mb-3">希望条件</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>希望日時</Label>
                      <p>{selectedRequest.preferredDates.map(d => 
                        new Date(d).toLocaleDateString('ja-JP')
                      ).join(', ')}</p>
                    </div>
                    <div>
                      <Label>希望時間帯</Label>
                      <p>{selectedRequest.preferredTime}</p>
                    </div>
                    <div>
                      <Label>実施形式</Label>
                      <p>{selectedRequest.preferredLocation}</p>
                    </div>
                  </div>
                </div>

                {/* アクション */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    却下
                  </Button>
                  <Button onClick={generateManual} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        マニュアル生成
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* マニュアル */}
        <TabsContent value="manual">
          {manual && (
            <Card>
              <CardHeader>
                <CardTitle>{manual.title}</CardTitle>
                <CardDescription>
                  推奨時間: {manual.requestInfo?.preferredDuration}分
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {/* 事前準備 */}
                    <div>
                      <h3 className="font-semibold mb-3">事前準備</h3>
                      <div className="space-y-2">
                        {manual.preparation?.reviewPoints.map((point, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 text-green-600" />
                            <span className="text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* アプローチ戦略 */}
                    <div>
                      <h3 className="font-semibold mb-3">アプローチ戦略</h3>
                      <Alert>
                        <Info className="w-4 h-4" />
                        <AlertTitle>初期アプローチ</AlertTitle>
                        <AlertDescription>
                          {manual.approachStrategy?.initialApproach}
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* セクション */}
                    <div>
                      <h3 className="font-semibold mb-3">面談セクション</h3>
                      <div className="space-y-4">
                        {manual.sections?.map((section, i) => (
                          <Card key={i}>
                            <CardHeader>
                              <CardTitle className="text-base">
                                {section.title} ({section.duration}分)
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {section.questions?.map((q, j) => (
                                  <div key={j} className="border-l-2 pl-3 py-1">
                                    <p className="text-sm font-medium">{q.text}</p>
                                    {q.tips && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        💡 {q.tips}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* アクション */}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        PDFダウンロード
                      </Button>
                      <Button onClick={startInterview}>
                        <ChevronRight className="w-4 h-4 mr-2" />
                        面談開始
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 実施 */}
        <TabsContent value="conduct">
          {isConducting && manual && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>面談実施中</CardTitle>
                  <Badge>
                    セクション {currentSection + 1} / {manual.sections?.length || 0}
                  </Badge>
                </div>
                <Progress value={interviewProgress} className="mt-2" />
              </CardHeader>
              <CardContent>
                {manual.sections && manual.sections[currentSection] && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {manual.sections[currentSection].title}
                      </h3>
                      
                      <div className="space-y-4">
                        {manual.sections[currentSection].questions?.map((question, i) => (
                          <div key={i} className="space-y-2">
                            <Label>{question.text}</Label>
                            <Textarea
                              placeholder="回答を入力..."
                              value={responses.get(`${currentSection}_${i}`) || ''}
                              onChange={(e) => {
                                const newResponses = new Map(responses);
                                newResponses.set(`${currentSection}_${i}`, e.target.value);
                                setResponses(newResponses);
                              }}
                              rows={4}
                            />
                            {question.tips && (
                              <p className="text-xs text-muted-foreground">
                                💡 {question.tips}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={prevSection}
                        disabled={currentSection === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        前へ
                      </Button>
                      
                      <Button onClick={nextSection}>
                        {currentSection === manual.sections.length - 1 ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            完了
                          </>
                        ) : (
                          <>
                            次へ
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 完了 */}
        <TabsContent value="completed">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">面談が完了しました</h3>
              <p className="text-muted-foreground mb-6">
                面談結果はVoiceDriveに送信されました
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => {
                  setSelectedRequest(null);
                  setManual(null);
                  setActiveTab('requests');
                }}>
                  一覧に戻る
                </Button>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  レポート表示
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}