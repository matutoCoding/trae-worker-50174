import React from 'react';
import { View, Text } from '@tarojs/components';
import { getStatusText, getStatusColor } from '@/utils';
import styles from './index.module.scss';

interface StatusTagProps {
  status: string;
  text?: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status, text }) => {
  const displayText = text || getStatusText(status);
  const color = getStatusColor(status);

  return (
    <View className={styles.tag} style={{ backgroundColor: `${color}15`, color }}>
      <Text>{displayText}</Text>
    </View>
  );
};

export default StatusTag;
