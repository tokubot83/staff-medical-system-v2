export type EvaluationGrade = 'S' | 'A' | 'B' | 'C' | 'D'

export interface EvaluationScores {
  performance: number        // 業務成果
  skill: number             // 専門スキル
  teamwork: number          // チームワーク
  leadership: number        // リーダーシップ
  growth: number            // 成長性
}

export interface EvaluationPeriod {
  id: string
  year: number
  period: 'H1' | 'H2' | 'Q1' | 'Q2' | 'Q3' | 'Q4'
  startDate: string
  endDate: string
}

export interface EvaluationHistory {
  id: string
  staffId: string
  period: EvaluationPeriod
  grade: EvaluationGrade
  scores: EvaluationScores
  totalScore: number
  evaluatorId: string
  evaluatorName: string
  evaluatorRole: string
  comments: {
    strengths: string
    improvements: string
    goals: string
  }
  status: 'draft' | 'submitted' | 'approved' | 'finalized'
  createdAt: string
  updatedAt: string
  finalizedAt?: string
}

export interface StaffEvaluation {
  currentGrade: EvaluationGrade
  currentScores: EvaluationScores
  previousGrade?: EvaluationGrade
  trend: 'up' | 'down' | 'stable'
  history: EvaluationHistory[]
  nextEvaluationDate?: string
  jnaLadder?: {
    level: 'I' | 'II' | 'III' | 'IV' | 'V'
    certificationDate: string
    nextTargetLevel?: 'I' | 'II' | 'III' | 'IV' | 'V'
  }
}

export interface EvaluationCriteria {
  category: keyof EvaluationScores
  weight: number
  description: string
  levels: {
    score: number
    label: string
    description: string
  }[]
}

export interface EvaluationTemplate {
  id: string
  name: string
  department?: string
  role?: string
  criteria: EvaluationCriteria[]
  isActive: boolean
}

export interface EvaluationStats {
  totalEvaluations: number
  completedEvaluations: number
  pendingEvaluations: number
  averageScore: number
  gradeDistribution: Record<EvaluationGrade, number>
  departmentStats: {
    department: string
    averageScore: number
    completionRate: number
  }[]
}

export function calculateGradeFromScore(score: number): EvaluationGrade {
  if (score >= 4.5) return 'S'
  if (score >= 4.0) return 'A'
  if (score >= 3.0) return 'B'
  if (score >= 2.0) return 'C'
  return 'D'
}

export function calculateTotalScore(scores: EvaluationScores): number {
  const values = Object.values(scores)
  return values.reduce((sum, score) => sum + score, 0) / values.length
}

export function getGradeColor(grade: EvaluationGrade): string {
  const colors: Record<EvaluationGrade, string> = {
    S: '#ff6b6b',
    A: '#4ecdc4',
    B: '#45b7d1',
    C: '#f39c12',
    D: '#95a5a6'
  }
  return colors[grade]
}

export function getGradeLabel(grade: EvaluationGrade): string {
  const labels: Record<EvaluationGrade, string> = {
    S: '卓越',
    A: '優秀',
    B: '良好',
    C: '標準',
    D: '要改善'
  }
  return labels[grade]
}