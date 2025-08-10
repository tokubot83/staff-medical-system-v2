import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_FILE_PATH = path.join(process.cwd(), 'logs', 'voicedrive-integration.log');

export async function GET(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const filter = searchParams.get('filter') || '';
    
    // ログファイルが存在しない場合
    if (!fs.existsSync(LOG_FILE_PATH)) {
      return NextResponse.json({
        success: true,
        logs: [],
        message: 'No logs available yet'
      });
    }
    
    // ログファイルを読み込み
    const logContent = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
    const logLines = logContent.split('\n').filter(line => line.trim());
    
    // JSONパースしてフィルタリング
    let logs = logLines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(log => log !== null);
    
    // フィルタが指定されている場合
    if (filter) {
      logs = logs.filter(log => 
        JSON.stringify(log).toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    // 最新のログから指定件数取得
    const recentLogs = logs.slice(-limit).reverse();
    
    // 統計情報を計算
    const stats = {
      totalRequests: logs.length,
      successfulRequests: logs.filter(l => l.response?.success === true).length,
      failedRequests: logs.filter(l => l.response?.success === false).length,
      byInterviewType: logs.reduce((acc, log) => {
        const type = log.request?.interviewType;
        if (type) {
          acc[type] = (acc[type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      byMethod: logs.reduce((acc, log) => {
        acc[log.method] = (acc[log.method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return NextResponse.json({
      success: true,
      logs: recentLogs,
      stats,
      totalLogs: logs.length,
      showing: recentLogs.length
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to read logs',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}