// 立神リハビリテーション温泉病院 組織データ

import { Department } from './organizationData';

export const tachigamiOrganizationData: Department[] = [
  // 経営層
  {
    id: 'tachigami-director',
    name: '院長',
    type: 'executive',
    level: 1,
    head: { title: '院長' }
  },
  
  // 診療部門
  {
    id: 'tachigami-medical',
    name: '診療部門',
    type: 'medical',
    level: 2,
    parentId: 'tachigami-director'
  },
  {
    id: 'tachigami-medical-office',
    name: '医局',
    type: 'medical',
    level: 3,
    parentId: 'tachigami-medical'
  },
  {
    id: 'tachigami-internal-medicine',
    name: '内科',
    type: 'medical',
    level: 4,
    parentId: 'tachigami-medical-office'
  },
  {
    id: 'tachigami-rehabilitation-medicine',
    name: 'リハビリテーション科',
    type: 'medical',
    level: 4,
    parentId: 'tachigami-medical-office'
  },
  
  // 看護部門
  {
    id: 'tachigami-nursing',
    name: '看護部門',
    type: 'nursing',
    level: 2,
    parentId: 'tachigami-director'
  },
  {
    id: 'tachigami-head-nurse',
    name: '総師長',
    type: 'nursing',
    level: 3,
    parentId: 'tachigami-nursing',
    head: { title: '総師長' }
  },
  {
    id: 'tachigami-deputy-head-nurse',
    name: '副総師長',
    type: 'nursing',
    level: 3,
    parentId: 'tachigami-nursing',
    head: { title: '副総師長' }
  },
  {
    id: 'tachigami-ward-1',
    name: '第１病棟',
    type: 'nursing',
    level: 4,
    parentId: 'tachigami-nursing',
    head: { title: '師長' },
    subHead: { title: '主任' }
  },
  {
    id: 'tachigami-outpatient',
    name: '外来',
    type: 'nursing',
    level: 4,
    parentId: 'tachigami-nursing',
    head: { title: '師長' },
    subHead: { title: '主任' }
  },
  {
    id: 'tachigami-care-facility',
    name: '介護医療院',
    type: 'nursing',
    level: 4,
    parentId: 'tachigami-nursing',
    head: { title: '師長' },
    subHead: { title: '主任' }
  },
  
  // 診療技術部
  {
    id: 'tachigami-clinical-tech',
    name: '診療技術部',
    type: 'technical',
    level: 2,
    parentId: 'tachigami-director'
  },
  {
    id: 'tachigami-rehabilitation-dept',
    name: 'リハビリテーション部門',
    type: 'technical',
    level: 3,
    parentId: 'tachigami-clinical-tech',
    head: { title: '統括主任' },
    subHead: { title: '主任' }
  },
  {
    id: 'tachigami-radiology-dept',
    name: '放射線部門',
    type: 'technical',
    level: 3,
    parentId: 'tachigami-clinical-tech',
    head: { title: '主任' }
  },
  {
    id: 'tachigami-laboratory-dept',
    name: '検査部門',
    type: 'technical',
    level: 3,
    parentId: 'tachigami-clinical-tech',
    head: { title: '主任' }
  },
  {
    id: 'tachigami-nutrition-dept',
    name: '栄養部門',
    type: 'technical',
    level: 3,
    parentId: 'tachigami-clinical-tech'
  },
  {
    id: 'tachigami-pharmacy-dept',
    name: '薬剤部門',
    type: 'medical',
    level: 3,
    parentId: 'tachigami-clinical-tech',
    head: { title: '薬局長' }
  },
  {
    id: 'tachigami-drug-info',
    name: '医薬品情報管理室',
    type: 'medical',
    level: 4,
    parentId: 'tachigami-pharmacy-dept'
  },
  
  // 事務部門
  {
    id: 'tachigami-administration',
    name: '事務部門',
    type: 'administrative',
    level: 2,
    parentId: 'tachigami-director'
  },
  {
    id: 'tachigami-admin-director',
    name: '事務長',
    type: 'administrative',
    level: 3,
    parentId: 'tachigami-administration',
    head: { title: '事務長' }
  },
  {
    id: 'tachigami-general-affairs',
    name: '総務課',
    type: 'administrative',
    level: 4,
    parentId: 'tachigami-administration',
    head: { title: '主任' }
  },
  {
    id: 'tachigami-medical-affairs',
    name: '医事課',
    type: 'administrative',
    level: 4,
    parentId: 'tachigami-administration',
    head: { title: '主任' }
  },
  {
    id: 'tachigami-transport',
    name: '送迎・車両係',
    type: 'administrative',
    level: 4,
    parentId: 'tachigami-administration'
  }
];

// 立神病院用の部門IDマッピング（小原病院形式から立神病院形式へ）
export const tachigamiDepartmentMapping: Record<string, string> = {
  // 看護部門
  '第１病棟': 'tachigami-ward-1',
  '外来': 'tachigami-outpatient',
  '介護医療院': 'tachigami-care-facility',
  
  // 診療部門
  '内科': 'tachigami-internal-medicine',
  'リハビリテーション科': 'tachigami-rehabilitation-medicine',
  
  // 技術部門
  'リハビリテーション部門': 'tachigami-rehabilitation-dept',
  '放射線部門': 'tachigami-radiology-dept',
  '検査部門': 'tachigami-laboratory-dept',
  '栄養部門': 'tachigami-nutrition-dept',
  '薬剤部門': 'tachigami-pharmacy-dept',
  
  // 事務部門
  '総務課': 'tachigami-general-affairs',
  '医事課': 'tachigami-medical-affairs',
  '送迎・車両係': 'tachigami-transport'
};

// 立神病院の役職定義
export const tachigamiPositions = {
  executive: ['院長'],
  nursing: ['総師長', '副総師長', '師長', '主任', '介護主任', '看護師', '介護職員'],
  medical: ['医師', '薬局長', '薬剤師'],
  technical: ['統括主任', '主任', '理学療法士', '作業療法士', '言語聴覚士', '診療放射線技師', '臨床検査技師', '管理栄養士'],
  administrative: ['事務長', '主任', '事務職員', '運転手']
};