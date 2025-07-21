export interface JobPosting {
  id: string;
  title: string;
  department: string;
  facility: 'obara-hospital' | 'tachigami-hospital';
  employmentType: '正社員' | '契約社員' | 'パート' | 'アルバイト';
  requiredQualifications: string[];
  desiredQualifications: string[];
  jobDescription: string;
  numberOfPositions: number;
  salary: {
    min: number;
    max: number;
    notes?: string;
  };
  benefits: string[];
  workLocation: string;
  workHours: string;
  postingDate: string;
  closingDate: string;
  status: 'draft' | 'active' | 'closed' | 'filled';
  createdBy: string;
  updatedAt: string;
}

export interface Applicant {
  id: string;
  jobPostingId: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: '男性' | '女性' | 'その他';
  currentEmployment: string;
  desiredSalary: number;
  availableStartDate: string;
  resume: {
    fileName: string;
    uploadedAt: string;
  };
  coverLetter?: string;
  qualifications: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    graduationYear: string;
  }[];
  applicationDate: string;
  status: 'new' | 'screening' | 'first-interview' | 'second-interview' | 'final-interview' | 'offer' | 'rejected' | 'withdrawn';
  evaluations: ApplicationEvaluation[];
  notes: ApplicationNote[];
}

export interface ApplicationEvaluation {
  id: string;
  evaluatorId: string;
  evaluatorName: string;
  stage: 'screening' | 'first-interview' | 'second-interview' | 'final-interview';
  date: string;
  rating: number; // 1-5
  strengths: string[];
  concerns: string[];
  recommendation: 'strongly-recommend' | 'recommend' | 'neutral' | 'not-recommend';
  comments: string;
}

export interface ApplicationNote {
  id: string;
  authorId: string;
  authorName: string;
  date: string;
  content: string;
  isPrivate: boolean;
}

export interface InterviewSchedule {
  id: string;
  applicantId: string;
  jobPostingId: string;
  interviewType: 'first' | 'second' | 'final';
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  location: string;
  interviewers: {
    id: string;
    name: string;
    position: string;
    department: string;
  }[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  meetingUrl?: string;
  notes?: string;
}

export interface OnboardingChecklist {
  id: string;
  newEmployeeId: string;
  items: {
    id: string;
    category: 'documents' | 'training' | 'equipment' | 'access' | 'orientation';
    task: string;
    dueDate: string;
    completedDate?: string;
    assignedTo: string;
    status: 'pending' | 'in-progress' | 'completed';
    notes?: string;
  }[];
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecruitmentMetrics {
  timeToFill: number; // days
  costPerHire: number;
  applicantsPerOpening: number;
  offerAcceptanceRate: number;
  firstYearTurnoverRate: number;
  sourceEffectiveness: {
    source: string;
    applicants: number;
    hires: number;
    quality: number; // 1-5
  }[];
}