import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for team compatibility analysis
const teamCompatibilitySchema = z.object({
  teamId: z.string(),
  teamName: z.string().optional(),
  memberIds: z.array(z.number().positive()).min(2)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = teamCompatibilitySchema.parse(body);

    // Mock team member data with motivation types
    const mockMembers = validatedData.memberIds.map((id, index) => {
      const types = ['growth', 'recognition', 'stability', 'teamwork', 'efficiency', 'compensation', 'creativity'];
      const names = ['田中太郎', '佐藤花子', '鈴木一郎', '高橋美咲', '伊藤健太'];
      return {
        staffId: id,
        name: names[index % names.length],
        motivationType: types[index % types.length] as any
      };
    });

    // Calculate compatibility matrix
    const compatibilityMatrix = calculateCompatibilityMatrix(mockMembers);
    
    // Determine overall compatibility
    const overallCompatibility = calculateOverallCompatibility(compatibilityMatrix);
    
    // Generate recommendations
    const recommendations = generateRecommendations(mockMembers, compatibilityMatrix);

    const analysis = {
      teamId: validatedData.teamId,
      teamName: validatedData.teamName || `チーム${validatedData.teamId}`,
      members: mockMembers.map(member => ({
        ...member,
        typeName: getMotivationTypeName(member.motivationType)
      })),
      compatibilityMatrix: compatibilityMatrix,
      overallCompatibility: overallCompatibility,
      recommendations: recommendations,
      insights: {
        strongPairs: compatibilityMatrix
          .filter(pair => pair.compatibilityLevel === 'excellent' || pair.compatibilityLevel === 'good')
          .length,
        cautionPairs: compatibilityMatrix
          .filter(pair => pair.compatibilityLevel === 'caution' || pair.compatibilityLevel === 'difficult')
          .length,
        diversityScore: calculateDiversityScore(mockMembers)
      }
    };

    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Team compatibility error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateCompatibilityMatrix(members: any[]) {
  const matrix = [];
  
  // Compatibility rules based on motivation types
  const compatibilityRules: Record<string, Record<string, string>> = {
    growth: {
      growth: 'excellent',
      recognition: 'good',
      stability: 'neutral',
      teamwork: 'good',
      efficiency: 'excellent',
      compensation: 'neutral',
      creativity: 'good'
    },
    recognition: {
      growth: 'good',
      recognition: 'caution',
      stability: 'neutral',
      teamwork: 'good',
      efficiency: 'neutral',
      compensation: 'caution',
      creativity: 'neutral'
    },
    stability: {
      growth: 'neutral',
      recognition: 'neutral',
      stability: 'good',
      teamwork: 'excellent',
      efficiency: 'neutral',
      compensation: 'good',
      creativity: 'difficult'
    },
    teamwork: {
      growth: 'good',
      recognition: 'good',
      stability: 'excellent',
      teamwork: 'excellent',
      efficiency: 'good',
      compensation: 'neutral',
      creativity: 'neutral'
    },
    efficiency: {
      growth: 'excellent',
      recognition: 'neutral',
      stability: 'neutral',
      teamwork: 'good',
      efficiency: 'good',
      compensation: 'neutral',
      creativity: 'caution'
    },
    compensation: {
      growth: 'neutral',
      recognition: 'caution',
      stability: 'good',
      teamwork: 'neutral',
      efficiency: 'neutral',
      compensation: 'caution',
      creativity: 'neutral'
    },
    creativity: {
      growth: 'good',
      recognition: 'neutral',
      stability: 'difficult',
      teamwork: 'neutral',
      efficiency: 'caution',
      compensation: 'neutral',
      creativity: 'excellent'
    }
  };

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const member1 = members[i];
      const member2 = members[j];
      const compatibilityLevel = compatibilityRules[member1.motivationType]?.[member2.motivationType] || 'neutral';
      
      matrix.push({
        staff1Id: member1.staffId,
        staff1Name: member1.name,
        staff1Type: member1.motivationType,
        staff2Id: member2.staffId,
        staff2Name: member2.name,
        staff2Type: member2.motivationType,
        compatibilityLevel: compatibilityLevel,
        description: getCompatibilityDescription(member1.motivationType, member2.motivationType, compatibilityLevel)
      });
    }
  }

  return matrix;
}

function calculateOverallCompatibility(matrix: any[]) {
  const levels = matrix.map(pair => pair.compatibilityLevel);
  const excellentCount = levels.filter(l => l === 'excellent').length;
  const goodCount = levels.filter(l => l === 'good').length;
  const neutralCount = levels.filter(l => l === 'neutral').length;
  const cautionCount = levels.filter(l => l === 'caution').length;
  const difficultCount = levels.filter(l => l === 'difficult').length;

  const totalPairs = matrix.length;
  const positiveRate = (excellentCount + goodCount) / totalPairs;

  if (positiveRate >= 0.7) return 'excellent';
  if (positiveRate >= 0.5) return 'good';
  if (positiveRate >= 0.3) return 'neutral';
  if (difficultCount === 0) return 'caution';
  return 'difficult';
}

function generateRecommendations(members: any[], matrix: any[]) {
  const recommendations = [];
  
  // Check for team diversity
  const uniqueTypes = new Set(members.map(m => m.motivationType)).size;
  if (uniqueTypes >= 4) {
    recommendations.push('チームの動機タイプが多様で、様々な視点からの問題解決が期待できます');
  } else if (uniqueTypes <= 2) {
    recommendations.push('動機タイプの多様性を高めるため、異なるタイプのメンバーの追加を検討してください');
  }

  // Check for difficult pairs
  const difficultPairs = matrix.filter(pair => pair.compatibilityLevel === 'difficult');
  if (difficultPairs.length > 0) {
    recommendations.push('相性の難しいペアがあります。定期的なコミュニケーションの機会を設けることをお勧めします');
  }

  // Check for excellent pairs
  const excellentPairs = matrix.filter(pair => pair.compatibilityLevel === 'excellent');
  if (excellentPairs.length > 0) {
    recommendations.push('相性の良いペアを活用したペアワークやメンター制度の導入を検討してください');
  }

  return recommendations;
}

function calculateDiversityScore(members: any[]) {
  const uniqueTypes = new Set(members.map(m => m.motivationType)).size;
  return Math.round((uniqueTypes / 7) * 100); // 7 types total
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

function getCompatibilityDescription(type1: string, type2: string, level: string): string {
  const descriptions: Record<string, string> = {
    excellent: '非常に相性が良く、互いを高め合う関係です',
    good: '良い相性で、協力してより良い成果を出せます',
    neutral: '特に問題のない組み合わせです',
    caution: '注意が必要な組み合わせ。定期的なコミュニケーションを心がけてください',
    difficult: '相性が難しい組み合わせ。慎重な管理とフォローが必要です'
  };
  return descriptions[level] || '';
}