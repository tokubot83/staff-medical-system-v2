// 面談マニュアル動的生成サービス（v2）
// v4面談シートの内容を1問1答形式（5段階評価＋テキスト入力）に分解して動的生成

import { 
  InterviewType, 
  InterviewCategory,
  InterviewClassification 
} from '@/types/interview';

// 職員レベル定義
export type StaffLevel = 
  | 'new'           // 新人（1年未満）
  | 'junior'        // 初級（1-2年）
  | 'general'       // 一般（2-3年）
  | 'midlevel'      // 中堅（3-5年）
  | 'senior'        // 上級（5-7年）
  | 'veteran'       // ベテラン（7-10年）
  | 'leader'        // リーダー（10年以上）
  | 'chief'         // 主任
  | 'manager';      // 管理職

// 職種定義
export type JobRole = 
  | 'nurse'               // 看護師
  | 'assistant-nurse'     // 准看護師
  | 'nursing-aide'        // 看護補助者
  | 'care-worker'         // 介護職員
  | 'care-assistant'      // 介護補助者
  | 'pt'                  // 理学療法士
  | 'ot'                  // 作業療法士
  | 'st';                 // 言語聴覚士

// 施設タイプ
export type FacilityType = 
  | 'acute'       // 急性期病院
  | 'chronic'     // 慢性期病院
  | 'roken'       // 介護老人保健施設
  | 'grouphome'   // グループホーム
  | 'outpatient'; // 外来

// 面談時間
export type InterviewDuration = 15 | 30 | 45 | 60;

// 面談マニュアル生成リクエスト
export interface ManualGenerationRequest {
  staffLevel: StaffLevel;
  jobRole: JobRole;
  facilityType: FacilityType;
  interviewType: InterviewType;
  interviewCategory?: InterviewCategory;
  duration: InterviewDuration;
  motivationType?: string;
  includeEvaluation?: boolean;
  customTopics?: string[];
}

// 生成された面談マニュアル
export interface GeneratedInterviewManual {
  id: string;
  title: string;
  generatedAt: Date;
  estimatedDuration: number;
  
  // 基本情報
  staffInfo: {
    level: StaffLevel;
    jobRole: JobRole;
    facility: FacilityType;
    levelDescription: string;
  };
  
  // 面談概要
  overview: {
    purpose: string;
    objectives: string[];
    keyPoints: string[];
    preparationItems: string[];
  };
  
  // セクション別ガイド
  sections: ManualSection[];
  
  // 時間配分
  timeAllocation: TimeAllocation[];
  
  // 注意事項
  guidelines: {
    dos: string[];
    donts: string[];
    tips: string[];
  };
}

// マニュアルセクション
export interface ManualSection {
  id: string;
  title: string;
  duration: number; // 分
  purpose: string;
  
  // 質問項目（詳細な説明付き）
  questions: DetailedQuestion[];
  
  // セクション別ガイダンス
  guidance: {
    introduction: string;
    keyPoints: string[];
    transitionPhrase: string;
  };
  
  // 評価基準（該当する場合）
  evaluationCriteria?: EvaluationCriteria[];
}

// 詳細な質問項目（5段階評価＋テキスト入力のハイブリッド型対応）
export interface DetailedQuestion {
  id: string;
  question: string;
  type: 'open' | 'closed' | 'scale' | 'checklist' | 'evaluation' | 'hybrid';
  required: boolean;
  
  // 質問の詳細説明
  details: {
    purpose: string;           // この質問の目的
    askingTips: string[];      // 質問する際のコツ
    expectedAnswers?: string[];// 期待される回答例
    followUpQuestions?: string[]; // フォローアップ質問
    redFlags?: string[];       // 注意すべき回答
  };
  
  // 評価スケール（該当する場合）
  scale?: {
    min: number;
    max: number;
    labels: string[];
    description: string;
  };
  
  // チェックリスト（該当する場合）
  checklistItems?: {
    item: string;
    description: string;
  }[];
  
  // ハイブリッド型（5段階評価＋テキスト）の場合
  hybridInput?: {
    scaleLabel: string;        // 評価軸のラベル
    textLabel: string;         // テキスト入力のラベル
    textPlaceholder: string;   // プレースホルダー
    requireText: boolean;      // テキスト入力必須かどうか
  };
}

// 評価基準
export interface EvaluationCriteria {
  item: string;
  levels: {
    score: number;
    label: string;
    description: string;
    behaviors: string[];
  }[];
}

// 時間配分
export interface TimeAllocation {
  section: string;
  minutes: number;
  percentage: number;
}

// v4面談シートのテンプレートデータ（1問1答形式に分解）
const V4_INTERVIEW_TEMPLATES = {
  // 一般看護師（2-3年目）30分版のテンプレート
  'general_nurse_30min': {
    sections: [
      {
        title: '業務遂行状況の評価',
        duration: 8,
        questions: [
          // 看護実践能力を個別の質問に分解
          {
            question: '看護技術・スキルの習熟度はいかがですか？',
            type: 'hybrid' as const,
            purpose: '看護技術の習熟度を評価',
            tips: [
              '最近実施した具体的な技術を聞く',
              '自信がある技術と不安な技術を確認',
              '前回からの成長を確認'
            ],
            hybridInput: {
              scaleLabel: '習熟度（1:初心者 → 5:熟練）',
              textLabel: '具体的な技術と自己評価',
              textPlaceholder: '例：採血は自信があるが、CVカテーテル管理はまだ不安...',
              requireText: false
            }
          },
          {
            question: 'アセスメント能力について教えてください',
            type: 'hybrid' as const,
            purpose: '患者状態の評価・判断力を確認',
            tips: [
              '最近のアセスメント事例を聞く',
              '判断の根拠を確認',
              '医師への報告内容を評価'
            ],
            hybridInput: {
              scaleLabel: '評価（1:要改善 → 5:優秀）',
              textLabel: '最近のアセスメント事例',
              textPlaceholder: '例：先日、発熱患者の状態変化を早期に察知し...',
              requireText: false
            }
          },
          {
            question: '患者対応・コミュニケーションスキルはどうですか？',
            type: 'hybrid' as const,
            purpose: '患者との関係構築力を評価',
            tips: [
              '印象的な患者対応エピソードを聞く',
              '困難な場面での対応を確認',
              'コミュニケーションの工夫を評価'
            ],
            hybridInput: {
              scaleLabel: '評価（1:課題あり → 5:模範的）',
              textLabel: '最近の患者対応で印象的だったこと',
              textPlaceholder: '例：認知症患者さんへの対応で工夫したこと...',
              requireText: false
            }
          },
          {
            question: '多職種連携の状況を教えてください',
            type: 'hybrid' as const,
            purpose: 'チーム医療への貢献度を評価',
            tips: [
              '他職種との協働事例を聞く',
              'カンファレンスでの発言を確認',
              '連携で工夫している点を評価'
            ],
            hybridInput: {
              scaleLabel: '連携度（1:不十分 → 5:積極的）',
              textLabel: '多職種連携での経験や課題',
              textPlaceholder: '例：リハビリスタッフとの情報共有で...',
              requireText: false
            }
          },
          {
            question: '問題解決能力について自己評価してください',
            type: 'hybrid' as const,
            purpose: '課題対処能力を評価',
            tips: [
              '最近直面した問題を聞く',
              '解決プロセスを確認',
              '学んだことを評価'
            ],
            hybridInput: {
              scaleLabel: '能力評価（1:要支援 → 5:自律的）',
              textLabel: '最近解決した問題や課題',
              textPlaceholder: '例：病棟の物品管理の問題を改善提案し...',
              requireText: false
            }
          },
          {
            question: '主体性・積極性をどう評価しますか？',
            type: 'hybrid' as const,
            purpose: '自発的な行動と成長意欲を評価',
            tips: [
              '自発的に取り組んだことを聞く',
              '学習意欲を確認',
              'キャリア意識を評価'
            ],
            hybridInput: {
              scaleLabel: '主体性（1:受動的 → 5:非常に積極的）',
              textLabel: '最近主体的に取り組んだこと',
              textPlaceholder: '例：勉強会の企画、新しい業務への挑戦...',
              requireText: false
            }
          },
          {
            question: '現在の業務内容と達成状況を総合的に教えてください',
            type: 'hybrid' as const,
            purpose: '担当業務の遂行状況と成果を確認',
            tips: [
              '具体的な数値や事例を引き出す',
              '本人の自己評価を聞く',
              '達成感を感じているか確認'
            ],
            hybridInput: {
              scaleLabel: '総合達成度（1:未達 → 5:期待以上）',
              textLabel: '具体的な業務内容と成果',
              textPlaceholder: '担当患者数、役割、主な成果など具体的に...',
              requireText: true
            }
          },
          {
            question: 'この半年で成長した点・新たに身につけたスキル',
            type: 'hybrid' as const,
            purpose: '成長実感と学習成果の確認',
            tips: [
              '小さな成長も見逃さない',
              '本人が気づいていない成長を伝える',
              '今後の成長課題につなげる'
            ],
            hybridInput: {
              scaleLabel: '成長実感（1:停滞 → 5:大きく成長）',
              textLabel: '具体的な成長点とスキル',
              textPlaceholder: '新しくできるようになったこと、自信がついたことなど...',
              requireText: true
            }
          }
        ]
      },
      {
        title: '職員の現状確認（モチベーション・健康・エンゲージメント）',
        duration: 8,
        questions: [
          {
            question: '現在の仕事へのモチベーションはどの程度ですか？',
            type: 'hybrid' as const,
            purpose: 'モチベーションレベルの把握',
            tips: [
              '数値の理由を深掘りする',
              '前回との比較を行う',
              'モチベーションの源泉を探る'
            ],
            hybridInput: {
              scaleLabel: 'モチベーション（1:非常に低い → 5:非常に高い）',
              textLabel: 'その理由や背景',
              textPlaceholder: 'モチベーションに影響している要因を具体的に...',
              requireText: true
            }
          },
          {
            question: 'モチベーションに影響している要因を教えてください',
            type: 'checklist' as const,
            items: [
              '業務内容・やりがい',
              '人間関係・チームワーク',
              '評価・承認',
              '成長実感',
              'ワークライフバランス',
              '給与・待遇',
              '職場環境',
              '将来性・キャリア'
            ],
            purpose: 'モチベーション要因の特定',
            tips: [
              'プラス要因とマイナス要因を整理',
              '改善可能な要因を特定',
              '組織として対応すべき点を把握'
            ]
          },
          {
            question: '心身の健康状態について教えてください',
            type: 'hybrid' as const,
            purpose: '健康面の課題早期発見',
            tips: [
              'プライバシーに配慮しながら聞く',
              '業務との関連性を確認',
              '必要に応じて産業医連携を提案'
            ],
            hybridInput: {
              scaleLabel: '健康状態（1:要注意 → 5:良好）',
              textLabel: '具体的な状況（話せる範囲で）',
              textPlaceholder: '睡眠、疲労、ストレスなど気になることがあれば...',
              requireText: false
            }
          },
          {
            question: '組織への帰属意識・エンゲージメントはいかがですか？',
            type: 'hybrid' as const,
            purpose: '組織コミットメントの確認',
            tips: [
              '組織の理念への共感度を確認',
              'チームへの愛着を聞く',
              '長期的なキャリア意向を探る'
            ],
            hybridInput: {
              scaleLabel: 'エンゲージメント（1:低い → 5:高い）',
              textLabel: '組織・チームへの思い',
              textPlaceholder: '職場で誇りに思うこと、改善したいことなど...',
              requireText: false
            }
          }
        ]
      },
      {
        title: '課題・問題点の確認と対策',
        duration: 6,
        questions: [
          {
            question: '現在直面している業務上の課題を教えてください',
            type: 'hybrid' as const,
            purpose: '業務課題の把握と支援ニーズの確認',
            tips: [
              '具体的な困難事例を聞く',
              '解決に向けた本人の考えを確認',
              '必要なサポートを明確にする'
            ],
            hybridInput: {
              scaleLabel: '課題の深刻度（1:軽微 → 5:重大）',
              textLabel: '具体的な課題内容',
              textPlaceholder: '現在困っていること、支援が必要なことを具体的に...',
              requireText: true
            }
          },
          {
            question: '改善が必要と感じる組織・職場の問題はありますか？',
            type: 'hybrid' as const,
            purpose: '組織課題の発見',
            tips: [
              '建設的な意見を引き出す',
              '改善提案を促す',
              '実現可能性を一緒に考える'
            ],
            hybridInput: {
              scaleLabel: '問題の重要度（1:低 → 5:高）',
              textLabel: '具体的な問題と改善案',
              textPlaceholder: '職場環境、業務フロー、システムなどで改善したい点...',
              requireText: false
            }
          },
          {
            question: '必要な支援・サポートを選んでください',
            type: 'checklist' as const,
            items: [
              '技術指導・教育',
              'メンタルサポート',
              '業務量調整',
              'キャリア相談',
              '人間関係の調整',
              '研修機会',
              '資格取得支援'
            ],
            purpose: '具体的な支援策の特定',
            tips: [
              '優先順位をつける',
              '実施時期を明確にする',
              'フォローアップ計画を立てる'
            ]
          }
        ]
      },
      {
        title: '今後の目標設定とアクションプラン',
        duration: 6,
        questions: [
          {
            question: '今後6ヶ月の個人目標を設定してください',
            type: 'hybrid' as const,
            purpose: '明確な目標設定',
            tips: [
              'SMART目標になっているか確認',
              '達成可能なレベルか検討',
              '組織目標との整合性を確認'
            ],
            hybridInput: {
              scaleLabel: '目標の明確度（1:曖昧 → 5:明確）',
              textLabel: 'SMART目標（具体的・測定可能・達成可能・関連性・期限）',
              textPlaceholder: '例：6ヶ月以内に○○の技術を習得し、独立して実施できるようになる...',
              requireText: true
            }
          },
          {
            question: '目標達成のための具体的アクションプランは？',
            type: 'hybrid' as const,
            purpose: '実行計画の策定',
            tips: [
              '小さなステップに分解',
              '最初の一歩を明確にする',
              '定期的な振り返りポイントを設定'
            ],
            hybridInput: {
              scaleLabel: '計画の具体性（1:抽象的 → 5:具体的）',
              textLabel: '具体的なアクションステップ',
              textPlaceholder: '1. まず○○から始める、2. 毎週○○を実施、3. ○月までに○○...',
              requireText: true
            }
          },
          {
            question: '組織からの支援事項を明確にしましょう',
            type: 'open' as const,
            purpose: '組織側のコミットメント明確化',
            tips: [
              '約束できることを明確に伝える',
              '実施時期を具体的に示す',
              '担当者を明確にする'
            ]
          }
        ]
      },
      {
        title: 'クロージング',
        duration: 2,
        questions: [
          {
            question: '本日の面談はいかがでしたか？',
            type: 'hybrid' as const,
            purpose: '面談の効果確認と改善',
            tips: [
              '率直な意見を歓迎する姿勢を示す',
              '次回への改善点を聞く',
              '面談の頻度希望を確認'
            ],
            hybridInput: {
              scaleLabel: '満足度（1:不満 → 5:満足）',
              textLabel: '感想・フィードバック',
              textPlaceholder: '面談で良かった点、改善してほしい点など...',
              requireText: false
            }
          },
          {
            question: '次回面談日程と確認事項',
            type: 'open' as const,
            purpose: '継続的なフォローアップ',
            tips: [
              '具体的な日程を決める',
              '次回までの宿題を確認',
              '連絡方法を確認'
            ]
          }
        ]
      }
    ]
  },
  
  // 新人看護師（1年未満）45分版
  'new_nurse_45min': {
    sections: [
      {
        title: '導入・アイスブレイク',
        duration: 5,
        questions: [
          {
            question: '最近の体調や気分はいかがですか？',
            type: 'hybrid' as const,
            purpose: 'リラックスした雰囲気作り',
            tips: [
              '笑顔で温かく迎える',
              '緊張をほぐす雑談から始める',
              '面談の目的を改めて説明'
            ],
            hybridInput: {
              scaleLabel: '調子（1:不調 → 5:絶好調）',
              textLabel: '最近の出来事や気になること',
              textPlaceholder: '仕事でもプライベートでも、最近あったことを自由に...',
              requireText: false
            }
          }
        ]
      },
      {
        title: '新人看護師としての適応状況',
        duration: 10,
        questions: [
          {
            question: '入職してからの率直な感想を教えてください',
            type: 'hybrid' as const,
            purpose: '新人の適応プロセス確認',
            tips: [
              '入職時の期待と現実のギャップを聞く',
              '良かった点を先に聞く',
              '困難だった経験を共感的に聞く'
            ],
            hybridInput: {
              scaleLabel: '適応度（1:困難 → 5:順調）',
              textLabel: '入職後の振り返り',
              textPlaceholder: '期待と現実のギャップ、嬉しかったこと、大変だったことなど...',
              requireText: true
            }
          },
          {
            question: '病棟の雰囲気・文化への適応はいかがですか？',
            type: 'hybrid' as const,
            purpose: '職場環境への適応評価',
            tips: [
              '具体的な場面を聞く',
              '困っていることを確認',
              'サポート体制を再確認'
            ],
            hybridInput: {
              scaleLabel: '適応度（1:なじめない → 5:完全に適応）',
              textLabel: '職場環境について',
              textPlaceholder: '病棟の雰囲気、ルール、人間関係など...',
              requireText: false
            }
          },
          {
            question: '先輩看護師との関係はどうですか？',
            type: 'hybrid' as const,
            purpose: '指導体制・人間関係の確認',
            tips: [
              'プリセプターとの関係を重点的に',
              '相談しやすい環境か確認',
              '具体的な支援ニーズを聞く'
            ],
            hybridInput: {
              scaleLabel: '関係性（1:困難 → 5:良好）',
              textLabel: '先輩との関係で感じること',
              textPlaceholder: 'プリセプターや先輩との関係、相談のしやすさなど...',
              requireText: true
            }
          },
          {
            question: 'リアリティショックは感じていますか？',
            type: 'hybrid' as const,
            purpose: '新人特有の課題把握',
            tips: [
              'リアリティショックは正常な反応と伝える',
              '乗り越えた先輩の例を共有',
              'サポート体制を再確認'
            ],
            hybridInput: {
              scaleLabel: 'ショックの程度（1:なし → 5:強い）',
              textLabel: '具体的な内容',
              textPlaceholder: '学校で学んだことと現場のギャップなど...',
              requireText: false
            }
          }
        ]
      },
      {
        title: '基礎看護技術の習得状況',
        duration: 10,
        questions: [
          {
            question: 'バイタルサイン測定の習熟度はどうですか？',
            type: 'hybrid' as const,
            purpose: '基本技術の習得確認',
            tips: [
              '正確性と速度を確認',
              '異常値の判断力を評価',
              '報告の仕方を確認'
            ],
            hybridInput: {
              scaleLabel: '習熟度（1:要練習 → 5:完璧）',
              textLabel: '具体的な状況',
              textPlaceholder: '測定の正確性、異常値の判断、報告など...',
              requireText: false
            }
          },
          {
            question: '採血・注射技術の習得状況を教えてください',
            type: 'hybrid' as const,
            purpose: '侵襲的処置の技術確認',
            tips: [
              '成功率を確認',
              '困難な場面での対応',
              '練習ニーズを把握'
            ],
            hybridInput: {
              scaleLabel: '技術レベル（1:未習得 → 5:自信あり）',
              textLabel: '経験と課題',
              textPlaceholder: '実施回数、成功体験、失敗から学んだことなど...',
              requireText: true
            }
          },
          {
            question: '点滴管理はどの程度できますか？',
            type: 'hybrid' as const,
            purpose: '点滴関連技術の確認',
            tips: [
              '滴下計算の理解',
              'トラブル対応力',
              '安全管理意識'
            ],
            hybridInput: {
              scaleLabel: '習熟度（1:要支援 → 5:独立可能）',
              textLabel: '点滴管理の経験',
              textPlaceholder: '滴下調整、ルート交換、トラブル対応など...',
              requireText: false
            }
          },
          {
            question: '最も自信がある技術と不安な技術を教えてください',
            type: 'open' as const,
            purpose: '優先的な指導ニーズの特定',
            tips: [
              '不安の具体的な内容を聞く',
              '練習機会を提供する',
              '先輩のフォロー体制を確認'
            ]
          }
        ]
      },
      {
        title: '教育・研修の進捗',
        duration: 8,
        questions: [
          {
            question: '新人研修プログラムの理解度はどうですか？',
            type: 'hybrid' as const,
            purpose: '研修効果の確認',
            tips: [
              '理解が難しい内容を特定',
              '追加学習の必要性を確認',
              '実践との結びつきを確認'
            ],
            hybridInput: {
              scaleLabel: '理解度（1:困難 → 5:十分理解）',
              textLabel: '研修での学びと疑問点',
              textPlaceholder: '特に印象的だった内容、まだ理解が不十分な点など...',
              requireText: false
            }
          },
          {
            question: 'プリセプターシップはうまく機能していますか？',
            type: 'hybrid' as const,
            purpose: '指導体制の評価',
            tips: [
              'プリセプターとの関係性を確認',
              '指導方法の適合性を評価',
              '改善要望を聞く'
            ],
            hybridInput: {
              scaleLabel: '満足度（1:不満 → 5:満足）',
              textLabel: 'プリセプターとの関係',
              textPlaceholder: '指導スタイル、相談のしやすさ、要望など...',
              requireText: true
            }
          },
          {
            question: '自己学習はどのように進めていますか？',
            type: 'hybrid' as const,
            purpose: '主体的学習の確認',
            tips: [
              '学習方法をアドバイス',
              '参考書や資料を紹介',
              '勉強会への参加を促す'
            ],
            hybridInput: {
              scaleLabel: '学習量（1:不足 → 5:十分）',
              textLabel: '学習方法と内容',
              textPlaceholder: '使っている教材、勉強時間、困っていることなど...',
              requireText: false
            }
          }
        ]
      },
      {
        title: 'メンタルヘルス・ストレス管理',
        duration: 7,
        questions: [
          {
            question: '現在のストレスレベルを教えてください',
            type: 'hybrid' as const,
            purpose: 'ストレス状況の把握',
            tips: [
              '高ストレスの場合は詳しく聞く',
              'ストレス対処法を一緒に考える',
              '必要に応じて専門的支援を提案'
            ],
            hybridInput: {
              scaleLabel: 'ストレス（1:低い → 5:非常に高い）',
              textLabel: 'ストレスの内容',
              textPlaceholder: '何がストレスになっているか具体的に...',
              requireText: true
            }
          },
          {
            question: 'ストレスの主な要因を選んでください',
            type: 'checklist' as const,
            items: [
              '業務量・時間',
              '技術不足への不安',
              '人間関係',
              '責任の重さ',
              '夜勤・シフト',
              '患者の死・重症',
              'インシデントへの恐れ',
              'プライベートとの両立'
            ],
            purpose: 'ストレス要因の特定',
            tips: [
              '複数要因の関連性を探る',
              '優先的に対処すべき要因を特定',
              '組織的な対応策を検討'
            ]
          },
          {
            question: 'ストレス対処法・セルフケアはできていますか？',
            type: 'hybrid' as const,
            purpose: 'セルフケア能力の確認',
            tips: [
              '効果的な対処法を共有',
              '新しい方法を提案',
              'ワークライフバランスを確認'
            ],
            hybridInput: {
              scaleLabel: 'セルフケア度（1:不十分 → 5:十分）',
              textLabel: '実践している対処法',
              textPlaceholder: '休日の過ごし方、リフレッシュ方法など...',
              requireText: false
            }
          }
        ]
      },
      {
        title: '今後の成長計画',
        duration: 3,
        questions: [
          {
            question: '1年後にどんな看護師になっていたいですか？',
            type: 'hybrid' as const,
            purpose: '成長ビジョンの明確化',
            tips: [
              '具体的なイメージを描かせる',
              '実現可能な目標設定を支援',
              'ロールモデルを示す'
            ],
            hybridInput: {
              scaleLabel: '目標の明確度（1:曖昧 → 5:明確）',
              textLabel: '1年後の理想像',
              textPlaceholder: 'どんな看護師になりたいか、身につけたいスキルなど...',
              requireText: true
            }
          },
          {
            question: '直近3ヶ月の重点目標を設定しましょう',
            type: 'open' as const,
            purpose: '短期目標の設定',
            tips: [
              '達成可能な小目標を設定',
              '具体的な行動計画を立てる',
              'サポート体制を明確化'
            ]
          }
        ]
      },
      {
        title: 'まとめ・次回への申し送り',
        duration: 2,
        questions: [
          {
            question: '本日の面談のまとめと次回の約束',
            type: 'open' as const,
            purpose: '相互理解の確認',
            tips: [
              '決定事項を確認',
              '宿題を明確化',
              '次回日程を決定'
            ]
          }
        ]
      }
    ]
  }
};

export class InterviewManualGenerationService {
  
  /**
   * 面談マニュアルを動的生成
   */
  static async generateManual(
    request: ManualGenerationRequest
  ): Promise<GeneratedInterviewManual> {
    
    // 1. テンプレートの選択または動的生成
    const template = this.selectOrGenerateTemplate(request);
    
    // 2. 職員レベルに応じた調整
    const adjustedSections = this.adjustForStaffLevel(template.sections, request);
    
    // 3. 動機タイプの質問を追加（該当する場合）
    if (request.motivationType) {
      adjustedSections.push(this.createMotivationSection(request.motivationType));
    }
    
    // 4. カスタムトピックの追加（指定された場合）
    if (request.customTopics && request.customTopics.length > 0) {
      adjustedSections.push(this.createCustomTopicsSection(request.customTopics));
    }
    
    // 5. 時間配分の計算
    const timeAllocation = this.calculateTimeAllocation(adjustedSections, request.duration);
    
    // 6. ガイドラインの生成
    const guidelines = this.generateGuidelines(request);
    
    // 7. マニュアルの組み立て
    return {
      id: `manual_${Date.now()}`,
      title: this.generateTitle(request),
      generatedAt: new Date(),
      estimatedDuration: request.duration,
      
      staffInfo: {
        level: request.staffLevel,
        jobRole: request.jobRole,
        facility: request.facilityType,
        levelDescription: this.getStaffLevelDescription(request.staffLevel)
      },
      
      overview: {
        purpose: this.generatePurpose(request),
        objectives: this.generateObjectives(request),
        keyPoints: this.generateKeyPoints(request),
        preparationItems: this.generatePreparationItems(request)
      },
      
      sections: adjustedSections,
      timeAllocation,
      guidelines
    };
  }
  
  /**
   * テンプレートの選択または生成
   */
  private static selectOrGenerateTemplate(request: ManualGenerationRequest): any {
    // 既存テンプレートのキー生成
    const templateKey = `${request.staffLevel}_${request.jobRole}_${request.duration}min`;
    
    // 既存テンプレートがあれば使用
    if ((V4_INTERVIEW_TEMPLATES as any)[templateKey]) {
      return (V4_INTERVIEW_TEMPLATES as any)[templateKey];
    }
    
    // 一般看護師30分テンプレートをベースに時間調整
    if (request.jobRole === 'nurse' && request.duration === 30) {
      return V4_INTERVIEW_TEMPLATES['general_nurse_30min'];
    }
    
    // 新人45分テンプレートをベースに調整
    if (request.staffLevel === 'new' && request.duration === 45) {
      return V4_INTERVIEW_TEMPLATES['new_nurse_45min'];
    }
    
    // なければ動的生成
    return this.generateDynamicTemplate(request);
  }
  
  /**
   * 動的テンプレート生成（1問1答形式）
   */
  private static generateDynamicTemplate(request: ManualGenerationRequest): any {
    const sections: ManualSection[] = [];
    const totalMinutes = request.duration;
    
    // 基本セクション構成（時間配分は面談時間に応じて調整）
    if (totalMinutes >= 45) {
      // 45分以上：フルセット
      sections.push(
        this.createSection('導入・アイスブレイク', Math.floor(totalMinutes * 0.1), [
          this.createHybridQuestion(
            '最近の状況はいかがですか？',
            '関係構築とリラックス',
            '調子（1:不調 → 5:絶好調）',
            '最近の出来事や気になること'
          )
        ]),
        this.createSection('業務遂行状況', Math.floor(totalMinutes * 0.25), 
          this.createPerformanceQuestions()
        ),
        this.createSection('モチベーション・健康', Math.floor(totalMinutes * 0.2), 
          this.createMotivationHealthQuestions()
        ),
        this.createSection('課題と対策', Math.floor(totalMinutes * 0.2), 
          this.createChallengeQuestions()
        ),
        this.createSection('目標設定', Math.floor(totalMinutes * 0.15), 
          this.createGoalQuestions()
        ),
        this.createSection('クロージング', Math.floor(totalMinutes * 0.1), [
          this.createHybridQuestion(
            '面談の振り返り',
            '相互理解の確認',
            '満足度（1:不満 → 5:満足）',
            '感想・フィードバック'
          )
        ])
      );
    } else if (totalMinutes >= 30) {
      // 30分：標準セット（質問を厳選）
      sections.push(
        this.createSection('導入', 3, [
          this.createHybridQuestion(
            '現況確認',
            '状況把握',
            '調子（1:不調 → 5:良好）',
            '最近の状況'
          )
        ]),
        this.createSection('業務評価', Math.floor(totalMinutes * 0.3), 
          this.createPerformanceQuestions().slice(0, 3) // 主要3項目に絞る
        ),
        this.createSection('モチベーション', Math.floor(totalMinutes * 0.25), 
          this.createMotivationHealthQuestions().slice(0, 2) // 主要2項目
        ),
        this.createSection('目標設定', Math.floor(totalMinutes * 0.25), 
          this.createGoalQuestions().slice(0, 2) // 主要2項目
        ),
        this.createSection('まとめ', Math.floor(totalMinutes * 0.1), [
          this.createQuestion('次回への申し送り', 'open', 'フォローアップ')
        ])
      );
    } else {
      // 15分：コンパクトセット（最重要項目のみ）
      sections.push(
        this.createSection('導入', 2, [
          this.createQuestion('簡単な現況確認', 'open', '状況把握')
        ]),
        this.createSection('重点確認', 8, [
          this.createHybridQuestion(
            '業務遂行状況',
            'パフォーマンス確認',
            '達成度（1:未達 → 5:達成）',
            '具体的な状況'
          ),
          this.createHybridQuestion(
            'モチベーション',
            'エンゲージメント確認',
            'レベル（1:低い → 5:高い）',
            '理由と要因'
          )
        ]),
        this.createSection('アクション', 4, [
          this.createQuestion('次のステップ', 'open', '行動計画')
        ]),
        this.createSection('まとめ', 1, [
          this.createQuestion('確認事項', 'open', '相互確認')
        ])
      );
    }
    
    return { sections };
  }
  
  /**
   * 業務遂行関連の質問群を生成（1問1答形式）
   */
  private static createPerformanceQuestions(): any[] {
    return [
      this.createHybridQuestion(
        '技術スキルの習熟度',
        '技術力評価',
        '習熟度（1:初級 → 5:熟練）',
        '得意な技術と課題'
      ),
      this.createHybridQuestion(
        'アセスメント能力',
        '判断力評価',
        '能力（1:要改善 → 5:優秀）',
        '最近の事例'
      ),
      this.createHybridQuestion(
        'コミュニケーション',
        '対人スキル評価',
        'スキル（1:課題あり → 5:優秀）',
        '患者・チームとの関わり'
      ),
      this.createHybridQuestion(
        '問題解決能力',
        '課題対処力評価',
        '能力（1:要支援 → 5:自律的）',
        '解決した問題事例'
      ),
      this.createHybridQuestion(
        '主体性・積極性',
        '自発性評価',
        '積極性（1:受動的 → 5:主体的）',
        '自発的な取り組み'
      )
    ];
  }
  
  /**
   * モチベーション・健康関連の質問群を生成
   */
  private static createMotivationHealthQuestions(): any[] {
    return [
      this.createHybridQuestion(
        'モチベーションレベル',
        'モチベーション把握',
        'レベル（1:低い → 5:高い）',
        '理由と影響要因'
      ),
      this.createHybridQuestion(
        '健康状態',
        '心身の健康確認',
        '状態（1:要注意 → 5:良好）',
        '具体的な状況'
      ),
      this.createHybridQuestion(
        'エンゲージメント',
        '組織への帰属意識',
        '帰属意識（1:低い → 5:高い）',
        '組織への思い'
      )
    ];
  }
  
  /**
   * 課題関連の質問群を生成
   */
  private static createChallengeQuestions(): any[] {
    return [
      this.createHybridQuestion(
        '現在の課題',
        '課題の特定',
        '深刻度（1:軽微 → 5:重大）',
        '具体的な課題内容'
      ),
      this.createQuestion('必要な支援', 'checklist', '支援ニーズ確認'),
      this.createHybridQuestion(
        '組織の改善点',
        '組織課題発見',
        '重要度（1:低 → 5:高）',
        '改善提案'
      )
    ];
  }
  
  /**
   * 目標設定関連の質問群を生成
   */
  private static createGoalQuestions(): any[] {
    return [
      this.createHybridQuestion(
        '今後の目標',
        '目標設定',
        '明確度（1:曖昧 → 5:明確）',
        'SMART目標'
      ),
      this.createHybridQuestion(
        'アクションプラン',
        '実行計画',
        '具体性（1:抽象的 → 5:具体的）',
        '具体的ステップ'
      ),
      this.createQuestion('組織からの支援', 'open', 'コミットメント確認')
    ];
  }
  
  /**
   * ハイブリッド型質問の作成ヘルパー
   */
  private static createHybridQuestion(
    question: string,
    purpose: string,
    scaleLabel: string,
    textLabel: string
  ): any {
    return {
      question,
      type: 'hybrid',
      purpose,
      hybridInput: {
        scaleLabel,
        textLabel,
        textPlaceholder: `${textLabel}を具体的に記入してください...`,
        requireText: false
      },
      tips: this.generateQuestionTips('hybrid')
    };
  }
  
  /**
   * セクション作成ヘルパー
   */
  private static createSection(
    title: string, 
    duration: number, 
    questions: any[]
  ): ManualSection {
    return {
      id: `section_${title.replace(/[・\s]/g, '_')}`,
      title,
      duration,
      purpose: `${title}を通じた状況把握と支援`,
      questions: questions.map(q => this.expandQuestion(q)),
      guidance: {
        introduction: `${title}セクションを始めます。`,
        keyPoints: [`時間配分: ${duration}分`, '傾聴の姿勢を保つ', '具体例を引き出す'],
        transitionPhrase: '次のトピックに移りましょう。'
      }
    };
  }
  
  /**
   * 質問作成ヘルパー
   */
  private static createQuestion(
    question: string,
    type: 'open' | 'closed' | 'scale' | 'checklist' | 'hybrid',
    purpose: string
  ): any {
    return {
      question,
      type,
      purpose,
      tips: this.generateQuestionTips(type)
    };
  }
  
  /**
   * 質問の詳細情報を展開
   */
  private static expandQuestion(q: any): DetailedQuestion {
    return {
      id: `q_${Date.now()}_${Math.random()}`,
      question: q.question,
      type: q.type,
      required: true,
      details: {
        purpose: q.purpose,
        askingTips: q.tips || this.generateQuestionTips(q.type),
        expectedAnswers: this.generateExpectedAnswers(q.type, q.question),
        followUpQuestions: this.generateFollowUpQuestions(q.question),
        redFlags: this.generateRedFlags(q.question)
      },
      scale: q.scale,
      checklistItems: q.items?.map((item: string) => ({
        item,
        description: `${item}に関する確認`
      })),
      hybridInput: q.hybridInput
    };
  }
  
  /**
   * 質問タイプ別のTips生成
   */
  private static generateQuestionTips(type: string): string[] {
    switch (type) {
      case 'open':
        return [
          'オープンエンドで質問する',
          '相手の話を遮らない',
          '沈黙を恐れない',
          '共感的な相槌を打つ'
        ];
      case 'scale':
        return [
          '数値の理由を必ず聞く',
          '前回との比較を行う',
          '改善のための具体策を探る'
        ];
      case 'hybrid':
        return [
          'まず5段階評価を聞く',
          '評価の理由を深掘りする',
          '具体例を引き出す',
          'テキストで詳細を補完'
        ];
      case 'checklist':
        return [
          '該当項目を深掘りする',
          '優先順位を確認する',
          '具体的な事例を聞く'
        ];
      default:
        return ['傾聴の姿勢を保つ'];
    }
  }
  
  /**
   * 期待される回答例の生成
   */
  private static generateExpectedAnswers(type: string, question: string): string[] {
    if (type === 'open' || type === 'hybrid') {
      return [
        '具体的な事例や経験',
        '感情や思いの表現',
        '改善提案や要望'
      ];
    }
    return [];
  }
  
  /**
   * フォローアップ質問の生成
   */
  private static generateFollowUpQuestions(question: string): string[] {
    return [
      'それについてもう少し詳しく教えてください',
      '具体的にはどのような場面でしたか？',
      'その時どう感じましたか？',
      '今後どうしていきたいですか？'
    ];
  }
  
  /**
   * 注意すべき回答の生成
   */
  private static generateRedFlags(question: string): string[] {
    const flags: string[] = [];
    
    if (question.includes('健康') || question.includes('ストレス')) {
      flags.push(
        '極度の疲労感の表現',
        '睡眠障害の訴え',
        '希死念慮の示唆',
        '極端な体重変化の報告'
      );
    }
    
    if (question.includes('モチベーション')) {
      flags.push(
        '極端に低い数値（1-2）',
        '急激な低下',
        '無気力・無関心な態度',
        '退職意向の示唆'
      );
    }
    
    if (question.includes('人間関係')) {
      flags.push(
        'ハラスメントの示唆',
        '孤立感の表現',
        '特定個人との深刻な対立',
        'チーム機能不全の兆候'
      );
    }
    
    return flags;
  }
  
  /**
   * 職員レベルに応じた調整
   */
  private static adjustForStaffLevel(
    sections: ManualSection[], 
    request: ManualGenerationRequest
  ): ManualSection[] {
    const adjusted = [...sections];
    
    // 新人の場合
    if (request.staffLevel === 'new') {
      // 適応・教育関連のセクションを追加
      const adaptationSection: ManualSection = {
        id: 'adaptation',
        title: '職場適応・教育進捗',
        duration: 10,
        purpose: '新人の適応状況と教育進捗の確認',
        questions: [
          this.expandQuestion(
            this.createHybridQuestion(
              '職場環境への適応状況',
              '環境適応の評価',
              '適応度（1:困難 → 5:順調）',
              '具体的な状況'
            )
          ),
          this.expandQuestion({
            question: 'プリセプターとの関係',
            type: 'open',
            purpose: '指導体制の確認',
            tips: ['率直な意見を促す', '改善点を探る']
          }),
          this.expandQuestion({
            question: 'リアリティショックへの対処',
            type: 'open',
            purpose: '新人特有の課題把握',
            tips: ['共感的に聞く', '先輩の経験を共有']
          })
        ],
        guidance: {
          introduction: '新人としての適応状況を確認させてください。',
          keyPoints: ['温かい雰囲気づくり', '成長を認める', '不安を受け止める'],
          transitionPhrase: '順調に成長されていますね。次の話題に移りましょう。'
        }
      };
      
      // 2番目のセクションとして挿入
      adjusted.splice(1, 0, adaptationSection);
    }
    
    // ベテラン・リーダーの場合
    if (['veteran', 'leader', 'chief', 'manager'].includes(request.staffLevel)) {
      // 指導・マネジメント関連のセクションを追加
      const leadershipSection: ManualSection = {
        id: 'leadership',
        title: '指導・リーダーシップ',
        duration: 8,
        purpose: '指導力とチーム貢献の確認',
        questions: [
          this.expandQuestion({
            question: '後輩指導の状況と課題',
            type: 'open',
            purpose: '指導力の評価',
            tips: ['指導の工夫を聞く', '困難事例を共有']
          }),
          this.expandQuestion({
            question: 'チームへの貢献',
            type: 'open',
            purpose: 'リーダーシップの発揮',
            tips: ['具体的な貢献を確認', '今後の役割を検討']
          }),
          this.expandQuestion({
            question: '組織改善への提案',
            type: 'open',
            purpose: '組織発展への貢献',
            tips: ['建設的な提案を促す', '実現可能性を検討']
          })
        ],
        guidance: {
          introduction: 'リーダーとしての役割について話しましょう。',
          keyPoints: ['経験を尊重', '知見を引き出す', '組織への貢献を認める'],
          transitionPhrase: '貴重なご意見ありがとうございます。'
        }
      };
      
      adjusted.push(leadershipSection);
    }
    
    return adjusted;
  }
  
  /**
   * 動機タイプセクションの作成
   */
  private static createMotivationSection(motivationType: string): ManualSection {
    const questions: DetailedQuestion[] = [];
    
    // 基本質問
    questions.push(this.expandQuestion({
      question: '仕事でやりがいを感じる瞬間は？',
      type: 'open',
      purpose: 'モチベーション源泉の確認',
      tips: ['具体的な場面を聞く', '感情を引き出す']
    }));
    
    // 動機タイプ別質問
    switch (motivationType) {
      case 'achievement':
        questions.push(
          this.expandQuestion({
            question: '最近達成した目標と次の挑戦',
            type: 'open',
            purpose: '達成動機の確認',
            tips: ['達成感を共有', '新たな目標設定を支援']
          })
        );
        break;
        
      case 'affiliation':
        questions.push(
          this.expandQuestion({
            question: 'チームワークで嬉しかったこと',
            type: 'open',
            purpose: '親和動機の確認',
            tips: ['人間関係の重要性を確認', 'チーム貢献を評価']
          })
        );
        break;
        
      case 'power':
        questions.push(
          this.expandQuestion({
            question: '影響力を発揮できた場面',
            type: 'open',
            purpose: '権力動機の確認',
            tips: ['リーダーシップを評価', '影響力拡大の機会を探る']
          })
        );
        break;
        
      case 'autonomy':
        questions.push(
          this.expandQuestion({
            question: '自律的に進められている業務',
            type: 'open',
            purpose: '自律動機の確認',
            tips: ['裁量権を確認', '自由度向上の可能性を探る']
          })
        );
        break;
        
      case 'security':
        questions.push(
          this.expandQuestion({
            question: '安心して働ける環境要因',
            type: 'open',
            purpose: '安定動機の確認',
            tips: ['安全・安心を確認', '不安要素を取り除く']
          })
        );
        break;
    }
    
    return {
      id: 'motivation',
      title: 'モチベーション特性に応じた確認',
      duration: 5,
      purpose: '個人の動機特性に応じた支援',
      questions,
      guidance: {
        introduction: 'あなたのモチベーション特性に基づいてお聞きします。',
        keyPoints: ['動機タイプを意識した質問', '個別性を重視', '強みを活かす'],
        transitionPhrase: 'モチベーション維持のサポートをしていきます。'
      }
    };
  }
  
  /**
   * カスタムトピックセクションの作成
   */
  private static createCustomTopicsSection(topics: string[]): ManualSection {
    const questions = topics.map(topic => 
      this.expandQuestion({
        question: topic,
        type: 'open',
        purpose: 'カスタムトピックの確認',
        tips: ['柔軟に対応', '深掘りする']
      })
    );
    
    return {
      id: 'custom',
      title: '追加確認事項',
      duration: Math.min(topics.length * 3, 10),
      purpose: '個別の確認事項',
      questions,
      guidance: {
        introduction: '追加でいくつか確認させてください。',
        keyPoints: ['個別事情に配慮', '柔軟な対応'],
        transitionPhrase: 'ご協力ありがとうございます。'
      }
    };
  }
  
  /**
   * 時間配分の計算
   */
  private static calculateTimeAllocation(
    sections: ManualSection[], 
    totalDuration: number
  ): TimeAllocation[] {
    const allocations: TimeAllocation[] = [];
    const totalAllocated = sections.reduce((sum, s) => sum + s.duration, 0);
    
    sections.forEach(section => {
      allocations.push({
        section: section.title,
        minutes: section.duration,
        percentage: Math.round((section.duration / totalAllocated) * 100)
      });
    });
    
    return allocations;
  }
  
  /**
   * ガイドラインの生成
   */
  private static generateGuidelines(request: ManualGenerationRequest): any {
    return {
      dos: [
        '時間配分を意識する',
        '傾聴の姿勢を保つ',
        '具体例を引き出す',
        '共感的な対応をする',
        'ポジティブな点も必ず確認',
        '次回への宿題を明確にする'
      ],
      donts: [
        '批判的な態度を取らない',
        '一方的に話さない',
        '時間を大幅に超過しない',
        'プライバシーを侵害しない',
        '約束できないことを言わない'
      ],
      tips: this.generateTipsForLevel(request.staffLevel)
    };
  }
  
  /**
   * 職員レベル別のTips
   */
  private static generateTipsForLevel(level: StaffLevel): string[] {
    switch (level) {
      case 'new':
        return [
          '温かく迎える雰囲気作り',
          '小さな成長も見逃さない',
          '不安を否定せず受け止める',
          '先輩の経験談を共有'
        ];
      case 'junior':
      case 'general':
        return [
          '自律性を尊重',
          'キャリアビジョンを確認',
          '強みを伸ばす視点',
          'チャレンジを促す'
        ];
      case 'midlevel':
      case 'senior':
        return [
          '専門性を認める',
          '組織への貢献を評価',
          '後輩指導の役割を確認',
          '次のステップを一緒に考える'
        ];
      case 'veteran':
      case 'leader':
      case 'chief':
      case 'manager':
        return [
          '経験と知識を尊重',
          'マネジメント視点を求める',
          '組織課題への意見を聞く',
          '後継者育成を促す'
        ];
      default:
        return ['個別性を重視', '成長を支援'];
    }
  }
  
  /**
   * タイトル生成
   */
  private static generateTitle(request: ManualGenerationRequest): string {
    const levelName = this.getStaffLevelName(request.staffLevel);
    const jobName = this.getJobRoleName(request.jobRole);
    return `${levelName}${jobName} 定期面談マニュアル（${request.duration}分版）`;
  }
  
  /**
   * 目的生成
   */
  private static generatePurpose(request: ManualGenerationRequest): string {
    return `${this.getStaffLevelName(request.staffLevel)}職員の現状把握と成長支援`;
  }
  
  /**
   * 目標生成
   */
  private static generateObjectives(request: ManualGenerationRequest): string[] {
    return [
      '業務遂行状況の評価',
      'モチベーション・健康状態の確認',
      '課題の特定と解決策の検討',
      '成長目標の設定',
      '必要な支援の明確化'
    ];
  }
  
  /**
   * キーポイント生成
   */
  private static generateKeyPoints(request: ManualGenerationRequest): string[] {
    return [
      '傾聴と共感の姿勢',
      '具体的な事例の確認',
      '成長の承認と評価',
      '建設的なフィードバック',
      'フォローアップの約束'
    ];
  }
  
  /**
   * 準備事項生成
   */
  private static generatePreparationItems(request: ManualGenerationRequest): string[] {
    return [
      '前回面談記録の確認',
      '評価データの準備',
      '静かな面談場所の確保',
      '十分な時間の確保',
      '記録用紙・タブレット'
    ];
  }
  
  /**
   * 職員レベルの説明
   */
  private static getStaffLevelDescription(level: StaffLevel): string {
    const descriptions: Record<StaffLevel, string> = {
      'new': '入職1年未満の新人職員',
      'junior': '1-2年目の初級職員',
      'general': '2-3年目の一般職員',
      'midlevel': '3-5年目の中堅職員',
      'senior': '5-7年目の上級職員',
      'veteran': '7-10年目のベテラン職員',
      'leader': '10年以上のリーダー職員',
      'chief': '主任級職員',
      'manager': '管理職'
    };
    return descriptions[level];
  }
  
  /**
   * 職員レベル名称
   */
  private static getStaffLevelName(level: StaffLevel): string {
    const names: Record<StaffLevel, string> = {
      'new': '新人',
      'junior': '初級',
      'general': '一般',
      'midlevel': '中堅',
      'senior': '上級',
      'veteran': 'ベテラン',
      'leader': 'リーダー',
      'chief': '主任',
      'manager': '管理職'
    };
    return names[level];
  }
  
  /**
   * 職種名称
   */
  private static getJobRoleName(role: JobRole): string {
    const names: Record<JobRole, string> = {
      'nurse': '看護師',
      'assistant-nurse': '准看護師',
      'nursing-aide': '看護補助者',
      'care-worker': '介護職員',
      'care-assistant': '介護補助者',
      'pt': '理学療法士',
      'ot': '作業療法士',
      'st': '言語聴覚士'
    };
    return names[role];
  }
}