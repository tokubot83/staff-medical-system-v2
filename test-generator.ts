import { generateInterviewSheet } from './src/lib/interview-bank/services/generator';
import { ExtendedInterviewParams } from './src/lib/interview-bank/types-extended';

// テスト用パラメータ
const testParams: ExtendedInterviewParams = {
  staff: {
    id: 'test-001',
    name: '山田太郎',
    profession: 'nurse',
    experienceLevel: 'new',
    positionLevel: 'staff',
    department: '内科病棟',
    facility: 'acute',
    hireDate: new Date('2024-04-01')
  },
  duration: 30,
  interviewDate: new Date(),
  interviewerId: 'int-001',
  interviewerName: '面談者A'
};

// 面談シート生成
const sheet = generateInterviewSheet(testParams);

// 生成された質問を確認
console.log('=== 生成された面談シート ===');
console.log(`職種: ${sheet.params.profession}`);
console.log(`経験: ${sheet.params.experienceLevel}`);
console.log(`施設: ${sheet.params.facility}`);
console.log(`総質問数: ${sheet.totalQuestions}`);
console.log('\n=== セクション別質問 ===');

sheet.sections.forEach((section, index) => {
  console.log(`\n[セクション${index + 1}] ${section.name} (${section.questions.length}問)`);
  section.questions.forEach((q, qIndex) => {
    console.log(`  Q${qIndex + 1}: ${q.content}`);
  });
});