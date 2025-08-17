// 管理職（師長・主任）向けの専門質問
import { InterviewQuestion } from '../types';

export const managementQuestions: InterviewQuestion[] = [
  // ========================================
  // 主任向け質問
  // ========================================
  {
    id: 'mgmt-supervisor-001',
    content: '現在担当しているチームのメンバー構成と、それぞれの成長段階をどう評価していますか？',
    type: 'open',
    category: 'team_management',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['主任', '管理職', 'チーム管理'],
    experienceLevels: ['supervisor'],
    followUp: '特に課題を感じているメンバーがいれば、その支援策も含めて教えてください。'
  },
  {
    id: 'mgmt-supervisor-002',
    content: 'シフト管理や業務分担において、工夫している点や改善したい点はありますか？',
    type: 'open',
    category: 'operational_management',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['主任', '管理職', '業務管理'],
    experienceLevels: ['supervisor'],
    followUp: 'メンバーの負担を均等化するための具体的な取り組みがあれば教えてください。'
  },
  {
    id: 'mgmt-supervisor-003',
    content: '新人・若手職員の教育指導において、どのような方針で取り組んでいますか？',
    type: 'open',
    category: 'education_training',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['主任', '管理職', '教育指導'],
    experienceLevels: ['supervisor'],
    followUp: '最近の教育成果や課題について具体例を挙げてください。'
  },
  {
    id: 'mgmt-supervisor-004',
    content: 'チーム内のコミュニケーションや連携を改善するために行っている取り組みは？',
    type: 'open',
    category: 'team_building',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 15,
    tags: ['主任', '管理職', 'チームビルディング'],
    experienceLevels: ['supervisor']
  },
  {
    id: 'mgmt-supervisor-005',
    content: '上位管理職との連携において、どのような情報共有や報告を心がけていますか？',
    type: 'open',
    category: 'upward_management',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 15,
    tags: ['主任', '管理職', '上位連携'],
    experienceLevels: ['supervisor']
  },

  // ========================================
  // 師長向け質問
  // ========================================
  {
    id: 'mgmt-manager-001',
    content: '部署全体の運営方針と今年度の重点目標について説明してください。',
    type: 'open',
    category: 'strategic_management',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['師長', '管理職', '戦略管理'],
    experienceLevels: ['manager'],
    followUp: '目標達成に向けた具体的な施策と進捗状況を教えてください。'
  },
  {
    id: 'mgmt-manager-002',
    content: '部署の予算管理や資源配分において、どのような判断基準を設けていますか？',
    type: 'open',
    category: 'budget_management',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['師長', '管理職', '予算管理'],
    experienceLevels: ['manager'],
    followUp: 'コスト削減と質の維持のバランスをどう取っていますか？'
  },
  {
    id: 'mgmt-manager-003',
    content: '他部署や多職種との連携において、どのような課題があり、どう対応していますか？',
    type: 'open',
    category: 'interdepartmental_coordination',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['師長', '管理職', '部門間連携'],
    experienceLevels: ['manager']
  },
  {
    id: 'mgmt-manager-004',
    content: '部署の人材育成計画と主任・リーダー層の育成についての方針を教えてください。',
    type: 'open',
    category: 'talent_development',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['師長', '管理職', '人材育成'],
    experienceLevels: ['manager'],
    followUp: '次世代リーダーの育成における具体的な取り組みは？'
  },
  {
    id: 'mgmt-manager-005',
    content: '医療安全や感染対策において、部署として特に注力している取り組みは？',
    type: 'open',
    category: 'safety_quality',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['師長', '管理職', '医療安全'],
    experienceLevels: ['manager']
  },
  {
    id: 'mgmt-manager-006',
    content: '職員の離職防止やモチベーション向上のために実施している施策は？',
    type: 'open',
    category: 'retention_management',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['師長', '管理職', '定着率向上'],
    experienceLevels: ['manager'],
    followUp: '最近の離職率の推移と対策の効果を教えてください。'
  },
  {
    id: 'mgmt-manager-007',
    content: '病院全体の方針や経営戦略を部署にどのように浸透させていますか？',
    type: 'open',
    category: 'organizational_alignment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 15,
    tags: ['師長', '管理職', '組織戦略'],
    experienceLevels: ['manager']
  },

  // ========================================
  // 共通管理職質問
  // ========================================
  {
    id: 'mgmt-common-001',
    content: '最近発生したインシデントやトラブルへの対応と、再発防止策について教えてください。',
    type: 'open',
    category: 'incident_management',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['主任', '師長', '管理職', 'インシデント管理'],
    experienceLevels: ['supervisor', 'manager']
  },
  {
    id: 'mgmt-common-002',
    content: 'スタッフからの相談や苦情に対して、どのような姿勢で対応していますか？',
    type: 'open',
    category: 'staff_relations',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 15,
    tags: ['主任', '師長', '管理職', 'スタッフ対応'],
    experienceLevels: ['supervisor', 'manager']
  },
  {
    id: 'mgmt-common-003',
    content: '業務改善や効率化について、現在取り組んでいるプロジェクトはありますか？',
    type: 'open',
    category: 'process_improvement',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 15,
    tags: ['主任', '師長', '管理職', '業務改善'],
    experienceLevels: ['supervisor', 'manager'],
    followUp: 'その進捗と期待される効果を教えてください。'
  },
  {
    id: 'mgmt-common-004',
    content: 'ワークライフバランスの推進について、部署としての取り組みは？',
    type: 'scale',
    category: 'work_life_balance',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 15,
    tags: ['主任', '師長', '管理職', 'WLB'],
    experienceLevels: ['supervisor', 'manager']
  },
  {
    id: 'mgmt-common-005',
    content: '自身のリーダーシップスタイルと、それが部署に与える影響をどう評価していますか？',
    type: 'open',
    category: 'leadership_self_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 15,
    tags: ['主任', '師長', '管理職', 'リーダーシップ'],
    experienceLevels: ['supervisor', 'manager']
  }
];