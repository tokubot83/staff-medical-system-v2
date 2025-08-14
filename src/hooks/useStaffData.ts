/**
 * useStaffData Hook
 * 職員データ操作用のカスタムフック
 * コンポーネントから簡単にデータサービスを利用可能
 */

import { useState, useEffect, useCallback } from 'react';
import { staffDataService, Staff, StaffFilter } from '@/services/staff/staffDataService';

export function useStaffData(staffId?: string) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 単一の職員データを取得
  const fetchStaff = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffDataService.getStaff(id);
      setStaff(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch staff data');
    } finally {
      setLoading(false);
    }
  }, []);

  // 職員データを更新
  const updateStaff = useCallback(async (updatedStaff: Staff) => {
    setLoading(true);
    setError(null);
    try {
      const success = await staffDataService.saveStaff(updatedStaff);
      if (success) {
        setStaff(updatedStaff);
        return true;
      }
      throw new Error('Failed to save staff data');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update staff data');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 職員を削除
  const deleteStaff = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await staffDataService.deleteStaff(id);
      if (success) {
        setStaff(null);
        return true;
      }
      throw new Error('Failed to delete staff');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete staff');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 初期ロード
  useEffect(() => {
    if (staffId) {
      fetchStaff(staffId);
    }
  }, [staffId, fetchStaff]);

  return {
    staff,
    loading,
    error,
    fetchStaff,
    updateStaff,
    deleteStaff,
    refetch: () => staffId && fetchStaff(staffId),
  };
}

/**
 * useStaffList Hook
 * 複数の職員データを扱うフック
 */
export function useStaffList(initialFilter?: StaffFilter) {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filter, setFilter] = useState<StaffFilter>(initialFilter || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 職員リストを取得
  const fetchStaffList = useCallback(async (customFilter?: StaffFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffDataService.getAllStaff(customFilter || filter);
      setStaffList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch staff list');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // フィルターを更新して再取得
  const updateFilter = useCallback((newFilter: StaffFilter) => {
    setFilter(newFilter);
    fetchStaffList(newFilter);
  }, [fetchStaffList]);

  // 職員を追加
  const addStaff = useCallback(async (newStaff: Staff) => {
    setLoading(true);
    setError(null);
    try {
      const success = await staffDataService.saveStaff(newStaff);
      if (success) {
        await fetchStaffList();
        return true;
      }
      throw new Error('Failed to add staff');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add staff');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchStaffList]);

  // バッチ更新
  const batchUpdate = useCallback(async (staffArray: Staff[]) => {
    setLoading(true);
    setError(null);
    try {
      const success = await staffDataService.batchUpdateStaff(staffArray);
      if (success) {
        await fetchStaffList();
        return true;
      }
      throw new Error('Failed to batch update');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to batch update');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchStaffList]);

  // データをエクスポート
  const exportData = useCallback(async () => {
    try {
      const data = await staffDataService.exportStaffData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `staff_data_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      return false;
    }
  }, []);

  // データをインポート
  const importData = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const data = JSON.parse(text) as Staff[];
      const success = await staffDataService.importStaffData(data);
      if (success) {
        await fetchStaffList();
        return true;
      }
      throw new Error('Failed to import data');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchStaffList]);

  // 初期ロード
  useEffect(() => {
    fetchStaffList();
  }, []);

  return {
    staffList,
    filter,
    loading,
    error,
    fetchStaffList,
    updateFilter,
    addStaff,
    batchUpdate,
    exportData,
    importData,
    refetch: () => fetchStaffList(),
  };
}

/**
 * useStaffPhoto Hook
 * 職員写真のアップロード用フック
 */
export function useStaffPhoto(staffId: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      // ファイルサイズチェック（5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // ファイルタイプチェック
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const photoUrl = await staffDataService.uploadStaffPhoto(staffId, file);
      if (photoUrl) {
        return photoUrl;
      }
      throw new Error('Failed to upload photo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
      return null;
    } finally {
      setUploading(false);
    }
  }, [staffId]);

  return {
    uploadPhoto,
    uploading,
    error,
  };
}