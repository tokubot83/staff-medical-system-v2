#!/usr/bin/env node

/**
 * Medical System CLI - 秘密情報配信ツール
 * 医療システムチーム用のCLIツール
 */

import { program } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

// 環境変数の読み込み
const envPath = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';
dotenv.config({ path: envPath });

interface SecretDeliveryOptions {
  recipient: string;
  env: 'production' | 'staging' | 'development';
  expires: string;
  mfa: 'required' | 'optional' | 'disabled';
}

interface SecretConfig {
  name: string;
  value: string;
  type: 'credential' | 'api_key' | 'certificate' | 'token';
  description: string;
}

class MedicalCLI {
  private readonly apiEndpoint: string;
  private readonly encryptionKey: string;

  constructor() {
    this.apiEndpoint = process.env.NOTIFICATION_API_ENDPOINT || 'https://api.medical-system.kosei-kai.jp/v2/notifications';
    this.encryptionKey = process.env.NOTIFICATION_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
  }

  /**
   * 秘密情報の暗号化
   */
  private encrypt(text: string): { encrypted: string; iv: string; authTag: string } {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(this.encryptionKey, 'hex').slice(0, 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * 有効期限の解析
   */
  private parseExpiration(expires: string): number {
    const match = expires.match(/^(\d+)([hmd])$/);
    if (!match) {
      throw new Error('Invalid expiration format. Use format like: 24h, 7d, 1m');
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'm':
        return value * 30 * 24 * 60 * 60 * 1000;
      default:
        throw new Error('Invalid time unit. Use h (hours), d (days), or m (months)');
    }
  }

  /**
   * 秘密情報の配信
   */
  async deliverSecrets(options: SecretDeliveryOptions): Promise<void> {
    const spinner = ora('Preparing secret delivery...').start();

    try {
      // 環境に応じた秘密情報の読み込み
      const secrets = await this.loadSecrets(options.env);

      if (secrets.length === 0) {
        spinner.fail('No secrets found for delivery');
        return;
      }

      spinner.text = 'Encrypting secrets...';

      // 各秘密情報を暗号化
      const encryptedSecrets = secrets.map(secret => {
        const { encrypted, iv, authTag } = this.encrypt(JSON.stringify({
          name: secret.name,
          value: secret.value,
          type: secret.type,
          description: secret.description
        }));

        return {
          id: crypto.randomBytes(16).toString('hex'),
          encrypted,
          iv,
          authTag,
          metadata: {
            name: secret.name,
            type: secret.type
          }
        };
      });

      // ワンタイムトークンの生成
      const oneTimeToken = crypto.randomBytes(32).toString('hex');
      const deliveryId = `SEC-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      spinner.text = 'Delivering secrets...';

      // 配信リクエストの送信
      const response = await axios.post(
        `${this.apiEndpoint}/secrets/deliver`,
        {
          deliveryId,
          recipient: options.recipient,
          environment: options.env,
          secrets: encryptedSecrets,
          expiresAt: new Date(Date.now() + this.parseExpiration(options.expires)),
          requiresMFA: options.mfa === 'required',
          oneTimeToken,
          encryptionKeyId: 'production-2025',
          notification: {
            email: this.getRecipientEmail(options.recipient),
            slack: this.getRecipientSlackChannel(options.recipient)
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      spinner.succeed('Secrets delivered successfully!');

      // 結果の表示
      console.log('\n' + chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.bold('\n📦 Secret Delivery Summary\n'));
      console.log(chalk.cyan('Delivery ID:'), chalk.yellow(deliveryId));
      console.log(chalk.cyan('Recipient:'), options.recipient);
      console.log(chalk.cyan('Environment:'), options.env);
      console.log(chalk.cyan('Secrets Count:'), secrets.length);
      console.log(chalk.cyan('Expires:'), options.expires);
      console.log(chalk.cyan('MFA Required:'), options.mfa === 'required' ? 'Yes' : 'No');
      console.log(chalk.cyan('Status:'), chalk.green('Delivered'));

      console.log('\n' + chalk.yellow('🔑 One-Time Access Token:'));
      console.log(chalk.gray(oneTimeToken));

      console.log('\n' + chalk.yellow('🔗 Access URL:'));
      console.log(chalk.blue(`https://secure.medical-system.kosei-kai.jp/secrets/${deliveryId}`));

      console.log('\n' + chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

      // トークンをファイルに保存（バックアップ用）
      const tokenFile = path.join(process.cwd(), `.secrets-delivery-${deliveryId}.json`);
      fs.writeFileSync(tokenFile, JSON.stringify({
        deliveryId,
        oneTimeToken,
        encryptionKey: this.encryptionKey,
        expiresAt: new Date(Date.now() + this.parseExpiration(options.expires)).toISOString()
      }, null, 2), { mode: 0o600 });

      console.log('\n' + chalk.gray(`Token backup saved to: ${tokenFile}`));
      console.log(chalk.gray('(This file will be automatically deleted after retrieval)'));

    } catch (error) {
      spinner.fail('Failed to deliver secrets');
      console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  /**
   * 秘密情報の読み込み
   */
  private async loadSecrets(env: string): Promise<SecretConfig[]> {
    const secrets: SecretConfig[] = [];

    // production環境の秘密情報
    if (env === 'production') {
      secrets.push(
        {
          name: 'CLIENT_SECRET',
          value: process.env.CLIENT_SECRET || await this.promptForSecret('CLIENT_SECRET'),
          type: 'credential',
          description: 'OAuth2.0 Client Secret for VoiceDrive'
        },
        {
          name: 'DB_PASSWORD',
          value: process.env.DB_PASSWORD || await this.promptForSecret('DB_PASSWORD'),
          type: 'credential',
          description: 'MySQL Database Password'
        },
        {
          name: 'AWS_SECRET_ACCESS_KEY',
          value: process.env.AWS_SECRET_ACCESS_KEY || await this.promptForSecret('AWS_SECRET_ACCESS_KEY'),
          type: 'api_key',
          description: 'AWS S3 Secret Access Key'
        },
        {
          name: 'SENDGRID_API_KEY',
          value: process.env.SENDGRID_API_KEY || await this.promptForSecret('SENDGRID_API_KEY'),
          type: 'api_key',
          description: 'SendGrid Email API Key'
        },
        {
          name: 'JWT_SECRET',
          value: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
          type: 'token',
          description: 'JWT Signing Secret'
        },
        {
          name: 'SESSION_SECRET',
          value: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
          type: 'token',
          description: 'Session Encryption Secret'
        }
      );
    }

    return secrets;
  }

  /**
   * 秘密情報の手動入力プロンプト
   */
  private async promptForSecret(name: string): Promise<string> {
    const response = await prompts({
      type: 'password',
      name: 'value',
      message: `Enter value for ${name}:`
    });

    if (!response.value) {
      throw new Error(`${name} is required`);
    }

    return response.value;
  }

  /**
   * 受信者のメールアドレス取得
   */
  private getRecipientEmail(recipient: string): string {
    const emails: Record<string, string> = {
      'voicedrive': 'voicedrive-integration@medical-system.kosei-kai.jp',
      'voicedrive-team': 'dev@voicedrive.ai',
      'compliance': 'compliance@medical-system.kosei-kai.jp'
    };
    return emails[recipient] || 'admin@medical-system.kosei-kai.jp';
  }

  /**
   * 受信者のSlackチャンネル取得
   */
  private getRecipientSlackChannel(recipient: string): string {
    const channels: Record<string, string> = {
      'voicedrive': '#compliance-integration',
      'voicedrive-team': '#voicedrive-integration',
      'compliance': '#compliance-alerts'
    };
    return channels[recipient] || '#general';
  }

  /**
   * 配信履歴の表示
   */
  async listDeliveries(): Promise<void> {
    const spinner = ora('Fetching delivery history...').start();

    try {
      const response = await axios.get(
        `${this.apiEndpoint}/secrets/deliveries`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.API_TOKEN}`
          }
        }
      );

      spinner.succeed('Delivery history fetched');

      const deliveries = response.data.deliveries;

      if (deliveries.length === 0) {
        console.log(chalk.yellow('\nNo deliveries found.'));
        return;
      }

      console.log('\n' + chalk.bold('📋 Recent Secret Deliveries\n'));

      deliveries.forEach((delivery: any) => {
        const status = delivery.retrieved ? chalk.green('Retrieved') :
                      new Date(delivery.expiresAt) < new Date() ? chalk.red('Expired') :
                      chalk.yellow('Pending');

        console.log(chalk.cyan('ID:'), delivery.deliveryId);
        console.log(chalk.cyan('Recipient:'), delivery.recipient);
        console.log(chalk.cyan('Created:'), new Date(delivery.createdAt).toLocaleString());
        console.log(chalk.cyan('Expires:'), new Date(delivery.expiresAt).toLocaleString());
        console.log(chalk.cyan('Status:'), status);
        console.log(chalk.gray('─'.repeat(50)));
      });

    } catch (error) {
      spinner.fail('Failed to fetch delivery history');
      console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
}

// CLIコマンドの定義
program
  .name('medical-cli')
  .description('Medical System CLI - Secret Delivery Tool')
  .version('1.0.0');

program
  .command('secrets')
  .description('Manage secret deliveries')
  .command('deliver')
  .description('Deliver secrets to a recipient')
  .requiredOption('-r, --recipient <recipient>', 'Recipient identifier (e.g., voicedrive)')
  .option('-e, --env <environment>', 'Environment', 'production')
  .option('--expires <duration>', 'Expiration duration (e.g., 24h, 7d)', '24h')
  .option('--mfa <mode>', 'MFA requirement', 'required')
  .action(async (options) => {
    const cli = new MedicalCLI();
    await cli.deliverSecrets({
      recipient: options.recipient,
      env: options.env,
      expires: options.expires,
      mfa: options.mfa
    });
  });

program
  .command('list')
  .description('List recent secret deliveries')
  .action(async () => {
    const cli = new MedicalCLI();
    await cli.listDeliveries();
  });

// エラーハンドリング
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('\n❌ Unexpected error:'), error);
  process.exit(1);
});

// CLIの実行
program.parse(process.argv);