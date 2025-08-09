import { ExperienceCategory } from './experienceUtils';

export interface InterviewSheetInfo {
  component: string;
  path: string;
  duration: number;
  title: string;
  experienceCategory: ExperienceCategory;
}

// v4面談シートのマッピング
export const v4InterviewSheets: Record<ExperienceCategory | 'leader', InterviewSheetInfo[]> = {
  new: [
    {
      component: 'NewNurseUnified15Min',
      path: '/interview-sheets/v4/new-nurse-unified-15min',
      duration: 15,
      title: '新人看護師定期面談シート（15分版）',
      experienceCategory: 'new'
    },
    {
      component: 'NewNurseUnified30Min',
      path: '/interview-sheets/v4/new-nurse-unified-30min',
      duration: 30,
      title: '新人看護師定期面談シート（30分版）',
      experienceCategory: 'new'
    },
    {
      component: 'NewNurseUnified45Min',
      path: '/interview-sheets/v4/new-nurse-unified-45min',
      duration: 45,
      title: '新人看護師定期面談シート（45分版）',
      experienceCategory: 'new'
    }
  ],
  junior: [
    {
      component: 'GeneralNurseUnified15Min',
      path: '/interview-sheets/v4/general-nurse-unified-15min',
      duration: 15,
      title: '一般看護師定期面談シート（15分版）',
      experienceCategory: 'junior'
    },
    {
      component: 'GeneralNurseUnified30Min',
      path: '/interview-sheets/v4/general-nurse-unified-30min',
      duration: 30,
      title: '一般看護師定期面談シート（30分版）',
      experienceCategory: 'junior'
    },
    {
      component: 'GeneralNurseUnified45Min',
      path: '/interview-sheets/v4/general-nurse-unified-45min',
      duration: 45,
      title: '一般看護師定期面談シート（45分版）',
      experienceCategory: 'junior'
    }
  ],
  midlevel: [
    {
      component: 'GeneralNurseUnified15Min',
      path: '/interview-sheets/v4/general-nurse-unified-15min',
      duration: 15,
      title: '一般看護師定期面談シート（15分版）',
      experienceCategory: 'midlevel'
    },
    {
      component: 'GeneralNurseUnified30Min',
      path: '/interview-sheets/v4/general-nurse-unified-30min',
      duration: 30,
      title: '一般看護師定期面談シート（30分版）',
      experienceCategory: 'midlevel'
    },
    {
      component: 'GeneralNurseUnified45Min',
      path: '/interview-sheets/v4/general-nurse-unified-45min',
      duration: 45,
      title: '一般看護師定期面談シート（45分版）',
      experienceCategory: 'midlevel'
    }
  ],
  veteran: [
    {
      component: 'VeteranNurseUnified15Min',
      path: '/interview-sheets/v4/veteran-nurse-unified-15min',
      duration: 15,
      title: 'ベテラン看護師定期面談シート（15分版）',
      experienceCategory: 'veteran'
    },
    {
      component: 'VeteranNurseUnified30Min',
      path: '/interview-sheets/v4/veteran-nurse-unified-30min',
      duration: 30,
      title: 'ベテラン看護師定期面談シート（30分版）',
      experienceCategory: 'veteran'
    },
    {
      component: 'VeteranNurseUnified45Min',
      path: '/interview-sheets/v4/veteran-nurse-unified-45min',
      duration: 45,
      title: 'ベテラン看護師定期面談シート（45分版）',
      experienceCategory: 'veteran'
    }
  ],
  chief: [
    {
      component: 'ChiefNurseUnified15Min',
      path: '/interview-sheets/v4/chief-nurse-unified-15min',
      duration: 15,
      title: '病棟師長定期面談シート（15分版）',
      experienceCategory: 'chief'
    },
    {
      component: 'ChiefNurseUnified30Min',
      path: '/interview-sheets/v4/chief-nurse-unified-30min',
      duration: 30,
      title: '病棟師長定期面談シート（30分版）',
      experienceCategory: 'chief'
    },
    {
      component: 'ChiefNurseUnified45Min',
      path: '/interview-sheets/v4/chief-nurse-unified-45min',
      duration: 45,
      title: '病棟師長定期面談シート（45分版）',
      experienceCategory: 'chief'
    }
  ],
  manager: [
    {
      component: 'LeaderNurseUnified15Min',
      path: '/interview-sheets/v4/leader-nurse-unified-15min',
      duration: 15,
      title: '主任看護師定期面談シート（15分版）',
      experienceCategory: 'manager'
    },
    {
      component: 'LeaderNurseUnified30Min',
      path: '/interview-sheets/v4/leader-nurse-unified-30min',
      duration: 30,
      title: '主任看護師定期面談シート（30分版）',
      experienceCategory: 'manager'
    },
    {
      component: 'LeaderNurseUnified45Min',
      path: '/interview-sheets/v4/leader-nurse-unified-45min',
      duration: 45,
      title: '主任看護師定期面談シート（45分版）',
      experienceCategory: 'manager'
    }
  ],
  leader: [
    {
      component: 'LeaderNurseUnified15Min',
      path: '/interview-sheets/v4/leader-nurse-unified-15min',
      duration: 15,
      title: '主任看護師定期面談シート（15分版）',
      experienceCategory: 'leader' as any
    },
    {
      component: 'LeaderNurseUnified30Min',
      path: '/interview-sheets/v4/leader-nurse-unified-30min',
      duration: 30,
      title: '主任看護師定期面談シート（30分版）',
      experienceCategory: 'leader' as any
    },
    {
      component: 'LeaderNurseUnified45Min',
      path: '/interview-sheets/v4/leader-nurse-unified-45min',
      duration: 45,
      title: '主任看護師定期面談シート（45分版）',
      experienceCategory: 'leader' as any
    }
  ]
};

/**
 * 経験年数カテゴリに基づいて適切な面談シートを選択
 * @param experienceCategory 経験年数カテゴリ
 * @param preferredDuration 希望する面談時間（分）。デフォルトは30分
 * @returns 面談シート情報
 */
export function selectInterviewSheet(
  experienceCategory: ExperienceCategory,
  preferredDuration: number = 30
): InterviewSheetInfo {
  const sheets = v4InterviewSheets[experienceCategory];
  
  if (!sheets || sheets.length === 0) {
    // フォールバック: junior（一般看護師）の30分版を使用
    return v4InterviewSheets.junior[1];
  }
  
  // 希望する時間の面談シートを探す
  const preferredSheet = sheets.find(sheet => sheet.duration === preferredDuration);
  if (preferredSheet) {
    return preferredSheet;
  }
  
  // 希望する時間がない場合は、最も近い時間のシートを選択
  const sortedByDuration = [...sheets].sort((a, b) => 
    Math.abs(a.duration - preferredDuration) - Math.abs(b.duration - preferredDuration)
  );
  
  return sortedByDuration[0];
}

/**
 * 利用可能な全ての面談シートを取得
 * @returns 全ての面談シート情報
 */
export function getAllInterviewSheets(): InterviewSheetInfo[] {
  return Object.values(v4InterviewSheets).flat();
}