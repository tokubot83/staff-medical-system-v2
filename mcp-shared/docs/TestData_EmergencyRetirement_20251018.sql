-- テストデータ: 緊急退職処理・緊急アカウント停止統合テスト用
-- 作成日: 2025-10-18
-- 用途: VoiceDrive統合テスト

-- テスト職員データ
INSERT INTO employees (
  employee_id,
  full_name,
  department_id,
  department_name,
  facility_id,
  facility_name,
  position_id,
  position_name,
  permission_level,
  account_status,
  hire_date,
  employment_status,
  created_at
) VALUES
  -- TEST-EMP-001: 緊急退職処理テスト用
  (
    'TEST-EMP-001',
    'テスト太郎',
    'nursing-dept-01',
    '看護部',
    'obara-hospital',
    '小原病院',
    'staff-nurse',
    '看護師',
    1.0,
    'active',
    '2020-04-01',
    'regular_employee',
    NOW()
  ),

  -- TEST-EMP-002: 緊急アカウント停止テスト用
  (
    'TEST-EMP-002',
    'テスト花子',
    'medical-affairs-01',
    '医事課',
    'tategami-rehabilitation',
    '立神リハビリテーション温泉病院',
    'medical-clerk',
    '医療事務員',
    1.0,
    'active',
    '2021-04-01',
    'regular_employee',
    NOW()
  ),

  -- TEST-EMP-003: 正式退職処理テスト用（緊急処理あり）
  (
    'TEST-EMP-003',
    'テスト次郎',
    'rehabilitation-01',
    'リハビリテーション科',
    'obara-hospital',
    '小原病院',
    'physical-therapist',
    '理学療法士',
    2.0,
    'active',
    '2019-04-01',
    'regular_employee',
    NOW()
  ),

  -- TEST-EMP-004: 正式退職処理テスト用（緊急処理なし）
  (
    'TEST-EMP-004',
    'テスト春子',
    'general-affairs-01',
    '総務部',
    'tategami-rehabilitation',
    '立神リハビリテーション温泉病院',
    'administrative-staff',
    '事務職員',
    3.0,
    'active',
    '2022-04-01',
    'regular_employee',
    NOW()
  );

-- テスト用人事担当者（緊急処理実行者）
INSERT INTO employees (
  employee_id,
  full_name,
  department_id,
  department_name,
  facility_id,
  facility_name,
  position_id,
  position_name,
  permission_level,
  account_status,
  hire_date,
  employment_status,
  created_at
) VALUES
  (
    'TEST-HR-001',
    'テスト人事部長',
    'hr-dept-01',
    '人事部',
    'obara-hospital',
    '小原病院',
    'hr-director',
    '人事部長',
    15.0,
    'active',
    '2010-04-01',
    'regular_employee',
    NOW()
  );

-- 確認用View
CREATE OR REPLACE VIEW v_test_employees AS
SELECT
  employee_id,
  full_name,
  department_name,
  facility_name,
  position_name,
  permission_level,
  account_status,
  employment_status,
  hire_date
FROM employees
WHERE employee_id LIKE 'TEST-%'
ORDER BY employee_id;

-- テストデータ確認
SELECT * FROM v_test_employees;
