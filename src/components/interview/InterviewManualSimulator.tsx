'use client'

import React, { useState } from 'react'
import { InterviewType } from '@/types/interview'
import styles from './InterviewManualSimulator.module.css'
import { generateV4InterviewSheet } from '@/lib/interview-bank/services/v4-generator'
import { ExtendedInterviewParams, StaffProfile as ExtendedStaffProfile } from '@/lib/interview-bank/types-extended'
import { UnifiedInterviewGeneratorService } from '@/lib/interview-bank/services/unified-generator-service'
import DynamicInterviewSheet from '@/components/interview-bank/DynamicInterviewSheet'
import { 
  StaffLevel, 
  JobRole, 
  FacilityType,
  calculateExperienceYears,
  getJobRoleLabel,
  getFacilityTypeLabel,
  ExperienceLevel
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
  const [staffProfile, setStaffProfile] = useState<any>(null)
  const [comparisonStaffProfile, setComparisonStaffProfile] = useState<any>(null)
  const [showComparisonModal, setShowComparisonModal] = useState(false)
  
  // 比較用の条件を別途管理
  const [compareStaffLevel, setCompareStaffLevel] = useState<StaffLevel>('general')
  const [compareJobRole, setCompareJobRole] = useState<JobRole>('nurse')
  const [compareFacilityType, setCompareFacilityType] = useState<FacilityType>('acute')
  const [compareInterviewType, setCompareInterviewType] = useState<InterviewType>('regular_annual')
  const [compareDuration, setCompareDuration] = useState<number>(30)

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

  // getSubTypeFromInterviewTypeヘルパー関数を追加
  const getSubTypeFromInterviewType = (interviewType: InterviewType): string => {
    const typeMap: Record<string, string> = {
      'return_to_work': 'return',
      'incident_followup': 'incident',
      'exit_interview': 'exit',
      'feedback': 'feedback',
      'career_support': 'career',
      'workplace_support': 'consultation',
      'individual_consultation': 'consultation'
    }
    return typeMap[interviewType] || interviewType
  }

  const interviewTypes: { value: InterviewType; label: string; description: string; classification: 'regular' | 'special' | 'support' }[] = [
    // 定期面談
    { value: 'new_employee_monthly', label: '新入職員月次面談', description: '入職1年未満の定期面談', classification: 'regular' },
    { value: 'regular_annual', label: '一般職員年次面談', description: '年次の定期面談', classification: 'regular' },
    { value: 'management_biannual', label: '管理職半年面談', description: '管理職向け半期面談', classification: 'regular' },
    // 特別面談
    { value: 'return_to_work', label: '復職面談', description: '休職からの復職時面談', classification: 'special' },
    { value: 'incident_followup', label: 'インシデント後面談', description: 'インシデント発生後のフォロー', classification: 'special' },
    { value: 'exit_interview', label: '退職面談', description: '退職時の面談', classification: 'special' },
    // サポート面談
    { value: 'feedback', label: 'フィードバック面談', description: '人事評価後のフィードバック', classification: 'support' },
    { value: 'career_support', label: 'キャリア支援面談', description: 'キャリア開発・成長支援', classification: 'support' },
    { value: 'workplace_support', label: '職場環境支援面談', description: '職場の課題・人間関係', classification: 'support' },
    { value: 'individual_consultation', label: '個別相談面談', description: '個別の悩み・相談', classification: 'support' }
  ]

  const durations: { value: number; label: string }[] = [
    { value: 15, label: '15分（簡易版）' },
    { value: 30, label: '30分（標準版）' },
    { value: 45, label: '45分（詳細版）' },
    { value: 60, label: '60分（完全版）' }
  ]

  // StaffLevelをExperienceLevelにマッピング
  const getExperienceLevel = (staffLevel: StaffLevel): ExperienceLevel => {
    switch (staffLevel) {
      case 'new': return 'new';
      case 'junior': return 'junior';
      case 'general': 
      case 'midlevel': return 'midlevel';
      case 'senior':
      case 'veteran': return 'veteran';
      case 'leader': return 'senior';  // リーダーは上級扱い
      case 'chief': return 'supervisor';  // 主任
      case 'manager': return 'manager';  // 師長・管理職
      default: return 'midlevel';
    }
  }


  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // ExtendedStaffProfile用のスタッフプロファイルを作成
      const experienceLevel = getExperienceLevel(staffLevel);
      const newStaffProfile: ExtendedStaffProfile = {
        id: `SIM-${Date.now()}`,
        name: 'シミュレーション職員',
        department: '看護部',
        profession: jobRole,
        facilityType: facilityType,
        experienceLevel: experienceLevel,
        positionLevel: staffLevel === 'manager' ? 'manager' : staffLevel === 'chief' ? 'chief' : 'staff',
        experienceYears: calculateExperienceYears(staffLevel),
        position: {
          name: getJobRoleLabel(jobRole),
          level: staffLevel,
          responsibilities: []
        },
        hireDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000 * calculateExperienceYears(staffLevel)).toISOString(),
        motivationType: 'growth'
      }
      setStaffProfile(newStaffProfile)

      // 面談タイプの分類を判定
      const classification = interviewTypes.find(t => t.value === interviewType)?.classification || 'regular'
      
      let generatedSheet;
      
      if (classification === 'regular') {
        // 定期面談はv4-generatorを使用
        const params: ExtendedInterviewParams = {
          staff: newStaffProfile,
          duration: duration,
          interviewType: interviewType,
          interviewDate: new Date(),
          interviewerId: 'simulator',
          interviewerName: '人事担当者',
          includePositionQuestions: true,
          includeFacilityQuestions: true
        }
        console.log('Generating regular interview with v4-generator:', params)
        generatedSheet = generateV4InterviewSheet(params)
      } else {
        // サポート面談・特別面談は統合サービスを使用
        const unifiedParams = {
          interviewType: classification as 'support' | 'special',
          subType: getSubTypeFromInterviewType(interviewType),
          duration: duration,
          staffProfile: {
            staffId: newStaffProfile.id,
            staffName: newStaffProfile.name,
            profession: newStaffProfile.profession,
            experienceLevel: newStaffProfile.experienceLevel,
            facility: newStaffProfile.facilityType,
            department: newStaffProfile.department,
            position: newStaffProfile.position.name,
            yearsOfService: newStaffProfile.experienceYears,
            yearsOfExperience: newStaffProfile.experienceYears,
            hasManagementExperience: ['chief', 'manager'].includes(staffLevel)
          },
          reservation: {
            id: `SIM-RES-${Date.now()}`,
            type: interviewType,
            category: classification,
            duration: duration,
            scheduledDate: new Date(),
            consultationDetails: '',
            urgency: 'medium'
          }
        }
        console.log('Generating support/special interview with unified service:', unifiedParams)
        generatedSheet = await UnifiedInterviewGeneratorService.generate(unifiedParams)
      }
      
      console.log('Generated sheet:', generatedSheet)
      
      if (generatedSheet) {
        setGeneratedSheet(generatedSheet)
      } else {
        console.error('No valid sheet generated')
        throw new Error('生成に失敗しました')
      }
      
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

  const handleOpenComparisonModal = () => {
    if (!generatedSheet) return
    
    // 現在の条件を比較用の初期値として設定
    setCompareStaffLevel(staffLevel)
    setCompareJobRole(jobRole)
    setCompareFacilityType(facilityType)
    setCompareInterviewType(interviewType)
    setCompareDuration(duration)
    setShowComparisonModal(true)
  }

  const handleGenerateComparison = async () => {
    setIsGenerating(true)
    try {
      // 比較用のプロファイル（変更された条件を使用）
      const experienceLevel = getExperienceLevel(compareStaffLevel);
      const compareProfile: ExtendedStaffProfile = {
        id: `SIM-CMP-${Date.now()}`,
        name: 'シミュレーション職員（比較）',
        department: '看護部',
        profession: compareJobRole,
        facilityType: compareFacilityType,
        experienceLevel: experienceLevel,
        positionLevel: compareStaffLevel === 'manager' ? 'manager' : compareStaffLevel === 'chief' ? 'chief' : 'staff',
        experienceYears: calculateExperienceYears(compareStaffLevel),
        position: {
          name: getJobRoleLabel(compareJobRole),
          level: compareStaffLevel,
          responsibilities: []
        },
        hireDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000 * calculateExperienceYears(compareStaffLevel)).toISOString(),
        motivationType: 'growth'
      }
      setComparisonStaffProfile(compareProfile)

      // 面談タイプの分類を判定
      const classification = interviewTypes.find(t => t.value === compareInterviewType)?.classification || 'regular'
      
      let comparisonSheet;
      
      if (classification === 'regular') {
        // 定期面談はv4-generatorを使用
        const params: ExtendedInterviewParams = {
          staff: compareProfile,
          duration: compareDuration,
          interviewType: compareInterviewType,
          interviewDate: new Date(),
          interviewerId: 'simulator-compare',
          interviewerName: '人事担当者',
          includePositionQuestions: true,
          includeFacilityQuestions: true
        }
        console.log('Generating comparison regular interview with v4-generator:', params)
        comparisonSheet = generateV4InterviewSheet(params)
      } else {
        // サポート面談・特別面談は統合サービスを使用
        const unifiedParams = {
          interviewType: classification as 'support' | 'special',
          subType: getSubTypeFromInterviewType(compareInterviewType),
          duration: compareDuration,
          staffProfile: {
            staffId: compareProfile.id,
            staffName: compareProfile.name,
            profession: compareProfile.profession,
            experienceLevel: compareProfile.experienceLevel,
            facility: compareProfile.facilityType,
            department: compareProfile.department,
            position: compareProfile.position.name,
            yearsOfService: compareProfile.experienceYears,
            yearsOfExperience: compareProfile.experienceYears,
            hasManagementExperience: ['chief', 'manager'].includes(compareStaffLevel)
          },
          reservation: {
            id: `SIM-CMP-RES-${Date.now()}`,
            type: compareInterviewType,
            category: classification,
            duration: compareDuration,
            scheduledDate: new Date(),
            consultationDetails: '',
            urgency: 'medium'
          }
        }
        console.log('Generating comparison support/special interview with unified service:', unifiedParams)
        comparisonSheet = await UnifiedInterviewGeneratorService.generate(unifiedParams)
      }
      
      if (comparisonSheet) {
        setComparisonSheet(comparisonSheet)
        setShowComparison(true)
        setShowComparisonModal(false)
      } else {
        console.error('No valid comparison sheet generated')
      }
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
        <div className={styles.featureNotice}>
          <span className={styles.badge}>NEW</span>
          サポート面談（キャリア相談・個別相談・フィードバック）と特別面談（退職・復職・インシデント）に対応しました
        </div>
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
            <optgroup label="定期面談">
              {interviewTypes.filter(t => t.classification === 'regular').map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="特別面談">
              {interviewTypes.filter(t => t.classification === 'special').map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="サポート面談">
              {interviewTypes.filter(t => t.classification === 'support').map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </optgroup>
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
          
          {generatedSheet && staffProfile && (
            <>
              <button 
                onClick={handleOpenComparisonModal}
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

      {generatedSheet && staffProfile && (
        <div className={showComparison ? styles.comparisonView : styles.singleView}>
          <div className={styles.sheetPanel}>
            <div className={styles.sheetHeader}>
              <h2>生成された面談シート</h2>
              <div className={styles.sheetMeta}>
                <span>バージョン: {generatedSheet?.metadata?.version || 'v6'}</span>
                <span>生成日時: {new Date().toLocaleString()}</span>
              </div>
              {showComparison && (
                <div className={styles.conditionSummary}>
                  <h4>条件</h4>
                  <ul>
                    <li>職種: {getJobRoleLabel(jobRole)}</li>
                    <li>レベル: {staffLevels.find(l => l.value === staffLevel)?.label}</li>
                    <li>施設: {getFacilityTypeLabel(facilityType)}</li>
                    <li>種別: {interviewTypes.find(t => t.value === interviewType)?.label}</li>
                    <li>時間: {duration}分</li>
                  </ul>
                </div>
              )}
            </div>
            <DynamicInterviewSheet 
              sheetData={generatedSheet}
              staffProfile={staffProfile}
              readOnly={true}
              onSave={() => {}}
            />
          </div>
          
          {showComparison && comparisonSheet && comparisonStaffProfile && (
            <div className={styles.sheetPanel}>
              <div className={styles.sheetHeader}>
                <h2>比較用面談シート</h2>
                <div className={styles.sheetMeta}>
                  <span>バージョン: {comparisonSheet.metadata?.version || 'v6'}</span>
                  <span>生成日時: {new Date().toLocaleString()}</span>
                </div>
                <div className={styles.conditionSummary}>
                  <h4>条件</h4>
                  <ul>
                    <li className={compareJobRole !== jobRole ? styles.diff : ''}>
                      職種: {getJobRoleLabel(compareJobRole)}
                    </li>
                    <li className={compareStaffLevel !== staffLevel ? styles.diff : ''}>
                      レベル: {staffLevels.find(l => l.value === compareStaffLevel)?.label}
                    </li>
                    <li className={compareFacilityType !== facilityType ? styles.diff : ''}>
                      施設: {getFacilityTypeLabel(compareFacilityType)}
                    </li>
                    <li className={compareInterviewType !== interviewType ? styles.diff : ''}>
                      種別: {interviewTypes.find(t => t.value === compareInterviewType)?.label}
                    </li>
                    <li className={compareDuration !== duration ? styles.diff : ''}>
                      時間: {compareDuration}分
                    </li>
                  </ul>
                </div>
              </div>
              <DynamicInterviewSheet 
                sheetData={comparisonSheet}
                staffProfile={comparisonStaffProfile}
                readOnly={true}
                onSave={() => {}}
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

      {/* 比較条件設定モーダル */}
      {showComparisonModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>比較条件の設定</h2>
              <button 
                onClick={() => setShowComparisonModal(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>
                比較用の条件を変更して、異なる設定での面談シートを生成できます。
              </p>
              
              <div className={styles.modalControls}>
                <div className={styles.controlGroup}>
                  <label>職種</label>
                  <select 
                    value={compareJobRole} 
                    onChange={(e) => setCompareJobRole(e.target.value as JobRole)}
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
                    value={compareStaffLevel} 
                    onChange={(e) => setCompareStaffLevel(e.target.value as StaffLevel)}
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
                    value={compareFacilityType} 
                    onChange={(e) => setCompareFacilityType(e.target.value as FacilityType)}
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
                    value={compareInterviewType} 
                    onChange={(e) => setCompareInterviewType(e.target.value as InterviewType)}
                    className={styles.select}
                  >
                    <optgroup label="定期面談">
                      {interviewTypes.filter(t => t.classification === 'regular').map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="特別面談">
                      {interviewTypes.filter(t => t.classification === 'special').map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="サポート面談">
                      {interviewTypes.filter(t => t.classification === 'support').map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className={styles.controlGroup}>
                  <label>面談時間</label>
                  <select 
                    value={compareDuration} 
                    onChange={(e) => setCompareDuration(Number(e.target.value))}
                    className={styles.select}
                  >
                    {durations.map(d => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className={styles.comparisonPreview}>
                <div className={styles.comparisonRow}>
                  <div className={styles.comparisonColumn}>
                    <h4>現在の条件</h4>
                    <ul>
                      <li>職種: {getJobRoleLabel(jobRole)}</li>
                      <li>レベル: {staffLevels.find(l => l.value === staffLevel)?.label}</li>
                      <li>施設: {getFacilityTypeLabel(facilityType)}</li>
                      <li>種別: {interviewTypes.find(t => t.value === interviewType)?.label}</li>
                      <li>時間: {duration}分</li>
                    </ul>
                  </div>
                  <div className={styles.comparisonArrow}>→</div>
                  <div className={styles.comparisonColumn}>
                    <h4>比較条件</h4>
                    <ul>
                      <li className={compareJobRole !== jobRole ? styles.changed : ''}>
                        職種: {getJobRoleLabel(compareJobRole)}
                      </li>
                      <li className={compareStaffLevel !== staffLevel ? styles.changed : ''}>
                        レベル: {staffLevels.find(l => l.value === compareStaffLevel)?.label}
                      </li>
                      <li className={compareFacilityType !== facilityType ? styles.changed : ''}>
                        施設: {getFacilityTypeLabel(compareFacilityType)}
                      </li>
                      <li className={compareInterviewType !== interviewType ? styles.changed : ''}>
                        種別: {interviewTypes.find(t => t.value === compareInterviewType)?.label}
                      </li>
                      <li className={compareDuration !== duration ? styles.changed : ''}>
                        時間: {compareDuration}分
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                onClick={() => setShowComparisonModal(false)}
                className={styles.cancelButton}
              >
                キャンセル
              </button>
              <button 
                onClick={handleGenerateComparison}
                disabled={isGenerating}
                className={styles.generateButton}
              >
                {isGenerating ? '生成中...' : '比較シートを生成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}