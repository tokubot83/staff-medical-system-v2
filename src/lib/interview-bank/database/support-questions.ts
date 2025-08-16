/**
 * サポート面談バンク - 質問データベース
 * VoiceDriveカテゴリごとの質問と退職面談質問を含む
 */

import { BankQuestion } from '../types';

// カテゴリ別サポート面談質問
export const supportQuestions: BankQuestion[] = [
  // === キャリア相談 (career) ===
  {
    id: 'sp_career_001',
    category: 'career_development',
    questionText: '現在のキャリアプランについて教えてください',
    questionType: 'text',
    tags: ['キャリア', 'サポート面談'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'career',
      subcategory: 'general'
    }
  },
  {
    id: 'sp_career_002',
    category: 'career_development',
    questionText: '目指している役職や資格はありますか？',
    questionType: 'text',
    tags: ['キャリア', '昇進', '資格'],
    priority: 1,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'career',
      subcategory: 'promotion'
    }
  },
  {
    id: 'sp_career_003',
    category: 'career_development',
    questionText: 'キャリアアップのために必要だと感じているスキルや経験は？',
    questionType: 'text',
    tags: ['キャリア', 'スキル'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'career',
      subcategory: 'skills'
    }
  },
  {
    id: 'sp_career_004',
    category: 'career_development',
    questionText: '現在の業務は将来のキャリアに役立っていると感じますか？',
    questionType: 'scale',
    options: ['とても役立っている', '役立っている', '普通', 'あまり役立っていない', '全く役立っていない'],
    tags: ['キャリア', '業務評価'],
    priority: 2,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'career'
    }
  },
  {
    id: 'sp_career_005',
    category: 'career_development',
    questionText: '部署異動や配置換えの希望はありますか？',
    questionType: 'text',
    tags: ['キャリア', '異動'],
    priority: 3,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'career',
      subcategory: 'transfer'
    }
  },

  // === 職場環境 (workplace) ===
  {
    id: 'sp_workplace_001',
    category: 'work_environment',
    questionText: '現在の職場環境で改善してほしい点は？',
    questionType: 'text',
    tags: ['職場環境', 'サポート面談'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'workplace'
    }
  },
  {
    id: 'sp_workplace_002',
    category: 'work_environment',
    questionText: '業務に必要な設備・資源は十分に提供されていますか？',
    questionType: 'scale',
    options: ['十分', 'ほぼ十分', '普通', 'やや不足', '不足'],
    tags: ['職場環境', '設備'],
    priority: 2,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'workplace'
    }
  },
  {
    id: 'sp_workplace_003',
    category: 'work_environment',
    questionText: '職場の安全性について懸念事項はありますか？',
    questionType: 'text',
    tags: ['職場環境', '安全'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'workplace',
      subcategory: 'safety'
    }
  },
  {
    id: 'sp_workplace_004',
    category: 'work_environment',
    questionText: '休憩時間や休憩場所は適切ですか？',
    questionType: 'scale',
    options: ['とても適切', '適切', '普通', 'やや不適切', '不適切'],
    tags: ['職場環境', '休憩'],
    priority: 3,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'workplace'
    }
  },

  // === 人間関係 (relationships) ===
  {
    id: 'sp_relation_001',
    category: 'team_dynamics',
    questionText: '上司とのコミュニケーションで困っていることは？',
    questionType: 'text',
    tags: ['人間関係', '上司', 'サポート面談'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'relationships',
      subcategory: 'supervisor'
    }
  },
  {
    id: 'sp_relation_002',
    category: 'team_dynamics',
    questionText: '同僚との関係性はいかがですか？',
    questionType: 'scale',
    options: ['とても良好', '良好', '普通', 'やや問題あり', '問題あり'],
    tags: ['人間関係', '同僚'],
    priority: 2,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'relationships',
      subcategory: 'colleagues'
    }
  },
  {
    id: 'sp_relation_003',
    category: 'team_dynamics',
    questionText: 'チーム内でのコミュニケーションは円滑ですか？',
    questionType: 'text',
    tags: ['人間関係', 'チーム'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'relationships'
    }
  },
  {
    id: 'sp_relation_004',
    category: 'team_dynamics',
    questionText: 'ハラスメントや不適切な対応を受けた経験は？',
    questionType: 'text',
    tags: ['人間関係', 'ハラスメント', '重要'],
    priority: 1,
    estimatedTime: 5,
    metadata: {
      supportCategory: 'relationships',
      subcategory: 'harassment',
      sensitive: true
    }
  },
  {
    id: 'sp_relation_005',
    category: 'team_dynamics',
    questionText: '他部署との連携で課題を感じることは？',
    questionType: 'text',
    tags: ['人間関係', '連携'],
    priority: 3,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'relationships',
      subcategory: 'interdepartmental'
    }
  },

  // === ワークライフバランス (worklife) ===
  {
    id: 'sp_worklife_001',
    category: 'worklife_balance',
    questionText: '現在の勤務時間・シフトについての満足度は？',
    questionType: 'scale',
    options: ['とても満足', '満足', '普通', 'やや不満', '不満'],
    tags: ['ワークライフ', 'シフト'],
    priority: 1,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'worklife'
    }
  },
  {
    id: 'sp_worklife_002',
    category: 'worklife_balance',
    questionText: '残業時間は適切な範囲内ですか？',
    questionType: 'text',
    tags: ['ワークライフ', '残業'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'worklife',
      subcategory: 'overtime'
    }
  },
  {
    id: 'sp_worklife_003',
    category: 'worklife_balance',
    questionText: '有給休暇は取得しやすい環境ですか？',
    questionType: 'scale',
    options: ['とても取得しやすい', '取得しやすい', '普通', '取得しにくい', 'とても取得しにくい'],
    tags: ['ワークライフ', '休暇'],
    priority: 2,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'worklife'
    }
  },
  {
    id: 'sp_worklife_004',
    category: 'worklife_balance',
    questionText: '家族や個人の時間は十分に確保できていますか？',
    questionType: 'text',
    tags: ['ワークライフ', 'プライベート'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'worklife'
    }
  },
  {
    id: 'sp_worklife_005',
    category: 'worklife_balance',
    questionText: '育児・介護との両立で困っていることは？',
    questionType: 'text',
    tags: ['ワークライフ', '育児', '介護'],
    priority: 1,
    estimatedTime: 4,
    metadata: {
      supportCategory: 'worklife',
      subcategory: 'family_care'
    }
  },

  // === 健康・メンタルヘルス (health) ===
  {
    id: 'sp_health_001',
    category: 'personal_wellbeing',
    questionText: '最近の体調はいかがですか？',
    questionType: 'scale',
    options: ['とても良い', '良い', '普通', 'やや不調', '不調'],
    tags: ['健康', 'メンタルヘルス'],
    priority: 1,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'health'
    }
  },
  {
    id: 'sp_health_002',
    category: 'personal_wellbeing',
    questionText: 'ストレスを感じる頻度はどのくらいですか？',
    questionType: 'scale',
    options: ['ほとんどない', '月に数回', '週に数回', 'ほぼ毎日', '常に'],
    tags: ['健康', 'ストレス'],
    priority: 1,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'health',
      subcategory: 'stress'
    }
  },
  {
    id: 'sp_health_003',
    category: 'personal_wellbeing',
    questionText: 'ストレスの主な原因は何ですか？',
    questionType: 'text',
    tags: ['健康', 'ストレス'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'health',
      subcategory: 'stress'
    }
  },
  {
    id: 'sp_health_004',
    category: 'personal_wellbeing',
    questionText: '睡眠は十分に取れていますか？',
    questionType: 'scale',
    options: ['十分', 'ほぼ十分', '普通', 'やや不足', '不足'],
    tags: ['健康', '睡眠'],
    priority: 2,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'health'
    }
  },
  {
    id: 'sp_health_005',
    category: 'personal_wellbeing',
    questionText: '業務による身体的負担はありますか？',
    questionType: 'text',
    tags: ['健康', '身体的負担'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'health',
      subcategory: 'physical'
    }
  },

  // === スキル・研修 (skills) ===
  {
    id: 'sp_skills_001',
    category: 'skill_development',
    questionText: '現在の業務で不足を感じるスキルは？',
    questionType: 'text',
    tags: ['スキル', '研修'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'skills'
    }
  },
  {
    id: 'sp_skills_002',
    category: 'skill_development',
    questionText: '受けたい研修や勉強会はありますか？',
    questionType: 'text',
    tags: ['スキル', '研修'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'skills',
      subcategory: 'training'
    }
  },
  {
    id: 'sp_skills_003',
    category: 'skill_development',
    questionText: '教育・研修の機会は十分に提供されていますか？',
    questionType: 'scale',
    options: ['十分', 'ほぼ十分', '普通', 'やや不足', '不足'],
    tags: ['スキル', '研修'],
    priority: 2,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'skills'
    }
  },

  // === 評価・処遇 (evaluation) ===
  {
    id: 'sp_eval_001',
    category: 'feedback_recognition',
    questionText: '現在の評価制度についてどう思いますか？',
    questionType: 'text',
    tags: ['評価', '処遇'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'evaluation'
    }
  },
  {
    id: 'sp_eval_002',
    category: 'feedback_recognition',
    questionText: '自分の貢献が適切に評価されていると感じますか？',
    questionType: 'scale',
    options: ['とても感じる', '感じる', '普通', 'あまり感じない', '全く感じない'],
    tags: ['評価', '承認'],
    priority: 1,
    estimatedTime: 2,
    metadata: {
      supportCategory: 'evaluation'
    }
  },
  {
    id: 'sp_eval_003',
    category: 'feedback_recognition',
    questionText: '給与・待遇について改善してほしい点は？',
    questionType: 'text',
    tags: ['評価', '給与'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      supportCategory: 'evaluation',
      subcategory: 'compensation'
    }
  }
];

// カテゴリ別の質問IDマッピング
export const supportQuestionsByCategory = {
  career: [
    'sp_career_001', 'sp_career_002', 'sp_career_003', 
    'sp_career_004', 'sp_career_005'
  ],
  workplace: [
    'sp_workplace_001', 'sp_workplace_002', 'sp_workplace_003', 
    'sp_workplace_004'
  ],
  relationships: [
    'sp_relation_001', 'sp_relation_002', 'sp_relation_003',
    'sp_relation_004', 'sp_relation_005'
  ],
  worklife: [
    'sp_worklife_001', 'sp_worklife_002', 'sp_worklife_003',
    'sp_worklife_004', 'sp_worklife_005'
  ],
  health: [
    'sp_health_001', 'sp_health_002', 'sp_health_003',
    'sp_health_004', 'sp_health_005'
  ],
  skills: [
    'sp_skills_001', 'sp_skills_002', 'sp_skills_003'
  ],
  evaluation: [
    'sp_eval_001', 'sp_eval_002', 'sp_eval_003'
  ],
  other: [] // その他のカテゴリは個別対応
};

// 緊急度別の質問優先度
export const questionPriorityByUrgency = {
  urgent: {
    priorityThreshold: 1,
    timeLimit: 30,
    focusCategories: ['health', 'relationships', 'workplace']
  },
  high: {
    priorityThreshold: 2,
    timeLimit: 45,
    focusCategories: ['worklife', 'workplace', 'career']
  },
  medium: {
    priorityThreshold: 3,
    timeLimit: 60,
    focusCategories: ['skills', 'evaluation', 'career']
  },
  low: {
    priorityThreshold: 3,
    timeLimit: 60,
    focusCategories: ['career', 'skills', 'evaluation']
  }
};