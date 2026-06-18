import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { useAppStore } from '@/store/app';
import StageCard from '@/components/StageCard';
import StatusTag from '@/components/StatusTag';
import { ScheduleSlot } from '@/types/stage';
import { getCountdownText } from '@/utils';
import styles from './index.module.scss';

const SchedulePage: React.FC = () => {
  const { stages, scheduleSlots, bookings, selectedDate, setSelectedDate, checkAndReleaseExpiredSlots } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'available' | 'pending' | 'confirmed'>('all');
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const released = checkAndReleaseExpiredSlots();
      if (released > 0) {
        Taro.showToast({ title: `已自动释放${released}个超时档期`, icon: 'none' });
      }
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [checkAndReleaseExpiredSlots]);

  useDidShow(() => {
    checkAndReleaseExpiredSlots();
  });

  const dateList = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const date = dayjs().add(i, 'day');
      list.push({
        date: date.format('YYYY-MM-DD'),
        day: date.format('DD'),
        weekday: i === 0 ? '今天' : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.day()]
      });
    }
    return list;
  }, []);

  const pendingSlots = useMemo(() => {
    return scheduleSlots.filter(
      (s) => s.status === 'pending' && s.date === selectedDate
    );
  }, [scheduleSlots, selectedDate]);

  const filteredStages = useMemo(() => {
    if (filter === 'all') return stages;
    const stageIds = scheduleSlots
      .filter((s) => s.date === selectedDate && s.status === filter)
      .map((s) => s.stageId);
    const uniqueIds = Array.from(new Set(stageIds));
    return stages.filter((s) => uniqueIds.includes(s.id));
  }, [stages, scheduleSlots, selectedDate, filter]);

  const goPrev = () => {
    const newDate = dayjs(selectedDate).subtract(1, 'day');
    setSelectedDate(newDate.format('YYYY-MM-DD'));
  };

  const goNext = () => {
    const newDate = dayjs(selectedDate).add(1, 'day');
    setSelectedDate(newDate.format('YYYY-MM-DD'));
  };

  const handleRefresh = useCallback(() => {
    const released = checkAndReleaseExpiredSlots();
    Taro.showToast({
      title: released > 0 ? `已释放${released}个超时档期` : '刷新成功',
      icon: 'success'
    });
    Taro.stopPullDownRefresh();
  }, [checkAndReleaseExpiredSlots]);

  return (
    <ScrollView
      className={styles.container}
      scrollY
      onPullDownRefresh={handleRefresh}
      refresherEnabled
    >
      <View className={styles.header}>
        <Text className={styles.title}>舞台排期</Text>
        <Text className={styles.subtitle}>选择日期查看各舞台档期</Text>
      </View>

      <View className={styles.dateSelector}>
        <View className={styles.dateNav}>
          <View className={styles.navBtn} onClick={goPrev}>
            <Text>‹</Text>
          </View>
          <Text className={styles.dateLabel}>{dayjs(selectedDate).format('YYYY年MM月')}</Text>
          <View className={styles.navBtn} onClick={goNext}>
            <Text>›</Text>
          </View>
        </View>
        <ScrollView className={styles.dateList} scrollX>
          {dateList.map((item) => (
            <View
              key={item.date}
              className={classnames(styles.dateItem, {
                [styles.dateItemActive]: item.date === selectedDate
              })}
              onClick={() => setSelectedDate(item.date)}
            >
              <Text className={styles.day}>{item.day}</Text>
              <Text className={styles.weekday}>{item.weekday}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {pendingSlots.length > 0 && (
        <View className={styles.releaseNotice}>
          <Text className={styles.noticeTitle}>⏰ 待确认档期（超时自动释放）</Text>
          {pendingSlots.slice(0, 3).map((slot: ScheduleSlot) => {
            const booking = bookings.find((b) => b.slotId === slot.id);
            const stage = stages.find((s) => s.id === slot.stageId);
            return (
              <View
                key={slot.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12rpx 0',
                  borderTop: '1rpx solid rgba(255,125,0,0.1)',
                  marginTop: '8rpx'
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: '26rpx', color: '#4E5969', fontWeight: 500 }}>
                    {stage?.name} · {slot.startTime}-{slot.endTime}
                  </Text>
                  <Text style={{ fontSize: '22rpx', color: '#FF7D00', marginTop: 4, display: 'block' }}>
                    👤 预约方：{slot.bookedBy || booking?.applicant || '—'}
                  </Text>
                  {booking?.performanceName && (
                    <Text style={{ fontSize: '20rpx', color: '#86909C', marginTop: 2, display: 'block' }}>
                      🎭 {booking.performanceName}
                    </Text>
                  )}
                </View>
                <StatusTag
                  status="pending"
                  text={slot.expiresAt ? getCountdownText(slot.expiresAt) : '待确认'}
                />
              </View>
            );
          })}
          <Text className={styles.noticeContent}>
            💡 档期预约后需在2小时内完成确认，超时自动释放并通知候补补位
          </Text>
        </View>
      )}

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>舞台列表</Text>
        <Text className={styles.sectionCount}>共 {filteredStages.length} 个舞台</Text>
      </View>

      <ScrollView className={styles.filterTabs} scrollX>
        {[
          { key: 'all', label: '全部' },
          { key: 'available', label: '可预约' },
          { key: 'pending', label: '待确认' },
          { key: 'confirmed', label: '已确认' }
        ].map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.filterTab, {
              [styles.filterTabActive]: filter === tab.key
            })}
            onClick={() => setFilter(tab.key as any)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </ScrollView>

      {filteredStages.length > 0 ? (
        filteredStages.map((stage) => {
          const stageSlots = scheduleSlots.filter(
            (s) => s.stageId === stage.id && s.date === selectedDate
          );
          return (
            <View key={stage.id}>
              <StageCard stage={stage} />
              {stageSlots.length > 0 && (
                <View className={styles.stageSlots}>
                  <Text className={styles.slotsTitle}>📅 {selectedDate} 档期详情</Text>
                  {stageSlots.map((slot) => {
                    const booking = bookings.find((b) => b.slotId === slot.id);
                    return (
                      <View key={slot.id} className={styles.slotRow}>
                        <View className={styles.slotTime}>
                          <Text className={styles.slotTimeText}>
                            {slot.startTime} - {slot.endTime}
                          </Text>
                          <StatusTag status={slot.status} />
                        </View>
                        {slot.status !== 'available' && (
                          <View className={styles.slotDetail}>
                            <Text className={styles.slotDetailText}>
                              👤 {slot.bookedBy || booking?.applicant || '—'}
                            </Text>
                            {booking?.performanceName && (
                              <Text className={styles.slotDetailText}>
                                🎭 {booking.performanceName}
                              </Text>
                            )}
                            {slot.status === 'pending' && slot.expiresAt && (
                              <Text className={styles.slotCountdown}>
                                ⏰ {getCountdownText(slot.expiresAt)}
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎭</Text>
          <Text className={styles.emptyText}>暂无符合条件的舞台</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default SchedulePage;
