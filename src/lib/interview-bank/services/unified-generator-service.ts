/**
 * 統合面談生成サービス
 * 全ての面談タイプ（定期、サポート、特別）を統一的に扱うサービス
 * 予約情報から自動的に適切なジェネレーターを選択して面談シートを生成
 */

import { GeneratedBankSheet, InterviewType } from '../types';
import { generateV4InterviewSheet } from './v4-generator';
import { CareerSupportGenerator } from './support-career-generator';
import { ConsultationSupportGenerator } from './support-consultation-generator';
import { FeedbackSupportGenerator } from './support-feedback-generator';
import { SpecialInterviewGenerator } from './special-interview-generator';

// 統合面談パラメータ
export interface UnifiedInterviewParams {
  // 共通パラメータ
  interviewType: InterviewType;
  subType?: string;
  duration: number;
  
  // 職員情報
  staffProfile: {
    staffId: string;
    staffName: string;
    profession: string;
    experienceLevel: string;
    facility: string;
    department?: string;
    position?: string;
    yearsOfService?: number;
    yearsOfExperience?: number;
    hasManagementExperience?: boolean;
    previousEvaluation?: any;
  };
  
  // 予約情報
  reservation: {
    id: string;
    type: string;
    category?: string;
    subCategory?: string;
    duration: number;
    scheduledDate?: Date;
    
    // サポート面談用
    consultationDetails?: string;
    consultationTopic?: string;
    urgency?: 'low' | 'medium' | 'high';
    concerns?: string[];
    hasTriedSolutions?: boolean;
    problemDuration?: string;
    workImpact?: 'low' | 'medium' | 'high';
    
    // フィードバック面談用
    hasAppealIntent?: boolean;
    evaluationPeriod?: string;
    
    // 特別面談用
    specialType?: string;
    exitReason?: string;
    exitDate?: Date;
    hasHandoverPlan?: boolean;
    returnReason?: string;
    absenceDuration?: number;
    returnDate?: Date;
    needsAccommodation?: boolean;
    medicalClearance?: boolean;
    incidentLevel?: string;
    incidentDate?: Date;
    hasReportSubmitted?: boolean;
    emotionalImpact?: 'low' | 'medium' | 'high';
    needsPsychologicalSupport?: boolean;
  };
}

// 面談タイプ判定結果
interface InterviewTypeDetection {
  mainType: InterviewType;
  subType?: string;
  generator: 'regular' | 'career' | 'consultation' | 'feedback' | 'special';
  confidence: number; // 0-1の確信度
}

/**
 * 統合面談生成サービス
 */
export class UnifiedInterviewGeneratorService {
  
  /**
   * 統一的な面談シート生成メソッド
   * 予約情報から自動的に適切なジェネレーターを選択
   */
  static async generate(params: UnifiedInterviewParams): Promise<GeneratedBankSheet> {
    try {
      // 1. 面談タイプを判定
      const detection = this.detectInterviewType(params);
      
      console.log('[UnifiedGenerator] Detected interview type:', {
        mainType: detection.mainType,
        subType: detection.subType,
        generator: detection.generator,
        confidence: detection.confidence
      });
      
      // 2. 適切なジェネレーターを選択して生成
      let sheet: GeneratedBankSheet;
      
      switch (detection.generator) {
        case 'regular':
          // 定期面談（既存のv4-generator使用）
          sheet = await this.generateRegularInterview(params);
          break;
          
        case 'career':
          // サポート面談（キャリア系）
          sheet = CareerSupportGenerator.generateFromReservation(
            params.reservation,
            params.staffProfile
          );
          break;
          
        case 'consultation':
          // サポート面談（個別相談系）
          sheet = ConsultationSupportGenerator.generateFromReservation(
            params.reservation,
            params.staffProfile
          );
          break;
          
        case 'feedback':
          // サポート面談（フィードバック）
          sheet = await FeedbackSupportGenerator.generateFromReservation(
            params.reservation,
            params.staffProfile
          );
          break;
          
        case 'special':
          // 特別面談
          sheet = SpecialInterviewGenerator.generateFromReservation(
            params.reservation,
            params.staffProfile
          );
          break;
          
        default:
          // フォールバック：定期面談として処理
          console.warn('[UnifiedGenerator] Unknown generator type, falling back to regular');
          sheet = await this.generateRegularInterview(params);
      }
      
      // 3. 共通の後処理
      sheet = this.postProcessSheet(sheet, params);
      
      return sheet;
      
    } catch (error) {
      console.error('[UnifiedGenerator] Error generating interview sheet:', error);
      throw new Error(`面談シート生成に失敗しました: ${error.message}`);
    }
  }
  
  /**
   * 面談タイプを判定
   */
  private static detectInterviewType(params: UnifiedInterviewParams): InterviewTypeDetection {
    const { reservation } = params;
    
    // 明示的なタイプ指定がある場合
    if (reservation.type) {
      const typeMap: Record<string, InterviewTypeDetection> = {
        // 定期面談
        'regular': { mainType: 'regular', generator: 'regular', confidence: 1.0 },
        'regular_annual': { mainType: 'regular', subType: 'annual', generator: 'regular', confidence: 1.0 },
        'regular_monthly': { mainType: 'regular', subType: 'monthly', generator: 'regular', confidence: 1.0 },
        'regular_quarterly': { mainType: 'regular', subType: 'quarterly', generator: 'regular', confidence: 1.0 },
        
        // サポート面談
        'support': this.detectSupportSubType(reservation),
        'feedback': { mainType: 'support', subType: 'feedback', generator: 'feedback', confidence: 1.0 },
        
        // 特別面談
        'special': { mainType: 'special', generator: 'special', confidence: 1.0 },
        'exit': { mainType: 'special', subType: 'exit', generator: 'special', confidence: 1.0 },
        'return_to_work': { mainType: 'special', subType: 'return_to_work', generator: 'special', confidence: 1.0 },
        'incident_followup': { mainType: 'special', subType: 'incident_followup', generator: 'special', confidence: 1.0 }
      };
      
      if (typeMap[reservation.type]) {
        return typeMap[reservation.type];
      }
    }
    
    // カテゴリから推測
    if (reservation.category) {
      return this.detectFromCategory(reservation);
    }
    
    // キーワードから推測
    return this.detectFromKeywords(reservation);
  }
  
  /**
   * サポート面談のサブタイプを判定
   */
  private static detectSupportSubType(reservation: any): InterviewTypeDetection {
    // フィードバック面談の判定
    if (reservation.subCategory === 'フィードバック' || 
        reservation.evaluationPeriod ||
        reservation.hasAppealIntent !== undefined) {
      return {
        mainType: 'support',
        subType: 'feedback',
        generator: 'feedback',
        confidence: 0.95
      };
    }
    
    // キャリア系の判定
    const careerKeywords = ['キャリア', '昇進', '昇格', '異動', '転勤', 'スキル', '資格'];
    if (reservation.subCategory && careerKeywords.some(k => reservation.subCategory.includes(k))) {
      return {
        mainType: 'support',
        subType: 'career',
        generator: 'career',
        confidence: 0.9
      };
    }
    
    // 個別相談系（デフォルト）
    return {
      mainType: 'support',
      subType: 'consultation',
      generator: 'consultation',
      confidence: 0.85
    };
  }
  
  /**
   * カテゴリから面談タイプを判定
   */
  private static detectFromCategory(reservation: any): InterviewTypeDetection {
    const categoryMap: Record<string, InterviewTypeDetection> = {
      '定期面談': { mainType: 'regular', generator: 'regular', confidence: 0.9 },
      'キャリア相談': { mainType: 'support', subType: 'career', generator: 'career', confidence: 0.9 },
      '個別相談': { mainType: 'support', subType: 'consultation', generator: 'consultation', confidence: 0.9 },
      'フィードバック': { mainType: 'support', subType: 'feedback', generator: 'feedback', confidence: 0.95 },
      '退職面談': { mainType: 'special', subType: 'exit', generator: 'special', confidence: 0.95 },
      '復職面談': { mainType: 'special', subType: 'return_to_work', generator: 'special', confidence: 0.95 },
      'インシデント': { mainType: 'special', subType: 'incident_followup', generator: 'special', confidence: 0.95 }
    };
    
    if (categoryMap[reservation.category]) {
      return categoryMap[reservation.category];
    }
    
    // デフォルト
    return { mainType: 'regular', generator: 'regular', confidence: 0.5 };
  }
  
  /**
   * キーワードから面談タイプを推測
   */
  private static detectFromKeywords(reservation: any): InterviewTypeDetection {
    const details = (reservation.consultationDetails || '').toLowerCase();
    const topic = (reservation.consultationTopic || '').toLowerCase();
    const combined = `${details} ${topic}`;
    
    // 特別面談のキーワード
    if (combined.includes('退職') || combined.includes('離職')) {
      return { mainType: 'special', subType: 'exit', generator: 'special', confidence: 0.8 };
    }
    if (combined.includes('復職') || combined.includes('復帰')) {
      return { mainType: 'special', subType: 'return_to_work', generator: 'special', confidence: 0.8 };
    }
    if (combined.includes('インシデント') || combined.includes('事故')) {
      return { mainType: 'special', subType: 'incident_followup', generator: 'special', confidence: 0.8 };
    }
    
    // サポート面談のキーワード
    if (combined.includes('評価') || combined.includes('フィードバック')) {
      return { mainType: 'support', subType: 'feedback', generator: 'feedback', confidence: 0.7 };
    }
    if (combined.includes('キャリア') || combined.includes('昇進')) {
      return { mainType: 'support', subType: 'career', generator: 'career', confidence: 0.7 };
    }
    if (combined.includes('相談') || combined.includes('悩み')) {
      return { mainType: 'support', subType: 'consultation', generator: 'consultation', confidence: 0.7 };
    }
    
    // デフォルト：定期面談
    return { mainType: 'regular', generator: 'regular', confidence: 0.4 };
  }
  
  /**
   * 定期面談の生成（既存のv4-generatorを使用）
   */
  private static async generateRegularInterview(params: UnifiedInterviewParams): Promise<GeneratedBankSheet> {
    const generationParams = {
      interviewType: 'regular' as InterviewType,
      duration: params.duration,
      staffLevel: params.staffProfile.experienceLevel,
      jobRole: params.staffProfile.profession,
      facilityType: params.staffProfile.facility
    };
    
    // v4-generatorを呼び出し
    const sheet = await generateV4InterviewSheet(generationParams);
    
    return sheet;
  }
  
  /**
   * 生成されたシートの後処理
   */
  private static postProcessSheet(
    sheet: GeneratedBankSheet,
    params: UnifiedInterviewParams
  ): GeneratedBankSheet {
    // メタデータの追加・更新
    sheet.metadata = {
      ...sheet.metadata,
      generatedBy: 'UnifiedInterviewGeneratorService',
      generatedAt: new Date().toISOString(),
      reservationId: params.reservation.id,
      staffId: params.staffProfile.staffId,
      staffName: params.staffProfile.staffName
    };
    
    // セクションの順序を確認
    sheet.sections = sheet.sections.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // 質問の必須フラグを確認
    sheet.sections.forEach(section => {
      // 最低1つは必須質問を含める
      const hasRequired = section.questions.some(q => q.isRequired);
      if (!hasRequired && section.questions.length > 0) {
        section.questions[0].isRequired = true;
      }
    });
    
    // タイトルの調整
    if (!sheet.title.includes(params.staffProfile.staffName)) {
      sheet.title = `${params.staffProfile.staffName}様 ${sheet.title}`;
    }
    
    return sheet;
  }
  
  /**
   * 面談タイプの検証
   */
  static validateInterviewType(type: string): boolean {
    const validTypes = [
      'regular', 'regular_annual', 'regular_monthly', 'regular_quarterly',
      'support', 'feedback',
      'special', 'exit', 'return_to_work', 'incident_followup'
    ];
    return validTypes.includes(type);
  }
  
  /**
   * サポートされている面談タイプのリスト取得
   */
  static getSupportedTypes(): Array<{
    type: string;
    label: string;
    category: string;
    generator: string;
  }> {
    return [
      // 定期面談
      { type: 'regular', label: '定期面談', category: '定期', generator: 'regular' },
      { type: 'regular_annual', label: '年次面談', category: '定期', generator: 'regular' },
      { type: 'regular_monthly', label: '月次面談', category: '定期', generator: 'regular' },
      { type: 'regular_quarterly', label: '四半期面談', category: '定期', generator: 'regular' },
      
      // サポート面談
      { type: 'support_career', label: 'キャリア相談', category: 'サポート', generator: 'career' },
      { type: 'support_consultation', label: '個別相談', category: 'サポート', generator: 'consultation' },
      { type: 'feedback', label: 'フィードバック面談', category: 'サポート', generator: 'feedback' },
      
      // 特別面談
      { type: 'exit', label: '退職面談', category: '特別', generator: 'special' },
      { type: 'return_to_work', label: '復職面談', category: '特別', generator: 'special' },
      { type: 'incident_followup', label: 'インシデント後面談', category: '特別', generator: 'special' }
    ];
  }
}