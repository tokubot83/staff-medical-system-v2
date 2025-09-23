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
      // ===== 最終評価 7 (S+) : 最優秀層 =====
      // 両方でS評価を取得した最上位者のみ
      {
        inputs: { facility: 'S', corporate: 'S' },
        output: '7',
        priority: 1,
        description: '施設・法人両方でトップ評価の最優秀職員'
      },

      // ===== 最終評価 6 (S) : 極めて優秀層 =====
      // 片方でS評価、もう片方でA評価
      {
        inputs: { facility: 'S', corporate: 'A' },
        output: '6',
        priority: 2,
        description: '施設内トップ、法人内でも上位の優秀職員'
      },
      {
        inputs: { facility: 'A', corporate: 'S' },
        output: '6',
        priority: 2,
        description: '法人内トップ、施設内でも上位の優秀職員'
      },

      // ===== 最終評価 5 (A) : 優秀層 =====
      // 高評価の組み合わせ
      {
        inputs: { facility: 'S', corporate: 'B' },
        output: '5',
        priority: 3,
        description: '施設内トップだが法人内では標準'
      },
      {
        inputs: { facility: 'A', corporate: 'A' },
        output: '5',
        priority: 3,
        description: '施設・法人両方で上位評価'
      },
      {
        inputs: { facility: 'B', corporate: 'S' },
        output: '5',
        priority: 3,
        description: '法人内トップだが施設内では標準'
      },

      // ===== 最終評価 4 (B+) : 良好層 =====
      // バランスの取れた中上位評価
      {
        inputs: { facility: 'S', corporate: 'C' },
        output: '4',
        priority: 4,
        description: '施設内トップだが法人内では要改善'
      },
      {
        inputs: { facility: 'A', corporate: 'B' },
        output: '4',
        priority: 4,
        description: '施設内上位、法人内標準'
      },
      {
        inputs: { facility: 'B', corporate: 'A' },
        output: '4',
        priority: 4,
        description: '法人内上位、施設内標準'
      },
      {
        inputs: { facility: 'C', corporate: 'S' },
        output: '4',
        priority: 4,
        description: '法人内トップだが施設内では要改善'
      },

      // ===== 最終評価 3 (B) : 標準層 =====
      // 中位評価の組み合わせ
      {
        inputs: { facility: 'B', corporate: 'B' },
        output: '3',
        priority: 5,
        description: '施設・法人両方で標準的な評価'
      },
      {
        inputs: { facility: 'A', corporate: 'C' },
        output: '3',
        priority: 5,
        description: '施設内上位だが法人内では要改善'
      },
      {
        inputs: { facility: 'C', corporate: 'A' },
        output: '3',
        priority: 5,
        description: '法人内上位だが施設内では要改善'
      },
      {
        inputs: { facility: 'B', corporate: 'C' },
        output: '3',
        priority: 5,
        description: '施設内標準、法人内要改善'
      },
      {
        inputs: { facility: 'C', corporate: 'B' },
        output: '3',
        priority: 5,
        description: '法人内標準、施設内要改善'
      },
      {
        inputs: { facility: 'S', corporate: 'D' },
        output: '3',
        priority: 5,
        description: '施設内トップだが法人内では大幅改善必要（特別考慮）'
      },
      {
        inputs: { facility: 'D', corporate: 'S' },
        output: '3',
        priority: 5,
        description: '法人内トップだが施設内では大幅改善必要（特別考慮）'
      },

      // ===== 最終評価 2 (C) : 要改善層 =====
      // 低評価が含まれる組み合わせ
      {
        inputs: { facility: 'C', corporate: 'C' },
        output: '2',
        priority: 6,
        description: '施設・法人両方で要改善'
      },
      {
        inputs: { facility: 'B', corporate: 'D' },
        output: '2',
        priority: 6,
        description: '施設内標準だが法人内では大幅改善必要'
      },
      {
        inputs: { facility: 'D', corporate: 'B' },
        output: '2',
        priority: 6,
        description: '法人内標準だが施設内では大幅改善必要'
      },
      {
        inputs: { facility: 'A', corporate: 'D' },
        output: '2',
        priority: 6,
        description: '施設内上位だが法人内では大幅改善必要'
      },
      {
        inputs: { facility: 'D', corporate: 'A' },
        output: '2',
        priority: 6,
        description: '法人内上位だが施設内では大幅改善必要'
      },
      {
        inputs: { facility: 'C', corporate: 'D' },
        output: '2',
        priority: 6,
        description: '施設内要改善、法人内大幅改善必要'
      },
      {
        inputs: { facility: 'D', corporate: 'C' },
        output: '2',
        priority: 6,
        description: '法人内要改善、施設内大幅改善必要'
      },

      // ===== 最終評価 1 (D) : 大幅改善必要層 =====
      // 両方でD評価の最下位者
      {
        inputs: { facility: 'D', corporate: 'D' },
        output: '1',
        priority: 7,
        description: '施設・法人両方で最下位評価、集中的な改善支援が必要'
      },
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
  // ===== 施設貢献（夏季評価） =====
  {
    id: 'CONTRIB_001',
    itemName: '委員会活動',
    category: 'facility',
    period: '夏季',
    baseScore: 5,
    evaluationElements: [
      { elementName: '委員長', score: 5, description: '委員会の運営責任者として活動' },
      { elementName: '副委員長', score: 3, description: '委員長の補佐として実務を推進' },
      { elementName: '委員', score: 1, description: '委員会メンバーとして参加' },
    ],
    applicablePositions: ['全職種'],
    applicableDepartments: ['全部署'],
  },
  {
    id: 'CONTRIB_002',
    itemName: '教育活動',
    category: 'facility',
    period: '夏季',
    baseScore: 5,
    evaluationElements: [
      { elementName: '新人教育担当', score: 5, description: '新入職員の主担当として6ヶ月以上指導' },
      { elementName: '実習指導', score: 3, description: '学生実習の指導（1クール以上）' },
      { elementName: '勉強会講師', score: 2, description: '院内勉強会の講師（30分以上）' },
      { elementName: 'OJT指導', score: 1, description: '日常的な後輩指導' },
    ],
    applicablePositions: ['全職種'],
  },
  {
    id: 'CONTRIB_003',
    itemName: '安全管理活動',
    category: 'facility',
    period: '夏季',
    baseScore: 4,
    evaluationElements: [
      { elementName: '医療安全推進者', score: 4, description: '医療安全の推進リーダー' },
      { elementName: 'インシデント分析', score: 3, description: 'インシデント分析と改善提案' },
      { elementName: '安全ラウンド参加', score: 2, description: '定期的な安全ラウンドへの参加' },
      { elementName: 'ヒヤリハット報告', score: 1, description: '積極的なヒヤリハット報告（5件以上）' },
    ],
  },
  {
    id: 'CONTRIB_004',
    itemName: '地域連携活動',
    category: 'facility',
    period: '夏季',
    baseScore: 3,
    evaluationElements: [
      { elementName: '地域講演', score: 3, description: '地域での健康講座等の講師' },
      { elementName: '連携会議出席', score: 2, description: '地域連携会議への定期出席' },
      { elementName: '見学対応', score: 1, description: '他施設からの見学対応' },
    ],
  },

  // ===== 施設貢献（冬季評価） =====
  {
    id: 'CONTRIB_005',
    itemName: '業務改善',
    category: 'facility',
    period: '冬季',
    baseScore: 5,
    evaluationElements: [
      { elementName: '改善提案採用', score: 5, description: '業務改善提案が採用され効果確認' },
      { elementName: '効率化実施', score: 3, description: '部署内業務効率化の実施' },
      { elementName: 'マニュアル作成', score: 2, description: '業務マニュアルの新規作成・改訂' },
      { elementName: '改善提案', score: 1, description: '改善提案の提出（採用前）' },
    ],
  },
  {
    id: 'CONTRIB_006',
    itemName: '患者満足度向上',
    category: 'facility',
    period: '冬季',
    baseScore: 4,
    evaluationElements: [
      { elementName: '表彰・感謝状', score: 4, description: '患者からの表彰・感謝状受領' },
      { elementName: '満足度調査高評価', score: 3, description: '満足度調査で高評価（上位20%）' },
      { elementName: 'クレーム対応', score: 2, description: '困難なクレームの適切な対応' },
      { elementName: 'サービス改善', score: 1, description: '患者サービスの改善活動' },
    ],
  },
  {
    id: 'CONTRIB_007',
    itemName: '経営貢献',
    category: 'facility',
    period: '冬季',
    baseScore: 4,
    evaluationElements: [
      { elementName: '新規事業立上', score: 4, description: '新規事業・サービスの立ち上げ' },
      { elementName: '収益改善', score: 3, description: '具体的な収益改善（100万円以上）' },
      { elementName: 'コスト削減', score: 2, description: 'コスト削減の実現（50万円以上）' },
      { elementName: '稼働率向上', score: 1, description: '病床・検査等の稼働率向上' },
    ],
  },

  // ===== 法人貢献（夏季評価） =====
  {
    id: 'CONTRIB_008',
    itemName: '法人プロジェクト',
    category: 'corporate',
    period: '夏季',
    baseScore: 8,
    evaluationElements: [
      { elementName: 'プロジェクトリーダー', score: 8, description: '法人横断プロジェクトのリーダー' },
      { elementName: 'プロジェクトサブリーダー', score: 5, description: 'サブリーダーとして推進' },
      { elementName: 'プロジェクトメンバー', score: 3, description: 'メンバーとして積極的参加' },
      { elementName: 'タスク担当', score: 1, description: '特定タスクの責任者' },
    ],
  },
  {
    id: 'CONTRIB_009',
    itemName: '法人間連携',
    category: 'corporate',
    period: '夏季',
    baseScore: 5,
    evaluationElements: [
      { elementName: '他施設支援', score: 5, description: '他施設への応援・技術支援（5日以上）' },
      { elementName: '法人研修講師', score: 3, description: '法人全体研修の講師' },
      { elementName: '標準化推進', score: 2, description: '法人内業務標準化の推進' },
      { elementName: '情報共有', score: 1, description: 'ベストプラクティスの共有' },
    ],
  },

  // ===== 法人貢献（冬季評価） =====
  {
    id: 'CONTRIB_010',
    itemName: '研究・学術活動',
    category: 'corporate',
    period: '冬季',
    baseScore: 10,
    evaluationElements: [
      { elementName: '国際学会発表', score: 10, description: '国際学会での発表・座長' },
      { elementName: '全国学会発表', score: 8, description: '全国学会での発表' },
      { elementName: '論文執筆（査読付）', score: 7, description: '査読付き論文の執筆（筆頭・共著）' },
      { elementName: '地方学会発表', score: 5, description: '地方学会での発表' },
      { elementName: '院内研究発表', score: 3, description: '法人内研究発表会での発表' },
      { elementName: '研究参加', score: 1, description: '研究プロジェクトへの参加' },
    ],
  },
  {
    id: 'CONTRIB_011',
    itemName: '対外活動',
    category: 'corporate',
    period: '冬季',
    baseScore: 6,
    evaluationElements: [
      { elementName: '学会役員', score: 6, description: '学会・協会の役員として活動' },
      { elementName: '外部委員', score: 4, description: '行政・団体の委員として活動' },
      { elementName: 'メディア対応', score: 3, description: 'TV・新聞等のメディア対応' },
      { elementName: '講演・セミナー', score: 2, description: '外部での講演・セミナー講師' },
    ],
  },
  {
    id: 'CONTRIB_012',
    itemName: '資格取得・スキル向上',
    category: 'corporate',
    period: '冬季',
    baseScore: 5,
    evaluationElements: [
      { elementName: '高度資格取得', score: 5, description: '専門医・認定看護師等の高度資格取得' },
      { elementName: '専門資格取得', score: 3, description: '業務関連の専門資格取得' },
      { elementName: '研修修了', score: 2, description: '法人指定研修の修了（40時間以上）' },
      { elementName: '自己研鑽', score: 1, description: '自主的な研修参加（20時間以上）' },
    ],
  },
];

// 期別配点マスター
export const periodAllocations: PeriodScoreAllocation[] = [
  {
    id: 'PERIOD_001',
    systemId: 'SYS_2024_001',
    allocationPattern: '標準均等型（現行）',
    periods: [
      {
        periodName: '上半期（夏季評価）',
        startMonth: 4,
        endMonth: 9,
        score: 25,
        facilityScore: 12.5,
        corporateScore: 12.5,
      },
      {
        periodName: '下半期（冬季評価）',
        startMonth: 10,
        endMonth: 3,
        score: 25,
        facilityScore: 12.5,
        corporateScore: 12.5,
      },
    ],
  },
  {
    id: 'PERIOD_002',
    systemId: 'SYS_2024_001',
    allocationPattern: '年度末重視型',
    periods: [
      {
        periodName: '上半期（夏季評価）',
        startMonth: 4,
        endMonth: 9,
        score: 20,
        facilityScore: 10,
        corporateScore: 10,
      },
      {
        periodName: '下半期（冬季評価）',
        startMonth: 10,
        endMonth: 3,
        score: 30,
        facilityScore: 15,
        corporateScore: 15,
      },
    ],
  },
  {
    id: 'PERIOD_003',
    systemId: 'SYS_2024_001',
    allocationPattern: '四半期評価型',
    periods: [
      {
        periodName: '第1四半期',
        startMonth: 4,
        endMonth: 6,
        score: 10,
        facilityScore: 5,
        corporateScore: 5,
      },
      {
        periodName: '第2四半期',
        startMonth: 7,
        endMonth: 9,
        score: 15,
        facilityScore: 7.5,
        corporateScore: 7.5,
      },
      {
        periodName: '第3四半期',
        startMonth: 10,
        endMonth: 12,
        score: 10,
        facilityScore: 5,
        corporateScore: 5,
      },
      {
        periodName: '第4四半期',
        startMonth: 1,
        endMonth: 3,
        score: 15,
        facilityScore: 7.5,
        corporateScore: 7.5,
      },
    ],
  },
  {
    id: 'PERIOD_004',
    systemId: 'SYS_2024_001',
    allocationPattern: '施設重視型',
    periods: [
      {
        periodName: '上半期（夏季評価）',
        startMonth: 4,
        endMonth: 9,
        score: 25,
        facilityScore: 17.5,  // 施設70%
        corporateScore: 7.5,   // 法人30%
      },
      {
        periodName: '下半期（冬季評価）',
        startMonth: 10,
        endMonth: 3,
        score: 25,
        facilityScore: 17.5,
        corporateScore: 7.5,
      },
    ],
  },
  {
    id: 'PERIOD_005',
    systemId: 'SYS_2024_001',
    allocationPattern: '法人重視型',
    periods: [
      {
        periodName: '上半期（夏季評価）',
        startMonth: 4,
        endMonth: 9,
        score: 25,
        facilityScore: 7.5,    // 施設30%
        corporateScore: 17.5,  // 法人70%
      },
      {
        periodName: '下半期（冬季評価）',
        startMonth: 10,
        endMonth: 3,
        score: 25,
        facilityScore: 7.5,
        corporateScore: 17.5,
      },
    ],
  },
  {
    id: 'PERIOD_006',
    systemId: 'SYS_2024_001',
    allocationPattern: '通年一括評価型',
    periods: [
      {
        periodName: '通年評価',
        startMonth: 4,
        endMonth: 3,
        score: 50,
        facilityScore: 25,
        corporateScore: 25,
      },
    ],
  },
  {
    id: 'PERIOD_007',
    systemId: 'SYS_2024_001',
    allocationPattern: '医療職特化型（患者数変動対応）',
    periods: [
      {
        periodName: '繁忙期（4-7月）',
        startMonth: 4,
        endMonth: 7,
        score: 20,
        facilityScore: 12,
        corporateScore: 8,
      },
      {
        periodName: '通常期（8-11月）',
        startMonth: 8,
        endMonth: 11,
        score: 15,
        facilityScore: 7.5,
        corporateScore: 7.5,
      },
      {
        periodName: '年度末期（12-3月）',
        startMonth: 12,
        endMonth: 3,
        score: 15,
        facilityScore: 5.5,
        corporateScore: 9.5,
      },
    ],
  },
  {
    id: 'PERIOD_008',
    systemId: 'SYS_2024_001',
    allocationPattern: '新人育成重視型（入職1年目用）',
    periods: [
      {
        periodName: '研修期（4-6月）',
        startMonth: 4,
        endMonth: 6,
        score: 5,  // 研修期間は低配点
        facilityScore: 3,
        corporateScore: 2,
      },
      {
        periodName: '成長期（7-9月）',
        startMonth: 7,
        endMonth: 9,
        score: 15,
        facilityScore: 8,
        corporateScore: 7,
      },
      {
        periodName: '実践期（10-12月）',
        startMonth: 10,
        endMonth: 12,
        score: 15,
        facilityScore: 7.5,
        corporateScore: 7.5,
      },
      {
        periodName: '評価期（1-3月）',
        startMonth: 1,
        endMonth: 3,
        score: 15,
        facilityScore: 6.5,
        corporateScore: 8.5,
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