/**
 * 健康データアクセス監査ログシステム
 *
 * ストレスチェック・健康診断・産業医面談などの健康データへのアクセスを
 * 厳格に監査するための専用ログシステム
 */

import { prisma } from '@/lib/prisma';

export type HealthDataType =
  | 'stress_check'
  | 'health_checkup'
  | 'occupational_consultation'
  | 'work_restrictions'
  | 'medical_opinion'
  | 'reexamination';

export type HealthDataAction =
  | 'VIEW'
  | 'VIEW_DENIED'
  | 'EXPORT'
  | 'CONSENT_UPDATE'
  | 'DATA_MODIFY'
  | 'DATA_DELETE';

export interface HealthDataAuditLogEntry {
  userId: string;             // アクセスしたユーザーID
  userLevel: number;          // アクセス時のユーザー権限レベル
  action: HealthDataAction;   // 実行されたアクション
  dataType: HealthDataType;   // アクセス対象のデータ種別
  targetStaffId: string;      // 対象職員ID
  targetDataId?: string;      // 対象データの具体的ID
  consentStatus?: boolean | null; // アクセス時の同意状況
  accessGranted: boolean;     // アクセスが許可されたか
  denialReason?: string;      // 拒否理由（アクセス拒否時）
  viewedFields?: string[];    // 閲覧されたフィールド（閲覧成功時）
  changes?: Record<string, any>; // 変更内容（更新・削除時）
  accessPurpose?: string;     // アクセス目的
  ipAddress: string;          // IPアドレス
  userAgent: string;          // ユーザーエージェント
  sessionId?: string;         // セッションID
  timestamp: Date;            // タイムスタンプ
}

export interface HealthDataAuditQuery {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  targetStaffId?: string;
  dataType?: HealthDataType;
  action?: HealthDataAction;
  accessGranted?: boolean;
  minUserLevel?: number;
  maxUserLevel?: number;
}

/**
 * 健康データアクセスの監査ログを記録
 *
 * @param entry 監査ログエントリ
 */
export async function logHealthDataAccess(
  entry: HealthDataAuditLogEntry
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: `HEALTH_${entry.dataType.toUpperCase()}_${entry.action}`,
        targetType: 'HealthData',
        targetId: entry.targetDataId || entry.targetStaffId,
        changes: {
          userLevel: entry.userLevel,
          dataType: entry.dataType,
          targetStaffId: entry.targetStaffId,
          consentStatus: entry.consentStatus,
          accessGranted: entry.accessGranted,
          denialReason: entry.denialReason,
          viewedFields: entry.viewedFields,
          changes: entry.changes,
          accessPurpose: entry.accessPurpose,
          sessionId: entry.sessionId,
        },
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        timestamp: entry.timestamp,
      },
    });

    // 重要なアクセス（拒否・削除・エクスポート）は別途アラート
    if (
      !entry.accessGranted ||
      entry.action === 'DATA_DELETE' ||
      entry.action === 'EXPORT'
    ) {
      await createHealthDataAccessAlert(entry);
    }
  } catch (error) {
    console.error('健康データ監査ログ記録エラー:', error);
    // 監査ログ記録失敗は重大なので、エラーを再スローする
    throw new Error('監査ログの記録に失敗しました');
  }
}

/**
 * 健康データアクセス監査ログを検索
 *
 * @param query 検索条件
 * @returns 監査ログエントリのリスト
 */
export async function searchHealthDataAuditLogs(
  query: HealthDataAuditQuery
): Promise<any[]> {
  const where: any = {
    action: {
      startsWith: 'HEALTH_',
    },
  };

  if (query.startDate || query.endDate) {
    where.timestamp = {};
    if (query.startDate) where.timestamp.gte = query.startDate;
    if (query.endDate) where.timestamp.lte = query.endDate;
  }

  if (query.userId) {
    where.userId = query.userId;
  }

  // targetStaffId、dataType、actionなどはchangesフィールド内に格納されているため、
  // 実際のクエリではJSON検索が必要（Prismaの機能に依存）
  // ここでは取得後にフィルタリングする方針

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: 1000, // 最大1000件
  });

  // 後処理フィルタリング
  let filtered = logs;

  if (query.targetStaffId) {
    filtered = filtered.filter(
      (log) => (log.changes as any)?.targetStaffId === query.targetStaffId
    );
  }

  if (query.dataType) {
    filtered = filtered.filter(
      (log) => (log.changes as any)?.dataType === query.dataType
    );
  }

  if (query.accessGranted !== undefined) {
    filtered = filtered.filter(
      (log) => (log.changes as any)?.accessGranted === query.accessGranted
    );
  }

  if (query.minUserLevel !== undefined) {
    filtered = filtered.filter(
      (log) => (log.changes as any)?.userLevel >= query.minUserLevel!
    );
  }

  if (query.maxUserLevel !== undefined) {
    filtered = filtered.filter(
      (log) => (log.changes as any)?.userLevel <= query.maxUserLevel!
    );
  }

  return filtered;
}

/**
 * 特定職員の健康データアクセス履歴を取得
 *
 * @param staffId 職員ID
 * @param limit 取得件数（デフォルト: 50）
 * @returns アクセス履歴
 */
export async function getStaffHealthDataAccessHistory(
  staffId: string,
  limit: number = 50
): Promise<any[]> {
  const logs = await prisma.auditLog.findMany({
    where: {
      action: { startsWith: 'HEALTH_' },
    },
    orderBy: { timestamp: 'desc' },
    take: limit * 10, // 多めに取得してフィルタリング
  });

  // targetStaffIdでフィルタリング
  const filtered = logs.filter(
    (log) => (log.changes as any)?.targetStaffId === staffId
  );

  return filtered.slice(0, limit);
}

/**
 * 健康データアクセスアラートを作成
 * 不正アクセス試行・削除・大量エクスポートなどを検出
 *
 * @param entry 監査ログエントリ
 */
async function createHealthDataAccessAlert(
  entry: HealthDataAuditLogEntry
): Promise<void> {
  let alertLevel: 'info' | 'warning' | 'critical' = 'info';
  let alertMessage = '';

  if (!entry.accessGranted) {
    alertLevel = 'warning';
    alertMessage = `健康データへの不正アクセス試行: ユーザー ${entry.userId} (レベル ${entry.userLevel}) が職員 ${entry.targetStaffId} の ${entry.dataType} にアクセスを試みましたが拒否されました`;
  } else if (entry.action === 'DATA_DELETE') {
    alertLevel = 'critical';
    alertMessage = `健康データ削除: ユーザー ${entry.userId} (レベル ${entry.userLevel}) が職員 ${entry.targetStaffId} の ${entry.dataType} を削除しました`;
  } else if (entry.action === 'EXPORT') {
    alertLevel = 'warning';
    alertMessage = `健康データエクスポート: ユーザー ${entry.userId} (レベル ${entry.userLevel}) が職員 ${entry.targetStaffId} の ${entry.dataType} をエクスポートしました`;
  }

  if (alertMessage) {
    // アラートをデータベースに記録（実際の実装では通知システムと連携）
    await prisma.systemAlert.create({
      data: {
        level: alertLevel,
        category: 'HEALTH_DATA_ACCESS',
        message: alertMessage,
        details: JSON.stringify(entry),
        createdAt: new Date(),
        isRead: false,
      },
    });

    // 重大な場合はメール通知等を実施（実装省略）
    if (alertLevel === 'critical') {
      console.error(`[CRITICAL ALERT] ${alertMessage}`);
    }
  }
}

/**
 * 健康データアクセス統計を取得
 *
 * @param startDate 集計開始日
 * @param endDate 集計終了日
 * @returns アクセス統計
 */
export async function getHealthDataAccessStatistics(
  startDate: Date,
  endDate: Date
): Promise<{
  totalAccess: number;
  accessGranted: number;
  accessDenied: number;
  byDataType: Record<HealthDataType, number>;
  byUserLevel: Record<number, number>;
  byAction: Record<HealthDataAction, number>;
}> {
  const logs = await searchHealthDataAuditLogs({ startDate, endDate });

  const stats = {
    totalAccess: logs.length,
    accessGranted: logs.filter((log) => (log.changes as any)?.accessGranted === true).length,
    accessDenied: logs.filter((log) => (log.changes as any)?.accessGranted === false).length,
    byDataType: {} as Record<HealthDataType, number>,
    byUserLevel: {} as Record<number, number>,
    byAction: {} as Record<HealthDataAction, number>,
  };

  logs.forEach((log) => {
    const changes = log.changes as any;

    // データ種別別
    if (changes?.dataType) {
      stats.byDataType[changes.dataType as HealthDataType] =
        (stats.byDataType[changes.dataType as HealthDataType] || 0) + 1;
    }

    // 権限レベル別
    if (changes?.userLevel) {
      stats.byUserLevel[changes.userLevel] =
        (stats.byUserLevel[changes.userLevel] || 0) + 1;
    }

    // アクション別（ログのactionフィールドからHEALTH_プレフィックスを除去）
    const action = log.action.replace(/^HEALTH_[A-Z_]+_/, '') as HealthDataAction;
    stats.byAction[action] = (stats.byAction[action] || 0) + 1;
  });

  return stats;
}

/**
 * 不審な健康データアクセスパターンを検出
 *
 * - 短時間での大量アクセス
 * - 勤務時間外のアクセス
 * - 複数回の拒否後の成功
 *
 * @param userId ユーザーID
 * @param hoursToCheck 過去何時間をチェックするか（デフォルト: 24時間）
 * @returns 不審なパターンが検出された場合true
 */
export async function detectSuspiciousHealthDataAccess(
  userId: string,
  hoursToCheck: number = 24
): Promise<{
  suspicious: boolean;
  reasons: string[];
  accessCount: number;
}> {
  const checkStartTime = new Date(Date.now() - hoursToCheck * 60 * 60 * 1000);

  const logs = await searchHealthDataAuditLogs({
    userId,
    startDate: checkStartTime,
  });

  const reasons: string[] = [];
  let suspicious = false;

  // 大量アクセスチェック（24時間で50件以上）
  if (logs.length >= 50) {
    reasons.push(`過去${hoursToCheck}時間で${logs.length}件の健康データアクセス（閾値: 50件）`);
    suspicious = true;
  }

  // 連続拒否チェック（5回以上連続で拒否）
  let consecutiveDenials = 0;
  let maxConsecutiveDenials = 0;

  logs.forEach((log) => {
    if ((log.changes as any)?.accessGranted === false) {
      consecutiveDenials++;
      maxConsecutiveDenials = Math.max(maxConsecutiveDenials, consecutiveDenials);
    } else {
      consecutiveDenials = 0;
    }
  });

  if (maxConsecutiveDenials >= 5) {
    reasons.push(`${maxConsecutiveDenials}回連続でアクセス拒否（不正アクセス試行の可能性）`);
    suspicious = true;
  }

  // 勤務時間外アクセスチェック（深夜0時〜6時）
  const nightAccess = logs.filter((log) => {
    const hour = log.timestamp.getHours();
    return hour >= 0 && hour < 6;
  });

  if (nightAccess.length >= 5) {
    reasons.push(`深夜時間帯（0時〜6時）に${nightAccess.length}件のアクセス`);
    suspicious = true;
  }

  return {
    suspicious,
    reasons,
    accessCount: logs.length,
  };
}
