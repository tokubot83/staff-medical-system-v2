# 医療システムチーム質問回答書

**作成日**: 2025-10-12
**作成者**: VoiceDrive開発チーム
**宛先**: 医療職員管理システム開発チーム
**件名**: Re: 組織情報収集依頼における3つの質問への回答

---

## 📋 エグゼクティブサマリー

医療システムチームからの3つの質問に対する詳細回答です。

### ✅ 回答結論

1. **投票グループ動的変更**: ✅ 可能（Level 99管理UI実装予定）
2. **施設間連携議題**: ✅ タグ機能+カスタム投票範囲で対応
3. **兼任職員の投票権**: ✅ 複数所属対応、投票時に所属選択

---

## 質問1: 投票グループの動的変更

### 📝 質問内容
> 投票グループ（小規模部門統合）は、DB構築後も動的に変更可能ですか？
> 例: 診療支援部(5名) + 薬剤部(3名) + 事務部(8名) → 1年後に分離、など

### ✅ 回答

**はい、動的変更可能です。** 以下の仕様で対応します。

#### 1. 変更権限
- **Level 99（システム管理者）**: 全投票グループの作成・変更・削除が可能
- **Level 10（部長）**: 自部門が関わる投票グループの提案が可能（Level 99承認必要）

#### 2. 再編成トリガー条件
以下の場合に投票グループ再編成を推奨：
- **人数変化**: 部門人数が閾値を超えた場合（例: 5名 → 12名で独立）
- **組織改編**: 法人・施設の組織変更時
- **運用実績**: 6ヶ月運用後のレビューで必要性が認められた場合

#### 3. 既存データの扱い

##### 投票データ
```
再編成前: 投票グループA（診療支援部+薬剤部+事務部）
再編成後: 診療支援部単独、薬剤部+事務部グループB

処理方針:
✅ 既存の投票データは保持（historical data）
✅ 投稿作成時の投票グループ情報を記録
✅ 過去の投票は再編成後も有効（スコアに反映）
✅ 新規投票は新しいグループ構成で権限判定
```

##### プロジェクトデータ
```
再編成時に進行中のプロジェクト:
✅ 既存プロジェクトは元の投票グループで継続
✅ 承認者は変更なし（primary_approver_id維持）
⚠️ 新規プロジェクトは新しいグループ構成で開始

オプション: Level 99が手動で承認者を再指定可能
```

#### 4. Level 99管理者UI

以下の管理画面を実装予定：

```
【投票グループ管理画面】
├─ 投票グループ一覧
│  ├─ グループ名、メンバー部門、人数、作成日
│  └─ 操作: 編集、削除、履歴表示
├─ 新規グループ作成
│  ├─ グループ名入力
│  ├─ メンバー部門選択（複数選択）
│  ├─ 代表承認者指定
│  └─ ローテーション設定（オプション）
└─ 再編成履歴
   ├─ 変更日時、変更内容、実施者
   └─ 影響を受けた投稿・プロジェクト数
```

#### 5. 再編成時の注意事項

⚠️ **投票中の投稿への影響**:
- 投票期間中の投稿は元のグループ構成で投票継続
- 投票終了後の新規投稿から新グループ適用

⚠️ **承認待ちプロジェクトへの影響**:
- 承認者が変わる場合は通知を送信
- 必要に応じてLevel 99が承認者を再指定

---

## 質問2: 施設間連携議題

### 📝 質問内容
> 法人全体の議題（600点以上）以外で、複数施設に関わる議題はどう扱いますか？
> 例: 小原病院と立神リハビリの連携強化案（施設レベル議題だが2施設関連）

### ✅ 回答

**複数の方法で対応可能です。** 柔軟性を持たせた設計を採用します。

#### 方法1: タグ機能による対応（推奨）

```typescript
投稿作成時:
{
  title: "小原病院と立神リハビリの患者送迎連携強化案",
  facilityCode: "obara-hospital", // 主投稿施設
  tags: [
    "cross_facility",
    "tategami-rehabilitation", // 関連施設
    "patient_transfer",
    "collaboration"
  ],
  crossFacilityConfig: {
    relatedFacilities: ["tategami-rehabilitation"],
    votingScope: "both_facilities" // 両施設職員が投票可能
  }
}
```

**スコア閾値の解釈**:
```
0-29点   → 主施設の部署内
30-99点  → 主施設の部署内（両施設の該当部署が閲覧可能）
100-299点 → 🔄 両施設の全職員が投票可能（施設横断議題）
300点以上 → 法人全体（全3施設）
```

#### 方法2: 施設横断レベルの追加

AgendaLevelに新レベル追加を検討：

```typescript
export type AgendaLevel =
  | 'PENDING'              // 0-29点: 検討中
  | 'DEPT_REVIEW'          // 30-49点: 部署検討
  | 'DEPT_AGENDA'          // 50-99点: 部署議題
  | 'FACILITY_AGENDA'      // 100-299点: 施設議題
  | 'CROSS_FACILITY'       // 🆕 200-299点: 施設横断議題（2-3施設）
  | 'CORP_REVIEW'          // 300-599点: 法人検討
  | 'CORP_AGENDA';         // 600点以上: 法人議題

// 閾値調整案:
100-199点 → 単一施設議題
200-299点 → 施設横断議題（指定した2-3施設）
300点以上 → 法人全体議題
```

#### 方法3: 投票権限のカスタマイズ

Level 99管理者が投稿ごとに投票範囲を手動調整：

```typescript
// 管理者操作UI
{
  postId: "post_abc123",
  customVotingScope: {
    facilities: ["obara-hospital", "tategami-rehabilitation"],
    departments: ["看護部", "リハビリテーション部"],
    reason: "両施設の看護・リハ連携強化のため"
  }
}
```

#### 推奨実装方針

**Phase 1（現在）**:
- タグ機能 + `crossFacilityConfig` で対応
- Level 99が手動で投票範囲調整可能

**Phase 2（運用後3ヶ月）**:
- 施設横断議題の発生頻度を分析
- 必要に応じて `CROSS_FACILITY` レベルを追加

---

## 質問3: 兼任職員の投票権

### 📝 質問内容
> 兼任職員（例: 小原病院看護部 + 立神リハビリ非常勤）の投票権はどうなりますか？
> - 両施設で投票可能？
> - 主所属のみ？
> - 投票時に選択？

### ✅ 回答

**兼任職員は両方の所属で投票可能です。** 以下の仕様で実装します。

#### 1. User型の拡張

現在の単一所属から複数所属対応へ：

```typescript
// 現在（単一所属）
interface User {
  id: string;
  name: string;
  department: string;        // "看護部"
  facilityCode: string;      // "obara-hospital"
  permissionLevel: number;   // 3
}

// 拡張後（複数所属対応）
interface User {
  id: string;
  name: string;

  // 主所属
  primaryAffiliation: {
    facilityCode: string;           // "obara-hospital"
    department: string;             // "看護部"
    section?: string;               // "3階病棟"
    jobCategory: string;            // "nurse"
    employmentRate: number;         // 1.0（常勤）
    permissionLevel: number;        // 3
  };

  // 兼任所属（配列）
  secondaryAffiliations?: Array<{
    facilityCode: string;           // "tategami-rehabilitation"
    department: string;             // "看護部"
    section?: string;               // "医療療養病棟"
    jobCategory: string;            // "nurse"
    employmentRate: number;         // 0.3（週1.5日相当）
    permissionLevel: number;        // 3
  }>;
}
```

#### 2. 投票権の判定ロジック

```typescript
// AgendaLevelEngine.getAgendaPermissions の拡張

getAgendaPermissions(
  post: Post,
  currentUser: User,
  currentScore: number
): AgendaPermissions {
  // 主所属での権限チェック
  const primaryPermissions = this.checkPermissionByAffiliation(
    post,
    currentUser.primaryAffiliation,
    currentScore
  );

  // 兼任所属での権限チェック
  const secondaryPermissions = currentUser.secondaryAffiliations?.map(affiliation =>
    this.checkPermissionByAffiliation(post, affiliation, currentScore)
  ) || [];

  // いずれかの所属で権限があれば投票可能
  return {
    canView: primaryPermissions.canView || secondaryPermissions.some(p => p.canView),
    canVote: primaryPermissions.canVote || secondaryPermissions.some(p => p.canVote),
    canComment: primaryPermissions.canComment || secondaryPermissions.some(p => p.canComment),
    visibilityScope: this.getMergedScope(primaryPermissions, secondaryPermissions),
    affiliationContext: this.getVotingAffiliation(primaryPermissions, secondaryPermissions)
  };
}
```

#### 3. 投票時の所属選択UI

兼任職員が投票する際、どの所属として投票するか選択：

```typescript
// 投票コンポーネント
<VoteButton
  post={post}
  user={user}
  onVote={(voteType, selectedAffiliation) => {
    submitVote({
      postId: post.id,
      userId: user.id,
      voteType: voteType,
      affiliationContext: selectedAffiliation, // どの所属として投票したか
      facilityCode: selectedAffiliation.facilityCode,
      department: selectedAffiliation.department
    });
  }}
/>

// 投票時のUI
【投票確認】
あなたは複数の所属があります。どの立場で投票しますか？

○ 小原病院 看護部 3階病棟（主所属）
○ 立神リハビリテーション温泉病院 看護部 医療療養病棟（兼任）

[この立場で投票する]
```

#### 4. 重複投票の防止

```typescript
// 投票制限ロジック
{
  postId: "post_abc123",
  votes: [
    {
      userId: "user_xyz",
      affiliationContext: {
        facilityCode: "obara-hospital",
        department: "看護部"
      },
      voteType: "agree",
      timestamp: "2025-10-12T10:00:00Z"
    }
  ]
}

// 同一ユーザーの重複投票チェック
if (votes.some(v => v.userId === currentUser.id)) {
  return {
    error: "この投稿には既に投票済みです",
    previousVote: votes.find(v => v.userId === currentUser.id),
    action: "投票を変更する場合は既存の投票を削除してください"
  };
}
```

#### 5. 投票権重み付けの扱い

**当面は重み付けなし（1人1票）**:
```
理由:
- システムの複雑性を避ける
- 兼任比率による重み付けは運用負荷が高い
- 声を上げる文化醸成が優先（票数の正確性は二の次）

将来的な検討:
- 運用6ヶ月後に兼任職員の投票行動を分析
- 必要性が認められれば重み付け機能を追加
```

#### 6. Prisma Schemaへの反映

```prisma
// User型の拡張（将来的な実装）
model User {
  id                    String   @id @default(cuid())
  // ... 既存フィールド

  // 🆕 兼任対応
  primaryAffiliation    Json     @map("primary_affiliation")
  secondaryAffiliations Json?    @map("secondary_affiliations")
}

// Vote型の拡張
model Vote {
  id                   String   @id @default(cuid())
  // ... 既存フィールド

  // 🆕 投票時の所属コンテキスト
  affiliationContext   Json?    @map("affiliation_context")
  votedAsFacility      String?  @map("voted_as_facility")
  votedAsDepartment    String?  @map("voted_as_department")
}
```

---

## 📊 実装優先順位

### Phase 1（DB構築時）- 必須
1. ✅ 投票グループ動的変更機能（Level 99 UI）
2. ✅ 施設横断議題のタグ対応
3. ⏳ 兼任職員の複数所属対応（User型拡張）

### Phase 2（運用開始後1-3ヶ月）- 運用状況次第
1. ⏳ 施設横断レベル（CROSS_FACILITY）追加の要否判断
2. ⏳ 兼任職員の投票行動分析
3. ⏳ 投票グループ再編成の運用ルール策定

---

## 🔄 次のアクション

### 医療システムチームへのお願い

1. **この回答内容の確認**
   - 実装方針に問題がないかご確認ください
   - 追加質問・懸念事項があれば10/15までにご連絡ください

2. **兼任職員データ形式の協議**
   - User型拡張のDB設計について協議させてください
   - 医療システム側のEmployee/Staffテーブル構造の確認
   - API仕様（複数所属情報の提供方法）

3. **投票グループ再編成の運用ルール**
   - どのような場合に再編成が必要になるか
   - Level 10（部長）の提案権限の運用方法
   - 再編成時の医療システムへの通知要否

### VoiceDriveチーム側の作業

1. **Level 99管理者UI設計**（10/14-10/18）
   - 投票グループ管理画面のモックアップ作成
   - 医療システムチームへのレビュー依頼

2. **User型複数所属対応の実装計画**（10/21-10/25）
   - Prisma Schema拡張
   - AgendaLevelEngine拡張
   - 投票UIの所属選択機能

3. **施設横断議題のタグ機能実装**（10/28-11/1）
   - `crossFacilityConfig`フィールド追加
   - タグ検索・フィルタ機能
   - Level 99による投票範囲カスタマイズUI

---

## 📞 連絡体制

### 質問・確認事項の連絡先

**VoiceDriveチーム担当者**: [担当者名]
**Slack**: #voicedrive-integration
**緊急連絡**: DM

### フィードバック期限

**医療システムチームからのフィードバック**: 2025-10-15（火）17:00まで

以下の内容についてご確認・ご意見をお願いします：
- [ ] 投票グループ動的変更の仕様
- [ ] 施設間連携議題の対応方法
- [ ] 兼任職員の投票権の仕様
- [ ] User型拡張のDB設計方針

---

## 📝 まとめ

### ✅ 回答のポイント

1. **投票グループの動的変更**
   - Level 99管理者UIで柔軟に変更可能
   - 既存データは保持、新規データは新グループで処理
   - 再編成履歴を記録

2. **施設間連携議題**
   - タグ機能で柔軟に対応（推奨）
   - Level 99による投票範囲カスタマイズ
   - 運用実績に応じて`CROSS_FACILITY`レベル追加を検討

3. **兼任職員の投票権**
   - 複数所属対応（主所属+兼任所属）
   - 投票時に所属を選択
   - 当面は1人1票、将来的に重み付け検討

### 🎯 次のマイルストーン

- **10/15（火）**: 医療システムチームからのフィードバック
- **10/18（金）**: Level 99管理者UI設計完了
- **10/25（金）**: User型複数所属対応の実装計画完了
- **11/1（金）**: 施設横断議題タグ機能実装完了

---

**ご協力ありがとうございます！**

医療システムチームからの質問により、より実用的で柔軟な設計が実現できます。
引き続きよろしくお願いいたします。

---

**作成者**: VoiceDrive開発チーム
**作成日**: 2025-10-12
**バージョン**: 1.0
**ステータス**: 医療システムチーム確認待ち

**関連ドキュメント**:
- [組織情報収集依頼_医療システム返信書_20251012.md](組織情報収集依頼_医療システム返信書_20251012.md)
- [組織構造拡張実装_マスタープラン統合回答書_20251012.md](組織構造拡張実装_マスタープラン統合回答書_20251012.md)
- [投票グループ承認者機能_医療システム確認回答_20251012.md](投票グループ承認者機能_医療システム確認回答_20251012.md)
