# ProgressDashboard（進捗ダッシュボード）医療システム確認結果

**確認日**: 2025年10月11日
**対象ページ**: ProgressDashboard（進捗ダッシュボード）
**確認者**: 医療職員管理システム開発チーム
**ドキュメントID**: MED-SYS-CONFIRM-PROGRESS-DASHBOARD-20251011
**ステータス**: ✅ 確認完了 - 医療システム側新規実装不要

---

## 1. エグゼクティブサマリー

### 1.1 確認結論

**医療職員管理システム側の新規実装は不要です。**

- ❌ **新規API実装**: 不要
- ❌ **新規テーブル作成**: 不要
- ❌ **既存API拡張**: 不要
- ✅ **既存APIの利用**: facilities/departments/employees（既存APIをそのまま使用）

### 1.2 理由

ProgressDashboardは**複数部署・施設全体のプロジェクト進捗を俯瞰的に管理する機能**であり、VoiceDrive内部のプロジェクト管理機能です。医療システムは施設マスター・部門マスター・職員情報の提供のみを行います（既存APIで対応可能）。

#### 機能概要
```
プロジェクト一覧表示（VoiceDrive管理）
  ↓
マイルストーン管理（VoiceDrive管理）
  ↓
チームメンバー管理（VoiceDrive管理）
  ↓
進捗計算・遅延判定（VoiceDrive管理）
  ↓
統計サマリー表示（VoiceDrive管理）

医療システムの役割：
- 施設マスター提供（GET /api/v2/facilities - 既存API）
- 部門マスター提供（GET /api/v2/departments - 既存API）
- 職員情報提供（GET /api/v2/employees/{id} - 既存API）
```

### 1.3 データ責任分担

| 項目 | VoiceDrive | 医療システム |
|------|-----------|------------|
| プロジェクト情報（Post） | ✅ 100% | ❌ なし |
| マイルストーン（ProjectMilestone） | ✅ 100% | ❌ なし |
| チームメンバー（ProjectTeamMember） | ✅ 100% | ❌ なし |
| 進捗計算 | ✅ 100% | ❌ なし |
| 遅延判定 | ✅ 100% | ❌ なし |
| 施設マスター | キャッシュのみ | ✅ マスタ管理 |
| 部門マスター | キャッシュのみ | ✅ マスタ管理 |
| 職員情報 | キャッシュのみ | ✅ マスタ管理 |

---

## 2. 暫定マスターリスト分析

### 2.1 VoiceDrive側実装内容

#### 2.1.1 新規テーブル（2個）

**ProjectMilestone（プロジェクトマイルストーン）**

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | String | マイルストーンID |
| projectId | String | プロジェクトID（Post.id） |
| title | String | マイルストーン名 |
| description | String? | 説明 |
| dueDate | DateTime | 期限日時 |
| completedAt | DateTime? | 完了日時 |
| completedBy | String? | 完了者ID（User.id） |
| status | String | ステータス（pending/in_progress/completed/cancelled） |
| order | Int | 表示順序 |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

**ProjectTeamMember（プロジェクトチームメンバー）**

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | String | メンバーID |
| projectId | String | プロジェクトID（Post.id） |
| userId | String | ユーザーID（User.id） |
| role | String | 役割（leader/sub_leader/member/observer） |
| joinedAt | DateTime | 参加日時 |
| leftAt | DateTime? | 退出日時 |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

#### 2.1.2 既存テーブル拡張（1個）

**Post（プロジェクト管理フィールド追加）**

| 新規フィールド | 型 | 説明 |
|--------------|---|------|
| projectDueDate | DateTime? | プロジェクト期限 |
| projectLevel | String? | プロジェクトレベル（team/department/facility/organization） |
| projectProgress | Int? | 進捗率（0-100） |

#### 2.1.3 VoiceDrive側API（3個）

1. **GET /api/progress-dashboard/projects** - プロジェクト一覧取得
2. **GET /api/progress-dashboard/stats** - 統計サマリー取得
3. **GET /api/progress-dashboard/projects/:projectId/milestones** - マイルストーン一覧取得

### 2.2 権限ベースアクセス制御

#### 2.2.1 アクセス権限レベル

**対象ユーザー**: Level 10+（部長以上）

| ユーザーレベル | アクセス範囲 | 説明 |
|--------------|------------|------|
| Level 10（部長） | 自部門のみ | 自部門のプロジェクトのみ表示 |
| Level 11（事務長） | 自施設のみ | 自施設のプロジェクトのみ表示 |
| Level 12（副院長） | 自施設のみ | 自施設のプロジェクトのみ表示 |
| Level 13+（院長・理事） | 全施設 | 全施設のプロジェクトを表示可能 |

#### 2.2.2 アクセス制御ロジック

```typescript
// Level 10（部長）: 自部門のみ
if (user.level === 10) {
  where.author = {
    facilityId: user.facilityId,
    departmentId: user.departmentId
  };
}

// Level 11-12（事務長・副院長）: 自施設のみ
else if (user.level >= 11 && user.level < 13) {
  where.author = {
    facilityId: user.facilityId
  };
}

// Level 13+（院長・理事）: 全施設アクセス可能
// フィルタなし
```

### 2.3 進捗計算・遅延判定ロジック

#### 2.3.1 進捗率計算

```typescript
// マイルストーン完了率から自動計算
const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
const totalMilestones = project.milestones.length;

const progress = totalMilestones > 0
  ? Math.round((completedMilestones / totalMilestones) * 100)
  : project.projectProgress || 0;
```

#### 2.3.2 遅延判定

```typescript
// 期限日時 < 現在日時 && status !== 'completed'
const now = new Date();
const isDelayed = project.projectDueDate &&
                 project.projectDueDate < now &&
                 project.status !== 'completed';
```

---

## 3. 医療システム連携分析

### 3.1 使用する既存API

| API | 用途 | 頻度 | 備考 |
|-----|------|------|------|
| GET /api/v2/facilities | 施設マスター取得 | 初回読み込み時 | プロジェクトレベル判定・施設名表示 |
| GET /api/v2/departments | 部門マスター取得 | 初回読み込み時 | プロジェクトレベル判定・部門名表示 |
| GET /api/v2/employees/{id} | 職員情報取得 | 必要時 | チームメンバー詳細表示、権限確認 |

### 3.2 APIの使用目的

#### 3.2.1 GET /api/v2/facilities

**使用箇所**:
- プロジェクト一覧表示時の施設名表示
- プロジェクトレベル判定（FACILITY/ORGANIZATION）

**呼び出しパターン**:
```typescript
// 初回読み込み時に全施設取得してキャッシュ
const response = await fetch('/api/v2/facilities', {
  headers: {
    'Authorization': `Bearer ${JWT_TOKEN}`,
    'X-API-Key': API_KEY
  }
});

const facilities = await response.json();
// VoiceDrive内部でキャッシュ保持（日次更新）
```

#### 3.2.2 GET /api/v2/departments

**使用箇所**:
- プロジェクト一覧表示時の部門名表示
- プロジェクトレベル判定（DEPARTMENT）

**呼び出しパターン**:
```typescript
// 初回読み込み時に全部門取得してキャッシュ
const response = await fetch('/api/v2/departments', {
  headers: {
    'Authorization': `Bearer ${JWT_TOKEN}`,
    'X-API-Key': API_KEY
  }
});

const departments = await response.json();
// VoiceDrive内部でキャッシュ保持（日次更新）
```

#### 3.2.3 GET /api/v2/employees/{id}

**使用箇所**:
- チームメンバー詳細情報表示
- ユーザー権限レベル確認（Level 10+チェック）

**呼び出しパターン**:
```typescript
// 必要時に個別取得（User.permissionLevelがキャッシュされていない場合）
const response = await fetch(`/api/v2/employees/${employeeId}`, {
  headers: {
    'Authorization': `Bearer ${JWT_TOKEN}`,
    'X-API-Key': API_KEY
  }
});

const employee = await response.json();
// 権限レベル確認に使用
```

### 3.3 新規API不要の理由

**結論**: ProgressDashboardページは **既存医療システムAPIのみで完結** します。

**理由**:
- ✅ 施設マスター・部門マスター・職員情報は既存APIで取得可能
- ✅ プロジェクトデータはすべてVoiceDrive内部で管理
- ✅ 進捗計算・遅延判定はVoiceDrive内部で実施
- ✅ 権限レベル（User.permissionLevel）は既にキャッシュ済み

---

## 4. VoiceDrive側実装推奨事項

### 4.1 データベース設計推奨事項（優先度: 🔴 最高）

#### 4.1.1 複合インデックス追加（パフォーマンス最適化）

```prisma
model Post {
  // ... 既存フィールド

  @@index([type, status, createdAt])  // プロジェクト一覧取得用
  @@index([projectDueDate])            // 期限ソート・遅延判定用
  @@index([projectLevel])              // レベル別フィルタリング用
}

model ProjectMilestone {
  // ... 既存フィールド

  @@index([projectId])         // プロジェクト別マイルストーン取得用
  @@index([status])            // ステータス別絞り込み用
  @@index([dueDate])           // 期限ソート用
}

model ProjectTeamMember {
  // ... 既存フィールド

  @@index([projectId])         // プロジェクト別メンバー取得用
  @@index([userId])            // ユーザー別プロジェクト取得用
  @@index([role])              // 役割別絞り込み用
}
```

**効果**:
- プロジェクト一覧取得のクエリ速度 10-50倍向上
- マイルストーン取得のクエリ速度 5-20倍向上
- 遅延判定のクエリ速度 10-30倍向上

#### 4.1.2 N+1クエリ対策

```typescript
// ❌ NG: N+1クエリ発生
const projects = await prisma.post.findMany({ where: { type: 'project' } });
for (const project of projects) {
  const milestones = await prisma.projectMilestone.findMany({
    where: { projectId: project.id }
  });
}

// ✅ OK: includeで一括取得
const projects = await prisma.post.findMany({
  where: { type: 'project' },
  include: {
    milestones: true,
    teamMembers: true,
    _count: {
      select: {
        milestones: true,
        teamMembers: true
      }
    }
  }
});
```

### 4.2 サービス層実装推奨事項（優先度: 🔴 最高）

#### 4.2.1 ProgressDashboardService の実装

必須メソッド:
- `getAccessibleProjects(userId, filter, options)` - アクセス可能なプロジェクト一覧取得
- `getProjectStats(userId, options)` - プロジェクト統計取得
- `getProjectMilestones(projectId, userId)` - プロジェクトマイルストーン取得

#### 4.2.2 権限チェックロジックの実装

```typescript
// Level 10+チェック
if (user.level < 10) {
  throw new Error('Level 10+ required for ProgressDashboard');
}

// 権限ベースフィルタリング
if (user.level === 10) {
  // 部長: 自部門のみ
  where.author = {
    facilityId: user.facilityId,
    departmentId: user.departmentId
  };
} else if (user.level >= 11 && user.level < 13) {
  // 事務長・副院長: 自施設のみ
  where.author = {
    facilityId: user.facilityId
  };
}
// Level 13+: 全施設アクセス可能（フィルタなし）
```

#### 4.2.3 進捗計算の効率化

```typescript
// 並列クエリで高速化
const [total, active, completed, allProjects] = await Promise.all([
  prisma.post.count({ where }),
  prisma.post.count({ where: { ...where, status: 'active' } }),
  prisma.post.count({ where: { ...where, status: 'completed' } }),
  prisma.post.findMany({
    where,
    include: {
      milestones: {
        select: { status: true }
      }
    }
  })
]);
```

### 4.3 API実装推奨事項（優先度: 🔴 最高）

#### 4.3.1 認証・認可ミドルウェア

```typescript
export const requireProgressDashboardPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  // Level 10+チェック
  if (user.permissionLevel < 10) {
    return res.status(403).json({
      error: 'このページは部長以上のみアクセス可能です',
      details: `User level: ${user.permissionLevel}, Required: 10+`
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
    "code": "FORBIDDEN",
    "message": "このページは部長以上のみアクセス可能です",
    "details": "User level: 8, Required: 10+",
    "statusCode": 403
  }
}
```

### 4.4 フロントエンド実装推奨事項（優先度: 🟠 高）

#### 4.4.1 useProgressDashboard カスタムフック

```typescript
export function useProgressDashboard(
  filter: 'all' | 'active' | 'completed' | 'delayed',
  options?: {
    facilityId?: string;
    departmentId?: string;
  }
) {
  const queryParams = new URLSearchParams({
    filter,
    ...(options?.facilityId && { facilityId: options.facilityId }),
    ...(options?.departmentId && { departmentId: options.departmentId })
  });

  // プロジェクト一覧取得
  const { data: projectsData, error: projectsError, isLoading: projectsLoading } = useSWR(
    `/api/progress-dashboard/projects?${queryParams.toString()}`
  );

  // 統計サマリー取得（1分ごとに自動更新）
  const { data: statsData, error: statsError, isLoading: statsLoading } = useSWR(
    `/api/progress-dashboard/stats?${queryParams.toString()}`,
    { refreshInterval: 60000 }
  );

  return {
    projects: projectsData?.data || [],
    pagination: projectsData?.pagination,
    stats: statsData?.data,
    isLoading: projectsLoading || statsLoading,
    error: projectsError || statsError
  };
}
```

#### 4.4.2 リアルタイム更新

```typescript
// 統計サマリーは1分ごとに自動更新
const { data: statsData } = useSWR(
  '/api/progress-dashboard/stats',
  { refreshInterval: 60000 }
);
```

#### 4.4.3 遅延プロジェクトの視覚的強調

```typescript
// 遅延プロジェクトを赤色で表示
<div className={`project-card ${project.isDelayed ? 'border-red-500 bg-red-50' : ''}`}>
  {project.isDelayed && (
    <div className="text-red-600 font-bold">⚠️ 遅延</div>
  )}
</div>
```

---

## 5. テスト推奨事項

### 5.1 ユニットテスト（優先度: 🔴 最高）

#### 5.1.1 ProgressDashboardService テスト

必須テストケース（15ケース以上）:

**アクセス制御**:
- ✅ Level 9ユーザーはアクセス不可（403エラー）
- ✅ Level 10ユーザーは自部門のみアクセス可能
- ✅ Level 11ユーザーは自施設のみアクセス可能
- ✅ Level 13ユーザーは全施設アクセス可能

**進捗計算**:
- ✅ マイルストーン完了率から正しく進捗率が計算される
- ✅ マイルストーンがない場合はprojectProgressが使用される

**遅延判定**:
- ✅ 期限超過かつ未完了のプロジェクトが遅延判定される
- ✅ 期限超過でも完了済みのプロジェクトは遅延判定されない
- ✅ 期限前のプロジェクトは遅延判定されない

**統計計算**:
- ✅ 総プロジェクト数が正しく計算される
- ✅ 進行中・完了・遅延の件数が正しく計算される
- ✅ 平均進捗率が正しく計算される

### 5.2 API統合テスト（優先度: 🔴 最高）

必須テストケース（12ケース以上）:

**GET /api/progress-dashboard/projects**:
- ✅ 正常系: プロジェクト一覧取得成功
- ✅ 異常系: 認証なしの場合は401エラー
- ✅ 異常系: Level 9の場合は403エラー
- ✅ フィルタ: filter=activeで進行中のみ取得
- ✅ フィルタ: filter=delayedで遅延のみ取得
- ✅ ページング: limit/offsetが正しく動作

**GET /api/progress-dashboard/stats**:
- ✅ 正常系: 統計サマリー取得成功
- ✅ 異常系: Level 9の場合は403エラー
- ✅ 統計: total/active/completed/delayed/avgProgressが正しい

**GET /api/progress-dashboard/projects/:projectId/milestones**:
- ✅ 正常系: マイルストーン一覧取得成功
- ✅ 異常系: 存在しないprojectIdの場合は404エラー
- ✅ 異常系: アクセス権限のないプロジェクトの場合は403エラー

### 5.3 権限テスト（優先度: 🔴 最高）

```typescript
describe('ProgressDashboard Permission Tests', () => {
  it('Level 10は自部門のみアクセス可能', async () => {
    const response = await fetch('/api/progress-dashboard/projects', {
      headers: { Authorization: `Bearer ${level10DeptAToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    // すべてのプロジェクトが自部門のもの
    data.data.forEach((project: any) => {
      expect(project.author.departmentId).toBe('dept-A');
    });
  });

  it('Level 13は全施設アクセス可能', async () => {
    const response = await fetch('/api/progress-dashboard/projects', {
      headers: { Authorization: `Bearer ${level13Token}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    // 複数施設のプロジェクトが含まれる
    const facilities = [...new Set(data.data.map((p: any) => p.author.facilityId))];
    expect(facilities.length).toBeGreaterThan(1);
  });
});
```

### 5.4 パフォーマンステスト（優先度: 🟡 中）

#### 5.4.1 複合インデックス効果検証

```sql
-- EXPLAIN ANALYZEで実行計画確認
EXPLAIN ANALYZE
SELECT * FROM "Post"
WHERE "type" = 'project' AND "status" = 'active'
ORDER BY "createdAt" DESC
LIMIT 10;

-- 期待結果: Index Scan using Post_type_status_createdAt_idx
-- 実行時間: < 50ms
```

#### 5.4.2 負荷テスト

- プロジェクト一覧取得: < 500ms
- 統計サマリー取得: < 300ms
- 1,000プロジェクトでの一覧取得: < 100ms

---

## 6. リスク・注意事項

### 6.1 パフォーマンスリスク（優先度: 🟠 高）

**リスク**: プロジェクト数増加に伴う一覧取得クエリの遅延

**影響**:
- 1,000プロジェクト超過時: 500ms-1秒のレスポンスタイム
- マイルストーン/チームメンバーのN+1クエリ発生リスク

**対策**:
- ✅ 複合インデックスの追加
- ✅ includeでN+1クエリ回避
- ✅ limitによるページング実装

### 6.2 権限制御リスク（優先度: 🔴 最高）

**リスク**: Level 10ユーザーが他部門のプロジェクトを閲覧

**影響**:
- セキュリティインシデント
- プライバシー侵害

**対策**:
- ✅ WHERE条件に必ず権限フィルタを含める
- ✅ フロントエンドとバックエンドの両方で権限チェック
- ✅ 各権限レベルでの徹底テスト

### 6.3 遅延判定ロジックリスク（優先度: 🟡 中）

**リスク**: タイムゾーン差異による誤判定

**影響**:
- 実際には遅延していないプロジェクトが遅延表示される
- ユーザーの混乱

**対策**:
- ✅ UTCで統一比較
- ✅ タイムゾーン変換ロジックの統一

### 6.4 医療システムAPI呼び出しリスク（優先度: 🟡 中）

**リスク**: facilities/departments APIの呼び出し頻度が高い

**影響**:
- 医療システムへの負荷増加
- レスポンスタイムの悪化

**対策**:
- ✅ VoiceDrive側でキャッシュ保持（日次更新）
- ✅ 初回読み込み時のみ医療システムAPIを呼び出し
- ✅ キャッシュ期限切れ時のみ再取得

---

## 7. 実装スケジュール

### Phase 1: DB・サービス層実装（3.5日間）

**Day 1**: 10/12土
- [ ] DB要件分析書作成
- [ ] 医療システム確認結果作成
- [ ] ProjectMilestoneテーブル追加（Prisma schema更新）
- [ ] ProjectTeamMemberテーブル追加
- [ ] Post拡張フィールド追加（projectDueDate等）

**Day 2**: 10/13日
- [ ] マイグレーション実行
- [ ] ProgressDashboardService 実装
  - getAccessibleProjects()
  - getProjectStats()
  - getProjectMilestones()
- [ ] ユニットテスト作成

**Day 3**: 10/14月
- [ ] API実装（3エンドポイント）
- [ ] APIテスト

### Phase 2: フロントエンド統合（2日間）

**Day 4**: 10/15火
- [ ] useProgressDashboard() カスタムフック作成
- [ ] ProgressDashboardPage.tsx 修正

**Day 5**: 10/16水
- [ ] エラーハンドリング実装
- [ ] リアルタイム更新実装

### Phase 3: テスト・デプロイ（2日間）

**Day 6**: 10/17木
- [ ] 統合テスト
- [ ] 権限チェックテスト
- [ ] パフォーマンステスト

**Day 7**: 10/18金
- [ ] 本番デプロイ

**合計**: 9日間（ProjectTracking実装後）

---

## 8. まとめ

### 8.1 医療システム側の対応

✅ **新規実装不要**: 既存API（facilities/departments/employees）で対応可能
✅ **既存機能で対応**: 新しいエンドポイント追加は不要です

### 8.2 VoiceDrive側の実装要件

- 🔧 **新規テーブル作成**: ProjectMilestone/ProjectTeamMember（必須）
- 🔧 **Postテーブル拡張**: projectDueDate/projectLevel/projectProgress（必須）
- 🔧 **API実装**: 3エンドポイント（必須）
- 📊 **ユニットテスト**: 15ケース以上
- 📊 **API統合テスト**: 12ケース以上
- 📊 **権限テスト**: Level 10/13での動作確認（必須）

### 8.3 実装優先度

1. **Phase 1（必須）**: DB・サービス層実装 + ユニットテスト
2. **Phase 2（推奨）**: API実装 + フロントエンド統合
3. **Phase 3（必須）**: テスト + デプロイ

**推定工数**: 9日間（Phase 1-3）

---

**承認状態**: VoiceDriveチームレビュー待ち
**次のアクション**: VoiceDriveチームによる実装スケジュール確定

---

**添付ファイル**:
- `progress-dashboard_DB要件分析_20251011.md`（DB設計詳細）

**関連ドキュメント**:
- `共通DB構築後_作業再開指示書_20250928.md`（更新済み - 6.3.10節）

---

**文書終了**

最終更新: 2025年10月11日
次のステップ: VoiceDriveチームからの実装承認待ち
