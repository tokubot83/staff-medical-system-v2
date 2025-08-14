/**
 * データバリデーション機能
 * インポート時のデータ検証ルールを定義
 */

export type ValidationResult = boolean | string;

/**
 * 基本バリデーション関数
 */
export const validators = {
  // 必須チェック
  required: (value: any): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return '必須項目です';
    }
    return true;
  },

  // 文字列長チェック
  maxLength: (max: number) => (value: string): ValidationResult => {
    if (typeof value !== 'string') return true;
    if (value.length > max) {
      return `${max}文字以下で入力してください`;
    }
    return true;
  },

  minLength: (min: number) => (value: string): ValidationResult => {
    if (typeof value !== 'string') return true;
    if (value.length < min) {
      return `${min}文字以上で入力してください`;
    }
    return true;
  },

  // メールアドレス形式
  email: (value: string): ValidationResult => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '正しいメールアドレス形式で入力してください';
    }
    return true;
  },

  // 電話番号形式（日本）
  phone: (value: string): ValidationResult => {
    if (!value) return true;
    const phoneRegex = /^[\d\-\(\)\+\s]{10,15}$/;
    if (!phoneRegex.test(value)) {
      return '正しい電話番号形式で入力してください';
    }
    return true;
  },

  // 郵便番号形式（日本）
  zipCode: (value: string): ValidationResult => {
    if (!value) return true;
    const zipRegex = /^\d{3}-?\d{4}$/;
    if (!zipRegex.test(value)) {
      return '正しい郵便番号形式（例：123-4567）で入力してください';
    }
    return true;
  },

  // 数値チェック
  numeric: (value: any): ValidationResult => {
    if (value === '' || value === null || value === undefined) return true;
    if (isNaN(Number(value))) {
      return '数値で入力してください';
    }
    return true;
  },

  // 整数チェック
  integer: (value: any): ValidationResult => {
    if (value === '' || value === null || value === undefined) return true;
    if (!Number.isInteger(Number(value))) {
      return '整数で入力してください';
    }
    return true;
  },

  // 数値範囲チェック
  range: (min: number, max: number) => (value: any): ValidationResult => {
    if (value === '' || value === null || value === undefined) return true;
    const num = Number(value);
    if (isNaN(num)) return '数値で入力してください';
    if (num < min || num > max) {
      return `${min}から${max}の範囲で入力してください`;
    }
    return true;
  },

  // 日付形式チェック
  date: (value: string): ValidationResult => {
    if (!value) return true;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '正しい日付形式で入力してください';
    }
    return true;
  },

  // 選択肢チェック
  oneOf: (options: string[]) => (value: string): ValidationResult => {
    if (!value) return true;
    if (!options.includes(value)) {
      return `次のいずれかを選択してください: ${options.join(', ')}`;
    }
    return true;
  },

  // 正規表現チェック
  pattern: (regex: RegExp, message: string) => (value: string): ValidationResult => {
    if (!value) return true;
    if (!regex.test(value)) {
      return message;
    }
    return true;
  }
};

/**
 * マスターデータ用バリデーター
 */
export const masterDataValidators = {
  // 職員マスター
  staff: {
    職員コード: validators.required,
    氏名: validators.required,
    カナ氏名: validators.maxLength(100),
    メールアドレス: validators.email,
    電話番号: validators.phone,
    郵便番号: validators.zipCode,
    住所: validators.maxLength(200),
    入職日: validators.date,
    部署: validators.required,
    職位: validators.required,
    雇用形態: validators.oneOf(['正職員', '契約職員', 'パート', 'アルバイト']),
    給与: validators.numeric,
    年齢: (value: any): ValidationResult => {
      const ageValidator = validators.range(18, 100);
      return ageValidator(value);
    }
  },

  // 施設マスター
  facility: {
    施設コード: validators.required,
    施設名: validators.required,
    施設種別: validators.oneOf(['特養', '老健', 'デイサービス', '訪問介護', 'その他']),
    郵便番号: validators.zipCode,
    住所: validators.maxLength(200),
    電話番号: validators.phone,
    FAX番号: validators.phone,
    メールアドレス: validators.email,
    定員: validators.integer,
    開設年月日: validators.date
  },

  // 研修マスター
  training: {
    研修コード: validators.required,
    研修名: validators.required,
    研修種別: validators.oneOf(['新人研修', '継続研修', '管理者研修', '専門研修']),
    実施日: validators.date,
    時間数: validators.numeric,
    講師名: validators.maxLength(100),
    会場: validators.maxLength(100),
    定員: validators.integer,
    受講料: validators.numeric
  },

  // 評価項目マスター
  evaluationItem: {
    評価項目コード: validators.required,
    評価項目名: validators.required,
    評価カテゴリー: validators.required,
    配点: validators.numeric,
    評価基準: validators.maxLength(500),
    対象職種: validators.required,
    使用開始日: validators.date,
    使用終了日: validators.date
  }
};

/**
 * 複合バリデーション（複数フィールド間の整合性チェック）
 */
export const complexValidators = {
  // 日付範囲チェック
  dateRange: (startField: string, endField: string) => (row: any): ValidationResult => {
    const startDate = new Date(row[startField]);
    const endDate = new Date(row[endField]);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return true; // 個別の日付バリデーションに委ねる
    }
    
    if (startDate > endDate) {
      return `${startField}は${endField}より前の日付を入力してください`;
    }
    
    return true;
  },

  // 重複チェック（コード等）
  unique: (field: string, existingData: any[]) => (row: any): ValidationResult => {
    const value = row[field];
    if (!value) return true;
    
    const duplicates = existingData.filter(item => item[field] === value);
    if (duplicates.length > 0) {
      return `${field}「${value}」は既に登録されています`;
    }
    
    return true;
  }
};

/**
 * バリデーション実行
 */
export const validateData = <T = any>(
  data: T[],
  validatorConfig: Record<string, (value: any) => ValidationResult>,
  complexValidatorConfig: ((row: T) => ValidationResult)[] = []
): {
  validData: T[];
  errors: Array<{ row: number; field: string; message: string; data: T }>;
} => {
  const validData: T[] = [];
  const errors: Array<{ row: number; field: string; message: string; data: T }> = [];

  data.forEach((row, index) => {
    let hasError = false;
    
    // 基本バリデーション
    Object.keys(validatorConfig).forEach(field => {
      const validator = validatorConfig[field];
      const value = (row as any)[field];
      const result = validator(value);
      
      if (result !== true) {
        hasError = true;
        errors.push({
          row: index + 1,
          field,
          message: typeof result === 'string' ? result : `${field}の値が不正です`,
          data: row
        });
      }
    });

    // 複合バリデーション
    complexValidatorConfig.forEach(validator => {
      const result = validator(row);
      if (result !== true) {
        hasError = true;
        errors.push({
          row: index + 1,
          field: '複合チェック',
          message: typeof result === 'string' ? result : '複合バリデーションエラー',
          data: row
        });
      }
    });

    if (!hasError) {
      validData.push(row);
    }
  });

  return { validData, errors };
};

/**
 * フィールドマッピング定義
 */
export const fieldMappings = {
  staff: {
    '職員番号': '職員コード',
    '名前': '氏名',
    'フリガナ': 'カナ氏名',
    'Email': 'メールアドレス',
    'TEL': '電話番号',
    '〒': '郵便番号',
    '部署名': '部署',
    '役職': '職位',
    '入社日': '入職日'
  },
  
  facility: {
    'コード': '施設コード',
    '名称': '施設名',
    'タイプ': '施設種別',
    'Tel': '電話番号'
  },
  
  training: {
    'コード': '研修コード',
    '名称': '研修名',
    'タイプ': '研修種別',
    '日時': '実施日'
  }
};