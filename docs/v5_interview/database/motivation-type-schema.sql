-- ============================================
-- 動機タイプマスターテーブル
-- ============================================
CREATE TABLE motivation_types (
    id VARCHAR(20) PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50),
    approach TEXT NOT NULL,
    keywords JSON,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 初期データの挿入
INSERT INTO motivation_types (id, type_name, label, description, icon, color, approach, keywords, display_order) VALUES
('growth', '成長・挑戦型', '新しいスキルを身につけた時', '学習意欲が高く、新しいことへの挑戦を好む。スキルアップや成長実感が主なモチベーション。', 'TrendingUp', 'text-green-600 bg-green-50', '研修機会の提供、新規プロジェクトへの参加、スキルアップ支援、昇進パスの明示', '["スキルアップ", "新規事業", "チャレンジ", "学習", "成長"]', 1),
('recognition', '評価・承認型', '上司や同僚に褒められた時', '他者からの評価や承認を重視。成果を認められることで強いモチベーションを感じる。', 'Award', 'text-yellow-600 bg-yellow-50', '定期的なフィードバック、表彰制度の活用、成果の可視化、昇進基準の明確化', '["評価", "表彰", "昇進", "承認", "認知"]', 2),
('stability', '安定・安心型', '安定した環境で確実に成果を出せた時', 'リスクを避け、確実性を重視。予測可能で安定した環境を好む。', 'Shield', 'text-blue-600 bg-blue-50', '段階的な変化、詳細な説明、マニュアル整備、不安要素の事前解消', '["安定", "確実", "段階的", "安心", "リスク回避"]', 3),
('teamwork', '関係・調和型', 'チームで協力して目標を達成した時', '人間関係やチームワークを重視。協力して成果を出すことに喜びを感じる。', 'Users', 'text-purple-600 bg-purple-50', 'チーム業務の機会、メンター制度、コーディネーター役の委任、協調的な環境作り', '["チーム", "協力", "支援", "人間関係", "調和"]', 4),
('efficiency', '効率・合理型', '無駄な作業を改善・効率化できた時', '効率性と合理性を追求。プロセス改善や最適化に強い関心を持つ。', 'Zap', 'text-orange-600 bg-orange-50', '業務効率化プロジェクト、DX推進、プロセス改善の機会、最適化ツールの導入', '["効率", "合理的", "最適化", "改善", "DX"]', 5),
('compensation', '報酬・待遇型', '良い待遇で働けている時', '給与や福利厚生などの待遇を重視。実利的なメリットがモチベーションの源泉。', 'DollarSign', 'text-emerald-600 bg-emerald-50', '昇給機会の明示、福利厚生の充実、副業許可、実績に応じた報酬設計', '["給与", "福利厚生", "待遇", "報酬", "実利"]', 6),
('creativity', '自由・創造型', '自分らしい方法で創造的な成果を出せた時', '自由度と創造性を重視。独自のアプローチで成果を出すことを好む。', 'Palette', 'text-pink-600 bg-pink-50', 'フレックス制度、クリエイティブ業務の委任、裁量権の拡大、独自アプローチの尊重', '["自由", "創造性", "個性", "独自性", "裁量"]', 7);

-- ============================================
-- 職員動機タイプ履歴テーブル
-- ============================================
CREATE TABLE staff_motivation_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    motivation_type_id VARCHAR(20) NOT NULL,
    interview_id INT,
    assessment_date DATE NOT NULL,
    assessed_by INT,
    confidence_level ENUM('high', 'medium', 'low') DEFAULT 'medium',
    notes TEXT,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (motivation_type_id) REFERENCES motivation_types(id),
    FOREIGN KEY (interview_id) REFERENCES interviews(id),
    FOREIGN KEY (assessed_by) REFERENCES users(id),
    
    INDEX idx_staff_date (staff_id, assessment_date DESC),
    INDEX idx_motivation_type (motivation_type_id)
);

-- ============================================
-- 動機タイプ別推奨アクションテーブル
-- ============================================
CREATE TABLE motivation_type_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    motivation_type_id VARCHAR(20) NOT NULL,
    action_category ENUM('training', 'project', 'reward', 'environment', 'career', 'other') NOT NULL,
    action_name VARCHAR(200) NOT NULL,
    action_description TEXT,
    priority INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (motivation_type_id) REFERENCES motivation_types(id),
    INDEX idx_type_category (motivation_type_id, action_category)
);

-- サンプルデータの挿入
INSERT INTO motivation_type_actions (motivation_type_id, action_category, action_name, action_description, priority) VALUES
-- 成長・挑戦型向け
('growth', 'training', '専門資格取得支援', '認定看護師・専門看護師資格の取得支援プログラム', 10),
('growth', 'project', '新規プロジェクトリーダー任命', '病院改善プロジェクトのリーダー役を任せる', 9),
('growth', 'career', 'キャリアパス明確化', '5年後、10年後のキャリアパスを具体的に提示', 8),

-- 評価・承認型向け
('recognition', 'reward', '月間MVP表彰', '毎月の優秀職員を表彰し、院内掲示板で紹介', 10),
('recognition', 'environment', '成果発表会の開催', '四半期ごとに業務改善成果を発表する機会を設ける', 9),
('recognition', 'career', '昇進基準の明確化', '評価基準と昇進条件を明文化して開示', 8),

-- 安定・安心型向け
('stability', 'environment', '詳細マニュアル整備', '業務手順書とトラブル対応マニュアルの充実', 10),
('stability', 'training', '段階的スキルアップ研修', '無理のないペースでのスキル向上プログラム', 9),
('stability', 'career', '長期雇用保証', '定年まで安心して働ける環境の保証', 8),

-- 関係・調和型向け
('teamwork', 'environment', 'チーム活動の推進', 'QCサークルなどの小集団活動の活性化', 10),
('teamwork', 'project', 'メンター制度導入', '新人指導やチーム内サポート役の任命', 9),
('teamwork', 'reward', 'チーム表彰制度', '個人ではなくチーム単位での表彰制度', 8),

-- 効率・合理型向け
('efficiency', 'project', 'DX推進リーダー', '業務デジタル化プロジェクトの推進役', 10),
('efficiency', 'environment', 'IT環境整備', '最新のITツールとシステムの導入', 9),
('efficiency', 'training', 'プロセス改善研修', 'リーン管理やカイゼン手法の研修', 8),

-- 報酬・待遇型向け
('compensation', 'reward', '成果連動賞与', '個人の成果に応じた賞与制度の導入', 10),
('compensation', 'reward', '福利厚生充実', '住宅手当、保育支援、健康管理サポートの拡充', 9),
('compensation', 'career', '昇給機会の増加', '年2回の昇給査定機会の設定', 8),

-- 自由・創造型向け
('creativity', 'environment', 'フレックスタイム導入', '柔軟な勤務時間制度の導入', 10),
('creativity', 'project', '独自プロジェクト支援', '個人のアイデアを形にする機会の提供', 9),
('creativity', 'career', '裁量権の拡大', '業務遂行方法の自由度を高める', 8);

-- ============================================
-- 動機タイプ組み合わせ相性テーブル
-- ============================================
CREATE TABLE motivation_type_compatibility (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_id_1 VARCHAR(20) NOT NULL,
    type_id_2 VARCHAR(20) NOT NULL,
    compatibility_level ENUM('excellent', 'good', 'neutral', 'caution', 'difficult') NOT NULL,
    description TEXT,
    management_tips TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (type_id_1) REFERENCES motivation_types(id),
    FOREIGN KEY (type_id_2) REFERENCES motivation_types(id),
    UNIQUE KEY unique_pair (type_id_1, type_id_2)
);

-- 相性データの挿入
INSERT INTO motivation_type_compatibility (type_id_1, type_id_2, compatibility_level, description, management_tips) VALUES
('growth', 'efficiency', 'excellent', '新しい効率的手法を学ぶことで相乗効果', '革新的な業務改善プロジェクトでペアリング'),
('recognition', 'teamwork', 'excellent', 'チームで成果を出して評価される理想的な組み合わせ', 'チーム表彰制度の活用'),
('stability', 'compensation', 'good', '確実な収入源として安定を求める共通点', '長期的な待遇改善計画の提示'),
('creativity', 'stability', 'caution', '自由vs安定の葛藤が生じる可能性', '段階的な変化とクリエイティブな余地のバランス'),
('efficiency', 'teamwork', 'caution', '効率vs人間関係の優先順位で対立の可能性', 'プロセス改善における協調性の重要性を強調');

-- ============================================
-- 面談記録テーブルの拡張（既存テーブルへの列追加）
-- ============================================
ALTER TABLE interviews
ADD COLUMN motivation_type_id VARCHAR(20),
ADD COLUMN motivation_confidence ENUM('high', 'medium', 'low') DEFAULT 'medium',
ADD COLUMN type_specific_notes TEXT,
ADD CONSTRAINT fk_motivation_type FOREIGN KEY (motivation_type_id) REFERENCES motivation_types(id);

-- ============================================
-- 動機タイプ変化追跡ビュー
-- ============================================
CREATE VIEW staff_motivation_trends AS
SELECT 
    s.id as staff_id,
    s.name as staff_name,
    s.department,
    smh.motivation_type_id,
    mt.type_name,
    smh.assessment_date,
    smh.confidence_level,
    LAG(smh.motivation_type_id) OVER (PARTITION BY s.id ORDER BY smh.assessment_date) as previous_type,
    CASE 
        WHEN LAG(smh.motivation_type_id) OVER (PARTITION BY s.id ORDER BY smh.assessment_date) != smh.motivation_type_id 
        THEN 'changed'
        ELSE 'stable'
    END as type_status
FROM staff s
JOIN staff_motivation_history smh ON s.id = smh.staff_id
JOIN motivation_types mt ON smh.motivation_type_id = mt.id
WHERE smh.is_primary = TRUE
ORDER BY s.id, smh.assessment_date DESC;

-- ============================================
-- 部署別動機タイプ分布ビュー
-- ============================================
CREATE VIEW department_motivation_distribution AS
SELECT 
    s.department,
    mt.type_name,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY s.department), 2) as percentage
FROM staff s
JOIN (
    SELECT DISTINCT ON (staff_id) 
        staff_id, 
        motivation_type_id
    FROM staff_motivation_history
    WHERE is_primary = TRUE
    ORDER BY staff_id, assessment_date DESC
) latest_motivation ON s.id = latest_motivation.staff_id
JOIN motivation_types mt ON latest_motivation.motivation_type_id = mt.id
WHERE s.is_active = TRUE
GROUP BY s.department, mt.type_name
ORDER BY s.department, count DESC;

-- ============================================
-- インデックスの追加（パフォーマンス最適化）
-- ============================================
CREATE INDEX idx_interviews_motivation ON interviews(motivation_type_id);
CREATE INDEX idx_staff_motivation_latest ON staff_motivation_history(staff_id, assessment_date DESC) WHERE is_primary = TRUE;