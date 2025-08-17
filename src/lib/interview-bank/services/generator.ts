// 定期面談バンク - 面談シート生成サービス
// スタッフプロファイルと面談パラメータに基づいて動的に面談シートを生成

import {
  ExtendedInterviewParams,
  StaffProfile,
  SelectedQuestionSet,
  QuestionSelectionCriteria,
  PositionLevel,
  GeneratedInterviewSheet,
  InterviewSectionInstance,
  InterviewQuestionInstance
} from '../types-extended';
import { 
  InterviewQuestion, 
  InterviewSection,
  ExperienceLevel,
  FacilityType,
  InterviewDuration,
  QuestionType
} from '../types';
import { questionBank } from '../database/question-bank';
import { sectionDefinitions } from '../database/sections';
import { positionQuestionMapping } from '../types-extended';

// 質問の条件チェック
function checkQuestionConditions(
  question: InterviewQuestion,
  criteria: QuestionSelectionCriteria,
  profile: StaffProfile
): boolean {
  if (!question.conditions || question.conditions.length === 0) {
    return true; // 条件がない場合は常に対象
  }
  
  for (const condition of question.conditions) {
    switch (condition.type) {
      case 'profession':
        // 職種チェック
        if (condition.operator === 'equals' && !condition.values.includes(profile.profession)) {
          return false;
        }
        break;
      case 'experienceLevel':
        if (!condition.values.includes(criteria.experienceLevel)) {
          return false;
        }
        break;
      case 'facilityType':
        if (!condition.values.includes(criteria.facility)) {
          return false;
        }
        break;
    }
  }
  return true;
}

// 質問の優先度スコアを計算
function calculateQuestionScore(
  question: InterviewQuestion,
  criteria: QuestionSelectionCriteria
): number {
  let score = 0;
  
  // 基本優先度スコア (1:必須=100, 2:推奨=50, 3:オプション=10)
  score += question.priority === 1 ? 100 : question.priority === 2 ? 50 : 10;
  
  // scoreWeightがある場合は重みを適用（具体的スキル質問は高い重みを持つ）
  if (question.scoreWeight) {
    score *= question.scoreWeight;
  }
  
  // 経験年数マッチング
  if (question.experienceLevels?.includes(criteria.experienceLevel)) {
    score += 30;
  }
  
  // 役職レベルマッチング
  if (question.positionLevels?.includes(criteria.positionLevel)) {
    score += 25;
  }
  
  // 施設タイプマッチング
  if (question.facilityTypes?.includes(criteria.facility)) {
    score += 20;
  }
  
  // 部署マッチング
  if (criteria.department && question.departments?.includes(criteria.department)) {
    score += 15;
  }
  
  // 動機タイプマッチング
  if (criteria.motivationType && question.motivationTypes?.includes(criteria.motivationType)) {
    score += 35;
  }
  
  // 時間枠適合性
  if (question.minDuration <= criteria.duration) {
    score += 10;
  }
  
  return score;
}

// セクションごとの質問数を決定
function determineQuestionCount(
  sectionType: string,
  duration: InterviewDuration,
  positionLevel: PositionLevel
): number {
  const baseCount = {
    15: { core: 2, optional: 1 },
    30: { core: 4, optional: 2 },
    45: { core: 6, optional: 3 },
    60: { core: 8, optional: 4 }
  };
  
  const counts = baseCount[duration];
  
  // 管理職は追加の質問が必要
  const isManagement = ['chief', 'assistant_manager', 'manager', 'deputy_director', 'director', 'executive'].includes(positionLevel);
  
  if (isManagement) {
    return counts.core + Math.floor(counts.optional / 2);
  }
  
  return counts.core;
}

// 質問を選択
function selectQuestions(
  availableQuestions: InterviewQuestion[],
  criteria: QuestionSelectionCriteria,
  maxCount: number,
  profile: StaffProfile
): InterviewQuestion[] {
  // 条件に合致する質問のみをフィルタリング
  const eligibleQuestions = availableQuestions.filter(q => 
    checkQuestionConditions(q, criteria, profile)
  );
  
  // スコアを計算してソート
  const scoredQuestions = eligibleQuestions.map(q => ({
    question: q,
    score: calculateQuestionScore(q, criteria)
  }));
  
  scoredQuestions.sort((a, b) => b.score - a.score);
  
  // 必須質問を優先的に選択（優先度1を全て選択し、スコア順で取得）
  const requiredQuestions = scoredQuestions
    .filter(sq => sq.question.priority === 1)
    .slice(0, Math.min(maxCount, Math.ceil(maxCount * 0.8))) // 80%を必須質問に割り当て
    .map(sq => sq.question);
  
  // 残りの枠で推奨・オプション質問を追加
  const remainingCount = maxCount - requiredQuestions.length;
  const additionalQuestions = scoredQuestions
    .filter(sq => !requiredQuestions.includes(sq.question))
    .slice(0, remainingCount)
    .map(sq => sq.question);
  
  return [...requiredQuestions, ...additionalQuestions];
}

// セクションを生成
function generateSection(
  sectionDef: InterviewSection,
  criteria: QuestionSelectionCriteria,
  sectionIndex: number,
  profile: StaffProfile
): InterviewSectionInstance {
  const questionCount = determineQuestionCount(sectionDef.type, criteria.duration, criteria.positionLevel);
  
  // セクションに関連する質問を取得（sectionIdまたはsectionタイプでマッチング）
  const sectionQuestions = questionBank.filter(q => 
    q.sectionId === sectionDef.id || 
    q.section === sectionDef.type ||
    q.category === sectionDef.type
  );
  
  // 質問を選択（プロファイルを渡す）
  const selectedQuestions = selectQuestions(sectionQuestions, criteria, questionCount, profile);
  
  // 質問インスタンスに変換
  const questionInstances: InterviewQuestionInstance[] = selectedQuestions.map((q, index) => ({
    questionId: `q_${sectionIndex}_${index}`,
    content: q.content,
    type: q.type,
    required: q.priority === 1,
    placeholder: q.placeholder,
    options: q.options?.map(opt => ({
      value: opt.value,
      label: opt.label
    })),
    scoreWeight: q.scoreWeight || 1.0,
    tags: q.tags
  }));
  
  return {
    sectionId: `section_${sectionIndex}`,
    name: sectionDef.name,
    type: sectionDef.type,
    description: sectionDef.description,
    questions: questionInstances,
    displayOrder: sectionIndex + 1,
    isRequired: sectionDef.priority === 1
  };
}

// メインの生成関数
export function generateInterviewSheet(params: ExtendedInterviewParams): GeneratedInterviewSheet {
  const criteria: QuestionSelectionCriteria = {
    experienceLevel: params.staff.experienceLevel,
    positionLevel: params.staff.positionLevel,
    department: params.staff.department,
    facility: params.staff.facility,
    duration: params.duration,
    motivationType: undefined // 初回は未定
  };
  
  // 役職に基づいて必要なセクションを決定
  const positionConfig = positionQuestionMapping[params.staff.positionLevel];
  const requiredSectionTypes = positionConfig.requiredSections;
  const optionalSectionTypes = positionConfig.optionalSections;
  
  // 時間に応じてセクション数を調整
  const maxSections = {
    15: 3,
    30: 5,
    45: 7,
    60: 10
  };
  
  const totalSectionCount = Math.min(
    requiredSectionTypes.length + optionalSectionTypes.length,
    maxSections[params.duration]
  );
  
  // セクションを選択
  const selectedSectionTypes = [
    ...requiredSectionTypes,
    ...optionalSectionTypes.slice(0, totalSectionCount - requiredSectionTypes.length)
  ];
  
  // カスタムセクションの追加/除外を処理
  if (params.customSections) {
    selectedSectionTypes.push(...params.customSections.filter(s => !selectedSectionTypes.includes(s)));
  }
  if (params.excludeSections) {
    const excludeSet = new Set(params.excludeSections);
    const filteredTypes = selectedSectionTypes.filter(s => !excludeSet.has(s));
    selectedSectionTypes.length = 0;
    selectedSectionTypes.push(...filteredTypes);
  }
  
  // セクションインスタンスを生成
  const sections: InterviewSectionInstance[] = [];
  let totalQuestions = 0;
  
  selectedSectionTypes.forEach((sectionType, index) => {
    const sectionDef = sectionDefinitions.find(s => s.type === sectionType);
    if (sectionDef) {
      const section = generateSection(sectionDef, criteria, index, params.staff);
      sections.push(section);
      totalQuestions += section.questions.length;
    }
  });
  
  // 推定所要時間を計算（1質問あたり約2-3分）
  const estimatedDuration = Math.min(
    totalQuestions * 2.5,
    params.duration
  );
  
  return {
    id: `sheet_${Date.now()}`,
    params: {
      staffId: params.staff.id,
      staffName: params.staff.name,
      experienceLevel: params.staff.experienceLevel,
      positionLevel: params.staff.positionLevel,
      facility: params.staff.facility,
      department: params.staff.department,
      profession: params.staff.profession,
      duration: params.duration,
      interviewDate: params.interviewDate,
      interviewerId: params.interviewerId,
      interviewerName: params.interviewerName
    },
    sections,
    totalQuestions,
    estimatedDuration: Math.round(estimatedDuration),
    createdAt: new Date(),
    status: 'draft'
  };
}

// 動機タイプに基づいて追加質問を生成
export function generateMotivationFollowUp(
  motivationType: string,
  experienceLevel: ExperienceLevel,
  duration: InterviewDuration
): InterviewQuestionInstance[] {
  const motivationQuestions = questionBank.filter(q => 
    q.motivationTypes?.includes(motivationType as any) &&
    q.experienceLevels?.includes(experienceLevel) &&
    q.minDuration <= duration
  );
  
  const maxQuestions = duration >= 45 ? 3 : duration >= 30 ? 2 : 1;
  
  return motivationQuestions
    .slice(0, maxQuestions)
    .map((q, index) => ({
      questionId: `motivation_followup_${index}`,
      content: q.content,
      type: q.type,
      required: false,
      placeholder: q.placeholder,
      options: q.options?.map(opt => ({
        value: opt.value,
        label: opt.label
      })),
      scoreWeight: q.scoreWeight || 1.0,
      tags: [...(q.tags || []), '動機タイプフォローアップ']
    }));
}

// 面談結果のサマリーを生成
export function generateInterviewSummary(
  sheet: GeneratedInterviewSheet,
  responses: Record<string, any>,
  motivationType?: string
): {
  completionRate: number;
  keyFindings: string[];
  recommendedActions: string[];
  nextInterviewTopics: string[];
  riskFactors?: string[];
} {
  // 完了率を計算
  let answeredCount = 0;
  let totalRequired = 0;
  
  sheet.sections.forEach(section => {
    const sectionResponses = responses[section.sectionId] || {};
    section.questions.forEach(question => {
      if (question.required) {
        totalRequired++;
        if (sectionResponses[question.questionId]) {
          answeredCount++;
        }
      }
    });
  });
  
  const completionRate = totalRequired > 0 ? Math.round((answeredCount / totalRequired) * 100) : 0;
  
  // キーファインディングスを生成
  const keyFindings: string[] = [];
  const recommendedActions: string[] = [];
  const nextInterviewTopics: string[] = [];
  const riskFactors: string[] = [];
  
  // スコアが低い項目を特定
  sheet.sections.forEach(section => {
    const sectionResponses = responses[section.sectionId] || {};
    section.questions.forEach(question => {
      if (question.type === 'scale') {
        const score = sectionResponses[question.questionId];
        if (score && score <= 2) {
          riskFactors.push(`${question.content} (スコア: ${score}/5)`);
          recommendedActions.push(`${question.content}の改善支援`);
        } else if (score && score >= 4) {
          keyFindings.push(`${question.content}が高評価`);
        }
      }
    });
  });
  
  // 動機タイプに基づく推奨事項
  if (motivationType) {
    const motivationActions = getMotivationActions(motivationType, sheet.params.experienceLevel);
    recommendedActions.push(...motivationActions.recommended);
    nextInterviewTopics.push(...motivationActions.followUpTopics);
  }
  
  return {
    completionRate,
    keyFindings: keyFindings.slice(0, 5),
    recommendedActions: recommendedActions.slice(0, 5),
    nextInterviewTopics: nextInterviewTopics.slice(0, 3),
    riskFactors: riskFactors.length > 0 ? riskFactors.slice(0, 3) : undefined
  };
}

// 動機タイプ別のアクションを取得
function getMotivationActions(motivationType: string, experienceLevel: ExperienceLevel) {
  const actions: Record<string, any> = {
    growth: {
      recommended: [
        '新しいプロジェクトやタスクへの参加機会を提供',
        '外部研修や資格取得の支援',
        'メンター制度の活用'
      ],
      followUpTopics: [
        'スキル開発の進捗確認',
        '新たな挑戦課題の設定'
      ]
    },
    recognition: {
      recommended: [
        '成果の可視化と定期的なフィードバック',
        '表彰制度への推薦',
        'チーム内での成果共有機会の創出'
      ],
      followUpTopics: [
        '評価制度への満足度',
        '承認欲求の充足状況'
      ]
    },
    stability: {
      recommended: [
        '業務プロセスの標準化と明確化',
        '長期的なキャリアパスの提示',
        '安定した勤務環境の維持'
      ],
      followUpTopics: [
        '職場環境の安定性',
        '将来への不安要因'
      ]
    },
    teamwork: {
      recommended: [
        'チームビルディング活動への参加',
        '協働プロジェクトの推進',
        'コミュニケーション機会の増加'
      ],
      followUpTopics: [
        'チーム関係性の変化',
        '協働の成功事例'
      ]
    },
    efficiency: {
      recommended: [
        '業務改善提案の募集と実施',
        'プロセス最適化プロジェクトへの参加',
        '効率化ツールの導入検討'
      ],
      followUpTopics: [
        '改善提案の実施状況',
        '効率化の成果測定'
      ]
    },
    compensation: {
      recommended: [
        '成果連動型インセンティブの検討',
        'キャリアアップ支援',
        '福利厚生の改善検討'
      ],
      followUpTopics: [
        '待遇への満足度',
        'キャリア目標の確認'
      ]
    },
    creativity: {
      recommended: [
        '創造的なプロジェクトへの参加',
        'アイデア提案制度の活用',
        '自由度の高い業務環境の提供'
      ],
      followUpTopics: [
        '創造性を発揮できる機会',
        'イノベーション活動への参加'
      ]
    }
  };
  
  return actions[motivationType] || { recommended: [], followUpTopics: [] };
}

// TypeScript型定義の追加
export interface GeneratedInterviewSheet {
  id: string;
  params: {
    staffId: string;
    staffName: string;
    experienceLevel: ExperienceLevel;
    positionLevel: PositionLevel;
    facility: FacilityType;
    department: string;
    profession: string;
    duration: InterviewDuration;
    interviewDate: Date;
    interviewerId: string;
    interviewerName: string;
  };
  sections: InterviewSectionInstance[];
  totalQuestions: number;
  estimatedDuration: number;
  createdAt: Date;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
}