# Phase 2 画像管理ページ統合計画

**文書番号**: MED-TECH-IMAGE-MGMT-2025-1021-001
**作成日**: 2025年10月21日
**目的**: 既存の画像管理ページと`public/employees/`フォルダの統合

---

## 📋 現状分析

### 既存の画像管理システム

**場所**: `/admin/image-management`
**ストレージ**: IndexedDB（ブラウザ内ストレージ）
**主な機能**:
- ✅ 画像アップロード
- ✅ 画像一覧表示
- ✅ 画像削除
- ✅ 検索・フィルター
- ✅ ストレージ使用量表示
- ✅ 古い画像の自動削除

### Phase 2の要件

**場所**: `public/employees/`フォルダ
**ストレージ**: Lightsailサーバー上のファイルシステム
**配信方式**: Next.js Public Folder（静的ファイル配信）

---

## 🎯 統合の方針

### Option A: 二重管理（推奨・短期）⭐

```
IndexedDB（既存の画像管理）
  ↓ 手動エクスポート
public/employees/*.jpg
  ↓ デプロイ
Lightsailサーバー
  ↓ 配信
VoiceDriveシステム
```

**メリット**:
- 既存システムを壊さない
- 実装工数が少ない（0.5時間）
- すぐに使える

**デメリット**:
- 手動エクスポートが必要

### Option B: 完全統合（推奨・長期）⭐⭐⭐

```
/admin/image-management
  ↓ アップロード
Next.js API Route
  ↓ 保存
public/employees/*.jpg
  ↓ 自動デプロイ
Lightsailサーバー
  ↓ 配信
VoiceDriveシステム
```

**メリット**:
- 一元管理
- 自動デプロイ可能
- 本番運用に最適

**デメリット**:
- 実装工数が必要（3-4時間）
- サーバーサイドファイルシステムのアクセス権限が必要

---

## 🚀 Option A: 二重管理（短期実装）

### 実装手順

#### Step 1: エクスポート機能追加

画像管理ページに「エクスポート」ボタンを追加し、選択した画像を`public/employees/`にコピーするスクリプトを作成。

```typescript
// src/app/admin/image-management/page.tsx に追加

const handleExportToPublicFolder = useCallback(async () => {
  const selected = filteredImages.filter(img =>
    selectedImages.has(img.id)
  );

  if (selected.length === 0) {
    alert('画像を選択してください');
    return;
  }

  try {
    for (const image of selected) {
      const storedImage = await imageStorage.getImage(image.id);

      // ファイル名を staffId.jpg 形式に変換
      const staffId = image.tags?.find(tag => tag.startsWith('staff:'))?.replace('staff:', '');
      if (!staffId) {
        console.warn(`スタッフIDが見つかりません: ${image.fileName}`);
        continue;
      }

      // Blob → File → public/employees/ にダウンロード
      const fileName = `${staffId}.jpg`;
      const blob = await fetch(storedImage.preview).then(r => r.blob());

      // ブラウザでダウンロード（ユーザーがpublic/employees/に手動保存）
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }

    alert(`${selected.length}件の画像をエクスポートしました。\\npublic/employees/フォルダに保存してください。`);
  } catch (error) {
    console.error('エクスポートエラー:', error);
    alert('エクスポートに失敗しました');
  }
}, [selectedImages, filteredImages]);
```

**使い方**:
1. 画像管理ページで画像を選択
2. 「エクスポート」ボタンクリック
3. ダウンロードされた画像を`public/employees/`に手動配置

---

## 🚀 Option B: 完全統合（長期実装）

### アーキテクチャ

```
/admin/image-management (UI)
  ↓
POST /api/employees/photos/upload (API Route)
  ↓
fs.writeFile(public/employees/{staffId}.jpg)
  ↓
Lightsailにデプロイ
```

### 実装手順

#### Step 1: API Route作成

```typescript
// src/app/api/employees/photos/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const staffId = formData.get('staffId') as string;

    if (!file || !staffId) {
      return NextResponse.json(
        { error: 'ファイルまたはstaffIDが不足しています' },
        { status: 400 }
      );
    }

    // ファイル名: staffId.jpg
    const fileName = `${staffId}.jpg`;
    const publicPath = path.join(process.cwd(), 'public', 'employees', fileName);

    // ファイル保存
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(publicPath, Buffer.from(arrayBuffer));

    return NextResponse.json({
      success: true,
      url: `/employees/${fileName}`,
      staffId,
      fileName,
    });
  } catch (error) {
    console.error('アップロードエラー:', error);
    return NextResponse.json(
      { error: 'アップロードに失敗しました' },
      { status: 500 }
    );
  }
}
```

#### Step 2: 画像一覧取得API

```typescript
// src/app/api/employees/photos/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const publicPath = path.join(process.cwd(), 'public', 'employees');
    const files = await fs.readdir(publicPath);

    const images = await Promise.all(
      files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(async (file) => {
          const filePath = path.join(publicPath, file);
          const stats = await fs.stat(filePath);
          const staffId = file.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');

          return {
            staffId,
            fileName: file,
            url: `/employees/${file}`,
            size: stats.size,
            updatedAt: stats.mtime.toISOString(),
          };
        })
    );

    return NextResponse.json({ images });
  } catch (error) {
    console.error('画像一覧取得エラー:', error);
    return NextResponse.json(
      { error: '画像一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}
```

#### Step 3: 画像削除API

```typescript
// src/app/api/employees/photos/[staffId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { staffId: string } }
) {
  try {
    const publicPath = path.join(process.cwd(), 'public', 'employees');
    const files = await fs.readdir(publicPath);

    // staffIdに一致する画像を削除
    const targetFile = files.find(file =>
      file.startsWith(params.staffId) && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    if (!targetFile) {
      return NextResponse.json(
        { error: '画像が見つかりません' },
        { status: 404 }
      );
    }

    const filePath = path.join(publicPath, targetFile);
    await fs.unlink(filePath);

    return NextResponse.json({ success: true, staffId: params.staffId });
  } catch (error) {
    console.error('削除エラー:', error);
    return NextResponse.json(
      { error: '削除に失敗しました' },
      { status: 500 }
    );
  }
}
```

#### Step 4: 画像管理ページの修正

```typescript
// src/app/admin/image-management/page.tsx を修正

const handleUploadToPublicFolder = useCallback(async (file: File, staffId: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('staffId', staffId);

    const response = await fetch('/api/employees/photos/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('アップロードに失敗しました');
    }

    const result = await response.json();
    console.log('アップロード成功:', result);

    // 画像一覧を再読み込み
    await loadPublicFolderImages();

    return result;
  } catch (error) {
    console.error('アップロードエラー:', error);
    throw error;
  }
}, []);
```

---

## 📊 工数見積もり

| 実装方式 | 所要時間 | 難易度 |
|---------|---------|--------|
| **Option A: 二重管理** | **0.5時間** | 簡単 |
| **Option B: 完全統合** | **3-4時間** | 中級 |

---

## 🎯 推奨実装スケジュール

### 短期（今すぐ）

✅ **Option A: 二重管理**を実装（0.5時間）
- エクスポート機能追加
- 手動で`public/employees/`に配置
- DB構築前のテスト用途

### 中期（DB構築後）

✅ **Option B: 完全統合**を実装（3-4時間）
- API Route作成
- 画像管理ページ修正
- 本番運用開始

---

## 🔒 セキュリティ考慮事項

### Option B実装時の注意点

1. **ファイルサイズ制限**
   ```typescript
   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
   if (file.size > MAX_FILE_SIZE) {
     throw new Error('ファイルサイズが大きすぎます');
   }
   ```

2. **ファイル形式検証**
   ```typescript
   const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
   if (!ALLOWED_TYPES.includes(file.type)) {
     throw new Error('許可されていないファイル形式です');
   }
   ```

3. **staffID検証**
   ```typescript
   const STAFF_ID_PATTERN = /^[A-Z0-9-]+$/;
   if (!STAFF_ID_PATTERN.test(staffId)) {
     throw new Error('無効なstaffIDです');
   }
   ```

---

## ✅ 次のステップ

### 今すぐ実施

- [ ] Option Aのエクスポート機能を実装（0.5時間）
- [ ] テスト画像3枚をエクスポート
- [ ] `public/employees/`に配置
- [ ] ローカル動作確認

### DB構築後

- [ ] Option Bの完全統合を実装（3-4時間）
- [ ] 既存300-500枚の画像を一括移行
- [ ] VoiceDriveチームとの統合テスト
- [ ] 本番リリース

---

**作成者**: 医療職員カルテシステム開発チーム
**作成日**: 2025年10月21日

---

**END OF DOCUMENT**
