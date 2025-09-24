/**
 * Bearer Token管理スクリプト
 * VoiceDrive連携用の認証トークンを管理
 */

import axios, { AxiosError } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface StoredToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  encrypted: boolean;
}

class TokenManager {
  private readonly TOKEN_PATH = '/secure/tokens/bearer.json';
  private readonly ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || '';
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.ensureTokenDirectory();
  }

  /**
   * トークンディレクトリの作成
   */
  private ensureTokenDirectory(): void {
    const dir = path.dirname(this.TOKEN_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    }
  }

  /**
   * トークンの暗号化
   */
  private encrypt(text: string): string {
    if (!this.ENCRYPTION_KEY) {
      console.warn('Token encryption key not set. Storing token in plain text.');
      return text;
    }

    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  /**
   * トークンの復号化
   */
  private decrypt(encryptedText: string): string {
    if (!this.ENCRYPTION_KEY || !encryptedText.includes(':')) {
      return encryptedText;
    }

    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(this.ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * 新規トークンの取得
   */
  async obtainToken(): Promise<string> {
    try {
      console.log('Obtaining new access token...');
      
      const response = await axios.post<TokenResponse>(
        process.env.TOKEN_ENDPOINT!,
        {
          grant_type: 'client_credentials',
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          scope: process.env.AUTH_SCOPE
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      await this.saveToken(response.data);
      this.scheduleRefresh(response.data.expires_in);

      console.log('Token obtained successfully');
      return response.data.access_token;
    } catch (error) {
      console.error('Failed to obtain token:', error);
      throw error;
    }
  }

  /**
   * トークンの更新
   */
  async refreshToken(): Promise<string> {
    try {
      console.log('Refreshing access token...');
      
      const storedToken = await this.loadToken();
      if (!storedToken) {
        return this.obtainToken();
      }

      const response = await axios.post<TokenResponse>(
        process.env.TOKEN_ENDPOINT!,
        {
          grant_type: 'refresh_token',
          refresh_token: storedToken.refresh_token,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      await this.saveToken(response.data);
      this.scheduleRefresh(response.data.expires_in);

      console.log('Token refreshed successfully');
      return response.data.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      
      // Refresh失敗時は新規取得
      if ((error as AxiosError).response?.status === 401) {
        console.log('Refresh token expired. Obtaining new token...');
        return this.obtainToken();
      }
      
      throw error;
    }
  }

  /**
   * トークンの保存
   */
  private async saveToken(tokenData: TokenResponse): Promise<void> {
    const storedToken: StoredToken = {
      access_token: this.encrypt(tokenData.access_token),
      refresh_token: this.encrypt(tokenData.refresh_token),
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      encrypted: !!this.ENCRYPTION_KEY
    };

    fs.writeFileSync(
      this.TOKEN_PATH,
      JSON.stringify(storedToken, null, 2),
      { mode: 0o600 }
    );

    // 環境変数にも保存
    process.env.ACCESS_TOKEN = tokenData.access_token;
    process.env.REFRESH_TOKEN = tokenData.refresh_token;
  }

  /**
   * トークンの読み込み
   */
  private async loadToken(): Promise<StoredToken | null> {
    if (!fs.existsSync(this.TOKEN_PATH)) {
      return null;
    }

    try {
      const data = fs.readFileSync(this.TOKEN_PATH, 'utf8');
      const storedToken: StoredToken = JSON.parse(data);

      // 復号化
      if (storedToken.encrypted && this.ENCRYPTION_KEY) {
        storedToken.access_token = this.decrypt(storedToken.access_token);
        storedToken.refresh_token = this.decrypt(storedToken.refresh_token);
      }

      return storedToken;
    } catch (error) {
      console.error('Failed to load token:', error);
      return null;
    }
  }

  /**
   * 現在のアクセストークンを取得
   */
  async getAccessToken(): Promise<string> {
    const storedToken = await this.loadToken();

    if (!storedToken) {
      return this.obtainToken();
    }

    // 期限確認（5分前に更新）
    const expiryBuffer = 5 * 60 * 1000;
    if (Date.now() >= storedToken.expires_at - expiryBuffer) {
      return this.refreshToken();
    }

    return storedToken.access_token;
  }

  /**
   * 自動更新のスケジュール
   */
  private scheduleRefresh(expiresIn: number): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // 期限の80%経過後に更新
    const refreshTime = expiresIn * 0.8 * 1000;
    
    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('Scheduled token refresh failed:', error);
      }
    }, refreshTime);
  }

  /**
   * トークンの検証
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      
      // トークンを使ってヘルスチェックAPIを呼び出す
      const response = await axios.get(
        `${process.env.API_BASE_URL}/health`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * トークンの削除
   */
  async revokeToken(): Promise<void> {
    try {
      const storedToken = await this.loadToken();
      if (!storedToken) {
        return;
      }

      // トークン失効化APIを呼び出す
      await axios.post(
        `${process.env.TOKEN_ENDPOINT}/revoke`,
        {
          token: storedToken.access_token,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET
        }
      );

      // ローカルファイルを削除
      if (fs.existsSync(this.TOKEN_PATH)) {
        fs.unlinkSync(this.TOKEN_PATH);
      }

      // タイマーをクリア
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }

      console.log('Token revoked successfully');
    } catch (error) {
      console.error('Failed to revoke token:', error);
      throw error;
    }
  }

  /**
   * クリーンアップ
   */
  cleanup(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

// シングルトンインスタンス
const tokenManager = new TokenManager();

// プロセス終了時のクリーンアップ
process.on('SIGINT', () => {
  tokenManager.cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  tokenManager.cleanup();
  process.exit(0);
});

export default tokenManager;
export { TokenManager };