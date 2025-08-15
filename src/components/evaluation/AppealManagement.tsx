'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileText,
  MessageSquare,
  User,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Download,
  Upload,
  Eye,
  AlertTriangle,
  Shield,
  TrendingUp,
  RefreshCw,
  XCircle,
  FileUp,
  MessageCircle,
  ChevronRight,
  BarChart3,
  FileCheck
} from 'lucide-react';
import { AppealRequest, AppealStatus, AppealCategory } from '../../../mcp-shared/interfaces/appeal.interface';
import { toast } from 'sonner';

interface AppealRecord {
  appealId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  evaluationPeriod: string;
  appealCategory: AppealCategory;
  appealReason: string;
  originalScore?: number;
  requestedScore?: number;
  finalScore?: number;
  status: AppealStatus;
  filedDate: string;
  lastUpdated: string;
  evidenceDocuments?: string[];
  reviewerComments?: string;
  priority?: 'high' | 'medium' | 'low';
}

export default function AppealManagement() {
  const [activeTab, setActiveTab] = useState('submit');
  const [appeals, setAppeals] = useState<AppealRecord[]>([]);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealRecord | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // フォーム状態
  const [formData, setFormData] = useState<Partial<AppealRequest>>({
    employeeId: '',
    employeeName: '',
    evaluationPeriod: '2025年度上期',
    appealCategory: AppealCategory.OTHER,
    appealReason: '',
    originalScore: undefined,
    requestedScore: undefined,
    evidenceDocuments: []
  });

  // 評価期間リストを取得
  const [evaluationPeriods, setEvaluationPeriods] = useState<any[]>([]);
  
  useEffect(() => {
    fetchEvaluationPeriods();
    fetchAppeals();
  }, []);

  const fetchEvaluationPeriods = async () => {
    try {
      const response = await fetch('/api/v1/evaluation/periods');
      const data = await response.json();
      if (data.success) {
        const activePeriods = data.periods.filter((p: any) => 
          new Date(p.appealDeadline) > new Date()
        );
        setEvaluationPeriods(activePeriods);
      }
    } catch (error) {
      console.error('Failed to fetch evaluation periods:', error);
    }
  };

  const fetchAppeals = async () => {
    try {
      const response = await fetch('/api/v1/appeals/submit?employeeId=current');
      const data = await response.json();
      if (data.success && data.data) {
        setAppeals(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch appeals:', error);
    }
  };

  const handleSubmitAppeal = async () => {
    setIsLoading(true);
    try {
      // バリデーション
      if (!formData.appealReason || formData.appealReason.length < 100) {
        toast.error('申し立て理由は100文字以上入力してください');
        return;
      }

      const response = await fetch('/api/v1/appeals/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('異議申し立てを受け付けました');
        setShowSubmitDialog(false);
        fetchAppeals();
        resetForm();
      } else {
        toast.error(data.error?.message || '申し立ての送信に失敗しました');
      }
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (appealId: string) => {
    if (!confirm('異議申し立てを取り下げますか？')) return;
    
    try {
      const response = await fetch(`/api/v1/appeals/submit?appealId=${appealId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('異議申し立てを取り下げました');
        fetchAppeals();
      }
    } catch (error) {
      toast.error('取り下げに失敗しました');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}は10MBを超えています`);
        return false;
      }
      return true;
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      evaluationPeriod: '2025年度上期',
      appealCategory: AppealCategory.OTHER,
      appealReason: '',
      originalScore: undefined,
      requestedScore: undefined,
      evidenceDocuments: []
    });
    setUploadedFiles([]);
  };

  const getStatusBadge = (status: AppealStatus) => {
    const statusConfig = {
      [AppealStatus.RECEIVED]: { color: 'bg-blue-100 text-blue-800', label: '受理済み' },
      [AppealStatus.UNDER_REVIEW]: { color: 'bg-yellow-100 text-yellow-800', label: '審査中' },
      [AppealStatus.ADDITIONAL_INFO]: { color: 'bg-orange-100 text-orange-800', label: '追加情報待ち' },
      [AppealStatus.RESOLVED]: { color: 'bg-green-100 text-green-800', label: '解決済み' },
      [AppealStatus.WITHDRAWN]: { color: 'bg-gray-100 text-gray-800', label: '取り下げ' },
      [AppealStatus.REJECTED]: { color: 'bg-red-100 text-red-800', label: '却下' }
    };
    const config = statusConfig[status] || { color: '', label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{priority}</Badge>;
  };

  // 統計計算
  const statistics = {
    total: appeals.length,
    pending: appeals.filter(a => a.status === AppealStatus.RECEIVED).length,
    reviewing: appeals.filter(a => a.status === AppealStatus.UNDER_REVIEW).length,
    resolved: appeals.filter(a => a.status === AppealStatus.RESOLVED).length,
    rejected: appeals.filter(a => a.status === AppealStatus.REJECTED).length
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー統計 */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総申し立て数</p>
                <p className="text-2xl font-bold">{statistics.total}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">受理待ち</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">審査中</p>
                <p className="text-2xl font-bold text-yellow-600">{statistics.reviewing}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">解決済み</p>
                <p className="text-2xl font-bold text-green-600">{statistics.resolved}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">却下</p>
                <p className="text-2xl font-bold text-red-600">{statistics.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="submit">新規申し立て</TabsTrigger>
          <TabsTrigger value="list">申し立て一覧</TabsTrigger>
          <TabsTrigger value="timeline">審査状況</TabsTrigger>
          <TabsTrigger value="guide">ガイド</TabsTrigger>
        </TabsList>

        {/* 新規申し立てタブ */}
        <TabsContent value="submit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>異議申し立てフォーム</CardTitle>
              <CardDescription>
                評価結果に対する異議申し立てを行います。申し立て理由は100文字以上で詳細に記載してください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>申し立て期限</AlertTitle>
                <AlertDescription>
                  評価開示後2週間以内に申し立てを行ってください。期限を過ぎると受付できません。
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">職員ID</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    placeholder="E001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeName">職員名</Label>
                  <Input
                    id="employeeName"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                    placeholder="山田 太郎"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="evaluationPeriod">評価期間</Label>
                  <Select 
                    value={formData.evaluationPeriod}
                    onValueChange={(value) => setFormData({...formData, evaluationPeriod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="評価期間を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {evaluationPeriods.map(period => (
                        <SelectItem key={period.id} value={period.name}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">申し立てカテゴリー</Label>
                  <Select 
                    value={formData.appealCategory}
                    onValueChange={(value) => setFormData({...formData, appealCategory: value as AppealCategory})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AppealCategory.CRITERIA_MISINTERPRETATION}>評価基準の誤解釈</SelectItem>
                      <SelectItem value={AppealCategory.ACHIEVEMENT_OVERSIGHT}>成果の見落とし</SelectItem>
                      <SelectItem value={AppealCategory.PERIOD_ERROR}>評価期間の誤り</SelectItem>
                      <SelectItem value={AppealCategory.CALCULATION_ERROR}>点数計算の誤り</SelectItem>
                      <SelectItem value={AppealCategory.OTHER}>その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalScore">現在の評価点</Label>
                  <Input
                    id="originalScore"
                    type="number"
                    value={formData.originalScore || ''}
                    onChange={(e) => setFormData({...formData, originalScore: parseInt(e.target.value)})}
                    placeholder="73"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requestedScore">希望する評価点</Label>
                  <Input
                    id="requestedScore"
                    type="number"
                    value={formData.requestedScore || ''}
                    onChange={(e) => setFormData({...formData, requestedScore: parseInt(e.target.value)})}
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">申し立て理由（100文字以上）</Label>
                <Textarea
                  id="reason"
                  value={formData.appealReason}
                  onChange={(e) => setFormData({...formData, appealReason: e.target.value})}
                  placeholder="評価に対する異議の詳細な理由を記載してください..."
                  className="min-h-[150px]"
                />
                <p className="text-sm text-gray-600">
                  文字数: {formData.appealReason?.length || 0} / 100文字以上
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence">証拠書類（任意）</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <Input
                    id="evidence"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="evidence" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">クリックしてファイルを選択</span>
                      <span className="text-xs text-gray-500">PDF、画像ファイル（最大10MB）</span>
                    </div>
                  </label>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          >
                            削除
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>クリア</Button>
                <Button onClick={handleSubmitAppeal} disabled={isLoading}>
                  {isLoading ? '送信中...' : '異議申し立てを送信'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 申し立て一覧タブ */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>異議申し立て履歴</CardTitle>
              <CardDescription>
                過去の異議申し立ての状況を確認できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>申立ID</TableHead>
                    <TableHead>評価期間</TableHead>
                    <TableHead>カテゴリー</TableHead>
                    <TableHead>申立日</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>優先度</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appeals.map((appeal) => (
                    <TableRow key={appeal.appealId}>
                      <TableCell className="font-mono text-sm">{appeal.appealId}</TableCell>
                      <TableCell>{appeal.evaluationPeriod}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {appeal.appealCategory === AppealCategory.CALCULATION_ERROR ? '計算誤り' :
                           appeal.appealCategory === AppealCategory.ACHIEVEMENT_OVERSIGHT ? '成果見落とし' :
                           appeal.appealCategory === AppealCategory.CRITERIA_MISINTERPRETATION ? '基準誤解釈' :
                           appeal.appealCategory === AppealCategory.PERIOD_ERROR ? '期間誤り' : 'その他'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(appeal.filedDate).toLocaleDateString('ja-JP')}</TableCell>
                      <TableCell>{getStatusBadge(appeal.status)}</TableCell>
                      <TableCell>{getPriorityBadge(appeal.priority)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAppeal(appeal);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {appeal.status === AppealStatus.RECEIVED && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleWithdraw(appeal.appealId)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 審査状況タブ */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>審査プロセス</CardTitle>
              <CardDescription>
                異議申し立ての審査フローと現在の状況
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {appeals.filter(a => a.status !== AppealStatus.WITHDRAWN).map((appeal) => (
                  <div key={appeal.appealId} className="relative pl-8 pb-8 border-l-2 border-gray-200">
                    <div className="absolute -left-2 w-4 h-4 bg-blue-600 rounded-full" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{appeal.appealId}</h4>
                        {getStatusBadge(appeal.status)}
                      </div>
                      <p className="text-sm text-gray-600">{appeal.employeeName} - {appeal.evaluationPeriod}</p>
                      <p className="text-sm">{appeal.appealReason.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>申立日: {new Date(appeal.filedDate).toLocaleDateString('ja-JP')}</span>
                        <span>更新日: {new Date(appeal.lastUpdated).toLocaleDateString('ja-JP')}</span>
                      </div>
                      {appeal.reviewerComments && (
                        <Alert>
                          <MessageCircle className="h-4 w-4" />
                          <AlertDescription>
                            審査コメント: {appeal.reviewerComments}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ガイドタブ */}
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>異議申し立てガイド</CardTitle>
              <CardDescription>
                異議申し立ての手順と注意事項
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">申し立て可能な理由</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
                    <h4 className="font-medium">計算誤り</h4>
                    <p className="text-sm text-gray-600">評価点数の計算に誤りがある場合</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <FileCheck className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-medium">成果の見落とし</h4>
                    <p className="text-sm text-gray-600">実績が正しく評価されていない場合</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                    <h4 className="font-medium">期間の誤り</h4>
                    <p className="text-sm text-gray-600">評価対象期間に誤りがある場合</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                    <h4 className="font-medium">基準の誤解釈</h4>
                    <p className="text-sm text-gray-600">評価基準の適用に誤りがある場合</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">申し立てプロセス</h3>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
                    <div>
                      <p className="font-medium">申し立て内容の準備</p>
                      <p className="text-sm text-gray-600">理由を明確にし、必要な証拠書類を収集します</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
                    <div>
                      <p className="font-medium">フォームへの入力</p>
                      <p className="text-sm text-gray-600">100文字以上の詳細な理由を記載します</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
                    <div>
                      <p className="font-medium">審査</p>
                      <p className="text-sm text-gray-600">3週間以内に審査結果が通知されます</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">4</span>
                    <div>
                      <p className="font-medium">結果通知</p>
                      <p className="text-sm text-gray-600">審査結果と最終評価が確定します</p>
                    </div>
                  </li>
                </ol>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>重要な注意事項</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>評価開示後2週間以内に申し立てを行ってください</li>
                    <li>虚偽の内容による申し立ては処分の対象となります</li>
                    <li>一度取り下げた申し立ては再提出できません</li>
                    <li>審査中の追加情報提出は1回まで可能です</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 詳細ダイアログ */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>異議申し立て詳細</DialogTitle>
            <DialogDescription>
              申し立てID: {selectedAppeal?.appealId}
            </DialogDescription>
          </DialogHeader>
          {selectedAppeal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>職員名</Label>
                  <p className="font-medium">{selectedAppeal.employeeName}</p>
                </div>
                <div>
                  <Label>評価期間</Label>
                  <p className="font-medium">{selectedAppeal.evaluationPeriod}</p>
                </div>
                <div>
                  <Label>カテゴリー</Label>
                  <p className="font-medium">{selectedAppeal.appealCategory}</p>
                </div>
                <div>
                  <Label>ステータス</Label>
                  <div className="mt-1">{getStatusBadge(selectedAppeal.status)}</div>
                </div>
                <div>
                  <Label>現在の評価点</Label>
                  <p className="font-medium">{selectedAppeal.originalScore || '-'}</p>
                </div>
                <div>
                  <Label>希望する評価点</Label>
                  <p className="font-medium">{selectedAppeal.requestedScore || '-'}</p>
                </div>
              </div>
              <div>
                <Label>申し立て理由</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded">{selectedAppeal.appealReason}</p>
              </div>
              {selectedAppeal.reviewerComments && (
                <div>
                  <Label>審査コメント</Label>
                  <p className="mt-1 p-3 bg-blue-50 rounded">{selectedAppeal.reviewerComments}</p>
                </div>
              )}
              {selectedAppeal.evidenceDocuments && selectedAppeal.evidenceDocuments.length > 0 && (
                <div>
                  <Label>添付書類</Label>
                  <div className="mt-2 space-y-1">
                    {selectedAppeal.evidenceDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
