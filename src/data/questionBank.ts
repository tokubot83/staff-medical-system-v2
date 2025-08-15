// 設問バンクデータ
// 経験レベル、研修、施設タイプに応じて動的に選定される設問群

export interface Question {
  id: string;
  categoryCode: string; // C01, C02など
  middleItemCode: string; // M01, M02など
  question: string;
  points: number;
  evaluator: 'superior' | 'self' | 'both';
  
  // 選定条件
  experienceLevels: string[]; // 対象経験レベル
  requiredTrainings?: string[]; // 必須研修
  facilityTypes?: string[]; // 対象施設タイプ
  jobCategories?: string[]; // 対象職種
  
  // メタデータ
  keywords: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  yearIntroduced: number; // 導入年度
  usageCount: number; // 使用回数
  lastUsedYear?: number; // 最終使用年度
  effectiveness?: number; // 効果測定スコア（0-100）
  
  // 動的生成用
  template?: boolean; // テンプレート設問か
  variables?: string[]; // 置換可能な変数
}

// 法定研修マスタ
export const MandatoryTrainings = {
  INFECTION_CONTROL: {
    id: 'infection_control',
    name: '感染対策研修',
    frequency: 'annual',
    requiredForLevels: ['new', 'young', 'midlevel', 'veteran'],
    associatedQuestions: ['Q001', 'Q002', 'Q003']
  },
  SAFETY_MANAGEMENT: {
    id: 'safety_management',
    name: '医療安全研修',
    frequency: 'annual',
    requiredForLevels: ['new', 'young', 'midlevel', 'veteran'],
    associatedQuestions: ['Q004', 'Q005', 'Q006']
  },
  PERSONAL_INFO: {
    id: 'personal_info',
    name: '個人情報保護研修',
    frequency: 'annual',
    requiredForLevels: ['new', 'young', 'midlevel', 'veteran'],
    associatedQuestions: ['Q007', 'Q008']
  },
  EMERGENCY_RESPONSE: {
    id: 'emergency_response',
    name: '救急対応研修',
    frequency: 'biannual',
    requiredForLevels: ['new', 'young'],
    associatedQuestions: ['Q009', 'Q010', 'Q011']
  },
  MEDICATION_SAFETY: {
    id: 'medication_safety',
    name: '薬剤安全研修',
    frequency: 'annual',
    requiredForLevels: ['new', 'young', 'midlevel'],
    associatedQuestions: ['Q012', 'Q013']
  },
  ETHICS: {
    id: 'ethics',
    name: '倫理研修',
    frequency: 'biannual',
    requiredForLevels: ['midlevel', 'veteran', 'ward-chief', 'ward-manager'],
    associatedQuestions: ['Q014', 'Q015']
  },
  LEADERSHIP: {
    id: 'leadership',
    name: 'リーダーシップ研修',
    frequency: 'annual',
    requiredForLevels: ['veteran', 'ward-chief', 'ward-manager'],
    associatedQuestions: ['Q016', 'Q017', 'Q018']
  }
};

// 設問バンク（モックデータ）
export const QuestionBank: Question[] = [
  // C01: 専門技術・スキル - 新人向け
  {
    id: 'Q001',
    categoryCode: 'C01',
    middleItemCode: 'M01',
    question: '感染対策の基本手順（手指衛生、PPE着脱）を正しく実施できているか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['new'],
    requiredTrainings: ['infection_control'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker'],
    keywords: ['感染対策', '手指衛生', 'PPE', '基本技術'],
    difficulty: 'basic',
    yearIntroduced: 2020,
    usageCount: 245,
    lastUsedYear: 2025,
    effectiveness: 85
  },
  {
    id: 'Q002',
    categoryCode: 'C01',
    middleItemCode: 'M01',
    question: '標準予防策を理解し、日常業務で適切に実践できているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['new', 'young'],
    requiredTrainings: ['infection_control'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker', 'therapist'],
    keywords: ['感染対策', '標準予防策', '実践'],
    difficulty: 'basic',
    yearIntroduced: 2020,
    usageCount: 198,
    lastUsedYear: 2025,
    effectiveness: 88
  },
  
  // C01: 専門技術・スキル - 若手向け
  {
    id: 'Q003',
    categoryCode: 'C01',
    middleItemCode: 'M02',
    question: '感染経路別予防策を理解し、適切な対応ができているか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['young'],
    requiredTrainings: ['infection_control'],
    facilityTypes: ['acute', 'rehab'],
    jobCategories: ['nurse'],
    keywords: ['感染対策', '経路別予防', '応用'],
    difficulty: 'intermediate',
    yearIntroduced: 2021,
    usageCount: 156,
    lastUsedYear: 2025,
    effectiveness: 82
  },
  {
    id: 'Q004',
    categoryCode: 'C01',
    middleItemCode: 'M02',
    question: 'インシデント発生時の初期対応と報告を適切に行えているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['young', 'midlevel'],
    requiredTrainings: ['safety_management'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker', 'therapist'],
    keywords: ['医療安全', 'インシデント', '報告'],
    difficulty: 'intermediate',
    yearIntroduced: 2020,
    usageCount: 189,
    lastUsedYear: 2025,
    effectiveness: 90
  },
  
  // C01: 専門技術・スキル - 中堅向け
  {
    id: 'Q005',
    categoryCode: 'C01',
    middleItemCode: 'M03',
    question: 'RCA（根本原因分析）を用いて医療安全の改善提案ができているか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['midlevel', 'veteran'],
    requiredTrainings: ['safety_management'],
    facilityTypes: ['acute', 'rehab'],
    jobCategories: ['nurse', 'therapist'],
    keywords: ['医療安全', 'RCA', '改善提案', '分析'],
    difficulty: 'advanced',
    yearIntroduced: 2022,
    usageCount: 98,
    lastUsedYear: 2025,
    effectiveness: 78
  },
  {
    id: 'Q006',
    categoryCode: 'C01',
    middleItemCode: 'M03',
    question: '多職種連携において専門性を発揮し、チーム医療に貢献できているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['midlevel', 'veteran'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker', 'therapist'],
    keywords: ['チーム医療', '多職種連携', '専門性'],
    difficulty: 'advanced',
    yearIntroduced: 2021,
    usageCount: 167,
    lastUsedYear: 2025,
    effectiveness: 85
  },
  
  // C02: 対人関係・ケア - 新人向け
  {
    id: 'Q007',
    categoryCode: 'C02',
    middleItemCode: 'M04',
    question: '患者・利用者の個人情報を適切に取り扱えているか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['new'],
    requiredTrainings: ['personal_info'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker', 'therapist'],
    keywords: ['個人情報', 'プライバシー', '情報管理'],
    difficulty: 'basic',
    yearIntroduced: 2020,
    usageCount: 234,
    lastUsedYear: 2025,
    effectiveness: 92
  },
  {
    id: 'Q008',
    categoryCode: 'C02',
    middleItemCode: 'M04',
    question: '患者・家族への基本的な接遇とコミュニケーションができているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['new', 'young'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker'],
    keywords: ['接遇', 'コミュニケーション', '基本'],
    difficulty: 'basic',
    yearIntroduced: 2020,
    usageCount: 256,
    lastUsedYear: 2025,
    effectiveness: 87
  },
  
  // C02: 対人関係・ケア - 若手向け
  {
    id: 'Q009',
    categoryCode: 'C02',
    middleItemCode: 'M05',
    question: '急変時の適切な対応と家族への説明ができているか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['young', 'midlevel'],
    requiredTrainings: ['emergency_response'],
    facilityTypes: ['acute'],
    jobCategories: ['nurse'],
    keywords: ['急変対応', '家族説明', 'コミュニケーション'],
    difficulty: 'intermediate',
    yearIntroduced: 2021,
    usageCount: 145,
    lastUsedYear: 2025,
    effectiveness: 83
  },
  {
    id: 'Q010',
    categoryCode: 'C02',
    middleItemCode: 'M05',
    question: '患者の意思決定支援において適切な情報提供ができているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['young', 'midlevel'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker'],
    keywords: ['意思決定支援', '情報提供', 'インフォームドコンセント'],
    difficulty: 'intermediate',
    yearIntroduced: 2022,
    usageCount: 123,
    lastUsedYear: 2025,
    effectiveness: 80
  },
  
  // C03: 安全・品質管理 - 新人向け
  {
    id: 'Q011',
    categoryCode: 'C03',
    middleItemCode: 'M06',
    question: '基本的な救急対応（BLS）を適切に実施できるか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['new', 'young'],
    requiredTrainings: ['emergency_response'],
    facilityTypes: ['acute', 'rehab'],
    jobCategories: ['nurse', 'therapist'],
    keywords: ['BLS', '救急対応', '基本技術'],
    difficulty: 'basic',
    yearIntroduced: 2020,
    usageCount: 178,
    lastUsedYear: 2025,
    effectiveness: 89
  },
  {
    id: 'Q012',
    categoryCode: 'C03',
    middleItemCode: 'M06',
    question: '薬剤の取り扱いと投与時の確認を適切に行えているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['new', 'young'],
    requiredTrainings: ['medication_safety'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse'],
    keywords: ['薬剤安全', '確認', '基本'],
    difficulty: 'basic',
    yearIntroduced: 2020,
    usageCount: 201,
    lastUsedYear: 2025,
    effectiveness: 91
  },
  
  // C03: 安全・品質管理 - 中堅向け
  {
    id: 'Q013',
    categoryCode: 'C03',
    middleItemCode: 'M07',
    question: 'ハイリスク薬剤の管理と安全な投与を実践できているか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['midlevel', 'veteran'],
    requiredTrainings: ['medication_safety'],
    facilityTypes: ['acute'],
    jobCategories: ['nurse'],
    keywords: ['ハイリスク薬剤', '薬剤管理', '安全'],
    difficulty: 'advanced',
    yearIntroduced: 2021,
    usageCount: 112,
    lastUsedYear: 2025,
    effectiveness: 86
  },
  {
    id: 'Q014',
    categoryCode: 'C03',
    middleItemCode: 'M07',
    question: '倫理的課題に対して適切な判断と対応ができているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['midlevel', 'veteran', 'ward-chief'],
    requiredTrainings: ['ethics'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker', 'therapist'],
    keywords: ['倫理', '判断', '課題解決'],
    difficulty: 'advanced',
    yearIntroduced: 2022,
    usageCount: 89,
    lastUsedYear: 2025,
    effectiveness: 79
  },
  
  // リーダーシップ - ベテラン・管理職向け
  {
    id: 'Q015',
    categoryCode: 'C01',
    middleItemCode: 'M08',
    question: '倫理委員会や多職種カンファレンスでリーダーシップを発揮できているか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['veteran', 'ward-chief', 'ward-manager'],
    requiredTrainings: ['ethics', 'leadership'],
    facilityTypes: ['acute', 'rehab'],
    jobCategories: ['nurse'],
    keywords: ['リーダーシップ', '倫理', 'カンファレンス'],
    difficulty: 'advanced',
    yearIntroduced: 2023,
    usageCount: 67,
    lastUsedYear: 2025,
    effectiveness: 82
  },
  {
    id: 'Q016',
    categoryCode: 'C02',
    middleItemCode: 'M08',
    question: 'チームメンバーの育成と指導を効果的に行えているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['veteran', 'ward-chief', 'ward-manager'],
    requiredTrainings: ['leadership'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker', 'therapist'],
    keywords: ['リーダーシップ', '育成', '指導'],
    difficulty: 'advanced',
    yearIntroduced: 2021,
    usageCount: 134,
    lastUsedYear: 2025,
    effectiveness: 84
  },
  {
    id: 'Q017',
    categoryCode: 'C03',
    middleItemCode: 'M08',
    question: '部署の品質改善活動を主導し、成果を上げているか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['ward-chief', 'ward-manager'],
    requiredTrainings: ['leadership'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker'],
    keywords: ['品質改善', 'リーダーシップ', '成果'],
    difficulty: 'advanced',
    yearIntroduced: 2022,
    usageCount: 78,
    lastUsedYear: 2025,
    effectiveness: 81
  },
  {
    id: 'Q018',
    categoryCode: 'C01',
    middleItemCode: 'M09',
    question: '組織の方針を理解し、現場への浸透を図れているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['ward-chief', 'ward-manager'],
    requiredTrainings: ['leadership'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker', 'therapist'],
    keywords: ['組織理解', 'リーダーシップ', '浸透'],
    difficulty: 'advanced',
    yearIntroduced: 2023,
    usageCount: 56,
    lastUsedYear: 2025,
    effectiveness: 77
  },
  
  // テンプレート設問（動的生成用）
  {
    id: 'QT001',
    categoryCode: 'C01',
    middleItemCode: 'M10',
    question: '{{year}}年度の{{training}}研修で学んだ内容を実践できているか？',
    points: 1,
    evaluator: 'both',
    experienceLevels: ['new', 'young', 'midlevel', 'veteran'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker', 'therapist'],
    keywords: ['研修実践', '学習成果'],
    difficulty: 'intermediate',
    yearIntroduced: 2024,
    usageCount: 0,
    template: true,
    variables: ['year', 'training']
  },
  {
    id: 'QT002',
    categoryCode: 'C02',
    middleItemCode: 'M10',
    question: '{{facility}}の特性を理解し、{{specialty}}ケアを適切に提供できているか？',
    points: 1,
    evaluator: 'superior',
    experienceLevels: ['young', 'midlevel', 'veteran'],
    facilityTypes: ['acute', 'rehab', 'elderly'],
    jobCategories: ['nurse', 'care-worker'],
    keywords: ['施設特性', '専門ケア'],
    difficulty: 'intermediate',
    yearIntroduced: 2024,
    usageCount: 0,
    template: true,
    variables: ['facility', 'specialty']
  }
];

// 設問選定ヘルパー関数
export function selectQuestionsForStaff(params: {
  experienceLevel: string;
  completedTrainings: string[];
  facilityType: string;
  jobCategory: string;
  categoryCode: string;
  requiredCount: number;
  year: number;
}): Question[] {
  const { experienceLevel, completedTrainings, facilityType, jobCategory, categoryCode, requiredCount, year } = params;
  
  // 基本フィルタリング
  let candidates = QuestionBank.filter(q => {
    // カテゴリーマッチ
    if (q.categoryCode !== categoryCode) return false;
    
    // 経験レベルマッチ
    if (!q.experienceLevels.includes(experienceLevel)) return false;
    
    // 施設タイプマッチ
    if (q.facilityTypes && !q.facilityTypes.includes(facilityType)) return false;
    
    // 職種マッチ
    if (q.jobCategories && !q.jobCategories.includes(jobCategory)) return false;
    
    return true;
  });
  
  // スコアリング
  const scored = candidates.map(q => {
    let score = 0;
    
    // 研修完了マッチング（高優先度）
    if (q.requiredTrainings) {
      const hasTraining = q.requiredTrainings.some(t => completedTrainings.includes(t));
      if (hasTraining) score += 50;
    }
    
    // 効果性スコア
    if (q.effectiveness) {
      score += q.effectiveness * 0.3;
    }
    
    // 新しい設問を優先（マンネリ防止）
    if (q.lastUsedYear) {
      const yearsUnused = year - q.lastUsedYear;
      score += yearsUnused * 10;
    }
    
    // 使用頻度のバランス（使いすぎ防止）
    score -= Math.min(q.usageCount * 0.1, 20);
    
    return { question: q, score };
  });
  
  // スコア順にソートして必要数選定
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, requiredCount)
    .map(s => s.question);
}

// 動的設問生成
export function generateDynamicQuestion(
  template: Question,
  variables: Record<string, string>
): Question {
  let question = template.question;
  
  // 変数置換
  Object.entries(variables).forEach(([key, value]) => {
    question = question.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  return {
    ...template,
    id: `${template.id}_${Date.now()}`,
    question,
    template: false,
    variables: undefined
  };
}