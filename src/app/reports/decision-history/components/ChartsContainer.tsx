'use client';

import React from 'react';
import { AchievementRateChart } from './AchievementRateChart';
import { DecisionTypeChart } from './DecisionTypeChart';
import { TimeSeriesChart } from './TimeSeriesChart';
import type { ExpiredEscalationDecision, DecisionHistoryResponse } from '@/services/voicedrive/types';

type ExpiredEscalationSummary = DecisionHistoryResponse['summary'];

interface ChartsContainerProps {
  decisions: ExpiredEscalationDecision[];
  summary: ExpiredEscalationSummary;
}

export function ChartsContainer({ decisions, summary }: ChartsContainerProps) {
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

      {/* 2カラムレイアウト（到達率分布 & 判断タイプ分布） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AchievementRateChart data={decisions} />
        <DecisionTypeChart summary={summary} />
      </div>

      {/* 1カラムレイアウト（時系列推移） */}
      <TimeSeriesChart data={decisions} />
    </div>
  );
}
