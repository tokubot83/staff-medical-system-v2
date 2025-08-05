# 職員カルテシステム ER図設計書

## 主要エンティティ関連図

```mermaid
erDiagram
    %% 施設・部署関連
    facilities ||--o{ departments : has
    facilities ||--o{ staff_assignments : contains
    departments ||--o{ staff_assignments : assigns
    
    %% 職員基本情報関連
    staff_basic ||--o{ staff_assignments : has
    staff_basic ||--o{ evaluations : receives
    staff_basic ||--o{ two_axis_evaluations : receives
    staff_basic ||--o{ staff_skills : possesses
    staff_basic ||--o{ interviews : participates
    staff_basic ||--o{ training_records : completes
    staff_basic ||--o{ health_checkups : undergoes
    staff_basic ||--o{ stress_checks : takes
    staff_basic ||--o{ attendance_summary : has
    staff_basic ||--o{ leave_records : requests
    
    %% 職位・スキル関連
    positions ||--o{ staff_assignments : defines
    skills ||--o{ staff_skills : categorizes
    
    %% 面談関連
    interviews ||--|| interview_records : generates
    interviews ||--o{ interview_outcomes : produces
    staff_basic ||--o{ interviews : conducts_as_interviewer
    
    %% 研修関連
    training_programs ||--o{ training_records : tracks
    
    %% 健康管理関連
    staff_basic ||--o{ occupational_health_records : has
    
    %% 採用関連
    recruitment_plans ||--o{ candidates : attracts
    departments ||--o{ recruitment_plans : requests
    positions ||--o{ recruitment_plans : for
    candidates ||--o| staff_basic : becomes

    %% エンティティ定義
    facilities {
        int facility_id PK
        string facility_name
        string facility_type
        string address
        string phone
        datetime created_at
        datetime updated_at
    }
    
    departments {
        int department_id PK
        int facility_id FK
        string department_name
        string department_type
        int parent_department_id
        datetime created_at
        datetime updated_at
    }
    
    staff_basic {
        int staff_id PK
        string employee_number UK
        string last_name
        string first_name
        string last_name_kana
        string first_name_kana
        string gender
        date birth_date
        string email
        string phone
        string mobile_phone
        string emergency_contact_name
        string emergency_contact_phone
        string emergency_contact_relationship
        string postal_code
        string address
        date hire_date
        string employment_type
        datetime created_at
        datetime updated_at
    }
    
    staff_assignments {
        int assignment_id PK
        int staff_id FK
        int facility_id FK
        int department_id FK
        int position_id FK
        date start_date
        date end_date
        boolean is_primary
        string assignment_reason
        datetime created_at
        datetime updated_at
    }
    
    positions {
        int position_id PK
        string position_name
        int position_level
        string position_category
        datetime created_at
        datetime updated_at
    }
    
    evaluations {
        int evaluation_id PK
        int staff_id FK
        string evaluation_period
        string evaluation_type
        string overall_rating
        int performance_score
        int skill_score
        int teamwork_score
        int growth_potential
        int evaluator_id FK
        date evaluation_date
        text comments
        datetime created_at
        datetime updated_at
    }
    
    two_axis_evaluations {
        int evaluation_id PK
        int staff_id FK
        string evaluation_period
        string facility_score
        int facility_rank
        int facility_total_staff
        string corporate_score
        int corporate_rank
        int corporate_total_staff
        string overall_score
        date evaluation_date
        int evaluator_id FK
        text comments
        datetime created_at
        datetime updated_at
    }
    
    skills {
        int skill_id PK
        string skill_name
        string skill_category
        int max_level
        datetime created_at
        datetime updated_at
    }
    
    staff_skills {
        int staff_skill_id PK
        int staff_id FK
        int skill_id FK
        int skill_level
        date certified_date
        date expiry_date
        datetime created_at
        datetime updated_at
    }
    
    interviews {
        int interview_id PK
        int staff_id FK
        int interviewer_id FK
        string interview_type
        string interview_category
        date booking_date
        time start_time
        time end_time
        int duration_minutes
        string location
        string status
        json requested_topics
        string urgency_level
        string created_by
        datetime created_at
        datetime updated_at
    }
    
    interview_records {
        int record_id PK
        int interview_id FK
        text discussion_summary
        text employee_feedback
        text interviewer_notes
        json action_items
        boolean follow_up_required
        date follow_up_date
        int confidentiality_level
        datetime created_at
        datetime updated_at
    }
    
    interview_outcomes {
        int outcome_id PK
        int interview_id FK
        string outcome_type
        text outcome_description
        date target_date
        string completion_status
        datetime created_at
        datetime updated_at
    }
    
    training_programs {
        int program_id PK
        string program_name
        string program_category
        int duration_hours
        boolean is_mandatory
        json target_positions
        json target_departments
        datetime created_at
        datetime updated_at
    }
    
    training_records {
        int record_id PK
        int staff_id FK
        int program_id FK
        date attendance_date
        string completion_status
        int score
        string evaluation
        boolean certificate_issued
        string certificate_number
        date expiry_date
        datetime created_at
        datetime updated_at
    }
    
    health_checkups {
        int checkup_id PK
        int staff_id FK
        date checkup_date
        string checkup_type
        string overall_result
        decimal height
        decimal weight
        decimal bmi
        int blood_pressure_high
        int blood_pressure_low
        decimal vision_left
        decimal vision_right
        string hearing_result
        text special_findings
        text doctor_comments
        date next_checkup_date
        datetime created_at
        datetime updated_at
    }
    
    stress_checks {
        int stress_check_id PK
        int staff_id FK
        date check_date
        int stress_index
        int physical_stress_score
        int mental_stress_score
        int work_stress_score
        int support_score
        boolean high_stress_flag
        boolean counseling_required
        date counseling_date
        boolean follow_up_required
        datetime created_at
        datetime updated_at
    }
    
    occupational_health_records {
        int record_id PK
        int staff_id FK
        date consultation_date
        string consultation_type
        text chief_complaint
        text diagnosis
        text treatment_plan
        text work_restrictions
        date follow_up_date
        int doctor_id
        datetime created_at
        datetime updated_at
    }
    
    attendance_summary {
        int summary_id PK
        int staff_id FK
        string year_month
        int scheduled_days
        int actual_days
        int absence_days
        decimal paid_leave_days
        decimal sick_leave_days
        decimal special_leave_days
        decimal overtime_hours
        decimal late_night_hours
        decimal holiday_work_hours
        datetime created_at
        datetime updated_at
    }
    
    leave_records {
        int leave_id PK
        int staff_id FK
        string leave_type
        date start_date
        date end_date
        decimal days_taken
        text reason
        string approval_status
        int approver_id
        date approved_date
        datetime created_at
        datetime updated_at
    }
    
    recruitment_plans {
        int plan_id PK
        int facility_id FK
        int department_id FK
        int position_id FK
        string fiscal_year
        int planned_count
        int hired_count
        string recruitment_type
        string status
        datetime created_at
        datetime updated_at
    }
    
    candidates {
        int candidate_id PK
        int recruitment_plan_id FK
        string name
        string email
        string phone
        date application_date
        string resume_path
        string status
        int interview_score
        string final_result
        int hired_as_staff_id
        datetime created_at
        datetime updated_at
    }
```

## 権限管理関連のER図

```mermaid
erDiagram
    users ||--|| staff_basic : represents
    users ||--o{ user_roles : has
    roles ||--o{ user_roles : assigned_to
    roles ||--o{ role_permissions : grants
    permissions ||--o{ role_permissions : included_in
    
    users {
        int user_id PK
        int staff_id FK
        string username UK
        string password_hash
        int permission_level
        boolean is_active
        datetime last_login
        datetime created_at
        datetime updated_at
    }
    
    roles {
        int role_id PK
        string role_name
        string role_description
        int role_level
        datetime created_at
        datetime updated_at
    }
    
    user_roles {
        int user_role_id PK
        int user_id FK
        int role_id FK
        date assigned_date
        date expiry_date
        datetime created_at
    }
    
    permissions {
        int permission_id PK
        string permission_name
        string resource
        string action
        datetime created_at
    }
    
    role_permissions {
        int role_permission_id PK
        int role_id FK
        int permission_id FK
        datetime created_at
    }
```

## データフロー関連図

```mermaid
graph TB
    subgraph 外部システム
        A[総務システム] --> B[職員基本情報]
        C[勤怠システム] --> D[勤怠情報]
        E[健診システム] --> F[健康情報]
        G[ストレスチェック<br/>システム] --> H[ストレス情報]
    end
    
    subgraph 職員カルテDB
        B --> I[staff_basic]
        D --> J[attendance_summary]
        F --> K[health_checkups]
        H --> L[stress_checks]
    end
    
    subgraph 人事部門入力
        M[面談実施] --> N[interviews]
        O[評価入力] --> P[evaluations]
        Q[研修管理] --> R[training_records]
    end
    
    subgraph 分析・レポート
        I --> S[離職リスク分析]
        J --> S
        K --> S
        L --> S
        N --> S
        P --> S
        
        S --> T[アラート生成]
        S --> U[レポート出力]
    end
```

## インデックス設計詳細

### プライマリーインデックス
- 各テーブルのPK

### セカンダリーインデックス
```sql
-- 頻繁な検索用
CREATE INDEX idx_staff_employee_number ON staff_basic(employee_number);
CREATE INDEX idx_staff_email ON staff_basic(email);
CREATE INDEX idx_assignments_staff_facility ON staff_assignments(staff_id, facility_id);
CREATE INDEX idx_interviews_staff_date ON interviews(staff_id, booking_date);
CREATE INDEX idx_interviews_interviewer_date ON interviews(interviewer_id, booking_date);
CREATE INDEX idx_evaluations_staff_period ON evaluations(staff_id, evaluation_period);
CREATE INDEX idx_attendance_staff_month ON attendance_summary(staff_id, year_month);

-- 集計用複合インデックス
CREATE INDEX idx_assignments_current ON staff_assignments(is_primary, end_date) WHERE end_date IS NULL;
CREATE INDEX idx_stress_high ON stress_checks(check_date, high_stress_flag) WHERE high_stress_flag = true;
CREATE INDEX idx_interviews_status ON interviews(status, booking_date);

-- フルテキスト検索用
CREATE FULLTEXT INDEX idx_interview_notes ON interview_records(discussion_summary, interviewer_notes);
```

## データ整合性制約

### 外部キー制約
- すべてのFKに対してCASCADE UPDATE、RESTRICT DELETE設定

### チェック制約
```sql
-- 評価スコアの範囲
ALTER TABLE evaluations ADD CONSTRAINT chk_scores 
  CHECK (performance_score BETWEEN 0 AND 100 
    AND skill_score BETWEEN 0 AND 100 
    AND teamwork_score BETWEEN 0 AND 100
    AND growth_potential BETWEEN 1 AND 5);

-- 面談時間の整合性
ALTER TABLE interviews ADD CONSTRAINT chk_interview_time
  CHECK (end_time > start_time);

-- ストレス指数の範囲
ALTER TABLE stress_checks ADD CONSTRAINT chk_stress_index
  CHECK (stress_index BETWEEN 0 AND 100);
```

### トリガー
```sql
-- 年齢自動計算
CREATE TRIGGER calculate_age 
  BEFORE INSERT OR UPDATE ON staff_basic
  FOR EACH ROW
  EXECUTE FUNCTION update_age_from_birthdate();

-- 配属終了時の処理
CREATE TRIGGER end_assignment
  AFTER UPDATE ON staff_assignments
  FOR EACH ROW
  WHEN (NEW.end_date IS NOT NULL AND OLD.end_date IS NULL)
  EXECUTE FUNCTION handle_assignment_end();
```