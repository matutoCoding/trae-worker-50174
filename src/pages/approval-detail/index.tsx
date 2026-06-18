import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/app';
import StatusTag from '@/components/StatusTag';
import ApprovalNodeComponent from '@/components/ApprovalNode';
import { formatDateTime } from '@/utils';
import { EQUIPMENT_CATEGORIES } from '@/types/registration';
import styles from './index.module.scss';

const ApprovalDetailPage: React.FC = () => {
  const router = useRouter();
  const { approvals, registrations, approveNode, rejectNode, resubmitApproval } = useAppStore();
  const approvalId = router.params.id;
  const [rejectReason, setRejectReason] = useState('');

  const flow = useMemo(() => approvals.find((a) => a.id === approvalId), [approvals, approvalId]);
  const registration = useMemo(
    () => registrations.find((r) => r.approvalFlowId === approvalId || r.id === flow?.registrationId),
    [registrations, approvalId, flow]
  );

  const currentNodeIndex = flow?.currentNodeIndex ?? -1;
  const isMyTurn = flow?.overallStatus === 'pending' && currentNodeIndex >= 0 && currentNodeIndex < (flow?.nodes.length ?? 0);
  const isRejected = flow?.overallStatus === 'rejected';

  if (!flow) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyText}>审批记录不存在</Text>
        </View>
      </View>
    );
  }

  const handleApprove = () => {
    Taro.showModal({
      title: '确认通过',
      content: '确定通过此次审批吗？',
      success: (res) => {
        if (res.confirm) {
          approveNode(flow.id, currentNodeIndex);
          Taro.showToast({ title: '审批通过', icon: 'success' });
          console.log('[ApprovalDetail] 通过审批:', flow.id, '节点:', currentNodeIndex);
        }
      }
    });
  };

  const handleReject = () => {
    Taro.showModal({
      title: '驳回审批',
      editable: true,
      placeholderText: '请输入驳回原因，将退回上一步修改',
      success: (res) => {
        if (res.confirm) {
          const reason = res.content || '未填写具体原因';
          rejectNode(flow.id, currentNodeIndex, reason);
          Taro.showToast({ title: '已驳回', icon: 'none' });
          console.log('[ApprovalDetail] 驳回审批:', flow.id, '节点:', currentNodeIndex, '原因:', reason);
        }
      }
    });
  };

  const handleGoEditRegistration = () => {
    if (!registration) return;
    Taro.showModal({
      title: '去修改报批内容',
      content: '将跳转到报批登记页修改演出信息和设备清单，修改完成后再提交审批。',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateTo({
            url: `/pages/registration/index?regId=${registration.id}&approvalId=${flow.id}`
          });
        }
      }
    });
  };

  const handleResubmit = () => {
    Taro.showModal({
      title: '重新提交',
      content: '已根据驳回意见修改完成，确认重新提交审批吗？将从被驳回节点继续。',
      success: (res) => {
        if (res.confirm) {
          resubmitApproval(flow.id);
          Taro.showToast({ title: '已重新提交', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{flow.performanceName}</Text>
        <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text className={styles.subtitle}>审批单号：{flow.id}</Text>
          <StatusTag status={flow.overallStatus} />
        </View>
      </View>

      {isRejected && flow.rejectedFromNode && flow.nodes[currentNodeIndex]?.comment && (
        <View className={styles.rejectSection}>
          <Text className={styles.rejectLabel}>
            ✕ 被 {flow.nodes[currentNodeIndex]?.name} 驳回
          </Text>
          <Text className={styles.rejectContent}>
            驳回原因：{flow.nodes[currentNodeIndex]?.comment}
          </Text>
        </View>
      )}

      {registration && (
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>演出信息</Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>演出名称</Text>
            <Text className={styles.infoValue}>{registration.performanceName}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>演出类型</Text>
            <Text className={styles.infoValue}>{registration.performanceType}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>主办单位</Text>
            <Text className={styles.infoValue}>{registration.organizer}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>联系人</Text>
            <Text className={styles.infoValue}>
              {registration.contactPerson} / {registration.contactPhone}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>演出日期</Text>
            <Text className={styles.infoValue}>
              {registration.performanceDate} {registration.startTime}-{registration.endTime}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>使用舞台</Text>
            <Text className={styles.infoValue}>{registration.stageName}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>预计观众</Text>
            <Text className={styles.infoValue}>{registration.expectedAudience} 人</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>演出内容</Text>
            <Text className={styles.infoValue}>{registration.performanceContent}</Text>
          </View>
          {registration.specialRequirements && (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>特殊需求</Text>
              <Text className={styles.infoValue}>{registration.specialRequirements}</Text>
            </View>
          )}
        </View>
      )}

      {registration && registration.equipmentList.length > 0 && (
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>灯光音响设备清单</Text>
          {EQUIPMENT_CATEGORIES.map((cat) => {
            const items = registration.equipmentList.filter((e) => e.category === cat.key);
            if (items.length === 0) return null;
            return (
              <View key={cat.key} style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: '26rpx', color: '#4E5969', fontWeight: 500, marginBottom: 12 }}>
                  {cat.label}
                </Text>
                <View className={styles.equipmentList}>
                  {items.map((eq) => (
                    <View key={eq.id} className={styles.equipmentItem}>
                      <View>
                        <Text className={styles.equipmentName}>{eq.name}</Text>
                        {eq.specifications && (
                          <Text style={{ fontSize: '22rpx', color: '#86909C', marginTop: 2 }}>
                            {eq.specifications}
                          </Text>
                        )}
                      </View>
                      <Text className={styles.equipmentQty}>
                        × {eq.quantity} {eq.unit}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View className={styles.flowSection}>
        <Text className={styles.sectionTitle}>审批流程</Text>
        {flow.nodes.map((node, idx) => (
          <ApprovalNodeComponent
            key={node.id}
            node={node}
            index={idx}
            isLast={idx === flow.nodes.length - 1}
          />
        ))}
      </View>

      <View className={styles.card}>
        <Text className={styles.sectionTitle}>操作记录</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>提交时间</Text>
          <Text className={styles.infoValue}>{formatDateTime(flow.createdAt)}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>更新时间</Text>
          <Text className={styles.infoValue}>{formatDateTime(flow.updatedAt)}</Text>
        </View>
      </View>

      {isMyTurn && (
        <View className={styles.bottomBar}>
          <View className={classnames(styles.btn, styles.btnReject)} onClick={handleReject}>
            <Text>驳 回</Text>
          </View>
          <View className={classnames(styles.btn, styles.btnApprove)} onClick={handleApprove}>
            <Text>通过审批</Text>
          </View>
        </View>
      )}

      {isRejected && (
        <View className={styles.bottomBar}>
          <View className={classnames(styles.btn, styles.btnReject)} onClick={handleResubmit}>
            <Text>直接重新提交</Text>
          </View>
          <View className={classnames(styles.btn, styles.btnApprove)} onClick={handleGoEditRegistration}>
            <Text>修改内容后再提交</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ApprovalDetailPage;
