import React, { useMemo, useState } from 'react';
import { View, Text, Image, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/app';
import StatusTag from '@/components/StatusTag';
import { generateId, getStatusText } from '@/utils';
import { WaitlistPriority } from '@/types/waitlist';
import styles from './index.module.scss';

const StageDetailPage: React.FC = () => {
  const router = useRouter();
  const { stages, scheduleSlots, selectedDate, bookSlot, addWaitlist } = useAppStore();
  const stageId = router.params.id;

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [applicant, setApplicant] = useState('');
  const [phone, setPhone] = useState('');
  const [performanceName, setPerformanceName] = useState('');

  const stage = useMemo(() => stages.find((s) => s.id === stageId), [stages, stageId]);
  const slots = useMemo(
    () => scheduleSlots.filter((s) => s.stageId === stageId && s.date === selectedDate),
    [scheduleSlots, stageId, selectedDate]
  );
  const selectedSlot = useMemo(
    () => slots.find((s) => s.id === selectedSlotId),
    [slots, selectedSlotId]
  );

  if (!stage) {
    return (
      <View style={{ padding: 100, textAlign: 'center' }}>
        <Text>舞台不存在</Text>
      </View>
    );
  }

  const handleBookSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    setShowBookModal(true);
  };

  const confirmBookSlot = () => {
    if (!applicant.trim()) {
      Taro.showToast({ title: '请填写预约人姓名', icon: 'none' });
      return;
    }
    if (!phone.trim()) {
      Taro.showToast({ title: '请填写联系电话', icon: 'none' });
      return;
    }
    if (!selectedSlotId) return;

    const booking = bookSlot(selectedSlotId, stageId!, applicant, phone, performanceName || '未命名演出');
    if (booking) {
      Taro.showToast({ title: '预约成功，待确认', icon: 'success' });
      setShowBookModal(false);
      setSelectedSlotId(null);
      setApplicant('');
      setPhone('');
      setPerformanceName('');
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/schedule/index' });
      }, 600);
    } else {
      Taro.showToast({ title: '档期已被预约', icon: 'none' });
    }
  };

  const handleAddWaitlist = () => {
    if (!stageId) return;
    const availableSlots = slots.filter((s) => s.status !== 'available');
    if (availableSlots.length === 0) {
      Taro.showToast({ title: '暂无满档时段，可直接预约', icon: 'none' });
      return;
    }
    const target = availableSlots[0];
    addWaitlist({
      id: generateId('wl'),
      stageId,
      stageName: stage.name,
      date: selectedDate,
      startTime: target.startTime,
      endTime: target.endTime,
      applicant: '当前用户',
      applicantPhone: '13800138000',
      priority: WaitlistPriority.NORMAL,
      status: 'waiting',
      createdAt: new Date().toISOString()
    });
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

      {showBookModal && (
        <View className={styles.modalMask} onClick={() => setShowBookModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>预约档期</Text>
            <View style={{ marginBottom: 16}}>
              <Text style={{ fontSize: '26rpx', color: '#D4A853', fontWeight: 600 }}>
                {selectedDate} {selectedSlot?.startTime} - {selectedSlot?.endTime}
              </Text>
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>预约人 *</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入姓名"
                value={applicant}
                onInput={(e) => setApplicant(e.detail.value)}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>联系电话 *</Text>
              <Input
                className={styles.formInput}
                type="phone"
                placeholder="请输入手机号"
                value={phone}
                onInput={(e) => setPhone(e.detail.value)}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>演出名称</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入演出名称"
                value={performanceName}
                onInput={(e) => setPerformanceName(e.detail.value)}
              />
            </View>
            <View style={{ backgroundColor: '#FFF7E0', padding: 16, borderRadius: 8, marginBottom: 24 }}>
              <Text style={{ fontSize: '24rpx', color: '#86909C }}>
                💡 提交后需在 <Text style={{ color: '#D4A853', fontWeight: 600 }}>2小时内</Text>内完成确认，超时将自动释放并通知候补人员补位</Text>
            </View>
            <View className={styles.modalActions}>
              <View
                className={classnames(styles.modalBtn, styles.modalBtnCancel)}
                onClick={() => setShowBookModal(false)}>
                <Text>取消</Text>
              </View>
              <View
                className={classnames(styles.modalBtn, styles.modalBtnConfirm)}
                onClick={confirmBookSlot}>
                <Text>确认预约</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StageDetailPage;
