import { create } from 'zustand';
import dayjs from 'dayjs';
import { Stage, ScheduleSlot, Booking } from '@/types/stage';
import { WaitlistItem } from '@/types/waitlist';
import { ApprovalFlow, ApprovalNode, NODE_CONFIG, ApprovalNodeType } from '@/types/approval';
import { Registration } from '@/types/registration';
import { mockScheduleSlots, mockBookings } from '@/data/schedules';
import { mockStages } from '@/data/stages';
import { mockWaitlists } from '@/data/waitlists';
import { mockApprovals } from '@/data/approvals';
import { mockRegistrations } from '@/data/registrations';
import { generateId, formatDateTime } from '@/utils';

const createEmptyApprovalNodes = (): ApprovalNode[] => {
  return (Object.keys(NODE_CONFIG) as ApprovalNodeType[]).map((type) => ({
    id: `node-${type}-${Date.now()}`,
    type,
    name: NODE_CONFIG[type].name,
    role: NODE_CONFIG[type].role,
    status: 'pending' as const
  }));
};

const createApprovalFlow = (reg: Registration): ApprovalFlow => {
  return {
    id: generateId('apv'),
    registrationId: reg.id,
    performanceName: reg.performanceName,
    currentNodeIndex: 0,
    nodes: createEmptyApprovalNodes(),
    overallStatus: 'pending',
    createdAt: formatDateTime(new Date().toISOString()),
    updatedAt: formatDateTime(new Date().toISOString())
  };
};

interface AppState {
  stages: Stage[];
  scheduleSlots: ScheduleSlot[];
  bookings: Booking[];
  waitlists: WaitlistItem[];
  approvals: ApprovalFlow[];
  registrations: Registration[];
  selectedDate: string;

  setSelectedDate: (date: string) => void;

  // 档期预约
  bookSlot: (slotId: string, stageId: string, applicant: string, phone: string, performanceName: string) => Booking | null;
  checkAndReleaseExpiredSlots: () => number;

  // 候补
  addWaitlist: (item: WaitlistItem) => void;
  confirmWaitlist: (waitlistId: string) => void;
  cancelWaitlist: (waitlistId: string) => void;

  // 审批
  approveNode: (approvalId: string, nodeIndex: number) => void;
  rejectNode: (approvalId: string, nodeIndex: number, comment: string) => void;
  resubmitApproval: (approvalId: string) => void;

  // 报批
  saveDraft: (reg: Registration) => void;
  submitApproval: (reg: Registration) => void;
  addRegistration: (reg: Registration) => void;
  updateRegistrationAndResumeApproval: (reg: Registration, approvalId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  stages: mockStages,
  scheduleSlots: mockScheduleSlots,
  bookings: mockBookings,
  waitlists: mockWaitlists,
  approvals: mockApprovals,
  registrations: mockRegistrations,
  selectedDate: dayjs().format('YYYY-MM-DD'),

  setSelectedDate: (date: string) => set({ selectedDate: date }),

  // ========== 1. 档期预约 ==========
  bookSlot: (slotId, stageId, applicant, phone, performanceName) => {
    const state = get();
    const slot = state.scheduleSlots.find((s) => s.id === slotId);
    const stage = state.stages.find((s) => s.id === stageId);
    if (!slot || slot.status !== 'available' || !stage) return null;

    const booking: Booking = {
      id: generateId('booking'),
      stageId,
      stageName: stage.name,
      slotId,
      applicant,
      applicantPhone: phone,
      performanceName,
      performanceType: '演出',
      expectedAudience: 100,
      status: 'pending',
      createdAt: formatDateTime(new Date().toISOString()),
      expiresAt: dayjs().add(2, 'hour').format('YYYY-MM-DD HH:mm:ss')
    };

    set((state) => ({
      bookings: [...state.bookings, booking],
      scheduleSlots: state.scheduleSlots.map((s) =>
        s.id === slotId
          ? {
              ...s,
              status: 'pending',
              bookedBy: applicant,
              bookingId: booking.id,
              expiresAt: booking.expiresAt
            }
          : s
      )
    }));

    console.log('[Store] 预约成功:', booking);
    return booking;
  },

  checkAndReleaseExpiredSlots: () => {
    const state = get();
    const now = dayjs();
    const expiredSlots = state.scheduleSlots.filter(
      (s) =>
        s.status === 'pending' && s.expiresAt && now.isAfter(dayjs(s.expiresAt))
    );

    if (expiredSlots.length === 0) return 0;

    console.log(`[Store] 发现 ${expiredSlots.length} 个超时档期，准备释放并通知候补`);

    let { scheduleSlots, waitlists, bookings } = state;

    expiredSlots.forEach((slot) => {
      scheduleSlots = scheduleSlots.map((s) =>
        s.id === slot.id
          ? {
              ...s,
              status: 'available' as const,
              bookedBy: undefined,
              bookingId: undefined,
              expiresAt: undefined
            }
          : s
      );
      bookings = bookings.map((b) =>
        b.slotId === slot.id ? { ...b, status: 'cancelled' as const } : b
      );

      const nextInQueue = waitlists
        .filter(
          (w) =>
            w.stageId === slot.stageId &&
            w.date === slot.date &&
            w.startTime === slot.startTime &&
            w.status === 'waiting'
        )
        .sort((a, b) => a.priority - b.priority)[0];

      if (nextInQueue) {
        waitlists = waitlists.map((w) =>
          w.id === nextInQueue.id
            ? {
                ...w,
                status: 'notified' as const,
                notifiedAt: formatDateTime(new Date().toISOString())
              }
            : w
        );
        console.log(`[Store] 自动通知候补：${nextInQueue.id}（第${nextInQueue.priority}位）`);
      }
    });

    set({ scheduleSlots, waitlists, bookings });
    return expiredSlots.length;
  },

  // ========== 2. 候补 ==========
  addWaitlist: (item) =>
    set((state) => {
      const sameSlotItems = state.waitlists.filter(
        (w) => w.stageId === item.stageId && w.date === item.date && w.startTime === item.startTime && w.status === 'waiting'
      );
      const newPriority = sameSlotItems.length + 1;
      return {
        waitlists: [...state.waitlists, { ...item, priority: newPriority }]
      };
    }),

  confirmWaitlist: (waitlistId) => {
    console.log('[Store] 确认补位:', waitlistId);
    set((state) => {
      const item = state.waitlists.find((w) => w.id === waitlistId);
      if (!item) return state;

      const sameSlotItems = state.waitlists.filter(
        (w) =>
          w.stageId === item.stageId &&
          w.date === item.date &&
          w.startTime === item.startTime &&
          w.status === 'waiting'
      );

      return {
        waitlists: state.waitlists.map((w) => {
          if (w.id === waitlistId) {
            return { ...w, status: 'confirmed' };
          }
          if (
            sameSlotItems.includes(w) &&
            w.priority > item.priority
          ) {
            return { ...w, priority: w.priority - 1 };
          }
          return w;
        })
      };
    });
  },

  cancelWaitlist: (waitlistId) => {
    console.log('[Store] 取消候补/放弃补位:', waitlistId);
    set((state) => {
      const item = state.waitlists.find((w) => w.id === waitlistId);
      if (!item) return state;

      const isNotified = item.status === 'notified';

      let waitlists = state.waitlists.map((w) => {
        if (w.id === waitlistId) {
          return { ...w, status: 'cancelled' };
        }
        return w;
      });

      if (isNotified) {
        const nextInQueue = waitlists
          .filter(
            (w) =>
              w.stageId === item.stageId &&
              w.date === item.date &&
              w.startTime === item.startTime &&
              w.status === 'waiting'
          )
          .sort((a, b) => a.priority - b.priority)[0];

        if (nextInQueue) {
          waitlists = waitlists.map((w) => {
            if (w.id === nextInQueue.id) {
              return {
                ...w,
                status: 'notified',
                notifiedAt: formatDateTime(new Date().toISOString())
              };
            }
            return w;
          });
          console.log('[Store] 自动通知下一位候补:', nextInQueue.id);
        }
      }

      const sameSlotWaiting = waitlists.filter(
        (w) =>
          w.stageId === item.stageId &&
          w.date === item.date &&
          w.startTime === item.startTime &&
          w.status === 'waiting'
      );
      waitlists = waitlists.map((w) => {
        if (sameSlotWaiting.includes(w)) {
          const idx = sameSlotWaiting.findIndex((s) => s.id === w.id);
          return { ...w, priority: idx + 1 };
        }
        return w;
      });

      return { waitlists };
    });
  },

  // ========== 3. 审批 ==========
  approveNode: (approvalId, nodeIndex) =>
    set((state) => {
      console.log('[Store] 通过审批节点:', approvalId, nodeIndex);
      const approvals = state.approvals.map((a) => {
        if (a.id !== approvalId) return a;
        const nodes = a.nodes.map((n, idx) => {
          if (idx !== nodeIndex) return n;
          return {
            ...n,
            status: 'approved' as const,
            operatedAt: formatDateTime(new Date().toISOString()),
            operator: '当前用户'
          };
        });
        const allApproved = nodes.every((n) => n.status === 'approved');
        const nextIndex = nodeIndex + 1;
        return {
          ...a,
          nodes,
          currentNodeIndex: allApproved ? 3 : nextIndex,
          overallStatus: allApproved ? 'approved' : 'pending',
          rejectedFromNode: undefined,
          updatedAt: formatDateTime(new Date().toISOString())
        };
      });

      let registrations = state.registrations;
      const flow = approvals.find((a) => a.id === approvalId);
      if (flow) {
        registrations = state.registrations.map((r) =>
          r.id === flow.registrationId
            ? {
                ...r,
                status: flow.overallStatus,
                approvalFlowId: approvalId,
                updatedAt: formatDateTime(new Date().toISOString())
              }
            : r
        );
      }

      return { approvals, registrations };
    }),

  rejectNode: (approvalId, nodeIndex, comment) =>
    set((state) => {
      console.log('[Store] 驳回审批节点:', approvalId, nodeIndex, comment);
      const approvals = state.approvals.map((a) => {
        if (a.id !== approvalId) return a;
        const nodes = a.nodes.map((n, idx) => {
          if (idx !== nodeIndex) return n;
          return {
            ...n,
            status: 'rejected' as const,
            comment,
            operatedAt: formatDateTime(new Date().toISOString()),
            operator: '当前用户'
          };
        });
        return {
          ...a,
          nodes,
          overallStatus: 'rejected',
          rejectedFromNode: nodes[nodeIndex].type,
          updatedAt: formatDateTime(new Date().toISOString())
        };
      });

      let registrations = state.registrations;
      const flow = approvals.find((a) => a.id === approvalId);
      if (flow) {
        registrations = state.registrations.map((r) =>
          r.id === flow.registrationId
            ? {
                ...r,
                status: 'rejected',
                updatedAt: formatDateTime(new Date().toISOString())
              }
            : r
        );
      }

      return { approvals, registrations };
    }),

  resubmitApproval: (approvalId) =>
    set((state) => {
      console.log('[Store] 重新提交审批:', approvalId);
      const approvals = state.approvals.map((a) => {
        if (a.id !== approvalId) return a;
        return {
          ...a,
          nodes: createEmptyApprovalNodes(),
          currentNodeIndex: 0,
          overallStatus: 'pending',
          rejectedFromNode: undefined,
          updatedAt: formatDateTime(new Date().toISOString())
        };
      });

      let registrations = state.registrations;
      const flow = approvals.find((a) => a.id === approvalId);
      if (flow) {
        registrations = state.registrations.map((r) =>
          r.id === flow.registrationId
            ? {
                ...r,
                status: 'pending',
                updatedAt: formatDateTime(new Date().toISOString())
              }
            : r
        );
      }

      return { approvals, registrations };
    }),

  updateRegistrationAndResumeApproval: (reg, approvalId) =>
    set((state) => {
      console.log('[Store] 更新报批并继续审批:', reg.id, approvalId);
      const flow = state.approvals.find((a) => a.id === approvalId);
      if (!flow) {
        console.error('[Store] 审批流不存在:', approvalId);
        return state;
      }

      const rejectedFrom = flow.rejectedFromNode;
      let resumeNodeIndex = 0;
      if (rejectedFrom) {
        resumeNodeIndex = flow.nodes.findIndex((n) => n.type === rejectedFrom);
        if (resumeNodeIndex < 0) resumeNodeIndex = 0;
      }

      console.log(`[Store] 从节点 ${resumeNodeIndex} (${flow.nodes[resumeNodeIndex]?.name}) 继续审批`);

      const nodes = flow.nodes.map((n, idx) => {
        if (idx < resumeNodeIndex) {
          return { ...n, status: 'approved' as const };
        }
        if (idx === resumeNodeIndex) {
          return {
            ...n,
            status: 'pending' as const,
            comment: undefined,
            operatedAt: undefined,
            operator: undefined
          };
        }
        return {
          ...n,
          status: 'pending' as const,
          comment: undefined,
          operatedAt: undefined,
          operator: undefined
        };
      });

      const approvals = state.approvals.map((a) =>
        a.id === approvalId
          ? {
              ...a,
              nodes,
              currentNodeIndex: resumeNodeIndex,
              overallStatus: 'pending' as const,
              rejectedFromNode: undefined,
              updatedAt: formatDateTime(new Date().toISOString())
            }
          : a
      );

      const registrations = state.registrations.map((r) =>
        r.id === reg.id
          ? { ...reg, status: 'pending' as const, updatedAt: formatDateTime(new Date().toISOString()) }
          : r
      );

      return { approvals, registrations };
    }),

  // ========== 4. 报批 ==========
  saveDraft: (reg) => {
    console.log('[Store] 保存草稿:', reg.id);
    set((state) => {
      const existing = state.registrations.find((r) => r.id === reg.id);
      if (existing) {
        return {
          registrations: state.registrations.map((r) =>
            r.id === reg.id ? { ...reg, status: 'draft', updatedAt: formatDateTime(new Date().toISOString()) } : r
          )
        };
      }
      return {
        registrations: [
          ...state.registrations,
          { ...reg, status: 'draft', updatedAt: formatDateTime(new Date().toISOString()) }
        ]
      };
    });
  },

  submitApproval: (reg) => {
    console.log('[Store] 提交审批:', reg.id);
    set((state) => {
      const approvalFlow = createApprovalFlow(reg);
      const finalReg: Registration = {
        ...reg,
        id: reg.id || generateId('reg'),
        status: 'pending',
        approvalFlowId: approvalFlow.id,
        createdAt: reg.createdAt || formatDateTime(new Date().toISOString()),
        updatedAt: formatDateTime(new Date().toISOString())
      };

      const existingIdx = state.registrations.findIndex((r) => r.id === finalReg.id);
      let registrations;
      if (existingIdx >= 0) {
        registrations = state.registrations.map((r, i) => (i === existingIdx ? finalReg : r));
      } else {
        registrations = [...state.registrations, finalReg];
      }

      return {
        registrations,
        approvals: [...state.approvals, approvalFlow]
      };
    });
  },

  addRegistration: (reg) =>
    set((state) => ({ registrations: [...state.registrations, reg] }))
}));
