// データ解釈コメントの型定義

export type CommentType = 
  | 'interpretation'  // 📊 データ解釈
  | 'insight'        // 💡 インサイト
  | 'warning'        // ⚠️ 警告・注意
  | 'action'         // ✅ 推奨アクション
  | 'trend'          // 📈 トレンド
  | 'benchmark';     // 🎯 ベンチマーク

export interface DataComment {
  id: string;
  type: CommentType;
  title: string;
  message: string;
  priority?: 'high' | 'medium' | 'low';
  targetMetric?: string; // 対象となる指標名
  threshold?: {
    value: number;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  };
}

export interface CommentConfig {
  metric: string;
  comments: DataComment[];
}

// コメントのアイコンマッピング
export const commentIcons: Record<CommentType, string> = {
  interpretation: '📊',
  insight: '💡',
  warning: '⚠️',
  action: '✅',
  trend: '📈',
  benchmark: '🎯'
};

// コメントのスタイルマッピング
export const commentStyles: Record<CommentType, {
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  interpretation: {
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  insight: {
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  warning: {
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200'
  },
  action: {
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200'
  },
  trend: {
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200'
  },
  benchmark: {
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-200'
  }
};

// サンプルコメント生成関数
export const generateComments = (metricValue: number, metricType: string): DataComment[] => {
  const comments: DataComment[] = [];

  // 健診受診率のコメント例
  if (metricType === 'healthCheckRate') {
    if (metricValue >= 90) {
      comments.push({
        id: '1',
        type: 'benchmark',
        title: '優秀な受診率',
        message: '健診受診率が90%以上と非常に高い水準です。継続的な取り組みが成果を上げています。',
        priority: 'high'
      });
    } else if (metricValue < 70) {
      comments.push({
        id: '2',
        type: 'warning',
        title: '受診率の改善が必要',
        message: `現在の受診率${metricValue}%は目標値70%を下回っています。受診勧奨の強化が必要です。`,
        priority: 'high'
      });
      comments.push({
        id: '3',
        type: 'action',
        title: '推奨アクション',
        message: '個別の受診勧奨、健診日程の柔軟化、インセンティブ制度の検討を推奨します。',
        priority: 'medium'
      });
    }
  }

  // ストレス指数のコメント例
  if (metricType === 'stressIndex') {
    if (metricValue > 70) {
      comments.push({
        id: '4',
        type: 'warning',
        title: '高ストレス状態',
        message: 'ストレス指数が70を超えており、早急な対策が必要です。',
        priority: 'high'
      });
      comments.push({
        id: '5',
        type: 'action',
        title: '緊急対応推奨',
        message: 'メンタルヘルスケアプログラムの実施、業務負荷の見直し、個別面談の実施を検討してください。',
        priority: 'high'
      });
    } else if (metricValue < 30) {
      comments.push({
        id: '6',
        type: 'interpretation',
        title: '良好なメンタルヘルス',
        message: 'ストレス指数が低く、職場環境が良好であることを示しています。',
        priority: 'low'
      });
    }
  }

  // 残業時間のコメント例
  if (metricType === 'overtimeHours') {
    if (metricValue > 45) {
      comments.push({
        id: '7',
        type: 'warning',
        title: '過重労働のリスク',
        message: `月平均${metricValue}時間の残業は過労死ラインに近づいています。`,
        priority: 'high'
      });
      comments.push({
        id: '8',
        type: 'action',
        title: '労務管理の見直し',
        message: '業務配分の見直し、人員配置の最適化、業務効率化を早急に実施してください。',
        priority: 'high'
      });
    }
  }

  return comments;
};

// コメントの評価関数
export const evaluateMetric = (
  value: number,
  threshold: DataComment['threshold']
): boolean => {
  if (!threshold) return true;

  switch (threshold.operator) {
    case 'gt':
      return value > threshold.value;
    case 'lt':
      return value < threshold.value;
    case 'eq':
      return value === threshold.value;
    case 'gte':
      return value >= threshold.value;
    case 'lte':
      return value <= threshold.value;
    default:
      return false;
  }
};