'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'
import { SmartSuggest } from './SmartSuggest'

interface NavigationContextType {
  pathname: string
  updateContext: (data: any) => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const [currentContext, setCurrentContext] = useState({
    page: '',
    tab: '',
    lastAction: ''
  })

  useEffect(() => {
    // パスから現在のページを判定
    const segments = pathname.split('/').filter(Boolean)
    const page = segments[0] || 'dashboard'
    setCurrentContext(prev => ({ ...prev, page }))
  }, [pathname])

  const updateContext = (data: any) => {
    setCurrentContext(prev => ({ ...prev, ...data }))
  }

  // パンくずリストの生成
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    breadcrumbs.push({ label: 'ホーム', href: '/' })

    if (segments.length === 0) {
      breadcrumbs[0].current = true
      return breadcrumbs
    }

    // ページごとのパンくず設定
    const pageMap: Record<string, string> = {
      'staff-cards': '職員カルテ',
      'evaluation': '評価管理',
      'interviews': '面談管理',
      'health': '健康管理',
      'recruitment': '採用管理',
      'education': '教育・研修',
      'attendance-management': '勤怠管理',
      'reports': 'レポート',
      'hr-announcements': 'お知らせ配信',
      'stress-check': 'ストレスチェック',
      'goals': '目標管理',
      'dashboard': 'ダッシュボード'
    }

    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const isLast = index === segments.length - 1

      if (pageMap[segment]) {
        breadcrumbs.push({
          label: pageMap[segment],
          href: isLast ? undefined : href,
          current: isLast
        })
      } else if (segment.match(/^ST\d+$/) || segment.match(/^\d+$/)) {
        // 職員IDの場合
        breadcrumbs.push({
          label: `職員詳細 (${segment})`,
          current: isLast
        })
      } else {
        // サブページ
        const subPageMap: Record<string, string> = {
          'new': '新規作成',
          'edit': '編集',
          'detail': '詳細',
          'schedule': 'スケジュール',
          'records': '記録',
          'report': 'レポート',
          'analysis': '分析',
          'settings': '設定'
        }

        breadcrumbs.push({
          label: subPageMap[segment] || segment,
          href: isLast ? undefined : href,
          current: isLast
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // スマートサジェストを表示するかどうか
  const showSmartSuggest = !pathname.includes('/login') && !pathname.includes('/error')

  return (
    <NavigationContext.Provider value={{ pathname, updateContext }}>
      {/* コンテンツ */}
      {children}

      {/* パンくずリスト - ページ最上部に固定 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#f3f4f6',
        borderBottom: '1px solid #e5e7eb',
        padding: '8px 16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* スマートサジェスト */}
      {showSmartSuggest && (
        <SmartSuggest
          currentContext={currentContext}
          staffId={pathname.includes('/staff-cards/') ? pathname.split('/')[2] : undefined}
        />
      )}
    </NavigationContext.Provider>
  )
}