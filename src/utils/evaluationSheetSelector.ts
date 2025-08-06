import { ExperienceCategory } from './experienceUtils';

export interface EvaluationSheetInfo {
  component: string;
  path: string;
  title: string;
  experienceCategory: ExperienceCategory;
  facilityType: 'acute' | 'chronic' | 'roken' | 'grouphome';
  jobType: 'nurse' | 'assistant-nurse' | 'nursing-aide' | 'care-worker';
  pattern?: string;
}

// 急性期病棟看護師のv4評価シートマッピング
export const acuteNurseEvaluationSheets: Record<ExperienceCategory, EvaluationSheetInfo> = {
  new: {
    component: 'NewNurseEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nurse/new-nurse-evaluation-v4-pattern5',
    title: '新人看護師（1年目）人事評価シート',
    experienceCategory: 'new',
    facilityType: 'acute',
    jobType: 'nurse',
    pattern: 'pattern5'
  },
  junior: {
    component: 'JuniorNurseEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nurse/junior-nurse-evaluation-v4-pattern5',
    title: '一般看護師（2-3年目）人事評価シート',
    experienceCategory: 'junior',
    facilityType: 'acute',
    jobType: 'nurse',
    pattern: 'pattern5'
  },
  midlevel: {
    component: 'MidlevelNurseEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nurse/midlevel-nurse-evaluation-v4-pattern5',
    title: '中堅看護師（4-10年目）人事評価シート',
    experienceCategory: 'midlevel',
    facilityType: 'acute',
    jobType: 'nurse',
    pattern: 'pattern5'
  },
  senior: {
    component: 'VeteranNurseEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nurse/veteran-nurse-evaluation-v4-pattern5',
    title: 'シニア看護師（11-15年目）人事評価シート',
    experienceCategory: 'senior',
    facilityType: 'acute',
    jobType: 'nurse',
    pattern: 'pattern5'
  },
  veteran: {
    component: 'VeteranNurseEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nurse/veteran-nurse-evaluation-v4-pattern5',
    title: 'ベテラン看護師（16年目以上）人事評価シート',
    experienceCategory: 'veteran',
    facilityType: 'acute',
    jobType: 'nurse',
    pattern: 'pattern5'
  },
  chief: {
    component: 'WardChiefEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nurse/ward-chief-evaluation-v4-pattern5',
    title: '主任看護師 人事評価シート',
    experienceCategory: 'chief',
    facilityType: 'acute',
    jobType: 'nurse',
    pattern: 'pattern5'
  },
  manager: {
    component: 'WardManagerEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nurse/ward-manager-evaluation-v4-pattern5',
    title: '看護師長 人事評価シート',
    experienceCategory: 'manager',
    facilityType: 'acute',
    jobType: 'nurse',
    pattern: 'pattern5'
  }
};

// 急性期病棟看護補助者のv4評価シートマッピング
export const acuteNursingAideEvaluationSheets: Record<ExperienceCategory, EvaluationSheetInfo> = {
  new: {
    component: 'NewNursingAideEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nursing-aide/new-nursing-aide-evaluation-v4-pattern5',
    title: '新人看護補助者（1年目）人事評価シート',
    experienceCategory: 'new',
    facilityType: 'acute',
    jobType: 'nursing-aide',
    pattern: 'pattern5'
  },
  junior: {
    component: 'JuniorNursingAideEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nursing-aide/junior-nursing-aide-evaluation-v4-pattern5',
    title: '一般看護補助者（2-3年目）人事評価シート',
    experienceCategory: 'junior',
    facilityType: 'acute',
    jobType: 'nursing-aide',
    pattern: 'pattern5'
  },
  midlevel: {
    component: 'MidlevelNursingAideEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nursing-aide/midlevel-nursing-aide-evaluation-v4-pattern5',
    title: '中堅看護補助者（4-10年目）人事評価シート',
    experienceCategory: 'midlevel',
    facilityType: 'acute',
    jobType: 'nursing-aide',
    pattern: 'pattern5'
  },
  senior: {
    component: 'VeteranNursingAideEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nursing-aide/veteran-nursing-aide-evaluation-v4-pattern5',
    title: 'シニア看護補助者（11-15年目）人事評価シート',
    experienceCategory: 'senior',
    facilityType: 'acute',
    jobType: 'nursing-aide',
    pattern: 'pattern5'
  },
  veteran: {
    component: 'VeteranNursingAideEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nursing-aide/veteran-nursing-aide-evaluation-v4-pattern5',
    title: 'ベテラン看護補助者（16年目以上）人事評価シート',
    experienceCategory: 'veteran',
    facilityType: 'acute',
    jobType: 'nursing-aide',
    pattern: 'pattern5'
  },
  chief: {
    component: 'LeaderNursingAideEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nursing-aide/leader-nursing-aide-evaluation-v4-pattern5',
    title: 'リーダー看護補助者 人事評価シート',
    experienceCategory: 'chief',
    facilityType: 'acute',
    jobType: 'nursing-aide',
    pattern: 'pattern5'
  },
  manager: {
    component: 'LeaderNursingAideEvaluationV4Pattern5',
    path: '/evaluation-sheets/v4/acute-nursing-aide/leader-nursing-aide-evaluation-v4-pattern5',
    title: 'リーダー看護補助者 人事評価シート',
    experienceCategory: 'manager',
    facilityType: 'acute',
    jobType: 'nursing-aide',
    pattern: 'pattern5'
  }
};

/**
 * 経験年数カテゴリと施設タイプ、職種に基づいて適切な評価シートを選択
 * @param experienceCategory 経験年数カテゴリ
 * @param facilityType 施設タイプ
 * @param jobType 職種
 * @returns 評価シート情報
 */
export function selectEvaluationSheet(
  experienceCategory: ExperienceCategory,
  facilityType: 'acute' | 'chronic' | 'roken' | 'grouphome' = 'acute',
  jobType: 'nurse' | 'assistant-nurse' | 'nursing-aide' | 'care-worker' = 'nurse'
): EvaluationSheetInfo | null {
  // 急性期病棟の看護師
  if (facilityType === 'acute' && jobType === 'nurse') {
    return acuteNurseEvaluationSheets[experienceCategory];
  }
  
  // 急性期病棟の看護補助者
  if (facilityType === 'acute' && jobType === 'nursing-aide') {
    return acuteNursingAideEvaluationSheets[experienceCategory];
  }
  
  // 他の施設タイプ・職種は未実装
  return null;
}

/**
 * 利用可能な評価シートを取得
 * @param facilityType 施設タイプ
 * @param jobType 職種
 * @returns 評価シート情報の配列
 */
export function getAvailableEvaluationSheets(
  facilityType?: 'acute' | 'chronic' | 'roken' | 'grouphome',
  jobType?: 'nurse' | 'assistant-nurse' | 'nursing-aide' | 'care-worker'
): EvaluationSheetInfo[] {
  // 現在は急性期病棟の看護師のみ
  if (!facilityType || !jobType || (facilityType === 'acute' && jobType === 'nurse')) {
    return Object.values(acuteNurseEvaluationSheets);
  }
  
  return [];
}