import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 職員サンプルデータ
const sampleEmployees = [
  { name: '田中花子', position: '看護師', facility: '○○病院', jobCategory: '看護職' },
  { name: '山田太郎', position: '看護師', facility: '△△クリニック', jobCategory: '看護職' },
  { name: '佐藤美咲', position: '介護福祉士', facility: '○○病院', jobCategory: '介護職' },
  { name: '鈴木一郎', position: '理学療法士', facility: '△△クリニック', jobCategory: 'リハビリ職' },
  { name: '高橋理恵', position: '看護師', facility: '○○病院', jobCategory: '看護職' },
  { name: '渡辺健太', position: '作業療法士', facility: '□□リハビリセンター', jobCategory: 'リハビリ職' },
  { name: '伊藤さくら', position: '看護師', facility: '△△クリニック', jobCategory: '看護職' },
  { name: '中村大輔', position: '事務職員', facility: '○○病院', jobCategory: '事務職' },
  { name: '小林由美', position: '介護福祉士', facility: '□□介護施設', jobCategory: '介護職' },
  { name: '加藤誠', position: '医師', facility: '○○病院', jobCategory: '医師' },
]

// 評価期間
const evaluationPeriods = ['2023-H1', '2023-H2', '2024-H1', '2024-H2']

async function seedTwoAxisEvaluations() {
  console.log('Seeding two-axis evaluation data...')

  try {
    // 1. 施設データを作成
    const facilities = await Promise.all([
      prisma.facility.upsert({
        where: { code: 'F001' },
        update: {},
        create: {
          code: 'F001',
          name: '○○病院',
          type: 'hospital',
          address: '東京都千代田区1-1-1',
          phone: '03-1234-5678',
        },
      }),
      prisma.facility.upsert({
        where: { code: 'F002' },
        update: {},
        create: {
          code: 'F002',
          name: '△△クリニック',
          type: 'clinic',
          address: '東京都港区2-2-2',
          phone: '03-2345-6789',
        },
      }),
      prisma.facility.upsert({
        where: { code: 'F003' },
        update: {},
        create: {
          code: 'F003',
          name: '□□リハビリセンター',
          type: 'nursing_home',
          address: '東京都新宿区3-3-3',
          phone: '03-3456-7890',
        },
      }),
      prisma.facility.upsert({
        where: { code: 'F004' },
        update: {},
        create: {
          code: 'F004',
          name: '□□介護施設',
          type: 'nursing_home',
          address: '東京都渋谷区4-4-4',
          phone: '03-4567-8901',
        },
      }),
    ])

    // 2. 部署データを作成
    const departments = await Promise.all([
      prisma.department.upsert({
        where: { code: 'D001' },
        update: {},
        create: {
          code: 'D001',
          name: '看護部',
          facilityId: facilities[0].id,
          level: 1,
        },
      }),
      prisma.department.upsert({
        where: { code: 'D002' },
        update: {},
        create: {
          code: 'D002',
          name: 'リハビリテーション部',
          facilityId: facilities[0].id,
          level: 1,
        },
      }),
      prisma.department.upsert({
        where: { code: 'D003' },
        update: {},
        create: {
          code: 'D003',
          name: '事務部',
          facilityId: facilities[0].id,
          level: 1,
        },
      }),
    ])

    // 3. 役職データを作成
    const positions = await Promise.all([
      prisma.position.upsert({
        where: { code: 'P001' },
        update: {},
        create: {
          code: 'P001',
          name: '看護師',
          level: 3,
          accountType: 'STAFF',
        },
      }),
      prisma.position.upsert({
        where: { code: 'P002' },
        update: {},
        create: {
          code: 'P002',
          name: '介護福祉士',
          level: 3,
          accountType: 'STAFF',
        },
      }),
      prisma.position.upsert({
        where: { code: 'P003' },
        update: {},
        create: {
          code: 'P003',
          name: '理学療法士',
          level: 3,
          accountType: 'STAFF',
        },
      }),
      prisma.position.upsert({
        where: { code: 'P004' },
        update: {},
        create: {
          code: 'P004',
          name: '作業療法士',
          level: 3,
          accountType: 'STAFF',
        },
      }),
      prisma.position.upsert({
        where: { code: 'P005' },
        update: {},
        create: {
          code: 'P005',
          name: '事務職員',
          level: 2,
          accountType: 'STAFF',
        },
      }),
      prisma.position.upsert({
        where: { code: 'P006' },
        update: {},
        create: {
          code: 'P006',
          name: '医師',
          level: 4,
          accountType: 'DIRECTOR',
        },
      }),
    ])

    // 4. 職員データを作成
    const employees = []
    for (let i = 0; i < sampleEmployees.length; i++) {
      const emp = sampleEmployees[i]
      const facilityIndex = facilities.findIndex(f => f.name === emp.facility)
      const positionIndex = positions.findIndex(p => p.name === emp.position)
      const departmentIndex = emp.position.includes('看護') ? 0 : emp.position.includes('療法') ? 1 : 2

      const employee = await prisma.employee.upsert({
        where: { employeeCode: `EMP${String(i + 1).padStart(3, '0')}` },
        update: {},
        create: {
          employeeCode: `EMP${String(i + 1).padStart(3, '0')}`,
          name: emp.name,
          nameKana: emp.name + 'カナ',
          email: `emp${i + 1}@example.com`,
          phone: '090-1234-5678',
          birthDate: new Date(1980 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), 1),
          gender: i % 2 === 0 ? 'female' : 'male',
          hireDate: new Date(2015 + Math.floor(Math.random() * 5), 3, 1),
          departmentId: departments[departmentIndex].id,
          positionId: positions[positionIndex].id,
          facilityId: facilities[facilityIndex].id,
          status: 'active',
          permissionLevel: 1,
        },
      })
      employees.push(employee)
    }

    // 5. 評価データと2軸評価データを作成
    for (const period of evaluationPeriods) {
      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i]
        const baseScore = 65 + Math.random() * 30 // 65-95点の範囲
        const performanceScore = baseScore + (Math.random() - 0.5) * 10
        const skillScore = baseScore + (Math.random() - 0.5) * 8
        const teamworkScore = baseScore + (Math.random() - 0.5) * 12
        const leadershipScore = employee.positionId === positions[5].id ? baseScore + 5 : null
        const growthScore = baseScore + (Math.random() - 0.5) * 15

        // 平均スコアを計算
        const scores = [performanceScore, skillScore, teamworkScore, growthScore]
        if (leadershipScore !== null) scores.push(leadershipScore)
        const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length

        // 評価を作成
        const evaluation = await prisma.evaluation.create({
          data: {
            employeeId: employee.id,
            evaluatorId: employees[employees.length - 1].id, // 最後の職員を評価者とする
            period,
            overallScore: avgScore >= 90 ? 'S' : avgScore >= 80 ? 'A' : avgScore >= 70 ? 'B' : avgScore >= 60 ? 'C' : 'D',
            performanceScore,
            skillScore,
            teamworkScore,
            leadershipScore,
            growthScore,
            comments: `${period}期の評価コメント`,
            status: 'approved',
          },
        })

        // 同じ職種の職員を抽出してランキングを計算
        const sameJobEmployees = employees.filter((e, idx) => 
          sampleEmployees[idx].jobCategory === sampleEmployees[i].jobCategory
        )
        const sameFacilityEmployees = employees.filter((e, idx) => 
          sampleEmployees[idx].jobCategory === sampleEmployees[i].jobCategory &&
          sampleEmployees[idx].facility === sampleEmployees[i].facility
        )

        // ランダムなランキングを生成（実際の実装では評価スコアでソート）
        const facilityRank = Math.floor(Math.random() * sameFacilityEmployees.length) + 1
        const corporateRank = Math.floor(Math.random() * sameJobEmployees.length) + 1

        // 評価グレードを計算
        const facilityEval = calculateGrade(facilityRank, sameFacilityEmployees.length)
        const corporateEval = calculateGrade(corporateRank, sameJobEmployees.length)
        const finalEval = getFinalEvaluation(corporateEval, facilityEval)

        // 2軸評価を作成
        await prisma.twoAxisEvaluation.create({
          data: {
            employeeId: employee.id,
            evaluationId: evaluation.id,
            evaluationPeriod: period,
            score: avgScore,
            facilityRank,
            facilityTotal: sameFacilityEmployees.length,
            facilityEvaluation: facilityEval,
            facilityPercentile: (facilityRank / sameFacilityEmployees.length) * 100,
            corporateRank,
            corporateTotal: sameJobEmployees.length,
            corporateEvaluation: corporateEval,
            corporatePercentile: (corporateRank / sameJobEmployees.length) * 100,
            finalEvaluation: finalEval,
            jobCategory: sampleEmployees[i].jobCategory,
          },
        })
      }
    }

    console.log('Two-axis evaluation data seeded successfully!')
  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  }
}

// 評価グレード計算
function calculateGrade(rank: number, total: number): string {
  const percentile = (rank / total) * 100
  if (percentile <= 10) return 'S'
  if (percentile <= 30) return 'A'
  if (percentile <= 70) return 'B'
  if (percentile <= 90) return 'C'
  return 'D'
}

// 最終評価マトリクス
function getFinalEvaluation(corporate: string, facility: string): string {
  const matrix: { [key: string]: string } = {
    'S-S': 'S+', 'S-A': 'S', 'S-B': 'S', 'S-C': 'A', 'S-D': 'B',
    'A-S': 'S', 'A-A': 'A+', 'A-B': 'A', 'A-C': 'B', 'A-D': 'C',
    'B-S': 'A', 'B-A': 'A', 'B-B': 'B', 'B-C': 'C', 'B-D': 'D',
    'C-S': 'B', 'C-A': 'B', 'C-B': 'C', 'C-C': 'C', 'C-D': 'D',
    'D-S': 'C', 'D-A': 'C', 'D-B': 'D', 'D-C': 'D', 'D-D': 'D',
  }
  return matrix[`${corporate}-${facility}`] || 'B'
}

// 実行
seedTwoAxisEvaluations()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })