# 職員カルテシステム データベース設計参考書

## 1. システム全体で必要なテーブル一覧

### 1.1 マスターテーブル

#### facilities（施設マスター）
- facility_id (PK)
- facility_name
- facility_type
- address
- phone
- created_at
- updated_at

#### departments（部署マスター）
- department_id (PK)
- facility_id (FK)
- department_name
- department_type
- parent_department_id
- created_at
- updated_at

#### positions（職位マスター）
- position_id (PK)
- position_name
- position_level
- position_category
- created_at
- updated_at

#### skills（スキルマスター）
- skill_id (PK)
- skill_name
- skill_category
- max_level
- created_at
- updated_at

### 1.2 職員基本情報（総務部門から提供）

#### staff_basic（職員基本情報）
- staff_id (PK)
- employee_number (UNIQUE)
- last_name
- first_name
- last_name_kana
- first_name_kana
- gender
- birth_date
- age (計算フィールド)
- email
- phone
- mobile_phone
- emergency_contact_name
- emergency_contact_phone
- emergency_contact_relationship
- postal_code
- address
- hire_date
- employment_type
- **employment_status (Phase 4追加)** - ENUM('active', 'resigned', 'on_leave', 'suspended') DEFAULT 'active'
- **resignation_date (Phase 4追加)** - 退職日
- **resignation_reason (Phase 4追加)** - 退職理由コード（FK to resignation_reasons）
- **resignation_reason_detail (Phase 4追加)** - 退職理由詳細（TEXT）
- **last_working_date (Phase 4追加)** - 最終勤務日
- **resignation_notice_date (Phase 4追加)** - 退職申し出日
- **exit_interview_applicable (Phase 4追加)** - 退職面談実施対象 (BOOLEAN)
- **exit_interview_completed (Phase 4追加)** - 退職面談実施済み (BOOLEAN)
- **exit_interview_id (Phase 4追加)** - 退職面談ID（FK to exit_interviews）
- **exit_interview_skipped_reason (Phase 4追加)** - 面談未実施理由
- **exit_interview_waived_by (Phase 4追加)** - 面談免除承認者ID（FK to staff_basic）
- **rehire_eligible (Phase 4追加)** - 再雇用可能フラグ (BOOLEAN)
- **rehire_notes (Phase 4追加)** - 再雇用に関するメモ (TEXT)
- created_at
- updated_at

**インデックス（Phase 4追加）:**
- INDEX idx_employment_status (employment_status)
- INDEX idx_resignation_date (resignation_date)
- INDEX idx_rehire_eligible (rehire_eligible)

#### staff_assignments（配属情報）
- assignment_id (PK)
- staff_id (FK)
- facility_id (FK)
- department_id (FK)
- position_id (FK)
- start_date
- end_date
- is_primary
- assignment_reason
- created_at
- updated_at

### 1.3 評価・人事情報（人事部門管理）

#### evaluations（人事評価）
- evaluation_id (PK)
- staff_id (FK)
- evaluation_period
- evaluation_type
- overall_rating
- performance_score (0-100)
- skill_score (0-100)
- teamwork_score (0-100)
- growth_potential (1-5)
- evaluator_id (FK)
- evaluation_date
- comments
- created_at
- updated_at

#### two_axis_evaluations（2軸評価）
- evaluation_id (PK)
- staff_id (FK)
- evaluation_period
- facility_score (S/A/B/C/D)
- facility_rank
- facility_total_staff
- corporate_score (S/A/B/C/D)
- corporate_rank
- corporate_total_staff
- overall_score (S/A/B/C/D)
- evaluation_date
- evaluator_id (FK)
- comments
- created_at
- updated_at

#### staff_skills（職員スキル）
- staff_skill_id (PK)
- staff_id (FK)
- skill_id (FK)
- skill_level (0-100)
- certified_date
- expiry_date
- created_at
- updated_at

### 1.4 面談情報（人事部門管理）

#### interviews（面談記録）
- interview_id (PK)
- staff_id (FK)
- interviewer_id (FK)
- interview_type (定期/臨時/緊急など)
- interview_category
- booking_date
- start_time
- end_time
- duration_minutes
- location
- status (予定/実施済/キャンセル)
- requested_topics (JSON)
- urgency_level
- created_by
- created_at
- updated_at

#### interview_records（面談実施記録）
- record_id (PK)
- interview_id (FK)
- discussion_summary
- employee_feedback
- interviewer_notes
- action_items (JSON)
- follow_up_required
- follow_up_date
- confidentiality_level
- created_at
- updated_at

#### interview_outcomes（面談成果）
- outcome_id (PK)
- interview_id (FK)
- outcome_type
- outcome_description
- target_date
- completion_status
- created_at
- updated_at

### 1.5 健康管理情報（産業医・検診室から提供）

#### health_checkups（健康診断）
- checkup_id (PK)
- staff_id (FK)
- checkup_date
- checkup_type
- overall_result
- height
- weight
- bmi
- blood_pressure_high
- blood_pressure_low
- vision_left
- vision_right
- hearing_result
- special_findings
- doctor_comments
- next_checkup_date
- created_at
- updated_at

#### stress_checks（ストレスチェック）
- stress_check_id (PK)
- staff_id (FK)
- check_date
- stress_index (0-100)
- physical_stress_score
- mental_stress_score
- work_stress_score
- support_score
- high_stress_flag
- counseling_required
- counseling_date
- follow_up_required
- created_at
- updated_at

#### occupational_health_records（産業医面談記録）
- record_id (PK)
- staff_id (FK)
- consultation_date
- consultation_type
- chief_complaint
- diagnosis
- treatment_plan
- work_restrictions
- follow_up_date
- doctor_id
- created_at
- updated_at

### 1.6 勤怠情報（勤怠システムから提供）

#### attendance_summary（勤怠サマリー）
- summary_id (PK)
- staff_id (FK)
- year_month
- scheduled_days
- actual_days
- absence_days
- paid_leave_days
- sick_leave_days
- special_leave_days
- overtime_hours
- late_night_hours
- holiday_work_hours
- created_at
- updated_at

#### leave_records（休暇記録）
- leave_id (PK)
- staff_id (FK)
- leave_type
- start_date
- end_date
- days_taken
- reason
- approval_status
- approver_id
- approved_date
- created_at
- updated_at

### 1.7 教育・研修情報

#### training_programs（研修プログラム）
- program_id (PK)
- program_name
- program_category
- duration_hours
- is_mandatory
- target_positions (JSON)
- target_departments (JSON)
- created_at
- updated_at

#### training_records（研修受講記録）
- record_id (PK)
- staff_id (FK)
- program_id (FK)
- attendance_date
- completion_status
- score
- evaluation
- certificate_issued
- certificate_number
- expiry_date
- created_at
- updated_at

### 1.8 採用情報

#### recruitment_plans（採用計画）
- plan_id (PK)
- facility_id (FK)
- department_id (FK)
- position_id (FK)
- fiscal_year
- planned_count
- hired_count
- recruitment_type
- status
- created_at
- updated_at

#### candidates（応募者情報）
- candidate_id (PK)
- recruitment_plan_id (FK)
- name
- email
- phone
- application_date
- resume_path
- status
- interview_score
- final_result
- hired_as_staff_id
- created_at
- updated_at

## 2. 各画面で必要なデータ

### 2.1 ダッシュボード画面
必要なテーブル：
- staff_basic（職員数カウント）
- staff_assignments（配属状況）
- interviews（本日の面談予定）
- stress_checks（高ストレス職員）
- evaluations（評価状況）
- attendance_summary（勤怠状況）

クエリ例：
- 緊急対応が必要な職員（離職リスク、高ストレス、連続欠勤）
- 本日のタスク一覧
- 優秀職員・昇進候補者
- 部署別の状況サマリー

### 2.2 職員カルテ画面
必要なテーブル：
- staff_basic（基本情報）
- staff_assignments（配属履歴）
- evaluations（評価履歴）
- two_axis_evaluations（2軸評価）
- staff_skills（保有スキル）
- training_records（研修履歴）
- health_checkups（健康診断結果）
- stress_checks（ストレスチェック結果）
- interviews（面談履歴）
- attendance_summary（勤怠状況）

### 2.3 面談管理画面
必要なテーブル：
- interviews（面談予定・履歴）
- interview_records（面談記録）
- interview_outcomes（面談成果）
- staff_basic（職員情報）
- staff_assignments（所属情報）

権限チェック：
- user_permissions（ユーザー権限）テーブルも必要

### 2.4 教育・研修画面
必要なテーブル：
- training_programs（研修プログラム）
- training_records（受講記録）
- staff_basic（職員情報）
- staff_skills（スキル情報）

### 2.5 評価管理画面
必要なテーブル：
- evaluations（評価情報）
- two_axis_evaluations（2軸評価）
- staff_basic（職員情報）
- staff_assignments（所属情報）
- staff_skills（スキル情報）

### 2.6 人材戦略画面
必要なテーブル：
- staff_basic（職員情報）
- evaluations（評価情報）
- two_axis_evaluations（2軸評価）
- staff_assignments（配属情報）
- succession_plans（後継者計画）※新規テーブル

### 2.7 採用管理画面
必要なテーブル：
- recruitment_plans（採用計画）
- candidates（応募者情報）
- departments（部署情報）
- positions（職位情報）

### 2.8 健康管理画面
必要なテーブル：
- health_checkups（健康診断）
- stress_checks（ストレスチェック）
- occupational_health_records（産業医記録）
- staff_basic（職員情報）

### 2.9 勤怠管理画面
必要なテーブル：
- attendance_summary（勤怠サマリー）
- leave_records（休暇記録）
- staff_basic（職員情報）
- staff_assignments（所属情報）

### 2.10 レポート画面
全テーブルから必要に応じてデータを集計・分析

## 3. データ連携と更新頻度

### 3.1 リアルタイム更新が必要なデータ
- 面談予約・キャンセル
- 緊急アラート（離職リスク、高ストレスなど）
- タスクの完了状況

### 3.2 日次更新で十分なデータ
- 勤怠情報
- 職員の基本情報変更
- 配属変更

### 3.3 月次更新で十分なデータ
- 評価情報
- 健康診断結果
- ストレスチェック結果

## 4. セキュリティ要件

### 4.1 アクセス制御が必要なテーブル
- health_checkups（健康情報）
- stress_checks（メンタルヘルス情報）
- occupational_health_records（医療情報）
- interview_records（機密性の高い面談内容）
- evaluations（人事評価）

### 4.2 暗号化が必要なフィールド
- 個人識別情報（氏名、生年月日、住所など）
- 健康・医療情報
- 評価・給与情報

## 5. インデックス設計の推奨

### 5.1 頻繁に検索されるフィールド
- staff_basic: employee_number, email, facility_id + department_id
- interviews: staff_id + booking_date, interviewer_id + booking_date
- evaluations: staff_id + evaluation_period
- attendance_summary: staff_id + year_month

### 5.2 集計に使用されるフィールド
- staff_assignments: facility_id, department_id, position_id
- stress_checks: check_date, high_stress_flag
- training_records: program_id, completion_status

## 6. 将来の拡張性考慮事項

### 6.1 追加予定のテーブル
- career_paths（キャリアパス）
- talent_pools（タレントプール）
- engagement_surveys（エンゲージメント調査）

### 6.2 Phase 4: 退職管理テーブル（詳細設計）

#### exit_interviews（退職面談）
- exit_interview_id (PK)
- staff_id (FK to staff_basic)
- interview_type - 'exit' (固定値)
- booking_date - 面談予定日
- conducted_date - 面談実施日
- interviewer_id (FK to staff_basic) - 面談担当者
- location - 面談場所
- duration_minutes - 面談時間（分）
- **resignation_reason_primary (Phase 4)** - 主要退職理由（FK to resignation_reasons）
- **resignation_reason_secondary (Phase 4)** - 副次的退職理由（FK to resignation_reasons）
- **satisfaction_score (Phase 4)** - 総合満足度（1-5）
- **would_recommend (Phase 4)** - 他者推奨意向 (BOOLEAN)
- **rehire_interest (Phase 4)** - 再雇用希望 (BOOLEAN)
- **work_environment_rating (Phase 4)** - 職場環境評価（1-5）
- **management_rating (Phase 4)** - マネジメント評価（1-5）
- **compensation_rating (Phase 4)** - 給与待遇評価（1-5）
- **career_development_rating (Phase 4)** - キャリア開発評価（1-5）
- **work_life_balance_rating (Phase 4)** - ワークライフバランス評価（1-5）
- **positive_aspects (Phase 4)** - 良かった点（TEXT）
- **improvement_suggestions (Phase 4)** - 改善提案（TEXT）
- **farewell_message (Phase 4)** - 最後のメッセージ（TEXT）
- discussion_summary - 面談サマリー（TEXT）
- next_action - 次のアクション
- status - ENUM('scheduled', 'completed', 'cancelled', 'waived')
- waived_reason - 面談免除理由
- waived_approved_by (FK to staff_basic) - 免除承認者
- created_at
- updated_at
- created_by (FK to staff_basic)
- updated_by (FK to staff_basic)

**インデックス:**
- INDEX idx_staff (staff_id)
- INDEX idx_conducted_date (conducted_date)
- INDEX idx_status (status)

#### resignation_reasons（退職理由マスター）
- reason_id (PK)
- reason_code - VARCHAR(50) UNIQUE - 'personal', 'career_change', 'relocation', etc.
- reason_name_ja - 退職理由名（日本語）
- reason_name_en - 退職理由名（英語）
- category - ENUM('voluntary', 'involuntary', 'neutral') - 自己都合/会社都合/中立
- requires_exit_interview - 面談必要性 (BOOLEAN)
- requires_approval - 承認必要性 (BOOLEAN)
- display_order - 表示順序
- is_active - 有効フラグ (BOOLEAN)
- created_at
- updated_at

**初期データ:**
```sql
INSERT INTO resignation_reasons (reason_code, reason_name_ja, category, requires_exit_interview) VALUES
('personal', '自己都合', 'voluntary', TRUE),
('career_change', 'キャリアチェンジ', 'voluntary', TRUE),
('relocation', '転居', 'voluntary', TRUE),
('health', '健康上の理由', 'neutral', FALSE),
('family', '家庭の事情', 'neutral', TRUE),
('retirement', '定年退職', 'neutral', TRUE),
('contract_end', '契約期間満了', 'neutral', FALSE),
('disciplinary', '懲戒', 'involuntary', FALSE),
('company_initiated', '会社都合', 'involuntary', FALSE),
('other', 'その他', 'neutral', TRUE);
```

#### previous_employment_records（過去の雇用記録ビュー - 採用管理用）
退職者が再応募した際の検索用マテリアライズドビュー

```sql
CREATE MATERIALIZED VIEW previous_employment_records AS
SELECT
    s.staff_id,
    s.employee_number,
    s.last_name,
    s.first_name,
    s.email,
    s.phone,
    s.hire_date,
    s.resignation_date,
    s.last_working_date,
    r.reason_name_ja as resignation_reason,
    s.resignation_reason_detail,
    sa.facility_id as last_facility_id,
    sa.department_id as last_department_id,
    sa.position_id as last_position_id,
    f.facility_name as last_facility,
    d.department_name as last_department,
    p.position_name as last_position,
    AVG(e.overall_rating) as avg_evaluation,
    MAX(e.overall_rating) as highest_evaluation,
    ei.satisfaction_score as exit_satisfaction,
    ei.would_recommend,
    s.rehire_eligible,
    s.rehire_notes,
    DATEDIFF(s.resignation_date, s.hire_date) as days_employed
FROM staff_basic s
LEFT JOIN resignation_reasons r ON s.resignation_reason = r.reason_code
LEFT JOIN staff_assignments sa ON s.staff_id = sa.staff_id AND sa.is_primary = TRUE
LEFT JOIN facilities f ON sa.facility_id = f.facility_id
LEFT JOIN departments d ON sa.department_id = d.department_id
LEFT JOIN positions p ON sa.position_id = p.position_id
LEFT JOIN evaluations e ON s.staff_id = e.staff_id
LEFT JOIN exit_interviews ei ON s.exit_interview_id = ei.exit_interview_id
WHERE s.employment_status = 'resigned'
GROUP BY s.staff_id;

-- インデックス
CREATE INDEX idx_email ON previous_employment_records(email);
CREATE INDEX idx_phone ON previous_employment_records(phone);
CREATE INDEX idx_rehire_eligible ON previous_employment_records(rehire_eligible);
CREATE INDEX idx_resignation_date ON previous_employment_records(resignation_date);
```

### 6.3 外部システム連携
- 給与システムとの連携（給与・賞与情報）
- 人事異動システムとの連携
- 病院情報システム（HIS）との連携
- 勤怠管理システムとの連携

## 7. データ移行計画

### 7.1 既存データの取り込み
- Excelファイルからの職員基本情報
- 紙ベースの評価記録のデジタル化
- 過去の面談記録の移行

### 7.2 データクレンジング
- 重複データの統合
- 不整合データの修正
- 欠損データの補完