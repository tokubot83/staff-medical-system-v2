import React, { useState } from 'react';
import {
  Users, Briefcase, GraduationCap, LineChart, 
  CheckCircle, ChevronRight, Calendar, Target, 
  Lightbulb, Building, FileText, Star, Link,
  CreditCard, RefreshCw, ArrowRight, ArrowDown,
  PlusCircle, Layers, Clock, Award, Heart,
  MessageCircle, Database, Search, TrendingUp,
  Shield, Home, Zap, UserCheck, BookOpen,
  DollarSign, BarChart3, Settings, Network,
  Download, ClipboardList, Eye, Activity
} from 'lucide-react';

const KouseikaiHRPolicyIntegrated = () => {
  const [activePolicy, setActivePolicy] = useState('a');
  const [activeTab, setActiveTab] = useState('visual'); // 'document', 'visual', 'implementation', 'department', 'message', 'recruitment', 'departments', 'department'

  const policies = {
    'a': {
      title: '働く目的',
      subtitle: '「生活のため」という現実から始まる幸福循環',
      icon: <Home className="text-blue-600" size={20} />,
      color: 'blue'
    },
    'b': {
      title: 'モチベーションリソース',
      subtitle: '「仕事型（多様性尊重）」で全職種を包摂',
      icon: <Zap className="text-green-600" size={20} />,
      color: 'green'
    },
    'c': {
      title: '就業観（X理論・Y理論）',
      subtitle: '「X理論」で医療安全と属人化解消を実現',
      icon: <Shield className="text-red-600" size={20} />,
      color: 'red'
    },
    'd': {
      title: '評価の重点',
      subtitle: '「バランス型」で多職種の公平性を確保',
      icon: <BarChart3 className="text-purple-600" size={20} />,
      color: 'purple'
    },
    'e': {
      title: '給与・賞与の根拠',
      subtitle: '「精算40%・生活保障40%・投資20%」の実践的配分',
      icon: <DollarSign className="text-amber-600" size={20} />,
      color: 'amber'
    },
    'f': {
      title: '2:6:2の考え方',
      subtitle: '「中位6割の底上げ」で医療の質を均一化',
      icon: <Users className="text-indigo-600" size={20} />,
      color: 'indigo'
    },
    'g': {
      title: '代謝概念',
      subtitle: '「長期雇用」で職員のライフサイクルに寄り添う',
      icon: <RefreshCw className="text-teal-600" size={20} />,
      color: 'teal'
    },
    'h': {
      title: '年収水準',
      subtitle: '「業界平均以上」で人材確保競争に勝つ',
      icon: <TrendingUp className="text-orange-600" size={20} />,
      color: 'orange'
    },
    'i': {
      title: '成長ステージ',
      subtitle: '「成熟期（変革必要）」における段階的改革',
      icon: <LineChart className="text-cyan-600" size={20} />,
      color: 'cyan'
    },
    'j': {
      title: 'リーダーシップ・マネジメント',
      subtitle: '「マネジメント重視」で現場を安定化',
      icon: <Briefcase className="text-violet-600" size={20} />,
      color: 'violet'
    },
    'k': {
      title: '人材ポートフォリオ',
      subtitle: '「バランス型」で部署特性に対応',
      icon: <Layers className="text-pink-600" size={20} />,
      color: 'pink'
    },
    'l': {
      title: 'ゼネラリスト・エキスパート',
      subtitle: '「ゼネラリスト重視」で組織力を高める',
      icon: <GraduationCap className="text-emerald-600" size={20} />,
      color: 'emerald'
    },
    'm': {
      title: '資本・資源',
      subtitle: '「パートナー」として職員と共に歩む',
      icon: <Link className="text-rose-600" size={20} />,
      color: 'rose'
    },
    'n': {
      title: '副業',
      subtitle: '「条件付き容認」で多様な働き方に対応',
      icon: <PlusCircle className="text-slate-600" size={20} />,
      color: 'slate'
    },
    'o': {
      title: '採用の方向性',
      subtitle: '「新卒・中途バランス」で組織を活性化',
      icon: <UserCheck className="text-lime-600" size={20} />,
      color: 'lime'
    },
    'p': {
      title: '協調性・主体性',
      subtitle: '状況に応じた使い分け',
      icon: <Users className="text-fuchsia-600" size={20} />,
      color: 'fuchsia'
    },
    'q': {
      title: '組織形態',
      subtitle: '「ピラミッド型」で指示命令系統を明確化',
      icon: <Building className="text-stone-600" size={20} />,
      color: 'stone'
    },
    'r': {
      title: '心と能力',
      subtitle: '「心がきれい」を重視する医療人材育成',
      icon: <Heart className="text-red-600" size={20} />,
      color: 'red'
    },
    's': {
      title: 'その他求める人材像',
      subtitle: '「明るく、元気で、素直」な医療人',
      icon: <Star className="text-yellow-600" size={20} />,
      color: 'yellow'
    }
  };

  const policyDetails = {
    'a': (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">基本理念</h4>
          <p className="text-sm mb-3">
            医療法人厚生会では、働く目的を「生活のため」と明確に位置づけています。
            これは理想論ではなく、医療・介護現場で働く職員の現実を直視した選択です。
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
            <MessageCircle className="mr-2 text-blue-600" size={16} />
            現場の実例：看護師 田中さん（35歳）
          </h4>
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p className="mb-2">
              夜勤もある激務の中、なぜ働き続けるのか。「患者様のため」という使命感もありますが、
              まず「子供の教育費のため」「住宅ローンのため」という生活の現実があります。
            </p>
          </div>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <h4 className="font-bold text-blue-900 mb-3 flex items-center">
            <RefreshCw className="mr-2" size={16} />
            幸福循環のメカニズム
          </h4>
          <div className="space-y-2">
            {[
              '職員が安定した給与で生活基盤を確保',
              '経済的不安がないから患者ケアに集中できる',
              '質の高い医療・介護サービスを提供',
              '地域から信頼され、経営が安定',
              '職員への還元が可能になり、更なる生活の安定へ'
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    'c': (
      <div className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-bold text-red-800 mb-2">X理論選択の必然性</h4>
          <p className="text-sm">
            医療現場において「X理論」の選択は必然です。
            命を扱う現場では「なんとなく」や「たぶん」は許されません。
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
            <Shield className="mr-2 text-red-600" size={16} />
            具体的な実践例
          </h4>
          <div className="space-y-2">
            {[
              { title: '薬剤のダブルチェック体制', desc: '必ず2名で確認' },
              { title: '転倒転落防止マニュアル', desc: '全病棟で統一された手順' },
              { title: '申し送りのSBAR形式', desc: '標準化されたコミュニケーション' },
              { title: '電子カルテの記載ルール', desc: '誰が見ても理解できる記録' }
            ].map((item, index) => (
              <div key={index} className="flex items-start bg-gray-50 p-2 rounded">
                <CheckCircle className="mr-2 mt-0.5 text-red-500 flex-shrink-0" size={14} />
                <div>
                  <span className="font-semibold text-sm">{item.title}</span>
                  <span className="text-sm text-gray-600 ml-2">- {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h4 className="font-bold text-red-900 mb-2">属人化解消の効果</h4>
          <p className="text-sm">
            「ベテラン看護師の勘」に頼るのではなく、新人でもマニュアル通りに実施すれば
            安全な医療が提供できる。これがX理論による属人化解消です。
          </p>
        </div>
      </div>
    ),
    'b': (
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-800 mb-2">基本方針</h4>
          <p className="text-sm">
            厚生会では「仕事型」を基本としつつ、職員の多様なモチベーションを認めています。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: '理学療法士 山田さん', type: '仕事型', detail: '患者さんの機能回復を見るのがやりがい' },
            { name: '介護職 鈴木さん', type: '生活型', detail: '安定した収入で家族を養える' },
            { name: '若手医師 佐藤先生', type: '成長型', detail: '最新医療技術を学びたい' },
            { name: 'ベテラン看護師 高橋さん', type: '職場型', detail: 'この病院の仲間と働くのが楽しい' }
          ].map((staff, index) => (
            <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center mb-1">
                <UserCheck className="mr-1 text-green-600" size={14} />
                <span className="font-semibold text-sm">{staff.name}</span>
              </div>
              <div className="text-xs text-gray-600 mb-1">【{staff.type}】</div>
              <div className="text-xs">{staff.detail}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    'c': (
      <div className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-bold text-red-800 mb-2">X理論選択の必然性</h4>
          <p className="text-sm">
            医療現場において「X理論」の選択は必然です。命を扱う現場では「なんとなく」や「たぶん」は許されません。
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
            <Shield className="mr-2 text-red-600" size={16} />
            具体的な実践例
          </h4>
          <div className="space-y-2">
            {[
              { title: '薬剤のダブルチェック体制', desc: '必ず2名で確認' },
              { title: '転倒転落防止マニュアル', desc: '全病棟で統一された手順' },
              { title: '申し送りのSBAR形式', desc: '標準化されたコミュニケーション' },
              { title: '電子カルテの記載ルール', desc: '誰が見ても理解できる記録' }
            ].map((item, index) => (
              <div key={index} className="flex items-start bg-gray-50 p-2 rounded">
                <CheckCircle className="mr-2 mt-0.5 text-red-500 flex-shrink-0" size={14} />
                <div>
                  <span className="font-semibold text-sm">{item.title}</span>
                  <span className="text-sm text-gray-600 ml-2">- {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  };

  // 他のポリシーの詳細は省略（同様のフォーマットで追加）
  policyDetails.b = (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-2">人事制度の二面性</h4>
        <p className="text-sm mb-3">
          職員を「規則で管理」する側面と「自由に任せる」側面の両方が必要です。
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded">
            <h5 className="font-semibold text-sm mb-2 flex items-center">
              <Shield className="mr-1 text-blue-600" size={14} />
              X理論的アプローチ
            </h5>
            <ul className="text-xs space-y-1">
              <li>• 安全管理規定の徹底</li>
              <li>• 服務規程の遵守</li>
              <li>• 勤怠管理の厳格化</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded">
            <h5 className="font-semibold text-sm mb-2 flex items-center">
              <Users className="mr-1 text-green-600" size={14} />
              Y理論的アプローチ
            </h5>
            <ul className="text-xs space-y-1">
              <li>• 改善提案の奨励</li>
              <li>• 自主的な研修参加</li>
              <li>• チーム内での役割調整</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">組織ルールの構造</h4>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-3">
            <h5 className="font-semibold text-sm">必須ルール（X理論）60%</h5>
            <p className="text-xs text-gray-600">安全・品質に関わる絶対的規則</p>
          </div>
          <div className="border-l-4 border-green-500 pl-3">
            <h5 className="font-semibold text-sm">推奨ルール（Y理論）40%</h5>
            <p className="text-xs text-gray-600">効率・改善に関わる柔軟な指針</p>
          </div>
        </div>
      </div>
    </div>
  );

  policyDetails.h = (
    <div className="space-y-4">
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h4 className="font-bold text-orange-800 mb-2">人材確保の生存戦略</h4>
        <p className="text-sm">
          地方の看護師不足は深刻です。業界平均以上の給与は、
          優秀な人材を確保し、地域医療を守るための必須条件です。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <DollarSign className="mr-2 text-orange-600" size={16} />
          具体的な年収水準
        </h4>
        <div className="space-y-3">
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">新卒看護師</span>
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">地域平均+10%</span>
            </div>
            <div className="text-lg font-bold text-orange-800">年収400万円</div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">中堅看護師（10年）</span>
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">大都市病院水準</span>
            </div>
            <div className="text-lg font-bold text-orange-800">年収550万円</div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">介護福祉士</span>
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">業界平均+15%</span>
            </div>
            <div className="text-lg font-bold text-orange-800">年収350万円</div>
          </div>
        </div>
      </div>
      <div className="bg-orange-100 p-4 rounded-lg">
        <h4 className="font-bold text-orange-900 mb-2">好循環の実現</h4>
        <p className="text-sm">
          少数精鋭で高い生産性を実現し、その成果を職員に還元。
          「働きがいのある職場」として地域での評判を確立します。
        </p>
      </div>
    </div>
  );

  policyDetails.g = (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-bold text-green-800 mb-2">処遇体系の設計思想</h4>
        <p className="text-sm mb-3">
          職員の生活と成長を支える「バランス型」の処遇体系を構築します。
        </p>
        <div className="bg-white p-3 rounded">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">生活保障部分</span>
              <span className="text-sm text-green-600">40%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">成果報酬部分</span>
              <span className="text-sm text-blue-600">40%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">成長投資部分</span>
              <span className="text-sm text-purple-600">20%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">具体的な処遇水準</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-2 rounded">
            <h5 className="text-xs font-semibold mb-1">新卒初任給</h5>
            <p className="text-lg font-bold text-blue-600">月25万円</p>
            <p className="text-xs text-gray-600">地域トップクラス</p>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <h5 className="text-xs font-semibold mb-1">中堅職員（30歳）</h5>
            <p className="text-lg font-bold text-green-600">月40-50万円</p>
            <p className="text-xs text-gray-600">多職種の公平性確保</p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <h5 className="text-xs font-semibold mb-1">管理職</h5>
            <p className="text-lg font-bold text-purple-600">月60万円以上</p>
            <p className="text-xs text-gray-600">責任に見合う処遇</p>
          </div>
          <div className="bg-orange-50 p-2 rounded">
            <h5 className="text-xs font-semibold mb-1">賞与</h5>
            <p className="text-lg font-bold text-orange-600">年4.5ヶ月分</p>
            <p className="text-xs text-gray-600">業績連動型</p>
          </div>
        </div>
      </div>
    </div>
  );

  policyDetails.d = (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-bold text-purple-800 mb-2">多職種対応の評価体系</h4>
        <p className="text-sm">
          医療機関には医師、看護師、リハビリ職、介護職、事務職など多様な職種が存在します。
          バランス型評価はこの多様性に対応します。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">評価要素の具体例</h4>
        <div className="space-y-2">
          {[
            { element: '成果', example: '患者満足度、在院日数短縮への貢献', color: 'bg-purple-100' },
            { element: '行動', example: 'チーム医療への協力度、カンファレンス参加', color: 'bg-blue-100' },
            { element: '能力', example: '資格取得、専門知識の深さ', color: 'bg-green-100' },
            { element: '職務', example: '夜勤対応、委員会活動', color: 'bg-yellow-100' },
            { element: '年功', example: '経験年数による安定したケア提供', color: 'bg-pink-100' }
          ].map((item, index) => (
            <div key={index} className={`${item.color} p-2 rounded-lg`}>
              <span className="font-semibold text-sm">{item.element}：</span>
              <span className="text-sm ml-2">{item.example}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  policyDetails.e = (
    <div className="space-y-4">
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 className="font-bold text-amber-800 mb-2">給与配分の実践的設計</h4>
        <p className="text-sm">
          「精算40%・生活保障40%・投資20%」の配分は医療職の現実に即しています。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">
          看護師（経験10年）年収500万円の内訳例
        </h4>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="bg-amber-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">40%</div>
            <div>
              <div className="font-semibold text-sm">精算価値（200万円）</div>
              <div className="text-xs text-gray-600">夜勤手当、資格手当、実績評価</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">40%</div>
            <div>
              <div className="font-semibold text-sm">生活保障（200万円）</div>
              <div className="text-xs text-gray-600">基本給、家族手当、住宅手当</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">20%</div>
            <div>
              <div className="font-semibold text-sm">投資価値（100万円）</div>
              <div className="text-xs text-gray-600">将来の成長期待、昇格可能性</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-amber-100 p-4 rounded-lg">
        <h4 className="font-bold text-amber-900 mb-2">川畑統括事務局長の理念</h4>
        <p className="text-sm">
          「生活保障40%は法人の責務」という方針により、
          結婚・出産・子育て期の職員も安心して働けます。
        </p>
      </div>
    </div>
  );

  policyDetails.f = (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <h4 className="font-bold text-indigo-800 mb-2">中位層重視の戦略</h4>
        <p className="text-sm">
          医療現場でも2:6:2の分布は存在しますが、重要なのは中位6割の育成です。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">職員分布の実例</h4>
        <div className="space-y-2">
          <div className="bg-red-50 p-3 rounded">
            <div className="flex items-center mb-1">
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">上位2割</div>
              <span className="font-semibold text-sm">認定看護師、専門医</span>
            </div>
            <p className="text-xs text-gray-600 ml-12">特別な処遇はするが依存しない</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <div className="flex items-center mb-1">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">中位6割</div>
              <span className="font-semibold text-sm">一般看護師、介護職</span>
            </div>
            <p className="text-xs text-gray-600 ml-12">手厚い研修と安定給与で組織の中核に</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="flex items-center mb-1">
              <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">下位2割</div>
              <span className="font-semibold text-sm">新人、適応困難者</span>
            </div>
            <p className="text-xs text-gray-600 ml-12">再教育プログラム提供で成長支援</p>
          </div>
        </div>
      </div>
      <div className="bg-indigo-100 p-4 rounded-lg">
        <h4 className="font-bold text-indigo-900 mb-2">医療の質の均一化</h4>
        <p className="text-sm">
          中位6割が確実に標準的ケアを提供できれば、どの病棟でも、どの時間帯でも、
          安定した医療サービスが保証されます。
        </p>
      </div>
    </div>
  );
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-bold text-purple-800 mb-2">キャリア形成の基本思想</h4>
        <p className="text-sm mb-3">
          「30歳でコア人材」を目標に、計画的な育成プログラムを提供します。
        </p>
        <div className="bg-white p-3 rounded">
          <h5 className="font-semibold text-sm mb-2">8年間の育成ステップ</h5>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="bg-purple-100 px-2 py-1 rounded text-xs font-bold mr-2">1-2年目</span>
              <span className="text-xs">基礎習得期</span>
            </div>
            <div className="flex items-center">
              <span className="bg-purple-200 px-2 py-1 rounded text-xs font-bold mr-2">3-4年目</span>
              <span className="text-xs">実務習熟期</span>
            </div>
            <div className="flex items-center">
              <span className="bg-purple-300 px-2 py-1 rounded text-xs font-bold mr-2">5-6年目</span>
              <span className="text-xs">リーダー候補期</span>
            </div>
            <div className="flex items-center">
              <span className="bg-purple-400 px-2 py-1 rounded text-xs font-bold mr-2">7-8年目</span>
              <span className="text-xs">管理職準備期</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">キャリアパスの特徴</h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <Target className="mr-2 mt-0.5 text-purple-500 flex-shrink-0" size={14} />
            <div>
              <h5 className="font-semibold text-sm">明確な目標設定</h5>
              <p className="text-xs text-gray-600">「30歳でコア人材」という明確なゴール</p>
            </div>
          </div>
          <div className="flex items-start">
            <Users className="mr-2 mt-0.5 text-purple-500 flex-shrink-0" size={14} />
            <div>
              <h5 className="font-semibold text-sm">ゼネラリスト育成</h5>
              <p className="text-xs text-gray-600">複数部門経験による幅広い視野</p>
            </div>
          </div>
          <div className="flex items-start">
            <TrendingUp className="mr-2 mt-0.5 text-purple-500 flex-shrink-0" size={14} />
            <div>
              <h5 className="font-semibold text-sm">継続的な成長支援</h5>
              <p className="text-xs text-gray-600">研修制度と実践機会の提供</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 残りのポリシー定義を追加
  policyDetails.r = (
    <div className="space-y-4">
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h4 className="font-bold text-red-800 mb-2">心の重要性</h4>
        <p className="text-sm">
          医療職には技術以上に「心」が重要です。
          患者様への思いやり、チームへの配慮、これらが医療の質を左右します。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <Heart className="mr-2 text-red-600" size={16} />
          心と能力の評価マトリックス
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              type: 'A象限（心◎能力◎）',
              action: '次期管理職候補として育成',
              color: 'bg-green-100'
            },
            {
              type: 'B象限（心◎能力△）',
              action: 'じっくり技術指導、必ず戦力化',
              color: 'bg-blue-100'
            },
            {
              type: 'C象限（心△能力◎）',
              action: '要注意、患者トラブルのリスク',
              color: 'bg-yellow-100'
            },
            {
              type: 'D象限（心△能力△）',
              action: '配置転換または教育的指導',
              color: 'bg-gray-100'
            }
          ].map((item, index) => (
            <div key={index} className={`${item.color} p-3 rounded`}>
              <div className="font-semibold text-sm mb-1">{item.type}</div>
              <div className="text-xs">{item.action}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-red-100 p-4 rounded-lg">
        <h4 className="font-bold text-red-900 mb-2">育成の優先順位</h4>
        <p className="text-sm">
          「患者様に優しく接する介護職員」は、技術が未熟でも育成価値が高い。
          心は変えにくいが、技術は教育で向上できるからです。
        </p>
      </div>
    </div>
  );

  policyDetails.s = (
    <div className="space-y-4">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-bold text-yellow-800 mb-2">求める人材の基本資質</h4>
        <p className="text-sm">
          「明るく、元気で、素直」という一見シンプルな要件には、
          医療現場で必要な本質的な資質が込められています。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <Star className="mr-2 text-yellow-600" size={16} />
          評価ポイントの具体例
        </h4>
        <div className="space-y-2">
          {[
            { quality: '明るく', meaning: '患者を元気づける笑顔', icon: '😊' },
            { quality: '元気で', meaning: '夜勤もこなす体力', icon: '💪' },
            { quality: '素直', meaning: '先輩の指導を受け入れる姿勢', icon: '🙏' },
            { quality: '経験値', meaning: '介護施設でのボランティア経験', icon: '🏥' },
            { quality: '継続力', meaning: '部活動を3年間継続', icon: '⏰' }
          ].map((item, index) => (
            <div key={index} className="flex items-center bg-yellow-50 p-2 rounded">
              <span className="text-2xl mr-3">{item.icon}</span>
              <div>
                <span className="font-semibold text-sm">{item.quality}</span>
                <span className="text-sm text-gray-600 ml-2">- {item.meaning}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h4 className="font-bold text-yellow-900 mb-2">完璧を求めない現実主義</h4>
        <p className="text-sm">
          完璧な人材は存在しません。「共感力は高いが決断力に欠ける」という人材も、
          適切な配置で活躍できます。重要なのは、医療人としての基本的資質と成長可能性です。
        </p>
      </div>
    </div>
  );

  // 残りのポリシーを追加
  policyDetails.i = (
    <div className="space-y-4">
      <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
        <h4 className="font-bold text-cyan-800 mb-2">成熟期における変革の必要性</h4>
        <p className="text-sm">
          厚生会は地域に根差した歴史ある医療機関として成熟期にありますが、
          時代の変化に対応した段階的な変革が必要です。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <Settings className="mr-2 text-cyan-600" size={16} />
          変革の具体例
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: '紙カルテから電子カルテへ', type: 'デジタル化' },
            { title: 'タスクシフト・シェアの推進', type: '業務改革' },
            { title: '地域包括ケアシステムへの対応', type: '連携強化' },
            { title: 'オンライン診療の導入', type: '新サービス' }
          ].map((item, index) => (
            <div key={index} className="bg-cyan-50 p-3 rounded">
              <div className="text-xs text-cyan-600 font-semibold mb-1">{item.type}</div>
              <div className="text-sm font-medium">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-cyan-100 p-4 rounded-lg">
        <h4 className="font-bold text-cyan-900 mb-2">段階的改革のアプローチ</h4>
        <p className="text-sm">
          急激な変化は現場の混乱を招きます。まず業務の標準化を進め、
          その上で段階的に変革を実施。職員の理解と協力を得ながら進めます。
        </p>
      </div>
    </div>
  );

  policyDetails.j = (
    <div className="space-y-4">
      <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
        <h4 className="font-bold text-violet-800 mb-2">マネジメント重視の理由</h4>
        <p className="text-sm">
          医療現場の今の課題は、カリスマ医師による属人的運営から脱却すること。
          まず仕組みで安定させ、その後にリーダーシップを発揮する土台を作ります。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <Briefcase className="mr-2 text-violet-600" size={16} />
          マネジメント重視の実践
        </h4>
        <div className="space-y-2">
          {[
            { title: '診療科別の収支管理システム導入', icon: '📊' },
            { title: 'ベッドコントロールの標準化', icon: '🏥' },
            { title: '多職種カンファレンスの定例化', icon: '👥' },
            { title: 'インシデント分析と改善活動のPDCA', icon: '🔄' }
          ].map((item, index) => (
            <div key={index} className="flex items-center bg-violet-50 p-2 rounded">
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="text-sm">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-violet-100 p-4 rounded-lg">
        <h4 className="font-bold text-violet-900 mb-2">将来への布石</h4>
        <p className="text-sm">
          現在はマネジメントで基盤を固め、将来的にはリーダーシップも
          発揮できる人材を育成。両輪で組織を前進させます。
        </p>
      </div>
    </div>
  );

  policyDetails.k = (
    <div className="space-y-4">
      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
        <h4 className="font-bold text-pink-800 mb-2">部署特性に応じた人材配置</h4>
        <p className="text-sm">
          医療機関は部署により求められる人材が異なります。
          全体としてバランスを保ちながら、各部署の特性に応じた配置を行います。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <Layers className="mr-2 text-pink-600" size={16} />
          部署別の人材配置例
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { dept: '救急部門', type: '即断即決型の短期契約医師も活用', color: 'bg-red-50' },
            { dept: '療養病棟', type: '長期雇用の安定型看護師中心', color: 'bg-blue-50' },
            { dept: 'リハビリ部門', type: '専門性の高いセラピスト', color: 'bg-green-50' },
            { dept: '事務部門', type: 'ゼネラリスト型の総合職', color: 'bg-yellow-50' }
          ].map((item, index) => (
            <div key={index} className={`${item.color} p-3 rounded`}>
              <div className="font-semibold text-sm mb-1">{item.dept}</div>
              <div className="text-xs text-gray-600">{item.type}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-pink-100 p-4 rounded-lg">
        <h4 className="font-bold text-pink-900 mb-2">柔軟な組織運営</h4>
        <p className="text-sm">
          画一的な人材配置ではなく、部門の特性と個人の適性を
          マッチングさせることで、組織全体の力を最大化します。
        </p>
      </div>
    </div>
  );

  policyDetails.l = (
    <div className="space-y-4">
      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
        <h4 className="font-bold text-emerald-800 mb-2">ゼネラリスト育成の重要性</h4>
        <p className="text-sm">
          医療職もゼネラリスト育成が重要です。属人化を解消し、
          組織全体を理解できる人材を育成します。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <GraduationCap className="mr-2 text-emerald-600" size={16} />
          看護師のゼネラリスト育成例
        </h4>
        <div className="space-y-2">
          {[
            { period: '1-3年目', dept: '急性期病棟', skill: '基礎看護技術の習得' },
            { period: '4-6年目', dept: '回復期リハビリ病棟', skill: 'リハビリ看護の理解' },
            { period: '7-9年目', dept: '外来または手術室', skill: '専門技術の拡大' },
            { period: '10年目以降', dept: '管理職または教育担当', skill: '組織運営・人材育成' }
          ].map((item, index) => (
            <div key={index} className="flex items-start bg-emerald-50 p-2 rounded">
              <div className="bg-emerald-600 text-white px-2 py-1 rounded text-xs font-bold mr-3 mt-0.5">
                {item.period}
              </div>
              <div>
                <div className="text-sm font-semibold">{item.dept}</div>
                <div className="text-xs text-gray-600">{item.skill}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-emerald-100 p-4 rounded-lg">
        <h4 className="font-bold text-emerald-900 mb-2">組織の柔軟性確保</h4>
        <p className="text-sm">
          ローテーションにより、病院全体を理解し、どこでも働ける看護師を育成。
          専門看護師は必要最小限とし、外部研修で補完します。
        </p>
      </div>
    </div>
  );

  policyDetails.m = (
    <div className="space-y-4">
      <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
        <h4 className="font-bold text-rose-800 mb-2">パートナーシップの理念</h4>
        <p className="text-sm">
          職員は単なる労働力ではなく、地域医療を共に支えるパートナー。
          共に価値を創造し、共に成長する関係を築きます。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <Link className="mr-2 text-rose-600" size={16} />
          パートナーシップの実践
        </h4>
        <div className="space-y-2">
          {[
            { action: '経営情報の透明化', detail: '月次収支を全職員に開示' },
            { action: '改善提案制度', detail: '現場の声を経営に反映' },
            { action: '職員持株会', detail: '経営参画意識の醸成' },
            { action: '家族見学会', detail: '職員の家族も巻き込む' }
          ].map((item, index) => (
            <div key={index} className="flex items-start bg-rose-50 p-2 rounded">
              <CheckCircle className="mr-2 mt-0.5 text-rose-500 flex-shrink-0" size={14} />
              <div>
                <span className="font-semibold text-sm">{item.action}</span>
                <span className="text-sm text-gray-600 ml-2">- {item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-rose-100 p-4 rounded-lg">
        <h4 className="font-bold text-rose-900 mb-2">共創の精神</h4>
        <p className="text-sm">
          職員の幸せが患者の幸せにつながるという信念のもと、
          真のパートナーシップを構築します。
        </p>
      </div>
    </div>
  );

  policyDetails.n = (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="font-bold text-slate-800 mb-2">条件付き容認の背景</h4>
        <p className="text-sm">
          医療職の副業ニーズは多様です。完全禁止は時代に逆行し、
          完全自由はリスクが大きい。バランスの取れた対応が必要です。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3">副業の具体例と判定</h4>
        <div className="space-y-2">
          <div className="bg-green-50 p-3 rounded">
            <div className="font-semibold text-sm text-green-800 mb-2">✅ 容認される副業</div>
            <ul className="text-xs space-y-1">
              <li>• 医師：他院での当直（地域医療への貢献）</li>
              <li>• 看護師：看護学校の非常勤講師</li>
              <li>• 理学療法士：スポーツトレーナー活動</li>
              <li>• 事務職：医療事務講座の講師</li>
            </ul>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="font-semibold text-sm text-red-800 mb-2">❌ 禁止事項</div>
            <ul className="text-xs space-y-1">
              <li>• 競合他院での常勤的勤務</li>
              <li>• 本業に支障をきたす深夜業務</li>
              <li>• 患者情報を利用した活動</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 p-4 rounded-lg">
        <h4 className="font-bold text-slate-900 mb-2">申請・管理体制</h4>
        <p className="text-sm">
          事前申請制により、本業との両立を確認。
          職員の多様な生き方を尊重しながら、組織の規律を維持します。
        </p>
      </div>
    </div>
  );

  policyDetails.o = (
    <div className="space-y-4">
      <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
        <h4 className="font-bold text-lime-800 mb-2">バランス採用の戦略</h4>
        <p className="text-sm">
          新卒と中途のバランス採用により、組織文化の継承と
          新しい知識・技術の導入を両立させます。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <UserCheck className="mr-2 text-lime-600" size={16} />
          採用バランスの実例
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-lime-50 p-3 rounded">
            <div className="flex items-center mb-2">
              <div className="bg-lime-600 text-white px-2 py-1 rounded text-xs font-bold">新卒40%</div>
            </div>
            <ul className="text-xs space-y-1">
              <li>• 看護学校からの定期採用</li>
              <li>• 初期研修医の受け入れ</li>
              <li>• 組織文化の継承者</li>
            </ul>
          </div>
          <div className="bg-lime-50 p-3 rounded">
            <div className="flex items-center mb-2">
              <div className="bg-lime-600 text-white px-2 py-1 rounded text-xs font-bold">中途60%</div>
            </div>
            <ul className="text-xs space-y-1">
              <li>• 専門資格保有者</li>
              <li>• 経験豊富な管理職候補</li>
              <li>• 新しい視点の導入者</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-lime-100 p-4 rounded-lg">
        <h4 className="font-bold text-lime-900 mb-2">組織の新陳代謝</h4>
        <p className="text-sm">
          新卒は長期的に育成し組織の核に、中途は即戦力として活用。
          このバランスが組織の活性化を促します。
        </p>
      </div>
    </div>
  );

  policyDetails.p = (
    <div className="space-y-4">
      <div className="bg-fuchsia-50 p-4 rounded-lg border border-fuchsia-200">
        <h4 className="font-bold text-fuchsia-800 mb-2">状況に応じた使い分け</h4>
        <p className="text-sm">
          医療はチーム医療が基本ですが、専門性も重要。
          場面に応じて協調性と主体性を使い分けます。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <Users className="mr-2 text-fuchsia-600" size={16} />
          場面別の使い分け
        </h4>
        <div className="space-y-2">
          {[
            {
              scene: 'チーム医療場面',
              focus: '協調性重視',
              example: '多職種カンファレンス、病棟回診'
            },
            {
              scene: '専門性発揮場面',
              focus: '主体性重視',
              example: '専門外来、認定看護師活動'
            },
            {
              scene: '緊急時',
              focus: '両方の融合',
              example: 'リーダーの主体性とメンバーの協調性'
            }
          ].map((item, index) => (
            <div key={index} className="bg-fuchsia-50 p-3 rounded">
              <div className="flex items-center mb-1">
                <span className="font-semibold text-sm">{item.scene}</span>
                <span className="bg-fuchsia-600 text-white px-2 py-0.5 rounded text-xs ml-2">
                  {item.focus}
                </span>
              </div>
              <div className="text-xs text-gray-600">例：{item.example}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-fuchsia-100 p-4 rounded-lg">
        <h4 className="font-bold text-fuchsia-900 mb-2">成長段階での変化</h4>
        <p className="text-sm">
          新人は協調性から入り、経験を積んで主体性を発揮。
          段階的成長を支援する教育体系を構築します。
        </p>
      </div>
    </div>
  );

  policyDetails.q = (
    <div className="space-y-4">
      <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
        <h4 className="font-bold text-stone-800 mb-2">ピラミッド型の必然性</h4>
        <p className="text-sm">
          医療安全の観点から、責任の所在が明確なピラミッド型は必須。
          指示命令系統の明確化により、迅速な意思決定を実現します。
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <Building className="mr-2 text-stone-600" size={16} />
          医療機関の階層構造
        </h4>
        <div className="space-y-2">
          {[
            { level: '理事長・院長', role: 'WHY：理念・ビジョン', color: 'bg-red-100' },
            { level: '診療部長・看護部長', role: 'WHAT：戦略・方針', color: 'bg-orange-100' },
            { level: '医長・師長', role: 'HOW：戦術・手法', color: 'bg-yellow-100' },
            { level: '一般職員', role: 'DO：実践・実行', color: 'bg-green-100' }
          ].map((item, index) => (
            <div key={index} className={`${item.color} p-3 rounded`}>
              <div className="font-semibold text-sm">{item.level}</div>
              <div className="text-xs text-gray-600">{item.role}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-stone-100 p-4 rounded-lg">
        <h4 className="font-bold text-stone-900 mb-2">医療事故防止への貢献</h4>
        <p className="text-sm">
          明確な階層構造により、医療事故時の責任体制も明確に。
          迅速な対応と再発防止策の実施が可能になります。
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 w-full" style={{ minWidth: '1200px' }}>
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-200">
        <div>
          <div className="text-sm text-gray-500 mb-1">医療法人厚生会</div>
          <h1 className="text-3xl font-bold text-gray-800">人事ポリシー統合管理システム</h1>
          <p className="text-gray-600 mt-2">川畑統括事務局長による22の人事戦略方針</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end mb-2">
            <Heart className="mr-2 text-red-500" size={16} />
            <span className="text-blue-800 font-medium">「職員の幸福が患者の幸福につながる」</span>
          </div>
          <div className="flex items-center justify-end">
            <Target className="mr-2 text-green-600" size={16} />
            <span className="text-green-800 font-medium">属人化解消と幸福循環の実現</span>
          </div>
        </div>
      </div>

      {/* タブメニュー */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('document')}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-all ${
              activeTab === 'document'
                ? 'bg-white text-blue-600 shadow-md font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="mr-2" size={16} />
            公式文書
          </button>
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-all ${
              activeTab === 'visual'
                ? 'bg-white text-green-600 shadow-md font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Eye className="mr-2" size={16} />
            ビジュアル解説
          </button>
          <button
            onClick={() => setActiveTab('implementation')}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-all ${
              activeTab === 'implementation'
                ? 'bg-white text-purple-600 shadow-md font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ClipboardList className="mr-2" size={16} />
            実装ガイド
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg mt-1">
          <button
            onClick={() => setActiveTab('department')}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-all ${
              activeTab === 'department'
                ? 'bg-white text-orange-600 shadow-md font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="mr-2" size={16} />
            部門実行計画
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-all ${
              activeTab === 'message'
                ? 'bg-white text-red-600 shadow-md font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart className="mr-2" size={16} />
            経営メッセージ
          </button>
          <button
            onClick={() => setActiveTab('recruitment')}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-all ${
              activeTab === 'recruitment'
                ? 'bg-white text-indigo-600 shadow-md font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UserCheck className="mr-2" size={16} />
            採用基準
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'document' && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="max-w-4xl mx-auto">
            {/* 公式文書ヘッダー */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-2">医療法人厚生会 人事ポリシー</h2>
                <p className="text-gray-600">～川畑統括事務局長による人材マネジメント方針～</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>制定日：令和○年○月○日</span>
                <span>策定責任者：川畑統括事務局長</span>
                <span>実施責任部署：人事部準備室</span>
              </div>
            </div>

            {/* 基本理念 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4 text-blue-800">基本理念</h3>
              <p className="text-sm leading-relaxed">
                人事ポリシーは組織の未来を決定する最重要戦略である。本ポリシーは、属人化解消と持続可能な組織運営を実現するための指針として策定する。
                職員の生活を守りながら、質の高い医療・介護サービスを地域に提供し続ける組織を目指す。
              </p>
            </div>

            {/* ポリシー項目一覧 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4 text-blue-800">人事ポリシー22項目</h3>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(policies).map(([key, policy]) => (
                  <div key={key} className="border-l-4 border-blue-400 pl-4 py-2">
                    <div className="flex items-start">
                      <span className="font-bold text-sm mr-2">{key.toUpperCase()}.</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">{policy.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{policy.subtitle}</p>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <span className="font-semibold">方針：</span>
                          <span className="ml-1">
                            {key === 'a' && '職員と組織がWin-Winの関係を構築し、幸福の好循環を生み出す'}
                            {key === 'b' && '仕事型を基本としつつ、多様なモチベーションを尊重する'}
                            {key === 'c' && 'X理論により医療安全と属人化解消を実現する'}
                            {key === 'd' && 'バランス型評価により多職種の公平性を確保する'}
                            {key === 'e' && '生活の安定と成果評価、将来投資のバランス配分を行う'}
                            {key === 'f' && '組織の実力である中位層を確実に育成する'}
                            {key === 'g' && '職員のライフサイクルに寄り添う雇用形態を提供する'}
                            {key === 'h' && '人材獲得競争力の確保と職員満足度向上を実現する'}
                            {key === 'i' && '安定運営を維持しながら段階的変革を推進する'}
                            {key === 'j' && '現時点では仕組み構築と効率運営を優先する'}
                            {key === 'k' && '部署特性に応じた多様な人材配置を行う'}
                            {key === 'l' && '属人化解消と管理職育成のための幅広い人材育成を行う'}
                            {key === 'm' && '職員を共に法人を発展させる仲間として位置づける'}
                            {key === 'n' && '労務管理法規を前提とした柔軟な対応を行う'}
                            {key === 'o' && '組織文化継承と即戦力確保の両立を図る'}
                            {key === 'p' && '部門特性に応じた柔軟な評価を行う'}
                            {key === 'q' && '指示命令系統の明確化による安定運営を実現する'}
                            {key === 'r' && '能力だけでなく人間性を重視した評価を行う'}
                            {key === 's' && '基本資質を持ちつつ多様性も受け入れる'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 運用指針 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4 text-blue-800">運用上の重要指針</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold text-sm mb-2">優先順位</h4>
                  <ol className="text-xs space-y-1">
                    <li>1. 属人化解消</li>
                    <li>2. システム化・標準化</li>
                    <li>3. 中位層の育成</li>
                    <li>4. 長期的視点での組織づくり</li>
                  </ol>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <h4 className="font-bold text-sm mb-2">評価の視点</h4>
                  <ul className="text-xs space-y-1">
                    <li>• 心（人間性）と能力のバランス</li>
                    <li>• プロセス重視</li>
                    <li>• チーム貢献度</li>
                    <li>• 成長可能性</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <h4 className="font-bold text-sm mb-2">期待される成果</h4>
                  <ul className="text-xs space-y-1">
                    <li>• 属人化リスクの解消</li>
                    <li>• 職員満足度の向上</li>
                    <li>• 組織の持続可能性確保</li>
                    <li>• 地域医療への安定的貢献</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ダウンロードボタン */}
            <div className="text-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto hover:bg-blue-700 transition-colors">
                <Download className="mr-2" size={18} />
                PDF版をダウンロード
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'visual' && (
        <div className="grid grid-cols-3 gap-6">
          {/* 左側：ポリシー選択メニュー */}
          <div className="col-span-1">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white p-3">
                <h3 className="text-lg font-bold">人事ポリシー項目</h3>
              </div>
              <div className="p-3 space-y-2 max-h-screen overflow-y-auto">
                {Object.keys(policies).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActivePolicy(key)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activePolicy === key 
                        ? 'bg-blue-100 border-2 border-blue-400' 
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">{policies[key].icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-sm mb-1">
                          {key.toUpperCase()}. {policies[key].title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {policies[key].subtitle}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：詳細説明 */}
          <div className="col-span-2">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-xl font-bold flex items-center">
                  {policies[activePolicy].icon}
                  <span className="ml-3">
                    {activePolicy.toUpperCase()}. {policies[activePolicy].title}
                  </span>
                </h2>
                <p className="text-sm mt-1 opacity-90">{policies[activePolicy].subtitle}</p>
              </div>
              <div className="p-6">
                {policyDetails[activePolicy] || (
                  <div className="text-gray-600">
                    <p>このポリシーの詳細説明を表示します。</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'implementation' && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">実装ガイド・運用ツール</h2>
            
            {/* 部門別実装ガイド */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4 text-purple-800">部門別実装ガイド</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded p-4">
                  <h4 className="font-bold text-sm mb-3 flex items-center">
                    <Users className="mr-2 text-blue-600" size={16} />
                    看護部門
                  </h4>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>ジョブローテーション：3年サイクルで病棟異動</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>評価制度：チーム貢献度60%、個人成果40%</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>給与体系：夜勤手当を精算価値に含める</span>
                    </li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded p-4">
                  <h4 className="font-bold text-sm mb-3 flex items-center">
                    <Heart className="mr-2 text-red-600" size={16} />
                    介護部門
                  </h4>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>資格取得支援：介護福祉士取得を全面支援</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>評価制度：プロセス評価70%、成果30%</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>教育体系：OJT中心の実践的育成</span>
                    </li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded p-4">
                  <h4 className="font-bold text-sm mb-3 flex items-center">
                    <Activity className="mr-2 text-green-600" size={16} />
                    リハビリ部門
                  </h4>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>専門性向上：学会参加費用の補助制度</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>評価制度：患者満足度を重点評価</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>副業対応：スポーツトレーナー活動を容認</span>
                    </li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded p-4">
                  <h4 className="font-bold text-sm mb-3 flex items-center">
                    <Briefcase className="mr-2 text-purple-600" size={16} />
                    事務部門
                  </h4>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>ゼネラリスト育成：総務・経理・医事の横断経験</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>評価制度：業務改善提案を加点評価</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                      <span>システム化推進：RPA導入による効率化</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4 text-purple-800">よくある質問（FAQ）</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-bold text-sm mb-1">Q: 属人化解消はどのように進めればよいですか？</h4>
                  <p className="text-xs text-gray-600">
                    A: まず業務の棚卸しを行い、特定職員にしかできない業務を特定します。
                    次にマニュアル化・標準化を進め、複数名で対応できる体制を構築します。
                  </p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-bold text-sm mb-1">Q: 中位層の育成はなぜ重要ですか？</h4>
                  <p className="text-xs text-gray-600">
                    A: 組織の6割を占める中位層が組織の実力を決定します。
                    上位2割に依存すると属人化リスクが高まり、中位層の底上げが安定的な組織運営につながります。
                  </p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-bold text-sm mb-1">Q: 副業申請の判断基準は？</h4>
                  <p className="text-xs text-gray-600">
                    A: 本業への影響、利益相反の有無、情報漏洩リスクの3点を確認します。
                    医療従事者の社会貢献活動（講師等）は積極的に容認します。
                  </p>
                </div>
              </div>
            </div>

            {/* テンプレート・ツール */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-purple-800">ダウンロード可能なツール</h3>
              <div className="grid grid-cols-3 gap-4">
                <button className="bg-purple-100 hover:bg-purple-200 p-3 rounded text-center transition-colors">
                  <FileText className="mx-auto mb-2 text-purple-600" size={24} />
                  <div className="text-xs font-semibold">面談記録シート</div>
                </button>
                <button className="bg-purple-100 hover:bg-purple-200 p-3 rounded text-center transition-colors">
                  <ClipboardList className="mx-auto mb-2 text-purple-600" size={24} />
                  <div className="text-xs font-semibold">評価基準表</div>
                </button>
                <button className="bg-purple-100 hover:bg-purple-200 p-3 rounded text-center transition-colors">
                  <Database className="mx-auto mb-2 text-purple-600" size={24} />
                  <div className="text-xs font-semibold">職員カルテ様式</div>
                </button>
              </div>
            </div>

            {/* キャリアステップ体系 */}
            <div className="mt-8 border-t-2 border-purple-200 pt-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
                医療法人厚生会 キャリアステップ体系
              </h2>
              <p className="text-center text-gray-600 mb-6">
                ～退職率を低下させ、職員と共に成長する組織へ～
              </p>

              {/* 基本方針 */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-bold mb-3 text-purple-800">基本方針</h3>
                <p className="text-sm text-gray-700">
                  「30歳でコア人材として活躍できる」明確な道筋を示し、
                  8年間の成長ストーリーを通じて職員の定着と成長を実現します。
                </p>
              </div>

              {/* キャリアステップの全体像 */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-bold mb-4 text-purple-800">入職～30歳までのコア人材育成ロードマップ</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* 新卒入職者 */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">新卒入職者の場合</h4>
                    <div className="space-y-2">
                      {[
                        { age: '22歳', stage: '入職', desc: '基礎習得期（1-2年）' },
                        { age: '24歳', stage: '', desc: '実務習熟期（3-4年）' },
                        { age: '26歳', stage: '', desc: 'リーダー候補期（5-6年）' },
                        { age: '28歳', stage: '', desc: '管理職準備期（7-8年）' },
                        { age: '30歳', stage: 'コア人材', desc: '部門の中核へ' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold w-16">
                            {item.age}
                          </div>
                          <ArrowRight className="mx-2 text-blue-400" size={16} />
                          <div className="flex-1 text-sm">
                            {item.stage && <span className="font-bold">{item.stage} </span>}
                            {item.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 中途入職者 */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">中途入職者の場合</h4>
                    <div className="text-sm space-y-2">
                      <p>• 入職時の年齢・経験により個別設定</p>
                      <p>• 最短3年でコア人材認定可能</p>
                      <p>• 前職経験を考慮した育成プログラム</p>
                      <p>• スペシャリストからゼネラリストへの転換支援</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 階層別キャリアステップ */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-bold mb-4 text-purple-800">階層別キャリアステップ</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      stage: '第1段階：基礎習得期（入職1-2年）',
                      color: 'blue',
                      goals: ['基本業務の独力遂行', '組織文化・理念の理解', 'チームメンバーとしての役割認識'],
                      experience: ['オペレーション業務の習得', 'マニュアルに基づく業務遂行', '先輩職員からのOJT'],
                      evaluation: 'プロセス評価80%、成果評価20%'
                    },
                    {
                      stage: '第2段階：実務習熟期（入職3-4年）',
                      color: 'green',
                      goals: ['複数業務の並行処理', '後輩指導の実践', '改善提案の実施'],
                      experience: ['プリセプターとしての新人指導', '業務改善プロジェクトへの参画', '他部署との連携業務'],
                      evaluation: 'プロセス評価60%、成果評価40%'
                    },
                    {
                      stage: '第3段階：リーダー候補期（入職5-6年）',
                      color: 'orange',
                      goals: ['チームリーダーとしての実績', '部門間調整能力', '問題解決能力の確立'],
                      experience: ['チームリーダー経験（6ヶ月以上）', 'ジョブローテーション（他部門経験）', '外部研修への参加'],
                      evaluation: '主任職への昇格候補'
                    },
                    {
                      stage: '第4段階：管理職準備期（入職7-8年）',
                      color: 'purple',
                      goals: ['マネジメントスキルの習得', '経営視点の獲得', '人材育成能力の確立'],
                      experience: ['係長職としての部門運営', '予算管理の実践', '採用面接への参画'],
                      evaluation: '課長職への昇格準備'
                    },
                    {
                      stage: '第5段階：コア人材（30歳～）',
                      color: 'red',
                      goals: ['部門の中核として事業を牽引', '次世代育成の責任者', '経営層との架け橋'],
                      experience: ['管理職コース（部長・事業部長）', '専門職コース（エキスパート）', '経営幹部コース（役員候補）'],
                      evaluation: 'キャリアオプションの選択'
                    }
                  ].map((item, index) => (
                    <div key={index} className={`border-l-4 border-${item.color}-500 pl-4 bg-${item.color}-50 p-4 rounded`}>
                      <h4 className={`font-bold text-${item.color}-800 mb-2`}>{item.stage}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <h5 className="font-semibold mb-1">到達目標</h5>
                          <ul className="text-xs space-y-1">
                            {item.goals.map((goal, i) => (
                              <li key={i}>• {goal}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1">必須経験</h5>
                          <ul className="text-xs space-y-1">
                            {item.experience.map((exp, i) => (
                              <li key={i}>• {exp}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1">評価基準</h5>
                          <p className="text-xs">{item.evaluation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ゼネラリスト型キャリアパス */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-bold mb-4 text-purple-800">ゼネラリスト型キャリアパス</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">ジョブローテーション制度</h4>
                    <ul className="text-sm space-y-2">
                      <li>• 3-5年サイクルでの計画的異動</li>
                      <li>• 最低2部門以上の経験必須</li>
                      <li>• 本人希望と組織ニーズのマッチング</li>
                    </ul>
                    
                    <div className="mt-3 bg-gray-50 p-3 rounded">
                      <h5 className="font-semibold text-xs mb-2">医療部門スタート例</h5>
                      <div className="flex items-center text-xs">
                        <span className="bg-blue-100 px-2 py-1 rounded">医療</span>
                        <ArrowRight size={14} className="mx-1" />
                        <span className="bg-green-100 px-2 py-1 rounded">介護</span>
                        <ArrowRight size={14} className="mx-1" />
                        <span className="bg-purple-100 px-2 py-1 rounded">管理</span>
                        <ArrowRight size={14} className="mx-1" />
                        <span className="bg-red-100 px-2 py-1 rounded">医療（管理職）</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">必須スキル習得プログラム</h4>
                    <ul className="text-sm space-y-2">
                      <li>• 1-2年目：基礎研修（全職員共通）</li>
                      <li>• 3-4年目：リーダーシップ研修</li>
                      <li>• 5-6年目：マネジメント基礎研修</li>
                      <li>• 7年目以降：経営幹部研修</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 年収モデル */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-bold mb-4 text-purple-800">報酬との連動</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">年収モデルの明示</h4>
                    <div className="space-y-2">
                      {[
                        { age: '22歳', position: '新卒入職', salary: '350万円' },
                        { age: '25歳', position: '3年目', salary: '400万円' },
                        { age: '28歳', position: '主任昇格', salary: '450万円' },
                        { age: '30歳', position: '係長昇格', salary: '500万円' },
                        { age: '35歳', position: '課長昇格', salary: '600万円' },
                        { age: '40歳', position: '部長昇格', salary: '700万円' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 p-2 rounded">
                          <div className="flex items-center">
                            <span className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold mr-3">
                              {item.age}
                            </span>
                            <span className="text-sm">{item.position}</span>
                          </div>
                          <span className="font-bold text-indigo-600">{item.salary}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">キャリア支援制度</h4>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded">
                        <h5 className="font-semibold text-sm mb-1">教育投資</h5>
                        <ul className="text-xs space-y-1">
                          <li>• 外部研修費用：年間10万円/人まで補助</li>
                          <li>• 資格取得支援：合格時全額補助</li>
                          <li>• 大学院進学支援：勤務調整・学費補助</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <h5 className="font-semibold text-sm mb-1">ワークライフバランス</h5>
                        <ul className="text-xs space-y-1">
                          <li>• 育児・介護との両立支援</li>
                          <li>• 短時間勤務制度</li>
                          <li>• 在宅勤務制度（管理部門）</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 退職率低下への具体策 */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-bold mb-4 text-red-800">退職率低下への具体策</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-2 text-sm">「30歳でコア」という明確な目標</h4>
                    <ul className="text-xs space-y-1">
                      <li>• 8年間の成長ストーリー明示</li>
                      <li>• 同期との切磋琢磨環境</li>
                      <li>• 確実なステップアップ保証</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-2 text-sm">若手登用の積極推進</h4>
                    <ul className="text-xs space-y-1">
                      <li>• 実力主義と年功序列のバランス</li>
                      <li>• 30歳での管理職登用</li>
                      <li>• 失敗を許容する文化</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-2 text-sm">継続的な対話</h4>
                    <ul className="text-xs space-y-1">
                      <li>• 退職リスクの早期発見</li>
                      <li>• キャリア不安への対応</li>
                      <li>• 成長実感の共有</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* メッセージ */}
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4 text-purple-800 text-center">メッセージ</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-white rounded-full p-3 inline-block mb-2">
                      <Users className="text-purple-600" size={24} />
                    </div>
                    <h4 className="font-bold text-purple-800 mb-2">若手職員へ</h4>
                    <p className="text-xs">
                      「30歳でコア人材」は夢ではありません。明確なステップを示し、必要な支援を約束します。
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-full p-3 inline-block mb-2">
                      <Briefcase className="text-indigo-600" size={24} />
                    </div>
                    <h4 className="font-bold text-indigo-800 mb-2">管理職へ</h4>
                    <p className="text-xs">
                      部下のキャリア形成は管理職の最重要責務です。一人ひとりの成長に責任を持ってください。
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-full p-3 inline-block mb-2">
                      <Heart className="text-purple-600" size={24} />
                    </div>
                    <h4 className="font-bold text-purple-800 mb-2">全職員へ</h4>
                    <p className="text-xs">
                      このキャリアステップは「生きた制度」です。皆様の声を反映しながら進化させていきます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'department' && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">部門実行計画</h2>
            
            {/* フェーズ切り替え */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-orange-800">実施フェーズ</h3>
                <div className="flex space-x-2">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-semibold">
                    準備室段階：2025年7月〜2026年3月
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">
                    本稼働：2026年4月〜
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center">
                  <div className="flex-1 bg-orange-200 h-2 rounded-l"></div>
                  <div className="flex-1 bg-gray-200 h-2 rounded-r"></div>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white border-2 border-orange-600 rounded-full p-2">
                    <ArrowRight className="text-orange-600" size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* 4部門の実行計画 */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* 人財採用戦略部門 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <UserCheck className="text-blue-600 mr-2" size={24} />
                  <h3 className="text-lg font-bold">人財採用戦略部門</h3>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-600">リーダー：平岡 明彦（理学療法士）</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-blue-800">継続的取り組み事項</h4>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>養成校との関係継続・強化の具体策</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>採用プロセスの標準化</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>年間採用スケジュールの詳細化</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-700">2025年度重点施策</h4>
                    <div className="bg-blue-50 p-3 rounded text-xs">
                      <ul className="space-y-1">
                        <li>• 養成校訪問（月2回）</li>
                        <li>• 採用パンフレット作成</li>
                        <li>• Web採用サイト構築</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-700">KPI</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-semibold">採用充足率</div>
                        <div className="text-lg font-bold text-blue-600">85%</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-semibold">定着率</div>
                        <div className="text-lg font-bold text-green-600">90%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 教育体制構築部門 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <GraduationCap className="text-green-600 mr-2" size={24} />
                  <h3 className="text-lg font-bold">教育体制構築部門</h3>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-600">リーダー：永江 由貴乃（副総師長・特定看護師）</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-green-800">継続的取り組み事項</h4>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>研修制度の詳細設計</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>評価制度・面談制度の具体的運用</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>各職種別の教育カリキュラム作成</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-700">2025年度重点施策</h4>
                    <div className="bg-green-50 p-3 rounded text-xs">
                      <ul className="space-y-1">
                        <li>• 階層別研修プログラム開発</li>
                        <li>• e-ラーニングシステム導入</li>
                        <li>• 評価者研修実施（月1回）</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-700">KPI</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-semibold">研修受講率</div>
                        <div className="text-lg font-bold text-green-600">100%</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-semibold">満足度</div>
                        <div className="text-lg font-bold text-blue-600">4.2/5</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* コンサルカウンター部門 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <MessageCircle className="text-purple-600 mr-2" size={24} />
                  <h3 className="text-lg font-bold">コンサルカウンター部門</h3>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-600">リーダー：橋口 由佳（看護師・地域包括ケア病棟）</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-purple-800">継続的取り組み事項</h4>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>職員相談窓口の運営マニュアル</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>現場ニーズ収集の仕組み化</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>キャリア相談の標準プロセス</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-700">2025年度重点施策</h4>
                    <div className="bg-purple-50 p-3 rounded text-xs">
                      <ul className="space-y-1">
                        <li>• 全職員面談実施（300名）</li>
                        <li>• 相談記録DB構築</li>
                        <li>• キャリアパス説明会（月1回）</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-700">KPI</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-semibold">相談対応数</div>
                        <div className="text-lg font-bold text-purple-600">50件/月</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-semibold">解決率</div>
                        <div className="text-lg font-bold text-green-600">75%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 業務革新部門 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Database className="text-amber-600 mr-2" size={24} />
                  <h3 className="text-lg font-bold">業務革新部門</h3>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-600">リーダー：前田 幸明（理学療法士）</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-amber-800">継続的取り組み事項</h4>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>職員カルテシステムの構築スケジュール</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>データ分析指標の明確化</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                        <span>属人化業務の可視化方法</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-700">2025年度重点施策</h4>
                    <div className="bg-amber-50 p-3 rounded text-xs">
                      <ul className="space-y-1">
                        <li>• 職員カルテシステム設計</li>
                        <li>• 属人化業務の棚卸し</li>
                        <li>• マニュアル整備率向上</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-700">KPI</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-semibold">システム化率</div>
                        <div className="text-lg font-bold text-amber-600">60%</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-semibold">属人化解消</div>
                        <div className="text-lg font-bold text-red-600">30%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 年間スケジュール */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4 text-orange-800">年間マイルストーン</h3>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                <div className="space-y-4 ml-6">
                  <div className="flex items-start">
                    <div className="absolute left-0 w-3 h-3 bg-orange-600 rounded-full -ml-7 mt-1"></div>
                    <div className="bg-orange-50 p-3 rounded flex-1">
                      <div className="font-bold text-sm">2025年7-9月：現状把握フェーズ</div>
                      <ul className="text-xs mt-1 text-gray-600">
                        <li>• 各部門の業務棚卸し</li>
                        <li>• 属人化業務の特定</li>
                        <li>• 現場ヒアリング実施</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="absolute left-0 w-3 h-3 bg-orange-600 rounded-full -ml-7 mt-1"></div>
                    <div className="bg-orange-50 p-3 rounded flex-1">
                      <div className="font-bold text-sm">2025年10-12月：制度設計フェーズ</div>
                      <ul className="text-xs mt-1 text-gray-600">
                        <li>• 評価制度の詳細設計</li>
                        <li>• 給与体系の見直し案作成</li>
                        <li>• 教育プログラムの開発</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="absolute left-0 w-3 h-3 bg-orange-600 rounded-full -ml-7 mt-1"></div>
                    <div className="bg-orange-50 p-3 rounded flex-1">
                      <div className="font-bold text-sm">2026年1-3月：試行運用フェーズ</div>
                      <ul className="text-xs mt-1 text-gray-600">
                        <li>• パイロット部門での試行</li>
                        <li>• フィードバック収集</li>
                        <li>• 本格運用への改善</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="absolute left-0 w-3 h-3 bg-blue-600 rounded-full -ml-7 mt-1"></div>
                    <div className="bg-blue-50 p-3 rounded flex-1">
                      <div className="font-bold text-sm">2026年4月〜：本稼働フェーズ</div>
                      <ul className="text-xs mt-1 text-gray-600">
                        <li>• 人事部として正式発足</li>
                        <li>• 全部門での制度運用開始</li>
                        <li>• 継続的改善の実施</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 進捗ダッシュボード */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-orange-800">全体進捗ダッシュボード</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="relative">
                    <svg className="w-20 h-20 mx-auto">
                      <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36 * 0.85} ${2 * Math.PI * 36}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">85%</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold mt-2">採用体制</div>
                </div>
                <div className="text-center">
                  <div className="relative">
                    <svg className="w-20 h-20 mx-auto">
                      <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="36" stroke="#10b981" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36 * 0.70} ${2 * Math.PI * 36}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">70%</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold mt-2">教育制度</div>
                </div>
                <div className="text-center">
                  <div className="relative">
                    <svg className="w-20 h-20 mx-auto">
                      <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="36" stroke="#8b5cf6" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36 * 0.60} ${2 * Math.PI * 36}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">60%</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold mt-2">相談体制</div>
                </div>
                <div className="text-center">
                  <div className="relative">
                    <svg className="w-20 h-20 mx-auto">
                      <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="36" stroke="#f59e0b" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36 * 0.45} ${2 * Math.PI * 36}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">45%</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold mt-2">システム化</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'department' && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">人事部門実行計画</h2>
            
            {/* フェーズ管理 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4 text-orange-800">実施フェーズ</h3>
              <div className="relative">
                <div className="flex justify-between mb-4">
                  <div className="text-center flex-1">
                    <div className="bg-orange-100 rounded-lg p-3">
                      <div className="font-bold text-sm">準備室フェーズ</div>
                      <div className="text-xs text-gray-600">2025年7月～2026年3月</div>
                      <div className="text-xs mt-1">基盤構築・制度設計</div>
                    </div>
                  </div>
                  <div className="flex items-center px-2">
                    <ArrowRight className="text-orange-400" size={20} />
                  </div>
                  <div className="text-center flex-1">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="font-bold text-sm">本稼働初期</div>
                      <div className="text-xs text-gray-600">2026年4月～2027年3月</div>
                      <div className="text-xs mt-1">制度運用・定着</div>
                    </div>
                  </div>
                  <div className="flex items-center px-2">
                    <ArrowRight className="text-blue-400" size={20} />
                  </div>
                  <div className="text-center flex-1">
                    <div className="bg-green-100 rounded-lg p-3">
                      <div className="font-bold text-sm">成熟期</div>
                      <div className="text-xs text-gray-600">2027年4月～</div>
                      <div className="text-xs mt-1">継続的改善・変革</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4部門の実行計画 */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* 人財採用戦略部門 */}
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-green-600 text-white rounded-full p-2 mr-3">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800">人財採用戦略部門</h3>
                    <p className="text-xs text-gray-600">リーダー：平岡明彦（理学療法士）</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-green-400 pl-3">
                    <h4 className="font-bold text-sm mb-2">準備室期間の重点事項</h4>
                    <ul className="text-xs space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={10} />
                        <span>養成校10校との関係構築・維持</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={10} />
                        <span>採用プロセスの標準化（マニュアル作成）</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={10} />
                        <span>採用管理システムの選定・導入</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-3">
                    <h4 className="font-bold text-sm mb-2">本稼働後の継続業務</h4>
                    <ul className="text-xs space-y-1">
                      <li>• 年間採用計画の策定・実行（新卒40名/中途60名）</li>
                      <li>• 採用説明会の企画・運営（年6回）</li>
                      <li>• 採用コスト管理（前年比10%削減目標）</li>
                      <li>• 採用充足率100%の達成</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs font-bold mb-1">年間KPI</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>採用充足率：100%</div>
                      <div>新卒定着率：80%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 教育体制構築部門 */}
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-600 text-white rounded-full p-2 mr-3">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-800">教育体制構築部門</h3>
                    <p className="text-xs text-gray-600">リーダー：永江由貴乃（副総師長・特定看護師）</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-indigo-400 pl-3">
                    <h4 className="font-bold text-sm mb-2">準備室期間の重点事項</h4>
                    <ul className="text-xs space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-indigo-500 flex-shrink-0" size={10} />
                        <span>階層別研修プログラムの設計</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-indigo-500 flex-shrink-0" size={10} />
                        <span>評価制度の詳細設計（バランス型評価）</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-indigo-500 flex-shrink-0" size={10} />
                        <span>職種別教育カリキュラムの作成</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-3">
                    <h4 className="font-bold text-sm mb-2">本稼働後の継続業務</h4>
                    <ul className="text-xs space-y-1">
                      <li>• 新入職員研修の実施（年2回・3ヶ月プログラム）</li>
                      <li>• 中堅職員研修の運営（四半期ごと）</li>
                      <li>• ジョブローテーション計画の管理</li>
                      <li>• e-ラーニングシステムの運用</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs font-bold mb-1">年間KPI</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>研修受講率：100%</div>
                      <div>満足度：80点以上</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* コンサルカウンター部門 */}
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-600 text-white rounded-full p-2 mr-3">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-800">コンサルカウンター部門</h3>
                    <p className="text-xs text-gray-600">リーダー：橋口由佳（看護師・地域包括ケア病棟）</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-purple-400 pl-3">
                    <h4 className="font-bold text-sm mb-2">準備室期間の重点事項</h4>
                    <ul className="text-xs space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-purple-500 flex-shrink-0" size={10} />
                        <span>職員相談窓口の運営体制構築</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-purple-500 flex-shrink-0" size={10} />
                        <span>現場ニーズ調査（全部署ヒアリング）</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-purple-500 flex-shrink-0" size={10} />
                        <span>キャリア相談マニュアルの作成</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-3">
                    <h4 className="font-bold text-sm mb-2">本稼働後の継続業務</h4>
                    <ul className="text-xs space-y-1">
                      <li>• 職員相談窓口の常設運営（週5日）</li>
                      <li>• 定期面談の実施（全職員年2回）</li>
                      <li>• 離職防止プログラムの運用</li>
                      <li>• メンタルヘルス支援の提供</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs font-bold mb-1">年間KPI</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>相談対応率：100%</div>
                      <div>離職率：10%以下</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 業務革新部門 */}
              <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-600 text-white rounded-full p-2 mr-3">
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-800">業務革新部門</h3>
                    <p className="text-xs text-gray-600">リーダー：前田幸明（理学療法士）</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-amber-400 pl-3">
                    <h4 className="font-bold text-sm mb-2">準備室期間の重点事項</h4>
                    <ul className="text-xs space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-amber-500 flex-shrink-0" size={10} />
                        <span>職員カルテシステムの基本設計</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-amber-500 flex-shrink-0" size={10} />
                        <span>属人化業務の可視化（全部署調査）</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="mr-1 mt-0.5 text-amber-500 flex-shrink-0" size={10} />
                        <span>データ分析基盤の構築</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-3">
                    <h4 className="font-bold text-sm mb-2">本稼働後の継続業務</h4>
                    <ul className="text-xs space-y-1">
                      <li>• 職員データベースの運用・更新</li>
                      <li>• 人事KPIダッシュボードの管理</li>
                      <li>• 業務標準化の推進（マニュアル化率80%）</li>
                      <li>• RPA導入による業務効率化</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs font-bold mb-1">年間KPI</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>属人化率：20%以下</div>
                      <div>マニュアル化：80%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 年間スケジュール */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4 text-orange-800">準備室年間スケジュール（2025年7月～2026年3月）</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">月</th>
                      <th className="border p-2">人財採用戦略</th>
                      <th className="border p-2">教育体制構築</th>
                      <th className="border p-2">コンサルカウンター</th>
                      <th className="border p-2">業務革新</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 font-bold">7-9月</td>
                      <td className="border p-2">養成校訪問・関係構築</td>
                      <td className="border p-2">現行制度の課題分析</td>
                      <td className="border p-2">全部署ヒアリング</td>
                      <td className="border p-2">属人化業務調査</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border p-2 font-bold">10-12月</td>
                      <td className="border p-2">採用プロセス設計</td>
                      <td className="border p-2">新制度設計</td>
                      <td className="border p-2">相談窓口試行</td>
                      <td className="border p-2">システム基本設計</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-bold">1-3月</td>
                      <td className="border p-2">採用活動開始</td>
                      <td className="border p-2">研修プログラム作成</td>
                      <td className="border p-2">運用マニュアル完成</td>
                      <td className="border p-2">システム構築・テスト</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 進捗管理 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-orange-800">週次準備室会議アジェンダ</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-bold text-sm mb-2">定例報告事項</h4>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>各部門進捗報告（各5分）</li>
                    <li>課題・リスクの共有</li>
                    <li>法人連携事項の確認</li>
                    <li>次週アクションの確認</li>
                  </ol>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <h4 className="font-bold text-sm mb-2">月次レビュー項目</h4>
                  <ul className="text-xs space-y-1">
                    <li>• KPI達成状況の確認</li>
                    <li>• 予算執行状況</li>
                    <li>• スケジュール遅延の有無</li>
                    <li>• 法人への報告事項整理</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'message' && (
        <div className="bg-gradient-to-b from-red-50 to-white p-6 rounded-lg border border-red-200">
          <div className="max-w-4xl mx-auto">
            {/* ヘッダー */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-white rounded-full p-4 shadow-lg mb-4">
                <Heart className="text-red-600" size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2">医療法人厚生会 人事ポリシー</h2>
              <p className="text-lg text-gray-600">～経営者が語り継ぐ組織の未来像～</p>
            </div>

            {/* 私たちの信念 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-red-800">私たちの信念</h3>
                <p className="text-lg italic text-gray-700">
                  「強い組織は、社員の働く目的が明確であり、その実現方向に向けられている」
                </p>
              </div>
            </div>

            {/* 第1部：なぜ人事ポリシーを明確化するのか */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
                なぜ人事ポリシーを明確化するのか
              </h3>
              
              <div className="mb-4">
                <h4 className="font-bold text-lg mb-2">私たちが直面している現実</h4>
                <p className="text-gray-700 leading-relaxed">
                  医療・福祉業界は今、大きな転換期を迎えています。少子高齢化、人材不足、そして「選ばれる職場」でなければ生き残れない時代。
                  この現実に真正面から向き合い、持続可能な組織を創ることが、私たち経営層の責任です。
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-2">川畑統括事務局長の決意</h4>
                <p className="text-gray-700 italic">
                  「私は人事ポリシーを明確化することで、すべての職員に約束したい。
                  あなたたちの人生を大切にし、共に成長していく組織であることを」
                </p>
              </div>
            </div>

            {/* 第2部：厚生会が大切にする価値観 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
                厚生会が大切にする価値観
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                    <Users className="mr-2" size={20} />
                    1. 職員は「パートナー」である
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 単なる労働力ではない</li>
                    <li>• 共に組織の未来を創る仲間</li>
                    <li>• 一人ひとりの人生に寄り添う</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2 flex items-center">
                    <Heart className="mr-2" size={20} />
                    2. 「心がきれい」を最も重視する
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 能力は育てられるが、心は変えにくい</li>
                    <li>• 患者様・利用者様への真摯な姿勢</li>
                    <li>• チームを大切にする心</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-2 flex items-center">
                    <Target className="mr-2" size={20} />
                    3. 中位6割の職員こそが組織の実力
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• スーパースターに頼らない</li>
                    <li>• 普通の人が活躍できる仕組み</li>
                    <li>• 全員で支え合う組織文化</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 第3部：具体的な約束 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</span>
                具体的な約束
              </h3>

              <div className="space-y-4">
                {/* 給与・処遇への約束 */}
                <div className="border-l-4 border-amber-400 pl-4">
                  <h4 className="font-bold text-amber-800 mb-2">給与・処遇への約束</h4>
                  <div className="bg-amber-50 p-3 rounded mb-2">
                    <h5 className="font-semibold mb-1">「生活保障40%・精算価値40%・投資価値20%」</h5>
                    <ul className="text-sm text-gray-700">
                      <li>• まず、あなたとご家族の生活を守ります</li>
                      <li>• 頑張りは必ず評価します</li>
                      <li>• 未来への成長を支援します</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-3 rounded">
                    <h5 className="font-semibold mb-1">「業界平均以上の年収水準」</h5>
                    <ul className="text-sm text-gray-700">
                      <li>• 誇りを持って働ける処遇</li>
                      <li>• 地域でリーダーとなる組織として</li>
                    </ul>
                  </div>
                </div>

                {/* キャリアへの約束 */}
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-bold text-blue-800 mb-2">キャリアへの約束</h4>
                  <div className="bg-blue-50 p-3 rounded mb-2">
                    <h5 className="font-semibold mb-1">「長期雇用でライフサイクルに寄り添う」</h5>
                    <ul className="text-sm text-gray-700">
                      <li>• 20代の成長期から60代の円熟期まで</li>
                      <li>• 各年代に応じた役割と成長機会</li>
                      <li>• 安心して長く働ける環境</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <h5 className="font-semibold mb-1">「ゼネラリストとして幅広く成長」</h5>
                    <ul className="text-sm text-gray-700">
                      <li>• 様々な部門での経験機会</li>
                      <li>• 管理職への明確なキャリアパス</li>
                      <li>• 組織全体を理解できる人材へ</li>
                    </ul>
                  </div>
                </div>

                {/* 働き方への約束 */}
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-bold text-green-800 mb-2">働き方への約束</h4>
                  <div className="bg-green-50 p-3 rounded mb-2">
                    <h5 className="font-semibold mb-1">「プロセスを大切に評価」</h5>
                    <ul className="text-sm text-gray-700">
                      <li>• 結果だけでなく努力を見ています</li>
                      <li>• 失敗を恐れずチャレンジできる</li>
                      <li>• 成長過程を共に歩む</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-semibold mb-1">「属人化を解消し、誰もが活躍」</h5>
                    <ul className="text-sm text-gray-700">
                      <li>• 特定の人に頼らない仕組み</li>
                      <li>• マニュアル化による品質保証</li>
                      <li>• チーム全体での成功</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 第4部：組織の未来像 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</span>
                組織の未来像
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">5年後の厚生会</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ すべての業務がマニュアル化され、誰でも対応可能</li>
                    <li>✓ 職員満足度が地域トップクラス</li>
                    <li>✓ 離職率10%以下の安定組織</li>
                    <li>✓ 新卒者が憧れる職場</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">10年後の厚生会</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ 地域医療・福祉のリーディングカンパニー</li>
                    <li>✓ 職員の子どもが入職を希望する組織</li>
                    <li>✓ 社会から尊敬される存在</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 第5部：経営者からのメッセージ */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">5</span>
                経営者からのメッセージ
              </h3>

              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3">川畑統括事務局長より</h4>
                <div className="text-gray-700 space-y-3 leading-relaxed">
                  <p>
                    「このポリシーは単なる文書ではありません。私たち経営層から職員の皆さんへの約束であり、
                    共に実現していく未来への道標です。
                  </p>
                  <p>
                    確かに、すぐには理想に到達できないかもしれません。しかし、一歩ずつ着実に前進していきます。
                    なぜなら、このポリシーは机上の空論ではなく、現場の声と経営の意志が融合した『生きた方針』だからです。
                  </p>
                  <p>
                    私は信じています。職員一人ひとりが幸せに働ける組織こそが、最高の医療・福祉サービスを提供できると。
                    そして、それが地域社会への最大の貢献になると。
                  </p>
                  <p className="font-bold text-red-800">
                    共に、この理想を現実にしていきましょう。」
                  </p>
                </div>
              </div>
            </div>

            {/* 実践への第一歩 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-red-800">実践への第一歩</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-bold text-orange-800 mb-2">今すぐ始めること</h4>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li>
                      <span className="font-semibold">1. 全職員への説明会開催</span>
                      <span className="text-xs block text-gray-600">（1ヶ月以内）</span>
                    </li>
                    <li>
                      <span className="font-semibold">2. 業務マニュアル化プロジェクト開始</span>
                      <span className="text-xs block text-gray-600">（3ヶ月以内）</span>
                    </li>
                    <li>
                      <span className="font-semibold">3. 新評価制度の試行開始</span>
                      <span className="text-xs block text-gray-600">（6ヶ月以内）</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-2">継続的な対話</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 月1回の部門別対話会</li>
                    <li>• 四半期ごとの全体進捗共有</li>
                    <li>• 年1回のポリシー見直し</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* フッターメッセージ */}
            <div className="text-center py-8 border-t-2 border-red-200">
              <p className="text-lg font-bold text-red-800 mb-2">
                このポリシーは、全職員と共に育てていく「生きた文書」です。
              </p>
              <p className="text-gray-600">
                皆様のご意見・ご提案を心よりお待ちしています。
              </p>
              <div className="mt-4">
                <p className="font-bold">医療法人厚生会</p>
                <p>統括事務局長　川畑</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recruitment' && (
        <div className="bg-gradient-to-b from-indigo-50 to-white p-6 rounded-lg border border-indigo-200">
          <div className="max-w-5xl mx-auto">
            {/* ヘッダー */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-white rounded-full p-4 shadow-lg mb-4">
                <UserCheck className="text-indigo-600" size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2">医療法人厚生会「求める人材像」採用基準書</h2>
              <p className="text-lg text-gray-600">人事ポリシーは既存の社員だけではなく、採用場面で伝えていくことが大切です</p>
            </div>

            {/* 1. 求める人材像の明確化 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-indigo-800 flex items-center">
                <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
                求める人材像の明確化
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {/* 理念共感 */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-bold text-red-800 mb-2 flex items-center">
                    <Star className="mr-2 text-red-500" size={18} />
                    【理念共感】必須項目
                  </h4>
                  <div className="bg-red-50 p-3 rounded">
                    <h5 className="font-semibold mb-2">「心がきれい」という基本資質</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 患者様・利用者様への真摯な姿勢</li>
                      <li>• チームを大切にする協調性</li>
                      <li>• 誠実で素直な人間性</li>
                    </ul>
                  </div>
                </div>

                {/* 就業観 */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-bold text-green-800 mb-2 flex items-center">
                    <Lightbulb className="mr-2 text-green-500" size={18} />
                    【就業観】共通項目
                  </h4>
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-semibold mb-2">「明るく、元気で、素直」</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• ポジティブな姿勢で仕事に取り組める</li>
                      <li>• 学習意欲があり成長できる</li>
                      <li>• 組織文化に適応できる柔軟性</li>
                    </ul>
                  </div>
                </div>

                {/* 仕事型モチベーション */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                    <Target className="mr-2 text-blue-500" size={18} />
                    【仕事型モチベーション】共通項目
                  </h4>
                  <div className="bg-blue-50 p-3 rounded">
                    <h5 className="font-semibold mb-2">「プロセス重視・長期的視点」</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 10年程度の勤続を想定できること</li>
                      <li>• 即効性より着実な成長を重視</li>
                      <li>• チーム成果への貢献意識</li>
                    </ul>
                  </div>
                </div>

                {/* キャリア志向 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-purple-800 mb-2">【キャリア志向】新卒採用</h4>
                    <div className="bg-purple-50 p-3 rounded text-sm">
                      <ul className="space-y-1">
                        <li>• 「白いキャンバス」として育成可能</li>
                        <li>• コア志向（長期的にゼネラリストとして成長）</li>
                        <li>• 将来の管理職候補</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-800 mb-2">【キャリア志向】中途採用</h4>
                    <div className="bg-orange-50 p-3 rounded text-sm">
                      <ul className="space-y-1">
                        <li>• 専門性と即戦力のバランス</li>
                        <li>• 組織文化への適応力</li>
                        <li>• スペシャリストからゼネラリストへの転換可能性</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 採用選考での評価基準 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-indigo-800 flex items-center">
                <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
                採用選考での評価基準
              </h3>

              <div className="space-y-4">
                {/* 第1次選考 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">第1次選考（書類審査）</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 志望動機に理念への共感があるか</li>
                    <li>• 長期的なキャリアビジョンがあるか</li>
                    <li>• 基本的な文章力・表現力</li>
                  </ul>
                </div>

                {/* 第2次選考 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-3">第2次選考（人事面接）</h4>
                  <div className="bg-white rounded p-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">評価項目</th>
                          <th className="text-center py-2">配点</th>
                          <th className="text-left py-2">重点確認事項</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">人間性・心のきれいさ</td>
                          <td className="text-center py-2 font-bold text-red-600">40%</td>
                          <td className="py-2">誠実性、素直さ、思いやり</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">協調性・チームワーク</td>
                          <td className="text-center py-2 font-bold text-blue-600">30%</td>
                          <td className="py-2">過去の集団活動経験、役割意識</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">成長意欲・学習姿勢</td>
                          <td className="text-center py-2 font-bold text-green-600">20%</td>
                          <td className="py-2">困難を乗り越えた経験、継続力</td>
                        </tr>
                        <tr>
                          <td className="py-2">コミュニケーション力</td>
                          <td className="text-center py-2 font-bold text-purple-600">10%</td>
                          <td className="py-2">傾聴力、表現力、理解力</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 第3次・最終選考 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">第3次選考（現場責任者面接）</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 業務理解度</li>
                      <li>• 専門知識・スキル（中途のみ）</li>
                      <li>• 現場での適応可能性</li>
                      <li>• ストレス耐性</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">最終選考（経営層面接）</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 理念・ビジョンへの共感度</li>
                      <li>• 長期雇用への意欲</li>
                      <li>• 組織への貢献意識</li>
                      <li>• 「パートナー」としての資質</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 面接での確認ポイント */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-indigo-800 flex items-center">
                <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</span>
                面接での確認ポイント
              </h3>

              <div className="space-y-3">
                {[
                  {
                    category: '理念共感の確認',
                    question: 'なぜ医療・福祉業界を選んだのですか？',
                    purpose: '「心がきれい」の確認',
                    color: 'red'
                  },
                  {
                    category: '長期雇用意向の確認',
                    question: '10年後、どのような仕事をしていたいですか？',
                    purpose: 'キャリアビジョンと組織への定着意向',
                    color: 'blue'
                  },
                  {
                    category: 'チームワーク経験の確認',
                    question: 'これまでチームで取り組んだ経験を教えてください',
                    purpose: '協調性と役割意識',
                    color: 'green'
                  },
                  {
                    category: '困難克服経験の確認',
                    question: '最も苦労した経験とその乗り越え方を教えてください',
                    purpose: 'ストレス耐性と成長力',
                    color: 'purple'
                  },
                  {
                    category: '学習姿勢の確認',
                    question: '最近学んでいることや興味があることは？',
                    purpose: '成長意欲と自己研鑽',
                    color: 'orange'
                  }
                ].map((item, index) => (
                  <div key={index} className={`bg-${item.color}-50 p-3 rounded-lg border-l-4 border-${item.color}-500`}>
                    <div className="font-bold text-sm text-gray-800 mb-1">{item.category}</div>
                    <div className="text-sm mb-1">Q: 「{item.question}」</div>
                    <div className="text-xs text-gray-600">→ {item.purpose}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. 採用広報での訴求ポイント */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-indigo-800 flex items-center">
                <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</span>
                採用広報での訴求ポイント
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">組織の約束</h4>
                  <ul className="text-xs space-y-1">
                    <li>• 長期雇用でライフサイクルに寄り添う</li>
                    <li>• 業界平均以上の年収水準</li>
                    <li>• 生活保障を基盤とした安定雇用</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">求める人材像の明記</h4>
                  <ul className="text-xs space-y-1">
                    <li>• 「心がきれい」で素直な方</li>
                    <li>• 10年以上長く働きたい方</li>
                    <li>• チームで協力して成長したい方</li>
                    <li>• ゼネラリストとして幅広く活躍したい方</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-2">キャリアパスの提示</h4>
                  <ul className="text-xs space-y-1">
                    <li>• ジョブローテーションによる成長機会</li>
                    <li>• 管理職への明確な道筋</li>
                    <li>• 教育研修制度の充実</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. 採用後のフォロー体制 */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-indigo-800 flex items-center">
                <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">5</span>
                採用後のフォロー体制
              </h3>

              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-indigo-300"></div>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-indigo-600 text-white rounded-full w-16 h-8 flex items-center justify-center text-xs font-bold mr-4">
                      入職前
                    </div>
                    <div className="bg-indigo-50 p-3 rounded flex-1">
                      <ul className="text-sm space-y-1">
                        <li>• 人事ポリシーの説明と理解促進</li>
                        <li>• 組織文化の事前共有</li>
                        <li>• 期待役割の明確化</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-600 text-white rounded-full w-16 h-8 flex items-center justify-center text-xs font-bold mr-4">
                      3ヶ月
                    </div>
                    <div className="bg-indigo-50 p-3 rounded flex-1">
                      <ul className="text-sm space-y-1">
                        <li>• 理念研修の実施</li>
                        <li>• メンター制度による支援</li>
                        <li>• 定期面談での適応確認</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-600 text-white rounded-full w-16 h-8 flex items-center justify-center text-xs font-bold mr-4">
                      1年後
                    </div>
                    <div className="bg-indigo-50 p-3 rounded flex-1">
                      <ul className="text-sm space-y-1">
                        <li>• キャリアプラン面談</li>
                        <li>• 成長度合いの評価</li>
                        <li>• 長期定着に向けた支援</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. 採用KPI */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4 text-indigo-800 flex items-center">
                <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">6</span>
                採用KPI
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">採用の質的指標</h4>
                  <div className="space-y-2">
                    {[
                      { label: '3年定着率', target: '80%以上', current: '75%', color: 'blue' },
                      { label: '試用期間での離職率', target: '5%以下', current: '3%', color: 'green' },
                      { label: '入職1年後の満足度', target: '70点以上', current: '68点', color: 'purple' }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded flex items-center justify-between">
                        <span className="text-sm font-semibold">{item.label}</span>
                        <div className="flex items-center">
                          <span className={`text-sm text-${item.color}-600 font-bold mr-2`}>{item.current}</span>
                          <span className="text-xs text-gray-500">/ {item.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">採用の量的指標</h4>
                  <div className="space-y-2">
                    {[
                      { label: '採用充足率', target: '100%', current: '85%', color: 'orange' },
                      { label: '新卒：中途比率', target: '4：6', current: '3：7', color: 'indigo' },
                      { label: '部門別必要人員', target: '100%', current: '90%', color: 'red' }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded flex items-center justify-between">
                        <span className="text-sm font-semibold">{item.label}</span>
                        <div className="flex items-center">
                          <span className={`text-sm text-${item.color}-600 font-bold mr-2`}>{item.current}</span>
                          <span className="text-xs text-gray-500">/ {item.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* メッセージ */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Briefcase className="mr-2" size={20} />
                  採用担当者へ
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  この採用基準は、川畑統括事務局長の人事ポリシーを具現化したものです。
                  単に「優秀な人材」を求めるのではなく、「共に成長できるパートナー」を見つけることが私たちの使命です。
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <Heart className="mr-2" size={20} />
                  応募者へ
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  私たちは「心がきれい」で「素直」な方と、長く一緒に働きたいと考えています。
                  スキルは入職後に身につけることができますが、人間性は変えることが難しいからです。
                  あなたの人生に寄り添い、共に成長できる組織でありたいと願っています。
                </p>
              </div>
            </div>

            {/* 面接評価シート（ダウンロード可能） */}
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="font-bold text-gray-800 mb-4">採用ツールダウンロード</h3>
              <div className="grid grid-cols-3 gap-4">
                <button className="bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
                  <FileText className="mx-auto mb-2 text-indigo-600" size={24} />
                  <div className="text-sm font-semibold">面接評価シート</div>
                </button>
                <button className="bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
                  <ClipboardList className="mx-auto mb-2 text-indigo-600" size={24} />
                  <div className="text-sm font-semibold">質問項目リスト</div>
                </button>
                <button className="bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
                  <CheckCircle className="mx-auto mb-2 text-indigo-600" size={24} />
                  <div className="text-sm font-semibold">選考チェックリスト</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KouseikaiHRPolicyIntegrated;e' },
                      { label: '試用期間での離職率', target: '5%以下', current: '3%', color: 'green' },
                      { label: '入職1年後の満足度', target: '70点以上', current: '68点', color: 'purple' }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded flex items-center justify-between">
                        <span className="text-sm font-semibold">{item.label}</span>
                        <div className="flex items-center">
                          <span className={`text-sm text-${item.color}-600 font-bold mr-2`}>{item.current}</span>
                          <span className="text-xs text-gray-500">/ {item.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">採用の量的指標</h4>
                  <div className="space-y-2">
                    {[
                      { label: '採用充足率', target: '100%', current: '85%', color: 'orange' },
                      { label: '新卒：中途比率', target: '4：6', current: '3：7', color: 'indigo' },
                      { label: '部門別必要人員', target: '100%', current: '90%', color: 'red' }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded flex items-center justify-between">
                        <span className="text-sm font-semibold">{item.label}</span>
                        <div className="flex items-center">
                          <span className={`text-sm text-${item.color}-600 font-bold mr-2`}>{item.current}</span>
                          <span className="text-xs text-gray-500">/ {item.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* メッセージ */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Briefcase className="mr-2" size={20} />
                  採用担当者へ
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  この採用基準は、川畑統括事務局長の人事ポリシーを具現化したものです。
                  単に「優秀な人材」を求めるのではなく、「共に成長できるパートナー」を見つけることが私たちの使命です。
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <Heart className="mr-2" size={20} />
                  応募者へ
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  私たちは「心がきれい」で「素直」な方と、長く一緒に働きたいと考えています。
                  スキルは入職後に身につけることができますが、人間性は変えることが難しいからです。
                  あなたの人生に寄り添い、共に成長できる組織でありたいと願っています。
                </p>
              </div>
            </div>

            {/* 面接評価シート（ダウンロード可能） */}
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="font-bold text-gray-800 mb-4">採用ツールダウンロード</h3>
              <div className="grid grid-cols-3 gap-4">
                <button className="bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
                  <FileText className="mx-auto mb-2 text-indigo-600" size={24} />
                  <div className="text-sm font-semibold">面接評価シート</div>
                </button>
                <button className="bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
                  <ClipboardList className="mx-auto mb-2 text-indigo-600" size={24} />
                  <div className="text-sm font-semibold">質問項目リスト</div>
                </button>
                <button className="bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
                  <CheckCircle className="mx-auto mb-2 text-indigo-600" size={24} />
                  <div className="text-sm font-semibold">選考チェックリスト</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KouseikaiHRPolicyIntegrated;