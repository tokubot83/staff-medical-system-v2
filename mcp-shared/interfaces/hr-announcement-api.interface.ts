/**
 * 人事お知らせAPI連携インターフェース
 * 職員カルテシステム ⇔ VoiceDrive 間の通信用
 *
 * VoiceDrive側の実装を参考に作成
 * 参照: src/api/routes/hr-announcements.routes.ts
 */

// =====================================
// 職員カルテ → VoiceDrive（お知らせ送信）
// =====================================

/**
 * お知らせ送信リクエスト
 * 職員カルテシステムからVoiceDriveへのお知らせ送信用
 */
export interface MedicalSystemAnnouncementRequest {
  // 基本情報
  title: string;                  // 最大500文字
  content: string;                // 最大5000文字
  category: 'announcement' | 'interview' | 'training' | 'survey' | 'other';
  priority: 'low' | 'medium' | 'high';

  // 配信対象
  targetType: 'all' | 'departments' | 'individuals' | 'positions';
  targetDepartments?: string[];   // targetType='departments'の場合必須
  targetIndividuals?: string[];   // targetType='individuals'の場合必須
  targetPositions?: string[];     // targetType='positions'の場合必須

  // アクションボタン
  hasActionButton: boolean;
  actionButton?: {
    type: 'interview_reservation' | 'survey_response' | 'training_apply' | 'health_check' | 'custom';
    label: string;
    url?: string;                 // type='custom'の場合に使用
    config?: {
      interviewTypeId?: string;   // type='interview_reservation'の場合
      surveyId?: string;          // type='survey_response'の場合
      trainingId?: string;        // type='training_apply'の場合
      healthCheckId?: string;     // type='health_check'の場合
    };
  };

  // VoiceDrive UI仕様（固定値）
  requireResponse: false;         // 固定: false
  autoTrackResponse: true;        // 固定: true

  // 日時設定
  scheduledPublishAt?: string;    // ISO 8601形式
  expiresAt?: string;            // ISO 8601形式

  // メタデータ
  metadata: {
    sourceSystem: 'medical-staff-system';  // 固定値
    sourceAnnouncementId: string;          // 職員カルテ側のID（必須）
    createdBy: string;                     // 作成者ID
    createdAt: string;                     // ISO 8601形式
  };
}

/**
 * お知らせ送信レスポンス
 * VoiceDriveからの応答
 */
export interface MedicalSystemAnnouncementResponse {
  success: boolean;
  data?: {
    voicedriveAnnouncementId: string;   // VoiceDrive側のID
    status: 'published' | 'scheduled';
    publishedAt: string;                // ISO 8601形式
    estimatedDelivery: number;          // 配信予定数
    targetedUsers: {                    // 部門別配信数
      department: string;
      count: number;
    }[];
  };
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: {
      field: string;
      message: string;
    }[];
  };
}

// =====================================
// VoiceDrive → 職員カルテ（統計送信）
// =====================================

/**
 * 統計情報Webhookペイロード
 * VoiceDriveから職員カルテシステムへの統計送信用
 *
 * 参照: mcp-shared/specs/voicedrive-stats-webhook-spec-v1.0.0.md
 */
export interface StatsWebhookPayload {
  event: 'stats.updated' | 'stats.hourly' | 'stats.daily';
  timestamp: string;  // ISO 8601形式

  announcement: {
    id: string;       // VoiceDrive側のID
    title: string;
    category: 'announcement' | 'interview' | 'training' | 'survey' | 'other';
    priority: 'low' | 'medium' | 'high';
    publishedAt: string;  // ISO 8601形式
  };

  stats: {
    delivered: number;
    actions: number;
    completions: number;
    details?: {
      viewCount?: number;
      uniqueViewers?: number;
      averageReadTime?: number;
      actionsByDepartment?: {
        [department: string]: number;
      };
    };
  };

  metadata: {
    source: 'voicedrive';
    version: string;
    environment: 'production' | 'staging' | 'development';
  };
}

/**
 * 統計Webhookレスポンス
 * 職員カルテシステムからの応答
 */
export interface StatsWebhookResponse {
  success: boolean;
  receivedAt: string;   // ISO 8601形式
  processed: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

// =====================================
// VoiceDrive内部形式（参考）
// =====================================

/**
 * VoiceDrive内部のお知らせ形式
 * 職員カルテシステムでは使用しないが、理解のために記載
 */
export interface HRAnnouncementInternal {
  id: string;
  title: string;
  content: string;
  category: 'ANNOUNCEMENT' | 'MEETING' | 'TRAINING' | 'SURVEY' | 'OTHER';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  authorId: string;
  authorName: string;
  authorDepartment: string;
  publishAt: Date;
  isActive: boolean;
  requireResponse: boolean;
  responseType: 'acknowledged';
  targetAudience: {
    isGlobal: boolean;
    departments?: string[];
    individuals?: string[];
    roles?: string[];
  };
  actionButton?: {
    text: string;
    url: string;
    type: 'internal' | 'external' | 'medical_system';
  };
  stats: {
    delivered: number;
    responses: number;
    completions: number;
  };
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

// =====================================
// ヘルパー型
// =====================================

/**
 * API送信時の環境設定
 */
export interface VoiceDriveApiConfig {
  endpoint: string;
  apiToken: string;
  webhookSecret: string;
  environment: 'production' | 'staging' | 'development';
}

/**
 * バリデーションエラー
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * APIエラーコード
 */
export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'INVALID_SOURCE'
  | 'INTERNAL_ERROR'
  | 'INVALID_SIGNATURE';
