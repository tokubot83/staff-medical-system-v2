'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HrStrategyPage() {
  const router = useRouter()
  
  useEffect(() => {
    // 採用管理ページの人材配置タブへリダイレクト
    router.replace('/recruitment?tab=placement')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>リダイレクト中...</h2>
        <p>採用管理ページへ移動しています</p>
      </div>
    </div>
  )
}