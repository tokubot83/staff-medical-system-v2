/**
 * v6面談シート 統一型定義
 * 
 * 経験年数分類を統一化し、動機タイプ診断を標準実装
 */

// ===== 経験年数分類（統一定義） =====
export type ExperienceLevel = 'new' | 'junior' | 'midlevel' | 'veteran' | 'leader' | 'manager';

export const ExperienceLevelLabels: Record<ExperienceLevel, string> = {
  new: '新人',        // 1年目
  junior: '若手',     // 2-3年
  midlevel: '中堅',   // 4-10年
  veteran: 'ベテラン', // 11年以上
  leader: '主任',     // 役職
  manager: '師長'     // 役職
};

// 経験年数から分類を判定
export function getExperienceLevel(years: number, isLeader?: boolean, isManager?: boolean): ExperienceLevel {
  if (isManager) return 'manager';
  if (isLeader) return 'leader';
  if (years <= 1) return 'new';
  if (years <= 3) return 'junior';
  if (years <= 10) return 'midlevel';
  return 'veteran';
}

// ===== 職種分類（統一定義） =====
export type ProfessionType = 
  | 'nurse'           // 看護師
  | 'assistant-nurse' // 准看護師
  | 'nursing-aide'    // 看護補助者
  | 'medical-affairs' // 医事課
  | 'rehabilitation'  // リハビリ
  | 'other';         // その他

export const ProfessionLabels: Record<ProfessionType, string> = {
  'nurse': '看護師',
  'assistant-nurse': '准看護師',
  'nursing-aide': '看護補助者',
  'medical-affairs': '医事課',
  'rehabilitation': 'リハビリ',
  'other': 'その他'
};

// ===== 面談時間 =====
export type InterviewDuration = 15 | 30 | 45;

// ===== 動機タイプ（既存サービスと統合） =====
export type MotivationType = 
  | 'achievement'   // 達成動機
  | 'affiliation'   // 親和動機
  | 'power'        // 権力動機
  | 'autonomy'     // 自律動機
  | 'security'     // 安定動機
  | 'growth'       // 成長動機
  | 'contribution' // 貢献動機
  | 'recognition'  // 承認動機
  | 'mixed';       // 複合型

// ===== 面談シート基本情報 =====
export interface InterviewSheetMetadata {
  version: 'v6';
  professionType: ProfessionType;
  experienceLevel: ExperienceLevel;
  duration: InterviewDuration;
  includesMotivationDiagnosis: boolean;
  createdAt: Date;
}

// ===== 面談セクション定義 =====
export interface InterviewSection {
  id: string;
  title: string;
  timeAllocation: number; // 分
  questions: InterviewQuestion[];
  isMotivationDiagnosis?: boolean;
}

// ===== 質問定義 =====
export interface InterviewQuestion {
  id: string;
  content: string;
  type: 'open' | 'scale' | 'choice' | 'motivation';
  required?: boolean;
  // スケール質問用
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: string[];
  // 選択肢質問用
  choices?: string[];
  // 動機タイプ診断用
  motivationOptions?: {
    value: string;
    label: string;
    motivationPoints: Partial<Record<MotivationType, number>>;
  }[];
}

// ===== 面談シートテンプレート =====
export interface InterviewSheetTemplate {
  metadata: InterviewSheetMetadata;
  title: string;
  description: string;
  sections: InterviewSection[];
  totalDuration: InterviewDuration;
}

// ===== ヘルパー関数 =====
export function generateSheetTitle(
  profession: ProfessionType,
  experience: ExperienceLevel,
  duration: InterviewDuration
): string {
  return `${ProfessionLabels[profession]} ${ExperienceLevelLabels[experience]} 定期面談シート（${duration}分版）`;
}

export function calculateTimeAllocation(
  duration: InterviewDuration,
  includesMotivation: boolean
): {
  opening: number;
  motivation?: number;
  mainContent: number;
  closing: number;
} {
  switch (duration) {
    case 15:
      return {
        opening: 2,
        motivation: includesMotivation ? 3 : undefined,
        mainContent: includesMotivation ? 8 : 11,
        closing: 2
      };
    case 30:
      return {
        opening: 3,
        motivation: includesMotivation ? 5 : undefined,
        mainContent: includesMotivation ? 17 : 22,
        closing: 5
      };
    case 45:
      return {
        opening: 5,
        motivation: includesMotivation ? 7 : undefined,
        mainContent: includesMotivation ? 28 : 35,
        closing: 5
      };
  }
}