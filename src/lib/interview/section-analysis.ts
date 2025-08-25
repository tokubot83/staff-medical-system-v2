// 面談セクション分析用ユーティリティ
// 職階別のセクション構成と分析データを管理

export interface SectionConfig {
  key: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
  strokeWidth: number;
  strokeDasharray?: string;
}

export interface SectionTrendData {
  date: string;
  period: string;
  [key: string]: number | string;
}

export interface SectionAnalysisResult {
  section: string;
  completion: number;
  diff: number;
  trend: 'up' | 'stable' | 'down';
  priority: 'high' | 'medium' | 'low';
}

export interface SectionCorrelationData {
  section: string;
  discussion_depth: number;
  improvement_rate: number;
  priority: 'high' | 'medium' | 'low';
}

// 職階別セクション構成マップ
const SECTION_CONFIGS = {
  'general-nurse': [
    { key: 'performance', name: '業務遂行能力', priority: 'high' as const, color: '#2563eb', strokeWidth: 3 },
    { key: 'growth', name: '成長目標', priority: 'high' as const, color: '#16a34a', strokeWidth: 3 },
    { key: 'teamwork', name: 'チーム連携', priority: 'medium' as const, color: '#dc2626', strokeWidth: 2, strokeDasharray: '5 5' },
    { key: 'career', name: 'キャリア志向', priority: 'medium' as const, color: '#ca8a04', strokeWidth: 2 },
    { key: 'communication', name: 'コミュニケーション', priority: 'low' as const, color: '#e5e7eb', strokeWidth: 1 }
  ],
  'senior-nurse': [
    { key: 'performance', name: '業務遂行能力', priority: 'high' as const, color: '#2563eb', strokeWidth: 3 },
    { key: 'leadership', name: 'リーダーシップ', priority: 'high' as const, color: '#16a34a', strokeWidth: 3 },
    { key: 'mentoring', name: '後輩指導', priority: 'medium' as const, color: '#dc2626', strokeWidth: 2 },
    { key: 'specialization', name: '専門性向上', priority: 'medium' as const, color: '#ca8a04', strokeWidth: 2 },
    { key: 'career', name: 'キャリア志向', priority: 'low' as const, color: '#e5e7eb', strokeWidth: 1 }
  ],
  'chief-nurse': [
    { key: 'team_management', name: 'チーム管理', priority: 'high' as const, color: '#2563eb', strokeWidth: 3 },
    { key: 'staff_development', name: 'スタッフ育成', priority: 'high' as const, color: '#16a34a', strokeWidth: 3 },
    { key: 'quality_improvement', name: '業務改善', priority: 'high' as const, color: '#dc2626', strokeWidth: 3 },
    { key: 'leadership', name: 'リーダーシップ', priority: 'medium' as const, color: '#ca8a04', strokeWidth: 2 },
    { key: 'upward_coordination', name: '上位連携', priority: 'medium' as const, color: '#e5e7eb', strokeWidth: 1 }
  ],
  'ward-manager': [
    { key: 'strategic_management', name: '戦略的経営', priority: 'high' as const, color: '#2563eb', strokeWidth: 3 },
    { key: 'organizational_change', name: '組織変革', priority: 'high' as const, color: '#16a34a', strokeWidth: 3 },
    { key: 'performance_management', name: '実績管理', priority: 'high' as const, color: '#dc2626', strokeWidth: 3 },
    { key: 'innovation_leadership', name: '変革推進', priority: 'medium' as const, color: '#ca8a04', strokeWidth: 2 },
    { key: 'talent_development', name: '人材育成', priority: 'medium' as const, color: '#e5e7eb', strokeWidth: 1 }
  ]
};

// 職階別基準値
const TARGET_VALUES = {
  'general-nurse': 75,
  'senior-nurse': 78,
  'chief-nurse': 80,
  'ward-manager': 85
};

// 職階別グラフタイトル
const CHART_TITLES = {
  'general-nurse': '📈 スキル別成長トレンド',
  'senior-nurse': '📊 リーダーシップ評価推移',
  'chief-nurse': '🏢 管理能力別評価推移',
  'ward-manager': '🚀 経営指標別パフォーマンス'
};

/**
 * 職階に基づいてセクション構成を取得
 */
export function getSectionsByRole(role: string): SectionConfig[] {
  return SECTION_CONFIGS[role as keyof typeof SECTION_CONFIGS] || SECTION_CONFIGS['general-nurse'];
}

/**
 * 職階に基づいて目標値を取得
 */
export function getTargetValueByRole(role: string): number {
  return TARGET_VALUES[role as keyof typeof TARGET_VALUES] || TARGET_VALUES['general-nurse'];
}

/**
 * 職階に基づいてグラフタイトルを取得
 */
export function getChartTitleByRole(role: string): string {
  return CHART_TITLES[role as keyof typeof CHART_TITLES] || CHART_TITLES['general-nurse'];
}

/**
 * 職階に基づいて基準線ラベルを取得
 */
export function getReferenceLineLabel(role: string): string {
  const labels = {
    'general-nurse': '成長目標',
    'senior-nurse': '指導目標', 
    'chief-nurse': '管理目標',
    'ward-manager': '戦略目標'
  };
  return labels[role as keyof typeof labels] || labels['general-nurse'];
}

/**
 * サンプルデータ生成（実際の実装では DB から取得）
 */
export function generateSampleTrendData(role: string): SectionTrendData[] {
  const sections = getSectionsByRole(role);
  const periods = ['2024年1月', '2024年3月', '2024年5月', '2024年7月', '2024年9月', '2024年11月'];
  
  return periods.map((period, index) => {
    const baseScore = 60 + (index * 4); // 基本的に上昇傾向
    const data: SectionTrendData = {
      date: `2024-${String((index * 2) + 1).padStart(2, '0')}-01`,
      period
    };
    
    sections.forEach(section => {
      // セクション別の変動を追加
      const variation = Math.random() * 20 - 10; // -10〜+10の変動
      const priorityBonus = section.priority === 'high' ? 10 : section.priority === 'medium' ? 5 : 0;
      data[section.key] = Math.round(Math.max(30, Math.min(95, baseScore + variation + priorityBonus)));
    });
    
    return data;
  });
}

/**
 * セクション充実度分析データ生成
 */
export function generateSectionCompletionData(role: string): SectionAnalysisResult[] {
  const sections = getSectionsByRole(role);
  
  return sections.map(section => ({
    section: section.name,
    completion: Math.round(Math.random() * 30 + 60), // 60-90%
    diff: Math.round(Math.random() * 20 - 10), // -10〜+10%
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.7 ? 'down' : 'stable' as any,
    priority: section.priority
  })).sort((a, b) => b.completion - a.completion); // 充実度順にソート
}

/**
 * セクション相関分析データ生成
 */
export function generateSectionCorrelationData(role: string): SectionCorrelationData[] {
  const sections = getSectionsByRole(role);
  
  return sections.map(section => ({
    section: section.name,
    discussion_depth: Math.round(Math.random() * 40 + 30), // 30-70%
    improvement_rate: Math.round(Math.random() * 40 + 20), // 20-60%
    priority: section.priority
  }));
}

/**
 * 職階別解釈テキスト生成
 */
export function getInsightsByRole(role: string, data: SectionTrendData[]): {
  title: string;
  color: string;
  items: string[];
}[] {
  const insights = {
    'general-nurse': [
      {
        title: '📈 成長領域',
        color: 'green',
        items: ['• 業務遂行: +18%', '• チーム連携: +12%']
      },
      {
        title: '⚠️ 支援領域', 
        color: 'orange',
        items: ['• キャリア志向: 要フォロー', '• 次回重点議題として推奨']
      }
    ],
    'senior-nurse': [
      {
        title: '👑 リーダーシップ',
        color: 'blue',
        items: ['• 後輩指導: 優秀', '• チーム統率: 向上中']
      },
      {
        title: '📚 専門性向上',
        color: 'green', 
        items: ['• 専門資格: 取得済', '• 指導スキル: +25%']
      }
    ],
    'chief-nurse': [
      {
        title: '👥 チーム管理',
        color: 'green',
        items: ['• チーム運営: +15%', '• スタッフ満足度: 向上']
      },
      {
        title: '📚 育成実績',
        color: 'blue',
        items: ['• 新人定着率: 95%', '• スキル向上: +20%']
      }
    ],
    'ward-manager': [
      {
        title: '💼 経営貢献',
        color: 'blue',
        items: ['• 病床稼働率: +12%', '• コスト効率: +8%']
      },
      {
        title: '🚀 変革推進',
        color: 'purple',
        items: ['• 組織改革: 実施中', '• イノベーション: 継続']
      }
    ]
  };
  
  return insights[role as keyof typeof insights] || insights['general-nurse'];
}