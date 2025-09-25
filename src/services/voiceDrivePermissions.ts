/**
 * VoiceDrive権限管理システム完全準拠版
 * 18段階権限レベル + 特別権限X の詳細定義
 *
 * 最終更新: 2025年9月25日
 * 医療チーム実装版
 */

// 権限レベル詳細定義
export interface LevelDefinition {
  level: number;
  name: string;
  category: string;
  description: string;
  votingWeight: number;      // 投票重み
  hasAnalytics: boolean;     // 分析機能の有無
  menus: string[];           // アクセス可能メニュー
  specialFeatures?: string[]; // 特別機能
}

// VoiceDrive公式18段階権限定義
export const VOICEDRIVE_LEVEL_DEFINITIONS: Record<number, LevelDefinition> = {
  // === 一般職員層 ===
  1: {
    level: 1,
    name: '新人（1年目）',
    category: '一般職員層',
    description: '入職1年目の全職種',
    votingWeight: 1.0,
    hasAnalytics: false,
    menus: ['パーソナルステーション'],
    specialFeatures: ['アイデア投稿', '部署内投票', '自分の投稿閲覧']
  },
  1.5: {
    level: 1.5,
    name: '新人看護師（リーダー可）',
    category: '一般職員層',
    description: '1年目でリーダー業務可能な看護師（稀）',
    votingWeight: 1.15,
    hasAnalytics: false,
    menus: ['パーソナルステーション'],
    specialFeatures: ['チーム投稿の閲覧', '基本的なリーダー業務']
  },
  2: {
    level: 2,
    name: '若手（2-3年目）',
    category: '一般職員層',
    description: '経験2-3年の職員',
    votingWeight: 1.2,
    hasAnalytics: false,
    menus: ['パーソナルステーション', '部署掲示板'],
    specialFeatures: ['アイデア投稿', '部署内投票', 'チーム投稿の閲覧']
  },
  2.5: {
    level: 2.5,
    name: '若手看護師（リーダー可）',
    category: '一般職員層',
    description: 'リーダー業務可能な2-3年目看護師',
    votingWeight: 1.35,
    hasAnalytics: false,
    menus: ['パーソナルステーション', '部署掲示板'],
    specialFeatures: ['日勤・夜勤リーダー業務', 'チーム調整機能']
  },
  3: {
    level: 3,
    name: '中堅（4-10年目）',
    category: '一般職員層',
    description: '経験4-10年の職員',
    votingWeight: 1.5,
    hasAnalytics: false,
    menus: ['パーソナルステーション', '部署掲示板'],
    specialFeatures: ['部署内投稿の閲覧', '新人指導・メンタリング', '法人レベル投票可能']
  },
  3.5: {
    level: 3.5,
    name: '中堅看護師（リーダー可）',
    category: '一般職員層',
    description: 'リーダー業務可能な中堅看護師、プリセプター',
    votingWeight: 1.65,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '部署掲示板', 'チームダッシュボード'],
    specialFeatures: ['プリセプター業務', '教育支援機能', 'チームダッシュボード閲覧']
  },
  4: {
    level: 4,
    name: 'ベテラン（11年以上）',
    category: '一般職員層',
    description: '経験11年以上の職員',
    votingWeight: 1.8,
    hasAnalytics: false,
    menus: ['パーソナルステーション', '部署掲示板'],
    specialFeatures: ['部署内投稿の閲覧', '専門的助言機能']
  },
  4.5: {
    level: 4.5,
    name: 'ベテラン看護師（リーダー可）',
    category: '一般職員層',
    description: 'ベテランリーダー看護師、副主任候補',
    votingWeight: 1.95,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '部署掲示板', 'チームダッシュボード'],
    specialFeatures: ['リーダー指導', '副主任候補としての準備機能', '部署横断的な視点']
  },

  // === 役職層 ===
  5: {
    level: 5,
    name: '副主任',
    category: '役職層',
    description: '主任補佐、チームサブリーダー',
    votingWeight: 2.0,
    hasAnalytics: true,
    menus: ['パーソナルステーション', 'チームダッシュボード', '提案レビュー'],
    specialFeatures: ['チーム内アイテム承認', 'チーム調整機能']
  },
  6: {
    level: 6,
    name: '主任',
    category: '役職層',
    description: '各部署主任',
    votingWeight: 2.2,
    hasAnalytics: true,
    menus: ['パーソナルステーション', 'チームダッシュボード', '提案レビュー', '迅速実装'],
    specialFeatures: ['チームプロジェクト承認', 'チームモデレート機能', '迅速実装権限']
  },
  7: {
    level: 7,
    name: '副師長・副科長・副課長',
    category: '役職層',
    description: '中間管理職補佐',
    votingWeight: 2.3,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '部署ステーション', '委員会ツール', '議題ジェネレーター'],
    specialFeatures: ['委員会準備機能', '部署間調整', '議題生成ツール']
  },
  8: {
    level: 8,
    name: '師長・科長・課長・室長',
    category: '役職層',
    description: '中間管理職',
    votingWeight: 2.3,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '部署ステーション', '委員会ツール', '委員会ブリッジ'],
    specialFeatures: ['部署プロジェクト承認', '委員会提出権限', '部署全体の管理']
  },
  9: {
    level: 9,
    name: '副部長',
    category: '役職層',
    description: '部長補佐',
    votingWeight: 2.5,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '部署ステーション', 'プロジェクトガバナンス', '部署横断'],
    specialFeatures: ['施設内投稿閲覧', '部署横断調整', '戦略計画支援']
  },
  10: {
    level: 10,
    name: '部長・医局長',
    category: '役職層',
    description: '部門責任者',
    votingWeight: 2.8,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '部署ステーション', '運営委員会', '施設ガバナンス'],
    specialFeatures: ['施設プロジェクト承認', '運営委員会メンバー', '施設ガバナンス']
  },
  11: {
    level: 11,
    name: '事務長',
    category: '役職層',
    description: '施設事務統括',
    votingWeight: 3.0,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '施設管理', '戦略イニシアチブ', '予算管理'],
    specialFeatures: ['全投稿閲覧', '施設管理機能', '予算管理権限', '事務承認権限']
  },

  // === 施設経営層 ===
  12: {
    level: 12,
    name: '副院長',
    category: '施設経営層',
    description: '院長補佐、医療統括',
    votingWeight: 3.5,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '戦略決定', 'エグゼクティブダッシュボード', '医療ガバナンス'],
    specialFeatures: ['医療方針策定', '戦略計画立案', '決定支援機能']
  },
  13: {
    level: 13,
    name: '院長・施設長',
    category: '施設経営層',
    description: '施設最高責任者',
    votingWeight: 4.0,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '戦略決定', 'エグゼクティブダッシュボード', '決定会議'],
    specialFeatures: ['施設ガバナンス', '戦略決定権限', '施設最終承認']
  },

  // === 法人人事部 ===
  14: {
    level: 14,
    name: '人事部門員',
    category: '法人人事部',
    description: '採用、教育、相談、業務革新部門員',
    votingWeight: 2.0,
    hasAnalytics: true,
    menus: ['パーソナルステーション', 'ボイス分析', 'カルチャー開発'],
    specialFeatures: ['全投稿閲覧', 'HR業務機能', 'スタッフ相談', 'ボイス分析']
  },
  15: {
    level: 15,
    name: '人事各部門長',
    category: '法人人事部',
    description: '採用戦略、教育体制、コンサルカウンター、業務革新の各部門長',
    votingWeight: 3.0,
    hasAnalytics: true,
    menus: ['パーソナルステーション', 'ボイス分析', 'カルチャー開発', '組織インサイト'],
    specialFeatures: ['HR管理機能', '部門戦略立案', '組織インサイト']
  },
  16: {
    level: 16,
    name: '戦略企画・統括管理部門員',
    category: '法人人事部',
    description: '廻総師長、徳留等の戦略企画メンバー',
    votingWeight: 3.5,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '戦略HR計画', '組織インサイト', 'エグゼクティブ報告'],
    specialFeatures: ['戦略HR計画', '施設横断調整', 'システム統合', '法人全体視点']
  },
  17: {
    level: 17,
    name: '戦略企画・統括管理部門長',
    category: '法人人事部',
    description: '人事部統括責任者',
    votingWeight: 4.0,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '戦略HR計画', 'エグゼクティブ報告', '理事会準備'],
    specialFeatures: ['HRガバナンス', '組織設計権限', '役員提案機能']
  },

  // === 最高経営層 ===
  18: {
    level: 18,
    name: '理事長・法人事務局長',
    category: '最高経営層',
    description: '最終決定権者',
    votingWeight: 5.0,
    hasAnalytics: true,
    menus: ['パーソナルステーション', '理事会機能', '戦略ガバナンス', '最終承認'],
    specialFeatures: ['最終決定権限', '組織ガバナンス', 'エグゼクティブ特権', '全ステージアクセス']
  },

  // === 特別権限 ===
  99: {
    level: 99,
    name: 'システム管理者',
    category: '特別権限',
    description: 'システム管理・保守担当',
    votingWeight: 10.0,
    hasAnalytics: true,
    menus: ['全メニューアクセス可能'],
    specialFeatures: ['システム全体管理', 'デバッグ機能', 'データメンテナンス', '緊急対応権限']
  }
};

// 議題エスカレーション閾値
export const ESCALATION_THRESHOLDS = {
  DEPARTMENT_DISCUSSION: 30,     // 部署内議論開始
  DEPARTMENT_AGENDA: 50,         // 部署内正式議題化
  FACILITY_VOTING: 100,          // 施設全体投票開始
  CORPORATE_VOTING: 300,         // 法人全体投票開始
  BOARD_CANDIDATE: 600           // 理事会議題候補
};

// 部署規模による調整係数
export const DEPARTMENT_SIZE_FACTOR = {
  SMALL: { max: 5, factor: 0.4 },      // 5人以下
  MEDIUM: { max: 15, factor: 0.6 },    // 6-15人
  LARGE: { max: 30, factor: 0.8 },     // 16-30人
  XLARGE: { max: Infinity, factor: 1.0 } // 31人以上
};

// 権限レベルから詳細情報を取得
export function getLevelDetails(level: number): LevelDefinition | null {
  // 小数点を含む場合（1.5, 2.5など）も正確に取得
  return VOICEDRIVE_LEVEL_DEFINITIONS[level] || null;
}

// 投票重みを取得
export function getVotingWeight(level: number): number {
  const details = getLevelDetails(level);
  return details?.votingWeight || 1.0;
}


// メニューアクセス権限を確認
export function canAccessMenu(level: number, menuName: string): boolean {
  // システム管理者は全てアクセス可能
  if (level === 99) return true;

  const details = getLevelDetails(level);
  if (!details) return false;

  return details.menus.includes(menuName);
}

// 部署規模に応じた閾値調整
export function adjustThresholdByDepartmentSize(
  baseThreshold: number,
  departmentSize: number
): number {
  if (departmentSize <= DEPARTMENT_SIZE_FACTOR.SMALL.max) {
    return baseThreshold * DEPARTMENT_SIZE_FACTOR.SMALL.factor;
  } else if (departmentSize <= DEPARTMENT_SIZE_FACTOR.MEDIUM.max) {
    return baseThreshold * DEPARTMENT_SIZE_FACTOR.MEDIUM.factor;
  } else if (departmentSize <= DEPARTMENT_SIZE_FACTOR.LARGE.max) {
    return baseThreshold * DEPARTMENT_SIZE_FACTOR.LARGE.factor;
  } else {
    return baseThreshold * DEPARTMENT_SIZE_FACTOR.XLARGE.factor;
  }
}

// エスカレーションレベルを判定
export function getEscalationLevel(
  score: number,
  departmentSize: number
): string {
  const adjustedThresholds = {
    DEPARTMENT_DISCUSSION: adjustThresholdByDepartmentSize(
      ESCALATION_THRESHOLDS.DEPARTMENT_DISCUSSION,
      departmentSize
    ),
    DEPARTMENT_AGENDA: adjustThresholdByDepartmentSize(
      ESCALATION_THRESHOLDS.DEPARTMENT_AGENDA,
      departmentSize
    ),
    FACILITY_VOTING: adjustThresholdByDepartmentSize(
      ESCALATION_THRESHOLDS.FACILITY_VOTING,
      departmentSize
    ),
    CORPORATE_VOTING: adjustThresholdByDepartmentSize(
      ESCALATION_THRESHOLDS.CORPORATE_VOTING,
      departmentSize
    ),
    BOARD_CANDIDATE: adjustThresholdByDepartmentSize(
      ESCALATION_THRESHOLDS.BOARD_CANDIDATE,
      departmentSize
    )
  };

  if (score >= adjustedThresholds.BOARD_CANDIDATE) {
    return '理事会議題候補';
  } else if (score >= adjustedThresholds.CORPORATE_VOTING) {
    return '法人全体投票';
  } else if (score >= adjustedThresholds.FACILITY_VOTING) {
    return '施設全体投票';
  } else if (score >= adjustedThresholds.DEPARTMENT_AGENDA) {
    return '部署内正式議題';
  } else if (score >= adjustedThresholds.DEPARTMENT_DISCUSSION) {
    return '部署内議論';
  } else {
    return 'アイデア段階';
  }
}