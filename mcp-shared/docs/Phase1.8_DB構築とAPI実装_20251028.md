# Phase 1.8: DB構築とAPI実装【新規追加】🆕

**文書番号**: MP-PHASE1.8-2025-1028-001
**作成日**: 2025年10月28日
**優先度**: 🔴 **最高優先**（Phase 2以降の全機能の前提条件）
**担当**: 医療システムチーム
**推定工数**: **8-10日**（DB構築5-7日 + API実装1日 + テスト2日）

---

## 📋 目次

1. [Phase概要](#phase概要)
2. [実装背景](#実装背景)
3. [DB構築計画（Week 1-8）](#db構築計画week-1-8)
4. [API実装計画](#api実装計画)
5. [実装手順](#実装手順)
6. [成功判定基準](#成功判定基準)
7. [リスク管理](#リスク管理)
8. [次フェーズへの影響](#次フェーズへの影響)

---

## 1. Phase概要

### 1-1. 目的

**医療システムの本番データベースを構築し、全APIエンドポイントをDB接続に切り替える**

現在、医療システムは以下の状態です：
- ✅ Prisma schema.prisma完成（770行、全テーブル定義済み）
- ✅ APIエンドポイント実装済み（モックデータで動作中）
- ✅ Prisma DBレイヤー部分実装（`InterviewReservationDb`等）
- ⚠️ **DBサーバー未構築**（モックデータ使用中）
- ⚠️ **API-DB接続未完了**（TODOコメント状態）

このPhaseで、**DB構築→API接続→統合テスト**を完了させ、Phase 2以降の全機能の基盤を確立します。

---

### 1-2. 実装範囲

| 項目 | 内容 | 工数 |
|------|------|------|
| **DB構築** | MySQL本番環境構築、テーブル作成、マスターデータ投入 | 5-7日 |
| **API実装** | モックデータをPrisma接続に切り替え | 1日 |
| **統合テスト** | 全API動作確認、パフォーマンステスト | 2日 |

---

### 1-3. 成果物

| No. | 成果物 | 説明 |
|-----|--------|------|
| 1 | **本番MySQLデータベース** | AWS Lightsail上で稼働 |
| 2 | **Prismaスキーママイグレーション完了** | 全テーブル作成完了 |
| 3 | **マスターデータ投入完了** | 施設、部署、職位、職員500名 |
| 4 | **API-DB接続完了** | 全APIがPrisma経由でDB接続 |
| 5 | **統合テスト完了報告書** | 全API動作確認済み |
| 6 | **バックアップ体制確立** | 毎日自動バックアップ稼働 |

---

## 2. 実装背景

### 2-1. 現状の課題

#### ❌ **モックデータの限界**
```typescript
// 現在のAPI実装（例: 面談予約API）
let reservations: UnifiedInterviewReservation[] = [
  // ハードコードされたモックデータ
  { id: 'REGULAR-001', staffName: '田中 花子', ... }
];

export async function GET(request: NextRequest) {
  // メモリ上のデータを返すだけ
  return NextResponse.json({ data: reservations });
}
```

**問題点**:
- ❌ データ永続化なし（サーバー再起動で消失）
- ❌ トランザクション管理なし
- ❌ データ整合性なし
- ❌ スケーラビリティなし
- ❌ VoiceDriveとのデータ連携不可

---

#### ✅ **DB構築後の理想状態**
```typescript
// DB接続後のAPI実装
import { InterviewReservationDb } from '@/lib/database/interviewReservationDb';

export async function GET(request: NextRequest) {
  const data = await InterviewReservationDb.findMany(filters);
  return NextResponse.json({ success: true, data });
}
```

**改善点**:
- ✅ データ永続化（MySQL）
- ✅ トランザクション管理（Prisma）
- ✅ データ整合性保証（外部キー制約）
- ✅ スケーラビリティ（500名→5000名対応可能）
- ✅ VoiceDriveとのデータ連携（Webhook、API経由）

---

### 2-2. 準備状況（現在100%完了）

| 項目 | 状態 | 詳細 |
|------|------|------|
| **Prisma Schema定義** | ✅ 100%完成 | 770行、全テーブル定義済み |
| **DB構築計画書** | ✅ 100%完成 | Week 1-8の詳細計画あり |
| **Prisma DBレイヤー** | ⚠️ 30%完成 | `InterviewReservationDb`のみ実装 |
| **APIエンドポイント** | ✅ 100%完成 | モックデータで動作中 |
| **フロントエンド** | ✅ 100%完成 | APIサービス実装済み |

---

## 3. DB構築計画（Week 1-8）

### 3-1. 段階的構築スケジュール

**参照**: [DB構築前確認書_最終版_20251002.md](./DB構築前確認書_最終版_20251002.md)

#### **Week 1（1-2日）: 環境準備・マスターデータ構築**

**目標**: データベースサーバー準備、基本テーブル作成

| 作業内容 | 工数 | 成果物 |
|---------|------|--------|
| AWS Lightsail MySQL申請・設定 | 2時間 | サーバーアクセス情報 |
| `.env`ファイル設定（DATABASE_URL） | 1時間 | 接続情報設定完了 |
| `prisma migrate dev`実行 | 1時間 | 全テーブル作成完了 |
| 施設マスターデータ投入 | 1時間 | 3施設（小原病院、立神リハビリ、エスポワール立神） |
| 部署マスターデータ投入 | 2時間 | 30部署以上 |
| 職位マスターデータ投入 | 1時間 | 11職位 |

**Week 1完了条件**:
- ✅ データベースに接続できる
- ✅ 3つのマスターテーブルが作成されている
- ✅ 小原病院・立神リハビリ・エスポワール立神のデータが入っている
- ✅ バックアップが取得できる

---

#### **Week 2（2-3日）: 職員基本情報構築**

**目標**: 職員500名分のデータ投入

| 作業内容 | 工数 | 成果物 |
|---------|------|--------|
| 事務局提供データのクレンジング | 4時間 | 整形済みExcelデータ |
| 職員データ投入（100名ずつ） | 6時間 | 500名投入完了 |
| データ検証（重複チェック等） | 2時間 | 検証レポート |
| 配属情報投入 | 4時間 | 配属情報完成 |

**Week 2完了条件**:
- ✅ 500名の職員データが投入されている
- ✅ メールアドレス・職員番号に重複がない
- ✅ 全職員に配属情報が紐づいている
- ✅ 施設別・部署別の職員数が事務局提供データと一致

---

#### **Week 3-4（2-3日）: コア機能DB構築**

**対象機能**:
- キャリアコース選択制度（Phase 5）
- 面談予約システム
- 面談記録管理

**Week 3-4完了条件**:
- ✅ A～Dコース定義が投入されている
- ✅ 職員のコース選択情報が投入されている（任意）
- ✅ 面談予約のテストデータが投入されている
- ✅ フロントエンドから面談予約が作成できる

---

#### **Week 5-6（1-2日）: 機能別順次構築**

**対象機能**:
- 人事評価システム
- 健康管理システム
- 研修管理システム

**Week 5-6完了条件**:
- ✅ 評価システムのテストデータ投入
- ✅ 健康診断のサンプルデータ投入
- ✅ 研修プログラムのマスターデータ投入
- ✅ フロントエンドから各機能が利用できる

---

#### **Week 7-8（1日）: 統合・最適化**

**作業内容**:
- 全機能の統合テスト
- パフォーマンスチューニング
- インデックス最適化
- バックアップ・リストア確認
- VoiceDrive連携テスト

**Week 7-8完了条件**:
- ✅ 全テーブルが正常に動作
- ✅ 500名分のデータで性能問題なし
- ✅ バックアップ・リストアが正常動作
- ✅ VoiceDriveとのAPI連携成功
- ✅ セキュリティ監査合格

---

### 3-2. DB構築工数見積もり

| Week | 作業内容 | 工数 |
|------|---------|------|
| Week 1 | 環境準備・マスターデータ | 1-2日 |
| Week 2 | 職員基本情報（500名） | 2-3日 |
| Week 3-4 | コア機能（面談・評価） | 2-3日 |
| Week 5-6 | 機能別構築 | 1-2日 |
| Week 7-8 | 統合・最適化 | 1日 |
| **合計** | - | **7-11日** → **実質5-7営業日** |

---

## 4. API実装計画

### 4-1. API接続作業（1日）

現在のモックデータをPrisma接続に切り替えます。

#### **面談予約API接続（2時間）**

**修正ファイル（4ファイル）**:
1. `src/app/api/interviews/reservations/route.ts`
2. `src/app/api/interviews/reservations/[id]/route.ts`
3. `src/app/api/interviews/reservations/bulk/route.ts`
4. `src/app/api/interviews/reservations/stats/route.ts`

**修正内容**:
```typescript
// ❌ 削除：モックデータ
// let reservations: UnifiedInterviewReservation[] = [];

// ✅ 追加：Prisma接続
import { InterviewReservationDb } from '@/lib/database/interviewReservationDb';

export async function GET(request: NextRequest) {
  const filters = extractFilters(request);
  const data = await InterviewReservationDb.findMany(filters);
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const created = await InterviewReservationDb.create(body);
  return NextResponse.json({ success: true, data: created });
}
```

---

#### **他のAPI接続（評価、健康管理等）（6時間）**

**必要な作業**:

1. **Prisma DBレイヤー作成**（4時間）
   - `evaluationDb.ts` - 評価管理
   - `healthDb.ts` - 健康管理
   - `trainingDb.ts` - 研修管理
   - `careerCourseDb.ts` - キャリアコース

2. **APIルート接続**（2時間）
   - モックデータ部分をPrisma呼び出しに変更

---

### 4-2. API実装工数見積もり

| 作業内容 | 工数 | 備考 |
|---------|------|------|
| 面談予約API接続 | 2時間 | 4ファイル修正 |
| Prisma DBレイヤー作成 | 4時間 | 4ファイル新規作成 |
| 他のAPI接続 | 2時間 | パターン流用で高速化 |
| **合計** | **8時間** | **1営業日** |

---

## 5. 実装手順

### 5-1. 構築開始前チェックリスト（必須）

**参照**: [DB構築前確認書_最終版_20251002.md - 第5部 5.1](./DB構築前確認書_最終版_20251002.md#51-構築開始前チェックリスト)

| No. | 確認項目 | 確認者 | 状態 |
|-----|---------|--------|------|
| 1 | データベースサーバーが準備されている | 医療チーム | ⬜ |
| 2 | MySQLバージョンが8.0以上である | 医療チーム | ⬜ |
| 3 | データベース接続設定（.env）が完了している | 医療チーム | ⬜ |
| 4 | バックアップディレクトリが作成されている | 医療チーム | ⬜ |
| 5 | 事務局から職員情報が提供されている | 事務局 | ⬜ |
| 6 | VoiceDriveチームとDB統合方針が合意されている | VoiceDriveチーム | ⬜ |
| 7 | ロールバック手順書が作成されている | 医療チーム | ⬜ |
| 8 | 個人情報保護対策が完了している | 両チーム | ⬜ |
| 9 | 構築スケジュールが承認されている | 事務局 | ⬜ |
| 10 | 緊急連絡体制が確立されている | 両チーム | ⬜ |

**全項目✅で構築開始可能**

---

### 5-2. DB構築手順（Week 1-8）

#### **Step 1: 環境準備（Week 1 - 1-2日）**

1. **AWS Lightsail MySQL申請**
   ```bash
   # Lightsail管理画面で作成
   # プラン: $15/月（1GB RAM、40GB Storage）
   # バージョン: MySQL 8.0
   ```

2. **`.env`ファイル設定**
   ```bash
   DATABASE_URL="mysql://admin:SecureP@ssw0rd!@ls-abc123.xxx.rds.amazonaws.com:3306/staff_medical_system"
   ```

3. **Prisma Migrate実行**
   ```bash
   npx prisma migrate dev --name init
   # 全テーブルが作成される
   ```

4. **マスターデータ投入**
   ```bash
   node scripts/seed-master-data.js
   # 施設3件、部署30件、職位11件が投入される
   ```

---

#### **Step 2: 職員データ投入（Week 2 - 2-3日）**

1. **事務局提供データ受領**
   - Excelファイル受領（職員500名分）
   - データクレンジング（重複チェック、形式統一）

2. **データ投入スクリプト実行**
   ```bash
   node scripts/import-staff-data.js
   # 500名の職員データが投入される
   ```

3. **データ検証**
   ```sql
   SELECT COUNT(*) FROM employees; -- 500件確認
   SELECT COUNT(*) FROM staff_assignments; -- 500件確認
   ```

---

#### **Step 3: コア機能DB構築（Week 3-4 - 2-3日）**

1. **キャリアコースデータ投入**
   ```bash
   node scripts/seed-career-courses.js
   # A～Dコース定義が投入される
   ```

2. **面談予約テストデータ投入**
   ```bash
   node scripts/seed-interview-test-data.js
   # 面談予約テストデータ10件が投入される
   ```

---

#### **Step 4: 機能別DB構築（Week 5-6 - 1-2日）**

1. **評価・健康・研修データ投入**
   ```bash
   node scripts/seed-evaluation-data.js
   node scripts/seed-health-data.js
   node scripts/seed-training-data.js
   ```

---

#### **Step 5: 統合・最適化（Week 7-8 - 1日）**

1. **統合テスト実行**
   ```bash
   npm run test:integration
   ```

2. **パフォーマンステスト**
   ```bash
   npm run test:performance
   ```

3. **バックアップテスト**
   ```bash
   ./scripts/backup-test.sh
   ```

---

### 5-3. API実装手順（1日）

#### **Step 1: Prisma DBレイヤー作成（4時間）**

1. **evaluationDb.ts 作成**
   ```typescript
   // src/lib/database/evaluationDb.ts
   import prisma from './prisma';

   export class EvaluationDb {
     static async create(data) { /* ... */ }
     static async findById(id) { /* ... */ }
     static async findMany(filters) { /* ... */ }
     // ...
   }
   ```

2. **healthDb.ts, trainingDb.ts, careerCourseDb.ts 作成**
   - `InterviewReservationDb`のパターンを流用

---

#### **Step 2: APIルート接続（4時間）**

1. **面談予約API接続（2時間）**
   ```typescript
   // src/app/api/interviews/reservations/route.ts
   import { InterviewReservationDb } from '@/lib/database/interviewReservationDb';

   export async function GET(request: NextRequest) {
     const data = await InterviewReservationDb.findMany(filters);
     return NextResponse.json({ success: true, data });
   }
   ```

2. **他のAPI接続（2時間）**
   - 評価API、健康管理API、研修API、キャリアコースAPI

---

### 5-4. 統合テスト手順（2日）

#### **Day 1: 機能テスト**

1. **全APIエンドポイント動作確認**
   - 面談予約CRUD
   - 評価CRUD
   - 健康管理CRUD
   - 研修管理CRUD

2. **データ整合性確認**
   - 外部キー制約
   - トランザクション
   - バリデーション

---

#### **Day 2: パフォーマンステスト**

1. **負荷テスト**
   - 500名同時アクセス
   - 応答時間 < 1秒

2. **VoiceDrive連携テスト**
   - Webhook送信
   - API呼び出し

---

## 6. 成功判定基準

### 6-1. DB構築成功判定

| No. | 判定項目 | 判定基準 | 判定 |
|-----|---------|---------|------|
| 1 | 全テーブルが作成されている | Prisma schema通り | ⬜ |
| 2 | マスターデータが投入されている | 施設3件、部署30件、職位11件 | ⬜ |
| 3 | 職員データが投入されている | 500名 | ⬜ |
| 4 | データ整合性が保証されている | 外部キー制約エラーなし | ⬜ |
| 5 | バックアップが取得できる | 毎日自動バックアップ稼働 | ⬜ |

---

### 6-2. API実装成功判定

| No. | 判定項目 | 判定基準 | 判定 |
|-----|---------|---------|------|
| 1 | 全APIがDB接続済み | モックデータ削除完了 | ⬜ |
| 2 | CRUD操作が正常動作 | CREATE/READ/UPDATE/DELETE成功 | ⬜ |
| 3 | エラーハンドリングが正常 | 適切なエラーレスポンス | ⬜ |
| 4 | パフォーマンス基準達成 | 応答時間 < 1秒 | ⬜ |
| 5 | VoiceDrive連携成功 | Webhook送信成功 | ⬜ |

---

### 6-3. 統合テスト成功判定

| No. | 判定項目 | 判定基準 | 判定 |
|-----|---------|---------|------|
| 1 | 全API動作確認完了 | 30エンドポイント以上 | ⬜ |
| 2 | データ整合性テスト合格 | トランザクション正常動作 | ⬜ |
| 3 | 負荷テスト合格 | 500名同時アクセス正常 | ⬜ |
| 4 | VoiceDrive連携テスト合格 | Webhook/API正常動作 | ⬜ |
| 5 | セキュリティ監査合格 | SQL Injection対策等 | ⬜ |

**全項目✅で本番リリース承認**

---

## 7. リスク管理

### 7-1. 想定リスクと対策

| リスク | 発生確率 | 影響度 | 対策 |
|--------|---------|--------|------|
| データ投入時の重複エラー | 高 | 中 | 事前にデータクレンジング、UNIQUE制約設定 |
| 事務局からのデータ提供遅延 | 中 | 高 | サンプルデータで先行構築、後から実データ投入 |
| VoiceDrive連携不具合 | 中 | 中 | API連携を最後のPhaseに配置、独立動作を優先 |
| パフォーマンス問題（500名で遅い） | 低 | 中 | インデックス最適化、クエリチューニング |
| データベースサーバー障害 | 低 | 高 | 毎日バックアップ、冗長化構成（将来） |
| 個人情報漏洩 | 低 | 最高 | アクセス制限、暗号化、監査ログ |

---

### 7-2. ロールバック手順

#### **レベル1: 軽微な問題（データ不整合等）**
```sql
-- 該当レコードのみ修正
UPDATE staff_basic SET employee_number = 'EMP001_2' WHERE id = 123;
```

#### **レベル2: テーブル単位の問題**
```bash
# バックアップから該当テーブルのみ復元
mysql -u admin -p staff_medical_system < backup_staff_basic_20251015.sql
```

#### **レベル3: Week全体の問題**
```bash
# Week開始時のバックアップから全復元
mysql -u admin -p staff_medical_system < backup_week2_start_20251014.sql
```

#### **レベル4: データベース全体の問題**
```bash
# データベース削除
mysql -u admin -p -e "DROP DATABASE staff_medical_system;"

# データベース再作成
mysql -u admin -p < initial_setup.sql

# 最新バックアップから復元
mysql -u admin -p staff_medical_system < backup_latest.sql
```

---

## 8. 次フェーズへの影響

### 8-1. Phase 2以降の依存関係

**このPhase 1.8は、以下の全Phaseの前提条件です：**

| Phase | 依存内容 | 優先度 |
|-------|---------|--------|
| **Phase 2: 認証システム統合** | 職員マスターDB必須 | 🔴 最高 |
| **Phase 2.5: 顔写真統合** | 職員マスターDB必須 | 🔴 高 |
| **Phase 7: PersonalStation** | 面談・評価データDB必須 | 🔴 高 |
| **Phase 11: InterviewStation** | 面談予約DB必須 | 🔴 高 |
| **Phase 14: HealthStation** | 健康管理DB必須 | 🔴 高 |
| **Phase 18.5: ExecutiveDashboard** | 全データDB必須 | 🟡 中 |

**結論**: **Phase 1.8完了なしには、Phase 2以降の全実装が不可能**

---

### 8-2. VoiceDriveチームへの影響

**DB構築完了後、VoiceDriveチームができること：**

1. ✅ **職員情報API呼び出し**
   - `GET /api/v2/employees/:id`
   - `GET /api/v2/employees`
   - 実データが返却される

2. ✅ **Webhook送信**
   - 面談予約作成Webhook
   - 職員情報更新Webhook
   - 実データがDB保存される

3. ✅ **データ連携テスト**
   - VoiceDrive→医療システム（API呼び出し）
   - 医療システム→VoiceDrive（Webhook送信）

---

## 9. 実装タイムライン

### 9-1. 推奨スケジュール

```
Week 1  (Day 1-2):   環境準備・マスターデータ構築
Week 2  (Day 3-5):   職員基本情報構築（500名）
Week 3-4 (Day 6-8):  コア機能DB構築（面談・評価）
Week 5-6 (Day 9-10): 機能別DB構築（健康・研修）
Week 7-8 (Day 11):   統合・最適化
API実装  (Day 12):   全API接続（8時間）
統合テスト (Day 13-14): 全API動作確認・VoiceDrive連携テスト

合計: 14営業日（約3週間）
```

---

### 9-2. 短縮版スケジュール（優先度高）

**最小限の機能で先行リリース**:

```
Day 1:   環境準備・マスターデータ構築
Day 2-3: 職員基本情報構築（500名）
Day 4:   面談予約DB構築
Day 5:   API実装（面談予約のみ）
Day 6:   統合テスト（面談予約のみ）
Day 7:   VoiceDrive連携テスト

合計: 7営業日（約1.5週間）

⏩ Phase 2開始可能（認証システム統合）
```

**後日追加**:
- 評価・健康・研修DB（追加3-4日）

---

## 10. 次のアクション

### 10-1. 即時実行項目（今週中）

| No. | アクション | 担当 | 期限 | 工数 |
|-----|-----------|------|------|------|
| 1 | AWS Lightsail MySQL申請 | 医療チーム | 10/29 | 2時間 |
| 2 | `.env`ファイル設定 | 医療チーム | 10/29 | 1時間 |
| 3 | 事務局へ職員情報提供依頼送付 | 医療チーム | 10/28 | 1時間 |
| 4 | VoiceDriveチームへDB構築開始通知 | 医療チーム | 10/28 | 0.5時間 |

---

### 10-2. Week 1開始前準備（10/30-11/1）

| No. | アクション | 担当 | 期限 | 工数 |
|-----|-----------|------|------|------|
| 1 | Prisma Migrate実行 | 医療チーム | 11/1 | 1時間 |
| 2 | マスターデータ投入スクリプト作成 | 医療チーム | 11/1 | 2時間 |
| 3 | バックアップ体制構築 | 医療チーム | 11/1 | 2時間 |
| 4 | ロールバック手順書作成 | 医療チーム | 11/1 | 1時間 |

---

### 10-3. DB構築開始判定会議（11/4開催予定）

**参加者**:
- 医療システムチーム
- VoiceDriveチーム
- 事務局責任者

**議題**:
1. 構築開始前チェックリスト10項目の確認
2. 職員情報提供データの確認
3. VoiceDriveチームとDB統合方針の最終確認
4. Week 1開始の可否判断

**判定基準**:
- ✅ 構築開始前チェックリスト10項目が全て✅
- ✅ 事務局からの職員情報提供が完了
- ✅ VoiceDriveチームとのDB統合方針が合意
- ✅ データベースサーバーが準備完了

**構築開始日**: 2025年11月5日（火）（判定会議で承認された場合）

---

## 11. 参照ドキュメント

| No. | ドキュメント名 | 説明 |
|-----|--------------|------|
| 1 | [DB構築前確認書_最終版_20251002.md](./DB構築前確認書_最終版_20251002.md) | DB構築の詳細計画（Week 1-8） |
| 2 | [prisma/schema.prisma](../../prisma/schema.prisma) | 完全なPrismaスキーマ定義（770行） |
| 3 | [src/lib/database/interviewReservationDb.ts](../../src/lib/database/interviewReservationDb.ts) | Prisma DBレイヤーの参考実装 |
| 4 | [src/app/api/interviews/reservations/route.ts](../../src/app/api/interviews/reservations/route.ts) | 現在のモックAPI実装 |
| 5 | [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md) | 統合マスタープラン |

---

## 12. 更新履歴

| 日付 | バージョン | 更新内容 | 更新者 |
|------|-----------|---------|--------|
| 2025-10-28 | 1.0 | 初版作成（Phase 1.8追加） | 医療システムチーム |

---

**文書終了**

*このPhase 1.8は、全システムの基盤となる最重要フェーズです。*
*DB構築完了後、Phase 2以降の全機能実装が可能になります。*
