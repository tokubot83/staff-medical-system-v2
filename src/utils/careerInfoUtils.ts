// 職歴情報管理のユーティリティ関数

interface CareerInfo {
  joinDate: string
  previousExperience: string
  totalExperience: string
  education: string
  qualifications: string[]
  deploymentHistory: string[]
  lastUpdated?: string
  updatedBy?: string
}

// モックデータストレージ（実際の実装ではデータベースやAPIを使用）
const careerInfoStorage: { [key: string]: CareerInfo } = {}

/**
 * 職員IDから職歴情報を取得
 * @param staffId 職員ID
 * @returns 職歴情報またはnull
 */
export function getCareerInfoByStaffId(staffId: string): CareerInfo | null {
  return careerInfoStorage[staffId] || null
}

/**
 * 職歴情報を保存
 * @param staffId 職員ID
 * @param careerInfo 職歴情報
 */
export function saveCareerInfo(staffId: string, careerInfo: CareerInfo): void {
  careerInfoStorage[staffId] = {
    ...careerInfo,
    lastUpdated: new Date().toLocaleDateString('ja-JP'),
    updatedBy: careerInfo.updatedBy || '人事部'
  }
}

/**
 * 人事評価用に職歴情報を取得（読み取り専用形式）
 * @param staffId 職員ID
 * @returns 職歴情報の要約
 */
export function getCareerInfoForEvaluation(staffId: string): {
  joinDate: string
  experienceYears: string
  currentDepartment: string
  qualifications: string[]
} | null {
  const careerInfo = getCareerInfoByStaffId(staffId)
  if (!careerInfo) return null

  // 最新の配属先を取得
  const latestDeployment = careerInfo.deploymentHistory.length > 0 
    ? careerInfo.deploymentHistory[careerInfo.deploymentHistory.length - 1]
    : ''

  return {
    joinDate: careerInfo.joinDate,
    experienceYears: careerInfo.totalExperience,
    currentDepartment: latestDeployment.split(' ')[1] || '', // "2023.10 ICU配属" から "ICU配属" を抽出
    qualifications: careerInfo.qualifications
  }
}

/**
 * 職歴情報の履歴を取得
 * @param staffId 職員ID
 * @returns 更新履歴の配列
 */
export function getCareerInfoHistory(staffId: string): Array<{
  date: string
  updatedBy: string
  changes: string
}> {
  // 実際の実装では履歴テーブルから取得
  // ここではモックデータを返す
  return [
    {
      date: '2024-01-15',
      updatedBy: '人事部',
      changes: '初回登録'
    }
  ]
}

/**
 * 複数の職員の職歴情報を一括取得
 * @param staffIds 職員IDの配列
 * @returns 職歴情報のマップ
 */
export function getCareerInfoBatch(staffIds: string[]): { [key: string]: CareerInfo | null } {
  const result: { [key: string]: CareerInfo | null } = {}
  staffIds.forEach(id => {
    result[id] = getCareerInfoByStaffId(id)
  })
  return result
}