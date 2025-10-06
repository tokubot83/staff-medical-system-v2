-- ================================================================================
-- アクセス制御マスター初期データ投入
-- Version: 1.0.0
-- Created: 2025-10-06
-- Purpose: 17タブの初期権限設定を投入
-- ================================================================================

USE staff_medical_system;

-- ================================================================================
-- 初期データ投入（職員カード17タブ）
-- ================================================================================

-- === 基本情報カテゴリ（Level 14以上）===
INSERT INTO access_control_master (
  resource_type, resource_id, resource_name, category,
  min_level, special_authority, requires_assignment,
  description, is_active, is_system_protected, display_order,
  recommended_min_level, recommended_reason, created_by
) VALUES
-- 基本情報タブ
('tab', 'basic', '基本情報', '基本情報',
 14.0, FALSE, FALSE,
 '職員の基本情報（氏名、所属、連絡先等）。面談業務に必須。', TRUE, FALSE, 1,
 14.0, '面談予約窓口（Level 14）の業務に必要な基本情報', 'SYSTEM'),

-- 経歴・キャリアタブ
('tab', 'career', '経歴・キャリア', '基本情報',
 14.0, FALSE, FALSE,
 '職歴・学歴・資格取得履歴。面談時の背景理解に必要。', TRUE, FALSE, 2,
 14.0, '面談準備に必要なキャリア情報', 'SYSTEM'),

-- キャリア選択コースタブ
('tab', 'career-course', 'キャリア選択コース', '基本情報',
 14.0, FALSE, FALSE,
 '選択したキャリアコース（スペシャリスト/ジェネラリスト等）。', TRUE, FALSE, 3,
 14.0, 'キャリア支援に必要な情報', 'SYSTEM'),

-- マインド・志向性タブ
('tab', 'mindset', 'マインド・志向性', '基本情報',
 14.0, FALSE, FALSE,
 'モチベーションタイプ、価値観、働き方の志向性。', TRUE, FALSE, 4,
 14.0, '面談時の個人特性理解に必要', 'SYSTEM'),

-- === 資格・実績カテゴリ ===
-- 資格・専門性タブ（Level 14以上）
('tab', 'qualification', '資格・専門性', '資格・実績',
 14.0, FALSE, FALSE,
 '保有資格、専門スキル、認定資格の一覧。', TRUE, FALSE, 5,
 14.0, '基本的な資格情報は面談で確認が必要', 'SYSTEM'),

-- 実績・表彰タブ（Level 15以上）
('tab', 'achievement', '実績・表彰', '資格・実績',
 15.0, FALSE, FALSE,
 '業務実績、表彰歴、プロジェクト参加履歴。人事評価と連動。', TRUE, FALSE, 6,
 15.0, '評価に関わる実績情報は部門長以上が管理', 'SYSTEM'),

-- === 健康管理カテゴリ ===
-- 勤務状況タブ（Level 14以上）
('tab', 'attendance', '勤務状況', '健康管理',
 14.0, FALSE, FALSE,
 '出勤状況、勤怠記録、残業時間。面談時に確認が必要。', TRUE, FALSE, 7,
 14.0, '勤怠状況は面談準備に必要な情報', 'SYSTEM'),

-- ウェルビーイングタブ（Level 97, 98のみ）
('tab', 'wellbeing', 'ウェルビーイング', '健康管理',
 97.0, TRUE, FALSE,
 'ストレスチェック結果、メンタルヘルス指標。要配慮個人情報。', TRUE, TRUE, 8,
 97.0, '個人情報保護法：要配慮個人情報。健診担当者・産業医のみアクセス可。', 'SYSTEM'),

-- 健康診断タブ（Level 97, 98のみ）
('tab', 'health-checkup', '健康診断', '健康管理',
 97.0, TRUE, FALSE,
 '健康診断結果、再検査記録、産業医面談記録。要配慮個人情報。', TRUE, TRUE, 9,
 97.0, '労働安全衛生法：健康診断結果は産業医・健診担当者のみが取り扱う。', 'SYSTEM'),

-- === 育成・評価カテゴリ ===
-- 能力開発タブ（Level 15以上）
('tab', 'development', '能力開発', '育成・評価',
 15.0, FALSE, FALSE,
 '研修受講履歴、スキル開発計画、OJT記録。', TRUE, FALSE, 10,
 15.0, '育成計画は部門長以上が管理', 'SYSTEM'),

-- 面談・指導タブ（Level 14以上、担当者のみ）
('tab', 'interview', '面談・指導', '育成・評価',
 14.0, FALSE, TRUE,
 '面談記録、指導履歴、フィードバック。担当者のみ閲覧可能。', TRUE, FALSE, 11,
 14.0, '面談担当者は記録作成・閲覧が必要', 'SYSTEM'),

-- 最新評価タブ（Level 15以上）
('tab', 'evaluation', '最新評価', '育成・評価',
 15.0, FALSE, FALSE,
 '最新の人事評価結果、評価コメント。', TRUE, FALSE, 12,
 15.0, '人事評価結果は部門長以上が管理', 'SYSTEM'),

-- 評価履歴タブ（Level 15以上）
('tab', 'evaluation-history', '評価履歴', '育成・評価',
 15.0, FALSE, FALSE,
 '過去の評価履歴、評価推移グラフ、長期トレンド分析。', TRUE, FALSE, 13,
 15.0, '評価履歴の分析は部門長以上の権限', 'SYSTEM'),

-- 評価分析タブ（Level 15以上）
('tab', 'evaluation-report', '評価分析', '育成・評価',
 15.0, FALSE, FALSE,
 '評価の詳細分析レポート、強み・弱み分析。', TRUE, FALSE, 14,
 15.0, '評価分析は部門長以上がキャリア支援に活用', 'SYSTEM'),

-- 総合分析タブ（Level 15以上）
('tab', 'analytics', '総合分析', '育成・評価',
 15.0, FALSE, FALSE,
 '能力開発・評価・研修の統合分析。', TRUE, FALSE, 15,
 15.0, '総合的な人材分析は部門長以上の権限', 'SYSTEM'),

-- === 採用・研修カテゴリ（Level 14以上）===
-- 採用・配属タブ
('tab', 'recruitment', '採用・配属', '採用・研修',
 14.0, FALSE, FALSE,
 '採用経緯、配属履歴、異動記録。', TRUE, FALSE, 16,
 14.0, '採用・配属情報は人事業務に必要', 'SYSTEM'),

-- 教育・研修タブ
('tab', 'education', '教育・研修', '採用・研修',
 14.0, FALSE, FALSE,
 '研修受講履歴、資格取得支援、外部研修参加記録。', TRUE, FALSE, 17,
 14.0, '研修管理は人事部門の基本業務', 'SYSTEM'),

-- === 統合管理カテゴリ（Level 14以上）===
-- 統合管理リンクタブ
('tab', 'links', '統合管理リンク', '統合管理',
 14.0, FALSE, FALSE,
 '他システムへのリンク、VoiceDrive連携等。', TRUE, FALSE, 18,
 14.0, '統合管理機能へのアクセス', 'SYSTEM');

-- ================================================================================
-- 初期スナップショット作成（運用開始前設定）
-- ================================================================================

-- 初期設定のスナップショットを保存
INSERT INTO access_control_snapshot (
  snapshot_name,
  snapshot_description,
  snapshot_data,
  created_by,
  is_active,
  can_rollback
)
SELECT
  '運用開始前初期設定',
  '2025年10月6日時点の初期権限設定。Level 14-18の段階的権限設計。',
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'resource_type', resource_type,
      'resource_id', resource_id,
      'resource_name', resource_name,
      'category', category,
      'min_level', min_level,
      'special_authority', special_authority,
      'requires_assignment', requires_assignment,
      'description', description,
      'recommended_min_level', recommended_min_level,
      'recommended_reason', recommended_reason
    )
  ),
  'SYSTEM',
  TRUE,
  TRUE
FROM access_control_master
WHERE resource_type = 'tab';

-- ================================================================================
-- 確認クエリ（マイグレーション実行後に確認）
-- ================================================================================

-- タブ一覧とアクセスレベル確認
-- SELECT
--   category,
--   resource_name,
--   min_level,
--   special_authority,
--   is_system_protected,
--   recommended_min_level
-- FROM access_control_master
-- WHERE resource_type = 'tab'
-- ORDER BY display_order;

-- カテゴリ別タブ数確認
-- SELECT
--   category,
--   COUNT(*) as tab_count,
--   MIN(min_level) as min_level,
--   MAX(min_level) as max_level
-- FROM access_control_master
-- WHERE resource_type = 'tab'
-- GROUP BY category
-- ORDER BY MIN(display_order);
