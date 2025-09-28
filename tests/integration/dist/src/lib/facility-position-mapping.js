"use strict";
/**
 * 施設別役職マッピング管理
 * VoiceDrive連携用
 * 作成日: 2025年9月26日
 * 更新日: 2025年9月28日 - エスポワール立神を追加
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facilityPositionMappingService = exports.FacilityPositionMappingService = exports.FACILITY_TYPE_MAP = exports.FACILITY_ID_MAP = void 0;
// 小原病院の役職マッピング
var obaraHospitalMapping = [
    // 経営層
    { positionName: '院長', baseLevel: 13, managementScope: 420 },
    { positionName: '副院長', baseLevel: 12, managementScope: 420 },
    { positionName: '事務長', baseLevel: 11, managementScope: 50 },
    // 看護部門
    { positionName: '看護部長', baseLevel: 10, departmentScope: '看護部', managementScope: 180 },
    { positionName: '教育師長', baseLevel: 8, departmentScope: '看護部', managementScope: 30 },
    { positionName: '病棟師長', baseLevel: 7, departmentScope: '病棟', managementScope: 30 },
    { positionName: '外来師長', baseLevel: 7, departmentScope: '外来', managementScope: 25 },
    { positionName: '副師長', baseLevel: 6, departmentScope: '病棟', managementScope: 15 },
    { positionName: '主任看護師', baseLevel: 5, departmentScope: '病棟', managementScope: 10 },
    // 医局
    { positionName: '医局長', baseLevel: 10, departmentScope: '医局', managementScope: 45 },
    { positionName: '脳神経外科部長', baseLevel: 9, departmentScope: '脳神経外科', managementScope: 8 },
    { positionName: '外科部長', baseLevel: 9, departmentScope: '外科', managementScope: 6 },
    { positionName: '循環器内科部長', baseLevel: 9, departmentScope: '循環器内科', managementScope: 7 },
    { positionName: '消化器内科部長', baseLevel: 9, departmentScope: '消化器内科', managementScope: 6 },
    // 診療技術部
    { positionName: '診療技術部長', baseLevel: 10, departmentScope: '診療技術部', managementScope: 65 },
    { positionName: '診療放射線科長', baseLevel: 8, departmentScope: '放射線科', managementScope: 12 },
    { positionName: '臨床検査科長', baseLevel: 8, departmentScope: '検査科', managementScope: 15 },
    { positionName: '薬剤部長', baseLevel: 10, departmentScope: '薬剤部', managementScope: 15 },
    { positionName: '栄養科長', baseLevel: 8, departmentScope: '栄養科', managementScope: 8 },
    { positionName: 'リハビリテーション科長', baseLevel: 8, departmentScope: 'リハビリ科', managementScope: 40 },
    // 事務部門
    { positionName: '総務課長', baseLevel: 7, departmentScope: '総務課', managementScope: 20 },
    { positionName: '医事課長', baseLevel: 7, departmentScope: '医事課', managementScope: 15 },
    { positionName: '主任', baseLevel: 5, managementScope: 5 }
];
// 立神リハビリテーション温泉病院の役職マッピング
var tategamiRehabilitationMapping = [
    // 経営層
    { positionName: '院長', baseLevel: 13, managementScope: 180 },
    // 看護部門
    { positionName: '総師長', baseLevel: 10, departmentScope: '看護部', managementScope: 100 },
    { positionName: '副総師長', baseLevel: 9, departmentScope: '看護部', managementScope: 100 },
    { positionName: '第１病棟師長', baseLevel: 7, departmentScope: '第１病棟', managementScope: 25 },
    { positionName: '外来師長', baseLevel: 7, departmentScope: '外来', managementScope: 15 },
    { positionName: '介護医療院師長', baseLevel: 7, departmentScope: '介護医療院', managementScope: 35 },
    { positionName: '師長', baseLevel: 7, managementScope: 20 },
    { positionName: '病棟師長', baseLevel: 7, managementScope: 20 },
    { positionName: '主任', baseLevel: 5, managementScope: 8 },
    { positionName: '介護主任', baseLevel: 5, departmentScope: '介護', managementScope: 10 },
    // 診療技術部
    { positionName: '統括主任', baseLevel: 7, managementScope: 30, facilitySpecificAdjustment: 0 }, // Phase 3で7に調整済み
    { positionName: 'リハビリテーション部門主任', baseLevel: 5, departmentScope: 'リハビリ', managementScope: 35 },
    { positionName: '放射線部門主任', baseLevel: 5, departmentScope: '放射線', managementScope: 3 },
    { positionName: '検査部門主任', baseLevel: 5, departmentScope: '検査', managementScope: 4 },
    { positionName: '栄養部門主任', baseLevel: 5, departmentScope: '栄養', managementScope: 5 },
    // 事務部門
    { positionName: '事務長', baseLevel: 11, managementScope: 20 },
    { positionName: '薬局長', baseLevel: 8, departmentScope: '薬局', managementScope: 5 },
    { positionName: '総務課主任', baseLevel: 5, departmentScope: '総務課', managementScope: 8 },
    { positionName: '医事課主任', baseLevel: 5, departmentScope: '医事課', managementScope: 6 }
];
// エスポワール立神の役職マッピング
var espoirTategamiMapping = [
    // 経営層
    { positionName: '施設長', baseLevel: 13, managementScope: 150 },
    // 上級管理職
    { positionName: '事務長', baseLevel: 11, departmentScope: '事務部', managementScope: 30 },
    { positionName: '入所課課長', baseLevel: 11, departmentScope: '入所課', managementScope: 70 },
    { positionName: '在宅課課長', baseLevel: 11, departmentScope: '在宅課', managementScope: 50 },
    // 中級管理職（入所課管轄）
    { positionName: '支援相談室長', baseLevel: 10, departmentScope: '支援相談部', managementScope: 8 },
    { positionName: '看護師長', baseLevel: 10, departmentScope: '看護部', managementScope: 20 },
    { positionName: '介護士長', baseLevel: 10, departmentScope: '介護部', managementScope: 40 },
    // 中級管理職（在宅課管轄）
    { positionName: '通所リハビリテーション事業所管理者', baseLevel: 10, departmentScope: '通所リハビリテーション事業所', managementScope: 15 },
    { positionName: '訪問介護事業所管理者', baseLevel: 10, departmentScope: '訪問介護事業所', managementScope: 8 },
    { positionName: '居宅介護支援事業所管理者', baseLevel: 10, departmentScope: '居宅介護支援事業所', managementScope: 10 },
    // 管理職層
    { positionName: '通所リハビリテーション事業所管理者代行', baseLevel: 9, departmentScope: '通所リハビリテーション事業所', managementScope: 15 },
    { positionName: '訪問リハビリテーション事業所管理者代行', baseLevel: 9, departmentScope: '訪問リハビリテーション事業所', managementScope: 6 },
    { positionName: '居宅介護支援事業所次長', baseLevel: 9, departmentScope: '居宅介護支援事業所', managementScope: 10 },
    // 主任層（事務部）
    { positionName: '事務主任', baseLevel: 5, departmentScope: '事務部', managementScope: 5 },
    // 主任層（入所課管轄）
    { positionName: '看護主任', baseLevel: 5, departmentScope: '看護部', managementScope: 8 },
    { positionName: '介護部Aフロア主任', baseLevel: 5, departmentScope: '介護部Aフロア', managementScope: 12 },
    { positionName: '介護部Bフロア主任', baseLevel: 5, departmentScope: '介護部Bフロア', managementScope: 12 },
    { positionName: '介護部Cフロア主任', baseLevel: 5, departmentScope: '介護部Cフロア', managementScope: 12 },
    { positionName: '介護部Aフロアマネージャー', baseLevel: 5, departmentScope: '介護部Aフロア', managementScope: 12 },
    { positionName: '介護部Bフロアマネージャー', baseLevel: 5, departmentScope: '介護部Bフロア', managementScope: 12 },
    { positionName: '介護部Cフロアマネージャー', baseLevel: 5, departmentScope: '介護部Cフロア', managementScope: 12 },
    { positionName: 'ケアプラン管理部リーダー', baseLevel: 5, departmentScope: 'ケアプラン管理部', managementScope: 6 },
    { positionName: '栄養管理部主任', baseLevel: 5, departmentScope: '栄養管理部', managementScope: 4 },
    { positionName: 'リハビリテーション部主任', baseLevel: 5, departmentScope: 'リハビリテーション部', managementScope: 8 },
    // 主任層（在宅課管轄）
    { positionName: '通所リハビリテーション主任', baseLevel: 5, departmentScope: '通所リハビリテーション事業所', managementScope: 8 },
    { positionName: '居宅介護支援事業所主任', baseLevel: 5, departmentScope: '居宅介護支援事業所', managementScope: 5 }
];
// 施設IDと施設名のマッピング
exports.FACILITY_ID_MAP = {
    'obara-hospital': '医療法人 厚生会 小原病院',
    'tategami-rehabilitation': '立神リハビリテーション温泉病院',
    'espoir-tategami': '介護老人保健施設エスポワール立神'
};
// 施設タイプのマッピング
exports.FACILITY_TYPE_MAP = {
    'obara-hospital': 'acute',
    'tategami-rehabilitation': 'rehabilitation',
    'espoir-tategami': 'geriatric_health_facility'
};
var FacilityPositionMappingService = /** @class */ (function () {
    function FacilityPositionMappingService() {
        this.mappings = new Map();
        this.initializeMappings();
    }
    /**
     * マッピングデータの初期化
     */
    FacilityPositionMappingService.prototype.initializeMappings = function () {
        // 小原病院
        this.mappings.set('obara-hospital', {
            facilityId: 'obara-hospital',
            facilityName: exports.FACILITY_ID_MAP['obara-hospital'],
            positionMappings: obaraHospitalMapping,
            lastSyncedAt: new Date()
        });
        // 立神リハビリテーション温泉病院
        this.mappings.set('tategami-rehabilitation', {
            facilityId: 'tategami-rehabilitation',
            facilityName: exports.FACILITY_ID_MAP['tategami-rehabilitation'],
            positionMappings: tategamiRehabilitationMapping,
            lastSyncedAt: new Date()
        });
        // エスポワール立神
        this.mappings.set('espoir-tategami', {
            facilityId: 'espoir-tategami',
            facilityName: exports.FACILITY_ID_MAP['espoir-tategami'],
            positionMappings: espoirTategamiMapping,
            lastSyncedAt: new Date()
        });
    };
    /**
     * 施設の役職マッピングを取得
     */
    FacilityPositionMappingService.prototype.getFacilityMapping = function (facilityId) {
        return this.mappings.get(facilityId);
    };
    /**
     * 特定の役職の権限レベルを取得
     */
    FacilityPositionMappingService.prototype.getPositionLevel = function (facilityId, positionName) {
        var mapping = this.mappings.get(facilityId);
        if (!mapping)
            return undefined;
        var position = mapping.positionMappings.find(function (p) { return p.positionName === positionName; });
        return position === null || position === void 0 ? void 0 : position.baseLevel;
    };
    /**
     * 施設間の役職レベル変換
     */
    FacilityPositionMappingService.prototype.convertPositionLevel = function (fromFacility, toFacility, positionName) {
        var fromLevel = this.getPositionLevel(fromFacility, positionName);
        if (!fromLevel)
            return undefined;
        var toMapping = this.mappings.get(toFacility);
        if (!toMapping)
            return undefined;
        // 同レベルまたは最も近いレベルの役職を探す
        var closestPosition = toMapping.positionMappings
            .reduce(function (closest, current) {
            var currentDiff = Math.abs(current.baseLevel - fromLevel);
            var closestDiff = Math.abs(closest.baseLevel - fromLevel);
            return currentDiff < closestDiff ? current : closest;
        });
        return {
            originalLevel: fromLevel,
            convertedLevel: closestPosition.baseLevel,
            suggestedPosition: closestPosition.positionName
        };
    };
    /**
     * 管理範囲による役職検索
     */
    FacilityPositionMappingService.prototype.findPositionsByManagementScope = function (facilityId, minScope, maxScope) {
        var mapping = this.mappings.get(facilityId);
        if (!mapping)
            return [];
        return mapping.positionMappings.filter(function (p) {
            if (!p.managementScope)
                return false;
            if (maxScope) {
                return p.managementScope >= minScope && p.managementScope <= maxScope;
            }
            return p.managementScope >= minScope;
        });
    };
    /**
     * 部門別の役職一覧を取得
     */
    FacilityPositionMappingService.prototype.getPositionsByDepartment = function (facilityId, departmentScope) {
        var mapping = this.mappings.get(facilityId);
        if (!mapping)
            return [];
        return mapping.positionMappings.filter(function (p) { return p.departmentScope === departmentScope; });
    };
    /**
     * 全施設の役職マッピングを取得
     */
    FacilityPositionMappingService.prototype.getAllFacilityMappings = function () {
        return Array.from(this.mappings.values());
    };
    /**
     * 施設別調整値を計算
     */
    FacilityPositionMappingService.prototype.calculateFacilityAdjustment = function (facilityId, baseLevel, positionName) {
        // 施設規模による調整
        var facilityType = exports.FACILITY_TYPE_MAP[facilityId];
        var adjustment = 0;
        // リハビリテーション病院の特定役職への調整
        if (facilityId === 'tategami-rehabilitation') {
            if (positionName === '統括主任') {
                // Phase 3でレベル7に調整済み（コード上で既に7になっているため調整不要）
                adjustment = 0;
            }
        }
        // 急性期病院の調整
        if (facilityType === 'acute') {
            // 急性期病院は基本的に調整なし
            adjustment = 0;
        }
        return adjustment;
    };
    /**
     * マッピングデータの更新
     */
    FacilityPositionMappingService.prototype.updateMapping = function (facilityId, updates) {
        var existing = this.mappings.get(facilityId);
        if (!existing)
            return false;
        this.mappings.set(facilityId, __assign(__assign(__assign({}, existing), updates), { lastSyncedAt: new Date() }));
        return true;
    };
    /**
     * 新規施設の追加
     */
    FacilityPositionMappingService.prototype.addFacility = function (mapping) {
        if (this.mappings.has(mapping.facilityId)) {
            return false;
        }
        this.mappings.set(mapping.facilityId, __assign(__assign({}, mapping), { lastSyncedAt: new Date() }));
        return true;
    };
    return FacilityPositionMappingService;
}());
exports.FacilityPositionMappingService = FacilityPositionMappingService;
// シングルトンインスタンス
exports.facilityPositionMappingService = new FacilityPositionMappingService();
