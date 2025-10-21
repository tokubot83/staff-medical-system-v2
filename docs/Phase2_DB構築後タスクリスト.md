# Phase 2 顔写真統合 - DB構築後タスクリスト

**文書番号**: MED-TASK-PHASE2-2025-1021-001
**作成日**: 2025年10月21日
**前提**: 共通DB構築完了後に実施

---

## 📋 現在の状況（2025年10月21日）

### ✅ 完了した準備作業

| No. | 作業内容 | ステータス | ファイル |
|-----|---------|----------|---------|
| 1 | `public/employees/` フォルダ作成 | ✅ 完了 | `public/employees/.gitkeep` |
| 2 | `.gitignore` 設定追加 | ✅ 完了 | `.gitignore` |
| 3 | 実装ガイド作成 | ✅ 完了 | `docs/Phase2_Lightsail_Public_Folder_Setup_Guide.md` |
| 4 | VoiceDriveチームへ通知 | ✅ 完了 | `mcp-shared/docs/Phase2_Lightsail_Public_Folder_Notification_20251021.md` |
| 5 | 画像管理ページ統合計画 | ✅ 完了 | `docs/Phase2_Image_Management_Integration_Plan.md` |
| 6 | Webhook送信ユーティリティ | ✅ 完了 | `src/lib/webhooks/phase2-photo-webhook.ts` |
| 7 | DB構築計画書更新 | ✅ 完了 | `docs/DB構築計画書前準備_不足項目整理_20251008.md` |

---

## 🎯 DB構築後の実装タスク

### Phase 1: Webhook実装（1-2日）

#### タスク1-1: 職員作成時のWebhook送信

**実装箇所**: 職員登録API
**使用コード**: `src/lib/webhooks/phase2-photo-webhook.ts`の`sendEmployeeCreatedEvent()`

```typescript
// 例: src/app/api/employees/route.ts（新規作成時）
import { sendEmployeeCreatedEvent } from '@/lib/webhooks/phase2-photo-webhook';

// 職員作成処理後
await sendEmployeeCreatedEvent({
  staffId: newEmployee.id,
  fullName: newEmployee.name,
  email: newEmployee.email,
  facilityId: newEmployee.facilityId,
  departmentId: newEmployee.departmentId,
  position: newEmployee.position,
  authLevel: newEmployee.authLevel,
  profilePhotoUrl: `https://medical-system.example.com/employees/${newEmployee.id}.jpg`,
  photoUpdatedAt: new Date().toISOString(),
  photoMimeType: 'image/jpeg',
  photoFileSize: 180000,
  employmentStatus: 'active',
  hiredAt: newEmployee.hiredAt
});
```

**チェックポイント**:
- [ ] VoiceDrive側でWebhook受信確認
- [ ] `profilePhotoUrl`が正しく保存されているか確認
- [ ] エラー時のリトライが動作するか確認

---

#### タスク1-2: 顔写真更新時のWebhook送信

**実装箇所**: 画像管理ページ（[/admin/image-management](https://staff-medical-system-v2.vercel.app/admin/image-management)）
**使用コード**: `src/lib/webhooks/phase2-photo-webhook.ts`の`sendEmployeePhotoUpdatedEvent()`

```typescript
// src/app/admin/image-management/page.tsx 修正
import { sendEmployeePhotoUpdatedEvent } from '@/lib/webhooks/phase2-photo-webhook';

// 画像アップロード後
const handleUploadComplete = async (staffId: string, imageUrl: string) => {
  await sendEmployeePhotoUpdatedEvent({
    staffId,
    profilePhotoUrl: imageUrl,
    photoUpdatedAt: new Date().toISOString(),
    photoMimeType: 'image/jpeg',
    photoFileSize: 180000,
    updateReason: 'manual_update'
  });
};
```

**チェックポイント**:
- [ ] 画像アップロード後、即座にWebhook送信
- [ ] VoiceDrive側で`profilePhotoUrl`が更新されるか確認

---

#### タスク1-3: 顔写真削除時のWebhook送信

**実装箇所**: 画像管理ページ
**使用コード**: `src/lib/webhooks/phase2-photo-webhook.ts`の`sendEmployeePhotoDeletedEvent()`

```typescript
// src/app/admin/image-management/page.tsx 修正
import { sendEmployeePhotoDeletedEvent } from '@/lib/webhooks/phase2-photo-webhook';

// 画像削除後
const handleDeleteComplete = async (staffId: string) => {
  await sendEmployeePhotoDeletedEvent({
    staffId,
    deletionReason: 'user_request',
    photoDeletedAt: new Date().toISOString()
  });
};
```

**チェックポイント**:
- [ ] 画像削除後、即座にWebhook送信
- [ ] VoiceDrive側で`profilePhotoUrl`がnullに更新されるか確認

---

### Phase 2: 既存画像の移行（0.5-1日）

#### タスク2-1: IndexedDBから画像エクスポート

**方法**: 画像管理ページの「エクスポート」機能を使用（Option A）

**手順**:
1. [/admin/image-management](https://staff-medical-system-v2.vercel.app/admin/image-management)にアクセス
2. 移行対象の画像を選択
3. 「エクスポート」ボタンをクリック
4. ダウンロードされた画像を`public/employees/`に配置

**チェックポイント**:
- [ ] ファイル名が`{staffId}.jpg`形式になっているか確認
- [ ] 画像サイズが400x400ピクセルか確認
- [ ] ファイルサイズが200KB以下か確認

---

#### タスク2-2: 一括Webhook送信（既存300-500枚）

**実装方法**: スクリプトを作成

```typescript
// scripts/migrate-existing-photos.ts
import { sendEmployeeCreatedEvent } from '@/lib/webhooks/phase2-photo-webhook';
import { prisma } from '@/lib/prisma'; // DB構築後に使用

async function migrateExistingPhotos() {
  const employees = await prisma.employee.findMany({
    where: {
      // 顔写真がある職員のみ
    }
  });

  for (const employee of employees) {
    const photoUrl = `https://medical-system.example.com/employees/${employee.id}.jpg`;

    await sendEmployeeCreatedEvent({
      staffId: employee.id,
      fullName: employee.name,
      email: employee.email,
      facilityId: employee.facilityId,
      departmentId: employee.departmentId,
      position: employee.position,
      authLevel: employee.authLevel,
      profilePhotoUrl: photoUrl,
      photoUpdatedAt: new Date().toISOString(),
      photoMimeType: 'image/jpeg',
      photoFileSize: 180000,
      employmentStatus: 'active',
      hiredAt: employee.hiredAt
    });

    console.log(`✅ Webhook送信完了: ${employee.id}`);

    // レート制限対策（5件/秒）
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`🎉 全${employees.length}件のWebhook送信完了`);
}

migrateExistingPhotos();
```

**実行方法**:
```bash
npx tsx scripts/migrate-existing-photos.ts
```

**チェックポイント**:
- [ ] 全職員分のWebhook送信が完了
- [ ] VoiceDrive側で全職員の`profilePhotoUrl`が保存されているか確認
- [ ] エラーが発生した職員がいないか確認

---

### Phase 3: 統合テスト（1日）

#### タスク3-1: 新規職員登録テスト

**テストケース**:
1. 顔写真なしで職員登録
2. 顔写真ありで職員登録
3. 登録後に顔写真を追加

**確認事項**:
- [ ] VoiceDrive側で職員情報が表示される
- [ ] 顔写真URLが正しく保存される
- [ ] PhotoAvatarコンポーネントで画像が表示される

---

#### タスク3-2: 顔写真更新テスト

**テストケース**:
1. 既存の顔写真を新しい画像に更新
2. 顔写真を削除

**確認事項**:
- [ ] VoiceDrive側で画像が即座に更新される
- [ ] 削除した場合、イニシャル表示に戻る

---

#### タスク3-3: エラーハンドリングテスト

**テストケース**:
1. VoiceDrive側が停止している状態でWebhook送信
2. ネットワークエラー発生時

**確認事項**:
- [ ] リトライ機構が動作する（1分→5分→30分）
- [ ] 3回失敗後、Slackアラートが送信される

---

### Phase 4: 本番リリース（0.5日）

#### タスク4-1: 環境変数設定

```env
# .env.production
NEXT_PUBLIC_EMPLOYEE_PHOTO_BASE_URL="https://your-lightsail-domain.com"
VOICEDRIVE_WEBHOOK_ENDPOINT_PROD="https://voicedrive.example.com/api/webhooks/medical-system/employee"
MEDICAL_WEBHOOK_SECRET="<VoiceDriveチームから共有された秘密鍵>"
```

**チェックポイント**:
- [ ] 実際のLightsailドメインに更新
- [ ] VoiceDriveの本番WebhookエンドポイントURLを設定
- [ ] Webhook Secretを設定

---

#### タスク4-2: Lightsailにデプロイ

```bash
# ビルド
npm run build

# Lightsailにデプロイ（既存の手順）
# public/employees/*.jpg も一緒にアップロード
```

**チェックポイント**:
- [ ] 画像ファイルも一緒にデプロイされているか確認
- [ ] `https://your-lightsail-domain.com/employees/TEST-001.jpg`にアクセスできるか確認

---

#### タスク4-3: 本番動作確認

**確認項目**:
- [ ] 新規職員登録時にWebhookが送信される
- [ ] VoiceDrive側で職員情報と顔写真が表示される
- [ ] 画像更新・削除が正常に動作する
- [ ] エラー時のリトライが動作する

---

## 📊 工数見積もり

| Phase | タスク | 所要時間 |
|-------|--------|---------|
| Phase 1 | Webhook実装 | 1-2日 |
| Phase 2 | 既存画像移行 | 0.5-1日 |
| Phase 3 | 統合テスト | 1日 |
| Phase 4 | 本番リリース | 0.5日 |
| **合計** | | **3-4.5日** |

---

## ✅ チェックリスト（DB構築後）

### 実装前の確認

- [ ] 共通DB構築完了
- [ ] Lightsail 80ドルプラン契約完了
- [ ] VoiceDrive側のWebhook受信準備完了

### 実装中の確認

- [ ] Webhook実装（employee.created, photo.updated, photo.deleted）
- [ ] 既存画像の移行（300-500枚）
- [ ] 一括Webhook送信スクリプト実行

### 統合テスト

- [ ] 新規職員登録テスト
- [ ] 顔写真更新テスト
- [ ] 顔写真削除テスト
- [ ] エラーハンドリングテスト

### 本番リリース

- [ ] 環境変数設定（本番）
- [ ] Lightsailデプロイ
- [ ] 本番動作確認
- [ ] VoiceDriveチームへ完了報告

---

## 📚 関連ドキュメント

1. **実装ガイド**: `docs/Phase2_Lightsail_Public_Folder_Setup_Guide.md`
2. **VoiceDriveチーム通知書**: `mcp-shared/docs/Phase2_Lightsail_Public_Folder_Notification_20251021.md`
3. **画像管理ページ統合計画**: `docs/Phase2_Image_Management_Integration_Plan.md`
4. **Webhook送信ユーティリティ**: `src/lib/webhooks/phase2-photo-webhook.ts`

---

**作成者**: 医療職員カルテシステム開発チーム
**作成日**: 2025年10月21日

---

**END OF DOCUMENT**
