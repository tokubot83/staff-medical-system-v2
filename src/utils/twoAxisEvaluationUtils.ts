// 2軸評価のマトリックス計算用ユーティリティ

export const calculateOverallScore = (
  facilityScore: 'S' | 'A' | 'B' | 'C' | 'D',
  corporateScore: 'S' | 'A' | 'B' | 'C' | 'D'
): 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D' => {
  const matrixMapping: Record<string, 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D'> = {
    'S-S': 'S+',
    'S-A': 'S',
    'S-B': 'A+',
    'S-C': 'A',
    'S-D': 'A',
    'A-S': 'S',
    'A-A': 'A+',
    'A-B': 'A',
    'A-C': 'A',
    'A-D': 'B',
    'B-S': 'A+',
    'B-A': 'A',
    'B-B': 'B',
    'B-C': 'B',
    'B-D': 'C',
    'C-S': 'A',
    'C-A': 'A',
    'C-B': 'B',
    'C-C': 'C',
    'C-D': 'D',
    'D-S': 'B',
    'D-A': 'B',
    'D-B': 'C',
    'D-C': 'C',
    'D-D': 'D'
  }
  
  return matrixMapping[`${corporateScore}-${facilityScore}`] || 'B'
}

// 既存の評価から2軸評価を推定するユーティリティ
export const estimateTwoAxisEvaluation = (
  evaluation: string,
  facilityPosition?: number,
  facilityTotal?: number,
  corporatePosition?: number,
  corporateTotal?: number
) => {
  // 施設内評価の算出（相対評価）
  let facilityScore: 'S' | 'A' | 'B' | 'C' | 'D' = 'B'
  if (facilityPosition && facilityTotal) {
    const percentile = (facilityPosition / facilityTotal) * 100
    if (percentile <= 10) facilityScore = 'S'
    else if (percentile <= 30) facilityScore = 'A'
    else if (percentile <= 50) facilityScore = 'B'
    else if (percentile <= 70) facilityScore = 'C'
    else facilityScore = 'D'
  } else {
    // 位置情報がない場合は評価から推定
    if (evaluation === 'S') facilityScore = 'S'
    else if (evaluation === 'A') facilityScore = 'A'
    else if (evaluation === 'B+' || evaluation === 'B') facilityScore = 'B'
    else if (evaluation === 'C') facilityScore = 'C'
    else facilityScore = 'D'
  }
  
  // 法人内評価の算出（絶対評価）
  let corporateScore: 'S' | 'A' | 'B' | 'C' | 'D' = 'B'
  if (corporatePosition && corporateTotal) {
    const percentile = (corporatePosition / corporateTotal) * 100
    if (percentile <= 5) corporateScore = 'S'
    else if (percentile <= 20) corporateScore = 'A'
    else if (percentile <= 50) corporateScore = 'B'
    else if (percentile <= 80) corporateScore = 'C'
    else corporateScore = 'D'
  } else {
    // 位置情報がない場合は評価から推定（より厳しめ）
    if (evaluation === 'S') corporateScore = 'A'
    else if (evaluation === 'A') corporateScore = 'B'
    else if (evaluation === 'B+') corporateScore = 'B'
    else if (evaluation === 'B') corporateScore = 'C'
    else corporateScore = 'D'
  }
  
  const overallScore = calculateOverallScore(facilityScore, corporateScore)
  
  return {
    facilityScore,
    corporateScore,
    overallScore,
    facilityRank: facilityPosition,
    facilityTotal,
    corporateRank: corporatePosition,
    corporateTotal
  }
}