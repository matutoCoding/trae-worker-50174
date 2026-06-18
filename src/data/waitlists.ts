import { WaitlistItem } from '@/types/waitlist';
import dayjs from 'dayjs';

const today = dayjs();

export const mockWaitlists: WaitlistItem[] = [
  {
    id: 'wl-001',
    stageId: 'stage-001',
    stageName: '主剧场大舞台',
    date: today.add(3, 'day').format('YYYY-MM-DD'),
    startTime: '18:00',
    endTime: '22:00',
    applicant: '华韵艺术团',
    applicantPhone: '138****1111',
    performanceName: '《牡丹亭》昆曲专场',
    priority: 1,
    status: 'waiting',
    createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'wl-002',
    stageId: 'stage-001',
    stageName: '主剧场大舞台',
    date: today.add(3, 'day').format('YYYY-MM-DD'),
    startTime: '18:00',
    endTime: '22:00',
    applicant: '青年舞蹈团',
    applicantPhone: '139****2222',
    performanceName: '《大河之舞》现代舞专场',
    priority: 2,
    status: 'waiting',
    createdAt: dayjs().subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'wl-003',
    stageId: 'stage-003',
    stageName: '音乐厅舞台',
    date: today.add(5, 'day').format('YYYY-MM-DD'),
    startTime: '19:00',
    endTime: '21:00',
    applicant: '钢琴家李明',
    applicantPhone: '137****3333',
    performanceName: '肖邦钢琴独奏音乐会',
    priority: 1,
    status: 'notified',
    createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    notifiedAt: dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'wl-004',
    stageId: 'stage-002',
    stageName: '实验小剧场',
    date: today.add(2, 'day').format('YYYY-MM-DD'),
    startTime: '19:30',
    endTime: '21:30',
    applicant: '独立戏剧工作室',
    applicantPhone: '136****4444',
    performanceName: '原创独角戏《独白》',
    priority: 3,
    status: 'waiting',
    createdAt: dayjs().subtract(6, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'wl-005',
    stageId: 'stage-005',
    stageName: '儿童剧场',
    date: today.add(7, 'day').format('YYYY-MM-DD'),
    startTime: '14:00',
    endTime: '16:00',
    applicant: '童星艺术团',
    applicantPhone: '135****5555',
    performanceName: '儿童音乐剧《白雪公主》',
    priority: 1,
    status: 'confirmed',
    createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
    notifiedAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
  }
];
