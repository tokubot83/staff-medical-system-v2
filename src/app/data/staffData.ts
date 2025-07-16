// スタッフデータの型定義
export interface StaffDetail {
  id: string;
  name: string;
  nameInitial: string;
  position: string;
  department: string;
  employeeId: string;
  joinDate: string;
  tenure: string;
  age: number;
  birthDate: string;
  evaluation: string;
  evaluationPeriod: string;
  nextMeeting: string;
  healthStatus: string;
  stressIndex: number;
  engagement: number;
  overtime: number;
  paidLeaveRate: number;
  avatar: string;
  // 追加の詳細情報
  email: string;
  phone: string;
  emergencyContact: string;
  address: string;
  // 評価データ
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

// デモスタッフデータ
export const staffDatabase: Record<string, StaffDetail> = {
  'NS-2021-047': {
    id: 'NS-2021-047',
    name: '田中美咲',
    nameInitial: '田',
    position: '看護師',
    department: '地域包括ケア病棟',
    employeeId: 'NS-2021-047',
    joinDate: '2021年4月1日',
    tenure: '4年3ヶ月',
    age: 36,
    birthDate: '1989年4月15日',
    evaluation: 'A',
    evaluationPeriod: '2024年上期',
    nextMeeting: '2025年1月15日',
    healthStatus: '良好',
    stressIndex: 48,
    engagement: 95,
    overtime: 12,
    paidLeaveRate: 78,
    avatar: 'bg-gradient-to-r from-green-500 to-emerald-600',
    email: 'tanaka.misaki@hospital.jp',
    phone: '080-1234-5678',
    emergencyContact: '090-8765-4321（配偶者）',
    address: '東京都世田谷区○○1-2-3',
    evaluationHistory: [
      { period: '2024年上期', overall: 'A', performance: 4.5, skills: 4.2, teamwork: 4.8, growth: 4.0, evaluator: '師長' },
      { period: '2023年下期', overall: 'B+', performance: 4.0, skills: 3.8, teamwork: 4.5, growth: 3.8, evaluator: '師長' },
      { period: '2023年上期', overall: 'B', performance: 3.5, skills: 3.5, teamwork: 4.2, growth: 3.5, evaluator: '主任' },
      { period: '2022年下期', overall: 'B-', performance: 3.2, skills: 3.2, teamwork: 3.8, growth: 3.0, evaluator: '主任' },
    ],
    skills: [
      { name: '基礎看護技術', level: 4, category: '基本技術' },
      { name: '認知症ケア', level: 5, category: '専門技術' },
      { name: 'チームワーク', level: 5, category: '対人スキル' },
      { name: 'リーダーシップ', level: 3, category: '管理スキル' },
      { name: '管理業務', level: 2, category: '管理スキル' },
    ],
    trainingHistory: [
      { name: 'リーダーシップ研修', date: '2024/10/05', category: '管理・指導', hours: 8, evaluation: '優秀', certificate: true },
      { name: '認知症ケア専門研修', date: '2024/08/20', category: '専門技術', hours: 4, evaluation: '優秀', certificate: true },
      { name: '医療安全研修', date: '2024/06/15', category: '安全管理', hours: 3, evaluation: '良好', certificate: true },
    ],
    assignmentHistory: [
      { date: '2023年6月1日', department: '地域包括ケア病棟', position: '看護師', reason: '専門性向上とリーダーシップ経験' },
      { date: '2021年10月1日', department: '内科病棟', position: '看護師', reason: '基礎スキル向上' },
      { date: '2021年4月1日', department: 'オリエンテーション', position: '新入職員', reason: '入職' },
    ],
  },
  'NS-2019-023': {
    id: 'NS-2019-023',
    name: '山田太郎',
    nameInitial: '山',
    position: '看護師主任',
    department: 'ICU',
    employeeId: 'NS-2019-023',
    joinDate: '2019年4月1日',
    tenure: '6年3ヶ月',
    age: 42,
    birthDate: '1983年7月22日',
    evaluation: 'A',
    evaluationPeriod: '2024年上期',
    nextMeeting: '2025年1月20日',
    healthStatus: '良好',
    stressIndex: 55,
    engagement: 88,
    overtime: 18,
    paidLeaveRate: 65,
    avatar: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    email: 'yamada.taro@hospital.jp',
    phone: '080-2345-6789',
    emergencyContact: '090-7654-3210（配偶者）',
    address: '東京都杉並区○○2-3-4',
    evaluationHistory: [
      { period: '2024年上期', overall: 'A', performance: 4.6, skills: 4.5, teamwork: 4.4, growth: 4.2, evaluator: '師長' },
      { period: '2023年下期', overall: 'A', performance: 4.5, skills: 4.4, teamwork: 4.3, growth: 4.0, evaluator: '師長' },
    ],
    skills: [
      { name: '救急看護', level: 5, category: '専門技術' },
      { name: 'ICU管理', level: 5, category: '専門技術' },
      { name: 'リーダーシップ', level: 4, category: '管理スキル' },
      { name: '後輩指導', level: 4, category: '管理スキル' },
    ],
    trainingHistory: [
      { name: '救急看護上級研修', date: '2024/09/10', category: '専門技術', hours: 16, evaluation: '優秀', certificate: true },
      { name: '管理職研修', date: '2024/07/15', category: '管理・指導', hours: 24, evaluation: '優秀', certificate: true },
    ],
    assignmentHistory: [
      { date: '2022年4月1日', department: 'ICU', position: '看護師主任', reason: '昇進' },
      { date: '2019年4月1日', department: 'ICU', position: '看護師', reason: '配属' },
    ],
  },
  'PT-2020-015': {
    id: 'PT-2020-015',
    name: '佐藤花子',
    nameInitial: '佐',
    position: '理学療法士',
    department: 'リハビリテーション科',
    employeeId: 'PT-2020-015',
    joinDate: '2020年4月1日',
    tenure: '5年3ヶ月',
    age: 28,
    birthDate: '1997年2月10日',
    evaluation: 'B+',
    evaluationPeriod: '2024年上期',
    nextMeeting: '2025年1月25日',
    healthStatus: '良好',
    stressIndex: 42,
    engagement: 92,
    overtime: 8,
    paidLeaveRate: 85,
    avatar: 'bg-gradient-to-r from-purple-500 to-pink-600',
    email: 'sato.hanako@hospital.jp',
    phone: '080-3456-7890',
    emergencyContact: '090-6543-2109（母親）',
    address: '東京都渋谷区○○3-4-5',
    evaluationHistory: [
      { period: '2024年上期', overall: 'B+', performance: 4.1, skills: 4.0, teamwork: 4.3, growth: 4.2, evaluator: '主任' },
      { period: '2023年下期', overall: 'B', performance: 3.8, skills: 3.7, teamwork: 4.0, growth: 3.9, evaluator: '主任' },
    ],
    skills: [
      { name: '運動療法', level: 4, category: '専門技術' },
      { name: '評価技術', level: 4, category: '専門技術' },
      { name: '患者コミュニケーション', level: 5, category: '対人スキル' },
      { name: 'チーム連携', level: 4, category: '対人スキル' },
    ],
    trainingHistory: [
      { name: '運動器リハビリ研修', date: '2024/08/25', category: '専門技術', hours: 12, evaluation: '良好', certificate: true },
      { name: 'コミュニケーション研修', date: '2024/05/20', category: '対人スキル', hours: 6, evaluation: '優秀', certificate: true },
    ],
    assignmentHistory: [
      { date: '2020年4月1日', department: 'リハビリテーション科', position: '理学療法士', reason: '新卒配属' },
    ],
  },
  'DR-2018-008': {
    id: 'DR-2018-008',
    name: '鈴木一郎',
    nameInitial: '鈴',
    position: '医師（内科部長）',
    department: '内科',
    employeeId: 'DR-2018-008',
    joinDate: '2018年4月1日',
    tenure: '7年3ヶ月',
    age: 45,
    birthDate: '1980年3月5日',
    evaluation: 'S',
    evaluationPeriod: '2024年上期',
    nextMeeting: '2025年2月1日',
    healthStatus: '注意',
    stressIndex: 72,
    engagement: 75,
    overtime: 45,
    paidLeaveRate: 35,
    avatar: 'bg-gradient-to-r from-red-500 to-orange-600',
    email: 'suzuki.ichiro@hospital.jp',
    phone: '080-4567-8901',
    emergencyContact: '090-5432-1098（配偶者）',
    address: '東京都目黒区○○4-5-6',
    evaluationHistory: [
      { period: '2024年上期', overall: 'S', performance: 4.8, skills: 4.9, teamwork: 4.5, growth: 4.6, evaluator: '院長' },
      { period: '2023年下期', overall: 'A', performance: 4.6, skills: 4.7, teamwork: 4.4, growth: 4.5, evaluator: '院長' },
    ],
    skills: [
      { name: '内科診療', level: 5, category: '専門技術' },
      { name: '診断技術', level: 5, category: '専門技術' },
      { name: '部門管理', level: 4, category: '管理スキル' },
      { name: '医療安全管理', level: 5, category: '管理スキル' },
    ],
    trainingHistory: [
      { name: '最新内科治療セミナー', date: '2024/09/15', category: '専門技術', hours: 8, evaluation: '優秀', certificate: true },
      { name: '病院管理者研修', date: '2024/06/10', category: '管理・指導', hours: 16, evaluation: '優秀', certificate: true },
    ],
    assignmentHistory: [
      { date: '2023年4月1日', department: '内科', position: '内科部長', reason: '昇進' },
      { date: '2018年4月1日', department: '内科', position: '医師', reason: '中途採用' },
    ],
  },
  'PH-2022-031': {
    id: 'PH-2022-031',
    name: '高橋美穂',
    nameInitial: '高',
    position: '薬剤師',
    department: '薬剤部',
    employeeId: 'PH-2022-031',
    joinDate: '2022年4月1日',
    tenure: '3年3ヶ月',
    age: 26,
    birthDate: '1999年9月18日',
    evaluation: 'B',
    evaluationPeriod: '2024年上期',
    nextMeeting: '2025年1月30日',
    healthStatus: '良好',
    stressIndex: 38,
    engagement: 90,
    overtime: 5,
    paidLeaveRate: 90,
    avatar: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    email: 'takahashi.miho@hospital.jp',
    phone: '080-5678-9012',
    emergencyContact: '090-4321-0987（父親）',
    address: '東京都新宿区○○5-6-7',
    evaluationHistory: [
      { period: '2024年上期', overall: 'B', performance: 3.6, skills: 3.5, teamwork: 3.8, growth: 3.9, evaluator: '薬剤部長' },
      { period: '2023年下期', overall: 'B-', performance: 3.3, skills: 3.2, teamwork: 3.5, growth: 3.6, evaluator: '薬剤部長' },
    ],
    skills: [
      { name: '調剤技術', level: 3, category: '専門技術' },
      { name: '服薬指導', level: 3, category: '専門技術' },
      { name: '在庫管理', level: 4, category: '管理スキル' },
      { name: 'DI業務', level: 3, category: '専門技術' },
    ],
    trainingHistory: [
      { name: '服薬指導スキルアップ研修', date: '2024/07/20', category: '専門技術', hours: 6, evaluation: '良好', certificate: true },
      { name: '医薬品安全管理研修', date: '2024/04/15', category: '安全管理', hours: 4, evaluation: '良好', certificate: true },
    ],
    assignmentHistory: [
      { date: '2022年4月1日', department: '薬剤部', position: '薬剤師', reason: '新卒配属' },
    ],
  },
};

// スタッフ一覧データ（ダッシュボード用）
export const staffListData = Object.values(staffDatabase).map(staff => ({
  id: staff.id,
  name: staff.name,
  nameInitial: staff.nameInitial,
  department: staff.department,
  position: staff.position,
  status: staff.evaluation === 'S' || staff.evaluation === 'A' ? 'excellent' : 
          staff.evaluation === 'B+' || staff.evaluation === 'B' ? 'good' : 'average',
  priority: staff.stressIndex > 60 ? 'high' : 
           staff.stressIndex > 40 ? 'medium' : 'normal',
  avatar: staff.avatar,
  stressIndex: staff.stressIndex,
  engagement: staff.engagement,
}));