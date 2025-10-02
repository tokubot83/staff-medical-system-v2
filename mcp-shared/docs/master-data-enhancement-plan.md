# マスタデータ管理機能強化計画

**作成日**: 2025年1月13日
**対象システム**: 医療職員管理システム（10万行規模）
**作成者**: Claude Code
**レビュー**: システム管理者

---

## 📋 概要

医療職員管理システムのマスタデータ管理機能を段階的に強化し、ハードコードされたデータを動的なマスター管理に移行する。システムの拡張性・保守性を向上させ、コード変更なしでマスターデータの追加・変更が可能な体制を構築する。

## 🎯 目的

### 主要目的
1. **ハードコードの撤廃** - 施設・部署・職種等の選択肢をマスターデータ化
2. **データ整合性の向上** - 外部キー制約とリレーション管理の実装
3. **拡張性の確保** - 新施設・新部署追加時のコード変更を不要に
4. **運用効率の向上** - 管理画面からのマスターデータ管理を実現

### 副次的効果
- システム保守コストの削減
- 人的ミスの防止（タイポ、不整合データの混入）
- VoiceDriveチームとのデータ連携強化
- 監査証跡の完全化

---

## 📊 現状分析

### 発見された問題点

#### 1. ハードコードされたデータ（156箇所）
- **施設名**: `masterSchemas.ts` に直接記述
- **部署名**: 施設との紐付けなし
- **職種**: 24種類が固定配列
- **役職**: 23種類が固定配列
- **雇用形態**: 3種類が固定配列

#### 2. データリレーションの欠如
- 施設削除時の整合性チェックなし
- 部署と施設の親子関係が未定義
- 職員データの外部キー検証なし

#### 3. マスターデータのバージョン管理不足
- 評価制度・面談制度のみバージョン管理あり
- 職種・部署の変更履歴が追跡不可
- 組織改編時の影響範囲が不明

#### 4. インポート時のバリデーション不足
- 重複チェックが不十分
- 外部キー参照チェックなし
- エラー時の詳細情報不足

---

## 🚀 実装計画

### Phase 1: 基盤整備（最優先）

#### **Phase 1-1: 職種マスター独立化**

**目的**: 職種選択肢を動的なマスターデータとして管理

**実装内容**:
```typescript
// 新規マスタースキーマ定義
profession: {
  name: 'profession',
  label: '職種マスター',
  fields: [
    { key: 'id', label: '職種ID', type: 'string', required: true, readonly: true },
    { key: 'code', label: '職種コード', type: 'string', required: true },
    { key: 'name', label: '職種名', type: 'string', required: true },
    { key: 'category', label: 'カテゴリー', type: 'select', options: [
      { value: 'medical', label: '医療職' },
      { value: 'nursing', label: '看護職' },
      { value: 'allied_health', label: '医療技術職' },
      { value: 'administrative', label: '事務職' },
    ]},
    { key: 'requiresLicense', label: '資格要', type: 'boolean', defaultValue: false },
    { key: 'displayOrder', label: '表示順', type: 'number' },
    { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
  ],
  searchableFields: ['code', 'name', 'category'],
  sortableFields: ['displayOrder', 'code', 'name'],
  exportFields: ['code', 'name', 'category', 'requiresLicense', 'isActive'],
}
```

**変更ファイル**:
- `src/config/masterSchemas.ts` - スキーマ追加
- `src/app/admin/master-data/page.tsx` - UIタブ追加
- `src/services/masterDataService.ts` - CRUD処理追加

**シードデータ作成**:
```typescript
// src/data/seeds/professionSeeds.ts
export const professionSeeds = [
  { id: 'PROF_001', code: 'NS', name: '看護師', category: 'nursing', requiresLicense: true },
  { id: 'PROF_002', code: 'ANS', name: '准看護師', category: 'nursing', requiresLicense: true },
  { id: 'PROF_003', code: 'DR', name: '医師', category: 'medical', requiresLicense: true },
  // ... 既存24種類を移行
];
```

**完了条件**:
- [ ] 職種マスターのCRUD操作が正常動作
- [ ] CSV/JSONインポートが成功
- [ ] 職員マスターの職種選択肢が職種マスターから動的取得
- [ ] シードデータ24種類が正常登録
- [ ] エクスポート機能が正常動作
- [ ] 既存の職員データが正しく表示される

**テストケース**:
1. 新規職種の登録（例: "診療放射線技師"）
2. 職種の編集（表示順変更）
3. 職種の無効化（新規選択不可、既存データは保持）
4. CSVインポート（一括登録）
5. 職員登録時に新職種が選択肢に表示されることを確認

**リスク**:
- 既存職員データとの整合性保持が重要
- 職種コードの一意性確保が必須
- 無効化した職種の既存データ表示ロジック確認

---

#### **Phase 1-2: 役職マスター独立化**

**目的**: 役職選択肢を動的なマスターデータとして管理

**実装内容**:
```typescript
// 新規マスタースキーマ定義
position: {
  name: 'position',
  label: '役職マスター',
  fields: [
    { key: 'id', label: '役職ID', type: 'string', required: true, readonly: true },
    { key: 'code', label: '役職コード', type: 'string', required: true },
    { key: 'name', label: '役職名', type: 'string', required: true },
    { key: 'level', label: '職位レベル', type: 'number', required: true, description: '1-18の権限レベル' },
    { key: 'category', label: 'カテゴリー', type: 'select', options: [
      { value: 'nursing', label: '看護職' },
      { value: 'medical', label: '医療職' },
      { value: 'administrative', label: '事務職' },
      { value: 'executive', label: '経営層' },
    ]},
    { key: 'requiresManagementTraining', label: '管理職研修要', type: 'boolean', defaultValue: false },
    { key: 'displayOrder', label: '表示順', type: 'number' },
    { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
  ],
  searchableFields: ['code', 'name', 'category'],
  sortableFields: ['level', 'displayOrder', 'code'],
  exportFields: ['code', 'name', 'level', 'category', 'isActive'],
}
```

**シードデータ作成**:
```typescript
// src/data/seeds/positionSeeds.ts
export const positionSeeds = [
  { id: 'POS_001', code: 'STAFF', name: 'なし', level: 1, category: 'nursing' },
  { id: 'POS_002', code: 'ASST_CHIEF', name: '副主任', level: 7, category: 'nursing' },
  { id: 'POS_003', code: 'CHIEF', name: '主任', level: 8, category: 'nursing' },
  // ... 既存23種類を移行（Phase 3の権限レベルに対応）
];
```

**完了条件**:
- [ ] 役職マスターのCRUD操作が正常動作
- [ ] 権限レベル（1-18）が正しく設定される
- [ ] 職員マスターの役職選択肢が役職マスターから動的取得
- [ ] シードデータ23種類が正常登録
- [ ] Phase 3の施設別権限レベルと整合性確認

**テストケース**:
1. 新規役職の登録（例: "統括主任" レベル7）
2. 役職の編集（権限レベル変更）
3. カテゴリー別フィルタリング
4. 職員登録時に職種に応じた役職が選択可能

**リスク**:
- Phase 3の権限レベルマッピングとの整合性
- 立神病院の統括主任（レベル7）の正確な反映
- 権限レベル変更時の影響範囲確認

---

#### **Phase 1-3: 雇用形態マスター独立化**

**目的**: 雇用形態選択肢を動的なマスターデータとして管理

**実装内容**:
```typescript
// 新規マスタースキーマ定義
employmentType: {
  name: 'employmentType',
  label: '雇用形態マスター',
  fields: [
    { key: 'id', label: '雇用形態ID', type: 'string', required: true, readonly: true },
    { key: 'code', label: '雇用形態コード', type: 'string', required: true },
    { key: 'name', label: '雇用形態名', type: 'string', required: true },
    { key: 'isFullTime', label: '常勤', type: 'boolean', defaultValue: false },
    { key: 'hasBonus', label: '賞与対象', type: 'boolean', defaultValue: false },
    { key: 'hasSocialInsurance', label: '社会保険対象', type: 'boolean', defaultValue: false },
    { key: 'maxWorkingHours', label: '最大勤務時間/週', type: 'number' },
    { key: 'displayOrder', label: '表示順', type: 'number' },
    { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
  ],
  searchableFields: ['code', 'name'],
  sortableFields: ['displayOrder', 'code'],
  exportFields: ['code', 'name', 'isFullTime', 'hasBonus', 'isActive'],
}
```

**シードデータ作成**:
```typescript
// src/data/seeds/employmentTypeSeeds.ts
export const employmentTypeSeeds = [
  { id: 'EMP_001', code: 'fulltime', name: '正社員', isFullTime: true, hasBonus: true, hasSocialInsurance: true, maxWorkingHours: 40 },
  { id: 'EMP_002', code: 'parttime', name: 'パート', isFullTime: false, hasBonus: false, hasSocialInsurance: false, maxWorkingHours: 20 },
  { id: 'EMP_003', code: 'contract', name: '契約社員', isFullTime: true, hasBonus: true, hasSocialInsurance: true, maxWorkingHours: 40 },
];
```

**完了条件**:
- [ ] 雇用形態マスターのCRUD操作が正常動作
- [ ] 常勤/非常勤フラグが正しく設定
- [ ] 職員マスターの雇用形態選択肢が動的取得
- [ ] 勤務時間制限が正しく反映

**テストケース**:
1. 新規雇用形態の登録（例: "嘱託職員"）
2. 雇用形態の属性変更（賞与対象フラグ）
3. 職員登録時の選択肢確認
4. 給与計算システムとの連携確認（将来対応）

---

#### **Phase 1-4: 部署マスター独立化（重要）**

**目的**: 部署を施設に紐付け、階層構造を持つマスターとして管理

**実装内容**:
```typescript
// 新規マスタースキーマ定義
department: {
  name: 'department',
  label: '部署マスター',
  fields: [
    { key: 'id', label: '部署ID', type: 'string', required: true, readonly: true },
    { key: 'code', label: '部署コード', type: 'string', required: true },
    { key: 'name', label: '部署名', type: 'string', required: true },
    { key: 'facilityId', label: '所属施設', type: 'select', required: true, description: '施設マスターから取得' },
    { key: 'parentDepartmentId', label: '上位部署', type: 'select', description: '階層構造用' },
    { key: 'category', label: 'カテゴリー', type: 'select', options: [
      { value: 'medical', label: '診療部門' },
      { value: 'nursing', label: '看護部門' },
      { value: 'rehabilitation', label: 'リハビリ部門' },
      { value: 'administrative', label: '管理部門' },
      { value: 'support', label: '支援部門' },
    ]},
    { key: 'headCount', label: '定員', type: 'number' },
    { key: 'manager', label: '部署長', type: 'string' },
    { key: 'displayOrder', label: '表示順', type: 'number' },
    { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
  ],
  searchableFields: ['code', 'name', 'manager'],
  sortableFields: ['facilityId', 'displayOrder', 'code'],
  exportFields: ['code', 'name', 'facilityId', 'category', 'manager', 'isActive'],
}
```

**シードデータ作成**:
```typescript
// src/data/seeds/departmentSeeds.ts
export const departmentSeeds = [
  // 小原病院
  { id: 'DEPT_001', code: 'OH_NURS', name: '看護部', facilityId: 'FAC_001', category: 'nursing' },
  { id: 'DEPT_002', code: 'OH_MED', name: '医療部', facilityId: 'FAC_001', category: 'medical' },
  { id: 'DEPT_003', code: 'OH_REHAB', name: 'リハビリテーション部', facilityId: 'FAC_001', category: 'rehabilitation' },

  // 立神リハビリテーション温泉病院
  { id: 'DEPT_011', code: 'TR_NURS', name: '看護部', facilityId: 'FAC_002', category: 'nursing' },
  { id: 'DEPT_012', code: 'TR_REHAB', name: 'リハビリテーション部', facilityId: 'FAC_002', category: 'rehabilitation' },

  // ... 既存全部署を移行
];
```

**職員マスター修正**:
```typescript
// src/config/masterSchemas.ts - staff マスター修正
{
  key: 'departmentId',
  label: '部署',
  type: 'select',
  required: true,
  description: '所属施設に応じた部署を選択',
  // 動的に施設フィルタリングされた部署リストを取得
}
```

**完了条件**:
- [ ] 部署マスターのCRUD操作が正常動作
- [ ] 施設と部署のリレーションが正しく動作
- [ ] 職員登録時、選択施設に応じた部署のみ表示
- [ ] 階層構造（上位部署）が正しく表示
- [ ] 既存500名の職員データが正しく表示
- [ ] 施設削除時に部署の存在チェックが動作

**テストケース**:
1. 新規部署の登録（施設選択必須）
2. 職員登録時の施設→部署の連動
3. 施設「小原病院」削除時の警告表示（部署3件存在）
4. 階層構造の表示（例: 看護部 > 3階病棟）
5. 部署異動の一括処理

**リスク**:
- **最重要**: 既存500名の職員データのdepartment文字列→departmentId移行
- 施設と部署の整合性維持
- 削除時のカスケード処理の慎重な実装

**移行スクリプト作成**:
```typescript
// src/scripts/migrateDepartmentData.ts
// 既存のdepartment文字列をdepartmentIdに変換
export async function migrateDepartmentReferences() {
  // 1. 全職員データ取得
  // 2. department文字列からdepartmentIdを検索
  // 3. departmentIdに更新
  // 4. バックアップ作成
}
```

---

#### **Phase 1-5: インポート時の外部キー検証実装**

**目的**: データインポート時の整合性を保証

**実装内容**:
```typescript
// src/services/masterDataService.ts - バリデーション強化

interface ImportValidationResult {
  isValid: boolean;
  errors: ImportError[];
  warnings: ImportWarning[];
}

interface ImportError {
  row: number;
  field: string;
  value: any;
  message: string;
  type: 'duplicate' | 'foreign_key' | 'required' | 'format';
}

// 外部キー検証
async function validateForeignKeys(data: any[], masterType: string): Promise<ImportError[]> {
  const errors: ImportError[] = [];

  // 職員マスターインポート時
  if (masterType === 'staff') {
    for (const [index, record] of data.entries()) {
      // 施設ID存在チェック
      const facilityExists = await checkFacilityExists(record.facilityId);
      if (!facilityExists) {
        errors.push({
          row: index + 2, // ヘッダー考慮
          field: 'facilityId',
          value: record.facilityId,
          message: `施設ID「${record.facilityId}」は施設マスターに存在しません`,
          type: 'foreign_key'
        });
      }

      // 部署ID存在チェック
      const departmentExists = await checkDepartmentExists(record.departmentId);
      if (!departmentExists) {
        errors.push({
          row: index + 2,
          field: 'departmentId',
          value: record.departmentId,
          message: `部署ID「${record.departmentId}」は部署マスターに存在しません`,
          type: 'foreign_key'
        });
      }

      // 施設-部署の整合性チェック
      const departmentBelongsToFacility = await checkDepartmentFacilityMatch(
        record.facilityId,
        record.departmentId
      );
      if (!departmentBelongsToFacility) {
        errors.push({
          row: index + 2,
          field: 'departmentId',
          value: record.departmentId,
          message: `部署「${record.departmentId}」は施設「${record.facilityId}」に所属していません`,
          type: 'foreign_key'
        });
      }
    }
  }

  return errors;
}

// 重複チェック強化
async function validateDuplicates(data: any[], masterType: string): Promise<ImportError[]> {
  const errors: ImportError[] = [];
  const uniqueFields = getUniqueFields(masterType); // 例: ['employeeNumber', 'email']

  for (const field of uniqueFields) {
    const existingValues = await getExistingValues(masterType, field);
    const importValues = new Set();

    for (const [index, record] of data.entries()) {
      const value = record[field];

      // DB重複チェック
      if (existingValues.includes(value)) {
        errors.push({
          row: index + 2,
          field,
          value,
          message: `${field}「${value}」は既に登録されています`,
          type: 'duplicate'
        });
      }

      // インポートデータ内重複チェック
      if (importValues.has(value)) {
        errors.push({
          row: index + 2,
          field,
          value,
          message: `${field}「${value}」がインポートデータ内で重複しています`,
          type: 'duplicate'
        });
      }

      importValues.add(value);
    }
  }

  return errors;
}
```

**UI改善**:
```typescript
// GenericMasterTable.tsx - エラー表示強化
{importResult && importResult.errors && importResult.errors.length > 0 && (
  <div className="mt-4">
    <h4 className="font-medium text-red-800 mb-2">エラー詳細 ({importResult.errors.length}件)</h4>
    <div className="max-h-60 overflow-y-auto border rounded p-3 bg-red-50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1">行</th>
            <th className="text-left py-1">項目</th>
            <th className="text-left py-1">値</th>
            <th className="text-left py-1">エラー内容</th>
          </tr>
        </thead>
        <tbody>
          {importResult.errors.map((error, index) => (
            <tr key={index} className="border-b">
              <td className="py-1">{error.row}</td>
              <td className="py-1">{error.field}</td>
              <td className="py-1 font-mono">{error.value}</td>
              <td className="py-1 text-red-700">{error.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
```

**完了条件**:
- [ ] 外部キー検証が正常動作
- [ ] 重複チェックが正常動作
- [ ] エラー詳細が見やすく表示
- [ ] インポート前にバリデーション実行
- [ ] エラーがある場合はインポート中止

**テストケース**:
1. 存在しない施設IDを含むCSVをインポート → エラー表示
2. 重複する職員番号を含むCSVをインポート → エラー表示
3. 施設と部署が不整合なCSVをインポート → エラー表示
4. CSV内で職員番号が重複 → エラー表示
5. 正常なCSVをインポート → 成功

---

### Phase 2: 機能強化（Phase 1完了後に実施）

#### **Phase 2-1: マスターデータ間のリレーション管理**
- 削除時の参照チェック機能
- カスケード削除/更新の選択UI
- 影響範囲の可視化

#### **Phase 2-2: マスターデータ変更時の影響範囲表示**
- 削除前の影響確認ダイアログ
- 関連データ件数の表示
- 影響範囲のドリルダウン

#### **Phase 2-3: 一括編集機能**
- 複数レコードの一括更新
- 条件指定一括変更
- 変更プレビュー機能

---

### Phase 3: 高度化（Phase 2完了後に実施）

#### **Phase 3-1: マスターデータのバージョン管理**
- 職種・部署の変更履歴記録
- 組織改編の履歴管理
- 過去データの参照機能

#### **Phase 3-2: 承認ワークフロー統合**
- 重要マスター変更時の承認フロー
- 多段階承認の設定
- 承認履歴の記録

#### **Phase 3-3: エクスポート機能拡張**
- Excel形式対応
- 複数マスターの一括エクスポート
- 関連データの結合エクスポート

---

## ✅ 各Phaseの完了条件

### Phase 1完了条件（全タスク完了時）
- [ ] 職種・役職・雇用形態・部署マスターが独立動作
- [ ] 職員マスターの選択肢が全て動的取得
- [ ] 既存500名の職員データが正常表示
- [ ] インポート時の外部キー検証が動作
- [ ] 重複チェックが正常動作
- [ ] 全マスターのCRUD操作が安定
- [ ] CSV/JSONエクスポート/インポートが正常動作

### Phase 2完了条件
- [ ] 削除時の影響範囲が表示される
- [ ] カスケード処理が選択可能
- [ ] 一括編集機能が正常動作

### Phase 3完了条件
- [ ] バージョン管理が実装
- [ ] 承認ワークフローが動作
- [ ] Excel形式のエクスポートが可能

---

## ⚠️ リスクと対策

### 最重要リスク

#### 1. 既存データの移行失敗（影響度：大）
**リスク**: 500名の職員データのdepartment文字列→ID変換時のデータ損失

**対策**:
- 移行前に必ず全データバックアップ
- 移行スクリプトのドライラン実行
- ロールバック手順の事前確認
- 段階的移行（10名→50名→全体）

#### 2. 外部キー制約の不整合（影響度：大）
**リスク**: 施設・部署削除時のデータ整合性崩壊

**対策**:
- 削除前の参照チェック必須化
- カスケード削除は管理者のみ許可
- 削除ではなく「無効化」の推奨

#### 3. パフォーマンス劣化（影響度：中）
**リスク**: 選択肢取得APIの多重呼び出しによる遅延

**対策**:
- マスターデータのキャッシング実装
- 選択肢の一括取得API
- ページング処理の最適化

#### 4. VoiceDriveとの連携不整合（影響度：中）
**リスク**: マスターデータ変更がVoiceDrive側に反映されない

**対策**:
- Webhook通知の確実な送信
- 変更ログの`mcp-shared/`への記録
- 同期状態の定期確認

---

## 📅 スケジュール（推奨）

### Phase 1: 1-2週間
- Phase 1-1（職種）: 1-2日
- Phase 1-2（役職）: 1-2日
- Phase 1-3（雇用形態）: 1日
- Phase 1-4（部署）: 2-3日（移行スクリプト含む）
- Phase 1-5（検証）: 1-2日

### Phase 2: 2-3週間
- Phase 2-1（リレーション）: 1週間
- Phase 2-2（影響範囲）: 1週間
- Phase 2-3（一括編集）: 1週間

### Phase 3: 1-2週間
- Phase 3-1（バージョン管理）: 1週間
- Phase 3-2（承認フロー）: 1週間
- Phase 3-3（エクスポート）: 3-5日

---

## 🔧 使用技術・ツール

### 既存技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React Icons

### 新規導入検討
- Zod（バリデーションスキーマ）
- React Query（マスターデータキャッシング）
- xlsx（Excel形式エクスポート）

---

## 📊 成功指標（KPI）

### 定量指標
- ハードコード箇所: 156 → 0
- マスターデータ種別: 6 → 10以上
- データインポート成功率: 70% → 95%以上
- 外部キーエラー検出率: 0% → 100%

### 定性指標
- コード変更なしでの施設・部署追加が可能
- 管理画面からの完全なマスターデータ管理
- データ整合性の完全保証
- VoiceDriveチームとのスムーズな連携

---

## 📝 注意事項

### システム規模に関する注意
- 本システムは**10万行規模**の大規模システム
- 変更は必ず段階的に実施
- 各タスク完了時に動作確認を徹底
- ロールバック手順を常に確認

### データ整合性に関する注意
- 医療システムのため、データ損失は絶対に避ける
- バックアップは二重化（ローカル＋リモート）
- 本番データでの試行前に必ずテスト環境で検証

### チーム連携に関する注意
- VoiceDriveチームへの事前通知
- `mcp-shared/docs/` での進捗共有
- 重要な変更は両チーム確認後に実施

---

## 🚀 次のステップ

1. **本計画書のレビュー**
   - システム管理者による承認
   - VoiceDriveチームとの共有

2. **Phase 1-1の開始**
   - 職種マスター独立化の実装
   - テスト実施
   - preview/feature-name → main へのマージ

3. **進捗記録の継続**
   - `master-data-enhancement-progress.md` の更新
   - 各タスク完了時のチェックリスト記録

---

**この計画に基づき、安全かつ確実にマスタデータ管理機能を強化します。**
