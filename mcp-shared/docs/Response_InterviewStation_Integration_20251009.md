# InterviewStation統合要件に対する医療システムチームからの回答

**文書番号**: MS-RESPONSE-INTERVIEWSTATION-2025-1009-001
**作成日**: 2025年10月9日
**差出人**: 医療システムチーム
**宛先**: VoiceDriveチーム
**件名**: InterviewStation暫定マスターリストに対する回答

---

## 📋 受領文書の確認

以下のVoiceDriveチームからの文書を受領し、確認いたしました：

| 文書番号 | 文書名 | 受領日 | 確認状況 |
|---------|--------|--------|---------|
| IS-MASTER-2025-1009-001 | InterviewStation暫定マスターリスト | 2025-10-09 | ✅ 確認完了 |
| 未記載 | InterviewStation_DB要件分析_20251009.md | 2025-10-09 | ✅ 確認完了 |
| 未記載 | データ管理責任分界点定義書_20251008.md | 2025-10-08 | ✅ 確認完了 |

---

## ✅ 質問・確認事項に対する回答

### 確認-1: AI調整機能（おまかせ予約）について

#### Q1-1: NotebookLM APIは既に利用可能ですか？

**回答**: ✅ **利用可能です（Phase 1.5で統合済み）**

**詳細**:
- Phase 1.5でLLMコンテンツモデレーション統合が完了済み
- 使用モデル: Llama 3.2:3b（Ollamaベース）
- エンドポイント: `http://localhost:11434/api/generate`
- 面談分析・サマリ生成に同じインフラを活用可能

**おまかせ予約への適用方針**:
```typescript
// AI調整のプロンプト例
const prompt = `
以下の面談リクエストに最適な面談者を3名選定してください：

【リクエスト内容】
- 職員ID: ${staffId}
- 相談内容: ${topic}
- 希望日時: ${preferredDates.join(', ')}
- 緊急度: ${urgencyLevel}

【利用可能な面談者リスト】
${JSON.stringify(availableInterviewers)}

【選定基準】
1. 専門分野の適合度
2. 時間的な都合
3. 過去の面談実績

各候補について、職員向けの分かりやすい推薦理由を生成してください。
`;
```

**実装コストへの影響**: なし（既存インフラ活用）

---

#### Q1-2: 面談者マスタ（Interviewer）テーブルは実装済みですか？

**回答**: ⚠️ **未実装です（Phase 11で新規実装が必要）**

**現状**:
- 面談者情報は`User`テーブルに含まれています
- 専用の`Interviewer`テーブルは存在しません

**提案される実装**:
```typescript
// 新規テーブル: Interviewer
model Interviewer {
  id                    String    @id @default(cuid())
  userId                String    @unique
  specialties           String[]  // ['career_development', 'mental_health', 'skill_training']
  availableTimeSlots    Json      // { "Monday": ["09:00-12:00", "14:00-17:00"], ... }
  maxDailyInterviews    Int       @default(3)
  preferredDuration     Int       @default(60) // minutes
  interviewRooms        String[]  // ['人事部 面談室A', '人事部 面談室B']
  experience            String?   // 'キャリア相談10年の経験'
  bio                   String?   // 職員向け紹介文
  isActive              Boolean   @default(true)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // リレーション
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  interviews            Interview[]

  @@index([userId])
  @@index([isActive])
  @@map("interviewers")
}
```

**実装コスト**: 2人日（¥80,000）
**実装タイミング**: Phase 11 Week 1（11月18日～19日）

---

#### Q1-3: AI調整のマッチングロジックは医療システム側で実装可能ですか？

**回答**: ✅ **実装可能です**

**実装方針**:
```typescript
class AssistedBookingService {
  async generateProposals(request: AssistedBookingRequest): Promise<ProposalPattern[]> {
    // 1. 利用可能な面談者を検索
    const availableInterviewers = await this.findAvailableInterviewers({
      specialties: request.category,
      dates: request.preferredDates,
      timePreference: request.timePreference
    });

    // 2. LLMでマッチングスコア算出
    const scoredInterviewers = await this.scoreInterviewers(
      request,
      availableInterviewers
    );

    // 3. 上位3名を選定
    const top3 = scoredInterviewers.slice(0, 3);

    // 4. 各候補について詳細な提案パターンを生成
    const proposals = await Promise.all(
      top3.map(interviewer => this.createProposalPattern(interviewer, request))
    );

    return proposals;
  }

  async scoreInterviewers(
    request: AssistedBookingRequest,
    interviewers: Interviewer[]
  ): Promise<ScoredInterviewer[]> {
    // LLM API呼び出し
    const prompt = this.buildScoringPrompt(request, interviewers);
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt,
        stream: false
      })
    });

    // スコアリング結果をパース
    const scores = this.parseScores(response);
    return this.sortByScore(interviewers, scores);
  }

  async createProposalPattern(
    interviewer: Interviewer,
    request: AssistedBookingRequest
  ): Promise<ProposalPattern> {
    // staffFriendlyDisplay生成（職員向けの分かりやすい説明）
    const staffFriendlyDisplay = await this.generateStaffFriendlyText(
      interviewer,
      request
    );

    return {
      id: `PROP-${Date.now()}-${interviewer.id}`,
      interviewer: {
        id: interviewer.id,
        name: interviewer.user.name,
        title: interviewer.user.position,
        department: interviewer.user.department,
        experience: interviewer.experience
      },
      schedule: this.findBestTimeSlot(interviewer, request),
      staffFriendlyDisplay,
      aiReasoning: {
        matchingScore: 0.95,
        matchingFactors: ['専門分野一致', '時間帯適合', '経験豊富'],
        alternativeOptions: this.getAlternativeTimeSlots(interviewer, request),
        notes: 'LLMによる推薦理由'
      }
    };
  }

  async generateStaffFriendlyText(
    interviewer: Interviewer,
    request: AssistedBookingRequest
  ): Promise<StaffFriendlyDisplay> {
    // LLM API呼び出しで職員向けの自然な日本語を生成
    const prompt = `
以下の面談者を職員に推薦する文章を、親しみやすく分かりやすい日本語で生成してください：

【面談者情報】
- 名前: ${interviewer.user.name}
- 専門分野: ${interviewer.specialties.join(', ')}
- 経験: ${interviewer.experience}

【職員の相談内容】
- ${request.topic}

【条件】
- 技術用語を使わない
- 親しみやすい口調
- 3つのハイライトポイントを生成
`;

    const response = await this.callLLM(prompt);

    return {
      summary: response.summary,
      highlights: response.highlights
    };
  }
}
```

**実装コスト**: 5人日（¥200,000）
**実装タイミング**: Phase 11 Week 1（11月18日～22日）

---

#### Q1-4: 3つの提案パターン生成の所要時間はどのくらいを想定していますか？

**回答**: ✅ **30秒～1分程度**

**処理時間の内訳**:
| ステップ | 所要時間 | 備考 |
|---------|---------|------|
| 利用可能な面談者検索 | 5秒 | DB検索（インデックス使用） |
| LLMスコアリング | 15秒 | Llama 3.2:3b（CPU推論） |
| 提案パターン生成（3件） | 10秒 | 各候補のstaffFriendlyText生成 |
| **合計** | **30秒** | |

**長時間処理の場合の対策**:
- VoiceDrive側にステータス: `pending_review` → `ai_processing` → `proposals_ready` の段階的更新
- Webhook-INT-3でリアルタイム進捗通知
- 「AI調整中…」のローディング表示

**実装への影響**: なし（想定範囲内）

---

### 確認-2: 面談サマリ配信について

#### Q2-1: NotebookLMでの面談分析は自動実行されますか？

**回答**: ⚠️ **半自動です（面談実施記録の入力後、手動トリガー）**

**現状の面談フロー**:
1. 面談実施（面談者が実施）
2. 面談記録入力（面談者が手動入力）
   - 面談内容のメモ
   - 職員の発言要点
   - 観察事項
3. **AI分析トリガー**（面談者がボタンクリック）
   - 「AIサマリを生成」ボタン
4. NotebookLM API呼び出し
5. サマリ生成完了
6. VoiceDriveへWebhook送信（自動）

**完全自動化への移行（Phase 11.5で検討）**:
```typescript
// 面談記録保存時に自動トリガー
async saveInterviewRecord(interviewId: string, record: InterviewRecord) {
  // 1. 記録を保存
  await prisma.interview.update({
    where: { id: interviewId },
    data: {
      record,
      status: 'completed',
      completedAt: new Date()
    }
  });

  // 2. AI分析を自動実行（バックグラウンド）
  await this.queueAiAnalysis(interviewId);

  // 3. 分析完了後、Webhook送信
  // （約2分後にバックグラウンドジョブで実行）
}
```

**Phase 11の方針**: 半自動（手動トリガー）でスタート
**Phase 11.5の検討事項**: 完全自動化への移行

---

#### Q2-2: サマリ生成後、VoiceDriveへのWebhook送信は自動ですか？手動ですか？

**回答**: ✅ **自動です**

**実装方針**:
```typescript
async generateInterviewSummary(interviewId: string) {
  // 1. LLM API呼び出し
  const summary = await this.callNotebookLM(interviewId);

  // 2. サマリをDBに保存
  await prisma.interviewResult.create({
    data: {
      interviewId,
      summary: summary.text,
      keyPoints: summary.keyPoints,
      actionItems: summary.actionItems,
      feedbackToEmployee: summary.feedbackToEmployee,
      generatedAt: new Date()
    }
  });

  // 3. VoiceDriveへWebhook送信（自動）
  await this.sendWebhook('interview.result_ready', {
    interviewId,
    ...summary
  });

  console.log(`✅ サマリ生成完了 & Webhook送信: ${interviewId}`);
}
```

**Webhook送信のリトライポリシー**:
- 失敗時: 3回リトライ（1分、5分、15分後）
- 最終失敗時: エラーログに記録、管理者に通知

**実装コスト**: 3人日（¥120,000）（Webhook-INT-2の見積もりに含まれています）

---

#### Q2-3: `feedbackToEmployee`（職員向けフィードバック）の生成ロジックは？

**回答**: ✅ **LLM APIで自動生成します**

**生成ロジック**:
```typescript
async generateFeedbackToEmployee(
  interviewRecord: InterviewRecord,
  summary: InterviewSummary
): Promise<string> {
  const prompt = `
以下の面談内容から、職員に対する前向きで建設的なフィードバックを生成してください：

【面談サマリ】
${summary.text}

【重要ポイント】
${summary.keyPoints.join('\n')}

【条件】
1. 職員を励ます前向きなトーン
2. 具体的な成長ポイントを指摘
3. 次のステップを明確に示す
4. 150文字以内

【出力例】
「あなたの将来へのビジョンが明確で、素晴らしいと感じました。次回の面談では、実際の研修プログラムの進捗を確認しましょう。」
`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama3.2:3b',
      prompt,
      stream: false
    })
  });

  const data = await response.json();
  return data.response.trim();
}
```

**品質担保**:
- 生成後、面談者が最終確認・編集可能
- 不適切な表現がある場合は手動修正
- 将来的には: LLMモデレーション機能で自動チェック

**実装コスト**: Webhook-INT-2の見積もりに含まれています

---

### 確認-3: リアルタイム通知について

#### Q3-1: WebSocket / Server-Sent Events のどちらを使用しますか？

**回答**: ✅ **Server-Sent Events (SSE) を推奨します**

**理由**:
| 項目 | WebSocket | Server-Sent Events | 選定理由 |
|------|-----------|-------------------|---------|
| **双方向通信** | ✅ 必要 | ❌ 不要（サーバー→クライアントのみ） | 面談予約通知は一方向で十分 |
| **実装の複雑さ** | 🟡 中（接続管理が複雑） | 🟢 低（HTTP/2ベース） | SSEの方がシンプル |
| **リトライ機能** | ❌ 手動実装 | ✅ 自動リトライ | SSEはブラウザが自動リトライ |
| **HTTP/2対応** | ❌ 別プロトコル | ✅ HTTP/2上で動作 | 既存インフラとの親和性 |
| **認証** | 🟡 複雑 | 🟢 JWT Bearerで簡単 | SSEはHTTPヘッダで認証可能 |

**実装方針**:
```typescript
// 医療システム側（SSEエンドポイント）
app.get('/api/sse/notifications/:staffId', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const staffId = req.params.staffId;

  // SSE接続を管理
  const connectionId = this.addSSEConnection(staffId, res);

  req.on('close', () => {
    this.removeSSEConnection(connectionId);
  });
});

// 通知送信
async sendNotification(staffId: string, event: NotificationEvent) {
  const connections = this.getSSEConnections(staffId);
  connections.forEach(res => {
    res.write(`event: ${event.type}\n`);
    res.write(`data: ${JSON.stringify(event.data)}\n\n`);
  });
}
```

**VoiceDrive側（SSEクライアント）**:
```typescript
const eventSource = new EventSource(
  `https://api.medical-system.example.com/api/sse/notifications/${staffId}`,
  { headers: { Authorization: `Bearer ${jwtToken}` } }
);

eventSource.addEventListener('assistedBookingUpdate', (e) => {
  const data = JSON.parse(e.data);
  // リアルタイム通知を表示
});

eventSource.addEventListener('proposalReady', (e) => {
  const data = JSON.parse(e.data);
  // 「提案候補を見る」ボタンを表示
});
```

**実装コスト**: 2人日（¥80,000）（Webhook-INT-3の見積もりに含まれています）

---

#### Q3-2: 通知基盤は医療システム側に既にありますか？

**回答**: ⚠️ **未実装です（Phase 11で新規実装が必要）**

**現状**:
- リアルタイム通知機能は未実装
- Phase 3でWebhook送信機能は実装済み（ComposeForm統合）

**新規実装が必要な機能**:
```typescript
class NotificationService {
  private sseConnections = new Map<string, Set<Response>>();

  // SSE接続管理
  addSSEConnection(staffId: string, res: Response): string {
    const connectionId = `conn_${Date.now()}_${Math.random()}`;
    if (!this.sseConnections.has(staffId)) {
      this.sseConnections.set(staffId, new Set());
    }
    this.sseConnections.get(staffId)!.add(res);
    return connectionId;
  }

  removeSSEConnection(staffId: string, res: Response) {
    this.sseConnections.get(staffId)?.delete(res);
  }

  // 通知送信
  async sendNotification(staffId: string, event: NotificationEvent) {
    const connections = this.sseConnections.get(staffId) || new Set();
    connections.forEach(res => {
      res.write(`event: ${event.type}\n`);
      res.write(`data: ${JSON.stringify(event.data)}\n\n`);
    });
  }

  // おまかせ予約進捗通知
  async notifyAssistedBookingUpdate(
    staffId: string,
    requestId: string,
    oldStatus: string,
    newStatus: string
  ) {
    // 1. SSE経由でリアルタイム通知
    await this.sendNotification(staffId, {
      type: 'assistedBookingUpdate',
      data: { requestId, oldStatus, newStatus }
    });

    // 2. VoiceDriveへWebhook送信
    await this.sendWebhook('assisted_booking.status_changed', {
      requestId,
      staffId,
      oldStatus,
      newStatus,
      message: this.getStatusMessage(newStatus)
    });
  }
}
```

**実装コスト**: 2人日（¥80,000）
**実装タイミング**: Phase 11 Week 2（11月25日～26日）

---

### 確認-4: 実装スケジュールについて

#### Q4-1: Phase 1（11/18-11/26）のスケジュールは実現可能ですか？

**回答**: ⚠️ **タイトですが実現可能です（条件付き）**

**前提条件**:
1. ✅ **Week 1（11/18-11/22）に集中リソース確保**
   - 医療システムチーム: 3名フルタイム
   - VoiceDriveチーム: 2名フルタイム

2. ✅ **Phase 11実装準備作業を11月11日～15日に前倒し**
   - Interviewerテーブル設計完了
   - NotebookLM統合の詳細仕様確認
   - SSE実装の技術検証

3. ✅ **Phase 10（HRAnnouncements）との並行実施を避ける**
   - Phase 10: 2026年1月6日～3月27日
   - Phase 11: 2025年11月18日～26日
   - 重複なし、リソース競合なし

**リスク管理**:
| リスク | 影響度 | 対策 | ステータス |
|--------|--------|------|---------|
| AI調整ロジックの複雑さ | 🔴 HIGH | Week 1に5日確保、技術検証を11/15までに完了 | ✅ 対策済み |
| NotebookLM API不具合 | 🟡 MEDIUM | フォールバック: 手動サマリ生成 | ✅ 対策済み |
| SSE実装の遅延 | 🟡 MEDIUM | WebSocketへの切り替え可能 | ✅ 対策済み |
| リソース不足 | 🔴 HIGH | Phase 10との並行実施を避ける | ✅ 対策済み |

**調整後のスケジュール**:
| 期間 | タスク | 担当 | 工数 |
|------|--------|------|------|
| **11/11-11/15（準備期間）** | | | |
| 11/11-11/12 | Interviewerテーブル設計 | 医療システム | 2日 |
| 11/13-11/15 | SSE技術検証 | 医療システム | 2日 |
| 11/13-11/15 | VoiceDrive DB設計 | VoiceDrive | 2日 |
| **11/18-11/22（Week 1）** | | | |
| 11/18-11/20 | API-INT-1実装 | 医療システム | 3日 |
| 11/18-11/22 | API-INT-2実装（AI調整ロジック） | 医療システム | 5日 |
| 11/18-11/22 | Webhook-INT-1実装 | 医療システム | 2日 |
| 11/18-11/20 | Interview拡張 | VoiceDrive | 2日 |
| 11/21-11/22 | AssistedBookingRequest実装 | VoiceDrive | 2日 |
| **11/25-11/26（Week 2）** | | | |
| 11/25 | API-INT-3実装 | 医療システム | 1日 |
| 11/25-11/26 | API-INT-4実装 | 医療システム | 2日 |
| 11/25-11/26 | API-INT-5実装 | 医療システム | 2日 |
| 11/25-11/26 | API-INT-6実装 | 医療システム | 1日 |
| 11/25-11/26 | API-INT-7実装 | 医療システム | 2日 |
| 11/25-11/26 | Webhook-INT-2実装 | 医療システム | 3日 |
| 11/25-11/26 | Webhook-INT-3実装 | 医療システム | 2日 |
| 11/25-11/26 | VoiceDrive UI実装 | VoiceDrive | 4日 |

**結論**: ✅ **実現可能（準備期間の前倒しが条件）**

---

#### Q4-2: リソース確保は問題ありませんか？

**回答**: ✅ **問題ありません**

**医療システムチーム**:
- メンバー: 3名フルタイム
- 期間: 11月11日～26日（16日間）
- スキルセット: TypeScript、Prisma ORM、LLM API統合、SSE実装

**VoiceDriveチーム**:
- メンバー: 2名フルタイム
- 期間: 11月13日～26日（14日間）
- スキルセット: React、Prisma ORM、Webhook受信、リアルタイム通知

**他プロジェクトとの調整**:
- Phase 10（HRAnnouncements）: 2026年1月開始（重複なし）
- Phase 8.5（TeamLeaderDashboard）: 11月18日～26日（**同時期**）

**Phase 8.5との調整**:
- Phase 8.5は**VoiceDrive側のみの作業**（医療システム側は追加実装ゼロ）
- 医療システムチームはPhase 11（InterviewStation）に集中可能
- VoiceDriveチームは2つのPhaseを並行実施（リソース追加が必要）

**VoiceDriveチームへの確認事項**:
- ❓ Phase 8.5とPhase 11を並行実施できますか？
- ❓ リソース追加（+1名）は可能ですか？

---

#### Q4-3: 優先順位の調整が必要なAPIはありますか？

**回答**: ✅ **以下の優先順位で実装します**

**最優先（Phase 11 Week 1）**:
1. ✅ **API-INT-1**: 面談予約受付（3日） - 即時予約の基本機能
2. ✅ **API-INT-2**: おまかせ予約申込受付（5日） - 最も複雑だが重要
3. ✅ **Webhook-INT-1**: 面談予約確定通知（2日） - 予約確定の通知

**高優先（Phase 11 Week 2前半）**:
4. ✅ **API-INT-3**: 調整中リクエスト取得（1日）
5. ✅ **API-INT-4**: 提案候補取得（2日）
6. ✅ **API-INT-5**: 提案候補選択確定（2日）

**中優先（Phase 11 Week 2後半）**:
7. ✅ **API-INT-7**: 面談履歴取得（2日）
8. ✅ **Webhook-INT-2**: 面談サマリ配信（3日）
9. ✅ **Webhook-INT-3**: おまかせ予約進捗通知（2日）

**低優先（Phase 11 Week 2またはPhase 11.5）**:
10. 🟡 **API-INT-6**: おまかせ予約キャンセル（1日） - Nice to have

**Phase 11.5に延期可能**:
- ✅ **API-INT-8**: 雇用状況取得（Phase 11.5: 12月2日～）
- ✅ **API-INT-9**: 面談タイプマスタ取得（Phase 11.5: 12月2日～）
- ✅ **InterviewReminder実装**（Phase 11.5: 12月2日～10日）

**結論**: API-INT-6とPhase 2全体をPhase 11.5に延期することで、Phase 11のスケジュールに余裕を持たせます。

---

### 確認-5: コストについて

#### Q5-1: 見積コスト（¥2,080,000 / 26日）は承認可能ですか？

**回答**: ✅ **承認可能です（Phase 11のみ、Phase 11.5は別途承認）**

**Phase 11の実装コスト**:
| 項目 | 工数 | 単価 | コスト |
|------|------|------|--------|
| **医療システム側** | | | |
| Interviewerテーブル実装 | 2日 | ¥40,000 | ¥80,000 |
| API-INT-1～INT-7実装 | 18日 | ¥40,000 | ¥720,000 |
| Webhook-INT-1～INT-3実装 | 7日 | ¥40,000 | ¥280,000 |
| SSE実装 | 2日 | ¥40,000 | ¥80,000 |
| テスト・統合テスト | 2日 | ¥40,000 | ¥80,000 |
| **小計** | **31日** | | **¥1,240,000** |
| **VoiceDrive側** | | | |
| DB拡張（4テーブル） | 4日 | 自社リソース | ¥0 |
| UI実装 | 4日 | 自社リソース | ¥0 |
| **小計** | **8日** | | **¥0** |
| **合計** | **39日** | | **¥1,240,000** |

**Phase 11.5の実装コスト**:
| 項目 | 工数 | 単価 | コスト |
|------|------|------|--------|
| API-INT-8、API-INT-9実装 | 3日 | ¥40,000 | ¥120,000 |
| InterviewReminder実装 | 5日 | 自社リソース | ¥0 |
| **合計** | **8日** | | **¥120,000** |

**総計**: ¥1,360,000（Phase 11 + Phase 11.5）

**元の見積もりとの差異**:
- VoiceDriveチームの見積もり: ¥2,080,000（26日 × ¥80,000）
- 医療システムチームの見積もり: ¥1,360,000（39日 × ¥40,000）
- 差額: **¥720,000削減**

**差額の理由**:
- VoiceDrive側の工数を自社リソースで対応（外注費ゼロ）
- 医療システム側の単価を¥40,000/日と設定（VoiceDrive見積もりは¥80,000/日）

**承認判定**: ✅ **Phase 11: ¥1,240,000を承認**

---

#### Q5-2: Phase 2（リマインダー機能）は後回しにできますか？

**回答**: ✅ **後回し可能です（Phase 11.5として実施）**

**Phase 11.5の実施時期**: 2025年12月2日～10日（9日間）

**Phase 11.5の内容**:
- API-INT-8: 雇用状況取得
- API-INT-9: 面談タイプマスタ取得
- InterviewReminder実装（VoiceDrive側）
- リマインダー計算ロジック（VoiceDrive側）

**Phase 11とPhase 11.5の分離メリット**:
1. Phase 11のスケジュールに余裕ができる
2. Phase 11の成果物を早期にリリース可能（11月26日）
3. Phase 11.5はリマインダー機能のみに集中できる

**結論**: ✅ **Phase 11.5として12月2日～10日に実施します**

---

## 📊 実装スコープの整理

### Phase 11（2025年11月18日～26日）: InterviewStation基本機能

#### 医療システム側実装（31日、¥1,240,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| Interviewerテーブル実装 | 2日 | ¥80,000 |
| API-INT-1: 面談予約受付 | 3日 | ¥120,000 |
| API-INT-2: おまかせ予約申込受付 | 5日 | ¥200,000 |
| API-INT-3: 調整中リクエスト取得 | 1日 | ¥40,000 |
| API-INT-4: 提案候補取得 | 2日 | ¥80,000 |
| API-INT-5: 提案候補選択確定 | 2日 | ¥80,000 |
| API-INT-6: おまかせ予約キャンセル | 1日 | ¥40,000 |
| API-INT-7: 面談履歴取得 | 2日 | ¥80,000 |
| Webhook-INT-1: 面談予約確定通知 | 2日 | ¥80,000 |
| Webhook-INT-2: 面談サマリ配信 | 3日 | ¥120,000 |
| Webhook-INT-3: おまかせ予約進捗通知 | 2日 | ¥80,000 |
| SSE実装 | 2日 | ¥80,000 |
| NotificationService実装 | 2日 | ¥80,000 |
| テスト・統合テスト | 2日 | ¥80,000 |
| **小計** | **31日** | **¥1,240,000** |

---

#### VoiceDrive側実装（8日、¥0）

| 項目 | 工数 | コスト |
|------|------|--------|
| Interview拡張 | 2日 | ¥0（自社リソース） |
| AssistedBookingRequest実装 | 2日 | ¥0（自社リソース） |
| ProposalPattern実装 | 1日 | ¥0（自社リソース） |
| InterviewResult実装 | 1日 | ¥0（自社リソース） |
| InterviewStation UI実装 | 4日 | ¥0（自社リソース） |
| Webhook受信処理 | 2日 | ¥0（自社リソース） |
| **小計** | **12日** | **¥0** |

---

### Phase 11.5（2025年12月2日～10日）: リマインダー機能

#### 医療システム側実装（3日、¥120,000）

| 項目 | 工数 | コスト |
|------|------|--------|
| API-INT-8: 雇用状況取得 | 1日 | ¥40,000 |
| API-INT-9: 面談タイプマスタ取得 | 2日 | ¥80,000 |
| **小計** | **3日** | **¥120,000** |

---

#### VoiceDrive側実装（5日、¥0）

| 項目 | 工数 | コスト |
|------|------|--------|
| InterviewReminder実装 | 3日 | ¥0（自社リソース） |
| リマインダー計算ロジック | 2日 | ¥0（自社リソース） |
| **小計** | **5日** | **¥0** |

---

### 総計

| Phase | 期間 | 医療システム | VoiceDrive | 合計工数 | 合計コスト |
|-------|------|-------------|-----------|---------|----------|
| **Phase 11** | 11/18-11/26 | 31日 | 12日 | 43日 | ¥1,240,000 |
| **Phase 11.5** | 12/2-12/10 | 3日 | 5日 | 8日 | ¥120,000 |
| **合計** | | **34日** | **17日** | **51日** | **¥1,360,000** |

---

## 📅 実装スケジュール（詳細版）

### Phase 11準備期間（11月11日～15日）

| 日付 | 医療システム側 | VoiceDrive側 |
|------|---------------|-------------|
| **11/11（月）** | Interviewerテーブル設計 | - |
| **11/12（火）** | Interviewerテーブル設計 | - |
| **11/13（水）** | SSE技術検証 | VoiceDrive DB設計 |
| **11/14（木）** | SSE技術検証 | VoiceDrive DB設計 |
| **11/15（金）** | Phase 11キックオフミーティング | Phase 11キックオフミーティング |

---

### Phase 11 Week 1（11月18日～22日）

| 日付 | 医療システム側 | VoiceDrive側 |
|------|---------------|-------------|
| **11/18（月）** | API-INT-1実装（Day 1/3）<br>API-INT-2実装（Day 1/5） | Interview拡張（Day 1/2） |
| **11/19（火）** | API-INT-1実装（Day 2/3）<br>API-INT-2実装（Day 2/5） | Interview拡張（Day 2/2） |
| **11/20（水）** | API-INT-1実装（Day 3/3）✅<br>API-INT-2実装（Day 3/5）<br>Webhook-INT-1実装（Day 1/2） | AssistedBookingRequest実装（Day 1/2） |
| **11/21（木）** | API-INT-2実装（Day 4/5）<br>Webhook-INT-1実装（Day 2/2）✅ | AssistedBookingRequest実装（Day 2/2）✅ |
| **11/22（金）** | API-INT-2実装（Day 5/5）✅ | ProposalPattern実装 |

---

### Phase 11 Week 2（11月25日～26日）

| 日付 | 医療システム側 | VoiceDrive側 |
|------|---------------|-------------|
| **11/25（月）** | API-INT-3実装✅<br>API-INT-4実装（Day 1/2）<br>API-INT-5実装（Day 1/2）<br>API-INT-6実装✅<br>API-INT-7実装（Day 1/2）<br>Webhook-INT-2実装（Day 1/3）<br>Webhook-INT-3実装（Day 1/2）<br>SSE実装（Day 1/2） | InterviewResult実装<br>InterviewStation UI実装（Day 1/4） |
| **11/26（火）** | API-INT-4実装（Day 2/2）✅<br>API-INT-5実装（Day 2/2）✅<br>API-INT-7実装（Day 2/2）✅<br>Webhook-INT-2実装（Day 2-3/3）✅<br>Webhook-INT-3実装（Day 2/2）✅<br>SSE実装（Day 2/2）✅<br>NotificationService実装（Day 1-2/2）✅<br>統合テスト（Day 1-2/2）✅ | InterviewStation UI実装（Day 2-4/4）✅<br>Webhook受信処理（Day 1-2/2）✅<br>統合テスト |

**Phase 11完了予定**: 2025年11月26日

---

### Phase 11.5（12月2日～10日）

| 週 | 医療システム側 | VoiceDrive側 |
|----|---------------|-------------|
| **Week 1（12/2-12/6）** | API-INT-8実装（1日）<br>API-INT-9実装（2日） | InterviewReminder実装（3日） |
| **Week 2（12/9-12/10）** | テスト（1日） | リマインダー計算ロジック（2日）<br>統合テスト（1日） |

**Phase 11.5完了予定**: 2025年12月10日

---

## ✅ 承認依頼事項

以下の方針について、VoiceDriveチームのご承認をお願いいたします：

### 1. AI調整機能（おまかせ予約）の実装方針
- ✅ **承認依頼**: NotebookLM API（Llama 3.2:3b）を使用したAI調整ロジック実装
- 面談者マスタ（Interviewerテーブル）を新規実装
- 提案パターン生成所要時間: 30秒～1分
- `staffFriendlyDisplay`はLLM APIで自動生成

### 2. 面談サマリ配信の実装方針
- ✅ **承認依頼**: 半自動（面談記録入力後、手動トリガーでAI分析）
- サマリ生成後、VoiceDriveへのWebhook送信は自動
- `feedbackToEmployee`はLLM APIで自動生成（面談者が最終確認・編集可能）

### 3. リアルタイム通知の実装方針
- ✅ **承認依頼**: Server-Sent Events (SSE) を使用
- NotificationServiceを新規実装
- おまかせ予約進捗通知をリアルタイム送信

### 4. 実装スケジュールの調整
- ✅ **承認依頼**: Phase 11準備期間を11月11日～15日に設定
- Phase 11: 11月18日～26日（9日間）
- Phase 11.5: 12月2日～10日（9日間）
- リマインダー機能をPhase 11.5に延期

### 5. コストの調整
- ✅ **承認依頼**: Phase 11コスト: ¥1,240,000（元の見積もり¥2,080,000から¥840,000削減）
- Phase 11.5コスト: ¥120,000
- 総計: ¥1,360,000（元の見積もりから¥720,000削減）

### 6. VoiceDriveチームのリソース確認
- ❓ **確認依頼**: Phase 8.5とPhase 11を並行実施できますか？
- ❓ **確認依頼**: リソース追加（+1名）は可能ですか？

---

## 📝 次のステップ

1. **VoiceDriveチームからの承認**: 本文書の内容をご確認いただき、承認のご連絡をお願いいたします
2. **Phase 11準備開始**: 承認後、11月11日から準備作業を開始
3. **Phase 11実装開始**: 11月18日
4. **Phase 11.5実装開始**: 12月2日（Phase 11完了後）

---

## 🔗 関連ドキュメント

### 作成済みドキュメント
- [InterviewStation暫定マスターリスト_20251009.md](./mcp-shared/docs/InterviewStation暫定マスターリスト_20251009.md)
- [InterviewStation_DB要件分析_20251009.md](./mcp-shared/docs/InterviewStation_DB要件分析_20251009.md)
- [データ管理責任分界点定義書_20251008.md](./mcp-shared/docs/データ管理責任分界点定義書_20251008.md)

### 作成予定ドキュメント
- [ ] Interviewerテーブル設計書（医療システムチーム、11月12日）
- [ ] AssistedBookingService実装仕様書（医療システムチーム、11月20日）
- [ ] NotificationService実装仕様書（医療システムチーム、11月25日）
- [ ] Phase 11統合テスト報告書（InterviewStation）（両チーム、11月26日）

---

**作成者**: 医療システムチーム
**最終更新**: 2025年10月9日
**次回アクション**: VoiceDriveチームからの承認待ち
