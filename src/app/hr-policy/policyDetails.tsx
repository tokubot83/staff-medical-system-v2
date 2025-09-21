import React from 'react';
import {
  CheckCircle, MessageCircle, RefreshCw, Shield, UserCheck,
  Clock, Settings, Briefcase, Layers, GraduationCap, Link,
  Users, Building, Heart, Star, DollarSign, BarChart3,
  TrendingUp, LineChart, CreditCard
} from 'lucide-react';

export const policyDetails: { [key: string]: JSX.Element } = {
  'd': (
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
  ),
  'e': (
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
  ),
  'f': (
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
  ),
  'g': (
    <div className="space-y-4">
      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
        <h4 className="font-bold text-teal-800 mb-2">長期雇用の戦略的意義</h4>
        <p className="text-sm">
          医療職のキャリアは長期的視点が不可欠です。職員のライフサイクルに寄り添い、
          生涯にわたって活躍できる環境を提供します。
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <Clock className="mr-2 text-teal-600" size={16} />
          看護師のライフサイクル例
        </h4>
        <div className="space-y-2">
          {[
            { age: '20代', role: '急性期病棟で基礎を学ぶ', focus: '技術習得期' },
            { age: '30代', role: '結婚・出産で外来や訪問看護へ', focus: '生活両立期' },
            { age: '40代', role: '主任として後輩指導', focus: '指導育成期' },
            { age: '50代', role: '看護部管理職または専門分野を極める', focus: '専門深化期' },
            { age: '60代', role: '経験を活かした相談役', focus: '継承期' }
          ].map((item, index) => (
            <div key={index} className="flex items-center bg-teal-50 p-2 rounded">
              <div className="bg-teal-600 text-white px-2 py-1 rounded text-xs font-bold mr-3">
                {item.age}
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold">{item.role}</span>
                <span className="text-xs text-gray-600 ml-2">（{item.focus}）</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-teal-100 p-4 rounded-lg">
        <h4 className="font-bold text-teal-900 mb-2">配置転換による継続就労</h4>
        <p className="text-sm">
          ライフステージに応じた配置転換により、長く働ける環境を提供。
          経験の蓄積が組織の財産となります。
        </p>
      </div>
    </div>
  ),
  'h': (
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
  ),
  'i': (
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
  ),
  'j': (
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
  ),
  'k': (
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
  ),
  'l': (
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
  ),
  'm': (
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
  ),
  'n': (
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
  ),
  'o': (
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
  ),
  'p': (
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
  ),
  'q': (
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
  ),
  'r': (
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
  ),
  's': (
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
  )
};