# 職員カルテシステム データディクショナリー

## 1. テーブル定義詳細

### facilities（施設マスター）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| facility_id | INT | NO | AUTO_INCREMENT | 施設ID（PK） |
| facility_name | VARCHAR(100) | NO | - | 施設名 |
| facility_type | VARCHAR(50) | NO | - | 施設種別（病院/リハビリ施設等） |
| address | VARCHAR(255) | YES | NULL | 施設住所 |
| phone | VARCHAR(20) | YES | NULL | 電話番号 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### departments（部署マスター）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| department_id | INT | NO | AUTO_INCREMENT | 部署ID（PK） |
| facility_id | INT | NO | - | 施設ID（FK） |
| department_name | VARCHAR(100) | NO | - | 部署名 |
| department_type | VARCHAR(50) | NO | - | 部署種別（看護部/診療部等） |
| parent_department_id | INT | YES | NULL | 親部署ID |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### positions（職位マスター）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| position_id | INT | NO | AUTO_INCREMENT | 職位ID（PK） |
| position_name | VARCHAR(100) | NO | - | 職位名 |
| position_level | INT | NO | - | 職位レベル（1-13） |
| position_category | VARCHAR(50) | NO | - | 職種カテゴリー |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### skills（スキルマスター）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| skill_id | INT | NO | AUTO_INCREMENT | スキルID（PK） |
| skill_name | VARCHAR(100) | NO | - | スキル名 |
| skill_category | VARCHAR(50) | NO | - | スキルカテゴリー |
| max_level | INT | NO | 100 | 最大レベル |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### staff_basic（職員基本情報）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| staff_id | INT | NO | AUTO_INCREMENT | 職員ID（PK） |
| employee_number | VARCHAR(20) | NO | - | 職員番号（UNIQUE） |
| last_name | VARCHAR(50) | NO | - | 姓 |
| first_name | VARCHAR(50) | NO | - | 名 |
| last_name_kana | VARCHAR(50) | NO | - | 姓（カナ） |
| first_name_kana | VARCHAR(50) | NO | - | 名（カナ） |
| gender | ENUM('男','女','その他') | NO | - | 性別 |
| birth_date | DATE | NO | - | 生年月日 |
| age | INT | NO | - | 年齢（計算フィールド） |
| email | VARCHAR(255) | YES | NULL | メールアドレス |
| phone | VARCHAR(20) | YES | NULL | 電話番号 |
| mobile_phone | VARCHAR(20) | YES | NULL | 携帯電話番号 |
| emergency_contact_name | VARCHAR(100) | YES | NULL | 緊急連絡先氏名 |
| emergency_contact_phone | VARCHAR(20) | YES | NULL | 緊急連絡先電話番号 |
| emergency_contact_relationship | VARCHAR(50) | YES | NULL | 緊急連絡先続柄 |
| postal_code | VARCHAR(10) | YES | NULL | 郵便番号 |
| address | VARCHAR(255) | YES | NULL | 住所 |
| hire_date | DATE | NO | - | 入職日 |
| employment_type | VARCHAR(50) | NO | - | 雇用形態 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### staff_assignments（配属情報）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| assignment_id | INT | NO | AUTO_INCREMENT | 配属ID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| facility_id | INT | NO | - | 施設ID（FK） |
| department_id | INT | NO | - | 部署ID（FK） |
| position_id | INT | NO | - | 職位ID（FK） |
| start_date | DATE | NO | - | 配属開始日 |
| end_date | DATE | YES | NULL | 配属終了日 |
| is_primary | BOOLEAN | NO | TRUE | 主配属フラグ |
| assignment_reason | VARCHAR(255) | YES | NULL | 配属理由 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### evaluations（人事評価）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| evaluation_id | INT | NO | AUTO_INCREMENT | 評価ID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| evaluation_period | VARCHAR(20) | NO | - | 評価期間（例：2024年上期） |
| evaluation_type | VARCHAR(50) | NO | - | 評価種別 |
| overall_rating | VARCHAR(10) | NO | - | 総合評価（S/A/B/C/D） |
| performance_score | INT | NO | - | パフォーマンススコア（0-100） |
| skill_score | INT | NO | - | スキルスコア（0-100） |
| teamwork_score | INT | NO | - | チームワークスコア（0-100） |
| growth_potential | INT | NO | - | 成長性・ポテンシャル（1-5） |
| evaluator_id | INT | NO | - | 評価者ID（FK） |
| evaluation_date | DATE | NO | - | 評価実施日 |
| comments | TEXT | YES | NULL | コメント |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### two_axis_evaluations（2軸評価）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| evaluation_id | INT | NO | AUTO_INCREMENT | 評価ID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| evaluation_period | VARCHAR(20) | NO | - | 評価期間 |
| facility_score | ENUM('S','A','B','C','D') | NO | - | 施設内評価 |
| facility_rank | INT | NO | - | 施設内順位 |
| facility_total_staff | INT | NO | - | 施設内総人数 |
| corporate_score | ENUM('S','A','B','C','D') | NO | - | 全社評価 |
| corporate_rank | INT | NO | - | 全社順位 |
| corporate_total_staff | INT | NO | - | 全社総人数 |
| overall_score | ENUM('S','A','B','C','D') | NO | - | 総合評価 |
| evaluation_date | DATE | NO | - | 評価日 |
| evaluator_id | INT | NO | - | 評価者ID（FK） |
| comments | TEXT | YES | NULL | コメント |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### staff_skills（職員スキル）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| staff_skill_id | INT | NO | AUTO_INCREMENT | 職員スキルID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| skill_id | INT | NO | - | スキルID（FK） |
| skill_level | INT | NO | - | スキルレベル（0-100） |
| certified_date | DATE | YES | NULL | 認定日 |
| expiry_date | DATE | YES | NULL | 有効期限 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### interviews（面談記録）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| interview_id | INT | NO | AUTO_INCREMENT | 面談ID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| interviewer_id | INT | NO | - | 面談者ID（FK） |
| interview_type | VARCHAR(50) | NO | - | 面談種別（定期/臨時/緊急） |
| interview_category | VARCHAR(50) | NO | - | 面談カテゴリー |
| booking_date | DATE | NO | - | 予約日 |
| start_time | TIME | NO | - | 開始時刻 |
| end_time | TIME | NO | - | 終了時刻 |
| duration_minutes | INT | YES | NULL | 面談時間（分） |
| location | VARCHAR(100) | YES | NULL | 場所 |
| status | VARCHAR(20) | NO | '予定' | ステータス |
| requested_topics | JSON | YES | NULL | リクエストトピック |
| urgency_level | VARCHAR(20) | NO | '通常' | 緊急度 |
| created_by | VARCHAR(50) | NO | - | 作成者 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### interview_records（面談実施記録）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| record_id | INT | NO | AUTO_INCREMENT | 記録ID（PK） |
| interview_id | INT | NO | - | 面談ID（FK） |
| discussion_summary | TEXT | YES | NULL | 面談概要 |
| employee_feedback | TEXT | YES | NULL | 職員フィードバック |
| interviewer_notes | TEXT | YES | NULL | 面談者メモ |
| action_items | JSON | YES | NULL | アクション項目 |
| follow_up_required | BOOLEAN | NO | FALSE | フォローアップ要否 |
| follow_up_date | DATE | YES | NULL | フォローアップ日 |
| confidentiality_level | INT | NO | 1 | 機密レベル（1-5） |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### interview_outcomes（面談成果）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| outcome_id | INT | NO | AUTO_INCREMENT | 成果ID（PK） |
| interview_id | INT | NO | - | 面談ID（FK） |
| outcome_type | VARCHAR(50) | NO | - | 成果種別 |
| outcome_description | TEXT | NO | - | 成果説明 |
| target_date | DATE | YES | NULL | 目標日 |
| completion_status | VARCHAR(20) | NO | '未完了' | 完了状況 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### health_checkups（健康診断）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| checkup_id | INT | NO | AUTO_INCREMENT | 健診ID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| checkup_date | DATE | NO | - | 健診日 |
| checkup_type | VARCHAR(50) | NO | - | 健診種別 |
| overall_result | VARCHAR(20) | NO | - | 総合判定 |
| height | DECIMAL(5,2) | YES | NULL | 身長（cm） |
| weight | DECIMAL(5,2) | YES | NULL | 体重（kg） |
| bmi | DECIMAL(4,2) | YES | NULL | BMI |
| blood_pressure_high | INT | YES | NULL | 収縮期血圧 |
| blood_pressure_low | INT | YES | NULL | 拡張期血圧 |
| vision_left | DECIMAL(3,1) | YES | NULL | 視力（左） |
| vision_right | DECIMAL(3,1) | YES | NULL | 視力（右） |
| hearing_result | VARCHAR(50) | YES | NULL | 聴力結果 |
| special_findings | TEXT | YES | NULL | 特記所見 |
| doctor_comments | TEXT | YES | NULL | 医師コメント |
| next_checkup_date | DATE | YES | NULL | 次回健診予定日 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### stress_checks（ストレスチェック）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| stress_check_id | INT | NO | AUTO_INCREMENT | ストレスチェックID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| check_date | DATE | NO | - | 実施日 |
| stress_index | INT | NO | - | ストレス指数（0-100） |
| physical_stress_score | INT | NO | - | 身体的ストレススコア |
| mental_stress_score | INT | NO | - | 精神的ストレススコア |
| work_stress_score | INT | NO | - | 仕事ストレススコア |
| support_score | INT | NO | - | 支援度スコア |
| high_stress_flag | BOOLEAN | NO | FALSE | 高ストレスフラグ |
| counseling_required | BOOLEAN | NO | FALSE | カウンセリング要否 |
| counseling_date | DATE | YES | NULL | カウンセリング実施日 |
| follow_up_required | BOOLEAN | NO | FALSE | フォローアップ要否 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### occupational_health_records（産業医面談記録）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| record_id | INT | NO | AUTO_INCREMENT | 記録ID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| consultation_date | DATE | NO | - | 面談日 |
| consultation_type | VARCHAR(50) | NO | - | 面談種別 |
| chief_complaint | TEXT | YES | NULL | 主訴 |
| diagnosis | TEXT | YES | NULL | 診断 |
| treatment_plan | TEXT | YES | NULL | 治療計画 |
| work_restrictions | TEXT | YES | NULL | 就業上の配慮事項 |
| follow_up_date | DATE | YES | NULL | 次回面談日 |
| doctor_id | INT | NO | - | 産業医ID |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### attendance_summary（勤怠サマリー）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| summary_id | INT | NO | AUTO_INCREMENT | サマリーID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| year_month | VARCHAR(7) | NO | - | 年月（YYYY-MM） |
| scheduled_days | INT | NO | - | 予定日数 |
| actual_days | INT | NO | - | 実働日数 |
| absence_days | INT | NO | 0 | 欠勤日数 |
| paid_leave_days | DECIMAL(4,2) | NO | 0 | 有給休暇日数 |
| sick_leave_days | DECIMAL(4,2) | NO | 0 | 病気休暇日数 |
| special_leave_days | DECIMAL(4,2) | NO | 0 | 特別休暇日数 |
| overtime_hours | DECIMAL(5,2) | NO | 0 | 残業時間 |
| late_night_hours | DECIMAL(5,2) | NO | 0 | 深夜勤務時間 |
| holiday_work_hours | DECIMAL(5,2) | NO | 0 | 休日勤務時間 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### leave_records（休暇記録）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| leave_id | INT | NO | AUTO_INCREMENT | 休暇ID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| leave_type | VARCHAR(50) | NO | - | 休暇種別 |
| start_date | DATE | NO | - | 開始日 |
| end_date | DATE | NO | - | 終了日 |
| days_taken | DECIMAL(4,2) | NO | - | 取得日数 |
| reason | TEXT | YES | NULL | 理由 |
| approval_status | VARCHAR(20) | NO | '申請中' | 承認ステータス |
| approver_id | INT | YES | NULL | 承認者ID |
| approved_date | DATE | YES | NULL | 承認日 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### training_programs（研修プログラム）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| program_id | INT | NO | AUTO_INCREMENT | プログラムID（PK） |
| program_name | VARCHAR(200) | NO | - | プログラム名 |
| program_category | VARCHAR(50) | NO | - | カテゴリー |
| duration_hours | INT | NO | - | 研修時間 |
| is_mandatory | BOOLEAN | NO | FALSE | 必須フラグ |
| target_positions | JSON | YES | NULL | 対象職位 |
| target_departments | JSON | YES | NULL | 対象部署 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### training_records（研修受講記録）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| record_id | INT | NO | AUTO_INCREMENT | 記録ID（PK） |
| staff_id | INT | NO | - | 職員ID（FK） |
| program_id | INT | NO | - | プログラムID（FK） |
| attendance_date | DATE | NO | - | 受講日 |
| completion_status | VARCHAR(20) | NO | - | 完了状況 |
| score | INT | YES | NULL | 成績 |
| evaluation | VARCHAR(50) | YES | NULL | 評価 |
| certificate_issued | BOOLEAN | NO | FALSE | 修了証発行フラグ |
| certificate_number | VARCHAR(50) | YES | NULL | 修了証番号 |
| expiry_date | DATE | YES | NULL | 有効期限 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### recruitment_plans（採用計画）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| plan_id | INT | NO | AUTO_INCREMENT | 計画ID（PK） |
| facility_id | INT | NO | - | 施設ID（FK） |
| department_id | INT | NO | - | 部署ID（FK） |
| position_id | INT | NO | - | 職位ID（FK） |
| fiscal_year | VARCHAR(10) | NO | - | 年度 |
| planned_count | INT | NO | - | 計画人数 |
| hired_count | INT | NO | 0 | 採用済人数 |
| recruitment_type | VARCHAR(50) | NO | - | 採用種別 |
| status | VARCHAR(20) | NO | '計画中' | ステータス |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

### candidates（応募者情報）
| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|---------|------|-----------|------|
| candidate_id | INT | NO | AUTO_INCREMENT | 応募者ID（PK） |
| recruitment_plan_id | INT | NO | - | 採用計画ID（FK） |
| name | VARCHAR(100) | NO | - | 氏名 |
| email | VARCHAR(255) | NO | - | メールアドレス |
| phone | VARCHAR(20) | NO | - | 電話番号 |
| application_date | DATE | NO | - | 応募日 |
| resume_path | VARCHAR(255) | YES | NULL | 履歴書パス |
| status | VARCHAR(50) | NO | '応募受付' | ステータス |
| interview_score | INT | YES | NULL | 面接スコア |
| final_result | VARCHAR(20) | YES | NULL | 最終結果 |
| hired_as_staff_id | INT | YES | NULL | 採用後の職員ID |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP ON UPDATE | 更新日時 |

## 2. 列挙型（ENUM）定義

### gender（性別）
- 男
- 女
- その他

### evaluation grades（評価グレード）
- S: 特に優秀（上位5%）
- A: 優秀（上位20%）
- B: 標準以上（上位50%）
- C: 標準（上位80%）
- D: 要改善（下位20%）

### interview_type（面談種別）
- regular: 定期面談
- ad_hoc: 臨時面談
- emergency: 緊急面談
- career: キャリア面談
- health: 健康面談
- exit: 退職面談

### interview_status（面談ステータス）
- scheduled: 予定
- completed: 完了
- cancelled: キャンセル
- no_show: 不参加
- rescheduled: 日程変更

### urgency_level（緊急度）
- low: 低
- medium: 中
- high: 高
- critical: 緊急

### employment_type（雇用形態）
- full_time: 正社員
- part_time: パートタイム
- contract: 契約社員
- temporary: 派遣社員
- intern: インターン

## 3. ビジネスルール

### 評価関連
- 評価は年2回（上期・下期）実施
- 2軸評価は四半期ごとに更新可能
- 評価権限は上位職位者のみ

### 面談関連
- 定期面談は最低年2回実施
- 面談実施権限はL6-L8のみ
- 高ストレス者は月1回の面談必須

### 健康管理関連
- 健康診断は年1回必須
- ストレスチェックは年2回実施
- 高ストレス判定は指数70以上

### 勤怠関連
- 残業上限は月45時間
- 有給取得率目標は70%以上
- 連続勤務は最大6日まで

## 4. データ保持期間

### 永久保存
- staff_basic（退職後も保持）
- evaluations（人事記録として）
- health_checkups（法定保存）

### 10年保存
- interviews
- training_records
- occupational_health_records

### 5年保存
- attendance_summary
- leave_records
- stress_checks

### 3年保存
- interview_outcomes
- candidates（不採用者）

## 5. セキュリティレベル

### レベル5（最高機密）
- health_checkups
- stress_checks
- occupational_health_records

### レベル4（機密）
- evaluations
- two_axis_evaluations
- interview_records（confidentiality_level=4,5）

### レベル3（社外秘）
- staff_basic（個人情報部分）
- attendance_summary（詳細）

### レベル2（内部限定）
- staff_assignments
- training_records

### レベル1（一般）
- facilities
- departments
- positions