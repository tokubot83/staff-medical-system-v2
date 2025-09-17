'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav
      className={`${className}`}
      aria-label="パンくずリスト"
    >
      <ol className="flex items-center space-x-2 text-sm">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            <span className="sr-only">ホーム</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="flex items-center">
              {item.href && !item.current ? (
                <Link
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`flex items-center ${
                    item.current ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

export const useBreadcrumb = (currentPath: string, staffInfo?: any) => {
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = []

    const pathSegments = currentPath.split('/').filter(segment => segment)

    if (pathSegments.length === 0) {
      return [{ label: 'ダッシュボード', current: true }]
    }

    breadcrumbs.push({ label: 'トップ', href: '/' })

    if (pathSegments[0] === 'staff-cards') {
      breadcrumbs.push({ label: '職員カルテ', href: '/staff-cards' })

      if (pathSegments[1] && staffInfo) {
        breadcrumbs.push({
          label: staffInfo.name || '職員詳細',
          current: true
        })

        const currentYear = new Date().getFullYear()
        const tabMapping: Record<string, string> = {
          'evaluation': `${currentYear}年度評価`,
          'interview': '面談記録',
          'attendance': '勤怠状況',
          'education': '研修履歴',
          'development': '成長開発',
          'analytics': '分析レポート'
        }

        const activeTab = staffInfo.activeTab
        if (activeTab && tabMapping[activeTab]) {
          breadcrumbs[breadcrumbs.length - 1].current = false
          breadcrumbs.push({
            label: tabMapping[activeTab],
            current: true
          })
        }
      }
    } else if (pathSegments[0] === 'evaluation') {
      breadcrumbs.push({ label: '評価管理', href: '/evaluation', current: !pathSegments[1] })

      if (pathSegments[1] === 'execution') {
        breadcrumbs.push({ label: '評価実行', current: true })
      } else if (pathSegments[1] === 'review') {
        breadcrumbs.push({ label: '評価レビュー', current: true })
      }
    } else if (pathSegments[0] === 'interviews') {
      breadcrumbs.push({ label: '面談管理', href: '/interviews', current: !pathSegments[1] })

      if (pathSegments[1] === 'schedule') {
        breadcrumbs.push({ label: 'スケジュール', current: true })
      } else if (pathSegments[1] === 'records') {
        breadcrumbs.push({ label: '面談記録', current: true })
      }
    }

    return breadcrumbs
  }

  return generateBreadcrumbs()
}