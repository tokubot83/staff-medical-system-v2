/**
 * マスターデータ バージョン管理・変更履歴システム
 *
 * 機能:
 * - マスターデータの変更履歴記録
 * - バージョン管理（タイムスタンプベース）
 * - 変更内容の差分表示
 * - ロールバック機能（将来対応）
 */

export interface ChangeRecord {
  id: string;
  masterType: string;
  recordId: string;
  recordName: string;
  changeType: 'create' | 'update' | 'delete' | 'restore';
  changedBy: string;
  changedAt: Date;
  beforeData: any | null;
  afterData: any | null;
  changes: FieldChange[];
  reason?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
}

export interface FieldChange {
  field: string;
  fieldLabel: string;
  oldValue: any;
  newValue: any;
  changeType: 'added' | 'modified' | 'removed';
}

export interface VersionHistory {
  recordId: string;
  recordName: string;
  masterType: string;
  versions: ChangeRecord[];
  currentVersion: ChangeRecord;
  totalChanges: number;
}

/**
 * 変更履歴の記録
 */
export function recordChange(
  masterType: string,
  recordId: string,
  recordName: string,
  changeType: 'create' | 'update' | 'delete' | 'restore',
  beforeData: any | null,
  afterData: any | null,
  changedBy: string,
  reason?: string
): ChangeRecord {
  const changeId = `CHG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const changes = changeType === 'update' ? detectFieldChanges(beforeData, afterData) : [];

  const record: ChangeRecord = {
    id: changeId,
    masterType,
    recordId,
    recordName,
    changeType,
    changedBy,
    changedAt: new Date(),
    beforeData,
    afterData,
    changes,
    reason,
    approvalStatus: undefined,
    approvedBy: undefined,
    approvedAt: undefined
  };

  // LocalStorageに保存
  saveChangeRecord(record);

  return record;
}

/**
 * フィールド変更の検出
 */
export function detectFieldChanges(beforeData: any, afterData: any): FieldChange[] {
  const changes: FieldChange[] = [];
  const allKeys = new Set([
    ...Object.keys(beforeData || {}),
    ...Object.keys(afterData || {})
  ]);

  allKeys.forEach(key => {
    const oldValue = beforeData?.[key];
    const newValue = afterData?.[key];

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      let changeType: 'added' | 'modified' | 'removed';

      if (oldValue === undefined || oldValue === null) {
        changeType = 'added';
      } else if (newValue === undefined || newValue === null) {
        changeType = 'removed';
      } else {
        changeType = 'modified';
      }

      changes.push({
        field: key,
        fieldLabel: formatFieldLabel(key),
        oldValue,
        newValue,
        changeType
      });
    }
  });

  return changes;
}

/**
 * 変更履歴の取得
 */
export function getChangeHistory(
  masterType: string,
  recordId: string
): VersionHistory | null {
  const allChanges = loadAllChangeRecords();

  const recordChanges = allChanges
    .filter(c => c.masterType === masterType && c.recordId === recordId)
    .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());

  if (recordChanges.length === 0) {
    return null;
  }

  return {
    recordId,
    recordName: recordChanges[0].recordName,
    masterType,
    versions: recordChanges,
    currentVersion: recordChanges[0],
    totalChanges: recordChanges.length
  };
}

/**
 * マスタータイプ別の変更履歴一覧取得
 */
export function getChangeHistoryByMasterType(
  masterType: string,
  options?: {
    limit?: number;
    offset?: number;
    changedBy?: string;
    changeType?: 'create' | 'update' | 'delete' | 'restore';
    startDate?: Date;
    endDate?: Date;
  }
): { data: ChangeRecord[]; total: number } {
  let changes = loadAllChangeRecords()
    .filter(c => c.masterType === masterType);

  // フィルタリング
  if (options?.changedBy) {
    changes = changes.filter(c => c.changedBy === options.changedBy);
  }
  if (options?.changeType) {
    changes = changes.filter(c => c.changeType === options.changeType);
  }
  if (options?.startDate) {
    changes = changes.filter(c => new Date(c.changedAt) >= options.startDate!);
  }
  if (options?.endDate) {
    changes = changes.filter(c => new Date(c.changedAt) <= options.endDate!);
  }

  // ソート（新しい順）
  changes.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());

  const total = changes.length;
  const offset = options?.offset || 0;
  const limit = options?.limit || 50;
  const data = changes.slice(offset, offset + limit);

  return { data, total };
}

/**
 * 全マスターの変更履歴取得
 */
export function getAllChangeHistory(
  options?: {
    limit?: number;
    offset?: number;
    masterType?: string;
    changedBy?: string;
    changeType?: 'create' | 'update' | 'delete' | 'restore';
    startDate?: Date;
    endDate?: Date;
  }
): { data: ChangeRecord[]; total: number } {
  let changes = loadAllChangeRecords();

  // フィルタリング
  if (options?.masterType) {
    changes = changes.filter(c => c.masterType === options.masterType);
  }
  if (options?.changedBy) {
    changes = changes.filter(c => c.changedBy === options.changedBy);
  }
  if (options?.changeType) {
    changes = changes.filter(c => c.changeType === options.changeType);
  }
  if (options?.startDate) {
    changes = changes.filter(c => new Date(c.changedAt) >= options.startDate!);
  }
  if (options?.endDate) {
    changes = changes.filter(c => new Date(c.changedAt) <= options.endDate!);
  }

  // ソート（新しい順）
  changes.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());

  const total = changes.length;
  const offset = options?.offset || 0;
  const limit = options?.limit || 50;
  const data = changes.slice(offset, offset + limit);

  return { data, total };
}

/**
 * 変更内容の差分テキスト生成
 */
export function formatChangeDiff(record: ChangeRecord): string {
  if (record.changeType === 'create') {
    return `新規作成: ${record.recordName}`;
  }

  if (record.changeType === 'delete') {
    return `削除: ${record.recordName}`;
  }

  if (record.changeType === 'restore') {
    return `復元: ${record.recordName}`;
  }

  // update
  if (record.changes.length === 0) {
    return '変更なし';
  }

  const diffLines = record.changes.map(change => {
    const { fieldLabel, oldValue, newValue, changeType } = change;

    if (changeType === 'added') {
      return `  + ${fieldLabel}: ${formatValue(newValue)}`;
    }
    if (changeType === 'removed') {
      return `  - ${fieldLabel}: ${formatValue(oldValue)}`;
    }
    // modified
    return `  ~ ${fieldLabel}: ${formatValue(oldValue)} → ${formatValue(newValue)}`;
  });

  return diffLines.join('\n');
}

/**
 * 変更内容のHTML形式差分生成
 */
export function formatChangeDiffHTML(record: ChangeRecord): string {
  if (record.changeType === 'create') {
    return `<div class="change-create">新規作成: <strong>${record.recordName}</strong></div>`;
  }

  if (record.changeType === 'delete') {
    return `<div class="change-delete">削除: <strong>${record.recordName}</strong></div>`;
  }

  if (record.changeType === 'restore') {
    return `<div class="change-restore">復元: <strong>${record.recordName}</strong></div>`;
  }

  // update
  if (record.changes.length === 0) {
    return '<div class="change-none">変更なし</div>';
  }

  const diffItems = record.changes.map(change => {
    const { fieldLabel, oldValue, newValue, changeType } = change;

    if (changeType === 'added') {
      return `<li class="change-added"><span class="icon">+</span> <strong>${fieldLabel}</strong>: ${formatValue(newValue)}</li>`;
    }
    if (changeType === 'removed') {
      return `<li class="change-removed"><span class="icon">-</span> <strong>${fieldLabel}</strong>: ${formatValue(oldValue)}</li>`;
    }
    // modified
    return `<li class="change-modified"><span class="icon">~</span> <strong>${fieldLabel}</strong>: <span class="old-value">${formatValue(oldValue)}</span> → <span class="new-value">${formatValue(newValue)}</span></li>`;
  });

  return `<ul class="change-diff">${diffItems.join('')}</ul>`;
}

/**
 * バージョン比較
 */
export function compareVersions(
  version1: ChangeRecord,
  version2: ChangeRecord
): FieldChange[] {
  const data1 = version1.afterData || version1.beforeData;
  const data2 = version2.afterData || version2.beforeData;

  return detectFieldChanges(data1, data2);
}

/**
 * 統計情報取得
 */
export function getChangeStatistics(
  masterType?: string,
  startDate?: Date,
  endDate?: Date
): {
  totalChanges: number;
  createCount: number;
  updateCount: number;
  deleteCount: number;
  restoreCount: number;
  topChangedRecords: Array<{ recordId: string; recordName: string; changeCount: number }>;
  topChangers: Array<{ userId: string; changeCount: number }>;
} {
  let changes = loadAllChangeRecords();

  if (masterType) {
    changes = changes.filter(c => c.masterType === masterType);
  }
  if (startDate) {
    changes = changes.filter(c => new Date(c.changedAt) >= startDate);
  }
  if (endDate) {
    changes = changes.filter(c => new Date(c.changedAt) <= endDate);
  }

  const totalChanges = changes.length;
  const createCount = changes.filter(c => c.changeType === 'create').length;
  const updateCount = changes.filter(c => c.changeType === 'update').length;
  const deleteCount = changes.filter(c => c.changeType === 'delete').length;
  const restoreCount = changes.filter(c => c.changeType === 'restore').length;

  // 最も変更が多いレコード
  const recordChangeCounts: Record<string, { recordId: string; recordName: string; count: number }> = {};
  changes.forEach(c => {
    const key = `${c.masterType}_${c.recordId}`;
    if (!recordChangeCounts[key]) {
      recordChangeCounts[key] = { recordId: c.recordId, recordName: c.recordName, count: 0 };
    }
    recordChangeCounts[key].count++;
  });

  const topChangedRecords = Object.values(recordChangeCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(r => ({ recordId: r.recordId, recordName: r.recordName, changeCount: r.count }));

  // 最も変更を行ったユーザー
  const userChangeCounts: Record<string, number> = {};
  changes.forEach(c => {
    userChangeCounts[c.changedBy] = (userChangeCounts[c.changedBy] || 0) + 1;
  });

  const topChangers = Object.entries(userChangeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([userId, count]) => ({ userId, changeCount: count }));

  return {
    totalChanges,
    createCount,
    updateCount,
    deleteCount,
    restoreCount,
    topChangedRecords,
    topChangers
  };
}

/**
 * LocalStorage操作
 */
function saveChangeRecord(record: ChangeRecord): void {
  const key = 'masterDataChangeHistory';
  const existing = loadAllChangeRecords();
  existing.push(record);

  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

function loadAllChangeRecords(): ChangeRecord[] {
  const key = 'masterDataChangeHistory';

  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse change history:', e);
        return [];
      }
    }
  }

  return [];
}

/**
 * ユーティリティ関数
 */
function formatFieldLabel(key: string): string {
  const labelMap: Record<string, string> = {
    id: 'ID',
    code: 'コード',
    name: '名称',
    facilityId: '施設ID',
    facilityName: '施設名',
    departmentId: '部署ID',
    departmentName: '部署名',
    professionId: '職種ID',
    professionName: '職種名',
    positionId: '役職ID',
    positionName: '役職名',
    employmentTypeId: '雇用形態ID',
    employmentTypeName: '雇用形態名',
    authorityLevel: '権限レベル',
    displayOrder: '表示順',
    isActive: '有効/無効',
    description: '説明',
    category: 'カテゴリー',
    parentDepartmentId: '上位部署ID',
    level: '階層レベル',
    isFullTime: '常勤区分',
    maxHoursPerWeek: '週最大勤務時間',
    requiresSocialInsurance: '社会保険加入要',
    allowsOvertime: '残業可否'
  };

  return labelMap[key] || key;
}

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '(なし)';
  }
  if (typeof value === 'boolean') {
    return value ? 'はい' : 'いいえ';
  }
  if (value instanceof Date) {
    return value.toLocaleString('ja-JP');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * 変更履歴のエクスポート（CSV形式）
 */
export function exportChangeHistoryCSV(
  changes: ChangeRecord[]
): string {
  const headers = [
    '変更ID',
    'マスタータイプ',
    'レコードID',
    'レコード名',
    '変更種別',
    '変更者',
    '変更日時',
    '変更内容',
    '理由',
    '承認状態'
  ];

  const rows = changes.map(c => [
    c.id,
    c.masterType,
    c.recordId,
    c.recordName,
    c.changeType,
    c.changedBy,
    new Date(c.changedAt).toLocaleString('ja-JP'),
    formatChangeDiff(c).replace(/\n/g, ' | '),
    c.reason || '',
    c.approvalStatus || ''
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csv;
}
