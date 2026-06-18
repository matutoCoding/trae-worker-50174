import { create } from 'zustand';
import { Stage, ScheduleSlot, Booking } from '@/types/stage';
import { WaitlistItem } from '@/types/waitlist';
import { ApprovalFlow } from '@/types/approval';
import { Registration } from '@/types/registration';
import { mockScheduleSlots, mockBookings } from '@/data/schedules';
import { mockStages } from '@/data/stages';
import { mockWaitlists } from '@/data/waitlists';
import { mockApprovals } from '@/data/approvals';
import { mockRegistrations } from '@/data/registrations';

interface AppState {
  stages: Stage[];
  scheduleSlots: ScheduleSlot[];
  bookings: Booking[];
  waitlists: WaitlistItem[];
  approvals: ApprovalFlow[];
  registrations: Registration[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addWaitlist: (item: WaitlistItem) => void;
  approveNode: (approvalId: string, nodeIndex: number) => void;
  rejectNode: (approvalId: string, nodeIndex: number, comment: string) => void;
  addRegistration: (reg: Registration) => void;
}

export const useAppStore = create<AppState>((set) => ({
  stages: mockStages,
  scheduleSlots: mockScheduleSlots,
  bookings: mockBookings,
  waitlists: mockWaitlists,
  approvals: mockApprovals,
  registrations: mockRegistrations,
  selectedDate: new Date().toISOString().split('T')[0],
  setSelectedDate: (date: string) => set({ selectedDate: date }),
  addWaitlist: (item: WaitlistItem) =>
    set((state) => ({ waitlists: [...state.waitlists, item] })),
  approveNode: (approvalId: string, nodeIndex: number) =>
    set((state) => {
      const approvals = state.approvals.map((a) => {
        if (a.id !== approvalId) return a;
        const nodes = a.nodes.map((n, idx) => {
          if (idx !== nodeIndex) return n;
          return { ...n, status: 'approved' as const, operatedAt: new Date().toISOString(), operator: '当前用户' };
        });
        const allApproved = nodes.every((n) => n.status === 'approved');
        const nextIndex = nodeIndex + 1;
        return {
          ...a,
          nodes,
          currentNodeIndex: allApproved ? 3 : nextIndex,
          overallStatus: allApproved ? 'approved' : 'pending',
          updatedAt: new Date().toISOString()
        };
      });
      return { approvals };
    }),
  rejectNode: (approvalId: string, nodeIndex: number, comment: string) =>
    set((state) => {
      const approvals = state.approvals.map((a) => {
        if (a.id !== approvalId) return a;
        const nodes = a.nodes.map((n, idx) => {
          if (idx !== nodeIndex) return n;
          return { ...n, status: 'rejected' as const, comment, operatedAt: new Date().toISOString(), operator: '当前用户' };
        });
        return {
          ...a,
          nodes,
          overallStatus: 'rejected',
          rejectedFromNode: nodes[nodeIndex].type,
          updatedAt: new Date().toISOString()
        };
      });
      return { approvals };
    }),
  addRegistration: (reg: Registration) =>
    set((state) => ({ registrations: [...state.registrations, reg] }))
}));
