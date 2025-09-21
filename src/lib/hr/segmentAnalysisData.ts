// セグメント分析データの詳細定義
export const segmentAnalysisData = {
  1: { // Phase 1
    'top-A': {
      title: '上位層のAコース選択者',
      statusDetail: {
        label: '理想的',
        description: '高パフォーマンス層が積極的にフルスペックコースを選択。将来の幹部候補として最適な配置。',
        reason: '能力と意欲が最も高い層が、最も挑戦的なコースを選択している理想的な状態'
      },
      metrics: {
        totalCount: 70,
        percentage: 70,
        trend: 'increasing',
        benchmark: '業界平均: 50%',
        riskLevel: 'low'
      },
      priorityDetail: {
        level: 'low',
        reason: '既に適正配置されており、緊急の介入は不要',
        timeline: '通常の育成計画通り進行'
      },
      detailedActions: [
        {
          category: '育成',
          actions: [
            '四半期ごとの成長目標設定と達成度評価',
            '法人本部での戦略会議への参加機会提供',
            'MBA取得支援・外部研修への派遣'
          ]
        },
        {
          category: '活用',
          actions: [
            '法人横断プロジェクトのリーダー任命',
            '新規事業企画への参画',
            '後進育成のメンター役割付与'
          ]
        },
        {
          category: 'リテンション',
          actions: [
            '個別キャリアパス設計',
            '報酬・処遇の競争力確保',
            'サクセッションプランへの組み込み'
          ]
        }
      ],
      risks: [
        '他法人からのヘッドハンティングリスク',
        '過度な期待によるバーンアウト',
        '昇進スピードへの不満'
      ],
      opportunities: [
        '次世代経営層の早期育成',
        '組織変革のドライバー確保',
        '法人ブランド力の向上'
      ]
    },
    'top-B': {
      title: '上位層のBコース選択者',
      statusDetail: {
        label: '許容範囲',
        description: '施設内でのリーダーシップを志向。地域密着型の運営には最適。',
        reason: '施設運営の中核を担う人材として適切な選択'
      },
      metrics: {
        totalCount: 25,
        percentage: 25,
        trend: 'stable',
        benchmark: '業界平均: 30%',
        riskLevel: 'low'
      },
      priorityDetail: {
        level: 'low',
        reason: '施設内リーダーとして安定的に機能',
        timeline: '定期的な評価のみ'
      },
      detailedActions: [
        {
          category: '育成',
          actions: [
            '施設運営スキルの強化研修',
            '地域連携プログラムへの参加',
            '施設内改善プロジェクトの主導'
          ]
        },
        {
          category: '活用',
          actions: [
            '施設管理職への登用準備',
            '施設内委員会のリーダー',
            '新人教育の責任者'
          ]
        },
        {
          category: '動機付け',
          actions: [
            '施設内での裁量権拡大',
            '専門性を活かした役割付与',
            '地域貢献活動への参加支援'
          ]
        }
      ],
      risks: [
        '法人全体視点の不足',
        '施設間異動への抵抗',
        '視野の固定化'
      ],
      opportunities: [
        '施設ブランドの確立',
        '地域ネットワークの強化',
        '専門性の深化'
      ]
    },
    'middle-A': {
      title: '中間層のAコース選択者',
      statusDetail: {
        label: '要注意',
        description: '能力と期待のギャップが存在。30%もの中間層がフルスペックを希望している過大期待状態。',
        reason: '実力以上のコースを選択しており、将来的な不満やミスマッチのリスクが高い'
      },
      metrics: {
        totalCount: 90,
        percentage: 30,
        trend: 'concerning',
        benchmark: '業界平均: 15%',
        riskLevel: 'high'
      },
      priorityDetail: {
        level: 'high',
        reason: '早急な期待値調整が必要。放置すると大量離職リスク',
        timeline: '3ヶ月以内に個別面談実施'
      },
      detailedActions: [
        {
          category: '期待値調整',
          actions: [
            '個別面談による現実的なキャリアパス説明',
            '等級制度導入後の処遇差の事前説明',
            'B・Cコースの魅力と成長機会の説明'
          ]
        },
        {
          category: '能力開発',
          actions: [
            '基礎マネジメント研修の優先受講',
            'スキルアセスメントと改善計画',
            '上位層へのステップアップ支援'
          ]
        },
        {
          category: 'フォローアップ',
          actions: [
            '3ヶ月ごとの進捗確認面談',
            'メンター制度による個別支援',
            'コース変更の柔軟な対応'
          ]
        }
      ],
      risks: [
        'モチベーション低下による離職',
        '現実とのギャップによる不満蓄積',
        '組織への信頼低下'
      ],
      opportunities: [
        '適切な育成による上位層への成長',
        '現実的な目標設定による着実な成長',
        '多様なキャリアパスの開拓'
      ]
    },
    'low-A': {
      title: '要支援層のAコース選択者',
      statusDetail: {
        label: '要対応',
        description: '明らかなミスマッチ。10%もの要支援層がフルスペックコースを選択。',
        reason: '能力不足にも関わらず最難関コースを選択しており、即座の介入が必要'
      },
      metrics: {
        totalCount: 10,
        percentage: 10,
        trend: 'critical',
        benchmark: '業界平均: 2%',
        riskLevel: 'critical'
      },
      priorityDetail: {
        level: 'high',
        reason: '即時介入が必要。本人のためにも早期のコース変更を',
        timeline: '1ヶ月以内に対応開始'
      },
      detailedActions: [
        {
          category: '緊急対応',
          actions: [
            '上司・人事による三者面談の即時実施',
            'コース変更の強い勧奨',
            '現在の業務負荷の即時軽減'
          ]
        },
        {
          category: '支援体制',
          actions: [
            '専任メンターの配置',
            '基礎スキル向上の集中プログラム',
            '心理的サポートの提供'
          ]
        },
        {
          category: '代替案提示',
          actions: [
            'C・Dコースでの安定就労プラン提示',
            '専門職としての成長パス提案',
            '段階的なステップアップ計画'
          ]
        }
      ],
      risks: [
        'メンタルヘルス問題の発生',
        '周囲への悪影響',
        'パフォーマンスのさらなる低下'
      ],
      opportunities: [
        '適正配置による能力発揮',
        '現実的な成長の実現',
        '組織全体の最適化'
      ]
    }
    // 他のセグメントも同様に定義...
  },
  2: { // Phase 2
    'top-A': {
      title: '上位層のAコース選択者（等級制度導入後）',
      statusDetail: {
        label: '理想的',
        description: '等級上限50級を目指せる実力者が60%。処遇差が明確になり適正化が進行。',
        reason: '等級制度により実力に見合った選択が進み、真の幹部候補が明確化'
      },
      metrics: {
        totalCount: 60,
        percentage: 60,
        trend: 'optimizing',
        benchmark: '業界平均: 55%',
        gradeRange: '25-45級',
        gradeCeiling: '50級まで可',
        salaryCoefficient: 1.2,
        riskLevel: 'low'
      },
      priorityDetail: {
        level: 'low',
        reason: '等級制度により適正配置が進行中',
        timeline: '計画通り推進'
      },
      detailedActions: [
        {
          category: '等級昇格支援',
          actions: [
            '上位等級（40級以上）への昇格計画策定',
            '経営スキル習得プログラム',
            '戦略立案プロジェクトへの参画'
          ]
        },
        {
          category: '処遇最適化',
          actions: [
            '等級に応じた報酬設定（係数1.2適用）',
            '役職任命の準備',
            'ストックオプション等の検討'
          ]
        },
        {
          category: '権限委譲',
          actions: [
            '予算権限の段階的付与',
            '人事権の部分的委譲',
            '新規事業の企画権限'
          ]
        }
      ],
      risks: [
        '昇格スピードへの不満',
        '等級間格差による軋轢',
        '過度な競争意識'
      ],
      opportunities: [
        '明確なキャリアラダー',
        '実力主義の浸透',
        '組織活性化'
      ]
    },
    'middle-A': {
      title: '中間層のAコース選択者（等級制度導入後）',
      statusDetail: {
        label: '許容範囲',
        description: '15%まで減少し適正化。等級制度の効果で現実的な選択へシフト。',
        reason: '処遇差が明確になったことで、実力に見合った選択が進んだ'
      },
      metrics: {
        totalCount: 45,
        percentage: 15,
        trend: 'improving',
        benchmark: '業界平均: 20%',
        gradeRange: '15-35級',
        gradeCeiling: '50級まで可（ただし到達は困難）',
        salaryCoefficient: 1.2,
        riskLevel: 'medium'
      },
      priorityDetail: {
        level: 'medium',
        reason: '上位層への成長支援が必要',
        timeline: '6ヶ月計画で実施'
      },
      detailedActions: [
        {
          category: '昇格支援',
          actions: [
            '個別昇格計画の策定',
            '必要スキルの明確化と習得支援',
            '昇格試験対策の実施'
          ]
        },
        {
          category: '能力開発',
          actions: [
            '等級要件に基づく研修受講',
            'OJTによる実践力強化',
            '資格取得支援'
          ]
        },
        {
          category: '動機維持',
          actions: [
            '小さな成功体験の積み重ね',
            '昇格可能性の定期評価',
            'ロールモデルの提示'
          ]
        }
      ],
      risks: [
        '昇格困難による失望',
        'B・Cコースへの転換抵抗',
        '中途半端な位置づけ'
      ],
      opportunities: [
        '努力による上位層到達',
        '専門性と管理の両立',
        '多様なキャリア選択'
      ]
    }
    // 他のセグメントも同様に...
  },
  3: { // Phase 3
    'top-A': {
      title: '上位層のAコース選択者（完成形）',
      statusDetail: {
        label: '理想的',
        description: '評価制度導入により最適配置実現。S+/S評価が75%を占める次世代経営層。',
        reason: '3軸統合（コース×等級×評価）により、真のハイパフォーマーが明確化'
      },
      metrics: {
        totalCount: 50,
        percentage: 50,
        trend: 'optimal',
        benchmark: '業界最高水準',
        gradeRange: '30-48級',
        gradeCeiling: '50級到達可',
        salaryCoefficient: 1.2,
        evaluationDistribution: {
          'S+': 40,
          'S': 35,
          'A+': 20,
          'A': 5
        },
        riskLevel: 'minimal'
      },
      priorityDetail: {
        level: 'low',
        reason: '完成された人材マネジメント体制',
        timeline: '維持・発展'
      },
      detailedActions: [
        {
          category: 'サクセッション',
          actions: [
            '次期経営陣としての準備',
            '取締役会オブザーバー参加',
            '事業部長への任命準備'
          ]
        },
        {
          category: '戦略参画',
          actions: [
            '中期経営計画の策定参加',
            'M&A案件の検討メンバー',
            '新規事業の責任者任命'
          ]
        },
        {
          category: 'グローバル展開',
          actions: [
            '海外事業の立ち上げ',
            '国際カンファレンスへの派遣',
            'グローバル人材ネットワーク構築'
          ]
        }
      ],
      evaluationInsights: {
        strengthPattern: 'S+評価40%は法人トップクラスの実力',
        developmentArea: '残り5%のA評価者の底上げ',
        succession: '経営層候補として5年以内に30%が役員就任見込み'
      },
      risks: [
        '外部流出（ヘッドハンティング）',
        '内部競争の激化',
        '承継タイミングのミス'
      ],
      opportunities: [
        '法人変革の推進力',
        '新事業創出',
        '次世代育成の模範'
      ]
    },
    'middle-B': {
      title: '中間層のBコース選択者（完成形）',
      statusDetail: {
        label: '理想的',
        description: '135名（45%）が施設運営の中核として機能。B評価65%の安定層。',
        reason: '実務を確実に遂行する中核人材層として最適配置'
      },
      metrics: {
        totalCount: 135,
        percentage: 45,
        trend: 'stable',
        benchmark: '理想的な分布',
        gradeRange: '15-30級',
        gradeCeiling: '上限40級',
        salaryCoefficient: 1.1,
        evaluationDistribution: {
          'A': 25,
          'B': 65,
          'C': 10
        },
        riskLevel: 'low'
      },
      priorityDetail: {
        level: 'low',
        reason: '組織の安定基盤として機能',
        timeline: '継続的な支援'
      },
      detailedActions: [
        {
          category: '実務強化',
          actions: [
            '業務改善提案制度への参加',
            '品質管理プロジェクト',
            '効率化ツールの導入推進'
          ]
        },
        {
          category: 'リーダー育成',
          actions: [
            'チームリーダー研修',
            '部下育成スキル向上',
            'コーチング技法習得'
          ]
        },
        {
          category: '専門性深化',
          actions: [
            '専門資格の取得支援',
            '学会・研究会への参加',
            'ベストプラクティス共有'
          ]
        }
      ],
      evaluationInsights: {
        strengthPattern: 'B評価65%は安定的な実務遂行力',
        developmentArea: 'A評価25%を次期リーダー候補として育成',
        potential: 'C評価10%への個別支援で底上げ可能'
      },
      risks: [
        'マンネリ化',
        '成長意欲の低下',
        '新しい取り組みへの抵抗'
      ],
      opportunities: [
        '業務標準化の推進',
        'ナレッジ共有の核',
        '若手育成の担い手'
      ]
    }
    // 他のセグメントも同様に...
  }
};

// 具体的施策の詳細マスター
export const actionMasterData = {
  '早期育成プログラム': {
    description: '将来の幹部候補として1年間の特別育成プログラム',
    duration: '12ヶ月',
    frequency: '週1回の特別研修 + 月1回のメンタリング',
    expectedOutcome: '管理職必要スキルの80%習得',
    kpi: ['リーダーシップ評価スコア20%向上', '部下満足度80%以上', 'プロジェクト成功率90%以上']
  },
  '期待値調整面談': {
    description: '現実的なキャリアパスと成長機会の説明',
    duration: '60分×3回',
    frequency: '初回面談後、3ヶ月後、6ヶ月後',
    expectedOutcome: 'キャリア期待値の適正化とモチベーション維持',
    kpi: ['コース選択満足度70%以上', '離職意向20%減少', '業務意欲度10%向上']
  },
  'メンター配置': {
    description: '経験豊富な先輩職員による個別指導',
    duration: '6-12ヶ月',
    frequency: '隔週1時間のメンタリングセッション',
    expectedOutcome: '実務能力向上と組織適応',
    kpi: ['スキル評価15%向上', 'メンティー満足度85%以上', '定着率95%以上']
  }
  // 他のアクションも同様に定義...
};

// セグメント間の関係性データ
export const segmentRelationships = {
  synergies: [
    {
      segments: ['top-A', 'middle-B'],
      description: '上位Aコースと中間Bコースの協働により、法人-施設連携が強化',
      benefit: '戦略の現場浸透率30%向上'
    },
    {
      segments: ['top-B', 'middle-C'],
      description: '施設リーダーと専門職の連携による品質向上',
      benefit: 'サービス品質スコア15%改善'
    }
  ],
  conflicts: [
    {
      segments: ['middle-A', 'top-B'],
      description: '中間層Aコースが上位層Bコースより高い期待を持つ逆転現象',
      risk: 'モチベーション低下と組織内軋轢',
      mitigation: '等級制度による明確な差別化'
    }
  ]
};