'use client'

import React, { useState } from 'react'
import styles from './HRAnnouncementsDistribution.module.css'

interface Announcement {
  id: string
  title: string
  category: 'policy' | 'event' | 'training' | 'benefit' | 'survey' | 'interview' | 'other'
  subcategory?: 'reservation' | 'result' | 'reminder' | 'other'
  status: 'draft' | 'scheduled' | 'sent' | 'archived'
  scheduledDate?: string
  sentDate?: string
  targetDepartments: string[]
  priority: 'high' | 'medium' | 'low'
  readRate?: number
}

interface Template {
  id: string
  category: string
  subcategory?: string
  title: string
  content: string
}

export default function HRAnnouncementsDistribution() {
  const [selectedTab, setSelectedTab] = useState('compose')
  const [showPreview, setShowPreview] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

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
    { id: 'survey', label: 'アンケート', icon: '📊', color: '#ec4899' },
    { id: 'benefit', label: '福利厚生', icon: '💝', color: '#10b981' },
    { id: 'interview', label: '面談', icon: '👥', color: '#8b5cf6' },
    { id: 'other', label: 'その他', icon: '📢', color: '#6b7280' }
  ]

  const subcategories = {
    interview: [
      { id: 'reservation', label: '予約案内', icon: '📅' },
      { id: 'result', label: '結果通知', icon: '📝' },
      { id: 'reminder', label: 'リマインダー', icon: '🔔' },
      { id: 'other', label: 'その他', icon: '📌' }
    ]
  }

  const templates: Template[] = [
    {
      id: 'interview-reservation-regular',
      category: 'interview',
      subcategory: 'reservation',
      title: '【重要】定期面談の予約開始のお知らせ',
      content: `職員の皆様へ

${new Date().getFullYear()}年度の定期面談の予約を開始いたします。

■面談期間
${new Date().getMonth() + 2}月1日（月）～${new Date().getMonth() + 2}月28日（金）

■予約受付期間
本日より${new Date().getMonth() + 1}月20日（金）まで

■予約方法
1. 職員ポータルサイトにログイン
2. 「面談予約」メニューを選択
3. ご都合の良い日時を選択
4. 予約内容を確認し、「予約確定」をクリック

■注意事項
・面談時間は1人あたり30分を予定しています
・予約後の変更は、面談日の3営業日前まで可能です
・体調不良等でキャンセルする場合は、早めにご連絡ください

■お問い合わせ
人事部 面談担当
内線：1234
メール：interview@company.com

ご不明な点がございましたら、お気軽にお問い合わせください。

人事部`
    },
    {
      id: 'interview-reservation-evaluation',
      category: 'interview',
      subcategory: 'reservation',
      title: '【要対応】評価面談の実施について',
      content: `職員の皆様へ

${new Date().getFullYear()}年度上期の評価面談を実施いたします。

■面談の目的
・上期の振り返りと評価のフィードバック
・下期の目標設定
・キャリア開発に関する相談

■対象者
全正社員

■実施期間
${new Date().getMonth() + 1}月15日（月）～${new Date().getMonth() + 2}月15日（金）

■予約方法
上長より個別に日程調整のご連絡をいたします。
提示された日程でご都合が悪い場合は、速やかに上長へご相談ください。

■準備事項
面談前に以下をご準備ください：
1. 上期の業務実績の整理
2. 自己評価シートの作成
3. 下期の目標案

■その他
・面談は原則対面で実施しますが、リモート勤務者はオンラインでの実施も可能です
・面談時間は約45分を予定しています

ご協力のほどよろしくお願いいたします。

人事部`
    }
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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory('')
    // カテゴリが面談以外の場合はサブカテゴリをリセット
    if (categoryId !== 'interview') {
      setTitle('')
      setContent('')
    }
  }

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)

    // 予約案内を選択した場合、テンプレートを自動挿入
    if (selectedCategory === 'interview' && subcategoryId === 'reservation') {
      // デフォルトで定期面談のテンプレートを使用
      const template = templates.find(
        t => t.id === 'interview-reservation-regular'
      )
      if (template) {
        setTitle(template.title)
        setContent(template.content)
      }
    } else {
      // その他のサブカテゴリの場合はクリア
      setTitle('')
      setContent('')
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setTitle(template.title)
      setContent(template.content)
    }
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
                      className={`${styles.categoryCard} ${selectedCategory === cat.id ? styles.selected : ''}`}
                      style={{
                        borderColor: selectedCategory === cat.id ? cat.color : '#e5e7eb',
                        backgroundColor: selectedCategory === cat.id ? `${cat.color}10` : 'transparent'
                      }}
                      onClick={() => handleCategorySelect(cat.id)}
                    >
                      <span className={styles.categoryIcon}>{cat.icon}</span>
                      <span className={styles.categoryLabel}>{cat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCategory === 'interview' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>サブカテゴリー</label>
                  <div className={styles.subcategoryGrid}>
                    {subcategories.interview.map(subcat => (
                      <button
                        key={subcat.id}
                        className={`${styles.subcategoryBtn} ${selectedSubcategory === subcat.id ? styles.selected : ''}`}
                        onClick={() => handleSubcategorySelect(subcat.id)}
                      >
                        <span>{subcat.icon}</span>
                        <span>{subcat.label}</span>
                      </button>
                    ))}
                  </div>

                  {selectedSubcategory === 'reservation' && (
                    <div className={styles.templateSelector}>
                      <label className={styles.formLabel}>テンプレート選択</label>
                      <select
                        className={styles.formSelect}
                        onChange={(e) => handleTemplateSelect(e.target.value)}
                        defaultValue="interview-reservation-regular"
                      >
                        <option value="interview-reservation-regular">定期面談の予約案内</option>
                        <option value="interview-reservation-evaluation">評価面談の予約案内</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>件名</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="お知らせのタイトルを入力"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>本文</label>
                <textarea
                  className={styles.formTextarea}
                  rows={12}
                  placeholder="お知らせの内容を入力"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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