import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedEvaluationMatrix() {
  console.log('Seeding evaluation matrix data...')

  const matrixData = [
    // S行
    { corporateEval: 'S', facilityEval: 'S', finalEval: 'S+', description: '最優秀：法人全体のトップパフォーマー' },
    { corporateEval: 'S', facilityEval: 'A', finalEval: 'S', description: '卓越：法人レベルで高い実績' },
    { corporateEval: 'S', facilityEval: 'B', finalEval: 'S', description: '卓越：より大きな環境での活躍が期待' },
    { corporateEval: 'S', facilityEval: 'C', finalEval: 'A', description: '優秀：施設内での成長余地あり' },
    { corporateEval: 'S', facilityEval: 'D', finalEval: 'B', description: '良好：施設内でのサポートが必要' },
    
    // A行
    { corporateEval: 'A', facilityEval: 'S', finalEval: 'S', description: '卓越：小規模施設のリーダー' },
    { corporateEval: 'A', facilityEval: 'A', finalEval: 'A+', description: '極めて優秀：バランスの取れた人材' },
    { corporateEval: 'A', facilityEval: 'B', finalEval: 'A', description: '優秀：安定した実力者' },
    { corporateEval: 'A', facilityEval: 'C', finalEval: 'B', description: '良好：成長の機会が必要' },
    { corporateEval: 'A', facilityEval: 'D', finalEval: 'C', description: '標準：基礎スキルの向上が必要' },
    
    // B行
    { corporateEval: 'B', facilityEval: 'S', finalEval: 'A', description: '優秀：施設内で際立つ存在' },
    { corporateEval: 'B', facilityEval: 'A', finalEval: 'A', description: '優秀：施設の中核人材' },
    { corporateEval: 'B', facilityEval: 'B', finalEval: 'B', description: '良好：期待通りのパフォーマンス' },
    { corporateEval: 'B', facilityEval: 'C', finalEval: 'C', description: '標準：継続的な育成が必要' },
    { corporateEval: 'B', facilityEval: 'D', finalEval: 'D', description: '要改善：重点的な支援が必要' },
    
    // C行
    { corporateEval: 'C', facilityEval: 'S', finalEval: 'B', description: '良好：施設内での強みを活かす' },
    { corporateEval: 'C', facilityEval: 'A', finalEval: 'B', description: '良好：施設環境に適合' },
    { corporateEval: 'C', facilityEval: 'B', finalEval: 'C', description: '標準：基本業務の習熟が必要' },
    { corporateEval: 'C', facilityEval: 'C', finalEval: 'C', description: '標準：継続的な指導が必要' },
    { corporateEval: 'C', facilityEval: 'D', finalEval: 'D', description: '要改善：根本的な改善が必要' },
    
    // D行
    { corporateEval: 'D', facilityEval: 'S', finalEval: 'C', description: '標準：施設の特性を活かす' },
    { corporateEval: 'D', facilityEval: 'A', finalEval: 'C', description: '標準：施設内での役割を明確化' },
    { corporateEval: 'D', facilityEval: 'B', finalEval: 'D', description: '要改善：基礎からの育成が必要' },
    { corporateEval: 'D', facilityEval: 'C', finalEval: 'D', description: '要改善：適性の再評価が必要' },
    { corporateEval: 'D', facilityEval: 'D', finalEval: 'D', description: '要改善：抜本的な対策が必要' },
  ]

  for (const data of matrixData) {
    await prisma.evaluationMatrix.upsert({
      where: {
        corporateEval_facilityEval: {
          corporateEval: data.corporateEval,
          facilityEval: data.facilityEval,
        },
      },
      update: data,
      create: data,
    })
  }

  console.log('Evaluation matrix data seeded successfully!')
}

seedEvaluationMatrix()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })