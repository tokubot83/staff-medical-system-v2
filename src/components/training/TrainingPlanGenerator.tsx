'use client';

import React, { useState } from 'react';
import styles from '@/app/training/Training.module.css';
import {
  generateTrainingPlan,
  generateAnnualCalendar,
  generateDepartmentCurriculum,
  departments,
  curriculumTemplates,
  exportToExcel,
  type TrainingPlan,
  type AnnualTrainingCalendar,
  type DepartmentCurriculum,
  type TrainingSession
} from '@/data/trainingPlanGenerator';
import {
  facilityTypes,
  roles,
  experienceLevels
} from '@/data/evaluationItemBank';

export default function TrainingPlanGenerator() {
  const [viewMode, setViewMode] = useState<'generator' | 'calendar' | 'department'>('generator');
  const [selectedFacility, setSelectedFacility] = useState('acute');
  const [selectedRole, setSelectedRole] = useState('nurse');
  const [selectedLevel, setSelectedLevel] = useState('midlevel');
  const [selectedDepartment, setSelectedDepartment] = useState('D001');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [generatedPlan, setGeneratedPlan] = useState<TrainingPlan | null>(null);
  const [annualCalendar, setAnnualCalendar] = useState<AnnualTrainingCalendar | null>(null);
  const [departmentCurriculum, setDepartmentCurriculum] = useState<DepartmentCurriculum | null>(null);

  // 研修計画の生成
  const handleGeneratePlan = () => {
    const department = departments.find(d => d.id === selectedDepartment);
    const plan = generateTrainingPlan(
      selectedFacility,
      selectedRole,
      selectedLevel,
      selectedYear,
      department?.name
    );
    setGeneratedPlan(plan);
    
    // 年間カレンダーも同時に生成
    const calendar = generateAnnualCalendar(plan);
    setAnnualCalendar(calendar);
  };

  // 部署別カリキュラムの生成
  const handleGenerateDepartmentCurriculum = () => {
    const curriculum = generateDepartmentCurriculum(selectedDepartment, selectedYear);
    setDepartmentCurriculum(curriculum);
  };

  // Excel出力
  const handleExportToExcel = () => {
    if (generatedPlan) {
      const excelData = exportToExcel(generatedPlan);
      console.log('Excel出力データ:', excelData);
      alert('Excel形式でのエクスポート機能は開発中です。コンソールに出力しました。');
    }
  };

  return (
    <div className={styles.trainingPlanContainer}>
      {/* 開発メモ */}
      <div style={{
        backgroundColor: '#f0f8ff',
        border: '2px dashed #4169e1',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{ color: '#4169e1', marginBottom: '12px' }}>
          🎯 開発メモ：研修計画自動生成システム
        </h3>
        <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#333' }}>
          <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>【システム機能】</h4>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>評価項目連動</strong>：選択された評価項目から必要な研修を自動抽出</li>
            <li><strong>年間計画生成</strong>：研修頻度と優先度に基づく自動スケジューリング</li>
            <li><strong>部署別カリキュラム</strong>：職種・レベル構成に応じた最適化</li>
            <li><strong>カレンダー表示</strong>：月別の研修スケジュールを可視化</li>
          </ul>

          <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>【自動配分ロジック】</h4>
          <ol style={{ marginLeft: '20px' }}>
            <li>法定研修（年2回）→ 4月・10月に配置</li>
            <li>専門研修 → 祝日・繁忙期を避けて配置</li>
            <li>管理研修 → 月末に集約</li>
            <li>新人研修 → 4月集中配置</li>
          </ol>

          <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>【効果】</h4>
          <ul style={{ marginLeft: '20px' }}>
            <li>教育師長の計画作成工数を大幅削減</li>
            <li>研修の重複・漏れを防止</li>
            <li>評価制度との整合性を自動担保</li>
            <li>部署特性に応じた最適化</li>
          </ul>
        </div>
      </div>

      {/* ヘッダー */}
      <div className={styles.planHeader}>
        <h2>📅 研修計画自動生成</h2>
        <p className={styles.headerDescription}>
          評価項目から必要研修を抽出し、年間計画を自動生成
        </p>
      </div>

      {/* モード切替 */}
      <div className={styles.viewModeSelector}>
        <button
          className={viewMode === 'generator' ? styles.active : ''}
          onClick={() => setViewMode('generator')}
        >
          📋 計画生成
        </button>
        <button
          className={viewMode === 'calendar' ? styles.active : ''}
          onClick={() => setViewMode('calendar')}
        >
          📅 年間カレンダー
        </button>
        <button
          className={viewMode === 'department' ? styles.active : ''}
          onClick={() => setViewMode('department')}
        >
          🏢 部署別カリキュラム
        </button>
      </div>

      {/* 計画生成モード */}
      {viewMode === 'generator' && (
        <div className={styles.generatorSection}>
          <div className={styles.inputSection}>
            <h3>🎯 生成条件設定</h3>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>対象年度</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className={styles.formSelect}
                >
                  <option value={2025}>2025年度</option>
                  <option value={2026}>2026年度</option>
                  <option value={2027}>2027年度</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>施設種別</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className={styles.formSelect}
                >
                  {Object.entries(facilityTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>職種</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className={styles.formSelect}
                >
                  {Object.entries(roles).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>経験レベル</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className={styles.formSelect}
                >
                  {Object.entries(experienceLevels).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>部署（オプション）</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className={styles.formSelect}
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button 
                onClick={handleGeneratePlan}
                className={styles.generateButton}
              >
                📋 研修計画を生成
              </button>
              {generatedPlan && (
                <button 
                  onClick={handleExportToExcel}
                  className={styles.exportButton}
                >
                  📊 Excel出力
                </button>
              )}
            </div>
          </div>

          {/* 生成結果 */}
          {generatedPlan && (
            <GeneratedPlanView plan={generatedPlan} />
          )}
        </div>
      )}

      {/* 年間カレンダーモード */}
      {viewMode === 'calendar' && annualCalendar && (
        <AnnualCalendarView calendar={annualCalendar} />
      )}

      {/* 部署別カリキュラムモード */}
      {viewMode === 'department' && (
        <DepartmentCurriculumView
          selectedDepartment={selectedDepartment}
          selectedYear={selectedYear}
          curriculum={departmentCurriculum}
          onGenerate={handleGenerateDepartmentCurriculum}
        />
      )}
    </div>
  );
}

// 生成された計画表示コンポーネント
function GeneratedPlanView({ plan }: { plan: TrainingPlan }) {
  const mandatoryCount = plan.trainingSessions.filter(s => s.type === 'mandatory').length;
  const optionalCount = plan.trainingSessions.filter(s => s.type === 'optional').length;

  return (
    <div className={styles.planResultSection}>
      <h3>✅ 生成結果</h3>
      
      {/* 概要カード */}
      <div className={styles.planOverview}>
        <div className={styles.overviewCard}>
          <h4>📊 計画概要</h4>
          <div className={styles.planStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>研修セッション数</span>
              <span className={styles.statValue}>{plan.trainingSessions.length}回</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>必須研修</span>
              <span className={styles.statValue}>{mandatoryCount}回</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>選択研修</span>
              <span className={styles.statValue}>{optionalCount}回</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>合計時間</span>
              <span className={styles.statValue}>{plan.totalHours}時間</span>
            </div>
          </div>
        </div>
      </div>

      {/* 月別スケジュール */}
      <div className={styles.monthlySchedule}>
        <h4>📅 月別スケジュール</h4>
        <div className={styles.monthGrid}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
            const monthSessions = plan.trainingSessions.filter(s => s.month === month);
            return (
              <div key={month} className={styles.monthCard}>
                <div className={styles.monthHeader}>
                  <span className={styles.monthNumber}>{month}月</span>
                  <span className={styles.sessionCount}>
                    {monthSessions.length}件
                  </span>
                </div>
                <div className={styles.monthSessions}>
                  {monthSessions.map(session => (
                    <div key={session.id} className={styles.sessionItem}>
                      <span className={`${styles.sessionType} ${
                        session.type === 'mandatory' ? styles.mandatory : styles.optional
                      }`}>
                        {session.type === 'mandatory' ? '必須' : '選択'}
                      </span>
                      <span className={styles.sessionName}>{session.trainingName}</span>
                      <span className={styles.sessionDuration}>{session.duration}h</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 詳細リスト */}
      <div className={styles.sessionList}>
        <h4>📝 研修セッション詳細</h4>
        <div className={styles.sessionTable}>
          <table>
            <thead>
              <tr>
                <th>実施月</th>
                <th>研修名</th>
                <th>種別</th>
                <th>カテゴリ</th>
                <th>時間</th>
                <th>対象者数</th>
              </tr>
            </thead>
            <tbody>
              {plan.trainingSessions.map(session => (
                <tr key={session.id}>
                  <td>{session.month}月</td>
                  <td>{session.trainingName}</td>
                  <td>
                    <span className={`${styles.typeBadge} ${
                      session.type === 'mandatory' ? styles.mandatory : styles.optional
                    }`}>
                      {session.type === 'mandatory' ? '必須' : '選択'}
                    </span>
                  </td>
                  <td>{session.category}</td>
                  <td>{session.duration}時間</td>
                  <td>{session.targetParticipants}名</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 年間カレンダー表示コンポーネント
function AnnualCalendarView({ calendar }: { calendar: AnnualTrainingCalendar }) {
  return (
    <div className={styles.calendarView}>
      <h3>📅 {calendar.year}年 年間研修カレンダー</h3>
      
      <div className={styles.calendarGrid}>
        {calendar.months.map(month => (
          <div key={month.month} className={styles.calendarMonth}>
            <div className={styles.calendarMonthHeader}>
              <h4>{month.month}月</h4>
              <span className={styles.monthlyHours}>{month.totalHours}時間</span>
            </div>
            
            <div className={styles.calendarSessions}>
              {month.sessions.length > 0 ? (
                month.sessions.map(session => (
                  <div key={session.id} className={styles.calendarSession}>
                    <div className={styles.sessionWeek}>第{session.week}週</div>
                    <div className={styles.sessionTitle}>{session.trainingName}</div>
                    <div className={styles.sessionMeta}>
                      <span>{session.duration}h</span>
                      <span>{session.type === 'mandatory' ? '必須' : '選択'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noSessions}>研修なし</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 部署別カリキュラム表示コンポーネント
function DepartmentCurriculumView({
  selectedDepartment,
  selectedYear,
  curriculum,
  onGenerate
}: {
  selectedDepartment: string;
  selectedYear: number;
  curriculum: DepartmentCurriculum | null;
  onGenerate: () => void;
}) {
  return (
    <div className={styles.departmentView}>
      <div className={styles.departmentHeader}>
        <h3>🏢 部署別カリキュラム生成</h3>
        <button onClick={onGenerate} className={styles.generateButton}>
          📊 カリキュラムを生成
        </button>
      </div>

      {curriculum && (
        <div className={styles.curriculumResult}>
          <div className={styles.departmentInfo}>
            <h4>{curriculum.departmentName}</h4>
            <div className={styles.departmentStats}>
              <span>職員数: {curriculum.staffCount}名</span>
              <span>施設種別: {facilityTypes[curriculum.facilityType as keyof typeof facilityTypes]}</span>
            </div>
          </div>

          {/* 職種別構成 */}
          <div className={styles.roleBreakdown}>
            <h5>👥 職種別構成</h5>
            <div className={styles.roleGrid}>
              {curriculum.roleBreakdown.map((role, index) => (
                <div key={index} className={styles.roleCard}>
                  <div className={styles.roleName}>
                    {roles[role.role as keyof typeof roles] || role.role}
                  </div>
                  <div className={styles.roleCount}>{role.count}名</div>
                  <div className={styles.levelBreakdown}>
                    {role.levels.map((level, levelIndex) => (
                      <div key={levelIndex} className={styles.levelItem}>
                        <span>{experienceLevels[level.level as keyof typeof experienceLevels] || level.level}</span>
                        <span>{level.count}名</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 必要研修一覧 */}
          <div className={styles.requiredTrainings}>
            <h5>📋 必要研修一覧</h5>
            <div className={styles.trainingTable}>
              <table>
                <thead>
                  <tr>
                    <th>研修名</th>
                    <th>対象者数</th>
                    <th>頻度</th>
                    <th>優先度</th>
                  </tr>
                </thead>
                <tbody>
                  {curriculum.requiredTrainings.map((training, index) => (
                    <tr key={index}>
                      <td>{training.trainingName}</td>
                      <td>{training.totalParticipants}名</td>
                      <td>{training.frequency}</td>
                      <td>
                        <span className={`${styles.priorityBadge} ${styles[training.priority]}`}>
                          {training.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}