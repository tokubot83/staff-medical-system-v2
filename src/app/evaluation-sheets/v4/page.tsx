'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EvaluationSheetsV4Page() {
  const router = useRouter();

  const evaluationSheets = [
    {
      category: '急性期病院 - 看護師',
      sheets: [
        { label: '新人看護師（1年目）', path: '/evaluation-sheets/v4/acute-nurse/new-nurse-evaluation-v4-pattern5' },
        { label: '一般看護師（2-3年目）', path: '/evaluation-sheets/v4/acute-nurse/junior-nurse-evaluation-v4-pattern5' },
        { label: '中堅看護師（4-10年目）', path: '/evaluation-sheets/v4/acute-nurse/midlevel-nurse-evaluation-v4-pattern5' },
        { label: 'ベテラン看護師（11年以上）', path: '/evaluation-sheets/v4/acute-nurse/veteran-nurse-evaluation-v4-pattern5' },
        { label: '病棟主任', path: '/evaluation-sheets/v4/acute-nurse/ward-chief-evaluation-v4-pattern5' },
        { label: '病棟管理者', path: '/evaluation-sheets/v4/acute-nurse/ward-manager-evaluation-v4-pattern5' },
      ]
    },
    {
      category: '急性期病院 - 准看護師',
      sheets: [
        { label: '新人准看護師（1年目）', path: '/evaluation-sheets/v4/acute-assistant-nurse/new-assistant-nurse-evaluation-v4-pattern5' },
        { label: '一般准看護師（2-3年目）', path: '/evaluation-sheets/v4/acute-assistant-nurse/junior-assistant-nurse-evaluation-v4-pattern5' },
        { label: '中堅准看護師（4-10年目）', path: '/evaluation-sheets/v4/acute-assistant-nurse/midlevel-assistant-nurse-evaluation-v4-pattern5' },
        { label: 'ベテラン准看護師（11年以上）', path: '/evaluation-sheets/v4/acute-assistant-nurse/veteran-assistant-nurse-evaluation-v4-pattern5' },
      ]
    },
    {
      category: '急性期病院 - 看護補助者',
      sheets: [
        { label: '新人看護補助者（1年目）', path: '/evaluation-sheets/v4/acute-nursing-aide/new-nursing-aide-evaluation-v4-pattern5' },
        { label: '一般看護補助者（2-3年目）', path: '/evaluation-sheets/v4/acute-nursing-aide/junior-nursing-aide-evaluation-v4-pattern5' },
        { label: '中堅看護補助者（4-10年目）', path: '/evaluation-sheets/v4/acute-nursing-aide/midlevel-nursing-aide-evaluation-v4-pattern5' },
        { label: 'ベテラン看護補助者（11年以上）', path: '/evaluation-sheets/v4/acute-nursing-aide/veteran-nursing-aide-evaluation-v4-pattern5' },
        { label: 'リーダー看護補助者', path: '/evaluation-sheets/v4/acute-nursing-aide/leader-nursing-aide-evaluation-v4-pattern5' },
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          ← 戻る
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-8 text-center">評価シート v4</h1>
        
        {evaluationSheets.map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.sheets.map((sheet, sheetIndex) => (
                <Link
                  key={sheetIndex}
                  href={sheet.path}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {sheet.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}