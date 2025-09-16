'use client'

import React, { useState } from 'react'
import styles from './StressCheckDistribution.module.css'
import TargetingModal from './TargetingModal'
import GroupAnalysis from './GroupAnalysis'
import { mockCampaignData, mockDepartmentStats } from '../mockData'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  variant: 'primary' | 'warning' | 'danger' | 'default'
  targetCount?: number
}

export default function StressCheckDistribution() {
  const [showTargetingModal, setShowTargetingModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState('distribution')
  const [campaigns] = useState(mockCampaignData)
  const [departmentStats] = useState(mockDepartmentStats)

  const quickActions: QuickAction[] = [
    {
      id: 'launch',
      title: '実施開始通知',
      description: '全職員に一斉配信',
      icon: '📢',
      variant: 'primary'
    },
    {
      id: 'reminder',
      title: 'リマインダー送信',
      description: '未実施者698名',
      icon: '🔔',
      variant: 'warning',
      targetCount: 698
    },
    {
      id: 'urgent',
      title: '締切直前通知',
      description: '3日前自動配信',
      icon: '⚠️',
      variant: 'danger'
    },
    {
      id: 'targeting',
      title: 'ターゲット配信',
      description: '条件指定して送信',
      icon: '🎯',
      variant: 'default'
    },
    {
      id: 'followup',
      title: '高ストレス者フォロー',
      description: '面談案内124名',
      icon: '💚',
      variant: 'default',
      targetCount: 124
    },
    {
      id: 'templates',
      title: 'テンプレート管理',
      description: '定型文の編集',
      icon: '📝',
      variant: 'default'
    }
  ]

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'targeting':
      case 'followup':
        setShowTargetingModal(true)
        break
      case 'launch':
        if (confirm('2025年度ストレスチェックの実施開始通知を全職員1,250名に送信します。\nよろしいですか？')) {
          console.log('実施開始通知を配信しました')
        }
        break
      case 'reminder':
        if (confirm('未実施者698名にリマインダーを送信します。\nよろしいですか？')) {
          console.log('リマインダーを配信しました')
        }
        break
      default:
        console.log(`Action: ${actionId}`)
    }
  }

  const tabs = [
    { id: 'distribution', label: '配信管理', icon: '📤' },
    { id: 'status', label: '実施状況', icon: '📊' },
    { id: 'group-analysis', label: '集団分析', icon: '🗺️' },
    { id: 'analysis', label: '個別分析', icon: '📈' },
    { id: 'followup', label: 'フォローアップ', icon: '🤝' },
    { id: 'settings', label: '設定', icon: '⚙️' }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.statusBar}>
        <div className={styles.statusBadges}>
          <span className={`${styles.badge} ${styles.badgeActive}`}>
            📊 2025年度実施中
          </span>
          <span className={`${styles.badge} ${styles.badgeWarning}`}>
            ⏰ 残り14日
          </span>
        </div>
      </div>

      <div className={styles.subTabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.subTab} ${selectedTab === tab.id ? styles.active : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {selectedTab === 'distribution' && (
        <div className={styles.mainGrid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span>⚡</span>
                <span>クイックアクション</span>
              </div>
            </div>

            <div className={styles.quickActions}>
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className={`${styles.actionBtn} ${styles[`actionBtn${action.variant.charAt(0).toUpperCase() + action.variant.slice(1)}`]}`}
                  onClick={() => handleQuickAction(action.id)}
                >
                  <div className={styles.actionIcon}>{action.icon}</div>
                  <div className={styles.actionTitle}>{action.title}</div>
                  <div className={styles.actionDesc}>{action.description}</div>
                </button>
              ))}
            </div>

            <div className={styles.aiSuggestion}>
              <div className={styles.suggestionHeader}>
                <span className={styles.aiIcon}>💡</span>
                <strong>AIからの提案</strong>
              </div>
              <div className={styles.suggestionText}>
                営業部の実施率が38%と他部署より20%以上低い状況です。
                営業部長経由でのフォローアップを推奨します。
              </div>
              <div className={styles.suggestionActions}>
                <button className={styles.suggestionBtn}>部長にメール作成</button>
                <button className={styles.suggestionBtn}>営業部のみリマインド</button>
                <button className={styles.suggestionBtn}>詳細分析</button>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span>📊</span>
                <span>リアルタイム実施状況</span>
              </div>
              <button className={styles.refreshBtn}>更新 ↻</button>
            </div>

            <div className={styles.progressGrid}>
              <div className={styles.progressItem}>
                <div className={styles.progressCircle}>
                  <svg className={styles.progressRing} width="80" height="80">
                    <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="6" fill="none"/>
                    <circle
                      cx="40" cy="40" r="35"
                      stroke="#10b981" strokeWidth="6" fill="none"
                      strokeDasharray="220"
                      strokeDashoffset="127"
                    />
                  </svg>
                  <div className={styles.progressValue} style={{ color: '#10b981' }}>42%</div>
                </div>
                <div className={styles.progressLabel}>全体実施率</div>
              </div>

              <div className={styles.progressItem}>
                <div className={styles.progressNumber}>
                  <span style={{ color: '#7c3aed' }}>552</span>
                </div>
                <div className={styles.progressLabel}>実施済み</div>
              </div>

              <div className={styles.progressItem}>
                <div className={styles.progressNumber}>
                  <span style={{ color: '#f59e0b' }}>698</span>
                </div>
                <div className={styles.progressLabel}>未実施</div>
              </div>

              <div className={styles.progressItem}>
                <div className={styles.progressNumber}>
                  <span style={{ color: '#ef4444' }}>124</span>
                </div>
                <div className={styles.progressLabel}>要フォロー</div>
              </div>
            </div>

            <div className={styles.departmentSection}>
              <div className={styles.sectionTitle}>部署別実施状況</div>
              <div className={styles.departmentList}>
                {departmentStats.map(dept => (
                  <div key={dept.id} className={styles.departmentItem}>
                    <div className={styles.departmentInfo}>
                      <div className={styles.departmentName}>{dept.name}</div>
                      <div className={styles.departmentStats}>
                        <span>対象: {dept.total}名</span>
                        <span>実施: {dept.completed}名</span>
                      </div>
                    </div>
                    <div className={styles.departmentProgress}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${dept.rate}%`,
                            backgroundColor: dept.rate > 60 ? '#10b981' : dept.rate > 40 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                      <div className={styles.progressText}>{dept.rate}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>📅</span>
            <span>自動配信スケジュール</span>
          </div>
          <button className={styles.addBtn}>スケジュール追加 +</button>
        </div>

        <div className={styles.scheduleGrid}>
          {campaigns.map(campaign => (
            <div
              key={campaign.id}
              className={styles.scheduleItem}
              style={{ borderLeftColor: campaign.color }}
            >
              <div className={styles.scheduleHeader}>
                <span className={styles.scheduleTitle}>{campaign.title}</span>
                <span className={`${styles.scheduleStatus} ${styles[`status${campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}`]}`}>
                  {campaign.status === 'completed' ? '配信済み' :
                   campaign.status === 'scheduled' ? '予定' : '下書き'}
                </span>
              </div>
              <div className={styles.scheduleDate}>{campaign.scheduledDate}</div>
              <div className={styles.scheduleTarget}>対象: {campaign.targetDescription}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedTab === 'group-analysis' && <GroupAnalysis />}

      {showTargetingModal && (
        <TargetingModal onClose={() => setShowTargetingModal(false)} />
      )}
    </div>
  )
}