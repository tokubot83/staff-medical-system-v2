'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CommonHeader from '@/components/CommonHeader';

export default function HRSystemGuidePage() {
  const [activeTab, setActiveTab] = useState<'evaluation' | 'interview'>('evaluation');

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="人事制度ガイド" />

      {/* ナビゲーション */}
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12">
            <div className="flex space-x-1">
              <Link href="/" className="hover:bg-gray-700 px-4 py-3 text-sm font-medium transition-colors">
                ← ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto p-6">
        {/* ページヘッダー */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">人事制度ガイド</h1>
          <p className="text-gray-600">
            医療法人厚生会の人事評価制度・面談制度について、職員の皆様にわかりやすくご説明します。
          </p>
        </div>

        {/* タブ切り替え */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'evaluation'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              人事評価制度
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'interview'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              面談制度
            </button>
          </div>
        </div>

        {/* 人事評価制度の内容 */}
        {activeTab === 'evaluation' && (
          <div className="space-y-6">
            {/* 概要 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">📊</span>
                人事評価制度の概要
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  当法人の人事評価制度は、職員一人ひとりの成長と組織の発展を両立させることを目的としています。
                  公正で透明性の高い評価を通じて、職員のモチベーション向上と適切な処遇を実現します。
                </p>
              </div>
            </div>

            {/* 評価の流れ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">評価の流れ</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">目標設定（4月）</h4>
                    <p className="text-gray-600 text-sm">
                      年度初めに上司と相談しながら、個人目標を設定します。
                      組織目標と連動した具体的で測定可能な目標を立てます。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">中間評価（10月）</h4>
                    <p className="text-gray-600 text-sm">
                      目標の進捗状況を確認し、必要に応じて軌道修正を行います。
                      上司からのフィードバックを受け、後半期の取り組みを計画します。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">年度評価（3月）</h4>
                    <p className="text-gray-600 text-sm">
                      1年間の成果と成長を総合的に評価します。
                      自己評価と上司評価を突き合わせ、来年度の課題と目標を明確にします。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 評価項目 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">評価項目</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">業績評価（50%）</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>個人目標の達成度</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>業務の質と効率性</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>専門スキルの発揮</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">行動評価（30%）</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>チームワークと協調性</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>積極性と主体性</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>コミュニケーション能力</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-3">能力評価（20%）</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>専門知識・技術の向上</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>問題解決能力</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>リーダーシップ（該当者）</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-3">職種別評価</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>看護師：JNAラダー評価</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>医療技術職：専門技術評価</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>事務職：業務処理能力評価</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 評価結果の活用 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">評価結果の活用</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="font-semibold text-gray-800 mb-1">昇給・賞与</h4>
                  <p className="text-sm text-gray-600">評価結果に基づく適正な処遇</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">📈</div>
                  <h4 className="font-semibold text-gray-800 mb-1">昇進・昇格</h4>
                  <p className="text-sm text-gray-600">キャリアアップの判断材料</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🎓</div>
                  <h4 className="font-semibold text-gray-800 mb-1">教育研修</h4>
                  <p className="text-sm text-gray-600">個別の成長支援プラン</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 面談制度の内容 */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            {/* 概要 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">💬</span>
                面談制度の概要
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  面談制度は、上司と部下が定期的にコミュニケーションを取り、
                  相互理解を深めながら個人と組織の成長を促進する重要な仕組みです。
                </p>
              </div>
            </div>

            {/* 面談の種類 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">面談の種類と実施時期</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">目標設定面談</h4>
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">4月</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    年度の個人目標を設定し、期待される役割や成果について相互確認を行います。
                    キャリアビジョンについても話し合います。
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">中間面談</h4>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">10月</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    目標の進捗確認とフィードバック。課題がある場合は改善策を一緒に考えます。
                    必要に応じて目標の修正も行います。
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">評価面談</h4>
                    <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">3月</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    年度の評価結果をフィードバック。良かった点と改善点を明確にし、
                    来年度の成長課題を設定します。
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">随時面談</h4>
                    <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">必要時</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    業務上の課題、体調不良、家庭の事情など、職員または上司が必要と判断した時に実施。
                    早期の問題解決を図ります。
                  </p>
                </div>
              </div>
            </div>

            {/* 面談の進め方 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">効果的な面談のポイント</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-blue-500">👤</span>
                    職員の心構え
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>事前に話したいことを整理する</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>率直に意見や悩みを伝える</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>フィードバックを前向きに受け止める</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>具体的な行動計画を立てる</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-green-500">👥</span>
                    上司の心構え
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>傾聴の姿勢を大切にする</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>具体的な事例でフィードバック</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>成長を支援する視点を持つ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>次のステップを明確にする</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 面談シート */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">面談シートについて</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-600 mb-4">
                  面談シートは、面談の内容を記録し、継続的な成長支援に活用するためのツールです。
                  職種や経験年数に応じて最適化されたフォーマットを用意しています。
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/interviews" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h4 className="font-semibold text-blue-800 mb-2">一般職員用</h4>
                  <p className="text-sm text-gray-600">基本的な面談シート</p>
                </Link>
                <Link href="/interviews" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <h4 className="font-semibold text-green-800 mb-2">管理職用</h4>
                  <p className="text-sm text-gray-600">マネジメント評価含む</p>
                </Link>
                <Link href="/interviews" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <h4 className="font-semibold text-purple-800 mb-2">新人職員用</h4>
                  <p className="text-sm text-gray-600">成長支援重視</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* お問い合わせ */}
        <div className="bg-blue-50 rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-blue-800 mb-3">お問い合わせ</h3>
          <p className="text-gray-700 mb-4">
            人事評価制度・面談制度に関するご質問やご相談は、人事部までお気軽にお問い合わせください。
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📧</span>
              <span className="text-sm">人事部直通: jinji@kousei-kai.jp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📞</span>
              <span className="text-sm">内線: 2100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}