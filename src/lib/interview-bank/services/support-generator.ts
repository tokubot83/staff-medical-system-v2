/**
 * サポート面談生成サービス
 * VoiceDriveカテゴリに基づいて動的に面談シートを生成
 */

import {
  BankGenerationParams,
  GeneratedBankSheet,
  BankSection,
  BankQuestion,
  StaffBankProfile
} from '../types';

import {
  supportQuestions,
  supportQuestionsByCategory,
  questionPriorityByUrgency
} from '../database/support-questions';

import { VoiceDriveInterviewRequest } from '@/services/voicedriveIntegrationService';

// サポート面談生成パラメータ
export interface SupportGenerationParams extends BankGenerationParams {
  category: string; // VoiceDriveカテゴリ
  subcategory?: string;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
  consultationTopic: string;
  consultationDetails: string;
  voiceDriveRequestId?: string;
}

/**
 * VoiceDriveリクエストからサポート面談シートを生成
 */
export function generateSupportInterviewFromVoiceDrive(
  request: VoiceDriveInterviewRequest,
  staffProfile: StaffBankProfile,
  duration: number = 30
): GeneratedBankSheet {
  const params: SupportGenerationParams = {
    interviewType: 'support',
    category: request.category,
    subcategory: request.subcategory,
    urgency: request.urgency as 'urgent' | 'high' | 'medium' | 'low',
    consultationTopic: request.consultationTopic,
    consultationDetails: request.consultationDetails,
    voiceDriveRequestId: request.requestId,
    duration,
    interviewDate: new Date(),
    interviewerId: 'system'
  };

  return generateSupportInterview(params, staffProfile);
}

/**
 * サポート面談シートを生成
 */
export function generateSupportInterview(
  params: SupportGenerationParams,
  staffProfile: StaffBankProfile
): GeneratedBankSheet {
  const sections: BankSection[] = [];
  const urgencyConfig = questionPriorityByUrgency[params.urgency];
  
  // 1. 導入セクション
  sections.push(generateIntroductionSection(params, staffProfile));
  
  // 2. 相談内容の深掘りセクション
  sections.push(generateConsultationDetailSection(params));
  
  // 3. カテゴリ別の主要セクション
  const mainSection = generateCategorySection(
    params.category,
    params.subcategory,
    urgencyConfig.priorityThreshold,
    Math.floor(params.duration * 0.5) // 時間の50%を割り当て
  );
  if (mainSection.questions.length > 0) {
    sections.push(mainSection);
  }
  
  // 4. 関連カテゴリのセクション（緊急度に応じて）
  if (params.duration >= 45) {
    urgencyConfig.focusCategories
      .filter(cat => cat !== params.category)
      .slice(0, 2)
      .forEach(category => {
        const relatedSection = generateCategorySection(
          category,
          undefined,
          urgencyConfig.priorityThreshold + 1,
          10 // 各10分
        );
        if (relatedSection.questions.length > 0) {
          sections.push(relatedSection);
        }
      });
  }
  
  // 5. アクションプラン・フォローアップセクション
  sections.push(generateActionPlanSection(params));
  
  return {
    id: `support_${Date.now()}`,
    title: `サポート面談 - ${getCategoryLabel(params.category)}`,
    description: params.consultationTopic,
    sections,
    metadata: {
      generatedAt: new Date(),
      generationParams: params,
      staffProfile,
      estimatedDuration: params.duration,
      voiceDriveRequestId: params.voiceDriveRequestId
    }
  };
}

/**
 * 導入セクション生成
 */
function generateIntroductionSection(
  params: SupportGenerationParams,
  staffProfile: StaffBankProfile
): BankSection {
  return {
    id: 'support_intro',
    title: '導入・アイスブレイク',
    description: '面談の雰囲気作りと相談内容の確認',
    questions: [
      {
        id: 'intro_greeting',
        category: 'introduction',
        questionText: '最近の体調や業務の状況はいかがですか？',
        questionType: 'text',
        tags: ['導入'],
        priority: 1,
        estimatedTime: 2,
        metadata: {
          purpose: '緊張をほぐし、話しやすい雰囲気を作る'
        }
      },
      {
        id: 'intro_topic_confirm',
        category: 'introduction',
        questionText: `「${params.consultationTopic}」について相談したいとのことでしたが、詳しくお聞かせください`,
        questionType: 'text',
        tags: ['相談確認'],
        priority: 1,
        estimatedTime: 3,
        metadata: {
          voiceDriveDetails: params.consultationDetails
        }
      }
    ],
    duration: 5,
    order: 1
  };
}

/**
 * 相談内容詳細セクション生成
 */
function generateConsultationDetailSection(
  params: SupportGenerationParams
): BankSection {
  const questions: BankQuestion[] = [
    {
      id: 'detail_background',
      category: 'consultation',
      questionText: 'この問題が始まったきっかけや背景を教えてください',
      questionType: 'text',
      tags: ['背景確認'],
      priority: 1,
      estimatedTime: 3
    },
    {
      id: 'detail_impact',
      category: 'consultation',
      questionText: 'この問題が業務や生活にどのような影響を与えていますか？',
      questionType: 'text',
      tags: ['影響確認'],
      priority: 1,
      estimatedTime: 3
    }
  ];
  
  // 緊急度が高い場合は早急な対応が必要か確認
  if (params.urgency === 'urgent' || params.urgency === 'high') {
    questions.push({
      id: 'detail_immediate_action',
      category: 'consultation',
      questionText: 'すぐに対応が必要な事項はありますか？',
      questionType: 'text',
      tags: ['緊急対応'],
      priority: 1,
      estimatedTime: 2,
      metadata: {
        critical: true
      }
    });
  }
  
  return {
    id: 'support_detail',
    title: '相談内容の詳細確認',
    description: '問題の背景と影響の把握',
    questions,
    duration: Math.min(10, params.duration * 0.2),
    order: 2
  };
}

/**
 * カテゴリ別セクション生成
 */
function generateCategorySection(
  category: string,
  subcategory: string | undefined,
  priorityThreshold: number,
  duration: number
): BankSection {
  const categoryQuestionIds = supportQuestionsByCategory[category as keyof typeof supportQuestionsByCategory] || [];
  
  // 該当カテゴリの質問を取得
  let questions = supportQuestions.filter(q => 
    categoryQuestionIds.includes(q.id) &&
    q.priority <= priorityThreshold
  );
  
  // サブカテゴリでフィルタリング
  if (subcategory) {
    const subcategoryQuestions = questions.filter(q => 
      q.metadata?.subcategory === subcategory
    );
    if (subcategoryQuestions.length > 0) {
      questions = subcategoryQuestions;
    }
  }
  
  // 時間制限に基づいて質問数を調整
  const maxQuestions = Math.floor(duration / 3); // 1質問あたり平均3分
  questions = questions
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxQuestions);
  
  return {
    id: `support_${category}`,
    title: getCategoryLabel(category),
    description: getCategoryDescription(category),
    questions,
    duration,
    order: 3
  };
}

/**
 * アクションプランセクション生成
 */
function generateActionPlanSection(params: SupportGenerationParams): BankSection {
  const questions: BankQuestion[] = [
    {
      id: 'action_solution',
      category: 'action_plan',
      questionText: '今回の相談内容について、どのような解決策を希望されますか？',
      questionType: 'text',
      tags: ['解決策'],
      priority: 1,
      estimatedTime: 3
    },
    {
      id: 'action_support',
      category: 'action_plan',
      questionText: '組織として提供できるサポートはどのようなものが良いでしょうか？',
      questionType: 'text',
      tags: ['サポート'],
      priority: 1,
      estimatedTime: 3
    }
  ];
  
  // フォローアップの必要性確認
  if (params.urgency === 'urgent' || params.urgency === 'high') {
    questions.push({
      id: 'action_followup',
      category: 'action_plan',
      questionText: '次回のフォローアップ面談はいつ頃が良いですか？',
      questionType: 'text',
      tags: ['フォローアップ'],
      priority: 1,
      estimatedTime: 2
    });
  }
  
  questions.push({
    id: 'action_satisfaction',
    category: 'action_plan',
    questionText: '今回の面談で相談内容は解決に向かいそうですか？',
    questionType: 'scale',
    options: ['解決した', 'ほぼ解決した', '一部解決した', 'まだ課題がある', '解決していない'],
    tags: ['満足度'],
    priority: 2,
    estimatedTime: 2
  });
  
  return {
    id: 'support_action',
    title: 'アクションプランとフォローアップ',
    description: '今後の対応と支援の確認',
    questions,
    duration: 10,
    order: 99
  };
}

/**
 * カテゴリラベル取得
 */
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    career: 'キャリア相談',
    workplace: '職場環境',
    relationships: '人間関係',
    worklife: 'ワークライフバランス',
    health: '健康・メンタルヘルス',
    skills: 'スキル・研修',
    evaluation: '評価・処遇',
    other: 'その他'
  };
  return labels[category] || category;
}

/**
 * カテゴリ説明取得
 */
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    career: 'キャリアプラン、昇進、配置転換に関する相談',
    workplace: '職場環境、設備、安全性に関する相談',
    relationships: '上司・同僚との関係、チームワークに関する相談',
    worklife: '勤務時間、休暇、家族との両立に関する相談',
    health: '体調、ストレス、メンタルヘルスに関する相談',
    skills: 'スキル開発、研修、教育機会に関する相談',
    evaluation: '評価制度、給与、待遇に関する相談',
    other: 'その他の相談事項'
  };
  return descriptions[category] || '';
}

/**
 * サポート面談結果の分析
 */
export function analyzeSupportInterviewResult(
  responses: Array<{ questionId: string; answer: string }>,
  category: string
): {
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiresFollowUp: boolean;
  recommendedActions: string[];
  riskFactors: string[];
} {
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  const riskFactors: string[] = [];
  const recommendedActions: string[] = [];
  
  // 回答内容からリスク要因を分析
  responses.forEach(response => {
    const answer = response.answer.toLowerCase();
    
    // ハラスメント関連
    if (answer.includes('ハラスメント') || answer.includes('いじめ') || answer.includes('差別')) {
      severity = 'critical';
      riskFactors.push('ハラスメントの可能性');
      recommendedActions.push('人事部門への即時報告');
      recommendedActions.push('詳細な事実確認の実施');
    }
    
    // 健康関連
    if (answer.includes('不眠') || answer.includes('体調不良') || answer.includes('うつ')) {
      if (severity !== 'critical') severity = 'high';
      riskFactors.push('健康上の懸念');
      recommendedActions.push('産業医面談の手配');
      recommendedActions.push('メンタルヘルスサポートの提供');
    }
    
    // 退職意向
    if (answer.includes('退職') || answer.includes('辞める') || answer.includes('転職')) {
      if (severity === 'low') severity = 'medium';
      riskFactors.push('離職リスク');
      recommendedActions.push('キャリア面談の実施');
      recommendedActions.push('待遇改善の検討');
    }
    
    // 業務過多
    if (answer.includes('残業') || answer.includes('過労') || answer.includes('忙しい')) {
      if (severity === 'low') severity = 'medium';
      riskFactors.push('業務負荷過多');
      recommendedActions.push('業務量の見直し');
      recommendedActions.push('人員配置の検討');
    }
  });
  
  // カテゴリ別の追加アクション
  switch (category) {
    case 'health':
      recommendedActions.push('定期的な健康チェックイン');
      break;
    case 'career':
      recommendedActions.push('キャリア開発計画の策定');
      break;
    case 'relationships':
      recommendedActions.push('チームビルディングの実施');
      break;
    case 'worklife':
      recommendedActions.push('勤務体制の見直し');
      break;
  }
  
  return {
    severity,
    requiresFollowUp: severity !== 'low',
    recommendedActions: [...new Set(recommendedActions)], // 重複除去
    riskFactors
  };
}