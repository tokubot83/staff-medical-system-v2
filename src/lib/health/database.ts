/**
 * 健康管理システム データベース接続
 * Created: 2025-09-29
 */

import { PrismaClient } from '@prisma/client';

declare global {
  var healthPrisma: PrismaClient | undefined;
}

// 開発環境でのホットリロード対応
export const healthDb = global.healthPrisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],

  datasources: {
    db: {
      url: process.env.HEALTH_DATABASE_URL || process.env.DATABASE_URL
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  global.healthPrisma = healthDb;
}

// データベース接続テスト
export async function testHealthDbConnection(): Promise<boolean> {
  try {
    await healthDb.$connect();
    console.log('✅ Health database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Health database connection failed:', error);
    return false;
  }
}

// トランザクション処理のヘルパー
export async function withHealthTransaction<T>(
  fn: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  return await healthDb.$transaction(async (prisma) => {
    return await fn(prisma as PrismaClient);
  });
}

// クリーンアップ処理
export async function disconnectHealthDb(): Promise<void> {
  await healthDb.$disconnect();
}