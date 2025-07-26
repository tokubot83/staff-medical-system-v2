import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CategoryTopButtonProps {
  categoryPath: string;
  categoryName: string;
}

export default function CategoryTopButton({ categoryPath, categoryName }: CategoryTopButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(categoryPath);
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      <ArrowLeft size={20} />
      {categoryName}カテゴリトップに戻る
    </Button>
  );
}