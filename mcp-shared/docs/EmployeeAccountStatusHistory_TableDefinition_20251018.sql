-- EmployeeAccountStatusHistory テーブル定義
-- VoiceDrive緊急処理統合用
-- 作成日: 2025-10-18
-- 承認: 医療システムチーム

CREATE TABLE employee_account_status_history (
  -- 主キー
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',

  -- 対象職員
  employee_id VARCHAR(50) NOT NULL COMMENT '職員ID',

  -- 変更内容
  previous_status VARCHAR(50) COMMENT '変更前ステータス',
  new_status VARCHAR(50) NOT NULL COMMENT '変更後ステータス',
  -- 'active' | 'emergency_deactivated' | 'retired' | 'suspended'

  -- 変更元システム
  source_system VARCHAR(50) NOT NULL COMMENT '変更元システム',
  -- 'staff_medical_system' | 'voicedrive_emergency'

  is_emergency_change BOOLEAN DEFAULT FALSE COMMENT '緊急変更フラグ',

  -- VoiceDrive緊急処理との紐付け
  voicedrive_deactivation_id VARCHAR(36) COMMENT 'VoiceDrive EmergencyDeactivation.id',
  voicedrive_retirement_process_id VARCHAR(36) COMMENT 'VoiceDrive RetirementProcess.id',

  -- 実行者情報（拡張）
  changed_by VARCHAR(50) COMMENT '変更実行者ID',
  changed_by_name VARCHAR(100) COMMENT '変更実行者名',
  changed_by_department VARCHAR(100) COMMENT '変更実行者の部署',
  changed_by_facility VARCHAR(100) COMMENT '変更実行者の施設',

  -- 承認情報（事後承認用）
  approval_required BOOLEAN DEFAULT FALSE COMMENT '承認が必要か（緊急処理の場合は事後承認）',
  approved_by VARCHAR(50) COMMENT '承認者ID',
  approved_by_name VARCHAR(100) COMMENT '承認者名',
  approved_at TIMESTAMP COMMENT '承認日時',

  -- 理由
  reason TEXT COMMENT '変更理由',

  -- タイムスタンプ
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '変更日時',
  synced_from_voicedrive_at TIMESTAMP COMMENT 'VoiceDriveから同期された日時',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- インデックス
  INDEX idx_employee_id (employee_id),
  INDEX idx_source_system (source_system),
  INDEX idx_is_emergency_change (is_emergency_change),
  INDEX idx_voicedrive_deactivation_id (voicedrive_deactivation_id),
  INDEX idx_changed_at (changed_at),
  INDEX idx_approved_by (approved_by),

  -- 外部キー（RESTRICT に変更）
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='アカウント状態変更履歴（VoiceDrive緊急処理含む）';

-- 初期データ確認用View
CREATE OR REPLACE VIEW v_emergency_deactivation_history AS
SELECT
  h.id,
  h.employee_id,
  e.full_name AS employee_name,
  e.department,
  e.facility_id,
  h.previous_status,
  h.new_status,
  h.source_system,
  h.is_emergency_change,
  h.voicedrive_deactivation_id,
  h.voicedrive_retirement_process_id,
  h.changed_by,
  h.changed_by_name,
  h.changed_by_department,
  h.changed_by_facility,
  h.approval_required,
  h.approved_by,
  h.approved_by_name,
  h.approved_at,
  h.reason,
  h.changed_at,
  h.synced_from_voicedrive_at,
  CASE
    WHEN h.approval_required = TRUE AND h.approved_at IS NULL THEN '承認待ち'
    WHEN h.approval_required = TRUE AND h.approved_at IS NOT NULL THEN '承認済み'
    ELSE '承認不要'
  END AS approval_status
FROM employee_account_status_history h
INNER JOIN employees e ON h.employee_id = e.employee_id
WHERE h.is_emergency_change = TRUE
ORDER BY h.changed_at DESC;
