export interface ScheduledTask {
  id: string;
  name: string;
  description?: string;
  type: 'backup' | 'report' | 'sync' | 'cleanup' | 'notification' | 'custom';
  schedule: {
    type: 'once' | 'daily' | 'weekly' | 'monthly' | 'cron';
    time?: string; // HH:MM format
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
    cronExpression?: string;
  };
  config: Record<string, any>;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  history: TaskHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  status: 'success' | 'failure' | 'cancelled';
  message?: string;
  details?: Record<string, any>;
}

export interface TaskFilter {
  type?: string;
  enabled?: boolean;
  status?: string;
}

class SchedulerService {
  private readonly STORAGE_KEY = 'scheduled_tasks';
  private readonly HISTORY_KEY = 'task_history';
  private readonly MAX_HISTORY = 100;

  constructor() {
    // クライアントサイドでのみ初期化
    if (typeof window !== 'undefined') {
      // 初期化時にサンプルタスクを生成
      if (!this.getTasks().length) {
        this.generateSampleTasks();
      }
    }
  }

  getTasks(filter?: TaskFilter): ScheduledTask[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      let tasks: ScheduledTask[] = stored ? JSON.parse(stored) : [];

      if (filter) {
        if (filter.type) {
          tasks = tasks.filter(t => t.type === filter.type);
        }
        if (filter.enabled !== undefined) {
          tasks = tasks.filter(t => t.enabled === filter.enabled);
        }
        if (filter.status) {
          tasks = tasks.filter(t => t.status === filter.status);
        }
      }

      // 次回実行時刻を計算
      tasks = tasks.map(task => ({
        ...task,
        nextRun: this.calculateNextRun(task),
      }));

      return tasks;
    } catch (error) {
      console.error('Error loading scheduled tasks:', error);
      return [];
    }
  }

  getTaskById(id: string): ScheduledTask | null {
    const tasks = this.getTasks();
    return tasks.find(task => task.id === id) || null;
  }

  createTask(taskData: Omit<ScheduledTask, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'status' | 'nextRun'>): ScheduledTask {
    const tasks = this.getTasks();
    
    const newTask: ScheduledTask = {
      ...taskData,
      id: this.generateId(),
      status: 'idle',
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextRun: undefined,
    };

    newTask.nextRun = this.calculateNextRun(newTask);
    
    tasks.push(newTask);
    this.saveTasks(tasks);
    
    return newTask;
  }

  updateTask(id: string, updates: Partial<ScheduledTask>): ScheduledTask | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    tasks[index].nextRun = this.calculateNextRun(tasks[index]);
    
    this.saveTasks(tasks);
    return tasks[index];
  }

  deleteTask(id: string): boolean {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    this.saveTasks(filteredTasks);
    return true;
  }

  runTask(id: string): void {
    const task = this.getTaskById(id);
    if (!task) return;

    // タスクの実行開始
    this.updateTask(id, { 
      status: 'running',
      lastRun: new Date().toISOString(),
    });

    // 実行履歴を追加
    const historyEntry: TaskHistory = {
      id: this.generateId(),
      taskId: id,
      startTime: new Date().toISOString(),
      status: 'success',
      message: `タスク「${task.name}」を実行しました`,
    };

    // モック実行（2秒後に完了）
    setTimeout(() => {
      const tasks = this.getTasks();
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex !== -1) {
        historyEntry.endTime = new Date().toISOString();
        historyEntry.details = this.generateExecutionDetails(task.type);
        
        tasks[taskIndex].history.unshift(historyEntry);
        if (tasks[taskIndex].history.length > this.MAX_HISTORY) {
          tasks[taskIndex].history = tasks[taskIndex].history.slice(0, this.MAX_HISTORY);
        }
        
        tasks[taskIndex].status = 'completed';
        tasks[taskIndex].nextRun = this.calculateNextRun(tasks[taskIndex]);
        
        this.saveTasks(tasks);
      }
    }, 2000);
  }

  getStatistics() {
    const tasks = this.getTasks();
    
    return {
      total: tasks.length,
      enabled: tasks.filter(t => t.enabled).length,
      disabled: tasks.filter(t => !t.enabled).length,
      byType: tasks.reduce((acc, task) => {
        acc[task.type] = (acc[task.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentExecutions: tasks
        .filter(t => t.lastRun)
        .sort((a, b) => new Date(b.lastRun!).getTime() - new Date(a.lastRun!).getTime())
        .slice(0, 5),
      upcomingTasks: tasks
        .filter(t => t.enabled && t.nextRun)
        .sort((a, b) => new Date(a.nextRun!).getTime() - new Date(b.nextRun!).getTime())
        .slice(0, 5),
    };
  }

  exportTasks(): string {
    const tasks = this.getTasks();
    return JSON.stringify(tasks, null, 2);
  }

  importTasks(data: string): { success: boolean; message: string } {
    try {
      const imported = JSON.parse(data);
      if (!Array.isArray(imported)) {
        return { success: false, message: 'Invalid data format' };
      }
      
      this.saveTasks(imported);
      return { success: true, message: `${imported.length}件のタスクをインポートしました` };
    } catch (error) {
      return { success: false, message: 'データの解析に失敗しました' };
    }
  }

  private calculateNextRun(task: ScheduledTask): string | undefined {
    if (!task.enabled) return undefined;
    
    const now = new Date();
    let nextRun: Date;
    
    switch (task.schedule.type) {
      case 'once':
        // 一度だけの実行で、既に実行済みの場合はundefined
        if (task.lastRun) return undefined;
        nextRun = new Date();
        if (task.schedule.time) {
          const [hours, minutes] = task.schedule.time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);
          if (nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 1);
          }
        }
        break;
        
      case 'daily':
        nextRun = new Date();
        if (task.schedule.time) {
          const [hours, minutes] = task.schedule.time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);
          if (nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 1);
          }
        }
        break;
        
      case 'weekly':
        nextRun = new Date();
        const targetDay = task.schedule.dayOfWeek || 0;
        const currentDay = nextRun.getDay();
        const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;
        nextRun.setDate(nextRun.getDate() + daysUntilTarget);
        
        if (task.schedule.time) {
          const [hours, minutes] = task.schedule.time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);
        }
        
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 7);
        }
        break;
        
      case 'monthly':
        nextRun = new Date();
        const targetDate = task.schedule.dayOfMonth || 1;
        nextRun.setDate(targetDate);
        
        if (task.schedule.time) {
          const [hours, minutes] = task.schedule.time.split(':').map(Number);
          nextRun.setHours(hours, minutes, 0, 0);
        }
        
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1);
        }
        break;
        
      default:
        return undefined;
    }
    
    return nextRun.toISOString();
  }

  private generateExecutionDetails(type: string): Record<string, any> {
    const details: Record<string, Record<string, any>> = {
      backup: {
        filesBackedUp: Math.floor(Math.random() * 1000) + 100,
        sizeInMB: Math.floor(Math.random() * 500) + 50,
        duration: Math.floor(Math.random() * 60) + 10,
      },
      report: {
        reportsGenerated: Math.floor(Math.random() * 10) + 1,
        recipients: Math.floor(Math.random() * 20) + 5,
        format: 'PDF',
      },
      sync: {
        recordsSynced: Math.floor(Math.random() * 500) + 50,
        created: Math.floor(Math.random() * 50),
        updated: Math.floor(Math.random() * 100),
        deleted: Math.floor(Math.random() * 10),
      },
      cleanup: {
        filesDeleted: Math.floor(Math.random() * 100) + 10,
        spaceFreedMB: Math.floor(Math.random() * 1000) + 100,
      },
      notification: {
        notificationsSent: Math.floor(Math.random() * 50) + 10,
        channels: ['Email', 'Slack'],
      },
      custom: {
        executionTime: Math.floor(Math.random() * 5000) + 1000,
      },
    };
    
    return details[type] || details.custom;
  }

  private saveTasks(tasks: ScheduledTask[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSampleTasks(): void {
    const sampleTasks: Omit<ScheduledTask, 'id' | 'history' | 'createdAt' | 'updatedAt' | 'status' | 'nextRun'>[] = [
      {
        name: '日次バックアップ',
        description: 'システムデータの日次バックアップを実行',
        type: 'backup',
        schedule: {
          type: 'daily',
          time: '02:00',
        },
        config: {
          includeAttachments: true,
          compressionLevel: 'high',
          destination: '/backups/daily/',
        },
        enabled: true,
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        name: '週次レポート生成',
        description: '管理者向けの週次レポートを生成して送信',
        type: 'report',
        schedule: {
          type: 'weekly',
          dayOfWeek: 1, // Monday
          time: '09:00',
        },
        config: {
          reportType: 'weekly_summary',
          recipients: ['admin@example.com'],
          includeCharts: true,
        },
        enabled: true,
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        name: '外部システム同期',
        description: '外部システムとのデータ同期',
        type: 'sync',
        schedule: {
          type: 'daily',
          time: '06:00',
        },
        config: {
          endpoint: 'https://api.example.com/sync',
          direction: 'bidirectional',
          retryOnFailure: true,
        },
        enabled: true,
      },
      {
        name: '月次データクリーンアップ',
        description: '古いログファイルと一時ファイルの削除',
        type: 'cleanup',
        schedule: {
          type: 'monthly',
          dayOfMonth: 1,
          time: '03:00',
        },
        config: {
          olderThanDays: 90,
          includeLogFiles: true,
          includeTempFiles: true,
        },
        enabled: false,
      },
      {
        name: '評価期限通知',
        description: '評価期限が近い職員への通知',
        type: 'notification',
        schedule: {
          type: 'daily',
          time: '10:00',
        },
        config: {
          daysBeforeDeadline: 7,
          notificationMethod: 'email',
          includeManagers: true,
        },
        enabled: true,
        lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const tasks = sampleTasks.map(taskData => this.createTask(taskData));
    
    // いくつかのタスクに実行履歴を追加
    tasks.forEach((task, index) => {
      if (task.lastRun) {
        const history: TaskHistory[] = [];
        for (let i = 0; i < Math.min(5, index + 1); i++) {
          history.push({
            id: this.generateId(),
            taskId: task.id,
            startTime: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
            status: Math.random() > 0.1 ? 'success' : 'failure',
            message: Math.random() > 0.1 ? 'タスクが正常に完了しました' : 'タスクの実行に失敗しました',
            details: this.generateExecutionDetails(task.type),
          });
        }
        this.updateTask(task.id, { history });
      }
    });
  }
}

export const schedulerService = new SchedulerService();