import { 
  CoreEvaluationCategory, 
  EvaluationMasterV2 
} from '@/types/evaluation-config-v2';

// パターン2: 項目別差別化型の評価配分
export const evaluationWeights = {
  C01: { superior: 0.7, self: 0.3 }, // 専門技術：上司7点、本人3点
  C02: { superior: 0.5, self: 0.5 }, // 対人関係：上司5点、本人5点
  C03: { superior: 0.8, self: 0.2 }, // 安全管理：上司8点、本人2点
};

// コア評価カテゴリー（法人統一30点）
export const coreEvaluationCategories: CoreEvaluationCategory[] = [
  {
    id: 'C01',
    name: '専門技術・スキル',
    description: '職種・経験に応じた技術力と記録能力',
    maxScore: 10,
    superiorScore: 7,
    selfScore: 3,
    subcategories: [
      {
        id: 'C01-1',
        name: '基本技術',
        points: 4,
        evaluationCriteria: [
          '職種別基本手技の習得と実践',
          '標準手順の理解と遵守',
          '必要な資格・認定の取得'
        ],
        requiredTrainings: ['TR_BASIC_001', 'TR_BASIC_002']
      },
      {
        id: 'C01-2',
        name: '応用技術',
        points: 3,
        evaluationCriteria: [
          '経験レベルに応じた高度技術の習得',
          '困難事例への対応力',
          '技術改善の提案と実践'
        ],
        requiredTrainings: ['TR_ADVANCED_001']
      },
      {
        id: 'C01-3',
        name: '記録・報告',
        points: 3,
        evaluationCriteria: [
          '看護記録・カルテの正確な記載',
          'インシデント報告の適切な実施',
          '申し送り・情報共有の質',
          '書類作成の迅速性と正確性'
        ],
        requiredTrainings: ['TR_RECORD_001']
      }
    ]
  },
  {
    id: 'C02',
    name: '対人関係・ケア',
    description: '患者/利用者への対応力と権利擁護',
    maxScore: 10,
    superiorScore: 5,
    selfScore: 5,
    subcategories: [
      {
        id: 'C02-1',
        name: '基本的対応',
        points: 5,
        evaluationCriteria: [
          '丁寧な接遇とコミュニケーション',
          '傾聴と共感的理解',
          '患者・家族への適切な説明',
          'チーム内での円滑な連携'
        ],
        requiredTrainings: ['TR_COMMUNICATION_001']
      },
      {
        id: 'C02-2',
        name: '権利擁護',
        points: 5,
        evaluationCriteria: [
          '尊厳を守る声かけと対応',
          '虐待防止への意識と実践',
          'プライバシーの保護',
          '意思決定支援の実施'
        ],
        requiredTrainings: ['TR_ABUSE_001'] // 法定研修（年1回必須）
      }
    ]
  },
  {
    id: 'C03',
    name: '安全・品質管理',
    description: '安全確保と品質向上への取り組み',
    maxScore: 10,
    superiorScore: 8,
    selfScore: 2,
    subcategories: [
      {
        id: 'C03-1',
        name: '医療安全',
        points: 3,
        evaluationCriteria: [
          '医療安全研修の受講（年2回必須）',
          'KYT（危険予知トレーニング）の実践',
          '安全確認行動（指差呼称等）の実施',
          'ヒヤリハット事例の共有'
        ],
        requiredTrainings: ['TR_SAFETY_001', 'TR_SAFETY_002'] // 法定研修（年2回必須）
      },
      {
        id: 'C03-2',
        name: '感染対策',
        points: 3,
        evaluationCriteria: [
          '感染対策研修の受講（年2回必須）',
          '標準予防策の確実な実施',
          '手指衛生5つのタイミングの遵守',
          'PPE（個人防護具）の適切な使用'
        ],
        requiredTrainings: ['TR_INFECTION_001', 'TR_INFECTION_002'] // 法定研修（年2回必須）
      },
      {
        id: 'C03-3',
        name: '身体拘束適正化',
        points: 2,
        evaluationCriteria: [
          '身体拘束適正化研修の受講（年2回必須）',
          '身体拘束の3原則の理解',
          '代替ケアの提案と実践',
          '適切な記録の作成'
        ],
        requiredTrainings: ['TR_RESTRAINT_001', 'TR_RESTRAINT_002'] // 法定研修（年2回必須）
      },
      {
        id: 'C03-4',
        name: '情報管理・BCP',
        points: 2,
        evaluationCriteria: [
          '個人情報保護研修の受講（年1回必須）',
          '守秘義務の遵守',
          'BCP訓練への参加',
          '災害時対応の理解'
        ],
        requiredTrainings: ['TR_PRIVACY_001', 'TR_BCP_001'] // 法定研修（年1回必須）
      }
    ]
  }
];

// 評価グレード定義
export const evaluationGrades = {
  S: { label: '卓越', value: 1.0, description: '期待を大きく上回る' },
  A: { label: '優秀', value: 0.85, description: '期待を上回る' },
  B: { label: '良好', value: 0.70, description: '期待通り' },
  C: { label: '要改善', value: 0.55, description: '期待をやや下回る' },
  D: { label: '不十分', value: 0.40, description: '期待を大きく下回る' }
};

// 研修マスターデータ
export const trainingMaster = {
  // 基本研修
  TR_BASIC_001: { name: '職種別基礎研修', frequency: '入職時', mandatory: true, legal: false },
  TR_BASIC_002: { name: '基本手技研修', frequency: '年1回', mandatory: true, legal: false },
  TR_ADVANCED_001: { name: '専門技術向上研修', frequency: '年1回', mandatory: false, legal: false },
  TR_RECORD_001: { name: '記録管理研修', frequency: '年1回', mandatory: true, legal: false },
  TR_COMMUNICATION_001: { name: '接遇・コミュニケーション研修', frequency: '年1回', mandatory: true, legal: false },
  
  // 法定研修
  TR_ABUSE_001: { name: '虐待防止研修', frequency: '年1回', mandatory: true, legal: true },
  TR_SAFETY_001: { name: '医療安全研修（前期）', frequency: '年2回', mandatory: true, legal: true },
  TR_SAFETY_002: { name: '医療安全研修（後期）', frequency: '年2回', mandatory: true, legal: true },
  TR_INFECTION_001: { name: '感染対策研修（前期）', frequency: '年2回', mandatory: true, legal: true },
  TR_INFECTION_002: { name: '感染対策研修（後期）', frequency: '年2回', mandatory: true, legal: true },
  TR_RESTRAINT_001: { name: '身体拘束適正化研修（前期）', frequency: '年2回', mandatory: true, legal: true },
  TR_RESTRAINT_002: { name: '身体拘束適正化研修（後期）', frequency: '年2回', mandatory: true, legal: true },
  TR_PRIVACY_001: { name: '個人情報保護研修', frequency: '年1回', mandatory: true, legal: true },
  TR_BCP_001: { name: 'BCP研修', frequency: '年1回', mandatory: true, legal: true }
};

// 評価計算関数
export function calculateCoreEvaluation(
  superiorScores: Record<string, number>,
  selfScores: Record<string, number>
): {
  categoryScores: Record<string, { superior: number; self: number; total: number }>;
  totalScore: number;
  details: any[];
} {
  const categoryScores: Record<string, { superior: number; self: number; total: number }> = {};
  let totalScore = 0;
  const details: any[] = [];

  coreEvaluationCategories.forEach(category => {
    const weight = evaluationWeights[category.id as keyof typeof evaluationWeights];
    const superiorScore = (superiorScores[category.id] || 0) * category.maxScore * weight.superior;
    const selfScore = (selfScores[category.id] || 0) * category.maxScore * weight.self;
    const categoryTotal = superiorScore + selfScore;

    categoryScores[category.id] = {
      superior: Math.round(superiorScore * 10) / 10,
      self: Math.round(selfScore * 10) / 10,
      total: Math.round(categoryTotal * 10) / 10
    };

    totalScore += categoryTotal;

    // 詳細情報を記録
    category.subcategories.forEach(sub => {
      details.push({
        categoryId: category.id,
        categoryName: category.name,
        subcategoryId: sub.id,
        subcategoryName: sub.name,
        points: sub.points,
        requiredTrainings: sub.requiredTrainings,
        criteria: sub.evaluationCriteria
      });
    });
  });

  return {
    categoryScores,
    totalScore: Math.round(totalScore * 10) / 10,
    details
  };
}

// 研修受講チェック関数
export function checkTrainingCompletion(
  completedTrainings: string[],
  requiredTrainings: string[]
): {
  completed: boolean;
  missingTrainings: string[];
  completionRate: number;
} {
  const missingTrainings = requiredTrainings.filter(
    training => !completedTrainings.includes(training)
  );

  return {
    completed: missingTrainings.length === 0,
    missingTrainings,
    completionRate: requiredTrainings.length > 0 
      ? Math.round((completedTrainings.filter(t => requiredTrainings.includes(t)).length / requiredTrainings.length) * 100)
      : 100
  };
}