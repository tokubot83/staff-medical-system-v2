import { masterDataService } from './masterDataService';

export interface BackupMetadata {
  id: string;
  name: string;
  createdAt: string;
  createdBy?: string;
  size: number;
  dataTypes: string[];
  version: string;
  description?: string;
  isScheduled: boolean;
}

export interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  dataTypes: string[];
  retentionDays: number;
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
}

export interface BackupData {
  metadata: BackupMetadata;
  data: {
    [key: string]: any;
  };
}

export interface RestoreResult {
  success: boolean;
  restoredTypes: string[];
  recordCounts: {
    [key: string]: number;
  };
  errors?: string[];
}

class BackupService {
  private readonly BACKUP_KEY = 'backup_history';
  private readonly SCHEDULE_KEY = 'backup_schedules';
  private readonly VERSION = '1.0.0';

  // データタイプの定義
  private readonly dataTypes = [
    { key: 'master_staff', label: '職員マスター', service: 'master' },
    { key: 'master_facility', label: '施設マスター', service: 'master' },
    { key: 'master_training', label: '研修マスター', service: 'master' },
    { key: 'master_evaluationItem', label: '評価項目マスター', service: 'master' },
    { key: 'evaluations', label: '評価データ', service: 'evaluation' },
    { key: 'interviews', label: '面談データ', service: 'interview' },
    { key: 'training_records', label: '研修記録', service: 'training' },
    { key: 'notifications', label: '通知データ', service: 'notification' },
  ];

  async createBackup(
    name: string, 
    dataTypes: string[], 
    description?: string,
    isScheduled: boolean = false
  ): Promise<BackupData> {
    const backupData: BackupData = {
      metadata: {
        id: this.generateId(),
        name,
        createdAt: new Date().toISOString(),
        createdBy: 'system', // 実際の実装では認証ユーザー情報を使用
        size: 0,
        dataTypes,
        version: this.VERSION,
        description,
        isScheduled,
      },
      data: {},
    };

    // 各データタイプのデータを収集
    for (const type of dataTypes) {
      const dataType = this.dataTypes.find(dt => dt.key === type);
      if (!dataType) continue;

      if (dataType.service === 'master') {
        // マスターデータのバックアップ
        const masterType = type.replace('master_', '');
        const records = await masterDataService.getAll(masterType);
        backupData.data[type] = records;
      } else {
        // その他のデータ（実際の実装では各サービスから取得）
        backupData.data[type] = this.getMockData(type);
      }
    }

    // バックアップサイズの計算
    const dataStr = JSON.stringify(backupData.data);
    backupData.metadata.size = new Blob([dataStr]).size;

    // バックアップ履歴に保存
    this.saveBackupHistory(backupData.metadata);

    return backupData;
  }

  async restoreBackup(backupData: BackupData): Promise<RestoreResult> {
    const result: RestoreResult = {
      success: true,
      restoredTypes: [],
      recordCounts: {},
      errors: [],
    };

    try {
      // バージョンチェック
      if (backupData.metadata.version !== this.VERSION) {
        // バージョン移行処理（必要に応じて）
        console.warn(`Backup version mismatch: ${backupData.metadata.version} vs ${this.VERSION}`);
      }

      // 各データタイプを復元
      for (const [type, data] of Object.entries(backupData.data)) {
        try {
          const dataType = this.dataTypes.find(dt => dt.key === type);
          if (!dataType) {
            result.errors?.push(`Unknown data type: ${type}`);
            continue;
          }

          if (dataType.service === 'master') {
            // マスターデータの復元
            const masterType = type.replace('master_', '');
            const importResult = await masterDataService.importData(masterType, data, 'replace');
            
            if (importResult.success) {
              result.restoredTypes.push(type);
              result.recordCounts[type] = importResult.successCount;
            } else {
              result.errors?.push(`Failed to restore ${type}: ${importResult.errors?.length} errors`);
            }
          } else {
            // その他のデータの復元（実際の実装では各サービスで処理）
            this.restoreMockData(type, data);
            result.restoredTypes.push(type);
            result.recordCounts[type] = Array.isArray(data) ? data.length : 0;
          }
        } catch (error) {
          result.errors?.push(`Error restoring ${type}: ${error}`);
          result.success = false;
        }
      }
    } catch (error) {
      result.success = false;
      result.errors?.push(`Restore failed: ${error}`);
    }

    return result;
  }

  async downloadBackup(backupData: BackupData, format: 'json' | 'csv' = 'json'): Promise<void> {
    if (format === 'json') {
      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${backupData.metadata.name}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV形式（各データタイプごとに個別のCSVファイルとして出力）
      for (const [type, data] of Object.entries(backupData.data)) {
        if (!Array.isArray(data) || data.length === 0) continue;
        
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${type}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }

  async uploadBackup(file: File): Promise<BackupData | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const backupData: BackupData = JSON.parse(content);
          
          // バックアップデータの検証
          if (!backupData.metadata || !backupData.data) {
            throw new Error('Invalid backup file format');
          }
          
          resolve(backupData);
        } catch (error) {
          console.error('Failed to parse backup file:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  // スケジュール管理
  async createSchedule(schedule: Omit<BackupSchedule, 'id' | 'lastRun' | 'nextRun'>): Promise<BackupSchedule> {
    const newSchedule: BackupSchedule = {
      ...schedule,
      id: this.generateId(),
      nextRun: this.calculateNextRun(schedule),
    };

    const schedules = this.getSchedules();
    schedules.push(newSchedule);
    this.saveSchedules(schedules);

    // 実際の実装では、ここでcron jobやsetIntervalを設定
    this.scheduleBackup(newSchedule);

    return newSchedule;
  }

  async updateSchedule(id: string, updates: Partial<BackupSchedule>): Promise<BackupSchedule | null> {
    const schedules = this.getSchedules();
    const index = schedules.findIndex(s => s.id === id);
    
    if (index === -1) return null;
    
    schedules[index] = {
      ...schedules[index],
      ...updates,
      nextRun: this.calculateNextRun({ ...schedules[index], ...updates }),
    };
    
    this.saveSchedules(schedules);
    return schedules[index];
  }

  async deleteSchedule(id: string): Promise<boolean> {
    const schedules = this.getSchedules();
    const filtered = schedules.filter(s => s.id !== id);
    
    if (filtered.length === schedules.length) return false;
    
    this.saveSchedules(filtered);
    return true;
  }

  getSchedules(): BackupSchedule[] {
    try {
      const stored = localStorage.getItem(this.SCHEDULE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // バックアップ履歴管理
  getBackupHistory(): BackupMetadata[] {
    try {
      const stored = localStorage.getItem(this.BACKUP_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  deleteBackupHistory(id: string): boolean {
    const history = this.getBackupHistory();
    const filtered = history.filter(h => h.id !== id);
    
    if (filtered.length === history.length) return false;
    
    localStorage.setItem(this.BACKUP_KEY, JSON.stringify(filtered));
    return true;
  }

  getAvailableDataTypes() {
    return this.dataTypes;
  }

  // Private methods
  private saveBackupHistory(metadata: BackupMetadata): void {
    const history = this.getBackupHistory();
    history.unshift(metadata); // 新しいものを先頭に
    
    // 履歴の上限を100件に制限
    if (history.length > 100) {
      history.splice(100);
    }
    
    localStorage.setItem(this.BACKUP_KEY, JSON.stringify(history));
  }

  private saveSchedules(schedules: BackupSchedule[]): void {
    localStorage.setItem(this.SCHEDULE_KEY, JSON.stringify(schedules));
  }

  private scheduleBackup(schedule: BackupSchedule): void {
    // 実際の実装では、ここでcron jobやsetIntervalを設定
    // 簡易実装として、次回実行時刻をチェックする処理を追加
    console.log('Backup scheduled:', schedule);
  }

  private calculateNextRun(schedule: Partial<BackupSchedule>): string {
    const now = new Date();
    const [hours, minutes] = (schedule.time || '00:00').split(':').map(Number);
    
    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    // 今日の実行時刻を過ぎている場合は次の実行日に設定
    if (nextRun <= now) {
      switch (schedule.frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          if (schedule.dayOfMonth) {
            nextRun.setDate(schedule.dayOfMonth);
          }
          break;
      }
    }
    
    return nextRun.toISOString();
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    // Extract headers from the first object
    const headers = Object.keys(data[0].data || data[0]);
    const csvHeaders = headers.join(',');
    
    // Convert each object to CSV row
    const csvRows = data.map(item => {
      const obj = item.data || item;
      return headers.map(header => {
        const value = obj[header];
        if (value == null) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value.toString();
      }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  }

  private getMockData(type: string): any[] {
    // モックデータの生成（実際の実装では各サービスから取得）
    switch (type) {
      case 'evaluations':
        return [
          { id: '1', staffId: 'E001', score: 85, date: '2025-08-01' },
          { id: '2', staffId: 'E002', score: 92, date: '2025-08-01' },
        ];
      case 'interviews':
        return [
          { id: '1', staffId: 'E001', date: '2025-08-05', type: '定期面談' },
          { id: '2', staffId: 'E002', date: '2025-08-06', type: '定期面談' },
        ];
      case 'training_records':
        return [
          { id: '1', trainingId: 'T001', staffId: 'E001', completed: true },
          { id: '2', trainingId: 'T001', staffId: 'E002', completed: false },
        ];
      case 'notifications':
        return [
          { id: '1', type: 'info', message: 'システムメンテナンスのお知らせ' },
        ];
      default:
        return [];
    }
  }

  private restoreMockData(type: string, data: any[]): void {
    // モックデータの復元（実際の実装では各サービスで処理）
    console.log(`Restoring ${type}:`, data);
    // LocalStorageなどに保存
    localStorage.setItem(`restored_${type}`, JSON.stringify(data));
  }

  // 定期実行チェック（実際の実装ではサーバーサイドで処理）
  async checkAndExecuteScheduledBackups(): Promise<void> {
    const schedules = this.getSchedules();
    const now = new Date();
    
    for (const schedule of schedules) {
      if (!schedule.isActive || !schedule.nextRun) continue;
      
      const nextRunTime = new Date(schedule.nextRun);
      if (nextRunTime <= now) {
        // バックアップを実行
        await this.createBackup(
          `Scheduled: ${schedule.name}`,
          schedule.dataTypes,
          `Automatic backup created by schedule: ${schedule.name}`,
          true
        );
        
        // 次回実行時刻を更新
        await this.updateSchedule(schedule.id, {
          lastRun: now.toISOString(),
          nextRun: this.calculateNextRun(schedule),
        });
      }
    }
  }
}

export const backupService = new BackupService();