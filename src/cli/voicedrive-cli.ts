#!/usr/bin/env node

/**
 * VoiceDrive CLI - 秘密情報取得ツール
 * VoiceDriveチーム用のCLIツール
 */

import { program } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import dotenv from 'dotenv';

interface RetrieveOptions {
  deliveryId: string;
  token?: string;
  output?: string;
  mfaCode?: string;
}

interface DecryptedSecret {
  name: string;
  value: string;
  type: string;
  description: string;
}

class VoiceDriveCLI {
  private readonly apiEndpoint: string;

  constructor() {
    this.apiEndpoint = 'https://secure.medical-system.kosei-kai.jp/api/v2/secrets';
  }

  /**
   * 秘密情報の復号化
   */
  private decrypt(
    encryptedData: string,
    key: string,
    iv: string,
    authTag: string
  ): string {
    const algorithm = 'aes-256-gcm';
    const keyBuffer = Buffer.from(key, 'hex').slice(0, 32);
    const ivBuffer = Buffer.from(iv, 'hex');
    const authTagBuffer = Buffer.from(authTag, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    decipher.setAuthTag(authTagBuffer);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * クライアントフィンガープリントの生成
   */
  private getClientFingerprint(): string {
    const info = {
      platform: process.platform,
      arch: process.arch,
      hostname: require('os').hostname(),
      user: require('os').userInfo().username
    };
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(info))
      .digest('hex');
  }

  /**
   * 秘密情報の取得
   */
  async retrieveSecrets(options: RetrieveOptions): Promise<void> {
    const spinner = ora('Connecting to secure server...').start();

    try {
      // トークンの取得（ファイルまたはプロンプトから）
      let token = options.token;
      if (!token) {
        const tokenFile = path.join(process.cwd(), `.secrets-delivery-${options.deliveryId}.json`);
        if (fs.existsSync(tokenFile)) {
          const tokenData = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
          token = tokenData.oneTimeToken;
          spinner.text = 'Token loaded from backup file';
        } else {
          spinner.stop();
          const response = await prompts({
            type: 'password',
            name: 'token',
            message: 'Enter one-time access token:'
          });
          token = response.token;
          spinner.start('Authenticating...');
        }
      }

      // MFAコードの取得
      let mfaCode = options.mfaCode;
      if (!mfaCode) {
        spinner.stop();
        const response = await prompts({
          type: 'text',
          name: 'mfaCode',
          message: 'Enter MFA code (6 digits):',
          validate: value => /^\d{6}$/.test(value) || 'MFA code must be 6 digits'
        });
        mfaCode = response.mfaCode;
        spinner.start('Verifying MFA...');
      }

      spinner.text = 'Retrieving secrets...';

      // 秘密情報の取得リクエスト
      const response = await axios.post(
        `${this.apiEndpoint}/retrieve`,
        {
          deliveryId: options.deliveryId,
          mfaCode
        },
        {
          headers: {
            'X-One-Time-Token': token,
            'X-Client-Fingerprint': this.getClientFingerprint(),
            'Content-Type': 'application/json'
          }
        }
      );

      spinner.text = 'Decrypting secrets...';

      const { secrets, encryptionKey } = response.data;

      // 各秘密情報を復号化
      const decryptedSecrets: DecryptedSecret[] = [];
      for (const secret of secrets) {
        const decrypted = this.decrypt(
          secret.encrypted,
          encryptionKey,
          secret.iv,
          secret.authTag
        );
        const parsed = JSON.parse(decrypted);
        decryptedSecrets.push(parsed);
      }

      spinner.succeed('Secrets retrieved successfully!');

      // 結果の表示
      console.log('\n' + chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.bold('\n🔓 Retrieved Secrets\n'));

      decryptedSecrets.forEach((secret, index) => {
        console.log(chalk.cyan(`[${index + 1}] ${secret.name}`));
        console.log(chalk.gray(`    Type: ${secret.type}`));
        console.log(chalk.gray(`    Description: ${secret.description}`));
      });

      console.log('\n' + chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

      // .envファイルへの保存
      const outputFile = options.output || '.env.production.local';
      const envPath = path.join(process.cwd(), outputFile);

      spinner.start(`Saving to ${outputFile}...`);

      // 既存の.envファイルを読み込み
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      // 新しい値で更新
      const envLines = envContent.split('\n');
      const envMap = new Map<string, string>();

      // 既存の値を保持
      envLines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          envMap.set(match[1], match[2]);
        }
      });

      // 新しい秘密情報で上書き
      decryptedSecrets.forEach(secret => {
        envMap.set(secret.name, secret.value);
      });

      // .envファイルを生成
      const newEnvContent = Array.from(envMap.entries())
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      // バックアップを作成
      if (fs.existsSync(envPath)) {
        const backupPath = `${envPath}.backup.${Date.now()}`;
        fs.copyFileSync(envPath, backupPath);
        console.log(chalk.gray(`\nBackup created: ${backupPath}`));
      }

      // 新しいファイルを保存
      fs.writeFileSync(envPath, newEnvContent, { mode: 0o600 });

      spinner.succeed(`Secrets saved to ${outputFile}`);

      // トークンファイルの削除
      const tokenFile = path.join(process.cwd(), `.secrets-delivery-${options.deliveryId}.json`);
      if (fs.existsSync(tokenFile)) {
        fs.unlinkSync(tokenFile);
        console.log(chalk.gray(`\nToken backup file deleted`));
      }

      // サマリー
      console.log('\n' + chalk.bold('📊 Summary'));
      console.log(chalk.cyan('Total secrets retrieved:'), decryptedSecrets.length);
      console.log(chalk.cyan('Output file:'), outputFile);
      console.log(chalk.cyan('File permissions:'), '0600 (read/write for owner only)');

      console.log('\n' + chalk.yellow('⚠️  Security Reminders:'));
      console.log(chalk.gray('• The secrets have been saved to your local .env file'));
      console.log(chalk.gray('• Ensure this file is added to .gitignore'));
      console.log(chalk.gray('• Do not commit secrets to version control'));
      console.log(chalk.gray('• Restart your application to apply new environment variables'));

      console.log('\n' + chalk.green('✅ Setup complete! You can now use the production environment.'));

    } catch (error) {
      spinner.fail('Failed to retrieve secrets');

      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          console.error(chalk.red('\n❌ Authentication failed:'), 'Invalid token or MFA code');
        } else if (status === 404) {
          console.error(chalk.red('\n❌ Not found:'), 'Delivery ID does not exist or has expired');
        } else if (status === 410) {
          console.error(chalk.red('\n❌ Gone:'), 'Secrets have already been retrieved');
        } else {
          console.error(chalk.red('\n❌ Server error:'), data.error || 'Unknown error');
        }
      } else {
        console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : error);
      }

      process.exit(1);
    }
  }

  /**
   * 配信状態の確認
   */
  async checkStatus(deliveryId: string): Promise<void> {
    const spinner = ora('Checking delivery status...').start();

    try {
      const response = await axios.get(
        `${this.apiEndpoint}/status/${deliveryId}`,
        {
          headers: {
            'X-Client-Fingerprint': this.getClientFingerprint()
          }
        }
      );

      spinner.succeed('Status retrieved');

      const status = response.data;

      console.log('\n' + chalk.bold('📦 Delivery Status\n'));
      console.log(chalk.cyan('Delivery ID:'), deliveryId);
      console.log(chalk.cyan('Created:'), new Date(status.createdAt).toLocaleString());
      console.log(chalk.cyan('Expires:'), new Date(status.expiresAt).toLocaleString());
      console.log(chalk.cyan('MFA Required:'), status.requiresMFA ? 'Yes' : 'No');
      console.log(chalk.cyan('Status:'),
        status.retrieved ? chalk.red('Already Retrieved') :
        new Date(status.expiresAt) < new Date() ? chalk.red('Expired') :
        chalk.green('Available')
      );

      if (status.retrieved) {
        console.log(chalk.cyan('Retrieved At:'), new Date(status.retrievedAt).toLocaleString());
        console.log(chalk.cyan('Retrieved By:'), status.retrievedBy);
      }

    } catch (error) {
      spinner.fail('Failed to check status');

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.error(chalk.red('\n❌ Delivery not found:'), deliveryId);
      } else {
        console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : error);
      }

      process.exit(1);
    }
  }
}

// CLIコマンドの定義
program
  .name('voicedrive-cli')
  .description('VoiceDrive CLI - Secret Retrieval Tool')
  .version('1.0.0');

program
  .command('secrets')
  .description('Manage secret retrievals')
  .command('retrieve <deliveryId>')
  .description('Retrieve secrets from a delivery')
  .option('-t, --token <token>', 'One-time access token')
  .option('-o, --output <file>', 'Output file', '.env.production.local')
  .option('-m, --mfa-code <code>', 'MFA code (6 digits)')
  .action(async (deliveryId, options) => {
    const cli = new VoiceDriveCLI();
    await cli.retrieveSecrets({
      deliveryId,
      token: options.token,
      output: options.output,
      mfaCode: options.mfaCode
    });
  });

program
  .command('status <deliveryId>')
  .description('Check delivery status')
  .action(async (deliveryId) => {
    const cli = new VoiceDriveCLI();
    await cli.checkStatus(deliveryId);
  });

// ショートカットコマンド
program
  .arguments('<deliveryId>')
  .description('Quick retrieve (shortcut for secrets retrieve)')
  .action(async (deliveryId) => {
    const cli = new VoiceDriveCLI();
    await cli.retrieveSecrets({ deliveryId });
  });

// エラーハンドリング
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('\n❌ Unexpected error:'), error);
  process.exit(1);
});

// CLIの実行
program.parse(process.argv);