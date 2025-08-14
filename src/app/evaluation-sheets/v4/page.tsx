'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';

export default function EvaluationSheetsV4Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('acute');

  const departments = [
    { id: 'acute', label: '急性期', icon: '🏥' },
    { id: 'chronic', label: '慢性期', icon: '🏡' },
    { id: 'outpatient', label: '外来', icon: '🚶' },
    { id: 'roken', label: '老健', icon: '🏛️' }
  ];

  const evaluationSheets = {
    acute: {
      name: '急性期病院',
      categories: [
        {
          title: '看護師',
          icon: '👩‍⚕️',
          sheets: [
            { label: '新人看護師（1年目）', path: '/evaluation-sheets/v4/acute-nurse/new-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '一般看護師（2-3年目）', path: '/evaluation-sheets/v4/acute-nurse/junior-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '中堅看護師（4-10年目）', path: '/evaluation-sheets/v4/acute-nurse/midlevel-nurse-evaluation-v4-pattern5', implemented: true },
            { label: 'ベテラン看護師（11年以上）', path: '/evaluation-sheets/v4/acute-nurse/veteran-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '病棟主任', path: '/evaluation-sheets/v4/acute-nurse/ward-chief-evaluation-v4-pattern5', implemented: true },
            { label: '病棟師長', path: '/evaluation-sheets/v4/acute-nurse/ward-manager-evaluation-v4-pattern5', implemented: true },
          ]
        },
        {
          title: '准看護師',
          icon: '💉',
          sheets: [
            { label: '新人准看護師（1年目）', path: '/evaluation-sheets/v4/acute-assistant-nurse/new-assistant-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '一般准看護師（2-3年目）', path: '/evaluation-sheets/v4/acute-assistant-nurse/junior-assistant-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '中堅准看護師（4-10年目）', path: '/evaluation-sheets/v4/acute-assistant-nurse/midlevel-assistant-nurse-evaluation-v4-pattern5', implemented: true },
            { label: 'ベテラン准看護師（11年以上）', path: '/evaluation-sheets/v4/acute-assistant-nurse/veteran-assistant-nurse-evaluation-v4-pattern5', implemented: true },
          ]
        },
        {
          title: '看護補助者',
          icon: '🤝',
          sheets: [
            { label: '新人看護補助者（1年目）', path: '/evaluation-sheets/v4/acute-nursing-aide/new-nursing-aide-evaluation-v4-pattern5', implemented: true },
            { label: '一般看護補助者（2-3年目）', path: '/evaluation-sheets/v4/acute-nursing-aide/junior-nursing-aide-evaluation-v4-pattern5', implemented: true },
            { label: '中堅看護補助者（4-10年目）', path: '/evaluation-sheets/v4/acute-nursing-aide/midlevel-nursing-aide-evaluation-v4-pattern5', implemented: true },
            { label: 'ベテラン看護補助者（11年以上）', path: '/evaluation-sheets/v4/acute-nursing-aide/veteran-nursing-aide-evaluation-v4-pattern5', implemented: true },
            { label: 'リーダー看護補助者', path: '/evaluation-sheets/v4/acute-nursing-aide/leader-nursing-aide-evaluation-v4-pattern5', implemented: true },
          ]
        },
        {
          title: '理学療法士',
          icon: '🏃',
          sheets: [
            { label: '新人理学療法士（1年目）', path: '/evaluation-sheets/v4/acute-pt/new-pt-evaluation-v4-pattern5', implemented: true },
            { label: '若手理学療法士（2-3年目）', path: '/evaluation-sheets/v4/acute-pt/junior-pt-evaluation-v4-pattern5', implemented: false },
            { label: '中堅理学療法士（4-10年目）', path: '/evaluation-sheets/v4/acute-pt/midlevel-pt-evaluation-v4-pattern5', implemented: false },
            { label: 'ベテラン理学療法士（11年以上）', path: '/evaluation-sheets/v4/acute-pt/veteran-pt-evaluation-v4-pattern5', implemented: false },
            { label: 'リハビリ主任', path: '/evaluation-sheets/v4/acute-pt/chief-pt-evaluation-v4-pattern5', implemented: false },
          ]
        },
        {
          title: '作業療法士',
          icon: '✋',
          sheets: [
            { label: '新人作業療法士（1年目）', path: '/evaluation-sheets/v4/acute-ot/new-ot-evaluation-v4-pattern5', implemented: false },
            { label: '若手作業療法士（2-3年目）', path: '/evaluation-sheets/v4/acute-ot/junior-ot-evaluation-v4-pattern5', implemented: false },
            { label: '中堅作業療法士（4-10年目）', path: '/evaluation-sheets/v4/acute-ot/midlevel-ot-evaluation-v4-pattern5', implemented: false },
            { label: 'ベテラン作業療法士（11年以上）', path: '/evaluation-sheets/v4/acute-ot/veteran-ot-evaluation-v4-pattern5', implemented: false },
            { label: 'リハビリ主任', path: '/evaluation-sheets/v4/acute-ot/chief-ot-evaluation-v4-pattern5', implemented: false },
          ]
        },
        {
          title: '言語聴覚士',
          icon: '🗣️',
          sheets: [
            { label: '新人言語聴覚士（1年目）', path: '/evaluation-sheets/v4/acute-st/new-st-evaluation-v4-pattern5', implemented: false },
            { label: '若手言語聴覚士（2-3年目）', path: '/evaluation-sheets/v4/acute-st/junior-st-evaluation-v4-pattern5', implemented: false },
            { label: '中堅言語聴覚士（4-10年目）', path: '/evaluation-sheets/v4/acute-st/midlevel-st-evaluation-v4-pattern5', implemented: false },
            { label: 'ベテラン言語聴覚士（11年以上）', path: '/evaluation-sheets/v4/acute-st/veteran-st-evaluation-v4-pattern5', implemented: false },
            { label: 'リハビリ主任', path: '/evaluation-sheets/v4/acute-st/chief-st-evaluation-v4-pattern5', implemented: false },
          ]
        }
      ]
    },
    chronic: {
      name: '慢性期病院',
      categories: [
        {
          title: '看護師',
          icon: '👩‍⚕️',
          sheets: [
            { label: '新人看護師（1年目）', path: '/evaluation-sheets/v4/chronic-nurse/chronic-new-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '一般看護師（2-3年目）', path: '/evaluation-sheets/v4/chronic-nurse/chronic-junior-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '中堅看護師（4-10年目）', path: '/evaluation-sheets/v4/chronic-nurse/chronic-midlevel-nurse-evaluation-v4-pattern5', implemented: true },
            { label: 'ベテラン看護師（11年以上）', path: '/evaluation-sheets/v4/chronic-nurse/chronic-veteran-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '病棟主任', path: '/evaluation-sheets/v4/chronic-nurse/chronic-chief-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '病棟師長', path: '/evaluation-sheets/v4/chronic-nurse/chronic-ward-manager-evaluation-v4-pattern5', implemented: true },
          ]
        },
        {
          title: '准看護師',
          icon: '💉',
          sheets: [
            { label: '新人准看護師（1年目）', path: '/evaluation-sheets/v4/chronic-assistant-nurse/chronic-new-assistant-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '一般准看護師（2-3年目）', path: '/evaluation-sheets/v4/chronic-assistant-nurse/chronic-junior-assistant-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '中堅准看護師（4-10年目）', path: '/evaluation-sheets/v4/chronic-assistant-nurse/chronic-midlevel-assistant-nurse-evaluation-v4-pattern5', implemented: true },
            { label: 'ベテラン准看護師（11年以上）', path: '/evaluation-sheets/v4/chronic-assistant-nurse/chronic-veteran-assistant-nurse-evaluation-v4-pattern5', implemented: true },
          ]
        },
        {
          title: '看護補助者',
          icon: '🤝',
          sheets: [
            { label: '新人看護補助者（1年目）', path: '/evaluation-sheets/v4/acute-nursing-aide/new-nursing-aide-evaluation-v4-pattern5', implemented: true },
            { label: '一般看護補助者（2-3年目）', path: '/evaluation-sheets/v4/acute-nursing-aide/junior-nursing-aide-evaluation-v4-pattern5', implemented: true },
            { label: '中堅看護補助者（4-10年目）', path: '/evaluation-sheets/v4/acute-nursing-aide/midlevel-nursing-aide-evaluation-v4-pattern5', implemented: true },
            { label: 'ベテラン看護補助者（11年以上）', path: '/evaluation-sheets/v4/acute-nursing-aide/veteran-nursing-aide-evaluation-v4-pattern5', implemented: true },
            { label: 'リーダー看護補助者', path: '/evaluation-sheets/v4/acute-nursing-aide/leader-nursing-aide-evaluation-v4-pattern5', implemented: true },
          ]
        },
        {
          title: '理学療法士',
          icon: '🏃',
          sheets: [
            { label: '新人理学療法士（1年目）', path: '/evaluation-sheets/v4/chronic-pt/new-pt-evaluation-v4-pattern5', implemented: false },
            { label: '若手理学療法士（2-3年目）', path: '/evaluation-sheets/v4/chronic-pt/junior-pt-evaluation-v4-pattern5', implemented: false },
            { label: '中堅理学療法士（4-10年目）', path: '/evaluation-sheets/v4/chronic-pt/midlevel-pt-evaluation-v4-pattern5', implemented: false },
            { label: 'ベテラン理学療法士（11年以上）', path: '/evaluation-sheets/v4/chronic-pt/veteran-pt-evaluation-v4-pattern5', implemented: false },
            { label: 'リハビリ主任', path: '/evaluation-sheets/v4/chronic-pt/chief-pt-evaluation-v4-pattern5', implemented: false },
          ]
        },
        {
          title: '作業療法士',
          icon: '✋',
          sheets: [
            { label: '新人作業療法士（1年目）', path: '/evaluation-sheets/v4/chronic-ot/new-ot-evaluation-v4-pattern5', implemented: false },
            { label: '若手作業療法士（2-3年目）', path: '/evaluation-sheets/v4/chronic-ot/junior-ot-evaluation-v4-pattern5', implemented: false },
            { label: '中堅作業療法士（4-10年目）', path: '/evaluation-sheets/v4/chronic-ot/midlevel-ot-evaluation-v4-pattern5', implemented: false },
            { label: 'ベテラン作業療法士（11年以上）', path: '/evaluation-sheets/v4/chronic-ot/veteran-ot-evaluation-v4-pattern5', implemented: false },
            { label: 'リハビリ主任', path: '/evaluation-sheets/v4/chronic-ot/chief-ot-evaluation-v4-pattern5', implemented: false },
          ]
        },
        {
          title: '言語聴覚士',
          icon: '🗣️',
          sheets: [
            { label: '新人言語聴覚士（1年目）', path: '/evaluation-sheets/v4/chronic-st/new-st-evaluation-v4-pattern5', implemented: false },
            { label: '若手言語聴覚士（2-3年目）', path: '/evaluation-sheets/v4/chronic-st/junior-st-evaluation-v4-pattern5', implemented: false },
            { label: '中堅言語聴覚士（4-10年目）', path: '/evaluation-sheets/v4/chronic-st/midlevel-st-evaluation-v4-pattern5', implemented: false },
            { label: 'ベテラン言語聴覚士（11年以上）', path: '/evaluation-sheets/v4/chronic-st/veteran-st-evaluation-v4-pattern5', implemented: false },
            { label: 'リハビリ主任', path: '/evaluation-sheets/v4/chronic-st/chief-st-evaluation-v4-pattern5', implemented: false },
          ]
        }
      ]
    },
    outpatient: {
      name: '外来',
      categories: [
        {
          title: '看護師',
          icon: '👩‍⚕️',
          sheets: [
            { label: '新人看護師（1年目）', path: '/evaluation-sheets/v4/outpatient-nurse/new-outpatient-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '一般看護師（2-3年目）', path: '/evaluation-sheets/v4/outpatient-nurse/junior-outpatient-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '中堅看護師（4-10年目）', path: '/evaluation-sheets/v4/outpatient-nurse/midlevel-outpatient-nurse-evaluation-v4-pattern5', implemented: true },
            { label: 'ベテラン看護師（11年以上）', path: '/evaluation-sheets/v4/outpatient-nurse/veteran-outpatient-nurse-evaluation-v4-pattern5', implemented: true },
            { label: '外来主任', path: '/evaluation-sheets/v4/outpatient-chief', implemented: true },
            { label: '外来師長', path: '/evaluation-sheets/v4/outpatient-manager', implemented: true },
          ]
        },
        {
          title: '准看護師',
          icon: '💉',
          sheets: [
            { label: '新人准看護師（1年目）', path: '', implemented: false },
            { label: '一般准看護師（2-3年目）', path: '', implemented: false },
            { label: '中堅准看護師（4-10年目）', path: '', implemented: false },
            { label: 'ベテラン准看護師（11年以上）', path: '', implemented: false },
          ]
        },
        {
          title: '看護補助者',
          icon: '🤝',
          sheets: [
            { label: '新人看護補助者（1年目）', path: '/evaluation-sheets/v4/chronic-nursing-aide/new', implemented: true },
            { label: '初級看護補助者（2-3年目）', path: '/evaluation-sheets/v4/chronic-nursing-aide/junior', implemented: true },
            { label: '中堅看護補助者（4-7年目）', path: '/evaluation-sheets/v4/chronic-nursing-aide/midlevel', implemented: true },
            { label: 'ベテラン看護補助者（8年以上）', path: '/evaluation-sheets/v4/chronic-nursing-aide/veteran', implemented: true },
            { label: 'リーダー看護補助者', path: '/evaluation-sheets/v4/chronic-nursing-aide/leader', implemented: true },
          ]
        }
      ]
    },
    roken: {
      name: '老人保健施設',
      categories: [
        {
          title: '理学療法士',
          icon: '🏃',
          sheets: [
            { label: '新人理学療法士（1年目）', path: '/evaluation-sheets/v4/roken-pt/new-pt-evaluation-v4-pattern5', implemented: false },
            { label: '若手理学療法士（2-3年目）', path: '/evaluation-sheets/v4/roken-pt/junior-pt-evaluation-v4-pattern5', implemented: false },
            { label: '中堅理学療法士（4-10年目）', path: '/evaluation-sheets/v4/roken-pt/midlevel-pt-evaluation-v4-pattern5', implemented: false },
            { label: 'ベテラン理学療法士（11年以上）', path: '/evaluation-sheets/v4/roken-pt/veteran-pt-evaluation-v4-pattern5', implemented: false },
            { label: 'リハビリ主任', path: '/evaluation-sheets/v4/roken-pt/chief-pt-evaluation-v4-pattern5', implemented: false },
          ]
        },
        {
          title: '作業療法士',
          icon: '✋',
          sheets: [
            { label: '新人作業療法士（1年目）', path: '/evaluation-sheets/v4/roken-ot/new-ot-evaluation-v4-pattern5', implemented: false },
            { label: '若手作業療法士（2-3年目）', path: '/evaluation-sheets/v4/roken-ot/junior-ot-evaluation-v4-pattern5', implemented: false },
            { label: '中堅作業療法士（4-10年目）', path: '/evaluation-sheets/v4/roken-ot/midlevel-ot-evaluation-v4-pattern5', implemented: false },
            { label: 'ベテラン作業療法士（11年以上）', path: '/evaluation-sheets/v4/roken-ot/veteran-ot-evaluation-v4-pattern5', implemented: false },
            { label: 'リハビリ主任', path: '/evaluation-sheets/v4/roken-ot/chief-ot-evaluation-v4-pattern5', implemented: false },
          ]
        },
        {
          title: '言語聴覚士',
          icon: '🗣️',
          sheets: [
            { label: '新人言語聴覚士（1年目）', path: '/evaluation-sheets/v4/roken-st/new-st-evaluation-v4-pattern5', implemented: false },
            { label: '若手言語聴覚士（2-3年目）', path: '/evaluation-sheets/v4/roken-st/junior-st-evaluation-v4-pattern5', implemented: false },
            { label: '中堅言語聴覚士（4-10年目）', path: '/evaluation-sheets/v4/roken-st/midlevel-st-evaluation-v4-pattern5', implemented: false },
            { label: 'ベテラン言語聴覚士（11年以上）', path: '/evaluation-sheets/v4/roken-st/veteran-st-evaluation-v4-pattern5', implemented: false },
            { label: 'リハビリ主任', path: '/evaluation-sheets/v4/roken-st/chief-st-evaluation-v4-pattern5', implemented: false },
          ]
        }
      ]
    }
  };

  const currentDepartment = evaluationSheets[activeTab as keyof typeof evaluationSheets];

  // 実装統計を計算
  const getImplementationStats = (deptKey: string) => {
    const dept = evaluationSheets[deptKey as keyof typeof evaluationSheets];
    let total = 0;
    let implemented = 0;
    
    dept.categories.forEach(category => {
      category.sheets.forEach(sheet => {
        total++;
        if (sheet.implemented) implemented++;
      });
    });
    
    return { total, implemented, percentage: Math.round((implemented / total) * 100) };
  };

  return (
    <>
      <CommonHeader title="評価シート v4" />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/evaluation-sheets')}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              ← 評価シート一覧に戻る
            </button>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← 前のページに戻る
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          {/* ヘッダー */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-center mb-2">評価シート v4</h1>
            <p className="text-center text-gray-600">部署・職種・経験年数別の評価シート一覧</p>
          </div>

          {/* タブナビゲーション */}
          <div className="flex border-b">
            {departments.map((dept) => {
              const stats = getImplementationStats(dept.id);
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveTab(dept.id)}
                  className={`flex-1 px-6 py-4 text-center transition-colors relative ${
                    activeTab === dept.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">{dept.icon}</span>
                    <span className="font-medium">{dept.label}</span>
                  </div>
                  <div className="text-xs mt-1">
                    実装率: {stats.percentage}% ({stats.implemented}/{stats.total})
                  </div>
                </button>
              );
            })}
          </div>

          {/* コンテンツ */}
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{currentDepartment.name}</h2>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded"></span>
                  <span>実装済み</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-gray-300 rounded"></span>
                  <span>準備中</span>
                </div>
              </div>
            </div>

            {currentDepartment.categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-700">{category.title}</h3>
                  <span className="text-sm text-gray-500 ml-2">
                    ({category.sheets.filter(s => s.implemented).length}/{category.sheets.length} 実装済み)
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.sheets.map((sheet, sheetIndex) => (
                    sheet.implemented ? (
                      <Link
                        key={sheetIndex}
                        href={sheet.path}
                        className="block p-4 border-2 border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all transform hover:scale-105"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            {sheet.label}
                          </div>
                          <span className="text-blue-600">→</span>
                        </div>
                      </Link>
                    ) : (
                      <div
                        key={sheetIndex}
                        className="block p-4 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed opacity-60"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-500">
                            {sheet.label}
                          </div>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            準備中
                          </span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}

            {/* 特別版の案内（急性期の中堅看護師のみ） */}

            {/* 開発者向けメモ */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">🔧 開発メモ</h4>
              <p className="text-sm text-gray-600">
                評価シートは部署（急性期・慢性期・外来）と職種（看護師・准看護師・看護補助者・理学療法士・作業療法士・言語聴覚士）、
                経験年数で分類されています。現在、急性期は看護職全職種実装済み、リハビリ職は新人PTのみ実装済み、慢性期は看護師・准看護師・看護補助者実装済み、
                外来は看護師（管理職除く）のみ実装されています。
              </p>
            </div>
          </div>
        </div>
        
        <DashboardButton />
      </div>
    </>
  );
}