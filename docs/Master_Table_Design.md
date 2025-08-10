# マスターテーブル設計書

**作成日**: 2025年8月10日  
**バージョン**: 1.0.0  
**目的**: 面談システムの拡張性を確保するためのマスターテーブル設計

---

## 1. 設計方針

### 基本原則
- **拡張性**: 新しい面談タイプやカテゴリを容易に追加可能
- **保守性**: マスターデータの一元管理
- **互換性**: 既存データとの後方互換性を維持
- **パフォーマンス**: 適切なインデックス設計

---

## 2. テーブル構造

### 2.1 面談分類マスター（interview_classifications）

```sql
CREATE TABLE interview_classifications (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(7),
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  updated_by VARCHAR(100),
  metadata JSON,
  INDEX idx_active (active),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 初期データ
INSERT INTO interview_classifications (id, name, description, icon, color, sort_order) VALUES
('regular', '定期面談', '月次・年次・半期などの定期的な面談', '📅', '#4CAF50', 1),
('special', '特別面談', '特定の状況で実施する面談', '⚠️', '#FF9800', 2),
('support', 'サポート面談', '職員の希望に応じて実施する支援面談', '💬', '#2196F3', 3);
```

### 2.2 面談タイプマスター（interview_types）

```sql
CREATE TABLE interview_types (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  classification_id VARCHAR(50) NOT NULL,
  target_description VARCHAR(200),
  frequency VARCHAR(50),
  trigger_condition VARCHAR(200),
  requires_category BOOLEAN DEFAULT false,
  min_duration_minutes INT DEFAULT 30,
  max_duration_minutes INT DEFAULT 60,
  advance_booking_days INT DEFAULT 30,
  cancellation_deadline_hours INT DEFAULT 24,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  updated_by VARCHAR(100),
  metadata JSON,
  FOREIGN KEY (classification_id) REFERENCES interview_classifications(id),
  INDEX idx_classification (classification_id),
  INDEX idx_active (active),
  INDEX idx_sort (sort_order),
  INDEX idx_valid_date (valid_from, valid_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.3 カテゴリマスター（interview_categories）

```sql
CREATE TABLE interview_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_key VARCHAR(50) NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  interview_type_id VARCHAR(50) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  FOREIGN KEY (interview_type_id) REFERENCES interview_types(id),
  UNIQUE KEY uk_type_category (interview_type_id, category_key),
  INDEX idx_type (interview_type_id),
  INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.4 面談設定マスター（interview_settings）

```sql
CREATE TABLE interview_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description TEXT,
  category VARCHAR(50),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (setting_key),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 初期設定
INSERT INTO interview_settings (setting_key, setting_value, setting_type, description, category) VALUES
('max_bookings_per_day', '10', 'number', '1日あたりの最大予約数', 'booking'),
('advance_booking_days', '30', 'number', '予約可能な日数', 'booking'),
('enable_notifications', 'true', 'boolean', '通知機能の有効化', 'notification'),
('enable_auto_reminders', 'true', 'boolean', '自動リマインダーの有効化', 'notification');
```

### 2.5 フィーチャーフラグマスター（feature_flags）

```sql
CREATE TABLE feature_flags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature_key VARCHAR(100) NOT NULL UNIQUE,
  feature_name VARCHAR(200) NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INT DEFAULT 0,
  whitelist_users JSON,
  blacklist_users JSON,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  metadata JSON,
  INDEX idx_key (feature_key),
  INDEX idx_enabled (enabled),
  INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 初期フィーチャーフラグ
INSERT INTO feature_flags (feature_key, feature_name, description, enabled) VALUES
('ai_assistant', 'AI面談アシスタント', 'AIによる面談支援機能', false),
('video_conference', 'ビデオ会議', 'オンライン面談機能', false),
('transcription', '文字起こし', '面談内容の自動文字起こし', false),
('multi_language', '多言語対応', '多言語サポート', false);
```

---

## 3. ビュー定義

### 3.1 アクティブな面談タイプビュー

```sql
CREATE VIEW v_active_interview_types AS
SELECT 
  t.id,
  t.name,
  t.classification_id,
  c.name as classification_name,
  c.icon as classification_icon,
  c.color as classification_color,
  t.target_description,
  t.frequency,
  t.trigger_condition,
  t.requires_category,
  t.min_duration_minutes,
  t.max_duration_minutes,
  t.sort_order
FROM interview_types t
INNER JOIN interview_classifications c ON t.classification_id = c.id
WHERE t.active = true 
  AND c.active = true
  AND (t.valid_from IS NULL OR t.valid_from <= CURDATE())
  AND (t.valid_until IS NULL OR t.valid_until >= CURDATE())
ORDER BY c.sort_order, t.sort_order;
```

### 3.2 カテゴリ付き面談タイプビュー

```sql
CREATE VIEW v_interview_types_with_categories AS
SELECT 
  t.id as type_id,
  t.name as type_name,
  t.requires_category,
  cat.category_key,
  cat.category_name,
  cat.sort_order as category_sort_order
FROM interview_types t
LEFT JOIN interview_categories cat ON t.id = cat.interview_type_id AND cat.active = true
WHERE t.active = true
ORDER BY t.sort_order, cat.sort_order;
```

---

## 4. インデックス戦略

### パフォーマンス最適化のためのインデックス

```sql
-- 頻繁に使用される検索条件用
CREATE INDEX idx_booking_search ON interview_bookings(interview_type_id, booking_date, status);
CREATE INDEX idx_staff_bookings ON interview_bookings(staff_id, booking_date);

-- 集計クエリ用
CREATE INDEX idx_type_stats ON interview_bookings(interview_type_id, status, created_at);
```

---

## 5. データ移行計画

### 5.1 既存データからの移行

```sql
-- 既存のハードコードされたデータをマスターテーブルに移行
INSERT INTO interview_types (id, name, classification_id, target_description, requires_category)
SELECT 
  old_type_code as id,
  old_type_name as name,
  CASE 
    WHEN old_type_code IN ('new_employee_monthly', 'regular_annual', 'management_biannual') THEN 'regular'
    WHEN old_type_code IN ('return_to_work', 'incident_followup', 'exit_interview') THEN 'special'
    ELSE 'support'
  END as classification_id,
  old_target as target_description,
  CASE 
    WHEN old_type_code IN ('career_support', 'workplace_support', 'individual_consultation') THEN true
    ELSE false
  END as requires_category
FROM legacy_interview_types;
```

### 5.2 バックアップ戦略

```sql
-- マスターデータのバックアップテーブル
CREATE TABLE interview_types_backup LIKE interview_types;
CREATE TABLE interview_classifications_backup LIKE interview_classifications;
CREATE TABLE interview_categories_backup LIKE interview_categories;

-- 定期バックアップ用プロシージャ
DELIMITER //
CREATE PROCEDURE backup_master_data()
BEGIN
  INSERT INTO interview_types_backup SELECT * FROM interview_types;
  INSERT INTO interview_classifications_backup SELECT * FROM interview_classifications;
  INSERT INTO interview_categories_backup SELECT * FROM interview_categories;
END //
DELIMITER ;
```

---

## 6. 運用手順

### 6.1 新しい面談タイプの追加

```sql
-- 1. 面談タイプを追加
INSERT INTO interview_types (
  id, name, classification_id, target_description, 
  requires_category, active, sort_order
) VALUES (
  'mental_health_check', 
  'メンタルヘルスチェック面談', 
  'special',
  'メンタルヘルス不調の兆候がある職員',
  false,
  true,
  11
);

-- 2. 必要に応じてカテゴリを追加
INSERT INTO interview_categories (
  category_key, category_name, interview_type_id, sort_order
) VALUES 
  ('stress_management', 'ストレス管理', 'mental_health_check', 1),
  ('work_life_balance', 'ワークライフバランス', 'mental_health_check', 2);
```

### 6.2 面談タイプの無効化

```sql
-- ソフトデリート（データは残す）
UPDATE interview_types 
SET active = false, 
    updated_at = NOW(), 
    updated_by = 'admin'
WHERE id = 'old_interview_type';
```

---

## 7. 監視とメンテナンス

### 7.1 利用状況モニタリング

```sql
-- 面談タイプ別の利用状況
SELECT 
  t.name,
  COUNT(b.id) as booking_count,
  DATE(b.created_at) as date
FROM interview_types t
LEFT JOIN interview_bookings b ON t.id = b.interview_type_id
WHERE b.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY t.id, DATE(b.created_at);
```

### 7.2 データ整合性チェック

```sql
-- 孤立したカテゴリのチェック
SELECT cat.* 
FROM interview_categories cat
LEFT JOIN interview_types t ON cat.interview_type_id = t.id
WHERE t.id IS NULL;

-- 無効な参照のチェック
SELECT b.*
FROM interview_bookings b
LEFT JOIN interview_types t ON b.interview_type_id = t.id
WHERE t.id IS NULL OR t.active = false;
```

---

## 8. セキュリティ考慮事項

- マスターデータへの書き込み権限は管理者のみ
- 監査ログの実装（created_by, updated_by）
- SQLインジェクション対策（プリペアドステートメント使用）
- 定期的なバックアップとリストア訓練

---

**以上**