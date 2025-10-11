# ProjectApproval 医療システム確認結果

**確認日**: 2025年10月11日
**対象ページ**: ProjectApproval (プロジェクト承認)
**確認者**: 医療職員管理システム開発チーム
**ドキュメントID**: MED-SYS-CONFIRM-PROJECT-APPROVAL-20251011
**ステータス**: ✅ 確認完了 - 医療システム側実装不要

---

## 1. エグゼクティブサマリー

### 1.1 確認結論

**医療職員管理システム側の追加実装は不要です。**

- ❌ **新規API実装**: 不要
- ❌ **新規テーブル作成**: 不要
- ❌ **既存API拡張**: 不要
- ✅ **既存データの利用**: User.permissionLevel（権限レベル）のみ使用（既存キャッシュ済み）

### 1.2 理由

ProjectApprovalは**プロジェクト提案を承認・却下し、プロジェクト化を判断する機能**であり、VoiceDrive内部のプロジェクト管理機能です。医療システムは職員の権限レベル情報の提供のみを行います（既にUser.permissionLevelとしてキャッシュ済み）。

#### 機能概要
```
プロジェクト投稿（VoiceDrive管理）
  ↓
投票・スコア計算（VoiceDrive管理）
  ↓
プロジェクトレベル判定（VoiceDrive管理）
  ↓
権限ベース承認フロー（VoiceDrive管理）
  ↓
承認履歴記録（VoiceDrive管理）

医療システムの役割：
- 職員権限レベル提供（User.permissionLevel - 既存キャッシュ）
```

### 1.3 データ責任分担

| 項目 | VoiceDrive | 医療システム |
|------|-----------|------------|
| プロジェクト投稿（Post） | ✅ 100% | ❌ なし |
| 投票データ（Vote） | ✅ 100% | ❌ なし |
| スコア計算 | ✅ 100% | ❌ なし |
| プロジェクトレベル判定 | ✅ 100% | ❌ なし |
| 承認履歴（ProjectApproval） | ✅ 100% | ❌ なし |
| 職員権限レベル | キャッシュのみ | ✅ マスタ管理 |

---

## 2. 暫定マスターリスト分析

### 2.1 VoiceDrive側実装内容

#### 2.1.1 新規テーブル（1個）

**ProjectApproval（プロジェクト承認履歴）**

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | String | 承認履歴ID |
| postId | String | プロジェクトID（Post.id） |
| approverId | String | 承認者ID（User.id） |
| approverName | String | 承認者名（キャッシュ） |
| approverLevel | Float | 承認時の権限レベル（キャッシュ） |
| action | String | アクション（approved/rejected/held/emergency_override） |
| reason | String? | 理由（却下・保留時） |
| comment | String? | コメント |
| projectLevel | String | プロジェクトレベル（PENDING/TEAM/DEPARTMENT/FACILITY/ORGANIZATION） |
| projectScore | Int | 承認時のスコア |
| totalVotes | Int | 承認時の総投票数 |
| supportRate | Float | 承認時の支持率（%） |
| isEmergencyOverride | Boolean | 緊急介入フラグ |
| createdAt | DateTime | 作成日時 |

#### 2.1.2 既存テーブル拡張（1個）

**Post（プロジェクトステータス拡張）**

| 新規フィールド | 型 | 説明 |
|--------------|---|------|
| approvalStatus | String | 承認ステータス（pending/approved/rejected/on_hold/team_formation） |
| approvedAt | DateTime? | 承認日時 |
| approvedBy | String? | 承認者ID |
| rejectedAt | DateTime? | 却下日時 |
| rejectedBy | String? | 却下者ID |
| rejectionReason | String? | 却下理由 |

#### 2.1.3 VoiceDrive側API（6個）

1. **POST /api/project-approval/approve** - プロジェクト承認
2. **POST /api/project-approval/reject** - プロジェクト却下
3. **POST /api/project-approval/hold** - プロジェクト保留
4. **POST /api/project-approval/emergency-override** - 緊急介入（上位者専用）
5. **GET /api/project-approval/approvable** - 承認可能なプロジェクト一覧取得
6. **GET /api/project-approval/history/:postId** - プロジェクト承認履歴取得

### 2.2 プロジェクトレベルとスコア計算

#### 2.2.1 スコア計算ロジック

投票重み付け：
- 強く賛成 (`strongly-support`): +2
- 賛成 (`support`): +1
- 中立 (`neutral`): 0
- 反対 (`oppose`): -1
- 強く反対 (`strongly-oppose`): -2

#### 2.2.2 プロジェクトレベル判定基準

| プロジェクトレベル | スコア範囲 | 承認者権限レベル | 承認者役職 | 説明 |
|------------------|-----------|----------------|-----------|------|
| PENDING | 0-99点 | 6 | 主任 | アイデア検討中 |
| TEAM | 100-199点 | 8 | 師長・科長 | チームプロジェクト（5-15名） |
| DEPARTMENT | 200-399点 | 10 | 部長・医局長 | 部署プロジェクト（15-30名） |
| FACILITY | 400-799点 | 11 | 事務長 | 施設プロジェクト（30-60名） |
| ORGANIZATION | 800点以上 | 13 | 院長・施設長 | 法人プロジェクト（60名以上） |
| STRATEGIC | 戦略指定 | 18 | 理事長 | 戦略プロジェクト（理事長承認） |

**⚠️ 2025-10-11更新**: 組織階層に合わせて承認者レベルを調整（VoiceDrive側変更）

### 2.3 権限ベース承認ロジック

#### 2.3.1 権限判定パターン

**承認者（Approver）**:
- `userLevel === responsibility.targetPermissionLevel`
- プロジェクト開始を承認できる
- バッジ: "✅ 承認者"

**フォールバック承認者**:
- `userLevel >= responsibility.minPermissionLevel && userLevel < responsibility.targetPermissionLevel`
- 本来の承認者が不在の場合に承認可能
- バッジ: "✅ 承認者（代行）"

**上位監督者（Supervisor）**:
- `userLevel > responsibility.targetPermissionLevel && (userLevel - targetLevel) <= 2`
- アドバイス可能、緊急介入可能
- バッジ: "👁️ 上位者（閲覧・アドバイス）"

**参考閲覧者（Observer）**:
- その他の権限レベル
- 閲覧のみ
- バッジ: "📖 参考閲覧" または "📖 参考閲覧（学習）"

#### 2.3.2 緊急介入（Emergency Override）

- 上位者が権限外のプロジェクトに緊急介入可能
- `permission.canEmergencyOverride === true`
- 監査ログに重要度`critical`で記録
- `ProjectApproval.isEmergencyOverride = true`

---

## 3. 医療システム連携分析

### 3.1 必要なAPI

| API | 用途 | 頻度 | 備考 |
|-----|------|------|------|
| なし | - | - | **医療システムAPIは不要** |

### 3.2 使用する既存キャッシュデータ

| データ | 元テーブル | キャッシュ先 | 更新頻度 |
|--------|----------|------------|---------|
| 職員権限レベル | medical_staff.employees | voicedrive.User.permissionLevel | 日次バッチ |

**結論**: ProjectApprovalページは **VoiceDrive内部データのみで完結** します。医療システムとの新規連携は不要です。

**理由**:
- プロジェクトデータ（Post）は VoiceDrive が管理
- 投票データ（Vote）は VoiceDrive が管理
- 承認データ（ProjectApproval）は VoiceDrive が管理
- 職員情報（User）は既にキャッシュ済み（権限レベル含む）

---

## 4. VoiceDrive側実装推奨事項

### 4.1 データベース設計推奨事項（優先度: 🔴 最高）

#### 4.1.1 複合インデックス追加（パフォーマンス最適化）

```prisma
model Post {
  // ... 既存フィールド

  @@index([approvalStatus, createdAt])  // 承認待ちプロジェクト取得用
}

model ProjectApproval {
  // ... 既存フィールド

  @@index([postId, createdAt])  // 承認履歴時系列取得用
  @@index([approverId, projectLevel])  // 承認者別レベル別統計取得用
}
```

**効果**:
- 承認待ちプロジェクト一覧のクエリ速度 10-50倍向上
- 承認履歴取得のクエリ速度 5-20倍向上

#### 4.1.2 トランザクション処理の徹底

```typescript
// 承認処理はトランザクション必須
return prisma.$transaction(async (tx) => {
  // 1. Post更新
  const updatedPost = await tx.post.update({
    where: { id: postId },
    data: { approvalStatus: 'approved', approvedAt, approvedBy }
  });

  // 2. ProjectApproval作成
  const approval = await tx.projectApproval.create({
    data: { /* ... */ }
  });

  return { post: updatedPost, approval };
});
```

**理由**: Post更新とProjectApproval作成は必ず同時に成功/失敗する必要がある

### 4.2 サービス層実装推奨事項（優先度: 🔴 最高）

#### 4.2.1 ProjectApprovalService の実装

必須メソッド:
- `approveProject(postId, approverId, comment?)` - プロジェクト承認
- `rejectProject(postId, approverId, reason)` - プロジェクト却下
- `holdProject(postId, approverId, reason)` - プロジェクト保留
- `emergencyOverride(postId, approverId)` - 緊急介入
- `getApprovableProjects(userId, filter)` - 承認可能なプロジェクト取得
- `calculateScore(votes)` - スコア計算（private）
- `getProjectLevel(score)` - プロジェクトレベル判定（private）

#### 4.2.2 権限チェックロジックの実装

```typescript
// 権限チェック例
const permission = projectPermissionService.getPermission(user, projectLevel);
if (!permission.canApprove) {
  throw new ProjectApprovalError(
    'このプロジェクトを承認する権限がありません',
    'INSUFFICIENT_PERMISSION',
    403
  );
}
```

### 4.3 API実装推奨事項（優先度: 🔴 最高）

#### 4.3.1 認証・認可ミドルウェア

```typescript
export const requireProjectApprovalPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  // 権限レベルチェック（最低3.5必要）
  if (user.permissionLevel < 3.5) {
    return res.status(403).json({
      error: 'プロジェクト承認機能を利用する権限がありません'
    });
  }

  next();
};
```

#### 4.3.2 エラーレスポンスの統一

```typescript
// エラーレスポンス例
{
  "error": {
    "code": "INSUFFICIENT_PERMISSION",
    "message": "このプロジェクトを承認する権限がありません",
    "statusCode": 403
  }
}
```

### 4.4 監査ログ実装推奨事項（優先度: 🔴 最高）

#### 4.4.1 監査ログ重要度設定

| アクション | severity | 理由 |
|----------|----------|------|
| PROJECT_APPROVED | high | プロジェクト開始は重要な意思決定 |
| PROJECT_REJECTED | medium | 却下も記録が必要 |
| PROJECT_HELD | low | 保留は一時的な判断 |
| PROJECT_EMERGENCY_OVERRIDE | critical | 権限外の介入は最重要 |
| PROJECT_TEAM_FORMATION_STARTED | medium | チーム編成開始 |

#### 4.4.2 監査ログ記録実装例

```typescript
// 承認時
AuditService.log({
  action: 'PROJECT_APPROVED',
  targetId: postId,
  targetType: 'Post',
  severity: 'high',
  details: {
    projectLevel,
    projectScore,
    approverLevel: approver.permissionLevel,
    comment
  }
});

// 緊急介入時
AuditService.log({
  action: 'PROJECT_EMERGENCY_OVERRIDE',
  targetId: postId,
  targetType: 'Post',
  severity: 'critical',
  details: {
    projectLevel,
    projectScore,
    approverLevel: approver.permissionLevel,
    reason: '上位者による緊急介入'
  }
});
```

### 4.5 フロントエンド実装推奨事項（優先度: 🟠 高）

#### 4.5.1 useProjectApproval カスタムフック

```typescript
export const useProjectApproval = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveProject = async (postId: string, comment?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/project-approval/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ postId, comment })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'プロジェクト承認に失敗しました');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ... 他のメソッド

  return {
    approveProject,
    rejectProject,
    holdProject,
    emergencyOverride,
    fetchApprovableProjects,
    isLoading,
    error
  };
};
```

#### 4.5.2 確認ダイアログ実装

- 却下理由入力ダイアログ（必須）
- 保留理由入力ダイアログ（必須）
- 緊急介入警告ダイアログ（監査ログ記録の警告）

#### 4.5.3 通知・トースト実装

- 成功通知: "プロジェクトを承認しました"
- エラー通知: "承認に失敗しました: [理由]"
- 警告通知: "この操作は監査ログに記録されました（緊急介入）"

---

## 5. テスト推奨事項

### 5.1 ユニットテスト（優先度: 🔴 最高）

#### 5.1.1 ProjectApprovalService テスト

必須テストケース（20ケース以上）:

**承認処理**:
- ✅ 権限を持つユーザーがプロジェクトを承認できる
- ✅ 権限がないユーザーは承認できない
- ✅ 承認時にPost.approvalStatusが'approved'になる
- ✅ 承認時にProjectApprovalレコードが作成される
- ✅ 承認時に監査ログが記録される（severity: high）

**却下処理**:
- ✅ 権限を持つユーザーがプロジェクトを却下できる
- ✅ 却下理由が必須である
- ✅ 却下時にPost.approvalStatusが'rejected'になる
- ✅ 却下時にProjectApprovalレコードが作成される
- ✅ 却下時に監査ログが記録される（severity: medium）

**保留処理**:
- ✅ 権限を持つユーザーがプロジェクトを保留できる
- ✅ 保留理由が必須である
- ✅ 保留時にPost.approvalStatusが'on_hold'になる

**緊急介入**:
- ✅ 上位者が緊急介入できる
- ✅ 権限がないユーザーは緊急介入できない
- ✅ 緊急介入時にisEmergencyOverrideがtrueになる
- ✅ 緊急介入時に監査ログが記録される（severity: critical）

**スコア計算**:
- ✅ 各投票パターンで正しいスコアが計算される
- ✅ プロジェクトレベルが正しく判定される（PENDING/TEAM/DEPARTMENT/FACILITY/ORGANIZATION）

### 5.2 API統合テスト（優先度: 🔴 最高）

必須テストケース（15ケース以上）:

**POST /api/project-approval/approve**:
- ✅ 正常系: 承認成功
- ✅ 異常系: postIdがない場合は400エラー
- ✅ 異常系: 認証なしの場合は401エラー
- ✅ 異常系: 権限がない場合は403エラー

**POST /api/project-approval/reject**:
- ✅ 正常系: 却下成功
- ✅ 異常系: reasonがない場合は400エラー

**POST /api/project-approval/emergency-override**:
- ✅ 正常系: 緊急介入成功（上位者）
- ✅ 異常系: 権限がない場合は403エラー

**GET /api/project-approval/approvable**:
- ✅ 正常系: 承認可能なプロジェクト一覧取得
- ✅ フィルタ: projectLevelでフィルタリング
- ✅ ページング: limit/offsetが正しく動作

### 5.3 E2Eテスト（優先度: 🟠 高）

必須シナリオ（5シナリオ以上）:

1. **承認フロー**:
   - ログイン（Level 8ユーザー）
   - プロジェクト承認ページへ移動
   - 承認可能フィルター選択
   - プロジェクト承認
   - 成功通知確認

2. **却下フロー**:
   - ログイン（Level 8ユーザー）
   - プロジェクト承認ページへ移動
   - プロジェクト却下ボタンをクリック
   - 却下理由入力
   - 却下確認
   - 成功通知確認

3. **緊急介入フロー**:
   - ログイン（Level 18ユーザー）
   - プロジェクト承認ページへ移動
   - 緊急介入モードボタンをクリック
   - 警告ダイアログ確認
   - 緊急承認確認
   - 成功通知確認

4. **権限チェック**:
   - Level 3ユーザーでログイン
   - プロジェクト承認ページへ移動
   - TEAMレベルプロジェクトが表示されない
   - 承認ボタンが表示されない

5. **プロジェクトレベル別表示**:
   - Level 8ユーザーでログイン
   - DEPARTMENTフィルター選択
   - DEPARTMENTレベルのプロジェクトのみ表示される

### 5.4 パフォーマンステスト（優先度: 🟡 中）

#### 5.4.1 複合インデックス効果検証

```sql
-- EXPLAIN ANALYZEで実行計画確認
EXPLAIN ANALYZE
SELECT * FROM "Post"
WHERE "approvalStatus" = 'pending' AND "type" = 'improvement'
ORDER BY "createdAt" DESC
LIMIT 10;

-- 期待結果: Index Scan using Post_approvalStatus_createdAt_idx
-- 実行時間: < 50ms
```

#### 5.4.2 負荷テスト

- 承認可能プロジェクト一覧取得: < 500ms
- プロジェクト承認処理: < 300ms
- 10,000プロジェクト中から承認可能プロジェクト取得: < 100ms

---

## 6. リスク・注意事項

### 6.1 パフォーマンスリスク（優先度: 🟠 高）

**リスク**: 複合インデックス未追加の場合、データ増加に伴いクエリ速度が著しく低下

**影響**:
- Postテーブルが10,000件超過時: 1-3秒のクエリ遅延
- 承認待ちプロジェクト一覧表示が著しく遅延
- ユーザーエクスペリエンスの著しい低下

**対策**:
- ✅ 必ず複合インデックスを追加してから実装開始
- ✅ 実装後にEXPLAIN ANALYZEで実行計画確認
- ✅ 本番環境でパフォーマンス監視設定

### 6.2 権限チェック漏れリスク（優先度: 🔴 最高）

**リスク**: 権限チェックが不十分で、権限外のユーザーがプロジェクトを承認できてしまう

**影響**:
- 権限外の承認による業務混乱
- セキュリティインシデント
- 監査上の問題

**対策**:
- ✅ 全てのAPI呼び出しで権限チェックを実施
- ✅ フロントエンドとバックエンドの両方で権限チェック
- ✅ 各権限レベルでの徹底テスト

### 6.3 監査ログ欠損リスク（優先度: 🟠 高）

**リスク**: 承認・却下・緊急介入の監査ログが記録されない

**影響**:
- 監査証跡の欠如
- コンプライアンス違反
- 問題発生時の原因追跡不能

**対策**:
- ✅ 全てのアクションで監査ログを記録
- ✅ トランザクション内で監査ログも記録
- ✅ 監査ログ記録の統合テスト

### 6.4 データ整合性リスク（優先度: 🟠 高）

**リスク**: Post更新とProjectApproval作成が同時に成功/失敗しない

**影響**:
- Postは承認済みだがProjectApprovalレコードがない
- データ不整合
- 承認履歴の欠損

**対策**:
- ✅ 必ずトランザクション処理を使用
- ✅ トランザクション失敗時のロールバック確認
- ✅ データ整合性のテスト

---

## 7. 実装スケジュール

### Phase 1: DB・サービス層実装（2日間）

**Day 1**: 10/11金
- [x] DB要件分析書作成 ✅
- [ ] 医療システム確認結果作成 ← 今ここ
- [ ] ProjectApprovalテーブル追加（Prisma schema更新）
- [ ] Post拡張フィールド追加（approvalStatus等）
- [ ] マイグレーション実行
- [ ] ProjectApprovalService 実装
  - approveProject()
  - rejectProject()
  - holdProject()
  - emergencyOverride()
  - getApprovableProjects()
- [ ] ユニットテスト作成

**Day 2**: 10/14月
- [ ] API実装（6エンドポイント）
- [ ] APIテスト

### Phase 2: フロントエンド統合（1日間）

**Day 3**: 10/15火
- [ ] ProjectApprovalPage.tsx 修正
- [ ] useProjectApproval() カスタムフック作成
- [ ] エラーハンドリング実装
- [ ] 確認ダイアログ実装

### Phase 3: テスト・デプロイ（1日間）

**Day 4**: 10/16水
- [ ] 統合テスト
- [ ] 権限チェックテスト
- [ ] 監査ログ確認
- [ ] パフォーマンステスト
- [ ] 本番デプロイ

**合計**: 4日間（1週間以内）

---

## 8. まとめ

### 8.1 医療システム側の対応

✅ **追加実装不要**: 医療システムAPIは一切使用しません
✅ **既存機能で対応可能**: User.permissionLevelは既にキャッシュ済み

### 8.2 VoiceDrive側の実装要件

- 🔧 **新規テーブル追加**: ProjectApproval（承認履歴管理）
- 🔧 **既存テーブル拡張**: Post（承認ステータスフィールド追加）
- 🔧 **複合インデックス追加**: 2個（パフォーマンス最適化）
- 🔧 **API実装**: 6エンドポイント
- 📊 **ユニットテスト**: 20ケース以上
- 📊 **API統合テスト**: 15ケース以上
- 📊 **E2Eテスト**: 5シナリオ以上

### 8.3 実装優先度

1. **Phase 1（必須）**: DB・サービス層実装 + ユニットテスト
2. **Phase 2（推奨）**: API実装 + フロントエンド統合
3. **Phase 3（必須）**: テスト + デプロイ

**推定工数**: 4日間（Phase 1-3）

---

**承認状態**: VoiceDriveチームレビュー待ち
**次のアクション**: VoiceDriveチームによる実装スケジュール確定

---

**添付ファイル**:
- `ProjectApproval_DB要件分析_20251011.md`（DB設計詳細）
- `ProjectApproval_暫定マスターリスト_20251011.md`（実装タスクリスト）

**関連ドキュメント**:
- `共通DB構築後_作業再開指示書_20250928.md`（更新対象）
- `DB構築計画書前準備_不足項目整理_20251008.md`（更新対象）

---

**文書終了**

最終更新: 2025年10月11日
次のステップ: DB構築計画書の更新
