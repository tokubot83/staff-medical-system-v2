/**
 * v6面談シート 共通テンプレート
 */

import { 
  InterviewSection, 
  InterviewQuestion,
  ExperienceLevel,
  InterviewDuration,
  MotivationType
} from './types';

// ===== 動機タイプ診断セクション =====
export function createMotivationDiagnosisSection(duration: InterviewDuration): InterviewSection {
  const isQuickVersion = duration === 15; // 15分版は簡易3問
  
  const questions: InterviewQuestion[] = [
    {
      id: 'motivation_q1',
      content: '仕事で最もやりがいを感じるのはどんな時ですか？',
      type: 'motivation',
      required: true,
      motivationOptions: [
        {
          value: 'a',
          label: '困難な目標を達成した時',
          motivationPoints: { 
            achievement: 3, growth: 2, recognition: 1 
          }
        },
        {
          value: 'b',
          label: 'チームで協力して成果を出した時',
          motivationPoints: { 
            affiliation: 3, security: 1, contribution: 1 
          }
        },
        {
          value: 'c',
          label: '他者に良い影響を与えられた時',
          motivationPoints: { 
            power: 3, contribution: 2, recognition: 1 
          }
        },
        {
          value: 'd',
          label: '自分の判断で物事を進められた時',
          motivationPoints: { 
            autonomy: 3, achievement: 1, growth: 1 
          }
        }
      ]
    },
    {
      id: 'motivation_q2',
      content: '理想的な職場環境はどれですか？',
      type: 'motivation',
      required: true,
      motivationOptions: [
        {
          value: 'a',
          label: '高い目標と成果が評価される環境',
          motivationPoints: { 
            achievement: 3, recognition: 2, growth: 1 
          }
        },
        {
          value: 'b',
          label: '温かい人間関係と協力的な雰囲気',
          motivationPoints: { 
            affiliation: 3, security: 2, contribution: 1 
          }
        },
        {
          value: 'c',
          label: '明確なルールと安定した環境',
          motivationPoints: { 
            security: 3, affiliation: 1 
          }
        },
        {
          value: 'd',
          label: '学習機会が豊富で成長できる環境',
          motivationPoints: { 
            growth: 3, achievement: 1, autonomy: 1 
          }
        }
      ]
    },
    {
      id: 'motivation_q3',
      content: 'キャリアで最も重視することは？',
      type: 'motivation',
      required: true,
      motivationOptions: [
        {
          value: 'a',
          label: '専門性を高めて第一人者になる',
          motivationPoints: { 
            achievement: 2, growth: 2, recognition: 2 
          }
        },
        {
          value: 'b',
          label: '良好な人間関係の中で長く働く',
          motivationPoints: { 
            affiliation: 3, security: 2 
          }
        },
        {
          value: 'c',
          label: '社会に意義ある貢献をする',
          motivationPoints: { 
            contribution: 3, growth: 1, recognition: 1 
          }
        },
        {
          value: 'd',
          label: 'リーダーとして組織を導く',
          motivationPoints: { 
            power: 3, achievement: 1, recognition: 1 
          }
        }
      ]
    }
  ];

  // 詳細版（30分以上）は追加2問
  if (!isQuickVersion) {
    questions.push(
      {
        id: 'motivation_q4',
        content: 'ストレスを感じるのはどんな状況？',
        type: 'motivation',
        motivationOptions: [
          {
            value: 'a',
            label: '目標が不明確で成果が見えない時',
            motivationPoints: { achievement: 3, growth: 1, recognition: 1 }
          },
          {
            value: 'b',
            label: '人間関係がギスギスしている時',
            motivationPoints: { affiliation: 3, security: 1 }
          },
          {
            value: 'c',
            label: '裁量権がなく指示待ちの時',
            motivationPoints: { autonomy: 3, power: 2 }
          },
          {
            value: 'd',
            label: '将来が不透明で不安定な時',
            motivationPoints: { security: 3 }
          }
        ]
      },
      {
        id: 'motivation_q5',
        content: '褒められて嬉しいのは？',
        type: 'motivation',
        motivationOptions: [
          {
            value: 'a',
            label: '優れた成果を認められた時',
            motivationPoints: { achievement: 2, recognition: 3 }
          },
          {
            value: 'b',
            label: 'チームへの貢献を評価された時',
            motivationPoints: { affiliation: 2, contribution: 2, recognition: 1 }
          },
          {
            value: 'c',
            label: '成長・進歩を認められた時',
            motivationPoints: { growth: 3, achievement: 1, recognition: 1 }
          },
          {
            value: 'd',
            label: 'リーダーシップを評価された時',
            motivationPoints: { power: 3, autonomy: 1, recognition: 1 }
          }
        ]
      }
    );
  }

  return {
    id: 'motivation_diagnosis',
    title: '動機タイプ診断',
    timeAllocation: isQuickVersion ? 3 : 5,
    questions,
    isMotivationDiagnosis: true
  };
}

// ===== 経験年数別の基本質問セット =====
export function createCoreQuestions(experienceLevel: ExperienceLevel): InterviewQuestion[] {
  const baseQuestions: InterviewQuestion[] = [
    {
      id: 'current_condition',
      content: '現在の体調や勤務状況はいかがですか？',
      type: 'open',
      required: true
    },
    {
      id: 'work_satisfaction',
      content: '現在の業務に対する満足度を教えてください',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: ['不満', 'やや不満', '普通', 'やや満足', '満足'],
      required: true
    }
  ];

  // 経験年数別の追加質問
  switch (experienceLevel) {
    case 'new':
      return [
        ...baseQuestions,
        {
          id: 'adaptation_status',
          content: '職場への適応状況はいかがですか？困っていることはありませんか？',
          type: 'open',
          required: true
        },
        {
          id: 'learning_progress',
          content: '業務の習得状況について、現在の理解度を教えてください',
          type: 'scale',
          scaleMin: 1,
          scaleMax: 5,
          scaleLabels: ['初級', '基礎理解', '実践可能', '習熟', '指導可能']
        },
        {
          id: 'support_needs',
          content: '現在、特にサポートが必要な業務や分野はありますか？',
          type: 'open'
        }
      ];

    case 'junior':
      return [
        ...baseQuestions,
        {
          id: 'skill_development',
          content: '自身のスキル向上について、特に力を入れている分野は？',
          type: 'open',
          required: true
        },
        {
          id: 'independence_level',
          content: '独り立ちして業務を行える範囲について教えてください',
          type: 'open'
        },
        {
          id: 'career_vision',
          content: '今後1-2年でどのような成長を目指していますか？',
          type: 'open'
        }
      ];

    case 'midlevel':
      return [
        ...baseQuestions,
        {
          id: 'expertise_area',
          content: '自身の専門性や強みと感じている分野について教えてください',
          type: 'open',
          required: true
        },
        {
          id: 'mentoring_experience',
          content: '後輩指導や教育に関わる機会はありますか？どのように感じていますか？',
          type: 'open'
        },
        {
          id: 'career_development',
          content: '今後のキャリアについて、どのような方向性を考えていますか？',
          type: 'open',
          required: true
        }
      ];

    case 'veteran':
      return [
        ...baseQuestions,
        {
          id: 'role_contribution',
          content: '組織やチームへの貢献について、現在の役割をどう捉えていますか？',
          type: 'open',
          required: true
        },
        {
          id: 'knowledge_transfer',
          content: '自身の経験や知識の継承について、どのような取り組みをしていますか？',
          type: 'open'
        },
        {
          id: 'work_life_balance',
          content: 'ワークライフバランスや今後の働き方について考えはありますか？',
          type: 'open'
        }
      ];

    case 'leader':
    case 'manager':
      return [
        ...baseQuestions,
        {
          id: 'team_management',
          content: 'チーム運営や部下のマネジメントについて、現在の課題は？',
          type: 'open',
          required: true
        },
        {
          id: 'organizational_issues',
          content: '組織全体の課題や改善提案があれば教えてください',
          type: 'open'
        },
        {
          id: 'leadership_development',
          content: 'リーダーシップやマネジメントスキルの向上について、どのような取り組みをしていますか？',
          type: 'open'
        }
      ];
  }
}

// ===== 職場環境・人間関係セクション =====
export function createWorkEnvironmentSection(duration: InterviewDuration): InterviewSection {
  const questions: InterviewQuestion[] = [
    {
      id: 'team_relationship',
      content: 'チーム内の人間関係について、現状はいかがですか？',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      scaleLabels: ['問題あり', 'やや課題', '普通', '良好', '非常に良好'],
      required: true
    },
    {
      id: 'communication_issues',
      content: 'コミュニケーションで困っていることはありますか？',
      type: 'open'
    }
  ];

  // 30分以上は詳細質問追加
  if (duration >= 30) {
    questions.push(
      {
        id: 'workplace_improvement',
        content: '職場環境で改善してほしい点があれば教えてください',
        type: 'open'
      },
      {
        id: 'support_system',
        content: '困った時に相談できる人はいますか？サポート体制は十分ですか？',
        type: 'open'
      }
    );
  }

  return {
    id: 'work_environment',
    title: '職場環境・人間関係',
    timeAllocation: duration === 15 ? 3 : duration === 30 ? 5 : 7,
    questions
  };
}

// ===== 目標設定・アクションプラン =====
export function createGoalSettingSection(experienceLevel: ExperienceLevel): InterviewSection {
  const questions: InterviewQuestion[] = [
    {
      id: 'short_term_goal',
      content: '今後3ヶ月の目標を設定しましょう',
      type: 'open',
      required: true
    }
  ];

  // 経験年数に応じた目標設定
  if (['midlevel', 'veteran', 'leader', 'manager'].includes(experienceLevel)) {
    questions.push({
      id: 'long_term_goal',
      content: '今後1年間の中長期目標も考えてみましょう',
      type: 'open'
    });
  }

  questions.push({
    id: 'action_plan',
    content: '目標達成のための具体的なアクションプランを教えてください',
    type: 'open',
    required: true
  });

  return {
    id: 'goal_setting',
    title: '目標設定・アクションプラン',
    timeAllocation: 5,
    questions
  };
}