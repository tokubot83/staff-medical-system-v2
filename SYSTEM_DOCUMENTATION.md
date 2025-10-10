# 医療職員管理システム 完全ガイド

**バージョン**: 1.0.0
**最終更新**: 2025年10月7日
**対象**: 医療法人厚生会
**システム名**: 統合医療職員管理システム

---

## 目次

1. [システム概要](#システム概要)
2. [アーキテクチャ](#アーキテクチャ)
3. [主要機能](#主要機能)
4. [データベース設計](#データベース設計)
5. [権限管理](#権限管理)
6. [API仕様](#api仕様)
7. [システム統合](#システム統合)
8. [セキュリティ](#セキュリティ)
9. [運用管理](#運用管理)
10. [開発ガイド](#開発ガイド)

---

## システム概要

### システムの目的

医療法人厚生会における全職員（500名規模）の人事管理を統合的に行うための次世代型人事管理システムです。従来の紙ベースの評価・面談から、デジタル化による効率化と高度な分析機能を実現します。

### 主要価値提供

- **評価の公平性**: 2軸評価（施設内×法人全体）による客観的評価
- **離職防止**: AI予測による早期リスク検知と介入
- **人材育成**: 動機タイプに基づくパーソナライズド育成
- **業務効率化**: 面談・評価の自動化とペーパーレス化
- **戦略的人事**: データドリブンな人材配置と採用計画

### 対象施設

```
医療法人厚生会
├─ 小原病院（obara-hospital）
│   └─ 9役職体系（院長、看護部長、病棟師長等）
├─ 立神リハビリテーション温泉病院（tategami-rehabilitation）
│   └─ 12役職体系（院長、看護部長、統括主任等）
└─ その他関連施設
```

### システムスコープ

| 機能領域 | 対象 | 状態 |
|---------|------|------|
| **評価管理** | 全職員500名 | ✅ 実装完了 |
| **面談管理** | 全職員500名 | ✅ 実装完了 |
| **健康管理** | 全職員500名 | ✅ 実装完了 |
| **レポート・分析** | 管理職・経営層 | ✅ 実装完了 |
| **施設別権限管理** | 2施設 | ✅ Phase 3完了 |
| **VoiceDrive統合** | 全職員500名 | 🔄 Phase 7計画中 |
| **共通DB構築** | 全システム | 📋 Phase 6待機中 |

---

## アーキテクチャ

### 技術スタック

#### フロントエンド

```yaml
フレームワーク: Next.js 14.2.3 (App Router)
言語: TypeScript 5.0+
UIライブラリ: React 18.3.1
スタイリング: Tailwind CSS 3.4
コンポーネント: Radix UI, shadcn/ui
状態管理: React Hooks, Context API
データ可視化: Chart.js, Recharts
PDFエクスポート: jsPDF, html2canvas
```

#### バックエンド

```yaml
ランタイム: Node.js 20+
フレームワーク: Next.js API Routes
データベース:
  - 開発環境: SQLite (Prisma)
  - 本番環境: PostgreSQL (計画中)
ORM: Prisma 6.14.0
認証: JWT, Bearer Token
API設計: RESTful API
```

#### インフラ（計画）

```yaml
ホスティング: AWS Lightsail
データベース: AWS RDS (PostgreSQL)
ストレージ: AWS S3
CDN: Vercel Edge Network
SSL/TLS: AWS Certificate Manager
モニタリング: AWS CloudWatch
```

### システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                        クライアント                          │
│           (医師、看護師、管理職、人事担当者)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Application                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   評価UI     │  │   面談UI     │  │  レポートUI  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │              API Routes Layer                     │      │
│  │  - 評価API  - 面談API  - 健康API  - 分析API      │      │
│  └──────────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │          Business Logic Layer                     │      │
│  │  - 権限計算  - 動機タイプ判定  - AI予測          │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────┬───────────────────────────────────────┘
                      │ Prisma ORM
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  職員マスタ  │  │  評価データ  │  │  面談データ  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  健康データ  │  │  権限管理    │  │  監査ログ    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                      │
                      │ Webhook / API連携
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 外部システム連携                             │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │   VoiceDrive         │  │   人事給与システム    │        │
│  │   (法人SNS)          │  │   (計画中)           │        │
│  └──────────────────────┘  └──────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### ディレクトリ構造

```
staff-medical-system/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx               # トップページ
│   │   ├── dashboard/             # ダッシュボード
│   │   ├── evaluation-*/          # 評価関連ページ
│   │   ├── interview-*/           # 面談関連ページ
│   │   ├── reports/               # レポート・分析
│   │   ├── admin/                 # 管理者機能
│   │   └── api/                   # API Routes
│   │       ├── evaluations/       # 評価API
│   │       ├── interviews/        # 面談API
│   │       ├── health/            # 健康管理API
│   │       └── motivation/        # 動機タイプAPI
│   ├── components/                # Reactコンポーネント
│   │   ├── ui/                    # UIコンポーネント
│   │   ├── evaluation/            # 評価コンポーネント
│   │   ├── interview/             # 面談コンポーネント
│   │   └── reports/               # レポートコンポーネント
│   ├── lib/                       # ビジネスロジック
│   │   ├── facility-position-mapping.ts  # 施設別権限管理
│   │   ├── motivation-type-engine.ts     # 動機タイプ判定
│   │   └── evaluation-calculator.ts      # 評価計算
│   ├── services/                  # サービス層
│   │   ├── webhook-notification.service.ts
│   │   └── ai-prediction.service.ts
│   ├── types/                     # TypeScript型定義
│   │   ├── facility-authority.ts
│   │   ├── motivation-types.ts
│   │   └── evaluation.ts
│   └── data/                      # マスターデータ
│       ├── staffData.ts
│       └── motivation-types-master.ts
├── prisma/
│   └── schema.prisma              # データベーススキーマ
├── docs/                          # ドキュメント（100件以上）
│   ├── Phase*.md                  # フェーズ別実装計画
│   ├── *-guide.md                 # 各種ガイド
│   └── *-spec.md                  # 仕様書
├── mcp-shared/                    # VoiceDriveとの共有フォルダ
│   ├── docs/                      # 共有ドキュメント
│   ├── interfaces/                # 共有型定義
│   └── specs/                     # API仕様書
└── tests/                         # テストコード
    ├── integration/               # 統合テスト
    └── production/                # 本番環境テスト
```

---

## 主要機能

### 1. 評価管理システム

#### 1.1 2軸評価（施設内×法人全体）

**特徴**:
- 施設内での相対評価（パーセンタイル方式）
- 法人全体での相対評価（職種別）
- マトリクスによる最終評価（S+, S, A+, A, B, C, D）

**評価マトリクス**:

| 施設内評価 ＼ 法人評価 | S | A | B | C | D |
|---------------------|---|---|---|---|---|
| **S** | S+ | S | A+ | A | B |
| **A** | S | A+ | A | B | C |
| **B** | A+ | A | B | C | C |
| **C** | A | B | C | C | D |
| **D** | B | C | C | D | D |

**実装状況**: ✅ 完成
**アクセス**: `/evaluation-execution`
**API**: `/api/evaluations/two-axis/calculate`

#### 1.2 評価シート（365種類）

**職種別評価シート**:
```
急性期
├─ 看護師（6段階: 新人、初級、中堅、ベテラン、主任、師長）
├─ 准看護師（4段階）
├─ 看護補助者（5段階）
├─ PT/OT/ST（各5段階）
└─ その他医療職

慢性期
├─ 看護師（6段階）
├─ 准看護師（4段階）
├─ 看護補助者（5段階）
└─ PT/OT/ST（各5段階）

老健（介護医療院）
├─ 看護師（4段階）
├─ 准看護師（4段階）
├─ 介護職（4段階）
├─ 介護福祉士（5段階）
└─ PT/OT/ST（各5段階）

外来
├─ 看護師（4段階）
├─ 准看護師（動的）
└─ 主任・師長
```

**評価項目**: 施設・職種・経験年数に応じて最適化
**パターン5設計**: 実務に即した評価基準

#### 1.3 評価実行

**機能**:
- 新規評価作成
- 評価入力（動的フォーム）
- 評価レビュー
- 相対評価（ランキング）
- PDF出力

**ワークフロー**:
```
評価作成 → 評価入力 → 一次レビュー → 相対評価 → 最終承認 → 通知
```

---

### 2. 面談管理システム

#### 2.1 V5面談システム（動機タイプベース）

**6つの動機タイプ**:

| タイプID | タイプ名 | 特徴 | アプローチ |
|---------|---------|------|-----------|
| `achievement` | 達成欲求型 | 目標達成・成果重視 | 具体的目標設定 |
| `affiliation` | 親和欲求型 | 人間関係・協調重視 | チーム活動促進 |
| `power` | 影響力欲求型 | リーダーシップ・影響力 | 管理職育成 |
| `autonomy` | 自律欲求型 | 自由・裁量重視 | 自主性尊重 |
| `security` | 安定欲求型 | 安定・安心重視 | ルーチン提供 |
| `growth` | 成長欲求型 | 学習・成長重視 | 研修機会提供 |

**動機タイプ判定フロー**:
```typescript
面談実施 → 質問応答 → AI判定 → 信頼度評価 → 履歴保存 → 育成計画提案
```

**実装状況**: ✅ 完成（2025年8月実装）
**アクセス**: `/interview-sheets/v5`

#### 2.2 面談種別

**定期面談**:
- 新人面談（入職1年目）
- 年次面談（全職員）
- 管理職面談

**特別面談**:
- 退職面談（6種類: 15分〜60分）
- 異動面談
- 復職面談
- 昇進面談
- 懲戒面談

**サポート面談**:
- VoiceDrive連携面談
- メンタルヘルスケア
- キャリア相談

**面談時間**: 15分、30分、45分、60分（職種・経験に応じて選択）

#### 2.3 面談予約システム（Phase 2実装）

**予約方法**:
1. 医療システムからの予約
2. VoiceDriveからの予約申請
3. 自動予約（定期面談）

**Webhook連携**:
```javascript
// VoiceDrive → 医療システム
{
  event: "interview.request",
  staffId: "NS-001",
  preferredDates: ["2025-10-15", "2025-10-16"],
  topic: "キャリア相談"
}
```

**通知機能**:
- メール通知
- アプリ内通知
- リマインダー（24時間前、1時間前）

---

### 3. 健康管理システム

#### 3.1 ストレスチェック

**機能**:
- 57項目質問票（厚生労働省準拠）
- 自動判定（高ストレス・要注意・正常）
- 産業医面談推奨
- 同意管理（個人情報保護）

**実装状況**: ✅ 完成
**アクセス**: `/stress-check/test`
**API**: `/api/stress-check/consent`

#### 3.2 健康診断データ管理

**機能**:
- 健康診断結果登録
- 再検査管理
- 健康統計レポート
- リスク職員検知

**同意管理**:
- 個人同意取得（上司・産業医）
- 同意状態ダッシュボード
- 監査ログ記録

**実装状況**: ✅ 完成
**アクセス**: `/health/consent-dashboard`

#### 3.3 VoiceDrive連携（Phase 5計画）

**データ連携**:
```yaml
医療システム → VoiceDrive:
  - ストレスチェック結果（同意済み）
  - 再検査リマインダー
  - 健康改善プログラム

VoiceDrive → 医療システム:
  - アクション完了通知
  - 健康プログラム参加状況
```

---

### 4. レポート・分析システム

#### 4.1 基本指標（14種類）

| レポート | 説明 | アクセス |
|---------|------|---------|
| 基本統計 | 職員数、離職率、年齢構成 | `/reports/basic-metrics/basic-statistics` |
| ベンチマーク | 業界平均との比較 | `/reports/basic-metrics/benchmark` |
| エンゲージメント | 職員満足度分析 | `/reports/basic-metrics/engagement` |
| 生産性 | 業務効率指標 | `/reports/basic-metrics/productivity` |
| リスク管理 | 離職リスク、健康リスク | `/reports/basic-metrics/risk-management` |
| 人材成長 | 研修受講率、スキル向上 | `/reports/basic-metrics/talent-growth` |
| 人材品質 | 評価分布、パフォーマンス | `/reports/basic-metrics/talent-quality` |
| コスト分析 | 人件費、採用コスト | `/reports/basic-metrics/cost-analysis` |
| コンプライアンス | 法令遵守状況 | `/reports/basic-metrics/compliance` |
| 多様性・包摂性 | DE&I指標 | `/reports/basic-metrics/diversity-inclusion` |
| 組織効率 | 組織パフォーマンス | `/reports/basic-metrics/organizational-efficiency` |
| 予測分析 | AI予測レポート | `/reports/basic-metrics/predictive-analytics` |
| 統合評価 | 総合スコア | `/reports/basic-metrics/integrated-assessment` |
| リアルタイム | リアルタイムダッシュボード | `/reports/basic-metrics/real-time-dashboard` |

#### 4.2 離職分析（13種類）

**分析手法**:
- 時系列トレンド分析
- 相関分析（離職要因特定）
- 予測モデリング（AI活用）
- リスク予測（離職確率計算）
- コストインパクト分析
- What-Ifシミュレーション

**主要レポート**:
- `/reports/turnover/risk-prediction` - 離職リスク予測
- `/reports/turnover/high-risk-dashboard` - 高リスク職員ダッシュボード
- `/reports/turnover/retention-strategies` - 定着戦略提案
- `/reports/turnover/cost-impact` - 離職コスト試算

#### 4.3 定着分析（13種類）

**生存分析（Survival Analysis）**:
- 生存曲線（部署別、全体）
- ハザードCox回帰
- リスクスコア計算

**コホート分析**:
- 入職年別追跡
- 介入効果測定
- 世代分析

**セグメント分析**:
- 採用タイプ別
- 部署別
- 職種別

#### 4.4 パフォーマンス評価分析（8種類）

- クラスタ分析（職員グループ化）
- 部署比較
- 評価トレンド
- パフォーマンスマトリックス
- スキル評価
- チーム分析
- 組織最適化
- パフォーマンス予測

#### 4.5 コホート分析（11種類）

**分析軸**:
- 入職年
- 部署
- 拠点
- 世代
- エンゲージメント
- パフォーマンス
- 学習
- ウェルビーイング
- ライフイベント
- ネットワーク
- 介入効果

#### 4.6 シミュレーション（6種類）

**シナリオ計画**:
- 採用計画シミュレーション
- 組織再設計シミュレーション
- コスト最適化シミュレーション
- 定着インパクトシミュレーション
- シナリオプランニング

**実装状況**: ✅ 全60種類のレポート実装完了

---

### 5. 管理者機能

#### 5.1 システム管理

| 機能 | 説明 | アクセス |
|------|------|---------|
| アクセス制御 | 権限管理、ロール設定 | `/admin/access-control` |
| 監査ログ | 操作履歴、データ変更記録 | `/admin/audit-log` |
| データベース管理 | DB管理、バックアップ | `/admin/database` |
| バックアップ | 自動バックアップ設定 | `/admin/backup` |
| デプロイメント | システム更新管理 | `/admin/deployment` |

#### 5.2 マスターデータ管理

| 機能 | 説明 | アクセス |
|------|------|---------|
| マスターデータ | 施設、部署、役職 | `/admin/master-data` |
| キャリアコース | A/B/C/Dコース管理 | `/admin/career-courses` |
| コンプライアンス | 法令マスター | `/admin/compliance-master` |
| 採用マスター | 採用情報管理 | `/admin/recruitment-master` |

#### 5.3 コンテンツ管理

| 機能 | 説明 | アクセス |
|------|------|---------|
| ドキュメント管理 | 規程、マニュアル | `/admin/documents` |
| 画像管理 | ロゴ、アイコン | `/admin/image-management` |
| 面談バンク | 面談質問集 | `/admin/interview-bank` |

#### 5.4 システム統合

| 機能 | 説明 | アクセス |
|------|------|---------|
| 統合ハブ | 外部システム連携 | `/admin/integration-hub` |
| MCPサーバー | Claude MCP管理 | `/admin/mcp-server` |
| MCP共有 | VoiceDrive共有 | `/admin/mcp-shared` |
| 統合モニター | 連携状況監視 | `/integration-monitor` |

#### 5.5 開発者向け

| 機能 | 説明 | アクセス |
|------|------|---------|
| 開発者ノート | 実装メモ | `/admin/dev-notes` |
| 開発者監査 | 開発者活動記録 | `/admin/developer-audit` |
| AI設定 | LLMモデル設定 | `/admin/ai-settings` |

---

### 6. 職員向け機能

#### 6.1 マイページ

**機能**:
- 個人情報確認
- 評価結果閲覧
- 面談履歴
- 研修受講履歴
- 健康診断結果（同意済み）

**アクセス**: `/my-page`

#### 6.2 キャリアコース変更申請

**4つのキャリアコース**:

| コース | 説明 | 特徴 |
|-------|------|------|
| **Aコース** | 管理職コース | 昇進志向、リーダーシップ育成 |
| **Bコース** | 専門職コース | 高度専門性、認定資格取得 |
| **Cコース** | 一般職コース | ワークライフバランス重視 |
| **Dコース** | 限定職コース | 時短勤務、特定業務 |

**変更申請フロー**:
```
職員申請 → 上司承認 → 人事承認 → VoiceDrive同期 → 通知
```

**実装状況**: ✅ Phase 5完成
**アクセス**: `/my-page/career-course/change-request`
**API**: `/api/career-course/change-request`

#### 6.3 ストレスチェック

**セルフチェック**:
- 57項目質問
- 即時結果表示
- 産業医面談推奨

**アクセス**: `/my-stress-check`

---

## データベース設計

### エンティティ関係図（ER図）

```
┌─────────────────┐
│   Facility      │ 施設マスタ
│  - id           │
│  - code         │
│  - name         │
│  - type         │
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────┐
│  Department     │ 部署マスタ
│  - id           │
│  - facilityId   │
│  - name         │
│  - level        │
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────────────────────────┐
│          Employee                    │ 職員マスタ（中核テーブル）
│  - id                                │
│  - employeeCode                      │
│  - name, nameKana, email             │
│  - departmentId, positionId          │
│  - permissionLevel (1-13)            │
│  - status (active/leave/retired)     │
└────┬────────────┬──────────┬────────┘
     │            │          │
     │ 1:N        │ 1:N      │ 1:N
     ▼            ▼          ▼
┌─────────┐  ┌─────────┐  ┌─────────────────┐
│Evaluation│  │Interview│  │  HealthRecord   │
│評価データ│  │面談データ│  │  健康診断データ │
└─────────┘  └────┬────┘  └─────────────────┘
                  │ 1:N
                  ▼
       ┌──────────────────────┐
       │StaffMotivationHistory│
       │ 動機タイプ履歴        │
       │  - motivationTypeId  │
       │  - confidenceLevel   │
       │  - isPrimary         │
       └──────────────────────┘
```

### 主要テーブル一覧

| テーブル名 | 説明 | 主要カラム | 件数見込 |
|-----------|------|-----------|---------|
| `employees` | 職員マスタ | employeeCode, name, email, permissionLevel | 500 |
| `facilities` | 施設マスタ | code, name, type | 5 |
| `departments` | 部署マスタ | facilityId, name, level | 50 |
| `positions` | 役職マスタ | code, name, level, accountType | 30 |
| `evaluations` | 評価データ | employeeId, period, overallScore | 1,000/年 |
| `two_axis_evaluations` | 2軸評価 | facilityRank, corporateRank, finalEvaluation | 1,000/年 |
| `interviews` | 面談記録 | employeeId, interviewType, motivationTypeId | 2,000/年 |
| `staff_motivation_history` | 動機タイプ履歴 | employeeId, motivationTypeId, confidenceLevel | 5,000 |
| `motivation_types` | 動機タイプマスタ | typeName, label, approach | 6 |
| `health_records` | 健康診断 | employeeId, healthScore, stressIndex | 500/年 |
| `interview_reservations` | 面談予約 | staffId, scheduledDate, status | 2,000/年 |
| `system_accounts` | システムアカウント | employeeId, systemName, accountId | 1,500 |
| `audit_logs` | 監査ログ | tableName, action, userId, changes | 100,000/年 |

### データベーススキーマ詳細

**職員マスタ (employees)**:
```sql
CREATE TABLE employees (
  id                TEXT PRIMARY KEY,
  employee_code     TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  name_kana         TEXT NOT NULL,
  email             TEXT UNIQUE NOT NULL,
  department_id     TEXT NOT NULL,
  position_id       TEXT NOT NULL,
  facility_id       TEXT NOT NULL,
  permission_level  INTEGER DEFAULT 1,  -- 1-13の権限レベル
  status            TEXT DEFAULT 'active',
  hire_date         DATETIME NOT NULL,
  retired_at        DATETIME,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (position_id) REFERENCES positions(id),
  FOREIGN KEY (facility_id) REFERENCES facilities(id)
);
```

**2軸評価 (two_axis_evaluations)**:
```sql
CREATE TABLE two_axis_evaluations (
  id                    TEXT PRIMARY KEY,
  employee_id           TEXT NOT NULL,
  evaluation_id         TEXT NOT NULL,
  evaluation_period     TEXT NOT NULL,
  score                 REAL NOT NULL,        -- 0-100
  facility_rank         INTEGER NOT NULL,
  facility_total        INTEGER NOT NULL,
  facility_evaluation   TEXT NOT NULL,        -- S,A,B,C,D
  facility_percentile   REAL NOT NULL,
  corporate_rank        INTEGER NOT NULL,
  corporate_total       INTEGER NOT NULL,
  corporate_evaluation  TEXT NOT NULL,        -- S,A,B,C,D
  corporate_percentile  REAL NOT NULL,
  final_evaluation      TEXT NOT NULL,        -- S+,S,A+,A,B,C,D
  job_category          TEXT NOT NULL,
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (evaluation_id) REFERENCES evaluations(id),
  UNIQUE(employee_id, evaluation_period)
);
```

**動機タイプ履歴 (staff_motivation_history)**:
```sql
CREATE TABLE staff_motivation_history (
  id                  TEXT PRIMARY KEY,
  employee_id         TEXT NOT NULL,
  motivation_type_id  TEXT NOT NULL,
  interview_id        TEXT,
  assessment_date     DATETIME NOT NULL,
  assessed_by         TEXT,
  confidence_level    TEXT DEFAULT 'medium',  -- high/medium/low
  notes               TEXT,
  is_primary          INTEGER DEFAULT 1,
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (motivation_type_id) REFERENCES motivation_types(id),
  FOREIGN KEY (interview_id) REFERENCES interviews(id)
);
```

---

## 権限管理

### 設計思想：4つの独立した権限体系

本システムは**意図的に4つの独立した権限体系**を採用しています。これは統一忘れや設計ミスではなく、**将来の拡張性と柔軟性を最大化するための戦略的設計**です。

#### なぜ4体系が必要なのか？

各体系は**異なる目的**を持ち、**異なる変更サイクル**で進化します。統一すると以下の問題が発生します：

1. **施設の独自性が失われる** - 小原病院と立神病院で組織構造が異なる
2. **法定要件への対応困難** - 健康診断データは特殊な保護ルールが必要
3. **制度変更の影響拡大** - 評価制度を変更すると権限制御まで影響
4. **兼務職員の表現不可** - 同一人物が文脈で異なる権限を持つケースに対応不可

#### 4つの権限体系の全体像

```
┌─────────────────────────────────────────────────────┐
│           職員マスターデータ（一元管理）              │
│  基本情報: 氏名、所属、経験年数、職種                  │
└─────────────────────────────────────────────────────┘
              │
              ├─→ ① Account Level (25段階)
              │     目的: VoiceDrive連携、法人全体の統一基準
              │     用途: API認証、システム間連携
              │     変更頻度: 低（法人組織改編時のみ）
              │
              ├─→ ② Permission Level (11段階: Level 3-13)
              │     目的: 施設別の権限制御
              │     用途: 画面表示制御、データアクセス制御
              │     変更頻度: 中（施設ごとに独立変更可能）
              │
              ├─→ ③ Staff Hierarchy (経験年数ベース)
              │     目的: 評価・面談シート選択
              │     用途: 人事制度（評価基準、育成計画）
              │     変更頻度: 高（人事制度改定時）
              │
              └─→ ④ Access Level (4段階)
                    目的: 健康診断・ストレスチェックデータ保護
                    用途: 法定要件対応（個人情報保護法、労働安全衛生法）
                    変更頻度: 低（法改正時のみ）
```

#### 設計原則：関心の分離（Separation of Concerns）

| 体系 | 責任範囲 | 独立性が必要な理由 |
|------|---------|-------------------|
| **Account Level** | 認証・統合 | VoiceDrive側との契約仕様、外部システム連携の安定性 |
| **Permission Level** | 権限制御 | 施設ごとの組織構造の違い、現場の運用独立性 |
| **Staff Hierarchy** | 人事制度 | 評価基準の変更が権限に影響しないため |
| **Access Level** | 法定保護 | 健康情報は特殊な保護ルールが必要（他の権限とは別軸） |

#### 具体例：なぜ統一できないか？

**ケース1: 兼務職員**
```
看護師Aさん（小原病院所属、立神病院でも勤務）:
- Account Level: 3（中堅職員）← VoiceDrive認証用
- Permission Level（小原）: 5（主任）← 主務先
- Permission Level（立神）: 3（一般）← 兼務先
- Staff Hierarchy: midlevel ← 評価シート選択
- Access Level: aggregate ← 健康データは集計のみ
```
→ **同一人物が文脈で異なる権限**を持つため、統一不可

**ケース2: 産業医（特殊権限）**
```
産業医Bさん:
- Account Level: 98（産業医専用）
- Permission Level: 3（日常業務は一般権限）
- Access Level: full（健康診断データは完全アクセス）
```
→ **用途で権限レベルが逆転**するため、統一不可

---

### ① Account Level（25段階）- VoiceDrive統合用

**目的**: 法人全体の統一基準、VoiceDriverとのAPI連携

**実装**: [src/services/accountLevelCalculator.ts](src/services/accountLevelCalculator.ts)

#### レベル定義（1-18 + 特殊97-99）

| Level | 役職・経験 | 補足 |
|-------|-----------|------|
| **1.0** | 新人（1年目） | |
| **1.5** | 新人リーダー | 看護職のみ、リーダー業務可能 |
| **2.0** | 若手（2-3年） | |
| **2.5** | 若手リーダー | 看護職のみ |
| **3.0** | 中堅（4-10年） | |
| **3.5** | 中堅リーダー | 看護職のみ |
| **4.0** | ベテラン（11年以上） | |
| **4.5** | ベテランリーダー | 看護職のみ |
| **5-11** | 管理職 | 副主任、主任、副師長、師長、部長等 |
| **12-13** | 施設経営層 | 副院長、院長 |
| **14-17** | 法人本部 | 人事部門、戦略企画部門 |
| **18** | 最高経営層 | 理事長、法人事務局長 |
| **97** | 健康診断担当 | 特殊権限 |
| **98** | 産業医 | 特殊権限 |
| **99** | システム管理者 | 特殊権限 |

**特徴**:
- 小数点あり（1.5, 2.5等）で**25段階の細かい区分**
- 役職優先、経験年数は補助的判定
- 看護職のみリーダー業務加算（+0.5）

---

### ② Permission Level（11段階: Level 3-13）- 施設別権限制御用

**目的**: 施設ごとの組織構造に応じた権限制御

**実装**: [src/lib/facility-position-mapping.ts](src/lib/facility-position-mapping.ts)

**注意**: Level 1-2は未使用（Level 3-13の11段階実装）

| Level | 役職例 | 権限スコープ | 主要権限 |
|-------|-------|-------------|---------|
| **13** | 理事長・院長 | 全施設 | 全データアクセス、組織変更、システム設定 |
| **12** | 副院長・事務局長 | 法人横断 | 全施設統計、法人全体レポート |
| **11** | 看護部長・薬剤部長 | 部門統括 | 部門全体管理、採用決定 |
| **10** | 事務部長・医局長 | 部門統括 | 部門管理、予算管理 |
| **9** | 看護師長 | 複数部署 | 複数病棟管理、人事評価 |
| **8** | 看護副師長 | 部署 | 病棟管理、シフト作成 |
| **7** | 統括主任 | 部署 | チーム統括、業務改善 |
| **6** | 主任看護師 | チーム | チームリーダー、新人指導 |
| **5** | リーダー（一般職） | チーム | 日勤リーダー、業務調整 |
| **4** | ベテラン（経験10年以上） | 個人 | 自己管理、後輩指導 |
| **3** | 中堅（経験5-10年） | 個人 | 自己管理 |

### 施設別権限マッピング（Phase 3実装）

#### 小原病院（9役職体系）

| 役職名 | Level | 権限範囲 |
|-------|-------|---------|
| 院長 | 13 | 全施設 |
| 看護部長 | 11 | 看護部全体 |
| 病棟師長 | 9 | 複数病棟 |
| 病棟副師長 | 8 | 担当病棟 |
| 主任看護師 | 6 | チーム |
| リーダー | 5 | 当日チーム |
| ベテラン看護師 | 4 | 個人 |
| 中堅看護師 | 3 | 個人 |
| 新人看護師 | 1 | 個人 |

#### 立神リハビリテーション温泉病院（12役職体系）

| 役職名 | Level | 権限範囲 |
|-------|-------|---------|
| 院長 | 13 | 全施設 |
| 看護部長 | 11 | 看護部全体 |
| 病棟師長 | 9 | 複数病棟 |
| 病棟副師長 | 8 | 担当病棟 |
| **統括主任** | **7** | **部署統括** ※医療チーム承認調整 |
| 主任看護師 | 6 | チーム |
| リーダー | 5 | 当日チーム |
| ベテラン看護師 | 4 | 個人 |
| 中堅看護師 | 3 | 個人 |
| 初級看護師 | 2 | 個人 |
| 新人看護師 | 1 | 個人 |
| 介護職員 | 2-4 | 経験に応じて |

---

### ③ Staff Hierarchy（経験年数ベース）- 評価・面談シート選択用

**目的**: 人事制度（評価基準、育成計画）に基づくシート選択

**実装**: [docs/STAFF_HIERARCHY_DEFINITION.md](docs/STAFF_HIERARCHY_DEFINITION.md)

**特徴**: 権限レベルとは独立した、経験年数ベースの人材育成階層

#### 看護師の階層定義

| 階層名 | 経験年数 | 評価シート | 面談シート |
|--------|----------|-----------|-----------|
| 新人看護師 | 1年目 | new-nurse | new-nurse |
| 一般看護師（ジュニア） | 2-3年目 | junior-nurse | general-nurse |
| 中堅看護師 | 4-10年目 | midlevel-nurse | senior-nurse |
| ベテラン看護師 | 11年以上 | veteran-nurse | veteran-nurse |

**役職者の特殊階層**:
- 主任看護師: `ward-chief` / `leader-nurse`
- 病棟師長: `ward-manager` / `chief-nurse`

#### なぜPermission Levelと分離しているか？

1. **評価基準は経験年数ベース**
   - 経験1年の「院長」（Permission Level 13）には新人シートを適用できない
   - 経験15年の「一般職」（Permission Level 3）にはベテランシートが必要

2. **人事制度の独立変更が必要**
   - 評価シートのバージョンアップが権限制御に影響しない
   - 育成プログラムの改定が施設別権限に影響しない

3. **評価システムと面談システムで異なる**
   - 評価システム: 詳細な職種・役職区分（将来的に病棟・外来を分離予定）
   - 面談システム: 汎用的なシート（複数の職種・役職に共通対応）

#### 実装例

```typescript
// src/lib/staff-hierarchy.ts
export function selectEvaluationSheet(
  experienceYears: number,
  position: string,
  profession: string
): string {
  // 役職優先
  if (position === '病棟師長') return 'ward-manager';
  if (position === '主任看護師') return 'ward-chief';

  // 経験年数で判定（職種別）
  if (profession === '看護師') {
    if (experienceYears <= 1) return 'new-nurse';
    if (experienceYears <= 3) return 'junior-nurse';
    if (experienceYears <= 10) return 'midlevel-nurse';
    return 'veteran-nurse';
  }

  // 他職種も同様のロジック
}
```

---

### ④ Access Level（4段階）- 健康データ保護用

**目的**: 労働安全衛生法・個人情報保護法への準拠

**実装**: [src/lib/stress-check/access-control.ts](src/lib/stress-check/access-control.ts)

**法的根拠**:
- 労働安全衛生法第66条の10（ストレスチェック結果の取り扱い）
- 個人情報保護法第27条（要配慮個人情報の取得制限）

#### 4段階のアクセスレベル

| Level | 名称 | 閲覧可能範囲 | 対象者 | 法的要件 |
|-------|------|-------------|--------|---------|
| **full** | 完全アクセス | 全項目 | 本人、産業医、システム管理者 | 本人同意不要（法定職務） |
| **limited** | 制限付きアクセス | ストレスレベル、高リスク項目のみ | 健診担当者、人事部門 | **本人同意が必須** |
| **aggregate** | 集計データのみ | 部署統計、匿名化データ | チームリーダー、管理職 | 個人特定不可のデータのみ |
| **none** | アクセス不可 | 閲覧不可 | 一般職員（他人のデータ） | - |

#### 特殊ケース：本人同意による権限昇格

```typescript
// 通常の管理職はaggregate（集計のみ）
if (user.permissionLevel >= 7 && !hasConsent) {
  return { accessLevel: 'aggregate' };
}

// 本人同意があればlimited（制限付き）に昇格
if (user.permissionLevel >= 7 && hasConsent) {
  return { accessLevel: 'limited', requiresAuditLog: true };
}
```

#### なぜ他の権限体系と分離しているか？

1. **法定要件が特殊**
   - Permission Level 13（院長）でも本人同意なしでは個人データ閲覧不可
   - Account Level 98（産業医）は同意不要で全データアクセス可能
   - **権限の逆転現象が発生**するため、別体系が必須

2. **本人同意という動的要素**
   - 同意状況により同一人物の権限が変動
   - 固定的な権限レベルでは表現不可

3. **監査ログの法定義務**
   - アクセス履歴の5年間保存義務
   - 特定の権限レベルのみログ記録（full/limitedは記録、aggregate/noneは不要）

#### 実装例

```typescript
// src/lib/stress-check/access-control.ts
export function checkStressCheckAccess(
  requestingUserLevel: number,
  targetStaffId: string,
  requestingUserId: string,
  hasConsent: boolean
): StressCheckAccessResult {

  // 本人アクセス
  if (requestingUserId === targetStaffId) {
    return { accessLevel: 'full', requiresAuditLog: false };
  }

  // 産業医（Account Level 98）
  if (requestingUserLevel === 98) {
    return {
      accessLevel: 'full',
      requiresAuditLog: true,
      reason: '労働安全衛生法第66条の10第3項'
    };
  }

  // 健診担当者（Account Level 97）
  if (requestingUserLevel === 97) {
    if (hasConsent) {
      return { accessLevel: 'limited', requiresAuditLog: true };
    } else {
      return { accessLevel: 'aggregate', requiresAuditLog: false };
    }
  }

  // 管理職
  if (requestingUserLevel >= 7) {
    if (hasConsent) {
      return { accessLevel: 'limited', requiresAuditLog: true };
    } else {
      return { accessLevel: 'aggregate', requiresAuditLog: false };
    }
  }

  // その他
  return { accessLevel: 'none', requiresAuditLog: false };
}
```

---

### 4体系の使い分けガイドライン

| 実装場面 | 使用する体系 | 理由 |
|---------|------------|------|
| **VoiceDrive API認証** | Account Level | 外部システム連携の統一基準 |
| **画面表示の権限制御** | Permission Level | 施設ごとの組織構造に対応 |
| **データベース検索のフィルタ** | Permission Level | 施設内の権限階層に基づく |
| **評価シートの選択** | Staff Hierarchy | 経験年数ベースの人事制度 |
| **面談シートの選択** | Staff Hierarchy | 育成段階に応じたシート |
| **健康診断データ閲覧** | Access Level | 法定要件への準拠 |
| **ストレスチェック結果** | Access Level | 本人同意の動的制御 |
| **統計レポート権限** | Permission Level + Access Level | 権限レベルと法的制約の両方をチェック |

### 整合性チェックの推奨実装

本稼働前に以下の検証機能を実装することを推奨します：

```typescript
// src/lib/permission-validator.ts
export class PermissionValidator {

  validateConsistency(employee: Employee): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    // 警告1: 経験年数と権限レベルの乖離
    if (employee.experienceYears <= 1 && employee.permissionLevel >= 10) {
      warnings.push({
        severity: 'warning',
        message: '経験1年以内で部長級以上の権限が付与されています',
        field: 'permissionLevel',
        suggestion: '役員就任などの特殊ケースでない場合は確認してください'
      });
    }

    // 警告2: Account LevelとPermission Levelの矛盾
    if (employee.accountLevel < 5 && employee.permissionLevel >= 13) {
      warnings.push({
        severity: 'error',
        message: 'Account Levelが一般職なのにPermission Levelが院長級です',
        field: 'accountLevel',
        suggestion: 'データ入力ミスの可能性があります'
      });
    }

    // 警告3: Staff Hierarchyと経験年数の乖離
    const expectedHierarchy = this.calculateExpectedHierarchy(employee.experienceYears);
    if (employee.staffHierarchy !== expectedHierarchy) {
      warnings.push({
        severity: 'info',
        message: `経験年数から期待される階層は${expectedHierarchy}ですが、${employee.staffHierarchy}が設定されています`,
        field: 'staffHierarchy',
        suggestion: '役職者の場合は正常です'
      });
    }

    return warnings;
  }
}
```

---

### 権限計算API

**エンドポイント**: `POST /api/v1/calculate-level`

**リクエスト**:
```json
{
  "position": "統括主任",
  "facilityId": "tategami-rehabilitation",
  "jobType": "nurse",
  "experienceYears": 12
}
```

**レスポンス**:
```json
{
  "success": true,
  "level": 7,
  "position": "統括主任",
  "facility": "立神リハビリテーション温泉病院",
  "permissions": {
    "viewScope": "department",
    "editScope": "team",
    "evaluateSubordinates": true,
    "conductInterviews": true,
    "viewStatistics": "department",
    "manageSchedule": true
  },
  "calculatedAt": "2025-10-07T10:30:00Z"
}
```

### 権限チェック実装例

```typescript
// src/lib/facility-position-mapping.ts
export function calculatePermissionLevel(
  position: string,
  facilityId: string,
  jobType: string,
  experienceYears: number
): PermissionLevel {
  const facilityMapping = getFacilityMapping(facilityId);
  const baseLevel = facilityMapping.positions[position]?.level;

  // 経験年数による調整
  if (experienceYears >= 10 && baseLevel < 4) {
    return Math.min(baseLevel + 1, 4);
  }

  // 特殊ケース: 統括主任（立神病院のみ）
  if (position === '統括主任' && facilityId === 'tategami-rehabilitation') {
    return 7; // 医療チーム承認済み
  }

  return baseLevel || 1;
}
```

---

## API仕様

### APIエンドポイント一覧

#### 評価API

| エンドポイント | メソッド | 機能 | 認証 |
|--------------|---------|------|------|
| `/api/evaluations/two-axis/calculate` | POST | 2軸評価計算 | ✅ |
| `/api/employees/[id]/evaluation-analysis` | GET | 職員別評価分析 | ✅ |
| `/api/employees/[id]/profile` | GET | 職員プロフィール | ✅ |
| `/api/evaluation-versions` | GET/POST | 評価バージョン管理 | 管理者 |
| `/api/evaluation-items/[versionId]` | GET | 評価項目取得 | ✅ |

#### 面談API

| エンドポイント | メソッド | 機能 | 認証 |
|--------------|---------|------|------|
| `/api/interviews/reservations` | GET/POST | 面談予約 | ✅ |
| `/api/interviews/reservations/[id]` | GET/PUT | 予約詳細・更新 | ✅ |
| `/api/interviews/reservations/bulk` | POST | 一括予約 | 管理者 |
| `/api/interviews/reservations/stats` | GET | 予約統計 | ✅ |
| `/api/interviews/assisted-booking` | POST | 補助予約 | ✅ |
| `/api/interviews/cancel-booking` | POST | 予約キャンセル | ✅ |
| `/api/interview-versions` | GET/POST | 面談バージョン管理 | 管理者 |

#### 動機タイプAPI

| エンドポイント | メソッド | 機能 | 認証 |
|--------------|---------|------|------|
| `/api/motivation/assess` | POST | 動機タイプ判定 | ✅ |
| `/api/motivation/history/[staffId]` | GET | 履歴取得 | ✅ |
| `/api/motivation/distribution/[department]` | GET | 部署別分布 | 管理者 |
| `/api/motivation/team-compatibility` | POST | チーム相性分析 | 管理者 |

#### 健康管理API

| エンドポイント | メソッド | 機能 | 認証 |
|--------------|---------|------|------|
| `/api/health/checkups` | GET/POST | 健康診断一覧・登録 | ✅ |
| `/api/health/checkups/[id]` | GET/PUT | 健診詳細・更新 | ✅ |
| `/api/health/staff/[staffId]/latest` | GET | 最新健診結果 | ✅ |
| `/api/health/statistics` | GET | 健康統計 | 管理者 |
| `/api/stress-check/consent` | POST | ストレスチェック同意 | ✅ |
| `/api/stress-check/my-result` | GET | 自分の結果 | ✅ |
| `/api/hr/stress-check/[staffId]` | GET | 職員別結果（要同意） | 管理者 |

#### キャリアコースAPI

| エンドポイント | メソッド | 機能 | 認証 |
|--------------|---------|------|------|
| `/api/career-course/change-request` | POST | 変更申請 | ✅ |
| `/api/career-course/my-requests` | GET | 自分の申請一覧 | ✅ |
| `/api/admin/career-course/requests/[id]/approve` | POST | 承認 | 管理者 |
| `/api/admin/career-course/requests/[id]/reject` | POST | 却下 | 管理者 |
| `/api/career-course/notify-voicedrive` | POST | VoiceDrive通知 | システム |

#### VoiceDrive連携API

| エンドポイント | メソッド | 機能 | 認証 |
|--------------|---------|------|------|
| `/api/voicedrive/analytics` | GET | 連携分析 | 管理者 |
| `/api/mcp-shared/evaluation-notifications` | POST | 評価通知 | システム |
| `/api/v3/compliance/receive` | POST | コンプライアンス通報受信 | Webhook |
| `/api/v3/compliance/webhook` | POST | Webhook送信 | システム |

### 認証・認可

#### Bearer Token認証

**ヘッダー**:
```
Authorization: Bearer <JWT_TOKEN>
```

**JWT ペイロード**:
```json
{
  "userId": "emp_123456",
  "email": "tanaka@example.com",
  "permissionLevel": 7,
  "facilityId": "tategami-rehabilitation",
  "departmentId": "dept_nursing_001",
  "iat": 1633024800,
  "exp": 1633111200
}
```

#### 権限チェック

```typescript
// ミドルウェア例
export function requirePermission(minLevel: number) {
  return async (req: NextRequest) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const decoded = verifyJWT(token);

    if (decoded.permissionLevel < minLevel) {
      return new Response('Forbidden', { status: 403 });
    }

    return null; // 認可成功
  };
}
```

### レート制限

| エンドポイント | 制限 |
|--------------|------|
| 一般API | 100リクエスト/分 |
| 認証API | 10リクエスト/分 |
| Webhook受信 | 100リクエスト/分 |
| レポート生成 | 10リクエスト/分 |

---

## システム統合

### VoiceDrive統合（Phase 7計画中）

#### 統合アーキテクチャ

```
┌──────────────────────────────────────┐
│   医療職員管理システム                │
│  (staff-medical-system)              │
│                                      │
│  ┌────────────────────────────┐     │
│  │  人事お知らせ送信サービス   │     │
│  └────────┬───────────────────┘     │
│           │ POST /api/hr-announcements
│           ▼
│  ┌────────────────────────────┐     │
│  │  統計受信Webhook API       │     │
│  └────────▲───────────────────┘     │
└───────────┼──────────────────────────┘
            │ POST /api/voicedrive/stats
            │ (HMAC-SHA256署名検証)
            │
┌───────────┼──────────────────────────┐
│   VoiceDrive                         │
│  (法人SNS)                           │
│                                      │
│  ┌────────┴───────────────────┐     │
│  │  お知らせ受信API           │     │
│  │  - 配信管理                │     │
│  │  - 職員通知                │     │
│  │  - アクション追跡          │     │
│  └────────┬───────────────────┘     │
│           │                          │
│  ┌────────▼───────────────────┐     │
│  │  統計送信サービス           │     │
│  │  - リアルタイム統計         │     │
│  │  - 時間別統計（計画）       │     │
│  │  - 日次統計（計画）         │     │
│  └────────────────────────────┘     │
└──────────────────────────────────────┘
```

#### お知らせ送信仕様

**エンドポイント**: `POST http://localhost:4000/api/hr-announcements`

**認証**: Bearer Token + `X-Source-System: medical-staff-system`

**ペイロード**:
```typescript
interface MedicalSystemAnnouncementRequest {
  title: string;                // 最大500文字
  content: string;              // 最大5000文字
  category: 'announcement' | 'interview' | 'training' | 'survey' | 'other';
  priority: 'low' | 'medium' | 'high';
  requireResponse: false;       // 固定値（Phase 7）
  autoTrackResponse: true;      // 固定値（統計自動送信）
  targetStaff: {
    staffIds?: string[];        // 特定職員
    departments?: string[];     // 部署
    positions?: string[];       // 役職
    facilities?: string[];      // 施設
  };
  scheduledAt?: string;         // ISO 8601形式
  expiresAt?: string;           // ISO 8601形式
}
```

**レスポンス**:
```json
{
  "success": true,
  "announcementId": "ann_abc123",
  "estimatedReach": 150,
  "scheduledFor": "2025-10-15T09:00:00Z"
}
```

#### 統計受信Webhook

**エンドポイント**: `POST /api/voicedrive/stats`

**認証**: HMAC-SHA256署名検証

**署名ヘッダー**:
```
X-VoiceDrive-Signature: sha256=<HMAC>
X-VoiceDrive-Timestamp: 1696694400
```

**ペイロード**:
```typescript
interface StatsWebhookPayload {
  event: 'stats.updated' | 'stats.hourly' | 'stats.daily';
  timestamp: string;
  announcement: {
    id: string;
    title: string;
    category: string;
    sentAt: string;
  };
  stats: {
    delivered: number;         // 配信成功数
    actions: number;           // アクション実行数
    completions: number;       // 完了数
  };
  breakdown?: {
    byDepartment?: Record<string, number>;
    byPosition?: Record<string, number>;
  };
}
```

**検証実装**:
```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

#### 実装状況

**VoiceDrive側**: ✅ 100%完了
- お知らせ受信API実装
- 統計送信Webhook実装
- HMAC-SHA256署名実装
- 技術ドキュメント3件完成

**医療システム側**: 📋 計画完成、実装待ち
- 型定義完成（`mcp-shared/interfaces/hr-announcement-api.interface.ts`）
- DB設計完成
- 実装タスク明確化（7.5日工数）

**前提条件**: Phase 6（共通DB構築）完了

### Phase計画全体像

| Phase | 名称 | 状態 | 完了日 |
|-------|------|------|--------|
| Phase 0 | 組織設計 | ✅ 完了 | 2025-09-15 |
| Phase 1 | 基本機能実装 | ✅ 完了 | 2025-08-10 |
| Phase 2 | 面談予約システム | ✅ 完了 | 2025-08-25 |
| Phase 3 | 施設別権限管理 | ✅ 完了 | 2025-10-02 |
| Phase 4 | 統合レポート | ✅ 完了 | 2025-09-01 |
| Phase 5 | キャリアコース | ✅ 完了 | 2025-10-01 |
| **Phase 6** | **共通DB構築** | 📋 **計画中** | - |
| **Phase 7** | **人事お知らせ統合** | 📋 **待機中** | - |

---

## セキュリティ

### データ保護

#### 個人情報保護

**保護対象データ**:
- 職員個人情報（氏名、住所、電話番号等）
- 評価データ
- 面談記録
- 健康診断結果
- ストレスチェック結果

**保護措置**:
```typescript
// 同意ベースアクセス制御
interface ConsentManagement {
  healthData: {
    viewBySupervisor: boolean;     // 上司閲覧同意
    viewByDoctor: boolean;         // 産業医閲覧同意
    shareWithVoiceDrive: boolean;  // VoiceDrive共有同意
  };
  revokedAt?: Date;
}
```

#### 暗号化

**保存時暗号化**:
- データベース: TDE（Transparent Data Encryption）
- ファイル: AES-256

**通信暗号化**:
- TLS 1.3
- HTTPS強制
- HSTS有効

### 認証・認可

#### 多要素認証（MFA）

**実装計画**:
```yaml
Phase 6.5で実装予定:
  - SMS認証
  - メール認証
  - TOTPアプリ（Google Authenticator等）
```

#### セッション管理

**セッションタイムアウト**:
- 通常: 24時間
- 管理者: 8時間
- 非アクティブタイムアウト: 2時間

#### パスワードポリシー

```yaml
最小長: 12文字
必須要素:
  - 大文字
  - 小文字
  - 数字
  - 記号
有効期限: 90日
履歴: 過去5回のパスワード再利用不可
```

### 監査ログ

#### ログ記録対象

**全操作ログ**:
- ログイン/ログアウト
- データ作成/更新/削除
- 権限変更
- 設定変更
- データエクスポート

**ログ形式**:
```json
{
  "timestamp": "2025-10-07T10:30:15Z",
  "userId": "emp_123456",
  "action": "UPDATE",
  "tableName": "employees",
  "recordId": "emp_789012",
  "changes": {
    "department_id": {
      "before": "dept_001",
      "after": "dept_002"
    }
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

#### ログ保管期間

| ログ種別 | 保管期間 |
|---------|---------|
| 操作ログ | 7年 |
| アクセスログ | 1年 |
| エラーログ | 3ヶ月 |
| パフォーマンスログ | 1ヶ月 |

### 脆弱性対策

#### OWASP Top 10対策

| 脆弱性 | 対策 | 実装状況 |
|-------|------|---------|
| インジェクション | Prisma ORM（パラメータ化） | ✅ |
| 認証の不備 | JWT + Bearer Token | ✅ |
| 機密データ露出 | 暗号化 + 同意管理 | ✅ |
| XXE | JSONのみ使用 | ✅ |
| アクセス制御 | 権限レベル13段階 | ✅ |
| セキュリティ設定ミス | デフォルト設定見直し | ✅ |
| XSS | React自動エスケープ | ✅ |
| 安全でないデシリアライゼーション | 入力検証 | ✅ |
| 既知の脆弱性 | 依存関係定期更新 | ✅ |
| ログ・監視不足 | 監査ログ実装 | ✅ |

#### セキュリティヘッダー

```typescript
// Next.js設定
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];
```

---

## 運用管理

### バックアップ戦略

#### 自動バックアップ

**スケジュール**:
```yaml
フルバックアップ: 毎日3:00 AM
差分バックアップ: 6時間ごと
トランザクションログ: 15分ごと
```

**保管期間**:
- 日次バックアップ: 30日
- 週次バックアップ: 3ヶ月
- 月次バックアップ: 7年

**保管場所**:
- プライマリ: AWS S3（東京リージョン）
- セカンダリ: AWS S3（大阪リージョン）

#### リストア手順

```bash
# データベースリストア
psql -U postgres -d staff_medical < backup_2025-10-07.sql

# ファイルリストア
aws s3 sync s3://backup-bucket/2025-10-07/ /var/data/restore/
```

### モニタリング

#### システム監視

**監視項目**:
- CPU使用率（閾値: 80%）
- メモリ使用率（閾値: 85%）
- ディスク使用率（閾値: 90%）
- API応答時間（閾値: 500ms）
- エラー率（閾値: 1%）

**アラート通知**:
- メール通知（重要度: 高）
- Slack通知（全アラート）
- SMS通知（緊急）

#### アプリケーション監視

**New Relic（計画）**:
- APM（Application Performance Monitoring）
- エラートラッキング
- トランザクション分析
- ユーザー体験監視

### パフォーマンス最適化

#### データベース最適化

**インデックス戦略**:
```sql
-- 頻繁に検索される列にインデックス
CREATE INDEX idx_employee_code ON employees(employee_code);
CREATE INDEX idx_evaluation_period ON evaluations(employee_id, period);
CREATE INDEX idx_interview_date ON interviews(employee_id, interview_date);
CREATE INDEX idx_health_checkup ON health_records(employee_id, checkup_date);
```

**クエリ最適化**:
- N+1問題の排除（Prismaの`include`活用）
- ページネーション実装
- キャッシュ戦略（Redis検討中）

#### フロントエンド最適化

**Next.js最適化**:
- 画像最適化（next/image）
- Code Splitting（動的インポート）
- 静的生成（ISR: Incremental Static Regeneration）
- フォント最適化（next/font）

**パフォーマンス目標**:
- First Contentful Paint: < 1.8秒
- Largest Contentful Paint: < 2.5秒
- Time to Interactive: < 3.8秒
- Cumulative Layout Shift: < 0.1

### 災害対策（DR: Disaster Recovery）

#### RTO/RPO目標

| システム | RTO | RPO |
|---------|-----|-----|
| 医療職員管理システム | 4時間 | 15分 |
| データベース | 2時間 | 15分 |
| VoiceDrive連携 | 8時間 | 1時間 |

#### DR手順

1. **障害検知** (5分以内)
2. **影響範囲確認** (15分以内)
3. **代替環境起動** (1時間以内)
4. **データリストア** (2時間以内)
5. **動作確認** (3時間以内)
6. **サービス再開** (4時間以内)

---

## 開発ガイド

### ローカル開発環境セットアップ

#### 必要要件

```yaml
Node.js: 20.x以上
npm: 10.x以上
Git: 2.x以上
エディタ: VS Code推奨
```

#### セットアップ手順

```bash
# 1. リポジトリクローン
git clone https://github.com/medical-org/staff-medical-system.git
cd staff-medical-system

# 2. 依存関係インストール
npm install

# 3. 環境変数設定
cp .env.example .env.local

# 4. データベースセットアップ
npx prisma generate
npx prisma db push

# 5. 開発サーバー起動
npm run dev
```

#### .env.local設定例

```env
# データベース
DATABASE_URL="file:./dev.db"

# 認証
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="24h"

# VoiceDrive連携
VOICEDRIVE_API_URL="http://localhost:4000"
VOICEDRIVE_API_KEY="test-api-key"
VOICEDRIVE_WEBHOOK_SECRET="webhook-secret"

# 管理者
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

### テスト実行

#### 単体テスト

```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジレポート
npm run test:coverage
```

#### 統合テスト

```bash
# Phase 3統合テスト
node tests/integration/phase3-integration-test.js

# 本番環境接続テスト（DB構築後）
node tests/production/production-connection-test.js
```

#### テストデータ投入

```bash
# シードデータ投入
npx prisma db seed
```

### コーディング規約

#### TypeScript

```typescript
// ✅ Good
interface Staff {
  id: string;
  name: string;
  email: string;
}

async function getStaff(id: string): Promise<Staff> {
  return await prisma.employee.findUnique({
    where: { id }
  });
}

// ❌ Bad
function getStaff(id) {
  return prisma.employee.findUnique({
    where: { id }
  });
}
```

#### React

```tsx
// ✅ Good
export default function StaffCard({ staff }: { staff: Staff }) {
  return (
    <div className="p-4 border rounded">
      <h3>{staff.name}</h3>
      <p>{staff.email}</p>
    </div>
  );
}

// ❌ Bad
export default function StaffCard(props) {
  return (
    <div style={{ padding: '16px', border: '1px solid #ccc' }}>
      <h3>{props.staff.name}</h3>
      <p>{props.staff.email}</p>
    </div>
  );
}
```

#### ファイル命名規則

```
コンポーネント: PascalCase.tsx
ユーティリティ: kebab-case.ts
API Route: route.ts
型定義: kebab-case.ts
```

### デプロイ

#### Vercel（フロントエンド）

```bash
# Vercel CLIインストール
npm install -g vercel

# ログイン
vercel login

# デプロイ（本番）
vercel --prod
```

#### AWS Lightsail（バックエンド・DB）

**Phase 6で実装予定**

```bash
# Lightsailインスタンス起動
aws lightsail create-instances \
  --instance-names medical-system-app \
  --availability-zone ap-northeast-1a \
  --blueprint-id ubuntu_22_04 \
  --bundle-id medium_2_0

# RDSデータベース作成
aws lightsail create-relational-database \
  --relational-database-name medical-db \
  --relational-database-blueprint-id postgres_14 \
  --relational-database-bundle-id micro_2_0 \
  --master-database-name medical_system \
  --master-username dbadmin
```

### トラブルシューティング

#### よくある問題

**問題1**: `prisma:error Error: P1001: Can't reach database server`

**解決策**:
```bash
# データベース再生成
npx prisma generate
npx prisma db push --force-reset
```

**問題2**: `Module not found: Can't resolve '@/components/...'`

**解決策**:
```bash
# node_modules削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

**問題3**: ビルドエラー `Type error: ...`

**解決策**:
```bash
# TypeScriptキャッシュクリア
rm -rf .next
npm run build
```

---

## 付録

### 用語集

| 用語 | 説明 |
|-----|------|
| 2軸評価 | 施設内評価と法人全体評価の2つの軸で評価する方式 |
| 動機タイプ | 職員のモチベーション源泉を6タイプに分類したもの |
| Phase | 開発フェーズ（Phase 0〜7） |
| パーセンタイル | 全体における相対的な位置（上位何%か） |
| JNAラダー | 日本看護協会の看護実践能力評価基準 |
| 施設別権限 | 施設ごとに異なる役職・権限体系 |
| Webhook | イベント発生時にHTTP POSTで通知する仕組み |
| MCP | Model Context Protocol（Claudeとの連携プロトコル） |

### 参考資料

**内部ドキュメント**:
- [Phase 3実装完了報告書](docs/Phase3_実装作業完了報告書_FINAL.md)
- [Lightsail統合マスタープラン](mcp-shared/lightsail-integration-master-plan-20250920.md)
- [データベース設計](prisma/schema.prisma)
- [サイトマップ](SITEMAP.md)

**外部リソース**:
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Prisma公式ドキュメント](https://www.prisma.io/docs)
- [AWS Lightsail公式ドキュメント](https://docs.aws.amazon.com/lightsail/)

### 変更履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|-----------|------|---------|--------|
| 1.0.0 | 2025-10-07 | 初版作成 | 医療システムチーム |

---

**最終更新**: 2025年10月7日
**文書管理**: 医療法人厚生会 医療システムチーム
**問い合わせ**: medical-system@example.com
