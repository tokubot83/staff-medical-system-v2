import { EvaluationGrade, FinalEvaluationGrade } from './two-axis-evaluation'

// ==========================================
// キャリアコース選択制度関連の型定義
// 参照: docs/20250919_【川畑法人統括事務局長】コース別雇用制度労基資料.pdf
// ==========================================

/**
 * キャリアコースコード (A～D)
 */
export type CareerCourseCode = 'A' | 'B' | 'C' | 'D'

/**
 * 施設間異動の可否レベル
 * - none: 施設間異動不可（Bコース: 施設内の部署異動のみ対応）
 * - limited: 将来の拡張用（現在未使用）
 * - full: 全施設対象（Aコース: 転居を伴う転勤も含む）
 */
export type FacilityTransferLevel = 'none' | 'limited' | 'full'

/**
 * 夜勤の可否レベル
 */
export type NightShiftAvailability = 'none' | 'selectable' | 'required'

/**
 * コース変更理由
 */
export type CourseChangeReason =
  | 'annual'                 // 年次定期変更
  | 'special_pregnancy'      // 特例: 妊娠
  | 'special_caregiving'     // 特例: 介護
  | 'special_illness'        // 特例: 疾病
  | 'special_other'          // 特例: その他

/**
 * 承認ステータス
 */
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn'

/**
 * 特例変更事由
 */
export type SpecialChangeReason = 'pregnancy' | 'caregiving' | 'illness' | null

/**
 * キャリアコース定義（マスターデータ）
 */
export interface CourseDefinition {
  id: string
  courseCode: CareerCourseCode
  courseName: string
  description: string

  // 異動・転勤条件
  departmentTransferAvailable: boolean    // 部署異動可否
  facilityTransferAvailable: FacilityTransferLevel  // 施設間異動可否
  relocationRequired: boolean             // 転居を伴う転勤

  // 勤務条件
  nightShiftAvailable: NightShiftAvailability

  // キャリアパス
  managementTrack: boolean                // 管理職登用対象

  // 給与設定（3パターン対応: 係数のみ/等級のみ/両方）
  baseSalaryMultiplier: number            // 基本給係数（例: 1.2）
  salaryGrade: number | null              // 給与等級（オプション）
  salaryNotes: string | null              // 給与計算に関するメモ

  // メタデータ
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

/**
 * 職員のキャリアコース選択情報
 */
export interface CareerCourseSelection {
  id: string
  staffId: string
  courseCode: CareerCourseCode
  courseName?: string  // 表示用（JOIN結果）

  // 適用期間
  effectiveFrom: string  // YYYY-MM-DD
  effectiveTo: string | null  // NULL = 現在有効

  // 次回変更可能日（年1回制限）
  nextChangeAvailableDate: string | null

  // 特例変更事由
  specialChangeReason: SpecialChangeReason
  specialChangeNote: string | null

  // 承認情報
  changeRequestedAt: string | null
  changeRequestedBy: string | null
  approvedAt: string | null
  approvedBy: string | null
  approvalStatus: ApprovalStatus
  rejectionReason: string | null

  // メタデータ
  createdAt: string
  updatedAt: string
}

/**
 * キャリアコース変更申請
 */
export interface CareerCourseChangeRequest {
  id: string
  staffId: string
  staffName?: string  // 表示用

  // 変更内容
  currentCourseCode: CareerCourseCode
  currentCourseName?: string  // 表示用
  requestedCourseCode: CareerCourseCode
  requestedCourseName?: string  // 表示用
  requestedEffectiveDate: string  // YYYY-MM-DD

  // 変更理由
  changeReason: CourseChangeReason
  reasonDetail: string | null
  attachmentUrls: string[] | null  // 診断書等の添付ファイル

  // 承認フロー
  approvalStatus: ApprovalStatus
  submittedAt: string
  submittedBy: string
  submittedByName?: string  // 表示用

  reviewedAt: string | null
  reviewedBy: string | null
  reviewedByName?: string  // 表示用
  reviewComment: string | null

  // 反映状態
  appliedToRecord: boolean
  appliedAt: string | null

  // メタデータ
  createdAt: string
  updatedAt: string
}

/**
 * コース間転換ルール
 */
export interface CourseTransferRule {
  id: string
  fromCourseCode: CareerCourseCode
  toCourseCode: CareerCourseCode

  // 転換条件
  isAllowed: boolean
  requiresApproval: boolean
  requiresTraining: boolean          // キャリアルートの違いを考慮した訓練
  trainingProgramName: string | null

  // 制約条件
  minimumServiceYears: number | null  // 最低勤続年数
  requiresManagerRecommendation: boolean

  // 説明
  notes: string | null

  createdAt: string
  updatedAt: string
}

/**
 * キャリアコース選択制度の統計情報
 */
export interface CareerCourseStatistics {
  totalStaff: number
  byCourse: {
    courseCode: CareerCourseCode
    courseName: string
    count: number
    percentage: number
  }[]
  pendingChangeRequests: number
  recentChanges: {
    month: string
    count: number
  }[]
}

/**
 * コース詳細情報（定義+職員数）
 */
export interface CourseDefinitionWithCount extends CourseDefinition {
  currentStaffCount: number
  percentage: number
}

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

  // 雇用ステータス・退職関連（Phase 4追加）
  employmentStatus?: 'active' | 'resigned' | 'on_leave' | 'suspended'  // 雇用ステータス
  resignationDate?: string         // 退職日
  resignationReason?: 'personal' | 'career_change' | 'relocation' | 'health' |
                      'family' | 'retirement' | 'contract_end' | 'disciplinary' |
                      'company_initiated' | 'other'  // 退職理由
  resignationReasonDetail?: string // 退職理由詳細
  lastWorkingDate?: string         // 最終勤務日
  resignationNoticeDate?: string   // 退職申し出日

  // 退職面談情報
  exitInterviewApplicable?: boolean   // 退職面談実施対象か
  exitInterviewCompleted?: boolean    // 退職面談実施済みか
  exitInterviewId?: string            // 退職面談ID
  exitInterviewSkippedReason?: string // 面談未実施理由
  exitInterviewWaivedBy?: string      // 面談免除承認者ID

  // 再雇用関連
  rehireEligible?: boolean         // 再雇用可能フラグ
  rehireNotes?: string             // 再雇用に関するメモ

  // キャリアコース選択制度（Phase 5）
  careerCourse?: CareerCourseSelection

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