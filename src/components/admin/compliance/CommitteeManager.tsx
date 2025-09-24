'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Calendar,
  Vote,
  Shield,
  Clock,
  ChevronRight,
  Gavel,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Committee, CommitteeMember } from '@/types/complianceMaster';

const CommitteeManager: React.FC = () => {
  const [committees, setCommittees] = useState<Committee[]>([
    {
      id: '1',
      name: 'ハラスメント対策委員会',
      type: 'harassment',
      members: [
        { userId: '1', name: '竹内看護部長', role: 'chair', votingRights: true, term: { start: '2025-04-01', end: '2027-03-31' }},
        { userId: '2', name: '竹迫事務長', role: 'vice-chair', votingRights: true, term: { start: '2025-04-01', end: '2027-03-31' }},
        { userId: '3', name: '人事部長', role: 'secretary', votingRights: true, term: { start: '2025-04-01', end: '2027-03-31' }},
        { userId: '4', name: '外部弁護士', role: 'member', votingRights: true, term: { start: '2025-04-01', end: '2027-03-31' }},
        { userId: '5', name: '産業医', role: 'member', votingRights: false, term: { start: '2025-04-01', end: '2027-03-31' }}
      ],
      jurisdiction: ['パワハラ', 'セクハラ', 'マタハラ', 'モラハラ'],
      quorum: 3,
      decisionAuthority: ['事実調査', '処分勧告', '再発防止策策定'],
      meetingFrequency: '月次1回および臨時',
      reportingLine: '理事長'
    },
    {
      id: '2',
      name: '懲戒委員会',
      type: 'disciplinary',
      members: [
        { userId: '6', name: '副院長', role: 'chair', votingRights: true, term: { start: '2025-04-01', end: '2027-03-31' }},
        { userId: '7', name: '医局長', role: 'vice-chair', votingRights: true, term: { start: '2025-04-01', end: '2027-03-31' }},
        { userId: '8', name: '総務部長', role: 'secretary', votingRights: true, term: { start: '2025-04-01', end: '2027-03-31' }},
        { userId: '9', name: '外部有識者', role: 'member', votingRights: true, term: { start: '2025-04-01', end: '2027-03-31' }}
      ],
      jurisdiction: ['就業規則違反', '不正行為', '重大過失'],
      quorum: 3,
      decisionAuthority: ['懲戒処分決定', '解雇勧告'],
      meetingFrequency: '必要に応じて臨時開催',
      reportingLine: '理事会'
    },
    {
      id: '3',
      name: '労働衛生委員会',
      type: 'safety',
      members: [
        { userId: '10', name: '総務部長', role: 'chair', votingRights: true, term: { start: '2025-04-01', end: '2026-03-31' }},
        { userId: '11', name: '産業医', role: 'member', votingRights: true, term: { start: '2025-04-01', end: '2026-03-31' }},
        { userId: '12', name: '衛生管理者', role: 'member', votingRights: true, term: { start: '2025-04-01', end: '2026-03-31' }},
        { userId: '13', name: '労働組合代表', role: 'member', votingRights: true, term: { start: '2025-04-01', end: '2026-03-31' }}
      ],
      jurisdiction: ['労働環境', '健康管理', '安全衛生'],
      quorum: 2,
      decisionAuthority: ['労働環境改善', '健康障害防止策'],
      meetingFrequency: '月次1回',
      reportingLine: '院長'
    }
  ]);

  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(committees[0]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'harassment': return 'bg-purple-100 text-purple-800';
      case 'disciplinary': return 'bg-red-100 text-red-800';
      case 'ethics': return 'bg-blue-100 text-blue-800';
      case 'safety': return 'bg-green-100 text-green-800';
      case 'audit': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'chair': return 'bg-red-600 text-white';
      case 'vice-chair': return 'bg-orange-600 text-white';
      case 'secretary': return 'bg-blue-600 text-white';
      case 'member': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'chair': return '委員長';
      case 'vice-chair': return '副委員長';
      case 'secretary': return '書記';
      case 'member': return '委員';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* 委員会一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            委員会一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {committees.map((committee) => (
              <div
                key={committee.id}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                  selectedCommittee?.id === committee.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedCommittee(committee)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-lg flex items-center gap-2">
                      <Gavel className="h-5 w-5" />
                      {committee.name}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getTypeColor(committee.type)}>
                        {committee.type === 'harassment' ? 'ハラスメント' :
                         committee.type === 'disciplinary' ? '懲戒' :
                         committee.type === 'safety' ? '安全衛生' :
                         committee.type === 'ethics' ? '倫理' : '監査'}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-700">
                        委員{committee.members.length}名
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700">
                        定足数{committee.quorum}名
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {committee.meetingFrequency}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4" />
                    報告先: {committee.reportingLine}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            新しい委員会を追加
          </button>
        </CardContent>
      </Card>

      {/* 選択された委員会の詳細 */}
      {selectedCommittee && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedCommittee.name} - 委員構成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedCommittee.members.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">
                          任期: {new Date(member.term.start).toLocaleDateString('ja-JP')} 〜 {new Date(member.term.end).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleLabel(member.role)}
                      </Badge>
                      {member.votingRights && (
                        <Badge className="bg-green-100 text-green-800">
                          <Vote className="h-3 w-3 mr-1" />
                          議決権あり
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                委員を追加
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                管轄・権限
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">管轄事項</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCommittee.jurisdiction.map((item) => (
                    <Badge key={item} className="bg-blue-100 text-blue-800">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">決定権限</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCommittee.decisionAuthority.map((authority) => (
                    <Badge key={authority} className="bg-orange-100 text-orange-800">
                      {authority}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">定足数</div>
                  <div className="text-xl font-medium">{selectedCommittee.quorum}名</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">報告先</div>
                  <div className="text-xl font-medium">{selectedCommittee.reportingLine}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                会議スケジュール
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">定例会議</span>
                  </div>
                  <p className="text-sm text-blue-800">{selectedCommittee.meetingFrequency}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">直近の会議予定</h4>
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">2025年9月25日(水) 15:00-16:00</div>
                        <div className="text-sm text-gray-600">定例会議</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        開催予定
                      </Badge>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">2025年10月23日(水) 15:00-16:00</div>
                        <div className="text-sm text-gray-600">定例会議</div>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">
                        予定
                      </Badge>
                    </div>
                  </div>
                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  会議をスケジュール
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5" />
                議決ルール
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">一般議決</div>
                    <div className="font-medium">過半数</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">重要議決</div>
                    <div className="font-medium">2/3以上</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">特別議決</div>
                    <div className="font-medium">全会一致</div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">議決要件</span>
                  </div>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    <li>• 定足数({selectedCommittee.quorum}名)以上の出席が必要</li>
                    <li>• 議決権を持つ委員のみが投票可能</li>
                    <li>• 委員長は可否同数の場合のみ投票</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CommitteeManager;