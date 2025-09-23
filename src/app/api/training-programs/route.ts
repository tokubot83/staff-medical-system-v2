import { NextRequest, NextResponse } from 'next/server';
import { TrainingProgram, LegalTrainingRequirement } from '@/types/training-system';

// モックデータストア（実際はDBを使用）
let trainingProgramsStore: TrainingProgram[] = [
  {
    id: 'prog_1',
    name: '医療安全管理研修',
    type: 'legal',
    category: '法定研修',
    description: '医療法施行規則に基づく必須研修',
    objectives: [
      '医療事故防止の理解',
      'インシデント・アクシデント対応',
      '医療安全文化の醸成'
    ],
    method: ['OffJT', 'e-learning'],
    duration: { value: 2, unit: 'hours' },
    targetAudience: {
      facilities: ['小原病院', '立神リハ温泉病院'],
      jobCategories: ['全職員']
    },
    evaluation: {
      type: 'test',
      criteria: [
        {
          id: 'crit_1',
          name: '理解度テスト',
          description: '医療安全に関する理解度',
          weight: 100,
          scoreRange: { min: 0, max: 100 }
        }
      ],
      passingScore: 70,
      retakeAllowed: true
    },
    status: 'active',
    createdBy: '教育研修部',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prog_2',
    name: '新入職員オリエンテーション',
    type: 'onboarding',
    category: '基礎研修',
    description: '新入職員向け導入研修プログラム',
    objectives: [
      '法人理念の理解',
      '基本業務の習得',
      '組織文化への適応'
    ],
    method: ['OJT', 'OffJT'],
    duration: { value: 1, unit: 'weeks' },
    targetAudience: {
      employmentTypes: ['新卒', '中途']
    },
    evaluation: {
      type: 'observation',
      criteria: [
        {
          id: 'crit_2',
          name: '業務理解度',
          description: '基本業務の理解と実践',
          weight: 50,
          scoreRange: { min: 0, max: 100 }
        },
        {
          id: 'crit_3',
          name: 'コミュニケーション',
          description: 'チーム内での適切なコミュニケーション',
          weight: 50,
          scoreRange: { min: 0, max: 100 }
        }
      ],
      passingScore: 60,
      retakeAllowed: false
    },
    status: 'active',
    createdBy: '人事部',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// 法定研修要件
const legalRequirements: LegalTrainingRequirement[] = [
  {
    id: 'legal_1',
    name: '医療安全管理研修',
    facilityTypes: ['病院'],
    frequency: '年2回以上',
    duration: '各回1時間以上',
    targetStaff: '全職員',
    legalBasis: '医療法施行規則',
    description: '医療事故防止、インシデント・アクシデント対応、医療安全文化の醸成',
    isActive: true
  },
  {
    id: 'legal_2',
    name: '院内感染対策研修',
    facilityTypes: ['病院'],
    frequency: '年2回以上',
    duration: '各回1時間以上',
    targetStaff: '全職員',
    legalBasis: '医療法施行規則',
    description: '感染予防策、標準予防策、感染症発生時の対応',
    isActive: true
  },
  {
    id: 'legal_3',
    name: '身体拘束適正化研修',
    facilityTypes: ['介護老人保健施設'],
    frequency: '年2回以上',
    duration: '各回30分以上',
    targetStaff: '全職員',
    legalBasis: '介護保険法',
    description: '身体拘束廃止の理念、緊急やむを得ない場合の対応',
    isActive: true
  }
];

// GET: 研修プログラム一覧を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const facility = searchParams.get('facility');
    const status = searchParams.get('status');

    let programs = [...trainingProgramsStore];

    // フィルタリング
    if (type) {
      programs = programs.filter(p => p.type === type);
    }
    if (facility) {
      programs = programs.filter(p =>
        !p.targetAudience.facilities ||
        p.targetAudience.facilities.includes(facility)
      );
    }
    if (status) {
      programs = programs.filter(p => p.status === status);
    }

    return NextResponse.json({
      programs,
      legalRequirements: facility
        ? legalRequirements.filter(req =>
            req.facilityTypes.some(type => facility.includes(type))
          )
        : legalRequirements,
      totalCount: programs.length
    });
  } catch (error) {
    console.error('Failed to fetch training programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training programs' },
      { status: 500 }
    );
  }
}

// POST: 新しい研修プログラムを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newProgram: TrainingProgram = {
      ...body,
      id: `prog_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: body.status || 'draft'
    };

    trainingProgramsStore.push(newProgram);

    return NextResponse.json({
      program: newProgram,
      message: 'Training program created successfully'
    });
  } catch (error) {
    console.error('Failed to create training program:', error);
    return NextResponse.json(
      { error: 'Failed to create training program' },
      { status: 500 }
    );
  }
}

// PUT: 研修プログラムを一括更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { programs } = body;

    if (programs) {
      trainingProgramsStore = programs.map((program: TrainingProgram) => ({
        ...program,
        updatedAt: new Date().toISOString()
      }));
    }

    return NextResponse.json({
      programs: trainingProgramsStore,
      message: 'Training programs updated successfully'
    });
  } catch (error) {
    console.error('Failed to update training programs:', error);
    return NextResponse.json(
      { error: 'Failed to update training programs' },
      { status: 500 }
    );
  }
}