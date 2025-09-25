import { EvaluationGrade, FinalEvaluationGrade } from './two-axis-evaluation'

export interface TwoAxisEvaluationData {
  facilityScore: EvaluationGrade
  facilityRank: number
  facilityTotal: number
  corporateScore: EvaluationGrade
  corporateRank: number
  corporateTotal: number
  overallScore: FinalEvaluationGrade
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

  // VoiceDrive連携用権限情報
  accountLevel?: number            // 1-18の権限レベル（小数点対応）
  canPerformLeaderDuty?: boolean   // リーダー業務可否（看護師・准看護師のみ）

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
  
  // マインド・志向性情報
  mindset?: {
    // キャリア志向
    careerOrientation: {
      type: 'management' | 'specialist' | 'frontline' | 'balanced' // 管理職/専門職/現場/バランス型
      vision: string // キャリアビジョン
      goals: string[] // 中長期目標
      desiredGrowthAreas: string[] // 希望する成長分野
    }
    
    // 仕事への向き合い方
    workApproach: {
      style: 'team' | 'individual' | 'flexible' // チーム重視/個人重視/柔軟
      values: ('patientCare' | 'efficiency' | 'innovation' | 'quality' | 'education')[] // 重視する価値観
      motivationSources: ('achievement' | 'recognition' | 'growth' | 'contribution' | 'stability')[] // モチベーション源
      strengths: string[] // 自己認識している強み
      developmentAreas: string[] // 改善したい領域
    }
    
    // 働き方の希望
    workPreferences: {
      workStyle: 'fulltime' | 'parttime' | 'flexible' // フルタイム/パートタイム/柔軟
      nightShift: 'yes' | 'no' | 'limited' // 夜勤可否
      workLifeBalance: 'high' | 'medium' | 'low' // ワークライフバランス重視度
      relocationWillingness: 'yes' | 'no' | 'negotiable' // 転勤意向
      preferredDepartments?: string[] // 希望部署
    }
    
    // 組織への貢献意欲
    organizationalCommitment: {
      mentorshipInterest: 'high' | 'medium' | 'low' // メンター意欲
      projectParticipation: 'proactive' | 'selective' | 'passive' // プロジェクト参加姿勢
      improvementProposals: 'frequent' | 'occasional' | 'rare' // 改善提案頻度
      leadershipAspiration: boolean // リーダーシップ志向
      teamBuildingInterest: 'high' | 'medium' | 'low' // チームビルディングへの関心
    }
    
    // その他
    personalInterests?: string[] // 個人的な興味・関心
    specialCircumstances?: string // 特別な事情（介護、育児等）
    lastUpdated: string // 最終更新日
    updatedBy: string // 更新者
  }
  
  [key: string]: any
}

export interface StaffMember extends StaffDetail {
  // StaffDetailと同じインターフェース
}