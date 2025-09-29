/**
 * 健康管理システム データベース接続
 * Created: 2025-09-29
 */

import { PrismaClient } from '@prisma/client';

declare global {
  var healthPrisma: PrismaClient | undefined;
}

// DATABASE_URLの有無を確認
const databaseUrl = process.env.HEALTH_DATABASE_URL || process.env.DATABASE_URL || '';

// データベース接続がない場合のスタブ
const createStubClient = () => {
  return {
    $connect: async () => {},
    $disconnect: async () => {},
    $transaction: async (fn: any) => fn({}),
    healthCheckup: {
      findMany: async () => [],
      findUnique: async () => null,
      findFirst: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
      count: async () => 0,
    },
    healthCheckupDetail: {
      findMany: async () => [],
      create: async () => ({}),
      createMany: async () => ({ count: 0 }),
      deleteMany: async () => ({ count: 0 }),
    },
  } as any;
};

// 開発環境でのホットリロード対応
export const healthDb = global.healthPrisma || (databaseUrl
  ? new PrismaClient({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    })
  : createStubClient());

if (process.env.NODE_ENV !== 'production' && databaseUrl) {
  global.healthPrisma = healthDb;
}

// データベース接続テスト
export async function testHealthDbConnection(): Promise<boolean> {
  if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL not set');
    return false;
  }

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
  if (!databaseUrl) {
    return fn({} as PrismaClient);
  }
  return await healthDb.$transaction(async (prisma) => {
    return await fn(prisma as PrismaClient);
  });
}

// クリーンアップ処理
export async function disconnectHealthDb(): Promise<void> {
  if (databaseUrl) {
    await healthDb.$disconnect();
  }
}