import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Waves, Compass, Anchor } from 'lucide-react-native';
import TimelineGrid from './TimelineGrid';

const DashboardCoastal = ({ establishments = [], viewDays, onViewChange, blockedUids = [], onToggleBlock, t, language, localeObj }) => {
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
      <View style={styles.hero}>
        <Waves size={28} color="#176963" />
        <View style={styles.heroText}>
          <Text style={styles.heroLabel}>{t('dashboard')}</Text>
          <Text style={styles.heroTitle}>GRINE RM</Text>
        </View>
      </View>

      {/* NO-LINE CONTAINER: Layout via background shades */}
      <View style={styles.mainArea}>
        <TimelineGrid 
          establishments={establishments} 
          days={viewDays} 
          blockedUids={blockedUids}
          onToggleBlock={onToggleBlock}
          t={t}
          localeObj={localeObj}
          theme="coastal"
        />
      </View>

      <View style={styles.controlsArea}>
        <View style={styles.selectorRow}>
          {[3, 7, 15].map((days) => (
            <TouchableOpacity
              key={days}
              style={[styles.coastalBtn, viewDays === days && styles.coastalBtnActive]}
              onPress={() => onViewChange(days)}
            >
              <Text style={[styles.coastalBtnText, viewDays === days && styles.coastalBtnTextActive]}>
                {days} {t('days')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.podSection}>
        <View style={styles.pod}>
          <Compass size={20} color="#7e5700" />
          <Text style={styles.podValue}>{stats.total}</Text>
          <Text style={styles.podLabel}>{t('accommodations')}</Text>
        </View>
        <View style={styles.pod}>
          <Anchor size={20} color="#a63a24" />
          <Text style={styles.podValue}>{stats.active}</Text>
          <Text style={styles.podLabel}>{t('activeFeeds')}</Text>
        </View>
      </View>

      <View style={styles.legendWrap}>
        {[
          { color: '#176963', label: t('arrivee') },
          { color: '#a63a24', label: t('occupe') },
          { color: '#7e5700', label: t('depart') },
          { color: '#5fa8a0', label: t('inOut') }
        ].map((item, idx) => (
          <View key={idx} style={styles.legendNode}>
            <View style={[styles.nodeDot, { backgroundColor: item.color }]} />
            <Text style={styles.nodeLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4', padding: 20 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
  heroText: { flex: 1 },
  heroLabel: { fontSize: 10, fontWeight: 'bold', color: '#6f7977', textTransform: 'uppercase', letterSpacing: 1.5 },
  heroTitle: { fontSize: 24, fontWeight: '700', color: '#1c1c19', fontFamily: 'serif' },
  
  mainArea: { 
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    padding: 12, 
    marginBottom: 20,
    // Ambient Shadow implementation
    shadowColor: '#176963',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  
  controlsArea: { marginBottom: 25 },
  selectorRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  coastalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, backgroundColor: '#f0ede9' },
  coastalBtnActive: { backgroundColor: '#176963' },
  coastalBtnText: { color: '#6f7977', fontWeight: '600', fontSize: 13 },
  coastalBtnTextActive: { color: '#ffffff' },

  podSection: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  pod: { flex: 1, backgroundColor: '#f6f3ee', padding: 20, borderRadius: 20, alignItems: 'center', gap: 8 },
  podValue: { fontSize: 22, fontWeight: 'bold', color: '#1c1c19' },
  podLabel: { fontSize: 11, color: '#6f7977', fontWeight: '600' },

  legendWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center', paddingTop: 10 },
  legendNode: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nodeDot: { width: 12, height: 12, borderRadius: 6 },
  nodeLabel: { fontSize: 12, color: '#1c1c19', fontWeight: '500' }
});

export default DashboardCoastal;
