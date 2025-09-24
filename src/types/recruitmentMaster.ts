// 採用管理マスター設定の型定義

// ==========================================
// 1. 採用ステータス・フロー設定
// ==========================================

export interface RecruitmentStatusConfig {
  id: string
  code: string
  name: string
  category: 'visitor' | 'applicant' | 'offer' | 'employee' | 'inactive'
  description: string
  color: string
  icon: string
  order: number
  isActive: boolean
  isDefault: boolean
  canDelete: boolean // システム標準ステータスは削除不可

  // 遷移可能なステータス
  allowedTransitions: string[] // ステータスコードの配列

  // 自動遷移設定
  autoTransition?: {
    enabled: boolean
    targetStatus: string
    conditions: TransitionCondition[]
    daysAfter?: number // 指定日数後に自動遷移
  }

  // 通知設定
  notifications?: {
    onEnter?: NotificationTemplate
    onExit?: NotificationTemplate
    reminder?: ReminderConfig
  }

  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
  }
}

export interface TransitionCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

export interface NotificationTemplate {
  enabled: boolean
  recipients: ('applicant' | 'hr' | 'manager' | 'custom')[]
  customRecipients?: string[]
  subject: string
  bodyTemplate: string
  attachments?: string[]
}

export interface ReminderConfig {
  enabled: boolean
  daysBeforeDeadline: number[]
  template: NotificationTemplate
}

// ==========================================
// 2. フォームビルダー設定
// ==========================================

export interface FormFieldConfig {
  id: string
  fieldCode: string
  fieldName: string
  fieldType:
    | 'text'
    | 'number'
    | 'email'
    | 'phone'
    | 'date'
    | 'datetime'
    | 'select'
    | 'multiselect'
    | 'radio'
    | 'checkbox'
    | 'textarea'
    | 'file'
    | 'address'
    | 'employment_history'
    | 'education_history'
    | 'qualification'
    | 'custom'

  category: 'basic' | 'contact' | 'experience' | 'education' | 'skills' | 'documents' | 'custom'

  // 表示設定
  display: {
    label: string
    placeholder?: string
    helpText?: string
    order: number
    width: 'full' | 'half' | 'third' | 'quarter'
    group?: string // フィールドグループ
  }

  // バリデーション設定
  validation: {
    required: boolean
    minLength?: number
    maxLength?: number
    pattern?: string // 正規表現
    min?: number // 数値の最小値
    max?: number // 数値の最大値
    fileTypes?: string[] // ファイルの種類
    maxFileSize?: number // ファイルサイズ上限(MB)
    customValidator?: string // カスタムバリデーション関数名
  }

  // 選択肢（select, radio, checkbox用）
  options?: {
    value: string
    label: string
    order: number
    isDefault?: boolean
    isActive: boolean
  }[]

  // 条件付き表示
  conditional?: {
    enabled: boolean
    dependsOn: string // 依存するフィールドのfieldCode
    condition: TransitionCondition
  }

  // 適用範囲
  scope: {
    facilities: string[] // 適用施設
    positions: string[] // 適用職種
    formTypes: ('visitor' | 'application' | 'interview' | 'offer')[] // 適用フォーム
  }

  isActive: boolean
  isSystem: boolean // システム標準フィールド

  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
  }
}

export interface FormTemplate {
  id: string
  templateCode: string
  templateName: string
  formType: 'visitor' | 'application' | 'interview' | 'offer'
  description: string

  // フィールド構成
  sections: {
    id: string
    title: string
    description?: string
    order: number
    fields: string[] // fieldCodeの配列
    isCollapsible: boolean
    isDefaultOpen: boolean
  }[]

  // 適用範囲
  scope: {
    facilities: string[]
    departments: string[]
    positions: string[]
  }

  // 提出後の処理
  submission: {
    confirmationMessage: string
    redirectUrl?: string
    notifications: NotificationTemplate[]
    webhooks?: {
      url: string
      method: 'POST' | 'PUT'
      headers?: Record<string, string>
    }[]
  }

  isActive: boolean
  isDefault: boolean
  version: number

  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
  }
}

// ==========================================
// 3. 自動化ルール設定
// ==========================================

export interface AutomationRule {
  id: string
  ruleCode: string
  ruleName: string
  description: string
  ruleType: 'status_change' | 'time_based' | 'data_based' | 'webhook'

  // トリガー条件
  trigger: {
    type: 'immediate' | 'scheduled' | 'recurring'

    // イベントベーストリガー
    event?: {
      type: string // 'status_changed', 'form_submitted', 'interview_scheduled' など
      conditions?: TransitionCondition[]
    }

    // 時間ベーストリガー
    schedule?: {
      frequency: 'once' | 'daily' | 'weekly' | 'monthly'
      time?: string // HH:mm形式
      dayOfWeek?: number[] // 0-6 (日曜-土曜)
      dayOfMonth?: number[] // 1-31
      timezone: string
    }

    // データベーストリガー
    dataConditions?: TransitionCondition[]
  }

  // アクション
  actions: {
    type:
      | 'send_email'
      | 'update_status'
      | 'assign_task'
      | 'create_reminder'
      | 'update_field'
      | 'call_webhook'
      | 'generate_document'

    config: {
      // メール送信
      email?: NotificationTemplate

      // ステータス更新
      statusUpdate?: {
        targetStatus: string
        updateMessage?: string
      }

      // タスク割り当て
      task?: {
        title: string
        description: string
        assignTo: string
        dueInDays: number
        priority: 'low' | 'medium' | 'high'
      }

      // フィールド更新
      fieldUpdate?: {
        fieldCode: string
        value: any
        operation?: 'set' | 'append' | 'increment'
      }

      // Webhook呼び出し
      webhook?: {
        url: string
        method: string
        headers?: Record<string, string>
        bodyTemplate?: string
      }
    }

    order: number
  }[]

  // 実行条件
  conditions: {
    facilities?: string[]
    departments?: string[]
    positions?: string[]
    statuses?: string[]
    tags?: string[]
  }

  // エラーハンドリング
  errorHandling: {
    retryCount: number
    retryInterval: number // 分
    fallbackAction?: 'skip' | 'notify' | 'stop'
    notifyOnError: string[] // 通知先メールアドレス
  }

  isActive: boolean
  priority: number // 実行優先度

  // 実行履歴
  lastExecutedAt?: string
  executionCount: number
  successCount: number
  failureCount: number

  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
  }
}

// ==========================================
// 4. レポートテンプレート管理
// ==========================================

export interface ReportTemplate {
  id: string
  templateCode: string
  templateName: string
  category: 'pipeline' | 'performance' | 'source' | 'facility' | 'custom'
  description: string

  // データソース設定
  dataSource: {
    entities: ('talent' | 'visitor' | 'applicant' | 'employee')[]
    dateRange: {
      type: 'fixed' | 'relative'
      // 固定期間
      fixedStart?: string
      fixedEnd?: string
      // 相対期間
      relativePeriod?: 'last_week' | 'last_month' | 'last_quarter' | 'last_year' | 'custom'
      customDays?: number
    }
    filters?: {
      field: string
      operator: string
      value: any
    }[]
  }

  // レポート構成
  components: {
    id: string
    type: 'chart' | 'table' | 'metric' | 'text'
    title: string
    order: number

    // チャート設定
    chart?: {
      chartType: 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'scatter'
      xAxis: string
      yAxis: string | string[]
      groupBy?: string
      aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
      showLegend: boolean
      showDataLabels: boolean
    }

    // テーブル設定
    table?: {
      columns: {
        field: string
        header: string
        width?: string
        align?: 'left' | 'center' | 'right'
        format?: string // 日付や数値のフォーマット
        sortable: boolean
      }[]
      pagination: boolean
      pageSize: number
      exportable: boolean
    }

    // メトリクス設定
    metric?: {
      field: string
      aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max'
      format?: string
      comparison?: {
        enabled: boolean
        period: 'previous' | 'year_ago'
        showPercentage: boolean
      }
      trend?: {
        enabled: boolean
        period: number // 日数
      }
    }

    width: 'full' | 'half' | 'third' | 'quarter'
  }[]

  // スケジュール設定
  schedule?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string
    dayOfWeek?: number[]
    dayOfMonth?: number[]
    recipients: string[]
    format: 'pdf' | 'excel' | 'csv'
  }

  // エクスポート設定
  export: {
    formats: ('pdf' | 'excel' | 'csv')[]
    includeCharts: boolean
    includeRawData: boolean
    passwordProtect?: boolean
  }

  // アクセス権限
  permissions: {
    viewRoles: string[]
    editRoles: string[]
    exportRoles: string[]
  }

  isActive: boolean
  isPublic: boolean

  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
    lastGeneratedAt?: string
  }
}

// ==========================================
// 5. データ検証ルール
// ==========================================

export interface ValidationRule {
  id: string
  ruleCode: string
  ruleName: string
  description: string
  ruleType: 'duplicate' | 'format' | 'business' | 'consistency'

  // 検証対象
  target: {
    entity: 'talent' | 'visitor' | 'applicant'
    fields: string[]
    timing: ('create' | 'update' | 'import')[]
  }

  // 検証ロジック
  validation: {
    // 重複チェック
    duplicate?: {
      fields: string[] // チェック対象フィールド
      scope: 'global' | 'facility' | 'department'
      caseSensitive: boolean
      ignoreSpaces: boolean
      fuzzyMatch?: {
        enabled: boolean
        threshold: number // 0-100 類似度
      }
    }

    // フォーマットチェック
    format?: {
      field: string
      pattern: string // 正規表現
      errorMessage: string
    }

    // ビジネスルール
    business?: {
      expression: string // 評価式
      errorMessage: string
      warningOnly?: boolean
    }

    // 整合性チェック
    consistency?: {
      rules: {
        field1: string
        operator: string
        field2?: string
        value?: any
        errorMessage: string
      }[]
    }
  }

  // アクション
  action: {
    type: 'block' | 'warn' | 'auto_correct'

    // 自動修正
    autoCorrect?: {
      field: string
      correction: 'trim' | 'uppercase' | 'lowercase' | 'format' | 'custom'
      customFunction?: string
    }

    // 通知
    notification?: {
      enabled: boolean
      recipients: string[]
      includeDetails: boolean
    }
  }

  // 除外条件
  exclusions?: {
    statuses?: string[]
    tags?: string[]
    facilities?: string[]
  }

  severity: 'error' | 'warning' | 'info'
  isActive: boolean

  // 実行統計
  statistics?: {
    lastRunAt: string
    totalChecks: number
    violations: number
    autoCorrections: number
  }

  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
  }
}

// ==========================================
// 6. インポート/エクスポート設定
// ==========================================

export interface ImportExportConfig {
  id: string
  configName: string
  type: 'import' | 'export'
  entity: 'talent' | 'visitor' | 'applicant' | 'all'
  format: 'csv' | 'excel' | 'json'

  // フィールドマッピング
  fieldMapping: {
    sourceField: string // CSVのヘッダー名など
    targetField: string // システムのフィールド名
    dataType: string
    required: boolean
    defaultValue?: any
    transformation?: {
      type: 'trim' | 'uppercase' | 'lowercase' | 'date_format' | 'custom'
      format?: string // 日付フォーマットなど
      customFunction?: string
    }
  }[]

  // インポート設定
  importConfig?: {
    duplicateHandling: 'skip' | 'update' | 'create_new'
    duplicateCheckFields: string[]
    batchSize: number
    validateBeforeImport: boolean
    rollbackOnError: boolean

    // データクレンジング
    dataCleansing: {
      trimWhitespace: boolean
      removeEmptyRows: boolean
      standardizePhone: boolean
      standardizeEmail: boolean
    }

    // 通知設定
    notifications: {
      onStart: boolean
      onComplete: boolean
      onError: boolean
      recipients: string[]
    }
  }

  // エクスポート設定
  exportConfig?: {
    includeHeaders: boolean
    dateFormat: string
    encoding: 'utf-8' | 'shift-jis'

    // フィールド選択
    fields: {
      field: string
      header: string
      order: number
      format?: string
    }[]

    // フィルター
    filters?: {
      field: string
      operator: string
      value: any
    }[]

    // ファイル設定
    fileSettings: {
      fileName: string // テンプレート: {date}_{type}.csv
      compression: boolean
      password?: boolean
      splitSize?: number // ファイル分割サイズ(MB)
    }
  }

  // スケジュール設定
  schedule?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string
    dayOfWeek?: number[]
    dayOfMonth?: number[]

    // 自動インポート元
    source?: {
      type: 'ftp' | 'sftp' | 'http' | 'email' | 'cloud'
      connectionString?: string
      credentials?: {
        username: string
        password?: string // 暗号化して保存
        apiKey?: string
      }
      path?: string
      filePattern?: string // ファイル名パターン
    }

    // 自動エクスポート先
    destination?: {
      type: 'ftp' | 'sftp' | 'email' | 'cloud'
      connectionString?: string
      credentials?: {
        username: string
        password?: string
        apiKey?: string
      }
      path?: string
      emailRecipients?: string[]
    }
  }

  isActive: boolean
  isDefault: boolean

  // 実行履歴
  lastExecutedAt?: string
  lastExecutedBy?: string
  executionHistory?: {
    id: string
    executedAt: string
    executedBy: string
    recordsProcessed: number
    recordsSuccess: number
    recordsFailed: number
    errorLog?: string
    fileName?: string
  }[]

  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
  }
}

// ==========================================
// 7. 採用ソース管理
// ==========================================

export interface RecruitmentSource {
  id: string
  sourceCode: string
  sourceName: string
  category: 'job_board' | 'referral' | 'direct' | 'agency' | 'school' | 'sns' | 'other'
  description?: string

  // コスト設定
  cost?: {
    type: 'fixed' | 'per_click' | 'per_application' | 'per_hire'
    amount: number
    currency: string
    billingCycle?: 'monthly' | 'yearly' | 'one_time'
  }

  // トラッキング設定
  tracking: {
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    trackingCode?: string
    landingPageUrl?: string
  }

  // パフォーマンス指標
  metrics?: {
    totalVisitors: number
    totalApplicants: number
    totalHires: number
    conversionRate: number
    averageTimeToHire: number
    qualityScore: number // 1-5
    roi?: number
  }

  // 契約情報
  contract?: {
    vendorName?: string
    contractStartDate?: string
    contractEndDate?: string
    contactPerson?: string
    contactEmail?: string
    contactPhone?: string
    notes?: string
  }

  isActive: boolean
  priority: number

  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
  }
}

// ==========================================
// 8. 評価基準テンプレート
// ==========================================

export interface EvaluationTemplate {
  id: string
  templateCode: string
  templateName: string
  evaluationType: 'interview' | 'document' | 'practical' | 'reference'
  description: string

  // 評価項目
  criteria: {
    id: string
    category: string
    name: string
    description: string
    weight: number // 重み付け
    order: number

    // 評価方法
    evaluationMethod: {
      type: 'rating' | 'score' | 'yes_no' | 'text'

      // 評価尺度
      scale?: {
        min: number
        max: number
        labels?: Record<number, string>
      }

      // スコアリング
      scoring?: {
        maxPoints: number
        passingScore?: number
      }
    }

    // 評価ガイドライン
    guidelines?: {
      excellent: string
      good: string
      average: string
      poor: string
    }

    required: boolean
  }[]

  // 総合評価
  overallAssessment: {
    calculateAutomatically: boolean
    formula?: string // 計算式
    categories: {
      label: string
      minScore: number
      maxScore: number
      color: string
      recommendation: string
    }[]
  }

  // 適用範囲
  scope: {
    positions: string[]
    departments: string[]
    facilities: string[]
    interviewRounds?: number[]
  }

  // フィードバックテンプレート
  feedbackTemplate?: {
    toCandidate: boolean
    candidateTemplate?: string
    toHiring: boolean
    hiringTemplate?: string
  }

  isActive: boolean
  version: number

  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
  }
}

// ==========================================
// 採用管理マスター設定（統合）
// ==========================================

export interface RecruitmentMasterConfig {
  // 基本情報
  id: string
  version: string
  lastUpdated: string
  updatedBy: string

  // 各種設定
  statuses: RecruitmentStatusConfig[]
  formFields: FormFieldConfig[]
  formTemplates: FormTemplate[]
  automationRules: AutomationRule[]
  reportTemplates: ReportTemplate[]
  validationRules: ValidationRule[]
  importExportConfigs: ImportExportConfig[]
  recruitmentSources: RecruitmentSource[]
  evaluationTemplates: EvaluationTemplate[]

  // グローバル設定
  globalSettings: {
    // デフォルト値
    defaults: {
      visitorStatus: string
      applicantStatus: string
      interviewDuration: number // 分
      offerValidityDays: number
      probationPeriodDays: number
    }

    // 通知設定
    notifications: {
      defaultSender: string
      replyTo: string
      ccAddresses: string[]
      enableSms: boolean
      smsProvider?: string
    }

    // セキュリティ設定
    security: {
      dataRetentionDays: number
      anonymizeAfterDays: number
      requireConsent: boolean
      gdprCompliant: boolean
    }

    // 統合設定
    integrations: {
      enabled: boolean
      apis: {
        name: string
        endpoint: string
        apiKey: string
        isActive: boolean
      }[]
    }
  }

  // アクセス制御
  permissions: {
    role: string
    capabilities: {
      viewTalents: boolean
      editTalents: boolean
      deleteTalents: boolean
      exportData: boolean
      configureSystem: boolean
      viewReports: boolean
      manageTemplates: boolean
    }
  }[]
}

// ==========================================
// ユーティリティ型
// ==========================================

export type MasterConfigChangeLog = {
  id: string
  configType: keyof RecruitmentMasterConfig
  configId: string
  action: 'create' | 'update' | 'delete'
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  changedBy: string
  changedAt: string
  reason?: string
}

export type MasterConfigBackup = {
  id: string
  backupName: string
  config: RecruitmentMasterConfig
  createdBy: string
  createdAt: string
  description?: string
}