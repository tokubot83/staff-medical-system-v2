'use client';

import { useState, useEffect } from 'react';
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
      avatar: 'bg-gradient-to-r from-red-500 to-red-600',
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
      avatar: 'bg-gradient-to-r from-green-500 to-emerald-600'
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
      avatar: 'bg-gradient-to-r from-pink-500 to-rose-600'
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
      avatar: 'bg-gradient-to-r from-indigo-500 to-purple-600'
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
      avatar: 'bg-gradient-to-r from-teal-500 to-cyan-600'
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
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'info': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
}
