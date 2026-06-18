export interface EquipmentItem {
  id: string;
  name: string;
  category: 'lighting' | 'sound' | 'video' | 'stage';
  quantity: number;
  unit: string;
  specifications?: string;
}

export interface Registration {
  id: string;
  performanceName: string;
  performanceType: string;
  organizer: string;
  contactPerson: string;
  contactPhone: string;
  performanceDate: string;
  startTime: string;
  endTime: string;
  stageId: string;
  stageName: string;
  expectedAudience: number;
  performanceContent: string;
  equipmentList: EquipmentItem[];
  specialRequirements?: string;
  approvalFlowId?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export const EQUIPMENT_CATEGORIES = [
  { key: 'lighting', label: '灯光设备' },
  { key: 'sound', label: '音响设备' },
  { key: 'video', label: '视频设备' },
  { key: 'stage', label: '舞台道具' }
] as const;
