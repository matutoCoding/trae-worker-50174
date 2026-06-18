import { ApprovalFlow, ApprovalNode, NODE_CONFIG } from '@/types/approval';
import dayjs from 'dayjs';

const createNode = (type: keyof typeof NODE_CONFIG, status: 'pending' | 'approved' | 'rejected' | 'draft' = 'pending', comment?: string): ApprovalNode => {
  const config = NODE_CONFIG[type];
  return {
    id: `node-${type}`,
    type,
    name: config.name,
    role: config.role,
    status,
    comment,
    operatedAt: status !== 'pending' ? dayjs().subtract(Math.random() * 24, 'hour').format('YYYY-MM-DD HH:mm:ss') : undefined,
    operator: status !== 'pending' ? '张三' : undefined
  };
};

export const mockApprovals: ApprovalFlow[] = [
  {
    id: 'apv-001',
    registrationId: 'reg-001',
    performanceName: '《雷雨》经典话剧演出',
    currentNodeIndex: 0,
    nodes: [
      createNode('director', 'pending'),
      createNode('tech_director', 'pending'),
      createNode('theater_manager', 'pending')
    ],
    overallStatus: 'pending',
    createdAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'apv-002',
    registrationId: 'reg-002',
    performanceName: '《等待戈多》实验剧场',
    currentNodeIndex: 1,
    nodes: [
      createNode('director', 'approved', '剧本内容审核通过，艺术水准达标'),
      createNode('tech_director', 'pending'),
      createNode('theater_manager', 'pending')
    ],
    overallStatus: 'pending',
    createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(20, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'apv-003',
    registrationId: 'reg-003',
    performanceName: '肖邦钢琴独奏音乐会',
    currentNodeIndex: 2,
    nodes: [
      createNode('director', 'approved', '曲目安排合理'),
      createNode('tech_director', 'approved', '舞台技术方案已确认，钢琴调音安排妥当'),
      createNode('theater_manager', 'pending')
    ],
    overallStatus: 'pending',
    createdAt: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(6, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'apv-004',
    registrationId: 'reg-004',
    performanceName: '《牡丹亭》昆曲专场',
    currentNodeIndex: 0,
    nodes: [
      createNode('director', 'rejected', '演员阵容需要调整，增加主要角色B角'),
      createNode('tech_director', 'pending'),
      createNode('theater_manager', 'pending')
    ],
    overallStatus: 'rejected',
    rejectedFromNode: 'director',
    createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(10, 'hour').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'apv-005',
    registrationId: 'reg-005',
    performanceName: '儿童音乐剧《白雪公主》',
    currentNodeIndex: 3,
    nodes: [
      createNode('director', 'approved', '适合儿童观看，内容健康积极'),
      createNode('tech_director', 'approved', '灯光音响方案确认'),
      createNode('theater_manager', 'approved', '档期确认，合同已签')
    ],
    overallStatus: 'approved',
    createdAt: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 'apv-006',
    registrationId: 'reg-006',
    performanceName: '《大河之舞》现代舞专场',
    currentNodeIndex: 1,
    nodes: [
      createNode('director', 'approved', '舞蹈编排质量高'),
      createNode('tech_director', 'rejected', '舞台地板要求特殊处理，需增加防滑处理和防护方案'),
      createNode('theater_manager', 'pending')
    ],
    overallStatus: 'rejected',
    rejectedFromNode: 'tech_director',
    createdAt: dayjs().subtract(4, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')
  }
];
