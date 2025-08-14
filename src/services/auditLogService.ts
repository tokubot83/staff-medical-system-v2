export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  metadata?: Record<string, any>;
}

export interface AuditLogFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  category?: string;
  action?: string;
  status?: string;
  searchTerm?: string;
}

class AuditLogService {
  private readonly STORAGE_KEY = 'audit_logs';
  private readonly MAX_LOGS = 10000;

  constructor() {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined') {
      // 初期化時にサンプルログを生成
      if (!this.getLogs().length) {
        this.generateSampleLogs();
      }
    }
  }

  async log(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const logs = this.getLogs();
    
    const newLog: AuditLog = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    logs.unshift(newLog);

    // ログの上限を管理
    if (logs.length > this.MAX_LOGS) {
      logs.splice(this.MAX_LOGS);
    }

    this.saveLogs(logs);
  }

  getLogs(filter?: AuditLogFilter): AuditLog[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      let logs: AuditLog[] = stored ? JSON.parse(stored) : [];

      if (filter) {
        logs = this.filterLogs(logs, filter);
      }

      return logs;
    } catch (error) {
      console.error('Error loading audit logs:', error);
      return [];
    }
  }

  getLogById(id: string): AuditLog | null {
    const logs = this.getLogs();
    return logs.find(log => log.id === id) || null;
  }

  getCategories(): string[] {
    const logs = this.getLogs();
    const categories = new Set(logs.map(log => log.category));
    return Array.from(categories).sort();
  }

  getActions(): string[] {
    const logs = this.getLogs();
    const actions = new Set(logs.map(log => log.action));
    return Array.from(actions).sort();
  }

  getStatistics(filter?: AuditLogFilter) {
    const logs = this.getLogs(filter);
    
    const stats = {
      total: logs.length,
      byStatus: {
        success: logs.filter(l => l.status === 'success').length,
        failure: logs.filter(l => l.status === 'failure').length,
        warning: logs.filter(l => l.status === 'warning').length,
      },
      byCategory: {} as Record<string, number>,
      byAction: {} as Record<string, number>,
      byUser: {} as Record<string, number>,
      recentActivity: [] as { hour: string; count: number }[],
    };

    // カテゴリ別集計
    logs.forEach(log => {
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
      stats.byUser[log.userName] = (stats.byUser[log.userName] || 0) + 1;
    });

    // 直近24時間のアクティビティ
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourStr = hour.toISOString().slice(0, 13);
      const count = logs.filter(log => 
        log.timestamp.startsWith(hourStr)
      ).length;
      stats.recentActivity.push({ hour: hourStr, count });
    }

    return stats;
  }

  exportLogs(filter?: AuditLogFilter, format: 'json' | 'csv' = 'csv'): string {
    const logs = this.getLogs(filter);

    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }

    // CSV形式
    const headers = [
      'ID',
      'Timestamp',
      'User ID',
      'User Name',
      'Action',
      'Category',
      'Resource',
      'Resource ID',
      'Status',
      'Details',
      'IP Address',
    ];

    const rows = logs.map(log => [
      log.id,
      log.timestamp,
      log.userId,
      log.userName,
      log.action,
      log.category,
      log.resource,
      log.resourceId || '',
      log.status,
      log.details || '',
      log.ipAddress || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      ),
    ].join('\n');

    return csvContent;
  }

  clearLogs(before?: string): number {
    let logs = this.getLogs();
    const initialCount = logs.length;

    if (before) {
      const beforeDate = new Date(before);
      logs = logs.filter(log => new Date(log.timestamp) >= beforeDate);
    } else {
      logs = [];
    }

    this.saveLogs(logs);
    return initialCount - logs.length;
  }

  private filterLogs(logs: AuditLog[], filter: AuditLogFilter): AuditLog[] {
    let filtered = [...logs];

    if (filter.startDate) {
      const start = new Date(filter.startDate);
      filtered = filtered.filter(log => new Date(log.timestamp) >= start);
    }

    if (filter.endDate) {
      const end = new Date(filter.endDate);
      filtered = filtered.filter(log => new Date(log.timestamp) <= end);
    }

    if (filter.userId) {
      filtered = filtered.filter(log => log.userId === filter.userId);
    }

    if (filter.category) {
      filtered = filtered.filter(log => log.category === filter.category);
    }

    if (filter.action) {
      filtered = filtered.filter(log => log.action === filter.action);
    }

    if (filter.status) {
      filtered = filtered.filter(log => log.status === filter.status);
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.userName.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.resource.toLowerCase().includes(term) ||
        (log.details && log.details.toLowerCase().includes(term))
      );
    }

    return filtered;
  }

  private saveLogs(logs: AuditLog[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    }
  }

  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSampleLogs(): void {
    const logs: AuditLog[] = [];
    const users = [
      { id: 'U001', name: '山田太郎' },
      { id: 'U002', name: '佐藤花子' },
      { id: 'U003', name: '鈴木一郎' },
    ];

    const actions = [
      { action: 'CREATE', category: 'マスターデータ', resource: '職員マスター' },
      { action: 'UPDATE', category: 'マスターデータ', resource: '施設マスター' },
      { action: 'DELETE', category: 'マスターデータ', resource: '研修マスター' },
      { action: 'LOGIN', category: '認証', resource: 'システム' },
      { action: 'LOGOUT', category: '認証', resource: 'システム' },
      { action: 'EXPORT', category: 'データ', resource: 'バックアップ' },
      { action: 'IMPORT', category: 'データ', resource: 'リストア' },
      { action: 'APPROVE', category: '評価', resource: '評価シート' },
      { action: 'REJECT', category: '評価', resource: '評価シート' },
      { action: 'VIEW', category: 'レポート', resource: '分析レポート' },
    ];

    // 過去30日間のサンプルログを生成
    const now = new Date();
    for (let i = 0; i < 500; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const actionInfo = actions[Math.floor(Math.random() * actions.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000);
      
      const status = Math.random() > 0.9 ? 'failure' : Math.random() > 0.8 ? 'warning' : 'success';

      logs.push({
        id: this.generateId(),
        timestamp: timestamp.toISOString(),
        userId: user.id,
        userName: user.name,
        action: actionInfo.action,
        category: actionInfo.category,
        resource: actionInfo.resource,
        resourceId: Math.random() > 0.5 ? `ID${Math.floor(Math.random() * 1000)}` : undefined,
        details: this.generateDetails(actionInfo.action),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        status,
      });
    }

    // タイムスタンプでソート（新しい順）
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    this.saveLogs(logs);
  }

  private generateDetails(action: string): string {
    const details: Record<string, string[]> = {
      CREATE: ['新規レコードを作成しました', 'データを追加しました', '登録を完了しました'],
      UPDATE: ['情報を更新しました', 'データを変更しました', '編集を保存しました'],
      DELETE: ['レコードを削除しました', 'データを削除しました', '削除処理を実行しました'],
      LOGIN: ['システムにログインしました', 'ログイン成功', '認証完了'],
      LOGOUT: ['システムからログアウトしました', 'ログアウト完了', 'セッション終了'],
      EXPORT: ['データをエクスポートしました', 'バックアップを作成しました', 'ダウンロード完了'],
      IMPORT: ['データをインポートしました', 'リストアを実行しました', 'アップロード完了'],
      APPROVE: ['承認しました', '承認処理完了', 'ステータスを承認済みに変更'],
      REJECT: ['却下しました', '却下処理完了', 'ステータスを却下に変更'],
      VIEW: ['閲覧しました', 'アクセスしました', '表示しました'],
    };

    const options = details[action] || ['操作を実行しました'];
    return options[Math.floor(Math.random() * options.length)];
  }
}

export const auditLogService = new AuditLogService();