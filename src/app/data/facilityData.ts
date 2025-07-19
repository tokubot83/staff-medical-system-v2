// 施設データの型定義
export interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  beds?: number;
  departments?: string[];
  specialFeatures?: string[];
  staffCount: number;
}

// 施設データ
export const facilities: Facility[] = [
  // 小原病院
  {
    id: 'obara-hospital',
    name: '医療法人 厚生会 小原病院',
    type: '急性期病院',
    location: '〒898-0003 鹿児島県枕崎市折口町109番地',
    beds: 118,
    departments: [
      '脳神経外科', '外科', '泌尿器科', '整形外科', '消化器外科', '消化器内科',
      '循環器内科', '糖尿病内科', '神経内科', '腎臓内科（人工透析）',
      '循環器外科', '呼吸器外科', '婦人科', '放射線科', 'リハビリテーション科',
      '肛門科', '麻酔科'
    ],
    specialFeatures: ['24時間救急医療', '脳卒中センター', '人間ドック（一般・脳・肺）'],
    staffCount: 420
  },
  
  // 立神リハビリテーション温泉病院
  {
    id: 'tachigami-hospital',
    name: '立神リハビリテーション温泉病院',
    type: '慢性期・リハビリテーション病院',
    location: '〒898-0048 鹿児島県枕崎市火之神町620番地',
    beds: 110,
    departments: ['内科', 'リハビリテーション科'],
    specialFeatures: ['医療療養病床', '介護医療院', '慢性期医療', '医療・介護・福祉の連携'],
    staffCount: 180
  }
];

// 施設ごとのスタッフ分布データ
export const facilityStaffDistribution = {
  'obara-hospital': {
    doctors: 45,
    nurses: 180,
    pharmacists: 15,
    therapists: 40,
    technicians: 65,
    administrative: 50,
    support: 25
  },
  'tachigami-hospital': {
    doctors: 8,
    nurses: 65,
    pharmacists: 5,
    therapists: 35,
    technicians: 12,
    careWorkers: 35,
    administrative: 20
  }
};

// 施設ごとの部門構成
export const facilityDepartmentStructure = {
  'obara-hospital': {
    executive: ['院長', '副院長', '事務長'],
    medical: [
      '医局長',
      '脳神経外科部長', '外科部長', '循環器内科部長', '消化器内科部長',
      '放射線科部長', 'リハビリテーション科部長'
    ],
    nursing: ['看護部長', '教育師長', '各病棟師長', '外来師長', '人工透析室長'],
    technical: [
      '診療技術部長',
      '診療放射線科長', '臨床検査科長', '栄養科長',
      '臨床工学科長', 'リハビリテーション科長'
    ],
    support: ['入退院支援部長', '地域医療連携室長'],
    administrative: ['事務部（事務長兼任）', '総務課長', '医事課長']
  },
  'tachigami-hospital': {
    executive: ['院長'],
    medical: ['内科', 'リハビリテーション科'],
    nursing: ['総師長', '副総師長', '第１病棟師長', '外来師長', '介護医療院師長'],
    technical: [
      'リハビリテーション部門統括主任',
      '放射線部門主任', '検査部門主任', '栄養部門', '薬局長'
    ],
    administrative: ['事務長', '総務課主任', '医事課主任']
  }
};

// ヘルパー関数：施設IDから施設情報を取得
export function getFacilityById(facilityId: string): Facility | undefined {
  return facilities.find(f => f.id === facilityId);
}

// ヘルパー関数：施設名から施設情報を取得
export function getFacilityByName(facilityName: string): Facility | undefined {
  return facilities.find(f => f.name === facilityName);
}

// ヘルパー関数：施設タイプごとの施設を取得
export function getFacilitiesByType(type: string): Facility[] {
  return facilities.filter(f => f.type === type);
}

// ヘルパー関数：全施設の総スタッフ数を取得
export function getTotalStaffCount(): number {
  return facilities.reduce((total, facility) => total + facility.staffCount, 0);
}

// ヘルパー関数：全施設の総病床数を取得
export function getTotalBedCount(): number {
  return facilities.reduce((total, facility) => total + (facility.beds || 0), 0);
}