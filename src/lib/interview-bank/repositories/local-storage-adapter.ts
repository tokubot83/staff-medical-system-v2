/**
 * LocalStorageアダプター - 開発環境用のデータ永続化実装
 * ブラウザのLocalStorageを使用してデータを保存
 */

import {
  InterviewBankRepository,
  QuestionBankEntry,
  SectionDefinitionEntry,
  StatsCriteria,
  InterviewStatistics
} from './bank-repository';

import {
  BankInterviewResult,
  InterviewType,
  MotivationType,
  BankQuestion,
  BankSection,
  StaffBankProfile
} from '../types';

// LocalStorageのキー定義
const STORAGE_KEYS = {
  INTERVIEW_RESULTS: 'interview_bank_results',
  STAFF_PROFILES: 'interview_bank_profiles',
  QUESTIONS: 'interview_bank_questions',
  SECTIONS: 'interview_bank_sections',
  QUESTION_USAGE: 'interview_bank_question_usage',
  TRANSACTION: 'interview_bank_transaction'
} as const;

export class LocalStorageAdapter implements InterviewBankRepository {
  private transactionData: Map<string, any> | null = null;
  
  constructor() {
    // LocalStorageが利用可能か確認
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('LocalStorage is not available. Data will not persist.');
    }
    this.initializeStorage();
  }
  
  private initializeStorage(): void {
    // 初期化時に必要なキーが存在しない場合は作成
    Object.values(STORAGE_KEYS).forEach(key => {
      if (!this.getStorageItem(key)) {
        this.setStorageItem(key, {});
      }
    });
  }
  
  // === ストレージ操作のヘルパーメソッド ===
  
  private getStorageItem(key: string): any {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  }
  
  private setStorageItem(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      // トランザクション中の場合はトランザクションデータに保存
      if (this.transactionData) {
        this.transactionData.set(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Failed to set item in localStorage: ${key}`, error);
      // ストレージが満杯の場合は古いデータを削除
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanupOldData();
        // リトライ
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (retryError) {
          console.error('Failed to save after cleanup', retryError);
        }
      }
    }
  }
  
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // === 面談結果の管理 ===
  
  async saveInterviewResult(result: BankInterviewResult): Promise<string> {
    const id = result.id || this.generateId('result');
    const results = this.getStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS) || {};
    
    const savedResult: BankInterviewResult = {
      ...result,
      id,
      createdAt: result.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    results[id] = savedResult;
    this.setStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS, results);
    
    // 質問使用回数を記録
    if (result.responses) {
      for (const response of result.responses) {
        await this.recordQuestionUsage(response.questionId, id);
      }
    }
    
    return id;
  }
  
  async updateInterviewResult(id: string, updates: Partial<BankInterviewResult>): Promise<void> {
    const results = this.getStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS) || {};
    
    if (!results[id]) {
      throw new Error(`Interview result not found: ${id}`);
    }
    
    results[id] = {
      ...results[id],
      ...updates,
      updatedAt: new Date()
    };
    
    this.setStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS, results);
  }
  
  async getInterviewResult(id: string): Promise<BankInterviewResult | null> {
    const results = this.getStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS) || {};
    return results[id] || null;
  }
  
  async getInterviewHistory(staffId: string, type?: InterviewType): Promise<BankInterviewResult[]> {
    const results = this.getStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS) || {};
    
    return Object.values(results)
      .filter((result: BankInterviewResult) => {
        const matchesStaff = result.staffProfile.id === staffId;
        const matchesType = !type || result.interviewType === type;
        return matchesStaff && matchesType;
      })
      .sort((a: BankInterviewResult, b: BankInterviewResult) => 
        new Date(b.conductedAt).getTime() - new Date(a.conductedAt).getTime()
      );
  }
  
  async getLatestInterview(staffId: string, type?: InterviewType): Promise<BankInterviewResult | null> {
    const history = await this.getInterviewHistory(staffId, type);
    return history[0] || null;
  }
  
  // === 職員プロファイル管理 ===
  
  async saveStaffProfile(profile: StaffBankProfile): Promise<void> {
    const profiles = this.getStorageItem(STORAGE_KEYS.STAFF_PROFILES) || {};
    profiles[profile.id] = {
      ...profile,
      updatedAt: new Date()
    };
    this.setStorageItem(STORAGE_KEYS.STAFF_PROFILES, profiles);
  }
  
  async getStaffProfile(staffId: string): Promise<StaffBankProfile | null> {
    const profiles = this.getStorageItem(STORAGE_KEYS.STAFF_PROFILES) || {};
    return profiles[staffId] || null;
  }
  
  async updateMotivationType(staffId: string, type: MotivationType, confidence?: number): Promise<void> {
    const profile = await this.getStaffProfile(staffId);
    
    if (profile) {
      profile.motivationType = type;
      if (confidence !== undefined) {
        profile.motivationConfidence = confidence;
      }
      await this.saveStaffProfile(profile);
    }
  }
  
  // === 質問バンク管理 ===
  
  async addQuestion(question: BankQuestion, tags: string[] = []): Promise<string> {
    const id = this.generateId('question');
    const questions = this.getStorageItem(STORAGE_KEYS.QUESTIONS) || {};
    
    const entry: QuestionBankEntry = {
      id,
      question,
      usageCount: 0,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      isActive: true
    };
    
    questions[id] = entry;
    this.setStorageItem(STORAGE_KEYS.QUESTIONS, questions);
    
    return id;
  }
  
  async updateQuestion(id: string, updates: Partial<BankQuestion>): Promise<void> {
    const questions = this.getStorageItem(STORAGE_KEYS.QUESTIONS) || {};
    
    if (!questions[id]) {
      throw new Error(`Question not found: ${id}`);
    }
    
    questions[id].question = {
      ...questions[id].question,
      ...updates
    };
    questions[id].updatedAt = new Date();
    
    this.setStorageItem(STORAGE_KEYS.QUESTIONS, questions);
  }
  
  async deleteQuestion(id: string): Promise<void> {
    const questions = this.getStorageItem(STORAGE_KEYS.QUESTIONS) || {};
    
    if (questions[id]) {
      questions[id].isActive = false;
      questions[id].updatedAt = new Date();
      this.setStorageItem(STORAGE_KEYS.QUESTIONS, questions);
    }
  }
  
  async searchQuestions(criteria: {
    category?: string;
    experienceLevel?: string;
    position?: string;
    tags?: string[];
    isActive?: boolean;
  }): Promise<QuestionBankEntry[]> {
    const questions = this.getStorageItem(STORAGE_KEYS.QUESTIONS) || {};
    
    return Object.values(questions).filter((entry: QuestionBankEntry) => {
      if (criteria.isActive !== undefined && entry.isActive !== criteria.isActive) {
        return false;
      }
      
      if (criteria.category && entry.question.category !== criteria.category) {
        return false;
      }
      
      if (criteria.experienceLevel && 
          entry.question.targetExperience && 
          !entry.question.targetExperience.includes(criteria.experienceLevel)) {
        return false;
      }
      
      if (criteria.position && 
          entry.question.targetPosition && 
          !entry.question.targetPosition.includes(criteria.position)) {
        return false;
      }
      
      if (criteria.tags && criteria.tags.length > 0) {
        const hasAllTags = criteria.tags.every(tag => entry.tags.includes(tag));
        if (!hasAllTags) return false;
      }
      
      return true;
    });
  }
  
  async recordQuestionUsage(questionId: string, interviewId: string): Promise<void> {
    const questions = this.getStorageItem(STORAGE_KEYS.QUESTIONS) || {};
    const usage = this.getStorageItem(STORAGE_KEYS.QUESTION_USAGE) || {};
    
    // 質問の使用回数を増やす
    if (questions[questionId]) {
      questions[questionId].usageCount++;
      questions[questionId].lastUsed = new Date();
      this.setStorageItem(STORAGE_KEYS.QUESTIONS, questions);
    }
    
    // 使用履歴を記録
    if (!usage[questionId]) {
      usage[questionId] = [];
    }
    usage[questionId].push({
      interviewId,
      usedAt: new Date()
    });
    this.setStorageItem(STORAGE_KEYS.QUESTION_USAGE, usage);
  }
  
  // === セクション定義管理 ===
  
  async addSectionDefinition(
    section: BankSection,
    applicableTo: SectionDefinitionEntry['applicableTo']
  ): Promise<string> {
    const id = this.generateId('section');
    const sections = this.getStorageItem(STORAGE_KEYS.SECTIONS) || {};
    
    const entry: SectionDefinitionEntry = {
      id,
      section,
      applicableTo,
      priority: 1,
      isRequired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      isActive: true
    };
    
    sections[id] = entry;
    this.setStorageItem(STORAGE_KEYS.SECTIONS, sections);
    
    return id;
  }
  
  async updateSectionDefinition(
    id: string,
    updates: Partial<SectionDefinitionEntry>
  ): Promise<void> {
    const sections = this.getStorageItem(STORAGE_KEYS.SECTIONS) || {};
    
    if (!sections[id]) {
      throw new Error(`Section not found: ${id}`);
    }
    
    sections[id] = {
      ...sections[id],
      ...updates,
      updatedAt: new Date()
    };
    
    this.setStorageItem(STORAGE_KEYS.SECTIONS, sections);
  }
  
  async getSectionDefinitions(criteria: {
    experienceLevel?: string;
    position?: string;
    facilityType?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<SectionDefinitionEntry[]> {
    const sections = this.getStorageItem(STORAGE_KEYS.SECTIONS) || {};
    
    return Object.values(sections)
      .filter((entry: SectionDefinitionEntry) => {
        if (criteria.isActive !== undefined && entry.isActive !== criteria.isActive) {
          return false;
        }
        
        const applicableTo = entry.applicableTo;
        
        if (criteria.experienceLevel && 
            applicableTo.experienceLevels && 
            !applicableTo.experienceLevels.includes(criteria.experienceLevel)) {
          return false;
        }
        
        if (criteria.position && 
            applicableTo.positions && 
            !applicableTo.positions.includes(criteria.position)) {
          return false;
        }
        
        if (criteria.facilityType && 
            applicableTo.facilityTypes && 
            !applicableTo.facilityTypes.includes(criteria.facilityType)) {
          return false;
        }
        
        if (criteria.department && 
            applicableTo.departments && 
            !applicableTo.departments.includes(criteria.department)) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => b.priority - a.priority);
  }
  
  // === 統計・分析 ===
  
  async getStatistics(criteria: StatsCriteria): Promise<InterviewStatistics> {
    const results = this.getStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS) || {};
    const filteredResults = this.filterResultsByCriteria(Object.values(results), criteria);
    
    // 動機タイプ別集計
    const byMotivationType: Record<MotivationType, number> = {
      growth: 0,
      recognition: 0,
      stability: 0,
      teamwork: 0,
      efficiency: 0,
      compensation: 0,
      creativity: 0
    };
    
    // 経験レベル別集計
    const byExperienceLevel: Record<string, number> = {};
    
    // 役職別集計
    const byPosition: Record<string, number> = {};
    
    // 課題カテゴリ集計
    const challengeCategories: Record<string, number> = {};
    
    let totalDuration = 0;
    let totalCompletionRate = 0;
    let completedCount = 0;
    
    filteredResults.forEach((result: BankInterviewResult) => {
      // 動機タイプ集計
      if (result.staffProfile.motivationType) {
        byMotivationType[result.staffProfile.motivationType]++;
      }
      
      // 経験レベル集計
      const expLevel = result.staffProfile.experienceLevel;
      byExperienceLevel[expLevel] = (byExperienceLevel[expLevel] || 0) + 1;
      
      // 役職集計
      const position = result.staffProfile.position || '未設定';
      byPosition[position] = (byPosition[position] || 0) + 1;
      
      // 完了状況集計
      if (result.completionRate === 100) {
        completedCount++;
      }
      totalDuration += result.duration || 0;
      totalCompletionRate += result.completionRate || 0;
      
      // 課題集計
      result.responses?.forEach(response => {
        if (response.answer && response.answer.includes('課題')) {
          const category = response.category || 'その他';
          challengeCategories[category] = (challengeCategories[category] || 0) + 1;
        }
      });
    });
    
    const totalCount = filteredResults.length;
    
    // トップ課題の計算
    const topChallenges = Object.entries(challengeCategories)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // トレンドデータの生成（簡易版）
    const trendData = this.generateTrendData(filteredResults);
    
    return {
      totalCount,
      completedCount,
      averageDuration: totalCount > 0 ? totalDuration / totalCount : 0,
      averageCompletionRate: totalCount > 0 ? totalCompletionRate / totalCount : 0,
      byMotivationType,
      byExperienceLevel,
      byPosition,
      topChallenges,
      trendData
    };
  }
  
  async getCompletionRate(staffId: string, period: number = 30): Promise<number> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    
    const history = await this.getInterviewHistory(staffId);
    const recentInterviews = history.filter(result => 
      new Date(result.conductedAt) >= startDate && 
      new Date(result.conductedAt) <= endDate
    );
    
    if (recentInterviews.length === 0) return 0;
    
    const totalCompletion = recentInterviews.reduce((sum, result) => 
      sum + (result.completionRate || 0), 0
    );
    
    return totalCompletion / recentInterviews.length;
  }
  
  async getDepartmentStats(
    departmentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalStaff: number;
    interviewedStaff: number;
    completedInterviews: number;
    averageCompletionRate: number;
  }> {
    const results = this.getStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS) || {};
    const profiles = this.getStorageItem(STORAGE_KEYS.STAFF_PROFILES) || {};
    
    // 部署の職員数を取得
    const departmentStaff = Object.values(profiles).filter(
      (profile: StaffBankProfile) => profile.department === departmentId
    );
    const totalStaff = departmentStaff.length;
    
    // 期間内の面談結果をフィルタリング
    const departmentResults = Object.values(results).filter((result: BankInterviewResult) => {
      const conductedDate = new Date(result.conductedAt);
      return result.staffProfile.department === departmentId &&
             conductedDate >= startDate &&
             conductedDate <= endDate;
    });
    
    // 面談を受けた職員の数をカウント
    const interviewedStaffIds = new Set(
      departmentResults.map((r: BankInterviewResult) => r.staffProfile.id)
    );
    const interviewedStaff = interviewedStaffIds.size;
    
    // 完了した面談数
    const completedInterviews = departmentResults.filter(
      (r: BankInterviewResult) => r.completionRate === 100
    ).length;
    
    // 平均完了率
    const totalCompletionRate = departmentResults.reduce(
      (sum, r: BankInterviewResult) => sum + (r.completionRate || 0), 0
    );
    const averageCompletionRate = departmentResults.length > 0 
      ? totalCompletionRate / departmentResults.length 
      : 0;
    
    return {
      totalStaff,
      interviewedStaff,
      completedInterviews,
      averageCompletionRate
    };
  }
  
  // === バックアップ・復元 ===
  
  async exportData(options?: {
    includeResults?: boolean;
    includeProfiles?: boolean;
    includeQuestions?: boolean;
    includeSections?: boolean;
  }): Promise<string> {
    const exportOptions = {
      includeResults: true,
      includeProfiles: true,
      includeQuestions: true,
      includeSections: true,
      ...options
    };
    
    const data: any = {
      version: '1.0.0',
      exportedAt: new Date(),
      data: {}
    };
    
    if (exportOptions.includeResults) {
      data.data.results = this.getStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS) || {};
    }
    
    if (exportOptions.includeProfiles) {
      data.data.profiles = this.getStorageItem(STORAGE_KEYS.STAFF_PROFILES) || {};
    }
    
    if (exportOptions.includeQuestions) {
      data.data.questions = this.getStorageItem(STORAGE_KEYS.QUESTIONS) || {};
    }
    
    if (exportOptions.includeSections) {
      data.data.sections = this.getStorageItem(STORAGE_KEYS.SECTIONS) || {};
    }
    
    return JSON.stringify(data, null, 2);
  }
  
  async importData(data: string, options?: {
    overwrite?: boolean;
    skipExisting?: boolean;
  }): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    const importOptions = {
      overwrite: false,
      skipExisting: true,
      ...options
    };
    
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    
    try {
      const parsedData = JSON.parse(data);
      
      if (!parsedData.data) {
        throw new Error('Invalid import data format');
      }
      
      // 結果のインポート
      if (parsedData.data.results) {
        const existing = this.getStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS) || {};
        const results = this.mergeData(
          existing, 
          parsedData.data.results, 
          importOptions
        );
        this.setStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS, results.merged);
        imported += results.imported;
        skipped += results.skipped;
      }
      
      // プロファイルのインポート
      if (parsedData.data.profiles) {
        const existing = this.getStorageItem(STORAGE_KEYS.STAFF_PROFILES) || {};
        const profiles = this.mergeData(
          existing, 
          parsedData.data.profiles, 
          importOptions
        );
        this.setStorageItem(STORAGE_KEYS.STAFF_PROFILES, profiles.merged);
        imported += profiles.imported;
        skipped += profiles.skipped;
      }
      
      // 質問のインポート
      if (parsedData.data.questions) {
        const existing = this.getStorageItem(STORAGE_KEYS.QUESTIONS) || {};
        const questions = this.mergeData(
          existing, 
          parsedData.data.questions, 
          importOptions
        );
        this.setStorageItem(STORAGE_KEYS.QUESTIONS, questions.merged);
        imported += questions.imported;
        skipped += questions.skipped;
      }
      
      // セクションのインポート
      if (parsedData.data.sections) {
        const existing = this.getStorageItem(STORAGE_KEYS.SECTIONS) || {};
        const sections = this.mergeData(
          existing, 
          parsedData.data.sections, 
          importOptions
        );
        this.setStorageItem(STORAGE_KEYS.SECTIONS, sections.merged);
        imported += sections.imported;
        skipped += sections.skipped;
      }
      
    } catch (error) {
      errors.push(`Import error: ${error}`);
    }
    
    return { imported, skipped, errors };
  }
  
  // === トランザクション管理 ===
  
  async beginTransaction(): Promise<void> {
    if (this.transactionData) {
      throw new Error('Transaction already in progress');
    }
    this.transactionData = new Map();
  }
  
  async commitTransaction(): Promise<void> {
    if (!this.transactionData) {
      throw new Error('No transaction in progress');
    }
    
    // トランザクションデータをLocalStorageに反映
    this.transactionData.forEach((value, key) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    
    this.transactionData = null;
  }
  
  async rollbackTransaction(): Promise<void> {
    if (!this.transactionData) {
      throw new Error('No transaction in progress');
    }
    
    // トランザクションデータを破棄
    this.transactionData = null;
  }
  
  // === プライベートヘルパーメソッド ===
  
  private filterResultsByCriteria(
    results: BankInterviewResult[],
    criteria: StatsCriteria
  ): BankInterviewResult[] {
    return results.filter(result => {
      const conductedDate = new Date(result.conductedAt);
      
      if (criteria.startDate && conductedDate < criteria.startDate) {
        return false;
      }
      
      if (criteria.endDate && conductedDate > criteria.endDate) {
        return false;
      }
      
      if (criteria.facilityId && result.staffProfile.facility !== criteria.facilityId) {
        return false;
      }
      
      if (criteria.departmentId && result.staffProfile.department !== criteria.departmentId) {
        return false;
      }
      
      if (criteria.interviewType && result.interviewType !== criteria.interviewType) {
        return false;
      }
      
      if (criteria.experienceLevel && result.staffProfile.experienceLevel !== criteria.experienceLevel) {
        return false;
      }
      
      if (criteria.position && result.staffProfile.position !== criteria.position) {
        return false;
      }
      
      return true;
    });
  }
  
  private generateTrendData(results: BankInterviewResult[]): Array<{
    date: string;
    count: number;
    completionRate: number;
  }> {
    // 日付ごとに集計
    const dailyData: Record<string, { count: number; totalCompletion: number }> = {};
    
    results.forEach(result => {
      const date = new Date(result.conductedAt).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = { count: 0, totalCompletion: 0 };
      }
      
      dailyData[date].count++;
      dailyData[date].totalCompletion += result.completionRate || 0;
    });
    
    // トレンドデータに変換
    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        count: data.count,
        completionRate: data.count > 0 ? data.totalCompletion / data.count : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  
  private mergeData(
    existing: Record<string, any>,
    incoming: Record<string, any>,
    options: { overwrite?: boolean; skipExisting?: boolean }
  ): {
    merged: Record<string, any>;
    imported: number;
    skipped: number;
  } {
    const merged = { ...existing };
    let imported = 0;
    let skipped = 0;
    
    Object.entries(incoming).forEach(([key, value]) => {
      if (existing[key]) {
        if (options.overwrite) {
          merged[key] = value;
          imported++;
        } else if (options.skipExisting) {
          skipped++;
        }
      } else {
        merged[key] = value;
        imported++;
      }
    });
    
    return { merged, imported, skipped };
  }
  
  private cleanupOldData(): void {
    try {
      const results = this.getStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS) || {};
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      // 6ヶ月以上前のデータを削除
      const filteredResults = Object.entries(results)
        .filter(([_, result]: [string, any]) => 
          new Date(result.conductedAt) > sixMonthsAgo
        )
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, any>);
      
      this.setStorageItem(STORAGE_KEYS.INTERVIEW_RESULTS, filteredResults);
      
      console.log(`Cleaned up ${Object.keys(results).length - Object.keys(filteredResults).length} old interview results`);
    } catch (error) {
      console.error('Failed to cleanup old data', error);
    }
  }
}