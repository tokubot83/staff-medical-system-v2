'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Building2,
  Calendar,
  Phone,
  Mail,
  IdCard
} from 'lucide-react';

interface PersonalDashboardProps {
  employeeId?: string;
  employeeName?: string;
  selectedStaff?: any; // 職員カルテから渡されるデータ
}

// 施設マッピング
const facilityMapping = {
  '小原病院': '小原病院',
  '立神リハビリテーション温泉病院': '立神リハビリテーション温泉病院',
  '慢性期病院': '立神リハビリテーション温泉病院', // 修正
  'リハビリ病院': '立神リハビリテーション温泉病院'
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ 
  employeeId = 'E001',
  employeeName = '山田 太郎',
  selectedStaff
}) => {

  // 基本情報に特化したデータ
  const personalData = selectedStaff ? {
    // 個人情報
    employeeId: selectedStaff.id || 'OH-NS-2021-001',
    name: selectedStaff.name || employeeName,
    age: selectedStaff.age || 29,
    birthDate: selectedStaff.birthDate || '1995-03-15',
    birthPlace: selectedStaff.birthPlace || '大阪府',
    
    // 配属・所属情報
    facility: facilityMapping[selectedStaff.facility] || selectedStaff.facility || '小原病院',
    department: selectedStaff.department || '3階病棟',
    position: selectedStaff.position || '看護師',
    jobTitle: selectedStaff.jobTitle || '', // 役職
    
    // 雇用・経歴情報
    joinDate: selectedStaff.joinDate || '2021-04-01',
    employmentType: selectedStaff.employmentType || '正職員',
    education: selectedStaff.education || '看護専門学校卒業',
    previousJob: selectedStaff.previousJob || '新卒',
    
    // 連絡先情報
    emergencyContact: selectedStaff.emergencyContact || {
      name: '田中 花子',
      relationship: '配偶者',
      phone: '090-1234-5678'
    },
    email: selectedStaff.email || 'yamada@example.com',
    phone: selectedStaff.phone || '090-0000-0000'
  } : {
    // デフォルトデータ
    employeeId: employeeId,
    name: employeeName,
    age: 32,
    birthDate: '1992-01-15',
    birthPlace: '兵庫県',
    
    facility: '小原病院',
    department: '看護部',
    position: '主任看護師',
    jobTitle: '主任',
    
    joinDate: '2018-04-01',
    employmentType: '正職員',
    education: '看護大学卒業',
    previousJob: '他院での経験3年',
    
    emergencyContact: {
      name: '山田 次郎',
      relationship: '配偶者',
      phone: '090-9876-5432'
    },
    email: 'yamada.taro@example.com',
    phone: '090-1111-1111'
  };

  // 勤続年数計算
  const calculateYearsOfService = (joinDate: string) => {
    const join = new Date(joinDate);
    const today = new Date();
    const diffTime = today.getTime() - join.getTime();
    const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return { years, months };
  };

  const yearsOfService = calculateYearsOfService(personalData.joinDate);

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{personalData.name}</h1>
            <p className="text-lg text-blue-100 mt-1">{personalData.facility}</p>
            <p className="text-blue-200">
              {personalData.department} / {personalData.position}
              {personalData.jobTitle && ` / ${personalData.jobTitle}`}
            </p>
            <p className="text-sm text-blue-300 mt-2">
              職員ID: {personalData.employeeId} | 年齢: {personalData.age}歳
            </p>
          </div>
        </div>
      </div>

      {/* 基本情報カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 個人情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              個人情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">生年月日</span>
              <span className="text-sm font-medium">{personalData.birthDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">年齢</span>
              <span className="text-sm font-medium">{personalData.age}歳</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">出身地</span>
              <span className="text-sm font-medium">{personalData.birthPlace}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">職員ID</span>
              <span className="text-sm font-medium font-mono">{personalData.employeeId}</span>
            </div>
          </CardContent>
        </Card>

        {/* 配属・所属情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              配属・所属
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-600 block mb-1">配属施設</span>
              <Badge variant="secondary" className="text-sm">{personalData.facility}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">所属部署</span>
              <span className="text-sm font-medium">{personalData.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">職種</span>
              <span className="text-sm font-medium">{personalData.position}</span>
            </div>
            {personalData.jobTitle && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">役職</span>
                <Badge variant="outline">{personalData.jobTitle}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 雇用・経歴情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              雇用・経歴
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">入職日</span>
              <span className="text-sm font-medium">{personalData.joinDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">勤続年数</span>
              <span className="text-sm font-medium">
                {yearsOfService.years}年{yearsOfService.months}ヶ月
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">雇用形態</span>
              <Badge variant={personalData.employmentType === '正職員' ? 'default' : 'secondary'}>
                {personalData.employmentType}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">学歴</span>
              <span className="text-sm font-medium">{personalData.education}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">職歴</span>
              <span className="text-sm font-medium">{personalData.previousJob}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 連絡先情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            連絡先情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">本人連絡先</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{personalData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{personalData.phone}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">緊急連絡先</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">氏名</span>
                  <span className="text-sm font-medium">{personalData.emergencyContact.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">続柄</span>
                  <span className="text-sm font-medium">{personalData.emergencyContact.relationship}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{personalData.emergencyContact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 他タブへのクイックリンク */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="h-5 w-5" />
            関連情報・詳細タブ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="text-2xl mb-2">📜</div>
              <div className="text-sm font-medium">資格・専門性</div>
              <div className="text-xs text-gray-500 mt-1">保有資格・免許詳細</div>
            </div>
            <div className="text-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium">最新評価</div>
              <div className="text-xs text-gray-500 mt-1">評価結果・分析</div>
            </div>
            <div className="text-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium">評価履歴</div>
              <div className="text-xs text-gray-500 mt-1">過去の評価推移</div>
            </div>
            <div className="text-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="text-2xl mb-2">🎓</div>
              <div className="text-sm font-medium">教育・研修</div>
              <div className="text-xs text-gray-500 mt-1">研修履歴・計画</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDashboard;