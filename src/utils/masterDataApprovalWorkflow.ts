/**
 * マスターデータ 承認ワークフロー統合
 *
 * 機能:
 * - 重要なマスターデータ変更の承認フロー管理
 * - 申請・承認・却下のステータス管理
 * - 承認者設定・権限チェック
 * - 承認履歴の記録
 */

import { ChangeRecord, recordChange } from './masterDataVersionControl';

export interface ApprovalRequest {
  id: string;
  masterType: string;
  recordId: string;
  recordName: string;
  changeType: 'create' | 'update' | 'delete' | 'restore';
  beforeData: any | null;
  afterData: any | null;
  requestedBy: string;
  requestedAt: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvers: ApproverInfo[];
  currentApproverLevel: number;
  approvalHistory: ApprovalAction[];
  completedAt?: Date;
}

export interface ApproverInfo {
  level: number;
  approverId: string;
  approverName: string;
  approverRole: string;
  required: boolean;
}

export interface ApprovalAction {
  level: number;
  approverId: string;
  approverName: string;
  action: 'approve' | 'reject' | 'request_changes';
  actionAt: Date;
  comment?: string;
}

export interface ApprovalWorkflowConfig {
  masterType: string;
  requiresApproval: boolean;
  approvers: ApproverInfo[];
  autoApproveConditions?: {
    minAuthorityLevel?: number;
    excludeFields?: string[];
  };
}

/**
 * 承認が必要な変更かチェック
 */
export function requiresApproval(
  masterType: string,
  changeType: 'create' | 'update' | 'delete' | 'restore',
  beforeData: any | null,
  afterData: any | null,
  userId: string
): boolean {
  const config = getApprovalConfig(masterType);

  if (!config.requiresApproval) {
    return false;
  }

  // 削除は常に承認必須
  if (changeType === 'delete') {
    return true;
  }

  // 自動承認条件チェック
  if (config.autoApproveConditions) {
    const userAuthority = getUserAuthorityLevel(userId);

    if (
      config.autoApproveConditions.minAuthorityLevel &&
      userAuthority >= config.autoApproveConditions.minAuthorityLevel
    ) {
      // 除外フィールドのみの変更なら自動承認
      if (changeType === 'update' && config.autoApproveConditions.excludeFields) {
        const changedFields = Object.keys(afterData || {}).filter(
          key => JSON.stringify(beforeData?.[key]) !== JSON.stringify(afterData?.[key])
        );

        const nonExcludedChanges = changedFields.filter(
          field => !config.autoApproveConditions!.excludeFields!.includes(field)
        );

        if (nonExcludedChanges.length === 0) {
          return false; // 自動承認
        }
      }
    }
  }

  return true;
}

/**
 * 承認申請作成
 */
export function createApprovalRequest(
  masterType: string,
  recordId: string,
  recordName: string,
  changeType: 'create' | 'update' | 'delete' | 'restore',
  beforeData: any | null,
  afterData: any | null,
  requestedBy: string,
  reason: string
): ApprovalRequest {
  const config = getApprovalConfig(masterType);
  const requestId = `APR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const request: ApprovalRequest = {
    id: requestId,
    masterType,
    recordId,
    recordName,
    changeType,
    beforeData,
    afterData,
    requestedBy,
    requestedAt: new Date(),
    reason,
    status: 'pending',
    approvers: config.approvers,
    currentApproverLevel: 1,
    approvalHistory: []
  };

  // LocalStorageに保存
  saveApprovalRequest(request);

  return request;
}

/**
 * 承認実行
 */
export function approve(
  requestId: string,
  approverId: string,
  approverName: string,
  comment?: string
): ApprovalRequest {
  const request = getApprovalRequest(requestId);

  if (!request) {
    throw new Error('Approval request not found');
  }

  if (request.status !== 'pending') {
    throw new Error('Request is not in pending status');
  }

  // 現在の承認レベルの承認者か確認
  const currentApprover = request.approvers.find(
    a => a.level === request.currentApproverLevel && a.approverId === approverId
  );

  if (!currentApprover) {
    throw new Error('User is not authorized to approve at this level');
  }

  // 承認アクション記録
  request.approvalHistory.push({
    level: request.currentApproverLevel,
    approverId,
    approverName,
    action: 'approve',
    actionAt: new Date(),
    comment
  });

  // 次の承認レベルへ
  const nextLevel = request.currentApproverLevel + 1;
  const nextApprover = request.approvers.find(a => a.level === nextLevel && a.required);

  if (nextApprover) {
    // まだ次の承認者がいる
    request.currentApproverLevel = nextLevel;
  } else {
    // 全承認完了
    request.status = 'approved';
    request.completedAt = new Date();

    // 変更を実際に適用（変更履歴に記録）
    applyApprovedChange(request);
  }

  updateApprovalRequest(request);

  return request;
}

/**
 * 却下実行
 */
export function reject(
  requestId: string,
  approverId: string,
  approverName: string,
  comment: string
): ApprovalRequest {
  const request = getApprovalRequest(requestId);

  if (!request) {
    throw new Error('Approval request not found');
  }

  if (request.status !== 'pending') {
    throw new Error('Request is not in pending status');
  }

  // 承認者か確認
  const approver = request.approvers.find(a => a.approverId === approverId);

  if (!approver) {
    throw new Error('User is not authorized to reject');
  }

  // 却下アクション記録
  request.approvalHistory.push({
    level: request.currentApproverLevel,
    approverId,
    approverName,
    action: 'reject',
    actionAt: new Date(),
    comment
  });

  request.status = 'rejected';
  request.completedAt = new Date();

  updateApprovalRequest(request);

  return request;
}

/**
 * 変更依頼
 */
export function requestChanges(
  requestId: string,
  approverId: string,
  approverName: string,
  comment: string
): ApprovalRequest {
  const request = getApprovalRequest(requestId);

  if (!request) {
    throw new Error('Approval request not found');
  }

  if (request.status !== 'pending') {
    throw new Error('Request is not in pending status');
  }

  // 承認者か確認
  const approver = request.approvers.find(a => a.approverId === approverId);

  if (!approver) {
    throw new Error('User is not authorized to request changes');
  }

  // 変更依頼アクション記録
  request.approvalHistory.push({
    level: request.currentApproverLevel,
    approverId,
    approverName,
    action: 'request_changes',
    actionAt: new Date(),
    comment
  });

  updateApprovalRequest(request);

  return request;
}

/**
 * 申請取り消し
 */
export function cancelRequest(
  requestId: string,
  userId: string
): ApprovalRequest {
  const request = getApprovalRequest(requestId);

  if (!request) {
    throw new Error('Approval request not found');
  }

  if (request.requestedBy !== userId) {
    throw new Error('Only the requester can cancel the request');
  }

  if (request.status !== 'pending') {
    throw new Error('Can only cancel pending requests');
  }

  request.status = 'cancelled';
  request.completedAt = new Date();

  updateApprovalRequest(request);

  return request;
}

/**
 * 承認申請一覧取得
 */
export function getApprovalRequests(
  filters?: {
    masterType?: string;
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
    requestedBy?: string;
    approverId?: string;
    limit?: number;
    offset?: number;
  }
): { data: ApprovalRequest[]; total: number } {
  let requests = loadAllApprovalRequests();

  // フィルタリング
  if (filters?.masterType) {
    requests = requests.filter(r => r.masterType === filters.masterType);
  }
  if (filters?.status) {
    requests = requests.filter(r => r.status === filters.status);
  }
  if (filters?.requestedBy) {
    requests = requests.filter(r => r.requestedBy === filters.requestedBy);
  }
  if (filters?.approverId) {
    requests = requests.filter(r =>
      r.approvers.some(a => a.approverId === filters.approverId) &&
      r.status === 'pending'
    );
  }

  // ソート（新しい順）
  requests.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  const total = requests.length;
  const offset = filters?.offset || 0;
  const limit = filters?.limit || 50;
  const data = requests.slice(offset, offset + limit);

  return { data, total };
}

/**
 * 自分が承認待ちの申請一覧取得
 */
export function getPendingApprovals(
  approverId: string
): ApprovalRequest[] {
  const allRequests = loadAllApprovalRequests();

  return allRequests.filter(r => {
    if (r.status !== 'pending') return false;

    const currentApprover = r.approvers.find(
      a => a.level === r.currentApproverLevel && a.approverId === approverId
    );

    return !!currentApprover;
  });
}

/**
 * 承認済み変更の適用
 */
function applyApprovedChange(request: ApprovalRequest): void {
  const lastApprover = request.approvalHistory[request.approvalHistory.length - 1];

  recordChange(
    request.masterType,
    request.recordId,
    request.recordName,
    request.changeType,
    request.beforeData,
    request.afterData,
    request.requestedBy,
    `${request.reason} (承認者: ${lastApprover.approverName})`
  );
}

/**
 * 承認ワークフロー設定取得
 */
function getApprovalConfig(masterType: string): ApprovalWorkflowConfig {
  const configs: Record<string, ApprovalWorkflowConfig> = {
    facility: {
      masterType: 'facility',
      requiresApproval: true,
      approvers: [
        {
          level: 1,
          approverId: 'hr-manager',
          approverName: '人事部長',
          approverRole: 'HR Manager',
          required: true
        },
        {
          level: 2,
          approverId: 'director',
          approverName: '理事長',
          approverRole: 'Director',
          required: true
        }
      ],
      autoApproveConditions: {
        minAuthorityLevel: 15,
        excludeFields: ['description', 'displayOrder']
      }
    },
    department: {
      masterType: 'department',
      requiresApproval: true,
      approvers: [
        {
          level: 1,
          approverId: 'facility-manager',
          approverName: '施設長',
          approverRole: 'Facility Manager',
          required: true
        },
        {
          level: 2,
          approverId: 'hr-manager',
          approverName: '人事部長',
          approverRole: 'HR Manager',
          required: true
        }
      ]
    },
    profession: {
      masterType: 'profession',
      requiresApproval: true,
      approvers: [
        {
          level: 1,
          approverId: 'hr-manager',
          approverName: '人事部長',
          approverRole: 'HR Manager',
          required: true
        }
      ]
    },
    position: {
      masterType: 'position',
      requiresApproval: true,
      approvers: [
        {
          level: 1,
          approverId: 'hr-manager',
          approverName: '人事部長',
          approverRole: 'HR Manager',
          required: true
        },
        {
          level: 2,
          approverId: 'director',
          approverName: '理事長',
          approverRole: 'Director',
          required: true
        }
      ]
    },
    employmentType: {
      masterType: 'employmentType',
      requiresApproval: true,
      approvers: [
        {
          level: 1,
          approverId: 'hr-manager',
          approverName: '人事部長',
          approverRole: 'HR Manager',
          required: true
        }
      ]
    }
  };

  return configs[masterType] || {
    masterType,
    requiresApproval: false,
    approvers: []
  };
}

/**
 * ユーザー権限レベル取得（モック）
 */
function getUserAuthorityLevel(userId: string): number {
  const userLevels: Record<string, number> = {
    'director': 18,
    'hr-manager': 15,
    'facility-manager': 12,
    'department-head': 10,
    'admin-001': 15,
    'admin-002': 12,
    'admin-003': 10
  };

  return userLevels[userId] || 1;
}

/**
 * LocalStorage操作
 */
function saveApprovalRequest(request: ApprovalRequest): void {
  const key = 'masterDataApprovalRequests';
  const existing = loadAllApprovalRequests();
  existing.push(request);

  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

function updateApprovalRequest(request: ApprovalRequest): void {
  const key = 'masterDataApprovalRequests';
  const existing = loadAllApprovalRequests();
  const index = existing.findIndex(r => r.id === request.id);

  if (index >= 0) {
    existing[index] = request;

    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(existing));
    }
  }
}

function getApprovalRequest(requestId: string): ApprovalRequest | null {
  const requests = loadAllApprovalRequests();
  return requests.find(r => r.id === requestId) || null;
}

function loadAllApprovalRequests(): ApprovalRequest[] {
  const key = 'masterDataApprovalRequests';

  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse approval requests:', e);
        return [];
      }
    }
  }

  return [];
}

/**
 * 承認フロー可視化
 */
export function visualizeApprovalFlow(request: ApprovalRequest): string {
  const lines: string[] = [];

  lines.push(`承認フロー: ${request.recordName} (${request.changeType})`);
  lines.push(`申請者: ${request.requestedBy} (${new Date(request.requestedAt).toLocaleString('ja-JP')})`);
  lines.push(`理由: ${request.reason}`);
  lines.push('');

  request.approvers.forEach(approver => {
    const action = request.approvalHistory.find(h => h.level === approver.level);
    const isCurrent = request.currentApproverLevel === approver.level && request.status === 'pending';

    let status = '⏳ 待機中';
    if (action) {
      if (action.action === 'approve') status = '✅ 承認済み';
      else if (action.action === 'reject') status = '❌ 却下';
      else if (action.action === 'request_changes') status = '🔄 変更依頼';
    } else if (isCurrent) {
      status = '👉 承認待ち';
    }

    lines.push(`Level ${approver.level}: ${approver.approverName} (${approver.approverRole}) - ${status}`);

    if (action?.comment) {
      lines.push(`  コメント: ${action.comment}`);
    }
  });

  lines.push('');
  lines.push(`最終ステータス: ${request.status}`);

  return lines.join('\n');
}
