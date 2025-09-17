// ストレスチェックサービス
// 労働安全衛生法に基づくストレスチェック結果の管理

export interface StressCheckResult {
  id: string
  userId: string
  userName: string
  department: string
  testDate: string
  completionTime: string

  // 各セクションのスコア
  scores: {
    stressFactors: number      // 仕事のストレス要因 (0-68)
    stressReactions: number    // 心身のストレス反応 (0-116)
    support: number           // 周囲のサポート (0-36)
    satisfaction: number      // 満足度 (0-8)
    total: number            // 合計スコア
    highStress: boolean      // 高ストレス判定
  }

  // 詳細分析
  analysis: {
    workload: 'high' | 'medium' | 'low'
    mentalHealth: 'good' | 'caution' | 'alert'
    supportLevel: 'sufficient' | 'moderate' | 'insufficient'
    riskLevel: 'low' | 'medium' | 'high'
  }

  // 回答データ（暗号化して保存）
  answers: Record<string, number>

  // 医療職者による評価
  medicalAssessment?: {
    assessedBy: string
    assessedDate: string
    recommendation: string
    followUpRequired: boolean
    nextCheckDate?: string
  }

  // プライバシー設定
  privacy: {
    consentToShare: boolean
    sharedWithManager: boolean
    sharedWithHR: boolean
  }
}

export interface DepartmentStressStats {
  department: string
  totalEmployees: number
  completedCount: number
  completionRate: number
  highStressCount: number
  highStressRate: number
  averageScores: {
    stressFactors: number
    stressReactions: number
    support: number
    satisfaction: number
  }
  trends: {
    month: string
    highStressRate: number
  }[]
}

class StressCheckService {
  // ストレスチェック結果の保存
  async saveResult(result: Omit<StressCheckResult, 'id'>): Promise<StressCheckResult> {
    // 暗号化処理
    const encryptedAnswers = this.encryptAnswers(result.answers)

    // APIに送信（実装例）
    const savedResult = {
      id: this.generateId(),
      ...result,
      answers: encryptedAnswers
    }

    // 高ストレス者の場合、自動的にアラートを生成
    if (result.scores.highStress) {
      await this.createHighStressAlert(savedResult)
    }

    // 職員カルテに反映
    await this.updateStaffCard(savedResult)

    return savedResult
  }

  // 個人の結果取得（本人のみ）
  async getPersonalResult(userId: string): Promise<StressCheckResult | null> {
    // 認証チェック
    if (!this.isAuthorizedUser(userId)) {
      throw new Error('Unauthorized access')
    }

    // モックデータ（実際にはAPIから取得）
    return {
      id: 'SC2025-001',
      userId: userId,
      userName: '山田 太郎',
      department: '内科病棟',
      testDate: new Date().toISOString(),
      completionTime: '08:45',
      scores: {
        stressFactors: 42,
        stressReactions: 68,
        support: 18,
        satisfaction: 6,
        total: 110,
        highStress: false
      },
      analysis: {
        workload: 'medium',
        mentalHealth: 'good',
        supportLevel: 'sufficient',
        riskLevel: 'low'
      },
      answers: {},
      privacy: {
        consentToShare: true,
        sharedWithManager: false,
        sharedWithHR: false
      }
    }
  }

  // 部署別集団分析（管理者・産業医のみ）
  async getDepartmentStats(department: string): Promise<DepartmentStressStats> {
    // 権限チェック
    if (!this.hasManagementAccess()) {
      throw new Error('Unauthorized: Management access required')
    }

    // モックデータ
    return {
      department: department,
      totalEmployees: 45,
      completedCount: 38,
      completionRate: 84.4,
      highStressCount: 5,
      highStressRate: 13.2,
      averageScores: {
        stressFactors: 45,
        stressReactions: 72,
        support: 22,
        satisfaction: 5.5
      },
      trends: [
        { month: '2025-04', highStressRate: 15.5 },
        { month: '2025-05', highStressRate: 14.2 },
        { month: '2025-06', highStressRate: 13.8 },
        { month: '2025-07', highStressRate: 13.2 }
      ]
    }
  }

  // 高ストレス者リスト（産業医のみ）
  async getHighStressEmployees(): Promise<StressCheckResult[]> {
    // 産業医権限チェック
    if (!this.isOccupationalPhysician()) {
      throw new Error('Unauthorized: Occupational physician access required')
    }

    // 高ストレス者のみを抽出
    // 実際にはAPIから取得
    return []
  }

  // フォローアップ対象者の抽出
  async getFollowUpTargets(): Promise<{
    urgent: StressCheckResult[]
    recommended: StressCheckResult[]
    monitoring: StressCheckResult[]
  }> {
    const highStressEmployees = await this.getHighStressEmployees()

    return {
      urgent: highStressEmployees.filter(e => e.analysis.riskLevel === 'high'),
      recommended: highStressEmployees.filter(e => e.analysis.riskLevel === 'medium'),
      monitoring: highStressEmployees.filter(e => e.analysis.mentalHealth === 'caution')
    }
  }

  // 職員カルテへの反映
  private async updateStaffCard(result: StressCheckResult): Promise<void> {
    // 職員カルテの健康・ウェルビーイングタブに保存
    const staffCardUpdate = {
      userId: result.userId,
      healthData: {
        stressCheck: {
          latestDate: result.testDate,
          stressLevel: result.analysis.riskLevel,
          mentalHealth: result.analysis.mentalHealth,
          followUpRequired: result.medicalAssessment?.followUpRequired || false
        }
      }
    }

    // APIに送信
    console.log('Updating staff card:', staffCardUpdate)
  }

  // 高ストレスアラートの生成
  private async createHighStressAlert(result: StressCheckResult): Promise<void> {
    const alert = {
      type: 'high_stress',
      userId: result.userId,
      department: result.department,
      date: result.testDate,
      message: '高ストレス判定のため、産業医面談を推奨します',
      priority: 'high',
      targetRoles: ['occupational_physician', 'nurse_manager']
    }

    // 通知サービスに送信
    console.log('Creating high stress alert:', alert)
  }

  // 暗号化処理
  private encryptAnswers(answers: Record<string, number>): Record<string, number> {
    // 実際には適切な暗号化アルゴリズムを使用
    return answers
  }

  // ID生成
  private generateId(): string {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `SC${year}-${random}`
  }

  // 権限チェック（実装例）
  private isAuthorizedUser(userId: string): boolean {
    // 実際の認証ロジック
    return true
  }

  private hasManagementAccess(): boolean {
    // 管理者権限チェック
    return true
  }

  private isOccupationalPhysician(): boolean {
    // 産業医権限チェック
    return true
  }
}

export const stressCheckService = new StressCheckService()