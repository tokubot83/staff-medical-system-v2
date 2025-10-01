'use client';

import React, { useState } from 'react';
import {
  StickyNote, Calendar, Tag, Search,
  BookOpen, Code, Database, Bug, Lightbulb, CheckCircle,
  FileText, Users, MessageSquare, Heart, Clock, Filter,
  TrendingUp, AlertCircle, CheckCheck, XCircle
} from 'lucide-react';

interface DevMemo {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status: 'todo' | 'in-progress' | 'done' | 'waiting';
  priority: 'low' | 'medium' | 'high' | 'critical';
  phase?: string;
}

const devMemos: DevMemo[] = [
  // エスポワール立神統合 (開発者メモ.md)
  {
    id: 'esp-001',
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
    category: 'phase3',
    tags: ['統合', 'テスト完了', 'DB待ち', '重要'],
    createdAt: '2025-09-28',
    updatedAt: '2025-09-28',
    status: 'waiting',
    priority: 'critical',
    phase: 'Phase 3'
  },
  {
    id: 'esp-002',
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
    category: 'phase3',
    tags: ['統合', 'マスターデータ', '完了'],
    createdAt: '2025-09-28',
    updatedAt: '2025-09-28',
    status: 'done',
    priority: 'high',
    phase: 'Phase 3'
  },

  // 面談予約管理実装 (admin-settings-dev-memo.md)
  {
    id: 'admin-001',
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
    category: 'admin-settings',
    tags: ['面談', '予約管理', 'AI最適化', '完了'],
    createdAt: '2025-09-15',
    updatedAt: '2025-09-15',
    status: 'done',
    priority: 'high',
    phase: 'Admin Settings'
  },
  {
    id: 'admin-002',
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
    category: 'admin-settings',
    tags: ['面談', 'サマリ', 'AI', 'VoiceDrive連携'],
    createdAt: '2025-09-14',
    updatedAt: '2025-09-14',
    status: 'done',
    priority: 'high',
    phase: 'Admin Settings'
  },
  {
    id: 'admin-003',
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
    category: 'admin-settings',
    tags: ['UI/UX', 'レイアウト', '完了'],
    createdAt: '2025-09-10',
    updatedAt: '2025-09-10',
    status: 'done',
    priority: 'medium',
    phase: 'Admin Settings'
  },

  // NotebookLM面談システム統合 (人事制度ガイド開発メモ.md)
  {
    id: 'hr-001',
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
    category: 'hr-guide',
    tags: ['NotebookLM', '面談', 'AI分析', '完了'],
    createdAt: '2025-08-24',
    updatedAt: '2025-08-24',
    status: 'done',
    priority: 'high',
    phase: 'HR Guide'
  },
  {
    id: 'hr-002',
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
    category: 'hr-guide',
    tags: ['評価制度', '研修', 'V3システム', '完了'],
    createdAt: '2025-08-22',
    updatedAt: '2025-08-22',
    status: 'done',
    priority: 'critical',
    phase: 'HR Guide'
  },
  {
    id: 'hr-003',
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
    category: 'hr-guide',
    tags: ['評価制度', 'VoiceDrive', 'V3システム', '完了'],
    createdAt: '2025-08-21',
    updatedAt: '2025-08-21',
    status: 'done',
    priority: 'critical',
    phase: 'HR Guide'
  },

  // キャリア選択制度実装
  {
    id: 'phase5-001',
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
    category: 'phase5',
    tags: ['キャリア選択', 'コース制度', 'テスト中'],
    createdAt: '2025-10-01',
    updatedAt: '2025-10-01',
    status: 'in-progress',
    priority: 'high',
    phase: 'Phase 5'
  },

  // その他の開発タスク
  {
    id: 'general-001',
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
    category: 'health',
    tags: ['健康管理', 'UI統合', '階層タブ', 'DB待ち', '完了'],
    createdAt: '2025-09-30',
    updatedAt: '2025-09-30',
    status: 'waiting',
    priority: 'high',
    phase: 'Health System'
  },
  {
    id: 'general-002',
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
    category: 'hr-station',
    tags: ['人事ステーション', 'HR', 'ダッシュボード', 'DB連携待ち'],
    createdAt: '2025-09-21',
    updatedAt: '2025-09-21',
    status: 'waiting',
    priority: 'high',
    phase: 'HR Station'
  }
];

const DevNotesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const categories = [
    { value: 'all', label: 'すべて', icon: BookOpen, color: 'text-gray-600', bgColor: 'bg-gray-50', hoverColor: 'hover:bg-gray-100', activeColor: 'bg-gray-100' },
    { value: 'phase3', label: 'Phase 3統合', icon: Database, color: 'text-blue-600', bgColor: 'bg-blue-50', hoverColor: 'hover:bg-blue-100', activeColor: 'bg-blue-100' },
    { value: 'phase5', label: 'Phase 5実装', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50', hoverColor: 'hover:bg-green-100', activeColor: 'bg-green-100' },
    { value: 'admin-settings', label: '管理者設定', icon: Code, color: 'text-purple-600', bgColor: 'bg-purple-50', hoverColor: 'hover:bg-purple-100', activeColor: 'bg-purple-100' },
    { value: 'hr-guide', label: '人事制度ガイド', icon: FileText, color: 'text-amber-600', bgColor: 'bg-amber-50', hoverColor: 'hover:bg-amber-100', activeColor: 'bg-amber-100' },
    { value: 'health', label: '健康管理', icon: Heart, color: 'text-rose-600', bgColor: 'bg-rose-50', hoverColor: 'hover:bg-rose-100', activeColor: 'bg-rose-100' },
    { value: 'hr-station', label: '人事ステーション', icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-50', hoverColor: 'hover:bg-indigo-100', activeColor: 'bg-indigo-100' },
  ];

  const statuses = [
    { value: 'all', label: 'すべて' },
    { value: 'todo', label: 'TODO' },
    { value: 'in-progress', label: '進行中' },
    { value: 'done', label: '完了' },
    { value: 'waiting', label: 'DB待機中' }
  ];

  const priorities = [
    { value: 'all', label: 'すべて' },
    { value: 'critical', label: '最重要' },
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Clock className="h-3 w-3" />;
      case 'in-progress': return <AlertCircle className="h-3 w-3" />;
      case 'done': return <CheckCheck className="h-3 w-3" />;
      case 'waiting': return <Database className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'TODO';
      case 'in-progress': return '進行中';
      case 'done': return '完了';
      case 'waiting': return 'DB待機中';
      default: return status;
    }
  };

  const filteredMemos = devMemos.filter(memo => {
    const matchesCategory = selectedCategory === 'all' || memo.category === selectedCategory;
    const matchesSearch =
      memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || memo.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || memo.priority === selectedPriority;
    return matchesCategory && matchesSearch && matchesStatus && matchesPriority;
  });

  // 統計情報
  const stats = {
    total: devMemos.length,
    todo: devMemos.filter(m => m.status === 'todo').length,
    inProgress: devMemos.filter(m => m.status === 'in-progress').length,
    done: devMemos.filter(m => m.status === 'done').length,
    waiting: devMemos.filter(m => m.status === 'waiting').length,
    critical: devMemos.filter(m => m.priority === 'critical').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* カテゴリタブメニュー */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="border-b">
            <div className="grid grid-cols-4 gap-1 p-4">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.value;

                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`
                      flex items-center justify-center py-3 px-4 rounded-lg font-medium text-sm transition-all
                      ${isSelected
                        ? `${cat.activeColor} border-2 ${cat.color.replace('text-', 'border-')}`
                        : `${cat.bgColor} ${cat.hoverColor} text-gray-600 hover:text-gray-900 border-2 border-transparent`
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                {/* ヘッダー */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    {(() => {
                      const cat = categories.find(c => c.value === selectedCategory);
                      const Icon = cat?.icon || BookOpen;
                      return (
                        <>
                          <Icon className={`h-5 w-5 mr-2 ${cat?.color || 'text-gray-600'}`} />
                          {cat?.label || '開発メモ'}
                        </>
                      );
                    })()}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    システム実装の進捗・TODO・完了報告を一元管理
                  </p>
                </div>

                {/* フィルター */}
                <div className="mb-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* 検索 */}
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="タイトル、内容、タグで検索..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* ステータスフィルター */}
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>

                    {/* 優先度フィルター */}
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">総メモ数</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-yellow-800 font-medium">TODO</p>
                        <p className="text-2xl font-bold text-yellow-900">{stats.todo}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-800 font-medium">進行中</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-800 font-medium">完了</p>
                        <p className="text-2xl font-bold text-green-900">{stats.done}</p>
                      </div>
                      <CheckCheck className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-purple-800 font-medium">DB待機</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.waiting}</p>
                      </div>
                      <Database className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-red-800 font-medium">最重要</p>
                        <p className="text-2xl font-bold text-red-900">{stats.critical}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                </div>

                {/* メモリスト */}
                <div className="space-y-4">
                  {filteredMemos.map((memo) => {
                    const cat = categories.find(c => c.value === memo.category);
                    const CategoryIcon = cat?.icon || BookOpen;

                    return (
                      <div key={memo.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <CategoryIcon className={`h-5 w-5 flex-shrink-0 ${cat?.color || 'text-gray-600'}`} />
                            <h3 className="text-lg font-semibold text-gray-900">{memo.title}</h3>
                            {memo.phase && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                                {memo.phase}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getPriorityColor(memo.priority)}`}>
                              {memo.priority === 'critical' ? '🔥 最重要' :
                               memo.priority === 'high' ? '高' :
                               memo.priority === 'medium' ? '中' : '低'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(memo.status)}`}>
                              {getStatusIcon(memo.status)}
                              {getStatusLabel(memo.status)}
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{memo.content}</pre>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex gap-2 flex-wrap">
                            {memo.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                <Tag className="h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 ml-auto">
                            <Calendar className="h-3 w-3" />
                            作成: {memo.createdAt}
                          </div>
                          {memo.updatedAt !== memo.createdAt && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              更新: {memo.updatedAt}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {filteredMemos.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">該当するメモが見つかりません</p>
                    <p className="text-sm text-gray-500 mt-2">検索条件を変更してください</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 情報パネル */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-800">
                  開発メモについて
                </h3>
                <div className="mt-2 text-sm text-indigo-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>3つの主要開発メモファイルを統合表示しています</li>
                    <li>Phase別・カテゴリ別に分類され、検索・フィルタリングが可能です</li>
                    <li>優先度「最重要」の項目は早急な対応が必要です</li>
                    <li>「DB待機中」ステータスは共通DB構築後に作業再開します</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  使い方のヒント
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>上部のタブで大きなカテゴリを切り替えられます</li>
                    <li>検索バーでタイトル・内容・タグを横断検索できます</li>
                    <li>ステータスや優先度でフィルタリングできます</li>
                    <li>統計カードで全体状況を一目で把握できます</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevNotesPage;
