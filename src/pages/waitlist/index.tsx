import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/app';
import StatusTag from '@/components/StatusTag';
import { formatDateTime, generateId } from '@/utils';
import { WaitlistItem } from '@/types/waitlist';
import styles from './index.module.scss';

type TabType = 'all' | 'waiting' | 'notified';

const WaitlistPage: React.FC = () => {
  const { waitlists, addWaitlist, confirmWaitlist, cancelWaitlist } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const activeWaitlists = useMemo(() => {
    return waitlists.filter((w) => w.status !== 'cancelled');
  }, [waitlists]);

  const filteredList = useMemo(() => {
    if (activeTab === 'all') return activeWaitlists;
    return activeWaitlists.filter((w) => w.status === activeTab);
  }, [activeWaitlists, activeTab]);

  const stats = useMemo(() => {
    return {
      total: activeWaitlists.length,
      waiting: activeWaitlists.filter((w) => w.status === 'waiting').length,
      notified: activeWaitlists.filter((w) => w.status === 'notified').length,
      confirmed: activeWaitlists.filter((w) => w.status === 'confirmed').length
    };
  }, [activeWaitlists]);

  const handleAddWaitlist = () => {
    Taro.showModal({
      title: '候补登记',
      content: '是否确认添加候补登记？将按优先级排队等待补位通知。',
      success: (res) => {
        if (res.confirm) {
          const newItem: WaitlistItem = {
            id: generateId('wl'),
            stageId: 'stage-001',
            stageName: '主剧场大舞台',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '18:00',
            endTime: '22:00',
            applicant: '当前用户',
            applicantPhone: '138****0000',
            performanceName: '新演出项目',
            priority: waitlists.length + 1,
            status: 'waiting',
            createdAt: formatDateTime(new Date().toISOString())
          };
          addWaitlist(newItem);
          Taro.showToast({ title: '候补登记成功', icon: 'success' });
        }
      }
    });
  };

  const handleConfirm = (id: string) => {
    Taro.showModal({
      title: '确认补位',
      content: '确定要确认该补位吗？确认后该档期将归您所有。',
      success: (res) => {
        if (res.confirm) {
          confirmWaitlist(id);
          Taro.showToast({ title: '已确认补位', icon: 'success' });
        }
      }
    });
  };

  const handleGiveUp = (id: string) => {
    Taro.showModal({
      title: '放弃补位',
      content: '确定要放弃该补位吗？放弃后系统将自动通知下一位候补人员。',
      success: (res) => {
        if (res.confirm) {
          cancelWaitlist(id);
          Taro.showToast({ title: '已放弃补位', icon: 'none' });
        }
      }
    });
  };

  const handleCancel = (id: string) => {
    Taro.showModal({
      title: '取消候补',
      content: '确定要取消该候补登记吗？',
      success: (res) => {
        if (res.confirm) {
          cancelWaitlist(id);
          Taro.showToast({ title: '已取消候补', icon: 'none' });
        }
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>候补补位</Text>
        <Text className={styles.subtitle}>档期释放后按优先级自动通知补位</Text>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.total}</Text>
          <Text className={styles.statLabel}>候补总数</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.waiting}</Text>
          <Text className={styles.statLabel}>排队中</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.notified}</Text>
          <Text className={styles.statLabel}>已通知</Text>
        </View>
      </View>

      <View className={styles.noticeCard}>
        <Text className={styles.noticeText}>
          💡 档期超时未确认会自动释放，系统将按候补优先级依次通知补位，收到通知后请在30分钟内确认。
        </Text>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>候补队列</Text>
        <View className={styles.addBtn} onClick={handleAddWaitlist}>
          <Text>+ 候补登记</Text>
        </View>
      </View>

      <View className={styles.tabs}>
        {[
          { key: 'all', label: '全部' },
          { key: 'waiting', label: '排队中' },
          { key: 'notified', label: '已通知' }
        ].map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, {
              [styles.tabActive]: activeTab === tab.key
            })}
            onClick={() => setActiveTab(tab.key as TabType)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      {filteredList.length > 0 ? (
        filteredList.map((item: WaitlistItem) => (
          <View key={item.id} className={styles.waitlistCard}>
            {item.priority <= 3 && (
              <View className={styles.priorityBadge}>
                <Text>#{item.priority} 优先</Text>
              </View>
            )}
            <View className={styles.cardHeader}>
              <Text className={styles.performanceName}>{item.performanceName}</Text>
              <StatusTag status={item.status} />
            </View>
            <View className={styles.stageInfo}>
              <View className={styles.infoChip}>
                <Text>🎭 {item.stageName}</Text>
              </View>
              <View className={styles.infoChip}>
                <Text>📅 {item.date}</Text>
              </View>
              <View className={styles.infoChip}>
                <Text>🕐 {item.startTime}-{item.endTime}</Text>
              </View>
              <View className={styles.infoChip}>
                <Text>👤 {item.applicant}</Text>
              </View>
            </View>
            <View className={styles.metaRow}>
              <Text className={styles.applicant}>优先级 #{item.priority}</Text>
              <Text className={styles.createTime}>登记于 {formatDateTime(item.createdAt)}</Text>
            </View>
            {item.status === 'notified' && (
              <View className={styles.actionRow}>
                <View
                  className={classnames(styles.actionBtn, styles.secondaryBtn)}
                  onClick={() => handleGiveUp(item.id)}
                >
                  <Text>放弃补位</Text>
                </View>
                <View
                  className={classnames(styles.actionBtn, styles.primaryBtn)}
                  onClick={() => handleConfirm(item.id)}
                >
                  <Text>确认补位</Text>
                </View>
              </View>
            )}
            {item.status === 'waiting' && (
              <View className={styles.actionRow}>
                <View
                  className={classnames(styles.actionBtn, styles.secondaryBtn)}
                  onClick={() => handleCancel(item.id)}
                >
                  <Text>取消候补</Text>
                </View>
              </View>
            )}
          </View>
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>暂无候补记录</Text>
          <View className={styles.emptyBtn} onClick={handleAddWaitlist}>
            <Text>立即候补登记</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default WaitlistPage;
