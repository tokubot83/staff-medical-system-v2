'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
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
  Printer,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Download,
  Upload,
  Eye,
  ChevronRight,
  Users,
  Bell,
  Smartphone,
  Mail,
  ClipboardCheck,
  MessageCircle,
  AlertTriangle,
  Shield,
  TrendingUp,
  Sparkles,
  BookOpen,
  CheckSquare
} from 'lucide-react';
import styles from './DisclosureManagement.module.css';

interface DisclosureRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  evaluationScore: number;
  grade: string;
  disclosureStatus: 'pending' | 'paper-printed' | 'paper-delivered' | 'sns-sent' | 'feedback-scheduled' | 'completed';
  paperStatus?: 'not-printed' | 'printed' | 'delivered' | 'signed';
  snsStatus?: 'not-sent' | 'sent' | 'read' | 'responded';
  feedbackDate?: string;
  feedbackNotes?: string;
  appealStatus?: 'none' | 'filed' | 'reviewing' | 'resolved';
  appealReason?: string;
  isDynamic?: boolean;
}

interface AppealCase {
  id: string;
  staffName: string;
  filedDate: string;
  reason: string;
  category: string;
  status: 'filed' | 'reviewing' | 'additional-info' | 'resolved';
  originalScore: number;
  requestedScore?: number;
  finalScore?: number;
  reviewerNotes?: string;
}

export default function DisclosureManagement() {
  const [activeTab, setActiveTab] = useState('disclosure');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showSNSDialog, setShowSNSDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<DisclosureRecord | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  // モックデータ
  const [disclosureRecords, setDisclosureRecords] = useState<DisclosureRecord[]>([
    {
      id: '1',
      staffId: 'EMP001',
      staffName: '山田 太郎',
      department: '看護部',
      evaluationScore: 80,
      grade: 'A',
      disclosureStatus: 'paper-printed',
      paperStatus: 'printed',
      snsStatus: 'not-sent',
      isDynamic: true
    },
    {
      id: '2',
      staffId: 'EMP002',
      staffName: '佐藤 花子',
      department: '看護部',
      evaluationScore: 87,
      grade: 'S',
      disclosureStatus: 'completed',
      paperStatus: 'signed',
      snsStatus: 'responded',
      feedbackDate: '2025-04-15',
      feedbackNotes: '評価について理解。次年度目標を設定済み。'
    },
    {
      id: '3',
      staffId: 'EMP003',
      staffName: '鈴木 一郎',
      department: '介護部',
      evaluationScore: 68,
      grade: 'B',
      disclosureStatus: 'pending',
      paperStatus: 'not-printed',
      snsStatus: 'not-sent',
      appealStatus: 'filed',
      appealReason: '技術評価の一部項目について再考を希望'
    }
  ]);

  const [appealCases, setAppealCases] = useState<AppealCase[]>([
    {
      id: 'AP001',
      staffName: '鈴木 一郎',
      filedDate: '2025-04-10',
      reason: '技術評価の項目3について、実績が適切に評価されていない',
      category: '評価基準の誤解釈',
      status: 'reviewing',
      originalScore: 68,
      requestedScore: 75
    },
    {
      id: 'AP002',
      staffName: '高橋 さゆり',
      filedDate: '2025-04-08',
      reason: '研修講師活動が貢献度に反映されていない',
      category: '成果の見落とし',
      status: 'additional-info',
      originalScore: 73,
      requestedScore: 78
    }
  ]);

  // 統計情報
  const statistics = {
    totalStaff: disclosureRecords.length,
    paperPrinted: disclosureRecords.filter(r => r.paperStatus === 'printed' || r.paperStatus === 'delivered' || r.paperStatus === 'signed').length,
    paperDelivered: disclosureRecords.filter(r => r.paperStatus === 'delivered' || r.paperStatus === 'signed').length,
    snsSent: disclosureRecords.filter(r => r.snsStatus === 'sent' || r.snsStatus === 'read' || r.snsStatus === 'responded').length,
    feedbackCompleted: disclosureRecords.filter(r => r.feedbackDate).length,
    appealsActive: appealCases.filter(a => a.status !== 'resolved').length,
    dynamicEvaluations: disclosureRecords.filter(r => r.isDynamic).length
  };

  // 紙配布処理
  const handlePaperPrint = () => {
    const selectedItems = disclosureRecords.filter(r => selectedRecords.includes(r.id));
    // 印刷処理のロジック
    setDisclosureRecords(prev => prev.map(r => 
      selectedRecords.includes(r.id) 
        ? { ...r, paperStatus: 'printed' as const, disclosureStatus: 'paper-printed' as const }
        : r
    ));
    setShowPrintDialog(false);
    setSelectedRecords([]);
  };

  // VoiceDrive SNS送信
  const handleSNSSend = () => {
    const selectedItems = disclosureRecords.filter(r => selectedRecords.includes(r.id));
    // SNS送信処理のロジック
    setDisclosureRecords(prev => prev.map(r => 
      selectedRecords.includes(r.id) 
        ? { ...r, snsStatus: 'sent' as const, disclosureStatus: r.paperStatus === 'delivered' ? 'completed' : 'sns-sent' as const }
        : r
    ));
    setShowSNSDialog(false);
    setSelectedRecords([]);
  };

  // フィードバック記録
  const handleFeedbackSave = () => {
    if (!selectedStaff) return;
    
    setDisclosureRecords(prev => prev.map(r => 
      r.id === selectedStaff.id 
        ? { 
            ...r, 
            feedbackDate: new Date().toISOString().split('T')[0],
            feedbackNotes,
            disclosureStatus: 'completed' as const 
          }
        : r
    ));
    setShowFeedbackDialog(false);
    setSelectedStaff(null);
    setFeedbackNotes('');
  };

  // 選択切り替え
  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  // ステータスバッジの取得
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      'pending': { color: 'bg-gray-100 text-gray-800', label: '未開示' },
      'paper-printed': { color: 'bg-blue-100 text-blue-800', label: '印刷済' },
      'paper-delivered': { color: 'bg-green-100 text-green-800', label: '配布済' },
      'sns-sent': { color: 'bg-purple-100 text-purple-800', label: 'SNS送信済' },
      'feedback-scheduled': { color: 'bg-yellow-100 text-yellow-800', label: '面談予定' },
      'completed': { color: 'bg-green-100 text-green-800', label: '完了' }
    };
    const config = statusConfig[status] || { color: '', label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className={styles.container}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="disclosure">評価開示</TabsTrigger>
          <TabsTrigger value="appeal">異議申立</TabsTrigger>
        </TabsList>

        {/* 評価開示タブ */}
        <TabsContent value="disclosure" className="space-y-6">
          {/* 統計カード */}
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{statistics.totalStaff}</div>
                <div className="text-sm text-gray-600">対象職員</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{statistics.paperPrinted}</div>
                <div className="text-sm text-gray-600">印刷済</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{statistics.paperDelivered}</div>
                <div className="text-sm text-gray-600">配布済</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{statistics.snsSent}</div>
                <div className="text-sm text-gray-600">SNS送信</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{statistics.feedbackCompleted}</div>
                <div className="text-sm text-gray-600">面談完了</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  <Sparkles className="w-5 h-5 inline mr-1" />
                  {statistics.dynamicEvaluations}
                </div>
                <div className="text-sm text-gray-600">動的評価</div>
              </CardContent>
            </Card>
          </div>

          {/* 開示チャネル管理 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-blue-600" />
                  紙面配布（メイン）
                </CardTitle>
                <CardDescription>
                  正式な評価結果通知書として配布
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">配布進捗</span>
                    <span className="text-sm font-medium">
                      {statistics.paperDelivered} / {statistics.totalStaff}名
                    </span>
                  </div>
                  <Progress value={(statistics.paperDelivered / statistics.totalStaff) * 100} />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowPrintDialog(true)}
                      disabled={selectedRecords.length === 0}
                      className="flex-1"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      印刷実行 ({selectedRecords.length})
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      テンプレート
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  VoiceDrive SNS（補完）
                </CardTitle>
                <CardDescription>
                  詳細フィードバックと双方向コミュニケーション
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">送信進捗</span>
                    <span className="text-sm font-medium">
                      {statistics.snsSent} / {statistics.totalStaff}名
                    </span>
                  </div>
                  <Progress value={(statistics.snsSent / statistics.totalStaff) * 100} className="bg-purple-100" />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowSNSDialog(true)}
                      disabled={selectedRecords.length === 0}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      SNS送信 ({selectedRecords.length})
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      返信確認
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 開示管理テーブル */}
          <Card>
            <CardHeader>
              <CardTitle>開示管理</CardTitle>
              <CardDescription>
                職員への評価開示状況を管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedRecords(
                    selectedRecords.length === disclosureRecords.length 
                      ? [] 
                      : disclosureRecords.map(r => r.id)
                  )}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  {selectedRecords.length === disclosureRecords.length ? '全解除' : '全選択'}
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectedRecords.length === disclosureRecords.length}
                          onCheckedChange={() => setSelectedRecords(
                            selectedRecords.length === disclosureRecords.length 
                              ? [] 
                              : disclosureRecords.map(r => r.id)
                          )}
                        />
                      </TableHead>
                      <TableHead>職員名</TableHead>
                      <TableHead>部署</TableHead>
                      <TableHead>評価</TableHead>
                      <TableHead>開示状況</TableHead>
                      <TableHead>紙配布</TableHead>
                      <TableHead>SNS</TableHead>
                      <TableHead>面談</TableHead>
                      <TableHead>動的</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disclosureRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedRecords.includes(record.id)}
                            onCheckedChange={() => toggleRecordSelection(record.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {record.staffName}
                          {record.appealStatus === 'filed' && (
                            <Badge className="ml-2 bg-orange-100 text-orange-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              異議
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{record.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{record.evaluationScore}</span>
                            <Badge variant="outline">{record.grade}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.disclosureStatus)}</TableCell>
                        <TableCell>
                          {record.paperStatus === 'signed' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                          {record.paperStatus === 'delivered' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                          {record.paperStatus === 'printed' && <Printer className="w-4 h-4 text-gray-600" />}
                          {record.paperStatus === 'not-printed' && <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          {record.snsStatus === 'responded' && <MessageSquare className="w-4 h-4 text-green-600" />}
                          {record.snsStatus === 'read' && <Eye className="w-4 h-4 text-blue-600" />}
                          {record.snsStatus === 'sent' && <Send className="w-4 h-4 text-purple-600" />}
                          {record.snsStatus === 'not-sent' && <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          {record.feedbackDate ? (
                            <Badge className="bg-green-100 text-green-800">完了</Badge>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedStaff(record);
                                setShowFeedbackDialog(true);
                              }}
                            >
                              <Calendar className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.isDynamic && (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Sparkles className="w-3 h-3" />
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 開示プロセスタイムライン */}
          <Card>
            <CardHeader>
              <CardTitle>開示プロセス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>1</div>
                  <div className={styles.timelineContent}>
                    <h4>評価確定</h4>
                    <p className="text-sm text-gray-600">総合評価の最終確定</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>2</div>
                  <div className={styles.timelineContent}>
                    <h4>印刷・準備</h4>
                    <p className="text-sm text-gray-600">評価通知書の印刷</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>3</div>
                  <div className={styles.timelineContent}>
                    <h4>紙面配布</h4>
                    <p className="text-sm text-gray-600">各部署へ配布</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>4</div>
                  <div className={styles.timelineContent}>
                    <h4>SNS補完</h4>
                    <p className="text-sm text-gray-600">VoiceDriveで詳細通知</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>5</div>
                  <div className={styles.timelineContent}>
                    <h4>面談実施</h4>
                    <p className="text-sm text-gray-600">希望者への個別面談</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* 印刷ダイアログ */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>評価通知書印刷</DialogTitle>
            <DialogDescription>
              {selectedRecords.length}件の評価通知書を印刷します
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>印刷形式</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">標準フォーマット</SelectItem>
                  <SelectItem value="detailed">詳細フォーマット</SelectItem>
                  <SelectItem value="summary">要約フォーマット</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert>
              <Printer className="h-4 w-4" />
              <AlertDescription>
                印刷後は各部署の管理者に配布してください。
                受領確認書の回収も忘れずに行ってください。
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrintDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handlePaperPrint}>
              <Printer className="w-4 h-4 mr-2" />
              印刷実行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SNS送信ダイアログ */}
      <Dialog open={showSNSDialog} onOpenChange={setShowSNSDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>VoiceDrive SNS送信</DialogTitle>
            <DialogDescription>
              {selectedRecords.length}件の評価詳細をVoiceDriveで送信します
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>メッセージテンプレート</Label>
              <Textarea
                defaultValue="評価結果の詳細をお知らせします。ご確認の上、ご不明な点がありましたらお気軽にお問い合わせください。"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="enable-comments" defaultChecked />
              <Label htmlFor="enable-comments">コメント機能を有効にする</Label>
            </div>
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                VoiceDrive SNSは補完的な通知手段です。
                正式な通知は紙面配布で行ってください。
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSNSDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSNSSend} className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4 mr-2" />
              送信実行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* フィードバックダイアログ */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>フィードバック面談記録</DialogTitle>
            <DialogDescription>
              {selectedStaff?.staffName}さんとの面談内容を記録します
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>面談日</Label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <Label>面談内容・所感</Label>
              <Textarea
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="面談での話し合い内容、本人の反応、今後の目標など"
                rows={5}
              />
            </div>
            <div>
              <Label>フォローアップ</Label>
              <Select defaultValue="none">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">不要</SelectItem>
                  <SelectItem value="1month">1ヶ月後</SelectItem>
                  <SelectItem value="3months">3ヶ月後</SelectItem>
                  <SelectItem value="6months">6ヶ月後</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleFeedbackSave}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              記録保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}