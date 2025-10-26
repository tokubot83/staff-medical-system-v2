/**
 * ケース番号生成ユーティリティ
 *
 * 用途: 内部通報エスカレーション時のケース番号発番
 * フォーマット: MED-YYYY-NNNN
 *  - MED: 医療システム識別子
 *  - YYYY: 西暦年
 *  - NNNN: 年内連番（0001から開始）
 *
 * 例: MED-2025-0001, MED-2025-0002, ...
 *
 * @see mcp-shared/docs/MyReports_医療システム確認結果_20251026.md
 */

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

/**
 * ケース番号生成
 *
 * @returns ケース番号（MED-YYYY-NNNN形式）
 */
export async function generateCaseNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();

  // TODO: データベース実装後に実際の連番管理を実装
  // const lastCase = await prisma.whistleblowingCase.findFirst({
  //   where: {
  //     caseNumber: {
  //       startsWith: `MED-${currentYear}-`
  //     }
  //   },
  //   orderBy: {
  //     createdAt: 'desc'
  //   }
  // });

  // let sequenceNumber = 1;
  // if (lastCase) {
  //   const lastSequence = parseInt(lastCase.caseNumber.split('-')[2]);
  //   sequenceNumber = lastSequence + 1;
  // }

  // 暫定実装: タイムスタンプベースの連番生成
  // ※ 本番環境ではDB管理の連番に置き換え必須
  const timestamp = Date.now();
  const sequenceNumber = parseInt(timestamp.toString().slice(-4));

  const paddedSequence = sequenceNumber.toString().padStart(4, '0');
  const caseNumber = `MED-${currentYear}-${paddedSequence}`;

  console.log(`[CaseNumberGenerator] Generated case number: ${caseNumber}`);

  return caseNumber;
}

/**
 * ケース番号の妥当性検証
 *
 * @param caseNumber - 検証対象のケース番号
 * @returns 妥当性判定結果
 */
export function validateCaseNumber(caseNumber: string): boolean {
  const pattern = /^MED-\d{4}-\d{4}$/;
  return pattern.test(caseNumber);
}

/**
 * ケース番号から年度を抽出
 *
 * @param caseNumber - ケース番号
 * @returns 年度（YYYY形式）
 */
export function extractYearFromCaseNumber(caseNumber: string): number | null {
  if (!validateCaseNumber(caseNumber)) {
    return null;
  }

  const parts = caseNumber.split('-');
  return parseInt(parts[1]);
}

/**
 * ケース番号から連番を抽出
 *
 * @param caseNumber - ケース番号
 * @returns 連番（NNNN形式）
 */
export function extractSequenceFromCaseNumber(caseNumber: string): number | null {
  if (!validateCaseNumber(caseNumber)) {
    return null;
  }

  const parts = caseNumber.split('-');
  return parseInt(parts[2]);
}
