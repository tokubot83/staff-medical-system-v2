// スタッフの基本情報
export interface StaffDetail {
  id: string;
  name: string;
  nameInitial: string;
  department: string;
  position: string;
  facility: string;
  age: number;
  joinDate: string;
  tenure: string;
  employeeId: string;
  birthDate: string;
  evaluationPeriod: string;
  nextMeeting: string;
  avatar: string;
  email: string;
  phone: string;
  emergencyContact: string;
  address: string;
  
  // 評価関連（文字列で保存されている可能性があるため）
  evaluation: string;
  evaluationData?: {
    rating: number;        // パフォーマンス評価（1-5）
    performance: number;   // パフォーマンススコア（0-100）
    skill: number;        // スキルレベル（0-100）
    teamwork: number;     // チームワーク（0-100）
    growth: number;       // 成長性・ポテンシャル（1-5）
  };
  
  // 2軸評価データ
  twoAxisEvaluation?: {
    facilityScore: 'S' | 'A' | 'B' | 'C' | 'D';      // 施設内評価
    corporateScore: 'S' | 'A' | 'B' | 'C' | 'D';     // 法人内評価
    overallScore: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D';  // 総合評価
    facilityRank?: number;    // 施設内順位
    facilityTotal?: number;   // 施設内総人数
    corporateRank?: number;   // 法人内順位
    corporateTotal?: number;  // 法人内総人数
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
  lastCheckupDate?: string;
  nextCheckupDate?: string;
  healthRisks?: string[];
  healthRecommendations?: string[];
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
    certificate: boolean;
    category: string;
    evaluation: string;
  }[];
  
  // 配属履歴
  assignmentHistory: {
    date: string;
    department: string;
    position: string;
    reason: string;
  }[];
}