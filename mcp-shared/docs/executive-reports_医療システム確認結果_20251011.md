# ExecutiveReports 医療システム確認結果

**文書番号**: MEDICAL-CONFIRMATION-2025-1011-001
**作成日**: 2025年10月11日
**作成者**: 医療職員管理システムチーム
**対象ページ**: https://voicedrive-v100.vercel.app/executive-reports
**参照ドキュメント**:
- executive-reports_DB要件分析_20251010.md（VoiceDriveチーム作成）
- executive-reports暫定マスターリスト_20251010.md（VoiceDriveチーム作成）
- データ管理責任分界点定義書_20251010.md

---

## 📋 確認結果サマリー

### 🎯 システム構成の確認

**ExecutiveReportsページはVoiceDriveシステム側で実装・運用されます**

```
VoiceDrive側で実装:
- ExecutiveReportsページ全体（フロントエンド）
- レポート生成エンジン
- レポート配布機能
- レポート保管機能（S3）
- VoiceDrive Database のテーブル設計

医療システム側で実装:
- 職員数取得API（既に実装済み✅）
```

### 🎉 良いニュース

**医療システム側で必要なAPI提供依頼（1件）は既に実装済みです！**

- ✅ **API-1: 総職員数取得API** - **実装済み** (OrganizationAnalytics用に2025年10月10日実装完了)

### 確認事項への回答

VoiceDriveチームからの確認事項2件について、以下の通り回答します。

---

## 📐 既存計画書との整合性評価

### ✅ データ管理責任分界点定義書（2025年10月8日）との整合性

**結論**: ✅ **完全に整合している**

VoiceDriveチームが作成した「データ管理責任分界点定義書」に基づき、以下の責任分担が明確化されています：

| データ項目 | VoiceDrive | 医療システム | 提供方法 |
|-----------|-----------|-------------|---------|
| **総職員数** | キャッシュ | ✅ マスタ | **API提供** |
| **部門別カウント** | キャッシュ | ✅ マスタ | **API提供** |
| **レポート配布リスト** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |
| **レポート保管** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |

**原則に沿った設計**:
- ✅ Single Source of Truth: 職員数は医療システムが真実の情報源
- ✅ API連携: 既存の `GET /api/v2/employees/count` を利用
- ✅ 最小重複: VoiceDrive側はキャッシュのみ（表示用）
- ✅ 明確な境界: レポート生成・配布はVoiceDrive管轄

### ⚠️ DB構築計画書前準備_不足項目整理_20251008.md との整合性

**結論**: ⚠️ **ExecutiveReports関連テーブルが未記載（影響なし）**

既存の[DB構築計画書前準備_不足項目整理_20251008.md](../../docs/DB構築計画書前準備_不足項目整理_20251008.md)（466KB、146テーブル設計）には以下が**含まれていません**：

❌ **未記載項目**:
1. 理事会レポート配布グループテーブル
2. 経営レポート生成履歴テーブル
3. レポート閲覧履歴テーブル

**理由**: ExecutiveReportsページは新しくVoiceDriveチームが分析したページのため、医療システム側のDB設計に反映されていない

**影響**: ✅ **影響なし（追加不要）**

理由：
- レポート配布・保管はVoiceDrive側の責任範囲（データ管理責任分界点定義書に準拠）
- 医療システムは職員数APIを提供するのみ（既に実装済み）
- DB構築計画書への追加は**不要**

### ✅ 共通DB構築後_作業再開指示書_20250928.md との整合性

**結論**: ✅ **整合している**

既存の[共通DB構築後_作業再開指示書_20250928.md](../../docs/共通DB構築後_作業再開指示書_20250928.md)には以下が記載されています：

- ✅ OrganizationAnalytics API統合テスト手順（6.4節）
- ✅ Strategic HR Plan API統合テスト手順（6.5節）
- ✅ VoiceDrive連携確認手順（Step 5）

**ExecutiveReportsへの対応**:
- 同じAPI（`GET /api/v2/employees/count`）を使用するため、既存の統合テスト手順を流用可能
- 追加の統合テスト項目は不要

### 📊 整合性評価サマリー

| ドキュメント | 整合性 | 対応要否 | 備考 |
|------------|--------|---------|------|
| **データ管理責任分界点定義書** | ✅ 完全整合 | 不要 | 責任分担が明確 |
| **DB構築計画書前準備_不足項目整理** | ⚠️ 未記載 | **不要** | VoiceDrive側で管理 |
| **共通DB構築後_作業再開指示書** | ✅ 整合 | 不要 | 既存手順を流用可能 |

**結論**: ✅ **医療システム側で追加のDB設計・実装は不要**

---

## 🔍 詳細確認結果

### 1. API提供依頼の確認

#### ✅ API-1: 総職員数取得API（実装済み）

**VoiceDriveチームの要求**:
```
GET /api/v2/employees/count
```

**実装状況**: ✅ **完全実装済み**

**実装ファイル**: `src/app/api/v2/employees/count/route.ts`

**実装完了日**: 2025年10月10日（OrganizationAnalytics Phase 1実装時）

**現在のレスポンス形式**:
```json
{
  "data": {
    "totalCount": 245,
    "byDepartment": [
      {
        "departmentId": "dept_001",
        "departmentCode": "NUR",
        "departmentName": "看護部",
        "count": 80
      },
      // ...
    ]
  },
  "meta": {
    "timestamp": "2025-10-11T00:00:00Z",
    "filters": {
      "facilityId": null,
      "departmentId": null
    }
  }
}
```

**VoiceDriveチームが要求した形式**:
```json
{
  "totalEmployees": 245,
  "byFacility": {
    "FAC001": 120,
    "FAC002": 100,
    "FAC003": 25
  },
  "byDepartment": {
    "看護部": 80,
    "医療技術部": 45,
    "事務部": 30
  },
  "activeOnly": true,
  "calculatedAt": "2025-10-10T15:30:00Z"
}
```

**互換性の評価**:

| 項目 | 現在のAPI | VoiceDrive要求 | 互換性 | 対応方法 |
|------|----------|---------------|--------|---------|
| **総職員数** | `data.totalCount` | `totalEmployees` | ⚠️ フィールド名相違 | VoiceDrive側でマッピング |
| **施設別カウント** | クエリパラメータ `facilityId` で絞り込み | `byFacility` オブジェクト | ⚠️ 形式相違 | VoiceDrive側で複数回API呼び出し |
| **部門別カウント** | `data.byDepartment` 配列 | `byDepartment` オブジェクト | ⚠️ 形式相違 | VoiceDrive側で変換 |
| **在職者のみ** | `status: 'active'` | `activeOnly: true` | ✅ 実装済み | そのまま利用可能 |
| **計算日時** | `meta.timestamp` | `calculatedAt` | ✅ 実装済み | そのまま利用可能 |

**結論**: ✅ **APIは実装済み。VoiceDrive側でレスポンスフォーマットを変換すれば利用可能**

---

### 2. 確認事項への回答

#### 確認-1: レポート配布リスト

**VoiceDriveチームの質問**:
> 理事会メンバーや経営幹部へのレポート配布リストは医療システム側で管理していますか？

**医療システムチームの回答**: ❌ **現在は管理していません**

**現状**:
- 医療システムには「グループ管理機能」は未実装
- Employeeテーブルに役職情報（`positionCode`, `positionLevel`）は存在
- 理事会メンバーのリスト管理は医事課・総務部の業務範囲外

**提案**:
VoiceDriveチーム側で以下の実装を推奨します：

**オプション1: VoiceDrive側でグループ管理テーブル作成**
```prisma
model ReportDistributionGroup {
  id          String   @id @default(cuid())
  groupKey    String   @unique              // "board-members", "executives"
  groupName   String                        // "理事会メンバー", "経営幹部"
  description String?

  // メンバー管理
  memberIds   Json                           // ["EMP001", "EMP002", ...]

  // 配布設定
  autoSend    Boolean  @default(false)       // 自動配布ON/OFF
  sendTiming  String?                        // "immediately", "scheduled"

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**オプション2: 医療システム側でAPI提供（将来対応）**

医療システムチームで検討可能ですが、以下の理由から **Phase 2以降** を推奨：
1. グループ管理テーブルの新規設計が必要（2-3日）
2. 組織変更時の自動更新ロジック実装が必要
3. 現在のプロジェクト優先度（共通DB構築）との調整が必要

**推奨案**: **VoiceDrive側で管理（オプション1）**

理由：
- レポート配布は VoiceDrive の機能範囲
- 配布タイミング、送信形式の制御が VoiceDrive 側で完結
- 医療システム側の開発負荷を削減

---

#### 確認-2: レポート保管期限

**VoiceDriveチームの質問**:
> 生成したレポートファイルの保管期限はどのくらいが適切ですか？

**医療システムチームの回答**: ✅ **以下の基準を推奨します**

**推奨保管期限（医療法人文書管理規定に準拠）**:

| レポート種類 | 保管期限 | 保管方法 | 根拠 |
|------------|---------|---------|------|
| **理事会資料** | **全期間保存** | S3 Standard（3年）→ Glacier（全期間） | 職員情報含む、長期トレンド分析必要 |
| **月次/四半期レポート** | **全期間保存** | S3 Standard（1年）→ Glacier（全期間） | 職員情報含む、長期トレンド分析必要 |
| **人事戦略レポート** | **全期間保存** | S3 Standard（1年）→ Glacier（全期間） | 職員情報含む、長期トレンド分析必要 |
| **委員会活動レポート** | **全期間保存** | S3 Standard（1年）→ Glacier（全期間） | 職員情報含む、長期トレンド分析必要 |

**自動アーカイブ設定の推奨**:

```typescript
// S3 Lifecycle Policy（推奨設定）
{
  "Rules": [
    {
      "Id": "BoardReports-Lifecycle",
      "Prefix": "reports/board/",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 1095,  // 3年後にGlacier移行
          "StorageClass": "GLACIER"
        }
      ]
      // Expiration設定なし = 全期間保存（職員情報含む重要文書）
    },
    {
      "Id": "MonthlyQuarterlyReports-Lifecycle",
      "Prefix": "reports/periodic/",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 365,  // 1年後にGlacier移行
          "StorageClass": "GLACIER"
        }
      ]
      // Expiration設定なし = 全期間保存
    },
    {
      "Id": "CommitteeReports-Lifecycle",
      "Prefix": "reports/committee/",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 365,  // 1年後にGlacier移行
          "StorageClass": "GLACIER"
        }
      ]
      // Expiration設定なし = 全期間保存
    }
  ]
}

// 理由:
// 1. 職員総数などの職員情報を含むため、全期間保存が適切
// 2. Phase 18 VoiceAnalytics、Phase 19 CultureDevelopmentと同じポリシー
// 3. 長期トレンド分析（5年以上）に必要
// 4. データ量は小さい（5年間で約3GB）、ストレージコスト無視できる
```

**コスト試算（月間50レポート生成、全期間保存の場合）**:

| 期間 | ストレージ | データ量（推定） | 月額コスト |
|------|----------|---------------|----------|
| 0-1年 | S3 Standard | 600レポート × 5MB = 3GB | $0.07 |
| 1-3年 | Glacier | 1,200レポート × 5MB = 6GB | $0.024 |
| 3-5年 | Glacier | 1,200レポート × 5MB = 6GB | $0.024 |
| 5-10年 | Glacier | 3,000レポート × 5MB = 15GB | $0.06 |
| **合計** | - | **約30GB（10年間）** | **約$0.18/月** |

**結論**: ✅ **全期間保存でもコストは極めて低い（月額$0.18）。Phase 18/19と同じ全期間保存ポリシーを採用**

---

## 📊 医療システム側の対応状況

### ✅ 対応完了（実装済み）

1. **総職員数取得API** - `GET /api/v2/employees/count`
   - ファイル: `src/app/api/v2/employees/count/route.ts`
   - 実装日: 2025年10月10日
   - テスト: 10/10テスト成功（100%）
   - 承認番号: VD-APPROVAL-2025-1010-001

### ⏸️ 将来対応（Phase 2以降で検討）

1. **レポート配布グループAPI**（優先度: 低）
   - VoiceDrive側での実装を推奨
   - 必要に応じて Phase 2 で医療システム側対応を検討

### ❌ 対応不要

1. **レポート保管期限管理**
   - VoiceDrive側で S3 Lifecycle Policy を設定
   - 医療システム側の関与不要

---

## 🎯 VoiceDriveチームへの推奨事項

### 1. 総職員数API利用方法

**既存APIをそのまま利用できます**:

```typescript
// VoiceDrive側の実装例
async function getTotalEmployees(): Promise<number> {
  const response = await fetch('/api/v2/employees/count', {
    headers: {
      'Authorization': `Bearer ${process.env.MEDICAL_SYSTEM_API_TOKEN}`,
      'X-API-Key': process.env.MEDICAL_SYSTEM_API_KEY
    }
  });

  const data = await response.json();
  return data.data.totalCount; // ← フィールド名を変換
}

// 部門別カウント取得
async function getEmployeeCountByDepartment() {
  const response = await fetch('/api/v2/employees/count');
  const data = await response.json();

  // VoiceDrive形式に変換
  const byDepartment = {};
  data.data.byDepartment.forEach(dept => {
    byDepartment[dept.departmentName] = dept.count;
  });

  return {
    totalEmployees: data.data.totalCount,
    byDepartment,
    activeOnly: true,
    calculatedAt: data.meta.timestamp
  };
}
```

### 2. レポート配布リスト管理

**VoiceDrive側でテーブル作成を推奨**:

```prisma
// VoiceDrive schema.prisma に追加
model ReportDistributionGroup {
  id          String   @id @default(cuid())
  groupKey    String   @unique
  groupName   String
  memberIds   Json     // 医療システムのEmployee IDを格納
  autoSend    Boolean  @default(false)
  sendTiming  String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("report_distribution_groups")
}
```

**初期データ例**:
```json
[
  {
    "groupKey": "board-members",
    "groupName": "理事会メンバー",
    "memberIds": ["EMP001", "EMP002", "EMP003"],
    "autoSend": true,
    "sendTiming": "immediately"
  },
  {
    "groupKey": "executives",
    "groupName": "経営幹部",
    "memberIds": ["EMP010", "EMP011", "EMP012", "EMP013"],
    "autoSend": false
  }
]
```

### 3. レポート保管期限設定

**S3 Lifecycle Policyを設定**:

上記の推奨設定を VoiceDrive のインフラ設定に反映してください。

---

## ✅ 確認完了チェックリスト

### 医療システム側
- [x] 総職員数API実装確認
- [x] API互換性検証
- [x] レポート配布リストの現状確認
- [x] レポート保管期限の推奨設定提示
- [x] 確認結果レポート作成

### VoiceDriveチーム側（推奨アクション）
- [ ] 既存API（GET /api/v2/employees/count）のレスポンス変換実装
- [ ] ReportDistributionGroup テーブル作成
- [ ] S3 Lifecycle Policy設定
- [ ] ExecutiveReportService実装（既存API利用）
- [ ] 統合テスト実施

---

## 📞 次のステップ

### 医療システムチーム
1. ✅ 確認結果をVoiceDriveチームに共有
2. ⏳ VoiceDriveチームからの追加質問対応（必要に応じて）
3. ⏳ 統合テスト協力（Phase 1実装完了後）

### VoiceDriveチーム
1. ExecutiveReportService実装（既存API利用）
2. レポート生成エンジン実装
3. Phase 1完了後、医療システムチームと統合テスト

---

## 📝 参考資料

### 医療システム実装済みAPI
- [GET /api/v2/employees/count](../../src/app/api/v2/employees/count/route.ts)
- [organization-analytics_API実装完了報告_20251010.md](./organization-analytics_API実装完了報告_20251010.md)
- [organization-analytics_API仕様書_20251010.yaml](./organization-analytics_API仕様書_20251010.yaml)

### 法的根拠
- 医療法施行規則 第9条（開設者の記録保存義務）
- 労働基準法 第109条（記録の保存）

---

**文書終了**

**作成者**: 医療職員管理システムチーム
**作成日**: 2025年10月11日
**最終更新**: 2025年10月11日
**バージョン**: 1.0
**次回レビュー**: VoiceDriveチームからのフィードバック受領後
