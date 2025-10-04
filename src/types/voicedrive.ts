// VoiceDrive連携面談予約データの型定義

export type InterviewType =
  | 'サポート面談'
  | '定期面談'
  | '特別面談'
  | '評価フィードバック面談'
  | '緊急面談';

export type InterviewPriority = 'high' | 'medium' | 'low';

export type InterviewStatus =
  | 'pending'        // 初回受付待ち
  | 'processing'     // 承認・確認処理中
  | 'confirmed'      // 確定済み
  | 'rejected'       // 再提案必要
  | 'completed';     // 面談実行済み

export type EvaluationPeriod = '夏季（暫定）' | '冬季（暫定）' | '年間評価';

export interface EvaluationResult {
  facilityRating: 'S' | 'A' | 'B' | 'C';
  corporationRating: 'S' | 'A' | 'B' | 'C';
  contributionScore: number;
  period: EvaluationPeriod;
  appealDeadline: string; // YYYY/MM/DD形式
}

export interface VoiceDriveInterview {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  facility: string;
  type: InterviewType;
  priority: InterviewPriority;
  status: InterviewStatus;
  receivedDate: string; // YYYY/MM/DD形式
  preferredDates: string[]; // 希望日程
  consultationContent: string; // 相談内容
  evaluationResult?: EvaluationResult; // 評価結果（評価フィードバック面談の場合）
  voiceDriveApprovedAt?: string; // VoiceDrive承認日時
  adjustmentCount: number; // 調整回数
  rejectionCount: number; // 拒否回数
  daysElapsed: number; // 経過日数
}

// VoiceDrive統計データ
export interface VoiceDriveStats {
  totalPending: number;
  totalProcessing: number;
  totalConfirmed: number;
  evaluationFeedbackCount: {
    total: number;
    unprocessed: number;
    processing: number;
    nearDeadline: number;
    summer: number;
    winter: number;
    annual: number;
  };
}
