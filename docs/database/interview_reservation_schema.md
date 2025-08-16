# 面談予約システム データベーススキーマ設計

## 概要
統合面談ダッシュボードで管理される面談予約データのスキーマ設計書

## テーブル構成

### 1. interview_reservations (面談予約テーブル)

#### 基本情報
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | VARCHAR(50) | PRIMARY KEY | 予約ID (MANUAL-xxx, VD-xxx, SYS-xxx) |
| type | ENUM | NOT NULL | 面談種別 ('regular', 'special', 'support') |
| sub_type | VARCHAR(50) | NULL | サブタイプ |
| status | ENUM | NOT NULL | ステータス ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') |
| urgency | ENUM | NULL | 緊急度 ('low', 'medium', 'high', 'urgent') |

#### 職員情報
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| staff_id | VARCHAR(20) | NOT NULL, FK | 職員ID |
| staff_name | VARCHAR(100) | NOT NULL | 職員名 |
| department | VARCHAR(100) | NOT NULL | 部署 |
| position | VARCHAR(100) | NOT NULL | 職位 |
| experience_years | INT | DEFAULT 0 | 経験年数 |

#### 予約詳細
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| scheduled_date | DATE | NOT NULL | 予約日 |
| scheduled_time | TIME | NOT NULL | 予約時刻 |
| duration | INT | DEFAULT 30 | 所要時間（分） |
| location | VARCHAR(100) | NULL | 場所（対面の場合） |
| online_url | VARCHAR(255) | NULL | オンラインURL |

#### 定期面談用
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| regular_type | ENUM | NULL | 定期面談種別 ('new_employee', 'annual', 'management') |
| regular_cycle | VARCHAR(50) | NULL | 実施サイクル |

#### 特別面談用
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| special_type | ENUM | NULL | 特別面談種別 ('exit', 'transfer', 'return', 'promotion', 'disciplinary') |
| special_context | JSON | NULL | 特別面談の文脈情報 |
| special_reason | TEXT | NULL | 実施理由 |

#### サポート面談用
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| support_category | VARCHAR(50) | NULL | 相談カテゴリ |
| support_topic | VARCHAR(255) | NULL | 相談トピック |
| support_details | TEXT | NULL | 相談詳細 |
| voicedrive_request_id | VARCHAR(50) | NULL, UNIQUE | VoiceDrive申込ID |

#### メタデータ
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| source | ENUM | NOT NULL | 予約ソース ('manual', 'voicedrive', 'system') |
| created_by | VARCHAR(100) | NOT NULL | 作成者 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 更新日時 |
| notes | TEXT | NULL | 備考 |

#### インデックス
```sql
CREATE INDEX idx_staff_id ON interview_reservations(staff_id);
CREATE INDEX idx_scheduled_date ON interview_reservations(scheduled_date);
CREATE INDEX idx_status ON interview_reservations(status);
CREATE INDEX idx_type ON interview_reservations(type);
CREATE INDEX idx_source ON interview_reservations(source);
CREATE INDEX idx_voicedrive_request ON interview_reservations(voicedrive_request_id);
```

### 2. interview_reservation_logs (予約操作ログテーブル)

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | INT | PRIMARY KEY AUTO_INCREMENT | ログID |
| reservation_id | VARCHAR(50) | FK | 予約ID |
| action | ENUM | NOT NULL | 操作 ('created', 'updated', 'cancelled', 'completed') |
| performed_by | VARCHAR(100) | NOT NULL | 操作者 |
| performed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 操作日時 |
| changes | JSON | NULL | 変更内容 |
| reason | TEXT | NULL | 理由 |

### 3. interview_notification_queue (通知キューテーブル)

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | INT | PRIMARY KEY AUTO_INCREMENT | 通知ID |
| reservation_id | VARCHAR(50) | FK | 予約ID |
| recipient_id | VARCHAR(20) | NOT NULL | 受信者ID |
| notification_type | ENUM | NOT NULL | 通知種別 ('reservation_created', 'reminder', 'cancelled', 'rescheduled') |
| channel | ENUM | NOT NULL | 通知チャネル ('email', 'app', 'sms') |
| scheduled_at | TIMESTAMP | NOT NULL | 送信予定日時 |
| sent_at | TIMESTAMP | NULL | 送信日時 |
| status | ENUM | DEFAULT 'pending' | ステータス ('pending', 'sent', 'failed') |
| retry_count | INT | DEFAULT 0 | リトライ回数 |
| error_message | TEXT | NULL | エラーメッセージ |

## SQL DDL

```sql
-- 面談予約テーブル
CREATE TABLE interview_reservations (
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
    notes TEXT,
    
    FOREIGN KEY (staff_id) REFERENCES staff_master(staff_id)
);

-- 予約操作ログテーブル
CREATE TABLE interview_reservation_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id VARCHAR(50) NOT NULL,
    action ENUM('created', 'updated', 'cancelled', 'completed') NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changes JSON,
    reason TEXT,
    
    FOREIGN KEY (reservation_id) REFERENCES interview_reservations(id)
);

-- 通知キューテーブル
CREATE TABLE interview_notification_queue (
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
    
    FOREIGN KEY (reservation_id) REFERENCES interview_reservations(id)
);
```

## マイグレーション考慮事項

### 既存データの移行
1. 既存の面談データがある場合、sourceを'system'として移行
2. VoiceDriveからの既存データはvoicedrive_request_idを保持
3. 過去の面談記録はstatusを'completed'に設定

### バックワード互換性
- 既存のAPIは新しいスキーマにマッピング
- 必要に応じてビューを作成して旧形式でもアクセス可能に

## インデックス戦略
1. 頻繁に検索される`staff_id`、`scheduled_date`にインデックス
2. ステータスフィルタリング用に`status`、`type`にインデックス
3. VoiceDrive連携用に`voicedrive_request_id`にユニークインデックス

## セキュリティ考慮事項
1. 個人情報を含むカラムは暗号化を検討
2. ログテーブルは改ざん防止のため、更新・削除権限を制限
3. 通知キューは個人情報を最小限に

## パフォーマンス最適化
1. 古い完了済み予約は定期的にアーカイブテーブルへ移動
2. 統計情報は集計テーブルを別途作成してキャッシュ
3. 大量の通知送信時はバッチ処理を実装