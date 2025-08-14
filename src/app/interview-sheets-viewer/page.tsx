'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CommonHeader from '@/components/CommonHeader';
import DashboardButton from '@/components/DashboardButton';

interface Sheet {
  label: string;
  paths: {
    [key: string]: string;
  };
}

interface SheetCategory {
  category: string;
  sheets: Sheet[];
}

function InterviewSheetsViewerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    const roleParam = searchParams.get('role');
    
    if (type) {
      setInterviewType(type);
      setRole(roleParam);
      
      // 職種パラメータに基づいてカテゴリを自動選択
      if (roleParam === 'nurse') {
        setSelectedCategory('看護師');
      } else if (roleParam === 'assistant-nurse') {
        setSelectedCategory('准看護師');
      } else if (roleParam === 'nursing-aide') {
        setSelectedCategory('看護補助者');
      } else if (roleParam === 'leader-nurse') {
        setSelectedCategory('主任看護師');
      } else if (roleParam === 'chief-nurse') {
        setSelectedCategory('病棟師長');
      } else if (roleParam === 'medical-affairs') {
        setSelectedCategory('医事課職員');
      } else if (roleParam === 'probation-staff') {
        setSelectedCategory('試用期間職員');
      } else if (roleParam === 'general-staff') {
        setSelectedCategory('一般職員');
      } else if (roleParam === 'manager-veteran') {
        setSelectedCategory('管理職・ベテラン');
      } else {
        // パラメータがない場合はデフォルトで看護師
        setSelectedCategory('看護師');
      }
    }
  }, [searchParams]);

  const interviewSheets: SheetCategory[] = [
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
        }
      ]
    },
    {
      category: '主任看護師',
      sheets: [
        { 
          label: '主任看護師', 
          paths: {
            '15分': '/interview-sheets/leader/15',
            '30分': '/interview-sheets/leader/30',
            '45分': '/interview-sheets/leader/45'
          }
        }
      ]
    },
    {
      category: '病棟師長',
      sheets: [
        { 
          label: '病棟師長', 
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
    },
    {
      category: '医事課職員',
      sheets: [
        { 
          label: '医事課職員', 
          paths: {
            '15分': '/interview-sheets/v5/medical-affairs-staff-15min',
            '30分': '/interview-sheets/v5/medical-affairs-staff-30min',
            '45分': '/interview-sheets/v5/medical-affairs-staff-45min'
          }
        }
      ]
    },
    {
      category: '試用期間職員',
      sheets: [
        { 
          label: '試用期間職員 退職面談', 
          paths: {
            '15分': '/exit-interview-sheets/probation-staff-15min',
            '30分': '/exit-interview-sheets/probation-staff-30min'
          }
        }
      ]
    },
    {
      category: '一般職員',
      sheets: [
        { 
          label: '一般職員 退職面談', 
          paths: {
            '30分': '/exit-interview-sheets/general-staff-30min',
            '45分': '/exit-interview-sheets/general-staff-45min'
          }
        }
      ]
    },
    {
      category: '管理職・ベテラン',
      sheets: [
        { 
          label: '管理職・ベテラン 退職面談', 
          paths: {
            '45分': '/exit-interview-sheets/manager-veteran-45min',
            '60分': '/exit-interview-sheets/manager-veteran-60min'
          }
        }
      ]
    }
  ];

  // 面談タイプごとのメッセージ
  const getTypeMessage = () => {
    let message = '';
    
    switch(interviewType) {
      case 'new-employee':
        message = '新入職員月次面談';
        break;
      case 'regular-annual':
        message = '一般職員年次面談';
        break;
      case 'management':
        message = '管理職半年面談';
        break;
      case 'exit-interview':
        message = '退職面談';
        break;
      default:
        return null;
    }
    
    // 職種名を追加
    if (role) {
      const roleNames: { [key: string]: string } = {
        'nurse': '看護師',
        'assistant-nurse': '准看護師',
        'nursing-aide': '看護補助者',
        'leader-nurse': '主任看護師',
        'chief-nurse': '病棟師長',
        'probation-staff': '試用期間職員',
        'general-staff': '一般職員',
        'manager-veteran': '管理職・ベテラン'
      };
      const roleName = roleNames[role] || '';
      if (roleName) {
        message += ` - ${roleName}`;
      }
    }
    
    return message + '用のシートを選択してください';
  };
  
  // 表示するシートをフィルタリング
  const getFilteredSheets = (sheets: Sheet[]) => {
    if (!role) return sheets;
    
    // 新入職員月次面談の場合は1年目のシートのみ表示
    if (interviewType === 'new-employee') {
      return sheets.filter(sheet => sheet.label.includes('1年目') || sheet.label.includes('新人'));
    }
    
    // 一般職員年次面談の場合
    if (interviewType === 'regular-annual') {
      // 一般職員年次面談では管理職用のシートは表示しない（主任・師長は別カテゴリ）
      return sheets;
    }
    
    // 管理職半年面談の場合
    if (interviewType === 'management') {
      // 管理職半年面談では全シートを表示
      return sheets;
    }
    
    // 退職面談の場合
    if (interviewType === 'exit-interview') {
      // 退職面談では選択されたカテゴリのシートのみ表示
      return sheets;
    }
    
    return sheets;
  };

  return (
    <>
      <CommonHeader title="面談シート一覧" />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/interviews')}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              ← 面談管理に戻る
            </button>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← 前のページに戻る
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-4 text-center">面談シート一覧</h1>
          {getTypeMessage() && (
            <p className="text-center text-blue-600 mb-6">{getTypeMessage()}</p>
          )}
          
          {!selectedCategory && !role ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewSheets.filter(cat => {
              // 退職面談の場合は退職面談関連のカテゴリのみ表示
              if (interviewType === 'exit-interview') {
                return ['試用期間職員', '一般職員', '管理職・ベテラン'].includes(cat.category);
              }
              // 通常の面談の場合は従来通り
              return cat.category !== '主任看護師' && cat.category !== '病棟師長' && 
                     !['試用期間職員', '一般職員', '管理職・ベテラン'].includes(cat.category);
            }).map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.category)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all text-center"
              >
                <div className="text-3xl mb-3">
                  {category.category === '看護師' && '👩‍⚕️'}
                  {category.category === '看護補助者' && '🏥'}
                  {category.category === '准看護師' && '💉'}
                  {category.category === '試用期間職員' && '🆕'}
                  {category.category === '一般職員' && '👤'}
                  {category.category === '管理職・ベテラン' && '👨‍💼'}
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{category.category}</h2>
                <p className="text-sm text-gray-600 mt-2">{category.sheets.length}種類の面談シート</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            {!role && (
              <div className="mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← カテゴリ一覧に戻る
                </button>
              </div>
            )}
            
            <h2 className="text-lg font-semibold mb-6 text-gray-700">
              {selectedCategory}用面談シート
            </h2>
            
            <div className="space-y-4">
              {getFilteredSheets(
                interviewSheets
                  .find(cat => cat.category === selectedCategory)
                  ?.sheets || []
              ).map((sheet, sheetIndex) => (
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
        <DashboardButton />
      </div>
    </>
  );
}

export default function InterviewSheetsViewerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InterviewSheetsViewerContent />
    </Suspense>
  );
}