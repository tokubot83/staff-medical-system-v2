import { ReportCategory } from '../types/reports';

// カテゴリ情報の型定義
export interface CategoryInfo {
  name: string;
  description: string;
  icon: string;
  color: string;
}

// レポートカテゴリの情報マッピング
const categoryInfoMap: Record<ReportCategory, CategoryInfo> = {
  [ReportCategory.BASIC]: {
    name: '基本指標',
    description: '総職員数、部門別人員構成など基本的な統計データ',
    icon: '📊',
    color: 'bg-green-500'
  },
  [ReportCategory.QUALITY]: {
    name: '人材の質',
    description: '職員満足度、スキル評価、資格保有状況の分析',
    icon: '⭐',
    color: 'bg-blue-500'
  },
  [ReportCategory.GROWTH]: {
    name: '人材の成長',
    description: '研修受講率、スキル向上度、キャリア開発状況',
    icon: '📈',
    color: 'bg-purple-500'
  },
  [ReportCategory.RISK]: {
    name: 'リスク管理',
    description: '離職リスク、コンプライアンス、要注意職員の管理',
    icon: '⚠️',
    color: 'bg-yellow-500'
  },
  [ReportCategory.EFFICIENCY]: {
    name: '組織効率',
    description: '労働生産性、業務効率、緊急対応事項',
    icon: '⚡',
    color: 'bg-red-500'
  }
};

// 戦略レポートカテゴリの情報マッピング
export const strategicCategoryInfoMap: Record<string, CategoryInfo> = {
  hr: {
    name: '人事管理戦略',
    description: '組織の人事管理戦略を総合的に分析',
    icon: '📊',
    color: 'bg-blue-500'
  },
  worklife: {
    name: 'ワークライフバランス',
    description: '労働時間、休暇取得状況、ストレス指標の分析',
    icon: '⚖️',
    color: 'bg-green-500'
  },
  talent: {
    name: '人材育成',
    description: '職種ごとの育成計画とキャリアパス分析',
    icon: '🎯',
    color: 'bg-purple-500'
  },
  organization: {
    name: '組織構造',
    description: '部門別の人員配置と組織効率の分析',
    icon: '🏢',
    color: 'bg-indigo-500'
  },
  environment: {
    name: '労働環境',
    description: '職場環境の課題特定と改善策の提案',
    icon: '🌟',
    color: 'bg-yellow-500'
  },
  cost: {
    name: '人件費最適化',
    description: '人件費の詳細分析と最適化提案',
    icon: '💰',
    color: 'bg-red-500'
  },
  recruitment: {
    name: '採用効果',
    description: '採用活動の効果測定と改善提案',
    icon: '🎯',
    color: 'bg-teal-500'
  },
  retention: {
    name: '離職リスク',
    description: 'データ分析による離職リスクの予測と対策',
    icon: '⚠️',
    color: 'bg-orange-500'
  },
  skill: {
    name: 'スキル・資格管理',
    description: 'スキルと資格の現状分析と育成計画',
    icon: '📜',
    color: 'bg-pink-500'
  },
  metrics: {
    name: '基本指標',
    description: '各種基本指標の統計データ',
    icon: '📊',
    color: 'bg-gray-500'
  },
  'dual-axis': {
    name: '2軸評価分析',
    description: 'スキルと成果の2軸で職員パフォーマンスを多角的に評価・分析',
    icon: '🎲',
    color: 'bg-cyan-500'
  }
};

/**
 * ReportCategoryのenumからカテゴリ情報を取得する
 * @param category - ReportCategoryのenum値
 * @returns カテゴリ名、説明、アイコン、色を含むオブジェクト
 */
export function getCategoryInfo(category: ReportCategory): CategoryInfo {
  const info = categoryInfoMap[category];
  
  if (!info) {
    // デフォルト値を返す
    return {
      name: '不明なカテゴリ',
      description: 'カテゴリ情報が見つかりません',
      icon: '❓',
      color: 'bg-gray-400'
    };
  }
  
  return info;
}

/**
 * 文字列のカテゴリからカテゴリ情報を取得する（戦略レポート用）
 * @param category - カテゴリ文字列
 * @returns カテゴリ名、説明、アイコン、色を含むオブジェクト
 */
export function getStrategicCategoryInfo(category: string): CategoryInfo {
  const info = strategicCategoryInfoMap[category];
  
  if (!info) {
    // デフォルト値を返す
    return {
      name: '不明なカテゴリ',
      description: 'カテゴリ情報が見つかりません',
      icon: '❓',
      color: 'bg-gray-400'
    };
  }
  
  return info;
}

/**
 * すべてのカテゴリ情報を取得する
 * @returns すべてのカテゴリ情報の配列
 */
export function getAllCategoryInfo(): Array<{ key: ReportCategory; info: CategoryInfo }> {
  return Object.entries(categoryInfoMap).map(([key, info]) => ({
    key: key as ReportCategory,
    info
  }));
}

/**
 * すべての戦略カテゴリ情報を取得する
 * @returns すべての戦略カテゴリ情報の配列
 */
export function getAllStrategicCategoryInfo(): Array<{ key: string; info: CategoryInfo }> {
  return Object.entries(strategicCategoryInfoMap).map(([key, info]) => ({
    key,
    info
  }));
}

/**
 * カテゴリが存在するかチェックする
 * @param category - チェックするカテゴリ
 * @returns カテゴリが存在する場合はtrue
 */
export function isCategoryValid(category: ReportCategory): boolean {
  return category in categoryInfoMap;
}

/**
 * 戦略カテゴリが存在するかチェックする
 * @param category - チェックするカテゴリ文字列
 * @returns カテゴリが存在する場合はtrue
 */
export function isStrategicCategoryValid(category: string): boolean {
  return category in strategicCategoryInfoMap;
}