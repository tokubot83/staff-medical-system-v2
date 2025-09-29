/**
 * 健康診断データ 個別操作API
 * Created: 2025-09-29
 */

import { NextRequest, NextResponse } from 'next/server';
import { healthCheckupService } from '@/services/health/healthCheckupService';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET: 個別健診データ取得
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    const result = await healthCheckupService.findById(id);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: '健診データが見つかりません'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get health checkup',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT: 健診データ更新
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();

    const result = await healthCheckupService.update(id, body);

    return NextResponse.json({
      success: true,
      data: result,
      message: '健診データを更新しました'
    });

  } catch (error) {
    console.error('Update error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update health checkup',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 健診データ削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    await healthCheckupService.delete(id);

    return NextResponse.json({
      success: true,
      message: '健診データを削除しました'
    });

  } catch (error) {
    console.error('Delete error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete health checkup',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}