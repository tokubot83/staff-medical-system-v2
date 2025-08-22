// V3評価システム バリデーション・制御サービス

import {
  V3EvaluationDesignValidation,
  EvaluationItemMatrix,
  V3ScheduleControl,
  PersonalEvaluationPrecheck,
  V3ValidationError
} from '@/types/evaluation-validation-v3';
import { FacilityTypeV3, JobCategoryV3, ExperienceLevelV3 } from '@/types/evaluation-v3';

/**
 * 現在の年間スケジュール制御情報を取得
 */
export const getCurrentScheduleControl = (): V3ScheduleControl => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  
  // 月別フェーズマッピング
  const phaseMap: Record<number, string> = {
    1: '年度末評価期間',
    2: '評価結果開示',
    3: '新年度移行期',
    4: '前年度フィードバック',
    5: '上半期計画',
    6: '夏季組織貢献評価',
    7: '夏季組織貢献評価',
    8: '夏季組織貢献評価',
    9: '下半期準備',
    10: '技術評価準備',
    11: '技術評価実施',
    12: '冬季組織貢献評価'
  };

  const currentPhase = phaseMap[currentMonth] || '年度末評価期間';

  // フェーズ別許可アクション設定
  const getAllowedActions = (month: number) => {
    switch (month) {
      case 1:
      case 2:
        return {
          canDesignEvaluation: true,
          canApproveDesign: true,
          canStartPersonalEvaluation: false,
          canConductTechnicalEval: false,
          canConductContributionEval: false,
          canDiscloseResults: false
        };
      case 3:
        return {
          canDesignEvaluation: false,
          canApproveDesign: false,
          canStartPersonalEvaluation: true,
          canConductTechnicalEval: true,
          canConductContributionEval: false,
          canDiscloseResults: false
        };
      case 6:
      case 7:
      case 8:
      case 12:
        return {
          canDesignEvaluation: false,
          canApproveDesign: false,
          canStartPersonalEvaluation: false,
          canConductTechnicalEval: false,
          canConductContributionEval: true,
          canDiscloseResults: false
        };
      case 4:
        return {
          canDesignEvaluation: false,
          canApproveDesign: false,
          canStartPersonalEvaluation: false,
          canConductTechnicalEval: false,
          canConductContributionEval: false,
          canDiscloseResults: true
        };
      default:
        return {
          canDesignEvaluation: false,
          canApproveDesign: false,
          canStartPersonalEvaluation: false,
          canConductTechnicalEval: false,
          canConductContributionEval: false,
          canDiscloseResults: false
        };
    }
  };

  const allowedActions = getAllowedActions(currentMonth);

  // 次のマイルストーン計算
  const getNextMilestone = (month: number) => {
    const milestones: Record<number, { phase: string; dueDate: string; requiredActions: string[] }> = {
      1: {
        phase: '評価結果開示',
        dueDate: '2月28日',
        requiredActions: ['制度設計完了', '法人承認取得']
      },
      2: {
        phase: '技術評価実施',
        dueDate: '3月31日',
        requiredActions: ['制度設計承認完了', '評価項目確定', '評価者研修実施']
      },
      3: {
        phase: '前年度フィードバック',
        dueDate: '4月30日',
        requiredActions: ['技術評価完了', '総合判定実施', '結果確定']
      }
    };

    return milestones[month] || {
      phase: '次年度準備',
      dueDate: '未定',
      requiredActions: ['スケジュール確認']
    };
  };

  const nextMilestone = getNextMilestone(currentMonth);

  // 制約事項生成
  const getRestrictions = (month: number) => {
    const restrictions = [];
    
    if (!allowedActions.canStartPersonalEvaluation) {
      restrictions.push({
        action: '個人評価開始',
        reason: '制度設計・承認フェーズのため',
        availableFrom: '3月1日'
      });
    }

    if (!allowedActions.canDesignEvaluation && month >= 3) {
      restrictions.push({
        action: '制度設計変更',
        reason: '評価実施期間中のため',
        availableFrom: '翌年1月1日'
      });
    }

    return restrictions;
  };

  return {
    currentPhase,
    currentMonth,
    allowedActions,
    nextMilestone,
    restrictions: getRestrictions(currentMonth)
  };
};

/**
 * 制度設計完了状況を検証
 */
export const validateEvaluationDesign = async (
  facilityType: FacilityTypeV3,
  year: number
): Promise<V3EvaluationDesignValidation> => {
  try {
    // モックデータ - 実際の実装ではデータベースから取得
    const mockValidation: V3EvaluationDesignValidation = {
      id: `design_${facilityType}_${year}`,
      year,
      facilityType,
      facilityName: getFacilityName(facilityType),
      status: 'draft', // 'draft' | 'reviewing' | 'approved' | 'active'
      
      technicalEvaluation: {
        coreItemsComplete: false,     // 法人統一30点未設定
        facilityItemsComplete: false, // 施設固有20点未設定
        totalConfigured: 0,
        totalRequired: 5,            // C01, C02, C03 + 施設固有項目2つ
        completionRate: 0
      },
      
      contributionEvaluation: {
        facilityContributionComplete: false,
        corporateContributionComplete: false,
        evaluationCriteriaComplete: false
      },
      
      canStartPersonalEvaluation: false,
      blockingIssues: [
        '法人統一項目（C01-C03）の配点設計が未完了',
        '施設特化項目の選定・配点が未完了',
        '貢献度評価基準が未設定',
        '制度設計の承認が未完了'
      ],
      warnings: [
        '現在はドラフト状態です。2月末までに承認を完了してください。'
      ],
      
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 完了率計算
    let configuredItems = 0;
    if (mockValidation.technicalEvaluation.coreItemsComplete) configuredItems += 3;
    if (mockValidation.technicalEvaluation.facilityItemsComplete) configuredItems += 2;
    
    mockValidation.technicalEvaluation.completionRate = 
      (configuredItems / mockValidation.technicalEvaluation.totalRequired) * 100;

    // 個人評価開始可能判定
    mockValidation.canStartPersonalEvaluation = 
      mockValidation.status === 'approved' &&
      mockValidation.technicalEvaluation.coreItemsComplete &&
      mockValidation.technicalEvaluation.facilityItemsComplete &&
      mockValidation.contributionEvaluation.facilityContributionComplete &&
      mockValidation.contributionEvaluation.corporateContributionComplete;

    return mockValidation;

  } catch (error) {
    throw new V3ValidationError(
      'DESIGN_VALIDATION_FAILED',
      `制度設計の検証に失敗しました: ${facilityType}`,
      { facilityType, year, error }
    );
  }
};

/**
 * 個人評価開始前の前提条件チェック
 */
export const checkPersonalEvaluationPrerequisites = async (
  staffId: string
): Promise<PersonalEvaluationPrecheck> => {
  try {
    // スタッフ情報取得（モック）
    const staffData = {
      id: staffId,
      name: '山田 花子',
      facilityType: 'acute' as FacilityTypeV3,
      jobCategory: 'nurse' as JobCategoryV3,
      experienceLevel: 'midlevel' as ExperienceLevelV3
    };

    // 制度設計状況チェック
    const designValidation = await validateEvaluationDesign(
      staffData.facilityType,
      new Date().getFullYear()
    );

    // スケジュール制御チェック
    const scheduleControl = getCurrentScheduleControl();

    // 前提条件判定
    const prerequisites = {
      designApproved: designValidation.status === 'approved',
      schedulePhaseValid: scheduleControl.allowedActions.canStartPersonalEvaluation,
      itemsConfigured: designValidation.technicalEvaluation.coreItemsComplete && 
                      designValidation.technicalEvaluation.facilityItemsComplete,
      evaluatorAssigned: true // モックでは常にtrue
    };

    // ブロッキング問題の特定
    const blockingIssues = [];
    
    if (!prerequisites.designApproved) {
      blockingIssues.push({
        type: 'critical' as const,
        message: '制度設計が未承認のため評価を開始できません',
        resolution: '制度設計タブで設計を完了し、承認を取得してください'
      });
    }

    if (!prerequisites.schedulePhaseValid) {
      blockingIssues.push({
        type: 'critical' as const,
        message: '現在のスケジュールフェーズでは個人評価を実施できません',
        resolution: `${scheduleControl.nextMilestone.phase}まで待機してください`
      });
    }

    if (!prerequisites.itemsConfigured) {
      blockingIssues.push({
        type: 'critical' as const,
        message: '評価項目の設定が未完了です',
        resolution: '法人統一項目と施設特化項目の配点設定を完了してください'
      });
    }

    // 評価可能判定
    const canStartEvaluation = Object.values(prerequisites).every(Boolean);

    return {
      staffId: staffData.id,
      staffName: staffData.name,
      facilityType: staffData.facilityType,
      jobCategory: staffData.jobCategory,
      experienceLevel: staffData.experienceLevel,
      prerequisites,
      canStartEvaluation,
      blockingIssues,
      availableItems: {
        coreItems: 3,          // C01, C02, C03
        facilityItems: 2,      // 施設特化項目
        totalPoints: 50        // 技術評価50点
      },
      checkedAt: new Date()
    };

  } catch (error) {
    throw new V3ValidationError(
      'PRECHECK_FAILED',
      `個人評価前提条件チェックに失敗しました: ${staffId}`,
      { staffId, error }
    );
  }
};

/**
 * 施設・職種・経験年数マッピング取得
 */
export const getEvaluationItemMatrix = async (
  facilityType: FacilityTypeV3,
  jobCategory: JobCategoryV3,
  experienceLevel: ExperienceLevelV3
): Promise<EvaluationItemMatrix> => {
  // モックデータ - 実際の実装では設定から取得
  return {
    id: `matrix_${facilityType}_${jobCategory}_${experienceLevel}`,
    facilityType,
    jobCategory,
    experienceLevel,
    
    requiredItems: {
      coreItems: {
        C01: { points: 10, configured: false },
        C02: { points: 10, configured: false },
        C03: { points: 10, configured: false }
      },
      facilityItems: [
        {
          itemId: 'F01',
          itemName: '施設特化項目1',
          points: 10,
          configured: false,
          category: '専門技術'
        },
        {
          itemId: 'F02',
          itemName: '施設特化項目2', 
          points: 10,
          configured: false,
          category: '業務効率'
        }
      ]
    },
    
    isEvaluationReady: false,
    missingItems: ['C01配点設定', 'C02配点設定', 'C03配点設定', 'F01項目設定', 'F02項目設定'],
    configurationProgress: 0
  };
};

// ヘルパー関数
const getFacilityName = (facilityType: FacilityTypeV3): string => {
  const names: Record<FacilityTypeV3, string> = {
    acute: '急性期病院',
    chronic: '慢性期病院', 
    roken: '老健施設',
    grouphome: 'グループホーム',
    outpatient: '外来クリニック'
  };
  return names[facilityType] || '不明な施設';
};