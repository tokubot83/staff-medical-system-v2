// 教育・研修データサービス層

export interface TrainingProgram {
  id: string
  title: string
  category: string
  description: string
  duration: number
  isRequired: boolean
  targetPositions: string[]
  targetLevel?: string
  instructor?: string
  maxParticipants?: number
  currentParticipants?: number
  startDate?: Date
  endDate?: Date
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

export interface StaffTrainingRecord {
  staffId: string
  programId: string
  completionDate?: Date
  score?: number
  status: 'enrolled' | 'in_progress' | 'completed' | 'failed'
  attendance?: number
  feedback?: string
}

export interface JNACareerLadderProgress {
  staffId: string
  currentLevel: 'I' | 'II' | 'III' | 'IV' | 'V'
  targetLevel: 'I' | 'II' | 'III' | 'IV' | 'V'
  progress: number
  domains: {
    clinical: number
    education: number
    research: number
    management: number
    ethics: number
    social: number
  }
  continuingEducationUnits: number
  requiredUnits: number
}

export interface TrainingStats {
  staffId: string
  totalHours: number
  completedPrograms: number
  upcomingPrograms: number
  averageScore: number
  attendanceRate: number
  lastTrainingDate?: Date
}

// データ取得関数
export async function getTrainingPrograms(filters?: {
  category?: string
  status?: string
  targetPosition?: string
}): Promise<TrainingProgram[]> {
  // TODO: APIエンドポイントから取得
  // 現在はモックデータを返す
  return mockTrainingPrograms
}

export async function getStaffTrainingRecords(staffId: string): Promise<StaffTrainingRecord[]> {
  // TODO: APIエンドポイントから取得
  // 現在はモックデータを返す
  return mockStaffTrainingRecords.filter(record => record.staffId === staffId)
}

export async function getJNACareerLadderProgress(staffId: string): Promise<JNACareerLadderProgress | null> {
  // TODO: APIエンドポイントから取得
  // 現在はモックデータを返す
  return mockJNAProgress.find(progress => progress.staffId === staffId) || null
}

export async function getTrainingStats(staffId: string): Promise<TrainingStats | null> {
  // TODO: APIエンドポイントから取得
  // 現在はモックデータを返す
  return mockTrainingStats.find(stats => stats.staffId === staffId) || null
}

export async function enrollInProgram(staffId: string, programId: string): Promise<boolean> {
  // TODO: APIエンドポイントにPOST
  console.log(`Enrolling staff ${staffId} in program ${programId}`)
  return true
}

export async function updateTrainingRecord(
  staffId: string, 
  programId: string, 
  update: Partial<StaffTrainingRecord>
): Promise<boolean> {
  // TODO: APIエンドポイントにPUT
  console.log(`Updating training record for staff ${staffId}, program ${programId}`, update)
  return true
}

// モックデータ
const mockTrainingPrograms: TrainingProgram[] = [
  {
    id: 'tr001',
    title: '医療安全管理基礎研修',
    category: '必須研修',
    description: '医療安全の基本的な考え方と実践方法を学ぶ',
    duration: 8,
    isRequired: true,
    targetPositions: ['看護師', '医師', '薬剤師'],
    instructor: '医療安全管理室',
    maxParticipants: 30,
    currentParticipants: 25,
    startDate: new Date('2025-02-15'),
    endDate: new Date('2025-02-15'),
    status: 'upcoming'
  },
  {
    id: 'tr002',
    title: 'JNAラダーレベルII認定研修',
    category: '専門研修',
    description: '看護実践能力の向上とリーダーシップスキルの習得',
    duration: 40,
    isRequired: false,
    targetPositions: ['看護師'],
    targetLevel: 'I',
    instructor: '看護部教育委員会',
    maxParticipants: 20,
    currentParticipants: 18,
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-03-31'),
    status: 'upcoming'
  },
  {
    id: 'tr003',
    title: '感染管理実践研修',
    category: '必須研修',
    description: '院内感染予防と感染管理の実践的スキル',
    duration: 6,
    isRequired: true,
    targetPositions: ['看護師', '医師', '薬剤師', '技師'],
    instructor: '感染管理室',
    maxParticipants: 40,
    currentParticipants: 35,
    startDate: new Date('2025-01-20'),
    endDate: new Date('2025-01-20'),
    status: 'completed'
  }
]

const mockStaffTrainingRecords: StaffTrainingRecord[] = [
  {
    staffId: 'NS001',
    programId: 'tr001',
    status: 'enrolled',
    attendance: 0
  },
  {
    staffId: 'NS001',
    programId: 'tr003',
    completionDate: new Date('2025-01-20'),
    score: 92,
    status: 'completed',
    attendance: 100,
    feedback: '実践的な内容で非常に有益でした'
  },
  {
    staffId: 'NS002',
    programId: 'tr002',
    status: 'enrolled',
    attendance: 0
  }
]

const mockJNAProgress: JNACareerLadderProgress[] = [
  {
    staffId: 'NS001',
    currentLevel: 'II',
    targetLevel: 'III',
    progress: 65,
    domains: {
      clinical: 75,
      education: 60,
      research: 55,
      management: 70,
      ethics: 80,
      social: 60
    },
    continuingEducationUnits: 45,
    requiredUnits: 60
  },
  {
    staffId: 'NS002',
    currentLevel: 'I',
    targetLevel: 'II',
    progress: 40,
    domains: {
      clinical: 50,
      education: 35,
      research: 30,
      management: 45,
      ethics: 55,
      social: 40
    },
    continuingEducationUnits: 20,
    requiredUnits: 40
  }
]

const mockTrainingStats: TrainingStats[] = [
  {
    staffId: 'NS001',
    totalHours: 156,
    completedPrograms: 12,
    upcomingPrograms: 3,
    averageScore: 88.5,
    attendanceRate: 95,
    lastTrainingDate: new Date('2025-01-20')
  },
  {
    staffId: 'NS002',
    totalHours: 98,
    completedPrograms: 8,
    upcomingPrograms: 2,
    averageScore: 85.2,
    attendanceRate: 92,
    lastTrainingDate: new Date('2025-01-15')
  }
]