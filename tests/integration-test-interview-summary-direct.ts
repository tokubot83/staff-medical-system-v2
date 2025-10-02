/**
 * 面談サマリ統合テスト（直接API呼び出し版）
 * 医療システム → VoiceDrive 送受信テスト
 */

// VoiceDrive APIに直接送信するテスト

const VOICEDRIVE_API_URL = 'http://localhost:3003/api/sync/interview-results';
const AUTH_TOKEN = process.env.MEDICAL_SYSTEM_API_KEY || 'vd_prod_key_A8B9C2D3E4F5G6H7I8J9K0L1M2N3O4P5';

interface TestResult {
  success: boolean;
  responseTime: number;
  statusCode?: number;
  data?: any;
  error?: string;
}

// ============================================
// Phase 1: 基本疎通テスト
// ============================================

async function phase1_basicTest(): Promise<boolean> {
  console.log('\n=== Phase 1: 基本疎通テスト ===\n');

  const testData = {
    requestId: 'test-req-001',
    interviewId: 'test-int-001',
    completedAt: '2025-10-02T10:00:00.000Z',
    duration: 30,
    summary: '統合テスト用の面談サマリです。職員の状況は良好で、業務遂行能力も向上しています。',
    keyPoints: [
      'テストポイント1: 業務遂行能力の向上',
      'テストポイント2: コミュニケーション能力の向上'
    ],
    actionItems: [
      {
        description: 'テストアクション: キャリアプラン作成',
        dueDate: '2025-10-09T00:00:00.000Z'
      }
    ],
    followUpRequired: true,
    followUpDate: '2025-11-01T00:00:00.000Z',
    feedbackToEmployee: 'テストフィードバック: 良好な状態です',
    nextRecommendations: {
      suggestedNextInterview: '2026-01-01T00:00:00.000Z',
      suggestedTopics: ['キャリア開発', 'スキルアップ']
    }
  };

  console.log('送信データ:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('');

  try {
    const startTime = Date.now();

    const response = await fetch(VOICEDRIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(testData)
    });

    const responseTime = Date.now() - startTime;
    const responseData = await response.json();

    console.log(`✅ レスポンス: HTTP ${response.status}`);
    console.log(`⏱️  レスポンスタイム: ${responseTime}ms`);
    console.log('レスポンスデータ:');
    console.log(JSON.stringify(responseData, null, 2));

    if (response.ok && responseData.success) {
      console.log('\n✅ Phase 1 成功: 基本疎通テスト完了');
      return true;
    } else {
      console.log('\n❌ Phase 1 失敗: 送信エラー');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Phase 1 失敗: 例外発生');
    console.error('エラー詳細:', error);
    return false;
  }
}

// ============================================
// Phase 2: エラーケーステスト
// ============================================

async function phase2_errorTests(): Promise<boolean> {
  console.log('\n=== Phase 2: エラーケーステスト ===\n');

  let allSuccess = true;

  // Test 2-1: 認証エラー
  console.log('Test 2-1: 認証エラーテスト');

  try {
    const response = await fetch(VOICEDRIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization ヘッダーを省略
      },
      body: JSON.stringify({
        requestId: 'test-req-auth-error',
        interviewId: 'test-int-auth-error',
        completedAt: '2025-10-02T10:00:00.000Z',
        duration: 30,
        summary: 'テスト',
        keyPoints: [],
        actionItems: [],
        followUpRequired: false,
        feedbackToEmployee: 'テスト',
        nextRecommendations: { suggestedTopics: [] }
      })
    });

    const data = await response.json();

    if (response.status === 401 && !data.success) {
      console.log(`  ✅ 認証エラー正常検出 (HTTP ${response.status})`);
      console.log(`    エラー: ${data.error}`);
    } else {
      console.log(`  ❌ 認証エラーが期待と異なる (HTTP ${response.status})`);
      allSuccess = false;
    }
  } catch (error) {
    console.error('  ❌ 認証エラーテスト失敗:', error);
    allSuccess = false;
  }

  console.log('');

  // Test 2-2: バリデーションエラー（必須フィールド欠落）
  console.log('Test 2-2: バリデーションエラーテスト（必須フィールド欠落）');

  try {
    const response = await fetch(VOICEDRIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        requestId: 'test-req-validation-error',
        interviewId: 'test-int-validation-error',
        completedAt: '2025-10-02T10:00:00.000Z',
        duration: 30,
        // summary: 'テスト', // 意図的に削除
        keyPoints: [],
        actionItems: [],
        followUpRequired: false,
        feedbackToEmployee: 'テスト',
        nextRecommendations: { suggestedTopics: [] }
      })
    });

    const data = await response.json();

    if (response.status === 400 && !data.success) {
      console.log(`  ✅ バリデーションエラー正常検出 (HTTP ${response.status})`);
      console.log(`    エラー: ${data.error}`);
      console.log(`    詳細: ${data.details}`);
    } else {
      console.log(`  ❌ バリデーションエラーが期待と異なる (HTTP ${response.status})`);
      allSuccess = false;
    }
  } catch (error) {
    console.error('  ❌ バリデーションエラーテスト失敗:', error);
    allSuccess = false;
  }

  console.log('');

  // Test 2-3: データ型エラー
  console.log('Test 2-3: データ型エラーテスト（keyPointsが配列でない）');

  try {
    const response = await fetch(VOICEDRIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        requestId: 'test-req-type-error',
        interviewId: 'test-int-type-error',
        completedAt: '2025-10-02T10:00:00.000Z',
        duration: 30,
        summary: 'テスト',
        keyPoints: 'invalid', // 配列ではなく文字列
        actionItems: [],
        followUpRequired: false,
        feedbackToEmployee: 'テスト',
        nextRecommendations: { suggestedTopics: [] }
      })
    });

    const data = await response.json();

    if (response.status === 400 && !data.success) {
      console.log(`  ✅ データ型エラー正常検出 (HTTP ${response.status})`);
      console.log(`    エラー: ${data.error}`);
      console.log(`    詳細: ${data.details}`);
    } else {
      console.log(`  ❌ データ型エラーが期待と異なる (HTTP ${response.status})`);
      allSuccess = false;
    }
  } catch (error) {
    console.error('  ❌ データ型エラーテスト失敗:', error);
    allSuccess = false;
  }

  console.log('');

  if (allSuccess) {
    console.log('✅ Phase 2 成功: エラーケーステスト完了\n');
  } else {
    console.log('❌ Phase 2 失敗: 一部テスト失敗\n');
  }

  return allSuccess;
}

// ============================================
// Phase 3: 実運用想定テスト
// ============================================

async function phase3_realWorldTests(): Promise<boolean> {
  console.log('\n=== Phase 3: 実運用想定テスト ===\n');

  let allSuccess = true;

  // Test 3-1: 複数件連続送信
  console.log('Test 3-1: 複数件連続送信（5件）\n');

  const results: boolean[] = [];

  for (let i = 1; i <= 5; i++) {
    const testData = {
      requestId: `test-req-${String(i).padStart(3, '0')}`,
      interviewId: `test-int-${String(i).padStart(3, '0')}`,
      completedAt: new Date().toISOString(),
      duration: 30 + (i * 5),
      summary: `統合テスト用の面談サマリ ${i}件目。${i % 2 === 0 ? 'フォローアップが必要です。' : '特に問題ありません。'}`,
      keyPoints: [
        `ポイント${i}-1: 業務状況`,
        `ポイント${i}-2: コミュニケーション`
      ],
      actionItems: [
        {
          description: `アクション${i}: 次回面談までの課題`,
          dueDate: new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)).toISOString()
        }
      ],
      followUpRequired: i % 2 === 0,
      followUpDate: i % 2 === 0 ? new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString() : undefined,
      feedbackToEmployee: `フィードバック${i}`,
      nextRecommendations: {
        suggestedNextInterview: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)).toISOString(),
        suggestedTopics: [`トピック${i}-1`, `トピック${i}-2`]
      }
    };

    try {
      const startTime = Date.now();

      const response = await fetch(VOICEDRIVE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify(testData)
      });

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      const success = response.ok && data.success;
      console.log(`  ${i}件目: ${success ? '✅ 成功' : '❌ 失敗'} (${responseTime}ms)`);
      results.push(success);

      // 負荷軽減のため少し待機
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`  ${i}件目: ❌ 例外発生`, error);
      results.push(false);
    }
  }

  const successCount = results.filter(r => r).length;
  console.log(`\n  結果: ${successCount}/5件 成功`);

  if (successCount === 5) {
    console.log('  ✅ Test 3-1 成功: 複数件連続送信完了\n');
  } else {
    console.log('  ❌ Test 3-1 失敗: 一部送信エラー\n');
    allSuccess = false;
  }

  // Test 3-2: 重複送信（更新テスト）
  console.log('Test 3-2: 重複送信（更新テスト）\n');

  // 1回目の送信
  const testData1 = {
    requestId: 'test-req-update',
    interviewId: 'test-int-update',
    completedAt: '2025-10-02T10:00:00.000Z',
    duration: 30,
    summary: '初回の面談サマリ',
    keyPoints: ['初回ポイント'],
    actionItems: [],
    followUpRequired: false,
    feedbackToEmployee: '初回フィードバック',
    nextRecommendations: {
      suggestedNextInterview: '2026-01-01T00:00:00.000Z',
      suggestedTopics: ['初回トピック']
    }
  };

  console.log('  1回目送信（新規作成）...');
  const response1 = await fetch(VOICEDRIVE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify(testData1)
  });

  const data1 = await response1.json();
  console.log(`    → ${response1.ok && data1.success ? '✅ 成功' : '❌ 失敗'}`);

  await new Promise(resolve => setTimeout(resolve, 500));

  // 2回目の送信（同じinterviewId）
  const testData2 = {
    requestId: 'test-req-update',
    interviewId: 'test-int-update', // 同じID
    completedAt: '2025-10-02T14:00:00.000Z',
    duration: 45,
    summary: '更新後の面談サマリ', // 変更
    keyPoints: ['更新後ポイント1', '更新後ポイント2'], // 変更
    actionItems: [
      { description: '追加アクション', dueDate: '2025-10-10T00:00:00.000Z' }
    ],
    followUpRequired: true, // 変更
    followUpDate: '2025-11-01T00:00:00.000Z',
    feedbackToEmployee: '更新後フィードバック',
    nextRecommendations: {
      suggestedNextInterview: '2026-02-01T00:00:00.000Z',
      suggestedTopics: ['更新後トピック']
    }
  };

  console.log('  2回目送信（既存レコード更新）...');
  const response2 = await fetch(VOICEDRIVE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify(testData2)
  });

  const data2 = await response2.json();
  console.log(`    → ${response2.ok && data2.success ? '✅ 成功' : '❌ 失敗'}`);

  if (response1.ok && data1.success && response2.ok && data2.success) {
    console.log('  ✅ Test 3-2 成功: 重複送信・更新動作確認\n');
  } else {
    console.log('  ❌ Test 3-2 失敗\n');
    allSuccess = false;
  }

  // Test 3-3: フォローアップパターン
  console.log('Test 3-3: フォローアップパターン\n');

  // パターンA: フォローアップ必要
  const testDataFollowUpYes = {
    requestId: 'test-req-followup-yes',
    interviewId: 'test-int-followup-yes',
    completedAt: '2025-10-02T10:00:00.000Z',
    duration: 30,
    summary: 'フォローアップが必要な面談。1週間後に進捗確認を実施します。',
    keyPoints: ['要対応事項あり', '進捗確認が必要'],
    actionItems: [
      {
        description: '1週間後にフォローアップ',
        dueDate: '2025-10-09T00:00:00.000Z'
      }
    ],
    followUpRequired: true,
    followUpDate: '2025-10-09T00:00:00.000Z',
    feedbackToEmployee: '次回面談で進捗を確認します',
    nextRecommendations: {
      suggestedNextInterview: '2025-10-09T00:00:00.000Z',
      suggestedTopics: ['進捗確認', '課題解決']
    }
  };

  console.log('  パターンA: フォローアップ必要...');
  const responseA = await fetch(VOICEDRIVE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify(testDataFollowUpYes)
  });

  const dataA = await responseA.json();
  console.log(`    → ${responseA.ok && dataA.success ? '✅ 成功' : '❌ 失敗'}`);

  await new Promise(resolve => setTimeout(resolve, 200));

  // パターンB: フォローアップ不要
  const testDataFollowUpNo = {
    requestId: 'test-req-followup-no',
    interviewId: 'test-int-followup-no',
    completedAt: '2025-10-02T10:00:00.000Z',
    duration: 30,
    summary: 'フォローアップが不要な面談。特に問題はありません。',
    keyPoints: ['特に問題なし', '良好な状態'],
    actionItems: [],
    followUpRequired: false,
    feedbackToEmployee: '良好な状態です',
    nextRecommendations: {
      suggestedNextInterview: '2026-01-01T00:00:00.000Z',
      suggestedTopics: ['定期面談']
    }
  };

  console.log('  パターンB: フォローアップ不要...');
  const responseB = await fetch(VOICEDRIVE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify(testDataFollowUpNo)
  });

  const dataB = await responseB.json();
  console.log(`    → ${responseB.ok && dataB.success ? '✅ 成功' : '❌ 失敗'}`);

  if (responseA.ok && dataA.success && responseB.ok && dataB.success) {
    console.log('  ✅ Test 3-3 成功: フォローアップパターン確認\n');
  } else {
    console.log('  ❌ Test 3-3 失敗\n');
    allSuccess = false;
  }

  if (allSuccess) {
    console.log('✅ Phase 3: 実運用想定テスト完了');
  } else {
    console.log('❌ Phase 3: 一部テスト失敗');
  }

  return allSuccess;
}

// ============================================
// メイン実行
// ============================================

async function runIntegrationTest() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   面談サマリ統合テスト 実行開始       ║');
  console.log('║   医療システム → VoiceDrive          ║');
  console.log('║   (直接API呼び出し版)                ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`\nVoiceDrive API: ${VOICEDRIVE_API_URL}`);
  console.log(`認証トークン: ${AUTH_TOKEN.substring(0, 20)}...`);

  const results = {
    phase1: false,
    phase2: false,
    phase3: false
  };

  // Phase 1実行
  results.phase1 = await phase1_basicTest();

  if (!results.phase1) {
    console.log('\n❌ Phase 1が失敗したため、テストを中断します');
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Phase 2実行
  results.phase2 = await phase2_errorTests();

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Phase 3実行
  results.phase3 = await phase3_realWorldTests();

  // 結果サマリー
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║        統合テスト結果サマリー         ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`  Phase 1 (基本疎通):       ${results.phase1 ? '✅ 成功' : '❌ 失敗'}`);
  console.log(`  Phase 2 (エラーケース):   ${results.phase2 ? '✅ 成功' : '❌ 失敗'}`);
  console.log(`  Phase 3 (実運用想定):     ${results.phase3 ? '✅ 成功' : '❌ 失敗'}`);
  console.log('');

  const allSuccess = results.phase1 && results.phase2 && results.phase3;

  if (allSuccess) {
    console.log('🎉 全テスト成功！面談サマリ送受信機能は正常に動作しています。');
  } else {
    console.log('⚠️  一部テストが失敗しました。詳細を確認してください。');
  }

  console.log('\n次のステップ:');
  console.log('  1. VoiceDrive側でデータ受信を確認');
  console.log('  2. テスト結果を報告書に記録');
  console.log('  3. 本番環境での疎通確認計画');
}

// 実行
runIntegrationTest()
  .then(() => {
    console.log('\n統合テスト実行完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n統合テスト実行エラー:', error);
    process.exit(1);
  });
