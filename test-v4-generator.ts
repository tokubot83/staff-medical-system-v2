// v4ジェネレーターのテスト
import { generateV4InterviewSheet } from './src/lib/interview-bank/services/v4-generator';
import { ExtendedInterviewParams } from './src/lib/interview-bank/types-extended';

// テストケース1: 急性期新人看護師
const testCase1: ExtendedInterviewParams = {
  staff: {
    id: 'test-001',
    name: '山田花子',
    profession: 'nurse',
    experienceLevel: 'new',
    facilityType: 'acute',
    department: '循環器内科病棟',
    hireDate: '2024-04-01',
    birthDate: '2000-03-15',
    previousExperience: 0
  },
  interviewType: 'regular' as const,
  duration: 30
};

// テストケース2: 慢性期ベテラン看護師
const testCase2: ExtendedInterviewParams = {
  staff: {
    id: 'test-002',
    name: '佐藤美智子',
    profession: 'nurse',
    experienceLevel: 'veteran',
    facilityType: 'chronic',
    department: '療養病棟',
    hireDate: '2008-04-01',
    birthDate: '1978-08-20',
    previousExperience: 3
  },
  interviewType: 'regular' as const,
  duration: 45
};

// テストケース3: 老健介護職員
const testCase3: ExtendedInterviewParams = {
  staff: {
    id: 'test-003',
    name: '鈴木太郎',
    profession: 'care-worker',
    experienceLevel: 'junior',
    facilityType: 'geriatric',
    department: '介護部',
    hireDate: '2022-10-01',
    birthDate: '1995-12-10',
    previousExperience: 1
  },
  interviewType: 'regular' as const,
  duration: 30
};

// テストケース4: 外来医事課職員
const testCase4: ExtendedInterviewParams = {
  staff: {
    id: 'test-004',
    name: '田中由美',
    profession: 'medical-clerk',
    experienceLevel: 'junior',
    facilityType: 'outpatient',
    department: '医事課',
    hireDate: '2021-04-01',
    birthDate: '1992-06-25',
    previousExperience: 2
  },
  interviewType: 'regular' as const,
  duration: 30
};

console.log('===== v4面談シート生成テスト =====\n');

// 各テストケースを実行
[testCase1, testCase2, testCase3, testCase4].forEach((testCase, index) => {
  console.log(`\n----- テストケース${index + 1}: ${testCase.staff.name} -----`);
  console.log(`職種: ${testCase.staff.profession}`);
  console.log(`経験レベル: ${testCase.staff.experienceLevel}`);
  console.log(`施設タイプ: ${testCase.staff.facilityType}`);
  console.log(`面談時間: ${testCase.duration}分`);
  
  const result = generateV4InterviewSheet(testCase);
  
  console.log(`\n生成されたセクション数: ${result.sections.length}`);
  result.sections.forEach((section, idx) => {
    console.log(`\n[セクション${idx + 1}] ${section.name}`);
    console.log(`  - タイプ: ${section.type}`);
    console.log(`  - 色: ${section.color}`);
    console.log(`  - 推奨時間: ${section.recommendedDuration}分`);
    console.log(`  - 質問数: ${section.questions.length}`);
    
    // 最初の3つの質問を表示
    section.questions.slice(0, 3).forEach((q, qIdx) => {
      console.log(`    質問${qIdx + 1}: ${q.content.substring(0, 50)}...`);
    });
  });
  
  console.log(`\n合計質問数: ${result.metadata.totalQuestions}`);
});