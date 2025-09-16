'use client'

import React, { useState } from 'react'
import styles from './HRAnnouncementsDistribution.module.css'

interface Announcement {
  id: string
  title: string
  category: 'policy' | 'event' | 'training' | 'benefit' | 'other'
  status: 'draft' | 'scheduled' | 'sent' | 'archived'
  scheduledDate?: string
  sentDate?: string
  targetDepartments: string[]
  priority: 'high' | 'medium' | 'low'
  readRate?: number
}

export default function HRAnnouncementsDistribution() {
  const [selectedTab, setSelectedTab] = useState('compose')
  const [showPreview, setShowPreview] = useState(false)

  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: '2025年度健康診断実施のお知らせ',
      category: 'benefit',
      status: 'sent',
      sentDate: '2025-01-15',
      targetDepartments: ['全社'],
      priority: 'high',
      readRate: 78
    },
    {
      id: '2',
      title: '新人事制度説明会の開催について',
      category: 'policy',
      status: 'scheduled',
      scheduledDate: '2025-01-25 10:00',
      targetDepartments: ['管理部', '人事部'],
      priority: 'high'
    },
    {
      id: '3',
      title: 'リーダーシップ研修の参加者募集',
      category: 'training',
      status: 'sent',
      sentDate: '2025-01-10',
      targetDepartments: ['営業部', '開発部'],
      priority: 'medium',
      readRate: 65
    },
    {
      id: '4',
      title: '社内イベント「新年会」開催のご案内',
      category: 'event',
      status: 'draft',
      targetDepartments: ['全社'],
      priority: 'low'
    }
  ]

  const categories = [
    { id: 'policy', label: '制度・規定', icon: '📋', color: '#7c3aed' },
    { id: 'event', label: 'イベント', icon: '🎉', color: '#f59e0b' },
    { id: 'training', label: '研修・教育', icon: '📚', color: '#3b82f6' },
    { id: 'benefit', label: '福利厚生', icon: '💝', color: '#10b981' },
    { id: 'other', label: 'その他', icon: '📢', color: '#6b7280' }
  ]

  const tabs = [
    { id: 'compose', label: '新規作成', icon: '✏️' },
    { id: 'list', label: '配信履歴', icon: '📋' },
    { id: 'templates', label: 'テンプレート', icon: '📝' },
    { id: 'analytics', label: '配信分析', icon: '📊' },
    { id: 'settings', label: '設定', icon: '⚙️' }
  ]

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[4]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#6b7280'
      default: return '#6b7280'
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${selectedTab === tab.id ? styles.active : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {selectedTab === 'compose' && (
        <div className={styles.composeSection}>
          <div className={styles.mainGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <span>✏️</span>
                  <span>お知らせ作成</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>カテゴリー</label>
                <div className={styles.categoryGrid}>
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      className={styles.categoryCard}
                      style={{ borderColor: cat.color }}
                    >
                      <span className={styles.categoryIcon}>{cat.icon}</span>
                      <span className={styles.categoryLabel}>{cat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>件名</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="お知らせのタイトルを入力"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>本文</label>
                <textarea
                  className={styles.formTextarea}
                  rows={8}
                  placeholder="お知らせの内容を入力"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>配信対象</label>
                <div className={styles.targetSelection}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" /> 全社
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" /> 営業部
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" /> 開発部
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" /> 管理部
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" /> 製造部
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" /> 人事部
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>重要度</label>
                <div className={styles.priorityOptions}>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="priority" value="high" />
                    <span className={styles.priorityHigh}>高</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="priority" value="medium" defaultChecked />
                    <span className={styles.priorityMedium}>中</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="priority" value="low" />
                    <span className={styles.priorityLow}>低</span>
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.btnSecondary}>下書き保存</button>
                <button
                  className={styles.btnSecondary}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  プレビュー
                </button>
                <button className={styles.btnPrimary}>配信予約</button>
                <button className={styles.btnPrimary}>今すぐ配信</button>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <span>💡</span>
                  <span>配信のヒント</span>
                </div>
              </div>

              <div className={styles.tipsList}>
                <div className={styles.tipItem}>
                  <span className={styles.tipIcon}>📅</span>
                  <div className={styles.tipContent}>
                    <div className={styles.tipTitle}>最適な配信タイミング</div>
                    <div className={styles.tipText}>
                      月曜日の午前9時〜10時、火曜日の午前10時〜11時が最も既読率が高い傾向にあります。
                    </div>
                  </div>
                </div>

                <div className={styles.tipItem}>
                  <span className={styles.tipIcon}>📝</span>
                  <div className={styles.tipContent}>
                    <div className={styles.tipTitle}>効果的な件名</div>
                    <div className={styles.tipText}>
                      【重要】【締切あり】などのプレフィックスを使用すると開封率が20%向上します。
                    </div>
                  </div>
                </div>

                <div className={styles.tipItem}>
                  <span className={styles.tipIcon}>🎯</span>
                  <div className={styles.tipContent}>
                    <div className={styles.tipTitle}>ターゲティング</div>
                    <div className={styles.tipText}>
                      部署を限定した配信の方が、全社配信より既読率が15%高くなります。
                    </div>
                  </div>
                </div>
              </div>

              {showPreview && (
                <div className={styles.previewSection}>
                  <div className={styles.previewHeader}>
                    <span>📱 VoiceDriveでの表示イメージ</span>
                  </div>
                  <div className={styles.previewDevice}>
                    <div className={styles.previewNotification}>
                      <div className={styles.notificationHeader}>
                        <span className={styles.notificationIcon}>🏢</span>
                        <span className={styles.notificationFrom}>人事部</span>
                        <span className={styles.notificationTime}>今</span>
                      </div>
                      <div className={styles.notificationTitle}>
                        【重要】2025年度健康診断実施のお知らせ
                      </div>
                      <div className={styles.notificationBody}>
                        本年度の健康診断を以下の日程で実施いたします...
                      </div>
                      <div className={styles.notificationAction}>
                        詳細を確認する →
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'list' && (
        <div className={styles.listSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span>📋</span>
                <span>配信履歴</span>
              </div>
              <div className={styles.filterButtons}>
                <button className={styles.filterBtn}>全て</button>
                <button className={styles.filterBtn}>配信済み</button>
                <button className={styles.filterBtn}>予約中</button>
                <button className={styles.filterBtn}>下書き</button>
              </div>
            </div>

            <div className={styles.announcementList}>
              {mockAnnouncements.map(announcement => {
                const categoryInfo = getCategoryInfo(announcement.category)
                return (
                  <div key={announcement.id} className={styles.announcementItem}>
                    <div className={styles.announcementIcon} style={{ color: categoryInfo.color }}>
                      {categoryInfo.icon}
                    </div>
                    <div className={styles.announcementContent}>
                      <div className={styles.announcementTitle}>{announcement.title}</div>
                      <div className={styles.announcementMeta}>
                        <span className={styles.metaItem}>
                          <span style={{ color: getPriorityColor(announcement.priority) }}>●</span>
                          {announcement.priority === 'high' ? '高' : announcement.priority === 'medium' ? '中' : '低'}
                        </span>
                        <span className={styles.metaItem}>
                          対象: {announcement.targetDepartments.join(', ')}
                        </span>
                        {announcement.sentDate && (
                          <span className={styles.metaItem}>
                            配信日: {announcement.sentDate}
                          </span>
                        )}
                        {announcement.scheduledDate && (
                          <span className={styles.metaItem}>
                            予約: {announcement.scheduledDate}
                          </span>
                        )}
                      </div>
                    </div>
                    {announcement.readRate && (
                      <div className={styles.readRateBox}>
                        <div className={styles.readRateValue}>{announcement.readRate}%</div>
                        <div className={styles.readRateLabel}>既読率</div>
                      </div>
                    )}
                    <div className={styles.announcementActions}>
                      <button className={styles.actionBtn}>詳細</button>
                      {announcement.status === 'draft' && (
                        <button className={styles.actionBtn}>編集</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}