// 定期面談バンク - セクション定義
// 面談シートのセクション構造と設定

import { InterviewSection } from '../types';

export const sectionDefinitions: InterviewSection[] = [
  // === 基本セクション ===
  {
    id: 'motivation_assessment',
    name: '動機タイプ判定',
    type: 'motivation_assessment',
    description: '職員の動機タイプを理解し、効果的なマネジメント方針を決定します',
    priority: 1,
    minDuration: 15,
    maxQuestions: { 15: 2, 30: 3, 45: 4, 60: 5 },
    displayOrder: 1
  },
  {
    id: 'current_status',
    name: '現状確認',
    type: 'current_status',
    description: '業務の現状、職場環境への適応状況を確認します',
    priority: 1,
    minDuration: 15,
    maxQuestions: { 15: 3, 30: 5, 45: 7, 60: 9 },
    displayOrder: 2
  },
  {
    id: 'skill_evaluation',
    name: 'スキル評価',
    type: 'skill_evaluation',
    description: '技術スキル、専門知識、業務遂行能力を評価します',
    priority: 1,
    minDuration: 15,
    maxQuestions: { 15: 2, 30: 4, 45: 6, 60: 8 },
    displayOrder: 3
  },
  {
    id: 'goal_setting',
    name: '目標設定',
    type: 'goal_setting',
    description: '短期・中期の目標を設定し、達成計画を立案します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 4
  },
  {
    id: 'support_planning',
    name: '支援計画',
    type: 'support_planning',
    description: '必要な支援、研修、リソースを特定します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 5
  },

  // === 経験年数別セクション ===
  {
    id: 'adaptation_support',
    name: '適応支援（新人向け）',
    type: 'adaptation_support',
    description: '職場への適応状況を確認し、必要な支援を提供します',
    priority: 1,
    minDuration: 15,
    maxQuestions: { 15: 2, 30: 4, 45: 5, 60: 6 },
    displayOrder: 10,
    targetExperience: ['new']
  },
  {
    id: 'skill_development',
    name: 'スキル開発（若手向け）',
    type: 'skill_development',
    description: '専門スキルの向上と次のステップへの準備を支援します',
    priority: 1,
    minDuration: 30,
    maxQuestions: { 15: 2, 30: 3, 45: 5, 60: 6 },
    displayOrder: 11,
    targetExperience: ['junior']
  },
  {
    id: 'leadership_development',
    name: 'リーダーシップ開発（中堅向け）',
    type: 'leadership_development',
    description: 'リーダーシップスキルとチーム運営能力を評価・開発します',
    priority: 1,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 12,
    targetExperience: ['midlevel']
  },
  {
    id: 'mentoring_expertise',
    name: 'メンタリング・専門性（ベテラン向け）',
    type: 'mentoring_expertise',
    description: '後進育成と専門知識の継承について確認します',
    priority: 1,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 13,
    targetExperience: ['veteran']
  },

  // === 役職別セクション ===
  {
    id: 'team_coordination',
    name: 'チーム調整（リーダー向け）',
    type: 'team_coordination',
    description: 'チーム内の調整と協力体制を評価します',
    priority: 1,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 20,
    targetPosition: ['leader']
  },
  {
    id: 'team_management',
    name: 'チーム管理（主任向け）',
    type: 'team_management',
    description: 'チーム運営と部下指導の状況を評価します',
    priority: 1,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 5, 60: 6 },
    displayOrder: 21,
    targetPosition: ['chief']
  },
  {
    id: 'management_status',
    name: '管理業務（管理職向け）',
    type: 'management_status',
    description: '部門運営、予算管理、戦略実行を評価します',
    priority: 1,
    minDuration: 45,
    maxQuestions: { 15: 0, 30: 2, 45: 4, 60: 6 },
    displayOrder: 22,
    targetPosition: ['assistant_manager', 'manager']
  },
  {
    id: 'strategic_planning',
    name: '戦略計画（上級管理職向け）',
    type: 'strategic_planning',
    description: '組織戦略の立案と実行を評価します',
    priority: 1,
    minDuration: 45,
    maxQuestions: { 15: 0, 30: 2, 45: 3, 60: 5 },
    displayOrder: 23,
    targetPosition: ['deputy_director', 'director', 'executive']
  },

  // === 共通セクション ===
  {
    id: 'career_development',
    name: 'キャリア開発',
    type: 'career_development',
    description: 'キャリア目標と成長計画について話し合います',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 30
  },
  {
    id: 'team_environment',
    name: 'チーム環境',
    type: 'team_environment',
    description: '職場の人間関係とチーム環境を評価します',
    priority: 2,
    minDuration: 15,
    maxQuestions: { 15: 2, 30: 3, 45: 4, 60: 5 },
    displayOrder: 31
  },
  {
    id: 'health_wellbeing',
    name: '健康・ウェルビーイング',
    type: 'health_wellbeing',
    description: '心身の健康状態とワークライフバランスを確認します',
    priority: 2,
    minDuration: 15,
    maxQuestions: { 15: 2, 30: 3, 45: 4, 60: 5 },
    displayOrder: 32
  },
  {
    id: 'feedback_reflection',
    name: 'フィードバック・振り返り',
    type: 'feedback_reflection',
    description: '面談の振り返りと相互フィードバックを行います',
    priority: 3,
    minDuration: 15,
    maxQuestions: { 15: 1, 30: 2, 45: 3, 60: 4 },
    displayOrder: 33
  },
  {
    id: 'action_plan',
    name: 'アクションプラン',
    type: 'action_plan',
    description: '今後の具体的な行動計画を策定します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 2, 45: 3, 60: 4 },
    displayOrder: 34
  },

  // === 施設別セクション ===
  {
    id: 'acute_care_skills',
    name: '急性期ケアスキル',
    type: 'acute_care_skills',
    description: '急性期医療に必要な専門スキルを評価します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 40,
    targetFacility: ['acute']
  },
  {
    id: 'chronic_care_skills',
    name: '慢性期ケアスキル',
    type: 'chronic_care_skills',
    description: '慢性期医療に必要な専門スキルを評価します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 41,
    targetFacility: ['chronic']
  },
  {
    id: 'ltc_skills',
    name: '介護施設ケアスキル',
    type: 'ltc_skills',
    description: '介護施設で必要な専門スキルを評価します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 42,
    targetFacility: ['ltc', 'group_home']
  },

  // === 部署別セクション ===
  {
    id: 'ward_specific',
    name: '病棟業務',
    type: 'ward_specific',
    description: '病棟特有の業務とスキルを評価します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 50,
    targetDepartment: ['ward']
  },
  {
    id: 'outpatient_specific',
    name: '外来業務',
    type: 'outpatient_specific',
    description: '外来特有の業務とスキルを評価します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 51,
    targetDepartment: ['outpatient']
  },
  {
    id: 'emergency_specific',
    name: '救急業務',
    type: 'emergency_specific',
    description: '救急特有の業務とスキルを評価します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 52,
    targetDepartment: ['emergency']
  },
  {
    id: 'icu_specific',
    name: 'ICU業務',
    type: 'icu_specific',
    description: 'ICU特有の業務とスキルを評価します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 53,
    targetDepartment: ['icu']
  },
  {
    id: 'operating_room_specific',
    name: '手術室業務',
    type: 'operating_room_specific',
    description: '手術室特有の業務とスキルを評価します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 54,
    targetDepartment: ['operating_room']
  },
  {
    id: 'rehabilitation_specific',
    name: 'リハビリ業務',
    type: 'rehabilitation_specific',
    description: 'リハビリ特有の業務とスキルを評価します',
    priority: 2,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 3, 45: 4, 60: 5 },
    displayOrder: 55,
    targetDepartment: ['rehabilitation']
  },

  // === 特別セクション ===
  {
    id: 'innovation_improvement',
    name: 'イノベーション・改善',
    type: 'innovation_improvement',
    description: '業務改善提案とイノベーション活動を評価します',
    priority: 3,
    minDuration: 45,
    maxQuestions: { 15: 0, 30: 2, 45: 3, 60: 4 },
    displayOrder: 60
  },
  {
    id: 'education_training',
    name: '教育・研修',
    type: 'education_training',
    description: '教育活動への参加と研修ニーズを確認します',
    priority: 3,
    minDuration: 30,
    maxQuestions: { 15: 1, 30: 2, 45: 3, 60: 4 },
    displayOrder: 61
  },
  {
    id: 'organizational_contribution',
    name: '組織貢献',
    type: 'organizational_contribution',
    description: '組織への貢献と影響力を評価します',
    priority: 3,
    minDuration: 45,
    maxQuestions: { 15: 0, 30: 2, 45: 3, 60: 4 },
    displayOrder: 62
  }
];

// TypeScript型定義の拡張
export interface InterviewSection {
  id: string;
  name: string;
  type: string;
  description?: string;
  priority: 1 | 2 | 3; // 1:必須, 2:推奨, 3:オプション
  minDuration: number;
  maxQuestions: {
    15: number;
    30: number;
    45: number;
    60: number;
  };
  displayOrder: number;
  targetExperience?: string[];
  targetPosition?: string[];
  targetFacility?: string[];
  targetDepartment?: string[];
}