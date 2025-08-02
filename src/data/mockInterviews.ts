import { Interview, InterviewType, InterviewStatus } from '@/types/interview';

export const mockInterviews: Interview[] = [
  {
    id: 'INT001',
    employeeId: 'S12345',
    employeeName: '山田太郎',
    employeeEmail: 'yamada@example.com',
    facility: '小原病院',
    department: '内科',
    position: '看護師',
    bookingDate: '2024-03-15',
    startTime: '10:00',
    endTime: '11:00',
    interviewType: 'regular_annual' as InterviewType,
    interviewCategory: 'career_path' as any,
    requestedTopics: ['年度評価', '目標設定'],
    description: '年度評価と目標設定',
    urgencyLevel: 'medium' as any,
    status: 'completed' as InterviewStatus,
    interviewerId: 'M001',
    interviewerName: '田中管理者',
    interviewerLevel: 6,
    duration: 60,
    employeeNotes: '今年度の成果について詳しく話し合い、来年度の目標を設定した。',
    outcomeSummary: '業務効率が20%向上し、新人教育にも貢献。来年度は専門資格取得を目指す。',
    outcomeActionItems: ['専門資格の調査', '新プロジェクトへの参加', 'メンター制度への登録'],
    outcomeFollowupRequired: true,
    outcomeFollowupDate: '2024-04-15',
    createdAt: '2024-03-15T10:00:00Z',
    createdBy: 'system',
    lastModified: '2024-03-15T11:00:00Z',
    modifiedBy: 'M001'
  },
  {
    id: 'INT002',
    employeeId: 'S12346',
    employeeName: '佐藤花子',
    employeeEmail: 'sato@example.com',
    facility: '小原病院',
    department: '外科',
    position: '看護師',
    bookingDate: '2024-03-20',
    startTime: '14:00',
    endTime: '15:00',
    interviewType: 'return_to_work' as InterviewType,
    interviewCategory: 'health_safety' as any,
    requestedTopics: ['復職後の体調', '業務量調整'],
    description: '復職後の状況確認',
    urgencyLevel: 'high' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M002',
    interviewerName: '鈴木マネージャー',
    interviewerLevel: 7,
    createdAt: '2024-03-01T10:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'INT003',
    employeeId: 'S12347',
    employeeName: '鈴木一郎',
    employeeEmail: 'suzuki@example.com',
    facility: '立神リハビリテーション温泉病院',
    department: '地域包括ケア病棟',
    position: '介護士',
    bookingDate: '2024-03-18',
    startTime: '09:00',
    endTime: '10:00',
    interviewType: 'stress_care' as InterviewType,
    interviewCategory: 'work_environment' as any,
    requestedTopics: ['職場環境', '人間関係'],
    description: 'ストレスチェック後のフォロー面談',
    urgencyLevel: 'high' as any,
    status: 'completed' as InterviewStatus,
    interviewerId: 'M003',
    interviewerName: '高橋カウンセラー',
    interviewerLevel: 6,
    duration: 45,
    outcomeSummary: '業務負荷が高く、休息が必要。シフト調整を実施。',
    outcomeActionItems: ['シフト見直し', '定期的な面談設定'],
    outcomeFollowupRequired: true,
    outcomeFollowupDate: '2024-04-01',
    createdAt: '2024-03-10T10:00:00Z',
    createdBy: 'system',
    conductedAt: '2024-03-18T09:00:00Z'
  },
  {
    id: 'INT004',
    employeeId: 'S12348',
    employeeName: '伊藤美咲',
    employeeEmail: 'ito@example.com',
    facility: '小原病院',
    department: '救急科',
    position: '医師',
    bookingDate: '2024-03-25',
    startTime: '16:00',
    endTime: '17:00',
    interviewType: 'career_development' as InterviewType,
    interviewCategory: 'skill_development' as any,
    requestedTopics: ['専門医資格', '研修計画'],
    description: 'キャリア開発相談',
    urgencyLevel: 'low' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M004',
    interviewerName: '渡辺部長',
    interviewerLevel: 8,
    createdAt: '2024-03-05T10:00:00Z',
    createdBy: 'S12348'
  },
  {
    id: 'INT005',
    employeeId: 'S12349',
    employeeName: '中村健太',
    employeeEmail: 'nakamura@example.com',
    facility: '小原病院',
    department: '緩和ケア病棟',
    position: '看護師',
    bookingDate: '2024-03-22',
    startTime: '13:00',
    endTime: '14:00',
    interviewType: 'new_employee_monthly' as InterviewType,
    interviewCategory: 'training' as any,
    requestedTopics: ['業務習得状況', '研修進捗'],
    description: '新入職員月次面談（3ヶ月目）',
    urgencyLevel: 'medium' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M005',
    interviewerName: '小林主任',
    interviewerLevel: 6,
    createdAt: '2024-03-01T10:00:00Z',
    createdBy: 'system'
  }
];

export function getUpcomingInterviews(days: number = 7): Interview[] {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  
  return mockInterviews.filter(interview => {
    const interviewDate = new Date(interview.bookingDate);
    return interview.status === 'scheduled' && 
           interviewDate >= today && 
           interviewDate <= futureDate;
  });
}

export function getInterviewsByStaffId(staffId: string): Interview[] {
  return mockInterviews.filter(interview => interview.employeeId === staffId);
}

export function getInterviewsByStatus(status: InterviewStatus): Interview[] {
  return mockInterviews.filter(interview => interview.status === status);
}