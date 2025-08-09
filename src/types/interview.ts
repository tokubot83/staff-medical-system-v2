// VoiceDrive面談制度との統合仕様に基づく型定義（10種類体系・2024年12月改定）

// 面談分類
export type InterviewClassification = 'regular' | 'special' | 'support';

// 面談種類（10種類）
export type InterviewType = 
  // 定期面談（3種類）
  | 'new_employee_monthly'    // 新入職員月次面談（入職1年未満）
  | 'regular_annual'          // 一般職員年次面談
  | 'management_biannual'     // 管理職半年面談
  // 特別面談（3種類）
  | 'return_to_work'          // 復職面談
  | 'incident_followup'       // インシデント後面談
  | 'exit_interview'          // 退職面談
  // サポート面談（4種類）
  | 'feedback'                // フィードバック面談（人事評価後）
  | 'career_support'          // キャリア系面談
  | 'workplace_support'       // 職場環境系面談
  | 'individual_consultation'; // 個別相談面談

// 面談カテゴリ（サポート面談用・詳細分類）
export type InterviewCategory = 
  // キャリア系面談カテゴリ
  | 'career_path'           // キャリアパス（将来の目標）
  | 'skill_development'     // スキル開発（研修・資格）
  | 'promotion'             // 昇進・昇格
  | 'transfer'              // 異動・転勤
  // 職場環境系面談カテゴリ
  | 'work_environment'      // 職場環境（設備・制度）
  | 'interpersonal'         // 人間関係（チームワーク）
  | 'workload_balance'      // 業務負荷・ワークライフバランス
  | 'health_safety'         // 健康・安全
  // 個別相談面談カテゴリ
  | 'performance'           // パフォーマンス（業務改善）
  | 'compensation'          // 給与・待遇
  | 'training'              // 研修・教育
  | 'compliance'            // コンプライアンス
  | 'other';                // その他

// カテゴリが必要な面談種類の判定
export const requiresCategory = (interviewType: InterviewType): boolean => {
  return ['career_support', 'workplace_support', 'individual_consultation'].includes(interviewType);
};

// 面談種類ごとの利用可能カテゴリ
export const availableCategories: Record<string, InterviewCategory[]> = {
  career_support: ['career_path', 'skill_development', 'promotion', 'transfer'],
  workplace_support: ['work_environment', 'interpersonal', 'workload_balance', 'health_safety'],
  individual_consultation: ['performance', 'compensation', 'training', 'compliance', 'other'],
};

// 面談ステータス
export type InterviewStatus = 
  | 'scheduled'   // 予定
  | 'completed'   // 完了
  | 'cancelled'   // キャンセル
  | 'postponed'   // 延期
  | 'no_show';    // 無断欠席

// 緊急度レベル
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

// 機密性レベル
export type ConfidentialityLevel = 'normal' | 'confidential' | 'highly_confidential';

// 面談予約データ
export interface InterviewBooking {
  id: string;
  
  // 予約者情報
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeePhone?: string;
  facility: string;
  department: string;
  position: string;
  
  // 予約情報
  bookingDate: string;  // ISO 8601形式
  startTime: string;
  endTime: string;
  
  // 面談内容
  interviewType: InterviewType;
  interviewCategory: InterviewCategory;
  requestedTopics: string[];
  description?: string;
  urgencyLevel: UrgencyLevel;
  
  // 面談者情報
  interviewerId?: string;
  interviewerName?: string;
  interviewerLevel?: number;
  
  // ステータス
  status: InterviewStatus;
  
  // メタデータ
  createdAt: string;
  createdBy: string;
  lastModified?: string;
  modifiedBy?: string;
  
  // 管理情報
  adminNotes?: string;
  employeeNotes?: string;
  
  // 面談結果
  conductedAt?: string;
  duration?: number;  // 分単位
  outcomeSummary?: string;
  outcomeActionItems?: string[];
  outcomeFollowupRequired?: boolean;
  outcomeFollowupDate?: string;
  outcomeReferrals?: string[];
  outcomeConfidentialityLevel?: ConfidentialityLevel;
}

// 時間枠管理
export interface InterviewTimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBlocked: boolean;
  blockedBy?: string;
  blockedReason?: string;
  bookedBy?: string;
  bookingId?: string;
}

// 医療職員プロファイル
export interface MedicalEmployeeProfile {
  employeeId: string;
  employeeName: string;
  hireDate: string;
  employmentStatus: string;
  department: string;
  position: string;
  workPattern: string;
  
  // 特別な状況
  isOnLeave: boolean;
  isRetiring: boolean;
  isOnMaternityLeave: boolean;
  returnToWorkDate?: string;
  leaveStartDate?: string;
  
  // 面談履歴
  firstInterviewDate?: string;
  lastInterviewDate?: string;
  nextScheduledDate?: string;
  totalInterviews: number;
  mandatoryInterviewsCompleted: number;
  lastReminderSent?: string;
  overdueCount: number;
}

// 通知管理
export interface InterviewNotification {
  id: string;
  bookingId: string;
  recipientId: string;
  notificationType: 'reminder' | 'confirmation' | 'cancellation' | 'overdue';
  message: string;
  scheduledAt: string;
  sentAt?: string;
  isRead: boolean;
}

// 権限レベル定義（13階層）
export enum PermissionLevel {
  LEVEL_1 = 1,   // 一般職員
  LEVEL_2 = 2,   // チーフ・主任
  LEVEL_3 = 3,   // 係長・マネージャー
  LEVEL_4 = 4,   // 課長
  LEVEL_5 = 5,   // 人財統括本部 戦略企画・統括管理部門（面談予約1次窓口）
  LEVEL_6 = 6,   // 人財統括本部 キャリア支援部門員（面談実施者）
  LEVEL_7 = 7,   // 人財統括本部 各部門長（面談実施責任者）
  LEVEL_8 = 8,   // 人財統括本部 統括管理部門長
  LEVEL_9 = 9,   // 部長級
  LEVEL_10 = 10, // 本部長級
  LEVEL_11 = 11, // 事業部長級
  LEVEL_12 = 12, // 役員
  LEVEL_13 = 13  // 経営層（代表取締役等）
}

// 予約制限ルール
export interface BookingLimits {
  maxAdvanceBookingDays: number;      // 最大30日先まで予約可能
  minAdvanceBookingHours: number;     // 最低24時間前まで予約可能
  maxBookingsPerMonth: number;        // 月間最大予約回数
  minIntervalBetweenBookings: number; // 前回面談からの最小間隔（日数）
}

// 雇用形態別の面談頻度ルール
export interface InterviewFrequencyRule {
  type: InterviewType;
  intervalDays: number;
  isMandatory: boolean;
}

// 部署別の特別配慮ルール
export interface DepartmentSpecificRule {
  preferredTimeSlots?: string[];
  maxBookingsPerMonth?: number;
  blockedDays?: string[];
}

// リマインダースケジュール
export interface ReminderSchedule {
  reminderDays: number[];         // 面談前のリマインダー日数
  overdueReminderDays: number[];  // 期限超過後のリマインダー日数
  maxOverdueReminders: number;    // 最大期限超過リマインダー数
}

// API レスポンス型
export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
  suggestedAlternatives?: InterviewTimeSlot[];
}

export interface BookingListResponse {
  bookings: InterviewBooking[];
  total: number;
  page: number;
  totalPages: number;
}

// 旧システムとの互換性のため、既存の型をエイリアスとして残す
export type Interview = InterviewBooking;

// 旧システムの型をマッピング
export interface InterviewFeedback {
  overallSatisfaction: number;
  topics: InterviewTopic[];
  keyPoints: string[];
  actionItems: string[];
  concerns: string[];
  recommendations: string[];
  nextSteps: string[];
  privateNotes?: string;
}

export interface InterviewTopic {
  category: string;
  discussed: boolean;
  notes?: string;
  importance: 'high' | 'medium' | 'low';
}

export interface InterviewSummary {
  staffId: string;
  totalInterviews: number;
  completedInterviews: number;
  cancelledInterviews: number;
  averageSatisfaction: number;
  lastInterviewDate: string;
  nextScheduledDate?: string;
  frequentTopics: string[];
  recommendedFrequency: string;
}

export interface InterviewSchedule {
  staffId: string;
  scheduledInterviews: InterviewBooking[];
  suggestedDates: string[];
  overdue: boolean;
  daysSinceLastInterview: number;
}