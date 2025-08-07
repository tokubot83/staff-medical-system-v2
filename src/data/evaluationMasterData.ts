import { MajorEvaluationItem, EvaluationMaster } from '@/types/evaluation-config';

// コア項目（法人固定30点）
export const coreEvaluationItems: MajorEvaluationItem[] = [
  {
    id: 'C01',
    category: 'core',
    name: '専門技術・スキル',
    description: '職種・経験に応じた技術力',
    maxScore: 10,
    isCore: true,
    applicableFacilities: ['acute', 'chronic', 'roken', 'grouphome', 'outpatient'],
    applicableJobs: ['nurse', 'assistantNurse', 'nursingAide', 'careWorker', 'careAssistant'],
  },
  {
    id: 'C02',
    category: 'core',
    name: '対人関係・ケア',
    description: '患者/利用者への対応力',
    maxScore: 10,
    isCore: true,
    applicableFacilities: ['acute', 'chronic', 'roken', 'grouphome', 'outpatient'],
    applicableJobs: ['nurse', 'assistantNurse', 'nursingAide', 'careWorker', 'careAssistant'],
  },
  {
    id: 'C03',
    category: 'core',
    name: '安全・品質管理',
    description: '安全確保と品質向上',
    maxScore: 10,
    isCore: true,
    applicableFacilities: ['acute', 'chronic', 'roken', 'grouphome', 'outpatient'],
    applicableJobs: ['nurse', 'assistantNurse', 'nursingAide', 'careWorker', 'careAssistant'],
  },
];

// 施設特化項目（選択可能）
export const facilitySpecificItems: MajorEvaluationItem[] = [
  // 知識系
  {
    id: 'F01',
    category: 'knowledge',
    name: '知識・判断力',
    description: '専門知識と判断力',
    maxScore: 10,
    isCore: false,
    applicableFacilities: ['acute', 'chronic'],
    applicableJobs: ['nurse', 'assistantNurse'],
    experienceLevels: ['junior', 'midlevel', 'veteran'],
  },
  // 教育系
  {
    id: 'F02',
    category: 'education',
    name: '教育・指導',
    description: '後輩指導・知識継承',
    maxScore: 10,
    isCore: false,
    applicableFacilities: ['acute', 'chronic', 'roken', 'grouphome'],
    applicableJobs: ['nurse', 'assistantNurse', 'careWorker'],
    experienceLevels: ['midlevel', 'veteran', 'manager'],
  },
  // リーダーシップ系
  {
    id: 'F03',
    category: 'leadership',
    name: 'リーダーシップ',
    description: 'チーム・組織運営',
    maxScore: 10,
    isCore: false,
    applicableFacilities: ['acute', 'chronic', 'roken', 'grouphome'],
    experienceLevels: ['midlevel', 'veteran', 'manager'],
  },
  // 成長系
  {
    id: 'F04',
    category: 'growth',
    name: '成長・学習',
    description: '学習意欲・成長',
    maxScore: 10,
    isCore: false,
    applicableFacilities: ['acute', 'chronic', 'roken', 'grouphome', 'outpatient'],
    experienceLevels: ['new', 'junior'],
  },
  // 施設特有スキル
  {
    id: 'F05',
    category: 'facility',
    name: '救急対応力',
    description: '急変時・救急対応スキル',
    maxScore: 10,
    isCore: false,
    applicableFacilities: ['acute'],
    applicableJobs: ['nurse', 'assistantNurse'],
  },
  {
    id: 'F06',
    category: 'facility',
    name: '認知症ケア',
    description: '認知症対応・ケア技術',
    maxScore: 10,
    isCore: false,
    applicableFacilities: ['roken', 'grouphome'],
    applicableJobs: ['nurse', 'careWorker', 'careAssistant'],
  },
  {
    id: 'F07',
    category: 'facility',
    name: 'リハビリ支援',
    description: 'リハビリテーション支援技術',
    maxScore: 10,
    isCore: false,
    applicableFacilities: ['chronic', 'roken'],
    applicableJobs: ['nurse', 'nursingAide', 'careWorker'],
  },
  {
    id: 'F08',
    category: 'facility',
    name: '生活支援',
    description: '日常生活支援技術',
    maxScore: 10,
    isCore: false,
    applicableFacilities: ['roken', 'grouphome'],
    applicableJobs: ['careWorker', 'careAssistant'],
  },
];

// 現在の評価マスター
export const currentEvaluationMaster: EvaluationMaster = {
  version: '2024.1',
  effectiveFrom: new Date('2024-04-01'),
  majorItems: [...coreEvaluationItems, ...facilitySpecificItems],
  createdBy: '法人人事部',
  createdAt: new Date('2024-01-15'),
};

// 施設種別名称
export const facilityTypeNames = {
  acute: '急性期病院',
  chronic: '慢性期病院',
  roken: '老健',
  grouphome: 'グループホーム',
  outpatient: '外来',
};

// 職種名称
export const jobCategoryNames = {
  nurse: '看護師',
  assistantNurse: '准看護師',
  nursingAide: '看護補助者',
  careWorker: '介護職員',
  careAssistant: '介護補助者',
};

// 経験年数レベル名称
export const experienceLevelNames = {
  new: '新人（1年目）',
  junior: '一般（2-3年目）',
  midlevel: '中堅（4-10年目）',
  veteran: 'ベテラン（11年以上）',
  manager: '管理職',
};