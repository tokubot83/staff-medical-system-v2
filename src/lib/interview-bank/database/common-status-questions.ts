// 第1セクション：職員の現状確認（全職種・全施設・全世代共通）
import { InterviewQuestion } from '../types';

export const commonStatusQuestions: InterviewQuestion[] = [
  // アイスブレイク・導入質問（最優先）
  {
    id: 'common-status-000-a',
    content: '最近の調子はいかがですか？お変わりありませんか？',
    type: 'open',
    category: 'general_status',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 1,
    minDuration: 15,
    tags: ['共通', 'アイスブレイク', '現状確認', '導入'],
    followUp: '何か気になることがあれば、遠慮なくお話しください。'
  },
  {
    id: 'common-status-000-b',
    content: '前回の面談から今日まで、何か変化はありましたか？',
    type: 'open',
    category: 'general_status',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 1,
    minDuration: 15,
    tags: ['共通', '変化確認', '現状確認', '導入'],
    followUp: '良い変化でも、困った変化でも、どちらでも結構です。'
  },
  {
    id: 'common-status-001',
    content: '現在の仕事に対するモチベーションはどの程度ですか？',
    type: 'scale',
    category: 'motivation',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 2,
    minDuration: 15,
    tags: ['共通', 'モチベーション', '現状確認'],
    followUp: 'モチベーションに影響している要因があれば教えてください。'
  },
  {
    id: 'common-status-002',
    content: '最近の体調はいかがですか？疲労感やストレスは感じていますか？',
    type: 'open',
    category: 'health',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 2,
    minDuration: 15,
    tags: ['共通', '健康', 'ストレス', '現状確認'],
    followUp: '休暇は適切に取れていますか？睡眠時間は確保できていますか？'
  },
  {
    id: 'common-status-003',
    content: '職場の人間関係（上司・同僚・他職種）はうまくいっていますか？',
    type: 'scale',
    category: 'team_collaboration',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 2,
    minDuration: 15,
    tags: ['共通', '人間関係', 'チーム', '現状確認'],
    followUp: '特に相談しやすい人、逆に関わりづらい人はいますか？'
  },
  {
    id: 'common-status-004',
    content: '仕事とプライベートのバランスは取れていますか？',
    type: 'scale',
    category: 'work_life_balance',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 2,
    minDuration: 15,
    tags: ['共通', 'ワークライフバランス', '現状確認'],
    followUp: '残業時間や持ち帰り仕事の状況を教えてください。'
  },
  {
    id: 'common-status-005',
    content: '現在の職場環境（設備・ツール・システム）に満足していますか？',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 2,
    minDuration: 30,
    tags: ['共通', '職場環境', '設備', '現状確認'],
    followUp: '改善してほしい環境や導入してほしいツールはありますか？'
  },
  {
    id: 'common-status-006',
    content: '給与や福利厚生などの待遇面について、どの程度満足していますか？',
    type: 'scale',
    category: 'satisfaction',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 2,
    minDuration: 30,
    tags: ['共通', '待遇', '給与', '福利厚生', '現状確認'],
    followUp: '特に改善を希望する待遇面があれば教えてください。'
  },
  {
    id: 'common-status-007',
    content: '職場でのやりがいや達成感を感じることはありますか？',
    type: 'open',
    category: 'motivation',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 1,
    minDuration: 15,
    tags: ['共通', 'やりがい', '達成感', '現状確認'],
    followUp: '最近、特にやりがいを感じた出来事があれば教えてください。'
  },
  {
    id: 'common-status-008',
    content: '現在抱えている業務上の課題や困りごとはありますか？',
    type: 'open',
    category: 'challenges',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 1,
    minDuration: 15,
    tags: ['共通', '課題', '困りごと', '現状確認'],
    followUp: 'その課題に対して、どのようなサポートが必要ですか？'
  },
  {
    id: 'common-status-009',
    content: '教育体制や研修機会について満足していますか？',
    type: 'scale',
    category: 'growth_development',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 2,
    minDuration: 30,
    tags: ['共通', '教育', '研修', '成長', '現状確認'],
    followUp: '受けたい研修や身につけたいスキルがあれば教えてください。'
  },
  {
    id: 'common-status-010',
    content: '今後3年間、この職場で働き続けたいと思いますか？',
    type: 'scale',
    category: 'retention_risk',
    section: 'status_check',
    sectionId: 'status_check',
    priority: 1,
    minDuration: 15,
    tags: ['共通', '定着意向', '継続意思', '現状確認'],
    followUp: 'その理由を教えてください。継続のために必要な条件はありますか？'
  }
];