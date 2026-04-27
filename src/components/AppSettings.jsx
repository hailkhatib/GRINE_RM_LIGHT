import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, Image, Modal } from 'react-native';
import { Save, Plus, Trash2, Link as LinkIcon, Building, Layout, Info, X, HelpCircle } from 'lucide-react-native';

const AppSettings = ({ establishments, onUpdate, language, onLangChange, dashboardVersion, onVersionChange, t, currentTier, onUpgradeRequest }) => {
   const [localEstablishments, setLocalEstablishments] = useState(establishments || []);
  const [isSaving, setIsSaving] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Etablissement actions
  const handleEstChange = (id, field, value) => {
    setLocalEstablishments(prev => prev.map(est => est.id === id ? { ...est, [field]: value } : est));
  };

  const handleLangPress = (targetLang) => {
    if (currentTier.languages.includes(targetLang)) {
      onLangChange(targetLang);
    } else {
      onUpgradeRequest('ADVANCED');
    }
  };

  const handleVersionPress = (targetVersion) => {
    if (currentTier.styles.includes(targetVersion)) {
      onVersionChange(targetVersion);
    } else {
      const targetTier = ['fun', 'coastal'].includes(targetVersion) ? 'PREMIUM' : 'ADVANCED';
      onUpgradeRequest(targetTier);
    }
  };

  const handleAddEst = () => {
    const newId = `est_${Date.now()}`;
    setLocalEstablishments([...localEstablishments, { id: newId, name: t('createEst'), apartments: [] }]);
  };

  const handleRemoveEst = (id) => {
    const proceed = () => setLocalEstablishments(localEstablishments.filter(e => e.id !== id));
    if (Platform.OS === 'web') {
      if (window.confirm(t('alertDelEstMsg'))) proceed();
    } else {
      Alert.alert(t('alertDelEstTitle'), t('alertDelEstMsg'), [
        { text: t('no'), style: "cancel" },
        { text: t('yesDel'), style: "destructive", onPress: proceed }
      ]);
    }
  };

  // Apartment actions
  const handleAptChange = (estId, aptId, field, value) => {
    setLocalEstablishments(prev => prev.map(est => {
      if (est.id !== estId) return est;
      return {
        ...est,
        apartments: est.apartments.map(apt => apt.id === aptId ? { ...apt, [field]: value } : apt)
      };
    }));
  };

  const handleAddApt = (estId) => {
    const newId = `apt_${Date.now()}`;
    setLocalEstablishments(prev => prev.map(est => {
      if (est.id !== estId) return est;
      return {
        ...est,
        apartments: [...(est.apartments || []), { id: newId, name: t('aptNamePH'), icalUrl: '', events: [] }]
      };
    }));
  };

  const handleRemoveApt = (estId, aptId) => {
    const proceed = () => {
      setLocalEstablishments(prev => prev.map(est => {
        if (est.id !== estId) return est;
        return { ...est, apartments: est.apartments.filter(a => a.id !== aptId) };
      }));
    };
    if (Platform.OS === 'web') {
      if (window.confirm(t('alertDelAptMsg'))) proceed();
    } else {
      Alert.alert(t('alertDelEstTitle'), t('alertDelAptMsg'), [
        { text: t('no'), style: "cancel" },
        { text: t('yesDel'), style: "destructive", onPress: proceed }
      ]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(localEstablishments);
      setIsSaving(false);
    }, 500);
  };

  return (
    <ScrollView style={styles.outerContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        
        {/* LIGNE DE RÉGLAGES (LANGUE + STYLE) */}
        <View style={styles.topControlsRow}>
          <View style={styles.controlSection}>
             <View style={styles.languageSelector}>
              {['fr', 'en', 'es'].map(lang => {
                const isAllowed = currentTier.languages.includes(lang);
                return (
                  <TouchableOpacity 
                    key={lang} 
                    style={[styles.langBtn, language === lang && styles.langBtnActive, !isAllowed && styles.langBtnLocked]}
                    onPress={() => handleLangPress(lang)}
                  >
                    <Image 
                      source={{ uri: lang === 'fr' ? 'https://flagcdn.com/w40/fr.png' : lang === 'en' ? 'https://flagcdn.com/w40/gb.png' : 'https://flagcdn.com/w40/es.png' }} 
                      style={[styles.flagIcon, !isAllowed && { opacity: 0.4 }]}
                    />
                    {!isAllowed && <Text style={styles.itemLockIcon}>🔒</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.controlSection}>
            <View style={styles.versionSelector}>
              <Text style={styles.styleLabel}>{t('styleTitle')} :</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.versionScroll}>
                {[
                  { id: 'dark', label: t('vDark') },
                  { id: 'classic', label: t('vClassic') },
                  { id: 'fun', label: t('vFun') },
                  { id: 'coastal', label: t('vCoastal') }
                ].map(v => {
                  const isAllowed = currentTier.styles.includes(v.id);
                  return (
                    <TouchableOpacity 
                      key={v.id} 
                      style={[styles.versionBtn, dashboardVersion === v.id && styles.versionBtnActive, !isAllowed && styles.versionBtnLocked]}
                      onPress={() => handleVersionPress(v.id)}
                    >
                      <Text style={[styles.versionBtnText, dashboardVersion === v.id && styles.versionBtnTextActive, !isAllowed && styles.versionBtnLockedText]}>
                        {v.label}
                      </Text>
                      {!isAllowed && <Text style={styles.itemLockIcon}>🔒</Text>}
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settingsTitle')}</Text>
          <Text style={styles.headerSubtitle}>{t('settingsSubtitle')}</Text>
        </View>
        
        {localEstablishments.map((est) => (
          <View key={est.id} style={styles.estCard}>
            <View style={styles.estHeader}>
              <View style={styles.estBadge}>
                <Building size={16} color="#fff" />
              </View>
              <TextInput
                style={styles.estNameInput}
                placeholder={t('estNamePH')}
                placeholderTextColor="#64748b"
                value={est.name}
                onChangeText={(text) => handleEstChange(est.id, 'name', text)}
              />
              <TouchableOpacity onPress={() => handleRemoveEst(est.id)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Trash2 size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>

            {/* Liste des appartements */}
            <View style={styles.aptsContainer}>
              {(est.apartments || []).map((apt, index) => (
                <View key={apt.id} style={styles.aptCard}>
                  <View style={styles.aptHeader}>
                    <Text style={styles.aptIndex}>{t('logement')} {index + 1}</Text>
                    <TouchableOpacity onPress={() => handleRemoveApt(est.id, apt.id)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                      <Trash2 size={18} color="#f87171" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.fieldSection}>
                    <TextInput
                      style={styles.nameInput}
                      placeholder={t('aptNamePH')}
                      placeholderTextColor="#64748b"
                      value={apt.name}
                      onChangeText={(text) => handleAptChange(est.id, apt.id, 'name', text)}
                    />
                  </View>
                  <View style={styles.fieldSection}>
                    <Text style={styles.inputLabel}>{t('icalLabel')}</Text>
                    <View style={styles.urlContainer}>
                      <LinkIcon size={14} color="#3b82f6" style={styles.urlIcon} />
                      <TextInput
                        style={styles.urlInput}
                        placeholder={t('urlPH')}
                        placeholderTextColor="#475569"
                        value={apt.icalUrl}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(text) => handleAptChange(est.id, apt.id, 'icalUrl', text)}
                      />
                    </View>
                  </View>
                </View>
              ))}

              {(est.apartments || []).length < currentTier.maxApt ? (
                <TouchableOpacity style={styles.addAptButton} onPress={() => handleAddApt(est.id)}>
                  <Plus size={16} color="#10b981" />
                  <Text style={styles.addAptButtonText}>{t('addApt')}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.limitReachedBox} onPress={() => onUpgradeRequest(currentTier.id === 'LIGHT' ? 'ADVANCED' : 'PREMIUM')}>
                   <Text style={styles.limitReachedText}>{t('maxAptReached').replace('{max}', currentTier.maxApt).replace('{tier}', currentTier.id === 'LIGHT' ? 'ADVANCED' : 'PREMIUM')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {localEstablishments.length < currentTier.maxEst ? (
          <TouchableOpacity style={styles.addEstButton} onPress={handleAddEst}>
            <Building size={20} color="#3b82f6" />
            <Text style={styles.addEstButtonText}>{t('createEst')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.addEstButton, styles.disabledButton]} onPress={() => onUpgradeRequest('PREMIUM')}>
             <Building size={20} color="#64748b" />
             <Text style={[styles.addEstButtonText, { color: '#64748b' }]}>{t('maxEstReached').replace('{max}', currentTier.maxEst)}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footerActions}>
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Save size={22} color="#fff" />
                <Text style={styles.saveButtonText}>{t('save')}</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={() => {
              const reset = () => onUpdate([]);
              if (Platform.OS === 'web') {
                if (window.confirm(t('alertResetWeb'))) reset();
              } else {
                Alert.alert(
                  t('alertResetTitle'), 
                  t('alertResetMsg'), 
                  [{ text: t('cancel'), style: "cancel" }, { text: t('yesReset'), style: "destructive", onPress: reset }]
                );
              }
            }}
          >
            <Text style={styles.resetButtonText}>{t('resetDB')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpLink} onPress={() => setShowHelp(true)}>
            <HelpCircle size={16} color="#64748b" />
            <Text style={styles.helpLinkText}>{t('helpIcalLink')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.copyrightFooter}>
          <Text style={styles.copyrightText}>©ColoursProd v2.3</Text>
        </View>

        {/* MODAL D'AIDE ICAL */}
        <Modal visible={showHelp} transparent animationType="fade" onRequestClose={() => setShowHelp(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.helpModal}>
              <View style={styles.helpHeader}>
                <Text style={styles.helpTitle}>{t('helpIcalTitle')}</Text>
                <TouchableOpacity onPress={() => setShowHelp(false)}>
                  <X size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.helpContent}>
                <Text style={styles.helpText}>{t('helpIcalBody')}</Text>
              </ScrollView>
              <TouchableOpacity style={styles.closeHelpBtn} onPress={() => setShowHelp(false)}>
                <Text style={styles.closeHelpBtnText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#0f172a' },
  container: { padding: 15 },
  
  // Header & Controls
  topControlsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#1e293b', 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155'
  },
  controlSection: { flexShrink: 0 },
  languageSelector: { flexDirection: 'row', gap: 8 },
  langBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155' },
  langBtnActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  flagIcon: { width: 22, height: 16, borderRadius: 2 },
  itemLockIcon: { position: 'absolute', top: -2, right: -2, fontSize: 8 },
  langBtnLocked: { opacity: 0.5 },
  langBtnTextActive: { }, 

  versionSelector: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginLeft: 15 },
  versionScroll: { gap: 6, paddingRight: 10 },
  styleLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  versionBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155' },
  versionBtnLocked: { opacity: 0.5 },
  versionBtnActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  versionBtnText: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
  versionBtnLockedText: { color: '#475569' },
  versionBtnTextActive: { color: '#fff' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, justifyContent: 'center' },
  sectionSubTitle: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },

  header: { marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#64748b', fontSize: 13, marginTop: 4 },
  
  // Style Etablissement
  estCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  estHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 15,
  },
  estBadge: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  estNameInput: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Style Appartement
  aptsContainer: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#334155',
  },
  aptCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  aptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aptIndex: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fieldSection: { marginBottom: 10 },
  nameInput: {
    backgroundColor: '#1e293b',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  urlIcon: { marginRight: 8 },
  urlInput: {
    flex: 1,
    color: '#94a3b8',
    paddingVertical: 8,
    fontSize: 11,
  },

  // Boutons
  addAptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10b981',
    gap: 8,
    marginBottom: 10,
  },
  addAptButtonText: { color: '#10b981', fontWeight: 'bold', fontSize: 12 },
  limitReachedBox: { padding: 10, alignItems: 'center' },
  limitReachedText: { color: '#64748b', fontSize: 10, fontStyle: 'italic' },
  
  addEstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3b82f6',
    gap: 10,
    marginBottom: 30,
  },
  addEstButtonText: { color: '#3b82f6', fontWeight: 'bold', fontSize: 14 },
  
  footerActions: { gap: 15, marginBottom: 60 },
  saveButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    gap: 12,
    elevation: 8,
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resetButton: { alignItems: 'center', padding: 10 },
  resetButtonText: { color: '#ef4444', fontSize: 12, textDecorationLine: 'underline' },
  
  inputLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold', marginBottom: 5, marginLeft: 2 },
  helpLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 },
  helpLinkText: { color: '#64748b', fontSize: 13, textDecorationLine: 'underline' },

  copyrightFooter: { marginTop: 40, alignItems: 'center', paddingBottom: 20 },
  copyrightText: { color: '#334155', fontSize: 12, fontWeight: '500' },

  // Help Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  helpModal: { backgroundColor: '#1e293b', borderRadius: 24, width: '100%', maxWidth: 500, padding: 25, borderSize: 1, borderColor: '#334155', maxHeight: '80%' },
  helpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  helpTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  helpContent: { marginBottom: 20 },
  helpText: { color: '#cbd5e1', fontSize: 15, lineHeight: 22 },
  closeHelpBtn: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 12, alignItems: 'center' },
  closeHelpBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default AppSettings;
