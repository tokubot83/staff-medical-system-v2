import { TwoAxisEvaluationGrade } from './two-axis-evaluation'

export interface TwoAxisEvaluationData {
  facilityScore: TwoAxisEvaluationGrade
  facilityRank: number
  facilityTotal: number
  corporateScore: TwoAxisEvaluationGrade
  corporateRank: number
  corporateTotal: number
  overallScore: TwoAxisEvaluationGrade
  evaluationDate?: string
  evaluator?: string
  comments?: string
}

// スタッフの基本情報
export interface StaffDetail {
  id: string
  name: string
  nameInitial: string
  position: string
  department: string
  facility: string
  employeeId: string
  joinDate: string
  tenure: string
  age: number
  birthDate: string
  evaluation: string
  evaluationPeriod: string
  nextMeeting: string
  healthStatus: string
  stressIndex: number
  engagement: number
  overtime: number
  paidLeaveRate: number
  avatar: string
  email: string
  phone: string
  emergencyContact: string
  address: string
  
  // 評価関連（文字列で保存されている可能性があるため）
  evaluationData?: {
    rating: number        // パフォーマンス評価（1-5）
    performance: number   // パフォーマンススコア（0-100）
    skill: number        // スキルレベル（0-100）
    teamwork: number     // チームワーク（0-100）
    growth: number       // 成長性・ポテンシャル（1-5）
  }
  
  // 2軸評価データ
  twoAxisEvaluation?: TwoAxisEvaluationData
  
  evaluationHistory: {
    period: string
    overall: string
    performance: number
    skills: number
    teamwork: number
    growth: number
    evaluator: string
  }[]
  
  // 健康関連（旧形式との互換性）
  healthScore?: number
  lastCheckupDate?: string
  nextCheckupDate?: string
  healthRisks?: string[]
  healthRecommendations?: string[]
  health?: {
    status: 'good' | 'caution' | 'alert'
    stress: number       // ストレス指数（0-100）
    score: number        // 健康スコア（0-100）
    risk: 'low' | 'medium' | 'high'
  }
  
  // スキル
  skills: {
    name: string
    level: number
    category: string
  }[]
  
  // 研修履歴
  trainingHistory?: {
    name: string
    date: string
    hours: number
    score?: number
    certificate: boolean
    category: string
    evaluation: string
  }[]
  
  // 配属履歴
  assignmentHistory?: {
    date: string
    department: string
    position: string
    reason: string
  }[]
  
  [key: string]: any
}

export interface StaffMember extends StaffDetail {
  // StaffDetailと同じインターフェース
}