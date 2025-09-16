'use client'

import React, { useState, useMemo } from 'react'
import styles from './FollowUpManagement.module.css'

interface FollowUpStaff {
  id: string
  name: string
  department: string
  stressLevel: 'high' | 'moderate' | 'low'
  lastCheckDate: string
  followUpStatus: 'pending' | 'scheduled' | 'completed'
  interviewDate?: string
  priority: 'urgent' | 'normal' | 'low'
}

interface DistributionTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: 'interview' | 'reminder' | 'result' | 'support'
}

export default function FollowUpManagement() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgent' | 'pending'>('all')
  const [showDistributionModal, setShowDistributionModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<string[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')

  // 部署データ
  const departments = [
    { id: 'all', name: '全部署' },
    { id: 'sales', name: '営業部' },
    { id: 'internal', name: '内科' },
    { id: 'surgery', name: '外科' },
    { id: 'admin', name: '総務部' },
    { id: 'dev', name: '開発部' }
  ]

  // サンプルデータ
  const followUpStaff: FollowUpStaff[] = [
    {
      id: '1',
      name: '山田太郎',
      department: '営業部',
      stressLevel: 'high',
      lastCheckDate: '2025-01-05',
      followUpStatus: 'pending',
      priority: 'urgent'
    },
    {
      id: '2',
      name: '佐藤花子',
      department: '内科',
      stressLevel: 'high',
      lastCheckDate: '2025-01-06',
      followUpStatus: 'scheduled',
      interviewDate: '2025-01-20',
      priority: 'normal'
    },
    {
      id: '3',
      name: '鈴木一郎',
      department: '総務部',
      stressLevel: 'moderate',
      lastCheckDate: '2025-01-07',
      followUpStatus: 'pending',
      priority: 'normal'
    },
    {
      id: '4',
      name: '田中美咲',
      department: '営業部',
      stressLevel: 'high',
      lastCheckDate: '2025-01-08',
      followUpStatus: 'pending',
      priority: 'urgent'
    },
    {
      id: '5',
      name: '伊藤健太',
      department: '開発部',
      stressLevel: 'moderate',
      lastCheckDate: '2025-01-09',
      followUpStatus: 'scheduled',
      interviewDate: '2025-01-22',
      priority: 'normal'
    },
    {
      id: '6',
      name: '渡辺真理',
      department: '外科',
      stressLevel: 'high',
      lastCheckDate: '2025-01-10',
      followUpStatus: 'pending',
      priority: 'urgent'
    },
    {
      id: '7',
      name: '小林裕子',
      department: '内科',
      stressLevel: 'moderate',
      lastCheckDate: '2025-01-11',
      followUpStatus: 'completed',
      priority: 'low'
    },
    {
      id: '8',
      name: '加藤直樹',
      department: '営業部',
      stressLevel: 'high',
      lastCheckDate: '2025-01-12',
      followUpStatus: 'scheduled',
      interviewDate: '2025-01-25',
      priority: 'normal'
    }
  ]

  const templates: DistributionTemplate[] = [
    {
      id: '1',
      name: '産業医面談のご案内',
      subject: 'ストレスチェック結果に基づく面談のご案内',
      content: 'この度のストレスチェックの結果を踏まえ、産業医との面談をご案内いたします...',
      category: 'interview'
    },
    {
      id: '2',
      name: 'フォローアップリマインダー',
      subject: '面談日程確定のお知らせ',
      content: '先日ご案内しました産業医面談の日程が確定しましたのでお知らせします...',
      category: 'reminder'
    }
  ]

  const quickActions = [
    {
      id: 'interview',
      title: '面談案内送信',
      description: '高ストレス者124名',
      icon: '📨',
      variant: 'primary' as const,
      targetCount: 124
    },
    {
      id: 'reminder',
      title: '面談リマインダー',
      description: '面談予定者45名',
      icon: '🔔',
      variant: 'warning' as const,
      targetCount: 45
    },
    {
      id: 'urgent',
      title: '緊急フォロー',
      description: '要対応12名',
      icon: '🚨',
      variant: 'danger' as const,
      targetCount: 12
    },
    {
      id: 'support',
      title: 'サポート資料送付',
      description: 'セルフケア情報',
      icon: '💚',
      variant: 'default' as const
    },
    {
      id: 'report',
      title: 'レポート作成',
      description: 'フォロー状況報告',
      icon: '📊',
      variant: 'default' as const
    },
    {
      id: 'voicedrive',
      title: 'VoiceDrive連携',
      description: 'SNS経由で配信',
      icon: '🔗',
      variant: 'default' as const
    }
  ]

  const handleQuickAction = (actionId: string) => {
    switch(actionId) {
      case 'interview':
        setShowDistributionModal(true)
        break
      case 'voicedrive':
        alert('VoiceDrive連携機能は準備中です')
        break
      default:
        console.log(`Action: ${actionId}`)
    }
  }

  const getStressLevelColor = (level: string) => {
    switch(level) {
      case 'high': return '#ef4444'
      case 'moderate': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'pending': return styles.statusPending
      case 'scheduled': return styles.statusScheduled
      case 'completed': return styles.statusCompleted
      default: return ''
    }
  }

  const filteredStaff = followUpStaff.filter(staff => {
    const filterMatch =
      selectedFilter === 'all' ||
      (selectedFilter === 'urgent' && staff.priority === 'urgent') ||
      (selectedFilter === 'pending' && staff.followUpStatus === 'pending')

    const deptMatch =
      selectedDepartment === 'all' ||
      staff.department === departments.find(d => d.id === selectedDepartment)?.name

    return filterMatch && deptMatch
  })

  // 統計データの計算
  const statistics = useMemo(() => {
    const total = followUpStaff.length
    const urgent = followUpStaff.filter(s => s.priority === 'urgent').length
    const pending = followUpStaff.filter(s => s.followUpStatus === 'pending').length
    const scheduled = followUpStaff.filter(s => s.followUpStatus === 'scheduled').length
    const highStress = followUpStaff.filter(s => s.stressLevel === 'high').length

    return {
      total,
      urgent,
      pending,
      scheduled,
      highStress,
      responseRate: Math.round((scheduled / total) * 100)
    }
  }, [followUpStaff])

  // チャートデータ
  const chartData = useMemo(() => {
    const deptStats = departments
      .filter(d => d.id !== 'all')
      .map(dept => {
        const staffInDept = followUpStaff.filter(s => s.department === dept.name)
        const highStressInDept = staffInDept.filter(s => s.stressLevel === 'high')
        return {
          name: dept.name,
          total: staffInDept.length,
          highStress: highStressInDept.length,
          rate: staffInDept.length > 0 ? Math.round((highStressInDept.length / staffInDept.length) * 100) : 0
        }
      })
    return deptStats
  }, [followUpStaff])

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.pageTitle}>
            <span className={styles.titleIcon}>🤝</span>
            <h2>フォローアップ管理</h2>
          </div>
          <div className={styles.statusBadges}>
            <span className={`${styles.badge} ${styles.badgeUrgent}`}>
              🚨 要緊急対応: {statistics.urgent}名
            </span>
            <span className={`${styles.badge} ${styles.badgePending}`}>
              ⏳ 対応待ち: {statistics.pending}名
            </span>
            <span className={`${styles.badge} ${styles.badgeScheduled}`}>
              📅 面談予定: {statistics.scheduled}名
            </span>
          </div>
        </div>
      </div>

      {/* フィルターバー */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>部署:</label>
          <select
            className={styles.filterSelect}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>期間:</label>
          <div className={styles.timeRangeButtons}>
            <button
              className={`${styles.timeBtn} ${timeRange === 'week' ? styles.active : ''}`}
              onClick={() => setTimeRange('week')}
            >
              週間
            </button>
            <button
              className={`${styles.timeBtn} ${timeRange === 'month' ? styles.active : ''}`}
              onClick={() => setTimeRange('month')}
            >
              月間
            </button>
            <button
              className={`${styles.timeBtn} ${timeRange === 'quarter' ? styles.active : ''}`}
              onClick={() => setTimeRange('quarter')}
            >
              四半期
            </button>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statValue}>{statistics.total}</div>
          <div className={styles.statLabel}>フォロー対象者</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statValue}>{statistics.highStress}</div>
          <div className={styles.statLabel}>高ストレス者</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statValue}>{statistics.responseRate}%</div>
          <div className={styles.statLabel}>対応率</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statValue}>{statistics.urgent}</div>
          <div className={styles.statLabel}>緊急対応必要</div>
        </div>
      </div>

      {/* 部署別分析グラフ */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>📊</span>
            <span>部署別高ストレス者分布</span>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.barChart}>
            {chartData.map(dept => (
              <div key={dept.name} className={styles.barGroup}>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${dept.rate}%`,
                      background: dept.rate > 20 ?
                        'linear-gradient(180deg, #ef4444, #dc2626)' :
                        dept.rate > 10 ?
                        'linear-gradient(180deg, #f59e0b, #d97706)' :
                        'linear-gradient(180deg, #10b981, #059669)'
                    }}
                  >
                    <span className={styles.barValue}>{dept.rate}%</span>
                  </div>
                </div>
                <div className={styles.barLabel}>{dept.name}</div>
                <div className={styles.barCount}>({dept.highStress}/{dept.total}名)</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* クイックアクション */}
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
                <div className={styles.actionDesc}>
                  {action.description}
                  {action.targetCount && (
                    <span className={styles.targetCount}> ({action.targetCount})</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* VoiceDrive連携ステータス */}
          <div className={styles.voicedriveStatus}>
            <div className={styles.statusHeader}>
              <span className={styles.statusIcon}>🔗</span>
              <strong>VoiceDrive連携状態</strong>
            </div>
            <div className={styles.statusContent}>
              <div className={styles.statusIndicator}>
                <span className={styles.dotPending}></span>
                <span>準備中</span>
              </div>
              <p className={styles.statusMessage}>
                VoiceDriveとの連携機能は現在開発中です。
                完成後は、SNS経由での配信が可能になります。
              </p>
            </div>
          </div>
        </div>

        {/* フォロー対象者リスト */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <span>👥</span>
              <span>フォロー対象者</span>
            </div>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterBtn} ${selectedFilter === 'all' ? styles.active : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                全て
              </button>
              <button
                className={`${styles.filterBtn} ${selectedFilter === 'urgent' ? styles.active : ''}`}
                onClick={() => setSelectedFilter('urgent')}
              >
                緊急
              </button>
              <button
                className={`${styles.filterBtn} ${selectedFilter === 'pending' ? styles.active : ''}`}
                onClick={() => setSelectedFilter('pending')}
              >
                対応待ち
              </button>
            </div>
          </div>

          <div className={styles.staffList}>
            {filteredStaff.map(staff => (
              <div key={staff.id} className={styles.staffItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedStaff.includes(staff.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStaff([...selectedStaff, staff.id])
                    } else {
                      setSelectedStaff(selectedStaff.filter(id => id !== staff.id))
                    }
                  }}
                />
                <div className={styles.staffInfo}>
                  <div className={styles.staffName}>{staff.name}</div>
                  <div className={styles.staffDetails}>
                    <span>{staff.department}</span>
                    <span>•</span>
                    <span>最終チェック: {staff.lastCheckDate}</span>
                  </div>
                </div>
                <div className={styles.staffStatus}>
                  <div
                    className={styles.stressIndicator}
                    style={{ backgroundColor: getStressLevelColor(staff.stressLevel) }}
                  >
                    {staff.stressLevel === 'high' ? '高' : staff.stressLevel === 'moderate' ? '中' : '低'}
                  </div>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(staff.followUpStatus)}`}>
                    {staff.followUpStatus === 'pending' ? '対応待ち' :
                     staff.followUpStatus === 'scheduled' ? '面談予定' : '完了'}
                  </span>
                  {staff.interviewDate && (
                    <span className={styles.interviewDate}>
                      📅 {staff.interviewDate}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedStaff.length > 0 && (
            <div className={styles.bulkActions}>
              <span>{selectedStaff.length}名選択中</span>
              <button className={styles.bulkBtn} onClick={() => setShowDistributionModal(true)}>
                一括配信
              </button>
              <button className={styles.bulkBtn}>
                面談予約
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 配信テンプレート */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <span>📝</span>
            <span>配信テンプレート</span>
          </div>
          <button className={styles.addBtn}>新規作成 +</button>
        </div>

        <div className={styles.templateGrid}>
          {templates.map(template => (
            <div key={template.id} className={styles.templateCard}>
              <div className={styles.templateHeader}>
                <span className={styles.templateName}>{template.name}</span>
                <span className={styles.templateCategory}>
                  {template.category === 'interview' ? '面談' :
                   template.category === 'reminder' ? 'リマインダー' :
                   template.category === 'result' ? '結果' : 'サポート'}
                </span>
              </div>
              <div className={styles.templateSubject}>件名: {template.subject}</div>
              <div className={styles.templateContent}>{template.content}</div>
              <div className={styles.templateActions}>
                <button className={styles.templateBtn}>プレビュー</button>
                <button className={styles.templateBtn}>編集</button>
                <button className={styles.templateBtn}>使用</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI提案 */}
      <div className={styles.aiSuggestion}>
        <div className={styles.suggestionHeader}>
          <span className={styles.aiIcon}>🤖</span>
          <strong>AIからの提案</strong>
        </div>
        <div className={styles.suggestionContent}>
          <p>営業部で高ストレス判定者が前回より20%増加しています。</p>
          <p>部門長との連携を含めた組織的なアプローチを推奨します。</p>
        </div>
        <div className={styles.suggestionActions}>
          <button className={styles.suggestionBtn}>詳細分析を見る</button>
          <button className={styles.suggestionBtn}>対策プランを作成</button>
          <button className={styles.suggestionBtn}>部門長にレポート送信</button>
        </div>
      </div>

      {/* 配信モーダル（仮実装） */}
      {showDistributionModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDistributionModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>配信設定</h3>
            <p>選択した{selectedStaff.length}名に配信します</p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowDistributionModal(false)}>キャンセル</button>
              <button className={styles.primaryBtn}>配信</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}