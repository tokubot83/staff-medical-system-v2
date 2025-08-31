/**
 * 本番用データベース接続設定
 * Phase 2本番環境対応・高可用性・セキュリティ強化
 */

import { Pool, PoolConfig } from 'pg';

interface ProductionDatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  maxConnections: number;
  connectionTimeoutMs: number;
  idleTimeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
}

class ProductionDatabase {
  private static instance: ProductionDatabase;
  private pool: Pool;
  private config: ProductionDatabaseConfig;

  private constructor() {
    this.config = this.loadProductionConfig();
    this.pool = this.createConnectionPool();
    this.initializeHealthChecks();
  }

  static getInstance(): ProductionDatabase {
    if (!ProductionDatabase.instance) {
      ProductionDatabase.instance = new ProductionDatabase();
    }
    return ProductionDatabase.instance;
  }

  /**
   * 本番環境設定読み込み
   */
  private loadProductionConfig(): ProductionDatabaseConfig {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required for production');
    }

    // PostgreSQL接続URL解析
    const url = new URL(databaseUrl);
    
    return {
      host: url.hostname || 'prod-db.medical-system.local',
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1) || 'medical_staff_system_prod',
      username: url.username || 'medical_user',
      password: url.password || '',
      ssl: true, // 本番は常にSSL
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '50'),
      connectionTimeoutMs: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
      idleTimeoutMs: parseInt(process.env.DB_IDLE_TIMEOUT || '300000'),
      retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '3'),
      retryDelayMs: parseInt(process.env.DB_RETRY_DELAY || '5000')
    };
  }

  /**
   * 本番用接続プール作成
   */
  private createConnectionPool(): Pool {
    const poolConfig: PoolConfig = {
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
      ssl: this.config.ssl ? {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA_CERT,
        cert: process.env.DB_SSL_CLIENT_CERT,
        key: process.env.DB_SSL_CLIENT_KEY
      } : false,
      max: this.config.maxConnections,
      min: 5, // 最小接続数
      acquireTimeoutMillis: this.config.connectionTimeoutMs,
      idleTimeoutMillis: this.config.idleTimeoutMs,
      connectionTimeoutMillis: this.config.connectionTimeoutMs,
      allowExitOnIdle: false
    };

    const pool = new Pool(poolConfig);

    // 接続エラーハンドリング
    pool.on('error', (err) => {
      console.error('🚨 Production database pool error:', err);
      this.handleConnectionError(err);
    });

    pool.on('connect', (client) => {
      console.log('✅ New production database connection established');
    });

    pool.on('remove', (client) => {
      console.log('⚠️ Database connection removed from pool');
    });

    return pool;
  }

  /**
   * ヘルスチェック初期化
   */
  private initializeHealthChecks(): void {
    // 定期ヘルスチェック（5分間隔）
    setInterval(async () => {
      try {
        await this.healthCheck();
      } catch (error) {
        console.error('Database health check failed:', error);
      }
    }, 5 * 60 * 1000);
  }

  /**
   * データベース接続テスト
   */
  async healthCheck(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT 1 as health_check, NOW() as timestamp');
      client.release();

      console.log('✅ Database health check passed:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }

  /**
   * V3異議申立データ保存
   */
  async saveV3Appeal(appealData: {
    appealId: string;
    employeeId: string;
    employeeName: string;
    evaluationPeriod: string;
    appealType: string;
    appealReason: string;
    appealDetails: string;
    scoreDetails: any;
    relativeGrade: string;
    conversationId: string;
    voiceDriveUserId: string;
    status: string;
    submittedAt: string;
    receivedAt: string;
    assignedTo: string;
    priority: string;
    estimatedResponseDate: string;
    environment: string;
  }): Promise<void> {
    const query = `
      INSERT INTO ${process.env.APPEALS_TABLE || 'v3_appeals_production'} (
        appeal_id, employee_id, employee_name, evaluation_period,
        appeal_type, appeal_reason, appeal_details, score_details,
        relative_grade, conversation_id, voicedrive_user_id,
        status, submitted_at, received_at, assigned_to,
        priority, estimated_response_date, environment,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
    `;

    const values = [
      appealData.appealId,
      appealData.employeeId,
      appealData.employeeName,
      appealData.evaluationPeriod,
      appealData.appealType,
      appealData.appealReason,
      appealData.appealDetails,
      JSON.stringify(appealData.scoreDetails),
      appealData.relativeGrade,
      appealData.conversationId,
      appealData.voiceDriveUserId,
      appealData.status,
      appealData.submittedAt,
      appealData.receivedAt,
      appealData.assignedTo,
      appealData.priority,
      appealData.estimatedResponseDate,
      appealData.environment
    ];

    await this.executeWithRetry(query, values);
    console.log(`✅ V3 Appeal saved to production database: ${appealData.appealId}`);
  }

  /**
   * V3評価通知履歴保存
   */
  async saveV3EvaluationNotification(notificationData: {
    notificationId: string;
    staffId: string;
    staffName: string;
    department: string;
    notificationType: string;
    evaluationYear: number;
    evaluationData: any;
    deliveryStatus: string;
    sentAt: string;
    deliveredAt?: string;
    environment: string;
  }): Promise<void> {
    const query = `
      INSERT INTO ${process.env.EVALUATIONS_TABLE || 'v3_evaluations_production'} (
        notification_id, staff_id, staff_name, department,
        notification_type, evaluation_year, evaluation_data,
        delivery_status, sent_at, delivered_at, environment,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
    `;

    const values = [
      notificationData.notificationId,
      notificationData.staffId,
      notificationData.staffName,
      notificationData.department,
      notificationData.notificationType,
      notificationData.evaluationYear,
      JSON.stringify(notificationData.evaluationData),
      notificationData.deliveryStatus,
      notificationData.sentAt,
      notificationData.deliveredAt || null,
      notificationData.environment
    ];

    await this.executeWithRetry(query, values);
    console.log(`✅ V3 Evaluation notification saved: ${notificationData.notificationId}`);
  }

  /**
   * バッチ通知統計記録
   */
  async saveBatchNotificationStats(batchData: {
    batchId: string;
    totalNotifications: number;
    successfulNotifications: number;
    failedNotifications: number;
    successRate: number;
    processingTimeMs: number;
    startedAt: string;
    completedAt: string;
    environment: string;
  }): Promise<void> {
    const query = `
      INSERT INTO batch_notification_stats (
        batch_id, total_notifications, successful_notifications,
        failed_notifications, success_rate, processing_time_ms,
        started_at, completed_at, environment,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
    `;

    const values = [
      batchData.batchId,
      batchData.totalNotifications,
      batchData.successfulNotifications,
      batchData.failedNotifications,
      batchData.successRate,
      batchData.processingTimeMs,
      batchData.startedAt,
      batchData.completedAt,
      batchData.environment
    ];

    await this.executeWithRetry(query, values);
    console.log(`📊 Batch notification stats saved: ${batchData.batchId}`);
  }

  /**
   * リトライ機能付きクエリ実行
   */
  private async executeWithRetry(
    query: string,
    values: any[],
    attempt: number = 1
  ): Promise<any> {
    try {
      const client = await this.pool.connect();
      try {
        const result = await client.query(query, values);
        return result;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(`Database query failed (attempt ${attempt}/${this.config.retryAttempts}):`, error);

      if (attempt < this.config.retryAttempts) {
        console.log(`Retrying database operation in ${this.config.retryDelayMs}ms...`);
        await this.delay(this.config.retryDelayMs);
        return this.executeWithRetry(query, values, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * 接続エラーハンドリング
   */
  private handleConnectionError(error: Error): void {
    console.error('🚨 Critical database connection error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      config: {
        host: this.config.host,
        port: this.config.port,
        database: this.config.database
      }
    });

    // 本番では監視システムにアラート送信
    // await monitoringService.sendCriticalAlert({
    //   service: 'database',
    //   error: error.message,
    //   severity: 'critical'
    // });
  }

  /**
   * 接続プール統計取得
   */
  getPoolStats() {
    return {
      totalConnections: this.pool.totalCount,
      idleConnections: this.pool.idleCount,
      waitingClients: this.pool.waitingCount,
      config: this.config
    };
  }

  /**
   * 優雅なシャットダウン
   */
  async gracefulShutdown(): Promise<void> {
    console.log('🔄 Initiating graceful database shutdown...');
    
    try {
      await this.pool.end();
      console.log('✅ Database connections closed successfully');
    } catch (error) {
      console.error('❌ Error during database shutdown:', error);
      throw error;
    }
  }

  /**
   * 待機関数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 本番データベース接続のエクスポート
export const productionDb = ProductionDatabase.getInstance();

// 本番用簡易アクセス関数
export async function saveAppealToProductionDatabase(appealData: any): Promise<void> {
  await productionDb.saveV3Appeal(appealData);
}

export async function saveEvaluationNotificationToProduction(notificationData: any): Promise<void> {
  await productionDb.saveV3EvaluationNotification(notificationData);
}

export async function saveBatchStatsToProduction(batchData: any): Promise<void> {
  await productionDb.saveBatchNotificationStats(batchData);
}

export default productionDb;