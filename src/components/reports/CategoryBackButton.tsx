import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CategoryBackButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/reports');
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      <ArrowLeft size={20} />
      レポートセンターに戻る
    </Button>
  );
}