/**
 * 面談バンクシステム - モックアダプター（テスト用）
 */

import {
  InterviewBankRepository,
  StatsCriteria,
  InterviewStatistics,
  QuestionBankEntry,
  SectionDefinitionEntry
} from './bank-repository';
import {
  BankInterviewResult,
  InterviewType,
  MotivationType,
  BankQuestion,
  BankSection,
  StaffBankProfile
} from '../types';

export class MockAdapter implements InterviewBankRepository {
  private interviewResults: Map<string, BankInterviewResult> = new Map();
  private staffProfiles: Map<string, StaffBankProfile> = new Map();
  private questions: Map<string, QuestionBankEntry> = new Map();
  private sections: Map<string, SectionDefinitionEntry> = new Map();

  async saveInterviewResult(result: BankInterviewResult): Promise<string> {
    const id = result.id || `mock-${Date.now()}`;
    const savedResult = { ...result, id };
    this.interviewResults.set(id, savedResult);
    return id;
  }

  async updateInterviewResult(id: string, updates: Partial<BankInterviewResult>): Promise<void> {
    const existing = this.interviewResults.get(id);
    if (existing) {
      this.interviewResults.set(id, { ...existing, ...updates });
    }
  }

  async getInterviewResult(id: string): Promise<BankInterviewResult | null> {
    return this.interviewResults.get(id) || null;
  }

  async getInterviewHistory(staffId: string, type?: InterviewType): Promise<BankInterviewResult[]> {
    const results: BankInterviewResult[] = [];
    for (const result of this.interviewResults.values()) {
      if (result.staffId === staffId && (!type || result.type === type)) {
        results.push(result);
      }
    }
    return results.sort((a, b) => 
      new Date(b.conductedAt).getTime() - new Date(a.conductedAt).getTime()
    );
  }

  async getLatestInterview(staffId: string, type?: InterviewType): Promise<BankInterviewResult | null> {
    const history = await this.getInterviewHistory(staffId, type);
    return history[0] || null;
  }

  async saveStaffProfile(profile: StaffBankProfile): Promise<void> {
    this.staffProfiles.set(profile.staffId, profile);
  }

  async getStaffProfile(staffId: string): Promise<StaffBankProfile | null> {
    return this.staffProfiles.get(staffId) || null;
  }

  async updateMotivationType(staffId: string, type: MotivationType, confidence?: number): Promise<void> {
    const profile = await this.getStaffProfile(staffId);
    if (profile) {
      profile.currentMotivationType = type;
      if (confidence !== undefined) {
        profile.motivationConfidence = confidence;
      }
      await this.saveStaffProfile(profile);
    }
  }

  async addQuestion(question: BankQuestion, tags?: string[]): Promise<string> {
    const id = `q-${Date.now()}`;
    const entry: QuestionBankEntry = {
      id,
      question,
      usageCount: 0,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'mock-user',
      isActive: true
    };
    this.questions.set(id, entry);
    return id;
  }

  async updateQuestion(id: string, updates: Partial<BankQuestion>): Promise<void> {
    const entry = this.questions.get(id);
    if (entry) {
      entry.question = { ...entry.question, ...updates };
      entry.updatedAt = new Date();
      this.questions.set(id, entry);
    }
  }

  async deleteQuestion(id: string): Promise<void> {
    const entry = this.questions.get(id);
    if (entry) {
      entry.isActive = false;
      this.questions.set(id, entry);
    }
  }

  async searchQuestions(criteria: {
    category?: string;
    experienceLevel?: string;
    position?: string;
    tags?: string[];
    isActive?: boolean;
  }): Promise<QuestionBankEntry[]> {
    const results: QuestionBankEntry[] = [];
    for (const entry of this.questions.values()) {
      if (criteria.isActive !== undefined && entry.isActive !== criteria.isActive) continue;
      if (criteria.category && entry.question.category !== criteria.category) continue;
      if (criteria.tags && !criteria.tags.some(tag => entry.tags.includes(tag))) continue;
      results.push(entry);
    }
    return results;
  }

  async recordQuestionUsage(questionId: string, interviewId: string): Promise<void> {
    const entry = this.questions.get(questionId);
    if (entry) {
      entry.usageCount++;
      entry.lastUsed = new Date();
      this.questions.set(questionId, entry);
    }
  }

  async addSectionDefinition(
    section: BankSection,
    applicableTo: SectionDefinitionEntry['applicableTo']
  ): Promise<string> {
    const id = `s-${Date.now()}`;
    const entry: SectionDefinitionEntry = {
      id,
      section,
      applicableTo,
      priority: 0,
      isRequired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'mock-user',
      isActive: true
    };
    this.sections.set(id, entry);
    return id;
  }

  async updateSectionDefinition(
    id: string,
    updates: Partial<SectionDefinitionEntry>
  ): Promise<void> {
    const entry = this.sections.get(id);
    if (entry) {
      Object.assign(entry, updates);
      entry.updatedAt = new Date();
      this.sections.set(id, entry);
    }
  }

  async getSectionDefinitions(criteria: {
    experienceLevel?: string;
    position?: string;
    facilityType?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<SectionDefinitionEntry[]> {
    const results: SectionDefinitionEntry[] = [];
    for (const entry of this.sections.values()) {
      if (criteria.isActive !== undefined && entry.isActive !== criteria.isActive) continue;
      results.push(entry);
    }
    return results;
  }

  async getStatistics(criteria: StatsCriteria): Promise<InterviewStatistics> {
    return {
      totalCount: this.interviewResults.size,
      completedCount: Array.from(this.interviewResults.values())
        .filter(r => r.completedAt).length,
      averageDuration: 30,
      averageCompletionRate: 0.85,
      byMotivationType: {
        [MotivationType.Growth]: 10,
        [MotivationType.Stability]: 8,
        [MotivationType.Contribution]: 12,
        [MotivationType.Recognition]: 6
      },
      byExperienceLevel: {
        'junior': 15,
        'mid': 10,
        'senior': 11
      },
      byPosition: {
        'nurse': 20,
        'doctor': 10,
        'therapist': 6
      },
      topChallenges: [
        { category: 'workload', count: 25, percentage: 69.4 },
        { category: 'communication', count: 15, percentage: 41.7 },
        { category: 'growth', count: 10, percentage: 27.8 }
      ],
      trendData: []
    };
  }

  async getCompletionRate(staffId: string, period?: number): Promise<number> {
    return 0.85;
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
    return {
      totalStaff: 50,
      interviewedStaff: 42,
      completedInterviews: 38,
      averageCompletionRate: 0.85
    };
  }

  async exportData(options?: {
    includeResults?: boolean;
    includeProfiles?: boolean;
    includeQuestions?: boolean;
    includeSections?: boolean;
  }): Promise<string> {
    const data: any = {};
    if (options?.includeResults !== false) {
      data.results = Array.from(this.interviewResults.values());
    }
    if (options?.includeProfiles !== false) {
      data.profiles = Array.from(this.staffProfiles.values());
    }
    if (options?.includeQuestions !== false) {
      data.questions = Array.from(this.questions.values());
    }
    if (options?.includeSections !== false) {
      data.sections = Array.from(this.sections.values());
    }
    return JSON.stringify(data, null, 2);
  }

  async importData(
    data: string,
    options?: {
      overwrite?: boolean;
      skipExisting?: boolean;
    }
  ): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    try {
      const parsed = JSON.parse(data);
      let imported = 0;
      let skipped = 0;

      if (parsed.results) {
        for (const result of parsed.results) {
          if (!options?.skipExisting || !this.interviewResults.has(result.id)) {
            this.interviewResults.set(result.id, result);
            imported++;
          } else {
            skipped++;
          }
        }
      }

      return { imported, skipped, errors: [] };
    } catch (error) {
      return { imported: 0, skipped: 0, errors: [String(error)] };
    }
  }

  async beginTransaction(): Promise<void> {
    // Mock implementation
  }

  async commitTransaction(): Promise<void> {
    // Mock implementation
  }

  async rollbackTransaction(): Promise<void> {
    // Mock implementation
  }
}