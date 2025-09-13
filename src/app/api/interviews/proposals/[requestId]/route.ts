import { NextRequest, NextResponse } from 'next/server';
import { AIOptimizationEngine } from '@/services/ai-optimization-engine';
import {
  ProposalsResponse,
  InterviewRecommendation
} from '@/types/pattern-d-interview';

/**
 * GET /api/interviews/proposals/{requestId}
 * AI最適化処理の結果（推薦候補）を取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params;

    if (!requestId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request ID is required'
        },
        { status: 400 }
      );
    }

    // 1. 処理状況の確認
    const processingStatus = await getProcessingStatus(requestId);

    if (!processingStatus) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request not found',
          message: '指定された申込が見つかりません。'
        },
        { status: 404 }
      );
    }

    if (processingStatus.status === 'processing') {
      // まだ処理中
      return NextResponse.json(
        {
          success: false,
          error: 'Processing in progress',
          message: 'まだ候補を調整中です。もう少しお待ちください。',
          estimatedCompletion: processingStatus.estimatedCompletion
        },
        { status: 202 }
      );
    }

    if (processingStatus.status === 'failed') {
      // 処理失敗
      return NextResponse.json(
        {
          success: false,
          error: 'Processing failed',
          message: 'AI最適化に失敗しました。即時予約をお試しください。',
          fallbackOptions: [
            '即時予約への切り替え',
            '人事部直接相談 (内線1234)'
          ]
        },
        { status: 500 }
      );
    }

    // 2. AI最適化結果の取得
    const optimizationResult = await getOptimizationResult(requestId);

    if (!optimizationResult || optimizationResult.recommendations.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No recommendations available',
          message: 'ご希望に合う候補が見つかりませんでした。条件を変更して再試行してください。',
          suggestions: [
            '希望時間帯を広げてみる',
            '希望日を追加する',
            '担当者の指名を「おまかせ」にする'
          ]
        },
        { status: 404 }
      );
    }

    // 3. 職員向けに推薦候補を整形
    const staffFriendlyRecommendations = optimizationResult.recommendations.map(
      (rec, index) => ({
        ...rec,
        // AI技術詳細を隠した自然な表現
        aiReasoning: {
          ...rec.aiReasoning,
          summary: convertToNaturalLanguage(rec.aiReasoning.summary),
          matchingFactors: rec.aiReasoning.matchingFactors.map(
            factor => convertToNaturalLanguage(factor)
          )
        },
        // 推薦順位の表示
        rank: index + 1,
        rankingReason: generateRankingReason(rec, index)
      })
    );

    // 4. レスポンス作成
    const response: ProposalsResponse = {
      requestId,
      proposals: staffFriendlyRecommendations,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後
      contactInfo: {
        urgentPhone: '内線1234',
        email: 'hr-support@hospital.jp'
      },
      metadata: {
        ...optimizationResult.metadata,
        // 技術詳細を職員向けに変換
        processingModel: '面談最適化システム v2.1',
        algorithmsUsed: ['職員マッチング', 'スケジュール調整', '満足度予測'],
        dataPrivacy: '院内完結処理・個人情報保護完全対応'
      }
    };

    // 5. アクセスログ記録
    await logProposalAccess(requestId, staffFriendlyRecommendations.length);

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Failed to fetch proposals:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: '推薦候補の取得に失敗しました。再度お試しください。'
    }, { status: 500 });
  }
}

/**
 * 処理状況取得
 */
async function getProcessingStatus(requestId: string) {
  // TODO: Redis/DB から処理状況を取得
  // 現在は簡易実装
  const mockStatuses = new Map([
    ['REQ-123-completed', { status: 'completed', estimatedCompletion: null }],
    ['REQ-456-processing', { status: 'processing', estimatedCompletion: '2分後' }],
    ['REQ-789-failed', { status: 'failed', estimatedCompletion: null }]
  ]);

  // リクエストIDに基づく判定（デモ用）
  if (requestId.includes('processing')) {
    return { status: 'processing', estimatedCompletion: '1-2分後' };
  }
  if (requestId.includes('failed')) {
    return { status: 'failed', estimatedCompletion: null };
  }

  return { status: 'completed', estimatedCompletion: null };
}

/**
 * AI最適化結果取得
 */
async function getOptimizationResult(requestId: string) {
  // TODO: 実際のAI最適化結果を取得
  // 現在はモック結果を返す

  const mockRecommendations: InterviewRecommendation[] = [
    {
      id: 'REC-001',
      confidence: 92,
      interviewer: {
        id: 'INT-001',
        name: '田中美香子',
        title: '看護師長',
        department: 'キャリア支援室',
        experience: '看護師15年、キャリア相談専門5年',
        specialties: ['キャリア開発', '専門分野選択', '資格取得支援']
      },
      schedule: {
        date: '2025-09-20',
        time: '14:30',
        duration: 45,
        location: '相談室A',
        format: 'face_to_face'
      },
      aiReasoning: {
        matchingFactors: [
          'AI_DETECTED_DEPARTMENT_MATCH',
          'AI_EXPERIENCE_COMPATIBILITY',
          'AI_SCHEDULE_OPTIMIZATION',
          'AI_SATISFACTION_PREDICTION_HIGH'
        ],
        summary: 'AI_ANALYSIS_OPTIMAL_MATCH_CAREER_SPECIALTY',
        detailedReasons: [
          'SPECIALTY_MATCH_95_PERCENT',
          'SCHEDULE_AVAILABILITY_PERFECT',
          'HISTORICAL_SATISFACTION_HIGH'
        ],
        alternativeOptions: [
          '9/21(木) 15:00でも対応可能',
          '30分版での実施も選択可能'
        ]
      },
      staffFriendlyDisplay: {
        title: '田中美香子 看護師長',
        summary: 'キャリア相談の専門家として最適',
        highlights: [
          '同じ内科病棟出身',
          'キャリア相談専門5年',
          '希望時間にピッタリ空いている'
        ]
      }
    },
    {
      id: 'REC-002',
      confidence: 87,
      interviewer: {
        id: 'INT-002',
        name: '佐藤健一',
        title: '看護部主任',
        department: '教育研修部',
        experience: '看護師12年、新人指導専門3年'
      },
      schedule: {
        date: '2025-09-21',
        time: '16:00',
        duration: 30,
        location: '研修室B',
        format: 'face_to_face'
      },
      aiReasoning: {
        matchingFactors: [
          'AI_AGE_COMPATIBILITY',
          'AI_TRAINING_SPECIALIZATION',
          'AI_SCHEDULE_MATCH'
        ],
        summary: 'AI_ANALYSIS_GOOD_MATCH_PEER_SUPPORT',
        detailedReasons: [
          'PEER_AGE_SUPPORT_EFFECTIVE',
          'TRAINING_SPECIALIZATION_MATCH'
        ],
        alternativeOptions: [
          '時間延長も可能'
        ]
      },
      staffFriendlyDisplay: {
        title: '佐藤健一 看護部主任',
        summary: '同年代として相談しやすい環境',
        highlights: [
          '新人・若手職員のキャリア支援専門',
          '希望日時に完全一致',
          '相談しやすい雰囲気'
        ]
      }
    }
  ];

  return {
    requestId,
    processingTime: 4.2,
    confidence: 89.5,
    recommendations: mockRecommendations,
    alternativeOptions: [],
    metadata: {
      totalCandidates: 12,
      selectedTop: 2,
      processingModel: 'interview-optimization-v2.1',
      algorithmsUsed: ['content_based', 'collaborative_filtering', 'schedule_optimization'],
      dataPrivacy: '完全ローカル処理・外部送信なし',
      qualityScore: 89.5
    }
  };
}

/**
 * AI技術用語を自然言語に変換
 */
function convertToNaturalLanguage(aiText: string): string {
  const conversions: Record<string, string> = {
    'AI_DETECTED_DEPARTMENT_MATCH': '同じ部署の経験があります',
    'AI_EXPERIENCE_COMPATIBILITY': '経験レベルが適しています',
    'AI_SCHEDULE_OPTIMIZATION': 'スケジュールが最適です',
    'AI_SATISFACTION_PREDICTION_HIGH': '高い満足度が期待できます',
    'AI_ANALYSIS_OPTIMAL_MATCH_CAREER_SPECIALTY': 'あなたのキャリア相談に最も適した担当者です',
    'AI_ANALYSIS_GOOD_MATCH_PEER_SUPPORT': '同世代のサポートが受けられます',
    'SPECIALTY_MATCH_95_PERCENT': 'あなたの相談内容にとても詳しいです',
    'SCHEDULE_AVAILABILITY_PERFECT': 'ご希望の時間にちょうど空いています',
    'HISTORICAL_SATISFACTION_HIGH': '過去の相談者からの評価が高いです',
    'PEER_AGE_SUPPORT_EFFECTIVE': '同年代として相談しやすい関係です',
    'TRAINING_SPECIALIZATION_MATCH': '研修・教育分野の専門家です'
  };

  return conversions[aiText] || aiText;
}

/**
 * 推薦順位の理由生成
 */
function generateRankingReason(recommendation: InterviewRecommendation, index: number): string {
  switch (index) {
    case 0:
      return 'あなたのご希望に最も適しています';
    case 1:
      return '代替候補として良い選択肢です';
    case 2:
      return 'その他のご提案です';
    default:
      return '';
  }
}

/**
 * 提案アクセスログ
 */
async function logProposalAccess(requestId: string, proposalCount: number) {
  const logEntry = {
    requestId,
    timestamp: new Date().toISOString(),
    action: 'proposals_accessed',
    proposalCount,
    source: 'voicedrive'
  };

  // TODO: ログDB保存
  console.log('Proposals accessed:', logEntry);
}