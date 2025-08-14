import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const evaluationComponents = {
  'new-outpatient-assistant-nurse-evaluation-v4-pattern5': dynamic(
    () => import('@/components/evaluation-sheets/v4/outpatient-assistant-nurse/new-outpatient-assistant-nurse-evaluation-v4-pattern5'),
    { ssr: false }
  ),
  'junior-outpatient-assistant-nurse-evaluation-v4-pattern5': dynamic(
    () => import('@/components/evaluation-sheets/v4/outpatient-assistant-nurse/junior-outpatient-assistant-nurse-evaluation-v4-pattern5'),
    { ssr: false }
  ),
};

export default function OutpatientAssistantNurseEvaluationPage({
  params
}: {
  params: { slug: string }
}) {
  const Component = evaluationComponents[params.slug as keyof typeof evaluationComponents];

  if (!Component) {
    notFound();
  }

  return <Component />;
}

export function generateStaticParams() {
  return Object.keys(evaluationComponents).map((slug) => ({
    slug,
  }));
}