// VoiceDrive統合サービス
// 法人SNS VoiceDriveとの連携機能を提供

import { InterviewData } from './interview/interviewDataService';
import { StaffMindsetProfile } from './motivationTypeDiagnosisService';

// VoiceDrive面談申込データ
export interface VoiceDriveInterviewRequest {
  id: string;
  requestId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  
  // 申込情報
  requestType: 'support_interview'; // サポート面談
  category: VoiceDriveInterviewCategory;
  subcategory?: string;
  
  // 相談内容
  consultationTopic: string;
  consultationDetails: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  
  // 希望条件
  preferredDates: Date[];
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'anytime';
  preferredInterviewer?: string;
  preferredLocation: 'online' | 'face-to-face' | 'either';
  
  // メタデータ
  requestedAt: Date;
  requestedVia: 'voicedrive_app' | 'voicedrive_web';
  deviceInfo?: {
    platform: string;
    version: string;
  };
  
  // ステータス
  status: 'pending' | 'approved' | 'scheduled' | 'completed' | 'cancelled';
  statusHistory: {
    status: string;
    changedAt: Date;
    changedBy: string;
    reason?: string;
  }[];
}

// VoiceDrive面談カテゴリ
export type VoiceDriveInterviewCategory = 
  | 'career'           // キャリア相談
  | 'workplace'        // 職場環境
  | 'relationships'    // 人間関係
  | 'worklife'        // ワークライフバランス
  | 'health'          // 健康・メンタル
  | 'skills'          // スキル・研修
  | 'evaluation'      // 評価・処遇
  | 'other';          // その他

// MCP Server経由のデータ同期設定
export interface MCPServerConfig {
  endpoint: string;
  apiKey: string;
  syncInterval: number; // ミリ秒
  retryAttempts: number;
  timeout: number;
}

// 同期ステータス
export interface SyncStatus {
  lastSyncTime: Date;
  nextSyncTime: Date;
  pendingRequests: number;
  syncErrors: string[];
  isConnected: boolean;
  serverStatus: 'online' | 'offline' | 'maintenance';
}

// VoiceDrive通知データ
export interface VoiceDriveNotification {
  id: string;
  type: 'interview_scheduled' | 'interview_reminder' | 'interview_completed' | 'action_required';
  recipientId: string;
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'normal' | 'high';
  sentAt: Date;
  readAt?: Date;
  actionUrl?: string;
}

// VoiceDrive職員プロファイル（簡易版）
export interface VoiceDriveStaffProfile {
  employeeId: string;
  displayName: string;
  profileImage?: string;
  department: string;
  position: string;
  joinDate: Date;
  
  // SNS活動データ
  activityLevel: 'low' | 'medium' | 'high';
  lastActiveAt: Date;
  postCount: number;
  connectionCount: number;
  
  // 面談履歴サマリ
  interviewHistory: {
    totalCount: number;
    lastInterviewDate?: Date;
    frequentCategories: string[];
  };
  
  // プリファレンス
  preferences: {
    notificationEnabled: boolean;
    preferredContactMethod: 'app' | 'email' | 'both';
    language: 'ja' | 'en';
  };
}

// 面談申込分析データ
export interface InterviewRequestAnalytics {
  employeeId: string;
  period: {
    from: Date;
    to: Date;
  };
  
  // 申込パターン
  patterns: {
    mostFrequentCategory: string;
    averageUrgency: number;
    preferredTime: string;
    requestFrequency: 'rarely' | 'occasionally' | 'frequently';
  };
  
  // トピック分析
  topicAnalysis: {
    keywords: string[];
    sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
    emotionalState: string[];
  };
  
  // 推奨アクション
  recommendations: {
    suggestedInterviewType: string;
    suggestedDuration: number;
    suggestedInterviewer?: string;
    priorityLevel: number;
  };
}

export class VoiceDriveIntegrationService {
  private static mcpConfig: MCPServerConfig = {
    endpoint: process.env.MCP_SERVER_ENDPOINT || 'http://localhost:3001/api/mcp',
    apiKey: process.env.MCP_API_KEY || '',
    syncInterval: 60000, // 1分
    retryAttempts: 3,
    timeout: 30000
  };
  
  private static syncStatus: SyncStatus = {
    lastSyncTime: new Date(),
    nextSyncTime: new Date(),
    pendingRequests: 0,
    syncErrors: [],
    isConnected: false,
    serverStatus: 'offline'
  };
  
  /**
   * MCP Server経由でVoiceDriveから面談申込を取得
   */
  static async fetchInterviewRequests(): Promise<VoiceDriveInterviewRequest[]> {
    try {
      // MCP Server共有フォルダから読み取り
      const sharedDataPath = 'mcp-shared/voicedrive/interview-requests.json';
      
      // 実際の実装では fs.readFile または API call
      const response = await this.callMCPServer('/sync/interview-requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.mcpConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`MCP Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 同期ステータス更新
      this.updateSyncStatus({
        lastSyncTime: new Date(),
        pendingRequests: data.requests?.length || 0,
        isConnected: true,
        serverStatus: 'online'
      });
      
      return data.requests || [];
      
    } catch (error) {
      console.error('Failed to fetch interview requests:', error);
      this.updateSyncStatus({
        isConnected: false,
        syncErrors: [...this.syncStatus.syncErrors, String(error)]
      });
      return [];
    }
  }
  
  /**
   * 面談申込を処理してマニュアル生成用のコンテキストを作成
   */
  static async processInterviewRequest(
    request: VoiceDriveInterviewRequest
  ): Promise<{
    context: InterviewRequestContext;
    analytics: InterviewRequestAnalytics;
  }> {
    // 申込内容の分析
    const analytics = await this.analyzeRequest(request);
    
    // マニュアル生成用のコンテキスト作成
    const context: InterviewRequestContext = {
      staffId: request.employeeId,
      staffName: request.employeeName,
      department: request.department,
      position: request.position,
      
      interviewType: 'support',
      category: this.mapVoiceDriveCategory(request.category),
      
      mainTopic: request.consultationTopic,
      details: request.consultationDetails,
      urgency: request.urgency,
      
      suggestedDuration: analytics.recommendations.suggestedDuration,
      suggestedQuestions: await this.generateQuestionsFromTopic(request),
      
      metadata: {
        source: 'voicedrive',
        requestId: request.requestId,
        requestedAt: request.requestedAt
      }
    };
    
    return { context, analytics };
  }
  
  /**
   * 面談結果をVoiceDriveに送信
   */
  static async sendInterviewResult(
    interviewData: InterviewData,
    requestId: string
  ): Promise<boolean> {
    try {
      const payload = {
        requestId,
        interviewId: interviewData.id,
        completedAt: interviewData.actualDate,
        duration: interviewData.duration,
        
        summary: interviewData.summary,
        keyPoints: interviewData.keyPoints,
        actionItems: interviewData.actionItems,
        
        followUpRequired: interviewData.followUpRequired,
        followUpDate: interviewData.followUpDate,
        
        // 職員へのフィードバック
        feedbackToEmployee: this.generateEmployeeFeedback(interviewData),
        
        // 次回の推奨事項
        nextRecommendations: {
          suggestedNextInterview: interviewData.followUpDate,
          suggestedTopics: this.extractNextTopics(interviewData)
        }
      };
      
      const response = await this.callMCPServer('/sync/interview-results', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.mcpConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      return response.ok;
      
    } catch (error) {
      console.error('Failed to send interview result:', error);
      return false;
    }
  }
  
  /**
   * 職員プロファイルを取得
   */
  static async getStaffProfile(employeeId: string): Promise<VoiceDriveStaffProfile | null> {
    try {
      const response = await this.callMCPServer(`/staff/${employeeId}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.mcpConfig.apiKey}`
        }
      });
      
      if (!response.ok) return null;
      
      return await response.json();
      
    } catch (error) {
      console.error('Failed to get staff profile:', error);
      return null;
    }
  }
  
  /**
   * 通知を送信
   */
  static async sendNotification(
    notification: Omit<VoiceDriveNotification, 'id' | 'sentAt'>
  ): Promise<boolean> {
    try {
      const payload = {
        ...notification,
        id: `notif_${Date.now()}`,
        sentAt: new Date()
      };
      
      const response = await this.callMCPServer('/notifications/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.mcpConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      return response.ok;
      
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }
  
  /**
   * 定期同期の開始
   */
  static startPeriodicSync(): void {
    setInterval(async () => {
      await this.performSync();
    }, this.mcpConfig.syncInterval);
    
    // 初回同期
    this.performSync();
  }
  
  /**
   * 同期処理の実行
   */
  private static async performSync(): Promise<void> {
    try {
      // 1. 新規面談申込の取得
      const newRequests = await this.fetchInterviewRequests();
      
      // 2. 各申込の処理
      for (const request of newRequests) {
        await this.handleNewRequest(request);
      }
      
      // 3. 完了した面談結果の送信
      await this.syncCompletedInterviews();
      
      // 4. 職員プロファイルの更新
      await this.syncStaffProfiles();
      
      // 同期成功
      this.updateSyncStatus({
        lastSyncTime: new Date(),
        nextSyncTime: new Date(Date.now() + this.mcpConfig.syncInterval),
        syncErrors: [],
        isConnected: true
      });
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.updateSyncStatus({
        syncErrors: [...this.syncStatus.syncErrors, String(error)],
        isConnected: false
      });
    }
  }
  
  /**
   * 新規申込の処理
   */
  private static async handleNewRequest(
    request: VoiceDriveInterviewRequest
  ): Promise<void> {
    // 1. 申込を分析
    const { context, analytics } = await this.processInterviewRequest(request);
    
    // 2. 面談スケジュールを作成
    const interviewData: Partial<InterviewData> = {
      staffId: request.employeeId,
      staffName: request.employeeName,
      interviewType: 'support',
      interviewCategory: 'support',
      scheduledDate: request.preferredDates[0]?.toISOString() || '',
      status: 'scheduled',
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
    
    // 3. 通知を送信
    await this.sendNotification({
      type: 'interview_scheduled',
      recipientId: request.employeeId,
      title: '面談が予約されました',
      message: `${request.preferredDates[0]?.toLocaleDateString('ja-JP')}に面談を予定しています`,
      priority: 'normal',
      data: { interviewData }
    });
  }
  
  /**
   * 完了した面談の同期
   */
  private static async syncCompletedInterviews(): Promise<void> {
    // 実装省略: 完了した面談を検索して結果を送信
  }
  
  /**
   * 職員プロファイルの同期
   */
  private static async syncStaffProfiles(): Promise<void> {
    // 実装省略: 更新された職員情報を同期
  }
  
  /**
   * MCP Serverへのリクエスト
   */
  private static async callMCPServer(
    path: string,
    options: RequestInit
  ): Promise<Response> {
    const url = `${this.mcpConfig.endpoint}${path}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.mcpConfig.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  /**
   * 同期ステータスの更新
   */
  private static updateSyncStatus(updates: Partial<SyncStatus>): void {
    this.syncStatus = {
      ...this.syncStatus,
      ...updates
    };
  }
  
  /**
   * VoiceDriveカテゴリのマッピング
   */
  private static mapVoiceDriveCategory(category: VoiceDriveInterviewCategory): string {
    const mapping: Record<VoiceDriveInterviewCategory, string> = {
      'career': 'career_support',
      'workplace': 'workplace_support',
      'relationships': 'workplace_support',
      'worklife': 'workplace_support',
      'health': 'individual_consultation',
      'skills': 'career_support',
      'evaluation': 'feedback',
      'other': 'individual_consultation'
    };
    
    return mapping[category] || 'individual_consultation';
  }
  
  /**
   * トピックから質問を生成
   */
  private static async generateQuestionsFromTopic(
    request: VoiceDriveInterviewRequest
  ): Promise<string[]> {
    const questions: string[] = [];
    
    // カテゴリ別の基本質問
    switch (request.category) {
      case 'career':
        questions.push(
          'キャリアの目標について詳しく教えてください',
          '現在のスキルと理想のギャップは何ですか？',
          'どのような支援があれば目標達成できますか？'
        );
        break;
        
      case 'workplace':
        questions.push(
          '職場環境で改善してほしい点は何ですか？',
          'チームワークについてどう感じていますか？',
          '働きやすさを向上させるアイデアはありますか？'
        );
        break;
        
      case 'relationships':
        questions.push(
          '人間関係で困っていることを具体的に教えてください',
          'コミュニケーションで工夫していることは？',
          '理想的なチーム関係とは？'
        );
        break;
        
      case 'health':
        questions.push(
          '健康面で気になることはありますか？',
          'ストレスの主な原因は何ですか？',
          'セルフケアで実践していることは？'
        );
        break;
        
      default:
        questions.push(
          '相談したいことを詳しく教えてください',
          '現状をどう改善したいですか？',
          'どのようなサポートが必要ですか？'
        );
    }
    
    // 詳細内容からキーワードを抽出して質問を追加
    if (request.consultationDetails) {
      // 簡易的なキーワード抽出
      if (request.consultationDetails.includes('昇進') || request.consultationDetails.includes('昇格')) {
        questions.push('昇進・昇格に向けて準備していることは？');
      }
      if (request.consultationDetails.includes('異動') || request.consultationDetails.includes('転職')) {
        questions.push('異動・転職を考える理由は？');
      }
      if (request.consultationDetails.includes('研修') || request.consultationDetails.includes('勉強')) {
        questions.push('学びたいスキルや知識は具体的に何ですか？');
      }
    }
    
    return questions;
  }
  
  /**
   * 申込内容の分析
   */
  private static async analyzeRequest(
    request: VoiceDriveInterviewRequest
  ): Promise<InterviewRequestAnalytics> {
    // 簡易的な分析実装
    const keywords = this.extractKeywords(request.consultationDetails);
    const sentiment = this.analyzeSentiment(request.consultationDetails);
    const urgencyScore = this.calculateUrgencyScore(request);
    
    return {
      employeeId: request.employeeId,
      period: {
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 過去90日
        to: new Date()
      },
      patterns: {
        mostFrequentCategory: request.category,
        averageUrgency: urgencyScore,
        preferredTime: request.preferredTime,
        requestFrequency: 'occasionally'
      },
      topicAnalysis: {
        keywords,
        sentiment,
        emotionalState: this.detectEmotionalState(request.consultationDetails)
      },
      recommendations: {
        suggestedInterviewType: 'support',
        suggestedDuration: urgencyScore > 7 ? 45 : 30,
        priorityLevel: urgencyScore
      }
    };
  }
  
  /**
   * キーワード抽出
   */
  private static extractKeywords(text: string): string[] {
    // 簡易実装: 重要そうな単語を抽出
    const keywords: string[] = [];
    const importantTerms = [
      'キャリア', '昇進', '異動', '研修', 'スキル',
      'ストレス', '人間関係', 'ハラスメント', '退職',
      'ワークライフバランス', '残業', '休暇',
      '評価', '給与', '待遇'
    ];
    
    importantTerms.forEach(term => {
      if (text.includes(term)) {
        keywords.push(term);
      }
    });
    
    return keywords;
  }
  
  /**
   * 感情分析
   */
  private static analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' | 'mixed' {
    // 簡易実装: キーワードベースの判定
    const positiveWords = ['嬉しい', '楽しい', '充実', '成長', '期待'];
    const negativeWords = ['辛い', '苦しい', '不安', '心配', '困って'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });
    
    if (positiveCount > 0 && negativeCount > 0) return 'mixed';
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
  
  /**
   * 感情状態の検出
   */
  private static detectEmotionalState(text: string): string[] {
    const states: string[] = [];
    
    if (text.includes('不安') || text.includes('心配')) states.push('anxious');
    if (text.includes('イライラ') || text.includes('腹立')) states.push('frustrated');
    if (text.includes('疲れ') || text.includes('疲労')) states.push('tired');
    if (text.includes('やる気') || text.includes('モチベーション')) states.push('motivated');
    if (text.includes('悩') || text.includes('迷')) states.push('confused');
    
    return states;
  }
  
  /**
   * 緊急度スコアの計算
   */
  private static calculateUrgencyScore(request: VoiceDriveInterviewRequest): number {
    let score = 5; // 基準スコア
    
    // 緊急度による加算
    switch (request.urgency) {
      case 'urgent': score += 4; break;
      case 'high': score += 3; break;
      case 'medium': score += 1; break;
      case 'low': score -= 1; break;
    }
    
    // キーワードによる加算
    const urgentKeywords = ['退職', 'ハラスメント', '体調不良', '限界'];
    urgentKeywords.forEach(keyword => {
      if (request.consultationDetails.includes(keyword)) {
        score += 2;
      }
    });
    
    return Math.min(10, Math.max(1, score));
  }
  
  /**
   * 職員向けフィードバックの生成
   */
  private static generateEmployeeFeedback(interviewData: InterviewData): string {
    const feedback = `
面談ありがとうございました。

【話し合った内容】
${interviewData.summary || ''}

【決定事項】
${interviewData.actionItems?.map(item => `・${item.description}`).join('\n') || '特になし'}

【次回予定】
${interviewData.followUpDate ? `次回面談: ${new Date(interviewData.followUpDate).toLocaleDateString('ja-JP')}` : '必要に応じて設定'}

何か追加でご相談がありましたら、いつでもVoiceDriveからお申し込みください。
    `.trim();
    
    return feedback;
  }
  
  /**
   * 次回トピックの抽出
   */
  private static extractNextTopics(interviewData: InterviewData): string[] {
    const topics: string[] = [];
    
    // アクションアイテムから抽出
    interviewData.actionItems?.forEach(item => {
      if (item.status === 'pending') {
        topics.push(`${item.description}の進捗確認`);
      }
    });
    
    // キーポイントから継続課題を抽出
    interviewData.keyPoints?.forEach(point => {
      if (point.includes('継続') || point.includes('次回')) {
        topics.push(point);
      }
    });
    
    return topics;
  }
  
  /**
   * 同期ステータスの取得
   */
  static getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }
  
  /**
   * 設定の更新
   */
  static updateConfig(config: Partial<MCPServerConfig>): void {
    this.mcpConfig = {
      ...this.mcpConfig,
      ...config
    };
  }
}

// 面談リクエストコンテキスト（内部用）
interface InterviewRequestContext {
  staffId: string;
  staffName: string;
  department: string;
  position: string;
  
  interviewType: string;
  category: string;
  
  mainTopic: string;
  details: string;
  urgency: string;
  
  suggestedDuration: number;
  suggestedQuestions: string[];
  
  metadata: {
    source: string;
    requestId: string;
    requestedAt: Date;
  };
}