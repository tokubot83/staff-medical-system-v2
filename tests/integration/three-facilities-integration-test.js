/**
 * 3施設統合テスト
 * 小原病院、立神リハビリテーション温泉病院、エスポワール立神の統合動作確認
 * 作成日: 2025年9月28日
 */

const { FacilityPositionMappingService } = require('../../src/lib/facility-position-mapping');
const { AccountLevelCalculator } = require('../../src/services/accountLevelCalculator');

// テストデータ定義
const testCases = {
  // 小原病院
  'obara-hospital': [
    { id: 'OBARA_001', name: '小原院長', position: '院長', expectedLevel: 13 },
    { id: 'OBARA_002', name: '小原看護部長', position: '看護部長', expectedLevel: 10 },
    { id: 'OBARA_003', name: '小原主任', position: '主任', expectedLevel: 5 },
  ],

  // 立神リハビリテーション温泉病院
  'tategami-rehabilitation': [
    { id: 'TATE_001', name: '立神総師長', position: '総師長', expectedLevel: 10 },
    { id: 'TATE_002', name: '立神統括主任', position: '統括主任', expectedLevel: 7 }, // レベル7に修正済み
    { id: 'TATE_003', name: '立神主任', position: '主任', expectedLevel: 5 },
  ],

  // エスポワール立神
  'espoir-tategami': [
    { id: 'ESP_001', name: '石崎直樹', position: '施設長', expectedLevel: 13 },
    { id: 'ESP_002', name: '平篤', position: '入所課課長', expectedLevel: 11, additionalPosition: '支援相談室長' },
    { id: 'ESP_003', name: '阿久根一信', position: '在宅課課長', expectedLevel: 11, additionalPosition: '居宅介護支援事業所管理者' },
    { id: 'ESP_004', name: '介護部A主任', position: '介護部Aフロア主任', expectedLevel: 5 },
    { id: 'ESP_005', name: '看護主任', position: '看護主任', expectedLevel: 5 },
  ]
};

// 施設間異動テストケース
const transferTestCases = [
  {
    staffId: 'TRANS_001',
    name: '異動テスト職員1',
    from: { facility: 'obara-hospital', position: '薬剤部長', expectedLevel: 10 },
    to: { facility: 'tategami-rehabilitation', position: '薬局長', expectedLevel: 8 }
  },
  {
    staffId: 'TRANS_002',
    name: '異動テスト職員2',
    from: { facility: 'tategami-rehabilitation', position: '統括主任', expectedLevel: 7 },
    to: { facility: 'obara-hospital', position: '科長', expectedLevel: 8 }
  },
  {
    staffId: 'TRANS_003',
    name: '異動テスト職員3',
    from: { facility: 'espoir-tategami', position: '看護師長', expectedLevel: 10 },
    to: { facility: 'obara-hospital', position: '看護部長', expectedLevel: 10 }
  }
];

// 主任レベル一貫性テスト
const chiefLevelConsistencyTest = [
  { facility: 'obara-hospital', position: '主任', expectedLevel: 5 },
  { facility: 'obara-hospital', position: '主任看護師', expectedLevel: 5 },
  { facility: 'tategami-rehabilitation', position: '主任', expectedLevel: 5 },
  { facility: 'tategami-rehabilitation', position: '介護主任', expectedLevel: 5 },
  { facility: 'tategami-rehabilitation', position: 'リハビリテーション部門主任', expectedLevel: 5 },
  { facility: 'espoir-tategami', position: '事務主任', expectedLevel: 5 },
  { facility: 'espoir-tategami', position: '看護主任', expectedLevel: 5 },
  { facility: 'espoir-tategami', position: '介護部Aフロア主任', expectedLevel: 5 },
  { facility: 'espoir-tategami', position: '栄養管理部主任', expectedLevel: 5 },
];

// テスト実行関数
async function runIntegrationTests() {
  console.log('═════════════════════════════════════════════════════════════');
  console.log('  3施設統合テスト開始');
  console.log('  対象: 小原病院、立神リハビリテーション温泉病院、エスポワール立神');
  console.log('═════════════════════════════════════════════════════════════\n');

  const service = new FacilityPositionMappingService();
  const calculator = new AccountLevelCalculator();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // 1. 各施設の権限レベル計算テスト
  console.log('【1. 施設別権限レベル計算テスト】');
  console.log('─'.repeat(60));

  for (const [facilityId, cases] of Object.entries(testCases)) {
    console.log(`\n施設: ${facilityId}`);
    console.log('─'.repeat(40));

    for (const testCase of cases) {
      totalTests++;
      const level = service.getPositionLevel(facilityId, testCase.position);

      if (level === testCase.expectedLevel) {
        console.log(`✅ ${testCase.position}: Level ${level} (期待値: ${testCase.expectedLevel})`);
        passedTests++;
      } else {
        console.log(`❌ ${testCase.position}: Level ${level} (期待値: ${testCase.expectedLevel})`);
        failedTests++;
      }

      // 兼任職の場合の追加チェック
      if (testCase.additionalPosition) {
        const additionalLevel = service.getPositionLevel(facilityId, testCase.additionalPosition);
        console.log(`   └ 兼任: ${testCase.additionalPosition} (Level ${additionalLevel})`);
        console.log(`   └ 適用レベル: ${Math.max(level, additionalLevel)} (高い方を採用)`);
      }
    }
  }

  // 2. 主任レベル一貫性テスト
  console.log('\n\n【2. 主任レベル一貫性テスト】');
  console.log('─'.repeat(60));
  console.log('全施設で主任職がレベル5で統一されているか確認');
  console.log('─'.repeat(40));

  for (const test of chiefLevelConsistencyTest) {
    totalTests++;
    const level = service.getPositionLevel(test.facility, test.position);

    if (level === test.expectedLevel) {
      console.log(`✅ [${test.facility}] ${test.position}: Level ${level}`);
      passedTests++;
    } else {
      console.log(`❌ [${test.facility}] ${test.position}: Level ${level} (期待値: ${test.expectedLevel})`);
      failedTests++;
    }
  }

  // 3. 施設間異動テスト
  console.log('\n\n【3. 施設間異動時の権限調整テスト】');
  console.log('─'.repeat(60));

  for (const transfer of transferTestCases) {
    totalTests++;
    console.log(`\n${transfer.name} (${transfer.staffId})`);
    console.log(`移動前: ${transfer.from.facility} - ${transfer.from.position}`);
    console.log(`移動後: ${transfer.to.facility} - ${transfer.to.position}`);

    const fromLevel = service.getPositionLevel(transfer.from.facility, transfer.from.position);
    const toLevel = service.getPositionLevel(transfer.to.facility, transfer.to.position);

    console.log(`レベル変化: ${fromLevel} → ${toLevel}`);

    if (fromLevel === transfer.from.expectedLevel && toLevel === transfer.to.expectedLevel) {
      console.log('✅ 権限レベル調整: 正常');
      passedTests++;
    } else {
      console.log('❌ 権限レベル調整: 異常');
      failedTests++;
    }
  }

  // 4. 統括主任特別確認（立神リハビリ）
  console.log('\n\n【4. 統括主任レベル7確認（Phase 3調整）】');
  console.log('─'.repeat(60));

  totalTests++;
  const toukatsuLevel = service.getPositionLevel('tategami-rehabilitation', '統括主任');
  if (toukatsuLevel === 7) {
    console.log('✅ 統括主任レベル: 7 (Phase 3調整完了)');
    passedTests++;
  } else {
    console.log(`❌ 統括主任レベル: ${toukatsuLevel} (期待値: 7)');
    console.log('   ⚠️ Phase 3の調整が反映されていない可能性があります`);
    failedTests++;
  }

  // テスト結果サマリー
  console.log('\n\n═════════════════════════════════════════════════════════════');
  console.log('  テスト結果サマリー');
  console.log('═════════════════════════════════════════════════════════════');
  console.log(`  総テスト数: ${totalTests}`);
  console.log(`  成功: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`);
  console.log(`  失敗: ${failedTests} (${Math.round(failedTests/totalTests*100)}%)`);
  console.log('═════════════════════════════════════════════════════════════');

  if (failedTests === 0) {
    console.log('\n🎉 すべてのテストが成功しました！');
    console.log('3施設統合の準備が整いました。');
  } else {
    console.log('\n⚠️ 一部のテストが失敗しました。');
    console.log('失敗したテストを確認し、修正してください。');
  }

  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    successRate: Math.round(passedTests/totalTests*100)
  };
}

// モジュールエクスポート
module.exports = {
  runIntegrationTests,
  testCases,
  transferTestCases,
  chiefLevelConsistencyTest
};

// 直接実行の場合
if (require.main === module) {
  runIntegrationTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('テスト実行エラー:', error);
      process.exit(1);
    });
}