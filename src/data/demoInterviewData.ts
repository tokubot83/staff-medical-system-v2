/**
 * デモ面談データ
 * 前回面談シート比較機能のテスト用データ
 */

import { InterviewData } from '@/services/interview/interviewDataService';

// サンプル職員データ
export const demoStaffProfiles = [
  {
    staffId: 'STAFF_001',
    staffName: '田中花子',
    department: '内科病棟',
    position: '看護師',
    experienceYears: 3,
    hireDate: '2021-04-01'
  },
  {
    staffId: 'STAFF_002', 
    staffName: '佐藤太郎',
    department: '外科病棟',
    position: '看護師',
    experienceYears: 1,
    hireDate: '2023-04-01'
  },
  {
    staffId: 'STAFF_003',
    staffName: '山田みどり',
    department: 'ICU',
    position: '主任看護師',
    experienceYears: 8,
    hireDate: '2016-04-01'
  },
  {
    staffId: 'STAFF_004',
    staffName: '鈴木健一',
    department: '救急外来',
    position: '看護師',
    experienceYears: 5,
    hireDate: '2019-04-01'
  }
];

// デモ面談データ（複数の面談タイプと履歴）
export const demoInterviewData: InterviewData[] = [
  // 現在使用中の职員ID用のデモデータ
  {
    id: 'INT_DEMO_001',
    staffId: 'OH-NS-2021-001',
    staffName: '現在のテスト者',
    interviewType: 'regular_annual',
    interviewCategory: 'regular',
    scheduledDate: '2023-11-01T14:00:00.000Z',
    actualDate: '2023-11-01T14:00:00.000Z',
    status: 'completed',
    interviewer: {
      id: 'MGR_001',
      name: '高橋部長',
      position: '看護部長'
    },
    location: '会議室A',
    duration: 30,
    summary: '前回の定期面談では業務スキルの向上とチームワークについて話し合いました。',
    keyPoints: [
      '急変対応スキルが向上している',
      'コミュニケーション能力が良好',
      '新人指導に積極的'
    ],
    actionItems: [
      {
        id: 'ACTION_DEMO_001',
        description: 'リーダーシップ研修の受講',
        assignee: '現在のテスト者',
        dueDate: '2024-02-28',
        status: 'in-progress'
      }
    ],
    followUpRequired: true,
    followUpDate: '2024-05-01',
    sheetData: {
      section1: {
        currentStatus: {
          workload: '適切',
          stress: '低',
          satisfaction: '高'
        }
      },
      section2: {
        skillEvaluation: {
          emergencyResponse: 7,
          patientCare: 8,
          teamwork: 9,
          communication: 8
        }
      },
      section3: {
        goals: [
          'リーダーシップスキルの向上',
          '新人指導技術の習得'
        ],
        challenges: [
          '多重課題への対応',
          '時間管理の改善'
        ]
      }
    },
    metadata: {
      createdAt: new Date('2023-11-01T14:00:00.000Z'),
      updatedAt: new Date('2023-11-01T15:00:00.000Z'),
      createdBy: 'MGR_001'
    }
  },
  // 田中花子の面談履歴（既存データ）
  {
    id: 'INT_001',
    staffId: 'STAFF_001',
    staffName: '田中花子',
    interviewType: 'regular_annual',
    interviewCategory: 'regular',
    scheduledDate: '2023-12-01T10:00:00.000Z',
    actualDate: '2023-12-01T10:00:00.000Z',
    status: 'completed',
    interviewer: {
      id: 'MGR_001',
      name: '高橋部長',
      position: '看護部長'
    },
    location: '会議室A',
    duration: 45,
    summary: '今年度の目標達成状況について話し合いました。技術的な成長が見られ、来年度はリーダーシップ研修への参加を検討することになりました。',
    keyPoints: [
      '急性期看護における判断力が向上している',
      '新人指導に積極的に関わっている',
      '次年度のリーダー候補として期待される'
    ],
    actionItems: [
      {
        id: 'ACTION_001',
        description: 'リーダーシップ研修の受講',
        assignee: '田中花子',
        dueDate: '2024-03-31',
        status: 'completed'
      },
      {
        id: 'ACTION_002',
        description: '新人プリセプター役の準備',
        assignee: '田中花子',
        dueDate: '2024-03-31',
        status: 'completed'
      }
    ],
    followUpRequired: true,
    followUpDate: '2024-06-01',
    sheetData: {
      section1: {
        selfEvaluation: {
          technicalSkills: 8,
          communication: 9,
          teamwork: 8,
          patientCare: 9
        }
      },
      section2: {
        goals: [
          '急変対応スキルの向上',
          '新人指導技術の習得'
        ]
      },
      section3: {
        challenges: [
          '多重課題への対応',
          '家族への説明技術'
        ]
      }
    },
    metadata: {
      createdAt: new Date('2023-12-01T10:00:00.000Z'),
      updatedAt: new Date('2023-12-01T11:00:00.000Z'),
      createdBy: 'MGR_001'
    }
  },
  
  {
    id: 'INT_002',
    staffId: 'STAFF_001',
    staffName: '田中花子',
    interviewType: 'feedback',
    interviewCategory: 'support',
    scheduledDate: '2024-01-15T14:00:00.000Z',
    actualDate: '2024-01-15T14:00:00.000Z',
    status: 'completed',
    interviewer: {
      id: 'MGR_002',
      name: '伊藤師長',
      position: '病棟師長'
    },
    location: '師長室',
    duration: 30,
    summary: 'リーダーシップ研修の成果と今後の活用について話し合いました。実践的な場面での応用方法を検討しました。',
    keyPoints: [
      'リーダーシップ研修で得た知識を現場で活用中',
      'チーム内でのコミュニケーションが改善された',
      '問題解決能力が向上している'
    ],
    actionItems: [
      {
        id: 'ACTION_003',
        description: '月1回のチームミーティング進行役',
        assignee: '田中花子',
        dueDate: '2024-06-30',
        status: 'in-progress'
      }
    ],
    followUpRequired: false,
    sheetData: {
      feedbackSummary: {
        strengths: ['積極的な姿勢', 'チームワーク'],
        improvements: ['時間管理', 'ストレス管理']
      }
    },
    metadata: {
      createdAt: new Date('2024-01-15T14:00:00.000Z'),
      updatedAt: new Date('2024-01-15T14:30:00.000Z'),
      createdBy: 'MGR_002'
    }
  },

  // 佐藤太郎の面談履歴（新人）
  {
    id: 'INT_003',
    staffId: 'STAFF_002',
    staffName: '佐藤太郎',
    interviewType: 'new_employee_monthly',
    interviewCategory: 'regular',
    scheduledDate: '2023-05-01T09:00:00.000Z',
    actualDate: '2023-05-01T09:00:00.000Z',
    status: 'completed',
    interviewer: {
      id: 'MGR_002',
      name: '伊藤師長',
      position: '病棟師長'
    },
    location: '師長室',
    duration: 30,
    summary: '入職1ヶ月後の初回面談。職場適応状況と基本技術の習得状況を確認しました。',
    keyPoints: [
      '職場環境への適応は良好',
      '基本的な看護技術は順調に習得中',
      '患者さんとのコミュニケーションに不安を感じている'
    ],
    actionItems: [
      {
        id: 'ACTION_004',
        description: 'コミュニケーション研修の受講',
        assignee: '佐藤太郎',
        dueDate: '2023-07-31',
        status: 'completed'
      },
      {
        id: 'ACTION_005',
        description: 'プリセプターとの週次面談',
        assignee: '佐藤太郎',
        dueDate: '2023-12-31',
        status: 'completed'
      }
    ],
    followUpRequired: true,
    followUpDate: '2023-06-01',
    sheetData: {
      adaptation: {
        workEnvironment: 8,
        colleagues: 9,
        workload: 6,
        stress: 5
      },
      skills: {
        basicNursing: 7,
        communication: 5,
        documentation: 8,
        teamwork: 8
      }
    },
    metadata: {
      createdAt: new Date('2023-05-01T09:00:00.000Z'),
      updatedAt: new Date('2023-05-01T09:30:00.000Z'),
      createdBy: 'MGR_002'
    }
  },

  {
    id: 'INT_004',
    staffId: 'STAFF_002',
    staffName: '佐藤太郎',
    interviewType: 'new_employee_monthly',
    interviewCategory: 'regular',
    scheduledDate: '2023-08-01T09:00:00.000Z',
    actualDate: '2023-08-01T09:00:00.000Z',
    status: 'completed',
    interviewer: {
      id: 'MGR_002',
      name: '伊藤師長',
      position: '病棟師長'
    },
    location: '師長室',
    duration: 30,
    summary: '入職4ヶ月後の面談。技術的な成長と今後の目標について話し合いました。',
    keyPoints: [
      'コミュニケーション能力が大幅に向上した',
      '基本的な看護技術は習得完了',
      '夜勤業務への準備が整っている'
    ],
    actionItems: [
      {
        id: 'ACTION_006',
        description: '夜勤業務の段階的開始',
        assignee: '佐藤太郎',
        dueDate: '2023-10-31',
        status: 'completed'
      },
      {
        id: 'ACTION_007',
        description: 'BLS研修の受講',
        assignee: '佐藤太郎',
        dueDate: '2023-12-31',
        status: 'completed'
      }
    ],
    followUpRequired: true,
    followUpDate: '2023-11-01',
    sheetData: {
      progress: {
        technicalSkills: 8,
        confidence: 7,
        independence: 6,
        nightShiftReadiness: 8
      }
    },
    metadata: {
      createdAt: new Date('2023-08-01T09:00:00.000Z'),
      updatedAt: new Date('2023-08-01T09:30:00.000Z'),
      createdBy: 'MGR_002'
    }
  },

  // 山田みどりの面談履歴（ベテラン・管理職）
  {
    id: 'INT_005',
    staffId: 'STAFF_003',
    staffName: '山田みどり',
    interviewType: 'management_biannual',
    interviewCategory: 'regular',
    scheduledDate: '2024-01-10T15:00:00.000Z',
    actualDate: '2024-01-10T15:00:00.000Z',
    status: 'completed',
    interviewer: {
      id: 'MGR_001',
      name: '高橋部長',
      position: '看護部長'
    },
    location: '部長室',
    duration: 45,
    summary: 'ICU主任としての業務評価と組織運営について話し合いました。部署の業績向上と人材育成が評価されています。',
    keyPoints: [
      'ICU部署の医療安全指標が大幅に改善',
      'スタッフ満足度調査で高評価を獲得',
      '新人教育プログラムの改善に貢献',
      '次期師長候補として期待されている'
    ],
    actionItems: [
      {
        id: 'ACTION_008',
        description: '管理職研修の受講',
        assignee: '山田みどり',
        dueDate: '2024-06-30',
        status: 'in-progress'
      },
      {
        id: 'ACTION_009',
        description: 'ICU教育プログラムの他部署展開',
        assignee: '山田みどり',
        dueDate: '2024-09-30',
        status: 'pending'
      }
    ],
    followUpRequired: true,
    followUpDate: '2024-07-10',
    sheetData: {
      management: {
        teamLeadership: 9,
        problemSolving: 9,
        decisionMaking: 8,
        communication: 9,
        budgetManagement: 7
      },
      performance: {
        safetyMetrics: 9,
        staffSatisfaction: 9,
        patientSatisfaction: 9,
        efficiency: 8
      }
    },
    metadata: {
      createdAt: new Date('2024-01-10T15:00:00.000Z'),
      updatedAt: new Date('2024-01-10T16:00:00.000Z'),
      createdBy: 'MGR_001'
    }
  },

  // 鈴木健一の面談履歴（異なるタイプの面談）
  {
    id: 'INT_006',
    staffId: 'STAFF_004',
    staffName: '鈴木健一',
    interviewType: 'career_support',
    interviewCategory: 'support',
    scheduledDate: '2024-02-01T11:00:00.000Z',
    actualDate: '2024-02-01T11:00:00.000Z',
    status: 'completed',
    interviewer: {
      id: 'MGR_003',
      name: '木村課長',
      position: 'キャリア支援課長'
    },
    location: 'キャリア相談室',
    duration: 45,
    summary: 'キャリアパスについての相談面談。専門認定看護師への道筋について話し合いました。',
    keyPoints: [
      '救急看護認定看護師への興味を表明',
      '現在の経験値とスキルは十分',
      '研修期間中の勤務体制について相談'
    ],
    actionItems: [
      {
        id: 'ACTION_010',
        description: '認定看護師教育課程の情報収集',
        assignee: '鈴木健一',
        dueDate: '2024-04-30',
        status: 'completed'
      },
      {
        id: 'ACTION_011',
        description: '上司との研修参加相談',
        assignee: '鈴木健一',
        dueDate: '2024-03-31',
        status: 'completed'
      }
    ],
    followUpRequired: true,
    followUpDate: '2024-05-01',
    sheetData: {
      careerGoals: {
        shortTerm: '救急看護認定看護師の資格取得',
        longTerm: '救急部門の教育担当として活躍',
        interests: ['救急医療', '災害看護', '教育']
      }
    },
    metadata: {
      createdAt: new Date('2024-02-01T11:00:00.000Z'),
      updatedAt: new Date('2024-02-01T11:45:00.000Z'),
      createdBy: 'MGR_003'
    }
  },

  {
    id: 'INT_007',
    staffId: 'STAFF_004',
    staffName: '鈴木健一',
    interviewType: 'regular_annual',
    interviewCategory: 'regular',
    scheduledDate: '2024-03-15T10:00:00.000Z',
    actualDate: '2024-03-15T10:00:00.000Z',
    status: 'completed',
    interviewer: {
      id: 'MGR_004',
      name: '松本師長',
      position: '救急外来師長'
    },
    location: '救急外来カンファレンス室',
    duration: 45,
    summary: '年次面談として今年度の業績評価と来年度の目標設定を行いました。',
    keyPoints: [
      '救急外来での対応能力が高く評価されている',
      'トリアージスキルが優秀',
      '新人指導にも積極的',
      '認定看護師への挑戦を支援することを確約'
    ],
    actionItems: [
      {
        id: 'ACTION_012',
        description: '認定看護師教育課程への出願',
        assignee: '鈴木健一',
        dueDate: '2024-06-30',
        status: 'in-progress'
      },
      {
        id: 'ACTION_013',
        description: 'トリアージ研修の指導者養成',
        assignee: '鈴木健一',
        dueDate: '2024-09-30',
        status: 'pending'
      }
    ],
    followUpRequired: true,
    followUpDate: '2024-09-15',
    sheetData: {
      performance: {
        technicalSkills: 9,
        emergencyResponse: 9,
        triage: 9,
        teamwork: 8,
        patientCare: 9
      },
      goals: {
        certification: '救急看護認定看護師',
        timeline: '2025年取得予定',
        preparation: '月2回の勉強会参加'
      }
    },
    metadata: {
      createdAt: new Date('2024-03-15T10:00:00.000Z'),
      updatedAt: new Date('2024-03-15T10:45:00.000Z'),
      createdBy: 'MGR_004'
    }
  }
];

// デモデータをLocalStorageに保存するための関数
export const loadDemoData = async (): Promise<void> => {
  try {
    // 既存のデータをチェック
    const existingData = localStorage.getItem('staff_medical_interview_INT_001');
    
    if (!existingData) {
      // デモデータをLocalStorageに保存（StorageAdapterのプレフィックスに合わせる）
      for (const interview of demoInterviewData) {
        localStorage.setItem(`staff_medical_interview_${interview.id}`, JSON.stringify(interview));
      }
      
      console.log('Demo interview data loaded successfully');
    } else {
      console.log('Demo data already exists');
    }
  } catch (error) {
    console.error('Error loading demo data:', error);
  }
};

// デモデータをクリアする関数
export const clearDemoData = (): void => {
  try {
    demoInterviewData.forEach(interview => {
      localStorage.removeItem(`staff_medical_interview_${interview.id}`);
    });
    
    console.log('Demo data cleared successfully');
  } catch (error) {
    console.error('Error clearing demo data:', error);
  }
};