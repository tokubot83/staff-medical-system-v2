/**
 * VoiceDriveDataService
 *
 * VoiceDrive側のDataConsentテーブルを参照するサービス（読み取り専用）
 *
 * 設計方針:
 * - VoiceDrive側で同意取得が完結
 * - 職員カルテ側はDataConsentテーブルを参照するのみ
 * - 書き込み操作は一切行わない
 */

import { PrismaClient } from '@prisma/client';

// VoiceDrive DataConsentの型定義
export interface VoiceDriveConsent {
  id: string;
  userId: string;
  analyticsConsent: boolean;
  analyticsConsentDate: Date | null;
  personalFeedbackConsent: boolean;
  personalFeedbackConsentDate: Date | null;
  revokeDate: Date | null;
  dataDeletionRequested: boolean;
  dataDeletionRequestedAt: Date | null;
  dataDeletionCompletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class VoiceDriveDataService {
  private prisma: PrismaClient;

  constructor() {
    // VoiceDrive DBへの接続（環境変数から取得）
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.VOICEDRIVE_DATABASE_URL || 'file:../voicedrive/prisma/dev.db'
        }
      }
    });
  }

  /**
   * 同意済みユーザーIDリストを取得
   *
   * 条件:
   * - analyticsConsent = true
   * - revokeDate IS NULL（取り消していない）
   * - dataDeletionRequested = false（削除リクエストしていない）
   */
  async getConsentedUsers(): Promise<string[]> {
    try {
      const consents = await this.prisma.$queryRaw<Array<{ userId: string }>>`
        SELECT userId
        FROM DataConsent
        WHERE analyticsConsent = 1
          AND revokeDate IS NULL
          AND dataDeletionRequested = 0
      `;

      return consents.map(c => c.userId);
    } catch (error) {
      console.error('[VoiceDriveDataService] 同意済みユーザー取得エラー:', error);
      throw new Error('VoiceDrive同意データの取得に失敗しました');
    }
  }

  /**
   * 特定ユーザーの同意状態を確認
   *
   * @param userId ユーザーID
   * @returns 同意状態（true: 同意済み、false: 未同意または取り消し済み）
   */
  async hasConsent(userId: string): Promise<boolean> {
    try {
      const consent = await this.prisma.$queryRaw<Array<VoiceDriveConsent>>`
        SELECT *
        FROM DataConsent
        WHERE userId = ${userId}
      `;

      if (consent.length === 0) {
        return false; // 同意データなし = 未同意
      }

      const consentData = consent[0];

      // 同意条件:
      // 1. analyticsConsent = true
      // 2. revokeDate IS NULL（取り消していない）
      // 3. dataDeletionRequested = false（削除リクエストしていない）
      return consentData.analyticsConsent &&
             consentData.revokeDate === null &&
             !consentData.dataDeletionRequested;
    } catch (error) {
      console.error(`[VoiceDriveDataService] ユーザー ${userId} の同意状態確認エラー:`, error);
      return false;
    }
  }

  /**
   * 削除リクエスト済みユーザーIDリストを取得
   *
   * 条件:
   * - dataDeletionRequested = true
   * - dataDeletionCompletedAt IS NULL（まだ削除完了していない）
   */
  async getDeletionRequests(): Promise<string[]> {
    try {
      const requests = await this.prisma.$queryRaw<Array<{ userId: string }>>`
        SELECT userId
        FROM DataConsent
        WHERE dataDeletionRequested = 1
          AND dataDeletionCompletedAt IS NULL
      `;

      return requests.map(r => r.userId);
    } catch (error) {
      console.error('[VoiceDriveDataService] 削除リクエスト取得エラー:', error);
      throw new Error('削除リクエストの取得に失敗しました');
    }
  }

  /**
   * 特定ユーザーの同意詳細情報を取得
   *
   * @param userId ユーザーID
   * @returns 同意詳細情報
   */
  async getConsentDetails(userId: string): Promise<VoiceDriveConsent | null> {
    try {
      const consent = await this.prisma.$queryRaw<Array<VoiceDriveConsent>>`
        SELECT *
        FROM DataConsent
        WHERE userId = ${userId}
      `;

      return consent.length > 0 ? consent[0] : null;
    } catch (error) {
      console.error(`[VoiceDriveDataService] ユーザー ${userId} の同意詳細取得エラー:`, error);
      return null;
    }
  }

  /**
   * 同意済みユーザー数を取得
   */
  async getConsentedUserCount(): Promise<number> {
    try {
      const result = await this.prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*) as count
        FROM DataConsent
        WHERE analyticsConsent = 1
          AND revokeDate IS NULL
          AND dataDeletionRequested = 0
      `;

      return result[0]?.count || 0;
    } catch (error) {
      console.error('[VoiceDriveDataService] 同意済みユーザー数取得エラー:', error);
      return 0;
    }
  }

  /**
   * 部署別同意済みユーザー数を取得
   *
   * 注意: VoiceDrive DataConsentテーブルには部署情報がないため、
   * 別途Userテーブルと結合する必要がある
   */
  async getConsentedUsersByDepartment(departments: string[]): Promise<Map<string, string[]>> {
    // この実装はUserテーブルとの結合が必要
    // VoiceDrive側のDB構造により実装方法が異なる
    console.warn('[VoiceDriveDataService] 部署別取得は未実装');
    return new Map();
  }

  /**
   * データベース接続を閉じる
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// シングルトンインスタンス
export const voiceDriveDataService = new VoiceDriveDataService();
