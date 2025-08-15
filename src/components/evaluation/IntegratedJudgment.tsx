'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp,
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  Users,
  Building,
  Target,
  Award,
  Calculator,
  ChevronRight,
  AlertCircle,
  BarChart3,
  Filter,
  Search,
  Settings,
  Eye,
  Send,
  MessageSquare,
  Clock,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import styles from './IntegratedJudgment.module.css';

interface StaffEvaluation {
  id: string;
  name: string;
  department: string;
  position: string;
  experienceLevel: string;
  technicalScore: number | null;
  facilityContribution: number | null;
  corporateContribution: number | null;
  totalScore: number | null;
  facilityRank?: number;
  corporateRank?: number;
  finalGrade?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'approved' | 'rejected';
  approvalLevel?: number;
  comments?: string[];
  selected?: boolean;
  isDynamic?: boolean; // v3の動的生成フラグ
}

export default function IntegratedJudgment() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [batchAction, setBatchAction] = useState('');
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [batchComment, setBatchComment] = useState('');

  // モックデータ
  const [evaluations, setEvaluations] = useState<StaffEvaluation[]>([
    {
      id: '1',
      name: '山田 太郎',
      department: '看護部',
      position: '看護師',
      experienceLevel: 'young',
      technicalScore: 42,
      facilityContribution: 20,
      corporateContribution: 18,
      totalScore: 80,
      facilityRank: 15,
      corporateRank: 22,
      finalGrade: 'A',
      status: 'completed',
      approvalLevel: 1,
      isDynamic: true
    },
    {
      id: '2',
      name: '佐藤 花子',
      department: '看護部',
      position: '主任看護師',
      experienceLevel: 'midlevel',
      technicalScore: 45,
      facilityContribution: 22,
      corporateContribution: 20,
      totalScore: 87,
      facilityRank: 8,
      corporateRank: 12,
      finalGrade: 'S',
      status: 'approved',
      approvalLevel: 2
    },
    {
      id: '3',
      name: '鈴木 一郎',
      department: '介護部',
      position: '介護職員',
      experienceLevel: 'new',
      technicalScore: 35,
      facilityContribution: 18,
      corporateContribution: 15,
      totalScore: 68,
      facilityRank: 45,
      corporateRank: 50,
      finalGrade: 'B',
      status: 'in-progress',
      approvalLevel: 0
    }
  ]);

  // 2軸評価マトリックス
  const evaluationMatrix = {
    'S': { 'S': 'S+', 'A': 'S', 'B': 'A+', 'C': 'A', 'D': 'A' },
    'A': { 'S': 'S', 'A': 'A+', 'B': 'A', 'C': 'A', 'D': 'B' },
    'B': { 'S': 'A', 'A': 'A', 'B': 'B', 'C': 'B', 'D': 'C' },
    'C': { 'S': 'A', 'A': 'B', 'B': 'B', 'C': 'C', 'D': 'C' },
    'D': { 'S': 'B', 'A': 'B', 'B': 'C', 'C': 'C', 'D': 'D' }
  };

  // グレード分布の計算
  const gradeDistribution = {
    'S+': evaluations.filter(e => e.finalGrade === 'S+').length,
    'S': evaluations.filter(e => e.finalGrade === 'S').length,
    'A+': evaluations.filter(e => e.finalGrade === 'A+').length,
    'A': evaluations.filter(e => e.finalGrade === 'A').length,
    'B': evaluations.filter(e => e.finalGrade === 'B').length,
    'C': evaluations.filter(e => e.finalGrade === 'C').length,
    'D': evaluations.filter(e => e.finalGrade === 'D').length
  };

  // バッチ処理の実行
  const handleBatchAction = () => {
    if (!batchAction || selectedStaff.length === 0) return;

    switch (batchAction) {
      case 'approve':
        // 一括承認処理
        setEvaluations(prev => prev.map(e => 
          selectedStaff.includes(e.id) 
            ? { ...e, status: 'approved' as const, approvalLevel: (e.approvalLevel || 0) + 1 }
            : e
        ));
        break;
      case 'reject':
        // 一括却下処理
        setEvaluations(prev => prev.map(e => 
          selectedStaff.includes(e.id) 
            ? { ...e, status: 'rejected' as const }
            : e
        ));
        break;
      case 'export':
        // エクスポート処理
        console.log('Exporting selected evaluations...');
        break;
    }

    setShowBatchDialog(false);
    setSelectedStaff([]);
    setBatchComment('');
  };

  // 職員の選択
  const toggleStaffSelection = (staffId: string) => {
    setSelectedStaff(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  // 全選択/解除
  const toggleSelectAll = () => {
    if (selectedStaff.length === evaluations.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(evaluations.map(e => e.id));
    }
  };

  // ランクから評価を決定
  const getRankGrade = (rank: number, total: number): string => {
    const percentile = (rank / total) * 100;
    if (percentile <= 10) return 'S';
    if (percentile <= 30) return 'A';
    if (percentile <= 70) return 'B';
    if (percentile <= 90) return 'C';
    return 'D';
  };

  return (
    <div className={styles.container}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="batch">バッチ処理</TabsTrigger>
          <TabsTrigger value="matrix">2軸評価</TabsTrigger>
          <TabsTrigger value="approval">承認管理</TabsTrigger>
          <TabsTrigger value="report">レポート</TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                総合評価の仕組み
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.scoreCalculation}>
                <div className={styles.scoreComponent}>
                  <Target className="w-8 h-8 text-blue-600" />
                  <h4>技術評価</h4>
                  <div className={styles.scoreValue}>50点</div>
                  <p className="text-sm text-gray-600">3月実施</p>
                </div>
                <div className={styles.operator}>+</div>
                <div className={styles.scoreComponent}>
                  <Building className="w-8 h-8 text-green-600" />
                  <h4>施設貢献</h4>
                  <div className={styles.scoreValue}>25点</div>
                  <p className="text-sm text-gray-600">夏季+冬季</p>
                </div>
                <div className={styles.operator}>+</div>
                <div className={styles.scoreComponent}>
                  <Users className="w-8 h-8 text-purple-600" />
                  <h4>法人貢献</h4>
                  <div className={styles.scoreValue}>25点</div>
                  <p className="text-sm text-gray-600">夏季+冬季</p>
                </div>
                <div className={styles.operator}>=</div>
                <div className={styles.scoreComponent}>
                  <Award className="w-8 h-8 text-orange-600" />
                  <h4>総合評価</h4>
                  <div className={styles.scoreValue}>100点</div>
                  <p className="text-sm text-gray-600">最終グレード</p>
                </div>
              </div>

              {/* グレード分布 */}
              <div className={styles.gradeDistribution}>
                <h4 className="font-medium mb-4">現在のグレード分布</h4>
                <div className="grid grid-cols-7 gap-4">
                  {Object.entries(gradeDistribution).map(([grade, count]) => (
                    <div key={grade} className={styles.gradeCard}>
                      <div className={`${styles.gradeLabel} ${styles[`grade${grade.replace('+', 'Plus')}`]}`}>
                        {grade}
                      </div>
                      <div className={styles.gradeCount}>{count}名</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* v3動的生成統計 */}
              <Alert className="mt-4">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>動的評価シート利用状況</AlertTitle>
                <AlertDescription>
                  {evaluations.filter(e => e.isDynamic).length}名が動的生成された評価シートを使用
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* バッチ処理タブ */}
        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>バッチ処理</CardTitle>
              <CardDescription>
                複数の評価を一括で処理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* フィルター */}
              <div className="flex gap-4 mb-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全て</SelectItem>
                    <SelectItem value="pending">未処理</SelectItem>
                    <SelectItem value="in-progress">処理中</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                    <SelectItem value="approved">承認済</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="部署" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部署</SelectItem>
                    <SelectItem value="nursing">看護部</SelectItem>
                    <SelectItem value="care">介護部</SelectItem>
                    <SelectItem value="rehab">リハビリ部</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* バッチアクション */}
              <div className="flex gap-4 mb-4">
                <Button 
                  variant="outline"
                  onClick={toggleSelectAll}
                  disabled={evaluations.length === 0}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  {selectedStaff.length === evaluations.length ? '全解除' : '全選択'}
                </Button>
                <Button
                  variant="default"
                  disabled={selectedStaff.length === 0}
                  onClick={() => {
                    setBatchAction('approve');
                    setShowBatchDialog(true);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  一括承認 ({selectedStaff.length})
                </Button>
                <Button
                  variant="destructive"
                  disabled={selectedStaff.length === 0}
                  onClick={() => {
                    setBatchAction('reject');
                    setShowBatchDialog(true);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  一括却下 ({selectedStaff.length})
                </Button>
                <Button
                  variant="outline"
                  disabled={selectedStaff.length === 0}
                  onClick={() => {
                    setBatchAction('export');
                    setShowBatchDialog(true);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  エクスポート
                </Button>
              </div>

              {/* 評価リスト */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectedStaff.length === evaluations.length}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>職員名</TableHead>
                      <TableHead>部署</TableHead>
                      <TableHead>技術</TableHead>
                      <TableHead>施設</TableHead>
                      <TableHead>法人</TableHead>
                      <TableHead>合計</TableHead>
                      <TableHead>グレード</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>動的</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedStaff.includes(evaluation.id)}
                            onCheckedChange={() => toggleStaffSelection(evaluation.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{evaluation.name}</TableCell>
                        <TableCell>{evaluation.department}</TableCell>
                        <TableCell>{evaluation.technicalScore || '-'}</TableCell>
                        <TableCell>{evaluation.facilityContribution || '-'}</TableCell>
                        <TableCell>{evaluation.corporateContribution || '-'}</TableCell>
                        <TableCell className="font-bold">{evaluation.totalScore || '-'}</TableCell>
                        <TableCell>
                          {evaluation.finalGrade && (
                            <Badge className={styles[`grade${evaluation.finalGrade.replace('+', 'Plus')}`]}>
                              {evaluation.finalGrade}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            evaluation.status === 'approved' ? 'default' :
                            evaluation.status === 'completed' ? 'secondary' :
                            evaluation.status === 'rejected' ? 'destructive' :
                            'outline'
                          }>
                            {evaluation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {evaluation.isDynamic && (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Sparkles className="w-3 h-3 mr-1" />
                              v3
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
        </TabsContent>

        {/* 2軸評価タブ */}
        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>2軸評価マトリックス</CardTitle>
              <CardDescription>
                施設内順位と法人内順位による最終グレード判定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.matrixContainer}>
                <table className={styles.matrixTable}>
                  <thead>
                    <tr>
                      <th>法人＼施設</th>
                      <th>S</th>
                      <th>A</th>
                      <th>B</th>
                      <th>C</th>
                      <th>D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['S', 'A', 'B', 'C', 'D'].map(corporate => (
                      <tr key={corporate}>
                        <td className="font-bold">{corporate}</td>
                        {['S', 'A', 'B', 'C', 'D'].map(facility => (
                          <td 
                            key={facility} 
                            className={styles[`grade${evaluationMatrix[corporate as keyof typeof evaluationMatrix][facility as keyof typeof evaluationMatrix['S']].replace('+', 'Plus')}`]}
                          >
                            {evaluationMatrix[corporate as keyof typeof evaluationMatrix][facility as keyof typeof evaluationMatrix['S']]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>2軸評価の仕組み</AlertTitle>
                <AlertDescription>
                  施設内での相対順位と法人内での相対順位を組み合わせて、
                  最終的な評価グレードを決定します。
                  両方で高評価を得た職員がS+評価となります。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 承認管理タブ */}
        <TabsContent value="approval" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>承認ワークフロー</CardTitle>
              <CardDescription>
                評価の承認プロセスを管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.approvalFlow}>
                <div className={styles.approvalStep}>
                  <div className={styles.stepIcon}>
                    <Users className="w-6 h-6" />
                  </div>
                  <h4>1次承認</h4>
                  <p>直属上司</p>
                  <Badge>15件待機中</Badge>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
                <div className={styles.approvalStep}>
                  <div className={styles.stepIcon}>
                    <Building className="w-6 h-6" />
                  </div>
                  <h4>2次承認</h4>
                  <p>部門長</p>
                  <Badge>8件待機中</Badge>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
                <div className={styles.approvalStep}>
                  <div className={styles.stepIcon}>
                    <Award className="w-6 h-6" />
                  </div>
                  <h4>最終承認</h4>
                  <p>人事部</p>
                  <Badge>3件待機中</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* レポートタブ */}
        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>レポート出力</CardTitle>
              <CardDescription>
                各種レポートをダウンロードできます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <FileSpreadsheet className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">評価一覧（Excel）</div>
                    <div className="text-sm text-gray-600">全職員の評価データ</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">個人評価シート（PDF）</div>
                    <div className="text-sm text-gray-600">個別の詳細評価</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">統計分析レポート</div>
                    <div className="text-sm text-gray-600">部署別・職種別分析</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">年度比較レポート</div>
                    <div className="text-sm text-gray-600">過去3年間の推移</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* バッチ処理ダイアログ */}
      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {batchAction === 'approve' && '一括承認'}
              {batchAction === 'reject' && '一括却下'}
              {batchAction === 'export' && 'エクスポート'}
            </DialogTitle>
            <DialogDescription>
              {selectedStaff.length}件の評価を処理します
            </DialogDescription>
          </DialogHeader>
          {batchAction !== 'export' && (
            <div className="space-y-4">
              <div>
                <Label>コメント（任意）</Label>
                <Textarea
                  value={batchComment}
                  onChange={(e) => setBatchComment(e.target.value)}
                  placeholder="承認・却下の理由を入力"
                  rows={3}
                />
              </div>
            </div>
          )}
          {batchAction === 'export' && (
            <div className="space-y-4">
              <div>
                <Label>エクスポート形式</Label>
                <Select defaultValue="excel">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBatchDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleBatchAction}>
              {batchAction === 'approve' && '承認'}
              {batchAction === 'reject' && '却下'}
              {batchAction === 'export' && 'ダウンロード'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}