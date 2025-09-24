/**
 * MySQL接続テストスクリプト
 * 本番環境のデータベース接続を確認
 */

import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config({ path: '.env.production' });

interface ConnectionTestResult {
  status: 'success' | 'error';
  message: string;
  details?: {
    version?: string;
    database?: string;
    charset?: string;
    collation?: string;
    ssl?: boolean;
    connectionId?: number;
  };
  error?: string;
}

class MySQLConnectionTester {
  private readonly config: mysql.ConnectionOptions;

  constructor() {
    // SSL証明書の読み込み
    const sslConfig = process.env.DB_SSL_MODE === 'REQUIRED' ? {
      ca: fs.readFileSync(process.env.DB_SSL_CERT || '/secure/certs/mysql-ca.crt')
    } : undefined;

    this.config = {
      host: process.env.DB_HOST || 'mysql-primary.medical-system.kosei-kai.jp',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'voicedrive_prod',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'compliance_production',
      charset: process.env.DB_CHARSET || 'utf8mb4',
      ssl: sslConfig,
      connectTimeout: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT || '2000'),
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
      queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0')
    };
  }

  /**
   * プライマリデータベースへの接続テスト
   */
  async testPrimaryConnection(): Promise<ConnectionTestResult> {
    let connection: mysql.Connection | null = null;

    try {
      console.log('Testing primary database connection...');
      console.log(`Host: ${this.config.host}:${this.config.port}`);
      console.log(`Database: ${this.config.database}`);

      connection = await mysql.createConnection(this.config);

      // バージョン情報の取得
      const [versionRows]: any = await connection.execute('SELECT VERSION() as version');
      const version = versionRows[0]?.version;

      // データベース情報の取得
      const [dbInfoRows]: any = await connection.execute(`
        SELECT
          DATABASE() as current_db,
          @@character_set_database as charset,
          @@collation_database as collation,
          CONNECTION_ID() as connection_id,
          @@have_ssl as ssl_available
      `);
      const dbInfo = dbInfoRows[0];

      // テーブル一覧の取得
      const [tableRows]: any = await connection.execute('SHOW TABLES');
      const tableCount = tableRows.length;

      console.log('✓ Primary database connection successful');
      console.log(`  MySQL Version: ${version}`);
      console.log(`  Database: ${dbInfo.current_db}`);
      console.log(`  Tables: ${tableCount}`);
      console.log(`  SSL: ${dbInfo.ssl_available === 'YES' ? 'Enabled' : 'Disabled'}`);

      return {
        status: 'success',
        message: 'Primary database connection successful',
        details: {
          version,
          database: dbInfo.current_db,
          charset: dbInfo.charset,
          collation: dbInfo.collation,
          ssl: dbInfo.ssl_available === 'YES',
          connectionId: dbInfo.connection_id
        }
      };
    } catch (error) {
      console.error('✗ Primary database connection failed:', error);
      return {
        status: 'error',
        message: 'Primary database connection failed',
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  /**
   * レプリカデータベースへの接続テスト
   */
  async testReplicaConnection(): Promise<ConnectionTestResult> {
    let connection: mysql.Connection | null = null;

    try {
      console.log('\nTesting replica database connection...');

      const replicaConfig = {
        ...this.config,
        host: process.env.DB_REPLICA_HOST || 'mysql-replica.medical-system.kosei-kai.jp'
      };

      console.log(`Host: ${replicaConfig.host}:${replicaConfig.port}`);

      connection = await mysql.createConnection(replicaConfig);

      // レプリカステータスの確認
      const [statusRows]: any = await connection.execute('SHOW SLAVE STATUS');
      const slaveStatus = statusRows[0];

      console.log('✓ Replica database connection successful');

      if (slaveStatus) {
        console.log(`  Slave IO Running: ${slaveStatus.Slave_IO_Running}`);
        console.log(`  Slave SQL Running: ${slaveStatus.Slave_SQL_Running}`);
        console.log(`  Seconds Behind Master: ${slaveStatus.Seconds_Behind_Master}`);
      }

      return {
        status: 'success',
        message: 'Replica database connection successful',
        details: {
          database: this.config.database,
          ssl: !!this.config.ssl
        }
      };
    } catch (error) {
      console.error('✗ Replica database connection failed:', error);
      return {
        status: 'error',
        message: 'Replica database connection failed',
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  /**
   * コンプライアンステーブルの作成テスト
   */
  async testTableCreation(): Promise<ConnectionTestResult> {
    let connection: mysql.Connection | null = null;

    try {
      console.log('\nTesting table creation...');

      connection = await mysql.createConnection(this.config);

      // テスト用テーブルの作成
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS compliance_test (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          test_data VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // データの挿入
      const [insertResult]: any = await connection.execute(
        'INSERT INTO compliance_test (test_data) VALUES (?)',
        [`Test at ${new Date().toISOString()}`]
      );

      // データの取得
      const [selectRows]: any = await connection.execute(
        'SELECT * FROM compliance_test ORDER BY id DESC LIMIT 1'
      );

      // テストテーブルの削除
      await connection.execute('DROP TABLE IF EXISTS compliance_test');

      console.log('✓ Table operations successful');
      console.log(`  Insert ID: ${insertResult.insertId}`);
      console.log(`  Retrieved: ${selectRows[0]?.test_data}`);

      return {
        status: 'success',
        message: 'Table operations successful'
      };
    } catch (error) {
      console.error('✗ Table operation failed:', error);
      return {
        status: 'error',
        message: 'Table operation failed',
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  /**
   * 全接続テストの実行
   */
  async runAllTests(): Promise<void> {
    console.log('MySQL Connection Test Suite');
    console.log('===========================\n');

    const results: ConnectionTestResult[] = [];

    // プライマリ接続テスト
    results.push(await this.testPrimaryConnection());

    // レプリカ接続テスト
    results.push(await this.testReplicaConnection());

    // テーブル操作テスト
    results.push(await this.testTableCreation());

    // 結果サマリー
    console.log('\n===========================');
    console.log('Test Summary:');
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    console.log(`✓ Passed: ${successCount}`);
    console.log(`✗ Failed: ${errorCount}`);

    if (errorCount > 0) {
      console.log('\nFailed tests:');
      results
        .filter(r => r.status === 'error')
        .forEach(r => {
          console.log(`  - ${r.message}: ${r.error}`);
        });
      process.exit(1);
    } else {
      console.log('\nAll tests passed successfully! ✨');
      process.exit(0);
    }
  }
}

// メイン実行
if (require.main === module) {
  const tester = new MySQLConnectionTester();
  tester.runAllTests().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

export { MySQLConnectionTester, ConnectionTestResult };