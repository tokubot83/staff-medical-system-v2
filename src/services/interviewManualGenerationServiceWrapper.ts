/**
 * InterviewManualGenerationService互換性ラッパー
 * 既存のコードとの互換性を保ちながら、新しい統合サービスを使用
 */

import { UnifiedInterviewGeneratorService, UnifiedInterviewParams } from '@/lib/interview-bank/services/unified-generator-service';
import { 
  StaffLevel, 
  JobRole, 
  FacilityType, 
  InterviewDuration 
} from '@/types/staff-common';
import { InterviewType } from '@/types/interview';
import { MotivationType } from './motivationTypeDiagnosisService';

// 既存のManualGenerationRequest型
export interface ManualGenerationRequest {
  staffLevel: StaffLevel;
  jobRole: JobRole;
  facilityType: FacilityType;
  interviewType: InterviewType;
  interviewCategory?: string;
  duration: InterviewDuration;
  motivationType?: MotivationType;
  includeEvaluation?: boolean;
  customTopics?: string[];
}

// 既存のGeneratedInterviewManual型
export interface GeneratedInterviewManual {
  id: string;
  title: string;
  generatedAt: Date;
  estimatedDuration: number;
  staffInfo: {
    level: StaffLevel;
    jobRole: JobRole;
    facility: FacilityType;
    levelDescription: string;
  };
  overview: {
    purpose: string;
    objectives: string[];
    keyPoints: string[];
    preparationItems: string[];
  };
  sections: ManualSection[];
  timeAllocation: TimeAllocation[];
  guidelines: {
    dos: string[];
    donts: string[];
    tips: string[];
  };
}

export interface ManualSection {
  id: string;
  title: string;
  duration: number;
  purpose: string;
  questions: DetailedQuestion[];
  guidance: {
    introduction: string;
    keyPoints: string[];
    transitionPhrase: string;
  };
}

export interface DetailedQuestion {
  id: string;
  question: string;
  type: string;
  required: boolean;
  details?: {
    purpose: string;
    askingTips: string[];
    expectedAnswers?: string[];
    followUpQuestions?: string[];
    redFlags?: string[];
  };
  scale?: {
    min: number;
    max: number;
    labels: string[];
    description: string;
  };
  checklistItems?: {
    item: string;
    description: string;
  }[];
  hybridInput?: {
    scaleLabel: string;
    textLabel: string;
    textPlaceholder: string;
    requireText: boolean;
  };
}

export interface TimeAllocation {
  section: string;
  minutes: number;
  percentage: number;
}

/**
 * 互換性ラッパークラス
 * 既存のInterviewManualGenerationServiceのインターフェースを維持しながら
 * 内部で新しい統合サービスを使用
 */
export class InterviewManualGenerationService {
  
  /**
   * 面談マニュアルを動的生成（互換性メソッド）
   */
  static async generateManual(
    request: ManualGenerationRequest
  ): Promise<GeneratedInterviewManual> {
    
    try {
      // 既存のパラメータを統合サービス用に変換
      const unifiedParams: UnifiedInterviewParams = {
        interviewType: this.mapInterviewType(request.interviewType),
        subType: request.interviewCategory,
        duration: request.duration,
        
        staffProfile: {
          staffId: 'legacy_' + Date.now(),
          staffName: '職員',
          profession: request.jobRole,
          experienceLevel: this.mapStaffLevelToExperience(request.staffLevel),
          facility: request.facilityType,
          department: '',
          position: this.getPositionFromLevel(request.staffLevel),
          yearsOfService: this.getYearsFromLevel(request.staffLevel),
          yearsOfExperience: this.getYearsFromLevel(request.staffLevel),
          hasManagementExperience: ['chief', 'manager'].includes(request.staffLevel)
        },
        
        reservation: {
          id: 'legacy_res_' + Date.now(),
          type: request.interviewType,
          category: request.interviewCategory,
          duration: request.duration,
          scheduledDate: new Date(),
          
          // カスタムトピックがある場合はサポート面談として扱う
          consultationDetails: request.customTopics?.join(', '),
          urgency: 'medium'
        }
      };
      
      // 統合サービスで生成
      const generatedSheet = await UnifiedInterviewGeneratorService.generate(unifiedParams);
      
      // 生成されたシートを既存の形式に変換
      return this.convertToLegacyFormat(generatedSheet, request);
      
    } catch (error) {
      console.error('[InterviewManualGenerationServiceWrapper] Error:', error);
      // フォールバック：基本的なマニュアルを返す
      return this.createFallbackManual(request);
    }
  }
  
  /**
   * 面談タイプのマッピング
   */
  private static mapInterviewType(type: InterviewType): 'regular' | 'support' | 'special' {
    if (type.includes('support') || type === 'feedback' || type === 'career_support') {
      return 'support';
    }
    if (type === 'return_to_work' || type === 'incident_followup' || type === 'exit_interview') {
      return 'special';
    }
    return 'regular';
  }
  
  /**
   * 職員レベルを経験レベルにマッピング
   */
  private static mapStaffLevelToExperience(level: StaffLevel): string {
    const mapping: Record<StaffLevel, string> = {
      'new': 'new',
      'junior': 'junior',
      'general': 'midlevel',
      'midlevel': 'midlevel',
      'senior': 'senior',
      'veteran': 'veteran',
      'leader': 'veteran',
      'chief': 'supervisor',
      'manager': 'manager'
    };
    return mapping[level] || 'midlevel';
  }
  
  /**
   * レベルから役職を推定
   */
  private static getPositionFromLevel(level: StaffLevel): string {
    const positions: Record<StaffLevel, string> = {
      'new': '新人職員',
      'junior': '職員',
      'general': '一般職員',
      'midlevel': '中堅職員',
      'senior': '上級職員',
      'veteran': 'ベテラン職員',
      'leader': 'リーダー',
      'chief': '主任',
      'manager': '管理職'
    };
    return positions[level] || '職員';
  }
  
  /**
   * レベルから経験年数を推定
   */
  private static getYearsFromLevel(level: StaffLevel): number {
    const years: Record<StaffLevel, number> = {
      'new': 0,
      'junior': 1,
      'general': 2,
      'midlevel': 4,
      'senior': 6,
      'veteran': 8,
      'leader': 10,
      'chief': 12,
      'manager': 15
    };
    return years[level] || 3;
  }
  
  /**
   * 新形式から旧形式への変換
   */
  private static convertToLegacyFormat(
    sheet: any,
    request: ManualGenerationRequest
  ): GeneratedInterviewManual {
    return {
      id: sheet.id,
      title: sheet.title,
      generatedAt: sheet.generatedAt || new Date(),
      estimatedDuration: sheet.duration,
      
      staffInfo: {
        level: request.staffLevel,
        jobRole: request.jobRole,
        facility: request.facilityType,
        levelDescription: this.getStaffLevelDescription(request.staffLevel)
      },
      
      overview: {
        purpose: '面談を通じた職員の状況把握と支援',
        objectives: ['現状確認', '課題把握', '目標設定', 'フォローアップ'],
        keyPoints: ['傾聴', '共感', '具体的支援'],
        preparationItems: ['面談記録', '評価データ', '静かな場所']
      },
      
      sections: sheet.sections.map((section: any) => ({
        id: section.id,
        title: section.title,
        duration: section.duration,
        purpose: section.description || '',
        questions: section.questions.map((q: any) => ({
          id: q.id,
          question: q.text || q.question || '',
          type: q.type || 'open',
          required: q.isRequired || false,
          details: {
            purpose: q.category || '',
            askingTips: Array.isArray(q.tags) ? q.tags : [],
            expectedAnswers: [],
            followUpQuestions: [],
            redFlags: []
          },
          scale: q.scaleLabel ? {
            min: 1,
            max: 5,
            labels: ['1', '2', '3', '4', '5'],
            description: q.scaleLabel
          } : undefined,
          hybridInput: q.type === 'hybrid' ? {
            scaleLabel: q.scaleLabel || '',
            textLabel: q.textLabel || '',
            textPlaceholder: q.textPlaceholder || '',
            requireText: false
          } : undefined
        })),
        guidance: {
          introduction: '本セクションを開始します',
          keyPoints: ['時間配分に注意', '傾聴の姿勢'],
          transitionPhrase: '次のセクションに移ります'
        }
      })),
      
      timeAllocation: sheet.sections.map((s: any) => ({
        section: s.title,
        minutes: s.duration,
        percentage: Math.round((s.duration / sheet.duration) * 100)
      })),
      
      guidelines: {
        dos: ['傾聴の姿勢', '共感的対応', '具体例を引き出す'],
        donts: ['批判的態度', '時間超過', 'プライバシー侵害'],
        tips: ['面談タイプに応じた対応', '職員の状況に配慮']
      }
    };
  }
  
  /**
   * 職員レベルの説明
   */
  private static getStaffLevelDescription(level: StaffLevel): string {
    const descriptions: Record<StaffLevel, string> = {
      'new': '入職1年未満の新人職員',
      'junior': '1-2年目の初級職員',
      'general': '2-3年目の一般職員',
      'midlevel': '3-5年目の中堅職員',
      'senior': '5-7年目の上級職員',
      'veteran': '7-10年目のベテラン職員',
      'leader': '10年以上のリーダー職員',
      'chief': '主任級職員',
      'manager': '管理職'
    };
    return descriptions[level] || '職員';
  }
  
  /**
   * フォールバックマニュアルの作成
   */
  private static createFallbackManual(request: ManualGenerationRequest): GeneratedInterviewManual {
    return {
      id: `fallback_${Date.now()}`,
      title: `${this.getInterviewTypeLabel(request.interviewType)}面談マニュアル（${request.duration}分）`,
      generatedAt: new Date(),
      estimatedDuration: request.duration,
      
      staffInfo: {
        level: request.staffLevel,
        jobRole: request.jobRole,
        facility: request.facilityType,
        levelDescription: this.getStaffLevelDescription(request.staffLevel)
      },
      
      overview: {
        purpose: '面談を通じた職員支援',
        objectives: ['現状確認', '課題把握', '支援策検討'],
        keyPoints: ['傾聴', '共感', '具体的支援'],
        preparationItems: ['面談記録', '静かな場所']
      },
      
      sections: [
        {
          id: 'intro',
          title: '導入',
          duration: 5,
          purpose: '関係構築と目的確認',
          questions: [
            {
              id: 'q1',
              question: '最近の調子はいかがですか？',
              type: 'open',
              required: true,
              details: {
                purpose: '現状確認',
                askingTips: ['リラックスした雰囲気で'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '温かく迎える',
            keyPoints: ['リラックス', '目的説明'],
            transitionPhrase: '次に進みます'
          }
        },
        {
          id: 'main',
          title: 'メイン',
          duration: request.duration - 10,
          purpose: '主要な内容の確認',
          questions: [
            {
              id: 'q2',
              question: '業務について話を聞かせてください',
              type: 'open',
              required: true,
              details: {
                purpose: '業務状況確認',
                askingTips: ['具体例を聞く'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '本題に入ります',
            keyPoints: ['傾聴', '共感'],
            transitionPhrase: 'まとめに入ります'
          }
        },
        {
          id: 'closing',
          title: 'クロージング',
          duration: 5,
          purpose: 'まとめと次回確認',
          questions: [
            {
              id: 'q3',
              question: '今後のサポートについて',
              type: 'open',
              required: false,
              details: {
                purpose: 'フォローアップ',
                askingTips: ['具体的な支援策'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: 'まとめます',
            keyPoints: ['確認', '励まし'],
            transitionPhrase: 'お疲れ様でした'
          }
        }
      ],
      
      timeAllocation: [
        { section: '導入', minutes: 5, percentage: Math.round(5 / request.duration * 100) },
        { section: 'メイン', minutes: request.duration - 10, percentage: Math.round((request.duration - 10) / request.duration * 100) },
        { section: 'クロージング', minutes: 5, percentage: Math.round(5 / request.duration * 100) }
      ],
      
      guidelines: {
        dos: ['傾聴', '共感', '支援'],
        donts: ['批判', '押し付け'],
        tips: ['個別性を重視']
      }
    };
  }
  
  /**
   * 面談タイプのラベル取得
   */
  private static getInterviewTypeLabel(type: InterviewType): string {
    const labels: Record<string, string> = {
      'regular_annual': '定期',
      'new_employee_monthly': '新人',
      'management_biannual': '管理職',
      'feedback': 'フィードバック',
      'career_support': 'キャリア支援',
      'workplace_support': '職場環境',
      'individual_consultation': '個別相談',
      'return_to_work': '復職',
      'incident_followup': 'インシデント後',
      'exit_interview': '退職'
    };
    return labels[type] || '面談';
  }
}

// 既存のコードとの互換性のため、旧サービスの型もエクスポート
export type { 
  StaffLevel,
  JobRole,
  FacilityType,
  InterviewDuration
} from '@/types/staff-common';

export type {
  InterviewType
} from '@/types/interview';

export type {
  MotivationType
} from './motivationTypeDiagnosisService';