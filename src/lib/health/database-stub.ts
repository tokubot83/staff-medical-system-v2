/**
 * データベーススタブ（ビルド時用）
 * 本番環境変数が設定されるまでの暫定対応
 * Created: 2025-09-29
 */

// Prisma Clientの型定義のみをエクスポート
export const prismaHealth = {
  healthCheckup: {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    count: async () => 0
  },
  healthCheckupDetail: {
    findMany: async () => [],
    create: async () => null,
    createMany: async () => ({ count: 0 }),
    deleteMany: async () => ({ count: 0 })
  }
} as any;

export const prismaStress = {
  stressCheckResult: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => null
  }
} as any;