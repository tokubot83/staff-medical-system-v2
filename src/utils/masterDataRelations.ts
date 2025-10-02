/**
 * マスターデータ間のリレーション管理
 * Phase 2-1: 削除時の参照チェック・影響範囲表示機能
 */

import { facilitySeeds } from '@/data/seeds/facilitySeeds';
import { departmentSeeds } from '@/data/seeds/departmentSeeds';
import { professionSeeds } from '@/data/seeds/professionSeeds';
import { positionSeeds } from '@/data/seeds/positionSeeds';
import { employmentTypeSeeds } from '@/data/seeds/employmentTypeSeeds';

/**
 * 参照情報
 */
export interface ReferenceInfo {
  masterType: string;
  masterLabel: string;
  count: number;
  records?: any[];
}

/**
 * 削除影響範囲
 */
export interface DeleteImpact {
  canDelete: boolean;
  reason?: string;
  references: ReferenceInfo[];
  totalReferences: number;
  warnings: string[];
}

/**
 * 施設削除時の影響範囲チェック
 */
export function checkFacilityDeleteImpact(facilityId: string): DeleteImpact {
  const references: ReferenceInfo[] = [];
  const warnings: string[] = [];

  // 部署への参照チェック
  const departmentRefs = departmentSeeds.filter(d => d.facilityId === facilityId && d.isActive);
  if (departmentRefs.length > 0) {
    references.push({
      masterType: 'department',
      masterLabel: '部署マスター',
      count: departmentRefs.length,
      records: departmentRefs.map(d => ({ id: d.id, name: d.name }))
    });
  }

  // TODO: 職員マスターへの参照チェック（実装時に追加）
  // const staffRefs = staffSeeds.filter(s => s.facilityId === facilityId);
  // if (staffRefs.length > 0) {
  //   references.push({
  //     masterType: 'staff',
  //     masterLabel: '職員マスター',
  //     count: staffRefs.length,
  //     records: staffRefs.slice(0, 5) // 最初の5件のみ
  //   });
  // }

  const totalReferences = references.reduce((sum, ref) => sum + ref.count, 0);

  if (totalReferences > 0) {
    warnings.push(`この施設には${totalReferences}件の関連データがあります`);
    warnings.push('削除すると関連データも影響を受ける可能性があります');
  }

  return {
    canDelete: totalReferences === 0,
    reason: totalReferences > 0
      ? `${totalReferences}件の関連データが存在するため削除できません`
      : undefined,
    references,
    totalReferences,
    warnings
  };
}

/**
 * 部署削除時の影響範囲チェック
 */
export function checkDepartmentDeleteImpact(departmentId: string): DeleteImpact {
  const references: ReferenceInfo[] = [];
  const warnings: string[] = [];

  // 子部署への参照チェック（階層構造）
  const childDepartments = departmentSeeds.filter(
    d => d.parentDepartmentId === departmentId && d.isActive
  );
  if (childDepartments.length > 0) {
    references.push({
      masterType: 'department',
      masterLabel: '子部署',
      count: childDepartments.length,
      records: childDepartments.map(d => ({ id: d.id, name: d.name }))
    });
  }

  // TODO: 職員マスターへの参照チェック（実装時に追加）
  // const staffRefs = staffSeeds.filter(s => s.departmentId === departmentId);
  // if (staffRefs.length > 0) {
  //   references.push({
  //     masterType: 'staff',
  //     masterLabel: '職員マスター',
  //     count: staffRefs.length,
  //     records: staffRefs.slice(0, 5)
  //   });
  // }

  const totalReferences = references.reduce((sum, ref) => sum + ref.count, 0);

  if (totalReferences > 0) {
    warnings.push(`この部署には${totalReferences}件の関連データがあります`);
  }

  return {
    canDelete: totalReferences === 0,
    reason: totalReferences > 0
      ? `${totalReferences}件の関連データが存在するため削除できません`
      : undefined,
    references,
    totalReferences,
    warnings
  };
}

/**
 * 職種削除時の影響範囲チェック
 */
export function checkProfessionDeleteImpact(professionId: string): DeleteImpact {
  const references: ReferenceInfo[] = [];
  const warnings: string[] = [];

  // TODO: 職員マスターへの参照チェック（実装時に追加）
  // const staffRefs = staffSeeds.filter(s => s.professionId === professionId);
  // if (staffRefs.length > 0) {
  //   references.push({
  //     masterType: 'staff',
  //     masterLabel: '職員マスター',
  //     count: staffRefs.length,
  //     records: staffRefs.slice(0, 5)
  //   });
  // }

  const totalReferences = references.reduce((sum, ref) => sum + ref.count, 0);

  if (totalReferences > 0) {
    warnings.push(`この職種には${totalReferences}名の職員が割り当てられています`);
    warnings.push('削除する前に職員の職種を変更してください');
  }

  return {
    canDelete: totalReferences === 0,
    reason: totalReferences > 0
      ? `${totalReferences}名の職員が割り当てられているため削除できません`
      : undefined,
    references,
    totalReferences,
    warnings
  };
}

/**
 * 役職削除時の影響範囲チェック
 */
export function checkPositionDeleteImpact(positionId: string): DeleteImpact {
  const references: ReferenceInfo[] = [];
  const warnings: string[] = [];

  // TODO: 職員マスターへの参照チェック（実装時に追加）
  // const staffRefs = staffSeeds.filter(s => s.positionId === positionId);
  // if (staffRefs.length > 0) {
  //   references.push({
  //     masterType: 'staff',
  //     masterLabel: '職員マスター',
  //     count: staffRefs.length,
  //     records: staffRefs.slice(0, 5)
  //   });
  // }

  const totalReferences = references.reduce((sum, ref) => sum + ref.count, 0);

  if (totalReferences > 0) {
    warnings.push(`この役職には${totalReferences}名の職員が割り当てられています`);
    warnings.push('削除する前に職員の役職を変更してください');
  }

  return {
    canDelete: totalReferences === 0,
    reason: totalReferences > 0
      ? `${totalReferences}名の職員が割り当てられているため削除できません`
      : undefined,
    references,
    totalReferences,
    warnings
  };
}

/**
 * 雇用形態削除時の影響範囲チェック
 */
export function checkEmploymentTypeDeleteImpact(employmentTypeId: string): DeleteImpact {
  const references: ReferenceInfo[] = [];
  const warnings: string[] = [];

  // TODO: 職員マスターへの参照チェック（実装時に追加）
  // const staffRefs = staffSeeds.filter(s => s.employmentTypeId === employmentTypeId);
  // if (staffRefs.length > 0) {
  //   references.push({
  //     masterType: 'staff',
  //     masterLabel: '職員マスター',
  //     count: staffRefs.length,
  //     records: staffRefs.slice(0, 5)
  //   });
  // }

  const totalReferences = references.reduce((sum, ref) => sum + ref.count, 0);

  if (totalReferences > 0) {
    warnings.push(`この雇用形態には${totalReferences}名の職員が割り当てられています`);
    warnings.push('削除する前に職員の雇用形態を変更してください');
  }

  return {
    canDelete: totalReferences === 0,
    reason: totalReferences > 0
      ? `${totalReferences}名の職員が割り当てられているため削除できません`
      : undefined,
    references,
    totalReferences,
    warnings
  };
}

/**
 * マスタータイプに応じた削除影響チェック
 */
export function checkDeleteImpact(
  masterType: string,
  recordId: string
): DeleteImpact {
  switch (masterType) {
    case 'facility':
      return checkFacilityDeleteImpact(recordId);

    case 'department':
      return checkDepartmentDeleteImpact(recordId);

    case 'profession':
      return checkProfessionDeleteImpact(recordId);

    case 'position':
      return checkPositionDeleteImpact(recordId);

    case 'employmentType':
      return checkEmploymentTypeDeleteImpact(recordId);

    default:
      // その他のマスターは無条件で削除可能
      return {
        canDelete: true,
        references: [],
        totalReferences: 0,
        warnings: []
      };
  }
}

/**
 * 削除影響範囲のフォーマット（コンソール表示用）
 */
export function formatDeleteImpact(impact: DeleteImpact, recordName: string): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push(`削除影響範囲: ${recordName}`);
  lines.push('='.repeat(60));
  lines.push('');

  if (impact.canDelete) {
    lines.push('✅ 削除可能');
    lines.push(`   関連データ: ${impact.totalReferences}件`);
  } else {
    lines.push('❌ 削除不可');
    lines.push(`   理由: ${impact.reason}`);
    lines.push(`   関連データ: ${impact.totalReferences}件`);
  }

  lines.push('');

  if (impact.references.length > 0) {
    lines.push('【関連データ】');
    impact.references.forEach((ref, index) => {
      lines.push(`${index + 1}. ${ref.masterLabel}: ${ref.count}件`);
      if (ref.records && ref.records.length > 0) {
        ref.records.forEach(record => {
          lines.push(`   - ${record.name || record.id}`);
        });
        if (ref.count > ref.records.length) {
          lines.push(`   ... 他${ref.count - ref.records.length}件`);
        }
      }
    });
    lines.push('');
  }

  if (impact.warnings.length > 0) {
    lines.push('【警告】');
    impact.warnings.forEach((warning, index) => {
      lines.push(`${index + 1}. ${warning}`);
    });
    lines.push('');
  }

  lines.push('='.repeat(60));

  return lines.join('\n');
}

/**
 * 削除影響範囲のHTML表示用フォーマット
 */
export function formatDeleteImpactHTML(impact: DeleteImpact, recordName: string): string {
  let html = '<div class="delete-impact">';

  // ヘッダー
  html += `<h3 class="text-lg font-semibold mb-4">削除影響範囲: ${recordName}</h3>`;

  // 削除可否
  if (impact.canDelete) {
    html += '<div class="alert alert-success mb-4">';
    html += '<p class="font-semibold">✅ この項目は削除可能です</p>';
    if (impact.totalReferences > 0) {
      html += `<p class="text-sm">※ ${impact.totalReferences}件の関連データがありますが、削除可能です</p>`;
    }
    html += '</div>';
  } else {
    html += '<div class="alert alert-error mb-4">';
    html += '<p class="font-semibold">❌ この項目は削除できません</p>';
    html += `<p class="text-sm">${impact.reason}</p>`;
    html += '</div>';
  }

  // 関連データ
  if (impact.references.length > 0) {
    html += '<div class="references mb-4">';
    html += '<h4 class="font-medium mb-2">関連データ</h4>';
    html += '<ul class="list-disc pl-5">';

    impact.references.forEach(ref => {
      html += `<li class="mb-2">`;
      html += `<span class="font-medium">${ref.masterLabel}:</span> ${ref.count}件`;

      if (ref.records && ref.records.length > 0) {
        html += '<ul class="list-circle pl-5 mt-1 text-sm">';
        ref.records.forEach(record => {
          html += `<li>${record.name || record.id}</li>`;
        });
        if (ref.count > ref.records.length) {
          html += `<li class="text-gray-500">... 他${ref.count - ref.records.length}件</li>`;
        }
        html += '</ul>';
      }

      html += '</li>';
    });

    html += '</ul>';
    html += '</div>';
  }

  // 警告
  if (impact.warnings.length > 0) {
    html += '<div class="warnings">';
    html += '<h4 class="font-medium mb-2">⚠️ 注意事項</h4>';
    html += '<ul class="list-disc pl-5 text-sm text-yellow-800">';
    impact.warnings.forEach(warning => {
      html += `<li>${warning}</li>`;
    });
    html += '</ul>';
    html += '</div>';
  }

  html += '</div>';

  return html;
}
