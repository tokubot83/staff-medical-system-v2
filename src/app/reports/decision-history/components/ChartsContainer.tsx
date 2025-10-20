'use client';

import React, { useState, useMemo } from 'react';
import { AchievementRateChart } from './AchievementRateChart';
import { DecisionTypeChart } from './DecisionTypeChart';
import { TimeSeriesChart } from './TimeSeriesChart';
import { ChartModal } from './ChartModal';
import { DateRangeFilter } from './DateRangeFilter';
import type { ExpiredEscalationDecision, DecisionHistoryResponse } from '@/services/voicedrive/types';
import { parseISO, isWithinInterval } from 'date-fns';

type ExpiredEscalationSummary = DecisionHistoryResponse['summary'];

interface ChartsContainerProps {
  decisions: ExpiredEscalationDecision[];
  summary: ExpiredEscalationSummary;
}

type ModalChart = {
  type: 'achievement-rate' | 'decision-type' | 'time-series';
  title: string;
} | null;

export function ChartsContainer({ decisions, summary }: ChartsContainerProps) {
  const [modalChart, setModalChart] = useState<ModalChart>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // 日付範囲フィルタ適用
  const filteredDecisions = useMemo(() => {
    if (!startDate && !endDate) return decisions;

    return decisions.filter((d) => {
      const decisionDate = parseISO(d.createdAt);

      if (startDate && endDate) {
        return isWithinInterval(decisionDate, { start: startDate, end: endDate });
      } else if (startDate) {
        return decisionDate >= startDate;
      } else if (endDate) {
        return decisionDate <= endDate;
      }

      return true;
    });
  }, [decisions, startDate, endDate]);

  // フィルタ後のサマリー再計算
  const filteredSummary = useMemo((): ExpiredEscalationSummary => {
    if (!startDate && !endDate) return summary;

    const approvalCount = filteredDecisions.filter((d) => d.decision === 'approve_at_current_level').length;
    const downgradeCount = filteredDecisions.filter((d) => d.decision === 'downgrade').length;
    const rejectCount = filteredDecisions.filter((d) => d.decision === 'reject').length;
    const totalDecisions = filteredDecisions.length;

    const averageAchievementRate = totalDecisions > 0
      ? filteredDecisions.reduce((sum, d) => sum + d.achievementRate, 0) / totalDecisions
      : 0;

    const averageDaysOverdue = totalDecisions > 0
      ? filteredDecisions.reduce((sum, d) => sum + d.daysOverdue, 0) / totalDecisions
      : 0;

    return {
      totalDecisions,
      approvalCount,
      downgradeCount,
      rejectCount,
      averageAchievementRate,
      averageDaysOverdue,
    };
  }, [filteredDecisions, startDate, endDate, summary]);

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleOpenModal = (chart: ModalChart) => {
    setModalChart(chart);
  };

  const handleCloseModal = () => {
    setModalChart(null);
  };

  return (
    <div className="space-y-6">
      {/* グラフセクションタイトル */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">📊</span>
          統計グラフ
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          判断履歴の傾向を視覚的に分析します
        </p>
      </div>

      {/* 日付範囲フィルタ */}
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* フィルタ適用後の件数表示 */}
      {(startDate || endDate) && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">{filteredDecisions.length}件</span>の判断履歴を表示中
            {filteredDecisions.length !== decisions.length && (
              <span className="ml-2 text-blue-600">
                （全{decisions.length}件中）
              </span>
            )}
          </p>
        </div>
      )}

      {/* 2カラムレイアウト（到達率分布 & 判断タイプ分布） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AchievementRateChart
          data={filteredDecisions}
          onEnlarge={() => handleOpenModal({ type: 'achievement-rate', title: '到達率分布' })}
        />
        <DecisionTypeChart
          summary={filteredSummary}
          onEnlarge={() => handleOpenModal({ type: 'decision-type', title: '判断タイプ分布' })}
        />
      </div>

      {/* 1カラムレイアウト（時系列推移） */}
      <TimeSeriesChart
        data={filteredDecisions}
        onEnlarge={() => handleOpenModal({ type: 'time-series', title: '判断推移（日別）' })}
      />

      {/* グラフ拡大モーダル */}
      {modalChart && (
        <ChartModal
          isOpen={true}
          onClose={handleCloseModal}
          chartTitle={modalChart.title}
          chartType={modalChart.type}
          chartElement={
            modalChart.type === 'achievement-rate' ? (
              <AchievementRateChart data={filteredDecisions} />
            ) : modalChart.type === 'decision-type' ? (
              <DecisionTypeChart summary={filteredSummary} />
            ) : (
              <TimeSeriesChart data={filteredDecisions} />
            )
          }
        />
      )}
    </div>
  );
}
