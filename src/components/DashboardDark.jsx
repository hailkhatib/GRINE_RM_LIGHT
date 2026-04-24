import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Home } from 'lucide-react-native';
import TimelineGrid from './TimelineGrid';

const DashboardDark = ({ establishments = [], viewDays, onViewChange, blockedUids = [], onToggleBlock, t, language, localeObj, currentTier, onUpgradeRequest }) => {
  const getOccupancyStats = () => {
    let total = 0;
    let active = 0;
    establishments.forEach(est => {
      total += est.apartments?.length || 0;
      active += est.apartments?.filter?.(a => a?.events?.length > 0)?.length || 0;
    });
    return { total, active };
  };

  const stats = getOccupancyStats();

  // FILTER DATA FOR TIERS
  let filteredEst = establishments;
  let isTruncated = false;

  if (currentTier.id === 'LIGHT') {
    if (establishments.length > 0) {
      const firstEst = establishments[0];
      filteredEst = [{ ...firstEst, apartments: (firstEst.apartments || []).slice(0, 1) }];
      if (establishments.length > 1 || (firstEst.apartments || []).length > 1) isTruncated = true;
    }
  } else if (currentTier.id === 'ADVANCED') {
    if (establishments.length > 0) {
      const firstEst = establishments[0];
      filteredEst = [{ ...firstEst, apartments: (firstEst.apartments || []).slice(0, 3) }];
      if (establishments.length > 1 || (firstEst.apartments || []).length > 3) isTruncated = true;
    }
  }

  const handleDayPress = (days) => {
    if (currentTier.allowedDays.includes(days)) {
      onViewChange(days);
    } else {
      const targetTier = days === 15 ? 'PREMIUM' : 'ADVANCED';
      onUpgradeRequest(targetTier);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        <View style={styles.sectionHeader}>
          <Calendar size={18} color="#3b82f6" />
          <Text style={styles.sectionTitle}>{t('dashboard')}</Text>
        </View>
        <TimelineGrid 
          establishments={filteredEst} 
          days={viewDays} 
          blockedUids={blockedUids}
          onToggleBlock={onToggleBlock}
          t={t}
          localeObj={localeObj}
        />
        {isTruncated && (
          <TouchableOpacity style={styles.upgradeBanner} onPress={() => onUpgradeRequest(currentTier.id === 'LIGHT' ? 'ADVANCED' : 'PREMIUM')}>
             <Text style={styles.upgradeBannerText}>
               {currentTier.id === 'LIGHT' 
                 ? "Passer à ADVANCED pour voir plus de logements" 
                 : "Passer à PREMIUM pour voir tous vos établissements"}
             </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.viewSelector}>
        {[3, 7, 15].map((days) => {
          const isAllowed = currentTier.allowedDays.includes(days);
          return (
            <TouchableOpacity
              key={days}
              style={[styles.viewButton, viewDays === days && styles.viewButtonActive, !isAllowed && styles.viewButtonLocked]}
              onPress={() => handleDayPress(days)}
            >
              <Text style={[styles.viewButtonText, viewDays === days && styles.viewButtonTextActive, !isAllowed && styles.viewButtonLockedText]}>
                {days} {t('days')}
              </Text>
              {!isAllowed && <Text style={styles.lockIcon}>🔒</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* LÉGENDE PREMIUM */}
      <View style={styles.legendContainer}>
        {[
          { color: '#3b82f6', label: t('arrivee'), tag: t('tagArrivee') },
          { color: '#ef4444', label: t('occupe'), tag: t('tagOccupe') },
          { color: '#f59e0b', label: t('depart'), tag: t('tagDepart') },
          { color: '#8b5cf6', label: t('inOut'), tag: t('tagInOut') }
        ].map((item, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: item.color }]}>
              <Text style={styles.legendTag}>{item.tag}</Text>
            </View>
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.miniStatCard}>
          <Home size={14} color="#3b82f6" />
          <Text style={styles.miniStatValue}>{stats.total}</Text>
          <Text style={styles.miniStatLabel}>{t('accommodations')}</Text>
        </View>
        <View style={styles.miniStatCard}>
          <View style={[styles.dot, {backgroundColor: stats.active > 0 ? '#10b981' : '#64748b'}]} />
          <Text style={styles.miniStatValue}>{stats.active}</Text>
          <Text style={styles.miniStatLabel}>{t('activeFeeds')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  gridContainer: { backgroundColor: '#1e293b', borderRadius: 16, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  viewSelector: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 10, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  viewButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  viewButtonActive: { backgroundColor: '#3b82f6' },
  viewButtonText: { color: '#94a3b8', fontWeight: '700', fontSize: 12 },
  viewButtonTextActive: { color: '#fff' },
  statsGrid: { flexDirection: 'row', justifyContent: 'center', gap: 25, marginTop: 5, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#334155' },
  miniStatCard: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniStatValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  miniStatLabel: { color: '#64748b', fontSize: 11 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  
  // Styles pour la légende
  legendContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: 15, 
    marginBottom: 20,
    paddingHorizontal: 10
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendBox: { width: 22, height: 22, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  legendTag: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  legendLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  upgradeBanner: { marginTop: 10, padding: 8, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: '#3b82f6', alignItems: 'center' },
  upgradeBannerText: { color: '#3b82f6', fontSize: 10, fontWeight: 'bold' },
  viewButtonLocked: { opacity: 0.6 },
  viewButtonLockedText: { color: '#64748b' },
  lockIcon: { position: 'absolute', top: 2, right: 4, fontSize: 8 }
});

export default DashboardDark;
