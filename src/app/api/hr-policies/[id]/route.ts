import { NextRequest, NextResponse } from 'next/server';
import { HRPolicy, DEFAULT_HR_POLICIES } from '@/types/hr-policy';

// モックデータストア（実際はDBを使用）
let hrPoliciesStore: HRPolicy[] = DEFAULT_HR_POLICIES.map((policy, index) => ({
  ...policy,
  id: `policy_${index + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

// GET: 特定の人事ポリシーを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const policy = hrPoliciesStore.find(p => p.id === params.id);

    if (!policy) {
      return NextResponse.json(
        { error: 'HR policy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ policy });
  } catch (error) {
    console.error('Failed to fetch HR policy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch HR policy' },
      { status: 500 }
    );
  }
}

// PATCH: 特定の人事ポリシーを更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const policyIndex = hrPoliciesStore.findIndex(p => p.id === params.id);

    if (policyIndex === -1) {
      return NextResponse.json(
        { error: 'HR policy not found' },
        { status: 404 }
      );
    }

    hrPoliciesStore[policyIndex] = {
      ...hrPoliciesStore[policyIndex],
      ...body,
      id: params.id,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      policy: hrPoliciesStore[policyIndex],
      message: 'HR policy updated successfully',
    });
  } catch (error) {
    console.error('Failed to update HR policy:', error);
    return NextResponse.json(
      { error: 'Failed to update HR policy' },
      { status: 500 }
    );
  }
}

// DELETE: 特定の人事ポリシーを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const policyIndex = hrPoliciesStore.findIndex(p => p.id === params.id);

    if (policyIndex === -1) {
      return NextResponse.json(
        { error: 'HR policy not found' },
        { status: 404 }
      );
    }

    hrPoliciesStore.splice(policyIndex, 1);

    return NextResponse.json({
      message: 'HR policy deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete HR policy:', error);
    return NextResponse.json(
      { error: 'Failed to delete HR policy' },
      { status: 500 }
    );
  }
}