'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import SheetPreviewModal from '@/components/SheetPreviewModal';
import InterviewSheetModal from '@/components/InterviewSheetModal';
import TrainingContent from './TrainingContent';
import CareerCourseContent from './CareerCourseContent';
import JinzaiPreparationLayout from './JinzaiPreparationLayout';
import ActionPlanLayout from './ActionPlanLayout';
import DesignPhaseLayout from './DesignPhaseLayout';
import TrialPhaseLayout from './TrialPhaseLayout';
import SystemManualContent from './SystemManualContent';
import {
  Users, Briefcase, GraduationCap, LineChart,
  CheckCircle, Calendar, Target, Star,
  TrendingUp
} from 'lucide-react';

interface SheetItem {
  id: string;
  name: string;
  category: string;
  type: 'interview' | 'evaluation';
  version: string;
  facility?: string;
  position?: string;
  experience?: string;
  duration?: string;
  path: string;
  description: string;
}

export default function HRSystemGuidePage() {
  const [activeTab, setActiveTab] = useState<'evaluation' | 'interview' | 'training' | 'career-course' | 'sheets' | 'preparation' | 'manual'>('evaluation');
  const [preparationSubTab, setPreparationSubTab] = useState<'organization' | 'info-collection' | 'system-design' | 'trial-adjustment'>('organization');
  const [viewMode, setViewMode] = useState<'general' | 'formal'>('general');
  const [sheetType, setSheetType] = useState<'all' | 'interview'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [previewSheet, setPreviewSheet] = useState<SheetItem | null>(null);

  // シートデータ（実際のファイル構造に基づく）
  const sheetData: SheetItem[] = [
    // v4面談シート（看護師）
    { id: 'iv-1', name: '新人看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '新人', duration: '45分', path: 'v4_interview/new-nurse-unified-45min.tsx', description: '新人看護師向けの詳細な面談シート' },
    { id: 'iv-2', name: '一般看護師15分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '一般', duration: '15分', path: 'v4_interview/general-nurse-unified-15min.tsx', description: '日常的なショート面談用' },
    { id: 'iv-3', name: '一般看護師30分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '一般', duration: '30分', path: 'v4_interview/general-nurse-unified-30min.tsx', description: '定期面談用の標準シート' },
    { id: 'iv-4', name: '一般看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '一般', duration: '45分', path: 'v4_interview/general-nurse-unified-45min.tsx', description: '詳細な評価面談用' },
    { id: 'iv-5', name: 'リーダー看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: 'リーダー', duration: '45分', path: 'v4_interview/leader-nurse-unified-45min.tsx', description: 'リーダー層向け面談シート' },
    { id: 'iv-6', name: '主任看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: '主任', duration: '45分', path: 'v4_interview/chief-nurse-unified-45min.tsx', description: '管理職向け面談シート' },
    { id: 'iv-8', name: 'ベテラン看護師45分統合面談', category: '面談シート', type: 'interview', version: 'v4', position: '看護師', experience: 'ベテラン', duration: '45分', path: 'v4_interview/veteran-nurse-unified-45min.tsx', description: 'ベテラン層向け面談シート' },

    // v5面談シート（看護師）- 動機タイプ判定付き
    { id: 'v5-n-1', name: '新人看護師15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '新人', duration: '15分', path: 'interview-sheets/v5/new-nurse-15min', description: '動機タイプ判定機能付き新人看護師面談シート' },
    { id: 'v5-n-2', name: '新人看護師30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '新人', duration: '30分', path: 'interview-sheets/v5/new-nurse-30min', description: '動機タイプ判定機能付き新人看護師面談シート' },
    { id: 'v5-n-3', name: '新人看護師45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '新人', duration: '45分', path: 'interview-sheets/v5/new-nurse-45min', description: '動機タイプ判定機能付き新人看護師面談シート' },
    { id: 'v5-g-1', name: '一般看護師15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '一般', duration: '15分', path: 'interview-sheets/v5/general-nurse-15min', description: '動機タイプ判定機能付き一般看護師面談シート' },
    { id: 'v5-g-2', name: '一般看護師30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '一般', duration: '30分', path: 'interview-sheets/v5/general-nurse-30min', description: '動機タイプ判定機能付き一般看護師面談シート' },
    { id: 'v5-g-3', name: '一般看護師45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '一般', duration: '45分', path: 'interview-sheets/v5/general-nurse-45min', description: '動機タイプ判定機能付き一般看護師面談シート' },
    { id: 'v5-m-1', name: '中堅看護師15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '中堅', duration: '15分', path: 'interview-sheets/v5/midlevel-nurse-15min', description: '動機タイプ判定機能付き中堅看護師面談シート' },
    { id: 'v5-m-2', name: '中堅看護師30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '中堅', duration: '30分', path: 'interview-sheets/v5/midlevel-nurse-30min', description: '動機タイプ判定機能付き中堅看護師面談シート' },
    { id: 'v5-m-3', name: '中堅看護師45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '中堅', duration: '45分', path: 'interview-sheets/v5/midlevel-nurse-45min', description: '動機タイプ判定機能付き中堅看護師面談シート' },
    { id: 'v5-v-1', name: 'ベテラン看護師15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: 'ベテラン', duration: '15分', path: 'interview-sheets/v5/veteran-nurse-15min', description: '動機タイプ判定機能付きベテラン看護師面談シート' },
    { id: 'v5-v-2', name: 'ベテラン看護師30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: 'ベテラン', duration: '30分', path: 'interview-sheets/v5/veteran-nurse-30min', description: '動機タイプ判定機能付きベテラン看護師面談シート' },
    { id: 'v5-v-3', name: 'ベテラン看護師45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: 'ベテラン', duration: '45分', path: 'interview-sheets/v5/veteran-nurse-45min', description: '動機タイプ判定機能付きベテラン看護師面談シート' },
    { id: 'v5-c-1', name: '主任看護師15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '主任', duration: '15分', path: 'interview-sheets/v5/chief-nurse-15min', description: '動機タイプ判定機能付き主任看護師面談シート' },
    { id: 'v5-c-2', name: '主任看護師30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '主任', duration: '30分', path: 'interview-sheets/v5/chief-nurse-30min', description: '動機タイプ判定機能付き主任看護師面談シート' },
    { id: 'v5-c-3', name: '主任看護師45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '看護師', experience: '主任', duration: '45分', path: 'interview-sheets/v5/chief-nurse-45min', description: '動機タイプ判定機能付き主任看護師面談シート' },

    // v5面談シート（理学療法士）
    { id: 'v5-pt-n1', name: '新人PT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '新人', duration: '15分', path: 'interview-sheets/v5/rehabilitation/pt/new-pt-15min', description: '動機タイプ判定機能付き新人理学療法士面談シート' },
    { id: 'v5-pt-n2', name: '新人PT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '新人', duration: '30分', path: 'interview-sheets/v5/rehabilitation/pt/new-pt-30min', description: '動機タイプ判定機能付き新人理学療法士面談シート' },
    { id: 'v5-pt-n3', name: '新人PT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '新人', duration: '45分', path: 'interview-sheets/v5/rehabilitation/pt/new-pt-45min', description: '動機タイプ判定機能付き新人理学療法士面談シート' },
    { id: 'v5-pt-g1', name: '一般PT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '一般', duration: '15分', path: 'interview-sheets/v5/rehabilitation/pt/general-pt-15min', description: '動機タイプ判定機能付き一般理学療法士面談シート' },
    { id: 'v5-pt-g2', name: '一般PT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '一般', duration: '30分', path: 'interview-sheets/v5/rehabilitation/pt/general-pt-30min', description: '動機タイプ判定機能付き一般理学療法士面談シート' },
    { id: 'v5-pt-g3', name: '一般PT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '一般', duration: '45分', path: 'interview-sheets/v5/rehabilitation/pt/general-pt-45min', description: '動機タイプ判定機能付き一般理学療法士面談シート' },
    { id: 'v5-pt-m1', name: '中堅PT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '中堅', duration: '15分', path: 'interview-sheets/v5/rehabilitation/pt/midlevel-pt-15min', description: '動機タイプ判定機能付き中堅理学療法士面談シート' },
    { id: 'v5-pt-m2', name: '中堅PT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '中堅', duration: '30分', path: 'interview-sheets/v5/rehabilitation/pt/midlevel-pt-30min', description: '動機タイプ判定機能付き中堅理学療法士面談シート' },
    { id: 'v5-pt-m3', name: '中堅PT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '中堅', duration: '45分', path: 'interview-sheets/v5/rehabilitation/pt/midlevel-pt-45min', description: '動機タイプ判定機能付き中堅理学療法士面談シート' },
    { id: 'v5-pt-v1', name: 'ベテランPT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: 'ベテラン', duration: '15分', path: 'interview-sheets/v5/rehabilitation/pt/veteran-pt-15min', description: '動機タイプ判定機能付きベテラン理学療法士面談シート' },
    { id: 'v5-pt-v2', name: 'ベテランPT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: 'ベテラン', duration: '30分', path: 'interview-sheets/v5/rehabilitation/pt/veteran-pt-30min', description: '動機タイプ判定機能付きベテラン理学療法士面談シート' },
    { id: 'v5-pt-v3', name: 'ベテランPT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: 'ベテラン', duration: '45分', path: 'interview-sheets/v5/rehabilitation/pt/veteran-pt-45min', description: '動機タイプ判定機能付きベテラン理学療法士面談シート' },
    { id: 'v5-pt-c1', name: '主任PT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '主任', duration: '15分', path: 'interview-sheets/v5/rehabilitation/pt/chief-pt-15min', description: '動機タイプ判定機能付き主任理学療法士面談シート' },
    { id: 'v5-pt-c2', name: '主任PT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '主任', duration: '30分', path: 'interview-sheets/v5/rehabilitation/pt/chief-pt-30min', description: '動機タイプ判定機能付き主任理学療法士面談シート' },
    { id: 'v5-pt-c3', name: '主任PT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '理学療法士', experience: '主任', duration: '45分', path: 'interview-sheets/v5/rehabilitation/pt/chief-pt-45min', description: '動機タイプ判定機能付き主任理学療法士面談シート' },

    // v5面談シート（作業療法士）
    { id: 'v5-ot-n1', name: '新人OT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '新人', duration: '15分', path: 'interview-sheets/v5/rehabilitation/ot/new-ot-15min', description: '動機タイプ判定機能付き新人作業療法士面談シート' },
    { id: 'v5-ot-n2', name: '新人OT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '新人', duration: '30分', path: 'interview-sheets/v5/rehabilitation/ot/new-ot-30min', description: '動機タイプ判定機能付き新人作業療法士面談シート' },
    { id: 'v5-ot-n3', name: '新人OT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '新人', duration: '45分', path: 'interview-sheets/v5/rehabilitation/ot/new-ot-45min', description: '動機タイプ判定機能付き新人作業療法士面談シート' },
    { id: 'v5-ot-g1', name: '一般OT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '一般', duration: '15分', path: 'interview-sheets/v5/rehabilitation/ot/general-ot-15min', description: '動機タイプ判定機能付き一般作業療法士面談シート' },
    { id: 'v5-ot-g2', name: '一般OT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '一般', duration: '30分', path: 'interview-sheets/v5/rehabilitation/ot/general-ot-30min', description: '動機タイプ判定機能付き一般作業療法士面談シート' },
    { id: 'v5-ot-g3', name: '一般OT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '一般', duration: '45分', path: 'interview-sheets/v5/rehabilitation/ot/general-ot-45min', description: '動機タイプ判定機能付き一般作業療法士面談シート' },
    { id: 'v5-ot-m1', name: '中堅OT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '中堅', duration: '15分', path: 'interview-sheets/v5/rehabilitation/ot/midlevel-ot-15min', description: '動機タイプ判定機能付き中堅作業療法士面談シート' },
    { id: 'v5-ot-m2', name: '中堅OT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '中堅', duration: '30分', path: 'interview-sheets/v5/rehabilitation/ot/midlevel-ot-30min', description: '動機タイプ判定機能付き中堅作業療法士面談シート' },
    { id: 'v5-ot-m3', name: '中堅OT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '中堅', duration: '45分', path: 'interview-sheets/v5/rehabilitation/ot/midlevel-ot-45min', description: '動機タイプ判定機能付き中堅作業療法士面談シート' },
    { id: 'v5-ot-v1', name: 'ベテランOT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: 'ベテラン', duration: '15分', path: 'interview-sheets/v5/rehabilitation/ot/veteran-ot-15min', description: '動機タイプ判定機能付きベテラン作業療法士面談シート' },
    { id: 'v5-ot-v2', name: 'ベテランOT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: 'ベテラン', duration: '30分', path: 'interview-sheets/v5/rehabilitation/ot/veteran-ot-30min', description: '動機タイプ判定機能付きベテラン作業療法士面談シート' },
    { id: 'v5-ot-v3', name: 'ベテランOT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: 'ベテラン', duration: '45分', path: 'interview-sheets/v5/rehabilitation/ot/veteran-ot-45min', description: '動機タイプ判定機能付きベテラン作業療法士面談シート' },
    { id: 'v5-ot-c1', name: '主任OT15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '主任', duration: '15分', path: 'interview-sheets/v5/rehabilitation/ot/chief-ot-15min', description: '動機タイプ判定機能付き主任作業療法士面談シート' },
    { id: 'v5-ot-c2', name: '主任OT30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '主任', duration: '30分', path: 'interview-sheets/v5/rehabilitation/ot/chief-ot-30min', description: '動機タイプ判定機能付き主任作業療法士面談シート' },
    { id: 'v5-ot-c3', name: '主任OT45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '作業療法士', experience: '主任', duration: '45分', path: 'interview-sheets/v5/rehabilitation/ot/chief-ot-45min', description: '動機タイプ判定機能付き主任作業療法士面談シート' },

    // v5面談シート（言語聴覚士）
    { id: 'v5-st-n1', name: '新人ST15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '新人', duration: '15分', path: 'interview-sheets/v5/rehabilitation/st/new-st-15min', description: '動機タイプ判定機能付き新人言語聴覚士面談シート' },
    { id: 'v5-st-n2', name: '新人ST30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '新人', duration: '30分', path: 'interview-sheets/v5/rehabilitation/st/new-st-30min', description: '動機タイプ判定機能付き新人言語聴覚士面談シート' },
    { id: 'v5-st-n3', name: '新人ST45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '新人', duration: '45分', path: 'interview-sheets/v5/rehabilitation/st/new-st-45min', description: '動機タイプ判定機能付き新人言語聴覚士面談シート' },
    { id: 'v5-st-g1', name: '一般ST15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '一般', duration: '15分', path: 'interview-sheets/v5/rehabilitation/st/general-st-15min', description: '動機タイプ判定機能付き一般言語聴覚士面談シート' },
    { id: 'v5-st-g2', name: '一般ST30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '一般', duration: '30分', path: 'interview-sheets/v5/rehabilitation/st/general-st-30min', description: '動機タイプ判定機能付き一般言語聴覚士面談シート' },
    { id: 'v5-st-g3', name: '一般ST45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '一般', duration: '45分', path: 'interview-sheets/v5/rehabilitation/st/general-st-45min', description: '動機タイプ判定機能付き一般言語聴覚士面談シート' },
    { id: 'v5-st-m1', name: '中堅ST15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '中堅', duration: '15分', path: 'interview-sheets/v5/rehabilitation/st/midlevel-st-15min', description: '動機タイプ判定機能付き中堅言語聴覚士面談シート' },
    { id: 'v5-st-m2', name: '中堅ST30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '中堅', duration: '30分', path: 'interview-sheets/v5/rehabilitation/st/midlevel-st-30min', description: '動機タイプ判定機能付き中堅言語聴覚士面談シート' },
    { id: 'v5-st-m3', name: '中堅ST45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '中堅', duration: '45分', path: 'interview-sheets/v5/rehabilitation/st/midlevel-st-45min', description: '動機タイプ判定機能付き中堅言語聴覚士面談シート' },
    { id: 'v5-st-v1', name: 'ベテランST15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: 'ベテラン', duration: '15分', path: 'interview-sheets/v5/rehabilitation/st/veteran-st-15min', description: '動機タイプ判定機能付きベテラン言語聴覚士面談シート' },
    { id: 'v5-st-v2', name: 'ベテランST30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: 'ベテラン', duration: '30分', path: 'interview-sheets/v5/rehabilitation/st/veteran-st-30min', description: '動機タイプ判定機能付きベテラン言語聴覚士面談シート' },
    { id: 'v5-st-v3', name: 'ベテランST45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: 'ベテラン', duration: '45分', path: 'interview-sheets/v5/rehabilitation/st/veteran-st-45min', description: '動機タイプ判定機能付きベテラン言語聴覚士面談シート' },
    { id: 'v5-st-c1', name: '主任ST15分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '主任', duration: '15分', path: 'interview-sheets/v5/rehabilitation/st/chief-st-15min', description: '動機タイプ判定機能付き主任言語聴覚士面談シート' },
    { id: 'v5-st-c2', name: '主任ST30分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '主任', duration: '30分', path: 'interview-sheets/v5/rehabilitation/st/chief-st-30min', description: '動機タイプ判定機能付き主任言語聴覚士面談シート' },
    { id: 'v5-st-c3', name: '主任ST45分面談 v5', category: '面談シート', type: 'interview', version: 'v5', position: '言語聴覚士', experience: '主任', duration: '45分', path: 'interview-sheets/v5/rehabilitation/st/chief-st-45min', description: '動機タイプ判定機能付き主任言語聴覚士面談シート' },

  ];

  // フィルター処理
  const filteredSheets = sheetData.filter(sheet => {
    // テキスト検索
    if (searchQuery && !sheet.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !sheet.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // シートタイプフィルター
    if (sheetType !== 'all' && sheet.type !== sheetType) {
      return false;
    }
    
    // 施設フィルター
    if (selectedFacility !== 'all' && sheet.facility !== selectedFacility) {
      return false;
    }
    
    // 職種フィルター
    if (selectedPosition !== 'all' && sheet.position !== selectedPosition) {
      return false;
    }
    
    // 経験年数フィルター
    if (selectedExperience !== 'all' && sheet.experience !== selectedExperience) {
      return false;
    }
    
    return true;
  });

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* ページヘッダー */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">人事制度ガイド</h1>
          <p className="text-gray-600">
            医療法人厚生会の革新的な人事評価制度・面談制度について、職員の皆様にわかりやすくご説明します。
          </p>
        </div>

        {/* タブ切り替え */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'evaluation'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              人事評価制度
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'interview'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              面談制度
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'training'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              教育・研修制度
            </button>
            <button
              onClick={() => setActiveTab('career-course')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'career-course'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              キャリア選択制度
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'sheets'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📄 シート閲覧
            </button>
            <button
              onClick={() => setActiveTab('preparation')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'preparation'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏗️ 準備室活動計画
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'manual'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📖 取扱説明書（人事部用）
            </button>
          </div>
        </div>

        {/* 人事評価制度の内容 */}
        {activeTab === 'evaluation' && (
          <>
            {/* 表示モード切り替え */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setViewMode('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'general'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📘 一般職員向け
              </button>
              <button
                onClick={() => setViewMode('formal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'formal'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📜 正式文書版
              </button>
            </div>

            {viewMode === 'general' && (
          <div className="space-y-6">
            {/* 概要 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">🎯</span>
                革新的な人事評価制度とは？
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  当法人では、<span className="font-bold text-blue-600">「施設内評価」と「法人内評価」の2つの軸</span>で
                  職員の皆様を評価する革新的な制度を導入しています。
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 font-semibold mb-2">なぜ2軸評価なの？</p>
                  <p className="text-gray-700">
                    小規模施設で頑張っている職員も、大規模施設で活躍している職員も、
                    それぞれの環境での貢献と法人全体での実力の両方を公平に評価できるからです。
                  </p>
                </div>
              </div>
            </div>

            {/* 2つの評価軸 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">2つの評価軸を理解しよう</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-5 border-2 border-green-200">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🏢</span>
                    施設内評価
                  </h4>
                  <p className="text-gray-700 mb-3">
                    あなたが働いている施設の中で、同じ職種の仲間と比べてどれくらい頑張っているかを評価します。
                  </p>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">この評価で分かること</p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>施設内でのあなたの位置づけが明確になり、日々の貢献が正当に評価されます</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>施設の規模に関係なく、その環境での頑張りが公平・客観的に可視化されます</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>チームへの貢献度や協調性が数値化され、1年間の成長が把握できます</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🏥</span>
                    法人内評価
                  </h4>
                  <p className="text-gray-700 mb-3">
                    法人全体（全施設）の同じ職種の職員と比べて、あなたの専門スキルや能力がどのレベルかを評価します。
                  </p>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">この評価で分かること</p>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>法人全体でのあなたの専門性レベルが明確になり、キャリアパスの参考になります</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>自分のスキルや知識が法人内でどの位置にあるか客観的に把握できます</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>異動や昇進の際の適材適所の配置に活用され、あなたの強みを活かせます</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 25レベル権限体系 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">🔐</span>
                25レベル権限体系（VoiceDrive統合）
              </h3>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  当法人では、経験年数・役職・業務内容に応じて<span className="font-bold text-purple-600">25段階のアカウント権限レベル</span>を設定しています。
                  VoiceDriveシステムと完全統合され、音声認識の精度向上と業務効率化を実現しています。
                </p>

                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <p className="text-purple-800 font-semibold mb-2">2025年10月4日 完全統合完了 ✅</p>
                  <p className="text-gray-700 text-sm">
                    医療システムとVoiceDriveの権限レベルが完全同期。職員登録時に自動的にVoiceDriveアカウントが作成され、
                    権限レベルに応じた音声認識機能が利用可能になります。
                  </p>
                </div>

                <div className="space-y-4">
                  {/* 基本レベル */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <span>📊 基本レベル（L1～L4）</span>
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">経験年数に基づく基本的な権限レベル</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-white p-2 rounded text-center">
                        <p className="font-bold text-blue-700">L1</p>
                        <p className="text-xs text-gray-600">0-3年</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="font-bold text-blue-700">L2</p>
                        <p className="text-xs text-gray-600">4-7年</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="font-bold text-blue-700">L3</p>
                        <p className="text-xs text-gray-600">8-12年</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="font-bold text-blue-700">L4</p>
                        <p className="text-xs text-gray-600">13年以上</p>
                      </div>
                    </div>
                  </div>

                  {/* リーダー業務加算 */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <span>⭐ リーダー業務加算（L1.5～L4.5）</span>
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">リーダー業務担当者は基本レベル+0.5</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-white p-2 rounded text-center">
                        <p className="font-bold text-green-700">L1.5</p>
                        <p className="text-xs text-gray-600">新人リーダー</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="font-bold text-green-700">L2.5</p>
                        <p className="text-xs text-gray-600">一般リーダー</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="font-bold text-green-700">L3.5</p>
                        <p className="text-xs text-gray-600">中堅リーダー</p>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <p className="font-bold text-green-700">L4.5</p>
                        <p className="text-xs text-gray-600">ベテランリーダー</p>
                      </div>
                    </div>
                  </div>

                  {/* 役職レベル */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                      <span>👔 役職レベル（L5～L18）</span>
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">管理職・役職者の権限レベル（施設別に設定）</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div className="bg-white p-2 rounded">
                        <p className="font-bold text-orange-700">L5</p>
                        <p className="text-xs text-gray-600">主任・係長</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="font-bold text-orange-700">L7</p>
                        <p className="text-xs text-gray-600">統括主任</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="font-bold text-orange-700">L8</p>
                        <p className="text-xs text-gray-600">師長・技士長</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="font-bold text-orange-700">L10</p>
                        <p className="text-xs text-gray-600">部長・医局長</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="font-bold text-orange-700">L15</p>
                        <p className="text-xs text-gray-600">人事部門長</p>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <p className="font-bold text-orange-700">L18</p>
                        <p className="text-xs text-gray-600">理事長</p>
                      </div>
                    </div>
                  </div>

                  {/* 特別権限 */}
                  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                    <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                      <span>⚡ 特別権限レベル（L97～L99）</span>
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">特定業務・システム管理用の特別権限</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-white p-3 rounded">
                        <p className="font-bold text-red-700">L97</p>
                        <p className="text-xs text-gray-600 mt-1">健診担当者</p>
                        <p className="text-xs text-gray-500 mt-1">健康管理システム専用</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="font-bold text-red-700">L98</p>
                        <p className="text-xs text-gray-600 mt-1">産業医</p>
                        <p className="text-xs text-gray-500 mt-1">医療データアクセス</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="font-bold text-red-700">L99</p>
                        <p className="text-xs text-gray-600 mt-1">システム管理者</p>
                        <p className="text-xs text-gray-500 mt-1">全機能アクセス</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-400 p-4">
                  <p className="text-sm text-indigo-800">
                    <strong>💡 ポイント：</strong>
                    権限レベルは自動計算されますが、人事部門長（L15以上）が手動調整可能です。
                    VoiceDriveシステムとリアルタイム同期されるため、権限変更は即座に反映されます。
                  </p>
                </div>
              </div>
            </div>

            {/* 施設別権限マッピング */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">🏥</span>
                施設別権限マッピング
              </h3>
              <p className="text-gray-600 mb-4">
                各施設の役職体系に応じて、権限レベルを柔軟にマッピングしています。
                施設の規模や組織構造が異なっても、公平な権限管理を実現します。
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {/* 小原病院 */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-3">小原病院</h4>
                  <p className="text-xs text-gray-600 mb-3">職員数: 420名 / 役職: 9種類</p>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>一般職員</span>
                      <span className="font-bold text-blue-700">L1-4</span>
                    </div>
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>主任</span>
                      <span className="font-bold text-blue-700">L5</span>
                    </div>
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>師長</span>
                      <span className="font-bold text-blue-700">L8</span>
                    </div>
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>部長</span>
                      <span className="font-bold text-blue-700">L10</span>
                    </div>
                  </div>
                </div>

                {/* 立神リハビリテーション温泉病院 */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-bold text-green-800 mb-3">立神リハビリテーション温泉病院</h4>
                  <p className="text-xs text-gray-600 mb-3">職員数: 180名 / 役職: 12種類</p>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>一般職員</span>
                      <span className="font-bold text-green-700">L1-4</span>
                    </div>
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>統括主任</span>
                      <span className="font-bold text-green-700">L7</span>
                    </div>
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>技士長</span>
                      <span className="font-bold text-green-700">L8</span>
                    </div>
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>部長</span>
                      <span className="font-bold text-green-700">L10</span>
                    </div>
                  </div>
                </div>

                {/* エスポワール立神 */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-3">エスポワール立神</h4>
                  <p className="text-xs text-gray-600 mb-3">職員数: 150名 / 役職: 33種類</p>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>一般職員</span>
                      <span className="font-bold text-purple-700">L1-4</span>
                    </div>
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>主任</span>
                      <span className="font-bold text-purple-700">L5</span>
                    </div>
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>師長</span>
                      <span className="font-bold text-purple-700">L8</span>
                    </div>
                    <div className="bg-white p-2 rounded flex justify-between">
                      <span>部長</span>
                      <span className="font-bold text-purple-700">L10</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">※多様な専門職・ケア職種に対応</p>
                </div>
              </div>

              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚙️ 柔軟な設定：</strong>
                  施設の組織変更や新役職追加に即座に対応。人事部がマスタデータを更新すると、
                  全システムに自動反映されます（VoiceDrive含む）。
                </p>
              </div>
            </div>

            {/* VoiceDrive統合機能 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">🎙️</span>
                VoiceDrive統合機能（2025年10月完了）
              </h3>

              <div className="space-y-4">
                {/* 健康管理システム統合 */}
                <div className="bg-teal-50 rounded-lg p-4 border-l-4 border-teal-400">
                  <h4 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                    <span>🏥 健康管理システム統合</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">完了</span>
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    ストレスチェック、健康診断データをVoiceDriveと連携し、音声での同意取得・結果確認が可能に
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ ストレスチェック同意管理（労働安全衛生法第66条の10準拠）</li>
                    <li>✅ 健診担当者ダッシュボード（L97専用）</li>
                    <li>✅ 産業医アクセス権限（L98専用）</li>
                    <li>✅ VoiceDrive健康通知統合（リトライ機構付き）</li>
                  </ul>
                </div>

                {/* コンプライアンス通報統合 */}
                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
                  <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                    <span>🚨 コンプライアンス通報統合</span>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">87.5%成功</span>
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    VoiceDriveで音声通報を受け付け、医療システムで自動処理・緊急度判定を実施
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ VoiceDrive受付確認通知送信（10件中7件合格）</li>
                    <li>✅ HMAC-SHA256署名検証（セキュリティ強化）</li>
                    <li>✅ 緊急度別メッセージ生成（Critical/High/Medium/Low）</li>
                    <li>✅ バッチ処理対応（5件連続処理成功）</li>
                    <li>⏳ 残り2件手動確認予定（2025年10月8日）</li>
                  </ul>
                </div>

                {/* 自動アカウント連携 */}
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-400">
                  <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                    <span>🔄 自動アカウント連携</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">完了</span>
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    職員登録時に自動的にVoiceDriveアカウントを作成、権限レベルを同期
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ 新規職員登録 → VoiceDriveアカウント自動作成</li>
                    <li>✅ 権限レベル変更 → VoiceDriveに即時反映</li>
                    <li>✅ 異動・昇進 → 施設・役職情報自動更新</li>
                    <li>✅ 退職処理 → VoiceDriveアカウント無効化</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-sm text-green-800">
                  <strong>🎯 統合の効果：</strong>
                  VoiceDrive統合により、音声での業務処理が可能になり、入力作業が平均70%削減されました。
                  権限レベルに応じた音声認識精度の向上も実現しています。
                </p>
              </div>
            </div>

            {/* 評価プロセスの全体像 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">評価はどうやって決まるの？</h3>
              
              {/* ステップ説明 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">年間評価スケジュール</h4>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="font-bold text-lg text-blue-600">8月</p>
                      <p className="text-sm text-gray-700">夏季賞与査定</p>
                      <p className="text-xs text-gray-600">組織貢献度25点（施設12.5+法人12.5）</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-green-600">12月</p>
                      <p className="text-sm text-gray-700">冬季賞与査定</p>
                      <p className="text-xs text-gray-600">組織貢献度25点（施設12.5+法人12.5）</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-purple-600">3月</p>
                      <p className="text-sm text-gray-700">技術評価実施</p>
                      <p className="text-xs text-gray-600">技術評価50点</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-red-600">3月末</p>
                      <p className="text-sm text-gray-700">統合評価</p>
                      <p className="text-xs text-gray-600">100点満点で最終決定</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-700 mb-3">3つのステップで評価が決まります</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">評価シートで点数化（100点満点）</p>
                      <p className="text-sm text-gray-600">技術評価50点 + 施設貢献25点 + 法人貢献25点</p>
                      <p className="text-xs text-gray-500 mt-1">※施設内・法人内評価とも同じ100点満点の計算式を使用</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">点数を順位に変換</p>
                      <p className="text-sm text-gray-600">施設内と法人内でそれぞれ同職種内で順位を算出</p>
                      <p className="text-xs text-gray-500 mt-1">※同じ100点の得点を、評価範囲の違いによって2つの順位を算出</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">2軸評価で最終評価決定</p>
                      <p className="text-sm text-gray-600">順位をS〜Dランクに変換し、マトリックスで総合評価（S+〜D）</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 評価ランクとマトリクス */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">評価ランクの仕組み</h3>
              
              {/* 5段階評価 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">各軸での評価（5段階）</h4>
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center p-3 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-800">S</div>
                    <div className="text-xs text-gray-600">上位10%</div>
                    <div className="text-xs font-semibold">卓越</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-b from-green-100 to-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">A</div>
                    <div className="text-xs text-gray-600">上位11-30%</div>
                    <div className="text-xs font-semibold">優秀</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">B</div>
                    <div className="text-xs text-gray-600">上位31-70%</div>
                    <div className="text-xs font-semibold">標準</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-b from-orange-100 to-orange-200 rounded-lg">
                    <div className="text-2xl font-bold text-orange-800">C</div>
                    <div className="text-xs text-gray-600">上位71-90%</div>
                    <div className="text-xs font-semibold">要改善</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-b from-red-100 to-red-200 rounded-lg">
                    <div className="text-2xl font-bold text-red-800">D</div>
                    <div className="text-xs text-gray-600">下位10%</div>
                    <div className="text-xs font-semibold">要支援</div>
                  </div>
                </div>
              </div>

              {/* 総合評価マトリクス */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">2軸を組み合わせた総合評価</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-3 bg-gray-100 text-sm">法人内＼施設内</th>
                        <th className="border border-gray-300 p-3 bg-yellow-100 text-sm">S</th>
                        <th className="border border-gray-300 p-3 bg-green-100 text-sm">A</th>
                        <th className="border border-gray-300 p-3 bg-blue-100 text-sm">B</th>
                        <th className="border border-gray-300 p-3 bg-orange-100 text-sm">C</th>
                        <th className="border border-gray-300 p-3 bg-red-100 text-sm">D</th>
                      </tr>
                    </thead>
                    <tbody className="text-center text-sm font-semibold">
                      <tr>
                        <td className="border border-gray-300 p-3 bg-yellow-100">S</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                        <td className="border border-gray-300 p-3 bg-green-200 text-lg">A+</td>
                        <td className="border border-gray-300 p-3 bg-yellow-100 text-lg">S</td>
                        <td className="border border-gray-300 p-3 bg-yellow-100 text-lg">S</td>
                        <td className="border border-gray-300 p-3 bg-yellow-200 text-lg">S+</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 bg-green-100">A</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                        <td className="border border-gray-300 p-3 bg-green-200 text-lg">A+</td>
                        <td className="border border-gray-300 p-3 bg-yellow-100 text-lg">S</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 bg-blue-100">B</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                        <td className="border border-gray-300 p-3 bg-green-200 text-lg">A+</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 bg-orange-100">C</td>
                        <td className="border border-gray-300 p-3 bg-red-100 text-lg">D</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                        <td className="border border-gray-300 p-3 bg-green-100 text-lg">A</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 bg-red-100">D</td>
                        <td className="border border-gray-300 p-3 bg-red-200 text-lg">D</td>
                        <td className="border border-gray-300 p-3 bg-red-100 text-lg">D</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-orange-100 text-lg">C</td>
                        <td className="border border-gray-300 p-3 bg-blue-100 text-lg">B</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  最終評価は7段階（S+, S, A+, A, B, C, D）で決まります
                </p>
              </div>
            </div>

            {/* 実際の評価項目 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ステップ1：評価シートで何が評価される？</h3>
              <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg mb-4">
                <p className="text-sm font-semibold text-green-800 mb-1">✨ 最新アップデート</p>
                <p className="text-xs text-gray-700">
                  v4評価シート（パターン5改良版）が全職種・経験レベルで利用可能になりました。
                  100点満点評価でより公平な評価が実現されます。
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800 mb-2">技術評価（50点）</h4>
                  
                  {/* 法人統一評価項目 */}
                  <div className="bg-purple-100 rounded-lg p-3 mb-3">
                    <h5 className="font-semibold text-purple-900 mb-2">1. 法人統一評価項目（30点）</h5>
                    <div className="space-y-2">
                      <div className="bg-white rounded p-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-gray-800">C01: 専門技術・スキル</span>
                          <span className="text-sm text-gray-600">10点</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">上司評価70%（7点）/ 本人評価30%（3点）</p>
                        <ul className="text-xs text-gray-500 ml-3">
                          <li>• 基本技術、応用技術、記録・報告</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white rounded p-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-gray-800">C02: 対人関係・ケア</span>
                          <span className="text-sm text-gray-600">10点</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">上司評価50%（5点）/ 本人評価50%（5点）</p>
                        <ul className="text-xs text-gray-500 ml-3">
                          <li>• 基本的対応、権利擁護</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white rounded p-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-gray-800">C03: 安全・品質管理</span>
                          <span className="text-sm text-gray-600">10点</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">上司評価80%（8点）/ 本人評価20%（2点）</p>
                        <ul className="text-xs text-gray-500 ml-3">
                          <li>• 医療安全、感染対策、身体拘束適正化</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* 施設特化評価項目 */}
                  <div className="bg-purple-100 rounded-lg p-3">
                    <h5 className="font-semibold text-purple-900 mb-2">2. 施設特化評価項目（20点）</h5>
                    <div className="bg-white rounded p-2">
                      <p className="text-sm text-gray-700 mb-1">各施設独自の評価基準</p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-3">
                        <li>• 施設の特性に応じた専門スキル</li>
                        <li>• 施設固有の業務への対応力</li>
                        <li>• 地域特性を踏まえたケア実践</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded p-2 mt-3">
                    <p className="text-xs text-gray-600">
                      各項目をS（100%）〜D（40%）の5段階で評価し、重み付け計算で点数化
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">組織貢献評価（50点）- 相対評価</h4>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <div className="bg-white rounded p-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">施設貢献（25点）</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• 防災訓練参加</li>
                        <li>• 朝礼出席</li>
                        <li>• 勉強会開催</li>
                        <li>• 新人指導</li>
                      </ul>
                      <p className="text-xs text-blue-600 mt-2">
                        夏12.5点 + 冬12.5点の年2回査定
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        各施設独自の査定を順位化して配点
                      </p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">法人貢献度（12.5点×2期＝25点）</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• 学会発表</li>
                        <li>• 他施設支援</li>
                        <li>• 法人委員会</li>
                        <li>• 法人行事参加</li>
                      </ul>
                      <p className="text-xs text-blue-600 mt-2">
                        夏12.5点 + 冬12.5点の年2回査定
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        同職種内で順位化して0〜12.5点配点
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded p-3 mt-3">
                    <p className="text-xs text-gray-700">
                      <strong>重要：</strong>組織貢献査定は賞与だけでなく昇級にも反映されるようになりました。
                      施設や組織のために頑張る人、スキルや知識を活かす人が正当に評価されます。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 順位化のプロセス */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ステップ2：点数から順位への変換</h3>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3 font-semibold">
                  同じ100点満点の評価を、2つの視点で順位化します
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">施設内での順位付け</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      技術50点 + 施設貢献25点 + 法人貢献25点 = 100点
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      この100点を施設内の同職種で順位化
                    </p>
                    <div className="bg-white/80 rounded p-2">
                      <p className="text-xs text-gray-600">
                        例：A病院の看護師50名中、あなたは15位 → B評価
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">法人内での順位付け</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      技術50点 + 施設貢献25点 + 法人貢献25点 = 100点
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      同じ100点を法人内の同職種で順位化
                    </p>
                    <div className="bg-white/80 rounded p-2">
                      <p className="text-xs text-gray-600">
                        例：法人全体の看護師300名中、あなたは80位 → A評価
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 評価の活用 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">評価はどう活用される？</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">あなたにとってのメリット</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>小規模施設でも正当に評価される</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>キャリアパスが明確になる</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>適材適所の配置で働きやすくなる</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>頑張りが数値で見える化される</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">評価結果の使われ方</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <div>
                        <p className="font-semibold text-sm">昇給・賞与</p>
                        <p className="text-xs text-gray-600">主に施設内評価を基準</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="font-semibold text-sm">昇進・異動</p>
                        <p className="text-xs text-gray-600">総合評価を基準</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <p className="font-semibold text-sm">教育・研修</p>
                        <p className="text-xs text-gray-600">2軸の組み合わせで個別プラン</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            )}

            {/* 人事評価制度の正式文書版 */}
            {viewMode === 'formal' && (
          <div className="space-y-6">
            {/* 規程 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">人事評価規程</h2>
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-lg font-semibold mb-3">第1章 総則</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第1条（目的）</strong></p>
                  <p className="ml-4">
                    本規程は、医療法人厚生会（以下「当法人」という）における職員の人事評価制度に関し、
                    必要な事項を定めることにより、公正かつ透明性の高い人事管理を実現し、
                    職員の能力開発及び組織の活性化を図ることを目的とする。
                  </p>
                  
                  <p className="mt-4"><strong>第2条（評価の基本原則）</strong></p>
                  <p className="ml-4">
                    当法人の人事評価は、以下の原則に基づき実施する：<br/>
                    (1) 2軸評価システムによる多面的評価<br/>
                    (2) 客観的かつ定量的な評価基準の適用<br/>
                    (3) 施設規模による不公平の排除<br/>
                    (4) 継続的な成長支援の実現
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第2章 評価プロセス</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第3条（評価シートによる点数化）</strong></p>
                  <p className="ml-4">
                    職員の評価は、以下の2大要素により100点満点で採点する：<br/>
                    (1) 技術評価（50点）<br/>
                    　　・法人統一評価項目（30点）：全施設共通の評価基準<br/>
                    　　　項目ごとに上司評価と本人評価の配分比率を設定<br/>
                    　　・施設特化評価項目（20点）：各施設独自の評価基準<br/>
                    (2) 組織貢献度評価（50点）：年2回の賞与査定時に評価<br/>
                    　　・施設貢献度（12.5点×2期＝25点）：施設内活動ポイントの相対評価<br/>
                    　　・法人貢献度（12.5点×2期＝25点）：法人全体活動ポイントの相対評価
                  </p>
                  
                  <p className="mt-4"><strong>第4条（順位の算出）</strong></p>
                  <p className="ml-4">
                    前条の合計点数に基づき、以下の順位を算出する：<br/>
                    (1) 施設内順位：同一施設・同一職種内での相対順位<br/>
                    (2) 法人内順位：法人全体・同一職種内での相対順位
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第3章 2軸評価システム</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第5条（評価軸の定義）</strong></p>
                  <p className="ml-4">
                    前章で算出した順位を、以下の2軸に変換する：<br/>
                    (1) 施設内評価：施設内順位をS〜Dの5段階に変換<br/>
                    (2) 法人内評価：法人内順位をS〜Dの5段階に変換
                  </p>
                  
                  <p className="mt-4"><strong>第6条（評価ランク）</strong></p>
                  <p className="ml-4">
                    各評価軸において、以下の5段階評価を適用する：<br/>
                    S：上位10%（卓越）<br/>
                    A：上位11-30%（優秀）<br/>
                    B：上位31-70%（標準）<br/>
                    C：上位71-90%（要改善）<br/>
                    D：下位10%（要支援）
                  </p>

                  <p className="mt-4"><strong>第7条（総合評価）</strong></p>
                  <p className="ml-4">
                    施設内評価と法人内評価のマトリクスにより、
                    7段階の総合評価（S+, S, A+, A, B, C, D）を決定する。
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第4章 評価の実施</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第8条（評価期間）</strong></p>
                  <p className="ml-4">
                    評価は年度を単位として実施し、4月1日から翌年3月31日までを評価期間とする。
                  </p>
                  
                  <p className="mt-4"><strong>第7条（評価項目）</strong></p>
                  <p className="ml-4">
                    評価は以下の項目により構成される：<br/>
                    (1) 技術評価（50点）<br/>
                    　　・法人統一評価項目（30点）：全施設共通の評価基準<br/>
                    　　　- C01: 専門技術・スキル（10点）上司70%/本人30%<br/>
                    　　　- C02: 対人関係・ケア（10点）上司50%/本人50%<br/>
                    　　　- C03: 安全・品質管理（10点）上司80%/本人20%<br/>
                    　　・施設特化評価項目（20点）：各施設独自の評価基準<br/>
                    (2) 組織貢献度評価（50点）：年2回の賞与査定時評価<br/>
                    　　・施設貢献度（12.5点×2期＝25点）<br/>
                    　　・法人貢献度（12.5点×2期＝25点）
                  </p>
                </div>
              </div>
            </div>
          </div>
            )}
          </>
        )}

        {/* 面談制度の内容 */}
        {activeTab === 'interview' && (
          <>
            {/* 表示モード切り替え */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setViewMode('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'general'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📘 一般職員向け
              </button>
              <button
                onClick={() => setViewMode('formal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'formal'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📜 正式文書版
              </button>
            </div>

            {viewMode === 'general' && (
          <div className="space-y-6">
            {/* 概要 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">💬</span>
                面談制度の概要
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  面談制度は、職員一人ひとりの声を聞き、働きやすい職場環境を作るための重要な仕組みです。
                  3つの分類（定期・特別・サポート）による10種類の面談タイプを通じて、個人のキャリア形成支援と組織全体の活性化を図ります。
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 font-semibold mb-2">面談制度の3つの目的</p>
                  <ul className="text-gray-700 space-y-1">
                    <li>🎯 個人のキャリア形成・成長支援</li>
                    <li>🎯 早期の問題発見と解決</li>
                    <li>🎯 組織全体のコミュニケーション向上</li>
                  </ul>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mt-4">
                  <p className="text-sm font-semibold text-green-800 mb-1">🎙️ VoiceDrive音声面談連携完了（2025年10月）</p>
                  <p className="text-xs text-gray-700">
                    VoiceDriveシステムと完全統合され、音声での面談記録・予約が可能になりました。
                    入力作業が平均70%削減され、面談者の負担が大幅に軽減されています。
                  </p>
                </div>
              </div>
            </div>

            {/* VoiceDrive音声面談機能 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-3xl">🎙️</span>
                VoiceDrive音声面談機能（2025年10月完了）
              </h3>
              <p className="text-gray-600 mb-4">
                VoiceDriveシステムとの統合により、面談内容を音声で記録・自動テキスト化できるようになりました。
                面談者は話すだけで面談シートが完成し、記録時間が大幅に短縮されます。
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* 音声記録機能 */}
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <span>🎤 音声→テキスト自動変換</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">完了</span>
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>面談中の会話を音声認識で自動テキスト化</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>権限レベル別に音声認識精度を最適化</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>医療専門用語の高精度認識に対応</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>自動保存機能（30秒ごと）</span>
                    </li>
                  </ul>
                </div>

                {/* スマート面談予約 */}
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                  <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <span>📅 スマート面談予約</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">完了</span>
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5">✓</span>
                      <span>職員・管理者双方のスケジュール自動調整</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5">✓</span>
                      <span>面談リマインダー自動通知（VoiceDrive経由）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5">✓</span>
                      <span>音声での予約変更・キャンセル対応</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5">✓</span>
                      <span>緊急面談の即時予約機能</span>
                    </li>
                  </ul>
                </div>

                {/* AI面談分析 */}
                <div className="bg-teal-50 rounded-lg p-4 border-l-4 border-teal-400">
                  <h4 className="font-bold text-teal-800 mb-3 flex items-center gap-2">
                    <span>🤖 AI面談分析</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">完了</span>
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      <span>感情分析・ストレスレベル検出</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      <span>離職リスク予測アルゴリズム</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      <span>キャリア志向自動判定</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500 mt-0.5">✓</span>
                      <span>面談品質スコアリング</span>
                    </li>
                  </ul>
                </div>

                {/* セキュリティ・コンプライアンス */}
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                  <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                    <span>🔒 セキュリティ対策</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">完了</span>
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✓</span>
                      <span>音声データの暗号化保存</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✓</span>
                      <span>権限レベル別アクセス制御</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✓</span>
                      <span>監査ログ自動記録</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✓</span>
                      <span>個人情報保護法準拠</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-400 p-4">
                <p className="text-sm text-indigo-800">
                  <strong>💡 導入効果：</strong>
                  VoiceDrive音声面談機能により、面談記録時間が平均70%削減されました。
                  面談者は対話に集中でき、職員との信頼関係構築により多くの時間を使えるようになっています。
                </p>
              </div>
            </div>

            {/* 10種類の面談 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">3分類・10種類の面談体系</h3>
              <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg mb-4">
                <p className="text-sm font-semibold text-orange-800 mb-1">⚠️ 実装状況のお知らせ</p>
                <p className="text-xs text-gray-700">
                  現在、定期面談の3種類（新入職員月次、一般職員年次、管理職半年）が利用可能です。
                  特別面談とサポート面談は順次実装予定です。
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* 定期面談 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    定期面談（必須）
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-blue-800">新入職員月次面談</span>
                        <div className="flex gap-1">
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">実装済</span>
                          <span className="text-xs bg-blue-200 px-2 py-1 rounded">月1回</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">入職1年未満の職員対象</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-blue-800">一般職員年次面談</span>
                        <div className="flex gap-1">
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">実装済</span>
                          <span className="text-xs bg-blue-200 px-2 py-1 rounded">年1回</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">全職員対象</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-blue-800">管理職半年面談</span>
                        <div className="flex gap-1">
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">実装済</span>
                          <span className="text-xs bg-blue-200 px-2 py-1 rounded">年2回</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">管理職対象</p>
                    </div>
                  </div>
                </div>

                {/* 特別面談 */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                  <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🔶</span>
                    特別面談（状況に応じて）
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-orange-800">復職面談</span>
                        <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">休職からの復職時</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-orange-800">インシデント後面談</span>
                        <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">インシデント発生後</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-orange-800">退職面談</span>
                        <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">退職前のヒアリング</p>
                    </div>
                  </div>
                </div>

                {/* サポート面談 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 md:col-span-2">
                  <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    サポート面談（任意）
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-green-800">フィードバック面談</span>
                        <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">人事評価後の結果共有</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-green-800">キャリア系面談</span>
                        <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">キャリアパス、スキル開発、昇進・異動</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-green-800">職場環境系面談</span>
                        <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">職場環境、人間関係、業務負荷</p>
                    </div>
                    <div className="bg-white/80 rounded p-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-green-800">個別相談面談</span>
                        <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">開発中</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">パフォーマンス、給与、研修、その他</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 重要な注意事項 */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-sm font-semibold text-yellow-800 mb-1">💡 重要なポイント</p>
                <p className="text-xs text-gray-700">
                  全ての面談は「評価」ではなく「支援」が目的です。人事評価とは完全に切り離されており、職員の成長と働きやすさの向上を目指しています。
                </p>
              </div>
            </div>

            {/* サポート面談のカテゴリ選択 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">サポート面談のカテゴリ選択</h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mb-4">
                <p className="text-sm font-semibold text-blue-800 mb-1">📢 カテゴリ選択について</p>
                <p className="text-xs text-gray-700">
                  サポート面談（フィードバック面談を除く）では、予約時に相談内容のカテゴリを選択していただきます。
                  これにより、面談担当者が事前に準備をして、より充実した面談を実施できます。
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">🎯 キャリア系面談</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• キャリアパス（将来の目標）</li>
                    <li>• スキル開発（研修・資格）</li>
                    <li>• 昇進・昇格</li>
                    <li>• 異動・転勤</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 text-sm mb-2">🏢 職場環境系面談</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 職場環境（設備・制度）</li>
                    <li>• 人間関係（チームワーク）</li>
                    <li>• 業務負荷・ワークライフバランス</li>
                    <li>• 健康・安全</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-semibold text-purple-800 text-sm mb-2">📦 個別相談面談</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• パフォーマンス（業務改善）</li>
                    <li>• 給与・待遇</li>
                    <li>• 研修・教育</li>
                    <li>• コンプライアンス</li>
                    <li>• その他の相談</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 予約と実施のルール */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">予約と実施のルール</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-blue-500">📅</span>
                    予約ルール
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="font-medium">予約可能期間</p>
                        <p className="text-xs text-gray-600">30日前から24時間前まで</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="font-medium">予約回数制限</p>
                        <p className="text-xs text-gray-600">月間最大2回（特別な事情は3回）</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="font-medium">間隔制限</p>
                        <p className="text-xs text-gray-600">前回面談から30日以上</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <div>
                        <p className="font-medium">面談時間</p>
                        <p className="text-xs text-gray-600">基本30分（延長可能45分）</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-green-500">🏥</span>
                    部署別の配慮
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="border-l-3 border-blue-400 pl-3">
                      <p className="font-medium">ICU</p>
                      <p className="text-xs text-gray-600">早い時間帯（13:40-14:20）優先</p>
                    </div>
                    <div className="border-l-3 border-green-400 pl-3">
                      <p className="font-medium">救急外来</p>
                      <p className="text-xs text-gray-600">遅い時間帯（15:30-16:10）優先</p>
                    </div>
                    <div className="border-l-3 border-purple-400 pl-3">
                      <p className="font-medium">手術室</p>
                      <p className="text-xs text-gray-600">月曜日は面談不可（手術集中日）</p>
                    </div>
                    <div className="border-l-3 border-orange-400 pl-3">
                      <p className="font-medium">夜勤明け</p>
                      <p className="text-xs text-gray-600">十分な休息後に実施</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 予約の流れ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">簡単3ステップの予約方法</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">日時選択</h4>
                  <p className="text-sm text-gray-600">
                    カレンダーから希望日時を選択（最大3つまで候補選択可）
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">内容入力</h4>
                  <p className="text-sm text-gray-600">
                    面談種類・カテゴリを選択、相談内容を記入（任意）
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">確認・申請</h4>
                  <p className="text-sm text-gray-600">
                    内容確認後に申請、自動でメール通知が送信されます
                  </p>
                </div>
              </div>
            </div>

            {/* リマインダー機能 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">自動リマインダー機能</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  面談を忘れないよう、自動でリマインダーが送信されます。
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">定期面談のリマインダー</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• 新入職員月次：14日前、7日前、3日前</li>
                      <li>• 一般職員年次：30日前、14日前、7日前</li>
                      <li>• その他の面談：7日前、3日前、前日</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">通知方法</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• メール通知（必須）</li>
                      <li>• システム内通知</li>
                      <li>• 期限超過時は最大3回まで自動通知</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 権限管理とアクセス制御 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">権限管理システム</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 font-semibold">レベル</th>
                      <th className="text-left p-2 font-semibold">役職・部門</th>
                      <th className="text-left p-2 font-semibold">主な権限</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">L1-4</td>
                      <td className="p-2">一般職員〜課長</td>
                      <td className="p-2 text-xs">自分の面談予約・確認のみ</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-2 font-medium">L5</td>
                      <td className="p-2">戦略企画・統括管理部門</td>
                      <td className="p-2 text-xs">予約管理、スケジュール調整</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">L6</td>
                      <td className="p-2">キャリア支援部門員</td>
                      <td className="p-2 text-xs">面談実施、記録作成</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-2 font-medium">L7-8</td>
                      <td className="p-2">各部門長・統括管理部門長</td>
                      <td className="p-2 text-xs">面談実施、統計確認</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">L9-10</td>
                      <td className="p-2">部長級以上</td>
                      <td className="p-2 text-xs">システム全体の管理</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 面談の進め方 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">効果的な面談のポイント</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-blue-500">👤</span>
                    職員の心構え
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>事前に話したいことを整理する</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>率直に意見や悩みを伝える</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>フィードバックを前向きに受け止める</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>具体的な行動計画を立てる</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-green-500">👥</span>
                    面談者の心構え
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>傾聴の姿勢を大切にする</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>具体的な事例でフィードバック</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>成長を支援する視点を持つ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">✓</span>
                      <span>次のステップを明確にする</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-semibold text-orange-800 mb-1">🎯 面談者について</p>
                <p className="text-xs text-gray-700">
                  専門の研修を受けた面談担当者が実施します。直属の上司ではありませんので、安心してお話しください。
                </p>
              </div>
            </div>

            {/* プライバシーとセキュリティ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">プライバシーと守秘義務</h3>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
                <p className="text-sm font-semibold text-red-800 mb-2">🔒 厳格な情報管理</p>
                <p className="text-xs text-gray-700">
                  面談内容は機密性レベルに応じてアクセス制限され、個人情報保護法に準拠した管理が行われます。
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">👤 職員の権利</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 自分の面談記録の閲覧・確認可能</li>
                    <li>• 退職時の記録削除要求可能</li>
                    <li>• 面談内容の録音は行わない</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">🎯 情報の取り扱い</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 本人同意なく上司への個人特定情報開示は禁止</li>
                    <li>• 組織改善に必要な情報は匿名化して共有</li>
                    <li>• SSL/TLS暗号化通信でデータ保護</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 面談シート */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">面談シートについて</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-600 mb-4">
                  面談シートは、面談の内容を記録し、継続的な成長支援に活用するためのツールです。
                  職種や経験年数に応じて最適化されたフォーマットを用意しています。
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800 mb-1">✅ 自動選択機能</p>
                  <p className="text-xs text-gray-700">
                    勤続年数に基づいて適切な面談シートが自動選択されます。
                    15分・30分・45分版から面談の目的に応じて選択可能です。
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/interviews" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h4 className="font-semibold text-blue-800 mb-2">一般職員用</h4>
                  <p className="text-sm text-gray-600">基本的な面談シート</p>
                </Link>
                <Link href="/interviews" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <h4 className="font-semibold text-green-800 mb-2">管理職用</h4>
                  <p className="text-sm text-gray-600">マネジメント評価含む</p>
                </Link>
                <Link href="/interviews" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <h4 className="font-semibold text-purple-800 mb-2">新人職員用</h4>
                  <p className="text-sm text-gray-600">成長支援重視</p>
                </Link>
              </div>
            </div>

            {/* システム連携と将来計画 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">システム連携と将来計画</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                  <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🔗</span>
                    現在進行中の連携
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500">•</span>
                      <div>
                        <p className="font-semibold">VoiceDrive連携</p>
                        <p className="text-xs text-gray-600">法人内SNSとの統合で職員からの予約を簡素化</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500">•</span>
                      <div>
                        <p className="font-semibold">共通データベース</p>
                        <p className="text-xs text-gray-600">データの一元管理を実現</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500">•</span>
                      <div>
                        <p className="font-semibold">API連携基盤</p>
                        <p className="text-xs text-gray-600">将来的なシステム間連携のための基盤構築</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
                  <h4 className="font-bold text-teal-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    将来の拡張予定
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <div>
                        <p className="font-semibold">AI分析機能</p>
                        <p className="text-xs text-gray-600">面談内容の分析と提案</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <div>
                        <p className="font-semibold">オンライン面談</p>
                        <p className="text-xs text-gray-600">リモート面談の実現</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <div>
                        <p className="font-semibold">モバイルアプリ</p>
                        <p className="text-xs text-gray-600">いつでもどこでも予約可能</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span>
                      <div>
                        <p className="font-semibold">勤怠・人事評価連携</p>
                        <p className="text-xs text-gray-600">シームレスな情報統合</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 開発メモ（Phase 3: システム間連携） */}
            <div className="bg-gray-100 rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💻 開発メモ：Phase 3 システム間連携仕様
              </h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4">
                <p className="text-sm font-semibold text-yellow-800 mb-1">🔧 開発者向け情報</p>
                <p className="text-xs text-gray-700">
                  このセクションは、VoiceDriveとの連携実装に関する技術仕様を記載しています。
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">📥 予約データ受信フロー</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="font-medium text-gray-700">1. VoiceDriveから予約データ受信</p>
                      <ul className="text-xs text-gray-600 ml-4 mt-1">
                        <li>• interviewType（必須）</li>
                        <li>• interviewCategory（条件付き必須）</li>
                        <li>• employeeInfo</li>
                        <li>• requestedTopics[]</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="font-medium text-gray-700">2. カテゴリ処理ロジック</p>
                      <ul className="text-xs text-gray-600 ml-4 mt-1">
                        <li>• サポート面談：カテゴリ必須</li>
                        <li>• 定期・特別面談：カテゴリ不要</li>
                        <li>• フィードバック面談：カテゴリ不要</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">🔄 面談実施フロー</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="font-medium text-gray-700">予約ベースフロー</p>
                      <ul className="text-xs text-gray-600 ml-4 mt-1">
                        <li>1. 予約一覧から選択</li>
                        <li>2. カテゴリ情報を自動表示</li>
                        <li>3. 推奨シートを提示</li>
                        <li>4. 面談実施・記録</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="font-medium text-gray-700">新規面談フロー</p>
                      <ul className="text-xs text-gray-600 ml-4 mt-1">
                        <li>1. 面談種類選択</li>
                        <li>2. カテゴリ選択（必要時）</li>
                        <li>3. 対象者選択</li>
                        <li>4. シート選択・実施</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-1">📋 実装タスク</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>✅ Phase 1: 本システムの10種類体系への改修（完了）</li>
                  <li>⏳ Phase 2: VoiceDrive側の予約フォーム改修（指示書作成済み）</li>
                  <li>📅 Phase 3: API連携と予約データ自動取り込み（計画中）</li>
                </ul>
              </div>
              
              {/* 面談・指導タブ実装計画 - 2025年8月23日追加 */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="text-sm font-semibold text-green-800 mb-2">🚀 面談・指導タブ実装計画（2025年8月23日策定）</p>
                <div className="space-y-3">
                  <div className="bg-white rounded p-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Phase 1: 基盤構築（1-2日）</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• StaffCardInterviewService実装</li>
                      <li>• 面談カテゴリ別データ取得機能</li>
                      <li>• 既存データとの整合性確認</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded p-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Phase 2: サマリーエリア実装（2-3日）</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• 概要タブ：横断的サマリー</li>
                      <li>• 定期面談タブ：月次・年次面談サマリー</li>
                      <li>• 特別面談タブ：インシデント・復職・退職面談</li>
                      <li>• サポート面談タブ：キャリア・職場環境・個別相談</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded p-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Phase 3: 連動機能実装（1-2日）</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• 面談管理→職員カルテのリアルタイム同期</li>
                      <li>• 面談シート回答の推移分析機能</li>
                      <li>• アラート・通知システム連携</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded p-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Phase 4: UI/UX最適化（1日）</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• データ表示指示書テクニック適用（グラフ・色分け）</li>
                      <li>• 縦棒・横棒・滝グラフの効果的活用</li>
                      <li>• レスポンシブ対応</li>
                    </ul>
                  </div>
                  <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                    <strong>連動仕様:</strong> 面談管理ページで面談実施完了→職員カルテの面談・指導タブに自動反映、期限切れアラート、人事フィードバック表示
                  </div>
                </div>
              </div>
            </div>
          </div>
            )}

            {/* 面談制度の内容（正式文書版） */}
            {viewMode === 'formal' && (
          <div className="space-y-6">
            {/* 面談規程 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">面談制度規程</h2>
              <div className="prose max-w-none text-gray-700">
                <h3 className="text-lg font-semibold mb-3">第1章 総則</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第1条（目的）</strong></p>
                  <p className="ml-4">
                    本規程は、当法人における面談制度に関し必要な事項を定め、
                    人事評価制度と連携した効果的な人材育成を実現することを目的とする。
                  </p>
                  
                  <p className="mt-4"><strong>第2条（面談の定義）</strong></p>
                  <p className="ml-4">
                    面談とは、目標設定・中間評価・年度評価を一体化した形式であり、
                    職員の成長段階と必要性に応じて実施時間を選択する柔軟な面談制度とする。
                  </p>

                  <p className="mt-4"><strong>第3条（面談時間の区分）</strong></p>
                  <p className="ml-4">
                    面談は以下の3つの時間区分で実施する：<br/>
                    (1) 15分面談：日常的なコミュニケーション重視<br/>
                    (2) 30分面談：定期的な進捗確認と課題共有<br/>
                    (3) 45分面談：詳細な評価と成長支援計画策定
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第2章 職位別面談基準</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第4条（新人職員）</strong></p>
                  <p className="ml-4">
                    新人職員（入職1年目）は、原則として45分面談を四半期ごとに実施する。
                    成長状況に応じて、追加の15分面談を月1回実施することができる。
                  </p>
                  
                  <p className="mt-4"><strong>第5条（一般職員）</strong></p>
                  <p className="ml-4">
                    一般職員は以下の頻度で実施する：<br/>
                    (1) 15分面談：月1回（任意）<br/>
                    (2) 30分面談：四半期ごと<br/>
                    (3) 45分面談：年2回（中間・年度評価時）
                  </p>

                  <p className="mt-4"><strong>第6条（中堅・シニア職員）</strong></p>
                  <p className="ml-4">
                    中堅・シニア職員は、30分面談を四半期ごと、
                    45分面談を年度評価時に実施する。
                  </p>

                  <p className="mt-4"><strong>第7条（管理職）</strong></p>
                  <p className="ml-4">
                    リーダー・主任等の管理職は、45分面談を四半期ごとに実施し、
                    部下育成計画と組織運営について協議する。
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第3章 2軸評価との連携</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第8条（評価結果の活用）</strong></p>
                  <p className="ml-4">
                    面談時には、2軸評価（施設内評価・法人内評価）の結果を基に、
                    以下の事項を必ず確認する：<br/>
                    (1) 施設内での相対的な位置づけ<br/>
                    (2) 法人全体での専門性レベル<br/>
                    (3) 総合評価（S+～D）と改善点<br/>
                    (4) キャリアパスと成長目標
                  </p>
                  
                  <p className="mt-4"><strong>第9条（フィードバック方法）</strong></p>
                  <p className="ml-4">
                    評価結果のフィードバックは、評価マトリクスを視覚的に示しながら、
                    具体的な改善策と成長支援策を提示する。
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第4章 面談シートの管理</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第10条（面談シート）</strong></p>
                  <p className="ml-4">
                    面談は、職位と時間に応じた面談シートを使用する。
                    シートは人事部が管理し、最新版を常に利用可能な状態に維持する。
                  </p>
                  
                  <p className="mt-4"><strong>第11条（記録の保管）</strong></p>
                  <p className="ml-4">
                    面談記録は電子化し、人事システムで一元管理する。
                    保管期間は5年間とし、本人の求めに応じて開示する。
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">第5章 面談の種別</h3>
                <div className="ml-4 space-y-2 text-sm">
                  <p><strong>第12条（面談の種別）</strong></p>
                  <p className="ml-4">
                    当法人の面談は、以下の3種別10種類とする：
                  </p>
                  
                  <p className="mt-3 ml-4"><strong>1. 定期面談（3種類）</strong></p>
                  <p className="ml-6">
                    (1) 新入職員月次面談：入職1年未満の職員を対象に月1回実施<br/>
                    (2) 一般職員年次面談：全職員を対象に年1回実施<br/>
                    (3) 管理職半年面談：管理職を対象に年2回実施
                  </p>
                  
                  <p className="mt-3 ml-4"><strong>2. 特別面談（3種類）</strong></p>
                  <p className="ml-6">
                    (1) 復職面談：休職からの復職時に実施<br/>
                    (2) インシデント後面談：インシデント発生後のフォローとして実施<br/>
                    (3) 退職面談：退職前に実施
                  </p>
                  
                  <p className="mt-3 ml-4"><strong>3. サポート面談（4種類）</strong></p>
                  <p className="ml-6">
                    (1) フィードバック面談：人事評価後の結果共有（評価開示後1ヶ月以内）<br/>
                    (2) キャリア系面談：キャリアパス、スキル開発、昇進・昇格、異動・転勤の相談（随時）<br/>
                    (3) 職場環境系面談：職場環境、人間関係、業務負荷、健康・安全の相談（随時）<br/>
                    (4) 個別相談面談：パフォーマンス、給与・待遇、研修・教育、コンプライアンス、その他の相談（随時）
                  </p>
                  
                  <p className="mt-4"><strong>第13条（面談と評価の分離）</strong></p>
                  <p className="ml-4">
                    全ての面談は「支援」を目的とし、人事評価とは完全に分離して実施する。
                    フィードバック面談においても、評価者ではない人事部が中立的立場から
                    キャリア支援を中心とした建設的な対話を行うものとする。
                  </p>
                </div>
              </div>
            </div>

            {/* 面談実施要領 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">面談実施要領</h3>
              <div className="space-y-4 text-sm">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">1. 面談時間の選択基準</h4>
                  <table className="ml-4 w-full text-gray-600">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">状況</th>
                        <th className="text-left py-1">推奨時間</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1">日常的な確認・相談</td>
                        <td className="py-1">15分</td>
                      </tr>
                      <tr>
                        <td className="py-1">定期面談・進捗確認</td>
                        <td className="py-1">30分</td>
                      </tr>
                      <tr>
                        <td className="py-1">評価面談・キャリア相談</td>
                        <td className="py-1">45分</td>
                      </tr>
                      <tr>
                        <td className="py-1">問題解決・緊急対応</td>
                        <td className="py-1">45分</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">2. 2軸評価の説明方法</h4>
                  <ul className="ml-4 space-y-1 text-gray-600">
                    <li>• 評価マトリクス表を用いて視覚的に説明</li>
                    <li>• 施設内順位：「あなたの施設での位置は上位◯%」</li>
                    <li>• 法人内順位：「法人全体での専門性は上位◯%」</li>
                    <li>• 総合評価の意味と今後の目標を明確化</li>
                    <li>• 他施設への異動可能性についても言及</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">3. 職位別重点項目</h4>
                  <ul className="ml-4 space-y-1 text-gray-600">
                    <li><strong>新人：</strong>基礎技術習得、職場適応、メンタルサポート</li>
                    <li><strong>一般：</strong>専門性向上、チーム貢献、目標達成</li>
                    <li><strong>中堅：</strong>後輩指導、業務改善、リーダーシップ</li>
                    <li><strong>シニア：</strong>専門性発揮、知識伝承、組織貢献</li>
                    <li><strong>管理職：</strong>部下育成、組織運営、戦略実行</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">4. サポート面談のカテゴリ選択</h4>
                  <ul className="ml-4 space-y-1 text-gray-600">
                    <li><strong>キャリア系：</strong>キャリアパス、スキル開発、昇進・昇格、異動・転勤</li>
                    <li><strong>職場環境系：</strong>職場環境、人間関係、業務負荷、健康・安全</li>
                    <li><strong>個別相談：</strong>パフォーマンス、給与・待遇、研修・教育、コンプライアンス、その他</li>
                    <li>※ フィードバック面談はカテゴリ選択不要</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">5. 面談後のアクション</h4>
                  <ul className="ml-4 space-y-1 text-gray-600">
                    <li>• 面談シートを3日以内に人事部提出</li>
                    <li>• 合意した目標・改善策を文書化</li>
                    <li>• 次回面談日程の設定（その場で決定）</li>
                    <li>• 必要に応じて教育研修の申込み</li>
                    <li>• 重要事項は部門長・人事部と共有</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* シート一覧 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">面談シート一覧</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2">職位</th>
                      <th className="text-left py-2">15分版</th>
                      <th className="text-left py-2">30分版</th>
                      <th className="text-left py-2">45分版</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">新人看護師</td>
                      <td>○</td>
                      <td>○</td>
                      <td>◎（推奨）</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">一般看護師</td>
                      <td>○</td>
                      <td>◎（推奨）</td>
                      <td>○</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">中堅看護師</td>
                      <td>-</td>
                      <td>◎（推奨）</td>
                      <td>○</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">シニア看護師</td>
                      <td>-</td>
                      <td>○</td>
                      <td>◎（推奨）</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">ベテラン看護師</td>
                      <td>-</td>
                      <td>○</td>
                      <td>◎（推奨）</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">リーダー看護師</td>
                      <td>-</td>
                      <td>-</td>
                      <td>◎（必須）</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-semibold">主任看護師</td>
                      <td>-</td>
                      <td>-</td>
                      <td>◎（必須）</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-600 mt-2">◎：推奨/必須　○：利用可　-：該当なし</p>
              </div>
            </div>
          </div>
            )}
          </>
        )}

        {/* 教育・研修制度のコンテンツ */}
        {activeTab === 'training' && (
          <>
            {/* 表示モード切り替え */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setViewMode('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'general'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📘 一般職員向け
              </button>
              <button
                onClick={() => setViewMode('formal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'formal'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📜 正式文書版
              </button>
            </div>
            
            <TrainingContent viewMode={viewMode} />
          </>
        )}

        {/* キャリア選択制度のコンテンツ */}
        {activeTab === 'career-course' && (
          <>
            {/* 表示モード切り替え */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setViewMode('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'general'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📘 一般職員向け
              </button>
              <button
                onClick={() => setViewMode('formal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'formal'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📜 正式文書版
              </button>
            </div>

            <CareerCourseContent viewMode={viewMode} />
          </>
        )}

        {/* シート閲覧セクション */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            {/* 実装状況のお知らせ */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📄 利用可能なシートについて</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>✅ <strong>評価シート</strong>：全職種・全経験レベルのv4評価シート（パターン5改良版）が利用可能</p>
                <p>✅ <strong>面談シート</strong>：看護師用v4統合版（15分・30分・45分）が利用可能</p>
                <p>⚠️ 准看護師・看護補助者用の面談シートは開発中です</p>
              </div>
            </div>
            
            {/* 検索・フィルターセクション */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">シート検索・フィルター</h2>
              
              {/* 検索バー */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="シート名や説明文で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* フィルターボタン */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {/* シートタイプ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">種類</label>
                  <select
                    value={sheetType}
                    onChange={(e) => setSheetType(e.target.value as 'all' | 'interview')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">すべて</option>
                    <option value="interview">面談シート</option>
                  </select>
                </div>

                {/* 施設タイプ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">施設</label>
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">すべて</option>
                    <option value="急性期">急性期</option>
                    <option value="慢性期">慢性期</option>
                    <option value="老健">老健</option>
                    <option value="グループホーム">グループホーム</option>
                  </select>
                </div>

                {/* 職種 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">職種</label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">すべて</option>
                    <option value="看護師">看護師</option>
                    <option value="准看護師">准看護師</option>
                    <option value="看護補助者">看護補助者</option>
                    <option value="介護士">介護士</option>
                  </select>
                </div>

                {/* 経験年数 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">経験</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">すべて</option>
                    <option value="新人">新人</option>
                    <option value="一般">一般</option>
                    <option value="中堅">中堅</option>
                    <option value="シニア">シニア</option>
                    <option value="ベテラン">ベテラン</option>
                    <option value="リーダー">リーダー</option>
                    <option value="主任">主任</option>
                  </select>
                </div>

                {/* リセットボタン */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSheetType('all');
                      setSelectedFacility('all');
                      setSelectedPosition('all');
                      setSelectedExperience('all');
                    }}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    リセット
                  </button>
                </div>
              </div>
            </div>

            {/* 検索結果 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                シート一覧 ({filteredSheets.length}件)
              </h2>

              {filteredSheets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  該当するシートが見つかりませんでした
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredSheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {sheet.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                sheet.type === 'interview'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {sheet.type === 'interview' ? '面談' : '評価'}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {sheet.version}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{sheet.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {sheet.facility && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                                {sheet.facility}
                              </span>
                            )}
                            {sheet.position && (
                              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                                {sheet.position}
                              </span>
                            )}
                            {sheet.experience && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                                {sheet.experience}
                              </span>
                            )}
                            {sheet.duration && (
                              <span className="px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded">
                                {sheet.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              // TSXファイルパスはそのまま使用
                              setPreviewSheet(sheet);
                            }}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            👁️ プレビュー
                          </button>
                          <button
                            onClick={() => {
                              // TSXファイルパスをそのまま使用してダウンロード
                              const downloadUrl = `/api/download-sheet?path=${encodeURIComponent(sheet.path)}&name=${encodeURIComponent(sheet.name)}`;
                              window.open(downloadUrl, '_blank');
                            }}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            ⬇️ ダウンロード
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 使い方ガイド */}
            <div className="bg-yellow-50 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-3">💡 シート利用ガイド</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">面談シートの使い方</h4>
                  <ul className="space-y-1">
                    <li>• 面談前に該当するシートをダウンロード</li>
                    <li>• 事前に記入できる項目は準備</li>
                    <li>• 面談時は印刷して持参、または画面で確認</li>
                    <li>• 面談後は人事部に提出</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">評価システムの使い方</h4>
                  <ul className="space-y-1">
                    <li>• V3評価システム（ダッシュボード）から施設・職種・経験に応じた評価シートを選択</li>
                    <li>• 評価期間前に評価項目を確認</li>
                    <li>• 自己評価と上司評価の両方を記入</li>
                    <li>• 2軸評価（施設内・法人内）を理解</li>
                    <li>• 評価結果は面談でフィードバック</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* 評価項目決定プロセスのガイドライン */}
        {activeTab === 'evaluation' && (
          <div className="bg-indigo-50 rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">評価項目決定プロセスガイドライン</h2>
            
            {/* プロセス概要 */}
            <div className="bg-white rounded-lg p-5 mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">施設裁量部分（20点）の決定プロセス</h3>
              
              <div className="space-y-4">
                {/* ステップ1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">施設評価委員会の設置</h4>
                    <p className="text-sm text-gray-700 mb-2">各施設に評価項目検討委員会を設置（年1回開催）</p>
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      <p className="font-medium mb-1">委員会構成：</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• 施設長（委員長）</li>
                        <li>• 各部門責任者（看護部長、事務長等）</li>
                        <li>• 職員代表（各職種から選出）</li>
                        <li>• 人事担当者（事務局）</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* ステップ2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">現状分析と課題抽出</h4>
                    <p className="text-sm text-gray-700 mb-2">施設の特性と重点課題を分析</p>
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      <p className="font-medium mb-1">分析項目：</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• 施設種別と機能（急性期/慢性期/介護等）</li>
                        <li>• 地域ニーズと施設の役割</li>
                        <li>• 前年度評価結果の分析</li>
                        <li>• 職員スキルギャップの特定</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* ステップ3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">評価項目案の作成</h4>
                    <p className="text-sm text-gray-700 mb-2">20点分の評価項目を選択・配点</p>
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      <p className="font-medium mb-1">選択可能項目（例）：</p>
                      <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                        <ul className="space-y-1">
                          <li>• 専門知識（最大10点）</li>
                          <li>• 教育・指導力（最大10点）</li>
                          <li>• リーダーシップ（最大10点）</li>
                        </ul>
                        <ul className="space-y-1">
                          <li>• 成長性・向上心（最大10点）</li>
                          <li>• 施設独自スキル（最大10点）</li>
                          <li>• イノベーション（最大5点）</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ステップ4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">法人人事部への申請・承認</h4>
                    <p className="text-sm text-gray-700 mb-2">評価項目案を法人人事部に提出</p>
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      <p className="font-medium mb-1">提出書類：</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• 評価項目選択理由書</li>
                        <li>• 配点根拠説明書</li>
                        <li>• 前年度との変更点（該当する場合）</li>
                        <li>• 委員会議事録</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* ステップ5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">職員への周知・説明</h4>
                    <p className="text-sm text-gray-700 mb-2">決定した評価項目を全職員に説明</p>
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      <p className="font-medium mb-1">周知方法：</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• 職員説明会の開催</li>
                        <li>• 評価項目一覧表の配布</li>
                        <li>• イントラネットでの公開</li>
                        <li>• 質疑応答期間の設定</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 年間スケジュール */}
            <div className="bg-white rounded-lg p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-3">年間スケジュール</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="text-left p-2">時期</th>
                      <th className="text-left p-2">実施事項</th>
                      <th className="text-left p-2">担当</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">10月</td>
                      <td className="p-2">評価委員会開催・現状分析</td>
                      <td className="p-2">各施設</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">11月</td>
                      <td className="p-2">評価項目案作成・提出</td>
                      <td className="p-2">各施設→法人</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">12月</td>
                      <td className="p-2">法人審査・承認</td>
                      <td className="p-2">法人人事部</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">1月</td>
                      <td className="p-2">職員説明会</td>
                      <td className="p-2">各施設</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">4月</td>
                      <td className="p-2">新評価項目運用開始</td>
                      <td className="p-2">全施設</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* 準備室活動計画セクション */}
        {activeTab === 'preparation' && (
          <div className="space-y-6">
            {/* サブタブ切り替え */}
            <div className="bg-white rounded-xl shadow-lg p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setPreparationSubTab('organization')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    preparationSubTab === 'organization'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🏢 準備室組織体制
                </button>
                <button
                  onClick={() => setPreparationSubTab('info-collection')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    preparationSubTab === 'info-collection'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔍 情報収集フェーズ
                </button>
                <button
                  onClick={() => setPreparationSubTab('system-design')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    preparationSubTab === 'system-design'
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📝 制度設計フェーズ
                </button>
                <button
                  onClick={() => setPreparationSubTab('trial-adjustment')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    preparationSubTab === 'trial-adjustment'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔄 試行・調整フェーズ
                </button>
              </div>
            </div>

            {/* 準備室組織体制タブ */}
            {preparationSubTab === 'organization' && (
              <JinzaiPreparationLayout />
            )}

            {/* 情報収集フェーズタブ */}
            {preparationSubTab === 'info-collection' && (
              <ActionPlanLayout />
            )}

            {/* 制度設計フェーズタブ */}
            {preparationSubTab === 'system-design' && (
              <DesignPhaseLayout />
            )}

            {/* 試行・調整フェーズタブ */}
            {preparationSubTab === 'trial-adjustment' && (
              <TrialPhaseLayout />
            )}
          </div>
        )}

        {/* 取扱説明書（人事部用） */}
        {activeTab === 'manual' && (
          <SystemManualContent />
        )}

        {/* お問い合わせ */}
        <div className="bg-blue-50 rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-blue-800 mb-3">お問い合わせ</h3>
          <p className="text-gray-700 mb-4">
            人事評価制度・面談制度・各種シートに関するご質問やご相談は、人事部までお気軽にお問い合わせください。
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📧</span>
              <span className="text-sm">人事部直通: jinji@kousei-kai.jp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📞</span>
              <span className="text-sm">内線: 2100</span>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* プレビューモーダル */}
      {previewSheet && (
        previewSheet.type === 'interview' ? (
          <InterviewSheetModal
            isOpen={!!previewSheet}
            onClose={() => setPreviewSheet(null)}
            sheetName={previewSheet.name}
            sheetPath={previewSheet.path}
          />
        ) : (
          <SheetPreviewModal
            isOpen={!!previewSheet}
            onClose={() => setPreviewSheet(null)}
            sheetName={previewSheet.name}
            sheetPath={previewSheet.path}
          />
        )
      )}
    </div>
  );
}