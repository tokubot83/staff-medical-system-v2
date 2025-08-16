// 定期面談バンク - 質問データ初期登録
// 既存の面談シートから抽出した全質問をカテゴリー別に整理

import { InterviewQuestion, QuestionCategory, SectionType } from '../types';

// === 動機タイプ判定質問 ===
export const motivationQuestions: Partial<InterviewQuestion>[] = [
  {
    content: '仕事で最もやりがいを感じるのはどのような時ですか？',
    type: 'radio',
    category: 'motivation_engagement',
    section: 'motivation_assessment',
    priority: 1,
    minDuration: 15,
    tags: ['動機タイプ', '必須', '全職種'],
    options: [
      { value: 'growth', label: '新しいスキルを身につけた時', motivationType: 'growth' },
      { value: 'recognition', label: '上司や同僚に褒められた時', motivationType: 'recognition' },
      { value: 'stability', label: '安定した環境で確実に成果を出せた時', motivationType: 'stability' },
      { value: 'teamwork', label: 'チームで協力して目標を達成した時', motivationType: 'teamwork' },
      { value: 'efficiency', label: '無駄な作業を改善・効率化できた時', motivationType: 'efficiency' },
      { value: 'compensation', label: '良い待遇で働けている時', motivationType: 'compensation' },
      { value: 'creativity', label: '自分らしい方法で創造的な成果を出せた時', motivationType: 'creativity' }
    ]
  }
];

// === 動機タイプ別フォローアップ質問 ===
export const motivationFollowUpQuestions: Record<string, Partial<InterviewQuestion>[]> = {
  growth: [
    {
      content: '最近学んだ新しいスキルや知識について教えてください',
      type: 'textarea',
      category: 'growth_development',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 15,
      placeholder: '具体的な内容と学習方法を記入',
      tags: ['成長型', 'スキル開発']
    },
    {
      content: '今後挑戦したい業務や習得したいスキルはありますか？',
      type: 'textarea',
      category: 'career_planning',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 30,
      placeholder: '目標とその理由を記入',
      tags: ['成長型', 'キャリア']
    },
    {
      content: '自己成長のために取り組んでいることはありますか？',
      type: 'textarea',
      category: 'growth_development',
      section: 'motivation_assessment',
      priority: 3,
      minDuration: 45,
      placeholder: '日常的な学習活動や自己啓発について',
      tags: ['成長型', '自己啓発']
    }
  ],
  recognition: [
    {
      content: '最近の業務で評価されたことや褒められたことを教えてください',
      type: 'textarea',
      category: 'motivation_engagement',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 15,
      placeholder: '具体的な事例と感じたことを記入',
      tags: ['承認型', '評価']
    },
    {
      content: '自分の成果をもっと認めてもらいたいと感じることはありますか？',
      type: 'textarea',
      category: 'motivation_engagement',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 30,
      placeholder: '認めてほしい成果や貢献について',
      tags: ['承認型', '評価']
    },
    {
      content: '評価制度について改善してほしい点はありますか？',
      type: 'textarea',
      category: 'innovation_improvement',
      section: 'motivation_assessment',
      priority: 3,
      minDuration: 45,
      placeholder: '現状の課題と改善提案',
      tags: ['承認型', '制度改善']
    }
  ],
  stability: [
    {
      content: '現在の業務環境で安心して働けていますか？',
      type: 'radio',
      category: 'workplace_adaptation',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 15,
      options: [
        { value: 'very_secure', label: 'とても安心' },
        { value: 'secure', label: '安心' },
        { value: 'neutral', label: '普通' },
        { value: 'insecure', label: '不安' },
        { value: 'very_insecure', label: 'とても不安' }
      ],
      tags: ['安定型', '職場環境']
    },
    {
      content: '業務の変更や新しい取り組みに対する不安はありますか？',
      type: 'textarea',
      category: 'stress_health',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 30,
      placeholder: '具体的な不安要素について',
      tags: ['安定型', 'ストレス']
    },
    {
      content: 'より安定した環境で働くために必要なサポートは何ですか？',
      type: 'textarea',
      category: 'support_needs',
      section: 'motivation_assessment',
      priority: 3,
      minDuration: 45,
      placeholder: '必要な支援やリソースについて',
      tags: ['安定型', 'サポート']
    }
  ],
  teamwork: [
    {
      content: 'チーム内での協力関係はうまくいっていますか？',
      type: 'scale',
      category: 'team_collaboration',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 15,
      tags: ['チーム型', '人間関係']
    },
    {
      content: '同僚との関係で改善したい点はありますか？',
      type: 'textarea',
      category: 'team_collaboration',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 30,
      placeholder: '具体的な改善点と理想の関係性',
      tags: ['チーム型', '人間関係']
    },
    {
      content: 'チームワークを向上させるための提案はありますか？',
      type: 'textarea',
      category: 'innovation_improvement',
      section: 'motivation_assessment',
      priority: 3,
      minDuration: 45,
      placeholder: '具体的な改善提案',
      tags: ['チーム型', 'チーム改善']
    }
  ],
  efficiency: [
    {
      content: '現在の業務で非効率だと感じる部分はありますか？',
      type: 'textarea',
      category: 'innovation_improvement',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 15,
      placeholder: '具体的な業務と改善案',
      tags: ['効率型', '業務改善']
    },
    {
      content: '業務改善のアイデアがあれば教えてください',
      type: 'textarea',
      category: 'innovation_improvement',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 30,
      placeholder: '効率化のための具体的な提案',
      tags: ['効率型', '業務改善']
    },
    {
      content: 'DXやシステム化で解決したい課題はありますか？',
      type: 'textarea',
      category: 'innovation_improvement',
      section: 'motivation_assessment',
      priority: 3,
      minDuration: 45,
      placeholder: 'デジタル化で改善できる業務について',
      tags: ['効率型', 'DX']
    }
  ],
  compensation: [
    {
      content: '現在の待遇について満足している点と改善してほしい点を教えてください',
      type: 'textarea',
      category: 'motivation_engagement',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 15,
      placeholder: '給与、福利厚生、勤務条件などについて',
      tags: ['待遇型', '報酬']
    },
    {
      content: '福利厚生で追加してほしいものはありますか？',
      type: 'textarea',
      category: 'support_needs',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 30,
      placeholder: '具体的な要望と理由',
      tags: ['待遇型', '福利厚生']
    },
    {
      content: 'キャリアアップと報酬の関係について、どのようにお考えですか？',
      type: 'textarea',
      category: 'career_planning',
      section: 'motivation_assessment',
      priority: 3,
      minDuration: 45,
      placeholder: '理想的な評価と報酬の関係',
      tags: ['待遇型', 'キャリア']
    }
  ],
  creativity: [
    {
      content: '自分らしい働き方ができていると感じますか？',
      type: 'scale',
      category: 'workplace_adaptation',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 15,
      tags: ['創造型', '働き方']
    },
    {
      content: '業務でもっと創造性を発揮したい部分はありますか？',
      type: 'textarea',
      category: 'innovation_improvement',
      section: 'motivation_assessment',
      priority: 2,
      minDuration: 30,
      placeholder: '創造的なアプローチができる業務領域',
      tags: ['創造型', 'イノベーション']
    },
    {
      content: '裁量権を増やしてほしい業務領域はありますか？',
      type: 'textarea',
      category: 'support_needs',
      section: 'motivation_assessment',
      priority: 3,
      minDuration: 45,
      placeholder: '自律的に進めたい業務について',
      tags: ['創造型', '裁量権']
    }
  ]
};

// === 現状確認の基本質問（経験年数別）===
export const currentStatusQuestions: Record<string, Partial<InterviewQuestion>[]> = {
  new: [ // 新人（1年目）
    {
      content: '最近の業務で良かったこと・できるようになったこと',
      type: 'textarea',
      category: 'workplace_adaptation',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: '簡潔に記入',
      tags: ['新人', '適応', '成長']
    },
    {
      content: '困っていること・不安なこと',
      type: 'textarea',
      category: 'stress_health',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: '簡潔に記入',
      tags: ['新人', 'ストレス', 'サポート']
    },
    {
      content: '現在の適応状況',
      type: 'radio',
      category: 'workplace_adaptation',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      options: [
        { value: 'good', label: '良好' },
        { value: 'normal', label: '普通' },
        { value: 'concern', label: '要支援' }
      ],
      tags: ['新人', '適応評価']
    },
    {
      content: 'プリセプターとの関係・指導体制',
      type: 'textarea',
      category: 'team_collaboration',
      section: 'current_status',
      priority: 2,
      minDuration: 30,
      placeholder: '指導体制への満足度や改善点',
      tags: ['新人', '教育', '指導']
    },
    {
      content: '理想と現実のギャップについて',
      type: 'textarea',
      category: 'workplace_adaptation',
      section: 'current_status',
      priority: 3,
      minDuration: 45,
      placeholder: 'リアリティショックとその対処',
      tags: ['新人', 'リアリティショック']
    },
    {
      content: '夜勤への適応状況',
      type: 'radio',
      category: 'stress_health',
      section: 'current_status',
      priority: 2,
      minDuration: 30,
      options: [
        { value: 'well_adapted', label: '良好に適応' },
        { value: 'adapting', label: '適応中' },
        { value: 'struggling', label: '困難あり' },
        { value: 'not_started', label: '未経験' }
      ],
      tags: ['新人', '夜勤', '健康']
    }
  ],
  junior: [ // 若手（2～3年）
    {
      content: '成長を感じること・できるようになったこと',
      type: 'textarea',
      category: 'growth_development',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: '具体的なスキルや業務について',
      tags: ['若手', '成長', 'スキル']
    },
    {
      content: '現在の課題・改善したい点',
      type: 'textarea',
      category: 'skill_assessment',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: '技術面・対人面での課題',
      tags: ['若手', '課題', '改善']
    },
    {
      content: 'チーム内での役割と貢献',
      type: 'textarea',
      category: 'team_collaboration',
      section: 'current_status',
      priority: 2,
      minDuration: 30,
      placeholder: '担当業務やチームへの貢献',
      tags: ['若手', 'チーム', '役割']
    },
    {
      content: '後輩指導の経験と課題',
      type: 'textarea',
      category: 'leadership_management',
      section: 'current_status',
      priority: 3,
      minDuration: 45,
      placeholder: 'プリセプター経験や指導での悩み',
      tags: ['若手', '指導', 'リーダーシップ']
    }
  ],
  midlevel: [ // 中堅（4～10年）
    {
      content: '現在の専門分野・強み',
      type: 'textarea',
      category: 'skill_assessment',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: '専門性や得意分野について',
      tags: ['中堅', '専門性', '強み']
    },
    {
      content: 'リーダーシップ発揮の場面',
      type: 'textarea',
      category: 'leadership_management',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: 'チームリーダーやプロジェクトでの役割',
      tags: ['中堅', 'リーダーシップ']
    },
    {
      content: '組織への貢献と影響力',
      type: 'textarea',
      category: 'team_collaboration',
      section: 'current_status',
      priority: 2,
      minDuration: 30,
      placeholder: '委員会活動や改善活動での貢献',
      tags: ['中堅', '組織貢献']
    },
    {
      content: '後進育成の取り組み',
      type: 'textarea',
      category: 'knowledge_transfer',
      section: 'current_status',
      priority: 2,
      minDuration: 30,
      placeholder: '教育・指導での工夫や成果',
      tags: ['中堅', '教育', '育成']
    },
    {
      content: '専門分野での研究・発表活動',
      type: 'textarea',
      category: 'innovation_improvement',
      section: 'current_status',
      priority: 3,
      minDuration: 45,
      placeholder: '学会発表、論文、院内研修など',
      tags: ['中堅', '研究', '専門活動']
    }
  ],
  veteran: [ // ベテラン（11年以上）
    {
      content: '専門知識・技術の活用と伝承',
      type: 'textarea',
      category: 'knowledge_transfer',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: '知識・技術の活用と後進への伝承方法',
      tags: ['ベテラン', '知識伝承', '専門性']
    },
    {
      content: '組織文化形成への貢献',
      type: 'textarea',
      category: 'leadership_management',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: '価値観の浸透や文化づくりへの貢献',
      tags: ['ベテラン', '組織文化']
    },
    {
      content: '次世代リーダー育成の取り組み',
      type: 'textarea',
      category: 'knowledge_transfer',
      section: 'current_status',
      priority: 2,
      minDuration: 30,
      placeholder: 'サクセッションプランや育成計画',
      tags: ['ベテラン', 'リーダー育成']
    },
    {
      content: '院外活動・社会貢献',
      type: 'textarea',
      category: 'innovation_improvement',
      section: 'current_status',
      priority: 3,
      minDuration: 45,
      placeholder: '学会活動、地域貢献、業界への影響',
      tags: ['ベテラン', '社会貢献']
    }
  ],
  leader: [ // リーダー・管理職
    {
      content: 'チーム運営の現状と課題',
      type: 'textarea',
      category: 'leadership_management',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: 'スタッフ管理、業務調整での課題',
      tags: ['管理職', 'マネジメント']
    },
    {
      content: '戦略的思考と意思決定',
      type: 'textarea',
      category: 'leadership_management',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: '部署方針や重要な意思決定について',
      tags: ['管理職', '戦略', '意思決定']
    },
    {
      content: '変革推進の取り組み',
      type: 'textarea',
      category: 'innovation_improvement',
      section: 'current_status',
      priority: 2,
      minDuration: 30,
      placeholder: '業務改善や新規プロジェクトの推進',
      tags: ['管理職', '変革', 'イノベーション']
    },
    {
      content: '経営視点での貢献',
      type: 'textarea',
      category: 'leadership_management',
      section: 'current_status',
      priority: 3,
      minDuration: 45,
      placeholder: '収益改善、コスト削減、品質向上など',
      tags: ['管理職', '経営', '成果']
    }
  ]
};

// === スキル評価マトリックス質問 ===
export const skillEvaluationQuestions: Record<string, Partial<InterviewQuestion>[]> = {
  new_nurse: [
    {
      content: '職場適応',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['新人', '看護師', '評価']
    },
    {
      content: '基本看護技術',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['新人', '看護師', '技術']
    },
    {
      content: 'チームワーク',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['新人', '看護師', 'チーム']
    },
    {
      content: '患者対応',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['新人', '看護師', '患者']
    },
    {
      content: '学習意欲',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 2,
      minDuration: 30,
      tags: ['新人', '看護師', '学習']
    },
    {
      content: 'コミュニケーション',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 2,
      minDuration: 30,
      tags: ['新人', '看護師', 'コミュニケーション']
    },
    {
      content: '時間管理',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 3,
      minDuration: 45,
      tags: ['新人', '看護師', '時間管理']
    },
    {
      content: 'ルール遵守',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 3,
      minDuration: 45,
      tags: ['新人', '看護師', 'コンプライアンス']
    }
  ],
  junior_nurse: [
    {
      content: '看護技術・スキル',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['若手', '看護師', '技術']
    },
    {
      content: 'アセスメント能力',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['若手', '看護師', 'アセスメント']
    },
    {
      content: '患者対応・コミュニケーション',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['若手', '看護師', 'コミュニケーション']
    },
    {
      content: '多職種連携',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 2,
      minDuration: 30,
      tags: ['若手', '看護師', '連携']
    },
    {
      content: '問題解決能力',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 2,
      minDuration: 30,
      tags: ['若手', '看護師', '問題解決']
    },
    {
      content: '主体性・積極性',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 3,
      minDuration: 45,
      tags: ['若手', '看護師', '主体性']
    }
  ],
  midlevel_nurse: [
    {
      content: 'リーダーシップ',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['中堅', '看護師', 'リーダーシップ']
    },
    {
      content: 'メンタリング能力',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['中堅', '看護師', 'メンタリング']
    },
    {
      content: '専門知識・技術',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['中堅', '看護師', '専門性']
    },
    {
      content: '問題解決力',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 2,
      minDuration: 30,
      tags: ['中堅', '看護師', '問題解決']
    },
    {
      content: '変革推進力',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 2,
      minDuration: 30,
      tags: ['中堅', '看護師', '変革']
    },
    {
      content: '組織理解・貢献',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 3,
      minDuration: 45,
      tags: ['中堅', '看護師', '組織貢献']
    },
    {
      content: '教育・指導力',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 3,
      minDuration: 45,
      tags: ['中堅', '看護師', '教育']
    },
    {
      content: 'チーム調整力',
      type: 'scale',
      category: 'skill_assessment',
      section: 'skill_evaluation',
      priority: 3,
      minDuration: 45,
      tags: ['中堅', '看護師', 'チーム調整']
    }
  ]
};

// === 満足度・エンゲージメント評価 ===
export const satisfactionQuestions: Partial<InterviewQuestion>[] = [
  {
    content: '現在のモチベーション',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['満足度', 'モチベーション']
  },
  {
    content: '給与・待遇',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    tags: ['満足度', '待遇']
  },
  {
    content: '勤務シフト',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    tags: ['満足度', '勤務条件']
  },
  {
    content: '人間関係',
    type: 'scale',
    category: 'team_collaboration',
    section: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['満足度', '人間関係']
  },
  {
    content: '上司のサポート',
    type: 'scale',
    category: 'team_collaboration',
    section: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    tags: ['満足度', 'サポート']
  },
  {
    content: '成長機会',
    type: 'scale',
    category: 'growth_development',
    section: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['満足度', '成長']
  },
  {
    content: '職場環境',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    tags: ['満足度', '環境']
  },
  {
    content: '仕事のやりがい',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['満足度', 'やりがい']
  },
  {
    content: '評価の公正性',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'health_wellbeing',
    priority: 3,
    minDuration: 45,
    tags: ['満足度', '評価']
  }
];

// === 健康・ストレス評価 ===
export const healthStressQuestions: Partial<InterviewQuestion>[] = [
  {
    content: '健康状態',
    type: 'scale',
    category: 'stress_health',
    section: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['健康', '状態']
  },
  {
    content: 'ストレスレベル',
    type: 'scale',
    category: 'stress_health',
    section: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['健康', 'ストレス']
  },
  {
    content: '睡眠の質',
    type: 'scale',
    category: 'stress_health',
    section: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    tags: ['健康', '睡眠']
  },
  {
    content: '3年後の継続意向',
    type: 'radio',
    category: 'career_planning',
    section: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    options: [
      { value: 'definitely_yes', label: '確実に継続' },
      { value: 'probably_yes', label: 'おそらく継続' },
      { value: 'uncertain', label: '不明' },
      { value: 'probably_no', label: 'おそらく退職' },
      { value: 'definitely_no', label: '確実に退職' }
    ],
    tags: ['継続意向', 'キャリア']
  },
  {
    content: '職場推奨度',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'health_wellbeing',
    priority: 3,
    minDuration: 45,
    tags: ['推奨度', 'エンゲージメント']
  }
];

// === ストレス要因チェックリスト ===
export const stressFactorQuestions: Partial<InterviewQuestion>[] = [
  {
    content: 'ストレス要因',
    type: 'checkbox',
    category: 'stress_health',
    section: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    options: [
      { value: 'workload', label: '業務負荷' },
      { value: 'relationships', label: '人間関係' },
      { value: 'overtime', label: '残業時間' },
      { value: 'work_life_balance', label: '家庭との両立' },
      { value: 'skill_shortage', label: 'スキル不足' },
      { value: 'career_anxiety', label: 'キャリア不安' },
      { value: 'shift_work', label: 'シフト勤務' },
      { value: 'responsibility', label: '責任の重さ' }
    ],
    tags: ['ストレス', '要因分析']
  },
  {
    content: '管理職特有のストレス要因',
    type: 'checkbox',
    category: 'stress_health',
    section: 'health_wellbeing',
    priority: 3,
    minDuration: 45,
    options: [
      { value: 'staff_management', label: 'スタッフ管理' },
      { value: 'budget_responsibility', label: '予算・経営責任' },
      { value: 'decision_pressure', label: '意思決定の重圧' },
      { value: 'hr_conflicts', label: '人事・対立処理' },
      { value: 'performance_accountability', label: '成果責任' },
      { value: 'change_management', label: '変革推進' },
      { value: 'isolation', label: '孤独感' }
    ],
    tags: ['管理職', 'ストレス']
  }
];

// === サポートニーズ ===
export const supportNeedsQuestions: Partial<InterviewQuestion>[] = [
  {
    content: '必要なサポート',
    type: 'radio',
    category: 'support_needs',
    section: 'support_planning',
    priority: 1,
    minDuration: 15,
    options: [
      { value: 'skill_training', label: '技術研修・スキル向上' },
      { value: 'career_counseling', label: 'キャリア相談' },
      { value: 'workload_adjustment', label: '業務量調整' },
      { value: 'mental_care', label: 'メンタルケア' },
      { value: 'team_improvement', label: 'チーム環境改善' },
      { value: 'other', label: 'その他' }
    ],
    tags: ['サポート', 'ニーズ']
  },
  {
    content: '必要な研修・教育機会',
    type: 'checkbox',
    category: 'support_needs',
    section: 'support_planning',
    priority: 2,
    minDuration: 30,
    options: [
      { value: 'basic_nursing', label: '基礎看護技術' },
      { value: 'emergency_response', label: '救急対応' },
      { value: 'communication', label: 'コミュニケーション' },
      { value: 'documentation', label: '記録・報告' },
      { value: 'leadership', label: 'リーダーシップ' },
      { value: 'management', label: 'マネジメント' },
      { value: 'specialty', label: '専門分野' }
    ],
    tags: ['研修', '教育']
  },
  {
    content: '希望する権限・裁量',
    type: 'checkbox',
    category: 'support_needs',
    section: 'support_planning',
    priority: 3,
    minDuration: 45,
    options: [
      { value: 'decision_making', label: '意思決定権限' },
      { value: 'budget_control', label: '予算管理権限' },
      { value: 'staff_evaluation', label: '人事評価権限' },
      { value: 'project_lead', label: 'プロジェクト主導権' },
      { value: 'external_activities', label: '院外活動許可' },
      { value: 'flexible_schedule', label: '勤務調整権限' }
    ],
    tags: ['権限', '裁量']
  }
];

// === キャリア開発・目標設定 ===
export const careerDevelopmentQuestions: Partial<InterviewQuestion>[] = [
  {
    content: '3-5年後のキャリアビジョン',
    type: 'textarea',
    category: 'career_planning',
    section: 'career_development',
    priority: 2,
    minDuration: 30,
    placeholder: '目指す役職、専門分野、資格など',
    tags: ['キャリア', 'ビジョン']
  },
  {
    content: '次のステップに向けて必要なスキル・経験',
    type: 'textarea',
    category: 'career_planning',
    section: 'career_development',
    priority: 2,
    minDuration: 30,
    placeholder: '習得したいスキルや経験したい業務',
    tags: ['キャリア', 'スキル開発']
  },
  {
    content: '興味のある分野・専門領域',
    type: 'textarea',
    category: 'career_planning',
    section: 'career_development',
    priority: 3,
    minDuration: 45,
    placeholder: '専門看護師、認定看護師、管理職など',
    tags: ['キャリア', '専門分野']
  },
  {
    content: '希望する研修・教育機会',
    type: 'textarea',
    category: 'growth_development',
    section: 'career_development',
    priority: 3,
    minDuration: 45,
    placeholder: '院内研修、外部研修、学会参加など',
    tags: ['キャリア', '研修']
  },
  {
    content: '後輩指導・プリセプター経験',
    type: 'textarea',
    category: 'knowledge_transfer',
    section: 'career_development',
    priority: 3,
    minDuration: 45,
    placeholder: '指導経験と今後の意向',
    tags: ['キャリア', '指導']
  }
];

// === 施設タイプ別特有質問 ===
export const facilitySpecificQuestions: Record<string, Partial<InterviewQuestion>[]> = {
  acute: [ // 急性期病院
    {
      content: '急変対応への自信',
      type: 'scale',
      category: 'facility_specific',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['急性期', '救急対応']
    },
    {
      content: '医療機器操作の習熟度',
      type: 'scale',
      category: 'facility_specific',
      section: 'skill_evaluation',
      priority: 2,
      minDuration: 30,
      tags: ['急性期', '医療機器']
    },
    {
      content: '手術室・ICU業務への興味',
      type: 'radio',
      category: 'facility_specific',
      section: 'career_development',
      priority: 3,
      minDuration: 45,
      options: [
        { value: 'very_interested', label: 'とても興味あり' },
        { value: 'interested', label: '興味あり' },
        { value: 'neutral', label: 'どちらでもない' },
        { value: 'not_interested', label: '興味なし' }
      ],
      tags: ['急性期', '専門部署']
    }
  ],
  chronic: [ // 慢性期病院
    {
      content: '長期療養患者へのケア',
      type: 'scale',
      category: 'facility_specific',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['慢性期', '長期ケア']
    },
    {
      content: '緩和ケア・終末期ケアへの理解',
      type: 'scale',
      category: 'facility_specific',
      section: 'skill_evaluation',
      priority: 2,
      minDuration: 30,
      tags: ['慢性期', '緩和ケア']
    },
    {
      content: '家族支援の実践',
      type: 'textarea',
      category: 'facility_specific',
      section: 'current_status',
      priority: 3,
      minDuration: 45,
      placeholder: '家族との関わりや支援の事例',
      tags: ['慢性期', '家族支援']
    }
  ],
  roken: [ // 老健施設
    {
      content: '在宅復帰支援への取り組み',
      type: 'textarea',
      category: 'facility_specific',
      section: 'current_status',
      priority: 1,
      minDuration: 15,
      placeholder: '在宅復帰に向けた支援内容',
      tags: ['老健', '在宅復帰']
    },
    {
      content: 'リハビリテーションとの連携',
      type: 'scale',
      category: 'facility_specific',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['老健', 'リハビリ連携']
    },
    {
      content: '多職種協働の実践',
      type: 'textarea',
      category: 'facility_specific',
      section: 'team_collaboration',
      priority: 2,
      minDuration: 30,
      placeholder: 'PT/OT/ST、介護職との連携事例',
      tags: ['老健', '多職種連携']
    },
    {
      content: '生活機能向上への貢献',
      type: 'textarea',
      category: 'facility_specific',
      section: 'current_status',
      priority: 3,
      minDuration: 45,
      placeholder: 'ADL向上支援の具体例',
      tags: ['老健', 'ADL支援']
    }
  ],
  grouphome: [ // グループホーム
    {
      content: '認知症ケアの実践',
      type: 'scale',
      category: 'facility_specific',
      section: 'skill_evaluation',
      priority: 1,
      minDuration: 15,
      tags: ['グループホーム', '認知症ケア']
    },
    {
      content: '生活支援の工夫',
      type: 'textarea',
      category: 'facility_specific',
      section: 'current_status',
      priority: 2,
      minDuration: 30,
      placeholder: '個別性を重視した生活支援の事例',
      tags: ['グループホーム', '生活支援']
    },
    {
      content: '地域連携の取り組み',
      type: 'textarea',
      category: 'facility_specific',
      section: 'team_collaboration',
      priority: 3,
      minDuration: 45,
      placeholder: '地域資源の活用や連携事例',
      tags: ['グループホーム', '地域連携']
    }
  ]
};

// === アクションプラン・フォローアップ ===
export const actionPlanQuestions: Partial<InterviewQuestion>[] = [
  {
    content: '次回までの目標（1つ）',
    type: 'textarea',
    category: 'goal_setting',
    section: 'action_plan',
    priority: 1,
    minDuration: 15,
    placeholder: '具体的で達成可能な目標',
    tags: ['目標', 'アクション']
  },
  {
    content: '目標達成のための具体的行動',
    type: 'textarea',
    category: 'goal_setting',
    section: 'action_plan',
    priority: 2,
    minDuration: 30,
    placeholder: '期限と行動内容',
    tags: ['目標', '行動計画']
  },
  {
    content: '必要なフォローアップ',
    type: 'checkbox',
    category: 'support_needs',
    section: 'action_plan',
    priority: 2,
    minDuration: 30,
    options: [
      { value: 'weekly_check', label: '週次チェック' },
      { value: 'monthly_meeting', label: '月次面談' },
      { value: 'mentor_support', label: 'メンター支援' },
      { value: 'training_participation', label: '研修参加' },
      { value: 'project_assignment', label: 'プロジェクト参加' }
    ],
    tags: ['フォローアップ', 'サポート']
  },
  {
    content: '次回面談予定',
    type: 'text',
    category: 'goal_setting',
    section: 'action_plan',
    priority: 1,
    minDuration: 15,
    placeholder: 'YYYY-MM-DD',
    tags: ['スケジュール', '面談']
  },
  {
    content: 'サポートレベル',
    type: 'radio',
    category: 'support_needs',
    section: 'action_plan',
    priority: 2,
    minDuration: 30,
    options: [
      { value: 'standard', label: '標準' },
      { value: 'enhanced', label: '強化' },
      { value: 'intensive', label: '集中' }
    ],
    tags: ['サポート', 'レベル']
  }
];

// === 面談者評価項目 ===
export const interviewerAssessmentQuestions: Partial<InterviewQuestion>[] = [
  {
    content: '総合評価',
    type: 'radio',
    category: 'skill_assessment',
    section: 'feedback_reflection',
    priority: 1,
    minDuration: 15,
    options: [
      { value: 'exceeds_greatly', label: '期待を大きく超える' },
      { value: 'exceeds', label: '期待を超える' },
      { value: 'meets', label: '期待通り' },
      { value: 'below_slightly', label: 'やや期待以下' },
      { value: 'below', label: '期待以下' }
    ],
    tags: ['評価', '総合']
  },
  {
    content: 'ポテンシャル評価',
    type: 'radio',
    category: 'skill_assessment',
    section: 'feedback_reflection',
    priority: 2,
    minDuration: 30,
    options: [
      { value: 'high_leader', label: '高（次世代リーダー候補）' },
      { value: 'medium_high', label: '中高（専門性向上）' },
      { value: 'medium', label: '中（着実な成長）' },
      { value: 'support_needed', label: '要支援' }
    ],
    tags: ['評価', 'ポテンシャル']
  },
  {
    content: '離職リスク',
    type: 'radio',
    category: 'skill_assessment',
    section: 'feedback_reflection',
    priority: 2,
    minDuration: 30,
    options: [
      { value: 'low', label: '低' },
      { value: 'medium', label: '中' },
      { value: 'high', label: '高' }
    ],
    tags: ['評価', 'リスク']
  },
  {
    content: '育成トラック推奨',
    type: 'radio',
    category: 'career_planning',
    section: 'feedback_reflection',
    priority: 3,
    minDuration: 45,
    options: [
      { value: 'fast_track', label: 'ファストトラック（早期昇進）' },
      { value: 'specialist', label: 'スペシャリスト育成' },
      { value: 'standard', label: '標準的育成' },
      { value: 'intensive_support', label: '集中的支援' }
    ],
    tags: ['評価', '育成方針']
  },
  {
    content: '面談者所見',
    type: 'textarea',
    category: 'skill_assessment',
    section: 'feedback_reflection',
    priority: 1,
    minDuration: 15,
    placeholder: '総合的な所見と今後の育成方針',
    tags: ['評価', '所見']
  }
];

// 全質問をエクスポート
export const allQuestions = [
  ...motivationQuestions,
  ...Object.values(motivationFollowUpQuestions).flat(),
  ...Object.values(currentStatusQuestions).flat(),
  ...Object.values(skillEvaluationQuestions).flat(),
  ...satisfactionQuestions,
  ...healthStressQuestions,
  ...stressFactorQuestions,
  ...supportNeedsQuestions,
  ...careerDevelopmentQuestions,
  ...Object.values(facilitySpecificQuestions).flat(),
  ...actionPlanQuestions,
  ...interviewerAssessmentQuestions
];