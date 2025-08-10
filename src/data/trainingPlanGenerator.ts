// 研修計画自動生成システム

import { 
  trainingPrograms, 
  corporateEvaluationItems,
  facilitySpecificItems,
  getRecommendedSet,
  type TrainingProgram,
  type EvaluationItem 
} from './evaluationItemBank';

export interface TrainingPlan {
  id: string;
  name: string;
  facilityType: string;
  department: string;
  role: string;
  level: string;
  year: number;
  createdAt: Date;
  trainingSessions: TrainingSession[];
  totalHours: number;
  mandatoryHours: number;
  optionalHours: number;
}

export interface TrainingSession {
  id: string;
  trainingId: string;
  trainingName: string;
  category: 'legal' | 'skill' | 'management' | 'specialty';
  type: 'mandatory' | 'optional';
  month: number;
  week?: number;
  duration: number;
  targetParticipants: number;
  relatedEvaluationItems: string[];
  instructor?: string;
  location?: string;
  notes?: string;
}

export interface AnnualTrainingCalendar {
  year: number;
  months: MonthlySchedule[];
}

export interface MonthlySchedule {
  month: number;
  sessions: TrainingSession[];
  totalHours: number;
  holidays?: Date[];
}

export interface DepartmentCurriculum {
  departmentId: string;
  departmentName: string;
  facilityType: string;
  staffCount: number;
  roleBreakdown: {
    role: string;
    count: number;
    levels: { level: string; count: number }[];
  }[];
  requiredTrainings: TrainingRequirement[];
  annualPlan: TrainingPlan;
}

export interface TrainingRequirement {
  trainingId: string;
  trainingName: string;
  targetRoles: string[];
  targetLevels: string[];
  frequency: string;
  totalParticipants: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

// 部署データ（実際は別管理）
export const departments = [
  { id: 'D001', name: '外科病棟', facilityType: 'acute', staffCount: 45 },
  { id: 'D002', name: '内科病棟', facilityType: 'acute', staffCount: 40 },
  { id: 'D003', name: 'ICU', facilityType: 'acute', staffCount: 30 },
  { id: 'D004', name: '回復期リハビリ病棟', facilityType: 'recovery', staffCount: 35 },
  { id: 'D005', name: '地域包括ケア病棟', facilityType: 'chronic', staffCount: 38 },
  { id: 'D006', name: '医療療養病棟', facilityType: 'chronic', staffCount: 42 },
  { id: 'D007', name: '介護医療院', facilityType: 'careHospital', staffCount: 50 },
  { id: 'D008', name: '老健', facilityType: 'nursingHome', staffCount: 48 }
];

// 研修計画生成関数
export function generateTrainingPlan(
  facilityType: string,
  role: string,
  level: string,
  year: number,
  department?: string
): TrainingPlan {
  const planId = `PLAN_${Date.now()}`;
  const planName = `${year}年度 研修計画 - ${department || '全体'}`;
  
  // 推奨項目セットを取得
  const recommendedSet = getRecommendedSet(facilityType, role, level);
  
  // 必要な研修を抽出
  const requiredTrainings = extractRequiredTrainings(
    recommendedSet?.corporateItems || [],
    recommendedSet?.facilityItems || []
  );
  
  // 研修セッションを生成
  const trainingSessions = generateTrainingSessions(
    requiredTrainings,
    year
  );
  
  // 時間集計
  const totalHours = trainingSessions.reduce((sum, session) => sum + session.duration, 0);
  const mandatoryHours = trainingSessions
    .filter(s => s.type === 'mandatory')
    .reduce((sum, session) => sum + session.duration, 0);
  const optionalHours = totalHours - mandatoryHours;
  
  return {
    id: planId,
    name: planName,
    facilityType,
    department: department || '全体',
    role,
    level,
    year,
    createdAt: new Date(),
    trainingSessions,
    totalHours,
    mandatoryHours,
    optionalHours
  };
}

// 必要研修の抽出
function extractRequiredTrainings(
  corporateItemIds: string[],
  facilityItemIds: string[]
): TrainingProgram[] {
  const allItems = [...corporateEvaluationItems, ...facilitySpecificItems];
  const selectedItems = allItems.filter(item => 
    corporateItemIds.includes(item.id) || facilityItemIds.includes(item.id)
  );
  
  // 重複を除いた研修IDリストを作成
  const trainingIds = new Set<string>();
  selectedItems.forEach(item => {
    item.requiredTrainings?.forEach(trainingId => {
      trainingIds.add(trainingId);
    });
  });
  
  // 研修プログラムを取得
  return trainingPrograms.filter(training => 
    trainingIds.has(training.id)
  );
}

// 研修セッションの生成
function generateTrainingSessions(
  trainings: TrainingProgram[],
  year: number
): TrainingSession[] {
  const sessions: TrainingSession[] = [];
  
  trainings.forEach(training => {
    // 頻度に応じてセッションを作成
    const frequency = training.frequency || '年1回';
    const sessionsPerYear = getSessionsPerYear(frequency);
    
    for (let i = 0; i < sessionsPerYear; i++) {
      const month = distributeAcrossYear(i, sessionsPerYear);
      const week = getOptimalWeek(month, training.category);
      
      sessions.push({
        id: `SESSION_${training.id}_${i + 1}`,
        trainingId: training.id,
        trainingName: training.name,
        category: training.category,
        type: training.type,
        month,
        week,
        duration: training.duration,
        targetParticipants: 30, // デフォルト値
        relatedEvaluationItems: training.relatedItems
      });
    }
  });
  
  return sessions.sort((a, b) => a.month - b.month);
}

// 頻度から年間セッション数を取得
function getSessionsPerYear(frequency: string): number {
  if (frequency.includes('2回')) return 2;
  if (frequency.includes('3回')) return 3;
  if (frequency.includes('4回')) return 4;
  if (frequency.includes('毎月')) return 12;
  if (frequency.includes('隔月')) return 6;
  return 1;
}

// 年間での分散配置
function distributeAcrossYear(index: number, total: number): number {
  if (total === 1) return 6; // 年1回なら6月
  if (total === 2) return index === 0 ? 4 : 10; // 年2回なら4月と10月
  if (total === 4) return 3 * (index + 1); // 四半期ごと
  if (total === 12) return index + 1; // 毎月
  
  // その他は均等配分
  const interval = Math.floor(12 / total);
  return Math.min(12, (index * interval) + interval);
}

// 最適な週を決定
function getOptimalWeek(month: number, category: string): number {
  // カテゴリと月に応じて最適な週を設定
  if (category === 'legal') {
    // 法定研修は月初
    return 1;
  } else if (category === 'management') {
    // 管理研修は月末
    return 4;
  } else {
    // その他は中旬
    return 2;
  }
}

// 年間カレンダーの生成
export function generateAnnualCalendar(
  trainingPlan: TrainingPlan
): AnnualTrainingCalendar {
  const calendar: AnnualTrainingCalendar = {
    year: trainingPlan.year,
    months: []
  };
  
  // 12ヶ月分の枠を作成
  for (let month = 1; month <= 12; month++) {
    const monthSessions = trainingPlan.trainingSessions.filter(
      session => session.month === month
    );
    
    const totalHours = monthSessions.reduce(
      (sum, session) => sum + session.duration, 
      0
    );
    
    calendar.months.push({
      month,
      sessions: monthSessions,
      totalHours,
      holidays: getJapaneseHolidays(trainingPlan.year, month)
    });
  }
  
  return calendar;
}

// 日本の祝日を取得（簡易版）
function getJapaneseHolidays(year: number, month: number): Date[] {
  const holidays: Date[] = [];
  
  // 固定祝日の例
  const fixedHolidays: { [key: number]: number[] } = {
    1: [1, 2, 3], // 正月
    2: [11, 23], // 建国記念日、天皇誕生日
    3: [20], // 春分の日（概算）
    4: [29], // 昭和の日
    5: [3, 4, 5], // ゴールデンウィーク
    8: [11], // 山の日
    9: [19, 23], // 敬老の日、秋分の日（概算）
    11: [3, 23], // 文化の日、勤労感謝の日
  };
  
  const monthHolidays = fixedHolidays[month] || [];
  monthHolidays.forEach(day => {
    holidays.push(new Date(year, month - 1, day));
  });
  
  return holidays;
}

// 部署別カリキュラムの生成
export function generateDepartmentCurriculum(
  departmentId: string,
  year: number
): DepartmentCurriculum {
  const department = departments.find(d => d.id === departmentId);
  if (!department) {
    throw new Error('Department not found');
  }
  
  // 職種別の人数配分（仮のデータ）
  const roleBreakdown = generateRoleBreakdown(department.staffCount);
  
  // 必要研修の算出
  const requiredTrainings = calculateDepartmentTrainings(
    department.facilityType,
    roleBreakdown
  );
  
  // 部署の年間計画生成
  const annualPlan = generateTrainingPlan(
    department.facilityType,
    'nurse', // 主要職種
    'midlevel', // 平均的なレベル
    year,
    department.name
  );
  
  return {
    departmentId: department.id,
    departmentName: department.name,
    facilityType: department.facilityType,
    staffCount: department.staffCount,
    roleBreakdown,
    requiredTrainings,
    annualPlan
  };
}

// 職種別人数配分の生成（仮のデータ）
function generateRoleBreakdown(totalStaff: number): any[] {
  return [
    {
      role: 'nurse',
      count: Math.floor(totalStaff * 0.5),
      levels: [
        { level: 'new', count: Math.floor(totalStaff * 0.1) },
        { level: 'junior', count: Math.floor(totalStaff * 0.15) },
        { level: 'midlevel', count: Math.floor(totalStaff * 0.15) },
        { level: 'veteran', count: Math.floor(totalStaff * 0.08) },
        { level: 'chief', count: Math.floor(totalStaff * 0.02) }
      ]
    },
    {
      role: 'nursingAide',
      count: Math.floor(totalStaff * 0.3),
      levels: [
        { level: 'new', count: Math.floor(totalStaff * 0.06) },
        { level: 'junior', count: Math.floor(totalStaff * 0.09) },
        { level: 'midlevel', count: Math.floor(totalStaff * 0.09) },
        { level: 'veteran', count: Math.floor(totalStaff * 0.06) }
      ]
    },
    {
      role: 'other',
      count: Math.floor(totalStaff * 0.2),
      levels: [
        { level: 'all', count: Math.floor(totalStaff * 0.2) }
      ]
    }
  ];
}

// 部署別必要研修の算出
function calculateDepartmentTrainings(
  facilityType: string,
  roleBreakdown: any[]
): TrainingRequirement[] {
  const requirements: TrainingRequirement[] = [];
  
  // 法定研修は全員必須
  const legalTrainings = trainingPrograms.filter(t => t.category === 'legal');
  const totalStaff = roleBreakdown.reduce((sum, role) => sum + role.count, 0);
  
  legalTrainings.forEach(training => {
    requirements.push({
      trainingId: training.id,
      trainingName: training.name,
      targetRoles: training.targetRoles,
      targetLevels: training.targetLevels,
      frequency: training.frequency || '年1回',
      totalParticipants: totalStaff,
      priority: 'critical'
    });
  });
  
  // 専門研修は職種・レベル別
  const specialtyTrainings = trainingPrograms.filter(t => 
    t.category === 'specialty' || t.category === 'skill'
  );
  
  specialtyTrainings.forEach(training => {
    let participants = 0;
    
    roleBreakdown.forEach(role => {
      if (training.targetRoles.includes(role.role) || 
          training.targetRoles.includes('all')) {
        role.levels.forEach((levelData: any) => {
          if (training.targetLevels.includes(levelData.level) || 
              training.targetLevels.includes('all')) {
            participants += levelData.count;
          }
        });
      }
    });
    
    if (participants > 0) {
      requirements.push({
        trainingId: training.id,
        trainingName: training.name,
        targetRoles: training.targetRoles,
        targetLevels: training.targetLevels,
        frequency: training.frequency || '年1回',
        totalParticipants: participants,
        priority: training.type === 'mandatory' ? 'high' : 'medium'
      });
    }
  });
  
  return requirements;
}

// エクスポート用フォーマット変換
export function exportToExcel(plan: TrainingPlan): any {
  // Excel形式のデータ構造に変換
  const excelData = {
    overview: {
      planName: plan.name,
      year: plan.year,
      department: plan.department,
      role: plan.role,
      level: plan.level,
      totalHours: plan.totalHours,
      mandatoryHours: plan.mandatoryHours,
      optionalHours: plan.optionalHours
    },
    schedule: plan.trainingSessions.map(session => ({
      month: session.month,
      week: session.week,
      trainingName: session.trainingName,
      category: session.category,
      type: session.type,
      duration: session.duration,
      participants: session.targetParticipants
    }))
  };
  
  return excelData;
}

// カリキュラムのテンプレート
export const curriculumTemplates = {
  acute_nurse: {
    name: '急性期病院看護師標準カリキュラム',
    description: '救急対応、高度医療機器操作を含む',
    mandatoryHours: 40,
    optionalHours: 20,
    focusAreas: ['救急医療', '集中治療', 'チーム医療']
  },
  recovery_nurse: {
    name: '回復期病院看護師標準カリキュラム',
    description: 'リハビリテーション、在宅復帰支援を重視',
    mandatoryHours: 36,
    optionalHours: 24,
    focusAreas: ['リハビリテーション', 'ADL支援', '多職種連携']
  },
  chronic_nurse: {
    name: '慢性期病院看護師標準カリキュラム',
    description: '褥瘡ケア、認知症ケアに特化',
    mandatoryHours: 36,
    optionalHours: 18,
    focusAreas: ['褥瘡管理', '認知症ケア', '看取りケア']
  },
  care_worker: {
    name: '介護職標準カリキュラム',
    description: '生活支援、認知症対応を中心に',
    mandatoryHours: 32,
    optionalHours: 16,
    focusAreas: ['認知症ケア', '身体介護', '生活支援']
  }
};