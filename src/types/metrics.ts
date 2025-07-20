import { ReportCategory } from './reports';

// メトリクスの詳細データ
export interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

// 部署データ
export interface DepartmentMetrics {
  name: string;
  metrics: Metric[];
}

// 施設データ
export interface FacilityMetrics {
  facilityName: string;
  departments: DepartmentMetrics[];
}

// カテゴリメトリクス
export interface CategoryMetrics {
  id: string;
  category: ReportCategory;
  mainMetric: {
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    change?: number;
  };
  subMetrics: Metric[];
  facilityData: FacilityMetrics[];
}

export interface MetricData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
}

export interface DepartmentData {
  name: string;
  metrics: MetricData[];
}

export interface FacilityData {
  name: string;
  departments: DepartmentData[];
}

// 基本指標
export interface BasicMetrics extends CategoryMetrics {
  totalStaff: number;
  staffByDepartment: { department: string; count: number }[];
  staffByType: { type: string; count: number }[];
  staffByEmployment: { employment: string; count: number }[];
  averageAge: number;
  averageTenure: number;
}

// 人材の質
export interface QualityMetrics extends CategoryMetrics {
  satisfaction: number;
  engagement: number;
  patientSatisfactionCorrelation: number;
  certificationRate: number;
  specialistRate: number;
  evaluationScore: number;
}

// 人材の成長
export interface GrowthMetrics extends CategoryMetrics {
  trainingRate: number;
  skillAchievementRate: number;
  careerProgressRate: number;
  promotionRate: number;
  educationROI: number;
  mentorshipRate: number;
}

// リスク管理
export interface RiskMetrics extends CategoryMetrics {
  cautionStaff: number;
  turnoverRate: number;
  absenceRate: number;
  mentalHealthIssues: number;
  harassmentCases: number;
  accidentRate: number;
}

// 組織効率
export interface EfficiencyMetrics extends CategoryMetrics {
  urgentIssues: number;
  overtimeHours: number;
  ptoUsageRate: number;
  laborCostRate: number;
  productivityIndex: number;
  transferRequests: number;
}

// データ分析
export interface DataAnalysisItem {
  title: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  content: string;
  actions?: string[];
  impact?: string;
}

export interface DataAnalysis {
  summary: string;
  insights: DataAnalysisItem[];
  recommendations: DataAnalysisItem[];
  risks: DataAnalysisItem[];
}