# 面談予約システム データベース構築時実装再開指示書

**作成日**: 2025年1月16日  
**対象システム**: 医療職員管理システム - 面談予約機能  
**現在の状態**: DB構築前の準備完了（フロントエンド・API・スキーマ設計完了）

## 📋 概要

面談予約システムの手動予約機能およびVoiceDrive連携機能のDB構築前準備が完了。
本書はデータベース構築時に実装を再開するための指示書です。

## 🎯 完了済み作業

### 1. フロントエンド実装 ✅
- **統合面談ダッシュボード**
  - `/src/components/interview/UnifiedInterviewDashboard.tsx`
  - 予約一覧表示、フィルタリング、統計表示
  
- **手動予約追加機能**
  - `/src/components/interview/ManualReservationModal.tsx`
  - 電話・対面予約の手動登録
  
- **VoiceDrive連携**
  - `/src/services/voicedriveIntegrationService.ts`
  - 法人SNSからの予約取り込み対応

### 2. APIエンドポイント実装 ✅
```
/api/interviews/reservations/
├── route.ts              # 一覧取得・新規作成
├── [id]/route.ts         # 個別操作（CRUD）
├── bulk/route.ts         # 一括操作
└── stats/route.ts        # 統計情報
```

### 3. データベース設計 ✅
- **Prismaスキーマ定義** (`/prisma/schema.prisma`)
  - InterviewReservation（面談予約）
  - InterviewReservationLog（操作ログ）
  - InterviewNotificationQueue（通知キュー）

- **データ永続化クラス** (`/src/lib/database/interviewReservationDb.ts`)
  - CRUD操作
  - トランザクション処理
  - ログ記録機能

### 4. 開発環境設定 ✅
- `.env`ファイル（SQLite設定）
- `.env.example`（環境変数テンプレート）

## 🚀 DB構築時の実装手順

### Phase 1: データベース初期設定

#### 1.1 PostgreSQL環境の場合
```bash
# 1. .envファイルを更新
DATABASE_URL="postgresql://user:password@localhost:5432/staff_medical_db?schema=public"

# 2. Prismaスキーマを更新
# prisma/schema.prisma の datasource を変更
datasource db {
  provider = "postgresql"  # sqlite から変更
  url      = env("DATABASE_URL")
}

# 3. Prismaクライアント生成
npx prisma generate

# 4. マイグレーション実行
npx prisma migrate deploy --name add_interview_reservations
```

#### 1.2 開発環境（SQLite）の場合
```bash
# 1. Prismaクライアント生成
npx prisma generate

# 2. マイグレーション実行
npx prisma migrate dev --name init

# 3. データ確認
npx prisma studio
```

### Phase 2: APIとDBの接続

#### 2.1 メモリストレージからDB接続への切り替え

**現在の状態**: APIはメモリ内配列を使用
**変更箇所**: `/src/app/api/interviews/reservations/route.ts`

```typescript
// 変更前
let reservations: UnifiedInterviewReservation[] = [];

// 変更後
import { InterviewReservationDb } from '@/lib/database/interviewReservationDb';
```

#### 2.2 各APIエンドポイントの更新

1. **GET /api/interviews/reservations**
```typescript
// データベースから取得
const reservations = await InterviewReservationDb.findMany(filters);
```

2. **POST /api/interviews/reservations**
```typescript
// データベースに保存
const newReservation = await InterviewReservationDb.create(data);
```

3. **PUT/PATCH/DELETE も同様に更新**

### Phase 3: 動作確認テスト

#### 3.1 基本機能テスト
- [ ] 手動予約の新規作成
- [ ] 予約一覧の表示
- [ ] 予約の更新・キャンセル
- [ ] フィルタリング機能
- [ ] 統計情報の表示

#### 3.2 VoiceDrive連携テスト
- [ ] VoiceDriveからの予約取り込み
- [ ] 予約データの同期
- [ ] sourceフィールドによる識別

#### 3.3 ログ・履歴機能テスト
- [ ] 操作ログの記録
- [ ] 予約変更履歴の確認

## 📁 重要ファイル一覧

### スキーマ・DB関連
- `/prisma/schema.prisma` - Prismaスキーマ定義
- `/src/lib/database/prisma.ts` - Prismaクライアント
- `/src/lib/database/interviewReservationDb.ts` - DB操作クラス
- `/docs/database/interview_reservation_schema.md` - DB設計書

### API関連
- `/src/app/api/interviews/reservations/` - APIエンドポイント群
- `/src/services/interviewReservationService.ts` - APIクライアント

### UI関連
- `/src/components/interview/UnifiedInterviewDashboard.tsx` - ダッシュボード
- `/src/components/interview/ManualReservationModal.tsx` - 手動予約モーダル

## ⚠️ 注意事項

### 1. 型定義の同期
- Prismaの型とTypeScriptの型定義を一致させる
- `@prisma/client`の型を活用

### 2. エラーハンドリング
- DB接続エラーの適切な処理
- トランザクション失敗時のロールバック

### 3. パフォーマンス
- インデックスの活用
- N+1問題の回避（include/selectの適切な使用）

## 🔄 残タスク（優先順位順）

### 必須タスク
1. **APIとDBの接続** - メモリからDBへの切り替え
2. **本番環境テスト** - PostgreSQL環境での動作確認

### 将来実装タスク
1. **統合通知システム** - 全体設計後に実装
2. **権限管理機能** - 運用体制決定後に実装
3. **バッチ処理** - 定期的なデータ整理・集計

## 📝 コマンドリファレンス

```bash
# 開発サーバー起動
npm run dev

# Prisma関連
npx prisma generate          # クライアント生成
npx prisma migrate dev       # 開発環境マイグレーション
npx prisma migrate deploy    # 本番環境マイグレーション
npx prisma studio           # GUI管理ツール
npx prisma db push          # スキーマ同期（マイグレーションなし）

# テスト実行
npm test                     # ユニットテスト
npm run test:e2e            # E2Eテスト
```

## 🤝 連絡先・サポート

問題が発生した場合は、以下を確認：
1. `/docs/database/interview_reservation_schema.md` - DB設計詳細
2. 管理者設定ページの開発メモ
3. `/src/services/developmentMemoService.ts` - 開発メモ一覧

---

**次回作業開始時**: 本書の「Phase 1: データベース初期設定」から順番に実行してください。