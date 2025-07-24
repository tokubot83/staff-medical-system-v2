// スタッフの基本情報
export interface StaffDetail {
  id: string;
  name: string;
  department: string;
  position: string;
  facility: string;
  age: number;
  joinDate: string;
  tenure: number;
  
  // 評価関連
  evaluation: {
    rating: number;        // パフォーマンス評価（1-5）
    performance: number;   // パフォーマンススコア（0-100）
    skill: number;        // スキルレベル（0-100）
    teamwork: number;     // チームワーク（0-100）
    growth: number;       // 成長性・ポテンシャル（1-5）
  };
  
  // 健康関連
  health: {
    status: 'good' | 'caution' | 'alert';
    stress: number;       // ストレス指数（0-100）
    score: number;        // 健康スコア（0-100）
    risk: 'low' | 'medium' | 'high';
  };
  
  // エンゲージメント
  engagement: {
    rate: number;         // エンゲージメント率（0-100）
    overtimeHours: number; // 残業時間
    ptoUsage: number;     // 有給取得率（0-100）
  };
  
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
  }[];
  
  // 配属履歴
  assignmentHistory: {
    date: string;
    department: string;
    position: string;
    reason?: string;
  }[];
}