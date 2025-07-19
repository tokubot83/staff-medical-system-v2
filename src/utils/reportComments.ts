// 各レポート用のデータ解釈コメント生成関数
import { DataComment } from '@/types/commentTypes';

// 人事戦略最適化レポート用コメント
export const generateHRStrategyComments = (data: any): DataComment[] => {
  const comments: DataComment[] = [];

  // 採用効率の評価
  if (data?.recruitmentEfficiency < 70) {
    comments.push({
      id: 'recruitment-warning',
      type: 'warning',
      title: '採用効率の低下',
      message: '採用効率が70%を下回っています。採用プロセスの見直しが必要です。',
      priority: 'high'
    });
  }

  // 人材配置の最適化
  comments.push({
    id: 'allocation-insight',
    type: 'insight',
    title: '人材配置の最適化ポイント',
    message: 'ICUと救急部門への人員増強により、残業時間の削減と医療の質向上が期待できます。',
    priority: 'medium'
  });

  // 推奨アクション
  comments.push({
    id: 'hr-action',
    type: 'action',
    title: 'データ駆動型人材マッチング',
    message: 'スキルと適性を考慮した最適配置支援システムの導入により、配置精度の向上が見込まれます。',
    priority: 'high'
  });

  return comments;
};

// 採用効果測定レポート用コメント
export const generateRecruitmentComments = (data: any): DataComment[] => {
  const comments: DataComment[] = [];

  // 採用コストの評価
  if (data?.costPerHire > 500000) {
    comments.push({
      id: 'cost-warning',
      type: 'warning',
      title: '採用コストが高額',
      message: `一人当たり採用コスト${(data.costPerHire / 10000).toFixed(0)}万円は業界平均を上回っています。`,
      priority: 'high'
    });
  }

  // 定着率のトレンド
  if (data?.retentionRate < 80) {
    comments.push({
      id: 'retention-trend',
      type: 'trend',
      title: '新人定着率の課題',
      message: '1年以内の定着率が80%を下回っています。オンボーディングプロセスの改善が必要です。',
      priority: 'high'
    });
  }

  return comments;
};

// スキル・資格管理レポート用コメント
export const generateSkillComments = (data: any): DataComment[] => {
  const comments: DataComment[] = [];

  // 資格取得率
  comments.push({
    id: 'certification-insight',
    type: 'insight',
    title: '資格取得支援の効果',
    message: '資格取得支援制度により、専門性の高い人材が増加しています。継続的な支援が重要です。',
    priority: 'medium'
  });

  // スキルギャップ
  if (data?.skillGap > 30) {
    comments.push({
      id: 'skill-gap-action',
      type: 'action',
      title: 'スキルギャップの解消',
      message: '重要スキルの不足が見られます。計画的な研修プログラムの実施を推奨します。',
      priority: 'high'
    });
  }

  return comments;
};

// 人件費最適化レポート用コメント
export const generateCostComments = (data: any): DataComment[] => {
  const comments: DataComment[] = [];

  // 人件費率の評価
  if (data?.laborCostRatio > 60) {
    comments.push({
      id: 'cost-ratio-warning',
      type: 'warning',
      title: '人件費率が高水準',
      message: `人件費率${data.laborCostRatio}%は経営を圧迫する可能性があります。効率化施策の検討が必要です。`,
      priority: 'high'
    });
  }

  // 残業コストの分析
  if (data?.overtimeCost > 10000000) {
    comments.push({
      id: 'overtime-cost-insight',
      type: 'interpretation',
      title: '残業コストの削減余地',
      message: '残業コストが年間1,000万円を超えています。人員配置の最適化により大幅な削減が可能です。',
      priority: 'high'
    });
  }

  // ベンチマーク
  comments.push({
    id: 'cost-benchmark',
    type: 'benchmark',
    title: '業界平均との比較',
    message: '医療業界の平均人件費率は55-60%です。効率的な運営には50-55%を目指すことが推奨されます。',
    priority: 'low'
  });

  return comments;
};

// 組織構造最適化レポート用コメント
export const generateOrganizationComments = (data: any): DataComment[] => {
  const comments: DataComment[] = [];

  // スパンオブコントロール
  if (data?.avgSpanOfControl > 10) {
    comments.push({
      id: 'span-warning',
      type: 'warning',
      title: '管理スパンが過大',
      message: '一人の管理者が10名以上を管理しています。マネジメント負荷の軽減が必要です。',
      priority: 'high'
    });
  }

  // 組織階層
  comments.push({
    id: 'hierarchy-insight',
    type: 'insight',
    title: '組織のフラット化効果',
    message: '組織階層の削減により、意思決定スピードの向上とコミュニケーション改善が期待できます。',
    priority: 'medium'
  });

  return comments;
};

// 労働環境分析レポート用コメント
export const generateWorkEnvironmentComments = (data: any): DataComment[] => {
  const comments: DataComment[] = [];

  // 労働環境スコア
  if (data?.environmentScore < 70) {
    comments.push({
      id: 'environment-action',
      type: 'action',
      title: '労働環境の改善',
      message: '職場環境スコアが低い状態です。設備更新、休憩スペースの充実、騒音対策などを検討してください。',
      priority: 'high'
    });
  }

  // 安全衛生
  if (data?.safetyIncidents > 5) {
    comments.push({
      id: 'safety-warning',
      type: 'warning',
      title: '労働災害の増加傾向',
      message: '労働災害が増加しています。安全教育の強化と作業環境の見直しが急務です。',
      priority: 'high'
    });
  }

  // トレンド
  comments.push({
    id: 'wellness-trend',
    type: 'trend',
    title: 'ウェルビーイングの重要性',
    message: '従業員のウェルビーイングへの投資は、生産性向上と離職率低下に直結します。',
    priority: 'medium'
  });

  return comments;
};