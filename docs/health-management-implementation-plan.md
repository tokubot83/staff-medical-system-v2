# 健康管理機能実装方針書

## 現状分析と実装提案

### 現状の実装状況

1. **実装済み機能**
   - ストレスチェック管理（/stress-check）
   - 健康管理ページ（/health）- タブ構成のみ
   - 職員カルテの健康・ウェルビーイングタブ - UI枠のみ

2. **未実装機能**
   - 健康診断データ管理
   - 健康診断履歴の閲覧・管理
   - 健康診断結果の分析・可視化
   - ストレスチェックとの統合管理

### 実装方針の提案

## 1. データベース設計

### A. 健康診断マスターテーブル（health_checkups）
```sql
CREATE TABLE health_checkups (
  id VARCHAR(50) PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,
  checkup_date DATE NOT NULL,
  facility_name VARCHAR(100),
  doctor_name VARCHAR(50),

  -- 基本測定値
  height DECIMAL(4,1),
  weight DECIMAL(4,1),
  bmi DECIMAL(3,1),
  waist_circumference DECIMAL(4,1),

  -- 血圧
  blood_pressure_systolic INT,
  blood_pressure_diastolic INT,

  -- 総合所見
  general_findings TEXT,
  report_date DATE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (staff_id) REFERENCES staff_master(id),
  INDEX idx_staff_checkup (staff_id, checkup_date)
);
```

### B. 検査結果詳細テーブル（health_checkup_details）
```sql
CREATE TABLE health_checkup_details (
  id VARCHAR(50) PRIMARY KEY,
  checkup_id VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'vision', 'hearing', 'blood', 'urine', etc.
  item_code VARCHAR(50) NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  value VARCHAR(50),
  unit VARCHAR(20),
  reference_range VARCHAR(50),
  status ENUM('normal', 'attention', 'abnormal'),

  FOREIGN KEY (checkup_id) REFERENCES health_checkups(id),
  INDEX idx_checkup_category (checkup_id, category)
);
```

### C. 健康管理履歴テーブル（health_management_history）
```sql
CREATE TABLE health_management_history (
  id VARCHAR(50) PRIMARY KEY,
  staff_id VARCHAR(50) NOT NULL,
  event_type ENUM('checkup', 'stress_check', 'consultation', 'vaccination'),
  event_date DATE NOT NULL,
  event_id VARCHAR(50), -- 関連するイベントのID
  summary TEXT,
  next_action_date DATE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_master(id),
  INDEX idx_staff_events (staff_id, event_date DESC)
);
```

## 2. 実装優先順位

### Phase 1: 基盤構築（優先度：最高）
1. **健康診断データモデルの実装**
   - TypeScript型定義
   - Prismaスキーマ定義
   - バリデーション処理

2. **データ入力画面の開発**
   - 健康診断結果登録フォーム
   - CSVインポート機能
   - 手動入力インターフェース

### Phase 2: 閲覧・管理機能（優先度：高）
1. **健康管理ページの実装**
   - 健康診断タブの実装
   - 検査結果一覧表示
   - 時系列グラフ表示

2. **職員カルテ統合**
   - 健康・ウェルビーイングタブの実装
   - 健康診断履歴表示
   - ストレスチェック結果との統合表示

### Phase 3: 分析・レポート機能（優先度：中）
1. **分析ダッシュボード**
   - 組織全体の健康指標
   - 部署別統計
   - 経年変化分析

2. **アラート機能**
   - 異常値の自動検出
   - 再検査対象者の管理
   - フォローアップ通知

## 3. UI/UX設計

### A. 健康管理ページ - 健康診断タブ
```typescript
interface HealthCheckupTab {
  // 一覧表示
  list: {
    filters: {
      year: number;
      department: string;
      abnormalOnly: boolean;
    };
    columns: ['氏名', '実施日', '総合判定', '要再検査項目', 'アクション'];
  };

  // 個別詳細
  detail: {
    basicInfo: BasicHealthInfo;
    measurements: PhysicalMeasurements;
    testResults: TestResults[];
    findings: string;
  };
}
```

### B. 職員カルテ - 健康・ウェルビーイングタブ
```typescript
interface HealthWellbeingTab {
  // サマリーカード
  summary: {
    lastCheckupDate: Date;
    overallStatus: 'A' | 'B' | 'C' | 'D';
    attentionItems: string[];
    nextCheckupDate: Date;
  };

  // 履歴タイムライン
  timeline: {
    checkups: CheckupHistory[];
    stressChecks: StressCheckHistory[];
    consultations: ConsultationHistory[];
  };

  // トレンドグラフ
  trends: {
    bmi: TrendData[];
    bloodPressure: TrendData[];
    keyMetrics: TrendData[];
  };
}
```

## 4. セキュリティ・コンプライアンス

### 必須要件
1. **個人情報保護**
   - 健康情報の暗号化保存
   - アクセスログの記録
   - 権限レベルによる閲覧制限

2. **法令遵守**
   - 労働安全衛生法準拠
   - 個人情報保護法対応
   - 医療情報の適切な管理

3. **アクセス権限**
   - 本人: 全データ閲覧可能
   - 上司: サマリーのみ（要同意）
   - 産業医・保健師: 全データ閲覧可能
   - 人事部: 統計データのみ

## 5. 統合機能

### A. ストレスチェックとの連携
- 健康診断とストレスチェック結果の相関分析
- 高リスク者の総合的な把握
- 統合レポート生成

### B. 面談システムとの連携
- 健康相談の予約機能
- 産業医面談の記録
- フォローアップ管理

### C. 通知システムとの連携
- 健康診断の実施案内
- 結果通知
- 再検査リマインダー

## 6. 実装スケジュール案

### 第1四半期（1-3月）
- データベース構築
- 基本CRUD機能の実装
- CSV取り込み機能

### 第2四半期（4-6月）
- UI実装（健康管理ページ）
- 職員カルテ統合
- 基本的な分析機能

### 第3四半期（7-9月）
- 高度な分析機能
- レポート機能
- 通知連携

### 第4四半期（10-12月）
- パフォーマンス最適化
- セキュリティ強化
- 本番環境デプロイ

## 7. 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes, Prisma ORM
- **データベース**: MySQL/PostgreSQL
- **グラフ**: Chart.js, Recharts
- **セキュリティ**: bcrypt, JWT, 暗号化ライブラリ

## まとめ

健康診断データ管理は職員の健康管理において中核となる機能です。
既存のストレスチェック機能と統合することで、総合的な健康管理プラットフォームを構築できます。

### 推奨事項
1. **段階的実装**: 基本機能から順次拡張
2. **既存システムとの連携**: ストレスチェック、面談システムとの統合
3. **セキュリティ最優先**: 健康情報の適切な管理
4. **ユーザビリティ重視**: 簡単な入力、直感的な閲覧

この実装により、法人全体で統一された健康管理が可能となり、
職員の健康状態を継続的に把握・支援できる体制が構築されます。