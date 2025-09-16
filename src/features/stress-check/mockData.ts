export interface Campaign {
  id: string
  title: string
  status: 'draft' | 'scheduled' | 'completed'
  scheduledDate: string
  targetDescription: string
  color: string
}

export interface DepartmentStat {
  id: string
  name: string
  total: number
  completed: number
  rate: number
}

export const mockCampaignData: Campaign[] = [
  {
    id: '1',
    title: '実施開始通知',
    status: 'completed',
    scheduledDate: '1月15日 9:00',
    targetDescription: '全職員1,250名',
    color: '#10b981'
  },
  {
    id: '2',
    title: '中間リマインダー',
    status: 'scheduled',
    scheduledDate: '1月24日 9:00',
    targetDescription: '未実施者のみ',
    color: '#f59e0b'
  },
  {
    id: '3',
    title: '締切3日前通知',
    status: 'scheduled',
    scheduledDate: '1月28日 9:00',
    targetDescription: '未実施者のみ（緊急）',
    color: '#ef4444'
  },
  {
    id: '4',
    title: '結果フォローアップ',
    status: 'scheduled',
    scheduledDate: '2月1日 10:00',
    targetDescription: '高ストレス者',
    color: '#7c3aed'
  }
]

export const mockDepartmentStats: DepartmentStat[] = [
  {
    id: '1',
    name: '営業部',
    total: 320,
    completed: 122,
    rate: 38
  },
  {
    id: '2',
    name: '開発部',
    total: 280,
    completed: 182,
    rate: 65
  },
  {
    id: '3',
    name: '管理部',
    total: 150,
    completed: 77,
    rate: 51
  },
  {
    id: '4',
    name: '人事部',
    total: 50,
    completed: 46,
    rate: 92
  },
  {
    id: '5',
    name: '製造部',
    total: 450,
    completed: 125,
    rate: 28
  }
]

export interface NotificationTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'stress_check' | 'interview' | 'general'
}

export const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: '締切リマインダー（標準）',
    subject: '【リマインダー】ストレスチェック未実施のお知らせ',
    body: `ストレスチェックの締切が近づいています。

締切：1月31日（金）23:59
所要時間：約10分

まだ実施されていない方は、お早めにご対応ください。
ご不明な点がございましたら、人事部までお問い合わせください。`,
    type: 'stress_check'
  },
  {
    id: '2',
    name: '締切リマインダー（緊急）',
    subject: '【緊急】ストレスチェック締切間近',
    body: `ストレスチェックの締切まで残り3日となりました。

締切：1月31日（金）23:59
所要時間：約10分

速やかにご対応をお願いいたします。
締切を過ぎると受検できませんのでご注意ください。`,
    type: 'stress_check'
  },
  {
    id: '3',
    name: '高ストレス者フォローアップ',
    subject: '【重要】産業医面談のご案内',
    body: `この度のストレスチェックの結果、高ストレス判定となりました。

産業医による面談を希望される方は、以下よりお申し込みください。
面談は任意ですが、心身の健康維持のためにご活用ください。

面談申込期限：2月15日（金）
面談実施期間：2月20日～3月15日`,
    type: 'stress_check'
  }
]

export interface DistributionMetrics {
  totalEmployees: number
  completed: number
  notStarted: number
  highStress: number
  completionRate: number
  lastUpdated: string
}

export const mockMetrics: DistributionMetrics = {
  totalEmployees: 1250,
  completed: 552,
  notStarted: 698,
  highStress: 124,
  completionRate: 42,
  lastUpdated: '2025-01-20 14:30'
}

export interface TargetingCriteria {
  departments?: string[]
  employmentTypes?: string[]
  completionStatus?: 'not_started' | 'in_progress' | 'completed'
  stressLevel?: 'low' | 'medium' | 'high'
  deadlineDays?: number
}

export interface DistributionHistory {
  id: string
  campaignName: string
  sentAt: string
  targetCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  completedCount: number
}

export const mockDistributionHistory: DistributionHistory[] = [
  {
    id: '1',
    campaignName: '2025年度実施開始通知',
    sentAt: '2025-01-15 09:00',
    targetCount: 1250,
    deliveredCount: 1248,
    openedCount: 892,
    clickedCount: 458,
    completedCount: 412
  },
  {
    id: '2',
    campaignName: '第1回リマインダー',
    sentAt: '2025-01-18 10:00',
    targetCount: 838,
    deliveredCount: 836,
    openedCount: 612,
    clickedCount: 198,
    completedCount: 140
  }
]

export function simulateRealtimeUpdate() {
  const updates = [
    { department: '営業部', change: 1 },
    { department: '開発部', change: 2 },
    { department: '管理部', change: 1 }
  ]

  return updates[Math.floor(Math.random() * updates.length)]
}

export function getMockTargetCount(criteria: TargetingCriteria): number {
  let baseCount = mockMetrics.totalEmployees

  if (criteria.departments && criteria.departments.length > 0) {
    baseCount = Math.floor(baseCount * (criteria.departments.length / 5))
  }

  if (criteria.completionStatus === 'not_started') {
    baseCount = Math.floor(baseCount * 0.56)
  } else if (criteria.completionStatus === 'completed') {
    baseCount = Math.floor(baseCount * 0.44)
  }

  if (criteria.employmentTypes && criteria.employmentTypes.length < 4) {
    baseCount = Math.floor(baseCount * (criteria.employmentTypes.length / 4))
  }

  return baseCount
}