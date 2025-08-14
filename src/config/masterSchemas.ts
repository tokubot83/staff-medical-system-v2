import { MasterSchema } from '@/types/masterData';

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
        key: 'department', 
        label: '部署', 
        type: 'select', 
        required: true,
        options: [
          { value: 'medical', label: '医療部' },
          { value: 'nursing', label: '看護部' },
          { value: 'rehabilitation', label: 'リハビリテーション部' },
          { value: 'administration', label: '事務部' },
          { value: 'pharmacy', label: '薬剤部' },
          { value: 'nutrition', label: '栄養部' },
        ]
      },
      { 
        key: 'position', 
        label: '職位', 
        type: 'select',
        options: [
          { value: 'director', label: '部長' },
          { value: 'manager', label: '課長' },
          { value: 'chief', label: '主任' },
          { value: 'staff', label: 'スタッフ' },
        ]
      },
      { key: 'hireDate', label: '入職日', type: 'date' },
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
    searchableFields: ['employeeNumber', 'name', 'nameKana', 'email'],
    sortableFields: ['employeeNumber', 'name', 'department', 'hireDate'],
    exportFields: ['employeeNumber', 'name', 'nameKana', 'email', 'department', 'position', 'hireDate', 'employmentType'],
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
};