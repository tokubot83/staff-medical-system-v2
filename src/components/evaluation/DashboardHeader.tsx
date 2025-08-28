'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  RefreshCw, 
  Activity,
  CircleAlert,
  BookOpen,
  FileText,
  Calendar,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import styles from './DashboardHeader.module.css';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  icon: 'training' | 'evaluation' | 'deadline';
  staffName: string;
  message: string;
  dueDate?: string;
  actionLink: string;
  actionLabel: string;
}

interface DashboardHeaderProps {
  title: string;
  description: string;
  onRefresh?: () => void;
}

export default function DashboardHeader({ title, description, onRefresh }: DashboardHeaderProps) {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'error',
      icon: 'evaluation',
      staffName: '鈴木花子',
      message: '本人評価が未入力',
      dueDate: '2025-08-25',
      actionLink: '/evaluation-execution/dynamic/EMP002',
      actionLabel: '評価入力'
    },
    {
      id: '2',
      type: 'warning',
      icon: 'training',
      staffName: '山田太郎',
      message: '感染対策研修（2回目）未受講',
      dueDate: '2025-08-20',
      actionLink: '/education',
      actionLabel: '研修登録'
    },
    {
      id: '3',
      type: 'error',
      icon: 'deadline',
      staffName: '全職員',
      message: '上期評価締切まであと5日',
      dueDate: '2025-08-17',
      actionLink: '/evaluation-execution',
      actionLabel: '確認'
    }
  ]);

  // 自動更新
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      if (onRefresh) onRefresh();
    }, 30000); // 30秒ごと

    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    if (onRefresh) onRefresh();
  };

  const getAlertIcon = (icon: string) => {
    switch (icon) {
      case 'training':
        return <BookOpen className="w-[18px] h-[18px]" />;
      case 'evaluation':
        return <FileText className="w-[18px] h-[18px]" />;
      case 'deadline':
        return <Calendar className="w-[18px] h-[18px]" />;
      default:
        return <CircleAlert className="w-[18px] h-[18px]" />;
    }
  };

  const getAlertClassName = (type: string) => {
    switch (type) {
      case 'error':
        return `${styles.alertItem} text-red-600 bg-red-50`;
      case 'warning':
        return `${styles.alertItem} text-yellow-600 bg-yellow-50`;
      default:
        return `${styles.alertItem} text-blue-600 bg-blue-50`;
    }
  };

  return (
    <>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h2>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.refreshStatus}>
            <Clock className="w-4 h-4" />
            <span>最終更新: {lastUpdated.toLocaleTimeString('ja-JP')}</span>
          </div>
          <button className={styles.refreshButton} onClick={handleRefresh}>
            <RefreshCw className="w-[18px] h-[18px]" />
            更新
          </button>
          <button 
            className={`${styles.autoRefreshToggle} ${autoRefresh ? styles.active : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="w-[18px] h-[18px]" />
            自動更新{autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className={styles.alertSection}>
          <div className={styles.alertHeader}>
            <CircleAlert className="w-5 h-5" />
            <h3>要対応事項</h3>
            <span className={styles.alertCount}>{alerts.length}件</span>
          </div>
          <div className={styles.alertList}>
            {alerts.map(alert => (
              <div key={alert.id} className={getAlertClassName(alert.type)}>
                <div className={styles.alertIcon}>
                  {getAlertIcon(alert.icon)}
                </div>
                <div className={styles.alertContent}>
                  <div className={styles.alertMain}>
                    <span className={styles.alertStaff}>{alert.staffName}</span>
                    <span className={styles.alertMessage}>{alert.message}</span>
                  </div>
                  {alert.dueDate && (
                    <div className={styles.alertMeta}>
                      <span className={styles.alertDue}>期限: {alert.dueDate}</span>
                    </div>
                  )}
                </div>
                <div className={styles.alertAction}>
                  <Link href={alert.actionLink}>
                    <button className={styles.actionButton}>
                      {alert.actionLabel}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}