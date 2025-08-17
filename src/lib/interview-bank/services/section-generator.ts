// セクション動的生成サービス
// v4/v5シートの構造に基づいてセクションと質問を動的に生成

import { 
  InterviewSection,
  InterviewQuestion,
  FacilityType,
  ProfessionType,
  ExperienceLevel,
  InterviewDuration,
  InterviewSectionInstance,
  InterviewQuestionInstance,
  QuestionType
} from '../types';

import { sectionDefinitions, selectSectionsForInterview, getSkillEvaluationTitle } from '../database/section-definitions';
import { 
  commonStatusQuestions,
  commonCareerQuestions,
  commonActionPlanQuestions,
  commonInterviewerNotesQuestions
} from '../database/common-questions';
import { 
  acuteSkillQuestions,
  outpatientSkillQuestions,
  rokenSkillQuestions,
  chronicSkillQuestions
} from '../database/facility-skill-questions';

// 施設タイプごとのスキル質問マッピング
const facilitySkillQuestionsMap: Record<string, InterviewQuestion[]> = {
  acute: acuteSkillQuestions,
  outpatient: outpatientSkillQuestions,
  roken: rokenSkillQuestions,
  chronic: chronicSkillQuestions,
  clinic: [], // クリニック用は今後追加
  grouphome: [] // グループホーム用は今後追加
};

// セクションタイプごとの共通質問マッピング
const sectionQuestionsMap: Record<string, InterviewQuestion[]> = {
  current_status: commonStatusQuestions,
  career_development: commonCareerQuestions,
  action_plan: commonActionPlanQuestions,
  feedback_reflection: commonInterviewerNotesQuestions
};

// 質問を選択する関数
function selectQuestionsForSection(
  section: InterviewSection,
  facilityType: FacilityType,
  profession: ProfessionType,
  experienceLevel: ExperienceLevel,
  duration: InterviewDuration
): InterviewQuestion[] {
  let availableQuestions: InterviewQuestion[] = [];

  // スキル評価セクションの場合は施設別の質問を使用
  if (section.type === 'skill_evaluation') {
    const facilityQuestions = facilitySkillQuestionsMap[facilityType] || [];
    availableQuestions = facilityQuestions.filter(q => {
      // 職種条件をチェック
      if (q.conditions && q.conditions.length > 0) {
        for (const condition of q.conditions) {
          if (condition.type === 'profession' && condition.values && !condition.values.includes(profession)) {
            return false;
          }
        }
      }
      // 最小時間をチェック
      return q.minDuration <= duration;
    });
  } else {
    // その他のセクションは共通質問を使用
    availableQuestions = sectionQuestionsMap[section.type] || [];
    availableQuestions = availableQuestions.filter(q => {
      // 経験レベル条件をチェック
      if (q.conditions && q.conditions.length > 0) {
        for (const condition of q.conditions) {
          if (condition.type === 'experienceLevel' && condition.values && !condition.values.includes(experienceLevel)) {
            return false;
          }
        }
      }
      // 最小時間をチェック
      return q.minDuration <= duration;
    });
  }

  // 時間に応じた質問数を決定
  const maxQuestions = section.maxQuestions[duration];
  
  // 優先度でソート（優先度1が最優先）
  availableQuestions.sort((a, b) => {
    const priorityDiff = a.priority - b.priority;
    if (priorityDiff !== 0) return priorityDiff;
    // 同じ優先度の場合はscoreWeightで比較
    return (b.scoreWeight || 1) - (a.scoreWeight || 1);
  });

  // 最大数まで選択
  return availableQuestions.slice(0, maxQuestions);
}

// 質問インスタンスに変換
function convertToQuestionInstance(
  question: InterviewQuestion,
  index: number,
  sectionIndex: number
): InterviewQuestionInstance {
  return {
    questionId: `q_${sectionIndex}_${index}`,
    content: question.content,
    type: question.type,
    required: question.priority === 1,
    placeholder: question.placeholder,
    options: question.options?.map(opt => ({
      value: opt.value,
      label: opt.label,
      score: opt.score
    })),
    validations: question.validations
  };
}

// セクションインスタンスを生成
export function generateSectionInstance(
  section: InterviewSection,
  facilityType: FacilityType,
  profession: ProfessionType,
  experienceLevel: ExperienceLevel,
  duration: InterviewDuration,
  sectionIndex: number
): InterviewSectionInstance {
  // セクション名をカスタマイズ（スキル評価の場合）
  let sectionName = section.name;
  if (section.type === 'skill_evaluation') {
    sectionName = getSkillEvaluationTitle(facilityType, profession);
  }

  // 質問を選択
  const selectedQuestions = selectQuestionsForSection(
    section,
    facilityType,
    profession,
    experienceLevel,
    duration
  );

  // 質問インスタンスに変換
  const questionInstances = selectedQuestions.map((q, index) => 
    convertToQuestionInstance(q, index, sectionIndex)
  );

  return {
    sectionId: section.id,
    name: sectionName,
    type: section.type,
    description: section.description,
    questions: questionInstances,
    displayOrder: section.order,
    isRequired: section.priority === 1
  };
}

// 面談シート用のセクション生成
export function generateInterviewSections(
  facilityType: FacilityType,
  profession: ProfessionType,
  experienceLevel: ExperienceLevel,
  duration: InterviewDuration
): InterviewSectionInstance[] {
  // 条件に合うセクションを選択
  const selectedSections = selectSectionsForInterview(
    duration,
    experienceLevel,
    facilityType,
    profession
  );

  // セクションインスタンスを生成
  const sectionInstances: InterviewSectionInstance[] = [];
  selectedSections.forEach((section, index) => {
    const instance = generateSectionInstance(
      section,
      facilityType,
      profession,
      experienceLevel,
      duration,
      index
    );
    
    // 質問が1つ以上あるセクションのみ追加
    if (instance.questions.length > 0) {
      sectionInstances.push(instance);
    }
  });

  return sectionInstances;
}

// セクション時間配分を計算
export function calculateSectionTimeAllocation(
  sections: InterviewSectionInstance[],
  totalDuration: number
): Map<string, number> {
  const timeAllocation = new Map<string, number>();
  
  // 各セクションの推奨時間（分）
  const sectionBaseTime: Record<string, number> = {
    skill_evaluation: 8,
    current_status: 8,
    career_development: 8,
    action_plan: 4,
    feedback_reflection: 2,
    team_environment: 5,
    innovation_improvement: 5,
    leadership_management: 10,
    motivation_assessment: 5
  };

  // 基本時間を割り当て
  let totalBaseTime = 0;
  sections.forEach(section => {
    const baseTime = sectionBaseTime[section.type] || 5;
    timeAllocation.set(section.sectionId, baseTime);
    totalBaseTime += baseTime;
  });

  // 時間調整（総時間に合わせて比例配分）
  if (totalBaseTime !== totalDuration) {
    const ratio = totalDuration / totalBaseTime;
    timeAllocation.forEach((time, sectionId) => {
      timeAllocation.set(sectionId, Math.round(time * ratio));
    });
  }

  return timeAllocation;
}

// セクションのプレビューテキストを生成
export function generateSectionPreview(section: InterviewSectionInstance): string {
  const questionCount = section.questions.length;
  const requiredCount = section.questions.filter(q => q.required).length;
  
  let preview = `${section.name}\n`;
  preview += `質問数: ${questionCount}問（必須: ${requiredCount}問）\n`;
  
  if (section.description) {
    preview += `${section.description}\n`;
  }
  
  // 最初の3つの質問を表示
  const previewQuestions = section.questions.slice(0, 3);
  previewQuestions.forEach((q, index) => {
    preview += `${index + 1}. ${q.content}${q.required ? ' *' : ''}\n`;
  });
  
  if (questionCount > 3) {
    preview += `... 他${questionCount - 3}問\n`;
  }
  
  return preview;
}

// セクションの検証
export function validateSections(sections: InterviewSectionInstance[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 必須セクションの確認
  const hasSkillEvaluation = sections.some(s => s.type === 'skill_evaluation');
  const hasCurrentStatus = sections.some(s => s.type === 'current_status');
  
  if (!hasSkillEvaluation) {
    errors.push('スキル評価セクションが見つかりません');
  }
  
  if (!hasCurrentStatus) {
    errors.push('職員の現状確認セクションが見つかりません');
  }
  
  // 各セクションの質問数を確認
  sections.forEach(section => {
    if (section.questions.length === 0) {
      errors.push(`${section.name}に質問がありません`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}