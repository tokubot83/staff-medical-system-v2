// 施設タイプ別の具体的質問
import { InterviewQuestion } from '../types';

export const facilitySpecificQuestions: InterviewQuestion[] = [
  // ===========================
  // 急性期病院 - 看護師向け質問
  // ===========================
  {
    id: 'acute-nurse-er-001',
    content: '救急対応・急変時の初期対応について、あなたの現在のスキルレベルを教えてください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '急性期', 'acute', '救急対応', '急変対応'],
    experienceLevels: ['new', 'junior'],
    followUp: 'BLSやACLSの資格取得状況、実際の急変対応経験について教えてください。'
  },
  {
    id: 'acute-nurse-monitor-001',
    content: '心電図モニターや人工呼吸器など、高度医療機器の操作・管理スキルを評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '急性期', 'acute', 'モニター管理', '医療機器'],
    experienceLevels: ['junior', 'mid', 'senior'],
    followUp: '特に自信のある機器、追加で学びたい機器があれば教えてください。'
  },
  {
    id: 'acute-nurse-critical-001',
    content: 'ICU・CCU・救急外来での重症患者ケアの経験と自信度を教えてください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['看護師', '急性期', 'acute', 'ICU', '重症ケア'],
    experienceLevels: ['mid', 'senior', 'veteran'],
    followUp: '重症患者ケアで特に重要だと考えている点は何ですか？'
  },

  // ===========================
  // 慢性期病院 - 看護師向け質問
  // ===========================
  {
    id: 'chronic-nurse-wound-001',
    content: '褥瘡予防・創傷管理に関するあなたの知識と実践スキルを評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '慢性期', 'chronic', '褥瘡管理', '創傷ケア'],
    experienceLevels: ['new', 'junior', 'mid'],
    followUp: '褥瘡予防で特に注意している点、実践している工夫があれば教えてください。'
  },
  {
    id: 'chronic-nurse-dementia-001',
    content: '認知症患者へのケア・コミュニケーションスキルについて自己評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '慢性期', 'chronic', '認知症ケア', 'コミュニケーション'],
    experienceLevels: ['new', 'junior', 'mid', 'senior'],
    followUp: '認知症患者との関わりで心がけていること、難しいと感じる場面を教えてください。'
  },
  {
    id: 'chronic-nurse-terminal-001',
    content: '終末期ケア・看取りケアに関する経験と対応力を教えてください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['看護師', '慢性期', 'chronic', '終末期ケア', '看取り'],
    experienceLevels: ['junior', 'mid', 'senior', 'veteran'],
    followUp: '終末期ケアで大切にしていること、家族への対応で配慮している点を教えてください。'
  },
  {
    id: 'chronic-nurse-longterm-001',
    content: '長期療養患者の状態変化の観察・アセスメント能力を評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '慢性期', 'chronic', '長期療養', 'アセスメント'],
    experienceLevels: ['new', 'junior', 'mid'],
    followUp: '微細な変化に気づくために工夫していることはありますか？'
  },

  // ===========================
  // 老健施設 - 看護師向け質問
  // ===========================
  {
    id: 'geriatric-nurse-rehab-001',
    content: '在宅復帰に向けた生活機能評価と支援計画立案のスキルを評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '老健', 'geriatric', '在宅復帰', '生活機能'],
    experienceLevels: ['junior', 'mid', 'senior'],
    followUp: '在宅復帰支援で特に重要だと考えている要素は何ですか？'
  },
  {
    id: 'geriatric-nurse-family-001',
    content: '家族指導・介護指導の実施能力について自己評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '老健', 'geriatric', '家族指導', '介護指導'],
    experienceLevels: ['junior', 'mid', 'senior'],
    followUp: '家族への説明で工夫していること、難しいと感じる場面を教えてください。'
  },

  // ===========================
  // 老健施設 - 介護職向け質問
  // ===========================
  {
    id: 'geriatric-care-adl-001',
    content: '日常生活動作（ADL）の介助技術について、あなたのスキルレベルを評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['介護職', '老健', 'geriatric', 'ADL介助', '生活支援'],
    experienceLevels: ['new', 'junior'],
    followUp: '特に自信のある介助、まだ不安のある介助があれば教えてください。'
  },
  {
    id: 'geriatric-care-recreation-001',
    content: 'レクリエーション活動の企画・実施能力について自己評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['介護職', '老健', 'geriatric', 'レクリエーション', 'アクティビティ'],
    experienceLevels: ['junior', 'mid', 'senior'],
    followUp: '成功したレクリエーション、今後実施したい活動があれば教えてください。'
  },

  // ===========================
  // 外来 - 看護師向け質問
  // ===========================
  {
    id: 'outpatient-nurse-triage-001',
    content: '外来でのトリアージ・緊急度判定のスキルを評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '外来', 'outpatient', 'トリアージ', '緊急度判定'],
    experienceLevels: ['junior', 'mid', 'senior'],
    followUp: 'トリアージで重視しているポイント、判断に迷った経験があれば教えてください。'
  },
  {
    id: 'outpatient-nurse-interview-001',
    content: '限られた時間での問診・情報収集スキルについて自己評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '外来', 'outpatient', '問診', '情報収集'],
    experienceLevels: ['new', 'junior', 'mid'],
    followUp: '効率的な問診のコツ、聞き取りで工夫している点を教えてください。'
  },
  {
    id: 'outpatient-nurse-education-001',
    content: '外来での患者教育・生活指導の実施能力を評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['看護師', '外来', 'outpatient', '患者教育', '生活指導'],
    experienceLevels: ['junior', 'mid', 'senior'],
    followUp: '短時間で効果的な指導を行うための工夫を教えてください。'
  },

  // ===========================
  // リハビリ職 - 施設タイプ別
  // ===========================
  {
    id: 'acute-pt-early-001',
    content: '急性期リハビリテーション（早期離床・廃用予防）の実施スキルを評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['理学療法士', '急性期', 'acute', '早期離床', '廃用予防'],
    experienceLevels: ['new', 'junior', 'mid'],
    followUp: 'リスク管理で特に注意している点、医師・看護師との連携で工夫している点を教えてください。'
  },
  {
    id: 'chronic-ot-cognitive-001',
    content: '認知機能訓練・高次脳機能訓練の計画立案と実施スキルを評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['作業療法士', '慢性期', 'chronic', '認知機能', '高次脳機能'],
    experienceLevels: ['junior', 'mid', 'senior'],
    followUp: '効果的だった訓練方法、評価で使用している検査を教えてください。'
  },
  {
    id: 'geriatric-st-swallow-001',
    content: '嚥下機能評価と摂食嚥下リハビリテーションの実施能力を評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['言語聴覚士', '老健', 'geriatric', '嚥下評価', '摂食訓練'],
    experienceLevels: ['new', 'junior', 'mid'],
    followUp: 'VF・VE検査の経験、食形態の調整で工夫している点を教えてください。'
  },

  // ===========================
  // 事務職 - 施設タイプ別
  // ===========================
  {
    id: 'acute-admin-emergency-001',
    content: '救急外来での医事業務（緊急受付・会計処理）の対応力を評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['医事課', '急性期', 'acute', '救急受付', '緊急対応'],
    experienceLevels: ['junior', 'mid'],
    followUp: '救急時の優先順位判断、他部署との連携で工夫している点を教えてください。'
  },
  {
    id: 'chronic-admin-longterm-001',
    content: '長期入院患者の医療費相談・支払い調整業務の対応力を評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['医事課', '慢性期', 'chronic', '医療費相談', '支払い調整'],
    experienceLevels: ['junior', 'mid', 'senior'],
    followUp: '公費医療制度の活用、患者・家族への説明で工夫している点を教えてください。'
  },
  {
    id: 'geriatric-admin-insurance-001',
    content: '介護保険請求業務と医療保険請求業務の両立スキルを評価してください。',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    sectionId: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['医事課', '老健', 'geriatric', '介護保険', '医療保険'],
    experienceLevels: ['junior', 'mid', 'senior'],
    followUp: '両制度の違いで注意している点、ミス防止の工夫を教えてください。'
  }
];