/**
 * APIバージョン管理システム
 * 複数バージョンのAPIを共存させ、段階的な移行を可能にする
 */

import { IApiResponse, IInterviewType, IBooking } from '@/interfaces/interview.interface';

// APIバージョン定義
export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3' // 将来用
}

// バージョン設定
interface VersionConfig {
  version: ApiVersion;
  baseUrl: string;
  deprecated?: boolean;
  deprecationDate?: Date;
  features: string[];
}

// APIバージョンマネージャー
export class ApiVersionManager {
  private static instance: ApiVersionManager;
  private currentVersion: ApiVersion = ApiVersion.V1;
  private versions: Map<ApiVersion, VersionConfig> = new Map();

  private constructor() {
    this.initializeVersions();
  }

  public static getInstance(): ApiVersionManager {
    if (!ApiVersionManager.instance) {
      ApiVersionManager.instance = new ApiVersionManager();
    }
    return ApiVersionManager.instance;
  }

  private initializeVersions(): void {
    // V1設定（現行版）
    this.versions.set(ApiVersion.V1, {
      version: ApiVersion.V1,
      baseUrl: '/api/v1',
      deprecated: false,
      features: [
        'basic-booking',
        'interview-types-10',
        'category-selection'
      ]
    });

    // V2設定（拡張版）
    this.versions.set(ApiVersion.V2, {
      version: ApiVersion.V2,
      baseUrl: '/api/v2',
      deprecated: false,
      features: [
        'basic-booking',
        'interview-types-expanded',
        'category-selection',
        'ai-recommendations',
        'bulk-operations',
        'webhook-support'
      ]
    });
  }

  // 現在のバージョンを取得
  public getCurrentVersion(): ApiVersion {
    return this.currentVersion;
  }

  // バージョンを設定
  public setVersion(version: ApiVersion): void {
    if (this.versions.has(version)) {
      this.currentVersion = version;
    } else {
      throw new Error(`API version ${version} is not supported`);
    }
  }

  // ベースURLを取得
  public getBaseUrl(version?: ApiVersion): string {
    const v = version || this.currentVersion;
    const config = this.versions.get(v);
    return config?.baseUrl || '/api/v1';
  }

  // 機能が利用可能かチェック
  public isFeatureAvailable(feature: string, version?: ApiVersion): boolean {
    const v = version || this.currentVersion;
    const config = this.versions.get(v);
    return config?.features.includes(feature) || false;
  }

  // 非推奨バージョンかチェック
  public isDeprecated(version: ApiVersion): boolean {
    const config = this.versions.get(version);
    return config?.deprecated || false;
  }

  // APIエンドポイントを構築
  public buildEndpoint(path: string, version?: ApiVersion): string {
    const baseUrl = this.getBaseUrl(version);
    return `${baseUrl}/${path}`;
  }
}

// APIクライアントの抽象クラス
export abstract class VersionedApiClient {
  protected versionManager: ApiVersionManager;

  constructor() {
    this.versionManager = ApiVersionManager.getInstance();
  }

  // バージョンに応じたデータ変換
  protected abstract transformRequest(data: any, version: ApiVersion): any;
  protected abstract transformResponse(data: any, version: ApiVersion): any;

  // 汎用的なAPIリクエスト
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    version?: ApiVersion
  ): Promise<IApiResponse<T>> {
    const url = this.versionManager.buildEndpoint(endpoint, version);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': version || this.versionManager.getCurrentVersion(),
          ...options.headers
        }
      });

      const data = await response.json();
      const transformedData = this.transformResponse(data, version || this.versionManager.getCurrentVersion());

      return {
        success: response.ok,
        data: transformedData,
        metadata: {
          timestamp: new Date(),
          version: version || this.versionManager.getCurrentVersion(),
          requestId: response.headers.get('X-Request-Id') || undefined,
          pagination: undefined
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        }
      };
    }
  }
}

// 面談APIクライアントの実装例
export class InterviewApiClient extends VersionedApiClient {
  // V1 -> V2 データ変換
  protected transformRequest(data: any, version: ApiVersion): any {
    if (version === ApiVersion.V1) {
      // V1形式のまま
      return data;
    } else if (version === ApiVersion.V2) {
      // V2形式に変換
      return {
        ...data,
        metadata: {
          source: 'web',
          timestamp: new Date().toISOString()
        }
      };
    }
    return data;
  }

  // V2 -> V1 データ変換
  protected transformResponse(data: any, version: ApiVersion): any {
    if (version === ApiVersion.V1) {
      // V1形式のまま
      return data;
    } else if (version === ApiVersion.V2) {
      // V2の追加フィールドを含む
      return {
        ...data,
        aiRecommendations: data.recommendations || null,
        webhookStatus: data.webhook_status || null
      };
    }
    return data;
  }

  // 面談タイプ一覧取得
  public async getInterviewTypes(version?: ApiVersion): Promise<IApiResponse<IInterviewType[]>> {
    return this.request<IInterviewType[]>('interviews/types', {
      method: 'GET'
    }, version);
  }

  // 予約作成
  public async createBooking(booking: Partial<IBooking>, version?: ApiVersion): Promise<IApiResponse<IBooking>> {
    const transformedData = this.transformRequest(booking, version || this.versionManager.getCurrentVersion());
    
    return this.request<IBooking>('bookings', {
      method: 'POST',
      body: JSON.stringify(transformedData)
    }, version);
  }

  // 予約一覧取得
  public async getBookings(params?: any, version?: ApiVersion): Promise<IApiResponse<IBooking[]>> {
    const queryString = new URLSearchParams(params).toString();
    return this.request<IBooking[]>(`bookings?${queryString}`, {
      method: 'GET'
    }, version);
  }
}

// エクスポート
export const apiVersionManager = ApiVersionManager.getInstance();
export const interviewApiClient = new InterviewApiClient();