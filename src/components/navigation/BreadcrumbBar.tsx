'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export default function BreadcrumbBar() {
  const pathname = usePathname()

  // パンくずリストの生成
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []

    // ページマッピング
    const pageNames: Record<string, string> = {
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
      'notifications': 'お知らせ',
      'dashboard': 'ダッシュボード'
    }

    if (segments.length === 0) {
      return [{ label: 'ホーム', href: '/', current: true }]
    }

    breadcrumbs.push({ label: 'ホーム', href: '/' })

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1
      const href = '/' + segments.slice(0, index + 1).join('/')

      let label = pageNames[segment] || segment

      // 職員IDの場合
      if (segment.match(/^(ST|OH|TA)/)) {
        label = `職員詳細 (${segment})`
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : href,
        current: isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2 shadow-sm">
      <nav aria-label="パンくずリスト">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <li className="flex items-center">
                  <ChevronRight className="w-3 h-3 text-gray-400 mx-1" />
                </li>
              )}
              <li className="flex items-center">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center hover:underline"
                  >
                    {index === 0 && <Home className="w-3 h-3 mr-1" />}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`flex items-center ${
                    crumb.current
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600'
                  }`}>
                    {crumb.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  )
}