// 評価履歴解釈コメント生成サービス

import { 
  InterpretationComment, 
  EvaluationInterpretationData, 
  CommentGenerationService,
  CommentRule,
  GrowthPattern
} from '@/types/evaluation-interpretation';

// ルールベースのコメント生成サービス
export class RuleBasedCommentService implements CommentGenerationService {
  private rules: CommentRule[] = [
    // 総合評価（グレード）に関するルール
    {
      condition: (data) => data.growthMetrics.gradeProgression >= 2,
      comment: {
        type: 'strength',
        category: 'overall',
        title: '優秀な成長実績',
        description: `${data.historicalData[0]?.finalGrade || 'D'}グレードから${data.currentData.finalGrade}グレードへの大幅な向上を達成。継続支援により更なる成長が期待できます。`,
        actionable: true,
        priority: 'high',
        icon: '🚀',
        color: '#059669',
        recommendations: [
          'より高次の業務への挑戦機会を提供',
          'リーダーシップ研修への参加を検討',
          'メンター役としての後輩指導を任命'
        ],
        metadata: {
          confidenceScore: 95,
          dataPoints: ['グレード推移', '成長パターン分析'],
          generatedBy: 'rule_based'
        }
      }
    },
    {
      condition: (data) => data.growthMetrics.gradeProgression === 1,
      comment: {
        type: 'achievement',
        category: 'overall',
        title: '安定した成長',
        description: `${data.historicalData[0]?.finalGrade || 'C'}グレードから${data.currentData.finalGrade}グレードへの着実な向上を実現。安定した成長パターンを維持しています。`,
        actionable: true,
        priority: 'medium',
        icon: '📈',
        color: '#0891b2',
        recommendations: [
          '現在の成長ペースを維持するための継続支援',
          '専門スキル向上のための研修機会を提供',
          '次段階のキャリア目標設定を支援'
        ],
        metadata: {
          confidenceScore: 85,
          dataPoints: ['グレード推移'],
          generatedBy: 'rule_based'
        }
      }
    },
    {
      condition: (data) => data.growthMetrics.gradeProgression <= -1,
      comment: {
        type: 'concern',
        category: 'overall',
        title: 'グレード低下への対応が必要',
        description: 'グレードの低下傾向が見られます。早期の原因分析と適切な支援策の実施が重要です。',
        actionable: true,
        priority: 'high',
        icon: '⚠️',
        color: '#dc2626',
        recommendations: [
          '1on1面談で課題や悩みを詳しくヒアリング',
          '業務負荷の見直しと調整を実施',
          '必要に応じて職場環境の改善を検討',
          '継続的なフォローアップ体制を構築'
        ],
        metadata: {
          confidenceScore: 90,
          dataPoints: ['グレード推移', '成長パターン'],
          generatedBy: 'rule_based'
        }
      }
    },
    
    // 法人内順位に関するルール
    {
      condition: (data) => data.currentData.corporateRank.percentile >= 90,
      comment: {
        type: 'strength',
        category: 'corporate_rank',
        title: '法人内エース層に到達',
        description: `法人内上位${100 - data.currentData.corporateRank.percentile}%の優秀層です。組織の核となる人材として期待できます。`,
        actionable: true,
        priority: 'high',
        icon: '⭐',
        color: '#7c3aed',
        recommendations: [
          '法人横断プロジェクトのリーダーに抜擢',
          '他施設への指導・支援役を任命',
          '幹部候補としての育成プログラムへ参加',
          '法人内での知識共有・講師役を依頼'
        ],
        metadata: {
          confidenceScore: 98,
          dataPoints: ['法人内順位', 'パーセンタイル'],
          generatedBy: 'rule_based'
        }
      }
    },
    {
      condition: (data) => data.growthMetrics.corporateRankChange >= 200 && data.growthMetrics.corporateRankChange < 400,
      comment: {
        type: 'achievement',
        category: 'corporate_rank',
        title: '法人内順位の大幅改善',
        description: `法人内で${data.growthMetrics.corporateRankChange}位の順位向上を達成。優れた成長実績です。`,
        actionable: true,
        priority: 'medium',
        icon: '🎯',
        color: '#059669',
        recommendations: [
          'この成長要因を分析し他職員への横展開',
          '更なる高次業務への挑戦機会を提供',
          '成功事例として社内で共有・発表'
        ],
        metadata: {
          confidenceScore: 85,
          dataPoints: ['順位変化', '成長トレンド'],
          generatedBy: 'rule_based'
        }
      }
    },
    {
      condition: (data) => data.growthMetrics.corporateRankChange >= 400,
      comment: {
        type: 'achievement',
        category: 'corporate_rank',
        title: '法人内順位の劇的改善',
        description: `法人内で${data.growthMetrics.corporateRankChange}位もの大幅な順位向上を達成。exceptional な成長実績です。`,
        actionable: true,
        priority: 'high',
        icon: '🌟',
        color: '#dc2626',
        recommendations: [
          'ベストプラクティスとして法人全体で共有',
          '指導者・メンターとしての役割を拡大',
          '法人表彰制度での表彰を検討',
          '昇進・昇格の候補として優先検討'
        ],
        metadata: {
          confidenceScore: 95,
          dataPoints: ['順位変化', '成長パターン'],
          generatedBy: 'rule_based'
        }
      }
    },
    
    // 施設内順位に関するルール
    {
      condition: (data) => data.currentData.facilityRank.percentile >= 90,
      comment: {
        type: 'strength',
        category: 'facility_rank',
        title: '施設内トップ層の実力',
        description: `施設内上位${100 - data.currentData.facilityRank.percentile}%の優秀な職員です。施設のリーダー層として活躍が期待されます。`,
        actionable: true,
        priority: 'high',
        icon: '👑',
        color: '#ea580c',
        recommendations: [
          '施設内でのリーダーシップ役割を拡大',
          '新人・若手職員のメンター役を任命',
          '施設改善プロジェクトの責任者に抜擢',
          '他施設での研修・指導機会を提供'
        ],
        metadata: {
          confidenceScore: 92,
          dataPoints: ['施設内順位', 'パーセンタイル'],
          generatedBy: 'rule_based'
        }
      }
    },
    {
      condition: (data) => data.currentData.facilityRank.percentile >= 75 && data.currentData.corporateRank.percentile < 50,
      comment: {
        type: 'guidance',
        category: 'integrated',
        title: '施設特化型人材への育成指導',
        description: '施設内では上位ですが法人内では中位レベル。より広範囲な経験を通じて法人レベルでの成長を支援する必要があります。',
        actionable: true,
        priority: 'medium',
        icon: '💡',
        color: '#0891b2',
        recommendations: [
          '他施設での実習・研修機会を提供',
          '法人横断プロジェクトへの参加を促進',
          '外部研修や学会参加を支援',
          '異なる職種との協働経験を積ませる'
        ],
        metadata: {
          confidenceScore: 80,
          dataPoints: ['施設内順位', '法人内順位', '順位格差'],
          generatedBy: 'rule_based'
        }
      }
    },
    
    // 成長パターンに関するルール
    {
      condition: (data) => data.growthMetrics.growthPattern === 'plateau' && data.yearsOfService >= 5,
      comment: {
        type: 'concern',
        category: 'integrated',
        title: '成長停滞期への対策が必要',
        description: '過去2年間の成長が横ばいです。新たな刺激や挑戦機会を提供し、再成長を促す施策が必要です。',
        actionable: true,
        priority: 'medium',
        icon: '🔄',
        color: '#f59e0b',
        recommendations: [
          'キャリア面談で新たな目標設定を支援',
          '異動や職務変更を検討',
          '新しいスキル習得の機会を提供',
          '外部研修や資格取得を支援'
        ],
        metadata: {
          confidenceScore: 75,
          dataPoints: ['成長パターン', '勤続年数', 'パフォーマンス推移'],
          generatedBy: 'rule_based'
        }
      }
    },
    
    // 経験年数に応じたルール
    {
      condition: (data) => data.yearsOfService <= 3 && data.currentData.facilityRank.percentile >= 80,
      comment: {
        type: 'opportunity',
        category: 'integrated',
        title: '高ポテンシャル若手人材',
        description: `入職${data.yearsOfService}年目で既に上位20%に位置する優秀な若手職員です。将来の幹部候補として重点育成が推奨されます。`,
        actionable: true,
        priority: 'high',
        icon: '✨',
        color: '#8b5cf6',
        recommendations: [
          '早期キャリア開発プログラムへの参加',
          '多様な部署での経験機会を提供',
          '上級職員による個別メンタリング',
          '将来のリーダーシップ研修へ優先参加'
        ],
        metadata: {
          confidenceScore: 88,
          dataPoints: ['勤続年数', '施設内順位', '成長率'],
          generatedBy: 'rule_based'
        }
      }
    }
  ];

  async generateComments(data: EvaluationInterpretationData): Promise<InterpretationComment[]> {
    const comments: InterpretationComment[] = [];
    
    // 各ルールを評価してマッチするコメントを生成
    for (const rule of this.rules) {
      if (rule.condition(data)) {
        const comment: InterpretationComment = {
          id: `${rule.comment.category}-${rule.comment.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...rule.comment,
          // データから動的に値を設定
          description: this.interpolateDescription(rule.comment.description, data)
        };
        comments.push(comment);
      }
    }
    
    // 優先度順にソート
    return comments.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private interpolateDescription(template: string, data: EvaluationInterpretationData): string {
    // テンプレート文字列内の変数を実際の値に置換
    return template
      .replace(/\${data\.historicalData\[0\]\.finalGrade}/g, data.historicalData[0]?.finalGrade || 'D')
      .replace(/\${data\.currentData\.finalGrade}/g, data.currentData.finalGrade)
      .replace(/\${data\.growthMetrics\.corporateRankChange}/g, Math.abs(data.growthMetrics.corporateRankChange).toString())
      .replace(/\${data\.currentData\.corporateRank\.percentile}/g, data.currentData.corporateRank.percentile.toString())
      .replace(/\${data\.currentData\.facilityRank\.percentile}/g, data.currentData.facilityRank.percentile.toString())
      .replace(/\${data\.yearsOfService}/g, data.yearsOfService.toString());
  }
}

// 成長パターン分析ユーティリティ
export class GrowthAnalyzer {
  static analyzeGrowthPattern(data: EvaluationInterpretationData): GrowthPattern {
    const { gradeProgression, consistencyScore } = data.growthMetrics;
    
    if (gradeProgression >= 2) return 'rapid_growth';
    if (gradeProgression >= 1 && consistencyScore >= 70) return 'steady_growth';
    if (Math.abs(gradeProgression) < 1 && consistencyScore >= 80) return 'plateau';
    if (gradeProgression < -1) return 'decline';
    if (gradeProgression >= 0 && consistencyScore < 70) return 'recovery';
    
    return 'steady_growth';
  }

  static calculateGrowthMetrics(historicalData: any[], currentData: any): any {
    const firstGrade = this.gradeToNumber(historicalData[0]?.finalGrade || 'D');
    const currentGrade = this.gradeToNumber(currentData.finalGrade);
    
    const facilityRankChange = (historicalData[0]?.facilityRank?.rank || currentData.facilityRank.rank) - currentData.facilityRank.rank;
    const corporateRankChange = (historicalData[0]?.corporateRank?.rank || currentData.corporateRank.rank) - currentData.corporateRank.rank;
    
    const gradeProgression = currentGrade - firstGrade;
    const consistencyScore = this.calculateConsistencyScore(historicalData);
    
    return {
      gradeProgression,
      facilityRankChange,
      corporateRankChange,
      consistencyScore,
      growthPattern: this.analyzeGrowthPattern({
        growthMetrics: {
          gradeProgression,
          facilityRankChange,
          corporateRankChange,
          consistencyScore,
          growthPattern: 'steady_growth' // 仮設定
        }
      } as EvaluationInterpretationData)
    };
  }

  private static gradeToNumber(grade: string): number {
    const gradeMap: { [key: string]: number } = {
      'D': 1, 'C': 2, 'B': 3, 'A': 4, 'A+': 5, 'S': 6, 'S+': 7
    };
    return gradeMap[grade] || 1;
  }

  private static calculateConsistencyScore(historicalData: any[]): number {
    if (historicalData.length < 3) return 100;
    
    // 順位変動の標準偏差を基に一貫性を計算（簡略化）
    const facilityRanks = historicalData.map(d => d.facilityRank?.rank || 50);
    const mean = facilityRanks.reduce((a, b) => a + b) / facilityRanks.length;
    const variance = facilityRanks.reduce((a, b) => a + Math.pow(b - mean, 2)) / facilityRanks.length;
    const stdDev = Math.sqrt(variance);
    
    // 標準偏差が小さいほど一貫性が高い（0-100スケール）
    return Math.max(0, Math.min(100, 100 - (stdDev / 10) * 100));
  }
}

// 将来のLLM実装用インターフェース（準備）
export class LLMCommentService implements CommentGenerationService {
  private apiEndpoint: string = '/api/llm/evaluation-comments';
  
  async generateComments(data: EvaluationInterpretationData): Promise<InterpretationComment[]> {
    // TODO: LLM API実装時にここを実装
    // 現在はルールベースにフォールバック
    const fallbackService = new RuleBasedCommentService();
    return fallbackService.generateComments(data);
  }
}

// サービスファクトリー（設定に応じて切り替え可能）
export class CommentServiceFactory {
  static create(type: 'rule_based' | 'llm' | 'hybrid' = 'rule_based'): CommentGenerationService {
    switch (type) {
      case 'llm':
        return new LLMCommentService();
      case 'hybrid':
        // TODO: ハイブリッド実装
        return new RuleBasedCommentService();
      case 'rule_based':
      default:
        return new RuleBasedCommentService();
    }
  }
}