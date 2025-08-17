/**
 * v6面談シート ジェネレーター
 * 
 * 職種、経験年数、時間に応じて適切な面談シートを生成
 */

import {
  ProfessionType,
  ExperienceLevel,
  InterviewDuration,
  InterviewSheetTemplate,
  InterviewSection,
  generateSheetTitle,
  getExperienceLevel
} from '../shared/types';

import {
  createMotivationDiagnosisSection,
  createCoreQuestions,
  createWorkEnvironmentSection,
  createGoalSettingSection
} from '../shared/templates';

export interface GeneratorParams {
  professionType: ProfessionType;
  experienceYears: number;
  isLeader?: boolean;
  isManager?: boolean;
  duration: InterviewDuration;
  includeMotivationDiagnosis?: boolean;
}

/**
 * 面談シートを動的に生成
 */
export function generateInterviewSheet(params: GeneratorParams): InterviewSheetTemplate {
  const {
    professionType,
    experienceYears,
    isLeader,
    isManager,
    duration,
    includeMotivationDiagnosis = (experienceYears <= 1) // 新人はデフォルトで動機診断含む
  } = params;

  const experienceLevel = getExperienceLevel(experienceYears, isLeader, isManager);
  
  // セクション構成を作成
  const sections: InterviewSection[] = [];

  // 1. オープニング
  sections.push({
    id: 'opening',
    title: 'オープニング',
    timeAllocation: duration === 15 ? 2 : duration === 30 ? 3 : 5,
    questions: [
      {
        id: 'greeting',
        content: getOpeningMessage(experienceLevel),
        type: 'open'
      }
    ]
  });

  // 2. 動機タイプ診断（該当者のみ）
  if (includeMotivationDiagnosis) {
    sections.push(createMotivationDiagnosisSection(duration));
  }

  // 3. メインコンテンツ
  const mainSection = createMainContentSection(
    professionType,
    experienceLevel,
    duration,
    includeMotivationDiagnosis
  );
  sections.push(mainSection);

  // 4. 職場環境・人間関係
  sections.push(createWorkEnvironmentSection(duration));

  // 5. 職種別特有セクション
  const specialSection = createProfessionSpecificSection(professionType, experienceLevel, duration);
  if (specialSection) {
    sections.push(specialSection);
  }

  // 6. 目標設定
  sections.push(createGoalSettingSection(experienceLevel));

  // 7. クロージング
  sections.push({
    id: 'closing',
    title: 'クロージング',
    timeAllocation: duration === 15 ? 2 : duration === 30 ? 3 : 5,
    questions: [
      {
        id: 'additional_comments',
        content: '他に相談したいことや伝えたいことはありますか？',
        type: 'open'
      },
      {
        id: 'next_interview',
        content: '次回の面談で重点的に話したいテーマはありますか？',
        type: 'open'
      }
    ]
  });

  return {
    metadata: {
      version: 'v6',
      professionType,
      experienceLevel,
      duration,
      includesMotivationDiagnosis: includeMotivationDiagnosis,
      createdAt: new Date()
    },
    title: generateSheetTitle(professionType, experienceLevel, duration),
    description: generateDescription(professionType, experienceLevel, duration, includeMotivationDiagnosis),
    sections,
    totalDuration: duration
  };
}

/**
 * オープニングメッセージを生成
 */
function getOpeningMessage(experienceLevel: ExperienceLevel): string {
  switch (experienceLevel) {
    case 'new':
      return '本日の体調はいかがですか？リラックスして話してくださいね。';
    case 'junior':
      return '最近の調子はいかがですか？前回の面談から変化はありましたか？';
    case 'midlevel':
      return '日々の業務お疲れ様です。最近の状況を聞かせてください。';
    case 'veteran':
      return 'いつもありがとうございます。最近の体調や業務状況はいかがですか？';
    case 'leader':
    case 'manager':
      return 'お忙しい中ありがとうございます。チームや組織の状況も含めて聞かせてください。';
    default:
      return '本日の調子はいかがですか？';
  }
}

/**
 * メインコンテンツセクションを作成
 */
function createMainContentSection(
  professionType: ProfessionType,
  experienceLevel: ExperienceLevel,
  duration: InterviewDuration,
  includeMotivationDiagnosis: boolean
): InterviewSection {
  const baseTime = duration === 15 ? 8 : duration === 30 ? 17 : 28;
  const timeAllocation = includeMotivationDiagnosis 
    ? baseTime - (duration === 15 ? 3 : 5)
    : baseTime;

  const title = getMainSectionTitle(experienceLevel);
  const questions = createCoreQuestions(experienceLevel);

  return {
    id: 'main_content',
    title,
    timeAllocation,
    questions
  };
}

/**
 * メインセクションのタイトルを取得
 */
function getMainSectionTitle(experienceLevel: ExperienceLevel): string {
  switch (experienceLevel) {
    case 'new':
      return '業務習得状況・職場適応';
    case 'junior':
      return 'スキル向上・自立度確認';
    case 'midlevel':
      return '専門性発揮・役割遂行';
    case 'veteran':
      return '経験活用・知識継承';
    case 'leader':
      return 'リーダーシップ・チーム運営';
    case 'manager':
      return 'マネジメント・組織運営';
    default:
      return '業務状況確認';
  }
}

/**
 * 職種別特有セクションを作成
 */
function createProfessionSpecificSection(
  professionType: ProfessionType,
  experienceLevel: ExperienceLevel,
  duration: InterviewDuration
): InterviewSection | null {
  if (duration === 15) return null; // 15分版では省略

  switch (professionType) {
    case 'nurse':
    case 'assistant-nurse':
      return {
        id: 'clinical_skills',
        title: '臨床スキル・患者対応',
        timeAllocation: duration === 30 ? 5 : 7,
        questions: [
          {
            id: 'patient_care',
            content: '患者さんとのコミュニケーションで工夫していることは？',
            type: 'open'
          },
          {
            id: 'clinical_challenges',
            content: '臨床で困難を感じる場面とその対処法を教えてください',
            type: 'open'
          },
          ...(experienceLevel !== 'new' ? [{
            id: 'skill_sharing',
            content: '自身の専門スキルをチームにどう活かしていますか？',
            type: 'open'
          }] : [])
        ]
      };

    case 'nursing-aide':
      return {
        id: 'support_skills',
        title: '介助スキル・連携',
        timeAllocation: duration === 30 ? 5 : 7,
        questions: [
          {
            id: 'care_support',
            content: '日常生活援助で心がけていることは？',
            type: 'open'
          },
          {
            id: 'team_collaboration',
            content: '看護師との連携で重要だと思うことは？',
            type: 'open'
          }
        ]
      };

    case 'medical-affairs':
      return {
        id: 'administrative_skills',
        title: '事務処理・業務改善',
        timeAllocation: duration === 30 ? 5 : 7,
        questions: [
          {
            id: 'accuracy',
            content: '業務の正確性を保つための工夫は？',
            type: 'open'
          },
          {
            id: 'efficiency',
            content: '業務効率化のアイデアがあれば教えてください',
            type: 'open'
          }
        ]
      };

    default:
      return null;
  }
}

/**
 * 説明文を生成
 */
function generateDescription(
  professionType: ProfessionType,
  experienceLevel: ExperienceLevel,
  duration: InterviewDuration,
  includeMotivationDiagnosis: boolean
): string {
  const experienceDesc = {
    new: '新人（1年目）',
    junior: '若手（2-3年）',
    midlevel: '中堅（4-10年）',
    veteran: 'ベテラン（11年以上）',
    leader: '主任',
    manager: '師長・管理職'
  };

  const focus = {
    new: '職場適応と基礎スキル習得',
    junior: 'スキル向上と自立',
    midlevel: '専門性発揮とキャリア開発',
    veteran: '経験活用と後進育成',
    leader: 'リーダーシップとチーム運営',
    manager: 'マネジメントと組織改善'
  };

  let description = `${experienceDesc[experienceLevel]}の定期面談シート。`;
  description += `${focus[experienceLevel]}を重点的に確認します。`;
  
  if (includeMotivationDiagnosis) {
    description += '動機タイプ診断を含み、個別化された育成方針の策定に活用できます。';
  }

  return description;
}