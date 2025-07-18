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

export interface CategoryMetrics {
  categoryName: string;
  description: string;
  icon: string;
  color: string;
  mainMetric: MetricData;
  subMetrics: MetricData[];
  facilities: FacilityData[];
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