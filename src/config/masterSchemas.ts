import { MasterSchema, FieldDefinition } from '@/types/masterData';

export const masterSchemas: Record<string, MasterSchema> = {
  staff: {
    name: 'staff',
    label: '職員マスター',
    fields: [
      { key: 'id', label: '職員ID', type: 'string', required: true, readonly: true },
      { key: 'employeeNumber', label: '職員番号', type: 'string', required: true },
      { key: 'name', label: '氏名', type: 'string', required: true },
      { key: 'nameKana', label: 'フリガナ', type: 'string', required: false },
      { key: 'email', label: 'メールアドレス', type: 'string', required: false },
      {
        key: 'facility',
        label: '施設',
        type: 'select',
        required: true,
        options: [
          { value: '小原病院', label: '小原病院' },
          { value: '立神リハビリテーション温泉病院', label: '立神リハビリテーション温泉病院' },
          { value: '法人本部', label: '法人本部' },
        ]
      },
      {
        key: 'department',
        label: '部署',
        type: 'select',
        required: true,
        options: [
          { value: '看護部', label: '看護部' },
          { value: '医療部', label: '医療部' },
          { value: 'リハビリテーション部', label: 'リハビリテーション部' },
          { value: '事務部', label: '事務部' },
          { value: '薬剤部', label: '薬剤部' },
          { value: '栄養部', label: '栄養部' },
          { value: '人事部', label: '人事部' },
          { value: '戦略企画部', label: '戦略企画部' },
        ]
      },
      {
        key: 'profession',
        label: '職種',
        type: 'select',
        required: true,
        options: [
          { value: '看護師', label: '看護師' },
          { value: '准看護師', label: '准看護師' },
          { value: '医師', label: '医師' },
          { value: '薬剤師', label: '薬剤師' },
          { value: '理学療法士', label: '理学療法士' },
          { value: '作業療法士', label: '作業療法士' },
          { value: '管理栄養士', label: '管理栄養士' },
          { value: '事務職員', label: '事務職員' },
        ]
      },
      {
        key: 'position',
        label: '役職',
        type: 'select',
        options: [
          { value: '', label: 'なし' },
          { value: '副主任', label: '副主任' },
          { value: '主任', label: '主任' },
          { value: '副師長', label: '副師長' },
          { value: '副科長', label: '副科長' },
          { value: '副課長', label: '副課長' },
          { value: '師長', label: '師長' },
          { value: '科長', label: '科長' },
          { value: '課長', label: '課長' },
          { value: '室長', label: '室長' },
          { value: '副部長', label: '副部長' },
          { value: '部長', label: '部長' },
          { value: '医局長', label: '医局長' },
          { value: '事務長', label: '事務長' },
          { value: '副院長', label: '副院長' },
          { value: '院長', label: '院長' },
          { value: '施設長', label: '施設長' },
          { value: '人事部門員', label: '人事部門員' },
          { value: '人事各部門長', label: '人事各部門長' },
          { value: '戦略企画部門員', label: '戦略企画部門員' },
          { value: '戦略企画部門長', label: '戦略企画部門長' },
          { value: '理事長', label: '理事長' },
          { value: '法人事務局長', label: '法人事務局長' },
        ]
      },
      { key: 'hireDate', label: '入職日', type: 'date', required: true },
      { key: 'experienceYears', label: '経験年数', type: 'number', readonly: true },
      {
        key: 'canPerformLeaderDuty',
        label: 'リーダー業務可否',
        type: 'boolean',
        defaultValue: false,
        description: '看護師・准看護師のみ：日勤・夜勤リーダー業務が可能か'
      },
      {
        key: 'accountLevel',
        label: '権限レベル',
        type: 'number',
        readonly: true,
        description: 'VoiceDrive用 1-18段階の権限レベル（自動計算）'
      },
      {
        key: 'employmentType',
        label: '雇用形態',
        type: 'select',
        options: [
          { value: 'fulltime', label: '正社員' },
          { value: 'parttime', label: 'パート' },
          { value: 'contract', label: '契約社員' },
        ]
      },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['employeeNumber', 'name', 'nameKana', 'email', 'facility', 'department', 'profession'],
    sortableFields: ['employeeNumber', 'name', 'department', 'hireDate', 'accountLevel'],
    exportFields: ['employeeNumber', 'name', 'nameKana', 'email', 'facility', 'department', 'profession', 'position', 'hireDate', 'experienceYears', 'canPerformLeaderDuty', 'accountLevel', 'employmentType'],
  },
  
  facility: {
    name: 'facility',
    label: '施設マスター',
    fields: [
      { key: 'id', label: '施設ID', type: 'string', required: true, readonly: true },
      { key: 'code', label: '施設コード', type: 'string', required: true },
      { key: 'name', label: '施設名', type: 'string', required: true },
      { 
        key: 'type', 
        label: '施設種別', 
        type: 'select', 
        required: true,
        options: [
          { value: 'hospital', label: '病院' },
          { value: 'clinic', label: 'クリニック' },
          { value: 'nursingHome', label: '介護施設' },
          { value: 'daycare', label: 'デイケア' },
          { value: 'homecare', label: '訪問看護' },
        ]
      },
      { key: 'address', label: '住所', type: 'string' },
      { key: 'phone', label: '電話番号', type: 'string' },
      { key: 'fax', label: 'FAX番号', type: 'string' },
      { key: 'email', label: 'メールアドレス', type: 'string' },
      { key: 'manager', label: '責任者', type: 'string' },
      { key: 'capacity', label: '定員', type: 'number' },
      { key: 'openDate', label: '開設日', type: 'date' },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['code', 'name', 'address', 'manager'],
    sortableFields: ['code', 'name', 'type', 'openDate'],
    exportFields: ['code', 'name', 'type', 'address', 'phone', 'email', 'manager', 'capacity'],
  },
  
  training: {
    name: 'training',
    label: '研修マスター',
    fields: [
      { key: 'id', label: '研修ID', type: 'string', required: true, readonly: true },
      { key: 'code', label: '研修コード', type: 'string', required: true },
      { key: 'name', label: '研修名', type: 'string', required: true },
      { 
        key: 'category', 
        label: 'カテゴリー', 
        type: 'select', 
        required: true,
        options: [
          { value: 'mandatory', label: '法定研修' },
          { value: 'skill', label: 'スキル研修' },
          { value: 'management', label: 'マネジメント研修' },
          { value: 'safety', label: '安全研修' },
          { value: 'ethics', label: '倫理研修' },
        ]
      },
      { key: 'description', label: '研修内容', type: 'textarea' },
      { key: 'duration', label: '研修時間（時間）', type: 'number' },
      { 
        key: 'frequency', 
        label: '実施頻度', 
        type: 'select',
        options: [
          { value: 'once', label: '1回のみ' },
          { value: 'yearly', label: '年1回' },
          { value: 'halfyearly', label: '年2回' },
          { value: 'quarterly', label: '四半期' },
          { value: 'monthly', label: '月1回' },
        ]
      },
      { 
        key: 'targetAudience', 
        label: '対象者', 
        type: 'multiselect',
        options: [
          { value: 'all', label: '全職員' },
          { value: 'new', label: '新人' },
          { value: 'manager', label: '管理職' },
          { value: 'medical', label: '医療職' },
          { value: 'nursing', label: '看護職' },
        ]
      },
      { key: 'instructor', label: '講師', type: 'string' },
      { key: 'maxParticipants', label: '最大参加人数', type: 'number' },
      { key: 'isOnline', label: 'オンライン可', type: 'boolean', defaultValue: false },
      { key: 'isMandatory', label: '必須研修', type: 'boolean', defaultValue: false },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['code', 'name', 'description', 'instructor'],
    sortableFields: ['code', 'name', 'category', 'duration'],
    exportFields: ['code', 'name', 'category', 'description', 'duration', 'frequency', 'instructor', 'isMandatory'],
  },
  
  evaluationItem: {
    name: 'evaluationItem',
    label: '評価項目マスター',
    fields: [
      { key: 'id', label: '項目ID', type: 'string', required: true, readonly: true },
      { key: 'code', label: '項目コード', type: 'string', required: true },
      { key: 'name', label: '項目名', type: 'string', required: true },
      { 
        key: 'category', 
        label: 'カテゴリー', 
        type: 'select', 
        required: true,
        options: [
          { value: 'skill', label: '技術・スキル' },
          { value: 'knowledge', label: '知識' },
          { value: 'attitude', label: '態度・姿勢' },
          { value: 'communication', label: 'コミュニケーション' },
          { value: 'management', label: 'マネジメント' },
          { value: 'teamwork', label: 'チームワーク' },
        ]
      },
      { key: 'description', label: '評価基準', type: 'textarea' },
      { 
        key: 'evaluationType', 
        label: '評価タイプ', 
        type: 'select',
        options: [
          { value: 'score5', label: '5段階評価' },
          { value: 'score10', label: '10段階評価' },
          { value: 'yesno', label: 'はい/いいえ' },
          { value: 'text', label: '記述式' },
        ]
      },
      { key: 'weight', label: '重み', type: 'number', defaultValue: 1 },
      { 
        key: 'targetPosition', 
        label: '対象職位', 
        type: 'multiselect',
        options: [
          { value: 'all', label: '全職位' },
          { value: 'staff', label: 'スタッフ' },
          { value: 'chief', label: '主任' },
          { value: 'manager', label: '管理職' },
        ]
      },
      { key: 'displayOrder', label: '表示順', type: 'number' },
      { key: 'isRequired', label: '必須項目', type: 'boolean', defaultValue: false },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['code', 'name', 'description'],
    sortableFields: ['code', 'name', 'category', 'displayOrder'],
    exportFields: ['code', 'name', 'category', 'description', 'evaluationType', 'weight', 'isRequired'],
  },

  // 評価制度マスター
  evaluationSystem: {
    name: 'evaluationSystem',
    label: '評価制度マスター',
    fields: [
      { key: 'id', label: '制度ID', type: 'string', required: true, readonly: true },
      { key: 'systemName', label: '制度名', type: 'string', required: true },
      { key: 'version', label: 'バージョン', type: 'string', required: true },
      { key: 'effectiveFrom', label: '有効開始日', type: 'date', required: true },
      { key: 'effectiveTo', label: '有効終了日', type: 'date' },
      { key: 'totalScore', label: '総点', type: 'number', required: true, defaultValue: 100 },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['systemName', 'version'],
    sortableFields: ['systemName', 'version', 'effectiveFrom'],
    exportFields: ['systemName', 'version', 'effectiveFrom', 'effectiveTo', 'totalScore'],
  },

  scoreComponent: {
    name: 'scoreComponent',
    label: '評価配点構成',
    fields: [
      { key: 'id', label: '配点ID', type: 'string', required: true, readonly: true },
      { key: 'systemId', label: '制度ID', type: 'string', required: true },
      { key: 'categoryName', label: 'カテゴリ名', type: 'string', required: true },
      { key: 'score', label: '配点', type: 'number', required: true },
      {
        key: 'evaluationType',
        label: '評価方式',
        type: 'select',
        required: true,
        options: [
          { value: 'absolute', label: '絶対評価' },
          { value: 'relative', label: '相対評価' },
        ]
      },
      { key: 'description', label: '説明', type: 'textarea' },
    ],
    searchableFields: ['categoryName'],
    sortableFields: ['categoryName', 'score'],
    exportFields: ['systemId', 'categoryName', 'score', 'evaluationType'],
  },

  contributionItem: {
    name: 'contributionItem',
    label: '貢献度項目マスター',
    fields: [
      { key: 'id', label: '項目ID', type: 'string', required: true, readonly: true },
      { key: 'itemName', label: '項目名', type: 'string', required: true },
      {
        key: 'category',
        label: 'カテゴリ',
        type: 'select',
        required: true,
        options: [
          { value: 'facility', label: '施設貢献' },
          { value: 'corporate', label: '法人貢献' },
        ]
      },
      {
        key: 'period',
        label: '評価期',
        type: 'select',
        options: [
          { value: 'summer', label: '夏季' },
          { value: 'winter', label: '冬季' },
          { value: 'annual', label: '通年' },
        ]
      },
      { key: 'baseScore', label: '基本配点', type: 'number', required: true },
      { key: 'evaluationElements', label: '評価要素', type: 'textarea' },
      { key: 'applicablePositions', label: '対象職位', type: 'textarea' },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['itemName', 'category'],
    sortableFields: ['itemName', 'category', 'period', 'baseScore'],
    exportFields: ['itemName', 'category', 'period', 'baseScore', 'evaluationElements'],
  },

  gradeConversion: {
    name: 'gradeConversion',
    label: '評価グレード変換ルール',
    fields: [
      { key: 'id', label: 'ルールID', type: 'string', required: true, readonly: true },
      { key: 'ruleName', label: 'ルール名', type: 'string', required: true },
      { key: 'systemId', label: '制度ID', type: 'string', required: true },
      { key: 'grade', label: 'グレード', type: 'string', required: true },
      { key: 'minPercentile', label: '最小パーセンタイル', type: 'number', required: true },
      { key: 'maxPercentile', label: '最大パーセンタイル', type: 'number', required: true },
      { key: 'description', label: '説明', type: 'string' },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['ruleName', 'grade'],
    sortableFields: ['ruleName', 'grade', 'minPercentile'],
    exportFields: ['ruleName', 'grade', 'minPercentile', 'maxPercentile', 'description'],
  },

  matrixDefinition: {
    name: 'matrixDefinition',
    label: '評価マトリックス定義',
    fields: [
      { key: 'id', label: 'マトリックスID', type: 'string', required: true, readonly: true },
      { key: 'systemId', label: '制度ID', type: 'string', required: true },
      { key: 'facilityGrade', label: '施設内評価', type: 'string', required: true },
      { key: 'corporateGrade', label: '法人内評価', type: 'string', required: true },
      { key: 'finalGrade', label: '最終評価', type: 'string', required: true },
      { key: 'priority', label: '優先度', type: 'number', required: true },
      { key: 'description', label: '説明', type: 'textarea' },
    ],
    searchableFields: ['facilityGrade', 'corporateGrade', 'finalGrade'],
    sortableFields: ['priority', 'finalGrade'],
    exportFields: ['facilityGrade', 'corporateGrade', 'finalGrade', 'priority', 'description'],
  },

  periodAllocation: {
    name: 'periodAllocation',
    label: '期別配点設定',
    fields: [
      { key: 'id', label: '設定ID', type: 'string', required: true, readonly: true },
      { key: 'systemId', label: '制度ID', type: 'string', required: true },
      {
        key: 'allocationPattern',
        label: '配分パターン',
        type: 'select',
        required: true,
        options: [
          { value: 'equal', label: '均等型' },
          { value: 'yearend', label: '年度末重視型' },
          { value: 'quarterly', label: '四半期型' },
          { value: 'custom', label: 'カスタム' },
        ]
      },
      { key: 'periodName', label: '期名', type: 'string', required: true },
      { key: 'startMonth', label: '開始月', type: 'number', required: true },
      { key: 'endMonth', label: '終了月', type: 'number', required: true },
      { key: 'score', label: '配点', type: 'number', required: true },
      { key: 'facilityScore', label: '施設配点', type: 'number' },
      { key: 'corporateScore', label: '法人配点', type: 'number' },
    ],
    searchableFields: ['allocationPattern', 'periodName'],
    sortableFields: ['periodName', 'startMonth', 'score'],
    exportFields: ['allocationPattern', 'periodName', 'startMonth', 'endMonth', 'score'],
  },

  // 部署別カスタマイズ権限
  departmentPermission: {
    name: 'departmentPermission',
    label: '部署別カスタマイズ権限',
    fields: [
      { key: 'id', label: '権限ID', type: 'string', required: true, readonly: true },
      { key: 'departmentName', label: '部署名', type: 'string', required: true },
      { key: 'facilityName', label: '施設名', type: 'string' },
      {
        key: 'status',
        label: '状態',
        type: 'select',
        required: true,
        options: [
          { value: 'active', label: '有効' },
          { value: 'pending', label: '承認待ち' },
          { value: 'suspended', label: '停止中' },
        ]
      },
      { key: 'scoreAdjustmentAllowed', label: '配点調整許可', type: 'boolean', defaultValue: false },
      { key: 'scoreAdjustmentRange', label: '配点調整範囲(±)', type: 'number' },
      { key: 'itemAdditionAllowed', label: '項目追加許可', type: 'boolean', defaultValue: false },
      { key: 'maxAdditionalItems', label: '最大追加項目数', type: 'number' },
      { key: 'primaryManager', label: '主管理者', type: 'string', required: true },
      { key: 'secondaryManager', label: '副管理者', type: 'string' },
      { key: 'validFrom', label: '有効開始日', type: 'date', required: true },
      { key: 'validUntil', label: '有効終了日', type: 'date' },
    ],
    searchableFields: ['departmentName', 'facilityName', 'primaryManager'],
    sortableFields: ['departmentName', 'status', 'validFrom'],
    exportFields: ['departmentName', 'status', 'primaryManager', 'validFrom', 'validUntil'],
  },

  customizationRequest: {
    name: 'customizationRequest',
    label: 'カスタマイズ申請',
    fields: [
      { key: 'id', label: '申請ID', type: 'string', required: true, readonly: true },
      { key: 'departmentName', label: '申請部署', type: 'string', required: true },
      { key: 'requesterName', label: '申請者', type: 'string', required: true },
      { key: 'requestDate', label: '申請日', type: 'date', required: true },
      {
        key: 'requestType',
        label: '申請種別',
        type: 'select',
        required: true,
        options: [
          { value: 'score_adjustment', label: '配点調整' },
          { value: 'item_addition', label: '項目追加' },
          { value: 'threshold_change', label: '闾値変更' },
          { value: 'other', label: 'その他' },
        ]
      },
      { key: 'reason', label: '申請理由', type: 'textarea', required: true },
      { key: 'impact', label: '影響範囲', type: 'textarea' },
      {
        key: 'approvalStatus',
        label: '承認状態',
        type: 'select',
        required: true,
        options: [
          { value: 'pending', label: '承認待ち' },
          { value: 'approved', label: '承認済' },
          { value: 'rejected', label: '却下' },
          { value: 'revision_requested', label: '修正依頼' },
        ]
      },
      { key: 'approvalLevel', label: '承認段階', type: 'number' },
      { key: 'finalDecision', label: '最終決定', type: 'textarea' },
      { key: 'implementationDate', label: '実施日', type: 'date' },
    ],
    searchableFields: ['departmentName', 'requesterName', 'requestType'],
    sortableFields: ['requestDate', 'approvalStatus', 'requestType'],
    exportFields: ['departmentName', 'requesterName', 'requestDate', 'requestType', 'approvalStatus'],
  },

  // Phase 4: 退職理由マスター
  resignationReason: {
    name: 'resignationReason',
    label: '退職理由マスター',
    fields: [
      { key: 'reasonId', label: '理由ID', type: 'string', required: true, readonly: true },
      { key: 'reasonCode', label: '理由コード', type: 'string', required: true, description: 'personal, career_change等' },
      { key: 'reasonNameJa', label: '退職理由名（日本語）', type: 'string', required: true },
      { key: 'reasonNameEn', label: '退職理由名（英語）', type: 'string', required: false },
      {
        key: 'category',
        label: 'カテゴリー',
        type: 'select',
        required: true,
        options: [
          { value: 'voluntary', label: '自己都合' },
          { value: 'involuntary', label: '会社都合' },
          { value: 'neutral', label: '中立' },
        ]
      },
      {
        key: 'requiresExitInterview',
        label: '退職面談必須',
        type: 'boolean',
        defaultValue: true,
        description: 'この理由の場合に退職面談が必要か'
      },
      {
        key: 'requiresApproval',
        label: '承認必須',
        type: 'boolean',
        defaultValue: false,
        description: 'この理由の場合に上長承認が必要か'
      },
      { key: 'displayOrder', label: '表示順序', type: 'number', defaultValue: 0 },
      {
        key: 'isActive',
        label: '有効フラグ',
        type: 'boolean',
        defaultValue: true
      },
      { key: 'description', label: '説明', type: 'textarea', required: false },
    ],
    searchableFields: ['reasonCode', 'reasonNameJa', 'category'],
    sortableFields: ['displayOrder', 'reasonCode', 'category'],
    exportFields: ['reasonCode', 'reasonNameJa', 'category', 'requiresExitInterview', 'isActive'],
  },

  // Phase 1-1: 職種マスター
  profession: {
    name: 'profession',
    label: '職種マスター',
    fields: [
      { key: 'id', label: '職種ID', type: 'string', required: true, readonly: true },
      { key: 'code', label: '職種コード', type: 'string', required: true },
      { key: 'name', label: '職種名', type: 'string', required: true },
      {
        key: 'category',
        label: 'カテゴリー',
        type: 'select',
        required: true,
        options: [
          { value: 'medical', label: '医療職' },
          { value: 'nursing', label: '看護職' },
          { value: 'allied_health', label: '医療技術職' },
          { value: 'administrative', label: '事務職' },
          { value: 'support', label: '支援職' },
        ]
      },
      { key: 'requiresLicense', label: '資格要', type: 'boolean', defaultValue: false },
      { key: 'displayOrder', label: '表示順', type: 'number', defaultValue: 0 },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['code', 'name', 'category'],
    sortableFields: ['displayOrder', 'code', 'name'],
    exportFields: ['code', 'name', 'category', 'requiresLicense', 'isActive'],
  },

  // Phase 1-2: 役職マスター
  position: {
    name: 'position',
    label: '役職マスター',
    fields: [
      { key: 'id', label: '役職ID', type: 'string', required: true, readonly: true },
      { key: 'code', label: '役職コード', type: 'string', required: true },
      { key: 'name', label: '役職名', type: 'string', required: true },
      {
        key: 'level',
        label: '職位レベル',
        type: 'number',
        required: true,
        defaultValue: 1,
        description: '1-18の権限レベル（Phase 3施設別権限対応）'
      },
      {
        key: 'category',
        label: 'カテゴリー',
        type: 'select',
        required: true,
        options: [
          { value: 'staff', label: '一般職' },
          { value: 'nursing_middle', label: '看護中間管理職' },
          { value: 'nursing_senior', label: '看護上級管理職' },
          { value: 'medical', label: '医療職管理職' },
          { value: 'administrative', label: '事務管理職' },
          { value: 'executive', label: '経営層' },
        ]
      },
      {
        key: 'requiresManagementTraining',
        label: '管理職研修要',
        type: 'boolean',
        defaultValue: false
      },
      {
        key: 'canApproveLeave',
        label: '休暇承認権限',
        type: 'boolean',
        defaultValue: false,
        description: '部下の休暇申請を承認できるか'
      },
      {
        key: 'canPerformEvaluation',
        label: '人事評価権限',
        type: 'boolean',
        defaultValue: false,
        description: '部下の人事評価を実施できるか'
      },
      { key: 'displayOrder', label: '表示順', type: 'number', defaultValue: 0 },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['code', 'name', 'category'],
    sortableFields: ['level', 'displayOrder', 'code'],
    exportFields: ['code', 'name', 'level', 'category', 'requiresManagementTraining', 'isActive'],
  },

  // Phase 1-3: 雇用形態マスター
  employmentType: {
    name: 'employmentType',
    label: '雇用形態マスター',
    fields: [
      { key: 'id', label: '雇用形態ID', type: 'string', required: true, readonly: true },
      { key: 'code', label: '雇用形態コード', type: 'string', required: true },
      { key: 'name', label: '雇用形態名', type: 'string', required: true },
      {
        key: 'category',
        label: 'カテゴリー',
        type: 'select',
        required: true,
        options: [
          { value: 'full_time', label: '常勤' },
          { value: 'part_time', label: 'パート' },
          { value: 'contract', label: '契約' },
          { value: 'temporary', label: '臨時' },
          { value: 'other', label: 'その他' },
        ]
      },
      {
        key: 'isFullTime',
        label: '常勤区分',
        type: 'boolean',
        defaultValue: false,
        description: '常勤の場合true、非常勤の場合false'
      },
      {
        key: 'maxHoursPerWeek',
        label: '週最大勤務時間',
        type: 'number',
        required: false,
        description: '週の最大勤務時間（null=無制限）'
      },
      {
        key: 'requiresSocialInsurance',
        label: '社会保険加入要',
        type: 'boolean',
        defaultValue: false,
        description: '社会保険加入が必須の場合true'
      },
      {
        key: 'allowsOvertime',
        label: '残業可否',
        type: 'boolean',
        defaultValue: false,
        description: '残業が可能な場合true'
      },
      { key: 'description', label: '説明', type: 'textarea', required: false },
      { key: 'displayOrder', label: '表示順', type: 'number', defaultValue: 0 },
      { key: 'isActive', label: '有効', type: 'boolean', defaultValue: true },
    ],
    searchableFields: ['code', 'name', 'category'],
    sortableFields: ['displayOrder', 'code', 'name'],
    exportFields: ['code', 'name', 'category', 'isFullTime', 'requiresSocialInsurance', 'allowsOvertime', 'isActive'],
  },
};