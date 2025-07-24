import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'

interface ReportCardProps {
  href: string
  icon: LucideIcon
  title: string
  description: string
  updateFrequency: string
  lastUpdated: string
  iconColor?: string
}

export const ReportCard: React.FC<ReportCardProps> = ({
  href,
  icon: Icon,
  title,
  description,
  updateFrequency,
  lastUpdated,
  iconColor = 'text-blue-500'
}) => {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition-shadow hover:shadow-lg cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{updateFrequency}</Badge>
            <span className="text-xs text-muted-foreground">
              最終更新: {lastUpdated}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}