// 勤怠データの型定義とサンプルデータ

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string | null
  checkOut: string | null
  breakTime: number
  workingHours: number
  overtimeHours: number
  status: 'normal' | 'late' | 'early' | 'absent'
  department: string
  facility: string
}

export interface MonthlyStats {
  employeeId: string
  employeeName: string
  department: string
  facility: string
  workingDays: number
  totalHours: number
  overtimeHours: number
  lateCount: number
  earlyCount: number
  absentCount: number
  leaveUsed: number
}

// 勤怠レコードのサンプルデータ
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'OH-NS-2021-001',
    employeeName: '田中美咲',
    date: '2024-01-15',
    checkIn: '09:00',
    checkOut: '18:00',
    breakTime: 60,
    workingHours: 8,
    overtimeHours: 0,
    status: 'normal',
    department: '3階病棟',
    facility: '小原病院'
  },
  {
    id: '2',
    employeeId: 'OH-PT-2020-015',
    employeeName: '山田健太',
    date: '2024-01-15',
    checkIn: '08:45',
    checkOut: '17:45',
    breakTime: 60,
    workingHours: 8,
    overtimeHours: 0,
    status: 'normal',
    department: '理学療法室',
    facility: '小原病院'
  },
  {
    id: '3',
    employeeId: 'TG-NS-2019-001',
    employeeName: '佐藤花子',
    date: '2024-01-15',
    checkIn: '09:15',
    checkOut: '18:30',
    breakTime: 60,
    workingHours: 8.25,
    overtimeHours: 0.5,
    status: 'late',
    department: '整形外科病棟',
    facility: '立神リハビリテーション温泉病院'
  },
  {
    id: '4',
    employeeId: 'TG-OT-2018-005',
    employeeName: '鈴木一郎',
    date: '2024-01-15',
    checkIn: '08:45',
    checkOut: '17:45',
    breakTime: 60,
    workingHours: 8,
    overtimeHours: 0,
    status: 'early',
    department: '作業療法室',
    facility: '立神リハビリテーション温泉病院'
  }
]

// 月次統計のサンプルデータ
export const monthlyStats: MonthlyStats[] = [
  {
    employeeId: 'OH-NS-2021-001',
    employeeName: '田中美咲',
    department: '3階病棟',
    facility: '小原病院',
    workingDays: 22,
    totalHours: 176,
    overtimeHours: 8,
    lateCount: 0,
    earlyCount: 0,
    absentCount: 0,
    leaveUsed: 2
  },
  {
    employeeId: 'OH-PT-2020-015',
    employeeName: '山田健太',
    department: '理学療法室',
    facility: '小原病院',
    workingDays: 21,
    totalHours: 170,
    overtimeHours: 10,
    lateCount: 1,
    earlyCount: 0,
    absentCount: 0,
    leaveUsed: 3
  },
  {
    employeeId: 'TG-NS-2019-001',
    employeeName: '佐藤花子',
    department: '整形外科病棟',
    facility: '立神リハビリテーション温泉病院',
    workingDays: 21,
    totalHours: 170,
    overtimeHours: 12,
    lateCount: 3,
    earlyCount: 0,
    absentCount: 1,
    leaveUsed: 3
  },
  {
    employeeId: 'TG-OT-2018-005',
    employeeName: '鈴木一郎',
    department: '作業療法室',
    facility: '立神リハビリテーション温泉病院',
    workingDays: 20,
    totalHours: 160,
    overtimeHours: 5,
    lateCount: 0,
    earlyCount: 2,
    absentCount: 0,
    leaveUsed: 4
  }
]

// 職員IDから勤怠記録を取得
export function getAttendanceByStaffId(staffId: string): AttendanceRecord[] {
  return attendanceRecords.filter(record => record.employeeId === staffId)
}

// 職員IDから月次統計を取得
export function getMonthlyStatsByStaffId(staffId: string): MonthlyStats | undefined {
  return monthlyStats.find(stat => stat.employeeId === staffId)
}