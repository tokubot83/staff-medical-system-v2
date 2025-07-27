// 人材フローデモデータ

export interface NewEmployee {
  id: string;
  name: string;
  photo: string;
  joinDate: string;
  daysElapsed: number;
  department: string;
  position: string;
  employmentType: string;
  recruitmentRoute: string;
  progress: number;
  status: 'good' | 'warning' | 'alert';
  statusText: string;
  trialPeriodEnd: string;
  trialPeriodStatus: 'good' | 'warning' | 'alert';
  onboardingProgress: number;
  requiredTrainingComplete: boolean;
  mentorAssigned: boolean;
  firstInterviewDate?: string;
  nextInterviewDate?: string;
  facility: string;
}

export interface RiskEmployee {
  id: string;
  name: string;
  category: 'exit' | 'highRisk' | 'longAbsence' | 'retirement';
  department: string;
  position: string;
  facility: string;
  
  // 退職予定者向け
  exitDate?: string;
  handoverProgress?: number;
  successor?: string;
  
  // 高リスク者向け
  riskScore?: number;
  riskFactors?: string[];
  recommendedAction?: string;
  
  // 長期休職者向け
  absencePeriod?: string;
  returnDate?: string;
  followUpStatus?: string;
  
  // 定年間近職員向け
  retirementDate?: string;
  reemploymentIntention?: 'yes' | 'no' | 'considering';
  knowledgeTransferStatus?: number;
}

// 新入職員データ（30名）
export const demoNewEmployees: NewEmployee[] = [
  // 小原病院 - 看護師（8名）
  {
    id: 'NS-2024-101',
    name: '山田花子',
    photo: '👩‍⚕️',
    joinDate: '2024/10/1',
    daysElapsed: 87,
    department: '3階病棟',
    position: '看護師',
    employmentType: '正社員',
    recruitmentRoute: '新卒',
    progress: 85,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/1/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 90,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/10/15',
    nextInterviewDate: '2025/1/15',
    facility: '小原病院'
  },
  {
    id: 'NS-2024-102',
    name: '佐藤美穂',
    photo: '👩‍⚕️',
    joinDate: '2024/11/1',
    daysElapsed: 56,
    department: '4階病棟',
    position: '看護師',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 75,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/2/28',
    trialPeriodStatus: 'good',
    onboardingProgress: 80,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/11/15',
    nextInterviewDate: '2025/2/15',
    facility: '小原病院'
  },
  {
    id: 'NS-2024-103',
    name: '高橋愛',
    photo: '👩‍⚕️',
    joinDate: '2024/12/1',
    daysElapsed: 26,
    department: '外来',
    position: '看護師',
    employmentType: 'パート',
    recruitmentRoute: '紹介',
    progress: 60,
    status: 'warning',
    statusText: '外来業務習得中',
    trialPeriodEnd: '2025/3/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 65,
    requiredTrainingComplete: false,
    mentorAssigned: true,
    nextInterviewDate: '2025/1/31',
    facility: '小原病院'
  },
  {
    id: 'NS-2024-104',
    name: '伊藤さくら',
    photo: '👩‍⚕️',
    joinDate: '2024/7/1',
    daysElapsed: 178,
    department: '5階病棟',
    position: '看護師',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 95,
    status: 'good',
    statusText: '優秀な成績',
    trialPeriodEnd: '2024/10/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 100,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/7/15',
    facility: '小原病院'
  },
  
  // 立神リハビリテーション温泉病院 - 看護師（4名）
  {
    id: 'TG-NS-2024-001',
    name: '中村真美',
    photo: '👩‍⚕️',
    joinDate: '2024/9/1',
    daysElapsed: 117,
    department: '第１病棟',
    position: '看護師',
    employmentType: '正社員',
    recruitmentRoute: '新卒',
    progress: 88,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2024/12/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 92,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/9/15',
    facility: '立神リハビリテーション温泉病院'
  },
  {
    id: 'TG-NS-2024-002',
    name: '小林由美',
    photo: '👩‍⚕️',
    joinDate: '2024/10/15',
    daysElapsed: 72,
    department: '外来',
    position: '看護師',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 78,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/1/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 82,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/11/1',
    nextInterviewDate: '2025/1/31',
    facility: '立神リハビリテーション温泉病院'
  },
  {
    id: 'TG-NS-2024-003',
    name: '松本恵子',
    photo: '👩‍⚕️',
    joinDate: '2024/11/15',
    daysElapsed: 41,
    department: '介護医療院',
    position: '看護師',
    employmentType: '正社員',
    recruitmentRoute: '紹介',
    progress: 70,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/2/28',
    trialPeriodStatus: 'good',
    onboardingProgress: 72,
    requiredTrainingComplete: false,
    mentorAssigned: true,
    nextInterviewDate: '2025/2/15',
    facility: '立神リハビリテーション温泉病院'
  },
  {
    id: 'TG-NS-2024-004',
    name: '渡辺美香',
    photo: '👩‍⚕️',
    joinDate: '2024/8/1',
    daysElapsed: 147,
    department: '第１病棟',
    position: '看護師',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 92,
    status: 'good',
    statusText: '優秀な成績',
    trialPeriodEnd: '2024/11/30',
    trialPeriodStatus: 'good',
    onboardingProgress: 100,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/8/15',
    facility: '立神リハビリテーション温泉病院'
  },
  
  // 小原病院 - 看護補助者（3名）
  {
    id: 'NA-2024-201',
    name: '田中優子',
    photo: '👤',
    joinDate: '2024/10/15',
    daysElapsed: 72,
    department: '3階病棟',
    position: '看護補助者',
    employmentType: 'パート',
    recruitmentRoute: '中途',
    progress: 80,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/1/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 85,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/11/1',
    nextInterviewDate: '2025/1/31',
    facility: '小原病院'
  },
  {
    id: 'NA-2024-202',
    name: '鈴木明美',
    photo: '👤',
    joinDate: '2024/12/15',
    daysElapsed: 11,
    department: '4階病棟',
    position: '看護補助者',
    employmentType: 'パート',
    recruitmentRoute: '紹介',
    progress: 40,
    status: 'warning',
    statusText: '研修中',
    trialPeriodEnd: '2025/3/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 45,
    requiredTrainingComplete: false,
    mentorAssigned: true,
    nextInterviewDate: '2025/1/15',
    facility: '小原病院'
  },
  
  // 立神リハビリテーション温泉病院 - 看護補助者（1名）
  {
    id: 'TG-NA-2024-001',
    name: '加藤洋子',
    photo: '👤',
    joinDate: '2024/11/1',
    daysElapsed: 56,
    department: '第１病棟',
    position: '看護補助者',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 75,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/2/28',
    trialPeriodStatus: 'good',
    onboardingProgress: 78,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/11/15',
    nextInterviewDate: '2025/2/15',
    facility: '立神リハビリテーション温泉病院'
  },
  
  // 小原病院 - 介護士（2名）
  {
    id: 'CW-2024-301',
    name: '木村健太',
    photo: '👨‍⚕️',
    joinDate: '2024/9/15',
    daysElapsed: 102,
    department: '療養病棟',
    position: '介護士',
    employmentType: '正社員',
    recruitmentRoute: '新卒',
    progress: 85,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2024/12/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 88,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/10/1',
    facility: '小原病院'
  },
  
  // 立神リハビリテーション温泉病院 - 介護士（1名）
  {
    id: 'TG-CW-2024-001',
    name: '山本太郎',
    photo: '👨‍⚕️',
    joinDate: '2024/10/1',
    daysElapsed: 87,
    department: '介護医療院',
    position: '介護士',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 82,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/1/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 85,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/10/15',
    nextInterviewDate: '2025/1/15',
    facility: '立神リハビリテーション温泉病院'
  },
  
  // 小原病院 - 介護福祉士（2名）
  {
    id: 'CCW-2024-401',
    name: '吉田綾子',
    photo: '👩‍⚕️',
    joinDate: '2024/8/15',
    daysElapsed: 133,
    department: '療養病棟',
    position: '介護福祉士',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 90,
    status: 'good',
    statusText: '優秀な成績',
    trialPeriodEnd: '2024/11/30',
    trialPeriodStatus: 'good',
    onboardingProgress: 95,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/9/1',
    facility: '小原病院'
  },
  
  // 立神リハビリテーション温泉病院 - 介護福祉士（1名）
  {
    id: 'TG-CCW-2024-001',
    name: '斎藤美智子',
    photo: '👩‍⚕️',
    joinDate: '2024/11/15',
    daysElapsed: 41,
    department: '介護医療院',
    position: '介護福祉士',
    employmentType: '正社員',
    recruitmentRoute: '紹介',
    progress: 68,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/2/28',
    trialPeriodStatus: 'good',
    onboardingProgress: 70,
    requiredTrainingComplete: false,
    mentorAssigned: true,
    nextInterviewDate: '2025/2/15',
    facility: '立神リハビリテーション温泉病院'
  },
  
  // 小原病院 - 理学療法士（3名）
  {
    id: 'PT-2024-501',
    name: '橋本大輔',
    photo: '👨‍⚕️',
    joinDate: '2024/7/15',
    daysElapsed: 164,
    department: 'リハビリテーション科',
    position: '理学療法士',
    employmentType: '正社員',
    recruitmentRoute: '新卒',
    progress: 93,
    status: 'good',
    statusText: '優秀な成績',
    trialPeriodEnd: '2024/10/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 100,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/8/1',
    facility: '小原病院'
  },
  {
    id: 'PT-2024-502',
    name: '川口智也',
    photo: '👨‍⚕️',
    joinDate: '2024/11/1',
    daysElapsed: 56,
    department: 'リハビリテーション科',
    position: '理学療法士',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 76,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/2/28',
    trialPeriodStatus: 'good',
    onboardingProgress: 80,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/11/15',
    nextInterviewDate: '2025/2/15',
    facility: '小原病院'
  },
  
  // 立神リハビリテーション温泉病院 - 理学療法士（1名）
  {
    id: 'TG-PT-2024-001',
    name: '森田健一',
    photo: '👨‍⚕️',
    joinDate: '2024/9/1',
    daysElapsed: 117,
    department: 'リハビリテーション部門',
    position: '理学療法士',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 87,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2024/12/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 90,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/9/15',
    facility: '立神リハビリテーション温泉病院'
  },
  
  // 小原病院 - 作業療法士（2名）
  {
    id: 'OT-2024-601',
    name: '村上香織',
    photo: '👩‍⚕️',
    joinDate: '2024/8/1',
    daysElapsed: 147,
    department: 'リハビリテーション科',
    position: '作業療法士',
    employmentType: '正社員',
    recruitmentRoute: '新卒',
    progress: 91,
    status: 'good',
    statusText: '優秀な成績',
    trialPeriodEnd: '2024/11/30',
    trialPeriodStatus: 'good',
    onboardingProgress: 95,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/8/15',
    facility: '小原病院'
  },
  {
    id: 'OT-2024-602',
    name: '岡田理恵',
    photo: '👩‍⚕️',
    joinDate: '2024/12/1',
    daysElapsed: 26,
    department: 'リハビリテーション科',
    position: '作業療法士',
    employmentType: 'パート',
    recruitmentRoute: '中途',
    progress: 55,
    status: 'warning',
    statusText: '業務習得中',
    trialPeriodEnd: '2025/3/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 60,
    requiredTrainingComplete: false,
    mentorAssigned: true,
    nextInterviewDate: '2025/1/31',
    facility: '小原病院'
  },
  
  // 立神リハビリテーション温泉病院 - 作業療法士（2名）
  {
    id: 'TG-OT-2024-001',
    name: '清水直樹',
    photo: '👨‍⚕️',
    joinDate: '2024/10/15',
    daysElapsed: 72,
    department: 'リハビリテーション部門',
    position: '作業療法士',
    employmentType: '正社員',
    recruitmentRoute: '中途',
    progress: 79,
    status: 'good',
    statusText: '順調に適応中',
    trialPeriodEnd: '2025/1/31',
    trialPeriodStatus: 'good',
    onboardingProgress: 82,
    requiredTrainingComplete: true,
    mentorAssigned: true,
    firstInterviewDate: '2024/11/1',
    nextInterviewDate: '2025/1/31',
    facility: '立神リハビリテーション温泉病院'
  },
  {
    id: 'TG-OT-2024-002',
    name: '藤井裕子',
    photo: '👩‍⚕️',
    joinDate: '2024/11/15',
    daysElapsed: 41,
    department: 'リハビリテーション部門',
    position: '作業療法士',
    employmentType: '正社員',
    recruitmentRoute: '新卒',
    progress: 65,
    status: 'warning',
    statusText: '新卒研修中',
    trialPeriodEnd: '2025/2/28',
    trialPeriodStatus: 'good',
    onboardingProgress: 68,
    requiredTrainingComplete: false,
    mentorAssigned: true,
    nextInterviewDate: '2025/2/15',
    facility: '立神リハビリテーション温泉病院'
  }
];

// 退職リスク管理データ（20名）
export const demoRiskEmployees: RiskEmployee[] = [
  // 退職予定者（5名）
  {
    id: 'RE-001',
    name: '山田太郎',
    category: 'exit',
    department: '5階病棟',
    position: '看護師',
    facility: '小原病院',
    exitDate: '2025/3/31',
    handoverProgress: 65,
    successor: '後任者選定中'
  },
  {
    id: 'RE-002',
    name: '佐藤花子',
    category: 'exit',
    department: 'リハビリテーション科',
    position: '理学療法士',
    facility: '小原病院',
    exitDate: '2025/2/28',
    handoverProgress: 80,
    successor: '内定者あり（4月入職予定）'
  },
  {
    id: 'RE-003',
    name: '鈴木一郎',
    category: 'exit',
    department: '介護医療院',
    position: '介護福祉士',
    facility: '立神リハビリテーション温泉病院',
    exitDate: '2025/4/30',
    handoverProgress: 40,
    successor: '募集中'
  },
  {
    id: 'RE-004',
    name: '高橋美穂',
    category: 'exit',
    department: '外来',
    position: '看護師',
    facility: '立神リハビリテーション温泉病院',
    exitDate: '2025/3/15',
    handoverProgress: 70,
    successor: '内部異動で対応予定'
  },
  {
    id: 'RE-005',
    name: '田中健二',
    category: 'exit',
    department: '3階病棟',
    position: '看護補助者',
    facility: '小原病院',
    exitDate: '2025/2/15',
    handoverProgress: 90,
    successor: '後任者研修中'
  },
  
  // 高リスク者（8名）
  {
    id: 'RH-001',
    name: '伊藤美智子',
    category: 'highRisk',
    department: '4階病棟',
    position: '看護師',
    facility: '小原病院',
    riskScore: 85,
    riskFactors: ['残業時間増加', 'ストレス指数上昇', '面談希望'],
    recommendedAction: '早急な面談実施と業務量調整'
  },
  {
    id: 'RH-002',
    name: '渡辺浩司',
    category: 'highRisk',
    department: 'リハビリテーション部門',
    position: '作業療法士',
    facility: '立神リハビリテーション温泉病院',
    riskScore: 78,
    riskFactors: ['エンゲージメント低下', '有給取得率低下'],
    recommendedAction: 'キャリア面談の実施'
  },
  {
    id: 'RH-003',
    name: '中村さやか',
    category: 'highRisk',
    department: '第１病棟',
    position: '看護師',
    facility: '立神リハビリテーション温泉病院',
    riskScore: 82,
    riskFactors: ['人間関係の悩み', '体調不良頻発'],
    recommendedAction: '産業医面談と部署異動検討'
  },
  {
    id: 'RH-004',
    name: '小林大介',
    category: 'highRisk',
    department: '療養病棟',
    position: '介護士',
    facility: '小原病院',
    riskScore: 75,
    riskFactors: ['スキルアップ希望', '給与への不満'],
    recommendedAction: '研修機会の提供と評価面談'
  },
  {
    id: 'RH-005',
    name: '松本由美',
    category: 'highRisk',
    department: '5階病棟',
    position: '看護師',
    facility: '小原病院',
    riskScore: 80,
    riskFactors: ['家庭との両立困難', '夜勤負担'],
    recommendedAction: '勤務形態の見直し'
  },
  {
    id: 'RH-006',
    name: '加藤正人',
    category: 'highRisk',
    department: 'リハビリテーション科',
    position: '理学療法士',
    facility: '小原病院',
    riskScore: 77,
    riskFactors: ['転職活動中の噂', 'モチベーション低下'],
    recommendedAction: '緊急面談の実施'
  },
  {
    id: 'RH-007',
    name: '山口恵子',
    category: 'highRisk',
    department: '外来',
    position: '看護補助者',
    facility: '小原病院',
    riskScore: 73,
    riskFactors: ['人員不足による負担増', '休憩時間確保困難'],
    recommendedAction: '人員補充と業務改善'
  },
  {
    id: 'RH-008',
    name: '木村智也',
    category: 'highRisk',
    department: '介護医療院',
    position: '介護福祉士',
    facility: '立神リハビリテーション温泉病院',
    riskScore: 79,
    riskFactors: ['キャリアアップ停滞', '他施設からの引き抜き'],
    recommendedAction: '昇進・昇格の検討'
  },
  
  // 長期休職者（3名）
  {
    id: 'LA-001',
    name: '斎藤真理子',
    category: 'longAbsence',
    department: '3階病棟',
    position: '看護師',
    facility: '小原病院',
    absencePeriod: '2024/10/1〜',
    returnDate: '2025/2/1（予定）',
    followUpStatus: '産業医と月1回面談実施中'
  },
  {
    id: 'LA-002',
    name: '橋本健太',
    category: 'longAbsence',
    department: 'リハビリテーション部門',
    position: '理学療法士',
    facility: '立神リハビリテーション温泉病院',
    absencePeriod: '2024/11/15〜',
    returnDate: '未定',
    followUpStatus: '療養中、月2回電話連絡'
  },
  {
    id: 'LA-003',
    name: '森田由香',
    category: 'longAbsence',
    department: '4階病棟',
    position: '看護師',
    facility: '小原病院',
    absencePeriod: '2024/9/1〜',
    returnDate: '2025/1/15（予定）',
    followUpStatus: 'リハビリ勤務準備中'
  },
  
  // 定年間近職員（4名）
  {
    id: 'RT-001',
    name: '吉田正雄',
    category: 'retirement',
    department: '診療技術部',
    position: '臨床検査技師',
    facility: '小原病院',
    retirementDate: '2025/3/31',
    reemploymentIntention: 'yes',
    knowledgeTransferStatus: 75
  },
  {
    id: 'RT-002',
    name: '田村和子',
    category: 'retirement',
    department: '看護部',
    position: '看護師長',
    facility: '小原病院',
    retirementDate: '2025/6/30',
    reemploymentIntention: 'considering',
    knowledgeTransferStatus: 60
  },
  {
    id: 'RT-003',
    name: '川口敏夫',
    category: 'retirement',
    department: '事務部門',
    position: '総務課長',
    facility: '立神リハビリテーション温泉病院',
    retirementDate: '2025/9/30',
    reemploymentIntention: 'no',
    knowledgeTransferStatus: 45
  },
  {
    id: 'RT-004',
    name: '野村幸子',
    category: 'retirement',
    department: '栄養科',
    position: '管理栄養士',
    facility: '小原病院',
    retirementDate: '2025/12/31',
    reemploymentIntention: 'yes',
    knowledgeTransferStatus: 30
  }
];

// 部署間異動フローデータ
export interface FlowData {
  from: string;
  to: string;
  count: number;
  percentage: number;
}

export const demoFlowData: FlowData[] = [
  // 看護部内の異動
  { from: '3階病棟', to: '4階病棟', count: 5, percentage: 2.5 },
  { from: '4階病棟', to: '5階病棟', count: 3, percentage: 1.5 },
  { from: '5階病棟', to: '外来', count: 4, percentage: 2.0 },
  { from: '外来', to: '3階病棟', count: 2, percentage: 1.0 },
  
  // リハビリ部門の異動
  { from: 'リハビリテーション科', to: 'リハビリテーション部門', count: 3, percentage: 1.5 },
  { from: 'リハビリテーション部門', to: 'リハビリテーション科', count: 2, percentage: 1.0 },
  
  // 施設間異動
  { from: '小原病院', to: '立神リハビリテーション温泉病院', count: 6, percentage: 3.0 },
  { from: '立神リハビリテーション温泉病院', to: '小原病院', count: 4, percentage: 2.0 },
  
  // キャリアアップ異動
  { from: '看護師', to: '主任看護師', count: 3, percentage: 1.5 },
  { from: '理学療法士', to: '主任理学療法士', count: 2, percentage: 1.0 },
  { from: '介護士', to: '介護福祉士', count: 4, percentage: 2.0 }
];

// 部署統計データ
export interface DepartmentStats {
  name: string;
  inflow: number;
  outflow: number;
  net: number;
  current: number;
}

export const demoDepartmentStats: DepartmentStats[] = [
  { name: '3階病棟', inflow: 8, outflow: 5, net: 3, current: 45 },
  { name: '4階病棟', inflow: 6, outflow: 4, net: 2, current: 42 },
  { name: '5階病棟', inflow: 5, outflow: 6, net: -1, current: 38 },
  { name: '外来', inflow: 7, outflow: 3, net: 4, current: 28 },
  { name: 'リハビリテーション科', inflow: 4, outflow: 3, net: 1, current: 22 },
  { name: 'リハビリテーション部門', inflow: 3, outflow: 2, net: 1, current: 18 },
  { name: '第１病棟', inflow: 5, outflow: 4, net: 1, current: 35 },
  { name: '介護医療院', inflow: 6, outflow: 5, net: 1, current: 40 }
];

// 職種別サマリーデータ
export const positionSummary = {
  '看護師': { count: 150, newHires: 12, exits: 2, riskCount: 3 },
  '看護補助者': { count: 40, newHires: 4, exits: 1, riskCount: 1 },
  '介護士': { count: 30, newHires: 3, exits: 0, riskCount: 1 },
  '介護福祉士': { count: 35, newHires: 3, exits: 1, riskCount: 2 },
  '理学療法士': { count: 25, newHires: 4, exits: 1, riskCount: 2 },
  '作業療法士': { count: 20, newHires: 4, exits: 0, riskCount: 1 }
};

// 施設別サマリーデータ
export const facilitySummary = {
  '小原病院': {
    totalStaff: 420,
    newEmployees: 20,
    exitPlanned: 3,
    highRisk: 6,
    longAbsence: 2
  },
  '立神リハビリテーション温泉病院': {
    totalStaff: 180,
    newEmployees: 10,
    exitPlanned: 2,
    highRisk: 2,
    longAbsence: 1
  }
};