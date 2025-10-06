/**
 * アクセス制御設定
 * 25段階権限レベル（1.0-99.0）による画面・機能制御
 *
 * Phase 1実装：タブ権限はマスターデータベース駆動
 * Phase 2実装予定：ページ・機能権限もマスターデータベース化
 *
 * @deprecated Phase 1完了後、この静的設定はマスターデータベースに移行予定
 */

import {
  canAccessPage as canAccessPageFromDB,
  getAccessiblePaths as getAccessiblePathsFromDB,
} from '@/services/accessControlService'

export interface AccessControlConfig {
  path: string;
  label: string;
  minLevel: number;
  description: string;
}

// ページ・機能ごとの最小権限レベル定義
export const ACCESS_CONTROL_CONFIG: AccessControlConfig[] = [
  // === 一般職員エリア（レベル1-4） ===
  {
    path: '/dashboard',
    label: 'ダッシュボード',
    minLevel: 1,
    description: '基本的な自己情報閲覧'
  },
  {
    path: '/my-evaluation',
    label: '自己評価',
    minLevel: 1,
    description: '自分の評価情報のみ閲覧可'
  },
  {
    path: '/training',
    label: '研修受講',
    minLevel: 1,
    description: '割り当てられた研修の受講'
  },

  // === 副主任・主任エリア（レベル5-6） ===
  {
    path: '/team-management',
    label: 'チーム管理',
    minLevel: 5,
    description: '部署内メンバーの基本情報閲覧'
  },
  {
    path: '/shift-management',
    label: 'シフト管理',
    minLevel: 5,
    description: '勤務表の作成・調整'
  },
  {
    path: '/interview-sheets',
    label: '面談シート作成',
    minLevel: 5,
    description: '部下の面談実施'
  },

  // === 師長・科長エリア（レベル7-8） ===
  {
    path: '/department-evaluation',
    label: '部署評価管理',
    minLevel: 7,
    description: '部署全体の評価実施'
  },
  {
    path: '/staff-cards',
    label: '職員カード管理',
    minLevel: 7,
    description: '部署職員の詳細情報管理'
  },
  {
    path: '/recruitment',
    label: '採用管理',
    minLevel: 8,
    description: '採用プロセス管理'
  },

  // === 部長・医局長エリア（レベル9-10） ===
  {
    path: '/performance-analysis',
    label: 'パフォーマンス分析',
    minLevel: 9,
    description: '全部署の実績分析'
  },
  {
    path: '/budget-management',
    label: '予算管理',
    minLevel: 10,
    description: '部門予算の管理'
  },

  // === 事務長エリア（レベル11） ===
  {
    path: '/facility-operations',
    label: '施設運営管理',
    minLevel: 11,
    description: '施設全体の運営状況'
  },

  // === 経営層エリア（レベル12-18） ===
  {
    path: '/strategic-planning',
    label: '経営戦略',
    minLevel: 12,
    description: '中長期計画策定'
  },
  {
    path: '/financial-reports',
    label: '財務レポート',
    minLevel: 13,
    description: '経営指標・財務分析'
  },
  {
    path: '/hr-policy',
    label: '人事方針策定',
    minLevel: 14,
    description: '人事制度の設計・改定'
  },
  {
    path: '/compliance',
    label: 'コンプライアンス管理',
    minLevel: 15,
    description: 'コンプライアンス体制管理'
  },

  // === 健診担当者専用（レベル97） ===
  {
    path: '/health/management',
    label: '健診管理',
    minLevel: 97,
    description: '健康診断・ストレスチェック管理'
  },
  {
    path: '/health/reexamination',
    label: '再検査管理',
    minLevel: 97,
    description: '再検査対象者の管理'
  },
  {
    path: '/health/reports',
    label: '健診レポート',
    minLevel: 97,
    description: '健診統計・分析レポート'
  },
  {
    path: '/stress-check',
    label: 'ストレスチェック',
    minLevel: 97,
    description: 'ストレスチェック実施・管理'
  },

  // === 産業医専用（レベル98） ===
  {
    path: '/health/occupational-consultation',
    label: '産業医面談',
    minLevel: 98,
    description: '産業医面談記録・管理'
  },
  {
    path: '/health/medical-opinions',
    label: '医学的意見書',
    minLevel: 98,
    description: '就業判定・意見書作成'
  },
  {
    path: '/health/work-restrictions',
    label: '就業制限管理',
    minLevel: 98,
    description: '就業制限・配置転換提案'
  },

  // === システム管理者専用（レベル99/X） ===
  {
    path: '/admin',
    label: '管理者設定',
    minLevel: 99,
    description: 'システム全体の設定・管理'
  },
  {
    path: '/admin/master-data',
    label: 'マスターデータ管理',
    minLevel: 99,
    description: '全マスターデータの編集'
  },
  {
    path: '/admin/user-management',
    label: 'ユーザー管理',
    minLevel: 99,
    description: '全ユーザーの権限設定'
  },
  {
    path: '/admin/system-logs',
    label: 'システムログ',
    minLevel: 99,
    description: '監査ログ・エラーログの閲覧'
  },
  {
    path: '/admin/api-settings',
    label: 'API設定',
    minLevel: 99,
    description: 'VoiceDrive連携等のAPI管理'
  },
  {
    path: '/admin/backup',
    label: 'バックアップ管理',
    minLevel: 99,
    description: 'データバックアップ・リストア'
  }
];

// 権限レベルによるアクセス可否判定
export async function canAccessPath(
  userLevel: number,
  path: string
): Promise<boolean> {
  // システム管理者（レベル99）は全てアクセス可能
  if (userLevel === 99) return true;

  // Phase 1: まずマスターデータベースをチェック（タブ・ページ権限）
  try {
    const hasAccess = await canAccessPageFromDB(userLevel, path)
    if (hasAccess !== undefined) {
      return hasAccess
    }
  } catch (error) {
    console.warn('マスターデータベースからの権限チェックに失敗。フォールバック中:', error)
  }

  // フォールバック: 静的設定をチェック
  const config = ACCESS_CONTROL_CONFIG.find(c => c.path === path);
  if (!config) return false;

  return userLevel >= config.minLevel;
}

// 同期版（後方互換性のため）
export function canAccessPathSync(
  userLevel: number,
  path: string
): boolean {
  // システム管理者（レベル99）は全てアクセス可能
  if (userLevel === 99) return true;

  const config = ACCESS_CONTROL_CONFIG.find(c => c.path === path);
  if (!config) return false;

  return userLevel >= config.minLevel;
}

// ユーザーがアクセス可能なパスのリストを取得（非同期版）
export async function getAccessiblePaths(userLevel: number): Promise<string[]> {
  if (userLevel === 99) {
    // システム管理者は全てアクセス可能
    return ACCESS_CONTROL_CONFIG.map(c => c.path);
  }

  // Phase 1: マスターデータベースから取得を試みる
  try {
    const pathsFromDB = await getAccessiblePathsFromDB(userLevel)
    if (pathsFromDB && pathsFromDB.length > 0) {
      // マスターDBの結果と静的設定をマージ
      const staticPaths = ACCESS_CONTROL_CONFIG
        .filter(c => userLevel >= c.minLevel)
        .map(c => c.path)

      return Array.from(new Set([...pathsFromDB, ...staticPaths]))
    }
  } catch (error) {
    console.warn('マスターデータベースからのパス取得に失敗。フォールバック中:', error)
  }

  // フォールバック: 静的設定のみ
  return ACCESS_CONTROL_CONFIG
    .filter(c => userLevel >= c.minLevel)
    .map(c => c.path);
}

// 同期版（後方互換性のため）
export function getAccessiblePathsSync(userLevel: number): string[] {
  if (userLevel === 99) {
    return ACCESS_CONTROL_CONFIG.map(c => c.path);
  }

  return ACCESS_CONTROL_CONFIG
    .filter(c => userLevel >= c.minLevel)
    .map(c => c.path);
}

// レベル別のメニュー表示制御（同期版）
export function getVisibleMenuItems(userLevel: number): AccessControlConfig[] {
  if (userLevel === 99) {
    return ACCESS_CONTROL_CONFIG;
  }

  return ACCESS_CONTROL_CONFIG.filter(c => userLevel >= c.minLevel);
}

// レベル別のメニュー表示制御（非同期版）
export async function getVisibleMenuItemsAsync(userLevel: number): Promise<AccessControlConfig[]> {
  const paths = await getAccessiblePaths(userLevel)
  return ACCESS_CONTROL_CONFIG.filter(c => paths.includes(c.path))
}

// 特別な権限チェック
export const SPECIAL_PERMISSIONS = {
  // データ編集権限
  CAN_EDIT_SALARY: 11,           // 給与編集（事務長以上）
  CAN_EDIT_EVALUATION: 7,        // 評価編集（副師長以上）
  CAN_VIEW_ALL_PERSONAL_INFO: 8, // 全個人情報閲覧（師長以上）
  CAN_DELETE_RECORDS: 99,        // レコード削除（システム管理者のみ）

  // 承認権限
  CAN_APPROVE_LEAVE: 5,          // 休暇承認（副主任以上）
  CAN_APPROVE_OVERTIME: 6,       // 残業承認（主任以上）
  CAN_APPROVE_BUDGET: 10,        // 予算承認（部長以上）

  // システム権限
  CAN_EXPORT_DATA: 8,            // データエクスポート（師長以上）
  CAN_IMPORT_DATA: 99,           // データインポート（システム管理者のみ）
  CAN_MODIFY_SETTINGS: 99,       // 設定変更（システム管理者のみ）
};

// 特定の操作が可能かチェック
export function hasPermission(
  userLevel: number,
  permission: keyof typeof SPECIAL_PERMISSIONS
): boolean {
  const requiredLevel = SPECIAL_PERMISSIONS[permission];
  return userLevel >= requiredLevel;
}

// 特別権限レベル（健康管理専用）の詳細設定
export const SPECIAL_HEALTH_PERMISSIONS = {
  // Level 97: 健診担当者
  HEALTH_CHECKUP_STAFF: {
    level: 97,
    allowedPaths: [
      '/health/management',
      '/health/staff/:staffId',
      '/stress-check',
      '/health/reexamination',
      '/health/reports',
    ],
    allowedDataAccess: [
      'healthCheckup',
      'stressCheck',
      'reexamination',
      'basicStaffInfo',  // 氏名・部署のみ
    ],
    deniedDataAccess: [
      'salary',
      'evaluation',
      'interview',
      'disciplinary',
      'masterData',
    ]
  },

  // Level 98: 産業医
  OCCUPATIONAL_PHYSICIAN: {
    level: 98,
    allowedPaths: [
      '/health/management',
      '/health/staff/:staffId',
      '/stress-check',
      '/health/occupational-consultation',
      '/health/medical-opinions',
      '/health/work-restrictions',
    ],
    allowedDataAccess: [
      'healthCheckup',
      'stressCheck',
      'occupationalConsultation',
      'workRestrictions',
      'basicStaffInfo',
      'workHistory',      // 健康評価用
      'absenceRecords',   // 健康評価用
    ],
    deniedDataAccess: [
      'salary',
      'evaluation',
      'interview',  // 産業医面談除く
      'disciplinary',
      'masterData',
    ]
  },

  // Level 99: システム管理者
  SYSTEM_ADMIN: {
    level: 99,
    allowedPaths: ['*'],  // 全て許可
    allowedDataAccess: ['*'],
    deniedDataAccess: []
  }
};

// 特別権限チェック関数
export function hasSpecialHealthPermission(
  userLevel: number,
  dataType: string
): boolean {
  if (userLevel === 99) return true;

  if (userLevel === 98) {
    const permissions = SPECIAL_HEALTH_PERMISSIONS.OCCUPATIONAL_PHYSICIAN;
    return permissions.allowedDataAccess.includes(dataType) ||
           permissions.allowedDataAccess.includes('*');
  }

  if (userLevel === 97) {
    const permissions = SPECIAL_HEALTH_PERMISSIONS.HEALTH_CHECKUP_STAFF;
    return permissions.allowedDataAccess.includes(dataType) ||
           permissions.allowedDataAccess.includes('*');
  }

  return false;
}

// 特別権限レベルかどうかの判定
export function isSpecialHealthLevel(userLevel: number): boolean {
  return userLevel === 97 || userLevel === 98 || userLevel === 99;
}