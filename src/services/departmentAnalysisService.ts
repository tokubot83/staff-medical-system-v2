export interface DepartmentMetrics {
  departmentId: string
  departmentName: string
  staffCount: number
  averageScore: number
  evaluationCompletionRate: number
  trainingCompletionRate: number
  turnoverRate: number
  engagementScore: number
  performanceIndicators: {
    productivity: number
    quality: number
    innovation: number
    teamwork: number
    leadership: number
  }
  trends: {
    month: string
    score: number
    trainingHours: number
  }[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

export interface DepartmentComparison {
  metrics: DepartmentMetrics[]
  averages: {
    score: number
    evaluationRate: number
    trainingRate: number
    turnoverRate: number
    engagementScore: number
  }
  rankings: {
    departmentId: string
    departmentName: string
    rank: number
    score: number
    category: string
  }[]
}

class DepartmentAnalysisService {
  private generateMockMetrics(departmentId: string, departmentName: string): DepartmentMetrics {
    const baseScore = 65 + Math.random() * 25
    const staffCount = Math.floor(15 + Math.random() * 35)
    
    const trends = []
    const currentMonth = new Date()
    for (let i = 11; i >= 0; i--) {
      const month = new Date(currentMonth)
      month.setMonth(month.getMonth() - i)
      trends.push({
        month: month.toISOString().slice(0, 7),
        score: baseScore + (Math.random() - 0.5) * 10,
        trainingHours: Math.floor(10 + Math.random() * 30)
      })
    }

    const performanceIndicators = {
      productivity: 60 + Math.random() * 35,
      quality: 60 + Math.random() * 35,
      innovation: 55 + Math.random() * 35,
      teamwork: 65 + Math.random() * 30,
      leadership: 60 + Math.random() * 35
    }

    const strengths = this.generateStrengths(performanceIndicators)
    const weaknesses = this.generateWeaknesses(performanceIndicators)
    const recommendations = this.generateRecommendations(weaknesses, performanceIndicators)

    return {
      departmentId,
      departmentName,
      staffCount,
      averageScore: baseScore,
      evaluationCompletionRate: 70 + Math.random() * 25,
      trainingCompletionRate: 65 + Math.random() * 30,
      turnoverRate: 5 + Math.random() * 10,
      engagementScore: 60 + Math.random() * 35,
      performanceIndicators,
      trends,
      strengths,
      weaknesses,
      recommendations
    }
  }

  private generateStrengths(indicators: DepartmentMetrics['performanceIndicators']): string[] {
    const strengths: string[] = []
    const entries = Object.entries(indicators)
    const sorted = entries.sort((a, b) => b[1] - a[1])
    
    for (let i = 0; i < 2 && i < sorted.length; i++) {
      const [key, value] = sorted[i]
      if (value > 80) {
        switch (key) {
          case 'productivity':
            strengths.push('高い業務効率性と生産性')
            break
          case 'quality':
            strengths.push('優れたケア品質の維持')
            break
          case 'innovation':
            strengths.push('積極的な改善活動と革新')
            break
          case 'teamwork':
            strengths.push('強固なチームワークと協調性')
            break
          case 'leadership':
            strengths.push('優れたリーダーシップの発揮')
            break
        }
      }
    }
    
    if (strengths.length === 0) {
      strengths.push('安定した業務遂行能力')
    }
    
    return strengths
  }

  private generateWeaknesses(indicators: DepartmentMetrics['performanceIndicators']): string[] {
    const weaknesses: string[] = []
    const entries = Object.entries(indicators)
    const sorted = entries.sort((a, b) => a[1] - b[1])
    
    for (let i = 0; i < 2 && i < sorted.length; i++) {
      const [key, value] = sorted[i]
      if (value < 70) {
        switch (key) {
          case 'productivity':
            weaknesses.push('業務効率の改善余地')
            break
          case 'quality':
            weaknesses.push('ケア品質の標準化が必要')
            break
          case 'innovation':
            weaknesses.push('改善活動の活性化が必要')
            break
          case 'teamwork':
            weaknesses.push('チーム連携の強化が必要')
            break
          case 'leadership':
            weaknesses.push('リーダーシップ育成が急務')
            break
        }
      }
    }
    
    return weaknesses
  }

  private generateRecommendations(
    weaknesses: string[], 
    indicators: DepartmentMetrics['performanceIndicators']
  ): string[] {
    const recommendations: string[] = []
    
    if (indicators.productivity < 70) {
      recommendations.push('業務プロセスの見直しと効率化研修の実施')
    }
    if (indicators.quality < 70) {
      recommendations.push('品質管理研修とベストプラクティスの共有強化')
    }
    if (indicators.innovation < 70) {
      recommendations.push('改善提案制度の導入と創造性向上ワークショップ')
    }
    if (indicators.teamwork < 70) {
      recommendations.push('チームビルディング研修と部門間交流の促進')
    }
    if (indicators.leadership < 70) {
      recommendations.push('次世代リーダー育成プログラムの早期導入')
    }
    
    if (recommendations.length === 0) {
      recommendations.push('現状の強みを活かした更なる成長戦略の策定')
      recommendations.push('他部門へのベストプラクティス共有')
    }
    
    recommendations.push('定期的な1on1面談による個別フォローアップ')
    
    return recommendations.slice(0, 3)
  }

  async getDepartmentMetrics(departmentId: string): Promise<DepartmentMetrics> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const departments: Record<string, string> = {
      'dept-1': '内科病棟',
      'dept-2': '外科病棟',
      'dept-3': 'ICU',
      'dept-4': '救急部',
      'dept-5': '小児科',
      'dept-6': '産婦人科',
      'dept-7': 'リハビリテーション科',
      'dept-8': '外来'
    }
    
    const departmentName = departments[departmentId] || '不明な部署'
    return this.generateMockMetrics(departmentId, departmentName)
  }

  async getAllDepartmentsMetrics(): Promise<DepartmentMetrics[]> {
    const departments = [
      'dept-1', 'dept-2', 'dept-3', 'dept-4',
      'dept-5', 'dept-6', 'dept-7', 'dept-8'
    ]
    
    const metrics = await Promise.all(
      departments.map(id => this.getDepartmentMetrics(id))
    )
    
    return metrics
  }

  async getDepartmentComparison(): Promise<DepartmentComparison> {
    const metrics = await this.getAllDepartmentsMetrics()
    
    const averages = {
      score: metrics.reduce((sum, m) => sum + m.averageScore, 0) / metrics.length,
      evaluationRate: metrics.reduce((sum, m) => sum + m.evaluationCompletionRate, 0) / metrics.length,
      trainingRate: metrics.reduce((sum, m) => sum + m.trainingCompletionRate, 0) / metrics.length,
      turnoverRate: metrics.reduce((sum, m) => sum + m.turnoverRate, 0) / metrics.length,
      engagementScore: metrics.reduce((sum, m) => sum + m.engagementScore, 0) / metrics.length
    }
    
    const rankings: DepartmentComparison['rankings'] = []
    
    const categories = [
      { key: 'averageScore', name: '総合評価' },
      { key: 'evaluationCompletionRate', name: '評価完了率' },
      { key: 'trainingCompletionRate', name: '研修受講率' },
      { key: 'engagementScore', name: 'エンゲージメント' }
    ]
    
    categories.forEach(category => {
      const sorted = [...metrics].sort((a, b) => 
        (b[category.key as keyof DepartmentMetrics] as number) - 
        (a[category.key as keyof DepartmentMetrics] as number)
      )
      
      sorted.forEach((dept, index) => {
        rankings.push({
          departmentId: dept.departmentId,
          departmentName: dept.departmentName,
          rank: index + 1,
          score: dept[category.key as keyof DepartmentMetrics] as number,
          category: category.name
        })
      })
    })
    
    return {
      metrics,
      averages,
      rankings
    }
  }

  async generateImprovementPlan(departmentId: string): Promise<{
    shortTerm: string[]
    midTerm: string[]
    longTerm: string[]
    kpis: { name: string; target: number; current: number }[]
  }> {
    const metrics = await this.getDepartmentMetrics(departmentId)
    
    const shortTerm: string[] = []
    const midTerm: string[] = []
    const longTerm: string[] = []
    
    if (metrics.trainingCompletionRate < 80) {
      shortTerm.push('未受講者への個別フォローアップ（1ヶ月以内）')
      shortTerm.push('研修スケジュールの最適化と調整')
    }
    
    if (metrics.evaluationCompletionRate < 85) {
      shortTerm.push('評価未実施者へのリマインダー送信')
      midTerm.push('評価プロセスの簡素化と効率化')
    }
    
    if (metrics.performanceIndicators.teamwork < 75) {
      midTerm.push('チームビルディング研修の実施（3ヶ月計画）')
      midTerm.push('部門間コラボレーションプロジェクトの立ち上げ')
    }
    
    if (metrics.turnoverRate > 10) {
      midTerm.push('離職防止プログラムの導入')
      longTerm.push('キャリアパス明確化と成長機会の拡充')
    }
    
    longTerm.push('次世代リーダー育成プログラム（1年計画）')
    longTerm.push('デジタル化推進による業務効率化')
    
    const kpis = [
      {
        name: '評価完了率',
        target: 95,
        current: Math.round(metrics.evaluationCompletionRate)
      },
      {
        name: '研修受講率',
        target: 90,
        current: Math.round(metrics.trainingCompletionRate)
      },
      {
        name: 'エンゲージメントスコア',
        target: 80,
        current: Math.round(metrics.engagementScore)
      },
      {
        name: '離職率',
        target: 5,
        current: Math.round(metrics.turnoverRate)
      }
    ]
    
    return {
      shortTerm: shortTerm.slice(0, 3),
      midTerm: midTerm.slice(0, 3),
      longTerm: longTerm.slice(0, 2),
      kpis
    }
  }
}

export const departmentAnalysisService = new DepartmentAnalysisService()