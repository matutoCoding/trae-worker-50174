import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/app';
import StatusTag from '@/components/StatusTag';
import { NODE_CONFIG } from '@/types/approval';
import { formatDateTime } from '@/utils';
import styles from './index.module.scss';

type TabType = 'all' | 'pending' | 'approved' | 'rejected';

const ApprovalPage: React.FC = () => {
  const { approvals } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredList = useMemo(() => {
    if (activeTab === 'all') return approvals;
    return approvals.filter((a) => a.overallStatus === activeTab);
  }, [approvals, activeTab]);

  const stats = useMemo(() => {
    return {
      pending: approvals.filter((a) => a.overallStatus === 'pending').length,
      approved: approvals.filter((a) => a.overallStatus === 'approved').length,
      rejected: approvals.filter((a) => a.overallStatus === 'rejected').length
    };
  }, [approvals]);

  const handleCardClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/approval-detail/index?id=${id}`
    });
  };

  const renderProgress = (flow: any) => {
    const nodeTypes = Object.keys(NODE_CONFIG) as Array<keyof typeof NODE_CONFIG>;
    return (
      <View className={styles.flowProgress}>
        {nodeTypes.map((type, idx) => {
          const node = flow.nodes[idx];
          const isLast = idx === nodeTypes.length - 1;
          const isCurrent = flow.currentNodeIndex === idx && flow.overallStatus === 'pending';
          const isDone = idx < flow.currentNodeIndex || flow.overallStatus === 'approved';
          const isRejected = node?.status === 'rejected';

          let nodeClass = styles.pending;
          if (isRejected) nodeClass = styles.rejected;
          else if (isCurrent) nodeClass = styles.current;
          else if (isDone || node?.status === 'approved') nodeClass = styles.approved;

          return (
            <React.Fragment key={type}>
              <View className={styles.progressWrap}>
                <View className={classnames(styles.progressNode, nodeClass)}>
                  <Text>
                    {isRejected ? '✕' : isDone || node?.status === 'approved' ? '✓' : idx + 1}
                  </Text>
                </View>
                <Text className={styles.nodeLabel}>{NODE_CONFIG[type].name}</Text>
              </View>
              {!isLast && (
                <View
                  className={classnames(styles.progressLine, {
                    [styles.done]: isDone
                  })}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>审批中心</Text>
        <Text className={styles.subtitle}>导演 → 技术总监 → 剧场经理 逐级审批</Text>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={classnames(styles.statValue, styles.pending)}>{stats.pending}</Text>
          <Text className={styles.statLabel}>待审批</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={classnames(styles.statValue, styles.approved)}>{stats.approved}</Text>
          <Text className={styles.statLabel}>已通过</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={classnames(styles.statValue, styles.rejected)}>{stats.rejected}</Text>
          <Text className={styles.statLabel}>已驳回</Text>
        </View>
      </View>

      <View className={styles.tabs}>
        {[
          { key: 'all', label: '全部' },
          { key: 'pending', label: '待审批' },
          { key: 'approved', label: '已通过' },
          { key: 'rejected', label: '已驳回' }
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
        filteredList.map((flow) => (
          <View key={flow.id} className={styles.approvalCard} onClick={() => handleCardClick(flow.id)}>
            <View className={styles.cardHeader}>
              <Text className={styles.performanceName}>{flow.performanceName}</Text>
              <StatusTag status={flow.overallStatus} />
            </View>

            {renderProgress(flow)}

            <View className={styles.infoRow}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>当前节点：</Text>
                <Text>
                  {flow.overallStatus === 'pending' && flow.currentNodeIndex < Object.keys(NODE_CONFIG).length
                    ? Object.values(NODE_CONFIG)[flow.currentNodeIndex]?.name
                    : flow.overallStatus === 'approved'
                    ? '全部通过'
                    : '已驳回'}
                </Text>
              </View>
            </View>

            {flow.overallStatus === 'pending' && flow.currentNodeIndex < Object.keys(NODE_CONFIG).length && (
              <View className={styles.currentNodeTip}>
                <Text className={styles.tipText}>
                  ⏳ 当前等待 {Object.values(NODE_CONFIG)[flow.currentNodeIndex]?.name} 审批
                </Text>
              </View>
            )}

            {flow.overallStatus === 'rejected' && flow.rejectedFromNode && (
              <View className={styles.rejectTip}>
                <Text className={styles.rejectTipText}>
                  ✕ 被 {NODE_CONFIG[flow.rejectedFromNode]?.name} 驳回，请退回修改后重新提交
                </Text>
              </View>
            )}

            <View className={styles.timeRow}>
              <Text className={styles.timeText}>提交：{formatDateTime(flow.createdAt)}</Text>
              <Text className={styles.timeText}>更新：{formatDateTime(flow.updatedAt)}</Text>
            </View>
          </View>
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📝</Text>
          <Text className={styles.emptyText}>暂无审批记录</Text>
        </View>
      )}
    </View>
  );
};

export default ApprovalPage;
