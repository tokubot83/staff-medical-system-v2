'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AcuteNursingAideEvaluationPage() {
  const router = useRouter();

  const evaluationSheets = [
    { 
      label: '新人看護補助者（1年目）', 
      path: '/docs/v4_evaluation-sheets/acute_nursing-aide/new-nursing-aide-evaluation-v4-pattern5.tsx',
      description: '入職1年目の看護補助者向け評価シート'
    },
    { 
      label: '一般看護補助者（2-3年目）', 
      path: '/docs/v4_evaluation-sheets/acute_nursing-aide/junior-nursing-aide-evaluation-v4-pattern5.tsx',
      description: '2-3年目の看護補助者向け評価シート'
    },
    { 
      label: '中堅看護補助者（4-10年目）', 
      path: '/docs/v4_evaluation-sheets/acute_nursing-aide/midlevel-nursing-aide-evaluation-v4-pattern5.tsx',
      description: '4-10年目の中堅看護補助者向け評価シート'
    },
    { 
      label: 'ベテラン看護補助者（11年以上）', 
      path: '/docs/v4_evaluation-sheets/acute_nursing-aide/veteran-nursing-aide-evaluation-v4-pattern5.tsx',
      description: '11年以上のベテラン看護補助者向け評価シート'
    },
    { 
      label: 'リーダー看護補助者', 
      path: '/docs/v4_evaluation-sheets/acute_nursing-aide/leader-nursing-aide-evaluation-v4-pattern5.tsx',
      description: 'リーダー役の看護補助者向け評価シート'
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
        <h1 className="text-2xl font-bold mb-2 text-center">急性期病院 - 看護補助者評価シート</h1>
        <p className="text-gray-600 text-center mb-8">経験年数・役職に応じた評価シートを選択してください</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluationSheets.map((sheet, index) => (
            <a
              key={index}
              href={sheet.path}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {sheet.label}
              </h3>
              <p className="text-sm text-gray-600">
                {sheet.description}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                クリックしてダウンロード →
              </p>
            </a>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>使用方法:</strong> 該当する経験年数・役職の評価シートをクリックして開き、必要事項を記入してください。
          </p>
        </div>
      </div>
    </div>
  );
}