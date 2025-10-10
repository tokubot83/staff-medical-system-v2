# VoiceDriveチーム質問への回答：施設別調整ルール詳細

**文書番号**: RES-2025-1006-003
**作成日**: 2025年10月6日
**作成者**: 医療システムチーム
**宛先**: VoiceDriveチーム
**件名**: Re: 施設別権限調整についてのご質問への回答

---

## エグゼクティブサマリー

VoiceDriveチーム様からの施設別調整に関するご質問にお答えいたします。

**結論**:
- ✅ 統括主任のLevel 7は**立神リハビリ限定**の特例
- ✅ 他施設の統括主任は存在しない（通常の主任はLevel 6）
- ✅ 現時点で他の施設別特例調整は**なし**

---

## 1. 統括主任の施設別調整について

### Q1: 立神リハビリ以外の施設では通常主任（Level 6）でよいか？

**回答**: **はい、その通りです**

#### 詳細説明

**「統括主任」という役職は立神リハビリテーション温泉病院のみに存在します**

他施設には「統括主任」という役職自体がありません。

#### 各施設の主任レベル構成

| 施設 | 主任レベル役職 | レベル |
|------|-------------|--------|
| **立神リハビリ** | 統括主任 | **7** ← 特例 |
| 立神リハビリ | 主任 | 6 |
| 小原病院 | 主任 | 6 |
| エスポワール立神 | 主任 | 6 |
| その他全施設 | 主任 | 6 |

**実装箇所**: [facility-position-mapping.ts:63](../../../src/lib/facility-position-mapping.ts#L63)

```typescript
{ positionName: '統括主任', baseLevel: 7, managementScope: 30, facilitySpecificAdjustment: 0 }
```

### Q2: 他施設にも同様の特例はあるか？

**回答**: **現時点ではありません**

#### 背景

立神リハビリテーション温泉病院の「統括主任」は、以下の理由でLevel 7に設定されています：

1. **管理範囲の広さ**: リハビリテーション部門全体（30名規模）を統括
2. **専門性の高さ**: 理学療法士・作業療法士・言語聴覚士の3職種を統括
3. **実質的な役割**: 副師長・副科長（Level 7）と同等の責任範囲

**Phase 3実装時の経緯**（2025年9月25日）:
- 医療チーム内で役割分析を実施
- 立神リハビリの組織構造を詳細確認
- Level 6→7への調整を決定（医療チーム合意済み）

---

## 2. その他の施設別調整ルール

### 2.1 現状の施設別調整

**回答**: **統括主任Level 7以外の施設別調整は現時点で存在しません**

#### 全施設共通のルール

以下のレベル設定は**全施設共通**です：

| レベル | 役職例 | 適用施設 |
|-------|--------|---------|
| 7 | 副師長、副科長、副課長 | 全施設共通 |
| 8 | 師長、科長、課長 | 全施設共通 |
| 9 | 副部長 | 全施設共通 |
| 10 | 部長、医局長 | 全施設共通 |
| 11 | 事務長 | 全施設共通 |

### 2.2 施設ごとの役職バリエーション

各施設で役職名は異なりますが、**レベル設定は共通ルール**に従っています。

#### 例：師長レベル（Level 7-8）の役職名バリエーション

| 施設 | Level 7役職 | Level 8役職 |
|------|-----------|-----------|
| 小原病院 | 病棟師長、外来師長 | 看護部長補佐 |
| 立神リハビリ | 第１病棟師長、外来師長、介護医療院師長 | - |
| エスポワール立神 | - | 入所課課長 |

**重要**: 役職名は異なりますが、**レベル番号のルールは全施設統一**されています。

### 2.3 将来的な施設別調整の可能性

現時点では統括主任Level 7以外の特例はありませんが、以下のケースで将来的に追加の可能性があります：

#### 追加が検討されうるケース

1. **新施設の追加**
   - 新しい医療施設・介護施設の法人参加
   - 特殊な組織構造の施設

2. **組織改編**
   - 既存施設の大規模な組織再編
   - 新しい専門部門の設立

3. **特殊な役職の新設**
   - 統括主任のような特殊な責任範囲を持つ役職

#### 追加時のプロセス（変更管理体制に従う）

1. 医療チーム内で役割分析
2. VoiceDriveチームへ変更提案書提出
3. 両チーム合意
4. 統合管理ファイル（JSON）更新
5. 両チーム並行実装

---

## 3. 統合管理ファイル（JSON）への反映

VoiceDriveチーム様が作成されたJSONドラフトの`facilityAdjustments`セクションは**現状正確**です。

### 3.1 現在のfacilityAdjustments

```json
"facilityAdjustments": [
  {
    "position": "統括主任",
    "facilityId": "tategami-rehabilitation",
    "adjustedLevel": 7,
    "reason": "立神リハビリテーション温泉病院の特例",
    "medicalImplemented": true,
    "voicedriveImplemented": true,
    "lastModified": "2025-09-25"
  }
]
```

**判定**: ✅ **このまま採用で問題ありません**

### 3.2 追加すべき説明フィールド（提案）

より詳細な管理のため、以下のフィールド追加を提案します：

```json
"facilityAdjustments": [
  {
    "position": "統括主任",
    "facilityId": "tategami-rehabilitation",
    "adjustedLevel": 7,
    "normalLevel": 6,  // 【追加】通常のレベル
    "reason": "立神リハビリテーション温泉病院の特例",
    "detailedReason": "リハビリテーション部門全体（30名規模、3職種）を統括する実質的な副師長相当の役割",  // 【追加】詳細理由
    "approvedBy": "医療チーム・Phase 3実装時",  // 【追加】承認者
    "approvedDate": "2025-09-25",  // 【追加】承認日
    "managementScope": 30,  // 【追加】管理範囲（人数）
    "specialties": ["理学療法士", "作業療法士", "言語聴覚士"],  // 【追加】管理職種
    "medicalImplemented": true,
    "voicedriveImplemented": true,
    "lastModified": "2025-09-25"
  }
]
```

---

## 4. VoiceDrive側実装への推奨事項

### 4.1 施設別調整ロジックの実装方針

VoiceDrive側の実装（`src/lib/accountLevelHelpers.ts:138-151`）は**正確**です。

```typescript
export function getFacilityAdjustedLevel(
  position: string,
  facilityId?: string | null
): number | null {
  // 統括主任は立神リハビリテーション温泉病院でLevel 7
  if (position === '統括主任' && facilityId === 'tategami-rehabilitation') {
    return 7;
  }

  // 他の施設別調整はここに追加

  return null; // 調整なし
}
```

### 4.2 将来的な拡張性の確保

統合管理ファイル（JSON）の`facilityAdjustments`配列を読み込む実装に変更することを推奨します：

```typescript
import unifiedDef from '@/mcp-shared/config/unified-account-level-definition.json';

export function getFacilityAdjustedLevel(
  position: string,
  facilityId?: string | null
): number | null {
  // 統合管理ファイルから施設別調整を検索
  const adjustment = unifiedDef.facilityAdjustments.find(
    adj => adj.position === position && adj.facilityId === facilityId
  );

  return adjustment ? adjustment.adjustedLevel : null;
}
```

**メリット**:
- ✅ コード変更不要で施設別調整を追加可能
- ✅ 統合管理ファイル（JSON）が単一の真実の源泉
- ✅ 両チームで実装の自動同期

---

## 5. まとめと次のアクション

### 5.1 VoiceDriveチームからのご質問への回答

| 質問 | 回答 |
|------|------|
| 統括主任は立神リハビリ以外でLevel 6か？ | ✅ はい。他施設には「統括主任」自体が存在しません |
| 他施設にも同様の特例はあるか？ | ❌ いいえ。現時点では統括主任Level 7のみです |
| 他の施設別調整ルールはあるか？ | ❌ いいえ。現時点ではありません |

### 5.2 統合ミーティングでの確認事項

**10/13（月）15:00-16:00**の統合ミーティングで以下を確認します：

#### アジェンダ追加提案

1. 施設別調整ルールの最終確認（5分）
   - 統括主任Level 7の妥当性
   - 将来的な追加基準の確認

2. 統合管理ファイル（JSON）の`facilityAdjustments`セクション合意（5分）
   - フィールド追加の検討
   - VoiceDrive側実装方針の確認

### 5.3 今週中の作業

#### 医療チーム
- [x] 施設別調整ルールの詳細回答（本文書）
- [ ] 統合管理ファイル（JSON）のfacilityAdjustmentsセクションレビュー
- [ ] 統合ミーティング準備

#### VoiceDriveチーム
- [ ] 本回答のレビュー
- [ ] 統合管理ファイル（JSON）のfacilityAdjustments更新
- [ ] getFacilityAdjustedLevel()の実装方針決定

---

## 6. 参考資料

### 6.1 医療側実装ファイル

| ファイル | 内容 |
|---------|------|
| `src/lib/facility-position-mapping.ts:47-76` | 立神リハビリ12役職マッピング |
| `src/lib/facility-position-mapping.ts:63` | 統括主任baseLevel: 7定義 |
| `src/lib/facility-position-mapping.ts:338-343` | 施設別調整ロジック |

### 6.2 Phase 3実装ドキュメント

| ファイル | 内容 |
|---------|------|
| `docs/Phase3_実装作業完了報告書_FINAL.md` | Phase 3完了報告（統括主任Level 7調整含む） |
| `docs/Phase3_作業再開指示書.md` | Phase 3作業再開手順 |

---

## 7. 連絡先

### 医療システムチーム
- プロジェクトリーダー: medical-lead@example.com
- 技術担当: medical-tech@example.com

### Slack
- **統合プロジェクト**: #lightsail-integration
- **アカウントレベル管理**: #account-level-sync

---

**医療システムチーム**
2025年10月6日

---

## Appendix: 全施設の役職レベル一覧

### 小原病院（obara-hospital）

| レベル | 役職名 |
|-------|--------|
| 6 | 主任 |
| 7 | 病棟師長、外来師長、総務課長、医事課長 |
| 8 | 看護部長補佐 |
| 9 | 循環器内科部長（副部長相当） |
| 10 | 部長、医局長 |
| 13 | 院長 |

### 立神リハビリテーション温泉病院（tategami-rehabilitation）

| レベル | 役職名 |
|-------|--------|
| 6 | 主任 |
| **7** | **統括主任**（特例）、第１病棟師長、外来師長、介護医療院師長 |
| 8 | 師長 |
| 10 | 部長 |
| 13 | 施設長 |

### エスポワール立神（espoir-tategami）

| レベル | 役職名 |
|-------|--------|
| 5 | 副主任、各フロアマネージャー |
| 6 | 主任 |
| 7 | 計画作成担当者 |
| 8 | 課長 |
| 11 | 入所課課長 |
| 13 | 施設長 |

**注**: 役職名は各施設で異なりますが、レベル設定のルールは**全施設統一**されています。
