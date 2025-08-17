// 理学療法士の質問選択を調査
import { generateV4InterviewSheet } from './src/lib/interview-bank/services/v4-generator';
import { ExtendedInterviewParams } from './src/lib/interview-bank/types-extended';
import { questionBank } from './src/lib/interview-bank/database/question-bank';

// 理学療法士のテストケース
const ptTestCase: ExtendedInterviewParams = {
  staff: {
    id: 'test-pt-001',
    name: '田中太郎',
    profession: 'therapist-pt',
    experienceLevel: 'junior',
    facilityType: 'acute',
    department: 'リハビリテーション科',
    hireDate: '2021-04-01',
    birthDate: '1995-03-15',
    previousExperience: 2
  },
  interviewType: 'regular' as const,
  duration: 30
};

console.log('=== 理学療法士の質問選択デバッグ ===\n');

// 1. 理学療法士タグの質問を確認
console.log('【理学療法士タグを持つ質問】');
const ptQuestions = questionBank.filter(q => {
  if (!q.tags) return false;
  return q.tags.some(tag => 
    tag === '理学療法士' || 
    tag === 'therapist-pt' || 
    tag === 'therapist_pt' ||
    tag === 'PT' ||
    tag === 'pt'
  );
});

console.log(`理学療法士の質問数: ${ptQuestions.length}`);
ptQuestions.forEach(q => {
  console.log(`- ${q.id}: ${q.content.substring(0, 50)}...`);
  console.log(`  tags: ${q.tags.join(', ')}`);
  console.log(`  section: ${q.section || q.sectionId}`);
});

// 2. 生成される面談シートを確認
console.log('\n【生成された面談シート】');
const result = generateV4InterviewSheet(ptTestCase);

result.sections.forEach((section, idx) => {
  console.log(`\n[セクション${idx + 1}] ${section.name}`);
  section.questions.forEach((q, qIdx) => {
    console.log(`  Q${qIdx + 1}: ${q.content.substring(0, 60)}...`);
    if (q.tags) {
      console.log(`      tags: ${q.tags.slice(0, 3).join(', ')}...`);
    }
  });
});

// 3. 職種マッピングの確認
console.log('\n【職種マッピング】');
console.log('therapist-pt → ?');
console.log('確認が必要なマッピング:');
console.log('- therapist-pt');
console.log('- therapist_pt');
console.log('- 理学療法士');
console.log('- PT');