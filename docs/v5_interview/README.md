# V5 面談シート - 動機タイプ判定システム

## 概要

V5面談シートは、7種類の動機タイプ判定機能を統合した次世代の面談システムです。職員一人ひとりの内発的動機を理解し、個別最適化されたマネジメントを実現します。

## 🎯 動機タイプの種類

### 1. 成長・挑戦型
- **特徴**: 学習意欲が高く、新しいことへの挑戦を好む
- **キーワード**: スキルアップ、新規事業、チャレンジ
- **推奨アプローチ**: 研修機会、新規プロジェクト、昇進パス

### 2. 評価・承認型
- **特徴**: 他者からの評価や承認を重視
- **キーワード**: 評価、表彰、昇進
- **推奨アプローチ**: 表彰制度、公開評価、明確な昇進基準

### 3. 安定・安心型
- **特徴**: リスクを避け、確実性を重視
- **キーワード**: 安定、確実、段階的
- **推奨アプローチ**: 丁寧な説明、段階的変化、マニュアル整備

### 4. 関係・調和型
- **特徴**: 人間関係やチームワークを重視
- **キーワード**: チーム、協力、支援
- **推奨アプローチ**: チーム業務、メンター役、コーディネーター

### 5. 効率・合理型
- **特徴**: 効率性と合理性を追求
- **キーワード**: 効率、合理的、最適化
- **推奨アプローチ**: 業務効率化、DX推進、プロセス改善

### 6. 報酬・待遇型
- **特徴**: 給与や福利厚生を重視
- **キーワード**: 給与、福利厚生、待遇
- **推奨アプローチ**: 昇給、福利厚生充実、副業許可

### 7. 自由・創造型
- **特徴**: 自由度と創造性を重視
- **キーワード**: 自由、創造性、個性
- **推奨アプローチ**: フレックス制度、クリエイティブ業務、裁量権拡大

## 📁 ファイル構成

```
v5_interview/
├── components/
│   └── MotivationType.tsx              # 動機タイプ判定コンポーネント
├── database/
│   ├── motivation-type-schema.sql      # SQLスキーマ定義
│   └── schema.prisma                   # Prismaスキーマ
├── types/
│   └── motivation-types.ts             # TypeScript型定義
├── general-nurse-unified-15min.tsx     # 一般看護師15分版
├── general-nurse-unified-30min.tsx     # 一般看護師30分版
├── general-nurse-unified-45min.tsx     # 一般看護師45分版
├── new-nurse-unified-45min.tsx         # 新人看護師45分版
├── senior-nurse-unified-45min.tsx      # シニア看護師45分版
├── veteran-nurse-unified-45min.tsx     # ベテラン看護師45分版
├── chief-nurse-unified-45min.tsx       # 主任看護師45分版
├── leader-nurse-unified-45min.tsx      # リーダー看護師45分版
└── README.md                            # このファイル
```

## 💾 データベース構成

### 主要テーブル

1. **motivation_types**: 動機タイプマスター
2. **staff_motivation_history**: 職員の動機タイプ履歴
3. **motivation_type_actions**: タイプ別推奨アクション
4. **motivation_type_compatibility**: タイプ間の相性情報
5. **interviews**: 面談記録（動機タイプ拡張）

### ビュー

- **staff_motivation_trends**: 職員の動機タイプ変化追跡
- **department_motivation_distribution**: 部署別動機タイプ分布

## 🚀 実装方法

### 1. データベースセットアップ

```bash
# SQLスキーマの適用
mysql -u root -p your_database < database/motivation-type-schema.sql

# Prismaマイグレーション
npx prisma migrate dev --name add-motivation-types
```

### 2. コンポーネントの使用

```tsx
import { MotivationTypeSection } from '@/docs/v5_interview/components/MotivationType';

function InterviewSheet() {
  const [selectedType, setSelectedType] = useState('');
  
  return (
    <MotivationTypeSection 
      selectedType={selectedType}
      onTypeSelect={setSelectedType}
    />
  );
}
```

### 3. APIエンドポイント

```typescript
// 動機タイプ判定の保存
POST /api/motivation/assess
{
  staffId: 123,
  motivationTypeId: "growth",
  confidenceLevel: "high",
  notes: "研修への積極的参加が顕著"
}

// 部署別分布の取得
GET /api/motivation/distribution/:department

// チーム相性分析
POST /api/motivation/team-compatibility
{
  teamId: "nursing-3f",
  memberIds: [123, 124, 125]
}
```

## 📊 活用方法

### 個人レベル
1. **採用面接**: 初期の動機タイプ判定
2. **定期面談**: タイプの変化追跡
3. **キャリア開発**: タイプに応じた育成計画
4. **離職防止**: タイプ別の満足度向上施策

### チームレベル
1. **チーム編成**: 相性の良い組み合わせ
2. **プロジェクトアサイン**: タイプに適した役割分担
3. **コミュニケーション**: タイプ別の効果的な伝え方

### 組織レベル
1. **人事戦略**: 部署別のタイプ分布最適化
2. **研修計画**: タイプ別研修プログラム
3. **福利厚生**: タイプ別ニーズへの対応
4. **組織文化**: 多様な動機タイプの共存

## 🔍 分析機能

### 1. トレンド分析
- 個人の動機タイプ変化
- 部署別の傾向変化
- 季節性・周期性の把握

### 2. 相性分析
- チーム内の相性マトリックス
- 上司-部下の相性評価
- 最適なペアリング提案

### 3. 効果測定
- タイプ別施策の効果
- エンゲージメント向上率
- 離職率の改善

## 📈 期待される効果

1. **離職率の低下**: 20-30%の改善
2. **エンゲージメント向上**: 15-25%の向上
3. **生産性向上**: 10-15%の改善
4. **職員満足度**: 25-35%の向上

## 🔧 カスタマイズ

### 動機タイプの追加
```sql
INSERT INTO motivation_types (id, type_name, label, description, approach)
VALUES ('custom', 'カスタム型', '独自の動機', '説明', 'アプローチ');
```

### タイプ別アクションの追加
```sql
INSERT INTO motivation_type_actions (motivation_type_id, action_category, action_name)
VALUES ('growth', 'training', '新規研修プログラム');
```

## 📝 注意事項

1. **プライバシー**: 動機タイプ情報は個人情報として慎重に扱う
2. **固定観念の回避**: タイプは変化する可能性があることを認識
3. **複合型の考慮**: 複数のタイプを併せ持つ職員への対応
4. **定期的な再評価**: 3-6ヶ月ごとの見直しを推奨

## 🤝 サポート

問題や質問がある場合は、以下にお問い合わせください：
- システム管理者
- 人事部門
- IT支援チーム

---
*Version 5.0.0 - 2025年8月*