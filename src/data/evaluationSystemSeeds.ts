/**
 * 評価制度マスターデータの初期値（シードデータ）
 *
 * このデータはDB構築後に初期データとして投入され、
 * 人事部が開発者なしでも制度変更できる起点となります。
 */

import {
  EvaluationSystemMaster,
  ScoreComponent,
  RelativeEvaluationRule,
  GradeConversionRule,
  MatrixDefinition,
  FinalGradeDefinition,
  ContributionItemMaster,
  PeriodScoreAllocation,
  DepartmentCustomPermission,
} from '@/types/masterData';

// 現行評価制度（2024年度版）
export const currentEvaluationSystem: EvaluationSystemMaster = {
  id: 'SYS_2024_001',
  systemName: '2024年度評価制度',
  version: '1.0.0',
  effectiveFrom: '2024-04-01',
  effectiveTo: undefined, // 現行制度のため終了日なし
  totalScore: 100,
  isActive: true,
  scoreComponents: [
    {
      id: 'COMP_001',
      categoryId: 'CAT_TECH',
      categoryName: '技術評価',
      score: 50,
      evaluationType: 'absolute',
      subComponents: [
        {
          id: 'SUB_001',
          name: '専門技術力',
          score: 25,
          evaluationPeriod: '通年',
        },
        {
          id: 'SUB_002',
          name: '業務遂行力',
          score: 25,
          evaluationPeriod: '通年',
        },
      ],
    },
    {
      id: 'COMP_002',
      categoryId: 'CAT_CONTRIB',
      categoryName: '組織貢献度',
      score: 50,
      evaluationType: 'relative',
      subComponents: [
        {
          id: 'SUB_003',
          name: '施設貢献',
          score: 25,
          evaluationPeriod: '半期',
        },
        {
          id: 'SUB_004',
          name: '法人貢献',
          score: 25,
          evaluationPeriod: '半期',
        },
      ],
    },
  ],
  relativeEvaluationRules: [
    {
      id: 'RULE_001',
      evaluationUnit: 'facility',
      comparisonScope: '同一施設・同一職種（標準）',
      percentileRanges: [
        { grade: 'S', minPercentile: 90, maxPercentile: 100, score: 5 },
        { grade: 'A', minPercentile: 70, maxPercentile: 89, score: 4 },
        { grade: 'B', minPercentile: 30, maxPercentile: 69, score: 3 },
        { grade: 'C', minPercentile: 10, maxPercentile: 29, score: 2 },
        { grade: 'D', minPercentile: 0, maxPercentile: 9, score: 1 },
      ],
    },
    {
      id: 'RULE_002',
      evaluationUnit: 'corporate',
      comparisonScope: '全法人・同一職種（標準）',
      percentileRanges: [
        { grade: 'S', minPercentile: 95, maxPercentile: 100, score: 5 },
        { grade: 'A', minPercentile: 80, maxPercentile: 94, score: 4 },
        { grade: 'B', minPercentile: 35, maxPercentile: 79, score: 3 },
        { grade: 'C', minPercentile: 15, maxPercentile: 34, score: 2 },
        { grade: 'D', minPercentile: 0, maxPercentile: 14, score: 1 },
      ],
    },
    {
      id: 'RULE_003',
      evaluationUnit: 'facility',
      comparisonScope: '同一施設・看護部専用',
      percentileRanges: [
        { grade: 'S', minPercentile: 92, maxPercentile: 100, score: 5 },
        { grade: 'A', minPercentile: 75, maxPercentile: 91, score: 4 },
        { grade: 'B', minPercentile: 35, maxPercentile: 74, score: 3 },
        { grade: 'C', minPercentile: 15, maxPercentile: 34, score: 2 },
        { grade: 'D', minPercentile: 0, maxPercentile: 14, score: 1 },
      ],
    },
    {
      id: 'RULE_004',
      evaluationUnit: 'facility',
      comparisonScope: '同一施設・リハビリ科専用',
      percentileRanges: [
        { grade: 'S', minPercentile: 88, maxPercentile: 100, score: 5 },
        { grade: 'A', minPercentile: 65, maxPercentile: 87, score: 4 },
        { grade: 'B', minPercentile: 25, maxPercentile: 64, score: 3 },
        { grade: 'C', minPercentile: 8, maxPercentile: 24, score: 2 },
        { grade: 'D', minPercentile: 0, maxPercentile: 7, score: 1 },
      ],
    },
    {
      id: 'RULE_005',
      evaluationUnit: 'corporate',
      comparisonScope: '全法人・事務職専用',
      percentileRanges: [
        { grade: 'S', minPercentile: 93, maxPercentile: 100, score: 5 },
        { grade: 'A', minPercentile: 72, maxPercentile: 92, score: 4 },
        { grade: 'B', minPercentile: 28, maxPercentile: 71, score: 3 },
        { grade: 'C', minPercentile: 12, maxPercentile: 27, score: 2 },
        { grade: 'D', minPercentile: 0, maxPercentile: 11, score: 1 },
      ],
    },
  ],
  gradeConversionRules: [
    {
      id: 'CONV_001',
      ruleName: '施設内相対評価（標準）',
      gradeDefinitions: [
        {
          grade: 'S',
          minPercentile: 90,
          maxPercentile: 100,
          description: '極めて優秀（上位10%）'
        },
        {
          grade: 'A',
          minPercentile: 70,
          maxPercentile: 89,
          description: '優秀（上位11-30%）'
        },
        {
          grade: 'B',
          minPercentile: 30,
          maxPercentile: 69,
          description: '標準（中位40%）'
        },
        {
          grade: 'C',
          minPercentile: 10,
          maxPercentile: 29,
          description: '要改善（下位11-30%）'
        },
        {
          grade: 'D',
          minPercentile: 0,
          maxPercentile: 9,
          description: '大幅改善必要（下位10%）'
        },
      ],
    },
    {
      id: 'CONV_002',
      ruleName: '法人内相対評価（標準）',
      gradeDefinitions: [
        {
          grade: 'S',
          minPercentile: 95,
          maxPercentile: 100,
          description: '法人内最優秀（上位5%）'
        },
        {
          grade: 'A',
          minPercentile: 80,
          maxPercentile: 94,
          description: '法人内優秀（上位6-20%）'
        },
        {
          grade: 'B',
          minPercentile: 35,
          maxPercentile: 79,
          description: '法人内標準（中位45%）'
        },
        {
          grade: 'C',
          minPercentile: 15,
          maxPercentile: 34,
          description: '法人内要改善（下位21-35%）'
        },
        {
          grade: 'D',
          minPercentile: 0,
          maxPercentile: 14,
          description: '法人内要指導（下位15%）'
        },
      ],
    },
    {
      id: 'CONV_003',
      ruleName: '医師職専用評価',
      gradeDefinitions: [
        {
          grade: 'S',
          minPercentile: 85,
          maxPercentile: 100,
          description: '指導医レベル（上位15%）'
        },
        {
          grade: 'A',
          minPercentile: 60,
          maxPercentile: 84,
          description: '専門医レベル（上位16-40%）'
        },
        {
          grade: 'B',
          minPercentile: 30,
          maxPercentile: 59,
          description: '標準医師（中位30%）'
        },
        {
          grade: 'C',
          minPercentile: 10,
          maxPercentile: 29,
          description: '研修強化必要（下位21-30%）'
        },
        {
          grade: 'D',
          minPercentile: 0,
          maxPercentile: 9,
          description: '指導必須（下位10%）'
        },
      ],
    },
    {
      id: 'CONV_004',
      ruleName: '新入職員用評価（入職3年未満）',
      gradeDefinitions: [
        {
          grade: 'S',
          minPercentile: 80,
          maxPercentile: 100,
          description: '期待を大きく上回る（上位20%）'
        },
        {
          grade: 'A',
          minPercentile: 50,
          maxPercentile: 79,
          description: '期待を上回る（上位21-50%）'
        },
        {
          grade: 'B',
          minPercentile: 20,
          maxPercentile: 49,
          description: '期待通り（中位30%）'
        },
        {
          grade: 'C',
          minPercentile: 5,
          maxPercentile: 19,
          description: '成長途上（下位16-20%）'
        },
        {
          grade: 'D',
          minPercentile: 0,
          maxPercentile: 4,
          description: '要フォロー（下位5%）'
        },
      ],
    },
    {
      id: 'CONV_005',
      ruleName: '管理職用評価',
      gradeDefinitions: [
        {
          grade: 'S',
          minPercentile: 90,
          maxPercentile: 100,
          description: '経営層候補（上位10%）'
        },
        {
          grade: 'A',
          minPercentile: 70,
          maxPercentile: 89,
          description: '優秀管理職（上位11-30%）'
        },
        {
          grade: 'B',
          minPercentile: 40,
          maxPercentile: 69,
          description: '標準管理職（中位30%）'
        },
        {
          grade: 'C',
          minPercentile: 20,
          maxPercentile: 39,
          description: '改善必要（下位21-40%）'
        },
        {
          grade: 'D',
          minPercentile: 0,
          maxPercentile: 19,
          description: '役職見直し検討（下位20%）'
        },
      ],
    },
  ],
  matrixDefinition: {
    id: 'MATRIX_001',
    dimensions: 2,
    axes: [
      { axisName: '施設内評価', evaluationType: 'facility_relative' },
      { axisName: '法人内評価', evaluationType: 'corporate_relative' },
    ],
    conversionTable: [
      // S×S → 7
      { inputs: { facility: 'S', corporate: 'S' }, output: '7', priority: 1 },
      // S×A, A×S → 6
      { inputs: { facility: 'S', corporate: 'A' }, output: '6', priority: 2 },
      { inputs: { facility: 'A', corporate: 'S' }, output: '6', priority: 2 },
      // S×B, A×A, B×S → 5
      { inputs: { facility: 'S', corporate: 'B' }, output: '5', priority: 3 },
      { inputs: { facility: 'A', corporate: 'A' }, output: '5', priority: 3 },
      { inputs: { facility: 'B', corporate: 'S' }, output: '5', priority: 3 },
      // S×C, A×B, B×A, C×S → 4
      { inputs: { facility: 'S', corporate: 'C' }, output: '4', priority: 4 },
      { inputs: { facility: 'A', corporate: 'B' }, output: '4', priority: 4 },
      { inputs: { facility: 'B', corporate: 'A' }, output: '4', priority: 4 },
      { inputs: { facility: 'C', corporate: 'S' }, output: '4', priority: 4 },
      // B×B, その他の組み合わせ → 3
      { inputs: { facility: 'B', corporate: 'B' }, output: '3', priority: 5 },
      { inputs: { facility: 'A', corporate: 'C' }, output: '3', priority: 5 },
      { inputs: { facility: 'C', corporate: 'A' }, output: '3', priority: 5 },
      // C×C, B×D, D×B → 2
      { inputs: { facility: 'C', corporate: 'C' }, output: '2', priority: 6 },
      { inputs: { facility: 'B', corporate: 'D' }, output: '2', priority: 6 },
      { inputs: { facility: 'D', corporate: 'B' }, output: '2', priority: 6 },
      // D×D → 1
      { inputs: { facility: 'D', corporate: 'D' }, output: '1', priority: 7 },
      // その他のD評価を含む組み合わせ
      { inputs: { facility: 'S', corporate: 'D' }, output: '3', priority: 5 },
      { inputs: { facility: 'D', corporate: 'S' }, output: '3', priority: 5 },
      { inputs: { facility: 'A', corporate: 'D' }, output: '2', priority: 6 },
      { inputs: { facility: 'D', corporate: 'A' }, output: '2', priority: 6 },
      { inputs: { facility: 'C', corporate: 'D' }, output: '2', priority: 6 },
      { inputs: { facility: 'D', corporate: 'C' }, output: '2', priority: 6 },
      { inputs: { facility: 'B', corporate: 'C' }, output: '3', priority: 5 },
      { inputs: { facility: 'C', corporate: 'B' }, output: '3', priority: 5 },
    ],
  },
  finalGradeDefinition: {
    id: 'FINAL_001',
    gradeCount: 7,
    grades: [
      { grade: '7', rank: 1, label: 'S+', color: '#8b5cf6', description: '最優秀' },
      { grade: '6', rank: 2, label: 'S', color: '#7c3aed', description: '極めて優秀' },
      { grade: '5', rank: 3, label: 'A', color: '#3b82f6', description: '優秀' },
      { grade: '4', rank: 4, label: 'B+', color: '#10b981', description: '良好' },
      { grade: '3', rank: 5, label: 'B', color: '#fbbf24', description: '標準' },
      { grade: '2', rank: 6, label: 'C', color: '#f97316', description: '要改善' },
      { grade: '1', rank: 7, label: 'D', color: '#ef4444', description: '大幅改善必要' },
    ],
  },
};

// 組織貢献度項目マスター
export const contributionItems: ContributionItemMaster[] = [
  {
    id: 'CONTRIB_001',
    itemName: '委員会活動',
    category: 'facility',
    period: '夏季',
    baseScore: 5,
    evaluationElements: [
      { elementName: '委員長', score: 5, description: '委員会の運営責任者' },
      { elementName: '副委員長', score: 3, description: '委員長の補佐' },
      { elementName: '委員', score: 1, description: '委員会メンバー' },
    ],
    applicablePositions: ['全職種'],
  },
  {
    id: 'CONTRIB_002',
    itemName: '教育活動',
    category: 'facility',
    period: '夏季',
    baseScore: 5,
    evaluationElements: [
      { elementName: '新人教育担当', score: 5, description: '新入職員の教育担当' },
      { elementName: '実習指導', score: 3, description: '学生実習の指導' },
      { elementName: '勉強会講師', score: 2, description: '院内勉強会の講師' },
    ],
  },
  {
    id: 'CONTRIB_003',
    itemName: '研究発表',
    category: 'corporate',
    period: '冬季',
    baseScore: 10,
    evaluationElements: [
      { elementName: '学会発表', score: 10, description: '全国学会での発表' },
      { elementName: '論文執筆', score: 8, description: '査読付き論文の執筆' },
      { elementName: '院内研究', score: 3, description: '院内研究発表' },
    ],
  },
  {
    id: 'CONTRIB_004',
    itemName: '業務改善',
    category: 'facility',
    period: '冬季',
    baseScore: 5,
    evaluationElements: [
      { elementName: '改善提案採用', score: 5, description: '業務改善提案が採用' },
      { elementName: '効率化実施', score: 3, description: '業務効率化の実施' },
    ],
  },
];

// 期別配点マスター
export const periodAllocations: PeriodScoreAllocation[] = [
  {
    id: 'PERIOD_001',
    systemId: 'SYS_2024_001',
    allocationPattern: '標準均等型',
    periods: [
      {
        periodName: '夏季',
        startMonth: 4,
        endMonth: 9,
        score: 25,
        facilityScore: 12.5,
        corporateScore: 12.5,
      },
      {
        periodName: '冬季',
        startMonth: 10,
        endMonth: 3,
        score: 25,
        facilityScore: 12.5,
        corporateScore: 12.5,
      },
    ],
  },
];

// 部署別カスタマイズ権限の初期設定
export const departmentPermissions: DepartmentCustomPermission[] = [
  {
    id: 'PERM_001',
    departmentId: 'DEPT_REHAB_001',
    departmentName: 'リハビリテーション科',
    facilityName: '小原病院',
    customizableItems: {
      scoreAdjustment: {
        allowed: true,
        range: 10,
        requiresApproval: false,
      },
      itemAddition: {
        allowed: true,
        maxItems: 3,
        requiresApproval: true,
        allowedCategories: ['専門技術', '機能改善'],
      },
      thresholdChange: {
        allowed: false,
        requiresApproval: true,
      },
      gradeConversion: {
        allowed: false,
        requiresApproval: true,
      },
      matrixCustomization: {
        allowed: false,
        requiresApproval: true,
      },
    },
    managers: {
      primary: 'リハビリテーション科長',
      secondary: '副リハビリテーション科長',
    },
    status: 'active',
    validFrom: '2024-04-01',
    lastModified: '2024-04-01',
    modifiedBy: '人事部',
  },
  {
    id: 'PERM_002',
    departmentId: 'DEPT_NURSE_001',
    departmentName: '看護部',
    facilityName: '小原病院',
    customizableItems: {
      scoreAdjustment: {
        allowed: true,
        range: 5,
        requiresApproval: true,
      },
      itemAddition: {
        allowed: true,
        maxItems: 2,
        requiresApproval: true,
        allowedCategories: ['看護技術', '患者ケア'],
      },
      thresholdChange: {
        allowed: false,
        requiresApproval: true,
      },
      gradeConversion: {
        allowed: false,
        requiresApproval: true,
      },
      matrixCustomization: {
        allowed: false,
        requiresApproval: true,
      },
    },
    managers: {
      primary: '看護部長',
      secondary: '副看護部長',
    },
    status: 'active',
    validFrom: '2024-04-01',
    lastModified: '2024-04-01',
    modifiedBy: '人事部',
  },
  // その他の部署はカスタマイズ権限なし（デフォルト）
];

// すべてのシードデータをエクスポート
export const evaluationSystemSeeds = {
  evaluationSystem: currentEvaluationSystem,
  contributionItems,
  periodAllocations,
  departmentPermissions,
};

// DB投入用のヘルパー関数
export const initializeEvaluationMasterData = async () => {
  console.log('評価制度マスターデータを初期化中...');

  // 実際のDB接続時はここでAPIを呼び出す
  // await api.evaluationSystem.create(currentEvaluationSystem);
  // await api.contributionItems.createMany(contributionItems);
  // await api.periodAllocations.createMany(periodAllocations);
  // await api.departmentPermissions.createMany(departmentPermissions);

  console.log('評価制度マスターデータの初期化が完了しました');
  console.log('- 評価制度: 1件');
  console.log('- 貢献度項目: ' + contributionItems.length + '件');
  console.log('- 期別配点: ' + periodAllocations.length + '件');
  console.log('- 部署別権限: ' + departmentPermissions.length + '件');
};