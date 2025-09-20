// Vercel環境でのファイル日付管理
// ビルド時に固定されるタイムスタンプの問題を回避するための設定

interface FileDateMapping {
  [fileName: string]: string;
}

// ファイル名と実際の更新日時のマッピング
// Vercel環境でファイルシステムの日付が使えないため、手動管理
export const fileDateMappings: FileDateMapping = {
  // docs/ フォルダ内のファイル
  'AI_SUMMARY.md': '2025-09-20T10:00:00Z',
  'WORK-RESUME-INSTRUCTIONS-20250921.md': '2025-09-21T00:00:00Z',
  'hr_interview_guided.md': '2025-09-15T09:00:00Z',
  'hr_interview_guided.tsx': '2025-09-15T09:00:00Z',

  // mcp-shared/docs/ フォルダ内のファイル
  'voicedrive-master-plan-confirmed-OFFICIAL-20250920.md': '2025-09-20T15:00:00Z',
  'voicedrive-master-plan-confirmed-20250920.md': '2025-09-20T14:30:00Z',
  'lightsail-integration-master-plan-20250920.md': '2025-09-20T13:00:00Z',
  'URGENT-lightsail-master-plan-notification-20250920.md': '2025-09-20T12:00:00Z',
  'CRITICAL-MASTER-PLAN-SYNC-20250920-2324.md': '2025-09-20T23:24:00Z',
  'voicedrive-daily-report.md': '2025-09-20T18:00:00Z',

  // その他の重要ファイル
  'sync-status.json': '2025-09-21T00:00:00Z',
  'integration-test-phase3-1758377603624.json': '2025-09-20T22:00:00Z',
};

/**
 * ファイル名から適切な更新日時を取得
 * Vercel環境でのビルド時タイムスタンプ問題を回避
 */
export function getFileModifiedDate(fileName: string, fallbackDate?: Date | string): Date {
  // マッピングから日付を取得
  const mappedDate = fileDateMappings[fileName];
  if (mappedDate) {
    return new Date(mappedDate);
  }

  // ファイル名に日付が含まれている場合は抽出
  const dateMatch = fileName.match(/(\d{8}|\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    const dateStr = dateMatch[1];
    if (dateStr.includes('-')) {
      return new Date(dateStr + 'T00:00:00Z');
    } else {
      // YYYYMMDD形式
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return new Date(`${year}-${month}-${day}T00:00:00Z`);
    }
  }

  // フォールバック日付を使用
  if (fallbackDate) {
    return typeof fallbackDate === 'string' ? new Date(fallbackDate) : fallbackDate;
  }

  // デフォルトは現在時刻
  return new Date();
}

/**
 * 環境に応じた日付取得戦略
 */
export function shouldUseMappedDates(): boolean {
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}