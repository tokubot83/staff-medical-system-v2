// 動的評価シート生成サービス
// 個人評価実行時に職員の条件に応じた評価シートを動的生成

import { Question, selectQuestionsForStaff, generateDynamicQuestion, QuestionBank } from '@/data/questionBank';
import { TrainingIntegrationService, TrainingRecord } from '@/services/trainingIntegrationService';
import { ExperienceLevelsV3 } from '@/types/evaluation-v3';

export interface StaffProfile {
  id: string;
  name: string;
  employeeNumber: string;
  department: string;
  position: string;
  experienceLevel: string;
  jobCategory: string;
  hireDate: Date;
  facilityId: string;
  facilityType: string;
  completedTrainings: string[];
  lastEvaluationScore?: number;
  specialSkills?: string[];
}

export interface DynamicEvaluationSheet {
  id: string;
  staffId: string;
  staffName: string;
  evaluationPeriod: string;
  generatedAt: Date;
  version: string;
  categories: EvaluationCategory[];
  totalPoints: number;
  metadata: {
    experienceLevel: string;
    trainingCompletion: number;
    autoSelectedCount: number;
    templateGeneratedCount: number;
    selectionRationale: string;
  };
}

export interface EvaluationCategory {
  code: string;
  name: string;
  totalPoints: number;
  items: EvaluationItem[];
  type: 'corporate' | 'facility';
}

export interface EvaluationItem {
  id: string;
  questionId: string;
  question: string;
  points: number;
  evaluator: 'superior' | 'self' | 'both';
  source: 'bank' | 'training' | 'template' | 'custom';
  metadata?: {
    requiredTraining?: string;
    difficulty?: string;
    effectiveness?: number;
    autoSelected?: boolean;
    selectionReason?: string;
  };
  evaluation?: {
    superiorScore?: number;
    selfScore?: number;
    finalScore?: number;
    comment?: string;
    evaluatedAt?: Date;
  };
}

export class DynamicSheetGenerationService {
  // 個人評価シートの動的生成
  static async generateEvaluationSheet(
    staff: StaffProfile,
    evaluationPeriod: string,
    designConfig?: any
  ): Promise<DynamicEvaluationSheet> {
    // 職員の研修履歴を取得
    const trainingHistory = await TrainingIntegrationService.getStaffTrainingHistory(staff.id);
    const completedTrainings = trainingHistory
      .filter(t => t.completedDate)
      .map(t => t.trainingId);

    // カテゴリー別に設問を生成
    const categories = await this.generateCategories(
      staff,
      completedTrainings,
      evaluationPeriod,
      designConfig
    );

    // メタデータの計算
    const allItems = categories.flatMap(c => c.items);
    const metadata = {
      experienceLevel: staff.experienceLevel,
      trainingCompletion: this.calculateTrainingCompletion(trainingHistory),
      autoSelectedCount: allItems.filter(i => i.metadata?.autoSelected).length,
      templateGeneratedCount: allItems.filter(i => i.source === 'template').length,
      selectionRationale: this.generateSelectionRationale(staff, categories)
    };

    return {
      id: `eval_${staff.id}_${Date.now()}`,
      staffId: staff.id,
      staffName: staff.name,
      evaluationPeriod,
      generatedAt: new Date(),
      version: 'v3.0',
      categories,
      totalPoints: 100,
      metadata
    };
  }

  // カテゴリー別の設問生成
  private static async generateCategories(
    staff: StaffProfile,
    completedTrainings: string[],
    evaluationPeriod: string,
    designConfig?: any
  ): Promise<EvaluationCategory[]> {
    const categories: EvaluationCategory[] = [];
    const year = new Date().getFullYear();

    // 法人統一項目（30点）
    const corporateCategories = [
      { code: 'C01', name: '専門技術・スキル', points: 10 },
      { code: 'C02', name: '対人関係・ケア', points: 10 },
      { code: 'C03', name: '安全・品質管理', points: 10 }
    ];

    for (const category of corporateCategories) {
      const questions = await this.selectCategoryQuestions(
        staff,
        completedTrainings,
        category.code,
        category.points,
        year
      );

      categories.push({
        code: category.code,
        name: category.name,
        totalPoints: category.points,
        items: questions,
        type: 'corporate'
      });
    }

    // 施設特化項目（20点）
    const facilityQuestions = await this.generateFacilitySpecificQuestions(
      staff,
      completedTrainings,
      20,
      year
    );

    categories.push({
      code: 'F01',
      name: '施設特化項目',
      totalPoints: 20,
      items: facilityQuestions,
      type: 'facility'
    });

    return categories;
  }

  // カテゴリー内の設問選定
  private static async selectCategoryQuestions(
    staff: StaffProfile,
    completedTrainings: string[],
    categoryCode: string,
    totalPoints: number,
    year: number
  ): Promise<EvaluationItem[]> {
    // 必要な設問数を計算（1問1点として）
    const requiredCount = totalPoints;

    // 設問バンクから選定
    const selectedQuestions = selectQuestionsForStaff({
      experienceLevel: staff.experienceLevel,
      completedTrainings,
      facilityType: staff.facilityType,
      jobCategory: staff.jobCategory,
      categoryCode,
      requiredCount,
      year
    });

    // 研修ベースの推奨設問を取得
    const trainingRecommendations = await TrainingIntegrationService.recommendQuestionsBasedOnTraining({
      staffId: staff.id,
      experienceLevel: staff.experienceLevel,
      year,
      categoryCode
    });

    // 設問を評価項目に変換
    const items: EvaluationItem[] = [];
    
    // 研修連動設問を優先的に追加
    for (const questionId of trainingRecommendations.mandatoryQuestions) {
      const question = selectedQuestions.find(q => q.id === questionId);
      if (question && items.length < requiredCount) {
        items.push(this.convertToEvaluationItem(question, 'training'));
      }
    }

    // 残りの設問を追加
    for (const question of selectedQuestions) {
      if (items.length >= requiredCount) break;
      if (!items.find(i => i.questionId === question.id)) {
        items.push(this.convertToEvaluationItem(question, 'bank'));
      }
    }

    // 不足分はテンプレートから生成
    if (items.length < requiredCount) {
      const templateQuestions = await this.generateTemplateQuestions(
        staff,
        categoryCode,
        requiredCount - items.length,
        year
      );
      items.push(...templateQuestions);
    }

    return items;
  }

  // 施設特化設問の生成
  private static async generateFacilitySpecificQuestions(
    staff: StaffProfile,
    completedTrainings: string[],
    totalPoints: number,
    year: number
  ): Promise<EvaluationItem[]> {
    const items: EvaluationItem[] = [];

    // 施設タイプに応じた特化設問を選定
    const facilitySpecificQuestions = QuestionBank.filter(q => {
      return q.facilityTypes?.includes(staff.facilityType) &&
             q.experienceLevels.includes(staff.experienceLevel) &&
             q.jobCategories?.includes(staff.jobCategory);
    });

    // スコアリングして上位を選定
    const scored = facilitySpecificQuestions.map(q => {
      let score = 0;
      
      // 研修完了マッチング
      if (q.requiredTrainings) {
        const hasTraining = q.requiredTrainings.some(t => completedTrainings.includes(t));
        if (hasTraining) score += 30;
      }
      
      // 効果性スコア
      if (q.effectiveness) {
        score += q.effectiveness * 0.5;
      }
      
      // 施設特性への適合度
      score += 20;
      
      return { question: q, score };
    });

    // スコア順にソート
    scored.sort((a, b) => b.score - a.score);

    // 必要数だけ選定
    for (let i = 0; i < Math.min(totalPoints, scored.length); i++) {
      const item = this.convertToEvaluationItem(scored[i].question, 'bank');
      item.metadata = {
        ...item.metadata,
        autoSelected: true,
        selectionReason: `施設特性（${staff.facilityType}）と職種（${staff.jobCategory}）に最適`
      };
      items.push(item);
    }

    // 不足分は動的生成
    if (items.length < totalPoints) {
      const dynamicQuestions = await this.generateDynamicFacilityQuestions(
        staff,
        totalPoints - items.length
      );
      items.push(...dynamicQuestions);
    }

    return items;
  }

  // テンプレートからの設問生成
  private static async generateTemplateQuestions(
    staff: StaffProfile,
    categoryCode: string,
    count: number,
    year: number
  ): Promise<EvaluationItem[]> {
    const items: EvaluationItem[] = [];
    const templates = QuestionBank.filter(q => q.template === true && q.categoryCode === categoryCode);

    for (let i = 0; i < Math.min(count, templates.length); i++) {
      const template = templates[i];
      const variables: Record<string, string> = {
        year: year.toString(),
        training: this.getRecentTrainingName(staff.completedTrainings),
        facility: this.getFacilityName(staff.facilityType),
        specialty: this.getSpecialtyForFacility(staff.facilityType)
      };

      const dynamicQuestion = generateDynamicQuestion(template, variables);
      
      items.push({
        id: `item_${Date.now()}_${i}`,
        questionId: dynamicQuestion.id,
        question: dynamicQuestion.question,
        points: dynamicQuestion.points,
        evaluator: dynamicQuestion.evaluator,
        source: 'template',
        metadata: {
          difficulty: dynamicQuestion.difficulty,
          autoSelected: true,
          selectionReason: 'テンプレートから動的生成'
        }
      });
    }

    return items;
  }

  // 動的な施設特化設問の生成
  private static async generateDynamicFacilityQuestions(
    staff: StaffProfile,
    count: number
  ): Promise<EvaluationItem[]> {
    const items: EvaluationItem[] = [];
    
    const facilityQuestions = [
      {
        acute: [
          '救急対応時のトリアージを適切に実施できているか？',
          '高度医療機器の操作を安全に行えているか？',
          'ICU・CCUでの集中治療看護を実践できているか？'
        ],
        rehab: [
          'リハビリテーション計画の立案に参画できているか？',
          '在宅復帰に向けた家族指導を実施できているか？',
          'ADL向上のための個別プログラムを実践できているか？'
        ],
        elderly: [
          '認知症ケアの専門技術を発揮できているか？',
          '終末期ケアにおいて尊厳を守る支援ができているか？',
          'レクリエーション活動の企画・実施ができているか？'
        ]
      }
    ];

    const questionsForFacility = facilityQuestions[0][staff.facilityType as keyof typeof facilityQuestions[0]] || [];
    
    for (let i = 0; i < Math.min(count, questionsForFacility.length); i++) {
      items.push({
        id: `item_dynamic_${Date.now()}_${i}`,
        questionId: `DQ_${Date.now()}_${i}`,
        question: questionsForFacility[i],
        points: 1,
        evaluator: 'superior',
        source: 'custom',
        metadata: {
          autoSelected: true,
          selectionReason: `${staff.facilityType}施設の特性に基づく動的生成`
        }
      });
    }

    return items;
  }

  // 設問を評価項目に変換
  private static convertToEvaluationItem(question: Question, source: 'bank' | 'training' | 'template' | 'custom'): EvaluationItem {
    return {
      id: `item_${question.id}_${Date.now()}`,
      questionId: question.id,
      question: question.question,
      points: question.points,
      evaluator: question.evaluator,
      source,
      metadata: {
        requiredTraining: question.requiredTrainings?.[0],
        difficulty: question.difficulty,
        effectiveness: question.effectiveness,
        autoSelected: question.autoSelected,
        selectionReason: question.selectionReason
      }
    };
  }

  // 研修完了率の計算
  private static calculateTrainingCompletion(trainingHistory: TrainingRecord[]): number {
    // すべての研修を必須とみなす（実際のデータがないため）
    const required = trainingHistory;
    const completed = required.filter(t => t.completedDate);
    return required.length > 0 ? (completed.length / required.length) * 100 : 0;
  }

  // 選定理由の生成
  private static generateSelectionRationale(staff: StaffProfile, categories: EvaluationCategory[]): string {
    const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
    const autoSelected = categories.flatMap(c => c.items).filter(i => i.metadata?.autoSelected).length;
    const trainingBased = categories.flatMap(c => c.items).filter(i => i.source === 'training').length;
    
    return `${staff.experienceLevel}レベルの${staff.jobCategory}向けに、` +
           `${totalItems}項目を選定。うち${autoSelected}項目は自動選定、` +
           `${trainingBased}項目は研修履歴に基づく推奨項目です。`;
  }

  // ヘルパー関数
  private static getRecentTrainingName(completedTrainings: string[]): string {
    const trainingNames: Record<string, string> = {
      'infection_control': '感染対策',
      'safety_management': '医療安全',
      'personal_info': '個人情報保護',
      'emergency_response': '救急対応',
      'medication_safety': '薬剤安全',
      'ethics': '倫理',
      'leadership': 'リーダーシップ'
    };
    
    const recent = completedTrainings[completedTrainings.length - 1];
    return trainingNames[recent] || '基礎';
  }

  private static getFacilityName(facilityType: string): string {
    const names: Record<string, string> = {
      'acute': '急性期病院',
      'rehab': '回復期リハビリテーション病院',
      'elderly': '介護老人保健施設'
    };
    return names[facilityType] || '医療施設';
  }

  private static getSpecialtyForFacility(facilityType: string): string {
    const specialties: Record<string, string> = {
      'acute': '急性期',
      'rehab': 'リハビリテーション',
      'elderly': '高齢者'
    };
    return specialties[facilityType] || '総合';
  }

  // 評価シートのプレビュー生成
  static async previewEvaluationSheet(
    staff: StaffProfile,
    evaluationPeriod: string
  ): Promise<{
    sheet: DynamicEvaluationSheet;
    statistics: {
      questionSources: Record<string, number>;
      difficultyDistribution: Record<string, number>;
      evaluatorTypes: Record<string, number>;
      trainingCoverage: number;
    };
  }> {
    const sheet = await this.generateEvaluationSheet(staff, evaluationPeriod);
    
    // 統計情報の計算
    const allItems = sheet.categories.flatMap(c => c.items);
    
    const questionSources = allItems.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const difficultyDistribution = allItems.reduce((acc, item) => {
      const difficulty = item.metadata?.difficulty || 'unknown';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const evaluatorTypes = allItems.reduce((acc, item) => {
      acc[item.evaluator] = (acc[item.evaluator] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const trainingRelated = allItems.filter(i => i.metadata?.requiredTraining).length;
    const trainingCoverage = (trainingRelated / allItems.length) * 100;
    
    return {
      sheet,
      statistics: {
        questionSources,
        difficultyDistribution,
        evaluatorTypes,
        trainingCoverage
      }
    };
  }
}