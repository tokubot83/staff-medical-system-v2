/**
 * APIアダプター - 本番環境用のデータ永続化実装
 * バックエンドAPIを通じてPostgreSQLデータベースと連携
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

// API設定
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api/interview-bank',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};

// APIレスポンス型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiAdapter implements InterviewBankRepository {
  private headers: HeadersInit;
  
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // 認証トークンがあれば追加
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.headers = {
          ...this.headers,
          'Authorization': `Bearer ${token}`
        };
      }
    }
  }
  
  // === API通信のヘルパーメソッド ===
  
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retries: number = API_CONFIG.retryAttempts
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${url}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }
      
      return result.data as T;
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // リトライ可能なエラーの場合
      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(API_CONFIG.retryDelay);
        return this.fetchWithRetry<T>(url, options, retries - 1);
      }
      
      throw error;
    }
  }
  
  private isRetryableError(error: any): boolean {
    // ネットワークエラーやタイムアウトの場合はリトライ
    if (error.name === 'AbortError' || error.name === 'TypeError') {
      return true;
    }
    
    // 5xxエラーの場合はリトライ
    if (error.message && error.message.includes('status: 5')) {
      return true;
    }
    
    return false;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // === 面談結果の管理 ===
  
  async saveInterviewResult(result: BankInterviewResult): Promise<string> {
    const response = await this.fetchWithRetry<{ id: string }>('/results', {
      method: 'POST',
      body: JSON.stringify(result)
    });
    
    return response.id;
  }
  
  async updateInterviewResult(id: string, updates: Partial<BankInterviewResult>): Promise<void> {
    await this.fetchWithRetry<void>(`/results/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }
  
  async getInterviewResult(id: string): Promise<BankInterviewResult | null> {
    try {
      return await this.fetchWithRetry<BankInterviewResult>(`/results/${id}`);
    } catch (error: any) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
  
  async getInterviewHistory(staffId: string, type?: InterviewType): Promise<BankInterviewResult[]> {
    const params = new URLSearchParams({ staffId });
    if (type) params.append('type', type);
    
    return await this.fetchWithRetry<BankInterviewResult[]>(`/results?${params}`);
  }
  
  async getLatestInterview(staffId: string, type?: InterviewType): Promise<BankInterviewResult | null> {
    const params = new URLSearchParams({ 
      staffId,
      limit: '1',
      sort: 'conductedAt',
      order: 'desc'
    });
    if (type) params.append('type', type);
    
    const results = await this.fetchWithRetry<BankInterviewResult[]>(`/results?${params}`);
    return results[0] || null;
  }
  
  // === 職員プロファイル管理 ===
  
  async saveStaffProfile(profile: StaffBankProfile): Promise<void> {
    await this.fetchWithRetry<void>(`/profiles/${profile.id}`, {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }
  
  async getStaffProfile(staffId: string): Promise<StaffBankProfile | null> {
    try {
      return await this.fetchWithRetry<StaffBankProfile>(`/profiles/${staffId}`);
    } catch (error: any) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
  
  async updateMotivationType(staffId: string, type: MotivationType, confidence?: number): Promise<void> {
    await this.fetchWithRetry<void>(`/profiles/${staffId}/motivation`, {
      method: 'PATCH',
      body: JSON.stringify({ type, confidence })
    });
  }
  
  // === 質問バンク管理 ===
  
  async addQuestion(question: BankQuestion, tags: string[] = []): Promise<string> {
    const response = await this.fetchWithRetry<{ id: string }>('/questions', {
      method: 'POST',
      body: JSON.stringify({ question, tags })
    });
    
    return response.id;
  }
  
  async updateQuestion(id: string, updates: Partial<BankQuestion>): Promise<void> {
    await this.fetchWithRetry<void>(`/questions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }
  
  async deleteQuestion(id: string): Promise<void> {
    await this.fetchWithRetry<void>(`/questions/${id}`, {
      method: 'DELETE'
    });
  }
  
  async searchQuestions(criteria: {
    category?: string;
    experienceLevel?: string;
    position?: string;
    tags?: string[];
    isActive?: boolean;
  }): Promise<QuestionBankEntry[]> {
    const params = new URLSearchParams();
    
    if (criteria.category) params.append('category', criteria.category);
    if (criteria.experienceLevel) params.append('experienceLevel', criteria.experienceLevel);
    if (criteria.position) params.append('position', criteria.position);
    if (criteria.tags) criteria.tags.forEach(tag => params.append('tags', tag));
    if (criteria.isActive !== undefined) params.append('isActive', String(criteria.isActive));
    
    return await this.fetchWithRetry<QuestionBankEntry[]>(`/questions?${params}`);
  }
  
  async recordQuestionUsage(questionId: string, interviewId: string): Promise<void> {
    await this.fetchWithRetry<void>(`/questions/${questionId}/usage`, {
      method: 'POST',
      body: JSON.stringify({ interviewId })
    });
  }
  
  // === セクション定義管理 ===
  
  async addSectionDefinition(
    section: BankSection,
    applicableTo: SectionDefinitionEntry['applicableTo']
  ): Promise<string> {
    const response = await this.fetchWithRetry<{ id: string }>('/sections', {
      method: 'POST',
      body: JSON.stringify({ section, applicableTo })
    });
    
    return response.id;
  }
  
  async updateSectionDefinition(
    id: string,
    updates: Partial<SectionDefinitionEntry>
  ): Promise<void> {
    await this.fetchWithRetry<void>(`/sections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }
  
  async getSectionDefinitions(criteria: {
    experienceLevel?: string;
    position?: string;
    facilityType?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<SectionDefinitionEntry[]> {
    const params = new URLSearchParams();
    
    if (criteria.experienceLevel) params.append('experienceLevel', criteria.experienceLevel);
    if (criteria.position) params.append('position', criteria.position);
    if (criteria.facilityType) params.append('facilityType', criteria.facilityType);
    if (criteria.department) params.append('department', criteria.department);
    if (criteria.isActive !== undefined) params.append('isActive', String(criteria.isActive));
    
    return await this.fetchWithRetry<SectionDefinitionEntry[]>(`/sections?${params}`);
  }
  
  // === 統計・分析 ===
  
  async getStatistics(criteria: StatsCriteria): Promise<InterviewStatistics> {
    const params = new URLSearchParams();
    
    if (criteria.startDate) params.append('startDate', criteria.startDate.toISOString());
    if (criteria.endDate) params.append('endDate', criteria.endDate.toISOString());
    if (criteria.facilityId) params.append('facilityId', criteria.facilityId);
    if (criteria.departmentId) params.append('departmentId', criteria.departmentId);
    if (criteria.interviewType) params.append('interviewType', criteria.interviewType);
    if (criteria.experienceLevel) params.append('experienceLevel', criteria.experienceLevel);
    if (criteria.position) params.append('position', criteria.position);
    
    return await this.fetchWithRetry<InterviewStatistics>(`/statistics?${params}`);
  }
  
  async getCompletionRate(staffId: string, period: number = 30): Promise<number> {
    const params = new URLSearchParams({
      staffId,
      period: String(period)
    });
    
    const response = await this.fetchWithRetry<{ rate: number }>(`/statistics/completion-rate?${params}`);
    return response.rate;
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
    const params = new URLSearchParams({
      departmentId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    
    return await this.fetchWithRetry(`/statistics/department?${params}`);
  }
  
  // === バックアップ・復元 ===
  
  async exportData(options?: {
    includeResults?: boolean;
    includeProfiles?: boolean;
    includeQuestions?: boolean;
    includeSections?: boolean;
  }): Promise<string> {
    const params = new URLSearchParams();
    
    if (options?.includeResults !== false) params.append('includeResults', 'true');
    if (options?.includeProfiles !== false) params.append('includeProfiles', 'true');
    if (options?.includeQuestions !== false) params.append('includeQuestions', 'true');
    if (options?.includeSections !== false) params.append('includeSections', 'true');
    
    const response = await this.fetchWithRetry<{ data: string }>(`/export?${params}`);
    return response.data;
  }
  
  async importData(data: string, options?: {
    overwrite?: boolean;
    skipExisting?: boolean;
  }): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    return await this.fetchWithRetry('/import', {
      method: 'POST',
      body: JSON.stringify({
        data,
        options: {
          overwrite: options?.overwrite || false,
          skipExisting: options?.skipExisting !== false
        }
      })
    });
  }
  
  // === トランザクション管理 ===
  
  async beginTransaction(): Promise<void> {
    await this.fetchWithRetry<void>('/transactions', {
      method: 'POST'
    });
  }
  
  async commitTransaction(): Promise<void> {
    await this.fetchWithRetry<void>('/transactions/commit', {
      method: 'POST'
    });
  }
  
  async rollbackTransaction(): Promise<void> {
    await this.fetchWithRetry<void>('/transactions/rollback', {
      method: 'POST'
    });
  }
  
  // === バッチ操作用のメソッド ===
  
  /**
   * 複数の面談結果を一括保存
   */
  async saveBatchResults(results: BankInterviewResult[]): Promise<string[]> {
    const response = await this.fetchWithRetry<{ ids: string[] }>('/results/batch', {
      method: 'POST',
      body: JSON.stringify({ results })
    });
    
    return response.ids;
  }
  
  /**
   * 複数の質問を一括追加
   */
  async addBatchQuestions(questions: Array<{ question: BankQuestion; tags?: string[] }>): Promise<string[]> {
    const response = await this.fetchWithRetry<{ ids: string[] }>('/questions/batch', {
      method: 'POST',
      body: JSON.stringify({ questions })
    });
    
    return response.ids;
  }
  
  /**
   * キャッシュをクリア
   */
  async clearCache(): Promise<void> {
    await this.fetchWithRetry<void>('/cache/clear', {
      method: 'POST'
    });
  }
  
  /**
   * ヘルスチェック
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry<{ status: string }>('/health');
      return response.status === 'ok';
    } catch {
      return false;
    }
  }
}