# VoiceDrive改修指示書

## 概要
本書は、法人SNSシステム「VoiceDrive」の面談予約機能を、医療職員管理システムの10種類面談体系に合わせて改修するための指示書です。

## 改修日時
- 作成日：2024年12月
- 対象システム：VoiceDrive面談予約機能
- 連携先：医療職員管理システム（Staff Medical System）

## 1. 面談体系の変更

### 旧体系（11種類）
削除対象の分類です。

### 新体系（10種類）
以下の体系に変更してください。

#### 1.1 定期面談（3種類）
カテゴリ選択：**不要**
```javascript
const regularInterviews = [
  { id: 'new_employee_monthly', name: '新入職員月次面談', frequency: '月1回', target: '入職1年未満' },
  { id: 'regular_annual', name: '一般職員年次面談', frequency: '年1回', target: '全職員' },
  { id: 'management_biannual', name: '管理職半年面談', frequency: '半年1回', target: '管理職' }
];
```

#### 1.2 特別面談（3種類）
カテゴリ選択：**不要**
```javascript
const specialInterviews = [
  { id: 'return_to_work', name: '復職面談', trigger: '休職からの復帰時' },
  { id: 'incident_followup', name: 'インシデント後面談', trigger: 'インシデント発生後' },
  { id: 'exit_interview', name: '退職面談', trigger: '退職予定時' }
];
```

#### 1.3 サポート面談（4種類）
カテゴリ選択：**必要**（フィードバック面談を除く）
```javascript
const supportInterviews = [
  { 
    id: 'feedback', 
    name: 'フィードバック面談',
    description: '人事評価後のフィードバック',
    requiresCategory: false  // カテゴリ選択不要
  },
  { 
    id: 'career_support', 
    name: 'キャリア系面談',
    requiresCategory: true,
    categories: ['career_path', 'skill_development', 'promotion', 'transfer']
  },
  { 
    id: 'workplace_support', 
    name: '職場環境系面談',
    requiresCategory: true,
    categories: ['work_environment', 'interpersonal', 'workload_balance', 'health_safety']
  },
  { 
    id: 'individual_consultation', 
    name: '個別相談面談',
    requiresCategory: true,
    categories: ['performance', 'compensation', 'training', 'compliance', 'other']
  }
];
```

## 2. カテゴリマスタ

### カテゴリ定義（13種類）
```javascript
const interviewCategories = {
  // キャリア系面談用
  career_path: 'キャリアパス（将来の目標）',
  skill_development: 'スキル開発（研修・資格）',
  promotion: '昇進・昇格',
  transfer: '異動・転勤',
  
  // 職場環境系面談用
  work_environment: '職場環境（設備・制度）',
  interpersonal: '人間関係（チームワーク）',
  workload_balance: '業務負荷・ワークライフバランス',
  health_safety: '健康・安全',
  
  // 個別相談面談用
  performance: 'パフォーマンス（業務改善）',
  compensation: '給与・待遇',
  training: '研修・教育',
  compliance: 'コンプライアンス',
  other: 'その他'
};
```

## 3. 予約フォームの改修

### 3.1 フロー変更
```
旧フロー：
1. 面談種類選択（11種類から）
2. 希望日時選択
3. 相談内容入力

新フロー：
1. 面談分類選択（定期/特別/サポート）
2. 面談種類選択（該当分類内から）
3. カテゴリ選択（サポート面談の場合のみ、フィードバック面談を除く）
4. 希望日時選択
5. 相談内容入力
```

### 3.2 UIの変更点
1. **Step 1: 面談分類選択**
   - 3つのカードで表示（定期面談、特別面談、サポート面談）
   - 各分類の説明を表示

2. **Step 2: 面談種類選択**
   - 選択した分類に応じて種類を表示
   - 実施頻度や対象者を明記

3. **Step 3: カテゴリ選択**（条件付き表示）
   - サポート面談でフィードバック面談以外を選択した場合のみ表示
   - カテゴリをカード形式で表示
   - アイコンと説明付き

### 3.3 バリデーション
```javascript
function validateBooking(data) {
  // 必須チェック
  if (!data.interviewType) {
    return { error: '面談種類を選択してください' };
  }
  
  // カテゴリ必須チェック
  const requiresCategory = ['career_support', 'workplace_support', 'individual_consultation'];
  if (requiresCategory.includes(data.interviewType) && !data.interviewCategory) {
    return { error: '相談カテゴリを選択してください' };
  }
  
  return { success: true };
}
```

## 4. API連携仕様

### 4.1 予約データ送信形式
```typescript
interface InterviewBookingRequest {
  // 必須項目
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  facility: string;
  department: string;
  position: string;
  
  // 面談情報
  interviewType: InterviewType;  // 10種類のいずれか
  interviewCategory?: InterviewCategory;  // サポート面談の場合
  
  // 予約情報
  preferredDate: string;  // ISO 8601形式
  preferredTimeSlot: string;  // '13:40-14:20' など
  
  // 相談内容
  requestedTopics: string[];
  description?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
}
```

### 4.2 レスポンス形式
```typescript
interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message: string;
  suggestedAlternatives?: TimeSlot[];  // 希望時間が取れない場合
}
```

## 5. データ移行

### 5.1 既存データのマッピング
```javascript
const dataMapping = {
  // 旧種類 → 新種類
  'career_development': 'career_support',
  'stress_care': 'workplace_support',
  'grievance': 'workplace_support',
  'performance_review': 'feedback',
  'ad_hoc': 'individual_consultation'
};
```

### 5.2 移行スクリプト
既存の予約データを新体系に移行する際は、上記マッピングを使用してください。

## 6. テスト項目

### 6.1 機能テスト
- [ ] 定期面談の予約（カテゴリ選択なし）
- [ ] 特別面談の予約（カテゴリ選択なし）
- [ ] フィードバック面談の予約（カテゴリ選択なし）
- [ ] キャリア系面談の予約（カテゴリ選択あり）
- [ ] 職場環境系面談の予約（カテゴリ選択あり）
- [ ] 個別相談面談の予約（カテゴリ選択あり）

### 6.2 バリデーションテスト
- [ ] カテゴリ未選択時のエラー表示
- [ ] 必須項目未入力時のエラー表示
- [ ] API通信エラー時の処理

### 6.3 連携テスト
- [ ] 医療職員管理システムへのデータ送信
- [ ] レスポンスの正常受信
- [ ] エラーハンドリング

## 7. 実装スケジュール

### Phase 1：設計・準備（1週間）
- UI/UXデザインの作成
- APIインターフェース定義
- テスト環境の準備

### Phase 2：実装（2週間）
- フロントエンド改修
- バックエンド改修
- 単体テスト実施

### Phase 3：連携テスト（1週間）
- 医療職員管理システムとの結合テスト
- バグ修正
- 性能テスト

### Phase 4：リリース（3日）
- 本番環境へのデプロイ
- データ移行
- 動作確認

## 8. 注意事項

1. **後方互換性**
   - 既存の予約データは新体系にマッピングして保持
   - 過去の面談履歴は閲覧可能な状態を維持

2. **権限管理**
   - 面談種類によって予約可能な職員を制限
   - 管理職面談は管理職のみ予約可能

3. **通知設定**
   - カテゴリに応じて適切な面談担当者に通知
   - リマインダーメールのテンプレート更新

4. **レポート機能**
   - 新体系に基づいた統計レポートの生成
   - カテゴリ別の分析機能追加

## 9. 問い合わせ先

本改修に関する質問は、医療職員管理システム開発チームまでお問い合わせください。

---

以上