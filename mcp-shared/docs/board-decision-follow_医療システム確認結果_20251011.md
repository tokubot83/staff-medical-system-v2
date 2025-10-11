# BoardDecisionFollow 医療システム確認結果

**確認日**: 2025年10月11日
**対象ページ**: BoardDecisionFollow (理事会決定事項フォロー)
**確認者**: 医療職員管理システム開発チーム
**ドキュメントID**: MED-SYS-CONFIRM-BOARD-DECISION-20251011
**ステータス**: ✅ 確認完了 - 医療システム側実装不要

---

## 1. エグゼクティブサマリー

### 1.1 確認結論

**医療職員管理システム側の追加実装は不要です。**

- ❌ **新規API実装**: 不要
- ❌ **新規テーブル作成**: 不要
- ❌ **既存API拡張**: 不要
- ✅ **既存APIの利用**: 2つのAPIを使用（実装済み）

### 1.2 理由

BoardDecisionFollowは**理事会で決定された事項の実施進捗を追跡・管理する機能**であり、VoiceDrive内部のプロジェクト管理機能です。医療システムは施設マスタと部門マスタの提供のみを行います。

#### 機能概要
```
理事会決定事項（VoiceDrive管理）
  ↓
マイルストーン管理（VoiceDrive管理）
  ↓
施設別実施状況管理（VoiceDrive管理）
  ↓
進捗追跡・アラート（VoiceDrive管理）

医療システムの役割：
- 施設マスタ提供（GET /api/v2/facilities）
- 部門マスタ提供（GET /api/v2/departments）
```

### 1.3 データ責任分担

| 項目 | VoiceDrive | 医療システム |
|------|-----------|------------|
| 理事会決定事項データ | ✅ 100% | ❌ なし |
| マイルストーン管理 | ✅ 100% | ❌ なし |
| 施設別実施状況管理 | ✅ 100% | ❌ なし |
| 進捗計算・ステータス判定 | ✅ 100% | ❌ なし |
| 施設マスタ | キャッシュのみ | ✅ マスタ管理 |
| 部門マスタ | キャッシュのみ | ✅ マスタ管理 |

---

## 2. 暫定マスターリスト分析

### 2.1 VoiceDrive側実装内容

#### 2.1.1 新規テーブル（3個）

**1. BoardDecision（理事会決定事項）**

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | String | 決定事項ID |
| boardMeetingId | String | 理事会ID |
| title | String | 決定事項タイトル |
| category | String | カテゴリ（システム導入、人事制度等）|
| decision | Text | 理事会決定内容 |
| implementationDeadline | DateTime | 実施期限 |
| responsibleDept | String | 担当部門名（キャッシュ）|
| affectedFacilities | Json | 影響施設ID配列 |
| status | String | ステータス（completed/on_track/at_risk/delayed）|
| progress | Int | 進捗率（0-100）|

**2. BoardDecisionMilestone（マイルストーン）**

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | String | マイルストーンID |
| boardDecisionId | String | 決定事項ID |
| title | String | マイルストーンタイトル |
| deadline | DateTime | 期限 |
| status | String | ステータス（completed/in_progress/pending/delayed）|
| assignee | String | 担当者名 |
| sortOrder | Int | 表示順 |

**3. BoardDecisionFacilityImplementation（施設別実施状況）**

| フィールド | 型 | 説明 |
|-----------|---|------|
| id | String | 実施状況ID |
| boardDecisionId | String | 決定事項ID |
| facilityId | String | 施設ID（医療システム）|
| facilityName | String | 施設名（キャッシュ）|
| status | String | ステータス（completed/in_progress/not_started）|
| progress | Int | 進捗率（0-100）|
| note | String? | 備考 |

#### 2.1.2 VoiceDrive側API（5個）

| No | メソッド | エンドポイント | 説明 |
|----|---------|---------------|------|
| 1 | GET | /api/board-decisions | 決定事項一覧取得 |
| 2 | GET | /api/board-decisions/:id/facility-implementations | 施設別実施状況取得 |
| 3 | PUT | /api/board-decisions/:id/milestones/:milestoneId | マイルストーン更新 |
| 4 | PUT | /api/board-decisions/:id/facility-implementations/:facilityId | 施設別実施状況更新 |
| 5 | POST | /api/board-decisions | 決定事項作成 |

すべて **VoiceDrive内部のAPIエンドポイント**です。

### 2.2 医療システム側の必要API

#### 2.2.1 既存API（追加実装不要）

**API 1: GET /api/v2/facilities**

- **用途**: 施設マスタ取得
- **使用タイミング**: 決定事項作成時、施設別実施状況初期化時
- **状態**: ✅ **既存APIで対応可能**（OrganizationAnalytics実装済み）

**レスポンス例**:
```json
{
  "facilities": [
    {
      "facilityId": "obara-hospital",
      "name": "医療法人 厚生会 小原病院",
      "type": "acute",
      "staffCount": 420
    },
    {
      "facilityId": "tategami-rehabilitation",
      "name": "立神リハビリテーション温泉病院",
      "type": "rehabilitation",
      "staffCount": 180
    }
  ]
}
```

**API 2: GET /api/v2/departments**

- **用途**: 部門マスタ取得
- **使用タイミング**: 決定事項作成時、担当部門選択時
- **状態**: ✅ **既存APIで対応可能**（OrganizationAnalytics実装済み）

**レスポンス例**:
```json
{
  "departments": [
    {
      "departmentId": "DEPT001",
      "name": "人事部",
      "employeeCount": 12
    },
    {
      "departmentId": "DEPT002",
      "name": "IT部",
      "employeeCount": 8
    }
  ]
}
```

✅ **確認済み**: 医療システム側のAPIは既存の2つで対応可能。追加実装不要。

---

## 3. 医療システム側の対応方針

### 3.1 実装作業

**作業なし**

理由:
1. 理事会決定事項のデータはすべてVoiceDriveが管理
2. 医療システムは施設マスタ・部門マスタの提供のみ
3. 既存APIで対応可能

### 3.2 確認事項

- [x] 医療システム側の新規API実装不要 → ✅ 確認済み
- [x] 既存API（facilities, departments）で対応可能 → ✅ 確認済み
- [x] VoiceDrive側で100%実装完結 → ✅ 確認済み

---

## 4. VoiceDriveチームへの実装推奨事項

### 4.1 データベース実装

#### 推奨1: テーブル間のカスケード削除設定

```prisma
model BoardDecision {
  // ... フィールド

  // リレーション
  boardMeeting            BoardMeeting @relation("BoardDecisions", fields: [boardMeetingId], references: [id], onDelete: Cascade)
  milestones              BoardDecisionMilestone[]
  facilityImplementations BoardDecisionFacilityImplementation[]
}

model BoardDecisionMilestone {
  // ... フィールド

  boardDecision     BoardDecision @relation(fields: [boardDecisionId], references: [id], onDelete: Cascade)
}

model BoardDecisionFacilityImplementation {
  // ... フィールド

  boardDecision     BoardDecision @relation(fields: [boardDecisionId], references: [id], onDelete: Cascade)
}
```

**理由**: 理事会が削除された場合、関連する決定事項・マイルストーン・施設別実施状況も自動削除されるべき。

#### 推奨2: ユニーク制約の設定

```prisma
model BoardDecisionFacilityImplementation {
  // ... フィールド

  @@unique([boardDecisionId, facilityId])
}
```

**理由**: 同じ決定事項に対して同じ施設の実施状況は1つのみ。重複登録を防止。

#### 推奨3: インデックスの最適化

```sql
-- よく使われるクエリに対するインデックス
CREATE INDEX idx_board_decisions_status ON board_decisions(status);
CREATE INDEX idx_board_decisions_deadline ON board_decisions(implementation_deadline);
CREATE INDEX idx_board_decisions_category ON board_decisions(category);

-- マイルストーンのソート用
CREATE INDEX idx_milestones_sort ON board_decision_milestones(board_decision_id, sort_order);

-- 施設別実施状況の検索用
CREATE INDEX idx_facility_impl_status ON board_decision_facility_implementations(status);
```

### 4.2 サービス層実装

#### 推奨4: 進捗自動計算ロジック

```typescript
class BoardDecisionFollowService {
  // マイルストーン更新時に親の決定事項の進捗を自動再計算
  async updateMilestone(milestoneId: string, data: {
    status?: string;
    completedAt?: Date;
  }): Promise<void> {
    // マイルストーン更新
    await prisma.boardDecisionMilestone.update({
      where: { id: milestoneId },
      data
    });

    // 親の決定事項取得
    const milestone = await prisma.boardDecisionMilestone.findUnique({
      where: { id: milestoneId },
      include: { boardDecision: true }
    });

    // 進捗率再計算
    const allMilestones = await prisma.boardDecisionMilestone.findMany({
      where: { boardDecisionId: milestone!.boardDecisionId }
    });

    const completedCount = allMilestones.filter(m => m.status === 'completed').length;
    const progress = Math.round((completedCount / allMilestones.length) * 100);

    // ステータス自動判定
    const status = this.calculateStatus(allMilestones);

    // 親の決定事項を更新
    await prisma.boardDecision.update({
      where: { id: milestone!.boardDecisionId },
      data: { progress, status, lastUpdate: new Date() }
    });
  }

  // ステータス自動判定ロジック
  private calculateStatus(milestones: BoardDecisionMilestone[]): string {
    const now = new Date();

    // 完了チェック
    const completedCount = milestones.filter(m => m.status === 'completed').length;
    if (completedCount === milestones.length) {
      return 'completed';
    }

    // 遅延チェック（期限切れの未完了マイルストーンあり）
    const hasDelayed = milestones.some(m =>
      m.status !== 'completed' && m.deadline < now
    );
    if (hasDelayed) {
      return 'delayed';
    }

    // 要注意チェック（7日以内の未完了マイルストーンあり）
    const hasAtRisk = milestones.some(m => {
      const daysToDeadline = Math.floor(
        (m.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return m.status !== 'completed' && daysToDeadline > 0 && daysToDeadline <= 7;
    });
    if (hasAtRisk) {
      return 'at_risk';
    }

    return 'on_track';
  }
}
```

#### 推奨5: 施設別実施状況更新時の全体進捗再計算

```typescript
async updateFacilityImplementation(
  decisionId: string,
  facilityId: string,
  data: {
    status?: string;
    progress?: number;
    note?: string;
    startedAt?: Date;
    completedAt?: Date;
  }
): Promise<void> {
  // 施設別実施状況更新
  await prisma.boardDecisionFacilityImplementation.update({
    where: {
      boardDecisionId_facilityId: {
        boardDecisionId: decisionId,
        facilityId
      }
    },
    data
  });

  // 全施設の実施状況を取得
  const implementations = await prisma.boardDecisionFacilityImplementation.findMany({
    where: { boardDecisionId: decisionId }
  });

  // 全体進捗を再計算（全施設の平均進捗率）
  const totalProgress = implementations.reduce((sum, impl) => sum + impl.progress, 0);
  const averageProgress = Math.round(totalProgress / implementations.length);

  // 親の決定事項を更新
  await prisma.boardDecision.update({
    where: { id: decisionId },
    data: { progress: averageProgress, lastUpdate: new Date() }
  });
}
```

#### 推奨6: 医療システムAPIからの施設名・部門名キャッシュ

```typescript
async createDecision(data: {
  boardMeetingId: string;
  title: string;
  category: string;
  description: string;
  decision: string;
  implementationDeadline: Date;
  responsibleDept: string;
  affectedFacilities: string[];  // 施設ID配列
  milestones: {
    title: string;
    deadline: Date;
    assignee: string;
  }[];
}): Promise<BoardDecision> {
  // 医療システムから施設マスタを取得
  const facilitiesResponse = await fetch('https://medical-system.example.com/api/v2/facilities', {
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'X-API-Key': API_KEY
    }
  });
  const facilitiesData = await facilitiesResponse.json();

  // 施設ID → 施設名のマップ作成
  const facilitiesMap = new Map(
    facilitiesData.facilities.map(f => [f.facilityId, f.name])
  );

  // 理事会情報取得
  const boardMeeting = await prisma.boardMeeting.findUnique({
    where: { id: data.boardMeetingId }
  });

  // 決定事項作成
  const decision = await prisma.boardDecision.create({
    data: {
      boardMeetingId: data.boardMeetingId,
      meetingDate: boardMeeting!.meetingDate,
      title: data.title,
      category: data.category,
      description: data.description,
      decision: data.decision,
      implementationDeadline: data.implementationDeadline,
      responsibleDept: data.responsibleDept,
      affectedFacilities: data.affectedFacilities,
      status: 'on_track',
      progress: 0
    }
  });

  // マイルストーン作成
  await prisma.boardDecisionMilestone.createMany({
    data: data.milestones.map((m, index) => ({
      boardDecisionId: decision.id,
      title: m.title,
      deadline: m.deadline,
      assignee: m.assignee,
      status: 'pending',
      sortOrder: index
    }))
  });

  // 施設別実施状況を初期化
  await prisma.boardDecisionFacilityImplementation.createMany({
    data: data.affectedFacilities.map(facilityId => ({
      boardDecisionId: decision.id,
      facilityId,
      facilityName: facilitiesMap.get(facilityId) || facilityId,  // キャッシュ
      status: 'not_started',
      progress: 0
    }))
  });

  return decision;
}
```

**注意点**:
- 医療システムAPIの認証情報（JWT_TOKEN, API_KEY）を環境変数から取得
- API呼び出しのエラーハンドリングを適切に実装
- 施設名キャッシュは日次バッチで更新推奨

### 4.3 バッチ処理実装

#### 推奨7: 施設名・部門名キャッシュ更新バッチ

```typescript
// VoiceDrive: バッチ処理
// 実行頻度: 毎日午前2時（cron: 0 2 * * *）

async function updateFacilityNameCache() {
  console.log('[Batch] Updating facility name cache...');

  // 医療システムから最新の施設マスタを取得
  const response = await fetch('https://medical-system/api/v2/facilities', {
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'X-API-Key': API_KEY
    }
  });

  if (!response.ok) {
    console.error('[Batch] Failed to fetch facilities from medical system');
    return;
  }

  const facilitiesData = await response.json();
  const facilitiesMap = new Map(
    facilitiesData.facilities.map(f => [f.facilityId, f.name])
  );

  // BoardDecisionFacilityImplementation の施設名を一括更新
  const implementations = await prisma.boardDecisionFacilityImplementation.findMany();

  for (const impl of implementations) {
    const latestFacilityName = facilitiesMap.get(impl.facilityId);
    if (latestFacilityName && latestFacilityName !== impl.facilityName) {
      await prisma.boardDecisionFacilityImplementation.update({
        where: { id: impl.id },
        data: { facilityName: latestFacilityName }
      });
      console.log(`[Batch] Updated facility name: ${impl.facilityId} -> ${latestFacilityName}`);
    }
  }

  console.log('[Batch] Facility name cache update completed');
}
```

#### 推奨8: 遅延アラート通知バッチ

```typescript
// 実行頻度: 毎日午前9時（cron: 0 9 * * *）

async function sendDelayedAlerts() {
  const now = new Date();

  // ステータスが 'delayed' または 'at_risk' の決定事項を取得
  const alertDecisions = await prisma.boardDecision.findMany({
    where: {
      status: { in: ['delayed', 'at_risk'] }
    },
    include: {
      milestones: true,
      boardMeeting: true
    }
  });

  for (const decision of alertDecisions) {
    // 遅延マイルストーンを取得
    const delayedMilestones = decision.milestones.filter(m =>
      m.status !== 'completed' && m.deadline < now
    );

    if (delayedMilestones.length > 0) {
      // Level 18（理事長・法人事務局長）に通知
      await prisma.notification.create({
        data: {
          userId: 'LEVEL18_USER_ID',  // Level 18ユーザーIDを取得
          category: 'board_decision_alert',
          title: '理事会決定事項の実施遅延',
          message: `「${decision.title}」の実施が遅延しています。${delayedMilestones.length}件のマイルストーンが期限切れです。`,
          link: '/board-decision-follow',
          priority: 'high',
          isRead: false
        }
      });

      console.log(`[Batch] Alert sent for decision: ${decision.title}`);
    }
  }
}
```

### 4.4 API実装

#### 推奨9: エラーハンドリングの徹底

```typescript
// GET /api/board-decisions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category');

    const where: any = {};
    if (status !== 'all') {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }

    const decisions = await prisma.boardDecision.findMany({
      where,
      include: {
        milestones: {
          orderBy: { sortOrder: 'asc' }
        },
        facilityImplementations: true,
        boardMeeting: true
      },
      orderBy: { implementationDeadline: 'asc' }
    });

    // ステータスサマリー計算
    const summary = {
      completed: decisions.filter(d => d.status === 'completed').length,
      on_track: decisions.filter(d => d.status === 'on_track').length,
      at_risk: decisions.filter(d => d.status === 'at_risk').length,
      delayed: decisions.filter(d => d.status === 'delayed').length
    };

    return NextResponse.json({
      decisions,
      summary,
      meta: {
        timestamp: new Date().toISOString(),
        count: decisions.length
      }
    });
  } catch (error) {
    console.error('[API] Error fetching board decisions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
```

#### 推奨10: 楽観的ロックによる競合制御

```typescript
// PUT /api/board-decisions/:id/milestones/:milestoneId
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; milestoneId: string } }
) {
  try {
    const body = await request.json();

    // 楽観的ロック: updatedAt を利用
    const currentMilestone = await prisma.boardDecisionMilestone.findUnique({
      where: { id: params.milestoneId }
    });

    if (!currentMilestone) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Milestone not found' },
        { status: 404 }
      );
    }

    // クライアントから送信された updatedAt と比較
    if (body.updatedAt && new Date(body.updatedAt) < currentMilestone.updatedAt) {
      return NextResponse.json(
        { error: 'Conflict', message: '別のユーザーが更新しました。最新のデータを取得してください。' },
        { status: 409 }
      );
    }

    // マイルストーン更新
    const milestone = await prisma.boardDecisionMilestone.update({
      where: { id: params.milestoneId },
      data: {
        status: body.status,
        completedAt: body.completedAt ? new Date(body.completedAt) : undefined
      }
    });

    // 親の決定事項の進捗を再計算
    await recalculateDecisionProgress(params.id);

    return NextResponse.json({ milestone });
  } catch (error) {
    console.error('[API] Error updating milestone:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
```

### 4.5 フロントエンド実装

#### 推奨11: リアルタイム進捗更新のUI実装

```typescript
// VoiceDrive: useBoardDecisions カスタムフック
import useSWR from 'swr';

const useBoardDecisions = (filter?: { status?: string; category?: string }) => {
  const queryString = new URLSearchParams(filter as any).toString();
  const { data, error, mutate } = useSWR(
    `/api/board-decisions?${queryString}`,
    fetcher,
    {
      refreshInterval: 60000,  // 1分ごとに自動更新
      revalidateOnFocus: true
    }
  );

  const updateMilestone = async (decisionId: string, milestoneId: string, status: string) => {
    try {
      const response = await fetch(`/api/board-decisions/${decisionId}/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString()  // 楽観的ロック用
        })
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 409) {
          alert('別のユーザーが更新しました。最新のデータを取得してください。');
        }
        throw new Error(error.message);
      }

      // SWRのキャッシュを更新
      mutate();
    } catch (error) {
      console.error('Failed to update milestone:', error);
      throw error;
    }
  };

  return {
    decisions: data?.decisions || [],
    summary: data?.summary || {},
    isLoading: !error && !data,
    isError: error,
    updateMilestone,
    refresh: mutate
  };
};
```

#### 推奨12: 施設別実施状況のプログレスバー実装

```typescript
// VoiceDrive: FacilityImplementationProgress コンポーネント
const FacilityImplementationProgress = ({
  implementation
}: {
  implementation: FacilityImplementation
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'not_started':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span>{implementation.facilityName}</span>
          <span className="text-gray-600">{implementation.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(implementation.status)}`}
            style={{ width: `${implementation.progress}%` }}
          />
        </div>
      </div>
      <span className={`px-2 py-1 text-xs rounded ${
        implementation.status === 'completed' ? 'bg-green-100 text-green-800' :
        implementation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {implementation.status === 'completed' ? '完了' :
         implementation.status === 'in_progress' ? '実施中' :
         '未着手'}
      </span>
    </div>
  );
};
```

---

## 5. テスト推奨事項

### 5.1 ユニットテスト

```typescript
describe('BoardDecisionFollowService', () => {
  describe('calculateStatus', () => {
    it('全マイルストーン完了時は completed を返すこと', () => {
      const milestones = [
        { status: 'completed', deadline: new Date('2025-01-01') },
        { status: 'completed', deadline: new Date('2025-02-01') }
      ];
      expect(service.calculateStatus(milestones)).toBe('completed');
    });

    it('期限切れの未完了マイルストーンがある場合は delayed を返すこと', () => {
      const milestones = [
        { status: 'completed', deadline: new Date('2025-01-01') },
        { status: 'pending', deadline: new Date('2025-01-01') }  // 期限切れ
      ];
      expect(service.calculateStatus(milestones)).toBe('delayed');
    });

    it('7日以内の未完了マイルストーンがある場合は at_risk を返すこと', () => {
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 5);

      const milestones = [
        { status: 'completed', deadline: new Date('2025-01-01') },
        { status: 'pending', deadline: sevenDaysLater }  // 5日後
      ];
      expect(service.calculateStatus(milestones)).toBe('at_risk');
    });

    it('それ以外は on_track を返すこと', () => {
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

      const milestones = [
        { status: 'completed', deadline: new Date('2025-01-01') },
        { status: 'pending', deadline: thirtyDaysLater }  // 30日後
      ];
      expect(service.calculateStatus(milestones)).toBe('on_track');
    });
  });

  describe('recalculateDecisionProgress', () => {
    it('マイルストーンの完了率に基づいて進捗率を計算すること', async () => {
      // テストデータ準備
      const decisionId = 'test-decision';
      await prisma.boardDecisionMilestone.createMany({
        data: [
          { boardDecisionId: decisionId, status: 'completed', title: 'M1', deadline: new Date(), assignee: 'A' },
          { boardDecisionId: decisionId, status: 'completed', title: 'M2', deadline: new Date(), assignee: 'B' },
          { boardDecisionId: decisionId, status: 'pending', title: 'M3', deadline: new Date(), assignee: 'C' },
          { boardDecisionId: decisionId, status: 'pending', title: 'M4', deadline: new Date(), assignee: 'D' }
        ]
      });

      // 進捗再計算
      await service.recalculateDecisionProgress(decisionId);

      // 検証
      const decision = await prisma.boardDecision.findUnique({ where: { id: decisionId } });
      expect(decision.progress).toBe(50);  // 2/4 = 50%
    });
  });

  describe('recalculateOverallProgress', () => {
    it('全施設の平均進捗率を計算すること', async () => {
      const decisionId = 'test-decision';

      // 施設別実施状況作成
      await prisma.boardDecisionFacilityImplementation.createMany({
        data: [
          { boardDecisionId: decisionId, facilityId: 'FAC001', facilityName: '施設1', progress: 100 },
          { boardDecisionId: decisionId, facilityId: 'FAC002', facilityName: '施設2', progress: 80 },
          { boardDecisionId: decisionId, facilityId: 'FAC003', facilityName: '施設3', progress: 60 },
          { boardDecisionId: decisionId, facilityId: 'FAC004', facilityName: '施設4', progress: 40 }
        ]
      });

      // 全体進捗再計算
      await service.recalculateOverallProgress(decisionId);

      // 検証
      const decision = await prisma.boardDecision.findUnique({ where: { id: decisionId } });
      expect(decision.progress).toBe(70);  // (100+80+60+40)/4 = 70
    });
  });
});
```

### 5.2 API統合テスト

```typescript
describe('Board Decision Follow API', () => {
  describe('GET /api/board-decisions', () => {
    it('全決定事項を取得できること', async () => {
      const response = await request(app)
        .get('/api/board-decisions')
        .set('Authorization', 'Bearer level18_token');

      expect(response.status).toBe(200);
      expect(response.body.decisions).toBeInstanceOf(Array);
      expect(response.body.summary).toHaveProperty('completed');
      expect(response.body.summary).toHaveProperty('on_track');
    });

    it('ステータスでフィルタリングできること', async () => {
      const response = await request(app)
        .get('/api/board-decisions?status=delayed')
        .set('Authorization', 'Bearer level18_token');

      expect(response.status).toBe(200);
      expect(response.body.decisions.every(d => d.status === 'delayed')).toBe(true);
    });

    it('Level 18未満はアクセス拒否されること', async () => {
      const response = await request(app)
        .get('/api/board-decisions')
        .set('Authorization', 'Bearer level17_token');

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/board-decisions/:id/milestones/:milestoneId', () => {
    it('マイルストーンを更新できること', async () => {
      const response = await request(app)
        .put('/api/board-decisions/dec-001/milestones/m1')
        .set('Authorization', 'Bearer level18_token')
        .send({
          status: 'completed',
          completedAt: new Date().toISOString()
        });

      expect(response.status).toBe(200);
      expect(response.body.milestone.status).toBe('completed');
      expect(response.body.decisionProgress).toHaveProperty('progress');
    });

    it('楽観的ロックが機能すること', async () => {
      // 1回目の更新
      await request(app)
        .put('/api/board-decisions/dec-001/milestones/m1')
        .set('Authorization', 'Bearer level18_token')
        .send({ status: 'in_progress', updatedAt: new Date().toISOString() });

      // 2回目の更新（古い updatedAt を送信）
      const response = await request(app)
        .put('/api/board-decisions/dec-001/milestones/m1')
        .set('Authorization', 'Bearer level18_token')
        .send({
          status: 'completed',
          updatedAt: new Date('2025-01-01').toISOString()  // 古いタイムスタンプ
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Conflict');
    });
  });

  describe('POST /api/board-decisions', () => {
    it('決定事項を作成できること', async () => {
      const response = await request(app)
        .post('/api/board-decisions')
        .set('Authorization', 'Bearer level18_token')
        .send({
          boardMeetingId: 'bm-2025-10',
          title: 'テスト決定事項',
          category: 'システム導入',
          description: 'テスト説明',
          decision: 'テスト決定',
          implementationDeadline: '2026-03-31',
          responsibleDept: '人事部',
          affectedFacilities: ['FAC001', 'FAC002'],
          milestones: [
            { title: 'マイルストーン1', deadline: '2025-12-31', assignee: '担当者A' }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.decision).toHaveProperty('id');
      expect(response.body.decision.title).toBe('テスト決定事項');

      // 施設別実施状況が自動作成されているか確認
      const implementations = await prisma.boardDecisionFacilityImplementation.findMany({
        where: { boardDecisionId: response.body.decision.id }
      });
      expect(implementations).toHaveLength(2);
    });
  });
});
```

### 5.3 エンドツーエンドテスト

```typescript
describe('Board Decision Follow E2E', () => {
  it('決定事項の作成→マイルストーン更新→進捗確認のフロー全体が正常に動作すること', async () => {
    // 1. 決定事項作成
    const createResponse = await request(app)
      .post('/api/board-decisions')
      .set('Authorization', 'Bearer level18_token')
      .send({
        boardMeetingId: 'bm-2025-10',
        title: 'E2Eテスト決定事項',
        category: 'システム導入',
        description: 'テスト',
        decision: '承認',
        implementationDeadline: '2026-06-30',
        responsibleDept: 'IT部',
        affectedFacilities: ['FAC001', 'FAC002', 'FAC003'],
        milestones: [
          { title: 'Phase 1', deadline: '2025-12-31', assignee: '担当者A' },
          { title: 'Phase 2', deadline: '2026-03-31', assignee: '担当者B' },
          { title: 'Phase 3', deadline: '2026-06-30', assignee: '担当者C' }
        ]
      });

    expect(createResponse.status).toBe(200);
    const decisionId = createResponse.body.decision.id;

    // 2. 決定事項の初期状態確認
    const getResponse1 = await request(app)
      .get('/api/board-decisions')
      .set('Authorization', 'Bearer level18_token');

    const decision1 = getResponse1.body.decisions.find(d => d.id === decisionId);
    expect(decision1.progress).toBe(0);
    expect(decision1.status).toBe('on_track');

    // 3. マイルストーン1を完了
    const milestone1Id = decision1.milestones[0].id;
    await request(app)
      .put(`/api/board-decisions/${decisionId}/milestones/${milestone1Id}`)
      .set('Authorization', 'Bearer level18_token')
      .send({ status: 'completed', completedAt: new Date().toISOString() });

    // 4. 進捗が更新されたことを確認
    const getResponse2 = await request(app)
      .get('/api/board-decisions')
      .set('Authorization', 'Bearer level18_token');

    const decision2 = getResponse2.body.decisions.find(d => d.id === decisionId);
    expect(decision2.progress).toBe(33);  // 1/3 = 33%
    expect(decision2.status).toBe('on_track');

    // 5. 施設別実施状況を取得
    const facilityImplResponse = await request(app)
      .get(`/api/board-decisions/${decisionId}/facility-implementations`)
      .set('Authorization', 'Bearer level18_token');

    expect(facilityImplResponse.status).toBe(200);
    expect(facilityImplResponse.body.implementations).toHaveLength(3);

    // 6. 施設1の実施状況を更新
    await request(app)
      .put(`/api/board-decisions/${decisionId}/facility-implementations/FAC001`)
      .set('Authorization', 'Bearer level18_token')
      .send({
        status: 'in_progress',
        progress: 50,
        note: 'Phase 1実施中'
      });

    // 7. 全体進捗が更新されたことを確認
    const getResponse3 = await request(app)
      .get('/api/board-decisions')
      .set('Authorization', 'Bearer level18_token');

    const decision3 = getResponse3.body.decisions.find(d => d.id === decisionId);
    expect(decision3.progress).toBeGreaterThan(0);  // 施設別進捗が反映されている

    // 8. 全マイルストーンを完了
    for (const milestone of decision1.milestones) {
      await request(app)
        .put(`/api/board-decisions/${decisionId}/milestones/${milestone.id}`)
        .set('Authorization', 'Bearer level18_token')
        .send({ status: 'completed', completedAt: new Date().toISOString() });
    }

    // 9. ステータスが completed になったことを確認
    const getResponse4 = await request(app)
      .get('/api/board-decisions')
      .set('Authorization', 'Bearer level18_token');

    const decision4 = getResponse4.body.decisions.find(d => d.id === decisionId);
    expect(decision4.progress).toBe(100);
    expect(decision4.status).toBe('completed');
  });
});
```

---

## 6. リスク管理

### 6.1 技術的リスク

#### リスク1: 進捗計算の不整合

**内容**: マイルストーン更新と施設別実施状況更新が同時に行われた場合、進捗率の計算結果が不整合になる
**影響度**: 中
**対策**:
- データベーストランザクションを使用
- 楽観的ロックによる競合制御
- 進捗再計算ロジックをアトミックに実行

**実装例**:
```typescript
await prisma.$transaction(async (tx) => {
  // マイルストーン更新
  await tx.boardDecisionMilestone.update({ ... });

  // 進捗再計算
  const milestones = await tx.boardDecisionMilestone.findMany({ ... });
  const progress = calculateProgress(milestones);

  // 決定事項更新
  await tx.boardDecision.update({ ... });
});
```

#### リスク2: 医療システムAPIの応答遅延

**内容**: 決定事項作成時に医療システムAPIから施設名を取得する際、応答が遅延する
**影響度**: 低
**対策**:
- タイムアウト設定（5秒）
- キャッシュ機構（Redis等）
- フォールバック（施設IDをそのまま使用）

#### リスク3: 施設名キャッシュの古さ

**内容**: 医療システムで施設名が変更されたが、VoiceDrive側のキャッシュが古いまま
**影響度**: 低
**対策**:
- 日次バッチで施設名キャッシュを更新
- 手動更新機能の提供
- 医療システムAPIへのリンク表示

### 6.2 運用リスク

#### リスク4: マイルストーン期限切れの見逃し

**内容**: 期限切れのマイルストーンがあるのに、理事長が気付かない
**影響度**: 高
**対策**:
- 遅延アラート通知バッチ（毎日午前9時）
- ダッシュボードで遅延案件をハイライト表示
- 週次レポートの自動生成

#### リスク5: 施設別実施状況の更新漏れ

**内容**: 施設担当者が実施状況を更新し忘れる
**影響度**: 中
**対策**:
- 更新リマインダー通知（期限7日前）
- 未更新施設のレポート自動生成
- 施設担当者へのエスカレーション機能

---

## 7. 今後の拡張可能性

### Phase 2機能（3ヶ月後）

#### 機能1: 決定事項のテンプレート機能
```typescript
// よく使う決定事項のテンプレート
const decisionTemplates = [
  {
    category: 'システム導入',
    milestones: [
      { title: '要件定義', durationDays: 30 },
      { title: 'システム開発', durationDays: 60 },
      { title: 'テスト・検証', durationDays: 30 },
      { title: '本番リリース', durationDays: 1 }
    ]
  }
];
```

#### 機能2: 施設横断比較ダッシュボード
```typescript
// 施設別実施状況を横断比較
const crossFacilityComparison = {
  fastestFacility: 'FAC001',  // 最速施設
  slowestFacility: 'FAC010',  // 最遅施設
  averageProgress: 65,        // 平均進捗率
  facilitiesOnTrack: 7,       // 順調な施設数
  facilitiesDelayed: 3        // 遅延施設数
};
```

#### 機能3: 自動進捗レポート生成
```typescript
// 月次レポート自動生成
async function generateMonthlyReport() {
  const decisions = await getDecisionsForMonth();
  const report = {
    totalDecisions: decisions.length,
    completedRate: calculateCompletionRate(decisions),
    delayedCount: decisions.filter(d => d.status === 'delayed').length,
    facilitySummary: generateFacilitySummary(decisions)
  };

  // PDFレポート生成
  const pdf = await generatePDF(report);

  // Level 18に通知
  await sendMonthlyReportNotification(pdf);
}
```

### Phase 3機能（6ヶ月後）

#### 機能4: AIによる遅延予測
```typescript
// 機械学習モデルで遅延リスクを予測
const delayRiskPrediction = await predictDelayRisk({
  decision,
  historicalData,
  currentProgress
});

if (delayRiskPrediction.risk > 0.7) {
  // 遅延リスク高 → 早期警告
  await sendEarlyWarning(decision.id);
}
```

#### 機能5: 決定事項間の依存関係管理
```typescript
// 決定事項間の依存関係
model BoardDecisionDependency {
  id                      String  @id @default(cuid())
  decisionId              String
  dependsOnDecisionId     String
  dependencyType          String  // "blocks", "requires", "related"

  decision                BoardDecision @relation("Dependencies", fields: [decisionId], references: [id])
  dependsOnDecision       BoardDecision @relation("DependedBy", fields: [dependsOnDecisionId], references: [id])
}
```

---

## 8. まとめ

### 8.1 医療システム側の対応

**作業不要** - 既存APIのみで対応可能です。

### 8.2 VoiceDrive側の実装項目

#### データベース
- [ ] BoardDecision テーブル作成
- [ ] BoardDecisionMilestone テーブル作成
- [ ] BoardDecisionFacilityImplementation テーブル作成
- [ ] BoardMeeting リレーション追加
- [ ] インデックス作成（9個）

#### サービス層
- [ ] BoardDecisionFollowService実装
- [ ] 進捗自動計算ロジック実装
- [ ] ステータス自動判定ロジック実装
- [ ] 施設名・部門名キャッシュ更新ロジック実装

#### API
- [ ] GET /api/board-decisions 実装
- [ ] GET /api/board-decisions/:id/facility-implementations 実装
- [ ] PUT /api/board-decisions/:id/milestones/:milestoneId 実装
- [ ] PUT /api/board-decisions/:id/facility-implementations/:facilityId 実装
- [ ] POST /api/board-decisions 実装

#### バッチ処理
- [ ] 施設名キャッシュ更新バッチ（日次）
- [ ] 遅延アラート通知バッチ（日次）

#### フロントエンド
- [ ] useBoardDecisions カスタムフック実装
- [ ] useFacilityImplementations カスタムフック実装
- [ ] リアルタイム進捗更新UI実装
- [ ] 施設別実施状況プログレスバー実装

### 8.3 実装スケジュール

| Phase | 期間 | 成果物 |
|-------|------|--------|
| Phase 1 | 2日 | データベース構築 |
| Phase 2 | 3日 | サービス層実装 |
| Phase 3 | 2日 | API実装 |
| Phase 4 | 2日 | フロントエンド統合 |
| Phase 5 | 1日 | 統合テスト・デプロイ |

**総工数**: **10日（2週間）**

### 8.4 テスト要件

- ユニットテスト: 20ケース以上
- API統合テスト: 15ケース以上
- エンドツーエンドテスト: 1ケース（決定事項作成→マイルストーン更新→進捗確認）

### 8.5 次のステップ

1. **VoiceDrive側**: 実装開始（推定10日）
2. **医療システム側**: 待機（作業なし）
3. **統合テスト**: 実装完了後、医療システムAPI連携テスト実施

---

## 9. 関連ドキュメント

- **暫定マスターリスト**: BoardDecisionFollow 暫定マスターリスト（受領済み）
- **DB要件分析書**: board-decision-follow_DB要件分析_20251011.md（受領済み）
- **BoardPreparation確認結果**: [board-preparation_医療システム確認結果_20251011.md](./board-preparation_医療システム確認結果_20251011.md)
- **BoardAgendaReview確認結果**: [board-agenda-review_医療システム確認結果_20251011.md](./board-agenda-review_医療システム確認結果_20251011.md)

---

## 10. 承認

### 10.1 医療システム側承認

- [x] **確認完了**: 2025年10月11日
- [x] **医療システム側の追加実装不要を確認**
- [x] **既存API（facilities, departments）で対応可能を確認**
- [x] **VoiceDrive側実装推奨事項を提供**

### 10.2 VoiceDrive側確認依頼

この確認結果ドキュメントをVoiceDriveチームに共有し、以下を確認してください:

- [ ] 医療システム側の実装不要について合意
- [ ] 既存API（GET /api/v2/facilities, GET /api/v2/departments）の利用方法確認
- [ ] VoiceDrive側の実装推奨事項を確認
- [ ] 実装スケジュール（10日）の妥当性確認
- [ ] 統合テスト日程の調整

---

**ドキュメント作成者**: 医療職員管理システム開発チーム
**作成日**: 2025年10月11日
**バージョン**: 1.0.0
**ステータス**: ✅ 確認完了
**次のアクション**: VoiceDriveチームへの共有・実装開始承認待ち
