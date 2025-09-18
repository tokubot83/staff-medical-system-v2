'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CommonHeader from '@/components/CommonHeader';
import FacilitySelector from '@/components/reports/FacilitySelector';
const reports = [
  {
    id: 'survival-curve-overall',
    title: '生存曲線�E析（�E体！E,
    path: '/reports/retention/survival-curve-overall',
    description: '全職員の定着玁E��時系列で可視化し、定着パターンを�E极E,
    icon: '📈',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'survival-curve-department',
    title: '生存曲線�E析（部署別�E�E,
    path: '/reports/retention/survival-curve-department',
    description: '部署ごとの定着玁E�E違いを比輁E�E极E,
    icon: '🏥',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'cohort-yearly-tracking',
    title: 'コホ�Eト年次追跡',
    path: '/reports/retention/cohort-yearly-tracking',
    description: '入社年次別の定着玁E��移を長期追跡',
    icon: '📊',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'cohort-intervention-effect',
    title: 'コホ�Eト施策効极E,
    path: '/reports/retention/cohort-intervention-effect',
    description: '定着施策�E効果を入社年次別に測宁E,
    icon: '💡',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'early-turnover-pattern',
    title: '早期離職パターン',
    path: '/reports/retention/early-turnover-pattern',
    description: '入社3年以冁E�E離職パターンと要因刁E��',
    icon: '⚠�E�E,
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'early-turnover-alert',
    title: '早期離職アラーチE,
    path: '/reports/retention/early-turnover-alert',
    description: '早期離職リスクの高い職員を早期検知',
    icon: '🚨',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'segment-generation',
    title: 'セグメント世代刁E��',
    path: '/reports/retention/segment-generation',
    description: '世代別の定着傾向と価値観の違いを�E极E,
    icon: '👥',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    id: 'segment-recruitment-type',
    title: 'セグメント採用種別',
    path: '/reports/retention/segment-recruitment-type',
    description: '新卒�E中途別の定着玁E��成功要因',
    icon: '🎯',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'hazard-risk-score',
    title: 'ハザードリスクスコア',
    path: '/reports/retention/hazard-risk-score',
    description: '個人別の離職リスクをスコア匁E,
    icon: '📉',
    gradient: 'from-pink-500 to-pink-600'
  },
  {
    id: 'hazard-cox-regression',
    title: 'Cox回帰刁E��',
    path: '/reports/retention/hazard-cox-regression',
    description: '離職要因の統計的な影響度を�E极E,
    icon: '📊',
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'factor-mapping',
    title: '定着要因マッピング',
    path: '/reports/retention/factor-mapping',
    description: '定着に影響する要因を網羁E��に刁E��',
    icon: '🗺�E�E,
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'retention-simulator',
    title: '定着シミュレーター',
    path: '/reports/retention/retention-simulator',
    description: '施策導�Eによる定着玁E��化をシミュレーション',
    icon: '🔮',
    gradient: 'from-violet-500 to-violet-600'
  },
  {
    id: 'turnover-contagion',
    title: '離職連鎖�E极E,
    path: '/reports/retention/turnover-contagion',
    description: '一人の離職が周囲に与える影響を�E极E,
    icon: '🔗',
    gradient: 'from-amber-500 to-amber-600'
  }
];

function RetentionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedFacility = searchParams.get('facility') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="定着刁E��" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 施設選抁E*/}
        <div className="mb-8">
          <FacilitySelector
            selectedFacility={selectedFacility}
            onFacilityChange={() => {}}
          />
        </div>

        {/* レポ�Eト一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => {
                const url = selectedFacility 
                  ? `${report.path}?facility=${encodeURIComponent(selectedFacility)}`
                  : report.path;
                router.push(url);
              }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${report.gradient}`} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{report.icon}</span>
                  <h3 className="text-xl font-semibold">{report.title}</h3>
                </div>
                <p className="text-gray-600">{report.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* アセスメントパターン */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            定着刁E��のアセスメントパターン
          </h3>
          
          <div className="space-y-6">
            {/* 1. 生存�E析アセスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                1. 生存�E析アセスメント（定着パターン�E�E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                生存曲線（�E体）�E 部署別比輁EↁE危険期特宁E
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>勤続期間別の定着玁E��握</li>
                <li>部署間�Eベスト�EラクチE��ス発要E/li>
                <li>重点介�E時期の特宁E/li>
              </ul>
            </div>

            {/* 2. コホ�Eト追跡アセスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                2. コホ�Eト追跡アセスメント（世代別刁E���E�E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                年次コホ�Eト追跡 ↁE施策効果測宁EↁE世代別対忁E
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>入職年度別の定着傾吁E/li>
                <li>過去施策�E長期的効果検証</li>
                <li>世代特性に応じた施策設訁E/li>
              </ul>
            </div>

            {/* 3. 要因マッピングアセスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                3. 要因マッピングアセスメント（包括皁E�E析！E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                要因マッピング ↁE優先度マトリチE��ス ↁE改喁E��画
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>定着要因の網羁E��把握</li>
                <li>重要度×緊急度での優先頁E��E/li>
                <li>リソース配�Eの最適匁E/li>
              </ul>
            </div>

            {/* 4. シミュレーションアセスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                4. シミュレーションアセスメント！Ehat-if刁E���E�E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                施策選抁EↁE効果予測 ↁEROI評価
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>褁E��施策�E絁E��合わせ効极E/li>
                <li>投賁E��収期間�E算�E</li>
                <li>段階的実施計画の立桁E/li>
              </ul>
            </div>

            {/* 5. 連鎖影響アセスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                5. 連鎖影響アセスメント（波及効果！E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                ネットワーク刁E�� ↁE連鎖リスク評価 ↁE予防戦略
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>キーパ�Eソンの影響力測宁E/li>
                <li>離職連鎖�Eパターン認譁E/li>
                <li>早期介�Eポイント�E特宁E/li>
              </ul>
            </div>

            {/* 6. セグメントアセスメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                6. セグメントアセスメント（属性別刁E���E�E
              </h4>
              <div className="text-blue-800 mb-2">
                <span className="font-medium">推奨フロー�E�E/span>
                世代刁E�� ↁE採用種別刁E�� ↁEカスタマイズ施筁E
              </div>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>Z世代、ミレニアル世代等�E特性琁E��</li>
                <li>新十E中途�E定着パターン違い</li>
                <li>ターゲチE��別アプローチE/li>
              </ul>
            </div>
          </div>
        </div>

        {/* 統合的アセスメントパターン */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-6">
            統合的アセスメントパターン
          </h3>
          
          <div className="space-y-6">
            {/* 1. 予防皁E��材�EネジメンチE*/}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">
                1. 予防皁E��材�EネジメンチE
              </h4>
              <div className="text-purple-800 mb-2">
                <span className="font-medium">統合フロー�E�E/span>
                離職リスク予測 ↁE定着要因強匁EↁE効果測宁E
              </div>
              <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>リスクの早期発要E/li>
                <li>予防皁E��策�E実施</li>
                <li>継続的な改喁E��イクル</li>
              </ul>
            </div>

            {/* 2. 戦略皁E��員計画 */}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">
                2. 戦略皁E��員計画
              </h4>
              <div className="text-purple-800 mb-2">
                <span className="font-medium">統合フロー�E�E/span>
                離職予測 ↁE生存率老E�E ↁE採用計画最適匁E
              </div>
              <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>封E��の人員需要予測</li>
                <li>定着玁E��織り込んだ採用数決宁E/li>
                <li>コスト効玁E��な人員確俁E/li>
              </ul>
            </div>

            {/* 3. 絁E��開発アプローチE*/}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">
                3. 絁E��開発アプローチE
              </h4>
              <div className="text-purple-800 mb-2">
                <span className="font-medium">統合フロー�E�E/span>
                離職要因×定着要因 ↁE絁E��課題特宁EↁE斁E��変革
              </div>
              <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>プッシュ要因とプル要因の両面刁E��</li>
                <li>根本皁E��絁E��課題への対忁E/li>
                <li>持続可能な職場環墁E��篁E/li>
              </ul>
            </div>

            {/* 4. 個別最適化アプローチE*/}
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">
                4. 個別最適化アプローチE
              </h4>
              <div className="text-purple-800 mb-2">
                <span className="font-medium">統合フロー�E�E/span>
                個人リスクスコア ↁEキャリアスチE�Eジ老E�E ↁEパ�Eソナライズ支援
              </div>
              <ul className="list-disc list-inside text-purple-700 text-sm space-y-1">
                <li>一人ひとり�Eリスクレベル評価</li>
                <li>ライフスチE�Eジに応じた支援</li>
                <li>個別のキャリア開発計画</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 text-purple-800 text-sm">
            <p className="font-medium">
              これら�Eアセスメントパターンを絁E��合わせることで、多角的で効果的な人材定着戦略を構築できます、E
            </p>
          </div>
        </div>

        {/* 使ぁE��ガイチE*/}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            定着刁E��の活用方況E
          </h3>
          <ul className="list-disc list-inside text-green-800 space-y-1">
            <li>定着玁E�E低い部署めE�E種を特定し、改喁E��を立案できまぁE/li>
            <li>早期離職のリスクが高い職員を事前に発見し、フォローできまぁE/li>
            <li>世代めE��用種別による違いを理解し、きめ細かな対応が可能でぁE/li>
            <li>定着施策�E効果を定量皁E��測定し、PDCAサイクルを回せまぁE/li>
          </ul>
        </div>
      </div></div>
  );
}

export default function RetentionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RetentionPageContent />
    </Suspense>
  );
}