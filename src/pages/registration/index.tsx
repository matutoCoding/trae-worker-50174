import React, { useMemo, useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/app';
import StatusTag from '@/components/StatusTag';
import { EQUIPMENT_CATEGORIES, EquipmentItem, Registration } from '@/types/registration';
import { formatDateTime, generateId } from '@/utils';
import styles from './index.module.scss';

type Mode = 'list' | 'create';

const defaultEquipmentList: EquipmentItem[] = [
  { id: 'eq-1', name: '摇头染色灯', category: 'lighting', quantity: 0, unit: '台', specifications: 'LED 250W' },
  { id: 'eq-2', name: '成像灯', category: 'lighting', quantity: 0, unit: '台', specifications: '750W' },
  { id: 'eq-3', name: '追光灯', category: 'lighting', quantity: 0, unit: '台', specifications: '2500W' },
  { id: 'eq-4', name: '线阵音箱', category: 'sound', quantity: 0, unit: '只', specifications: '双10寸' },
  { id: 'eq-5', name: '无线手持话筒', category: 'sound', quantity: 0, unit: '套' },
  { id: 'eq-6', name: '调音台', category: 'sound', quantity: 0, unit: '台', specifications: '32路数字' },
  { id: 'eq-7', name: 'LED主屏幕', category: 'video', quantity: 0, unit: '块', specifications: 'P3.9' },
  { id: 'eq-8', name: '升降台', category: 'stage', quantity: 0, unit: '套' },
  { id: 'eq-9', name: '旋转舞台', category: 'stage', quantity: 0, unit: '套' }
];

const emptyForm = {
  id: '',
  performanceName: '',
  performanceType: '',
  organizer: '',
  contactPerson: '',
  contactPhone: '',
  performanceDate: '',
  startTime: '19:00',
  endTime: '22:00',
  stageId: '',
  stageName: '',
  expectedAudience: 0,
  performanceContent: '',
  specialRequirements: '',
  equipmentList: defaultEquipmentList.map((e) => ({ ...e }))
};

const RegistrationPage: React.FC = () => {
  const { registrations, stages, saveDraft, submitApproval } = useAppStore();
  const [mode, setMode] = useState<Mode>('list');

  const [form, setForm] = useState({ ...emptyForm });

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateEquipmentQty = (id: string, delta: number) => {
    setForm((prev) => ({
      ...prev,
      equipmentList: prev.equipmentList.map((eq) =>
        eq.id === id
          ? { ...eq, quantity: Math.max(0, eq.quantity + delta) }
          : eq
      )
    }));
  };

  const totalEquipmentCount = useMemo(() => {
    return form.equipmentList.reduce((sum, eq) => sum + eq.quantity, 0);
  }, [form.equipmentList]);

  const resetForm = () => {
    setForm({
      ...emptyForm,
      id: '',
      equipmentList: defaultEquipmentList.map((e) => ({ ...e }))
    });
  };

  const buildReg = (status: 'draft' | 'pending'): Registration => {
    const usedEquipments = form.equipmentList.filter((e) => e.quantity > 0);
    return {
      id: form.id || generateId('reg'),
      performanceName: form.performanceName,
      performanceType: form.performanceType || '话剧',
      organizer: form.organizer || '未填写',
      contactPerson: form.contactPerson,
      contactPhone: form.contactPhone,
      performanceDate: form.performanceDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      startTime: form.startTime,
      endTime: form.endTime,
      stageId: form.stageId || stages[0]?.id || '',
      stageName: form.stageName || stages[0]?.name || '',
      expectedAudience: form.expectedAudience || 100,
      performanceContent: form.performanceContent || '演出内容待补充',
      equipmentList: usedEquipments,
      specialRequirements: form.specialRequirements,
      status,
      createdAt: form.id ? formatDateTime(new Date().toISOString()) : formatDateTime(new Date().toISOString()),
      updatedAt: formatDateTime(new Date().toISOString())
    };
  };

  const handleSubmit = () => {
    if (!form.performanceName) {
      Taro.showToast({ title: '请输入演出名称', icon: 'none' });
      return;
    }
    if (!form.contactPerson || !form.contactPhone) {
      Taro.showToast({ title: '请填写联系信息', icon: 'none' });
      return;
    }

    const reg = buildReg('pending');
    submitApproval(reg);
    Taro.showToast({ title: '提交成功，等待审批', icon: 'success' });
    resetForm();
    setMode('list');
  };

  const handleSaveDraft = () => {
    const reg = buildReg('draft');
    saveDraft(reg);
    Taro.showToast({ title: '草稿已保存', icon: 'success' });
    resetForm();
    setMode('list');
  };

  const handleEditDraft = (reg: Registration) => {
    setForm({
      id: reg.id,
      performanceName: reg.performanceName,
      performanceType: reg.performanceType,
      organizer: reg.organizer,
      contactPerson: reg.contactPerson,
      contactPhone: reg.contactPhone,
      performanceDate: reg.performanceDate,
      startTime: reg.startTime,
      endTime: reg.endTime,
      stageId: reg.stageId,
      stageName: reg.stageName,
      expectedAudience: reg.expectedAudience,
      performanceContent: reg.performanceContent,
      specialRequirements: reg.specialRequirements || '',
      equipmentList: [
        ...reg.equipmentList,
        ...defaultEquipmentList.filter(
          (de) => !reg.equipmentList.find((e) => e.id === de.id)
        )
      ].sort((a, b) => a.id.localeCompare(b.id))
    });
    setMode('create');
  };

  const renderCreateForm = () => (
    <View>
      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>演出基本信息</Text>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            <Text>演出名称</Text>
          </View>
          <Input
            className={styles.formInput}
            placeholder="请输入演出名称"
            value={form.performanceName}
            onInput={(e) => updateField('performanceName', e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            <Text>演出类型</Text>
          </View>
          <Input
            className={styles.formInput}
            placeholder="如：话剧、音乐会、舞蹈等"
            value={form.performanceType}
            onInput={(e) => updateField('performanceType', e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>主办单位</View>
          <Input
            className={styles.formInput}
            placeholder="请输入主办单位"
            value={form.organizer}
            onInput={(e) => updateField('organizer', e.detail.value)}
          />
        </View>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>
            <Text className={styles.required}>*</Text>
            <Text>联系人 / 联系电话</Text>
          </View>
          <View style={{ display: 'flex', gap: '16rpx' }}>
            <Input
              className={styles.formInput}
              placeholder="联系人"
              style={{ flex: 1 }}
              value={form.contactPerson}
              onInput={(e) => updateField('contactPerson', e.detail.value)}
            />
            <Input
              className={styles.formInput}
              placeholder="联系电话"
              type="phone"
              style={{ flex: 1 }}
              value={form.contactPhone}
              onInput={(e) => updateField('contactPhone', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>演出日期 / 时间</View>
          <View style={{ display: 'flex', gap: '16rpx', flexWrap: 'wrap' }}>
            <Input
              className={styles.formInput}
              placeholder="YYYY-MM-DD"
              style={{ flex: 1, minWidth: '200rpx' }}
              value={form.performanceDate}
              onInput={(e) => updateField('performanceDate', e.detail.value)}
            />
            <Input
              className={styles.formInput}
              placeholder="开始时间"
              style={{ width: '160rpx' }}
              value={form.startTime}
              onInput={(e) => updateField('startTime', e.detail.value)}
            />
            <Input
              className={styles.formInput}
              placeholder="结束时间"
              style={{ width: '160rpx' }}
              value={form.endTime}
              onInput={(e) => updateField('endTime', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>预计观众人数</View>
          <Input
            className={styles.formInput}
            type="number"
            placeholder="请输入预计观众人数"
            value={form.expectedAudience ? String(form.expectedAudience) : ''}
            onInput={(e) => updateField('expectedAudience', parseInt(e.detail.value) || 0)}
          />
        </View>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>演出内容简介</View>
          <Textarea
            className={styles.formTextarea}
            placeholder="请描述演出内容、时长、中场休息安排等"
            value={form.performanceContent}
            onInput={(e) => updateField('performanceContent', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>灯光音响设备清单</Text>
        <Text style={{ fontSize: '24rpx', color: '#86909C', marginBottom: '24rpx' }}>
          请勾选或调整需要使用的设备数量
        </Text>

        {EQUIPMENT_CATEGORIES.map((cat) => {
          const items = form.equipmentList.filter((e) => e.category === cat.key);
          if (items.length === 0) return null;
          return (
            <View key={cat.key} className={styles.equipmentCategory}>
              <Text className={styles.categoryTitle}>{cat.label}</Text>
              {items.map((eq) => (
                <View key={eq.id} className={styles.equipmentItem}>
                  <View className={styles.equipmentInfo}>
                    <Text className={styles.equipmentName}>{eq.name}</Text>
                    {eq.specifications && (
                      <Text className={styles.equipmentSpec}>{eq.specifications}</Text>
                    )}
                  </View>
                  <View className={styles.quantityControl}>
                    <View
                      className={styles.qtyBtn}
                      onClick={() => updateEquipmentQty(eq.id, -1)}
                    >
                      <Text>-</Text>
                    </View>
                    <Text className={styles.qtyValue}>{eq.quantity}</Text>
                    <View
                      className={styles.qtyBtn}
                      onClick={() => updateEquipmentQty(eq.id, 1)}
                    >
                      <Text>+</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        <View className={styles.equipmentTotal}>
          <Text className={styles.totalText}>
            📋 已选择 {totalEquipmentCount} 件设备
          </Text>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>特殊需求</Text>
        <View className={styles.formItem}>
          <Textarea
            className={styles.formTextarea}
            placeholder="请填写其他特殊需求，如舞台搭建要求、化妆间数量、技术支持等"
            value={form.specialRequirements}
            onInput={(e) => updateField('specialRequirements', e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={classnames(styles.btn, styles.btnSecondary)} onClick={handleSaveDraft}>
          <Text>保存草稿</Text>
        </View>
        <View className={classnames(styles.btn, styles.btnAccent)} onClick={handleSubmit}>
          <Text>提交审批</Text>
        </View>
      </View>
    </View>
  );

  const renderList = () => (
    <View>
      <View className={styles.listSection}>
        <View className={styles.listHeader}>
          <Text className={styles.listTitle}>报批记录</Text>
          <Text style={{ fontSize: '24rpx', color: '#86909C' }}>共 {registrations.length} 条</Text>
        </View>

        {registrations.length > 0 ? (
          registrations.map((reg) => (
            <View key={reg.id} className={styles.regCard}>
              <View className={styles.regHeader}>
                <Text className={styles.regName}>{reg.performanceName}</Text>
                <StatusTag status={reg.status} />
              </View>
              <View className={styles.regInfo}>
                <View className={styles.regChip}>
                  <Text>🎭 {reg.stageName}</Text>
                </View>
                <View className={styles.regChip}>
                  <Text>📅 {reg.performanceDate}</Text>
                </View>
                <View className={styles.regChip}>
                  <Text>🕐 {reg.startTime}-{reg.endTime}</Text>
                </View>
                <View className={styles.regChip}>
                  <Text>👥 {reg.expectedAudience}人</Text>
                </View>
                <View className={styles.regChip}>
                  <Text>📋 {reg.equipmentList.length}类设备</Text>
                </View>
              </View>
              <View className={styles.regMeta}>
                <Text className={styles.regTime}>主办：{reg.organizer} · {reg.contactPerson}</Text>
                <Text className={styles.regTime}>{formatDateTime(reg.createdAt)}</Text>
              </View>
              {reg.status === 'draft' && (
                <View style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <View
                    style={{
                      padding: '8rpx 32rpx',
                      backgroundColor: 'rgba(45,52,54,0.08)',
                      borderRadius: 999,
                      fontSize: '24rpx',
                      color: '#2D3436'
                    }}
                    onClick={() => handleEditDraft(reg)}
                  >
                    <Text>✏️ 继续编辑</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={{ textAlign: 'center', padding: '80rpx 0' }}>
            <Text style={{ fontSize: '80rpx' }}>📄</Text>
            <Text style={{ fontSize: '28rpx', color: '#86909C', marginTop: '16rpx' }}>
              暂无报批记录
            </Text>
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <View className={classnames(styles.btn, styles.btnPrimary)} onClick={() => setMode('create')}>
          <Text>+ 新建报批</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>报批登记</Text>
        <Text className={styles.subtitle}>填写演出信息及设备清单，提交多级审批</Text>
      </View>

      <View className={styles.modeTabs}>
        <View
          className={classnames(styles.modeTab, { [styles.modeTabActive]: mode === 'list' })}
          onClick={() => setMode('list')}
        >
          <Text>报批列表</Text>
        </View>
        <View
          className={classnames(styles.modeTab, { [styles.modeTabActive]: mode === 'create' })}
          onClick={() => setMode('create')}
        >
          <Text>新建报批</Text>
        </View>
      </View>

      {mode === 'list' ? renderList() : renderCreateForm()}
    </View>
  );
};

export default RegistrationPage;
