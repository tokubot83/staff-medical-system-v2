// 施設特化評価項目（20点分）のマスターデータ V2
// 各施設が特性に応じて選択可能な評価項目

export interface FacilitySpecificItem {
  id: string;
  name: string;
  description: string;
  points: number; // 配点（通常5点）
  category: 'emergency' | 'specialized' | 'management' | 'care' | 'rehabilitation';
  applicableFacilities: string[]; // 適用可能施設
  applicableJobs: string[]; // 適用可能職種
  experienceLevels?: string[]; // 対象経験レベル
  evaluationCriteria: string[]; // 評価基準
  requiredTrainings?: string[]; // 必要な研修
}

// 施設特化項目の選択セット
export interface FacilityItemSet {
  facilityType: string;
  selectedItems: string[]; // 選択された項目ID（合計20点分）
  totalPoints: number;
  effectiveFrom: Date;
  approvedBy: string;
}

// 施設特化評価項目マスター
export const facilitySpecificItemsV2: FacilitySpecificItem[] = [
  // === 急性期病院向け項目 ===
  {
    id: 'FS001',
    name: '救急対応スキル',
    description: '救急患者への初期対応、トリアージ、BLS/ACLS実践',
    points: 5,
    category: 'emergency',
    applicableFacilities: ['acute'],
    applicableJobs: ['nurse', 'assistantNurse'],
    experienceLevels: ['midlevel', 'veteran', 'manager'],
    evaluationCriteria: [
      'BLS/ACLSの資格を保持し、実践できる',
      'トリアージを適切に実施できる',
      '救急カートの管理・点検ができる',
      'チーム医療での連携ができる'
    ],
    requiredTrainings: ['TR_EMERGENCY_001', 'TR_BLS_001']
  },
  {
    id: 'FS002',
    name: '高度医療機器操作',
    description: '人工呼吸器、心電図モニター、輸液ポンプ等の操作管理',
    points: 5,
    category: 'specialized',
    applicableFacilities: ['acute'],
    applicableJobs: ['nurse'],
    experienceLevels: ['midlevel', 'veteran'],
    evaluationCriteria: [
      '人工呼吸器の基本操作・アラーム対応ができる',
      '心電図の基本的な判読ができる',
      '医療機器のトラブルシューティングができる',
      '日常点検と記録を適切に行っている'
    ],
    requiredTrainings: ['TR_DEVICE_001', 'TR_DEVICE_002']
  },
  {
    id: 'FS003',
    name: '周術期看護',
    description: '手術前後の患者管理、術後合併症の予防と早期発見',
    points: 5,
    category: 'specialized',
    applicableFacilities: ['acute'],
    applicableJobs: ['nurse'],
    experienceLevels: ['midlevel', 'veteran'],
    evaluationCriteria: [
      '術前評価とリスクアセスメントができる',
      '術後の観察と異常の早期発見ができる',
      '疼痛管理を適切に実施できる',
      '早期離床を促進できる'
    ]
  },
  {
    id: 'FS004',
    name: 'クリティカルケア',
    description: 'ICU・CCU等での重症患者管理',
    points: 5,
    category: 'specialized',
    applicableFacilities: ['acute'],
    applicableJobs: ['nurse'],
    experienceLevels: ['veteran', 'manager'],
    evaluationCriteria: [
      '重症度評価（APACHE等）ができる',
      '人工呼吸器管理ができる',
      '持続的血液濾過透析の管理ができる',
      '家族ケアを実践できる'
    ]
  },

  // === 慢性期病院向け項目 ===
  {
    id: 'FS005',
    name: '褥瘡ケア専門',
    description: '褥瘡予防と治療、DESIGN-R評価の実施',
    points: 5,
    category: 'care',
    applicableFacilities: ['chronic'],
    applicableJobs: ['nurse', 'assistantNurse'],
    experienceLevels: ['midlevel', 'veteran'],
    evaluationCriteria: [
      'DESIGN-R評価を正確に実施できる',
      '体圧分散用具を適切に選択・使用できる',
      '創傷処置と記録を適切に行える',
      'NST（栄養サポートチーム）と連携できる'
    ],
    requiredTrainings: ['TR_PRESSURE_001']
  },
  {
    id: 'FS006',
    name: '排泄ケア専門',
    description: '排泄自立支援、ストーマケア、排泄用具の選定',
    points: 5,
    category: 'care',
    applicableFacilities: ['chronic', 'roken'],
    applicableJobs: ['nurse', 'assistantNurse', 'nursingAide'],
    evaluationCriteria: [
      '排泄パターンの把握と個別ケアができる',
      'オムツの適切な選択と使用ができる',
      'ストーマケアを実施できる',
      '排泄自立に向けた支援ができる'
    ]
  },
  {
    id: 'FS007',
    name: '摂食嚥下ケア',
    description: '嚥下評価、食事介助、誤嚥予防',
    points: 5,
    category: 'care',
    applicableFacilities: ['chronic', 'roken'],
    applicableJobs: ['nurse', 'assistantNurse', 'careWorker'],
    evaluationCriteria: [
      '嚥下スクリーニングを実施できる',
      '安全な食事介助ができる',
      '誤嚥リスクを評価できる',
      'STと連携してケアを実施できる'
    ]
  },
  {
    id: 'FS008',
    name: '終末期ケア',
    description: '看取りケア、疼痛緩和、家族支援',
    points: 5,
    category: 'care',
    applicableFacilities: ['chronic', 'roken', 'grouphome'],
    applicableJobs: ['nurse', 'assistantNurse', 'careWorker'],
    evaluationCriteria: [
      '疼痛評価と緩和ケアができる',
      '本人・家族の意思を尊重したケアができる',
      'エンゼルケアを適切に実施できる',
      'グリーフケアを理解し実践できる'
    ]
  },

  // === 回復期リハビリ病院向け項目 ===
  {
    id: 'FS009',
    name: 'リハビリテーション看護',
    description: 'FIM評価、ADL訓練、多職種連携',
    points: 5,
    category: 'rehabilitation',
    applicableFacilities: ['recovery', 'chronic'],
    applicableJobs: ['nurse', 'assistantNurse', 'nursingAide'],
    evaluationCriteria: [
      'FIM評価を正確に実施できる',
      'ADL向上に向けた介入ができる',
      'リハビリスタッフと情報共有できる',
      '在宅復帰に向けた支援ができる'
    ],
    requiredTrainings: ['TR_REHAB_001']
  },
  {
    id: 'FS010',
    name: '高次脳機能障害ケア',
    description: '認知機能評価、生活リハビリテーション',
    points: 5,
    category: 'rehabilitation',
    applicableFacilities: ['recovery'],
    applicableJobs: ['nurse', 'assistantNurse'],
    experienceLevels: ['midlevel', 'veteran'],
    evaluationCriteria: [
      '高次脳機能障害を理解している',
      '認知機能評価ツールを使用できる',
      '生活場面での訓練を実施できる',
      '家族への指導ができる'
    ]
  },

  // === 介護施設向け項目 ===
  {
    id: 'FS011',
    name: '認知症ケア実践',
    description: 'BPSD対応、パーソンセンタードケア実践',
    points: 5,
    category: 'care',
    applicableFacilities: ['roken', 'grouphome'],
    applicableJobs: ['nurse', 'careWorker', 'nursingAide'],
    evaluationCriteria: [
      '認知症の中核症状とBPSDを理解している',
      'パーソンセンタードケアを実践できる',
      'ユマニチュードの技法を活用できる',
      '認知症ケアマッピングを実施できる'
    ],
    requiredTrainings: ['TR_DEMENTIA_001', 'TR_DEMENTIA_002']
  },
  {
    id: 'FS012',
    name: 'レクリエーション企画',
    description: '集団・個別レクリエーションの企画実施',
    points: 5,
    category: 'care',
    applicableFacilities: ['roken', 'grouphome', 'daycare'],
    applicableJobs: ['careWorker', 'nursingAide'],
    evaluationCriteria: [
      '対象者に応じたレクを企画できる',
      '安全に配慮して実施できる',
      '参加を促す声かけができる',
      '効果を評価し改善できる'
    ]
  },
  {
    id: 'FS013',
    name: '生活支援技術',
    description: '移乗・移動介助、更衣・整容支援',
    points: 5,
    category: 'care',
    applicableFacilities: ['roken', 'grouphome'],
    applicableJobs: ['careWorker', 'careAssistant'],
    evaluationCriteria: [
      'ボディメカニクスを活用した介助ができる',
      '福祉用具を適切に使用できる',
      '自立支援の視点でケアができる',
      '個別性に配慮した支援ができる'
    ]
  },

  // === 管理職向け項目 ===
  {
    id: 'FS014',
    name: '部署マネジメント',
    description: '目標管理、人材育成、業務改善',
    points: 10,
    category: 'management',
    applicableFacilities: ['acute', 'chronic', 'recovery', 'roken', 'grouphome'],
    applicableJobs: ['nurse'],
    experienceLevels: ['manager'],
    evaluationCriteria: [
      '部署の目標設定と進捗管理ができる',
      'スタッフの教育計画を立案・実施できる',
      '業務改善活動を推進できる',
      '労務管理を適切に行える'
    ],
    requiredTrainings: ['TR_MANAGE_001']
  },
  {
    id: 'FS015',
    name: 'チームリーダーシップ',
    description: 'チーム運営、後輩指導、問題解決',
    points: 5,
    category: 'management',
    applicableFacilities: ['acute', 'chronic', 'recovery', 'roken', 'grouphome'],
    applicableJobs: ['nurse', 'assistantNurse', 'careWorker'],
    experienceLevels: ['chief', 'veteran'],
    evaluationCriteria: [
      'チームの調整役として機能している',
      '後輩への指導を積極的に行っている',
      '問題解決に向けて行動できる',
      '上司・他部署と連携できる'
    ],
    requiredTrainings: ['TR_LEADER_001']
  },
  {
    id: 'FS016',
    name: '医療安全推進',
    description: 'インシデント分析、安全対策立案、安全文化醸成',
    points: 5,
    category: 'management',
    applicableFacilities: ['acute', 'chronic', 'recovery'],
    applicableJobs: ['nurse'],
    experienceLevels: ['chief', 'veteran', 'manager'],
    evaluationCriteria: [
      'インシデントの分析ができる',
      'RCA（根本原因分析）を実施できる',
      '再発防止策を立案できる',
      '安全文化の醸成に貢献している'
    ]
  },
  {
    id: 'FS017',
    name: '感染管理推進',
    description: '感染対策の立案実施、サーベイランス、教育',
    points: 5,
    category: 'management',
    applicableFacilities: ['acute', 'chronic', 'recovery', 'roken'],
    applicableJobs: ['nurse'],
    experienceLevels: ['chief', 'veteran', 'manager'],
    evaluationCriteria: [
      'サーベイランスを実施できる',
      'アウトブレイク対応ができる',
      '感染対策の教育ができる',
      'ICTと連携して活動できる'
    ]
  }
];

// 推奨選択パターン
export const recommendedFacilityItemSets: Record<string, Record<string, Record<string, string[]>>> = {
  // 急性期病院
  acute: {
    nurse: {
      midlevel: ['FS001', 'FS002', 'FS015', 'FS016'], // 救急5+機器5+リーダー5+安全5=20点
      veteran: ['FS001', 'FS003', 'FS015', 'FS016'],  // 救急5+周術期5+リーダー5+安全5=20点
      manager: ['FS014', 'FS016', 'FS017']            // 部署管理10+安全5+感染5=20点
    },
    assistantNurse: {
      midlevel: ['FS001', 'FS015', 'FS016', 'FS017'], // 救急5+リーダー5+安全5+感染5=20点
    },
    nursingAide: {
      all: ['FS013', 'FS015', 'FS016', 'FS017']      // 生活支援5+リーダー5+安全5+感染5=20点
    }
  },
  
  // 慢性期病院
  chronic: {
    nurse: {
      midlevel: ['FS005', 'FS006', 'FS007', 'FS015'], // 褥瘡5+排泄5+嚥下5+リーダー5=20点
      veteran: ['FS005', 'FS008', 'FS009', 'FS015'],  // 褥瘡5+終末期5+リハ5+リーダー5=20点
      manager: ['FS014', 'FS008', 'FS016']            // 部署管理10+終末期5+安全5=20点
    },
    careWorker: {
      junior: ['FS006', 'FS007', 'FS011', 'FS013'],   // 排泄5+嚥下5+認知症5+生活支援5=20点
      midlevel: ['FS007', 'FS008', 'FS011', 'FS015']  // 嚥下5+終末期5+認知症5+リーダー5=20点
    }
  },
  
  // 回復期リハビリ病院
  recovery: {
    nurse: {
      midlevel: ['FS009', 'FS010', 'FS015', 'FS016'], // リハ看護5+高次脳5+リーダー5+安全5=20点
      veteran: ['FS009', 'FS010', 'FS015', 'FS017']   // リハ看護5+高次脳5+リーダー5+感染5=20点
    }
  },
  
  // 介護施設
  roken: {
    nurse: {
      midlevel: ['FS005', 'FS008', 'FS011', 'FS015'], // 褥瘡5+終末期5+認知症5+リーダー5=20点
    },
    careWorker: {
      junior: ['FS011', 'FS012', 'FS013', 'FS006'],   // 認知症5+レク5+生活支援5+排泄5=20点
      midlevel: ['FS011', 'FS008', 'FS013', 'FS015']  // 認知症5+終末期5+生活支援5+リーダー5=20点
    }
  },
  
  // グループホーム
  grouphome: {
    careWorker: {
      all: ['FS011', 'FS012', 'FS013', 'FS008']       // 認知症5+レク5+生活支援5+終末期5=20点
    }
  }
};

// 選択可能かチェックする関数
export function isItemSelectable(
  item: FacilitySpecificItem,
  facilityType: string,
  jobCategory: string,
  experienceLevel: string
): boolean {
  // 施設種別チェック
  if (!item.applicableFacilities.includes(facilityType)) {
    return false;
  }
  
  // 職種チェック
  if (!item.applicableJobs.includes(jobCategory) && !item.applicableJobs.includes('all')) {
    return false;
  }
  
  // 経験レベルチェック（指定がある場合のみ）
  if (item.experienceLevels && item.experienceLevels.length > 0) {
    if (!item.experienceLevels.includes(experienceLevel) && !item.experienceLevels.includes('all')) {
      return false;
    }
  }
  
  return true;
}

// 推奨セットを取得する関数
export function getRecommendedFacilityItems(
  facilityType: string,
  jobCategory: string,
  experienceLevel: string
): string[] {
  const facilitySet = recommendedFacilityItemSets[facilityType];
  if (!facilitySet) return [];
  
  const jobSet = facilitySet[jobCategory];
  if (!jobSet) return [];
  
  // 経験レベルに応じた推奨セットを返す
  return jobSet[experienceLevel] || jobSet['all'] || [];
}

// 選択済み項目の合計点数を計算
export function calculateSelectedPoints(selectedItemIds: string[]): number {
  return selectedItemIds.reduce((total, itemId) => {
    const item = facilitySpecificItemsV2.find(i => i.id === itemId);
    return total + (item?.points || 0);
  }, 0);
}

// 選択可能な残り点数を計算
export function getRemainingPoints(selectedItemIds: string[]): number {
  const maxPoints = 20;
  const currentPoints = calculateSelectedPoints(selectedItemIds);
  return maxPoints - currentPoints;
}