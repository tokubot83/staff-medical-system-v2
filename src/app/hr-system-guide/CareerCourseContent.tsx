'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users, Target, FileText, Award, Calendar, AlertCircle,
  TrendingUp, MessageCircle, CheckCircle, ArrowRight
} from 'lucide-react';

interface CareerCourseContentProps {
  viewMode: 'general' | 'formal';
}

export default function CareerCourseContent({ viewMode }: CareerCourseContentProps) {
  if (viewMode === 'general') {
    return (
      <div className="space-y-6">
        {/* 概要 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            キャリア選択制度について
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              医療法人厚生会では、<span className="font-bold text-green-600">職員一人ひとりのライフステージやキャリアビジョンに合わせた柔軟な働き方</span>を実現するため、
              キャリア選択制度を導入しています。
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-semibold mb-2">制度の特徴</p>
              <ul className="text-gray-700 space-y-2">
                <li>• A～Dの4つのコースから働き方を選択</li>
                <li>• ライフステージに応じた柔軟なコース変更が可能</li>
                <li>• 各コースに応じた給与体系と期待役割を明確化</li>
                <li>• VoiceDriveシステムで簡単に申請・変更可能</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4つのコース紹介 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">4つのコースの特徴</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Aコース：全面協力型
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                施設間異動や業務変更に柔軟に対応し、法人全体の発展に貢献
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 給与係数：<span className="font-bold text-red-700">1.2倍</span></li>
                <li>• 施設間異動：応じる</li>
                <li>• 管理職登用：積極登用</li>
                <li>• おすすめ：キャリアアップ重視</li>
              </ul>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                Bコース：施設内協力型
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                施設内でのチーム協力を重視し、安定した環境で働く
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 給与係数：<span className="font-bold text-orange-700">1.1倍</span></li>
                <li>• 施設間異動：原則なし</li>
                <li>• 管理職登用：主任まで</li>
                <li>• おすすめ：地元で長く働きたい</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                Cコース：専門職型
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                専門性を深め、高度な技術・知識を活かして働く
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 給与係数：<span className="font-bold text-blue-700">1.0倍</span></li>
                <li>• 業務：専門領域のみ</li>
                <li>• 管理職登用：専門職登用</li>
                <li>• おすすめ：専門性を深めたい</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                Dコース：時短・制約あり型
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                育児・介護等の事情に配慮し、ワークライフバランスを重視
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 給与係数：<span className="font-bold text-green-700">0.9倍</span></li>
                <li>• 勤務時間：時短可能</li>
                <li>• 残業：原則なし</li>
                <li>• おすすめ：育児・介護中の方</li>
              </ul>
            </div>
          </div>
        </div>

        {/* コース変更の流れ */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">コース変更の流れ</h3>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">VoiceDriveにログイン</h4>
                <p className="text-sm text-gray-600">
                  職員IDとパスワードでVoiceDriveシステムにログインします。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">キャリア選択ステーションへ</h4>
                <p className="text-sm text-gray-600">
                  左サイドバーから「キャリア選択ステーション」を選択します。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">コース変更を申請</h4>
                <p className="text-sm text-gray-600">
                  希望コースと変更理由を入力し、申請ボタンをクリックします。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">人事部の承認待ち</h4>
                <p className="text-sm text-gray-600">
                  申請後、1～2週間で人事部から承認・却下の連絡があります。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">新コース適用開始</h4>
                <p className="text-sm text-gray-600">
                  承認後、指定日（定期変更は3月1日）から新しいコースが適用されます。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* キャリアパス例 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">ライフステージ別のコース選択例</h3>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-2">新卒入職時（22～25歳）</h4>
              <p className="text-sm text-gray-700">
                → <span className="font-bold">Cコース（専門職型）</span>でスキル習得に専念。基礎技術を確実に身につける。
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-bold text-orange-800 mb-2">中堅期（28～35歳）</h4>
              <p className="text-sm text-gray-700">
                → <span className="font-bold">Bコース（施設内協力型）</span>で地元に定着。チームリーダーとして活躍。
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">育児・介護期（30～50歳）</h4>
              <p className="text-sm text-gray-700">
                → <span className="font-bold">Dコース（時短・制約あり型）</span>で両立支援。時短勤務で仕事と家庭を両立。
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2">管理職候補期（35～45歳）</h4>
              <p className="text-sm text-gray-700">
                → <span className="font-bold">Aコース（全面協力型）</span>でキャリアアップ。複数施設での経験を積み幹部候補へ。
              </p>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="bg-green-50 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-green-800 mb-4">よくある質問</h3>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">年に何回コース変更できますか？</summary>
              <p className="mt-2 text-sm text-gray-600">
                定期変更は年1回（3月1日）です。ただし、結婚・出産・介護等のライフイベント時は、特別変更として随時申請できます。
              </p>
            </details>

            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">コース変更の申請は必ず承認されますか？</summary>
              <p className="mt-2 text-sm text-gray-600">
                人事部が総合的に判断します。施設の人員配置状況や業務の都合により、希望通りにならない場合もあります。却下された場合は理由が通知されます。
              </p>
            </details>

            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">給与係数はいつから適用されますか？</summary>
              <p className="mt-2 text-sm text-gray-600">
                コース変更の適用日から基本給に係数が適用されます。定期変更の場合は3月1日、特別変更の場合は承認後の翌月1日からです。
              </p>
            </details>

            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">Dコースから他のコースに戻れますか？</summary>
              <p className="mt-2 text-gray-600">
                はい、育児・介護等の事情が解消されれば、他のコースに変更申請できます。スキルや経験に応じてB・C・Aコースへの移行が可能です。
              </p>
            </details>

            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">現在のコースはどこで確認できますか？</summary>
              <p className="mt-2 text-sm text-gray-600">
                VoiceDriveの「マイページ」または「キャリア選択ステーション」で現在のコースと次回変更可能日を確認できます。
              </p>
            </details>
          </div>
        </div>

        {/* VoiceDriveへのリンク */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">キャリア選択ステーションへ</h3>
              <p className="text-sm opacity-90">
                VoiceDriveシステムからコース変更の申請・確認ができます
              </p>
            </div>
            <Link
              href="/my-page"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              マイページへ
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 正式文書版
  return (
    <div className="space-y-6">
      {/* キャリア選択制度規程 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">キャリア選択制度規程</h2>
        <div className="prose max-w-none text-gray-700">
          <h3 className="text-lg font-bold mb-3">第1章 総則</h3>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">第1条（目的）</h4>
            <p className="text-sm mb-3">
              本規程は、医療法人厚生会（以下「法人」という）における職員のキャリア選択制度に関する基本的事項を定め、
              職員の多様な働き方を支援し、もって法人の持続的発展と職員の満足度向上に資することを目的とする。
            </p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">第2条（基本方針）</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>職員は、自らのライフステージとキャリアビジョンに応じて働き方を選択できる</li>
              <li>法人は、各コースに応じた適切な処遇と役割を提供する</li>
              <li>コース選択は、職員の自主性を尊重しつつ、組織の要請とのバランスを図る</li>
              <li>コース変更は、柔軟かつ公平な手続きにより実施する</li>
            </ol>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">第3条（コースの種類）</h4>
            <p className="text-sm mb-2">キャリアコースは以下の4種類とする：</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Aコース（全面協力型）：施設間異動・業務変更に柔軟に対応</li>
              <li>Bコース（施設内協力型）：同一施設内での幅広い業務に対応</li>
              <li>Cコース（専門職型）：専門領域に特化した業務に従事</li>
              <li>Dコース（時短・制約あり型）：育児・介護等の制約に配慮した勤務</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 各コースの詳細 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">第2章 各コースの定義と待遇</h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">第4条（Aコース：全面協力型）</h3>
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">1. 定義</h4>
            <p className="text-sm mb-3">
              法人の人事異動・業務命令に全面的に協力し、法人全体の発展に貢献する働き方
            </p>
            <h4 className="font-semibold mb-2">2. 条件</h4>
            <ul className="text-sm space-y-1 mb-3">
              <li>• 施設間異動に応じる（法人グループ全施設が対象）</li>
              <li>• 業務変更・配置転換に柔軟に対応</li>
              <li>• フルタイム勤務（週40時間）</li>
              <li>• 残業対応可能（制限なし）</li>
            </ul>
            <h4 className="font-semibold mb-2">3. 待遇</h4>
            <ul className="text-sm space-y-1">
              <li>• 給与係数：1.2倍</li>
              <li>• 管理職登用：積極登用（全役職対象）</li>
              <li>• 研修機会：優先的に提供</li>
              <li>• 転勤手当：支給</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">第5条（Bコース：施設内協力型）</h3>
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">1. 定義</h4>
            <p className="text-sm mb-3">
              同一施設内での幅広い業務に従事し、施設の安定的運営に貢献する働き方
            </p>
            <h4 className="font-semibold mb-2">2. 条件</h4>
            <ul className="text-sm space-y-1 mb-3">
              <li>• 施設間異動：原則なし（同一施設内での勤務）</li>
              <li>• 業務変更：施設内で対応</li>
              <li>• フルタイム勤務（週40時間）</li>
              <li>• 残業対応可能（月20時間程度）</li>
            </ul>
            <h4 className="font-semibold mb-2">3. 待遇</h4>
            <ul className="text-sm space-y-1">
              <li>• 給与係数：1.1倍</li>
              <li>• 管理職登用：主任まで</li>
              <li>• 研修機会：施設内研修優先</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">第6条（Cコース：専門職型）</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">1. 定義</h4>
            <p className="text-sm mb-3">
              高度な専門性を活かし、特定領域に特化した業務に従事する働き方
            </p>
            <h4 className="font-semibold mb-2">2. 条件</h4>
            <ul className="text-sm space-y-1 mb-3">
              <li>• 業務：専門領域のみ</li>
              <li>• フルタイム勤務（週40時間）</li>
              <li>• 残業対応可能（月10時間程度）</li>
              <li>• 専門資格の取得・維持が推奨される</li>
            </ul>
            <h4 className="font-semibold mb-2">3. 待遇</h4>
            <ul className="text-sm space-y-1">
              <li>• 給与係数：1.0倍</li>
              <li>• 管理職登用：専門職登用（認定資格）</li>
              <li>• 研修機会：専門研修優先</li>
              <li>• 資格手当：別途支給</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">第7条（Dコース：時短・制約あり型）</h3>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">1. 定義</h4>
            <p className="text-sm mb-3">
              育児・介護等の事情により、勤務時間や業務内容に制約がある働き方
            </p>
            <h4 className="font-semibold mb-2">2. 条件</h4>
            <ul className="text-sm space-y-1 mb-3">
              <li>• 勤務時間：時短可能（週24～32時間）</li>
              <li>• 残業：原則なし（最大月5時間）</li>
              <li>• 業務：制限あり（時短勤務に適した業務）</li>
              <li>• 勤務地：固定</li>
            </ul>
            <h4 className="font-semibold mb-2">3. 待遇</h4>
            <ul className="text-sm space-y-1">
              <li>• 給与係数：0.9倍（時短時間に応じて調整）</li>
              <li>• 管理職登用：一般職のみ</li>
              <li>• 両立支援：育児・介護支援制度の利用可</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 変更手続き */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">第3章 コース変更手続き</h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">第8条（変更の種類）</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm mb-2">コース変更は以下の2種類とする：</p>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li><strong>定期変更：</strong>年1回、毎年3月1日に実施</li>
              <li><strong>特別変更：</strong>ライフイベント（結婚・出産・育児・介護・配偶者転勤・健康上の理由等）による随時変更</li>
            </ol>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">第9条（申請手続き）</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">1. 定期変更の申請</h4>
            <ul className="text-sm space-y-1 mb-3">
              <li>• 申請期間：前年12月1日～12月31日</li>
              <li>• 申請方法：VoiceDriveシステムからオンライン申請</li>
              <li>• 提出書類：キャリア選択申請書（システム上で入力）</li>
            </ul>
            <h4 className="font-semibold mb-2">2. 特別変更の申請</h4>
            <ul className="text-sm space-y-1">
              <li>• 申請時期：事由発生後速やかに</li>
              <li>• 申請方法：VoiceDriveシステムから特別変更申請</li>
              <li>• 提出書類：事由を証明する書類（母子手帳、介護認定通知等）</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">第10条（審査と承認）</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="text-sm space-y-2">
              <li>1. 法人人事部が申請内容を審査し、承認・却下を決定する</li>
              <li>2. 審査期間は申請受理後1～2週間とする</li>
              <li>3. 却下の場合は理由を付して本人に通知する</li>
              <li>4. 承認後、指定日から新コースを適用する</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 附則 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">附則</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p>1. 本規程は、2025年4月1日から施行する。</p>
          <p>2. 本規程の改廃は、理事会の決議による。</p>
          <p>3. 本規程に定めのない事項は、就業規則及び関連規程に従う。</p>
        </div>
      </div>
    </div>
  );
}
