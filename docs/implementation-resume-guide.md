# 教育研修・人事評価連動システム 実装作業再開指示書

## 📋 作業概要
**作成日**: 2025年8月10日  
**システム名**: 教育研修・人事評価連動システム  
**作業ステータス**: 第1フェーズ完了、第2フェーズ準備中

---

## ✅ 実装完了済み機能（第1フェーズ）

### 1. 項目バンク機能
- **ファイル**: 
  - `src/data/evaluationItemBank.ts` - データ構造定義
  - `src/components/training/EvaluationItemBank.tsx` - UIコンポーネント
- **機能**: 評価項目と研修プログラムの紐付け管理
- **配置**: `/training` ページ > 項目バンクタブ

### 2. 研修計画自動生成機能
- **ファイル**:
  - `src/data/trainingPlanGenerator.ts` - 生成ロジック
  - `src/components/training/TrainingPlanGenerator.tsx` - UIコンポーネント
- **機能**: 評価項目から年間研修計画を自動生成
- **配置**: `/training` ページ > 研修計画タブ

### 3. 法定研修ガイド
- **ファイル**: `src/components/education/LegalTrainingGuide.tsx`
- **機能**: 施設種別ごとの法定研修要件一覧
- **配置**: `/training` ページ > ガイドタブ

### 4. ページ構成
- **教育・研修管理ページ**: `/training` - 実務的な研修管理
- **評価管理ページ**: `/education` - 評価との連携管理

---

## 🎯 次期実装予定（第2フェーズ）

### 【優先度：高】1. 評価連携機能の強化

#### 実装内容
- 研修受講状況から評価点を自動計算
- 上司評価・本人評価の構造を考慮
- 未受講研修のアラート表示
- 評価シートとの実データ連携

#### 技術要件
```typescript
// 評価構造
技術評価（50点）{
  法人統一項目（30点）{
    上司評価: 15点,
    本人評価: 15点
  },
  施設特化項目（20点）{
    上司評価: 10点,
    本人評価: 10点
  }
}
```

#### 実装ファイル予定
- `src/data/evaluationCalculator.ts` - 評価計算ロジック
- `src/components/evaluation/EvaluationForm.tsx` - 評価入力フォーム
- `src/components/evaluation/TrainingStatusCheck.tsx` - 受講状況確認

### 【優先度：高】2. 進捗ダッシュボード

#### 実装内容
- 法人全体の研修進捗可視化
- 評価項目の達成率表示
- 施設間比較機能
- リアルタイム進捗監視

#### 実装ファイル予定
- `src/components/training/ProgressDashboard.tsx`
- `src/data/progressAnalytics.ts`

### 【優先度：中】3. レポート・分析機能

#### 実装内容
- 研修と評価の相関分析
- 研修効果測定レポート
- 部署別パフォーマンス分析
- ROI（投資対効果）測定

#### 実装ファイル予定
- `src/components/training/AnalyticsReports.tsx`
- `src/data/analyticsEngine.ts`

### 【優先度：中】4. 通知・アラート機能

#### 実装内容
- 研修期限切れアラート
- 未受講者への自動通知
- 管理者向けダッシュボード
- メール・システム内通知

### 【優先度：低】5. データ管理機能

#### 実装内容
- 受講履歴の詳細管理
- 証明書発行システム
- 外部システム連携
- データエクスポート機能

---

## 🗂️ 重要な既存データ構造

### 1. 評価項目データ（evaluationItemBank.ts）
```typescript
interface EvaluationItem {
  id: string;
  name: string;
  category: 'corporate' | 'facility'; // 法人統一 or 施設特化
  points: number; // 配点
  requiredTrainings?: string[]; // 必要な研修ID
  targetRoles: string[]; // 対象職種
  targetLevels: string[]; // 対象経験レベル
}
```

### 2. 研修プログラムデータ
```typescript
interface TrainingProgram {
  id: string;
  name: string;
  category: 'legal' | 'skill' | 'management' | 'specialty';
  type: 'mandatory' | 'optional';
  relatedItems: string[]; // 関連する評価項目ID
}
```

### 3. 推奨項目セット
```typescript
interface ItemSet {
  facilityType: string; // 施設種別
  role: string; // 職種
  level: string; // 経験レベル
  corporateItems: string[]; // 法人統一項目ID
  facilityItems: string[]; // 施設特化項目ID
}
```

---

## 🔧 開発環境・技術スタック

### フレームワーク
- **Next.js 14** - React フレームワーク
- **TypeScript** - 型安全性確保
- **Tailwind CSS** + カスタムCSS - スタイリング

### 既存コンポーネント
- `/src/components/ui/` - shadcn/ui ベースのUIコンポーネント
- `/src/app/training/Training.module.css` - 研修管理用スタイル

### データ管理
- 静的データファイル（.ts）で管理
- 将来的にはAPI連携予定

---

## 📁 ファイル構成

```
src/
├── app/
│   ├── training/page.tsx          # 教育研修管理メインページ
│   └── education/page.tsx         # 評価連携管理ページ
├── components/
│   ├── training/
│   │   ├── EvaluationItemBank.tsx      # 項目バンク
│   │   ├── TrainingPlanGenerator.tsx   # 研修計画生成
│   │   └── [次期実装予定コンポーネント]
│   └── education/
│       └── LegalTrainingGuide.tsx      # 法定研修ガイド
├── data/
│   ├── evaluationItemBank.ts           # 評価項目・研修データ
│   ├── trainingPlanGenerator.ts        # 研修計画生成ロジック
│   └── [次期実装予定データファイル]
└── docs/
    └── implementation-resume-guide.md  # このファイル
```

---

## 🚀 作業再開手順

### 1. 環境確認
```bash
cd C:\projects\staff-medical-system
git status
git log --oneline -5
npm run dev  # 開発サーバー起動
```

### 2. 現在の実装確認
- ブラウザで `http://localhost:3000/training` にアクセス
- 項目バンク、研修計画、ガイドタブの動作確認

### 3. 次期機能の実装開始
- **推奨**: 「評価連携機能の強化」から開始
- 上司評価・本人評価の構造を考慮した設計

### 4. 作業の進め方
1. TodoWriteツールで作業項目を管理
2. 段階的に実装・テスト・コミット
3. 開発メモを含めた説明コメントを追加

---

## 💡 重要な設計思想

### システムコンセプト
「教育研修と人事評価の完全連動により、透明性の高い人材育成制度を実現」

### 核となる仕組み
1. **評価項目** ←→ **研修プログラム** の双方向連携
2. **研修受講** → **評価可能** → **スキル向上** のサイクル
3. **法人統一（30点）** + **施設特化（20点）** = **技術評価（50点）**

### ユーザー
- **法人教育師長**: 戦略的な教育研修計画の策定
- **現場管理者**: 部署レベルでの研修・評価管理  
- **職員**: 自身の成長計画とスキルアップ

---

## 📞 作業再開時の確認事項

### 質問・確認ポイント
1. 評価制度の詳細（上司評価・本人評価の配点・入力方法）
2. 既存の人事システムとの連携要件
3. 実際の運用フロー（誰がいつ何を入力するか）
4. データの永続化方法（データベース設計）

### 実装優先度の再確認
- 最優先で実装すべき機能
- 運用開始に必要な最小限の機能
- 段階的リリースの計画

---

## 📚 参考情報

### 関連ドキュメント
- `/docs` フォルダ内の他のドキュメント
- 各コンポーネント内の開発メモ

### Git情報
- **メインブランチ**: `main`
- **開発ブランチ**: `preview/feature-name`
- 両ブランチは同期済み

---

**📧 作業再開時は「研修受講状況から評価点を自動計算」の実装から開始することを推奨します。**

---
*実装作業再開指示書 - 2025年8月10日作成*