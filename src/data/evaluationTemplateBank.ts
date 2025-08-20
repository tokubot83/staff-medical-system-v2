// 評価テンプレートバンク - 新システムv3専用（100点満点対応）

import { 
  EvaluationItem, 
  corporateEvaluationItems, 
  facilitySpecificItems,
  experienceLevels,
  roles,
  facilityTypes
} from './evaluationItemBank';

// 組織貢献度評価項目（50点）
export interface ContributionItem {
  id: string;
  name: string;
  description: string;
  category: 'facility' | 'corporate'; // 施設貢献25点 | 法人貢献25点
  points: number;
  evaluationCriteria: string[];
  targetRoles: string[];
  targetLevels: string[];
}

// v3評価テンプレート構造（100点満点）
export interface V3EvaluationTemplate {
  id: string;
  name: string;
  version: 'v3';
  description: string;
  category: 'standard' | 'recommended' | 'custom' | 'facility-specific';
  
  // 対象プロファイル
  targetProfile: {
    facilityType: string; // 施設種別
    roles: string[];      // 対象職種
    experienceLevels: string[]; // 対象経験レベル
    applicableStaffCount?: number; // 適用対象人数（推定）
  };

  // 100点満点構造
  evaluationStructure: {
    // 技術評価50点
    technicalEvaluation: {
      // 法人統一30点
      corporateUnified: {
        totalPoints: 30;
        items: string[]; // EvaluationItem ID配列
        weightDistribution: 'balanced' | 'supervisor-heavy' | 'self-heavy';
      };
      // 施設特化20点
      facilitySpecific: {
        totalPoints: 20;
        recommendedItems: string[]; // 推奨項目ID
        customizableSlots: number;  // カスタマイズ可能枠数
        alternatives: string[];     // 代替項目ID
      };
    };

    // 組織貢献50点
    contributionEvaluation: {
      // 施設貢献25点
      facilityContribution: {
        totalPoints: 25;
        items: string[]; // ContributionItem ID配列
        evaluationMethod: '4軸独立相対評価';
      };
      // 法人貢献25点
      corporateContribution: {
        totalPoints: 25;
        items: string[]; // ContributionItem ID配列
        evaluationMethod: '4軸独立相対評価';
      };
    };
  };

  // 使用統計・最適化データ
  usageMetrics: {
    popularity: number;        // 使用頻度 (0-100)
    successRate: number;       // 成功率 (0-100)
    feedbackScore: number;     // フィードバックスコア (1-5)
    lastOptimized: string;     // 最終最適化日時
    activeInstallations: number; // アクティブ導入数
  };

  // カスタマイズ設定
  customization: {
    isCustomizable: boolean;
    lockedItems: string[];     // 変更不可項目
    recommendedCustomizations: CustomizationOption[];
  };

  // 作成・更新情報
  metadata: {
    createdBy: 'system' | 'facility' | 'user';
    createdAt: string;
    updatedAt: string;
    version: string;
    tags: string[];
  };
}

// カスタマイズオプション
export interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  type: 'add_item' | 'adjust_weight' | 'change_method';
  configuration: any;
  impact: 'low' | 'medium' | 'high';
}

// 組織貢献度評価項目データ
export const contributionItems: ContributionItem[] = [
  // 施設貢献項目（25点）
  {
    id: 'FAC_CONTRIB_001',
    name: '医療・ケアの質向上への取組',
    description: '施設内での医療・ケア品質向上活動への参画・貢献',
    category: 'facility',
    points: 8,
    evaluationCriteria: [
      'QI活動に主体的に参加している',
      '業務改善提案を積極的に行っている', 
      'マニュアル作成・更新に貢献している',
      'チーム医療・ケアの質向上に寄与している'
    ],
    targetRoles: ['all'],
    targetLevels: ['midlevel', 'veteran', 'chief', 'manager']
  },
  {
    id: 'FAC_CONTRIB_002', 
    name: '職員教育・指導への貢献',
    description: '新人・後輩職員の教育指導、OJTでの役割発揮',
    category: 'facility',
    points: 8,
    evaluationCriteria: [
      '新人教育・プリセプター役を担っている',
      '後輩職員への指導・助言を行っている',
      '院内研修講師を務めている',
      '教育計画の立案・実施に参画している'
    ],
    targetRoles: ['all'],
    targetLevels: ['midlevel', 'veteran', 'chief', 'manager']
  },
  {
    id: 'FAC_CONTRIB_003',
    name: '委員会・プロジェクト活動',
    description: '各種委員会、改善プロジェクトでのリーダーシップ発揮',
    category: 'facility',
    points: 9,
    evaluationCriteria: [
      '委員会活動に積極参加している',
      'プロジェクトリーダーを担当している',
      '部署間調整・連携を推進している',
      '問題解決に主体的に取り組んでいる'
    ],
    targetRoles: ['all'], 
    targetLevels: ['veteran', 'chief', 'manager']
  },

  // 法人貢献項目（25点）
  {
    id: 'CORP_CONTRIB_001',
    name: '法人理念・方針の実践',
    description: '法人理念の理解と日常業務での実践・体現',
    category: 'corporate',
    points: 8,
    evaluationCriteria: [
      '法人理念を理解し実践している',
      '法人方針に沿った業務遂行をしている',
      '法人ブランド価値向上に寄与している',
      '模範的行動で他職員に良い影響を与えている'
    ],
    targetRoles: ['all'],
    targetLevels: ['all']
  },
  {
    id: 'CORP_CONTRIB_002',
    name: '法人全体への貢献活動',
    description: '施設を越えた法人レベルでの活動・貢献',
    category: 'corporate', 
    points: 8,
    evaluationCriteria: [
      '法人研修・勉強会に参加している',
      '他施設との連携・支援を行っている',
      '法人プロジェクトに参画している',
      '法人全体の発展に寄与している'
    ],
    targetRoles: ['all'],
    targetLevels: ['midlevel', 'veteran', 'chief', 'manager']
  },
  {
    id: 'CORP_CONTRIB_003',
    name: '地域・社会貢献活動',
    description: '地域医療・介護への貢献、社会的責任の遂行',
    category: 'corporate',
    points: 9,
    evaluationCriteria: [
      '地域連携活動に参加している',
      '地域住民向け健康講座等に貢献している',
      '実習生受入れ・指導に協力している',
      '災害時支援・ボランティア活動を行っている'
    ],
    targetRoles: ['all'],
    targetLevels: ['veteran', 'chief', 'manager']
  }
];

// 標準テンプレート定義
export const standardTemplates: V3EvaluationTemplate[] = [
  // 急性期病院・看護師・中堅レベル
  {
    id: 'STD_ACUTE_NURSE_MID',
    name: '急性期病院_看護師_中堅レベル_標準テンプレート',
    version: 'v3',
    description: '急性期病院の中堅看護師向け標準的な評価テンプレート。救急対応・高度医療機器操作を重視。',
    category: 'standard',
    
    targetProfile: {
      facilityType: 'acute',
      roles: ['nurse'],
      experienceLevels: ['midlevel'],
      applicableStaffCount: 15
    },

    evaluationStructure: {
      technicalEvaluation: {
        corporateUnified: {
          totalPoints: 30,
          items: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
          weightDistribution: 'balanced'
        },
        facilitySpecific: {
          totalPoints: 20,
          recommendedItems: ['ACUTE_NS_MID_001', 'ACUTE_NS_MID_002'],
          customizableSlots: 2,
          alternatives: []
        }
      },
      contributionEvaluation: {
        facilityContribution: {
          totalPoints: 25,
          items: ['FAC_CONTRIB_001', 'FAC_CONTRIB_002', 'FAC_CONTRIB_003'],
          evaluationMethod: '4軸独立相対評価'
        },
        corporateContribution: {
          totalPoints: 25,
          items: ['CORP_CONTRIB_001', 'CORP_CONTRIB_002', 'CORP_CONTRIB_003'],
          evaluationMethod: '4軸独立相対評価'
        }
      }
    },

    usageMetrics: {
      popularity: 85,
      successRate: 92,
      feedbackScore: 4.3,
      lastOptimized: '2025-08-01',
      activeInstallations: 3
    },

    customization: {
      isCustomizable: true,
      lockedItems: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
      recommendedCustomizations: []
    },

    metadata: {
      createdBy: 'system',
      createdAt: '2025-08-20',
      updatedAt: '2025-08-20',
      version: '1.0.0',
      tags: ['急性期', '看護師', '中堅', 'スタンダード']
    }
  },

  // 回復期病院・看護師・中堅レベル
  {
    id: 'STD_RECOVERY_NURSE_MID',
    name: '回復期病院_看護師_中堅レベル_標準テンプレート',
    version: 'v3',
    description: '回復期病院の中堅看護師向け標準テンプレート。リハビリ看護・多職種連携を重視。',
    category: 'standard',

    targetProfile: {
      facilityType: 'recovery',
      roles: ['nurse'],
      experienceLevels: ['midlevel'],
      applicableStaffCount: 12
    },

    evaluationStructure: {
      technicalEvaluation: {
        corporateUnified: {
          totalPoints: 30,
          items: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
          weightDistribution: 'balanced'
        },
        facilitySpecific: {
          totalPoints: 20,
          recommendedItems: ['RECOVERY_NS_MID_001'],
          customizableSlots: 3,
          alternatives: []
        }
      },
      contributionEvaluation: {
        facilityContribution: {
          totalPoints: 25,
          items: ['FAC_CONTRIB_001', 'FAC_CONTRIB_002', 'FAC_CONTRIB_003'],
          evaluationMethod: '4軸独立相対評価'
        },
        corporateContribution: {
          totalPoints: 25,
          items: ['CORP_CONTRIB_001', 'CORP_CONTRIB_002', 'CORP_CONTRIB_003'],
          evaluationMethod: '4軸独立相対評価'
        }
      }
    },

    usageMetrics: {
      popularity: 78,
      successRate: 89,
      feedbackScore: 4.1,
      lastOptimized: '2025-08-01',
      activeInstallations: 2
    },

    customization: {
      isCustomizable: true,
      lockedItems: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
      recommendedCustomizations: []
    },

    metadata: {
      createdBy: 'system',
      createdAt: '2025-08-20',
      updatedAt: '2025-08-20',
      version: '1.0.0',
      tags: ['回復期', '看護師', '中堅', 'スタンダード']
    }
  },

  // 慢性期病院・看護師・中堅レベル
  {
    id: 'STD_CHRONIC_NURSE_MID',
    name: '慢性期病院_看護師_中堅レベル_標準テンプレート',
    version: 'v3',
    description: '慢性期病院の中堅看護師向け標準テンプレート。褥瘡ケア・療養支援を重視。',
    category: 'standard',

    targetProfile: {
      facilityType: 'chronic',
      roles: ['nurse'],
      experienceLevels: ['midlevel'],
      applicableStaffCount: 10
    },

    evaluationStructure: {
      technicalEvaluation: {
        corporateUnified: {
          totalPoints: 30,
          items: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
          weightDistribution: 'balanced'
        },
        facilitySpecific: {
          totalPoints: 20,
          recommendedItems: ['CHRONIC_NS_MID_001'],
          customizableSlots: 3,
          alternatives: []
        }
      },
      contributionEvaluation: {
        facilityContribution: {
          totalPoints: 25,
          items: ['FAC_CONTRIB_001', 'FAC_CONTRIB_002', 'FAC_CONTRIB_003'],
          evaluationMethod: '4軸独立相対評価'
        },
        corporateContribution: {
          totalPoints: 25,
          items: ['CORP_CONTRIB_001', 'CORP_CONTRIB_002', 'CORP_CONTRIB_003'],
          evaluationMethod: '4軸独立相対評価'
        }
      }
    },

    usageMetrics: {
      popularity: 72,
      successRate: 87,
      feedbackScore: 4.0,
      lastOptimized: '2025-08-01',
      activeInstallations: 2
    },

    customization: {
      isCustomizable: true,
      lockedItems: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
      recommendedCustomizations: []
    },

    metadata: {
      createdBy: 'system',
      createdAt: '2025-08-20',
      updatedAt: '2025-08-20',
      version: '1.0.0',
      tags: ['慢性期', '看護師', '中堅', 'スタンダード']
    }
  },

  // 介護施設・介護職・初級レベル
  {
    id: 'STD_CARE_WORKER_JUN',
    name: '介護施設_介護職_初級レベル_標準テンプレート',
    version: 'v3',
    description: '介護施設の初級介護職向け標準テンプレート。認知症ケア基礎を重視。',
    category: 'standard',

    targetProfile: {
      facilityType: 'nursingHome',
      roles: ['careWorker'],
      experienceLevels: ['junior'],
      applicableStaffCount: 8
    },

    evaluationStructure: {
      technicalEvaluation: {
        corporateUnified: {
          totalPoints: 30,
          items: ['CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'], // 医療安全除外
          customizableSlots: 1,
          weightDistribution: 'balanced'
        },
        facilitySpecific: {
          totalPoints: 20,
          recommendedItems: ['CARE_CW_JUN_001'],
          customizableSlots: 3,
          alternatives: []
        }
      },
      contributionEvaluation: {
        facilityContribution: {
          totalPoints: 25,
          items: ['FAC_CONTRIB_001', 'FAC_CONTRIB_002'],
          evaluationMethod: '4軸独立相対評価'
        },
        corporateContribution: {
          totalPoints: 25,
          items: ['CORP_CONTRIB_001', 'CORP_CONTRIB_002'],
          evaluationMethod: '4軸独立相対評価'
        }
      }
    },

    usageMetrics: {
      popularity: 68,
      successRate: 84,
      feedbackScore: 3.9,
      lastOptimized: '2025-08-01',
      activeInstallations: 2
    },

    customization: {
      isCustomizable: true,
      lockedItems: ['CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
      recommendedCustomizations: []
    },

    metadata: {
      createdBy: 'system',
      createdAt: '2025-08-20',
      updatedAt: '2025-08-20',
      version: '1.0.0',
      tags: ['介護施設', '介護職', '初級', 'スタンダード']
    }
  },

  // 管理職向けテンプレート（師長級）
  {
    id: 'STD_NURSE_MANAGER',
    name: '看護師_師長級_標準テンプレート',
    version: 'v3',
    description: '師長級管理職向け標準テンプレート。マネジメント能力を重視。',
    category: 'standard',

    targetProfile: {
      facilityType: 'all',
      roles: ['nurse'],
      experienceLevels: ['manager'],
      applicableStaffCount: 5
    },

    evaluationStructure: {
      technicalEvaluation: {
        corporateUnified: {
          totalPoints: 30,
          items: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
          weightDistribution: 'supervisor-heavy'
        },
        facilitySpecific: {
          totalPoints: 20,
          recommendedItems: ['MANAGE_001'],
          customizableSlots: 3,
          alternatives: []
        }
      },
      contributionEvaluation: {
        facilityContribution: {
          totalPoints: 25,
          items: ['FAC_CONTRIB_001', 'FAC_CONTRIB_002', 'FAC_CONTRIB_003'],
          evaluationMethod: '4軸独立相対評価'
        },
        corporateContribution: {
          totalPoints: 25,
          items: ['CORP_CONTRIB_001', 'CORP_CONTRIB_002', 'CORP_CONTRIB_003'],
          evaluationMethod: '4軸独立相対評価'
        }
      }
    },

    usageMetrics: {
      popularity: 91,
      successRate: 95,
      feedbackScore: 4.5,
      lastOptimized: '2025-08-01',
      activeInstallations: 1
    },

    customization: {
      isCustomizable: true,
      lockedItems: ['CORP001', 'CORP002', 'CORP003', 'CORP004', 'CORP005', 'CORP006'],
      recommendedCustomizations: []
    },

    metadata: {
      createdBy: 'system',
      createdAt: '2025-08-20',
      updatedAt: '2025-08-20',
      version: '1.0.0',
      tags: ['看護師', '師長', '管理職', 'スタンダード']
    }
  }
];

// テンプレートバンククラス
export class EvaluationTemplateBank {
  private templates: V3EvaluationTemplate[] = [];

  constructor() {
    this.templates = [...standardTemplates];
  }

  // テンプレート取得メソッド
  getAllTemplates(): V3EvaluationTemplate[] {
    return this.templates;
  }

  getTemplateById(id: string): V3EvaluationTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  getTemplatesByCategory(category: string): V3EvaluationTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  // 条件に基づくテンプレート検索
  searchTemplates(criteria: {
    facilityType?: string;
    role?: string;
    experienceLevel?: string;
    category?: string;
  }): V3EvaluationTemplate[] {
    return this.templates.filter(template => {
      if (criteria.facilityType && 
          template.targetProfile.facilityType !== 'all' && 
          template.targetProfile.facilityType !== criteria.facilityType) {
        return false;
      }
      if (criteria.role && !template.targetProfile.roles.includes(criteria.role)) {
        return false;
      }
      if (criteria.experienceLevel && 
          !template.targetProfile.experienceLevels.includes(criteria.experienceLevel)) {
        return false;
      }
      if (criteria.category && template.category !== criteria.category) {
        return false;
      }
      return true;
    });
  }

  // 推奨テンプレート取得（使用統計ベース）
  getRecommendedTemplates(
    facilityType: string, 
    role: string, 
    experienceLevel: string
  ): V3EvaluationTemplate[] {
    const candidates = this.searchTemplates({
      facilityType,
      role,
      experienceLevel
    });

    // 人気度とフィードバックスコアでソート
    return candidates
      .sort((a, b) => {
        const scoreA = a.usageMetrics.popularity * 0.6 + a.usageMetrics.feedbackScore * 20;
        const scoreB = b.usageMetrics.popularity * 0.6 + b.usageMetrics.feedbackScore * 20;
        return scoreB - scoreA;
      })
      .slice(0, 3); // 上位3個を返す
  }

  // カスタムテンプレート作成
  createCustomTemplate(
    baseTemplateId: string,
    customizations: any,
    metadata: {
      name: string;
      description: string;
      createdBy: string;
    }
  ): V3EvaluationTemplate | null {
    const baseTemplate = this.getTemplateById(baseTemplateId);
    if (!baseTemplate) return null;

    const customTemplate: V3EvaluationTemplate = {
      ...baseTemplate,
      id: `CUSTOM_${Date.now()}`,
      name: metadata.name,
      description: metadata.description,
      category: 'custom',
      usageMetrics: {
        popularity: 0,
        successRate: 0,
        feedbackScore: 0,
        lastOptimized: new Date().toISOString().split('T')[0],
        activeInstallations: 0
      },
      metadata: {
        ...baseTemplate.metadata,
        createdBy: 'user',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        version: '1.0.0'
      }
    };

    // カスタマイズを適用
    if (customizations.technicalItems) {
      customTemplate.evaluationStructure.technicalEvaluation.facilitySpecific.recommendedItems =
        customizations.technicalItems;
    }
    if (customizations.contributionItems) {
      customTemplate.evaluationStructure.contributionEvaluation.facilityContribution.items =
        customizations.contributionItems;
    }

    this.templates.push(customTemplate);
    return customTemplate;
  }

  // 使用統計更新
  updateUsageMetrics(templateId: string, metrics: Partial<typeof standardTemplates[0]['usageMetrics']>): boolean {
    const template = this.getTemplateById(templateId);
    if (!template) return false;

    template.usageMetrics = { ...template.usageMetrics, ...metrics };
    template.metadata.updatedAt = new Date().toISOString().split('T')[0];
    return true;
  }

  // テンプレート検証
  validateTemplate(template: V3EvaluationTemplate): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // 100点満点チェック
    const techTotal = template.evaluationStructure.technicalEvaluation.corporateUnified.totalPoints +
                     template.evaluationStructure.technicalEvaluation.facilitySpecific.totalPoints;
    const contribTotal = template.evaluationStructure.contributionEvaluation.facilityContribution.totalPoints +
                        template.evaluationStructure.contributionEvaluation.corporateContribution.totalPoints;
    
    if (techTotal !== 50) errors.push(`技術評価は50点でなければなりません（現在: ${techTotal}点）`);
    if (contribTotal !== 50) errors.push(`組織貢献は50点でなければなりません（現在: ${contribTotal}点）`);

    // 必須項目チェック
    if (!template.id || !template.name) errors.push('ID・名前は必須です');
    if (!template.targetProfile.facilityType) errors.push('施設種別は必須です');
    if (template.targetProfile.roles.length === 0) errors.push('対象職種は必須です');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// テンプレートバンクインスタンス
export const templateBank = new EvaluationTemplateBank();

// ユーティリティ関数
export function getAvailableTemplatesForProfile(
  facilityType: string,
  role: string,
  experienceLevel: string
): {
  recommended: V3EvaluationTemplate[];
  standard: V3EvaluationTemplate[];
  all: V3EvaluationTemplate[];
} {
  const recommended = templateBank.getRecommendedTemplates(facilityType, role, experienceLevel);
  const standard = templateBank.searchTemplates({
    facilityType,
    role,
    experienceLevel,
    category: 'standard'
  });
  const all = templateBank.searchTemplates({
    facilityType,
    role,
    experienceLevel
  });

  return { recommended, standard, all };
}

export function generateTemplatePreview(templateId: string): {
  template: V3EvaluationTemplate | undefined;
  preview: {
    totalPoints: number;
    technicalItems: EvaluationItem[];
    contributionItems: ContributionItem[];
    estimatedEvaluationTime: number;
  };
} | null {
  const template = templateBank.getTemplateById(templateId);
  if (!template) return null;

  // 技術評価項目を取得
  const techItemIds = [
    ...template.evaluationStructure.technicalEvaluation.corporateUnified.items,
    ...template.evaluationStructure.technicalEvaluation.facilitySpecific.recommendedItems
  ];
  const technicalItems = [...corporateEvaluationItems, ...facilitySpecificItems]
    .filter(item => techItemIds.includes(item.id));

  // 組織貢献項目を取得
  const contribItemIds = [
    ...template.evaluationStructure.contributionEvaluation.facilityContribution.items,
    ...template.evaluationStructure.contributionEvaluation.corporateContribution.items
  ];
  const contributionItems = contributionItems.filter(item => contribItemIds.includes(item.id));

  return {
    template,
    preview: {
      totalPoints: 100,
      technicalItems,
      contributionItems,
      estimatedEvaluationTime: Math.ceil((technicalItems.length + contributionItems.length) * 3.5) // 項目あたり3.5分
    }
  };
}