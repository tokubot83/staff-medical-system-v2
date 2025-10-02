/**
 * マスターデータインポート時のバリデーション機能
 * Phase 1-5: インポート時の外部キー検証実装
 */

import { facilitySeeds } from '@/data/seeds/facilitySeeds';
import { departmentSeeds } from '@/data/seeds/departmentSeeds';
import { professionSeeds } from '@/data/seeds/professionSeeds';
import { positionSeeds } from '@/data/seeds/positionSeeds';
import { employmentTypeSeeds } from '@/data/seeds/employmentTypeSeeds';

/**
 * バリデーションエラー
 */
export interface ValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  errorCount: number;
  warningCount: number;
}

/**
 * 施設IDの存在チェック
 */
export function validateFacilityId(facilityId: string): boolean {
  // facilitySeeds から既存の施設を取得（将来的にはDBから取得）
  const validFacilityIds = [
    'obara-hospital',
    'tategami-rehabilitation',
    'corporate-headquarters'
  ];

  return validFacilityIds.includes(facilityId);
}

/**
 * 部署IDの存在チェック
 */
export function validateDepartmentId(departmentId: string): boolean {
  return departmentSeeds.some(d => d.id === departmentId && d.isActive);
}

/**
 * 部署コードの存在チェック
 */
export function validateDepartmentCode(departmentCode: string): boolean {
  return departmentSeeds.some(d => d.code === departmentCode && d.isActive);
}

/**
 * 職種IDの存在チェック
 */
export function validateProfessionId(professionId: string): boolean {
  return professionSeeds.some(p => p.id === professionId && p.isActive);
}

/**
 * 職種コードの存在チェック
 */
export function validateProfessionCode(professionCode: string): boolean {
  return professionSeeds.some(p => p.code === professionCode && p.isActive);
}

/**
 * 役職IDの存在チェック
 */
export function validatePositionId(positionId: string): boolean {
  return positionSeeds.some(p => p.id === positionId && p.isActive);
}

/**
 * 役職コードの存在チェック
 */
export function validatePositionCode(positionCode: string): boolean {
  return positionSeeds.some(p => p.code === positionCode && p.isActive);
}

/**
 * 雇用形態IDの存在チェック
 */
export function validateEmploymentTypeId(employmentTypeId: string): boolean {
  return employmentTypeSeeds.some(e => e.id === employmentTypeId && e.isActive);
}

/**
 * 雇用形態コードの存在チェック
 */
export function validateEmploymentTypeCode(employmentTypeCode: string): boolean {
  return employmentTypeSeeds.some(e => e.code === employmentTypeCode && e.isActive);
}

/**
 * 施設-部署の整合性チェック
 * 指定された部署が指定された施設に所属しているかを確認
 */
export function validateFacilityDepartmentRelation(
  facilityId: string,
  departmentId: string
): { valid: boolean; message?: string } {
  const department = departmentSeeds.find(d => d.id === departmentId);

  if (!department) {
    return {
      valid: false,
      message: `部署ID「${departmentId}」が見つかりません`
    };
  }

  if (department.facilityId !== facilityId) {
    return {
      valid: false,
      message: `部署「${department.name}」は施設「${facilityId}」に所属していません（所属: ${department.facilityName}）`
    };
  }

  return { valid: true };
}

/**
 * 職員データのインポートバリデーション
 */
export function validateStaffImportData(
  data: any[],
  options?: {
    checkDuplicates?: boolean;
    strictMode?: boolean;
  }
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const employeeNumbers = new Set<string>();
  const emails = new Set<string>();

  data.forEach((row, index) => {
    const rowNumber = index + 2; // ヘッダー行を考慮（1行目がヘッダー、2行目からデータ）

    // 必須フィールドチェック
    if (!row.employeeNumber) {
      errors.push({
        row: rowNumber,
        field: 'employeeNumber',
        value: row.employeeNumber,
        message: '職員番号は必須です',
        severity: 'error'
      });
    }

    if (!row.name) {
      errors.push({
        row: rowNumber,
        field: 'name',
        value: row.name,
        message: '氏名は必須です',
        severity: 'error'
      });
    }

    // 施設IDの存在チェック
    if (row.facility && !validateFacilityId(row.facility)) {
      errors.push({
        row: rowNumber,
        field: 'facility',
        value: row.facility,
        message: `施設ID「${row.facility}」が存在しません`,
        severity: 'error'
      });
    }

    // 部署IDの存在チェック
    if (row.department && !validateDepartmentId(row.department)) {
      errors.push({
        row: rowNumber,
        field: 'department',
        value: row.department,
        message: `部署ID「${row.department}」が存在しません`,
        severity: 'error'
      });
    }

    // 施設-部署の整合性チェック
    if (row.facility && row.department) {
      const relationCheck = validateFacilityDepartmentRelation(row.facility, row.department);
      if (!relationCheck.valid) {
        errors.push({
          row: rowNumber,
          field: 'department',
          value: row.department,
          message: relationCheck.message || '施設と部署の関連が不正です',
          severity: 'error'
        });
      }
    }

    // 職種IDの存在チェック
    if (row.profession && !validateProfessionId(row.profession)) {
      errors.push({
        row: rowNumber,
        field: 'profession',
        value: row.profession,
        message: `職種ID「${row.profession}」が存在しません`,
        severity: 'error'
      });
    }

    // 役職IDの存在チェック（任意項目）
    if (row.position && row.position !== '' && !validatePositionId(row.position)) {
      errors.push({
        row: rowNumber,
        field: 'position',
        value: row.position,
        message: `役職ID「${row.position}」が存在しません`,
        severity: 'error'
      });
    }

    // 雇用形態IDの存在チェック
    if (row.employmentType && !validateEmploymentTypeId(row.employmentType)) {
      errors.push({
        row: rowNumber,
        field: 'employmentType',
        value: row.employmentType,
        message: `雇用形態ID「${row.employmentType}」が存在しません`,
        severity: 'error'
      });
    }

    // 重複チェック（オプション）
    if (options?.checkDuplicates) {
      // 職員番号の重複チェック
      if (row.employeeNumber) {
        if (employeeNumbers.has(row.employeeNumber)) {
          errors.push({
            row: rowNumber,
            field: 'employeeNumber',
            value: row.employeeNumber,
            message: `職員番号「${row.employeeNumber}」が重複しています`,
            severity: 'error'
          });
        } else {
          employeeNumbers.add(row.employeeNumber);
        }
      }

      // メールアドレスの重複チェック（警告のみ）
      if (row.email) {
        if (emails.has(row.email)) {
          warnings.push({
            row: rowNumber,
            field: 'email',
            value: row.email,
            message: `メールアドレス「${row.email}」が重複しています`,
            severity: 'warning'
          });
        } else {
          emails.add(row.email);
        }
      }
    }

    // 日付フォーマットチェック
    if (row.hireDate && !isValidDate(row.hireDate)) {
      warnings.push({
        row: rowNumber,
        field: 'hireDate',
        value: row.hireDate,
        message: `入職日の形式が不正です（例: 2024-01-01）`,
        severity: 'warning'
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    errorCount: errors.length,
    warningCount: warnings.length
  };
}

/**
 * 日付の妥当性チェック
 */
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * バリデーション結果のフォーマット（コンソール表示用）
 */
export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('インポートデータ バリデーション結果');
  lines.push('='.repeat(60));
  lines.push('');

  if (result.valid) {
    lines.push('✅ バリデーション成功');
    lines.push(`   エラー: ${result.errorCount}件`);
    lines.push(`   警告: ${result.warningCount}件`);
  } else {
    lines.push('❌ バリデーション失敗');
    lines.push(`   エラー: ${result.errorCount}件`);
    lines.push(`   警告: ${result.warningCount}件`);
  }

  lines.push('');

  if (result.errors.length > 0) {
    lines.push('【エラー】');
    result.errors.forEach((error, index) => {
      lines.push(`${index + 1}. 行${error.row} - ${error.field}: ${error.message}`);
      lines.push(`   値: ${JSON.stringify(error.value)}`);
    });
    lines.push('');
  }

  if (result.warnings.length > 0) {
    lines.push('【警告】');
    result.warnings.forEach((warning, index) => {
      lines.push(`${index + 1}. 行${warning.row} - ${warning.field}: ${warning.message}`);
      lines.push(`   値: ${JSON.stringify(warning.value)}`);
    });
    lines.push('');
  }

  lines.push('='.repeat(60));

  return lines.join('\n');
}

/**
 * バリデーション結果のHTML表示用フォーマット
 */
export function formatValidationResultHTML(result: ValidationResult): string {
  let html = '<div class="validation-result">';

  if (result.valid) {
    html += '<div class="validation-success">';
    html += '<h3>✅ バリデーション成功</h3>';
    html += `<p>エラー: ${result.errorCount}件、警告: ${result.warningCount}件</p>`;
    html += '</div>';
  } else {
    html += '<div class="validation-error">';
    html += '<h3>❌ バリデーション失敗</h3>';
    html += `<p>エラー: ${result.errorCount}件、警告: ${result.warningCount}件</p>`;
    html += '</div>';
  }

  if (result.errors.length > 0) {
    html += '<div class="errors">';
    html += '<h4>エラー</h4>';
    html += '<ul>';
    result.errors.forEach(error => {
      html += `<li>`;
      html += `<strong>行${error.row} - ${error.field}:</strong> ${error.message}`;
      html += `<br><span class="error-value">値: ${JSON.stringify(error.value)}</span>`;
      html += `</li>`;
    });
    html += '</ul>';
    html += '</div>';
  }

  if (result.warnings.length > 0) {
    html += '<div class="warnings">';
    html += '<h4>警告</h4>';
    html += '<ul>';
    result.warnings.forEach(warning => {
      html += `<li>`;
      html += `<strong>行${warning.row} - ${warning.field}:</strong> ${warning.message}`;
      html += `<br><span class="warning-value">値: ${JSON.stringify(warning.value)}</span>`;
      html += `</li>`;
    });
    html += '</ul>';
    html += '</div>';
  }

  html += '</div>';

  return html;
}
