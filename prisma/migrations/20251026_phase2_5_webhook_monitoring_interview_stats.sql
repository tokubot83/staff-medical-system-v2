-- Phase 2.5: SystemMonitorPage連携強化
-- Webhook送信統計・面談完了統計API実装用マイグレーション
-- 作成日: 2025-10-26

-- ============================================
-- 1. Webhook送信ログテーブル作成
-- ============================================
CREATE TABLE IF NOT EXISTS `webhook_send_logs` (
  `id` VARCHAR(191) NOT NULL,
  `event_type` VARCHAR(100) NOT NULL COMMENT 'イベントタイプ（employee.created等）',
  `event_timestamp` DATETIME(3) NOT NULL COMMENT 'イベント発生時刻',
  `sent_at` DATETIME(3) NOT NULL COMMENT '送信時刻',
  `staff_id` VARCHAR(191) NULL COMMENT '関連職員ID',
  `request_id` VARCHAR(191) NULL COMMENT 'リクエストID（VoiceDrive連携用）',
  `payload_size` INTEGER NOT NULL COMMENT 'ペイロードサイズ（bytes）',
  `status` ENUM('success', 'failed', 'timeout') NOT NULL COMMENT '送信ステータス',
  `http_status_code` INTEGER NULL COMMENT 'HTTPステータスコード',
  `processing_time` INTEGER NOT NULL COMMENT '処理時間（ms）',
  `error_message` TEXT NULL COMMENT 'エラーメッセージ',
  `retry_count` INTEGER NOT NULL DEFAULT 0 COMMENT 'リトライ回数',
  `last_retry_at` DATETIME(3) NULL COMMENT '最終リトライ時刻',
  `response_body` TEXT NULL COMMENT 'レスポンスボディ（JSON）',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `webhook_send_logs_request_id_key`(`request_id`),
  INDEX `webhook_send_logs_event_type_idx`(`event_type`),
  INDEX `webhook_send_logs_sent_at_idx`(`sent_at`),
  INDEX `webhook_send_logs_status_idx`(`status`),
  INDEX `webhook_send_logs_staff_id_idx`(`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Webhookリトライキューテーブル作成
-- ============================================
CREATE TABLE IF NOT EXISTS `webhook_retry_queue` (
  `id` VARCHAR(191) NOT NULL,
  `original_log_id` VARCHAR(191) NOT NULL COMMENT '元のwebhook_send_logsのID',
  `event_type` VARCHAR(100) NOT NULL COMMENT 'イベントタイプ',
  `payload` JSON NOT NULL COMMENT 'リトライ用のペイロード',
  `retry_attempt` INTEGER NOT NULL DEFAULT 0 COMMENT '現在のリトライ回数',
  `max_retries` INTEGER NOT NULL DEFAULT 3 COMMENT '最大リトライ回数',
  `next_retry_at` DATETIME(3) NOT NULL COMMENT '次回リトライ予定時刻',
  `status` ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  `last_error` TEXT NULL COMMENT '最後のエラーメッセージ',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `webhook_retry_queue_status_next_retry_at_idx`(`status`, `next_retry_at`),
  INDEX `webhook_retry_queue_original_log_id_idx`(`original_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Interviewテーブル拡張 - Phase 2.5フィールド追加
-- ============================================

-- 新しいEnum型を追加
ALTER TABLE `interviews`
  ADD COLUMN `voicedrive_sync_id` VARCHAR(191) NULL COMMENT 'VoiceDrive予約IDとの紐付け',
  ADD COLUMN `duration_minutes` INTEGER NULL COMMENT '面談所要時間（分）',
  ADD COLUMN `rescheduled_from_id` VARCHAR(191) NULL COMMENT '再予約元のID',
  ADD COLUMN `interview_status` ENUM('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled') NULL DEFAULT 'scheduled' COMMENT '面談ステータス';

-- ユニーク制約とインデックスを追加
ALTER TABLE `interviews`
  ADD UNIQUE INDEX `interviews_voicedrive_sync_id_key`(`voicedrive_sync_id`),
  ADD INDEX `interviews_interview_status_idx`(`interview_status`);

-- 外部キー制約を追加（自己参照）
ALTER TABLE `interviews`
  ADD CONSTRAINT `interviews_rescheduled_from_id_fkey`
  FOREIGN KEY (`rescheduled_from_id`)
  REFERENCES `interviews`(`id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- ============================================
-- 4. 初期データ挿入（オプション）
-- ============================================

-- VoiceDriveチームとの統合テスト用サンプルデータは後で挿入

-- ============================================
-- マイグレーション完了確認
-- ============================================

-- 作成されたテーブルとカラムの確認
SELECT
  TABLE_NAME,
  COLUMN_NAME,
  DATA_TYPE,
  IS_NULLABLE,
  COLUMN_KEY
FROM
  INFORMATION_SCHEMA.COLUMNS
WHERE
  TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('webhook_send_logs', 'webhook_retry_queue', 'interviews')
ORDER BY
  TABLE_NAME,
  ORDINAL_POSITION;
