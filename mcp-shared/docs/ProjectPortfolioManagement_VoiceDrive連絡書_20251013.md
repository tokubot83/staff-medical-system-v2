# Project Portfolio Management VoiceDriveチーム連絡書

**文書番号**: MEDICAL-NOTIFICATION-2025-1013-001
**作成日**: 2025年10月13日
**送付先**: VoiceDrive 開発チーム
**送付元**: 医療職員管理システム 開発チーム
**件名**: Project Portfolio Management機能のDB連携確認完了通知

---

## 📋 エグゼクティブサマリー

VoiceDriveチームからの「Project Portfolio Management機能のDB連携に関する確認依頼（文書番号: MEDICAL-CONTACT-2025-1013-001）」について、医療システム側の確認作業が完了しましたので、結果をご報告いたします。

### ✅ 確認結果

**結論**:
職員カルテ個人ページで既に管理している組織情報（所属施設、配属部署、配置先、職種、役職）を、VoiceDrive側からAPI経由で取得できるようにするため、**DB設計変更とAPI実装が必要**です。

### 📊 対応サマリー

| 項目 | 状態 | 医療システム側の対応 |
|------|------|-------------------|
| **新規テーブル追加** | ❌ 不要 | VoiceDrive側で独自管理 |
| **新規API実装** | ⚠️ 必要 | GET /api/v2/employees/{employeeId} |
| **DB設計変更** | ⚠️ 必要 | professionCategoryフィールド追加 |
| **既存API** | ✅ 利用可能 | GET /api/v2/departments（実装済み） |
| **APIレート制限** | ✅ 対応可能 | VoiceDrive専用5,000req/h設定 |
| **実装期間** | 📅 確定 | 2025年12月16日〜19日（4日間） |

---

## 🎯 背景と目的

### データ連携の全体像

```
┌─────────────────────────────────────────┐
│   医療職員管理システム（Single Source of Truth） │
│                                           │
│   職員カルテ個人ページで管理中：           │
│   ✅ 所属施設（facility）                 │
│   ✅ 配属部署（department）               │
│   ✅ 配置先（unit）                       │
│   ✅ 職種（profession）                   │
│   ✅ 役職（position）                     │
│   ✅ 権限レベル（permissionLevel）        │
└─────────────────────────────────────────┘
                    │
                    │ API提供
                    │ GET /api/v2/employees/{employeeId}
                    ▼
┌─────────────────────────────────────────┐
│           VoiceDrive                      │
│                                           │
│   組織情報を活用：                         │
│   📊 投票システム（部署別、職種別）       │
│   📊 プロジェクト管理（リソース配分）     │
│   📊 職種別分析（看護師、医師、PT等）     │
│   📊 部署横断分析                         │
└─────────────────────────────────────────┘
                    │
                    │ データ還流
                    │ Webhook通知
                    ▼
┌─────────────────────────────────────────┐
│   医療職員管理システム                     │
│                                           │
│   受け取る情報：                           │
│   📈 投票結果（部署別、職種別集計）       │
│   📈 プロジェクト進捗レポート             │
│   📈 組織分析レポート                     │
│   📈 リソース活用状況                     │
└─────────────────────────────────────────┘
```

### 目的

医療システムが持つ正確な職員組織情報を、VoiceDrive側の投票システム・プロジェクト管理・分析機能で活用し、その結果を医療システムに還流することで、**データ駆動型の組織改善サイクル**を実現する。

---

## 🔍 確認結果詳細

### 1. 現状分析

#### 医療システム側の状況

**✅ 既に管理している情報**（職員カルテ個人ページ）:
- 所属施設（facility）: 例「小原病院」
- 配属部署（department）: 例「看護部」
- 配置先（unit）: 例「3階病棟」※実際の勤務場所
- 職種（profession）: 例「看護師」
- 役職（position）: 例「主任」
- 権限レベル（permissionLevel）: 例「7」

**❌ 不足している情報**:
- **職種カテゴリー（professionCategory）**: VoiceDrive側での職種別集計に必要
  - 現在のDB: Position（役職）とProfession（職種）が混在
  - 必要なDB設計: 職種を体系的に分類するカテゴリーフィールド
  - 例: 役職=「主任」、職種=「看護師」 → professionCategory="nurse"

**❌ 提供できていないAPI**:
- `GET /api/v2/employees/{employeeId}`: 職員情報取得API（未実装）
- 類似API `/api/v2/employees/count` は実装済みだが、個別職員情報は取得不可

#### VoiceDrive側の要件

**必要な情報**:
1. **職種カテゴリー（professionCategory）**:
   - 職種別リソース集計（看護師5名、医師2名、PT3名等）
   - 職種別投票分析
   - 職種別プロジェクト参加状況

2. **組織階層情報**:
   - 所属施設、配属部署、配置先
   - 部署横断分析、施設横断分析に使用

3. **役職・権限情報**:
   - 投票権限の判定
   - プロジェクト承認権限の判定

**アクセス頻度**:
- 日次バッチ（深夜3:00）: 1,000-2,000リクエスト
- Redis 24時間キャッシュで負荷軽減

---

### 2. 必要な対応

#### 対応A: DB設計変更（医療システム側）

**変更内容**:
```prisma
model Employee {
  // 既存フィールド...
  departmentId    String
  positionId      String
  facilityId      String

  // ⭐ 新規追加
  professionCategory String?  @map("profession_category")
  // 値: nurse, doctor, pt, ot, st, pharmacist, admin等（22種類）

  // 既存リレーション...
}
```

**職種カテゴリー22種類**:
- **医療職13種類**: nurse（看護師）、assistant_nurse（准看護師）、doctor（医師）、pt（理学療法士）、ot（作業療法士）、st（言語聴覚士）、pharmacist（薬剤師）、nutritionist（管理栄養士）、radiologist（診療放射線技師）、clinical_engineer（臨床工学技士）、care_worker（介護福祉士）、care_manager（ケアマネージャー）、social_worker（医療ソーシャルワーカー）

- **事務職・その他9種類**: admin（事務職）、medical_clerk（医療事務）、it_staff（情報システム）、facility_staff（施設管理）、cooking_staff（調理師）、driver（運転手）、security（警備員）、cleaning_staff（清掃員）、other（その他）

**マイグレーション**:
```sql
ALTER TABLE employees ADD COLUMN profession_category VARCHAR(50);

-- 既存データの自動投入（Position名から推測）
UPDATE employees SET profession_category = 'nurse'
WHERE position_id IN (SELECT id FROM positions WHERE name LIKE '%看護師%');
```

**作業期間**: 0.5日（2025年12月16日）

---

#### 対応B: 新規API実装（医療システム側）

**エンドポイント**:
```http
GET /api/v2/employees/{employeeId}
Authorization: Bearer {VOICEDRIVE_API_KEY}
X-API-Key: {VOICEDRIVE_API_KEY}
```

**レスポンス例**:
```json
{
  "data": {
    "employee": {
      "employeeId": "EMP12345",
      "employeeCode": "OH-NS-2021-001",
      "name": "山田太郎",
      // 組織階層（医療機関の正式な用語体系）
      "facility": "小原病院",
      "facilityId": "obara-hospital",
      "department": "看護部",
      "departmentId": "dept-001",
      "unit": "3階病棟",
      "unitId": "unit-301",
      // 職種・役職
      "profession": "看護師",
      "professionCategory": "nurse",
      "position": "主任",
      "positionId": "pos-001",
      "permissionLevel": 7,
      "status": "active"
    }
  }
}
```

**医療機関の組織用語体系**:
| 用語 | 説明 | 例 |
|------|------|-----|
| **所属施設（facility）** | 職員が雇用されている医療施設 | 小原病院 |
| **配属部署（department）** | 職員が配属される部門 | 看護部、リハビリテーション部 |
| **配置先（unit）** | 実際に勤務する現場 | 3階病棟、外来、透析室 |
| **職種（profession）** | 専門資格・職種 | 看護師、准看護師、看護補助者 |
| **役職（position）** | 管理階層上の役職 | 主任、師長、部長 |

**実装期間**: 1.5日（2025年12月17日〜18日）

---

#### 対応C: APIレート制限調整（医療システム側）

**現在の制限**:
- 一般API: 100リクエスト/時間

**VoiceDrive専用設定**:
- VoiceDrive専用: 5,000リクエスト/時間
- 深夜時間帯（3:00-5:00）は他システムからのアクセスほぼゼロ
- サーバー負荷に余裕あり

**実装期間**: 0.25日（2025年12月19日）

---

#### 対応D: テスト・ドキュメント作成（医療システム側）

**テスト内容**:
- 単体テスト: API動作確認
- 統合テスト: VoiceDriveとの接続テスト
- professionCategoryフィールドの正確性確認

**ドキュメント**:
- 職員情報API仕様書
- APIレート制限仕様書
- API認証トークン発行手順書

**実装期間**: 1.75日（2025年12月18日〜19日）

---

### 3. 実装スケジュール

| 日付 | 作業内容 | 担当 | 成果物 |
|------|---------|------|-------|
| **12月16日（月）** | DB設計変更、Prismaマイグレーション実行 | DBチーム | professionCategoryフィールド追加完了 |
| **12月17日（火）** | API実装（GET /api/v2/employees/{employeeId}） | バックエンド | API実装完了 |
| **12月18日（水）** | API実装完了、単体テスト | バックエンド、QA | テスト完了 |
| **12月19日（木）** | レート制限更新、統合テスト、ドキュメント作成 | バックエンド、QA、ドキュメント | Phase 15.1完了 |

**合計**: 4日間（2025年12月16日〜19日）

---

## 📊 VoiceDrive側の活用イメージ

### ユースケース1: 職種別リソース集計

**シナリオ**:
プロジェクト「患者満足度向上」に参加している職員の職種別カウント

**VoiceDrive側の処理**:
```typescript
// 日次バッチ（深夜3:00）
const projectMembers = await getProjectMembers('PROJ123');
const professionCounts = { nurse: 0, doctor: 0, pt: 0, admin: 0 };

for (const member of projectMembers) {
  // 医療システムAPIから職員情報取得（Redisキャッシュ利用）
  const employee = await fetchEmployeeInfo(member.userId);
  professionCounts[employee.professionCategory]++;
}

// ProjectResourceSummaryテーブルに保存
await saveResourceSummary('PROJ123', professionCounts);
```

**結果表示例**:
```
プロジェクト「患者満足度向上」リソース配分
- 看護師: 6名
- 医師: 2名
- 理学療法士: 2名
- 事務職: 2名
合計: 12名
```

---

### ユースケース2: 部署別投票分析

**シナリオ**:
提案「夜勤シフト改善」の部署別投票結果

**VoiceDrive側の処理**:
```typescript
// 投票結果集計
const votes = await getProposalVotes('PROP456');
const departmentVotes = {};

for (const vote of votes) {
  // 医療システムAPIから職員情報取得（Redisキャッシュ利用）
  const employee = await fetchEmployeeInfo(vote.userId);
  departmentVotes[employee.department] = (departmentVotes[employee.department] || 0) + 1;
}
```

**結果表示例**:
```
提案「夜勤シフト改善」投票結果（部署別）
- 看護部: 30票（賛成25、反対5）
- リハビリテーション部: 15票（賛成10、反対5）
合計: 45票（賛成35、反対10）→ 承認
```

---

### ユースケース3: 施設横断分析

**シナリオ**:
複数施設の看護師の離職率比較

**VoiceDrive側の処理**:
```typescript
// 四半期ごとの分析
const allEmployees = await fetchAllEmployees();
const facilityAnalysis = {};

for (const employee of allEmployees) {
  if (employee.professionCategory === 'nurse') {
    if (!facilityAnalysis[employee.facility]) {
      facilityAnalysis[employee.facility] = { total: 0, active: 0, resigned: 0 };
    }
    facilityAnalysis[employee.facility].total++;
    if (employee.status === 'active') {
      facilityAnalysis[employee.facility].active++;
    } else if (employee.status === 'resigned') {
      facilityAnalysis[employee.facility].resigned++;
    }
  }
}

// 離職率計算
for (const facility in facilityAnalysis) {
  const data = facilityAnalysis[facility];
  data.turnoverRate = (data.resigned / data.total) * 100;
}
```

**結果表示例**:
```
看護師離職率（2025年Q4）
- 小原病院: 5.2%（前年比-1.5%）
- 立神リハビリテーション温泉病院: 3.8%（前年比-0.8%）
法人全体: 4.5%（前年比-1.2%）
```

---

## 📈 データ還流のイメージ

### VoiceDrive → 医療システムへの還流

**還流データ例1: プロジェクト進捗レポート**
```json
{
  "reportType": "project_resource_utilization",
  "projectId": "PROJ123",
  "period": "2025-Q4",
  "resourceUtilization": {
    "byProfession": {
      "nurse": {
        "planned": 6,
        "actual": 6,
        "utilizationRate": 100,
        "personDays": 180
      },
      "doctor": {
        "planned": 2,
        "actual": 2,
        "utilizationRate": 100,
        "personDays": 60
      }
    },
    "totalPersonDays": 360,
    "costEstimate": 18000000
  }
}
```

**還流データ例2: 組織文化分析**
```json
{
  "reportType": "organization_culture_analysis",
  "period": "2025-Q4",
  "insights": [
    {
      "finding": "看護部の投票参加率が前年比+15%向上",
      "recommendation": "看護部の改善提案採用率も+20%向上。他部署への横展開を推奨"
    },
    {
      "finding": "リハビリテーション部のプロジェクト参加率が最も高い",
      "recommendation": "PT/OT/STの積極的な参加姿勢を表彰制度で評価することを推奨"
    }
  ]
}
```

---

## ✅ VoiceDriveチームへの確認事項

### 確認-1: API仕様の確認

以下のAPI仕様で問題ないでしょうか？

**エンドポイント**: `GET /api/v2/employees/{employeeId}`

**レスポンスフィールド**:
- ✅ employeeId, employeeCode, name
- ✅ facility, facilityId, department, departmentId, unit, unitId
- ✅ profession, **professionCategory** ⭐重要
- ✅ position, positionId, permissionLevel, status

**追加要望があれば教えてください。**

---

### 確認-2: 職種カテゴリー22種類の確認

医療職13種類、事務職・その他9種類で不足はないでしょうか？

**追加が必要な職種があれば教えてください。**

---

### 確認-3: APIアクセス頻度の確認

**想定**:
- 日次バッチ（深夜3:00）: 1,000-2,000リクエスト
- Redis 24時間キャッシュ

**この想定で問題ないでしょうか？リアルタイム取得が必要なケースはありますか？**

---

### 確認-4: データ還流の方式

医療システムへのデータ還流は以下の方式を想定しています：

**Option A: Webhook通知（リアルタイム）**
- 重要なイベント発生時に即座通知
- 例: 重要提案の承認、プロジェクト完了等

**Option B: 日次バッチ（定期通知）**
- 毎日深夜4:00に前日分のレポート送信
- 例: 投票結果集計、プロジェクト進捗等

**Option C: ファイルベース連携**
- JSON形式でファイル配置、医療システムが定期取得
- 例: 月次レポート、四半期分析等

**どの方式を優先すべきでしょうか？**

---

## 📅 次のステップ

### VoiceDriveチームにお願いしたいこと

1. **確認事項への回答**（期限: 2025年10月20日）
   - 上記確認-1〜4への回答

2. **Phase 15.2の準備**（2025年12月20日〜）
   - ProjectResourceSummaryテーブル実装
   - リソース集計サービス実装
   - 医療システムAPI連携実装

3. **統合テストの協力**（2025年12月19日〜20日）
   - 医療システムAPI接続テスト
   - professionCategoryフィールド確認

### 医療システムチームの作業

1. **Phase 15.1実装**（2025年12月16日〜19日）
   - DB設計変更
   - API実装
   - テスト・ドキュメント作成

2. **API認証トークン発行**（2025年12月15日）
   - 開発環境用トークン
   - 本番環境用トークン

3. **ドキュメント提供**（2025年12月19日）
   - 職員情報API仕様書
   - APIレート制限仕様書
   - API認証トークン発行手順書

---

## 📞 連絡先

### 医療システムチーム

**開発チーム**:
- **Slack**: #medical-system-dev
- **Email**: medical-system-dev@example.com

**技術責任者**:
- **担当**: システムアーキテクト
- **Slack**: @medical-architect

**API実装担当**:
- **担当**: バックエンドエンジニア
- **Slack**: @backend-lead

### 質問・確認事項の送付先

- **優先**: Slack #medical-voicedrive-integration
- **メール**: medical-system-dev@example.com
- **緊急**: @medical-architect（Slack DM）

---

## 📌 添付資料

1. **ProjectPortfolioManagement_医療システム回答書_20251013.md**
   - 詳細な技術仕様
   - DB設計変更の詳細
   - API実装コード例
   - テスト計画

2. **project-portfolio-management_医療システム確認結果_20251013.md**
   - VoiceDrive側テーブル設計
   - データフロー図
   - データ責任分界点

3. **lightsail-integration-master-plan-20251005-updated.md**
   - Phase 15全体スケジュール
   - 13ページ統合実装計画

---

## 🎯 まとめ

### 確認結果

**✅ 結論**:
職員カルテ個人ページで既に管理している組織情報（所属施設、配属部署、配置先、職種、役職）を、VoiceDrive側からAPI経由で取得できるようにするため、**DB設計変更とAPI実装が必要**です。

### 実装内容

| 対応 | 内容 | 期間 |
|------|------|------|
| DB設計変更 | professionCategoryフィールド追加 | 0.5日 |
| API実装 | GET /api/v2/employees/{employeeId} | 1.5日 |
| レート制限 | VoiceDrive専用5,000req/h設定 | 0.25日 |
| テスト | 単体・統合テスト、ドキュメント作成 | 1.75日 |
| **合計** | | **4日** |

### 期待される効果

1. **データ駆動型の組織改善サイクル構築**
   - 医療システムの正確な組織情報をベースに、VoiceDriveで投票・プロジェクト管理・分析を実施
   - その結果が医療システムに還流し、人事戦略・組織改善に活用

2. **職種別・部署別の詳細分析**
   - 看護師、医師、PT/OT/ST等の職種別リソース配分
   - 部署横断分析、施設横断分析

3. **Single Source of Truthの確立**
   - 医療システムが組織情報の唯一の真実の源泉
   - VoiceDriveはキャッシュ＋分析に専念

---

**回答期限**: 2025年10月20日（1週間後）

ご確認のほど、よろしくお願いいたします。

---

**文書終了**

最終更新: 2025年10月13日
バージョン: 1.0
次回レビュー: VoiceDriveチームからの回答受領後

---

**承認**:
- 技術責任者: （承認待ち）
- プロジェクトマネージャー: （承認待ち）
