// 定期面談バンク - 質問データベース
// 既存の面談シートから抽出した全質問を整理

import { InterviewQuestion } from '../types';
import { comprehensiveSkillQuestions } from './comprehensive-skill-questions';
import { essentialEngagementQuestions } from './essential-engagement-questions';
import { allCommonQuestions } from './common-questions';
import { allFacilitySkillQuestions } from './facility-skill-questions';
import { facilitySpecificQuestions } from './facility-specific-questions';
import { commonStatusQuestions } from './common-status-questions';

// 抽象的な質問（既存）と具体的スキル質問（新規）、エンゲージメント質問を統合
const abstractQuestions: InterviewQuestion[] = [
  // ===========================
  // 動機タイプ判定セクション
  // ===========================
  {
    id: 'mot_001',
    content: '仕事で最もやりがいを感じるのはどのような時ですか？',
    type: 'radio',
    category: 'motivation_engagement',
    sectionId: 'motivation_assessment',
    priority: 1,
    minDuration: 15,
    scoreWeight: 2.0,
    tags: ['動機タイプ', '必須', '全職種'],
    options: [
      { value: 'growth', label: '新しいスキルを身につけた時', motivationType: 'growth' },
      { value: 'recognition', label: '上司や同僚に褒められた時', motivationType: 'recognition' },
      { value: 'stability', label: '安定した環境で確実に成果を出せた時', motivationType: 'stability' },
      { value: 'teamwork', label: 'チームで協力して目標を達成した時', motivationType: 'teamwork' },
      { value: 'efficiency', label: '無駄を改善・効率化できた時', motivationType: 'efficiency' },
      { value: 'compensation', label: '良い待遇で働けている時', motivationType: 'compensation' },
      { value: 'creativity', label: '創造的な成果を出せた時', motivationType: 'creativity' }
    ]
  },
  {
    id: 'mot_002',
    content: '理想の職場環境はどのようなものですか？',
    type: 'checkbox',
    category: 'motivation_engagement',
    sectionId: 'motivation_assessment',
    priority: 2,
    minDuration: 30,
    tags: ['動機タイプ', '職場環境'],
    options: [
      { value: 'learning', label: '学習機会が豊富' },
      { value: 'feedback', label: 'フィードバックが頻繁' },
      { value: 'stable', label: '変化が少なく安定' },
      { value: 'collaborative', label: 'チームワークが活発' },
      { value: 'efficient', label: '効率的で無駄がない' },
      { value: 'rewarding', label: '成果が報酬に反映' },
      { value: 'flexible', label: '自由度が高い' }
    ]
  },

  // ===========================
  // 現状確認セクション
  // ===========================
  {
    id: 'cur_001',
    content: '現在の業務量についてどう感じていますか？',
    type: 'scale',
    category: 'workload_stress',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    placeholder: '具体的な業務量や残業時間などを教えてください',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },
  {
    id: 'cur_002',
    content: '職場の人間関係はうまくいっていますか？',
    type: 'scale',
    category: 'workplace_relations',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    placeholder: '同僚や上司との関係で気になることがあれば教えてください',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },
  {
    id: 'cur_003',
    content: '業務で困っていることや課題はありますか？',
    type: 'textarea',
    category: 'challenges_issues',
    sectionId: 'current_status',
    priority: 1,
    minDuration: 15,
    placeholder: '具体的な課題や解決したい問題を記入してください',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },
  {
    id: 'cur_004',
    content: '最近の業務で達成感を感じたことを教えてください',
    type: 'textarea',
    category: 'achievement',
    sectionId: 'current_status',
    priority: 2,
    minDuration: 30,
    placeholder: '具体的な成果や貢献について記入してください',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },

  // ===========================
  // スキル評価セクション
  // ===========================
  {
    id: 'skl_001',
    content: '専門知識・技術スキルの自己評価',
    type: 'scale',
    category: 'technical_skills',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    placeholder: '現在のスキルレベルと改善したい点を記入',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },
  {
    id: 'skl_002',
    content: 'コミュニケーション能力の自己評価',
    type: 'scale',
    category: 'communication_skills',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    placeholder: '患者対応、チーム内コミュニケーションについて',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },
  {
    id: 'skl_003',
    content: '問題解決能力の自己評価',
    type: 'scale',
    category: 'problem_solving',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    placeholder: '困難な状況での対応力について',
    experienceLevels: ['junior', 'midlevel', 'veteran']
  },
  {
    id: 'skl_004',
    content: 'チームワーク・協調性の自己評価',
    type: 'scale',
    category: 'teamwork',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    placeholder: 'チーム内での役割と貢献について',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },

  // ===========================
  // 新人向け適応支援
  // ===========================
  {
    id: 'new_001',
    content: '入職してから現在までで、最も不安に感じていることは何ですか？',
    type: 'textarea',
    category: 'adaptation_anxiety',
    sectionId: 'adaptation_support',
    priority: 1,
    minDuration: 15,
    placeholder: '業務面、人間関係、その他の不安について具体的に',
    experienceLevels: ['new']
  },
  {
    id: 'new_002',
    content: '教育体制や研修についての満足度',
    type: 'scale',
    category: 'education_satisfaction',
    sectionId: 'adaptation_support',
    priority: 1,
    minDuration: 15,
    placeholder: '改善してほしい点があれば記入',
    experienceLevels: ['new']
  },
  {
    id: 'new_003',
    content: 'プリセプターや先輩からのサポートは十分ですか？',
    type: 'scale',
    category: 'mentoring_support',
    sectionId: 'adaptation_support',
    priority: 1,
    minDuration: 15,
    placeholder: 'サポート体制について具体的に',
    experienceLevels: ['new']
  },

  // ===========================
  // 若手向けスキル開発
  // ===========================
  {
    id: 'jun_001',
    content: '次のステップに向けて習得したいスキルは何ですか？',
    type: 'textarea',
    category: 'skill_development',
    sectionId: 'skill_development',
    priority: 1,
    minDuration: 30,
    placeholder: '具体的なスキルや資格について',
    experienceLevels: ['junior']
  },
  {
    id: 'jun_002',
    content: '業務の自立度についての自己評価',
    type: 'scale',
    category: 'independence',
    sectionId: 'skill_development',
    priority: 1,
    minDuration: 30,
    placeholder: '一人で対応できる業務範囲について',
    experienceLevels: ['junior']
  },
  {
    id: 'jun_003',
    content: '後輩指導への関心と準備状況',
    type: 'scale',
    category: 'mentoring_readiness',
    sectionId: 'skill_development',
    priority: 2,
    minDuration: 30,
    placeholder: '指導経験や今後の意欲について',
    experienceLevels: ['junior']
  },

  // ===========================
  // 中堅向けリーダーシップ開発
  // ===========================
  {
    id: 'mid_001',
    content: 'チームリーダーとしての役割遂行状況',
    type: 'scale',
    category: 'leadership',
    sectionId: 'leadership_development',
    priority: 1,
    minDuration: 30,
    placeholder: 'リーダーシップを発揮した具体例',
    experienceLevels: ['midlevel'],
    positionLevels: ['leader', 'chief']
  },
  {
    id: 'mid_002',
    content: '部下・後輩の育成についての取り組み',
    type: 'textarea',
    category: 'staff_development',
    sectionId: 'leadership_development',
    priority: 1,
    minDuration: 30,
    placeholder: '育成方針や具体的な指導内容',
    experienceLevels: ['midlevel'],
    positionLevels: ['leader', 'chief']
  },
  {
    id: 'mid_003',
    content: '業務改善や効率化への貢献',
    type: 'textarea',
    category: 'process_improvement',
    sectionId: 'leadership_development',
    priority: 2,
    minDuration: 45,
    placeholder: '実施した改善活動と成果',
    experienceLevels: ['midlevel']
  },

  // ===========================
  // ベテラン向けメンタリング・専門性
  // ===========================
  {
    id: 'vet_001',
    content: '専門知識の継承についての取り組み',
    type: 'textarea',
    category: 'knowledge_transfer',
    sectionId: 'mentoring_expertise',
    priority: 1,
    minDuration: 30,
    placeholder: '後進への知識・技術の伝承方法',
    experienceLevels: ['veteran']
  },
  {
    id: 'vet_002',
    content: '組織への貢献と今後の役割',
    type: 'textarea',
    category: 'organizational_contribution',
    sectionId: 'mentoring_expertise',
    priority: 1,
    minDuration: 30,
    placeholder: '組織における自身の役割と貢献',
    experienceLevels: ['veteran']
  },
  {
    id: 'vet_003',
    content: 'ワークライフバランスと今後のキャリア',
    type: 'textarea',
    category: 'career_planning',
    sectionId: 'mentoring_expertise',
    priority: 2,
    minDuration: 45,
    placeholder: '今後のキャリアプランと働き方',
    experienceLevels: ['veteran']
  },

  // ===========================
  // 管理職向け質問
  // ===========================
  {
    id: 'mgr_001',
    content: '部門の目標達成状況と課題',
    type: 'textarea',
    category: 'performance_management',
    sectionId: 'management_status',
    priority: 1,
    minDuration: 45,
    placeholder: '目標達成率と主要な課題',
    positionLevels: ['assistant_manager', 'manager', 'deputy_director', 'director']
  },
  {
    id: 'mgr_002',
    content: 'スタッフの育成とモチベーション管理',
    type: 'scale',
    category: 'staff_management',
    sectionId: 'management_status',
    priority: 1,
    minDuration: 45,
    placeholder: 'スタッフ満足度と離職率の状況',
    positionLevels: ['assistant_manager', 'manager', 'deputy_director', 'director']
  },
  {
    id: 'mgr_003',
    content: '他部門との連携と協力体制',
    type: 'scale',
    category: 'cross_functional',
    sectionId: 'management_status',
    priority: 2,
    minDuration: 45,
    placeholder: '部門間連携の具体例と改善点',
    positionLevels: ['manager', 'deputy_director', 'director']
  },

  // ===========================
  // 健康・ウェルビーイング
  // ===========================
  {
    id: 'wel_001',
    content: '現在の健康状態について',
    type: 'scale',
    category: 'health_status',
    sectionId: 'health_wellbeing',
    priority: 2,
    minDuration: 15,
    placeholder: '体調面で気になることがあれば記入',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },
  {
    id: 'wel_002',
    content: 'ストレスレベルと対処法',
    type: 'scale',
    category: 'stress_management',
    sectionId: 'health_wellbeing',
    priority: 1,
    minDuration: 15,
    placeholder: 'ストレスの原因と対処方法',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },
  {
    id: 'wel_003',
    content: 'ワークライフバランスの満足度',
    type: 'scale',
    category: 'work_life_balance',
    sectionId: 'health_wellbeing',
    priority: 2,
    minDuration: 30,
    placeholder: '休暇取得状況や私生活との両立',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },

  // ===========================
  // キャリア開発
  // ===========================
  {
    id: 'car_001',
    content: '3年後の理想的なキャリア像',
    type: 'textarea',
    category: 'career_vision',
    sectionId: 'career_development',
    priority: 2,
    minDuration: 30,
    placeholder: '目指したい役職や専門分野',
    experienceLevels: ['junior', 'midlevel']
  },
  {
    id: 'car_002',
    content: '取得したい資格や受けたい研修',
    type: 'textarea',
    category: 'professional_development',
    sectionId: 'career_development',
    priority: 2,
    minDuration: 30,
    placeholder: '具体的な資格名や研修内容',
    experienceLevels: ['new', 'junior', 'midlevel']
  },
  {
    id: 'car_003',
    content: 'キャリア形成のための支援ニーズ',
    type: 'textarea',
    category: 'support_needs',
    sectionId: 'career_development',
    priority: 3,
    minDuration: 45,
    placeholder: '組織に期待する支援内容',
    experienceLevels: ['junior', 'midlevel', 'veteran']
  },

  // ===========================
  // 施設別専門スキル - 急性期
  // ===========================
  {
    id: 'acu_001',
    content: '救急対応スキルの自己評価',
    type: 'scale',
    category: 'emergency_skills',
    sectionId: 'acute_care_skills',
    priority: 2,
    minDuration: 30,
    placeholder: '緊急時の対応能力について',
    facilityTypes: ['acute'],
    departments: ['emergency', 'icu']
  },
  {
    id: 'acu_002',
    content: '医療機器操作の習熟度',
    type: 'scale',
    category: 'equipment_skills',
    sectionId: 'acute_care_skills',
    priority: 2,
    minDuration: 30,
    placeholder: '人工呼吸器、モニター等の操作',
    facilityTypes: ['acute'],
    departments: ['icu', 'operating_room']
  },

  // ===========================
  // 施設別専門スキル - 慢性期
  // ===========================
  {
    id: 'chr_001',
    content: '長期療養患者へのケア能力',
    type: 'scale',
    category: 'long_term_care',
    sectionId: 'chronic_care_skills',
    priority: 2,
    minDuration: 30,
    placeholder: '慢性期ケアの質について',
    facilityTypes: ['chronic']
  },
  {
    id: 'chr_002',
    content: 'リハビリテーション支援の実践',
    type: 'scale',
    category: 'rehabilitation_support',
    sectionId: 'chronic_care_skills',
    priority: 2,
    minDuration: 30,
    placeholder: 'ADL向上への取り組み',
    facilityTypes: ['chronic'],
    departments: ['rehabilitation']
  },

  // ===========================
  // 施設別専門スキル - 介護施設
  // ===========================
  {
    id: 'ltc_001',
    content: '認知症ケアの実践能力',
    type: 'scale',
    category: 'dementia_care',
    sectionId: 'ltc_skills',
    priority: 2,
    minDuration: 30,
    placeholder: '認知症患者への対応スキル',
    facilityTypes: ['ltc', 'group_home']
  },
  {
    id: 'ltc_002',
    content: '生活支援とQOL向上への取り組み',
    type: 'scale',
    category: 'quality_of_life',
    sectionId: 'ltc_skills',
    priority: 2,
    minDuration: 30,
    placeholder: '入居者の生活の質向上について',
    facilityTypes: ['ltc', 'group_home']
  },

  // ===========================
  // 部署別質問 - 病棟
  // ===========================
  {
    id: 'wrd_001',
    content: 'ベッドコントロールと入退院調整',
    type: 'scale',
    category: 'bed_management',
    sectionId: 'ward_specific',
    priority: 2,
    minDuration: 30,
    placeholder: '効率的な病床管理について',
    departments: ['ward'],
    positionLevels: ['chief', 'assistant_manager', 'manager']
  },
  {
    id: 'wrd_002',
    content: '夜勤業務の負担と改善点',
    type: 'textarea',
    category: 'night_shift',
    sectionId: 'ward_specific',
    priority: 2,
    minDuration: 30,
    placeholder: '夜勤体制の課題と改善案',
    departments: ['ward']
  },

  // ===========================
  // 部署別質問 - 外来
  // ===========================
  {
    id: 'out_001',
    content: '外来患者対応の効率性',
    type: 'scale',
    category: 'patient_flow',
    sectionId: 'outpatient_specific',
    priority: 2,
    minDuration: 30,
    placeholder: '待ち時間短縮への取り組み',
    departments: ['outpatient']
  },
  {
    id: 'out_002',
    content: '予約管理と調整能力',
    type: 'scale',
    category: 'appointment_management',
    sectionId: 'outpatient_specific',
    priority: 2,
    minDuration: 30,
    placeholder: '予約システムの活用と改善',
    departments: ['outpatient']
  },

  // ===========================
  // アクションプラン
  // ===========================
  {
    id: 'act_001',
    content: '今後3ヶ月で達成したい目標',
    type: 'textarea',
    category: 'short_term_goals',
    sectionId: 'action_plan',
    priority: 2,
    minDuration: 30,
    placeholder: '具体的で測定可能な目標を設定',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },
  {
    id: 'act_002',
    content: '目標達成のために必要なサポート',
    type: 'textarea',
    category: 'support_requirements',
    sectionId: 'action_plan',
    priority: 2,
    minDuration: 30,
    placeholder: '上司や組織に期待する支援',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  },
  {
    id: 'act_003',
    content: '次回面談までのアクションアイテム',
    type: 'textarea',
    category: 'action_items',
    sectionId: 'action_plan',
    priority: 2,
    minDuration: 45,
    placeholder: '具体的な行動計画とスケジュール',
    experienceLevels: ['new', 'junior', 'midlevel', 'veteran']
  }
];

// 全ての質問を統合（重複を除去）
const allQuestions = [
  ...allCommonQuestions,             // v4/v5シートからの共通質問
  ...allFacilitySkillQuestions,      // 施設別スキル質問
  ...facilitySpecificQuestions,      // 施設タイプ別の具体的質問
  ...commonStatusQuestions,           // 第2セクション共通質問
  ...essentialEngagementQuestions,   // エンゲージメント・定着関連
  ...comprehensiveSkillQuestions,    // 職種別具体的スキル
  ...abstractQuestions               // 既存の抽象的質問
];

// IDの重複を除去（最初に出現したものを優先）
const uniqueQuestions = new Map<string, InterviewQuestion>();
allQuestions.forEach(q => {
  if (!uniqueQuestions.has(q.id)) {
    uniqueQuestions.set(q.id, q);
  }
});

export const questionBank: InterviewQuestion[] = Array.from(uniqueQuestions.values());

// 質問の総数を確認
console.log(`Total questions in bank: ${questionBank.length}`);
console.log(`Essential engagement questions: ${essentialEngagementQuestions.length}`);
console.log(`Comprehensive skill questions: ${comprehensiveSkillQuestions.length}`);
console.log(`Abstract questions: ${abstractQuestions.length}`);