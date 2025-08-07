// 2軸評価のマトリックス計算用ユーティリティ

export const calculateOverallScore = (
  facilityScore: 'S' | 'A' | 'B' | 'C' | 'D',
  corporateScore: 'S' | 'A' | 'B' | 'C' | 'D'
): 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D' => {
  // PDFのマトリックスに基づく正確なマッピング
  // 横軸：施設内評価、縦軸：法人内評価
  const matrixMapping: Record<string, 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D'> = {
    'S-D': 'A',
    'S-C': 'A+',
    'S-B': 'S',
    'S-A': 'S',
    'S-S': 'S+',
    'A-D': 'B',
    'A-C': 'A',
    'A-B': 'A',
    'A-A': 'A+',
    'A-S': 'S',
    'B-D': 'C',
    'B-C': 'B',
    'B-B': 'B',
    'B-A': 'A',
    'B-S': 'A+',
    'C-D': 'D',
    'C-C': 'C',
    'C-B': 'C',
    'C-A': 'B',
    'C-S': 'A',
    'D-D': 'D',
    'D-C': 'D',
    'D-B': 'C',
    'D-A': 'C',
    'D-S': 'B'
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
  
  // 評価の説明を生成
  const description = getEvaluationDescription(facilityScore, corporateScore, overallScore)
  const recommendation = getEvaluationRecommendation(facilityScore, corporateScore, overallScore)
  
  return {
    facilityScore,
    corporateScore,
    overallScore,
    facilityRank: facilityPosition || 1,
    facilityTotal: facilityTotal || 15,
    corporateRank: corporatePosition || 100,
    corporateTotal: corporateTotal || 280,
    description,
    recommendation
  }
}

// 評価の説明を生成する関数
export const getEvaluationDescription = (
  facilityScore: 'S' | 'A' | 'B' | 'C' | 'D',
  corporateScore: 'S' | 'A' | 'B' | 'C' | 'D',
  overallScore: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D'
): string => {
  if (facilityScore === 'S' && corporateScore === 'B') {
    return '小規模施設のリーダー'
  } else if (facilityScore === 'S' && corporateScore === 'S') {
    return '法人全体のトップパフォーマー'
  } else if (overallScore === 'S+') {
    return '最優秀職員'
  } else if (overallScore === 'S') {
    return '卓越した実績の職員'
  } else if (overallScore === 'A+' || overallScore === 'A') {
    return '優秀な職員'
  } else if (overallScore === 'B') {
    return '標準的な職員'
  } else {
    return '成長支援が必要な職員'
  }
}

// 推奨アクションを生成する関数
export const getEvaluationRecommendation = (
  facilityScore: 'S' | 'A' | 'B' | 'C' | 'D',
  corporateScore: 'S' | 'A' | 'B' | 'C' | 'D',
  overallScore: 'S+' | 'S' | 'A+' | 'A' | 'B' | 'C' | 'D'
): string => {
  if (facilityScore === 'S' && ['B', 'C', 'D'].includes(corporateScore)) {
    return '法人レベルでの活躍機会を検討'
  } else if (corporateScore === 'S' && ['C', 'D'].includes(facilityScore)) {
    return '施設内でのリーダーシップ強化が必要'
  } else if (['S+', 'S'].includes(overallScore)) {
    return '次世代リーダー候補として育成'
  } else if (['A+', 'A'].includes(overallScore)) {
    return '他施設との交流・研修機会の活用'
  } else if (overallScore === 'B') {
    return '継続的な成長を支援'
  } else {
    return '基礎スキルの向上と適性評価が必要'
  }
}