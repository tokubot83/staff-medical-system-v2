// 職員キャリアカルテのモックデータ

import {
  StaffCareerRecord,
  EvaluationRecord,
  InterviewRecord,
  Intervention,
  Achievement,
  CareerGoal,
  Recommendation
} from '@/types/career-support';

// サンプル評価履歴
const sampleEvaluations: EvaluationRecord[] = [
  {
    id: 'eval-001',
    date: '2024-04-01',
    technicalScore: 42,
    contributionScore: 38,
    totalScore: 80,
    finalGrade: 'B',
    trend: 'improving',
    evaluatorId: 'MGR001',
    evaluatorName: '山田部長',
  },
  {
    id: 'eval-002',
    date: '2023-10-01',
    technicalScore: 38,
    contributionScore: 35,
    totalScore: 73,
    finalGrade: 'B',
    trend: 'stable',
    evaluatorId: 'MGR001',
    evaluatorName: '山田部長',
  },
  {
    id: 'eval-003',
    date: '2023-04-01',
    technicalScore: 35,
    contributionScore: 33,
    totalScore: 68,
    finalGrade: 'C',
    trend: 'improving',
    evaluatorId: 'MGR001',
    evaluatorName: '山田部長',
  },
];

// サンプル面談履歴
const sampleInterviews: InterviewRecord[] = [
  {
    id: 'int-001',
    date: '2024-05-15',
    type: 'evaluation_feedback',
    topics: ['評価結果の説明', '今後の目標設定'],
    concerns: ['業務量が多い', 'スキルアップの時間が取れない'],
    aspirations: ['専門資格を取得したい', 'チームリーダーを目指したい'],
    supportNeeds: ['研修時間の確保', 'メンター制度の利用'],
    interviewerId: 'MGR001',
    interviewerName: '山田部長',
    duration: 45,
    followUpRequired: true,
    notes: '意欲的で成長志向が強い。業務調整が必要。',
  },
  {
    id: 'int-002',
    date: '2024-03-10',
    type: 'career',
    topics: ['キャリアパス相談', 'スキル開発計画'],
    concerns: ['現在の役割に物足りなさを感じる'],
    aspirations: ['より責任のある立場で働きたい', '専門性を深めたい'],
    supportNeeds: ['リーダーシップ研修', 'プロジェクト管理スキル'],
    interviewerId: 'HR001',
    interviewerName: '佐藤人事課長',
    duration: 60,
    followUpRequired: false,
    notes: 'リーダー候補として育成検討。',
  },
];

// モック職員キャリアカルテデータ
export const mockCareerRecords: StaffCareerRecord[] = [
  {
    staffId: 'STF001',
    staffName: '田中太郎',
    department: '看護部',
    position: '看護師',
    evaluationHistory: sampleEvaluations,
    interviewHistory: sampleInterviews,
    careerSupport: {
      currentPhase: 'growth',
      supportLevel: 'B',
      interventions: [
        {
          id: 'inv-001',
          date: '2024-06-01',
          type: 'training',
          description: 'リーダーシップ基礎研修',
          outcome: '基礎的なリーダーシップスキルを習得',
          effectiveness: 4,
          followUpNeeded: false,
        },
        {
          id: 'inv-002',
          date: '2024-05-20',
          type: 'mentoring',
          description: '先輩看護師によるメンタリング開始',
          outcome: '月2回の定期面談を設定',
          effectiveness: 5,
          followUpNeeded: true,
        },
      ],
      growthTrajectory: {
        strengths: ['患者対応', 'チームワーク', '向学心'],
        improvements: ['リーダーシップ', '問題解決能力', '時間管理'],
        achievements: [
          {
            date: '2024-04-15',
            title: 'BLS資格取得',
            description: '救命救急の基礎資格を取得',
            impact: 'medium',
          },
        ],
        nextSteps: ['主任看護師への昇進準備', '専門資格の取得'],
        careerGoals: [
          {
            term: 'short',
            goal: '感染管理認定看護師資格取得',
            targetDate: '2024-12-31',
            progress: 30,
            status: 'in_progress',
          },
          {
            term: 'medium',
            goal: '主任看護師への昇進',
            targetDate: '2025-04-01',
            progress: 20,
            status: 'in_progress',
          },
          {
            term: 'long',
            goal: '看護師長',
            targetDate: '2028-04-01',
            progress: 5,
            status: 'not_started',
          },
        ],
      },
      recommendations: [
        {
          id: 'rec-001',
          date: '2024-06-15',
          type: 'training',
          priority: 'high',
          title: '感染管理研修',
          description: '専門資格取得に向けた基礎研修',
          status: 'accepted',
          deadline: '2024-07-31',
        },
      ],
      lastReviewDate: '2024-06-01',
      nextReviewDate: '2024-09-01',
    },
    aiReadiness: {
      dataCollection: true,
      growthPatternAnalysis: true,
      careerFitAnalysis: false,
      supportNeedsPrediction: false,
      patterns: [
        {
          type: '成長型',
          confidence: 0.78,
          description: '着実に成長している職員',
          dataPoints: 12,
        },
      ],
    },
    createdAt: '2023-04-01',
    updatedAt: '2024-06-15',
  },
  {
    staffId: 'STF002',
    staffName: '鈴木花子',
    department: 'リハビリテーション科',
    position: '理学療法士',
    evaluationHistory: [
      {
        id: 'eval-004',
        date: '2024-04-01',
        technicalScore: 45,
        contributionScore: 43,
        totalScore: 88,
        finalGrade: 'A',
        trend: 'stable',
        evaluatorId: 'MGR002',
        evaluatorName: '高橋科長',
      },
    ],
    interviewHistory: [
      {
        id: 'int-003',
        date: '2024-05-01',
        type: 'promotion',
        topics: ['昇進面談', '今後の役割'],
        concerns: [],
        aspirations: ['科のリーダーとして貢献したい', '後輩育成に力を入れたい'],
        supportNeeds: ['マネジメント研修', '人事評価研修'],
        interviewerId: 'MGR002',
        interviewerName: '高橋科長',
        duration: 60,
        followUpRequired: false,
        notes: '次期主任候補として有力。',
      },
    ],
    careerSupport: {
      currentPhase: 'leadership',
      supportLevel: 'A',
      interventions: [
        {
          id: 'inv-003',
          date: '2024-05-15',
          type: 'coaching',
          description: 'リーダーシップコーチング',
          outcome: '管理職としての視点を獲得',
          effectiveness: 5,
          followUpNeeded: false,
        },
      ],
      growthTrajectory: {
        strengths: ['技術力', 'リーダーシップ', '指導力'],
        improvements: ['組織マネジメント', '戦略的思考'],
        achievements: [
          {
            date: '2024-03-01',
            title: '学会発表',
            description: '日本理学療法学会での研究発表',
            impact: 'high',
          },
        ],
        nextSteps: ['主任への昇進', '管理職研修'],
        careerGoals: [
          {
            term: 'short',
            goal: '主任理学療法士への昇進',
            targetDate: '2024-10-01',
            progress: 80,
            status: 'in_progress',
          },
        ],
      },
      recommendations: [],
      lastReviewDate: '2024-05-01',
      nextReviewDate: '2024-11-01',
    },
    createdAt: '2021-04-01',
    updatedAt: '2024-05-15',
  },
  {
    staffId: 'STF003',
    staffName: '佐藤次郎',
    department: '医事課',
    position: '医事課職員',
    evaluationHistory: [
      {
        id: 'eval-005',
        date: '2024-04-01',
        technicalScore: 32,
        contributionScore: 28,
        totalScore: 60,
        finalGrade: 'C',
        trend: 'declining',
        evaluatorId: 'MGR003',
        evaluatorName: '伊藤課長',
      },
    ],
    interviewHistory: [
      {
        id: 'int-004',
        date: '2024-05-20',
        type: 'support',
        topics: ['業務改善', 'モチベーション向上'],
        concerns: ['業務が合わない', 'ストレスが大きい'],
        aspirations: ['別の部署への異動を検討したい'],
        supportNeeds: ['メンタルヘルスサポート', 'キャリア相談'],
        interviewerId: 'MGR003',
        interviewerName: '伊藤課長',
        duration: 60,
        followUpRequired: true,
        notes: '早急な支援が必要。産業医面談も検討。',
      },
    ],
    careerSupport: {
      currentPhase: 'intensive',
      supportLevel: 'C',
      interventions: [
        {
          id: 'inv-004',
          date: '2024-05-25',
          type: 'counseling',
          description: '産業医によるカウンセリング',
          outcome: 'ストレス要因の特定と対策立案',
          effectiveness: 3,
          followUpNeeded: true,
        },
      ],
      growthTrajectory: {
        strengths: ['誠実性', '基本的な事務処理'],
        improvements: ['ストレス管理', '業務効率', 'コミュニケーション'],
        achievements: [],
        nextSteps: ['業務負荷の調整', 'メンタルヘルスケア'],
        careerGoals: [
          {
            term: 'short',
            goal: '現在の業務の安定化',
            targetDate: '2024-09-30',
            progress: 20,
            status: 'in_progress',
          },
        ],
      },
      recommendations: [
        {
          id: 'rec-002',
          date: '2024-05-25',
          type: 'support',
          priority: 'high',
          title: '定期的なメンタリング',
          description: '週1回の上司との1on1面談',
          status: 'accepted',
          deadline: '2024-08-31',
        },
      ],
      lastReviewDate: '2024-05-20',
      nextReviewDate: '2024-06-20',
    },
    createdAt: '2022-10-01',
    updatedAt: '2024-05-25',
  },
];

// 部署別の集計データ
export const departmentSummaryData = {
  nursing: {
    totalStaff: 120,
    supportLevelA: 15,
    supportLevelB: 85,
    supportLevelC: 18,
    supportLevelD: 2,
    averageScore: 75.5,
    trend: 'improving' as const,
  },
  rehabilitation: {
    totalStaff: 45,
    supportLevelA: 8,
    supportLevelB: 30,
    supportLevelC: 6,
    supportLevelD: 1,
    averageScore: 78.2,
    trend: 'stable' as const,
  },
  medical_affairs: {
    totalStaff: 25,
    supportLevelA: 2,
    supportLevelB: 15,
    supportLevelC: 7,
    supportLevelD: 1,
    averageScore: 68.3,
    trend: 'declining' as const,
  },
};

// 支援効果の統計データ
export const supportEffectivenessData = {
  overall: {
    interventionSuccess: '72%',
    averageImprovementTime: '3.5ヶ月',
    costPerImprovement: 45000,
    mostEffectiveIntervention: 'mentoring',
  },
  byLevel: {
    A: { success: '95%', avgTime: '2ヶ月' },
    B: { success: '78%', avgTime: '3ヶ月' },
    C: { success: '65%', avgTime: '4.5ヶ月' },
    D: { success: '45%', avgTime: '6ヶ月' },
  },
  byType: {
    training: { effectiveness: 3.8, usage: 35 },
    mentoring: { effectiveness: 4.2, usage: 25 },
    coaching: { effectiveness: 4.0, usage: 15 },
    counseling: { effectiveness: 3.5, usage: 20 },
    certification: { effectiveness: 4.5, usage: 5 },
  },
};