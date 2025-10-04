import { ComplianceReport } from '@/types/compliance';

// 現在時刻を基準にした経過時間計算用のヘルパー関数
const calculateHoursElapsed = (receivedAt: string): number => {
  const received = new Date(receivedAt);
  const now = new Date('2025-10-04T14:00:00'); // システム現在時刻（仮）
  const diffMs = now.getTime() - received.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60));
};

// 初動対応期限を計算（受信から24-48時間）
const calculateActionDeadline = (receivedAt: string, severity: string): string => {
  const received = new Date(receivedAt);
  const hoursToAdd = severity === 'critical' ? 24 : 48;
  const deadline = new Date(received.getTime() + hoursToAdd * 60 * 60 * 1000);
  return deadline.toISOString();
};

// コンプライアンス通報のモックデータ
export const complianceReports: ComplianceReport[] = [
  // 🚨 緊急案件（48時間経過・未対応）
  {
    id: 'COMP-2025-001',
    reportType: 'ハラスメント',
    severity: 'critical',
    status: 'unprocessed',
    reporterType: 'anonymous',
    receivedAt: '2025-10-02T14:00:00',
    department: '外科病棟',
    facility: '小原病院',
    summary: '上司からの継続的な叱責と精神的圧迫に関する通報',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 3,
    actionDeadline: calculateActionDeadline('2025-10-02T14:00:00', 'critical'),
    hoursElapsed: calculateHoursElapsed('2025-10-02T14:00:00'),
  },

  // ⚠️ 緊急案件（24時間経過・未対応）
  {
    id: 'COMP-2025-002',
    reportType: 'パワハラ',
    severity: 'critical',
    status: 'unprocessed',
    reporterType: 'anonymous',
    receivedAt: '2025-10-03T14:00:00',
    department: 'リハビリテーション科',
    facility: '立神リハビリテーション温泉病院',
    summary: '主任からの過度な業務要求と人格否定発言',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 2,
    actionDeadline: calculateActionDeadline('2025-10-03T14:00:00', 'critical'),
    hoursElapsed: calculateHoursElapsed('2025-10-03T14:00:00'),
  },

  // 🔄 調査中（高優先度）
  {
    id: 'COMP-2025-003',
    reportType: 'セクハラ',
    severity: 'high',
    status: 'investigating',
    reporterType: 'named',
    receivedAt: '2025-10-01T10:00:00',
    department: '外来',
    facility: '小原病院',
    summary: '不適切な身体的接触に関する通報',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 2,
    actionDeadline: calculateActionDeadline('2025-10-01T10:00:00', 'high'),
    investigator: '人事部 コンプライアンス担当',
    lastUpdatedAt: '2025-10-02T15:30:00',
    hoursElapsed: calculateHoursElapsed('2025-10-01T10:00:00'),
  },

  // 対応中（中優先度）
  {
    id: 'COMP-2025-004',
    reportType: '労働環境',
    severity: 'medium',
    status: 'investigating',
    reporterType: 'anonymous',
    receivedAt: '2025-09-30T16:00:00',
    department: 'ICU',
    facility: '小原病院',
    summary: '慢性的な人員不足による過重労働',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 8,
    actionDeadline: calculateActionDeadline('2025-09-30T16:00:00', 'medium'),
    investigator: '人事部 労務管理担当',
    lastUpdatedAt: '2025-10-03T10:00:00',
    hoursElapsed: calculateHoursElapsed('2025-09-30T16:00:00'),
  },

  {
    id: 'COMP-2025-005',
    reportType: '安全衛生',
    severity: 'medium',
    status: 'investigating',
    reporterType: 'named',
    receivedAt: '2025-09-28T09:00:00',
    department: '第１病棟',
    facility: '立神リハビリテーション温泉病院',
    summary: '医療器具の安全管理体制の不備',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 5,
    actionDeadline: calculateActionDeadline('2025-09-28T09:00:00', 'medium'),
    investigator: '人事部 安全衛生担当',
    lastUpdatedAt: '2025-10-01T14:00:00',
    hoursElapsed: calculateHoursElapsed('2025-09-28T09:00:00'),
  },

  // 措置実施中
  {
    id: 'COMP-2025-006',
    reportType: 'パワハラ',
    severity: 'high',
    status: 'action_taken',
    reporterType: 'named',
    receivedAt: '2025-09-25T11:00:00',
    department: '薬剤部',
    facility: '小原病院',
    summary: '部門長による威圧的な指導',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 4,
    actionDeadline: calculateActionDeadline('2025-09-25T11:00:00', 'high'),
    investigator: '人事部長',
    lastUpdatedAt: '2025-10-03T16:00:00',
    hoursElapsed: calculateHoursElapsed('2025-09-25T11:00:00'),
  },

  {
    id: 'COMP-2025-007',
    reportType: '労働環境',
    severity: 'medium',
    status: 'action_taken',
    reporterType: 'anonymous',
    receivedAt: '2025-09-22T13:00:00',
    department: '介護医療院',
    facility: '立神リハビリテーション温泉病院',
    summary: '休憩時間の確保困難',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 6,
    actionDeadline: calculateActionDeadline('2025-09-22T13:00:00', 'medium'),
    investigator: '人事部 労務管理担当',
    lastUpdatedAt: '2025-10-02T10:00:00',
    hoursElapsed: calculateHoursElapsed('2025-09-22T13:00:00'),
  },

  // 解決済み
  {
    id: 'COMP-2025-008',
    reportType: 'ハラスメント',
    severity: 'high',
    status: 'resolved',
    reporterType: 'named',
    receivedAt: '2025-09-15T10:00:00',
    department: '内科病棟',
    facility: '小原病院',
    summary: '言葉による嫌がらせ',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 2,
    actionDeadline: calculateActionDeadline('2025-09-15T10:00:00', 'high'),
    investigator: '人事部長',
    lastUpdatedAt: '2025-09-28T17:00:00',
    hoursElapsed: calculateHoursElapsed('2025-09-15T10:00:00'),
  },

  {
    id: 'COMP-2025-009',
    reportType: '不正行為',
    severity: 'critical',
    status: 'resolved',
    reporterType: 'named',
    receivedAt: '2025-09-10T15:00:00',
    department: '事務部',
    facility: '小原病院',
    summary: '勤怠記録の不正操作疑惑',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 1,
    actionDeadline: calculateActionDeadline('2025-09-10T15:00:00', 'critical'),
    investigator: '人事部長・総務部長',
    lastUpdatedAt: '2025-09-25T16:00:00',
    hoursElapsed: calculateHoursElapsed('2025-09-10T15:00:00'),
  },

  {
    id: 'COMP-2025-010',
    reportType: 'その他',
    severity: 'medium',
    status: 'resolved',
    reporterType: 'anonymous',
    receivedAt: '2025-09-08T09:00:00',
    department: '放射線科',
    facility: '小原病院',
    summary: '設備管理の不備',
    details: '詳細内容は調査担当者のみ閲覧可能',
    relatedStaffCount: 3,
    actionDeadline: calculateActionDeadline('2025-09-08T09:00:00', 'medium'),
    investigator: '施設管理部',
    lastUpdatedAt: '2025-09-22T14:00:00',
    hoursElapsed: calculateHoursElapsed('2025-09-08T09:00:00'),
  },
];

// コンプライアンス統計データ
export const complianceStats = {
  totalUnprocessed: complianceReports.filter(r => r.status === 'unprocessed').length,
  totalInvestigating: complianceReports.filter(r => r.status === 'investigating').length,
  totalResolved: complianceReports.filter(r => r.status === 'resolved').length,
  criticalCount: complianceReports.filter(r => r.severity === 'critical' && r.status !== 'resolved').length,
  overdueCount: complianceReports.filter(r => {
    const deadline = new Date(r.actionDeadline);
    const now = new Date('2025-10-04T14:00:00');
    return deadline < now && r.status === 'unprocessed';
  }).length,
  within24Hours: complianceReports.filter(r => {
    const deadline = new Date(r.actionDeadline);
    const now = new Date('2025-10-04T14:00:00');
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursRemaining <= 24 && hoursRemaining > 0 && r.status === 'unprocessed';
  }).length,
};
