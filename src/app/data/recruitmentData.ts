import { JobPosting, Applicant, InterviewSchedule, OnboardingChecklist } from '@/types/recruitment';

export const jobPostings: JobPosting[] = [
  {
    id: 'job-001',
    title: '看護師（病棟勤務）',
    department: '看護部',
    facility: 'obara-hospital',
    employmentType: '正社員',
    requiredQualifications: [
      '看護師免許',
      '臨床経験3年以上',
      '夜勤可能な方'
    ],
    desiredQualifications: [
      '急性期病棟での勤務経験',
      'BLS、ACLSの資格',
      'プリセプター経験'
    ],
    jobDescription: '小原病院の一般病棟において、患者様への看護業務全般を担当していただきます。チーム医療の一員として、医師や他職種と連携しながら、質の高い看護を提供していただきます。',
    numberOfPositions: 3,
    salary: {
      min: 250000,
      max: 350000,
      notes: '経験・能力により優遇、夜勤手当別途支給'
    },
    benefits: [
      '社会保険完備',
      '退職金制度',
      '院内託児所完備',
      '職員食堂',
      '制服貸与',
      '各種研修制度'
    ],
    workLocation: '小原病院 3階病棟',
    workHours: '2交代制（日勤8:30-17:30、夜勤16:30-9:00）',
    postingDate: '2024-01-15',
    closingDate: '2024-02-28',
    status: 'active',
    createdBy: '総務課',
    updatedAt: '2024-01-15'
  },
  {
    id: 'job-002',
    title: '理学療法士',
    department: 'リハビリテーション科',
    facility: 'tachigami-hospital',
    employmentType: '正社員',
    requiredQualifications: [
      '理学療法士免許',
      '普通自動車運転免許'
    ],
    desiredQualifications: [
      '回復期リハビリテーション経験',
      '訪問リハビリテーション経験',
      '認定理学療法士資格'
    ],
    jobDescription: '立神リハビリテーション温泉病院において、入院・外来患者様のリハビリテーション業務を担当していただきます。温泉を活用したリハビリテーションにも携わっていただきます。',
    numberOfPositions: 2,
    salary: {
      min: 220000,
      max: 300000,
      notes: '経験・能力により優遇'
    },
    benefits: [
      '社会保険完備',
      '退職金制度',
      '職員寮あり',
      '温泉施設利用可',
      '学会参加費補助',
      'スキルアップ研修'
    ],
    workLocation: '立神リハビリテーション温泉病院',
    workHours: '8:30-17:30（休憩60分）',
    postingDate: '2024-01-20',
    closingDate: '2024-03-15',
    status: 'active',
    createdBy: '総務課',
    updatedAt: '2024-01-20'
  },
  {
    id: 'job-003',
    title: '医療事務（受付・会計）',
    department: '医事課',
    facility: 'obara-hospital',
    employmentType: 'パート',
    requiredQualifications: [
      'PC基本操作（Word、Excel）',
      '接遇マナー'
    ],
    desiredQualifications: [
      '医療事務資格',
      '医療事務経験2年以上',
      'レセプト業務経験'
    ],
    jobDescription: '外来受付での患者対応、会計業務、レセプト業務の補助などを担当していただきます。',
    numberOfPositions: 1,
    salary: {
      min: 1000,
      max: 1300,
      notes: '時給、経験により優遇'
    },
    benefits: [
      '雇用保険',
      '交通費支給',
      '制服貸与',
      '正社員登用制度あり'
    ],
    workLocation: '小原病院 外来受付',
    workHours: '週3-4日、9:00-15:00',
    postingDate: '2024-01-10',
    closingDate: '2024-02-20',
    status: 'closed',
    createdBy: '総務課',
    updatedAt: '2024-02-20'
  }
];

export const applicants: Applicant[] = [
  {
    id: 'app-001',
    jobPostingId: 'job-001',
    firstName: '花子',
    lastName: '山田',
    firstNameKana: 'ハナコ',
    lastNameKana: 'ヤマダ',
    email: 'yamada.hanako@example.com',
    phone: '090-1234-5678',
    birthDate: '1992-05-15',
    gender: '女性',
    currentEmployment: '○○総合病院',
    desiredSalary: 280000,
    availableStartDate: '2024-04-01',
    resume: {
      fileName: '山田花子_履歴書.pdf',
      uploadedAt: '2024-01-25'
    },
    coverLetter: '貴院の理念に共感し、急性期看護の経験を活かして貢献したいと考えています。',
    qualifications: [
      '看護師免許（2014年取得）',
      'BLS Provider',
      'ACLS Provider'
    ],
    experience: [
      {
        company: '○○総合病院',
        position: '看護師',
        duration: '2014年4月～現在',
        description: '循環器内科病棟にて看護業務、プリセプター業務'
      }
    ],
    education: [
      {
        school: '△△看護専門学校',
        degree: '看護学科',
        graduationYear: '2014'
      }
    ],
    applicationDate: '2024-01-25',
    status: 'second-interview',
    evaluations: [
      {
        id: 'eval-001',
        evaluatorId: 'nurse-chief',
        evaluatorName: '看護部長',
        stage: 'first-interview',
        date: '2024-02-05',
        rating: 4,
        strengths: ['豊富な急性期経験', 'コミュニケーション能力', 'プリセプター経験'],
        concerns: ['夜勤回数の希望が少ない'],
        recommendation: 'recommend',
        comments: '即戦力として期待できる。夜勤については要相談。'
      }
    ],
    notes: [
      {
        id: 'note-001',
        authorId: 'hr-staff',
        authorName: '人事担当',
        date: '2024-01-26',
        content: '電話で応募確認。面接日程調整済み。',
        isPrivate: false
      }
    ]
  },
  {
    id: 'app-002',
    jobPostingId: 'job-002',
    firstName: '太郎',
    lastName: '鈴木',
    firstNameKana: 'タロウ',
    lastNameKana: 'スズキ',
    email: 'suzuki.taro@example.com',
    phone: '080-9876-5432',
    birthDate: '1995-08-20',
    gender: '男性',
    currentEmployment: '新卒',
    desiredSalary: 220000,
    availableStartDate: '2024-04-01',
    resume: {
      fileName: '鈴木太郎_履歴書.pdf',
      uploadedAt: '2024-01-22'
    },
    qualifications: [
      '理学療法士免許（2024年3月取得見込み）',
      '普通自動車運転免許'
    ],
    experience: [],
    education: [
      {
        school: '□□リハビリテーション大学',
        degree: '理学療法学科',
        graduationYear: '2024'
      }
    ],
    applicationDate: '2024-01-22',
    status: 'screening',
    evaluations: [],
    notes: []
  },
  {
    id: 'app-003',
    jobPostingId: 'job-001',
    firstName: '美咲',
    lastName: '田中',
    firstNameKana: 'ミサキ',
    lastNameKana: 'タナカ',
    email: 'tanaka.misaki@example.com',
    phone: '070-1111-2222',
    birthDate: '1988-12-10',
    gender: '女性',
    currentEmployment: '◇◇クリニック',
    desiredSalary: 320000,
    availableStartDate: '2024-03-15',
    resume: {
      fileName: '田中美咲_履歴書.pdf',
      uploadedAt: '2024-01-28'
    },
    qualifications: [
      '看護師免許（2010年取得）',
      '認定看護師（緩和ケア）'
    ],
    experience: [
      {
        company: '◇◇クリニック',
        position: '看護師主任',
        duration: '2018年4月～現在',
        description: '外来看護、訪問看護'
      },
      {
        company: '××医療センター',
        position: '看護師',
        duration: '2010年4月～2018年3月',
        description: '緩和ケア病棟、一般病棟'
      }
    ],
    education: [
      {
        school: '○○看護大学',
        degree: '看護学部',
        graduationYear: '2010'
      }
    ],
    applicationDate: '2024-01-28',
    status: 'offer',
    evaluations: [
      {
        id: 'eval-002',
        evaluatorId: 'nurse-chief',
        evaluatorName: '看護部長',
        stage: 'first-interview',
        date: '2024-02-08',
        rating: 5,
        strengths: ['認定看護師資格', 'リーダーシップ', '幅広い経験'],
        concerns: [],
        recommendation: 'strongly-recommend',
        comments: '即戦力として、また将来の管理職候補として最適。'
      },
      {
        id: 'eval-003',
        evaluatorId: 'director',
        evaluatorName: '院長',
        stage: 'final-interview',
        date: '2024-02-15',
        rating: 5,
        strengths: ['人柄', '専門性', 'ビジョンの一致'],
        concerns: [],
        recommendation: 'strongly-recommend',
        comments: '採用を強く推薦。条件面で可能な限り配慮すべき。'
      }
    ],
    notes: [
      {
        id: 'note-002',
        authorId: 'hr-manager',
        authorName: '人事課長',
        date: '2024-02-16',
        content: '内定通知済み。3/1までに回答予定。',
        isPrivate: false
      }
    ]
  }
];

export const interviewSchedules: InterviewSchedule[] = [
  {
    id: 'interview-001',
    applicantId: 'app-001',
    jobPostingId: 'job-001',
    interviewType: 'second',
    scheduledDate: '2024-02-20',
    scheduledTime: '14:00',
    duration: 60,
    location: '小原病院 会議室A',
    interviewers: [
      {
        id: 'nurse-chief',
        name: '看護部長',
        position: '部長',
        department: '看護部'
      },
      {
        id: 'ward-manager',
        name: '3階病棟師長',
        position: '師長',
        department: '看護部'
      }
    ],
    status: 'scheduled',
    notes: '一次面接の評価良好。実務的な質問を中心に。'
  }
];

export const onboardingChecklists: OnboardingChecklist[] = [
  {
    id: 'onboard-001',
    newEmployeeId: 'new-001',
    items: [
      {
        id: 'item-001',
        category: 'documents',
        task: '雇用契約書の締結',
        dueDate: '2024-03-25',
        assignedTo: '総務課',
        status: 'pending',
        notes: ''
      },
      {
        id: 'item-002',
        category: 'documents',
        task: '各種社会保険手続き',
        dueDate: '2024-03-28',
        assignedTo: '総務課',
        status: 'pending'
      },
      {
        id: 'item-003',
        category: 'equipment',
        task: '制服の準備',
        dueDate: '2024-03-30',
        assignedTo: '総務課',
        status: 'pending'
      },
      {
        id: 'item-004',
        category: 'access',
        task: '職員IDカード発行',
        dueDate: '2024-04-01',
        assignedTo: 'システム管理課',
        status: 'pending'
      },
      {
        id: 'item-005',
        category: 'orientation',
        task: '新入職員オリエンテーション',
        dueDate: '2024-04-01',
        assignedTo: '教育担当',
        status: 'pending'
      },
      {
        id: 'item-006',
        category: 'training',
        task: '部署別研修',
        dueDate: '2024-04-05',
        assignedTo: '所属部署',
        status: 'pending'
      }
    ],
    startDate: '2024-04-01',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20'
  }
];