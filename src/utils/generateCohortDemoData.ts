import { StaffDetail } from '@/types/staff';

// 職種別の基本データテンプレート
const positionTemplates = {
  nurse: {
    positions: ['看護師', '主任看護師', '師長', '看護部長'],
    skills: [
      { name: '急性期看護', category: '専門スキル' },
      { name: '患者対応', category: 'コミュニケーション' },
      { name: '医療機器操作', category: '技術スキル' },
      { name: 'チーム医療', category: 'チームワーク' }
    ],
    trainings: [
      { name: '急性期看護研修', category: '専門研修', hours: 40 },
      { name: '感染管理研修', category: '必須研修', hours: 8 },
      { name: 'BLS研修', category: '資格研修', hours: 16 }
    ]
  },
  nursingAssistant: {
    positions: ['看護補助者', '主任看護補助者'],
    skills: [
      { name: '生活援助', category: '基本スキル' },
      { name: '患者移乗', category: '技術スキル' },
      { name: '清潔ケア', category: '基本スキル' },
      { name: 'コミュニケーション', category: 'ソフトスキル' }
    ],
    trainings: [
      { name: '看護補助者基礎研修', category: '基礎研修', hours: 24 },
      { name: '介護技術研修', category: '技術研修', hours: 16 },
      { name: '認知症ケア研修', category: '専門研修', hours: 8 }
    ]
  },
  caregiver: {
    positions: ['介護士', '介護主任'],
    skills: [
      { name: '介護技術', category: '専門スキル' },
      { name: '認知症ケア', category: '専門スキル' },
      { name: 'レクリエーション', category: '活動スキル' },
      { name: '記録作成', category: '事務スキル' }
    ],
    trainings: [
      { name: '介護技術基礎研修', category: '基礎研修', hours: 32 },
      { name: '認知症ケア専門研修', category: '専門研修', hours: 24 },
      { name: 'レクリエーション研修', category: '技術研修', hours: 8 }
    ]
  },
  careworker: {
    positions: ['介護福祉士', '主任介護福祉士'],
    skills: [
      { name: '介護計画立案', category: '専門スキル' },
      { name: '身体介護', category: '専門スキル' },
      { name: '家族支援', category: 'コミュニケーション' },
      { name: 'ケアマネジメント', category: '管理スキル' }
    ],
    trainings: [
      { name: '介護福祉士実務研修', category: '資格研修', hours: 450 },
      { name: 'ケアプラン作成研修', category: '専門研修', hours: 16 },
      { name: '介護リーダー研修', category: 'リーダー研修', hours: 24 }
    ]
  },
  physicalTherapist: {
    positions: ['理学療法士', '主任理学療法士', 'リハビリ科長'],
    skills: [
      { name: '運動療法', category: '専門スキル' },
      { name: '評価技術', category: '専門スキル' },
      { name: '物理療法', category: '専門スキル' },
      { name: '患者指導', category: 'コミュニケーション' }
    ],
    trainings: [
      { name: '運動器リハビリテーション研修', category: '専門研修', hours: 32 },
      { name: '脳血管リハビリテーション研修', category: '専門研修', hours: 40 },
      { name: '呼吸器リハビリテーション研修', category: '専門研修', hours: 24 }
    ]
  },
  occupationalTherapist: {
    positions: ['作業療法士', '主任作業療法士'],
    skills: [
      { name: '日常生活動作訓練', category: '専門スキル' },
      { name: '認知機能評価', category: '専門スキル' },
      { name: '上肢機能訓練', category: '専門スキル' },
      { name: '環境調整', category: '実践スキル' }
    ],
    trainings: [
      { name: '作業療法評価研修', category: '専門研修', hours: 24 },
      { name: '高次脳機能障害研修', category: '専門研修', hours: 32 },
      { name: '福祉用具選定研修', category: '技術研修', hours: 16 }
    ]
  }
};

// ランダムデータ生成用のヘルパー関数
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function calculateTenure(joinDate: Date): string {
  const today = new Date();
  const years = today.getFullYear() - joinDate.getFullYear();
  const months = today.getMonth() - joinDate.getMonth() + (years * 12);
  const actualYears = Math.floor(months / 12);
  const actualMonths = months % 12;
  return `${actualYears}年${actualMonths}ヶ月`;
}

// 世代別の特性を定義
function getGenerationCharacteristics(age: number) {
  if (age < 27) { // Z世代（1997年以降生まれ）
    return {
      engagementRange: [70, 85],
      stressRange: [35, 65],
      overtimeRange: [5, 20],
      paidLeaveRange: [60, 85],
      performanceRange: [3.5, 4.5],
      growthRange: [4.0, 5.0]
    };
  } else if (age < 43) { // ミレニアル世代（1981-1996年生まれ）
    return {
      engagementRange: [75, 90],
      stressRange: [30, 55],
      overtimeRange: [10, 30],
      paidLeaveRange: [50, 75],
      performanceRange: [3.8, 4.8],
      growthRange: [3.5, 4.5]
    };
  } else if (age < 59) { // X世代（1965-1980年生まれ）
    return {
      engagementRange: [80, 95],
      stressRange: [25, 50],
      overtimeRange: [15, 35],
      paidLeaveRange: [40, 65],
      performanceRange: [4.0, 4.9],
      growthRange: [3.0, 4.0]
    };
  } else { // ベビーブーマー世代（1946-1964年生まれ）
    return {
      engagementRange: [85, 95],
      stressRange: [20, 45],
      overtimeRange: [5, 25],
      paidLeaveRange: [35, 60],
      performanceRange: [4.2, 5.0],
      growthRange: [2.5, 3.5]
    };
  }
}

// 部署別の配属先を定義
const departmentsByFacility = {
  '小原病院': {
    nursing: ['3階病棟', '4階病棟', '5階病棟', '外来', '人工透析室'],
    rehabilitation: ['リハビリテーション科'],
    care: ['3階病棟', '4階病棟', '5階病棟']
  },
  '立神リハビリテーション温泉病院': {
    nursing: ['第１病棟', '外来', '介護医療院'],
    rehabilitation: ['リハビリテーション部門'],
    care: ['第１病棟', '介護医療院']
  }
};

// 名前のリスト
const firstNames = {
  male: ['太郎', '一郎', '健太', '大輔', '翔太', '拓海', '悠斗', '陽太', '健司', '雄一'],
  female: ['花子', '美咲', '愛子', '由美', '真由', '優子', '明日香', '麻衣', '千尋', '奈々']
};

const lastNames = ['佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤'];

// スタッフデータを生成する関数
export function generateCohortDemoData(
  positionType: keyof typeof positionTemplates,
  facility: string,
  count: number,
  startId: number
): StaffDetail[] {
  const template = positionTemplates[positionType];
  const staffList: StaffDetail[] = [];
  const facilityCode = facility === '小原病院' ? 'OH' : 'TR';
  const positionCode = {
    nurse: 'NS',
    nursingAssistant: 'NA',
    caregiver: 'CG',
    careworker: 'CW',
    physicalTherapist: 'PT',
    occupationalTherapist: 'OT'
  }[positionType];

  for (let i = 0; i < count; i++) {
    const gender = Math.random() > 0.3 ? 'female' : 'male'; // 看護・介護系は女性が多い傾向
    const firstName = firstNames[gender][randomInt(0, 9)];
    const lastName = lastNames[randomInt(0, 9)];
    const name = `${lastName}${firstName}`;
    
    // 年齢を世代別に設定
    const ageGroup = randomInt(1, 4);
    let birthYear: number;
    switch (ageGroup) {
      case 1: birthYear = randomInt(1997, 2002); break; // Z世代
      case 2: birthYear = randomInt(1981, 1996); break; // ミレニアル世代
      case 3: birthYear = randomInt(1965, 1980); break; // X世代
      default: birthYear = randomInt(1955, 1964); break; // ベビーブーマー世代
    }
    
    const birthDate = new Date(birthYear, randomInt(0, 11), randomInt(1, 28));
    const age = calculateAge(birthDate);
    
    // 入社年を年齢に応じて設定
    const minJoinYear = Math.max(birthYear + 18, 2010);
    const maxJoinYear = Math.min(2024, birthYear + 40);
    const joinYear = randomInt(minJoinYear, maxJoinYear);
    const joinDate = new Date(joinYear, 3, 1); // 4月1日入社
    
    const genCharacteristics = getGenerationCharacteristics(age);
    
    // 部署を決定
    let department: string;
    if (positionType === 'nurse' || positionType === 'nursingAssistant') {
      department = departmentsByFacility[facility].nursing[randomInt(0, departmentsByFacility[facility].nursing.length - 1)];
    } else if (positionType === 'physicalTherapist' || positionType === 'occupationalTherapist') {
      department = departmentsByFacility[facility].rehabilitation[0];
    } else {
      department = departmentsByFacility[facility].care[randomInt(0, departmentsByFacility[facility].care.length - 1)];
    }
    
    // 職位を経験年数に応じて決定
    const tenure = new Date().getFullYear() - joinYear;
    let positionIndex = 0;
    if (tenure > 15 && template.positions.length > 3) positionIndex = 3;
    else if (tenure > 10 && template.positions.length > 2) positionIndex = 2;
    else if (tenure > 5 && template.positions.length > 1) positionIndex = 1;
    
    const position = template.positions[Math.min(positionIndex, template.positions.length - 1)];
    
    // 評価グレードを決定
    const evaluationGrades = ['S', 'A', 'B', 'C'];
    const evaluationWeights = [0.1, 0.4, 0.4, 0.1]; // S:10%, A:40%, B:40%, C:10%
    let evaluationGrade = 'B';
    const rand = Math.random();
    let cumulative = 0;
    for (let j = 0; j < evaluationWeights.length; j++) {
      cumulative += evaluationWeights[j];
      if (rand < cumulative) {
        evaluationGrade = evaluationGrades[j];
        break;
      }
    }
    
    // IDを生成
    const staffId = `${facilityCode}-${positionCode}-${joinYear}-${String(startId + i).padStart(3, '0')}`;
    
    const staff: StaffDetail = {
      id: staffId,
      name: name,
      nameInitial: lastName[0],
      position: position,
      department: department,
      facility: facility,
      employeeId: staffId,
      joinDate: `${joinYear}年4月1日`,
      tenure: calculateTenure(joinDate),
      age: age,
      birthDate: `${birthYear}年${birthDate.getMonth() + 1}月${birthDate.getDate()}日`,
      evaluation: evaluationGrade,
      evaluationPeriod: '2024年下期',
      nextMeeting: '2025年2月' + randomInt(1, 28) + '日',
      healthStatus: Math.random() > 0.8 ? '要注意' : '良好',
      healthScore: randomInt(70, 95),
      stressIndex: randomInt(...genCharacteristics.stressRange),
      engagement: randomInt(...genCharacteristics.engagementRange),
      overtime: randomInt(...genCharacteristics.overtimeRange),
      paidLeaveRate: randomInt(...genCharacteristics.paidLeaveRange),
      avatar: `bg-gradient-to-r from-${['blue', 'green', 'purple', 'pink', 'indigo'][randomInt(0, 4)]}-500 to-${['blue', 'green', 'purple', 'pink', 'indigo'][randomInt(0, 4)]}-600`,
      email: `${lastName.toLowerCase()}.${firstName.toLowerCase()}@${facility === '小原病院' ? 'obara-hp' : 'tachigami-hp'}.jp`,
      phone: `080-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
      emergencyContact: `090-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}（${['配偶者', '親', '兄弟姉妹'][randomInt(0, 2)]}）`,
      address: `東京都○○区△△${randomInt(1, 9)}-${randomInt(1, 20)}-${randomInt(1, 15)}`,
      
      evaluationData: {
        rating: randomFloat(...genCharacteristics.performanceRange),
        performance: randomInt(70, 95),
        skill: randomInt(65, 95),
        teamwork: randomInt(70, 98),
        growth: randomFloat(...genCharacteristics.growthRange)
      },
      
      evaluationHistory: [
        {
          period: '2024年下期',
          overall: evaluationGrade,
          performance: randomFloat(...genCharacteristics.performanceRange),
          skills: randomFloat(3.5, 4.8),
          teamwork: randomFloat(3.8, 4.9),
          growth: randomFloat(...genCharacteristics.growthRange),
          evaluator: department + ' ' + (position.includes('主任') || position.includes('長') ? '部長' : '主任')
        },
        {
          period: '2024年上期',
          overall: evaluationGrade,
          performance: randomFloat(...genCharacteristics.performanceRange),
          skills: randomFloat(3.4, 4.7),
          teamwork: randomFloat(3.7, 4.8),
          growth: randomFloat(...genCharacteristics.growthRange),
          evaluator: department + ' ' + (position.includes('主任') || position.includes('長') ? '部長' : '主任')
        }
      ],
      
      skills: template.skills.map(skill => ({
        ...skill,
        level: randomInt(60, 95)
      })),
      
      trainingHistory: template.trainings.map((training, idx) => ({
        ...training,
        date: `${2024 - idx}年${randomInt(1, 12)}月`,
        evaluation: ['優秀', '良好', '合格'][randomInt(0, 2)],
        certificate: training.category === '資格研修'
      })),
      
      assignmentHistory: [
        {
          date: `${joinYear}年4月`,
          department: department,
          position: template.positions[0],
          reason: '新規配属'
        }
      ]
    };
    
    // 昇進履歴を追加
    if (positionIndex > 0) {
      staff.assignmentHistory.push({
        date: `${joinYear + 5}年4月`,
        department: department,
        position: template.positions[1],
        reason: '昇進'
      });
    }
    if (positionIndex > 1) {
      staff.assignmentHistory.push({
        date: `${joinYear + 10}年4月`,
        department: department,
        position: template.positions[2],
        reason: '昇進'
      });
    }
    
    staffList.push(staff);
  }
  
  return staffList;
}

// 全職種のデモデータを生成
export function generateAllCohortDemoData() {
  const allStaff: StaffDetail[] = [];
  
  // 小原病院のスタッフ
  allStaff.push(...generateCohortDemoData('nurse', '小原病院', 30, 1));
  allStaff.push(...generateCohortDemoData('nursingAssistant', '小原病院', 15, 1));
  allStaff.push(...generateCohortDemoData('caregiver', '小原病院', 10, 1));
  allStaff.push(...generateCohortDemoData('careworker', '小原病院', 8, 1));
  allStaff.push(...generateCohortDemoData('physicalTherapist', '小原病院', 12, 1));
  allStaff.push(...generateCohortDemoData('occupationalTherapist', '小原病院', 8, 1));
  
  // 立神リハビリテーション温泉病院のスタッフ
  allStaff.push(...generateCohortDemoData('nurse', '立神リハビリテーション温泉病院', 20, 1));
  allStaff.push(...generateCohortDemoData('nursingAssistant', '立神リハビリテーション温泉病院', 12, 1));
  allStaff.push(...generateCohortDemoData('caregiver', '立神リハビリテーション温泉病院', 15, 1));
  allStaff.push(...generateCohortDemoData('careworker', '立神リハビリテーション温泉病院', 10, 1));
  allStaff.push(...generateCohortDemoData('physicalTherapist', '立神リハビリテーション温泉病院', 15, 1));
  allStaff.push(...generateCohortDemoData('occupationalTherapist', '立神リハビリテーション温泉病院', 10, 1));
  
  return allStaff;
}