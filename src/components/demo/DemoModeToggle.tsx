'use client'

import React, { useState, useEffect } from 'react'
import { isDemoMode, enableDemoMode, disableDemoMode } from '@/lib/demo-config'

export default function DemoModeToggle() {
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    setIsDemo(isDemoMode())
  }, [])

  const handleToggle = () => {
    if (isDemo) {
      disableDemoMode()
      setIsDemo(false)
    } else {
      enableDemoMode()
      setIsDemo(true)
    }
    // ページをリロードして変更を反映
    window.location.reload()
  }

  // 開発環境またはデモパラメータがある時のみ表示
  if (process.env.NODE_ENV === 'production' && !window.location.search.includes('showDemo=true')) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded-lg shadow-lg font-medium text-sm transition-all transform hover:scale-105 ${
          isDemo
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-600'
        }`}
      >
        {isDemo ? '🎮 デモモード ON' : 'デモモード OFF'}
      </button>
    </div>
  )
}