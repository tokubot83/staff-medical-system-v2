'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EvaluationSheetsPage() {
  const router = useRouter();

  const evaluationVersions = [
    {
      version: 'v4',
      label: '評価シート v4（最新版）',
      description: '2軸評価方式に対応した最新の評価シート',
      path: '/evaluation-sheets/v4'
    },
    {
      version: 'v3',
      label: '評価シート v3',
      description: '従来の評価シート',
      path: '/evaluation-sheets/v3'
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
        <h1 className="text-2xl font-bold mb-8 text-center">評価シート選択</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evaluationVersions.map((version) => (
            <Link
              key={version.version}
              href={version.path}
              className="block p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                {version.label}
              </h2>
              <p className="text-gray-600">
                {version.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>注意:</strong> 評価シートは現在移行中です。v4版を優先的にご利用ください。
          </p>
        </div>
      </div>
    </div>
  );
}