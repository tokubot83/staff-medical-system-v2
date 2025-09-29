/**
 * 健康診断データ CSVインポートAPI
 * Created: 2025-09-29
 */

import { NextRequest, NextResponse } from 'next/server';
import { csvImportService } from '@/services/health/csvImportService';
import { z } from 'zod';

// リクエストのバリデーション
const ImportRequestSchema = z.object({
  csvContent: z.string().min(1, 'CSVデータが必要です'),
  importedBy: z.string().default('system')
});

export async function POST(request: NextRequest) {
  try {
    // 認証チェック（将来的に実装）
    // const session = await getServerSession();
    // if (!session || !hasPermission(session.user, 'health.import')) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // リクエストボディの取得
    const body = await request.json();

    // バリデーション
    const validatedData = ImportRequestSchema.parse(body);

    console.log('📥 Starting CSV import...');

    // インポート実行
    const result = await csvImportService.importHealthCheckupCsv(
      validatedData.csvContent,
      validatedData.importedBy
    );

    // ログ出力
    console.log(`✅ Import completed:
      - Imported: ${result.imported}
      - Failed: ${result.failed}
      - Success: ${result.success}
    `);

    // エラーがある場合は詳細をログに記録
    if (result.errors.length > 0) {
      console.error('Import errors:', result.errors);
    }

    // レスポンス
    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `${result.imported}件のデータをインポートしました`
        : `インポート中にエラーが発生しました`,
      imported: result.imported,
      failed: result.failed,
      errors: result.errors
    }, {
      status: result.success ? 200 : 207 // 207 = Multi-Status (部分的成功)
    });

  } catch (error) {
    console.error('CSV import error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'バリデーションエラー',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'インポート処理中にエラーが発生しました',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// CSVファイルアップロード用エンドポイント
export async function PUT(request: NextRequest) {
  try {
    // FormDataからファイルを取得
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      );
    }

    // ファイルタイプチェック
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'CSVファイルのみアップロード可能です' },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズは10MB以下にしてください' },
        { status: 400 }
      );
    }

    // ファイルを文字列に変換
    const csvContent = await file.text();

    // インポート実行
    const result = await csvImportService.importHealthCheckupCsv(
      csvContent,
      'file_upload'
    );

    return NextResponse.json({
      success: result.success,
      message: `ファイル "${file.name}" のインポートが完了しました`,
      imported: result.imported,
      failed: result.failed,
      errors: result.errors
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'ファイルアップロード中にエラーが発生しました',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}