// 理学療法士と作業療法士の質問を確認
import { questionBank } from './src/lib/interview-bank/database/question-bank';
import { comprehensiveSkillQuestions } from './src/lib/interview-bank/database/comprehensive-skill-questions';
import { facilitySpecificQuestions } from './src/lib/interview-bank/database/facility-specific-questions';

const allQuestions = [...questionBank, ...comprehensiveSkillQuestions, ...facilitySpecificQuestions];

console.log('=== 理学療法士（PT）の質問 ===');
const ptQuestions = allQuestions.filter(q => {
  if (!q.tags) return false;
  return q.tags.some(tag => 
    tag === '理学療法士' || 
    tag === 'therapist-pt' || 
    tag === 'therapist_pt' ||
    tag === 'PT' ||
    tag === 'pt'
  ) && (q.sectionId === 'skill_evaluation' || q.section === 'skill_evaluation');
});

console.log(`PT質問数: ${ptQuestions.length}`);
ptQuestions.forEach(q => {
  console.log(`- ID: ${q.id}`);
  console.log(`  内容: ${q.content.substring(0, 60)}...`);
  console.log(`  tags: ${q.tags.join(', ')}`);
});

console.log('\n=== 作業療法士（OT）の質問 ===');
const otQuestions = allQuestions.filter(q => {
  if (!q.tags) return false;
  return q.tags.some(tag => 
    tag === '作業療法士' || 
    tag === 'therapist-ot' || 
    tag === 'therapist_ot' ||
    tag === 'OT' ||
    tag === 'ot'
  ) && (q.sectionId === 'skill_evaluation' || q.section === 'skill_evaluation');
});

console.log(`OT質問数: ${otQuestions.length}`);
otQuestions.forEach(q => {
  console.log(`- ID: ${q.id}`);
  console.log(`  内容: ${q.content.substring(0, 60)}...`);
  console.log(`  tags: ${q.tags.join(', ')}`);
});

// comprehensive-skill-questionsを直接確認
console.log('\n=== comprehensive-skill-questionsの内容確認 ===');
const ptFromComprehensive = comprehensiveSkillQuestions.filter(q => 
  q.id.includes('pt_')
);
const otFromComprehensive = comprehensiveSkillQuestions.filter(q => 
  q.id.includes('ot_')
);

console.log(`comprehensive内のPT質問: ${ptFromComprehensive.length}`);
console.log(`comprehensive内のOT質問: ${otFromComprehensive.length}`);

if (ptFromComprehensive.length === 0 && otFromComprehensive.length === 0) {
  console.log('\n⚠️ 問題: comprehensive-skill-questionsにPT/OTの質問が含まれていません');
  console.log('含まれている職種のプレフィックス:');
  const prefixes = new Set();
  comprehensiveSkillQuestions.forEach(q => {
    const prefix = q.id.split('_')[0];
    prefixes.add(prefix);
  });
  console.log(Array.from(prefixes).join(', '));
}