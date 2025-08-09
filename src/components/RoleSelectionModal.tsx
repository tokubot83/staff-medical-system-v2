'use client'

import React from 'react'
import styles from './RoleSelectionModal.module.css'

interface RoleOption {
  value: string
  label: string
  description?: string
}

interface RoleSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (role: string) => void
  title: string
  roles: RoleOption[]
}

export default function RoleSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  title,
  roles 
}: RoleSelectionModalProps) {
  if (!isOpen) return null

  const handleSelect = (role: string) => {
    onSelect(role)
    onClose()
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.instruction}>職種を選択してください：</p>
          <div className={styles.roleList}>
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleSelect(role.value)}
                className={styles.roleButton}
              >
                <span className={styles.roleLabel}>{role.label}</span>
                {role.description && (
                  <span className={styles.roleDescription}>{role.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}