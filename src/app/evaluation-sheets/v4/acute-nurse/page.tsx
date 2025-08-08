'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AcuteNurseEvaluationPage() {
  const router = useRouter();

  const evaluationSheets = [
    { 
      label: '新人看護師（1年目）', 
      path: '/docs/v4_evaluation-sheets/acute_nurse/new-nurse-evaluation-v4-pattern5.tsx',
      description: '入職1年目の看護師向け評価シート'
    },
    { 
      label: '一般看護師（2-3年目）', 
      path: '/docs/v4_evaluation-sheets/acute_nurse/junior-nurse-evaluation-v4-pattern5.tsx',
      description: '2-3年目の看護師向け評価シート'
    },
    { 
      label: '中堅看護師（4-10年目）', 
      path: '/docs/v4_evaluation-sheets/acute_nurse/midlevel-nurse-evaluation-v4-pattern5.tsx',
      description: '4-10年目の中堅看護師向け評価シート'
    },
    { 
      label: 'ベテラン看護師（11年以上）', 
      path: '/docs/v4_evaluation-sheets/acute_nurse/veteran-nurse-evaluation-v4-pattern5.tsx',
      description: '11年以上のベテラン看護師向け評価シート'
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
        <h1 className="text-2xl font-bold mb-2 text-center">急性期病院 - 看護師評価シート</h1>
        <p className="text-gray-600 text-center mb-8">経験年数に応じた評価シートを選択してください</p>
        
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
            <strong>使用方法:</strong> 該当する経験年数の評価シートをクリックして開き、必要事項を記入してください。
          </p>
        </div>
      </div>
    </div>
  );
}