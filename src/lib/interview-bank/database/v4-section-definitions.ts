// v4/v5シートの正確なセクション定義
import { InterviewSectionDefinition } from '../types';

// 第1セクション：職種×経験レベル別のスキル評価セクション
export const skillEvaluationSections: Record<string, InterviewSectionDefinition> = {
  // 看護師
  'nurse_new': {
    id: 'skill_evaluation_nurse_new',
    name: '適応状況と学習進捗',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '新人看護師の基礎技術習得と職場適応',
    recommendedDuration: 10,
    questions: []
  },
  'nurse_junior': {
    id: 'skill_evaluation_nurse_junior',
    name: '業務遂行状況の評価',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '看護実践能力の総合評価',
    recommendedDuration: 10,
    questions: [],
    subCategories: [
      '看護技術・スキル',
      'アセスメント能力',
      '患者対応・コミュニケーション',
      '多職種連携',
      '問題解決能力',
      '主体性・積極性'
    ]
  },
  'nurse_mid': {
    id: 'skill_evaluation_nurse_mid',
    name: 'リーダーシップ・専門性の詳細評価',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '中堅看護師のリーダーシップと専門性',
    recommendedDuration: 10,
    questions: []
  },
  'nurse_senior': {
    id: 'skill_evaluation_nurse_senior',
    name: 'リーダーシップ・専門性の詳細評価',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: 'リーダー看護師の指導力と専門性',
    recommendedDuration: 10,
    questions: []
  },
  'nurse_veteran': {
    id: 'skill_evaluation_nurse_veteran',
    name: '専門性・エキスパート実践の詳細評価',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: 'ベテラン看護師の専門実践と後進指導',
    recommendedDuration: 10,
    questions: []
  },
  'nurse_supervisor': {
    id: 'skill_evaluation_nurse_supervisor',
    name: 'チーム運営と業務管理',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '主任看護師の管理能力評価',
    recommendedDuration: 10,
    questions: []
  },
  'nurse_manager': {
    id: 'skill_evaluation_nurse_manager',
    name: '管理業務・組織運営の詳細評価',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '看護師長の組織運営能力',
    recommendedDuration: 10,
    questions: []
  },

  // 准看護師
  'assistant_nurse_new': {
    id: 'skill_evaluation_assistant_nurse_new',
    name: '適応状況と基礎技術習得',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '新人准看護師の基礎技術と適応',
    recommendedDuration: 10,
    questions: []
  },
  'assistant_nurse_junior': {
    id: 'skill_evaluation_assistant_nurse_junior',
    name: '業務遂行状況の評価',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '准看護師の業務遂行能力',
    recommendedDuration: 10,
    questions: []
  },

  // 看護補助者
  'nursing_assistant_new': {
    id: 'skill_evaluation_nursing_assistant_new',
    name: '適応状況と基礎業務習得',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '新人看護補助者の基礎業務習得',
    recommendedDuration: 10,
    questions: []
  },
  'nursing_assistant_junior': {
    id: 'skill_evaluation_nursing_assistant_junior',
    name: '業務遂行状況の評価',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '看護補助者の業務遂行能力',
    recommendedDuration: 10,
    questions: []
  },

  // 介護職
  'care_worker_new': {
    id: 'skill_evaluation_care_worker_new',
    name: '適応状況と介護技術習得',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '新人介護職の基礎技術習得',
    recommendedDuration: 10,
    questions: []
  },
  'care_worker_junior': {
    id: 'skill_evaluation_care_worker_junior',
    name: '業務遂行状況の評価',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '介護職の実践能力評価',
    recommendedDuration: 10,
    questions: [],
    subCategories: [
      '介護技術・スキル',
      'アセスメント能力',
      '利用者対応・コミュニケーション',
      '多職種連携',
      '問題解決能力',
      '主体性・積極性'
    ]
  },

  // 理学療法士
  'therapist_pt_new': {
    id: 'skill_evaluation_therapist_pt_new',
    name: '適応状況と基礎技術習得',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '新人理学療法士の基礎評価・治療技術',
    recommendedDuration: 10,
    questions: []
  },
  'therapist_pt_junior': {
    id: 'skill_evaluation_therapist_pt_junior',
    name: '専門技術とチーム医療',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '理学療法士の専門性評価',
    recommendedDuration: 10,
    questions: []
  },

  // 作業療法士
  'therapist_ot_new': {
    id: 'skill_evaluation_therapist_ot_new',
    name: '適応状況と基礎技術習得',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '新人作業療法士の基礎評価・治療技術',
    recommendedDuration: 10,
    questions: []
  },
  'therapist_ot_junior': {
    id: 'skill_evaluation_therapist_ot_junior',
    name: '専門技術とチーム医療',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '作業療法士の専門性評価',
    recommendedDuration: 10,
    questions: []
  },

  // 言語聴覚士
  'therapist_st_new': {
    id: 'skill_evaluation_therapist_st_new',
    name: '適応状況と基礎技術習得',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '新人言語聴覚士の基礎評価・治療技術',
    recommendedDuration: 10,
    questions: []
  },
  'therapist_st_junior': {
    id: 'skill_evaluation_therapist_st_junior',
    name: '専門技術とチーム医療',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '言語聴覚士の専門性評価',
    recommendedDuration: 10,
    questions: []
  },

  // 医事課職員
  'medical_clerk_new': {
    id: 'skill_evaluation_medical_clerk_new',
    name: '適応状況と基礎業務習得',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '新人医事課職員の基礎業務習得',
    recommendedDuration: 10,
    questions: []
  },
  'medical_clerk_junior': {
    id: 'skill_evaluation_medical_clerk_junior',
    name: '業務遂行状況の評価',
    type: 'skill_evaluation',
    color: 'bg-blue-50',
    description: '医事課職員の業務遂行能力',
    recommendedDuration: 10,
    questions: [],
    subCategories: [
      '医事業務スキル',
      'レセプト処理能力',
      '患者応対・接遇',
      '他部署連携',
      '問題解決能力',
      '主体性・積極性'
    ]
  }
};

// 第2セクション：全員共通の現状確認セクション
export const commonStatusSection: InterviewSectionDefinition = {
  id: 'status_check',
  name: '職員の現状確認（モチベーション・健康・エンゲージメント）',
  type: 'status_check',
  color: 'bg-green-50',
  description: '心身の健康状態、職場満足度、継続意向の確認',
  recommendedDuration: 8,
  questions: []
};

// 第3セクション：キャリア開発（経験レベル別）
export const careerSections: Record<string, InterviewSectionDefinition> = {
  'new': {
    id: 'career_new',
    name: '今後の成長目標と学習計画',
    type: 'career_development',
    color: 'bg-yellow-50',
    description: '新人職員の成長目標設定',
    recommendedDuration: 8,
    questions: []
  },
  'junior': {
    id: 'career_junior',
    name: 'キャリア開発と成長課題',
    type: 'career_development',
    color: 'bg-yellow-50',
    description: '若手職員のキャリア形成支援',
    recommendedDuration: 8,
    questions: []
  },
  'mid': {
    id: 'career_mid',
    name: 'キャリアビジョンと専門性向上',
    type: 'career_development',
    color: 'bg-yellow-50',
    description: '中堅職員の専門性とリーダーシップ開発',
    recommendedDuration: 8,
    questions: []
  },
  'senior': {
    id: 'career_senior',
    name: '専門性深化とリーダーシップ',
    type: 'career_development',
    color: 'bg-yellow-50',
    description: 'リーダー層の役割拡大と後進指導',
    recommendedDuration: 8,
    questions: []
  },
  'veteran': {
    id: 'career_veteran',
    name: '知識継承と組織貢献',
    type: 'career_development',
    color: 'bg-yellow-50',
    description: 'ベテラン職員の経験活用と継承',
    recommendedDuration: 8,
    questions: []
  },
  'supervisor': {
    id: 'career_supervisor',
    name: '管理能力向上とチーム育成',
    type: 'career_development',
    color: 'bg-yellow-50',
    description: '主任職の管理スキル向上',
    recommendedDuration: 8,
    questions: []
  },
  'manager': {
    id: 'career_manager',
    name: '組織戦略と部門運営',
    type: 'career_development',
    color: 'bg-yellow-50',
    description: '管理職の戦略立案と実行',
    recommendedDuration: 8,
    questions: []
  }
};

// 第4セクション：組織貢献（45分版のみ）
export const organizationSections: Record<string, InterviewSectionDefinition> = {
  'junior': {
    id: 'organization_junior',
    name: 'チーム協働と職場改善',
    type: 'organization_contribution',
    color: 'bg-purple-50',
    description: '若手職員のチーム貢献',
    recommendedDuration: 8,
    questions: []
  },
  'mid': {
    id: 'organization_mid',
    name: '後輩指導とチーム貢献',
    type: 'organization_contribution',
    color: 'bg-purple-50',
    description: '中堅職員の指導力と改善提案',
    recommendedDuration: 8,
    questions: []
  },
  'senior': {
    id: 'organization_senior',
    name: 'メンタリングと組織改革',
    type: 'organization_contribution',
    color: 'bg-purple-50',
    description: 'リーダー層の組織変革推進',
    recommendedDuration: 8,
    questions: []
  }
};

// 最終セクション：アクションプラン（全員共通）
export const actionPlanSection: InterviewSectionDefinition = {
  id: 'action_plan',
  name: '今後のアクションプラン',
  type: 'action_planning',
  color: 'bg-orange-50',
  description: '面談内容の振り返りと具体的な行動計画',
  recommendedDuration: 4,
  questions: []
};