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
        content: '2025年1月13日作成。85%完了。残タスク：データ管理・システム連携機能（4-5時間）',
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250113.md' },
        date: '2025-01-13',
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
        date: '2025-01-14',
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
        date: '2024-12-15',
        priority: 'important',
        status: 'completed',
        tags: ['DB設計', 'スキーマ']
      },

      // ===== マスターデータ管理 =====
      {
        id: 'master-001',
        category: 'マスターデータ管理',
        subcategory: '実装内容',
        title: 'マスターデータ管理機能の実装完了',
        content: '職員・施設・研修・評価項目の4つのマスターデータ管理機能を実装。スキーマ駆動型設計で項目追加が容易。',
        source: { type: 'file', path: '/src/config/masterSchemas.ts' },
        date: '2025-01-14',
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
        date: '2025-01-14',
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
        date: '2025-01-14',
        priority: 'info',
        status: 'pending',
        tags: ['API', 'REST']
      },

      // ===== 面談システム =====
      {
        id: 'interview-001',
        category: '面談システム',
        subcategory: '面談フロー',
        title: '面談システム概要と設計',
        content: '定期面談の予約管理、実施記録、フィードバック管理を統合。15分/30分/45分の時間枠別面談シート。',
        source: { type: 'document', path: '/docs/interview-system-overview.md' },
        date: '2024-11-20',
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
        date: '2024-11-25',
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
        date: '2025-01-10',
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
        date: '2024-12-10',
        priority: 'info',
        status: 'completed',
        tags: ['面談制度', 'ガイド']
      },

      // ===== 評価システム =====
      {
        id: 'eval-001',
        category: '評価システム',
        subcategory: '評価ロジック',
        title: '2軸評価方式の実装',
        content: '技術スコア（0-100点）と貢献度スコア（0-100点）の2軸で評価。最終評価は加重平均で算出。',
        source: { type: 'document', path: '/docs/two-axis-evaluation-implementation-guide.md' },
        date: '2024-12-20',
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
        date: '2024-12-22',
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
        date: '2025-01-13',
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
        date: '2025-01-05',
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
        date: '2025-01-13',
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
        date: '2025-01-13',
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
        date: '2025-01-10',
        priority: 'info',
        status: 'pending',
        tags: ['TODO', '効果測定']
      },

      // ===== その他機能 =====
      {
        id: 'other-001',
        category: 'その他機能',
        subcategory: '通知システム',
        title: '通知センター実装完了',
        content: '研修期限、評価締切、承認依頼などの通知を一元管理。フィルタリング、既読管理機能付き。',
        source: { type: 'file', path: '/src/components/notification/NotificationCenter.tsx' },
        date: '2025-01-13',
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
        date: '2025-01-13',
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
        date: '2024-12-05',
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
        date: '2024-08-10',
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
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250113.md', line: 96 },
        date: '2025-01-14',
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
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250113.md', line: 113 },
        date: '2025-01-14',
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
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250113.md', line: 131 },
        date: '2025-01-14',
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
        source: { type: 'document', path: '/docs/implementation-resume-guide-v3-20250113.md', line: 148 },
        date: '2025-01-14',
        priority: 'info',
        status: 'pending',
        tags: ['バッチ', '次期実装']
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