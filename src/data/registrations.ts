import { Registration, EquipmentItem } from '@/types/registration';
import dayjs from 'dayjs';

const lightingEquipments: EquipmentItem[] = [
  { id: 'eq-1', name: '摇头染色灯', category: 'lighting', quantity: 24, unit: '台', specifications: 'LED 250W' },
  { id: 'eq-2', name: '成像灯', category: 'lighting', quantity: 16, unit: '台', specifications: '750W' },
  { id: 'eq-3', name: '追光灯', category: 'lighting', quantity: 2, unit: '台', specifications: '2500W' }
];

const soundEquipments: EquipmentItem[] = [
  { id: 'eq-4', name: '线阵音箱', category: 'sound', quantity: 8, unit: '只', specifications: '双10寸' },
  { id: 'eq-5', name: '低音炮', category: 'sound', quantity: 4, unit: '只', specifications: '双18寸' },
  { id: 'eq-6', name: '无线手持话筒', category: 'sound', quantity: 8, unit: '套' },
  { id: 'eq-7', name: '调音台', category: 'sound', quantity: 1, unit: '台', specifications: '32路数字' }
];

const videoEquipments: EquipmentItem[] = [
  { id: 'eq-8', name: 'LED主屏幕', category: 'video', quantity: 1, unit: '块', specifications: 'P3.9 6m×4m' },
  { id: 'eq-9', name: '侧屏', category: 'video', quantity: 2, unit: '块', specifications: 'P3.9 3m×4m' }
];

const stageEquipments: EquipmentItem[] = [
  { id: 'eq-10', name: '升降台', category: 'stage', quantity: 1, unit: '套', specifications: '4m×6m' },
  { id: 'eq-11', name: '旋转舞台', category: 'stage', quantity: 1, unit: '套', specifications: '直径8m' }
];

export const mockRegistrations: Registration[] = [
  {
    id: 'reg-001',
    performanceName: '《雷雨》经典话剧演出',
    performanceType: '话剧',
    organizer: '星辰话剧社',
    contactPerson: '王导演',
    contactPhone: '138****6789',
    performanceDate: dayjs().add(14, 'day').format('YYYY-MM-DD'),
    startTime: '19:30',
    endTime: '22:00',
    stageId: 'stage-001',
    stageName: '主剧场大舞台',
    expectedAudience: 1000,
    performanceContent: '经典话剧《雷雨》演出，包含两幕八场，时长约150分钟（含中场休息15分钟）。',
    equipmentList: [...lightingEquipments, ...soundEquipments, ...stageEquipments],
    specialRequirements: '需要使用升降台和旋转舞台，后台需提供化妆间3间',
    approvalFlowId: 'apv-001',
    status: 'pending',
    createdAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'reg-002',
    performanceName: '《等待戈多》实验剧场',
    performanceType: '先锋戏剧',
    organizer: '先锋艺术工作室',
    contactPerson: '李导演',
    contactPhone: '139****1234',
    performanceDate: dayjs().add(10, 'day').format('YYYY-MM-DD'),
    startTime: '19:30',
    endTime: '21:30',
    stageId: 'stage-002',
    stageName: '实验小剧场',
    expectedAudience: 150,
    performanceContent: '贝克特经典荒诞派戏剧《等待戈多》，全剧两幕，约100分钟（无中场休息）。',
    equipmentList: [...lightingEquipments.slice(0, 2), ...soundEquipments.slice(2, 5)],
    approvalFlowId: 'apv-002',
    status: 'pending',
    createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(20, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'reg-003',
    performanceName: '肖邦钢琴独奏音乐会',
    performanceType: '音乐会',
    organizer: '钢琴家李明',
    contactPerson: '经纪人张',
    contactPhone: '137****5678',
    performanceDate: dayjs().add(20, 'day').format('YYYY-MM-DD'),
    startTime: '19:30',
    endTime: '21:30',
    stageId: 'stage-003',
    stageName: '音乐厅舞台',
    expectedAudience: 450,
    performanceContent: '肖邦钢琴作品专场，包含叙事曲、夜曲、圆舞曲等代表作，约90分钟（含中场休息15分钟）。',
    equipmentList: [
      { id: 'eq-piano', name: '斯坦威三角钢琴', category: 'stage', quantity: 1, unit: '台', specifications: 'D-274' },
      { id: 'eq-mic', name: '电容话筒', category: 'sound', quantity: 4, unit: '支', specifications: 'Neumann U87' }
    ],
    specialRequirements: '演出前2天钢琴调音，音乐厅需保持恒温恒湿',
    approvalFlowId: 'apv-003',
    status: 'pending',
    createdAt: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(6, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'reg-004',
    performanceName: '《牡丹亭》昆曲专场',
    performanceType: '戏曲',
    organizer: '华韵艺术团',
    contactPerson: '赵团长',
    contactPhone: '138****1111',
    performanceDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
    startTime: '19:00',
    endTime: '22:00',
    stageId: 'stage-001',
    stageName: '主剧场大舞台',
    expectedAudience: 800,
    performanceContent: '昆曲经典《牡丹亭》全本演出，上本《游园惊梦》下本《还魂记》，约180分钟（含两次中场休息）。',
    equipmentList: [...lightingEquipments, ...soundEquipments, ...videoEquipments],
    specialRequirements: '需要提供戏曲乐队乐池，舞台需铺设地毯',
    approvalFlowId: 'apv-004',
    status: 'rejected',
    createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(10, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'reg-005',
    performanceName: '儿童音乐剧《白雪公主》',
    performanceType: '儿童剧',
    organizer: '童星艺术团',
    contactPerson: '孙团长',
    contactPhone: '135****5555',
    performanceDate: dayjs().add(45, 'day').format('YYYY-MM-DD'),
    startTime: '14:00',
    endTime: '16:00',
    stageId: 'stage-005',
    stageName: '儿童剧场',
    expectedAudience: 350,
    performanceContent: '经典童话改编儿童音乐剧《白雪公主》，适合3-12岁儿童观看，约90分钟（含互动环节）。',
    equipmentList: [
      ...lightingEquipments.slice(0, 2),
      ...soundEquipments.slice(0, 3),
      { id: 'eq-12', name: '彩色效果灯', category: 'lighting', quantity: 12, unit: '台' },
      { id: 'eq-13', name: '泡泡机', category: 'stage', quantity: 4, unit: '台' },
      { id: 'eq-14', name: '烟雾机', category: 'stage', quantity: 2, unit: '台' }
    ],
    approvalFlowId: 'apv-005',
    status: 'approved',
    createdAt: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss')
  }
];
