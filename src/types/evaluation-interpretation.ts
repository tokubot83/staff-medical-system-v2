// 評価履歴解釈コメント機能の型定義

// コメントタイプ
export type CommentType = 'strength' | 'concern' | 'guidance' | 'opportunity' | 'achievement';

// 優先度
export type Priority = 'high' | 'medium' | 'low';

// 成長パターン分類
export type GrowthPattern = 'rapid_growth' | 'steady_growth' | 'plateau' | 'decline' | 'recovery';

// 解釈コメント
export interface InterpretationComment {
  id: string;
  type: CommentType;
  category: 'overall' | 'corporate_rank' | 'facility_rank' | 'integrated';
  title: string;
  description: string;
  actionable: boolean;
  priority: Priority;
  icon?: string;
  color?: string;
  recommendations?: string[];
  metadata?: {
    confidenceScore?: number; // LLM導入時の信頼度スコア
    dataPoints?: string[];    // 根拠となったデータポイント
    generatedBy?: 'rule_based' | 'llm' | 'hybrid';
  };
}

// 評価データ（解釈用）
export interface EvaluationInterpretationData {
  staffId: string;
  staffName: string;
  position: string;
  yearsOfService: number;
  currentData: {
    finalGrade: string;
    facilityRank: { rank: number; total: number; percentile: number };
    corporateRank: { rank: number; total: number; percentile: number };
  };
  historicalData: {
    year: string;
    finalGrade: string;
    facilityRank: { rank: number; total: number; percentile: number };
    corporateRank: { rank: number; total: number; percentile: number };
  }[];
  growthMetrics: {
    gradeProgression: number; // グレード進歩度（-3〜+3）
    facilityRankChange: number; // 施設内順位変化
    corporateRankChange: number; // 法人内順位変化
    consistencyScore: number; // 安定性スコア（0-100）
    growthPattern: GrowthPattern;
  };
}

// コメント生成サービスのインターフェース（LLM対応設計）
export interface CommentGenerationService {
  generateComments(data: EvaluationInterpretationData): Promise<InterpretationComment[]>;
}

// ルールベース実装用の条件定義
export interface CommentRule {
  condition: (data: EvaluationInterpretationData) => boolean;
  comment: Omit<InterpretationComment, 'id'>;
}

// コメントテンプレート（LLMプロンプト設計時の参考用）
export interface CommentTemplate {
  type: CommentType;
  category: string;
  templateText: string;
  variables: string[];
  examples: string[];
}