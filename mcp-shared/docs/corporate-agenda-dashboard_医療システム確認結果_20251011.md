# Corporate Agenda Dashboard 医療システム確認結果

**文書番号**: MEDICAL-CONFIRMATION-2025-1011-002
**作成日**: 2025年10月11日
**作成者**: 医療職員管理システムチーム
**対象ページ**: https://voicedrive-v100.vercel.app/corporate-agenda-dashboard
**参照ドキュメント**:
- corporate-agenda-dashboard_DB要件分析_20251011.md（VoiceDriveチーム作成）
- corporate-agenda-dashboard暫定マスターリスト_20251011.md（VoiceDriveチーム作成）

---

## 📋 確認結果サマリー

### 🎯 システム構成の確認

**Corporate Agenda Dashboardページは完全にVoiceDriveシステム側で実装・運用されます**

```
VoiceDrive側で実装:
- 法人全体KPI集計（100%）
- 施設別状況集計（100%）
- アラート生成（100%）
- 施設タイプ別統計（100%）
- 全施設詳細テーブル（100%）

医療システム側で実装:
- 施設マスタAPI（既存実装済み✅）
- 施設別職員数API（既存実装済み✅）
```

### 🎉 良いニュース

**医療システム側で必要なAPI（2件）は既に実装済みです！**

- ✅ **GET /api/v2/facilities** - **実装済み**（Phase 3実装時）
- ✅ **GET /api/v2/employees/count?facility={id}** - **実装済み**（OrganizationAnalytics用に2025年10月10日実装完了）

---

## 📐 既存計画書との整合性評価

### ✅ データ管理責任分界点定義書との整合性

**結論**: ✅ **完全に整合している**

| データ項目 | VoiceDrive | 医療システム | 提供方法 |
|-----------|-----------|-------------|---------|
| **施設マスタ** | キャッシュ | ✅ マスタ | **API提供** |
| **施設別職員数** | キャッシュ | ✅ マスタ | **API提供** |
| **投稿集計データ** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |
| **アラート生成** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |

**原則に沿った設計**:
- ✅ Single Source of Truth: 施設情報・職員数は医療システムが真実の情報源
- ✅ API連携: 既存の施設マスタAPI・職員数APIを利用
- ✅ 最小重複: VoiceDrive側はキャッシュのみ（表示用）
- ✅ 明確な境界: 投稿集計・アラート生成はVoiceDrive管轄

### ✅ DB構築計画書前準備との整合性

**結論**: ✅ **完全整合（Corporate Agenda Dashboard関連テーブルは全てVoiceDrive側で管理）**

既存の[DB構築計画書前準備_不足項目整理_20251008.md](../../docs/DB構築計画書前準備_不足項目整理_20251008.md)には以下が**含まれていません**：

❌ **未記載項目**:
1. 法人全体KPI集計テーブル
2. 施設別状況集計テーブル
3. アラート管理テーブル

**理由**: Corporate Agenda Dashboardページは完全にVoiceDriveチームが管理する集計機能のため、医療システム側のDB設計に反映されていない

**影響**: ✅ **影響なし（追加不要）**

理由：
- 法人全体の議題化プロセス集計はVoiceDrive側の責任範囲（データ管理責任分界点定義書に準拠）
- 医療システムは施設マスタ・職員数APIを提供するのみ（既に実装済み）
- DB構築計画書への追加は**不要**

### ✅ 共通DB構築後_作業再開指示書との整合性

**結論**: ✅ **整合している**

既存の[共通DB構築後_作業再開指示書_20250928.md](../../docs/共通DB構築後_作業再開指示書_20250928.md)には以下が記載されています：

- ✅ 施設別権限レベル管理システム（Phase 3完了）
- ✅ OrganizationAnalytics API統合テスト手順（6.3節）
- ✅ ExecutiveReports/BoardPreparation VoiceDrive実装タスク（6.3.6節）

**Corporate Agenda Dashboardへの対応**:
- 同じAPI（`GET /api/v2/facilities`, `GET /api/v2/employees/count`）を使用するため、既存の統合テスト手順を流用可能
- 追加の統合テスト項目は不要

### 📊 整合性評価サマリー

| ドキュメント | 整合性 | 対応要否 | 備考 |
|------------|--------|---------|------|
| **データ管理責任分界点定義書** | ✅ 完全整合 | 不要 | 責任分担が明確 |
| **DB構築計画書前準備_不足項目整理** | ✅ 完全整合 | **不要** | VoiceDrive側で管理 |
| **共通DB構築後_作業再開指示書** | ✅ 整合 | 不要 | 既存手順を流用可能 |

**結論**: ✅ **医療システム側で追加のDB設計・実装は不要**

---

## 🔍 詳細確認結果

### 1. API提供状況の確認

#### ✅ API-1: 施設マスタ取得API（実装済み）

**VoiceDriveチームの要求**:
```
GET /api/v2/facilities
```

**実装状況**: ✅ **完全実装済み**

**実装ファイル**: `src/app/api/v2/facilities/route.ts`

**実装完了日**: 2025年9月28日（Phase 3実装時）

**現在のレスポンス形式**:
```json
{
  "data": {
    "facilities": [
      {
        "facilityId": "obara-hospital",
        "facilityCode": "OB-HOSP",
        "facilityName": "医療法人 厚生会 小原病院",
        "facilityType": "acute",
        "isActive": true,
        "staffCount": 420
      },
      {
        "facilityId": "tategami-rehabilitation",
        "facilityCode": "TG-REHAB",
        "facilityName": "立神リハビリテーション温泉病院",
        "facilityType": "rehabilitation",
        "isActive": true,
        "staffCount": 180
      },
      {
        "facilityId": "espoir-tategami",
        "facilityCode": "ES-CARE",
        "facilityName": "介護老人保健施設エスポワール立神",
        "facilityType": "geriatric_health_facility",
        "isActive": true,
        "staffCount": 150
      }
    ]
  },
  "meta": {
    "totalCount": 3,
    "timestamp": "2025-10-11T00:00:00Z"
  }
}
```

**VoiceDriveチームが要求した形式**:
```json
{
  "facilities": [
    {
      "id": "F001",
      "code": "CC-HOSP",
      "name": "中央総合病院",
      "type": "hospital",
      "address": "...",
      "isActive": true
    }
  ],
  "totalCount": 10,
  "timestamp": "2025-10-11T00:00:00Z"
}
```

**互換性の評価**:

| 項目 | 現在のAPI | VoiceDrive要求 | 互換性 | 対応方法 |
|------|----------|---------------|--------|---------|
| **施設ID** | `facilityId` | `id` | ⚠️ フィールド名相違 | VoiceDrive側でマッピング |
| **施設コード** | `facilityCode` | `code` | ⚠️ フィールド名相違 | VoiceDrive側でマッピング |
| **施設名** | `facilityName` | `name` | ⚠️ フィールド名相違 | VoiceDrive側でマッピング |
| **施設タイプ** | `facilityType` | `type` | ⚠️ フィールド名相違 | VoiceDrive側でマッピング |
| **稼働状況** | `isActive` | `isActive` | ✅ 一致 | そのまま利用可能 |
| **職員数** | `staffCount` | 必要 | ✅ 実装済み | そのまま利用可能 |
| **住所** | ❌ 未実装 | `address` | ⚠️ 任意項目 | 必要に応じてPhase 2で追加 |

**結論**: ✅ **APIは実装済み。VoiceDrive側でフィールド名マッピングすれば利用可能**

---

#### ✅ API-2: 施設別職員数取得API（実装済み）

**VoiceDriveチームの要求**:
```
GET /api/v2/employees/count?facility={facilityId}
```

**実装状況**: ✅ **完全実装済み**

**実装ファイル**: `src/app/api/v2/employees/count/route.ts`

**実装完了日**: 2025年10月10日（OrganizationAnalytics Phase 1実装時）

**現在のレスポンス形式**:
```json
{
  "data": {
    "totalCount": 150,
    "byDepartment": [
      {
        "departmentId": "dept_001",
        "departmentCode": "NUR",
        "departmentName": "看護部",
        "count": 50
      }
    ],
    "byFacility": [
      {
        "facilityId": "espoir-tategami",
        "facilityName": "介護老人保健施設エスポワール立神",
        "count": 150
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-11T00:00:00Z",
    "filters": {
      "facilityId": "espoir-tategami",
      "departmentId": null
    }
  }
}
```

**互換性の評価**:

| 項目 | 現在のAPI | VoiceDrive要求 | 互換性 | 対応方法 |
|------|----------|---------------|--------|---------|
| **総職員数** | `data.totalCount` | `totalCount` | ⚠️ フィールド名相違 | VoiceDrive側でマッピング |
| **施設絞り込み** | `?facility={id}` | `?facility={id}` | ✅ 一致 | そのまま利用可能 |
| **レスポンスタイムスタンプ** | `meta.timestamp` | `timestamp` | ✅ 実装済み | そのまま利用可能 |

**結論**: ✅ **APIは実装済み。VoiceDrive側でレスポンスフォーマットを変換すれば利用可能**

---

### 2. 施設タイプのマッピング確認

#### VoiceDriveチームの要求（5種類）

```typescript
facilityTypes: [
  'hospital',        // 病院
  'medical_center',  // 医療センター
  'rehab',          // リハビリテーションセンター
  'clinic',         // 診療所
  'care_facility'   // 介護施設
]
```

#### 医療システムの現在のfacilityType（enum）

```typescript
facilityTypes: [
  'acute',                        // 急性期病院
  'rehabilitation',               // リハビリテーション病院
  'geriatric_health_facility',   // 介護老人保健施設
  'clinic',                       // 診療所
  'nursing_home'                  // 特別養護老人ホーム
]
```

#### マッピングテーブル

VoiceDrive側で以下のようにマッピングすることを推奨：

| 医療システム | VoiceDrive | 日本語 |
|------------|-----------|--------|
| `acute` | `hospital` | 総合病院 |
| `acute` | `medical_center` | 地域医療センター |
| `rehabilitation` | `rehab` | リハビリテーションセンター |
| `clinic` | `clinic` | 診療所 |
| `geriatric_health_facility` | `care_facility` | 介護施設 |
| `nursing_home` | `care_facility` | 介護施設 |

**注意事項**:
- 医療システム側の `acute` は、VoiceDrive側で施設名により `hospital` または `medical_center` に分類する必要があります
- 例: "中央総合病院" → `hospital`, "北部医療センター" → `medical_center`

**推奨実装**:
```typescript
// VoiceDrive: src/utils/facilityTypeMapper.ts
export const mapFacilityType = (
  medicalSystemType: string,
  facilityName: string
): string => {
  if (medicalSystemType === 'acute') {
    if (facilityName.includes('医療センター')) {
      return 'medical_center';
    }
    return 'hospital';
  }

  const mapping: Record<string, string> = {
    'rehabilitation': 'rehab',
    'clinic': 'clinic',
    'geriatric_health_facility': 'care_facility',
    'nursing_home': 'care_facility'
  };

  return mapping[medicalSystemType] || 'hospital';
};
```

---

## 📊 医療システム側の対応状況

### ✅ 対応完了（実装済み）

1. **施設マスタ取得API** - `GET /api/v2/facilities`
   - ファイル: `src/app/api/v2/facilities/route.ts`
   - 実装日: 2025年9月28日
   - テスト: Phase 3統合テスト成功
   - 承認番号: PHASE3-FACILITY-API-001

2. **施設別職員数取得API** - `GET /api/v2/employees/count?facility={id}`
   - ファイル: `src/app/api/v2/employees/count/route.ts`
   - 実装日: 2025年10月10日
   - テスト: 10/10テスト成功（100%）
   - 承認番号: VD-APPROVAL-2025-1010-001

### ❌ 対応不要

| 項目 | 理由 |
|------|------|
| **新規テーブル設計** | VoiceDrive側で管理 |
| **集計ロジック実装** | VoiceDrive側で実装 |
| **アラート生成機能** | VoiceDrive側で実装 |
| **ヘルススコア計算** | VoiceDrive側で実装 |

---

## 🎯 VoiceDriveチームへの推奨事項

### 1. 施設マスタAPI利用方法

**既存APIをそのまま利用できます**:

```typescript
// VoiceDrive側の実装例
async function getFacilities() {
  const response = await fetch('/api/v2/facilities', {
    headers: {
      'Authorization': `Bearer ${process.env.MEDICAL_SYSTEM_API_TOKEN}`,
      'X-API-Key': process.env.MEDICAL_SYSTEM_API_KEY
    }
  });

  const data = await response.json();

  // フィールド名変換
  return data.data.facilities.map(facility => ({
    id: facility.facilityId,
    code: facility.facilityCode,
    name: facility.facilityName,
    type: mapFacilityType(facility.facilityType, facility.facilityName),
    isActive: facility.isActive,
    employeeCount: facility.staffCount
  }));
}
```

### 2. 施設別職員数API利用方法

**既存APIをそのまま利用できます**:

```typescript
// VoiceDrive側の実装例
async function getFacilityEmployeeCount(facilityId: string): Promise<number> {
  const response = await fetch(`/api/v2/employees/count?facility=${facilityId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.MEDICAL_SYSTEM_API_TOKEN}`,
      'X-API-Key': process.env.MEDICAL_SYSTEM_API_KEY
    }
  });

  const data = await response.json();
  return data.data.totalCount;
}
```

### 3. キャッシュ戦略の推奨

**施設マスタのキャッシュ**:
```typescript
// Redis キャッシュ推奨設定
await redis.setex(
  'medical:facilities',
  86400,  // 24時間
  JSON.stringify(facilities)
);
```

**施設別職員数のキャッシュ**:
```typescript
// Redis キャッシュ推奨設定
await redis.setex(
  `medical:employees:count:${facilityId}`,
  3600,  // 1時間
  JSON.stringify(employeeCount)
);
```

**理由**:
- 施設マスタは頻繁に変更されないため、24時間キャッシュが適切
- 職員数は採用・退職により変動するため、1時間キャッシュが適切
- Corporate Agenda Dashboardの集計処理は負荷が高いため、キャッシュ必須

### 4. 施設タイプマッピングの実装

上記「2. 施設タイプのマッピング確認」セクションの推奨実装を参照してください。

---

## ✅ 確認完了チェックリスト

### 医療システム側
- [x] 施設マスタAPI実装確認
- [x] 施設別職員数API実装確認
- [x] 施設タイプenum確認
- [x] APIレスポンス形式確認
- [x] 確認結果レポート作成

### VoiceDriveチーム側（推奨アクション）
- [ ] 既存API（GET /api/v2/facilities）のフィールド名マッピング実装
- [ ] 既存API（GET /api/v2/employees/count）のレスポンス変換実装
- [ ] 施設タイプマッピング関数実装
- [ ] Redisキャッシュ戦略実装
- [ ] CorporateAgendaDashboardService実装（集計ロジック）
- [ ] 統合テスト実施

---

## 📞 次のステップ

### 医療システムチーム
1. ✅ 確認結果をVoiceDriveチームに共有
2. ⏳ VoiceDriveチームからの追加質問対応（必要に応じて）
3. ⏳ 統合テスト協力（Phase 2実装完了後）

### VoiceDriveチーム
1. 施設マスタ・職員数API利用実装（フィールド名マッピング）
2. CorporateAgendaDashboardService実装（集計ロジック）
3. Phase 2完了後、医療システムチームと統合テスト

---

## 📝 参考資料

### 医療システム実装済みAPI
- [GET /api/v2/facilities](../../src/app/api/v2/facilities/route.ts)
- [GET /api/v2/employees/count](../../src/app/api/v2/employees/count/route.ts)
- [Phase 3実装完了報告書](../../docs/Phase3_実装作業完了報告書_FINAL.md)
- [organization-analytics_API実装完了報告_20251010.md](./organization-analytics_API実装完了報告_20251010.md)

### VoiceDrive側作成ドキュメント
- [corporate-agenda-dashboard_DB要件分析_20251011.md](./corporate-agenda-dashboard_DB要件分析_20251011.md)
- [corporate-agenda-dashboard暫定マスターリスト_20251011.md](./corporate-agenda-dashboard暫定マスターリスト_20251011.md)

### 整合性評価対象ドキュメント
- [データ管理責任分界点定義書_20251008.md](./データ管理責任分界点定義書_20251008.md)
- [DB構築計画書前準備_不足項目整理_20251008.md](../../docs/DB構築計画書前準備_不足項目整理_20251008.md)
- [共通DB構築後_作業再開指示書_20250928.md](../../docs/共通DB構築後_作業再開指示書_20250928.md)

---

**文書終了**

**作成者**: 医療職員管理システムチーム
**作成日**: 2025年10月11日
**最終更新**: 2025年10月11日
**バージョン**: 1.0
**次回レビュー**: VoiceDriveチームからのフィードバック受領後
