'use client'

import React, { useState, useEffect } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  ChevronRight,
  RefreshCw,
  Download,
  Bell,
  BookOpen,
  Award,
  Activity,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar'

// モックデータ（実際はAPIから取得）
const mockDashboardData = {
  alerts: [
    {
      id: 1,
      type: 'training',
      priority: 'high',
      staffName: '山田太郎',
      staffId: 'EMP001',
      message: '感染対策研修（2回目）未受講',
      dueDate: '2025-08-20',
      actionRequired: 'training_register'
    },
    {
      id: 2,
      type: 'evaluation',
      priority: 'medium',
      staffName: '鈴木花子',
      staffId: 'EMP002',
      message: '本人評価が未入力',
      dueDate: '2025-08-25',
      actionRequired: 'self_evaluation'
    },
    {
      id: 3,
      type: 'deadline',
      priority: 'high',
      staffName: '全職員',
      staffId: null,
      message: '上期評価締切まであと5日',
      dueDate: '2025-08-17',
      actionRequired: 'review_all'
    }
  ],
  progress: {
    coreEvaluation: {
      total: 250,
      completed: 213,
      percentage: 85.2,
      breakdown: {
        superiorCompleted: 198,
        selfCompleted: 213
      }
    },
    facilityEvaluation: {
      total: 250,
      completed: 180,
      percentage: 72.0,
      breakdown: {
        superiorCompleted: 165,
        selfCompleted: 180
      }
    },
    trainingCompletion: {
      mandatory: {
        total: 1250, // 250人 × 5研修
        completed: 1125,
        percentage: 90.0
      },
      optional: {
        total: 750, // 250人 × 3研修
        completed: 525,
        percentage: 70.0
      }
    }
  },
  trainingCrossCheck: [
    {
      itemId: 'C03-1',
      itemName: '医療安全',
      requiredTraining: '医療安全研修（年2回）',
      totalStaff: 250,
      completed: 230,
      canEvaluate: 230,
      blocked: 20
    },
    {
      itemId: 'C03-2',
      itemName: '感染対策',
      requiredTraining: '感染対策研修（年2回）',
      totalStaff: 250,
      completed: 225,
      canEvaluate: 225,
      blocked: 25
    },
    {
      itemId: 'C02-2',
      itemName: '権利擁護',
      requiredTraining: '虐待防止研修（年1回）',
      totalStaff: 250,
      completed: 240,
      canEvaluate: 240,
      blocked: 10
    }
  ],
  departments: [
    { name: '看護部', total: 120, evaluated: 108, percentage: 90 },
    { name: '医療技術部', total: 45, evaluated: 36, percentage: 80 },
    { name: 'リハビリ科', total: 35, evaluated: 28, percentage: 80 },
    { name: '事務部', total: 30, evaluated: 21, percentage: 70 },
    { name: '栄養科', total: 20, evaluated: 20, percentage: 100 }
  ],
  upcomingDeadlines: [
    { task: '上期技術評価入力', dueDate: '2025-08-17', daysLeft: 5 },
    { task: '身体拘束適正化研修（2回目）', dueDate: '2025-08-20', daysLeft: 8 },
    { task: '施設特化項目選定', dueDate: '2025-08-25', daysLeft: 13 },
    { task: '上期評価フィードバック面談', dueDate: '2025-08-31', daysLeft: 19 }
  ]
}

export default function EvaluationIntegratedDashboard() {
  const [data, setData] = useState(mockDashboardData)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [selectedView, setSelectedView] = useState<'overview' | 'details'>('overview')

  // 30秒ごとの自動更新
  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      setLastRefresh(new Date())
      // 実際はここでAPIを呼び出してデータを更新
      console.log('Dashboard refreshed')
    }, 30000)

    return () => clearInterval(interval)
  }, [isAutoRefresh])

  // 手動更新
  const handleManualRefresh = () => {
    setLastRefresh(new Date())
    // 実際はここでAPIを呼び出してデータを更新
  }

  // アラートの優先度に応じた色を返す
  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // 進捗率に応じた色を返す
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return '#10b981'
    if (percentage >= 70) return '#3b82f6'
    if (percentage >= 50) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <>
      <BreadcrumbBar />
      <div className="evaluationDashboard">
        {/* ヘッダー */}
        <div className="dashboardHeader">
        <div className="headerContent">
          <h2>評価統合ダッシュボード</h2>
          <p className="description">
            評価進捗と研修受講状況を一元管理
          </p>
        </div>
        <div className="headerActions">
          <div className="refreshStatus">
            <Clock size={16} />
            <span>最終更新: {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <button 
            className="refreshButton"
            onClick={handleManualRefresh}
          >
            <RefreshCw size={18} />
            更新
          </button>
          <button 
            className={`autoRefreshToggle ${isAutoRefresh ? 'active' : ''}`}
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            <Activity size={18} />
            {isAutoRefresh ? '自動更新ON' : '自動更新OFF'}
          </button>
        </div>
      </div>

      {/* アラートセクション */}
      {data.alerts.length > 0 && (
        <div className="alertSection">
          <div className="alertHeader">
            <AlertCircle size={20} />
            <h3>要対応事項</h3>
            <span className="alertCount">{data.alerts.length}件</span>
          </div>
          <div className="alertList">
            {data.alerts.map(alert => (
              <div key={alert.id} className={`alertItem ${getAlertColor(alert.priority)}`}>
                <div className="alertIcon">
                  {alert.type === 'training' && <BookOpen size={18} />}
                  {alert.type === 'evaluation' && <FileText size={18} />}
                  {alert.type === 'deadline' && <Calendar size={18} />}
                </div>
                <div className="alertContent">
                  <div className="alertMain">
                    <span className="alertStaff">{alert.staffName}</span>
                    <span className="alertMessage">{alert.message}</span>
                  </div>
                  <div className="alertMeta">
                    <span className="alertDue">期限: {alert.dueDate}</span>
                  </div>
                </div>
                <div className="alertAction">
                  {alert.actionRequired === 'training_register' && (
                    <Link href="/education">
                      <button className="actionButton">研修登録</button>
                    </Link>
                  )}
                  {alert.actionRequired === 'self_evaluation' && (
                    <Link href={`/evaluation/core-v2?staff=${alert.staffId}`}>
                      <button className="actionButton">評価入力</button>
                    </Link>
                  )}
                  {alert.actionRequired === 'review_all' && (
                    <Link href="/evaluation-execution">
                      <button className="actionButton">V3評価で確認</button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="mainContent">
        {/* 左カラム：進捗状況 */}
        <div className="leftColumn">
          {/* 評価進捗 */}
          <div className="progressCard">
            <div className="cardHeader">
              <h3>
                <BarChart3 size={20} />
                評価進捗状況
              </h3>
            </div>
            <div className="progressContent">
              <div className="progressItem">
                <div className="progressHeader">
                  <span className="progressLabel">法人統一項目（30点）</span>
                  <span className="progressValue">
                    {data.progress.coreEvaluation.percentage}%
                  </span>
                </div>
                <div className="progressBar">
                  <div 
                    className="progressFill"
                    style={{ 
                      width: `${data.progress.coreEvaluation.percentage}%`,
                      backgroundColor: getProgressColor(data.progress.coreEvaluation.percentage)
                    }}
                  />
                </div>
                <div className="progressDetail">
                  <span>上司評価: {data.progress.coreEvaluation.breakdown.superiorCompleted}/{data.progress.coreEvaluation.total}</span>
                  <span>本人評価: {data.progress.coreEvaluation.breakdown.selfCompleted}/{data.progress.coreEvaluation.total}</span>
                </div>
              </div>

              <div className="progressItem">
                <div className="progressHeader">
                  <span className="progressLabel">施設特化項目（20点）</span>
                  <span className="progressValue">
                    {data.progress.facilityEvaluation.percentage}%
                  </span>
                </div>
                <div className="progressBar">
                  <div 
                    className="progressFill"
                    style={{ 
                      width: `${data.progress.facilityEvaluation.percentage}%`,
                      backgroundColor: getProgressColor(data.progress.facilityEvaluation.percentage)
                    }}
                  />
                </div>
                <div className="progressDetail">
                  <span>上司評価: {data.progress.facilityEvaluation.breakdown.superiorCompleted}/{data.progress.facilityEvaluation.total}</span>
                  <span>本人評価: {data.progress.facilityEvaluation.breakdown.selfCompleted}/{data.progress.facilityEvaluation.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 部門別進捗 */}
          <div className="departmentCard">
            <div className="cardHeader">
              <h3>
                <Users size={20} />
                部門別完了率
              </h3>
            </div>
            <div className="departmentList">
              {data.departments.map(dept => (
                <div key={dept.name} className="departmentItem">
                  <div className="departmentInfo">
                    <span className="departmentName">{dept.name}</span>
                    <span className="departmentStats">
                      {dept.evaluated}/{dept.total}名
                    </span>
                  </div>
                  <div className="departmentProgress">
                    <div className="progressBar">
                      <div 
                        className="progressFill"
                        style={{ 
                          width: `${dept.percentage}%`,
                          backgroundColor: getProgressColor(dept.percentage)
                        }}
                      />
                    </div>
                    <span className="progressText">{dept.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右カラム：研修×評価クロスチェック */}
        <div className="rightColumn">
          {/* 研修受講チェック */}
          <div className="crossCheckCard">
            <div className="cardHeader">
              <h3>
                <Award size={20} />
                研修×評価クロスチェック
              </h3>
            </div>
            <div className="crossCheckList">
              {data.trainingCrossCheck.map(item => (
                <div key={item.itemId} className="crossCheckItem">
                  <div className="itemHeader">
                    <span className="itemName">{item.itemName}</span>
                    <span className="itemTraining">{item.requiredTraining}</span>
                  </div>
                  <div className="itemStats">
                    <div className="statGroup">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="statLabel">受講済み</span>
                      <span className="statValue">{item.completed}名</span>
                    </div>
                    <div className="statGroup">
                      <AlertCircle size={16} className="text-red-600" />
                      <span className="statLabel">未受講</span>
                      <span className="statValue">{item.blocked}名</span>
                    </div>
                  </div>
                  <div className="itemProgress">
                    <div className="progressBar">
                      <div 
                        className="progressFill"
                        style={{ 
                          width: `${(item.completed / item.totalStaff) * 100}%`,
                          backgroundColor: getProgressColor((item.completed / item.totalStaff) * 100)
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 今後の期限 */}
          <div className="deadlineCard">
            <div className="cardHeader">
              <h3>
                <Calendar size={20} />
                今後の期限
              </h3>
            </div>
            <div className="deadlineList">
              {data.upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="deadlineItem">
                  <div className="deadlineIcon">
                    <Bell size={16} />
                  </div>
                  <div className="deadlineContent">
                    <span className="deadlineTask">{deadline.task}</span>
                    <span className="deadlineDate">{deadline.dueDate}</span>
                  </div>
                  <div className={`deadlineDays ${deadline.daysLeft <= 7 ? 'urgent' : ''}`}>
                    {deadline.daysLeft}日
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="actionSection">
        <Link href="/evaluation/core-v2">
          <button className="primaryAction">
            <FileText size={20} />
            法人統一項目評価入力
          </button>
        </Link>
        <Link href="/evaluation/facility-specific">
          <button className="primaryAction">
            <FileText size={20} />
            施設特化項目評価入力
          </button>
        </Link>
        <Link href="/education">
          <button className="primaryAction">
            <BookOpen size={20} />
            研修管理
          </button>
        </Link>
        <button className="secondaryAction">
          <Download size={20} />
          CSVエクスポート
        </button>
      </div>

      <style jsx>{`
        .evaluationDashboard {
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }

        .dashboardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .headerContent h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .description {
          color: #64748b;
          font-size: 14px;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .refreshStatus {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 13px;
          color: #64748b;
        }

        .refreshButton,
        .autoRefreshToggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refreshButton:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .autoRefreshToggle.active {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .alertSection {
          margin-bottom: 24px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .alertHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .alertHeader h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .alertCount {
          padding: 2px 8px;
          background: #ef4444;
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .alertList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alertItem {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          border-left: 4px solid currentColor;
        }

        .alertIcon {
          flex-shrink: 0;
        }

        .alertContent {
          flex: 1;
        }

        .alertMain {
          display: flex;
          gap: 8px;
          margin-bottom: 4px;
        }

        .alertStaff {
          font-weight: 600;
        }

        .alertMessage {
          color: #475569;
        }

        .alertMeta {
          font-size: 12px;
          color: #64748b;
        }

        .actionButton {
          padding: 6px 12px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .actionButton:hover {
          background: #2563eb;
        }

        .mainContent {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .leftColumn,
        .rightColumn {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .progressCard,
        .departmentCard,
        .crossCheckCard,
        .deadlineCard {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .cardHeader {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .cardHeader h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .progressContent {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .progressItem {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progressHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .progressLabel {
          font-size: 14px;
          font-weight: 500;
          color: #475569;
        }

        .progressValue {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .progressBar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progressFill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progressDetail {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #64748b;
        }

        .departmentList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .departmentItem {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .departmentInfo {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .departmentName {
          font-size: 14px;
          font-weight: 500;
          color: #475569;
        }

        .departmentStats {
          font-size: 13px;
          color: #94a3b8;
        }

        .departmentProgress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .departmentProgress .progressBar {
          flex: 1;
        }

        .progressText {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          min-width: 40px;
          text-align: right;
        }

        .crossCheckList {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .crossCheckItem {
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .itemHeader {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .itemName {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .itemTraining {
          font-size: 12px;
          color: #64748b;
        }

        .itemStats {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;
        }

        .statGroup {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .statLabel {
          font-size: 12px;
          color: #64748b;
        }

        .statValue {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .itemProgress {
          margin-top: 8px;
        }

        .deadlineList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .deadlineItem {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .deadlineIcon {
          color: #64748b;
        }

        .deadlineContent {
          flex: 1;
          display: flex;
          justify-content: space-between;
        }

        .deadlineTask {
          font-size: 13px;
          color: #475569;
        }

        .deadlineDate {
          font-size: 12px;
          color: #94a3b8;
        }

        .deadlineDays {
          padding: 4px 8px;
          background: #e0f2fe;
          color: #0369a1;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .deadlineDays.urgent {
          background: #fee2e2;
          color: #dc2626;
        }

        .actionSection {
          display: flex;
          gap: 12px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .primaryAction,
        .secondaryAction {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .primaryAction {
          background: #3b82f6;
          color: white;
        }

        .primaryAction:hover {
          background: #2563eb;
        }

        .secondaryAction {
          background: white;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .secondaryAction:hover {
          background: #f8fafc;
        }

        @media (max-width: 1024px) {
          .mainContent {
            grid-template-columns: 1fr;
          }

          .actionSection {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 768px) {
          .headerActions {
            flex-direction: column;
            align-items: stretch;
          }

          .alertItem {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
    </>
  )
}