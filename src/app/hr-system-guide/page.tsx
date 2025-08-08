'use client';

import React from 'react';
import CommonHeader from '@/components/CommonHeader';

export default function HRSystemGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader title="人事制度ガイド" />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">人事制度ガイド</h1>
          <p className="text-gray-600 mb-6">
            医療法人厚生会の革新的な人事評価制度・面談制度について、職員の皆様にわかりやすくご説明します。
          </p>
          
          <div className="space-y-6">
            <section className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">評価制度</h2>
              <p className="text-gray-600">
                公正で透明性の高い評価制度により、職員の成長と組織の発展を支援します。
              </p>
            </section>
            
            <section className="border-l-4 border-green-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">面談制度</h2>
              <p className="text-gray-600">
                定期的な面談を通じて、職員一人ひとりの声を聞き、キャリア形成をサポートします。
              </p>
            </section>
            
            <section className="border-l-4 border-purple-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">研修制度</h2>
              <p className="text-gray-600">
                充実した研修プログラムで、専門スキルの向上と人材育成を推進します。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}