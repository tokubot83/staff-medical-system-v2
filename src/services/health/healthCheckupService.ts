/**
 * 健康診断データ CRUDサービス
 * Created: 2025-09-29
 */

import { healthDb } from '@/lib/health/database';
import type {
  HealthCheckup,
  HealthCheckupDetail,
  Prisma
} from '@prisma/client';

export interface HealthCheckupWithDetails extends HealthCheckup {
  details?: HealthCheckupDetail[];
  staff?: {
    id: string;
    name: string;
    department: string | null;
    position: string | null;
  };
}

export interface SearchParams {
  staffId?: string;
  department?: string;
  dateFrom?: Date;
  dateTo?: Date;
  overallResult?: string;
  reexaminationRequired?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'date' | 'name' | 'result';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  data: HealthCheckupWithDetails[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class HealthCheckupService {
  /**
   * 健診データ作成
   */
  async create(
    data: Prisma.HealthCheckupCreateInput,
    details?: Omit<HealthCheckupDetail, 'id' | 'checkupId' | 'createdAt' | 'updatedAt'>[]
  ): Promise<HealthCheckupWithDetails> {
    // トランザクションで健診データと詳細を同時作成
    const result = await healthDb.$transaction(async (tx) => {
      // メインレコード作成
      const checkup = await tx.healthCheckup.create({
        data,
        include: {
          staff: {
            select: {
              id: true,
              name: true,
              department: true,
              position: true
            }
          }
        }
      });

      // 詳細レコード作成
      if (details && details.length > 0) {
        await tx.healthCheckupDetail.createMany({
          data: details.map(detail => ({
            ...detail,
            checkupId: checkup.id
          }))
        });
      }

      // 詳細を含めて返却
      return await tx.healthCheckup.findUnique({
        where: { id: checkup.id },
        include: {
          details: true,
          staff: {
            select: {
              id: true,
              name: true,
              department: true,
              position: true
            }
          }
        }
      });
    });

    if (!result) {
      throw new Error('Failed to create health checkup record');
    }

    return result;
  }

  /**
   * 健診データ取得（ID指定）
   */
  async findById(id: string): Promise<HealthCheckupWithDetails | null> {
    return await healthDb.healthCheckup.findUnique({
      where: { id },
      include: {
        details: {
          orderBy: { category: 'asc' }
        },
        staff: {
          select: {
            id: true,
            name: true,
            department: true,
            position: true
          }
        }
      }
    });
  }

  /**
   * 職員の最新健診データ取得
   */
  async findLatestByStaffId(staffId: string): Promise<HealthCheckupWithDetails | null> {
    return await healthDb.healthCheckup.findFirst({
      where: { staffId },
      orderBy: { checkupDate: 'desc' },
      include: {
        details: {
          orderBy: { category: 'asc' }
        },
        staff: {
          select: {
            id: true,
            name: true,
            department: true,
            position: true
          }
        }
      }
    });
  }

  /**
   * 健診データ検索
   */
  async search(params: SearchParams): Promise<SearchResult> {
    const {
      staffId,
      department,
      dateFrom,
      dateTo,
      overallResult,
      reexaminationRequired,
      page = 1,
      pageSize = 20,
      sortBy = 'date',
      sortOrder = 'desc'
    } = params;

    // 検索条件構築
    const where: Prisma.HealthCheckupWhereInput = {};

    if (staffId) {
      where.staffId = staffId;
    }

    if (department) {
      where.staff = {
        department: {
          contains: department
        }
      };
    }

    if (dateFrom || dateTo) {
      where.checkupDate = {};
      if (dateFrom) {
        where.checkupDate.gte = dateFrom;
      }
      if (dateTo) {
        where.checkupDate.lte = dateTo;
      }
    }

    if (overallResult) {
      where.overallResult = overallResult as any;
    }

    if (reexaminationRequired !== undefined) {
      where.reexaminationRequired = reexaminationRequired;
    }

    // 並び順設定
    const orderBy: Prisma.HealthCheckupOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'date':
        orderBy.checkupDate = sortOrder;
        break;
      case 'name':
        orderBy.staff = { name: sortOrder };
        break;
      case 'result':
        orderBy.overallResult = sortOrder;
        break;
    }

    // データ取得
    const [data, total] = await Promise.all([
      healthDb.healthCheckup.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          staff: {
            select: {
              id: true,
              name: true,
              department: true,
              position: true
            }
          }
        }
      }),
      healthDb.healthCheckup.count({ where })
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  /**
   * 健診データ更新
   */
  async update(
    id: string,
    data: Prisma.HealthCheckupUpdateInput
  ): Promise<HealthCheckupWithDetails> {
    return await healthDb.healthCheckup.update({
      where: { id },
      data,
      include: {
        details: true,
        staff: {
          select: {
            id: true,
            name: true,
            department: true,
            position: true
          }
        }
      }
    });
  }

  /**
   * 健診データ削除
   */
  async delete(id: string): Promise<void> {
    await healthDb.healthCheckup.delete({
      where: { id }
    });
  }

  /**
   * 統計データ取得
   */
  async getStatistics(params: {
    department?: string;
    fiscalYear?: string;
  }): Promise<{
    totalCheckups: number;
    completionRate: number;
    reexaminationRate: number;
    resultDistribution: Record<string, number>;
    departmentStats?: Array<{
      department: string;
      count: number;
      avgResult: string;
    }>;
  }> {
    const where: Prisma.HealthCheckupWhereInput = {};

    if (params.department) {
      where.staff = {
        department: params.department
      };
    }

    if (params.fiscalYear) {
      const year = parseInt(params.fiscalYear);
      where.checkupDate = {
        gte: new Date(year, 3, 1), // 4月1日
        lt: new Date(year + 1, 3, 1)
      };
    }

    // 基本統計
    const [total, reexamCount, results] = await Promise.all([
      healthDb.healthCheckup.count({ where }),
      healthDb.healthCheckup.count({
        where: {
          ...where,
          reexaminationRequired: true
        }
      }),
      healthDb.healthCheckup.groupBy({
        by: ['overallResult'],
        where,
        _count: true
      })
    ]);

    // 結果分布
    const resultDistribution: Record<string, number> = {};
    results.forEach(r => {
      if (r.overallResult) {
        resultDistribution[r.overallResult] = r._count;
      }
    });

    // 部署別統計（オプション）
    let departmentStats;
    if (!params.department) {
      const deptResults = await healthDb.$queryRaw`
        SELECT
          s.department,
          COUNT(h.id) as count,
          MODE() WITHIN GROUP (ORDER BY h.overall_result) as avg_result
        FROM health_checkups h
        JOIN staff_master s ON h.staff_id = s.id
        WHERE s.department IS NOT NULL
        GROUP BY s.department
        ORDER BY count DESC
      `;
      departmentStats = deptResults as any[];
    }

    // 職員総数（仮定: 1250名）
    const totalStaff = 1250;
    const completionRate = (total / totalStaff) * 100;
    const reexaminationRate = total > 0 ? (reexamCount / total) * 100 : 0;

    return {
      totalCheckups: total,
      completionRate,
      reexaminationRate,
      resultDistribution,
      departmentStats
    };
  }

  /**
   * 要再検査者リスト取得
   */
  async getReexaminationList(params: {
    department?: string;
    onlyPending?: boolean;
  }): Promise<HealthCheckupWithDetails[]> {
    const where: Prisma.HealthCheckupWhereInput = {
      reexaminationRequired: true
    };

    if (params.department) {
      where.staff = {
        department: params.department
      };
    }

    if (params.onlyPending) {
      // 再検査未実施者のみ（実装簡略化のため、30日以内に再検査がない者）
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      where.checkupDate = {
        lt: thirtyDaysAgo
      };
    }

    return await healthDb.healthCheckup.findMany({
      where,
      orderBy: { checkupDate: 'desc' },
      include: {
        details: {
          where: {
            status: 'ABNORMAL'
          }
        },
        staff: {
          select: {
            id: true,
            name: true,
            department: true,
            position: true
          }
        }
      }
    });
  }

  /**
   * 検査項目の異常値取得
   */
  async getAbnormalItems(checkupId: string): Promise<HealthCheckupDetail[]> {
    return await healthDb.healthCheckupDetail.findMany({
      where: {
        checkupId,
        status: {
          in: ['ATTENTION', 'ABNORMAL']
        }
      },
      orderBy: [
        { status: 'desc' },
        { category: 'asc' }
      ]
    });
  }

  /**
   * 経年変化データ取得
   */
  async getTrendData(
    staffId: string,
    itemCode: string,
    limit: number = 5
  ): Promise<Array<{
    date: Date;
    value: string;
    status: string;
  }>> {
    const checkups = await healthDb.healthCheckup.findMany({
      where: { staffId },
      orderBy: { checkupDate: 'desc' },
      take: limit,
      select: {
        checkupDate: true,
        details: {
          where: { itemCode },
          select: {
            value: true,
            status: true
          }
        }
      }
    });

    return checkups
      .filter(c => c.details.length > 0)
      .map(c => ({
        date: c.checkupDate,
        value: c.details[0].value || '',
        status: c.details[0].status
      }));
  }
}

// シングルトンインスタンス
export const healthCheckupService = new HealthCheckupService();