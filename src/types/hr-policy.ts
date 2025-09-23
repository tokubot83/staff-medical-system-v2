// 人事ポリシーの型定義

export interface HRPolicy {
  id: string;
  key: string; // a～s
  title: string;
  subtitle: string;
  icon: string; // アイコン名
  color: string; // カラーテーマ
  description?: string;
  details: HRPolicyDetail;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  version: string;
}

export interface HRPolicyDetail {
  overview: string;
  background: string;
  implementation: string;
  examples: PolicyExample[];
  metrics?: PolicyMetric[];
  relatedDocuments?: string[];
  facilityCustomization?: FacilityCustomization[];
}

export interface PolicyExample {
  title: string;
  description: string;
  department?: string;
  outcome?: string;
}

export interface PolicyMetric {
  name: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface FacilityCustomization {
  facilityId: string;
  facilityName: string;
  customContent?: string;
  examples?: PolicyExample[];
  isActive: boolean;
}

export interface HRPolicyVersion {
  id: string;
  versionNumber: string;
  effectiveDate: string;
  expiryDate?: string;
  status: 'draft' | 'pending' | 'active' | 'archived';
  policies: HRPolicy[];
  approvedBy?: string;
  approvedAt?: string;
  changeLog?: string;
}

// デフォルトの人事ポリシー（19項目）
export const DEFAULT_HR_POLICIES: Omit<HRPolicy, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    key: 'a',
    title: '働く目的',
    subtitle: '「生活のため」という現実から始まる幸福循環',
    icon: 'Home',
    color: 'blue',
    order: 1,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '職員の働く目的を「生活のため」という現実的な視点から捉え、段階的に幸福循環へと発展させます。',
      background: '多くの職員が生活の安定を第一に考える中、それを否定せず受け入れることから始めます。',
      implementation: '生活の安定→仕事への集中→成果の向上→評価・報酬の向上→更なる生活の安定という好循環を作ります。',
      examples: [
        {
          title: '新入職員の定着',
          description: '初任給と住宅手当で生活基盤を保障し、3年定着率を85%に向上',
          outcome: '離職率20%削減'
        }
      ]
    }
  },
  {
    key: 'b',
    title: 'モチベーションリソース',
    subtitle: '「仕事型（多様性尊重）」で全職種を包摂',
    icon: 'Zap',
    color: 'green',
    order: 2,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '職種や個人の特性に応じた多様なモチベーション源を認め、活用します。',
      background: '医療機関には多様な職種があり、それぞれ異なる価値観を持っています。',
      implementation: '専門性追求型、チーム貢献型、患者満足型など、多様な動機付けを用意します。',
      examples: [
        {
          title: 'リハビリ職の専門性',
          description: '学会発表支援制度により、専門性向上意欲を維持',
          department: 'リハビリテーション科',
          outcome: '職員満足度15%向上'
        }
      ]
    }
  },
  {
    key: 'c',
    title: '就業観（X理論・Y理論）',
    subtitle: '「X理論」で医療安全と属人化解消を実現',
    icon: 'Shield',
    color: 'red',
    order: 3,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: 'X理論的アプローチで標準化と医療安全を確保しつつ、段階的にY理論要素を導入します。',
      background: '医療現場では安全性が最優先であり、自由裁量よりも標準化が重要です。',
      implementation: 'マニュアル遵守→習熟→改善提案→裁量拡大の段階的アプローチを採用します。',
      examples: [
        {
          title: '投薬ダブルチェック',
          description: '厳格なルール適用により投薬ミスを年間ゼロに',
          department: '看護部',
          outcome: '医療安全指標100%達成'
        }
      ]
    }
  },
  {
    key: 'd',
    title: '評価の重点',
    subtitle: '「バランス型」で多職種の公平性を確保',
    icon: 'BarChart3',
    color: 'purple',
    order: 4,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '成果・行動・能力・職務・年功をバランスよく評価し、多職種間の公平性を保ちます。',
      background: '医療機関には成果が測りにくい職種も多く、単一指標では不公平が生じます。',
      implementation: '職種別に評価ウェイトを調整し、全職員が納得できる評価体系を構築します。',
      examples: [
        {
          title: '事務職の評価',
          description: '定量成果30%、業務改善40%、知識習得30%の配分',
          department: '医事課',
          outcome: '評価納得度80%達成'
        }
      ]
    }
  },
  {
    key: 'e',
    title: '給与・賞与の根拠',
    subtitle: '「精算40%・生活保障40%・投資20%」の実践的配分',
    icon: 'DollarSign',
    color: 'amber',
    order: 5,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '給与を精算価値、生活保障、投資価値に分解し、透明性の高い報酬体系を構築します。',
      background: '職員の生活安定と組織の持続可能性を両立する必要があります。',
      implementation: '基本給で生活保障、手当で精算価値、昇給・賞与で投資価値を実現します。',
      examples: [
        {
          title: '看護師年収500万円の内訳',
          description: '基本給200万、夜勤手当等200万、将来期待100万',
          department: '看護部',
          outcome: '給与体系の透明化'
        }
      ]
    }
  },
  {
    key: 'f',
    title: '2:6:2の考え方',
    subtitle: '「中位6割の底上げ」で医療の質を均一化',
    icon: 'Users',
    color: 'indigo',
    order: 6,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '中位層6割の育成に注力し、組織全体の医療の質を向上させます。',
      background: '上位2割に依存すると属人化リスクが高まり、下位2割の切り捨ては人材不足を招きます。',
      implementation: '中位層への手厚い研修と支援により、標準的な医療の質を保証します。',
      examples: [
        {
          title: '中堅看護師育成',
          description: 'ラダー研修強化により中位層のスキル標準化',
          department: '看護部',
          outcome: 'ケアの質均一化'
        }
      ]
    }
  },
  {
    key: 'g',
    title: '代謝概念',
    subtitle: '「長期雇用」で職員のライフサイクルに寄り添う',
    icon: 'RefreshCw',
    color: 'teal',
    order: 7,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '職員のライフステージに応じた柔軟な働き方を提供し、長期雇用を実現します。',
      background: '医療職は専門性が高く、育成に時間がかかるため、長期雇用が合理的です。',
      implementation: 'ライフイベントに応じた配置転換、時短勤務、復職支援を充実させます。',
      examples: [
        {
          title: '育児期の配置転換',
          description: '病棟から外来への異動で両立支援',
          outcome: '育児離職率5%以下'
        }
      ]
    }
  },
  {
    key: 'h',
    title: '年収水準',
    subtitle: '「業界平均以上」で人材確保競争に勝つ',
    icon: 'TrendingUp',
    color: 'orange',
    order: 8,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '地域の医療機関と比較して競争力のある給与水準を維持します。',
      background: '人材獲得競争が激化する中、給与水準は重要な差別化要因です。',
      implementation: '定期的な市場調査と給与改定により、常に上位25%以内を維持します。',
      examples: [
        {
          title: '看護師初任給',
          description: '地域平均+5%の設定で新卒確保',
          outcome: '採用充足率95%'
        }
      ]
    }
  },
  {
    key: 'i',
    title: '成長ステージ',
    subtitle: '「成熟期（変革必要）」における段階的改革',
    icon: 'LineChart',
    color: 'cyan',
    order: 9,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '組織の成熟期における課題を認識し、段階的な変革を推進します。',
      background: '設立から年数が経過し、既存の仕組みの見直しが必要な時期です。',
      implementation: 'DX推進、業務効率化、新サービス開発を段階的に実施します。',
      examples: [
        {
          title: '電子カルテ更新',
          description: '最新システム導入で業務効率20%改善',
          outcome: '残業時間削減'
        }
      ]
    }
  },
  {
    key: 'j',
    title: 'リーダーシップ・マネジメント',
    subtitle: '「マネジメント重視」で現場を安定化',
    icon: 'Briefcase',
    color: 'violet',
    order: 10,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '現場の安定運営を重視し、マネジメント能力の向上に注力します。',
      background: '医療現場では日々の安定運営が患者安全に直結します。',
      implementation: '管理職研修、メンター制度、権限委譲の明確化を進めます。',
      examples: [
        {
          title: '師長育成プログラム',
          description: 'マネジメント研修年6回実施',
          department: '看護部',
          outcome: '部署運営の安定化'
        }
      ]
    }
  },
  {
    key: 'k',
    title: '人材ポートフォリオ',
    subtitle: '「バランス型」で部署特性に対応',
    icon: 'Layers',
    color: 'pink',
    order: 11,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '正職員、パート、派遣等を適切に組み合わせ、柔軟な人員体制を構築します。',
      background: '医療需要の変動や専門性の違いに対応する必要があります。',
      implementation: '部署特性に応じた最適な人材構成を設計し、運用します。',
      examples: [
        {
          title: '外来の人員構成',
          description: '正職員60%、パート40%で繁忙期対応',
          department: '外来',
          outcome: '人件費10%削減'
        }
      ]
    }
  },
  {
    key: 'l',
    title: 'ゼネラリスト・エキスパート',
    subtitle: '「ゼネラリスト重視」で組織力を高める',
    icon: 'GraduationCap',
    color: 'emerald',
    order: 12,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '幅広い知識と経験を持つゼネラリストを育成し、組織の柔軟性を高めます。',
      background: '専門分化が進む一方で、全体を俯瞰できる人材が不足しています。',
      implementation: 'ローテーション制度、複数資格取得支援、キャリアパス多様化を推進します。',
      examples: [
        {
          title: '看護師ローテーション',
          description: '3年で3部署経験の制度化',
          outcome: '応援体制の強化'
        }
      ]
    }
  },
  {
    key: 'm',
    title: '資本・資源',
    subtitle: '「パートナー」として職員と共に歩む',
    icon: 'Link',
    color: 'rose',
    order: 13,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '職員を単なる労働力ではなく、組織の重要なパートナーとして位置づけます。',
      background: '職員の知識と経験は組織の重要な資産です。',
      implementation: '経営情報の共有、意思決定への参画、成果の分配を進めます。',
      examples: [
        {
          title: '経営情報開示',
          description: '四半期決算を全職員に説明',
          outcome: '経営参画意識向上'
        }
      ]
    }
  },
  {
    key: 'n',
    title: '副業',
    subtitle: '「条件付き容認」で多様な働き方に対応',
    icon: 'PlusCircle',
    color: 'slate',
    order: 14,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '本業に支障のない範囲で副業を認め、職員の多様な働き方を支援します。',
      background: '収入の多様化や専門性の活用ニーズが高まっています。',
      implementation: '申請制により、利益相反や過重労働を防ぎつつ副業を容認します。',
      examples: [
        {
          title: '講師活動の容認',
          description: '専門学校での講師活動を認可',
          outcome: '職員の専門性向上'
        }
      ]
    }
  },
  {
    key: 'o',
    title: '労働組合・職員会',
    subtitle: '「職員会（親睦重視）」で一体感を醸成',
    icon: 'Users',
    color: 'lime',
    order: 15,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '職員会活動を通じて、職員間の親睦と組織への帰属意識を高めます。',
      background: '労使対立よりも協調関係の構築が組織発展に寄与します。',
      implementation: '親睦活動、福利厚生、意見交換の場として職員会を活用します。',
      examples: [
        {
          title: '職員旅行',
          description: '年1回の職員旅行で部署間交流',
          outcome: '組織一体感の醸成'
        }
      ]
    }
  },
  {
    key: 'p',
    title: '事業利益の還元・投資',
    subtitle: '「投資40%・還元30%・内部留保30%」で持続可能性確保',
    icon: 'CreditCard',
    color: 'fuchsia',
    order: 16,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '事業利益を設備投資、職員還元、内部留保にバランスよく配分します。',
      background: '持続可能な経営には、投資と還元のバランスが重要です。',
      implementation: '利益配分ルールを明確化し、透明性の高い経営を実現します。',
      examples: [
        {
          title: '決算賞与',
          description: '利益の30%を職員に還元',
          outcome: 'モチベーション向上'
        }
      ]
    }
  },
  {
    key: 'q',
    title: '人材育成軸',
    subtitle: '「知識・技術・心のバランス」を重視',
    icon: 'Heart',
    color: 'stone',
    order: 17,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '専門知識、実践技術、人間性をバランスよく育成します。',
      background: '医療は技術だけでなく、患者への共感や倫理観も重要です。',
      implementation: '技術研修、接遇研修、倫理研修を体系的に実施します。',
      examples: [
        {
          title: '新人研修プログラム',
          description: '技術40%、知識30%、接遇30%の構成',
          outcome: '全人的な医療人育成'
        }
      ]
    }
  },
  {
    key: 'r',
    title: '組織形態',
    subtitle: '「機能別組織」で専門性を高める',
    icon: 'Building',
    color: 'red',
    order: 18,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '診療科、看護部、医技部等の機能別組織により専門性を追求します。',
      background: '医療の高度化に伴い、各部門の専門性向上が必要です。',
      implementation: '部門別の権限と責任を明確化し、専門性を発揮できる体制を構築します。',
      examples: [
        {
          title: 'センター制導入',
          description: '循環器センター設立で専門性強化',
          outcome: '治療成績の向上'
        }
      ]
    }
  },
  {
    key: 's',
    title: '新卒・中途採用バランス',
    subtitle: '「新卒40%・中途60%」で活力と経験を両立',
    icon: 'UserCheck',
    color: 'yellow',
    order: 19,
    isActive: true,
    updatedBy: '戦略企画・統括管理部門',
    version: '1.0',
    details: {
      overview: '新卒と中途採用をバランスよく組み合わせ、組織の活性化を図ります。',
      background: '新卒の育成と即戦力の確保の両立が必要です。',
      implementation: '計画的な新卒採用と、必要に応じた中途採用を実施します。',
      examples: [
        {
          title: '看護師採用',
          description: '新卒10名、中途15名の年間採用',
          department: '看護部',
          outcome: '世代バランスの最適化'
        }
      ]
    }
  }
];