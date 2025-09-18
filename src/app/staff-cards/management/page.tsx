'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { staffDatabase } from '../../data/staffData.js'
import styles from '../StaffCards.module.css'

export default function ManagementPage() {
  const [showNewStaffForm, setShowNewStaffForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([])
  
  const handleSelectStaff = (staffId: string) => {
    if (selectedStaffIds.includes(staffId)) {
      setSelectedStaffIds(selectedStaffIds.filter(id => id !== staffId))
    } else {
      setSelectedStaffIds([...selectedStaffIds, staffId])
    }
  }

  const handleDeleteSelected = () => {
    if (window.confirm(`選択した${selectedStaffIds.length}名の職員データを削除しますか？`)) {
      alert('削除機能は現在開発中です')
      setSelectedStaffIds([])
      setDeleteMode(false)
    }
  }

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.managementContainer}>
          <div className={styles.managementHeader}>
            <h2>職員カルテ管理</h2>
            <div className={styles.managementActions}>
              <button 
                className={`${styles.actionButton} ${styles.primaryButton}`}
                onClick={() => setShowNewStaffForm(true)}
              >
                <span className={styles.actionIcon}>➕</span>
                新規作成
              </button>
              <button 
                className={`${styles.actionButton} ${editMode ? styles.activeButton : ''}`}
                onClick={() => {
                  setEditMode(!editMode)
                  setDeleteMode(false)
                  setSelectedStaffIds([])
                }}
              >
                <span className={styles.actionIcon}>✏️</span>
                編集モード
              </button>
              <button 
                className={`${styles.actionButton} ${deleteMode ? styles.dangerButton : ''}`}
                onClick={() => {
                  setDeleteMode(!deleteMode)
                  setEditMode(false)
                  setSelectedStaffIds([])
                }}
              >
                <span className={styles.actionIcon}>🗑️</span>
                削除モード
              </button>
            </div>
          </div>

          {showNewStaffForm && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>新規職員登録</h3>
                  <button 
                    className={styles.closeButton}
                    onClick={() => setShowNewStaffForm(false)}
                  >
                    ✕
                  </button>
                </div>
                <form className={styles.newStaffForm}>
                  <div className={styles.formSection}>
                    <h4>基本情報</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>氏名 *</label>
                        <input type="text" required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>職員ID *</label>
                        <input type="text" required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>生年月日</label>
                        <input type="date" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>性別</label>
                        <select>
                          <option value="">選択してください</option>
                          <option value="男性">男性</option>
                          <option value="女性">女性</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.formSection}>
                    <h4>所属情報</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>施設 *</label>
                        <select required>
                          <option value="">選択してください</option>
                          <option value="小原病院">小原病院</option>
                          <option value="立神リハビリテーション温泉病院">立神リハビリテーション温泉病院</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>部署 *</label>
                        <select required>
                          <option value="">選択してください</option>
                          <option value="内科">内科</option>
                          <option value="リハビリテーション科">リハビリテーション科</option>
                          <option value="第１病棟">第１病棟</option>
                          <option value="外来">外来</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>役職</label>
                        <input type="text" placeholder="例: 看護師" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>入職日</label>
                        <input type="date" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button type="button" className={styles.cancelButton} onClick={() => setShowNewStaffForm(false)}>
                      キャンセル
                    </button>
                    <button type="submit" className={styles.submitButton}>
                      登録
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className={styles.managementContent}>
            {deleteMode && selectedStaffIds.length > 0 && (
              <div className={styles.selectionBar}>
                <span>{selectedStaffIds.length}名選択中</span>
                <button 
                  className={styles.deleteButton}
                  onClick={handleDeleteSelected}
                >
                  選択した職員を削除
                </button>
              </div>
            )}

            <div className={styles.staffManagementGrid}>
              {Object.values(staffDatabase).map((staff: any) => (
                <div 
                  key={staff.id} 
                  className={`${styles.staffManagementCard} ${
                    selectedStaffIds.includes(staff.id) ? styles.selected : ''
                  }`}
                >
                  {(editMode || deleteMode) && (
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedStaffIds.includes(staff.id)}
                      onChange={() => handleSelectStaff(staff.id)}
                    />
                  )}
                  
                  <div className={styles.staffCardContent}>
                    <div className={styles.staffBasicInfo}>
                      <h4>{staff.name}</h4>
                      <p>{staff.id}</p>
                      <p>{staff.facility} / {staff.department}</p>
                      <p>{staff.position}</p>
                    </div>
                    
                    {editMode && !deleteMode && (
                      <div className={styles.editActions}>
                        <button className={styles.editButton}>
                          編集
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!editMode && !deleteMode && (
              <div className={styles.managementInfo}>
                <div className={styles.infoCard}>
                  <h3>📊 統計情報</h3>
                  <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>総職員数</span>
                      <span className={styles.statValue}>{Object.keys(staffDatabase).length}名</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>小原病院</span>
                      <span className={styles.statValue}>
                        {Object.values(staffDatabase).filter((s: any) => s.facility === '小原病院').length}名
                      </span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>立神リハビリテーション温泉病院</span>
                      <span className={styles.statValue}>
                        {Object.values(staffDatabase).filter((s: any) => s.facility === '立神リハビリテーション温泉病院').length}名
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3>🔧 管理機能</h3>
                  <ul className={styles.featureList}>
                    <li>職員データの一括インポート/エクスポート</li>
                    <li>テンプレートを使用した効率的な登録</li>
                    <li>部署別・施設別の一括編集</li>
                    <li>アーカイブ機能（退職者データの管理）</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}