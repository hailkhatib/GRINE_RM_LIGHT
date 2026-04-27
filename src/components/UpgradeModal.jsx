import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, Linking } from 'react-native';
import { ShoppingCart, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react-native';
import { TIERS } from '../constants/tiers';

const UpgradeModal = ({ visible, onClose, targetTierKey, t }) => {
  const tier = TIERS[targetTierKey] || TIERS.ADVANCED;

  const handleBuy = () => {
    if (Platform.OS === 'web') {
      window.open(tier.buyLink, '_blank');
    } else {
      Linking.openURL(tier.buyLink);
    }
  };

  const getBenefits = () => {
    if (targetTierKey === 'ADVANCED') {
      return [
        t('benefitAdv1'),
        t('benefitAdv2'),
        t('benefitAdv3'),
        t('benefitAdv4')
      ];
    }
    return [
      t('benefitPrem1'),
      t('benefitPrem2'),
      t('benefitPrem3'),
      t('benefitPrem4')
    ];
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: targetTierKey === 'PREMIUM' ? '#10b981' : '#3b82f6' }]}>
               {targetTierKey === 'PREMIUM' ? <Zap size={32} color="#fff" /> : <ShieldCheck size={32} color="#fff" />}
            </View>
            <Text style={styles.title}>{t('upgradeTitle').replace('{tier}', tier.name)}</Text>
            <Text style={styles.subtitle}>{t('upgradeSubtitle')}</Text>
          </View>

          <View style={styles.benefitsList}>
            {getBenefits().map((benefit, i) => (
              <View key={i} style={styles.benefitItem}>
                <CheckCircle2 size={18} color="#10b981" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.buyButton, { backgroundColor: targetTierKey === 'PREMIUM' ? '#059669' : '#2563eb' }]} onPress={handleBuy}>
            <ShoppingCart size={20} color="#fff" />
            <Text style={styles.buyButtonText}>{t('buyVersion').replace('{tier}', tier.name)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t('notNow')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: { backgroundColor: '#1e293b', borderRadius: 30, padding: 25, width: '100%', maxWidth: 400, borderWidth: 1, borderColor: '#334155' },
  closeIcon: { position: 'absolute', right: 20, top: 20, zIndex: 10 },
  header: { alignItems: 'center', marginBottom: 30 },
  iconContainer: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 13, marginTop: 5, textAlign: 'center' },
  benefitsList: { marginBottom: 35, gap: 15 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitText: { color: '#f1f5f9', fontSize: 15, fontWeight: '500' },
  buyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 18, borderRadius: 16, marginBottom: 15 },
  buyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { alignItems: 'center', padding: 10 },
  cancelButtonText: { color: '#64748b', fontSize: 14, fontWeight: 'bold' }
});

export default UpgradeModal;
