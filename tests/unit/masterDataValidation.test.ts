/**
 * マスターデータバリデーション ユニットテスト
 * Phase 1-5: インポート時の外部キー検証テスト
 */

import {
  validateFacilityId,
  validateDepartmentId,
  validateProfessionId,
  validatePositionId,
  validateEmploymentTypeId,
  validateFacilityDepartmentRelation,
  validateStaffImportData,
  formatValidationResult
} from '../../src/utils/masterDataValidation';

describe('Master Data Validation Tests', () => {
  describe('Facility ID Validation', () => {
    test('有効な施設IDを受け入れる', () => {
      expect(validateFacilityId('obara-hospital')).toBe(true);
      expect(validateFacilityId('tategami-rehabilitation')).toBe(true);
      expect(validateFacilityId('corporate-headquarters')).toBe(true);
    });

    test('無効な施設IDを拒否する', () => {
      expect(validateFacilityId('invalid-facility')).toBe(false);
      expect(validateFacilityId('')).toBe(false);
    });
  });

  describe('Department ID Validation', () => {
    test('有効な部署IDを受け入れる', () => {
      expect(validateDepartmentId('DEPT_001')).toBe(true); // 小原病院 看護部
      expect(validateDepartmentId('DEPT_006')).toBe(true); // 立神 リハビリテーション部
    });

    test('無効な部署IDを拒否する', () => {
      expect(validateDepartmentId('DEPT_999')).toBe(false);
      expect(validateDepartmentId('')).toBe(false);
    });
  });

  describe('Facility-Department Relation Validation', () => {
    test('正しい施設-部署の組み合わせを受け入れる', () => {
      const result = validateFacilityDepartmentRelation('obara-hospital', 'DEPT_001');
      expect(result.valid).toBe(true);
    });

    test('不正な施設-部署の組み合わせを拒否する', () => {
      // 小原病院に立神の部署を紐付け（エラー）
      const result = validateFacilityDepartmentRelation('obara-hospital', 'DEPT_006');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('所属していません');
    });

    test('存在しない部署IDを拒否する', () => {
      const result = validateFacilityDepartmentRelation('obara-hospital', 'DEPT_999');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('見つかりません');
    });
  });

  describe('Staff Import Data Validation', () => {
    test('正常なデータを受け入れる', () => {
      const data = [
        {
          employeeNumber: '001',
          name: '山田太郎',
          facility: 'obara-hospital',
          department: 'DEPT_001',
          profession: 'PROF_001',
          position: 'POS_002',
          employmentType: 'EMP_001',
          hireDate: '2024-01-01'
        }
      ];

      const result = validateStaffImportData(data, { checkDuplicates: true });

      expect(result.valid).toBe(true);
      expect(result.errorCount).toBe(0);
    });

    test('必須フィールド欠落を検出する', () => {
      const data = [
        {
          // employeeNumber がない
          name: '山田太郎'
        }
      ];

      const result = validateStaffImportData(data);

      expect(result.valid).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('職員番号は必須');
    });

    test('存在しない施設IDを検出する', () => {
      const data = [
        {
          employeeNumber: '001',
          name: '山田太郎',
          facility: 'invalid-facility'
        }
      ];

      const result = validateStaffImportData(data);

      expect(result.valid).toBe(false);
      const facilityError = result.errors.find(e => e.field === 'facility');
      expect(facilityError).toBeDefined();
      expect(facilityError?.message).toContain('存在しません');
    });

    test('施設-部署の不整合を検出する', () => {
      const data = [
        {
          employeeNumber: '001',
          name: '山田太郎',
          facility: 'obara-hospital',
          department: 'DEPT_006' // 立神の部署
        }
      ];

      const result = validateStaffImportData(data);

      expect(result.valid).toBe(false);
      const deptError = result.errors.find(e => e.field === 'department');
      expect(deptError).toBeDefined();
      expect(deptError?.message).toContain('所属していません');
    });

    test('重複した職員番号を検出する', () => {
      const data = [
        {
          employeeNumber: '001',
          name: '山田太郎'
        },
        {
          employeeNumber: '001', // 重複
          name: '鈴木次郎'
        }
      ];

      const result = validateStaffImportData(data, { checkDuplicates: true });

      expect(result.valid).toBe(false);
      const duplicateError = result.errors.find(e => e.message.includes('重複'));
      expect(duplicateError).toBeDefined();
    });

    test('複数のエラーを検出する', () => {
      const data = [
        {
          // employeeNumber がない
          name: '山田太郎',
          facility: 'invalid-facility',
          department: 'DEPT_999'
        }
      ];

      const result = validateStaffImportData(data);

      expect(result.valid).toBe(false);
      expect(result.errorCount).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Validation Result Formatting', () => {
    test('バリデーション結果を正しくフォーマットする', () => {
      const data = [
        {
          employeeNumber: '001',
          name: '山田太郎',
          facility: 'invalid-facility'
        }
      ];

      const result = validateStaffImportData(data);
      const formatted = formatValidationResult(result);

      expect(formatted).toContain('バリデーション失敗');
      expect(formatted).toContain('エラー');
      expect(formatted).toContain('invalid-facility');
    });
  });
});
