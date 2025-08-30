'use client';

import React, { useState } from 'react';
import { staffDatabase } from '@/app/data/staffData';
import InterviewSheetSelector from '@/components/interview/InterviewSheetSelector';
import InterviewSheetWrapper from '@/components/interview/InterviewSheetWrapper';
import { getExperienceCategory } from '@/utils/experienceUtils';
import styles from './ThreeStepInterviewFlow.module.css';
import { InterviewType, InterviewCategory, requiresCategory, availableCategories } from '@/types/interview';

// 面談分類の定義
const interviewClassifications = [
  {
    id: 'regular',
    name: '定期面談',
    description: '月次・年次・半期などの定期的な面談',
    icon: '📅',
    color: '#4CAF50'
  },
  {
    id: 'special',
    name: '特別面談',
    description: '特定の状況で実施する面談',
    icon: '⚠️',
    color: '#FF9800'
  },
  {
    id: 'support',
    name: 'サポート面談',
    description: '職員の希望に応じて実施する支援面談',
    icon: '💬',
    color: '#2196F3'
  }
];

// 面談種別の定義（10種類）
const interviewTypesByClassification = {
  regular: [
    { id: 'new_employee_monthly', name: '新入職員月次面談', target: '入職1年未満', frequency: '月1回' },
    { id: 'regular_annual', name: '一般職員年次面談', target: '全職員', frequency: '年1回' },
    { id: 'management_biannual', name: '管理職半年面談', target: '管理職', frequency: '半年1回' }
  ],
  special: [
    { id: 'return_to_work', name: '復職面談', target: '休職からの復職者', trigger: '復職時' },
    { id: 'incident_followup', name: 'インシデント後面談', target: '当事者職員', trigger: 'インシデント発生後' },
    { id: 'exit_interview', name: '退職面談', target: '退職予定者', trigger: '退職前' }
  ],
  support: [
    { id: 'feedback', name: 'フィードバック面談', target: '評価開示後の希望者' },
    { id: 'career_support', name: 'キャリア系面談', target: '全職員' },
    { id: 'workplace_support', name: '職場環境系面談', target: '全職員' },
    { id: 'individual_consultation', name: '個別相談面談', target: '全職員' }
  ]
};

export default function ThreeStepInterviewFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClassification, setSelectedClassification] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showInterviewSheet, setShowInterviewSheet] = useState(false);

  // Step 1: 面談分類を選択
  const handleClassificationSelect = (classificationId: string) => {
    setSelectedClassification(classificationId);
    setCurrentStep(2);
  };

  // Step 2: 面談種別を選択
  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    
    // カテゴリが必要な面談かチェック
    if (requiresCategory(typeId as InterviewType)) {
      setCurrentStep(3);
    } else {
      setCurrentStep(4);
    }
  };

  // Step 3: カテゴリを選択
  const handleCategorySelect = (category: InterviewCategory) => {
    setSelectedCategory(category);
    setCurrentStep(4);
  };

  // Step 4: 職員と日時を選択
  const handleStaffDateSelect = (staffId: string, date: string, time: string) => {
    const staff = Object.values(staffDatabase).find(s => s.id === staffId);
    setSelectedStaff(staff);
    setSelectedDate(date);
    setSelectedTime(time);
    setShowInterviewSheet(true);
  };

  // 前のステップに戻る
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setSelectedClassification('');
      } else if (currentStep === 3) {
        setSelectedType('');
      } else if (currentStep === 4) {
        setSelectedCategory(null);
      }
    }
  };

  // リセット
  const resetFlow = () => {
    setCurrentStep(1);
    setSelectedClassification('');
    setSelectedType('');
    setSelectedCategory(null);
    setSelectedStaff(null);
    setSelectedDate('');
    setSelectedTime('');
    setShowInterviewSheet(false);
  };

  // プログレスバーのレンダリング
  const renderProgressBar = () => {
    const steps = ['面談分類', '面談種別', 'カテゴリ', '職員・日時'];
    const totalSteps = requiresCategory(selectedType as InterviewType) ? 4 : 3;
    
    return (
      <div className={styles.progressBar}>
        {steps.slice(0, totalSteps).map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          // カテゴリステップをスキップする場合の調整
          if (!requiresCategory(selectedType as InterviewType) && stepNumber === 3) {
            return null;
          }
          
          return (
            <div key={stepNumber} className={styles.progressStep}>
              <div className={`${styles.stepCircle} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span className={styles.stepLabel}>{step}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // 選択内容のサマリー
  const renderSummary = () => {
    return (
      <div className={styles.summary}>
        <h3>選択内容</h3>
        {selectedClassification && (
          <p>面談分類: {interviewClassifications.find(c => c.id === selectedClassification)?.name}</p>
        )}
        {selectedType && (
          <p>面談種別: {Object.values(interviewTypesByClassification).flat().find(t => t.id === selectedType)?.name}</p>
        )}
        {selectedCategory && (
          <p>カテゴリ: {selectedCategory}</p>
        )}
        {selectedStaff && (
          <p>対象職員: {selectedStaff.name}</p>
        )}
        {selectedDate && selectedTime && (
          <p>日時: {selectedDate} {selectedTime}</p>
        )}
      </div>
    );
  };

  if (showInterviewSheet && selectedStaff) {
    // Calculate experience category based on tenure
    const tenureYears = parseInt(selectedStaff.tenure) || 0;
    const experienceCategory = getExperienceCategory(tenureYears);
    
    return (
      <div className="interview-sheet-fullwidth" style={{ margin: '-20px' }}>
        <InterviewSheetWrapper
          experienceCategory={experienceCategory}
          duration={30}
          staffName={selectedStaff.name}
          yearsOfExperience={tenureYears}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>面談予約システム</h1>
        {renderProgressBar()}
      </div>

      <div className={styles.content}>
        {/* Step 1: 面談分類選択 */}
        {currentStep === 1 && (
          <div className={styles.stepContent}>
            <h2>ステップ1: 面談分類を選択してください</h2>
            <div className={styles.classificationGrid}>
              {interviewClassifications.map(classification => (
                <button
                  key={classification.id}
                  className={styles.classificationCard}
                  onClick={() => handleClassificationSelect(classification.id)}
                  style={{ borderColor: classification.color }}
                >
                  <span className={styles.icon}>{classification.icon}</span>
                  <h3>{classification.name}</h3>
                  <p>{classification.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 面談種別選択 */}
        {currentStep === 2 && (
          <div className={styles.stepContent}>
            <h2>ステップ2: 面談種別を選択してください</h2>
            <button onClick={goBack} className={styles.backButton}>← 戻る</button>
            <div className={styles.typeGrid}>
              {interviewTypesByClassification[selectedClassification as keyof typeof interviewTypesByClassification].map(type => (
                <button
                  key={type.id}
                  className={styles.typeCard}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <h3>{type.name}</h3>
                  <p className={styles.target}>対象: {type.target}</p>
                  {'frequency' in type && <p className={styles.frequency}>頻度: {type.frequency}</p>}
                  {'trigger' in type && <p className={styles.trigger}>実施時期: {type.trigger}</p>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: カテゴリ選択（必要な場合のみ） */}
        {currentStep === 3 && requiresCategory(selectedType as InterviewType) && (
          <div className={styles.stepContent}>
            <h2>ステップ3: 相談カテゴリを選択してください</h2>
            <button onClick={goBack} className={styles.backButton}>← 戻る</button>
            <div className={styles.categoryGrid}>
              {availableCategories[selectedType as keyof typeof availableCategories]?.map(category => (
                <button
                  key={category}
                  className={styles.categoryCard}
                  onClick={() => handleCategorySelect(category as InterviewCategory)}
                >
                  <h3>{category}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: 職員・日時選択 */}
        {currentStep === 4 && (
          <div className={styles.stepContent}>
            <h2>ステップ{requiresCategory(selectedType as InterviewType) ? '4' : '3'}: 職員と日時を選択してください</h2>
            <button onClick={goBack} className={styles.backButton}>← 戻る</button>
            
            <div className={styles.staffDateSelector}>
              <div className={styles.staffSection}>
                <h3>職員を選択</h3>
                <select 
                  className={styles.staffSelect}
                  onChange={(e) => {
                    const staff = Object.values(staffDatabase).find(s => s.id === e.target.value);
                    setSelectedStaff(staff);
                  }}
                  value={selectedStaff?.id || ''}
                >
                  <option value="">職員を選択してください</option>
                  {Object.values(staffDatabase).map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} - {staff.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.dateTimeSection}>
                <h3>日時を選択</h3>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <input
                  type="time"
                  className={styles.timeInput}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>

              {selectedStaff && selectedDate && selectedTime && (
                <button
                  className={styles.confirmButton}
                  onClick={() => handleStaffDateSelect(selectedStaff.id, selectedDate, selectedTime)}
                >
                  面談を予約する
                </button>
              )}
            </div>
          </div>
        )}

        {/* 選択内容のサマリー */}
        {currentStep > 1 && renderSummary()}
      </div>
    </div>
  );
}