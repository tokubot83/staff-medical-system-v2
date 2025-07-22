import { Interview, InterviewType, InterviewStatus } from '@/types/interview';

export const mockInterviews: Interview[] = [
  {
    id: 'INT001',
    staffId: 'S12345',
    staffName: '山田太郎',
    department: '内科',
    date: '2024-03-15',
    time: '10:00',
    type: '定期面談',
    status: '完了',
    purpose: '年度評価と目標設定',
    location: '会議室A',
    interviewerId: 'M001',
    interviewerName: '田中管理者',
    duration: 60,
    notes: '今年度の成果について詳しく話し合い、来年度の目標を設定した。',
    feedback: {
      overallSatisfaction: 4,
      topics: [
        { category: '業務成果', discussed: true, importance: 'high', notes: '目標を上回る成果' },
        { category: 'キャリア開発', discussed: true, importance: 'medium', notes: '専門資格取得を検討' },
        { category: '健康状態', discussed: true, importance: 'high', notes: '良好' }
      ],
      keyPoints: ['業務効率が20%向上', '新人教育に貢献', 'チームワークが優秀'],
      actionItems: ['専門資格の調査', '新プロジェクトへの参加', 'メンター制度への登録'],
      concerns: ['業務負荷の増加傾向'],
      recommendations: ['定期的な1on1の継続', 'スキルアップ研修の受講'],
      nextSteps: ['4月に進捗確認', '資格取得計画の作成']
    },
    followUpRequired: true,
    followUpDate: '2024-04-15',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z'
  },
  {
    id: 'INT002',
    staffId: 'S12346',
    staffName: '佐藤花子',
    department: '外科',
    date: '2024-03-20',
    time: '14:00',
    type: 'フォロー面談',
    status: '予定',
    purpose: '復職後の状況確認',
    location: '面談室B',
    interviewerId: 'M002',
    interviewerName: '鈴木マネージャー',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 'INT003',
    staffId: 'S12347',
    staffName: '田中次郎',
    department: '小児科',
    date: '2024-03-10',
    time: '16:00',
    type: '健康相談',
    status: '完了',
    purpose: 'ストレスチェック後のフォロー',
    location: 'オンライン',
    interviewerId: 'M001',
    interviewerName: '田中管理者',
    duration: 45,
    notes: 'ストレスレベルが高めだったため、業務量の調整を検討',
    feedback: {
      overallSatisfaction: 3,
      topics: [
        { category: '業務負荷', discussed: true, importance: 'high', notes: '残業時間の削減が必要' },
        { category: 'メンタルヘルス', discussed: true, importance: 'high', notes: 'カウンセリングを推奨' }
      ],
      keyPoints: ['業務の優先順位見直し', 'チーム内での業務分担'],
      actionItems: ['業務量の調整', 'カウンセリング予約', '定期的な状況確認'],
      concerns: ['慢性的な疲労', '睡眠不足'],
      recommendations: ['産業医面談', '有給休暇の取得促進'],
      nextSteps: ['2週間後に再面談', '業務調整の実施']
    },
    followUpRequired: true,
    followUpDate: '2024-03-24',
    createdAt: '2024-03-10T16:00:00Z',
    updatedAt: '2024-03-10T16:45:00Z'
  }
];

export function getInterviewsByStaffId(staffId: string): Interview[] {
  return mockInterviews.filter(interview => interview.staffId === staffId);
}

export function getInterviewById(id: string): Interview | undefined {
  return mockInterviews.find(interview => interview.id === id);
}

export function getUpcomingInterviews(): Interview[] {
  const today = new Date().toISOString().split('T')[0];
  return mockInterviews
    .filter(interview => interview.status === '予定' && interview.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getInterviewsByDateRange(startDate: string, endDate: string): Interview[] {
  return mockInterviews.filter(
    interview => interview.date >= startDate && interview.date <= endDate
  );
}