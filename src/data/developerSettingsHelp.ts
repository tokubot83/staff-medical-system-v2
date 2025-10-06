/**
 * 開発者設定ページのヘルプデータ定義
 * 各設定項目の詳細説明・トラブルシューティング・関連ドキュメントを提供
 */

import { DetailedHelpData } from '@/components/admin/DetailedHelpPanel';

export const developerSettingsHelp: Record<string, DetailedHelpData> = {
  // ================================================================================
  // MCPサーバー設定
  // ================================================================================

  mcpServerUrl: {
    whatIsThis:
      'MCP（Model Context Protocol）サーバーは、職員カルテシステム、VoiceDriveシステム、経営企画システムが共通のAI機能・データベース・外部ツールにアクセスするための中継サーバーです。Lightsail環境に構築され、WebSocket通信によるリアルタイムなデータ連携を実現します。',
    whyNeeded:
      '複数のシステムが同じLLM（Llama 3.2:3b）、統合データベース（MySQL）、Redisキャッシュを共有するために必要です。各システムが個別にLLMを実行するとメモリ不足になるため、MCPサーバーによる一元管理が不可欠です。',
    impactScope: ['all'],
    recommendedValue: 'wss://medical-integrated.lightsail.aws:5000/mcp',
    riskLevel: 'critical',
    troubleshooting: [
      {
        problem: '接続エラー: Connection refused',
        solution: 'ファイアウォール設定を確認してください。AWS Lightsailのインバウンドルールで TCP 5000番ポートが開放されているか確認します。コマンド: sudo ufw status'
      },
      {
        problem: '認証失敗: Unauthorized',
        solution: '認証トークンが正しく設定されているか確認してください。環境変数 MCP_AUTH_TOKEN の値を確認します。'
      },
      {
        problem: 'タイムアウトエラー',
        solution: 'MCPサーバーが起動しているか確認してください。コマンド: sudo systemctl status mcp-server'
      }
    ],
    technicalDetails: `接続プロトコル: WebSocket (wss://)
セキュリティ: TLS 1.3 暗号化、Bearer Token認証
ポート: 5000番（TCP）
タイムアウト: 30秒
最大同時接続数: 100`,
    relatedDocs: [
      {
        title: 'Phase 6.5: MCP Server統合移行計画',
        url: '/docs/implementation-complete-and-future-work-instructions-20250925.md#phase-65-mcp-server統合移行'
      },
      {
        title: 'Lightsail統合マスタープラン',
        url: '/mcp-shared/docs/lightsail-integration-master-plan-20251005-updated.md'
      }
    ]
  },

  mcpAuthToken: {
    whatIsThis:
      'MCPサーバーへの接続時に使用する認証トークンです。Bearer Token方式によるAPI認証を行い、不正アクセスを防止します。32-64文字のランダム文字列で構成されます。',
    whyNeeded:
      'MCPサーバーは複数のシステムが共有するため、認証トークンによるアクセス制御が必須です。トークンが漏洩すると、不正なシステムからデータベースやLLMにアクセスされる危険があります。',
    impactScope: ['all'],
    recommendedValue: 'mcp_token_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx（自動生成）',
    riskLevel: 'critical',
    troubleshooting: [
      {
        problem: '認証トークンを紛失した',
        solution: '新しいトークンを生成してください。コマンド: openssl rand -hex 32'
      },
      {
        problem: 'トークンが無効と表示される',
        solution: 'MCPサーバー側の.envファイルと、各システムの.envファイルのトークンが一致しているか確認してください。'
      }
    ],
    technicalDetails: `生成方法: openssl rand -hex 32
保存場所: .env.production（環境変数: MCP_AUTH_TOKEN）
有効期限: 無期限（定期的なローテーション推奨: 6ヶ月ごと）
暗号化: BCrypt（保存時）
権限: 読み取り専用（データベース更新は別途権限が必要）`,
    relatedDocs: [
      {
        title: 'セキュリティガイド: 認証トークン管理',
        url: '/docs/security-guide.md#token-management'
      }
    ]
  },

  // ================================================================================
  // データベース設定
  // ================================================================================

  databaseUrl: {
    whatIsThis:
      '統合データベース（MySQL 8.0）への接続URLです。職員マスタ、部門情報、権限管理、監査ログなど全てのデータを保存する中央データベースへの接続情報を含みます。',
    whyNeeded:
      '職員カルテシステムとVoiceDriveシステムが同じ職員データを共有するために必要です。統合データベースにより、データの二重管理を防ぎ、リアルタイムな同期を実現します。',
    impactScope: ['both'],
    recommendedValue: 'mysql://admin:password@medical-db.lightsail.aws:3306/staff_medical_integrated',
    riskLevel: 'critical',
    troubleshooting: [
      {
        problem: '接続エラー: Can\'t connect to MySQL server',
        solution: 'データベースサーバーが起動しているか確認してください。コマンド: sudo systemctl status mysql'
      },
      {
        problem: 'Access denied for user',
        solution: 'ユーザー名とパスワードが正しいか確認してください。MySQLにログインして確認: mysql -u admin -p'
      },
      {
        problem: 'Unknown database',
        solution: 'データベースが作成されているか確認してください。コマンド: SHOW DATABASES;'
      }
    ],
    technicalDetails: `DBエンジン: MySQL 8.0
文字コード: utf8mb4（絵文字対応）
照合順序: utf8mb4_unicode_ci
接続プール: 10-50接続
タイムアウト: 10秒
バックアップ: 毎日 03:00（自動）
保持期間: 30日`,
    relatedDocs: [
      {
        title: '共通DB構築計画',
        url: '/docs/implementation-complete-and-future-work-instructions-20250925.md#共通db構築計画mysql'
      },
      {
        title: 'データベーススキーマ定義',
        url: '/mcp-shared/config/unified-account-level-definition.json'
      }
    ]
  },

  // ================================================================================
  // LLM設定
  // ================================================================================

  llmModel: {
    whatIsThis:
      'ローカルLLM（Large Language Model）の選択設定です。現在はLlama 3.2:3b（3億パラメータ）を使用しています。VoiceDrive提案のモデレーション、開発メモの自動分類、面談シートのサマリー生成などに使用されます。',
    whyNeeded:
      'OpenAI APIなどのクラウドLLMを使用すると、医療データが外部に送信されるリスクがあります。ローカルLLMを使用することで、データを外部に出さずにAI機能を利用できます。',
    impactScope: ['both'],
    recommendedValue: 'llama3.2:3b',
    riskLevel: 'medium',
    troubleshooting: [
      {
        problem: 'モデルが見つかりません: Model not found',
        solution: 'Ollamaでモデルをダウンロードしてください。コマンド: ollama pull llama3.2:3b'
      },
      {
        problem: '処理が遅い・メモリ不足',
        solution: '3bモデルは軽量ですが、同時リクエストが多いと遅延します。Lightsailのメモリ割り当てを確認してください（推奨: 3-4GB）。'
      },
      {
        problem: 'Ollamaが起動しない',
        solution: 'Ollamaサービスのステータスを確認してください。コマンド: sudo systemctl status ollama'
      }
    ],
    technicalDetails: `モデル名: Llama 3.2:3b
パラメータ数: 30億
メモリ使用量: 3-4GB
コンテキスト長: 2048トークン
実行環境: Ollama 0.1.x
推論速度: 20-30トークン/秒
量子化: Q4_K_M（4bit量子化）`,
    relatedDocs: [
      {
        title: 'LLMモデル選定理由',
        url: '/docs/implementation-complete-and-future-work-instructions-20250925.md#llm設定'
      }
    ]
  },

  // ================================================================================
  // Redis設定
  // ================================================================================

  redisUrl: {
    whatIsThis:
      'Redisキャッシュサーバーへの接続URLです。セッション管理、APIレスポンスのキャッシュ、リアルタイム通知のPub/Subに使用されます。高速なインメモリデータベースです。',
    whyNeeded:
      'データベースへのアクセスを減らし、システムのレスポンス速度を向上させるために必要です。特に、頻繁にアクセスされる職員マスタデータや権限情報をキャッシュすることで、パフォーマンスが大幅に改善されます。',
    impactScope: ['both'],
    recommendedValue: 'redis://medical-cache.lightsail.aws:6379',
    riskLevel: 'medium',
    troubleshooting: [
      {
        problem: '接続エラー: Connection refused',
        solution: 'Redisサーバーが起動しているか確認してください。コマンド: sudo systemctl status redis'
      },
      {
        problem: 'メモリ不足: OOM command not allowed',
        solution: 'Redisのメモリ使用量が上限に達しています。不要なキャッシュを削除するか、maxmemoryを増やしてください。'
      }
    ],
    technicalDetails: `バージョン: Redis 7.x
メモリ割り当て: 1GB
永続化: RDB（5分ごと）
最大接続数: 100
パスワード: 必須（.envで設定）
キャッシュ有効期限: 1時間（デフォルト）`,
    relatedDocs: [
      {
        title: 'Redisキャッシュ戦略',
        url: '/docs/cache-strategy.md'
      }
    ]
  },

  // ================================================================================
  // Webhook設定
  // ================================================================================

  webhookUrl: {
    whatIsThis:
      'システム間のイベント通知を送信するWebhook URLです。職員データの更新、権限レベルの変更、VoiceDrive提案の承認時などに、他システムへ自動通知を送信します。',
    whyNeeded:
      '職員カルテシステムで職員情報が更新された際に、VoiceDriveシステムにも即座に反映させるために必要です。手動での同期作業を不要にし、データの整合性を保ちます。',
    impactScope: ['both'],
    recommendedValue: 'https://voicedrive.lightsail.aws/api/webhook/staff-update',
    riskLevel: 'high',
    troubleshooting: [
      {
        problem: 'Webhook送信失敗: 500 Internal Server Error',
        solution: '送信先システムのログを確認してください。リトライ機構が3回まで自動再送信します。'
      },
      {
        problem: 'タイムアウトエラー',
        solution: '送信先システムのレスポンスが遅い可能性があります。タイムアウト設定を延長するか、非同期処理に変更してください。'
      }
    ],
    technicalDetails: `プロトコル: HTTPS（TLS 1.3）
認証: HMAC-SHA256署名
リトライ: 3回（指数バックオフ: 1秒、5秒、15秒）
タイムアウト: 10秒
ペイロード形式: JSON
最大サイズ: 1MB`,
    relatedDocs: [
      {
        title: 'Phase 3: Webhook通知システム実装報告',
        url: '/docs/Phase3_実装作業完了報告書_FINAL.md'
      }
    ]
  },

  // ================================================================================
  // 監査ログ設定
  // ================================================================================

  auditLogEnabled: {
    whatIsThis:
      'Level 99/100開発者の全ての操作を記録する監査ログ機能の有効化設定です。コード変更、データベーススキーマ変更、Gitコミット、権限変更などの開発操作が自動的に記録されます。',
    whyNeeded:
      '医療システムのコンプライアンス対応として、開発者の操作履歴を完全に記録する必要があります。将来の監査、セキュリティインシデント調査、システム変更履歴の追跡に使用されます。',
    impactScope: ['medical'],
    recommendedValue: 'true（有効）',
    riskLevel: 'low',
    troubleshooting: [
      {
        problem: 'ログが記録されない',
        solution: 'データベースのdeveloper_audit_logテーブルが作成されているか確認してください。マイグレーション: 004_create_developer_audit_log.sql'
      }
    ],
    technicalDetails: `保存先: developer_audit_logテーブル
保持期間: 無期限（法令遵守）
記録項目: 操作者ID、操作タイプ、操作理由、Git情報、リスクレベル、実行結果
API: POST /api/admin/developer-audit
認証: Level 99/100またはSYSTEM_ADMIN_API_KEY`,
    relatedDocs: [
      {
        title: '開発者監査ログAPI仕様',
        url: '/src/app/api/admin/developer-audit/route.ts'
      },
      {
        title: 'マイグレーションファイル',
        url: '/src/lib/database/migrations/004_create_developer_audit_log.sql'
      }
    ]
  },

  // ================================================================================
  // アクセス制御設定
  // ================================================================================

  accountLevelSystem: {
    whatIsThis:
      '25段階権限システムの設定です。基本18レベル（新人1.0～理事長18.0）、看護職リーダー4レベル（1.5, 2.5, 3.5, 4.5）、特別権限3レベル（97健診担当者、98産業医、99システム管理者）で構成されます。',
    whyNeeded:
      '職員の役職・経験年数・職種に応じて、アクセスできる機能やデータを細かく制御するために必要です。例えば、師長は病棟職員の評価を閲覧できますが、他病棟の職員情報は閲覧できません。',
    impactScope: ['both'],
    recommendedValue: 'unified-account-level-definition.json（統合管理ファイル）',
    riskLevel: 'critical',
    troubleshooting: [
      {
        problem: '権限レベルが正しく計算されない',
        solution: 'AccountLevelCalculatorサービスのロジックを確認してください。ファイル: src/services/accountLevelCalculator.ts'
      },
      {
        problem: '施設別権限調整が反映されない',
        solution: 'facilityIdパラメータが正しく渡されているか確認してください。立神リハビリテーション温泉病院の統括主任のみLevel 7に調整されます。'
      }
    ],
    technicalDetails: `実装ファイル: src/services/accountLevelCalculator.ts
看護職リーダー判定: isNursingProfession() + canPerformLeaderDuty
施設別調整: FACILITY_SPECIFIC_ADJUSTMENTS
統合管理JSON: mcp-shared/config/unified-account-level-definition.json
最終確認日: 2025-10-06（VoiceDriveチームと整合性確認完了）`,
    relatedDocs: [
      {
        title: 'アカウントレベル整合性確認報告書',
        url: '/mcp-shared/docs/Account_Level_Alignment_Complete_Report_20251006.md'
      },
      {
        title: 'アカウントレベル統合検証テスト結果（34/34成功）',
        url: '/mcp-shared/docs/Account_Level_Verification_Test_Report_20251006.md'
      }
    ]
  },

  // ================================================================================
  // バックアップ設定
  // ================================================================================

  objectStorageUrl: {
    whatIsThis:
      'AWS Lightsail Object Storageへの接続URLです。データベースバックアップ、システム設定ファイル、監査ログのアーカイブを保存します。S3互換のオブジェクトストレージです。',
    whyNeeded:
      'データベース障害やシステム障害が発生した際に、データを復旧するために必要です。毎日自動的にバックアップが作成され、30日間保持されます。',
    impactScope: ['all'],
    recommendedValue: 's3://medical-backup.lightsail.aws/backups',
    riskLevel: 'high',
    troubleshooting: [
      {
        problem: 'バックアップアップロード失敗',
        solution: 'Object StorageのアクセスキーとシークレットキーがLightsailの.envファイルに正しく設定されているか確認してください。'
      },
      {
        problem: '容量不足',
        solution: 'Object Storageの使用量を確認してください。100GBプラン（$10/月）または50GBプラン（$5/月）の範囲内か確認します。'
      }
    ],
    technicalDetails: `容量: 100GB（推奨）または50GB
月額コスト: $10（100GB）、$5（50GB）
バックアップ頻度: 毎日 03:00 JST
保持期間: 30日（ローテーション）
暗号化: AES-256（サーバーサイド暗号化）
アクセス: IAMアクセスキー認証`,
    relatedDocs: [
      {
        title: 'Object Storage実装時確認フロー',
        url: '/docs/implementation-complete-and-future-work-instructions-20250925.md#コスト試算'
      }
    ]
  },

  // ================================================================================
  // 環境変数管理
  // ================================================================================

  environmentVariables: {
    whatIsThis:
      'システム全体で使用される環境変数の一元管理設定です。API Key、データベース接続情報、認証トークンなどの機密情報を安全に管理します。',
    whyNeeded:
      '機密情報をソースコードにハードコードすると、Gitリポジトリに漏洩するリスクがあります。環境変数として管理することで、セキュリティを向上させ、環境ごとに異なる設定を簡単に切り替えられます。',
    impactScope: ['all'],
    recommendedValue: '.env.production（本番環境）、.env.local（開発環境）',
    riskLevel: 'critical',
    troubleshooting: [
      {
        problem: '環境変数が読み込まれない',
        solution: '.envファイルがプロジェクトルートに配置されているか確認してください。Next.jsではNEXT_PUBLIC_プレフィックスが必要な場合があります。'
      },
      {
        problem: 'Vercelで環境変数が反映されない',
        solution: 'Vercelダッシュボードの Settings > Environment Variables で設定を確認してください。デプロイ後に再デプロイが必要です。'
      }
    ],
    technicalDetails: `ファイル形式: KEY=VALUE
暗号化: Vercel Secret（本番環境）
アクセス制御: .gitignoreで除外
必須変数: DATABASE_URL, MCP_AUTH_TOKEN, REDIS_URL, SYSTEM_ADMIN_API_KEY
検証: 起動時にバリデーションチェック`,
    relatedDocs: [
      {
        title: 'セキュリティガイド: 環境変数管理',
        url: '/docs/security-guide.md#environment-variables'
      }
    ]
  },
};

/**
 * ヘルプデータを取得するヘルパー関数
 */
export function getHelpData(key: string): DetailedHelpData | undefined {
  return developerSettingsHelp[key];
}

/**
 * 全てのヘルプキーを取得
 */
export function getAllHelpKeys(): string[] {
  return Object.keys(developerSettingsHelp);
}
