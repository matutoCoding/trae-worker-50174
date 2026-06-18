import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/app';
import StatusTag from '@/components/StatusTag';
import { getStatusText } from '@/utils';
import styles from './index.module.scss';

const StageDetailPage: React.FC = () => {
  const router = useRouter();
  const { stages, scheduleSlots, selectedDate } = useAppStore();
  const stageId = router.params.id;

  const stage = useMemo(() => stages.find((s) => s.id === stageId), [stages, stageId]);
  const slots = useMemo(
    () => scheduleSlots.filter((s) => s.stageId === stageId && s.date === selectedDate),
    [scheduleSlots, stageId, selectedDate]
  );

  if (!stage) {
    return (
      <View style={{ padding: 100, textAlign: 'center' }}>
        <Text>舞台不存在</Text>
      </View>
    );
  }

  const handleBookSlot = (slotId: string) => {
    console.log('[StageDetail] 预约档期:', slotId);
    Taro.showToast({ title: '预约成功，待确认', icon: 'success' });
  };

  const handleAddWaitlist = () => {
    console.log('[StageDetail] 添加候补:', stageId);
    Taro.showToast({ title: '候补登记成功', icon: 'success' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.banner}>
        <Image className={styles.bannerImage} src={stage.image} mode="aspectFill" />
        <View className={styles.bannerOverlay}>
          <Text className={styles.bannerTitle}>{stage.name}</Text>
          <View className={styles.bannerMeta}>
            <Text className={styles.bannerMetaItem}>📍 {stage.location}</Text>
            <StatusTag status={stage.status} />
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>舞台信息</Text>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>座位数</Text>
              <Text className={styles.infoValue}>{stage.capacity} 座</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>舞台面积</Text>
              <Text className={styles.infoValue}>{stage.area} ㎡</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>场地位置</Text>
              <Text className={styles.infoValue}>{stage.location}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>当前状态</Text>
              <Text className={styles.infoValue}>{getStatusText(stage.status)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>舞台介绍</Text>
          <Text className={styles.descText}>{stage.description}</Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>配套设备</Text>
          <View className={styles.equipmentList}>
            {stage.equipment.map((eq, idx) => (
              <View key={idx} className={styles.equipmentTag}>
                <Text>{eq}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={classnames(styles.card, styles.slotSection)}>
          <Text className={styles.sectionTitle}>
            {selectedDate} 档期安排
          </Text>
          {slots.length > 0 ? (
            <View className={styles.slotList}>
              {slots.map((slot) => (
                <View key={slot.id} className={styles.slotItem}>
                  <View>
                    <Text className={styles.slotTime}>
                      {slot.startTime} - {slot.endTime}
                    </Text>
                    {slot.bookedBy && slot.status !== 'available' && (
                      <Text style={{ fontSize: '22rpx', color: '#86909C', marginTop: 4 }}>
                        预约方：{slot.bookedBy}
                      </Text>
                    )}
                  </View>
                  {slot.status === 'available' ? (
                    <View
                      className={classnames(styles.slotAction, styles.slotActionAvailable)}
                      onClick={() => handleBookSlot(slot.id)}
                    >
                      <Text>立即预约</Text>
                    </View>
                  ) : (
                    <StatusTag status={slot.status} />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ fontSize: '26rpx', color: '#86909C' }}>当日暂无可预约档期</Text>
          )}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.priceWrap}>
          <Text className={styles.priceLabel}>基础场租</Text>
          <View className={styles.priceValue}>
            <Text>¥{stage.basePrice}</Text>
            <Text> / 场</Text>
          </View>
        </View>
        <View
          className={classnames(styles.btn, styles.btnSecondary)}
          onClick={handleAddWaitlist}
        >
          <Text>候补登记</Text>
        </View>
        <View
          className={classnames(styles.btn, styles.btnPrimary)}
          onClick={() => Taro.showToast({ title: '请先选择档期', icon: 'none' })}
        >
          <Text>预约舞台</Text>
        </View>
      </View>
    </View>
  );
};

export default StageDetailPage;
