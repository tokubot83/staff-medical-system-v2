import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface CategoryReportCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  features: string[];
  onClick: () => void;
}

export default function CategoryReportCard({
  title,
  description,
  icon,
  gradient,
  features,
  onClick
}: CategoryReportCardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}