export interface Stage {
  id: string;
  name: string;
  description: string;
  capacity: number;
  area: number;
  location: string;
  image: string;
  equipment: string[];
  basePrice: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface ScheduleSlot {
  id: string;
  stageId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'pending' | 'confirmed' | 'released';
  bookingId?: string;
  bookedBy?: string;
  expiresAt?: string;
}

export interface Booking {
  id: string;
  stageId: string;
  stageName: string;
  slotId: string;
  applicant: string;
  applicantPhone: string;
  performanceName: string;
  performanceType: string;
  expectedAudience: number;
  remarks?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'released';
  createdAt: string;
  expiresAt: string;
}
