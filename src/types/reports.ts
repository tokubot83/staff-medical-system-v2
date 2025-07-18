// レポートの型定義
export interface Report {
  id: string;
  title: string;
  description: string;
  category: 'hr' | 'worklife' | 'talent' | 'organization' | 'environment' | 'cost' | 'recruitment' | 'retention' | 'skill';
  icon: string;
  color: string;
  path: string;
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
    description: 'AI分析による離職リスクの予測と対策を提案します',
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