export type ApprovalNodeType = 'director' | 'tech_director' | 'theater_manager';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'draft';

export interface ApprovalNode {
  id: string;
  type: ApprovalNodeType;
  name: string;
  role: string;
  status: ApprovalStatus;
  comment?: string;
  operatedAt?: string;
  operator?: string;
}

export interface ApprovalFlow {
  id: string;
  registrationId: string;
  performanceName: string;
  currentNodeIndex: number;
  nodes: ApprovalNode[];
  overallStatus: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
  rejectedFromNode?: ApprovalNodeType;
}

export const NODE_CONFIG: Record<ApprovalNodeType, { name: string; role: string; order: number }> = {
  director: { name: '导演', role: '艺术总监', order: 1 },
  tech_director: { name: '技术总监', role: '技术部门', order: 2 },
  theater_manager: { name: '剧场经理', role: '运营管理', order: 3 }
};
