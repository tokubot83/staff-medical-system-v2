/**
 * 面談質問マスターデータ型定義
 * v4・v5面談シートを統合した質問管理システム
 */

import { FacilityType, JobRole, StaffLevel } from '@/services/interviewManualGenerationServiceV2';

// 質問カテゴリー
export type QuestionCategory = 
  | 'adaptation'        // 職場適応・人間関係
  | 'skills'           // 技術・スキル習得
  | 'performance'      // 業務遂行・成果
  | 'health'          // 健康・ストレス管理
  | 'growth'          // 成長・キャリア開発
  | 'satisfaction'    // 満足度・モチベーション
  | 'communication'   // コミュニケーション
  | 'leadership'      // リーダーシップ（管理職向け）
  | 'future';         // 今後の展望・目標

// 質問タイプ
export type QuestionType = 
  | 'scale'           // 5段階評価
  | 'hybrid'          // 5段階評価＋テキスト
  | 'text'            // テキストのみ
  | 'checklist'       // チェックリスト
  | 'radio'           // ラジオボタン選択
  | 'matrix';         // マトリックス評価（複数項目×5段階）

// 評価ラベル定義
export interface ScaleLabels {
  low: string;        // 1の説明（例：低い、不満、要支援）
  high: string;       // 5の説明（例：高い、満足、優秀）
  midLabels?: {       // 中間値のラベル（オプション）
    2: string;
    3: string;
    4: string;
  };
}

// マトリックス評価の項目
export interface MatrixItem {
  id: string;
  label: string;
  description?: string;
}

// 質問マスターデータ構造
export interface QuestionMaster {
  id: string;
  category: QuestionCategory;
  baseQuestion: string;                    // 基本質問文
  questionType: QuestionType;
  
  // 適用条件
  applicableConditions: {
    facilityTypes?: FacilityType[];       // 適用施設タイプ
    jobRoles?: JobRole[];                 // 適用職種
    staffLevels?: StaffLevel[];           // 適用職員レベル
    minExperienceYears?: number;          // 最小経験年数
    maxExperienceYears?: number;          // 最大経験年数
  };
  
  // カスタマイズ定義
  variations?: QuestionVariation[];        // 条件別バリエーション
  
  // 評価設定（scale, hybrid, matrixで使用）
  scaleSettings?: {
    labels: ScaleLabels;
    defaultValue?: number;
    required: boolean;
  };
  
  // テキスト入力設定
  textSettings?: {
    placeholder: string;
    minLength?: number;
    maxLength?: number;
    rows?: number;
    required: boolean;
  };
  
  // チェックリスト設定
  checklistItems?: string[];
  
  // ラジオボタン設定
  radioOptions?: {
    value: string;
    label: string;
    description?: string;
  }[];
  
  // マトリックス設定
  matrixSettings?: {
    items: MatrixItem[];
    scaleLabels: ScaleLabels;
  };
  
  // 面談ガイダンス
  guidance: {
    purpose: string;                      // この質問の目的
    askingTips: string[];                  // 質問時のコツ
    followUpQuestions?: string[];         // フォローアップ質問
    redFlags?: string[];                   // 注意すべき回答
    expectedTimeMinutes?: number;         // 想定所要時間（分）
  };
  
  // 重要度と必須フラグ
  importance: 'critical' | 'important' | 'standard' | 'optional';
  isRequired: boolean;
  
  // 表示順序
  sortOrder: number;
  
  // メタデータ
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

// 質問バリエーション（条件別カスタマイズ）
export interface QuestionVariation {
  conditions: {
    facilityType?: FacilityType;
    jobRole?: JobRole;
    staffLevel?: StaffLevel;
  };
  customizedQuestion: string;             // カスタマイズされた質問文
  customPlaceholder?: string;             // カスタムプレースホルダー
  customTips?: string[];                  // 条件別の追加ヒント
}

// セクション定義（面談の構成単位）
export interface InterviewSection {
  id: string;
  title: string;
  category: QuestionCategory;
  description: string;
  estimatedMinutes: number;
  questions: string[];                     // QuestionMaster IDの配列
  
  // セクション別ガイダンス
  sectionGuidance: {
    introduction: string;                  // セクション導入文
    keyPoints: string[];                   // 重要ポイント
    transitionPhrase: string;              // 次セクションへの移行文
  };
}

// 面談テンプレート（施設×職種×レベル×時間）
export interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  
  // 適用条件
  facilityType: FacilityType;
  jobRole: JobRole;
  staffLevel: StaffLevel;
  duration: 15 | 30 | 45;                 // 面談時間（分）
  
  // セクション構成
  sections: InterviewSection[];
  
  // テンプレート全体の設定
  settings: {
    allowSkipOptional: boolean;           // オプション質問のスキップ許可
    autoSave: boolean;                    // 自動保存
    showProgress: boolean;                // 進捗表示
    enableTimer: boolean;                 // タイマー表示
  };
  
  // メタデータ
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

// 面談回答データ
export interface InterviewResponse {
  questionId: string;
  questionType: QuestionType;
  
  // 回答値（型に応じて使い分け）
  scaleValue?: number;                    // 5段階評価値
  textValue?: string;                     // テキスト回答
  checklistValues?: string[];             // チェックリスト選択値
  radioValue?: string;                    // ラジオボタン選択値
  matrixValues?: {                        // マトリックス評価値
    itemId: string;
    value: number;
  }[];
  
  // メタデータ
  answeredAt: Date;
  timeSpentSeconds?: number;              // 回答所要時間
  skipped?: boolean;                      // スキップフラグ
}

// 面談セッションデータ
export interface InterviewSession {
  id: string;
  templateId: string;
  
  // 職員情報
  staffInfo: {
    id: string;
    name: string;
    facilityType: FacilityType;
    jobRole: JobRole;
    staffLevel: StaffLevel;
    department: string;
    experienceYears: number;
    experienceMonths: number;
  };
  
  // 面談情報
  interviewInfo: {
    date: Date;
    interviewerId: string;
    interviewerName: string;
    location?: string;
    interviewType: 'regular' | 'special' | 'support';
    plannedDuration: number;
    actualDuration?: number;
  };
  
  // 回答データ
  responses: InterviewResponse[];
  
  // セッション状態
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  currentSectionIndex: number;
  currentQuestionIndex: number;
  
  // タイムスタンプ
  startedAt?: Date;
  completedAt?: Date;
  lastSavedAt?: Date;
  
  // 面談後の所見
  summary?: {
    overallAssessment: string;            // 総合評価
    keyFindings: string[];                // 主な発見事項
    actionItems: string[];                 // アクションアイテム
    followUpRequired: boolean;            // フォローアップ要否
    nextInterviewDate?: Date;             // 次回面談予定
  };
}

// 質問検索条件
export interface QuestionSearchCriteria {
  category?: QuestionCategory;
  facilityType?: FacilityType;
  jobRole?: JobRole;
  staffLevel?: StaffLevel;
  questionType?: QuestionType;
  importance?: string;
  keyword?: string;
}

// 統計データ
export interface InterviewStatistics {
  totalSessions: number;
  completedSessions: number;
  averageDuration: number;
  averageScores: {
    category: QuestionCategory;
    score: number;
  }[];
  commonIssues: string[];
  satisfactionRate: number;
}