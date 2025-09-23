import { NextRequest, NextResponse } from 'next/server';
import { SupportPlan } from '@/types/career-support';

// POST: 評価結果に基づく支援プランを自動生成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { staffId, evaluationScore, finalGrade, trend } = body;

    if (!staffId || evaluationScore === undefined) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // 支援プランを生成
    let supportPlan: SupportPlan;

    if (evaluationScore >= 85) {
      // 高評価者向けプラン
      supportPlan = {
        staffId,
        priority: 'MEDIUM',
        actions: [
          'キャリアアップ面談の実施',
          '次期リーダー育成プログラムへの参加打診',
          '上位職務への昇進検討',
          '専門資格取得の支援',
          'プロジェクトリーダーの機会提供',
        ],
        timeline: '3ヶ月以内',
        expectedOutcomes: [
          'リーダーシップスキルの向上',
          '組織への更なる貢献',
          '後進育成能力の獲得',
        ],
        resources: [
          {
            type: 'training',
            description: 'リーダーシップ研修',
            allocation: '月1回×3ヶ月',
            cost: 150000,
          },
          {
            type: 'human',
            description: 'エグゼクティブメンター',
            allocation: '月2回の面談',
          },
        ],
        dbRecord: {
          triggerType: 'high_performer',
          supportLevel: 'A',
          reason: `評価スコア${evaluationScore}点（${finalGrade}評価）の高パフォーマー`,
          createdAt: new Date().toISOString(),
        },
      };
    } else if (evaluationScore >= 60) {
      // 標準評価者向けプラン
      supportPlan = {
        staffId,
        priority: 'MEDIUM',
        actions: [
          '定期キャリア面談の実施',
          'スキルアップ研修の提供',
          '目標設定のサポート',
          '業務改善提案の奨励',
        ],
        timeline: '6ヶ月',
        expectedOutcomes: [
          'スキルの向上',
          '業務効率の改善',
          'モチベーションの維持',
        ],
        resources: [
          {
            type: 'training',
            description: '業務スキル向上研修',
            allocation: '月1回×6ヶ月',
            cost: 80000,
          },
        ],
        dbRecord: {
          triggerType: 'standard',
          supportLevel: 'B',
          reason: `評価スコア${evaluationScore}点（${finalGrade}評価）の標準パフォーマー`,
          createdAt: new Date().toISOString(),
        },
      };
    } else {
      // 要支援者向けプラン
      supportPlan = {
        staffId,
        priority: 'HIGH',
        actions: [
          '緊急の個別面談実施',
          'メンター制度の即時適用',
          '業務負荷の見直し',
          '週次フォローアップの開始',
          '必要に応じた配置転換の検討',
          'メンタルヘルスサポートの提供',
        ],
        timeline: '1ヶ月以内に開始',
        expectedOutcomes: [
          'パフォーマンスの改善',
          'ストレスレベルの軽減',
          '適正配置の実現',
          'モチベーションの回復',
        ],
        resources: [
          {
            type: 'human',
            description: '専任メンター',
            allocation: '週2回の面談',
          },
          {
            type: 'training',
            description: '基礎スキル研修',
            allocation: '週1回×3ヶ月',
            cost: 120000,
          },
          {
            type: 'human',
            description: '産業医・カウンセラー',
            allocation: '必要に応じて',
          },
        ],
        dbRecord: {
          triggerType: 'needs_support',
          supportLevel: 'C',
          reason: `評価スコア${evaluationScore}点（${finalGrade}評価）要支援`,
          createdAt: new Date().toISOString(),
        },
      };
    }

    // トレンドに基づく調整
    if (trend === 'declining' && supportPlan.priority !== 'HIGH') {
      supportPlan.priority = 'HIGH';
      supportPlan.actions.unshift('低下傾向の原因分析面談');
    } else if (trend === 'improving' && supportPlan.priority === 'HIGH') {
      supportPlan.priority = 'MEDIUM';
      supportPlan.actions.push('改善の継続支援');
    }

    return NextResponse.json(
      {
        supportPlan,
        message: 'Support plan generated successfully',
        metadata: {
          generatedAt: new Date().toISOString(),
          evaluationData: {
            score: evaluationScore,
            grade: finalGrade,
            trend,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to generate support plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate support plan' },
      { status: 500 }
    );
  }
}