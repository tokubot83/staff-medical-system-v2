// 施設別スキル質問データベース - v4/v5シートから抽出した施設特有のスキル評価質問
// 業務遂行状況の評価セクションで使用される質問群

import { InterviewQuestion, QuestionType } from '../types';

// 急性期施設のスキル質問
export const acuteSkillQuestions: InterviewQuestion[] = [
  // 看護師向け
  {
    id: 'acute_nurse_skill_1',
    content: '看護技術・スキル',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['急性期', '看護技術'],
    options: [
      { value: '5', label: '期待を大きく超える', score: 5 },
      { value: '4', label: '期待を超える', score: 4 },
      { value: '3', label: '期待通り', score: 3 },
      { value: '2', label: 'やや期待以下', score: 2 },
      { value: '1', label: '期待以下', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['acute'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'acute_nurse_skill_2',
    content: 'アセスメント能力',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['急性期', 'アセスメント'],
    options: [
      { value: '5', label: '期待を大きく超える', score: 5 },
      { value: '4', label: '期待を超える', score: 4 },
      { value: '3', label: '期待通り', score: 3 },
      { value: '2', label: 'やや期待以下', score: 2 },
      { value: '1', label: '期待以下', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['acute'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'acute_nurse_skill_3',
    content: '患者対応・コミュニケーション',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['急性期', 'コミュニケーション'],
    options: [
      { value: '5', label: '期待を大きく超える', score: 5 },
      { value: '4', label: '期待を超える', score: 4 },
      { value: '3', label: '期待通り', score: 3 },
      { value: '2', label: 'やや期待以下', score: 2 },
      { value: '1', label: '期待以下', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['acute'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 1.5
  },
  {
    id: 'acute_nurse_skill_4',
    content: '多職種連携',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 30,
    tags: ['急性期', '連携'],
    options: [
      { value: '5', label: '期待を大きく超える', score: 5 },
      { value: '4', label: '期待を超える', score: 4 },
      { value: '3', label: '期待通り', score: 3 },
      { value: '2', label: 'やや期待以下', score: 2 },
      { value: '1', label: '期待以下', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['acute'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 1.5
  },
  {
    id: 'acute_nurse_skill_5',
    content: '問題解決能力',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 30,
    tags: ['急性期', '問題解決'],
    options: [
      { value: '5', label: '期待を大きく超える', score: 5 },
      { value: '4', label: '期待を超える', score: 4 },
      { value: '3', label: '期待通り', score: 3 },
      { value: '2', label: 'やや期待以下', score: 2 },
      { value: '1', label: '期待以下', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['acute'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'acute_nurse_skill_6',
    content: '主体性・積極性',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['急性期', '主体性'],
    options: [
      { value: '5', label: '期待を大きく超える', score: 5 },
      { value: '4', label: '期待を超える', score: 4 },
      { value: '3', label: '期待通り', score: 3 },
      { value: '2', label: 'やや期待以下', score: 2 },
      { value: '1', label: '期待以下', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['acute'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 1.3
  },

  // 急性期 - 詳細質問（テキスト型）
  {
    id: 'acute_achievement',
    content: '現在の業務内容と達成状況',
    type: 'textarea' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 30,
    tags: ['急性期', '達成状況'],
    placeholder: '担当業務、役割、主な成果、達成度など',
    conditions: [
      { type: 'facilityType', values: ['acute'], operator: 'equals' }
    ]
  },
  {
    id: 'acute_growth',
    content: 'この半年で成長した点・新たに身につけたスキル',
    type: 'textarea' as QuestionType,
    category: 'growth_development',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['急性期', '成長'],
    placeholder: '具体的な成長ポイント、習得した看護技術など',
    conditions: [
      { type: 'facilityType', values: ['acute'], operator: 'equals' }
    ]
  }
];

// 外来施設のスキル質問
export const outpatientSkillQuestions: InterviewQuestion[] = [
  {
    id: 'outpatient_nurse_skill_1',
    content: '外来看護技術の習得（初診対応・トリアージ基礎）',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['外来', '看護技術', 'トリアージ'],
    options: [
      { value: 'S', label: '予定より早く習得', score: 5 },
      { value: 'A', label: '順調に習得', score: 4 },
      { value: 'B', label: '標準的', score: 3 },
      { value: 'C', label: '遅れあり', score: 2 },
      { value: 'D', label: '大幅な遅れ', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['outpatient'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'outpatient_nurse_skill_2',
    content: '検査説明・他部門連携（検査室・放射線科・病棟調整）',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['外来', '連携', '検査'],
    options: [
      { value: 'S', label: '的確な説明と調整', score: 5 },
      { value: 'A', label: '良好な連携', score: 4 },
      { value: 'B', label: '基本的対応', score: 3 },
      { value: 'C', label: '連携不足', score: 2 },
      { value: 'D', label: '大幅な不足', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['outpatient'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'outpatient_nurse_skill_3',
    content: '外来患者・家族への対応（短時間での信頼関係構築）',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['外来', '患者対応', 'コミュニケーション'],
    options: [
      { value: 'S', label: '模範的対応', score: 5 },
      { value: 'A', label: '丁寧で適切', score: 4 },
      { value: 'B', label: '標準的', score: 3 },
      { value: 'C', label: '改善必要', score: 2 },
      { value: 'D', label: '要指導', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['outpatient'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'outpatient_nurse_skill_4',
    content: '医療安全・感染対策の実践（外来特有のリスク管理）',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 30,
    tags: ['外来', '医療安全', '感染対策'],
    options: [
      { value: 'S', label: '完璧な実践', score: 5 },
      { value: 'A', label: '確実な実践', score: 4 },
      { value: 'B', label: '基本的実践', score: 3 },
      { value: 'C', label: '不十分', score: 2 },
      { value: 'D', label: 'リスクあり', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['outpatient'], operator: 'equals' },
      { type: 'profession', values: ['nurse'], operator: 'equals' }
    ],
    scoreWeight: 2.0
  }
];

// 老健施設のスキル質問
export const rokenSkillQuestions: InterviewQuestion[] = [
  {
    id: 'roken_skill_1',
    content: '老健チームへの適応と多職種協働',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['老健', '多職種協働'],
    options: [
      { value: 'S', label: '多職種チームに完全に適応し、積極的に連携を図る', score: 5 },
      { value: 'A', label: 'リハ職・介護職・相談員等と良好な関係を構築', score: 4 },
      { value: 'B', label: '標準的な適応状況で、チームの一員として機能', score: 3 },
      { value: 'C', label: '多職種連携に時間を要し、サポートが必要', score: 2 },
      { value: 'D', label: 'チーム適応に困難があり、継続的な支援が必要', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['roken'], operator: 'equals' }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'roken_skill_2',
    content: '在宅復帰支援への取り組み',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['老健', '在宅復帰'],
    options: [
      { value: 'S', label: '在宅復帰の視点を持ち、家族指導や環境調整に積極的に関与', score: 5 },
      { value: 'A', label: '在宅復帰を意識したケアを実践し、成果を上げる', score: 4 },
      { value: 'B', label: '基本的な在宅復帰支援の視点を持っている', score: 3 },
      { value: 'C', label: '在宅復帰への意識が不足している', score: 2 },
      { value: 'D', label: '施設完結型の思考から脱却できていない', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['roken'], operator: 'equals' }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'roken_skill_3',
    content: 'リハビリテーション看護の実践',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['老健', 'リハビリ'],
    options: [
      { value: 'S', label: 'リハビリ職と協働し、生活リハビリを積極的に実践', score: 5 },
      { value: 'A', label: 'リハビリテーション看護の視点を持ち、日常ケアに活かす', score: 4 },
      { value: 'B', label: '基本的なリハビリテーション看護を理解・実践', score: 3 },
      { value: 'C', label: 'リハビリテーション看護の理解が不十分', score: 2 },
      { value: 'D', label: 'リハビリテーション看護の実践ができていない', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['roken'], operator: 'equals' },
      { type: 'profession', values: ['nurse', 'care-worker'], operator: 'equals' }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'roken_skill_4',
    content: 'サービス間の柔軟な対応力',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['老健', '柔軟性'],
    options: [
      { value: 'S', label: '入所・通所・訪問すべてで優れた適応力を発揮', score: 5 },
      { value: 'A', label: '複数サービスで柔軟に対応し、良好な成果', score: 4 },
      { value: 'B', label: '主たるサービスで適切に業務遂行', score: 3 },
      { value: 'C', label: 'サービス間の違いへの適応に課題', score: 2 },
      { value: 'D', label: '単一サービスでも適応に困難', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['roken'], operator: 'equals' }
    ],
    scoreWeight: 1.5
  }
];

// 慢性期施設のスキル質問
export const chronicSkillQuestions: InterviewQuestion[] = [
  {
    id: 'chronic_skill_1',
    content: '慢性期ケアへの適応・チーム貢献',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['慢性期', 'チーム貢献'],
    options: [
      { value: 'S', label: '慢性期ケアの特性を深く理解し、チームの中心的存在として貢献', score: 5 },
      { value: 'A', label: '積極的に慢性期ケアに取り組み、良好な関係を構築', score: 4 },
      { value: 'B', label: '標準的な適応状況で、チームの一員として機能', score: 3 },
      { value: 'C', label: '慢性期ケアへの適応に時間を要し、サポートが必要', score: 2 },
      { value: 'D', label: '適応困難で、継続的な支援が必要', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['chronic'], operator: 'equals' }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'chronic_skill_2',
    content: '長期療養患者への生活支援',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['慢性期', '生活支援'],
    options: [
      { value: 'S', label: '患者の生活の質を高める優れた支援を実践し、高い評価を得る', score: 5 },
      { value: 'A', label: '個別性を重視した生活支援を実践し、良好な評価', score: 4 },
      { value: 'B', label: '標準的な生活支援を安全に提供できる', score: 3 },
      { value: 'C', label: '生活支援の視点が不十分で、改善が必要', score: 2 },
      { value: 'D', label: '生活支援に課題があり、継続的な指導が必要', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['chronic'], operator: 'equals' }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'chronic_skill_3',
    content: '認知症ケア・終末期ケアへの理解',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['慢性期', '認知症', '終末期'],
    options: [
      { value: 'S', label: '認知症・終末期ケアの基本を習得し、適切に実践', score: 5 },
      { value: 'A', label: '積極的に学習し、基本的な対応ができる', score: 4 },
      { value: 'B', label: '指導下で適切な対応ができる', score: 3 },
      { value: 'C', label: '理解が不十分で、継続的な学習が必要', score: 2 },
      { value: 'D', label: '基本的な理解が不足し、実践に課題がある', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['chronic'], operator: 'equals' }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'chronic_skill_4',
    content: '療養病棟業務への貢献',
    type: 'scale' as QuestionType,
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['慢性期', '業務貢献'],
    options: [
      { value: 'S', label: '業務改善提案を行い、療養環境の向上に貢献', score: 5 },
      { value: 'A', label: '与えられた役割以上の貢献をしている', score: 4 },
      { value: 'B', label: '期待される役割を適切に果たしている', score: 3 },
      { value: 'C', label: '基本的な業務遂行にとどまる', score: 2 },
      { value: 'D', label: '業務遂行に課題があり、病棟運営に影響', score: 1 }
    ],
    conditions: [
      { type: 'facilityType', values: ['chronic'], operator: 'equals' }
    ],
    scoreWeight: 1.5
  }
];

// 全施設スキル質問をエクスポート
export const allFacilitySkillQuestions: InterviewQuestion[] = [
  ...acuteSkillQuestions,
  ...outpatientSkillQuestions,
  ...rokenSkillQuestions,
  ...chronicSkillQuestions
];

// デフォルトエクスポートも追加（互換性のため）
export default allFacilitySkillQuestions;