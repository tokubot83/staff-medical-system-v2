-- ================================================================================
-- アクセス制御マスターテーブル作成マイグレーション
-- Version: 1.0.0
-- Created: 2025-10-06
-- Purpose: タブ・ページ・機能の権限管理をマスターデータ化
-- ================================================================================

USE staff_medical_system;

-- ================================================================================
-- 1. アクセス制御マスターテーブル
-- ================================================================================

CREATE TABLE IF NOT EXISTS access_control_master (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- リソース識別
  resource_type ENUM('tab', 'page', 'feature', 'data') NOT NULL COMMENT 'リソースタイプ',
  resource_id VARCHAR(100) NOT NULL COMMENT 'リソースID（例: evaluation-history, /admin）',
  resource_name VARCHAR(200) NOT NULL COMMENT 'リソース名（例: 評価履歴タブ）',
  category VARCHAR(100) COMMENT 'カテゴリ（例: 育成・評価）',

  -- アクセス制御設定
  min_level DECIMAL(4,1) NOT NULL DEFAULT 14.0 COMMENT '最小アクセスレベル（1.0-99.0）',
  special_authority BOOLEAN DEFAULT FALSE COMMENT '特別権限フラグ（健診担当者・産業医専用）',
  requires_assignment BOOLEAN DEFAULT FALSE COMMENT '担当者割り当て必須フラグ',

  -- メタ情報
  description TEXT COMMENT '説明・用途',
  is_active BOOLEAN DEFAULT TRUE COMMENT '有効フラグ',
  is_system_protected BOOLEAN DEFAULT FALSE COMMENT 'システム保護フラグ（変更時に警告）',
  display_order INT DEFAULT 0 COMMENT '表示順序',

  -- 推奨設定（セーフガード用）
  recommended_min_level DECIMAL(4,1) COMMENT '推奨最小レベル',
  recommended_reason TEXT COMMENT '推奨理由',

  -- 監査情報
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) DEFAULT 'SYSTEM',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),

  -- ユニーク制約
  UNIQUE KEY uk_resource (resource_type, resource_id),

  -- インデックス
  INDEX idx_resource_type (resource_type),
  INDEX idx_min_level (min_level),
  INDEX idx_is_active (is_active),
  INDEX idx_category (category),
  INDEX idx_special_authority (special_authority)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='アクセス制御マスター：タブ・ページ・機能の権限管理';

-- ================================================================================
-- 2. アクセス制御変更履歴テーブル
-- ================================================================================

CREATE TABLE IF NOT EXISTS access_control_change_log (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- 変更対象
  master_record_id INT NOT NULL COMMENT 'access_control_master.id',
  resource_type ENUM('tab', 'page', 'feature', 'data') NOT NULL,
  resource_id VARCHAR(100) NOT NULL,
  resource_name VARCHAR(200) NOT NULL,

  -- 変更内容
  field_name VARCHAR(50) NOT NULL COMMENT '変更フィールド名',
  old_value TEXT COMMENT '変更前の値',
  new_value TEXT COMMENT '変更後の値',

  -- 変更理由・承認
  change_reason TEXT NOT NULL COMMENT '変更理由（必須）',
  is_deviation_from_recommended BOOLEAN DEFAULT FALSE COMMENT '推奨設定からの逸脱フラグ',

  -- 監査情報
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by VARCHAR(50) NOT NULL COMMENT '変更者（ユーザーID）',
  changed_by_name VARCHAR(100) COMMENT '変更者名',
  changed_by_level DECIMAL(4,1) COMMENT '変更者のアカウントレベル',
  ip_address VARCHAR(45) COMMENT '変更元IPアドレス（IPv6対応）',
  user_agent TEXT COMMENT 'ブラウザ情報',

  -- 外部キー
  FOREIGN KEY (master_record_id) REFERENCES access_control_master(id) ON DELETE CASCADE,

  -- インデックス
  INDEX idx_master_record_id (master_record_id),
  INDEX idx_changed_at (changed_at),
  INDEX idx_changed_by (changed_by),
  INDEX idx_resource_id (resource_id),
  INDEX idx_field_name (field_name)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='アクセス制御変更履歴：権限変更の監査ログ';

-- ================================================================================
-- 3. アクセス制御ロールバックテーブル（Phase 2用）
-- ================================================================================

CREATE TABLE IF NOT EXISTS access_control_snapshot (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- スナップショット情報
  snapshot_name VARCHAR(200) NOT NULL COMMENT 'スナップショット名（例: 運用開始前設定）',
  snapshot_description TEXT COMMENT '説明',

  -- スナップショットデータ（JSON形式で全設定を保存）
  snapshot_data JSON NOT NULL COMMENT 'access_control_masterの全データ',

  -- メタ情報
  is_active BOOLEAN DEFAULT TRUE COMMENT '有効フラグ',
  can_rollback BOOLEAN DEFAULT TRUE COMMENT 'ロールバック可能フラグ',

  -- 監査情報
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,

  -- インデックス
  INDEX idx_created_at (created_at),
  INDEX idx_is_active (is_active)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='アクセス制御スナップショット：ロールバック用';

-- ================================================================================
-- 4. コメント追加（可読性向上）
-- ================================================================================

ALTER TABLE access_control_master
  COMMENT = 'アクセス制御マスター：タブ・ページ・機能の権限を動的に管理。Level 99が編集可能。';

ALTER TABLE access_control_change_log
  COMMENT = 'アクセス制御変更履歴：全ての権限変更を記録。コンプライアンス監査対応。';

ALTER TABLE access_control_snapshot
  COMMENT = 'アクセス制御スナップショット：設定のバックアップとロールバック機能（Phase 2）。';
