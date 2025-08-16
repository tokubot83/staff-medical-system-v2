/**
 * 特別面談生成サービス
 * 退職、異動、復職、昇進、懲戒面談の動的生成
 */

import {
  BankGenerationParams,
  GeneratedBankSheet,
  BankSection,
  BankQuestion,
  StaffBankProfile
} from '../types';

import {
  specialQuestions,
  specialQuestionsByType,
  specialInterviewDuration,
  specialInterviewSensitivity
} from '../database/special-questions';

// 特別面談タイプ
export type SpecialInterviewType = 'exit' | 'transfer' | 'return' | 'promotion' | 'disciplinary';

// 退職面談サブタイプ
export type ExitInterviewSubType = 'probation' | 'regular' | 'voluntary' | 'involuntary' | 'general';

// 昇進面談サブタイプ  
export type PromotionInterviewSubType = 'general' | 'management';

// 特別面談生成パラメータ
export interface SpecialGenerationParams extends BankGenerationParams {
  specialType: SpecialInterviewType;
  subType?: string;
  reason?: string;
  urgentProcessing?: boolean;
  confidentialLevel?: 'normal' | 'high' | 'critical';
  metadata?: {
    exitReason?: string;
    transferDetails?: string;
    healthRelated?: boolean;
    performanceIssue?: boolean;
    [key: string]: any;
  };
}

/**
 * 特別面談シートを生成
 */
export function generateSpecialInterview(
  params: SpecialGenerationParams,
  staffProfile: StaffBankProfile
): GeneratedBankSheet {
  const sections: BankSection[] = [];
  
  // 1. 導入セクション
  sections.push(generateSpecialIntroSection(params, staffProfile));
  
  // 2. タイプ別メインセクション
  const mainSections = generateMainSections(params, staffProfile);
  sections.push(...mainSections);
  
  // 3. 面談者記入欄（機密性の高い面談）
  if (specialInterviewSensitivity[params.specialType] === 'high' || 
      specialInterviewSensitivity[params.specialType] === 'critical') {
    sections.push(generateInterviewerSection(params));
  }
  
  // 4. 手続き・フォローアップセクション
  sections.push(generateProcedureSection(params));
  
  const title = generateInterviewTitle(params);
  const duration = getDuration(params);
  
  return {
    id: `special_${params.specialType}_${Date.now()}`,
    title,
    description: generateDescription(params),
    sections,
    params: {
      interviewDate: params.interviewDate || new Date(),
      duration: duration
    },
    totalQuestions: sections.reduce((total, section) => total + section.questions.length, 0),
    estimatedDuration: duration,
    metadata: {
      generatedAt: new Date(),
      generationParams: params,
      staffProfile,
      estimatedDuration: duration,
      confidentialLevel: params.confidentialLevel || specialInterviewSensitivity[params.specialType],
      specialType: params.specialType,
      subType: params.subType
    }
  } as any;
}

/**
 * 導入セクション生成
 */
function generateSpecialIntroSection(
  params: SpecialGenerationParams,
  staffProfile: StaffBankProfile
): BankSection {
  const questions: BankQuestion[] = [];
  
  // 面談の目的説明
  questions.push({
    id: 'special_intro_purpose',
    category: 'introduction',
    questionText: getIntroductionText(params),
    questionType: 'information',
    tags: ['導入', '説明'],
    priority: 1,
    estimatedTime: 2,
    metadata: {
      informationOnly: true
    }
  });
  
  // 体調確認
  questions.push({
    id: 'special_intro_wellbeing',
    category: 'introduction',
    questionText: '体調はいかがですか？何かご質問はありますか？',
    questionType: 'text',
    tags: ['導入', '体調確認'],
    priority: 1,
    estimatedTime: 2
  });
  
  return {
    id: 'special_intro',
    title: '面談の導入',
    description: '面談の目的と進行について',
    questions,
    duration: 5,
    order: 1
  };
}

/**
 * メインセクション生成
 */
function generateMainSections(
  params: SpecialGenerationParams,
  staffProfile: StaffBankProfile
): BankSection[] {
  const sections: BankSection[] = [];
  
  switch (params.specialType) {
    case 'exit':
      sections.push(...generateExitSections(params, staffProfile));
      break;
    case 'transfer':
      sections.push(generateTransferSection(params));
      break;
    case 'return':
      sections.push(generateReturnSection(params));
      break;
    case 'promotion':
      sections.push(generatePromotionSection(params));
      break;
    case 'disciplinary':
      sections.push(generateDisciplinarySection(params));
      break;
  }
  
  return sections;
}

/**
 * 退職面談セクション生成
 */
function generateExitSections(
  params: SpecialGenerationParams,
  staffProfile: StaffBankProfile
): BankSection[] {
  const sections: BankSection[] = [];
  const subType = (params.subType as ExitInterviewSubType) || 'general';
  
  // 退職理由セクション
  const reasonQuestions = getQuestionsByIds([
    'exit_001', 'exit_002', 'exit_003', 'exit_004'
  ]);
  sections.push({
    id: 'exit_reason',
    title: '退職理由の確認',
    description: '退職を決意された理由について',
    questions: reasonQuestions,
    duration: 8,
    order: 2
  });
  
  // 試用期間職員の場合は期待値ギャップセクションを追加
  if (subType === 'probation' || staffProfile.experienceYears < 1) {
    const gapQuestions = getQuestionsByIds([
      'exit_expectation_001', 'exit_expectation_002', 'exit_expectation_003', 'exit_expectation_004'
    ]);
    sections.push({
      id: 'exit_expectation_gap',
      title: '採用・入職時のギャップ',
      description: '期待と現実の違いについて',
      questions: gapQuestions,
      duration: 8,
      order: 3
    });
  }
  
  // 教育・サポート体制セクション
  const trainingQuestions = getQuestionsByIds([
    'exit_training_001', 'exit_training_002', 'exit_training_003'
  ]);
  if (subType === 'probation') {
    trainingQuestions.push(...getQuestionsByIds(['exit_training_004']));
  }
  sections.push({
    id: 'exit_training',
    title: '教育・サポート体制の評価',
    description: '研修や指導体制について',
    questions: trainingQuestions,
    duration: 7,
    order: 4
  });
  
  // 改善提案セクション
  if (subType !== 'involuntary') {
    const improvementQuestions = getQuestionsByIds([
      'exit_improvement_001', 'exit_improvement_002', 'exit_improvement_003', 'exit_improvement_004'
    ]);
    sections.push({
      id: 'exit_improvement',
      title: '改善提案とフィードバック',
      description: '組織への提案と感謝',
      questions: improvementQuestions,
      duration: 5,
      order: 5
    });
  }
  
  return sections;
}

/**
 * 異動面談セクション生成
 */
function generateTransferSection(params: SpecialGenerationParams): BankSection {
  const questions = getQuestionsByIds(specialQuestionsByType.transfer);
  
  return {
    id: 'transfer_main',
    title: '異動に関する確認',
    description: '異動の詳細と準備について',
    questions,
    duration: 15,
    order: 2
  };
}

/**
 * 復職面談セクション生成
 */
function generateReturnSection(params: SpecialGenerationParams): BankSection {
  const questions = getQuestionsByIds(specialQuestionsByType.return);
  
  return {
    id: 'return_main',
    title: '復職に向けた確認',
    description: '復職準備と支援について',
    questions,
    duration: 20,
    order: 2
  };
}

/**
 * 昇進面談セクション生成
 */
function generatePromotionSection(params: SpecialGenerationParams): BankSection {
  const subType = (params.subType as PromotionInterviewSubType) || 'general';
  const questionIds = typeof specialQuestionsByType.promotion === 'object' 
    ? specialQuestionsByType.promotion[subType] || specialQuestionsByType.promotion.general
    : specialQuestionsByType.promotion;
  
  const questions = getQuestionsByIds(questionIds);
  
  return {
    id: 'promotion_main',
    title: '昇進に関する確認',
    description: '新しい役職と責任について',
    questions,
    duration: 15,
    order: 2
  };
}

/**
 * 懲戒面談セクション生成
 */
function generateDisciplinarySection(params: SpecialGenerationParams): BankSection {
  const questions = getQuestionsByIds(specialQuestionsByType.disciplinary);
  
  return {
    id: 'disciplinary_main',
    title: '事実確認と改善について',
    description: '規律違反に関する確認',
    questions,
    duration: 20,
    order: 2
  };
}

/**
 * 面談者記入欄セクション生成
 */
function generateInterviewerSection(params: SpecialGenerationParams): BankSection {
  const questions: BankQuestion[] = [];
  
  if (params.specialType === 'exit') {
    questions.push(
      {
        id: 'interviewer_exit_cause',
        category: 'interviewer_notes',
        questionText: '早期退職の主要因',
        questionType: 'single_choice',
        options: ['採用ミスマッチ', '教育不足', '職場環境', '本人要因', 'その他'],
        tags: ['面談者記入', '主要因'],
        priority: 1,
        estimatedTime: 2
      },
      {
        id: 'interviewer_exit_priority',
        category: 'interviewer_notes',
        questionText: '改善優先度',
        questionType: 'multiple_choice',
        options: ['採用方法', '初期研修', 'OJT体制', 'フォロー体制', '職場環境'],
        tags: ['面談者記入', '改善優先度'],
        priority: 1,
        estimatedTime: 2
      },
      {
        id: 'interviewer_exit_recommendations',
        category: 'interviewer_notes',
        questionText: '採用・教育部門への具体的提言',
        questionType: 'text',
        tags: ['面談者記入', '提言'],
        priority: 1,
        estimatedTime: 3
      }
    );
  }
  
  // 共通項目
  questions.push({
    id: 'interviewer_followup',
    category: 'interviewer_notes',
    questionText: 'フォローアップ事項',
    questionType: 'text',
    tags: ['面談者記入', 'フォローアップ'],
    priority: 1,
    estimatedTime: 3
  });
  
  return {
    id: 'interviewer_section',
    title: '面談者記入欄',
    description: '面談実施者による記録',
    questions,
    duration: 5,
    order: 98
  };
}

/**
 * 手続きセクション生成
 */
function generateProcedureSection(params: SpecialGenerationParams): BankSection {
  const questions: BankQuestion[] = [];
  
  if (params.specialType === 'exit') {
    questions.push(...getQuestionsByIds(['exit_procedure_001', 'exit_future_001']));
  }
  
  // 最終出勤日確認（該当する場合）
  if (params.specialType === 'exit' || params.specialType === 'transfer') {
    questions.push({
      id: 'procedure_last_day',
      category: 'procedures',
      questionText: '最終出勤日（または異動日）',
      questionType: 'date',
      tags: ['手続き', '日程'],
      priority: 1,
      estimatedTime: 1
    });
  }
  
  return {
    id: 'procedure_section',
    title: '手続き確認',
    description: '必要な手続きと日程',
    questions,
    duration: 5,
    order: 99
  };
}

/**
 * 質問IDから質問オブジェクトを取得
 */
function getQuestionsByIds(questionIds: string[]): BankQuestion[] {
  return specialQuestions.filter(q => questionIds.includes(q.id));
}

/**
 * 面談タイトル生成
 */
function generateInterviewTitle(params: SpecialGenerationParams): string {
  const titles: Record<SpecialInterviewType, string> = {
    exit: '退職面談',
    transfer: '異動面談', 
    return: '復職面談',
    promotion: '昇進面談',
    disciplinary: '懲戒面談'
  };
  
  let title = titles[params.specialType];
  
  if (params.subType) {
    const subTitles: Record<string, string> = {
      probation: '（試用期間中職員）',
      regular: '（正職員）',
      voluntary: '（自己都合）',
      involuntary: '（会社都合）',
      management: '（管理職）'
    };
    
    if (subTitles[params.subType]) {
      title += subTitles[params.subType];
    }
  }
  
  return title;
}

/**
 * 面談説明文生成
 */
function generateDescription(params: SpecialGenerationParams): string {
  const descriptions: Record<SpecialInterviewType, string> = {
    exit: '退職に関する詳細確認と改善点の聞き取り',
    transfer: '部署異動に関する説明と準備の確認',
    return: '復職に向けた準備状況と支援の確認',
    promotion: '昇進に関する説明と役割の確認',
    disciplinary: '規律違反に関する事実確認と改善指導'
  };
  
  return descriptions[params.specialType];
}

/**
 * 導入文生成
 */
function getIntroductionText(params: SpecialGenerationParams): string {
  const introTexts: Record<SpecialInterviewType, string> = {
    exit: '本日は退職面談の時間をいただき、ありがとうございます。退職に関する詳細確認と、今後の改善に向けたフィードバックをお聞かせください。',
    transfer: '部署異動についてご相談させていただきます。異動の詳細説明と、ご質問・ご要望をお聞かせください。',
    return: '復職面談を実施いたします。復職に向けた準備状況と必要な支援について確認させてください。',
    promotion: '昇進についてご相談させていただきます。新しい役職の詳細と、期待・不安な点をお聞かせください。',
    disciplinary: '本日は貴重な時間をいただき、ありがとうございます。事実確認と今後の改善について話し合わせていただきます。'
  };
  
  return introTexts[params.specialType];
}

/**
 * 面談時間取得
 */
function getDuration(params: SpecialGenerationParams): number {
  if (params.duration) {
    return params.duration;
  }
  
  const baseDuration = specialInterviewDuration[params.specialType];
  
  if (typeof baseDuration === 'object') {
    return baseDuration[params.subType as keyof typeof baseDuration] || 
           baseDuration.general || 
           Object.values(baseDuration)[0];
  }
  
  return baseDuration;
}

/**
 * 特別面談結果の分析
 */
export function analyzeSpecialInterviewResult(
  responses: Array<{ questionId: string; answer: string }>,
  specialType: SpecialInterviewType,
  subType?: string
): {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  recommendedActions: string[];
  keyInsights: string[];
  followUpNeeded: boolean;
} {
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  const recommendedActions: string[] = [];
  const keyInsights: string[] = [];
  
  // 退職面談の特別分析
  if (specialType === 'exit') {
    const hasHarassment = responses.some(r => 
      r.answer.toLowerCase().includes('ハラスメント') || 
      r.answer.toLowerCase().includes('いじめ')
    );
    
    const hasSystemicIssue = responses.some(r =>
      r.answer.toLowerCase().includes('教育不足') ||
      r.answer.toLowerCase().includes('サポート不足')
    );
    
    if (hasHarassment) {
      riskLevel = 'critical';
      recommendedActions.push('人事部門への即時報告');
      recommendedActions.push('ハラスメント調査の実施');
      keyInsights.push('ハラスメント疑義あり');
    }
    
    if (hasSystemicIssue) {
      if (riskLevel === 'low') riskLevel = 'high';
      recommendedActions.push('教育・研修体制の見直し');
      keyInsights.push('教育・サポート体制に課題');
    }
    
    if (subType === 'probation') {
      recommendedActions.push('採用プロセスの検証');
      keyInsights.push('早期離職ケース - 採用ミスマッチの可能性');
    }
  }
  
  // 復職面談の分析
  if (specialType === 'return') {
    const needsSupport = responses.some(r =>
      r.answer.toLowerCase().includes('不安') ||
      r.answer.toLowerCase().includes('心配')
    );
    
    if (needsSupport) {
      riskLevel = 'medium';
      recommendedActions.push('段階的復職プログラムの検討');
      recommendedActions.push('産業医との連携');
      keyInsights.push('復職支援が必要');
    }
  }
  
  // 懲戒面談の分析
  if (specialType === 'disciplinary') {
    riskLevel = 'high'; // 懲戒面談は基本的にリスクが高い
    recommendedActions.push('改善計画の策定');
    recommendedActions.push('定期的なフォローアップ');
    keyInsights.push('規律違反対応');
  }
  
  return {
    riskLevel,
    actionRequired: riskLevel !== 'low',
    recommendedActions: [...new Set(recommendedActions)],
    keyInsights,
    followUpNeeded: riskLevel === 'high' || riskLevel === 'critical'
  };
}