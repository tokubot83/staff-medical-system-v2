import { NextRequest, NextResponse } from 'next/server';
import { EvaluationCategory, DepartmentCustomization, MEDICAL_STANDARD_CATEGORIES } from '@/types/evaluation-items';

// モックデータストア（実際はDBを使用）
let evaluationItemsStore: Record<string, {
  categories: EvaluationCategory[];
  customizations: DepartmentCustomization[];
}> = {};

// GET: 評価項目を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { versionId: string } }
) {
  try {
    const versionId = params.versionId;

    // 既存のデータがあれば返す
    if (evaluationItemsStore[versionId]) {
      return NextResponse.json(evaluationItemsStore[versionId]);
    }

    // なければデフォルトを返す
    const defaultCategories: EvaluationCategory[] = MEDICAL_STANDARD_CATEGORIES.map((cat, idx) => ({
      id: `cat_${idx}`,
      name: cat.name!,
      description: cat.description,
      weight: cat.weight!,
      order: idx,
      items: generateDefaultItems(idx),
      isCustom: false,
    }));

    return NextResponse.json({
      categories: defaultCategories,
      customizations: [],
    });
  } catch (error) {
    console.error('Failed to fetch evaluation items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluation items' },
      { status: 500 }
    );
  }
}

// PUT: 評価項目を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { versionId: string } }
) {
  try {
    const versionId = params.versionId;
    const body = await request.json();
    const { categories, customizations } = body;

    // データを保存（実際はDBに保存）
    evaluationItemsStore[versionId] = {
      categories: categories || [],
      customizations: customizations || [],
    };

    return NextResponse.json({
      message: 'Evaluation items updated successfully',
      data: evaluationItemsStore[versionId],
    });
  } catch (error) {
    console.error('Failed to update evaluation items:', error);
    return NextResponse.json(
      { error: 'Failed to update evaluation items' },
      { status: 500 }
    );
  }
}

// DELETE: 評価項目を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { versionId: string } }
) {
  try {
    const versionId = params.versionId;

    delete evaluationItemsStore[versionId];

    return NextResponse.json({
      message: 'Evaluation items deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete evaluation items:', error);
    return NextResponse.json(
      { error: 'Failed to delete evaluation items' },
      { status: 500 }
    );
  }
}

// デフォルトの評価項目を生成
function generateDefaultItems(categoryIndex: number) {
  const itemTemplates = [
    // 専門技術
    [
      { name: '専門知識の習熟度', description: '業務に必要な専門知識を身につけているか' },
      { name: '技術スキルの実践', description: '習得した技術を実務で適切に活用できるか' },
      { name: '最新知識の習得', description: '新しい知識・技術を積極的に学習しているか' },
    ],
    // 患者対応
    [
      { name: '患者への配慮', description: '患者の心情に配慮した対応ができるか' },
      { name: 'コミュニケーション', description: '患者・家族と適切にコミュニケーションが取れるか' },
      { name: '説明能力', description: '処置や治療について分かりやすく説明できるか' },
    ],
    // チーム医療
    [
      { name: '情報共有', description: 'チーム内で適切に情報共有を行っているか' },
      { name: '協調性', description: '他職種と協力して業務を遂行できるか' },
      { name: 'リーダーシップ', description: '必要に応じてリーダーシップを発揮できるか' },
    ],
    // 安全管理
    [
      { name: 'リスク認識', description: '医療リスクを適切に認識し対応できるか' },
      { name: '安全確認', description: '安全確認手順を確実に実施しているか' },
      { name: 'インシデント対応', description: 'インシデント発生時に適切に対応できるか' },
    ],
    // 改善活動
    [
      { name: '問題発見', description: '業務上の問題点を発見できるか' },
      { name: '改善提案', description: '具体的な改善策を提案できるか' },
      { name: '実行力', description: '改善活動を実際に推進できるか' },
    ],
  ];

  const templates = itemTemplates[categoryIndex] || itemTemplates[0];

  return templates.map((template, idx) => ({
    id: `item_${categoryIndex}_${idx}`,
    categoryId: `cat_${categoryIndex}`,
    name: template.name,
    description: template.description,
    type: 'rating' as const,
    required: idx === 0, // 各カテゴリーの最初の項目を必須に
    weight: Math.floor(100 / templates.length),
    order: idx,
    criteria: [
      { level: 5, label: '優秀', description: '期待を大きく上回る' },
      { level: 4, label: '良好', description: '期待を上回る' },
      { level: 3, label: '標準', description: '期待通り' },
      { level: 2, label: '要改善', description: '期待を下回る' },
      { level: 1, label: '不足', description: '大きく改善が必要' },
    ],
  }));
}