// 2軸評価パターン分析ユーティリティ

import { 
  EvaluationGrade, 
  FinalEvaluationGrade, 
  EvaluationPattern,
  TwoAxisEvaluation,
  TransferRecommendation,
  EvaluationPatternDefinition,
  JobCategory
} from '@/types/hr-strategy';

// 評価パターンの定義
export const evaluationPatternDefinitions: EvaluationPatternDefinition[] = [
  {
    pattern: 'local-star',
    name: '病院のスター型',
    description: '施設内でリーダーシップを発揮し、チーム全体の業績向上に貢献',
    facilityRange: ['S'],
    corporateRange: ['B', 'C'],
    characteristics: [
      '施設内でのリーダーシップを発揮',
      'チーム全体の業績向上に貢献',
      '法人内異動・昇格候補として明確に位置付けられる'
    ],
    recommendationType: 'promotion',
    typicalRecommendations: [
      '法人レベルでの活躍機会を検討',
      '他施設との交流機会の提供',
      '管理職候補としての育成プログラム参加'
    ]
  },
  {
    pattern: 'corporate-powerhouse',
    name: '大規模病院の実力者型',
    description: '専門スキルが法人内でもトップレベル',
    facilityRange: ['B'],
    corporateRange: ['A'],
    characteristics: [
      '専門スキルが法人内でもトップレベル',
      '大規模施設では目立たなかったが法人横断的な活動が正当に評価',
      '施設を超えた貢献により、法人のスペシャリストとしての地位確立'
    ],
    recommendationType: 'promotion',
    typicalRecommendations: [
      '法人横断的なプロジェクトリーダー',
      '専門研修の講師役',
      '新人教育プログラムの中核メンバー'
    ]
  },
  {
    pattern: 'corporate-ace',
    name: '法人エース型',
    description: '法人全体でトップクラスの実力者',
    facilityRange: ['A', 'S'],
    corporateRange: ['S'],
    characteristics: [
      '法人全体でトップクラスの実績',
      '複数施設での成功経験',
      '次世代経営幹部候補'
    ],
    recommendationType: 'promotion',
    typicalRecommendations: [
      '法人の顔として外部研修講師',
      '新規事業の立ち上げリーダー',
      '経営層への昇進検討'
    ]
  },
  {
    pattern: 'balanced-excellence',
    name: 'バランス優秀型',
    description: 'どの環境でも安定して高パフォーマンス',
    facilityRange: ['A'],
    corporateRange: ['A'],
    characteristics: [
      '安定した高パフォーマンス',
      '環境適応力が高い',
      '他職員の模範となる存在'
    ],
    recommendationType: 'transfer',
    typicalRecommendations: [
      '困難な部署の立て直し要員',
      '新規開設施設の中核スタッフ',
      '次期管理職候補としての経験積み'
    ]
  },
  {
    pattern: 'hidden-talent',
    name: '隠れた逸材型',
    description: '小規模施設では圧倒的だが、法人基準では埋もれている',
    facilityRange: ['S'],
    corporateRange: ['D'],
    characteristics: [
      '小規模施設での圧倒的な存在感',
      '法人全体では認知度が低い',
      'より大きな舞台での活躍可能性'
    ],
    recommendationType: 'transfer',
    typicalRecommendations: [
      '大規模施設での実力試しの機会',
      '法人横断研修への参加',
      'キャリアアップ支援プログラムの対象'
    ]
  },
  {
    pattern: 'growth-potential',
    name: '成長株型',
    description: '平均的だが安定している',
    facilityRange: ['B'],
    corporateRange: ['B'],
    characteristics: [
      '安定したパフォーマンス',
      '着実な成長が見込める',
      '専門性の深化が必要'
    ],
    recommendationType: 'training',
    typicalRecommendations: [
      '専門研修への積極的参加',
      'メンター制度の活用',
      '中長期的なキャリアプラン策定'
    ]
  },
  {
    pattern: 'specialist',
    name: '専門特化型',
    description: '特定分野では法人トップクラス',
    facilityRange: ['C'],
    corporateRange: ['A'],
    characteristics: [
      '特定分野での卓越した専門性',
      '施設内では評価されにくい',
      '法人レベルでの価値が高い'
    ],
    recommendationType: 'transfer',
    typicalRecommendations: [
      '専門性を活かせる部署への異動',
      '法人横断プロジェクトへの参加',
      '専門分野の教育担当'
    ]
  },
  {
    pattern: 'environment-mismatch',
    name: '環境ミスマッチ型',
    description: '能力はあるが現在の環境に適応できていない',
    facilityRange: ['D'],
    corporateRange: ['B', 'C'],
    characteristics: [
      'チーム内コミュニケーション不足',
      '集団ケアでの協調性に課題',
      '個別ケア環境では能力を発揮できる可能性'
    ],
    recommendationType: 'transfer',
    typicalRecommendations: [
      '小規模で個別ケア中心の施設への異動',
      'コミュニケーション研修への参加',
      '1対1のメンター制度導入'
    ]
  },
  {
    pattern: 'skill-development',
    name: 'スキル向上必要型',
    description: '基礎スキルの向上が必要',
    facilityRange: ['C', 'D'],
    corporateRange: ['D'],
    characteristics: [
      '基本的な知識・技術不足',
      '業務ミスの頻度が高い',
      '学習意欲は高い'
    ],
    recommendationType: 'training',
    typicalRecommendations: [
      '基礎技術習得のための集中研修',
      '教育制度の整った施設への異動',
      '専任メンターによる個別指導'
    ]
  },
  {
    pattern: 'burnout-syndrome',
    name: '燃え尽き症候群型',
    description: '以前は優秀だったがパフォーマンスが低下',
    facilityRange: ['B', 'C', 'D'],
    corporateRange: ['A', 'B', 'C'],
    characteristics: [
      '過去の評価は高かった',
      '最近のパフォーマンス低下',
      'メンタルヘルスの懸念'
    ],
    recommendationType: 'support',
    typicalRecommendations: [
      'メンタルヘルスケアの提供',
      '業務負荷の見直し',
      'リフレッシュのための一時的な異動'
    ]
  },
  {
    pattern: 'new-employee-struggle',
    name: '新人適応困難型',
    description: '入職後の環境適応に苦労している',
    facilityRange: ['D'],
    corporateRange: ['C', 'D'],
    characteristics: [
      '入職1-2年目',
      '環境への適応困難',
      '基礎的な能力はある'
    ],
    recommendationType: 'support',
    typicalRecommendations: [
      'メンター制度の強化',
      'より丁寧な指導体制の施設へ',
      '新人フォローアッププログラム'
    ]
  },
  {
    pattern: 'nurse-leadership',
    name: '看護師リーダーシップ型',
    description: '看護部門でのリーダーシップ候補',
    facilityRange: ['S', 'A'],
    corporateRange: ['B', 'C'],
    characteristics: [
      '看護師としての高い専門性',
      'チームリーダーとしての資質',
      '後輩指導への意欲'
    ],
    recommendationType: 'promotion',
    typicalRecommendations: [
      '看護部門の管理職候補として育成',
      '看護師長候補者研修への参加',
      '他施設看護部門との交流'
    ]
  },
  {
    pattern: 'care-specialist',
    name: '介護職スペシャリスト型',
    description: '介護技術のスペシャリスト',
    facilityRange: ['A', 'S'],
    corporateRange: ['C', 'D'],
    characteristics: [
      '卓越した介護技術',
      '利用者からの信頼が厚い',
      '技術指導能力が高い'
    ],
    recommendationType: 'training',
    typicalRecommendations: [
      '介護技術の指導者として法人内研修講師',
      '介護福祉士実習指導者',
      '新人介護職員の教育担当'
    ]
  },
  {
    pattern: 'admin-efficiency',
    name: '事務職効率化推進型',
    description: '業務効率化のキーパーソン',
    facilityRange: ['B'],
    corporateRange: ['A'],
    characteristics: [
      '業務改善への高い意識',
      'IT活用能力が高い',
      '部門横断的な視点'
    ],
    recommendationType: 'transfer',
    typicalRecommendations: [
      '業務改善プロジェクトのリーダー',
      '法人横断的な効率化推進',
      'DX推進チームへの参加'
    ]
  }
];

// 評価パターンを判定する関数
export function determineEvaluationPattern(
  evaluation: Omit<TwoAxisEvaluation, 'evaluationPattern'>,
  previousEvaluation?: TwoAxisEvaluation
): EvaluationPattern {
  const { facilityEval, corporateEval, jobCategory, yearsOfService } = evaluation;

  // 燃え尽き症候群の判定（前回評価との比較）
  if (previousEvaluation) {
    const prevFacilityScore = gradeToScore(previousEvaluation.facilityEval);
    const prevCorporateScore = gradeToScore(previousEvaluation.corporateEval);
    const currentFacilityScore = gradeToScore(facilityEval);
    const currentCorporateScore = gradeToScore(corporateEval);

    if (
      (prevFacilityScore >= 4 || prevCorporateScore >= 4) &&
      (currentFacilityScore <= 2 || currentCorporateScore <= 2)
    ) {
      return 'burnout-syndrome';
    }
  }

  // 新人適応困難型の判定
  if (yearsOfService <= 2 && facilityEval === 'D' && ['C', 'D'].includes(corporateEval)) {
    return 'new-employee-struggle';
  }

  // 職種別パターンの判定
  if (jobCategory === '看護師' && ['S', 'A'].includes(facilityEval) && ['B', 'C'].includes(corporateEval)) {
    return 'nurse-leadership';
  }

  if (jobCategory === '介護職' && ['A', 'S'].includes(facilityEval) && ['C', 'D'].includes(corporateEval)) {
    return 'care-specialist';
  }

  if (jobCategory === '事務職' && facilityEval === 'B' && corporateEval === 'A') {
    return 'admin-efficiency';
  }

  // 一般的なパターンの判定
  for (const pattern of evaluationPatternDefinitions) {
    if (
      pattern.facilityRange.includes(facilityEval) &&
      pattern.corporateRange.includes(corporateEval)
    ) {
      return pattern.pattern;
    }
  }

  // デフォルトは成長株型
  return 'growth-potential';
}

// グレードを数値スコアに変換
function gradeToScore(grade: EvaluationGrade): number {
  const scoreMap: Record<EvaluationGrade, number> = {
    'S': 5,
    'A': 4,
    'B': 3,
    'C': 2,
    'D': 1
  };
  return scoreMap[grade];
}

// 異動推奨情報を生成する関数
export function generateTransferRecommendation(
  evaluation: TwoAxisEvaluation
): TransferRecommendation {
  const patternDef = evaluationPatternDefinitions.find(
    p => p.pattern === evaluation.evaluationPattern
  );

  if (!patternDef) {
    throw new Error(`Pattern definition not found for ${evaluation.evaluationPattern}`);
  }

  // 優先度の決定
  let priority: TransferRecommendation['priority'] = 'medium';
  if (['local-star', 'corporate-ace', 'burnout-syndrome', 'environment-mismatch'].includes(evaluation.evaluationPattern)) {
    priority = 'high';
  } else if (['growth-potential', 'new-employee-struggle'].includes(evaluation.evaluationPattern)) {
    priority = 'low';
  }

  // タイムラインの決定
  let timeline = '6ヶ月以内';
  if (priority === 'high') {
    timeline = '3ヶ月以内';
  } else if (priority === 'low') {
    timeline = '1年以内';
  }

  return {
    employeeId: evaluation.employeeId,
    employeeName: evaluation.employeeName,
    currentDepartment: evaluation.department,
    evaluation,
    recommendationType: patternDef.recommendationType,
    recommendationTitle: `${patternDef.name}への対応`,
    recommendationDetail: patternDef.description,
    priority,
    suggestedActions: patternDef.typicalRecommendations,
    timeline
  };
}

// 職種別の評価分布を分析する関数
export function analyzeJobCategoryDistribution(
  evaluations: TwoAxisEvaluation[],
  jobCategory: JobCategory
) {
  const categoryEvaluations = evaluations.filter(e => e.jobCategory === jobCategory);
  const total = categoryEvaluations.length;

  // 評価マトリックスの作成
  const matrix: { [key: string]: number } = {};
  const grades: EvaluationGrade[] = ['S', 'A', 'B', 'C', 'D'];
  
  grades.forEach(facility => {
    grades.forEach(corporate => {
      const key = `${facility}-${corporate}`;
      matrix[key] = categoryEvaluations.filter(
        e => e.facilityEval === facility && e.corporateEval === corporate
      ).length;
    });
  });

  // パターン分布の計算
  const patternCounts: { [key in EvaluationPattern]?: number } = {};
  categoryEvaluations.forEach(e => {
    patternCounts[e.evaluationPattern] = (patternCounts[e.evaluationPattern] || 0) + 1;
  });

  return {
    jobCategory,
    totalCount: total,
    evaluationMatrix: Object.entries(matrix).map(([key, count]) => {
      const [facility, corporate] = key.split('-') as [EvaluationGrade, EvaluationGrade];
      return {
        facility,
        corporate,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      };
    }),
    dominantPatterns: Object.entries(patternCounts)
      .map(([pattern, count]) => ({
        pattern: pattern as EvaluationPattern,
        count: count!,
        percentage: total > 0 ? (count! / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  };
}