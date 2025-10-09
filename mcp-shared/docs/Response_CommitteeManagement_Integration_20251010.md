# 委員会管理ページ統合実装 回答書

**文書番号**: MS-RESPONSE-COMMITTEE-2025-1010-001
**作成日**: 2025年10月10日
**作成者**: 医療職員管理システムチーム
**宛先**: VoiceDriveチーム
**件名**: 委員会管理ページDB要件分析への回答
**関連文書**:
- CM-DB-REQ-2025-1009-001（DB要件分析）
- CM-MASTER-2025-1009-001（暫定マスターリスト）

---

## 📢 エグゼクティブサマリー

VoiceDriveチームから受領した以下2文書を確認し、医療システム側の対応を回答します：

1. **委員会管理ページ DB要件分析**（CM-DB-REQ-2025-1009-001）
2. **委員会管理ページ 暫定マスターリスト**（CM-MASTER-2025-1009-001）

### 医療システム側の総合評価

| 項目 | 判定 | コメント |
|------|------|---------|
| **API実装可否** | ✅ 実装可能 | 全てのAPIは医療システムで実装済みまたは実装可能 |
| **初期データ提供** | ✅ 提供可能 | 委員会リスト・メンバー情報を提供 |
| **実装スケジュール** | ✅ 実現可能 | VoiceDriveのPhase 2と並行実施可能（2日間） |
| **コスト** | 🟢 **¥240,000** | API 3件実装（PersonalStation流用あり） |

### 重要な決定事項

1. **API-2（職員情報）は既存API流用**: PersonalStation API-2を拡張（¥80,000削減）
2. **API-8（部署マスタ）は既存API流用**: DepartmentStation API-3を流用（¥100,000削減）
3. **新規実装はAPI-CM-1のみ**: 職員情報一括取得API（バッチ版）

---

## ✅ VoiceDriveチームからの3つの質問への回答

### 質問1: 委員会データの初期データ提供

**VoiceDriveからの質問**:
> 委員会管理ページ稼働には以下の初期データが必要です：
> 1. **委員会リスト**（運営委員会、医療安全委員会等）
> 2. **委員会メンバー**（各委員会の構成員）
> 3. **委員長情報**（各委員会の委員長employeeId）
>
> これらは医療システムから提供可能ですか？それともVoiceDrive側で手動入力しますか？

#### 回答: ✅ **医療システムから初期データを提供します**

**提供方法**: JSON形式でmcp-shared/data/に配置

**提供データ例**:

```json
{
  "committees": [
    {
      "name": "運営委員会",
      "description": "病院運営の重要事項を審議する委員会",
      "chairpersonEmployeeId": "OH-DR-2020-001",
      "chairpersonName": "院長 田中 一郎",
      "members": [
        {
          "employeeId": "OH-DR-2020-001",
          "name": "田中 一郎",
          "department": "院長室",
          "position": "院長",
          "role": "chairman"
        },
        {
          "employeeId": "OH-DR-2020-002",
          "name": "佐藤 次郎",
          "department": "副院長室",
          "position": "副院長",
          "role": "vice_chairman"
        },
        {
          "employeeId": "OH-NS-2020-005",
          "name": "鈴木 花子",
          "department": "看護部",
          "position": "看護部長",
          "role": "member"
        }
      ]
    },
    {
      "name": "医療安全委員会",
      "description": "医療安全に関する事項を審議・改善する委員会",
      "chairpersonEmployeeId": "OH-DR-2020-002",
      "chairpersonName": "副院長 佐藤 次郎",
      "members": [
        {
          "employeeId": "OH-DR-2020-002",
          "name": "佐藤 次郎",
          "department": "副院長室",
          "position": "副院長",
          "role": "chairman"
        },
        {
          "employeeId": "OH-NS-2021-010",
          "name": "高橋 美咲",
          "department": "医療安全管理室",
          "position": "医療安全管理者",
          "role": "secretary"
        }
      ]
    }
  ]
}
```

**提供委員会リスト**（小原病院の実際の委員会）:

1. **運営委員会**（委員長: 院長、メンバー: 12名）
2. **医療安全委員会**（委員長: 副院長、メンバー: 10名）
3. **感染対策委員会**（委員長: 感染管理認定看護師、メンバー: 8名）
4. **教育委員会**（委員長: 看護部長、メンバー: 7名）
5. **業務改善委員会**（委員長: 事務長、メンバー: 9名）
6. **倫理委員会**（委員長: 医局長、メンバー: 6名）
7. **災害対策委員会**（委員長: 副院長、メンバー: 8名）
8. **褥瘡対策委員会**（委員長: 皮膚・排泄ケア認定看護師、メンバー: 5名）

**提供タイミング**: Phase 1完了後（3日後）

**ファイル名**: `mcp-shared/data/committee-initial-data.json`

---

### 質問2: 議題の決定者権限

**VoiceDriveからの質問**:
> 議題を「承認」「却下」「保留」できる決定者は：
> - 院長（Level 25）
> - 副院長（Level 20-24）
> - 委員長（委員会ごとに異なる）
>
> この理解で正しいですか？権限レベルで判定可能ですか？

#### 回答: ✅ **基本的に正しいですが、一部補足があります**

**決定者権限の定義**:

| 決定権限 | 権限レベル | 職位例 | 決定範囲 |
|---------|-----------|--------|---------|
| **Level 25** | 院長 | 院長 | 全ての議題を決定可能 |
| **Level 20-24** | 副院長・事務長 | 副院長、事務長 | 全ての議題を決定可能 |
| **Level 15-19** | 部長 | 看護部長、医局長 | 自部署関連の議題を決定可能 |
| **Level 10-14** | 師長・課長 | 病棟師長、課長 | 限定的な議題を決定可能 |

**重要な補足**:

1. **委員長権限は権限レベルに依存**
   - 委員長であっても、権限レベルが低い場合は「最終決定権」を持たない
   - 例: 褥瘡対策委員会委員長（認定看護師、Level 7）は審議をまとめるが、最終承認は副院長（Level 20）が行う

2. **議題タイプによる決定権限の違い**

| 議題タイプ | 最低決定権限 | 理由 |
|-----------|-------------|------|
| **personnel**（人事） | Level 20+ | 人事は院長・副院長のみ |
| **budget**（予算） | Level 20+ | 予算権限は院長・副院長のみ |
| **equipment**（設備） | Level 15+ | 高額設備はLevel 20+、小規模はLevel 15+ |
| **facility_policy**（施設方針） | Level 20+ | 方針決定は院長・副院長のみ |
| **committee_proposal**（委員会提案） | Level 10+ | 委員会内部事項はLevel 10+で決定可 |
| **other**（その他） | Level 10+ | ケースバイケース |

3. **VoiceDrive側の実装推奨**

```typescript
// 議題決定権限チェック関数（VoiceDrive側実装推奨）
function canDecideAgenda(user: User, agenda: ManagementCommitteeAgenda): boolean {
  const level = user.permissionLevel;

  // 院長・副院長は全て決定可能
  if (level >= 20) return true;

  // 議題タイプによる判定
  const requiresHighLevel = ['personnel', 'budget', 'facility_policy'];
  if (requiresHighLevel.includes(agenda.agendaType)) {
    return level >= 20;
  }

  // 高額設備は副院長以上
  if (agenda.agendaType === 'equipment' && agenda.estimatedCost && agenda.estimatedCost > 1000000) {
    return level >= 20;
  }

  // その他はLevel 10以上
  return level >= 10;
}
```

**医療システムからの提供データに含める情報**:
- `permissionLevel`: 職員の権限レベル（既にPersonalStation API-2で提供済み）

---

### 質問3: 部署マスタ同期頻度

**VoiceDriveからの質問**:
> 影響部署（impactDepartments）検証のため、部署マスタが必要です：
> - 部署マスタの更新頻度はどの程度ですか？
> - リアルタイムAPI取得 vs 日次バッチ同期のどちらが適切ですか？

#### 回答: 🔵 **リアルタイムAPI取得を推奨**

**理由**:

1. **部署マスタの更新頻度は低い**
   - 年間2-3回程度（新病棟開設、組織改編時のみ）
   - 日次バッチ同期はオーバースペック

2. **API取得のパフォーマンスは十分**
   - 部署数: 約20-30件（小原病院の場合）
   - レスポンスサイズ: < 10KB
   - 応答時間: < 100ms

3. **キャッシュ戦略併用**
   - VoiceDrive側で部署マスタをキャッシュ（有効期限: 24時間）
   - 初回取得後はキャッシュから返却
   - 毎日深夜2時に自動更新

**推奨実装**:

```typescript
// VoiceDrive側: 部署マスタキャッシュ
class DepartmentCache {
  private cache: Department[] = [];
  private lastUpdate: Date | null = null;
  private CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24時間

  async getDepartments(): Promise<Department[]> {
    // キャッシュが有効な場合は返却
    if (this.cache.length > 0 && this.lastUpdate) {
      const elapsed = Date.now() - this.lastUpdate.getTime();
      if (elapsed < this.CACHE_EXPIRY) {
        return this.cache;
      }
    }

    // API取得
    const departments = await medicalSystemAPI.getDepartments();
    this.cache = departments;
    this.lastUpdate = new Date();
    return departments;
  }

  // 手動更新（管理画面から実行可能）
  async forceRefresh(): Promise<void> {
    const departments = await medicalSystemAPI.getDepartments();
    this.cache = departments;
    this.lastUpdate = new Date();
  }
}
```

**API仕様**:

```yaml
GET /api/departments:
  summary: 部署マスタ取得
  responses:
    200:
      content:
        application/json:
          schema:
            type: object
            properties:
              departments:
                type: array
                items:
                  type: object
                  properties:
                    id: { type: string, example: "medical_care_ward" }
                    name: { type: string, example: "内科" }
                    facilityId: { type: string, example: "obara-hospital" }
                    isActive: { type: boolean, example: true }
```

**サンプルレスポンス**:

```json
{
  "departments": [
    { "id": "medical_care_ward", "name": "内科", "facilityId": "obara-hospital", "isActive": true },
    { "id": "surgical_ward", "name": "外科", "facilityId": "obara-hospital", "isActive": true },
    { "id": "orthopedic_ward", "name": "整形外科", "facilityId": "obara-hospital", "isActive": true },
    { "id": "pediatrics", "name": "小児科", "facilityId": "obara-hospital", "isActive": true },
    { "id": "emergency_dept", "name": "救急科", "facilityId": "obara-hospital", "isActive": true },
    { "id": "nursing_dept", "name": "看護部", "facilityId": "obara-hospital", "isActive": true },
    { "id": "admin_dept", "name": "事務部", "facilityId": "obara-hospital", "isActive": true },
    { "id": "medical_safety", "name": "医療安全管理室", "facilityId": "obara-hospital", "isActive": true }
  ]
}
```

---

## 🔗 医療システム側API実装計画

### API-CM-1: 職員情報一括取得（バッチ版）🆕

**エンドポイント**: `POST /api/employees/batch`

**優先度**: 🔴 最高

**実装内容**:

```typescript
// src/routes/api/employees.ts
router.post('/batch', async (req, res) => {
  const { employeeIds } = req.body;

  if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
    return res.status(400).json({ error: 'employeeIds must be a non-empty array' });
  }

  // 最大100件まで
  if (employeeIds.length > 100) {
    return res.status(400).json({ error: 'Maximum 100 employees per request' });
  }

  const employees = await prisma.staff.findMany({
    where: {
      employeeId: { in: employeeIds }
    },
    select: {
      employeeId: true,
      name: true,
      department: true,
      position: true,
      permissionLevel: true
    }
  });

  res.json({ employees });
});
```

**リクエスト例**:
```json
POST /api/employees/batch
{
  "employeeIds": ["OH-NS-2024-001", "OH-NS-2024-002", "OH-DR-2020-001"]
}
```

**レスポンス例**:
```json
{
  "employees": [
    {
      "employeeId": "OH-NS-2024-001",
      "name": "山田 花子",
      "department": "内科",
      "position": "看護師",
      "permissionLevel": 6.0
    },
    {
      "employeeId": "OH-NS-2024-002",
      "name": "佐藤 太郎",
      "department": "外科",
      "position": "看護師",
      "permissionLevel": 6.0
    },
    {
      "employeeId": "OH-DR-2020-001",
      "name": "田中 一郎",
      "department": "院長室",
      "position": "院長",
      "permissionLevel": 25.0
    }
  ]
}
```

**開発工数**: 3時間
**開発費**: ¥120,000

---

### API-2: 職員情報取得（単体）✅ **既存API流用**

**エンドポイント**: `GET /api/employees/{employeeId}`

**ステータス**: ✅ **PersonalStation API-2を流用**

**実装内容**: PersonalStationで既に実装済み

**レスポンス例**:
```json
{
  "employeeId": "OH-NS-2024-001",
  "name": "山田 花子",
  "department": "内科",
  "position": "看護師",
  "permissionLevel": 6.0,
  "facilityId": "obara-hospital",
  "hireDate": "2024-04-01",
  "experienceYears": {
    "total": 1,
    "atCurrentFacility": 1,
    "asCurrentPosition": 1
  }
}
```

**追加実装**: なし（既存APIで十分）

**開発工数**: 0時間
**開発費**: ¥0

---

### API-8: 部署マスタ取得 ✅ **既存API流用**

**エンドポイント**: `GET /api/departments`

**ステータス**: ✅ **DepartmentStation API-3を流用**

**実装内容**: DepartmentStationで既に実装済み

**レスポンス例**:
```json
{
  "departments": [
    { "id": "medical_care_ward", "name": "内科", "facilityId": "obara-hospital" },
    { "id": "surgical_ward", "name": "外科", "facilityId": "obara-hospital" }
  ]
}
```

**追加実装**: なし（既存APIで十分）

**開発工数**: 0時間
**開発費**: ¥0

---

## 📊 コスト削減の詳細

### 元の見積もり（VoiceDrive想定）

| API | 内容 | 元見積もり |
|-----|------|-----------|
| API-1 | 職員情報取得（単体） | ¥160,000 |
| API-2 | 職員情報一括取得（バッチ） | ¥160,000 |
| API-3 | 部署マスタ取得 | ¥100,000 |
| **合計** | - | **¥420,000** |

### 実際のコスト（既存API流用後）

| API | 内容 | 実装方針 | 実際のコスト |
|-----|------|---------|-------------|
| API-2 | 職員情報取得（単体） | PersonalStation API-2流用 | **¥0** |
| API-CM-1 | 職員情報一括取得（バッチ）🆕 | 新規実装（3時間） | **¥120,000** |
| API-8 | 部署マスタ取得 | DepartmentStation API-3流用 | **¥0** |
| 初期データ提供 | 委員会リスト・メンバーJSON作成 | 新規作成（3時間） | **¥120,000** |
| **合計** | - | - | **¥240,000** |

**コスト削減額**: **¥180,000**（43%削減）

---

## 📅 医療システム側実装スケジュール

### Phase 2: 医療システムAPI連携（2日間）

VoiceDriveのPhase 2（Day 4-5）と並行実施

#### Day 4（VoiceDriveと同時）

| 時間 | タスク | 担当 | 成果物 |
|------|--------|------|--------|
| 10:00-12:00 | API仕様書レビュー | 医療チーム | API仕様書承認 |
| 13:00-16:00 | API-CM-1実装（バッチ取得） | 医療チーム | src/routes/api/employees.ts |
| 16:00-17:00 | 単体テスト | 医療チーム | テスト合格 |

#### Day 5（VoiceDriveと同時）

| 時間 | タスク | 担当 | 成果物 |
|------|--------|------|--------|
| 10:00-13:00 | 初期データJSON作成 | 医療チーム | committee-initial-data.json |
| 14:00-17:00 | 統合テスト（VoiceDriveと） | 両チーム | 統合テスト合格 |

---

## 🧪 テスト計画

### 単体テスト（医療システム側）

**テストファイル**: `tests/api-committee-management.test.ts`

```typescript
describe('API-CM-1: 職員情報一括取得', () => {
  test('正常系: 3件の職員情報を取得', async () => {
    const response = await request(app)
      .post('/api/employees/batch')
      .send({
        employeeIds: ['OH-NS-2024-001', 'OH-NS-2024-002', 'OH-DR-2020-001']
      });

    expect(response.status).toBe(200);
    expect(response.body.employees).toHaveLength(3);
    expect(response.body.employees[0].name).toBe('山田 花子');
  });

  test('異常系: employeeIdsが空配列', async () => {
    const response = await request(app)
      .post('/api/employees/batch')
      .send({ employeeIds: [] });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('non-empty array');
  });

  test('異常系: 100件を超えるリクエスト', async () => {
    const employeeIds = Array.from({ length: 101 }, (_, i) => `OH-NS-2024-${i.toString().padStart(3, '0')}`);
    const response = await request(app)
      .post('/api/employees/batch')
      .send({ employeeIds });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Maximum 100 employees');
  });
});

describe('初期データJSON', () => {
  test('JSONファイルが存在する', () => {
    const filePath = path.join(__dirname, '../mcp-shared/data/committee-initial-data.json');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('JSONが正しい形式である', () => {
    const filePath = path.join(__dirname, '../mcp-shared/data/committee-initial-data.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    expect(data.committees).toBeInstanceOf(Array);
    expect(data.committees.length).toBeGreaterThan(0);

    const firstCommittee = data.committees[0];
    expect(firstCommittee.name).toBeDefined();
    expect(firstCommittee.chairpersonEmployeeId).toBeDefined();
    expect(firstCommittee.members).toBeInstanceOf(Array);
  });
});
```

---

### 統合テスト（両チーム）

**テストファイル**: `tests/committee-management-integration.test.ts`

```typescript
describe('委員会管理統合テスト', () => {
  test('職員情報一括取得 → VoiceDrive側処理', async () => {
    // 医療システムAPI呼び出し
    const employees = await medicalSystemAPI.getEmployeesBatch([
      'OH-NS-2024-001',
      'OH-NS-2024-002'
    ]);

    expect(employees.length).toBe(2);

    // VoiceDrive側でキャッシュ
    for (const employee of employees) {
      employeeCache.set(employee.employeeId, employee);
    }

    // キャッシュから取得確認
    const cached = employeeCache.get('OH-NS-2024-001');
    expect(cached.name).toBe('山田 花子');
  });

  test('部署マスタ取得 → 影響部署検証', async () => {
    // 医療システムから部署マスタ取得
    const departments = await medicalSystemAPI.getDepartments();

    // 議題の影響部署を検証
    const agenda = {
      impactDepartments: ['内科', '外科', '整形外科']
    };

    const validDepartments = agenda.impactDepartments.filter(dept =>
      departments.some(d => d.name === dept)
    );

    expect(validDepartments.length).toBe(3);
  });
});
```

---

## ✅ 成功基準

### 機能要件

- [ ] API-CM-1が正常動作（バッチ取得）
- [ ] PersonalStation API-2が委員会管理で利用可能
- [ ] DepartmentStation API-3が委員会管理で利用可能
- [ ] 初期データJSONが正しい形式で提供される

### 非機能要件

- [ ] API-CM-1応答時間 < 500ms（100件リクエスト時）
- [ ] API-2応答時間 < 300ms（単体取得）
- [ ] API-8応答時間 < 100ms（部署マスタ）
- [ ] エラーハンドリング完備

### データ品質

- [ ] 職員情報の正確性100%
- [ ] 部署マスタの正確性100%
- [ ] 初期データの委員会数: 8委員会
- [ ] 初期データの総メンバー数: 60名以上

---

## 🚧 リスクと対策

### リスク1: API-CM-1のパフォーマンス

**リスク**: 100件の職員情報一括取得時に500msを超える可能性

**対策**:
- データベースクエリ最適化（インデックス活用）
- レスポンスフィールドの最小化（nameのみ等）
- 必要に応じてページネーション実装

---

### リスク2: 初期データの不正確さ

**リスク**: 委員会メンバー情報が古い、または不正確

**対策**:
- 事務部門・人事部門と連携して最新情報を確認
- データ提供前に各委員会委員長に確認依頼
- 不正確な場合の修正手順を明記

---

### リスク3: 部署マスタの変更通知

**リスク**: 部署改編時にVoiceDrive側のキャッシュが古くなる

**対策**:
- 部署改編時に医療システムからVoiceDriveへWebhook通知
- VoiceDrive側でキャッシュを強制更新
- 管理画面から手動更新可能にする

---

## 📞 VoiceDriveチームへの確認事項

### 確認-1: API仕様の詳細

**質問**: API-CM-1のレスポンスフィールドは以下で十分ですか？

```json
{
  "employeeId": "OH-NS-2024-001",
  "name": "山田 花子",
  "department": "内科",
  "position": "看護師",
  "permissionLevel": 6.0
}
```

**追加が必要なフィールドがあれば教えてください**:
- `facilityId`（施設ID）
- `hireDate`（入職日）
- `experienceYears`（経験年数）
- その他

---

### 確認-2: 初期データの提供形式

**質問**: 初期データの提供形式はJSONで問題ありませんか？

**代替案**:
- CSV形式
- Excel形式
- SQL INSERT文

---

### 確認-3: 部署マスタの更新通知

**質問**: 部署改編時にWebhook通知が必要ですか？

**Webhook仕様案**:
```yaml
POST {VoiceDrive Webhook URL}/department-updated:
  body:
    type: "department_master_updated"
    timestamp: "2025-10-10T10:00:00Z"
    changedDepartments:
      - id: "new_oncology_dept"
        name: "腫瘍科"
        changeType: "added"
```

---

## 📚 関連ドキュメント

### VoiceDriveチーム提供

- [委員会管理ページ DB要件分析_20251009.md](CM-DB-REQ-2025-1009-001)
- [委員会管理ページ 暫定マスターリスト_20251009.md](CM-MASTER-2025-1009-001)

### 医療システムチーム作成

- [データ管理責任分界点定義書_20251008.md](mcp-shared/docs/データ管理責任分界点定義書_20251008.md)
- [PersonalStation回答書_20251009.md](Response_PersonalStation_DB_Requirements_20251009.md)
- [DepartmentStation回答書（API-3実装）](過去ドキュメント)

---

## 🎯 次のアクション

### 医療システムチーム

1. ✅ **VoiceDriveチームからの3つの質問に回答** - 本文書で完了
2. ⏭️ **VoiceDriveチームに確認事項を送信**（確認-1, 2, 3）
3. ⏭️ **VoiceDrive回答受領後、API-CM-1実装開始**
4. ⏭️ **初期データJSON作成**（委員会リスト・メンバー情報）

### VoiceDriveチーム

1. ⏭️ **医療チームからの確認事項に回答**
2. ⏭️ **Phase 1完了後、統合テスト準備**
3. ⏭️ **API仕様書レビュー**（Day 4午前）

---

## 📝 サマリー

### 医療システム側の実装内容

| 項目 | 実装内容 | 工数 | コスト |
|------|---------|------|--------|
| **API-CM-1** | 職員情報一括取得（バッチ）🆕 | 3時間 | ¥120,000 |
| **API-2** | 職員情報取得（既存API流用） | 0時間 | ¥0 |
| **API-8** | 部署マスタ取得（既存API流用） | 0時間 | ¥0 |
| **初期データ** | 委員会リスト・メンバーJSON | 3時間 | ¥120,000 |
| **統合テスト** | VoiceDriveと協働 | 3時間 | ¥0（共同作業） |
| **合計** | - | **9時間** | **¥240,000** |

### コスト削減

- **元見積もり**: ¥420,000
- **実際のコスト**: ¥240,000
- **削減額**: **¥180,000**（43%削減）

### 実施スケジュール

- **Phase 2（Day 4-5）**: VoiceDriveと並行実施（2日間）
- **API実装**: Day 4午後（3時間）
- **初期データ作成**: Day 5午前（3時間）
- **統合テスト**: Day 5午後（3時間）

---

**医療システムチームは委員会管理ページの統合実装を全面的にサポートします。**

**VoiceDriveチームの素晴らしい実装を楽しみにしております。**

---

**文書終了**

*次回更新: VoiceDriveチームからの確認事項回答受領後*
