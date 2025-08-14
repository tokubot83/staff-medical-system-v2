/**
 * バックアップ・復元サービス
 * システムデータの完全バックアップと復元機能を提供
 */

import { exportToJSON } from '../export/exportUtils';
import { importFromJSON, ImportResult } from '../import/importUtils';

export interface BackupData {
  metadata: BackupMetadata;
  masterData: MasterDataBackup;
  evaluationData: EvaluationDataBackup;
  systemConfig: SystemConfigBackup;
}

export interface BackupMetadata {
  version: string;
  createdAt: string;
  createdBy: string;
  description: string;
  systemVersion: string;
  dataTypes: string[];
  recordCounts: Record<string, number>;
}

export interface MasterDataBackup {
  staff: any[];
  facility: any[];
  training: any[];
  evaluationItem: any[];
}

export interface EvaluationDataBackup {
  evaluations: any[];
  interviews: any[];
  goals: any[];
}

export interface SystemConfigBackup {
  settings: any;
  permissions: any[];
  workflows: any[];
}

export interface RestoreOptions {
  skipValidation?: boolean;
  overwriteExisting?: boolean;
  backupBeforeRestore?: boolean;
  selectedDataTypes?: string[];
}

export interface RestoreResult {
  success: boolean;
  restored: Record<string, number>;
  errors: string[];
  warnings: string[];
  backupCreated?: string;
}

/**
 * バックアップサービスクラス
 */
export class BackupService {
  private readonly BACKUP_VERSION = '1.0';
  
  /**
   * 完全バックアップの作成
   */
  async createFullBackup(
    description: string = '定期バックアップ',
    createdBy: string = 'システム'
  ): Promise<string> {
    try {
      // マスターデータの取得
      const masterData: MasterDataBackup = {
        staff: this.getAllStaffData(),
        facility: this.getAllFacilityData(),
        training: this.getAllTrainingData(),
        evaluationItem: this.getAllEvaluationItemData()
      };

      // 評価データの取得
      const evaluationData: EvaluationDataBackup = {
        evaluations: this.getAllEvaluationData(),
        interviews: this.getAllInterviewData(),
        goals: this.getAllGoalData()
      };

      // システム設定の取得
      const systemConfig: SystemConfigBackup = {
        settings: this.getSystemSettings(),
        permissions: this.getPermissionData(),
        workflows: this.getWorkflowData()
      };

      // メタデータの作成
      const metadata: BackupMetadata = {
        version: this.BACKUP_VERSION,
        createdAt: new Date().toISOString(),
        createdBy,
        description,
        systemVersion: this.getSystemVersion(),
        dataTypes: ['masterData', 'evaluationData', 'systemConfig'],
        recordCounts: {
          staff: masterData.staff.length,
          facility: masterData.facility.length,
          training: masterData.training.length,
          evaluationItem: masterData.evaluationItem.length,
          evaluations: evaluationData.evaluations.length,
          interviews: evaluationData.interviews.length,
          goals: evaluationData.goals.length
        }
      };

      // バックアップデータの組み立て
      const backupData: BackupData = {
        metadata,
        masterData,
        evaluationData,
        systemConfig
      };

      // ファイル名生成
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `staff-system-backup-${timestamp}.json`;

      // JSONエクスポート
      const result = exportToJSON(backupData, filename);
      
      if (result.success) {
        // バックアップ履歴に記録
        this.recordBackupHistory(metadata, filename);
        return filename;
      } else {
        throw new Error('バックアップファイルの作成に失敗しました');
      }
    } catch (error) {
      throw new Error(`バックアップ作成エラー: ${error}`);
    }
  }

  /**
   * 部分バックアップの作成
   */
  async createPartialBackup(
    dataTypes: string[],
    description: string = '部分バックアップ',
    createdBy: string = 'システム'
  ): Promise<string> {
    try {
      const backupData: Partial<BackupData> = {
        metadata: {
          version: this.BACKUP_VERSION,
          createdAt: new Date().toISOString(),
          createdBy,
          description,
          systemVersion: this.getSystemVersion(),
          dataTypes,
          recordCounts: {}
        }
      };

      // 選択されたデータタイプのみバックアップ
      if (dataTypes.includes('masterData')) {
        backupData.masterData = {
          staff: this.getAllStaffData(),
          facility: this.getAllFacilityData(),
          training: this.getAllTrainingData(),
          evaluationItem: this.getAllEvaluationItemData()
        };
        backupData.metadata!.recordCounts = {
          ...backupData.metadata!.recordCounts,
          staff: backupData.masterData.staff.length,
          facility: backupData.masterData.facility.length,
          training: backupData.masterData.training.length,
          evaluationItem: backupData.masterData.evaluationItem.length
        };
      }

      if (dataTypes.includes('evaluationData')) {
        backupData.evaluationData = {
          evaluations: this.getAllEvaluationData(),
          interviews: this.getAllInterviewData(),
          goals: this.getAllGoalData()
        };
        backupData.metadata!.recordCounts = {
          ...backupData.metadata!.recordCounts,
          evaluations: backupData.evaluationData.evaluations.length,
          interviews: backupData.evaluationData.interviews.length,
          goals: backupData.evaluationData.goals.length
        };
      }

      if (dataTypes.includes('systemConfig')) {
        backupData.systemConfig = {
          settings: this.getSystemSettings(),
          permissions: this.getPermissionData(),
          workflows: this.getWorkflowData()
        };
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `staff-system-partial-backup-${timestamp}.json`;

      const result = exportToJSON(backupData, filename);
      
      if (result.success) {
        this.recordBackupHistory(backupData.metadata!, filename);
        return filename;
      } else {
        throw new Error('部分バックアップファイルの作成に失敗しました');
      }
    } catch (error) {
      throw new Error(`部分バックアップ作成エラー: ${error}`);
    }
  }

  /**
   * バックアップからの復元
   */
  async restoreFromBackup(
    file: File,
    options: RestoreOptions = {}
  ): Promise<RestoreResult> {
    const {
      skipValidation = false,
      overwriteExisting = false,
      backupBeforeRestore = true,
      selectedDataTypes
    } = options;

    try {
      // 復元前にバックアップを作成
      let backupCreated: string | undefined;
      if (backupBeforeRestore) {
        backupCreated = await this.createFullBackup(
          '復元前自動バックアップ',
          'システム（復元処理）'
        );
      }

      // バックアップファイルの読み込み
      const importResult: ImportResult<BackupData> = await importFromJSON(file);
      
      if (!importResult.success) {
        throw new Error(`バックアップファイル読み込みエラー: ${importResult.errors[0]?.message}`);
      }

      const backupData = importResult.data[0] as BackupData;

      // バックアップファイルの検証
      if (!skipValidation) {
        this.validateBackupData(backupData);
      }

      const restored: Record<string, number> = {};
      const errors: string[] = [];
      const warnings: string[] = [];

      // データタイプのフィルタリング
      const dataTypesToRestore = selectedDataTypes || backupData.metadata.dataTypes;

      // マスターデータの復元
      if (dataTypesToRestore.includes('masterData') && backupData.masterData) {
        try {
          const masterResult = await this.restoreMasterData(
            backupData.masterData,
            overwriteExisting
          );
          Object.assign(restored, masterResult.restored);
          errors.push(...masterResult.errors);
          warnings.push(...masterResult.warnings);
        } catch (error) {
          errors.push(`マスターデータ復元エラー: ${error}`);
        }
      }

      // 評価データの復元
      if (dataTypesToRestore.includes('evaluationData') && backupData.evaluationData) {
        try {
          const evalResult = await this.restoreEvaluationData(
            backupData.evaluationData,
            overwriteExisting
          );
          Object.assign(restored, evalResult.restored);
          errors.push(...evalResult.errors);
          warnings.push(...evalResult.warnings);
        } catch (error) {
          errors.push(`評価データ復元エラー: ${error}`);
        }
      }

      // システム設定の復元
      if (dataTypesToRestore.includes('systemConfig') && backupData.systemConfig) {
        try {
          const configResult = await this.restoreSystemConfig(
            backupData.systemConfig,
            overwriteExisting
          );
          Object.assign(restored, configResult.restored);
          errors.push(...configResult.errors);
          warnings.push(...configResult.warnings);
        } catch (error) {
          errors.push(`システム設定復元エラー: ${error}`);
        }
      }

      return {
        success: errors.length === 0,
        restored,
        errors,
        warnings,
        backupCreated
      };

    } catch (error) {
      return {
        success: false,
        restored: {},
        errors: [`復元処理エラー: ${error}`],
        warnings: []
      };
    }
  }

  // プライベートメソッド（実際のデータ取得・保存処理）
  private getAllStaffData(): any[] {
    // LocalStorageまたはIndexedDBからデータ取得
    const data = localStorage.getItem('staff-master');
    return data ? JSON.parse(data) : [];
  }

  private getAllFacilityData(): any[] {
    const data = localStorage.getItem('facility-master');
    return data ? JSON.parse(data) : [];
  }

  private getAllTrainingData(): any[] {
    const data = localStorage.getItem('training-master');
    return data ? JSON.parse(data) : [];
  }

  private getAllEvaluationItemData(): any[] {
    const data = localStorage.getItem('evaluation-item-master');
    return data ? JSON.parse(data) : [];
  }

  private getAllEvaluationData(): any[] {
    const data = localStorage.getItem('evaluations');
    return data ? JSON.parse(data) : [];
  }

  private getAllInterviewData(): any[] {
    const data = localStorage.getItem('interviews');
    return data ? JSON.parse(data) : [];
  }

  private getAllGoalData(): any[] {
    const data = localStorage.getItem('goals');
    return data ? JSON.parse(data) : [];
  }

  private getSystemSettings(): any {
    const data = localStorage.getItem('system-settings');
    return data ? JSON.parse(data) : {};
  }

  private getPermissionData(): any[] {
    const data = localStorage.getItem('permissions');
    return data ? JSON.parse(data) : [];
  }

  private getWorkflowData(): any[] {
    const data = localStorage.getItem('workflows');
    return data ? JSON.parse(data) : [];
  }

  private getSystemVersion(): string {
    return process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  }

  private validateBackupData(backupData: BackupData): void {
    if (!backupData.metadata) {
      throw new Error('バックアップメタデータが見つかりません');
    }
    
    if (backupData.metadata.version !== this.BACKUP_VERSION) {
      throw new Error(`互換性のないバックアップバージョンです: ${backupData.metadata.version}`);
    }
  }

  private async restoreMasterData(
    masterData: MasterDataBackup,
    overwrite: boolean
  ): Promise<{ restored: Record<string, number>; errors: string[]; warnings: string[] }> {
    const restored: Record<string, number> = {};
    const errors: string[] = [];
    const warnings: string[] = [];

    // 各マスターデータの復元
    const masterTypes = ['staff', 'facility', 'training', 'evaluationItem'] as const;
    
    for (const type of masterTypes) {
      try {
        const data = masterData[type];
        if (data && data.length > 0) {
          if (overwrite) {
            localStorage.setItem(`${type}-master`, JSON.stringify(data));
            restored[type] = data.length;
          } else {
            // 既存データとマージ処理
            const existing = this.getExistingData(`${type}-master`);
            const merged = this.mergeData(existing, data);
            localStorage.setItem(`${type}-master`, JSON.stringify(merged));
            restored[type] = data.length;
            if (merged.length > existing.length + data.length) {
              warnings.push(`${type}で重複データがスキップされました`);
            }
          }
        }
      } catch (error) {
        errors.push(`${type}復元エラー: ${error}`);
      }
    }

    return { restored, errors, warnings };
  }

  private async restoreEvaluationData(
    evalData: EvaluationDataBackup,
    overwrite: boolean
  ): Promise<{ restored: Record<string, number>; errors: string[]; warnings: string[] }> {
    const restored: Record<string, number> = {};
    const errors: string[] = [];
    const warnings: string[] = [];

    const evalTypes = ['evaluations', 'interviews', 'goals'] as const;
    
    for (const type of evalTypes) {
      try {
        const data = evalData[type];
        if (data && data.length > 0) {
          if (overwrite) {
            localStorage.setItem(type, JSON.stringify(data));
            restored[type] = data.length;
          } else {
            const existing = this.getExistingData(type);
            const merged = this.mergeData(existing, data);
            localStorage.setItem(type, JSON.stringify(merged));
            restored[type] = data.length;
          }
        }
      } catch (error) {
        errors.push(`${type}復元エラー: ${error}`);
      }
    }

    return { restored, errors, warnings };
  }

  private async restoreSystemConfig(
    configData: SystemConfigBackup,
    overwrite: boolean
  ): Promise<{ restored: Record<string, number>; errors: string[]; warnings: string[] }> {
    const restored: Record<string, number> = {};
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      if (configData.settings) {
        localStorage.setItem('system-settings', JSON.stringify(configData.settings));
        restored['settings'] = 1;
      }
      
      if (configData.permissions) {
        localStorage.setItem('permissions', JSON.stringify(configData.permissions));
        restored['permissions'] = configData.permissions.length;
      }
      
      if (configData.workflows) {
        localStorage.setItem('workflows', JSON.stringify(configData.workflows));
        restored['workflows'] = configData.workflows.length;
      }
    } catch (error) {
      errors.push(`システム設定復元エラー: ${error}`);
    }

    return { restored, errors, warnings };
  }

  private getExistingData(key: string): any[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private mergeData(existing: any[], newData: any[]): any[] {
    // 重複除去のための簡易ロジック（実際はIDベースで比較）
    const merged = [...existing];
    newData.forEach(item => {
      const exists = existing.some(e => 
        e.id === item.id || e.code === item.code || e.name === item.name
      );
      if (!exists) {
        merged.push(item);
      }
    });
    return merged;
  }

  private recordBackupHistory(metadata: BackupMetadata, filename: string): void {
    const history = this.getBackupHistory();
    history.unshift({
      ...metadata,
      filename,
      id: Date.now().toString()
    });
    
    // 最大50件まで保持
    if (history.length > 50) {
      history.splice(50);
    }
    
    localStorage.setItem('backup-history', JSON.stringify(history));
  }

  private getBackupHistory(): any[] {
    const data = localStorage.getItem('backup-history');
    return data ? JSON.parse(data) : [];
  }

  /**
   * バックアップ履歴の取得
   */
  getBackupHistoryList(): any[] {
    return this.getBackupHistory();
  }

  /**
   * バックアップ履歴の削除
   */
  deleteBackupHistory(id: string): boolean {
    try {
      const history = this.getBackupHistory();
      const filteredHistory = history.filter(item => item.id !== id);
      localStorage.setItem('backup-history', JSON.stringify(filteredHistory));
      return true;
    } catch (error) {
      return false;
    }
  }
}

// シングルトンインスタンス
export const backupService = new BackupService();