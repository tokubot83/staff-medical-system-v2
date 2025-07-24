// レポートカテゴリの列挙型
export enum ReportCategory {
  BASIC = 'basic',
  QUALITY = 'quality',
  GROWTH = 'growth',
  RISK = 'risk',
  EFFICIENCY = 'efficiency'
}

// レポートの型定義
export interface Report {
  id: string;
  title: string;
  description: string;
  category: 'metrics' | 'hr' | 'worklife' | 'talent' | 'organization' | 'environment' | 'cost' | 'recruitment' | 'retention' | 'skill' | 'survival-curve' | 'hazard-analysis' | 'segment-analysis' | 'early-turnover' | 'cohort-analysis';
  icon: string;
  color: string;
  path: string;
  type?: 'basic' | 'strategic' | 'retention';
  frequency?: string;
  lastUpdated?: string;
}

export interface ReportData {
  facilityId: string;
  generatedAt: Date;
  data: any;
}

// レポート定義
export const reports: Report[] = [
  {
    id: 'hr-strategy',
    title: '人事管理戦略分析',
    description: '組織の人事管理戦略を総合的に分析し、改善提案を提供します',
    category: 'hr',
    icon: '📊',
    color: 'bg-blue-500',
    path: '/reports/hr-strategy'
  },
  {
    id: 'work-life-balance',
    title: 'ワークライフバランス分析',
    description: '職員の労働時間、休暇取得状況、ストレス指標を分析します',
    category: 'worklife',
    icon: '⚖️',
    color: 'bg-green-500',
    path: '/reports/work-life-balance'
  },
  {
    id: 'talent-development',
    title: '職種別人材育成戦略',
    description: '職種ごとの育成計画とキャリアパス分析を行います',
    category: 'talent',
    icon: '🎯',
    color: 'bg-purple-500',
    path: '/reports/talent-development'
  },
  {
    id: 'organization-optimization',
    title: '組織構造最適化分析',
    description: '部門別の人員配置と組織効率を分析します',
    category: 'organization',
    icon: '🏢',
    color: 'bg-indigo-500',
    path: '/reports/organization-optimization'
  },
  {
    id: 'work-environment',
    title: '労働環境改善戦略',
    description: '職場環境の課題を特定し、改善策を提案します',
    category: 'environment',
    icon: '🌟',
    color: 'bg-yellow-500',
    path: '/reports/work-environment'
  },
  {
    id: 'cost-optimization',
    title: '人件費最適化分析',
    description: '人件費の詳細分析と最適化提案を行います',
    category: 'cost',
    icon: '💰',
    color: 'bg-red-500',
    path: '/reports/cost-optimization'
  },
  {
    id: 'recruitment-effectiveness',
    title: '採用効果分析',
    description: '採用活動の効果測定と改善提案を提供します',
    category: 'recruitment',
    icon: '🎯',
    color: 'bg-teal-500',
    path: '/reports/recruitment-effectiveness'
  },
  {
    id: 'turnover-risk',
    title: '離職リスク予測',
    description: 'データ分析による離職リスクの予測と対策を提案します',
    category: 'retention',
    icon: '⚠️',
    color: 'bg-orange-500',
    path: '/reports/turnover-risk'
  },
  {
    id: 'skill-qualification',
    title: 'スキル・資格管理分析',
    description: '職員のスキルと資格の現状分析と育成計画を策定します',
    category: 'skill',
    icon: '📜',
    color: 'bg-pink-500',
    path: '/reports/skill-qualification'
  }
];

// 基本指標レポート定義
export const metricsReports: Report[] = [
  {
    id: 'basic-metrics',
    title: '基本指標',
    description: '総職員数、部門別人員構成など基本的な統計データを確認します',
    category: 'metrics',
    icon: '📊',
    color: 'bg-green-500',
    path: '/metrics/basic',
    type: 'basic'
  },
  {
    id: 'quality-metrics',
    title: '人材の質',
    description: '職員満足度、スキル評価、資格保有状況を分析します',
    category: 'metrics',
    icon: '⭐',
    color: 'bg-blue-500',
    path: '/metrics/quality',
    type: 'basic'
  },
  {
    id: 'growth-metrics',
    title: '人材の成長',
    description: '研修受講率、スキル向上度、キャリア開発状況を確認します',
    category: 'metrics',
    icon: '📈',
    color: 'bg-purple-500',
    path: '/metrics/growth',
    type: 'basic'
  },
  {
    id: 'risk-metrics',
    title: 'リスク管理',
    description: '離職リスク、コンプライアンス、要注意職員の状況を管理します',
    category: 'metrics',
    icon: '⚠️',
    color: 'bg-yellow-500',
    path: '/metrics/risk',
    type: 'basic'
  },
  {
    id: 'efficiency-metrics',
    title: '組織効率',
    description: '労働生産性、業務効率、緊急対応事項を確認します',
    category: 'metrics',
    icon: '⚡',
    color: 'bg-red-500',
    path: '/metrics/efficiency',
    type: 'basic'
  }
];

// 定着分析レポート定義
export const retentionReports: Report[] = [
  // 生存曲線分析
  {
    id: 'survival-curve-overall',
    title: '全体定着率推移分析',
    description: 'Kaplan-Meier法による全社的な定着率の時系列推移を可視化します',
    category: 'survival-curve',
    icon: '📈',
    color: 'bg-blue-500',
    path: '/reports/retention/survival-curve-overall',
    type: 'retention',
    frequency: '月次更新',
    lastUpdated: '2025年1月'
  },
  {
    id: 'survival-curve-department',
    title: '部署別定着パターン比較',
    description: '部署ごとの生存曲線を比較し、定着率の違いを分析します',
    category: 'survival-curve',
    icon: '📊',
    color: 'bg-green-500',
    path: '/reports/retention/survival-curve-department',
    type: 'retention',
    frequency: '月次更新',
    lastUpdated: '2025年1月'
  },
  // ハザード分析
  {
    id: 'hazard-cox-regression',
    title: '退職リスク要因分析',
    description: 'Cox比例ハザードモデルによる退職要因の定量的評価',
    category: 'hazard-analysis',
    icon: '⚠️',
    color: 'bg-red-500',
    path: '/reports/retention/hazard-cox-regression',
    type: 'retention',
    frequency: '四半期更新',
    lastUpdated: '2025年1月'
  },
  {
    id: 'hazard-risk-score',
    title: '個人別リスクスコア算出',
    description: '従業員ごとの退職リスクスコアを算出し、ランキング形式で提示',
    category: 'hazard-analysis',
    icon: '🎯',
    color: 'bg-orange-500',
    path: '/reports/retention/hazard-risk-score',
    type: 'retention',
    frequency: '月次更新',
    lastUpdated: '2025年1月'
  },
  // セグメント別分析
  {
    id: 'segment-recruitment-type',
    title: '新卒・中途別定着分析',
    description: '採用経路による定着パターンの違いを詳細分析',
    category: 'segment-analysis',
    icon: '👥',
    color: 'bg-purple-500',
    path: '/reports/retention/segment-recruitment-type',
    type: 'retention',
    frequency: '月次更新',
    lastUpdated: '2025年1月'
  },
  {
    id: 'segment-generation',
    title: '世代別定着傾向分析',
    description: '年齢層別の退職パターンと要因を分析',
    category: 'segment-analysis',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-indigo-500',
    path: '/reports/retention/segment-generation',
    type: 'retention',
    frequency: '月次更新',
    lastUpdated: '2025年1月'
  },
  // 早期離職予測
  {
    id: 'early-turnover-alert',
    title: '早期離職アラートシステム',
    description: 'AI予測による高リスク従業員の特定とアラート',
    category: 'early-turnover',
    icon: '🚨',
    color: 'bg-red-600',
    path: '/reports/retention/early-turnover-alert',
    type: 'retention',
    frequency: 'リアルタイム',
    lastUpdated: '2025年1月'
  },
  {
    id: 'early-turnover-pattern',
    title: '入社1年以内退職パターン分析',
    description: '早期退職者の共通パターンと予兆行動を分析',
    category: 'early-turnover',
    icon: '🔍',
    color: 'bg-yellow-500',
    path: '/reports/retention/early-turnover-pattern',
    type: 'retention',
    frequency: '月次更新',
    lastUpdated: '2025年1月'
  },
  // コホート分析
  {
    id: 'cohort-yearly-tracking',
    title: '入社年度別コホート追跡',
    description: '各採用年次の定着状況を長期追跡分析',
    category: 'cohort-analysis',
    icon: '📅',
    color: 'bg-teal-500',
    path: '/reports/retention/cohort-yearly-tracking',
    type: 'retention',
    frequency: '四半期更新',
    lastUpdated: '2025年1月'
  },
  {
    id: 'cohort-intervention-effect',
    title: 'リテンション施策効果測定',
    description: '各種施策実施前後での定着率改善効果を測定',
    category: 'cohort-analysis',
    icon: '📊',
    color: 'bg-green-600',
    path: '/reports/retention/cohort-intervention-effect',
    type: 'retention',
    frequency: '月次更新',
    lastUpdated: '2025年1月'
  }
];

// 全レポート統合
export const allReports: Report[] = [
  ...metricsReports,
  ...reports.map(report => ({ ...report, type: 'strategic' as const })),
  ...retentionReports
];