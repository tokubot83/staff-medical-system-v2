// staffDataの変換ユーティリティ
export interface ExtendedStaffData {
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
  // 追加フィールド
  healthScore: number
  experience: number
  riskLevel: string
}

export function convertStaffData(staff: any): ExtendedStaffData {
  // stressIndexから健康スコアを計算
  const healthScore = staff.stressIndex ? 100 - staff.stressIndex : 75
  
  // tenure（勤続年数）から経験年数を抽出
  const experienceMatch = staff.tenure?.match(/(\d+)年/)
  const experience = experienceMatch ? parseInt(experienceMatch[1]) : 0
  
  // stressIndexとengagementからリスクレベルを計算
  let riskLevel = '低'
  if (staff.stressIndex > 60 || staff.engagement < 60) {
    riskLevel = '高'
  } else if (staff.stressIndex > 40 || staff.engagement < 75) {
    riskLevel = '中'
  }
  
  return {
    ...staff,
    healthScore,
    experience,
    riskLevel
  }
}