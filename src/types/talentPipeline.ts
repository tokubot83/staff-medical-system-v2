// 統合人材パイプライン管理システムの型定義

export type TalentStatus =
  | 'visitor-scheduled' // 見学予定
  | 'visitor-completed' // 見学済み
  | 'visitor-converted' // 応募者へ移行済み
  | 'applicant-new' // 新規応募
  | 'applicant-screening' // 書類選考中
  | 'applicant-interview' // 面接中
  | 'offer-pending' // 内定出し中
  | 'offer-accepted' // 内定承諾
  | 'onboarding' // 入職準備中
  | 'employed' // 入職済み
  | 'declined' // 辞退
  | 'rejected' // 不採用
  | 'talent-pool' // タレントプール（将来採用候補）
  | 'blacklist' // 採用不可

export type ContactType =
  | 'facility-visit' // 施設見学
  | 'application' // 応募
  | 'screening' // 書類選考
  | 'interview-1st' // 一次面接
  | 'interview-2nd' // 二次面接
  | 'interview-final' // 最終面接
  | 'offer' // 内定通知
  | 'follow-up' // フォローアップ
  | 'rejection' // 不採用通知
  | 'withdrawal' // 辞退

export interface TalentProfile {
  id: string

  // 基本情報（全段階共通）
  basicInfo: {
    lastName: string
    firstName: string
    lastNameKana: string
    firstNameKana: string
    email: string
    phone: string
    alternatePhone?: string
    birthDate: string
    gender: '男性' | '女性' | 'その他' | '回答しない'
    address?: {
      postalCode: string
      prefecture: string
      city: string
      street: string
    }
    profilePhoto?: string
    firstContactDate: string
    lastContactDate: string
    source: string // 最初の接触経路（求人サイト、紹介、直接応募等）
  }

  // 現在のステータス
  currentStatus: TalentStatus
  currentStage: 'visitor' | 'applicant' | 'offer-holder' | 'employee' | 'inactive'

  // タグ（複数の属性を管理）
  tags: string[] // ['即戦力', '経験者', '新卒', '第二新卒', 'UIターン', '高評価']

  // 見学者情報
  visitorInfo?: {
    scheduledVisitDate?: string
    actualVisitDate?: string
    interestedDepartments: string[]
    interestedPositions: string[]
    visitPurpose: string
    accompaniedBy?: string // 同伴者
    visitFeedback?: {
      satisfaction: number // 1-5
      interestLevel: 'high' | 'medium' | 'low'
      concerns: string[]
      positivePoints: string[]
      followUpRequired: boolean
      notes: string
    }
    // 応募者への移行情報
    conversionInfo?: {
      convertedAt: string
      convertedBy: string
      conversionReason?: string
      applicantId?: string // 移行先の応募者ID
    }
  }

  // 応募者情報
  applicantInfo?: {
    desiredPosition: string
    desiredSalary: {
      min: number
      max: number
    }
    availableStartDate: string
    currentEmployment: string
    noticePeriod?: string // 退職までの期間

    // 見学者からの移行情報
    previousVisitorId?: string // 元見学者ID
    visitorHistory?: {
      visitDate: string
      visitFeedback?: {
        satisfaction: number
        interestLevel: 'high' | 'medium' | 'low'
        notes: string
      }
      conversionDate: string
      conversionReason?: string
    }

    // 応募書類
    documents: {
      resume?: {
        fileName: string
        uploadedAt: string
        version: number
      }
      coverLetter?: {
        fileName: string
        uploadedAt: string
      }
      portfolio?: {
        fileName: string
        uploadedAt: string
      }
      certifications?: Array<{
        name: string
        fileName: string
        uploadedAt: string
      }>
    }

    // 資格・スキル
    qualifications: string[]
    licenses: Array<{
      name: string
      issuedDate: string
      expiryDate?: string
      licenseNumber?: string
    }>
    skills: Array<{
      category: string
      items: string[]
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    }>

    // 職歴
    experience: Array<{
      company: string
      position: string
      department?: string
      startDate: string
      endDate?: string
      isCurrent: boolean
      responsibilities: string
      achievements?: string
      reasonForLeaving?: string
    }>

    // 学歴
    education: Array<{
      institution: string
      degree: string
      major: string
      graduationDate: string
      gpa?: string
    }>
  }

  // 内定者情報
  offerInfo?: {
    offeredPosition: string
    offeredDepartment: string
    offeredFacility: string
    offeredSalary: number
    offerDate: string
    responseDeadline: string
    acceptanceDate?: string
    declineDate?: string
    declineReason?: string
    startDate?: string

    // 条件交渉
    negotiations?: Array<{
      date: string
      topic: string
      request: string
      response: string
      result: 'accepted' | 'declined' | 'pending'
    }>
  }

  // 全接触履歴
  contactHistory: Array<{
    id: string
    date: string
    type: ContactType
    facility: string
    department?: string

    // 担当者情報
    conductedBy: Array<{
      id: string
      name: string
      role: string
    }>

    // 結果
    result: 'positive' | 'negative' | 'neutral' | 'pending'

    // 評価（面接等の場合）
    evaluation?: {
      overallRating: number // 1-5
      technicalSkills?: number
      communication?: number
      cultureFit?: number
      experience?: number
      potential?: number
      strengths: string[]
      weaknesses: string[]
      recommendation: 'strongly-recommend' | 'recommend' | 'neutral' | 'not-recommend'
    }

    // 詳細メモ
    notes: string

    // 次のアクション
    nextAction?: {
      type: string
      scheduledDate?: string
      assignedTo?: string
    }

    // 内部フラグ
    isConfidential: boolean
  }>

  // タレントプール情報
  talentPoolInfo?: {
    addedDate: string
    addedBy: string
    category: 'future-fit' | 'skill-mismatch' | 'timing-mismatch' | 'location-mismatch' | 'salary-mismatch'
    potentialPositions: string[]
    recontactDate?: string
    priority: 'high' | 'medium' | 'low'
    notes: string
  }

  // リスク・フラグ
  flags: {
    isDuplicate: boolean // 重複応募フラグ
    hasMultipleFacilityApplications: boolean // 複数施設応募
    isPreviousEmployee: boolean // 元職員
    isRehireEligible?: boolean // 再雇用可能
    isBlacklisted: boolean // 採用不可リスト
    blacklistReason?: string
  }

  // メタ情報
  metadata: {
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
    lastViewedAt?: string
    lastViewedBy?: string
    viewCount: number
  }
}

// 施設見学の予約
export interface VisitReservation {
  id: string
  talentId: string
  scheduledDate: string
  scheduledTime: string
  facility: string
  departments: string[]
  visitType: 'individual' | 'group'
  groupId?: string // グループ見学の場合
  coordinator: {
    id: string
    name: string
    department: string
  }
  guides: Array<{
    id: string
    name: string
    department: string
    timeSlot: string
  }>
  agenda: Array<{
    time: string
    activity: string
    location: string
    responsible: string
  }>
  specialRequests?: string
  status: 'confirmed' | 'tentative' | 'cancelled' | 'completed' | 'no-show'
  confirmationSentAt?: string
  reminderSentAt?: string
}

// 人材検索クエリ
export interface TalentSearchQuery {
  // テキスト検索
  keyword?: string

  // ステータスフィルター
  statuses?: TalentStatus[]
  stages?: Array<'visitor' | 'applicant' | 'offer-holder' | 'employee' | 'inactive'>

  // 期間フィルター
  dateRange?: {
    from: string
    to: string
    dateType: 'first-contact' | 'last-contact' | 'visit' | 'application' | 'interview'
  }

  // 施設・部署フィルター
  facilities?: string[]
  departments?: string[]
  positions?: string[]

  // 評価フィルター
  minRating?: number
  recommendation?: Array<'strongly-recommend' | 'recommend' | 'neutral' | 'not-recommend'>

  // スキル・資格フィルター
  requiredQualifications?: string[]
  requiredSkills?: string[]
  experienceYears?: {
    min?: number
    max?: number
  }

  // 給与フィルター
  salaryRange?: {
    min?: number
    max?: number
  }

  // タグフィルター
  tags?: string[]

  // 特殊フィルター
  includeFlags?: {
    duplicates?: boolean
    previousEmployees?: boolean
    talentPool?: boolean
    blacklisted?: boolean
  }

  // ソート
  sortBy?: 'recent-contact' | 'first-contact' | 'rating' | 'name' | 'status'
  sortOrder?: 'asc' | 'desc'

  // ページネーション
  limit?: number
  offset?: number
}

// 重複チェック結果
export interface DuplicateCheckResult {
  isDuplicate: boolean
  matchType: 'exact' | 'likely' | 'possible' | 'none'
  matchedProfiles: Array<{
    id: string
    name: string
    email: string
    phone: string
    lastContact: string
    currentStatus: TalentStatus
    facilities: string[]
    matchReason: string[]
  }>
  suggestions: string[]
}

// パイプライン分析メトリクス
export interface PipelineMetrics {
  // ステージ別人数
  stageDistribution: {
    visitors: number
    applicants: number
    offerHolders: number
    employees: number
    talentPool: number
    inactive: number
  }

  // 転換率
  conversionRates: {
    visitorToApplicant: number
    applicantToInterview: number
    interviewToOffer: number
    offerToEmployee: number
  }

  // 平均所要日数
  averageDuration: {
    visitToApplication: number
    applicationToInterview: number
    interviewToOffer: number
    offerToEmployment: number
  }

  // ソース別効果
  sourceEffectiveness: Array<{
    source: string
    visitors: number
    applicants: number
    hires: number
    conversionRate: number
    averageQuality: number
  }>

  // 施設別状況
  facilityMetrics: Array<{
    facility: string
    activeVisitors: number
    activeApplicants: number
    pendingOffers: number
    monthlyHires: number
  }>

  // トレンド
  monthlyTrends: Array<{
    month: string
    visitors: number
    applications: number
    interviews: number
    offers: number
    hires: number
  }>
}