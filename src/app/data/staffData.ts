import { StaffEvaluation, EvaluationHistory } from '@/types/evaluation'
import { cohortDemoDatabase } from './generated/cohortDemoData'

// スタッフデータの型定義
export interface StaffDetail {
  id: string;
  name: string;
  nameInitial: string;
  position: string;
  department: string;
  facility: string; // 所属施設を追加
  employeeId: string;
  joinDate: string;
  tenure: string;
  age: number;
  birthDate: string;
  evaluation: string;
  evaluationPeriod: string;
  nextMeeting: string;
  healthStatus: string;
  healthScore?: number;
  stressIndex: number;
  lastCheckupDate?: string;
  nextCheckupDate?: string;
  healthRisks?: string[];
  healthRecommendations?: string[];
  engagement: number;
  overtime: number;
  paidLeaveRate: number;
  avatar: string;
  // 追加の詳細情報
  email: string;
  phone: string;
  emergencyContact: string;
  address: string;
  // 評価データ（新形式）
  evaluationData?: StaffEvaluation;
  // 評価データ（旧形式・互換性のため残す）
  evaluationHistory: {
    period: string;
    overall: string;
    performance: number;
    skills: number;
    teamwork: number;
    growth: number;
    evaluator: string;
  }[];
  // スキルデータ
  skills: {
    name: string;
    level: number;
    category: string;
  }[];
  // 研修履歴
  trainingHistory: {
    name: string;
    date: string;
    category: string;
    hours: number;
    evaluation: string;
    certificate: boolean;
  }[];
  // 配属履歴
  assignmentHistory: {
    date: string;
    department: string;
    position: string;
    reason: string;
  }[];
}

// 小原病院のスタッフデータ
export const obaraStaffDatabase: Record<string, StaffDetail> = {
  // 小原病院 - 看護部
  'OH-NS-2021-001': {
    id: 'OH-NS-2021-001',
    name: '田中美咲',
    nameInitial: '田',
    position: '看護師',
    department: '3階病棟',
    facility: '小原病院',
    employeeId: 'OH-NS-2021-001',
    joinDate: '2021年4月1日',
    tenure: '3年9ヶ月',
    age: 29,
    birthDate: '1995年3月15日',
    evaluation: 'A',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年2月10日',
    healthStatus: '良好',
    stressIndex: 40,
    engagement: 88,
    overtime: 15,
    paidLeaveRate: 75,
    avatar: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    email: 'tanaka.misaki@obara-hp.jp',
    phone: '080-1234-5678',
    emergencyContact: '090-8765-4321（配偶者）',
    address: '東京都○○区△△1-2-3',
    evaluationHistory: [
      { period: '2024年下期', overall: 'A', performance: 4.5, skills: 4.3, teamwork: 4.7, growth: 4.4, evaluator: '3階病棟 師長' },
      { period: '2024年上期', overall: 'B+', performance: 4.0, skills: 3.9, teamwork: 4.3, growth: 4.1, evaluator: '3階病棟 師長' },
    ],
    skills: [
      { name: '看護実践能力', level: 4, category: 'JNAラダー' },
      { name: '急性期看護', level: 4, category: '専門技術' },
      { name: 'チーム医療', level: 4, category: '連携' },
    ],
    trainingHistory: [
      { name: '急性期看護研修', date: '2024年10月', category: '専門技術', hours: 16, evaluation: '優秀', certificate: true },
      { name: '医療安全研修', date: '2024年8月', category: '安全管理', hours: 4, evaluation: '良好', certificate: true },
    ],
    assignmentHistory: [
      { date: '2021年4月1日', department: '3階病棟', position: '看護師', reason: '新卒配属' },
    ],
  },
  
  // 小原病院 - 診療技術部
  'OH-PT-2020-015': {
    id: 'OH-PT-2020-015',
    name: '山田健太',
    nameInitial: '山',
    position: '理学療法士',
    department: '理学療法室',
    facility: '小原病院',
    employeeId: 'OH-PT-2020-015',
    joinDate: '2020年4月1日',
    tenure: '4年9ヶ月',
    age: 30,
    birthDate: '1994年8月20日',
    evaluation: 'B+',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年2月15日',
    healthStatus: '良好',
    stressIndex: 35,
    engagement: 90,
    overtime: 10,
    paidLeaveRate: 80,
    avatar: 'bg-gradient-to-r from-green-500 to-teal-600',
    email: 'yamada.kenta@obara-hp.jp',
    phone: '080-2345-6789',
    emergencyContact: '090-7654-3210（妻）',
    address: '東京都○○区△△2-3-4',
    evaluationHistory: [
      { period: '2024年下期', overall: 'B+', performance: 4.1, skills: 4.0, teamwork: 4.2, growth: 4.0, evaluator: '理学療法室 主任' },
      { period: '2024年上期', overall: 'B', performance: 3.8, skills: 3.7, teamwork: 4.0, growth: 3.9, evaluator: '理学療法室 主任' },
    ],
    skills: [
      { name: '運動器リハビリ', level: 4, category: '専門技術' },
      { name: '脳血管リハビリ', level: 3, category: '専門技術' },
      { name: '患者評価', level: 4, category: '基本技術' },
    ],
    trainingHistory: [
      { name: '運動器リハビリ上級研修', date: '2024年9月', category: '専門技術', hours: 20, evaluation: '良好', certificate: true },
      { name: 'リハビリテーション学会参加', date: '2024年6月', category: '学術', hours: 16, evaluation: '参加', certificate: true },
    ],
    assignmentHistory: [
      { date: '2020年4月1日', department: '理学療法室', position: '理学療法士', reason: '新卒配属' },
    ],
  },
  
  // 小原病院 - 医師
  'OH-DR-2015-003': {
    id: 'OH-DR-2015-003',
    name: '佐藤一郎',
    nameInitial: '佐',
    position: '医師',
    department: '循環器内科',
    facility: '小原病院',
    employeeId: 'OH-DR-2015-003',
    joinDate: '2015年4月1日',
    tenure: '9年9ヶ月',
    age: 42,
    birthDate: '1982年5月10日',
    evaluation: 'S',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年3月1日',
    healthStatus: '良好',
    stressIndex: 50,
    engagement: 85,
    overtime: 40,
    paidLeaveRate: 45,
    avatar: 'bg-gradient-to-r from-purple-500 to-pink-600',
    email: 'sato.ichiro@obara-hp.jp',
    phone: '080-3456-7890',
    emergencyContact: '090-6543-2109（妻）',
    address: '東京都○○区△△3-4-5',
    evaluationHistory: [
      { period: '2024年下期', overall: 'S', performance: 4.8, skills: 4.9, teamwork: 4.6, growth: 4.5, evaluator: '循環器内科 部長' },
      { period: '2024年上期', overall: 'A', performance: 4.5, skills: 4.6, teamwork: 4.4, growth: 4.3, evaluator: '循環器内科 部長' },
    ],
    skills: [
      { name: '心臓カテーテル検査', level: 5, category: '専門技術' },
      { name: '心エコー', level: 5, category: '専門技術' },
      { name: '循環器診療', level: 5, category: '専門技術' },
    ],
    trainingHistory: [
      { name: '心臓カテーテル学会', date: '2024年11月', category: '学術', hours: 24, evaluation: '発表', certificate: true },
      { name: '循環器専門医更新研修', date: '2024年9月', category: '専門資格', hours: 30, evaluation: '合格', certificate: true },
    ],
    assignmentHistory: [
      { date: '2020年4月1日', department: '循環器内科', position: '医師', reason: '専門性向上' },
      { date: '2015年4月1日', department: '内科', position: '医師', reason: '中途採用' },
    ],
  },
};

// 立神リハビリテーション温泉病院のスタッフデータ
export const tachigamiStaffDatabase: Record<string, StaffDetail> = {
  // 立神病院 - 看護部門
  'TG-NS-2019-001': {
    id: 'TG-NS-2019-001',
    name: '鈴木花子',
    nameInitial: '鈴',
    position: '看護師',
    department: '第１病棟',
    facility: '立神リハビリテーション温泉病院',
    employeeId: 'TG-NS-2019-001',
    joinDate: '2019年4月1日',
    tenure: '5年9ヶ月',
    age: 32,
    birthDate: '1992年7月25日',
    evaluation: 'A',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年2月20日',
    healthStatus: '良好',
    stressIndex: 45,
    engagement: 85,
    overtime: 12,
    paidLeaveRate: 70,
    avatar: 'bg-gradient-to-r from-pink-500 to-rose-600',
    email: 'suzuki.hanako@tachigami-hp.jp',
    phone: '080-4567-8901',
    emergencyContact: '090-5432-1098（母）',
    address: '○○県△△市□□1-2-3',
    evaluationHistory: [
      { period: '2024年下期', overall: 'A', performance: 4.4, skills: 4.3, teamwork: 4.6, growth: 4.2, evaluator: '第１病棟 師長' },
      { period: '2024年上期', overall: 'B+', performance: 4.0, skills: 3.9, teamwork: 4.2, growth: 4.0, evaluator: '第１病棟 師長' },
    ],
    skills: [
      { name: '看護実践能力', level: 4, category: 'JNAラダー' },
      { name: '回復期看護', level: 4, category: '専門技術' },
      { name: '温泉療法支援', level: 3, category: '専門技術' },
    ],
    trainingHistory: [
      { name: '回復期リハビリ看護研修', date: '2024年10月', category: '専門技術', hours: 16, evaluation: '優秀', certificate: true },
      { name: '温泉療法研修', date: '2024年7月', category: '専門技術', hours: 8, evaluation: '良好', certificate: true },
    ],
    assignmentHistory: [
      { date: '2019年4月1日', department: '第１病棟', position: '看護師', reason: '新卒配属' },
    ],
  },
  
  // 立神病院 - リハビリテーション部門
  'TG-PT-2018-010': {
    id: 'TG-PT-2018-010',
    name: '高橋太郎',
    nameInitial: '高',
    position: '理学療法士',
    department: 'リハビリテーション部門',
    facility: '立神リハビリテーション温泉病院',
    employeeId: 'TG-PT-2018-010',
    joinDate: '2018年4月1日',
    tenure: '6年9ヶ月',
    age: 35,
    birthDate: '1989年9月15日',
    evaluation: 'S',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年3月5日',
    healthStatus: '良好',
    stressIndex: 38,
    engagement: 92,
    overtime: 8,
    paidLeaveRate: 85,
    avatar: 'bg-gradient-to-r from-teal-500 to-cyan-600',
    email: 'takahashi.taro@tachigami-hp.jp',
    phone: '080-5678-9012',
    emergencyContact: '090-4321-0987（妻）',
    address: '○○県△△市□□2-3-4',
    evaluationHistory: [
      { period: '2024年下期', overall: 'S', performance: 4.7, skills: 4.8, teamwork: 4.6, growth: 4.5, evaluator: 'リハビリテーション部門 統括主任' },
      { period: '2024年上期', overall: 'A', performance: 4.5, skills: 4.5, teamwork: 4.4, growth: 4.3, evaluator: 'リハビリテーション部門 統括主任' },
    ],
    skills: [
      { name: '脳血管リハビリ', level: 5, category: '専門技術' },
      { name: '運動器リハビリ', level: 5, category: '専門技術' },
      { name: '温泉リハビリ', level: 4, category: '専門技術' },
      { name: '後輩指導', level: 4, category: '管理スキル' },
    ],
    trainingHistory: [
      { name: '温泉リハビリテーション専門研修', date: '2024年11月', category: '専門技術', hours: 24, evaluation: '優秀', certificate: true },
      { name: 'リハビリ指導者研修', date: '2024年8月', category: '管理・指導', hours: 16, evaluation: '優秀', certificate: true },
    ],
    assignmentHistory: [
      { date: '2022年4月1日', department: 'リハビリテーション部門', position: '理学療法士（リーダー）', reason: '昇格' },
      { date: '2018年4月1日', department: 'リハビリテーション部門', position: '理学療法士', reason: '新卒配属' },
    ],
  },
  
  // 立神病院 - 介護医療院
  'TG-CW-2020-005': {
    id: 'TG-CW-2020-005',
    name: '伊藤美香',
    nameInitial: '伊',
    position: '介護職員',
    department: '介護医療院',
    facility: '立神リハビリテーション温泉病院',
    employeeId: 'TG-CW-2020-005',
    joinDate: '2020年4月1日',
    tenure: '4年9ヶ月',
    age: 28,
    birthDate: '1996年2月10日',
    evaluation: 'B+',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年2月25日',
    healthStatus: '良好',
    stressIndex: 42,
    engagement: 86,
    overtime: 15,
    paidLeaveRate: 75,
    avatar: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    email: 'ito.mika@tachigami-hp.jp',
    phone: '080-6789-0123',
    emergencyContact: '090-3210-9876（父）',
    address: '○○県△△市□□3-4-5',
    evaluationHistory: [
      { period: '2024年下期', overall: 'B+', performance: 4.0, skills: 3.9, teamwork: 4.3, growth: 4.1, evaluator: '介護医療院 介護主任' },
      { period: '2024年上期', overall: 'B', performance: 3.7, skills: 3.6, teamwork: 4.0, growth: 3.8, evaluator: '介護医療院 介護主任' },
    ],
    skills: [
      { name: '身体介護', level: 4, category: '基本技術' },
      { name: '認知症ケア', level: 4, category: '専門技術' },
      { name: 'レクリエーション', level: 3, category: '支援技術' },
    ],
    trainingHistory: [
      { name: '認知症ケア実践者研修', date: '2024年9月', category: '専門技術', hours: 30, evaluation: '修了', certificate: true },
      { name: '介護技術向上研修', date: '2024年6月', category: '基本技術', hours: 12, evaluation: '良好', certificate: true },
    ],
    assignmentHistory: [
      { date: '2020年4月1日', department: '介護医療院', position: '介護職員', reason: '新卒配属' },
    ],
  },

  // 第一病棟看護師 - 離職リスク分析用デモデータ
  'TG-NS-2023-015': {
    id: 'TG-NS-2023-015',
    name: '加藤優子',
    nameInitial: '加',
    position: '看護師',
    department: '第１病棟',
    facility: '立神リハビリテーション温泉病院',
    employeeId: 'TG-NS-2023-015',
    joinDate: '2023年4月1日',
    tenure: '1年9ヶ月',
    age: 24,
    birthDate: '2000年6月15日',
    evaluation: 'B',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年2月15日',
    healthStatus: '要注意',
    stressIndex: 78,
    engagement: 35,
    overtime: 55,
    paidLeaveRate: 25,
    avatar: 'bg-gradient-to-r from-red-500 to-pink-600',
    email: 'kato.yuko@tachigami-hp.jp',
    phone: '080-1234-5678',
    emergencyContact: '090-8765-4321（母）',
    address: '○○県△△市□□4-5-6',
    evaluationHistory: [
      { period: '2024年下期', overall: 'B', performance: 3.5, skills: 3.4, teamwork: 3.7, growth: 3.6, evaluator: '第１病棟 師長' },
      { period: '2024年上期', overall: 'B', performance: 3.3, skills: 3.2, teamwork: 3.5, growth: 3.4, evaluator: '第１病棟 師長' },
    ],
    skills: [
      { name: '看護実践能力', level: 2, category: 'JNAラダー' },
      { name: '回復期看護', level: 2, category: '専門技術' },
      { name: '温泉療法支援', level: 1, category: '専門技術' },
    ],
    trainingHistory: [
      { name: '新人看護師研修', date: '2023年5月', category: '基礎研修', hours: 40, evaluation: '修了', certificate: true },
      { name: '医療安全研修', date: '2024年8月', category: '安全管理', hours: 4, evaluation: '良好', certificate: true },
    ],
    assignmentHistory: [
      { date: '2023年4月1日', department: '第１病棟', position: '看護師', reason: '新卒配属' },
    ],
  },

  'TG-NS-2021-008': {
    id: 'TG-NS-2021-008',
    name: '山本直美',
    nameInitial: '山',
    position: '看護師',
    department: '第１病棟',
    facility: '立神リハビリテーション温泉病院',
    employeeId: 'TG-NS-2021-008',
    joinDate: '2021年4月1日',
    tenure: '3年9ヶ月',
    age: 28,
    birthDate: '1996年3月20日',
    evaluation: 'B+',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年2月18日',
    healthStatus: '普通',
    stressIndex: 65,
    engagement: 45,
    overtime: 42,
    paidLeaveRate: 35,
    avatar: 'bg-gradient-to-r from-orange-500 to-amber-600',
    email: 'yamamoto.naomi@tachigami-hp.jp',
    phone: '080-2345-6789',
    emergencyContact: '090-7654-3210（夫）',
    address: '○○県△△市□□5-6-7',
    evaluationHistory: [
      { period: '2024年下期', overall: 'B+', performance: 3.8, skills: 3.7, teamwork: 4.0, growth: 3.9, evaluator: '第１病棟 師長' },
      { period: '2024年上期', overall: 'B', performance: 3.5, skills: 3.4, teamwork: 3.8, growth: 3.6, evaluator: '第１病棟 師長' },
    ],
    skills: [
      { name: '看護実践能力', level: 3, category: 'JNAラダー' },
      { name: '回復期看護', level: 3, category: '専門技術' },
      { name: '温泉療法支援', level: 2, category: '専門技術' },
    ],
    trainingHistory: [
      { name: '回復期看護研修', date: '2023年10月', category: '専門技術', hours: 16, evaluation: '良好', certificate: true },
      { name: '看護技術向上研修', date: '2024年5月', category: '基本技術', hours: 8, evaluation: '良好', certificate: true },
    ],
    assignmentHistory: [
      { date: '2021年4月1日', department: '第１病棟', position: '看護師', reason: '新卒配属' },
    ],
  },

  'TG-NS-2020-012': {
    id: 'TG-NS-2020-012',
    name: '佐々木恵理',
    nameInitial: '佐',
    position: '看護師',
    department: '第１病棟',
    facility: '立神リハビリテーション温泉病院',
    employeeId: 'TG-NS-2020-012',
    joinDate: '2020年4月1日',
    tenure: '4年9ヶ月',
    age: 31,
    birthDate: '1993年8月10日',
    evaluation: 'A',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年2月22日',
    healthStatus: '良好',
    stressIndex: 48,
    engagement: 82,
    overtime: 20,
    paidLeaveRate: 68,
    avatar: 'bg-gradient-to-r from-blue-500 to-purple-600',
    email: 'sasaki.eri@tachigami-hp.jp',
    phone: '080-3456-7890',
    emergencyContact: '090-6543-2109（母）',
    address: '○○県△△市□□6-7-8',
    evaluationHistory: [
      { period: '2024年下期', overall: 'A', performance: 4.3, skills: 4.2, teamwork: 4.5, growth: 4.1, evaluator: '第１病棟 師長' },
      { period: '2024年上期', overall: 'B+', performance: 4.0, skills: 3.9, teamwork: 4.2, growth: 4.0, evaluator: '第１病棟 師長' },
    ],
    skills: [
      { name: '看護実践能力', level: 4, category: 'JNAラダー' },
      { name: '回復期看護', level: 4, category: '専門技術' },
      { name: '温泉療法支援', level: 3, category: '専門技術' },
      { name: '新人指導', level: 3, category: '管理スキル' },
    ],
    trainingHistory: [
      { name: '回復期看護上級研修', date: '2024年10月', category: '専門技術', hours: 24, evaluation: '優秀', certificate: true },
      { name: 'プリセプター研修', date: '2024年3月', category: '管理・指導', hours: 16, evaluation: '優秀', certificate: true },
    ],
    assignmentHistory: [
      { date: '2020年4月1日', department: '第１病棟', position: '看護師', reason: '新卒配属' },
    ],
  },

  'TG-NS-2018-005': {
    id: 'TG-NS-2018-005',
    name: '田村理恵',
    nameInitial: '田',
    position: '看護師（主任）',
    department: '第１病棟',
    facility: '立神リハビリテーション温泉病院',
    employeeId: 'TG-NS-2018-005',
    joinDate: '2018年4月1日',
    tenure: '6年9ヶ月',
    age: 35,
    birthDate: '1989年5月25日',
    evaluation: 'S',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年3月1日',
    healthStatus: '良好',
    stressIndex: 52,
    engagement: 88,
    overtime: 25,
    paidLeaveRate: 72,
    avatar: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    email: 'tamura.rie@tachigami-hp.jp',
    phone: '080-4567-8901',
    emergencyContact: '090-5432-1098（夫）',
    address: '○○県△△市□□7-8-9',
    evaluationHistory: [
      { period: '2024年下期', overall: 'S', performance: 4.6, skills: 4.7, teamwork: 4.8, growth: 4.5, evaluator: '第１病棟 師長' },
      { period: '2024年上期', overall: 'A', performance: 4.4, skills: 4.5, teamwork: 4.6, growth: 4.3, evaluator: '第１病棟 師長' },
    ],
    skills: [
      { name: '看護実践能力', level: 5, category: 'JNAラダー' },
      { name: '回復期看護', level: 5, category: '専門技術' },
      { name: '温泉療法支援', level: 4, category: '専門技術' },
      { name: 'リーダーシップ', level: 4, category: '管理スキル' },
      { name: '新人教育', level: 4, category: '管理スキル' },
    ],
    trainingHistory: [
      { name: '看護管理者研修', date: '2024年11月', category: '管理・指導', hours: 30, evaluation: '優秀', certificate: true },
      { name: '回復期看護エキスパート研修', date: '2024年6月', category: '専門技術', hours: 40, evaluation: '優秀', certificate: true },
    ],
    assignmentHistory: [
      { date: '2023年4月1日', department: '第１病棟', position: '看護師（主任）', reason: '昇格' },
      { date: '2018年4月1日', department: '第１病棟', position: '看護師', reason: '新卒配属' },
    ],
  },

  'TG-NS-2022-020': {
    id: 'TG-NS-2022-020',
    name: '中村美紀',
    nameInitial: '中',
    position: '看護師',
    department: '第１病棟',
    facility: '立神リハビリテーション温泉病院',
    employeeId: 'TG-NS-2022-020',
    joinDate: '2022年10月1日',
    tenure: '2年3ヶ月',
    age: 27,
    birthDate: '1997年9月5日',
    evaluation: 'B+',
    evaluationPeriod: '2024年下期',
    nextMeeting: '2025年2月28日',
    healthStatus: '要注意',
    stressIndex: 72,
    engagement: 40,
    overtime: 48,
    paidLeaveRate: 30,
    avatar: 'bg-gradient-to-r from-pink-500 to-red-600',
    email: 'nakamura.miki@tachigami-hp.jp',
    phone: '080-5678-9012',
    emergencyContact: '090-4321-0987（父）',
    address: '○○県△△市□□8-9-10',
    evaluationHistory: [
      { period: '2024年下期', overall: 'B+', performance: 3.7, skills: 3.6, teamwork: 3.9, growth: 3.8, evaluator: '第１病棟 師長' },
      { period: '2024年上期', overall: 'B', performance: 3.4, skills: 3.3, teamwork: 3.7, growth: 3.5, evaluator: '第１病棟 師長' },
    ],
    skills: [
      { name: '看護実践能力', level: 3, category: 'JNAラダー' },
      { name: '回復期看護', level: 2, category: '専門技術' },
      { name: '温泉療法支援', level: 2, category: '専門技術' },
    ],
    trainingHistory: [
      { name: '中途採用者研修', date: '2022年11月', category: '基礎研修', hours: 24, evaluation: '修了', certificate: true },
      { name: '温泉療法基礎研修', date: '2023年7月', category: '専門技術', hours: 8, evaluation: '良好', certificate: true },
    ],
    assignmentHistory: [
      { date: '2022年10月1日', department: '第１病棟', position: '看護師', reason: '中途採用' },
    ],
  },
};

// 全スタッフデータベース（両病院統合 + コホート分析用デモデータ）
export const staffDatabase: Record<string, StaffDetail> = {
  ...obaraStaffDatabase,
  ...tachigamiStaffDatabase,
  ...cohortDemoDatabase
};

// スタッフ一覧データ（ダッシュボード用）
export const staffListData = Object.values(staffDatabase).map(staff => ({
  id: staff.id,
  name: staff.name,
  nameInitial: staff.nameInitial,
  department: staff.department,
  facility: staff.facility,
  position: staff.position,
  status: staff.evaluation === 'S' || staff.evaluation === 'A' ? 'excellent' : 
          staff.evaluation === 'B+' || staff.evaluation === 'B' ? 'good' : 'average',
  priority: staff.stressIndex > 60 ? 'high' : 
           staff.stressIndex > 40 ? 'medium' : 'normal',
  avatar: staff.avatar,
  stressIndex: staff.stressIndex,
  engagement: staff.engagement,
}));

// 施設別スタッフ数の集計
export const facilityStaffCount = {
  '小原病院': Object.values(obaraStaffDatabase).length,
  '立神リハビリテーション温泉病院': Object.values(tachigamiStaffDatabase).length
};

// 部門別スタッフ数の集計
export const getDepartmentStaffCount = (facility?: string) => {
  const targetStaff = facility 
    ? Object.values(staffDatabase).filter(s => s.facility === facility)
    : Object.values(staffDatabase);
    
  return targetStaff.reduce((acc, staff) => {
    acc[staff.department] = (acc[staff.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};