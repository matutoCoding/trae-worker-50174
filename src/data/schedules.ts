import { ScheduleSlot, Booking } from '@/types/stage';
import dayjs from 'dayjs';

const generateDateSlots = (stageId: string, dateStr: string): ScheduleSlot[] => {
  const slots: ScheduleSlot[] = [];
  const times = [
    { start: '09:00', end: '12:00' },
    { start: '13:00', end: '17:00' },
    { start: '18:00', end: '22:00' }
  ];
  const statuses: Array<'available' | 'pending' | 'confirmed' | 'released'> = [
    'available', 'available', 'pending', 'confirmed', 'available', 'released'
  ];

  times.forEach((time, idx) => {
    const randIdx = (Math.floor(Math.random() * 10) + idx) % statuses.length;
    const status = statuses[randIdx];
    const slot: ScheduleSlot = {
      id: `${stageId}-${dateStr}-${idx}`,
      stageId,
      date: dateStr,
      startTime: time.start,
      endTime: time.end,
      status
    };
    if (status === 'pending' || status === 'confirmed') {
      slot.bookedBy = '某演出团体';
      slot.expiresAt = dayjs().add(2, 'hour').format('YYYY-MM-DD HH:mm:ss');
    }
    slots.push(slot);
  });
  return slots;
};

const today = dayjs();
export const mockScheduleSlots: ScheduleSlot[] = [
  ...generateDateSlots('stage-001', today.format('YYYY-MM-DD')),
  ...generateDateSlots('stage-001', today.add(1, 'day').format('YYYY-MM-DD')),
  ...generateDateSlots('stage-002', today.format('YYYY-MM-DD')),
  ...generateDateSlots('stage-002', today.add(1, 'day').format('YYYY-MM-DD')),
  ...generateDateSlots('stage-003', today.format('YYYY-MM-DD')),
  ...generateDateSlots('stage-003', today.add(1, 'day').format('YYYY-MM-DD'))
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-001',
    stageId: 'stage-001',
    stageName: '主剧场大舞台',
    slotId: 'stage-001-2026-06-18-2',
    applicant: '星辰话剧社',
    applicantPhone: '138****6789',
    performanceName: '《雷雨》经典话剧演出',
    performanceType: '话剧',
    expectedAudience: 1000,
    remarks: '需要使用升降台和旋转舞台',
    status: 'pending',
    createdAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    expiresAt: dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'booking-002',
    stageId: 'stage-002',
    stageName: '实验小剧场',
    slotId: 'stage-002-2026-06-18-1',
    applicant: '先锋艺术工作室',
    applicantPhone: '139****1234',
    performanceName: '《等待戈多》实验剧场',
    performanceType: '先锋戏剧',
    expectedAudience: 150,
    status: 'confirmed',
    createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    expiresAt: dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'booking-003',
    stageId: 'stage-003',
    stageName: '音乐厅舞台',
    slotId: 'stage-003-2026-06-18-0',
    applicant: '爱乐交响乐团',
    applicantPhone: '137****5678',
    performanceName: '舒伯特作品专场音乐会',
    performanceType: '音乐会',
    expectedAudience: 450,
    status: 'released',
    createdAt: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    expiresAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
  }
];
