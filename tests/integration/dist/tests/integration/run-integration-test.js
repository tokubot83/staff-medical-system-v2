"use strict";
/**
 * 3施設統合テスト実行スクリプト
 * TypeScript版
 * 作成日: 2025年10月1日
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var facility_position_mapping_1 = require("../../src/lib/facility-position-mapping");
// テスト開始
console.log('\n═════════════════════════════════════════════════════════════');
console.log('  Day 1: 基本機能テスト - レベル設定確認');
console.log('  実施日時: ' + new Date().toLocaleString('ja-JP'));
console.log('═════════════════════════════════════════════════════════════\n');
var testResult = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
};
// 1.1 施設長レベル確認
console.log('【1.1 施設長レベル確認】');
console.log('─'.repeat(50));
var directorTests = [
    { facilityId: 'obara-hospital', position: '院長', expectedLevel: 13 },
    { facilityId: 'tategami-rehabilitation', position: '院長', expectedLevel: 13 },
    { facilityId: 'espoir-tategami', position: '施設長', expectedLevel: 13 }
];
for (var _i = 0, directorTests_1 = directorTests; _i < directorTests_1.length; _i++) {
    var test_1 = directorTests_1[_i];
    testResult.total++;
    var level = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel(test_1.facilityId, test_1.position);
    if (level === test_1.expectedLevel) {
        console.log("\u2705 ".concat(test_1.facilityId, " ").concat(test_1.position, ": Level ").concat(level));
        testResult.passed++;
        testResult.details.push({
            test: "".concat(test_1.facilityId, " ").concat(test_1.position),
            result: 'PASS',
            expected: test_1.expectedLevel,
            actual: level
        });
    }
    else {
        console.log("\u274C ".concat(test_1.facilityId, " ").concat(test_1.position, ": Level ").concat(level, " (\u671F\u5F85\u5024: ").concat(test_1.expectedLevel, ")"));
        testResult.failed++;
        testResult.details.push({
            test: "".concat(test_1.facilityId, " ").concat(test_1.position),
            result: 'FAIL',
            expected: test_1.expectedLevel,
            actual: level
        });
    }
}
// 1.2 主任職統一レベル確認
console.log('\n【1.2 主任職統一レベル確認】');
console.log('─'.repeat(50));
var chiefTests = [
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
for (var _a = 0, chiefTests_1 = chiefTests; _a < chiefTests_1.length; _a++) {
    var test_2 = chiefTests_1[_a];
    testResult.total++;
    var level = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel(test_2.facilityId, test_2.position);
    if (level === test_2.expectedLevel) {
        console.log("\u2705 [".concat(test_2.facilityId, "] ").concat(test_2.position, ": Level ").concat(level));
        testResult.passed++;
        testResult.details.push({
            test: "".concat(test_2.facilityId, " ").concat(test_2.position),
            result: 'PASS',
            expected: test_2.expectedLevel,
            actual: level
        });
    }
    else {
        console.log("\u274C [".concat(test_2.facilityId, "] ").concat(test_2.position, ": Level ").concat(level, " (\u671F\u5F85\u5024: ").concat(test_2.expectedLevel, ")"));
        testResult.failed++;
        testResult.details.push({
            test: "".concat(test_2.facilityId, " ").concat(test_2.position),
            result: 'FAIL',
            expected: test_2.expectedLevel,
            actual: level
        });
    }
}
// 1.3 兼任職員権限確認
console.log('\n【1.3 兼任職員権限確認】');
console.log('─'.repeat(50));
// 平篤のケース
console.log('ESP_003: 平篤（入所課課長 兼 支援相談室長）');
var hiraLevel1 = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('espoir-tategami', '入所課課長');
var hiraLevel2 = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('espoir-tategami', '支援相談室長');
console.log("  \u5165\u6240\u8AB2\u8AB2\u9577: Level ".concat(hiraLevel1));
console.log("  \u652F\u63F4\u76F8\u8AC7\u5BA4\u9577: Level ".concat(hiraLevel2));
console.log("  \u2192 \u9069\u7528\u30EC\u30D9\u30EB: ".concat(Math.max(hiraLevel1 || 0, hiraLevel2 || 0), " (\u9AD8\u3044\u65B9\u3092\u63A1\u7528)"));
testResult.total++;
if (hiraLevel1 === 11 && hiraLevel2 === 10) {
    console.log('✅ 兼任職権限: 正常');
    testResult.passed++;
    testResult.details.push({
        test: '平篤 兼任職権限',
        result: 'PASS'
    });
}
else {
    console.log('❌ 兼任職権限: 異常');
    testResult.failed++;
    testResult.details.push({
        test: '平篤 兼任職権限',
        result: 'FAIL'
    });
}
// 阿久根一信のケース
console.log('\nESP_004: 阿久根一信（在宅課課長 兼 居宅介護支援事業所管理者）');
var akuneLevel1 = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('espoir-tategami', '在宅課課長');
var akuneLevel2 = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('espoir-tategami', '居宅介護支援事業所管理者');
console.log("  \u5728\u5B85\u8AB2\u8AB2\u9577: Level ".concat(akuneLevel1));
console.log("  \u5C45\u5B85\u4ECB\u8B77\u652F\u63F4\u4E8B\u696D\u6240\u7BA1\u7406\u8005: Level ".concat(akuneLevel2));
console.log("  \u2192 \u9069\u7528\u30EC\u30D9\u30EB: ".concat(Math.max(akuneLevel1 || 0, akuneLevel2 || 0), " (\u9AD8\u3044\u65B9\u3092\u63A1\u7528)"));
testResult.total++;
if (akuneLevel1 === 11 && akuneLevel2 === 10) {
    console.log('✅ 兼任職権限: 正常');
    testResult.passed++;
    testResult.details.push({
        test: '阿久根一信 兼任職権限',
        result: 'PASS'
    });
}
else {
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
var toukatsuLevel = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('tategami-rehabilitation', '統括主任');
if (toukatsuLevel === 7) {
    console.log("\u2705 \u7D71\u62EC\u4E3B\u4EFB\u30EC\u30D9\u30EB: ".concat(toukatsuLevel, " (Phase 3\u8ABF\u6574\u5B8C\u4E86)"));
    testResult.passed++;
    testResult.details.push({
        test: '統括主任レベル7確認',
        result: 'PASS',
        expected: 7,
        actual: toukatsuLevel
    });
}
else {
    console.log("\u274C \u7D71\u62EC\u4E3B\u4EFB\u30EC\u30D9\u30EB: ".concat(toukatsuLevel, " (\u671F\u5F85\u5024: 7)"));
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
console.log("  \u7DCF\u30C6\u30B9\u30C8\u6570: ".concat(testResult.total));
console.log("  \u6210\u529F: ".concat(testResult.passed, " (").concat(Math.round(testResult.passed / testResult.total * 100), "%)"));
console.log("  \u5931\u6557: ".concat(testResult.failed, " (").concat(Math.round(testResult.failed / testResult.total * 100), "%)"));
console.log('─'.repeat(60));
if (testResult.failed === 0) {
    console.log('\n🎉 Day 1: 基本機能テスト 全項目合格！');
    console.log('次のステップ: API動作確認テストへ進む');
}
else {
    console.log('\n⚠️ Day 1: 一部のテストが失敗しました');
    console.log('失敗したテスト:');
    testResult.details
        .filter(function (d) { return d.result === 'FAIL'; })
        .forEach(function (d) { return console.log("  - ".concat(d.test)); });
}
// テスト結果をファイルに保存
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var resultPath = path.join(__dirname, 'test-results-day1.json');
fs.writeFileSync(resultPath, JSON.stringify(testResult, null, 2));
console.log("\n\uD83D\uDCDD \u30C6\u30B9\u30C8\u7D50\u679C\u3092\u4FDD\u5B58: ".concat(resultPath));
// Exit code設定
process.exit(testResult.failed > 0 ? 1 : 0);
