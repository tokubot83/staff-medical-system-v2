/**
 * DataDeletionBatchService
 *
 * VoiceDriveデータ削除処理バッチ
 *
 * 処理フロー:
 * 1. VoiceDrive DataConsentテーブルから削除リクエスト取得
 * 2. VoiceDriveデータを論理削除
 * 3. VoiceDrive削除完了API呼び出し
 */

import { voiceDriveDataService } from './VoiceDriveDataService';

// 削除結果の型定義
export interface DeletionResult {
  userId: string;
  success: boolean;
  deletedItemCount: number;
  error?: string;
}

// 削除完了通知のレスポンス型
interface DeletionCompletionResponse {
  success: boolean;
  message: string;
  userId: string;
  completedAt: string;
}

export class DataDeletionBatchService {
  private readonly VOICEDRIVE_API_URL = process.env.VOICEDRIVE_API_URL || 'http://localhost:5173';

  /**
   * 削除処理バッチ実行
   *
   * @returns 削除結果のリスト
   */
  async processDeletionRequests(): Promise<DeletionResult[]> {
    console.log('[削除バッチ] 開始');

    try {
      // 1. 削除リクエスト取得
      const userIdsToDelete = await voiceDriveDataService.getDeletionRequests();

      console.log(`[削除バッチ] 削除リクエスト: ${userIdsToDelete.length}件`);

      if (userIdsToDelete.length === 0) {
        console.log('[削除バッチ] 削除対象なし。処理終了');
        return [];
      }

      // 2. 各ユーザーのデータを削除
      const results: DeletionResult[] = [];

      for (const userId of userIdsToDelete) {
        try {
          const result = await this.deleteUserData(userId);
          results.push(result);
        } catch (error) {
          console.error(`[削除バッチ] ユーザー ${userId} の削除エラー:`, error);
          results.push({
            userId,
            success: false,
            deletedItemCount: 0,
            error: error instanceof Error ? error.message : '不明なエラー'
          });
        }
      }

      // 3. サマリーログ
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      console.log(`[削除バッチ] 完了: 成功 ${successCount}件, 失敗 ${failureCount}件`);

      return results;

    } catch (error) {
      console.error('[削除バッチ] 致命的エラー:', error);
      throw error;
    }
  }

  /**
   * 特定ユーザーのデータ削除
   *
   * @param userId ユーザーID
   * @returns 削除結果
   */
  private async deleteUserData(userId: string): Promise<DeletionResult> {
    console.log(`[削除処理] ユーザー ${userId} のデータ削除開始`);

    try {
      // 1. VoiceDriveデータを論理削除
      const deletedCount = await this.softDeleteVoiceDriveData(userId);

      console.log(`[削除処理] ユーザー ${userId}: ${deletedCount}件を論理削除`);

      // 2. VoiceDrive削除完了API呼び出し
      await this.notifyDeletionCompleted(userId, deletedCount);

      console.log(`[削除処理] ユーザー ${userId}: 削除完了通知送信成功`);

      return {
        userId,
        success: true,
        deletedItemCount: deletedCount
      };

    } catch (error) {
      console.error(`[削除処理] ユーザー ${userId} エラー:`, error);
      throw error;
    }
  }

  /**
   * VoiceDriveデータの論理削除
   *
   * 注意: 法令上の保存義務があるデータは削除しない
   *
   * @param userId ユーザーID
   * @returns 削除件数
   */
  private async softDeleteVoiceDriveData(userId: string): Promise<number> {
    // TODO: 実際のVoiceDriveデータ削除処理を実装
    // 現状はダミー実装（統合テスト用）

    console.log(`[論理削除] ユーザー ${userId} のVoiceDriveデータを論理削除中...`);

    // ダミー: 削除件数を返す（実際はDB操作）
    const deletedCount = Math.floor(Math.random() * 50) + 1; // 1-50件

    // 実際の実装例:
    // const posts = await prisma.voiceDrivePosts.updateMany({
    //   where: { userId, isAnonymous: false },
    //   data: { isDeleted: true, deletedAt: new Date() }
    // });
    //
    // const votes = await prisma.voiceDriveVotes.updateMany({
    //   where: { userId },
    //   data: { isDeleted: true, deletedAt: new Date() }
    // });
    //
    // const comments = await prisma.voiceDriveComments.updateMany({
    //   where: { userId },
    //   data: { isDeleted: true, deletedAt: new Date() }
    // });
    //
    // deletedCount = posts.count + votes.count + comments.count;

    console.log(`[論理削除] ユーザー ${userId}: ${deletedCount}件を削除`);

    return deletedCount;
  }

  /**
   * VoiceDrive削除完了API呼び出し
   *
   * @param userId ユーザーID
   * @param deletedItemCount 削除件数
   */
  private async notifyDeletionCompleted(userId: string, deletedItemCount: number): Promise<void> {
    const apiUrl = `${this.VOICEDRIVE_API_URL}/api/consent/deletion-completed`;

    const requestBody = {
      userId,
      deletedAt: new Date().toISOString(),
      deletedItemCount
    };

    console.log(`[削除完了通知] API呼び出し: ${apiUrl}`);
    console.log(`[削除完了通知] リクエスト:`, requestBody);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`削除完了API呼び出しエラー: ${response.status} ${errorText}`);
      }

      const result: DeletionCompletionResponse = await response.json();

      console.log(`[削除完了通知] 成功:`, result);

    } catch (error) {
      console.error(`[削除完了通知] エラー:`, error);
      throw new Error(`削除完了API呼び出しに失敗: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  /**
   * 手動実行用メソッド（テスト・デバッグ用）
   *
   * @param userId 削除対象ユーザーID
   */
  async deleteUserDataManually(userId: string): Promise<DeletionResult> {
    console.log(`[手動削除] ユーザー ${userId} の削除を開始`);
    return await this.deleteUserData(userId);
  }

  /**
   * 削除リクエスト一覧取得（確認用）
   */
  async listDeletionRequests(): Promise<string[]> {
    return await voiceDriveDataService.getDeletionRequests();
  }
}

// シングルトンインスタンス
export const dataDeletionBatchService = new DataDeletionBatchService();
