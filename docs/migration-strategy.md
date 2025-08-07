# 評価システムデータ移行戦略

## 概要
既存の評価データを新しい5段階評価システムへ移行するための戦略とDB設計指針。

## 1. 現状分析

### 現在のデータ構造
- 評価データはモックデータとして実装
- 2軸評価（施設内・法人内）は実装済み
- 評価グレードは既に5段階（S, A, B, C, D）

### 移行対象データ
1. **職員基本情報**
2. **評価履歴データ**
3. **組織貢献度査定データ**
4. **技術評価データ**

## 2. DB設計方針

### 2.1 テーブル構造

```sql
-- 1. 評価期間マスタ
CREATE TABLE evaluation_periods (
  id UUID PRIMARY KEY,
  year INTEGER NOT NULL,
  period_type VARCHAR(10) NOT NULL, -- 'annual', 'H1', 'H2'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'planning', 'active', 'closed', 'finalized'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 技術評価テーブル
CREATE TABLE technical_evaluations (
  id UUID PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,
  evaluation_period_id UUID REFERENCES evaluation_periods(id),
  year INTEGER NOT NULL,
  
  -- 評価項目スコア（各5点満点）
  basic_skills_superior DECIMAL(3,1),
  basic_skills_self DECIMAL(3,1),
  expertise_superior DECIMAL(3,1),
  expertise_self DECIMAL(3,1),
  patient_care_superior DECIMAL(3,1),
  patient_care_self DECIMAL(3,1),
  teamwork_superior DECIMAL(3,1),
  teamwork_self DECIMAL(3,1),
  safety_superior DECIMAL(3,1),
  safety_self DECIMAL(3,1),
  problem_solving_superior DECIMAL(3,1),
  problem_solving_self DECIMAL(3,1),
  growth_superior DECIMAL(3,1),
  growth_self DECIMAL(3,1),
  leadership_superior DECIMAL(3,1),
  leadership_self DECIMAL(3,1),
  
  -- 計算済みスコア
  total_score DECIMAL(4,1), -- 50点満点
  
  -- コメント
  strengths TEXT,
  improvements TEXT,
  goals TEXT,
  overall_comments TEXT,
  
  -- メタデータ
  evaluator_id VARCHAR(50),
  evaluation_date DATE,
  status VARCHAR(20), -- 'draft', 'submitted', 'approved'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_staff_year (staff_id, year),
  INDEX idx_period (evaluation_period_id)
);

-- 3. 組織貢献度査定テーブル
CREATE TABLE contribution_assessments (
  id UUID PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  term VARCHAR(10) NOT NULL, -- 'summer', 'winter'
  
  -- 施設貢献項目
  facility_committees INTEGER DEFAULT 0,
  facility_training INTEGER DEFAULT 0,
  facility_improvements INTEGER DEFAULT 0,
  facility_mentoring INTEGER DEFAULT 0,
  facility_overtime INTEGER DEFAULT 0,
  facility_subtotal INTEGER NOT NULL,
  
  -- 法人貢献項目
  corporate_events INTEGER DEFAULT 0,
  corporate_cross_support INTEGER DEFAULT 0,
  corporate_projects INTEGER DEFAULT 0,
  corporate_recruitment INTEGER DEFAULT 0,
  corporate_publicity INTEGER DEFAULT 0,
  corporate_subtotal INTEGER NOT NULL,
  
  -- メタデータ
  assessor_id VARCHAR(50),
  assessment_date DATE,
  status VARCHAR(20), -- 'draft', 'submitted', 'finalized'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_staff_year_term (staff_id, year, term),
  INDEX idx_year_term (year, term)
);

-- 4. 年間統合評価結果テーブル
CREATE TABLE annual_evaluations (
  id UUID PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  facility_id VARCHAR(50) NOT NULL,
  department_id VARCHAR(50),
  job_category VARCHAR(50) NOT NULL,
  job_level VARCHAR(50),
  
  -- 技術評価
  technical_score DECIMAL(4,1), -- 50点満点
  
  -- 組織貢献度（年間）
  facility_contribution_year_total INTEGER,
  facility_contribution_final_score DECIMAL(4,1), -- 25点満点（相対評価後）
  corporate_contribution_year_total INTEGER,
  corporate_contribution_final_score DECIMAL(4,1), -- 25点満点（相対評価後）
  
  -- 総合スコア
  total_score DECIMAL(5,1), -- 100点満点
  
  -- 順位情報
  facility_rank INTEGER,
  facility_total INTEGER,
  facility_percentile DECIMAL(5,2),
  corporate_rank INTEGER,
  corporate_total INTEGER,
  corporate_percentile DECIMAL(5,2),
  
  -- 評価グレード
  facility_grade CHAR(1), -- S, A, B, C, D
  corporate_grade CHAR(1), -- S, A, B, C, D
  final_grade VARCHAR(3), -- S+, S, A+, A, B, C, D
  
  -- 評価コメント
  overall_comments TEXT,
  recommendations TEXT,
  
  -- メタデータ
  calculated_at TIMESTAMP,
  approved_by VARCHAR(50),
  approved_at TIMESTAMP,
  status VARCHAR(20), -- 'calculated', 'approved', 'finalized'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_staff_year (staff_id, year),
  INDEX idx_facility_category (facility_id, job_category, year),
  INDEX idx_final_grade (final_grade, year)
);

-- 5. 評価履歴テーブル（過去データ保存用）
CREATE TABLE evaluation_history (
  id UUID PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  evaluation_type VARCHAR(20), -- 'technical', 'contribution', 'annual'
  data JSON, -- 詳細データをJSON形式で保存
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_staff_history (staff_id, year, evaluation_type)
);
```

### 2.2 マスタテーブル

```sql
-- 評価グレードマスタ
CREATE TABLE evaluation_grade_master (
  id UUID PRIMARY KEY,
  code CHAR(1) NOT NULL, -- S, A, B, C, D
  name VARCHAR(50) NOT NULL,
  description TEXT,
  percentile_min DECIMAL(5,2),
  percentile_max DECIMAL(5,2),
  display_color VARCHAR(20),
  display_order INTEGER,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 最終評価グレードマスタ
CREATE TABLE final_grade_master (
  id UUID PRIMARY KEY,
  code VARCHAR(3) NOT NULL, -- S+, S, A+, A, B, C, D
  name VARCHAR(50) NOT NULL,
  description TEXT,
  facility_grade CHAR(1) NOT NULL,
  corporate_grade CHAR(1) NOT NULL,
  display_color VARCHAR(20),
  display_order INTEGER,
  recommendation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. データ移行手順

### 3.1 段階的移行計画

#### Phase 1: 基盤構築（1ヶ月目）
1. DB環境構築
2. テーブル作成
3. マスタデータ投入
4. 接続設定

#### Phase 2: データ移行（2ヶ月目）
1. 職員マスタの移行
2. 既存評価データのエクスポート
3. データ変換処理
4. 新テーブルへのインポート
5. データ検証

#### Phase 3: 並行稼働（3ヶ月目）
1. 新旧システムの並行運用
2. データ整合性チェック
3. パフォーマンス調整
4. バックアップ体制確立

#### Phase 4: 切替（4ヶ月目）
1. 最終データ同期
2. システム切替
3. 旧システム停止
4. 監視強化

### 3.2 データ変換ルール

```javascript
// 4段階評価から5段階評価への変換（必要な場合）
const convertGrade = (oldGrade) => {
  const mapping = {
    'A': 'S',  // 旧最高評価 → 新S
    'B': 'A',  // 旧良好 → 新A
    'C': 'B',  // 旧標準 → 新B
    'D': 'C'   // 旧要改善 → 新C
    // 新Dは新規追加
  };
  return mapping[oldGrade] || 'B'; // デフォルトはB
};

// パーセンタイル再計算
const recalculatePercentile = (rank, total) => {
  return (rank / total) * 100;
};

// 新グレード判定
const determineNewGrade = (percentile) => {
  if (percentile <= 10) return 'S';
  if (percentile <= 30) return 'A';
  if (percentile <= 70) return 'B';
  if (percentile <= 90) return 'C';
  return 'D';
};
```

## 4. API実装方針

### 4.1 サービス層の更新

```typescript
// src/services/evaluationService.ts
export class EvaluationService {
  // DBからデータ取得（現在のモックを置き換え）
  async getTechnicalEvaluation(staffId: string, year: number) {
    const result = await db.query(
      'SELECT * FROM technical_evaluations WHERE staff_id = $1 AND year = $2',
      [staffId, year]
    );
    return result.rows[0];
  }

  // 組織貢献度査定の保存
  async saveContributionAssessment(data: ContributionAssessment) {
    const result = await db.query(
      `INSERT INTO contribution_assessments 
       (staff_id, year, term, facility_subtotal, corporate_subtotal, ...)
       VALUES ($1, $2, $3, $4, $5, ...)
       ON CONFLICT (staff_id, year, term) 
       DO UPDATE SET ...`,
      [data.staffId, data.year, data.term, ...]
    );
    return result.rows[0];
  }

  // バッチ処理の実行
  async executeBatchCalculation(year: number) {
    // トランザクション内で実行
    await db.transaction(async (trx) => {
      // 1. 全職員の評価データ取得
      // 2. 順位計算
      // 3. 相対評価
      // 4. 結果保存
    });
  }
}
```

### 4.2 キャッシュ戦略

```typescript
// Redis等を使用したキャッシュ
const cacheKey = `evaluation:${staffId}:${year}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const data = await db.query(...);
await redis.setex(cacheKey, 3600, JSON.stringify(data));
return data;
```

## 5. リスク管理

### 5.1 想定リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| データ不整合 | 高 | バリデーション強化、ログ監視 |
| パフォーマンス低下 | 中 | インデックス最適化、キャッシュ活用 |
| 移行失敗 | 高 | ロールバック手順準備、バックアップ |
| ユーザー混乱 | 中 | 研修実施、マニュアル整備 |

### 5.2 バックアップ方針

- 日次バックアップ（7世代保持）
- 週次フルバックアップ（4世代保持）
- 月次アーカイブ（12世代保持）
- リアルタイムレプリケーション

## 6. 成功指標

- データ移行精度: 99.9%以上
- システム稼働率: 99.5%以上
- レスポンス時間: 3秒以内
- ユーザー満足度: 80%以上

## 7. スケジュール

| タスク | 開始 | 終了 | 担当 |
|--------|------|------|------|
| DB設計レビュー | M1W1 | M1W2 | DBAチーム |
| 環境構築 | M1W2 | M1W4 | インフラチーム |
| データ移行開発 | M2W1 | M2W4 | 開発チーム |
| テスト実施 | M3W1 | M3W3 | QAチーム |
| 本番移行 | M4W1 | M4W2 | 全チーム |

## 8. 連絡先

- プロジェクトマネージャー: [PM名]
- 技術リード: [リード名]
- DBA: [DBA名]
- サポート: support@example.com