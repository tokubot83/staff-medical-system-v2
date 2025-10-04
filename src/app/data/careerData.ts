import { CareerChangeApplication, ChangeDirection } from '@/types/career';

// 経過日数を計算するヘルパー関数
const calculateDaysElapsed = (submittedAt: string): number => {
  const submitted = new Date(submittedAt);
  const now = new Date('2025-10-04T14:00:00'); // システム現在時刻（仮）
  const diffMs = now.getTime() - submitted.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

// 変更方向を判定する関数
const getChangeDirection = (from: string, to: string): ChangeDirection => {
  const courseOrder = { 'D': 1, 'C': 2, 'B': 3, 'A': 4 };
  const fromLevel = courseOrder[from as keyof typeof courseOrder];
  const toLevel = courseOrder[to as keyof typeof courseOrder];

  if (toLevel > fromLevel) return 'upgrade';
  if (toLevel < fromLevel) return 'downgrade';
  return 'lateral';
};

// 緊急度を計算する関数
const calculateUrgency = (app: CareerChangeApplication): number => {
  let urgency = 5; // ベース緊急度

  // ダウングレード申請は最優先（離職の前兆）
  if (app.changeDirection === 'downgrade') urgency += 3;

  // 7日以上未処理は緊急度アップ
  if (app.daysElapsed >= 7 && app.status === 'pending') urgency += 2;

  // 5日以上未処理
  if (app.daysElapsed >= 5 && app.status === 'pending') urgency += 1;

  // アップグレード申請（モチベーション維持）
  if (app.changeDirection === 'upgrade') urgency += 1;

  return Math.min(urgency, 10);
};

// キャリアコース変更申請のモックデータ
const rawApplications: Omit<CareerChangeApplication, 'changeDirection' | 'daysElapsed' | 'urgencyLevel'>[] = [
  // 🚨 最優先：ダウングレード申請（離職の前兆）
  {
    id: 'CAREER-2025-001',
    staffId: 'OH-NS-2020-033',
    staffName: '渡辺明',
    department: '外来',
    position: '看護師',
    facility: '小原病院',
    currentCourse: 'B',
    requestedCourse: 'C',
    reason: '業務負荷を軽減したい。管理業務よりも患者ケアに専念したい。',
    submittedAt: '2025-09-27T10:00:00',
    status: 'pending',
  },

  {
    id: 'CAREER-2025-002',
    staffId: 'TG-PT-2021-015',
    staffName: '木村洋平',
    department: 'リハビリテーション部門',
    position: '理学療法士',
    facility: '立神リハビリテーション温泉病院',
    currentCourse: 'A',
    requestedCourse: 'B',
    reason: '専門性追求よりも、チーム医療に注力したい。',
    submittedAt: '2025-09-25T14:30:00',
    status: 'pending',
  },

  // ⚠️ 7日以上未処理
  {
    id: 'CAREER-2025-003',
    staffId: 'OH-NS-2021-028',
    staffName: '田中花子',
    department: '内科',
    position: '看護師',
    facility: '小原病院',
    currentCourse: 'C',
    requestedCourse: 'B',
    reason: 'チームリーダーを目指したい。管理職としてのキャリアに興味がある。',
    submittedAt: '2025-09-25T09:00:00',
    status: 'pending',
  },

  // アップグレード申請（通常優先度）
  {
    id: 'CAREER-2025-004',
    staffId: 'TG-NS-2020-012',
    staffName: '佐々木恵理',
    department: '第１病棟',
    position: '看護師',
    facility: '立神リハビリテーション温泉病院',
    currentCourse: 'C',
    requestedCourse: 'A',
    reason: '認定看護師を目指し、専門性を高めたい。',
    submittedAt: '2025-09-30T11:00:00',
    status: 'pending',
  },

  {
    id: 'CAREER-2025-005',
    staffId: 'OH-PT-2020-015',
    staffName: '山田健太',
    department: '理学療法室',
    position: '理学療法士',
    facility: '小原病院',
    currentCourse: 'B',
    requestedCourse: 'A',
    reason: '運動器リハビリの専門性をさらに深めたい。',
    submittedAt: '2025-10-01T15:00:00',
    status: 'pending',
  },

  // 審査中
  {
    id: 'CAREER-2025-006',
    staffId: 'TG-NS-2019-001',
    staffName: '鈴木花子',
    department: '第１病棟',
    position: '看護師',
    facility: '立神リハビリテーション温泉病院',
    currentCourse: 'C',
    requestedCourse: 'B',
    reason: '主任候補として管理業務にチャレンジしたい。',
    submittedAt: '2025-09-20T10:00:00',
    status: 'reviewing',
    reviewer: '人事部 キャリア開発担当',
    reviewedAt: '2025-09-28T14:00:00',
  },

  {
    id: 'CAREER-2025-007',
    staffId: 'TG-PT-2018-010',
    staffName: '高橋太郎',
    department: 'リハビリテーション部門',
    position: '理学療法士',
    facility: '立神リハビリテーション温泉病院',
    currentCourse: 'A',
    requestedCourse: 'B',
    reason: 'リーダーシップを発揮したい。後輩育成に注力したい。',
    submittedAt: '2025-09-18T09:00:00',
    status: 'reviewing',
    reviewer: '人事部 キャリア開発担当',
    reviewedAt: '2025-09-25T10:00:00',
  },

  {
    id: 'CAREER-2025-008',
    staffId: 'TG-CW-2020-005',
    staffName: '伊藤美香',
    department: '介護医療院',
    position: '介護職員',
    facility: '立神リハビリテーション温泉病院',
    currentCourse: 'D',
    requestedCourse: 'C',
    reason: 'リーダー候補として成長したい。',
    submittedAt: '2025-09-15T11:00:00',
    status: 'reviewing',
    reviewer: '人事部 キャリア開発担当',
    reviewedAt: '2025-09-22T15:00:00',
  },

  // 承認済み
  {
    id: 'CAREER-2025-009',
    staffId: 'OH-NS-2021-001',
    staffName: '田中美咲',
    department: '3階病棟',
    position: '看護師',
    facility: '小原病院',
    currentCourse: 'C',
    requestedCourse: 'B',
    reason: '主任昇格に向けて、管理職コースへ転換したい。',
    submittedAt: '2025-09-10T10:00:00',
    status: 'approved',
    reviewer: '人事部長',
    reviewedAt: '2025-09-15T14:00:00',
    reviewComment: '主任昇格予定のため、Bコースへの変更を承認します。',
    approvedAt: '2025-09-18T10:00:00',
  },

  {
    id: 'CAREER-2025-010',
    staffId: 'OH-DR-2015-003',
    staffName: '佐藤一郎',
    department: '循環器内科',
    position: '医師',
    facility: '小原病院',
    currentCourse: 'A',
    requestedCourse: 'A',
    reason: '専門医としてのキャリアを継続。',
    submittedAt: '2025-09-05T09:00:00',
    status: 'approved',
    reviewer: '人事部長',
    reviewedAt: '2025-09-08T10:00:00',
    reviewComment: '専門性の高い医療提供を継続してください。',
    approvedAt: '2025-09-10T09:00:00',
  },
];

// 申請データに計算値を追加
export const careerChangeApplications: CareerChangeApplication[] = rawApplications.map(app => {
  const changeDirection = getChangeDirection(app.currentCourse, app.requestedCourse);
  const daysElapsed = calculateDaysElapsed(app.submittedAt);
  const withCalcFields = {
    ...app,
    changeDirection,
    daysElapsed,
    urgencyLevel: 0, // 一時的な値
  };
  return {
    ...withCalcFields,
    urgencyLevel: calculateUrgency(withCalcFields),
  };
});

// キャリアコース変更申請の統計データ
export const careerChangeStats = {
  totalPending: careerChangeApplications.filter(a => a.status === 'pending').length,
  totalReviewing: careerChangeApplications.filter(a => a.status === 'reviewing').length,
  totalApproved: careerChangeApplications.filter(a => a.status === 'approved').length,
  totalRejected: careerChangeApplications.filter(a => a.status === 'rejected').length,
  upgradeRequests: careerChangeApplications.filter(a => a.changeDirection === 'upgrade' && a.status === 'pending').length,
  downgradeRequests: careerChangeApplications.filter(a => a.changeDirection === 'downgrade' && a.status === 'pending').length,
  overduePending: careerChangeApplications.filter(a => a.status === 'pending' && a.daysElapsed >= 7).length,
};
