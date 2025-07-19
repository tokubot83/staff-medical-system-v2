'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { staffListData, staffDatabase } from './data/staffData';

// 型定義
interface Staff {
 id: string;
 name: string;
 nameInitial: string;
 department: string;
 position: string;
 facility?: string;
 grade: 'S' | 'A' | 'B' | 'C';
 status: 'excellent' | 'good' | 'average' | 'poor';
 statusText: string;
 nextAction: string;
 priority: 'emergency' | 'high' | 'medium' | 'normal';
 avatar: string;
 riskLevel?: number;
}

interface Task {
 id: string;
 content: string;
 time: string;
 priority: 'urgent' | 'normal';
 completed: boolean;
}

interface AlertItem {
 id: string;
 type: 'critical' | 'warning' | 'info';
 title: string;
 content: string;
 time: string;
 buttonText: string;
 staffName?: string;
}

interface SuccessItem {
 id: string;
 title: string;
 content: string;
 time: string;
 buttonText: string;
 staffName?: string;
}

type TabType = 'overview' | 'staff' | 'interview' | 'evaluation' | 'training' | 'analytics';

export default function Home() {
 const [activeTab, setActiveTab] = useState<TabType>('overview');
 const [activeAlertTab, setActiveAlertTab] = useState<'personal' | 'department'>('personal');
 const [activeSuccessTab, setActiveSuccessTab] = useState<'personal' | 'department'>('personal');
 const [showModal, setShowModal] = useState(false);
 const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
 const [tasks, setTasks] = useState<Task[]>([
  { id: '1', content: '中村恵子さん 緊急面談', time: '9:00', priority: 'urgent', completed: false },
  { id: '2', content: '田中美咲さん 昇進検討面談', time: '10:30', priority: 'urgent', completed: false },
  { id: '3', content: '月次評価会議準備', time: '14:00', priority: 'normal', completed: false },
  { id: '4', content: '新人研修計画レビュー', time: '16:00', priority: 'normal', completed: false },
  { id: '5', content: '外来部門 緊急対策会議', time: '17:00', priority: 'urgent', completed: false },
  { id: '6', content: '分析レポート確認', time: '18:00', priority: 'normal', completed: false },
  { id: '7', content: '産業医面談（鈴木一郎さん）', time: '11:00', priority: 'urgent', completed: false },
  { id: '8', content: '新人看護師オリエンテーション', time: '13:00', priority: 'normal', completed: false },
  { id: '9', content: '労務管理システム更新確認', time: '15:30', priority: 'normal', completed: false },
  { id: '10', content: '部署長会議資料準備', time: '19:00', priority: 'normal', completed: false },
 ]);

 // モックデータ
 const staffData: Staff[] = [
  {
   id: 'NS-2025-001',
   name: '佐藤花子',
   nameInitial: '佐',
   department: '内科病棟',
   position: '看護師',
   grade: 'A',
   status: 'excellent',
   statusText: 'JNAラダーⅣ',
   nextAction: '1/20 キャリア面談',
   priority: 'normal',
   avatar: 'bg-gradient-to-r from-purple-500 to-pink-600'
  },
  {
   id: 'NS-2018-035',
   name: '中村恵子',
   nameInitial: '中',
   department: '外来',
   position: '看護師',
   grade: 'C',
   status: 'poor',
   statusText: '離職リスク高',
   nextAction: '本日 9:00 緊急面談',
   priority: 'emergency',
   avatar: 'bg-gradient-to-r from-purple-500 to-pink-600',
   riskLevel: 84
  },
  {
   id: 'NS-2021-047',
   name: '田中美咲',
   nameInitial: '田',
   department: '地域包括ケア病棟',
   position: '看護師',
   grade: 'A',
   status: 'excellent',
   statusText: '昇進候補',
   nextAction: '本日 10:30 昇進面談',
   priority: 'high',
   avatar: 'bg-gradient-to-r from-purple-500 to-pink-600'
  },
  {
   id: 'NS-2024-012',
   name: '小林さくら',
   nameInitial: '小',
   department: '外科病棟',
   position: '看護師',
   grade: 'B',
   status: 'average',
   statusText: '新人フォロー要',
   nextAction: '1/18 フォローアップ面談',
   priority: 'high',
   avatar: 'bg-gradient-to-r from-purple-500 to-pink-600'
  },
  {
   id: 'NS-2015-008',
   name: '伊藤由美',
   nameInitial: '伊',
   department: '緩和ケア病棟',
   position: '看護師（認定看護師）',
   grade: 'S',
   status: 'excellent',
   statusText: 'エキスパート',
   nextAction: '2/5 研究発表準備',
   priority: 'normal',
   avatar: 'bg-gradient-to-r from-purple-500 to-pink-600'
  },
  {
   id: 'NS-2017-022',
   name: '渡辺麻衣',
   nameInitial: '渡',
   department: '小児科病棟',
   position: '看護師',
   grade: 'B',
   status: 'good',
   statusText: '復職支援中',
   nextAction: '1/22 キャリア相談',
   priority: 'medium',
   avatar: 'bg-gradient-to-r from-purple-500 to-pink-600'
  }
 ];

 const personalAlerts: AlertItem[] = [
  {
   id: '1',
   type: 'critical',
   title: '連続欠勤検出',
   content: '中村恵子さん（外来）の欠勤が3日連続。離職リスク84%。',
   time: '13:45',
   buttonText: '緊急面談',
   staffName: '中村恵子'
  },
  {
   id: '2',
   type: 'critical',
   title: 'ストレス急上昇',
   content: '鈴木一郎さん（循環器内科）のストレス指数が危険レベル到達。',
   time: '11:20',
   buttonText: '対応開始',
   staffName: '鈴木一郎'
  },
  {
   id: '3',
   type: 'warning',
   title: '残業時間超過',
   content: '伊藤由美さん（3階病棟）の月間残業が32時間。',
   time: '12:30',
   buttonText: '面談予約',
   staffName: '伊藤由美'
  },
  {
   id: '4',
   type: 'critical',
   title: '急性疲労蓄積',
   content: '山田太郎さん（5階病棟）の疲労度が限界値。連続勤務72時間超過。',
   time: '10:15',
   buttonText: '即時対応',
   staffName: '山田太郎'
  },
  {
   id: '5',
   type: 'warning',
   title: 'パワハラ相談',
   content: '高橋さくらさん（リハビリテーション科）より上司に関する相談申請。',
   time: '09:30',
   buttonText: '相談対応',
   staffName: '高橋さくら'
  },
  {
   id: '6',
   type: 'warning',
   title: '介護スタッフストレス',
   content: '渡辺花子さん（介護医療院）のストレス指数が上昇。立神リハビリ。',
   time: '08:45',
   buttonText: '面談調整',
   staffName: '渡辺花子'
  },
  {
   id: '7',
   type: 'critical',
   title: 'リハビリスタッフ不足',
   content: '木村洋平さん（リハビリテーション部門）が退職検討中。立神リハビリ。',
   time: '07:30',
   buttonText: '緊急対応',
   staffName: '木村洋平'
  }
 ];

 const departmentAlerts: AlertItem[] = [
  {
   id: '1',
   type: 'critical',
   title: '部署緊急事態',
   content: '外来部門で要注意職員が3名に達しました。離職リスク上昇中。',
   time: '14:15',
   buttonText: '部門分析'
  },
  {
   id: '2',
   type: 'warning',
   title: '残業部署超過',
   content: '3階病棟の平均残業時間が28時間/月。労基署対応要。',
   time: '13:20',
   buttonText: '業務見直し'
  },
  {
   id: '3',
   type: 'critical',
   title: '人員不足深刻',
   content: 'ICU部門で看護師3名が同時退職意向。シフト維持困難。',
   time: '11:45',
   buttonText: '緊急会議'
  },
  {
   id: '4',
   type: 'warning',
   title: '研修未受講多発',
   content: 'リハビリ科で必須研修の未受講者が40%超過。コンプライアンス違反リスク。',
   time: '10:00',
   buttonText: '研修計画'
  },
  {
   id: '5',
   type: 'warning',
   title: '患者満足度低下',
   content: '地域包括ケア病棟で患者満足度が前月比15%低下。職員対応に課題。',
   time: '08:30',
   buttonText: '原因分析'
  },
  {
   id: '6',
   type: 'warning',
   title: '外来残業超過',
   content: '立神リハビリ外来で平均残業25時間/月。人員配置見直し必要。',
   time: '07:00',
   buttonText: '人員計画'
  },
  {
   id: '7',
   type: 'critical',
   title: '第１病棟人員不足',
   content: '立神リハビリ第１病棟で看護師2名不足。シフト編成困難。',
   time: '06:30',
   buttonText: '緊急調整'
  }
 ];

 const personalSuccess: SuccessItem[] = [
  {
   id: '1',
   title: '昇進候補発見',
   content: '田中美咲さん（地域包括ケア）の評価が優秀。昇進適性85%。',
   time: '14:20',
   buttonText: '昇進検討',
   staffName: '田中美咲'
  },
  {
   id: '2',
   title: '成長顕著',
   content: '佐藤太郎さん（ICU）の評価が3ヶ月で15%向上。',
   time: '13:45',
   buttonText: '詳細確認',
   staffName: '佐藤太郎'
  },
  {
   id: '3',
   title: '資格取得',
   content: '小林花子さん（内科）が認定看護師資格を取得。専門性向上。',
   time: '12:00',
   buttonText: '活用検討',
   staffName: '小林花子'
  },
  {
   id: '4',
   title: 'メンター成果',
   content: '渡辺明さん（外来）の指導で新人3名の定着率100%達成。',
   time: '11:30',
   buttonText: '表彰推薦',
   staffName: '渡辺明'
  },
  {
   id: '5',
   title: '改善提案採用',
   content: '木村さん（リハビリ科）の業務効率化案で月20時間削減達成。',
   time: '10:45',
   buttonText: '詳細分析',
   staffName: '木村'
  },
  {
   id: '6',
   title: 'リハビリ成果',
   content: '鈴木明美さん（リハビリテーション部門）がPT主任昇格。立神リハビリ。',
   time: '09:30',
   buttonText: '祝福メッセージ',
   staffName: '鈴木明美'
  },
  {
   id: '7',
   title: '介護スキル向上',
   content: '山本花さん（介護医療院）が介護福祉士資格取得。立神リハビリ。',
   time: '08:15',
   buttonText: 'キャリア支援',
   staffName: '山本花'
  }
 ];

 const departmentSuccess: SuccessItem[] = [
  {
   id: '1',
   title: '部署パフォーマンス優秀',
   content: 'ICU部門：満足度89%（+5%）、離職率3.2%（-5.3%）の大幅改善。',
   time: '15:30',
   buttonText: '他部署展開'
  },
  {
   id: '2',
   title: '業務改善成功',
   content: '地域包括ケア病棟：残業20%削減、効率15%向上達成。',
   time: '14:45',
   buttonText: '成功分析'
  },
  {
   id: '3',
   title: 'チーム医療推進',
   content: '内科病棟：多職種連携強化で患者満足度92%達成。全国平均超え。',
   time: '13:15',
   buttonText: 'モデル化'
  },
  {
   id: '4',
   title: '教育プログラム効果',
   content: '外来部門：新人教育プログラム導入で習熟期間40%短縮。',
   time: '11:00',
   buttonText: '横展開'
  },
  {
   id: '5',
   title: '働き方改革成功',
   content: 'リハビリ科：フレックス制導入で有給取得率85%達成。',
   time: '09:45',
   buttonText: '制度拡大'
  },
  {
   id: '6',
   title: '介護医療院満足度向上',
   content: '立神リハビリ介護医療院：入居者満足度91%達成。全国平均上回る。',
   time: '08:00',
   buttonText: '成功事例共有'
  },
  {
   id: '7',
   title: 'リハビリ部門成績',
   content: '立神リハビリリハビリテーション部門：機能改善率92%。運動療法効果高い。',
   time: '07:30',
   buttonText: '治療法共有'
  }
 ];

 const toggleTask = (taskId: string) => {
  setTasks(tasks.map(task => 
   task.id === taskId ? { ...task, completed: !task.completed } : task
  ));
 };

 const handleStaffClick = (staff: Staff) => {
  setSelectedStaff(staff);
  setShowModal(true);
 };

 const getStatusBadgeClass = (status: string) => {
  switch (status) {
   case 'excellent': return 'bg-green-100 text-green-800 border border-green-300';
   case 'good': return 'bg-blue-100 text-blue-800 border border-blue-300';
   case 'average': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
   case 'poor': return 'bg-red-100 text-red-800 border border-red-300';
   default: return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
 };

 const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
   case 'emergency': return 'bg-red-100 text-red-800 border border-red-300';
   case 'high': return 'bg-orange-100 text-orange-800 border border-orange-300';
   case 'medium': return 'bg-blue-100 text-blue-800 border border-blue-300';
   case 'normal': return 'bg-green-100 text-green-800 border border-green-300';
   default: return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
 };

 const getAlertTypeClass = (type: string) => {
  switch (type) {
   case 'critical': return 'border-l-red-500 bg-red-50';
   case 'warning': return 'border-l-yellow-500 bg-yellow-50';
   case 'info': return 'border-l-blue-500 bg-blue-50';
   default: return 'border-l-gray-500 bg-gray-50';
  }
 };

 const getAlertButtonClass = (type: string) => {
  switch (type) {
   case 'critical': return 'bg-red-500 hover:bg-red-600 text-white';
   case 'warning': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
   case 'info': return 'bg-blue-500 hover:bg-blue-600 text-white';
   default: return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
 };

 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <header className="bg-white text-gray-800 p-5 border-b">
    <div className="flex justify-between items-center">
     <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl">
       🏥
      </div>
      <div>
       <h1 className="text-2xl font-light">職員カルテシステム</h1>
       <p className="text-sm opacity-90">医療法人厚生会</p>
      </div>
     </div>
     <div className="flex items-center gap-4">
      <div className="relative">
       <input
        type="text"
        placeholder="職員名・ID・部署で検索..."
        className="w-80 px-4 py-2 rounded-full text-gray-700 pr-20"
       />
       <button className="absolute right-1 top-1 bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
        検索
       </button>
      </div>
      <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
       <span>人事部 田中さん</span>
       <div className="w-8 h-8 bg-gray-200 border border-gray-400 rounded-full flex items-center justify-center font-bold text-gray-700">
        田
       </div>
      </div>
     </div>
    </div>
   </header>

   {/* アクションセンター */}
   <div className="bg-white">
    <div className="max-w-7xl mx-auto p-5">
     <div className="mb-12">
      <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
       <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
        ⚡
       </div>
       <div>
        <h2 className="text-2xl font-bold text-gray-800">アクションセンター</h2>
        <p className="text-sm text-gray-600">緊急対応が必要な情報</p>
       </div>
      </div>
     
      {/* 最優先エリア */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       {/* 今日のタスク */}
       <div className="bg-gray-50 rounded-xl p-6 shadow-md border-t-4 border-green-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
       <h2 className="text-lg font-semibold flex items-center gap-2">
        📅 今日のタスク
       </h2>
       <span className="bg-gray-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">
        {tasks.filter(t => !t.completed).length}件
       </span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
       {tasks.map((task) => (
        <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${
         task.priority === 'urgent' ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500 bg-blue-50'
        } hover:bg-gray-50 transition-colors cursor-pointer`}>
         <div
          className={`w-5 h-5 border-2 border-gray-400 rounded cursor-pointer flex items-center justify-center transition-colors ${
           task.completed ? 'bg-blue-500 border-blue-500 text-white' : 'hover:border-blue-500 bg-white'
          }`}
          onClick={() => toggleTask(task.id)}
         >
          {task.completed && '✓'}
         </div>
         <div className="flex-1 text-sm font-medium text-gray-600">
          {task.content}
         </div>
         <div className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded-full border border-gray-300">
          {task.time}
         </div>
        </div>
       ))}
      </div>
     </div>

       {/* 緊急アラート */}
       <div className="bg-gray-50 rounded-xl p-6 shadow-md border-t-4 border-red-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
       <h2 className="text-lg font-semibold flex items-center gap-2">
        🚨 緊急アラート
       </h2>
       <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
        5件
       </span>
      </div>
      
      <div className="flex bg-gray-200 rounded-lg p-1 mb-4 border border-gray-300">
       <button
        className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
         activeAlertTab === 'personal' 
          ? 'bg-gray-50 border-2 border-gray-700 text-gray-800 shadow-sm' 
          : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setActiveAlertTab('personal')}
       >
        👤 個人版
       </button>
       <button
        className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
         activeAlertTab === 'department' 
          ? 'bg-gray-50 border-2 border-gray-700 text-gray-800 shadow-sm' 
          : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setActiveAlertTab('department')}
       >
        🏢 部署版
       </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
       {(activeAlertTab === 'personal' ? personalAlerts : departmentAlerts).map((alert) => (
        <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getAlertTypeClass(alert.type)} hover:bg-gray-50 transition-colors cursor-pointer`}>
         <div className="absolute text-xs text-gray-500 top-2 right-3">
          {alert.time}
         </div>
         <div className="font-semibold text-gray-800 mb-1">{alert.title}</div>
         <div className="text-sm text-gray-600 mb-2 line-height-relaxed">
          {alert.staffName ? (
           <>
            <span 
             className="text-blue-600 cursor-pointer underline hover:text-blue-800"
             onClick={() => {
              const staff = staffData.find(s => s.name === alert.staffName);
              if (staff) handleStaffClick(staff);
             }}
            >
             {alert.staffName}さん
            </span>
            {alert.content.replace(alert.staffName + 'さん', '')}
           </>
          ) : (
           alert.content
          )}
         </div>
         <button className={`text-white px-3 py-1 rounded-md text-xs font-semibold transition-colors ${getAlertButtonClass(alert.type)}`}>
          {alert.buttonText}
         </button>
        </div>
       ))}
      </div>
       </div>

       {/* 成功・良好状態 */}
       <div className="bg-gray-50 rounded-xl p-6 shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
       <h2 className="text-lg font-semibold flex items-center gap-2">
        🌟 成功・良好状態
       </h2>
       <span className="bg-gray-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200">
        5件
       </span>
      </div>
      
      <div className="flex bg-gray-200 rounded-lg p-1 mb-4 border border-gray-300">
       <button
        className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
         activeSuccessTab === 'personal' 
          ? 'bg-gray-50 border-2 border-gray-700 text-gray-800 shadow-sm' 
          : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setActiveSuccessTab('personal')}
       >
        👤 個人版
       </button>
       <button
        className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
         activeSuccessTab === 'department' 
          ? 'bg-gray-50 border-2 border-gray-700 text-gray-800 shadow-sm' 
          : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setActiveSuccessTab('department')}
       >
        🏢 部署版
       </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
       {(activeSuccessTab === 'personal' ? personalSuccess : departmentSuccess).map((success) => (
        <div key={success.id} className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50 hover:bg-gray-50 transition-colors cursor-pointer">
         <div className="text-xs text-gray-500 absolute top-2 right-3">
          {success.time}
         </div>
         <div className="font-semibold text-gray-800 mb-1">{success.title}</div>
         <div className="text-sm text-gray-600 mb-2 line-height-relaxed">
          {success.staffName ? (
           <>
            <span 
             className="text-blue-600 cursor-pointer underline hover:text-blue-800"
             onClick={() => {
              const staff = staffData.find(s => s.name === success.staffName);
              if (staff) handleStaffClick(staff);
             }}
            >
             {success.staffName}さん
            </span>
            {success.content.replace(success.staffName + 'さん', '')}
           </>
          ) : (
           success.content
          )}
         </div>
         <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-semibold transition-colors">
          {success.buttonText}
         </button>
        </div>
       ))}
      </div>
     </div>
      </div>
     </div>
    </div>
   </div>

   {/* 組織健康診断 */}
   <div className="bg-white">
    <div className="max-w-7xl mx-auto p-5">
     <div className="mb-12">
      <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-rose-200">
      <div className="flex items-center gap-3 mb-6">
       <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
        📊
       </div>
       <div>
        <h2 className="text-2xl font-bold text-gray-800">組織健康診断</h2>
        <p className="text-sm text-gray-600">組織全体の状態を数値で把握</p>
       </div>
      </div>
      
      {/* 統計カード - 5カテゴリ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
       <Link href="/metrics/basic" className="bg-gray-50 rounded-xl p-5 text-center shadow-md border-t-4 border-green-500 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="text-3xl font-bold text-gray-800 mb-1">500</div>
      <div className="text-sm text-gray-600 mb-2">基本指標</div>
      <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">総職員数</div>
       </Link>
       <Link href="/metrics/quality" className="bg-gray-50 rounded-xl p-5 text-center shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="text-3xl font-bold text-gray-800 mb-1">87%</div>
      <div className="text-sm text-gray-600 mb-2">人材の質</div>
      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">総合満足度</div>
       </Link>
       <Link href="/metrics/growth" className="bg-gray-50 rounded-xl p-5 text-center shadow-md border-t-4 border-purple-500 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="text-3xl font-bold text-gray-800 mb-1">92%</div>
      <div className="text-sm text-gray-600 mb-2">人材の成長</div>
      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">研修受講率</div>
       </Link>
       <Link href="/metrics/risk" className="bg-gray-50 rounded-xl p-5 text-center shadow-md border-t-4 border-yellow-500 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="text-3xl font-bold text-gray-800 mb-1">12</div>
      <div className="text-sm text-gray-600 mb-2">リスク管理</div>
      <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">要注意職員</div>
       </Link>
       <Link href="/metrics/efficiency" className="bg-gray-50 rounded-xl p-5 text-center shadow-md border-t-4 border-red-500 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="text-3xl font-bold text-gray-800 mb-1">3</div>
      <div className="text-sm text-gray-600 mb-2">組織効率</div>
      <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">緊急対応要</div>
       </Link>
      </div>

      {/* 詳細レポートボタン */}
      <div className="mt-6">
       <Link href="/reports" className="block">
        <button className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3">
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
         </svg>
         <span className="text-lg">詳細レポートを見る</span>
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
         </svg>
        </button>
       </Link>
      </div>
     </div>
    </div>
   </div>

   {/* 職員カルテ */}
   <div className="bg-white">
    <div className="max-w-7xl mx-auto p-5">
     <div className="mb-12">
      <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-fuchsia-200">
      <div className="flex items-center gap-3 mb-6">
       <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
        📋
       </div>
       <div>
        <h2 className="text-2xl font-bold text-gray-800">職員カルテ</h2>
        <p className="text-sm text-gray-600">個々の職員情報を詳細に管理</p>
       </div>
      </div>
      
      {/* 3つの独立したブロック */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
       {/* 今月の活動統計 */}
       <div className="bg-gray-50 rounded-xl p-6 shadow-md border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 今月の活動統計</h3>
        <div className="space-y-3">
         <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">面談実施</span>
          <span className="text-xl font-bold text-purple-600">24件</span>
         </div>
         <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">評価完了</span>
          <span className="text-xl font-bold text-green-600">156名</span>
         </div>
         <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">研修参加</span>
          <span className="text-xl font-bold text-blue-600">89名</span>
         </div>
         <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">離職率</span>
          <span className="text-xl font-bold text-red-600">2.3%</span>
         </div>
        </div>
       </div>

       {/* クイックアクション */}
       <div className="bg-gray-50 rounded-xl p-6 shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ クイックアクション</h3>
        <div className="space-y-3">
         <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
          新規職員登録
         </button>
         <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
          面談予約
         </button>
         <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
          評価入力
         </button>
         <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
          レポート作成
         </button>
        </div>
       </div>

       {/* 重要指標サマリー */}
       <div className="bg-gray-50 rounded-xl p-6 shadow-md border-t-4 border-green-500 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 重要指標</h3>
        <div className="space-y-3">
         <div className="bg-red-100 p-3 rounded-lg">
          <div className="text-sm text-red-700 font-semibold">緊急対応必要</div>
          <div className="text-2xl font-bold text-red-800">3名</div>
         </div>
         <div className="bg-yellow-100 p-3 rounded-lg">
          <div className="text-sm text-yellow-700 font-semibold">要注意職員</div>
          <div className="text-2xl font-bold text-yellow-800">12名</div>
         </div>
         <div className="bg-green-100 p-3 rounded-lg">
          <div className="text-sm text-green-700 font-semibold">優秀職員</div>
          <div className="text-2xl font-bold text-green-800">45名</div>
         </div>
        </div>
       </div>
      </div>
      
      {/* メインダッシュボード */}
      <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* タブナビゲーション */}
      <div className="flex bg-white border-b border-gray-200">
       {[
        { key: 'overview', label: '📊 全体状況' },
        { key: 'staff', label: '👥 職員管理' },
        { key: 'interview', label: '💬 面談管理' },
        { key: 'evaluation', label: '📋 評価管理' },
        { key: 'training', label: '🎓 教育・研修' }
       ].map((tab) => (
        <button
         key={tab.key}
         className={`flex-1 px-4 py-4 text-sm font-medium transition-colors border-b-3 ${
          activeTab === tab.key
           ? 'text-blue-600 bg-white border-blue-600'
           : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 border-transparent'
         }`}
         onClick={() => setActiveTab(tab.key as TabType)}
        >
         {tab.label}
        </button>
       ))}
      </div>

      {/* タブコンテンツ */}
      <div className="p-6">
       {activeTab === 'overview' && (
        <div>
         <h3 className="text-lg font-semibold text-gray-800 mb-5">重点管理対象職員</h3>
         <div className="overflow-x-auto">
          <table className="w-full">
           <thead>
            <tr className="border-b border-gray-200">
             <th className="text-left py-3 px-4 font-semibold text-gray-600">職員名</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">部署</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">総合評価</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">状態</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">次回アクション</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">優先度</th>
            </tr>
           </thead>
           <tbody>
            {staffData.map((staff) => (
             <tr
              key={staff.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleStaffClick(staff)}
             >
              <td className="py-4 px-4">
               <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold ${staff.avatar}`}>
                 {staff.nameInitial}
                </div>
                <div>
                 <Link href={`/staff/${staff.id}`} className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                  {staff.name}
                 </Link>
                 <div className="text-xs text-gray-500">{staff.id}</div>
                </div>
               </div>
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">{staff.department}</td>
              <td className="py-4 px-4">
               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(staff.status)}`}>
                {staff.grade}
               </span>
              </td>
              <td className="py-4 px-4">
               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(staff.status)}`}>
                {staff.statusText}
               </span>
              </td>
              <td className="py-4 px-4 text-sm font-medium text-gray-800">{staff.nextAction}</td>
              <td className="py-4 px-4">
               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeClass(staff.priority)}`}>
                {staff.priority === 'emergency' ? '緊急' : staff.priority === 'high' ? '高' : staff.priority === 'medium' ? '中' : '低'}
               </span>
              </td>
             </tr>
            ))}
           </tbody>
          </table>
         </div>
        </div>
       )}

       {activeTab === 'staff' && (
        <div>
         <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center justify-between">
          職員管理 - 人材の見える化
          <div className="flex items-center gap-3">
           <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">職員追加</button>
           <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300">エクスポート</button>
          </div>
         </h3>
         
         <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
           <h4 className="font-semibold text-blue-800 mb-2">施設別職員数</h4>
           <div className="space-y-2">
            <div className="flex justify-between text-sm">
             <span>小原病院（急性期）</span>
             <span className="font-semibold">420名</span>
            </div>
            <div className="flex justify-between text-sm">
             <span>立神リハビリテーション温泉病院</span>
             <span className="font-semibold">180名</span>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
             <div className="flex justify-between text-sm font-semibold">
              <span>総職員数</span>
              <span>600名</span>
             </div>
            </div>
           </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
           <h4 className="font-semibold text-green-800 mb-2">職種別分布</h4>
           <div className="space-y-2">
            <div className="flex justify-between text-sm">
             <span>看護師</span>
             <span className="font-semibold">245名</span>
            </div>
            <div className="flex justify-between text-sm">
             <span>医師</span>
             <span className="font-semibold">53名</span>
            </div>
            <div className="flex justify-between text-sm">
             <span>リハビリ職</span>
             <span className="font-semibold">75名</span>
            </div>
            <div className="flex justify-between text-sm">
             <span>介護職員</span>
             <span className="font-semibold">35名</span>
            </div>
            <div className="flex justify-between text-sm">
             <span>その他</span>
             <span className="font-semibold">192名</span>
            </div>
           </div>
          </div>
         </div>

         <div className="overflow-x-auto">
          <table className="w-full">
           <thead>
            <tr className="border-b border-gray-200">
             <th className="text-left py-3 px-4 font-semibold text-gray-600">職員名</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">施設</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">部署</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">職種</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">評価</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">状態</th>
             <th className="text-left py-3 px-4 font-semibold text-gray-600">アクション</th>
            </tr>
           </thead>
           <tbody>
            {Object.values(staffDatabase).slice(0, 6).map((staff) => {
             return (
              <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
               <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                 <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold ${staff.avatar}`}>
                  {staff.nameInitial}
                 </div>
                 <div>
                  <Link href={`/staff/${staff.id}`} className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                   {staff.name}
                  </Link>
                  <div className="text-xs text-gray-500">{staff.id}</div>
                 </div>
                </div>
               </td>
               <td className="py-4 px-4">
                <div className="text-sm text-gray-600">{staff.facility}</div>
                <div className="text-xs text-gray-400">
                 {staff.facility === '小原病院' ? '急性期' : '回復期リハ'}
                </div>
               </td>
               <td className="py-4 px-4 text-sm text-gray-600">{staff.department}</td>
               <td className="py-4 px-4 text-sm text-gray-600">{staff.position}</td>
               <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                 staff.evaluation === 'S' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                 staff.evaluation === 'A' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                 staff.evaluation === 'B+' || staff.evaluation === 'B' ? 'bg-green-100 text-green-800 border border-green-300' :
                 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}>
                 {staff.evaluation}評価
                </span>
               </td>
               <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                 staff.healthStatus === '良好' ? 'bg-green-100 text-green-800 border border-green-300' :
                 staff.healthStatus === '注意' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                 {staff.healthStatus}
                </span>
               </td>
               <td className="py-4 px-4">
                <Link href={`/staff/${staff.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                 詳細
                </Link>
               </td>
              </tr>
             );
            })}
           </tbody>
          </table>
         </div>
        </div>
       )}

       {activeTab === 'interview' && (
        <div>
         <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center justify-between">
          面談管理 - スマートスケジューリング
          <div className="flex items-center gap-3">
           <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">面談予約</button>
           <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300">カレンダー表示</button>
          </div>
         </h3>
         
         <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
           <div className="text-3xl font-bold text-red-600">3</div>
           <div className="text-sm text-red-700">緊急面談要</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
           <div className="text-3xl font-bold text-yellow-600">12</div>
           <div className="text-sm text-yellow-700">今月予定</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
           <div className="text-3xl font-bold text-green-600">8</div>
           <div className="text-sm text-green-700">完了済</div>
          </div>
         </div>

         <div className="space-y-4">
          <div className="bg-gray-50 border-l-4 border-red-500 p-4 rounded-lg">
           <div className="flex justify-between items-start">
            <div>
             <h4 className="font-semibold text-red-800">中村恵子さん - 緊急面談</h4>
             <p className="text-sm text-red-600 mt-1">離職リスク84% - 3日連続欠勤</p>
             <p className="text-xs text-gray-600 mt-2">推奨トピック: 勤務環境改善、メンタルヘルスサポート</p>
            </div>
            <div className="text-right">
             <div className="text-sm font-semibold text-red-700">本日 9:00</div>
             <button className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition-colors">開始</button>
            </div>
           </div>
          </div>
          
          <div className="bg-gray-50 border-l-4 border-green-500 p-4 rounded-lg">
           <div className="flex justify-between items-start">
            <div>
             <h4 className="font-semibold text-green-800">田中美咲さん - 昇進検討面談</h4>
             <p className="text-sm text-green-600 mt-1">主任昇進候補 - 準備度85%</p>
             <p className="text-xs text-gray-600 mt-2">推奨トピック: キャリアパス、管理職研修計画</p>
            </div>
            <div className="text-right">
             <div className="text-sm font-semibold text-green-700">本日 10:30</div>
             <button className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold transition-colors">準備</button>
            </div>
           </div>
          </div>
          
          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-lg">
           <div className="flex justify-between items-start">
            <div>
             <h4 className="font-semibold text-blue-800">小林さくらさん - 新人フォローアップ</h4>
             <p className="text-sm text-blue-600 mt-1">入職9ヶ月 - ストレス指数68</p>
             <p className="text-xs text-gray-600 mt-2">推奨トピック: 技術習得状況、職場適応、今後の目標</p>
            </div>
            <div className="text-right">
             <div className="text-sm font-semibold text-blue-700">1月18日 14:00</div>
             <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold transition-colors">詳細</button>
            </div>
           </div>
          </div>
         </div>
        </div>
       )}

       {activeTab === 'evaluation' && (
        <div>
         <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center justify-between">
          評価管理 - 360度評価システム
          <div className="flex items-center gap-3">
           <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">評価開始</button>
           <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300">レポート出力</button>
          </div>
         </h3>
         
         <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
           <div className="text-2xl font-bold text-purple-600">45</div>
           <div className="text-sm text-purple-700">評価待ち</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
           <div className="text-2xl font-bold text-blue-600">23</div>
           <div className="text-sm text-blue-700">評価中</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
           <div className="text-2xl font-bold text-green-600">156</div>
           <div className="text-sm text-green-700">完了済</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
           <div className="text-2xl font-bold text-yellow-600">8</div>
           <div className="text-sm text-yellow-700">承認待ち</div>
          </div>
         </div>

         <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-800 mb-4">評価期限が近い職員</h4>
          <div className="space-y-3">
           {[
            { name: '佐藤花子', dept: '内科病棟', dueDate: '1月20日', status: '自己評価完了', progress: 75 },
            { name: '伊藤由美', dept: '緩和ケア病棟', dueDate: '2月5日', status: '360度評価中', progress: 60 },
            { name: '渡辺麻衣', dept: '小児科病棟', dueDate: '1月22日', status: '上司評価待ち', progress: 85 },
            { name: '小林さくら', dept: '外科病棟', dueDate: '1月18日', status: '未開始', progress: 0 },
           ].map((staff, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
             <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full flex items-center justify-center font-semibold">
               {staff.name[0]}
              </div>
              <div>
               <div className="font-semibold text-gray-800">{staff.name}</div>
               <div className="text-sm text-gray-600">{staff.dept}</div>
              </div>
             </div>
             <div className="flex items-center gap-4">
              <div className="text-right">
               <div className="text-sm font-semibold text-gray-700">期限: {staff.dueDate}</div>
               <div className="text-xs text-gray-500">{staff.status}</div>
              </div>
              <div className="w-24">
               <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${staff.progress}%`}}></div>
               </div>
               <div className="text-xs text-gray-500 mt-1">{staff.progress}%</div>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
               詳細
              </button>
             </div>
            </div>
           ))}
          </div>
         </div>
        </div>
       )}

       {activeTab === 'training' && (
        <div>
         <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center justify-between">
          教育・研修 - スキルアップ支援
          <div className="flex items-center gap-3">
           <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">研修計画作成</button>
           <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300">受講履歴</button>
          </div>
         </h3>
         
         <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-5">
           <h4 className="font-semibold text-orange-800 mb-3">今月の研修予定</h4>
           <div className="space-y-3">
            <div className="flex justify-between items-center">
             <div>
              <div className="font-medium text-gray-800">BLS更新研修</div>
              <div className="text-sm text-gray-600">1月25日 13:00-17:00</div>
             </div>
             <div className="text-right">
              <div className="text-sm font-semibold text-orange-600">必須</div>
              <div className="text-xs text-gray-500">対象: 15名</div>
             </div>
            </div>
            <div className="flex justify-between items-center">
             <div>
              <div className="font-medium text-gray-800">認知症ケア研修</div>
              <div className="text-sm text-gray-600">1月28日 10:00-16:00</div>
             </div>
             <div className="text-right">
              <div className="text-sm font-semibold text-blue-600">推奨</div>
              <div className="text-xs text-gray-500">対象: 8名</div>
             </div>
            </div>
            <div className="flex justify-between items-center">
             <div>
              <div className="font-medium text-gray-800">リーダーシップ研修</div>
              <div className="text-sm text-gray-600">2月3日 9:00-17:00</div>
             </div>
             <div className="text-right">
              <div className="text-sm font-semibold text-green-600">選抜</div>
              <div className="text-xs text-gray-500">対象: 5名</div>
             </div>
            </div>
           </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-5">
           <h4 className="font-semibold text-blue-800 mb-3">JNAラダー進捗（看護師）</h4>
           <div className="space-y-2">
            <div className="flex items-center justify-between">
             <span className="text-sm">レベルⅠ→Ⅱ</span>
             <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
               <div className="h-full bg-blue-500 rounded-full" style={{width: '75%'}}></div>
              </div>
              <span className="text-xs font-semibold">18名</span>
             </div>
            </div>
            <div className="flex items-center justify-between">
             <span className="text-sm">レベルⅡ→Ⅲ</span>
             <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-white rounded-full">
               <div className="h-full bg-white rounded-full" style={{width: '60%'}}></div>
              </div>
              <span className="text-xs font-semibold">24名</span>
             </div>
            </div>
            <div className="flex items-center justify-between">
             <span className="text-sm">レベルⅢ→Ⅳ</span>
             <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-white rounded-full">
               <div className="h-full bg-white rounded-full" style={{width: '45%'}}></div>
              </div>
              <span className="text-xs font-semibold">15名</span>
             </div>
            </div>
            <div className="flex items-center justify-between">
             <span className="text-sm">レベルⅣ→Ⅴ</span>
             <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-white rounded-full">
               <div className="h-full bg-white rounded-full" style={{width: '30%'}}></div>
              </div>
              <span className="text-xs font-semibold">8名</span>
             </div>
            </div>
           </div>
          </div>
         </div>
         
         <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-800 mb-4">個別研修推奨</h4>
          <div className="space-y-3">
           <div className="p-3 bg-white rounded-lg border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
             <div>
              <span className="font-semibold text-gray-800">小林さくら</span>
              <span className="text-sm text-gray-600 ml-2">外科病棟・新人看護師</span>
             </div>
             <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold border border-yellow-300">推奨</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">BLS再受講推奨。前回評価「再受講中」。急変対応スキル向上が必要。</p>
           </div>
           <div className="p-3 bg-white rounded-lg border-l-4 border-green-500">
            <div className="flex justify-between items-center">
             <div>
              <span className="font-semibold text-gray-800">田中美咲</span>
              <span className="text-sm text-gray-600 ml-2">地域包括ケア病棟・看護師</span>
             </div>
             <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold border border-green-300">昇進準備</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">管理職準備研修開始推奨。2025年7月主任昇進に向けて6ヶ月プログラム。</p>
           </div>
          </div>
         </div>
        </div>
       )}
      </div>
      
      {/* 今月の活動統計とクイックアクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
       {/* 今月の統計 */}
       <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📊 今月の活動統計
       </h3>
       <div className="space-y-3">
        {[
         { label: '面談実施', value: '23件' },
         { label: '評価完了', value: '32名' },
         { label: '研修実施', value: '5回' },
         { label: '新規採用', value: '2名' }
        ].map((stat, index) => (
         <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-600">{stat.label}</span>
          <span className="text-lg font-semibold text-gray-800">{stat.value}</span>
         </div>
        ))}
       </div>
        </div>

        {/* クイックアクション */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        ⚡ クイックアクション
       </h3>
       <div className="space-y-3">
        {[
         { label: '🔍 職員検索', color: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300', href: null },
         { label: '📅 面談予約', color: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300', href: null },
         { label: '📊 レポート作成', color: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300', href: '/reports' },
         { label: '⚙️ システム設定', color: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300', href: null }
        ].map((action, index) => (
         action.href ? (
          <Link
           key={index}
           href={action.href}
           className={`block w-full ${action.color} py-3 rounded-lg text-sm font-semibold transition-colors text-center`}
          >
           {action.label}
          </Link>
         ) : (
          <button
           key={index}
           className={`w-full ${action.color} py-3 rounded-lg text-sm font-semibold transition-colors`}
          >
           {action.label}
          </button>
         )
        ))}
         </div>
        </div>
      </div>
     </div>
    </div>
   </div>

   {/* モーダル */}
   {showModal && selectedStaff && (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
     <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto mx-4">
      <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
       <h2 className="text-xl font-semibold text-gray-800">
        {selectedStaff.name} - 職員詳細情報
       </h2>
       <button
        onClick={() => setShowModal(false)}
        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full text-2xl transition-colors"
       >
        ×
       </button>
      </div>
      
      <div className="p-6">
       {selectedStaff.name === '田中美咲' && (
        <div className="space-y-6">
         {/* プロフィールヘッダー */}
         <div className="flex gap-5 p-5 bg-gray-50 rounded-xl">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
           田
          </div>
          <div className="flex-1">
           <h3 className="text-xl font-semibold text-gray-800 mb-2">田中美咲</h3>
           <p className="text-gray-600 mb-3">地域包括ケア病棟・看護師（主任候補）</p>
           <div className="flex gap-4 text-sm text-gray-600">
            <span><strong>ID:</strong> NS-2021-047</span>
            <span><strong>入職:</strong> 2021年4月（4年3ヶ月）</span>
            <span><strong>年齢:</strong> 36歳</span>
           </div>
          </div>
          <div className="text-right">
           <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
            昇進候補
           </div>
           <div className="text-lg font-semibold text-green-600">準備度 85%</div>
          </div>
         </div>

         {/* 総合分析 */}
         <div className="bg-gray-50 border-2 border-blue-200 rounded-xl p-5">
          <h4 className="text-blue-800 font-semibold mb-4 flex items-center gap-2">
           📈 総合分析
           <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">最新</span>
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
           <div>
            <div className="text-2xl font-bold text-green-600">A評価</div>
            <div className="text-sm text-green-700">最新総合評価</div>
            <div className="text-xs text-green-600">2024年上期</div>
           </div>
           <div>
            <div className="text-2xl font-bold text-blue-600">87</div>
            <div className="text-sm text-blue-700">健康スコア</div>
            <div className="text-xs text-blue-600">ストレス指数: 48</div>
           </div>
           <div>
            <div className="text-2xl font-bold text-purple-600">340%</div>
            <div className="text-sm text-purple-700">期待ROI</div>
            <div className="text-xs text-purple-600">5年間予測</div>
           </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
           <strong className="text-gray-800">🎯 最終推奨:</strong>
           <span className="text-gray-600 ml-2">
            2025年7月昇進が最適。準備期間6ヶ月で成功確率87%、ROI 340%の高い投資効果が期待できます。
           </span>
          </div>
         </div>

         {/* スキル・実績 */}
         <div className="grid grid-cols-2 gap-5">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
           <h5 className="font-semibold text-gray-800 mb-3">🎯 主要スキル</h5>
           <div className="space-y-3">
            {[
             { skill: '認知症ケア専門', level: 100, color: 'bg-white' },
             { skill: 'チームワーク', level: 96, color: 'bg-white' },
             { skill: 'リーダーシップ', level: 70, color: 'bg-white' }
            ].map((item, index) => (
             <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{item.skill}</span>
              <div className="flex items-center gap-2">
               <div className="w-20 h-2 bg-white rounded-full">
                <div className={`h-full ${item.color} rounded-full`} style={{width: `${item.level}%`}}></div>
               </div>
               <span className="text-xs font-semibold">{item.level}%</span>
              </div>
             </div>
            ))}
           </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
           <h5 className="font-semibold text-gray-800 mb-3">📊 実績指標</h5>
           <div className="space-y-2 text-sm">
            <div className="flex justify-between">
             <span className="text-gray-600">エンゲージメント</span>
             <span className="font-semibold text-green-600">95%</span>
            </div>
            <div className="flex justify-between">
             <span className="text-gray-600">目標達成率</span>
             <span className="font-semibold text-blue-600">92%</span>
            </div>
            <div className="flex justify-between">
             <span className="text-gray-600">研修参加率</span>
             <span className="font-semibold text-purple-600">100%</span>
            </div>
           </div>
          </div>
         </div>

         {/* アクションプラン */}
         <div className="bg-gray-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-800 mb-3">📋 今後のアクションプラン</h5>
          <div className="space-y-3">
           <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div className="text-sm text-yellow-800">
             <strong>本日 10:30</strong> - 昇進検討面談実施（準備資料あり）
            </div>
           </div>
           <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div className="text-sm text-yellow-800">
             <strong>2025年2月</strong> - 管理職準備研修開始（6ヶ月プログラム）
            </div>
           </div>
           <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div className="text-sm text-yellow-800">
             <strong>2025年7月</strong> - 主任昇進実施（成功確率87%）
            </div>
           </div>
          </div>
         </div>

         {/* アクションボタン */}
         <div className="flex justify-center gap-3">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
           昇進プロセス開始
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
           詳細カルテ表示
          </button>
          <button 
           onClick={() => setShowModal(false)}
           className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-300"
          >
           閉じる
          </button>
         </div>
        </div>
       )}

       {selectedStaff.name === '中村恵子' && (
        <div className="space-y-6">
         {/* プロフィールヘッダー */}
         <div className="flex gap-5 p-5 bg-gray-50 rounded-xl">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
           中
          </div>
          <div className="flex-1">
           <h3 className="text-xl font-semibold text-gray-800 mb-2">中村恵子</h3>
           <p className="text-gray-600 mb-3">外来・看護師</p>
           <div className="flex gap-4 text-sm text-gray-600">
            <span><strong>ID:</strong> NS-3401</span>
            <span><strong>勤続:</strong> 5年3ヶ月</span>
            <span><strong>年齢:</strong> 28歳</span>
           </div>
          </div>
          <div className="text-right">
           <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
            緊急対応要
           </div>
           <div className="text-lg font-semibold text-red-600">離職リスク 84%</div>
          </div>
         </div>

         {/* 緊急アラート */}
         <div className="bg-white border-2 border-red-200 rounded-xl p-5">
          <h4 className="text-red-800 font-semibold mb-4 flex items-center gap-2">
           🚨 緊急対応が必要
           <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">HIGH</span>
          </h4>
          <div className="space-y-3">
           <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-red-500">
            <strong className="text-red-700">3日連続欠勤</strong>
            <p className="text-sm text-red-600 mt-1">過去1年で初回。家庭環境の変化が疑われます。</p>
           </div>
           <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-yellow-500">
            <strong className="text-yellow-700">評価スコア低下</strong>
            <p className="text-sm text-yellow-600 mt-1">直近3ヶ月で15%低下（83% → 68%）</p>
           </div>
           <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-yellow-500">
            <strong className="text-yellow-700">ストレス指標上昇</strong>
            <p className="text-sm text-yellow-600 mt-1">先月比25%上昇、要注意レベル</p>
           </div>
          </div>
         </div>

         {/* 状況分析 */}
         <div className="grid grid-cols-2 gap-5">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
           <h5 className="font-semibold text-gray-800 mb-3">📊 現在の状況</h5>
           <div className="space-y-2 text-sm">
            <div className="flex justify-between">
             <span className="text-gray-600">総合評価</span>
             <span className="font-semibold text-red-600">C (68%)</span>
            </div>
            <div className="flex justify-between">
             <span className="text-gray-600">勤怠状況</span>
             <span className="font-semibold text-red-600">要注意</span>
            </div>
            <div className="flex justify-between">
             <span className="text-gray-600">ストレス</span>
             <span className="font-semibold text-yellow-600">高</span>
            </div>
           </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
           <h5 className="font-semibold text-gray-800 mb-3">💡 推定要因</h5>
           <div className="text-sm text-gray-600 space-y-1">
            <div>• 家庭環境の急変（育児・介護）</div>
            <div>• 職場での人間関係の悪化</div>
            <div>• 業務負荷の増大</div>
            <div>• 健康問題の可能性</div>
           </div>
          </div>
         </div>

         {/* 緊急対応プラン */}
         <div className="bg-gray-50 border-2 border-blue-200 rounded-xl p-5">
          <h4 className="text-blue-800 font-semibold mb-4">🎯 推奨緊急対応プラン</h4>
          <div className="space-y-3">
           <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
             <strong className="text-gray-800">本日 9:00 - 緊急面談実施</strong>
             <p className="text-sm text-gray-600 mt-1">欠勤理由の詳細ヒアリング、支援ニーズの把握</p>
            </div>
           </div>
           <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
             <strong className="text-gray-800">支援制度の即時適用</strong>
             <p className="text-sm text-gray-600 mt-1">勤務時間調整、在宅勤務、育児・介護支援制度</p>
            </div>
           </div>
           <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
             <strong className="text-gray-800">メンタルヘルスケア</strong>
             <p className="text-sm text-gray-600 mt-1">産業医面談、カウンセリング、ストレス軽減プログラム</p>
            </div>
           </div>
          </div>
         </div>

         {/* アクションボタン */}
         <div className="flex justify-center gap-3">
          <button className="bg-white hover:bg-gray-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
           緊急面談開始
          </button>
          <button className="bg-white hover:bg-gray-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
           支援制度確認
          </button>
          <button 
           onClick={() => setShowModal(false)}
           className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-300"
          >
           閉じる
          </button>
         </div>
        </div>
       )}

       {selectedStaff.name === '小林さくら' && (
        <div className="space-y-6">
         {/* プロフィールヘッダー */}
         <div className="flex gap-5 p-5 bg-gray-50 rounded-xl">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
           小
          </div>
          <div className="flex-1">
           <h3 className="text-xl font-semibold text-gray-800 mb-2">小林さくら</h3>
           <p className="text-gray-600 mb-3">外科病棟・看護師（新人）</p>
           <div className="flex gap-4 text-sm text-gray-600">
            <span><strong>ID:</strong> NS-2024-012</span>
            <span><strong>入職:</strong> 2024年4月（9ヶ月）</span>
            <span><strong>年齢:</strong> 23歳</span>
           </div>
          </div>
          <div className="text-right">
           <div className="bg-white text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
            新人フォロー要
           </div>
           <div className="text-lg font-semibold text-yellow-600">ストレス指数 68</div>
          </div>
         </div>

         {/* 新人サポート状況 */}
         <div className="bg-white border-2 border-yellow-200 rounded-xl p-5">
          <h4 className="text-yellow-800 font-semibold mb-4 flex items-center gap-2">
           📋 新人教育進捗状況
           <span className="text-xs bg-white text-white px-2 py-1 rounded-full">JNAラダーⅠ</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
           <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-2">基礎技術習得</h5>
            <div className="space-y-2">
             <div className="flex justify-between text-sm">
              <span>基礎看護技術</span>
              <span className="font-semibold text-yellow-600">40%</span>
             </div>
             <div className="flex justify-between text-sm">
              <span>与薬管理</span>
              <span className="font-semibold text-yellow-600">35%</span>
             </div>
             <div className="flex justify-between text-sm">
              <span>急変対応</span>
              <span className="font-semibold text-red-600">20%</span>
             </div>
            </div>
           </div>
           <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-2">研修状況</h5>
            <div className="text-sm text-gray-600 space-y-1">
             <div>✅ 新人看護師研修 完了</div>
             <div>✅ 医療安全基礎研修 完了</div>
             <div>⚠️ BLS研修 再受講中</div>
             <div>⏳ 褥創予防研修 未修了</div>
            </div>
           </div>
          </div>
         </div>

         {/* サポートプラン */}
         <div className="bg-gray-50 border-2 border-blue-200 rounded-xl p-5">
          <h4 className="text-blue-800 font-semibold mb-4">🎯 推奨サポートプラン</h4>
          <div className="space-y-3">
           <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
             <strong className="text-gray-800">急変対応スキル強化</strong>
             <p className="text-sm text-gray-600 mt-1">BLS再受講と実践的シミュレーション訓練の実施</p>
            </div>
           </div>
           <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
             <strong className="text-gray-800">メンタルサポート強化</strong>
             <p className="text-sm text-gray-600 mt-1">先輩看護師とのペアリング、定期的な1on1面談</p>
            </div>
           </div>
           <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
             <strong className="text-gray-800">業務負荷調整</strong>
             <p className="text-sm text-gray-600 mt-1">残業時間削減、夜勤回数の段階的増加</p>
            </div>
           </div>
          </div>
         </div>

         {/* アクションボタン */}
         <div className="flex justify-center gap-3">
          <button className="bg-white hover:bg-gray-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
           フォローアップ面談
          </button>
          <button className="bg-white hover:bg-gray-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
           教育計画確認
          </button>
          <button 
           onClick={() => setShowModal(false)}
           className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-300"
          >
           閉じる
          </button>
         </div>
        </div>
       )}

       {selectedStaff.name === '伊藤由美' && (
        <div className="space-y-6">
         {/* プロフィールヘッダー */}
         <div className="flex gap-5 p-5 bg-gray-50 rounded-xl">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
           伊
          </div>
          <div className="flex-1">
           <h3 className="text-xl font-semibold text-gray-800 mb-2">伊藤由美</h3>
           <p className="text-gray-600 mb-3">緩和ケア病棟・認定看護師</p>
           <div className="flex gap-4 text-sm text-gray-600">
            <span><strong>ID:</strong> NS-2015-008</span>
            <span><strong>勤続:</strong> 9年9ヶ月</span>
            <span><strong>年齢:</strong> 38歳</span>
           </div>
          </div>
          <div className="text-right">
           <div className="bg-white text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
            エキスパート
           </div>
           <div className="text-lg font-semibold text-purple-600">JNAラダーⅤ</div>
          </div>
         </div>

         {/* 専門性・実績 */}
         <div className="bg-white border-2 border-purple-200 rounded-xl p-5">
          <h4 className="text-purple-800 font-semibold mb-4 flex items-center gap-2">
           🏆 専門性と実績
           <span className="text-xs bg-white text-white px-2 py-1 rounded-full">認定看護師</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
           <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-2">専門スキル</h5>
            <div className="space-y-2">
             <div className="flex justify-between text-sm">
              <span>緩和ケア</span>
              <span className="font-semibold text-purple-600">マスター</span>
             </div>
             <div className="flex justify-between text-sm">
              <span>疼痛管理</span>
              <span className="font-semibold text-purple-600">マスター</span>
             </div>
             <div className="flex justify-between text-sm">
              <span>後輩指導</span>
              <span className="font-semibold text-purple-600">マスター</span>
             </div>
            </div>
           </div>
           <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-2">最近の活動</h5>
            <div className="text-sm text-gray-600 space-y-1">
             <div>🏅 看護研究発表会 最優秀賞</div>
             <div>📚 緩和ケア認定更新完了</div>
             <div>👥 新人教育プリセプター3名</div>
             <div>🎯 院内研修講師 年6回</div>
            </div>
           </div>
          </div>
         </div>

         {/* キャリア展望 */}
         <div className="bg-white border-2 border-green-200 rounded-xl p-5">
          <h4 className="text-green-800 font-semibold mb-4">🚀 キャリア展望</h4>
          <div className="space-y-3">
           <div className="bg-gray-50 p-3 rounded-lg">
            <strong className="text-gray-800">看護部教育担当への登用検討</strong>
            <p className="text-sm text-gray-600 mt-1">豊富な指導経験と高い専門性を活かし、組織全体の教育水準向上に貢献</p>
           </div>
           <div className="bg-gray-50 p-3 rounded-lg">
            <strong className="text-gray-800">専門看護師資格取得支援</strong>
            <p className="text-sm text-gray-600 mt-1">更なる専門性向上のため、大学院進学支援制度の活用を推奨</p>
           </div>
          </div>
         </div>

         {/* アクションボタン */}
         <div className="flex justify-center gap-3">
          <button className="bg-white hover:bg-gray-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
           キャリア開発計画
          </button>
          <button className="bg-white hover:bg-gray-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
           研究活動支援
          </button>
          <button 
           onClick={() => setShowModal(false)}
           className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-300"
          >
           閉じる
          </button>
         </div>
        </div>
       )}

       {/* その他のスタッフのデフォルト表示 */}
       {!['田中美咲', '中村恵子', '小林さくら', '伊藤由美'].includes(selectedStaff.name) && (
        <div className="text-center py-8">
         <p className="text-gray-600">詳細情報は個別ページでご確認ください。</p>
         <Link 
          href={`/staff/${selectedStaff.id}`}
          className="inline-block mt-4 bg-white hover:bg-gray-50 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
         >
          詳細ページへ
         </Link>
         <button 
          onClick={() => setShowModal(false)}
          className="ml-3 mt-4 bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
         >
          閉じる
         </button>
        </div>
       )}
      </div>
     </div>
    </div>
   )}
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}