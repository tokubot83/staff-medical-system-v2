-- 定期面談バンク データベーススキーマ
-- PostgreSQL用のスキーマ定義

-- 経験年数区分マスタ
CREATE TABLE experience_levels (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    min_years INTEGER NOT NULL,
    max_years INTEGER,
    description TEXT,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 施設タイプマスタ
CREATE TABLE facility_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 職種マスタ
CREATE TABLE professions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 動機タイプマスタ
CREATE TABLE motivation_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    example_answer TEXT,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- セクションマスタ
CREATE TABLE interview_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    min_duration_minutes INTEGER NOT NULL,
    max_questions_15min INTEGER DEFAULT 2,
    max_questions_30min INTEGER DEFAULT 4,
    max_questions_45min INTEGER DEFAULT 6,
    max_questions_60min INTEGER DEFAULT 8,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 質問バンク
CREATE TABLE interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL, -- text, textarea, radio, checkbox, scale, matrix
    category VARCHAR(50) NOT NULL,
    section_id UUID REFERENCES interview_sections(id),
    priority INTEGER NOT NULL CHECK (priority IN (1, 2, 3)), -- 1:必須, 2:推奨, 3:オプション
    min_duration INTEGER NOT NULL CHECK (min_duration IN (15, 30, 45, 60)),
    placeholder TEXT,
    score_weight DECIMAL(3,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 質問タグ
CREATE TABLE question_tags (
    question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (question_id, tag)
);

-- 質問オプション（選択肢）
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL,
    label TEXT NOT NULL,
    score INTEGER,
    motivation_type_id VARCHAR(20) REFERENCES motivation_types(id),
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 質問表示条件
CREATE TABLE question_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
    condition_type VARCHAR(50) NOT NULL, -- experienceLevel, facilityType, profession, motivationType, previousAnswer
    condition_values TEXT[] NOT NULL,
    operator VARCHAR(20) DEFAULT 'equals', -- equals, contains, notEquals
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- フォローアップ質問の関連
CREATE TABLE follow_up_questions (
    parent_question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
    follow_up_question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
    trigger_answer VARCHAR(100),
    PRIMARY KEY (parent_question_id, follow_up_question_id)
);

-- セクション表示条件
CREATE TABLE section_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES interview_sections(id) ON DELETE CASCADE,
    condition_type VARCHAR(50) NOT NULL,
    condition_values TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 面談テンプレート
CREATE TABLE interview_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    experience_level_id VARCHAR(20) REFERENCES experience_levels(id),
    facility_type_id VARCHAR(20) REFERENCES facility_types(id),
    profession_id VARCHAR(50) REFERENCES professions(id),
    duration INTEGER NOT NULL CHECK (duration IN (15, 30, 45, 60)),
    is_customizable BOOLEAN DEFAULT true,
    version VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- テンプレートセクション関連
CREATE TABLE template_sections (
    template_id UUID REFERENCES interview_templates(id) ON DELETE CASCADE,
    section_id UUID REFERENCES interview_sections(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    PRIMARY KEY (template_id, section_id)
);

-- セクション質問関連
CREATE TABLE section_questions (
    section_id UUID REFERENCES interview_sections(id) ON DELETE CASCADE,
    question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT false,
    PRIMARY KEY (section_id, question_id)
);

-- 評価マトリックス
CREATE TABLE evaluation_matrices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    experience_level_id VARCHAR(20) REFERENCES experience_levels(id),
    profession_id VARCHAR(50) REFERENCES professions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 評価項目
CREATE TABLE evaluation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matrix_id UUID REFERENCES evaluation_matrices(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    weight DECIMAL(3,2) DEFAULT 1.0,
    scale INTEGER DEFAULT 5,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 評価基準例
CREATE TABLE evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES evaluation_items(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    description TEXT NOT NULL,
    example TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 動機タイプ別推奨アクション
CREATE TABLE motivation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    motivation_type_id VARCHAR(20) REFERENCES motivation_types(id),
    experience_level_id VARCHAR(20) REFERENCES experience_levels(id),
    recommended_actions TEXT[] NOT NULL,
    support_strategies TEXT[] NOT NULL,
    risk_factors TEXT[],
    success_indicators TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 生成された面談シート
CREATE TABLE generated_interview_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id VARCHAR(100) NOT NULL,
    staff_name VARCHAR(200) NOT NULL,
    hire_date DATE NOT NULL,
    experience_level VARCHAR(20) NOT NULL,
    experience_years INTEGER NOT NULL,
    experience_months INTEGER NOT NULL,
    facility_type_id VARCHAR(20) REFERENCES facility_types(id),
    department VARCHAR(200),
    profession_id VARCHAR(50) REFERENCES professions(id),
    duration INTEGER NOT NULL,
    interviewer_id VARCHAR(100) NOT NULL,
    interviewer_name VARCHAR(200) NOT NULL,
    interview_date DATE NOT NULL,
    previous_interview_id UUID,
    total_questions INTEGER NOT NULL,
    estimated_duration INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, in_progress, completed, reviewed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 面談結果
CREATE TABLE interview_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet_id UUID REFERENCES generated_interview_sheets(id) ON DELETE CASCADE,
    staff_id VARCHAR(100) NOT NULL,
    interviewer_id VARCHAR(100) NOT NULL,
    interview_date DATE NOT NULL,
    actual_duration INTEGER,
    motivation_type_id VARCHAR(20) REFERENCES motivation_types(id),
    overall_assessment TEXT,
    next_interview_date DATE,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- セクション結果
CREATE TABLE section_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID REFERENCES interview_results(id) ON DELETE CASCADE,
    section_id UUID REFERENCES interview_sections(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 回答結果
CREATE TABLE answer_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_result_id UUID REFERENCES section_results(id) ON DELETE CASCADE,
    question_id UUID REFERENCES interview_questions(id),
    answer TEXT,
    score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 次回アクション
CREATE TABLE next_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID REFERENCES interview_results(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    priority INTEGER,
    due_date DATE,
    responsible_person VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_questions_category ON interview_questions(category);
CREATE INDEX idx_questions_section ON interview_questions(section_id);
CREATE INDEX idx_questions_priority ON interview_questions(priority);
CREATE INDEX idx_questions_duration ON interview_questions(min_duration);
CREATE INDEX idx_generated_sheets_staff ON generated_interview_sheets(staff_id);
CREATE INDEX idx_generated_sheets_date ON generated_interview_sheets(interview_date);
CREATE INDEX idx_results_staff ON interview_results(staff_id);
CREATE INDEX idx_results_sheet ON interview_results(sheet_id);
CREATE INDEX idx_results_date ON interview_results(interview_date);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_experience_levels_updated_at BEFORE UPDATE ON experience_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facility_types_updated_at BEFORE UPDATE ON facility_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professions_updated_at BEFORE UPDATE ON professions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_motivation_types_updated_at BEFORE UPDATE ON motivation_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_sections_updated_at BEFORE UPDATE ON interview_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_questions_updated_at BEFORE UPDATE ON interview_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_templates_updated_at BEFORE UPDATE ON interview_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evaluation_matrices_updated_at BEFORE UPDATE ON evaluation_matrices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_motivation_actions_updated_at BEFORE UPDATE ON motivation_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_interview_sheets_updated_at BEFORE UPDATE ON generated_interview_sheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_results_updated_at BEFORE UPDATE ON interview_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_next_actions_updated_at BEFORE UPDATE ON next_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();