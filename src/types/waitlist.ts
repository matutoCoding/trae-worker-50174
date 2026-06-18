export interface WaitlistItem {
  id: string;
  stageId: string;
  stageName: string;
  date: string;
  startTime: string;
  endTime: string;
  applicant: string;
  applicantPhone: string;
  performanceName: string;
  priority: number;
  status: 'waiting' | 'notified' | 'confirmed' | 'cancelled';
  createdAt: string;
  notifiedAt?: string;
}
