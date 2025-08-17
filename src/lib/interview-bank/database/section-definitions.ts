// 面談セクション定義 - v4/v5シートから抽出した共通構造
// 施設タイプ・職種・経験年数に応じて動的にセクションを構成

import { InterviewSection, SectionType } from '../types';

export const sectionDefinitions: InterviewSection[] = [
  // 1. スキル評価セクション（施設別・職種別にカスタマイズ）
  {
    id: 'skill_evaluation',
    name: '業務遂行状況の評価',
    description: '現在の業務スキルと達成状況を評価',
    order: 1,
    type: 'skill_evaluation' as SectionType,
    minDuration: 8,
    maxQuestions: {
      15: 3,
      30: 6,
      45: 8,
      60: 10
    },
    questions: [], // 動的に選択
    conditions: []
  },

  // 2. 職員の現状確認（全施設・全職種共通）
  {
    id: 'staff_status',
    name: '職員の現状確認（モチベーション・健康・エンゲージメント）',
    description: '職員の心身の健康状態と組織へのエンゲージメントを確認',
    order: 2,
    type: 'current_status' as SectionType,
    minDuration: 8,
    maxQuestions: {
      15: 4,
      30: 10,
      45: 12,
      60: 15
    },
    questions: [], // 共通質問を使用
    conditions: []
  },

  // 3. キャリア開発・課題
  {
    id: 'career_development',
    name: 'キャリア開発・課題',
    description: '今後のキャリアビジョンと現在の課題を確認',
    order: 3,
    type: 'career_development' as SectionType,
    minDuration: 8,
    maxQuestions: {
      15: 2,
      30: 4,
      45: 6,
      60: 8
    },
    questions: [],
    conditions: []
  },

  // 4. アクションプラン
  {
    id: 'action_plan',
    name: '今後のアクションプラン',
    description: '次回面談までの具体的な目標と行動計画',
    order: 4,
    type: 'action_plan' as SectionType,
    minDuration: 4,
    maxQuestions: {
      15: 2,
      30: 3,
      45: 4,
      60: 5
    },
    questions: [],
    conditions: []
  },

  // 5. 面談者所見
  {
    id: 'interviewer_notes',
    name: '面談者所見',
    description: '面談者による総合評価とコメント',
    order: 5,
    type: 'feedback_reflection' as SectionType,
    minDuration: 2,
    maxQuestions: {
      15: 1,
      30: 3,
      45: 4,
      60: 5
    },
    questions: [],
    conditions: []
  },

  // 追加セクション（45分以上の面談で使用）
  {
    id: 'team_environment',
    name: 'チーム環境・職場改善',
    description: 'チーム内の関係性と職場環境の改善提案',
    order: 6,
    type: 'team_environment' as SectionType,
    minDuration: 5,
    maxQuestions: {
      15: 0,
      30: 0,
      45: 4,
      60: 6
    },
    questions: [],
    conditions: [
      {
        type: 'duration',
        values: [45, 60]
      }
    ]
  },

  {
    id: 'innovation_improvement',
    name: '業務改善・イノベーション',
    description: '業務改善提案と新しいアイデア',
    order: 7,
    type: 'innovation_improvement' as SectionType,
    minDuration: 5,
    maxQuestions: {
      15: 0,
      30: 0,
      45: 3,
      60: 5
    },
    questions: [],
    conditions: [
      {
        type: 'experienceLevel',
        values: ['midlevel', 'veteran', 'leader']
      },
      {
        type: 'duration',
        values: [45, 60]
      }
    ]
  },

  // リーダー・管理職向けセクション
  {
    id: 'leadership_management',
    name: 'リーダーシップ・マネジメント',
    description: 'チーム管理と育成に関する評価',
    order: 8,
    type: 'leadership_management' as SectionType,
    minDuration: 10,
    maxQuestions: {
      15: 0,
      30: 0,
      45: 5,
      60: 8
    },
    questions: [],
    conditions: [
      {
        type: 'experienceLevel',
        values: ['leader']
      }
    ]
  },

  // 新人向け特別セクション
  {
    id: 'workplace_adaptation',
    name: '職場適応・サポート',
    description: '新人の職場適応状況と必要なサポート',
    order: 3,
    type: 'motivation_assessment' as SectionType,
    minDuration: 5,
    maxQuestions: {
      15: 3,
      30: 5,
      45: 6,
      60: 8
    },
    questions: [],
    conditions: [
      {
        type: 'experienceLevel',
        values: ['new']
      }
    ]
  }
];

// セクション選択ロジック
export function selectSectionsForInterview(
  duration: number,
  experienceLevel: string,
  facilityType: string,
  profession: string
): InterviewSection[] {
  const selectedSections: InterviewSection[] = [];
  
  // 必須セクション（全ての面談に含まれる）
  const mandatorySections = [
    'skill_evaluation',
    'staff_status'
  ];

  // 時間別の推奨セクション構成
  const sectionsByDuration: Record<number, string[]> = {
    15: ['skill_evaluation', 'staff_status', 'action_plan'],
    30: ['skill_evaluation', 'staff_status', 'career_development', 'action_plan', 'interviewer_notes'],
    45: ['skill_evaluation', 'staff_status', 'career_development', 'team_environment', 'action_plan', 'interviewer_notes'],
    60: ['skill_evaluation', 'staff_status', 'career_development', 'team_environment', 'innovation_improvement', 'action_plan', 'interviewer_notes']
  };

  // 経験年数による調整
  const experienceAdjustments: Record<string, string[]> = {
    'new': ['workplace_adaptation'], // 新人は適応セクションを追加
    'leader': ['leadership_management'], // リーダーは管理セクションを追加
    'veteran': ['innovation_improvement'] // ベテランは改善セクションを追加
  };

  // 基本セクションを選択
  const baseSectionIds = sectionsByDuration[duration] || sectionsByDuration[30];
  
  // 経験年数による追加セクションを適用
  const additionalSections = experienceAdjustments[experienceLevel] || [];
  
  // セクションを統合（重複を除去）
  const allSectionIds = Array.from(new Set([...baseSectionIds, ...additionalSections]));
  
  // セクション定義を取得して条件を確認
  for (const sectionId of allSectionIds) {
    const section = sectionDefinitions.find(s => s.id === sectionId);
    if (section) {
      // 条件チェック
      let includeSection = true;
      if (section.conditions && section.conditions.length > 0) {
        for (const condition of section.conditions) {
          if (condition.type === 'duration' && !condition.values.includes(duration)) {
            includeSection = false;
            break;
          }
          if (condition.type === 'experienceLevel' && !condition.values.includes(experienceLevel)) {
            includeSection = false;
            break;
          }
          if (condition.type === 'facilityType' && !condition.values.includes(facilityType)) {
            includeSection = false;
            break;
          }
          if (condition.type === 'profession' && !condition.values.includes(profession)) {
            includeSection = false;
            break;
          }
        }
      }
      
      if (includeSection) {
        selectedSections.push(section);
      }
    }
  }
  
  // 順序でソート
  selectedSections.sort((a, b) => a.order - b.order);
  
  return selectedSections;
}

// 施設タイプ別のスキル評価項目名を取得
export function getSkillEvaluationTitle(facilityType: string, profession: string): string {
  const titles: Record<string, Record<string, string>> = {
    acute: {
      nurse: '看護実践能力の評価',
      'assistant-nurse': '准看護実践能力の評価',
      'care-worker': '介護実践能力の評価',
      'care-manager': 'ケアマネジメント実践能力の評価',
      'therapist-pt': 'リハビリテーション実践能力の評価（理学療法）',
      'therapist-ot': '作業療法実践能力の評価',
      'therapist-st': '言語聴覚療法実践能力の評価',
      'medical-clerk': '医事業務実践能力の評価',
      'nutritionist': '栄養管理実践能力の評価',
      'pharmacist': '薬剤業務実践能力の評価',
      'social-worker': '相談支援実践能力の評価',
      'counselor': 'カウンセリング実践能力の評価',
      'general-affairs': '総務業務実践能力の評価',
      'facility': '施設管理業務実践能力の評価'
    },
    chronic: {
      nurse: '慢性期看護実践能力の評価',
      'assistant-nurse': '慢性期准看護実践能力の評価',
      'care-worker': '長期療養介護実践能力の評価',
      'care-manager': '慢性期ケアマネジメント実践能力の評価',
      'therapist-pt': '慢性期リハビリテーション実践能力の評価（理学療法）',
      'therapist-ot': '生活機能向上支援能力の評価（作業療法）',
      'therapist-st': '摂食嚥下・コミュニケーション支援能力の評価',
      'medical-clerk': '療養支援事務能力の評価',
      'nutritionist': '療養栄養管理実践能力の評価',
      'pharmacist': '慢性期薬剤業務実践能力の評価',
      'social-worker': '療養相談支援実践能力の評価',
      'counselor': '療養カウンセリング実践能力の評価',
      'general-affairs': '療養支援総務業務能力の評価',
      'facility': '療養施設管理業務能力の評価'
    },
    roken: {
      nurse: '在宅復帰支援看護能力の評価',
      'assistant-nurse': '在宅復帰支援准看護能力の評価',
      'care-worker': '在宅復帰支援介護能力の評価',
      'care-manager': '在宅復帰ケアマネジメント能力の評価',
      'therapist-pt': '在宅復帰リハビリテーション能力の評価（理学療法）',
      'therapist-ot': '在宅生活準備支援能力の評価（作業療法）',
      'therapist-st': '在宅での摂食・コミュニケーション支援能力の評価',
      'medical-clerk': '在宅復帰調整事務能力の評価',
      'nutritionist': '在宅復帰栄養管理能力の評価',
      'pharmacist': '在宅復帰薬剤管理能力の評価',
      'social-worker': '在宅復帰相談支援能力の評価',
      'counselor': '在宅復帰カウンセリング能力の評価',
      'general-affairs': '在宅復帰支援総務業務能力の評価',
      'facility': '在宅復帰施設管理業務能力の評価'
    },
    outpatient: {
      nurse: '外来看護実践能力の評価',
      'assistant-nurse': '外来准看護実践能力の評価',
      'care-worker': '外来支援実践能力の評価',
      'care-manager': '外来ケアマネジメント能力の評価',
      'therapist-pt': '外来リハビリテーション実践能力の評価（理学療法）',
      'therapist-ot': '外来作業療法実践能力の評価',
      'therapist-st': '外来言語聴覚療法実践能力の評価',
      'medical-clerk': '外来事務処理能力の評価',
      'nutritionist': '外来栄養指導能力の評価',
      'pharmacist': '外来薬剤指導能力の評価',
      'social-worker': '外来相談支援能力の評価',
      'counselor': '外来カウンセリング能力の評価',
      'general-affairs': '外来支援総務業務能力の評価',
      'facility': '外来施設管理業務能力の評価'
    },
    clinic: {
      nurse: 'クリニック看護実践能力の評価',
      'assistant-nurse': 'クリニック准看護実践能力の評価',
      'care-worker': 'クリニック介護支援能力の評価',
      'care-manager': 'クリニックケアマネジメント能力の評価',
      'therapist-pt': 'クリニックリハビリテーション能力の評価（理学療法）',
      'therapist-ot': 'クリニック作業療法能力の評価',
      'therapist-st': 'クリニック言語聴覚療法能力の評価',
      'medical-clerk': 'クリニック事務処理能力の評価',
      'nutritionist': 'クリニック栄養指導能力の評価',
      'pharmacist': 'クリニック薬剤業務能力の評価',
      'social-worker': 'クリニック相談支援能力の評価',
      'counselor': 'クリニックカウンセリング能力の評価',
      'general-affairs': 'クリニック総務業務能力の評価',
      'facility': 'クリニック施設管理業務能力の評価'
    },
    grouphome: {
      nurse: 'グループホーム看護実践能力の評価',
      'assistant-nurse': 'グループホーム准看護実践能力の評価',
      'care-worker': 'グループホーム介護実践能力の評価',
      'care-manager': 'グループホームケアマネジメント能力の評価',
      'therapist-pt': 'グループホームリハビリ支援能力の評価（理学療法）',
      'therapist-ot': 'グループホーム生活支援能力の評価（作業療法）',
      'therapist-st': 'グループホームコミュニケーション支援能力の評価',
      'medical-clerk': 'グループホーム事務処理能力の評価',
      'nutritionist': 'グループホーム栄養管理能力の評価',
      'pharmacist': 'グループホーム薬剤管理能力の評価',
      'social-worker': 'グループホーム相談支援能力の評価',
      'counselor': 'グループホームカウンセリング能力の評価',
      'general-affairs': 'グループホーム総務業務能力の評価',
      'facility': 'グループホーム施設管理業務能力の評価'
    }
  };

  return titles[facilityType]?.[profession] || '業務遂行能力の評価';
}