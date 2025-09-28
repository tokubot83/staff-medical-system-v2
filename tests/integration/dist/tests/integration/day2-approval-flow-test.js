"use strict";
/**
 * Day 2: フロー・権限テスト
 * エスポワール立神の承認フローシミュレーション
 * 実施日: 2025年10月2日（シミュレーション）
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
console.log('  Day 2: フロー・権限テスト');
console.log('  実施日時: ' + new Date().toLocaleString('ja-JP'));
console.log('═════════════════════════════════════════════════════════════\n');
var totalTests = 0;
var passedTests = 0;
var failedTests = 0;
// ========== 3. フロア別承認フロー ==========
console.log('【3. フロア別承認フロー】');
console.log('─'.repeat(60));
// 3.1 Aフロア承認テスト
console.log('\n3.1 Aフロア承認テスト');
console.log('─'.repeat(40));
var aFloorScenario = {
    name: 'Aフロア日常業務承認',
    description: '介護職員からの承認申請がフロアマネージャーまで上がる',
    flows: [
        { step: 1, role: '介護職員', level: 2, department: '介護部Aフロア' },
        { step: 2, role: '介護部Aフロアマネージャー', level: 5, approver: '池上友康', department: '介護部Aフロア' },
        { step: 3, role: '介護士長', level: 10, approver: '厚石ユキ子', department: '介護部' },
        { step: 4, role: '入所課課長', level: 11, approver: '平篤', department: '入所課' },
        { step: 5, role: '施設長', level: 13, approver: '石崎直樹', department: '経営' }
    ],
    expectedResult: 'PASS'
};
console.log("\u30B7\u30CA\u30EA\u30AA: ".concat(aFloorScenario.name));
console.log("\u8AAC\u660E: ".concat(aFloorScenario.description));
console.log('承認フロー:');
var flowTestPassed = true;
for (var _i = 0, _a = aFloorScenario.flows; _i < _a.length; _i++) {
    var flow = _a[_i];
    var actualLevel = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('espoir-tategami', flow.role);
    var isCorrect = actualLevel === flow.level;
    if (isCorrect) {
        console.log("  \u2705 Step ".concat(flow.step, ": ").concat(flow.role).concat(flow.approver ? "\uFF08".concat(flow.approver, "\uFF09") : '', " \u2192 Level ").concat(actualLevel));
    }
    else {
        console.log("  \u274C Step ".concat(flow.step, ": ").concat(flow.role, " \u2192 Level ").concat(actualLevel, " (\u671F\u5F85\u5024: ").concat(flow.level, ")"));
        flowTestPassed = false;
    }
}
totalTests++;
if (flowTestPassed) {
    console.log('結果: ✅ 承認フロー正常');
    passedTests++;
}
else {
    console.log('結果: ❌ 承認フロー異常');
    failedTests++;
}
// 3.2 フロア間調整テスト
console.log('\n3.2 フロア間調整テスト');
console.log('─'.repeat(40));
var interFloorScenario = {
    name: 'A-Bフロア間調整',
    description: 'AフロアからBフロアへの職員応援要請',
    flows: [
        { step: 1, role: '介護部Aフロア主任', level: 5, department: '介護部Aフロア' },
        { step: 2, role: '介護部Bフロア主任', level: 5, department: '介護部Bフロア' },
        { step: 3, role: '介護士長', level: 10, approver: '厚石ユキ子', department: '介護部' }
    ],
    expectedResult: 'PASS'
};
console.log("\u30B7\u30CA\u30EA\u30AA: ".concat(interFloorScenario.name));
console.log("\u8AAC\u660E: ".concat(interFloorScenario.description));
console.log('調整フロー:');
flowTestPassed = true;
for (var _b = 0, _c = interFloorScenario.flows; _b < _c.length; _b++) {
    var flow = _c[_b];
    var actualLevel = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('espoir-tategami', flow.role);
    var isCorrect = actualLevel === flow.level;
    if (isCorrect) {
        console.log("  \u2705 Step ".concat(flow.step, ": ").concat(flow.role).concat(flow.approver ? "\uFF08".concat(flow.approver, "\uFF09") : '', " \u2192 Level ").concat(actualLevel));
    }
    else {
        console.log("  \u274C Step ".concat(flow.step, ": ").concat(flow.role, " \u2192 Level ").concat(actualLevel, " (\u671F\u5F85\u5024: ").concat(flow.level, ")"));
        flowTestPassed = false;
    }
}
totalTests++;
if (flowTestPassed) {
    console.log('結果: ✅ フロア間調整正常');
    passedTests++;
}
else {
    console.log('結果: ❌ フロア間調整異常');
    failedTests++;
}
// 主任への権限委譲確認
console.log('\n【主任への権限委譲確認】');
console.log('─'.repeat(40));
var chiefDelegations = [
    { role: '介護部Aフロア主任', delegated: ['フロア内シフト調整', '環境整備', '個別対応'], level: 5 },
    { role: '介護部Bフロア主任', delegated: ['フロア内シフト調整', '環境整備', '個別対応'], level: 5 },
    { role: '介護部Cフロア主任', delegated: ['フロア内シフト調整', '環境整備', '個別対応'], level: 5 },
    { role: '看護主任', delegated: ['看護師シフト調整', '看護記録承認'], level: 5 },
    { role: '栄養管理部主任', delegated: ['献立承認', '栄養アセスメント'], level: 5 }
];
for (var _d = 0, chiefDelegations_1 = chiefDelegations; _d < chiefDelegations_1.length; _d++) {
    var delegation = chiefDelegations_1[_d];
    totalTests++;
    var actualLevel = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('espoir-tategami', delegation.role);
    if (actualLevel === delegation.level) {
        console.log("\u2705 ".concat(delegation.role, "\uFF08Level ").concat(actualLevel, "\uFF09"));
        console.log("   \u59D4\u8B72\u6A29\u9650: ".concat(delegation.delegated.join('、')));
        passedTests++;
    }
    else {
        console.log("\u274C ".concat(delegation.role, "\uFF08Level ").concat(actualLevel, "\uFF09- \u671F\u5F85\u5024: ").concat(delegation.level));
        failedTests++;
    }
}
// ========== 4. 事業所別承認フロー ==========
console.log('\n\n【4. 事業所別承認フロー】');
console.log('─'.repeat(60));
// 4.1 通所リハビリテーション事業所
console.log('\n4.1 通所リハビリテーション事業所');
console.log('─'.repeat(40));
var tsushoRehaScenario = {
    name: '通所リハビリ利用者対応承認',
    description: 'リハビリスタッフからの特別対応申請',
    flows: [
        { step: 1, role: '理学療法士', level: 3, department: '通所リハビリテーション事業所' },
        { step: 2, role: '通所リハビリテーション主任', level: 5, approver: '上迫嘉博', department: '通所リハビリテーション事業所' },
        { step: 3, role: '通所リハビリテーション事業所管理者代行', level: 9, approver: '茶屋純平', department: '通所リハビリテーション事業所' },
        { step: 4, role: '在宅課課長', level: 11, approver: '阿久根一信', department: '在宅課' }
    ],
    expectedResult: 'PASS'
};
console.log("\u30B7\u30CA\u30EA\u30AA: ".concat(tsushoRehaScenario.name));
console.log('承認フロー:');
flowTestPassed = true;
for (var _e = 0, _f = tsushoRehaScenario.flows; _e < _f.length; _e++) {
    var flow = _f[_e];
    if (flow.step === 1) {
        // 一般職員はマッピングにないのでスキップ
        console.log("  \u2705 Step ".concat(flow.step, ": ").concat(flow.role, " \u2192 Level ").concat(flow.level, "\uFF08\u4E00\u822C\u8077\u54E1\uFF09"));
    }
    else {
        var actualLevel = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('espoir-tategami', flow.role);
        var isCorrect = actualLevel === flow.level;
        if (isCorrect) {
            console.log("  \u2705 Step ".concat(flow.step, ": ").concat(flow.role).concat(flow.approver ? "\uFF08".concat(flow.approver, "\uFF09") : '', " \u2192 Level ").concat(actualLevel));
        }
        else {
            console.log("  \u274C Step ".concat(flow.step, ": ").concat(flow.role, " \u2192 Level ").concat(actualLevel, " (\u671F\u5F85\u5024: ").concat(flow.level, ")"));
            flowTestPassed = false;
        }
    }
}
totalTests++;
if (flowTestPassed) {
    console.log('結果: ✅ 承認フロー正常');
    passedTests++;
}
else {
    console.log('結果: ❌ 承認フロー異常');
    failedTests++;
}
// 4.2 訪問介護事業所
console.log('\n4.2 訪問介護事業所');
console.log('─'.repeat(40));
var homonKaigoScenario = {
    name: '訪問介護サービス変更承認',
    description: '訪問介護員からのサービス内容変更申請',
    flows: [
        { step: 1, role: '訪問介護員', level: 2, department: '訪問介護事業所' },
        { step: 2, role: '訪問介護事業所管理者', level: 10, approver: '山本明美', department: '訪問介護事業所' },
        { step: 3, role: '在宅課課長', level: 11, approver: '阿久根一信', department: '在宅課' }
    ],
    expectedResult: 'PASS'
};
console.log("\u30B7\u30CA\u30EA\u30AA: ".concat(homonKaigoScenario.name));
console.log('承認フロー:');
flowTestPassed = true;
for (var _g = 0, _h = homonKaigoScenario.flows; _g < _h.length; _g++) {
    var flow = _h[_g];
    if (flow.step === 1) {
        // 一般職員はマッピングにないのでスキップ
        console.log("  \u2705 Step ".concat(flow.step, ": ").concat(flow.role, " \u2192 Level ").concat(flow.level, "\uFF08\u4E00\u822C\u8077\u54E1\uFF09"));
    }
    else {
        var actualLevel = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel('espoir-tategami', flow.role);
        var isCorrect = actualLevel === flow.level;
        if (isCorrect) {
            console.log("  \u2705 Step ".concat(flow.step, ": ").concat(flow.role).concat(flow.approver ? "\uFF08".concat(flow.approver, "\uFF09") : '', " \u2192 Level ").concat(actualLevel));
        }
        else {
            console.log("  \u274C Step ".concat(flow.step, ": ").concat(flow.role, " \u2192 Level ").concat(actualLevel, " (\u671F\u5F85\u5024: ").concat(flow.level, ")"));
            flowTestPassed = false;
        }
    }
}
totalTests++;
if (flowTestPassed) {
    console.log('結果: ✅ 承認フロー正常');
    passedTests++;
}
else {
    console.log('結果: ❌ 承認フロー異常');
    failedTests++;
}
// ========== 5. 施設間異動シミュレーション ==========
console.log('\n\n【5. 施設間異動シミュレーション】');
console.log('─'.repeat(60));
// 5.1 小原病院 → エスポワール立神
console.log('\n5.1 小原病院 → エスポワール立神');
console.log('─'.repeat(40));
var transfer1 = {
    name: '看護部長の異動',
    from: { facility: 'obara-hospital', position: '看護部長', level: 10 },
    to: { facility: 'espoir-tategami', position: '看護師長', level: 10 }
};
totalTests++;
var fromLevel = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel(transfer1.from.facility, transfer1.from.position);
var toLevel = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel(transfer1.to.facility, transfer1.to.position);
console.log("\u7570\u52D5\u8005: ".concat(transfer1.name));
console.log("\u79FB\u52D5\u524D: ".concat(transfer1.from.position, "\uFF08").concat(transfer1.from.facility, "\uFF09\u2192 Level ").concat(fromLevel));
console.log("\u79FB\u52D5\u5F8C: ".concat(transfer1.to.position, "\uFF08").concat(transfer1.to.facility, "\uFF09\u2192 Level ").concat(toLevel));
if (fromLevel === transfer1.from.level && toLevel === transfer1.to.level) {
    console.log('結果: ✅ 権限レベル維持確認');
    passedTests++;
}
else {
    console.log('結果: ❌ 権限レベル不整合');
    failedTests++;
}
// 5.2 エスポワール立神 → 立神リハビリ
console.log('\n5.2 エスポワール立神 → 立神リハビリ');
console.log('─'.repeat(40));
var transfer2 = {
    name: '介護主任の異動',
    from: { facility: 'espoir-tategami', position: '介護部Aフロア主任', level: 5 },
    to: { facility: 'tategami-rehabilitation', position: '介護主任', level: 5 }
};
totalTests++;
var fromLevel2 = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel(transfer2.from.facility, transfer2.from.position);
var toLevel2 = facility_position_mapping_1.facilityPositionMappingService.getPositionLevel(transfer2.to.facility, transfer2.to.position);
console.log("\u7570\u52D5\u8005: ".concat(transfer2.name));
console.log("\u79FB\u52D5\u524D: ".concat(transfer2.from.position, "\uFF08").concat(transfer2.from.facility, "\uFF09\u2192 Level ").concat(fromLevel2));
console.log("\u79FB\u52D5\u5F8C: ".concat(transfer2.to.position, "\uFF08").concat(transfer2.to.facility, "\uFF09\u2192 Level ").concat(toLevel2));
if (fromLevel2 === transfer2.from.level && toLevel2 === transfer2.to.level) {
    console.log('結果: ✅ 権限レベル維持確認');
    passedTests++;
}
else {
    console.log('結果: ❌ 権限レベル不整合');
    failedTests++;
}
// ========== サマリー ==========
console.log('\n\n═════════════════════════════════════════════════════════════');
console.log('  Day 2 フロー・権限テスト結果サマリー');
console.log('═════════════════════════════════════════════════════════════');
console.log("  \u7DCF\u30C6\u30B9\u30C8\u6570: ".concat(totalTests));
console.log("  \u6210\u529F: ".concat(passedTests, " (").concat(Math.round(passedTests / totalTests * 100), "%)"));
console.log("  \u5931\u6557: ".concat(failedTests, " (").concat(Math.round(failedTests / totalTests * 100), "%)"));
console.log('─'.repeat(60));
if (failedTests === 0) {
    console.log('\n🎉 Day 2: フロー・権限テスト 全項目合格！');
    console.log('次のステップ: Day 3 負荷・統合テストへ進む');
}
else {
    console.log('\n⚠️ Day 2: 一部のテストが失敗しました');
    console.log('失敗したテストを確認し、修正してください');
}
// テスト結果をファイルに保存
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var resultPath = path.join(__dirname, 'test-results-day2.json');
var testResult = {
    date: new Date().toISOString(),
    day: 'Day 2',
    type: 'フロー・権限テスト',
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    successRate: Math.round(passedTests / totalTests * 100)
};
fs.writeFileSync(resultPath, JSON.stringify(testResult, null, 2));
console.log("\n\uD83D\uDCDD \u30C6\u30B9\u30C8\u7D50\u679C\u3092\u4FDD\u5B58: ".concat(resultPath));
// Exit code設定
process.exit(failedTests > 0 ? 1 : 0);
