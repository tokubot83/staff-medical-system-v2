'use client';

import React, { useState } from 'react';
import { staffDatabase } from '@/app/data/staffData';
import InterviewSheetSelector from '@/components/interview/InterviewSheetSelector';
import InterviewSheetWrapper from '@/components/interview/InterviewSheetWrapper';
import { getExperienceCategory } from '@/utils/experienceUtils';
import styles from './ImprovedInterviewFlow.module.css';

import { InterviewCategory, requiresCategory, availableCategories } from '@/types/interview';

// 面談の種類定義（10種類体系）
const interviewTypes = [
  {
    id: 'v5_motivational',
    name: 'V5動機タイプ面談',
    classification: 'v5',
    description: '動機タイプ判定機能付きの次世代面談システム',
    icon: '🎯',
    requiresCategory: false,
    subtypes: [
      { id: 'v5_new_nurse', name: '新人看護師（V5）', target: '1年目', frequency: '初回・定期' },
      { id: 'v5_general_nurse', name: '一般看護師（V5）', target: '2-3年目', frequency: '定期' },
      { id: 'v5_senior_nurse', name: '中堅看護師（V5）', target: '4-10年目', frequency: '定期' },
      { id: 'v5_veteran_nurse', name: 'ベテラン看護師（V5）', target: '11年以上', frequency: '定期' },
      { id: 'v5_management', name: '管理職（V5）', target: '主任・師長', frequency: '定期' }
    ]
  },
  {
    id: 'regular',
    name: '定期面談',
    classification: 'regular',
    description: '月次・年次・半期などの定期的な面談',
    icon: '📅',
    requiresCategory: false,
    subtypes: [
      { id: 'new_employee_monthly', name: '新入職員月次面談', target: '入職1年未満', frequency: '月1回' },
      { id: 'regular_annual', name: '一般職員年次面談', target: '全職員', frequency: '年1回' },
      { id: 'management_biannual', name: '管理職半年面談', target: '管理職', frequency: '半年1回' }
    ]
  },
  {
    id: 'special',
    name: '特別面談',
    classification: 'special',
    description: '特定の状況で実施する面談',
    icon: '⚠️',
    requiresCategory: false,
    subtypes: [
      { id: 'return_to_work', name: '復職面談', target: '休職からの復職者', trigger: '復職時' },
      { id: 'incident_followup', name: 'インシデント後面談', target: '当事者職員', trigger: 'インシデント発生後' },
      { id: 'exit_interview', name: '退職面談', target: '退職予定者', trigger: '退職前' }
    ]
  },
  {
    id: 'support',
    name: 'サポート面談',
    classification: 'support',
    description: '職員の希望に応じて実施する支援面談',
    icon: '💬',
    requiresCategory: true,
    subtypes: [
      { id: 'feedback', name: 'フィードバック面談', target: '評価開示後の希望者', requiresCategory: false },
      { id: 'career_support', name: 'キャリア系面談', target: '全職員', requiresCategory: true },
      { id: 'workplace_support', name: '職場環境系面談', target: '全職員', requiresCategory: true },
      { id: 'individual_consultation', name: '個別相談面談', target: '全職員', requiresCategory: true }
    ]
  }
];

// カテゴリの表示名マッピング
const categoryDisplayNames: Record<InterviewCategory, string> = {
  career_path: 'キャリアパス（将来の目標）',
  skill_development: 'スキル開発（研修・資格）',
  promotion: '昇進・昇格',
  transfer: '異動・転勤',
  work_environment: '職場環境（設備・制度）',
  interpersonal: '人間関係（チームワーク）',
  workload_balance: '業務負荷・ワークライフバランス',
  health_safety: '健康・安全',
  performance: 'パフォーマンス（業務改善）',
  compensation: '給与・待遇',
  training: '研修・教育',
  compliance: 'コンプライアンス',
  other: 'その他'
};

interface ImprovedInterviewFlowProps {
  onBack?: () => void;
}

export default function ImprovedInterviewFlow({ onBack }: ImprovedInterviewFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory | null>(null);
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
    // カテゴリ選択が必要な場合はカテゴリ選択へ、不要な場合は対象者選択へ
    if (subtype.requiresCategory) {
      setCurrentStep(2); // カテゴリ選択へ
    } else {
      setCurrentStep(3); // 対象者選択へ
    }
  };

  const handleCategorySelect = (category: InterviewCategory) => {
    setSelectedCategory(category);
    setCurrentStep(3); // 対象者選択へ
  };

  const handleStaffSelect = (staff: any) => {
    setSelectedStaff(staff);
    setCurrentStep(4); // シート選択へ
  };

  const handleSelectSheet = (sheetPath: string) => {
    const duration = parseInt(sheetPath.split('/').pop() || '30');
    setSelectedSheetDuration(duration);
    setShowSheet(true);
  };

  const handleBack = () => {
    if (showSheet) {
      setShowSheet(false);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (selectedSubtype?.requiresCategory) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
        setSelectedType(null);
        setSelectedSubtype(null);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setSelectedType(null);
      setSelectedSubtype(null);
      setSelectedCategory(null);
    } else if (onBack) {
      onBack();
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setSelectedType(null);
    setSelectedSubtype(null);
    setSelectedCategory(null);
    setSelectedStaff(null);
    setSearchTerm('');
    setSelectedSheetDuration(null);
    setShowSheet(false);
  };

  // 退職面談用の特別なシート選択
  const getExitInterviewSheets = () => {
    // 職員の経験年数や役職に基づいて適切なシートを提供
    if (!selectedStaff) return [];
    
    const yearsOfExperience = selectedStaff.経験年数;
    const position = selectedStaff.役職;
    
    // 試用期間中（1年未満）
    if (yearsOfExperience < 1) {
      return [
        { path: '/exit-interview-sheets/probation-staff-15min', duration: '15分', label: '簡潔版' },
        { path: '/exit-interview-sheets/probation-staff-30min', duration: '30分', label: '詳細版' }
      ];
    }
    // 管理職・ベテラン職員
    else if (position?.includes('師長') || position?.includes('主任') || yearsOfExperience >= 10) {
      return [
        { path: '/exit-interview-sheets/manager-veteran-45min', duration: '45分', label: '詳細版' },
        { path: '/exit-interview-sheets/manager-veteran-60min', duration: '60分', label: '包括版' }
      ];
    }
    // 一般職員
    else {
      return [
        { path: '/exit-interview-sheets/general-staff-30min', duration: '30分', label: '標準版' },
        { path: '/exit-interview-sheets/general-staff-45min', duration: '45分', label: '詳細版' }
      ];
    }
  };

  if (showSheet) {
    if (selectedSubtype?.id === 'exit_interview') {
      // 退職面談シートへ直接遷移
      const sheets = getExitInterviewSheets();
      const selectedSheet = sheets.find(s => s.duration === `${selectedSheetDuration}分`);
      if (selectedSheet) {
        window.location.href = selectedSheet.path;
      }
      return null;
    }
    
    // V5動機タイプ面談への遷移
    if (selectedType?.id === 'v5_motivational') {
      let v5Path = '/interview-sheets/v5/';
      
      if (selectedSubtype?.id === 'v5_new_nurse') {
        v5Path += 'new-nurse-45min';
      } else if (selectedSubtype?.id === 'v5_general_nurse') {
        v5Path += `general-nurse-${selectedSheetDuration}min`;
      } else if (selectedSubtype?.id === 'v5_senior_nurse') {
        v5Path += 'senior-nurse-45min';
      } else if (selectedSubtype?.id === 'v5_management') {
        v5Path += 'chief-nurse-45min';
      }
      
      window.location.href = v5Path;
      return null;
    }
    
    return (
      <div className={styles.sheetViewerSection}>
        <button onClick={handleBack} className={styles.backButton}>
          ← 戻る
        </button>
        {selectedStaff && selectedSheetDuration && (
          <InterviewSheetWrapper
            experienceCategory={getExperienceCategory(
              selectedStaff.経験年数,
              selectedStaff.役職 && (selectedStaff.役職.includes('師長') || selectedStaff.役職.includes('主任'))
            )}
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
        {selectedSubtype?.requiresCategory && (
          <>
            <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''}`}>
              <span className={styles.stepNumber}>2</span>
              <span className={styles.stepLabel}>カテゴリ</span>
            </div>
            <div className={styles.progressLine} />
          </>
        )}
        <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>{selectedSubtype?.requiresCategory ? '3' : '2'}</span>
          <span className={styles.stepLabel}>対象者選択</span>
        </div>
        <div className={styles.progressLine} />
        <div className={`${styles.progressStep} ${currentStep >= 4 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>{selectedSubtype?.requiresCategory ? '4' : '3'}</span>
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
          {selectedCategory && (
            <>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span className={styles.breadcrumbItem}>
                {categoryDisplayNames[selectedCategory]}
              </span>
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

      {/* Step 2: カテゴリ選択（サポート面談のみ） */}
      {currentStep === 2 && selectedSubtype?.requiresCategory && (
        <div className={styles.stepContainer}>
          <button onClick={handleBack} className={styles.backButtonInline}>
            ← 戻る
          </button>
          <h2 className={styles.stepTitle}>
            <span className={styles.stepIcon}>📋</span>
            相談内容のカテゴリを選択してください
          </h2>
          <div className={styles.selectedTypeInfo}>
            <span className={styles.infoLabel}>選択中の面談：</span>
            <span className={styles.infoValue}>
              {selectedType?.name} - {selectedSubtype?.name}
            </span>
          </div>
          
          <div className={styles.categoryGrid}>
            {availableCategories[selectedSubtype.id]?.map((categoryId: InterviewCategory) => (
              <button
                key={categoryId}
                onClick={() => handleCategorySelect(categoryId)}
                className={styles.categoryCard}
              >
                <div className={styles.categoryIcon}>
                  {categoryId.includes('career') ? '🎯' :
                   categoryId.includes('work') || categoryId.includes('interpersonal') ? '🏭' :
                   categoryId.includes('health') ? '🏝️' :
                   categoryId.includes('performance') ? '📈' :
                   categoryId.includes('compensation') ? '💰' :
                   categoryId.includes('training') ? '📚' :
                   categoryId.includes('compliance') ? '⚖️' : '📦'}
                </div>
                <div className={styles.categoryName}>
                  {categoryDisplayNames[categoryId]}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 対象者選択 */}
      {currentStep === 3 && (
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

      {/* Step 4: 面談シート選択 */}
      {currentStep === 4 && (
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
          
          {selectedSubtype?.id === 'exit_interview' ? (
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