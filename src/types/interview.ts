export type InterviewType = '定期面談' | 'フォロー面談' | '健康相談' | 'キャリア相談' | 'その他';
export type InterviewStatus = '予定' | '完了' | 'キャンセル' | '延期';

export interface Interview {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: string;
  time: string;
  type: InterviewType;
  status: InterviewStatus;
  purpose: string;
  location?: string;
  interviewerId: string;
  interviewerName: string;
  duration?: number; // 分単位
  notes?: string;
  feedback?: InterviewFeedback;
  followUpRequired?: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewFeedback {
  overallSatisfaction: number; // 1-5
  topics: InterviewTopic[];
  keyPoints: string[];
  actionItems: string[];
  concerns: string[];
  recommendations: string[];
  nextSteps: string[];
  privateNotes?: string; // 管理者のみ閲覧可能
}

export interface InterviewTopic {
  category: string;
  discussed: boolean;
  notes?: string;
  importance: 'high' | 'medium' | 'low';
}

export interface InterviewSummary {
  staffId: string;
  totalInterviews: number;
  completedInterviews: number;
  cancelledInterviews: number;
  averageSatisfaction: number;
  lastInterviewDate: string;
  nextScheduledDate?: string;
  frequentTopics: string[];
  recommendedFrequency: string;
}

export interface InterviewSchedule {
  staffId: string;
  scheduledInterviews: Interview[];
  suggestedDates: string[];
  overdue: boolean;
  daysSinceLastInterview: number;
}