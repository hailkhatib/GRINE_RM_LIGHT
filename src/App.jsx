import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RefreshCw, Settings as SettingsIcon } from 'lucide-react-native';
import { format } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import Dashboard from './components/Dashboard';
import AppSettings from './components/AppSettings';
import { getEstablishments, saveEstablishments, fetchCalendarData, getLanguage, saveLanguage, getDashboardVersion, saveDashboardVersion } from './services/api';
import { getTranslation } from './translations';
import { TIERS, CURRENT_TIER_KEY } from './constants/tiers';
import UpgradeModal from './components/UpgradeModal';

const locales = { fr, en: enUS, es };

export default function App() {
  const currentTier = TIERS[CURRENT_TIER_KEY] || TIERS.PREMIUM;
  const [establishments, setEstablishments] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [viewDays, setViewDays] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('fr');
  const [dashboardVersion, setDashboardVersion] = useState('dark');
  const [upgradeTarget, setUpgradeTarget] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const savedLang = await getLanguage();
      // Enforce tier language list
      const finalLang = currentTier.languages.includes(savedLang) ? savedLang : currentTier.languages[0];
      setLanguage(finalLang);

      const savedVersion = await getDashboardVersion();
      // Enforce tier style list
      const finalVersion = currentTier.styles.includes(savedVersion) ? savedVersion : currentTier.styles[0];
      setDashboardVersion(finalVersion);

      const data = await getEstablishments();
      setEstablishments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LoadData error:", error);
      setEstablishments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    const updatedEstablishments = await Promise.all(
      (establishments || []).map(async (est) => {
        const updatedApts = await Promise.all(
          (est.apartments || []).map(async (apt) => {
            if (!apt?.icalUrl) return apt;
            try {
              const events = await fetchCalendarData(apt.icalUrl);
              return { ...apt, events, lastSync: new Date().toISOString() };
            } catch (error) {
              console.error(`Error syncing ${apt.name || 'Unknown'}:`, error);
              return apt;
            }
          })
        );
        return { ...est, apartments: updatedApts };
      })
    );
    setEstablishments(updatedEstablishments);
    await saveEstablishments(updatedEstablishments);
    setIsLoading(false);
  };

  const handleLangChange = async (newLang) => {
    setLanguage(newLang);
    await saveLanguage(newLang);
  };

  const handleVersionChange = async (newVersion) => {
    setDashboardVersion(newVersion);
    await saveDashboardVersion(newVersion);
  };

  const handleRequestUpgrade = (tierKey) => {
    setUpgradeTarget(tierKey);
  };

  const t = (key) => getTranslation(language, key);
  const localeObj = locales[language] || fr;

  if (isLoading && establishments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.brand}>
          <Image source={require('../assets/icon.png')} style={styles.logoImage} />
          <Text style={styles.title}>
            GRINE <Text style={styles.titleAccent}>Management</Text>
          </Text>
          <View style={[styles.tierBadge, { borderColor: currentTier.name === 'PREMIUM' ? '#10b981' : currentTier.name === 'ADVANCED' ? '#3b82f6' : '#64748b' }]}>
            <Text style={[styles.tierBadgeText, { color: currentTier.name === 'PREMIUM' ? '#10b981' : currentTier.name === 'ADVANCED' ? '#3b82f6' : '#64748b' }]}>
                {currentTier.name || 'UNKNOWN'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={refreshAll}
            disabled={isLoading}
          >
            <RefreshCw size={22} color={isLoading ? "#475569" : "#fff"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowSettings(!showSettings)}
          >
            <SettingsIcon size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {showSettings ? (
          <AppSettings
            establishments={establishments}
            onUpdate={(data) => {
              setEstablishments(data);
              saveEstablishments(data);
            }}
            language={language}
            onLangChange={handleLangChange}
            dashboardVersion={dashboardVersion}
            onVersionChange={handleVersionChange}
            t={t}
            currentTier={currentTier}
            onUpgradeRequest={handleRequestUpgrade}
          />
        ) : (
          <Dashboard
            establishments={establishments}
            viewDays={viewDays}
            onViewChange={setViewDays}
            language={language}
            dashboardVersion={dashboardVersion}
            t={t}
            localeObj={localeObj}
            currentTier={currentTier}
            onUpgradeRequest={handleRequestUpgrade}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('lastUpdate')} : {format(new Date(), 'HH:mm', { locale: localeObj })}
        </Text>
      </View>

      <UpgradeModal 
        visible={!!upgradeTarget} 
        onClose={() => setUpgradeTarget(null)} 
        targetTierKey={upgradeTarget}
        t={t}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 10,
  },
  tierBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 8,
    marginTop: 2,
  },
  tierBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  titleAccent: {
    color: '#3b82f6',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
  },
});
