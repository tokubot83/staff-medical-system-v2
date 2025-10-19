# MyProjectsPage DB統合 医療システム確認結果

**文書番号**: MEDICAL-CONFIRM-2025-1019-004
**作成日**: 2025年10月19日
**作成者**: 医療職員管理システムチーム
**対象ページ**: MyProjectsPage (`/MyProjectsPage`)
**参照文書**: DB-REQ-2025-1019-002（VoiceDriveチーム）
**優先度**: 🔴 最高（コアプロジェクト管理機能）

---

## 📋 確認結果サマリー

### 医療システム側への影響

| 項目 | 評価 | 詳細 |
|------|------|------|
| **新規テーブル追加** | ❌ 不要 | プロジェクト管理は100%VoiceDrive管轄 |
| **既存テーブル変更** | ❌ 不要 | 医療システムDBへの影響ゼロ |
| **新規API実装** | ❌ 不要 | 既存API（職員情報、部門情報）のみ使用 |
| **既存API変更** | ❌ 不要 | 既存API仕様変更なし |
| **追加開発コスト** | ✅ ¥0 | 医療システム側の開発作業ゼロ |
| **追加保守コスト** | ✅ ¥0 | プロジェクトデータはVoiceDriveが管理 |

**総合評価**: ✅ **医療システム側への影響ゼロ、実装コストゼロ**

---

## 🎯 VoiceDriveチームの実装計画承認

### 承認内容

VoiceDriveチームが提案した以下の5テーブル追加計画を**全面承認**します：

1. ✅ **Project（プロジェクトマスタ）** - Phase 1必須
2. ✅ **ProjectTeamMember（チームメンバー）** - Phase 1必須
3. ✅ **ProjectProvisionalMember（仮選出メンバー）** - Phase 1必須
4. ✅ **ProjectWorkflowStage（承認フロー）** - Phase 1必須
5. ✅ **ProjectMilestone（マイルストーン）** - Phase 2推奨

**承認理由**:
- プロジェクト管理機能は100%VoiceDrive管轄（データ管理責任分界点に準拠）
- 医療システムは既存APIで職員情報・部門情報を提供するのみ
- データ管理責任が明確に分離されており、将来的な保守性が高い

---

## 📊 VoiceDrive側で追加が必要なテーブル

### 1. Project（プロジェクトマスタ）

**目的**: プロジェクト基本情報の管理

**推奨スキーマ**:
```prisma
model Project {
  id                    String   @id @default(cuid())
  title                 String
  description           String?  @db.Text
  status                String   @default("proposed") // proposed, approved, in_progress, completed, rejected
  createdBy             String   // VoiceDrive User.id
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  // プロジェクト実行管理
  startDate             DateTime?
  endDate               DateTime?
  department            String?  // 医療システムDepartment.id（参照のみ）
  facilityId            String?  // 医療システムFacility.id（参照のみ）

  // 進捗管理
  progress              Float    @default(0) // 0-100

  // リレーション
  teamMembers           ProjectTeamMember[]
  provisionalMembers    ProjectProvisionalMember[]
  workflowStages        ProjectWorkflowStage[]
  milestones            ProjectMilestone[]

  @@index([createdBy])
  @@index([status])
  @@index([department])
  @@index([facilityId])
  @@map("projects")
}
```

**医療システム連携ポイント**:
- `createdBy`: VoiceDrive User.id（医療システムのUser.employeeIdとマッピング）
- `department`: 医療システムDepartment.id（参照のみ、API経由で名称取得）
- `facilityId`: 医療システムFacility.id（参照のみ、API経由で名称取得）

**使用される既存医療API**:
- `GET /api/v2/employees/{employeeId}` - 職員情報取得
- `GET /api/v2/departments/{departmentId}` - 部門情報取得
- `GET /api/v2/facilities/{facilityId}` - 施設情報取得

---

### 2. ProjectTeamMember（チームメンバー）

**目的**: プロジェクトチームメンバーの管理

**推奨スキーマ**:
```prisma
model ProjectTeamMember {
  id            String   @id @default(cuid())
  projectId     String
  userId        String   // VoiceDrive User.id
  role          String   // leader, member, advisor
  status        String   @default("invited") // invited, accepted, declined
  joinedAt      DateTime?
  createdAt     DateTime @default(now())

  // リレーション
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([userId])
  @@index([status])
  @@map("project_team_members")
}
```

**医療システム連携ポイント**:
- `userId`: VoiceDrive User.id（医療システムUser.employeeIdとマッピング）
- メンバーの名前、所属部門は医療システムAPI経由で取得

---

### 3. ProjectProvisionalMember（仮選出メンバー）

**目的**: 仮選出中メンバーの管理

**推奨スキーマ**:
```prisma
model ProjectProvisionalMember {
  id            String   @id @default(cuid())
  projectId     String
  userId        String   // VoiceDrive User.id
  status        String   @default("provisional") // provisional, confirmed, rejected
  proposedAt    DateTime @default(now())
  confirmedAt   DateTime?

  // リレーション
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([userId])
  @@index([status])
  @@map("project_provisional_members")
}
```

**医療システム連携ポイント**:
- `userId`: VoiceDrive User.id（医療システムUser.employeeIdとマッピング）
- 仮選出メンバーの情報も医療システムAPI経由で取得

---

### 4. ProjectWorkflowStage（承認フロー）

**目的**: プロジェクト承認フローの管理

**推奨スキーマ**:
```prisma
model ProjectWorkflowStage {
  id            String   @id @default(cuid())
  projectId     String
  name          String   // 例: "部門長承認", "施設長承認"
  order         Int      // 承認順序
  approverId    String   // VoiceDrive User.id
  status        String   @default("pending") // pending, in_progress, approved, rejected
  approvedAt    DateTime?
  comment       String?  @db.Text
  createdAt     DateTime @default(now())

  // リレーション
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId, order])
  @@index([approverId])
  @@index([status])
  @@map("project_workflow_stages")
}
```

**医療システム連携ポイント**:
- `approverId`: VoiceDrive User.id（医療システムUser.employeeIdとマッピング）
- 承認者の役職、権限レベルは医療システムAPI経由で取得

---

### 5. ProjectMilestone（マイルストーン）

**目的**: プロジェクトマイルストーンの管理

**推奨スキーマ**:
```prisma
model ProjectMilestone {
  id            String   @id @default(cuid())
  projectId     String
  title         String
  description   String?  @db.Text
  dueDate       DateTime
  status        String   @default("not_started") // not_started, in_progress, completed, delayed
  completedAt   DateTime?
  order         Int
  createdAt     DateTime @default(now())

  // リレーション
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId, order])
  @@index([status])
  @@index([dueDate])
  @@map("project_milestones")
}
```

**医療システム連携ポイント**:
- 医療システム連携不要（100%VoiceDrive管理）

---

## 💰 コスト見積もり

### 医療システム側

| 項目 | コスト | 工数 | 備考 |
|------|--------|------|------|
| DB設計 | ¥0 | 0日 | 新規テーブル追加なし |
| API実装 | ¥0 | 0日 | 既存APIのみ使用 |
| テスト | ¥0 | 0日 | VoiceDrive側でテスト完結 |
| **合計** | **¥0** | **0日** | **医療システム作業なし** |

---

### VoiceDrive側（Phase 1のみ）

| 項目 | コスト | 工数 | 備考 |
|------|--------|------|------|
| スキーマ設計・実装 | ¥200,000 | 3日 | 4テーブル追加、Prisma migrate |
| Project CRUD API実装 | ¥250,000 | 4日 | 全CRUD操作、フィルタリング、ページング |
| MyProjectsPage統合 | ¥150,000 | 2日 | demoProjects → 実DB |
| 統合テスト | ¥100,000 | 2日 | API・UI・E2Eテスト |
| **Phase 1合計** | **¥700,000** | **11日** | **最小限の動作保証** |

---

### VoiceDrive側（Phase 2: マイルストーン対応）

| 項目 | コスト | 工数 | 備考 |
|------|--------|------|------|
| ProjectMilestoneテーブル追加 | ¥80,000 | 1日 | Prisma schema拡張 |
| Milestone CRUD API実装 | ¥120,000 | 2日 | CRUD、進捗計算 |
| UI統合 | ¥100,000 | 1.5日 | マイルストーン表示・編集 |
| テスト | ¥50,000 | 0.5日 | 統合テスト |
| **Phase 2合計** | **¥350,000** | **5日** | **マイルストーン機能追加** |

---

### VoiceDrive側（Phase 3: 高度な機能）

| 項目 | コスト | 工数 | 備考 |
|------|--------|------|------|
| ProjectVoteテーブル追加 | ¥80,000 | 1日 | 投票機能用 |
| スコアリングエンジン実装 | ¥150,000 | 2日 | 投票集計、ランキング |
| 投票UI実装 | ¥120,000 | 2日 | 投票インタフェース |
| テスト | ¥50,000 | 1日 | 統合テスト |
| **Phase 3合計** | **¥400,000** | **6日** | **投票・ランキング機能** |

---

### 全フェーズ合計

| チーム | コスト | 工数 | 備考 |
|--------|--------|------|------|
| 医療システム | ¥0 | 0日 | 作業なし |
| VoiceDrive（Phase 1） | ¥700,000 | 11日 | **優先実装** |
| VoiceDrive（Phase 2） | ¥350,000 | 5日 | 推奨 |
| VoiceDrive（Phase 3） | ¥400,000 | 6日 | オプション |
| **合計** | **¥1,450,000** | **22日** | **全フェーズ** |

---

## 📅 実装スケジュール推奨

### Phase 1: 最小限の動作（11日間）

**目標**: MyProjectsPageを実DBで動作させる

**Week 1-2（11営業日）**:

| 日 | 作業内容 | 担当 | 医療チーム作業 |
|----|---------|------|--------------|
| **1-3日目** | 4テーブル追加（Prisma schema拡張、migrate実行） | VoiceDrive | なし |
| **4-7日目** | Project CRUD API実装（全CRUD、フィルタリング） | VoiceDrive | なし |
| **8-9日目** | MyProjectsPage統合（demoProjects削除、実DB接続） | VoiceDrive | なし |
| **10-11日目** | 統合テスト（API・UI・E2E） | VoiceDrive | なし |

**Phase 1完了後の成果物**:
- ✅ MyProjectsPageが実DBで動作
- ✅ 統計カードが実データで表示
- ✅ プロジェクト一覧が実データで表示
- ✅ チームメンバー、仮選出メンバー、承認フローが実データで動作

---

### Phase 2: マイルストーン対応（5日間）

**Week 3（5営業日）**:

| 日 | 作業内容 | 担当 | 医療チーム作業 |
|----|---------|------|--------------|
| **1日目** | ProjectMilestoneテーブル追加 | VoiceDrive | なし |
| **2-3日目** | Milestone CRUD API実装 | VoiceDrive | なし |
| **4日目** | UI統合（マイルストーン表示・編集） | VoiceDrive | なし |
| **5日目** | 統合テスト | VoiceDrive | なし |

---

### Phase 3: 高度な機能（6日間）

**Week 4（6営業日）**:

| 日 | 作業内容 | 担当 | 医療チーム作業 |
|----|---------|------|--------------|
| **1日目** | ProjectVoteテーブル追加 | VoiceDrive | なし |
| **2-3日目** | スコアリングエンジン実装 | VoiceDrive | なし |
| **4-5日目** | 投票UI実装 | VoiceDrive | なし |
| **6日目** | 統合テスト | VoiceDrive | なし |

---

## ✅ 医療システム側の確認事項

### 既存API仕様の確認（Phase 1実装前）

VoiceDriveチームが使用する既存APIの動作確認を実施します：

1. **職員情報取得API**
   ```
   GET /api/v2/employees/{employeeId}
   ```
   **確認内容**: employeeId、name、department、facilityIdの取得

2. **部門情報取得API**
   ```
   GET /api/v2/departments/{departmentId}
   ```
   **確認内容**: departmentId、nameの取得

3. **施設情報取得API**
   ```
   GET /api/v2/facilities/{facilityId}
   ```
   **確認内容**: facilityId、nameの取得

**確認方法**: 既存APIのcURLテストをVoiceDriveチームが実施

**医療チーム作業**: API仕様書の最終確認のみ（所要時間: 30分）

---

## 🎯 データ管理責任分界の明確化

### VoiceDrive側の管理範囲（100%）

- ✅ Projectテーブル（全フィールド）
- ✅ ProjectTeamMemberテーブル（全フィールド）
- ✅ ProjectProvisionalMemberテーブル（全フィールド）
- ✅ ProjectWorkflowStageテーブル（全フィールド）
- ✅ ProjectMilestoneテーブル（全フィールド）
- ✅ プロジェクト統計情報の計算
- ✅ プロジェクト進捗管理
- ✅ 承認フロー管理

### 医療システム側の管理範囲（参照のみ）

- ✅ Userテーブル（職員マスタ）
- ✅ Departmentテーブル（部門マスタ）
- ✅ Facilityテーブル（施設マスタ）
- ✅ PermissionLevelテーブル（権限レベルマスタ）

**データ取得方法**: 既存API経由のみ（医療システムDBへの直接アクセスなし）

---

## 🔐 セキュリティ・権限制御

### VoiceDrive側で実装

- ✅ プロジェクト作成権限チェック（permissionLevel >= 3）
- ✅ プロジェクト編集権限チェック（createdBy or teamMember）
- ✅ 承認権限チェック（approverId一致）
- ✅ プロジェクト閲覧権限チェック（施設・部門フィルタリング）

### 医療システムAPI経由で取得

- ✅ 職員の権限レベル（permissionLevel）
- ✅ 職員の所属施設（facilityId）
- ✅ 職員の所属部門（departmentId）

---

## 📋 成功指標

### Phase 1完了時

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| MyProjectsPage実DB動作率 | 100% | E2Eテスト |
| 統計カード正確性 | 100% | 実データとの整合性確認 |
| API応答時間 | < 200ms | パフォーマンステスト |
| データ整合性 | 100% | DB整合性チェック |
| テストカバレッジ | > 80% | Jest coverage |

### Phase 2完了時

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| マイルストーン機能動作率 | 100% | E2Eテスト |
| 進捗計算正確性 | 100% | 手動計算との比較 |

### Phase 3完了時

| 指標 | 目標値 | 測定方法 |
|------|--------|---------|
| 投票機能動作率 | 100% | E2Eテスト |
| スコアリング正確性 | 100% | 手動計算との比較 |

---

## 💡 推奨事項

### VoiceDriveチームへの推奨

1. **Phase 1を最優先で実装**
   - MyProjectsPageは現在デモデータのみで動作
   - 本番運用にはPhase 1必須

2. **段階的なリリース**
   - Phase 1 → Phase 2 → Phase 3の順で実装
   - 各Phase完了後にリリース、フィードバック収集

3. **既存APIの活用**
   - 医療システムAPIを積極活用
   - 職員情報、部門情報、施設情報は全てAPI経由

4. **データ整合性の確保**
   - 外部キー制約の適切な設定
   - カスケード削除の設定
   - インデックスの最適化

---

## 📞 連絡先

**医療職員管理システムチーム**:
- Slack: `#phase2-integration`
- MCPサーバー: `mcp-shared/docs/`
- 担当者: 医療システムプロジェクトリーダー

**確認事項がある場合**:
- VoiceDriveチームからの質問に随時対応
- 既存API仕様の確認対応（所要時間: 30分程度）

---

## ✅ 次のアクション

### VoiceDriveチーム（Phase 1実装開始前）

1. ⬜ 本確認結果書の受領確認
2. ⬜ Prisma schema設計の最終レビュー
3. ⬜ 既存医療APIのテスト実施
4. ⬜ Phase 1実装計画の確定
5. ⬜ マスタープランへの反映（Phase 26追加）

### 医療システムチーム

1. ✅ 本確認結果書の送付
2. ⬜ 既存API仕様書の最終確認（30分）
3. ⬜ VoiceDriveチームからの質問対応（随時）

---

## 🎉 結論

MyProjectsPageのDB統合について、以下の通り承認します：

**承認内容**:
- ✅ VoiceDriveチームの5テーブル追加計画を全面承認
- ✅ Phase 1-3の段階的実装計画を承認
- ✅ 医療システム側の作業ゼロを確認

**医療システム側への影響**:
- ✅ 新規テーブル追加: **不要**
- ✅ 新規API実装: **不要**
- ✅ 追加開発コスト: **¥0**
- ✅ 追加保守コスト: **¥0**

**VoiceDrive側の実装コスト**:
- Phase 1（必須）: ¥700,000（11日）
- Phase 2（推奨）: ¥350,000（5日）
- Phase 3（オプション）: ¥400,000（6日）
- **合計**: ¥1,450,000（22日）

**優先度**: 🔴 **最高**（MyProjectsPageは現在デモデータのみ、本番運用にPhase 1必須）

VoiceDriveチームの効率的な実装計画に期待しています。Phase 1完了後の共同確認ミーティングを楽しみにしております。

---

**医療職員管理システムチーム**
2025年10月19日

**承認者**: 医療システムプロジェクトリーダー
**文書番号**: MEDICAL-CONFIRM-2025-1019-004
**参照文書**: DB-REQ-2025-1019-002（VoiceDriveチーム）
