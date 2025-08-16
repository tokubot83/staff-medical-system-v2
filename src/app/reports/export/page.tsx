'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

export default function ReportsExportPage() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>レポートエクスポート</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>レポートのエクスポート機能を準備中です。</p>
            <Button disabled>
              <FileDown className="mr-2 h-4 w-4" />
              エクスポート
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}