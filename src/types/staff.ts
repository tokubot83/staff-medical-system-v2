// スタッフの基本情報
export interface StaffDetail {
  id: string;
  name: string;
  department: string;
  position: string;
  facility: string;
  age: number;
  joinDate: string;
  tenure: string;
  
  // 評価関連（文字列で保存されている可能性があるため）
  evaluation: string;
  evaluationData?: {
    rating: number;        // パフォーマンス評価（1-5）
    performance: number;   // パフォーマンススコア（0-100）
    skill: number;        // スキルレベル（0-100）
    teamwork: number;     // チームワーク（0-100）
    growth: number;       // 成長性・ポテンシャル（1-5）
  };
  evaluationHistory: {
    period: string;
    overall: string;
    performance: number;
    skills: number;
    teamwork: number;
    growth: number;
    evaluator: string;
  }[];
  
  // 健康関連（旧形式との互換性）
  healthStatus: string;
  healthScore?: number;
  stressIndex: number;
  health?: {
    status: 'good' | 'caution' | 'alert';
    stress: number;       // ストレス指数（0-100）
    score: number;        // 健康スコア（0-100）
    risk: 'low' | 'medium' | 'high';
  };
  
  // エンゲージメント（旧形式との互換性）
  engagement: number;       // エンゲージメント率（0-100）
  overtime: number;         // 残業時間
  paidLeaveRate: number;    // 有給取得率（0-100）
  
  // スキル
  skills: {
    name: string;
    level: number;
    category: string;
  }[];
  
  // 研修履歴
  trainingHistory: {
    name: string;
    date: string;
    hours: number;
    score?: number;
    certificate?: boolean;
    category?: string;
    evaluation?: string;
  }[];
  
  // 配属履歴
  assignmentHistory: {
    date: string;
    department: string;
    position: string;
    reason?: string;
  }[];
}