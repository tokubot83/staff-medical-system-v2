import { UnifiedInterviewReservation } from '@/components/interview/UnifiedInterviewDashboard';
import { BulkOperationConfig } from '@/components/bulk/BulkOperationsModal';
import { exportToExcel } from '@/utils/excelExport';
import { exportToPDF } from '@/utils/pdfExport';
import { exportToCSV } from '@/utils/pdfExport';

export class BulkOperationsService {
  /**
   * 一括操作を実行
   */
  static async executeBulkOperation(
    reservations: UnifiedInterviewReservation[],
    config: BulkOperationConfig,
    onUpdate: (updatedReservations: UnifiedInterviewReservation[]) => void
  ): Promise<void> {
    switch (config.operation) {
      case 'update_status':
        return this.updateStatus(reservations, config.newStatus!, onUpdate);
      
      case 'update_urgency':
        return this.updateUrgency(reservations, config.newUrgency!, onUpdate);
      
      case 'reschedule':
        return this.reschedule(reservations, config.newDate!, config.newTime!, onUpdate);
      
      case 'reassign':
        return this.reassign(reservations, config.newAssignee!, onUpdate);
      
      case 'add_notes':
        return this.addNotes(reservations, config.additionalNotes!, onUpdate);
      
      case 'export':
        return this.exportData(reservations, config.exportFormat!);
      
      case 'duplicate':
        return this.duplicate(reservations, onUpdate);
      
      case 'delete':
        return this.deleteReservations(reservations, onUpdate);
      
      default:
        throw new Error(`未対応の操作: ${config.operation}`);
    }
  }

  /**
   * ステータス一括更新
   */
  private static async updateStatus(
    reservations: UnifiedInterviewReservation[],
    newStatus: string,
    onUpdate: (updatedReservations: UnifiedInterviewReservation[]) => void
  ): Promise<void> {
    const updatedReservations = reservations.map(reservation => ({
      ...reservation,
      status: newStatus as any,
      updatedAt: new Date()
    }));

    // 実際の実装では、ここでAPIを呼び出してサーバーを更新
    await this.simulateApiCall();

    onUpdate(updatedReservations);

    // 成功通知
    this.showSuccessNotification(`${reservations.length}件の面談ステータスを「${this.getStatusLabel(newStatus)}」に更新しました`);
  }

  /**
   * 緊急度一括更新
   */
  private static async updateUrgency(
    reservations: UnifiedInterviewReservation[],
    newUrgency: string,
    onUpdate: (updatedReservations: UnifiedInterviewReservation[]) => void
  ): Promise<void> {
    const updatedReservations = reservations.map(reservation => ({
      ...reservation,
      urgency: newUrgency as any,
      updatedAt: new Date()
    }));

    await this.simulateApiCall();
    onUpdate(updatedReservations);

    this.showSuccessNotification(`${reservations.length}件の面談緊急度を「${this.getUrgencyLabel(newUrgency)}」に更新しました`);
  }

  /**
   * 日時一括変更
   */
  private static async reschedule(
    reservations: UnifiedInterviewReservation[],
    newDate: Date,
    newTime: string,
    onUpdate: (updatedReservations: UnifiedInterviewReservation[]) => void
  ): Promise<void> {
    const updatedReservations = reservations.map((reservation, index) => ({
      ...reservation,
      scheduledDate: new Date(newDate),
      scheduledTime: newTime,
      updatedAt: new Date(),
      // 同じ時間に複数の面談が重複しないよう、30分ずつずらす
      scheduledTime: this.adjustTimeForDuplicates(newTime, index)
    }));

    await this.simulateApiCall();
    onUpdate(updatedReservations);

    this.showSuccessNotification(
      `${reservations.length}件の面談日時を ${newDate.toLocaleDateString('ja-JP')} ${newTime}〜 に更新しました`
    );
  }

  /**
   * 担当者一括変更
   */
  private static async reassign(
    reservations: UnifiedInterviewReservation[],
    newAssignee: string,
    onUpdate: (updatedReservations: UnifiedInterviewReservation[]) => void
  ): Promise<void> {
    const updatedReservations = reservations.map(reservation => ({
      ...reservation,
      createdBy: newAssignee,
      updatedAt: new Date()
    }));

    await this.simulateApiCall();
    onUpdate(updatedReservations);

    this.showSuccessNotification(`${reservations.length}件の面談担当者を「${newAssignee}」に変更しました`);
  }

  /**
   * 備考一括追加
   */
  private static async addNotes(
    reservations: UnifiedInterviewReservation[],
    additionalNotes: string,
    onUpdate: (updatedReservations: UnifiedInterviewReservation[]) => void
  ): Promise<void> {
    const updatedReservations = reservations.map(reservation => ({
      ...reservation,
      notes: reservation.notes 
        ? `${reservation.notes}\n\n[${new Date().toLocaleDateString('ja-JP')}] ${additionalNotes}`
        : `[${new Date().toLocaleDateString('ja-JP')}] ${additionalNotes}`,
      updatedAt: new Date()
    }));

    await this.simulateApiCall();
    onUpdate(updatedReservations);

    this.showSuccessNotification(`${reservations.length}件の面談に備考を追加しました`);
  }

  /**
   * データエクスポート
   */
  private static async exportData(
    reservations: UnifiedInterviewReservation[],
    format: 'pdf' | 'excel' | 'csv'
  ): Promise<void> {
    const exportData = reservations.map(reservation => ({
      '面談ID': reservation.id,
      '職員名': reservation.staffName,
      '職員ID': reservation.staffId,
      '部署': reservation.department,
      '職種': reservation.position,
      '経験年数': reservation.experienceYears,
      '面談タイプ': this.getInterviewTypeLabel(reservation),
      '日付': new Date(reservation.scheduledDate).toLocaleDateString('ja-JP'),
      '時刻': reservation.scheduledTime,
      '所要時間': reservation.duration ? `${reservation.duration}分` : '',
      'ステータス': this.getStatusLabel(reservation.status),
      '緊急度': reservation.urgency ? this.getUrgencyLabel(reservation.urgency) : '',
      '相談内容': reservation.supportTopic || '',
      '備考': reservation.notes || '',
      '作成者': reservation.createdBy || '',
      '作成日': reservation.createdAt.toLocaleDateString('ja-JP'),
      '更新日': reservation.updatedAt?.toLocaleDateString('ja-JP') || ''
    }));

    const filename = `面談データ一括出力_${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'excel':
        exportToExcel({
          title: '面談データ一括出力',
          facility: '医療法人厚生会',
          dateRange: new Date().toLocaleDateString('ja-JP'),
          sheets: [
            {
              name: '面談データ',
              data: exportData
            }
          ]
        });
        break;

      case 'csv':
        exportToCSV(exportData, filename);
        break;

      case 'pdf':
        // PDFエクスポートは複雑なので簡易版
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
          <h1>面談データ一括出力</h1>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                ${Object.keys(exportData[0] || {}).map(key => `<th style="padding: 8px;">${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${exportData.map(row => 
                `<tr>${Object.values(row).map(value => `<td style="padding: 8px;">${value}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        `;
        tempDiv.id = 'bulk-export-temp';
        document.body.appendChild(tempDiv);

        await exportToPDF({
          title: '面談データ一括出力',
          facility: '医療法人厚生会',
          reportType: '面談データ',
          elementId: 'bulk-export-temp'
        });

        document.body.removeChild(tempDiv);
        break;
    }

    this.showSuccessNotification(`${reservations.length}件のデータを${format.toUpperCase()}形式でエクスポートしました`);
  }

  /**
   * 面談複製
   */
  private static async duplicate(
    reservations: UnifiedInterviewReservation[],
    onUpdate: (newReservations: UnifiedInterviewReservation[]) => void
  ): Promise<void> {
    const duplicatedReservations = reservations.map((reservation, index) => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7 + index); // 1週間後から1日ずつずらす

      return {
        ...reservation,
        id: `DUP-${Date.now()}-${index}`,
        scheduledDate: futureDate,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: undefined,
        notes: reservation.notes ? `${reservation.notes}\n\n[複製] 元の面談ID: ${reservation.id}` : `[複製] 元の面談ID: ${reservation.id}`,
        source: 'manual' as const
      };
    });

    await this.simulateApiCall();
    onUpdate(duplicatedReservations);

    this.showSuccessNotification(`${reservations.length}件の面談を複製しました。日時の調整をお忘れなく。`);
  }

  /**
   * 面談削除
   */
  private static async deleteReservations(
    reservations: UnifiedInterviewReservation[],
    onUpdate: (deletedReservations: UnifiedInterviewReservation[]) => void
  ): Promise<void> {
    // 削除前の確認
    const confirmed = window.confirm(
      `本当に${reservations.length}件の面談を削除しますか？\nこの操作は元に戻すことができません。`
    );

    if (!confirmed) {
      throw new Error('削除がキャンセルされました');
    }

    await this.simulateApiCall();
    onUpdate(reservations); // 削除対象を返す

    this.showSuccessNotification(`${reservations.length}件の面談を削除しました`);
  }

  /**
   * 時間の重複を避けるための調整
   */
  private static adjustTimeForDuplicates(baseTime: string, index: number): string {
    const [hours, minutes] = baseTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + (index * 30); // 30分ずつずらす
    
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  }

  /**
   * ステータスラベル取得
   */
  private static getStatusLabel(status: string): string {
    const labels = {
      pending: '予定',
      confirmed: '確定',
      in_progress: '実施中',
      completed: '完了',
      cancelled: 'キャンセル'
    };
    return labels[status as keyof typeof labels] || status;
  }

  /**
   * 緊急度ラベル取得
   */
  private static getUrgencyLabel(urgency: string): string {
    const labels = {
      low: '低',
      medium: '中',
      high: '高',
      urgent: '緊急'
    };
    return labels[urgency as keyof typeof labels] || urgency;
  }

  /**
   * 面談タイプラベル取得
   */
  private static getInterviewTypeLabel(reservation: UnifiedInterviewReservation): string {
    const typeLabels = {
      regular: '定期面談',
      special: '特別面談',
      support: 'サポート面談'
    };

    let label = typeLabels[reservation.type] || reservation.type;

    if (reservation.regularType) {
      const regularLabels = {
        new_employee: '新入職員',
        annual: '年次',
        management: '管理職'
      };
      label += ` (${regularLabels[reservation.regularType] || reservation.regularType})`;
    }

    if (reservation.specialType) {
      const specialLabels = {
        exit: '退職',
        transfer: '異動',
        return: '復職',
        promotion: '昇進',
        disciplinary: '懲戒'
      };
      label += ` (${specialLabels[reservation.specialType] || reservation.specialType})`;
    }

    if (reservation.supportCategory) {
      label += ` (${reservation.supportCategory})`;
    }

    return label;
  }

  /**
   * API呼び出しのシミュレーション
   */
  private static async simulateApiCall(): Promise<void> {
    // 実際の実装では、ここでAPIエンドポイントを呼び出す
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * 成功通知の表示
   */
  private static showSuccessNotification(message: string): void {
    // 実際の実装では、toastライブラリやNotificationコンポーネントを使用
    alert(message);
  }

  /**
   * 一括操作の検証
   */
  static validateBulkOperation(
    reservations: UnifiedInterviewReservation[],
    config: BulkOperationConfig
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (reservations.length === 0) {
      errors.push('操作対象の面談が選択されていません');
    }

    switch (config.operation) {
      case 'update_status':
        if (!config.newStatus) {
          errors.push('新しいステータスが選択されていません');
        }
        break;

      case 'update_urgency':
        if (!config.newUrgency) {
          errors.push('新しい緊急度が選択されていません');
        }
        break;

      case 'reschedule':
        if (!config.newDate) {
          errors.push('新しい日付が設定されていません');
        }
        if (!config.newTime) {
          errors.push('新しい時刻が設定されていません');
        }
        // 過去の日付チェック
        if (config.newDate && config.newDate < new Date()) {
          errors.push('過去の日付は設定できません');
        }
        break;

      case 'reassign':
        if (!config.newAssignee) {
          errors.push('新しい担当者が選択されていません');
        }
        break;

      case 'add_notes':
        if (!config.additionalNotes || config.additionalNotes.trim() === '') {
          errors.push('追加する備考が入力されていません');
        }
        break;

      case 'export':
        if (!config.exportFormat) {
          errors.push('エクスポート形式が選択されていません');
        }
        break;

      case 'delete':
        // 完了済みの面談の削除を警告
        const completedReservations = reservations.filter(r => r.status === 'completed');
        if (completedReservations.length > 0) {
          errors.push(`完了済みの面談 ${completedReservations.length} 件が含まれています`);
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}