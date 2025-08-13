// 通知・アラート管理サービス
// 研修期限、評価期限、承認待ちなどの通知を管理

export type NotificationType = 'training' | 'evaluation' | 'approval' | 'reminder' | 'system'
export type NotificationPriority = 'high' | 'medium' | 'low' | 'info'
export type NotificationStatus = 'unread' | 'read' | 'archived'

// 通知インターフェース
export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  status: NotificationStatus
  title: string
  message: string
  targetUserId: string
  targetUserName?: string
  relatedId?: string // 関連する研修ID、評価IDなど
  relatedType?: string // training, evaluation, workflow など
  actionUrl?: string // クリック時の遷移先
  actionLabel?: string // アクションボタンのラベル
  dueDate?: Date // 期限
  createdAt: Date
  readAt?: Date
  scheduledFor?: Date // 予定通知日時
  metadata?: any // その他のメタデータ
}

// 通知設定
export interface NotificationSettings {
  userId: string
  trainingReminders: {
    enabled: boolean
    daysBefore: number[] // [30, 7, 1] = 30日前、7日前、前日
  }
  evaluationReminders: {
    enabled: boolean
    daysBefore: number[]
  }
  approvalAlerts: {
    enabled: boolean
    immediate: boolean // 即座に通知
  }
  emailNotifications: boolean
  inAppNotifications: boolean
}

// 通知テンプレート
export interface NotificationTemplate {
  id: string
  type: NotificationType
  titleTemplate: string
  messageTemplate: string
  priority: NotificationPriority
}

// 通知統計
export interface NotificationStats {
  total: number
  unread: number
  high: number
  medium: number
  low: number
  byType: Record<NotificationType, number>
}

class NotificationService {
  private notifications: Map<string, Notification> = new Map()
  private settings: Map<string, NotificationSettings> = new Map()
  private templates: Map<string, NotificationTemplate> = new Map()

  constructor() {
    this.initializeTemplates()
    this.initializeMockData()
    // 定期的に通知をチェック（実際の実装では、バックエンドのスケジューラーを使用）
    this.startNotificationScheduler()
  }

  // テンプレートの初期化
  private initializeTemplates() {
    const templates: NotificationTemplate[] = [
      {
        id: 'training_reminder_30',
        type: 'training',
        titleTemplate: '研修受講期限のお知らせ（30日前）',
        messageTemplate: '「{trainingName}」の受講期限まであと30日です。早めの受講をお願いします。',
        priority: 'low'
      },
      {
        id: 'training_reminder_7',
        type: 'training',
        titleTemplate: '研修受講期限が近づいています（7日前）',
        messageTemplate: '「{trainingName}」の受講期限まであと7日です。必ず期限内に受講してください。',
        priority: 'medium'
      },
      {
        id: 'training_reminder_1',
        type: 'training',
        titleTemplate: '【重要】研修受講期限は明日です',
        messageTemplate: '「{trainingName}」の受講期限は明日（{dueDate}）です。至急受講してください。',
        priority: 'high'
      },
      {
        id: 'training_overdue',
        type: 'training',
        titleTemplate: '【警告】研修受講期限を過ぎています',
        messageTemplate: '「{trainingName}」の受講期限（{dueDate}）を過ぎています。至急受講してください。',
        priority: 'high'
      },
      {
        id: 'evaluation_reminder',
        type: 'evaluation',
        titleTemplate: '評価入力期限のお知らせ',
        messageTemplate: '{evaluationType}の入力期限は{dueDate}です。期限内に入力をお願いします。',
        priority: 'medium'
      },
      {
        id: 'approval_required',
        type: 'approval',
        titleTemplate: '承認が必要です',
        messageTemplate: '{employeeName}の{evaluationType}が承認待ちです。確認をお願いします。',
        priority: 'high'
      },
      {
        id: 'approval_completed',
        type: 'approval',
        titleTemplate: '評価が承認されました',
        messageTemplate: 'あなたの{evaluationType}が承認されました。',
        priority: 'info'
      },
      {
        id: 'approval_rejected',
        type: 'approval',
        titleTemplate: '評価が差し戻されました',
        messageTemplate: 'あなたの{evaluationType}が差し戻されました。修正をお願いします。',
        priority: 'high'
      }
    ]

    templates.forEach(template => {
      this.templates.set(template.id, template)
    })
  }

  // モックデータの初期化
  private initializeMockData() {
    const mockNotifications: Notification[] = [
      {
        id: 'N001',
        type: 'training',
        priority: 'high',
        status: 'unread',
        title: '感染対策研修（2回目）未受講',
        message: '感染対策研修（2回目）の受講期限は2025-08-20です。至急受講してください。',
        targetUserId: 'EMP001',
        targetUserName: '山田太郎',
        relatedId: 'TRAIN001',
        relatedType: 'training',
        actionUrl: '/training',
        actionLabel: '研修を受講',
        dueDate: new Date('2025-08-20'),
        createdAt: new Date('2025-08-12T09:00:00')
      },
      {
        id: 'N002',
        type: 'evaluation',
        priority: 'medium',
        status: 'unread',
        title: '技術評価の入力期限が近づいています',
        message: '2025年度技術評価の入力期限まであと5日です。',
        targetUserId: 'EMP002',
        targetUserName: '鈴木花子',
        relatedId: 'EVAL002',
        relatedType: 'evaluation',
        actionUrl: '/evaluation/technical',
        actionLabel: '評価を入力',
        dueDate: new Date('2025-08-17'),
        createdAt: new Date('2025-08-12T10:00:00')
      },
      {
        id: 'N003',
        type: 'approval',
        priority: 'high',
        status: 'read',
        title: '承認が必要です',
        message: '山田太郎さんの技術評価が承認待ちです。',
        targetUserId: 'MGR001',
        targetUserName: '田中部長',
        relatedId: 'WF001',
        relatedType: 'workflow',
        actionUrl: '/evaluation/workflow',
        actionLabel: '承認画面へ',
        createdAt: new Date('2025-08-11T14:00:00'),
        readAt: new Date('2025-08-11T15:00:00')
      },
      {
        id: 'N004',
        type: 'reminder',
        priority: 'low',
        status: 'unread',
        title: '医療安全研修の受講をお忘れなく',
        message: '医療安全研修（年2回）の次回受講期限は2025-09-30です。',
        targetUserId: 'EMP003',
        targetUserName: '高橋次郎',
        relatedId: 'TRAIN002',
        relatedType: 'training',
        actionUrl: '/training',
        dueDate: new Date('2025-09-30'),
        createdAt: new Date('2025-08-10T09:00:00')
      }
    ]

    mockNotifications.forEach(notification => {
      this.notifications.set(notification.id, notification)
    })

    // デフォルト設定
    const defaultSettings: NotificationSettings = {
      userId: 'default',
      trainingReminders: {
        enabled: true,
        daysBefore: [30, 7, 1]
      },
      evaluationReminders: {
        enabled: true,
        daysBefore: [7, 3, 1]
      },
      approvalAlerts: {
        enabled: true,
        immediate: true
      },
      emailNotifications: false,
      inAppNotifications: true
    }

    this.settings.set('default', defaultSettings)
  }

  // 通知スケジューラーの開始
  private startNotificationScheduler() {
    // 1時間ごとに通知をチェック（実際の実装では、より適切な間隔に調整）
    setInterval(() => {
      this.checkAndCreateScheduledNotifications()
    }, 60 * 60 * 1000)

    // 初回実行
    this.checkAndCreateScheduledNotifications()
  }

  // スケジュールされた通知のチェックと作成
  private async checkAndCreateScheduledNotifications() {
    const now = new Date()
    
    // 研修期限チェック（モック実装）
    const upcomingTrainings = [
      {
        id: 'TRAIN003',
        name: '身体拘束適正化研修',
        dueDate: new Date('2025-08-20'),
        targetUsers: ['EMP004', 'EMP005']
      },
      {
        id: 'TRAIN004',
        name: '虐待防止研修',
        dueDate: new Date('2025-08-25'),
        targetUsers: ['EMP006']
      }
    ]

    upcomingTrainings.forEach(training => {
      const daysUntilDue = Math.floor(
        (training.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )

      // 設定に基づいて通知を作成
      const settings = this.settings.get('default')!
      if (settings.trainingReminders.enabled) {
        settings.trainingReminders.daysBefore.forEach(days => {
          if (daysUntilDue === days) {
            training.targetUsers.forEach(userId => {
              this.createTrainingReminder(userId, training.name, training.dueDate, days)
            })
          }
        })
      }
    })
  }

  // 研修リマインダー作成
  private createTrainingReminder(
    userId: string,
    trainingName: string,
    dueDate: Date,
    daysBefore: number
  ) {
    let templateId: string
    if (daysBefore >= 30) {
      templateId = 'training_reminder_30'
    } else if (daysBefore >= 7) {
      templateId = 'training_reminder_7'
    } else {
      templateId = 'training_reminder_1'
    }

    const template = this.templates.get(templateId)!
    const notification: Notification = {
      id: `N${Date.now()}`,
      type: 'training',
      priority: template.priority,
      status: 'unread',
      title: template.titleTemplate.replace('{trainingName}', trainingName),
      message: template.messageTemplate
        .replace('{trainingName}', trainingName)
        .replace('{dueDate}', dueDate.toLocaleDateString()),
      targetUserId: userId,
      relatedType: 'training',
      actionUrl: '/training',
      actionLabel: '研修を受講',
      dueDate,
      createdAt: new Date()
    }

    this.notifications.set(notification.id, notification)
  }

  // 通知一覧取得
  async getNotifications(filter?: {
    userId?: string
    type?: NotificationType
    status?: NotificationStatus
    priority?: NotificationPriority
  }): Promise<Notification[]> {
    let notifications = Array.from(this.notifications.values())

    if (filter) {
      if (filter.userId) {
        notifications = notifications.filter(n => n.targetUserId === filter.userId)
      }
      if (filter.type) {
        notifications = notifications.filter(n => n.type === filter.type)
      }
      if (filter.status) {
        notifications = notifications.filter(n => n.status === filter.status)
      }
      if (filter.priority) {
        notifications = notifications.filter(n => n.priority === filter.priority)
      }
    }

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // 通知を既読にする
  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.get(notificationId)
    if (notification) {
      notification.status = 'read'
      notification.readAt = new Date()
      this.notifications.set(notificationId, notification)
    }
  }

  // 複数の通知を既読にする
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    notificationIds.forEach(id => this.markAsRead(id))
  }

  // すべての通知を既読にする
  async markAllAsRead(userId: string): Promise<void> {
    const userNotifications = await this.getNotifications({ userId, status: 'unread' })
    userNotifications.forEach(n => this.markAsRead(n.id))
  }

  // 通知をアーカイブ
  async archiveNotification(notificationId: string): Promise<void> {
    const notification = this.notifications.get(notificationId)
    if (notification) {
      notification.status = 'archived'
      this.notifications.set(notificationId, notification)
    }
  }

  // 通知を削除
  async deleteNotification(notificationId: string): Promise<void> {
    this.notifications.delete(notificationId)
  }

  // 通知統計取得
  async getNotificationStats(userId: string): Promise<NotificationStats> {
    const userNotifications = await this.getNotifications({ userId })
    
    const stats: NotificationStats = {
      total: userNotifications.length,
      unread: userNotifications.filter(n => n.status === 'unread').length,
      high: userNotifications.filter(n => n.priority === 'high').length,
      medium: userNotifications.filter(n => n.priority === 'medium').length,
      low: userNotifications.filter(n => n.priority === 'low').length,
      byType: {
        training: userNotifications.filter(n => n.type === 'training').length,
        evaluation: userNotifications.filter(n => n.type === 'evaluation').length,
        approval: userNotifications.filter(n => n.type === 'approval').length,
        reminder: userNotifications.filter(n => n.type === 'reminder').length,
        system: userNotifications.filter(n => n.type === 'system').length
      }
    }

    return stats
  }

  // 通知設定取得
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    return this.settings.get(userId) || this.settings.get('default')!
  }

  // 通知設定更新
  async updateNotificationSettings(
    userId: string,
    settings: Partial<NotificationSettings>
  ): Promise<void> {
    const currentSettings = await this.getNotificationSettings(userId)
    const updatedSettings = { ...currentSettings, ...settings, userId }
    this.settings.set(userId, updatedSettings)
  }

  // 新規通知作成（汎用）
  async createNotification(
    type: NotificationType,
    priority: NotificationPriority,
    title: string,
    message: string,
    targetUserId: string,
    options?: {
      relatedId?: string
      relatedType?: string
      actionUrl?: string
      actionLabel?: string
      dueDate?: Date
      metadata?: any
    }
  ): Promise<Notification> {
    const notification: Notification = {
      id: `N${Date.now()}`,
      type,
      priority,
      status: 'unread',
      title,
      message,
      targetUserId,
      createdAt: new Date(),
      ...options
    }

    this.notifications.set(notification.id, notification)
    
    // 即座に通知が必要な場合の処理（実際の実装では、WebSocketなどを使用）
    if (priority === 'high') {
      console.log('High priority notification created:', notification)
    }

    return notification
  }

  // 承認通知作成
  async createApprovalNotification(
    workflowId: string,
    employeeName: string,
    evaluationType: string,
    approverId: string
  ): Promise<void> {
    await this.createNotification(
      'approval',
      'high',
      '承認が必要です',
      `${employeeName}の${evaluationType}が承認待ちです。`,
      approverId,
      {
        relatedId: workflowId,
        relatedType: 'workflow',
        actionUrl: '/evaluation/workflow',
        actionLabel: '承認画面へ'
      }
    )
  }

  // 評価期限通知作成
  async createEvaluationReminder(
    evaluationId: string,
    evaluationType: string,
    dueDate: Date,
    targetUserId: string
  ): Promise<void> {
    const daysUntilDue = Math.floor(
      (dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    let priority: NotificationPriority = 'low'
    if (daysUntilDue <= 1) priority = 'high'
    else if (daysUntilDue <= 3) priority = 'medium'

    await this.createNotification(
      'evaluation',
      priority,
      '評価入力期限のお知らせ',
      `${evaluationType}の入力期限は${dueDate.toLocaleDateString()}です。`,
      targetUserId,
      {
        relatedId: evaluationId,
        relatedType: 'evaluation',
        actionUrl: '/evaluation',
        actionLabel: '評価を入力',
        dueDate
      }
    )
  }
}

// シングルトンインスタンスをエクスポート
export const notificationService = new NotificationService()