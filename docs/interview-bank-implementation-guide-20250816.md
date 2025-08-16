# 面談バンクシステム完全実装 作業書兼指示書
**作成日：2025年8月16日**  
**文書番号：IB-IMPL-20250816**  
**優先度：最重要**

## 📋 概要
本書は、医療職員管理システムにおける面談バンクシステムの完全実装に向けた作業指示書です。既存の面談システムを段階的に面談バンクシステムに移行し、最終的には統一された動的面談生成システムを構築します。

## 🎯 最終目標
- すべての面談タイプ（定期・特別・サポート）を統一されたバンクシステムで管理
- VoiceDrive（法人SNS）との完全連携
- MCP共有フォルダによるデータ同期
- 既存面談システムの完全置換

## 📊 現在の状況
- ✅ 定期面談バンクシステム：実装済み（2025年8月16日）
- ❌ 特別面談バンクシステム：未実装
- ❌ サポート面談バンクシステム：未実装
- ❌ VoiceDrive連携：未実装
- ❌ データ永続化層：未実装

---

## 🔧 実装タスク詳細

### タスク1：定期面談バンクのデータ永続化層実装
**優先度：最高** | **予定工数：8時間**

#### 実装内容
```typescript
// src/lib/interview-bank/repositories/bank-repository.ts
interface InterviewBankRepository {
  // 面談結果の保存
  saveInterviewResult(result: BankInterviewResult): Promise<string>
  
  // 面談履歴の取得
  getInterviewHistory(staffId: string, type?: InterviewType): Promise<BankInterviewResult[]>
  
  // 動機タイプの更新
  updateMotivationType(staffId: string, type: MotivationType): Promise<void>
  
  // 統計データの取得
  getStatistics(criteria: StatsCriteria): Promise<InterviewStatistics>
}
```

#### 実装ファイル
- `src/lib/interview-bank/repositories/bank-repository.ts`
- `src/lib/interview-bank/repositories/local-storage-adapter.ts`（開発用）
- `src/lib/interview-bank/repositories/api-adapter.ts`（本番用）

#### 成功基準
- [ ] 面談結果が永続化される
- [ ] 履歴が正しく取得できる
- [ ] ローカルストレージとAPIの両方に対応

---

### タスク2：職員カルテとの統合（面談履歴表示）
**優先度：高** | **予定工数：6時間**

#### 実装内容
```typescript
// src/app/staff-cards/components/InterviewBankTab.tsx
const InterviewBankTab = ({ staffId }) => {
  const [bankResults, setBankResults] = useState([])
  const [filterType, setFilterType] = useState('all')
  
  // バンクシステムの結果を表示
  return (
    <div>
      <InterviewTypeFilter onChange={setFilterType} />
      <InterviewResultsList results={bankResults} />
      <MotivationTypeDisplay staffId={staffId} />
      <SkillProgressChart staffId={staffId} />
    </div>
  )
}
```

#### 実装ファイル
- `src/app/staff-cards/components/InterviewBankTab.tsx`
- `src/app/staff-cards/staff-tabs.tsx`（InterviewTabの拡張）

#### 成功基準
- [ ] 職員カルテに面談バンク結果が表示される
- [ ] 動機タイプが表示される
- [ ] フィルタリング機能が動作する

---

### タスク3：管理者設定ページ（質問バンク管理）の実装
**優先度：高** | **予定工数：12時間**

#### 実装内容
```typescript
// src/app/admin/interview-bank/page.tsx
const InterviewBankAdminPage = () => {
  return (
    <div>
      <QuestionBankManager />      // 質問の追加・編集・削除
      <SectionDefinitionEditor />  // セクション定義の管理
      <FacilityCustomizer />      // 施設別カスタマイズ
      <DurationSettings />        // 時間別質問数設定
      <PreviewMode />             // プレビュー機能
    </div>
  )
}
```

#### 実装ファイル
- `src/app/admin/interview-bank/page.tsx`
- `src/app/admin/interview-bank/components/QuestionBankManager.tsx`
- `src/app/admin/interview-bank/components/SectionDefinitionEditor.tsx`
- `src/app/admin/interview-bank/components/FacilityCustomizer.tsx`

#### 成功基準
- [ ] 質問の CRUD 操作が可能
- [ ] セクション定義の編集が可能
- [ ] 施設別のカスタマイズが可能
- [ ] 変更のプレビューが可能

---

### タスク4：特別面談バンクシステムの構築
**優先度：中** | **予定工数：16時間**

#### 実装内容
```typescript
// src/lib/interview-bank/special/special-interview-bank.ts
const specialInterviewBank = {
  // 復職面談
  returnToWork: {
    maternity: [...産休育休復職質問],
    medical: [...病気療養復職質問],
    mental: [...メンタルヘルス復職質問],
    injury: [...怪我・事故復職質問],
    family: [...家族介護復職質問]
  },
  
  // インシデント後面談
  incident: {
    level0: [...ヒヤリハット質問],
    level1: [...軽微影響質問],
    level2: [...中程度影響質問],
    level3a: [...重大影響（回復）質問],
    level3b: [...重大影響（後遺症）質問],
    level4_5: [...死亡・重篤質問]
  },
  
  // 退職面談
  exit: {
    retirement: [...定年退職質問],
    voluntary: [...自己都合退職質問],
    transfer: [...転職退職質問],
    family: [...家族都合退職質問]
  }
}
```

#### 実装ファイル
- `src/lib/interview-bank/special/special-interview-bank.ts`
- `src/lib/interview-bank/special/return-to-work-questions.ts`
- `src/lib/interview-bank/special/incident-questions.ts`
- `src/lib/interview-bank/special/exit-questions.ts`
- `src/lib/interview-bank/special/generator.ts`

#### 成功基準
- [ ] 復職面談の質問バンク完成（5パターン）
- [ ] インシデント後面談の質問バンク完成（6レベル）
- [ ] 退職面談の質問バンク完成（4パターン）
- [ ] 動的生成機能が動作する

---

### タスク5：サポート面談バンクシステムの構築
**優先度：中** | **予定工数：16時間**

#### 実装内容
```typescript
// src/lib/interview-bank/support/support-interview-bank.ts
const supportInterviewBank = {
  // キャリア系面談
  career: {
    careerPath: [...キャリアパス相談質問],
    skillDevelopment: [...スキル開発相談質問],
    promotion: [...昇進・昇格相談質問],
    transfer: [...異動・配置転換相談質問]
  },
  
  // 職場環境系面談
  workplace: {
    environment: [...職場環境改善質問],
    relationships: [...人間関係相談質問],
    workload: [...業務負荷相談質問],
    workLifeBalance: [...ワークライフバランス質問]
  },
  
  // 個別相談面談
  personal: {
    performance: [...パフォーマンス相談質問],
    compensation: [...給与・待遇相談質問],
    training: [...研修・教育相談質問],
    compliance: [...コンプライアンス相談質問],
    other: [...その他相談質問]
  }
}
```

#### 実装ファイル
- `src/lib/interview-bank/support/support-interview-bank.ts`
- `src/lib/interview-bank/support/career-questions.ts`
- `src/lib/interview-bank/support/workplace-questions.ts`
- `src/lib/interview-bank/support/personal-questions.ts`
- `src/lib/interview-bank/support/generator.ts`

#### 成功基準
- [ ] キャリア系面談の質問バンク完成（4カテゴリ）
- [ ] 職場環境系面談の質問バンク完成（4カテゴリ）
- [ ] 個別相談面談の質問バンク完成（5カテゴリ）
- [ ] 動的生成機能が動作する

---

### タスク6：3つのバンクシステムの統一インターフェース実装
**優先度：中** | **予定工数：8時間**

#### 実装内容
```typescript
// src/lib/interview-bank/unified/unified-bank-interface.ts
interface UnifiedInterviewBank {
  // 共通インターフェース
  generateSheet(type: BankType, params: GenerationParams): Promise<GeneratedSheet>
  saveResult(type: BankType, result: InterviewResult): Promise<void>
  getQuestions(type: BankType, criteria: SelectionCriteria): Question[]
  getSections(type: BankType): Section[]
  
  // 統計・分析
  getAnalytics(type?: BankType): Promise<AnalyticsData>
  getCompletionRate(staffId: string): Promise<number>
}

// ファクトリーパターンで実装
class InterviewBankFactory {
  static create(type: 'regular' | 'special' | 'support'): InterviewBank {
    switch(type) {
      case 'regular': return new RegularInterviewBank()
      case 'special': return new SpecialInterviewBank()
      case 'support': return new SupportInterviewBank()
    }
  }
}
```

#### 実装ファイル
- `src/lib/interview-bank/unified/unified-bank-interface.ts`
- `src/lib/interview-bank/unified/bank-factory.ts`
- `src/lib/interview-bank/unified/bank-adapter.ts`

#### 成功基準
- [ ] 3つのバンクが同じインターフェースを実装
- [ ] ファクトリーパターンで切り替え可能
- [ ] 既存のDynamicInterviewFlowから利用可能

---

### タスク7：VoiceDrive連携機能の実装
**優先度：低** | **予定工数：10時間**

#### 実装内容
```typescript
// src/lib/interview-bank/integrations/voicedrive-integration.ts
class VoiceDriveBankIntegration {
  // 申込受信
  async processVoiceDriveRequest(request: VoiceDriveRequest): Promise<GeneratedSheet> {
    const bankType = this.detectBankType(request)
    const bank = InterviewBankFactory.create(bankType)
    return bank.generateSheet(this.convertRequest(request))
  }
  
  // 結果送信
  async sendResultToVoiceDrive(result: BankInterviewResult): Promise<void> {
    const formatted = this.formatForVoiceDrive(result)
    await VoiceDriveIntegrationService.sendInterviewResult(formatted)
    await this.sendNotification(result.staffId, 'completed')
  }
  
  // リアルタイム同期
  async syncWithVoiceDrive(): Promise<void> {
    const updates = await VoiceDriveIntegrationService.fetchUpdates()
    await this.applyUpdates(updates)
  }
}
```

#### 実装ファイル
- `src/lib/interview-bank/integrations/voicedrive-integration.ts`
- `src/lib/interview-bank/integrations/voicedrive-mapper.ts`
- `src/lib/interview-bank/integrations/notification-service.ts`

#### 成功基準
- [ ] VoiceDriveからの申込を処理できる
- [ ] 面談結果をVoiceDriveに送信できる
- [ ] 通知が送信される
- [ ] 双方向同期が機能する

---

### タスク8：MCP共有フォルダとの同期機能
**優先度：低** | **予定工数：6時間**

#### 実装内容
```typescript
// src/lib/interview-bank/integrations/mcp-sync.ts
class MCPSyncService {
  // 質問バンクの共有
  async shareQuestionBank(): Promise<void> {
    const data = {
      regular: regularQuestionBank,
      special: specialQuestionBank,
      support: supportQuestionBank,
      version: '2.0.0',
      lastUpdated: new Date()
    }
    await fs.writeFile('mcp-shared/data/interview-bank.json', JSON.stringify(data))
  }
  
  // 更新の取得
  async fetchMCPUpdates(): Promise<void> {
    const updates = await fs.readFile('mcp-shared/data/voicedrive-updates.json')
    await this.applyUpdates(JSON.parse(updates))
  }
  
  // 自動同期
  startAutoSync(interval: number = 3600000): void {
    setInterval(() => {
      this.shareQuestionBank()
      this.fetchMCPUpdates()
    }, interval)
  }
}
```

#### 実装ファイル
- `src/lib/interview-bank/integrations/mcp-sync.ts`
- `src/lib/interview-bank/integrations/mcp-monitor.ts`
- `mcp-shared/interfaces/interview-bank-shared.ts`

#### 成功基準
- [ ] 質問バンクがMCP共有フォルダに保存される
- [ ] VoiceDriveチームの更新を取得できる
- [ ] 自動同期が動作する
- [ ] 同期ログが記録される

---

### タスク9：既存面談システムの削除とコード整理
**優先度：最低** | **予定工数：4時間**

#### 削除対象
```
削除するファイル/フォルダ：
- src/services/interviewManualGenerationService.ts（旧サービス）
- src/services/interviewManualGenerationServiceV2.ts（旧サービス）
- src/docs/v1_interview/〜v5_interview/（固定テンプレート）
- src/components/interview/legacy/（レガシーコンポーネント）
```

#### 移行対象
```
保持・更新するファイル：
- src/components/interview/DynamicInterviewFlow.tsx（バンク統合済み）
- src/services/interviewSystemIntegrationService.ts（統合サービス）
- src/services/voicedriveIntegrationService.ts（連携サービス）
```

#### 成功基準
- [ ] 不要なファイルが削除される
- [ ] 依存関係が整理される
- [ ] テストが全て成功する
- [ ] ビルドエラーがない

---

## 📅 実装スケジュール

### フェーズ1（2025年8月第3週）
- タスク1：データ永続化層実装
- タスク2：職員カルテとの統合
- タスク3：管理者設定ページ（開始）

### フェーズ2（2025年8月第4週〜9月第1週）
- タスク3：管理者設定ページ（完了）
- タスク4：特別面談バンク構築
- タスク5：サポート面談バンク構築（開始）

### フェーズ3（2025年9月第2週）
- タスク5：サポート面談バンク構築（完了）
- タスク6：統一インターフェース実装

### フェーズ4（2025年9月第3週）
- タスク7：VoiceDrive連携
- タスク8：MCP同期機能

### フェーズ5（2025年9月第4週）
- タスク9：既存システム削除
- 統合テスト
- リリース準備

---

## ⚠️ 注意事項

1. **データ移行**
   - 既存データがある場合は移行スクリプトを作成
   - バックアップを必ず取得

2. **互換性維持**
   - 移行期間中は両システムが並行稼働
   - 段階的な切り替えを実施

3. **テスト**
   - 各タスク完了時に単体テスト実施
   - フェーズ完了時に統合テスト実施

4. **ドキュメント**
   - 実装と同時にドキュメント更新
   - API仕様書の作成

---

## 📝 開発者メモ

### 優先実装ポイント
1. **データ永続化を最優先**：他の全機能の基盤となる
2. **統一インターフェースを早期確定**：後の変更を最小化
3. **VoiceDrive連携は最後**：全バンク完成後に一括実装

### 技術的決定事項
- LocalStorage使用（開発環境）→ PostgreSQL（本番環境）
- TypeScript strictモード有効
- React 18 + Next.js 14.2.3
- Tailwind CSS + shadcn/ui

### 課題とリスク
- 質問数が膨大になる可能性 → インデックス最適化必要
- VoiceDrive APIの仕様変更リスク → アダプターパターンで対応
- パフォーマンス問題 → 遅延ローディング実装

---

## 📞 連絡先
- プロジェクト責任者：[責任者名]
- 技術リード：[技術リード名]
- 問い合わせ：[メールアドレス]

## 🔄 更新履歴
- 2025/08/16：初版作成
- [更新日]：[更新内容]

---

**本書は面談バンクシステム完全実装の公式作業指示書です。**  
**全開発者は本書に従って実装を進めてください。**