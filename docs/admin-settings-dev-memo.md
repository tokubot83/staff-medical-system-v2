# 管理者設定ページ 開発メモ

最終更新日: 2025年8月28日  
文書バージョン: 1.1

## 概要
医療職員管理システムの管理者設定ページに関する開発進捗と今後の実装予定を記録する開発メモです。

## 開発履歴

### 2025年9月1日 - ローカルLLM統合開発計画の策定と段階的実装 ✅

#### 開発工程・作業順序
**フェーズ1: フロントエンドLLM-Ready実装** ✅ **完了**
1. **最新評価タブ - レーダーチャート用AIコメント機能** ✅
   - レーダーチャート下にAI解釈セクション追加
   - 技術評価（50点）・組織貢献度（50点）別の解釈コメント
   - 具体的指導アドバイス生成機能（モック実装）
   - 強み・改善点の可視化
   - 短期・中長期アクションプラン自動生成

2. **評価履歴タブ - 既存AI解釈機能拡張** ✅
   - 時系列成長パターン分析機能追加
   - 急成長フェーズ検出・安定期識別
   - 成長要因分析・個別指導戦略
   - 注意すべきリスク管理
   - 次四半期アクションプラン（3段階目標設定）

**実装成果**
- AI人事指導支援システムの完全なUI/UX実装完了
- 最新評価 ↔ 評価履歴 の統合的人材育成フロー構築
- ローカルLLM統合時の1行切り替え設計実現

**フェーズ2: 共通DB + ローカルLLM環境同時構築** （次回実装時）
🎯 **重要**: DB構築と並行してローカルLLM環境を構築することで効率的な開発を実現

**2.1 インフラ基盤構築（AWS Lightsail想定）**
- PostgreSQL/MySQL共通DB設営
- Ollama環境構築（同一サーバー）
- モデルダウンロード（Llama 3.2:7b + Qwen 2.5:7b）
- セキュリティ設定（VPC・ファイアウォール・SSL）

**2.2 バックエンドAPI実装**
- Next.js API Routes実装（/api/llm/*）
- DB接続＋LLM統合エンドポイント
- 評価データ → LLMプロンプト → 人事コメント生成
- ストリーミングレスポンス対応

**2.3 データ連携設計**
```bash
# 統合データフロー
DB評価データ → Next.js API → Ollama LLM → フロントエンド表示
     ↓              ↓             ↓
   履歴蓄積    プロンプト最適化   リアルタイム更新
```

**フェーズ3: 本格AI統合・最適化** （最終段階）
- フロントエンド: モック→ローカルLLM切り替え（1行変更）
- 性能最適化・複数モデル選択機能
- 医療・人事特化プロンプトチューニング
- A/Bテスト機能（モデル・プロンプト比較）

#### 技術選定
- **ローカルLLM**: Ollama + Llama 3.2:7b/Qwen 2.5:7b
- **ライセンス**: 商用利用可能（MIT License）
- **統合方式**: 3層アーキテクチャ（Ollama Server → Next.js API → React Frontend）
- **コスト**: 完全無料（AWS Lightsail $40/月は別途）

#### 実装メリット
- **段階的価値提供**: フェーズ1で即座にUX向上
- **技術リスク分散**: LLM環境構築とフロントエンド改善を分離
- **拡張性確保**: 将来の新モデル対応・機能追加に柔軟対応

---

### 2025年8月28日 - 教育研修・評価管理システム連携機能の実装完了 ✅

#### 実装内容
**評価管理ダッシュボード ↔ 教育研修管理システム** 双方向連携機能の実装が完了しました。

#### 実装フェーズ
1. **フェーズ1: 面談管理ナビゲーション統一** ✅ 完了
   - 面談管理ページのナビゲーションをダッシュボードと統一
   - max-width: 1600px、統一色彩設計（#3b82f6）実装
   - ファイル: `src/app/interviews/Interviews.module.css`

2. **フェーズ2: 教育研修ページナビゲーション最適化** ✅ 完了
   - 教育研修ガイドタブの追加（評価ガイドと同様の機能）
   - 年間計画・受講管理を下位階層に移動して構造を簡素化
   - ファイル: `src/app/education/page.tsx`

3. **フェーズ3: 詳細依存関係の実装** ✅ 完了
   - MonthData interfaceの拡張（依存条件、対象期間、データフロー）
   - 月別連携詳細の可視化（critical/important/moderate分類）
   - 両システムで相互の依存関係を表示

4. **フェーズ4: 連携状況サマリーダッシュボード** ✅ 完了
   - 重要連携月（1月、3月、6月、12月）のリアルタイム表示
   - データ同期状況の可視化（評価結果→研修計画、研修完了→評価加点）
   - クロスリンク機能（研修管理↔評価管理の直接アクセス）

#### 技術的実装詳細
```typescript
interface MonthData {
  linkage?: {
    type: 'critical' | 'important' | 'moderate';
    description: string;
    dataFlow: string;
    educationImpact?: string;
  };
  trainingTasks?: Array<{
    dependsOn?: string;
    targetGroup?: string;
    expectedImpact?: string;
    deadline?: string;
  }>;
}
```

#### 関連ファイル
- `src/app/education/page.tsx` - 教育研修管理（連携表示実装）
- `src/app/evaluation-design/page.tsx` - 評価管理（連携サマリー実装）
- `src/app/interviews/Interviews.module.css` - 面談管理CSS統一
- `docs/implementation-restart-instructions-20250828.md` - 実装継続指示書

#### Git管理
- **コミット**: f89c26e "feat: 評価管理ダッシュボードに教育研修システム連携状況サマリーを追加"
- **ブランチ**: main, preview/feature-name 両方にpush完了

---

### 2025年8月15日 - 面談シート印刷機能の実装完了

#### 実装内容
**面談管理 > 面談実施タブ** において、動的生成された面談シートの印刷機能を実装しました。

#### 実装フェーズ
1. **フェーズ1: デジタル/印刷モード切り替え機能** ✅ 完了
   - デジタル入力モードと印刷用表示モードの切り替え実装
   - 印刷モード時は全セクションを一括表示

2. **フェーズ2: 印刷用レイアウト最適化** ✅ 完了
   - A4用紙2枚以内に収まるコンパクトなレイアウト
   - 白黒印刷対応、手書き入力用罫線
   - フォントサイズ最適化（本文8pt、見出し9pt、補足7pt）

3. **フェーズ3: 印刷プレビュー機能** ✅ 完了
   - 印刷前にレイアウトを確認できるプレビューモーダル
   - A4サイズでの実際の表示を再現
   - プレビューから直接印刷実行可能

#### 関連ファイル
- `src/components/interview/DynamicInterviewFlow.tsx` - メインコンポーネント
- `src/components/interview/DynamicInterviewFlow.module.css` - 印刷用CSS
- `docs/interview-print-mode-implementation.md` - 実装指示書

#### 今後の実装予定
**フェーズ4: QRコード付与機能**（バックエンド構築後）
- 印刷シートとデジタルデータの紐付け
- 手書き入力内容のシステム取り込み
- 実装指示書: `C:\projects\staff-medical-system\docs\interview-print-mode-implementation.md`

---

### 2025年8月14日 - 評価制度設計ページの実装

#### 実装内容
- 評価制度設計の新規タブ追加
- 法人統一項目設計ページ
- 施設別項目設計ページ
- 各項目の寄与度設定機能

---

### 2025年8月13日 - 個人評価管理の拡張

#### 実装内容
- 評価開示タブの独立化
- 異議申立タブの分離
- VoiceDrive連携通知機能

---

## 管理者設定ページ 機能一覧

### 1. システム設定
- [ ] 全般設定
- [ ] セキュリティ設定
- [ ] バックアップ設定

### 2. 施設管理
- [x] 施設情報登録
- [x] 部署管理
- [ ] 職種マスタ管理

### 3. 評価制度設計 ✅ 実装済み
- [x] 法人統一項目設計
- [x] 施設別項目設計
- [x] 寄与度設定
- [ ] 評価期間設定

### 4. 面談設定
- [x] 面談シート管理
- [x] 面談スケジュール設定
- [x] 印刷機能（2025/8/15実装）
- [ ] QRコード連携（バックエンド構築待ち）

### 5. 権限管理
- [ ] ロール設定
- [ ] アクセス権限設定
- [ ] 承認フロー設定

### 6. 通知設定
- [x] VoiceDrive連携通知
- [ ] メール通知設定
- [ ] リマインダー設定

### 7. データ管理
- [ ] インポート/エクスポート
- [ ] データ移行ツール
- [ ] 監査ログ

---

## 技術的課題と対応

### 解決済み
1. **印刷時のレイアウト崩れ**
   - CSS @media print の最適化により解決
   - A4用紙2枚以内の制約を達成

2. **印刷モードでのセクション表示**
   - 条件分岐により全セクション一括表示を実現

### 検討中
1. **QRコード実装**
   - バックエンドAPI設計必要
   - セッション管理の仕組み構築

2. **OCR機能**
   - 手書き文字認識の精度
   - 外部サービス連携の検討

---

## 今後の開発スケジュール

### 2025年8月（完了）✅
- [x] 教育研修・評価管理システム連携機能の完全実装
- [x] 面談管理ナビゲーション統一
- [x] MonthData interface拡張と依存関係可視化
- [x] 連携状況サマリーダッシュボード実装

### 2025年9月（次期実装候補）
**優先度A: リアルタイム機能**
- [ ] WebSocket/SSEによるリアルタイムデータ同期
- [ ] 連携アラート機能（依存関係エラー時の通知）
- [ ] 自動データ整合性チェック

**優先度B: レポート機能**
- [ ] 連携効果レポート生成（PDF出力）
- [ ] ROI分析ダッシュボード
- [ ] 研修-評価相関分析

**優先度C: システム基盤**
- [ ] バックエンドAPI基本設計
- [ ] 認証・認可システムの実装
- [ ] データベース最適化

### 2025年10月
- [ ] QRコード機能実装（フェーズ5）
- [ ] 権限管理システム実装
- [ ] 監査ログ機能
- [ ] OCR機能の検証
- [ ] パフォーマンス最適化
- [ ] セキュリティ監査

---

### 2025年9月3日 - 健康管理システム構築構想の策定 🆕

#### 提案書作成
**法人統一職員健康管理システム導入提案書** を作成し、健診室主任向けに提出予定
- ファイル: `docs/法人統一職員健康管理システム導入提案書.md`
- 対象: IT知識なしの健診室職員向け
- 内容: 労働安全衛生法対応、ストレスチェック管理、システム統合効果

#### 健康管理ページ構築構想

**1. システム構成設計**
```
健康管理システム統合構成
├─ 健康管理ページ（法人統一管理）
├─ 職員カルテ個人ページ
│  └─ 健康・ウェルビーイングタブ
└─ アクセス制御システム（権限分離）
```

**2. 労働安全衛生法7分野対応機能**

| 分野 | 管理機能 | 実装優先度 |
|------|----------|------------|
| **健康診断管理** | 一般・特殊健診結果、5年間保存、異常所見者対応 | High |
| **作業環境管理** | 放射線量・化学物質測定記録、改善措置履歴 | High |
| **作業管理** | 夜勤・長時間労働管理、面接指導記録 | High |
| **健康教育** | 安全衛生研修受講履歴、感染対策教育記録 | Medium |
| **健康保持増進** | ストレスチェック、メンタルヘルス相談履歴 | High |
| **管理体制** | 産業医巡視記録、安全衛生委員会議事録 | Medium |
| **労働者申告** | 匿名相談窓口、改善要求対応履歴 | Medium |

**3. ストレスチェック特別管理機能**

**3-1. 厚労省公式ツール統合**
- URL: https://kokoro.mhlw.go.jp/check/
- 職業性ストレス簡易調査票57問（法令準拠）
- 実施者（保健師・研修修了者）による企画・管理

**3-2. アクセス制御設計（法的要件対応）**
```typescript
// ストレスチェック専用アクセス権限
interface StressCheckPermissions {
  // 実施者権限（保健師・研修修了看護師・精神保健福祉士）
  implementer: {
    access: ['planning', 'execution', 'group_analysis', 'result_management'];
    restrictions: ['individual_result_without_consent'];
  };
  
  // 産業医権限
  occupationalDoctor: {
    access: ['interview_guidance_applicants_only'];
    restrictions: ['bulk_individual_results', 'non_applicant_data'];
  };
  
  // 本人権限
  individual: {
    access: ['own_result_only', 'interview_application'];
    restrictions: ['other_staff_results'];
  };
  
  // 人事部権限
  hr: {
    access: ['group_analysis_only', 'statistical_reports'];
    restrictions: ['individual_results', 'personal_identification'];
  };
}
```

**4. データベース設計思想**

**4-1. 一般健康情報テーブル**
```sql
-- 人事部アクセス可能
CREATE TABLE health_records (
  staff_id VARCHAR(50),
  health_exam_date DATE,
  exam_results JSON,
  vaccination_records JSON,
  work_hours_tracking JSON,
  occupational_risks JSON,
  created_by VARCHAR(50),
  updated_at TIMESTAMP
);
```

**4-2. ストレスチェック専用テーブル（分離設計）**
```sql
-- 実施者・産業医のみアクセス可能
CREATE TABLE stress_check_records (
  record_id UUID PRIMARY KEY,
  staff_id_encrypted VARCHAR(255), -- 暗号化
  implementation_date DATE,
  stress_score INTEGER,
  high_stress_flag BOOLEAN,
  interview_application_flag BOOLEAN,
  implementer_id VARCHAR(50),
  access_log JSON, -- 詳細監査ログ
  retention_period DATE -- 5年保存期限
);
```

**5. 権限管理・画面設計**

**5-1. 健診室職員用管理画面**
```typescript
// 健康管理ページ - 健診室職員ビュー
interface HealthManagementView {
  // 全職員一覧表示可能
  staffHealthOverview: {
    generalHealthData: 'accessible';
    stressCheckData: 'group_statistics_only';
  };
  
  // ストレスチェック実施管理
  stressCheckManagement: {
    planning: 'full_access';
    implementation: 'full_access';
    groupAnalysis: 'full_access';
    individualResults: 'consent_required_only';
  };
  
  // その他健康データ管理
  healthDataManagement: {
    healthExams: 'full_access';
    vaccinations: 'full_access';
    occupationalHealth: 'full_access';
  };
}
```

**5-2. 職員カルテ個人ページ設計**
```typescript
// 健康・ウェルビーイングタブ構成
interface PersonalHealthTab {
  sections: [
    {
      name: '健康診断履歴';
      access: 'hr_and_health_staff';
      data: ['exam_results', 'follow_up_actions', 'restrictions'];
    },
    {
      name: 'ストレスチェック結果';
      access: 'individual_only'; // 本人のみ
      data: ['own_results', 'interview_application_status'];
    },
    {
      name: '予防接種記録';
      access: 'hr_and_health_staff';
      data: ['vaccination_history', 'next_due_dates'];
    },
    {
      name: '労働時間・面接指導';
      access: 'hr_and_health_staff';
      data: ['overtime_hours', 'interview_records'];
    },
    {
      name: '健康相談履歴';
      access: 'health_staff_only';
      data: ['consultation_records', 'referral_history'];
    }
  ];
}
```

**6. 技術実装方針**

**6-1. フロントエンド実装**
- React/Next.js継続使用
- 権限別条件分岐レンダリング
- ストレスチェック画面のみ特別セキュリティ

**6-2. バックエンドAPI設計**
```typescript
// 権限チェック付きAPI設計例
app.get('/api/health/:staffId', authMiddleware, (req, res) => {
  const userRole = req.user.role;
  const targetStaffId = req.params.staffId;
  
  if (userRole === 'stress_check_implementer') {
    // 実施者：ストレスチェックアクセス可能
    return getHealthDataWithStressCheck(targetStaffId);
  } else if (userRole === 'hr_staff') {
    // 人事部：ストレスチェック除外
    return getHealthDataExcludingStressCheck(targetStaffId);
  }
});
```

**7. セキュリティ・コンプライアンス対応**

**7-1. データ暗号化**
- ストレスチェック結果：AES-256暗号化
- 個人識別情報：ハッシュ化
- アクセスログ：改ざん防止署名

**7-2. 監査機能**
- 全アクセスログ記録
- 不正アクセス検知
- 定期的権限レビュー

**8. 実装フェーズ計画**

**Phase1（1-2ヶ月）: 基盤構築**
- アクセス制御システム設計・実装
- データベーススキーマ設計
- 権限管理API開発

**Phase2（2-3ヶ月）: 健康管理機能実装**
- 7分野管理機能開発
- ストレスチェック統合システム構築
- 厚労省ツール連携実装

**Phase3（1ヶ月）: UI/UX・テスト**
- 健診室職員向け管理画面
- 職員カルテ健康タブ実装
- セキュリティテスト・法令適合性検証

**9. 期待される効果**

**業務効率化**
- 各施設バラバラ → 法人統一管理
- 手作業 → システム自動化
- 法令対応漏れ → 完全準拠保証

**コスト削減**
- ストレスチェック外部委託不要
- 管理工数削減
- 法的リスク軽減

**職員満足度向上**
- プライバシー保護強化
- 健康情報の一元管理
- 相談窓口の充実

---

## 関連ドキュメント

- **[実装再開指示書（2025/8/28版）](./implementation-restart-instructions-20250828.md)** - **次回作業時必読**
- [面談シート印刷機能 実装指示書](./interview-print-mode-implementation.md)
- [評価制度設計 仕様書](./two-axis-evaluation-implementation-guide.md)
- [Phase3 実装ガイド](./phase3-implementation-guide.md)
- [API連携準備チェックリスト](./API連携準備チェックリスト.md)

---

## メモ・備考

- 印刷機能はChrome/Edgeで最適化済み、Firefoxは要確認
- A4用紙2枚制限は7セクション程度まで対応可能
- QRコード実装時はセキュリティ（有効期限72時間）を考慮
- VoiceDriveとのMCPサーバー連携は正常稼働中

---

## 連絡先

開発に関する質問や要望は以下まで：
- システム開発チーム
- VoiceDrive連携チーム（MCP経由）