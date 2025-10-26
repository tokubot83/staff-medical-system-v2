/**
 * Phase 2.5統合テスト用データ生成スクリプト
 *
 * 実行方法:
 * npx ts-node tests/integration/phase2.5-seed-test-data.ts
 */

import { PrismaClient, WebhookSendStatus, RetryQueueStatus, InterviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * テストデータを生成
 */
async function seedTestData() {
  console.log('🌱 Phase 2.5統合テスト用データ生成開始...\n');

  try {
    // 既存のテストデータをクリア
    console.log('🧹 既存のテストデータをクリア中...');
    await prisma.webhookRetryQueue.deleteMany({
      where: { originalLogId: { startsWith: 'test-' } }
    });
    await prisma.webhookSendLog.deleteMany({
      where: { id: { startsWith: 'test-' } }
    });
    await prisma.interview.deleteMany({
      where: { id: { startsWith: 'test-interview-' } }
    });
    console.log('✅ クリア完了\n');

    // 1. Webhook送信ログ100件を生成
    console.log('📊 Webhook送信ログ100件を生成中...');
    const webhookLogs = [];
    const now = new Date();

    // 成功ログ: 95件
    for (let i = 1; i <= 95; i++) {
      const sentAt = new Date(now.getTime() - (100 - i) * 60 * 60 * 1000); // 時系列で分散
      webhookLogs.push({
        id: `test-webhook-log-${String(i).padStart(3, '0')}`,
        eventType: i <= 50 ? 'employee.created' : 'interview.completed',
        eventTimestamp: sentAt,
        sentAt,
        staffId: `test-staff-${String(i % 20).padStart(3, '0')}`,
        requestId: `test-req-${String(i).padStart(3, '0')}`,
        payloadSize: 1024 + Math.floor(Math.random() * 2048),
        status: WebhookSendStatus.SUCCESS,
        httpStatusCode: 200,
        processingTime: 80 + Math.floor(Math.random() * 200), // 80-280ms
        responseBody: JSON.stringify({ success: true }),
        retryCount: 0,
        createdAt: sentAt
      });
    }

    // 失敗ログ: 3件
    for (let i = 96; i <= 98; i++) {
      const sentAt = new Date(now.getTime() - (100 - i) * 60 * 60 * 1000);
      webhookLogs.push({
        id: `test-webhook-log-${String(i).padStart(3, '0')}`,
        eventType: 'employee.updated',
        eventTimestamp: sentAt,
        sentAt,
        staffId: `test-staff-${String(i % 20).padStart(3, '0')}`,
        requestId: `test-req-${String(i).padStart(3, '0')}`,
        payloadSize: 1024,
        status: WebhookSendStatus.FAILED,
        httpStatusCode: 500,
        processingTime: 5000,
        errorMessage: 'HTTP 500: Internal Server Error',
        responseBody: JSON.stringify({ error: 'Internal Server Error' }),
        retryCount: 0,
        createdAt: sentAt
      });
    }

    // タイムアウトログ: 2件
    for (let i = 99; i <= 100; i++) {
      const sentAt = new Date(now.getTime() - (100 - i) * 60 * 60 * 1000);
      webhookLogs.push({
        id: `test-webhook-log-${String(i).padStart(3, '0')}`,
        eventType: 'interview.cancelled',
        eventTimestamp: sentAt,
        sentAt,
        staffId: `test-staff-${String(i % 20).padStart(3, '0')}`,
        requestId: `test-req-${String(i).padStart(3, '0')}`,
        payloadSize: 512,
        status: WebhookSendStatus.TIMEOUT,
        httpStatusCode: null,
        processingTime: 5000,
        errorMessage: 'Request timeout after 5000ms',
        responseBody: null,
        retryCount: 0,
        createdAt: sentAt
      });
    }

    await prisma.webhookSendLog.createMany({ data: webhookLogs });
    console.log(`✅ Webhook送信ログ100件生成完了`);
    console.log(`   - 成功: 95件`);
    console.log(`   - 失敗: 3件`);
    console.log(`   - タイムアウト: 2件\n`);

    // 2. リトライキュー5件を生成
    console.log('🔄 リトライキュー5件を生成中...');
    const retryQueue = [];

    // PENDING: 3件
    for (let i = 1; i <= 3; i++) {
      retryQueue.push({
        id: `test-retry-${String(i).padStart(3, '0')}`,
        originalLogId: `test-webhook-log-${String(96 + i - 1).padStart(3, '0')}`,
        eventType: 'employee.updated',
        payload: { data: { staffId: `test-staff-${i}`, action: 'update' } },
        retryAttempt: i - 1,
        maxRetries: 3,
        nextRetryAt: new Date(now.getTime() + 60 * 1000), // 1分後
        status: RetryQueueStatus.PENDING,
        lastError: 'HTTP 500: Internal Server Error',
        createdAt: new Date(now.getTime() - 10 * 60 * 1000)
      });
    }

    // PROCESSING: 1件
    retryQueue.push({
      id: 'test-retry-004',
      originalLogId: 'test-webhook-log-099',
      eventType: 'interview.cancelled',
      payload: { data: { interviewId: 'test-interview-001' } },
      retryAttempt: 0,
      maxRetries: 3,
      nextRetryAt: new Date(now.getTime() - 1 * 60 * 1000), // 1分前（処理中）
      status: RetryQueueStatus.PROCESSING,
      lastError: 'Request timeout',
      createdAt: new Date(now.getTime() - 5 * 60 * 1000)
    });

    // COMPLETED: 1件
    retryQueue.push({
      id: 'test-retry-005',
      originalLogId: 'test-webhook-log-100',
      eventType: 'interview.cancelled',
      payload: { data: { interviewId: 'test-interview-002' } },
      retryAttempt: 1,
      maxRetries: 3,
      nextRetryAt: new Date(now.getTime() - 10 * 60 * 1000),
      status: RetryQueueStatus.COMPLETED,
      lastError: null,
      createdAt: new Date(now.getTime() - 15 * 60 * 1000)
    });

    await prisma.webhookRetryQueue.createMany({ data: retryQueue });
    console.log(`✅ リトライキュー5件生成完了`);
    console.log(`   - PENDING: 3件`);
    console.log(`   - PROCESSING: 1件`);
    console.log(`   - COMPLETED: 1件\n`);

    // 3. 面談記録50件を生成（既存のemployeeIdを使用する必要があるため、まず確認）
    console.log('📅 面談記録50件を生成中...');

    // 既存の職員を取得
    const employees = await prisma.employee.findMany({
      take: 20,
      select: { id: true }
    });

    if (employees.length === 0) {
      console.warn('⚠️  警告: 職員データが存在しません。面談記録の生成をスキップします。');
      console.log('   先にEmployeeデータを作成してください。\n');
    } else {
      const interviews = [];

      // 完了: 45件
      for (let i = 1; i <= 45; i++) {
        const interviewDate = new Date(now.getTime() - (50 - i) * 24 * 60 * 60 * 1000);
        const employee = employees[i % employees.length];
        const interviewer = employees[(i + 5) % employees.length];

        interviews.push({
          id: `test-interview-${String(i).padStart(3, '0')}`,
          employeeId: employee.id,
          interviewerId: interviewer.id,
          interviewDate,
          interviewType: i <= 30 ? 'regular' : 'support',
          duration: 30,
          voicedriveSyncId: `vd-sync-${String(i).padStart(3, '0')}`,
          durationMinutes: 40 + Math.floor(Math.random() * 20), // 40-60分
          rescheduledFromId: null,
          interviewStatus: InterviewStatus.COMPLETED,
          notes: `Test interview ${i} - Completed`,
          createdAt: interviewDate,
          updatedAt: interviewDate
        });
      }

      // 予定: 2件
      for (let i = 46; i <= 47; i++) {
        const interviewDate = new Date(now.getTime() + (i - 45) * 24 * 60 * 60 * 1000);
        const employee = employees[i % employees.length];
        const interviewer = employees[(i + 5) % employees.length];

        interviews.push({
          id: `test-interview-${String(i).padStart(3, '0')}`,
          employeeId: employee.id,
          interviewerId: interviewer.id,
          interviewDate,
          interviewType: 'regular',
          duration: 30,
          voicedriveSyncId: `vd-sync-${String(i).padStart(3, '0')}`,
          durationMinutes: null,
          rescheduledFromId: null,
          interviewStatus: InterviewStatus.SCHEDULED,
          notes: `Test interview ${i} - Scheduled`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // キャンセル: 1件
      interviews.push({
        id: 'test-interview-048',
        employeeId: employees[0].id,
        interviewerId: employees[1].id,
        interviewDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        interviewType: 'support',
        duration: 30,
        voicedriveSyncId: 'vd-sync-048',
        durationMinutes: null,
        rescheduledFromId: null,
        interviewStatus: InterviewStatus.CANCELLED,
        notes: 'Test interview 48 - Cancelled',
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      });

      // 無断欠席: 2件
      for (let i = 49; i <= 50; i++) {
        const interviewDate = new Date(now.getTime() - (51 - i) * 24 * 60 * 60 * 1000);
        const employee = employees[i % employees.length];
        const interviewer = employees[(i + 5) % employees.length];

        interviews.push({
          id: `test-interview-${String(i).padStart(3, '0')}`,
          employeeId: employee.id,
          interviewerId: interviewer.id,
          interviewDate,
          interviewType: i === 49 ? 'regular' : 'support',
          duration: 30,
          voicedriveSyncId: `vd-sync-${String(i).padStart(3, '0')}`,
          durationMinutes: null,
          rescheduledFromId: null,
          interviewStatus: InterviewStatus.NO_SHOW,
          notes: `Test interview ${i} - No Show`,
          createdAt: interviewDate,
          updatedAt: interviewDate
        });
      }

      await prisma.interview.createMany({ data: interviews });
      console.log(`✅ 面談記録50件生成完了`);
      console.log(`   - 完了: 45件 (90.0%)`);
      console.log(`   - 予定: 2件`);
      console.log(`   - キャンセル: 1件`);
      console.log(`   - 無断欠席: 2件 (4.0%)\n`);
    }

    // 4. 統計情報を表示
    console.log('📊 生成されたテストデータ統計:');
    console.log('═══════════════════════════════════════════\n');

    const webhookStats = await prisma.webhookSendLog.groupBy({
      by: ['status'],
      _count: true,
      where: { id: { startsWith: 'test-' } }
    });

    console.log('Webhook送信ログ:');
    webhookStats.forEach(stat => {
      console.log(`  ${stat.status}: ${stat._count}件`);
    });

    const retryStats = await prisma.webhookRetryQueue.groupBy({
      by: ['status'],
      _count: true,
      where: { id: { startsWith: 'test-' } }
    });

    console.log('\nリトライキュー:');
    retryStats.forEach(stat => {
      console.log(`  ${stat.status}: ${stat._count}件`);
    });

    if (employees.length > 0) {
      const interviewStats = await prisma.interview.groupBy({
        by: ['interviewStatus'],
        _count: true,
        where: { id: { startsWith: 'test-interview-' } }
      });

      console.log('\n面談記録:');
      interviewStats.forEach(stat => {
        console.log(`  ${stat.interviewStatus}: ${stat._count}件`);
      });

      const totalScheduled = 50;
      const completed = 45;
      const completionRate = (completed / totalScheduled) * 100;
      const noShow = 2;
      const noShowRate = (noShow / totalScheduled) * 100;

      console.log(`\n面談統計:`);
      console.log(`  完了率: ${completionRate.toFixed(1)}%`);
      console.log(`  無断欠席率: ${noShowRate.toFixed(1)}%`);
    }

    console.log('\n✅ Phase 2.5統合テスト用データ生成完了！\n');
    console.log('次のコマンドでテストを実行できます:');
    console.log('  npx ts-node tests/integration/phase2.5-integration-test.ts\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプト実行
if (require.main === module) {
  seedTestData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedTestData };
