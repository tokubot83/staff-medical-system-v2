# 面談シート印刷機能 実装指示書

作成日: 2025年8月15日  
文書バージョン: 1.0  
保存先: `C:\projects\staff-medical-system\docs\interview-print-mode-implementation.md`

## 概要
面談管理システムの面談実施タブにおいて、動的に生成された面談シートを印刷用に最適化し、手書き入力に対応する機能の実装指示書です。

## 実装完了フェーズ（フェーズ1〜3）

### フェーズ1: デジタル/印刷モード切り替え機能 ✅ 完了
**実装内容:**
- デジタル入力モードと印刷用表示モードの切り替えボタンを実装
- `isPrintMode` ステート変数による表示モード管理
- モード切り替え時のUI変更処理

**実装ファイル:**
- `src/components/interview/DynamicInterviewFlow.tsx`
- `src/components/interview/DynamicInterviewFlow.module.css`

**主要機能:**
1. モード切り替えボタンの表示
2. 印刷モード時は全セクション一括表示
3. デジタルモード時は1セクションずつ表示

### フェーズ2: 印刷用レイアウト最適化 ✅ 完了
**実装内容:**
- A4用紙2枚以内に収まる印刷レイアウト
- 白黒印刷対応の最適化
- 手書き入力用の罫線表示

**印刷仕様:**
- 用紙サイズ: A4
- マージン: 上下8mm、左右10mm
- フォントサイズ: 
  - 本文: 8pt
  - 見出し: 9pt
  - 補足: 7pt
- 罫線: 0.3pt〜0.5pt
- 手書き欄高さ: 14px

**CSS最適化項目:**
```css
@media print {
  - インク節約（アイコン・装飾非表示）
  - 改ページ制御
  - 白黒印刷最適化
  - コンパクトなスペーシング
}
```

### フェーズ3: 印刷プレビュー機能 ✅ 完了
**実装内容:**
- 印刷プレビューモーダルコンポーネント
- A4サイズでの実際のレイアウト表示
- プレビューから直接印刷実行機能

**プレビューモーダル仕様:**
- 最大幅: 900px
- 高さ: 90vh
- A4サイズ表示: 210mm × 297mm
- スクロール可能なコンテンツエリア

**UIコンポーネント:**
```typescript
- Dialog/DialogContent（shadcn/ui）
- ScrollArea（スクロール領域）
- プレビュー用印刷レイアウト
- 印刷実行ボタン
```

## 未実装フェーズ（フェーズ4）

### フェーズ4: QRコード付与機能（バックエンド構築時実装予定）

#### 実装目的
印刷された紙の面談シートをデジタルデータと紐付け、手書き入力された内容をシステムに取り込み可能にする。

#### 必要な技術要素

**フロントエンド:**
```typescript
// 必要なライブラリ
- qrcode.js または react-qr-code
- 画像処理ライブラリ（QRコード読み取り用）

// 実装箇所
src/components/interview/DynamicInterviewFlow.tsx
- QRコード生成処理
- 印刷シートへのQRコード埋め込み
- QRコードのデザイン調整（サイズ、位置）
```

**バックエンド（要実装）:**
```typescript
// APIエンドポイント
POST /api/interview/generate-qr
- セッションIDの生成
- QRコードデータの生成
- データベースへの紐付け情報保存

GET /api/interview/session/{qr-code}
- QRコードからセッション情報取得
- 面談データの取得

POST /api/interview/upload-handwritten
- 手書きシートのスキャンデータアップロード
- OCR処理（オプション）
- データベースへの保存
```

**データベース設計:**
```sql
-- 印刷セッション管理テーブル
CREATE TABLE print_sessions (
  id VARCHAR(36) PRIMARY KEY,
  qr_code VARCHAR(255) UNIQUE NOT NULL,
  interview_session_id VARCHAR(36) NOT NULL,
  staff_id VARCHAR(36) NOT NULL,
  printed_at TIMESTAMP NOT NULL,
  scanned_at TIMESTAMP,
  status ENUM('printed', 'scanned', 'processed'),
  FOREIGN KEY (interview_session_id) REFERENCES interview_sessions(id),
  FOREIGN KEY (staff_id) REFERENCES staff_members(id)
);

-- 手書きデータ管理テーブル
CREATE TABLE handwritten_responses (
  id VARCHAR(36) PRIMARY KEY,
  print_session_id VARCHAR(36) NOT NULL,
  question_id VARCHAR(36) NOT NULL,
  response_text TEXT,
  response_image BLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (print_session_id) REFERENCES print_sessions(id)
);
```

#### QRコード仕様
- サイズ: 30mm × 30mm
- エラー訂正レベル: M（15%）
- データ形式: `{baseUrl}/interview/session/{uuid}`
- 配置位置: 各ページ右上または左下
- 含める情報:
  - セッションID
  - 面談日時
  - スタッフID
  - ページ番号

#### 実装手順
1. **バックエンドAPI構築**
   - セッション管理API
   - QRコード生成API
   - データ紐付けAPI

2. **フロントエンド実装**
   ```typescript
   // QRコード生成サービス
   class QRCodeService {
     async generateSessionQR(sessionId: string): Promise<string> {
       // QRコード生成ロジック
     }
     
     async embedQRInPrintLayout(qrData: string): void {
       // 印刷レイアウトへの埋め込み
     }
   }
   ```

3. **印刷レイアウト更新**
   - QRコード表示エリアの追加
   - ページごとのQRコード配置
   - 印刷時のQRコード品質確保

4. **スキャンデータ処理**
   - アップロード機能
   - QRコード読み取り
   - データ紐付け処理

#### セキュリティ考慮事項
- QRコードの有効期限設定（72時間）
- アクセス権限の検証
- 個人情報の暗号化
- 監査ログの記録

#### テスト項目
- [ ] QRコード生成の正確性
- [ ] 印刷品質でのQRコード読み取り
- [ ] データ紐付けの整合性
- [ ] セッション有効期限の動作
- [ ] 権限チェックの動作

## 今後の拡張可能性

### 1. OCR機能の追加
- 手書き文字の自動認識
- データ入力の効率化
- 誤認識の修正機能

### 2. デジタルペン対応
- リアルタイム入力
- 筆跡データの保存
- 署名の電子化

### 3. マルチフォーマット対応
- PDF出力
- Excel形式での出力
- カスタムテンプレート

### 4. 音声入力連携
- 音声認識による入力支援
- 面談録音との連携
- 自動文字起こし

## 運用上の注意事項

### 印刷設定
- プリンタ設定で「背景画像を印刷」を有効化
- 用紙サイズはA4を厳守
- 印刷品質は「標準」以上を推奨

### ブラウザ対応
- Chrome/Edge: 完全対応
- Firefox: 対応（一部レイアウト調整必要）
- Safari: 対応（印刷プレビュー要確認）

### パフォーマンス
- 大量セクション（10以上）の場合は印刷前に確認
- 印刷プレビューの表示に時間がかかる場合あり

## 関連ドキュメント
- [面談管理システム仕様書](./interview-management-spec.md)
- [印刷レイアウト設計書](./print-layout-design.md)
- [管理者設定ページ開発メモ](./admin-settings-dev-memo.md)

## 更新履歴
- 2025-08-15: 初版作成（フェーズ1〜3実装完了、フェーズ4仕様策定）