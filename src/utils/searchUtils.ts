import { UnifiedInterviewReservation } from '@/components/interview/UnifiedInterviewDashboard';
import { AdvancedSearchFilters } from '@/components/search/AdvancedSearchModal';

export class AdvancedSearchService {
  /**
   * 高度な検索を実行
   */
  static searchReservations(
    reservations: UnifiedInterviewReservation[],
    filters: AdvancedSearchFilters
  ): UnifiedInterviewReservation[] {
    let results = [...reservations];

    // キーワード検索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(reservation => 
        reservation.staffName.toLowerCase().includes(keyword) ||
        reservation.department.toLowerCase().includes(keyword) ||
        reservation.position.toLowerCase().includes(keyword) ||
        reservation.notes?.toLowerCase().includes(keyword) ||
        reservation.supportTopic?.toLowerCase().includes(keyword) ||
        reservation.supportDetails?.toLowerCase().includes(keyword)
      );
    }

    // 職員名検索
    if (filters.staffName) {
      const staffName = filters.staffName.toLowerCase();
      results = results.filter(reservation =>
        reservation.staffName.toLowerCase().includes(staffName)
      );
    }

    // 職員ID検索
    if (filters.staffId) {
      results = results.filter(reservation =>
        reservation.staffId.includes(filters.staffId)
      );
    }

    // 部署フィルター
    if (filters.departments.length > 0) {
      results = results.filter(reservation =>
        filters.departments.includes(reservation.department)
      );
    }

    // 職種フィルター
    if (filters.positions.length > 0) {
      results = results.filter(reservation =>
        filters.positions.includes(reservation.position)
      );
    }

    // 経験年数フィルター
    if (filters.experienceYears.min !== undefined || filters.experienceYears.max !== undefined) {
      results = results.filter(reservation => {
        const years = reservation.experienceYears;
        const minMatch = filters.experienceYears.min === undefined || years >= filters.experienceYears.min;
        const maxMatch = filters.experienceYears.max === undefined || years <= filters.experienceYears.max;
        return minMatch && maxMatch;
      });
    }

    // 面談タイプフィルター
    if (filters.interviewTypes.length > 0) {
      results = results.filter(reservation =>
        filters.interviewTypes.includes(reservation.type)
      );
    }

    // 面談サブタイプフィルター
    if (filters.interviewSubTypes.length > 0) {
      results = results.filter(reservation => {
        const subTypes = [
          reservation.regularType,
          reservation.specialType,
          reservation.supportCategory
        ].filter(Boolean);
        
        return subTypes.some(subType => 
          filters.interviewSubTypes.some(filterSubType =>
            filterSubType.includes(subType || '') || (subType || '').includes(filterSubType)
          )
        );
      });
    }

    // ステータスフィルター
    if (filters.statuses.length > 0) {
      results = results.filter(reservation =>
        filters.statuses.includes(reservation.status)
      );
    }

    // 緊急度フィルター
    if (filters.urgencyLevels.length > 0) {
      results = results.filter(reservation =>
        reservation.urgency && filters.urgencyLevels.includes(reservation.urgency)
      );
    }

    // 日付範囲フィルター
    if (filters.dateRange.from || filters.dateRange.to) {
      results = results.filter(reservation => {
        const reservationDate = new Date(reservation.scheduledDate);
        const fromMatch = !filters.dateRange.from || reservationDate >= filters.dateRange.from;
        const toMatch = !filters.dateRange.to || reservationDate <= filters.dateRange.to;
        return fromMatch && toMatch;
      });
    }

    // 時間帯フィルター
    if (filters.timeSlots.length > 0) {
      results = results.filter(reservation => {
        const time = reservation.scheduledTime;
        return filters.timeSlots.some(slot => {
          const [startTime] = slot.split('-');
          return time.startsWith(startTime.substring(0, 2));
        });
      });
    }

    // 備考検索
    if (filters.notes) {
      const notes = filters.notes.toLowerCase();
      results = results.filter(reservation =>
        reservation.notes?.toLowerCase().includes(notes) ||
        reservation.supportDetails?.toLowerCase().includes(notes)
      );
    }

    // 期限超過フィルター
    if (filters.isOverdue) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      results = results.filter(reservation => {
        const reservationDate = new Date(reservation.scheduledDate);
        return reservationDate < today && reservation.status !== 'completed';
      });
    }

    // タグフィルター（将来的な拡張のため）
    if (filters.tags.length > 0) {
      // 現在のデータ構造ではタグはないため、将来的に実装
      // results = results.filter(reservation => {
      //   return filters.tags.some(tag => reservation.tags?.includes(tag));
      // });
    }

    // 並び替え
    results = this.sortResults(results, filters.sortBy, filters.sortOrder);

    return results;
  }

  /**
   * 検索結果を並び替え
   */
  private static sortResults(
    results: UnifiedInterviewReservation[],
    sortBy: AdvancedSearchFilters['sortBy'],
    sortOrder: AdvancedSearchFilters['sortOrder']
  ): UnifiedInterviewReservation[] {
    const multiplier = sortOrder === 'asc' ? 1 : -1;

    return results.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return multiplier * (new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
        
        case 'name':
          return multiplier * a.staffName.localeCompare(b.staffName, 'ja');
        
        case 'department':
          return multiplier * a.department.localeCompare(b.department, 'ja');
        
        case 'urgency':
          const urgencyOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const aUrgency = urgencyOrder[a.urgency as keyof typeof urgencyOrder] || 0;
          const bUrgency = urgencyOrder[b.urgency as keyof typeof urgencyOrder] || 0;
          return multiplier * (aUrgency - bUrgency);
        
        case 'status':
          const statusOrder = { pending: 1, confirmed: 2, in_progress: 3, completed: 4, cancelled: 5 };
          const aStatus = statusOrder[a.status as keyof typeof statusOrder] || 0;
          const bStatus = statusOrder[b.status as keyof typeof statusOrder] || 0;
          return multiplier * (aStatus - bStatus);
        
        default:
          return 0;
      }
    });
  }

  /**
   * 検索履歴を保存
   */
  static saveSearchHistory(filters: AdvancedSearchFilters) {
    try {
      const history = this.getSearchHistory();
      const newEntry = {
        id: Date.now().toString(),
        filters,
        timestamp: new Date(),
        name: this.generateSearchName(filters)
      };

      // 最新10件まで保存
      const updatedHistory = [newEntry, ...history.slice(0, 9)];
      localStorage.setItem('interview_search_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('検索履歴の保存に失敗:', error);
    }
  }

  /**
   * 検索履歴を取得
   */
  static getSearchHistory(): Array<{
    id: string;
    filters: AdvancedSearchFilters;
    timestamp: Date;
    name: string;
  }> {
    try {
      const history = localStorage.getItem('interview_search_history');
      if (history) {
        return JSON.parse(history).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
      }
    } catch (error) {
      console.error('検索履歴の取得に失敗:', error);
    }
    return [];
  }

  /**
   * 検索条件から検索名を生成
   */
  private static generateSearchName(filters: AdvancedSearchFilters): string {
    const parts = [];

    if (filters.keyword) parts.push(`キーワード: ${filters.keyword}`);
    if (filters.staffName) parts.push(`職員: ${filters.staffName}`);
    if (filters.departments.length > 0) parts.push(`部署: ${filters.departments.join(', ')}`);
    if (filters.interviewTypes.length > 0) parts.push(`タイプ: ${filters.interviewTypes.join(', ')}`);
    if (filters.statuses.length > 0) parts.push(`状態: ${filters.statuses.join(', ')}`);
    if (filters.dateRange.from || filters.dateRange.to) {
      const from = filters.dateRange.from?.toLocaleDateString('ja-JP') || '';
      const to = filters.dateRange.to?.toLocaleDateString('ja-JP') || '';
      parts.push(`期間: ${from} - ${to}`);
    }

    if (parts.length === 0) {
      return '全件検索';
    }

    return parts.slice(0, 3).join(' / ') + (parts.length > 3 ? '...' : '');
  }

  /**
   * 保存された検索を実行
   */
  static applySavedSearch(
    reservations: UnifiedInterviewReservation[],
    savedSearchId: string
  ): UnifiedInterviewReservation[] | null {
    const history = this.getSearchHistory();
    const savedSearch = history.find(entry => entry.id === savedSearchId);
    
    if (savedSearch) {
      return this.searchReservations(reservations, savedSearch.filters);
    }
    
    return null;
  }

  /**
   * クイック検索（簡易版）
   */
  static quickSearch(
    reservations: UnifiedInterviewReservation[],
    query: string
  ): UnifiedInterviewReservation[] {
    if (!query.trim()) return reservations;

    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    return reservations.filter(reservation => {
      const searchableText = [
        reservation.staffName,
        reservation.department,
        reservation.position,
        reservation.notes || '',
        reservation.supportTopic || '',
        reservation.supportDetails || ''
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  /**
   * 検索サジェスト機能
   */
  static getSearchSuggestions(
    reservations: UnifiedInterviewReservation[],
    query: string
  ): Array<{ type: string; value: string; count: number }> {
    if (!query.trim() || query.length < 2) return [];

    const suggestions: Array<{ type: string; value: string; count: number }> = [];
    const queryLower = query.toLowerCase();

    // 職員名のサジェスト
    const staffNames = new Set(
      reservations
        .map(r => r.staffName)
        .filter(name => name.toLowerCase().includes(queryLower))
    );

    staffNames.forEach(name => {
      const count = reservations.filter(r => r.staffName === name).length;
      suggestions.push({ type: '職員名', value: name, count });
    });

    // 部署のサジェスト
    const departments = new Set(
      reservations
        .map(r => r.department)
        .filter(dept => dept.toLowerCase().includes(queryLower))
    );

    departments.forEach(dept => {
      const count = reservations.filter(r => r.department === dept).length;
      suggestions.push({ type: '部署', value: dept, count });
    });

    // 並び替え（使用回数の多い順）
    return suggestions.sort((a, b) => b.count - a.count).slice(0, 10);
  }
}