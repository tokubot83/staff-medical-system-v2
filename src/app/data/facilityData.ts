// 施設データの型定義
export interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  beds?: number;
  departments?: string[];
  staffCount: number;
}

// 施設データ
export const facilities: Facility[] = [
  {
    id: 'hosp-main',
    name: '厚生会中央病院',
    type: '急性期病院',
    location: '東京都渋谷区',
    beds: 320,
    departments: ['内科', '外科', 'ICU', '小児科', '整形外科', '産婦人科'],
    staffCount: 450
  },
  {
    id: 'hosp-regional',
    name: '厚生会地域医療センター',
    type: '地域包括ケア病院',
    location: '東京都世田谷区',
    beds: 180,
    departments: ['内科', '外科', 'リハビリテーション科', '地域包括ケア病棟'],
    staffCount: 280
  },
  {
    id: 'clinic-1',
    name: '厚生会クリニック渋谷',
    type: 'クリニック',
    location: '東京都渋谷区',
    departments: ['内科', '外科', '整形外科'],
    staffCount: 45
  },
  {
    id: 'clinic-2',
    name: '厚生会クリニック世田谷',
    type: 'クリニック',
    location: '東京都世田谷区',
    departments: ['内科', '小児科', '皮膚科'],
    staffCount: 38
  },
  {
    id: 'care-home',
    name: '厚生会ケアホーム',
    type: '介護施設',
    location: '東京都杉並区',
    beds: 100,
    staffCount: 120
  }
];

// 施設ごとのスタッフ分布データ（デモ用）
export const facilityStaffDistribution = {
  'hosp-main': {
    doctors: 85,
    nurses: 220,
    pharmacists: 25,
    therapists: 35,
    technicians: 45,
    administrative: 40
  },
  'hosp-regional': {
    doctors: 45,
    nurses: 140,
    pharmacists: 15,
    therapists: 30,
    technicians: 25,
    administrative: 25
  },
  'clinic-1': {
    doctors: 12,
    nurses: 20,
    pharmacists: 3,
    therapists: 5,
    administrative: 5
  },
  'clinic-2': {
    doctors: 10,
    nurses: 18,
    pharmacists: 2,
    therapists: 3,
    administrative: 5
  },
  'care-home': {
    doctors: 5,
    nurses: 45,
    careWorkers: 50,
    therapists: 10,
    administrative: 10
  }
};