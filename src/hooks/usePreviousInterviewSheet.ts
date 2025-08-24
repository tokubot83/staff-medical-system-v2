/**
 * 前回面談シート取得カスタムフック
 * 同じタイプの直近面談データを取得する
 */

import { useState, useEffect } from 'react';
import { interviewDataService, InterviewData } from '@/services/interview/interviewDataService';

export interface PreviousInterviewResult {
  previousInterview: InterviewData | null;
  loading: boolean;
  error: string | null;
  hasHistory: boolean;
  isFirstInterview: boolean;
}

export const usePreviousInterviewSheet = (
  staffId: string,
  currentInterviewType: string,
  currentInterviewId?: string
): PreviousInterviewResult => {
  const [previousInterview, setPreviousInterview] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasHistory, setHasHistory] = useState<boolean>(false);
  const [isFirstInterview, setIsFirstInterview] = useState<boolean>(true);

  useEffect(() => {
    const fetchPreviousInterview = async () => {
      if (!staffId || !currentInterviewType) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 職員の全面談履歴を取得
        const staffInterviews = await interviewDataService.getStaffInterviews(staffId);
        console.log(`[usePreviousInterviewSheet] Staff ${staffId} total interviews:`, staffInterviews);
        
        // 完了した面談のみを対象とし、同じタイプの面談をフィルタリング
        const completedSameTypeInterviews = staffInterviews.filter(interview => 
          interview.status === 'completed' && 
          interview.interviewType === currentInterviewType &&
          interview.id !== currentInterviewId // 現在の面談は除外
        );
        
        console.log(`[usePreviousInterviewSheet] Completed same type (${currentInterviewType}) interviews:`, completedSameTypeInterviews);

        // 履歴があるかチェック
        setHasHistory(staffInterviews.length > 0);
        setIsFirstInterview(completedSameTypeInterviews.length === 0);

        if (completedSameTypeInterviews.length > 0) {
          // 日付順にソート（最新順）
          completedSameTypeInterviews.sort((a, b) => {
            const dateA = new Date(a.actualDate || a.scheduledDate).getTime();
            const dateB = new Date(b.actualDate || b.scheduledDate).getTime();
            return dateB - dateA;
          });

          // 最新の同じタイプの面談を取得
          setPreviousInterview(completedSameTypeInterviews[0]);
        } else {
          setPreviousInterview(null);
        }
      } catch (err) {
        console.error('Error fetching previous interview:', err);
        setError('前回の面談データの取得に失敗しました');
        setPreviousInterview(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousInterview();
  }, [staffId, currentInterviewType, currentInterviewId]);

  return {
    previousInterview,
    loading,
    error,
    hasHistory,
    isFirstInterview
  };
};