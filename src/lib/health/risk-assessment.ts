/**
 * 健康リスク評価アルゴリズム
 * 健診データから各種疾患リスクを評価し、スコアリングする
 */

export interface HealthData {
  // 基本測定値
  bmi?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;

  // 血液検査
  ldlCholesterol?: number;  // LDLコレステロール
  hdlCholesterol?: number;  // HDLコレステロール
  triglycerides?: number;   // 中性脂肪
  bloodGlucose?: number;    // 血糖値
  hba1c?: number;          // HbA1c

  // 肝機能
  ast?: number;  // GOT
  alt?: number;  // GPT
  gammaGtp?: number;

  // 腎機能
  creatinine?: number;
  uricAcid?: number;

  // その他
  age: number;
  gender: 'male' | 'female';
  smokingStatus?: 'never' | 'former' | 'current';
  drinkingFrequency?: 'none' | 'occasional' | 'regular' | 'heavy';
}

export interface RiskScore {
  category: string;
  score: number;  // 0-100
  level: 'low' | 'medium' | 'high' | 'very-high';
  factors: string[];
  recommendations: string[];
}

export interface OverallRiskAssessment {
  overallScore: number;
  overallLevel: 'low' | 'medium' | 'high' | 'very-high';
  riskScores: RiskScore[];
  priorityActions: string[];
  nextCheckupRecommendation: string;
}

/**
 * メタボリックシンドロームリスク評価
 */
function assessMetabolicSyndrome(data: HealthData): RiskScore {
  const factors: string[] = [];
  let riskPoints = 0;

  // 腹囲またはBMI
  if (data.bmi) {
    if (data.bmi >= 30) {
      riskPoints += 30;
      factors.push('BMI 30以上（肥満2度）');
    } else if (data.bmi >= 25) {
      riskPoints += 20;
      factors.push('BMI 25以上（肥満1度）');
    } else if (data.bmi >= 23) {
      riskPoints += 10;
      factors.push('BMI 23以上（過体重）');
    }
  }

  // 血圧
  if (data.bloodPressureSystolic && data.bloodPressureDiastolic) {
    if (data.bloodPressureSystolic >= 140 || data.bloodPressureDiastolic >= 90) {
      riskPoints += 25;
      factors.push('高血圧（140/90以上）');
    } else if (data.bloodPressureSystolic >= 130 || data.bloodPressureDiastolic >= 85) {
      riskPoints += 15;
      factors.push('高値血圧（130/85以上）');
    }
  }

  // 脂質異常
  if (data.hdlCholesterol && data.hdlCholesterol < 40) {
    riskPoints += 20;
    factors.push('HDLコレステロール低値（40mg/dL未満）');
  }
  if (data.triglycerides && data.triglycerides >= 150) {
    riskPoints += 15;
    factors.push('中性脂肪高値（150mg/dL以上）');
  }

  // 血糖値
  if (data.bloodGlucose && data.bloodGlucose >= 110) {
    riskPoints += 20;
    factors.push('空腹時血糖高値（110mg/dL以上）');
  }
  if (data.hba1c && data.hba1c >= 5.6) {
    riskPoints += 15;
    factors.push('HbA1c高値（5.6%以上）');
  }

  const score = Math.min(100, riskPoints);
  const level = score >= 70 ? 'very-high' : score >= 50 ? 'high' : score >= 30 ? 'medium' : 'low';

  const recommendations: string[] = [];
  if (data.bmi && data.bmi >= 25) {
    recommendations.push('体重減少（3-5%の減量を目標）');
    recommendations.push('週150分以上の有酸素運動');
  }
  if (factors.some(f => f.includes('血圧'))) {
    recommendations.push('減塩（1日6g未満）');
    recommendations.push('血圧の定期測定');
  }
  if (factors.some(f => f.includes('脂質') || f.includes('中性脂肪'))) {
    recommendations.push('脂質制限食の検討');
    recommendations.push('魚類・大豆製品の摂取増加');
  }

  return {
    category: 'メタボリックシンドローム',
    score,
    level,
    factors,
    recommendations
  };
}

/**
 * 糖尿病リスク評価
 */
function assessDiabetesRisk(data: HealthData): RiskScore {
  const factors: string[] = [];
  let riskPoints = 0;

  // HbA1c
  if (data.hba1c) {
    if (data.hba1c >= 6.5) {
      riskPoints += 40;
      factors.push('HbA1c 6.5%以上（糖尿病域）');
    } else if (data.hba1c >= 6.0) {
      riskPoints += 25;
      factors.push('HbA1c 6.0-6.4%（糖尿病予備群）');
    } else if (data.hba1c >= 5.6) {
      riskPoints += 15;
      factors.push('HbA1c 5.6-5.9%（正常高値）');
    }
  }

  // 空腹時血糖
  if (data.bloodGlucose) {
    if (data.bloodGlucose >= 126) {
      riskPoints += 35;
      factors.push('空腹時血糖 126mg/dL以上（糖尿病域）');
    } else if (data.bloodGlucose >= 110) {
      riskPoints += 20;
      factors.push('空腹時血糖 110-125mg/dL（境界型）');
    }
  }

  // BMI
  if (data.bmi && data.bmi >= 25) {
    riskPoints += 15;
    factors.push('肥満（BMI 25以上）');
  }

  // 年齢
  if (data.age >= 45) {
    riskPoints += 10;
    factors.push('45歳以上');
  }

  const score = Math.min(100, riskPoints);
  const level = score >= 70 ? 'very-high' : score >= 50 ? 'high' : score >= 30 ? 'medium' : 'low';

  const recommendations: string[] = [];
  if (score >= 50) {
    recommendations.push('糖尿病専門医への受診を推奨');
  }
  if (data.bmi && data.bmi >= 25) {
    recommendations.push('体重減少（5-7%の減量を目標）');
  }
  recommendations.push('糖質制限の検討');
  recommendations.push('食後の軽い運動（15-30分のウォーキング）');

  return {
    category: '糖尿病',
    score,
    level,
    factors,
    recommendations
  };
}

/**
 * 心血管疾患リスク評価
 */
function assessCardiovascularRisk(data: HealthData): RiskScore {
  const factors: string[] = [];
  let riskPoints = 0;

  // 血圧
  if (data.bloodPressureSystolic && data.bloodPressureDiastolic) {
    if (data.bloodPressureSystolic >= 160 || data.bloodPressureDiastolic >= 100) {
      riskPoints += 30;
      factors.push('高度高血圧（160/100以上）');
    } else if (data.bloodPressureSystolic >= 140 || data.bloodPressureDiastolic >= 90) {
      riskPoints += 20;
      factors.push('高血圧（140/90以上）');
    }
  }

  // LDLコレステロール
  if (data.ldlCholesterol) {
    if (data.ldlCholesterol >= 180) {
      riskPoints += 25;
      factors.push('LDLコレステロール 180mg/dL以上');
    } else if (data.ldlCholesterol >= 140) {
      riskPoints += 15;
      factors.push('LDLコレステロール 140mg/dL以上');
    }
  }

  // 喫煙
  if (data.smokingStatus === 'current') {
    riskPoints += 20;
    factors.push('現在喫煙中');
  }

  // 年齢と性別
  if ((data.gender === 'male' && data.age >= 45) || (data.gender === 'female' && data.age >= 55)) {
    riskPoints += 15;
    factors.push(`${data.gender === 'male' ? '男性45歳以上' : '女性55歳以上'}`);
  }

  const score = Math.min(100, riskPoints);
  const level = score >= 70 ? 'very-high' : score >= 50 ? 'high' : score >= 30 ? 'medium' : 'low';

  const recommendations: string[] = [];
  if (data.smokingStatus === 'current') {
    recommendations.push('禁煙（最優先事項）');
  }
  if (factors.some(f => f.includes('血圧'))) {
    recommendations.push('減塩・DASH食の実践');
    recommendations.push('家庭血圧測定の習慣化');
  }
  if (factors.some(f => f.includes('LDL'))) {
    recommendations.push('飽和脂肪酸の制限');
    recommendations.push('オメガ3脂肪酸の摂取増加');
  }

  return {
    category: '心血管疾患',
    score,
    level,
    factors,
    recommendations
  };
}

/**
 * 肝機能リスク評価
 */
function assessLiverRisk(data: HealthData): RiskScore {
  const factors: string[] = [];
  let riskPoints = 0;

  // AST/ALT
  if (data.ast && data.alt) {
    const maxValue = Math.max(data.ast, data.alt);
    if (maxValue >= 100) {
      riskPoints += 35;
      factors.push('AST/ALT 100 U/L以上（高度上昇）');
    } else if (maxValue >= 50) {
      riskPoints += 20;
      factors.push('AST/ALT 50 U/L以上（中等度上昇）');
    } else if (maxValue >= 31) {
      riskPoints += 10;
      factors.push('AST/ALT 31 U/L以上（軽度上昇）');
    }
  }

  // γ-GTP
  if (data.gammaGtp) {
    if (data.gammaGtp >= 100) {
      riskPoints += 30;
      factors.push('γ-GTP 100 U/L以上');
    } else if (data.gammaGtp >= 51) {
      riskPoints += 15;
      factors.push('γ-GTP 51 U/L以上');
    }
  }

  // 飲酒習慣
  if (data.drinkingFrequency === 'heavy') {
    riskPoints += 25;
    factors.push('多量飲酒習慣');
  } else if (data.drinkingFrequency === 'regular') {
    riskPoints += 10;
    factors.push('習慣的飲酒');
  }

  // 肥満
  if (data.bmi && data.bmi >= 25) {
    riskPoints += 10;
    factors.push('肥満（脂肪肝リスク）');
  }

  const score = Math.min(100, riskPoints);
  const level = score >= 70 ? 'very-high' : score >= 50 ? 'high' : score >= 30 ? 'medium' : 'low';

  const recommendations: string[] = [];
  if (data.drinkingFrequency === 'heavy' || data.drinkingFrequency === 'regular') {
    recommendations.push('節酒または禁酒の検討');
  }
  if (data.bmi && data.bmi >= 25) {
    recommendations.push('体重減少（脂肪肝改善のため）');
  }
  if (score >= 30) {
    recommendations.push('肝臓専門医への相談を検討');
    recommendations.push('定期的な肝機能検査');
  }

  return {
    category: '肝機能',
    score,
    level,
    factors,
    recommendations
  };
}

/**
 * 総合的な健康リスク評価
 */
export function assessOverallHealthRisk(data: HealthData): OverallRiskAssessment {
  const riskScores: RiskScore[] = [];

  // 各カテゴリのリスク評価
  riskScores.push(assessMetabolicSyndrome(data));
  riskScores.push(assessDiabetesRisk(data));
  riskScores.push(assessCardiovascularRisk(data));
  riskScores.push(assessLiverRisk(data));

  // 総合スコアの計算（加重平均）
  const weights = {
    '心血管疾患': 1.3,
    '糖尿病': 1.2,
    'メタボリックシンドローム': 1.0,
    '肝機能': 0.8
  };

  let weightedSum = 0;
  let totalWeight = 0;

  riskScores.forEach(score => {
    const weight = weights[score.category as keyof typeof weights] || 1.0;
    weightedSum += score.score * weight;
    totalWeight += weight;
  });

  const overallScore = Math.round(weightedSum / totalWeight);
  const overallLevel = overallScore >= 70 ? 'very-high' :
                       overallScore >= 50 ? 'high' :
                       overallScore >= 30 ? 'medium' : 'low';

  // 優先対応事項の抽出
  const priorityActions: string[] = [];
  const highRiskCategories = riskScores
    .filter(s => s.level === 'very-high' || s.level === 'high')
    .sort((a, b) => b.score - a.score);

  highRiskCategories.forEach(category => {
    priorityActions.push(...category.recommendations.slice(0, 2));
  });

  // 重複を除去
  const uniquePriorityActions = [...new Set(priorityActions)].slice(0, 5);

  // 次回健診の推奨時期
  let nextCheckupRecommendation = '';
  if (overallLevel === 'very-high') {
    nextCheckupRecommendation = '3ヶ月後の再検査を強く推奨';
  } else if (overallLevel === 'high') {
    nextCheckupRecommendation = '6ヶ月後の再検査を推奨';
  } else if (overallLevel === 'medium') {
    nextCheckupRecommendation = '1年後の定期健診';
  } else {
    nextCheckupRecommendation = '1年後の定期健診（現状維持を継続）';
  }

  return {
    overallScore,
    overallLevel,
    riskScores,
    priorityActions: uniquePriorityActions,
    nextCheckupRecommendation
  };
}

/**
 * 個人別健康推奨事項の生成
 */
export function generatePersonalizedRecommendations(
  assessment: OverallRiskAssessment,
  data: HealthData
): {
  lifestyle: string[];
  diet: string[];
  exercise: string[];
  medicalFollowUp: string[];
} {
  const recommendations = {
    lifestyle: [] as string[],
    diet: [] as string[],
    exercise: [] as string[],
    medicalFollowUp: [] as string[]
  };

  // ライフスタイル推奨
  if (data.smokingStatus === 'current') {
    recommendations.lifestyle.push('禁煙外来の受診を検討してください');
  }
  if (data.drinkingFrequency === 'heavy') {
    recommendations.lifestyle.push('アルコール摂取量を1日20g以下に制限');
  }
  if (assessment.overallLevel === 'high' || assessment.overallLevel === 'very-high') {
    recommendations.lifestyle.push('ストレス管理（瞑想、深呼吸法など）');
    recommendations.lifestyle.push('睡眠時間7-8時間の確保');
  }

  // 食事推奨
  const hasMetabolicRisk = assessment.riskScores.find(s =>
    s.category === 'メタボリックシンドローム' && s.score >= 30
  );
  if (hasMetabolicRisk) {
    recommendations.diet.push('1日の摂取カロリーを200-300kcal削減');
    recommendations.diet.push('野菜を1日350g以上摂取');
    recommendations.diet.push('食物繊維を1日20g以上摂取');
  }

  const hasDiabetesRisk = assessment.riskScores.find(s =>
    s.category === '糖尿病' && s.score >= 30
  );
  if (hasDiabetesRisk) {
    recommendations.diet.push('炭水化物を食事の50-60%に制限');
    recommendations.diet.push('食事の順番：野菜→たんぱく質→炭水化物');
    recommendations.diet.push('間食を控え、3食規則正しく');
  }

  // 運動推奨
  if (data.bmi && data.bmi >= 25) {
    recommendations.exercise.push('週150分以上の中強度有酸素運動');
    recommendations.exercise.push('週2回以上の筋力トレーニング');
  } else {
    recommendations.exercise.push('週75分以上の有酸素運動を維持');
  }

  if (data.age >= 50) {
    recommendations.exercise.push('バランス運動・柔軟体操を追加');
  }

  // 医療フォローアップ
  assessment.riskScores.forEach(score => {
    if (score.level === 'very-high') {
      if (score.category === '心血管疾患') {
        recommendations.medicalFollowUp.push('循環器内科での精密検査');
      } else if (score.category === '糖尿病') {
        recommendations.medicalFollowUp.push('糖尿病専門医への受診');
      } else if (score.category === '肝機能') {
        recommendations.medicalFollowUp.push('消化器内科での精密検査');
      }
    }
  });

  if (assessment.overallLevel === 'high' || assessment.overallLevel === 'very-high') {
    recommendations.medicalFollowUp.push('産業医との定期面談（月1回）');
  }

  return recommendations;
}