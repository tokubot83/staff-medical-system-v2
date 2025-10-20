/**
 * VoiceDrive連携用の型定義
 * 法人SNSシステムVoiceDriveとの連携インターフェース
 */

/**
 * VoiceDrive配信メッセージ
 */
export interface VoiceDriveMessage {
  id: string
  title: string
  content: string
  category: 'stress_check' | 'interview' | 'health_check' | 'hr_notice' | 'general'
  priority: 'urgent' | 'high' | 'normal' | 'low'
  targetType: 'all' | 'department' | 'individual' | 'custom'
  targetIds: string[]
  scheduledDate?: Date
  expirationDate?: Date
  attachments?: VoiceDriveAttachment[]
  metadata?: Record<string, any>
}

/**
 * 添付ファイル
 */
export interface VoiceDriveAttachment {
  id: string
  filename: string
  mimeType: string
  size: number
  url: string
}

/**
 * 配信ステータス
 */
export interface VoiceDriveDeliveryStatus {
  messageId: string
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'cancelled'
  totalRecipients: number
  deliveredCount: number
  readCount: number
  failedCount: number
  lastUpdated: Date
  errors?: VoiceDriveError[]
}

/**
 * エラー情報
 */
export interface VoiceDriveError {
  code: string
  message: string
  recipientId?: string
  timestamp: Date
}

/**
 * 配信レポート
 */
export interface VoiceDriveReport {
  messageId: string
  title: string
  sentDate: Date
  totalRecipients: number
  deliveryRate: number
  readRate: number
  clickRate?: number
  departmentStats: DepartmentDeliveryStats[]
}

/**
 * 部署別配信統計
 */
export interface DepartmentDeliveryStats {
  departmentId: string
  departmentName: string
  totalStaff: number
  delivered: number
  read: number
  responseRate: number
}

/**
 * VoiceDrive API レスポンス
 */
export interface VoiceDriveResponse<T = any> {
  success: boolean
  data?: T
  error?: VoiceDriveError
  timestamp: Date
}

/**
 * 配信テンプレート
 */
export interface VoiceDriveTemplate {
  id: string
  name: string
  category: string
  subject: string
  body: string
  variables?: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

/**
 * 連携設定
 */
export interface VoiceDriveConfig {
  apiEndpoint: string
  apiKey?: string
  timeout: number
  retryAttempts: number
  syncEnabled: boolean
  autoSync: boolean
  syncInterval?: number
}

/**
 * 同期ステータス
 */
export interface VoiceDriveSyncStatus {
  lastSync: Date | null
  nextSync: Date | null
  syncInProgress: boolean
  pendingMessages: number
  failedMessages: number
  lastError?: VoiceDriveError
}

/**
 * AIアドバイス生成リクエスト
 * ローカルLLM実装を想定した設計
 */
export interface AIAdviceRequest {
  context: 'stress_followup' | 'interview_support' | 'health_guidance'
  staffData: {
    id: string
    stressLevel?: 'high' | 'moderate' | 'low'
    previousAssessments?: Array<{
      date: Date
      score: number
      category: string
    }>
    departmentInfo?: {
      id: string
      name: string
      averageStressLevel: number
    }
  }
  requestType: 'individual' | 'group' | 'organizational'
  legalCompliance: {
    requiresHealthProfessional: boolean
    dataPrivacyLevel: 'high' | 'standard'
    auditLog: boolean
  }
}

/**
 * AIアドバイス生成レスポンス
 */
export interface AIAdviceResponse {
  id: string
  advice: string
  supportingData: {
    references: string[]
    confidence: number
    disclaimer: string
  }
  recommendations: AIRecommendation[]
  generatedAt: Date
  generatedBy: 'local_llm' | 'cloud_llm' | 'rule_based'
  reviewRequired: boolean
}

/**
 * AI推奨アクション
 */
export interface AIRecommendation {
  id: string
  action: string
  priority: 'urgent' | 'high' | 'normal' | 'low'
  targetRole: 'health_nurse' | 'hr_staff' | 'manager' | 'staff'
  estimatedImpact: 'high' | 'moderate' | 'low'
  legalConsiderations?: string
}

/**
 * 期限到達判断履歴（Phase 6）
 * VoiceDriveの期限到達提案に対する判断の履歴レコード
 */
export interface ExpiredEscalationDecision {
  id: string
  postId: string
  postContent: string
  postAgendaLevel: 'escalated_to_dept' | 'escalated_to_facility' | 'escalated_to_corp'
  postProposalType: 'kaizen' | 'new_initiative' | 'training' | 'collaboration' | null
  postAuthor: {
    id: string
    name: string
    department: string | null
  }
  deciderId: string
  deciderName: string
  deciderDepartment: string
  deciderLevel: number
  deciderFacilityId: string | null
  decision: 'approve_at_current_level' | 'downgrade' | 'reject'
  decisionReason: string
  currentScore: number
  targetScore: number
  achievementRate: number
  daysOverdue: number
  agendaLevel: 'escalated_to_dept' | 'escalated_to_facility' | 'escalated_to_corp'
  proposalType: 'kaizen' | 'new_initiative' | 'training' | 'collaboration' | null
  department: string
  facilityId: string | null
  createdAt: string
  updatedAt: string
}

/**
 * 判断履歴APIレスポンス
 */
export interface DecisionHistoryResponse {
  metadata: {
    exportDate: string
    totalCount: number
    version: string
    description: string
  }
  summary: {
    totalDecisions: number
    approvalCount: number
    downgradeCount: number
    rejectCount: number
    averageAchievementRate: number
    averageDaysOverdue: number
  }
  decisions: ExpiredEscalationDecision[]
}

/**
 * 判断履歴フィルタ条件
 */
export interface DecisionHistoryFilter {
  decisionType?: 'approve_at_current_level' | 'downgrade' | 'reject' | 'all'
  agendaLevel?: 'escalated_to_dept' | 'escalated_to_facility' | 'escalated_to_corp' | 'all'
  proposalType?: 'kaizen' | 'new_initiative' | 'training' | 'collaboration' | 'all'
  department?: string
  facilityId?: string | null
  dateFrom?: string
  dateTo?: string
  deciderLevel?: number
  sortBy?: 'createdAt' | 'achievementRate' | 'daysOverdue' | 'deciderLevel'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

/**
 * 判断履歴統計データ
 */
export interface DecisionHistoryStats {
  byDecisionType: {
    approve: number
    downgrade: number
    reject: number
  }
  byAgendaLevel: {
    dept: number
    facility: number
    corp: number
  }
  byProposalType: {
    kaizen: number
    newInitiative: number
    training: number
    collaboration: number
  }
  byDeciderLevel: {
    [key: string]: number
  }
  trends: {
    monthly: Array<{
      month: string
      approvalRate: number
      averageAchievementRate: number
    }>
  }
}