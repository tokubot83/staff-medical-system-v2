import { NextRequest, NextResponse } from 'next/server';
import { HRPolicy, HRPolicyVersion, DEFAULT_HR_POLICIES } from '@/types/hr-policy';

// モックデータストア（実際はDBを使用）
let hrPoliciesStore: HRPolicyVersion = {
  id: 'v1',
  versionNumber: '1.0',
  effectiveDate: '2025-04-01',
  status: 'active',
  policies: DEFAULT_HR_POLICIES.map((policy, index) => ({
    ...policy,
    id: `policy_${index + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
};

// GET: 人事ポリシー一覧を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const version = searchParams.get('version');
    const isActive = searchParams.get('active');

    let policies = hrPoliciesStore.policies;

    // フィルタリング
    if (isActive === 'true') {
      policies = policies.filter(p => p.isActive);
    }

    // ソート（order順）
    policies.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      version: hrPoliciesStore,
      policies,
      totalCount: policies.length,
    });
  } catch (error) {
    console.error('Failed to fetch HR policies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch HR policies' },
      { status: 500 }
    );
  }
}

// POST: 新しい人事ポリシーを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPolicy: HRPolicy = {
      ...body,
      id: `policy_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    hrPoliciesStore.policies.push(newPolicy);

    return NextResponse.json({
      policy: newPolicy,
      message: 'HR policy created successfully',
    });
  } catch (error) {
    console.error('Failed to create HR policy:', error);
    return NextResponse.json(
      { error: 'Failed to create HR policy' },
      { status: 500 }
    );
  }
}

// PUT: 人事ポリシーを一括更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { policies, version } = body;

    if (version) {
      hrPoliciesStore = {
        ...hrPoliciesStore,
        ...version,
        updatedAt: new Date().toISOString(),
      };
    }

    if (policies) {
      hrPoliciesStore.policies = policies.map((policy: HRPolicy) => ({
        ...policy,
        updatedAt: new Date().toISOString(),
      }));
    }

    return NextResponse.json({
      version: hrPoliciesStore,
      message: 'HR policies updated successfully',
    });
  } catch (error) {
    console.error('Failed to update HR policies:', error);
    return NextResponse.json(
      { error: 'Failed to update HR policies' },
      { status: 500 }
    );
  }
}