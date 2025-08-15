import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  AppealRecord,
  AppealStatus,
  AppealAction,
  AppealLog,
  AppealResponse
} from '@/mcp-shared/interfaces/appeal.interface';

// ログ記録関数
function logRequest(
  method: string,
  action: AppealAction,
  appealId: string,
  response: any,
  userId?: string
) {
  const timestamp = new Date().toISOString();
  const logEntry: AppealLog = {
    timestamp,
    appealId,
    action,
    userId: userId || 'system',
    userRole: 'system',
    details: {
      method,
      endpoint: `/api/v1/appeals/status/${appealId}`,
      response
    }
  };

  const LOG_FILE_PATH = path.join(process.cwd(), 'logs', 'appeal-integration.log');
  const logDir = path.dirname(LOG_FILE_PATH);
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logLine = JSON.stringify(logEntry) + '\n';
  fs.appendFileSync(LOG_FILE_PATH, logLine);

  console.log(`[${timestamp}] Appeal Status API:`, {
    method,
    action,
    appealId
  });
}

// MCPフォルダから異議申し立てを検索
function findAppealInMcp(appealId: string): AppealRecord | null {
  const folders = ['pending', 'in-progress', 'resolved'];
  
  for (const folder of folders) {
    const folderPath = path.join(process.cwd(), 'mcp-shared', 'appeals', folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        if (file.includes(appealId) && file.endsWith('.json')) {
          const filePath = path.join(folderPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(content) as AppealRecord;
        }
      }
    }
  }
  
  return null;
}

// 異議申し立てステータスの更新
function updateAppealStatus(
  appealId: string,
  newStatus: AppealStatus,
  additionalData?: any
): boolean {
  const folders = ['pending', 'in-progress', 'resolved'];
  
  for (const folder of folders) {
    const folderPath = path.join(process.cwd(), 'mcp-shared', 'appeals', folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        if (file.includes(appealId) && file.endsWith('.json')) {
          const sourcePath = path.join(folderPath, file);
          const content = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
          
          // ステータスと追加データを更新
          content.status = newStatus;
          content.updatedAt = new Date();
          if (additionalData) {
            Object.assign(content, additionalData);
          }
          
          // ステータスに応じて適切なフォルダに移動
          let targetFolder = folder;
          if (newStatus === AppealStatus.RECEIVED || newStatus === AppealStatus.ADDITIONAL_INFO) {
            targetFolder = 'pending';
          } else if (newStatus === AppealStatus.UNDER_REVIEW) {
            targetFolder = 'in-progress';
          } else if ([AppealStatus.RESOLVED, AppealStatus.WITHDRAWN, AppealStatus.REJECTED].includes(newStatus)) {
            targetFolder = 'resolved';
          }
          
          const targetFolderPath = path.join(process.cwd(), 'mcp-shared', 'appeals', targetFolder);
          if (!fs.existsSync(targetFolderPath)) {
            fs.mkdirSync(targetFolderPath, { recursive: true });
          }
          
          const targetPath = path.join(targetFolderPath, file);
          
          // ファイルを移動（同じフォルダの場合は上書き）
          if (sourcePath !== targetPath) {
            fs.writeFileSync(targetPath, JSON.stringify(content, null, 2));
            fs.unlinkSync(sourcePath);
          } else {
            fs.writeFileSync(sourcePath, JSON.stringify(content, null, 2));
          }
          
          return true;
        }
      }
    }
  }
  
  return false;
}

// GET: 異議申し立て状況の取得
export async function GET(
  request: NextRequest,
  { params }: { params: { appealId: string } }
) {
  try {
    const appealId = params.appealId;
    
    if (!appealId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E001',
          message: 'appealId is required'
        }
      }, { status: 400 });
    }
    
    // MCPフォルダから異議申し立てを検索
    const appeal = findAppealInMcp(appealId);
    
    if (!appeal) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E404',
          message: 'Appeal not found'
        }
      }, { status: 404 });
    }
    
    // 成功レスポンス
    const response = {
      success: true,
      data: {
        appealId: appeal.appealId,
        status: appeal.status,
        employeeId: appeal.employeeId,
        employeeName: appeal.employeeName,
        evaluationPeriod: appeal.evaluationPeriod,
        appealCategory: appeal.appealCategory,
        appealReason: appeal.appealReason,
        originalScore: appeal.originalScore,
        requestedScore: appeal.requestedScore,
        finalScore: appeal.finalScore,
        createdAt: appeal.createdAt,
        updatedAt: appeal.updatedAt,
        decision: appeal.decision,
        reviewerComments: appeal.reviewerComments,
        communicationLog: appeal.communicationLog
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: `REQ-${Date.now()}`,
        version: '1.0.0'
      }
    };
    
    logRequest('GET', AppealAction.COMMENT, appealId, response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Appeal status fetch error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'E500',
        message: 'Failed to fetch appeal status',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

// PUT: 異議申し立てステータスの更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { appealId: string } }
) {
  try {
    const appealId = params.appealId;
    const body = await request.json();
    
    if (!appealId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E001',
          message: 'appealId is required'
        }
      }, { status: 400 });
    }
    
    if (!body.status) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E001',
          message: 'status is required'
        }
      }, { status: 400 });
    }
    
    // ステータスの妥当性チェック
    const validStatuses = Object.values(AppealStatus);
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E001',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        }
      }, { status: 400 });
    }
    
    // ステータスを更新
    const updated = updateAppealStatus(appealId, body.status, body.additionalData);
    
    if (!updated) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E404',
          message: 'Appeal not found'
        }
      }, { status: 404 });
    }
    
    // アクションを判定
    let action: AppealAction;
    switch (body.status) {
      case AppealStatus.UNDER_REVIEW:
        action = AppealAction.START_REVIEW;
        break;
      case AppealStatus.ADDITIONAL_INFO:
        action = AppealAction.REQUEST_INFO;
        break;
      case AppealStatus.RESOLVED:
        action = body.additionalData?.decision?.outcome === 'approved' 
          ? AppealAction.APPROVE 
          : AppealAction.REJECT;
        break;
      case AppealStatus.WITHDRAWN:
        action = AppealAction.WITHDRAW;
        break;
      default:
        action = AppealAction.COMMENT;
    }
    
    const response: AppealResponse = {
      success: true,
      appealId,
      message: `ステータスを${body.status}に更新しました`,
      details: {
        status: body.status,
        processedAt: new Date().toISOString()
      }
    };
    
    logRequest('PUT', action, appealId, response, body.userId);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Appeal status update error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'E500',
        message: 'Failed to update appeal status',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

// POST: 異議申し立てへのコメント追加
export async function POST(
  request: NextRequest,
  { params }: { params: { appealId: string } }
) {
  try {
    const appealId = params.appealId;
    const body = await request.json();
    
    if (!appealId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E001',
          message: 'appealId is required'
        }
      }, { status: 400 });
    }
    
    if (!body.message) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E001',
          message: 'message is required'
        }
      }, { status: 400 });
    }
    
    // 異議申し立てを検索
    const appeal = findAppealInMcp(appealId);
    
    if (!appeal) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'E404',
          message: 'Appeal not found'
        }
      }, { status: 404 });
    }
    
    // コメントを追加
    const newComment = {
      id: `COM-${Date.now()}`,
      timestamp: new Date(),
      type: body.type || 'response',
      from: body.from || 'system',
      to: body.to || appeal.employeeId,
      message: body.message,
      attachments: body.attachments
    };
    
    const updatedCommunicationLog = [
      ...(appeal.communicationLog || []),
      newComment
    ];
    
    // 更新を保存
    updateAppealStatus(appealId, appeal.status, {
      communicationLog: updatedCommunicationLog,
      reviewerComments: body.isReviewerComment ? body.message : appeal.reviewerComments
    });
    
    const response: AppealResponse = {
      success: true,
      appealId,
      message: 'コメントを追加しました',
      details: {
        status: appeal.status,
        processedAt: new Date().toISOString()
      }
    };
    
    logRequest('POST', AppealAction.COMMENT, appealId, response, body.from);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Appeal comment error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'E500',
        message: 'Failed to add comment',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}
