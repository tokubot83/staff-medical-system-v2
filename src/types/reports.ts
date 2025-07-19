// レポートの型定義
export interface Report {
  id: string;
  title: string;
  description: string;
  category: 'metrics' | 'hr' | 'worklife' | 'talent' | 'organization' | 'environment' | 'cost' | 'recruitment' | 'retention' | 'skill';
  icon: string;
  color: string;
  path: string;
  type?: 'basic' | 'strategic';
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

// 全レポート統合
export const allReports: Report[] = [
  ...metricsReports,
  ...reports.map(report => ({ ...report, type: 'strategic' as const }))
];