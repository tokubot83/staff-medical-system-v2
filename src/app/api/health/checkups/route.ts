/**
 * 健康診断データ CRUD API
 * Created: 2025-09-29
 */

import { NextRequest, NextResponse } from 'next/server';
import { healthCheckupService } from '@/services/health/healthCheckupService';
import { z } from 'zod';

// 検索パラメータのスキーマ
const SearchParamsSchema = z.object({
  staffId: z.string().optional(),
  department: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  overallResult: z.string().optional(),
  reexaminationRequired: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.enum(['date', 'name', 'result']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

/**
 * GET: 健診データ検索・一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // パラメータ取得
    const params = {
      staffId: searchParams.get('staffId') || undefined,
      department: searchParams.get('department') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      overallResult: searchParams.get('overallResult') || undefined,
      reexaminationRequired: searchParams.get('reexaminationRequired') || undefined,
      page: searchParams.get('page') || '1',
      pageSize: searchParams.get('pageSize') || '20',
      sortBy: searchParams.get('sortBy') || 'date',
      sortOrder: searchParams.get('sortOrder') || 'desc'
    };

    // バリデーション
    const validatedParams = SearchParamsSchema.parse(params);

    // 検索実行
    const result = await healthCheckupService.search({
      staffId: validatedParams.staffId,
      department: validatedParams.department,
      dateFrom: validatedParams.dateFrom ? new Date(validatedParams.dateFrom) : undefined,
      dateTo: validatedParams.dateTo ? new Date(validatedParams.dateTo) : undefined,
      overallResult: validatedParams.overallResult,
      reexaminationRequired: validatedParams.reexaminationRequired === 'true',
      page: parseInt(validatedParams.page || '1'),
      pageSize: parseInt(validatedParams.pageSize || '20'),
      sortBy: validatedParams.sortBy as any,
      sortOrder: validatedParams.sortOrder as any
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages
      }
    });

  } catch (error) {
    console.error('Search error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid parameters',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to search health checkups',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST: 新規健診データ作成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 基本データと詳細データを分離
    const { details, ...mainData } = body;

    // 作成実行
    const result = await healthCheckupService.create(
      mainData,
      details
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: '健診データを作成しました'
    }, { status: 201 });

  } catch (error) {
    console.error('Create error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create health checkup',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}