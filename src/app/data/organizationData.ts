// 組織構造データ

// 部門の型定義
export interface Department {
  id: string;
  name: string;
  parentId?: string;
  type: 'main' | 'sub' | 'unit';
  positions?: Position[];
}

// 役職の型定義
export interface Position {
  id: string;
  name: string;
  level: number; // 1: 院長, 2: 部長・総師長, 3: 師長・主任, 4: 一般職員
  departmentId?: string;
}

// 立神リハビリテーション温泉病院の部門データ
export const departments: Department[] = [
  // トップ
  { id: 'top', name: '院長', type: 'main' },
  
  // 診療部門
  { id: 'medical', name: '診療部門', type: 'main' },
  { id: 'medical-office', name: '医局', parentId: 'medical', type: 'sub' },
  { id: 'internal-medicine', name: '内科', parentId: 'medical-office', type: 'unit' },
  { id: 'rehabilitation-medicine', name: 'リハビリテーション科', parentId: 'medical-office', type: 'unit' },
  
  // 看護部門
  { id: 'nursing', name: '看護部門', type: 'main' },
  { id: 'ward-1', name: '第１病棟', parentId: 'nursing', type: 'unit' },
  { id: 'outpatient', name: '外来', parentId: 'nursing', type: 'unit' },
  { id: 'care-facility', name: '介護医療院', parentId: 'nursing', type: 'unit' },
  
  // 診療技術部
  { id: 'medical-tech', name: '診療技術部', type: 'main' },
  { id: 'rehabilitation-dept', name: 'リハビリテーション部門', parentId: 'medical-tech', type: 'sub' },
  { id: 'radiology-dept', name: '放射線部門', parentId: 'medical-tech', type: 'sub' },
  { id: 'laboratory-dept', name: '検査部門', parentId: 'medical-tech', type: 'sub' },
  { id: 'nutrition-dept', name: '栄養部門', parentId: 'medical-tech', type: 'sub' },
  { id: 'pharmacy-dept', name: '薬剤部門', parentId: 'medical-tech', type: 'sub' },
  { id: 'drug-info-room', name: '医薬品情報管理室', parentId: 'pharmacy-dept', type: 'unit' },
  
  // 事務部門
  { id: 'administration', name: '事務部門', type: 'main' },
  { id: 'general-affairs', name: '総務課', parentId: 'administration', type: 'unit' },
  { id: 'medical-affairs', name: '医事課', parentId: 'administration', type: 'unit' },
  { id: 'transport', name: '送迎・車両係', parentId: 'administration', type: 'unit' },
];

// 役職データ
export const positions: Position[] = [
  // レベル1: トップ
  { id: 'director', name: '院長', level: 1 },
  
  // レベル2: 部長級
  { id: 'head-nurse', name: '総師長', level: 2, departmentId: 'nursing' },
  { id: 'deputy-head-nurse', name: '副総師長', level: 2, departmentId: 'nursing' },
  { id: 'admin-director', name: '事務長', level: 2, departmentId: 'administration' },
  { id: 'pharmacy-director', name: '薬局長', level: 2, departmentId: 'pharmacy-dept' },
  
  // レベル3: 師長・主任級
  { id: 'ward-1-nurse-manager', name: '師長', level: 3, departmentId: 'ward-1' },
  { id: 'outpatient-nurse-manager', name: '師長', level: 3, departmentId: 'outpatient' },
  { id: 'care-facility-nurse-manager', name: '師長', level: 3, departmentId: 'care-facility' },
  { id: 'outpatient-chief', name: '主任', level: 3, departmentId: 'outpatient' },
  { id: 'care-facility-chief', name: '主任', level: 3, departmentId: 'care-facility' },
  { id: 'care-facility-care-chief', name: '介護主任', level: 3, departmentId: 'care-facility' },
  { id: 'rehab-supervisor', name: '統括主任', level: 3, departmentId: 'rehabilitation-dept' },
  { id: 'rehab-chief', name: '主任', level: 3, departmentId: 'rehabilitation-dept' },
  { id: 'radiology-chief', name: '主任', level: 3, departmentId: 'radiology-dept' },
  { id: 'laboratory-chief', name: '主任', level: 3, departmentId: 'laboratory-dept' },
  { id: 'general-affairs-chief', name: '主任', level: 3, departmentId: 'general-affairs' },
  { id: 'medical-affairs-chief', name: '主任', level: 3, departmentId: 'medical-affairs' },
  
  // レベル4: 一般職員
  { id: 'doctor', name: '医師', level: 4 },
  { id: 'nurse', name: '看護師', level: 4 },
  { id: 'care-worker', name: '介護職員', level: 4 },
  { id: 'physical-therapist', name: '理学療法士', level: 4 },
  { id: 'occupational-therapist', name: '作業療法士', level: 4 },
  { id: 'speech-therapist', name: '言語聴覚士', level: 4 },
  { id: 'radiographer', name: '診療放射線技師', level: 4 },
  { id: 'lab-technician', name: '臨床検査技師', level: 4 },
  { id: 'dietitian', name: '管理栄養士', level: 4 },
  { id: 'pharmacist', name: '薬剤師', level: 4 },
  { id: 'admin-staff', name: '事務職員', level: 4 },
  { id: 'driver', name: '運転手', level: 4 },
];

// 部門と役職のマッピング
export const departmentPositions: Record<string, string[]> = {
  'top': ['director'],
  'internal-medicine': ['doctor'],
  'rehabilitation-medicine': ['doctor'],
  'nursing': ['head-nurse', 'deputy-head-nurse'],
  'ward-1': ['ward-1-nurse-manager', 'nurse'],
  'outpatient': ['outpatient-nurse-manager', 'outpatient-chief', 'nurse'],
  'care-facility': ['care-facility-nurse-manager', 'care-facility-chief', 'care-facility-care-chief', 'nurse', 'care-worker'],
  'rehabilitation-dept': ['rehab-supervisor', 'rehab-chief', 'physical-therapist', 'occupational-therapist', 'speech-therapist'],
  'radiology-dept': ['radiology-chief', 'radiographer'],
  'laboratory-dept': ['laboratory-chief', 'lab-technician'],
  'nutrition-dept': ['dietitian'],
  'pharmacy-dept': ['pharmacy-director', 'pharmacist'],
  'administration': ['admin-director'],
  'general-affairs': ['general-affairs-chief', 'admin-staff'],
  'medical-affairs': ['medical-affairs-chief', 'admin-staff'],
  'transport': ['driver'],
};

// ヘルパー関数：部門IDから利用可能な役職を取得
export function getPositionsForDepartment(departmentId: string): Position[] {
  const positionIds = departmentPositions[departmentId] || [];
  return positions.filter(pos => positionIds.includes(pos.id));
}

// ヘルパー関数：部門の階層構造を取得
export function getDepartmentHierarchy(): Department[] {
  const topLevel = departments.filter(d => !d.parentId);
  
  const addChildren = (parent: Department): Department => {
    const children = departments.filter(d => d.parentId === parent.id);
    return {
      ...parent,
      children: children.map(child => addChildren(child))
    };
  };
  
  return topLevel.map(dept => addChildren(dept));
}

// 部門の型定義（子要素含む）
export interface DepartmentWithChildren extends Department {
  children?: DepartmentWithChildren[];
}