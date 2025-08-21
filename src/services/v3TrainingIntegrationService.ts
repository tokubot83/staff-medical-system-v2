// V3評価システム対応 高度研修連携サービス
// 100点満点制による精密な研修-評価連携システム

import { V3PersonalEvaluation } from '@/types/evaluation-v3';

// V3研修プログラム定義
export interface V3TrainingProgram {
  id: string;
  name: string;
  category: 'technical' | 'contribution' | 'leadership' | 'specialized';
  targetArea: 'coreItems' | 'facilityItems' | 'facilityContribution' | 'corporateContribution';
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
  duration: string;
  expectedImpact: {
    technicalGain: number;
    contributionGain: number;
    area: string;
  };
  prerequisites?: string[];
  requiredLevel: string[];
  roi: number; // 投資対効果指数
}

// 技術評価ギャップ分析結果
export interface TechnicalGap {
  area: 'coreItems' | 'facilityItems';
  currentScore: number;
  targetScore: number;
  gap: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  recommendedTrainings: string[];
}

// 組織貢献度ギャップ分析結果
export interface ContributionGap {
  type: 'facility' | 'corporate' | 'balanced';
  facilityGap: number;
  corporateGap: number;
  recommendedTrainings: string[];
  strategicPriority: number;
}

// 研修推奨結果
export interface TrainingRecommendation {
  trainingId: string;
  priority: number;
  expectedOutcome: {
    scoreIncrease: number;
    gradePromotion?: string;
    timeline: string;
  };
  rationale: string;
}

// 戦略的研修計画
export interface StrategicTrainingPlan {
  staffId: string;
  currentGrade: string;
  targetGrade: string;
  phases: TrainingPhase[];
  totalDuration: string;
  expectedROI: number;
  milestones: Milestone[];
}

export interface TrainingPhase {
  phase: number;
  title: string;
  trainings: string[];
  duration: string;
  expectedScoreIncrease: number;
  focus: string;
}

export interface Milestone {
  date: string;
  targetScore: number;
  evaluationCheckpoint: string;
  successCriteria: string[];
}

// V3研修プログラムマスタ
const v3TrainingPrograms: V3TrainingProgram[] = [
  // 技術評価 - 法人統一項目
  {
    id: 'v3_medical_safety_basic',
    name: '医療安全基礎研修',
    category: 'technical',
    targetArea: 'coreItems',
    difficulty: 'basic',
    duration: '4時間',
    expectedImpact: { technicalGain: 3, contributionGain: 1, area: 'safety' },
    requiredLevel: ['new', 'junior'],
    roi: 1.8
  },
  {
    id: 'v3_medical_safety_advanced',
    name: '医療安全リーダー研修',
    category: 'technical',
    targetArea: 'coreItems',
    difficulty: 'advanced',
    duration: '8時間',
    expectedImpact: { technicalGain: 5, contributionGain: 3, area: 'safety' },
    prerequisites: ['v3_medical_safety_basic'],
    requiredLevel: ['midlevel', 'veteran', 'chief'],
    roi: 2.4
  },
  {
    id: 'v3_infection_control_comprehensive',
    name: '感染制御包括研修',
    category: 'technical',
    targetArea: 'coreItems',
    difficulty: 'intermediate',
    duration: '6時間',
    expectedImpact: { technicalGain: 4, contributionGain: 2, area: 'infection_control' },
    requiredLevel: ['junior', 'midlevel', 'veteran'],
    roi: 2.1
  },
  
  // 技術評価 - 施設固有項目
  {
    id: 'v3_emergency_response_acute',
    name: '急性期救急対応研修',
    category: 'specialized',
    targetArea: 'facilityItems',
    difficulty: 'advanced',
    duration: '12時間',
    expectedImpact: { technicalGain: 6, contributionGain: 2, area: 'emergency' },
    requiredLevel: ['midlevel', 'veteran', 'chief'],
    roi: 2.8
  },
  {
    id: 'v3_dementia_care_chronic',
    name: '認知症ケア専門研修',
    category: 'specialized',
    targetArea: 'facilityItems',
    difficulty: 'intermediate',
    duration: '8時間',
    expectedImpact: { technicalGain: 5, contributionGain: 3, area: 'dementia_care' },
    requiredLevel: ['junior', 'midlevel', 'veteran'],
    roi: 2.3
  },
  
  // 組織貢献度向上
  {
    id: 'v3_team_leadership',
    name: 'チームリーダーシップ研修',
    category: 'leadership',
    targetArea: 'facilityContribution',
    difficulty: 'advanced',
    duration: '16時間',
    expectedImpact: { technicalGain: 1, contributionGain: 8, area: 'leadership' },
    requiredLevel: ['midlevel', 'veteran', 'chief'],
    roi: 3.2
  },
  {
    id: 'v3_corporate_strategy',
    name: '法人戦略理解研修',
    category: 'contribution',
    targetArea: 'corporateContribution',
    difficulty: 'intermediate',
    duration: '8時間',
    expectedImpact: { technicalGain: 0, contributionGain: 6, area: 'corporate_vision' },
    requiredLevel: ['midlevel', 'veteran', 'chief', 'manager'],
    roi: 2.7
  },
  {
    id: 'v3_cross_facility_collaboration',
    name: '施設間連携推進研修',
    category: 'contribution',
    targetArea: 'corporateContribution',
    difficulty: 'advanced',
    duration: '12時間',
    expectedImpact: { technicalGain: 1, contributionGain: 7, area: 'collaboration' },
    requiredLevel: ['veteran', 'chief', 'manager'],
    roi: 3.0
  },
  
  // 高度専門研修
  {
    id: 'v3_mentoring_skills',
    name: '後進指導スキル研修',
    category: 'leadership',
    targetArea: 'facilityContribution',
    difficulty: 'expert',
    duration: '20時間',
    expectedImpact: { technicalGain: 2, contributionGain: 10, area: 'mentoring' },
    prerequisites: ['v3_team_leadership'],
    requiredLevel: ['veteran', 'chief', 'manager'],
    roi: 3.5
  }
];

// V3研修連携サービス
export class V3TrainingIntegrationService {
  
  // 技術評価ギャップ分析
  static analyzeTechnicalGaps(
    currentEvaluation: V3PersonalEvaluation,
    targetLevel: string
  ): TechnicalGap[] {
    const gaps: TechnicalGap[] = [];
    
    // 法人統一項目のギャップ分析
    const coreTarget = this.getTargetScore('coreItems', targetLevel);
    const coreGap = Math.max(0, coreTarget - currentEvaluation.technicalScore.coreItems);
    
    if (coreGap > 0) {
      gaps.push({
        area: 'coreItems',
        currentScore: currentEvaluation.technicalScore.coreItems,
        targetScore: coreTarget,
        gap: coreGap,
        priority: coreGap >= 8 ? 'urgent' : coreGap >= 5 ? 'high' : 'medium',
        recommendedTrainings: this.getTrainingsForArea('coreItems', coreGap)
      });
    }
    
    // 施設固有項目のギャップ分析
    const facilityTarget = this.getTargetScore('facilityItems', targetLevel);
    const facilityGap = Math.max(0, facilityTarget - currentEvaluation.technicalScore.facilityItems);
    
    if (facilityGap > 0) {
      gaps.push({
        area: 'facilityItems',
        currentScore: currentEvaluation.technicalScore.facilityItems,
        targetScore: facilityTarget,
        gap: facilityGap,
        priority: facilityGap >= 6 ? 'urgent' : facilityGap >= 3 ? 'high' : 'medium',
        recommendedTrainings: this.getTrainingsForArea('facilityItems', facilityGap)
      });
    }
    
    return gaps;
  }
  
  // 組織貢献度ギャップ分析
  static analyzeContributionGaps(
    currentEvaluation: V3PersonalEvaluation,
    targetLevel: string
  ): ContributionGap {
    const facilityTarget = this.getTargetScore('facility', targetLevel);
    const corporateTarget = this.getTargetScore('corporate', targetLevel);
    
    const facilityGap = Math.max(0, facilityTarget - currentEvaluation.contributionScore.facility);
    const corporateGap = Math.max(0, corporateTarget - currentEvaluation.contributionScore.corporate);
    
    let type: 'facility' | 'corporate' | 'balanced';
    let strategicPriority: number;
    
    if (facilityGap > corporateGap + 3) {
      type = 'facility';
      strategicPriority = facilityGap * 1.2;
    } else if (corporateGap > facilityGap + 3) {
      type = 'corporate';
      strategicPriority = corporateGap * 1.3; // 法人貢献をより重視
    } else {
      type = 'balanced';
      strategicPriority = (facilityGap + corporateGap) * 0.8;
    }
    
    return {
      type,
      facilityGap,
      corporateGap,
      recommendedTrainings: this.getContributionTrainings(type, facilityGap, corporateGap),
      strategicPriority
    };
  }
  
  // 総合研修推奨
  static async generateComprehensiveRecommendations(
    currentEvaluation: V3PersonalEvaluation,
    experienceLevel: string,
    targetGrade?: string
  ): Promise<TrainingRecommendation[]> {
    const recommendations: TrainingRecommendation[] = [];
    
    // 目標レベル設定（未指定の場合は現在より1段階上）
    const target = targetGrade || this.getNextGradeTarget(currentEvaluation.grade);
    
    // 技術評価ギャップから推奨研修を生成
    const technicalGaps = this.analyzeTechnicalGaps(currentEvaluation, target);
    for (const gap of technicalGaps) {
      for (const trainingId of gap.recommendedTrainings) {
        const training = v3TrainingPrograms.find(t => t.id === trainingId);
        if (training && training.requiredLevel.includes(experienceLevel)) {
          recommendations.push({
            trainingId,
            priority: this.calculatePriority(gap.priority, training.roi),
            expectedOutcome: {
              scoreIncrease: training.expectedImpact.technicalGain,
              gradePromotion: this.predictGradeChange(currentEvaluation, training),
              timeline: this.calculateTimeline(training.duration)
            },
            rationale: `${gap.area}で${gap.gap}点のギャップを改善`
          });
        }
      }
    }
    
    // 組織貢献度ギャップから推奨研修を生成
    const contributionGap = this.analyzeContributionGaps(currentEvaluation, target);
    for (const trainingId of contributionGap.recommendedTrainings) {
      const training = v3TrainingPrograms.find(t => t.id === trainingId);
      if (training && training.requiredLevel.includes(experienceLevel)) {
        recommendations.push({
          trainingId,
          priority: this.calculatePriority('high', training.roi),
          expectedOutcome: {
            scoreIncrease: training.expectedImpact.contributionGain,
            timeline: this.calculateTimeline(training.duration)
          },
          rationale: `${contributionGap.type}貢献度向上のため`
        });
      }
    }
    
    // 優先度順にソート
    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }
  
  // 戦略的研修計画生成
  static async generateStrategicPlan(
    currentEvaluation: V3PersonalEvaluation,
    targetGrade: string,
    timeframeMonths: number = 12
  ): Promise<StrategicTrainingPlan> {
    const phases: TrainingPhase[] = [];
    const milestones: Milestone[] = [];
    
    const currentScore = currentEvaluation.totalScore;
    const targetScore = this.getTargetScoreForGrade(targetGrade);
    const totalGap = targetScore - currentScore;
    
    if (totalGap <= 0) {
      // 既に目標達成済み
      return {
        staffId: currentEvaluation.staffId,
        currentGrade: currentEvaluation.grade,
        targetGrade,
        phases: [],
        totalDuration: '0ヶ月',
        expectedROI: 0,
        milestones: []
      };
    }
    
    // フェーズ分割（3段階）
    const phaseGap = Math.ceil(totalGap / 3);
    
    // Phase 1: 基礎強化
    const phase1Trainings = this.selectPhaseTrainings(currentEvaluation, 'basic', phaseGap);
    phases.push({
      phase: 1,
      title: '基礎力強化フェーズ',
      trainings: phase1Trainings.map(t => t.id),
      duration: `${Math.ceil(timeframeMonths / 3)}ヶ月`,
      expectedScoreIncrease: phaseGap,
      focus: '技術基盤の確立'
    });
    
    // Phase 2: 専門性向上
    const phase2Trainings = this.selectPhaseTrainings(currentEvaluation, 'intermediate', phaseGap);
    phases.push({
      phase: 2,
      title: '専門性向上フェーズ',
      trainings: phase2Trainings.map(t => t.id),
      duration: `${Math.ceil(timeframeMonths / 3)}ヶ月`,
      expectedScoreIncrease: phaseGap,
      focus: '専門技術とリーダーシップの発展'
    });
    
    // Phase 3: リーダーシップ発揮
    const phase3Trainings = this.selectPhaseTrainings(currentEvaluation, 'advanced', phaseGap);
    phases.push({
      phase: 3,
      title: 'リーダーシップ発揮フェーズ',
      trainings: phase3Trainings.map(t => t.id),
      duration: `${Math.ceil(timeframeMonths / 3)}ヶ月`,
      expectedScoreIncrease: phaseGap,
      focus: '組織貢献とメンタリング'
    });
    
    // マイルストーン設定
    for (let i = 1; i <= 3; i++) {
      const milestoneDate = new Date();
      milestoneDate.setMonth(milestoneDate.getMonth() + (timeframeMonths / 3) * i);
      
      milestones.push({
        date: milestoneDate.toISOString().split('T')[0],
        targetScore: currentScore + (phaseGap * i),
        evaluationCheckpoint: `Phase ${i} 完了評価`,
        successCriteria: [
          `技術評価: ${currentEvaluation.technicalScore.total + (phaseGap * i * 0.6)}点以上`,
          `組織貢献度: ${currentEvaluation.contributionScore.total + (phaseGap * i * 0.4)}点以上`
        ]
      });
    }
    
    const allTrainings = [...phase1Trainings, ...phase2Trainings, ...phase3Trainings];
    const expectedROI = allTrainings.reduce((sum, t) => sum + t.roi, 0) / allTrainings.length;
    
    return {
      staffId: currentEvaluation.staffId,
      currentGrade: currentEvaluation.grade,
      targetGrade,
      phases,
      totalDuration: `${timeframeMonths}ヶ月`,
      expectedROI,
      milestones
    };
  }
  
  // ヘルパーメソッド
  private static getTargetScore(area: string, level: string): number {
    const targets: Record<string, Record<string, number>> = {
      coreItems: { junior: 20, midlevel: 25, veteran: 28, chief: 30 },
      facilityItems: { junior: 12, midlevel: 16, veteran: 18, chief: 20 },
      facility: { junior: 18, midlevel: 22, veteran: 24, chief: 25 },
      corporate: { junior: 15, midlevel: 20, veteran: 23, chief: 25 }
    };
    return targets[area]?.[level] || 0;
  }
  
  private static getTrainingsForArea(area: string, gap: number): string[] {
    const trainings = v3TrainingPrograms
      .filter(t => t.targetArea === area)
      .sort((a, b) => b.expectedImpact.technicalGain - a.expectedImpact.technicalGain);
    
    const result: string[] = [];
    let remainingGap = gap;
    
    for (const training of trainings) {
      if (remainingGap <= 0) break;
      result.push(training.id);
      remainingGap -= training.expectedImpact.technicalGain;
    }
    
    return result;
  }
  
  private static getContributionTrainings(
    type: 'facility' | 'corporate' | 'balanced',
    facilityGap: number,
    corporateGap: number
  ): string[] {
    if (type === 'facility') {
      return v3TrainingPrograms
        .filter(t => t.targetArea === 'facilityContribution')
        .sort((a, b) => b.expectedImpact.contributionGain - a.expectedImpact.contributionGain)
        .slice(0, 2)
        .map(t => t.id);
    } else if (type === 'corporate') {
      return v3TrainingPrograms
        .filter(t => t.targetArea === 'corporateContribution')
        .sort((a, b) => b.expectedImpact.contributionGain - a.expectedImpact.contributionGain)
        .slice(0, 2)
        .map(t => t.id);
    } else {
      return [
        ...v3TrainingPrograms.filter(t => t.targetArea === 'facilityContribution').slice(0, 1),
        ...v3TrainingPrograms.filter(t => t.targetArea === 'corporateContribution').slice(0, 1)
      ].map(t => t.id);
    }
  }
  
  private static calculatePriority(gapPriority: string, roi: number): number {
    const baseScore = {
      urgent: 100,
      high: 80,
      medium: 60,
      low: 40
    }[gapPriority] || 50;
    
    return baseScore + (roi * 10);
  }
  
  private static predictGradeChange(
    current: V3PersonalEvaluation,
    training: V3TrainingProgram
  ): string | undefined {
    const newScore = current.totalScore + 
      training.expectedImpact.technicalGain + 
      training.expectedImpact.contributionGain;
    
    if (newScore >= 95) return 'S+';
    if (newScore >= 90) return 'S';
    if (newScore >= 85) return 'A+';
    if (newScore >= 80) return 'A';
    if (newScore >= 70) return 'B';
    return undefined;
  }
  
  private static calculateTimeline(duration: string): string {
    const hours = parseInt(duration);
    if (hours <= 8) return '1-2週間';
    if (hours <= 16) return '3-4週間';
    return '1-2ヶ月';
  }
  
  private static getNextGradeTarget(currentGrade: string): string {
    const gradeProgression: Record<string, string> = {
      'D': 'C',
      'C': 'B', 
      'B': 'A',
      'A': 'A+',
      'A+': 'S',
      'S': 'S+',
      'S+': 'S+'
    };
    return gradeProgression[currentGrade] || 'A';
  }
  
  private static getTargetScoreForGrade(grade: string): number {
    const gradeScores: Record<string, number> = {
      'S+': 95,
      'S': 90,
      'A+': 85,
      'A': 80,
      'B': 70,
      'C': 60,
      'D': 50
    };
    return gradeScores[grade] || 80;
  }
  
  private static selectPhaseTrainings(
    current: V3PersonalEvaluation,
    difficulty: string,
    targetGap: number
  ): V3TrainingProgram[] {
    return v3TrainingPrograms
      .filter(t => t.difficulty === difficulty)
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 3);
  }
  
  // 研修プログラム取得
  static getTrainingProgram(trainingId: string): V3TrainingProgram | undefined {
    return v3TrainingPrograms.find(t => t.id === trainingId);
  }
  
  // 全研修プログラム取得
  static getAllTrainingPrograms(): V3TrainingProgram[] {
    return v3TrainingPrograms;
  }
}