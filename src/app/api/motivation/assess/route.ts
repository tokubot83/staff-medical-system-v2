import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for motivation assessment
const assessmentSchema = z.object({
  staffId: z.number().positive(),
  interviewId: z.number().positive().optional(),
  motivationTypeId: z.enum(['growth', 'recognition', 'stability', 'teamwork', 'efficiency', 'compensation', 'creativity']),
  confidenceLevel: z.enum(['high', 'medium', 'low']),
  notes: z.string().optional(),
  assessedBy: z.number().positive()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = assessmentSchema.parse(body);

    // In a real implementation, this would use Prisma client
    // For now, we'll return a mock response
    const mockResponse = {
      success: true,
      data: {
        historyId: Math.floor(Math.random() * 1000),
        motivationType: {
          id: validatedData.motivationTypeId,
          typeName: getMotivationTypeName(validatedData.motivationTypeId),
          label: getMotivationTypeLabel(validatedData.motivationTypeId),
          description: getMotivationTypeDescription(validatedData.motivationTypeId),
          approach: getMotivationTypeApproach(validatedData.motivationTypeId),
          keywords: getMotivationTypeKeywords(validatedData.motivationTypeId),
          displayOrder: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        recommendedActions: getRecommendedActions(validatedData.motivationTypeId)
      }
    };

    return NextResponse.json(mockResponse, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Motivation assessment error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getMotivationTypeName(typeId: string): string {
  const names: Record<string, string> = {
    growth: '成長・挑戦型',
    recognition: '評価・承認型',
    stability: '安定・安心型',
    teamwork: '関係・調和型',
    efficiency: '効率・合理型',
    compensation: '報酬・待遇型',
    creativity: '自由・創造型'
  };
  return names[typeId] || typeId;
}

function getMotivationTypeLabel(typeId: string): string {
  const labels: Record<string, string> = {
    growth: '新しいスキルを身につけた時',
    recognition: '上司や同僚に褒められた時',
    stability: '安定した環境で確実に成果を出せた時',
    teamwork: 'チームで協力して目標を達成した時',
    efficiency: '無駄な作業を改善・効率化できた時',
    compensation: '良い待遇で働けている時',
    creativity: '自分らしい方法で創造的な成果を出せた時'
  };
  return labels[typeId] || typeId;
}

function getMotivationTypeDescription(typeId: string): string {
  const descriptions: Record<string, string> = {
    growth: '学習意欲が高く、新しいことへの挑戦を好む。スキルアップや成長実感が主なモチベーション。',
    recognition: '他者からの評価や承認を重視。成果を認められることで強いモチベーションを感じる。',
    stability: 'リスクを避け、確実性を重視。予測可能で安定した環境を好む。',
    teamwork: '人間関係やチームワークを重視。協力して成果を出すことに喜びを感じる。',
    efficiency: '効率性と合理性を追求。プロセス改善や最適化に強い関心を持つ。',
    compensation: '給与や福利厚生などの待遇を重視。実利的なメリットがモチベーションの源泉。',
    creativity: '自由度と創造性を重視。独自のアプローチで成果を出すことを好む。'
  };
  return descriptions[typeId] || typeId;
}

function getMotivationTypeApproach(typeId: string): string {
  const approaches: Record<string, string> = {
    growth: '研修機会の提供、新規プロジェクトへの参加、スキルアップ支援、昇進パスの明示',
    recognition: '定期的なフィードバック、表彰制度の活用、成果の可視化、昇進基準の明確化',
    stability: '段階的な変化、詳細な説明、マニュアル整備、不安要素の事前解消',
    teamwork: 'チーム業務の機会、メンター制度、コーディネーター役の委任、協調的な環境作り',
    efficiency: '業務効率化プロジェクト、DX推進、プロセス改善の機会、最適化ツールの導入',
    compensation: '昇給機会の明示、福利厚生の充実、副業許可、実績に応じた報酬設計',
    creativity: 'フレックス制度、クリエイティブ業務の委任、裁量権の拡大、独自アプローチの尊重'
  };
  return approaches[typeId] || '';
}

function getMotivationTypeKeywords(typeId: string): string[] {
  const keywords: Record<string, string[]> = {
    growth: ['スキルアップ', '新規事業', 'チャレンジ', '学習', '成長'],
    recognition: ['評価', '表彰', '昇進', '承認', '認知'],
    stability: ['安定', '確実', '段階的', '安心', 'リスク回避'],
    teamwork: ['チーム', '協力', '支援', '人間関係', '調和'],
    efficiency: ['効率', '合理的', '最適化', '改善', 'DX'],
    compensation: ['給与', '福利厚生', '待遇', '報酬', '実利'],
    creativity: ['自由', '創造性', '個性', '独自性', '裁量']
  };
  return keywords[typeId] || [];
}

function getRecommendedActions(typeId: string) {
  const actions: Record<string, any[]> = {
    growth: [
      {
        id: 1,
        motivationTypeId: typeId,
        actionCategory: 'training',
        actionName: '新規研修プログラムへの参加',
        actionDescription: '最新のスキル習得のための研修機会を提供',
        priority: 1,
        isActive: true
      },
      {
        id: 2,
        motivationTypeId: typeId,
        actionCategory: 'project',
        actionName: '新規プロジェクトのリーダー任命',
        actionDescription: '挑戦的なプロジェクトでリーダーシップを発揮する機会',
        priority: 2,
        isActive: true
      }
    ],
    recognition: [
      {
        id: 3,
        motivationTypeId: typeId,
        actionCategory: 'reward',
        actionName: '月間優秀職員表彰',
        actionDescription: '成果を公開的に評価・表彰する制度',
        priority: 1,
        isActive: true
      }
    ],
    // Add other types as needed
  };
  return actions[typeId] || [];
}