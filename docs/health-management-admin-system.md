# 健康管理システム実装計画書（管理者向け）

## システム概要

**利用者**: 人事部、健診室、産業医・産業保健師のみ
**目的**: 職員の健康情報を一元管理し、組織全体の健康管理を効率化

## 1. データ構造設計

### A. 健康診断管理テーブル
```sql
CREATE TABLE health_checkups (
  id VARCHAR(50) PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,
  checkup_date DATE NOT NULL,
  checkup_type ENUM('定期', '雇入時', '特殊', '海外派遣'),
  medical_institution VARCHAR(100),

  -- 総合判定
  overall_result ENUM('A', 'B', 'C', 'D', 'E'),
  reexamination_required BOOLEAN DEFAULT FALSE,
  reexamination_items TEXT,

  -- 管理用フィールド
  data_entry_method ENUM('csv_import', 'manual', 'api'),
  entry_staff_id VARCHAR(50),
  entry_date TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### B. 病歴・既往歴管理テーブル
```sql
CREATE TABLE medical_histories (
  id VARCHAR(50) PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,

  -- 申告情報
  report_date DATE NOT NULL,
  report_type ENUM('入職時', '定期更新', '随時申告'),

  -- 病歴情報
  disease_name VARCHAR(200),
  diagnosis_date DATE,
  treatment_status ENUM('治療中', '経過観察', '完治', '未治療'),
  medical_institution VARCHAR(100),
  attending_doctor VARCHAR(50),

  -- 治療内容
  medication TEXT, -- 服薬情報
  treatment_details TEXT,
  work_restrictions TEXT, -- 就業制限事項

  -- フォローアップ
  next_checkup_date DATE,
  special_considerations TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_master(id)
);
```

### C. 就業配慮管理テーブル
```sql
CREATE TABLE work_accommodations (
  id VARCHAR(50) PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,

  -- 配慮内容
  accommodation_type ENUM('就業制限', '配置転換', '時短勤務', '在宅勤務', 'その他'),
  start_date DATE NOT NULL,
  end_date DATE,

  -- 詳細
  reason VARCHAR(200),
  details TEXT,
  doctor_opinion TEXT,

  -- 承認情報
  approved_by VARCHAR(50),
  approved_date DATE,
  status ENUM('申請中', '承認済', '実施中', '終了', '却下'),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_master(id)
);
```

### D. 健康管理イベント履歴
```sql
CREATE TABLE health_events (
  id VARCHAR(50) PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,
  event_date DATE NOT NULL,
  event_type ENUM(
    '健康診断実施', '再検査実施', '産業医面談',
    '保健指導', 'ストレスチェック', '予防接種',
    '病歴更新', '就業制限開始', '就業制限解除'
  ),

  -- イベント詳細
  title VARCHAR(200),
  details TEXT,
  action_required TEXT,
  follow_up_date DATE,

  -- 記録者情報
  recorded_by VARCHAR(50),
  department ENUM('人事部', '健診室', '産業医'),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. 機能要件（管理者視点）

### A. 健康管理ページ - 管理者ダッシュボード

#### 1. 組織健康状態サマリー
```typescript
interface OrganizationHealthDashboard {
  // 全体統計
  statistics: {
    totalStaff: number;
    checkupCompletionRate: number; // 健診受診率
    reexaminationRate: number; // 要再検査率
    highRiskCount: number; // 要注意者数
    medicalLeaveCount: number; // 病休者数
  };

  // 部署別状況
  departmentHealth: {
    department: string;
    staffCount: number;
    checkupRate: number;
    averageHealthScore: string; // A～E分布
    concerns: string[]; // 注意事項
  }[];

  // 緊急対応リスト
  urgentActions: {
    type: '未受診' | '要再検査' | '要面談' | '就業制限';
    staffList: StaffBasicInfo[];
    deadline: Date;
  }[];
}
```

#### 2. データ管理機能
- **一括インポート**: CSV/Excel形式での健診データ取り込み
- **バリデーション**: 異常値の自動検出とアラート
- **差分管理**: 前回データとの比較・変化検出
- **エラーログ**: インポートエラーの詳細記録

### B. 職員個別管理画面

#### 1. 統合健康カルテ
```typescript
interface StaffHealthRecord {
  // 基本情報
  staffInfo: {
    id: string;
    name: string;
    department: string;
    position: string;
    employmentDate: Date;
    age: number;
  };

  // 健診履歴
  checkupHistory: {
    date: Date;
    result: 'A' | 'B' | 'C' | 'D' | 'E';
    abnormalItems: string[];
    reexamStatus: '不要' | '未実施' | '実施済';
  }[];

  // 病歴・治療情報
  medicalHistory: {
    disease: string;
    status: '治療中' | '経過観察' | '完治';
    medication: string[];
    workRestrictions: string;
  }[];

  // 産業医所見
  occupationalPhysicianNotes: {
    date: Date;
    assessment: string;
    recommendations: string;
    nextReviewDate: Date;
  }[];

  // フラグ管理
  flags: {
    highRisk: boolean; // 高リスク者
    longTermCare: boolean; // 長期療養中
    specialMonitoring: boolean; // 特別観察対象
    pregnancyRelated: boolean; // 妊娠関連配慮
  };
}
```

#### 2. アクション管理
- 再検査スケジュール管理
- 産業医面談予約
- 就業制限の設定・解除
- フォローアップタスク管理

### C. レポート・分析機能

#### 1. 定期報告書生成
- **安全衛生委員会報告**: 月次健康統計
- **労基署提出書類**: 定期健康診断実施報告
- **経営層向けレポート**: 健康経営指標

#### 2. 分析ダッシュボード
```typescript
interface HealthAnalytics {
  // 経年変化分析
  trends: {
    year: number;
    checkupRate: number;
    abnormalRate: number;
    medicalLeavedays: number;
  }[];

  // リスク分析
  riskMatrix: {
    category: string; // '生活習慣病', 'メンタル', '筋骨格系'
    count: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    departments: string[];
  }[];

  // 予測アラート
  predictions: {
    type: string;
    message: string;
    affectedCount: number;
    suggestedAction: string;
  }[];
}
```

## 3. 運用フロー

### A. 健康診断実施フロー
1. **事前準備**
   - 対象者リスト自動生成
   - 医療機関予約管理
   - 案内通知の一括送信

2. **実施管理**
   - 受診状況リアルタイム追跡
   - 未受診者への自動リマインド
   - 特殊健診対象者の管理

3. **結果処理**
   - CSVデータの一括取り込み
   - 異常値の自動フラグ付け
   - 産業医判定の記録

4. **事後措置**
   - 要再検査者リスト生成
   - 就業判定の実施
   - フォローアップスケジュール設定

### B. 病歴管理フロー
1. **入職時**: 健康申告書のデジタル化
2. **定期更新**: 年次での病歴確認・更新
3. **随時申告**: 新規疾病・治療開始時の記録
4. **配慮設定**: 必要な就業配慮の登録・管理

## 4. 管理者向け機能優先順位

### Phase 1: 基本管理機能（必須）
1. 健診データCSV取り込み
2. 職員健康カルテ表示
3. 要再検査者リスト管理
4. 基本統計ダッシュボード

### Phase 2: 高度管理機能
1. 病歴・治療情報管理
2. 就業配慮設定
3. 産業医所見記録
4. 自動アラート機能

### Phase 3: 分析・予測機能
1. 健康トレンド分析
2. リスク予測
3. レポート自動生成
4. 他システム連携

## 5. データ入力効率化

### A. テンプレート機能
- 医療機関別CSVフォーマット登録
- 頻出疾患名の辞書管理
- 定型文言の登録

### B. 自動化機能
- 年齢による健診項目自動設定
- 前回データからの差分強調表示
- 基準値超過の自動検出

### C. バリデーション
- 必須項目チェック
- 数値範囲検証
- 論理チェック（年齢と生年月日の整合性等）

## 6. 管理者権限設定

```typescript
interface AdminRoles {
  人事部管理者: {
    view: ['統計データ', '要対応者リスト'];
    edit: ['就業配慮', 'スケジュール'];
    export: ['統計レポート'];
  };

  健診室スタッフ: {
    view: ['全健康データ'];
    edit: ['健診結果', '予約管理'];
    import: ['CSVデータ'];
  };

  産業医・保健師: {
    view: ['全健康データ', '病歴情報'];
    edit: ['医学的所見', '就業判定'];
    create: ['面談記録', '指導記録'];
  };
}
```

## 7. システム連携

### 既存システムとの連携
- **勤怠管理**: 病欠・休職情報の自動連携
- **ストレスチェック**: メンタル面と身体面の統合評価
- **面談システム**: 産業医面談スケジュール連携

## まとめ

本システムは管理者（人事部・健診室・産業医）による職員健康情報の効率的な管理を目的としています。

### 重要ポイント
1. **データの一元管理**: 健診結果、病歴、治療情報を統合
2. **効率的な運用**: CSV一括取り込み、自動アラート
3. **リスク管理**: 要注意者の早期発見とフォロー
4. **コンプライアンス**: 労働安全衛生法への確実な対応

初期段階では基本的なデータ管理機能から実装し、段階的に分析・予測機能を追加することで、実用的な健康管理基盤を構築します。