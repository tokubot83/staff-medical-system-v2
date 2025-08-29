// システム統合サービス - 評価管理と教育研修管理の連携を統合管理
export interface TaskSyncState {
  evaluationTasks: Record<string, boolean>;
  trainingTasks: Record<string, boolean>;
  lastSync: Date;
}

export interface CrossSystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  priority: 'high' | 'medium' | 'low';
  message: string;
  affectedSystems: ('evaluation' | 'training')[];
  actionRequired: boolean;
  month?: number;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface MonthlyIntegrationStatus {
  month: number;
  evaluationTasksCompleted: number;
  evaluationTasksTotal: number;
  trainingTasksCompleted: number;
  trainingTasksTotal: number;
  syncRate: number;
  criticalAlerts: number;
  status: 'on-track' | 'attention-needed' | 'critical';
}

export interface AnnualIntegrationSummary {
  totalSyncRate: number;
  alertResolutionRate: number;
  preEvaluationTrainingCompletionRate: number;
  monthlyStatuses: MonthlyIntegrationStatus[];
  activeAlerts: CrossSystemAlert[];
  recentSyncActivities: Array<{
    timestamp: Date;
    source: 'evaluation' | 'training';
    action: string;
    taskId: string;
  }>;
}

class SystemIntegrationService {
  private static taskSyncState: TaskSyncState = {
    evaluationTasks: {},
    trainingTasks: {},
    lastSync: new Date()
  };

  private static activeAlerts: CrossSystemAlert[] = [
    {
      id: 'alert-1',
      type: 'warning',
      priority: 'high',
      message: '3月15日評価実施前に25名の医療安全研修が未完了です',
      affectedSystems: ['evaluation', 'training'],
      actionRequired: true,
      month: 3,
      createdAt: new Date('2025-08-25'),
    },
    {
      id: 'alert-2',
      type: 'info',
      priority: 'medium',
      message: '6月夏季貢献度評価のデータ収集が2施設で待機中です',
      affectedSystems: ['evaluation'],
      actionRequired: true,
      month: 6,
      createdAt: new Date('2025-08-26'),
    },
    {
      id: 'alert-3',
      type: 'warning',
      priority: 'medium',
      message: '12月評価前の必須研修完了期限が近づいています',
      affectedSystems: ['training', 'evaluation'],
      actionRequired: true,
      month: 12,
      createdAt: new Date('2025-08-20'),
    },
    {
      id: 'alert-4',
      type: 'error',
      priority: 'high',
      message: '年間研修ROI分析で目標値を下回る見込みです',
      affectedSystems: ['training'],
      actionRequired: true,
      month: 12,
      createdAt: new Date('2025-08-27'),
    }
  ];

  private static recentSyncActivities = [
    {
      timestamp: new Date('2025-08-29T10:30:00'),
      source: 'training' as const,
      action: '医療安全研修完了者データを評価システムに同期',
      taskId: 'training-safety-aug'
    },
    {
      timestamp: new Date('2025-08-29T09:15:00'),
      source: 'evaluation' as const,
      action: '夏季貢献度評価結果を研修計画に反映',
      taskId: 'evaluation-summer-contribution'
    },
    {
      timestamp: new Date('2025-08-28T16:45:00'),
      source: 'training' as const,
      action: '第2四半期研修効果分析完了',
      taskId: 'training-q2-analysis'
    }
  ];

  // タスク完了状態の同期
  static syncTaskCompletion(taskId: string, system: 'evaluation' | 'training', completed: boolean): void {
    if (system === 'evaluation') {
      this.taskSyncState.evaluationTasks[taskId] = completed;
    } else {
      this.taskSyncState.trainingTasks[taskId] = completed;
    }
    
    this.taskSyncState.lastSync = new Date();
    
    // 連動ルールの適用
    this.applySyncRules(taskId, system, completed);
    
    // 関連アラートの更新
    this.updateRelatedAlerts(taskId, system, completed);
  }

  // 連動ルールの適用
  private static applySyncRules(taskId: string, system: 'evaluation' | 'training', completed: boolean): void {
    // 評価シート配布完了 → 研修要件確認を自動完了
    if (system === 'evaluation' && taskId === 'evaluation-sheet-distribution' && completed) {
      this.taskSyncState.trainingTasks['training-requirement-check'] = true;
    }
    
    // 必須研修完了確認 → 評価実施準備完了
    if (system === 'training' && taskId === 'mandatory-training-completion' && completed) {
      this.taskSyncState.evaluationTasks['evaluation-readiness'] = true;
    }
    
    // 研修効果分析完了 → 評価結果への反映準備
    if (system === 'training' && taskId === 'training-effect-analysis' && completed) {
      this.taskSyncState.evaluationTasks['training-effect-integration'] = true;
    }
  }

  // 関連アラートの更新
  private static updateRelatedAlerts(taskId: string, system: 'evaluation' | 'training', completed: boolean): void {
    if (completed) {
      // タスク完了によりアラートを解決
      this.activeAlerts = this.activeAlerts.map(alert => {
        if (this.isAlertResolvedByTask(alert, taskId, system)) {
          return { ...alert, resolvedAt: new Date() };
        }
        return alert;
      });
    }
  }

  private static isAlertResolvedByTask(alert: CrossSystemAlert, taskId: string, system: 'evaluation' | 'training'): boolean {
    // 必須研修未完了アラートは研修完了で解決
    if (alert.id === 'alert-1' && system === 'training' && taskId === 'mandatory-training-completion') {
      return true;
    }
    
    // データ収集待機は評価データ収集で解決
    if (alert.id === 'alert-2' && system === 'evaluation' && taskId === 'evaluation-data-collection') {
      return true;
    }
    
    return false;
  }

  // アクティブなアラートを取得
  static getActiveAlerts(): CrossSystemAlert[] {
    return this.activeAlerts.filter(alert => !alert.resolvedAt);
  }

  // 特定システムのアラートを取得
  static getAlertsForSystem(system: 'evaluation' | 'training'): CrossSystemAlert[] {
    return this.getActiveAlerts().filter(alert => 
      alert.affectedSystems.includes(system)
    );
  }

  // 特定月のアラートを取得
  static getAlertsForMonth(month: number): CrossSystemAlert[] {
    return this.getActiveAlerts().filter(alert => alert.month === month);
  }

  // タスク完了状態を取得
  static getTaskCompletionStatus(taskId: string, system: 'evaluation' | 'training'): boolean {
    if (system === 'evaluation') {
      return this.taskSyncState.evaluationTasks[taskId] || false;
    } else {
      return this.taskSyncState.trainingTasks[taskId] || false;
    }
  }

  // 年間統合サマリーを取得
  static getAnnualIntegrationSummary(): AnnualIntegrationSummary {
    const monthlyStatuses: MonthlyIntegrationStatus[] = [];
    
    for (let month = 1; month <= 12; month++) {
      const evaluationTasksTotal = this.getMonthlyTaskCount(month, 'evaluation');
      const trainingTasksTotal = this.getMonthlyTaskCount(month, 'training');
      const evaluationTasksCompleted = this.getCompletedTaskCount(month, 'evaluation');
      const trainingTasksCompleted = this.getCompletedTaskCount(month, 'training');
      
      const totalTasks = evaluationTasksTotal + trainingTasksTotal;
      const completedTasks = evaluationTasksCompleted + trainingTasksCompleted;
      const syncRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;
      
      const criticalAlerts = this.getAlertsForMonth(month).filter(a => a.priority === 'high').length;
      
      let status: 'on-track' | 'attention-needed' | 'critical' = 'on-track';
      if (criticalAlerts > 0 || syncRate < 70) {
        status = 'critical';
      } else if (syncRate < 85) {
        status = 'attention-needed';
      }
      
      monthlyStatuses.push({
        month,
        evaluationTasksCompleted,
        evaluationTasksTotal,
        trainingTasksCompleted,
        trainingTasksTotal,
        syncRate,
        criticalAlerts,
        status
      });
    }

    const totalSyncRate = Math.round(
      monthlyStatuses.reduce((sum, status) => sum + status.syncRate, 0) / 12
    );

    const resolvedAlerts = this.activeAlerts.filter(a => a.resolvedAt).length;
    const totalAlerts = this.activeAlerts.length;
    const alertResolutionRate = totalAlerts > 0 ? Math.round((resolvedAlerts / totalAlerts) * 100) : 100;

    return {
      totalSyncRate,
      alertResolutionRate,
      preEvaluationTrainingCompletionRate: 89.2,
      monthlyStatuses,
      activeAlerts: this.getActiveAlerts(),
      recentSyncActivities: this.recentSyncActivities
    };
  }

  private static getMonthlyTaskCount(month: number, system: 'evaluation' | 'training'): number {
    // 実際の実装では各月のタスク数を動的に計算
    const taskCounts = {
      1: { evaluation: 4, training: 6 },
      3: { evaluation: 8, training: 5 },
      6: { evaluation: 4, training: 4 },
      8: { evaluation: 2, training: 6 },
      12: { evaluation: 6, training: 5 }
    };
    
    return taskCounts[month as keyof typeof taskCounts]?.[system] || 2;
  }

  private static getCompletedTaskCount(month: number, system: 'evaluation' | 'training'): number {
    // 現在月より前は完了、現在月は進行中、未来月は未着手として計算
    const currentMonth = new Date().getMonth() + 1;
    const totalTasks = this.getMonthlyTaskCount(month, system);
    
    if (month < currentMonth) {
      return totalTasks; // 過去月は100%完了
    } else if (month === currentMonth) {
      return Math.floor(totalTasks * 0.7); // 現在月は70%完了
    } else {
      return 0; // 未来月は0%完了
    }
  }

  // アラートを手動で解決
  static resolveAlert(alertId: string): void {
    this.activeAlerts = this.activeAlerts.map(alert => {
      if (alert.id === alertId) {
        return { ...alert, resolvedAt: new Date() };
      }
      return alert;
    });
  }

  // 新しいアラートを追加
  static addAlert(alert: Omit<CrossSystemAlert, 'id' | 'createdAt'>): void {
    const newAlert: CrossSystemAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date()
    };
    
    this.activeAlerts.push(newAlert);
  }

  // 最近の同期アクティビティを追加
  static addSyncActivity(source: 'evaluation' | 'training', action: string, taskId: string): void {
    this.recentSyncActivities.unshift({
      timestamp: new Date(),
      source,
      action,
      taskId
    });
    
    // 最新50件まで保持
    if (this.recentSyncActivities.length > 50) {
      this.recentSyncActivities = this.recentSyncActivities.slice(0, 50);
    }
  }
}

export default SystemIntegrationService;