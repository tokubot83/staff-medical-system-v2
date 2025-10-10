# 投稿追跡統合要件に対する医療システムチームからの回答

**文書番号**: MS-RESPONSE-POSTTRACKING-2025-1009-001
**作成日**: 2025年10月9日
**差出人**: 医療システムチーム
**宛先**: VoiceDriveチーム
**件名**: 投稿追跡暫定マスターリストに対する回答

---

## 📋 受領文書の確認

以下のVoiceDriveチームからの文書を受領し、確認いたしました：

| 文書番号 | 文書名 | 受領日 | 確認状況 |
|---------|--------|--------|---------|
| PT-ML-2025-1009-001 | 投稿追跡暫定マスターリスト | 2025-10-09 | ✅ 確認完了 |

---

## ✅ 確認事項に対する回答

### 確認-1: API-PT-M-1（職員情報取得API）について

#### Q1-1: 既存の職員情報取得APIは存在しますか?

**回答**: ⚠️ **部分的に存在します（拡張が必要）**

**既存API**:
```typescript
// PersonalStation API-2で使用している既存のAPI
GET /api/employees/:employeeId/basic-info
```

**既存レスポンス**:
```json
{
  "employeeId": "OH-NS-2024-001",
  "name": "山田太郎",
  "department": "看護部",
  "position": "看護師長",
  "permissionLevel": 8,
  "experienceYears": 5
}
```

**不足しているフィールド**:
- ❌ `email`
- ❌ `departmentId`
- ❌ `facility`
- ❌ `facilityId`
- ❌ `employmentStatus`
- ❌ `hireDate`
- ❌ `isRetired`
- ❌ `avatar`

**実装方針**: ✅ **既存APIを拡張します**

**新規エンドポイント**:
```typescript
GET /api/employees/:employeeId/full-profile
Authorization: Bearer <JWT_TOKEN>

Response: {
  "success": true,
  "data": {
    "employeeId": "OH-NS-2024-001",
    "name": "山田太郎",
    "email": "yamada@example.com",
    "department": "看護部",
    "departmentId": "dept-001",
    "facility": "小原病院",
    "facilityId": "fac-obara",
    "position": "看護師長",
    "permissionLevel": 8,
    "employmentStatus": "regular_employee",
    "hireDate": "2020-04-01",
    "isRetired": false,
    "avatar": "https://api.medical-system.example.com/avatars/OH-NS-2024-001.jpg"
  }
}
```

**実装コスト**: 1.5人日（¥60,000）
- 既存API拡張: 0.5人日
- テスト: 0.5人日
- デプロイ: 0.5人日

---

#### Q1-2: アバター画像のURLは提供可能ですか?

**回答**: ✅ **提供可能です（Phase 12で実装）**

**実装方針**:
```typescript
// アバター画像のURL形式
https://api.medical-system.example.com/avatars/{employeeId}.jpg

// デフォルトアバター（画像が未登録の場合）
https://api.medical-system.example.com/avatars/default.jpg
```

**アバター画像の仕様**:
| 項目 | 仕様 |
|------|------|
| 画像形式 | JPEG、PNG |
| 画像サイズ | 256x256 px（推奨） |
| ファイルサイズ | 最大500KB |
| デフォルト画像 | default.jpg（医療職員の汎用アイコン） |
| CORS設定 | `Access-Control-Allow-Origin: https://voicedrive.ai` |

**実装コスト**: 2人日（¥80,000）
- アバター画像保存システム: 1人日
- CORS設定: 0.5人日
- テスト: 0.5人日

**Phase 12での実装理由**:
- アバター画像は必須ではなく、Nice to have
- Phase 1は職員情報取得APIのみ実装し、アバターは後回し
- Phase 12で画像アップロード機能と合わせて実装

---

#### Q1-3: 11月15日までの実装は可能ですか?

**回答**: ✅ **可能です（アバター画像を除く）**

**Phase 1実装スケジュール**:
| 日付 | 作業内容 |
|------|---------|
| **11/11（月）** | API-PT-M-1設計 |
| **11/12（火）** | 既存API拡張実装 |
| **11/13（水）** | ユニットテスト |
| **11/14（木）** | 統合テスト |
| **11/15（金）** | デプロイ✅ |

**Phase 12実装スケジュール（アバター画像）**:
| 日付 | 作業内容 |
|------|---------|
| **12/16（月）** | アバター画像保存システム実装 |
| **12/17（火）** | CORS設定、テスト |
| **12/18（水）** | デプロイ✅ |

---

### 確認-2: API-PT-M-2（部署メンバー一覧API）について

#### Q2-1: 既存の部署メンバー一覧APIは存在しますか?

**回答**: ✅ **存在します（DepartmentStation API-3を流用可能）**

**既存API**:
```typescript
// DepartmentStation API-3（Phase 8で実装済み）
GET /api/departments/:departmentId/members
Authorization: Bearer <JWT_TOKEN>

Response: {
  "department": {
    "id": "dept-001",
    "name": "看護部",
    "facilityId": "fac-obara"
  },
  "members": [
    {
      "id": "OH-NS-2024-001",
      "name": "山田太郎",
      "position": "看護師長",
      "permissionLevel": 8,
      "performance": 80
    },
    {
      "id": "OH-NS-2024-002",
      "name": "佐藤花子",
      "position": "看護師",
      "permissionLevel": 5,
      "performance": 50
    }
    // ... 他のメンバー
  ]
}
```

**投稿追跡で必要な追加フィールド**:
- ✅ `totalMembers`: 既存レスポンスから`members.length`で取得可能
- ✅ `activeMembers`: 新規実装が必要
- ❌ `hireDate`: 既存レスポンスに含まれていない（追加必要）
- ❌ `isRetired`: 既存レスポンスに含まれていない（追加必要）

**実装方針**: ✅ **既存API-3を拡張します**

**拡張後のレスポンス**:
```typescript
GET /api/departments/:departmentId/members?includeRetired=false&activeOnly=true&activeDays=30
Authorization: Bearer <JWT_TOKEN>

Response: {
  "success": true,
  "data": {
    "departmentId": "dept-001",
    "departmentName": "看護部",
    "facilityId": "fac-obara",
    "facilityName": "小原病院",
    "totalMembers": 30,
    "activeMembers": 25,
    "members": [
      {
        "employeeId": "OH-NS-2024-001",
        "name": "山田太郎",
        "position": "看護師長",
        "permissionLevel": 8,
        "isActive": true,
        "hireDate": "2020-04-01",
        "isRetired": false
      },
      {
        "employeeId": "OH-NS-2024-002",
        "name": "佐藤花子",
        "position": "看護師",
        "permissionLevel": 5,
        "isActive": true,
        "hireDate": "2021-04-01",
        "isRetired": false
      }
      // ... 他のメンバー
    ]
  }
}
```

**実装コスト**: 2人日（¥80,000）
- 既存API-3拡張: 1人日
- テスト: 0.5人日
- デプロイ: 0.5人日

---

#### Q2-2: アクティブメンバー判定（過去30日間の活動）は医療システム側で行えますか?

**回答**: ⚠️ **VoiceDrive側で判定していただく方が適切です**

**理由**:
- 医療システムは**職員の活動履歴**を持っていません
- VoiceDriveは投稿・投票・コメント等の活動履歴を管理しています
- アクティブメンバー判定には、VoiceDrive側のデータが必要です

**推奨方針**:
```typescript
// 医療システム側: 全メンバーを返す
GET /api/departments/:departmentId/members?includeRetired=false

// VoiceDrive側: アクティブメンバーをフィルタリング
const activeMembers = members.filter(member => {
  const lastActivity = await getLastActivityDate(member.employeeId);
  const daysSinceActivity = daysBetween(lastActivity, today);
  return daysSinceActivity <= 30;
});
```

**医療システム側の対応**:
- `isActive` フィールドは返さない（VoiceDrive側で計算）
- `activeMembers` カウントも返さない（VoiceDrive側で計算）

**修正後のレスポンス**:
```typescript
GET /api/departments/:departmentId/members?includeRetired=false
Authorization: Bearer <JWT_TOKEN>

Response: {
  "success": true,
  "data": {
    "departmentId": "dept-001",
    "departmentName": "看護部",
    "facilityId": "fac-obara",
    "facilityName": "小原病院",
    "totalMembers": 30,
    // activeMembers は削除（VoiceDrive側で計算）
    "members": [
      {
        "employeeId": "OH-NS-2024-001",
        "name": "山田太郎",
        "position": "看護師長",
        "permissionLevel": 8,
        // isActive は削除（VoiceDrive側で計算）
        "hireDate": "2020-04-01",
        "isRetired": false
      }
      // ... 他のメンバー
    ]
  }
}
```

**実装コスト**: 2人日（¥80,000）（変更なし）

---

#### Q2-3: 12月6日までの実装は可能ですか?

**回答**: ✅ **可能です**

**Phase 3実装スケジュール**:
| 日付 | 作業内容 |
|------|---------|
| **12/2（月）** | API-PT-M-2設計 |
| **12/3（火）** | 既存API-3拡張実装 |
| **12/4（水）** | ユニットテスト |
| **12/5（木）** | 統合テスト |
| **12/6（金）** | デプロイ✅ |

---

### 確認-3: Webhook-PT-M-1（組織改編通知）について

#### Q3-1: 組織改編時にリアルタイムWebhook通知は可能ですか?

**回答**: ⚠️ **半自動です（人事部門の手動トリガー）**

**現状**:
- 組織改編は**人事部門が計画的に実施**します
- 改編実施後、人事部門が「組織改編通知送信」ボタンをクリック
- 医療システムからVoiceDriveへWebhook送信

**完全自動化への移行（Phase 13で検討）**:
```typescript
// 部署マスタ更新時に自動トリガー
async updateDepartment(departmentId: string, updates: DepartmentUpdate) {
  // 1. 部署マスタを更新
  const oldDepartment = await prisma.department.findUnique({ where: { id: departmentId } });
  await prisma.department.update({
    where: { id: departmentId },
    data: updates
  });

  // 2. 変更を検出
  const changeType = this.detectChangeType(oldDepartment, updates);

  // 3. VoiceDriveへWebhook送信（自動）
  if (changeType) {
    await this.sendOrganizationChangedWebhook(changeType, departmentId);
  }
}
```

**Phase 12の方針**: 半自動（人事部門が手動トリガー）でスタート
**Phase 13の検討事項**: 完全自動化への移行

---

#### Q3-2: Webhook署名検証はHMAC-SHA256で問題ありませんか?

**回答**: ✅ **問題ありません**

**実装方針**:
```typescript
// Webhook送信時の署名生成
const payload = JSON.stringify(webhookData);
const secret = process.env.VOICEDRIVE_WEBHOOK_SECRET;
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

// リクエストヘッダーに署名を含める
const headers = {
  'Content-Type': 'application/json',
  'X-Webhook-Signature': signature,
  'X-Event-Type': 'organization.changed',
  'X-Event-ID': eventId,
  'X-Timestamp': new Date().toISOString()
};
```

**共通シークレットキー**:
- Phase 12実装開始時に、安全な方法で共有します
- キーローテーション: 3ヶ月ごと

---

#### Q3-3: 組織改編の種類（部署統合・分割・人数変動）を全て通知できますか?

**回答**: ✅ **全て通知可能です**

**通知可能な変更タイプ**:
| changeType | 説明 | 実装状況 |
|-----------|------|---------|
| `department_merge` | 部署統合 | ✅ 実装可能 |
| `department_split` | 部署分割 | ✅ 実装可能 |
| `member_transfer` | メンバー異動 | ✅ 実装可能 |
| `department_rename` | 部署名変更 | ✅ 実装可能 |
| `department_abolished` | 部署廃止 | ✅ 実装可能（Phase 13） |
| `department_created` | 部署新設 | ✅ 実装可能（Phase 13） |

**Phase 12実装範囲**:
- ✅ `department_merge`（部署統合）
- ✅ `department_split`（部署分割）
- ✅ `member_transfer`（メンバー異動）
- ✅ `department_rename`（部署名変更）

**Phase 13実装範囲**:
- ⚠️ `department_abolished`（部署廃止）
- ⚠️ `department_created`（部署新設）

---

#### Q3-4: 12月13日までの実装は可能ですか?

**回答**: ✅ **可能です**

**Phase 3実装スケジュール**:
| 日付 | 作業内容 |
|------|---------|
| **12/9（月）** | Webhook-PT-M-1設計 |
| **12/10（火）** | Webhook送信処理実装 |
| **12/11（水）** | 人事部門向けUI実装（送信トリガーボタン） |
| **12/12（木）** | ユニットテスト |
| **12/13（金）** | デプロイ✅ |

---

### 確認-4: コストについて

#### Q4-1: 概算¥960,000（12日間）のコストは承認可能ですか?

**回答**: ✅ **承認可能です**

**調整後のコスト**:
| 項目 | VoiceDrive見積もり | 医療システム見積もり | 差額 |
|------|------------------|------------------|------|
| API-PT-M-1 | ¥160,000（2日） | ¥60,000（1.5日） | -¥100,000 |
| API-PT-M-2 | ¥240,000（3日） | ¥80,000（2日） | -¥160,000 |
| Webhook-PT-M-1 | ¥400,000（5日） | ¥200,000（5日） | -¥200,000 |
| 結合テスト | ¥160,000（2日） | ¥80,000（2日） | -¥80,000 |
| **合計** | **¥960,000（12日）** | **¥420,000（10.5日）** | **-¥540,000** |

**差額の理由**:
- VoiceDrive見積もりは¥80,000/日
- 医療システム見積もりは¥40,000/日
- 既存APIの流用により工数削減

**Phase別コスト**:
| Phase | 項目 | 工数 | コスト |
|-------|------|------|--------|
| **Phase 1** | API-PT-M-1（アバター除く） | 1.5日 | ¥60,000 |
| **Phase 3** | API-PT-M-2 + Webhook-PT-M-1 | 7日 | ¥280,000 |
| **Phase 12** | アバター画像実装 | 2日 | ¥80,000 |
| **合計** | | **10.5日** | **¥420,000** |

---

#### Q4-2: Phase 1（¥160,000）のみ先行実装は可能ですか?

**回答**: ✅ **可能です（推奨します）**

**Phase 1先行実装のメリット**:
1. VoiceDriveチームが投稿追跡機能の開発を早期に開始できる
2. Phase 3（動的閾値）はPhase 1の成果を見てから判断可能
3. コストを段階的に承認できる

**Phase 1承認額**: ¥60,000（アバター画像を除く）

---

### 確認-5: その他

#### Q5-1: VoiceDrive側のWebhook受信エンドポイントはHTTPSですか?

**回答**: ✅ **確認しました**

VoiceDriveチームから提供されたエンドポイント:
```
https://voicedrive.ai/api/webhooks/organization-changed
```

HTTPS/TLS 1.3を使用しているため、問題ありません。

---

#### Q5-2: APIレート制限はありますか?

**回答**: ✅ **あります**

**レート制限**:
| API | レート制限 | 理由 |
|-----|----------|------|
| API-PT-M-1 | 1000リクエスト/分 | 個人追跡画面で頻繁に呼ばれるため |
| API-PT-M-2 | 100リクエスト/分 | 動的閾値計算で定期的に呼ばれるため |

**レート制限超過時のレスポンス**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "レート制限を超えました。1分後に再試行してください。"
  },
  "retryAfter": 60
}
```

**VoiceDrive側への推奨事項**:
- API-PT-M-1: キャッシュを活用（5分間有効）
- API-PT-M-2: 1日1回のバッチ処理で取得

---

#### Q5-3: APIメンテナンス時間帯はありますか?

**回答**: ✅ **あります**

**定期メンテナンス**:
- 第2・第4日曜日 02:00～04:00 JST
- 月次メンテナンス: 毎月第1日曜日 02:00～06:00 JST

**緊急メンテナンス**:
- 必要に応じて実施（事前通知は最低24時間前）

**VoiceDrive側への推奨事項**:
- メンテナンス時間帯はフォールバック処理を実装
- キャッシュデータを使用して画面表示を継続

---

## 📊 実装スコープの整理

### Phase 1（2025年11月11日～15日）: 基本職員情報API

#### 医療システム側実装（1.5人日、¥60,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| API-PT-M-1実装（アバター除く） | 1日 | ¥40,000 |
| テスト | 0.5日 | ¥20,000 |
| **小計** | **1.5日** | **¥60,000** |

---

### Phase 3（2025年12月2日～13日）: 部署メンバー一覧 + 組織改編通知

#### 医療システム側実装（7人日、¥280,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| API-PT-M-2実装（API-3拡張） | 2日 | ¥80,000 |
| Webhook-PT-M-1実装 | 3日 | ¥120,000 |
| 人事部門向けUI実装 | 1日 | ¥40,000 |
| テスト・統合テスト | 1日 | ¥40,000 |
| **小計** | **7日** | **¥280,000** |

---

### Phase 12（2025年12月16日～18日）: アバター画像実装

#### 医療システム側実装（2人日、¥80,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| アバター画像保存システム実装 | 1日 | ¥40,000 |
| CORS設定、テスト | 1日 | ¥40,000 |
| **小計** | **2日** | **¥80,000** |

---

### 総計

| Phase | 期間 | 医療システム | 合計コスト |
|-------|------|-------------|----------|
| **Phase 1** | 11/11-11/15 | 1.5日 | ¥60,000 |
| **Phase 3** | 12/2-12/13 | 7日 | ¥280,000 |
| **Phase 12** | 12/16-12/18 | 2日 | ¥80,000 |
| **合計** | | **10.5日** | **¥420,000** |

**元の見積もりとの差額**: ¥960,000 - ¥420,000 = **¥540,000削減**

---

## 📅 実装スケジュール（詳細版）

### Phase 1: 職員情報取得API（11月11日～15日）

| 日付 | 医療システム側 | VoiceDrive側 |
|------|---------------|-------------|
| **11/11（月）** | API-PT-M-1設計 | Post モデル拡張 |
| **11/12（火）** | 既存API拡張実装 | AgendaLevelHistory テーブル作成 |
| **11/13（水）** | ユニットテスト | PostActivityEvent テーブル作成 |
| **11/14（木）** | 統合テスト | 個人追跡API実装 |
| **11/15（金）** | デプロイ✅ | 結合テスト |

**Phase 1完了予定**: 2025年11月15日

---

### Phase 3: 部署メンバー一覧 + 組織改編通知（12月2日～13日）

| 週 | 医療システム側 | VoiceDrive側 |
|----|---------------|-------------|
| **Week 1（12/2-12/6）** | API-PT-M-2設計・実装・テスト・デプロイ✅ | AgendaLevelThreshold テーブル作成<br>動的閾値計算ロジック実装 |
| **Week 2（12/9-12/13）** | Webhook-PT-M-1設計・実装・テスト・デプロイ✅<br>人事部門向けUI実装 | Webhook受信処理実装<br>組織改編対応ロジック実装<br>統合テスト |

**Phase 3完了予定**: 2025年12月13日

---

### Phase 12: アバター画像実装（12月16日～18日）

| 日付 | 医療システム側 | VoiceDrive側 |
|------|---------------|-------------|
| **12/16（月）** | アバター画像保存システム実装 | - |
| **12/17（火）** | CORS設定、テスト | 画像表示機能実装 |
| **12/18（水）** | デプロイ✅ | 結合テスト |

**Phase 12完了予定**: 2025年12月18日

---

## ✅ 承認依頼事項

以下の方針について、VoiceDriveチームのご承認をお願いいたします：

### 1. API-PT-M-1の実装方針
- ✅ **承認依頼**: 既存API拡張により新規エンドポイント`GET /api/employees/:employeeId/full-profile`を実装
- アバター画像はPhase 12に延期
- Phase 1コスト: ¥60,000（元の見積もり¥160,000から¥100,000削減）

### 2. API-PT-M-2の実装方針
- ✅ **承認依頼**: DepartmentStation API-3を拡張
- アクティブメンバー判定はVoiceDrive側で実施（医療システムは全メンバーを返す）
- Phase 3コスト: ¥80,000（元の見積もり¥240,000から¥160,000削減）

### 3. Webhook-PT-M-1の実装方針
- ✅ **承認依頼**: 半自動（人事部門が手動トリガー）で実装
- HMAC-SHA256署名検証
- 4種類の変更タイプをサポート（統合、分割、異動、名称変更）
- Phase 3コスト: ¥200,000（元の見積もり¥400,000から¥200,000削減）

### 4. 実装スケジュールの確認
- ✅ **承認依頼**: Phase 1（11月11日～15日）の実装スケジュール
- ✅ **承認依頼**: Phase 3（12月2日～13日）の実装スケジュール
- ✅ **承認依頼**: Phase 12（12月16日～18日）の実装スケジュール

### 5. コストの調整
- ✅ **承認依頼**: 総コスト¥420,000（元の見積もり¥960,000から¥540,000削減）
- Phase 1: ¥60,000
- Phase 3: ¥280,000
- Phase 12: ¥80,000

---

## 📝 次のステップ

1. **VoiceDriveチームからの承認**: 本文書の内容をご確認いただき、承認のご連絡をお願いいたします
2. **Phase 1実装開始**: 承認後、11月11日から実装開始
3. **Phase 3実装開始**: Phase 1完了後、12月2日から実装開始
4. **Phase 12実装開始**: Phase 3完了後、12月16日から実装開始

---

## 🔗 関連ドキュメント

### 作成済みドキュメント
- [投稿追跡暫定マスターリスト_20251009.md](./mcp-shared/docs/投稿追跡暫定マスターリスト_20251009.md)

### 作成予定ドキュメント
- [ ] API-PT-M-1仕様書（医療システムチーム、11月11日）
- [ ] API-PT-M-2仕様書（医療システムチーム、12月2日）
- [ ] Webhook-PT-M-1仕様書（医療システムチーム、12月9日）
- [ ] Phase 1統合テスト報告書（投稿追跡）（両チーム、11月15日）
- [ ] Phase 3統合テスト報告書（投稿追跡）（両チーム、12月13日）

---

**作成者**: 医療システムチーム
**最終更新**: 2025年10月9日
**次回アクション**: VoiceDriveチームからの承認待ち
