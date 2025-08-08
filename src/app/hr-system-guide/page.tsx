'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';
import SheetPreviewModal from '@/components/SheetPreviewModal';
import InterviewSheetModal from '@/components/InterviewSheetModal';
import TrainingContent from './TrainingContent';

interface SheetItem {
  id: string;
  name: string;
  category: string;
  type: 'interview' | 'evaluation';
  version: string;
  facility?: string;
  position?: string;
  experience?: string;
  duration?: string;
  path: string;
  description: string;
}

export default function HRSystemGuidePage() {
  const [activeTab, setActiveTab] = useState<'evaluation' | 'interview' | 'training' | 'sheets' | 'guidelines'>('evaluation');
  const [guidelineSubTab, setGuidelineSubTab] = useState<'organization' | 'info-collection' | 'system-design' | 'trial-adjustment' | 'process'>('organization');
  const [viewMode, setViewMode] = useState<'general' | 'formal'>('general');
  const [sheetType, setSheetType] = useState<'all' | 'interview'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [previewSheet, setPreviewSheet] = useState<SheetItem | null>(null);

  // シートデータ（実際のファイル構造に基づく）
  const sheetData: SheetItem[] = [
    // v4面談シート
    { id: 'iv-1', name: '新人看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '新人', duration: '45分', path: 'v4_interview/new-nurse-unified-45min.tsx', description: '新人看護師向けの詳細な面談シート' },
    { id: 'iv-2', name: '一般看護師15分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '一般', duration: '15分', path: 'v4_interview/general-nurse-unified-15min.tsx', description: '日常的なショート面談用' },
    { id: 'iv-3', name: '一般看護師30分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '一般', duration: '30分', path: 'v4_interview/general-nurse-unified-30min.tsx', description: '定期面談用の標準シート' },
    { id: 'iv-4', name: '一般看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '一般', duration: '45分', path: 'v4_interview/general-nurse-unified-45min.tsx', description: '詳細な評価面談用' },
    { id: 'iv-5', name: 'リーダー看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: 'リーダー', duration: '45分', path: 'v4_interview/leader-nurse-unified-45min.tsx', description: 'リーダー層向け面談シート' },
    { id: 'iv-6', name: '主任看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '主任', duration: '45分', path: 'v4_interview/chief-nurse-unified-45min.tsx', description: '管理職向け面談シート' },
    { id: 'iv-8', name: 'ベテラン看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: 'ベテラン', duration: '45分', path: 'v4_interview/veteran-nurse-unified-45min.tsx', description: 'ベテラン層向け面談シート' }
  ];

  // フィルター処理
  const filteredSheets = sheetData.filter(sheet => {
    // テキスト検索
    if (searchQuery && !sheet.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !sheet.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // シートタイプフィルター
    if (sheetType !== 'all' && sheet.type !== sheetType) {
      return false;
    }
    
    // 施設フィルター
    if (selectedFacility !== 'all' && sheet.facility !== selectedFacility) {
      return false;
    }
    
    // 職種フィルター
    if (selectedPosition !== 'all' && sheet.position !== selectedPosition) {
      return false;
    }
    
    // 経験年数フィルター
    if (selectedExperience !== 'all' && sheet.experience !== selectedExperience) {
      return false;
    }
    
    return true;
  });

  // コンポーネントのレンダリング
  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="人事制度ガイド" />

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto p-6">
        {/* ページヘッダー */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">人事制度ガイド</h1>
          <p className="text-gray-600">
            医療法人厚生会の革新的な人事評価制度・面談制度について、職員の皆様にわかりやすくご説明します。
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
            <button
              onClick={() => setActiveTab('training')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'training'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              教育・研修制度
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'sheets'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📄 シート閲覧
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'guidelines'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 ガイドライン
            </button>
          </div>
        </div>

        {/* 人事評価制度の内容 */}
        {activeTab === 'evaluation' && (
          <>
            {/* 表示モード切り替え */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setViewMode('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'general'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📘 一般職員向け
              </button>
              <button
                onClick={() => setViewMode('formal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'formal'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📜 正式文書版
              </button>
            </div>

            {viewMode === 'general' && (
          <div className="space-y-6">
            {/* 概要 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">🎯</span>
                革新的な人事評価制度とは？
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  当法人では、<span className="font-bold text-blue-600">「施設内評価」と「法人内評価」の2つの軸</span>で
                  職員の皆様を評価する革新的な制度を導入しています。
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 font-semibold mb-2">なぜ2軸評価なの？</p>
                  <p className="text-gray-700">
                    小規模施設で頑張っている職員も、大規模施設で活躍している職員も、
                    それぞれの環境での貢献と法人全体での実力の両方を公平に評価できるからです。
                  </p>
                </div>
              </div>
            </div>

            {/* 2つの評価軸 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">2つの評価軸を理解しよう</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-5 border-2 border-green-200">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🏢</span>
                    施設内評価
                  </h4>
                  <p className="text-gray-700 mb-3">
                    あなたが働いている施設の中で、同じ職種の仲間と比べてどれくらい頑張っているかを評価します。
                  </p>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">この評価で分かること</p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>施設内でのあなたの位置づけが明確になり、日々の貢献が正当に評価されます</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>施設の規模に関係なく、その環境での頑張りが公平・客観的に可視化されます</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>チームへの貢献度や協調性が数値化され、1年間の成長が把握できます</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🏥</span>
                    法人内評価
                  </h4>
                  <p className="text-gray-700 mb-3">
                    法人全体（全施設）の同じ職種の職員と比べて、あなたの専門スキルや能力がどのレベルかを評価します。
                  </p>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">この評価で分かること</p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>法人全体でのあなたの専門性レベルが明確になり、キャリアパスの参考になります</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>自分のスキルや知識が法人内でどの位置にあるか客観的に把握できます</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>異動や昇進の際の適材適所の配置に活用され、あなたの強みを活かせます</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 評価プロセスの全体像 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">評価はどうやって決まるの？</h3>
              
              {/* ステップ説明 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">年間評価スケジュール</h4>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="font-bold text-lg text-blue-600">8月</p>
                      <p className="text-sm text-gray-700">夏季賞与査定</p>
                      <p className="text-xs text-gray-600">組織貢献度25点（施設12.5+法人12.5）</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-green-600">12月</p>
                      <p className="text-sm text-gray-700">冬季賞与査定</p>
                      <p className="text-xs text-gray-600">組織貢献度25点（施設12.5+法人12.5）</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-purple-600">3月</p>
                      <p className="text-sm text-gray-700">技術評価実施</p>
                      <p className="text-xs text-gray-600">技術評価50点</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-red-600">3月末</p>
                      <p className="text-sm text-gray-700">統合評価</p>
                      <p className="text-xs text-gray-600">100点満点で最終決定</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-700 mb-3">3つのステップで評価が決まります</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">評価シートで点数化（100点満点）</p>
                      <p className="text-sm text-gray-600">技術評価50点 + 施設貢献25点 + 法人貢献25点</p>
                      <p className="text-xs text-gray-500 mt-1">※施設内・法人内評価とも同じ100点満点の計算式を使用</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">点数を順位に変換</p>
                      <p className="text-sm text-gray-600">施設内と法人内でそれぞれ同職種内で順位を算出</p>
                      <p className="text-xs text-gray-500 mt-1">※同じ100点の得点を、評価範囲の違いによって2つの順位を算出</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">2軸評価で最終評価決定</p>
                      <p className="text-sm text-gray-600">順位をS〜Dランクに変換し、マトリックスで総合評価（S+〜D）</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 評価ランクとマトリクス */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">評価ランクの仕組み</h3>
              
              {/* 5段階評価 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">各軸での評価（5段階）</h4>
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center p-3 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-800">S</div>
                    <div className="text-xs text-gray-600">上位10%</div>
                    <div className="text-xs font-semibold">卓越</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-b from-green-100 to-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">A</div>
                    <div className="text-xs text-gray-600">上位11-30%</div>
                    <div className="text-xs font-semibold">優秀</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">B</div>
                    <div className="text-xs text-gray-600">上位31-70%</div>
                    <div className="text-xs font-semibold">標準</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-b from-orange-100 to-orange-200 rounded-lg">
                    <div className="text-2xl font-bold text-orange-800">C</div>
                    <div className="text-xs text-gray-600">上位71-90%</div>
                    <div className="text-xs font-semibold">要改善</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-b from-red-100 to-red-200 rounded-lg">
                    <div className="text-2xl font-bold text-red-800">D</div>
                    <div className="text-xs text-gray-600">下位10%</div>
                    <div className="text-xs font-semibold">要支援</div>
                  </div>
                </div>
              </div>

              {/* 総合評価マトリクス */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">2軸を組み合わせた総合評価</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-3 bg-gray-100 text-sm">法人内＼施設内</th>
                        <th className="border border-gray-300 p-3 bg-yellow-100 text-sm">S</th>
                        <th className="border border-gray-300 p-3 bg-green-100 text-sm">A</th>
                        <th className="border border-gray-300 p-3 bg-blue-100 text-sm">B</th>
                        <th className="border border-gray-300 p-3 bg-orange-100 text-sm">C</th>
                        <th className="border border-gray-300 p-3 bg-red-100 text-sm">D</th>
                      </tr>
                    </thead>
                    <tbody className="text-center text-sm font-semibold">
                      <tr>
                        <td className="border border-gray-300 p-3 bg-yellow-100">S</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                        <td className="border border-gray-300 p-3 bg-green-200 text-lg">A+</td>
                        <td className="border border-gray-300 p-3 bg-yellow-100 text-lg">S</td>
                        <td className="border border-gray-300 p-3 bg-yellow-100 text-lg">S</td>
                        <td className="border border-gray-300 p-3 bg-yellow-200 text-lg">S+</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 bg-green-100">A</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                        <td className="border border-gray-300 p-3 bg-green-200 text-lg">A+</td>
                        <td className="border border-gray-300 p-3 bg-yellow-100 text-lg">S</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 bg-blue-100">B</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                        <td className="border border-gray-300 p-3 bg-green-200 text-lg">A+</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 bg-orange-100">C</td>
                        <td className="border border-gray-300 p-3 bg-red-100 text-lg">D</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 bg-red-100">D</td>
                        <td className="border border-gray-300 p-3 bg-red-200 text-lg">D</td>
                        <td className="border border-gray-300 p-3 bg-red-100 text-lg">D</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  最終評価は7段階（S+, S, A+, A, B, C, D）で決まります
                </p>
              </div>
            </div>

            {/* 実際の評価項目 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ステップ1：評価シートで何が評価される？</h3>
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800 mb-2">技術評価（50点）- 360度評価</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-700 mb-2">評価の内訳：</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 上司評価：60%（30点）</li>
                        <li>• 自己評価：40%（20点）</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 mb-2">評価項目：</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 看護技術・専門知識</li>
                        <li>• 患者ケアの質</li>
                        <li>• 医療安全への取り組み</li>
                        <li>• チーム医療への貢献</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white rounded p-2 mt-3">
                    <p className="text-xs text-gray-600">
                      各項目をS（100%）〜D（40%）の5段階で評価し、重み付け計算で点数化
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">組織貢献評価（50点）- 相対評価</h4>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <div className="bg-white rounded p-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">施設貢献（25点）</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• 防災訓練参加</li>
                        <li>• 朝礼出席</li>
                        <li>• 勉強会開催</li>
                        <li>• 新人指導</li>
                      </ul>
                      <p className="text-xs text-blue-600 mt-2">
                        夏12.5点 + 冬12.5点の年2回査定
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        各施設独自の査定を順位化して配点
                      </p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">法人貢献度（12.5点×2期＝25点）</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• 学会発表</li>
                        <li>• 他施設支援</li>
                        <li>• 法人委員会</li>
                        <li>• 法人行事参加</li>
                      </ul>
                      <p className="text-xs text-blue-600 mt-2">
                        夏12.5点 + 冬12.5点の年2回査定
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        同職種内で順位化して0〜12.5点配点
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded p-3 mt-3">
                    <p className="text-xs text-gray-700">
                      <strong>重要：</strong>組織貢献査定は賞与だけでなく昇級にも反映されるようになりました。
                      施設や組織のために頑張る人、スキルや知識を活かす人が正当に評価されます。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 順位化のプロセス */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ステップ2：点数から順位への変換</h3>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3 font-semibold">
                  同じ100点満点の評価を、2つの視点で順位化します
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">施設内での順位付け</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      技術50点 + 施設貢献25点 + 法人貢献25点 = 100点
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      この100点を施設内の同職種で順位化
                    </p>
                    <div className="bg-white/80 rounded p-2">
                      <p className="text-xs text-gray-600">
                        例：A病院の看護師50名中、あなたは15位 → B評価
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">法人内での順位付け</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      技術50点 + 施設貢献25点 + 法人貢献25点 = 100点
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      同じ100点を法人内の同職種で順位化
                    </p>
                    <div className="bg-white/80 rounded p-2">
                      <p className="text-xs text-gray-600">
                        例：法人全体の看護師300名中、あなたは80位 → A評価
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 評価の活用 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">評価はどう活用される？</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">あなたにとってのメリット</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>小規模施設でも正当に評価される</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>キャリアパスが明確になる</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>適材適所の配置で働きやすくなる</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>頑張りが数値で見える化される</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">評価結果の使われ方</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <div>
                        <p className="font-semibold text-sm">昇給・賞与</p>
                        <p className="text-xs text-gray-600">主に施設内評価を基準</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="font-semibold text-sm">昇進・異動</p>
                        <p className="text-xs text-gray-600">総合評価を基準</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <p className="font-semibold text-sm">教育・研修</p>
                        <p className="text-xs text-gray-600">2軸の組み合わせで個別プラン</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            )}

            {/* 人事評価制度の正式文書版 */}
            {viewMode === 'formal' && (
          <div className="space-y-6">
            {/* 規程 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">人事評価規程</h2>
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-lg font-semibold mb-3">第1章 総則</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第1条（目的）</strong></p>
                  <p className="ml-4">
                    本規程は、医療法人厚生会（以下「当法人」という）における職員の人事評価制度に関し、
                    必要な事項を定めることにより、公正かつ透明性の高い人事管理を実現し、
                    職員の能力開発及び組織の活性化を図ることを目的とする。
                  </p>
                  
                  <p className="mt-4"><strong>第2条（評価の基本原則）</strong></p>
                  <p className="ml-4">
                    当法人の人事評価は、以下の原則に基づき実施する：<br/>
                    (1) 2軸評価システムによる多面的評価<br/>
                    (2) 客観的かつ定量的な評価基準の適用<br/>
                    (3) 施設規模による不公平の排除<br/>
                    (4) 継続的な成長支援の実現
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第2章 評価プロセス</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第3条（評価シートによる点数化）</strong></p>
                  <p className="ml-4">
                    職員の評価は、以下の2大要素により100点満点で採点する：<br/>
                    (1) 技術評価（50点）：360度評価により専門技術・知識を評価<br/>
                    　　・上司評価60%（30点）、自己評価40%（20点）<br/>
                    (2) 組織貢献度評価（50点）：年2回の賞与査定時に評価<br/>
                    　　・施設貢献度（12.5点×2期＝25点）：施設内活動ポイントの相対評価<br/>
                    　　・法人貢献度（12.5点×2期＝25点）：法人全体活動ポイントの相対評価
                  </p>
                  
                  <p className="mt-4"><strong>第4条（順位の算出）</strong></p>
                  <p className="ml-4">
                    前条の合計点数に基づき、以下の順位を算出する：<br/>
                    (1) 施設内順位：同一施設・同一職種内での相対順位<br/>
                    (2) 法人内順位：法人全体・同一職種内での相対順位
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第3章 2軸評価システム</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第5条（評価軸の定義）</strong></p>
                  <p className="ml-4">
                    前章で算出した順位を、以下の2軸に変換する：<br/>
                    (1) 施設内評価：施設内順位をS〜Dの5段階に変換<br/>
                    (2) 法人内評価：法人内順位をS〜Dの5段階に変換
                  </p>
                  
                  <p className="mt-4"><strong>第6条（評価ランク）</strong></p>
                  <p className="ml-4">
                    各評価軸において、以下の5段階評価を適用する：<br/>
                    S：上位10%（卓越）<br/>
                    A：上位11-30%（優秀）<br/>
                    B：上位31-70%（標準）<br/>
                    C：上位71-90%（要改善）<br/>
                    D：下位10%（要支援）
                  </p>

                  <p className="mt-4"><strong>第7条（総合評価）</strong></p>
                  <p className="ml-4">
                    施設内評価と法人内評価のマトリクスにより、
                    7段階の総合評価（S+, S, A+, A, B, C, D）を決定する。
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第4章 評価の実施</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第8条（評価期間）</strong></p>
                  <p className="ml-4">
                    評価は年度を単位として実施し、4月1日から翌年3月31日までを評価期間とする。
                  </p>
                  
                  <p className="mt-4"><strong>第7条（評価項目）</strong></p>
                  <p className="ml-4">
                    評価は以下の項目により構成される：<br/>
                    (1) 技術評価（50点）：360度評価方式による専門技術の評価<br/>
                    (2) 組織貢献度評価（50点）：年2回の賞与査定時評価<br/>
                    　　・施設貢献度（12.5点×2期＝25点）<br/>
                    　　・法人貢献度（12.5点×2期＝25点）
                  </p>
                </div>
              </div>
            </div>
          </div>
            )}
          </>
        )}

        {/* 面談制度の内容 */}
        {activeTab === 'interview' && (
          <>
            {/* 表示モード切り替え */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setViewMode('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'general'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📘 一般職員向け
              </button>
              <button
                onClick={() => setViewMode('formal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'formal'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📜 正式文書版
              </button>
            </div>

            {viewMode === 'general' && (
          <div className="space-y-6">
            {/* 概要 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">💬</span>
                面談制度の概要
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  面談制度は、職員一人ひとりの声を聞き、働きやすい職場環境を作るための重要な仕組みです。
                  上司と部下の定期的なコミュニケーションを通じて、個人のキャリア形成支援と組織全体の活性化を図ります。
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 font-semibold mb-2">面談制度の3つの目的</p>
                  <ul className="text-gray-700 space-y-1">
                    <li>🎯 個人のキャリア形成・成長支援</li>
                    <li>🎯 早期の問題発見と解決</li>
                    <li>🎯 組織全体のコミュニケーション向上</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-4">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">📱 VoiceDrive連携予定</p>
                  <p className="text-xs text-gray-700">
                    法人内SNS「VoiceDrive」と連携し、職員からも簡単に面談予約ができるようになる予定です。
                  </p>
                </div>
              </div>
            </div>

            {/* 10種類の面談 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">10種類の面談体系</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* 定期面談 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    定期面談（必須）
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-blue-800">新入職員月次面談</span>
                        <span className="text-xs bg-blue-200 px-2 py-1 rounded">月1回</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">入職1年未満の職員対象</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-blue-800">一般職員年次面談</span>
                        <span className="text-xs bg-blue-200 px-2 py-1 rounded">年1回</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">全職員対象</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-blue-800">管理職半年面談</span>
                        <span className="text-xs bg-blue-200 px-2 py-1 rounded">半年1回</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">管理職対象</p>
                    </div>
                  </div>
                </div>

                {/* 特別面談 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🔧</span>
                    特別面談（随時）
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white/80 rounded p-2">
                      <span className="font-semibold text-green-800">復職面談</span>
                      <p className="text-xs text-gray-600 mt-1">休職からの復職時に実施</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <span className="font-semibold text-green-800">インシデント後面談</span>
                      <p className="text-xs text-gray-600 mt-1">インシデント発生後のフォロー</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <span className="font-semibold text-green-800">退職面談</span>
                      <p className="text-xs text-gray-600 mt-1">退職予定者との最終面談</p>
                    </div>
                  </div>
                </div>

                {/* サポート面談 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 md:col-span-2">
                  <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">💭</span>
                    サポート面談（希望制）
                  </h4>
                  <div className="grid md:grid-cols-5 gap-2">
                    <div className="bg-white/80 rounded p-2">
                      <span className="font-semibold text-purple-800 text-sm">キャリア開発面談</span>
                      <p className="text-xs text-gray-600 mt-1">キャリアプランの相談</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <span className="font-semibold text-purple-800 text-sm">ストレスケア面談</span>
                      <p className="text-xs text-gray-600 mt-1">メンタルヘルスサポート</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <span className="font-semibold text-purple-800 text-sm">苦情・相談面談</span>
                      <p className="text-xs text-gray-600 mt-1">職場の問題や悩み相談</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <span className="font-semibold text-purple-800 text-sm">評価フィードバック面談</span>
                      <p className="text-xs text-gray-600 mt-1">評価結果の詳細説明</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <span className="font-semibold text-purple-800 text-sm">随時面談</span>
                      <p className="text-xs text-gray-600 mt-1">その他必要時</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 重要な注意事項 */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-sm font-semibold text-yellow-800 mb-1">💡 重要なポイント</p>
                <p className="text-xs text-gray-700">
                  全ての面談は「評価」ではなく「支援」が目的です。人事評価とは完全に切り離されており、職員の成長と働きやすさの向上を目指しています。
                </p>
              </div>
            </div>

            {/* 13種類の相談カテゴリ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">相談できる13のカテゴリ</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">キャリア系</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• キャリアパス（将来の目標）</li>
                    <li>• スキル開発（研修・資格）</li>
                    <li>• 昇進・昇格</li>
                    <li>• 異動・転勤</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">職場環境系</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 職場環境（設備・制度）</li>
                    <li>• 人間関係（チームワーク）</li>
                    <li>• 業務負荷・ワークライフバランス</li>
                    <li>• 健康・安全</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 text-sm mb-2">その他</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• パフォーマンス（業務改善）</li>
                    <li>• 給与・待遇</li>
                    <li>• 研修・教育</li>
                    <li>• コンプライアンス</li>
                    <li>• その他の相談</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 予約と実施のルール */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">予約と実施のルール</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-blue-500">📅</span>
                    予約ルール
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="font-medium">予約可能期間</p>
                        <p className="text-xs text-gray-600">30日前から24時間前まで</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="font-medium">予約回数制限</p>
                        <p className="text-xs text-gray-600">月間最大2回（特別な事情は3回）</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="font-medium">間隔制限</p>
                        <p className="text-xs text-gray-600">前回面談から30日以上</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="font-medium">面談時間</p>
                        <p className="text-xs text-gray-600">基本30分（延長可能45分）</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-green-500">🏥</span>
                    部署別の配慮
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="border-l-3 border-blue-400 pl-3">
                      <p className="font-medium">ICU</p>
                      <p className="text-xs text-gray-600">早い時間帯（13:40-14:20）優先</p>
                    </div>
                    <div className="border-l-3 border-green-400 pl-3">
                      <p className="font-medium">救急外来</p>
                      <p className="text-xs text-gray-600">遅い時間帯（15:30-16:10）優先</p>
                    </div>
                    <div className="border-l-3 border-purple-400 pl-3">
                      <p className="font-medium">手術室</p>
                      <p className="text-xs text-gray-600">月曜日は面談不可（手術集中日）</p>
                    </div>
                    <div className="border-l-3 border-orange-400 pl-3">
                      <p className="font-medium">夜勤明け</p>
                      <p className="text-xs text-gray-600">十分な休息後に実施</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 予約の流れ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">簡単3ステップの予約方法</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">日時選択</h4>
                  <p className="text-sm text-gray-600">
                    カレンダーから希望日時を選択（最大3つまで候補選択可）
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">内容入力</h4>
                  <p className="text-sm text-gray-600">
                    面談種類・カテゴリを選択、相談内容を記入（任意）
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">確認・申請</h4>
                  <p className="text-sm text-gray-600">
                    内容確認後に申請、自動でメール通知が送信されます
                  </p>
                </div>
              </div>
            </div>

            {/* リマインダー機能 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">自動リマインダー機能</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  面談を忘れないよう、自動でリマインダーが送信されます。
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">定期面談のリマインダー</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• 新入職員月次：14日前、7日前、3日前</li>
                      <li>• 一般職員年次：30日前、14日前、7日前</li>
                      <li>• その他の面談：7日前、3日前、前日</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">通知方法</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• メール通知（必須）</li>
                      <li>• システム内通知</li>
                      <li>• 期限超過時は最大3回まで自動通知</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 権限管理とアクセス制御 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">権限管理システム</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 font-semibold">レベル</th>
                      <th className="text-left p-2 font-semibold">役職・部門</th>
                      <th className="text-left p-2 font-semibold">主な権限</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">L1-4</td>
                      <td className="p-2">一般職員〜課長</td>
                      <td className="p-2 text-xs">自分の面談予約・確認のみ</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-2 font-medium">L5</td>
                      <td className="p-2">戦略企画・統括管理部門</td>
                      <td className="p-2 text-xs">予約管理、スケジュール調整</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">L6</td>
                      <td className="p-2">キャリア支援部門員</td>
                      <td className="p-2 text-xs">面談実施、記録作成</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-2 font-medium">L7-8</td>
                      <td className="p-2">各部門長・統括管理部門長</td>
                      <td className="p-2 text-xs">面談実施、統計確認</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">L9-10</td>
                      <td className="p-2">部長級以上</td>
                      <td className="p-2 text-xs">システム全体の管理</td>
                    </tr>
                  </tbody>
                </table>
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
                    面談者の心構え
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
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-semibold text-orange-800 mb-1">🎯 面談者について</p>
                <p className="text-xs text-gray-700">
                  専門の研修を受けた面談担当者が実施します。直属の上司ではありませんので、安心してお話しください。
                </p>
              </div>
            </div>

            {/* プライバシーとセキュリティ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">プライバシーと守秘義務</h3>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
                <p className="text-sm font-semibold text-red-800 mb-2">🔒 厳格な情報管理</p>
                <p className="text-xs text-gray-700">
                  面談内容は機密性レベルに応じてアクセス制限され、個人情報保護法に準拠した管理が行われます。
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">👤 職員の権利</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 自分の面談記録の閲覧・確認可能</li>
                    <li>• 退職時の記録削除要求可能</li>
                    <li>• 面談内容の録音は行わない</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">🎯 情報の取り扱い</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 本人同意なく上司への個人特定情報開示は禁止</li>
                    <li>• 組織改善に必要な情報は匿名化して共有</li>
                    <li>• SSL/TLS暗号化通信でデータ保護</li>
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
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800 mb-1">✅ 自動選択機能</p>
                  <p className="text-xs text-gray-700">
                    勤続年数に基づいて適切な面談シートが自動選択されます。
                    15分・30分・45分版から面談の目的に応じて選択可能です。
                  </p>
                </div>
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

            {/* システム連携と将来計画 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">システム連携と将来計画</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                  <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🔗</span>
                    現在進行中の連携
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500">•</span>
                      <div>
                        <p className="font-semibold">VoiceDrive連携</p>
                        <p className="text-xs text-gray-600">法人内SNSとの統合で職員からの予約を簡素化</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500">•</span>
                      <div>
                        <p className="font-semibold">共通データベース</p>
                        <p className="text-xs text-gray-600">データの一元管理を実現</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500">•</span>
                      <div>
                        <p className="font-semibold">API連携基盤</p>
                        <p className="text-xs text-gray-600">将来的なシステム間連携のための基盤構築</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
                  <h4 className="font-bold text-teal-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    将来の拡張予定
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <div>
                        <p className="font-semibold">AI分析機能</p>
                        <p className="text-xs text-gray-600">面談内容の分析と提案</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <div>
                        <p className="font-semibold">オンライン面談</p>
                        <p className="text-xs text-gray-600">リモート面談の実現</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <div>
                        <p className="font-semibold">モバイルアプリ</p>
                        <p className="text-xs text-gray-600">いつでもどこでも予約可能</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <div>
                        <p className="font-semibold">勤怠・人事評価連携</p>
                        <p className="text-xs text-gray-600">シームレスな情報統合</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
            )}

            {/* 面談制度の内容（正式文書版） */}
            {viewMode === 'formal' && (
          <div className="space-y-6">
            {/* 面談規程 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">面談制度規程</h2>
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-lg font-semibold mb-3">第1章 総則</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第1条（目的）</strong></p>
                  <p className="ml-4">
                    本規程は、当法人における面談制度に関し必要な事項を定め、
                    人事評価制度と連携した効果的な人材育成を実現することを目的とする。
                  </p>
                  
                  <p className="mt-4"><strong>第2条（面談の定義）</strong></p>
                  <p className="ml-4">
                    面談とは、目標設定・中間評価・年度評価を一体化した形式であり、
                    職員の成長段階と必要性に応じて実施時間を選択する柔軟な面談制度とする。
                  </p>

                  <p className="mt-4"><strong>第3条（面談時間の区分）</strong></p>
                  <p className="ml-4">
                    面談は以下の3つの時間区分で実施する：<br/>
                    (1) 15分面談：日常的なコミュニケーション重視<br/>
                    (2) 30分面談：定期的な進捗確認と課題共有<br/>
                    (3) 45分面談：詳細な評価と成長支援計画策定
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第2章 職位別面談基準</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第4条（新人職員）</strong></p>
                  <p className="ml-4">
                    新人職員（入職1年目）は、原則として45分面談を四半期ごとに実施する。
                    成長状況に応じて、追加の15分面談を月1回実施することができる。
                  </p>
                  
                  <p className="mt-4"><strong>第5条（一般職員）</strong></p>
                  <p className="ml-4">
                    一般職員は以下の頻度で実施する：<br/>
                    (1) 15分面談：月1回（任意）<br/>
                    (2) 30分面談：四半期ごと<br/>
                    (3) 45分面談：年2回（中間・年度評価時）
                  </p>

                  <p className="mt-4"><strong>第6条（中堅・シニア職員）</strong></p>
                  <p className="ml-4">
                    中堅・シニア職員は、30分面談を四半期ごと、
                    45分面談を年度評価時に実施する。
                  </p>

                  <p className="mt-4"><strong>第7条（管理職）</strong></p>
                  <p className="ml-4">
                    リーダー・主任等の管理職は、45分面談を四半期ごとに実施し、
                    部下育成計画と組織運営について協議する。
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第3章 2軸評価との連携</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第8条（評価結果の活用）</strong></p>
                  <p className="ml-4">
                    面談時には、2軸評価（施設内評価・法人内評価）の結果を基に、
                    以下の事項を必ず確認する：<br/>
                    (1) 施設内での相対的な位置づけ<br/>
                    (2) 法人全体での専門性レベル<br/>
                    (3) 総合評価（S+～D）と改善点<br/>
                    (4) キャリアパスと成長目標
                  </p>
                  
                  <p className="mt-4"><strong>第9条（フィードバック方法）</strong></p>
                  <p className="ml-4">
                    評価結果のフィードバックは、評価マトリクスを視覚的に示しながら、
                    具体的な改善策と成長支援策を提示する。
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第4章 面談シートの管理</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第10条（面談シート）</strong></p>
                  <p className="ml-4">
                    面談は、職位と時間に応じた面談シートを使用する。
                    シートは人事部が管理し、最新版を常に利用可能な状態に維持する。
                  </p>
                  
                  <p className="mt-4"><strong>第11条（記録の保管）</strong></p>
                  <p className="ml-4">
                    面談記録は電子化し、人事システムで一元管理する。
                    保管期間は5年間とし、本人の求めに応じて開示する。
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第5章 面談の種別</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第12条（面談の種別）</strong></p>
                  <p className="ml-4">
                    当法人の面談は、以下の3種別10種類とする：
                  </p>
                  
                  <p className="mt-3 ml-4"><strong>1. 定期面談（3種類）</strong></p>
                  <p className="ml-6">
                    (1) 新入職員月次面談：入職1年未満の職員を対象に月1回実施<br/>
                    (2) 一般職員年次面談：全職員を対象に年1回実施<br/>
                    (3) 管理職半年面談：管理職を対象に半年1回実施
                  </p>
                  
                  <p className="mt-3 ml-4"><strong>2. 特別面談（3種類）</strong></p>
                  <p className="ml-6">
                    (1) 復職面談：休職からの復職時に実施<br/>
                    (2) インシデント後面談：インシデント発生後のフォローとして実施<br/>
                    (3) 退職面談：退職予定者との最終面談
                  </p>
                  
                  <p className="mt-3 ml-4"><strong>3. サポート面談（5種類）</strong></p>
                  <p className="ml-6">
                    (1) キャリア開発面談：キャリアプランの相談（希望者、随時）<br/>
                    (2) ストレスケア面談：メンタルヘルスサポート（希望者、随時）<br/>
                    (3) 苦情・相談面談：職場の問題や悩み相談（希望者、随時）<br/>
                    (4) 評価フィードバック面談：評価結果の詳細説明（希望者、評価開示後1ヶ月以内）<br/>
                    (5) 随時面談：その他必要時（希望者、随時）
                  </p>
                  
                  <p className="mt-4"><strong>第13条（面談と評価の分離）</strong></p>
                  <p className="ml-4">
                    全ての面談は「支援」を目的とし、人事評価とは完全に分離して実施する。
                    評価フィードバック面談においても、評価者ではない人事部が中立的立場から
                    キャリア支援を中心とした建設的な対話を行うものとする。
                  </p>
                </div>
              </div>
            </div>

            {/* 面談実施要領 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">面談実施要領</h3>
              <div className="space-y-4 text-sm">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">1. 面談時間の選択基準</h4>
                  <table className="ml-4 w-full text-gray-600">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">状況</th>
                        <th className="text-left py-1">推奨時間</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1">日常的な確認・相談</td>
                        <td className="py-1">15分</td>
                      </tr>
                      <tr>
                        <td className="py-1">定期面談・進捗確認</td>
                        <td className="py-1">30分</td>
                      </tr>
                      <tr>
                        <td className="py-1">評価面談・キャリア相談</td>
                        <td className="py-1">45分</td>
                      </tr>
                      <tr>
                        <td className="py-1">問題解決・緊急対応</td>
                        <td className="py-1">45分</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">2. 2軸評価の説明方法</h4>
                  <ul className="ml-4 space-y-1 text-gray-600">
                    <li>• 評価マトリクス表を用いて視覚的に説明</li>
                    <li>• 施設内順位：「あなたの施設での位置は上位◯%」</li>
                    <li>• 法人内順位：「法人全体での専門性は上位◯%」</li>
                    <li>• 総合評価の意味と今後の目標を明確化</li>
                    <li>• 他施設への異動可能性についても言及</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">3. 職位別重点項目</h4>
                  <ul className="ml-4 space-y-1 text-gray-600">
                    <li><strong>新人：</strong>基礎技術習得、職場適応、メンタルサポート</li>
                    <li><strong>一般：</strong>専門性向上、チーム貢献、目標達成</li>
                    <li><strong>中堅：</strong>後輩指導、業務改善、リーダーシップ</li>
                    <li><strong>シニア：</strong>専門性発揮、知識伝承、組織貢献</li>
                    <li><strong>管理職：</strong>部下育成、組織運営、戦略実行</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">4. 面談後のアクション</h4>
                  <ul className="ml-4 space-y-1 text-gray-600">
                    <li>• 面談シートを3日以内に人事部提出</li>
                    <li>• 合意した目標・改善策を文書化</li>
                    <li>• 次回面談日程の設定（その場で決定）</li>
                    <li>• 必要に応じて教育研修の申込み</li>
                    <li>• 重要事項は部門長・人事部と共有</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* シート一覧 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">面談シート一覧</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2">職位</th>
                      <th className="text-left py-2">15分版</th>
                      <th className="text-left py-2">30分版</th>
                      <th className="text-left py-2">45分版</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">新人看護師</td>
                      <td>○</td>
                      <td>○</td>
                      <td>◎（推奨）</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">一般看護師</td>
                      <td>○</td>
                      <td>◎（推奨）</td>
                      <td>○</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">中堅看護師</td>
                      <td>-</td>
                      <td>◎（推奨）</td>
                      <td>○</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">シニア看護師</td>
                      <td>-</td>
                      <td>○</td>
                      <td>◎（推奨）</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">ベテラン看護師</td>
                      <td>-</td>
                      <td>○</td>
                      <td>◎（推奨）</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">リーダー看護師</td>
                      <td>-</td>
                      <td>-</td>
                      <td>◎（必須）</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">主任看護師</td>
                      <td>-</td>
                      <td>-</td>
                      <td>◎（必須）</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-600 mt-2">◎：推奨/必須　○：利用可　-：該当なし</p>
              </div>
            </div>
          </div>
            )}
          </>
        )}

        {/* 教育・研修制度のコンテンツ */}
        {activeTab === 'training' && (
          <>
            {/* 表示モード切り替え */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setViewMode('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'general'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📘 一般職員向け
              </button>
              <button
                onClick={() => setViewMode('formal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'formal'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📜 正式文書版
              </button>
            </div>
            
            <TrainingContent viewMode={viewMode} />
          </>
        )}

        {/* シート閲覧セクション */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            {/* 検索・フィルターセクション */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">シート検索・フィルター</h2>
              
              {/* 検索バー */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="シート名や説明文で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* フィルターボタン */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {/* シートタイプ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">種類</label>
                  <select
                    value={sheetType}
                    onChange={(e) => setSheetType(e.target.value as 'all' | 'interview')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">すべて</option>
                    <option value="interview">面談シート</option>
                  </select>
                </div>

                {/* 施設タイプ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">施設</label>
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">すべて</option>
                    <option value="急性期">急性期</option>
                    <option value="慢性期">慢性期</option>
                    <option value="老健">老健</option>
                    <option value="グループホーム">グループホーム</option>
                  </select>
                </div>

                {/* 職種 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">職種</label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">すべて</option>
                    <option value="看護師">看護師</option>
                    <option value="准看護師">准看護師</option>
                    <option value="看護補助者">看護補助者</option>
                    <option value="介護士">介護士</option>
                  </select>
                </div>

                {/* 経験年数 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">経験</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">すべて</option>
                    <option value="新人">新人</option>
                    <option value="一般">一般</option>
                    <option value="中堅">中堅</option>
                    <option value="シニア">シニア</option>
                    <option value="ベテラン">ベテラン</option>
                    <option value="リーダー">リーダー</option>
                    <option value="主任">主任</option>
                  </select>
                </div>

                {/* リセットボタン */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSheetType('all');
                      setSelectedFacility('all');
                      setSelectedPosition('all');
                      setSelectedExperience('all');
                    }}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    リセット
                  </button>
                </div>
              </div>
            </div>

            {/* 検索結果 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                シート一覧 ({filteredSheets.length}件)
              </h2>

              {filteredSheets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  該当するシートが見つかりませんでした
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredSheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {sheet.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                sheet.type === 'interview'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {sheet.type === 'interview' ? '面談' : '評価'}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {sheet.version}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{sheet.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {sheet.facility && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                                {sheet.facility}
                              </span>
                            )}
                            {sheet.position && (
                              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                                {sheet.position}
                              </span>
                            )}
                            {sheet.experience && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                                {sheet.experience}
                              </span>
                            )}
                            {sheet.duration && (
                              <span className="px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded">
                                {sheet.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              // TSXファイルパスはそのまま使用
                              setPreviewSheet(sheet);
                            }}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            👁️ プレビュー
                          </button>
                          <button
                            onClick={() => {
                              // TSXファイルパスをそのまま使用してダウンロード
                              const downloadUrl = `/api/download-sheet?path=${encodeURIComponent(sheet.path)}&name=${encodeURIComponent(sheet.name)}`;
                              window.open(downloadUrl, '_blank');
                            }}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            ⬇️ ダウンロード
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 使い方ガイド */}
            <div className="bg-yellow-50 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-3">💡 シート利用ガイド</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">面談シートの使い方</h4>
                  <ul className="space-y-1">
                    <li>• 面談前に該当するシートをダウンロード</li>
                    <li>• 事前に記入できる項目は準備</li>
                    <li>• 面談時は印刷して持参、または画面で確認</li>
                    <li>• 面談後は人事部に提出</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">評価システムの使い方</h4>
                  <ul className="space-y-1">
                    <li>• <a href="/evaluation" className="text-blue-600 hover:underline">新評価システム</a>から施設・職種・経験に応じた評価シートを選択</li>
                    <li>• 評価期間前に評価項目を確認</li>
                    <li>• 自己評価と上司評価の両方を記入</li>
                    <li>• 2軸評価（施設内・法人内）を理解</li>
                    <li>• 評価結果は面談でフィードバック</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* ガイドラインセクション */}
        {activeTab === 'guidelines' && (
          <div className="space-y-6">
            {/* サブタブ切り替え */}
            <div className="bg-white rounded-xl shadow-lg p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setGuidelineSubTab('organization')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    guidelineSubTab === 'organization'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🏭 組織体制
                </button>
                <button
                  onClick={() => setGuidelineSubTab('info-collection')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    guidelineSubTab === 'info-collection'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔍 情報収集フェーズ
                </button>
                <button
                  onClick={() => setGuidelineSubTab('system-design')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    guidelineSubTab === 'system-design'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📝 制度設計フェーズ
                </button>
                <button
                  onClick={() => setGuidelineSubTab('trial-adjustment')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    guidelineSubTab === 'trial-adjustment'
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔄 試行・調整フェーズ
                </button>
                <button
                  onClick={() => setGuidelineSubTab('process')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    guidelineSubTab === 'process'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📊 評価プロセス
                </button>
              </div>
            </div>

            {/* 組織体制タブ */}
            {guidelineSubTab === 'organization' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
              {/* ヘッダー部分 */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
                <div>
                  <div className="text-sm text-gray-500 mb-1">内部検討資料</div>
                  <h2 className="text-2xl font-bold text-gray-800">人財統括本部準備室 配置案</h2>
                  <p className="text-gray-600 mt-2">現場の声を丁寧に収集し、実態に即した制度設計を行う・リスクを最小化して着実に基盤を構築</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-2">
                    <span className="mr-2 text-blue-600">📅</span>
                    <span className="text-blue-800 font-medium">実施期間: 2025年7月～2026年3月</span>
                  </div>
                  <div className="flex items-center justify-end mb-2">
                    <span className="mr-2 text-green-600">🎯</span>
                    <span className="text-green-800 font-medium">配置方針: 現場情報収集と課題抽出に重点</span>
                  </div>
                  <div className="text-sm text-gray-600">作成者：徳留</div>
                </div>
              </div>

              {/* 準備室体制案 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-blue-500">
                  <span className="mr-2 text-blue-600">💼</span>
                  準備室組織体制案（焦点集中型体制ベース）
                </h3>
                
                <div className="border border-blue-200 rounded-lg overflow-hidden shadow-md">
                  <div className="bg-blue-600 text-white p-3">
                    <h4 className="text-lg font-bold">準備室段階・情報収集重点型配置案</h4>
                    <p className="text-sm text-white text-opacity-90">現場の声を丁寧に収集し、実態に即した制度設計を行う体制</p>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <h5 className="font-bold text-blue-800 mb-2 text-sm">組織図</h5>
                      <div className="bg-white p-3 border border-blue-100 rounded-lg">
                        <div className="flex flex-col items-center">
                          {/* トップ部門 */}
                          <div className="w-80 mb-3 border-2 border-blue-400 rounded-lg p-3 bg-blue-50 shadow-md">
                            <h6 className="font-bold text-blue-800 text-sm flex items-center">
                              <span className="mr-1">💼</span>
                              戦略企画・統括管理部門（準備室）
                            </h6>
                            <div className="mt-2 border-t border-blue-100 pt-2">
                              <div className="space-y-1 text-xs">
                                <div className="flex items-start">
                                  <span className="mr-1 text-blue-600">⭐</span>
                                  <span><strong>リーダー：廻 茂樹（総師長）</strong> - 全体統括・法人との連携調整</span>
                                </div>
                                <div className="flex items-start">
                                  <span className="mr-1 text-blue-600">✓</span>
                                  <span><strong>サポート：徳留 拓哉</strong> - 準備室運営・進捗管理・法人連携連絡会議での活動報告と提言</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 詳細は後で追加 */}
              <div className="text-sm text-gray-500 italic">
                ※ 詳細な組織構成と稼働率計画は別途資料参照
              </div>
              </div>
            )}

            {/* 情報収集フェーズタブ */}
            {guidelineSubTab === 'info-collection' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* ヘッダー部分 */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">内部検討資料</div>
                    <h2 className="text-2xl font-bold text-gray-800">情報収集フェーズ行動計画書</h2>
                    <p className="text-gray-600 mt-2">現場の声を丁寧に収集し、実態に即した制度設計のための基盤づくり</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      <span className="mr-2 text-green-600">📅</span>
                      <span className="text-green-800 font-medium">実施期間: 2025年7月～10月</span>
                    </div>
                    <div className="flex items-center justify-end mb-2">
                      <span className="mr-2 text-green-600">🎯</span>
                      <span className="text-green-800 font-medium">重点方針: 現場の声収集と課題抽出</span>
                    </div>
                  </div>
                </div>

                {/* 全体スケジュール */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-green-500">
                    <span className="mr-2 text-green-600">🕰️</span>
                    全体スケジュール
                  </h3>
                  
                  <div className="border border-green-200 rounded-lg overflow-hidden shadow-md">
                    <div className="bg-green-600 text-white p-3">
                      <h4 className="text-lg font-bold">4ヶ月間の段階的アプローチ</h4>
                      <p className="text-sm text-white text-opacity-90">現場との信頼関係構築から本格的な課題抽出まで</p>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h5 className="font-bold text-green-800 mb-2 flex items-center text-sm">
                            <span className="mr-1">📅</span>
                            7月：基盤づくり
                          </h5>
                          <ul className="text-xs space-y-1">
                            <li>• キックオフ会議</li>
                            <li>• 管理職説明会</li>
                            <li>• 運営ルール確立</li>
                            <li>• 現状把握開始</li>
                          </ul>
                        </div>
                        <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                          <h5 className="font-bold text-green-800 mb-2 flex items-center text-sm">
                            <span className="mr-1">🔍</span>
                            8月：本格収集
                          </h5>
                          <ul className="text-xs space-y-1">
                            <li>• 現場ヒアリング開始</li>
                            <li>• アンケート実施</li>
                            <li>• 養成校訪問</li>
                            <li>• データ収集本格化</li>
                          </ul>
                        </div>
                        <div className="bg-green-200 border border-green-400 rounded-lg p-3">
                          <h5 className="font-bold text-green-800 mb-2 flex items-center text-sm">
                            <span className="mr-1">📋</span>
                            9月：深掘り分析
                          </h5>
                          <ul className="text-xs space-y-1">
                            <li>• 課題の詳細分析</li>
                            <li>• 他法人事例研究</li>
                            <li>• 制度比較検討</li>
                            <li>• 優先順位検討</li>
                          </ul>
                        </div>
                        <div className="bg-green-300 border border-green-500 rounded-lg p-3">
                          <h5 className="font-bold text-green-800 mb-2 flex items-center text-sm">
                            <span className="mr-1">📄</span>
                            10月：まとめ
                          </h5>
                          <ul className="text-xs space-y-1">
                            <li>• 課題整理・統合</li>
                            <li>• 制度設計準備</li>
                            <li>• 次フェーズ計画</li>
                            <li>• 中間報告</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 italic">
                  ※ 詳細な部門別行動計画と成果指標は別途資料参照
                </div>
              </div>
            )}

            {/* 制度設計フェーズタブ */}
            {guidelineSubTab === 'system-design' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* ヘッダー部分 */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">内部検討資料</div>
                    <h2 className="text-2xl font-bold text-gray-800">制度設計フェーズ行動計画書</h2>
                    <p className="text-gray-600 mt-2">現場の声を反映した実践的制度設計・効果的な人材育成プログラムの構築</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      <span className="mr-2 text-blue-600">📅</span>
                      <span className="text-blue-800 font-medium">実施期間: 2025年11月～2026年1月</span>
                    </div>
                    <div className="flex items-center justify-end mb-2">
                      <span className="mr-2 text-blue-600">🎯</span>
                      <span className="text-blue-800 font-medium">重点方針: 現場ニーズ反映の制度設計</span>
                    </div>
                  </div>
                </div>

                {/* 全体スケジュール */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-blue-500">
                    <span className="mr-2 text-blue-600">✏️</span>
                    全体スケジュール
                  </h3>
                  
                  <div className="border border-blue-200 rounded-lg overflow-hidden shadow-md">
                    <div className="bg-blue-600 text-white p-3">
                      <h4 className="text-lg font-bold">3ヶ月間の集中的制度構築</h4>
                      <p className="text-sm text-white text-opacity-90">情報収集結果を基にした実践的制度設計から試行準備まで</p>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h5 className="font-bold text-blue-800 mb-2 flex items-center text-sm">
                            <span className="mr-1">📅</span>
                            11月：基本設計
                          </h5>
                          <ul className="text-xs space-y-1">
                            <li>• 情報収集結果分析・整理</li>
                            <li>• 制度設計方針決定</li>
                            <li>• 評価制度素案作成開始</li>
                            <li>• 研修体系基本構造設計</li>
                          </ul>
                        </div>
                        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                          <h5 className="font-bold text-blue-800 mb-2 flex items-center text-sm">
                            <span className="mr-1">⚙️</span>
                            12月：詳細設計
                          </h5>
                          <ul className="text-xs space-y-1">
                            <li>• 各制度の詳細設計</li>
                            <li>• 面談制度運用方法確定</li>
                            <li>• 採用戦略具体化</li>
                            <li>• システム仕様詳細化</li>
                          </ul>
                        </div>
                        <div className="bg-blue-200 border border-blue-400 rounded-lg p-3">
                          <h5 className="font-bold text-blue-800 mb-2 flex items-center text-sm">
                            <span className="mr-1">🧪</span>
                            1月：試行準備
                          </h5>
                          <ul className="text-xs space-y-1">
                            <li>• 制度統合・最終調整</li>
                            <li>• パイロット運用準備</li>
                            <li>• 運用マニュアル作成</li>
                            <li>• 現場説明・研修準備</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 italic">
                  ※ 詳細な部門別行動計画と成果指標は別途資料参照
                </div>
              </div>
            )}

            {/* 試行・調整フェーズタブ */}
            {guidelineSubTab === 'trial-adjustment' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* ヘッダー部分 */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">内部検討資料</div>
                    <h2 className="text-2xl font-bold text-gray-800">試行・調整フェーズ行動計画書</h2>
                    <p className="text-gray-600 mt-2">パイロット運用による制度検証・本格運用に向けた最終調整と準備</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-2">
                      <span className="mr-2 text-purple-600">📅</span>
                      <span className="text-purple-800 font-medium">実施期間: 2026年2月～3月</span>
                    </div>
                    <div className="flex items-center justify-end mb-2">
                      <span className="mr-2 text-purple-600">🎯</span>
                      <span className="text-purple-800 font-medium">重点方針: 実践検証と本格運用準備</span>
                    </div>
                  </div>
                </div>

                {/* 全体スケジュール */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-purple-500">
                    <span className="mr-2 text-purple-600">🧪</span>
                    全体スケジュール
                  </h3>
                  
                  <div className="border border-purple-200 rounded-lg overflow-hidden shadow-md">
                    <div className="bg-purple-600 text-white p-3">
                      <h4 className="text-lg font-bold">2ヶ月間の集中的パイロット運用</h4>
                      <p className="text-sm text-white text-opacity-90">実践による制度検証から本格運用準備まで</p>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <h5 className="font-bold text-purple-800 mb-2 flex items-center text-sm">
                            <span className="mr-1">▶️</span>
                            2月：パイロット運用開始
                          </h5>
                          <ul className="text-xs space-y-1">
                            <li>• 現場説明会・研修実施</li>
                            <li>• 一部制度の試行実施</li>
                            <li>• システム稼働開始</li>
                            <li>• 初期フィードバック収集</li>
                          </ul>
                        </div>
                        <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
                          <h5 className="font-bold text-purple-800 mb-2 flex items-center text-sm">
                            <span className="mr-1">⚙️</span>
                            3月：最終調整・準備完了
                          </h5>
                          <ul className="text-xs space-y-1">
                            <li>• 課題抽出と制度改善</li>
                            <li>• システム最終調整</li>
                            <li>• 本格運用準備完了</li>
                            <li>• 2026年4月開始準備</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* パイロット運用管理 */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-orange-500">
                    <span className="mr-2 text-orange-600">👁️</span>
                    パイロット運用管理・効果測定
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
                      <h4 className="font-bold text-orange-800 mb-3 text-sm">パイロット運用対象</h4>
                      <div className="space-y-2 text-xs">
                        <div className="bg-white p-2 rounded border">
                          <div className="font-medium text-orange-700 mb-1">対象部署</div>
                          <ul className="text-orange-600 space-y-1">
                            <li>• 小原病院看護部（各病棟5-10名）</li>
                            <li>• 外来部門</li>
                            <li>• 管理職・指導者層</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                      <h4 className="font-bold text-green-800 mb-3 text-sm">効果測定指標</h4>
                      <div className="space-y-2 text-xs">
                        <div className="bg-white p-2 rounded border">
                          <div className="font-medium text-green-700 mb-1">目標値</div>
                          <ul className="text-green-600 space-y-1">
                            <li>• 参加率：90%以上</li>
                            <li>• 満足度：4.0以上（5点満点）</li>
                            <li>• システム稼働率：99%以上</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 最終成功指標 */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-purple-500">
                    <span className="mr-2 text-purple-600">🏆</span>
                    最終成功指標（3月末時点）
                  </h3>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-md">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-700 mb-1">95%</div>
                        <div className="text-xs text-purple-600">パイロット完了率</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-700 mb-1">4.2</div>
                        <div className="text-xs text-purple-600">満足度平均</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-700 mb-1">100%</div>
                        <div className="text-xs text-purple-600">制度改善完了</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-700 mb-1">100%</div>
                        <div className="text-xs text-purple-600">本格運用準備</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 italic">
                  ※ 詳細な部門別行動計画とPDCAサイクルは別途資料参照
                </div>
              </div>
            )}

            {/* 評価プロセスタブ */}
            {guidelineSubTab === 'process' && (

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

              {/* 法人人事部準備室向け参考資料 */}
          <div className="bg-gray-100 rounded-xl shadow-lg p-6 mt-8">
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
            )}
          </div>
        )}

        {/* お問い合わせ */}
        <div className="bg-blue-50 rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-blue-800 mb-3">お問い合わせ</h3>
          <p className="text-gray-700 mb-4">
            人事評価制度・面談制度・各種シートに関するご質問やご相談は、人事部までお気軽にお問い合わせください。
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
      
      {/* プレビューモーダル */}
      {previewSheet && (
        previewSheet.type === 'interview' ? (
          <InterviewSheetModal
            isOpen={!!previewSheet}
            onClose={() => setPreviewSheet(null)}
            sheetName={previewSheet.name}
            sheetPath={previewSheet.path}
          />
        ) : (
          <SheetPreviewModal
            isOpen={!!previewSheet}
            onClose={() => setPreviewSheet(null)}
            sheetName={previewSheet.name}
            sheetPath={previewSheet.path}
          />
        )
      )}
      
        <DashboardButton />
    </div>
  );
}