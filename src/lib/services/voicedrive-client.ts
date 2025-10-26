/**
 * VoiceDrive APIクライアント
 *
 * 用途: 医療システムからVoiceDrive APIを呼び出す
 * 主な機能:
 *  - データ分析同意状態の取得
 *  - トークン管理（自動更新）
 *
 * @see mcp-shared/docs/SettingsPage_医療システム確認結果_20251026.md
 */

import axios, { AxiosInstance } from 'axios';
import { generateJWT } from '@/lib/middleware/jwt-auth';

/**
 * データ分析同意状態レスポンス型定義
 */
export interface ConsentStatusResponse {
  userId: string;
  employeeId: string;
  analyticsConsent: boolean;
  analyticsConsentDate: string | null;
  revokeDate: string | null;
  dataDeletionRequested: boolean;
  canAnalyze: boolean;
}

/**
 * VoiceDrive APIクライアントクラス
 */
export class VoiceDriveClient {
  private static instance: VoiceDriveClient;
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private readonly baseURL: string;
  private readonly jwtSecret: string;

  /**
   * コンストラクタ（プライベート - シングルトンパターン）
   */
  private constructor() {
    this.baseURL = process.env.VOICEDRIVE_API_BASE_URL || 'http://localhost:5173';
    this.jwtSecret = process.env.JWT_SECRET || '';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // リクエストインターセプター（自動トークン付与）
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): VoiceDriveClient {
    if (!VoiceDriveClient.instance) {
      VoiceDriveClient.instance = new VoiceDriveClient();
    }
    return VoiceDriveClient.instance;
  }

  /**
   * アクセストークン取得（自動更新）
   *
   * @returns JWT文字列
   */
  private async getAccessToken(): Promise<string> {
    // トークンが有効期限内なら再利用
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // 新規トークン生成
    // ※ VoiceDrive側にトークン発行APIがある場合は、そちらを呼び出す
    // ※ 現在は自己署名方式（医療システム側でトークン生成）
    this.accessToken = generateJWT({
      userId: 'medical-system',
      employeeId: 'SYSTEM',
      permissionLevel: 99
    }, '1h');

    this.tokenExpiry = Date.now() + 3600 * 1000; // 1時間後

    console.log('[VoiceDriveClient] Access token refreshed');

    return this.accessToken;
  }

  /**
   * データ分析同意状態取得
   *
   * @param userId - VoiceDriveユーザーID
   * @returns データ分析同意状態
   */
  public async getConsentStatus(userId: string): Promise<ConsentStatusResponse> {
    try {
      const response = await this.axiosInstance.get<ConsentStatusResponse>(
        `/api/voicedrive/users/${userId}/consent-status`
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[VoiceDriveClient] API error:', error.response?.data || error.message);
        throw new Error(`Failed to get consent status: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 複数ユーザーのデータ分析同意状態を一括取得
   *
   * @param userIds - VoiceDriveユーザーID配列
   * @returns データ分析同意状態配列
   */
  public async getBatchConsentStatus(userIds: string[]): Promise<ConsentStatusResponse[]> {
    try {
      const promises = userIds.map(userId => this.getConsentStatus(userId));
      return await Promise.all(promises);
    } catch (error) {
      console.error('[VoiceDriveClient] Batch consent status error:', error);
      throw error;
    }
  }

  /**
   * 分析可能なユーザーのみフィルタリング
   *
   * @param userIds - VoiceDriveユーザーID配列
   * @returns 分析可能なユーザーID配列
   */
  public async getAnalyzableUsers(userIds: string[]): Promise<string[]> {
    try {
      const consentStatuses = await this.getBatchConsentStatus(userIds);
      return consentStatuses
        .filter(status => status.canAnalyze)
        .map(status => status.userId);
    } catch (error) {
      console.error('[VoiceDriveClient] Get analyzable users error:', error);
      throw error;
    }
  }
}

/**
 * シングルトンインスタンスのエクスポート
 */
export const voiceDriveClient = VoiceDriveClient.getInstance();
