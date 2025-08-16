/**
 * 面談予約データベース操作
 * Prismaを使用したCRUD操作の実装
 */

import prisma from './prisma';
import { 
  InterviewReservationType, 
  ReservationStatus, 
  UrgencyLevel,
  RegularInterviewType,
  SpecialInterviewType,
  ReservationSource,
  LogAction,
  NotificationType,
  NotificationChannel,
  Prisma
} from '@prisma/client';

// 面談予約の作成データ型
export interface CreateReservationInput {
  type: InterviewReservationType;
  subType?: string;
  status?: ReservationStatus;
  urgency?: UrgencyLevel;
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  experienceYears?: number;
  scheduledDate: Date;
  scheduledTime: string;
  duration?: number;
  location?: string;
  onlineUrl?: string;
  regularType?: RegularInterviewType;
  regularCycle?: string;
  specialType?: SpecialInterviewType;
  specialContext?: any;
  specialReason?: string;
  supportCategory?: string;
  supportTopic?: string;
  supportDetails?: string;
  voicedriveRequestId?: string;
  source?: ReservationSource;
  createdBy: string;
  notes?: string;
}

// 面談予約の更新データ型
export interface UpdateReservationInput {
  status?: ReservationStatus;
  urgency?: UrgencyLevel;
  scheduledDate?: Date;
  scheduledTime?: string;
  duration?: number;
  location?: string;
  onlineUrl?: string;
  notes?: string;
}

export class InterviewReservationDb {
  /**
   * 面談予約を作成
   */
  static async create(data: CreateReservationInput) {
    return await prisma.interviewReservation.create({
      data: {
        type: data.type,
        subType: data.subType,
        status: data.status || ReservationStatus.CONFIRMED,
        urgency: data.urgency,
        staffId: data.staffId,
        staffName: data.staffName,
        department: data.department,
        position: data.position,
        experienceYears: data.experienceYears || 0,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        duration: data.duration || 30,
        location: data.location,
        onlineUrl: data.onlineUrl,
        regularType: data.regularType,
        regularCycle: data.regularCycle,
        specialType: data.specialType,
        specialContext: data.specialContext,
        specialReason: data.specialReason,
        supportCategory: data.supportCategory,
        supportTopic: data.supportTopic,
        supportDetails: data.supportDetails,
        voicedriveRequestId: data.voicedriveRequestId,
        source: data.source || ReservationSource.SYSTEM,
        createdBy: data.createdBy,
        notes: data.notes,
      },
      include: {
        employee: true,
        logs: true,
        notifications: true,
      }
    });
  }

  /**
   * 面談予約を取得
   */
  static async findById(id: string) {
    return await prisma.interviewReservation.findUnique({
      where: { id },
      include: {
        employee: true,
        logs: {
          orderBy: { performedAt: 'desc' },
          take: 10
        },
        notifications: {
          orderBy: { scheduledAt: 'desc' },
          take: 10
        }
      }
    });
  }

  /**
   * 面談予約一覧を取得
   */
  static async findMany(filters?: {
    staffId?: string;
    date?: Date;
    type?: InterviewReservationType;
    status?: ReservationStatus;
    source?: ReservationSource;
  }) {
    const where: Prisma.InterviewReservationWhereInput = {};

    if (filters?.staffId) {
      where.staffId = filters.staffId;
    }

    if (filters?.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);

      where.scheduledDate = {
        gte: startOfDay,
        lte: endOfDay
      };
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.source) {
      where.source = filters.source;
    }

    return await prisma.interviewReservation.findMany({
      where,
      include: {
        employee: true,
      },
      orderBy: [
        { scheduledDate: 'asc' },
        { scheduledTime: 'asc' }
      ]
    });
  }

  /**
   * 面談予約を更新
   */
  static async update(id: string, data: UpdateReservationInput, updatedBy: string) {
    // 現在のデータを取得（ログ記録用）
    const current = await prisma.interviewReservation.findUnique({
      where: { id }
    });

    if (!current) {
      throw new Error('Reservation not found');
    }

    // 変更内容を記録
    const changes: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== current[key as keyof typeof current]) {
        changes[key] = {
          old: current[key as keyof typeof current],
          new: value
        };
      }
    });

    // トランザクションで更新とログ記録を実行
    return await prisma.$transaction(async (tx) => {
      // 予約を更新
      const updated = await tx.interviewReservation.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        },
        include: {
          employee: true
        }
      });

      // 更新ログを記録
      if (Object.keys(changes).length > 0) {
        await tx.interviewReservationLog.create({
          data: {
            reservationId: id,
            action: LogAction.UPDATED,
            performedBy: updatedBy,
            changes: changes
          }
        });
      }

      // 日時変更の場合は通知を再スケジュール
      if (data.scheduledDate || data.scheduledTime) {
        await tx.interviewNotificationQueue.updateMany({
          where: {
            reservationId: id,
            status: 'PENDING'
          },
          data: {
            scheduledAt: new Date(updated.scheduledDate),
            status: 'PENDING'
          }
        });
      }

      return updated;
    });
  }

  /**
   * 面談予約のステータスを更新
   */
  static async updateStatus(id: string, status: ReservationStatus, updatedBy: string) {
    const current = await prisma.interviewReservation.findUnique({
      where: { id }
    });

    if (!current) {
      throw new Error('Reservation not found');
    }

    // ステータス遷移の妥当性チェック
    if (current.status === ReservationStatus.COMPLETED && status !== ReservationStatus.COMPLETED) {
      throw new Error('Cannot change status from completed');
    }

    if (current.status === ReservationStatus.CANCELLED && status !== ReservationStatus.CANCELLED) {
      throw new Error('Cannot change status from cancelled');
    }

    return await prisma.$transaction(async (tx) => {
      // ステータスを更新
      const updated = await tx.interviewReservation.update({
        where: { id },
        data: { 
          status,
          updatedAt: new Date()
        }
      });

      // ステータス変更ログを記録
      await tx.interviewReservationLog.create({
        data: {
          reservationId: id,
          action: status === ReservationStatus.COMPLETED ? LogAction.COMPLETED :
                 status === ReservationStatus.CANCELLED ? LogAction.CANCELLED :
                 LogAction.UPDATED,
          performedBy: updatedBy,
          changes: {
            status: {
              old: current.status,
              new: status
            }
          }
        }
      });

      return updated;
    });
  }

  /**
   * 面談予約をキャンセル
   */
  static async cancel(id: string, reason?: string, cancelledBy: string = 'system') {
    return await prisma.$transaction(async (tx) => {
      // 予約をキャンセル
      const cancelled = await tx.interviewReservation.update({
        where: { id },
        data: {
          status: ReservationStatus.CANCELLED,
          updatedAt: new Date()
        }
      });

      // キャンセルログを記録
      await tx.interviewReservationLog.create({
        data: {
          reservationId: id,
          action: LogAction.CANCELLED,
          performedBy: cancelledBy,
          reason: reason
        }
      });

      // 未送信の通知をキャンセル
      await tx.interviewNotificationQueue.updateMany({
        where: {
          reservationId: id,
          status: 'PENDING'
        },
        data: {
          status: 'FAILED',
          errorMessage: 'Reservation cancelled'
        }
      });

      return cancelled;
    });
  }

  /**
   * 複数の面談予約を一括作成
   */
  static async createMany(reservations: CreateReservationInput[]) {
    const results = await prisma.$transaction(async (tx) => {
      const created = [];
      
      for (const reservation of reservations) {
        const result = await tx.interviewReservation.create({
          data: {
            type: reservation.type,
            subType: reservation.subType,
            status: reservation.status || ReservationStatus.CONFIRMED,
            urgency: reservation.urgency,
            staffId: reservation.staffId,
            staffName: reservation.staffName,
            department: reservation.department,
            position: reservation.position,
            experienceYears: reservation.experienceYears || 0,
            scheduledDate: reservation.scheduledDate,
            scheduledTime: reservation.scheduledTime,
            duration: reservation.duration || 30,
            location: reservation.location,
            onlineUrl: reservation.onlineUrl,
            regularType: reservation.regularType,
            regularCycle: reservation.regularCycle,
            specialType: reservation.specialType,
            specialContext: reservation.specialContext,
            specialReason: reservation.specialReason,
            supportCategory: reservation.supportCategory,
            supportTopic: reservation.supportTopic,
            supportDetails: reservation.supportDetails,
            voicedriveRequestId: reservation.voicedriveRequestId,
            source: reservation.source || ReservationSource.SYSTEM,
            createdBy: reservation.createdBy,
            notes: reservation.notes,
          }
        });

        // 作成ログを記録
        await tx.interviewReservationLog.create({
          data: {
            reservationId: result.id,
            action: LogAction.CREATED,
            performedBy: reservation.createdBy
          }
        });

        created.push(result);
      }

      return created;
    });

    return results;
  }

  /**
   * 面談予約の統計情報を取得
   */
  static async getStatistics(startDate: Date, endDate: Date, department?: string) {
    const where: Prisma.InterviewReservationWhereInput = {
      scheduledDate: {
        gte: startDate,
        lte: endDate
      }
    };

    if (department) {
      where.department = department;
    }

    // 集計クエリ
    const [total, byStatus, byType, bySource] = await Promise.all([
      // 総数
      prisma.interviewReservation.count({ where }),
      
      // ステータス別
      prisma.interviewReservation.groupBy({
        by: ['status'],
        where,
        _count: true
      }),
      
      // タイプ別
      prisma.interviewReservation.groupBy({
        by: ['type'],
        where,
        _count: true
      }),
      
      // ソース別
      prisma.interviewReservation.groupBy({
        by: ['source'],
        where,
        _count: true
      })
    ]);

    return {
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as Record<string, number>),
      bySource: bySource.reduce((acc, item) => {
        acc[item.source] = item._count;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  /**
   * 重複チェック
   */
  static async checkDuplicate(staffId: string, scheduledDate: Date, scheduledTime: string) {
    const existing = await prisma.interviewReservation.findFirst({
      where: {
        staffId,
        scheduledDate,
        scheduledTime,
        status: {
          notIn: [ReservationStatus.CANCELLED]
        }
      }
    });

    return !!existing;
  }

  /**
   * 通知をキューに追加
   */
  static async addNotification(
    reservationId: string,
    recipientId: string,
    type: NotificationType,
    channel: NotificationChannel,
    scheduledAt: Date
  ) {
    return await prisma.interviewNotificationQueue.create({
      data: {
        reservationId,
        recipientId,
        notificationType: type,
        channel,
        scheduledAt
      }
    });
  }
}