// キャリアコース変更申請システムの型定義

export type CareerCourse = 'A' | 'B' | 'C' | 'D';

export type CareerChangeStatus =
  | 'pending'     // 承認待ち
  | 'reviewing'   // 審査中
  | 'approved'    // 承認済み
  | 'rejected';   // 却下

export type ChangeDirection = 'upgrade' | 'downgrade' | 'lateral';

export interface CareerChangeApplication {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  facility: string;
  currentCourse: CareerCourse;
  requestedCourse: CareerCourse;
  changeDirection: ChangeDirection; // アップグレード/ダウングレード/横移動
  reason: string; // 変更理由
  submittedAt: string; // ISO 8601形式 (YYYY-MM-DDTHH:mm:ss)
  status: CareerChangeStatus;
  reviewer?: string; // 審査担当者
  reviewedAt?: string; // 審査日時
  reviewComment?: string; // 審査コメント
  approvedAt?: string; // 承認日時
  daysElapsed: number; // 申請からの経過日数
  urgencyLevel: number; // 緊急度（1-10）
}

// キャリアコース変更申請の統計データ
export interface CareerChangeStats {
  totalPending: number;
  totalReviewing: number;
  totalApproved: number;
  totalRejected: number;
  upgradeRequests: number; // アップグレード申請
  downgradeRequests: number; // ダウングレード申請（要注意）
  overduePending: number; // 7日以上未処理
}
