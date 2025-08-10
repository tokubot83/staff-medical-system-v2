'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface LogEntry {
  timestamp: string;
  method: string;
  endpoint: string;
  request: any;
  response: any;
  source: string;
}

interface LogStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  byInterviewType: Record<string, number>;
  byMethod: Record<string, number>;
}

export default function IntegrationMonitorPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/interviews/logs?limit=100&filter=${filter}`);
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 5000); // 5秒ごとに更新
      return () => clearInterval(interval);
    }
  }, [autoRefresh, filter]);

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <span className={styles.successBadge}>成功</span>
    ) : (
      <span className={styles.errorBadge}>失敗</span>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ja-JP');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🔄 VoiceDrive統合テスト モニター</h1>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="フィルター（例: career_support）"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterInput}
          />
          <button
            onClick={fetchLogs}
            className={styles.refreshButton}
            disabled={loading}
          >
            {loading ? '更新中...' : '手動更新'}
          </button>
          <label className={styles.autoRefreshLabel}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            自動更新（5秒）
          </label>
        </div>
      </div>

      {stats && (
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalRequests}</div>
            <div className={styles.statLabel}>総リクエスト</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#22c55e' }}>
              {stats.successfulRequests}
            </div>
            <div className={styles.statLabel}>成功</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: '#ef4444' }}>
              {stats.failedRequests}
            </div>
            <div className={styles.statLabel}>失敗</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)}%
            </div>
            <div className={styles.statLabel}>成功率</div>
          </div>
        </div>
      )}

      {stats?.byInterviewType && Object.keys(stats.byInterviewType).length > 0 && (
        <div className={styles.typeStats}>
          <h3>面談種別ごとのリクエスト数</h3>
          <div className={styles.typeGrid}>
            {Object.entries(stats.byInterviewType).map(([type, count]) => (
              <div key={type} className={styles.typeItem}>
                <span className={styles.typeName}>{type}</span>
                <span className={styles.typeCount}>{count}件</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.logsContainer}>
        <h2>📋 最新のAPIリクエスト</h2>
        {logs.length === 0 ? (
          <div className={styles.noLogs}>
            まだリクエストがありません。VoiceDriveからのテストリクエストを待機中...
          </div>
        ) : (
          <div className={styles.logsList}>
            {logs.map((log, index) => (
              <div key={index} className={styles.logEntry}>
                <div className={styles.logHeader}>
                  <span className={styles.timestamp}>
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span className={styles.method}>{log.method}</span>
                  {getStatusBadge(log.response?.success)}
                </div>
                <div className={styles.logBody}>
                  <div className={styles.logSection}>
                    <strong>リクエスト:</strong>
                    {log.request && (
                      <pre className={styles.jsonCode}>
                        {JSON.stringify(log.request, null, 2)}
                      </pre>
                    )}
                  </div>
                  <div className={styles.logSection}>
                    <strong>レスポンス:</strong>
                    <pre className={styles.jsonCode}>
                      {JSON.stringify(log.response, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3>📌 テストエンドポイント</h3>
        <code>POST /api/v1/interviews/bookings/mock</code>
        <br />
        <code>GET /api/v1/interviews/bookings/mock</code>
        <br />
        <code>DELETE /api/v1/interviews/bookings/mock</code>
      </div>
    </div>
  );
}