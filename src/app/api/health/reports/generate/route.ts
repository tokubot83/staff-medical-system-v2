import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  generateMonthlyHealthReport,
  exportReportToMarkdown,
  type HealthReport
} from '@/lib/health/report-generator';
import {
  assessOverallHealthRisk,
  type HealthData
} from '@/lib/health/risk-assessment';

/**
 * 健康レポート自動生成・送信API
 */

// MCP共有フォルダのパス
const MCP_SHARED_PATH = path.join(process.cwd(), 'mcp-shared');
const REPORTS_PATH = path.join(MCP_SHARED_PATH, 'reports', 'health');
const SCHEDULED_PATH = path.join(MCP_SHARED_PATH, 'scheduled');

// ディレクトリの初期化
function ensureDirectories() {
  [REPORTS_PATH, SCHEDULED_PATH].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// レポートの保存
function saveReport(report: HealthReport): string {
  ensureDirectories();

  const fileName = `${report.reportId}.json`;
  const filePath = path.join(REPORTS_PATH, fileName);

  // JSONフォーマットで保存
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

  // Markdownフォーマットでも保存
  const markdownContent = exportReportToMarkdown(report);
  const markdownPath = path.join(REPORTS_PATH, `${report.reportId}.md`);
  fs.writeFileSync(markdownPath, markdownContent);

  // VoiceDrive用のサマリー更新
  updateVoiceDriveSummary(report);

  return report.reportId;
}

// VoiceDrive用サマリーの更新
function updateVoiceDriveSummary(report: HealthReport) {
  const summaryPath = path.join(MCP_SHARED_PATH, 'docs', 'health-reports-latest.md');
  const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  const summaryContent = `# 最新健康レポート - ${timestamp}

## レポート情報
- **レポートID**: ${report.reportId}
- **タイプ**: ${report.type === 'monthly' ? '月次レポート' :
                 report.type === 'quarterly' ? '四半期レポート' :
                 report.type === 'annual' ? '年次レポート' : '緊急レポート'}
- **職員ID**: ${report.staffInfo.staffId}
- **部署**: ${report.staffInfo.department}

## 健康状態サマリー
- **健康スコア**: ${report.summary.overallHealthScore}/100点
- **リスクレベル**: ${report.summary.riskLevel}

## 主な所見
${report.summary.keyFindings.map(f => `- ${f}`).join('\n')}

## 優先対応事項
${report.nextActions.slice(0, 3).map((action, i) => `${i + 1}. ${action}`).join('\n')}

## 詳細レポート
- [JSONファイル](./reports/health/${report.reportId}.json)
- [Markdownファイル](./reports/health/${report.reportId}.md)

---
*このレポートは医療職員管理システムによって自動生成されました*
`;

  fs.writeFileSync(summaryPath, summaryContent);
}

// スケジュール設定の保存
function saveScheduleConfig(config: any) {
  ensureDirectories();

  const schedulePath = path.join(SCHEDULED_PATH, 'health-reports-schedule.json');
  let schedules = [];

  if (fs.existsSync(schedulePath)) {
    schedules = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'));
  }

  schedules.push({
    ...config,
    createdAt: new Date().toISOString(),
    status: 'active'
  });

  fs.writeFileSync(schedulePath, JSON.stringify(schedules, null, 2));
}

// POST: レポート生成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      staffId,
      staffInfo,
      healthData,
      previousHealthData,
      reportType = 'monthly',
      autoSend = false
    } = body;

    // バリデーション
    if (!staffId || !healthData) {
      return NextResponse.json(
        { error: 'Missing required fields: staffId and healthData' },
        { status: 400 }
      );
    }

    // 健康リスク評価の実行
    const assessment = assessOverallHealthRisk(healthData as HealthData);

    // レポートの生成
    const report = generateMonthlyHealthReport(
      staffInfo || { staffId, name: 'Unknown', department: 'Unknown', facility: 'Unknown' },
      healthData as HealthData,
      previousHealthData as HealthData | null,
      assessment
    );

    // レポートの保存
    const reportId = saveReport(report);

    // 自動送信が有効な場合
    if (autoSend) {
      await sendToVoiceDrive(report);
    }

    // レスポンス
    return NextResponse.json({
      success: true,
      reportId,
      report: {
        id: report.reportId,
        type: report.type,
        generatedAt: report.generatedAt,
        summary: report.summary,
        downloadUrls: {
          json: `/api/health/reports/${reportId}?format=json`,
          markdown: `/api/health/reports/${reportId}?format=markdown`
        }
      },
      message: 'Health report generated successfully'
    });
  } catch (error) {
    console.error('Failed to generate report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

// GET: レポート取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get('reportId');
    const format = searchParams.get('format') || 'json';

    if (!reportId) {
      // レポート一覧を返す
      const reports = listReports();
      return NextResponse.json({ reports });
    }

    // 特定のレポートを取得
    const reportPath = path.join(
      REPORTS_PATH,
      `${reportId}.${format === 'markdown' ? 'md' : 'json'}`
    );

    if (!fs.existsSync(reportPath)) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(reportPath, 'utf-8');

    if (format === 'markdown') {
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${reportId}.md"`
        }
      });
    }

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error('Failed to fetch report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

// PUT: スケジュール設定
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      staffId,
      frequency,  // 'daily', 'weekly', 'monthly', 'quarterly'
      time,       // HH:MM format
      dayOfWeek,  // 0-6 for weekly
      dayOfMonth, // 1-31 for monthly
      enabled = true
    } = body;

    // バリデーション
    if (!staffId || !frequency) {
      return NextResponse.json(
        { error: 'Missing required fields: staffId and frequency' },
        { status: 400 }
      );
    }

    // スケジュール設定の保存
    const scheduleConfig = {
      staffId,
      frequency,
      time: time || '09:00',
      dayOfWeek: dayOfWeek || 1,  // Monday
      dayOfMonth: dayOfMonth || 1,
      enabled,
      nextRun: calculateNextRun(frequency, time, dayOfWeek, dayOfMonth)
    };

    saveScheduleConfig(scheduleConfig);

    return NextResponse.json({
      success: true,
      message: 'Report schedule configured successfully',
      schedule: scheduleConfig
    });
  } catch (error) {
    console.error('Failed to configure schedule:', error);
    return NextResponse.json(
      { error: 'Failed to configure schedule' },
      { status: 500 }
    );
  }
}

// VoiceDriveへの送信
async function sendToVoiceDrive(report: HealthReport) {
  try {
    // 通知APIを使用して送信
    const notificationData = {
      type: 'health_report',
      staffId: report.staffInfo.staffId,
      timestamp: report.generatedAt,
      data: {
        reportId: report.reportId,
        reportType: report.type,
        summary: report.summary,
        priorityActions: report.nextActions.slice(0, 3)
      },
      metadata: {
        source: 'staff-medical-system',
        version: '1.0.0',
        priority: report.summary.riskLevel === 'very-high' ? 'urgent' :
                 report.summary.riskLevel === 'high' ? 'high' : 'medium'
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/health/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData)
    });

    if (!response.ok) {
      throw new Error('Failed to send notification to VoiceDrive');
    }
  } catch (error) {
    console.error('Failed to send to VoiceDrive:', error);
    throw error;
  }
}

// レポート一覧の取得
function listReports(): any[] {
  ensureDirectories();

  const files = fs.readdirSync(REPORTS_PATH);
  const reports = files
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const content = JSON.parse(fs.readFileSync(path.join(REPORTS_PATH, f), 'utf-8'));
      return {
        reportId: content.reportId,
        type: content.type,
        generatedAt: content.generatedAt,
        staffId: content.staffInfo.staffId,
        riskLevel: content.summary.riskLevel
      };
    })
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

  return reports;
}

// 次回実行時刻の計算
function calculateNextRun(
  frequency: string,
  time: string,
  dayOfWeek?: number,
  dayOfMonth?: number
): string {
  const now = new Date();
  const [hours, minutes] = (time || '09:00').split(':').map(Number);

  let nextRun = new Date();
  nextRun.setHours(hours, minutes, 0, 0);

  switch (frequency) {
    case 'daily':
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      break;

    case 'weekly':
      const targetDay = dayOfWeek || 1;
      const currentDay = now.getDay();
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd < 0 || (daysToAdd === 0 && nextRun <= now)) {
        daysToAdd += 7;
      }
      nextRun.setDate(nextRun.getDate() + daysToAdd);
      break;

    case 'monthly':
      const targetDate = dayOfMonth || 1;
      nextRun.setDate(targetDate);
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
      break;

    case 'quarterly':
      const currentMonth = now.getMonth();
      const quarterMonth = Math.floor(currentMonth / 3) * 3;
      nextRun.setMonth(quarterMonth);
      nextRun.setDate(dayOfMonth || 1);
      if (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 3);
      }
      break;
  }

  return nextRun.toISOString();
}