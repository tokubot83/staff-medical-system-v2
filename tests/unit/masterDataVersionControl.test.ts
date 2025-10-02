/**
 * マスターデータ バージョン管理・変更履歴 テスト
 */

import {
  recordChange,
  detectFieldChanges,
  getChangeHistory,
  getChangeHistoryByMasterType,
  getAllChangeHistory,
  formatChangeDiff,
  formatChangeDiffHTML,
  compareVersions,
  getChangeStatistics,
  exportChangeHistoryCSV,
  ChangeRecord,
  FieldChange
} from '@/utils/masterDataVersionControl';

describe('マスターデータ バージョン管理・変更履歴', () => {
  beforeEach(() => {
    // LocalStorageのクリア
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('recordChange - 変更履歴の記録', () => {
    it('新規作成の記録', () => {
      const afterData = {
        id: 'FAC_001',
        code: 'OBARA',
        name: '小原病院',
        isActive: true
      };

      const record = recordChange(
        'facility',
        'FAC_001',
        '小原病院',
        'create',
        null,
        afterData,
        'admin-001',
        '新規施設登録'
      );

      expect(record.masterType).toBe('facility');
      expect(record.recordId).toBe('FAC_001');
      expect(record.changeType).toBe('create');
      expect(record.changedBy).toBe('admin-001');
      expect(record.afterData).toEqual(afterData);
      expect(record.beforeData).toBeNull();
      expect(record.reason).toBe('新規施設登録');
    });

    it('更新の記録と差分検出', () => {
      const beforeData = {
        id: 'FAC_001',
        code: 'OBARA',
        name: '小原病院',
        isActive: true
      };

      const afterData = {
        id: 'FAC_001',
        code: 'OBARA',
        name: '小原病院（更新）',
        isActive: false
      };

      const record = recordChange(
        'facility',
        'FAC_001',
        '小原病院',
        'update',
        beforeData,
        afterData,
        'admin-002',
        '名称変更と無効化'
      );

      expect(record.changeType).toBe('update');
      expect(record.changes.length).toBe(2);
      expect(record.changes.some(c => c.field === 'name')).toBe(true);
      expect(record.changes.some(c => c.field === 'isActive')).toBe(true);
    });

    it('削除の記録', () => {
      const beforeData = {
        id: 'FAC_001',
        code: 'OBARA',
        name: '小原病院'
      };

      const record = recordChange(
        'facility',
        'FAC_001',
        '小原病院',
        'delete',
        beforeData,
        null,
        'admin-003',
        '施設閉鎖'
      );

      expect(record.changeType).toBe('delete');
      expect(record.beforeData).toEqual(beforeData);
      expect(record.afterData).toBeNull();
    });
  });

  describe('detectFieldChanges - フィールド変更検出', () => {
    it('追加されたフィールド', () => {
      const before = { id: 'TEST_001', name: 'テスト' };
      const after = { id: 'TEST_001', name: 'テスト', description: '説明文' };

      const changes = detectFieldChanges(before, after);

      expect(changes.length).toBe(1);
      expect(changes[0].field).toBe('description');
      expect(changes[0].changeType).toBe('added');
      expect(changes[0].newValue).toBe('説明文');
    });

    it('削除されたフィールド', () => {
      const before = { id: 'TEST_001', name: 'テスト', description: '説明文' };
      const after = { id: 'TEST_001', name: 'テスト' };

      const changes = detectFieldChanges(before, after);

      expect(changes.length).toBe(1);
      expect(changes[0].field).toBe('description');
      expect(changes[0].changeType).toBe('removed');
      expect(changes[0].oldValue).toBe('説明文');
    });

    it('変更されたフィールド', () => {
      const before = { id: 'TEST_001', name: 'テスト', isActive: true };
      const after = { id: 'TEST_001', name: 'テスト更新', isActive: false };

      const changes = detectFieldChanges(before, after);

      expect(changes.length).toBe(2);
      expect(changes.some(c => c.field === 'name' && c.changeType === 'modified')).toBe(true);
      expect(changes.some(c => c.field === 'isActive' && c.changeType === 'modified')).toBe(true);
    });
  });

  describe('getChangeHistory - 変更履歴取得', () => {
    it('レコードの変更履歴を取得', () => {
      // 3つの変更を記録
      recordChange('facility', 'FAC_001', '小原病院', 'create', null, { name: '小原病院' }, 'admin-001');
      recordChange('facility', 'FAC_001', '小原病院', 'update', { name: '小原病院' }, { name: '小原病院（更新）' }, 'admin-002');
      recordChange('facility', 'FAC_001', '小原病院', 'delete', { name: '小原病院（更新）' }, null, 'admin-003');

      const history = getChangeHistory('facility', 'FAC_001');

      expect(history).not.toBeNull();
      expect(history!.totalChanges).toBe(3);
      expect(history!.versions.length).toBe(3);
      expect(history!.currentVersion.changeType).toBe('delete'); // 最新は削除
    });

    it('存在しないレコードの履歴', () => {
      const history = getChangeHistory('facility', 'FAC_999');
      expect(history).toBeNull();
    });
  });

  describe('getChangeHistoryByMasterType - マスタータイプ別履歴', () => {
    beforeEach(() => {
      recordChange('facility', 'FAC_001', '小原病院', 'create', null, { name: '小原病院' }, 'admin-001');
      recordChange('facility', 'FAC_002', '立神病院', 'create', null, { name: '立神病院' }, 'admin-002');
      recordChange('department', 'DEPT_001', '看護部', 'create', null, { name: '看護部' }, 'admin-001');
    });

    it('施設マスターの履歴のみ取得', () => {
      const result = getChangeHistoryByMasterType('facility');

      expect(result.total).toBe(2);
      expect(result.data.every(c => c.masterType === 'facility')).toBe(true);
    });

    it('変更者でフィルタリング', () => {
      const result = getChangeHistoryByMasterType('facility', { changedBy: 'admin-001' });

      expect(result.total).toBe(1);
      expect(result.data[0].changedBy).toBe('admin-001');
    });

    it('変更種別でフィルタリング', () => {
      recordChange('facility', 'FAC_001', '小原病院', 'update', { name: '小原病院' }, { name: '小原病院（更新）' }, 'admin-001');

      const result = getChangeHistoryByMasterType('facility', { changeType: 'update' });

      expect(result.total).toBe(1);
      expect(result.data[0].changeType).toBe('update');
    });
  });

  describe('formatChangeDiff - 差分テキスト生成', () => {
    it('新規作成の差分', () => {
      const record = recordChange('facility', 'FAC_001', '小原病院', 'create', null, { name: '小原病院' }, 'admin-001');
      const diff = formatChangeDiff(record);

      expect(diff).toBe('新規作成: 小原病院');
    });

    it('更新の差分', () => {
      const record = recordChange(
        'facility',
        'FAC_001',
        '小原病院',
        'update',
        { name: '小原病院', isActive: true },
        { name: '小原病院（更新）', isActive: false },
        'admin-001'
      );

      const diff = formatChangeDiff(record);

      expect(diff).toContain('名称:');
      expect(diff).toContain('→');
      expect(diff).toContain('有効/無効:');
    });
  });

  describe('compareVersions - バージョン比較', () => {
    it('2つのバージョンを比較', () => {
      const version1 = recordChange('facility', 'FAC_001', '小原病院', 'create', null, { name: '小原病院', isActive: true }, 'admin-001');
      const version2 = recordChange('facility', 'FAC_001', '小原病院', 'update', { name: '小原病院', isActive: true }, { name: '小原病院（更新）', isActive: false }, 'admin-002');

      const diff = compareVersions(version1, version2);

      expect(diff.length).toBe(2);
      expect(diff.some(d => d.field === 'name')).toBe(true);
      expect(diff.some(d => d.field === 'isActive')).toBe(true);
    });
  });

  describe('getChangeStatistics - 統計情報', () => {
    beforeEach(() => {
      recordChange('facility', 'FAC_001', '小原病院', 'create', null, { name: '小原病院' }, 'admin-001');
      recordChange('facility', 'FAC_001', '小原病院', 'update', { name: '小原病院' }, { name: '小原病院（更新）' }, 'admin-001');
      recordChange('facility', 'FAC_001', '小原病院', 'update', { name: '小原病院（更新）' }, { name: '小原病院（最終）' }, 'admin-002');
      recordChange('facility', 'FAC_002', '立神病院', 'create', null, { name: '立神病院' }, 'admin-002');
      recordChange('department', 'DEPT_001', '看護部', 'create', null, { name: '看護部' }, 'admin-003');
    });

    it('全体統計', () => {
      const stats = getChangeStatistics();

      expect(stats.totalChanges).toBe(5);
      expect(stats.createCount).toBe(3);
      expect(stats.updateCount).toBe(2);
    });

    it('施設マスターの統計', () => {
      const stats = getChangeStatistics('facility');

      expect(stats.totalChanges).toBe(4);
      expect(stats.createCount).toBe(2);
      expect(stats.updateCount).toBe(2);
    });

    it('最も変更が多いレコード', () => {
      const stats = getChangeStatistics('facility');

      expect(stats.topChangedRecords.length).toBeGreaterThan(0);
      expect(stats.topChangedRecords[0].recordId).toBe('FAC_001');
      expect(stats.topChangedRecords[0].changeCount).toBe(3);
    });

    it('最も変更を行ったユーザー', () => {
      const stats = getChangeStatistics();

      expect(stats.topChangers.length).toBeGreaterThan(0);
      expect(stats.topChangers.some(u => u.userId === 'admin-001')).toBe(true);
      expect(stats.topChangers.some(u => u.userId === 'admin-002')).toBe(true);
    });
  });

  describe('exportChangeHistoryCSV - CSV エクスポート', () => {
    it('変更履歴をCSV形式でエクスポート', () => {
      const record1 = recordChange('facility', 'FAC_001', '小原病院', 'create', null, { name: '小原病院' }, 'admin-001', '新規登録');
      const record2 = recordChange('facility', 'FAC_001', '小原病院', 'update', { name: '小原病院' }, { name: '小原病院（更新）' }, 'admin-002');

      const csv = exportChangeHistoryCSV([record1, record2]);

      expect(csv).toContain('変更ID,マスタータイプ,レコードID');
      expect(csv).toContain('facility');
      expect(csv).toContain('FAC_001');
      expect(csv).toContain('小原病院');
      expect(csv).toContain('admin-001');
    });
  });
});
