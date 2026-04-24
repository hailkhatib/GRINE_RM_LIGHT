import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Sparkles, Home, Zap } from 'lucide-react-native';
import TimelineGrid from './TimelineGrid';

const DashboardFun = ({ establishments = [], viewDays, onViewChange, blockedUids = [], onToggleBlock, t, language, localeObj }) => {
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
      <View style={styles.header}>
        <Sparkles size={24} color="#f59e0b" />
        <Text style={styles.title}>{t('dashboard')}</Text>
      </View>

      <View style={styles.card}>
        <TimelineGrid 
          establishments={establishments} 
          days={viewDays} 
          blockedUids={blockedUids}
          onToggleBlock={onToggleBlock}
          t={t}
          localeObj={localeObj}
          theme="fun"
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, {backgroundColor: '#dcfce7'}]}>
          <Home size={20} color="#10b981" />
          <Text style={styles.statLarge}>{stats.total}</Text>
          <Text style={styles.statSmall}>{t('accommodations')}</Text>
        </View>
        <View style={[styles.statBox, {backgroundColor: '#fee2e2'}]}>
          <Zap size={20} color="#ef4444" />
          <Text style={styles.statLarge}>{stats.active}</Text>
          <Text style={styles.statSmall}>{t('activeFeeds')}</Text>
        </View>
      </View>

      <View style={styles.selectorCard}>
        {[3, 7, 15].map((days) => (
          <TouchableOpacity
            key={days}
            style={[styles.pill, viewDays === days && styles.pillActive]}
            onPress={() => onViewChange(days)}
          >
            <Text style={[styles.pillText, viewDays === days && styles.pillTextActive]}>
              {days} {t('days')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.legendArea}>
        {[
          { color: '#3b82f6', label: t('arrivee') },
          { color: '#ef4444', label: t('occupe') },
          { color: '#f59e0b', label: t('depart') },
          { color: '#8b5cf6', label: t('inOut') }
        ].map((item, idx) => (
          <View key={idx} style={styles.legendBubble}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff7ed' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '900', color: '#c2410c', textTransform: 'uppercase', letterSpacing: 1 },
  
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 15, 
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#fed7aa',
    shadowColor: '#f97316',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0
  },
  
  statsContainer: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  statBox: { flex: 1, padding: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statLarge: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginTop: 5 },
  statSmall: { fontSize: 10, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' },

  selectorCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 8, borderRadius: 50, marginBottom: 25, borderWidth: 2, borderColor: '#fdba74' },
  pill: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 50 },
  pillActive: { backgroundColor: '#f97316' },
  pillText: { fontSize: 13, fontWeight: '800', color: '#f97316' },
  pillTextActive: { color: '#fff' },

  legendArea: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  legendBubble: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#ffedd5' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontWeight: '700', color: '#7c2d12' }
});

export default DashboardFun;
