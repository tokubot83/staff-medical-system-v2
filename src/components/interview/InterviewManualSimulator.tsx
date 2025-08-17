'use client'

import React, { useState } from 'react'
import { 
  InterviewManualGenerationService,
  ManualGenerationRequest,
  GeneratedInterviewManual,
  StaffLevel,
  JobRole,
  FacilityType,
  InterviewDuration
} from '@/services/interviewManualGenerationServiceV2'
import { InterviewType } from '@/types/interview'
import styles from './InterviewManualSimulator.module.css'

export default function InterviewManualSimulator() {
  const [staffLevel, setStaffLevel] = useState<StaffLevel>('general')
  const [jobRole, setJobRole] = useState<JobRole>('nurse')
  const [facilityType, setFacilityType] = useState<FacilityType>('acute')
  const [interviewType, setInterviewType] = useState<InterviewType>('regular_annual')
  const [duration, setDuration] = useState<InterviewDuration>(30)
  const [generatedManual, setGeneratedManual] = useState<GeneratedInterviewManual | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonManual, setComparisonManual] = useState<GeneratedInterviewManual | null>(null)

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

  const durations: { value: InterviewDuration; label: string }[] = [
    { value: 15, label: '15分（簡易版）' },
    { value: 30, label: '30分（標準版）' },
    { value: 45, label: '45分（詳細版）' },
    { value: 60, label: '60分（完全版）' }
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const request: ManualGenerationRequest = {
        staffLevel,
        jobRole,
        facilityType,
        interviewType,
        duration
      }
      
      const manual = await InterviewManualGenerationService.generateManual(request)
      setGeneratedManual(manual)
      
      if (showComparison && comparisonManual) {
        setComparisonManual(null)
      }
    } catch (error) {
      console.error('マニュアル生成エラー:', error)
      alert('マニュアルの生成に失敗しました')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCompare = async () => {
    if (!generatedManual) return
    
    setIsGenerating(true)
    try {
      const compareRequest: ManualGenerationRequest = {
        staffLevel,
        jobRole,
        facilityType,
        interviewType,
        duration
      }
      
      const manual = await InterviewManualGenerationService.generateManual(compareRequest)
      setComparisonManual(manual)
      setShowComparison(true)
    } catch (error) {
      console.error('比較マニュアル生成エラー:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportToPDF = () => {
    if (!generatedManual) return
    
    const printContent = document.getElementById('manual-content')
    if (!printContent) return
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${generatedManual.title}</title>
          <style>
            body { font-family: 'Noto Sans JP', sans-serif; padding: 20px; }
            h1 { color: #2c3e50; border-bottom: 2px solid #3498db; }
            h2 { color: #34495e; margin-top: 30px; }
            h3 { color: #555; }
            .section { margin: 20px 0; padding: 15px; background: #f8f9fa; }
            .question { margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #3498db; }
            .meta-info { color: #666; font-size: 0.9em; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const renderManualContent = (manual: GeneratedInterviewManual, isComparison = false) => (
    <div className={styles.manualContent} id={isComparison ? 'comparison-content' : 'manual-content'}>
      <div className={styles.manualHeader}>
        <h2>{manual.title}</h2>
        <div className={styles.metaInfo}>
          <span>生成日時: {new Date(manual.generatedAt).toLocaleString()}</span>
          <span>推定時間: {manual.estimatedDuration}分</span>
        </div>
      </div>

      <div className={styles.staffInfo}>
        <h3>対象職員情報</h3>
        <div className={styles.infoGrid}>
          <div>職種: {manual.staffInfo.jobRole}</div>
          <div>レベル: {manual.staffInfo.levelDescription}</div>
          <div>施設: {manual.staffInfo.facility}</div>
        </div>
      </div>

      <div className={styles.overview}>
        <h3>面談概要</h3>
        <div className={styles.overviewSection}>
          <h4>目的</h4>
          <p>{manual.overview.purpose}</p>
        </div>
        <div className={styles.overviewSection}>
          <h4>目標</h4>
          <ul>
            {manual.overview.objectives.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>
        <div className={styles.overviewSection}>
          <h4>重要ポイント</h4>
          <ul>
            {manual.overview.keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.sections}>
        <h3>面談セクション</h3>
        {manual.sections.map((section, sectionIdx) => (
          <div key={sectionIdx} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4>{section.title}</h4>
              <span className={styles.duration}>{section.duration}分</span>
            </div>
            
            <div className={styles.questions}>
              {section.questions.map((q, qIdx) => (
                <div key={qIdx} className={styles.question}>
                  <div className={styles.questionHeader}>
                    <span className={styles.questionNumber}>Q{sectionIdx + 1}-{qIdx + 1}</span>
                    <span className={styles.questionType}>{q.type}</span>
                  </div>
                  <p className={styles.questionText}>{q.question}</p>
                  
                  {q.details && (
                    <div className={styles.questionDetails}>
                      <div className={styles.purpose}>
                        <strong>目的:</strong> {q.details.purpose}
                      </div>
                      {q.details.askingTips && q.details.askingTips.length > 0 && (
                        <div className={styles.tips}>
                          <strong>質問のコツ:</strong>
                          <ul>
                            {q.details.askingTips.map((tip, tipIdx) => (
                              <li key={tipIdx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {q.hybridInput && (
                    <div className={styles.hybridInput}>
                      <div className={styles.scaleInput}>
                        <label>{q.hybridInput.scaleLabel}</label>
                        <div className={styles.scaleOptions}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <span key={n} className={styles.scaleOption}>{n}</span>
                          ))}
                        </div>
                      </div>
                      <div className={styles.textInput}>
                        <label>{q.hybridInput.textLabel}</label>
                        <textarea 
                          placeholder={q.hybridInput.textPlaceholder}
                          disabled
                          className={styles.textArea}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.timeAllocation}>
        <h3>時間配分</h3>
        <div className={styles.timeChart}>
          {manual.timeAllocation.map((time, idx) => (
            <div key={idx} className={styles.timeItem}>
              <div className={styles.timeBar}>
                <div 
                  className={styles.timeProgress} 
                  style={{ width: `${time.percentage}%` }}
                />
              </div>
              <div className={styles.timeLabel}>
                <span>{time.section}</span>
                <span>{time.minutes}分 ({time.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.simulator}>
      <div className={styles.header}>
        <h1>🎯 面談マニュアルシミュレーター</h1>
        <p>条件を選択して、動的に生成される面談マニュアルを確認できます</p>
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
            onChange={(e) => setDuration(Number(e.target.value) as InterviewDuration)}
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
            {isGenerating ? '生成中...' : '🔄 マニュアル生成'}
          </button>
          
          {generatedManual && (
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

      {generatedManual && (
        <div className={showComparison ? styles.comparisonView : styles.singleView}>
          <div className={styles.manualPanel}>
            {renderManualContent(generatedManual)}
          </div>
          
          {showComparison && comparisonManual && (
            <div className={styles.manualPanel}>
              {renderManualContent(comparisonManual, true)}
            </div>
          )}
        </div>
      )}

      {!generatedManual && !isGenerating && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderContent}>
            <span className={styles.placeholderIcon}>📋</span>
            <h3>面談マニュアルを生成してみましょう</h3>
            <p>上部の条件を選択して「マニュアル生成」ボタンをクリックすると、</p>
            <p>選択した条件に最適化された面談マニュアルが表示されます。</p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span>✅</span>
                <span>職種別・レベル別の最適化</span>
              </div>
              <div className={styles.feature}>
                <span>✅</span>
                <span>1問1答形式での質問生成</span>
              </div>
              <div className={styles.feature}>
                <span>✅</span>
                <span>5段階評価＋テキスト入力対応</span>
              </div>
              <div className={styles.feature}>
                <span>✅</span>
                <span>時間配分の自動計算</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}