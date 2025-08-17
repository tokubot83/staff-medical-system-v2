/**
 * 面談質問バンク
 * v4・v5面談シートから抽出した質問を施設×職種×レベル別に整理
 */

import { QuestionMaster, QuestionCategory, InterviewTemplate } from '@/types/interview-question-master';
import { FacilityType, JobRole, StaffLevel } from '@/types/staff-common';

// ==========================================
// 1. 職場適応・人間関係カテゴリの質問
// ==========================================
export const adaptationQuestions: QuestionMaster[] = [
  {
    id: 'adapt-001',
    category: 'adaptation',
    baseQuestion: '職場環境への適応度はどの程度ですか？',
    questionType: 'hybrid',
    applicableConditions: {
      staffLevels: ['new', 'junior'],
      maxExperienceYears: 2
    },
    variations: [
      {
        conditions: { staffLevel: 'new', jobRole: 'nurse' },
        customizedQuestion: '病棟環境や勤務体制への適応はいかがですか？',
        customPlaceholder: '夜勤への適応、病棟ルールの理解度、困っていることなど...'
      },
      {
        conditions: { staffLevel: 'new', facilityType: 'acute' },
        customizedQuestion: '急性期病院の忙しい環境への適応はどうですか？',
        customPlaceholder: '業務スピード、緊急対応、多職種連携での課題など...'
      }
    ],
    scaleSettings: {
      labels: {
        low: '困難を感じる',
        high: '十分適応',
        midLabels: {
          2: 'やや困難',
          3: '普通',
          4: '概ね適応'
        }
      },
      defaultValue: 3,
      required: true
    },
    textSettings: {
      placeholder: '具体的な適応状況や課題を記入してください',
      rows: 3,
      required: false
    },
    guidance: {
      purpose: '新人職員の職場適応状況を把握し、必要なサポートを特定する',
      askingTips: [
        '否定的な回答でも受け止める姿勢を示す',
        '具体的なエピソードを引き出す',
        '改善の兆しがあれば褒める'
      ],
      followUpQuestions: [
        '特に適応が難しいと感じる場面は？',
        '誰に相談していますか？',
        '入職時と比べてどう変化しましたか？'
      ],
      redFlags: [
        '孤立している様子',
        '相談相手がいない',
        '適応への諦め'
      ],
      expectedTimeMinutes: 3
    },
    importance: 'critical',
    isRequired: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  },
  
  {
    id: 'adapt-002',
    category: 'adaptation',
    baseQuestion: 'チームメンバーとの関係性はいかがですか？',
    questionType: 'hybrid',
    applicableConditions: {},
    scaleSettings: {
      labels: {
        low: '課題あり',
        high: '非常に良好'
      },
      defaultValue: 3,
      required: true
    },
    textSettings: {
      placeholder: '人間関係で良い点、改善したい点を具体的に...',
      rows: 3,
      required: false
    },
    guidance: {
      purpose: '職場の人間関係を評価し、チームワークの課題を特定',
      askingTips: [
        'プライバシーに配慮しながら聞く',
        '良好な関係も具体的に聞く',
        '改善のアイデアを引き出す'
      ],
      expectedTimeMinutes: 2
    },
    importance: 'important',
    isRequired: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  }
];

// ==========================================
// 2. 技術・スキル習得カテゴリの質問
// ==========================================
export const skillsQuestions: QuestionMaster[] = [
  {
    id: 'skill-001',
    category: 'skills',
    baseQuestion: '基本的な看護技術の習得状況を教えてください',
    questionType: 'matrix',
    applicableConditions: {
      jobRoles: ['nurse', 'assistant-nurse'],
      staffLevels: ['new', 'junior']
    },
    matrixSettings: {
      items: [
        { id: 'vital', label: 'バイタルサイン測定', description: '血圧・脈拍・体温測定' },
        { id: 'injection', label: '採血・静脈注射', description: '安全な穿刺技術' },
        { id: 'drip', label: '点滴管理', description: '滴下調整・ルート管理' },
        { id: 'medication', label: '服薬管理', description: '与薬・薬剤知識' },
        { id: 'clean', label: '清潔ケア', description: '清拭・洗髪・口腔ケア' },
        { id: 'excretion', label: '排泄ケア', description: 'オムツ交換・導尿' },
        { id: 'transfer', label: '移動・移乗介助', description: '安全な体位変換' },
        { id: 'record', label: '記録・報告', description: '看護記録・申し送り' }
      ],
      scaleLabels: {
        low: '習得中',
        high: '自立',
        midLabels: {
          2: '要指導',
          3: '見守り必要',
          4: '概ね自立'
        }
      }
    },
    guidance: {
      purpose: '基本看護技術の習得度を詳細に把握し、教育計画に反映',
      askingTips: [
        '各項目で最近の実施例を聞く',
        'できていることをまず褒める',
        '不安な技術を優先順位付け'
      ],
      expectedTimeMinutes: 5
    },
    importance: 'critical',
    isRequired: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  },
  
  {
    id: 'skill-002',
    category: 'skills',
    baseQuestion: '専門知識・スキルで伸ばしたい分野はありますか？',
    questionType: 'text',
    applicableConditions: {},
    textSettings: {
      placeholder: '興味のある専門分野、取得したい資格、学びたい技術など...',
      rows: 4,
      required: false
    },
    guidance: {
      purpose: '職員の学習意欲と成長志向を把握',
      askingTips: [
        'キャリアビジョンと結びつける',
        '具体的な学習計画を一緒に考える',
        '組織のサポート体制を説明'
      ],
      expectedTimeMinutes: 3
    },
    importance: 'important',
    isRequired: false,
    sortOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  }
];

// ==========================================
// 3. 業務遂行・成果カテゴリの質問  
// ==========================================
export const performanceQuestions: QuestionMaster[] = [
  {
    id: 'perf-001',
    category: 'performance',
    baseQuestion: '現在の業務量は適切ですか？',
    questionType: 'hybrid',
    applicableConditions: {},
    variations: [
      {
        conditions: { facilityType: 'acute' },
        customizedQuestion: '急性期病院での業務量・業務ペースは適切ですか？',
        customPlaceholder: '時間外労働、休憩時間、業務の偏りなど...'
      },
      {
        conditions: { facilityType: 'chronic' },
        customizedQuestion: '慢性期での日常業務量は管理可能ですか？',
        customPlaceholder: '定期業務とイレギュラー対応のバランスなど...'
      },
      {
        conditions: { facilityType: 'roken' },
        customizedQuestion: '老健での介護・リハビリ業務の負担はどうですか？',
        customPlaceholder: '身体的負担、精神的負担、業務配分など...'
      }
    ],
    scaleSettings: {
      labels: {
        low: '過重',
        high: '適切',
        midLabels: {
          2: 'やや多い',
          3: '普通',
          4: 'ちょうど良い'
        }
      },
      defaultValue: 3,
      required: true
    },
    textSettings: {
      placeholder: '業務量に関する具体的な状況を記入...',
      rows: 3,
      required: false
    },
    guidance: {
      purpose: '業務負荷を評価し、必要に応じて業務調整を検討',
      askingTips: [
        '残業時間を具体的に確認',
        '繁忙期と閑散期の差を聞く',
        '効率化のアイデアを募る'
      ],
      redFlags: [
        '慢性的な残業',
        '休憩が取れない',
        '疲労の蓄積'
      ],
      expectedTimeMinutes: 3
    },
    importance: 'critical',
    isRequired: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  },
  
  {
    id: 'perf-002',
    category: 'performance',
    baseQuestion: '最近の業務で誇れる成果や貢献はありますか？',
    questionType: 'text',
    applicableConditions: {},
    textSettings: {
      placeholder: '患者対応での工夫、業務改善提案、チームへの貢献など具体的に...',
      rows: 4,
      required: false
    },
    guidance: {
      purpose: '職員の成果を認識し、モチベーション向上につなげる',
      askingTips: [
        '小さな成果も見逃さない',
        '具体的に褒める',
        '他のメンバーにも共有可能か確認'
      ],
      expectedTimeMinutes: 3
    },
    importance: 'important',
    isRequired: false,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  }
];

// ==========================================
// 4. 健康・ストレス管理カテゴリの質問
// ==========================================
export const healthQuestions: QuestionMaster[] = [
  {
    id: 'health-001',
    category: 'health',
    baseQuestion: '心身の健康状態はいかがですか？',
    questionType: 'hybrid',
    applicableConditions: {},
    scaleSettings: {
      labels: {
        low: '要注意',
        high: '良好',
        midLabels: {
          2: '不調気味',
          3: '普通',
          4: '概ね良好'
        }
      },
      defaultValue: 3,
      required: true
    },
    textSettings: {
      placeholder: '睡眠、疲労、体調面で気になることがあれば...',
      rows: 3,
      required: false
    },
    guidance: {
      purpose: '健康リスクの早期発見と適切な支援提供',
      askingTips: [
        'プライバシーに配慮',
        '産業医面談の提案も検討',
        '無理をしていないか確認'
      ],
      redFlags: [
        '慢性的な不眠',
        '食欲不振',
        '気分の落ち込み'
      ],
      expectedTimeMinutes: 3
    },
    importance: 'critical',
    isRequired: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  },
  
  {
    id: 'health-002',
    category: 'health',
    baseQuestion: '現在のストレス要因を教えてください',
    questionType: 'checklist',
    applicableConditions: {},
    checklistItems: [
      '業務量・時間圧迫',
      '人間関係',
      '責任・プレッシャー',
      'スキル不足の不安',
      'ワークライフバランス',
      '将来への不安',
      '評価・処遇',
      '職場環境・設備'
    ],
    guidance: {
      purpose: 'ストレス要因を特定し、改善策を検討',
      askingTips: [
        '複数選択可を伝える',
        '最も影響が大きいものを特定',
        '解決可能なものから対処'
      ],
      expectedTimeMinutes: 2
    },
    importance: 'important',
    isRequired: false,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  }
];

// ==========================================
// 5. 成長・キャリア開発カテゴリの質問
// ==========================================
export const growthQuestions: QuestionMaster[] = [
  {
    id: 'growth-001',
    category: 'growth',
    baseQuestion: '今後のキャリア目標を教えてください',
    questionType: 'text',
    applicableConditions: {},
    variations: [
      {
        conditions: { staffLevel: 'new' },
        customizedQuestion: '1-2年後にどんな看護師になりたいですか？',
        customPlaceholder: '目指す先輩像、身につけたい技術、担当したい業務など...'
      },
      {
        conditions: { staffLevel: 'veteran' },
        customizedQuestion: '今後のキャリアビジョンや専門性の方向性は？',
        customPlaceholder: '管理職、専門看護師、認定資格、教育役割など...'
      }
    ],
    textSettings: {
      placeholder: '3-5年後の理想像、挑戦したい分野など具体的に...',
      rows: 4,
      required: false
    },
    guidance: {
      purpose: 'キャリア志向を把握し、育成計画に反映',
      askingTips: [
        '実現可能性を一緒に検討',
        '必要な支援を確認',
        'ロールモデルの存在を聞く'
      ],
      expectedTimeMinutes: 4
    },
    importance: 'important',
    isRequired: false,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  },
  
  {
    id: 'growth-002',
    category: 'growth',
    baseQuestion: '成長を実感できていますか？',
    questionType: 'hybrid',
    applicableConditions: {},
    scaleSettings: {
      labels: {
        low: '停滞している',
        high: '大きく成長'
      },
      defaultValue: 3,
      required: true
    },
    textSettings: {
      placeholder: '成長を感じる点、まだ課題と感じる点を具体的に...',
      rows: 3,
      required: false
    },
    guidance: {
      purpose: '成長実感を確認し、モチベーション維持',
      askingTips: [
        '具体的な成長エピソードを聞く',
        '過去と現在を比較',
        '成長を認めて褒める'
      ],
      expectedTimeMinutes: 3
    },
    importance: 'important',
    isRequired: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  }
];

// ==========================================
// 6. 満足度・モチベーションカテゴリの質問
// ==========================================
export const satisfactionQuestions: QuestionMaster[] = [
  {
    id: 'satisfy-001',
    category: 'satisfaction',
    baseQuestion: '現在の仕事へのモチベーションはどの程度ですか？',
    questionType: 'hybrid',
    applicableConditions: {},
    scaleSettings: {
      labels: {
        low: '非常に低い',
        high: '非常に高い'
      },
      defaultValue: 3,
      required: true
    },
    textSettings: {
      placeholder: 'モチベーションに影響している要因を具体的に...',
      rows: 3,
      required: true
    },
    guidance: {
      purpose: 'モチベーションレベルと要因を把握',
      askingTips: [
        '数値の理由を深掘り',
        'プラス/マイナス要因を整理',
        '改善可能な点を特定'
      ],
      expectedTimeMinutes: 3
    },
    importance: 'critical',
    isRequired: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  },
  
  {
    id: 'satisfy-002',
    category: 'satisfaction',
    baseQuestion: '職場環境の満足度はいかがですか？',
    questionType: 'matrix',
    applicableConditions: {},
    matrixSettings: {
      items: [
        { id: 'facility', label: '設備・環境' },
        { id: 'system', label: '制度・ルール' },
        { id: 'culture', label: '職場文化' },
        { id: 'support', label: 'サポート体制' },
        { id: 'communication', label: '情報共有' }
      ],
      scaleLabels: {
        low: '不満',
        high: '満足'
      }
    },
    guidance: {
      purpose: '職場環境の課題を多角的に評価',
      askingTips: [
        '具体的な改善要望を聞く',
        '良い点も確認',
        '実現可能な改善から着手'
      ],
      expectedTimeMinutes: 4
    },
    importance: 'important',
    isRequired: false,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  }
];

// ==========================================
// 面談テンプレートサンプル
// ==========================================
export const interviewTemplates: InterviewTemplate[] = [
  {
    id: 'template-001',
    name: '新人看護師30分定期面談',
    description: '入職1年未満の看護師向け標準面談',
    facilityType: 'acute',
    jobRole: 'nurse',
    staffLevel: 'new',
    duration: 30,
    sections: [
      {
        id: 'section-1',
        title: '職場適応と人間関係',
        category: 'adaptation',
        description: '職場への適応状況と人間関係を確認',
        estimatedMinutes: 8,
        questions: ['adapt-001', 'adapt-002'],
        sectionGuidance: {
          introduction: 'まず、職場にどの程度慣れてきたか、お聞かせください。',
          keyPoints: [
            '否定的な内容も受け止める',
            '具体的なサポートニーズを確認',
            '成長を認める'
          ],
          transitionPhrase: '次に、技術面での習得状況について確認させてください。'
        }
      },
      {
        id: 'section-2',
        title: '看護技術の習得状況',
        category: 'skills',
        description: '基本看護技術の習得度を評価',
        estimatedMinutes: 8,
        questions: ['skill-001', 'skill-002'],
        sectionGuidance: {
          introduction: '日々の看護業務での技術習得はいかがですか？',
          keyPoints: [
            'できていることを褒める',
            '不安な技術を明確化',
            '学習計画を一緒に立てる'
          ],
          transitionPhrase: '続いて、健康面について確認させてください。'
        }
      },
      {
        id: 'section-3',
        title: '心身の健康とストレス',
        category: 'health',
        description: '健康状態とストレス要因を把握',
        estimatedMinutes: 6,
        questions: ['health-001', 'health-002'],
        sectionGuidance: {
          introduction: '新人期は特に心身の負担が大きいですが、体調はいかがですか？',
          keyPoints: [
            'プライバシーに配慮',
            '無理をしていないか確認',
            '必要に応じて産業医面談を提案'
          ],
          transitionPhrase: '次に、今後の目標についてお聞かせください。'
        }
      },
      {
        id: 'section-4',
        title: '今後の目標と成長',
        category: 'growth',
        description: '成長実感と今後の目標を確認',
        estimatedMinutes: 5,
        questions: ['growth-001', 'growth-002'],
        sectionGuidance: {
          introduction: '入職から今までを振り返って、どんな成長を感じますか？',
          keyPoints: [
            '成長を具体的に認める',
            '次のステップを明確化',
            '必要な支援を約束'
          ],
          transitionPhrase: '最後に、職場への要望があればお聞かせください。'
        }
      },
      {
        id: 'section-5',
        title: '満足度とフィードバック',
        category: 'satisfaction',
        description: '総合的な満足度と改善要望',
        estimatedMinutes: 3,
        questions: ['satisfy-001'],
        sectionGuidance: {
          introduction: '現在の仕事全体についてどう感じていますか？',
          keyPoints: [
            'モチベーション要因を整理',
            '改善可能な点を特定',
            '次回面談日程を決定'
          ],
          transitionPhrase: '本日はありがとうございました。一緒に頑張りましょう。'
        }
      }
    ],
    settings: {
      allowSkipOptional: true,
      autoSave: true,
      showProgress: true,
      enableTimer: true
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: '1.0.0'
  }
];

// 質問マスターデータの統合エクスポート
export const questionMasterData: QuestionMaster[] = [
  ...adaptationQuestions,
  ...skillsQuestions,
  ...performanceQuestions,
  ...healthQuestions,
  ...growthQuestions,
  ...satisfactionQuestions
];