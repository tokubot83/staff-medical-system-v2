-- ================================================================================
-- 開発者監査ログテーブル作成マイグレーション
-- Version: 1.0.0
-- Created: 2025-10-06
-- Purpose: Level 99/100の開発操作を完全に記録（コンプライアンス対応）
-- ================================================================================

USE staff_medical_system;

-- ================================================================================
-- 1. 開発者監査ログテーブル
-- ================================================================================

CREATE TABLE IF NOT EXISTS developer_audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- 操作者情報
  operator_id VARCHAR(50) NOT NULL COMMENT '操作者のユーザーID',
  operator_name VARCHAR(100) COMMENT '操作者名',
  operator_level DECIMAL(4,1) NOT NULL COMMENT '操作者のアカウントレベル（99 or 100）',
  operator_email VARCHAR(255) COMMENT '操作者のメールアドレス',

  -- 操作情報
  operation_type ENUM(
    'code_deployment',       -- コードデプロイメント
    'database_schema_change', -- DBスキーマ変更
    'git_commit',            -- Gitコミット
    'git_push',              -- Gitプッシュ
    'git_merge',             -- Gitマージ
    'package_update',        -- パッケージ更新
    'config_change',         -- 設定ファイル変更
    'migration_execution',   -- マイグレーション実行
    'api_key_generation',    -- APIキー生成
    'permission_change',     -- 権限変更（access_control経由）
    'system_restart',        -- システム再起動
    'backup_creation',       -- バックアップ作成
    'rollback',              -- ロールバック
    'other'                  -- その他
  ) NOT NULL COMMENT '操作タイプ',

  operation_category ENUM(
    'development',   -- 開発作業
    'maintenance',   -- メンテナンス
    'emergency',     -- 緊急対応
    'security',      -- セキュリティ対応
    'routine'        -- 定期作業
  ) NOT NULL DEFAULT 'development' COMMENT '操作カテゴリ',

  -- 操作詳細
  operation_summary VARCHAR(500) NOT NULL COMMENT '操作の概要（必須）',
  operation_reason TEXT NOT NULL COMMENT '操作理由・目的（必須、10文字以上）',
  affected_resources TEXT COMMENT '影響を受けるリソース（ファイル、テーブル等）',

  -- Git関連情報
  git_commit_hash VARCHAR(40) COMMENT 'Gitコミットハッシュ',
  git_branch VARCHAR(100) COMMENT 'Gitブランチ名',
  git_author VARCHAR(100) COMMENT 'Git作成者名',
  git_commit_message TEXT COMMENT 'Gitコミットメッセージ',

  -- ファイル変更情報
  files_changed TEXT COMMENT '変更されたファイルのリスト（JSON配列）',
  lines_added INT COMMENT '追加行数',
  lines_deleted INT COMMENT '削除行数',

  -- データベース変更情報
  db_migration_file VARCHAR(255) COMMENT 'マイグレーションファイル名',
  db_tables_affected TEXT COMMENT '影響を受けたテーブル（JSON配列）',

  -- 承認・レビュー情報（Phase 2用）
  requires_approval BOOLEAN DEFAULT FALSE COMMENT '承認必須フラグ（Level 100分離時に使用）',
  approved_by VARCHAR(50) COMMENT '承認者ID（Phase 2）',
  approved_at TIMESTAMP NULL COMMENT '承認日時（Phase 2）',
  approval_comment TEXT COMMENT '承認コメント（Phase 2）',

  -- リスク評価
  risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium' COMMENT 'リスクレベル',
  is_reversible BOOLEAN DEFAULT TRUE COMMENT '可逆性フラグ（ロールバック可能か）',
  rollback_plan TEXT COMMENT 'ロールバック計画',

  -- 実行環境情報
  environment ENUM('development', 'staging', 'production') DEFAULT 'production' COMMENT '実行環境',
  execution_method ENUM('vscode', 'cli', 'ui', 'api', 'automated') NOT NULL COMMENT '実行方法',

  -- 監査情報
  ip_address VARCHAR(45) COMMENT '操作元IPアドレス（IPv6対応）',
  user_agent TEXT COMMENT 'ブラウザ/ツール情報',
  session_id VARCHAR(100) COMMENT 'セッションID',

  -- 実行結果
  execution_status ENUM('success', 'partial_success', 'failed', 'rolled_back') NOT NULL DEFAULT 'success' COMMENT '実行ステータス',
  error_message TEXT COMMENT 'エラーメッセージ（失敗時）',
  execution_duration_ms INT COMMENT '実行時間（ミリ秒）',

  -- タイムスタンプ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '操作実行日時',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',

  -- インデックス
  INDEX idx_operator_id (operator_id),
  INDEX idx_operation_type (operation_type),
  INDEX idx_operation_category (operation_category),
  INDEX idx_created_at (created_at),
  INDEX idx_operator_level (operator_level),
  INDEX idx_git_commit_hash (git_commit_hash),
  INDEX idx_risk_level (risk_level),
  INDEX idx_execution_status (execution_status),
  INDEX idx_environment (environment)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='開発者監査ログ：Level 99/100の全開発操作を記録';

-- ================================================================================
-- 2. 開発者操作サマリービュー（統計用）
-- ================================================================================

CREATE OR REPLACE VIEW developer_audit_summary AS
SELECT
  operator_id,
  operator_name,
  operator_level,
  operation_type,
  operation_category,
  COUNT(*) as operation_count,
  SUM(CASE WHEN execution_status = 'success' THEN 1 ELSE 0 END) as success_count,
  SUM(CASE WHEN execution_status = 'failed' THEN 1 ELSE 0 END) as failed_count,
  SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_operations,
  SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_risk_operations,
  MAX(created_at) as last_operation_at,
  AVG(execution_duration_ms) as avg_execution_ms
FROM developer_audit_log
GROUP BY operator_id, operator_name, operator_level, operation_type, operation_category;

-- ================================================================================
-- 3. 最近の重要操作ビュー（ダッシュボード用）
-- ================================================================================

CREATE OR REPLACE VIEW recent_critical_operations AS
SELECT
  id,
  operator_id,
  operator_name,
  operation_type,
  operation_summary,
  risk_level,
  execution_status,
  created_at,
  git_commit_hash,
  affected_resources
FROM developer_audit_log
WHERE
  risk_level IN ('critical', 'high')
  OR execution_status IN ('failed', 'rolled_back')
  OR operation_type IN ('database_schema_change', 'permission_change')
ORDER BY created_at DESC
LIMIT 100;

-- ================================================================================
-- 4. 初期データ投入（システム起動ログ）
-- ================================================================================

INSERT INTO developer_audit_log (
  operator_id,
  operator_name,
  operator_level,
  operation_type,
  operation_category,
  operation_summary,
  operation_reason,
  risk_level,
  execution_method,
  environment,
  execution_status
) VALUES (
  'SYSTEM',
  'System Initialization',
  99.0,
  'migration_execution',
  'maintenance',
  '開発者監査ログシステム初期化',
  'Level 99開発者権限強化のための監査ログテーブル作成',
  'low',
  'automated',
  'production',
  'success'
);

-- ================================================================================
-- 5. コメント追加（可読性向上）
-- ================================================================================

ALTER TABLE developer_audit_log
  COMMENT = '開発者監査ログ：Level 99/100の全開発操作を完全記録。コンプライアンス監査、セキュリティ監視、将来のLevel 100分離に対応。';

-- ================================================================================
-- 6. 確認クエリ（マイグレーション実行後に確認）
-- ================================================================================

-- テーブル構造確認
-- DESCRIBE developer_audit_log;

-- 初期データ確認
-- SELECT * FROM developer_audit_log ORDER BY created_at DESC LIMIT 10;

-- ビュー確認
-- SELECT * FROM developer_audit_summary;
-- SELECT * FROM recent_critical_operations;
