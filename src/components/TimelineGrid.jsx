import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Info, ShieldAlert, UserCheck } from 'lucide-react-native';
import { getStatusForDate } from '../utils/calendarUtils';

const TimelineGrid = ({ establishments = [], days = 7, blockedUids = [], onToggleBlock, t, localeObj, theme = 'dark' }) => {
  const [selectedInfo, setSelectedInfo] = useState(null);
  const startDate = new Date();
  const dateRange = Array.from({ length: days }, (_, i) => addDays(startDate, i));

  const getStatusConfig = (status) => {
    switch (status) {
      case 'occupe': return { color: theme === 'coastal' ? '#a63a24' : '#ef4444', label: t ? t('tagOccupe') : 'O' };
      case 'arrivee': return { color: theme === 'coastal' ? '#176963' : '#3b82f6', label: t ? t('tagArrivee') : 'E' };
      case 'depart': return { color: theme === 'coastal' ? '#7e5700' : '#f59e0b', label: t ? t('tagDepart') : 'S' };
      case 'depart-arrivee': return { color: theme === 'coastal' ? '#5fa8a0' : '#8b5cf6', label: t ? t('tagInOut') : 'ES' };
      case 'ferme': return { color: '#475569', label: '' };
      default: return { color: 'transparent', label: '-' };
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'classic': return {
        gridBg: '#fff',
        cellBorder: '#e2e8f0',
        labelCellBg: '#f8fafc',
        weekendBg: '#f1f5f9',
        textMain: '#1e293b',
        textMuted: '#64748b',
        estHeaderBg: '#2563eb'
      };
      case 'fun': return {
        gridBg: '#fff',
        cellBorder: '#fed7aa',
        labelCellBg: '#fff7ed',
        weekendBg: '#ffedd5',
        textMain: '#7c2d12',
        textMuted: '#9a3412',
        estHeaderBg: '#f97316'
      };
      case 'coastal': return {
        gridBg: '#fff',
        cellBorder: '#f0ede9',
        labelCellBg: '#fcf9f4',
        weekendBg: '#f6f3ee',
        textMain: '#1c1c19',
        textMuted: '#6f7977',
        estHeaderBg: '#176963'
      };
      case 'dark':
      default: return {
        gridBg: '#0f172a',
        cellBorder: '#334155',
        labelCellBg: '#1e293b',
        weekendBg: '#334155',
        textMain: '#fff',
        textMuted: '#64748b',
        estHeaderBg: '#3b82f6'
      };
    }
  };

  const tStyles = getThemeStyles();

  const handlePress = (date, apt) => {
    const targetStr = format(date, 'yyyy-MM-dd');
    const dayEvents = apt.events.filter(e => targetStr >= e.startDate && targetStr < e.endDate);
    const departures = apt.events.filter(e => e.endDate === targetStr);
    
    setSelectedInfo({
      date,
      aptName: apt.name,
      events: [...dayEvents, ...departures]
    });
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.grid, { backgroundColor: tStyles.gridBg }]}>
          <View style={styles.row}>
            <View style={[styles.cell, styles.labelCell, { backgroundColor: tStyles.labelCellBg, borderColor: tStyles.cellBorder }]}>
              <Text style={[styles.labelText, { color: tStyles.textMuted }]}>{t ? t('appt') : 'APPT'}</Text>
            </View>
            {dateRange.map((date, i) => {
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <View key={i} style={[styles.cell, { borderColor: tStyles.cellBorder, backgroundColor: isWeekend ? tStyles.weekendBg : 'transparent' }]}>
                  <Text style={[styles.dateText, { color: tStyles.textMain }]}>{format(date, 'dd')}</Text>
                  <Text style={[styles.dayText, { color: tStyles.textMuted }]}>{format(date, 'EE', { locale: localeObj })}</Text>
                </View>
              );
            })}
          </View>

          {establishments.map((est) => (
            <React.Fragment key={est.id}>
              {/* En-tête de l'établissement */}
              <View style={[styles.establishmentHeaderRow, { backgroundColor: tStyles.estHeaderBg }]}>
                 <Text style={styles.establishmentHeaderText}>{est.name}</Text>
              </View>

              {/* Liste des appartements de l'établissement */}
              {(est.apartments || []).map((apt) => (
                <View key={apt.id} style={styles.row}>
                  <View style={[styles.cell, styles.labelCell, { backgroundColor: tStyles.labelCellBg, borderColor: tStyles.cellBorder }]}>
                    <Text style={[styles.aptName, { color: tStyles.textMain }]} numberOfLines={1}>{apt.name}</Text>
                  </View>
                  {dateRange.map((date, i) => {
                    const status = getStatusForDate(date, apt.events, blockedUids);
                    const config = getStatusConfig(status);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    
                    return (
                      <TouchableOpacity 
                        key={i} 
                        onPress={() => handlePress(date, apt)}
                        style={[
                          styles.cell, 
                          { 
                            backgroundColor: config.color === 'transparent' ? (isWeekend ? tStyles.weekendBg : 'transparent') : config.color, 
                            borderColor: tStyles.cellBorder 
                          }
                        ]}
                        activeOpacity={0.6}
                      >
                        <Text style={styles.statusLabel}>{config.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>

      {/* MODAL DE DETAILS PRÉMIUM */}
      <Modal
        visible={!!selectedInfo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedInfo(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setSelectedInfo(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: tStyles.labelCellBg, borderColor: tStyles.cellBorder }]} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Info size={18} color={tStyles.estHeaderBg} />
                <Text style={[styles.modalTitle, { color: tStyles.textMain }]}>{t ? t('details') : 'Détails du jour'}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedInfo(null)}>
                <X size={24} color={tStyles.textMuted} />
              </TouchableOpacity>
            </View>

            {selectedInfo && (
              <ScrollView style={styles.modalBody}>
                <Text style={[styles.modalInfoDate, { color: tStyles.estHeaderBg }]}>
                    {format(selectedInfo.date, 'EEEE d MMMM yyyy', { locale: localeObj })}
                </Text>
                <Text style={[styles.modalInfoApt, { color: tStyles.textMain }]}>{selectedInfo.aptName}</Text>

                {selectedInfo.events.length === 0 ? (
                  <Text style={styles.noEventText}>{t ? t('free') : "Libre / Pas d'événement"}</Text>
                ) : (
                  selectedInfo.events.map((e, idx) => {
                    const isManualBlocked = blockedUids.includes(e.uid);
                    return (
                      <View key={idx} style={styles.eventItem}>
                        <View style={styles.eventCardHeader}>
                            <Text style={styles.summaryText}>{e.summary}</Text>
                            <View style={[styles.typeBadge, { backgroundColor: isManualBlocked ? '#475569' : '#10b981' }]}>
                                <Text style={styles.typeBadgeText}>{isManualBlocked ? (t ? t('blocked') || 'BLOQUÉ' : 'BLOQUÉ') : (t ? t('reservation') : 'RÉSERVATION')}</Text>
                            </View>
                        </View>
                        <Text style={styles.timeText}>{t ? t('from') : 'Du'} {e.startDate} {t ? t('to') : 'au'} {e.endDate}</Text>
                        
                        <View style={styles.buttonGroup}>
                            {!isManualBlocked ? (
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.blockButton]} 
                                    onPress={() => {
                                        onToggleBlock(e.uid);
                                        setSelectedInfo(null);
                                    }}
                                >
                                    <ShieldAlert size={16} color="#fff" />
                                    <Text style={styles.actionButtonText}>C'est un blocage (B)</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.unblockButton]} 
                                    onPress={() => {
                                        onToggleBlock(e.uid);
                                        setSelectedInfo(null);
                                    }}
                                >
                                    <UserCheck size={16} color="#fff" />
                                    <Text style={styles.actionButtonText}>C'est un client (E/S)</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                      </View>
                    );
                  })
                )}
              </ScrollView>
            )}
            
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedInfo(null)}>
                <Text style={styles.closeBtnText}>{t ? t('close') : 'Fermer'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'column', backgroundColor: '#0f172a' },
  establishmentHeaderRow: { 
    flexDirection: 'row', 
    backgroundColor: '#3b82f6', 
    paddingVertical: 4, 
    paddingHorizontal: 10,
    marginTop: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  establishmentHeaderText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: 'bold', 
    textTransform: 'uppercase' 
  },
  row: { flexDirection: 'row' },
  cell: { width: 46, height: 55, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#334155' },
  labelCell: { width: 110, alignItems: 'flex-start', paddingLeft: 10, backgroundColor: '#1e293b' },
  labelText: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  aptName: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  dateText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  dayText: { color: '#64748b', fontSize: 9, textTransform: 'uppercase' },
  statusLabel: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', borderRadius: 24, width: '100%', maxWidth: 400, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalBody: { maxHeight: 400 },
  modalInfoDate: { color: '#3b82f6', fontSize: 14, fontWeight: 'bold', textTransform: 'capitalize' },
  modalInfoApt: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  noEventText: { color: '#64748b', fontStyle: 'italic', marginVertical: 20 },
  eventItem: { backgroundColor: '#0f172a', padding: 15, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  eventCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  summaryText: { color: '#fff', fontSize: 14, fontWeight: 'bold', flex: 1, marginRight: 10 },
  timeText: { color: '#94a3b8', fontSize: 12, marginBottom: 15 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  buttonGroup: { marginTop: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 10 },
  blockButton: { backgroundColor: '#ef4444' },
  unblockButton: { backgroundColor: '#10b981' },
  actionButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  closeBtn: { marginTop: 10, padding: 15, alignItems: 'center' },
  closeBtnText: { color: '#64748b', fontWeight: 'bold' }
});

export default TimelineGrid;
