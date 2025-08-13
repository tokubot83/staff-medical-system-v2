// 評価ワークフロー管理サービス
// 評価の承認フロー（下書き→提出→承認待ち→確定）を管理

export type WorkflowStatus = 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'confirmed'
export type EvaluationType = 'technical' | 'contribution' | 'integrated'
export type EvaluatorRole = 'self' | 'superior' | 'department_head' | 'hr_manager'

// ワークフローのステータス遷移定義
export const WORKFLOW_TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
  draft: ['submitted'],
  submitted: ['pending_approval', 'draft'],
  pending_approval: ['approved', 'rejected'],
  approved: ['confirmed'],
  rejected: ['draft'],
  confirmed: []
}

// 評価ワークフローのインターフェース
export interface EvaluationWorkflow {
  id: string
  evaluationId: string
  evaluationType: EvaluationType
  employeeId: string
  employeeName: string
  department: string
  evaluatorId: string
  evaluatorName: string
  evaluatorRole: EvaluatorRole
  status: WorkflowStatus
  submittedAt?: Date
  approvedAt?: Date
  confirmedAt?: Date
  rejectedAt?: Date
  rejectionReason?: string
  comments: WorkflowComment[]
  history: WorkflowHistory[]
  scores?: any // 評価スコアデータ
  nextApprover?: {
    id: string
    name: string
    role: string
  }
  createdAt: Date
  updatedAt: Date
}

// コメント
export interface WorkflowComment {
  id: string
  userId: string
  userName: string
  userRole: string
  content: string
  createdAt: Date
  isRejection?: boolean
}

// 履歴
export interface WorkflowHistory {
  id: string
  action: string
  userId: string
  userName: string
  fromStatus: WorkflowStatus
  toStatus: WorkflowStatus
  comment?: string
  timestamp: Date
}

// 承認者情報
export interface Approver {
  id: string
  name: string
  role: string
  department: string
  email: string
  pendingCount: number
}

// ワークフローサマリー（ダッシュボード用）
export interface WorkflowSummary {
  total: number
  draft: number
  submitted: number
  pendingApproval: number
  approved: number
  rejected: number
  confirmed: number
  requiresAction: number
}

class EvaluationWorkflowService {
  private workflows: Map<string, EvaluationWorkflow> = new Map()
  
  constructor() {
    // モックデータの初期化
    this.initializeMockData()
  }

  // モックデータの初期化
  private initializeMockData() {
    const mockWorkflows: EvaluationWorkflow[] = [
      {
        id: 'WF001',
        evaluationId: 'EVAL001',
        evaluationType: 'technical',
        employeeId: 'EMP001',
        employeeName: '山田太郎',
        department: '看護部',
        evaluatorId: 'MGR001',
        evaluatorName: '佐藤花子',
        evaluatorRole: 'superior',
        status: 'pending_approval',
        submittedAt: new Date('2025-08-10T10:00:00'),
        comments: [],
        history: [
          {
            id: 'H001',
            action: 'submit',
            userId: 'MGR001',
            userName: '佐藤花子',
            fromStatus: 'draft',
            toStatus: 'submitted',
            timestamp: new Date('2025-08-10T10:00:00')
          }
        ],
        nextApprover: {
          id: 'DIR001',
          name: '田中部長',
          role: '看護部長'
        },
        createdAt: new Date('2025-08-01T09:00:00'),
        updatedAt: new Date('2025-08-10T10:00:00')
      },
      {
        id: 'WF002',
        evaluationId: 'EVAL002',
        evaluationType: 'technical',
        employeeId: 'EMP002',
        employeeName: '鈴木花子',
        department: '看護部',
        evaluatorId: 'EMP002',
        evaluatorName: '鈴木花子',
        evaluatorRole: 'self',
        status: 'draft',
        comments: [],
        history: [],
        createdAt: new Date('2025-08-05T09:00:00'),
        updatedAt: new Date('2025-08-05T09:00:00')
      },
      {
        id: 'WF003',
        evaluationId: 'EVAL003',
        evaluationType: 'contribution',
        employeeId: 'EMP003',
        employeeName: '高橋次郎',
        department: 'リハビリ科',
        evaluatorId: 'MGR002',
        evaluatorName: '伊藤課長',
        evaluatorRole: 'superior',
        status: 'approved',
        submittedAt: new Date('2025-08-08T14:00:00'),
        approvedAt: new Date('2025-08-11T11:00:00'),
        comments: [
          {
            id: 'C001',
            userId: 'DIR002',
            userName: '山本部長',
            userRole: 'リハビリ科部長',
            content: '適切な評価です。承認します。',
            createdAt: new Date('2025-08-11T11:00:00')
          }
        ],
        history: [
          {
            id: 'H002',
            action: 'submit',
            userId: 'MGR002',
            userName: '伊藤課長',
            fromStatus: 'draft',
            toStatus: 'submitted',
            timestamp: new Date('2025-08-08T14:00:00')
          },
          {
            id: 'H003',
            action: 'approve',
            userId: 'DIR002',
            userName: '山本部長',
            fromStatus: 'pending_approval',
            toStatus: 'approved',
            comment: '適切な評価です。承認します。',
            timestamp: new Date('2025-08-11T11:00:00')
          }
        ],
        createdAt: new Date('2025-08-07T09:00:00'),
        updatedAt: new Date('2025-08-11T11:00:00')
      }
    ]

    mockWorkflows.forEach(wf => {
      this.workflows.set(wf.id, wf)
    })
  }

  // ワークフロー一覧取得
  async getWorkflows(filter?: {
    status?: WorkflowStatus
    department?: string
    evaluatorId?: string
    employeeId?: string
  }): Promise<EvaluationWorkflow[]> {
    let workflows = Array.from(this.workflows.values())

    if (filter) {
      if (filter.status) {
        workflows = workflows.filter(wf => wf.status === filter.status)
      }
      if (filter.department) {
        workflows = workflows.filter(wf => wf.department === filter.department)
      }
      if (filter.evaluatorId) {
        workflows = workflows.filter(wf => wf.evaluatorId === filter.evaluatorId)
      }
      if (filter.employeeId) {
        workflows = workflows.filter(wf => wf.employeeId === filter.employeeId)
      }
    }

    return workflows.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // 特定のワークフロー取得
  async getWorkflow(id: string): Promise<EvaluationWorkflow | null> {
    return this.workflows.get(id) || null
  }

  // ワークフローのステータス更新
  async updateWorkflowStatus(
    id: string,
    newStatus: WorkflowStatus,
    userId: string,
    userName: string,
    comment?: string
  ): Promise<EvaluationWorkflow> {
    const workflow = this.workflows.get(id)
    if (!workflow) {
      throw new Error('Workflow not found')
    }

    // ステータス遷移の検証
    const allowedTransitions = WORKFLOW_TRANSITIONS[workflow.status]
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${workflow.status} to ${newStatus}`)
    }

    // 履歴に追加
    const history: WorkflowHistory = {
      id: `H${Date.now()}`,
      action: this.getActionName(workflow.status, newStatus),
      userId,
      userName,
      fromStatus: workflow.status,
      toStatus: newStatus,
      comment,
      timestamp: new Date()
    }

    workflow.history.push(history)
    workflow.status = newStatus
    workflow.updatedAt = new Date()

    // ステータスに応じた日時の更新
    switch (newStatus) {
      case 'submitted':
        workflow.submittedAt = new Date()
        break
      case 'approved':
        workflow.approvedAt = new Date()
        break
      case 'confirmed':
        workflow.confirmedAt = new Date()
        break
      case 'rejected':
        workflow.rejectedAt = new Date()
        workflow.rejectionReason = comment
        break
    }

    this.workflows.set(id, workflow)
    return workflow
  }

  // コメント追加
  async addComment(
    workflowId: string,
    userId: string,
    userName: string,
    userRole: string,
    content: string,
    isRejection: boolean = false
  ): Promise<WorkflowComment> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error('Workflow not found')
    }

    const comment: WorkflowComment = {
      id: `C${Date.now()}`,
      userId,
      userName,
      userRole,
      content,
      createdAt: new Date(),
      isRejection
    }

    workflow.comments.push(comment)
    workflow.updatedAt = new Date()
    this.workflows.set(workflowId, workflow)

    return comment
  }

  // 承認が必要なワークフロー取得（承認者向け）
  async getPendingApprovals(approverId: string): Promise<EvaluationWorkflow[]> {
    // 実際の実装では、承認者の権限に基づいてフィルタリング
    return Array.from(this.workflows.values()).filter(
      wf => wf.status === 'pending_approval' || wf.status === 'submitted'
    )
  }

  // ワークフローサマリー取得
  async getWorkflowSummary(filter?: {
    department?: string
    evaluatorId?: string
  }): Promise<WorkflowSummary> {
    let workflows = Array.from(this.workflows.values())

    if (filter?.department) {
      workflows = workflows.filter(wf => wf.department === filter.department)
    }
    if (filter?.evaluatorId) {
      workflows = workflows.filter(wf => wf.evaluatorId === filter.evaluatorId)
    }

    return {
      total: workflows.length,
      draft: workflows.filter(wf => wf.status === 'draft').length,
      submitted: workflows.filter(wf => wf.status === 'submitted').length,
      pendingApproval: workflows.filter(wf => wf.status === 'pending_approval').length,
      approved: workflows.filter(wf => wf.status === 'approved').length,
      rejected: workflows.filter(wf => wf.status === 'rejected').length,
      confirmed: workflows.filter(wf => wf.status === 'confirmed').length,
      requiresAction: workflows.filter(
        wf => wf.status === 'pending_approval' || wf.status === 'submitted'
      ).length
    }
  }

  // 承認者リスト取得
  async getApprovers(): Promise<Approver[]> {
    // モックデータ
    return [
      {
        id: 'DIR001',
        name: '田中部長',
        role: '看護部長',
        department: '看護部',
        email: 'tanaka@example.com',
        pendingCount: 5
      },
      {
        id: 'DIR002',
        name: '山本部長',
        role: 'リハビリ科部長',
        department: 'リハビリ科',
        email: 'yamamoto@example.com',
        pendingCount: 3
      },
      {
        id: 'HR001',
        name: '小林人事部長',
        role: '人事部長',
        department: '人事部',
        email: 'kobayashi@example.com',
        pendingCount: 8
      }
    ]
  }

  // アクション名の取得
  private getActionName(from: WorkflowStatus, to: WorkflowStatus): string {
    if (to === 'submitted') return 'submit'
    if (to === 'pending_approval') return 'request_approval'
    if (to === 'approved') return 'approve'
    if (to === 'rejected') return 'reject'
    if (to === 'confirmed') return 'confirm'
    if (to === 'draft') return 'save_draft'
    return 'update'
  }

  // 新規ワークフロー作成
  async createWorkflow(
    evaluationId: string,
    evaluationType: EvaluationType,
    employeeId: string,
    employeeName: string,
    department: string,
    evaluatorId: string,
    evaluatorName: string,
    evaluatorRole: EvaluatorRole
  ): Promise<EvaluationWorkflow> {
    const workflow: EvaluationWorkflow = {
      id: `WF${Date.now()}`,
      evaluationId,
      evaluationType,
      employeeId,
      employeeName,
      department,
      evaluatorId,
      evaluatorName,
      evaluatorRole,
      status: 'draft',
      comments: [],
      history: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.workflows.set(workflow.id, workflow)
    return workflow
  }
}

// シングルトンインスタンスをエクスポート
export const workflowService = new EvaluationWorkflowService()