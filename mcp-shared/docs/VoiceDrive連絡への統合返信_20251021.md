# VoiceDriveチームへの統合返信

**文書番号**: MED-REPLY-2025-1021-003
**作成日**: 2025年10月21日
**作成者**: 医療職員カルテシステムチーム
**宛先**: VoiceDriveチーム
**件名**: Phase 2 Approvals実装完了のご連絡を受けて - 医療システム側対応計画のご報告

---

## 📋 エグゼクティブサマリー

VoiceDriveチーム様

いつもお世話になっております。医療職員カルテシステムチームです。

この度は、**Phase 2承認・対応管理ページ（Approvals）の実装完了**のご連絡、誠にありがとうございました。
貴チームの迅速な実装に心より感謝申し上げます。

本文書では、以下の2つの機能に関する医療システム側の対応計画をまとめてご報告いたします：

1. **Approvals機能** - VoiceDrive実装完了（医療システム側の小規模対応が必要）
2. **Career Course Change Request機能** - VoiceDrive暫定マスターリスト受領（医療システム側の大規模実装が必要）

---

## 📊 対応要否サマリー

| 機能 | VoiceDrive実装 | 医療システム実装 | 優先度 | 実装規模 |
|------|--------------|----------------|-------|---------|
| **Approvals** | ✅ 完了 | 🟡 小規模（0.6日） | 🟡 MEDIUM | 1 API + 1フィールド |
| **Career Course Change** | 🟡 UI完了 | 🔴 大規模（3週間） | 🔴 CRITICAL | 3テーブル + 4 API + S3 |

---

## 🎯 Part 1: Approvals機能への対応

### ✅ VoiceDrive側実装完了内容の確認

貴チームからのご報告により、以下が完了したことを確認いたしました：

| Phase | 実装内容 | ステータス |
|-------|---------|----------|
| **Phase 1** | DBスキーマ拡張（3モデル、29フィールド） | ✅ 完了 |
| **Phase 2** | ActionableNotificationService実装（6メソッド） | ✅ 完了 |
| **Phase 3** | Approvals API実装（5エンドポイント） | ✅ 完了 |

**実装統計**:
- 実装ファイル数: 5ファイル
- 総コード行数: 約2,000行
- 実装期間: 約2日（計画通り）

貴チームの迅速かつ丁寧な実装に、深く感謝申し上げます。

---

### 🟡 医療システム側の対応計画

#### 必要な実装（2件）

##### 1. 組織階層API実装 🟡

**エンドポイント**: `GET /api/v2/employees/:employeeId/hierarchy`

**実装状況の確認結果**: ✅ **supervisorIdフィールドは既に存在**

Prisma schema.prisma (80, 92-93行目)を確認したところ、`supervisorId`フィールドと組織階層リレーションは**既に実装済み**であることを確認いたしました：

```prisma
model Employee {
  // ...
  supervisorId    String?   // 上司のID
  // ...
  supervisor   Employee?     @relation("EmployeeHierarchy", fields: [supervisorId], references: [id])
  subordinates Employee[]    @relation("EmployeeHierarchy")
}
```

**実装内容**:
- 既存のsupervisorIdフィールドを使用
- 組織階層を取得するAPI実装のみが必要

**レスポンス仕様**:
```json
{
  "employee": {
    "id": "OH-NS-2024-020",
    "name": "田中看護師長",
    "permissionLevel": 8.0,
    "supervisorId": "OH-NS-2024-030"
  },
  "parent": {
    "id": "OH-NS-2024-030",
    "name": "山田部長",
    "permissionLevel": 10.0,
    "supervisorId": null
  }
}
```

**確認事項への回答**:
> - 親が存在しない場合（最上位職員の場合）、`parent`は`null`でよろしいでしょうか？
> - `supervisorId`が未設定の場合も`parent`は`null`でよろしいでしょうか？

**回答**: ✅ はい、どちらの場合も`parent: null`で問題ございません。

**推定工数**: 0.3日（2-3時間）← 当初0.5日から短縮（supervisorId既存のため）

---

##### 2. budgetApprovalLimitフィールド追加 🟡

**テーブル**: `Employee`

**実装内容**:
1. Prismaスキーマにフィールド追加
2. マイグレーション実行
3. 初期値設定（権限レベルに応じて）

**Prismaスキーマ変更**:
```prisma
model Employee {
  // ... 既存フィールド ...
  budgetApprovalLimit Decimal?  @map("budget_approval_limit") @db.Decimal(15,2)
  // ... 既存フィールド ...
}
```

**初期値設定**:
```sql
UPDATE employees
SET budget_approval_limit = CASE
  WHEN permission_level >= 10 THEN 5000000   -- 部長クラス: 500万円
  WHEN permission_level >= 8  THEN 1000000   -- 師長クラス: 100万円
  WHEN permission_level >= 5  THEN 500000    -- 主任クラス: 50万円
  ELSE NULL
END;
```

**確認事項への回答**:
> 既存職員の`budgetApprovalLimit`初期値設定は貴チームで実施していただけますでしょうか？

**回答**: ✅ はい、医療システムチームで初期値設定を実施いたします。上記の権限レベル基準で問題ございませんでしょうか？貴チームからの追加要望があれば、お気軽にお申し付けください。

**推定工数**: 0.3日（2-3時間）

---

#### 合計実装工数（Approvals機能）

**合計**: 0.6日（約5時間）← 当初0.8日から短縮

| 項目 | 当初見積 | 実際 | 理由 |
|------|---------|------|------|
| 組織階層API | 0.5日 | 0.3日 | supervisorId既存のため |
| budgetApprovalLimit | 0.3日 | 0.3日 | 変更なし |
| **合計** | **0.8日** | **0.6日** | **25%削減** |

---

#### 実装スケジュール（Approvals機能）

| 日付 | 作業内容 | 担当 | 推定工数 | 状態 |
|------|---------|------|---------|------|
| 10/22 AM | 組織階層API実装 | 医療システムチーム | 0.3日 | ⏳ 準備完了 |
| 10/22 PM | budgetApprovalLimitフィールド追加 | 医療システムチーム | 0.3日 | ⏳ 準備完了 |
| 10/23 | VoiceDriveチームへ完了報告 | 医療システムチーム | - | ⏳ 待機中 |

**開始予定**: 2025年10月22日 9:00
**完了予定**: 2025年10月22日 18:00（1営業日で完了）

---

## 🔴 Part 2: Career Course Change Request機能への対応

### 📋 VoiceDrive側実装状況の確認

VoiceDriveチームから受領した「career-course-change_医療システム確認結果_20251021.md」を精査いたしました。

**VoiceDrive側の実装完了内容**:
- ✅ UI実装: ChangeRequestPage.tsx（完了）
- ✅ サービス層: careerCourseService.ts（完了）
- ✅ 型定義: career-course.ts（完了）
- ⏳ TODO実装: ファイルアップロード処理（医療システムAPI待ち）

---

### 🔴 医療システム側の大規模実装が必要

**結論**: Career Course Change Request機能は**医療システムのキャリア選択制度と100%連携**するため、医療システム側で**大規模な実装が必要**です。

#### 責任分界点

| データカテゴリ | VoiceDrive | 医療システム | 連携方法 |
|-------------|-----------|-------------|---------|
| **コース定義マスタ** | ❌ | ✅ 100%管轄 | API提供 |
| **現在のコース選択状況** | ❌ | ✅ 100%管轄 | API提供 |
| **コース変更申請データ** | ❌ | ✅ 100%管轄 | API提供 |
| **添付ファイル** | ❌ | ✅ 100%管轄 | S3/CloudFront |
| **承認・審査** | ❌ | ✅ 100%管轄 | API提供 |
| **職員情報** | キャッシュ | ✅ マスタ | API提供（既存） |

---

#### 必要な実装（詳細）

##### 🔴 DB実装: 3テーブル追加

1. **career_course_definitions**（コース定義マスタ）
   - A/B/C/Dコースの定義を管理
   - 給与係数、異動条件、夜勤条件を一元管理

2. **career_course_selections**（現在のコース選択状況）
   - 職員ごとの現在のコースを管理
   - 履歴管理（過去のコースも保持）
   - 次回変更可能日の管理（年1回制限）

3. **career_course_change_requests**（コース変更申請）
   - 申請～承認～却下までの全データを管理
   - 添付ファイルのメタデータ保存（JSON形式）

**推定工数**: 2日

---

##### 🔴 API実装: 4エンドポイント追加

1. **GET `/api/career-courses/definitions`** - コース定義一覧取得
2. **GET `/api/my-page`** - マイページ情報取得（現在のコース含む）
3. **POST `/api/career-course/change-request`** - コース変更申請送信
4. **POST `/api/career-course/upload-attachment`** - 添付ファイルアップロード

**推定工数**: 3日

---

##### 🔴 ファイルストレージ: S3/CloudFront構築

- **S3バケット**: `medical-system-career-attachments`
- **CloudFront**: 署名付きURL生成（有効期限30日）
- **暗号化**: AES-256サーバー側暗号化
- **保存期間**: 3年後に自動削除（ライフサイクルポリシー）

**推定工数**: 1日

---

##### 🟠 人事部管理画面実装（Phase 3）

- 申請一覧画面
- 申請詳細画面
- 審査・承認画面
- 承認・却下処理

**推定工数**: 5日

---

#### 合計実装工数（Career Course Change Request機能）

| Phase | 実装内容 | 推定工数 | 優先度 |
|-------|---------|---------|-------|
| **Phase 1** | DB設計・API実装・S3構築 | 6日 | 🔴 CRITICAL |
| **Phase 2** | VoiceDrive統合 | 2日 | 🔴 CRITICAL |
| **Phase 3** | 人事部管理画面 | 5日 | 🟠 HIGH |

**合計**: 13日（約3週間）

---

#### 実装スケジュール（Career Course Change Request機能）

##### Option A: 即座実装（推奨）

| 期間 | 実施内容 | 備考 |
|------|---------|------|
| **Week 1** (10/28-11/1) | Phase 1実装（DB・API・S3） | 優先度HIGH |
| **Week 2** (11/4-11/8) | Phase 2実装（VoiceDrive統合） | 統合テスト |
| **Week 3** (11/11-11/15) | Phase 3実装（人事部管理画面） | 本番リリース準備 |
| **11/18** | 本番リリース | 段階的ロールアウト |

---

##### Option B: 共通DB構築後（延期案）

| 期間 | 実施内容 | 備考 |
|------|---------|------|
| **11/1-11/5** | 共通DB構築（VoiceDriveチーム） | 待機 |
| **Week 1** (11/11-11/15) | Phase 1実装（DB・API・S3） | DB構築後開始 |
| **Week 2** (11/18-11/22) | Phase 2実装（VoiceDrive統合） | 統合テスト |
| **Week 3** (11/25-11/29) | Phase 3実装（人事部管理画面） | 本番リリース準備 |
| **12/2** | 本番リリース | 段階的ロールアウト |

---

### 🎯 推奨実装スケジュール

**医療システムチームの推奨**: **Option B（共通DB構築後）**

**理由**:
1. 共通DB構築と並行してPhase 1を実装すると、マイグレーション調整が複雑化
2. Approvalsの統合テスト（11/6-11/8）に集中できる
3. 共通DB構築完了後、最新のスキーマで実装開始できる
4. VoiceDriveチームのTODO実装（ファイルアップロード）と同期できる

**デメリット**:
- 本番リリースが約2週間遅延（11/18 → 12/2）

VoiceDriveチームのご意向をお聞かせください。

---

## ❓ VoiceDriveチームへの確認事項

### 確認-1: Approvals実装スケジュールの承認

**質問**: Approvals機能の医療システム側実装を**10/22（明日）**に開始し、**10/22中に完了**予定です。問題ございませんでしょうか？

**実装内容**:
- 🟡 組織階層API実装（0.3日）
- 🟡 budgetApprovalLimitフィールド追加（0.3日）

**完了報告**: 10/23（水）

---

### 確認-2: Career Course Change Request実装スケジュールの選択

**質問**: Career Course Change Request機能の実装スケジュールは、以下のどちらを希望されますか？

| Option | 開始時期 | 本番リリース | メリット | デメリット |
|--------|---------|------------|---------|----------|
| **A: 即座実装** | 10/28 | 11/18 | 早期リリース | 共通DB構築と並行（調整複雑） |
| **B: DB構築後** | 11/11 | 12/2 | DB構築完了後スムーズ | 2週間遅延 |

**医療システムチームの推奨**: **Option B（DB構築後）**

貴チームのご意向をお聞かせください。

---

### 確認-3: budgetApprovalLimit初期値の承認

**質問**: 以下の初期値設定基準で問題ございませんでしょうか？

```sql
UPDATE employees
SET budget_approval_limit = CASE
  WHEN permission_level >= 10 THEN 5000000   -- 部長クラス: 500万円
  WHEN permission_level >= 8  THEN 1000000   -- 師長クラス: 100万円
  WHEN permission_level >= 5  THEN 500000    -- 主任クラス: 50万円
  ELSE NULL
END;
```

追加要望があれば、お気軽にお申し付けください。

---

### 確認-4: Career Course Change Request確認事項（3件）

#### 確認-4-1: キャリア選択制度の詳細仕様

**質問**:
> キャリア選択制度（A/B/C/Dコース）について、以下を確認させてください：
>
> 1. コース変更は**年1回のみ**で確定ですか？
> 2. 特例変更（妊娠・介護・疾病）の場合、年1回制限は適用外ですか？
> 3. 承認権限は**人事部のみ**ですか？それとも施設ごとに承認者がいますか？
> 4. 承認フローは**1段階（人事部のみ）**ですか？複数段階ですか？

**期待回答**:
- ✅ 年1回のみ（特例除く）
- ✅ 特例は年1回制限なし（ただし証明書必須）
- ✅ 承認者: 人事部（1段階）
- ✅ 審査期間: 通常2週間以内

---

#### 確認-4-2: 添付ファイルの保存期間とアクセス制御

**質問**:
> 添付ファイル（証明書類）について：
>
> 1. 保存期間は何年ですか？（推奨: 3年）
> 2. 誰がアクセスできますか？
>    - 申請者本人: ○
>    - 人事部: ○
>    - 直属上司: △
>    - 他職員: ×
> 3. ファイルサイズ制限は？（推奨: 10MB）
> 4. 許可する拡張子は？（推奨: .pdf, .jpg, .png）

**期待回答**:
- 保存期間: 3年（法定保存期間）
- アクセス権: 本人 + 人事部のみ
- サイズ制限: 10MB
- 拡張子: .pdf, .jpg, .jpeg, .png

---

#### 確認-4-3: 通知・メール送信の仕様

**質問**:
> 通知・メール送信について：
>
> 1. 申請受付時に申請者へメール送信しますか？
> 2. 新規申請時に人事部へメール送信しますか？
> 3. 承認・却下時に申請者へメール送信しますか？
> 4. VoiceDriveへのWebhook通知は必要ですか？（オプション）

**期待回答**:
- ✅ 申請受付メール: 申請者へ
- ✅ 新規申請通知: 人事部へ
- ✅ 結果通知: 申請者へ
- 🟡 Webhook: オプション（VoiceDrive側では不要）

---

## 📅 統合スケジュール（全体）

### Phase 2全体スケジュール（Approvals + Career Course Change Request）

| 期間 | Approvals | Career Course Change Request | 備考 |
|------|-----------|----------------------------|------|
| **10/21** | VoiceDrive実装完了 | VoiceDrive UI完了 | 本日 |
| **10/22** | 医療システム実装（0.6日） | - | 明日 |
| **10/23** | 完了報告 | - | |
| **11/1-11/5** | - | 共通DB構築 | VoiceDrive |
| **11/5** | マイグレーション実行 | - | |
| **11/6-11/8** | 統合テスト | - | 両チーム |
| **11/11** | 本番リリース | Phase 1実装開始（Option B） | |
| **11/11-11/15** | - | Phase 1実装（DB・API・S3） | |
| **11/18-11/22** | - | Phase 2実装（VoiceDrive統合） | |
| **11/25-11/29** | - | Phase 3実装（人事部管理画面） | |
| **12/2** | - | 本番リリース | 段階的ロールアウト |

---

## 🔗 関連ドキュメント

### 本返信に関連する文書

| 文書 | ファイル名 | 作成日 | 作成者 |
|------|----------|--------|--------|
| **VoiceDrive実装完了連絡** | `approvals_VoiceDrive実装完了連絡書_医療チームへ_20251021.md` | 10/21 | VoiceDrive |
| **医療システム確認結果（Approvals）** | `approvals_医療システム確認結果_20251021.md` | 10/21 | 医療システム |
| **医療システム確認結果（Career Course Change）** | `career-course-change_医療システム確認結果_20251021.md` | 10/21 | 医療システム |
| **本文書（統合返信）** | `VoiceDrive連絡への統合返信_20251021.md` | 10/21 | 医療システム |

### その他関連文書（参考）

| 文書 | ファイル名 | 作成日 |
|------|----------|--------|
| Approvals DB要件分析 | `approvals_DB要件分析_20251013.md` | 10/13 |
| Approvals暫定マスターリスト | `approvals暫定マスターリスト_20251013.md` | 10/13 |
| Career Course Change 暫定マスターリスト | `career-selection-station/change-request 暫定マスターリスト` | - |
| Phase 2 Lightsail Public Folder実装サマリー | `Phase2_Implementation_Summary_20251021.md` | 10/21 |

---

## 🎯 次のアクション

### 医療システムチーム（即座）

- [x] ✅ VoiceDrive実装完了連絡の受領・確認
- [x] ✅ 統合返信書の作成
- [ ] 🟢 VoiceDriveチームからの確認事項回答待ち
- [ ] 🟢 Approvals実装開始（10/22、承認後）
- [ ] 🟢 Career Course Change Request実装スケジュール確定待ち

### VoiceDriveチーム（ご依頼）

- [ ] 本文書のレビュー
- [ ] 確認事項（4件）への回答
  - 確認-1: Approvals実装スケジュール承認
  - 確認-2: Career Course Change Request実装スケジュール選択（Option A or B）
  - 確認-3: budgetApprovalLimit初期値承認
  - 確認-4: Career Course Change Request詳細仕様確認（3件）
- [ ] 共通DB構築（11/1-11/5予定）
- [ ] マイグレーション実行（11/5予定）
- [ ] 統合テスト実施（11/6-11/8予定）

---

## 🙏 まとめ

VoiceDriveチーム様

Phase 2承認・対応管理ページの実装完了、誠にありがとうございました。
医療システムチームとしても、貴チームの迅速かつ丁寧な実装に深く感謝申し上げます。

**医療システム側の対応計画**:

### Approvals機能
- ✅ 実装規模: 小規模（0.6日）
- ✅ 実装内容: 1 API + 1フィールド
- ✅ 開始予定: 10/22（明日）
- ✅ 完了予定: 10/22（1営業日）

### Career Course Change Request機能
- 🔴 実装規模: 大規模（3週間）
- 🔴 実装内容: 3テーブル + 4 API + S3/CloudFront + 人事部管理画面
- 🔴 開始予定: 11/11（共通DB構築後、Option B推奨）
- 🔴 完了予定: 12/2（本番リリース）

**VoiceDriveチームへのご依頼**:
- 確認事項（4件）への回答
- 実装スケジュールの最終承認
- 共通DB構築の実施（11/1-11/5予定）

貴チームからのご回答をお待ちしております。

共通DB構築後、速やかにマイグレーションと統合テストを実施し、Phase 2全体の本番リリースに向けて進めてまいります。

ご不明な点やご質問がございましたら、お気軽にお申し付けください。

引き続き、何卒よろしくお願い申し上げます。

---

**発信元**: 医療職員カルテシステムチーム
プロジェクトリーダー: [氏名]
バックエンドリーダー: [氏名]
フロントエンドリーダー: [氏名]

**連絡先**:
- Slack: `#medical-voicedrive-integration`
- Email: medical-team@example.com

**発信日**: 2025年10月21日

---

## 付録A: API実装詳細（Approvals）

### 組織階層API実装仕様

**ファイル**: `src/app/api/v2/employees/[employeeId]/hierarchy/route.ts`

**実装例**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const { employeeId } = params;

    // 職員情報と上司情報を取得
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        name: true,
        permissionLevel: true,
        supervisorId: true,
        supervisor: {
          select: {
            id: true,
            name: true,
            permissionLevel: true,
            supervisorId: true,
          }
        }
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      employee: {
        id: employee.id,
        name: employee.name,
        permissionLevel: employee.permissionLevel,
        supervisorId: employee.supervisorId,
      },
      parent: employee.supervisor || null,
    });
  } catch (error) {
    console.error('Hierarchy API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**テストケース**:
1. 正常系: 上司が存在する職員
2. 正常系: 上司が存在しない職員（最上位）
3. 異常系: 存在しない職員ID
4. 異常系: supervisorIdが無効なID

---

## 付録B: DB変更詳細（Career Course Change Request）

### Prismaスキーマ変更（抜粋）

#### budgetApprovalLimitフィールド追加

```prisma
model Employee {
  // ... 既存フィールド ...
  supervisorId        String?   // 上司のID（既存）
  budgetApprovalLimit Decimal?  @map("budget_approval_limit") @db.Decimal(15,2) // 🆕 追加
  // ... 既存フィールド ...
}
```

#### CareerCourseDefinitionモデル追加

```prisma
model CareerCourseDefinition {
  id                           String  @id @default(cuid())
  courseCode                   String  @unique // 'A', 'B', 'C', 'D'
  courseName                   String
  description                  String?
  baseSalaryMultiplier         Float   @default(1.0)
  // ... その他のフィールド ...
}
```

#### CareerCourseSelectionモデル追加

```prisma
model CareerCourseSelection {
  id                        String    @id @default(cuid())
  employeeId                String
  courseCode                String
  effectiveFrom             DateTime
  effectiveTo               DateTime?
  nextChangeAvailableDate   DateTime?
  // ... その他のフィールド ...
}
```

#### CareerCourseChangeRequestモデル追加

```prisma
model CareerCourseChangeRequest {
  id                       String    @id @default(cuid())
  employeeId               String
  currentCourseCode        String
  requestedCourseCode      String
  changeReason             String
  approvalStatus           String    @default("pending")
  attachments              Json?
  // ... その他のフィールド ...
}
```

---

**END OF DOCUMENT**
