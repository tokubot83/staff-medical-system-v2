import { NextResponse } from 'next/server'

/**
 * 面談システムバージョン情報API
 * GET /api/interview-system-versions
 */
export async function GET() {
  try {
    // システムバージョン情報を返す
    const versionInfo = {
      success: true,
      data: {
        version: '1.0.0',
        buildDate: new Date().toISOString(),
        features: [
          'master-data-management',
          'interview-tracking',
          'evaluation-system',
          'training-management',
          'alert-system'
        ],
        apiVersion: 'v1'
      }
    }

    return NextResponse.json(versionInfo)
  } catch (error) {
    console.error('Failed to fetch system version:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch system version'
      },
      { status: 500 }
    )
  }
}
