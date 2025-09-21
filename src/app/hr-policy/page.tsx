'use client';

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
  Download, ClipboardList, Eye, Activity,
  AlertCircle, Edit3
} from 'lucide-react';

const KouseikaiHRPolicyDraft = () => {
  const [activePolicy, setActivePolicy] = useState('a');
  const [activeTab, setActiveTab] = useState('visual');

  // 最終更新日（実際の運用では、データベースやAPIから取得）
  const lastUpdated = '2025年9月18日';
  const updatedBy = '戦略企画・統括管理部門';
  const version = '1.0（案）';

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
      title: '労働組合・職員会',
      subtitle: '「職員会（親睦重視）」で一体感を醸成',
      icon: <Users className="text-lime-600" size={20} />,
      color: 'lime'
    },
    'p': {
      title: '事業利益の還元・投資',
      subtitle: '「投資40%・還元30%・内部留保30%」で持続可能性確保',
      icon: <CreditCard className="text-fuchsia-600" size={20} />,
      color: 'fuchsia'
    },
    'q': {
      title: '人材育成軸',
      subtitle: '「知識・技術・心のバランス」を重視',
      icon: <Heart className="text-stone-600" size={20} />,
      color: 'stone'
    },
    'r': {
      title: '組織形態',
      subtitle: '「機能別組織」で専門性を高める',
      icon: <Building className="text-red-600" size={20} />,
      color: 'red'
    },
    's': {
      title: '新卒・中途採用バランス',
      subtitle: '「新卒40%・中途60%」で活力と経験を両立',
      icon: <UserCheck className="text-yellow-600" size={20} />,
      color: 'yellow'
    }
  };

  // 完全版のpolicyDetails（人事部専用・全22項目）
  const policyDetails: { [key: string]: JSX.Element } = {};

  // 22項目すべての詳細説明を実装
  policyDetails['a'] = (
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
  );

  policyDetails['b'] = (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-bold text-green-800 mb-2">基本方針</h4>
        <p className="text-sm">
          厚生会では「仕事型」を基本としつつ、職員の多様なモチベーションを認めています。
          画一的な価値観の押し付けではなく、それぞれの動機を尊重します。
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
      <div className="bg-green-100 p-4 rounded-lg">
        <h4 className="font-bold text-green-900 mb-2">統一目標</h4>
        <p className="text-sm">
          「家族に誇れる職場」という共通目標に向かって、
          それぞれの動機を持つ職員が協力する組織を目指します。
        </p>
      </div>
    </div>
  );

  policyDetails['c'] = (
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
  );

  // d以降の詳細説明を追加
  policyDetails['d'] = (
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

  policyDetails['e'] = (
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
        <h4 className="font-bold text-amber-900 mb-2">戦略企画・統括管理部門の方針</h4>
        <p className="text-sm">
          「生活保障40%は法人の責務」という方針により、
          結婚・出産・子育て期の職員も安心して働けます。
        </p>
      </div>
    </div>
  );

  policyDetails['f'] = (
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
              <span className="font-semibold text-sm">新人、パート職員</span>
            </div>
            <p className="text-xs text-gray-600 ml-12">教育支援で中位層への押し上げを図る</p>
          </div>
        </div>
      </div>
      <div className="bg-indigo-100 p-4 rounded-lg">
        <h4 className="font-bold text-indigo-900 mb-2">医療の質の均一化</h4>
        <p className="text-sm">
          上位2割に依存しない体制を作ることで、どの時間帯・どの病棟でも
          一定水準の医療・介護サービスを提供できます。
        </p>
      </div>
    </div>
  );

  // g-j項目を追加
  policyDetails['g'] = (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-bold text-green-800 mb-2">処遇体系の設計思想</h4>
        <p className="text-sm mb-3">
          医療職は高度な専門知識と継続的な学習が必要な職種です。
          その努力に見合う安定した処遇と成長機会を提供します。
        </p>
        <div className="bg-white p-3 rounded">
          <h5 className="font-semibold text-sm mb-2">処遇構成</h5>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">基本生活保障</span>
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

  policyDetails['h'] = (
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

  policyDetails['i'] = (
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

  policyDetails['j'] = (
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

  // k-s項目を追加
  policyDetails['k'] = (
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

  policyDetails['l'] = (
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

  policyDetails['m'] = (
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

  policyDetails['n'] = (
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

  policyDetails['o'] = (
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

  policyDetails['p'] = (
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

  policyDetails['q'] = (
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

  policyDetails['r'] = (
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

  policyDetails['s'] = (
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ステータスバー（案）表示 */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="text-amber-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">
                    このページは現在検討中の（案）です
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    正式な承認を得るまで、内容は変更される可能性があります。
                    戦略企画・統括管理部門で検討中の内容です。
                  </p>
                </div>
                <div className="text-right ml-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-200 text-amber-800">
                    バージョン: {version}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-amber-600">
                <div className="flex items-center">
                  <Calendar className="mr-1" size={14} />
                  最終更新: {lastUpdated}
                </div>
                <div className="flex items-center">
                  <Edit3 className="mr-1" size={14} />
                  更新者: {updatedBy}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* ヘッダー */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-200">
            <div>
              <div className="text-sm text-gray-500 mb-1">医療法人厚生会</div>
              <h1 className="text-3xl font-bold text-gray-800">
                人事ポリシー統合管理システム
                <span className="ml-3 text-lg text-amber-600 font-normal">（案）</span>
              </h1>
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

          {/* コンテンツエリア */}
          {activeTab === 'visual' && (
            <div className="grid grid-cols-3 gap-6">
              {/* 左側：ポリシー選択メニュー */}
              <div className="col-span-1">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 text-white p-3">
                    <h3 className="text-lg font-bold">人事ポリシー項目</h3>
                  </div>
                  <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
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
                          <div className="mr-3 mt-0.5">{policies[key as keyof typeof policies].icon}</div>
                          <div className="flex-1">
                            <div className="font-bold text-sm mb-1">
                              {key.toUpperCase()}. {policies[key as keyof typeof policies].title}
                            </div>
                            <div className="text-xs text-gray-600">
                              {policies[key as keyof typeof policies].subtitle}
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
                      {policies[activePolicy as keyof typeof policies].icon}
                      <span className="ml-3">
                        {activePolicy.toUpperCase()}. {policies[activePolicy as keyof typeof policies].title}
                      </span>
                    </h2>
                    <p className="text-sm mt-1 opacity-90">
                      {policies[activePolicy as keyof typeof policies].subtitle}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                      <p className="text-sm text-yellow-800">
                        ※ この内容は検討中の（案）です。詳細は今後、戦略企画・統括管理部門との協議により確定します。
                      </p>
                    </div>
                    {policyDetails[activePolicy] || (
                      <div className="text-gray-600">
                        <p>このポリシーの詳細説明を準備中です。</p>
                        <p className="text-sm mt-2">順次、戦略企画・統括管理部門により内容を追加していきます。</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 公式文書タブ（完全版） */}
          {activeTab === 'document' && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="max-w-4xl mx-auto">
                {/* 公式文書ヘッダー */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold mb-2">医療法人厚生会 人事ポリシー</h2>
                    <p className="text-gray-600">～戦略企画・統括管理部門による人材マネジメント方針（案）～</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>策定日：2025年9月18日</span>
                    <span>策定責任者：戦略企画・統括管理部門</span>
                    <span>バージョン：1.0（案）</span>
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
                          <span>心重視の評価：患者様への思いやりを最重要視</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                          <span>長期雇用：安定した処遇で定着率向上</span>
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
                          <span>専門性重視：エキスパート型のキャリアパス</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                          <span>学会発表支援：専門職としての成長支援</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                          <span>副業容認：外部活動による専門性向上</span>
                        </li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded p-4">
                      <h4 className="font-bold text-sm mb-3 flex items-center">
                        <Briefcase className="mr-2 text-orange-600" size={16} />
                        事務部門
                      </h4>
                      <ul className="text-xs space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                          <span>ゼネラリスト育成：部署ローテーション必須</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                          <span>システム化推進：属人化解消の先導役</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="mr-1 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                          <span>マネジメント重視：管理職候補として育成</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 実装スケジュール */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h3 className="text-lg font-bold mb-4 text-purple-800">実装スケジュール（3段階展開）</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-400 pl-4">
                      <h4 className="font-bold text-sm text-blue-800">Phase 1：基盤構築（2025年10月〜12月）</h4>
                      <ul className="text-xs mt-2 space-y-1">
                        <li>• 人事制度設計とシステム準備</li>
                        <li>• 管理職への説明会実施</li>
                        <li>• 評価基準の明文化</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4">
                      <h4 className="font-bold text-sm text-green-800">Phase 2：試行導入（2026年1月〜3月）</h4>
                      <ul className="text-xs mt-2 space-y-1">
                        <li>• 一部部署での先行実施</li>
                        <li>• フィードバック収集と改善</li>
                        <li>• 職員向け説明会開催</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-bold text-sm text-purple-800">Phase 3：本格運用（2026年4月〜）</h4>
                      <ul className="text-xs mt-2 space-y-1">
                        <li>• 全部署での一斉運用開始</li>
                        <li>• 継続的な改善とブラッシュアップ</li>
                        <li>• 成果測定と次期計画策定</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 運用ツール */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4 text-purple-800">運用支援ツール</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center bg-blue-50 p-4 rounded">
                      <FileText className="mx-auto mb-2 text-blue-600" size={24} />
                      <h4 className="font-bold text-sm mb-1">評価シート</h4>
                      <p className="text-xs text-gray-600">22項目対応の統一評価フォーマット</p>
                    </div>
                    <div className="text-center bg-green-50 p-4 rounded">
                      <BarChart3 className="mx-auto mb-2 text-green-600" size={24} />
                      <h4 className="font-bold text-sm mb-1">進捗管理</h4>
                      <p className="text-xs text-gray-600">部門別実装状況の可視化ダッシュボード</p>
                    </div>
                    <div className="text-center bg-purple-50 p-4 rounded">
                      <Users className="mx-auto mb-2 text-purple-600" size={24} />
                      <h4 className="font-bold text-sm mb-1">研修資料</h4>
                      <p className="text-xs text-gray-600">管理職・一般職員向けの教育コンテンツ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'department' && (
            <div className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <Users className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-xl font-semibold mb-2">部門実行計画</h3>
                  <p className="text-sm text-gray-600">各部署の具体的な実行計画</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { dept: '看護部', color: 'bg-red-50 border-red-200', icon: '🏥' },
                    { dept: '医事課', color: 'bg-blue-50 border-blue-200', icon: '📋' },
                    { dept: 'リハビリ部門', color: 'bg-green-50 border-green-200', icon: '🤸' },
                    { dept: '介護部門', color: 'bg-yellow-50 border-yellow-200', icon: '🤝' },
                    { dept: '薬剤部', color: 'bg-purple-50 border-purple-200', icon: '💊' },
                    { dept: '栄養課', color: 'bg-orange-50 border-orange-200', icon: '🍽️' }
                  ].map((item, index) => (
                    <div key={index} className={`${item.color} border p-4 rounded-lg`}>
                      <div className="text-center">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h4 className="font-semibold">{item.dept}</h4>
                        <p className="text-xs text-gray-600 mt-1">計画策定中</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'message' && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <Heart className="mx-auto mb-4 text-red-400" size={48} />
                  <h3 className="text-xl font-semibold mb-2">経営メッセージ</h3>
                  <p className="text-sm text-gray-600">川畑統括事務局長からの職員向けメッセージ</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-3">
                      <span className="text-2xl">👨‍💼</span>
                    </div>
                    <h4 className="text-lg font-bold text-blue-900">川畑統括事務局長</h4>
                    <p className="text-sm text-blue-700">医療法人厚生会</p>
                  </div>
                  <blockquote className="text-center text-gray-700 italic">
                    <p className="mb-4">「職員の幸福が患者の幸福につながる」</p>
                    <p className="text-sm">
                      この理念のもと、私たちは単なる雇用関係を超えた、
                      真のパートナーシップを築いていきます。
                    </p>
                  </blockquote>
                  <div className="mt-6 bg-white bg-opacity-50 p-4 rounded">
                    <p className="text-sm text-gray-600">
                      ※ 詳細なメッセージは準備中です。正式承認後に掲載いたします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recruitment' && (
            <div className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <UserCheck className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-xl font-semibold mb-2">採用基準</h3>
                  <p className="text-sm text-gray-600">新卒・中途採用の具体的な基準と評価方法</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <GraduationCap className="mr-2" size={16} />
                      新卒採用（40%）
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-sm">基本資質</h5>
                        <ul className="text-xs text-gray-600 ml-4 mt-1">
                          <li>• 明るく、元気で、素直</li>
                          <li>• 患者様への共感力</li>
                          <li>• チームワークを重視</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm">評価ポイント</h5>
                        <ul className="text-xs text-gray-600 ml-4 mt-1">
                          <li>• 継続力（部活動等）</li>
                          <li>• ボランティア経験</li>
                          <li>• 成長意欲</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                      <Briefcase className="mr-2" size={16} />
                      中途採用（60%）
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-sm">即戦力要件</h5>
                        <ul className="text-xs text-gray-600 ml-4 mt-1">
                          <li>• 専門資格・経験</li>
                          <li>• 実務スキル</li>
                          <li>• 問題解決能力</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm">組織適応性</h5>
                        <ul className="text-xs text-gray-600 ml-4 mt-1">
                          <li>• 価値観の適合性</li>
                          <li>• 柔軟性・協調性</li>
                          <li>• 長期就労意向</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター情報 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>このシステムは継続的に改善されます。ご意見・ご要望は戦略企画・統括管理部門までお寄せください。</p>
        </div>
      </div>
    </div>
  );
};

export default KouseikaiHRPolicyDraft;