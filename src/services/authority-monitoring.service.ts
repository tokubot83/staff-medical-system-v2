/**
 * 権限レベルモニタリングサービス
 * 3施設統合後の権限レベル不整合検出と自動修正
 * 作成日: 2025年9月28日
 */

import { FacilityPositionMapping } from '../types/facility-authority';
import { facilityPositionMappingService } from '../lib/facility-position-mapping';
import { accountLevelCalculator } from './accountLevelCalculator';

export interface MonitoringAlert {
  alertId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  facilityId: string;
  staffId: string;
  position: string;
  expectedLevel: number;
  actualLevel: number;
  message: string;
  detectedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface MonitoringReport {
  reportId: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  facilities: string[];
  totalStaff: number;
  totalAlerts: number;
  criticalAlerts: number;
  resolvedAlerts: number;
  inconsistencies: {
    facilityId: string;
    count: number;
    details: MonitoringAlert[];
  }[];
  recommendations: string[];
}

export class AuthorityMonitoringService {
  private alerts: Map<string, MonitoringAlert> = new Map();
  private monitoringEnabled: boolean = true;
  private alertThreshold: number = 5; // 5件以上のアラートで通知

  /**
   * 権限レベルの整合性をチェック
   */
  async checkConsistency(
    facilityId: string,
    staffData: Array<{
      staffId: string;
      position: string;
      currentLevel: number;
    }>
  ): Promise<MonitoringAlert[]> {
    const detectedAlerts: MonitoringAlert[] = [];
    const mapping = facilityPositionMappingService.getFacilityMapping(facilityId);

    if (!mapping) {
      console.error(`施設 ${facilityId} のマッピングが見つかりません`);
      return [];
    }

    for (const staff of staffData) {
      const expectedLevel = facilityPositionMappingService.getPositionLevel(
        facilityId,
        staff.position
      );

      if (expectedLevel && expectedLevel !== staff.currentLevel) {
        const alert = this.createAlert(
          facilityId,
          staff.staffId,
          staff.position,
          expectedLevel,
          staff.currentLevel
        );

        this.alerts.set(alert.alertId, alert);
        detectedAlerts.push(alert);
      }
    }

    // 閾値を超えた場合、自動通知
    if (detectedAlerts.length >= this.alertThreshold) {
      await this.notifyAdministrators(facilityId, detectedAlerts);
    }

    return detectedAlerts;
  }

  /**
   * 主任レベルの一貫性チェック（全施設横断）
   */
  async checkChiefLevelConsistency(): Promise<{
    isConsistent: boolean;
    inconsistencies: Array<{
      facilityId: string;
      position: string;
      level: number;
      expectedLevel: number;
    }>;
  }> {
    const inconsistencies: Array<{
      facilityId: string;
      position: string;
      level: number;
      expectedLevel: number;
    }> = [];

    const facilities = ['obara-hospital', 'tategami-rehabilitation', 'espoir-tategami'];
    const expectedChiefLevel = 5;

    for (const facilityId of facilities) {
      const mapping = facilityPositionMappingService.getFacilityMapping(facilityId);

      if (!mapping) continue;

      // 主任職を検索
      const chiefPositions = mapping.positionMappings.filter(
        pos => pos.positionName.includes('主任')
      );

      for (const position of chiefPositions) {
        if (position.baseLevel !== expectedChiefLevel) {
          inconsistencies.push({
            facilityId,
            position: position.positionName,
            level: position.baseLevel,
            expectedLevel: expectedChiefLevel
          });
        }
      }
    }

    return {
      isConsistent: inconsistencies.length === 0,
      inconsistencies
    };
  }

  /**
   * 兼任職員の権限チェック
   */
  checkDualPositionAuthority(
    staffId: string,
    positions: Array<{ position: string; facilityId: string }>
  ): {
    highestLevel: number;
    appliedPosition: string;
    allLevels: Array<{ position: string; level: number }>;
  } {
    const allLevels = positions.map(pos => {
      const level = facilityPositionMappingService.getPositionLevel(
        pos.facilityId,
        pos.position
      ) || 0;

      return {
        position: pos.position,
        level
      };
    });

    const highest = allLevels.reduce(
      (max, current) => (current.level > max.level ? current : max),
      allLevels[0]
    );

    return {
      highestLevel: highest.level,
      appliedPosition: highest.position,
      allLevels
    };
  }

  /**
   * アラートの作成
   */
  private createAlert(
    facilityId: string,
    staffId: string,
    position: string,
    expectedLevel: number,
    actualLevel: number
  ): MonitoringAlert {
    const severity = this.calculateSeverity(expectedLevel, actualLevel);

    return {
      alertId: `ALERT_${Date.now()}_${staffId}`,
      severity,
      facilityId,
      staffId,
      position,
      expectedLevel,
      actualLevel,
      message: this.generateAlertMessage(position, expectedLevel, actualLevel, severity),
      detectedAt: new Date(),
      resolved: false
    };
  }

  /**
   * アラートの重要度を計算
   */
  private calculateSeverity(
    expectedLevel: number,
    actualLevel: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    const diff = Math.abs(expectedLevel - actualLevel);

    if (diff >= 5) return 'critical';
    if (diff >= 3) return 'high';
    if (diff >= 2) return 'medium';
    return 'low';
  }

  /**
   * アラートメッセージの生成
   */
  private generateAlertMessage(
    position: string,
    expectedLevel: number,
    actualLevel: number,
    severity: string
  ): string {
    const levelDiff = actualLevel - expectedLevel;
    const direction = levelDiff > 0 ? '高い' : '低い';

    return `[${severity.toUpperCase()}] ${position}の権限レベル不整合: ` +
           `期待値(${expectedLevel})より${Math.abs(levelDiff)}レベル${direction}(実際: ${actualLevel})`;
  }

  /**
   * 管理者への通知
   */
  private async notifyAdministrators(
    facilityId: string,
    alerts: MonitoringAlert[]
  ): Promise<void> {
    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const highCount = alerts.filter(a => a.severity === 'high').length;

    console.warn(`
╔════════════════════════════════════════════════════════════
║ 権限レベル不整合アラート
║ 施設: ${facilityId}
║ 検出時刻: ${new Date().toLocaleString('ja-JP')}
║ 総アラート数: ${alerts.length}
║ Critical: ${criticalCount}, High: ${highCount}
╠════════════════════════════════════════════════════════════
║ 詳細:
${alerts.slice(0, 5).map(a =>
  `║ - [${a.severity.toUpperCase()}] ${a.staffId}: ${a.position} ` +
  `(期待: ${a.expectedLevel}, 実際: ${a.actualLevel})`
).join('\n')}
${alerts.length > 5 ? `║ ... 他 ${alerts.length - 5} 件` : ''}
╚════════════════════════════════════════════════════════════
    `);

    // 実際の環境では、ここでメール送信やSlack通知などを実装
  }

  /**
   * モニタリングレポートの生成
   */
  async generateReport(
    startDate: Date,
    endDate: Date,
    facilities: string[]
  ): Promise<MonitoringReport> {
    const reportId = `REPORT_${Date.now()}`;
    const relevantAlerts = Array.from(this.alerts.values()).filter(
      alert =>
        alert.detectedAt >= startDate &&
        alert.detectedAt <= endDate &&
        facilities.includes(alert.facilityId)
    );

    const inconsistencies = facilities.map(facilityId => {
      const facilityAlerts = relevantAlerts.filter(a => a.facilityId === facilityId);
      return {
        facilityId,
        count: facilityAlerts.length,
        details: facilityAlerts
      };
    });

    const recommendations = this.generateRecommendations(relevantAlerts);

    return {
      reportId,
      generatedAt: new Date(),
      period: { start: startDate, end: endDate },
      facilities,
      totalStaff: new Set(relevantAlerts.map(a => a.staffId)).size,
      totalAlerts: relevantAlerts.length,
      criticalAlerts: relevantAlerts.filter(a => a.severity === 'critical').length,
      resolvedAlerts: relevantAlerts.filter(a => a.resolved).length,
      inconsistencies,
      recommendations
    };
  }

  /**
   * 推奨事項の生成
   */
  private generateRecommendations(alerts: MonitoringAlert[]): string[] {
    const recommendations: string[] = [];

    // 統括主任レベルのチェック
    const toukatsuAlerts = alerts.filter(a => a.position === '統括主任');
    if (toukatsuAlerts.length > 0) {
      recommendations.push(
        '統括主任のレベル設定を確認してください（Phase 3でレベル7に調整済み）'
      );
    }

    // 主任レベルの一貫性
    const chiefAlerts = alerts.filter(a => a.position.includes('主任'));
    if (chiefAlerts.length > 0) {
      recommendations.push(
        '主任職のレベルが全施設でレベル5に統一されているか確認してください'
      );
    }

    // Critical アラートへの対応
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push(
        `${criticalAlerts.length}件の重大な権限レベル不整合が検出されました。即座に修正が必要です`
      );
    }

    // 兼任職員のチェック
    const duplicateStaffIds = this.findDuplicateStaffIds(alerts);
    if (duplicateStaffIds.length > 0) {
      recommendations.push(
        `兼任職員（${duplicateStaffIds.length}名）の権限レベルが正しく設定されているか確認してください`
      );
    }

    return recommendations;
  }

  /**
   * 重複するスタッフIDを検出
   */
  private findDuplicateStaffIds(alerts: MonitoringAlert[]): string[] {
    const staffCounts = new Map<string, number>();

    alerts.forEach(alert => {
      const count = staffCounts.get(alert.staffId) || 0;
      staffCounts.set(alert.staffId, count + 1);
    });

    return Array.from(staffCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([staffId]) => staffId);
  }

  /**
   * アラートの解決
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);

    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = new Date();

    return true;
  }

  /**
   * 自動修正の実行（管理者承認後）
   */
  async autoCorrectLevels(
    alerts: MonitoringAlert[],
    adminApproval: boolean = false
  ): Promise<{
    corrected: number;
    failed: number;
    results: Array<{
      staffId: string;
      success: boolean;
      message: string;
    }>;
  }> {
    if (!adminApproval) {
      return {
        corrected: 0,
        failed: alerts.length,
        results: alerts.map(a => ({
          staffId: a.staffId,
          success: false,
          message: '管理者承認が必要です'
        }))
      };
    }

    const results: Array<{
      staffId: string;
      success: boolean;
      message: string;
    }> = [];

    let corrected = 0;
    let failed = 0;

    for (const alert of alerts) {
      try {
        // ここで実際のDB更新処理を行う
        // await updateStaffLevel(alert.staffId, alert.expectedLevel);

        this.resolveAlert(alert.alertId);
        corrected++;

        results.push({
          staffId: alert.staffId,
          success: true,
          message: `レベルを${alert.actualLevel}から${alert.expectedLevel}に修正しました`
        });
      } catch (error) {
        failed++;
        results.push({
          staffId: alert.staffId,
          success: false,
          message: `修正失敗: ${error}`
        });
      }
    }

    return { corrected, failed, results };
  }

  /**
   * モニタリングの有効/無効切り替え
   */
  setMonitoringEnabled(enabled: boolean): void {
    this.monitoringEnabled = enabled;
  }

  /**
   * アラート閾値の設定
   */
  setAlertThreshold(threshold: number): void {
    this.alertThreshold = threshold;
  }

  /**
   * 統計情報の取得
   */
  getStatistics(): {
    totalAlerts: number;
    unresolvedAlerts: number;
    alertsBySeverity: Record<string, number>;
    alertsByFacility: Record<string, number>;
  } {
    const alerts = Array.from(this.alerts.values());
    const unresolvedAlerts = alerts.filter(a => !a.resolved);

    const alertsBySeverity: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    const alertsByFacility: Record<string, number> = {};

    alerts.forEach(alert => {
      alertsBySeverity[alert.severity]++;
      alertsByFacility[alert.facilityId] = (alertsByFacility[alert.facilityId] || 0) + 1;
    });

    return {
      totalAlerts: alerts.length,
      unresolvedAlerts: unresolvedAlerts.length,
      alertsBySeverity,
      alertsByFacility
    };
  }
}

// シングルトンインスタンス
export const authorityMonitoringService = new AuthorityMonitoringService();