/**
 * ストレスチェック結果 動的アクセス制御
 *
 * 労働安全衛生法第66条の10に基づく本人同意ベースのアクセス制御
 *
 * アクセス権限:
 * - 本人: 常に自分の結果を閲覧可能
 * - システム管理者（レベル99）: 全データアクセス可能
 * - 産業医（レベル98）: 全職員の結果を閲覧可能（職務上必要）
 * - 健診担当者（レベル97）: 本人同意があれば個別結果閲覧可、集計データは常時閲覧可
 * - 人事部（レベル14-17）: 本人同意があれば閲覧可（配置転換・就業上の配慮のため）
 * - その他: アクセス不可
 */

export interface StressCheckAccessRequest {
  targetStaffId: string;         // アクセス対象の職員ID
  requestingUserId: string;      // アクセス要求者のユーザーID
  requestingUserLevel: number;   // アクセス要求者の権限レベル
  consentToShare: boolean;       // 本人の同意状況
  accessPurpose?: string;        // アクセス目的（監査ログ用）
}

export interface StressCheckAccessResult {
  allowed: boolean;                // アクセス可否
  reason: string;                  // 判定理由
  accessLevel: 'full' | 'limited' | 'aggregate' | 'none'; // アクセスレベル
  requiresAuditLog: boolean;       // 監査ログ記録が必要か
  allowedFields?: string[];        // 閲覧可能フィールド（制限付きアクセスの場合）
}

/**
 * ストレスチェック結果へのアクセス可否を判定
 *
 * @param request アクセス要求情報
 * @returns アクセス判定結果
 */
export function checkStressCheckAccess(
  request: StressCheckAccessRequest
): StressCheckAccessResult {
  const { targetStaffId, requestingUserId, requestingUserLevel, consentToShare } = request;

  // Case 1: 本人が自分の結果にアクセス
  if (targetStaffId === requestingUserId) {
    return {
      allowed: true,
      reason: '本人による自己結果の閲覧',
      accessLevel: 'full',
      requiresAuditLog: false, // 本人アクセスはログ不要
    };
  }

  // Case 2: システム管理者（レベル99）
  if (requestingUserLevel === 99) {
    return {
      allowed: true,
      reason: 'システム管理者権限',
      accessLevel: 'full',
      requiresAuditLog: true,
    };
  }

  // Case 3: 産業医（レベル98）- 職務上必要なため同意不要
  if (requestingUserLevel === 98) {
    return {
      allowed: true,
      reason: '産業医による職務上必要なアクセス（労働安全衛生法第66条の10第3項）',
      accessLevel: 'full',
      requiresAuditLog: true,
      allowedFields: [
        'stressLevel',
        'highStressFlag',
        'needsInterview',
        'answers',
        'occupationalConsultationHistory',
        'medicalOpinions',
      ],
    };
  }

  // Case 4: 健診担当者（レベル97）
  if (requestingUserLevel === 97) {
    if (consentToShare) {
      // 同意あり: 個別結果閲覧可（ただし集計・統計目的に制限）
      return {
        allowed: true,
        reason: '本人同意に基づく健診担当者アクセス',
        accessLevel: 'limited',
        requiresAuditLog: true,
        allowedFields: [
          'stressLevel',
          'highStressFlag',
          'needsInterview',
          'implementationDate',
          'consentToShare',
          'consentDate',
        ],
      };
    } else {
      // 同意なし: 集計データのみ（個人特定不可）
      return {
        allowed: false,
        reason: '本人同意なし（集計データのみアクセス可）',
        accessLevel: 'aggregate',
        requiresAuditLog: false,
      };
    }
  }

  // Case 5: 人事部門（レベル14-17: 人事部門長、副院長、院長、施設長）
  if (requestingUserLevel >= 14 && requestingUserLevel <= 17) {
    if (consentToShare) {
      return {
        allowed: true,
        reason: '本人同意に基づく人事部門アクセス（就業上の配慮措置のため）',
        accessLevel: 'limited',
        requiresAuditLog: true,
        allowedFields: [
          'stressLevel',
          'highStressFlag',
          'needsInterview',
          'implementationDate',
          'hrRecommendations', // 人事部向け推奨措置のみ
        ],
      };
    } else {
      return {
        allowed: false,
        reason: '本人同意なし（人事部門は同意がない場合アクセス不可）',
        accessLevel: 'none',
        requiresAuditLog: false,
      };
    }
  }

  // Case 6: その他の権限レベル - アクセス不可
  return {
    allowed: false,
    reason: `権限レベル ${requestingUserLevel} はストレスチェック結果へのアクセス権限がありません`,
    accessLevel: 'none',
    requiresAuditLog: false,
  };
}

/**
 * 人事部門向けストレスチェック情報取得
 * 同意状況に基づいてフィルタリングされた情報のみ返す
 *
 * @param staffId 対象職員ID
 * @param userLevel 要求者の権限レベル
 * @param consentToShare 本人の同意状況
 * @returns フィルタリングされたストレスチェック情報
 */
export interface HRViewStressCheckInfo {
  canView: boolean;
  consentRequired: boolean;
  consentStatus: boolean | null;
  displayData?: {
    stressLevel?: 'low' | 'medium' | 'high';
    highStressFlag?: boolean;
    needsInterview?: boolean;
    implementationDate?: Date;
    hrRecommendations?: string[]; // 推奨措置のみ（詳細な結果は含まない）
  };
  accessDeniedMessage?: string;
}

export function getHRViewStressCheckInfo(
  staffId: string,
  userId: string,
  userLevel: number,
  consentToShare: boolean | null
): HRViewStressCheckInfo {
  // 人事部門権限チェック（レベル14-17）
  if (userLevel < 14 || userLevel > 17) {
    return {
      canView: false,
      consentRequired: true,
      consentStatus: null,
      accessDeniedMessage: 'ストレスチェック結果の閲覧権限がありません',
    };
  }

  // 同意状況の確認
  if (consentToShare === null || consentToShare === false) {
    return {
      canView: false,
      consentRequired: true,
      consentStatus: consentToShare,
      accessDeniedMessage:
        '本人の同意が得られていないため、ストレスチェック結果は閲覧できません。' +
        '就業上の配慮措置が必要な場合は、産業医にご相談ください。',
    };
  }

  // 同意あり: 制限付きデータを返す（実際のデータはAPIから取得する想定）
  return {
    canView: true,
    consentRequired: true,
    consentStatus: true,
    displayData: {
      // 実際のデータはAPIから取得
      // ここでは表示可能なフィールドの定義のみ
    },
  };
}

/**
 * ストレスチェック結果のフィールドレベルフィルタリング
 * アクセス権限に応じて閲覧可能なフィールドのみを抽出
 *
 * @param rawData 生のストレスチェック結果データ
 * @param allowedFields 閲覧可能フィールドのリスト
 * @returns フィルタリングされたデータ
 */
export function filterStressCheckFields<T extends Record<string, any>>(
  rawData: T,
  allowedFields: string[]
): Partial<T> {
  const filtered: Partial<T> = {};

  allowedFields.forEach((field) => {
    if (field in rawData) {
      filtered[field as keyof T] = rawData[field];
    }
  });

  return filtered;
}

/**
 * 集計データ用のアクセス権限チェック
 * 個人を特定できない統計データへのアクセス判定
 *
 * @param userLevel ユーザーの権限レベル
 * @returns 集計データアクセス可否
 */
export function canAccessAggregateData(userLevel: number): boolean {
  // レベル97（健診担当者）以上は集計データアクセス可能
  return userLevel >= 97 && userLevel <= 99;
}

/**
 * アクセス理由の検証
 * 監査ログに記録するアクセス目的の妥当性を確認
 *
 * @param accessPurpose アクセス目的
 * @param userLevel ユーザー権限レベル
 * @returns 妥当性判定
 */
export function validateAccessPurpose(
  accessPurpose: string | undefined,
  userLevel: number
): { valid: boolean; message?: string } {
  // システム管理者と産業医は目的記載任意
  if (userLevel === 99 || userLevel === 98) {
    return { valid: true };
  }

  // その他の権限者は目的記載必須
  if (!accessPurpose || accessPurpose.trim().length < 10) {
    return {
      valid: false,
      message: 'アクセス目的を10文字以上で入力してください（監査ログに記録されます）',
    };
  }

  return { valid: true };
}
