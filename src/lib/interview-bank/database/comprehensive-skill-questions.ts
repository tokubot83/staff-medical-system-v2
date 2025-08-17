// 定期面談バンク - 包括的スキル評価質問データベース
// docs/フォルダの評価シートから抽出した具体的なスキル項目を質問形式で整理

import { InterviewQuestion } from '../types';

export const comprehensiveSkillQuestions: InterviewQuestion[] = [
  // ===========================
  // 看護師（新人） - 基礎技術習得
  // ===========================
  {
    id: 'nur_new_001',
    content: 'バイタルサイン測定は正確にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '新人', '基礎技術', 'バイタル測定'],
    placeholder: '血圧、体温、脈拍、呼吸の測定精度について自己評価してください',
    conditions: [{ type: 'profession', values: ['nurse'], operator: 'equals' }],
    scoreWeight: 1.5
  },
  {
    id: 'nur_new_002',
    content: '点滴管理（滴下調整、観察）は安全に実施できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '新人', '点滴管理', '医療安全'],
    placeholder: '点滴の準備、開始、管理、終了まで一連の流れについて',
    conditions: [{ type: 'profession', values: ['nurse'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'nur_new_003',
    content: '薬剤管理（与薬、確認）は確実に行えていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '新人', '薬剤管理', '医療安全'],
    placeholder: '5Rの確認、配薬、与薬時の注意点について',
    conditions: [{ type: 'profession', values: ['nurse'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'nur_new_004',
    content: '採血・注射技術は安全に実施できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '新人', '採血', '注射技術'],
    placeholder: '血管確保、採血、皮下注射、筋肉注射の技術について',
    conditions: [{ type: 'profession', values: ['nurse'], operator: 'equals' }],
    scoreWeight: 1.8
  },
  {
    id: 'nur_new_005',
    content: '観察・記録・報告は適切に行えていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '新人', '観察', '記録', '報告'],
    placeholder: '患者の状態変化の把握、記録の質、報告・連絡・相談について',
    conditions: [{ type: 'profession', values: ['nurse'], operator: 'equals' }],
    scoreWeight: 1.5
  },
  {
    id: 'nur_new_006',
    content: '感染対策は適切に実践できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '新人', '感染対策', '医療安全'],
    placeholder: '手指衛生、標準予防策、個人防護具の使用について',
    conditions: [{ type: 'profession', values: ['nurse'], operator: 'equals' }],
    scoreWeight: 1.8
  },
  {
    id: 'nur_new_007',
    content: '患者・家族とのコミュニケーションは適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護師', '新人', 'コミュニケーション', '患者対応'],
    placeholder: '説明の仕方、傾聴、共感、適切な距離感について',
    conditions: [{ type: 'profession', values: ['nurse'], operator: 'equals' }],
    scoreWeight: 1.5
  },

  // ===========================
  // 看護師（若手） - 応用技術と指導
  // ===========================
  {
    id: 'nur_jun_001',
    content: '複雑な医療処置（CVカテーテル管理等）は安全に実施できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 30,
    tags: ['看護師', '若手', '高度医療', 'CVカテーテル'],
    placeholder: '中心静脈カテーテル、膀胱留置カテーテル等の管理について',
    conditions: [
      { type: 'profession', values: ['nurse'], operator: 'equals' },
      { type: 'experienceLevel', values: ['junior'], operator: 'equals' }
    ],
    scoreWeight: 2.0
  },
  {
    id: 'nur_jun_002',
    content: '新人看護師への指導は効果的にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 30,
    tags: ['看護師', '若手', '指導技術', 'プリセプター'],
    placeholder: 'プリセプター業務、技術指導、メンタルサポートについて',
    conditions: [
      { type: 'profession', values: ['nurse'], operator: 'equals' },
      { type: 'experienceLevel', values: ['junior'], operator: 'equals' }
    ],
    scoreWeight: 1.8
  },
  {
    id: 'nur_jun_003',
    content: '緊急時の判断と対応は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 30,
    tags: ['看護師', '若手', '緊急対応', '判断力'],
    placeholder: '急変時の初期対応、医師への報告、応援要請について',
    conditions: [
      { type: 'profession', values: ['nurse'], operator: 'equals' },
      { type: 'experienceLevel', values: ['junior'], operator: 'equals' }
    ],
    scoreWeight: 2.0
  },

  // ===========================
  // 准看護師 - 療養上の世話
  // ===========================
  {
    id: 'asn_new_001',
    content: '日常生活援助（清拭、移動、食事介助等）は適切に実施できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['准看護師', '新人', '日常生活援助', '基礎介護'],
    placeholder: '清拭、体位変換、移乗、食事・排泄介助の技術について',
    conditions: [{ type: 'profession', values: ['assistant-nurse'], operator: 'equals' }],
    scoreWeight: 1.5
  },
  {
    id: 'asn_new_002',
    content: '看護師との協働・報告は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['准看護師', '新人', '協働', '報告連絡相談'],
    placeholder: '看護師への報告のタイミング、内容、連携について',
    conditions: [{ type: 'profession', values: ['assistant-nurse'], operator: 'equals' }],
    scoreWeight: 1.8
  },
  {
    id: 'asn_new_003',
    content: '療養上の世話に関する観察・記録は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['准看護師', '新人', '観察', '記録'],
    placeholder: '患者の状態観察、変化の把握、記録の質について',
    conditions: [{ type: 'profession', values: ['assistant-nurse'], operator: 'equals' }],
    scoreWeight: 1.5
  },

  // ===========================
  // 看護補助者 - 基礎的看護補助業務
  // ===========================
  {
    id: 'aid_new_001',
    content: '環境整備（病室清掃、リネン交換等）は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護補助者', '新人', '環境整備', '感染対策'],
    placeholder: '病室清掃、ベッドメイキング、リネン交換の技術について',
    conditions: [{ type: 'profession', values: ['nursing-aide'], operator: 'equals' }],
    scoreWeight: 1.3
  },
  {
    id: 'aid_new_002',
    content: '患者への接遇・サービスは適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護補助者', '新人', '接遇', 'サービス'],
    placeholder: '挨拶、言葉遣い、患者への気配り、配膳等のサービスについて',
    conditions: [{ type: 'profession', values: ['nursing-aide'], operator: 'equals' }],
    scoreWeight: 1.5
  },
  {
    id: 'aid_new_003',
    content: '基礎的な生活援助（配膳、移送等）は安全にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['看護補助者', '新人', '生活援助', '移送'],
    placeholder: '配膳下膳、患者移送、車椅子介助の安全性について',
    conditions: [{ type: 'profession', values: ['nursing-aide'], operator: 'equals' }],
    scoreWeight: 1.5
  },

  // ===========================
  // 介護職・介護福祉士 - 生活支援
  // ===========================
  {
    id: 'crw_new_001',
    content: '基本的介護技術（移乗、体位変換等）は安全に実施できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['介護職', '新人', '介護技術', '移乗'],
    placeholder: 'ベッドから車椅子への移乗、体位変換、歩行介助について',
    conditions: [{ type: 'profession', values: ['care-worker'], operator: 'equals' }],
    scoreWeight: 1.8
  },
  {
    id: 'crw_new_002',
    content: 'アセスメント能力（状態観察・記録）は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['介護職', '新人', 'アセスメント', '記録'],
    placeholder: '利用者の状態変化の把握、記録の質、多職種への報告について',
    conditions: [{ type: 'profession', values: ['care-worker'], operator: 'equals' }],
    scoreWeight: 1.8
  },
  {
    id: 'crw_new_003',
    content: '認知症ケア・個別ケアは適切に実践できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['介護職', '新人', '認知症ケア', '個別ケア'],
    placeholder: '認知症の方への対応、個々の特性に応じたケアの実践について',
    conditions: [{ type: 'profession', values: ['care-worker'], operator: 'equals' }],
    scoreWeight: 2.0
  },

  // ===========================
  // リハビリ職（PT） - 理学療法技術
  // ===========================
  {
    id: 'pt_new_001',
    content: 'ROM測定・筋力評価は正確にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['理学療法士', '新人', 'ROM測定', '筋力評価'],
    placeholder: '関節可動域測定、MMT（Manual Muscle Testing）の精度について',
    conditions: [{ type: 'profession', values: ['pt'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'pt_new_002',
    content: '基本動作訓練（起居、移乗、歩行）の指導は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['理学療法士', '新人', '基本動作訓練', '歩行訓練'],
    placeholder: '寝返り、起き上がり、立ち上がり、歩行の指導技術について',
    conditions: [{ type: 'profession', values: ['pt'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'pt_new_003',
    content: '治療プログラムの立案は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 30,
    tags: ['理学療法士', '新人', 'プログラム立案', '治療計画'],
    placeholder: '評価結果に基づく治療目標設定、プログラム作成について',
    conditions: [{ type: 'profession', values: ['pt'], operator: 'equals' }],
    scoreWeight: 2.0
  },

  // ===========================
  // リハビリ職（OT） - 作業療法技術
  // ===========================
  {
    id: 'ot_new_001',
    content: 'ADL評価（FIM、BI等）は適切に実施できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['作業療法士', '新人', 'ADL評価', 'FIM'],
    placeholder: 'FIM、Barthel Index等の評価スケールの使用について',
    conditions: [{ type: 'profession', values: ['ot'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'ot_new_002',
    content: '上肢機能訓練・巧緻動作訓練は適切に実施できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['作業療法士', '新人', '上肢機能', '巧緻動作'],
    placeholder: '手指の機能訓練、書字訓練、家事動作訓練について',
    conditions: [{ type: 'profession', values: ['ot'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'ot_new_003',
    content: '認知機能訓練・高次脳機能評価は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['作業療法士', '新人', '認知機能', '高次脳機能'],
    placeholder: '注意、記憶、遂行機能等の評価・訓練について',
    conditions: [{ type: 'profession', values: ['ot'], operator: 'equals' }],
    scoreWeight: 2.0
  },

  // ===========================
  // リハビリ職（ST） - 言語聴覚療法技術
  // ===========================
  {
    id: 'st_new_001',
    content: '嚥下機能評価・訓練は適切に実施できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['言語聴覚士', '新人', '嚥下機能', '嚥下訓練'],
    placeholder: '嚥下スクリーニング、間接訓練、食形態の調整について',
    conditions: [{ type: 'profession', values: ['st'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'st_new_002',
    content: '失語症・構音障害の評価・訓練は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['言語聴覚士', '新人', '失語症', '構音障害'],
    placeholder: '言語機能の評価、コミュニケーション訓練について',
    conditions: [{ type: 'profession', values: ['st'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'st_new_003',
    content: '聴力検査・補聴器調整は適切に実施できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['言語聴覚士', '新人', '聴力検査', '補聴器'],
    placeholder: '聴力測定、補聴器のフィッティングについて',
    conditions: [{ type: 'profession', values: ['st'], operator: 'equals' }],
    scoreWeight: 1.8
  },

  // ===========================
  // 施設別特有スキル - 急性期
  // ===========================
  {
    id: 'acu_skl_001',
    content: '心電図モニターの読み取りは適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['急性期', 'モニター', '心電図'],
    placeholder: '不整脈の発見、異常時の対応について',
    conditions: [{ type: 'facilityType', values: ['acute'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'acu_skl_002',
    content: '人工呼吸器の基本操作・観察は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['急性期', '人工呼吸器', '医療機器'],
    placeholder: '設定確認、アラーム対応、患者観察について',
    conditions: [{ type: 'facilityType', values: ['acute'], operator: 'equals' }],
    scoreWeight: 2.5
  },
  {
    id: 'acu_skl_003',
    content: '急変時の初期対応（BLS等）は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['急性期', 'BLS', '緊急対応'],
    placeholder: 'CPR、AED使用、気道確保の技術について',
    conditions: [{ type: 'facilityType', values: ['acute'], operator: 'equals' }],
    scoreWeight: 2.5
  },

  // ===========================
  // 施設別特有スキル - 慢性期
  // ===========================
  {
    id: 'chr_skl_001',
    content: '長期療養患者への生活支援は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['慢性期', '生活支援', 'QOL向上'],
    placeholder: '個別性を重視した生活支援、QOL向上への取り組み',
    conditions: [{ type: 'facilityType', values: ['chronic'], operator: 'equals' }],
    scoreWeight: 1.8
  },
  {
    id: 'chr_skl_002',
    content: '認知症ケア・終末期ケアは適切に実践できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['慢性期', '認知症ケア', '終末期ケア'],
    placeholder: '認知症患者への対応、看取りケアの実践について',
    conditions: [{ type: 'facilityType', values: ['chronic'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'chr_skl_003',
    content: 'リハビリテーション看護は適切に実践できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['慢性期', 'リハビリ看護', '機能維持'],
    placeholder: 'ADL維持・向上、廃用症候群予防への取り組み',
    conditions: [{ type: 'facilityType', values: ['chronic'], operator: 'equals' }],
    scoreWeight: 1.8
  },

  // ===========================
  // 施設別特有スキル - 老健
  // ===========================
  {
    id: 'rok_skl_001',
    content: '在宅復帰支援は適切に実践できていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['老健', '在宅復帰', '生活指導'],
    placeholder: '在宅復帰を目標としたケア、家族指導の実践について',
    conditions: [{ type: 'facilityType', values: ['roken'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'rok_skl_002',
    content: '多職種連携（医師、看護師、リハビリ職等）は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['老健', '多職種連携', 'チームケア'],
    placeholder: 'カンファレンス参加、情報共有、連携の質について',
    conditions: [{ type: 'facilityType', values: ['roken'], operator: 'equals' }],
    scoreWeight: 1.8
  },
  {
    id: 'rok_skl_003',
    content: '入所・通所・訪問サービス間の連携は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['老健', 'サービス連携', '柔軟性'],
    placeholder: '各サービスの特性理解、柔軟な対応について',
    conditions: [{ type: 'facilityType', values: ['roken'], operator: 'equals' }],
    scoreWeight: 1.5
  },

  // ===========================
  // 医事課職員・事務職 - 事務処理技術
  // ===========================
  {
    id: 'adm_new_001',
    content: '医事業務（受付、会計、レセプト等）は正確にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['医事課', '新人', '医事業務', 'レセプト'],
    placeholder: '患者受付、診療報酬算定、レセプト作成の正確性について',
    conditions: [{ type: 'profession', values: ['admin'], operator: 'equals' }],
    scoreWeight: 2.0
  },
  {
    id: 'adm_new_002',
    content: '患者応対・窓口業務は適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['医事課', '新人', '患者応対', '接遇'],
    placeholder: '受付対応、電話応対、クレーム対応の技術について',
    conditions: [{ type: 'profession', values: ['admin'], operator: 'equals' }],
    scoreWeight: 1.5
  },
  {
    id: 'adm_new_003',
    content: '個人情報保護・医療情報の取り扱いは適切にできていますか？',
    type: 'scale',
    category: 'skill_assessment',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['医事課', '新人', '個人情報保護', '情報管理'],
    placeholder: '個人情報の取り扱い、守秘義務の遵守について',
    conditions: [{ type: 'profession', values: ['admin'], operator: 'equals' }],
    scoreWeight: 2.0
  },

  // ===========================
  // 職場適応・チーム連携
  // ===========================
  {
    id: 'tea_001',
    content: 'チームワーク・協調性は適切に発揮できていますか？',
    type: 'scale',
    category: 'team_collaboration',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['チームワーク', '協調性', '全職種'],
    placeholder: 'チーム内での役割理解、協力姿勢、情報共有について',
    scoreWeight: 1.5
  },
  {
    id: 'tea_002',
    content: '報告・連絡・相談は適切にできていますか？',
    type: 'scale',
    category: 'team_collaboration',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['報告連絡相談', 'コミュニケーション', '全職種'],
    placeholder: '適切なタイミングでの報告、正確な情報伝達について',
    scoreWeight: 1.8
  },
  {
    id: 'tea_003',
    content: '職場のルール・規則は適切に遵守できていますか？',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['ルール遵守', '職場適応', '全職種'],
    placeholder: '勤務態度、時間管理、職場のルールの理解と遵守について',
    scoreWeight: 1.5
  },
  {
    id: 'tea_004',
    content: '時間管理・業務効率は適切にできていますか？',
    type: 'scale',
    category: 'workplace_adaptation',
    section: 'skill_evaluation',
    priority: 1,
    minDuration: 15,
    tags: ['時間管理', '業務効率', '全職種'],
    placeholder: '業務の優先順位づけ、時間内での業務完了について',
    scoreWeight: 1.5
  },

  // ===========================
  // 学習・成長意欲
  // ===========================
  {
    id: 'lea_001',
    content: '自己学習・研修参加は積極的にできていますか？',
    type: 'scale',
    category: 'growth_development',
    section: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['学習意欲', '研修参加', '全職種'],
    placeholder: '自主的な学習、研修への参加姿勢、知識の更新について',
    scoreWeight: 1.3
  },
  {
    id: 'lea_002',
    content: '知識・技術の共有は適切にできていますか？',
    type: 'scale',
    category: 'knowledge_transfer',
    section: 'skill_evaluation',
    priority: 2,
    minDuration: 30,
    tags: ['知識共有', '技術伝承', '全職種'],
    placeholder: '同僚や後輩への知識・技術の伝達について',
    conditions: [{ type: 'experienceLevel', values: ['junior', 'midlevel', 'veteran'], operator: 'contains' }],
    scoreWeight: 1.5
  },
  {
    id: 'lea_003',
    content: '業務改善・効率化への提案は適切にできていますか？',
    type: 'scale',
    category: 'innovation_improvement',
    section: 'skill_evaluation',
    priority: 3,
    minDuration: 45,
    tags: ['業務改善', '提案力', '全職種'],
    placeholder: '業務の問題点発見、改善提案、実施への取り組みについて',
    conditions: [{ type: 'experienceLevel', values: ['junior', 'midlevel', 'veteran'], operator: 'contains' }],
    scoreWeight: 1.8
  }
];

// 職種別スキル項目マッピング
export const skillCategoriesByProfession = {
  nurse: [
    'バイタル測定', '点滴管理', '薬剤管理', '採血・注射', '観察・記録', 
    '感染対策', 'コミュニケーション', '医療安全', '患者教育'
  ],
  'assistant-nurse': [
    '日常生活援助', '療養上の世話', '観察・記録', '看護師との協働', 
    '感染対策', '患者コミュニケーション'
  ],
  'nursing-aide': [
    '環境整備', '患者接遇', '配膳・移送', '清掃・消毒', '感染対策', 
    'サービス提供'
  ],
  'care-worker': [
    '介護技術', 'アセスメント', '認知症ケア', '多職種連携', '記録・報告', 
    '個別ケア', '生活支援'
  ],
  pt: [
    'ROM測定', '筋力評価', '基本動作訓練', '歩行訓練', 'プログラム立案', 
    '機能評価', '運動療法'
  ],
  ot: [
    'ADL評価', '上肢機能訓練', '認知機能訓練', '作業分析', '環境調整', 
    '生活指導', '福祉用具'
  ],
  st: [
    '嚥下機能評価', '失語症評価', '構音訓練', '聴力検査', '補聴器調整', 
    'コミュニケーション訓練'
  ],
  admin: [
    '医事業務', 'レセプト', '患者応対', '個人情報保護', '事務処理', 
    '窓口業務', '電話応対'
  ]
};

// 施設別特有スキル項目
export const facilitySpecificSkills = {
  acute: [
    '心電図モニター', '人工呼吸器', '急変対応', 'BLS', '医療機器操作', 
    '集中治療', '救急処置'
  ],
  chronic: [
    '長期療養ケア', '認知症ケア', '終末期ケア', 'リハビリ看護', 
    '生活支援', 'QOL向上'
  ],
  roken: [
    '在宅復帰支援', '多職種連携', 'サービス連携', '家族指導', 
    '通所・訪問連携', '生活指導'
  ],
  grouphome: [
    '認知症ケア', '個別ケア', '生活支援', '家庭的環境', '地域連携'
  ]
};

console.log(`Comprehensive skill questions: ${comprehensiveSkillQuestions.length}`);
console.log('Skill categories by profession:', skillCategoriesByProfession);
console.log('Facility specific skills:', facilitySpecificSkills);