/**
 * v6面談テンプレートサービス
 * 
 * 従来テンプレート（v6）の管理と提供
 */

import { 
  ProfessionType, 
  ExperienceLevel, 
  InterviewDuration,
  InterviewSheetTemplate,
  getExperienceLevel
} from '@/components/interview-sheets/v6/shared/types';
import { generateInterviewSheet, GeneratorParams } from '@/components/interview-sheets/v6/generator/sheet-generator';

export interface V6TemplateParams {
  staffName: string;
  department: string;
  position: string;
  experienceYears: number;
  experienceMonths: number;
  interviewType: string;
  duration: InterviewDuration;
  includeMotivationDiagnosis?: boolean;
}

export class V6InterviewTemplateService {
  /**
   * 職種を判定
   */
  private static detectProfessionType(position: string): ProfessionType {
    const positionLower = position.toLowerCase();
    
    if (positionLower.includes('看護師') && !positionLower.includes('准')) {
      return 'nurse';
    }
    if (positionLower.includes('准看護師')) {
      return 'assistant-nurse';
    }
    if (positionLower.includes('看護補助') || positionLower.includes('看護助手')) {
      return 'nursing-aide';
    }
    if (positionLower.includes('医事') || positionLower.includes('事務')) {
      return 'medical-affairs';
    }
    if (positionLower.includes('リハビリ') || 
        positionLower.includes('理学療法') || 
        positionLower.includes('作業療法') ||
        positionLower.includes('言語聴覚')) {
      return 'rehabilitation';
    }
    
    return 'other';
  }

  /**
   * 役職を判定
   */
  private static detectLeadershipRole(position: string): { isLeader: boolean; isManager: boolean } {
    const positionLower = position.toLowerCase();
    
    const isManager = positionLower.includes('師長') || 
                      positionLower.includes('課長') ||
                      positionLower.includes('部長') ||
                      positionLower.includes('管理');
                      
    const isLeader = !isManager && (
                     positionLower.includes('主任') ||
                     positionLower.includes('リーダー') ||
                     positionLower.includes('チーフ'));
    
    return { isLeader, isManager };
  }

  /**
   * 面談タイプから動機診断の要否を判定
   */
  private static shouldIncludeMotivation(interviewType: string, experienceYears: number): boolean {
    // 新人は原則含める
    if (experienceYears <= 1) {
      return true;
    }
    
    // 特定の面談タイプは含める
    const motivationTypes = ['new_employee_monthly', 'first_interview', 'career_development'];
    return motivationTypes.some(type => interviewType.includes(type));
  }

  /**
   * v6テンプレートを取得
   */
  static getTemplate(params: V6TemplateParams): InterviewSheetTemplate {
    const {
      position,
      experienceYears,
      interviewType,
      duration,
      includeMotivationDiagnosis
    } = params;

    // 職種を判定
    const professionType = this.detectProfessionType(position);
    
    // 役職を判定
    const { isLeader, isManager } = this.detectLeadershipRole(position);
    
    // 動機診断の要否を判定（指定がない場合は自動判定）
    const shouldIncludeMotivation = includeMotivationDiagnosis ?? 
                                   this.shouldIncludeMotivation(interviewType, experienceYears);

    // ジェネレーターパラメータを構築
    const generatorParams: GeneratorParams = {
      professionType,
      experienceYears,
      isLeader,
      isManager,
      duration,
      includeMotivationDiagnosis: shouldIncludeMotivation
    };

    // 面談シートを生成
    return generateInterviewSheet(generatorParams);
  }

  /**
   * 利用可能なテンプレート一覧を取得
   */
  static getAvailableTemplates(): Array<{
    id: string;
    title: string;
    description: string;
    profession: ProfessionType;
    experience: ExperienceLevel;
    duration: InterviewDuration;
    hasMotivation: boolean;
  }> {
    const templates = [];
    const professions: ProfessionType[] = ['nurse', 'assistant-nurse', 'nursing-aide', 'medical-affairs'];
    const experiences: ExperienceLevel[] = ['new', 'junior', 'midlevel', 'veteran', 'leader', 'manager'];
    const durations: InterviewDuration[] = [15, 30, 45];

    for (const profession of professions) {
      for (const experience of experiences) {
        // 管理職は医事課以外スキップ（看護師は師長として別扱い）
        if (experience === 'manager' && profession !== 'nurse') continue;
        
        for (const duration of durations) {
          const hasMotivation = experience === 'new'; // 新人のみデフォルトで動機診断
          
          templates.push({
            id: `v6_${profession}_${experience}_${duration}`,
            title: `${this.getProfessionLabel(profession)} ${this.getExperienceLabel(experience)} ${duration}分版`,
            description: this.getTemplateDescription(profession, experience, duration, hasMotivation),
            profession,
            experience,
            duration,
            hasMotivation
          });
        }
      }
    }

    return templates;
  }

  /**
   * 職種ラベルを取得
   */
  private static getProfessionLabel(profession: ProfessionType): string {
    const labels: Record<ProfessionType, string> = {
      'nurse': '看護師',
      'assistant-nurse': '准看護師',
      'nursing-aide': '看護補助者',
      'medical-affairs': '医事課',
      'rehabilitation': 'リハビリ',
      'other': 'その他'
    };
    return labels[profession];
  }

  /**
   * 経験レベルラベルを取得
   */
  private static getExperienceLabel(experience: ExperienceLevel): string {
    const labels: Record<ExperienceLevel, string> = {
      'new': '新人',
      'junior': '若手',
      'midlevel': '中堅',
      'veteran': 'ベテラン',
      'leader': '主任',
      'manager': '師長'
    };
    return labels[experience];
  }

  /**
   * テンプレート説明を生成
   */
  private static getTemplateDescription(
    profession: ProfessionType,
    experience: ExperienceLevel,
    duration: InterviewDuration,
    hasMotivation: boolean
  ): string {
    let desc = `${this.getProfessionLabel(profession)}の`;
    desc += `${this.getExperienceLabel(experience)}向け${duration}分面談。`;
    
    const focus: Record<ExperienceLevel, string> = {
      'new': '職場適応と基礎習得',
      'junior': 'スキル向上と自立',
      'midlevel': '専門性とキャリア',
      'veteran': '経験活用と継承',
      'leader': 'リーダーシップ',
      'manager': 'マネジメント'
    };
    
    desc += `${focus[experience]}を重視。`;
    
    if (hasMotivation) {
      desc += '動機タイプ診断付き。';
    }
    
    return desc;
  }

  /**
   * 簡易テンプレート取得（後方互換性用）
   */
  static getQuickTemplate(
    jobRole: string,
    experienceMonths: number,
    duration: InterviewDuration = 30
  ): InterviewSheetTemplate {
    const experienceYears = Math.floor(experienceMonths / 12);
    
    return this.getTemplate({
      staffName: '',
      department: '',
      position: jobRole,
      experienceYears,
      experienceMonths,
      interviewType: 'regular',
      duration,
      includeMotivationDiagnosis: experienceYears <= 1
    });
  }
}