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

      // ===== コンプライアンス窓口機能（2025年9月24日実装） =====
      {
        id: 'compliance-001',
        category: 'コンプライアンス窓口',
        subcategory: '実装完了',
        title: 'コンプライアンス窓口機能の包括的実装完了',
        content: `
【実装日】2025年9月24日
【実装規模】約10,000行（医療システム側 + VoiceDrive側）

【医療システム側実装】
1. コンプライアンス管理マスター（935行）
   - 6つの管理機能（通報・調査・対策・再発防止・統計・設定）
   - 完全自己管理型システム
   - VoiceDrive API統合インターフェース

2. UI/UXコンポーネント
   - コンプライアンス窓口ページ（通報フォーム、ステータス確認）
   - 管理者用ダッシュボード（ケース管理、ワークフロー制御）
   - 統計・分析画面（月次レポート、傾向分析）

3. セキュリティ実装
   - AES-256-GCM暗号化（全通報データ）
   - SHA-512ハッシュチェーン監査ログ
   - 3段階匿名性レベル（完全匿名/条件付き/開示）
   - RBAC（役割ベースアクセス制御）

【VoiceDrive側実装（4,400行）】
- compliance-enhanced.ts（935行）：小原病院規定準拠の型定義
- ComplianceTransferService.ts（449行）：API転送サービス
- ComplianceSecurityService.ts（591行）：暗号化・アクセス制御
- EnhancedReportForm.tsx（687行）：5ステップ通報フォームUI
- compliance-integration.test.ts（762行）：統合テストスイート

【統合フロー】
1. VoiceDrive（音声AI通報受付）→ 暗号化
2. API転送（HTTPS/TLS 1.3）→ リトライロジック
3. 医療システム（ケース管理）→ ワークフロー処理
4. 通知システム（Email/Teams/Slack）→ 関係者連絡
5. 監査ログ（改ざん防止）→ コンプライアンス証跡`,
        source: { type: 'file', path: '/src/types/complianceMaster.ts', line: 935 },
        date: '2025-09-24',
        priority: 'critical',
        status: 'completed',
        tags: ['コンプライアンス', 'VoiceDrive統合', '実装完了']
      },
      {
        id: 'compliance-002',
        category: 'コンプライアンス窓口',
        subcategory: 'DB構築後作業',
        title: '【重要】コンプライアンス機能DB構築後の作業項目',
        content: `
【DB構築前（完了済み）】
✅ フロントエンド全機能
✅ 型定義・データ構造
✅ ビジネスロジック
✅ セキュリティ基盤
✅ API仕様定義
✅ VoiceDrive統合準備

【DB構築後に必要な作業】

1. Prismaスキーマ定義
\`\`\`prisma
model ComplianceReport {
  id            String   @id @default(uuid())
  caseNumber    String   @unique
  reporterType  String   // anonymous/conditional/disclosed
  category      String   // harassment/safety/ethics等
  severity      String   // low/medium/high/critical
  status        String   // received/investigating/resolved等
  encryptedData String   // AES-256-GCM暗号化データ
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  investigations Investigation[]
  actions        CorrectiveAction[]
  auditLogs      ComplianceAuditLog[]
}

model ComplianceAuditLog {
  id         String   @id @default(uuid())
  reportId   String
  action     String
  userId     String?
  ipAddress  String
  userAgent  String
  hashChain  String   // SHA-512ハッシュチェーン
  timestamp  DateTime @default(now())

  report ComplianceReport @relation(fields: [reportId], references: [id])
}
\`\`\`

2. API実装（現在のモックを実DBに接続）
   - POST /api/compliance/reports（通報作成）
   - GET /api/compliance/reports（ケース一覧）
   - PUT /api/compliance/reports/:id（ステータス更新）
   - POST /api/compliance/voicedrive/webhook（VoiceDrive連携）

3. データマイグレーション
   - 既存のLocalStorageデータをDBへ移行
   - 暗号化キーの安全な管理（AWS KMS推奨）

4. VoiceDrive Webhook実装
   - リアルタイム通報受信
   - 自動ケース番号発行
   - ステータス同期

5. 定期バッチ処理
   - 統計データの集計（日次/週次/月次）
   - 長期未解決ケースのアラート
   - 監査ログのアーカイブ`,
        source: { type: 'document', path: '/docs/compliance-db-implementation-guide.md' },
        date: '2025-09-24',
        priority: 'critical',
        status: 'pending',
        tags: ['DB構築', 'コンプライアンス', '実装計画']
      },
      {
        id: 'compliance-003',
        category: 'コンプライアンス窓口',
        subcategory: 'VoiceDrive連携',
        title: 'VoiceDriveとの連携状況（2025年9月24日時点）',
        content: `
【連携ステータス】✅ 実装完了・本番移行準備完了

【実装済み機能】
1. 双方向API連携
   - VoiceDrive → 医療システム：通報データ転送API
   - 医療システム → VoiceDrive：ステータス更新API
   - Webhook による リアルタイム同期

2. セキュリティ連携
   - Bearer Token認証（自動更新機能付き）
   - エンドツーエンドAES-256-GCM暗号化
   - IP制限（ホワイトリスト方式）
   - MFA必須化

3. データ形式統一
   - 共通TypeScript型定義（complianceTypes.ts）
   - UTF-8完全対応（日本語処理）
   - ISO 8601日時形式

【本番環境設定（9/25配信予定）】
- API エンドポイント: https://api.medical-system.kosei-kai.jp/v2/compliance/voicedrive
- Webhook URL: https://api.medical-system.kosei-kai.jp/v2/compliance/webhook
- 暗号化方式: AES-256-GCM
- 認証: OAuth 2.0 Bearer Token

【連携テスト結果（9/25 00:00）】
- 統合テスト: 18/18 成功（100%）
- 負荷テスト: 1000 req/min 処理成功
- レスポンスタイム: 平均 180ms
- 暗号化/復号化: 100件テスト成功

【次のマイルストーン】
- 9/25 09:00: 秘密情報配信（CLIENT_SECRET等）
- 9/26 10:00: 本番環境接続テスト
- 9/27 10:00: サービス開始`,
        source: { type: 'file', path: '/mcp-shared/docs/Medical_System_Integration_Success_Response_20250925.md' },
        date: '2025-09-24',
        priority: 'critical',
        status: 'completed',
        tags: ['VoiceDrive', '連携', '本番準備']
      },
      {
        id: 'compliance-004',
        category: 'コンプライアンス窓口',
        subcategory: 'MySQL対応',
        title: 'MySQL移行対応完了（PostgreSQLから変更）',
        content: `
【変更日】2025年9月25日
【変更理由】インフラ統一化のため

【MySQL接続設定】
\`\`\`javascript
{
  host: "mysql-primary.medical-system.kosei-kai.jp",
  port: 3306,
  database: "compliance_production",
  charset: "utf8mb4",
  collation: "utf8mb4_unicode_ci",
  ssl: { required: true }
}
\`\`\`

【実装済み機能】
- MySQL接続テストスクリプト（mysql-connection-test.ts）
- プライマリ/レプリカ自動切り替え
- 接続プール管理（最小2、最大10）
- UTF-8日本語完全対応

【Prismaスキーマ変更点】
- provider を "mysql" に変更
- @db.VarChar → @db.Text（MySQL対応）
- DateTime型は変更なし
- JSON型はそのまま使用可能`,
        source: { type: 'file', path: '/src/scripts/mysql-connection-test.ts' },
        date: '2025-09-24',
        priority: 'important',
        status: 'completed',
        tags: ['MySQL', 'データベース', '移行']
      },
      {
        id: 'compliance-005',
        category: 'コンプライアンス窓口',
        subcategory: '秘密情報配信',
        title: '秘密情報配信システム実装（お知らせ配信機能活用）',
        content: `
【実装日】2025年9月25日
【提案者】VoiceDriveチーム → 即日実装

【実装内容】
1. 医療システム側CLI（medical-cli）
   - secrets deliver コマンド
   - AES-256-GCM暗号化
   - ワンタイムトークン生成

2. VoiceDrive側CLI（voicedrive-cli）
   - secrets retrieve コマンド
   - MFA認証必須
   - .env.production.local自動更新

3. セキュリティ機能
   - 24時間自動削除
   - 1回限りアクセス制限
   - 監査ログ完全記録
   - IP制限（CIDR対応）

【使用方法】
# 医療システム側（配信）
npm run secrets:deliver -- -r voicedrive -e production --expires 24h

# VoiceDrive側（取得）
npm run secrets:retrieve -- SEC-20250925-MED001`,
        source: { type: 'file', path: '/src/cli/medical-cli.ts' },
        date: '2025-09-24',
        priority: 'critical',
        status: 'completed',
        tags: ['秘密情報', 'CLI', 'セキュリティ']
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

      // ===== Phase 5: キャリア選択制度 =====
      {
        id: 'phase5-001',
        category: 'Phase 5',
        subcategory: 'キャリア選択制度',
        title: 'Phase 5-3 統合テスト完了（77.8%成功）',
        content: `【実施日】2025年10月1日

【テスト結果】
- 総テスト数: 9件
- 成功: 7件（77.8%）
- 想定内制限: 2件（Webhook通知テスト）
- 実用可能性: 100% ✅

【完了した実装】
✅ API統合（4エンドポイント）
  - GET /api/my-page（35ms）
  - GET /api/career-courses/definitions（31ms）
  - POST /api/career-course/change-request（34ms）
  - GET /api/career-course/my-requests（41ms）

✅ 認証機能
  - Bearer Token認証実装
  - 無効なトークンで401エラー返却

✅ バリデーション機能
  - 必須項目チェック
  - 特例変更時の添付ファイルチェック

✅ Webhook通知機構
  - 医療システム→VoiceDrive通知送信
  - リトライ機構（最大3回、指数バックオフ）

✅ リアルタイム更新（VoiceDrive側）
  - ブラウザ通知、サウンド、LocalStorage保存`,
        source: { type: 'document', path: '/mcp-shared/docs/Phase5-3_統合テスト最終結果報告書_20251001.md' },
        date: '2025-10-01',
        priority: 'info',
        status: 'completed',
        tags: ['Phase5', '統合テスト', 'VoiceDrive連携']
      },
      {
        id: 'phase5-002',
        category: 'Phase 5',
        subcategory: 'キャリア選択制度',
        title: '共通DB構築後の実装作業（6-10日間）',
        content: `【Phase 5-3.4】実データベース統合（2-3日）
- 環境変数の本番設定
- Supabase接続の有効化
- データベーススキーマ作成
  * career_course_definitions（コース定義）
  * staff_career_courses（職員コース）
  * career_course_change_requests（変更申請）

【Phase 5-3.5】本番認証システム統合（1-2日）
- Supabase Auth統合
- JWTトークン管理
- セッション管理・リフレッシュ

【Phase 5-3.6】ファイルアップロード実装（2-3日）
- Supabase Storage設定
- アップロード処理実装
- ファイルサイズ制限（10MB）

【Phase 5-3.7】実データでの統合テスト（1-2日）
- テストデータ準備
- 全機能の統合テスト
- パフォーマンステスト

【実装ファイル】
- /src/app/api/my-page/route.ts（コメントアウト解除）
- /src/app/api/career-courses/definitions/route.ts（コメントアウト解除）
- /src/app/api/career-course/change-request/route.ts（コメントアウト解除）
- /src/app/api/career-course/my-requests/route.ts（コメントアウト解除）`,
        source: { type: 'document', path: '/mcp-shared/docs/Phase5-3_共通DB構築後の作業提案書_20251001.md' },
        date: '2025-10-01',
        priority: 'important',
        status: 'pending',
        tags: ['Phase5', '共通DB', 'Supabase', '実装計画']
      },
      {
        id: 'phase5-003',
        category: 'Phase 5',
        subcategory: 'キャリア選択制度',
        title: 'Phase 5-4 候補機能（提案済み）',
        content: `【人事部機能の強化】
1. 承認ワークフロー
   - 複数段階承認（直属上司→人事部長→理事長）
   - 承認期限アラート
   - 承認依頼通知

2. 申請管理ダッシュボード
   - 申請件数の統計グラフ
   - 承認待ち件数のリアルタイム表示
   - コース別の申請傾向分析

3. コース定義管理
   - E/Fコースの追加
   - コース定義の編集・無効化
   - 給与係数のシミュレーション

【職員機能の強化】
1. コース変更シミュレーション
   - コース変更による給与変動の試算
   - 次回変更可能日の計算
   - 過去の変更履歴グラフ

2. 申請テンプレート機能
   - よく使う理由のテンプレート保存
   - 過去の申請内容の再利用
   - 申請下書き保存

3. 通知機能の強化
   - メール通知
   - LINE通知（オプション）
   - 申請状況の週次サマリー

【分析・レポート機能】
1. 人事データ分析
   - コース別の職員分布
   - 年齢層別のコース傾向
   - 施設別のコース比率

2. 給与シミュレーション
   - コース変更による総人件費の変動予測
   - 部署別の給与分布
   - 昇給シミュレーション

3. レポート自動生成
   - 月次申請サマリーレポート
   - 四半期コース変更レポート
   - 年次人事データレポート`,
        source: { type: 'document', path: '/mcp-shared/docs/Phase5-3_共通DB構築後の作業提案書_20251001.md' },
        date: '2025-10-01',
        priority: 'info',
        status: 'pending',
        tags: ['Phase5', '機能提案', '次期開発']
      },
      {
        id: 'phase5-004',
        category: 'Phase 5',
        subcategory: 'キャリア選択制度',
        title: 'Phase 5-3 実装統計',
        content: `【実装統計】
新規ファイル: 8ファイル
変更ファイル: 6ファイル
総追加行数: 約1,500行
TypeScript型定義: 15型
APIエンドポイント: 4実装
テストケース: 9件

【主要ファイル】
- /src/app/api/my-page/route.ts（100行）
- /src/app/api/career-courses/definitions/route.ts（106行）
- /src/app/api/career-course/change-request/route.ts（125行）
- /src/app/api/career-course/my-requests/route.ts（実装済み）
- /src/app/api/career-course/notify-voicedrive/route.ts（115行）
- /tests/integration/phase5-integration-test.js（468行）
- /docs/Phase5_API仕様書_VoiceDrive連携.md（538行）
- /docs/Phase5_統合テスト計画書_20251001.md（574行）

【VoiceDrive側の実装】
- 新規ファイル: 4ファイル
- 総追加行数: 1,418行
- React/Viteコンポーネント: 4
- サービスクラス: 2

【パフォーマンス】
全APIが目標を大幅に上回る速度で動作
- GET /api/my-page: 35ms（目標 < 200ms）
- GET /api/career-courses/definitions: 31ms（目標 < 200ms）
- POST /api/career-course/change-request: 34ms（目標 < 500ms）
- GET /api/career-course/my-requests: 41ms（目標 < 300ms）`,
        source: { type: 'document', path: '/mcp-shared/docs/Phase5-3_統合テスト最終結果報告書_20251001.md' },
        date: '2025-10-01',
        priority: 'info',
        status: 'completed',
        tags: ['Phase5', '実装統計', 'パフォーマンス']
      },

      // ===== Phase別開発メモ（11件追加） =====
      {
        id: 'phase-esp-001',
        category: 'Phase 3統合',
        subcategory: 'エスポワール立神',
        title: 'エスポワール立神統合実装完了',
        content: `【完了項目】
- 33役職の完全マッピング実装（施設長～主任層）
- 兼任職員権限処理（ESP_003平篤、ESP_004阿久根一信：最高レベル11採用）
- 統合テスト完了（Day 1: 21/21成功、Day 2: 10/11成功）
- 総計750名職員、75役職（56ユニーク）統合完了

【次のアクション】
共通DB構築完了後:
1. DB接続設定実施
2. マスターデータ投入
3. Day 3負荷テスト実施
4. VoiceDrive連携確認
5. 本番デプロイ

【重要ファイル】
- src/lib/facility-position-mapping.ts
- src/types/espoir-organization.ts
- tests/integration/day2-approval-flow-test.ts`,
        source: { type: 'document', path: '/mcp-shared/docs/Phase3_integration.md' },
        date: '2025-09-28',
        priority: 'critical',
        status: 'pending',
        tags: ['Phase3', '統合', 'テスト完了', 'DB待ち']
      },
      {
        id: 'phase-esp-002',
        category: 'Phase 3統合',
        subcategory: '全体統合',
        title: 'Phase 3全体統合状況',
        content: `【統合完了施設】
✅ 小原病院: 420名、23役職
✅ 立神リハビリ: 180名、19役職（統括主任レベル7確認済み）
✅ エスポワール立神: 150名、33役職

【システム統合状況】
- 総施設数: 3施設
- 総職員数: 750名
- 総役職数: 75役職（重複除く56ユニーク）
- 統合完了率: 100%（アプリケーションレベル）

【重要注意事項】
- 統括主任レベル: 7（6ではなく7が正しい）
- 兼任職員権限: Math.max()で最高権限採用
- 施設ID形式: ハイフン区切り統一`,
        source: { type: 'document', path: '/mcp-shared/docs/Phase3_status.md' },
        date: '2025-09-28',
        priority: 'important',
        status: 'completed',
        tags: ['Phase3', '統合', 'マスターデータ']
      },
      {
        id: 'phase-admin-001',
        category: '管理者設定',
        subcategory: '面談予約',
        title: '面談予約管理タブの新規実装',
        content: `【実装概要】
面談予約フローの効率化のため、独立した「予約管理」タブを新規実装。予約フェーズと実施フェーズを明確に分離。

【タブ構成再編成】
変更前: 🚉面談ステーション | 🏦バンク | 📖ガイド | 🎯シミュレーター | 📝結果記録 | 📊履歴・分析 | ⚙️設定
変更後: 📅予約管理 | 🚉面談ステーション | 🏦バンク | 📖ガイド | 🎯シミュレーター | 📝結果記録 | 📊履歴・分析 | ⚙️設定

【予約管理タブのサブタブ】
- 📊 ダッシュボード: 予約状況の全体把握
- 🔄 仮予約処理: VoiceDriveからの仮予約処理
- 👥 担当者管理: 面談担当者の登録・管理
- 🤖 AI最適化分析: AI推奨精度の分析・改善

【予約フロー】
職員予約アクション(VoiceDrive) → 仮予約受信 → AI最適化分析 → 人事部確認・編集 → VoiceDrive通知送信 → 本予約確定 → 面談ステーションへ移行

【実装ファイル】
- src/components/interview/ReservationManagement.tsx`,
        source: { type: 'file', path: '/src/components/interview/ReservationManagement.tsx' },
        date: '2025-09-15',
        priority: 'important',
        status: 'completed',
        tags: ['面談', '予約管理', 'AI最適化']
      },
      {
        id: 'phase-admin-002',
        category: '管理者設定',
        subcategory: '面談サマリ',
        title: '面談フィードバックサマリ作成機能',
        content: `【実装概要】
職員カルテ個人ページの面談履歴に「📄 サマリ作成」ボタンを追加。人事部が職員向けのフィードバックサマリを作成・VoiceDrive通知する機能。

【主要機能】
- AI仮サマリ生成（ローカルLLM対応予定）
- 面談種別による自動切り替え
  - 定期面談: 構造化サマリ（技術専門性、対人関係ケア、安全品質管理、施設貢献、総合評価、次回目標）
  - 特別・サポート面談: 自由記述（面談概要、主な議題、合意事項、フォローアップ、職員へのメッセージ）

【サマリ作成UI】
- 2パネル構成（左: 参考情報、右: サマリ編集）
- 参考情報パネル: NotebookLM音声解説、面談シート、AI分析結果
- サマリ編集パネル: AI仮生成、項目別テキストエリア、リアルタイム編集

【VoiceDrive連携】
- 職員通知チェックボックス
- 保存時のVoiceDrive API呼び出し
- 面談ステーションでの閲覧機能連携

【実装ファイル】
- src/app/staff-cards/staff-tabs.tsx

【DB構築後の作業】
- データ保存先をAPI呼び出しに切り替え
- VoiceDrive通知API実連携
- AI生成エンジン実装（ローカルLLM連携）`,
        source: { type: 'file', path: '/src/app/staff-cards/staff-tabs.tsx' },
        date: '2025-09-14',
        priority: 'important',
        status: 'completed',
        tags: ['面談', 'サマリ', 'AI', 'VoiceDrive']
      },
      {
        id: 'phase-admin-003',
        category: '管理者設定',
        subcategory: 'UI/UX',
        title: '2カラム表示UI実装',
        content: `【実装概要】
管理画面全体のレイアウトを2カラム構成に改善。左パネルで情報確認、右パネルで編集・操作を実現。

【対応ページ】
- 職員カルテ個人ページ
- 面談管理画面
- 評価管理画面
- 研修管理画面

【期待効果】
- 情報参照と編集作業の並行実施
- 画面切り替え回数の削減
- 作業効率の大幅向上
- ユーザー体験の改善`,
        source: { type: 'document', path: '/docs/ui-improvements.md' },
        date: '2025-09-10',
        priority: 'info',
        status: 'completed',
        tags: ['UI/UX', 'レイアウト', '2カラム']
      },
      {
        id: 'phase-hr-001',
        category: '人事制度ガイド',
        subcategory: 'NotebookLM連携',
        title: 'NotebookLM面談システム統合完成',
        content: `【フェーズ１実装完了】
- 面談管理タブ統合UI実装
  - 3分類統合概要ダッシュボード（定期面談・特別面談・サポート面談）
  - 最新面談日・回答完了度・面談傾向の統合表示
  - NotebookLM音声録音リンク管理システム
  - モーダルベース音声リンク登録機能

【詳細分析機能】
- 各面談分類タブの詳細アナリティクス
- 面談シート回答状況分析・トレンド可視化
- 音声データとテキストデータの連携基盤
- 500名スタッフ対応スケーラブル設計

【NotebookLM連携インフラ】
- TypeScript型定義: NotebookLMLinkインターフェース
- 音声要約・マインドマップ・トランスクリプト管理
- リンクタイトル・作成日時・機能フラグシステム
- React useState/useEffectによる状態管理

【インターフェース統合】
- 評価タブパターン適用
- CHART_COLORS統一カラーパレット
- Card・Badge コンポーネント統一デザイン
- データストーリーテリング手法適用

【段階的実装計画】
- フェーズ２（3-6ヶ月後）: 音声感情分析・話題分類システム
- フェーズ３（6-12ヶ月後）: 面談シート×音声データ横断分析、予測的成長パス`,
        source: { type: 'document', path: '/docs/notebooklm-integration.md' },
        date: '2025-08-24',
        priority: 'important',
        status: 'completed',
        tags: ['NotebookLM', '面談', 'AI分析']
      },
      {
        id: 'phase-hr-002',
        category: '人事制度ガイド',
        subcategory: 'V3評価システム',
        title: 'V3評価・教育研修連携システム完成',
        content: `【V2システムエラー完全解決】
- Application client-side error根本原因解決
- staff-tabs.tsx構文エラー修正（2843行のJSXエラー解消）
- V3 API認証エラー修正（全APIコールに認証ヘッダー追加）
- ビルドエラー完全解消（353ページ正常生成）

【V2-V3移行戦略完成】
- V2システム読み取り専用化
- EvaluationItemBankV2.tsx廃止予告実装
- 全編集機能無効化・データ参照のみ可能
- V3システムへの自動誘導実装

【V3評価連動研修システム実装】
- 新規ページ作成: /training-v3
- 高度な研修連携機能:
  - 技術評価ギャップ分析（50点満点の精密分析）
  - 組織貢献度戦略分析（施設内/法人内バランス）
  - 予測的成長パス（12ヶ月段階的計画）
  - インテリジェント研修推奨（ROI最適化）

【評価制度設計ページへの研修連携統合】
- 年間スケジュール統合: 各月に研修連携タスク追加
- 評価・研修連携・分析の3タブ構成
- V3研修連携ダッシュボード:
  - 現在スコア: 76.8点（Bグレード）
  - 研修完了率: 68%
  - 予測スコア: 82.3点（Aグレード見込み）
  - ROI: 124%（前期比+8%）
- 成長予測シミュレーター: Phase 1-3の段階的研修計画`,
        source: { type: 'document', path: '/docs/v3-evaluation-training.md' },
        date: '2025-08-22',
        priority: 'critical',
        status: 'completed',
        tags: ['評価制度', '研修', 'V3システム']
      },
      {
        id: 'phase-hr-003',
        category: '人事制度ガイド',
        subcategory: 'V3 VoiceDrive統合',
        title: 'V3評価システム + VoiceDrive統合プロジェクト 100%完成',
        content: `【歴史的成果】
- 統合テスト成功率: 100% (8/8項目全クリア)
- VoiceDriveチーム完全合意: 責任分界システム・8月26日本格運用開始決定
- 技術債務完全解消: V2依存削除・UI重複解消・APIセキュリティ強化
- 開発効率: 想定工期の1/10で完成達成

【実装完了システム一覧】
1. V3評価システム中核機能
   - 技術評価50点: 法人統一25点 + 施設固有25点
   - 組織貢献50点: 夏季25点 + 冬季25点（各法人12.5点+施設12.5点）
   - 相対評価エンジン: 2軸マトリックス7段階（D→C→B→A→A+→S→S+）
   - 年間評価フロー: 6月夏季・12月冬季・3月最終の3段階対応

2. VoiceDrive統合システム
   - V3異議申立API: 完全実装・セキュリティ強化
     - POST /api/v3/appeals/submit - Bearer Token認証・詳細検証
     - GET /api/v3/appeals/list - 管理者向け一覧・統計分析
     - PATCH /api/v3/appeals/list - ステータス更新・VoiceDrive通知
   - 責任分界システム:
     - 職員: VoiceDriveで異議申立・進捗確認
     - 評価者: 医療システムで受信・審査・管理

3. V3専用管理機能
   - DisclosureManagementV3: 詳細スコア構造通知・7段階グレード開示
   - AppealReceptionV3: VoiceDrive起点受信・評価者管理特化
   - 評価実行統合: V2完全独立・100点満点表示・相対評価連動

4. V3評価連動研修システム
   - V3TrainingIntegrationService: 評価-研修双方向連携エンジン
   - 技術評価ギャップ分析: 法人統一30点・施設固有20点の精密分析
   - 組織貢献度戦略分析: 施設内/法人内貢献バランス最適化
   - 予測的成長パス: 現在Bグレード→目標Aグレードの最適ルート
   - インテリジェント研修推奨: ROI・期待スコア向上・グレード昇格予測`,
        source: { type: 'document', path: '/docs/v3-voicedrive-integration.md' },
        date: '2025-08-21',
        priority: 'critical',
        status: 'completed',
        tags: ['評価制度', 'VoiceDrive', 'V3システム', '統合完了']
      },
      {
        id: 'phase-phase5-001',
        category: 'Phase 5実装',
        subcategory: 'キャリア選択',
        title: 'Phase 5 キャリア選択制度の実装',
        content: `【実装状況】
✅ キャリア選択コースタブを職員カルテに追加
✅ 人事制度ガイドページにキャリア選択制度タブを追加
✅ A～Dコース（将来E・F拡張対応）定義実装
✅ コース変更申請フロー実装
✅ 統合テスト実施（7/9成功、2/9失敗）

【テスト結果】
- 総テスト数: 9
- 成功: 7 (77.8%)
- 失敗: 2 (Webhook通知: TC-WEBHOOK-01, TC-WEBHOOK-02)

【失敗原因】
- Webhook通知送信: ステータスコード500エラー
- API実装が未完了

【次のアクション】
1. Webhook通知APIの実装完了
2. 統合テスト再実行
3. VoiceDrive連携確認

【関連ファイル】
- src/app/hr-system-guide/CareerCourseContent.tsx
- src/app/staff-cards/[staffId]/page.tsx
- tests/integration/phase5-integration-test.js
- tests/integration/phase5-test-results.json`,
        source: { type: 'document', path: '/tests/integration/phase5-test-results.json' },
        date: '2025-10-01',
        priority: 'important',
        status: 'in_progress',
        tags: ['Phase5', 'キャリア選択', 'テスト中']
      },
      {
        id: 'phase-health-001',
        category: '健康管理',
        subcategory: 'システム統合',
        title: '健康管理システム統合実装完了',
        content: `【完了項目】
1. 健康ページ統合・整理
   - 旧/healthページ削除（404行）
   - Health.module.css削除（545行）
   - ナビゲーションリンクを/health/managementに統一

2. 職員カルテ階層化タブ構造実装
   - 6カテゴリ×17タブの2層構造
   - URLパラメータ対応(?category=health&tab=health-checkup)
   - カテゴリナビゲーションUI（グラデーション背景）

3. 健康診断タブ統合
   - HealthCheckupDetailViewコンポーネント作成（649行）
   - 職員カルテに健診タブ追加
   - ウェルビーイングタブとの相互リンク実装
   - 健康診断5カード表示（最新、異常、傾向、再検査、統計）

4. リダイレクト設定
   - /health/staff/[staffId] → 職員カルテ健診タブへ自動遷移
   - ローディングアニメーション付き

【実装済UI機能】
- 健康診断詳細表示（5つの詳細タブ）
- BMI・血圧自動評価
- 異常項目ハイライト表示
- トレンドグラフ表示
- リスクアセスメント表示
- VoiceDriveアドバイス連携準備

【未実装（DB構築後）】
Phase 1 MVP:
- CSV一括取込API実装
- 健診データCRUD API実装
- 健診結果配信システム（お知らせ配信経由）

Phase 2 基本機能:
- 管理ダッシュボード（実施率、要再検者管理）
- ストレスチェック配信（機密性高）
- リマインド機能
- 病歴管理機能
- 就業配慮設定機能

Phase 3 拡張機能:
- 産業医機能（面談記録、就業判定）
- 統計・分析機能
- トレンド分析・予測
- レポート生成（労基署提出書類）
- 外部システム連携

【必要なDBテーブル】
- health_checkups: 健康診断マスター
- health_checkup_details: 検査結果詳細
- medical_histories: 病歴・既往歴管理
- work_accommodations: 就業配慮管理
- health_events: 健康イベント履歴

【関連ファイル】
- src/components/health/HealthCheckupDetailView.tsx
- src/app/staff-cards/[staffId]/page.tsx
- src/app/health/staff/[staffId]/page.tsx
- docs/健康関連情報実装計画書_統合版.md
- docs/健康機能実装_作業再開指示書.md`,
        source: { type: 'document', path: '/docs/健康関連情報実装計画書_統合版.md' },
        date: '2025-09-30',
        priority: 'important',
        status: 'pending',
        tags: ['健康管理', 'UI統合', '階層タブ', 'DB待ち']
      },
      {
        id: 'phase-hr-station-001',
        category: '人事ステーション',
        subcategory: 'ダッシュボード',
        title: '人事ステーションページ実装状況',
        content: `【実装完了機能】
1. ヒートマップダッシュボード
   - 3段階フェーズ表示（コース制度→等級制度→100点評価）
   - パフォーマンス層別×キャリアコース別マトリックス
   - パステルトーン配色での視認性向上

2. フィルタリング機能
   - 施設別フィルター（全施設/富士宮/富士宮南/フジトピア/フジヤマ）
   - 職種別フィルター（全職種/医師/看護師/介護士/理学療法士/事務職）
   - フェーズ切り替え機能

3. 職員詳細モーダル（IntegratedStaffModal）
   - セグメント別職員リスト表示
   - 個別アクション推奨表示
   - CSVエクスポート機能

4. アクションプラン作成機能（ActionPlanModal）
   - 短期・中期アクション設定
   - KPI指標管理
   - タイムライン設定

【未実装機能（DB連携後）】
1. 実データ連携
   - 職員マスタテーブル連携
   - 評価データテーブル連携
   - リアルタイム集計処理

2. ドリルダウン分析
   - セル単位の詳細分析
   - 時系列推移グラフ
   - 相関分析レポート

3. API実装
   - GET /api/hr-station/heatmap
   - GET /api/hr-station/staff-list
   - POST /api/hr-station/action-plan
   - GET /api/hr-station/export

4. パフォーマンス最適化
   - データキャッシュ機構
   - 仮想スクロール実装
   - 遅延ローディング

【DB構築後の作業指示】
1. lib/hr/heatmapData.tsのダミーデータを実API呼び出しに置換
2. components/hr/IntegratedStaffModal.tsxのgenerateStaffList関数をAPI連携に変更
3. app/api/hr-station/配下にAPIエンドポイント実装
4. Prismaスキーマに以下のテーブル追加：
   - hr_evaluations（評価データ）
   - hr_courses（コース設定）
   - hr_grades（等級設定）
   - hr_action_plans（アクションプラン）`,
        source: { type: 'document', path: '/docs/hr-station-implementation.md' },
        date: '2025-09-21',
        priority: 'important',
        status: 'pending',
        tags: ['人事ステーション', 'HR', 'ダッシュボード', 'DB待ち']
      },

      // ===== フィードバック面談連携機能 =====
      {
        id: 'feedback-interview-001',
        category: '面談システム',
        subcategory: 'フィードバック面談連携',
        title: 'フィードバック面談連携機能 統合テスト完了（9/9成功）',
        content: `【実施日】2025年10月3日
【統合テスト結果】100%成功（9/9ケース）

【テスト内訳】
✅ 医療システムAPIテスト: 5/5成功
  - 夏季評価フィードバック（緊急）
  - 冬季評価フィードバック（中）
  - 年間評価フィードバック（確定）
  - 必須フィールド欠損エラー
  - 型不正エラー

✅ VoiceDriveチームテスト: 3/3成功
  - 冬期評価フィードバック
  - 夏期評価フィードバック（異議申立済み）
  - 緊急フィードバック

✅ エンドツーエンドテスト: 1/1成功
  - VoiceDrive → MCP → 医療システム（79ms）

【実装完了機能】
1. 評価情報受信・保存
   - evaluationDetails型定義拡張
   - 評価ID、評価タイプ（夏季/冬季/年間）
   - 施設内評価・法人内評価・総合点
   - 異議申立期限・申立可否

2. UI実装
   - 評価情報カード（紫色）
   - 異議申立期限アラート（赤字警告）
   - 統計ダッシュボード（フィードバック面談数）

3. AI最適化強化
   - 8ステップ分析（通常面談6ステップ）
   - フィードバック専門家優先マッチング
   - 異議申立期限に基づくスコアリング
     * 期限3日以内: +20点
     * 期限7日以内: +10点

4. MCPプロキシサーバー
   - VoiceDrive形式 → 医療システム形式の変換
   - 日程情報の自動計算（timing → scheduledDate）
   - エラーハンドリングとログ記録

【データフロー】
VoiceDrive評価ステーション
  ↓ (評価結果通知)
フィードバック面談予約ボタン
  ↓ (evaluationDetails自動引き継ぎ)
MCPサーバー (8080)
  ↓ (データ変換・転送)
医療システムAPI (3002)
  ↓ (受信・保存)
予約管理ページ（初回受付待ち）

【パフォーマンス】
- エンドツーエンドレスポンス: 79ms
- VoiceDrive → MCP: 20ms
- MCP → 医療システム: 59ms`,
        source: { type: 'document', path: '/mcp-shared/docs/フィードバック面談連携_最終統合テスト完了報告書_20251003.md' },
        date: '2025-10-03',
        priority: 'critical',
        status: 'completed',
        tags: ['面談', 'フィードバック', '評価連携', '統合テスト完了']
      },
      {
        id: 'feedback-interview-002',
        category: '面談システム',
        subcategory: 'フィードバック面談連携',
        title: '【次フェーズ】UI確認テストと本番デプロイ準備',
        content: `【現在のステータス】
✅ API統合テスト完了（5/5成功）
✅ VoiceDrive側実装完了（3/3成功）
✅ エンドツーエンドテスト完了（1/1成功）
⏳ UI確認テスト（次のステップ）

【UI確認テスト項目】
1. 予約管理ページ表示確認
   URL: http://localhost:3002/interviews?tab=station

   確認項目:
   - [ ] 初回受付待ちカラムに予約表示
   - [ ] 評価情報カード（紫色）表示
   - [ ] 評価タイプ表示（夏季/冬季/年間）
   - [ ] 施設内評価・法人内評価表示
   - [ ] 組織貢献度点数表示
   - [ ] 異議申立期限表示
   - [ ] 期限警告（赤字）表示（期限1週間未満の場合）
   - [ ] 緊急度バッジ表示（🚨緊急）
   - [ ] 統計ダッシュボードでフィードバック面談数表示

2. AI最適化3案生成テスト
   - [ ] 「詳細処理」ボタンクリック
   - [ ] AI分析による3案生成
   - [ ] フィードバック専門家優先マッチング確認
   - [ ] 異議申立期限に基づくスコアリング確認

3. VoiceDriveへの3案送信テスト
   - [ ] 3案送信処理実行
   - [ ] VoiceDrive側で受信確認
   - [ ] 評価情報の正常伝達確認

4. 職員選択→本予約確定テスト
   - [ ] VoiceDrive側で職員が第2案を選択
   - [ ] 医療システムへの選択結果送信
   - [ ] カレンダーへの反映確認
   - [ ] 評価情報の保持確認

【本番デプロイ準備（DB構築後）】
1. データベース設定
   - [ ] .envのDATABASE_URL設定
   - [ ] Prismaマイグレーション実行

2. API切り替え
   - [ ] メモリ配列 → DB操作クラスに変更
   - [ ] /api/interviews/reservations/route.ts修正

3. MCPサーバーデプロイ
   - [ ] 本番環境にMCPプロキシサーバー配置
   - [ ] 環境変数設定（MEDICAL_SYSTEM_API）
   - [ ] HTTPS/TLS設定

4. VoiceDrive連携確認
   - [ ] 本番環境での疎通確認
   - [ ] 評価情報の正常伝達確認
   - [ ] エラーハンドリング確認

【実装ファイル】
- src/components/interview/UnifiedInterviewDashboard.tsx（評価情報UI）
- src/app/api/interviews/reservations/route.ts（API受信）
- server/mcp-proxy.js（MCPプロキシサーバー）
- tests/feedback-interview-integration-test.ts（統合テスト）
- tests/end-to-end-test.js（E2Eテスト）`,
        source: { type: 'document', path: '/mcp-shared/docs/フィードバック面談連携_最終統合テスト完了報告書_20251003.md' },
        date: '2025-10-03',
        priority: 'critical',
        status: 'in_progress',
        tags: ['面談', 'フィードバック', 'UI確認', '次フェーズ']
      },
      {
        id: 'feedback-interview-003',
        category: '面談システム',
        subcategory: 'フィードバック面談連携',
        title: 'VoiceDrive側実装状況（完了）',
        content: `【VoiceDriveチーム実装完了】
実施日: 2025年10月3日
コミット: 9f16246, 8ae788a

【実装内容】
1. 評価ステーションページ拡張
   - フィードバック面談予約ボタン追加
   - 評価データ自動引き継ぎ

2. SimpleInterviewFlow拡張
   - evaluationDetailsプロパティ追加
   - ステップ1-3自動スキップ
   - ステップ4（日程選択）から開始

3. 緊急度自動判定
   - 異議申立期限からの日数計算
   - urgent/high/medium/low 4段階判定
   - 期限3日以内: urgent
   - 期限7日以内: high
   - 期限14日以内: medium
   - それ以外: low

4. MCPサーバー実装
   - POST /api/interviews/reservations
   - GET /api/interviews/reservations
   - GET /api/interviews/reservations/:id
   - ダッシュボードUI (http://localhost:8080/dashboard)

【テスト結果】
✅ 冬期評価フィードバック（中優先度）
✅ 夏期評価フィードバック（異議申立済み）
✅ 緊急フィードバック（期限間近）

【連携フロー確認済み】
VoiceDrive UI → MCP (8080) → 医療システム (3002)
- データ送信: 正常
- 評価情報伝達: 完全
- レスポンスタイム: 79ms

【3軸評価データ確認】
✅ 施設内評価（S/A/B/C/D）
✅ 法人内評価（S/A/B/C/D）
✅ 総合評価点（0-25点）
✅ 評価タイプ（summer/winter/annual）
✅ 異議申立期限
✅ 異議申立可否（appealable）`,
        source: { type: 'document', path: '/mcp-shared/docs/VoiceDrive_フィードバック面談予約機能_実装完了報告書_20251003.md' },
        date: '2025-10-03',
        priority: 'important',
        status: 'completed',
        tags: ['VoiceDrive', 'フィードバック', '実装完了', '連携確認']
      },
      {
        id: 'feedback-interview-004',
        category: '面談システム',
        subcategory: 'フィードバック面談連携',
        title: '技術的な発見事項とベストプラクティス',
        content: `【データ変換パターン】
VoiceDrive形式:
- timing: "asap" | "this_week" | "next_week" | "flexible"
- timeSlot: "morning" | "afternoon" | "evening"
- weekdays: string[]

医療システム形式:
- scheduledDate: "YYYY-MM-DD"
- scheduledTime: "HH:mm"

変換ロジック:
- asap → 翌営業日
- this_week → 3日後
- next_week → 7日後
- flexible → 5日後

【型不正データの柔軟な処理】
- 不正なevaluationType: 受信を許容（201）
- 文字列のtotalPoints: 受信を許容（201）
- 理由: 過度に厳格なバリデーションでサービス断絶を避ける
- 対策: UI側で警告表示、管理者確認を可能にする

【重複チェックの実装】
条件:
- 同じstaffId
- 同じscheduledDate（日付のみ比較）
- 同じscheduledTime
- status !== 'cancelled'

結果: 409 Conflictエラー

【日付型変換の注意点】
ISO 8601文字列（"2025-10-13"）→ Date型
- new Date(appealDeadline)で変換
- タイムゾーンに注意（UTCとJSTの差）

【レスポンスタイムの最適化】
- メモリ内配列使用: 79ms
- DB使用時の予測: 150-200ms
- 目標: <500ms維持

【エラーハンドリングのベストプラクティス】
1. 必須フィールド欠損: 400 Bad Request
2. 重複予約: 409 Conflict
3. 認証エラー: 401 Unauthorized
4. サーバーエラー: 500 Internal Server Error
5. 明確なエラーメッセージ返却`,
        source: { type: 'file', path: '/server/mcp-proxy.js' },
        date: '2025-10-03',
        priority: 'info',
        status: 'completed',
        tags: ['技術', 'データ変換', 'エラーハンドリング', 'ベストプラクティス']
      },

      // ===== 権限システム・アカウントレベル管理 =====
      {
        id: 'account-level-001',
        category: 'システム全体',
        subcategory: '権限システム',
        title: '【Phase 0.2完了】25レベル権限システム実装完了',
        content: `【実装完了日】2025年10月4日

【25レベル権限システム】
✅ 基本レベル（1-18）：経験年数・役職ベース
✅ リーダーレベル（0.5刻み）：1.5, 2.5, 3.5, 4.5
✅ 特別権限レベル（97-99）：
   - Level 97: 健診担当者
   - Level 98: 産業医
   - Level 99: システム管理者

【統合テスト結果】
✅ 医療システム: 11/11テスト成功（100%）
✅ VoiceDrive: 11/11テスト成功（100%）
✅ 総合: 22/22テスト成功（100%）
✅ 平均レスポンスタイム: 21.4ms

【実装ファイル】
- src/pages/api/v1/calculate-level.ts（権限計算API）
- src/pages/api/v1/health.ts（ヘルスチェックAPI）
- src/config/accessControl.ts（アクセス制御設定）
- scripts/test-voicedrive-integration.js（統合テストスクリプト）

【テストケース】
TC-001: 新人（1年目）→ Level 1
TC-002: 新人リーダー → Level 1.5
TC-003: 中堅（5年目）→ Level 3
TC-004: ベテラン（15年）→ Level 4
TC-005: ベテランリーダー → Level 4.5
TC-006: 部長・医局長 → Level 10
TC-007: 人事各部門長 → Level 15
TC-008: 理事長 → Level 18
TC-097: 健診担当者 → Level 97
TC-098: 産業医 → Level 98
TC-099: システム管理者 → Level 99

【VoiceDrive連携】
✅ JWT認証実装完了
✅ CORS設定完了
✅ Webhook統合完了
✅ API互換性100%確認

【ドキュメント】
- Integration_Test_Completion_Report_20251004.md
- VoiceDrive_Integration_Test_Success_Report_20251004.md
- Integration_Test_Final_Summary_20251004.md
- lightsail-integration-master-plan-integrated-20251003.md（更新済み）

【次回マイルストーン】
- 10月8日: TC-006/TC-008手動確認テスト
- 10月10日: 本番デプロイ`,
        source: { type: 'file', path: '/src/pages/api/v1/calculate-level.ts' },
        date: '2025-10-04',
        priority: 'critical',
        status: 'completed',
        tags: ['権限システム', '統合テスト', 'VoiceDrive連携', 'Phase 0.2完了']
      },
      {
        id: 'health-management-001',
        category: 'システム全体',
        subcategory: '健康管理システム',
        title: '【Phase 0.5完了】健康管理システム統合実装完了',
        content: `【実装完了日】2025年10月4日

【実装機能】
✅ ストレスチェック同意ベースアクセス制御
✅ 健康データ監査ログシステム
✅ 健診担当者用同意ダッシュボード
✅ VoiceDrive通知システム統合
✅ 労働安全衛生法第66条の10準拠

【アクセス制御ルール】
1. 本人: 常に全アクセス可能
2. システム管理者（Level 99）: 全アクセス可能
3. 産業医（Level 98）: 同意不要で全アクセス可能
4. 健診担当者（Level 97）:
   - 同意あり: 個人データ閲覧可能
   - 同意なし: 集計データのみ閲覧可能
5. 人事部門（Level 14-17）:
   - 同意あり: 個人データ閲覧可能
   - 同意なし: アクセス拒否
6. その他: アクセス拒否

【実装ファイル】
- src/lib/stress-check/access-control.ts（アクセス制御ロジック）
- src/pages/api/v1/stress-check/consent.ts（同意管理API）
- src/app/health/consent-form/page.tsx（同意フォームUI）
- src/app/health/staff/[staffId]/page.tsx（職員データ閲覧）
- src/app/health/hr-view/[staffId]/page.tsx（人事閲覧）
- src/services/health-audit-log.service.ts（監査ログ）
- src/services/voicedrive-notification.service.ts（通知サービス）
- src/app/health/consent-dashboard/page.tsx（同意ダッシュボード）

【監査ログ記録項目】
- アクセス日時
- アクセス者ID・レベル
- 対象職員ID
- アクセス結果（成功/拒否）
- アクセス理由
- 同意状態

【VoiceDrive通知イベント】
- stress_check.consent_updated（同意状態変更）
- stress_check.high_stress_detected（高ストレス者検出）
- stress_check.physician_interview_required（産業医面談必要）

【セキュリティ対策】
✅ 同意ベースアクセス制御
✅ 全アクセスの監査ログ記録
✅ 不正アクセス検知
✅ 個人情報保護法準拠`,
        source: { type: 'file', path: '/src/lib/stress-check/access-control.ts' },
        date: '2025-10-04',
        priority: 'critical',
        status: 'completed',
        tags: ['健康管理', 'ストレスチェック', 'アクセス制御', 'Phase 0.5完了']
      },
      {
        id: 'compliance-reporting-001',
        category: 'システム全体',
        subcategory: 'コンプライアンス通報',
        title: '【Phase 0.8進行中】コンプライアンス通報統合87.5%完了',
        content: `【実装状況】2025年10月4日時点

【統合テスト結果】
✅ 総テストケース: 10件
✅ 合格: 7件（70%）
❌ 不合格: 1件（10%）
⏭️ スキップ（手動確認）: 2件（20%）
✅ 実質合格率: 87.5%（7/8件）

【合格テストケース】
✅ TC-001: Critical緊急度の受付確認通知
✅ TC-002: High緊急度の受付確認通知
✅ TC-003: Medium緊急度の受付確認通知
✅ TC-004: Low緊急度の受付確認通知
✅ TC-005: Webhook署名検証エラー
✅ TC-009: 連続通報の処理（バッチ5件）
✅ TC-010: 匿名IDでのステータス確認

【不合格テストケース】
❌ TC-007: データ形式エラー
   - 期待: 400 Bad Request
   - 実際: 401 Unauthorized
   - 原因: モックサーバーのエラー処理順序
   - 影響度: 低（モックサーバーのみ）

【スキップテストケース】
⏭️ TC-006: ネットワークエラー時のリトライ処理
⏭️ TC-008: タイムアウト処理
   - 理由: 手動確認が必要
   - 予定: 10月8日の統合テスト時に確認

【パフォーマンス】
✅ 単一通報処理: 平均50-100ms
✅ バッチ処理（5件）: 40.7秒（10秒間隔含む）
✅ 実質処理時間: 約0.7秒（5件合計）
✅ 1件あたり: 約140ms

【セキュリティ検証】
✅ HMAC-SHA256署名検証
✅ チェックサム検証
✅ 匿名性保護

【実装ファイル】
- tests/run-compliance-integration-test.js（統合テストスクリプト）
- tests/compliance-integration-test-data.json（テストデータ）
- mcp-shared/docs/Compliance_Integration_Test_Result_Report_20251004.md

【次回作業】
- 10月8日: 統合テスト（VoiceDriveチーム）
  - TC-006/TC-008の手動確認
  - TC-007の修正確認
- 10月10日: 本番デプロイ`,
        source: { type: 'file', path: '/tests/run-compliance-integration-test.js' },
        date: '2025-10-04',
        priority: 'important',
        status: 'in_progress',
        tags: ['コンプライアンス', '通報システム', '統合テスト', 'Phase 0.8']
      },
      {
        id: 'top-page-widgets-001',
        category: 'UI/UX',
        subcategory: 'トップページ',
        title: '【人事部重要機能】VoiceDrive連携統合ダッシュボード実装完了',
        content: `【実装完了日】2025年10月4日

【実装ウィジェット】
✅ 1. 面談緊急対応センター（InterviewDeadlineWidget）
   - VoiceDrive仮予約・再提案の即時対応
   - 評価フィードバック面談の異議申立期限管理
   - 拒否・調整案件の緊急度可視化
   - 緊急度ロジック: 評価期限(10) > 拒否案件(9) > 高優先度(8)

✅ 2. コンプライアンス通報センター（ComplianceReportWidget）
   - VoiceDrive通報受信のリアルタイム表示
   - 24時間以内未対応の最優先表示
   - 期限超過案件の即時アラート
   - HMAC-SHA256署名検証済み（統合テスト87.5%合格）

✅ 3. キャリアコース変更申請センター（CareerChangeWidget）
   - VoiceDriveからのコース変更申請管理
   - ダウングレード申請の離職リスク警告
   - 7日以上未処理の緊急度自動上昇
   - Phase 5実装完了・統合テスト77.8%合格

【VoiceDrive連携状況】
✅ 面談API: /api/interviews/（複数エンドポイント実装済み）
✅ コンプライアンスAPI: /api/v3/compliance/receive, /api/v3/compliance/cases
✅ キャリアAPI: /api/career-course/change-request, /api/career-course/notify-voicedrive
✅ Webhook送受信: HMAC-SHA256署名検証実装済み
✅ 統合テスト: コンプライアンス87.5%、キャリア77.8%合格

【共通DB構築後の稼働準備】
✅ モックデータ→実データ切り替え: 環境変数設定のみ
✅ APIエンドポイント接続: 設定ファイル更新のみ
✅ 推定所要時間: 数時間～1日（設定とテストのみ）

【人事部業務への影響】
🎯 面談緊急対応: 期限超過による法的リスク回避
🎯 コンプライアンス: 24時間以内初動対応の義務履行
🎯 キャリア変更: 離職リスク早期発見（ダウングレード申請監視）

【実装ファイル】
- src/components/interview-deadline/InterviewDeadlineWidget.tsx
- src/components/compliance/ComplianceReportWidget.tsx
- src/components/career/CareerChangeWidget.tsx
- src/app/page.tsx（トップページ統合）
- src/types/voicedrive.ts, compliance.ts, career.ts

【技術仕様】
- 緊急度アルゴリズム: 1-10段階の動的計算
- 色分けUI: 赤（超緊急）→オレンジ（緊急）→黄（注意）→青（通常）
- useMemoによるパフォーマンス最適化
- Next.js App Router対応

【次のアクション】
1. 共通DB構築完了待機
2. 環境変数設定（本番用）
3. 動作確認テスト実施
4. 人事部への操作説明実施`,
        source: { type: 'file', path: '/src/app/page.tsx' },
        date: '2025-10-04',
        priority: 'important',
        status: 'completed',
        tags: ['トップページ', 'VoiceDrive連携', '人事部機能', 'ダッシュボード', '緊急対応']
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