'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function SendRemindersPage() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>リマインダー送信</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>評価リマインダーを送信します。</p>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              リマインダーを送信
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}