import dayjs from 'dayjs';

export const formatDateTime = (dateStr: string, format: string = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(dateStr).format(format);
};

export const formatDate = (dateStr: string): string => {
  return dayjs(dateStr).format('YYYY-MM-DD');
};

export const formatTime = (dateStr: string): string => {
  return dayjs(dateStr).format('HH:mm');
};

export const getStatusText = (status: string): string => {
  const map: Record<string, string> = {
    available: '可预约',
    pending: '待确认',
    confirmed: '已确认',
    released: '已释放',
    waiting: '排队中',
    notified: '已通知',
    cancelled: '已取消',
    approved: '已通过',
    rejected: '已驳回',
    draft: '草稿',
    maintenance: '维护中',
    occupied: '使用中'
  };
  return map[status] || status;
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    available: '#00B42A',
    pending: '#165DFF',
    confirmed: '#00B42A',
    released: '#86909C',
    waiting: '#FF7D00',
    notified: '#165DFF',
    cancelled: '#86909C',
    approved: '#00B42A',
    rejected: '#F53F3F',
    draft: '#86909C',
    maintenance: '#86909C',
    occupied: '#F53F3F'
  };
  return map[status] || '#86909C';
};

export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const getCountdownText = (expiresAt: string): string => {
  const now = dayjs();
  const expire = dayjs(expiresAt);
  const diffMinutes = expire.diff(now, 'minute');
  if (diffMinutes <= 0) return '已超时';
  if (diffMinutes < 60) return `${diffMinutes}分钟后释放`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return `${hours}小时${mins}分钟后释放`;
};
