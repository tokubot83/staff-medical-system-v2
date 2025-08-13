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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  FileText,
  Send,
  Check,
  X,
  MessageSquare,
  Clock,
  AlertCircle,
  User,
  ChevronRight,
  Save,
  RefreshCw,
  Eye,
  History
} from 'lucide-react'
import {
  workflowService,
  EvaluationWorkflow,
  WorkflowStatus,
  WorkflowComment,
  WorkflowHistory
} from '@/services/evaluationWorkflowService'

interface EvaluationWorkflowProps {
  evaluationId?: string
  onStatusChange?: (workflow: EvaluationWorkflow) => void
}

export default function EvaluationWorkflowComponent({
  evaluationId,
  onStatusChange
}: EvaluationWorkflowProps) {
  const [workflows, setWorkflows] = useState<EvaluationWorkflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<EvaluationWorkflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<WorkflowStatus | 'all'>('all')
  const [comment, setComment] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    action: 'submit' | 'approve' | 'reject' | 'return' | null
    workflow: EvaluationWorkflow | null
  }>({ open: false, action: null, workflow: null })

  // ワークフロー一覧の取得
  useEffect(() => {
    loadWorkflows()
  }, [filter])

  const loadWorkflows = async () => {
    setLoading(true)
    try {
      const data = await workflowService.getWorkflows(
        filter !== 'all' ? { status: filter } : undefined
      )
      setWorkflows(data)
    } finally {
      setLoading(false)
    }
  }

  // ステータスバッジの色を取得
  const getStatusBadgeVariant = (status: WorkflowStatus) => {
    switch (status) {
      case 'draft': return 'secondary'
      case 'submitted': return 'default'
      case 'pending_approval': return 'default'
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      case 'confirmed': return 'default'
      default: return 'secondary'
    }
  }

  // ステータスの日本語表示
  const getStatusLabel = (status: WorkflowStatus) => {
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

  // アクション実行
  const handleAction = async (
    action: 'submit' | 'approve' | 'reject' | 'return',
    workflow: EvaluationWorkflow
  ) => {
    let newStatus: WorkflowStatus
    switch (action) {
      case 'submit':
        newStatus = 'pending_approval'
        break
      case 'approve':
        newStatus = 'approved'
        break
      case 'reject':
        newStatus = 'rejected'
        break
      case 'return':
        newStatus = 'draft'
        break
      default:
        return
    }

    try {
      const updated = await workflowService.updateWorkflowStatus(
        workflow.id,
        newStatus,
        'current_user', // 実際はログインユーザー情報を使用
        '現在のユーザー',
        comment
      )

      if (comment) {
        await workflowService.addComment(
          workflow.id,
          'current_user',
          '現在のユーザー',
          'ユーザーロール',
          comment,
          action === 'reject'
        )
      }

      setWorkflows(prev =>
        prev.map(w => w.id === updated.id ? updated : w)
      )

      if (selectedWorkflow?.id === updated.id) {
        setSelectedWorkflow(updated)
      }

      onStatusChange?.(updated)
      setComment('')
      setActionDialog({ open: false, action: null, workflow: null })
      
      // 成功メッセージ（実際はトースト通知を使用）
      console.log(`${getActionLabel(action)}しました`)
    } catch (error) {
      console.error('アクション実行エラー:', error)
    }
  }

  // アクションラベル取得
  const getActionLabel = (action: string) => {
    switch (action) {
      case 'submit': return '提出'
      case 'approve': return '承認'
      case 'reject': return '差し戻し'
      case 'return': return '取り下げ'
      default: return action
    }
  }

  return (
    <div className="space-y-6">
      {/* フィルター */}
      <Card>
        <CardHeader>
          <CardTitle>評価ワークフロー管理</CardTitle>
          <CardDescription>
            評価の承認フローを管理します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as WorkflowStatus | 'all')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="ステータスでフィルター" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="draft">下書き</SelectItem>
                <SelectItem value="submitted">提出済み</SelectItem>
                <SelectItem value="pending_approval">承認待ち</SelectItem>
                <SelectItem value="approved">承認済み</SelectItem>
                <SelectItem value="rejected">差し戻し</SelectItem>
                <SelectItem value="confirmed">確定</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={loadWorkflows}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              更新
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ワークフロー一覧 */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              読み込み中...
            </CardContent>
          </Card>
        ) : workflows.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              該当するワークフローがありません
            </CardContent>
          </Card>
        ) : (
          workflows.map(workflow => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getStatusBadgeVariant(workflow.status)}>
                        {getStatusLabel(workflow.status)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {workflow.evaluationType === 'technical' ? '技術評価' :
                         workflow.evaluationType === 'contribution' ? '貢献度評価' :
                         '統合評価'}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">
                      {workflow.employeeName}
                    </h3>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>部署: {workflow.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>更新: {workflow.updatedAt.toLocaleDateString()}</span>
                      </div>
                      {workflow.nextApprover && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-3 h-3" />
                          <span>次の承認者: {workflow.nextApprover.name}</span>
                        </div>
                      )}
                    </div>

                    {workflow.comments.length > 0 && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-md">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-3 h-3" />
                            <span className="font-medium">最新コメント</span>
                          </div>
                          <p className="text-muted-foreground">
                            {workflow.comments[workflow.comments.length - 1].content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      詳細
                    </Button>

                    {/* ステータスに応じたアクションボタン */}
                    {workflow.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => setActionDialog({
                          open: true,
                          action: 'submit',
                          workflow
                        })}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        提出
                      </Button>
                    )}

                    {(workflow.status === 'submitted' || workflow.status === 'pending_approval') && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => setActionDialog({
                            open: true,
                            action: 'approve',
                            workflow
                          })}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          承認
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setActionDialog({
                            open: true,
                            action: 'reject',
                            workflow
                          })}
                        >
                          <X className="w-4 h-4 mr-2" />
                          差し戻し
                        </Button>
                      </>
                    )}

                    {workflow.status === 'rejected' && (
                      <Button
                        size="sm"
                        onClick={() => setActionDialog({
                          open: true,
                          action: 'submit',
                          workflow
                        })}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        再提出
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* アクションダイアログ */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => !open && setActionDialog({
          open: false,
          action: null,
          workflow: null
        })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action && getActionLabel(actionDialog.action)}の確認
            </DialogTitle>
            <DialogDescription>
              {actionDialog.workflow?.employeeName}の評価を
              {actionDialog.action && getActionLabel(actionDialog.action)}します。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                コメント {actionDialog.action === 'reject' && '(必須)'}
              </label>
              <Textarea
                placeholder="コメントを入力..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({
                open: false,
                action: null,
                workflow: null
              })}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                if (actionDialog.action && actionDialog.workflow) {
                  handleAction(actionDialog.action, actionDialog.workflow)
                }
              }}
              disabled={actionDialog.action === 'reject' && !comment}
            >
              {actionDialog.action && getActionLabel(actionDialog.action)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 詳細モーダル */}
      {selectedWorkflow && (
        <Dialog
          open={!!selectedWorkflow}
          onOpenChange={(open) => !open && setSelectedWorkflow(null)}
        >
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>ワークフロー詳細</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* 基本情報 */}
              <div>
                <h3 className="font-semibold mb-3">基本情報</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">評価対象:</span>
                    <p className="font-medium">{selectedWorkflow.employeeName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">部署:</span>
                    <p className="font-medium">{selectedWorkflow.department}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">評価者:</span>
                    <p className="font-medium">{selectedWorkflow.evaluatorName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ステータス:</span>
                    <Badge variant={getStatusBadgeVariant(selectedWorkflow.status)}>
                      {getStatusLabel(selectedWorkflow.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 履歴 */}
              <div>
                <h3 className="font-semibold mb-3">履歴</h3>
                <div className="space-y-2">
                  {selectedWorkflow.history.map(history => (
                    <div key={history.id} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{history.userName}</span>
                          <span className="text-muted-foreground">
                            {history.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {getStatusLabel(history.fromStatus)} → {getStatusLabel(history.toStatus)}
                        </p>
                        {history.comment && (
                          <p className="mt-1 p-2 bg-muted/50 rounded">
                            {history.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* コメント */}
              {selectedWorkflow.comments.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">コメント</h3>
                  <div className="space-y-3">
                    {selectedWorkflow.comments.map(comment => (
                      <div
                        key={comment.id}
                        className={`p-3 rounded-md ${
                          comment.isRejection ? 'bg-destructive/10' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}