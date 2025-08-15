import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { 
  AppealRequest, 
  AppealResponse, 
  AppealStatus, 
  AppealCategory,
  AppealRecord,
  AppealLog,
  AppealAction 
} from '@/mcp-shared/interfaces/appeal.interface';

// ログファイルのパス
const LOG_FILE_PATH = path.join(process.cwd(), 'logs', 'appeal-integration.log');
const MCP_APPEAL_PATH = path.join(process.cwd(), 'mcp-shared', 'appeals', 'pending');

// ログ記録関数
function logRequest(
  method: string, 
  action: AppealAction, 
  body: any, 
  response: any,
  userId?: string
) {
  const timestamp = new Date().toISOString();
  const logEntry: AppealLog = {
    timestamp,
    appealId: response.appealId || 'N/A',
    action,
    userId: userId || body?.employeeId || 'system',
    userRole: 'employee',
    details: {
      method,
      endpoint: '/api/v1/appeals/submit',
      request: body,
      response,
      source: 'VoiceDrive SNS Integration'
    }
  };

  // ログディレクトリが存在しない場合は作成
  const logDir = path.dirname(LOG_FILE_PATH);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // ログファイルに追記
  const logLine = JSON.stringify(logEntry) + '\n';
  fs.appendFileSync(LOG_FILE_PATH, logLine);

  // コンソールにも出力（開発時のモニタリング用）
  console.log(`[${timestamp}] Appeal API Request:`, {
    method,
    action,
    category: body?.appealCategory,
    employee: body?.employeeName,
    appealId: response.appealId
  });
}

// MCP共有フォルダに保存
function saveToMcpFolder(appealRecord: AppealRecord) {
  // MCPフォルダが存在しない場合は作成
  if (!fs.existsSync(MCP_APPEAL_PATH)) {
    fs.mkdirSync(MCP_APPEAL_PATH, { recursive: true });
  }

  // JSONファイルとして保存
  const fileName = `${appealRecord.appealId}_${appealRecord.employeeId}.json`;
  const filePath = path.join(MCP_APPEAL_PATH, fileName);
  
  fs.writeFileSync(filePath, JSON.stringify(appealRecord, null, 2));
  
  // 同期ステータスファイルの更新
  const syncStatusPath = path.join(process.cwd(), 'mcp-shared', 'sync-status.json');
  let syncStatus = { lastSync: new Date().toISOString(), appeals: {} };
  
  if (fs.existsSync(syncStatusPath)) {
    syncStatus = JSON.parse(fs.readFileSync(syncStatusPath, 'utf-8'));
  }
  
  syncStatus.appeals = {
    ...syncStatus.appeals,
    lastUpdate: new Date().toISOString(),
    pendingCount: fs.readdirSync(MCP_APPEAL_PATH).length
  };
  
  fs.writeFileSync(syncStatusPath, JSON.stringify(syncStatus, null, 2));
}

// バリデーション関数
function validateAppealRequest(body: any): string[] {
  const errors: string[] = [];
  
  // 必須項目チェック
  if (!body.employeeId) errors.push('employeeId is required');
  if (!body.employeeName) errors.push('employeeName is required');
  if (!body.evaluationPeriod) errors.push('evaluationPeriod is required');
  if (!body.appealCategory) errors.push('appealCategory is required');
  if (!body.appealReason) errors.push('appealReason is required');
  
  // カテゴリーの妥当性チェック
  const validCategories = Object.values(AppealCategory);
  if (body.appealCategory && !validCategories.includes(body.appealCategory)) {
    errors.push(`Invalid appealCategory. Must be one of: ${validCategories.join(', ')}`);
  }
  
  // 理由の最小文字数チェック（100文字以上）
  if (body.appealReason && body.appealReason.length < 100) {
    errors.push('appealReason must be at least 100 characters');
  }
  
  // スコアの妥当性チェック
  if (body.originalScore !== undefined) {
    if (body.originalScore < 0 || body.originalScore > 100) {
      errors.push('originalScore must be between 0 and 100');
    }
  }
  
  if (body.requestedScore !== undefined) {
    if (body.requestedScore < 0 || body.requestedScore > 100) {
      errors.push('requestedScore must be between 0 and 100');
    }
  }
  
  // 申し立て期限チェック（開示後2週間）
  // 実際の実装では、評価開示日をDBから取得して検証する
  
  return errors;
}

// 異議申し立てIDの生成
function generateAppealId(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  const timestamp = Date.now().toString(36).substr(-4).toUpperCase();
  return `AP-${year}-${random}-${timestamp}`;
}

// 予想応答日の計算（3週間後）
function calculateExpectedResponseDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 21); // 3週間後
  return date.toISOString().split('T')[0];
}

// POST: 異議申し立て受付
export async function POST(request: NextRequest) {
  try {
    const body: AppealRequest = await request.json();
    
    // バリデーション
    const errors = validateAppealRequest(body);
    
    if (errors.length > 0) {
      const errorResponse: AppealResponse = {
        success: false,
        appealId: '',
        message: 'Validation failed',
        error: {
          code: 'E001',
          message: 'Validation errors',
          details: errors
        }
      };
      logRequest('POST', AppealAction.SUBMIT, body, errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // 異議申し立てレコードの作成
    const appealId = generateAppealId();
    const now = new Date();
    
    const appealRecord: AppealRecord = {
      appealId,
      employeeId: body.employeeId,
      employeeName: body.employeeName,
      departmentId: body.departmentId,
      evaluationPeriod: body.evaluationPeriod,
      appealCategory: body.appealCategory as AppealCategory,
      appealReason: body.appealReason,
      originalScore: body.originalScore,
      requestedScore: body.requestedScore,
      status: AppealStatus.RECEIVED,
      evidenceDocuments: body.evidenceDocuments,
      createdAt: now,
      updatedAt: now,
      submittedVia: 'voicedrive',
      communicationLog: [
        {
          id: `COM-${Date.now()}`,
          timestamp: now,
          type: 'request',
          from: body.employeeId,
          to: 'system',
          message: body.appealReason,
          attachments: body.evidenceDocuments
        }
      ]
    };
    
    // MCP共有フォルダに保存
    saveToMcpFolder(appealRecord);
    
    // 成功レスポンス
    const successResponse: AppealResponse = {
      success: true,
      appealId,
      message: '異議申し立てを受け付けました。3週間以内に回答いたします。',
      expectedResponseDate: calculateExpectedResponseDate(),
      details: {
        status: AppealStatus.RECEIVED,
        processedAt: now.toISOString(),
        priority: determineApppealPriority(body)
      }
    };
    
    logRequest('POST', AppealAction.RECEIVE, body, successResponse, body.employeeId);
    
    // 管理者への通知（実際の実装では通知サービスを呼び出す）
    notifyAdministrators(appealRecord);
    
    return NextResponse.json(successResponse);
    
  } catch (error) {
    console.error('Appeal submission error:', error);
    const errorResponse: AppealResponse = {
      success: false,
      appealId: '',
      message: 'Internal server error',
      error: {
        code: 'E500',
        message: 'Failed to process appeal request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    };
    logRequest('POST', AppealAction.SUBMIT, null, errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// GET: 異議申し立て状況確認
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appealId = searchParams.get('appealId');
    const employeeId = searchParams.get('employeeId');
    
    if (!appealId && !employeeId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E001',
          message: 'appealId or employeeId is required'
        }
      }, { status: 400 });
    }
    
    // 実際の実装では、DBから取得
    // ここではMCPフォルダから読み込むモック実装
    const appeals = readAppealsFromMcp(appealId, employeeId);
    
    return NextResponse.json({
      success: true,
      data: appeals,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: `REQ-${Date.now()}`,
        version: '1.0.0'
      }
    });
    
  } catch (error) {
    console.error('Appeal fetch error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'E500',
        message: 'Failed to fetch appeals',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

// PUT: 追加情報の提出
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appealId = searchParams.get('appealId');
    
    if (!appealId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E001',
          message: 'appealId is required'
        }
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    // 実際の実装では、DBを更新
    updateAppealInMcp(appealId, body);
    
    const response: AppealResponse = {
      success: true,
      appealId,
      message: '追加情報を受け付けました',
      details: {
        status: AppealStatus.UNDER_REVIEW,
        processedAt: new Date().toISOString()
      }
    };
    
    logRequest('PUT', AppealAction.PROVIDE_INFO, body, response, body.employeeId);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Appeal update error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'E500',
        message: 'Failed to update appeal',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

// DELETE: 異議申し立ての取り下げ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appealId = searchParams.get('appealId');
    const employeeId = searchParams.get('employeeId');
    
    if (!appealId || !employeeId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E001',
          message: 'appealId and employeeId are required'
        }
      }, { status: 400 });
    }
    
    // 実際の実装では、DBを更新
    withdrawAppealInMcp(appealId, employeeId);
    
    const response: AppealResponse = {
      success: true,
      appealId,
      message: '異議申し立てを取り下げました',
      details: {
        status: AppealStatus.WITHDRAWN,
        processedAt: new Date().toISOString()
      }
    };
    
    logRequest('DELETE', AppealAction.WITHDRAW, { appealId, employeeId }, response, employeeId);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Appeal withdrawal error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'E500',
        message: 'Failed to withdraw appeal',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

// ヘルパー関数：優先度の判定
function determineApppealPriority(request: AppealRequest): 'high' | 'medium' | 'low' {
  // スコア差が大きい場合は高優先度
  if (request.originalScore && request.requestedScore) {
    const diff = request.requestedScore - request.originalScore;
    if (diff >= 10) return 'high';
    if (diff >= 5) return 'medium';
  }
  
  // カテゴリーによる優先度
  if (request.appealCategory === AppealCategory.CALCULATION_ERROR) {
    return 'high';
  }
  
  return 'low';
}

// ヘルパー関数：管理者への通知
function notifyAdministrators(appeal: AppealRecord) {
  // 実際の実装では、メール送信サービスやプッシュ通知を実装
  console.log('Notifying administrators about new appeal:', appeal.appealId);
}

// ヘルパー関数：MCPフォルダから異議申し立てを読み込み
function readAppealsFromMcp(appealId?: string | null, employeeId?: string | null): AppealRecord[] {
  const appeals: AppealRecord[] = [];
  
  ['pending', 'in-progress', 'resolved'].forEach(folder => {
    const folderPath = path.join(process.cwd(), 'mcp-shared', 'appeals', folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const content = fs.readFileSync(path.join(folderPath, file), 'utf-8');
          const appeal = JSON.parse(content) as AppealRecord;
          
          if (appealId && appeal.appealId === appealId) {
            appeals.push(appeal);
          } else if (employeeId && appeal.employeeId === employeeId) {
            appeals.push(appeal);
          }
        }
      });
    }
  });
  
  return appeals;
}

// ヘルパー関数：MCPフォルダの異議申し立てを更新
function updateAppealInMcp(appealId: string, updates: any) {
  const folders = ['pending', 'in-progress', 'resolved'];
  
  for (const folder of folders) {
    const folderPath = path.join(process.cwd(), 'mcp-shared', 'appeals', folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        if (file.includes(appealId)) {
          const filePath = path.join(folderPath, file);
          const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const updated = { ...content, ...updates, updatedAt: new Date() };
          fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
          return;
        }
      }
    }
  }
}

// ヘルパー関数：異議申し立ての取り下げ
function withdrawAppealInMcp(appealId: string, employeeId: string) {
  const folders = ['pending', 'in-progress'];
  
  for (const folder of folders) {
    const folderPath = path.join(process.cwd(), 'mcp-shared', 'appeals', folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        if (file.includes(appealId) && file.includes(employeeId)) {
          const sourcePath = path.join(folderPath, file);
          const content = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
          
          // ステータスを更新
          content.status = AppealStatus.WITHDRAWN;
          content.updatedAt = new Date();
          
          // resolvedフォルダに移動
          const destFolder = path.join(process.cwd(), 'mcp-shared', 'appeals', 'resolved');
          if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
          }
          const destPath = path.join(destFolder, file);
          
          fs.writeFileSync(destPath, JSON.stringify(content, null, 2));
          fs.unlinkSync(sourcePath);
          return;
        }
      }
    }
  }
}
