import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Stage } from '@/types/stage';
import StatusTag from '@/components/StatusTag';
import styles from './index.module.scss';

interface StageCardProps {
  stage: Stage;
}

const StageCard: React.FC<StageCardProps> = ({ stage }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/stage-detail/index?id=${stage.id}`
    });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrap}>
        <Image
          className={styles.stageImage}
          src={stage.image}
          mode="aspectFill"
        />
        <View className={styles.statusBadge}>
          <StatusTag status={stage.status} />
        </View>
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{stage.name}</Text>
          <View className={styles.price}>
            <Text>¥{stage.basePrice}</Text>
            <Text>/场</Text>
          </View>
        </View>
        <View className={styles.info}>
          <View className={styles.infoItem}>
            <Text>📍 {stage.location}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text>👥 {stage.capacity}座</Text>
          </View>
          <View className={styles.infoItem}>
            <Text>📐 {stage.area}㎡</Text>
          </View>
        </View>
        <Text className={styles.desc}>{stage.description}</Text>
        <View className={styles.equipmentWrap}>
          <Text style={{ fontSize: '24rpx', color: '#86909C' }}>配套设备</Text>
          <View className={styles.equipmentList}>
            {stage.equipment.slice(0, 4).map((eq, idx) => (
              <View key={idx} className={styles.equipmentTag}>{eq}</View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default StageCard;
