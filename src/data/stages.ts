import { Stage } from '@/types/stage';

export const mockStages: Stage[] = [
  {
    id: 'stage-001',
    name: '主剧场大舞台',
    description: '剧场最大的专业演出舞台，配备专业灯光音响系统，适合大型话剧、音乐剧、交响音乐会等演出。',
    capacity: 1200,
    area: 800,
    location: '剧场A区一层',
    image: 'https://picsum.photos/id/1082/750/500',
    equipment: ['专业升降台', '旋转舞台', 'LED大屏', '专业灯光系统'],
    basePrice: 15000,
    status: 'available'
  },
  {
    id: 'stage-002',
    name: '实验小剧场',
    description: '小型多功能实验剧场，适合先锋戏剧、小剧场话剧、独立音乐演出等。',
    capacity: 200,
    area: 200,
    location: '剧场B区二层',
    image: 'https://picsum.photos/id/787/750/500',
    equipment: ['基础灯光', '基础音响', '可移动座椅'],
    basePrice: 3000,
    status: 'available'
  },
  {
    id: 'stage-003',
    name: '音乐厅舞台',
    description: '专业音乐厅设计，声学效果极佳，适合独奏音乐会、室内乐、合唱等演出。',
    capacity: 500,
    area: 350,
    location: '剧场C区一层',
    image: 'https://picsum.photos/id/1080/750/500',
    equipment: ['专业声学处理', '斯坦威钢琴', '合唱台阶'],
    basePrice: 8000,
    status: 'occupied'
  },
  {
    id: 'stage-004',
    name: '多功能演播厅',
    description: '可变换布局的多功能演播空间，适合发布会、小型演出、录制节目等。',
    capacity: 300,
    area: 400,
    location: '剧场D区三层',
    image: 'https://picsum.photos/id/103/750/500',
    equipment: ['摄像系统', '直播设备', '可变换座椅布局'],
    basePrice: 6000,
    status: 'maintenance'
  },
  {
    id: 'stage-005',
    name: '儿童剧场',
    description: '专为儿童演出设计的剧场，色彩明亮，设施安全，适合儿童剧、亲子活动。',
    capacity: 400,
    area: 300,
    location: '剧场E区一层',
    image: 'https://picsum.photos/id/225/750/500',
    equipment: ['儿童安全护栏', '彩色灯光', '互动投影'],
    basePrice: 5000,
    status: 'available'
  },
  {
    id: 'stage-006',
    name: '户外露天舞台',
    description: '露天广场舞台，适合露天音乐会、节庆活动、大型文化活动。',
    capacity: 3000,
    area: 1500,
    location: '剧场南广场',
    image: 'https://picsum.photos/id/1039/750/500',
    equipment: ['户外防雨棚', '线阵音响', '大功率灯光'],
    basePrice: 20000,
    status: 'available'
  }
];
