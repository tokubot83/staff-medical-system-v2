// 小原病院 組織データ
// 令和7年7月1日現在

export interface Department {
  id: string;
  name: string;
  type: 'executive' | 'medical' | 'nursing' | 'technical' | 'administrative' | 'support' | 'safety';
  parentId?: string;
  level: number;
  head?: {
    title: string;
    name?: string;
  };
  subHead?: {
    title: string;
    name?: string;
  };
  description?: string;
  staffCount?: number;
}

export const organizationData: Department[] = [
  // 経営層
  {
    id: 'director',
    name: '院長',
    type: 'executive',
    level: 1,
    head: { title: '院長' }
  },
  {
    id: 'deputy-director',
    name: '副院長',
    type: 'executive',
    level: 2,
    parentId: 'director',
    head: { title: '副院長' }
  },
  {
    id: 'admin-director',
    name: '事務長',
    type: 'executive',
    level: 2,
    parentId: 'director',
    head: { title: '事務長' }
  },
  
  // 診療部
  {
    id: 'medical-dept',
    name: '診療部',
    type: 'medical',
    level: 3,
    parentId: 'director',
    head: { title: '医局長' }
  },
  {
    id: 'neurosurgery',
    name: '脳神経外科',
    type: 'medical',
    level: 4,
    parentId: 'medical-dept',
    head: { title: '部長' }
  },
  {
    id: 'surgery',
    name: '外科（消化器外科）',
    type: 'medical',
    level: 4,
    parentId: 'medical-dept',
    head: { title: '部長' }
  },
  {
    id: 'cardiology',
    name: '循環器内科',
    type: 'medical',
    level: 4,
    parentId: 'medical-dept',
    head: { title: '部長' }
  },
  {
    id: 'gastroenterology',
    name: '消化器内科',
    type: 'medical',
    level: 4,
    parentId: 'medical-dept',
    head: { title: '部長' }
  },
  {
    id: 'radiology',
    name: '放射線科',
    type: 'medical',
    level: 4,
    parentId: 'medical-dept',
    head: { title: '部長' }
  },
  {
    id: 'rehabilitation-med',
    name: 'リハビリテーション科',
    type: 'medical',
    level: 4,
    parentId: 'medical-dept',
    head: { title: '部長' }
  },
  {
    id: 'nephrology',
    name: '腎臓内科',
    type: 'medical',
    level: 4,
    parentId: 'medical-dept'
  },
  {
    id: 'orthopedics',
    name: '整形外科',
    type: 'medical',
    level: 4,
    parentId: 'medical-dept'
  },
  
  // 看護部
  {
    id: 'nursing-dept',
    name: '看護部',
    type: 'nursing',
    level: 3,
    parentId: 'director',
    head: { title: '部長' }
  },
  {
    id: 'nursing-education',
    name: '看護教育',
    type: 'nursing',
    level: 4,
    parentId: 'nursing-dept',
    head: { title: '教育師長' }
  },
  {
    id: 'dialysis',
    name: '人工透析室',
    type: 'nursing',
    level: 4,
    parentId: 'nursing-dept',
    head: { title: '室長' },
    subHead: { title: '主任' }
  },
  {
    id: 'outpatient',
    name: '外来',
    type: 'nursing',
    level: 4,
    parentId: 'nursing-dept',
    head: { title: '師長' },
    subHead: { title: '主任' }
  },
  {
    id: 'ward-3f',
    name: '3階病棟',
    type: 'nursing',
    level: 4,
    parentId: 'nursing-dept',
    head: { title: '師長' },
    subHead: { title: '主任' }
  },
  {
    id: 'ward-4f',
    name: '4階病棟',
    type: 'nursing',
    level: 4,
    parentId: 'nursing-dept',
    head: { title: '師長' },
    subHead: { title: '主任' }
  },
  {
    id: 'ward-5f',
    name: '5階病棟',
    type: 'nursing',
    level: 4,
    parentId: 'nursing-dept',
    head: { title: '師長' },
    subHead: { title: '主任' }
  },
  
  // 診療技術部
  {
    id: 'clinical-tech-dept',
    name: '診療技術部',
    type: 'technical',
    level: 3,
    parentId: 'director',
    head: { title: '部長' }
  },
  {
    id: 'radiology-tech',
    name: '診療放射線科',
    type: 'technical',
    level: 4,
    parentId: 'clinical-tech-dept',
    head: { title: '科長' },
    subHead: { title: '主任' }
  },
  {
    id: 'laboratory',
    name: '臨床検査科',
    type: 'technical',
    level: 4,
    parentId: 'clinical-tech-dept',
    head: { title: '科長' },
    subHead: { title: '主任' }
  },
  {
    id: 'nutrition',
    name: '栄養科',
    type: 'technical',
    level: 4,
    parentId: 'clinical-tech-dept',
    head: { title: '科長' },
    subHead: { title: '主任' }
  },
  {
    id: 'clinical-engineering',
    name: '臨床工学科',
    type: 'technical',
    level: 4,
    parentId: 'clinical-tech-dept',
    head: { title: '科長' },
    subHead: { title: '主任' }
  },
  {
    id: 'rehabilitation-tech',
    name: 'リハビリテーション科',
    type: 'technical',
    level: 4,
    parentId: 'clinical-tech-dept',
    head: { title: '科長' }
  },
  {
    id: 'physical-therapy',
    name: '理学療法室',
    type: 'technical',
    level: 5,
    parentId: 'rehabilitation-tech',
    head: { title: '主任' }
  },
  {
    id: 'occupational-therapy',
    name: '作業療法室',
    type: 'technical',
    level: 5,
    parentId: 'rehabilitation-tech',
    head: { title: '主任' }
  },
  {
    id: 'speech-therapy',
    name: '言語聴覚室',
    type: 'technical',
    level: 5,
    parentId: 'rehabilitation-tech',
    head: { title: '主任' }
  },
  
  // 入退院支援部
  {
    id: 'admission-support-dept',
    name: '入退院支援部',
    type: 'support',
    level: 3,
    parentId: 'director',
    head: { title: '部長' }
  },
  {
    id: 'regional-medical-liaison',
    name: '地域医療連携室',
    type: 'support',
    level: 4,
    parentId: 'admission-support-dept',
    head: { title: '室長' }
  },
  
  // 薬剤部
  {
    id: 'pharmacy-dept',
    name: '薬剤部',
    type: 'medical',
    level: 3,
    parentId: 'director',
    head: { title: '部長' }
  },
  {
    id: 'dispensing',
    name: '調剤室',
    type: 'medical',
    level: 4,
    parentId: 'pharmacy-dept',
    head: { title: '主任' }
  },
  {
    id: 'drug-information',
    name: '医薬品情報管理室',
    type: 'medical',
    level: 4,
    parentId: 'pharmacy-dept'
  },
  
  // 診療支援部
  {
    id: 'medical-support-dept',
    name: '診療支援部',
    type: 'support',
    level: 3,
    parentId: 'director',
    head: { title: '部長' }
  },
  {
    id: 'medical-affairs',
    name: '医事課',
    type: 'support',
    level: 4,
    parentId: 'medical-support-dept',
    head: { title: '課長' },
    subHead: { title: '主任' }
  },
  {
    id: 'medical-records',
    name: '診療情報管理室',
    type: 'support',
    level: 4,
    parentId: 'medical-support-dept',
    head: { title: '室長' }
  },
  
  // 事務部
  {
    id: 'administrative-dept',
    name: '事務部',
    type: 'administrative',
    level: 3,
    parentId: 'admin-director',
    head: { title: '事務長' }
  },
  {
    id: 'general-affairs',
    name: '総務課',
    type: 'administrative',
    level: 4,
    parentId: 'administrative-dept',
    head: { title: '課長' },
    subHead: { title: '主任' }
  },
  {
    id: 'daycare',
    name: '託児室',
    type: 'administrative',
    level: 4,
    parentId: 'administrative-dept'
  },
  
  // 健診部
  {
    id: 'health-checkup-dept',
    name: '健診部',
    type: 'medical',
    level: 3,
    parentId: 'director',
    head: { title: '部長' }
  },
  {
    id: 'health-checkup-room',
    name: '健診室',
    type: 'medical',
    level: 4,
    parentId: 'health-checkup-dept',
    head: { title: '室長' }
  },
  
  // 医療安全管理部門
  {
    id: 'medical-safety-dept',
    name: '医療安全管理部門',
    type: 'safety',
    level: 3,
    parentId: 'director'
  },
  {
    id: 'medical-safety',
    name: '医療安全',
    type: 'safety',
    level: 4,
    parentId: 'medical-safety-dept',
    head: { title: '管理者・責任者' }
  },
  {
    id: 'infection-control',
    name: '感染管理',
    type: 'safety',
    level: 4,
    parentId: 'medical-safety-dept',
    head: { title: '感染管理認定看護師' }
  },
  {
    id: 'drug-safety',
    name: '医薬品安全管理',
    type: 'safety',
    level: 4,
    parentId: 'medical-safety-dept'
  },
  {
    id: 'equipment-safety',
    name: '医療機器安全',
    type: 'safety',
    level: 4,
    parentId: 'medical-safety-dept'
  },
  {
    id: 'radiation-safety',
    name: '医療放射線安全',
    type: 'safety',
    level: 4,
    parentId: 'medical-safety-dept'
  }
];

// 部門タイプごとの色設定
export const departmentColors = {
  executive: 'bg-gradient-to-r from-purple-600 to-purple-700',
  medical: 'bg-gradient-to-r from-blue-600 to-blue-700',
  nursing: 'bg-gradient-to-r from-pink-600 to-pink-700',
  technical: 'bg-gradient-to-r from-green-600 to-green-700',
  administrative: 'bg-gradient-to-r from-orange-600 to-orange-700',
  support: 'bg-gradient-to-r from-cyan-600 to-cyan-700',
  safety: 'bg-gradient-to-r from-red-600 to-red-700'
};

// 部門タイプの日本語名
export const departmentTypeNames = {
  executive: '経営',
  medical: '診療',
  nursing: '看護',
  technical: '技術',
  administrative: '事務',
  support: '支援',
  safety: '安全管理'
};

// 階層構造を構築するヘルパー関数
export function buildHierarchy(departments: Department[]): Department[] {
  const departmentMap = new Map<string, Department>();
  const rootDepartments: Department[] = [];
  
  // マップを作成
  departments.forEach(dept => {
    departmentMap.set(dept.id, { ...dept, children: [] });
  });
  
  // 階層構造を構築
  departments.forEach(dept => {
    const currentDept = departmentMap.get(dept.id)!;
    if (dept.parentId) {
      const parent = departmentMap.get(dept.parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(currentDept);
      }
    } else {
      rootDepartments.push(currentDept);
    }
  });
  
  return rootDepartments;
}

// 特定の部門の全職員数を取得
export function getDepartmentTotalStaff(departmentId: string): number {
  // この関数は実際のスタッフデータと連携して実装する
  // 仮の実装
  const staffCounts: Record<string, number> = {
    'nursing-dept': 150,
    'medical-dept': 45,
    'clinical-tech-dept': 60,
    'pharmacy-dept': 20,
    'administrative-dept': 25,
    // ... その他の部門
  };
  
  return staffCounts[departmentId] || 0;
}

// 部門の検索
export function searchDepartments(query: string): Department[] {
  const lowerQuery = query.toLowerCase();
  return organizationData.filter(dept => 
    dept.name.toLowerCase().includes(lowerQuery) ||
    dept.head?.title.toLowerCase().includes(lowerQuery) ||
    dept.subHead?.title.toLowerCase().includes(lowerQuery)
  );
}

// 特定のタイプの部門を取得
export function getDepartmentsByType(type: Department['type']): Department[] {
  return organizationData.filter(dept => dept.type === type);
}

// 部門の階層パスを取得
export function getDepartmentPath(departmentId: string): Department[] {
  const path: Department[] = [];
  let current: Department | undefined = organizationData.find(d => d.id === departmentId);
  
  while (current) {
    path.unshift(current);
    if (current.parentId) {
      const parentId = current.parentId;
      current = organizationData.find(d => d.id === parentId);
    } else {
      current = undefined;
    }
  }
  
  return path;
}

// TypeScriptの型定義を拡張
declare module './organizationData' {
  interface Department {
    children?: Department[];
  }
}