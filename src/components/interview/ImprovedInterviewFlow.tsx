'use client';

import React, { useState } from 'react';
import { staffDatabase } from '@/app/data/staffData';
import InterviewSheetSelector from '@/components/interview/InterviewSheetSelector';
import InterviewSheetWrapper from '@/components/interview/InterviewSheetWrapper';
import { getExperienceCategory } from '@/utils/experienceUtils';
import styles from './ImprovedInterviewFlow.module.css';

// 面談の種類定義
const interviewTypes = [
  {
    id: 'regular',
    name: '定期面談',
    description: '月次・年次・半期などの定期的な面談',
    icon: '📅',
    subtypes: [
      { id: 'monthly', name: '月次面談', target: '新入職員（1年未満）' },
      { id: 'annual', name: '年次面談', target: '全職員' },
      { id: 'biannual', name: '半期面談', target: '管理職' }
    ]
  },
  {
    id: 'exit',
    name: '退職面談',
    description: '退職予定者との面談',
    icon: '🚪',
    subtypes: [
      { id: 'probation', name: '試用期間退職', target: '試用期間中の職員' },
      { id: 'general', name: '一般退職', target: '正職員・契約職員' },
      { id: 'management', name: '管理職退職', target: '管理職・ベテラン職員' }
    ]
  },
  {
    id: 'incident',
    name: 'インシデント後面談',
    description: 'インシデント発生後のフォロー面談',
    icon: '⚠️',
    subtypes: [
      { id: 'medical', name: '医療事故後', target: '当事者職員' },
      { id: 'complaint', name: 'クレーム対応後', target: '対応職員' }
    ]
  },
  {
    id: 'consultation',
    name: '苦情・相談面談',
    description: '職員からの相談や苦情対応',
    icon: '💬',
    subtypes: [
      { id: 'harassment', name: 'ハラスメント相談', target: '相談希望者' },
      { id: 'workplace', name: '職場環境相談', target: '全職員' },
      { id: 'career', name: 'キャリア相談', target: '全職員' }
    ]
  },
  {
    id: 'adhoc',
    name: '随時面談',
    description: 'その他の臨時面談',
    icon: '📝',
    subtypes: [
      { id: 'return', name: '復職面談', target: '休職からの復職者' },
      { id: 'transfer', name: '異動面談', target: '異動対象者' },
      { id: 'other', name: 'その他', target: '必要に応じて' }
    ]
  }
];

interface ImprovedInterviewFlowProps {
  onBack?: () => void;
}

export default function ImprovedInterviewFlow({ onBack }: ImprovedInterviewFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSheetDuration, setSelectedSheetDuration] = useState<number | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  // 職員のフィルタリング
  const getFilteredStaff = () => {
    let staff = Object.values(staffDatabase);
    
    // 面談種類によるフィルタリング
    if (selectedType?.id === 'regular' && selectedSubtype?.id === 'monthly') {
      // 新入職員のみ（経験年数1年未満）
      staff = staff.filter(s => s.経験年数 < 1);
    } else if (selectedType?.id === 'regular' && selectedSubtype?.id === 'biannual') {
      // 管理職のみ
      staff = staff.filter(s => s.役職 && (s.役職.includes('師長') || s.役職.includes('主任')));
    } else if (selectedType?.id === 'exit') {
      // 退職予定者のフラグがある職員（デモのため全員表示）
      // 実際の実装では退職予定フラグでフィルタ
    }
    
    // 検索フィルタ
    if (searchTerm) {
      staff = staff.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return staff.slice(0, 10);
  };

  const handleTypeSelect = (type: any, subtype: any) => {
    setSelectedType(type);
    setSelectedSubtype(subtype);
    setCurrentStep(2);
  };

  const handleStaffSelect = (staff: any) => {
    setSelectedStaff(staff);
    setCurrentStep(3);
  };

  const handleSelectSheet = (sheetPath: string) => {
    const duration = parseInt(sheetPath.split('/').pop() || '30');
    setSelectedSheetDuration(duration);
    setShowSheet(true);
  };

  const handleBack = () => {
    if (showSheet) {
      setShowSheet(false);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setSelectedType(null);
      setSelectedSubtype(null);
    } else if (onBack) {
      onBack();
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setSelectedType(null);
    setSelectedSubtype(null);
    setSelectedStaff(null);
    setSearchTerm('');
    setSelectedSheetDuration(null);
    setShowSheet(false);
  };

  // 退職面談用の特別なシート選択
  const getExitInterviewSheets = () => {
    if (selectedSubtype?.id === 'probation') {
      return [
        { path: '/exit-interview-sheets/probation-staff-15min', duration: '15分', label: '簡潔版' },
        { path: '/exit-interview-sheets/probation-staff-30min', duration: '30分', label: '詳細版' }
      ];
    } else if (selectedSubtype?.id === 'general') {
      return [
        { path: '/exit-interview-sheets/general-staff-30min', duration: '30分', label: '標準版' },
        { path: '/exit-interview-sheets/general-staff-45min', duration: '45分', label: '詳細版' }
      ];
    } else if (selectedSubtype?.id === 'management') {
      return [
        { path: '/exit-interview-sheets/manager-veteran-45min', duration: '45分', label: '詳細版' },
        { path: '/exit-interview-sheets/manager-veteran-60min', duration: '60分', label: '包括版' }
      ];
    }
    return [];
  };

  if (showSheet) {
    if (selectedType?.id === 'exit') {
      // 退職面談シートへ直接遷移
      const sheets = getExitInterviewSheets();
      const selectedSheet = sheets.find(s => s.duration === `${selectedSheetDuration}分`);
      if (selectedSheet) {
        window.location.href = selectedSheet.path;
      }
      return null;
    }
    
    return (
      <div className={styles.sheetViewerSection}>
        <button onClick={handleBack} className={styles.backButton}>
          ← 戻る
        </button>
        {selectedStaff && selectedSheetDuration && (
          <InterviewSheetWrapper
            experienceCategory={getExperienceCategory(selectedStaff.経験年数)}
            duration={selectedSheetDuration}
            staffName={selectedStaff.name}
            yearsOfExperience={selectedStaff.経験年数}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.improvedFlowContainer}>
      {/* プログレスバー */}
      <div className={styles.progressBar}>
        <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>1</span>
          <span className={styles.stepLabel}>面談種類</span>
        </div>
        <div className={styles.progressLine} />
        <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>2</span>
          <span className={styles.stepLabel}>対象者選択</span>
        </div>
        <div className={styles.progressLine} />
        <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>3</span>
          <span className={styles.stepLabel}>シート選択</span>
        </div>
      </div>

      {/* ブレッドクラム */}
      {(selectedType || selectedStaff) && (
        <div className={styles.breadcrumb}>
          <button onClick={resetFlow} className={styles.breadcrumbItem}>
            面談実施
          </button>
          {selectedType && (
            <>
              <span className={styles.breadcrumbSeparator}>›</span>
              <button 
                onClick={() => setCurrentStep(1)} 
                className={styles.breadcrumbItem}
              >
                {selectedType.name} {selectedSubtype && `- ${selectedSubtype.name}`}
              </button>
            </>
          )}
          {selectedStaff && (
            <>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span className={styles.breadcrumbItem}>
                {selectedStaff.name}
              </span>
            </>
          )}
        </div>
      )}

      {/* Step 1: 面談種類選択 */}
      {currentStep === 1 && (
        <div className={styles.stepContainer}>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepIcon}>📋</span>
            面談の種類を選択してください
          </h2>
          <div className={styles.typeGrid}>
            {interviewTypes.map((type) => (
              <div key={type.id} className={styles.typeCard}>
                <div className={styles.typeHeader}>
                  <span className={styles.typeIcon}>{type.icon}</span>
                  <h3>{type.name}</h3>
                </div>
                <p className={styles.typeDescription}>{type.description}</p>
                <div className={styles.subtypeList}>
                  {type.subtypes.map((subtype) => (
                    <button
                      key={subtype.id}
                      onClick={() => handleTypeSelect(type, subtype)}
                      className={styles.subtypeButton}
                    >
                      <span className={styles.subtypeName}>{subtype.name}</span>
                      <span className={styles.subtypeTarget}>{subtype.target}</span>
                      <span className={styles.subtypeArrow}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: 対象者選択 */}
      {currentStep === 2 && (
        <div className={styles.stepContainer}>
          <button onClick={handleBack} className={styles.backButtonInline}>
            ← 戻る
          </button>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepIcon}>👤</span>
            面談対象者を選択してください
          </h2>
          <div className={styles.selectedTypeInfo}>
            <span className={styles.infoLabel}>選択中の面談：</span>
            <span className={styles.infoValue}>
              {selectedType?.name} - {selectedSubtype?.name}
            </span>
          </div>
          
          <div className={styles.staffSearchSection}>
            <input
              type="text"
              placeholder="職員名または職員IDで検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            
            <div className={styles.staffGrid}>
              {getFilteredStaff().map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => handleStaffSelect(staff)}
                  className={styles.staffCard}
                >
                  <div className={styles.staffAvatar}>
                    {staff.name.charAt(0)}
                  </div>
                  <div className={styles.staffInfo}>
                    <div className={styles.staffName}>{staff.name}</div>
                    <div className={styles.staffDetails}>
                      <span>ID: {staff.id}</span>
                      <span>経験: {staff.経験年数}年</span>
                    </div>
                    {staff.役職 && (
                      <div className={styles.staffPosition}>{staff.役職}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 面談シート選択 */}
      {currentStep === 3 && (
        <div className={styles.stepContainer}>
          <button onClick={handleBack} className={styles.backButtonInline}>
            ← 戻る
          </button>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepIcon}>📄</span>
            面談シートを選択してください
          </h2>
          <div className={styles.selectedInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>面談種類：</span>
              <span className={styles.infoValue}>
                {selectedType?.name} - {selectedSubtype?.name}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>対象者：</span>
              <span className={styles.infoValue}>
                {selectedStaff?.name} （{selectedStaff?.id}）
              </span>
            </div>
          </div>
          
          {selectedType?.id === 'exit' ? (
            // 退職面談用の特別なシート選択
            <div className={styles.sheetOptions}>
              <h3>利用可能な面談シート</h3>
              <div className={styles.sheetGrid}>
                {getExitInterviewSheets().map((sheet) => (
                  <button
                    key={sheet.path}
                    onClick={() => window.location.href = sheet.path}
                    className={styles.sheetOption}
                  >
                    <span className={styles.sheetDuration}>{sheet.duration}</span>
                    <span className={styles.sheetLabel}>{sheet.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // 通常の面談シート選択
            <InterviewSheetSelector
              staffId={selectedStaff?.id}
              staffName={selectedStaff?.name}
              yearsOfExperience={selectedStaff?.経験年数}
              onSelectSheet={handleSelectSheet}
            />
          )}
        </div>
      )}
    </div>
  );
}