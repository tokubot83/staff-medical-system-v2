// 評価項目バンク - 人事評価制度と研修の連携データ

export interface EvaluationItem {
  id: string;
  name: string;
  description: string;
  category: 'corporate' | 'facility'; // 法人統一 or 施設特化
  type: 'required' | 'optional'; // 必須 or 選択
  points: number; // 配点
  requiredTrainings?: string[]; // 必要な研修ID
  evaluationCriteria: string[]; // 評価基準
  targetRoles: string[]; // 対象職種
  targetLevels: string[]; // 対象経験レベル
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  category: 'legal' | 'skill' | 'management' | 'specialty'; // 法定/技術/管理/専門
  type: 'mandatory' | 'optional'; // 必須/任意
  duration: number; // 時間
  frequency?: string; // 実施頻度（年2回等）
  targetRoles: string[]; // 対象職種
  targetLevels: string[]; // 対象経験レベル
  relatedItems: string[]; // 関連する評価項目ID
  legalBasis?: string; // 法的根拠
}

export interface ItemSet {
  id: string;
  name: string;
  facilityType: string; // 施設種別
  role: string; // 職種
  level: string; // 経験レベル
  corporateItems: string[]; // 法人統一項目ID
  facilityItems: string[]; // 施設特化項目ID
  totalPoints: number; // 合計点
}

// 経験レベル定義
export const experienceLevels = {
  new: '新人（1年目）',
  junior: '初級（2-3年目）',
  midlevel: '中級（4-7年目）',
  veteran: 'ベテラン（8年目以上）',
  chief: '主任級',
  manager: '師長級'
};

// 職種定義
export const roles = {
  nurse: '看護師',
  assistantNurse: '准看護師',
  nursingAide: '看護補助者',
  careWorker: '介護職',
  therapist: 'リハビリ職',
  doctor: '医師',
  pharmacist: '薬剤師',
  nutritionist: '栄養士',
  clerk: '事務職'
};

// 施設種別定義
export const facilityTypes = {
  acute: '急性期病院',
  recovery: '回復期病院',
  chronic: '慢性期病院',
  careHospital: '介護医療院',
  nursingHome: '介護老人保健施設',
  groupHome: 'グループホーム',
  homeVisit: '訪問介護',
  dayCare: '通所介護'
};

// 法人統一項目（30点） - 法定研修ベース
export const corporateEvaluationItems: EvaluationItem[] = [
  {
    id: 'CORP001',
    name: '医療安全管理',
    description: '医療安全に関する知識と実践、インシデント対応能力',
    category: 'corporate',
    type: 'required',
    points: 6,
    requiredTrainings: ['TR_SAFETY_001', 'TR_SAFETY_002'],
    evaluationCriteria: [
      '医療安全研修を年2回受講している',
      'インシデント報告を適切に行える',
      'KYT（危険予知トレーニング）を実践している',
      '安全確認行動（指差呼称等）を実施している'
    ],
    targetRoles: ['nurse', 'assistantNurse', 'nursingAide', 'doctor'],
    targetLevels: ['new', 'junior', 'midlevel', 'veteran', 'chief', 'manager']
  },
  {
    id: 'CORP002',
    name: '感染対策',
    description: '感染予防策の理解と実践、標準予防策の遵守',
    category: 'corporate',
    type: 'required',
    points: 6,
    requiredTrainings: ['TR_INFECTION_001', 'TR_INFECTION_002'],
    evaluationCriteria: [
      '感染対策研修を年2回受講している',
      '標準予防策を正しく実施できる',
      '手指衛生5つのタイミングを遵守している',
      'PPE（個人防護具）を適切に使用できる'
    ],
    targetRoles: ['nurse', 'assistantNurse', 'nursingAide', 'careWorker'],
    targetLevels: ['new', 'junior', 'midlevel', 'veteran', 'chief', 'manager']
  },
  {
    id: 'CORP003',
    name: '身体拘束適正化',
    description: '身体拘束廃止への取り組み、適切な代替ケアの実施',
    category: 'corporate',
    type: 'required',
    points: 5,
    requiredTrainings: ['TR_RESTRAINT_001'],
    evaluationCriteria: [
      '身体拘束適正化研修を年2回受講している',
      '身体拘束の3原則を理解している',
      '代替ケアを提案・実践できる',
      '適切な記録を作成できる'
    ],
    targetRoles: ['nurse', 'assistantNurse', 'nursingAide', 'careWorker'],
    targetLevels: ['new', 'junior', 'midlevel', 'veteran', 'chief', 'manager']
  },
  {
    id: 'CORP004',
    name: '虐待防止・権利擁護',
    description: '高齢者虐待防止、尊厳の保持、権利擁護の実践',
    category: 'corporate',
    type: 'required',
    points: 5,
    requiredTrainings: ['TR_ABUSE_001'],
    evaluationCriteria: [
      '虐待防止研修を年1回受講している',
      '不適切ケアを見逃さない',
      '尊厳を守る声かけ・対応ができる',
      '通報義務を理解している'
    ],
    targetRoles: ['nurse', 'assistantNurse', 'nursingAide', 'careWorker'],
    targetLevels: ['new', 'junior', 'midlevel', 'veteran', 'chief', 'manager']
  },
  {
    id: 'CORP005',
    name: '個人情報保護',
    description: '個人情報の適切な取り扱い、守秘義務の遵守',
    category: 'corporate',
    type: 'required',
    points: 4,
    requiredTrainings: ['TR_PRIVACY_001'],
    evaluationCriteria: [
      '個人情報保護研修を年1回受講している',
      '守秘義務を遵守している',
      '情報の取り扱いルールを理解している',
      'SNS等での情報発信に注意している'
    ],
    targetRoles: ['all'],
    targetLevels: ['new', 'junior', 'midlevel', 'veteran', 'chief', 'manager']
  },
  {
    id: 'CORP006',
    name: 'BCP（業務継続計画）',
    description: '災害・感染症発生時の業務継続、緊急時対応',
    category: 'corporate',
    type: 'required',
    points: 4,
    requiredTrainings: ['TR_BCP_001'],
    evaluationCriteria: [
      'BCP研修を年1回受講している',
      '緊急時の連絡体制を把握している',
      '避難経路・避難方法を理解している',
      'BCP訓練に参加している'
    ],
    targetRoles: ['all'],
    targetLevels: ['new', 'junior', 'midlevel', 'veteran', 'chief', 'manager']
  }
];

// 施設特化項目（20点） - 施設種別・職種・経験レベル別
export const facilitySpecificItems: EvaluationItem[] = [
  // 急性期病院 - 看護師 - 中級
  {
    id: 'ACUTE_NS_MID_001',
    name: '救急対応スキル',
    description: '救急患者への初期対応、トリアージ能力',
    category: 'facility',
    type: 'optional',
    points: 5,
    requiredTrainings: ['TR_EMERGENCY_001', 'TR_BLS_001'],
    evaluationCriteria: [
      'BLS/ACLSの資格を保持している',
      'トリアージを適切に実施できる',
      '救急カートの管理ができる',
      'チーム医療を実践できる'
    ],
    targetRoles: ['nurse'],
    targetLevels: ['midlevel', 'veteran']
  },
  {
    id: 'ACUTE_NS_MID_002',
    name: '高度医療機器操作',
    description: '人工呼吸器、心電図モニター等の操作・管理',
    category: 'facility',
    type: 'optional',
    points: 5,
    requiredTrainings: ['TR_DEVICE_001', 'TR_DEVICE_002'],
    evaluationCriteria: [
      '人工呼吸器の基本操作ができる',
      '心電図の判読ができる',
      '医療機器のトラブル対応ができる',
      '日常点検を実施している'
    ],
    targetRoles: ['nurse'],
    targetLevels: ['midlevel', 'veteran']
  },
  // 回復期病院 - 看護師 - 中級
  {
    id: 'RECOVERY_NS_MID_001',
    name: 'リハビリテーション看護',
    description: 'リハビリ計画の理解と実践、多職種連携',
    category: 'facility',
    type: 'optional',
    points: 5,
    requiredTrainings: ['TR_REHAB_001'],
    evaluationCriteria: [
      'FIM評価を理解している',
      'ADL向上への介入ができる',
      'リハビリスタッフと連携できる',
      '在宅復帰支援を実践している'
    ],
    targetRoles: ['nurse', 'assistantNurse'],
    targetLevels: ['midlevel', 'veteran']
  },
  // 慢性期病院 - 看護師 - 中級
  {
    id: 'CHRONIC_NS_MID_001',
    name: '褥瘡ケア',
    description: '褥瘡予防と処置、褥瘡評価の実施',
    category: 'facility',
    type: 'optional',
    points: 5,
    requiredTrainings: ['TR_PRESSURE_001'],
    evaluationCriteria: [
      'DESIGN-R評価ができる',
      '体圧分散ケアを実施している',
      '適切な創傷処置ができる',
      '栄養管理と連携している'
    ],
    targetRoles: ['nurse', 'assistantNurse'],
    targetLevels: ['midlevel', 'veteran']
  },
  // 介護施設 - 介護職 - 初級
  {
    id: 'CARE_CW_JUN_001',
    name: '認知症ケア基礎',
    description: '認知症の理解と基本的対応',
    category: 'facility',
    type: 'optional',
    points: 5,
    requiredTrainings: ['TR_DEMENTIA_001'],
    evaluationCriteria: [
      '認知症介護基礎研修を修了している',
      'パーソンセンタードケアを理解している',
      'BPSDへの対応ができる',
      'ユマニチュードを実践している'
    ],
    targetRoles: ['careWorker', 'nursingAide'],
    targetLevels: ['junior']
  },
  // 管理職向け（師長級）
  {
    id: 'MANAGE_001',
    name: '部署マネジメント',
    description: '部署運営、スタッフ管理、業務改善',
    category: 'facility',
    type: 'optional',
    points: 5,
    requiredTrainings: ['TR_MANAGE_001'],
    evaluationCriteria: [
      '部署目標を設定・管理している',
      'スタッフの育成計画を立案している',
      '業務改善を推進している',
      '労務管理を適切に行っている'
    ],
    targetRoles: ['all'],
    targetLevels: ['manager']
  },
  // 管理職向け（主任級）
  {
    id: 'CHIEF_001',
    name: 'リーダーシップ',
    description: 'チームリーダーとしての役割遂行',
    category: 'facility',
    type: 'optional',
    points: 5,
    requiredTrainings: ['TR_LEADER_001'],
    evaluationCriteria: [
      'チームの調整役を果たしている',
      '後輩指導を積極的に行っている',
      '問題解決能力を発揮している',
      '上司との連携を図っている'
    ],
    targetRoles: ['all'],
    targetLevels: ['chief']
  }
];

// 研修プログラムデータ
export const trainingPrograms: TrainingProgram[] = [
  // 法定研修（法人統一項目用）
  {
    id: 'TR_SAFETY_001',
    name: '医療安全管理研修（前期）',
    description: '医療事故防止、インシデント対応、KYT実践',
    category: 'legal',
    type: 'mandatory',
    duration: 2,
    frequency: '年2回',
    targetRoles: ['all'],
    targetLevels: ['all'],
    relatedItems: ['CORP001'],
    legalBasis: '医療法施行規則'
  },
  {
    id: 'TR_SAFETY_002',
    name: '医療安全管理研修（後期）',
    description: '事例検討、改善活動、安全文化醸成',
    category: 'legal',
    type: 'mandatory',
    duration: 2,
    frequency: '年2回',
    targetRoles: ['all'],
    targetLevels: ['all'],
    relatedItems: ['CORP001'],
    legalBasis: '医療法施行規則'
  },
  {
    id: 'TR_INFECTION_001',
    name: '感染対策研修（前期）',
    description: '標準予防策、手指衛生、PPE使用法',
    category: 'legal',
    type: 'mandatory',
    duration: 2,
    frequency: '年2回',
    targetRoles: ['all'],
    targetLevels: ['all'],
    relatedItems: ['CORP002'],
    legalBasis: '医療法施行規則'
  },
  {
    id: 'TR_INFECTION_002',
    name: '感染対策研修（後期）',
    description: '感染症別対策、アウトブレイク対応',
    category: 'legal',
    type: 'mandatory',
    duration: 2,
    frequency: '年2回',
    targetRoles: ['all'],
    targetLevels: ['all'],
    relatedItems: ['CORP002'],
    legalBasis: '医療法施行規則'
  },
  {
    id: 'TR_RESTRAINT_001',
    name: '身体拘束適正化研修',
    description: '身体拘束廃止、代替ケア、記録方法',
    category: 'legal',
    type: 'mandatory',
    duration: 2,
    frequency: '年2回',
    targetRoles: ['nurse', 'assistantNurse', 'nursingAide', 'careWorker'],
    targetLevels: ['all'],
    relatedItems: ['CORP003'],
    legalBasis: '介護報酬基準'
  },
  {
    id: 'TR_ABUSE_001',
    name: '虐待防止研修',
    description: '高齢者虐待防止、不適切ケア防止、権利擁護',
    category: 'legal',
    type: 'mandatory',
    duration: 2,
    frequency: '年1回',
    targetRoles: ['all'],
    targetLevels: ['all'],
    relatedItems: ['CORP004'],
    legalBasis: '高齢者虐待防止法'
  },
  {
    id: 'TR_PRIVACY_001',
    name: '個人情報保護研修',
    description: '個人情報の取扱い、守秘義務、情報セキュリティ',
    category: 'legal',
    type: 'mandatory',
    duration: 1,
    frequency: '年1回',
    targetRoles: ['all'],
    targetLevels: ['all'],
    relatedItems: ['CORP005'],
    legalBasis: '個人情報保護法'
  },
  {
    id: 'TR_BCP_001',
    name: 'BCP研修・訓練',
    description: '災害対応、感染症BCP、業務継続訓練',
    category: 'legal',
    type: 'mandatory',
    duration: 2,
    frequency: '年1回',
    targetRoles: ['all'],
    targetLevels: ['all'],
    relatedItems: ['CORP006'],
    legalBasis: '介護報酬基準'
  },
  // 専門研修（施設特化項目用）
  {
    id: 'TR_EMERGENCY_001',
    name: '救急看護研修',
    description: 'トリアージ、初期対応、救急処置',
    category: 'specialty',
    type: 'optional',
    duration: 8,
    targetRoles: ['nurse'],
    targetLevels: ['midlevel', 'veteran'],
    relatedItems: ['ACUTE_NS_MID_001']
  },
  {
    id: 'TR_BLS_001',
    name: 'BLS/ACLS研修',
    description: '一次救命処置、二次救命処置',
    category: 'specialty',
    type: 'optional',
    duration: 8,
    targetRoles: ['nurse', 'doctor'],
    targetLevels: ['midlevel', 'veteran'],
    relatedItems: ['ACUTE_NS_MID_001']
  },
  {
    id: 'TR_DEVICE_001',
    name: '人工呼吸器管理研修',
    description: '人工呼吸器の原理、操作、トラブル対応',
    category: 'specialty',
    type: 'optional',
    duration: 4,
    targetRoles: ['nurse'],
    targetLevels: ['midlevel', 'veteran'],
    relatedItems: ['ACUTE_NS_MID_002']
  },
  {
    id: 'TR_REHAB_001',
    name: 'リハビリテーション看護研修',
    description: 'FIM評価、ADL支援、多職種連携',
    category: 'specialty',
    type: 'optional',
    duration: 6,
    targetRoles: ['nurse', 'assistantNurse'],
    targetLevels: ['midlevel', 'veteran'],
    relatedItems: ['RECOVERY_NS_MID_001']
  },
  {
    id: 'TR_PRESSURE_001',
    name: '褥瘡ケア研修',
    description: 'DESIGN-R評価、予防ケア、創傷処置',
    category: 'specialty',
    type: 'optional',
    duration: 4,
    targetRoles: ['nurse', 'assistantNurse'],
    targetLevels: ['midlevel', 'veteran'],
    relatedItems: ['CHRONIC_NS_MID_001']
  },
  {
    id: 'TR_DEMENTIA_001',
    name: '認知症介護基礎研修',
    description: '認知症の理解、コミュニケーション、BPSD対応',
    category: 'specialty',
    type: 'mandatory',
    duration: 6,
    targetRoles: ['careWorker', 'nursingAide'],
    targetLevels: ['new', 'junior'],
    relatedItems: ['CARE_CW_JUN_001'],
    legalBasis: '介護報酬基準'
  },
  // 管理研修
  {
    id: 'TR_MANAGE_001',
    name: '看護管理者研修',
    description: '部署運営、人材育成、労務管理',
    category: 'management',
    type: 'optional',
    duration: 40,
    targetRoles: ['nurse'],
    targetLevels: ['manager'],
    relatedItems: ['MANAGE_001']
  },
  {
    id: 'TR_LEADER_001',
    name: 'リーダーシップ研修',
    description: 'チームビルディング、コーチング、問題解決',
    category: 'management',
    type: 'optional',
    duration: 16,
    targetRoles: ['all'],
    targetLevels: ['chief'],
    relatedItems: ['CHIEF_001']
  }
];

// 推奨項目セット
export const recommendedItemSets: ItemSet[] = [
  {
    id: 'SET_ACUTE_NS_MID',
    name: '急性期病院・看護師・中級',
    facilityType: 'acute',
    role: 'nurse',
    level: 'midlevel',
    corporateItems: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
    facilityItems: ['ACUTE_NS_MID_001', 'ACUTE_NS_MID_002'],
    totalPoints: 40
  },
  {
    id: 'SET_RECOVERY_NS_MID',
    name: '回復期病院・看護師・中級',
    facilityType: 'recovery',
    role: 'nurse',
    level: 'midlevel',
    corporateItems: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
    facilityItems: ['RECOVERY_NS_MID_001'],
    totalPoints: 35
  },
  {
    id: 'SET_CHRONIC_NS_MID',
    name: '慢性期病院・看護師・中級',
    facilityType: 'chronic',
    role: 'nurse',
    level: 'midlevel',
    corporateItems: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
    facilityItems: ['CHRONIC_NS_MID_001'],
    totalPoints: 35
  },
  {
    id: 'SET_CARE_CW_JUN',
    name: '介護施設・介護職・初級',
    facilityType: 'careHospital',
    role: 'careWorker',
    level: 'junior',
    corporateItems: ['CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
    facilityItems: ['CARE_CW_JUN_001'],
    totalPoints: 29
  },
  {
    id: 'SET_NS_MANAGER',
    name: '看護師・師長級',
    facilityType: 'all',
    role: 'nurse',
    level: 'manager',
    corporateItems: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
    facilityItems: ['MANAGE_001'],
    totalPoints: 35
  },
  {
    id: 'SET_NS_CHIEF',
    name: '看護師・主任級',
    facilityType: 'all',
    role: 'nurse',
    level: 'chief',
    corporateItems: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
    facilityItems: ['CHIEF_001'],
    totalPoints: 35
  }
];

// ヘルパー関数
export function getItemsByCategory(category: 'corporate' | 'facility'): EvaluationItem[] {
  const allItems = [...corporateEvaluationItems, ...facilitySpecificItems];
  return allItems.filter(item => item.category === category);
}

export function getItemsByRole(role: string): EvaluationItem[] {
  const allItems = [...corporateEvaluationItems, ...facilitySpecificItems];
  return allItems.filter(item => 
    item.targetRoles.includes(role) || item.targetRoles.includes('all')
  );
}

export function getItemsByLevel(level: string): EvaluationItem[] {
  const allItems = [...corporateEvaluationItems, ...facilitySpecificItems];
  return allItems.filter(item => 
    item.targetLevels.includes(level) || item.targetLevels.includes('all')
  );
}

export function getTrainingsByItem(itemId: string): TrainingProgram[] {
  const item = [...corporateEvaluationItems, ...facilitySpecificItems]
    .find(i => i.id === itemId);
  if (!item || !item.requiredTrainings) return [];
  
  return trainingPrograms.filter(training => 
    item.requiredTrainings?.includes(training.id)
  );
}

export function getItemsByTraining(trainingId: string): EvaluationItem[] {
  const training = trainingPrograms.find(t => t.id === trainingId);
  if (!training) return [];
  
  const allItems = [...corporateEvaluationItems, ...facilitySpecificItems];
  return allItems.filter(item => 
    training.relatedItems.includes(item.id)
  );
}

export function getRecommendedSet(
  facilityType: string, 
  role: string, 
  level: string
): ItemSet | undefined {
  return recommendedItemSets.find(set => 
    set.facilityType === facilityType && 
    set.role === role && 
    set.level === level
  );
}

export function calculateTotalPoints(itemIds: string[]): number {
  const allItems = [...corporateEvaluationItems, ...facilitySpecificItems];
  return itemIds.reduce((total, id) => {
    const item = allItems.find(i => i.id === id);
    return total + (item?.points || 0);
  }, 0);
}