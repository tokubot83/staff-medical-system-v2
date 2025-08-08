'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InterviewSheetsViewerPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const interviewSheets = [
    {
      category: '看護師',
      sheets: [
        { 
          label: '新人看護師（1年目）', 
          paths: {
            '15分': '/interview-sheets/new/15',
            '30分': '/interview-sheets/new/30',
            '45分': '/interview-sheets/new/45'
          }
        },
        { 
          label: '一般看護師（2-3年目）', 
          paths: {
            '15分': '/interview-sheets/general/15',
            '30分': '/interview-sheets/general/30',
            '45分': '/interview-sheets/general/45'
          }
        },
        { 
          label: '中堅看護師（4-10年目）', 
          paths: {
            '15分': '/interview-sheets/senior/15',
            '30分': '/interview-sheets/senior/30',
            '45分': '/interview-sheets/senior/45'
          }
        },
        { 
          label: 'ベテラン看護師（11年以上）', 
          paths: {
            '15分': '/interview-sheets/veteran/15',
            '30分': '/interview-sheets/veteran/30',
            '45分': '/interview-sheets/veteran/45'
          }
        },
        { 
          label: 'リーダー看護師', 
          paths: {
            '15分': '/interview-sheets/leader/15',
            '30分': '/interview-sheets/leader/30',
            '45分': '/interview-sheets/leader/45'
          }
        },
        { 
          label: '主任看護師', 
          paths: {
            '15分': '/interview-sheets/chief/15',
            '30分': '/interview-sheets/chief/30',
            '45分': '/interview-sheets/chief/45'
          }
        }
      ]
    },
    {
      category: '看護補助者',
      sheets: [
        { 
          label: '新人看護補助者（1年目）', 
          paths: {
            '15分': '/interview-sheets/new-nursing-aide/15',
            '30分': '/interview-sheets/new-nursing-aide/30',
            '45分': '/interview-sheets/new-nursing-aide/45'
          }
        },
        { 
          label: '一般看護補助者（2-3年目）', 
          paths: {
            '15分': '/interview-sheets/general-nursing-aide/15',
            '30分': '/interview-sheets/general-nursing-aide/30',
            '45分': '/interview-sheets/general-nursing-aide/45'
          }
        },
        { 
          label: 'ベテラン看護補助者（11年以上）', 
          paths: {
            '15分': '/interview-sheets/veteran-nursing-aide/15',
            '30分': '/interview-sheets/veteran-nursing-aide/30',
            '45分': '/interview-sheets/veteran-nursing-aide/45'
          }
        },
        { 
          label: 'リーダー看護補助者', 
          paths: {
            '15分': '/interview-sheets/leader-nursing-aide/15',
            '30分': '/interview-sheets/leader-nursing-aide/30',
            '45分': '/interview-sheets/leader-nursing-aide/45'
          }
        }
      ]
    },
    {
      category: '准看護師',
      sheets: [
        { 
          label: '新人准看護師（1年目）', 
          paths: {
            '15分': '/interview-sheets/new-assistant-nurse/15',
            '30分': '/interview-sheets/new-assistant-nurse/30',
            '45分': '/interview-sheets/new-assistant-nurse/45'
          }
        },
        { 
          label: '一般准看護師（2-3年目）', 
          paths: {
            '15分': '/interview-sheets/general-assistant-nurse/15',
            '30分': '/interview-sheets/general-assistant-nurse/30',
            '45分': '/interview-sheets/general-assistant-nurse/45'
          }
        },
        { 
          label: '中堅准看護師（4-10年目）', 
          paths: {
            '15分': '/interview-sheets/senior-assistant-nurse/15',
            '30分': '/interview-sheets/senior-assistant-nurse/30',
            '45分': '/interview-sheets/senior-assistant-nurse/45'
          }
        },
        { 
          label: 'ベテラン准看護師（11年以上）', 
          paths: {
            '15分': '/interview-sheets/veteran-assistant-nurse/15',
            '30分': '/interview-sheets/veteran-assistant-nurse/30',
            '45分': '/interview-sheets/veteran-assistant-nurse/45'
          }
        }
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
        <h1 className="text-2xl font-bold mb-8 text-center">面談シート一覧</h1>
        
        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewSheets.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.category)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all text-center"
              >
                <div className="text-3xl mb-3">
                  {category.category === '看護師' && '👩‍⚕️'}
                  {category.category === '看護補助者' && '🏥'}
                  {category.category === '准看護師' && '💉'}
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{category.category}</h2>
                <p className="text-sm text-gray-600 mt-2">{category.sheets.length}種類の面談シート</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← カテゴリ一覧に戻る
              </button>
            </div>
            
            <h2 className="text-lg font-semibold mb-6 text-gray-700">
              {selectedCategory}用面談シート
            </h2>
            
            <div className="space-y-4">
              {interviewSheets
                .find(cat => cat.category === selectedCategory)
                ?.sheets.map((sheet, sheetIndex) => (
                  <div
                    key={sheetIndex}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <h3 className="font-medium text-gray-900 mb-3">
                      {sheet.label}
                    </h3>
                    <div className="flex gap-3">
                      {Object.entries(sheet.paths).map(([duration, path]) => (
                        <Link
                          key={duration}
                          href={path}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          {duration}版
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}