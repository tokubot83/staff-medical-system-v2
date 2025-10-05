/**
 * VoiceDriveAnalyticsService
 *
 * VoiceDriveデータの分析を行うサービス
 *
 * プライバシー保護:
 * - K-匿名性チェック（最小5名ルール）
 * - 匿名投稿の完全保護
 * - 同意済みユーザーのみ分析対象
 */

import { voiceDriveDataService } from './VoiceDriveDataService';

// 分析フィルタの型定義
export interface AnalysisFilters {
  startDate?: Date;
  endDate?: Date;
  departments?: string[];
  jobCategories?: string[];
  facilityId?: string;
}

// 分析結果の型定義
export interface AnalysisResult {
  totalUsers: number;
  consentedUsers: number;
  kAnonymityCheck: {
    passed: boolean;
    userCount: number;
    minimumRequired: number;
  };
  analysis?: {
    // 実際の分析結果（K-匿名性チェック通過時のみ）
    postCount: number;
    voteCount: number;
    commentCount: number;
  };
}

// K-匿名性エラー
export class KAnonymityError extends Error {
  constructor(public userCount: number, public minimumRequired: number = 5) {
    super(`K-匿名性要件未達: 対象ユーザー${userCount}名（最低${minimumRequired}名必要）`);
    this.name = 'KAnonymityError';
  }
}

export class VoiceDriveAnalyticsService {
  private readonly K_ANONYMITY_MINIMUM = 5; // K-匿名性の最小人数

  /**
   * K-匿名性チェック
   *
   * @param userIds ユーザーIDリスト
   * @returns チェック結果（true: 合格, false: 不合格）
   * @throws KAnonymityError K-匿名性要件を満たさない場合
   */
  checkKAnonymity(userIds: string[]): boolean {
    const userCount = userIds.length;

    if (userCount < this.K_ANONYMITY_MINIMUM) {
      throw new KAnonymityError(userCount, this.K_ANONYMITY_MINIMUM);
    }

    console.log(`[K-匿名性チェック] OK: ${userCount}名 >= ${this.K_ANONYMITY_MINIMUM}名`);
    return true;
  }

  /**
   * VoiceDriveデータ分析（K-匿名性チェック付き）
   *
   * @param filters 分析フィルタ
   * @returns 分析結果
   */
  async analyzeVoiceDriveData(filters: AnalysisFilters = {}): Promise<AnalysisResult> {
    try {
      // 1. 同意済みユーザー取得
      const consentedUserIds = await voiceDriveDataService.getConsentedUsers();

      console.log(`[VoiceDrive分析] 同意済みユーザー: ${consentedUserIds.length}名`);

      // 2. フィルタ適用（将来実装）
      const filteredUserIds = this.applyFilters(consentedUserIds, filters);

      console.log(`[VoiceDrive分析] フィルタ適用後: ${filteredUserIds.length}名`);

      // 3. K-匿名性チェック
      try {
        this.checkKAnonymity(filteredUserIds);
      } catch (error) {
        if (error instanceof KAnonymityError) {
          // K-匿名性要件未達の場合、エラー情報を含む結果を返す
          return {
            totalUsers: filteredUserIds.length,
            consentedUsers: filteredUserIds.length,
            kAnonymityCheck: {
              passed: false,
              userCount: error.userCount,
              minimumRequired: error.minimumRequired
            }
          };
        }
        throw error;
      }

      // 4. 分析実行（K-匿名性チェック通過時のみ）
      const analysisData = await this.performAnalysis(filteredUserIds);

      return {
        totalUsers: filteredUserIds.length,
        consentedUsers: filteredUserIds.length,
        kAnonymityCheck: {
          passed: true,
          userCount: filteredUserIds.length,
          minimumRequired: this.K_ANONYMITY_MINIMUM
        },
        analysis: analysisData
      };

    } catch (error) {
      console.error('[VoiceDrive分析] エラー:', error);
      throw error;
    }
  }

  /**
   * 部署別分析（K-匿名性チェック付き）
   *
   * @param departments 部署リスト
   * @returns 部署別分析結果
   */
  async analyzeByDepartments(departments: string[]): Promise<Map<string, AnalysisResult>> {
    const results = new Map<string, AnalysisResult>();

    for (const department of departments) {
      try {
        const result = await this.analyzeVoiceDriveData({
          departments: [department]
        });
        results.set(department, result);
      } catch (error) {
        console.error(`[部署別分析] ${department} のエラー:`, error);
        // エラーの場合もK-匿名性要件未達として記録
        if (error instanceof KAnonymityError) {
          results.set(department, {
            totalUsers: error.userCount,
            consentedUsers: error.userCount,
            kAnonymityCheck: {
              passed: false,
              userCount: error.userCount,
              minimumRequired: error.minimumRequired
            }
          });
        }
      }
    }

    return results;
  }

  /**
   * フィルタ適用
   *
   * @param userIds ユーザーIDリスト
   * @param filters フィルタ条件
   * @returns フィルタ適用後のユーザーIDリスト
   */
  private applyFilters(userIds: string[], filters: AnalysisFilters): string[] {
    // TODO: 実際のフィルタリングロジックを実装
    // 現状は全ユーザーを返す（統合テスト用）

    if (filters.departments && filters.departments.length > 0) {
      console.log(`[フィルタ] 部署フィルタ: ${filters.departments.join(', ')}`);
      // 部署フィルタの実装（将来）
    }

    if (filters.jobCategories && filters.jobCategories.length > 0) {
      console.log(`[フィルタ] 職種フィルタ: ${filters.jobCategories.join(', ')}`);
      // 職種フィルタの実装（将来）
    }

    if (filters.startDate || filters.endDate) {
      console.log(`[フィルタ] 期間フィルタ: ${filters.startDate} ~ ${filters.endDate}`);
      // 期間フィルタの実装（将来）
    }

    // 現状はフィルタなしで全ユーザーを返す
    return userIds;
  }

  /**
   * 実際の分析処理
   *
   * @param userIds 分析対象ユーザーIDリスト
   * @returns 分析データ
   */
  private async performAnalysis(userIds: string[]): Promise<{
    postCount: number;
    voteCount: number;
    commentCount: number;
  }> {
    // TODO: VoiceDrive投稿・投票・コメントデータの集計
    // 現状はダミーデータを返す（統合テスト用）

    console.log(`[分析実行] ${userIds.length}名のデータを分析中...`);

    return {
      postCount: userIds.length * 3, // ダミー: 1人あたり3投稿
      voteCount: userIds.length * 10, // ダミー: 1人あたり10投票
      commentCount: userIds.length * 5 // ダミー: 1人あたり5コメント
    };
  }

  /**
   * K-匿名性チェック結果の表示用メッセージ生成
   *
   * @param result 分析結果
   * @returns ユーザー向けメッセージ
   */
  getKAnonymityMessage(result: AnalysisResult): string {
    if (result.kAnonymityCheck.passed) {
      return `分析可能: ${result.kAnonymityCheck.userCount}名のユーザーデータを分析します。`;
    } else {
      return `🔒 データ保護のため表示できません\n\n` +
             `この条件では対象者が${result.kAnonymityCheck.userCount}名のため、` +
             `プライバシー保護の観点から分析結果を表示できません。\n\n` +
             `より広い範囲（部署・職種・期間等）で再度お試しください。\n` +
             `（最低${result.kAnonymityCheck.minimumRequired}名必要）`;
    }
  }
}

// シングルトンインスタンス
export const voiceDriveAnalyticsService = new VoiceDriveAnalyticsService();
