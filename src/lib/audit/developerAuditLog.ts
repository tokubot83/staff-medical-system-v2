/**
 * 開発者監査ログサービス
 * Level 99/100の開発操作を完全記録
 *
 * Phase 1（現在）: Level 99 = スーパーユーザー（運用権 + 開発権）
 * Phase 2（将来）: Level 100（開発権）、Level 99（運用権のみ）
 */

import { query, queryOne, insert, transaction } from '@/lib/database/db';

// ================================================================================
// 型定義
// ================================================================================

export type OperationType =
  | 'code_deployment'
  | 'database_schema_change'
  | 'git_commit'
  | 'git_push'
  | 'git_merge'
  | 'package_update'
  | 'config_change'
  | 'migration_execution'
  | 'api_key_generation'
  | 'permission_change'
  | 'system_restart'
  | 'backup_creation'
  | 'rollback'
  | 'other';

export type OperationCategory =
  | 'development'
  | 'maintenance'
  | 'emergency'
  | 'security'
  | 'routine';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ExecutionStatus = 'success' | 'partial_success' | 'failed' | 'rolled_back';

export type ExecutionMethod = 'vscode' | 'cli' | 'ui' | 'api' | 'automated';

export type Environment = 'development' | 'staging' | 'production';

export interface DeveloperAuditLog {
  id: number;
  operatorId: string;
  operatorName: string | null;
  operatorLevel: number;
  operatorEmail: string | null;
  operationType: OperationType;
  operationCategory: OperationCategory;
  operationSummary: string;
  operationReason: string;
  affectedResources: string | null;
  gitCommitHash: string | null;
  gitBranch: string | null;
  gitAuthor: string | null;
  gitCommitMessage: string | null;
  filesChanged: string | null;
  linesAdded: number | null;
  linesDeleted: number | null;
  dbMigrationFile: string | null;
  dbTablesAffected: string | null;
  requiresApproval: boolean;
  approvedBy: string | null;
  approvedAt: Date | null;
  approvalComment: string | null;
  riskLevel: RiskLevel;
  isReversible: boolean;
  rollbackPlan: string | null;
  environment: Environment;
  executionMethod: ExecutionMethod;
  ipAddress: string | null;
  userAgent: string | null;
  sessionId: string | null;
  executionStatus: ExecutionStatus;
  errorMessage: string | null;
  executionDurationMs: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDeveloperAuditLogParams {
  operatorId: string;
  operatorName?: string;
  operatorLevel: number;
  operatorEmail?: string;
  operationType: OperationType;
  operationCategory?: OperationCategory;
  operationSummary: string;
  operationReason: string;
  affectedResources?: string[];
  gitCommitHash?: string;
  gitBranch?: string;
  gitAuthor?: string;
  gitCommitMessage?: string;
  filesChanged?: string[];
  linesAdded?: number;
  linesDeleted?: number;
  dbMigrationFile?: string;
  dbTablesAffected?: string[];
  riskLevel?: RiskLevel;
  isReversible?: boolean;
  rollbackPlan?: string;
  environment?: Environment;
  executionMethod: ExecutionMethod;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  executionStatus?: ExecutionStatus;
  errorMessage?: string;
  executionDurationMs?: number;
}

export interface DeveloperAuditSummary {
  operatorId: string;
  operatorName: string | null;
  operatorLevel: number;
  operationType: OperationType;
  operationCategory: OperationCategory;
  operationCount: number;
  successCount: number;
  failedCount: number;
  criticalOperations: number;
  highRiskOperations: number;
  lastOperationAt: Date;
  avgExecutionMs: number | null;
}

// ================================================================================
// モード管理
// ================================================================================

/**
 * モックモードかどうかを判定
 */
function isUsingMockData(): boolean {
  return process.env.USE_MOCK_ACCESS_CONTROL === 'true';
}

// ================================================================================
// 監査ログ記録
// ================================================================================

/**
 * 開発者操作を記録
 */
export async function logDeveloperOperation(
  params: CreateDeveloperAuditLogParams
): Promise<number> {
  // バリデーション
  if (params.operatorLevel !== 99 && params.operatorLevel !== 100) {
    throw new Error('開発者監査ログはLevel 99または100のみが対象です');
  }

  if (!params.operationSummary || params.operationSummary.trim().length === 0) {
    throw new Error('操作概要は必須です');
  }

  if (!params.operationReason || params.operationReason.trim().length < 10) {
    throw new Error('操作理由は10文字以上で入力してください');
  }

  // モックモードの場合は警告のみ
  if (isUsingMockData()) {
    console.warn('⚠️  モックモードのため、監査ログは永続化されません。');
    console.warn(`📝 [AUDIT] ${params.operationType}: ${params.operationSummary}`);
    return 0;
  }

  // データベースに記録
  try {
    const data: Record<string, any> = {
      operator_id: params.operatorId,
      operator_name: params.operatorName || null,
      operator_level: params.operatorLevel,
      operator_email: params.operatorEmail || null,
      operation_type: params.operationType,
      operation_category: params.operationCategory || 'development',
      operation_summary: params.operationSummary,
      operation_reason: params.operationReason,
      affected_resources: params.affectedResources ? JSON.stringify(params.affectedResources) : null,
      git_commit_hash: params.gitCommitHash || null,
      git_branch: params.gitBranch || null,
      git_author: params.gitAuthor || null,
      git_commit_message: params.gitCommitMessage || null,
      files_changed: params.filesChanged ? JSON.stringify(params.filesChanged) : null,
      lines_added: params.linesAdded || null,
      lines_deleted: params.linesDeleted || null,
      db_migration_file: params.dbMigrationFile || null,
      db_tables_affected: params.dbTablesAffected ? JSON.stringify(params.dbTablesAffected) : null,
      requires_approval: false, // Phase 1では常にfalse
      risk_level: params.riskLevel || 'medium',
      is_reversible: params.isReversible !== undefined ? params.isReversible : true,
      rollback_plan: params.rollbackPlan || null,
      environment: params.environment || 'production',
      execution_method: params.executionMethod,
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
      session_id: params.sessionId || null,
      execution_status: params.executionStatus || 'success',
      error_message: params.errorMessage || null,
      execution_duration_ms: params.executionDurationMs || null,
    };

    const logId = await insert('developer_audit_log', data);

    // 高リスク操作の場合は警告を出力
    if (params.riskLevel === 'critical' || params.riskLevel === 'high') {
      console.warn(`⚠️  高リスク操作を記録しました [ID: ${logId}]: ${params.operationSummary}`);
    }

    return logId;
  } catch (error) {
    console.error('開発者監査ログの記録に失敗しました:', error);
    throw error;
  }
}

/**
 * Gitコミット操作を記録
 */
export async function logGitCommit(params: {
  operatorId: string;
  operatorName?: string;
  operatorLevel: number;
  commitHash: string;
  branch: string;
  author: string;
  commitMessage: string;
  filesChanged: string[];
  linesAdded: number;
  linesDeleted: number;
  reason: string;
  executionMethod?: ExecutionMethod;
}): Promise<number> {
  return await logDeveloperOperation({
    operatorId: params.operatorId,
    operatorName: params.operatorName,
    operatorLevel: params.operatorLevel,
    operationType: 'git_commit',
    operationCategory: 'development',
    operationSummary: `Git commit: ${params.commitMessage.split('\n')[0].substring(0, 100)}`,
    operationReason: params.reason,
    gitCommitHash: params.commitHash,
    gitBranch: params.branch,
    gitAuthor: params.author,
    gitCommitMessage: params.commitMessage,
    filesChanged: params.filesChanged,
    linesAdded: params.linesAdded,
    linesDeleted: params.linesDeleted,
    riskLevel: 'low',
    executionMethod: params.executionMethod || 'vscode',
    environment: 'production',
  });
}

/**
 * Gitプッシュ操作を記録
 */
export async function logGitPush(params: {
  operatorId: string;
  operatorName?: string;
  operatorLevel: number;
  branch: string;
  commitCount: number;
  reason: string;
  executionMethod?: ExecutionMethod;
}): Promise<number> {
  return await logDeveloperOperation({
    operatorId: params.operatorId,
    operatorName: params.operatorName,
    operatorLevel: params.operatorLevel,
    operationType: 'git_push',
    operationCategory: 'development',
    operationSummary: `Git push to ${params.branch}: ${params.commitCount} commit(s)`,
    operationReason: params.reason,
    gitBranch: params.branch,
    affectedResources: [params.branch],
    riskLevel: params.branch === 'main' ? 'high' : 'medium',
    executionMethod: params.executionMethod || 'vscode',
    environment: 'production',
  });
}

/**
 * データベーススキーマ変更を記録
 */
export async function logDatabaseSchemaChange(params: {
  operatorId: string;
  operatorName?: string;
  operatorLevel: number;
  migrationFile: string;
  tablesAffected: string[];
  summary: string;
  reason: string;
  isReversible?: boolean;
  rollbackPlan?: string;
  executionMethod?: ExecutionMethod;
}): Promise<number> {
  return await logDeveloperOperation({
    operatorId: params.operatorId,
    operatorName: params.operatorName,
    operatorLevel: params.operatorLevel,
    operationType: 'database_schema_change',
    operationCategory: 'development',
    operationSummary: params.summary,
    operationReason: params.reason,
    dbMigrationFile: params.migrationFile,
    dbTablesAffected: params.tablesAffected,
    affectedResources: params.tablesAffected,
    riskLevel: 'high',
    isReversible: params.isReversible !== undefined ? params.isReversible : true,
    rollbackPlan: params.rollbackPlan || null,
    executionMethod: params.executionMethod || 'cli',
    environment: 'production',
  });
}

/**
 * 権限変更操作を記録（access_control経由）
 */
export async function logPermissionChange(params: {
  operatorId: string;
  operatorName?: string;
  operatorLevel: number;
  resourceId: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  reason: string;
  executionMethod?: ExecutionMethod;
}): Promise<number> {
  return await logDeveloperOperation({
    operatorId: params.operatorId,
    operatorName: params.operatorName,
    operatorLevel: params.operatorLevel,
    operationType: 'permission_change',
    operationCategory: 'security',
    operationSummary: `権限変更: ${params.resourceId} (${params.fieldChanged}: ${params.oldValue} → ${params.newValue})`,
    operationReason: params.reason,
    affectedResources: [params.resourceId],
    riskLevel: 'high',
    isReversible: true,
    executionMethod: params.executionMethod || 'ui',
    environment: 'production',
  });
}

// ================================================================================
// 監査ログ取得
// ================================================================================

/**
 * 監査ログを取得
 */
export async function getDeveloperAuditLogs(options?: {
  operatorId?: string;
  operationType?: OperationType;
  operationCategory?: OperationCategory;
  riskLevel?: RiskLevel;
  executionStatus?: ExecutionStatus;
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<DeveloperAuditLog[]> {
  // モックモードの場合は空配列を返す
  if (isUsingMockData()) {
    console.warn('⚠️  モックモードのため、監査ログは取得できません。');
    return [];
  }

  try {
    let sql = `SELECT * FROM developer_audit_log WHERE 1=1`;
    const params: any[] = [];

    if (options?.operatorId) {
      sql += ` AND operator_id = ?`;
      params.push(options.operatorId);
    }

    if (options?.operationType) {
      sql += ` AND operation_type = ?`;
      params.push(options.operationType);
    }

    if (options?.operationCategory) {
      sql += ` AND operation_category = ?`;
      params.push(options.operationCategory);
    }

    if (options?.riskLevel) {
      sql += ` AND risk_level = ?`;
      params.push(options.riskLevel);
    }

    if (options?.executionStatus) {
      sql += ` AND execution_status = ?`;
      params.push(options.executionStatus);
    }

    if (options?.startDate) {
      sql += ` AND created_at >= ?`;
      params.push(options.startDate);
    }

    if (options?.endDate) {
      sql += ` AND created_at <= ?`;
      params.push(options.endDate);
    }

    sql += ` ORDER BY created_at DESC`;

    if (options?.limit) {
      sql += ` LIMIT ?`;
      params.push(options.limit);

      if (options?.offset) {
        sql += ` OFFSET ?`;
        params.push(options.offset);
      }
    }

    return await query<DeveloperAuditLog>(sql, params);
  } catch (error) {
    console.error('監査ログの取得に失敗しました:', error);
    return [];
  }
}

/**
 * 特定操作者の監査ログを取得
 */
export async function getAuditLogsByOperator(
  operatorId: string,
  limit: number = 100
): Promise<DeveloperAuditLog[]> {
  return await getDeveloperAuditLogs({ operatorId, limit });
}

/**
 * 重要操作（高リスク・失敗）の監査ログを取得
 */
export async function getCriticalOperations(limit: number = 100): Promise<DeveloperAuditLog[]> {
  if (isUsingMockData()) {
    return [];
  }

  try {
    const sql = `
      SELECT * FROM recent_critical_operations
      LIMIT ?
    `;
    return await query<DeveloperAuditLog>(sql, [limit]);
  } catch (error) {
    console.error('重要操作の取得に失敗しました:', error);
    return [];
  }
}

/**
 * 操作サマリーを取得
 */
export async function getDeveloperAuditSummary(options?: {
  operatorId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<DeveloperAuditSummary[]> {
  if (isUsingMockData()) {
    return [];
  }

  try {
    let sql = `SELECT * FROM developer_audit_summary WHERE 1=1`;
    const params: any[] = [];

    if (options?.operatorId) {
      sql += ` AND operator_id = ?`;
      params.push(options.operatorId);
    }

    sql += ` ORDER BY last_operation_at DESC`;

    return await query<DeveloperAuditSummary>(sql, params);
  } catch (error) {
    console.error('操作サマリーの取得に失敗しました:', error);
    return [];
  }
}

// ================================================================================
// ユーティリティ
// ================================================================================

/**
 * リスクレベルを自動判定
 */
export function determineRiskLevel(params: {
  operationType: OperationType;
  affectedResources?: string[];
  isProduction?: boolean;
}): RiskLevel {
  const { operationType, affectedResources, isProduction = true } = params;

  // 本番環境でない場合はリスクを1段階下げる
  const adjustRisk = (level: RiskLevel): RiskLevel => {
    if (!isProduction) {
      if (level === 'critical') return 'high';
      if (level === 'high') return 'medium';
      if (level === 'medium') return 'low';
    }
    return level;
  };

  switch (operationType) {
    case 'database_schema_change':
    case 'permission_change':
    case 'system_restart':
      return adjustRisk('high');

    case 'git_push':
      // mainブランチへのプッシュは高リスク
      if (affectedResources?.some(r => r === 'main' || r === 'master')) {
        return adjustRisk('high');
      }
      return adjustRisk('medium');

    case 'migration_execution':
    case 'rollback':
      return adjustRisk('high');

    case 'api_key_generation':
      return adjustRisk('medium');

    case 'git_commit':
    case 'config_change':
    case 'package_update':
      return adjustRisk('low');

    default:
      return adjustRisk('medium');
  }
}

/**
 * 操作タイプの日本語名を取得
 */
export function getOperationTypeLabel(type: OperationType): string {
  const labels: Record<OperationType, string> = {
    code_deployment: 'コードデプロイメント',
    database_schema_change: 'DBスキーマ変更',
    git_commit: 'Gitコミット',
    git_push: 'Gitプッシュ',
    git_merge: 'Gitマージ',
    package_update: 'パッケージ更新',
    config_change: '設定ファイル変更',
    migration_execution: 'マイグレーション実行',
    api_key_generation: 'APIキー生成',
    permission_change: '権限変更',
    system_restart: 'システム再起動',
    backup_creation: 'バックアップ作成',
    rollback: 'ロールバック',
    other: 'その他',
  };
  return labels[type] || type;
}
