/**
 * アクセス制御設定
 * 18段階権限レベル + システム管理者(X)による画面・機能制御
 */

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
export function canAccessPath(
  userLevel: number,
  path: string
): boolean {
  const config = ACCESS_CONTROL_CONFIG.find(c => c.path === path);
  if (!config) return false;

  // システム管理者（レベル99）は全てアクセス可能
  if (userLevel === 99) return true;

  return userLevel >= config.minLevel;
}

// ユーザーがアクセス可能なパスのリストを取得
export function getAccessiblePaths(userLevel: number): string[] {
  if (userLevel === 99) {
    // システム管理者は全てアクセス可能
    return ACCESS_CONTROL_CONFIG.map(c => c.path);
  }

  return ACCESS_CONTROL_CONFIG
    .filter(c => userLevel >= c.minLevel)
    .map(c => c.path);
}

// レベル別のメニュー表示制御
export function getVisibleMenuItems(userLevel: number): AccessControlConfig[] {
  if (userLevel === 99) {
    return ACCESS_CONTROL_CONFIG;
  }

  return ACCESS_CONTROL_CONFIG.filter(c => userLevel >= c.minLevel);
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