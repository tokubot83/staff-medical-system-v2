-- Migration: 001_create_interview_reservations
-- Description: 面談予約システムのテーブル作成
-- Created: 2025-01-16
-- Author: System Administrator

-- 面談予約テーブル
CREATE TABLE IF NOT EXISTS interview_reservations (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('regular', 'special', 'support') NOT NULL,
    sub_type VARCHAR(50),
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    urgency ENUM('low', 'medium', 'high', 'urgent'),
    
    -- 職員情報
    staff_id VARCHAR(20) NOT NULL,
    staff_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 0,
    
    -- 予約詳細
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration INT DEFAULT 30,
    location VARCHAR(100),
    online_url VARCHAR(255),
    
    -- 定期面談用
    regular_type ENUM('new_employee', 'annual', 'management'),
    regular_cycle VARCHAR(50),
    
    -- 特別面談用
    special_type ENUM('exit', 'transfer', 'return', 'promotion', 'disciplinary'),
    special_context JSON,
    special_reason TEXT,
    
    -- サポート面談用
    support_category VARCHAR(50),
    support_topic VARCHAR(255),
    support_details TEXT,
    voicedrive_request_id VARCHAR(50) UNIQUE,
    
    -- メタデータ
    source ENUM('manual', 'voicedrive', 'system') NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT
);

-- インデックス作成
CREATE INDEX idx_staff_id ON interview_reservations(staff_id);
CREATE INDEX idx_scheduled_date ON interview_reservations(scheduled_date);
CREATE INDEX idx_status ON interview_reservations(status);
CREATE INDEX idx_type ON interview_reservations(type);
CREATE INDEX idx_source ON interview_reservations(source);
CREATE INDEX idx_voicedrive_request ON interview_reservations(voicedrive_request_id);

-- 予約操作ログテーブル
CREATE TABLE IF NOT EXISTS interview_reservation_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id VARCHAR(50) NOT NULL,
    action ENUM('created', 'updated', 'cancelled', 'completed') NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changes JSON,
    reason TEXT,
    
    FOREIGN KEY (reservation_id) REFERENCES interview_reservations(id) ON DELETE CASCADE,
    INDEX idx_reservation_id (reservation_id),
    INDEX idx_performed_at (performed_at)
);

-- 通知キューテーブル
CREATE TABLE IF NOT EXISTS interview_notification_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id VARCHAR(50) NOT NULL,
    recipient_id VARCHAR(20) NOT NULL,
    notification_type ENUM('reservation_created', 'reminder', 'cancelled', 'rescheduled') NOT NULL,
    channel ENUM('email', 'app', 'sms') NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    sent_at TIMESTAMP NULL,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    retry_count INT DEFAULT 0,
    error_message TEXT,
    
    FOREIGN KEY (reservation_id) REFERENCES interview_reservations(id) ON DELETE CASCADE,
    INDEX idx_status_scheduled (status, scheduled_at),
    INDEX idx_recipient (recipient_id)
);

-- サンプルデータ挿入（開発環境用）
-- INSERT INTO interview_reservations (
--     id, type, status, staff_id, staff_name, department, position, 
--     scheduled_date, scheduled_time, source, created_by
-- ) VALUES (
--     'MANUAL-SAMPLE-001', 'regular', 'confirmed', 'STAFF001', '山田太郎', 
--     '看護部', '看護師', CURDATE(), '10:00:00', 'manual', 'admin'
-- );