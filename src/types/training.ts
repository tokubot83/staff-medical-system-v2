/**
 * 研修・教育システム関連の型定義
 */

export interface TrainingProgram {
  id: string;
  name: string;
  category: 'skill' | 'management' | 'compliance' | 'certification';
  type: 'mandatory' | 'elective';
  duration: number; // 時間数
  targetAudience: string[];
  objectives: string[];
  schedule?: {
    startDate: Date;
    endDate: Date;
    frequency?: string;
  };
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  completionRate?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  location?: string;
  instructor?: string;
  materials?: string[];
  prerequisites?: string[];
  assessmentMethod?: string;
  passingScore?: number;
  certificateIssued?: boolean;
}

export interface TrainingParticipant {
  staffId: string;
  staffName: string;
  enrollmentDate: Date;
  completionDate?: Date;
  attendance: number;
  score?: number;
  passed?: boolean;
  certificate?: {
    issued: boolean;
    issueDate?: Date;
    expiryDate?: Date;
  };
  feedback?: string;
}

export interface TrainingEvaluation {
  programId: string;
  evaluatorId: string;
  rating: number; // 1-5
  comments: string;
  suggestions?: string;
  date: Date;
}

export interface TrainingCategory {
  id: string;
  name: string;
  description: string;
  requiredHours?: number;
  programs: TrainingProgram[];
}

export interface TrainingPlan {
  year: number;
  staffId: string;
  requiredPrograms: string[];
  electivePrograms: string[];
  totalRequiredHours: number;
  completedHours: number;
  status: 'pending' | 'in-progress' | 'completed';
}