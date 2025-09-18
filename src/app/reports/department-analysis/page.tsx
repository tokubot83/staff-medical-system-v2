import DepartmentAnalysisReport from '@/components/reports/DepartmentAnalysisReport'
import BreadcrumbBar from '@/components/navigation/BreadcrumbBar'

export default function DepartmentAnalysisPage() {
  return (
    <div className="container mx-auto p-6">
      <BreadcrumbBar />
      <DepartmentAnalysisReport />
    </div>
  )
}