/**
 * StorageAdapter - データ永続化の抽象化レイヤー
 * LocalStorageとAPIの切り替えを容易にする
 */

export interface StorageConfig {
  type: 'localStorage' | 'api';
  apiBaseUrl?: string;
  apiKey?: string;
}

export interface StorageResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    timestamp: Date;
    version: string;
  };
}

export abstract class StorageAdapter {
  protected config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  abstract get<T>(key: string): Promise<StorageResponse<T>>;
  abstract set<T>(key: string, value: T): Promise<StorageResponse<void>>;
  abstract delete(key: string): Promise<StorageResponse<void>>;
  abstract list<T>(prefix?: string): Promise<StorageResponse<T[]>>;
  abstract exists(key: string): Promise<boolean>;
  abstract clear(prefix?: string): Promise<StorageResponse<void>>;
}

/**
 * LocalStorage実装
 */
export class LocalStorageAdapter extends StorageAdapter {
  private prefix = 'staff_medical_';

  constructor(config: StorageConfig) {
    super(config);
  }

  async get<T>(key: string): Promise<StorageResponse<T>> {
    try {
      const fullKey = this.prefix + key;
      const item = localStorage.getItem(fullKey);
      
      if (!item) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Key ${key} not found`
          }
        };
      }

      const data = JSON.parse(item) as T;
      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async set<T>(key: string, value: T): Promise<StorageResponse<void>> {
    try {
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, JSON.stringify(value));
      
      return {
        success: true,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'STORAGE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async delete(key: string): Promise<StorageResponse<void>> {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
      
      return {
        success: true,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async list<T>(prefix?: string): Promise<StorageResponse<T[]>> {
    try {
      const searchPrefix = this.prefix + (prefix || '');
      const items: T[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(searchPrefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            items.push(JSON.parse(item) as T);
          }
        }
      }
      
      return {
        success: true,
        data: items,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LIST_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async exists(key: string): Promise<boolean> {
    const fullKey = this.prefix + key;
    return localStorage.getItem(fullKey) !== null;
  }

  async clear(prefix?: string): Promise<StorageResponse<void>> {
    try {
      const searchPrefix = this.prefix + (prefix || '');
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(searchPrefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      return {
        success: true,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CLEAR_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
}

/**
 * API実装（将来のバックエンド連携用）
 */
export class ApiStorageAdapter extends StorageAdapter {
  private apiBaseUrl: string;
  private headers: HeadersInit;

  constructor(config: StorageConfig) {
    super(config);
    this.apiBaseUrl = config.apiBaseUrl || '/api/storage';
    this.headers = {
      'Content-Type': 'application/json',
      ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
    };
  }

  async get<T>(key: string): Promise<StorageResponse<T>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${key}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: response.statusText
          }
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data as T,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async set<T>(key: string, value: T): Promise<StorageResponse<void>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${key}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(value)
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: response.statusText
          }
        };
      }

      return {
        success: true,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async delete(key: string): Promise<StorageResponse<void>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${key}`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: response.statusText
          }
        };
      }

      return {
        success: true,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async list<T>(prefix?: string): Promise<StorageResponse<T[]>> {
    try {
      const url = prefix 
        ? `${this.apiBaseUrl}?prefix=${encodeURIComponent(prefix)}`
        : this.apiBaseUrl;
        
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: response.statusText
          }
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data as T[],
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/${key}/exists`, {
        method: 'HEAD',
        headers: this.headers
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async clear(prefix?: string): Promise<StorageResponse<void>> {
    try {
      const url = prefix 
        ? `${this.apiBaseUrl}/clear?prefix=${encodeURIComponent(prefix)}`
        : `${this.apiBaseUrl}/clear`;
        
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers
      });

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: response.statusText
          }
        };
      }

      return {
        success: true,
        metadata: {
          timestamp: new Date(),
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
}

/**
 * ストレージファクトリー
 */
export class StorageFactory {
  private static instance: StorageAdapter | null = null;
  private static config: StorageConfig = { type: 'localStorage' };

  static configure(config: StorageConfig): void {
    this.config = config;
    this.instance = null; // 設定変更時は再作成
  }

  static getAdapter(): StorageAdapter {
    if (!this.instance) {
      switch (this.config.type) {
        case 'api':
          this.instance = new ApiStorageAdapter(this.config);
          break;
        case 'localStorage':
        default:
          this.instance = new LocalStorageAdapter(this.config);
          break;
      }
    }
    return this.instance;
  }
}