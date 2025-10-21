# Phase 2 Lightsail Public Folder 実装ガイド

**文書番号**: MED-TECH-LIGHTSAIL-2025-1021-001
**作成日**: 2025年10月21日
**対象**: 医療システムチーム
**目的**: 職員顔写真をLightsail Public Folderで配信（追加費用¥0）

---

## 📋 概要

### 採用した構成

**Lightsail Public Folder方式**（CloudFrontは不使用）

```
Lightsail 80ドルプラン
  ├── Next.jsアプリケーション
  ├── PostgreSQLデータベース（将来）
  └── 📁 public/employees/ フォルダ（顔写真配信）
```

### 理由

- ✅ **追加費用¥0**（Lightsail 80ドルプラン内で完結）
- ✅ **日本国内500名規模に最適**
- ✅ **設定が超簡単**（30分で完了）
- ✅ **Next.jsの標準機能**（特別な設定不要）

---

## 🎯 前提条件

### 既存リソース

- Lightsail 80ドルプラン契約予定
- Next.jsアプリケーション（本プロジェクト）
- 利用規模: 日本国内、社内500名

### 不要なもの（コスト削減）

- ❌ AWS S3バケット（不要）
- ❌ CloudFront Distribution（不要）
- ❌ 追加のAWSサービス（不要）

---

## 📝 実装手順

### ✅ Step 1: public/employees/ フォルダ作成（完了）

```bash
# プロジェクトルートで実行
mkdir -p public/employees
```

**結果**:
```
public/
  └── employees/
      └── .gitkeep
```

### ✅ Step 2: .gitignore設定（完了）

個人情報保護のため、画像ファイルをGitにコミットしない設定を追加しました。

```gitignore
# Phase 2: 顔写真統合 - 個人情報保護
/public/employees/*.jpg
/public/employees/*.jpeg
/public/employees/*.png
/public/employees/*.gif
/public/employees/*.webp

# .gitkeepは除外しない（フォルダ構造を維持）
!/public/employees/.gitkeep
```

### Step 3: テスト画像の準備

#### 3.1 テスト画像作成（3枚）

**画像仕様**:
- ファイル名: `TEST-001.jpg`, `TEST-002.jpg`, `TEST-003.jpg`
- サイズ: 400x400ピクセル
- 形式: JPEG
- 品質: 85%
- ファイルサイズ: 約200KB以下

**作成方法**:

オプション1: オンラインツール
```
https://placeholder.com/400x400
→ 400x400の画像を生成してダウンロード
```

オプション2: ImageMagickコマンド
```bash
# ImageMagickがインストールされている場合
convert -size 400x400 -background lightblue -gravity center \
  -pointsize 72 label:"TEST-001" public/employees/TEST-001.jpg

convert -size 400x400 -background lightgreen -gravity center \
  -pointsize 72 label:"TEST-002" public/employees/TEST-002.jpg

convert -size 400x400 -background lightyellow -gravity center \
  -pointsize 72 label:"TEST-003" public/employees/TEST-003.jpg
```

オプション3: 手動で画像を配置
```
public/employees/TEST-001.jpg  ← 任意の400x400画像
public/employees/TEST-002.jpg
public/employees/TEST-003.jpg
```

#### 3.2 配置確認

```bash
ls -lh public/employees/

# 期待される出力:
# .gitkeep
# TEST-001.jpg  (約200KB)
# TEST-002.jpg  (約200KB)
# TEST-003.jpg  (約200KB)
```

### Step 4: ローカル動作確認

#### 4.1 開発サーバー起動

```bash
npm run dev
```

#### 4.2 ブラウザで確認

```
http://localhost:3000/employees/TEST-001.jpg
http://localhost:3000/employees/TEST-002.jpg
http://localhost:3000/employees/TEST-003.jpg
```

**期待される結果**: 各画像が表示される

### Step 5: 環境変数設定（将来のWebhook用）

`.env`ファイルに以下を追加（DB構築後に使用）:

```env
# ================================================================================
# Phase 2: 顔写真統合 - Lightsail Public Folder方式
# ================================================================================

# 画像配信ベースURL（Lightsailデプロイ後に実際のドメインに変更）
NEXT_PUBLIC_EMPLOYEE_PHOTO_BASE_URL="https://medical-system.example.com"

# VoiceDrive Webhookエンドポイント（DB構築後に使用）
VOICEDRIVE_WEBHOOK_ENDPOINT_TEST="http://voicedrive-test.example.com/api/webhooks/medical-system/employee"
VOICEDRIVE_WEBHOOK_ENDPOINT_PROD="https://voicedrive.example.com/api/webhooks/medical-system/employee"

# Webhook Secret（後日VoiceDriveチームと共有）
MEDICAL_WEBHOOK_SECRET=""
```

---

## 🚀 Lightsailデプロイ手順（将来）

### デプロイ時の注意事項

1. **画像ファイルも一緒にアップロード**
   ```bash
   # ビルド
   npm run build

   # Lightsailにデプロイ（既存の手順）
   # public/employees/*.jpg も含める
   ```

2. **実際のドメインでURL確認**
   ```
   https://your-lightsail-domain.com/employees/TEST-001.jpg
   ```

3. **環境変数更新**
   ```env
   NEXT_PUBLIC_EMPLOYEE_PHOTO_BASE_URL="https://your-lightsail-domain.com"
   ```

---

## 📊 パフォーマンス試算

### 日本国内500名の負荷

| 項目 | 数値 |
|------|------|
| 職員数 | 500名 |
| 1日あたりの画像閲覧数 | 500名 × 10回 = 5,000回 |
| 1画像サイズ | 200KB |
| 1日あたりの転送量 | 5,000回 × 200KB = 1GB/日 |
| **月間転送量** | **30GB/月** |

**Lightsail 80ドルプランの転送枠**: 5-7TB/月（推定）
**使用率**: 30GB ÷ 5000GB = **0.6%**（余裕）

---

## 🔒 セキュリティ対策

### 現在の設定（推奨）

```
public/employees/ フォルダは誰でもアクセス可能
```

**メリット**:
- シンプル、高速
- Next.jsの標準機能

**リスク**:
- URLを知っていれば誰でも閲覧可能
- 社内500名規模なら許容範囲

### 将来の強化（オプション）

DB構築後、Next.js API Routeで認証を追加可能:

```typescript
// src/app/api/employees/[staffId]/photo/route.ts
export async function GET(
  request: Request,
  { params }: { params: { staffId: string } }
) {
  // セッション認証チェック
  const session = await getServerSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 画像ファイルを返す
  const imagePath = path.join(process.cwd(), 'public', 'employees', `${params.staffId}.jpg`);
  const imageBuffer = await fs.readFile(imagePath);

  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400', // 24時間キャッシュ
    }
  });
}
```

**URL**: `https://medical-system.example.com/api/employees/EMP-2024-001/photo`

---

## 📝 VoiceDrive側のURL形式

### 旧仕様（CloudFront前提）

```typescript
profilePhotoUrl: "https://d2k8x5j9m1n4p7.cloudfront.net/employees/EMP-2024-001.jpg"
```

### 新仕様（Lightsail Public Folder）

```typescript
profilePhotoUrl: "https://medical-system.example.com/employees/EMP-2024-001.jpg"
```

**変更点**: ドメインのみ（VoiceDrive側の実装は変更不要）

---

## 💰 コスト比較

| 構成 | 月額コスト | メリット | デメリット |
|------|----------|---------|----------|
| **Lightsail Public Folder** | **¥0** | 設定簡単、追加費用なし | CDNなし |
| Lightsail Object Storage | $5（¥750） | 専用ストレージ | 追加費用 |
| S3 + CloudFront | ¥150-¥272 | グローバルCDN | 設定複雑、追加費用 |

**結論**: 日本国内500名なら、Lightsail Public Folderで十分！

---

## 🎯 次のステップ（DB構築後）

### Phase 1: DB構築後の実装（将来）

1. **Webhook送信実装**
   - `src/lib/webhooks/phase2-photo-webhook.ts`（既存コード活用）
   - `employee.created`, `employee.photo.updated`, `employee.photo.deleted`

2. **実際の職員データ投入**
   - 既存300-500名分の画像アップロード
   - `public/employees/EMP-2024-001.jpg` 形式

3. **VoiceDriveチームとの統合テスト**
   - Webhook送信テスト
   - 画像URL疎通確認

### Phase 2: 本番運用

1. **モニタリング**
   - Lightsail転送量監視
   - エラーログ確認

2. **画像最適化（オプション）**
   - Next.js Image Optimization適用
   - WebP形式への変換検討

---

## ✅ チェックリスト

### 実装完了確認

- [x] `public/employees/` フォルダ作成
- [x] `.gitignore` 設定追加
- [ ] テスト画像3枚配置
- [ ] ローカル動作確認（`http://localhost:3000/employees/TEST-001.jpg`）
- [ ] VoiceDriveチームへの連絡書送付

### DB構築後のタスク

- [ ] Webhook実装
- [ ] 環境変数設定（実際のドメイン）
- [ ] 本番画像アップロード（300-500枚）
- [ ] 統合テスト実施

---

## 📞 トラブルシューティング

### 画像が表示されない

**症状**: `http://localhost:3000/employees/TEST-001.jpg` で404エラー

**対処法**:
1. ファイルが正しく配置されているか確認
   ```bash
   ls -la public/employees/
   ```
2. 開発サーバーを再起動
   ```bash
   npm run dev
   ```
3. ブラウザキャッシュをクリア（Ctrl+Shift+R）

### .gitignoreが効かない

**症状**: 画像ファイルがGitにコミットされる

**対処法**:
```bash
# Gitキャッシュをクリア
git rm -r --cached public/employees/*.jpg
git add .
git commit -m "fix: Update .gitignore for employee photos"
```

---

## 📚 関連ドキュメント

1. **VoiceDriveチームへの連絡書**
   - `mcp-shared/docs/Phase2_Lightsail_Public_Folder_Notification_20251021.md`
   - CloudFront不使用の通知、URL形式変更

2. **旧CloudFront設定手順書**（参考・不使用）
   - `docs/Phase2_CloudFront_Setup_Guide.md`

3. **共通DB構築後作業再開指示書**
   - `docs/共通DB構築後_作業再開指示書_20250928.md`
   - Webhook実装はDB構築後に実施

---

**作成者**: 医療職員カルテシステム開発チーム
**作成日**: 2025年10月21日
**最終更新**: 2025年10月21日

---

**END OF DOCUMENT**
