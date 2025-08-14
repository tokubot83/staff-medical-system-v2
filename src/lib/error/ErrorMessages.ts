/**
 * Error Messages
 * ユーザー向けのエラーメッセージ定義
 */

/**
 * エラーメッセージマップ
 * エラーコードとユーザー向けメッセージの対応
 */
export const ERROR_MESSAGES: Record<string, {
  title: string;
  message: string;
  hint?: string;
}> = {
  // ==================== ネットワーク関連 ====================
  'ERR_NETWORK': {
    title: 'ネットワークエラー',
    message: 'インターネット接続に問題があります。',
    hint: '接続を確認してから再度お試しください。'
  },
  'ERR_TIMEOUT': {
    title: 'タイムアウト',
    message: '処理に時間がかかりすぎています。',
    hint: 'しばらく待ってから再度お試しください。'
  },
  'ERR_OFFLINE': {
    title: 'オフライン',
    message: 'インターネットに接続されていません。',
    hint: 'ネットワーク接続を確認してください。'
  },

  // ==================== 認証・認可 ====================
  'ERR_AUTH': {
    title: '認証エラー',
    message: 'ログインが必要です。',
    hint: 'ログイン画面からログインしてください。'
  },
  'ERR_SESSION_EXPIRED': {
    title: 'セッション期限切れ',
    message: 'セッションの有効期限が切れました。',
    hint: '再度ログインしてください。'
  },
  'ERR_PERMISSION': {
    title: '権限エラー',
    message: 'この操作を実行する権限がありません。',
    hint: '必要な権限については管理者にお問い合わせください。'
  },
  'ERR_INVALID_CREDENTIALS': {
    title: 'ログイン失敗',
    message: 'メールアドレスまたはパスワードが正しくありません。',
    hint: '入力内容を確認してください。'
  },

  // ==================== データ関連 ====================
  'ERR_NOT_FOUND': {
    title: 'データが見つかりません',
    message: '要求されたデータが見つかりませんでした。',
    hint: 'URLを確認するか、一覧画面から選択してください。'
  },
  'ERR_VALIDATION': {
    title: '入力エラー',
    message: '入力内容に誤りがあります。',
    hint: 'エラーメッセージを確認して修正してください。'
  },
  'ERR_DUPLICATE': {
    title: '重複エラー',
    message: '既に同じデータが登録されています。',
    hint: '別の値を入力してください。'
  },
  'ERR_CONFLICT': {
    title: 'データ競合',
    message: '他のユーザーによってデータが変更されています。',
    hint: 'ページを再読み込みして最新のデータを取得してください。'
  },
  'ERR_DATA_INTEGRITY': {
    title: 'データ整合性エラー',
    message: 'データの整合性に問題があります。',
    hint: '管理者にお問い合わせください。'
  },

  // ==================== ストレージ関連 ====================
  'ERR_STORAGE': {
    title: 'ストレージエラー',
    message: 'データの保存に失敗しました。',
    hint: 'ブラウザのストレージ容量を確認してください。'
  },
  'ERR_QUOTA_EXCEEDED': {
    title: '容量超過',
    message: 'ストレージの容量が不足しています。',
    hint: '不要なデータを削除してから再度お試しください。'
  },

  // ==================== ファイル関連 ====================
  'ERR_FILE_TOO_LARGE': {
    title: 'ファイルサイズエラー',
    message: 'ファイルサイズが大きすぎます。',
    hint: '5MB以下のファイルを選択してください。'
  },
  'ERR_INVALID_FILE_TYPE': {
    title: 'ファイル形式エラー',
    message: 'サポートされていないファイル形式です。',
    hint: '対応形式: JPG, PNG, PDF'
  },
  'ERR_FILE_UPLOAD': {
    title: 'アップロードエラー',
    message: 'ファイルのアップロードに失敗しました。',
    hint: 'ファイルを確認してから再度お試しください。'
  },

  // ==================== システムエラー ====================
  'ERR_SYSTEM': {
    title: 'システムエラー',
    message: 'システムエラーが発生しました。',
    hint: 'しばらく待ってから再度お試しください。問題が続く場合は管理者にお問い合わせください。'
  },
  'ERR_BOUNDARY': {
    title: 'アプリケーションエラー',
    message: 'アプリケーションで予期しないエラーが発生しました。',
    hint: 'ページを再読み込みしてください。'
  },
  'ERR_UNKNOWN': {
    title: 'エラー',
    message: '予期しないエラーが発生しました。',
    hint: 'ページを再読み込みするか、しばらく待ってから再度お試しください。'
  },

  // ==================== API関連 ====================
  'ERR_API_400': {
    title: 'リクエストエラー',
    message: '入力内容に誤りがあります。',
    hint: '入力内容を確認してください。'
  },
  'ERR_API_401': {
    title: '認証エラー',
    message: 'ログインが必要です。',
    hint: 'ログイン画面からログインしてください。'
  },
  'ERR_API_403': {
    title: 'アクセス拒否',
    message: 'このリソースへのアクセス権限がありません。',
    hint: '権限については管理者にお問い合わせください。'
  },
  'ERR_API_404': {
    title: 'Not Found',
    message: '要求されたリソースが見つかりません。',
    hint: 'URLを確認してください。'
  },
  'ERR_API_409': {
    title: 'データ競合',
    message: 'データの競合が発生しました。',
    hint: '最新のデータを取得してから再度お試しください。'
  },
  'ERR_API_429': {
    title: 'リクエスト制限',
    message: 'リクエストが多すぎます。',
    hint: 'しばらく待ってから再度お試しください。'
  },
  'ERR_API_500': {
    title: 'サーバーエラー',
    message: 'サーバーでエラーが発生しました。',
    hint: 'しばらく待ってから再度お試しください。'
  },
  'ERR_API_502': {
    title: 'Bad Gateway',
    message: 'サーバーが一時的に利用できません。',
    hint: 'しばらく待ってから再度お試しください。'
  },
  'ERR_API_503': {
    title: 'メンテナンス中',
    message: 'サービスは現在メンテナンス中です。',
    hint: 'メンテナンス終了までお待ちください。'
  }
};

/**
 * フィールド別バリデーションメッセージ
 */
export const FIELD_VALIDATION_MESSAGES: Record<string, Record<string, string>> = {
  // 共通フィールド
  required: {
    default: 'この項目は必須です',
    name: '名前を入力してください',
    email: 'メールアドレスを入力してください',
    password: 'パスワードを入力してください',
    date: '日付を選択してください',
    file: 'ファイルを選択してください'
  },
  
  // メールアドレス
  email: {
    invalid: '有効なメールアドレスを入力してください',
    duplicate: 'このメールアドレスは既に登録されています'
  },
  
  // パスワード
  password: {
    min_length: 'パスワードは8文字以上で入力してください',
    max_length: 'パスワードは128文字以内で入力してください',
    weak: 'パスワードが弱すぎます。英数字と記号を組み合わせてください',
    mismatch: 'パスワードが一致しません'
  },
  
  // 名前
  name: {
    min_length: '名前は2文字以上で入力してください',
    max_length: '名前は50文字以内で入力してください',
    invalid_chars: '使用できない文字が含まれています'
  },
  
  // 電話番号
  phone: {
    invalid: '有効な電話番号を入力してください',
    format: '電話番号の形式が正しくありません（例: 03-1234-5678）'
  },
  
  // 日付
  date: {
    invalid: '有効な日付を入力してください',
    past: '過去の日付は選択できません',
    future: '未来の日付は選択できません',
    range: '指定された期間内の日付を選択してください'
  },
  
  // 数値
  number: {
    invalid: '数値を入力してください',
    min: '${min}以上の値を入力してください',
    max: '${max}以下の値を入力してください',
    integer: '整数を入力してください',
    positive: '正の数を入力してください'
  },
  
  // ファイル
  file: {
    size: 'ファイルサイズは${maxSize}以下にしてください',
    type: '対応していないファイル形式です',
    count: 'ファイルは${maxCount}個まで選択できます'
  }
};

/**
 * エラーメッセージを取得
 */
export function getErrorMessage(code: string): {
  title: string;
  message: string;
  hint?: string;
} {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES['ERR_UNKNOWN'];
}

/**
 * フィールドバリデーションメッセージを取得
 */
export function getFieldValidationMessage(
  rule: string,
  field?: string,
  params?: Record<string, any>
): string {
  const messages = FIELD_VALIDATION_MESSAGES[rule];
  if (!messages) {
    return 'エラーが発生しました';
  }
  
  let message = messages[field || 'default'] || messages['default'] || 'エラーが発生しました';
  
  // パラメータを置換
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`\${${key}}`, String(value));
    });
  }
  
  return message;
}

/**
 * HTTPステータスコードからメッセージを取得
 */
export function getHttpErrorMessage(statusCode: number): {
  title: string;
  message: string;
  hint?: string;
} {
  const code = `ERR_API_${statusCode}`;
  return ERROR_MESSAGES[code] || {
    title: 'エラー',
    message: `エラーが発生しました（ステータスコード: ${statusCode}）`,
    hint: 'しばらく待ってから再度お試しください。'
  };
}