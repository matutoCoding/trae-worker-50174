import React from 'react';
import { View, Text } from '@tarojs/components';
import { ApprovalNode as ApprovalNodeType } from '@/types/approval';
import { formatDateTime } from '@/utils';
import styles from './index.module.scss';
import classnames from 'classnames';

interface ApprovalNodeProps {
  node: ApprovalNodeType;
  index: number;
  isLast: boolean;
}

const ApprovalNodeComponent: React.FC<ApprovalNodeProps> = ({ node, index, isLast }) => {
  const circleClass = classnames(styles.circle, {
    [styles.circlePending]: node.status === 'pending',
    [styles.circleApproved]: node.status === 'approved',
    [styles.circleRejected]: node.status === 'rejected'
  });

  return (
    <View className={styles.node}>
      <View className={styles.connector} />
      <View className={circleClass}>
        <Text>{node.status === 'approved' ? '✓' : node.status === 'rejected' ? '✕' : index + 1}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{node.name}</Text>
          <Text className={styles.role}>{node.role}</Text>
        </View>
        {node.operatedAt && (
          <Text className={styles.time}>{formatDateTime(node.operatedAt)}</Text>
        )}
        {node.status === 'pending' && (
          <Text className={styles.time}>待审批</Text>
        )}
        {node.comment && (
          <View className={styles.comment}>
            <Text>{node.comment}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ApprovalNodeComponent;
