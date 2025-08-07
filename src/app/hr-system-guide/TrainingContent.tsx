'use client';

import React from 'react';

interface TrainingContentProps {
  viewMode: 'general' | 'formal';
}

export default function TrainingContent({ viewMode }: TrainingContentProps) {
  if (viewMode === 'general') {
    return (
      <div className="space-y-6">
        {/* 概要 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">🎓</span>
            教育・研修制度について
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              医療法人厚生会では、<span className="font-bold text-orange-600">技術評価（50点）の向上を支援</span>し、
              職員一人ひとりの専門性とキャリア形成を促進する法人統一の教育研修制度を整備しています。
            </p>
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <p className="text-orange-800 font-semibold mb-2">研修制度の特徴</p>
              <ul className="text-gray-700 space-y-2">
                <li>• 評価結果と連動した個別研修計画（IDP）</li>
                <li>• 職種別・レベル別の体系的なカリキュラム</li>
                <li>• 法人共通研修と施設特化研修の2層構造</li>
                <li>• 資格取得支援とキャリアアップ制度</li>
              </ul>
            </div>
          </div>
        </div>

        {/* あなたのキャリアパス */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">あなたのキャリアパスを描こう</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-2">🌱 新人・初任者</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 基礎技術習得研修</li>
                <li>• OJTプログラム</li>
                <li>• メンター制度</li>
                <li>• 新人フォローアップ研修</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">📈 中堅職員</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 専門技術向上研修</li>
                <li>• リーダーシップ研修</li>
                <li>• プリセプター研修</li>
                <li>• 他施設交流研修</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-bold text-purple-800 mb-2">🎯 管理職・専門職</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• マネジメント研修</li>
                <li>• 経営戦略研修</li>
                <li>• 専門資格取得支援</li>
                <li>• 外部研修派遣</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-yellow-800 font-semibold mb-2">💡 研修受講のメリット</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <ul className="space-y-1">
                <li>• 技術評価点の向上に直結</li>
                <li>• 資格手当・研修手当の支給</li>
                <li>• キャリアアップの道筋が明確</li>
              </ul>
              <ul className="space-y-1">
                <li>• 勤務時間内の研修参加OK</li>
                <li>• 研修費用は法人負担</li>
                <li>• 修了証・資格の付与</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 研修の申し込み方法 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">研修への参加方法</h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">評価面談で相談</h4>
                <p className="text-sm text-gray-600">
                  上司との面談で、あなたの強みと成長課題を確認し、必要な研修を相談します。
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">研修計画の作成</h4>
                <p className="text-sm text-gray-600">
                  個別研修計画（IDP）を作成し、年間の研修スケジュールを決定します。
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">申し込み手続き</h4>
                <p className="text-sm text-gray-600">
                  研修申込書を所属長経由で人事部に提出。オンライン申請も可能です。
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">研修受講</h4>
                <p className="text-sm text-gray-600">
                  承認後、研修に参加。修了後は報告書を提出し、学んだことを現場で実践します。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="bg-orange-50 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-orange-800 mb-4">よくある質問</h3>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">研修は勤務時間内に受けられますか？</summary>
              <p className="mt-2 text-sm text-gray-600">
                はい、法人主催の研修は原則として勤務時間内に実施されます。外部研修も業務命令として参加する場合は勤務扱いとなります。
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">研修費用は自己負担ですか？</summary>
              <p className="mt-2 text-sm text-gray-600">
                法人が指定・承認した研修については、受講料・交通費・宿泊費等は法人が負担します。自主的な研修には補助制度があります。
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">研修を受けると評価は上がりますか？</summary>
              <p className="mt-2 text-sm text-gray-600">
                研修受講履歴は技術評価の参考となります。また、習得したスキルを実務で発揮することで、評価向上につながります。
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">どんな研修が用意されていますか？</summary>
              <p className="mt-2 text-sm text-gray-600">
                職種別基礎研修、専門技術研修、マネジメント研修、資格取得支援講座など、100種類以上の研修プログラムを用意しています。
              </p>
            </details>
          </div>
        </div>

        {/* 既存の3セクションをここに移動 */}
        {/* 教育研修制度（法人版） */}
        <div className="bg-purple-50 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">教育研修制度（法人版）- 詳細</h2>
          
          {/* 制度概要 */}
          <div className="bg-white rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">制度の目的と体系</h3>
            <p className="text-gray-700 mb-4">
              技術評価（50点）の向上を支援し、職員の専門性とキャリア形成を促進する法人統一の教育研修制度です。
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-100 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">法人共通研修（技術評価30点部分）</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 基本能力研修（接遇・コミュニケーション）</li>
                  <li>• 専門技術基礎研修（職種別必須スキル）</li>
                  <li>• 対人関係・ケア研修</li>
                  <li>• 安全管理・品質管理研修</li>
                  <li>• コンプライアンス・倫理研修</li>
                </ul>
              </div>
              
              <div className="bg-green-100 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">施設特化研修（技術評価20点部分）</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 急性期病院：救急医療・高度医療技術</li>
                  <li>• 慢性期病院：リハビリ・緩和ケア</li>
                  <li>• 介護施設：認知症ケア・生活支援</li>
                  <li>• 訪問系：在宅医療・地域連携</li>
                  <li>• その他：施設独自の専門研修</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 職種別研修体系 */}
          <div className="bg-white rounded-lg p-5 mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">職種別キャリアラダーと研修</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-800 mb-2">看護職</h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-medium">レベル1（新人）</p>
                    <ul className="text-gray-600">
                      <li>• 基礎看護技術</li>
                      <li>• 医療安全基礎</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">レベル2-3（一人前）</p>
                    <ul className="text-gray-600">
                      <li>• 専門看護技術</li>
                      <li>• チーム医療</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">レベル4-5（エキスパート）</p>
                    <ul className="text-gray-600">
                      <li>• 指導者研修</li>
                      <li>• 管理者研修</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800 mb-2">介護職</h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-medium">初任者</p>
                    <ul className="text-gray-600">
                      <li>• 介護基礎技術</li>
                      <li>• 認知症基礎</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">実務者</p>
                    <ul className="text-gray-600">
                      <li>• 医療的ケア</li>
                      <li>• アセスメント技術</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">介護福祉士以上</p>
                    <ul className="text-gray-600">
                      <li>• ケアマネジメント</li>
                      <li>• ユニットリーダー研修</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800 mb-2">リハビリ職</h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-medium">新人（1-2年）</p>
                    <ul className="text-gray-600">
                      <li>• 基本評価技術</li>
                      <li>• 治療技術基礎</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">中堅（3-7年）</p>
                    <ul className="text-gray-600">
                      <li>• 専門技術研修</li>
                      <li>• 症例検討会</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">主任以上</p>
                    <ul className="text-gray-600">
                      <li>• 研究指導法</li>
                      <li>• 部門管理研修</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 研修と評価の連動 */}
          <div className="bg-yellow-50 rounded-lg p-5">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">研修受講と評価の連動</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">評価→研修計画</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 技術評価の結果から弱点分野を特定</li>
                  <li>• 個別研修計画（IDP）の作成</li>
                  <li>• 必須研修と選択研修の組み合わせ</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">研修→評価向上</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 研修受講履歴を評価時に考慮</li>
                  <li>• 資格取得による加点制度</li>
                  <li>• 研修講師担当による貢献度評価</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 正式文書版
  return (
    <div className="space-y-6">
      {/* 教育研修規程 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">教育研修規程</h2>
        <div className="prose max-w-none text-gray-700">
          <h3 className="text-lg font-bold mb-3">第1章 総則</h3>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">第1条（目的）</h4>
            <p className="text-sm mb-3">
              本規程は、医療法人厚生会（以下「法人」という）における職員の教育研修に関する基本的事項を定め、
              職員の資質向上と専門性の確立を図り、もって法人の理念実現と医療・介護サービスの質的向上に資することを目的とする。
            </p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">第2条（基本方針）</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>法人は、計画的かつ体系的な教育研修を実施する</li>
              <li>職員は、自己研鑽に努め、積極的に研修に参加する</li>
              <li>教育研修は、人事評価制度と連動して実施する</li>
              <li>法人は、職員のキャリア開発を支援する</li>
            </ol>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">第3条（研修の種類）</h4>
            <p className="text-sm mb-2">研修は以下の種類に分類する：</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>階層別研修（新人・中堅・管理職）</li>
              <li>職種別研修（専門技術研修）</li>
              <li>テーマ別研修（医療安全、感染対策等）</li>
              <li>派遣研修（外部機関への派遣）</li>
              <li>自己啓発支援</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 教育研修体系 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">教育研修体系</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">1. 法人共通研修（技術評価30点対応）</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">研修区分</th>
                <th className="border p-2 text-left">対象者</th>
                <th className="border p-2 text-left">実施時期</th>
                <th className="border p-2 text-left">評価配点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">基本能力研修</td>
                <td className="border p-2">全職員</td>
                <td className="border p-2">年2回</td>
                <td className="border p-2">10点</td>
              </tr>
              <tr>
                <td className="border p-2">専門技術基礎研修</td>
                <td className="border p-2">職種別</td>
                <td className="border p-2">年4回</td>
                <td className="border p-2">10点</td>
              </tr>
              <tr>
                <td className="border p-2">対人関係・ケア研修</td>
                <td className="border p-2">全職員</td>
                <td className="border p-2">年2回</td>
                <td className="border p-2">5点</td>
              </tr>
              <tr>
                <td className="border p-2">安全管理研修</td>
                <td className="border p-2">全職員</td>
                <td className="border p-2">年2回</td>
                <td className="border p-2">5点</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">2. 施設特化研修（技術評価20点対応）</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">施設種別</th>
                <th className="border p-2 text-left">重点研修</th>
                <th className="border p-2 text-left">選択可能項目</th>
                <th className="border p-2 text-left">最大配点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">急性期病院</td>
                <td className="border p-2">救急医療、高度医療技術</td>
                <td className="border p-2">専門認定資格</td>
                <td className="border p-2">20点</td>
              </tr>
              <tr>
                <td className="border p-2">慢性期病院</td>
                <td className="border p-2">リハビリ、緩和ケア</td>
                <td className="border p-2">認知症ケア</td>
                <td className="border p-2">20点</td>
              </tr>
              <tr>
                <td className="border p-2">介護施設</td>
                <td className="border p-2">生活支援、レク活動</td>
                <td className="border p-2">介護技術向上</td>
                <td className="border p-2">20点</td>
              </tr>
              <tr>
                <td className="border p-2">訪問系</td>
                <td className="border p-2">在宅医療、地域連携</td>
                <td className="border p-2">家族支援</td>
                <td className="border p-2">20点</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 研修実施要領 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">研修実施要領</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">研修計画の策定</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">年間研修計画</h4>
            <ul className="text-sm space-y-1">
              <li>• 法人人事部が前年度12月までに次年度計画を策定</li>
              <li>• 各施設の要望を11月までに集約</li>
              <li>• 評価結果分析に基づく重点課題の設定</li>
              <li>• 予算承認後、1月に全施設へ通知</li>
            </ul>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">研修の実施</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">集合研修</h4>
              <ul className="text-sm space-y-1">
                <li>• 法人研修センターでの実施</li>
                <li>• オンライン配信の併用</li>
                <li>• 録画視聴による補講対応</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">OJT</h4>
              <ul className="text-sm space-y-1">
                <li>• 各施設での実施</li>
                <li>• 指導者の認定制度</li>
                <li>• チェックリストによる進捗管理</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">研修の評価</h3>
          <div className="bg-yellow-50 rounded-lg p-4">
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-semibold">1.</span>
                <div>
                  <span className="font-semibold">研修直後評価：</span>
                  理解度テスト、アンケート実施
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">2.</span>
                <div>
                  <span className="font-semibold">3ヶ月後評価：</span>
                  実践状況の確認、上司評価
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">3.</span>
                <div>
                  <span className="font-semibold">年度評価：</span>
                  人事評価への反映、次年度計画への活用
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 既存のセクションをここに含める */}
      {/* 評価項目決定プロセスのガイドライン */}
      <div className="bg-indigo-50 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">評価項目決定プロセスガイドライン</h2>
        
        {/* プロセス概要 */}
        <div className="bg-white rounded-lg p-5 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">施設裁量部分（20点）の決定プロセス</h3>
          
          <div className="space-y-4">
            {/* ステップ1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">施設評価委員会の設置</h4>
                <p className="text-sm text-gray-700 mb-2">各施設に評価項目検討委員会を設置（年1回開催）</p>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-medium mb-1">委員会構成：</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 施設長（委員長）</li>
                    <li>• 各部門責任者（看護部長、事務長等）</li>
                    <li>• 職員代表（各職種から選出）</li>
                    <li>• 人事担当者（事務局）</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* ステップ2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">現状分析と課題抽出</h4>
                <p className="text-sm text-gray-700 mb-2">施設の特性と重点課題を分析</p>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-medium mb-1">分析項目：</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 施設種別と機能（急性期/慢性期/介護等）</li>
                    <li>• 地域ニーズと施設の役割</li>
                    <li>• 前年度評価結果の分析</li>
                    <li>• 職員スキルギャップの特定</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* ステップ3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">評価項目案の作成</h4>
                <p className="text-sm text-gray-700 mb-2">20点分の評価項目を選択・配点</p>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-medium mb-1">選択可能項目（例）：</p>
                  <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                    <ul className="space-y-1">
                      <li>• 専門知識（最大10点）</li>
                      <li>• 教育・指導力（最大10点）</li>
                      <li>• リーダーシップ（最大10点）</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• 成長性・向上心（最大10点）</li>
                      <li>• 施設独自スキル（最大10点）</li>
                      <li>• イノベーション（最大5点）</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ステップ4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">法人人事部への申請・承認</h4>
                <p className="text-sm text-gray-700 mb-2">評価項目案を法人人事部に提出</p>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-medium mb-1">提出書類：</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 評価項目選択理由書</li>
                    <li>• 配点根拠説明書</li>
                    <li>• 前年度との変更点（該当する場合）</li>
                    <li>• 委員会議事録</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* ステップ5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">職員への周知・説明</h4>
                <p className="text-sm text-gray-700 mb-2">決定した評価項目を全職員に説明</p>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-medium mb-1">周知方法：</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 職員説明会の開催</li>
                    <li>• 評価項目一覧表の配布</li>
                    <li>• イントラネットでの公開</li>
                    <li>• 質疑応答期間の設定</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 年間スケジュール */}
        <div className="bg-white rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-3">年間スケジュール</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="text-left p-2">時期</th>
                  <th className="text-left p-2">実施事項</th>
                  <th className="text-left p-2">担当</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">10月</td>
                  <td className="p-2">評価委員会開催・現状分析</td>
                  <td className="p-2">各施設</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">11月</td>
                  <td className="p-2">評価項目案作成・提出</td>
                  <td className="p-2">各施設→法人</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">12月</td>
                  <td className="p-2">法人審査・承認</td>
                  <td className="p-2">法人人事部</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">1月</td>
                  <td className="p-2">職員説明会</td>
                  <td className="p-2">各施設</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">4月</td>
                  <td className="p-2">新評価項目運用開始</td>
                  <td className="p-2">全施設</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 法人人事部準備室向け参考資料 */}
      <div className="bg-gray-100 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">法人人事部準備室向け参考資料</h2>
        
        {/* 制度設計のポイント */}
        <div className="bg-white rounded-lg p-5 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">人事評価制度設計のキーポイント</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">法人統一と施設裁量のバランス</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>法人共通（60%）：基本的な価値観・スキルの統一</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>施設裁量（40%）：施設特性への対応</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>技術50点、施設貢献25点、法人貢献25点の配分</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">2軸評価の意義</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>施設内評価：給与・賞与への反映</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>法人内評価：人材配置・キャリア開発</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>小規模施設職員の適正評価</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 導入ロードマップ */}
        <div className="bg-white rounded-lg p-5 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">法人人事部設立と制度導入ロードマップ</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-24 text-sm font-medium text-gray-600">準備期</div>
              <div className="flex-1 bg-yellow-100 rounded-lg p-3">
                <p className="font-semibold text-yellow-800 text-sm mb-1">現在〜3ヶ月</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• 人事部準備室の体制整備</li>
                  <li>• 現行制度の調査・分析</li>
                  <li>• 基本方針の策定</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-24 text-sm font-medium text-gray-600">設計期</div>
              <div className="flex-1 bg-blue-100 rounded-lg p-3">
                <p className="font-semibold text-blue-800 text-sm mb-1">4〜9ヶ月</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• 評価制度詳細設計</li>
                  <li>• 教育研修体系構築</li>
                  <li>• システム要件定義</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-24 text-sm font-medium text-gray-600">試行期</div>
              <div className="flex-1 bg-green-100 rounded-lg p-3">
                <p className="font-semibold text-green-800 text-sm mb-1">10〜12ヶ月</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• パイロット施設での試行</li>
                  <li>• 評価者研修の実施</li>
                  <li>• フィードバック収集</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-24 text-sm font-medium text-gray-600">本格導入</div>
              <div className="flex-1 bg-purple-100 rounded-lg p-3">
                <p className="font-semibold text-purple-800 text-sm mb-1">13ヶ月〜</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• 全施設での運用開始</li>
                  <li>• 継続的改善（PDCA）</li>
                  <li>• 効果測定と調整</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 必要なリソース */}
        <div className="bg-white rounded-lg p-5 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">必要なリソースと体制</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">人的リソース</h4>
              <ul className="space-y-1 text-xs text-gray-700">
                <li>• 人事部長（専任）</li>
                <li>• 人事企画（2-3名）</li>
                <li>• 教育研修担当（2名）</li>
                <li>• システム担当（1名）</li>
                <li>• 事務スタッフ（2名）</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">システム・ツール</h4>
              <ul className="space-y-1 text-xs text-gray-700">
                <li>• 人事評価システム</li>
                <li>• 研修管理システム</li>
                <li>• タレントマネジメント</li>
                <li>• BI/分析ツール</li>
                <li>• コミュニケーション基盤</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">予算項目</h4>
              <ul className="space-y-1 text-xs text-gray-700">
                <li>• システム導入費</li>
                <li>• 外部コンサル費用</li>
                <li>• 研修開発・実施費</li>
                <li>• 評価者トレーニング</li>
                <li>• 運用保守費</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 成功要因とリスク */}
        <div className="bg-white rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-3">成功要因とリスク管理</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">成功要因</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">◎</span>
                  <span>経営層の強いコミットメント</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">◎</span>
                  <span>現場の巻き込みと対話</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">◎</span>
                  <span>段階的導入による負担軽減</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">◎</span>
                  <span>継続的な改善サイクル</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-700 mb-2">想定リスクと対策</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">⚠</span>
                  <div>
                    <span className="font-medium">現場の抵抗感</span>
                    <p className="text-xs text-gray-600">→ 丁寧な説明と段階導入</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">⚠</span>
                  <div>
                    <span className="font-medium">評価者間のばらつき</span>
                    <p className="text-xs text-gray-600">→ 評価者研修の徹底</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">⚠</span>
                  <div>
                    <span className="font-medium">システムトラブル</span>
                    <p className="text-xs text-gray-600">→ バックアップ体制構築</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}