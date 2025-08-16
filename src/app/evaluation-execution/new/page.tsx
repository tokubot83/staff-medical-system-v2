'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function NewEvaluationPage() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>新規評価実施</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>新しい評価を開始します。</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              評価を開始
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}