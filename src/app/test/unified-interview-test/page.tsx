'use client'

import React, { useState } from 'react'
import { UnifiedInterviewGeneratorService } from '@/lib/interview-bank/services/unified-generator-service'

export default function UnifiedInterviewTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testCases = [
    {
      name: 'サポート面談 - キャリア相談',
      params: {
        interviewType: 'support' as const,
        subType: 'career',
        duration: 30,
        staffProfile: {
          staffId: 'TEST-001',
          staffName: 'テスト職員',
          profession: 'nurse',
          experienceLevel: 'midlevel',
          facility: 'acute',
          department: '看護部',
          position: '看護師',
          yearsOfService: 5,
          yearsOfExperience: 5,
          hasManagementExperience: false
        },
        reservation: {
          id: 'RES-001',
          type: 'career_support',
          category: 'support',
          duration: 30,
          scheduledDate: new Date(),
          consultationDetails: '昇進を目指したいという相談',
          urgency: 'medium'
        }
      }
    },
    {
      name: 'サポート面談 - 個別相談（職場環境）',
      params: {
        interviewType: 'support' as const,
        subType: 'consultation',
        duration: 45,
        staffProfile: {
          staffId: 'TEST-002',
          staffName: 'テスト職員2',
          profession: 'care-worker',
          experienceLevel: 'junior',
          facility: 'roken',
          department: '介護部',
          position: '介護職員',
          yearsOfService: 2,
          yearsOfExperience: 2,
          hasManagementExperience: false
        },
        reservation: {
          id: 'RES-002',
          type: 'individual_consultation',
          category: 'support',
          subCategory: '職場環境',
          duration: 45,
          scheduledDate: new Date(),
          consultationDetails: '休憩室が狭くて使いづらい',
          urgency: 'low'
        }
      }
    },
    {
      name: 'サポート面談 - フィードバック（評価後）',
      params: {
        interviewType: 'support' as const,
        subType: 'feedback',
        duration: 30,
        staffProfile: {
          staffId: 'TEST-003',
          staffName: 'テスト職員3',
          profession: 'nurse',
          experienceLevel: 'senior',
          facility: 'acute',
          department: '看護部',
          position: '主任看護師',
          yearsOfService: 8,
          yearsOfExperience: 8,
          hasManagementExperience: true,
          previousEvaluation: {
            overallRating: 'B'
          }
        },
        reservation: {
          id: 'RES-003',
          type: 'feedback',
          category: 'support',
          duration: 30,
          scheduledDate: new Date(),
          hasAppealIntent: false,
          urgency: 'high'
        }
      }
    },
    {
      name: '特別面談 - 退職面談',
      params: {
        interviewType: 'special' as const,
        subType: 'exit',
        duration: 60,
        staffProfile: {
          staffId: 'TEST-004',
          staffName: 'テスト職員4',
          profession: 'pt',
          experienceLevel: 'veteran',
          facility: 'chronic',
          department: 'リハビリテーション部',
          position: '理学療法士',
          yearsOfService: 10,
          yearsOfExperience: 10,
          hasManagementExperience: false
        },
        reservation: {
          id: 'RES-004',
          type: 'exit_interview',
          category: 'special',
          duration: 60,
          scheduledDate: new Date(),
          exitReason: 'career_change',
          exitDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          urgency: 'medium'
        }
      }
    },
    {
      name: '特別面談 - 復職面談',
      params: {
        interviewType: 'special' as const,
        subType: 'return',
        duration: 45,
        staffProfile: {
          staffId: 'TEST-005',
          staffName: 'テスト職員5',
          profession: 'nurse',
          experienceLevel: 'midlevel',
          facility: 'acute',
          department: '看護部',
          position: '看護師',
          yearsOfService: 4,
          yearsOfExperience: 4,
          hasManagementExperience: false
        },
        reservation: {
          id: 'RES-005',
          type: 'return_to_work',
          category: 'special',
          duration: 45,
          scheduledDate: new Date(),
          absenceReason: 'mental_health',
          absenceDuration: '3ヶ月',
          returnDate: new Date(),
          urgency: 'high'
        }
      }
    }
  ]

  const runTest = async (testCase: typeof testCases[0]) => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      console.log(`テスト実行: ${testCase.name}`)
      console.log('パラメータ:', testCase.params)
      
      const generatedSheet = await UnifiedInterviewGeneratorService.generate(testCase.params)
      
      console.log('生成結果:', generatedSheet)
      setResult({
        testName: testCase.name,
        sheet: generatedSheet,
        success: true
      })
    } catch (err) {
      console.error('テストエラー:', err)
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setResult({
        testName: testCase.name,
        error: err,
        success: false
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>統合面談ジェネレーターテスト</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>テストケース</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
          {testCases.map((testCase, index) => (
            <button
              key={index}
              onClick={() => runTest(testCase)}
              disabled={loading}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: '#f9f9f9',
                cursor: loading ? 'not-allowed' : 'pointer',
                textAlign: 'left'
              }}
            >
              <strong>{testCase.name}</strong>
              <br />
              <small>時間: {testCase.params.duration}分</small>
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
          <p>テスト実行中...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '5px', marginTop: '20px' }}>
          <h3 style={{ color: '#c62828' }}>エラー</h3>
          <pre>{error}</pre>
        </div>
      )}

      {result && result.success && (
        <div style={{ marginTop: '20px' }}>
          <h2>{result.testName} - 成功</h2>
          
          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
            <h3>生成されたシート情報</h3>
            <ul>
              <li>ID: {result.sheet.id}</li>
              <li>タイトル: {result.sheet.title}</li>
              <li>タイプ: {result.sheet.type} / {result.sheet.subType}</li>
              <li>時間: {result.sheet.duration}分</li>
              <li>セクション数: {result.sheet.sections?.length || 0}</li>
              <li>質問総数: {result.sheet.totalQuestions}</li>
            </ul>
          </div>

          <div>
            <h3>セクション詳細</h3>
            {result.sheet.sections?.map((section: any, index: number) => (
              <div key={index} style={{ 
                backgroundColor: '#fff', 
                padding: '15px', 
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}>
                <h4>{section.title} ({section.duration}分)</h4>
                <p>{section.description}</p>
                <details>
                  <summary>質問一覧 ({section.questions?.length || 0}件)</summary>
                  <ul style={{ marginTop: '10px' }}>
                    {section.questions?.map((q: any, qIndex: number) => (
                      <li key={qIndex} style={{ marginBottom: '8px' }}>
                        <strong>Q{qIndex + 1}:</strong> {q.text || q.question}
                        <br />
                        <small>タイプ: {q.type} | 必須: {q.isRequired ? 'はい' : 'いいえ'}</small>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}