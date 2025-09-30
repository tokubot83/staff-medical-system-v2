'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { staffDatabase } from '../../data/staffData.js'
import styles from '../StaffCards.module.css'

export default function ManagementPage() {
  const [showNewStaffForm, setShowNewStaffForm] = useState(false)
  const [showResignationForm, setShowResignationForm] = useState(false) // Phase 4追加
  const [resignationStaffId, setResignationStaffId] = useState<string | null>(null) // Phase 4追加
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
                className={`${styles.actionButton} ${styles.secondaryButton}`}
                onClick={() => setShowResignationForm(true)}
                title="退職手続き"
              >
                <span className={styles.actionIcon}>📤</span>
                退職手続き
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

                  {/* VoiceDrive設定セクション（Phase 4追加） */}
                  <div className={styles.formSection} style={{ backgroundColor: '#f8f9ff', padding: '16px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#4f46e5' }}>🔗 VoiceDrive連携設定</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="checkbox" defaultChecked />
                          <span>VoiceDriveアカウントを自動作成（推奨）</span>
                        </label>
                        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                          入職と同時にVoiceDriveアカウントが作成されます
                        </p>
                      </div>

                      <div className={styles.formGroup}>
                        <label>権限レベル</label>
                        <select defaultValue="auto">
                          <option value="auto">自動計算（推奨）</option>
                          <option value="1">レベル1 - 新人（1年目）</option>
                          <option value="2">レベル2 - 若手（2-3年目）</option>
                          <option value="3">レベル3 - 中堅（4-10年目）</option>
                          <option value="4">レベル4 - ベテラン（11年以上）</option>
                        </select>
                        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                          入職日・役職から自動計算されます
                        </p>
                      </div>

                      <div className={styles.formGroup}>
                        <label>リーダー業務</label>
                        <select defaultValue="no">
                          <option value="no">不可</option>
                          <option value="yes">可能</option>
                        </select>
                        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                          看護師・准看護師の場合のみ有効
                        </p>
                      </div>

                      <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="checkbox" defaultChecked />
                          <span>初回ログイン案内メールを送信</span>
                        </label>
                      </div>

                      <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="checkbox" defaultChecked />
                          <span>新入職員月次面談を自動スケジュール</span>
                        </label>
                        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                          入職1ヶ月後、2ヶ月後、3ヶ月後の面談が自動予約されます
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#e0e7ff', borderRadius: '4px', fontSize: '0.875rem', color: '#4338ca' }}>
                      <strong>ℹ️ VoiceDrive連携:</strong> アカウント作成後、初回ログイン情報が記載された案内メールが自動送信されます。
                      権限レベルは後から調整可能です。
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

          {/* 退職処理フォーム（Phase 4追加） */}
          {showResignationForm && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>退職手続き</h3>
                  <button
                    className={styles.closeButton}
                    onClick={() => {
                      setShowResignationForm(false)
                      setResignationStaffId(null)
                    }}
                  >
                    ✕
                  </button>
                </div>
                <form className={styles.newStaffForm} onSubmit={(e) => {
                  e.preventDefault()
                  alert('退職処理機能は共通DB構築後に有効になります')
                  setShowResignationForm(false)
                }}>
                  <div className={styles.formSection}>
                    <h4>職員選択</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label>退職する職員 *</label>
                        <select required onChange={(e) => setResignationStaffId(e.target.value)}>
                          <option value="">選択してください</option>
                          {Object.values(staffDatabase).map((staff: any) => (
                            <option key={staff.id} value={staff.id}>
                              {staff.name} - {staff.facility} / {staff.department} / {staff.position}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4>退職情報</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>退職予定日 *</label>
                        <input type="date" required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>最終勤務日 *</label>
                        <input type="date" required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>退職理由 *</label>
                        <select required>
                          <option value="">選択してください</option>
                          <option value="personal">自己都合</option>
                          <option value="career_change">キャリアチェンジ</option>
                          <option value="relocation">転居</option>
                          <option value="health">健康上の理由</option>
                          <option value="family">家庭の事情</option>
                          <option value="retirement">定年退職</option>
                          <option value="contract_end">契約期間満了</option>
                          <option value="disciplinary">懲戒</option>
                          <option value="company_initiated">会社都合</option>
                          <option value="other">その他</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>退職理由詳細</label>
                        <input type="text" placeholder="具体的な理由を入力" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4>退職面談</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="checkbox" defaultChecked />
                          <span>退職面談を実施する（推奨）</span>
                        </label>
                        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                          ※ 面談を実施しない場合は、上長の承認が必要です
                        </p>
                      </div>
                      <div className={styles.formGroup}>
                        <label>退職面談予定日</label>
                        <input type="date" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>面談未実施の理由（該当する場合）</label>
                        <input type="text" placeholder="例: 体調不良のため面談困難" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4>VoiceDriveアカウント設定</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>アカウント無効化日</label>
                        <input type="date" placeholder="通常は最終勤務日" />
                        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                          最終勤務日に自動無効化されます
                        </p>
                      </div>
                      <div className={styles.formGroup}>
                        <label>データ保持期間</label>
                        <select defaultValue="1">
                          <option value="0.5">6ヶ月</option>
                          <option value="1">1年間（推奨）</option>
                          <option value="3">3年間</option>
                          <option value="5">5年間</option>
                        </select>
                      </div>
                      <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="checkbox" defaultChecked />
                          <span>再雇用候補として登録</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => {
                        setShowResignationForm(false)
                        setResignationStaffId(null)
                      }}
                    >
                      キャンセル
                    </button>
                    <button type="submit" className={styles.submitButton}>
                      退職手続きを開始
                    </button>
                  </div>

                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px', fontSize: '0.875rem' }}>
                    <strong>⚠️ 注意:</strong> 退職手続きを開始すると、承認フローが開始されます。
                    最終勤務日までは通常業務が継続されます。
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