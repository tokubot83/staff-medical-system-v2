import { generateInterviewSheet } from './src/lib/interview-bank/services/generator';
import { ExtendedInterviewParams } from './src/lib/interview-bank/types-extended';

// 新人看護師用テストパラメータ
const testParams: ExtendedInterviewParams = {
  staff: {
    id: 'test-001',
    name: '山田花子',
    profession: 'nurse',
    experienceLevel: 'new',
    positionLevel: 'staff',
    department: '内科病棟',
    facility: 'acute',
    hireDate: new Date('2024-04-01')
  },
  duration: 45,  // 45分版でより多くの質問を確認
  interviewDate: new Date(),
  interviewerId: 'int-001',
  interviewerName: '面談者A'
};

// 面談シート生成
const sheet = generateInterviewSheet(testParams);

console.log('=== 新人看護師（急性期病院）45分面談シート ===');
console.log(`職種: ${sheet.params.profession}`);
console.log(`経験: ${sheet.params.experienceLevel}`);
console.log(`施設: ${sheet.params.facility}`);
console.log(`総質問数: ${sheet.totalQuestions}`);
console.log('\n=== セクション別質問内容 ===');

sheet.sections.forEach((section, index) => {
  console.log(`\n■セクション${index + 1}: ${section.name} (${section.questions.length}問)`);
  console.log('-'.repeat(60));
  section.questions.forEach((q, qIndex) => {
    console.log(`Q${qIndex + 1}. ${q.content}`);
    if (q.type === 'scale') {
      console.log(`   [1-5段階評価]`);
    } else if (q.type === 'radio' || q.type === 'checkbox') {
      console.log(`   [選択式]`);
    } else if (q.type === 'textarea') {
      console.log(`   [自由記述]`);
    }
  });
});