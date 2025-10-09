# Phase 14.0実装手順書（準備フェーズ）

**文書番号**: PHASE14.0-IMPL-GUIDE-2025-1010-001
**作成日**: 2025年10月10日
**作成者**: 医療システムチーム
**対象**: 両チーム（医療システム + VoiceDrive）
**目的**: 健康ステーション準備フェーズ（ファイル検知テストのみ、DB保存なし）

---

## 📢 Phase 14.0の目的

Phase 14.0は**準備フェーズ**です。以下を実施します:

✅ **実施すること**:
- JSONサンプルファイル作成
- ファイル検知テスト（VoiceDrive側）
- ログ出力確認

❌ **実施しないこと**:
- データベース操作（テーブル作成・マイグレーション）
- 通知データのDB保存
- HealthStation UI実装

**理由**: 共通DB（MySQL）がまだ構築されていないため、DB操作を伴う実装は Phase 1.6（ライトセイル構築）完了後に実施

---

## 🎯 実施タイミング

### Phase 14.0（準備フェーズ）
- **実施時期**: 2025年10月10日〜11日（今すぐ）
- **実施内容**: JSONサンプルファイル検知テストのみ
- **DB操作**: なし

### Phase 14.1-3（本実装）
- **実施時期**: 共通DB（MySQL）構築完了後（Phase 1.6後）
- **実施内容**: テーブル作成、通知処理、UI実装
- **DB操作**: あり

---

## 📋 Phase 14.0実装手順

### Step 1: JSONサンプルファイル作成（医療システムチーム）

#### 1.1 サンプルディレクトリ作成

```bash
mkdir -p c:\projects\voicedrive-v100\mcp-shared\notifications\samples
```

#### 1.2 サンプルファイル配置

以下の4ファイルを配置:

1. **health_risk_assessment（健康リスク評価）** - 優先度: medium
   - ファイル名: `health_notif_OH-NS-2024-001_20251010100000.json`

2. **health_checkup_result（健診結果）** - 優先度: low
   - ファイル名: `health_notif_OH-NS-2024-002_20251010100100.json`

3. **stress_check_result（ストレスチェック結果）** - 優先度: high
   - ファイル名: `health_notif_OH-NS-2024-003_20251010100200.json`

4. **reexamination_required（要再検査）** - 優先度: urgent
   - ファイル名: `health_notif_OH-NS-2024-004_20251010100300.json`

**✅ 完了確認**:
```bash
ls c:\projects\voicedrive-v100\mcp-shared\notifications\samples\
```

期待される出力:
```
health_notif_OH-NS-2024-001_20251010100000.json
health_notif_OH-NS-2024-002_20251010100100.json
health_notif_OH-NS-2024-003_20251010100200.json
health_notif_OH-NS-2024-004_20251010100300.json
```

---

### Step 2: ファイル検知テスト（VoiceDriveチーム）

#### 2.1 既存コードの確認

VoiceDriveチームは既に以下のファイルを実装済みのはず:
- `healthNotificationWatcher.ts` - ファイル監視
- `healthNotificationHandler.ts` - 通知処理

#### 2.2 テストスクリプト作成

**ファイル名**: `tests/phase14.0-file-detection-test.ts`

```typescript
// tests/phase14.0-file-detection-test.ts
import * as fs from 'fs';
import * as path from 'path';

interface HealthNotification {
  type: string;
  staffId: string;
  timestamp: string;
  assessment: {
    overallScore: number;
    overallLevel: string;
  };
  metadata: {
    source: string;
    version: string;
    priority: string;
  };
}

/**
 * Phase 14.0: ファイル検知テスト（DB保存なし）
 *
 * このテストは以下を確認します:
 * 1. サンプルフォルダ内のファイルを検知できるか
 * 2. JSONをパースできるか
 * 3. 優先度判定が正しく動作するか
 *
 * ⚠️ DB操作は一切行いません
 */
async function testFileDetection() {
  console.log('=== Phase 14.0: ファイル検知テスト開始 ===\n');

  const samplesPath = path.join(
    process.cwd(),
    '..',
    'mcp-shared',
    'notifications',
    'samples'
  );

  console.log(`サンプルフォルダ: ${samplesPath}\n`);

  // 1. ファイル一覧取得
  const files = fs.readdirSync(samplesPath).filter(
    filename => filename.startsWith('health_notif_') && filename.endsWith('.json')
  );

  console.log(`検知されたファイル数: ${files.length}`);
  console.log(`ファイル一覧: ${files.join(', ')}\n`);

  // 2. 各ファイルを処理
  for (const filename of files) {
    const filePath = path.join(samplesPath, filename);
    console.log(`--- ${filename} ---`);

    try {
      // 2.1 ファイル読み込み
      const content = fs.readFileSync(filePath, 'utf-8');
      const notification: HealthNotification = JSON.parse(content);

      // 2.2 基本情報表示
      console.log(`  通知タイプ: ${notification.type}`);
      console.log(`  職員ID: ${notification.staffId}`);
      console.log(`  総合スコア: ${notification.assessment.overallScore}`);
      console.log(`  リスクレベル: ${notification.assessment.overallLevel}`);
      console.log(`  優先度: ${notification.metadata.priority}`);

      // 2.3 優先度判定テスト
      const determinedPriority = determinePriority(notification);
      console.log(`  判定された優先度: ${determinedPriority}`);

      if (determinedPriority !== notification.metadata.priority) {
        console.log(`  ⚠️ 警告: メタデータの優先度と判定された優先度が一致しません`);
      } else {
        console.log(`  ✅ 優先度判定: 正常`);
      }

      console.log('');
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
      console.log('');
    }
  }

  console.log('=== Phase 14.0: ファイル検知テスト完了 ===');
}

/**
 * 優先度判定ロジック（healthNotificationHandler.tsから抽出）
 */
function determinePriority(notification: HealthNotification): string {
  // メタデータに優先度が設定されている場合はそれを使用
  if (notification.metadata?.priority) {
    return notification.metadata.priority;
  }

  // リスクレベルから優先度を判定
  if (notification.assessment?.overallLevel) {
    const mapping: Record<string, string> = {
      'very-high': 'urgent',
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };
    return mapping[notification.assessment.overallLevel] || 'medium';
  }

  return 'medium'; // デフォルト
}

// テスト実行
testFileDetection().catch(console.error);
```

#### 2.3 テスト実行

```bash
cd c:\projects\voicedrive-v100
npx ts-node tests/phase14.0-file-detection-test.ts
```

**期待される出力**:
```
=== Phase 14.0: ファイル検知テスト開始 ===

サンプルフォルダ: c:\projects\voicedrive-v100\..\mcp-shared\notifications\samples

検知されたファイル数: 4
ファイル一覧: health_notif_OH-NS-2024-001_20251010100000.json, health_notif_OH-NS-2024-002_20251010100100.json, health_notif_OH-NS-2024-003_20251010100200.json, health_notif_OH-NS-2024-004_20251010100300.json

--- health_notif_OH-NS-2024-001_20251010100000.json ---
  通知タイプ: health_risk_assessment
  職員ID: OH-NS-2024-001
  総合スコア: 65
  リスクレベル: medium
  優先度: medium
  判定された優先度: medium
  ✅ 優先度判定: 正常

--- health_notif_OH-NS-2024-002_20251010100100.json ---
  通知タイプ: health_checkup_result
  職員ID: OH-NS-2024-002
  総合スコア: 88
  リスクレベル: low
  優先度: low
  判定された優先度: low
  ✅ 優先度判定: 正常

--- health_notif_OH-NS-2024-003_20251010100200.json ---
  通知タイプ: stress_check_result
  職員ID: OH-NS-2024-003
  総合スコア: 52
  リスクレベル: high
  優先度: high
  判定された優先度: high
  ✅ 優先度判定: 正常

--- health_notif_OH-NS-2024-004_20251010100300.json ---
  通知タイプ: reexamination_required
  職員ID: OH-NS-2024-004
  総合スコア: 35
  リスクレベル: very-high
  優先度: urgent
  判定された優先度: urgent
  ✅ 優先度判定: 正常

=== Phase 14.0: ファイル検知テスト完了 ===
```

---

### Step 3: 結果確認（両チーム）

#### 3.1 成功条件

以下の全てが満たされればPhase 14.0完了:

| 項目 | 確認内容 | 担当 |
|------|---------|------|
| ✅ ファイル配置 | 4ファイルがsamples/フォルダに存在 | 医療システム |
| ✅ ファイル検知 | 4ファイル全てが検知される | VoiceDrive |
| ✅ JSONパース | 4ファイル全てがパース成功 | VoiceDrive |
| ✅ 優先度判定 | 4ファイル全てが正しい優先度判定 | VoiceDrive |
| ✅ エラーなし | エラーが発生しない | VoiceDrive |

#### 3.2 失敗時の対応

| エラー | 原因 | 対応 |
|--------|------|------|
| ファイルが見つからない | パス間違い | samplesPath変数を確認 |
| JSONパースエラー | JSON形式エラー | JSONファイルの構文確認 |
| 優先度判定エラー | ロジック誤り | determinePriority関数を確認 |

---

## 🚨 重要な注意事項

### ❌ やってはいけないこと

1. **DB操作**: テーブル作成・マイグレーション実行
2. **データ保存**: HealthNotificationテーブルへのINSERT
3. **UI実装**: HealthStation画面の実装
4. **本番環境テスト**: samples/フォルダ以外でのテスト

### ✅ やるべきこと

1. **ファイル検知テスト**: samples/フォルダのみ
2. **ログ出力確認**: console.logのみ
3. **結果報告**: テスト結果をSlackで共有

---

## 📅 次のステップ（Phase 14.1-3）

Phase 14.0完了後、共通DB（MySQL）構築完了を待ってPhase 14.1-3を実施:

### Phase 14.1: テーブル作成（DB構築後）

```prisma
// VoiceDrive側: schema.prisma
model HealthNotification {
  id                    String    @id @default(cuid())
  notificationType      String
  employeeId            String
  // ... (回答書に記載の通り)
}
```

```bash
# マイグレーション実行
npx prisma migrate dev --name add_health_notification
```

### Phase 14.2: 通知処理統合（DB構築後）

- ファイル検知 → DB保存
- 優先度判定 → アクション実行
- 処理ログ記録

### Phase 14.3: HealthStation UI統合（DB構築後）

- 通知一覧表示
- 未読/既読管理
- 優先度別フィルタリング

---

## 📎 関連ドキュメント

### Phase 14.0関連
- [Phase14.0_Implementation_Guide_20251010.md](./Phase14.0_Implementation_Guide_20251010.md) ✅ **本文書**
- [Response_HealthStation_Integration_20251010.md](./Response_HealthStation_Integration_20251010.md) ✅ **回答書**

### Phase 14（全体）関連
- [健康ステーション暫定マスターリスト_20251009.md](./健康ステーション暫定マスターリスト_20251009.md)
- [HealthStation_DB要件分析_20251009.md](./HealthStation_DB要件分析_20251009.md)
- [lightsail-integration-master-plan-20251005-updated.md](./lightsail-integration-master-plan-20251005-updated.md) - Phase 14追加済み

---

## 📝 テスト結果報告フォーマット

Phase 14.0完了後、以下の形式でSlackに報告:

```
【Phase 14.0完了報告】

## 実施内容
- JSONサンプルファイル作成: 4ファイル
- ファイル検知テスト: 実施完了

## テスト結果
✅ ファイル配置: 成功
✅ ファイル検知: 4/4ファイル検知
✅ JSONパース: 4/4ファイル成功
✅ 優先度判定: 4/4ファイル正常

## エラー
なし

## 次のステップ
Phase 1.6（ライトセイル構築）完了後、Phase 14.1-3を実施予定
```

---

**文書終了**

**Phase 14.0は準備フェーズです。DB操作を伴わないため、今すぐ実施可能です。**

**Phase 14.1-3の本実装は、共通DB（MySQL）構築完了後に実施します。**

*次回更新: Phase 14.0完了報告後*
