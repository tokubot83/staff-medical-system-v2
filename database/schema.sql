-- ================================================================================
-- 医療職員管理システム MySQLデータベーススキーマ
-- Version: 1.0.0
-- Created: 2025-01-08
-- Database: staff_medical_system
-- ================================================================================

-- データベース作成
CREATE DATABASE IF NOT EXISTS staff_medical_system
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE staff_medical_system;

-- ================================================================================
-- 1. 基本マスターテーブル
-- ================================================================================

-- 部署マスター
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  parent_id INT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_departments_code (code),
  INDEX idx_departments_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 職位マスター
CREATE TABLE positions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  category ENUM('nurse', 'assistant_nurse', 'nursing_aide', 'care_worker', 'pt', 'ot', 'st', 'admin') NOT NULL,
  level INT NOT NULL COMMENT '職位レベル (1-10)',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_positions_category (category),
  INDEX idx_positions_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 施設タイプマスター
CREATE TABLE facility_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- 2. 職員関連テーブル
-- ================================================================================

-- 職員基本情報
CREATE TABLE staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_number VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  name_kana VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  department_id INT,
  position_id INT,
  hire_date DATE NOT NULL,
  birth_date DATE,
  gender ENUM('male', 'female', 'other'),
  employment_type ENUM('full_time', 'part_time', 'contract', 'temporary') DEFAULT 'full_time',
  status ENUM('active', 'leave', 'retired', 'suspended') DEFAULT 'active',
  facility_type_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL,
  FOREIGN KEY (facility_type_id) REFERENCES facility_types(id) ON DELETE SET NULL,
  INDEX idx_staff_employee_number (employee_number),
  INDEX idx_staff_department (department_id),
  INDEX idx_staff_position (position_id),
  INDEX idx_staff_status (status),
  INDEX idx_staff_hire_date (hire_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 職員スキル情報
CREATE TABLE staff_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  skill_category VARCHAR(50) NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level INT DEFAULT 1 COMMENT '習熟度 (1-5)',
  certified_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  INDEX idx_staff_skills_staff (staff_id),
  INDEX idx_staff_skills_category (skill_category),
  UNIQUE KEY uk_staff_skill (staff_id, skill_category, skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- 3. 面談関連テーブル
-- ================================================================================

-- 面談種類マスター
CREATE TABLE interview_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  category ENUM('regular', 'special', 'support') NOT NULL,
  description TEXT,
  default_duration INT DEFAULT 30 COMMENT '標準時間（分）',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_interview_types_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 面談記録
CREATE TABLE interviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  interview_number VARCHAR(30) NOT NULL UNIQUE,
  staff_id INT NOT NULL,
  interviewer_id INT NOT NULL,
  interview_type_id INT NOT NULL,
  interview_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  duration INT COMMENT '実施時間（分）',
  status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  location VARCHAR(100),
  purpose TEXT,
  summary TEXT,
  action_items TEXT,
  next_interview_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  FOREIGN KEY (interviewer_id) REFERENCES staff(id) ON DELETE RESTRICT,
  FOREIGN KEY (interview_type_id) REFERENCES interview_types(id) ON DELETE RESTRICT,
  INDEX idx_interviews_staff (staff_id),
  INDEX idx_interviews_interviewer (interviewer_id),
  INDEX idx_interviews_date (interview_date),
  INDEX idx_interviews_status (status),
  INDEX idx_interviews_type (interview_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 面談質問と回答
CREATE TABLE interview_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  interview_id INT NOT NULL,
  section_name VARCHAR(100) NOT NULL,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('text', 'rating', 'choice', 'multi_choice', 'boolean') DEFAULT 'text',
  response_text TEXT,
  response_rating INT,
  response_choice VARCHAR(255),
  is_important BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
  INDEX idx_interview_responses_interview (interview_id),
  INDEX idx_interview_responses_section (section_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 面談シートテンプレート
CREATE TABLE interview_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  interview_type_id INT NOT NULL,
  experience_level ENUM('new', 'junior', 'general', 'midlevel', 'senior', 'veteran', 'leader', 'chief') NOT NULL,
  duration INT NOT NULL COMMENT '想定時間（分）',
  version VARCHAR(10) DEFAULT 'v1',
  template_data JSON NOT NULL COMMENT '質問構造をJSON形式で保存',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (interview_type_id) REFERENCES interview_types(id) ON DELETE RESTRICT,
  INDEX idx_templates_type (interview_type_id),
  INDEX idx_templates_experience (experience_level),
  INDEX idx_templates_duration (duration)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- 4. 評価関連テーブル
-- ================================================================================

-- 評価期間
CREATE TABLE evaluation_periods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('planning', 'active', 'completed', 'archived') DEFAULT 'planning',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_evaluation_periods_status (status),
  INDEX idx_evaluation_periods_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 評価記録
CREATE TABLE evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evaluation_number VARCHAR(30) NOT NULL UNIQUE,
  staff_id INT NOT NULL,
  evaluator_id INT NOT NULL,
  evaluation_period_id INT NOT NULL,
  evaluation_date DATE NOT NULL,
  overall_score DECIMAL(5,2),
  performance_score DECIMAL(5,2),
  skill_score DECIMAL(5,2),
  attitude_score DECIMAL(5,2),
  growth_score DECIMAL(5,2),
  status ENUM('draft', 'submitted', 'reviewed', 'approved', 'rejected') DEFAULT 'draft',
  comments TEXT,
  strengths TEXT,
  improvements TEXT,
  goals TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  FOREIGN KEY (evaluator_id) REFERENCES staff(id) ON DELETE RESTRICT,
  FOREIGN KEY (evaluation_period_id) REFERENCES evaluation_periods(id) ON DELETE RESTRICT,
  INDEX idx_evaluations_staff (staff_id),
  INDEX idx_evaluations_evaluator (evaluator_id),
  INDEX idx_evaluations_period (evaluation_period_id),
  INDEX idx_evaluations_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 評価項目詳細
CREATE TABLE evaluation_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evaluation_id INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) DEFAULT 5.0,
  weight DECIMAL(5,2) DEFAULT 1.0,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE,
  INDEX idx_evaluation_items_evaluation (evaluation_id),
  INDEX idx_evaluation_items_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- 5. システム管理テーブル
-- ================================================================================

-- ユーザーアカウント
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  staff_id INT,
  role ENUM('admin', 'manager', 'interviewer', 'staff', 'viewer') DEFAULT 'staff',
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
  INDEX idx_users_username (username),
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 監査ログ
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50),
  record_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_logs_user (user_id),
  INDEX idx_audit_logs_action (action),
  INDEX idx_audit_logs_table (table_name),
  INDEX idx_audit_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- システム設定
CREATE TABLE system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_system_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- 6. ビュー作成
-- ================================================================================

-- 職員詳細ビュー
CREATE VIEW v_staff_details AS
SELECT 
  s.id,
  s.employee_number,
  s.name,
  s.name_kana,
  s.email,
  d.name AS department_name,
  p.name AS position_name,
  p.category AS job_category,
  p.level AS position_level,
  s.hire_date,
  TIMESTAMPDIFF(YEAR, s.hire_date, CURDATE()) AS years_of_service,
  s.status,
  ft.name AS facility_type
FROM staff s
LEFT JOIN departments d ON s.department_id = d.id
LEFT JOIN positions p ON s.position_id = p.id
LEFT JOIN facility_types ft ON s.facility_type_id = ft.id
WHERE s.deleted_at IS NULL;

-- 面談サマリービュー
CREATE VIEW v_interview_summary AS
SELECT 
  i.id,
  i.interview_number,
  s.name AS staff_name,
  s.employee_number,
  interviewer.name AS interviewer_name,
  it.name AS interview_type,
  it.category AS interview_category,
  i.interview_date,
  i.duration,
  i.status,
  i.summary
FROM interviews i
JOIN staff s ON i.staff_id = s.id
JOIN staff interviewer ON i.interviewer_id = interviewer.id
JOIN interview_types it ON i.interview_type_id = it.id;

-- ================================================================================
-- 7. トリガー
-- ================================================================================

-- 面談番号自動生成トリガー
DELIMITER //
CREATE TRIGGER before_insert_interview
BEFORE INSERT ON interviews
FOR EACH ROW
BEGIN
  IF NEW.interview_number IS NULL THEN
    SET NEW.interview_number = CONCAT(
      'INT-',
      DATE_FORMAT(NOW(), '%Y%m%d'),
      '-',
      LPAD((SELECT IFNULL(MAX(CAST(SUBSTRING_INDEX(interview_number, '-', -1) AS UNSIGNED)), 0) + 1
            FROM interviews 
            WHERE DATE(created_at) = CURDATE()), 4, '0')
    );
  END IF;
END//
DELIMITER ;

-- 評価番号自動生成トリガー
DELIMITER //
CREATE TRIGGER before_insert_evaluation
BEFORE INSERT ON evaluations
FOR EACH ROW
BEGIN
  IF NEW.evaluation_number IS NULL THEN
    SET NEW.evaluation_number = CONCAT(
      'EVL-',
      DATE_FORMAT(NOW(), '%Y%m%d'),
      '-',
      LPAD((SELECT IFNULL(MAX(CAST(SUBSTRING_INDEX(evaluation_number, '-', -1) AS UNSIGNED)), 0) + 1
            FROM evaluations 
            WHERE DATE(created_at) = CURDATE()), 4, '0')
    );
  END IF;
END//
DELIMITER ;

-- ================================================================================
-- 8. インデックス最適化
-- ================================================================================

-- 複合インデックス（よく使われる検索条件）
CREATE INDEX idx_interviews_staff_date ON interviews(staff_id, interview_date);
CREATE INDEX idx_evaluations_staff_period ON evaluations(staff_id, evaluation_period_id);
CREATE INDEX idx_staff_dept_position ON staff(department_id, position_id);

-- ================================================================================
-- END OF SCHEMA
-- ================================================================================