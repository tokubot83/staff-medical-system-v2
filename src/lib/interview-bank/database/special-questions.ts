/**
 * 特別面談バンク - 質問データベース
 * 退職面談、異動面談、復職面談、昇進面談などの質問を含む
 */

import { BankQuestion } from '../types';

// 特別面談質問データベース
export const specialQuestions: BankQuestion[] = [
  // === 退職面談質問 ===
  // 基本的な退職理由
  {
    id: 'exit_001',
    category: 'exit_interview',
    questionText: '退職を決意した主な理由を教えてください',
    questionType: 'text',
    tags: ['退職面談', '退職理由', '重要'],
    priority: 1,
    estimatedTime: 5,
    metadata: {
      exitType: 'all',
      critical: true
    }
  },
  {
    id: 'exit_002',
    category: 'exit_interview',
    questionText: '退職理由として当てはまるものを選んでください（複数選択可）',
    questionType: 'multiple_choice',
    options: [
      '仕事内容が想定と違った',
      '業務難易度が高すぎた',
      '教育・研修が不十分',
      'OJTサポート不足',
      '職場の雰囲気が合わない',
      '人間関係のトラブル',
      '上司との相性',
      '労働時間・シフトの問題',
      '給与・待遇の不満',
      '通勤の負担',
      '体力的についていけない',
      '精神的ストレス',
      '他の仕事が決まった',
      '家族・個人的事情',
      '健康上の問題',
      'その他'
    ],
    tags: ['退職面談', '退職理由', '多選択'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      exitType: 'all'
    }
  },
  {
    id: 'exit_003',
    category: 'exit_interview',
    questionText: '退職を考え始めた時期はいつ頃ですか？',
    questionType: 'text',
    tags: ['退職面談', '時期'],
    priority: 2,
    estimatedTime: 2,
    metadata: {
      exitType: 'all'
    }
  },
  {
    id: 'exit_004',
    category: 'exit_interview',
    questionText: '退職について誰かに相談しましたか？その相手は？',
    questionType: 'text',
    tags: ['退職面談', '相談'],
    priority: 3,
    estimatedTime: 2,
    metadata: {
      exitType: 'all'
    }
  },

  // 採用・期待値ギャップ（試用期間職員重点）
  {
    id: 'exit_expectation_001',
    category: 'exit_interview',
    questionText: '入職前の期待と実際の業務にギャップはありましたか？',
    questionType: 'text',
    tags: ['退職面談', 'ギャップ', '試用期間'],
    priority: 1,
    estimatedTime: 4,
    metadata: {
      exitType: 'probation',
      probationFocus: true
    }
  },
  {
    id: 'exit_expectation_002',
    category: 'exit_interview',
    questionText: '期待と現実のギャップを項目別に評価してください',
    questionType: 'rating_matrix',
    options: [
      '仕事内容・業務範囲',
      '必要なスキル・知識',
      '業務量・忙しさ',
      '教育・研修内容',
      '職場の雰囲気・文化',
      '上司・先輩の指導',
      'チームワーク・協力体制',
      '勤務時間・シフト',
      '給与・手当',
      '福利厚生・休暇'
    ],
    tags: ['退職面談', 'ギャップ評価'],
    priority: 2,
    estimatedTime: 5,
    metadata: {
      exitType: 'probation',
      ratingScale: ['期待以上', '期待通り', '期待以下']
    }
  },
  {
    id: 'exit_expectation_003',
    category: 'exit_interview',
    questionText: '面接・説明会で聞いていた内容と実際に違っていた点は？',
    questionType: 'text',
    tags: ['退職面談', '採用過程', '相違点'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      exitType: 'probation'
    }
  },
  {
    id: 'exit_expectation_004',
    category: 'exit_interview',
    questionText: '採用選考時に詳しく説明してほしかった情報はありますか？',
    questionType: 'text',
    tags: ['退職面談', '採用改善'],
    priority: 3,
    estimatedTime: 3,
    metadata: {
      exitType: 'probation'
    }
  },

  // 教育・サポート体制
  {
    id: 'exit_training_001',
    category: 'exit_interview',
    questionText: '入職時研修の内容・期間・理解度確認について評価してください',
    questionType: 'rating',
    options: ['とても良い', '良い', '普通', '不十分', 'とても不十分'],
    tags: ['退職面談', '研修評価'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      exitType: 'all'
    }
  },
  {
    id: 'exit_training_002',
    category: 'exit_interview',
    questionText: 'OJT・現場教育について感想を聞かせてください',
    questionType: 'text',
    tags: ['退職面談', 'OJT', '現場教育'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      exitType: 'all'
    }
  },
  {
    id: 'exit_training_003',
    category: 'exit_interview',
    questionText: '業務で最も困ったこと・不安だったことは何ですか？',
    questionType: 'text',
    tags: ['退職面談', '困難', '不安'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      exitType: 'all'
    }
  },
  {
    id: 'exit_training_004',
    category: 'exit_interview',
    questionText: '改善が必要だと思う教育項目を選んでください（複数選択可）',
    questionType: 'multiple_choice',
    options: [
      '基礎知識の説明',
      '実技指導',
      '安全教育',
      '接遇・マナー',
      'システム操作',
      '業務フロー説明',
      'チーム連携',
      '緊急時対応'
    ],
    tags: ['退職面談', '教育改善'],
    priority: 3,
    estimatedTime: 3,
    metadata: {
      exitType: 'probation'
    }
  },

  // 改善提案・フィードバック
  {
    id: 'exit_improvement_001',
    category: 'exit_interview',
    questionText: '採用プロセスに対する改善提案をお聞かせください',
    questionType: 'text',
    tags: ['退職面談', '採用改善', '提案'],
    priority: 3,
    estimatedTime: 4,
    metadata: {
      exitType: 'all'
    }
  },
  {
    id: 'exit_improvement_002',
    category: 'exit_interview',
    questionText: '新人受け入れ体制への改善提案は？',
    questionType: 'text',
    tags: ['退職面談', '受け入れ改善', '提案'],
    priority: 3,
    estimatedTime: 3,
    metadata: {
      exitType: 'all'
    }
  },
  {
    id: 'exit_improvement_003',
    category: 'exit_interview',
    questionText: 'この職場を他の人に勧めますか？',
    questionType: 'single_choice',
    options: ['勧める', '条件付きで勧める', '勧めない'],
    tags: ['退職面談', '推奨度', 'eNPS'],
    priority: 2,
    estimatedTime: 2,
    metadata: {
      exitType: 'all',
      npsQuestion: true
    }
  },
  {
    id: 'exit_improvement_004',
    category: 'exit_interview',
    questionText: '良かった点・感謝していることがあれば教えてください',
    questionType: 'text',
    tags: ['退職面談', 'ポジティブ', '感謝'],
    priority: 3,
    estimatedTime: 3,
    metadata: {
      exitType: 'all',
      positive: true
    }
  },

  // 今後・手続き
  {
    id: 'exit_future_001',
    category: 'exit_interview',
    questionText: '今後の予定を教えてください',
    questionType: 'single_choice',
    options: ['転職先決定済み', '求職活動中', 'しばらく休養予定', '進学・資格取得', '家事・育児専念', 'その他'],
    tags: ['退職面談', '今後の予定'],
    priority: 3,
    estimatedTime: 2,
    metadata: {
      exitType: 'all'
    }
  },
  {
    id: 'exit_procedure_001',
    category: 'exit_interview',
    questionText: '返却物の確認をお願いします',
    questionType: 'multiple_choice',
    options: ['制服・作業着', '社員証・IDカード', '鍵・セキュリティカード', 'マニュアル・資料', 'PC・機器類', 'その他'],
    tags: ['退職面談', '手続き', '返却物'],
    priority: 1,
    estimatedTime: 2,
    metadata: {
      exitType: 'all',
      procedural: true
    }
  },

  // === 異動面談質問 ===
  {
    id: 'transfer_001',
    category: 'transfer_interview',
    questionText: '異動の背景・理由について説明させていただきます',
    questionType: 'information',
    tags: ['異動面談', '説明'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      transferType: 'all'
    }
  },
  {
    id: 'transfer_002',
    category: 'transfer_interview',
    questionText: '異動についてのご質問や不安な点はありますか？',
    questionType: 'text',
    tags: ['異動面談', '不安', '質問'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      transferType: 'all'
    }
  },
  {
    id: 'transfer_003',
    category: 'transfer_interview',
    questionText: '新しい部署・職務に対する期待や目標は？',
    questionType: 'text',
    tags: ['異動面談', '期待', '目標'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      transferType: 'all'
    }
  },
  {
    id: 'transfer_004',
    category: 'transfer_interview',
    questionText: '現在の部署で身につけたスキルで活かせるものは？',
    questionType: 'text',
    tags: ['異動面談', 'スキル', '活用'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      transferType: 'all'
    }
  },
  {
    id: 'transfer_005',
    category: 'transfer_interview',
    questionText: '新部署で学びたいこと・チャレンジしたいことは？',
    questionType: 'text',
    tags: ['異動面談', '学習', 'チャレンジ'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      transferType: 'all'
    }
  },

  // === 復職面談質問 ===
  {
    id: 'return_001',
    category: 'return_interview',
    questionText: '休職中の状況についてお聞かせください',
    questionType: 'text',
    tags: ['復職面談', '休職期間', '状況'],
    priority: 1,
    estimatedTime: 4,
    metadata: {
      returnType: 'all',
      sensitive: true
    }
  },
  {
    id: 'return_002',
    category: 'return_interview',
    questionText: '現在の体調・健康状態はいかがですか？',
    questionType: 'text',
    tags: ['復職面談', '健康状態', '体調'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      returnType: 'all',
      healthCheck: true
    }
  },
  {
    id: 'return_003',
    category: 'return_interview',
    questionText: '復職に向けての準備状況を教えてください',
    questionType: 'text',
    tags: ['復職面談', '準備', '復職準備'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      returnType: 'all'
    }
  },
  {
    id: 'return_004',
    category: 'return_interview',
    questionText: '復職後の業務に対する不安はありますか？',
    questionType: 'text',
    tags: ['復職面談', '不安', '業務'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      returnType: 'all'
    }
  },
  {
    id: 'return_005',
    category: 'return_interview',
    questionText: '段階的な復職プログラムは必要ですか？',
    questionType: 'scale',
    options: ['フルタイムで問題なし', '段階的復職を希望', '時短勤務を希望', '要相談'],
    tags: ['復職面談', '勤務形態', 'プログラム'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      returnType: 'all'
    }
  },
  {
    id: 'return_006',
    category: 'return_interview',
    questionText: '職場復帰にあたって必要なサポートは？',
    questionType: 'text',
    tags: ['復職面談', 'サポート', '支援'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      returnType: 'all'
    }
  },

  // === 昇進面談質問 ===
  {
    id: 'promotion_001',
    category: 'promotion_interview',
    questionText: '昇進の打診について率直なお気持ちをお聞かせください',
    questionType: 'text',
    tags: ['昇進面談', '気持ち', '意向'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      promotionType: 'all'
    }
  },
  {
    id: 'promotion_002',
    category: 'promotion_interview',
    questionText: '新しい役職・責任についてご質問はありますか？',
    questionType: 'text',
    tags: ['昇進面談', '役職', '責任', '質問'],
    priority: 1,
    estimatedTime: 3,
    metadata: {
      promotionType: 'all'
    }
  },
  {
    id: 'promotion_003',
    category: 'promotion_interview',
    questionText: '現在のお立場で身につけた経験・スキルで活かせるものは？',
    questionType: 'text',
    tags: ['昇進面談', '経験', 'スキル'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      promotionType: 'all'
    }
  },
  {
    id: 'promotion_004',
    category: 'promotion_interview',
    questionText: '新しい役職で特に力を入れたい取り組みは？',
    questionType: 'text',
    tags: ['昇進面談', '取り組み', '重点'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      promotionType: 'all'
    }
  },
  {
    id: 'promotion_005',
    category: 'promotion_interview',
    questionText: '昇進に向けて不安な点や学習したい分野は？',
    questionType: 'text',
    tags: ['昇進面談', '不安', '学習'],
    priority: 2,
    estimatedTime: 3,
    metadata: {
      promotionType: 'all'
    }
  },
  {
    id: 'promotion_006',
    category: 'promotion_interview',
    questionText: 'チーム・部下のマネジメントについての考えをお聞かせください',
    questionType: 'text',
    tags: ['昇進面談', 'マネジメント', 'チーム'],
    priority: 1,
    estimatedTime: 4,
    metadata: {
      promotionType: 'management'
    }
  },

  // === 懲戒面談質問 ===
  {
    id: 'disciplinary_001',
    category: 'disciplinary_interview',
    questionText: '今回の件について事実確認をさせていただきます',
    questionType: 'information',
    tags: ['懲戒面談', '事実確認'],
    priority: 1,
    estimatedTime: 2,
    metadata: {
      disciplinaryType: 'all',
      formal: true
    }
  },
  {
    id: 'disciplinary_002',
    category: 'disciplinary_interview',
    questionText: '経緯と状況について詳しく説明してください',
    questionType: 'text',
    tags: ['懲戒面談', '経緯', '状況説明'],
    priority: 1,
    estimatedTime: 5,
    metadata: {
      disciplinaryType: 'all'
    }
  },
  {
    id: 'disciplinary_003',
    category: 'disciplinary_interview',
    questionText: '今回の行為について、ご自身の認識をお聞かせください',
    questionType: 'text',
    tags: ['懲戒面談', '認識', '自己評価'],
    priority: 1,
    estimatedTime: 4,
    metadata: {
      disciplinaryType: 'all'
    }
  },
  {
    id: 'disciplinary_004',
    category: 'disciplinary_interview',
    questionText: '改善に向けての具体的な対策をお聞かせください',
    questionType: 'text',
    tags: ['懲戒面談', '改善', '対策'],
    priority: 1,
    estimatedTime: 4,
    metadata: {
      disciplinaryType: 'all'
    }
  }
];

// 特別面談タイプ別の質問IDマッピング
export const specialQuestionsByType = {
  exit: {
    general: ['exit_001', 'exit_002', 'exit_003', 'exit_004', 'exit_training_003', 'exit_improvement_003', 'exit_improvement_004'],
    probation: ['exit_001', 'exit_002', 'exit_expectation_001', 'exit_expectation_002', 'exit_expectation_003', 'exit_training_001', 'exit_training_002', 'exit_training_003', 'exit_training_004'],
    regular: ['exit_001', 'exit_002', 'exit_003', 'exit_training_001', 'exit_training_002', 'exit_improvement_001', 'exit_improvement_002', 'exit_improvement_003'],
    voluntary: ['exit_001', 'exit_002', 'exit_003', 'exit_improvement_001', 'exit_improvement_003', 'exit_improvement_004', 'exit_future_001'],
    involuntary: ['exit_001', 'exit_002', 'exit_training_003', 'exit_improvement_001', 'exit_improvement_002']
  },
  transfer: [
    'transfer_001', 'transfer_002', 'transfer_003', 'transfer_004', 'transfer_005'
  ],
  return: [
    'return_001', 'return_002', 'return_003', 'return_004', 'return_005', 'return_006'
  ],
  promotion: {
    general: ['promotion_001', 'promotion_002', 'promotion_003', 'promotion_004', 'promotion_005'],
    management: ['promotion_001', 'promotion_002', 'promotion_003', 'promotion_004', 'promotion_005', 'promotion_006']
  },
  disciplinary: [
    'disciplinary_001', 'disciplinary_002', 'disciplinary_003', 'disciplinary_004'
  ]
};

// 特別面談の所要時間設定
export const specialInterviewDuration = {
  exit: {
    probation: 30, // 試用期間退職は詳細確認のため長め
    general: 20,
    voluntary: 15,
    involuntary: 25
  },
  transfer: 20,
  return: 25,
  promotion: 20,
  disciplinary: 30
};

// 特別面談の重要度・機密度設定
export const specialInterviewSensitivity = {
  exit: 'high',
  transfer: 'medium',
  return: 'high',
  promotion: 'medium',
  disciplinary: 'critical'
} as const;