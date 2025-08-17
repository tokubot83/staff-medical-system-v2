// 共通質問データベース - v4/v5シートから抽出した全施設・全職種共通の質問
// 特に「職員の現状確認」セクションで使用される質問群

import { InterviewQuestion, QuestionType } from '../types';

export const commonStatusQuestions: InterviewQuestion[] = [
  // モチベーションと満足度
  {
    id: 'motivation_current',
    content: '現在のモチベーションはどの程度ですか？',
    type: 'scale' as QuestionType,
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 1,
    minDuration: 15,
    tags: ['モチベーション', '必須'],
    options: [
      { value: '5', label: '非常に高い', score: 5 },
      { value: '4', label: '高い', score: 4 },
      { value: '3', label: '普通', score: 3 },
      { value: '2', label: '低い', score: 2 },
      { value: '1', label: '非常に低い', score: 1 }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'relationship_quality',
    content: '職場の人間関係はどうですか？',
    type: 'scale' as QuestionType,
    category: 'team_collaboration',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 1,
    minDuration: 15,
    tags: ['人間関係', '必須'],
    options: [
      { value: '5', label: '非常に良好', score: 5 },
      { value: '4', label: '良好', score: 4 },
      { value: '3', label: '普通', score: 3 },
      { value: '2', label: 'やや問題あり', score: 2 },
      { value: '1', label: '問題が多い', score: 1 }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'supervisor_support',
    content: '上司からのサポートは十分ですか？',
    type: 'scale' as QuestionType,
    category: 'support_needs',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 1,
    minDuration: 15,
    tags: ['サポート', '上司'],
    options: [
      { value: '5', label: '非常に充実', score: 5 },
      { value: '4', label: '充実', score: 4 },
      { value: '3', label: '普通', score: 3 },
      { value: '2', label: '不足', score: 2 },
      { value: '1', label: '非常に不足', score: 1 }
    ],
    scoreWeight: 1.5
  },
  {
    id: 'growth_opportunity',
    content: '成長機会は十分にありますか？',
    type: 'scale' as QuestionType,
    category: 'growth_development',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 1,
    minDuration: 15,
    tags: ['成長', 'キャリア'],
    options: [
      { value: '5', label: '非常に豊富', score: 5 },
      { value: '4', label: '豊富', score: 4 },
      { value: '3', label: '普通', score: 3 },
      { value: '2', label: '少ない', score: 2 },
      { value: '1', label: '非常に少ない', score: 1 }
    ],
    scoreWeight: 1.5
  },
  {
    id: 'job_satisfaction',
    content: '仕事のやりがいを感じていますか？',
    type: 'scale' as QuestionType,
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 1,
    minDuration: 15,
    tags: ['やりがい', '満足度'],
    options: [
      { value: '5', label: '非常に感じる', score: 5 },
      { value: '4', label: '感じる', score: 4 },
      { value: '3', label: '普通', score: 3 },
      { value: '2', label: 'あまり感じない', score: 2 },
      { value: '1', label: '全く感じない', score: 1 }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'evaluation_fairness',
    content: '評価の公正性についてどう感じていますか？',
    type: 'scale' as QuestionType,
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 2,
    minDuration: 30,
    tags: ['評価', '公正性'],
    options: [
      { value: '5', label: '非常に公正', score: 5 },
      { value: '4', label: '公正', score: 4 },
      { value: '3', label: '普通', score: 3 },
      { value: '2', label: 'やや不公正', score: 2 },
      { value: '1', label: '不公正', score: 1 }
    ],
    scoreWeight: 1.3
  },

  // 健康・ストレス・エンゲージメント
  {
    id: 'health_status',
    content: '現在の健康状態はいかがですか？',
    type: 'scale' as QuestionType,
    category: 'stress_health',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 1,
    minDuration: 15,
    tags: ['健康', '必須'],
    options: [
      { value: '5', label: '非常に良好', score: 5 },
      { value: '4', label: '良好', score: 4 },
      { value: '3', label: '普通', score: 3 },
      { value: '2', label: 'やや不調', score: 2 },
      { value: '1', label: '不調', score: 1 }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'stress_level',
    content: '現在のストレスレベルはどの程度ですか？',
    type: 'scale' as QuestionType,
    category: 'stress_health',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 1,
    minDuration: 15,
    tags: ['ストレス', '必須'],
    options: [
      { value: '5', label: '非常に低い', score: 5 },
      { value: '4', label: '低い', score: 4 },
      { value: '3', label: '普通', score: 3 },
      { value: '2', label: '高い', score: 2 },
      { value: '1', label: '非常に高い', score: 1 }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'continuation_intention',
    content: '3年後もこの職場で働き続けたいと思いますか？',
    type: 'scale' as QuestionType,
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 1,
    minDuration: 15,
    tags: ['継続意向', 'エンゲージメント', '重要'],
    options: [
      { value: '5', label: 'ぜひ続けたい', score: 5 },
      { value: '4', label: '続けたい', score: 4 },
      { value: '3', label: 'わからない', score: 3 },
      { value: '2', label: '転職を検討中', score: 2 },
      { value: '1', label: '転職活動中', score: 1 }
    ],
    scoreWeight: 2.5
  },
  {
    id: 'workplace_recommendation',
    content: '他の人にこの職場を勧めることができますか？',
    type: 'scale' as QuestionType,
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 1,
    minDuration: 15,
    tags: ['推奨度', 'エンゲージメント', '重要'],
    options: [
      { value: '5', label: '積極的に勧める', score: 5 },
      { value: '4', label: '勧める', score: 4 },
      { value: '3', label: 'どちらでもない', score: 3 },
      { value: '2', label: 'あまり勧めない', score: 2 },
      { value: '1', label: '勧めない', score: 1 }
    ],
    scoreWeight: 2.0
  },

  // ストレス要因チェック（チェックボックス型）
  {
    id: 'stress_factors',
    content: '現在ストレスを感じている要因は何ですか？（複数選択可）',
    type: 'checkbox' as QuestionType,
    category: 'stress_health',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 2,
    minDuration: 30,
    tags: ['ストレス要因', '詳細'],
    options: [
      { value: 'workload', label: '業務負荷' },
      { value: 'relations', label: '人間関係' },
      { value: 'skill', label: 'スキル不足' },
      { value: 'career', label: 'キャリア不安' },
      { value: 'evaluation', label: '評価への不満' },
      { value: 'communication', label: 'コミュニケーション不足' },
      { value: 'environment', label: '職場環境' },
      { value: 'balance', label: 'ワークライフバランス' }
    ]
  },

  // テキスト型の詳細質問（30分以上の面談で使用）
  {
    id: 'current_challenges',
    content: '現在直面している課題や困難は何ですか？',
    type: 'textarea' as QuestionType,
    category: 'support_needs',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 2,
    minDuration: 30,
    tags: ['課題', '詳細'],
    placeholder: '業務上の課題、人間関係、スキル面での課題など、具体的にお聞かせください'
  },
  {
    id: 'support_needs',
    content: '組織や上司からどのようなサポートが必要ですか？',
    type: 'textarea' as QuestionType,
    category: 'support_needs',
    section: 'current_status',
    sectionId: 'staff_status',
    priority: 2,
    minDuration: 30,
    tags: ['サポート', '要望'],
    placeholder: '研修機会、メンタリング、業務量調整など、必要なサポートをお聞かせください'
  }
];

// キャリア開発・課題セクションの共通質問
export const commonCareerQuestions: InterviewQuestion[] = [
  {
    id: 'career_vision_1year',
    content: '1年後の目標は何ですか？',
    type: 'textarea' as QuestionType,
    category: 'career_planning',
    section: 'career_development',
    sectionId: 'career_development',
    priority: 1,
    minDuration: 15,
    tags: ['キャリア', '目標'],
    placeholder: '1年後に達成したいこと、身につけたいスキルなど',
    conditions: [
      {
        type: 'experienceLevel',
        values: ['new', 'junior'],
        operator: 'equals'
      }
    ]
  },
  {
    id: 'career_vision_3years',
    content: '今後3年間のキャリアビジョンは何ですか？',
    type: 'textarea' as QuestionType,
    category: 'career_planning',
    section: 'career_development',
    sectionId: 'career_development',
    priority: 1,
    minDuration: 30,
    tags: ['キャリア', 'ビジョン'],
    placeholder: '目指す職種・役職、身につけたいスキル、挑戦したい業務など',
    conditions: [
      {
        type: 'experienceLevel',
        values: ['midlevel', 'veteran', 'leader'],
        operator: 'equals'
      }
    ]
  },
  {
    id: 'skill_development_needs',
    content: '特に伸ばしたいスキルや能力は何ですか？',
    type: 'textarea' as QuestionType,
    category: 'growth_development',
    section: 'career_development',
    sectionId: 'career_development',
    priority: 1,
    minDuration: 15,
    tags: ['スキル', '成長'],
    placeholder: '技術的スキル、コミュニケーション能力、マネジメントスキルなど'
  },
  {
    id: 'career_support_type',
    content: '必要なキャリア支援は何ですか？（優先順位の高いもの2-3個選択）',
    type: 'checkbox' as QuestionType,
    category: 'career_planning',
    section: 'career_development',
    sectionId: 'career_development',
    priority: 2,
    minDuration: 30,
    tags: ['キャリア支援', '要望'],
    options: [
      { value: 'training', label: '研修・教育機会' },
      { value: 'challenge', label: '新しい挑戦機会' },
      { value: 'mentor', label: 'メンター・指導' },
      { value: 'career_consultation', label: 'キャリア相談' },
      { value: 'workload', label: '業務量調整' },
      { value: 'team_improvement', label: 'チーム環境改善' },
      { value: 'qualification', label: '資格取得支援' },
      { value: 'rotation', label: '部署ローテーション' }
    ]
  },
  {
    id: 'organization_request',
    content: '組織・職場への要望はありますか？',
    type: 'textarea' as QuestionType,
    category: 'support_needs',
    section: 'career_development',
    sectionId: 'career_development',
    priority: 2,
    minDuration: 30,
    tags: ['要望', '改善'],
    placeholder: '制度、環境、文化など改善してほしい点'
  }
];

// アクションプランセクションの共通質問
export const commonActionPlanQuestions: InterviewQuestion[] = [
  {
    id: 'next_goals',
    content: '次回面談までの具体的目標（1-2個）',
    type: 'textarea' as QuestionType,
    category: 'goal_setting',
    section: 'action_plan',
    sectionId: 'action_plan',
    priority: 1,
    minDuration: 15,
    tags: ['目標', '必須'],
    placeholder: '達成可能な具体的目標を記入'
  },
  {
    id: 'support_content',
    content: '上司・組織からのサポート内容',
    type: 'textarea' as QuestionType,
    category: 'support_needs',
    section: 'action_plan',
    sectionId: 'action_plan',
    priority: 1,
    minDuration: 15,
    tags: ['サポート', '計画'],
    placeholder: '具体的なサポート内容、実施時期など'
  },
  {
    id: 'next_interview_date',
    content: '次回面談予定日',
    type: 'text' as QuestionType,
    category: 'goal_setting',
    section: 'action_plan',
    sectionId: 'action_plan',
    priority: 2,
    minDuration: 30,
    tags: ['スケジュール'],
    placeholder: '○月○日頃'
  },
  {
    id: 'follow_method',
    content: 'フォロー方法',
    type: 'text' as QuestionType,
    category: 'support_needs',
    section: 'action_plan',
    sectionId: 'action_plan',
    priority: 2,
    minDuration: 30,
    tags: ['フォロー'],
    placeholder: '月次1on1、週次チェックインなど'
  }
];

// 面談者所見セクションの共通質問
export const commonInterviewerNotesQuestions: InterviewQuestion[] = [
  {
    id: 'growth_evaluation',
    content: '成長度評価',
    type: 'radio' as QuestionType,
    category: 'growth_development',
    section: 'feedback_reflection',
    sectionId: 'interviewer_notes',
    priority: 1,
    minDuration: 30,
    tags: ['評価', '成長'],
    options: [
      { value: 'excellent', label: '期待以上' },
      { value: 'good', label: '順調' },
      { value: 'needs_support', label: '要支援' }
    ]
  },
  {
    id: 'potential_evaluation',
    content: 'ポテンシャル',
    type: 'radio' as QuestionType,
    category: 'growth_development',
    section: 'feedback_reflection',
    sectionId: 'interviewer_notes',
    priority: 1,
    minDuration: 30,
    tags: ['評価', 'ポテンシャル'],
    options: [
      { value: 'high', label: '高' },
      { value: 'medium', label: '中' },
      { value: 'low', label: '低' }
    ]
  },
  {
    id: 'turnover_risk',
    content: '離職リスク',
    type: 'radio' as QuestionType,
    category: 'motivation_engagement',
    section: 'feedback_reflection',
    sectionId: 'interviewer_notes',
    priority: 1,
    minDuration: 30,
    tags: ['リスク', '離職'],
    options: [
      { value: 'low', label: '低' },
      { value: 'medium', label: '中' },
      { value: 'high', label: '高' }
    ]
  },
  {
    id: 'overall_comments',
    content: '総合所見',
    type: 'textarea' as QuestionType,
    category: 'feedback_reflection',
    section: 'feedback_reflection',
    sectionId: 'interviewer_notes',
    priority: 1,
    minDuration: 30,
    tags: ['所見', '総合評価'],
    placeholder: '総合所見、今後の育成方針、特記事項など'
  }
];

// 全共通質問をエクスポート
export const allCommonQuestions: InterviewQuestion[] = [
  ...commonStatusQuestions,
  ...commonCareerQuestions,
  ...commonActionPlanQuestions,
  ...commonInterviewerNotesQuestions
];