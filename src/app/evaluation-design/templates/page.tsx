'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function EvaluationTemplatesPage() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>評価テンプレート</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <p>評価テンプレートの管理画面です。</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}