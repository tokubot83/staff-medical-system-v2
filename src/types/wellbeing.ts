// ウェルビーイング関連の型定義

// ウェルビーイング総合データ
export interface WellbeingData {
  staffId: string;
  period: string; // YYYY-MM形式
  facility: string;
  department: string;
  position: string;
  
  // ウェルビーイング総合指標
  wellbeingIndex: {
    overall: number; // 0-100
    physical: number; // 身体的健康
    mental: number; // 精神的健康
    social: number; // 社会的健康
    purpose: number; // 仕事の意義
    growth: number; // 成長実感
  };
  
  // ストレス要因分析
  stressFactors: {
    workload: number; // 業務量
    relationships: number; // 人間関係
    workControl: number; // 裁量度
    reward: number; // 評価・報酬
    workEnvironment: number; // 職場環境
    change: number; // 組織変化
  };
  
  // ワークライフバランス評価
  workLifeBalance: {
    workTime: number; // 労働時間満足度
    privateTime: number; // プライベート時間
    flexibility: number; // 柔軟性
    familySupport: number; // 家族との時間
    selfCare: number; // セルフケア時間
    overall: number; // 総合バランス
  };
  
  // エンゲージメント調査
  engagementScore: {
    vigor: number; // 活力
    dedication: number; // 熱意
    absorption: number; // 没頭
    overall: number; // 総合スコア
    trend: 'up' | 'stable' | 'down'; // トレンド
  };
  
  // 介入プログラム効果
  interventionEffects?: {
    programId: string;
    programName: string;
    startDate: string;
    preScore: number;
    postScore: number;
    improvement: number;
    feedback: string;
  }[];
}

// 集計データ（部署・職種別）
export interface WellbeingAggregateData {
  category: 'department' | 'position' | 'facility';
  name: string;
  period: string;
  staffCount: number;
  
  averageScores: {
    wellbeingIndex: number;
    stressLevel: number;
    workLifeBalance: number;
    engagement: number;
  };
  
  distribution: {
    excellent: number; // 優良（80以上）
    good: number; // 良好（60-79）
    fair: number; // 普通（40-59）
    poor: number; // 要改善（40未満）
  };
}

// 時系列データ
export interface WellbeingTrendData {
  staffId?: string;
  category?: string;
  data: {
    period: string;
    wellbeingIndex: number;
    stressLevel: number;
    engagement: number;
    workLifeBalance: number;
  }[];
}

// ストレス要因ヒートマップデータ
export interface StressHeatmapData {
  position: string;
  factors: {
    factor: string;
    level: number;
    count: number;
  }[];
}

// 介入プログラム定義
export interface InterventionProgram {
  id: string;
  name: string;
  type: 'mental' | 'physical' | 'skill' | 'team' | 'other';
  description: string;
  targetGroup: string[];
  duration: string;
  frequency: string;
  expectedOutcome: string;
}