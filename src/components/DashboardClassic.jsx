import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, Home, CheckCircle2 } from 'lucide-react-native';
import TimelineGrid from './TimelineGrid';

const DashboardClassic = ({ establishments = [], viewDays, onViewChange, blockedUids = [], onToggleBlock, t, language, localeObj }) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color="#2563eb" />
          <Text style={styles.sectionTitle}>{t('dashboard')}</Text>
        </View>
        
        <TimelineGrid 
          establishments={establishments} 
          days={viewDays} 
          blockedUids={blockedUids}
          onToggleBlock={onToggleBlock}
          t={t}
          localeObj={localeObj}
          theme="light"
        />
      </View>

      <View style={styles.selectorWrapper}>
        <Text style={styles.selectorLabel}>{t('days')}</Text>
        <View style={styles.viewSelector}>
          {[3, 7, 15].map((days) => (
            <TouchableOpacity
              key={days}
              style={[styles.viewButton, viewDays === days && styles.viewButtonActive]}
              onPress={() => onViewChange(days)}
            >
              <Text style={[styles.viewButtonText, viewDays === days && styles.viewButtonTextActive]}>
                {days}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Home size={18} color="#2563eb" />
          <View>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>{t('accommodations')}</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <CheckCircle2 size={18} color="#10b981" />
          <View>
            <Text style={styles.statValue}>{stats.active}</Text>
            <Text style={styles.statLabel}>{t('activeFeeds')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.legendCard}>
         <View style={styles.legendGrid}>
          {[
            { color: '#3b82f6', label: t('arrivee'), tag: t('tagArrivee') },
            { color: '#ef4444', label: t('occupe'), tag: t('tagOccupe') },
            { color: '#f59e0b', label: t('depart'), tag: t('tagDepart') },
            { color: '#8b5cf6', label: t('inOut'), tag: t('tagInOut') }
          ].map((item, idx) => (
            <View key={idx} style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8fafc' },
  headerCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 20, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle: { color: '#1e293b', fontSize: 16, fontWeight: '700' },
  
  selectorWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  selectorLabel: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  viewSelector: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 8, padding: 4 },
  viewButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  viewButtonActive: { backgroundColor: '#fff', elevation: 2 },
  viewButtonText: { color: '#64748b', fontWeight: 'bold', fontSize: 13 },
  viewButtonTextActive: { color: '#2563eb' },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  statValue: { color: '#1e293b', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#64748b', fontSize: 11 },
  
  legendCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendBox: { width: 14, height: 14, borderRadius: 3 },
  legendLabel: { color: '#475569', fontSize: 12, fontWeight: '500' }
});

export default DashboardClassic;
