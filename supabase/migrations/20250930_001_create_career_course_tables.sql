-- キャリアコース選択制度 マスターデータテーブル
-- 参照: docs/20250919_【川畑法人統括事務局長】コース別雇用制度労基資料.pdf
-- 厚生労働省「コース別雇用管理の留意点」に準拠

-- 1. コース定義マスターテーブル
CREATE TABLE course_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code VARCHAR(10) NOT NULL UNIQUE, -- 'A', 'B', 'C', 'D'
  course_name VARCHAR(100) NOT NULL,
  description TEXT,

  -- 異動・転勤条件
  department_transfer_available BOOLEAN NOT NULL DEFAULT false, -- 部署異動可否
  facility_transfer_available VARCHAR(20) NOT NULL DEFAULT 'none', -- 'none', 'limited', 'full'
  relocation_required BOOLEAN NOT NULL DEFAULT false, -- 転居を伴う転勤

  -- 勤務条件
  night_shift_available VARCHAR(20) NOT NULL DEFAULT 'none', -- 'none', 'selectable', 'required'

  -- キャリアパス
  management_track BOOLEAN NOT NULL DEFAULT false, -- 管理職登用対象

  -- 給与設定（3パターン対応: 係数のみ/等級のみ/係数+等級）
  base_salary_multiplier DECIMAL(5,3) NOT NULL DEFAULT 1.000, -- 基本給係数
  salary_grade INTEGER, -- 給与等級（オプション）
  salary_notes TEXT, -- 給与計算に関するメモ

  -- メタデータ
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- 制約: 転居を伴う転勤がある場合は施設間異動も必須
  CONSTRAINT relocation_requires_facility_transfer CHECK (
    NOT relocation_required OR facility_transfer_available != 'none'
  )
);

-- インデックス
CREATE INDEX idx_course_definitions_active ON course_definitions(is_active, display_order);
CREATE INDEX idx_course_definitions_code ON course_definitions(course_code) WHERE is_active = true;

-- 初期データ挿入（A～Dコース）
-- 注意: 将来的にE/Fコース等の追加も想定したマスターデータ設計
INSERT INTO course_definitions (course_code, course_name, description, department_transfer_available, facility_transfer_available, relocation_required, night_shift_available, management_track, base_salary_multiplier, display_order) VALUES
('A', 'Aコース（全面協力型）', '部署・施設間異動に全面協力し、管理職候補として育成対象。転居を伴う転勤も受諾。夜勤あり。', true, 'full', true, 'required', true, 1.200, 1),
('B', 'Bコース（施設内協力型）', '同一施設内の部署異動（病棟移動等）に対応。施設間異動なし。管理職登用対象。夜勤あり。', true, 'none', false, 'required', true, 1.100, 2),
('C', 'Cコース（専門職型）', '現在の部署・施設で専門性を発揮。プライベート優先。管理職登用なし。夜勤選択可。', false, 'none', false, 'selectable', false, 1.000, 3),
('D', 'Dコース（時短・制約あり型）', '育児・介護等の制約により勤務条件に配慮が必要。夜勤なし。異動なし。', false, 'none', false, 'none', false, 0.900, 4);

COMMENT ON TABLE course_definitions IS 'キャリアコース定義マスターテーブル。川畑局長指示に基づくA～D4コース体系。将来的なコース追加・変更に対応するためマスターデータ化。';
COMMENT ON COLUMN course_definitions.facility_transfer_available IS 'none: 施設間異動不可（Bコース: 施設内の部署異動のみ対応）, limited: 将来の拡張用（未使用）, full: 全施設対象（Aコース）';
COMMENT ON COLUMN course_definitions.base_salary_multiplier IS '基本給係数。給与体系は3パターン対応: (1)係数のみ (2)等級のみ (3)係数+等級の両方。実際の運用は人事部と調整。';
COMMENT ON COLUMN course_definitions.night_shift_available IS 'none: なし, selectable: 選択可, required: 必須';

-- 2. 職員のキャリアコース選択テーブル
CREATE TABLE staff_career_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff_records(id) ON DELETE CASCADE,
  course_code VARCHAR(10) NOT NULL REFERENCES course_definitions(course_code),

  -- 適用期間
  effective_from DATE NOT NULL, -- 適用開始日
  effective_to DATE, -- 適用終了日（NULL = 現在有効）

  -- 次回変更可能日（年1回制限）
  next_change_available_date DATE,

  -- 特例変更事由
  special_change_reason VARCHAR(50), -- 'pregnancy', 'caregiving', 'illness', NULL
  special_change_note TEXT,

  -- 承認情報
  change_requested_at TIMESTAMP WITH TIME ZONE,
  change_requested_by UUID REFERENCES staff_records(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES staff_records(id),
  approval_status VARCHAR(20) DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
  rejection_reason TEXT,

  -- メタデータ
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- 制約: 1人の職員につき同時に有効なコースは1つのみ
  CONSTRAINT one_active_course_per_staff UNIQUE (staff_id, effective_to) WHERE effective_to IS NULL
);

-- インデックス
CREATE INDEX idx_staff_career_courses_staff ON staff_career_courses(staff_id);
CREATE INDEX idx_staff_career_courses_current ON staff_career_courses(staff_id, effective_to) WHERE effective_to IS NULL;
CREATE INDEX idx_staff_career_courses_approval ON staff_career_courses(approval_status, change_requested_at) WHERE approval_status = 'pending';

COMMENT ON TABLE staff_career_courses IS '職員のキャリアコース選択履歴。effective_to IS NULLのレコードが現在有効なコース。';
COMMENT ON COLUMN staff_career_courses.special_change_reason IS '特例変更事由: 妊娠・育児・介護・疾病等による年度途中の変更';

-- 3. コース変更申請テーブル（ワークフロー管理）
CREATE TABLE career_course_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff_records(id) ON DELETE CASCADE,

  -- 変更内容
  current_course_code VARCHAR(10) NOT NULL REFERENCES course_definitions(course_code),
  requested_course_code VARCHAR(10) NOT NULL REFERENCES course_definitions(course_code),
  requested_effective_date DATE NOT NULL,

  -- 変更理由
  change_reason VARCHAR(50) NOT NULL, -- 'annual', 'special_pregnancy', 'special_caregiving', 'special_illness'
  reason_detail TEXT,
  attachment_urls TEXT[], -- 診断書等の添付ファイルURL

  -- 承認フロー
  approval_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'withdrawn'
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_by UUID NOT NULL REFERENCES staff_records(id),

  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES staff_records(id),
  review_comment TEXT,

  -- 承認後に staff_career_courses へ反映済みフラグ
  applied_to_record BOOLEAN NOT NULL DEFAULT false,
  applied_at TIMESTAMP WITH TIME ZONE,

  -- メタデータ
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- 制約: 同じコースへの変更申請は不可
  CONSTRAINT different_course_required CHECK (current_course_code != requested_course_code)
);

-- インデックス
CREATE INDEX idx_course_change_requests_staff ON career_course_change_requests(staff_id);
CREATE INDEX idx_course_change_requests_status ON career_course_change_requests(approval_status, submitted_at);
CREATE INDEX idx_course_change_requests_pending ON career_course_change_requests(staff_id) WHERE approval_status = 'pending';

COMMENT ON TABLE career_course_change_requests IS 'キャリアコース変更申請。年1回の定期変更と特例変更（妊娠・介護等）に対応。';

-- 4. コース間転換の柔軟性設定テーブル（将来拡張用）
CREATE TABLE course_transfer_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_course_code VARCHAR(10) NOT NULL REFERENCES course_definitions(course_code),
  to_course_code VARCHAR(10) NOT NULL REFERENCES course_definitions(course_code),

  -- 転換条件
  is_allowed BOOLEAN NOT NULL DEFAULT true,
  requires_approval BOOLEAN NOT NULL DEFAULT true,
  requires_training BOOLEAN NOT NULL DEFAULT false, -- キャリアルートの違いを考慮した訓練
  training_program_name VARCHAR(200),

  -- 制約条件
  minimum_service_years DECIMAL(4,1), -- 最低勤続年数
  requires_manager_recommendation BOOLEAN NOT NULL DEFAULT false,

  -- 説明
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(from_course_code, to_course_code)
);

COMMENT ON TABLE course_transfer_rules IS 'コース間転換ルール。厚労省ガイドライン「転換を柔軟に認める制度設計」に対応。';

-- 初期データ: 全コース間の双方向転換を許可（特例変更除く）
INSERT INTO course_transfer_rules (from_course_code, to_course_code, is_allowed, requires_approval, requires_training, notes) VALUES
-- Aコースから他コースへ
('A', 'B', true, true, false, '全面協力型から施設内協力型への変更。施設間異動を避けたい事情がある場合。'),
('A', 'C', true, true, true, '全面協力型から専門職型への変更。管理職候補からの離脱のため、慎重な検討が必要。'),
('A', 'D', true, true, false, '育児・介護等の特例事由により即時対応。'),
-- Bコースから他コースへ
('B', 'A', true, true, true, '施設内協力型から全面協力型へ。施設間異動・転居を伴う転勤の受諾が必要。訓練実施。'),
('B', 'C', true, true, false, '施設内協力型から専門職型へ。部署異動も避けたい場合。管理職候補からの離脱。'),
('B', 'D', true, true, false, '育児・介護等の特例事由により即時対応。'),
-- Cコースから他コースへ
('C', 'A', true, true, true, '専門職型から全面協力型へ。管理職登用対象への変更のため、計画的な育成が必要。'),
('C', 'B', true, true, true, '専門職型から施設内協力型へ。部署異動に対応する意向に変更。管理職登用対象への変更。'),
('C', 'D', true, true, false, '育児・介護等の特例事由により即時対応。'),
-- Dコースから他コースへ（制約解消後の復帰）
('D', 'A', true, true, true, '制約解消後の復帰。全面協力型への変更には十分な準備期間と訓練が必要。'),
('D', 'B', true, true, true, '制約解消後の復帰。施設内協力型への変更。部署異動に対応可能に。'),
('D', 'C', true, true, false, '制約解消後の復帰。専門職型への変更。');

-- 5. Row Level Security (RLS) 設定
ALTER TABLE course_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_career_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_course_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_transfer_rules ENABLE ROW LEVEL SECURITY;

-- コース定義は全員閲覧可能
CREATE POLICY "コース定義は全職員が閲覧可能" ON course_definitions FOR SELECT TO authenticated USING (is_active = true);

-- 職員は自分のコース情報のみ閲覧可能、人事部は全員閲覧可能
CREATE POLICY "職員は自分のキャリアコース情報を閲覧可能" ON staff_career_courses
  FOR SELECT TO authenticated
  USING (
    staff_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM staff_records
      WHERE id = auth.uid()
      AND role IN ('人事部長', '人事部スタッフ', '法人統括事務局長')
    )
  );

-- 変更申請は本人と人事部のみ
CREATE POLICY "職員は自分のコース変更申請を作成・閲覧可能" ON career_course_change_requests
  FOR ALL TO authenticated
  USING (
    staff_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM staff_records
      WHERE id = auth.uid()
      AND role IN ('人事部長', '人事部スタッフ', '法人統括事務局長')
    )
  );

-- 6. トリガー: 更新日時の自動更新
CREATE OR REPLACE FUNCTION update_career_course_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_definitions_updated_at BEFORE UPDATE ON course_definitions
  FOR EACH ROW EXECUTE FUNCTION update_career_course_updated_at();

CREATE TRIGGER update_staff_career_courses_updated_at BEFORE UPDATE ON staff_career_courses
  FOR EACH ROW EXECUTE FUNCTION update_career_course_updated_at();

CREATE TRIGGER update_career_course_change_requests_updated_at BEFORE UPDATE ON career_course_change_requests
  FOR EACH ROW EXECUTE FUNCTION update_career_course_updated_at();

CREATE TRIGGER update_course_transfer_rules_updated_at BEFORE UPDATE ON course_transfer_rules
  FOR EACH ROW EXECUTE FUNCTION update_career_course_updated_at();

-- 7. コース変更申請承認時の自動反映トリガー
CREATE OR REPLACE FUNCTION apply_approved_course_change()
RETURNS TRIGGER AS $$
BEGIN
  -- 承認されたら staff_career_courses へ反映
  IF NEW.approval_status = 'approved' AND OLD.approval_status = 'pending' AND NOT NEW.applied_to_record THEN
    -- 現在のコースを終了
    UPDATE staff_career_courses
    SET effective_to = NEW.requested_effective_date - INTERVAL '1 day'
    WHERE staff_id = NEW.staff_id AND effective_to IS NULL;

    -- 新しいコースを開始
    INSERT INTO staff_career_courses (
      staff_id, course_code, effective_from, next_change_available_date,
      special_change_reason, approved_at, approved_by, approval_status
    ) VALUES (
      NEW.staff_id,
      NEW.requested_course_code,
      NEW.requested_effective_date,
      CASE
        WHEN NEW.change_reason LIKE 'special_%' THEN NULL -- 特例変更の場合は制限なし
        ELSE NEW.requested_effective_date + INTERVAL '1 year' -- 年1回制限
      END,
      CASE
        WHEN NEW.change_reason = 'special_pregnancy' THEN 'pregnancy'
        WHEN NEW.change_reason = 'special_caregiving' THEN 'caregiving'
        WHEN NEW.change_reason = 'special_illness' THEN 'illness'
        ELSE NULL
      END,
      NEW.reviewed_at,
      NEW.reviewed_by,
      'approved'
    );

    -- 反映済みフラグを立てる
    NEW.applied_to_record := true;
    NEW.applied_at := CURRENT_TIMESTAMP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_apply_approved_course_change
  BEFORE UPDATE ON career_course_change_requests
  FOR EACH ROW
  WHEN (NEW.approval_status = 'approved' AND OLD.approval_status = 'pending')
  EXECUTE FUNCTION apply_approved_course_change();

COMMENT ON FUNCTION apply_approved_course_change() IS 'コース変更申請が承認されたら自動的に staff_career_courses へ反映する。';