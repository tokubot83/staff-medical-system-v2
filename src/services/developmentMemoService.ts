export interface DevelopmentMemo {
  id: string;
  category: string;
  subcategory?: string;
  title: string;
  content: string;
  source: {
    type: 'file' | 'comment' | 'document';
    path: string;
    line?: number;
  };
  date: string;
  priority: 'critical' | 'important' | 'info';
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  tags?: string[];
}

class DevelopmentMemoService {
  private memos: DevelopmentMemo[] = [];

  constructor() {
    this.loadAllMemos();
  }

  private loadAllMemos() {
    // ハードコードされた開発メモの収集
    this.memos = [
      // ===== システム全体 =====
      {
        id: 'sys-001',
        category: 'システム全体',
        subcategory: 'アーキテクチャ',
        title: '実装作業再開指示書 V3（最新版）',
        content: '2025年8月13日作成。85%完了。残タスク：データ管理・システム連携機能（4-5時間）',
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250813.md' },
        date: '2025-08-13',
        priority: 'critical',
        status: 'in_progress',
        tags: ['実装指示', '進捗管理']
      },
      {
        id: 'sys-002',
        category: 'システム全体',
        subcategory: 'バックエンド移行',
        title: 'バックエンド構築時の注意事項',
        content: '現在はモックデータ使用。サービス層でデータロジックを管理し、将来的なAPI移行を考慮した設計。masterDataService.tsを参考に実装すること。',
        source: { type: 'file', path: '/src/services/masterDataService.ts' },
        date: '2025-08-14',
        priority: 'important',
        status: 'pending',
        tags: ['バックエンド', 'API設計']
      },
      {
        id: 'sys-003',
        category: 'システム全体',
        subcategory: 'データベース',
        title: 'データベース設計参考資料',
        content: 'ER図、データディクショナリー、マイグレーション戦略が文書化済み',
        source: { type: 'document', path: '/docs/database-design-reference.md' },
        date: '2025-07-15',
        priority: 'important',
        status: 'completed',
        tags: ['DB設計', 'スキーマ']
      },

      // ===== 面談システム統合問題 =====
      {
        id: 'interview-integration-001',
        category: '面談システム',
        subcategory: '統合問題',
        title: '面談シート表示機能の統合問題分析',
        content: `【問題概要】
職員カルテの面談シートボタンと面談管理ページの動的生成システムの統合時にエラーが発生。
根本原因：保存処理の未実装と複雑なデータ構造の不整合。

【技術的問題】
1. 面談管理ページの結果記録タブで保存ボタンに機能なし（onClick未実装）
2. InterviewDataServiceとの連携が存在しない
3. バンクシステムの保存処理が「TODO」のまま
4. 動的生成シートと固定HTMLデータの構造不整合

【データフロー問題】
面談実施 → 保存処理なし → 結果記録されない → staff-tabs表示データ存在しない`,
        source: { type: 'file', path: '/src/app/staff-cards/staff-tabs.tsx', line: 2020 },
        date: '2025-09-02',
        priority: 'critical',
        status: 'pending',
        tags: ['面談システム', 'データ統合', 'エラー修正']
      },
      {
        id: 'interview-integration-002',
        category: '面談システム',
        subcategory: '実装順序',
        title: '面談シート統合の推奨実装順序',
        content: `【DB構築前（LocalStorage版）】
Phase 1: 保存機能の実装
1. 結果記録タブの保存ボタン機能実装 (interviews/page.tsx:2393)
2. InterviewDataService.completeInterview()との連携
3. sheetDataの統一フォーマット設計

Phase 2: 読み込み機能の実装
4. staff-tabs.tsxのhandleShowInterviewSheet修正
5. データ存在確認とエラーハンドリング
6. 「データなし」時のフォールバック表示

Phase 3: バンク機能統合
7. UnifiedInterviewBankSystemの保存処理実装
8. カスタム質問の保存形式統一
9. 動的生成データの構造化

【DB構築後】
Phase 4: データベース統合
10. 統一データスキーマ設計
11. 面談結果テーブル設計
12. API実装とフロントエンド接続`,
        source: { type: 'document', path: '/analysis/interview-integration-analysis.md' },
        date: '2025-09-02',
        priority: 'critical',
        status: 'pending',
        tags: ['実装計画', '優先順位', 'DB設計']
      },
      {
        id: 'interview-integration-003',
        category: '面談システム',
        subcategory: 'データ構造',
        title: '面談データ構造の複雑性分析',
        content: `【データ構造の種類】
1. 固定シートデータ（staff-tabs.tsx）
   - 300行のハードコードされたHTML
   - 単一の面談シート構造

2. 動的生成データ（InterviewSheetViewer）
   - InterviewSectionInstance[]配列
   - 経験年数・職種・施設別の動的質問選択
   - lazy loadingによるコンポーネント読み込み

3. バンクカスタムデータ
   - CustomQuestion[]配列
   - ユーザー定義質問
   - セクション別質問組み合わせ

4. 保存データ形式（InterviewDataService）
   - sheetData: any（型不明）
   - 現在未使用

【統合時の課題】
- データ形式の不統一によるJSX構文エラー
- 複雑な動的生成ロジックとの競合
- 保存・読み込み処理の未実装`,
        source: { type: 'file', path: '/src/components/interview/InterviewSheetViewer.tsx', line: 87 },
        date: '2025-09-02',
        priority: 'important',
        status: 'pending',
        tags: ['データ構造', '技術仕様', '複雑性']
      },
      {
        id: 'interview-integration-004',
        category: '面談システム',
        subcategory: 'DB設計要件',
        title: 'DB構築時の面談システム統合要件',
        content: `【必要なテーブル設計】
1. interview_sessions（面談セッション）
   - session_id, staff_id, interviewer_id, date, type, status

2. interview_sheet_data（面談シートデータ）
   - sheet_id, session_id, sheet_type, structure_version, raw_data(JSON)

3. interview_responses（面談回答）
   - response_id, sheet_id, question_id, response_value, score

4. custom_questions（カスタム質問）
   - question_id, creator_id, question_text, category, type

5. question_banks（質問バンク）
   - bank_id, facility_type, profession, experience_level, questions(JSON)

【API設計要件】
- POST /api/interviews/sessions （面談セッション作成）
- PUT /api/interviews/sessions/{id}/complete （面談完了・保存）
- GET /api/interviews/sheets/{sessionId} （面談シート取得）
- POST /api/interviews/custom-questions （カスタム質問作成）

【移行戦略】
- LocalStorageからDB移行時のデータ変換
- 既存の固定HTMLデータの構造化
- バージョニング戦略（v4,v5シート対応）`,
        source: { type: 'document', path: '/database/interview_schema_design.md' },
        date: '2025-09-02',
        priority: 'important',
        status: 'pending',
        tags: ['DB設計', 'API設計', '移行戦略']
      },
      {
        id: 'interview-integration-005',
        category: '面談システム',
        subcategory: 'リスク回避',
        title: '統合実装時のリスク回避策',
        content: `【前回エラーの教訓】
- 大規模ファイル（staff-tabs.tsx）での一度の複雑な修正は高リスク
- 動的生成システムと固定データの混在は予期しない競合を起こす
- 保存処理未実装の状態でデータ読み込み処理を実装すると必ずエラー

【推奨アプローチ】
1. 段階的実装
   - 1つの機能ずつ実装し、各段階でビルド確認
   - 既存システムを最小限の修正に留める

2. データ存在確認の徹底
   - 読み込み処理前に必ずデータ存在チェック
   - エラーハンドリングとフォールバック処理

3. 統合前のテスト
   - 保存処理が正常に動作してから読み込み処理を実装
   - モックデータでの動作確認

【緊急時対応】
- git reset --hard {安全なコミット} による即座の復旧
- 機能フラグによる新機能の無効化オプション`,
        source: { type: 'comment', path: 'integration-lessons-learned' },
        date: '2025-09-02',
        priority: 'critical',
        status: 'pending',
        tags: ['リスク管理', '実装戦略', '品質保証']
      },

      // ===== マスターデータ管理 =====
      {
        id: 'master-001',
        category: 'マスターデータ管理',
        subcategory: '実装内容',
        title: 'マスターデータ管理機能の実装完了',
        content: '職員・施設・研修・評価項目の4つのマスターデータ管理機能を実装。スキーマ駆動型設計で項目追加が容易。',
        source: { type: 'file', path: '/src/config/masterSchemas.ts' },
        date: '2025-08-14',
        priority: 'info',
        status: 'completed',
        tags: ['マスターデータ', 'CRUD']
      },
      {
        id: 'master-002',
        category: 'マスターデータ管理',
        subcategory: '拡張ポイント',
        title: 'マスターデータの項目追加方法',
        content: 'masterSchemas.tsのfields配列に新しいFieldDefinitionを追加するだけで、UIが自動生成される。バックエンド実装時はmasterDataServiceのメソッドを差し替える。',
        source: { type: 'file', path: '/src/config/masterSchemas.ts' },
        date: '2025-08-14',
        priority: 'important',
        status: 'completed',
        tags: ['拡張性', '設定']
      },
      {
        id: 'master-003',
        category: 'マスターデータ管理',
        subcategory: 'API設計',
        title: 'マスターデータAPI設計案',
        content: 'RESTful API: GET /api/master/{type}, POST /api/master/{type}, PUT /api/master/{type}/{id}, DELETE /api/master/{type}/{id}',
        source: { type: 'file', path: '/src/services/masterDataService.ts' },
        date: '2025-08-14',
        priority: 'info',
        status: 'pending',
        tags: ['API', 'REST']
      },

      // ===== 教育研修管理システム（2025年8月28日統合実装） =====
      {
        id: 'training-2025-001',
        category: '教育研修管理',
        subcategory: 'システム統合',
        title: '旧研修システムの統合・整理完了',
        content: '重複していた/training、/training-v3を/educationに統一。全システムのリンクを修正し、旧システムの名残を完全除去。',
        source: { type: 'file', path: '/src/app/education/page.tsx' },
        date: '2025-08-28',
        priority: 'important',
        status: 'completed',
        tags: ['リファクタリング', 'システム統合', 'URL統一']
      },
      {
        id: 'training-2025-002',
        category: '教育研修管理',
        subcategory: 'UI/UX改善',
        title: '教育研修ステーションの実装',
        content: '評価管理ダッシュボードと統一したデザインパターンで研修ステーションを実装。2つのメインカード（研修計画・受講管理）と動的な月別タスク表示機能を追加。',
        source: { type: 'file', path: '/src/app/education/page.tsx' },
        date: '2025-08-28',
        priority: 'important',
        status: 'completed',
        tags: ['UI統一', 'ステーション', '動的表示']
      },
      {
        id: 'training-2025-003',
        category: '教育研修管理',
        subcategory: 'ナビゲーション最適化',
        title: '1行ナビゲーション構造の確立',
        content: '4つのタブに集約：研修ステーション・年間計画・受講管理・分析効果測定。不要だった評価項目マッピングタブを削除し、2列表示UIで自動化。',
        source: { type: 'file', path: '/src/app/education/page.tsx' },
        date: '2025-08-28',
        priority: 'info',
        status: 'completed',
        tags: ['ナビゲーション', 'タブ最適化', 'UX改善']
      },
      {
        id: 'training-2025-004',
        category: '教育研修管理',
        subcategory: '評価連携強化',
        title: '研修効果と評価スコアの相関分析機能',
        content: '分析・効果測定タブに研修ROI、評価スコア向上、相関分析、効果予測シミュレーション機能を追加。研修投資の効果を定量的に測定可能。',
        source: { type: 'file', path: '/src/app/education/page.tsx' },
        date: '2025-08-28',
        priority: 'important',
        status: 'completed',
        tags: ['ROI分析', '相関分析', 'シミュレーション', 'データドリブン']
      },
      {
        id: 'training-2025-005',
        category: '教育研修管理',
        subcategory: 'アラート機能',
        title: '未受講者アラート・個別フォローアップ機能',
        content: '受講管理タブに未受講者の自動検出とアラート機能を実装。個人別受講状況の可視化と要フォロー者の特定機能。評価実施前の研修完了確認を自動化。',
        source: { type: 'file', path: '/src/app/education/page.tsx' },
        date: '2025-08-28',
        priority: 'important',
        status: 'completed',
        tags: ['アラート', '個別管理', 'フォローアップ', '自動化']
      },
      {
        id: 'training-2025-006',
        category: '教育研修管理',
        subcategory: '2列表示UI実装',
        title: '2列表示年間UIの実装完了',
        content: `年間計画タブに教育研修年間UI（左側）と評価管理年間UI（右側）の2列表示UIを完全実装。

【実装機能】
- 月別2列表示：各月の研修タスクと評価タスクを並列表示
- リアルタイム連携効果表示：研修が評価スコアに与える影響を可視化
- 現在月強調表示：8月を青いグラデーションで強調
- 重要月バッジ：6月(夏季貢献度)、12月(冬季貢献度)、3月(技術評価)を特別表示
- 年間サマリー：18研修プログラム、4回評価、ROI 125%予測

【技術的改善】
- 評価制度設計ページのyearScheduleデータ構造を参考に統合
- currentMonthの動的取得によるリアルタイム表示
- AlertTriangle、Sparklesアイコンの追加
- 連携効果の可視化（+3点向上、ROI改善等）

研修と評価の連携フローが一目で把握でき、業務効率と教育効果の最大化を実現。`,
        source: { type: 'file', path: '/src/app/education/page.tsx' },
        date: '2025-08-28',
        priority: 'critical',
        status: 'completed',
        tags: ['2列表示', '年間UI', '連携可視化', '実装完了', 'リアルタイム連携']
      },
      {
        id: 'training-2025-007',
        category: '教育研修管理',
        subcategory: 'クリーンアップ',
        title: '不要な旧研修システムページの削除完了',
        content: `旧システムURL統合により不要となったページディレクトリを削除。

【削除対象】
- /src/app/training/ (旧研修システムページ)
  - page.tsx
  - Training.module.css 
  - calendar/page.tsx
- /src/app/training-v3/ (V3研修システムページ)
  - page.tsx
  - TrainingV3.module.css

【確認済み】
- 他のファイルからの参照なし
- リンク切れなし
- /education への統合により機能は維持

これによりプロジェクト構造がクリーンになり、メンテナンス性が向上。`,
        source: { type: 'file', path: '/src/app/' },
        date: '2025-08-28',
        priority: 'info',
        status: 'completed',
        tags: ['クリーンアップ', '削除', 'リファクタリング', 'プロジェクト最適化']
      },

      // ===== 面談システム =====
      {
        id: 'interview-001',
        category: '面談システム',
        subcategory: '面談フロー',
        title: '面談システム概要と設計',
        content: '定期面談の予約管理、実施記録、フィードバック管理を統合。15分/30分/45分の時間枠別面談シート。',
        source: { type: 'document', path: '/docs/interview-system-overview.md' },
        date: '2025-07-20',
        priority: 'important',
        status: 'completed',
        tags: ['面談', 'ワークフロー']
      },
      {
        id: 'interview-002',
        category: '面談システム',
        subcategory: 'データ構造',
        title: '面談API設計',
        content: '面談予約、実施記録、フィードバックのAPIエンドポイント設計',
        source: { type: 'document', path: '/docs/interview-api-design.md' },
        date: '2025-07-25',
        priority: 'important',
        status: 'completed',
        tags: ['API', '面談']
      },
      {
        id: 'interview-003',
        category: '面談システム',
        subcategory: '実装メモ',
        title: '面談シートv5（最新版）',
        content: '動機タイプ判定機能を統合した統一面談シート。職位別・時間別に18種類のシートを用意。',
        source: { type: 'document', path: '/docs/v5_interview/README.md' },
        date: '2025-08-10',
        priority: 'info',
        status: 'completed',
        tags: ['面談シート', 'v5']
      },
      {
        id: 'interview-004',
        category: '面談システム',
        subcategory: '開発メモ',
        title: 'HR System Guide内の面談システム説明',
        content: `面談制度の全体像：
- 定期面談（月1回）: 業務進捗確認、目標設定
- 評価面談（年2回）: 人事評価のフィードバック
- キャリア面談（年1回）: キャリアパス相談
面談後は必ずシステムに記録を入力`,
        source: { type: 'file', path: '/app/hr-system-guide/page.tsx', line: 850 },
        date: '2025-07-30',
        priority: 'info',
        status: 'completed',
        tags: ['面談制度', 'ガイド']
      },
      {
        id: 'interview-005',
        category: '面談システム',
        subcategory: '重要：統合面談ダッシュボード',
        title: '【最重要】統合面談ダッシュボードの動作フロー',
        content: `【DB構築前に必ず確認】
統合面談ダッシュボード(/interviews?tab=dashboard)から面談シート生成への遷移フロー：

1. 面談予約一覧から「面談開始」ボタンをクリック
2. sessionStorageに予約情報を保存
3. router.push('/interviews?tab=sheets&fromDashboard=true')で遷移
4. InterviewsPageがuseSearchParamsでtab=sheetsを検知
5. DynamicInterviewFlowコンポーネントがレンダリング
6. DynamicInterviewFlowがuseSearchParamsでfromDashboard=trueを検知
7. sessionStorageから予約情報を読み込み
8. 予約タイプに応じて適切な画面へ遷移：
   - 定期面談 → バンクシステム選択画面
   - 特別面談・サポート面談 → 時間選択画面

【実装済み機能】
- Next.js 13+ useSearchParamsフックによるURLパラメータ監視
- sessionStorageによる予約データ受け渡し
- router.pushによるSPA的な遷移（ページリロード不要）

【注意事項】
- window.location.hrefは使用しない（SPAの利点を失う）
- handleReservationData関数はuseEffect内から呼び出される
- 予約タイプのマッピング: regular → regular_annual等

【関連ファイル】
- /src/components/interview/UnifiedInterviewDashboard.tsx (L212-223)
- /src/app/interviews/page.tsx (L51-61)
- /src/components/interview/DynamicInterviewFlow.tsx (L173-198, L275-312)`,
        source: { type: 'file', path: '/src/components/interview/UnifiedInterviewDashboard.tsx', line: 212 },
        date: '2025-08-16',
        priority: 'critical',
        status: 'completed',
        tags: ['統合ダッシュボード', '面談開始', '遷移フロー', 'DB構築前確認']
      },

      // ===== 評価システム =====
      {
        id: 'eval-001',
        category: '評価システム',
        subcategory: '評価ロジック',
        title: '2軸評価方式の実装',
        content: '技術スコア（0-100点）と貢献度スコア（0-100点）の2軸で評価。最終評価は加重平均で算出。',
        source: { type: 'document', path: '/docs/two-axis-evaluation-implementation-guide.md' },
        date: '2025-07-20',
        priority: 'critical',
        status: 'completed',
        tags: ['評価', '2軸評価']
      },
      {
        id: 'eval-002',
        category: '評価システム',
        subcategory: 'スコア計算',
        title: '評価スコア計算ロジック',
        content: `技術スコア = Σ(項目スコア × 重み) / Σ重み
貢献度スコア = (組織貢献 + チーム貢献 + 個人成果) / 3
最終スコア = 技術スコア × 0.6 + 貢献度スコア × 0.4`,
        source: { type: 'file', path: '/src/components/evaluation/IntegratedEvaluationForm.tsx', line: 170 },
        date: '2025-07-22',
        priority: 'important',
        status: 'completed',
        tags: ['スコア計算', 'ロジック']
      },
      {
        id: 'eval-003',
        category: '評価システム',
        subcategory: '統合方針',
        title: '評価ワークフロー機能',
        content: 'draft → submitted → pending_approval → approved/rejected → confirmed の承認フロー実装済み',
        source: { type: 'file', path: '/src/services/evaluationWorkflowService.ts' },
        date: '2025-08-13',
        priority: 'info',
        status: 'completed',
        tags: ['ワークフロー', '承認']
      },
      {
        id: 'eval-004',
        category: '評価システム',
        subcategory: '開発メモ',
        title: '評価シートv4パターン5',
        content: '施設別・職種別・経験年数別の詳細な評価シート。急性期・慢性期・外来・老健など施設特性に応じた評価項目。',
        source: { type: 'file', path: '/src/app/evaluation-sheets/v4/page.tsx' },
        date: '2025-08-05',
        priority: 'info',
        status: 'completed',
        tags: ['評価シート', 'v4']
      },

      // ===== 教育・研修 =====
      {
        id: 'training-001',
        category: '教育・研修',
        subcategory: '研修管理',
        title: '研修管理機能の実装',
        content: '項目バンク、研修計画自動生成、進捗ダッシュボード、カレンダービューを実装完了',
        source: { type: 'file', path: '/src/app/training/page.tsx' },
        date: '2025-08-13',
        priority: 'info',
        status: 'completed',
        tags: ['研修', '教育']
      },
      {
        id: 'training-002',
        category: '教育・研修',
        subcategory: '法定研修',
        title: '法定研修の自動リマインド',
        content: '30日前、7日前、前日に自動でアラート通知。notificationServiceで実装済み。',
        source: { type: 'file', path: '/src/services/notificationService.ts' },
        date: '2025-08-13',
        priority: 'important',
        status: 'completed',
        tags: ['通知', '法定研修']
      },
      {
        id: 'training-003',
        category: '教育・研修',
        subcategory: 'TODO',
        title: '研修効果測定機能（未実装）',
        content: 'TODO: 研修前後のスキル評価比較機能を実装予定',
        source: { type: 'comment', path: '/src/services/trainingService.ts', line: 45 },
        date: '2025-08-10',
        priority: 'info',
        status: 'pending',
        tags: ['TODO', '効果測定']
      },

      // ===== 面談システム改定 =====
      {
        id: 'interview-001',
        category: '面談システム',
        subcategory: 'UI改善',
        title: '面談マニュアルシート改定（デジタル入力モード）',
        content: `
【改定概要】
参照HTMLデザインを基に、面談マニュアルシートのデジタル入力モードを大幅改善。
誰が面談しても同じ条件で情報が得られる標準化された面談システムの構築。

【フェーズ1（即実装）】- 2025年8月16日開始
1. 参照HTMLベースのUIコンポーネント作成
   - サイドナビゲーション実装
   - 5段階評価＋テキスト入力のハイブリッド型質問コンポーネント
   - セクション別の構造化レイアウト
2. v4・v5面談シートの質問項目分析と統合
3. 基本的な質問マスターデータの登録

【フェーズ2（1ヶ月内）】
1. 全施設×職種×レベルの質問テンプレート完成
   - 急性期、慢性期、老健、グループホーム、外来
   - 看護師、准看護師、看護補助者、介護職員、PT/OT/ST、医事課職員
   - 新人～管理職までの全レベル対応
2. レスポンシブデザイン対応
3. 質問カスタマイズ機能

【フェーズ3（将来）】
1. AI質問生成機能
2. 音声入力対応
3. リアルタイム分析ダッシュボード
4. 回答パターンの自動分析

【技術仕様】
- 質問マスターデータ構造の実装
- 施設×職種×レベル別の動的質問生成
- v4/v5面談シートの内容を完全網羅
`,
        source: { type: 'file', path: '/src/components/interview/DynamicInterviewFlow.tsx' },
        date: '2025-08-16',
        priority: 'critical',
        status: 'in_progress',
        tags: ['面談システム', 'UI改善', 'フェーズ1']
      },

      // ===== その他機能 =====
      {
        id: 'other-001',
        category: 'その他機能',
        subcategory: '通知システム',
        title: '通知センター実装完了',
        content: '研修期限、評価締切、承認依頼などの通知を一元管理。フィルタリング、既読管理機能付き。',
        source: { type: 'file', path: '/src/components/notification/NotificationCenter.tsx' },
        date: '2025-08-13',
        priority: 'info',
        status: 'completed',
        tags: ['通知', 'UI']
      },
      {
        id: 'other-002',
        category: 'その他機能',
        subcategory: 'レポート',
        title: '部門別分析レポート',
        content: '部門ごとの評価傾向、研修進捗、12ヶ月トレンドグラフを表示',
        source: { type: 'file', path: '/src/components/reports/DepartmentAnalysisReport.tsx' },
        date: '2025-08-13',
        priority: 'info',
        status: 'completed',
        tags: ['レポート', '分析']
      },
      {
        id: 'other-003',
        category: 'その他機能',
        subcategory: '権限管理',
        title: '権限管理（未実装）',
        content: '管理者/マネージャー/一般職員の3階層の権限管理を実装予定。現在は全機能アクセス可能。',
        source: { type: 'document', path: '/docs/Phase2計画書.md' },
        date: '2025-08-05',
        priority: 'important',
        status: 'pending',
        tags: ['権限', 'セキュリティ']
      },
      {
        id: 'other-004',
        category: 'その他機能',
        subcategory: 'MCP連携',
        title: 'MCP Server（VoiceDrive連携）',
        content: 'VoiceDriveとのMCPサーバー連携設定。共有フォルダ経由でのデータ同期実装。',
        source: { type: 'document', path: '/docs/MCP_Server_Setup_Plan.md' },
        date: '2025-08-10',
        priority: 'info',
        status: 'completed',
        tags: ['MCP', '連携']
      },

      // ===== 実装予定 =====
      {
        id: 'future-001',
        category: '実装予定',
        subcategory: 'バックアップ',
        title: 'バックアップ・リストア機能',
        content: 'JSON/CSV形式でのデータエクスポート、定期バックアップスケジュール設定（推定1時間）',
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250813.md', line: 96 },
        date: '2025-08-14',
        priority: 'important',
        status: 'pending',
        tags: ['バックアップ', '次期実装']
      },
      {
        id: 'future-002',
        category: '実装予定',
        subcategory: 'API連携',
        title: '外部システムAPI連携',
        content: 'API認証設定、Webhook設定、データマッピング、連携テスト機能（推定1時間）',
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250813.md', line: 113 },
        date: '2025-08-14',
        priority: 'important',
        status: 'pending',
        tags: ['API', '次期実装']
      },
      {
        id: 'future-003',
        category: '実装予定',
        subcategory: '監査',
        title: '監査ログ機能',
        content: '操作履歴の自動記録、ログ検索・フィルタリング、CSV出力（推定30分）',
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250813.md', line: 131 },
        date: '2025-08-14',
        priority: 'info',
        status: 'pending',
        tags: ['監査', '次期実装']
      },
      {
        id: 'future-004',
        category: '実装予定',
        subcategory: 'バッチ処理',
        title: 'バッチ処理スケジューラー',
        content: '定期処理ジョブの設定、実行履歴表示、エラー通知（推定30分）',
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250813.md', line: 148 },
        date: '2025-08-14',
        priority: 'info',
        status: 'pending',
        tags: ['バッチ', '次期実装']
      },
      
      // ===== 面談予約システム データベース構築 =====
      {
        id: 'db-reservation-001',
        category: '面談予約システム',
        subcategory: 'データベース構築',
        title: '面談予約システム データベース実装完了',
        content: `
【実装日】2025年1月16日

【実装内容】
1. Prismaスキーマ定義完了
   - InterviewReservation（面談予約テーブル）
   - InterviewReservationLog（操作ログテーブル）
   - InterviewNotificationQueue（通知キューテーブル）
   
2. データ永続化処理実装
   - Prismaクライアント設定（src/lib/database/prisma.ts）
   - CRUD操作クラス（src/lib/database/interviewReservationDb.ts）
   - トランザクション処理、ログ記録機能

3. 開発環境設定
   - SQLiteデータベース設定（開発用）
   - .env設定ファイル作成
   - DATABASE_URL="file:./dev.db"

【本番環境移行時の注意】
- prisma/schema.prismaのdatasourceをPostgreSQLに変更
- .envのDATABASE_URLをPostgreSQL接続文字列に変更
- npx prisma migrate deployでマイグレーション実行

【関連ファイル】
- prisma/schema.prisma（スキーマ定義）
- src/lib/database/interviewReservationDb.ts（DB操作）
- src/app/api/interviews/reservations/（APIエンドポイント）
- docs/database/interview_reservation_schema.md（設計書）
        `,
        source: { type: 'file', path: '/prisma/schema.prisma', line: 487 },
        date: '2025-01-16',
        priority: 'critical',
        status: 'completed',
        tags: ['データベース', 'Prisma', '面談予約', '永続化']
      },
      {
        id: 'db-reservation-002',
        category: '面談予約システム',
        subcategory: 'DB構築時実装再開',
        title: '【重要】DB構築時実装再開指示書',
        content: `
【作成日】2025年1月16日
【状態】DB構築前準備完了

【完了済み】
✅ フロントエンド（ダッシュボード・手動予約モーダル）
✅ APIエンドポイント（CRUD・統計・一括処理）
✅ データベーススキーマ（Prisma定義）
✅ データ永続化クラス（DB操作処理）

【DB構築時の作業手順】
1. データベース環境設定
   - PostgreSQL: .envのDATABASE_URL変更
   - SQLite（開発）: そのまま使用可能

2. マイグレーション実行
   - npx prisma generate
   - npx prisma migrate dev --name init

3. APIとDBの接続
   - /api/interviews/reservations/配下のファイル
   - メモリ配列からInterviewReservationDbクラスに切り替え

4. 動作確認
   - 手動予約の作成・表示・更新・削除
   - VoiceDrive連携テスト

【詳細指示書】
/docs/database-implementation-guide-20250116.md
        `,
        source: { type: 'file', path: '/docs/database-implementation-guide-20250116.md' },
        date: '2025-01-16',
        priority: 'critical',
        status: 'pending',
        tags: ['DB構築', '実装再開', '面談予約']
      },
      {
        id: 'db-reservation-003',
        category: '面談予約システム',
        subcategory: 'データベース移行',
        title: 'データベースマイグレーション手順',
        content: `
【開発環境でのテスト】
1. npx prisma generate（Prismaクライアント生成）
2. npx prisma migrate dev --name init（初回マイグレーション）
3. npx prisma studio（データ確認）

【本番環境への移行】
1. PostgreSQLデータベースを準備
2. .envのDATABASE_URLを本番DB接続文字列に変更
3. prisma/schema.prismaのproviderを"postgresql"に変更
4. npx prisma migrate deploy（本番マイグレーション）
5. APIエンドポイントの動作確認

【注意事項】
- SQLiteとPostgreSQLの型の違いに注意
- @db.VarChar等のPostgreSQL固有の属性は削除済み
- 配列型はJSON型に変更済み（SQLite対応）
        `,
        source: { type: 'file', path: '/src/lib/database/migrations/001_create_interview_reservations.sql' },
        date: '2025-01-16',
        priority: 'important',
        status: 'pending',
        tags: ['マイグレーション', 'PostgreSQL', 'SQLite']
      },
    ];
  }

  getAllMemos(): DevelopmentMemo[] {
    return this.memos;
  }

  getMemosByCategory(category: string): DevelopmentMemo[] {
    return this.memos.filter(memo => memo.category === category);
  }

  getMemosByStatus(status: string): DevelopmentMemo[] {
    return this.memos.filter(memo => memo.status === status);
  }

  getMemosByPriority(priority: string): DevelopmentMemo[] {
    return this.memos.filter(memo => memo.priority === priority);
  }

  searchMemos(keyword: string): DevelopmentMemo[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.memos.filter(memo => 
      memo.title.toLowerCase().includes(lowerKeyword) ||
      memo.content.toLowerCase().includes(lowerKeyword) ||
      memo.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  getCategories(): string[] {
    return [...new Set(this.memos.map(memo => memo.category))];
  }

  getStatistics() {
    const total = this.memos.length;
    const byStatus = {
      pending: this.memos.filter(m => m.status === 'pending').length,
      in_progress: this.memos.filter(m => m.status === 'in_progress').length,
      completed: this.memos.filter(m => m.status === 'completed').length,
      archived: this.memos.filter(m => m.status === 'archived').length,
    };
    const byPriority = {
      critical: this.memos.filter(m => m.priority === 'critical').length,
      important: this.memos.filter(m => m.priority === 'important').length,
      info: this.memos.filter(m => m.priority === 'info').length,
    };
    const byCategory = this.getCategories().map(cat => ({
      name: cat,
      count: this.getMemosByCategory(cat).length,
    }));

    return { total, byStatus, byPriority, byCategory };
  }
}

export const developmentMemoService = new DevelopmentMemoService();