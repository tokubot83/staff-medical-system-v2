/**
 * マスターデータ 承認ワークフロー テスト
 */

import {
  requiresApproval,
  createApprovalRequest,
  approve,
  reject,
  requestChanges,
  cancelRequest,
  getApprovalRequests,
  getPendingApprovals,
  visualizeApprovalFlow,
  ApprovalRequest
} from '@/utils/masterDataApprovalWorkflow';

describe('マスターデータ 承認ワークフロー', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('requiresApproval - 承認必要性チェック', () => {
    it('削除は常に承認必須', () => {
      const result = requiresApproval(
        'facility',
        'delete',
        { id: 'FAC_001', name: '小原病院' },
        null,
        'admin-001'
      );

      expect(result).toBe(true);
    });

    it('権限レベルが高いユーザーの軽微な変更は自動承認', () => {
      const result = requiresApproval(
        'facility',
        'update',
        { id: 'FAC_001', name: '小原病院', description: '説明' },
        { id: 'FAC_001', name: '小原病院', description: '新説明' },
        'admin-001' // authority level 15
      );

      expect(result).toBe(false); // descriptionのみの変更なので自動承認
    });

    it('重要フィールドの変更は承認必須', () => {
      const result = requiresApproval(
        'facility',
        'update',
        { id: 'FAC_001', name: '小原病院', isActive: true },
        { id: 'FAC_001', name: '小原病院（更新）', isActive: false },
        'admin-001'
      );

      expect(result).toBe(true); // name変更があるので承認必須
    });
  });

  describe('createApprovalRequest - 承認申請作成', () => {
    it('承認申請を作成', () => {
      const request = createApprovalRequest(
        'facility',
        'FAC_001',
        '小原病院',
        'update',
        { id: 'FAC_001', name: '小原病院' },
        { id: 'FAC_001', name: '小原病院（更新）' },
        'admin-001',
        '名称変更'
      );

      expect(request.masterType).toBe('facility');
      expect(request.recordId).toBe('FAC_001');
      expect(request.status).toBe('pending');
      expect(request.currentApproverLevel).toBe(1);
      expect(request.approvers.length).toBeGreaterThan(0);
    });
  });

  describe('approve - 承認実行', () => {
    it('第1承認者が承認', () => {
      const request = createApprovalRequest(
        'facility',
        'FAC_001',
        '小原病院',
        'update',
        { id: 'FAC_001', name: '小原病院' },
        { id: 'FAC_001', name: '小原病院（更新）' },
        'admin-001',
        '名称変更'
      );

      const approved = approve(request.id, 'hr-manager', '人事部長', '承認します');

      expect(approved.approvalHistory.length).toBe(1);
      expect(approved.approvalHistory[0].action).toBe('approve');
      expect(approved.currentApproverLevel).toBe(2); // 次のレベルへ
      expect(approved.status).toBe('pending'); // まだ次の承認者がいる
    });

    it('最終承認者が承認すると完了', () => {
      const request = createApprovalRequest(
        'profession',
        'PROF_001',
        '理学療法士',
        'create',
        null,
        { id: 'PROF_001', name: '理学療法士' },
        'admin-001',
        '新規職種追加'
      );

      // professionは承認者1名のみ
      const approved = approve(request.id, 'hr-manager', '人事部長', '承認');

      expect(approved.status).toBe('approved');
      expect(approved.completedAt).toBeDefined();
    });

    it('権限のないユーザーは承認できない', () => {
      const request = createApprovalRequest(
        'facility',
        'FAC_001',
        '小原病院',
        'update',
        { id: 'FAC_001', name: '小原病院' },
        { id: 'FAC_001', name: '小原病院（更新）' },
        'admin-001',
        '名称変更'
      );

      expect(() => {
        approve(request.id, 'wrong-user', '無権限ユーザー');
      }).toThrow('not authorized');
    });
  });

  describe('reject - 却下実行', () => {
    it('承認者が却下', () => {
      const request = createApprovalRequest(
        'facility',
        'FAC_001',
        '小原病院',
        'delete',
        { id: 'FAC_001', name: '小原病院' },
        null,
        'admin-001',
        '施設閉鎖'
      );

      const rejected = reject(request.id, 'hr-manager', '人事部長', '却下理由');

      expect(rejected.status).toBe('rejected');
      expect(rejected.approvalHistory.length).toBe(1);
      expect(rejected.approvalHistory[0].action).toBe('reject');
      expect(rejected.completedAt).toBeDefined();
    });
  });

  describe('requestChanges - 変更依頼', () => {
    it('承認者が変更依頼', () => {
      const request = createApprovalRequest(
        'facility',
        'FAC_001',
        '小原病院',
        'update',
        { id: 'FAC_001', name: '小原病院' },
        { id: 'FAC_001', name: '小原病院（更新）' },
        'admin-001',
        '名称変更'
      );

      const updated = requestChanges(
        request.id,
        'hr-manager',
        '人事部長',
        '名称を再検討してください'
      );

      expect(updated.status).toBe('pending'); // まだpending
      expect(updated.approvalHistory.length).toBe(1);
      expect(updated.approvalHistory[0].action).toBe('request_changes');
    });
  });

  describe('cancelRequest - 申請取り消し', () => {
    it('申請者が申請を取り消し', () => {
      const request = createApprovalRequest(
        'facility',
        'FAC_001',
        '小原病院',
        'update',
        { id: 'FAC_001', name: '小原病院' },
        { id: 'FAC_001', name: '小原病院（更新）' },
        'admin-001',
        '名称変更'
      );

      const cancelled = cancelRequest(request.id, 'admin-001');

      expect(cancelled.status).toBe('cancelled');
      expect(cancelled.completedAt).toBeDefined();
    });

    it('申請者以外は取り消せない', () => {
      const request = createApprovalRequest(
        'facility',
        'FAC_001',
        '小原病院',
        'update',
        { id: 'FAC_001', name: '小原病院' },
        { id: 'FAC_001', name: '小原病院（更新）' },
        'admin-001',
        '名称変更'
      );

      expect(() => {
        cancelRequest(request.id, 'admin-002');
      }).toThrow('Only the requester can cancel');
    });
  });

  describe('getApprovalRequests - 承認申請一覧取得', () => {
    beforeEach(() => {
      createApprovalRequest('facility', 'FAC_001', '小原病院', 'update', {}, {}, 'admin-001', '理由1');
      createApprovalRequest('department', 'DEPT_001', '看護部', 'create', null, {}, 'admin-002', '理由2');
      createApprovalRequest('facility', 'FAC_002', '立神病院', 'delete', {}, null, 'admin-001', '理由3');
    });

    it('全申請取得', () => {
      const result = getApprovalRequests();

      expect(result.total).toBe(3);
      expect(result.data.length).toBe(3);
    });

    it('マスタータイプでフィルタ', () => {
      const result = getApprovalRequests({ masterType: 'facility' });

      expect(result.total).toBe(2);
      expect(result.data.every(r => r.masterType === 'facility')).toBe(true);
    });

    it('申請者でフィルタ', () => {
      const result = getApprovalRequests({ requestedBy: 'admin-001' });

      expect(result.total).toBe(2);
      expect(result.data.every(r => r.requestedBy === 'admin-001')).toBe(true);
    });

    it('ステータスでフィルタ', () => {
      const requests = getApprovalRequests({ status: 'pending' });

      expect(requests.data.every(r => r.status === 'pending')).toBe(true);
    });
  });

  describe('getPendingApprovals - 承認待ち申請取得', () => {
    it('自分が承認すべき申請のみ取得', () => {
      createApprovalRequest('facility', 'FAC_001', '小原病院', 'update', {}, {}, 'admin-001', '理由1');
      createApprovalRequest('profession', 'PROF_001', '理学療法士', 'create', null, {}, 'admin-002', '理由2');

      const pendingForHR = getPendingApprovals('hr-manager');

      expect(pendingForHR.length).toBe(2); // 両方とも第1承認者がhr-manager
      expect(pendingForHR.every(r => r.currentApproverLevel === 1)).toBe(true);
    });

    it('承認済みは取得しない', () => {
      const request = createApprovalRequest(
        'profession',
        'PROF_001',
        '理学療法士',
        'create',
        null,
        {},
        'admin-001',
        '理由'
      );

      approve(request.id, 'hr-manager', '人事部長'); // 承認

      const pending = getPendingApprovals('hr-manager');

      expect(pending.length).toBe(0);
    });
  });

  describe('visualizeApprovalFlow - 承認フロー可視化', () => {
    it('承認フローを文字列で可視化', () => {
      const request = createApprovalRequest(
        'facility',
        'FAC_001',
        '小原病院',
        'update',
        { name: '小原病院' },
        { name: '小原病院（更新）' },
        'admin-001',
        '名称変更'
      );

      approve(request.id, 'hr-manager', '人事部長', '承認します');

      const flow = visualizeApprovalFlow(request);

      expect(flow).toContain('小原病院');
      expect(flow).toContain('admin-001');
      expect(flow).toContain('名称変更');
      expect(flow).toContain('人事部長');
      expect(flow).toContain('✅ 承認済み');
      expect(flow).toContain('👉 承認待ち'); // 次の承認者
    });
  });
});
