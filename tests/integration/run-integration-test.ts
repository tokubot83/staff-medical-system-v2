/**
 * 3施設統合テスト実行スクリプト
 * TypeScript版
 * 作成日: 2025年10月1日
 */

import { facilityPositionMappingService } from '../../src/lib/facility-position-mapping';

interface TestCase {
  facilityId: string;
  position: string;
  expectedLevel: number;
  additionalPosition?: string;
}

interface TestResult {
  total: number;
  passed: number;
  failed: number;
  details: Array<{
    test: string;
    result: 'PASS' | 'FAIL';
    expected?: any;
    actual?: any;
  }>;
}

// テスト開始
console.log('\n═════════════════════════════════════════════════════════════');
console.log('  Day 1: 基本機能テスト - レベル設定確認');
console.log('  実施日時: ' + new Date().toLocaleString('ja-JP'));
console.log('═════════════════════════════════════════════════════════════\n');

const testResult: TestResult = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// 1.1 施設長レベル確認
console.log('【1.1 施設長レベル確認】');
console.log('─'.repeat(50));

const directorTests: TestCase[] = [
  { facilityId: 'obara-hospital', position: '院長', expectedLevel: 13 },
  { facilityId: 'tategami-rehabilitation', position: '院長', expectedLevel: 13 },
  { facilityId: 'espoir-tategami', position: '施設長', expectedLevel: 13 }
];

for (const test of directorTests) {
  testResult.total++;
  const level = facilityPositionMappingService.getPositionLevel(test.facilityId, test.position);

  if (level === test.expectedLevel) {
    console.log(`✅ ${test.facilityId} ${test.position}: Level ${level}`);
    testResult.passed++;
    testResult.details.push({
      test: `${test.facilityId} ${test.position}`,
      result: 'PASS',
      expected: test.expectedLevel,
      actual: level
    });
  } else {
    console.log(`❌ ${test.facilityId} ${test.position}: Level ${level} (期待値: ${test.expectedLevel})`);
    testResult.failed++;
    testResult.details.push({
      test: `${test.facilityId} ${test.position}`,
      result: 'FAIL',
      expected: test.expectedLevel,
      actual: level
    });
  }
}

// 1.2 主任職統一レベル確認
console.log('\n【1.2 主任職統一レベル確認】');
console.log('─'.repeat(50));

const chiefTests: TestCase[] = [
  // 小原病院
  { facilityId: 'obara-hospital', position: '主任', expectedLevel: 5 },
  { facilityId: 'obara-hospital', position: '主任看護師', expectedLevel: 5 },

  // 立神リハビリ
  { facilityId: 'tategami-rehabilitation', position: '主任', expectedLevel: 5 },
  { facilityId: 'tategami-rehabilitation', position: '介護主任', expectedLevel: 5 },
  { facilityId: 'tategami-rehabilitation', position: 'リハビリテーション部門主任', expectedLevel: 5 },

  // エスポワール立神
  { facilityId: 'espoir-tategami', position: '事務主任', expectedLevel: 5 },
  { facilityId: 'espoir-tategami', position: '看護主任', expectedLevel: 5 },
  { facilityId: 'espoir-tategami', position: '介護部Aフロア主任', expectedLevel: 5 },
  { facilityId: 'espoir-tategami', position: '介護部Bフロア主任', expectedLevel: 5 },
  { facilityId: 'espoir-tategami', position: '介護部Cフロア主任', expectedLevel: 5 },
  { facilityId: 'espoir-tategami', position: '介護部Aフロアマネージャー', expectedLevel: 5 },
  { facilityId: 'espoir-tategami', position: '介護部Bフロアマネージャー', expectedLevel: 5 },
  { facilityId: 'espoir-tategami', position: 'ケアプラン管理部リーダー', expectedLevel: 5 },
  { facilityId: 'espoir-tategami', position: '栄養管理部主任', expectedLevel: 5 },
  { facilityId: 'espoir-tategami', position: 'リハビリテーション部主任', expectedLevel: 5 }
];

for (const test of chiefTests) {
  testResult.total++;
  const level = facilityPositionMappingService.getPositionLevel(test.facilityId, test.position);

  if (level === test.expectedLevel) {
    console.log(`✅ [${test.facilityId}] ${test.position}: Level ${level}`);
    testResult.passed++;
    testResult.details.push({
      test: `${test.facilityId} ${test.position}`,
      result: 'PASS',
      expected: test.expectedLevel,
      actual: level
    });
  } else {
    console.log(`❌ [${test.facilityId}] ${test.position}: Level ${level} (期待値: ${test.expectedLevel})`);
    testResult.failed++;
    testResult.details.push({
      test: `${test.facilityId} ${test.position}`,
      result: 'FAIL',
      expected: test.expectedLevel,
      actual: level
    });
  }
}

// 1.3 兼任職員権限確認
console.log('\n【1.3 兼任職員権限確認】');
console.log('─'.repeat(50));

// 平篤のケース
console.log('ESP_003: 平篤（入所課課長 兼 支援相談室長）');
const hiraLevel1 = facilityPositionMappingService.getPositionLevel('espoir-tategami', '入所課課長');
const hiraLevel2 = facilityPositionMappingService.getPositionLevel('espoir-tategami', '支援相談室長');
console.log(`  入所課課長: Level ${hiraLevel1}`);
console.log(`  支援相談室長: Level ${hiraLevel2}`);
console.log(`  → 適用レベル: ${Math.max(hiraLevel1 || 0, hiraLevel2 || 0)} (高い方を採用)`);

testResult.total++;
if (hiraLevel1 === 11 && hiraLevel2 === 10) {
  console.log('✅ 兼任職権限: 正常');
  testResult.passed++;
  testResult.details.push({
    test: '平篤 兼任職権限',
    result: 'PASS'
  });
} else {
  console.log('❌ 兼任職権限: 異常');
  testResult.failed++;
  testResult.details.push({
    test: '平篤 兼任職権限',
    result: 'FAIL'
  });
}

// 阿久根一信のケース
console.log('\nESP_004: 阿久根一信（在宅課課長 兼 居宅介護支援事業所管理者）');
const akuneLevel1 = facilityPositionMappingService.getPositionLevel('espoir-tategami', '在宅課課長');
const akuneLevel2 = facilityPositionMappingService.getPositionLevel('espoir-tategami', '居宅介護支援事業所管理者');
console.log(`  在宅課課長: Level ${akuneLevel1}`);
console.log(`  居宅介護支援事業所管理者: Level ${akuneLevel2}`);
console.log(`  → 適用レベル: ${Math.max(akuneLevel1 || 0, akuneLevel2 || 0)} (高い方を採用)`);

testResult.total++;
if (akuneLevel1 === 11 && akuneLevel2 === 10) {
  console.log('✅ 兼任職権限: 正常');
  testResult.passed++;
  testResult.details.push({
    test: '阿久根一信 兼任職権限',
    result: 'PASS'
  });
} else {
  console.log('❌ 兼任職権限: 異常');
  testResult.failed++;
  testResult.details.push({
    test: '阿久根一信 兼任職権限',
    result: 'FAIL'
  });
}

// 特別確認: 統括主任レベル7
console.log('\n【特別確認: 立神リハビリ統括主任レベル】');
console.log('─'.repeat(50));

testResult.total++;
const toukatsuLevel = facilityPositionMappingService.getPositionLevel('tategami-rehabilitation', '統括主任');
if (toukatsuLevel === 7) {
  console.log(`✅ 統括主任レベル: ${toukatsuLevel} (Phase 3調整完了)`);
  testResult.passed++;
  testResult.details.push({
    test: '統括主任レベル7確認',
    result: 'PASS',
    expected: 7,
    actual: toukatsuLevel
  });
} else {
  console.log(`❌ 統括主任レベル: ${toukatsuLevel} (期待値: 7)`);
  console.log('   ⚠️ Phase 3の調整が反映されていない可能性があります');
  testResult.failed++;
  testResult.details.push({
    test: '統括主任レベル7確認',
    result: 'FAIL',
    expected: 7,
    actual: toukatsuLevel
  });
}

// サマリー表示
console.log('\n\n═════════════════════════════════════════════════════════════');
console.log('  Day 1 基本機能テスト結果サマリー');
console.log('═════════════════════════════════════════════════════════════');
console.log(`  総テスト数: ${testResult.total}`);
console.log(`  成功: ${testResult.passed} (${Math.round(testResult.passed/testResult.total*100)}%)`);
console.log(`  失敗: ${testResult.failed} (${Math.round(testResult.failed/testResult.total*100)}%)`);
console.log('─'.repeat(60));

if (testResult.failed === 0) {
  console.log('\n🎉 Day 1: 基本機能テスト 全項目合格！');
  console.log('次のステップ: API動作確認テストへ進む');
} else {
  console.log('\n⚠️ Day 1: 一部のテストが失敗しました');
  console.log('失敗したテスト:');
  testResult.details
    .filter(d => d.result === 'FAIL')
    .forEach(d => console.log(`  - ${d.test}`));
}

// テスト結果をファイルに保存
import * as fs from 'fs';
import * as path from 'path';

const resultPath = path.join(__dirname, 'test-results-day1.json');
fs.writeFileSync(resultPath, JSON.stringify(testResult, null, 2));
console.log(`\n📝 テスト結果を保存: ${resultPath}`);

// Exit code設定
process.exit(testResult.failed > 0 ? 1 : 0);