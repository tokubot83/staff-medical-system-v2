/**
 * マスターデータリレーション管理 ユニットテスト
 * Phase 2-1: 削除時の参照チェック・影響範囲表示テスト
 */

import {
  checkFacilityDeleteImpact,
  checkDepartmentDeleteImpact,
  checkDeleteImpact,
  formatDeleteImpact
} from '../../src/utils/masterDataRelations';

describe('Master Data Relations Tests', () => {
  describe('Facility Delete Impact Check', () => {
    test('部署が紐付いている施設は削除不可', () => {
      const impact = checkFacilityDeleteImpact('obara-hospital');

      expect(impact.canDelete).toBe(false);
      expect(impact.totalReferences).toBeGreaterThan(0);
      expect(impact.reason).toContain('関連データが存在するため');
      expect(impact.references).toHaveLength(1);
      expect(impact.references[0].masterType).toBe('department');
    });

    test('部署が紐付いていない施設は削除可能', () => {
      // 架空の施設ID（部署が存在しない）
      const impact = checkFacilityDeleteImpact('non-existent-facility');

      expect(impact.canDelete).toBe(true);
      expect(impact.totalReferences).toBe(0);
      expect(impact.references).toHaveLength(0);
    });
  });

  describe('Department Delete Impact Check', () => {
    test('子部署がある部署は削除不可（将来対応）', () => {
      // 現在は子部署の設定がないため、スキップ
      // 将来的に階層構造が実装されたらテストを有効化
    });

    test('子部署がない部署は削除可能', () => {
      const impact = checkDepartmentDeleteImpact('DEPT_001');

      // 職員マスターが未実装のため、現状は削除可能
      expect(impact.canDelete).toBe(true);
      expect(impact.totalReferences).toBe(0);
    });
  });

  describe('Generic Delete Impact Check', () => {
    test('施設の削除影響チェックを正しく実行', () => {
      const impact = checkDeleteImpact('facility', 'obara-hospital');

      expect(impact.canDelete).toBe(false);
      expect(impact.totalReferences).toBeGreaterThan(0);
    });

    test('職種の削除影響チェックを正しく実行', () => {
      const impact = checkDeleteImpact('profession', 'PROF_001');

      // 職員マスターが未実装のため、現状は削除可能
      expect(impact.canDelete).toBe(true);
    });

    test('役職の削除影響チェックを正しく実行', () => {
      const impact = checkDeleteImpact('position', 'POS_001');

      // 職員マスターが未実装のため、現状は削除可能
      expect(impact.canDelete).toBe(true);
    });

    test('雇用形態の削除影響チェックを正しく実行', () => {
      const impact = checkDeleteImpact('employmentType', 'EMP_001');

      // 職員マスターが未実装のため、現状は削除可能
      expect(impact.canDelete).toBe(true);
    });

    test('未定義のマスタータイプは削除可能', () => {
      const impact = checkDeleteImpact('unknown', 'UNKNOWN_001');

      expect(impact.canDelete).toBe(true);
      expect(impact.totalReferences).toBe(0);
    });
  });

  describe('Delete Impact Formatting', () => {
    test('削除影響範囲を正しくフォーマットする', () => {
      const impact = checkFacilityDeleteImpact('obara-hospital');
      const formatted = formatDeleteImpact(impact, '小原病院');

      expect(formatted).toContain('削除影響範囲');
      expect(formatted).toContain('小原病院');
      expect(formatted).toContain('削除不可');
      expect(formatted).toContain('部署マスター');
    });

    test('削除可能な場合のフォーマット', () => {
      const impact = checkDeleteImpact('profession', 'PROF_001');
      const formatted = formatDeleteImpact(impact, '看護師');

      expect(formatted).toContain('削除可能');
    });
  });
});
