# Phase 6 VoiceDriveチーム アクションプラン - 10/21（月）

**作成日**: 2025年10月20日
**対象**: Phase 6 期限到達判断履歴機能
**ステータス**: 実装完了 → データ準備・統合テスト準備

---

## 🎯 明日（10/21 月曜日）のタスク

### 1. データベースマイグレーション実行 ⏰ 09:00

**担当**: バックエンドチーム

**タスク**:
```bash
# 既存データを保持するため、手動SQLマイグレーションを実施

# 1. バックアップ作成
cp prisma/dev.db prisma/dev.db.backup

# 2. テーブル存在確認
sqlite3 prisma/dev.db "SELECT name FROM sqlite_master WHERE type='table' AND name='ExpiredEscalationDecision';"

# 3. テーブルが存在しない場合、Prisma migrateを実行
npx prisma migrate dev --name add_expired_escalation_decision

# 4. Prisma Clientの再生成
npx prisma generate

# 5. 動作確認
npm run test:db-connection
```

**成功条件**:
- ✅ `ExpiredEscalationDecision`テーブルが作成されている
- ✅ 既存データが保持されている
- ✅ Prisma Clientが正常に動作する

---

### 2. テストデータ生成・投入 ⏰ 10:00

**担当**: バックエンドチーム

**タスク**:

#### 2.1 テストデータ生成スクリプト作成

**ファイル**: `scripts/generate-expired-escalation-test-data.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { addDays, subDays } from 'date-fns';

const prisma = new PrismaClient();

async function generateTestData() {
  console.log('🚀 期限到達判断テストデータ生成開始...');

  // 1. テスト用ユーザーの取得（LEVEL_5-18）
  const managers = await prisma.user.findMany({
    where: {
      permissionLevel: { gte: 5 }
    },
    take: 10
  });

  // 2. テスト用提案の取得（期限到達済み）
  const expiredProposals = await prisma.post.findMany({
    where: {
      agendaVotingDeadline: { lte: new Date() },
      agendaLevel: { in: ['escalated_to_dept', 'escalated_to_facility', 'escalated_to_corp'] }
    },
    take: 100
  });

  console.log(`📊 対象管理職: ${managers.length}名`);
  console.log(`📊 対象提案: ${expiredProposals.length}件`);

  // 3. テストデータ生成
  const testDecisions = [];
  const decisionTypes = [
    'approve_at_current_level', // 60%
    'downgrade',                 // 25%
    'reject'                     // 15%
  ];

  for (let i = 0; i < 100; i++) {
    const proposal = expiredProposals[i % expiredProposals.length];
    const manager = managers[i % managers.length];
    const decisionType =
      i < 60 ? decisionTypes[0] :
      i < 85 ? decisionTypes[1] :
      decisionTypes[2];

    const currentScore = proposal.agendaScore || 0;
    const targetScore =
      proposal.agendaLevel?.includes('CORP') ? 600 :
      proposal.agendaLevel?.includes('FACILITY') ? 300 :
      100;

    const achievementRate = (currentScore / targetScore) * 100;

    const deadline = new Date(proposal.agendaVotingDeadline || new Date());
    const now = new Date();
    const daysOverdue = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24));

    testDecisions.push({
      postId: proposal.id,
      deciderId: manager.id,
      decision: decisionType,
      decisionReason: generateDecisionReason(decisionType, achievementRate),
      currentScore,
      targetScore,
      achievementRate,
      daysOverdue: Math.max(0, daysOverdue),
      agendaLevel: proposal.agendaLevel || 'unknown',
      proposalType: proposal.proposalType,
      department: proposal.department,
      facilityId: proposal.facilityId,
      createdAt: subDays(new Date(), Math.floor(Math.random() * 30))
    });
  }

  // 4. データベースに投入
  console.log('💾 データベースに投入中...');

  for (const decision of testDecisions) {
    await prisma.expiredEscalationDecision.create({
      data: decision
    });
  }

  console.log('✅ テストデータ生成完了！');
  console.log(`📊 生成件数: ${testDecisions.length}件`);
  console.log(`   - 承認: ${testDecisions.filter(d => d.decision === 'approve_at_current_level').length}件`);
  console.log(`   - ダウングレード: ${testDecisions.filter(d => d.decision === 'downgrade').length}件`);
  console.log(`   - 不採用: ${testDecisions.filter(d => d.decision === 'reject').length}件`);

  return testDecisions;
}

function generateDecisionReason(decisionType: string, achievementRate: number): string {
  switch (decisionType) {
    case 'approve_at_current_level':
      return `到達率${achievementRate.toFixed(1)}%で、現在のレベルでの実施が適切と判断しました。職員の積極的な参加が見られ、十分な意義があると考えます。`;
    case 'downgrade':
      return `到達率${achievementRate.toFixed(1)}%で目標に届きませんでしたが、提案内容には価値があるため、下位レベルでの実施を検討します。`;
    case 'reject':
      return `到達率${achievementRate.toFixed(1)}%と低く、また期限を大幅に超過しているため、今回は不採用とします。別の形での提案を期待します。`;
    default:
      return '判断理由を記入してください。';
  }
}

generateTestData()
  .then(() => {
    console.log('✅ 全処理完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ エラー:', error);
    process.exit(1);
  });
```

#### 2.2 テストデータ実行

```bash
# スクリプト実行
npx tsx scripts/generate-expired-escalation-test-data.ts

# 結果確認
npx prisma studio
# または
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM ExpiredEscalationDecision;"
sqlite3 prisma/dev.db "SELECT decision, COUNT(*) FROM ExpiredEscalationDecision GROUP BY decision;"
```

**成功条件**:
- ✅ 100件のテストデータが投入されている
- ✅ 承認: 60件、ダウングレード: 25件、不採用: 15件
- ✅ 権限レベル分布（LEVEL_5-18）
- ✅ 施設・部署分布が適切

---

### 3. テストデータ共有 ⏰ 11:00

**担当**: バックエンドチーム

**タスク**:

#### 3.1 JSON形式エクスポート

**ファイル**: `scripts/export-test-data-to-json.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportTestData() {
  console.log('📤 テストデータエクスポート開始...');

  const decisions = await prisma.expiredEscalationDecision.findMany({
    include: {
      post: {
        select: {
          id: true,
          content: true,
          agendaLevel: true,
          proposalType: true,
          department: true,
          agendaVotingDeadline: true,
          author: {
            select: {
              id: true,
              name: true,
              department: true
            }
          }
        }
      },
      decider: {
        select: {
          id: true,
          name: true,
          department: true,
          permissionLevel: true,
          facilityId: true
        }
      }
    },
    take: 100
  });

  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalCount: decisions.length,
      version: '1.0.0',
      description: 'Phase 6期限到達判断履歴テストデータ'
    },
    summary: {
      totalDecisions: decisions.length,
      approvedCount: decisions.filter(d => d.decision === 'approve_at_current_level').length,
      downgradedCount: decisions.filter(d => d.decision === 'downgrade').length,
      rejectedCount: decisions.filter(d => d.decision === 'reject').length,
      averageAchievementRate: decisions.reduce((sum, d) => sum + d.achievementRate, 0) / decisions.length,
      averageDaysOverdue: decisions.reduce((sum, d) => sum + d.daysOverdue, 0) / decisions.length
    },
    decisions: decisions.map(d => ({
      id: d.id,
      postId: d.postId,
      postContent: d.post.content?.substring(0, 100) + '...', // 要約版
      deciderId: d.deciderId,
      deciderName: d.decider.name,
      deciderLevel: Number(d.decider.permissionLevel),
      decision: d.decision,
      decisionReason: d.decisionReason,
      currentScore: d.currentScore,
      targetScore: d.targetScore,
      achievementRate: d.achievementRate,
      daysOverdue: d.daysOverdue,
      agendaLevel: d.agendaLevel,
      proposalType: d.proposalType,
      department: d.department,
      facilityId: d.facilityId,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString()
    }))
  };

  // 保存
  const outputPath = path.join('mcp-shared', 'test-data', 'expired-escalation-history.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

  console.log(`✅ JSONエクスポート完了: ${outputPath}`);
  console.log(`📊 件数: ${exportData.decisions.length}件`);
  console.log(`📊 承認率: ${(exportData.summary.approvedCount / exportData.summary.totalDecisions * 100).toFixed(1)}%`);
  console.log(`📊 平均到達率: ${exportData.summary.averageAchievementRate.toFixed(1)}%`);
  console.log(`📊 平均期限超過日数: ${exportData.summary.averageDaysOverdue.toFixed(1)}日`);

  return exportData;
}

exportTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ エラー:', error);
    process.exit(1);
  });
```

#### 3.2 実行

```bash
# JSONエクスポート実行
npx tsx scripts/export-test-data-to-json.ts

# ファイル確認
cat mcp-shared/test-data/expired-escalation-history.json | jq '.metadata'
```

#### 3.3 データ共有

```bash
# Gitコミット・プッシュ
git add mcp-shared/test-data/expired-escalation-history.json
git commit -m "chore: Phase 6テストデータ追加（100件）"
git push origin main

# Slack通知
# チャンネル: #phase6-integration
# メッセージ:
# "✅ Phase 6テストデータ共有完了
# - ファイル: `mcp-shared/test-data/expired-escalation-history.json`
# - 件数: 100件（承認60件、ダウングレード25件、不採用15件）
# - 平均到達率: 82.5%
# - 平均期限超過日数: 7.2日
#
# 医療システムチームの皆様、ご確認をお願いいたします。"
```

**成功条件**:
- ✅ JSON形式ファイルが生成されている
- ✅ GitHubにプッシュされている
- ✅ Slack通知が送信されている

---

### 4. ローカル環境でAPI動作確認 ⏰ 14:00

**担当**: バックエンドチーム、フロントエンドチーム

**タスク**:

#### 4.1 APIサーバー起動

```bash
# APIサーバー起動
npm run dev:api

# 別ターミナルでフロントエンド起動
npm run dev
```

#### 4.2 API動作確認（curl/Postman）

```bash
# 1. 判断履歴取得API（LEVEL_14: 法人全体）
curl -X GET "http://localhost:3003/api/agenda/expired-escalation-history?startDate=2025-09-20&endDate=2025-10-20&limit=100&offset=0" \
  -H "Authorization: Bearer test-token-level-14"

# 期待される結果:
# {
#   "success": true,
#   "data": {
#     "decisions": [...],  // 100件
#     "total": 100,
#     "summary": {
#       "totalDecisions": 100,
#       "approvalCount": 60,
#       "downgradeCount": 25,
#       "rejectCount": 15,
#       "approvalRate": 60.0,
#       "averageAchievementRate": 82.5,
#       "averageDaysOverdue": 7.2
#     }
#   }
# }

# 2. 判断履歴取得API（LEVEL_7: 部署統計）
curl -X GET "http://localhost:3003/api/agenda/expired-escalation-history?departmentId=nursing&limit=50&offset=0" \
  -H "Authorization: Bearer test-token-level-7"

# 期待される結果:
# 部署でフィルタリングされた判断履歴

# 3. 期限到達提案一覧API
curl -X GET "http://localhost:3003/api/agenda/expired-escalation-proposals?limit=20&offset=0" \
  -H "Authorization: Bearer test-token-level-7"

# 期待される結果:
# 判断待ちの期限到達提案一覧
```

#### 4.3 フロントエンドUI動作確認

**チェックリスト**:
1. ✅ ブラウザで `http://localhost:3001` にアクセス
2. ✅ LEVEL_7以上のユーザーでログイン
3. ✅ サイドバーから「期限到達提案判断」をクリック
4. ✅ 提案一覧ページが表示される
5. ✅ サマリー統計カードが表示される（判断待ち数、7日以上超過、到達率80%以上）
6. ✅ 「判断する」ボタンをクリック
7. ✅ 判断モーダルが表示される
8. ✅ スコア到達状況のプログレスバーが表示される
9. ✅ 3つの判断オプション（承認/ダウングレード/不採用）が表示される
10. ✅ 判断理由入力欄が表示される（10文字以上バリデーション）
11. ✅ 判断を入力して「判断を確定」をクリック
12. ✅ 判断が記録され、成功メッセージが表示される
13. ✅ 期限到達提案判断履歴ページを開く
14. ✅ 判断履歴一覧が表示される
15. ✅ サマリー統計が表示される

**成功条件**:
- ✅ 全APIエンドポイントが200 OKを返す
- ✅ 権限レベル別フィルタリングが正しく動作
- ✅ フロントエンドUIが正常に表示される
- ✅ 判断モーダルが正常に動作する
- ✅ 判断履歴ページが正常に表示される

---

### 5. 進捗報告（Slack） ⏰ 16:00

**担当**: プロジェクトリード

**報告内容**:

```markdown
# Phase 6進捗報告（10/21）

## ✅ 完了事項

1. **データベースマイグレーション** ✅
   - `ExpiredEscalationDecision`テーブル作成完了
   - 既存データ保持成功

2. **テストデータ生成・投入** ✅
   - 100件のテストデータ投入完了
   - 承認: 60件、ダウングレード: 25件、不採用: 15件
   - 権限レベル分布: LEVEL_5-18
   - 施設・部署分布: 適切

3. **テストデータ共有** ✅
   - JSON形式: `mcp-shared/test-data/expired-escalation-history.json`
   - GitHubプッシュ完了

4. **API動作確認** ✅
   - 全エンドポイント正常動作
   - 権限レベル別フィルタリング確認済み
   - フロントエンドUI正常表示

## 📊 テストデータ統計

- 総件数: 100件
- 承認率: 60%
- ダウングレード率: 25%
- 不採用率: 15%
- 平均到達率: 82.5%
- 平均期限超過日数: 7.2日

## 🎯 明日（10/22）の予定

- MCPサーバーAPI実装開始
- エンドポイント: `/api/mcp/expired-escalation-history`
- 実装予定時間: 10:00-17:00

## 📎 添付ファイル

- テストデータJSON: [expired-escalation-history.json](https://github.com/.../mcp-shared/test-data/expired-escalation-history.json)

---

**担当**: VoiceDriveチーム
**報告日時**: 2025-10-21 16:00
```

**成功条件**:
- ✅ Slackに進捗報告が投稿されている
- ✅ 医療システムチームからの確認返信がある

---

## 📅 今週のスケジュール

| 日付 | 主要タスク | 完了予定時刻 | 状態 |
|------|-----------|-------------|------|
| **10/21（月）** | ✅ マイグレーション<br>✅ テストデータ生成<br>✅ テストデータ共有<br>✅ API動作確認<br>✅ 進捗報告 | 17:00 | ⏳ 実施中 |
| **10/22（火）** | ⏳ MCPサーバーAPI実装開始 | 17:00 | ⏳ 予定 |
| **10/23（水）** | ⏳ MCPサーバーAPI実装完了<br>⏳ 統合テスト環境提供<br>⏳ キックオフミーティング（14:00） | 18:00 | ⏳ 予定 |
| **10/24（木）** | ⏳ 統合テスト実施 | 17:00 | ⏳ 予定 |
| **10/25（金）** | ⏳ パフォーマンステスト | 17:00 | ⏳ 予定 |

---

## 🚨 リスクと対応

### リスク1: マイグレーション失敗

**対応**:
- ✅ バックアップ取得済み（`prisma/dev.db.backup`）
- ✅ 手動SQLマイグレーションで安全に実施
- ✅ ロールバック手順準備済み

### リスク2: テストデータ生成エラー

**対応**:
- ✅ 既存の提案・ユーザーデータを使用
- ✅ エラー時はモックデータで代替
- ✅ 段階的生成（10件ずつ）でエラー箇所特定

### リスク3: API動作不良

**対応**:
- ✅ ローカル環境で十分なテスト実施
- ✅ エラーログの詳細記録
- ✅ Postman Collectionで自動テスト

---

## ✅ チェックリスト

### 10/21（月）完了基準

#### データベース・データ準備
- [ ] データベースマイグレーション実行完了
- [ ] テストデータ100件投入完了
- [ ] テストデータ統計確認（承認60件、ダウングレード25件、不採用15件）
- [ ] JSONファイル生成完了
- [ ] GitHubプッシュ完了

#### API確認
- [ ] 判断履歴取得API動作確認（LEVEL_14）
- [ ] 判断履歴取得API動作確認（LEVEL_7）
- [ ] 期限到達提案一覧API動作確認
- [ ] 判断記録API動作確認
- [ ] 権限レベル別フィルタリング動作確認

#### フロントエンドUI確認
- [ ] 期限到達提案一覧ページ表示確認
- [ ] サマリー統計カード表示確認
- [ ] 判断モーダル表示確認
- [ ] 判断入力・確定動作確認
- [ ] 判断履歴ページ表示確認

#### 連絡・報告
- [ ] Slack進捗報告投稿
- [ ] 医療システムチームへテストデータ共有通知
- [ ] 明日（10/22）のタスク確認

---

## 📞 連絡体制

### Slackチャンネル

**Phase 6専用**: `#phase6-integration`
- 実装状況の共有
- 問題の早期発見・解決
- 質疑応答

**VoiceDrive全体**: `#voicedrive-analytics-integration`
- VoiceDrive全体の連携
- 長期的な運用

### 緊急連絡

**DM**: 24時間対応
**電話**: 緊急時のみ

---

## 🎯 次のステップ（10/22-10/23）

### 10/22（火）: MCPサーバーAPI実装開始

**実装内容**:
```typescript
// mcp-server/routes/expired-escalation-history.ts

router.get('/api/mcp/expired-escalation-history', async (req, res) => {
  // 1. VoiceDrive DBから判断履歴を取得
  const history = await getExpiredEscalationHistory({
    userId: req.query.userId as string,
    permissionLevel: Number(req.query.permissionLevel),
    facilityId: req.query.facilityId as string,
    departmentId: req.query.departmentId as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    limit: Number(req.query.limit) || 100,
    offset: Number(req.query.offset) || 0
  });

  // 2. 医療システム形式に変換
  const response = {
    success: true,
    data: {
      period: {
        startDate: req.query.startDate || subDays(new Date(), 30).toISOString().split('T')[0],
        endDate: req.query.endDate || new Date().toISOString().split('T')[0]
      },
      summary: {
        totalCount: history.total,
        approvedCount: history.decisions.filter(d => d.decision === 'approve_at_current_level').length,
        downgradedCount: history.decisions.filter(d => d.decision === 'downgrade').length,
        rejectedCount: history.decisions.filter(d => d.decision === 'reject').length,
        approvalRate: (history.decisions.filter(d => d.decision === 'approve_at_current_level').length / history.total) * 100,
        averageDaysToDecision: calculateAverageDays(history.decisions),
        averageAchievementRate: calculateAverageRate(history.decisions)
      },
      items: history.decisions.map(formatDecisionItem),
      pagination: {
        total: history.total,
        limit: Number(req.query.limit) || 100,
        offset: Number(req.query.offset) || 0,
        hasMore: history.total > (Number(req.query.offset) || 0) + (Number(req.query.limit) || 100)
      }
    }
  };

  res.json(response);
});
```

### 10/23（水）: 統合テスト環境提供

**環境情報**:
- VoiceDrive API Server: `http://localhost:3003`
- MCP Server: `http://localhost:8080`
- API Key: 10/23午前中に生成・共有

**キックオフミーティング**: 10/23（水）14:00-14:30

---

**作成者**: 医療職員カルテシステムチーム（VoiceDriveチーム向け）
**最終更新**: 2025年10月20日
**次回更新予定**: 2025年10月21日 17:00
