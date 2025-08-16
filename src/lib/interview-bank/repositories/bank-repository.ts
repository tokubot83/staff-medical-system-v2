/**
 * 面談バンクシステム - データリポジトリインターフェース
 * 面談結果の永続化と取得を管理
 */

import { 
  BankInterviewResult, 
  InterviewType,
  MotivationType,
  BankQuestion,
  BankSection,
  StaffBankProfile
} from '../types';

// 統計データの検索条件
export interface StatsCriteria {
  startDate?: Date;
  endDate?: Date;
  facilityId?: string;
  departmentId?: string;
  interviewType?: InterviewType;
  experienceLevel?: string;
  position?: string;
}

// 面談統計データ
export interface InterviewStatistics {
  totalCount: number;
  completedCount: number;
  averageDuration: number;
  averageCompletionRate: number;
  
  byMotivationType: Record<MotivationType, number>;
  byExperienceLevel: Record<string, number>;
  byPosition: Record<string, number>;
  
  topChallenges: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  
  trendData: Array<{
    date: string;
    count: number;
    completionRate: number;
  }>;
}

// 質問バンク管理用の型
export interface QuestionBankEntry {
  id: string;
  question: BankQuestion;
  usageCount: number;
  averageRating?: number;
  lastUsed?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}

// セクション定義管理用の型
export interface SectionDefinitionEntry {
  id: string;
  section: BankSection;
  applicableTo: {
    experienceLevels?: string[];
    positions?: string[];
    facilityTypes?: string[];
    departments?: string[];
  };
  priority: number;
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}

// 面談バンクリポジトリインターフェース
export interface InterviewBankRepository {
  // === 面談結果の管理 ===
  
  /**
   * 面談結果を保存
   * @param result 面談結果データ
   * @returns 保存された結果のID
   */
  saveInterviewResult(result: BankInterviewResult): Promise<string>;
  
  /**
   * 面談結果を更新
   * @param id 結果ID
   * @param updates 更新内容
   */
  updateInterviewResult(id: string, updates: Partial<BankInterviewResult>): Promise<void>;
  
  /**
   * 面談結果を取得
   * @param id 結果ID
   */
  getInterviewResult(id: string): Promise<BankInterviewResult | null>;
  
  /**
   * 職員の面談履歴を取得
   * @param staffId 職員ID
   * @param type 面談タイプ（オプション）
   */
  getInterviewHistory(staffId: string, type?: InterviewType): Promise<BankInterviewResult[]>;
  
  /**
   * 最新の面談結果を取得
   * @param staffId 職員ID
   * @param type 面談タイプ
   */
  getLatestInterview(staffId: string, type?: InterviewType): Promise<BankInterviewResult | null>;
  
  // === 職員プロファイル管理 ===
  
  /**
   * 職員プロファイルを保存/更新
   * @param profile 職員プロファイル
   */
  saveStaffProfile(profile: StaffBankProfile): Promise<void>;
  
  /**
   * 職員プロファイルを取得
   * @param staffId 職員ID
   */
  getStaffProfile(staffId: string): Promise<StaffBankProfile | null>;
  
  /**
   * 動機タイプを更新
   * @param staffId 職員ID
   * @param type 動機タイプ
   * @param confidence 信頼度スコア
   */
  updateMotivationType(staffId: string, type: MotivationType, confidence?: number): Promise<void>;
  
  // === 質問バンク管理 ===
  
  /**
   * 質問を追加
   * @param question 質問データ
   * @param tags タグ
   */
  addQuestion(question: BankQuestion, tags?: string[]): Promise<string>;
  
  /**
   * 質問を更新
   * @param id 質問ID
   * @param updates 更新内容
   */
  updateQuestion(id: string, updates: Partial<BankQuestion>): Promise<void>;
  
  /**
   * 質問を削除（論理削除）
   * @param id 質問ID
   */
  deleteQuestion(id: string): Promise<void>;
  
  /**
   * 質問を検索
   * @param criteria 検索条件
   */
  searchQuestions(criteria: {
    category?: string;
    experienceLevel?: string;
    position?: string;
    tags?: string[];
    isActive?: boolean;
  }): Promise<QuestionBankEntry[]>;
  
  /**
   * 質問の使用回数を記録
   * @param questionId 質問ID
   * @param interviewId 面談ID
   */
  recordQuestionUsage(questionId: string, interviewId: string): Promise<void>;
  
  // === セクション定義管理 ===
  
  /**
   * セクション定義を追加
   * @param section セクション定義
   * @param applicableTo 適用条件
   */
  addSectionDefinition(
    section: BankSection, 
    applicableTo: SectionDefinitionEntry['applicableTo']
  ): Promise<string>;
  
  /**
   * セクション定義を更新
   * @param id セクションID
   * @param updates 更新内容
   */
  updateSectionDefinition(
    id: string, 
    updates: Partial<SectionDefinitionEntry>
  ): Promise<void>;
  
  /**
   * セクション定義を取得
   * @param criteria 検索条件
   */
  getSectionDefinitions(criteria: {
    experienceLevel?: string;
    position?: string;
    facilityType?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<SectionDefinitionEntry[]>;
  
  // === 統計・分析 ===
  
  /**
   * 面談統計を取得
   * @param criteria 統計条件
   */
  getStatistics(criteria: StatsCriteria): Promise<InterviewStatistics>;
  
  /**
   * 職員の面談完了率を取得
   * @param staffId 職員ID
   * @param period 期間（日数）
   */
  getCompletionRate(staffId: string, period?: number): Promise<number>;
  
  /**
   * 部署別の面談実施状況を取得
   * @param departmentId 部署ID
   * @param startDate 開始日
   * @param endDate 終了日
   */
  getDepartmentStats(
    departmentId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<{
    totalStaff: number;
    interviewedStaff: number;
    completedInterviews: number;
    averageCompletionRate: number;
  }>;
  
  // === バックアップ・復元 ===
  
  /**
   * データをエクスポート
   * @param options エクスポートオプション
   */
  exportData(options?: {
    includeResults?: boolean;
    includeProfiles?: boolean;
    includeQuestions?: boolean;
    includeSections?: boolean;
  }): Promise<string>;
  
  /**
   * データをインポート
   * @param data インポートデータ（JSON文字列）
   * @param options インポートオプション
   */
  importData(data: string, options?: {
    overwrite?: boolean;
    skipExisting?: boolean;
  }): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }>;
  
  // === トランザクション管理 ===
  
  /**
   * トランザクションを開始
   */
  beginTransaction(): Promise<void>;
  
  /**
   * トランザクションをコミット
   */
  commitTransaction(): Promise<void>;
  
  /**
   * トランザクションをロールバック
   */
  rollbackTransaction(): Promise<void>;
}

// リポジトリファクトリー
export class InterviewBankRepositoryFactory {
  private static instance: InterviewBankRepository | null = null;
  
  /**
   * リポジトリインスタンスを取得
   * @param type リポジトリタイプ（'local' | 'api' | 'mock'）
   */
  static getInstance(type: 'local' | 'api' | 'mock' = 'local'): InterviewBankRepository {
    if (!this.instance) {
      switch (type) {
        case 'local':
          // LocalStorageアダプターを使用（開発環境）
          const { LocalStorageAdapter } = require('./local-storage-adapter');
          this.instance = new LocalStorageAdapter();
          break;
        case 'api':
          // APIアダプターを使用（本番環境）
          const { ApiAdapter } = require('./api-adapter');
          this.instance = new ApiAdapter();
          break;
        case 'mock':
          // モックアダプターを使用（テスト環境）
          const { MockAdapter } = require('./mock-adapter');
          this.instance = new MockAdapter();
          break;
        default:
          throw new Error(`Unknown repository type: ${type}`);
      }
    }
    return this.instance;
  }
  
  /**
   * インスタンスをリセット（テスト用）
   */
  static reset(): void {
    this.instance = null;
  }
}