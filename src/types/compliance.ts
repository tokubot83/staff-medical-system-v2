// コンプライアンス通報システムの型定義

export type ComplianceReportType =
  | 'ハラスメント'
  | 'パワハラ'
  | 'セクハラ'
  | '労働環境'
  | '不正行為'
  | '安全衛生'
  | 'その他';

export type ComplianceSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ComplianceStatus =
  | 'unprocessed'    // 未対応
  | 'investigating'  // 調査中
  | 'action_taken'   // 措置実施中
  | 'resolved'       // 解決済み
  | 'closed';        // 終結

export type ReporterType = 'anonymous' | 'named';

export interface ComplianceReport {
  id: string;
  reportType: ComplianceReportType;
  severity: ComplianceSeverity;
  status: ComplianceStatus;
  reporterType: ReporterType;
  receivedAt: string; // ISO 8601形式 (YYYY-MM-DDTHH:mm:ss)
  department: string; // 問題発生部署
  facility: string;
  summary: string; // 通報概要（匿名化済み）
  details?: string; // 詳細（アクセス制限あり）
  relatedStaffCount?: number; // 関係職員数
  actionDeadline: string; // 初動対応期限 (YYYY-MM-DDTHH:mm:ss)
  investigator?: string; // 調査担当者
  lastUpdatedAt?: string; // 最終更新日時
  hoursElapsed: number; // 受信からの経過時間（時間）
}

// コンプライアンス統計データ
export interface ComplianceStats {
  totalUnprocessed: number;
  totalInvestigating: number;
  totalResolved: number;
  criticalCount: number;
  overdueCount: number; // 初動対応期限超過
  within24Hours: number; // 24時間以内の対応必要
}
