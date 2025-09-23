import { NextRequest, NextResponse } from 'next/server';
import { ProbationProgram } from '@/types/training-system';

// モックデータ：試用期間活用プログラム
const defaultProbationProgram: ProbationProgram = {
  id: 'prob_1',
  name: '試用期間を活用した段階的評価システム',
  description: '3ヶ月間で段階的に評価し、最適配置を決定する革新的人材戦略',
  phases: [
    {
      phaseNumber: 1,
      name: '基礎OJT期間',
      duration: { value: 1, unit: 'months' },
      objectives: [
        '入職施設での基本業務習得',
        '指導者による日常評価',
        '基本適性・人間関係確認'
      ],
      activities: [
        {
          id: 'act_1_1',
          type: 'training',
          name: '基本業務研修',
          description: '配属部署での基本業務を習得',
          responsible: '部署指導者'
        },
        {
          id: 'act_1_2',
          type: 'mentoring',
          name: '週1回の面談',
          description: '指導者との定期面談',
          responsible: '直属上司',
          schedule: '毎週金曜日'
        }
      ],
      evaluation: {
        method: '日常観察評価',
        evaluators: ['直属上司', '部署指導者'],
        criteria: ['業務理解度', '取り組み姿勢', 'コミュニケーション'],
        feedbackRequired: true
      },
      milestone: ['基本業務の独立遂行', '部署内人間関係の構築']
    },
    {
      phaseNumber: 2,
      name: '適性確認期間',
      duration: { value: 1, unit: 'months' },
      objectives: [
        '他施設での短期体験（1-2週間）',
        '複数環境での適性比較評価',
        '本人の志向確認'
      ],
      activities: [
        {
          id: 'act_2_1',
          type: 'rotation',
          name: '他施設体験',
          description: '急性期・回復期・介護の各施設で実務体験',
          responsible: '人財統括本部'
        },
        {
          id: 'act_2_2',
          type: 'evaluation',
          name: '適性評価面談',
          description: '各施設での適性を評価',
          responsible: '各施設責任者'
        }
      ],
      evaluation: {
        method: '多面評価',
        evaluators: ['各施設責任者', '本人', '人財統括本部'],
        criteria: ['施設適性', '職種適性', '成長可能性'],
        feedbackRequired: true
      },
      milestone: ['全施設での体験完了', '適性評価レポート作成']
    },
    {
      phaseNumber: 3,
      name: '配置決定期間',
      duration: { value: 1, unit: 'months' },
      objectives: [
        '総合的な適性評価',
        '本人・現場・法人の三者協議',
        '正式配置決定'
      ],
      activities: [
        {
          id: 'act_3_1',
          type: 'meeting',
          name: '三者協議',
          description: '本人の希望と施設ニーズのマッチング',
          responsible: '人財統括本部'
        },
        {
          id: 'act_3_2',
          type: 'evaluation',
          name: '最終評価',
          description: '3ヶ月間の総合評価',
          responsible: '配置決定委員会'
        }
      ],
      evaluation: {
        method: '総合評価',
        evaluators: ['配置決定委員会'],
        criteria: ['技術適性', '組織適合性', '成長性', '本人希望'],
        feedbackRequired: true
      },
      milestone: ['配置決定', '正式雇用契約']
    }
  ],
  evaluationCriteria: {
    technicalSkills: [
      {
        id: 'tech_1',
        name: '専門知識',
        description: '職務に必要な専門知識の習得度',
        weight: 30,
        scoreRange: { min: 0, max: 100 }
      },
      {
        id: 'tech_2',
        name: '実務スキル',
        description: '実際の業務遂行能力',
        weight: 35,
        scoreRange: { min: 0, max: 100 }
      }
    ],
    softSkills: [
      {
        id: 'soft_1',
        name: 'コミュニケーション',
        description: 'チーム内での円滑な意思疎通',
        weight: 20,
        scoreRange: { min: 0, max: 100 }
      }
    ],
    organizationalFit: [
      {
        id: 'org_1',
        name: '組織文化適合',
        description: '法人の理念・文化への適合度',
        weight: 15,
        scoreRange: { min: 0, max: 100 }
      }
    ],
    overallThreshold: 60
  },
  decisionProcess: {
    participants: ['本人', '現場責任者', '人財統括本部'],
    method: 'consensus',
    criteria: [
      '3ヶ月間の評価結果',
      '本人の希望',
      '施設のニーズ',
      '将来的なキャリア展望'
    ],
    timeline: '試用期間終了2週間前'
  },
  facilityRotation: {
    enabled: true,
    facilities: [
      {
        facilityId: 'fac_1',
        facilityName: '小原病院',
        facilityType: '急性期',
        duration: 5,
        departments: ['内科', '外科'],
        supervisor: '病院事務長'
      },
      {
        facilityId: 'fac_2',
        facilityName: '立神リハ温泉病院',
        facilityType: '回復期',
        duration: 5,
        departments: ['リハビリテーション科'],
        supervisor: 'リハビリ科長'
      },
      {
        facilityId: 'fac_3',
        facilityName: 'エスポワール立神',
        facilityType: '介護',
        duration: 4,
        departments: ['介護部'],
        supervisor: '施設長'
      }
    ],
    schedule: '第2月の1-2週目',
    evaluationMethod: '各施設責任者による評価シート'
  },
  status: 'active'
};

let probationProgramsStore: ProbationProgram[] = [defaultProbationProgram];

// GET: 試用期間プログラム一覧を取得
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      programs: probationProgramsStore,
      totalCount: probationProgramsStore.length
    });
  } catch (error) {
    console.error('Failed to fetch probation programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch probation programs' },
      { status: 500 }
    );
  }
}

// POST: 新しい試用期間プログラムを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newProgram: ProbationProgram = {
      ...body,
      id: `prob_${Date.now()}`,
      status: body.status || 'draft'
    };

    probationProgramsStore.push(newProgram);

    return NextResponse.json({
      program: newProgram,
      message: 'Probation program created successfully'
    });
  } catch (error) {
    console.error('Failed to create probation program:', error);
    return NextResponse.json(
      { error: 'Failed to create probation program' },
      { status: 500 }
    );
  }
}

// PUT: 試用期間プログラムを更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { programId, updates } = body;

    const index = probationProgramsStore.findIndex(p => p.id === programId);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Probation program not found' },
        { status: 404 }
      );
    }

    probationProgramsStore[index] = {
      ...probationProgramsStore[index],
      ...updates
    };

    return NextResponse.json({
      program: probationProgramsStore[index],
      message: 'Probation program updated successfully'
    });
  } catch (error) {
    console.error('Failed to update probation program:', error);
    return NextResponse.json(
      { error: 'Failed to update probation program' },
      { status: 500 }
    );
  }
}