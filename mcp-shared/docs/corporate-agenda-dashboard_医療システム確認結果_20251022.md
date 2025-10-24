# CorporateAgendaDashboard 医療システム確認結果（2025年10月22日版）

**文書番号**: MED-CONF-2025-1022-002
**作成日**: 2025年10月22日
**作成者**: 医療職員管理システムチーム
**参照**: CorporateAgendaDashboard 暫定マスターリスト（2025年10月22日受領）
**重要度**: 🟢 情報共有
**ステータス**: 確認完了・承認

---

## 📋 エグゼクティブサマリー

### VoiceDriveからの依頼内容

**対象ページ**: CorporateAgendaDashboardPage (`/corporate-agenda-dashboard`)
**対象ユーザー**: レベル18（理事長・法人事務局長）

**依頼内容**:
1. **API提供依頼（2件）**
2. **Webhook通知依頼（2件）**
3. **VoiceDrive DB追加（5件）**
4. **確認事項（2件）**

### 医療システム側の確認結果

**結論**: ✅ **対応不要・実装承認**

| 項目 | 確認結果 | 詳細 |
|------|---------|------|
| **医療システムAPI開発** | ✅ **不要**（既存API利用可能） | 既存APIで代用可能 |
| **新規DB実装** | ❌ **不要** | VoiceDrive側で管理 |
| **Webhook実装** | ⚠️ **Phase 2検討事項** | 即座の対応不要 |
| **既存API影響** | ❌ **なし** | 既存API変更不要 |

---

## 🎯 医療システム側の対応要否

### A. API提供依頼：✅ **既存API利用可能**

#### API-1: 施設マスタ取得API

**VoiceDrive依頼**:
```
GET /api/v2/facilities
```

**医療システム側の状況**: ✅ **実装済み**

**実装ファイル**: [src/app/api/v2/facilities/route.ts](../../src/app/api/v2/facilities/route.ts)

**実装完了日**: 2025年9月28日（Phase 3実装時）

**レスポンス例**:
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
      }
    ]
  },
  "meta": {
    "totalCount": 2,
    "timestamp": "2025-10-22T00:00:00Z"
  }
}
```

**VoiceDriveチームへの推奨事項**:
- ✅ 既存APIをそのまま利用可能
- ⚠️ フィールド名が異なる場合は、VoiceDrive側でマッピング実装
  - `facilityId` → `id`
  - `facilityCode` → `code`
  - `facilityName` → `name`
  - `facilityType` → `type`

---

#### API-2: 施設別職員数取得API

**VoiceDrive依頼**:
```
GET /api/v2/facilities/{facilityId}/employee-count
```

**医療システム側の状況**: ⚠️ **エンドポイント異なるが、既存APIで代用可能**

**既存実装API**:
```
GET /api/v2/employees/count?facility={facilityId}
```

**実装ファイル**: [src/app/api/v2/employees/count/route.ts](../../src/app/api/v2/employees/count/route.ts)

**実装完了日**: 2025年10月10日（OrganizationAnalytics Phase 1実装時）

**レスポンス例**:
```json
{
  "data": {
    "totalCount": 180,
    "byFacility": [
      {
        "facilityId": "tategami-rehabilitation",
        "facilityName": "立神リハビリテーション温泉病院",
        "count": 180
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-22T00:00:00Z",
    "filters": {
      "facilityId": "tategami-rehabilitation"
    }
  }
}
```

**VoiceDriveチームへの推奨事項**:
- ✅ 既存API（クエリパラメータ方式）をそのまま利用可能
- ❌ 新規エンドポイント（パスパラメータ方式）の実装は不要
- ⚠️ VoiceDrive側でレスポンス変換実装を推奨

**VoiceDrive側の実装例**:
```typescript
// VoiceDrive: src/services/MedicalSystemAPI.ts
async function getFacilityEmployeeCount(facilityId: string): Promise<number> {
  const response = await fetch(
    `/api/v2/employees/count?facility=${facilityId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.MEDICAL_SYSTEM_API_TOKEN}`,
        'X-API-Key': process.env.MEDICAL_SYSTEM_API_KEY
      }
    }
  );

  const data = await response.json();
  return data.data.totalCount;  // 180
}
```

---

### B. Webhook通知依頼：⚠️ **Phase 2検討事項**

#### Webhook-1: 施設マスタ更新通知

**VoiceDrive依頼**:
```
POST https://voicedrive.ai/api/webhooks/facility-updated
```

**医療システム側の状況**: ⚠️ **Phase 2で検討**

**現状**:
- ❌ 施設マスタのWebhook通知機能は未実装
- ❌ 施設情報の更新頻度は不明

**Phase 2での検討事項**:
1. **施設マスタの更新頻度確認** - 月次？年次？リアルタイム？
2. **Webhook実装の優先度確認** - VoiceDriveチームの要望を確認
3. **Webhook送信先の確定** - VoiceDriveのエンドポイントURL確認
4. **HMAC-SHA256署名実装** - セキュリティ要件確認

**暫定対応**:
- ✅ VoiceDrive側で**定期的なポーリング**を推奨
  - 1日1回、施設マスタAPIを呼び出し
  - 変更検知はVoiceDrive側で実施（前回キャッシュとの比較）

---

#### Webhook-2: 施設新規追加/削除通知

**VoiceDrive依頼**:
```
POST https://voicedrive.ai/api/webhooks/facility-lifecycle
```

**医療システム側の状況**: ⚠️ **Phase 2で検討**

**現状**:
- ❌ 施設ライフサイクルイベントのWebhook通知機能は未実装
- ⚠️ 施設の新規開設・閉鎖は稀（年1-2回程度と推測）

**Phase 2での検討事項**:
1. **施設新設・閉鎖の頻度確認** - 過去3年の実績データ確認
2. **Webhook実装の優先度確認** - 手動連絡でも対応可能か確認
3. **テスト環境での実装検証** - 本番環境への影響確認

**暫定対応**:
- ✅ VoiceDrive側で**定期的なポーリング**を推奨
  - 1日1回、施設マスタAPIを呼び出し
  - `isActive`フィールドの変更検知

---

## 🗄️ VoiceDrive DB構築計画書への意見

### C. 新規テーブル追加（5件）：✅ **全て承認**

#### Table-1: Facility（施設マスタキャッシュ）

**VoiceDrive側の実装**:
```prisma
model Facility {
  id              String    @id @default(cuid())
  facilityCode    String    @unique
  facilityName    String
  facilityType    String
  totalEmployees  Int       @default(0)
  isActive        Boolean   @default(true)
  syncedAt        DateTime  @default(now())
}
```

**医療システムチームの意見**: ✅ **承認**

**理由**:
- ✅ データ管理責任分界点に沿った設計（医療システムがマスタ、VoiceDriveがキャッシュ）
- ✅ `syncedAt`フィールドにより、同期状態の確認が可能
- ✅ 医療システムの施設マスタと整合性が保たれる

---

#### Table-2: FacilityStatistics（施設別統計）

**VoiceDrive側の実装**:
```prisma
model FacilityStatistics {
  id                  String    @id @default(cuid())
  facilityId          String
  periodStart         DateTime
  periodEnd           DateTime
  periodType          String
  totalPosts          Int       @default(0)
  activePosts         Int       @default(0)
  resolvedPosts       Int       @default(0)
  totalEmployees      Int       @default(0)
  activeUsers         Int       @default(0)
  participationRate   Float     @default(0)
  avgProcessDays      Float     @default(0)
  healthScore         Float     @default(0)
  trend               String    @default("stable")
  calculatedAt        DateTime  @default(now())
}
```

**医療システムチームの意見**: ✅ **承認**

**理由**:
- ✅ 完全にVoiceDrive側のデータ（投稿統計、アラート生成）
- ✅ 医療システムへの影響なし
- ✅ 日次バッチでの集計により、パフォーマンス問題を回避

---

#### Table-3: CorporateKPI（法人全体KPI）

**VoiceDrive側の実装**:
```prisma
model CorporateKPI {
  id                    String    @id @default(cuid())
  periodStart           DateTime
  periodEnd             DateTime
  periodType            String
  totalPosts            Int       @default(0)
  totalPostsChange      Float     @default(0)
  avgParticipationRate  Float     @default(0)
  participationChange   Float     @default(0)
  avgResolutionRate     Float     @default(0)
  resolutionChange      Float     @default(0)
  avgProcessDays        Float     @default(0)
  processDaysChange     Float     @default(0)
  calculatedAt          DateTime  @default(now())
}
```

**医療システムチームの意見**: ✅ **承認**

**理由**:
- ✅ VoiceDrive内部の集計データ
- ✅ 医療システムへの依存度が低い
- ✅ 前月比較機能により、トレンド分析が可能

---

#### Table-4: FacilityAlert（施設アラート）

**VoiceDrive側の実装**:
```prisma
model FacilityAlert {
  id              String    @id @default(cuid())
  facilityId      String
  alertType       String
  severity        String
  message         String    @db.Text
  currentValue    Float
  thresholdValue  Float
  isAcknowledged  Boolean   @default(false)
  detectedAt      DateTime  @default(now())
}
```

**医療システムチームの意見**: ✅ **承認**

**理由**:
- ✅ アラート管理はVoiceDrive側の責任範囲
- ✅ 医療システムへの影響なし
- ✅ `isAcknowledged`フィールドにより、アラート対応状況を追跡可能

---

#### Table-5: AlertThreshold（アラートしきい値）

**VoiceDrive側の実装**:
```prisma
model AlertThreshold {
  id                    String    @id @default(cuid())
  participationRateMin  Float     @default(60)
  processTimeDaysMax    Int       @default(30)
  healthScoreMin        Float     @default(60)
  resolutionRateMin     Float     @default(50)
  applicableScope       String    @default("all")
}
```

**医療システムチームの意見**: ✅ **承認**

**理由**:
- ✅ アラートしきい値の管理はVoiceDrive側の責任範囲
- ✅ 施設タイプ別のしきい値設定が可能（`applicableScope`）
- ✅ 医療システムへの影響なし

---

## ❓ 確認事項への回答

### 確認-1: FacilityMasterテーブルの存在確認

**VoiceDriveチームの質問**:
> 1. `FacilityMaster`テーブルは確実に実装予定ですか？
> 2. 以下のフィールドは含まれますか？
>    - `facilityCode`, `facilityName`, `facilityType`, `totalEmployees`, `isActive`
> 3. API-1（施設マスタ取得API）の実装は可能ですか？
> 4. 現在、何施設が登録予定ですか？

**医療システムチームの回答**:

#### 1. FacilityMasterテーブルの実装状況
✅ **既に実装済みです**

**実装ファイル**: [prisma/schema.prisma](../../prisma/schema.prisma) 15-28行目

**テーブル定義**:
```prisma
model Facility {
  id        String   @id @default(cuid())
  code      String   @unique
  name      String
  type      String
  address   String
  phone     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 2. フィールドの存在確認

| VoiceDrive要求フィールド | 医療システム実装状況 | 備考 |
|----------------------|------------------|------|
| `facilityCode` | ✅ `code` | フィールド名が異なる |
| `facilityName` | ✅ `name` | フィールド名が異なる |
| `facilityType` | ✅ `type` | フィールド名が異なる |
| `totalEmployees` | ⚠️ **動的集計** | `Employee`テーブルから`COUNT(*)`で取得 |
| `isActive` | ⚠️ **未実装** | 現状は全施設を有効とみなす |

**totalEmployeesの取得方法**:
```sql
SELECT COUNT(*) as totalEmployees
FROM employees
WHERE facilityId = ? AND status IN ('active', 'leave')
```

**isActiveの暫定対応**:
- 現状: 全施設を `isActive: true` として返す
- 将来: `Facility`テーブルに`isActive`フィールドを追加検討

#### 3. API-1の実装状況
✅ **既に実装済みです**

**エンドポイント**: `GET /api/v2/facilities`

**実装ファイル**: [src/app/api/v2/facilities/route.ts](../../src/app/api/v2/facilities/route.ts)

**実装完了日**: 2025年9月28日（Phase 3実装時）

#### 4. 登録予定施設数
✅ **現在2施設実装、将来10施設予定**

**現在登録済み施設（2施設）**:
1. 小原病院（obara-hospital）
2. 立神リハビリテーション温泉病院（tategami-rehabilitation）

**将来追加予定（8施設）**:
- 共通DB構築後に追加予定
- 詳細は[DB構築計画書前準備_不足項目整理_20251008.md](../../docs/DB構築計画書前準備_不足項目整理_20251008.md)参照

---

### 確認-2: Webhook送信頻度とバッチ処理

**VoiceDriveチームの質問**:
> 1. 施設マスタの更新頻度はどの程度を想定していますか？
> 2. VoiceDrive側ではリアルタイム送信を推奨しますが、施設数が少ない（10施設）ため負荷は軽微です。
> 3. 職員数の変動は頻繁でしょうか？

**医療システムチームの回答**:

#### 1. 施設マスタの更新頻度
⚠️ **低頻度（月次または年次）**

**想定される更新シナリオ**:
- 施設名変更: 年1回以下（組織再編時）
- 施設タイプ変更: ほぼなし
- 施設新設・閉鎖: 年1-2回程度
- 住所・電話番号変更: 年1回程度

**推奨Webhook実装方針**:
- ⚠️ **Phase 1ではWebhook不要**（定期ポーリングで十分）
- ✅ **Phase 2で検討**（VoiceDriveチームの要望次第）

#### 2. リアルタイム送信の必要性
⚠️ **Phase 1では不要**

**理由**:
- ✅ 施設マスタの更新頻度が低い（月次または年次）
- ✅ 施設数が少ない（10施設）ため、定期ポーリングでも負荷が低い
- ✅ VoiceDrive側で1日1回のポーリングを推奨

**推奨ポーリング設定**:
```typescript
// VoiceDrive: src/jobs/syncFacilities.ts
// 毎日午前3時に実行
cron.schedule('0 3 * * *', async () => {
  const facilities = await fetchFromMedicalSystem('/api/v2/facilities');
  await updateFacilityCache(facilities);
});
```

#### 3. 職員数の変動頻度
⚠️ **中頻度（月次）**

**想定される変動シナリオ**:
- 新規採用: 月1-5名
- 退職: 月1-3名
- 休職・復職: 月1-2名

**推奨更新方針**:
- ✅ **1日1回のポーリング**を推奨
- ❌ リアルタイムWebhookは不要（負荷がかかるだけ）

**推奨ポーリング設定**:
```typescript
// VoiceDrive: src/jobs/syncEmployeeCount.ts
// 毎日午前4時に実行
cron.schedule('0 4 * * *', async () => {
  const facilities = await fetchFacilities();
  for (const facility of facilities) {
    const count = await fetchEmployeeCount(facility.id);
    await updateEmployeeCountCache(facility.id, count);
  }
});
```

---

## 📊 整合性評価サマリー

### データ管理責任分界点定義書との整合性

**結論**: ✅ **完全に整合している**

| データ項目 | VoiceDrive | 医療システム | 提供方法 |
|-----------|-----------|-------------|---------|
| **施設マスタ** | キャッシュ | ✅ マスタ | **API提供済み** |
| **施設別職員数** | キャッシュ | ✅ マスタ | **API提供済み** |
| **投稿集計データ** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |
| **アラート生成** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |
| **ヘルススコア** | ✅ マスタ | ❌ 管轄外 | VoiceDrive側で管理 |

**原則に沿った設計**:
- ✅ Single Source of Truth: 施設情報・職員数は医療システムが真実の情報源
- ✅ API連携: 既存の施設マスタAPI・職員数APIを利用
- ✅ 最小重複: VoiceDrive側はキャッシュのみ（表示用）
- ✅ 明確な境界: 投稿集計・アラート生成はVoiceDrive管轄

---

## ✅ 承認事項

### 医療システムチームの承認

✅ VoiceDrive側のCorporateAgendaDashboard実装を**全面的に承認**します

**承認理由**:
1. ✅ データ管理責任分界点に沿った設計
2. ✅ 医療システムDBとの整合性問題なし
3. ✅ VoiceDrive内部で完結する機能（投稿集計・アラート）
4. ✅ 既存の施設マスタAPI・職員数APIへの影響なし
5. ✅ 新規API開発不要（既存APIで代用可能）
6. ✅ 5つの新規テーブルは全てVoiceDrive側で管理

---

## 📝 まとめ

### 医療システム側の対応サマリー

| 項目 | 対応 |
|------|------|
| **新規API開発** | ❌ 不要（既存APIで代用） |
| **Webhook実装** | ⚠️ Phase 2検討事項 |
| **DB変更** | ❌ 不要 |
| **schema.prisma更新** | ❌ 不要 |
| **マイグレーション** | ❌ 不要 |
| **テスト実施** | ❌ 不要 |
| **ドキュメント作成** | ✅ 本文書のみ |

**総工数**: 0日（本確認作業のみ）

---

### VoiceDrive側への回答

| 質問事項 | 回答 |
|---------|------|
| **医療システムDB変更は必要か？** | ❌ 不要です |
| **医療システムAPI開発は必要か？** | ❌ 不要です（既存APIで代用可能） |
| **既存データ同期への影響は？** | ❌ ありません |
| **Webhook実装は必要か？** | ⚠️ Phase 2で検討（暫定は定期ポーリング推奨） |
| **医療システム側で確認・質問はあるか？** | ❌ ありません |

---

## 🎯 推奨実装方針（VoiceDriveチーム向け）

### Phase 1: 既存API利用（即座に実装可能）

#### 1. 施設マスタ同期
```typescript
// VoiceDrive: src/services/MedicalSystemAPI.ts
export async function syncFacilities() {
  const response = await fetch('/api/v2/facilities', {
    headers: {
      'Authorization': `Bearer ${process.env.MEDICAL_SYSTEM_API_TOKEN}`,
      'X-API-Key': process.env.MEDICAL_SYSTEM_API_KEY
    }
  });

  const { data } = await response.json();

  for (const facility of data.facilities) {
    await prisma.facility.upsert({
      where: { facilityCode: facility.facilityCode },
      create: {
        facilityCode: facility.facilityCode,
        facilityName: facility.facilityName,
        facilityType: mapFacilityType(facility.facilityType),
        totalEmployees: facility.staffCount,
        isActive: facility.isActive,
        syncedAt: new Date()
      },
      update: {
        facilityName: facility.facilityName,
        facilityType: mapFacilityType(facility.facilityType),
        totalEmployees: facility.staffCount,
        isActive: facility.isActive,
        syncedAt: new Date()
      }
    });
  }
}
```

#### 2. 施設別職員数取得
```typescript
// VoiceDrive: src/services/MedicalSystemAPI.ts
export async function getFacilityEmployeeCount(
  facilityId: string
): Promise<number> {
  const response = await fetch(
    `/api/v2/employees/count?facility=${facilityId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.MEDICAL_SYSTEM_API_TOKEN}`,
        'X-API-Key': process.env.MEDICAL_SYSTEM_API_KEY
      }
    }
  );

  const { data } = await response.json();
  return data.totalCount;
}
```

#### 3. 施設タイプマッピング
```typescript
// VoiceDrive: src/utils/facilityTypeMapper.ts
export const mapFacilityType = (medicalSystemType: string): string => {
  const mapping: Record<string, string> = {
    'acute': 'hospital',
    'rehabilitation': 'rehab',
    'geriatric_health_facility': 'care_facility',
    'clinic': 'clinic',
    'nursing_home': 'care_facility'
  };

  return mapping[medicalSystemType] || 'hospital';
};
```

#### 4. 定期ポーリング設定
```typescript
// VoiceDrive: src/jobs/syncMedicalSystemData.ts
import cron from 'node-cron';

// 毎日午前3時に施設マスタを同期
cron.schedule('0 3 * * *', async () => {
  await syncFacilities();
});

// 毎日午前4時に職員数を同期
cron.schedule('0 4 * * *', async () => {
  const facilities = await prisma.facility.findMany({
    where: { isActive: true }
  });

  for (const facility of facilities) {
    const count = await getFacilityEmployeeCount(facility.facilityCode);
    await prisma.facility.update({
      where: { facilityCode: facility.facilityCode },
      data: { totalEmployees: count }
    });
  }
});
```

---

### Phase 2: Webhook実装（将来検討）

#### Webhook実装の検討条件
1. **施設マスタ更新頻度の確認** - 月次以上の頻度か確認
2. **リアルタイム同期の必要性確認** - 1日1回で十分か確認
3. **VoiceDriveエンドポイントの確定** - Webhook受信エンドポイントURL確認
4. **HMAC-SHA256署名実装** - セキュリティ要件確認

**Phase 2実装時のタスク**:
- [ ] Webhook送信機能実装（医療システム側）
- [ ] HMAC-SHA256署名実装（医療システム側）
- [ ] Webhook受信エンドポイント実装（VoiceDrive側）
- [ ] リトライ機構実装（医療システム側）
- [ ] 統合テスト実施

---

## 🎉 VoiceDriveチームへの感謝

VoiceDrive開発チームの皆様

CorporateAgendaDashboard（法人全体議題化ダッシュボード）の実装計画、拝見しました！

特に以下の点について感謝申し上げます：

1. **適切な責任分界**: 投稿集計・アラート生成をVoiceDrive側で完結
2. **事前の情報共有**: 医療システムへの影響の有無を明確に報告
3. **丁寧な実装計画**: 5テーブル追加の詳細設計
4. **既存APIの活用**: 新規API開発を最小限に抑えた設計

医療システム側としては、VoiceDrive側の実装を**全面的に承認**します。

既存のAPI（施設マスタ・職員数）をそのまま利用可能ですので、VoiceDrive側での実装をお待ちしております！

---

## 🔗 関連ドキュメント

### VoiceDrive側

- **corporate-agenda-dashboard_DB要件分析_20251022.md**（VoiceDriveチーム作成）
- **corporate-agenda-dashboard暫定マスターリスト_20251022.md**（VoiceDriveチーム作成）

### 医療システム側

- **corporate-agenda-dashboard_医療システム確認結果_20251022.md**（本文書）
- **corporate-agenda-dashboard_医療システム確認結果_20251011.md**（過去版、参考）
- **データ管理責任分界点定義書_20251008.md**（参照）
- [GET /api/v2/facilities](../../src/app/api/v2/facilities/route.ts)（実装済みAPI）
- [GET /api/v2/employees/count](../../src/app/api/v2/employees/count/route.ts)（実装済みAPI）

---

## 📅 次のアクション

### VoiceDriveチーム

1. ✅ 医療システム確認完了（本文書）
2. ⏳ schema.prisma更新（Facility、FacilityStatistics、CorporateKPI、FacilityAlert、AlertThreshold追加）
3. ⏳ マイグレーション実行
4. ⏳ 施設マスタ同期機能実装
5. ⏳ 統計計算サービス実装
6. ⏳ アラート検知ロジック実装
7. ⏳ フロントエンド実装（CorporateAgendaDashboardPage）
8. ⏳ 統合テスト

### 医療システムチーム

**対応**: ❌ **なし**

理由:
- VoiceDrive独自機能のため、医療システム側の対応は一切不要
- 既存API（施設マスタ・職員数）をVoiceDrive側で利用
- VoiceDrive側の実装完了を待つのみ

---

**医療職員管理システムチーム一同**

2025年10月22日

---

**改訂履歴**

| 版 | 日付 | 変更内容 | 作成者 |
|----|------|---------|--------|
| 1.0 | 2025-10-22 | 初版作成 | 医療システムチーム |

---

**文書終了**
