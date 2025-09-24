import { NextRequest, NextResponse } from 'next/server';

// ケース管理API
// 一覧取得、詳細取得、更新処理

interface ComplianceCase {
  id: string;
  voicedriveReportId: string;
  anonymousId: string;
  category: string;
  subcategory?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'received' | 'triaging' | 'investigating' | 'escalated' | 'resolved' | 'closed';
  assignedTo?: {
    name: string;
    role: string;
    department: string;
  };
  createdAt: string;
  updatedAt: string;
  summary: string;
  disclosureLevel: 'full_anonymous' | 'conditional' | 'disclosed';
  incident: {
    description: string;
    occurredAt?: string;
    location?: string;
    witnessCount?: number;
    evidenceCount?: number;
  };
  investigation?: {
    findings?: string;
    recommendedAction?: string;
    committeeReferred?: boolean;
  };
}

// ダミーデータ（実際はデータベースから取得）
const mockCases: ComplianceCase[] = [
  {
    id: 'MED-2025-0001',
    voicedriveReportId: 'VD-2025-1234',
    anonymousId: 'ANON-5678',
    category: 'ハラスメント',
    subcategory: 'パワーハラスメント',
    severity: 'critical',
    status: 'investigating',
    assignedTo: {
      name: '竹内看護部長',
      role: '看護部長',
      department: '看護部'
    },
    createdAt: '2025-09-24T10:30:00Z',
    updatedAt: '2025-09-24T11:00:00Z',
    summary: 'パワーハラスメントに関する重大な通報',
    disclosureLevel: 'conditional',
    incident: {
      description: '上司による継続的な人格否定的発言および業務上不必要な叱責',
      occurredAt: '2025-09-20',
      location: '病棟A',
      witnessCount: 3,
      evidenceCount: 2
    },
    investigation: {
      findings: '初期ヒアリングを実施。複数の証言を確認',
      recommendedAction: 'ハラスメント対策委員会への報告',
      committeeReferred: false
    }
  },
  {
    id: 'MED-2025-0002',
    voicedriveReportId: 'VD-2025-1235',
    anonymousId: 'ANON-5679',
    category: '診療報酬不正',
    severity: 'high',
    status: 'triaging',
    assignedTo: {
      name: '竹迫事務長',
      role: '事務長',
      department: '事務部'
    },
    createdAt: '2025-09-24T09:15:00Z',
    updatedAt: '2025-09-24T09:30:00Z',
    summary: '診療報酬請求に関する不適切な処理の疑い',
    disclosureLevel: 'full_anonymous',
    incident: {
      description: '診療報酬の不適切な請求処理が行われている疑い',
      occurredAt: '2025-09-18',
      location: '医事課',
      witnessCount: 0,
      evidenceCount: 1
    }
  },
  {
    id: 'MED-2025-0003',
    voicedriveReportId: 'VD-2025-1236',
    anonymousId: 'ANON-5680',
    category: '労働条件',
    severity: 'medium',
    status: 'investigating',
    assignedTo: {
      name: '法人人事部',
      role: '人事担当',
      department: '人事部'
    },
    createdAt: '2025-09-24T08:45:00Z',
    updatedAt: '2025-09-24T10:00:00Z',
    summary: '時間外労働に関する労働基準法違反の疑い',
    disclosureLevel: 'full_anonymous',
    incident: {
      description: '恒常的な長時間労働と適切な休憩時間の未確保',
      occurredAt: '2025-09',
      location: '複数部署',
      witnessCount: 5,
      evidenceCount: 3
    }
  }
];

// ケース一覧取得
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const severity = searchParams.get('severity');
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    // フィルタリング
    let filteredCases = [...mockCases];

    if (status) {
      filteredCases = filteredCases.filter(c => c.status === status);
    }
    if (severity) {
      filteredCases = filteredCases.filter(c => c.severity === severity);
    }
    if (category) {
      filteredCases = filteredCases.filter(c => c.category === category);
    }

    // ページネーション
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCases = filteredCases.slice(startIndex, endIndex);

    // 機密情報のマスキング（権限に応じて）
    const maskedCases = paginatedCases.map(c => ({
      ...c,
      incident: {
        ...c.incident,
        description: c.disclosureLevel === 'full_anonymous'
          ? '[詳細は権限により制限されています]'
          : c.incident.description
      }
    }));

    return NextResponse.json({
      success: true,
      data: maskedCases,
      pagination: {
        page,
        limit,
        total: filteredCases.length,
        totalPages: Math.ceil(filteredCases.length / limit)
      },
      summary: {
        total: filteredCases.length,
        bySeverity: {
          critical: filteredCases.filter(c => c.severity === 'critical').length,
          high: filteredCases.filter(c => c.severity === 'high').length,
          medium: filteredCases.filter(c => c.severity === 'medium').length,
          low: filteredCases.filter(c => c.severity === 'low').length
        },
        byStatus: {
          received: filteredCases.filter(c => c.status === 'received').length,
          triaging: filteredCases.filter(c => c.status === 'triaging').length,
          investigating: filteredCases.filter(c => c.status === 'investigating').length,
          escalated: filteredCases.filter(c => c.status === 'escalated').length,
          resolved: filteredCases.filter(c => c.status === 'resolved').length,
          closed: filteredCases.filter(c => c.status === 'closed').length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch cases'
        }
      },
      { status: 500 }
    );
  }
}

// ケース作成/更新
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, caseId, updates } = body;

    if (action === 'update' && caseId) {
      // ケース更新処理
      const caseIndex = mockCases.findIndex(c => c.id === caseId);

      if (caseIndex === -1) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'CASE_NOT_FOUND',
              message: 'Case not found'
            }
          },
          { status: 404 }
        );
      }

      // 更新処理（実際はDBで更新）
      const updatedCase = {
        ...mockCases[caseIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // 監査ログ記録
      await recordAuditLog('CASE_UPDATED', {
        caseId,
        updates,
        updatedBy: 'current_user' // 実際は認証情報から取得
      });

      return NextResponse.json({
        success: true,
        data: updatedCase,
        message: 'Case updated successfully'
      });
    }

    // 新規ケース作成（VoiceDrive以外からの通報用）
    if (action === 'create') {
      const newCase: ComplianceCase = {
        id: `MED-${new Date().getFullYear()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        voicedriveReportId: body.voicedriveReportId || '',
        anonymousId: `ANON-${Math.random().toString(36).substring(7)}`,
        category: body.category,
        subcategory: body.subcategory,
        severity: body.severity || 'medium',
        status: 'received',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        summary: body.summary,
        disclosureLevel: body.disclosureLevel || 'full_anonymous',
        incident: {
          description: body.description,
          occurredAt: body.occurredAt,
          location: body.location,
          witnessCount: body.witnessCount || 0,
          evidenceCount: body.evidenceCount || 0
        }
      };

      // 監査ログ記録
      await recordAuditLog('CASE_CREATED', {
        caseId: newCase.id,
        category: newCase.category,
        severity: newCase.severity
      });

      return NextResponse.json({
        success: true,
        data: newCase,
        message: 'Case created successfully'
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_ACTION',
          message: 'Invalid action specified'
        }
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing case:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PROCESSING_ERROR',
          message: 'Failed to process case'
        }
      },
      { status: 500 }
    );
  }
}

// 監査ログ記録
async function recordAuditLog(action: string, data: any): Promise<void> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    data,
    user: 'system', // 実際は認証情報から取得
    ipAddress: '127.0.0.1' // 実際はリクエストから取得
  };

  console.log('Audit log:', logEntry);
  // 実際はデータベースに保存
}