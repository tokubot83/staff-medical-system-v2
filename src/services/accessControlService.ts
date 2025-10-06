/**
 * アクセス制御サービス
 * タブ・ページ・機能の権限管理（マスターデータベース駆動）
 *
 * Level 99（システム管理者）の機能：
 * - 全リソースへのフルアクセス
 * - 権限設定の動的変更
 * - VSCode/API経由でのプログラマティックアクセス
 *
 * モード切り替え：
 * - 環境変数 USE_MOCK_ACCESS_CONTROL=true でモックモード（DB構築前）
 * - 環境変数 USE_MOCK_ACCESS_CONTROL=false で本番モード（DB構築後）
 */

import { query, queryOne, insert, update, transaction } from '@/lib/database/db';
import {
  MOCK_ACCESS_CONTROL_CONFIGS,
  MOCK_CHANGE_LOG,
} from './accessControlService.mock';

// ================================================================================
// 型定義
// ================================================================================

export interface AccessControlConfig {
  id: number;
  resourceType: 'tab' | 'page' | 'feature' | 'data';
  resourceId: string;
  resourceName: string;
  category: string | null;
  minLevel: number;
  specialAuthority: boolean;
  requiresAssignment: boolean;
  description: string | null;
  isActive: boolean;
  isSystemProtected: boolean;
  displayOrder: number;
  recommendedMinLevel: number | null;
  recommendedReason: string | null;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface AccessControlChangeLog {
  id: number;
  masterRecordId: number;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changeReason: string;
  isDeviationFromRecommended: boolean;
  changedAt: Date;
  changedBy: string;
  changedByName: string | null;
  changedByLevel: number | null;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface UpdateAccessControlParams {
  resourceId: string;
  minLevel?: number;
  specialAuthority?: boolean;
  requiresAssignment?: boolean;
  description?: string;
  isActive?: boolean;
  changeReason: string;
  changedBy: string;
  changedByName?: string;
  changedByLevel?: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface DeviationCheck {
  hasDeviation: boolean;
  message?: string;
  reason?: string;
  recommendedLevel?: number;
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
// キャッシュ管理
// ================================================================================

let _cache: Map<string, AccessControlConfig> | null = null;
let _cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5分

/**
 * キャッシュをクリア
 */
export function clearCache(): void {
  _cache = null;
  _cacheTimestamp = 0;
}

/**
 * キャッシュが有効かチェック
 */
function isCacheValid(): boolean {
  if (!_cache) return false;
  return Date.now() - _cacheTimestamp < CACHE_TTL;
}

// ================================================================================
// アクセス制御設定の取得
// ================================================================================

/**
 * 全アクセス制御設定を取得（キャッシュ付き）
 */
export async function getAccessControlConfigs(): Promise<Map<string, AccessControlConfig>> {
  // モックモードの場合
  if (isUsingMockData()) {
    if (isCacheValid() && _cache) {
      return _cache;
    }
    _cache = new Map(
      MOCK_ACCESS_CONTROL_CONFIGS
        .filter(c => c.isActive)
        .map(c => [c.resourceId, c])
    );
    _cacheTimestamp = Date.now();
    return _cache;
  }

  // 本番モード（データベースから取得）
  if (isCacheValid() && _cache) {
    return _cache;
  }

  try {
    const configs = await query<AccessControlConfig>(`
      SELECT * FROM access_control_master
      WHERE is_active = TRUE
      ORDER BY display_order, resource_id
    `);

    _cache = new Map(configs.map(c => [c.resourceId, c]));
    _cacheTimestamp = Date.now();

    return _cache;
  } catch (error) {
    console.warn('データベース接続エラー。モックデータにフォールバックします。', error);
    // DB接続エラー時はモックデータにフォールバック
    _cache = new Map(
      MOCK_ACCESS_CONTROL_CONFIGS
        .filter(c => c.isActive)
        .map(c => [c.resourceId, c])
    );
    _cacheTimestamp = Date.now();
    return _cache;
  }
}

/**
 * 特定のリソース設定を取得
 */
export async function getAccessControlConfig(
  resourceId: string
): Promise<AccessControlConfig | null> {
  const configs = await getAccessControlConfigs();
  return configs.get(resourceId) || null;
}

/**
 * リソースタイプ別に設定を取得
 */
export async function getAccessControlConfigsByType(
  resourceType: 'tab' | 'page' | 'feature' | 'data'
): Promise<AccessControlConfig[]> {
  const configs = await getAccessControlConfigs();
  return Array.from(configs.values()).filter(c => c.resourceType === resourceType);
}

/**
 * カテゴリ別に設定を取得
 */
export async function getAccessControlConfigsByCategory(
  category: string
): Promise<AccessControlConfig[]> {
  const configs = await getAccessControlConfigs();
  return Array.from(configs.values()).filter(c => c.category === category);
}

// ================================================================================
// アクセス権限チェック
// ================================================================================

/**
 * タブへのアクセス可否判定
 */
export async function canAccessTab(
  userLevel: number,
  tabId: string,
  options?: {
    userId?: string;
    targetStaffId?: string;
  }
): Promise<boolean> {
  // システム管理者（Level 99）は全アクセス可能
  if (userLevel === 99) return true;

  const config = await getAccessControlConfig(tabId);
  if (!config) return false;

  // 特別権限チェック（健診担当者・産業医専用）
  if (config.specialAuthority) {
    return userLevel === 97 || userLevel === 98;
  }

  // 基本的なレベルチェック
  if (userLevel < config.minLevel) return false;

  // 担当者割り当てチェック（将来実装）
  if (config.requiresAssignment && options?.userId && options?.targetStaffId) {
    // TODO: 面談担当者テーブルをチェック
    // return await isAssignedInterviewer(options.userId, options.targetStaffId);
  }

  return true;
}

/**
 * ページへのアクセス可否判定
 */
export async function canAccessPage(
  userLevel: number,
  pagePath: string
): Promise<boolean> {
  if (userLevel === 99) return true;

  const config = await getAccessControlConfig(pagePath);
  if (!config) return false;

  if (config.specialAuthority) {
    return userLevel === 97 || userLevel === 98;
  }

  return userLevel >= config.minLevel;
}

/**
 * ユーザーがアクセス可能なタブIDリストを取得
 */
export async function getAccessibleTabIds(userLevel: number): Promise<string[]> {
  const configs = await getAccessControlConfigsByType('tab');

  if (userLevel === 99) {
    return configs.map(c => c.resourceId);
  }

  return configs
    .filter(c => {
      if (c.specialAuthority) {
        return userLevel === 97 || userLevel === 98;
      }
      return userLevel >= c.minLevel;
    })
    .map(c => c.resourceId);
}

/**
 * ユーザーがアクセス可能なタブ設定リストを取得
 */
export async function getAccessibleTabs(userLevel: number): Promise<AccessControlConfig[]> {
  const configs = await getAccessControlConfigsByType('tab');

  if (userLevel === 99) {
    return configs;
  }

  return configs.filter(c => {
    if (c.specialAuthority) {
      return userLevel === 97 || userLevel === 98;
    }
    return userLevel >= c.minLevel;
  });
}

// ================================================================================
// アクセス制御設定の更新（Level 99のみ）
// ================================================================================

/**
 * 推奨設定からの逸脱チェック
 */
function checkDeviationFromRecommended(
  config: AccessControlConfig,
  newMinLevel: number
): DeviationCheck {
  if (!config.recommendedMinLevel) {
    return { hasDeviation: false };
  }

  if (newMinLevel < config.recommendedMinLevel) {
    return {
      hasDeviation: true,
      message: `推奨レベル ${config.recommendedMinLevel} より低い設定です`,
      reason: config.recommendedReason || undefined,
      recommendedLevel: config.recommendedMinLevel,
    };
  }

  return { hasDeviation: false };
}

/**
 * アクセス制御設定を更新（Level 99のみ）
 */
export async function updateAccessControl(
  params: UpdateAccessControlParams
): Promise<void> {
  // モックモードの場合は警告のみ
  if (isUsingMockData()) {
    console.warn('⚠️  モックモードのため、設定変更は永続化されません。');
    console.warn('⚠️  DB構築後は環境変数 USE_MOCK_ACCESS_CONTROL=false に設定してください。');
    // モックデータを更新（メモリ内のみ）
    const config = MOCK_ACCESS_CONTROL_CONFIGS.find(c => c.resourceId === params.resourceId);
    if (config) {
      if (params.minLevel !== undefined) config.minLevel = params.minLevel;
      if (params.specialAuthority !== undefined) config.specialAuthority = params.specialAuthority;
      if (params.requiresAssignment !== undefined) config.requiresAssignment = params.requiresAssignment;
      if (params.description !== undefined) config.description = params.description;
      if (params.isActive !== undefined) config.isActive = params.isActive;
      config.updatedBy = params.changedBy;
      config.updatedAt = new Date();
      clearCache();
    }
    return;
  }

  // 現在の設定を取得
  const currentConfig = await queryOne<AccessControlConfig>(
    `SELECT * FROM access_control_master WHERE resource_id = ?`,
    [params.resourceId]
  );

  if (!currentConfig) {
    throw new Error(`リソース ${params.resourceId} が見つかりません`);
  }

  // トランザクション内で更新と履歴記録を実行
  await transaction(async (connection) => {
    // 変更内容を記録
    const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];

    if (params.minLevel !== undefined && params.minLevel !== currentConfig.minLevel) {
      changes.push({
        field: 'min_level',
        oldValue: currentConfig.minLevel,
        newValue: params.minLevel,
      });
    }

    if (params.specialAuthority !== undefined && params.specialAuthority !== currentConfig.specialAuthority) {
      changes.push({
        field: 'special_authority',
        oldValue: currentConfig.specialAuthority,
        newValue: params.specialAuthority,
      });
    }

    if (params.requiresAssignment !== undefined && params.requiresAssignment !== currentConfig.requiresAssignment) {
      changes.push({
        field: 'requires_assignment',
        oldValue: currentConfig.requiresAssignment,
        newValue: params.requiresAssignment,
      });
    }

    if (params.description !== undefined && params.description !== currentConfig.description) {
      changes.push({
        field: 'description',
        oldValue: currentConfig.description,
        newValue: params.description,
      });
    }

    if (params.isActive !== undefined && params.isActive !== currentConfig.isActive) {
      changes.push({
        field: 'is_active',
        oldValue: currentConfig.isActive,
        newValue: params.isActive,
      });
    }

    // 変更がない場合は何もしない
    if (changes.length === 0) {
      return;
    }

    // 推奨設定からの逸脱チェック
    const deviation = params.minLevel !== undefined
      ? checkDeviationFromRecommended(currentConfig, params.minLevel)
      : { hasDeviation: false };

    // 設定を更新
    const updateData: Record<string, any> = {
      updated_at: new Date(),
      updated_by: params.changedBy,
    };

    if (params.minLevel !== undefined) updateData.min_level = params.minLevel;
    if (params.specialAuthority !== undefined) updateData.special_authority = params.specialAuthority;
    if (params.requiresAssignment !== undefined) updateData.requires_assignment = params.requiresAssignment;
    if (params.description !== undefined) updateData.description = params.description;
    if (params.isActive !== undefined) updateData.is_active = params.isActive;

    const setClause = Object.keys(updateData).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updateData), params.resourceId];

    await connection.query(
      `UPDATE access_control_master SET ${setClause} WHERE resource_id = ?`,
      values
    );

    // 変更履歴を記録
    for (const change of changes) {
      await connection.query(
        `INSERT INTO access_control_change_log (
          master_record_id, resource_type, resource_id, resource_name,
          field_name, old_value, new_value, change_reason,
          is_deviation_from_recommended,
          changed_by, changed_by_name, changed_by_level,
          ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          currentConfig.id,
          currentConfig.resourceType,
          currentConfig.resourceId,
          currentConfig.resourceName,
          change.field,
          String(change.oldValue),
          String(change.newValue),
          params.changeReason,
          deviation.hasDeviation,
          params.changedBy,
          params.changedByName || null,
          params.changedByLevel || null,
          params.ipAddress || null,
          params.userAgent || null,
        ]
      );
    }
  });

  // キャッシュをクリア
  clearCache();
}

// ================================================================================
// 変更履歴の取得
// ================================================================================

/**
 * 変更履歴を取得
 */
export async function getChangeLog(
  options?: {
    resourceId?: string;
    limit?: number;
    offset?: number;
  }
): Promise<AccessControlChangeLog[]> {
  // モックモードの場合
  if (isUsingMockData()) {
    let logs = [...MOCK_CHANGE_LOG];

    if (options?.resourceId) {
      logs = logs.filter(l => l.resourceId === options.resourceId);
    }

    logs.sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());

    if (options?.limit) {
      const offset = options.offset || 0;
      logs = logs.slice(offset, offset + options.limit);
    }

    return logs;
  }

  // 本番モード
  try {
    let sql = `
      SELECT * FROM access_control_change_log
    `;

    const params: any[] = [];

    if (options?.resourceId) {
      sql += ` WHERE resource_id = ?`;
      params.push(options.resourceId);
    }

    sql += ` ORDER BY changed_at DESC`;

    if (options?.limit) {
      sql += ` LIMIT ?`;
      params.push(options.limit);

      if (options?.offset) {
        sql += ` OFFSET ?`;
        params.push(options.offset);
      }
    }

    return await query<AccessControlChangeLog>(sql, params);
  } catch (error) {
    console.warn('データベース接続エラー。モックデータにフォールバックします。', error);
    return MOCK_CHANGE_LOG;
  }
}

/**
 * 特定リソースの変更履歴を取得
 */
export async function getChangeLogByResource(
  resourceId: string,
  limit: number = 50
): Promise<AccessControlChangeLog[]> {
  return await getChangeLog({ resourceId, limit });
}

/**
 * 最近の変更履歴を取得
 */
export async function getRecentChanges(limit: number = 100): Promise<AccessControlChangeLog[]> {
  return await getChangeLog({ limit });
}
