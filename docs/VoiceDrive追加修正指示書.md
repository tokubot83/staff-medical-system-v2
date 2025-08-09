# VoiceDrive追加修正指示書

## 概要
VoiceDrive側の実装確認結果を踏まえ、医療職員管理システムとの完全な統合に向けた追加修正事項をまとめました。

**作成日：2024年12月**

## 1. 優先度：高 - 必須修正項目

### 1.1 面談種別の名称統一

以下の名称変更を全ファイルに適用してください：

```typescript
// 旧名称 → 新名称のマッピング
const renameMapping = {
  // サポート面談の名称変更
  'performance_review': 'feedback',           // フィードバック面談
  'career_development': 'career_support',     // キャリア系面談
  'stress_care': 'workplace_support',         // 職場環境系面談
  'ad_hoc': 'individual_consultation',        // 個別相談面談
  'grievance': 'workplace_support'            // 苦情・相談は職場環境系に統合
};
```

### 1.2 カテゴリ選択の条件付き表示

**InterviewBookingCalendar.tsx** の修正：

```typescript
// カテゴリ選択が不要な面談種別
const categoriesNotRequired = [
  // 定期面談
  'new_employee_monthly',
  'regular_annual',
  'management_biannual',
  // 特別面談
  'return_to_work',
  'incident_followup',
  'exit_interview',
  // フィードバック面談（サポート面談だがカテゴリ不要）
  'feedback'
];

// カテゴリ選択の表示制御
const shouldShowCategorySelection = (interviewType: string): boolean => {
  return !categoriesNotRequired.includes(interviewType);
};

// UIでの条件付き表示
{shouldShowCategorySelection(selectedInterviewType) && (
  <div className="category-selection">
    {/* カテゴリ選択UI */}
  </div>
)}
```

## 2. 優先度：中 - 推奨修正項目

### 2.1 段階的選択フローの実装

現在の直接選択方式から、以下の3段階フローへの変更を推奨：

```typescript
// Step 1: 面談分類の選択
interface InterviewClassification {
  id: 'regular' | 'special' | 'support';
  name: string;
  description: string;
  types: InterviewType[];
}

const classifications: InterviewClassification[] = [
  {
    id: 'regular',
    name: '定期面談',
    description: '定期的に実施が必要な面談',
    types: ['new_employee_monthly', 'regular_annual', 'management_biannual']
  },
  {
    id: 'special',
    name: '特別面談',
    description: '特定の状況で実施する面談',
    types: ['return_to_work', 'incident_followup', 'exit_interview']
  },
  {
    id: 'support',
    name: 'サポート面談',
    description: '職員の希望に応じて実施する支援面談',
    types: ['feedback', 'career_support', 'workplace_support', 'individual_consultation']
  }
];
```

### 2.2 UIフローの改善案

```tsx
const InterviewBookingFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      {step === 1 && (
        <ClassificationSelector 
          onSelect={(classification) => {
            setSelectedClassification(classification);
            setStep(2);
          }}
        />
      )}
      
      {step === 2 && (
        <TypeSelector 
          classification={selectedClassification}
          onSelect={(type) => {
            setSelectedType(type);
            // カテゴリ選択が必要な場合はStep 3へ、不要な場合はStep 4へ
            if (shouldShowCategorySelection(type)) {
              setStep(3);
            } else {
              setStep(4);
            }
          }}
        />
      )}
      
      {step === 3 && (
        <CategorySelector 
          interviewType={selectedType}
          onSelect={(category) => {
            setSelectedCategory(category);
            setStep(4);
          }}
        />
      )}
      
      {step === 4 && (
        <DateTimeSelector 
          // 既存の日時選択UI
        />
      )}
    </div>
  );
};
```

## 3. 優先度：低 - 将来的な改善項目

### 3.1 API連携用インターフェースの追加

**interview.ts** に以下を追加：

```typescript
// 医療職員管理システムとの連携用
export interface MedicalSystemBookingRequest {
  // 職員情報
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeePhone?: string;
  facility: string;       // 追加
  department: string;     // 追加
  position: string;       // 追加
  
  // 面談情報
  interviewType: InterviewType;
  interviewCategory?: InterviewCategory;
  
  // 予約情報
  bookingDate: string;    // ISO 8601形式
  startTime: string;      // HH:mm形式
  endTime: string;        // HH:mm形式
  
  // 相談内容
  requestedTopics: string[];
  description?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  
  // メタデータ
  createdAt: string;
  createdBy: string;
}

// 既存のBookingRequestからMedicalSystemBookingRequestへの変換関数
export const toMedicalSystemRequest = (
  booking: BookingRequest,
  additionalInfo: {
    facility: string;
    department: string;
    position: string;
  }
): MedicalSystemBookingRequest => {
  return {
    ...booking,
    ...additionalInfo,
    bookingDate: booking.date,
    startTime: booking.timeSlot.split('-')[0],
    endTime: booking.timeSlot.split('-')[1],
    urgencyLevel: booking.urgencyLevel || 'medium',
    createdAt: new Date().toISOString(),
    createdBy: 'voicedrive'
  };
};
```

## 4. テスト確認項目

### 4.1 名称変更後の動作確認
- [ ] 全ての面談種別が正しく表示される
- [ ] 旧名称のデータが正しく移行される
- [ ] 予約作成・編集・削除が正常に動作する

### 4.2 カテゴリ選択の条件付き表示
- [ ] 定期面談でカテゴリ選択が表示されない
- [ ] 特別面談でカテゴリ選択が表示されない
- [ ] フィードバック面談でカテゴリ選択が表示されない
- [ ] その他のサポート面談でカテゴリ選択が表示される

### 4.3 データ連携
- [ ] 予約データが正しい形式で生成される
- [ ] 必須項目が全て含まれている
- [ ] 日時形式が正しい（ISO 8601）

## 5. 実装順序の推奨

1. **第1段階（必須）**
   - 面談種別の名称統一
   - カテゴリ選択の条件付き表示

2. **第2段階（推奨）**
   - 段階的選択フローの実装
   - UIの改善

3. **第3段階（将来）**
   - API連携用インターフェースの実装
   - 医療職員管理システムとの本格連携

## 6. 注意事項

### データ移行
- 既存の予約データの面談種別を新名称にマッピング
- `grievance`（苦情・相談）は`workplace_support`に統合

### 後方互換性
- 旧名称でのAPIアクセスも一定期間サポート
- 移行期間中は両方の名称を受け付ける

### パフォーマンス
- カテゴリ選択の条件判定はクライアント側でキャッシュ
- 不要な再レンダリングを避ける

## 7. 質問・確認事項

以下の点について確認をお願いします：

1. **段階的選択フロー**の実装は必須ですか、それとも推奨ですか？
2. **既存データの移行**は自動で行いますか、手動ですか？
3. **API連携のテスト環境**はいつ頃準備可能ですか？

---

以上が追加修正事項です。
優先度「高」の項目から順に実装をお願いします。

医療職員管理システムチーム