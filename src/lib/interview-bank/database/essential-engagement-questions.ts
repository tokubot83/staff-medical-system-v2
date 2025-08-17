// 定期面談バンク - エンゲージメント・定着関連の必須質問
// docs/フォルダの実際の面談シートから抽出した重要質問

import { InterviewQuestion } from '../types';

export const essentialEngagementQuestions: InterviewQuestion[] = [
  // ===========================
  // 継続意向・定着関連
  // ===========================
  {
    id: 'eng_001',
    content: '3年後もこの職場で働き続けたいと思いますか？',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['エンゲージメント', '定着', '必須', '全職種'],
    placeholder: '5:ぜひ続けたい 4:続けたい 3:わからない 2:転職検討中 1:転職活動中',
    scoreWeight: 2.5
  },
  {
    id: 'eng_002',
    content: '1年後もこの職場で働いていると思いますか？',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['エンゲージメント', '定着', '必須', '全職種'],
    placeholder: '5:確実に働いている 4:おそらく働いている 3:わからない 2:転職するかも 1:転職予定',
    scoreWeight: 2.0
  },
  {
    id: 'eng_003',
    content: 'この職場を友人や知人に勧めたいと思いますか？',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['NPS', 'エンゲージメント', '必須', '全職種'],
    placeholder: '5:積極的に勧める 4:勧める 3:どちらでもない 2:あまり勧めない 1:勧めない',
    scoreWeight: 2.0
  },
  {
    id: 'eng_004',
    content: '新卒者にこの職場への就職を勧めますか？',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 2,
    minDuration: 30,
    tags: ['NPS', 'エンゲージメント', '推奨', '全職種'],
    placeholder: '5:強く勧める 4:勧める 3:どちらでもない 2:勧めない 1:絶対勧めない',
    scoreWeight: 1.5
  },

  // ===========================
  // 満足度評価
  // ===========================
  {
    id: 'sat_001',
    content: '現在の給与・待遇に満足していますか？',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['満足度', '待遇', '必須', '全職種'],
    placeholder: '5:非常に満足 4:満足 3:普通 2:やや不満 1:不満',
    scoreWeight: 1.8
  },
  {
    id: 'sat_002',
    content: '勤務シフト・勤務時間に満足していますか？',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['満足度', 'ワークライフバランス', '必須', '全職種'],
    placeholder: '5:非常に満足 4:満足 3:普通 2:やや不満 1:不満',
    scoreWeight: 1.5
  },
  {
    id: 'sat_003',
    content: '上司からのサポートに満足していますか？',
    type: 'scale',
    category: 'team_collaboration',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['満足度', '上司', 'サポート', '必須', '全職種'],
    placeholder: '5:非常に満足 4:満足 3:普通 2:やや不満 1:不満',
    scoreWeight: 1.8
  },
  {
    id: 'sat_004',
    content: '職場の人間関係に満足していますか？',
    type: 'scale',
    category: 'team_collaboration',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['満足度', '人間関係', '必須', '全職種'],
    placeholder: '5:非常に良好 4:良好 3:普通 2:やや問題あり 1:問題あり',
    scoreWeight: 2.0
  },
  {
    id: 'sat_005',
    content: '成長機会・教育体制に満足していますか？',
    type: 'scale',
    category: 'growth_development',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['満足度', '成長', '教育', '必須', '全職種'],
    placeholder: '5:非常に満足 4:満足 3:普通 2:やや不満 1:不満',
    scoreWeight: 1.5
  },
  {
    id: 'sat_006',
    content: '評価制度の公正性に満足していますか？',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 2,
    minDuration: 30,
    tags: ['満足度', '評価', '公正性', '推奨', '全職種'],
    placeholder: '5:非常に公正 4:公正 3:普通 2:やや不公正 1:不公正',
    scoreWeight: 1.5
  },
  {
    id: 'sat_007',
    content: '職場環境・設備に満足していますか？',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 2,
    minDuration: 30,
    tags: ['満足度', '環境', '設備', '推奨', '全職種'],
    placeholder: '5:非常に満足 4:満足 3:普通 2:やや不満 1:不満',
    scoreWeight: 1.2
  },

  // ===========================
  // ストレス・健康関連
  // ===========================
  {
    id: 'hea_001',
    content: '現在の健康状態はいかがですか？',
    type: 'scale',
    category: 'stress_health',
    section: 'health_wellbeing',
    sectionId: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['健康', 'ウェルビーイング', '必須', '全職種'],
    placeholder: '5:非常に良好 4:良好 3:普通 2:やや不調 1:不調',
    scoreWeight: 1.5
  },
  {
    id: 'hea_002',
    content: '現在のストレスレベルはどの程度ですか？',
    type: 'scale',
    category: 'stress_health',
    section: 'health_wellbeing',
    sectionId: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['ストレス', 'メンタルヘルス', '必須', '全職種'],
    placeholder: '5:非常に低い 4:低い 3:普通 2:高い 1:非常に高い（逆尺度）',
    scoreWeight: 2.0
  },
  {
    id: 'hea_003',
    content: '睡眠の質はどうですか？',
    type: 'scale',
    category: 'stress_health',
    section: 'health_wellbeing',
    sectionId: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    tags: ['健康', '睡眠', '推奨', '全職種'],
    placeholder: '5:非常に良い 4:良い 3:普通 2:悪い 1:非常に悪い',
    scoreWeight: 1.3
  },
  {
    id: 'hea_004',
    content: '主なストレス要因は何ですか？（複数選択可）',
    type: 'checkbox',
    category: 'stress_health',
    section: 'health_wellbeing',
    sectionId: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['ストレス', '要因分析', '必須', '全職種'],
    options: [
      { value: 'workload', label: '業務負荷・業務量' },
      { value: 'relations', label: '人間関係' },
      { value: 'overtime', label: '残業時間' },
      { value: 'balance', label: '家庭との両立' },
      { value: 'skill', label: 'スキル不足・能力不安' },
      { value: 'career', label: 'キャリア不安' },
      { value: 'shift', label: 'シフト勤務・夜勤' },
      { value: 'responsibility', label: '責任の重さ' },
      { value: 'evaluation', label: '評価への不満' },
      { value: 'communication', label: 'コミュニケーション不足' }
    ]
  },

  // ===========================
  // ワークライフバランス
  // ===========================
  {
    id: 'wlb_001',
    content: '仕事と私生活のバランスは取れていますか？',
    type: 'scale',
    category: 'stress_health',
    section: 'health_wellbeing',
    sectionId: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    tags: ['ワークライフバランス', '必須', '全職種'],
    placeholder: '5:非常に良い 4:良い 3:普通 2:悪い 1:非常に悪い',
    scoreWeight: 1.5
  },
  {
    id: 'wlb_002',
    content: '残業時間は適切だと思いますか？',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['残業', 'ワークライフバランス', '必須', '全職種'],
    placeholder: '5:適切 4:やや多いが許容範囲 3:普通 2:多すぎる 1:過度に多い',
    scoreWeight: 1.5
  },
  {
    id: 'wlb_003',
    content: '有給休暇は取得しやすいですか？',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 2,
    minDuration: 30,
    tags: ['休暇', 'ワークライフバランス', '推奨', '全職種'],
    placeholder: '5:非常に取りやすい 4:取りやすい 3:普通 2:取りにくい 1:非常に取りにくい',
    scoreWeight: 1.3
  },
  {
    id: 'wlb_004',
    content: '家庭（育児・介護等）との両立で困っていることはありますか？',
    type: 'textarea',
    category: 'stress_health',
    section: 'health_wellbeing',
    sectionId: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    tags: ['家庭', '両立', 'ワークライフバランス', '推奨', '全職種'],
    placeholder: '具体的な困りごとがあれば記入してください'
  },

  // ===========================
  // やりがい・モチベーション
  // ===========================
  {
    id: 'mot_003',
    content: '現在の仕事にやりがいを感じていますか？',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['やりがい', 'モチベーション', '必須', '全職種'],
    placeholder: '5:非常に感じる 4:感じる 3:普通 2:あまり感じない 1:感じない',
    scoreWeight: 2.0
  },
  {
    id: 'mot_004',
    content: '現在のモチベーションレベルはどの程度ですか？',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    tags: ['モチベーション', '必須', '全職種'],
    placeholder: '5:非常に高い 4:高い 3:普通 2:低い 1:非常に低い',
    scoreWeight: 2.0
  },
  {
    id: 'mot_005',
    content: '自分の成長を実感できていますか？',
    type: 'scale',
    category: 'growth_development',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['成長実感', 'モチベーション', '必須', '全職種'],
    placeholder: '5:強く実感 4:実感 3:普通 2:あまり実感しない 1:実感しない',
    scoreWeight: 1.5
  },
  {
    id: 'mot_006',
    content: '患者・利用者からの感謝や評価を感じることはありますか？',
    type: 'scale',
    category: 'motivation_engagement',
    section: 'current_status',
    sectionId: 'current_status',
    priority: 2,
    minDuration: 30,
    tags: ['評価', 'やりがい', '推奨', '医療職'],
    placeholder: '5:よくある 4:時々ある 3:普通 2:あまりない 1:ほとんどない',
    conditions: [
      { type: 'profession', values: ['nurse', 'assistant-nurse', 'nursing-aide', 'care-worker', 'pt', 'ot', 'st'], operator: 'contains' }
    ],
    scoreWeight: 1.5
  },

  // ===========================
  // チーム・職場関係
  // ===========================
  {
    id: 'team_001',
    content: '困った時に相談できる上司や同僚はいますか？',
    type: 'scale',
    category: 'team_collaboration',
    section: 'team_environment',
    sectionId: 'team_environment',
    priority: 1,
    minDuration: 15,
    tags: ['チーム', 'サポート', '必須', '全職種'],
    placeholder: '5:複数いる 4:いる 3:1人いる 2:あまりいない 1:いない',
    scoreWeight: 2.0
  },
  {
    id: 'team_002',
    content: 'チームワークは良好だと思いますか？',
    type: 'scale',
    category: 'team_collaboration',
    section: 'team_environment',
    sectionId: 'team_environment',
    priority: 1,
    minDuration: 15,
    tags: ['チームワーク', '必須', '全職種'],
    placeholder: '5:非常に良好 4:良好 3:普通 2:やや問題あり 1:問題あり',
    scoreWeight: 1.8
  },
  {
    id: 'team_003',
    content: '職場でハラスメントを受けたことはありますか？',
    type: 'radio',
    category: 'team_collaboration',
    section: 'team_environment',
    sectionId: 'team_environment',
    priority: 2,
    minDuration: 30,
    tags: ['ハラスメント', 'リスク', '推奨', '全職種'],
    options: [
      { value: 'no', label: 'ない' },
      { value: 'past', label: '過去にあった' },
      { value: 'sometimes', label: '時々ある' },
      { value: 'often', label: '頻繁にある' },
      { value: 'prefer_not', label: '回答を控える' }
    ],
    scoreWeight: 2.5
  },
  {
    id: 'team_004',
    content: '他部署・他職種との連携はうまくいっていますか？',
    type: 'scale',
    category: 'team_collaboration',
    section: 'team_environment',
    sectionId: 'team_environment',
    priority: 2,
    minDuration: 30,
    tags: ['連携', 'チーム', '推奨', '全職種'],
    placeholder: '5:非常に良好 4:良好 3:普通 2:やや問題あり 1:問題あり',
    scoreWeight: 1.5
  },

  // ===========================
  // 新人特有の質問
  // ===========================
  {
    id: 'new_004',
    content: '入職前のイメージと現実にギャップはありましたか？',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'adaptation_support',
    sectionId: 'adaptation_support',
    priority: 1,
    minDuration: 15,
    tags: ['新人', 'リアリティショック', '適応'],
    placeholder: '5:ギャップなし 4:少しある 3:普通 2:かなりある 1:大きなギャップ',
    conditions: [{ type: 'experienceLevel', values: ['new'], operator: 'equals' }],
    scoreWeight: 1.8
  },
  {
    id: 'new_005',
    content: 'プリセプターや先輩からの指導は適切ですか？',
    type: 'scale',
    category: 'growth_development',
    section: 'adaptation_support',
    sectionId: 'adaptation_support',
    priority: 1,
    minDuration: 15,
    tags: ['新人', '教育', 'サポート'],
    placeholder: '5:非常に適切 4:適切 3:普通 2:やや不適切 1:不適切',
    conditions: [{ type: 'experienceLevel', values: ['new'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'new_006',
    content: '夜勤への不安はありますか？',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'adaptation_support',
    sectionId: 'adaptation_support',
    priority: 1,
    minDuration: 15,
    tags: ['新人', '夜勤', '不安'],
    placeholder: '5:全くない 4:あまりない 3:普通 2:ある 1:非常にある',
    conditions: [
      { type: 'experienceLevel', values: ['new'], operator: 'equals' },
      { type: 'profession', values: ['nurse', 'assistant-nurse', 'nursing-aide', 'care-worker'], operator: 'contains' }
    ],
    scoreWeight: 1.5
  },

  // ===========================
  // 管理職向けの質問
  // ===========================
  {
    id: 'mgr_004',
    content: '部下の育成・指導に手応えを感じていますか？',
    type: 'scale',
    category: 'leadership_management',
    section: 'management_status',
    sectionId: 'management_status',
    priority: 1,
    minDuration: 30,
    tags: ['管理職', '育成', 'リーダーシップ'],
    placeholder: '5:強く感じる 4:感じる 3:普通 2:あまり感じない 1:感じない',
    conditions: [
      { type: 'positionLevel', values: ['chief', 'assistant_manager', 'manager', 'deputy_director', 'director'], operator: 'contains' }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'mgr_005',
    content: '部門の目標達成に向けて順調に進んでいますか？',
    type: 'scale',
    category: 'leadership_management',
    section: 'management_status',
    sectionId: 'management_status',
    priority: 1,
    minDuration: 30,
    tags: ['管理職', '目標管理', 'パフォーマンス'],
    placeholder: '5:非常に順調 4:順調 3:普通 2:やや遅れ 1:大幅に遅れ',
    conditions: [
      { type: 'positionLevel', values: ['assistant_manager', 'manager', 'deputy_director', 'director'], operator: 'contains' }
    ],
    scoreWeight: 2.0
  },

  // ===========================
  // キャリア・将来展望
  // ===========================
  {
    id: 'car_004',
    content: '1年後の自分の姿が明確にイメージできますか？',
    type: 'scale',
    category: 'career_planning',
    section: 'career_development',
    sectionId: 'career_development',
    priority: 2,
    minDuration: 30,
    tags: ['キャリア', '将来', '全職種'],
    placeholder: '5:明確にできる 4:できる 3:ある程度 2:あまりできない 1:全くできない',
    scoreWeight: 1.3
  },
  {
    id: 'car_005',
    content: '3年後のキャリアビジョンはありますか？',
    type: 'textarea',
    category: 'career_planning',
    section: 'career_development',
    sectionId: 'career_development',
    priority: 2,
    minDuration: 30,
    tags: ['キャリア', 'ビジョン', '全職種'],
    placeholder: '目指す役職、専門性、資格取得など具体的に記入',
    scoreWeight: 1.5
  },
  {
    id: 'car_006',
    content: '今の職場でキャリアアップできる見込みはありますか？',
    type: 'scale',
    category: 'career_planning',
    section: 'career_development',
    sectionId: 'career_development',
    priority: 2,
    minDuration: 45,
    tags: ['キャリア', '昇進', '全職種'],
    placeholder: '5:大いにある 4:ある 3:普通 2:あまりない 1:全くない',
    scoreWeight: 1.5
  }
];

// エンゲージメント質問の総数を確認
console.log(`Essential engagement questions: ${essentialEngagementQuestions.length}`);