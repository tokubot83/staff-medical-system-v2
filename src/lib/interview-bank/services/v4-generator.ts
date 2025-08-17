// v4/v5シート準拠の面談シート生成サービス
import { 
  InterviewSectionInstance, 
  InterviewSheetOutput,
  InterviewQuestion
} from '../types';
import { ExtendedInterviewParams } from '../types-extended';
import { questionBank } from '../database/question-bank';
import { facilitySpecificQuestions } from '../database/facility-specific-questions';
import { commonStatusQuestions } from '../database/common-status-questions';
import { 
  skillEvaluationSections,
  commonStatusSection,
  careerSections,
  organizationSections,
  actionPlanSection
} from '../database/v4-section-definitions';

// 全質問を統合
const allQuestions: InterviewQuestion[] = [
  ...questionBank,
  ...facilitySpecificQuestions,
  ...commonStatusQuestions
];

/**
 * 職種マッピング（UIの値 → 内部キー）
 */
const professionMapping: Record<string, string> = {
  'nurse': 'nurse',
  'assistant-nurse': 'assistant_nurse',
  'nursing-assistant': 'nursing_assistant',
  'care-worker': 'care_worker',
  'therapist-pt': 'therapist_pt',
  'therapist-ot': 'therapist_ot',
  'therapist-st': 'therapist_st',
  'medical-clerk': 'medical_clerk'
};

/**
 * 経験レベルマッピング
 */
const experienceLevelMapping: Record<string, string> = {
  'new': 'new',
  'junior': 'junior',
  'mid': 'mid',
  'senior': 'senior',
  'veteran': 'veteran',
  'supervisor': 'supervisor',
  'manager': 'manager'
};

/**
 * 施設タイプマッピング
 */
const facilityTypeMapping: Record<string, string> = {
  'acute': 'acute',
  'chronic': 'chronic',
  'geriatric': 'geriatric',
  'outpatient': 'outpatient'
};

/**
 * 第1セクション（スキル評価）の質問を選択
 */
function selectSkillQuestions(
  profession: string,
  facilityType: string,
  experienceLevel: string,
  maxCount: number
): InterviewQuestion[] {
  // デバッグ用：入力値を確認
  console.log('[v4-generator] selectSkillQuestions input:', {
    profession,
    facilityType,
    experienceLevel,
    professionLabel: getProfessionLabel(profession)
  });
  
  // 職種×施設×経験レベルでフィルタリング
  const relevantQuestions = allQuestions.filter(q => {
    // スキル評価セクションの質問のみ
    if (q.sectionId !== 'skill_evaluation' && q.section !== 'skill_evaluation') {
      return false;
    }

    // tagsが存在しない場合はスキップ
    if (!q.tags || !Array.isArray(q.tags)) {
      return false;
    }

    // 職種マッチング - 職種固有の質問を優先
    const professionLabel = getProfessionLabel(profession);
    const hasSpecificProfessionTag = q.tags.some(tag => 
      tag === profession || 
      tag === professionLabel
    );
    
    // 全職種タグは職種固有の質問がない場合のフォールバック
    const hasGenericTag = q.tags.includes('全職種');
    
    // 職種固有の質問を優先、なければ全職種を使用
    const professionMatch = hasSpecificProfessionTag || (!hasSpecificProfessionTag && hasGenericTag);

    // 施設タイプマッチング
    const facilityMatch = q.tags.some(tag =>
      tag === facilityType ||
      tag === getFacilityLabel(facilityType) ||
      !needsFacilitySpecificQuestion(q)
    );

    // 経験レベルマッチング
    const experienceMatch = !q.experienceLevels || 
      q.experienceLevels.length === 0 ||
      q.experienceLevels.includes(experienceLevel);

    return professionMatch && facilityMatch && experienceMatch;
  });

  // 職種固有の質問と汎用質問を分離
  const professionLabel = getProfessionLabel(profession);
  const specificQuestions = relevantQuestions.filter(q => 
    q.tags && q.tags.some(tag => tag === profession || tag === professionLabel)
  );
  const genericQuestions = relevantQuestions.filter(q => 
    q.tags && q.tags.includes('全職種') && !q.tags.some(tag => tag === profession || tag === professionLabel)
  );

  // デバッグ用：選択された質問を確認
  console.log('[v4-generator] Question selection:', {
    totalRelevant: relevantQuestions.length,
    specificCount: specificQuestions.length,
    genericCount: genericQuestions.length,
    firstSpecific: specificQuestions[0]?.content?.substring(0, 50),
    firstGeneric: genericQuestions[0]?.content?.substring(0, 50)
  });

  // 優先度でソート（priority 1 > 2 > 3）
  specificQuestions.sort((a, b) => a.priority - b.priority);
  genericQuestions.sort((a, b) => a.priority - b.priority);

  const selectedQuestions: InterviewQuestion[] = [];

  // まず職種固有の質問を優先的に選択
  const specificRequired = specificQuestions.filter(q => q.priority === 1);
  const specificRecommended = specificQuestions.filter(q => q.priority === 2);
  
  selectedQuestions.push(...specificRequired.slice(0, maxCount));
  
  let remainingSlots = maxCount - selectedQuestions.length;
  if (remainingSlots > 0) {
    selectedQuestions.push(...specificRecommended.slice(0, remainingSlots));
  }

  // まだ枠があれば汎用質問を追加
  remainingSlots = maxCount - selectedQuestions.length;
  if (remainingSlots > 0) {
    const genericRequired = genericQuestions.filter(q => q.priority === 1);
    selectedQuestions.push(...genericRequired.slice(0, remainingSlots));
  }

  return selectedQuestions;
}

/**
 * 第2セクション（現状確認）の質問を選択
 */
function selectStatusQuestions(duration: number): InterviewQuestion[] {
  const maxCount = duration >= 45 ? 5 : duration >= 30 ? 4 : 3;
  
  // 優先度でソート
  const sortedQuestions = [...commonStatusQuestions].sort((a, b) => a.priority - b.priority);
  
  // 必須質問を優先的に選択
  const requiredQuestions = sortedQuestions.filter(q => q.priority === 1);
  const recommendedQuestions = sortedQuestions.filter(q => q.priority === 2);
  
  const selectedQuestions: InterviewQuestion[] = [];
  selectedQuestions.push(...requiredQuestions.slice(0, maxCount));
  
  const remainingSlots = maxCount - selectedQuestions.length;
  if (remainingSlots > 0) {
    selectedQuestions.push(...recommendedQuestions.slice(0, remainingSlots));
  }
  
  return selectedQuestions;
}

/**
 * 第3セクション（キャリア）の質問を選択
 */
function selectCareerQuestions(
  experienceLevel: string,
  maxCount: number
): InterviewQuestion[] {
  const relevantQuestions = allQuestions.filter(q => {
    return (q.category === 'career_development' || 
            q.category === 'growth_development') &&
           (!q.experienceLevels || 
            q.experienceLevels.length === 0 ||
            q.experienceLevels.includes(experienceLevel));
  });

  relevantQuestions.sort((a, b) => a.priority - b.priority);
  return relevantQuestions.slice(0, maxCount);
}

/**
 * 職種ラベル取得
 */
function getProfessionLabel(profession: string): string {
  const labels: Record<string, string> = {
    'nurse': '看護師',
    'assistant_nurse': '准看護師',
    'assistant-nurse': '准看護師',  // ハイフン付き
    'nursing_assistant': '看護補助者',
    'nursing-assistant': '看護補助者',  // ハイフン付き
    'care_worker': '介護職',
    'care-worker': '介護職',  // ハイフン付き
    'therapist_pt': '理学療法士',
    'therapist-pt': '理学療法士',  // ハイフン付き
    'therapist_ot': '作業療法士',
    'therapist-ot': '作業療法士',  // ハイフン付き
    'therapist_st': '言語聴覚士',
    'therapist-st': '言語聴覚士',  // ハイフン付き
    'medical_clerk': '医事課',
    'medical-clerk': '医事課'  // ハイフン付き
  };
  return labels[profession] || profession;
}

/**
 * 施設ラベル取得
 */
function getFacilityLabel(facilityType: string): string {
  const labels: Record<string, string> = {
    'acute': '急性期',
    'chronic': '慢性期',
    'geriatric': '老健',
    'outpatient': '外来'
  };
  return labels[facilityType] || facilityType;
}

/**
 * 施設特有の質問かどうか判定
 */
function needsFacilitySpecificQuestion(question: InterviewQuestion): boolean {
  if (!question.tags || !Array.isArray(question.tags)) {
    return false;
  }
  return question.tags.some(tag => 
    ['急性期', '慢性期', '老健', '外来', 'acute', 'chronic', 'geriatric', 'outpatient'].includes(tag)
  );
}

/**
 * v4/v5準拠の面談シート生成
 */
export function generateV4InterviewSheet(params: ExtendedInterviewParams): InterviewSheetOutput {
  const { staff, interviewType, duration = 30 } = params;
  
  // マッピング適用（ハイフンをアンダースコアに変換しない）
  const profession = staff.profession; // マッピングを使わず直接使用
  const experienceLevel = experienceLevelMapping[staff.experienceLevel] || staff.experienceLevel;
  const facilityType = facilityTypeMapping[staff.facilityType || 'acute'] || 'acute';
  
  const sections: InterviewSectionInstance[] = [];
  
  // ========================================
  // 第1セクション：スキル評価（職種×経験レベル別）
  // ========================================
  // ハイフンをアンダースコアに変換してセクションキーを作成
  const professionKey = profession.replace(/-/g, '_');
  const skillSectionKey = `${professionKey}_${experienceLevel}`;
  const skillSection = skillEvaluationSections[skillSectionKey] || 
                       skillEvaluationSections[`${professionKey}_junior`] ||
                       skillEvaluationSections['nurse_junior']; // フォールバック
  
  const skillQuestionCount = duration >= 45 ? 6 : duration >= 30 ? 5 : 3;
  const skillQuestions = selectSkillQuestions(
    profession,
    facilityType,
    experienceLevel,
    skillQuestionCount
  );
  
  sections.push({
    ...skillSection,
    questions: skillQuestions,
    actualDuration: skillSection.recommendedDuration
  });
  
  // ========================================
  // 第2セクション：現状確認（全員共通）
  // ========================================
  const statusQuestions = selectStatusQuestions(duration);
  
  sections.push({
    ...commonStatusSection,
    questions: statusQuestions,
    actualDuration: commonStatusSection.recommendedDuration
  });
  
  // ========================================
  // 第3セクション：キャリア開発（経験レベル別）
  // ========================================
  if (duration >= 30) {
    const careerSection = careerSections[experienceLevel] || careerSections['junior'];
    const careerQuestionCount = duration >= 45 ? 4 : 3;
    const careerQuestions = selectCareerQuestions(experienceLevel, careerQuestionCount);
    
    sections.push({
      ...careerSection,
      questions: careerQuestions,
      actualDuration: careerSection.recommendedDuration
    });
  }
  
  // ========================================
  // 第4セクション：組織貢献（45分版のみ）
  // ========================================
  if (duration >= 45 && experienceLevel !== 'new') {
    const orgSection = organizationSections[experienceLevel] || organizationSections['junior'];
    const orgQuestions = allQuestions
      .filter(q => q.category === 'team_collaboration' || q.category === 'organization_contribution')
      .slice(0, 3);
    
    sections.push({
      ...orgSection,
      questions: orgQuestions,
      actualDuration: orgSection.recommendedDuration
    });
  }
  
  // ========================================
  // 最終セクション：アクションプラン
  // ========================================
  const actionQuestions = allQuestions
    .filter(q => q.category === 'action_planning' || q.type === 'action')
    .slice(0, 2);
  
  if (actionQuestions.length === 0) {
    // フォールバック質問
    actionQuestions.push({
      id: 'action-default-001',
      content: '今回の面談を踏まえて、次回までに取り組みたいことを教えてください。',
      type: 'open',
      category: 'action_planning',
      section: 'action_planning',
      sectionId: 'action_plan',
      priority: 1,
      minDuration: 15,
      tags: ['共通', 'アクション']
    });
  }
  
  sections.push({
    ...actionPlanSection,
    questions: actionQuestions,
    actualDuration: actionPlanSection.recommendedDuration
  });
  
  // メタデータ生成
  const metadata = {
    generatedAt: new Date().toISOString(),
    version: 'v4',
    staffProfile: {
      id: staff.id,
      name: staff.name,
      profession: getProfessionLabel(profession),
      experienceLevel: experienceLevel,
      facilityType: getFacilityLabel(facilityType),
      department: staff.department
    },
    interviewType: interviewType,
    totalDuration: duration,
    totalQuestions: sections.reduce((sum, s) => sum + s.questions.length, 0),
    sectionCount: sections.length
  };
  
  return {
    sections,
    metadata
  };
}