'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MoreHorizontal,
  Send,
  TrendingUp,
  Users,
  Eye,
  Check,
  X,
  MessageSquare,
  RefreshCw,
  Download,
  Filter,
  BarChart3
} from 'lucide-react'
import {
  workflowService,
  EvaluationWorkflow,
  WorkflowSummary,
  Approver
} from '@/services/evaluationWorkflowService'

export default function ApprovalDashboard() {
  const [pendingWorkflows, setPendingWorkflows] = useState<EvaluationWorkflow[]>([])
  const [allWorkflows, setAllWorkflows] = useState<EvaluationWorkflow[]>([])
  const [summary, setSummary] = useState<WorkflowSummary | null>(null)
  const [approvers, setApprovers] = useState<Approver[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('pending')
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // データの初期読み込み
  useEffect(() => {
    loadData()
    // 30秒ごとに自動更新
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 承認待ちワークフロー取得
      const pending = await workflowService.getPendingApprovals('current_user')
      setPendingWorkflows(pending)

      // 全ワークフロー取得
      const all = await workflowService.getWorkflows()
      setAllWorkflows(all)

      // サマリー取得
      const summaryData = await workflowService.getWorkflowSummary()
      setSummary(summaryData)

      // 承認者リスト取得
      const approverList = await workflowService.getApprovers()
      setApprovers(approverList)

      setLastRefresh(new Date())
    } finally {
      setLoading(false)
    }
  }

  // ステータスバッジの色を取得
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary'
      case 'submitted': return 'default'
      case 'pending_approval': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'destructive'
      case 'confirmed': return 'default'
      default: return 'secondary'
    }
  }

  // ステータスの日本語表示
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return '下書き'
      case 'submitted': return '提出済み'
      case 'pending_approval': return '承認待ち'
      case 'approved': return '承認済み'
      case 'rejected': return '差し戻し'
      case 'confirmed': return '確定'
      default: return status
    }
  }

  // 評価タイプの日本語表示
  const getEvaluationTypeLabel = (type: string) => {
    switch (type) {
      case 'technical': return '技術評価'
      case 'contribution': return '貢献度評価'
      case 'integrated': return '統合評価'
      default: return type
    }
  }

  // 優先度の計算（提出からの経過日数）
  const getPriority = (workflow: EvaluationWorkflow) => {
    if (!workflow.submittedAt) return 'low'
    const days = Math.floor(
      (new Date().getTime() - workflow.submittedAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (days >= 5) return 'high'
    if (days >= 3) return 'medium'
    return 'low'
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">承認者ダッシュボード</h2>
          <p className="text-muted-foreground">
            評価の承認管理と進捗確認
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            最終更新: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            更新
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* サマリーカード */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  要対応
                </CardTitle>
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.requiresAction}</div>
              <p className="text-xs text-muted-foreground">
                承認待ち案件
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  処理中
                </CardTitle>
                <Clock className="w-4 h-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.submitted + summary.pendingApproval}
              </div>
              <p className="text-xs text-muted-foreground">
                提出済み・承認待ち
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  承認済み
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.approved}</div>
              <p className="text-xs text-muted-foreground">
                今月の承認数
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  進捗率
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.total > 0
                  ? Math.round(((summary.approved + summary.confirmed) / summary.total) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                全体の完了率
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* メインコンテンツ */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">
            承認待ち
            {pendingWorkflows.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingWorkflows.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="approvers">承認者一覧</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
        </TabsList>

        {/* 承認待ちタブ */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>承認待ち案件</CardTitle>
              <CardDescription>
                あなたの承認が必要な評価一覧
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  読み込み中...
                </div>
              ) : pendingWorkflows.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  承認待ちの案件はありません
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>優先度</TableHead>
                      <TableHead>評価対象</TableHead>
                      <TableHead>部署</TableHead>
                      <TableHead>評価種別</TableHead>
                      <TableHead>提出者</TableHead>
                      <TableHead>提出日</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>アクション</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingWorkflows.map(workflow => {
                      const priority = getPriority(workflow)
                      return (
                        <TableRow key={workflow.id}>
                          <TableCell>
                            <Badge
                              variant={
                                priority === 'high' ? 'destructive' :
                                priority === 'medium' ? 'warning' : 'secondary'
                              }
                            >
                              {priority === 'high' ? '高' :
                               priority === 'medium' ? '中' : '低'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {workflow.employeeName}
                          </TableCell>
                          <TableCell>{workflow.department}</TableCell>
                          <TableCell>
                            {getEvaluationTypeLabel(workflow.evaluationType)}
                          </TableCell>
                          <TableCell>{workflow.evaluatorName}</TableCell>
                          <TableCell>
                            {workflow.submittedAt?.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(workflow.status)}>
                              {getStatusLabel(workflow.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  詳細表示
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Check className="w-4 h-4 mr-2" />
                                  承認
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <X className="w-4 h-4 mr-2" />
                                  差し戻し
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  コメント追加
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* すべてタブ */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>全ワークフロー</CardTitle>
              <CardDescription>
                すべての評価ワークフロー一覧
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>評価対象</TableHead>
                    <TableHead>部署</TableHead>
                    <TableHead>評価種別</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>更新日</TableHead>
                    <TableHead>アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allWorkflows.map(workflow => (
                    <TableRow key={workflow.id}>
                      <TableCell>{workflow.id}</TableCell>
                      <TableCell className="font-medium">
                        {workflow.employeeName}
                      </TableCell>
                      <TableCell>{workflow.department}</TableCell>
                      <TableCell>
                        {getEvaluationTypeLabel(workflow.evaluationType)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(workflow.status)}>
                          {getStatusLabel(workflow.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {workflow.updatedAt.toLocaleDateString()}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* 承認者一覧タブ */}
        <TabsContent value="approvers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>承認者一覧</CardTitle>
              <CardDescription>
                評価承認権限を持つユーザー一覧
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {approvers.map(approver => (
                  <Card key={approver.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{approver.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {approver.role} - {approver.department}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {approver.pendingCount}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            承認待ち
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 分析タブ */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>ステータス別分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">下書き</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div
                              className="bg-secondary-foreground h-2 rounded-full"
                              style={{ width: `${(summary.draft / summary.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{summary.draft}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">提出済み</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(summary.submitted / summary.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{summary.submitted}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">承認待ち</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${(summary.pendingApproval / summary.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{summary.pendingApproval}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">承認済み</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(summary.approved / summary.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{summary.approved}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">差し戻し</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(summary.rejected / summary.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{summary.rejected}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>処理時間分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">平均承認時間</span>
                      <span className="text-lg font-bold">2.5日</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      提出から承認までの平均日数
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">最短処理時間</span>
                      <span className="text-lg font-bold">0.5日</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      最も早い承認処理
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">最長処理時間</span>
                      <span className="text-lg font-bold">7日</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      最も時間がかかった承認
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}