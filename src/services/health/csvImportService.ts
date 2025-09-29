/**
 * 健康診断データ CSVインポートサービス
 * Created: 2025-09-29
 */

import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { healthDb } from '@/lib/health/database';
import type {
  HealthCheckup,
  HealthCheckupDetail,
  CheckupType,
  OverallResult,
  TestCategory,
  TestStatus
} from '@prisma/client';

// CSVデータのバリデーションスキーマ
const HealthCheckupCsvSchema = z.object({
  職員ID: z.string(),
  氏名: z.string(),
  健診日: z.string(),
  身長: z.string().optional(),
  体重: z.string().optional(),
  BMI: z.string().optional(),
  腹囲: z.string().optional(),
  収縮期血圧: z.string().optional(),
  拡張期血圧: z.string().optional(),
  右眼視力: z.string().optional(),
  左眼視力: z.string().optional(),
  総合判定: z.enum(['A', 'B', 'C', 'D', 'E']).optional(),
  要再検査: z.string().optional(),
  医師所見: z.string().optional(),
  // 血液検査
  AST_GOT: z.string().optional(),
  ALT_GPT: z.string().optional(),
  γGTP: z.string().optional(),
  総コレステロール: z.string().optional(),
  中性脂肪: z.string().optional(),
  HDLコレステロール: z.string().optional(),
  LDLコレステロール: z.string().optional(),
  クレアチニン: z.string().optional(),
  eGFR: z.string().optional(),
  血糖: z.string().optional(),
  白血球数: z.string().optional(),
  赤血球数: z.string().optional(),
  ヘモグロビン: z.string().optional(),
  ヘマトクリット: z.string().optional(),
  血小板数: z.string().optional(),
  // 尿検査
  尿蛋白: z.string().optional(),
  尿糖: z.string().optional(),
  尿潜血: z.string().optional(),
  尿ウロビリノーゲン: z.string().optional(),
});

type HealthCheckupCsvRow = z.infer<typeof HealthCheckupCsvSchema>;

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    staffId: string;
    error: string;
  }>;
}

export class CsvImportService {
  /**
   * CSVファイルをインポート
   */
  async importHealthCheckupCsv(
    csvContent: string,
    importedBy: string
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: []
    };

    try {
      // CSVパース
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        encoding: 'utf8',
        bom: true,
        trim: true,
      }) as HealthCheckupCsvRow[];

      console.log(`📊 Parsing ${records.length} records from CSV...`);

      // バッチ処理で効率化
      const batchSize = 50;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async (record, index) => {
            const rowNumber = i + index + 2; // ヘッダー行を考慮

            try {
              // バリデーション
              const validatedData = HealthCheckupCsvSchema.parse(record);

              // データ変換とインポート
              await this.importSingleRecord(validatedData, importedBy);
              result.imported++;

            } catch (error) {
              result.failed++;
              result.errors.push({
                row: rowNumber,
                staffId: record.職員ID || 'UNKNOWN',
                error: error instanceof Error ? error.message : 'Unknown error'
              });
            }
          })
        );

        // 進捗表示
        console.log(`✅ Processed ${Math.min(i + batchSize, records.length)}/${records.length} records`);
      }

      result.success = result.failed === 0;

    } catch (error) {
      console.error('CSV import failed:', error);
      result.success = false;
      if (error instanceof Error) {
        result.errors.push({
          row: 0,
          staffId: 'SYSTEM',
          error: `CSV parse error: ${error.message}`
        });
      }
    }

    return result;
  }

  /**
   * 1レコードをインポート
   */
  private async importSingleRecord(
    record: HealthCheckupCsvRow,
    importedBy: string
  ): Promise<void> {
    // 日付変換
    const checkupDate = this.parseDate(record.健診日);

    // メインレコード作成
    const checkup = await healthDb.healthCheckup.create({
      data: {
        staffId: record.職員ID,
        checkupDate,
        checkupType: 'REGULAR',

        // 身体測定
        height: record.身長 ? parseFloat(record.身長) : null,
        weight: record.体重 ? parseFloat(record.体重) : null,
        bmi: record.BMI ? parseFloat(record.BMI) : null,
        waistCircumference: record.腹囲 ? parseFloat(record.腹囲) : null,

        // 血圧
        systolicBp: record.収縮期血圧 ? parseInt(record.収縮期血圧) : null,
        diastolicBp: record.拡張期血圧 ? parseInt(record.拡張期血圧) : null,

        // 視力
        visionRight: record.右眼視力 ? parseFloat(record.右眼視力) : null,
        visionLeft: record.左眼視力 ? parseFloat(record.左眼視力) : null,

        // 総合判定
        overallResult: record.総合判定 as OverallResult || null,
        reexaminationRequired: record.要再検査 === '有',

        // 医師所見
        doctorFindings: record.医師所見 || null,

        // 管理情報
        dataSource: 'CSV_IMPORT',
        createdBy: importedBy,
      }
    });

    // 詳細レコード作成
    const details: Array<Omit<HealthCheckupDetail, 'id' | 'createdAt' | 'updatedAt'>> = [];

    // 肝機能検査
    if (record.AST_GOT) {
      details.push(this.createDetailRecord(checkup.id, 'LIVER', 'AST', 'AST(GOT)',
        record.AST_GOT, 'IU/L', 13, 30));
    }
    if (record.ALT_GPT) {
      details.push(this.createDetailRecord(checkup.id, 'LIVER', 'ALT', 'ALT(GPT)',
        record.ALT_GPT, 'IU/L', 10, 42));
    }
    if (record.γGTP) {
      details.push(this.createDetailRecord(checkup.id, 'LIVER', 'GGT', 'γ-GTP',
        record.γGTP, 'IU/L', 13, 64));
    }

    // 血中脂質検査
    if (record.総コレステロール) {
      details.push(this.createDetailRecord(checkup.id, 'LIPID', 'T-CHO', '総コレステロール',
        record.総コレステロール, 'mg/dL', 142, 248));
    }
    if (record.中性脂肪) {
      details.push(this.createDetailRecord(checkup.id, 'LIPID', 'TG', '中性脂肪',
        record.中性脂肪, 'mg/dL', 40, 234));
    }
    if (record.HDLコレステロール) {
      details.push(this.createDetailRecord(checkup.id, 'LIPID', 'HDL-C', 'HDLコレステロール',
        record.HDLコレステロール, 'mg/dL', 38, 90));
    }
    if (record.LDLコレステロール) {
      details.push(this.createDetailRecord(checkup.id, 'LIPID', 'LDL-C', 'LDLコレステロール',
        record.LDLコレステロール, 'mg/dL', 65, 163));
    }

    // 腎機能検査
    if (record.クレアチニン) {
      details.push(this.createDetailRecord(checkup.id, 'KIDNEY', 'CRE', 'クレアチニン',
        record.クレアチニン, 'mg/dL', 0.65, 1.07));
    }
    if (record.eGFR) {
      details.push(this.createDetailRecord(checkup.id, 'KIDNEY', 'eGFR', 'eGFR',
        record.eGFR, 'mL/min/1.73m²', 60, null));
    }

    // 血糖検査
    if (record.血糖) {
      details.push(this.createDetailRecord(checkup.id, 'BLOOD', 'GLU', '血糖',
        record.血糖, 'mg/dL', 73, 109));
    }

    // 血液一般検査
    if (record.白血球数) {
      details.push(this.createDetailRecord(checkup.id, 'BLOOD', 'WBC', '白血球数',
        record.白血球数, '10²/mm³', 33, 86));
    }
    if (record.赤血球数) {
      details.push(this.createDetailRecord(checkup.id, 'BLOOD', 'RBC', '赤血球数',
        record.赤血球数, '10⁴/mm³', 435, 555));
    }
    if (record.ヘモグロビン) {
      details.push(this.createDetailRecord(checkup.id, 'BLOOD', 'HGB', 'ヘモグロビン',
        record.ヘモグロビン, 'g/dL', 13.7, 16.8));
    }
    if (record.ヘマトクリット) {
      details.push(this.createDetailRecord(checkup.id, 'BLOOD', 'HCT', 'ヘマトクリット',
        record.ヘマトクリット, '%', 40.7, 50.1));
    }
    if (record.血小板数) {
      details.push(this.createDetailRecord(checkup.id, 'BLOOD', 'PLT', '血小板数',
        record.血小板数, '10⁴/mm³', 15.8, 34.8));
    }

    // 尿検査
    if (record.尿蛋白) {
      details.push(this.createUrineDetailRecord(checkup.id, 'PROT', '尿蛋白', record.尿蛋白));
    }
    if (record.尿糖) {
      details.push(this.createUrineDetailRecord(checkup.id, 'GLU', '尿糖', record.尿糖));
    }
    if (record.尿潜血) {
      details.push(this.createUrineDetailRecord(checkup.id, 'BLD', '尿潜血', record.尿潜血));
    }

    // 詳細レコードを一括作成
    if (details.length > 0) {
      await healthDb.healthCheckupDetail.createMany({
        data: details
      });
    }

    // イベント記録
    await healthDb.healthEvent.create({
      data: {
        staffId: record.職員ID,
        eventDate: new Date(),
        eventType: 'CHECKUP_COMPLETED',
        title: '健康診断データインポート',
        description: `${checkupDate.toLocaleDateString('ja-JP')}実施分のデータをインポート`,
        relatedId: checkup.id,
        recordedBy: importedBy,
        department: 'SYSTEM'
      }
    });
  }

  /**
   * 詳細レコード作成ヘルパー
   */
  private createDetailRecord(
    checkupId: string,
    category: TestCategory,
    itemCode: string,
    itemName: string,
    value: string,
    unit: string,
    refMin: number | null,
    refMax: number | null
  ): Omit<HealthCheckupDetail, 'id' | 'createdAt' | 'updatedAt'> {
    const numValue = parseFloat(value);
    let status: TestStatus = 'NORMAL';

    if (!isNaN(numValue)) {
      if (refMin !== null && numValue < refMin) {
        status = 'ABNORMAL';
      } else if (refMax !== null && numValue > refMax) {
        status = 'ABNORMAL';
      }
    }

    return {
      checkupId,
      category,
      itemCode,
      itemName,
      value,
      unit,
      referenceMin: refMin,
      referenceMax: refMax,
      status
    };
  }

  /**
   * 尿検査用詳細レコード作成
   */
  private createUrineDetailRecord(
    checkupId: string,
    itemCode: string,
    itemName: string,
    value: string
  ): Omit<HealthCheckupDetail, 'id' | 'createdAt' | 'updatedAt'> {
    const status: TestStatus =
      value === '-' ? 'NORMAL' :
      value === '±' ? 'ATTENTION' :
      'ABNORMAL';

    return {
      checkupId,
      category: 'URINE',
      itemCode,
      itemName,
      value,
      unit: null,
      referenceMin: null,
      referenceMax: null,
      status
    };
  }

  /**
   * 日付文字列をDateオブジェクトに変換
   */
  private parseDate(dateStr: string): Date {
    // 複数の日付フォーマットに対応
    // 例: 2025-04-30, 2025/04/30, R7.4.30, R7-4-30

    // 令和表記の変換
    if (dateStr.startsWith('R')) {
      const match = dateStr.match(/R(\d+)[-./](\d+)[-./](\d+)/);
      if (match) {
        const year = 2018 + parseInt(match[1]); // 令和元年 = 2019
        const month = parseInt(match[2]);
        const day = parseInt(match[3]);
        return new Date(year, month - 1, day);
      }
    }

    // 標準的な日付フォーマット
    return new Date(dateStr);
  }
}

// シングルトンインスタンス
export const csvImportService = new CsvImportService();