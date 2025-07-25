'use client'

import React, { useState } from 'react'
import CommonHeader from '@/components/CommonHeader'
import DashboardButton from '@/components/DashboardButton'
import Link from 'next/link'
import { staffDatabase } from '../data/staffData.js'
import styles from './Goals.module.css'

const tabs = [
  { id: 'setting', label: '目標設定', icon: '🎯' },
  { id: 'progress', label: '進捗管理', icon: '📈' },
  { id: 'review', label: '評価・レビュー', icon: '⭐' },
  { id: 'history', label: '履歴', icon: '📚' },
  { id: 'settings', label: '設定', icon: '⚙️' },
]

interface Goal {
  id: string
  staffId: string
  staffName: string
  title: string
  description: string
  category: string
  startDate: string
  targetDate: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  progress: number
  keyResults: KeyResult[]
  reviewer?: string
  reviewDate?: string
  reviewComment?: string
}

interface KeyResult {
  id: string
  title: string
  targetValue: number
  currentValue: number
  unit: string
}

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState('setting')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFacility, setSelectedFacility] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const mockGoals: Goal[] = [
    {
      id: '1',
      staffId: 'S001',
      staffName: '山田太郎',
      title: '看護技術向上計画',
      description: '高度な看護技術の習得と実践能力の向上',
      category: 'スキル開発',
      startDate: '2024-04-01',
      targetDate: '2024-09-30',
      status: 'active',
      progress: 65,
      keyResults: [
        { id: 'kr1', title: '静脈注射成功率', targetValue: 95, currentValue: 88, unit: '%' },
        { id: 'kr2', title: '研修時間', targetValue: 40, currentValue: 26, unit: '時間' },
      ],
    },
    {
      id: '2',
      staffId: 'S002',
      staffName: '佐藤花子',
      title: 'リーダーシップ育成',
      description: 'チームリーダーとしての管理能力向上',
      category: 'キャリア開発',
      startDate: '2024-01-01',
      targetDate: '2024-12-31',
      status: 'active',
      progress: 45,
      keyResults: [
        { id: 'kr3', title: 'チーム満足度', targetValue: 4.5, currentValue: 3.8, unit: '点' },
        { id: 'kr4', title: 'プロジェクト完了数', targetValue: 5, currentValue: 2, unit: '件' },
      ],
    },
    {
      id: '3',
      staffId: 'S003',
      staffName: '鈴木一郎',
      title: '患者満足度向上',
      description: '患者対応スキルの改善と満足度向上',
      category: '業務改善',
      startDate: '2024-03-01',
      targetDate: '2024-08-31',
      status: 'completed',
      progress: 100,
      keyResults: [
        { id: 'kr5', title: '患者満足度スコア', targetValue: 4.8, currentValue: 4.9, unit: '点' },
        { id: 'kr6', title: 'クレーム件数', targetValue: 0, currentValue: 0, unit: '件' },
      ],
      reviewer: '管理者A',
      reviewDate: '2024-07-15',
      reviewComment: '目標を達成し、患者満足度が大幅に向上しました。',
    },
  ]

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal)
    setActiveTab('review')
  }

  const filteredGoals = mockGoals.filter((goal) => {
    const matchesSearch = goal.staffName.includes(searchTerm) || goal.staffId.includes(searchTerm) || goal.title.includes(searchTerm)
    return matchesSearch
  })

  return (
    <div>
      <CommonHeader title="目標管理" />
      
      <div className={styles.container}>
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'setting' && (
            <SettingTab 
              goals={filteredGoals.filter(g => g.status === 'active')}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFacility={selectedFacility}
              setSelectedFacility={setSelectedFacility}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              onGoalSelect={handleGoalSelect}
            />
          )}
          {activeTab === 'progress' && (
            <ProgressTab 
              goals={filteredGoals.filter(g => g.status === 'active')}
              onGoalSelect={handleGoalSelect}
            />
          )}
          {activeTab === 'review' && <ReviewTab selectedGoal={selectedGoal} />}
          {activeTab === 'history' && (
            <HistoryTab 
              goals={filteredGoals.filter(g => g.status === 'completed' || g.status === 'cancelled')}
              onGoalSelect={handleGoalSelect}
            />
          )}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
      <DashboardButton />
    </div>
  )
}

interface SettingTabProps {
  goals: Goal[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedFacility: string
  setSelectedFacility: (value: string) => void
  selectedDepartment: string
  setSelectedDepartment: (value: string) => void
  onGoalSelect: (goal: Goal) => void
}

function SettingTab({ goals, searchTerm, setSearchTerm, selectedFacility, setSelectedFacility, selectedDepartment, setSelectedDepartment, onGoalSelect }: SettingTabProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="職員名、職員ID、目標名で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filters}>
          <select 
            value={selectedFacility} 
            onChange={(e) => setSelectedFacility(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全施設</option>
            <option value="小原病院">小原病院</option>
            <option value="立神リハビリテーション温泉病院">立神リハビリテーション温泉病院</option>
          </select>
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全部署</option>
            <option value="外科病棟">外科病棟</option>
            <option value="内科病棟">内科病棟</option>
            <option value="救急科">救急科</option>
            <option value="地域包括ケア病棟">地域包括ケア病棟</option>
            <option value="外来">外来</option>
            <option value="緩和ケア病棟">緩和ケア病棟</option>
          </select>
        </div>
      </div>

      <div className={styles.listHeader}>
        <h2>目標一覧 ({goals.length}件)</h2>
        <button className={styles.addButton}>
          + 新規目標を追加
        </button>
      </div>

      <div className={styles.goalGrid}>
        {goals.map((goal) => (
          <div key={goal.id} className={styles.goalCard} onClick={() => onGoalSelect(goal)}>
            <div className={styles.cardHeader}>
              <div className={styles.cardCategory}>
                <span className={`${styles.categoryBadge} ${styles[goal.category.replace(/[・]/g, '')]}`}>
                  {goal.category}
                </span>
              </div>
              <div className={styles.cardInfo}>
                <h3>{goal.title}</h3>
                <p className={styles.staffName}>{goal.staffName} ({goal.staffId})</p>
                <p className={styles.goalDescription}>{goal.description}</p>
                <div className={styles.goalMeta}>
                  <span className={styles.targetDate}>目標期限: {new Date(goal.targetDate).toLocaleDateString('ja-JP')}</span>
                  <span className={styles.progressBadge}>{goal.progress}%</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.actionButton} onClick={(e) => { e.stopPropagation(); }}>
                  編集
                </button>
                <button className={styles.actionButton} onClick={(e) => { e.stopPropagation(); }}>
                  詳細
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ProgressTabProps {
  goals: Goal[]
  onGoalSelect: (goal: Goal) => void
}

function ProgressTab({ goals, onGoalSelect }: ProgressTabProps) {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.listHeader}>
        <h2>進捗管理</h2>
      </div>

      <div className={styles.progressList}>
        {goals.map((goal) => (
          <div key={goal.id} className={styles.progressItem} onClick={() => onGoalSelect(goal)}>
            <div className={styles.progressHeader}>
              <div>
                <h3>{goal.title}</h3>
                <p className={styles.progressStaff}>{goal.staffName} - {goal.category}</p>
              </div>
              <div className={styles.progressPercentage}>{goal.progress}%</div>
            </div>
            
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            <div className={styles.keyResults}>
              {goal.keyResults.map((kr) => (
                <div key={kr.id} className={styles.keyResult}>
                  <span className={styles.krTitle}>{kr.title}</span>
                  <span className={styles.krValue}>
                    {kr.currentValue}/{kr.targetValue} {kr.unit}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.progressFooter}>
              <span className={styles.dateRange}>
                {new Date(goal.startDate).toLocaleDateString('ja-JP')} - {new Date(goal.targetDate).toLocaleDateString('ja-JP')}
              </span>
              <button className={styles.updateButton} onClick={(e) => { e.stopPropagation(); }}>
                進捗更新
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ReviewTabProps {
  selectedGoal: Goal | null
}

function ReviewTab({ selectedGoal }: ReviewTabProps) {
  if (!selectedGoal) {
    return (
      <div className={styles.noSelection}>
        <p>評価する目標を選択してください</p>
      </div>
    )
  }

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewHeader}>
        <h2>目標評価・レビュー</h2>
        <div className={styles.goalMeta}>
          <span>{selectedGoal.staffName}</span>
          <span>{selectedGoal.title}</span>
          <span>{selectedGoal.category}</span>
        </div>
      </div>

      <div className={styles.reviewForm}>
        <div className={styles.formSection}>
          <h3>目標概要</h3>
          <p className={styles.goalOverview}>{selectedGoal.description}</p>
          <div className={styles.goalStats}>
            <div className={styles.statItem}>
              <span>達成率</span>
              <span className={styles.statValue}>{selectedGoal.progress}%</span>
            </div>
            <div className={styles.statItem}>
              <span>開始日</span>
              <span className={styles.statValue}>{new Date(selectedGoal.startDate).toLocaleDateString('ja-JP')}</span>
            </div>
            <div className={styles.statItem}>
              <span>目標期限</span>
              <span className={styles.statValue}>{new Date(selectedGoal.targetDate).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>主要成果指標（KR）</h3>
          <div className={styles.krList}>
            {selectedGoal.keyResults.map((kr) => (
              <div key={kr.id} className={styles.krItem}>
                <div className={styles.krInfo}>
                  <span className={styles.krTitle}>{kr.title}</span>
                  <span className={styles.krProgress}>
                    {kr.currentValue}/{kr.targetValue} {kr.unit}
                  </span>
                </div>
                <div className={styles.krBar}>
                  <div 
                    className={styles.krFill} 
                    style={{ width: `${(kr.currentValue / kr.targetValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>評価コメント</h3>
          <textarea 
            className={styles.textArea}
            placeholder="評価コメントを入力してください"
            rows={6}
            defaultValue={selectedGoal.reviewComment}
          />
        </div>

        <div className={styles.formSection}>
          <h3>次期目標への提言</h3>
          <textarea 
            className={styles.textArea}
            placeholder="次期目標への提言を入力してください"
            rows={4}
          />
        </div>

        <div className={styles.formActions}>
          <button className={styles.saveButton}>評価を保存</button>
          <button className={styles.cancelButton}>キャンセル</button>
        </div>
      </div>
    </div>
  )
}

interface HistoryTabProps {
  goals: Goal[]
  onGoalSelect: (goal: Goal) => void
}

function HistoryTab({ goals, onGoalSelect }: HistoryTabProps) {
  return (
    <div className={styles.historyContainer}>
      <div className={styles.listHeader}>
        <h2>目標履歴</h2>
      </div>

      <div className={styles.historyList}>
        {goals.map((goal) => (
          <div key={goal.id} className={styles.historyItem} onClick={() => onGoalSelect(goal)}>
            <div className={styles.historyDate}>
              <div className={styles.historyDateText}>{new Date(goal.targetDate).toLocaleDateString('ja-JP')}</div>
              <div className={styles.historyStatus}>
                <span className={`${styles.statusBadge} ${styles[goal.status]}`}>
                  {goal.status === 'completed' ? '達成' : 'キャンセル'}
                </span>
              </div>
            </div>
            <div className={styles.historyInfo}>
              <h4>{goal.title} - {goal.staffName}</h4>
              <p className={styles.historyCategory}>{goal.category}</p>
              <p className={styles.historyProgress}>最終達成率: {goal.progress}%</p>
              {goal.reviewComment && (
                <p className={styles.historyReview}>{goal.reviewComment}</p>
              )}
            </div>
            <div className={styles.historyActions}>
              <button className={styles.viewButton} onClick={(e) => { e.stopPropagation(); }}>
                詳細を見る
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab(): React.ReactElement {
  return (
    <div className={styles.settingsContainer}>
      <h2>目標管理設定</h2>
      <div className={styles.comingSoon}>
        <p>目標管理設定機能は現在開発中です</p>
      </div>
    </div>
  )
}