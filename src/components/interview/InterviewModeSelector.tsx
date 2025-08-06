'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Printer, Eye, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InterviewMode = 'input' | 'print' | 'review';

interface InterviewModeSelectorProps {
  mode: InterviewMode;
  onModeChange: (mode: InterviewMode) => void;
  className?: string;
}

export default function InterviewModeSelector({ 
  mode, 
  onModeChange,
  className 
}: InterviewModeSelectorProps) {
  const modes = [
    {
      id: 'input' as InterviewMode,
      label: 'デジタル入力',
      icon: Monitor,
      description: 'リアルタイムで入力',
      color: 'text-blue-600'
    },
    {
      id: 'print' as InterviewMode,
      label: '印刷用',
      icon: Printer,
      description: '紙に印刷して使用',
      color: 'text-green-600'
    },
    {
      id: 'review' as InterviewMode,
      label: '閲覧',
      icon: Eye,
      description: '過去の記録を確認',
      color: 'text-purple-600'
    }
  ];

  return (
    <Card className={cn("mb-4 print:hidden", className)}>
      <CardContent className="p-4 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">利用モード</span>
          </div>
          <div className="flex space-x-2">
            {modes.map((modeOption) => {
              const Icon = modeOption.icon;
              const isActive = mode === modeOption.id;
              
              return (
                <Button
                  key={modeOption.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onModeChange(modeOption.id)}
                  className={cn(
                    "transition-all",
                    isActive && "shadow-md"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 mr-2",
                    isActive ? "text-white" : modeOption.color
                  )} />
                  <div className="text-left">
                    <div className="font-medium">{modeOption.label}</div>
                    <div className={cn(
                      "text-xs",
                      isActive ? "text-gray-200" : "text-gray-500"
                    )}>
                      {modeOption.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}