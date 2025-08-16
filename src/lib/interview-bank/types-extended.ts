// 定期面談バンク - 拡張型定義（役職・部署対応）
// 経験年数と役職の2軸管理システム

import { 
  ExperienceLevel, 
  FacilityType, 
  InterviewDuration,
  MotivationType,
  QuestionType,
  InterviewQuestion 
} from './types';

// === 役職タイプ定義 ===
export type PositionLevel = 
  | 'staff'           // 一般スタッフ
  | 'leader'          // リーダー・チームリーダー
  | 'chief'           // 主任
  | 'assistant_manager' // 副師長・係長
  | 'manager'         // 師長・課長
  | 'deputy_director' // 副部長
  | 'director'        // 部長
  | 'executive';      // 役員・経営層

// 職種カテゴリー
export type ProfessionCategory = 
  | 'nursing'          // 看護部門
  | 'medical_affairs'  // 医事部門
  | 'rehabilitation'   // リハビリ部門
  | 'administration'   // 事務部門
  | 'pharmacy'         // 薬剤部門
  | 'laboratory'       // 検査部門
  | 'radiology'        // 放射線部門
  | 'nutrition'        // 栄養部門
  | 'social_work';     // 医療相談部門

// 部署タイプ
export type DepartmentType = 
  | 'ward'            // 病棟
  | 'outpatient'      // 外来
  | 'emergency'       // 救急
  | 'icu'            // ICU
  | 'operating_room'  // 手術室
  | 'dialysis'       // 透析
  | 'endoscopy'      // 内視鏡
  | 'rehabilitation' // リハビリ
  | 'central_supply' // 中央材料
  | 'administration'; // 管理部門

// === 詳細な役職定義 ===
export interface PositionDetail {
  id: string;
  name: string;
  nameEn?: string;
  category: ProfessionCategory;
  department?: DepartmentType;
  level: PositionLevel;
  hierarchyLevel: number; // 1-8の階層レベル
  requiresLicense?: string[]; // 必要な資格
  minExperienceYears?: number; // 最低必要経験年数
  description?: string;
}

// === 看護部門の役職定義 ===
export const nursingPositions: PositionDetail[] = [
  // 病棟看護
  { id: 'ward_nurse', name: '病棟看護師', category: 'nursing', department: 'ward', level: 'staff', hierarchyLevel: 1 },
  { id: 'ward_senior_nurse', name: '病棟シニア看護師', category: 'nursing', department: 'ward', level: 'staff', hierarchyLevel: 2, minExperienceYears: 3 },
  { id: 'ward_team_leader', name: '病棟チームリーダー', category: 'nursing', department: 'ward', level: 'leader', hierarchyLevel: 3, minExperienceYears: 5 },
  { id: 'ward_chief_nurse', name: '病棟主任看護師', category: 'nursing', department: 'ward', level: 'chief', hierarchyLevel: 4, minExperienceYears: 7 },
  { id: 'ward_assistant_manager', name: '病棟副師長', category: 'nursing', department: 'ward', level: 'assistant_manager', hierarchyLevel: 5, minExperienceYears: 10 },
  { id: 'ward_manager', name: '病棟師長', category: 'nursing', department: 'ward', level: 'manager', hierarchyLevel: 6, minExperienceYears: 12 },
  
  // 外来看護
  { id: 'op_nurse', name: '外来看護師', category: 'nursing', department: 'outpatient', level: 'staff', hierarchyLevel: 1 },
  { id: 'op_senior_nurse', name: '外来シニア看護師', category: 'nursing', department: 'outpatient', level: 'staff', hierarchyLevel: 2, minExperienceYears: 3 },
  { id: 'op_team_leader', name: '外来チームリーダー', category: 'nursing', department: 'outpatient', level: 'leader', hierarchyLevel: 3, minExperienceYears: 5 },
  { id: 'op_chief_nurse', name: '外来主任看護師', category: 'nursing', department: 'outpatient', level: 'chief', hierarchyLevel: 4, minExperienceYears: 7 },
  { id: 'op_assistant_manager', name: '外来副師長', category: 'nursing', department: 'outpatient', level: 'assistant_manager', hierarchyLevel: 5, minExperienceYears: 10 },
  { id: 'op_manager', name: '外来師長', category: 'nursing', department: 'outpatient', level: 'manager', hierarchyLevel: 6, minExperienceYears: 12 },
  
  // 救急・ICU
  { id: 'er_nurse', name: '救急看護師', category: 'nursing', department: 'emergency', level: 'staff', hierarchyLevel: 1 },
  { id: 'er_chief_nurse', name: '救急主任看護師', category: 'nursing', department: 'emergency', level: 'chief', hierarchyLevel: 4, minExperienceYears: 7 },
  { id: 'er_manager', name: '救急師長', category: 'nursing', department: 'emergency', level: 'manager', hierarchyLevel: 6, minExperienceYears: 12 },
  { id: 'icu_nurse', name: 'ICU看護師', category: 'nursing', department: 'icu', level: 'staff', hierarchyLevel: 1 },
  { id: 'icu_chief_nurse', name: 'ICU主任看護師', category: 'nursing', department: 'icu', level: 'chief', hierarchyLevel: 4, minExperienceYears: 7 },
  { id: 'icu_manager', name: 'ICU師長', category: 'nursing', department: 'icu', level: 'manager', hierarchyLevel: 6, minExperienceYears: 12 },
  
  // 手術室
  { id: 'or_nurse', name: '手術室看護師', category: 'nursing', department: 'operating_room', level: 'staff', hierarchyLevel: 1 },
  { id: 'or_chief_nurse', name: '手術室主任看護師', category: 'nursing', department: 'operating_room', level: 'chief', hierarchyLevel: 4, minExperienceYears: 7 },
  { id: 'or_manager', name: '手術室師長', category: 'nursing', department: 'operating_room', level: 'manager', hierarchyLevel: 6, minExperienceYears: 12 },
  
  // 看護部管理職
  { id: 'nursing_deputy_director', name: '看護副部長', category: 'nursing', level: 'deputy_director', hierarchyLevel: 7, minExperienceYears: 15 },
  { id: 'nursing_director', name: '看護部長', category: 'nursing', level: 'director', hierarchyLevel: 8, minExperienceYears: 20 }
];

// === 医事部門の役職定義 ===
export const medicalAffairsPositions: PositionDetail[] = [
  { id: 'ma_staff', name: '医事課職員', category: 'medical_affairs', level: 'staff', hierarchyLevel: 1 },
  { id: 'ma_senior_staff', name: '医事課シニア職員', category: 'medical_affairs', level: 'staff', hierarchyLevel: 2, minExperienceYears: 3 },
  { id: 'ma_leader', name: '医事課リーダー', category: 'medical_affairs', level: 'leader', hierarchyLevel: 3, minExperienceYears: 5 },
  { id: 'ma_chief', name: '医事課主任', category: 'medical_affairs', level: 'chief', hierarchyLevel: 4, minExperienceYears: 7 },
  { id: 'ma_assistant_manager', name: '医事課係長', category: 'medical_affairs', level: 'assistant_manager', hierarchyLevel: 5, minExperienceYears: 10 },
  { id: 'ma_manager', name: '医事課課長', category: 'medical_affairs', level: 'manager', hierarchyLevel: 6, minExperienceYears: 12 },
  { id: 'ma_deputy_director', name: '医事副部長', category: 'medical_affairs', level: 'deputy_director', hierarchyLevel: 7, minExperienceYears: 15 },
  { id: 'ma_director', name: '医事部長', category: 'medical_affairs', level: 'director', hierarchyLevel: 8, minExperienceYears: 20 }
];

// === リハビリ部門の役職定義 ===
export const rehabilitationPositions: PositionDetail[] = [
  // 理学療法士
  { id: 'pt_staff', name: '理学療法士', category: 'rehabilitation', level: 'staff', hierarchyLevel: 1, requiresLicense: ['理学療法士'] },
  { id: 'pt_senior', name: 'シニア理学療法士', category: 'rehabilitation', level: 'staff', hierarchyLevel: 2, minExperienceYears: 3 },
  { id: 'pt_leader', name: 'PTチームリーダー', category: 'rehabilitation', level: 'leader', hierarchyLevel: 3, minExperienceYears: 5 },
  { id: 'pt_chief', name: 'PT主任', category: 'rehabilitation', level: 'chief', hierarchyLevel: 4, minExperienceYears: 7 },
  { id: 'pt_manager', name: 'PT科長', category: 'rehabilitation', level: 'manager', hierarchyLevel: 6, minExperienceYears: 12 },
  
  // 作業療法士
  { id: 'ot_staff', name: '作業療法士', category: 'rehabilitation', level: 'staff', hierarchyLevel: 1, requiresLicense: ['作業療法士'] },
  { id: 'ot_senior', name: 'シニア作業療法士', category: 'rehabilitation', level: 'staff', hierarchyLevel: 2, minExperienceYears: 3 },
  { id: 'ot_leader', name: 'OTチームリーダー', category: 'rehabilitation', level: 'leader', hierarchyLevel: 3, minExperienceYears: 5 },
  { id: 'ot_chief', name: 'OT主任', category: 'rehabilitation', level: 'chief', hierarchyLevel: 4, minExperienceYears: 7 },
  { id: 'ot_manager', name: 'OT科長', category: 'rehabilitation', level: 'manager', hierarchyLevel: 6, minExperienceYears: 12 },
  
  // 言語聴覚士
  { id: 'st_staff', name: '言語聴覚士', category: 'rehabilitation', level: 'staff', hierarchyLevel: 1, requiresLicense: ['言語聴覚士'] },
  { id: 'st_senior', name: 'シニア言語聴覚士', category: 'rehabilitation', level: 'staff', hierarchyLevel: 2, minExperienceYears: 3 },
  { id: 'st_leader', name: 'STチームリーダー', category: 'rehabilitation', level: 'leader', hierarchyLevel: 3, minExperienceYears: 5 },
  { id: 'st_chief', name: 'ST主任', category: 'rehabilitation', level: 'chief', hierarchyLevel: 4, minExperienceYears: 7 },
  
  // リハビリ部管理職
  { id: 'rehab_deputy_director', name: 'リハビリ副部長', category: 'rehabilitation', level: 'deputy_director', hierarchyLevel: 7, minExperienceYears: 15 },
  { id: 'rehab_director', name: 'リハビリ部長', category: 'rehabilitation', level: 'director', hierarchyLevel: 8, minExperienceYears: 20 }
];

// === 役職別の質問カテゴリー ===
export interface PositionSpecificQuestions {
  positionLevel: PositionLevel;
  requiredSections: string[];
  optionalSections: string[];
  focusAreas: string[];
}

export const positionQuestionMapping: Record<PositionLevel, PositionSpecificQuestions> = {
  staff: {
    positionLevel: 'staff',
    requiredSections: ['current_status', 'skill_evaluation', 'support_planning'],
    optionalSections: ['career_development', 'team_environment'],
    focusAreas: ['skill_development', 'adaptation', 'learning']
  },
  leader: {
    positionLevel: 'leader',
    requiredSections: ['current_status', 'skill_evaluation', 'team_coordination', 'support_planning'],
    optionalSections: ['leadership_development', 'problem_solving'],
    focusAreas: ['team_leadership', 'coordination', 'mentoring']
  },
  chief: {
    positionLevel: 'chief',
    requiredSections: ['current_status', 'team_management', 'skill_evaluation', 'organizational_contribution'],
    optionalSections: ['innovation', 'education_training'],
    focusAreas: ['management', 'staff_development', 'quality_improvement']
  },
  assistant_manager: {
    positionLevel: 'assistant_manager',
    requiredSections: ['management_status', 'team_management', 'strategic_planning', 'staff_development'],
    optionalSections: ['budget_management', 'external_relations'],
    focusAreas: ['operational_management', 'staff_evaluation', 'process_improvement']
  },
  manager: {
    positionLevel: 'manager',
    requiredSections: ['management_status', 'strategic_planning', 'staff_management', 'organizational_impact'],
    optionalSections: ['innovation_leadership', 'succession_planning'],
    focusAreas: ['strategic_management', 'organizational_development', 'performance_management']
  },
  deputy_director: {
    positionLevel: 'deputy_director',
    requiredSections: ['executive_status', 'strategic_leadership', 'organizational_transformation', 'cross_department'],
    optionalSections: ['external_partnerships', 'research_development'],
    focusAreas: ['strategic_vision', 'change_management', 'organizational_culture']
  },
  director: {
    positionLevel: 'director',
    requiredSections: ['executive_status', 'strategic_vision', 'organizational_leadership', 'business_management'],
    optionalSections: ['board_relations', 'community_engagement'],
    focusAreas: ['executive_leadership', 'business_strategy', 'organizational_excellence']
  },
  executive: {
    positionLevel: 'executive',
    requiredSections: ['executive_governance', 'strategic_direction', 'organizational_performance', 'stakeholder_management'],
    optionalSections: ['industry_leadership', 'policy_influence'],
    focusAreas: ['governance', 'strategic_partnerships', 'organizational_sustainability']
  }
};

// === スタッフ情報の拡張 ===
export interface StaffProfile {
  // 基本情報
  id: string;
  name: string;
  employeeNumber: string;
  
  // 経験年数（自動算出）
  hireDate: Date;
  experienceLevel: ExperienceLevel;
  experienceYears: number;
  experienceMonths: number;
  
  // 役職情報
  position: PositionDetail;
  positionLevel: PositionLevel;
  positionStartDate?: Date;
  
  // 所属情報
  facility: FacilityType;
  department: DepartmentType;
  unit?: string; // 具体的な病棟名など
  
  // 職種・資格
  profession: string;
  licenses: string[];
  certifications?: string[];
  
  // 面談履歴
  lastInterviewDate?: Date;
  nextInterviewDate?: Date;
  interviewHistory?: string[]; // 面談ID配列
}

// === 面談パラメータの拡張 ===
export interface ExtendedInterviewParams {
  // スタッフ情報
  staff: StaffProfile;
  
  // 面談情報
  interviewDate: Date;
  duration: InterviewDuration;
  interviewerId: string;
  interviewerName: string;
  interviewerPosition?: PositionDetail;
  
  // カスタマイズ
  includePositionQuestions: boolean;
  includeFacilityQuestions: boolean;
  customSections?: string[];
  excludeSections?: string[];
  
  // 前回面談参照
  previousInterviewId?: string;
  followUpItems?: string[];
}

// === 質問選択ロジック ===
export interface QuestionSelectionCriteria {
  experienceLevel: ExperienceLevel;
  positionLevel: PositionLevel;
  department?: DepartmentType;
  facility: FacilityType;
  duration: InterviewDuration;
  motivationType?: MotivationType;
}

export interface SelectedQuestionSet {
  // 必須質問
  coreQuestions: InterviewQuestion[];
  
  // 経験年数別質問
  experienceQuestions: InterviewQuestion[];
  
  // 役職別質問
  positionQuestions: InterviewQuestion[];
  
  // 部署別質問
  departmentQuestions?: InterviewQuestion[];
  
  // 施設別質問
  facilityQuestions?: InterviewQuestion[];
  
  // 動機タイプ別質問
  motivationQuestions?: InterviewQuestion[];
  
  // 推定所要時間
  estimatedDuration: number;
  
  // 総質問数
  totalQuestions: number;
}

// === 管理職向け追加評価項目 ===
export interface ManagementEvaluation {
  // リーダーシップ評価
  leadershipSkills: {
    teamBuilding: number;
    decisionMaking: number;
    conflictResolution: number;
    communication: number;
    delegation: number;
  };
  
  // マネジメント評価
  managementSkills: {
    planning: number;
    organizing: number;
    staffing: number;
    controlling: number;
    budgeting: number;
  };
  
  // 戦略的思考
  strategicThinking: {
    visionSetting: number;
    problemAnalysis: number;
    innovativeThinking: number;
    changeManagement: number;
    riskManagement: number;
  };
  
  // 組織貢献
  organizationalImpact: {
    performanceImprovement: number;
    staffDevelopment: number;
    crossFunctionalCollaboration: number;
    customerSatisfaction: number;
    qualityImprovement: number;
  };
}

// === 部署別特有の評価軸 ===
export interface DepartmentSpecificEvaluation {
  ward?: {
    bedManagement: number;
    patientSafety: number;
    infectionControl: number;
    familySupport: number;
  };
  
  outpatient?: {
    appointmentEfficiency: number;
    waitTimeManagement: number;
    patientFlow: number;
    telephoneResponse: number;
  };
  
  emergency?: {
    triageAccuracy: number;
    emergencyResponse: number;
    criticalCare: number;
    traumaManagement: number;
  };
  
  icu?: {
    criticalCareSkills: number;
    ventilatorManagement: number;
    hemodynamicMonitoring: number;
    sedationManagement: number;
  };
  
  operatingRoom?: {
    surgicalAssistance: number;
    sterileTechnique: number;
    equipmentManagement: number;
    anesthesiaSupport: number;
  };
}

// === 統合評価スコア ===
export interface IntegratedEvaluationScore {
  // 基本評価
  technicalSkills: number;      // 技術スキル
  professionalKnowledge: number; // 専門知識
  
  // 経験年数別評価
  experienceLevelScore: number;
  
  // 役職別評価
  positionLevelScore?: number;
  managementScore?: ManagementEvaluation;
  
  // 部署別評価
  departmentScore?: DepartmentSpecificEvaluation;
  
  // 総合スコア
  totalScore: number;
  percentileRank: number;
  
  // 評価グレード
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  
  // 推奨アクション
  recommendedActions: string[];
  developmentPlan: string;
}