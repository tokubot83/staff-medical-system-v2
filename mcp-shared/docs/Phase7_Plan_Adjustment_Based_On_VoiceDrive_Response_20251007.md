# Phase 7実装計画の微調整（VoiceDrive回答に基づく）

**作成日：2025年10月7日**
**作成者：職員カルテシステム開発チーム**

---

## 1. VoiceDrive回答の確認結果

VoiceDriveチームからの回答を受領し、マスタープランとの整合性を確認しました。

### 1.1 整合性チェック結果

| 項目 | マスタープラン | VoiceDrive回答 | 整合性 |
|------|--------------|---------------|--------|
| **実装期間** | 7.5日 | 約1週間（7日） | ✅ 一致 |
| **統合テスト日程** | Day 6 | Day 6 | ✅ 一致 |
| **前提条件** | Phase 6完了 | Phase 6完了 | ✅ 一致 |
| **VoiceDrive準備** | 100%完了 | 100%完了 | ✅ 一致 |
| **統計Webhook頻度** | 3種類想定 | リアルタイムのみ | ⚠️ 調整必要 |
| **surveySubCategory** | 記載なし | Phase 7では不要 | ✅ OK |

**結論**：**マスタープラン通りで問題なし**（微調整のみ必要）

---

## 2. 微調整が必要な項目

### 2.1 統計Webhook送信頻度

#### マスタープランでの想定

```typescript
// マスタープランでは3種類のイベントを想定
interface StatsWebhookPayload {
  event: 'stats.updated' | 'stats.hourly' | 'stats.daily';
  // ...
}
```

#### VoiceDriveの実装状況

**現在**: `stats.updated`（リアルタイム）のみ実装済み
**将来**: Phase 8以降で`stats.hourly`, `stats.daily`を実装予定

#### Phase 7での対応方針

**変更不要**：型定義は3種類のまま保持し、Phase 7では`stats.updated`のみ処理する

```typescript
// mcp-shared/interfaces/hr-announcement-api.interface.ts
// 型定義は変更なし（将来の拡張に備える）
export interface StatsWebhookPayload {
  event: 'stats.updated' | 'stats.hourly' | 'stats.daily';  // そのまま
  // ...
}

// src/app/api/voicedrive/stats/route.ts
// 実装では現在サポートされているイベントのみ処理
export async function POST(request: NextRequest) {
  const payload: StatsWebhookPayload = await request.json();

  switch (payload.event) {
    case 'stats.updated':
      // Phase 7で実装
      await saveRealtimeStats(payload);
      break;

    case 'stats.hourly':
    case 'stats.daily':
      // Phase 8以降で実装予定
      console.log(`イベント ${payload.event} は将来実装予定です`);
      return NextResponse.json({
        success: true,
        message: 'Event type not yet supported'
      });
  }

  return NextResponse.json({ success: true });
}
```

**マスタープランへの影響**：なし（そのまま進行可能）

---

### 2.2 surveySubCategoryフィールド

#### VoiceDriveの回答

- Phase 7では**実装不要**（VoiceDrive内部用フィールド）
- API v2.0で将来的に追加検討

#### Phase 7での対応方針

**型定義には含めない**（将来の拡張時に追加）

```typescript
// mcp-shared/interfaces/hr-announcement-api.interface.ts
// Phase 7では以下のフィールドは含めない
export interface MedicalSystemAnnouncementRequest {
  // ...既存フィールド

  // ❌ Phase 7では追加しない
  // surveySubCategory?: 'satisfaction' | 'workenv' | 'education' | ...;
}
```

**マスタープランへの影響**：なし（元々記載なし）

---

### 2.3 お知らせ受信API仕様書の確認

#### VoiceDriveの回答

**既に作成済み**：`VoiceDrive_HR_Announcement_Receive_API_Specification_20251007.md`

#### 現在の状況

**未受領**：MCPサーバー経由でまだ共有されていない可能性

#### 対応アクション

**VoiceDriveチームに確認**：
- ファイルの共有状況を確認
- MCPサーバーの`mcp-shared/docs/`に配置されているか確認
- 未配置の場合は共有依頼

---

## 3. マスタープランの更新（必要に応じて）

### 3.1 更新不要な項目

以下は**現在のマスタープラン通り**で進行可能：

✅ **実装タスク**（8タスク、7.5日）
✅ **技術仕様**（エンドポイント、認証、データモデル）
✅ **実装スケジュール**（2.5週間）
✅ **成功基準**（Webhook 99%成功、レスポンス<500ms）
✅ **VoiceDrive準備状況**（100%完了）

### 3.2 更新が必要な項目（軽微）

以下を備考欄に追記することを推奨：

#### Phase 7実装の明確化

```markdown
## Phase 7実装の注意事項（2025年10月7日追記）

### 統計Webhook
- **Phase 7**: `stats.updated`（リアルタイム）のみ実装
- **Phase 8以降**: `stats.hourly`, `stats.daily` 実装予定
- 型定義は3種類のまま保持（将来の拡張に備える）

### surveySubCategoryフィールド
- **Phase 7**: 実装不要（VoiceDrive内部用）
- **API v2.0**: 将来的に追加検討

### お知らせ受信API仕様書
- **ステータス**: VoiceDrive側作成済み
- **ファイル名**: `VoiceDrive_HR_Announcement_Receive_API_Specification_20251007.md`
- **確認待ち**: MCPサーバー共有確認中
```

---

## 4. Phase 7開始前の確認事項

### 4.1 VoiceDriveへの確認・返信事項

以下をVoiceDriveチームに返信する必要があります：

#### 【必須】確認・返信事項

1. **認証情報の共有方法**
   - 推奨：1Password共有Vault
   - 代替：Slack DM（GPG暗号化）

2. **職員カルテシステムのドメイン**
   - 本番環境：`https://medical-staff-system.ohara-hospital.jp`（仮）
   - ステージング：`https://staging.medical-staff-system.ohara-hospital.jp`（仮）
   - ※実際のドメインを確定後、VoiceDriveに連絡

3. **統合テスト日程**
   - Phase 7開始後6日目でOK
   - Zoom/Google Meetの希望（どちらでも可）

4. **お知らせ受信API仕様書の共有確認**
   - `VoiceDrive_HR_Announcement_Receive_API_Specification_20251007.md`
   - MCPサーバー（`mcp-shared/docs/`）への配置確認

---

## 5. Phase 7実装計画の最終版

### 5.1 実装スケジュール（確定版）

| Day | タスク | VoiceDrive側 | 職員カルテ側 |
|-----|--------|-------------|-------------|
| **Day 0** | Phase 7キックオフ | 認証情報発行、ngrok構築 | 環境変数設定 |
| **Day 1-2** | お知らせ送信機能 | 動作確認サポート | 実装 + 単体テスト |
| **Day 3** | 統計受信Webhook | 動作確認サポート | 実装 + 単体テスト |
| **Day 4-5** | ダッシュボード | - | 実装 + 単体テスト |
| **Day 6** | **統合テスト** | **テスト実施（合同）** | **テスト実施（合同）** |
| **Day 7** | デプロイ準備 | 結果報告書作成 | 結果報告書作成 |

### 5.2 実装タスク詳細（確定版）

#### タスク1-2: お知らせ送信機能（2日）

**実装内容**：
- `src/services/hrAnnouncementService.ts` 作成
- VoiceDrive APIクライアント実装
- バリデーション（title ≤500, content ≤5000）
- エラーハンドリング + リトライロジック

**注意事項**：
- ❌ `surveySubCategory`フィールドは送信しない
- ✅ `requireResponse: false` 固定
- ✅ `autoTrackResponse: true` 固定
- ✅ `X-Source-System: medical-staff-system` ヘッダー必須

#### タスク3: 統計受信Webhook（1日）

**実装内容**：
- `src/app/api/voicedrive/stats/route.ts` 作成
- HMAC-SHA256署名検証実装
- DB保存処理

**注意事項**：
- ✅ `stats.updated`（リアルタイム）のみ処理
- ⏳ `stats.hourly`, `stats.daily` は将来実装
- ✅ 型定義は3種類のまま保持

#### タスク4-5: ダッシュボード（2日）

**実装内容**：
- 配信統計表示画面
- リアルタイム更新（SWR）
- 部門別集計グラフ

**注意事項**：
- ✅ リアルタイム統計のみ表示
- ⏳ バッチ統計は将来実装

#### タスク6: 統合テスト（1日）

**テストシナリオ**：
1. ✅ お知らせ送信（全カテゴリ）
2. ✅ 統計受信（`stats.updated`）
3. ✅ エラーケース（バリデーション、認証、署名検証）

**実施方法**：
- Zoom/Google Meetで画面共有
- 所要時間：2-3時間

---

## 6. Phase 7完了条件（確定版）

### 6.1 必須完了項目

- [ ] お知らせ送信機能実装（`surveySubCategory`なし）
- [ ] 統計受信Webhook実装（`stats.updated`のみ）
- [ ] ダッシュボード実装（リアルタイム統計のみ）
- [ ] 単体テスト（カバレッジ ≥ 80%）
- [ ] 統合テスト（全シナリオPass）
- [ ] 本番環境デプロイ
- [ ] 運用手順書作成
- [ ] 結果報告書作成

### 6.2 Phase 8以降に持ち越す項目

- [ ] `stats.hourly`, `stats.daily` 対応
- [ ] `surveySubCategory` フィールド対応（API v2.0）
- [ ] バッチ統計ダッシュボード

---

## 7. まとめ

### 7.1 結論

**マスタープラン通りで問題なし**

VoiceDriveからの回答を踏まえても、マスタープランの大枠は変更不要です。

### 7.2 微調整内容

| 項目 | 調整内容 |
|------|---------|
| **統計Webhook** | Phase 7では`stats.updated`のみ実装（型定義は変更なし） |
| **surveySubCategory** | Phase 7では実装しない（将来実装） |
| **API仕様書** | VoiceDrive作成済み→共有確認中 |

### 7.3 次のアクション

#### 短期（今週中）

- [ ] VoiceDriveへの返信（認証情報共有方法、ドメイン、テスト日程）
- [ ] お知らせ受信API仕様書の受領確認
- [ ] Phase 7実装準備チェックリストの最終確認

#### 中期（Phase 6完了後）

- [ ] Phase 7キックオフ
- [ ] 認証情報の受領
- [ ] 実装開始

---

**作成者：職員カルテシステム開発チーム**
**作成日：2025年10月7日**
**結論：マスタープラン通りで進行可能（微調整のみ）**
