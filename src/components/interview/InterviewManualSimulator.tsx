'use client'

import React, { useState } from 'react'
import { InterviewType } from '@/types/interview'
import styles from './InterviewManualSimulator.module.css'
import { UnifiedBankService, UnifiedInterviewParams } from '@/lib/interview-bank/services/unified-bank-service'
import { StaffProfile, PositionDetail } from '@/lib/interview-bank/types-extended'
import DynamicInterviewSheet from '@/components/interview-bank/DynamicInterviewSheet'
import { 
  StaffLevel, 
  JobRole, 
  FacilityType,
  calculateExperienceYears,
  getJobRoleLabel,
  getFacilityTypeLabel
} from '@/types/staff-common'

export default function InterviewManualSimulator() {
  const [staffLevel, setStaffLevel] = useState<StaffLevel>('general')
  const [jobRole, setJobRole] = useState<JobRole>('nurse')
  const [facilityType, setFacilityType] = useState<FacilityType>('acute')
  const [interviewType, setInterviewType] = useState<InterviewType>('regular_annual')
  const [duration, setDuration] = useState<number>(30)
  const [generatedSheet, setGeneratedSheet] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonSheet, setComparisonSheet] = useState<any>(null)

  const staffLevels: { value: StaffLevel; label: string; description: string }[] = [
    { value: 'new', label: '新人', description: '1年未満' },
    { value: 'junior', label: '初級', description: '1-2年' },
    { value: 'general', label: '一般', description: '2-3年' },
    { value: 'midlevel', label: '中堅', description: '3-5年' },
    { value: 'senior', label: '上級', description: '5-7年' },
    { value: 'veteran', label: 'ベテラン', description: '7-10年' },
    { value: 'leader', label: 'リーダー', description: '10年以上' },
    { value: 'chief', label: '主任', description: '主任職' },
    { value: 'manager', label: '管理職', description: '管理職' }
  ]

  const jobRoles: { value: JobRole; label: string }[] = [
    { value: 'nurse', label: '看護師' },
    { value: 'assistant-nurse', label: '准看護師' },
    { value: 'nursing-aide', label: '看護補助者' },
    { value: 'care-worker', label: '介護職員' },
    { value: 'care-assistant', label: '介護補助者' },
    { value: 'pt', label: '理学療法士' },
    { value: 'ot', label: '作業療法士' },
    { value: 'st', label: '言語聴覚士' }
  ]

  const facilityTypes: { value: FacilityType; label: string }[] = [
    { value: 'acute', label: '急性期病院' },
    { value: 'chronic', label: '慢性期病院' },
    { value: 'roken', label: '介護老人保健施設' },
    { value: 'grouphome', label: 'グループホーム' },
    { value: 'outpatient', label: '外来' }
  ]

  const interviewTypes: { value: InterviewType; label: string; description: string }[] = [
    { value: 'regular_annual', label: '定期面談', description: '年次・半期の定期面談' },
    { value: 'career_support', label: 'キャリア支援面談', description: 'キャリア開発・成長支援' },
    { value: 'workplace_support', label: '職場環境支援面談', description: '職場の課題・人間関係' },
    { value: 'individual_consultation', label: '個別相談', description: '個別の悩み・相談' },
    { value: 'goal_setting', label: '目標設定面談', description: '目標設定・評価' }
  ]

  const durations: { value: number; label: string }[] = [
    { value: 15, label: '15分（簡易版）' },
    { value: 30, label: '30分（標準版）' },
    { value: 45, label: '45分（詳細版）' },
    { value: 60, label: '60分（完全版）' }
  ]

  // 経験年数を計算
  const calculateExperienceYears = (level: StaffLevel): number => {
    const experienceMap: Record<StaffLevel, number> = {
      'new': 0,
      'junior': 1,
      'general': 2,
      'midlevel': 4,
      'senior': 6,
      'veteran': 8,
      'leader': 10,
      'chief': 12,
      'manager': 15
    }
    return experienceMap[level] || 2
  }

  // 職種を適切な形式に変換
  const convertJobRole = (role: JobRole): string => {
    const roleMap: Record<JobRole, string> = {
      'nurse': '看護師',
      'assistant-nurse': '准看護師',
      'nursing-aide': '看護補助者',
      'care-worker': '介護職員',
      'care-assistant': '介護補助者',
      'pt': '理学療法士',
      'ot': '作業療法士',
      'st': '言語聴覚士'
    }
    return roleMap[role] || '看護師'
  }

  // 施設タイプを適切な形式に変換
  const convertFacilityType = (facility: FacilityType): string => {
    const facilityMap: Record<FacilityType, string> = {
      'acute': '急性期病院',
      'chronic': '慢性期病院',
      'roken': '介護老人保健施設',
      'grouphome': 'グループホーム',
      'outpatient': '外来'
    }
    return facilityMap[facility] || '急性期病院'
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const unifiedService = UnifiedBankService.getInstance()
      
      // スタッフプロファイルの作成
      const staffProfile: StaffProfile = {
        staffId: `SIM-${Date.now()}`,
        name: 'シミュレーション職員',
        department: '看護部',
        position: convertJobRole(jobRole),
        experienceYears: calculateExperienceYears(staffLevel),
        experienceMonths: 0,
        facility: convertFacilityType(facilityType),
        qualifications: [],
        lastInterviewDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6ヶ月前
        interests: [],
        challenges: []
      }

      // 面談パラメータの作成
      const params: UnifiedInterviewParams = {
        type: interviewType === 'regular_annual' ? 'regular' : 
              interviewType.includes('support') ? 'support' : 
              'special',
        staffProfile,
        duration,
        interviewDate: new Date().toISOString(),
        interviewer: '人事担当者',
        isNewEmployee: staffLevel === 'new',
        isManager: staffLevel === 'manager' || staffLevel === 'chief'
      }

      // 特別面談の場合の追加パラメータ
      if (params.type === 'special') {
        params.specialType = 'career'
        params.specialContext = {
          reason: 'キャリア相談',
          details: 'シミュレーション用の特別面談'
        }
      }

      // サポート面談の場合の追加パラメータ
      if (params.type === 'support') {
        params.supportCategory = 'workplace'
        params.supportTopic = '職場環境改善'
        params.supportDetails = 'シミュレーション用のサポート面談'
      }

      // 面談シートの生成
      const sheet = await unifiedService.generateInterview(params)
      setGeneratedSheet(sheet)
      
      if (showComparison && comparisonSheet) {
        setComparisonSheet(null)
      }
    } catch (error) {
      console.error('シート生成エラー:', error)
      alert('面談シートの生成に失敗しました')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCompare = async () => {
    if (!generatedSheet) return
    
    setIsGenerating(true)
    try {
      const unifiedService = UnifiedBankService.getInstance()
      
      // 比較用のプロファイル（現在の設定を使用）
      const staffProfile: StaffProfile = {
        staffId: `SIM-CMP-${Date.now()}`,
        name: 'シミュレーション職員（比較）',
        department: '看護部',
        position: convertJobRole(jobRole),
        experienceYears: calculateExperienceYears(staffLevel),
        experienceMonths: 0,
        facility: convertFacilityType(facilityType),
        qualifications: [],
        lastInterviewDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        interests: [],
        challenges: []
      }

      const params: UnifiedInterviewParams = {
        type: interviewType === 'regular_annual' ? 'regular' : 
              interviewType.includes('support') ? 'support' : 
              'special',
        staffProfile,
        duration,
        interviewDate: new Date().toISOString(),
        interviewer: '人事担当者',
        isNewEmployee: staffLevel === 'new',
        isManager: staffLevel === 'manager' || staffLevel === 'chief'
      }

      if (params.type === 'special') {
        params.specialType = 'career'
        params.specialContext = {
          reason: 'キャリア相談',
          details: 'シミュレーション用の特別面談（比較）'
        }
      }

      if (params.type === 'support') {
        params.supportCategory = 'workplace'
        params.supportTopic = '職場環境改善'
        params.supportDetails = 'シミュレーション用のサポート面談（比較）'
      }

      const sheet = await unifiedService.generateInterview(params)
      setComparisonSheet(sheet)
      setShowComparison(true)
    } catch (error) {
      console.error('比較シート生成エラー:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportToPDF = () => {
    if (!generatedSheet) return
    
    window.print()
  }

  return (
    <div className={styles.simulator}>
      <div className={styles.header}>
        <h1>🎯 面談マニュアルシミュレーター</h1>
        <p>条件を選択して、実際の面談で使用される質問内容を確認できます</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>職種</label>
          <select 
            value={jobRole} 
            onChange={(e) => setJobRole(e.target.value as JobRole)}
            className={styles.select}
          >
            {jobRoles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>経験レベル</label>
          <select 
            value={staffLevel} 
            onChange={(e) => setStaffLevel(e.target.value as StaffLevel)}
            className={styles.select}
          >
            {staffLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label} ({level.description})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>施設タイプ</label>
          <select 
            value={facilityType} 
            onChange={(e) => setFacilityType(e.target.value as FacilityType)}
            className={styles.select}
          >
            {facilityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>面談種別</label>
          <select 
            value={interviewType} 
            onChange={(e) => setInterviewType(e.target.value as InterviewType)}
            className={styles.select}
          >
            {interviewTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>面談時間</label>
          <select 
            value={duration} 
            onChange={(e) => setDuration(Number(e.target.value))}
            className={styles.select}
          >
            {durations.map(d => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={styles.generateButton}
          >
            {isGenerating ? '生成中...' : '🔄 面談シート生成'}
          </button>
          
          {generatedSheet && (
            <>
              <button 
                onClick={handleCompare}
                disabled={isGenerating}
                className={styles.compareButton}
              >
                📊 条件変更して比較
              </button>
              <button 
                onClick={exportToPDF}
                className={styles.exportButton}
              >
                📄 PDF出力
              </button>
            </>
          )}
        </div>
      </div>

      {generatedSheet && (
        <div className={showComparison ? styles.comparisonView : styles.singleView}>
          <div className={styles.sheetPanel}>
            <div className={styles.sheetHeader}>
              <h2>生成された面談シート</h2>
              <div className={styles.sheetMeta}>
                <span>バージョン: {generatedSheet.metadata?.version || 'v6'}</span>
                <span>生成日時: {new Date().toLocaleString()}</span>
              </div>
            </div>
            <DynamicInterviewSheet 
              interviewSheet={generatedSheet}
              isReadOnly={true}
              onUpdate={() => {}}
            />
          </div>
          
          {showComparison && comparisonSheet && (
            <div className={styles.sheetPanel}>
              <div className={styles.sheetHeader}>
                <h2>比較用面談シート</h2>
                <div className={styles.sheetMeta}>
                  <span>バージョン: {comparisonSheet.metadata?.version || 'v6'}</span>
                  <span>生成日時: {new Date().toLocaleString()}</span>
                </div>
              </div>
              <DynamicInterviewSheet 
                interviewSheet={comparisonSheet}
                isReadOnly={true}
                onUpdate={() => {}}
              />
            </div>
          )}
        </div>
      )}

      {!generatedSheet && !isGenerating && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderContent}>
            <span className={styles.placeholderIcon}>📋</span>
            <h3>面談シートを生成してみましょう</h3>
            <p>上部の条件を選択して「面談シート生成」ボタンをクリックすると、</p>
            <p>実際の面談で使用される質問シートが表示されます。</p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span>✅</span>
                <span>面談ステーションと同じ質問DB使用</span>
              </div>
              <div className={styles.feature}>
                <span>✅</span>
                <span>v4/v5/v6面談シートの実装済み内容</span>
              </div>
              <div className={styles.feature}>
                <span>✅</span>
                <span>職種別・レベル別の最適化</span>
              </div>
              <div className={styles.feature}>
                <span>✅</span>
                <span>5段階評価＋テキスト入力対応</span>
              </div>
              <div className={styles.feature}>
                <span>✅</span>
                <span>PT/OT/ST専用質問も完備</span>
              </div>
              <div className={styles.feature}>
                <span>✅</span>
                <span>実際の面談と同じ内容を確認可能</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}