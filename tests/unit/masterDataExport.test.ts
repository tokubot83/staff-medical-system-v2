/**
 * マスターデータ エクスポート機能 テスト
 */

import {
  exportMasterData,
  exportAllMasterData,
  exportWithRelations,
  exportCustomFields,
  getExportStatistics,
  ExportOptions,
  ExportResult
} from '@/utils/masterDataExport';

describe('マスターデータ エクスポート機能', () => {
  describe('exportMasterData - 基本エクスポート', () => {
    it('CSV形式でエクスポート', () => {
      const options: ExportOptions = {
        format: 'csv',
        masterTypes: ['facility']
      };

      const result = exportMasterData(options);

      expect(result.success).toBe(true);
      expect(result.format).toBe('csv');
      expect(result.files.length).toBe(1);
      expect(result.files[0].masterType).toBe('facility');
      expect(result.files[0].filename).toContain('.csv');
      expect(result.files[0].content).toContain('施設ID');
    });

    it('JSON形式でエクスポート', () => {
      const options: ExportOptions = {
        format: 'json',
        masterTypes: ['profession']
      };

      const result = exportMasterData(options);

      expect(result.success).toBe(true);
      expect(result.format).toBe('json');
      expect(result.files[0].content).toContain('"masterType": "profession"');
      expect(result.files[0].content).toContain('"data":');
    });

    it('Excel形式でエクスポート', () => {
      const options: ExportOptions = {
        format: 'excel',
        masterTypes: ['position']
      };

      const result = exportMasterData(options);

      expect(result.success).toBe(true);
      expect(result.format).toBe('excel');
      expect(result.files[0].filename).toContain('.xlsx');
      expect(result.files[0].content).toContain('\uFEFF'); // BOM
    });

    it('複数マスター同時エクスポート', () => {
      const options: ExportOptions = {
        format: 'csv',
        masterTypes: ['facility', 'department', 'profession']
      };

      const result = exportMasterData(options);

      expect(result.files.length).toBe(3);
      expect(result.files.map(f => f.masterType)).toEqual(['facility', 'department', 'profession']);
    });

    it('非有効データを含むエクスポート', () => {
      const options: ExportOptions = {
        format: 'csv',
        masterTypes: ['facility'],
        includeInactive: true
      };

      const result = exportMasterData(options);

      expect(result.success).toBe(true);
      // 非有効データも含まれる
    });
  });

  describe('exportAllMasterData - 全マスター一括エクスポート', () => {
    it('全マスターをCSVエクスポート', () => {
      const result = exportAllMasterData('csv', false);

      expect(result.success).toBe(true);
      expect(result.files.length).toBe(5); // facility, department, profession, position, employmentType
      expect(result.totalRecords).toBeGreaterThan(0);
    });

    it('全マスターをJSONエクスポート', () => {
      const result = exportAllMasterData('json');

      expect(result.success).toBe(true);
      expect(result.files.every(f => f.content.includes('"masterType"'))).toBe(true);
    });
  });

  describe('exportWithRelations - 関連データ結合エクスポート', () => {
    it('部署マスターに施設名を結合', () => {
      const result = exportWithRelations('department', 'csv');

      expect(result.success).toBe(true);
      expect(result.files[0].content).toContain('所属施設名');
      expect(result.files[0].filename).toContain('with_relations');
    });

    it('役職マスターに施設名を結合', () => {
      const result = exportWithRelations('position', 'csv');

      expect(result.success).toBe(true);
      expect(result.files[0].content).toContain('facilityName');
    });
  });

  describe('exportCustomFields - カスタムフィールドエクスポート', () => {
    it('指定フィールドのみエクスポート', () => {
      const result = exportCustomFields('facility', ['id', 'code', 'name'], 'csv');

      expect(result.success).toBe(true);
      const headers = result.files[0].content.split('\n')[0];
      expect(headers).toContain('施設ID');
      expect(headers).toContain('施設コード');
      expect(headers).toContain('施設名');
      expect(headers).not.toContain('カテゴリー');
    });

    it('JSONでカスタムフィールドエクスポート', () => {
      const result = exportCustomFields('profession', ['id', 'name'], 'json');

      expect(result.success).toBe(true);
      const data = JSON.parse(result.files[0].content);
      expect(data.data[0]).toHaveProperty('id');
      expect(data.data[0]).toHaveProperty('name');
      expect(data.data[0]).not.toHaveProperty('category');
    });
  });

  describe('getExportStatistics - エクスポート統計', () => {
    it('全マスターの統計情報取得', () => {
      const stats = getExportStatistics();

      expect(stats.totalMasters).toBe(5);
      expect(stats.totalRecords).toBeGreaterThan(0);
      expect(stats.recordsByMaster).toHaveProperty('facility');
      expect(stats.recordsByMaster).toHaveProperty('department');
      expect(stats.recordsByMaster).toHaveProperty('profession');
      expect(stats.recordsByMaster).toHaveProperty('position');
      expect(stats.recordsByMaster).toHaveProperty('employmentType');
    });

    it('各マスターのレコード数', () => {
      const stats = getExportStatistics();

      expect(stats.recordsByMaster['facility']).toBeGreaterThan(0);
      expect(stats.recordsByMaster['profession']).toBeGreaterThan(0);
    });
  });

  describe('CSV形式検証', () => {
    it('CSVヘッダーが日本語ラベル', () => {
      const result = exportMasterData({
        format: 'csv',
        masterTypes: ['facility']
      });

      const lines = result.files[0].content.split('\n');
      const headers = lines[0];

      expect(headers).toContain('施設ID');
      expect(headers).toContain('施設コード');
      expect(headers).toContain('施設名');
    });

    it('Boolean値が日本語表記', () => {
      const result = exportMasterData({
        format: 'csv',
        masterTypes: ['facility']
      });

      const content = result.files[0].content;

      // isActive: true → "はい", false → "いいえ"
      expect(content).toMatch(/(はい|いいえ)/);
    });

    it('カンマを含む値がクォートされる', () => {
      const result = exportMasterData({
        format: 'csv',
        masterTypes: ['facility']
      });

      const content = result.files[0].content;

      // descriptionにカンマがある場合、クォートされる
      if (content.includes(',')) {
        expect(content).toMatch(/"[^"]*,[^"]*"/);
      }
    });
  });

  describe('JSON形式検証', () => {
    it('JSON構造が正しい', () => {
      const result = exportMasterData({
        format: 'json',
        masterTypes: ['facility']
      });

      const json = JSON.parse(result.files[0].content);

      expect(json).toHaveProperty('masterType', 'facility');
      expect(json).toHaveProperty('exportedAt');
      expect(json).toHaveProperty('count');
      expect(json).toHaveProperty('data');
      expect(Array.isArray(json.data)).toBe(true);
    });

    it('データが配列形式', () => {
      const result = exportMasterData({
        format: 'json',
        masterTypes: ['profession']
      });

      const json = JSON.parse(result.files[0].content);

      expect(json.data.length).toBeGreaterThan(0);
      expect(json.data[0]).toHaveProperty('id');
      expect(json.data[0]).toHaveProperty('name');
    });
  });

  describe('エクスポート結果検証', () => {
    it('exportedAtが設定される', () => {
      const result = exportMasterData({
        format: 'csv',
        masterTypes: ['facility']
      });

      expect(result.exportedAt).toBeInstanceOf(Date);
    });

    it('totalRecordsが正しい', () => {
      const result = exportMasterData({
        format: 'csv',
        masterTypes: ['facility', 'profession']
      });

      expect(result.totalRecords).toBeGreaterThan(0);
    });

    it('ファイルサイズが記録される', () => {
      const result = exportMasterData({
        format: 'csv',
        masterTypes: ['facility']
      });

      expect(result.files[0].size).toBeGreaterThan(0);
      expect(result.files[0].size).toBe(result.files[0].content.length);
    });
  });
});
