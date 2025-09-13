/**
 * Pattern D統合用の面談予約拡張型定義
 * VoiceDriveとの連携で使用するAI最適化関連のインターフェース
 */

// VoiceDriveからの詳細希望申込
export interface EnhancedInterviewRequest {
  // 基本情報
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  experienceYears: number;

  // 面談基本情報
  type: 'regular' | 'special' | 'support';
  category?: string;
  topic?: string;
  details?: string;

  // 時期希望
  urgencyLevel: 'urgent' | 'this_week' | 'next_week' | 'this_month';
  preferredDates?: string[];           // 具体的希望日（最大3つ）
  unavailableDates?: string[];         // 不都合な日

  // 時間帯希望
  timePreference: {
    morning: boolean;    // 9:00-12:00
    afternoon: boolean;  // 13:00-17:00
    evening: boolean;    // 17:30-19:00
    anytime: boolean;    // いつでも可
  };

  // 担当者希望
  interviewerPreference: {
    specificPerson?: string;        // 特定の人を指名
    genderPreference?: 'male' | 'female' | 'no_preference';
    specialtyPreference?: string;   // 専門分野の希望
    anyAvailable: boolean;          // おまかせ
  };

  // その他
  minDuration: number;               // 最短希望時間（分）
  maxDuration: number;               // 最長希望時間（分）
  additionalRequests?: string;       // 追加要望

  // システム情報
  source: 'voicedrive';
  requestId?: string;
  timestamp: string;
}

// AI最適化処理結果
export interface AIOptimizationResult {
  requestId: string;
  processingTime: number;
  confidence: number;
  recommendations: InterviewRecommendation[];
  alternativeOptions: AlternativeOption[];
  metadata: OptimizationMetadata;
}

// 面談推薦候補
export interface InterviewRecommendation {
  id: string;
  confidence: number;              // 信頼度（0-100）

  interviewer: {
    id: string;
    name: string;
    title: string;
    department: string;
    experience: string;
    specialties: string[];
    profileImage?: string;
  };

  schedule: {
    date: string;
    time: string;
    duration: number;
    location: string;
    format: 'face_to_face' | 'online' | 'hybrid';
  };

  aiReasoning: {
    matchingFactors: string[];      // マッチング要因
    summary: string;                // 1行サマリー
    detailedReasons: string[];      // 詳細理由
    alternativeOptions: string[];   // 代替案
  };

  staffFriendlyDisplay: {
    title: string;                  // 職員向けタイトル
    summary: string;                // 簡潔な推薦理由
    highlights: string[];           // ハイライトポイント
  };
}

// 代替案オプション
export interface AlternativeOption {
  type: 'time_adjustment' | 'interviewer_change' | 'format_change';
  description: string;
  newSchedule?: {
    date?: string;
    time?: string;
    duration?: number;
  };
  newInterviewer?: {
    name: string;
    availability: string;
  };
}

// 最適化メタデータ
export interface OptimizationMetadata {
  totalCandidates: number;
  selectedTop: number;
  processingModel: string;
  algorithmsUsed: string[];
  dataPrivacy: string;
  qualityScore: number;
}

// 担当者プロファイル（AI最適化用）
export interface InterviewerProfile {
  id: string;
  personalInfo: {
    name: string;
    title: string;
    department: string;
    experienceYears: number;
    gender?: 'male' | 'female';
  };

  specialties: {
    primaryAreas: string[];
    secondaryAreas: string[];
    certifications: string[];
  };

  availability: {
    weeklySchedule: TimeSlot[];
    unavailableDates: string[];
    preferredDuration: {
      min: number;
      max: number;
      default: number;
    };
  };

  performanceMetrics: {
    satisfactionScore: number;
    completionRate: number;
    averageRating: number;
    totalInterviews: number;
  };

  matchingPreferences: {
    staffLevels: string[];          // 新人、中堅、ベテラン等
    departments: string[];
    interviewTypes: string[];
  };
}

// 時間枠定義
export interface TimeSlot {
  id: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0=日曜
  startTime: string;               // HH:mm形式
  endTime: string;
  duration: number;                // 標準面談時間（分）
  maxBookings: number;             // 同時間帯最大予約数
  slotType: 'morning' | 'afternoon' | 'evening';
  isActive: boolean;
}

// 拡張面談予約（Pattern D対応）
export interface EnhancedInterviewReservation {
  // 基本予約情報（既存を拡張）
  id: string;
  type: 'regular' | 'special' | 'support';
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  experienceYears: number;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

  // Pattern D拡張情報
  bookingType: 'instant' | 'ai_optimized';
  originalRequest?: EnhancedInterviewRequest;
  aiOptimizationResult?: AIOptimizationResult;
  selectedRecommendationId?: string;

  // 担当者情報
  interviewerInfo: {
    id: string;
    name: string;
    title: string;
    department: string;
  };

  // システム情報
  source: 'manual' | 'system' | 'voicedrive';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  // 品質・フィードバック
  qualityMetrics?: {
    staffSatisfaction?: number;
    matchingAccuracy?: number;
    timeliness?: number;
  };
}

// リアルタイム更新用ステータス
export interface BookingStatusUpdate {
  requestId: string;
  newStatus: 'processing' | 'proposals_ready' | 'selection_pending' | 'confirmed' | 'failed';
  message: string;
  estimatedCompletion?: string;
  actionRequired?: boolean;
  proposals?: InterviewRecommendation[];
  errorDetails?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

// AI学習・改善用データ
export interface AILearningData {
  requestId: string;
  originalRequest: EnhancedInterviewRequest;
  recommendations: InterviewRecommendation[];
  userChoice: {
    selectedRecommendationId: string;
    selectionTime: number;          // 選択にかかった時間（秒）
    alternativesConsidered: string[];
  };
  outcome: {
    interviewCompleted: boolean;
    satisfactionScore?: number;
    feedback?: string;
    rescheduleRequired: boolean;
  };
  systemMetrics: {
    processingTime: number;
    accuracy: number;
    algorithm: string;
  };
}

// API レスポンス型
export interface AssistedBookingResponse {
  requestId: string;
  status: 'accepted' | 'rejected';
  estimatedCompletionTime: string;
  fallbackOptions?: string[];
  message?: string;
}

export interface ProposalsResponse {
  requestId: string;
  proposals: InterviewRecommendation[];
  expiresAt: string;
  contactInfo: {
    urgentPhone?: string;
    email?: string;
  };
  metadata: OptimizationMetadata;
}

export interface BookingConfirmationResponse {
  bookingId: string;
  reservation: EnhancedInterviewReservation;
  confirmationDetails: {
    interviewerNotified: boolean;
    calendarUpdated: boolean;
    reminderScheduled: boolean;
  };
  message: string;
}